const CPIC_RULES = require('../constants/cpicRules');

/**
 * analyzes the risk for a specific drug based on parsed genes.
 * @param {string} drugName - The name of the drug to analyze.
 * @param {Array<string>} parsedGenes - List of genes found in the VCF info tags.
 * @param {Array<Object>} detectedVariants - List of variant objects found.
 * @returns {Object} - Risk assessment object.
 */
function analyzeRisk(drugName, parsedGenes, detectedVariants) {
    const normalizedDrug = drugName.toUpperCase();
    const rule = CPIC_RULES[normalizedDrug];

    if (!rule) {
        return {
            risk_label: "Unknown",
            severity: "None",
            confidence_score: 0.0,
            recommendation: "No CPIC guidelines found for this drug.",
            pharmacogenomics_profile: {
                primary_gene: "Unknown",
                phenotype: "Unknown"
            }
        };
    }

    // Logic: Check if the required gene is present in the parsed genes list.
    // If present, we assume a variant exists that triggers the rule.
    const isGeneVariantPresent = parsedGenes.includes(rule.gene);

    if (isGeneVariantPresent) {
        return {
            risk_label: rule.risk,
            severity: rule.severity,
            confidence_score: 0.9, // High confidence as we found the gene variant
            recommendation: rule.recommendation,
            pharmacogenomics_profile: {
                primary_gene: rule.gene,
                phenotype: rule.phenotype
            }
        };
    } else {
        return {
            risk_label: "Safe",
            severity: "None",
            confidence_score: 0.95, // High confidence that it is safe (no variant found)
            recommendation: "Standard dosing guidelines apply.",
            pharmacogenomics_profile: {
                primary_gene: rule.gene,
                phenotype: "Normal Metabolizer"
            }
        };
    }
}

module.exports = { analyzeRisk };
