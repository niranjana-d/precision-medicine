const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
require('dotenv').config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback chain — each has a separate daily free-tier quota
const MODEL_CHAIN = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
];

/**
 * Tries calling Gemini with a chain of models.
 * If one model is rate-limited (429), moves to the next.
 */
async function callWithModelFallback(prompt) {
    for (const modelName of MODEL_CHAIN) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`✓ Success with model: ${modelName}`);
            return text;
        } catch (error) {
            const isRateLimit = error.message && (
                error.message.includes('429') ||
                error.message.includes('Too Many Requests') ||
                error.message.includes('quota')
            );
            const isNotFound = error.message && error.message.includes('404');

            if (isRateLimit || isNotFound) {
                console.warn(`✗ ${modelName} unavailable: ${isRateLimit ? 'Rate limited' : 'Not found'}. Trying next...`);
                continue; // Try next model
            }
            throw error; // Non-rate-limit error, re-throw
        }
    }
    throw new Error("All Gemini models exhausted (rate limited).");
}

/**
 * Generates an explanation for the pharmacogenomic risk using Gemini.
 */
async function generateExplanation(drug, gene, phenotype, riskLabel, depth = "summary") {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY is missing. Using fallback explanation.");
            return getFallbackExplanation(drug, gene, phenotype, riskLabel);
        }

        // 1. Retrieve RAG Context
        let retrievedContext = "";
        try {
            const ragResponse = await axios.post('http://localhost:8000/explain', {
                gene: gene,
                drug: drug,
                phenotype: phenotype
            });
            retrievedContext = ragResponse.data.retrieved_context;
            console.log("RAG Context Retrieved:", retrievedContext ? "Yes" : "No");
        } catch (ragError) {
            console.error("RAG Service Unavailable:", ragError.message);
            retrievedContext = "CPIC guidelines unavailable at this time.";
        }

        // 2. Build prompt
        const prompt = `
            You are a clinical pharmacogenomics advisor generating a concise explanation.

            Use ONLY the CPIC guideline text provided below.
            Do NOT make clinical decisions.
            Do NOT recommend specific dosages.
            Do NOT add external medical knowledge beyond what is provided.

            CPIC GUIDELINE TEXT:
            <<<
            ${retrievedContext}
            >>>

            Patient Data:
            - Gene: ${gene}
            - Phenotype: ${phenotype}
            - Drug: ${drug}
            - Risk Assessment: ${riskLabel}

            Provide two outputs in JSON format:
            1. "summary": A concise 1-sentence clinical summary based strictly on the context above. Mention the gene, phenotype, drug, and risk.
            2. "expanded": A detailed explanation (3-4 sentences) citing the guideline text provided. Explain the mechanism of how the phenotype affects drug response.
            
            Output ONLY raw JSON. No markdown, no code fences.
        `;

        // 3. Call Gemini with model fallback chain
        const text = await callWithModelFallback(prompt);

        // 4. Parse response
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            return {
                summary: jsonResponse.summary || "Explanation unavailable.",
                expanded: jsonResponse.expanded || jsonResponse.details || "Detailed explanation unavailable."
            };
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", text);
            return {
                summary: cleanText.substring(0, 200),
                expanded: cleanText
            };
        }

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return getFallbackExplanation(drug, gene, phenotype, riskLabel);
    }
}

function getFallbackExplanation(drug, gene, phenotype, riskLabel) {
    return {
        summary: `${phenotype} phenotype detected for ${gene}. Risk for ${drug}: ${riskLabel}. (AI explanation temporarily unavailable — all model quotas exhausted)`,
        expanded: `The patient's ${gene} gene analysis reveals a ${phenotype} phenotype. For ${drug}, this results in a risk classification of "${riskLabel}". This assessment is based on CPIC pharmacogenomic guidelines. The AI-generated detailed explanation is temporarily unavailable due to API rate limits. Please retry shortly.`
    };
}

module.exports = { generateExplanation };
