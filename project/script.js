const DAMAGE_PER_MILITARY_UNIT = 5;
const DAMAGE_ON_WRONG_ANSWER = 10;

let currentTurn = 1;
let playerHealth = { 1: 100, 2: 100 };
let playerMilitary = { 1: 3, 2: 3 };
let playerUpgrades = {1:{},2:{}};
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
        document.getElementById("result").textContent = "Incorrect! Opponent attacks.";
    }

    document.getElementById("next-turn").disabled = false;
}

function attackOpponent() {
    const damage = playerMilitary[currentTurn] * DAMAGE_PER_MILITARY_UNIT;
    
    playerHealth[currentTurn === 1 ? 2 : 1] -= damage;
    updateUI();
}

function takeDamage() {
    playerHealth[currentTurn] -= DAMAGE_ON_WRONG_ANSWER;
    updateUI();
}

function nextTurn() {
    currentTurn = currentTurn === 1 ? 2 : 1;
    document.getElementById("next-turn").disabled = true;
    askQuestion();
}

function updateUI() {
    document.getElementById("health1").textContent = playerHealth[1];
    document.getElementById("military1").textContent = playerMilitary[1];
    document.getElementById("health2").textContent = playerHealth[2];
    document.getElementById("military2").textContent = playerMilitary[2];
}

function updateMilitary(amount){
    playerMilitary[currentTurn] += amount;
}

/* save: git add .
         git commit -m "changes made"
         git push origin main
*/