const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
require('dotenv').config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Retries an async function with exponential backoff.
 */
async function withRetry(fn, maxRetries = 3, baseDelay = 2000) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.message && (error.message.includes('429') || error.message.includes('Too Many Requests'));
            if (isRateLimit && attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt); // 2s, 4s, 8s
                console.log(`Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

/**
 * Generates an explanation for the pharmacogenomic risk using Gemini.
 * @param {string} drug - Drug name
 * @param {string} gene - Gene name
 * @param {string} phenotype - Phenotype description
 * @param {string} riskLabel - Calculated risk label
 * @param {string} depth - "summary" or "expanded"
 * @returns {Promise<Object>} - Object with summary and expanded explanation
 */
async function generateExplanation(drug, gene, phenotype, riskLabel, depth = "summary") {
    try {
        // If no API key is set, return a fallback immediately to prevent crashing
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

        // 2. Call Gemini with retry
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        const result = await withRetry(async () => {
            return await model.generateContent(prompt);
        }, 3, 3000);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            return {
                summary: jsonResponse.summary || "Explanation unavailable.",
                expanded: jsonResponse.expanded || jsonResponse.details || "Detailed explanation unavailable."
            };
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", text);
            // If it's not valid JSON, use the raw text as summary
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
        summary: `${phenotype} phenotype detected for ${gene}. Risk for ${drug}: ${riskLabel}. (AI explanation temporarily unavailable — Gemini API rate limited)`,
        expanded: `The patient's ${gene} gene analysis reveals a ${phenotype} phenotype. For ${drug}, this results in a risk classification of "${riskLabel}". This assessment is based on CPIC pharmacogenomic guidelines. The AI-generated detailed explanation is temporarily unavailable due to API rate limits. Please retry shortly.`
    };
}

module.exports = { generateExplanation };
