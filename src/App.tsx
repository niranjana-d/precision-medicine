
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Patient Data Input</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* File Upload */}
            <FileUpload file={file} onFileChange={handleFileChange} />

            {/* Controls */}
            <DrugSelector
              selectedDrug={drug}
              onDrugChange={setDrug}
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
              isAnalyzeDisabled={!file || isLoading}
            />
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-6 border-l-4 border-red-500 bg-red-50">
            <p className="text-red-700 font-medium">⚠ Analysis Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </Card>
        )}

        {/* Results Section */}
        {result && (
          <ResultsDisplay result={result} />
        )}
      </main>
    </div>
  );
}

export default App;
