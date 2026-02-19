
import React from 'react';
import { AnalysisResult } from '../types';

interface JsonViewerProps {
    result: AnalysisResult;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ result }) => {
    const downloadJSON = () => {
        if (!result) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `pharmaguard_report_${result.patient_id}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        alert("Report copied to clipboard!");
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Title and Actions */}
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">Structured API Output (JSON)</h3>
                    <p className="text-xs text-gray-500">Exact backend response — unchanged for traceability</p>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={downloadJSON}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="Download JSON"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="Copy to Clipboard"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                    </button>
                </div>
            </div>

            {/* JSON Body */}
            <div className="bg-slate-50 p-4 overflow-x-auto">
                <pre className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default JsonViewer;
