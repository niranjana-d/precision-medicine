
import React from 'react';

interface DrugSelectorProps {
    selectedDrug: string;
    onDrugChange: (drug: string) => void;
    isLoading: boolean;
    onAnalyze: () => void;
    isAnalyzeDisabled: boolean;
}

const DrugSelector: React.FC<DrugSelectorProps> = ({ selectedDrug, onDrugChange, isLoading, onAnalyze, isAnalyzeDisabled }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Drug</label>
                <select
                    value={selectedDrug}
                    onChange={(e) => onDrugChange(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                    <option value="CODEINE">Codeine</option>
                    <option value="WARFARIN">Warfarin</option>
                    <option value="CLOPIDOGREL">Clopidogrel</option>
                    <option value="SIMVASTATIN">Simvastatin</option>
                    <option value="AZATHIOPRINE">Azathioprine</option>
                    <option value="FLUOROURACIL">Fluorouracil</option>
                </select>
            </div>

            <button
                onClick={onAnalyze}
                disabled={isAnalyzeDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
          ${isAnalyzeDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </span>
                ) : "Analyze Pharmacogenomic Risk"}
            </button>
        </div>
    );
};

export default DrugSelector;
