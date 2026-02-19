
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
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Insight
                </h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-blue-600 focus:ring-blue-500"
                                name="depth"
                                value="summary"
                                checked={depth === "summary"}
                                onChange={() => setDepth("summary")}
                            />
                            <span className="ml-1 text-gray-600">Summary</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-blue-600 focus:ring-blue-500"
                                name="depth"
                                value="expanded"
                                checked={depth === "expanded"}
                                onChange={() => setDepth("expanded")}
                            />
                            <span className="ml-1 text-gray-600">Expanded</span>
                        </label>
                    </div>
                    <span className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded bg-gray-200 hidden sm:inline-block">
                        Powered by Gemini
                    </span>
                </div>
            </div>
            <div className="p-6 transition-all duration-300 ease-in-out">
                <p className="text-gray-700 leading-relaxed">
                    {explanation.summary}
                </p>
                {depth === 'expanded' && explanation.expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Mechanism</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {explanation.expanded}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AIExplanation;
