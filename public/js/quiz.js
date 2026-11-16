/**
 * EstudaIA
 * Módulo responsável pelo gerenciamento de questões.
 */

import { loadData, saveData, STORAGE_KEYS } from "./storage.js";

/**
 * Banco inicial de questões.
 */
const QUESTIONS = [
    {
        id: 1,
        subject: "JavaScript",
        statement: "Qual palavra-chave declara uma variável que pode receber novos valores?",
        options: ["const", "let", "function", "return"],
        correctAnswer: 1
    },
    {
        id: 2,
        subject: "JavaScript",
        statement: "Qual método converte um objeto JavaScript em uma string JSON?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        correctAnswer: 1
    },
    {
        id: 3,
        subject: "JavaScript",
        statement: "Qual método recupera um dado armazenado no LocalStorage?",
        options: [
            "localStorage.setItem()",
            "localStorage.removeItem()",
            "localStorage.getItem()",
            "localStorage.clear()"
        ],
        correctAnswer: 2
    }
];

/**
 * Retorna as questões disponíveis.
 */
export function getQuestions() {
    return QUESTIONS.map(({ correctAnswer, ...question }) => question);
}

/**
 * Registra uma resposta.
 */
export function submitAnswer(questionId, selectedOption) {
    const question = QUESTIONS.find(item => item.id === questionId);

    if (!question) {
        throw new Error("Questão não encontrada.");
    }

    if (
        !Number.isInteger(selectedOption) ||
        selectedOption < 0 ||
        selectedOption >= question.options.length
    ) {
        throw new Error("Alternativa selecionada inválida.");
    }

    const history = loadData(STORAGE_KEYS.QUESTIONS);

    if (!Array.isArray(history)) {
        throw new Error("Histórico de questões inválido.");
    }

    const result = {
        questionId,
        selectedOption,
        isCorrect: selectedOption === question.correctAnswer,
        answeredAt: new Date().toISOString()
    };

    history.push(result);

    if (!saveData(STORAGE_KEYS.QUESTIONS, history)) {
        throw new Error("Não foi possível salvar a resposta.");
    }

    return result;
}

/**
 * Calcula os resultados das questões respondidas.
 */
export function getQuizResults() {
    const history = loadData(STORAGE_KEYS.QUESTIONS);

    if (!Array.isArray(history)) {
        return {
            answered: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        };
    }

    const correct = history.filter(item => item.isCorrect === true).length;

    const answered = history.length;

    return {
        answered,
        correct,
        incorrect: answered - correct,
        accuracy: answered > 0
            ? Math.round((correct / answered) * 100)
            : 0
    };
}
