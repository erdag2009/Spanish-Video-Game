const questions = {
    grammar: [
        {
            question: "Translate: ‘We have to run’",
            answer: "tenemos que correr"
        },
        {
            question: "¿Que es la forma infinitiva de ‘hay’?",
            answer: "haber"
        },
        {
            question: "‘Hace que’ expresión de tiempo: ____ ____ ____ que él usa la computadora (he’s been using the computer for 2 hours)",
            answer: "hace dos horas"
        },
        {
            question: "¿Cuál verbo es ‘to be able to’?",
            answer: "poder"
        },
        {
            question: "Translate: ‘I had won’",
            answer: "había ganado"
        },
        {
            question: "Escribe ‘Quiero’ en inglés, incluso el sujeto.",
            answer: "I want"
        }
    ],
    verbs: [
        {
            question: "Saber o Conocer? ‘Yo _____ la población de China.’",
            answer: "Saber / Sabo"
        },
        {
            question: "Escribe ‘Venimos’ en inglés, incluso el sujeto.",
            answer: "We come"
        },
        {
            question: "Use hacer in the present perfect form in this sentence: _____ muchas personas en el evento anoche.",
            answer: "Han"
        },
        {
            question: "Cumple la frase: ‘Yo desayuno ___ de almorzar.’",
            answer: "antes"
        },
        {
            question: "Cumplir la frase: Me _____ la música pop. (I love pop music)",
            answer: "encanta"
        },
        {
            question: "Complete the question using conocer in the correct form: ___ tu a alguien que hable tres idiomas?",
            answer: "Conoces"
        }
    ],
    conversational: [
        {
            question: "Complete the sentence to make it passive: Los limones __ ____ aquí.",
            answer: "son vendidos"
        },
        {
            question: "Complete the sentence using dar in the correct form: Mi profesor me ____ una buena nota.",
            answer: "da"
        },
        {
            question: "Complete the negative sentence: No ____ Moana (mirar)",
            answer: "mira"
        },
        {
            question: "Complete the sentence using traer in the correct form: Me ___ una botella de agua.",
            answer: "trae"
        },
        {
            question: "How can you say ‘Don’t watch Moana’",
            answer: "No mires Moana"
        },
        {
            question: "Complete the question using poder in the correct form: ___ tu venir a mi fiesta?",
            answer: "Puedes"
        },
        {
            question: "Complete the affirmative sentence: ____ tu cena (comer)",
            answer: "Come"
        },
        {
            question: "Complete the sentence using the correct form of ser or estar: Mi madre ___ en nuestra casa",
            answer: "está"
        },
        {
            question: "Complete this sentence with por or para: Compre esta pizza ___ 10 dolares",
            answer: "por"
        },
        {
            question: "Complete the question with the correct ir form: ____ ustedes al cine mañana?",
            answer: "Van"
        }
    ]
};

document.addEventListener("DOMContentLoaded", function() {
    const gameMode = getGameMode(); 
    const questionSection = document.getElementById('question-section'); 
  
    if (gameMode === 'single') {
        loadQuestions(questionSection, 'grammar'); 
    } else if (gameMode === 'multiplayer') {
        loadQuestions(questionSection, 'verbs'); 
    }
});

function loadQuestions(section, category) {
    const selectedCategory = questions[category];
    let questionsHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Questions</h2><ul>`;
    
    selectedCategory.forEach(item => {
        questionsHTML += `<li><strong>Q:</strong> ${item.question} <br> <strong>A:</strong> ${item.answer}</li>`;
    });
    
    questionsHTML += `</ul>`;
    section.innerHTML = questionsHTML;
}

function getGameMode() {
    return localStorage.getItem('gameMode') || 'single'; 
}
