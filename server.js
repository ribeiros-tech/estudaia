require("dotenv").config();


const express = require("express");
const app = express();

const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    console.error("Erro: GEMINI_API_KEY não configurada.");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "1mb" }));

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`EstudaIA rodando na porta ${PORT}`);
});

// Rota de comunicação com a API Gemini
app.post("/api/gemini", async (req, res) => {
   const { prompt, type = "summary", quantity = 10 } = req.body || {};
   console.log("TIPO:", type);
   console.log("QUANTIDADE RECEBIDA:", quantity);

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({
            error: "O conteúdo não pode estar vazio."
        });
    }

    if (
    type === "flashcards" &&
    (!Number.isInteger(quantity) || quantity < 5 || quantity > 30)
) {
    return res.status(400).json({
        error: "A quantidade de flashcards deve ser um número inteiro entre 5 e 30."
    });
}
    
const instructions = {
   
summary: `Crie um resumo aprofundado, organizado, didático e completo sobre o conteúdo fornecido.

O objetivo é produzir um material de estudo que permita ao estudante compreender os conceitos apresentados, suas características, funcionamento e aplicações.

Retorne exclusivamente um JSON válido, sem markdown ou texto adicional, seguindo esta estrutura:

{
    "titulo": "Título do resumo",
    "introducao": "Introdução detalhada ao assunto",
    "componentes_principais": [
        {
            "componente": "Nome do conceito",
            "descricao": "Explicação completa e didática do conceito"
        }
    ],
    "conclusao": "Conclusão detalhada do conteúdo"
}

Instruções de qualidade:

1. INTRODUÇÃO:
- Apresente o conceito central do assunto.
- Explique sua importância e finalidade.
- Contextualize sua utilização na área de conhecimento.

2. COMPONENTES PRINCIPAIS:
- Identifique os conceitos fundamentais do conteúdo.
- Explique cada conceito em parágrafos completos.
- Apresente características, funcionalidades e objetivos.
- Explique como os conceitos se relacionam.
- Inclua exemplos práticos quando forem pertinentes e sustentados pelo conteúdo.
- Evite definições superficiais ou respostas de apenas uma frase.
- Utilize quantos componentes forem necessários para abordar adequadamente o assunto.

3. CONCLUSÃO:
- Retome os principais conceitos apresentados.
- Explique a importância do assunto.
- Apresente uma síntese que facilite a revisão e a aprendizagem.

REGRAS GERAIS:
- Utilize linguagem clara, didática e tecnicamente correta.
- Preserve os conceitos e informações do material fornecido.
- Não invente informações, exemplos ou dados.
- Não repita desnecessariamente as mesmas explicações.
- Priorize a compreensão e a qualidade do material.
- Não reduza o conteúdo a definições excessivamente curtas.
- Retorne somente JSON válido.`,

    quiz: `Crie exatamente 5 questões de múltipla escolha sobre o conteúdo fornecido.
Cada questão deve conter:
- Um enunciado claro.
- Quatro alternativas (A, B, C e D).
- Apenas uma resposta correta.
- Gabarito.
- Explicação da resposta correta.
- Explicação individual de cada alternativa.

Retorne exclusivamente um JSON válido, sem markdown ou texto adicional, seguindo esta estrutura:

{
    "questoes": [
        {
            "pergunta": "Enunciado",
            "alternativas": {
                "A": "Alternativa A",
                "B": "Alternativa B",
                "C": "Alternativa C",
                "D": "Alternativa D"
            },
            "gabarito": "A",
            "explicacao": "Explicação da resposta correta",
            "explicacoes_alternativas": {
                "A": "Explicação da alternativa A",
                "B": "Explicação da alternativa B",
                "C": "Explicação da alternativa C",
                "D": "Explicação da alternativa D"
            }
        }
    ]
}

Não escreva texto fora do JSON.
Não utilize comentários.
Garanta que existam exatamente 5 questões.`,

    flashcards: `Crie exatamente ${quantity} flashcards de estudo sobre o conteúdo fornecido.

Cada flashcard deve conter uma pergunta e uma resposta clara e didática.

Retorne exclusivamente um JSON válido, sem markdown ou texto adicional, seguindo esta estrutura:

{"flashcards":[{"pergunta":"Pergunta do cartão","resposta":"Resposta do cartão"}]}

Não escreva texto fora do JSON.`
};



    if (!instructions[type]) {
        return res.status(400).json({
            error: "Tipo de conteúdo não suportado."
        });
    }

    
try {
    let response;
    let tentativas = 0;
    const maxTentativas = 3;

    while (tentativas < maxTentativas) {
        try {
            response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    config: {
    maxOutputTokens: 8192,
    responseMimeType: "application/json"
    },
    contents: `${instructions[type]}\n\nConteúdo:\n${prompt.trim()}`
});

            break;

        } catch (error) {
            tentativas++;

            if (
                (error.status === 503 || error.status === 429) &&
                tentativas < maxTentativas
            ) {
                console.log(`Tentativa ${tentativas} falhou. Tentando novamente...`);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                throw error;
            }
        }
    }

    const content = response.text;

    console.log("TIPO RECEBIDO:", type);
    
    if (!content) {
        throw new Error("Resposta vazia do Gemini.");
    }

    res.json({ content });



   
} catch (error) {
    console.error("Erro ao consultar Gemini:", error);

    if (error.status === 503) {
        return res.status(503).json({
            error: "A IA está temporariamente sobrecarregada. Tente novamente em alguns segundos."
        });
    }

    if (error.status === 429) {
        return res.status(429).json({
            error: "Limite de solicitações atingido. Aguarde um pouco e tente novamente."
        });
    }

    res.status(500).json({
        error: "Não foi possível gerar o conteúdo com a IA."
    });
}
});
