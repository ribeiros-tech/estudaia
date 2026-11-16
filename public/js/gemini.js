/**
 * EstudaIA
 * Módulo responsável pela comunicação com a inteligência artificial.
 */

const API_ENDPOINT = "/api/gemini";

/**
 * Envia uma solicitação para o serviço de IA.
 */
export async function generateContent(prompt, type = "summary", quantity = null) {
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new TypeError("O conteúdo solicitado não pode estar vazio.");
    }

    const allowedTypes = ["summary", "quiz", "flashcards"];

    if (!allowedTypes.includes(type)) {
        throw new Error("Tipo de conteúdo não suportado.");
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            prompt: prompt.trim(),
            type,
            quantity
            })
        })

        if (!response.ok) {
            throw new Error(`Erro na API: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.content) {
            throw new Error("A API retornou uma resposta vazia.");
        }

        return data.content;

    } catch (error) {
        console.error("Erro na comunicação com Gemini:", error);
        throw error;
    }
}