
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface JsonViewerProps {
    result: AnalysisResult;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ result }) => {
    const [copied, setCopied] = useState(false);

    const downloadJSON = () => {
        if (!result) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", `pharmaguard_report_${result.patient_id}.json`);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    };

    const copyToClipboard = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="px-6 py-3 border-b border-surface-600/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Structured API Response
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Raw JSON output — unchanged for traceability</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={downloadJSON}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-700 border border-surface-500 rounded-lg text-xs font-medium text-slate-300 hover:bg-surface-600 hover:border-brand-500/30 hover:text-white transition-all duration-200"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
                            ${copied
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-surface-700 border-surface-500 text-slate-300 hover:bg-surface-600 hover:border-brand-500/30 hover:text-white'
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* JSON Body */}
            <div className="bg-surface-950/50 p-5 overflow-x-auto">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default JsonViewer;
