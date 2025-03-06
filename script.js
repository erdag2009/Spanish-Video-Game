const DAMAGE_PER_MILITARY_UNIT = 5;
const DAMAGE_ON_WRONG_ANSWER = 10;

let currentTurn = 1;
let playerHealth = { 1: 100, 2: 100 };
let playerMilitary = { 1: 3, 2: 3 };
let currentQuestion = null;

function startGame() {
    askQuestion();
}

function askQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];

    document.getElementById("question-text").textContent = currentQuestion.question;
}

function submitAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    if (userAnswer === currentQuestion.answer.toLowerCase()) {
        attackOpponent();
        document.getElementById("result").textContent = "Correct! Attack successful.";
    } else {
        takeDamage();
        document.getElementById("result").textContent = `Wrong! You take ${DAMAGE_ON_WRONG_ANSWER} damage.`;
    }

    document.getElementById("next-turn").disabled = false;
    document.getElementById("answer").value = "";
}

function attackOpponent() {
    const enemy = currentTurn === 1 ? 2 : 1;
    let damage = playerMilitary[currentTurn] * DAMAGE_PER_MILITARY_UNIT;
    playerHealth[enemy] -= damage;

    updateUI();
    checkWin();
}

function takeDamage() {
    playerHealth[currentTurn] -= DAMAGE_ON_WRONG_ANSWER;
    updateUI();
    checkWin();
}

function nextTurn() {
    currentTurn = currentTurn === 1 ? 2 : 1;
    document.getElementById("next-turn").disabled = true;
    askQuestion();
}

function updateUI() {
    document.getElementById("health1").textContent = playerHealth[1];
    document.getElementById("health2").textContent = playerHealth[2];
}

function checkWin() {
    if (playerHealth[1] <= 0) alert("Player 2 wins!");
    if (playerHealth[2] <= 0) alert("Player 1 wins!");
}

function updatePlayerStats(playerNumber, stats) {
    if (!stats || typeof stats !== "object") {
        console.error("Invalid stats object provided.");
        return;
    }

    Object.keys(stats).forEach(stat => {
        const element = document.getElementById(`${stat}${playerNumber}`);
        if (element) {
            element.textContent = stats[stat];
        } else {
            console.error(`Element for ${stat}${playerNumber} not found.`);
        }
    });
}

document.addEventListener("DOMContentLoaded", startGame);
