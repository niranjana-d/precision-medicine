
import React, { useState } from 'react';
import Card from './Card';
import { AIExplanation as AIExplanationType } from '../types';

interface AIExplanationProps {
    explanation: AIExplanationType;
}

const AIExplanation: React.FC<AIExplanationProps> = ({ explanation }) => {
    const [depth, setDepth] = useState<"summary" | "expanded">("summary");

    return (
        <Card>
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-600/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-purple-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">AI Clinical Insight</h3>
                        <p className="text-[10px] text-slate-500">Powered by Gemini + RAG</p>
                    </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center bg-surface-800 rounded-lg p-0.5 border border-surface-600/50">
                    <button
                        onClick={() => setDepth("summary")}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                            ${depth === "summary"
                                ? 'bg-brand-500/20 text-brand-300 shadow-sm'
                                : 'text-slate-400 hover:text-slate-300'
                            }`}
                    >
                        Summary
                    </button>
                    <button
                        onClick={() => setDepth("expanded")}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                            ${depth === "expanded"
                                ? 'bg-brand-500/20 text-brand-300 shadow-sm'
                                : 'text-slate-400 hover:text-slate-300'
                            }`}
                    >
                        Detailed
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                <p className="text-slate-200 leading-relaxed text-sm">
                    {explanation.summary}
                </p>
                {depth === 'expanded' && explanation.expanded && (
                    <div className="mt-4 pt-4 border-t border-surface-600/30 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full bg-purple-glow/60"></div>
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Mechanism</h5>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed pl-3">
                            {explanation.expanded}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AIExplanation;
