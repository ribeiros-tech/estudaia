/**
 * EstudaIA
 * Módulo responsável pela persistência de dados.
 */

const STORAGE_KEYS = Object.freeze({
    SUBJECTS: "estudaia_subjects",
    SUMMARIES: "estudaia_summaries",
    QUESTIONS: "estudaia_questions",
    GENERATED_QUESTIONS: "estudaia_generated_questions",
    FLASHCARDS: "estudaia_flashcards"
});

/**
 * Recupera dados armazenados.
 */
export function loadData(key, fallback = []) {
    try {
        const storedData = localStorage.getItem(key);

        if (storedData === null) {
            return fallback;
        }

        return JSON.parse(storedData);

    } catch (error) {
        console.error("Erro ao recuperar dados:", error);
        return fallback;
    }
}

/**
 * Salva dados no armazenamento local.
 */
export function saveData(key, data) {
    try {
        const serializedData = JSON.stringify(data);

        if (typeof serializedData !== "string") {
            throw new TypeError("Dados inválidos para armazenamento.");
        }

        localStorage.setItem(key, serializedData);

        return true;

    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        return false;
    }
}

/**
 * Remove um registro específico.
 */
export function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;

    } catch (error) {
        console.error("Erro ao remover dados:", error);
        return false;
    }
}

export { STORAGE_KEYS };