const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
            return getFallbackExplanation(drug, gene, riskLabel);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Act as a clinical pharmacogenomics expert.
      Explain the interaction between the gene ${gene} and the drug ${drug}.
      Patient Phenotype: ${phenotype}
      Assessed Risk: ${riskLabel}

      Provide two outputs in JSON format:
      1. "summary": A concise 1-sentence clinical summary.
      2. "expanded": A detailed explanation of the biological mechanism and clinical implications (approx 3-4 sentences).

      Do not provide medical advice or specific dosage recommendations for the user to follow, but explain the *reason* for the risk.
      Output ONLY raw JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            // Ensure keys match what we need
            return {
                summary: jsonResponse.summary || "Explanation unavailable.",
                expanded: jsonResponse.expanded || jsonResponse.details || "Detailed explanation unavailable."
            };
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", text);
            return getFallbackExplanation(drug, gene, riskLabel);
        }

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return getFallbackExplanation(drug, gene, riskLabel);
    }
}

function getFallbackExplanation(drug, gene, riskLabel) {
    return {
        summary: `Interaction detected between ${drug} and ${gene}. Risk: ${riskLabel}. (AI Service Unavailable)`,
        expanded: `The patient carries variants in the ${gene} gene which are known to affect the metabolism or effect of ${drug}. This creates a risk classified as '${riskLabel}'. Verify with CPIC guidelines.`
    };
}

module.exports = { generateExplanation };
