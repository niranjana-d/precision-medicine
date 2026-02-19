import { AnalysisResult } from '../types';

// --- Mock Data ---
const MOCK_DATA: Omit<AnalysisResult, 'drug' | 'timestamp'> = {
    patient_id: "PATIENT_001",
    risk_assessment: {
        risk_label: "Adjust Dosage",
        severity: "Moderate",
        confidence_score: 0.9
    },
    pharmacogenomics_profile: {
        primary_gene: "CYP2C9",
        phenotype: "Intermediate Metabolizer"
    },
    detected_variants: [
        { rsid: "rs1057910", gene: "CYP2C9", genotype: "0/1" }
    ],
    clinical_recommendation: {
        text: "Lower initial dose and monitor INR closely due to reduced metabolism."
    },
    llm_generated_explanation: {
        summary: "CYP2C9 variants reduce warfarin metabolism, increasing bleeding risk.",
        expanded: "The patient carries a CYP2C9 variant (Intermediate Metabolizer). This results in reduced enzyme activity and slower clearance of Warfarin. Standard dosing may lead to supra-therapeutic INR levels and increased risk of hemorrhage. Clinical guidelines recommend starting with a lower dose and frequent monitoring."
    },
    quality_metrics: {
        vcf_parsing_success: true
    }
};

export const analyzePatientData = async (_file: File, drug: string): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...MOCK_DATA,
                drug: drug,
                timestamp: new Date().toISOString()
            } as AnalysisResult);
        }, 1500);
    });
};
