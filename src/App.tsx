
import React, { useState } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import FileUpload from './components/FileUpload';
import DrugSelector from './components/DrugSelector';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzePatientData } from './services/api';
import { AnalysisResult } from './types';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [drug, setDrug] = useState<string>("WARFARIN");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzePatientData(file, drug);
      setResult(data);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "Analysis failed. Please check the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern font-sans text-slate-200 pb-16">
      <Header />

      <main className="max-w-5xl mx-auto px-6 space-y-6">

        {/* Input Section */}
        <div className="animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-5 rounded-full bg-brand-500"></div>
              <h2 className="text-base font-bold text-white">Patient Data Input</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload file={file} onFileChange={handleFileChange} />
              <DrugSelector
                selectedDrug={drug}
                onDrugChange={setDrug}
                isLoading={isLoading}
                onAnalyze={handleAnalyze}
                isAnalyzeDisabled={!file || isLoading}
              />
            </div>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="animate-scale-in">
            <Card className="p-5 border-l-2 border-red-500/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-300 font-semibold text-sm">Analysis Error</p>
                  <p className="text-red-400/80 text-xs mt-0.5">{error}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <ResultsDisplay result={result} />
        )}

        {/* Footer */}
        <footer className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-600">
            PharmaGuard v1.0 — Built for Precision Medicine Research
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
