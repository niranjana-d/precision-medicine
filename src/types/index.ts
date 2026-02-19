
export interface RiskAssessment {
    risk_label: string;
    severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
    confidence_score: number;
}

export interface PharmacogenomicsProfile {
    primary_gene: string;
    phenotype: string;
}

export interface ClinicalRecommendation {
    text: string;
}

export interface AIExplanation {
    summary: string;
    expanded?: string;
}

export interface AnalysisResult {
    patient_id: string;
    drug: string;
    timestamp: string;
    risk_assessment: RiskAssessment;
    pharmacogenomics_profile: PharmacogenomicsProfile;
    detected_variants: Array<{ rsid: string; gene: string; genotype?: string }>;
    clinical_recommendation: ClinicalRecommendation;
    llm_generated_explanation: AIExplanation;
    quality_metrics: { vcf_parsing_success: boolean };
}
