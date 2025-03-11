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
let playerShield = { 1: 0, 2: 0 }; // Add shield for each player
let playerDefense = { 1: 0, 2: 0 }; // Add defense for each player
let consecutiveCorrectAnswers = 0; // Track consecutive correct answers
let firstTry = true; // Track if it's the first try for the current question

const items = {
    // upgrades
    soldier: { cost: 10, effect: "military", value: 1 },
    knight: { cost: 20, effect: "military", value: 2 },
    warElephant: { cost: 30, effect: "military", value: 3 },
    armoredWarBears: { cost: 40, effect: "military", value: 4 },
    tradingCart: { cost: 70, effect: "funds", value: 5 },
    business: { cost: 100, effect: "funds", value: 10 },
    witch: { cost: 100, effect: "reroll", value: 1 },

    // offense
    dayAttack: { cost: 10, effect: "offense", value: 5, count: 5, description: "5% damage per military" },
    nightAttack: { cost: 10, effect: "offense", value: 5, count: 3, description: "5% damage per military, immune to watch tower" },
    siege: { cost: 20, effect: "offense", value: 10, count: 1, description: "10% damage per military, lose 2 military" },
    cannon: { cost: 20, effect: "offense", value: 20, count: 1, description: "20% damage regardless of military" },
    catapult: { cost: 10, effect: "offense", value: 10, count: 2, description: "10% damage regardless of military" },
    spyAttack: { cost: 5, effect: "offense", value: 5, count: 2, description: "Does 5% damage for each enemy military" },
    fire: { cost: 5, effect: "offense", value: 0, count: 1, description: "Removes half of remaining enemy health" },

    // Defense + Healing
    trap: { cost: 20, effect: "defense", value: 15, count: 2, description: "15% chance of stopping future enemy attacks" },
    wallRepair: { cost: 20, effect: "defense", value: 20, count: 1, description: "Immediately heal 20%" },
    shields: { cost: 20, effect: "defense", value: 10, count: 1, description: "Blocks 10% damage for all attacks" },

    // Health and Shield Items
    healthPotion: { cost: 30, effect: "health", value: 20 },
    strongShield: { cost: 50, effect: "shield", value: 20 },
};

function startGame() {
    const urlParams = new URLSearchParams(window.location.search);
    isSinglePlayer = urlParams.get('mode') === 'single';
    isMultiplayer = urlParams.get('mode') === 'multiplayer';
    if (isSinglePlayer) {
        askQuestion();
    }
}

function askQuestion() {
    const categories = Object.keys(questions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedCategory = questions[randomCategory];

    const randomIndex = Math.floor(Math.random() * selectedCategory.length);
    currentQuestion = selectedCategory[randomIndex];

    document.getElementById("question-text").textContent = currentQuestion.question;
    document.getElementById("answer").value = "";
    firstTry = true; // Reset first try for the new question
}

function submitAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();

    if (userAnswer === currentQuestion.answer.toLowerCase()) {
        attackOpponent();
        document.getElementById("result").textContent = "✅ Correct! Attack successful.";
        consecutiveCorrectAnswers++;
        if (firstTry) {
            coins += 10; // Increase coins on correct answer on first try
        }
        if (consecutiveCorrectAnswers % 3 === 0) {
            coins += 50; // Bonus for three consecutive correct answers
            alert("🎉 Bonus! You earned 50 extra coins for three consecutive correct answers!");
        }
        firstTry = false; // Reset first try
    } else {
        if (firstTry) {
            alert("❌ Incorrect! Try again.");
            firstTry = false; // Set first try to false
        } else {
            alert(`❌ Incorrect! The correct answer was: ${currentQuestion.answer}`);
            takeDamage();
            document.getElementById("result").textContent = "❌ Incorrect! Opponent attacks.";
            consecutiveCorrectAnswers = 0; // Reset consecutive correct answers on wrong answer
        }
    }

    updateUI(); // Update UI after submitting answer

    // Wait for 1 second and then ask another question
    setTimeout(() => {
        if (isSinglePlayer && currentTurn === 2) {
            npcTurn();
        } else {
            askQuestion();
        }
    }, 1000);

    // Send game state update to the server
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

function attackOpponent() {
    let damage = playerMilitary[currentTurn] * DAMAGE_PER_MILITARY_UNIT;

    // Apply attack boost if it exists
    if (playerUpgrades[currentTurn]?.attackBoost) {
        damage += DAMAGE_BOOST;
    }

    let opponent = currentTurn === 1 ? 2 : 1;
    damage = applyDefense(opponent, damage); // Apply defense effect
    damage = applyShield(opponent, damage); // Apply shield effect
    playerHealth[opponent] = Math.max(0, playerHealth[opponent] - damage);

    updateUI();
    checkGameOver();

    // Send game state update to the server
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
    damage = applyDefense(currentTurn, damage); // Apply defense effect
    damage = applyShield(currentTurn, damage); // Apply shield effect
    playerHealth[currentTurn] = Math.max(0, playerHealth[currentTurn] - damage);
    
    updateUI();
    checkGameOver();

    // Send game state update to the server
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
        const reducedDamage = damage * (1 - playerDefense[player] / 100);
        console.log(`Defense reduced damage from ${damage} to ${reducedDamage}`);
        return reducedDamage;
    }
    return damage;
}

function applyShield(player, damage) {
    if (playerShield[player] > 0) {
        const reducedDamage = damage * (1 - playerShield[player] / 100);
        console.log(`Shield reduced damage from ${damage} to ${reducedDamage}`);
        return reducedDamage;
    }
    return damage;
}

function nextTurn() {
    currentTurn = currentTurn === 1 ? 2 : 1;
    if (isSinglePlayer && currentTurn === 2) {
        npcTurn();
    } else {
        askQuestion();
    }
}

function npcTurn() {
    // NPC logic for attacking
    let damage = playerMilitary[2] * DAMAGE_PER_MILITARY_UNIT;
    damage = applyDefense(1, damage); // Apply defense effect
    damage = applyShield(1, damage); // Apply shield effect
    playerHealth[1] = Math.max(0, playerHealth[1] - damage);
    document.getElementById("result").textContent = "🤖 NPC attacks!";
    updateUI();
    checkGameOver();
    setTimeout(() => {
        currentTurn = 1;
        askQuestion();
    }, 1000); // Delay to simulate NPC thinking time
}

function checkGameOver() {
    if (playerHealth[1] <= 0) {
        alert("🎉 Player 2 Wins!");
        resetGame();
    } else if (playerHealth[2] <= 0) {
        alert("🎉 Player 1 Wins!");
        resetGame();
    }
}

function resetGame() {
    playerHealth = { 1: 100, 2: 100 };
    playerMilitary = { 1: 3, 2: 3 };
    playerShield = { 1: 0, 2: 0 }; // Reset shields
    playerDefense = { 1: 0, 2: 0 }; // Reset defenses
    coins = 100; // Reset coins
    consecutiveCorrectAnswers = 0; // Reset consecutive correct answers
    currentTurn = 1;
    updateUI();
    askQuestion();
}

function updateUI() {
    document.getElementById("health1").textContent = playerHealth[1];
    document.getElementById("military1").textContent = playerMilitary[1];
    document.getElementById("health2").textContent = playerHealth[2];
    document.getElementById("military2").textContent = playerMilitary[2];
    document.getElementById("coinCount").textContent = `Coins: ${coins}`;
    document.getElementById("shield1").textContent = `Shield: ${playerShield[1]}%`;
    document.getElementById("shield2").textContent = `Shield: ${playerShield[2]}%`;
    document.getElementById("defense1").textContent = `Defense: ${playerDefense[1]}%`;
    document.getElementById("defense2").textContent = `Defense: ${playerDefense[2]}%`;
}

function buyItem(itemName) {
    const item = items[itemName];
    if (coins >= item.cost) {
        coins -= item.cost;
        switch (item.effect) {
            case "military":
                playerMilitary[currentTurn] += item.value;
                break;
            case "funds":
                // This will automatically update coins in future turns
                alert(item.description);
                break;
            case "offense":
                // Implement offense logic here
                alert(item.description);
                break;
            case "defense":
                playerDefense[currentTurn] += item.value;
                break;
            case "health":
                playerHealth[currentTurn] = Math.min(100, playerHealth[currentTurn] + item.value);
                break;
            case "shield":
                playerShield[currentTurn] += item.value;
                break;
            case "reroll":
                // Implement reroll logic here
                alert(item.description);
                break;
            default:
                console.error("Unknown item effect:", item.effect);
        }
        updateUI();
    } else {
        alert("Not enough coins!");
    }
}