const DAMAGE_PER_MILITARY_UNIT = 5;
const DAMAGE_ON_WRONG_ANSWER = 10;
const DAMAGE_BOOST = 2;

let currentTurn = 1;
let playerHealth = { 1: 100, 2: 100 };
let playerMilitary = { 1: 3, 2: 3 };
let playerUpgrades = { 1: {}, 2: {} };
let currentQuestion = null;
let coins = 100;

const items = {
    // upgrades
    soldier: { cost: 15, effect: "military", value: 1 },
    knight: { cost: 25, effect: "military", value: 2 },
    warElephant: { cost: 40, effect: "military", value: 3 },
    armoredWarBears: { cost: 50, effect: "military", value: 4 },
    tradingCart: { cost: 50, effect: "funds", value: 5 },
    business: { cost: 80, effect: "funds", value: 10 },
    witch: { cost: 60, effect: "reroll", value: 1 },

    // offense
    dayAttack: { cost: 20, effect: "offense", value: 5, count: 5, description: "5% damage per military" },
    nightAttack: { cost: 30, effect: "offense", value: 5, count: 3, description: "5% damage per military, immune to watch tower" },
    siege: { cost: 40, effect: "offense", value: 10, count: 1, description: "10% damage per military, lose 2 military" },
    cannon: { cost: 50, effect: "offense", value: 20, count: 1, description: "20% damage regardless of military" },
    catapult: { cost: 35, effect: "offense", value: 10, count: 2, description: "10% damage regardless of military" },
    spyAttack: { cost: 60, effect: "offense", value: 5, count: 2, description: "Does 5% damage for each enemy military" },
    fire: { cost: 70, effect: "offense", value: 0, count: 1, description: "Removes half of remaining enemy health" },

    // Defense + Healing
    trap: { cost: 25, effect: "defense", value: 15, count: 2, description: "15% chance of stopping future enemy attacks" },
    wallRepair: { cost: 30, effect: "defense", value: 20, count: 1, description: "Immediately heal 20%" },
    shields: { cost: 40, effect: "defense", value: 10, count: 1, description: "Blocks 10% damage for all attacks" },

    // Health and Shield Items
    healthPotion: { cost: 30, effect: "health", value: 20 },
    strongShield: { cost: 50, effect: "shield", value: 20 },
};

function startGame() {
    askQuestion();
}

function askQuestion() {
    if (!questions || questions.length === 0) {
        console.error("Questions array is missing or empty.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];

    document.getElementById("question-text").textContent = currentQuestion.question;
    document.getElementById("answer").value = "";
}

function submitAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();

    if (userAnswer === currentQuestion.answer.toLowerCase()) {
        attackOpponent();
        document.getElementById("result").textContent = "✅ Correct! Attack successful.";
    } else {
        takeDamage();
        document.getElementById("result").textContent = "❌ Incorrect! Opponent attacks.";
    }

    document.getElementById("next-turn").disabled = false;
}

function attackOpponent() {
    let damage = playerMilitary[currentTurn] * DAMAGE_PER_MILITARY_UNIT;

    // Apply attack boost if it exists
    if (playerUpgrades[currentTurn]?.attackBoost) {
        damage += DAMAGE_BOOST;
    }

    let opponent = currentTurn === 1 ? 2 : 1;
    playerHealth[opponent] = Math.max(0, playerHealth[opponent] - damage);

    updateUI();
    checkGameOver();
}

function takeDamage() {
    playerHealth[currentTurn] = Math.max(0, playerHealth[currentTurn] - DAMAGE_ON_WRONG_ANSWER);
    
    updateUI();
    checkGameOver();
}

function nextTurn() {
    currentTurn = currentTurn === 1 ? 2 : 1;
    document.getElementById("next-turn").disabled = true;
    askQuestion();
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
        default:
            console.error("Unknown effect:", itemData.effect);
    }
}

function increaseDefense(value) {
    // Implement defense logic if needed
    console.log(`Increased defense by ${value}`);
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
    // Implement shield logic if needed
    console.log(`Shield increased by ${value}`);
}

// Debugging function to log element properties
function logElementProperties() {
    const shopContainer = document.querySelector('.shop-container');
    const shopItems = document.querySelector('.shop-items');
    const shopSections = document.querySelectorAll('.shop-section');

    console.log('Shop Container:', {
        height: shopContainer.clientHeight,
        overflowY: getComputedStyle(shopContainer).overflowY
    });

    console.log('Shop Items:', {
        height: shopItems.clientHeight,
        overflowY: getComputedStyle(shopItems).overflowY
    });

    shopSections.forEach((section, index) => {
        console.log(`Shop Section ${index + 1}:`, {
            height: section.clientHeight,
            overflowY: getComputedStyle(section).overflowY
        });
    });
}

window.onload = logElementProperties;