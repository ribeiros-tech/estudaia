/**
 * EstudaIA
 * Ponto de entrada e gerenciamento da aplicação.
 */

import { loadData, saveData, STORAGE_KEYS } from "./storage.js";
import { generateContent } from "./gemini.js";

/**
 * Recupera a quantidade de registros de uma coleção.
 */
function getCollectionCount(key) {
    const data = loadData(key);

    return Array.isArray(data) ? data.length : 0;
}

/**
Exibe as matérias cadastradas e permite excluí-las.
*/
function renderSubjects() {
const subjectsList = document.getElementById("subjects-list");

if (!subjectsList) return;

const subjects = loadData(STORAGE_KEYS.SUBJECTS);

subjectsList.innerHTML = "";

if (!Array.isArray(subjects) || subjects.length === 0) {
subjectsList.innerHTML = "<p>Nenhuma matéria cadastrada.</p>";
return;
}

subjects.forEach((subject, index) => {
const item = document.createElement("div");
item.className = "subject-item";

 const name = document.createElement("span");
 name.textContent = subject.name;

 const deleteButton = document.createElement("button");
 deleteButton.textContent = "Excluir";
 deleteButton.className = "delete-subject-btn";

 deleteButton.addEventListener("click", () => {
     const confirmed = confirm(
         `Deseja realmente excluir a matéria "${subject.name}"?`
     );

     if (!confirmed) return;

     const updatedSubjects = loadData(STORAGE_KEYS.SUBJECTS);

     updatedSubjects.splice(index, 1);

     if (!saveData(STORAGE_KEYS.SUBJECTS, updatedSubjects)) {
         alert("Não foi possível excluir a matéria.");
         return;
     }

     renderSubjects();
     updateDashboard();
 });

 item.appendChild(name);
 item.appendChild(deleteButton);

 subjectsList.appendChild(item);

});
}

/**
 * Configura o cadastro de matérias.
 */
function initializeSubjects() {
    const subjectForm = document.getElementById("subject-form");
    const subjectName = document.getElementById("subject-name");

    if (!subjectForm || !subjectName) return;

    subjectForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = subjectName.value.trim();

        if (!name) return;

        const subjects = loadData(STORAGE_KEYS.SUBJECTS);

        if (!Array.isArray(subjects)) {
            console.error("Dados de matérias inválidos.");
            return;
        }

        subjects.push({
            id: Date.now(),
            name
        });

        if (!saveData(STORAGE_KEYS.SUBJECTS, subjects)) {
            console.error("Não foi possível salvar a matéria.");
            return;
        }

        subjectForm.reset();

        renderSubjects();
        updateDashboard();
    });

    renderSubjects();
}

/**
 * Atualiza os indicadores do dashboard.
 */
function updateDashboard() {
    const indicators = {
        "total-subjects": STORAGE_KEYS.SUBJECTS,
        "total-summaries": STORAGE_KEYS.SUMMARIES,
        "total-questions": STORAGE_KEYS.GENERATED_QUESTIONS,
        "total-flashcards": STORAGE_KEYS.FLASHCARDS
    };

    Object.entries(indicators).forEach(([elementId, storageKey]) => {
        const element = document.getElementById(elementId);

        if (!element) {
            console.warn(`Indicador não encontrado: ${elementId}`);
            return;
        }

        element.textContent = getCollectionCount(storageKey);
    });
}

/**
 * Configura a navegação entre páginas.
 */
function initializeNavigation() {
    const navigationLinks = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page-section");

    const pageTitles = {
        dashboard: {
            title: "Dashboard",
            subtitle: "Visão geral dos seus estudos"
        },

        materias: {
            title: "Minhas Matérias",
            subtitle: "Organize suas disciplinas de estudo"
        },

        resumos: {
            title: "Resumos IA",
            subtitle: "Transforme conteúdos em resumos inteligentes"
        },

        questoes: {
            title: "Questões",
            subtitle: "Teste seus conhecimentos"
        },

        flashcards: {
            title: "Flashcards",
            subtitle: "Revise conteúdos com cartões de aprendizagem"
        }
    };

    function navigateToPage(pageId) {
        const selectedPage = document.getElementById(pageId);

        if (!selectedPage || !pageTitles[pageId]) {
            pageId = "dashboard";
        }

        pages.forEach(page => {
            page.hidden = page.id !== pageId;
        });

        navigationLinks.forEach(link => {
            const isActive = link.dataset.page === pageId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        const title = document.querySelector(".topbar h1");
        const subtitle = document.querySelector(".topbar p");

        if (title && subtitle) {
            title.textContent = pageTitles[pageId].title;
            subtitle.textContent = pageTitles[pageId].subtitle;
        }
    }

    navigationLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const pageId = link.dataset.page;

            navigateToPage(pageId);

            history.replaceState(null, "", `#${pageId}`);
        });
    });

    window.addEventListener("hashchange", () => {
        navigateToPage(location.hash.substring(1));
    });

    const initialPage = location.hash.substring(1);

    navigateToPage(initialPage || "dashboard");
}

/**
 * Configura a geração de resumos com IA.
 */

/**
 * Formata o resumo estruturado recebido da IA.
 */

function formatSummary(data) {
    const componentes = data.componentes_principais
        .map(item => `
            <h3>${item.componente}</h3>
            <p>${item.descricao}</p>
        `)
        .join("");

    return `
        <h1>${data.titulo}</h1>

        <h2>Introdução</h2>
        <p>${data.introducao}</p>

        <h2>Componentes principais</h2>
        ${componentes}

        <h2>Conclusão</h2>
        <p>${data.conclusao}</p>
    `;
}


function initializeSummary() {
    const summaryForm = document.getElementById("summary-form");
    const summaryTopic = document.getElementById("summary-topic");
    const summaryResult = document.getElementById("summary-result");

    if (!summaryForm || !summaryTopic || !summaryResult) return;

    summaryForm.addEventListener("submit", async event => {
        event.preventDefault();

        const topic = summaryTopic.value.trim();

        if (!topic) return;

        const button = summaryForm.querySelector("button");

        button.disabled = true;
        button.textContent = "Gerando...";
        summaryResult.textContent = "A inteligência artificial está preparando seu resumo...";

        try {
            const content = await generateContent(topic, "summary");

const summaries = loadData(STORAGE_KEYS.SUMMARIES);

summaries.push({
    topic,
    content,
    createdAt: new Date().toISOString()
});

if (!saveData(STORAGE_KEYS.SUMMARIES, summaries)) {
    throw new Error("Não foi possível salvar o resumo.");
}

const summaryData = JSON.parse(content);

summaryResult.innerHTML = DOMPurify.sanitize(
    formatSummary(summaryData)
);
updateDashboard();
renderSummaries();

        } catch (error) {
            console.error("Erro ao gerar resumo:", error);

            summaryResult.textContent =
                "Não foi possível gerar o resumo. Tente novamente.";
        } finally {
            button.disabled = false;
            button.textContent = "Gerar Resumo";
        }

    renderSummaries();   
    });
}

/**
 * Exibe os resumos salvos e permite excluí-los.
 */
function renderSummaries() {
    const summariesList = document.getElementById("summaries-list");

    if (!summariesList) return;

    const summaries = loadData(STORAGE_KEYS.SUMMARIES);

    summariesList.innerHTML = "";

    if (!Array.isArray(summaries) || summaries.length === 0) {
        summariesList.innerHTML = "<p>Nenhum resumo salvo.</p>";
        return;
    }

    summaries.forEach((summary, index) => {
        const item = document.createElement("div");
        item.className = "summary-item";

        const title = document.createElement("h3");
        title.textContent = summary.topic;

        const content = document.createElement("div");
        content.innerHTML = DOMPurify.sanitize(marked.parse(summary.content));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.className = "delete-subject-btn";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Deseja realmente excluir o resumo "${summary.topic}"?`
            );

            if (!confirmed) return;

            const updatedSummaries = loadData(STORAGE_KEYS.SUMMARIES);

            updatedSummaries.splice(index, 1);

            if (!saveData(STORAGE_KEYS.SUMMARIES, updatedSummaries)) {
                alert("Não foi possível excluir o resumo.");
                return;
            }

            renderSummaries();
            updateDashboard();
        });

        item.appendChild(title);
        item.appendChild(content);
        item.appendChild(deleteButton);

        summariesList.appendChild(item);
    });
}

/**
 * Inicializa a aplicação.
 */
function initializeApp() {
    try {
        updateDashboard();
        initializeSubjects();
        initializeSummary();
        initializeQuiz();
        initializeFlashcards();
        initializeNavigation();
        
        console.info("EstudaIA inicializado com sucesso.");

    } catch (error) {
        console.error("Erro ao inicializar o EstudaIA:", error);
    }
}


/**
 * Configura a geração e visualização dos flashcards com IA.
 */
function initializeFlashcards() {
    const flashcardsPrompt = document.getElementById("flashcards-prompt");
    const flashcardsButton = document.getElementById("generate-flashcards-btn");
    const flashcardsContainer = document.getElementById("flashcards-container");

    const flashcardsQuantity = document.getElementById("flashcards-quantity");

    if (!flashcardsPrompt || !flashcardsButton || !flashcardsContainer) return;

    flashcardsButton.addEventListener("click", async () => {
        const topic = flashcardsPrompt.value.trim();

        if (!topic) {
            flashcardsContainer.textContent = "Insira um conteúdo para gerar flashcards.";
            return;
        }

        flashcardsButton.disabled = true;
        flashcardsButton.textContent = "Gerando flashcards...";
        flashcardsContainer.textContent = "A IA está preparando seus cartões...";

        try {
            const quantity = Number(flashcardsQuantity.value);

            const content = await generateContent(topic, "flashcards", quantity);

            console.log("RESPOSTA ORIGINAL DOS FLASHCARDS:", content);

            const cleanContent = content
                .replace(/```json|```/g, "")
                .trim();

            const data = JSON.parse(cleanContent);

            console.log("JSON RECEBIDO:", cleanContent);

            if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
                throw new Error("Formato de flashcards inválido.");
            }

            const flashcards = loadData(STORAGE_KEYS.FLASHCARDS);

flashcards.push({
    topic,
    cards: data.flashcards,
    quantity: data.flashcards.length,
    createdAt: new Date().toISOString()
});

if (!saveData(STORAGE_KEYS.FLASHCARDS, flashcards)) {
    throw new Error("Não foi possível salvar os flashcards.");
}

updateDashboard();

            flashcardsContainer.innerHTML = "";

            data.flashcards.forEach((flashcard, index) => {
                const card = document.createElement("div");
                card.className = "flashcard";

                const question = document.createElement("div");
                question.className = "flashcard-front";
                question.textContent = flashcard.pergunta;

                const answer = document.createElement("div");
                answer.className = "flashcard-back";
                answer.textContent = flashcard.resposta;

                card.appendChild(question);
                card.appendChild(answer);

                card.addEventListener("click", () => {
                    card.classList.toggle("flipped");
                });

                flashcardsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao gerar flashcards:", error);

            flashcardsContainer.textContent =
                "Não foi possível gerar os flashcards. Tente novamente.";

        } finally {
            flashcardsButton.disabled = false;
            flashcardsButton.textContent = "Gerar Flashcards";
        }
    });
}


/**
 * Configura a geração de questões com IA.
 */
function initializeQuiz() {
    const quizPrompt = document.getElementById("quiz-prompt");
    const quizButton = document.getElementById("generate-quiz-btn");
    const quizContainer = document.getElementById("quiz-container");

    if (!quizPrompt || !quizButton || !quizContainer) return;

    quizButton.addEventListener("click", async () => {
        const topic = quizPrompt.value.trim();

        if (!topic) {
            quizContainer.textContent = "Insira um conteúdo para gerar questões.";
            return;
        }

        quizButton.disabled = true;
        quizButton.textContent = "Gerando questões...";
        quizContainer.textContent = "A IA está preparando seu questionário...";

        try {
            const content = await generateContent(topic, "quiz");

            console.log("RESPOSTA ORIGINAL DO GEMINI:", content);

            const cleanContent = content
    .replace(/```json|```/g, "")
    .trim();

console.log("TAMANHO DO JSON:", cleanContent.length);

let data;

try {
    data = JSON.parse(cleanContent);
} catch (error) {
    console.error("JSON INVÁLIDO:", error.message);
    console.error("RESPOSTA COMPLETA:", cleanContent);
    throw error;
}
            if (!Array.isArray(data.questoes) || data.questoes.length === 0) {
                throw new Error("Formato de questões inválido.");
            }

            const generatedQuestions = loadData(STORAGE_KEYS.GENERATED_QUESTIONS);

generatedQuestions.push({
    topic,
    questions: data.questoes,
    createdAt: new Date().toISOString()
});

if (!saveData(STORAGE_KEYS.GENERATED_QUESTIONS, generatedQuestions)) {
    throw new Error("Não foi possível salvar as questões.");
}

updateDashboard();

            quizContainer.innerHTML = "";

            data.questoes.forEach(function(question, index) {
                const card = document.createElement("div");
                card.className = "quiz-question";

                const title = document.createElement("h3");
                title.textContent = "Questão " + (index + 1);

                const statement = document.createElement("p");
                statement.textContent = question.pergunta;

                card.appendChild(title);
                card.appendChild(statement);

                Object.entries(question.alternativas).forEach(([key, value]) => {
                    const label = document.createElement("label");
                    const input = document.createElement("input");

                    input.type = "radio";
                    input.name = "question-" + index;
                    input.value = key;

                    label.appendChild(input);
                    label.appendChild(
                        document.createTextNode(" " + key + ") " + value)
                    );

                    card.appendChild(label);
                    card.appendChild(document.createElement("br"));
                });

                // Gabarito
                const answer = document.createElement("p");
                answer.textContent = "Resposta correta: " + question.gabarito;
                answer.className = "quiz-answer";
                card.appendChild(answer);

                // Explicação da resposta
                const explanation = document.createElement("p");
                explanation.textContent = "Explicação: " + question.explicacao;
                card.appendChild(explanation);

                // Explicações das alternativas
                if (question.explicacoes_alternativas) {
                    Object.entries(question.explicacoes_alternativas).forEach(([key, value]) => {
                        const explanationItem = document.createElement("p");
                        explanationItem.textContent = key + ": " + value;
                        card.appendChild(explanationItem);
                    });
                }

                quizContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao gerar questões:", error);

            quizContainer.textContent =
                "Não foi possível gerar as questões. Tente novamente.";

        } finally {
            quizButton.disabled = false;
            quizButton.textContent = "Gerar questões";
        }
    });
}

initializeApp();

console.log("APP.JS EXECUTADO!");