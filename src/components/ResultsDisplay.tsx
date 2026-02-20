
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
    // Determine accent color based on risk
    const risk = result.risk_assessment.risk_label;
    let accentBorder = "border-brand-500/40";
    let accentGlow = "from-brand-500/10";
    if (risk === "Safe") { accentBorder = "border-emerald-500/40"; accentGlow = "from-emerald-500/10"; }
    else if (risk === "Adjust Dosage" || risk === "Reduced Effect") { accentBorder = "border-amber-500/40"; accentGlow = "from-amber-500/10"; }
    else if (risk === "Toxic" || risk === "Ineffective") { accentBorder = "border-red-500/40"; accentGlow = "from-red-500/10"; }

    const confidencePercent = (result.risk_assessment.confidence_score * 100).toFixed(0);

    return (
        <div className="space-y-6">

            {/* Main Result Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <Card className={`border-t-2 ${accentBorder} relative overflow-hidden`}>
                    {/* Subtle top glow */}
                    <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${accentGlow} to-transparent pointer-events-none`}></div>

                    <div className="relative p-6">

                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">{result.drug} Analysis</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-slate-400 font-mono">{result.patient_id}</span>
                                    <span className="text-xs text-slate-600">•</span>
                                    <span className="text-xs text-slate-400">{new Date(result.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                            <Badge
                                risk={result.risk_assessment.risk_label}
                                severity={result.risk_assessment.severity}
                            />
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                            <StatCard label="Primary Gene" value={result.pharmacogenomics_profile.primary_gene} icon="🧬" />
                            <StatCard label="Phenotype" value={result.pharmacogenomics_profile.phenotype} icon="🔬" />
                            <StatCard label="Diplotype" value={result.pharmacogenomics_profile.diplotype || "N/A"} icon="🧪" />
                            <StatCard label="Confidence" value={`${confidencePercent}%`} icon="📊" />
                        </div>

                        {/* Detected Variants */}
                        {result.detected_variants.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Variants</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.detected_variants.map((v, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-700 rounded-lg text-xs font-mono text-slate-300 border border-surface-500">
                                            <span className="text-brand-400">{v.rsid}</span>
                                            <span className="text-slate-500">|</span>
                                            <span className="text-cyan-glow">{v.gene}</span>
                                            {v.genotype && (
                                                <>
                                                    <span className="text-slate-500">|</span>
                                                    <span className="text-purple-glow">{v.genotype}</span>
                                                </>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clinical Recommendation */}
                        <div>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clinical Recommendation</h4>
                            <div className={`p-4 rounded-xl border-l-3 ${accentBorder} bg-surface-800/50`}>
                                <p className="text-slate-200 text-sm leading-relaxed">
                                    {result.clinical_recommendation.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI Explanation Panel */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <AIExplanation explanation={result.llm_generated_explanation} />
            </div>

            {/* JSON Viewer */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <JsonViewer result={result} />
            </div>
        </div>
    );
};

// Small stat display component
const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-surface-800/60 rounded-xl p-4 border border-surface-600/50 hover:border-brand-500/20 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{icon}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        <span className="block text-base font-bold text-white">{value}</span>
    </div>
);

export default ResultsDisplay;
