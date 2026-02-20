
import React from 'react';

interface DrugSelectorProps {
    selectedDrug: string;
    onDrugChange: (drug: string) => void;
    isLoading: boolean;
    onAnalyze: () => void;
    isAnalyzeDisabled: boolean;
}

const DRUGS = [
    { value: "WARFARIN", label: "Warfarin", gene: "CYP2C9" },
    { value: "CLOPIDOGREL", label: "Clopidogrel", gene: "CYP2C19" },
    { value: "CODEINE", label: "Codeine", gene: "CYP2D6" },
    { value: "SIMVASTATIN", label: "Simvastatin", gene: "SLCO1B1" },
    { value: "AZATHIOPRINE", label: "Azathioprine", gene: "TPMT" },
    { value: "FLUOROURACIL", label: "Fluorouracil", gene: "DPYD" },
];

const DrugSelector: React.FC<DrugSelectorProps> = ({ selectedDrug, onDrugChange, isLoading, onAnalyze, isAnalyzeDisabled }) => {
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Drug</label>
                <div className="relative">
                    <select
                        value={selectedDrug}
                        onChange={(e) => onDrugChange(e.target.value)}
                        className="appearance-none w-full bg-surface-800 border border-surface-500 text-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200 cursor-pointer hover:border-brand-500/40"
                    >
                        {DRUGS.map(d => (
                            <option key={d.value} value={d.value}>
                                {d.label} — {d.gene}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <button
                onClick={onAnalyze}
                disabled={isAnalyzeDisabled}
                className={`w-full flex justify-center items-center py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 
                    ${isAnalyzeDisabled
                        ? 'bg-surface-600 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Genome…
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Analyze Pharmacogenomic Risk
                    </span>
                )}
            </button>
        </div>
    );
};

export default DrugSelector;
