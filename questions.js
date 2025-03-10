const questions = {
    grammar: [
        { question: "Translate: ‘We have to run’", answer: "tenemos que correr" },
        { question: "¿Que es la forma infinitiva de ‘hay’?", answer: "haber" },
        { question: "‘Hace que’ expresión de tiempo: ____ ____ ____ que él usa la computadora (he’s been using the computer for 2 hours)", answer: "hace dos horas" },
        { question: "¿Cuál verbo es ‘to be able to’?", answer: "poder" },
        { question: "Translate: ‘I had won’", answer: "había ganado" },
        { question: "Escribe ‘Quiero’ en inglés, incluso el sujeto.", answer: "I want" },
        { question: "Conjugate ‘ser’ in the present tense for yo.", answer: "soy" },
        { question: "What is the plural form of ‘el lápiz’ in Spanish?", answer: "los lápices" }
    ],
    verbs: [
        { question: "Saber o Conocer? ‘Yo _____ la población de China.’", answer: "saber" },
        { question: "Escribe ‘Venimos’ en inglés, incluso el sujeto.", answer: "we come" },
        { question: "Use hacer in the present perfect form in this sentence: _____ muchas personas en el evento anoche.", answer: "han hecho" },
        { question: "Cumple la frase: ‘Yo desayuno ___ de almorzar.’", answer: "antes" },
        { question: "Cumplir la frase: Me _____ la música pop. (I love pop music)", answer: "encanta" },
        { question: "Complete the question using conocer in the correct form: ___ tu a alguien que hable tres idiomas?", answer: "conoces" },
        { question: "Conjugate ‘tener’ in the present tense for nosotros.", answer: "tenemos" },
        { question: "What is the past participle of ‘escribir’ in Spanish?", answer: "escrito" }
    ],
    conversational: [
        { question: "Complete the sentence to make it passive: Los limones __ ____ aquí.", answer: "son vendidos" },
        { question: "Complete the sentence using dar in the correct form: Mi profesor me ____ una buena nota.", answer: "da" },
        { question: "Complete the negative sentence: No ____ Moana (mirar)", answer: "mires" },
        { question: "Complete the sentence using traer in the correct form: Me ___ una botella de agua.", answer: "trae" },
        { question: "How can you say ‘Don’t watch Moana’", answer: "no mires Moana" },
        { question: "Complete the question using poder in the correct form: ___ tu venir a mi fiesta?", answer: "puedes" },
        { question: "Complete the affirmative sentence: ____ tu cena (comer)", answer: "come" },
        { question: "Complete the sentence using the correct form of ser or estar: Mi madre ___ en nuestra casa", answer: "está" },
        { question: "Complete this sentence with por or para: Compre esta pizza ___ 10 dolares", answer: "por" },
        { question: "Complete the question with the correct ir form: ____ ustedes al cine mañana?", answer: "van" },
        { question: "What is the Spanish phrase for ‘I would like to order’?", answer: "me gustaría pedir" },
        { question: "Translate to Spanish: ‘Excuse me, where is the bathroom?’", answer: "disculpe, ¿dónde está el baño?" }
    ]
};

document.addEventListener("DOMContentLoaded", function () {
    loadRandomQuestion();
});

function loadRandomQuestion() {
    if (!questions) {
        console.error("Questions are not defined.");
        return;
    }

    const questionContainer = document.getElementById('question-section');
    const categories = Object.keys(questions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedCategory = questions[randomCategory];

    const randomIndex = Math.floor(Math.random() * selectedCategory.length);
    const currentQuestion = selectedCategory[randomIndex];

    questionContainer.innerHTML = `
        <h2>${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)} Question</h2>
        <p id="question-text"><strong>Q:</strong> ${currentQuestion.question}</p>
        <input type="text" id="user-answer" placeholder="Type your answer here">
        <button onclick="checkAnswer()">Submit</button>
        <input type="hidden" id="correct-answer" value="${currentQuestion.answer}">
        <p id="result"></p>
    `;
}

function checkAnswer() {
    const userInput = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctAnswer = document.getElementById('correct-answer').value.trim().toLowerCase();
    const resultText = document.getElementById('result');

    if (userInput === correctAnswer) {
        resultText.textContent = "✅ Correcto!";
        resultText.style.color = "lightgreen";
        setTimeout(loadRandomQuestion, 1000);
    } else {
        resultText.textContent = "❌ Incorrecto. ¡Intentar Otra Vez!";
        resultText.style.color = "red";
    }
}
