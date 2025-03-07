let coins = 100;
let military = 3;
let defense = 0;
let health = 100;
let shield = 0;

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
            military += itemData.value;
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
    defense += value;
    console.log(`Increased defense by ${value}`);
    document.getElementById("defense").textContent = `Defense: ${defense}`;
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
    health += value;
    if (health > 100) health = 100; // Ensure health doesn't exceed 100
    console.log(`Increased health by ${value}`);
    document.getElementById("health").textContent = `Health: ${health}`;
}

function increaseShield(value) {
    shield += value;
    console.log(`Shield increased by ${value}`);
    document.getElementById("shield").textContent = `Shield: ${shield}`;
}

function updateUI() {
    document.getElementById("coinCount").textContent = `Coins: ${coins}`;
    document.getElementById("militaryCount").textContent = `Military: ${military}`;
    document.getElementById("defense").textContent = `Defense: ${defense}`;
    document.getElementById("health").textContent = `Health: ${health}`;
    document.getElementById("shield").textContent = `Shield: ${shield}`;
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

// Call the debugging function on page load
window.onload = logElementProperties;