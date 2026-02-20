import { AnalysisResult } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const analyzePatientData = async (file: File, drug: string): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('vcf_file', file);
    formData.append('drugs', drug);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data: AnalysisResult = await response.json();
    return data;
};
