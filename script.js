const DAMAGE_PER_MILITARY_UNIT = 5;
const DAMAGE_ON_WRONG_ANSWER = 10;
const DAMAGE_BOOST = 2;

let currentTurn = 1;
let playerHealth = { 1: 100, 2: 100 };
let playerMilitary = { 1: 3, 2: 3 };
let playerUpgrades = { 1: {}, 2: {} };
let currentQuestion = null;

function startGame() {
    askQuestion();
}

function askQuestion() {
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


    if (playerUpgrades[currentTurn].attackBoost) {
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
}