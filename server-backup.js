require("dotenv").config();


const express = require("express");
const app = express();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

app.use(express.static("."));

app.listen(3000, () => {
    console.log("EstudaIA rodando em http://localhost:3000");
});
// Rota de comunicação com a API Gemini
app.post("/api/gemini", async (req, res) => {
    const { prompt, type = "summary" } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({
            error: "O conteúdo não pode estar vazio."
        });
    }

    const instructions = {
        summary: "Crie um resumo organizado, claro e didático sobre o conteúdo a seguir. Destaque os conceitos mais importantes.",

        quiz: "Crie um questionário com 10 questões de múltipla escolha sobre o conteúdo. Apresente as alternativas e o gabarito comentado ao final.",

        flashcards: "Crie flashcards para estudo. Apresente uma pergunta na frente e sua respectiva resposta no verso."
    };

    if (!instructions[type]) {
        return res.status(400).json({
            error: "Tipo de conteúdo não suportado."
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `${instructions[type]}\n\nConteúdo:\n${prompt.trim()}`
        });

        const content = response.text;

        if (!content) {
            throw new Error("Resposta vazia do Gemini.");
        }

        res.json({ content });

    } catch (error) {
        console.error("Erro ao consultar Gemini:", error);

        res.status(500).json({
            error: "Não foi possível gerar o conteúdo com a IA."
        });
    }
});
