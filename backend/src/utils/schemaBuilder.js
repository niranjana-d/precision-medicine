/**
 * Constructs the final JSON response adhering to the standardized schema.
 */
function buildResponse(patientId, drug, riskData, detectedVariants, explanation, parsingSuccess = true) {
    return {
        patient_id: patientId,
        drug: drug.toUpperCase(),
        timestamp: new Date().toISOString(),
        risk_assessment: {
            risk_label: riskData.risk_label,
            severity: riskData.severity,
            confidence_score: riskData.confidence_score
        },
        pharmacogenomics_profile: {
            primary_gene: riskData.pharmacogenomics_profile.primary_gene,
            phenotype: riskData.pharmacogenomics_profile.phenotype,
            diplotype: riskData.pharmacogenomics_profile.diplotype || "Unknown"
        },
        detected_variants: detectedVariants, // [{ rsid, gene, genotype }]
        clinical_recommendation: {
            text: riskData.recommendation
        },
        llm_generated_explanation: {
            summary: explanation.summary,
            expanded: explanation.expanded
        },
        quality_metrics: {
            vcf_parsing_success: parsingSuccess
        }
    };
}

module.exports = { buildResponse };
