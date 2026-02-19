
import React from 'react';
import Card from './Card';
import Badge from './Badge';
import AIExplanation from './AIExplanation';
import JsonViewer from './JsonViewer';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
    result: AnalysisResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
    return (
        <div className="space-y-6">

            {/* Main Result Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <Card className="border-t-4 border-t-blue-500">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{result.drug} Analysis</h3>
                                <p className="text-sm text-gray-500 mt-1">Patient ID: {result.patient_id}</p>
                            </div>
                            <Badge
                                risk={result.risk_assessment.risk_label}
                                severity={result.risk_assessment.severity}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Gene</span>
                                <span className="block text-lg font-semibold text-gray-900 mt-1">{result.pharmacogenomics_profile.primary_gene}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Phenotype</span>
                                <span className="block text-lg font-semibold text-gray-900 mt-1">{result.pharmacogenomics_profile.phenotype}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence Score</span>
                                <span className="block text-lg font-semibold text-gray-900 mt-1">{(result.risk_assessment.confidence_score * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinical Recommendation</h4>
                            <p className="text-gray-700 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                                {result.clinical_recommendation.text}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI Explanation Panel */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <AIExplanation explanation={result.llm_generated_explanation} />
            </div>

            {/* JSON Viewer & Actions */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <JsonViewer result={result} />
            </div>

        </div>
    );
};

export default ResultsDisplay;
