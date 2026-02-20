const CPIC_RULES = require('../constants/cpicRules');
const { getPhenotype } = require('../constants/diplotypeLookup');

/**
 * Analyzes the pharmacogenomic risk for a specific drug based on parsed VCF data.
 * Uses real genotype data to determine diplotype and phenotype.
 *
 * @param {string} drugName - The name of the drug to analyze.
 * @param {Array<string>} parsedGenes - List of genes found in the VCF.
 * @param {Array<Object>} detectedVariants - Variant objects: { rsid, gene, genotype }
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
                phenotype: "Unknown",
                diplotype: "Unknown"
            }
        };
    }

    const targetGene = rule.gene;

    // Use diplotype lookup to determine real phenotype from genotype data
    const { diplotype, phenotype } = getPhenotype(targetGene, detectedVariants);

    // Look up phenotype-specific risk rule
    const phenotypeRule = rule.phenotypeRules[phenotype];

    if (phenotypeRule) {
        return {
            risk_label: phenotypeRule.risk,
            severity: phenotypeRule.severity,
            confidence_score: phenotypeRule.confidence,
            recommendation: phenotypeRule.recommendation,
            pharmacogenomics_profile: {
                primary_gene: targetGene,
                phenotype: phenotype,
                diplotype: diplotype
            }
        };
    }

    // Fallback: gene found but phenotype not in our rules
    // Use the default phenotype mapping
    const defaultRule = rule.phenotypeRules[rule.defaultPhenotype];
    return {
        risk_label: defaultRule ? defaultRule.risk : "Unknown",
        severity: defaultRule ? defaultRule.severity : "None",
        confidence_score: defaultRule ? defaultRule.confidence : 0.5,
        recommendation: defaultRule ? defaultRule.recommendation : "Consult clinical guidelines.",
        pharmacogenomics_profile: {
            primary_gene: targetGene,
            phenotype: phenotype || rule.defaultPhenotype,
            diplotype: diplotype || "Unknown"
        }
    };
}

module.exports = { analyzeRisk };
