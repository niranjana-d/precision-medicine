// CPIC Rules for Pharmacogenomic Risk Prediction
// Based on presence of variants in specific genes.

const CPIC_RULES = {
    "WARFARIN": {
        gene: "CYP2C9",
        risk: "Adjust Dosage",
        severity: "Moderate",
        recommendation: "Lower initial dose and monitor INR",
        phenotype: "Intermediate Metabolizer" // Simplified for this logic
    },
    "CLOPIDOGREL": {
        gene: "CYP2C19",
        risk: "Ineffective",
        severity: "High",
        recommendation: "Consider alternative antiplatelet therapy",
        phenotype: "Poor Metabolizer"
    },
    "CODEINE": {
        gene: "CYP2D6",
        risk: "Toxic",
        severity: "Critical",
        recommendation: "Avoid codeine due to risk of morphine toxicity",
        phenotype: "Ultra-Rapid Metabolizer"
    },
    "SIMVASTATIN": {
        gene: "SLCO1B1",
        risk: "Toxic",
        severity: "High",
        recommendation: "Lower dose or consider alternative statin to avoid myopathy",
        phenotype: "Poor Function"
    },
    "AZATHIOPRINE": {
        gene: "TPMT",
        risk: "Toxic",
        severity: "High",
        recommendation: "Significantly reduce dose or select alternative",
        phenotype: "Poor Metabolizer"
    },
    "FLUOROURACIL": {
        gene: "DPYD",
        risk: "Toxic",
        severity: "Critical",
        recommendation: "Avoid use or drastically reduce dose",
        phenotype: "Poor Metabolizer"
    }
};

module.exports = CPIC_RULES;
