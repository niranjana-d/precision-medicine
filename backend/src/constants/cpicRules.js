// CPIC Rules for Pharmacogenomic Risk Prediction
// Expanded with phenotype-specific risk/severity/recommendation mappings.

const CPIC_RULES = {
    "WARFARIN": {
        gene: "CYP2C9",
        phenotypeRules: {
            "Normal Metabolizer": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Metabolizer": { risk: "Adjust Dosage", severity: "Moderate", confidence: 0.90, recommendation: "Lower initial dose and monitor INR closely due to reduced metabolism." },
            "Poor Metabolizer": { risk: "Toxic", severity: "High", confidence: 0.95, recommendation: "Significantly reduce dose. High risk of bleeding due to severely reduced CYP2C9 metabolism." }
        },
        defaultPhenotype: "Normal Metabolizer"
    },
    "CLOPIDOGREL": {
        gene: "CYP2C19",
        phenotypeRules: {
            "Normal Metabolizer": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Metabolizer": { risk: "Reduced Effect", severity: "Moderate", confidence: 0.85, recommendation: "Consider increased dose or alternative antiplatelet therapy due to reduced activation." },
            "Poor Metabolizer": { risk: "Ineffective", severity: "High", confidence: 0.95, recommendation: "Consider alternative antiplatelet therapy. Clopidogrel is ineffective in CYP2C19 poor metabolizers." }
        },
        defaultPhenotype: "Normal Metabolizer"
    },
    "CODEINE": {
        gene: "CYP2D6",
        phenotypeRules: {
            "Normal Metabolizer": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Metabolizer": { risk: "Reduced Effect", severity: "Low", confidence: 0.80, recommendation: "May have reduced analgesic effect. Monitor pain control." },
            "Ultra-Rapid Metabolizer": { risk: "Toxic", severity: "Critical", confidence: 0.95, recommendation: "Avoid codeine. Ultra-rapid metabolism causes excessive morphine conversion, risk of fatal respiratory depression." }
        },
        defaultPhenotype: "Normal Metabolizer"
    },
    "SIMVASTATIN": {
        gene: "SLCO1B1",
        phenotypeRules: {
            "Normal Function": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Function": { risk: "Adjust Dosage", severity: "Moderate", confidence: 0.85, recommendation: "Lower dose or consider alternative statin. Increased risk of myopathy with standard doses." },
            "Poor Function": { risk: "Toxic", severity: "High", confidence: 0.95, recommendation: "Avoid simvastatin or use lowest dose. High risk of myopathy due to impaired hepatic uptake." }
        },
        defaultPhenotype: "Normal Function"
    },
    "AZATHIOPRINE": {
        gene: "TPMT",
        phenotypeRules: {
            "Normal Metabolizer": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Metabolizer": { risk: "Adjust Dosage", severity: "Moderate", confidence: 0.90, recommendation: "Reduce dose by 30-50%. Monitor for myelosuppression." },
            "Poor Metabolizer": { risk: "Toxic", severity: "High", confidence: 0.95, recommendation: "Drastically reduce dose (10% of standard) or select alternative. High risk of fatal myelosuppression." }
        },
        defaultPhenotype: "Normal Metabolizer"
    },
    "FLUOROURACIL": {
        gene: "DPYD",
        phenotypeRules: {
            "Normal Metabolizer": { risk: "Safe", severity: "None", confidence: 0.95, recommendation: "Standard dosing guidelines apply." },
            "Intermediate Metabolizer": { risk: "Adjust Dosage", severity: "High", confidence: 0.90, recommendation: "Reduce dose by at least 50%. Increased risk of severe toxicity." },
            "Poor Metabolizer": { risk: "Toxic", severity: "Critical", confidence: 0.95, recommendation: "Avoid fluorouracil entirely. DPYD deficiency causes life-threatening toxicity." }
        },
        defaultPhenotype: "Normal Metabolizer"
    }
};

module.exports = CPIC_RULES;
