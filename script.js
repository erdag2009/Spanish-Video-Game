const DAMAGE_PER_MILITARY_UNIT = 5;
const DAMAGE_ON_WRONG_ANSWER = 10;
const DAMAGE_BOOST = 2;

let currentTurn = 1;
let playerHealth = { 1: 100, 2: 100 };
let playerMilitary = { 1: 3, 2: 3 };
let playerUpgrades = { 1: {}, 2: {} };
let currentQuestion = null;
let coins = 100;
let isSinglePlayer = false;
let isMultiplayer = false;
let playerShield = { 1: 0, 2: 0 };
let playerDefense = { 1: 0, 2: 0 };
let consecutiveCorrectAnswers = 0;
let firstTry = true;
let opponentReady = false;

const items = {
    // Upgrades
    soldier: {
        cost: 50,
        effect: "military",
        value: 1,  // Adds +1 military
        description: "Soldier: Adds 1 military unit to your army."
    },
    knight: {
        cost: 100,
        effect: "military",
        value: 2,  // Adds +2 military
        description: "Knight: Adds 2 military units to your army."
    },
    warElephant: {
        cost: 150,
        effect: "military",
        value: 3,  // Adds +3 military
        description: "War Elephant: Adds 3 military units to your army."
    },
    armoredWarBears: {
        cost: 200,
        effect: "military",
        value: 4,  // Adds +4 military
        description: "Armored War Bears: Adds 4 military units to your army."
    },
    tradingCart: {
        cost: 75,
        effect: "funds",
        value: 5,  // Adds 5 funds all future turns
        description: "Trading Cart: Generates 5 additional funds for all future turns."
    },
    business: {
        cost: 150,
        effect: "funds",
        value: 10,  // Adds 10 funds all future turns
        description: "Business: Generates 10 additional funds for all future turns."
    },
    witch: {
        cost: 50,
        effect: "reroll",
        value: null,  // Single use, lets you reroll your move options
        description: "Witch: Single use item that lets you reroll your current move options."
    },

    // Offense
    dayAttack: {
        cost: 100,
        effect: "offense",
        value: 5,  // 5% damage per military
        description: "Day Attack: Deal 5% damage per military (x5, 5 possible questions)."
    },
    nightAttack: {
        cost: 120,
        effect: "offense",
        value: 5,  // 5% damage per military, immune to watch tower
        description: "Night Attack: Deal 5% damage per military and immune to watch tower (x3, 3 possible questions)."
    },
    siege: {
        cost: 130,
        effect: "offense",
        value: 10,  // 10% damage per military, lose 2 military
        description: "Siege: Deal 10% damage per military but lose 2 military."
    },
    cannon: {
        cost: 200,
        effect: "offense",
        value: 20,  // 20% damage regardless of military
        description: "Cannon: Deal 20% damage regardless of military."
    },
    catapult: {
        cost: 180,
        effect: "offense",
        value: 10,  // 10% damage regardless of military (x2, 2 possible questions)
        description: "Catapult: Deal 10% damage regardless of military (x2, 2 possible questions)."
    },
    spyAttack: {
        cost: 150,
        effect: "offense",
        value: 5,  // 5% damage per enemy military
        description: "Spy Attack: Deals 5% damage for each enemy military (x2, 2 possible questions)."
    },
    fire: {
        cost: 100,
        effect: "offense",
        value: null,  // Removes half of remaining enemy health
        description: "Fire: Removes half of remaining enemy health."
    },

    // Defense & Healing
    trap: {
        cost: 75,
        effect: "defense",
        value: 15,  // 15% chance of stopping future enemy attacks
        description: "Trap: 15% chance of stopping future enemy attacks. Effect ends when it stops an attack."
    },
    wallRepair: {
        cost: 60,
        effect: "healing",
        value: 20,  // Heals 20% immediately
        description: "Wall Repair: Immediately heals 20% of your health."
    },
    shields: {
        cost: 80,
        effect: "defense",
        value: 10,  // Blocks 10% damage for all attacks
        description: "Shields: Blocks 10% damage for all attacks."
    }
};

function startGame() {
    const urlParams = new URLSearchParams(window.location.search);
    isSinglePlayer = urlParams.get('mode') === 'single';
    isMultiplayer = urlParams.get('mode') === 'multiplayer';

    if (isSinglePlayer) {
        askQuestion();
    } else if (isMultiplayer) {
        startMultiplayerMatch();
    }
}

function startMultiplayerMatch() {
    console.log("Searching for players...");
    document.getElementById("searching").style.display = "block";
    searchForPlayers();
}

function searchForPlayers() {
    console.log("Matching players...");
    setTimeout(() => {
        console.log("Player found! Starting the match.");
        document.getElementById("searching").style.display = "none";
        opponentReady = true;
        askQuestion();
    }, 2000); // Simulate delay in matching
}

function askQuestion() {
    const categories = Object.keys(questions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedCategory = questions[randomCategory];

    const randomIndex = Math.floor(Math.random() * selectedCategory.length);
    currentQuestion = selectedCategory[randomIndex];

    document.getElementById("question-text").textContent = currentQuestion.question;
    document.getElementById("answer").value = "";
    firstTry = true;

    if (isSinglePlayer) {
        npcTurn();
    }
}

function submitAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();

    if (userAnswer === currentQuestion.answer.toLowerCase()) {
        attackOpponent();
        document.getElementById("result").textContent = "✅ Correct! Attack successful.";
        consecutiveCorrectAnswers++;

        if (firstTry) {
            coins += 10; // Increase coins on correct answer on first try
        } else {
            coins += 10; // Still give coins on the second try if correct
        }

        firstTry = false;
    } else {
        if (firstTry) {
            alert("❌ Incorrect! Try again.");
            firstTry = false;
        } else {
            alert(`❌ Incorrect! The correct answer was: ${currentQuestion.answer}`);
            takeDamage();
            document.getElementById("result").textContent = "❌ Incorrect! Opponent attacks.";
            consecutiveCorrectAnswers = 0; // Reset consecutive correct answers on wrong answer
        }
    }

    updateUI();
    setTimeout(() => {
        if (isSinglePlayer && currentTurn === 2) {
            npcTurn();
        } else if (isMultiplayer && opponentReady) {
            npcTurn();
        } else {
            askQuestion();
        }
    }, 1000);
}

function npcTurn() {
    setTimeout(() => {
        console.log("NPC's turn to attack!");
        attackOpponent();
        updateUI();
        checkGameOver();

        sendMessage({
            type: 'gameStateUpdate',
            playerHealth,
            playerMilitary,
            coins,
            currentTurn,
            playerShield,
            playerDefense,
            consecutiveCorrectAnswers
        });

        askQuestion();
    }, 1000); // NPC takes time to answer (simulated delay)
}

function attackOpponent() {
    let damage = playerMilitary[currentTurn] * DAMAGE_PER_MILITARY_UNIT;
    if (playerUpgrades[currentTurn]?.attackBoost) {
        damage += DAMAGE_BOOST;
    }

    let opponent = currentTurn === 1 ? 2 : 1;
    damage = applyDefense(opponent, damage);
    damage = applyShield(opponent, damage);
    playerHealth[opponent] = Math.max(0, playerHealth[opponent] - damage);

    updateUI();
    checkGameOver();

    sendMessage({
        type: 'gameStateUpdate',
        playerHealth,
        playerMilitary,
        coins,
        currentTurn,
        playerShield,
        playerDefense,
        consecutiveCorrectAnswers
    });
}

function takeDamage() {
    let damage = DAMAGE_ON_WRONG_ANSWER;
    damage = applyDefense(currentTurn, damage);
    damage = applyShield(currentTurn, damage);
    playerHealth[currentTurn] = Math.max(0, playerHealth[currentTurn] - damage);
    
    updateUI();
    checkGameOver();

    sendMessage({
        type: 'gameStateUpdate',
        playerHealth,
        playerMilitary,
        coins,
        currentTurn,
        playerShield,
        playerDefense,
        consecutiveCorrectAnswers
    });
}

function applyDefense(player, damage) {
    if (playerDefense[player] > 0) {
        const reducedDamage = damage * (1 - (playerDefense[player] / 100));
        return reducedDamage;
    }
    return damage;
}

function applyShield(player, damage) {
    if (playerShield[player] > 0) {
        const shieldReduction = damage * (playerShield[player] / 100);
        return damage - shieldReduction;
    }
    return damage;
}

function checkGameOver() {
    if (playerHealth[1] <= 0 || playerHealth[2] <= 0) {
        displayGameOver();
    }
}

function displayGameOver() {
    if (playerHealth[1] <= 0) {
        alert("Player 2 wins!");
    } else if (playerHealth[2] <= 0) {
        alert("Player 1 wins!");
    }
    window.location.reload(); // reload page to reset the game
}

function updateUI() {
    document.getElementById("player-health").textContent = `Player 1 Health: ${playerHealth[1]}%`;
    document.getElementById("opponent-health").textContent = `Player 2 Health: ${playerHealth[2]}%`;
    document.getElementById("coins").textContent = `Coins: ${coins}`;
    document.getElementById("turn").textContent = `Turn: ${currentTurn}`;

    document.getElementById("items").textContent = `Items: ${JSON.stringify(items)}`;

    // Update defense and shield statuses
    document.getElementById("shield-status").textContent = `Shield: ${playerShield[currentTurn]}%`;
    document.getElementById("defense-status").textContent = `Defense: ${playerDefense[currentTurn]}%`;
}

function sendMessage(message) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("p");
    messageElement.textContent = `Message: ${JSON.stringify(message)}`;
    chatBox.appendChild(messageElement);
}

function buyItem(item) {
    const itemData = items[item];
    if (coins >= itemData.cost) {
        coins -= itemData.cost;
        applyItemEffect(itemData);
        updateUI();
        alert(`${item} bought!`);
    } else {
        alert("Not enough coins.");
    }
}

function applyItemEffect(itemData) {
    let opponent = currentTurn === 1 ? 2 : 1;
    switch(itemData.effect) {
        case "military":
            playerMilitary[currentTurn] += itemData.value;
            break;
        case "defense":
            increaseDefense(itemData.value);
            break;
        case "funds":
            increaseFunds(itemData.value);
            break;
        case "reroll":
            rerollMoves();
            break;
        case "offense":
            handleOffense(itemData);
            break;
        case "health":
            increaseHealth(itemData.value);
            break;
        case "shield":
            increaseShield(itemData.value);
            break;
        case "offense":
            if (itemData.value === 20) {
                playerHealth[opponent] = Math.max(0, playerHealth[opponent] - (playerHealth[opponent] * 0.2));
            } else if (itemData.value === 0) {
                playerHealth[opponent] = Math.max(0, playerHealth[opponent] / 2);
            }
            break;
        default:
            console.error("Unknown effect:", itemData.effect);
    }
    updateUI(); // Ensure the UI is updated after applying item effect
}

function increaseDefense(value) {
    playerDefense[currentTurn] += value;
    console.log(`Increased defense by ${value}`);
    document.getElementById(`defense${currentTurn}`).textContent = `Defense: ${playerDefense[currentTurn]}%`;
}

function increaseFunds(value) {
    coins += value;
    console.log(`Increased funds by ${value}`);
    document.getElementById("coinCount").textContent = `Coins: ${coins}`;
}

function rerollMoves() {
    console.log("Rerolling move options");
}

function handleOffense(itemData) {
    if (itemData.count > 0) {
        itemData.count -= 1; // Decrease the count of available uses
        alert(`${itemData.description}`);
        console.log(`Offense item used: ${itemData.description}. Uses left: ${itemData.count}`);
        updateUI(); // Ensure the UI is updated after using an offense item
    } else {
        alert(`No uses left for ${itemData.description}`);
    }
}

function increaseHealth(value) {
    playerHealth[currentTurn] += value;
    if (playerHealth[currentTurn] > 100) playerHealth[currentTurn] = 100; // Ensure health doesn't exceed 100
    console.log(`Increased health by ${value}`);
    document.getElementById(`health${currentTurn}`).textContent = playerHealth[currentTurn];
}

function increaseShield(value) {
    playerShield[currentTurn] += value;
    console.log(`Shield increased by ${value}`);
    document.getElementById(`shield${currentTurn}`).textContent = `Shield: ${playerShield[currentTurn]}%`;
}