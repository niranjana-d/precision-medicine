import React, { useState } from 'react';

// --- Types ---
interface RiskAssessment {
  risk_label: string;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  confidence_score: number;
}

interface PharmacogenomicsProfile {
  primary_gene: string;
  phenotype: string;
}

interface ClinicalRecommendation {
  text: string;
}

interface AIExplanation {
  summary: string;
  expanded?: string;
}

interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomics_profile: PharmacogenomicsProfile;
  detected_variants: Array<{ rsid: string; gene: string; genotype?: string }>;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: AIExplanation;
  quality_metrics: { vcf_parsing_success: boolean };
}

// --- Mock Data ---
const MOCK_DATA: AnalysisResult = {
  patient_id: "PATIENT_001",
  drug: "WARFARIN",
  timestamp: new Date().toISOString(),
  risk_assessment: {
    risk_label: "Adjust Dosage",
    severity: "Moderate",
    confidence_score: 0.9
  },
  pharmacogenomics_profile: {
    primary_gene: "CYP2C9",
    phenotype: "Intermediate Metabolizer"
  },
  detected_variants: [
    { rsid: "rs1057910", gene: "CYP2C9", genotype: "0/1" }
  ],
  clinical_recommendation: {
    text: "Lower initial dose and monitor INR closely due to reduced metabolism."
  },
  llm_generated_explanation: {
    summary: "CYP2C9 variants reduce warfarin metabolism, increasing bleeding risk.",
    expanded: "The patient carries a CYP2C9 variant (Intermediate Metabolizer). This results in reduced enzyme activity and slower clearance of Warfarin. Standard dosing may lead to supra-therapeutic INR levels and increased risk of hemorrhage. Clinical guidelines recommend starting with a lower dose and frequent monitoring."
  },
  quality_metrics: {
    vcf_parsing_success: true
  }
};

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-gray-200 py-4 mb-8">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PharmaGuard</h1>
      <p className="text-sm text-gray-500">AI-assisted Pharmacogenomic Risk Analysis</p>
    </div>
  </header>
);

const Badge = ({ risk, severity }: { risk: string, severity: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";

  if (risk === "Safe") colorClass = "bg-green-100 text-green-800 border-green-200";
  else if (risk === "Adjust Dosage") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  else if (risk === "Toxic" || risk === "Ineffective") colorClass = "bg-red-100 text-red-800 border-red-200";
  else if (risk === "Unknown") colorClass = "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
      {risk} • {severity} Severity
    </span>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [drug, setDrug] = useState<string>("WARFARIN");
  const [explanationDepth, setExplanationDepth] = useState<"summary" | "expanded">("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    // Simulate API call with Mock Data
    setTimeout(() => {
      setResult({
        ...MOCK_DATA,
        drug: drug, // Update mock to match selected drug for realism
        timestamp: new Date().toISOString()
      });
      setIsLoading(false);
    }, 1500);
  };

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Patient Data Input</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">VCF File Upload</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".vcf" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    .vcf files up to 5MB
                  </p>
                  {file && <p className="text-sm font-semibold text-green-600 mt-2">{file.name}</p>}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Drug</label>
                <select
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explanation Depth</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600 focus:ring-blue-500"
                      name="depth"
                      value="summary"
                      checked={explanationDepth === "summary"}
                      onChange={() => setExplanationDepth("summary")}
                    />
                    <span className="ml-2 text-gray-700">Summary</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600 focus:ring-blue-500"
                      name="depth"
                      value="expanded"
                      checked={explanationDepth === "expanded"}
                      onChange={() => setExplanationDepth("expanded")}
                    />
                    <span className="ml-2 text-gray-700">Expanded</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
                  ${!file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
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
          </div>
        </Card>

        {/* Results Section */}
        {result && (
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
              <Card>
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Insight
                  </h3>
                  <span className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded bg-gray-200">
                    Powered by Gemini
                  </span>
                </div>
                <div className="p-6 transition-all duration-300 ease-in-out">
                  <p className="text-gray-700 leading-relaxed">
                    {result.llm_generated_explanation.summary}
                  </p>
                  {explanationDepth === 'expanded' && result.llm_generated_explanation.expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Mechanism</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {result.llm_generated_explanation.expanded}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* JSON Viewer & Actions */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
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
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
