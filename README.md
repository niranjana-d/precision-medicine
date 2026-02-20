# 🛡️ PharmaGuard — AI-Powered Pharmacogenomic Risk Analysis

> Real-time precision medicine platform that analyzes patient VCF (Variant Call Format) files to predict drug-gene interactions and pharmacogenomic risks using CPIC guidelines, RAG-augmented AI explanations, and diplotype-based phenotype classification.

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **VCF File Processing** | Parses uploaded VCF files in real-time to extract gene variants, rsIDs, and genotypes |
| **Diplotype → Phenotype Mapping** | Converts raw genotypes (`0/0`, `0/1`, `1/1`) into clinical phenotypes (Normal, Intermediate, Poor Metabolizer) via star allele assignment |
| **CPIC Rule Engine** | Applies evidence-based CPIC pharmacogenomic guidelines with phenotype-specific risk stratification |
| **RAG-Augmented AI Explanations** | Retrieves relevant CPIC guideline text via ChromaDB vector search, then generates clinical explanations using Google Gemini |
| **Multi-Model Fallback** | Automatically cycles through 5 Gemini models to maximize API availability |
| **Dark Clinical UI** | Premium glassmorphism dark theme built with React + Tailwind CSS 4 |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                    │
│  Upload VCF → Select Drug → View Risk + AI Explanation       │
└─────────────────────────┬────────────────────────────────────┘
                          │ POST /analyze (multipart)
┌─────────────────────────▼────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                  │
│                                                               │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │VCF Parser│→ │Diplotype     │→ │CPIC Rule Engine      │    │
│  │          │  │Lookup Table  │  │(Phenotype → Risk)    │    │
│  └──────────┘  └──────────────┘  └──────────┬───────────┘    │
│                                              │                │
│  ┌───────────────────────────────────────────▼──────────┐    │
│  │              Gemini Service                          │    │
│  │  RAG Context (FastAPI) + Gemini API → Explanation    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│               RAG SERVICE (FastAPI + ChromaDB)                │
│  CPIC guideline text → Vector embeddings → Context retrieval  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧬 Supported Drug-Gene Pairs

| Drug | Gene | Risk Scenarios |
|------|------|----------------|
| **Warfarin** | CYP2C9 | Safe → Adjust Dosage → Toxic (bleeding risk) |
| **Clopidogrel** | CYP2C19 | Safe → Reduced Effect → Ineffective |
| **Codeine** | CYP2D6 | Safe → Reduced Effect → Toxic (morphine toxicity) |
| **Simvastatin** | SLCO1B1 | Safe → Adjust Dosage → Toxic (myopathy) |
| **Azathioprine** | TPMT | Safe → Adjust Dosage → Toxic (myelosuppression) |
| **Fluorouracil** | DPYD | Safe → Adjust Dosage → Toxic (fatal toxicity) |

---

## 📁 Project Structure

```
precision-medicine/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Header.tsx            # Branded navigation bar
│   │   ├── FileUpload.tsx        # Drag-and-drop VCF upload
│   │   ├── DrugSelector.tsx      # Drug selection + analyze trigger
│   │   ├── ResultsDisplay.tsx    # Risk cards, variant chips, stats
│   │   ├── AIExplanation.tsx     # Gemini-powered clinical explanation
│   │   ├── JsonViewer.tsx        # Raw JSON response viewer
│   │   ├── Badge.tsx             # Color-coded risk badge
│   │   └── Card.tsx              # Glassmorphism card component
│   ├── services/api.ts           # Backend API client
│   ├── types/index.ts            # TypeScript interfaces
│   └── index.css                 # Dark theme + animations
│
├── backend/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js             # Express server entrypoint
│   │   ├── routes/analyze.js     # POST /analyze route handler
│   │   ├── services/
│   │   │   ├── vcfParser.js      # VCF file parser
│   │   │   ├── ruleEngine.js     # CPIC rule engine with diplotype logic
│   │   │   └── geminiService.js  # Gemini API + RAG + model fallback
│   │   ├── constants/
│   │   │   ├── cpicRules.js      # Phenotype-specific CPIC rules
│   │   │   └── diplotypeLookup.js # Genotype → star allele → phenotype
│   │   └── utils/
│   │       └── schemaBuilder.js  # JSON response schema builder
│   ├── mock_data/                # Sample VCF test files
│   └── .env                      # API keys (not committed)
│
├── rag_data/                     # RAG Service (Python + FastAPI)
│   ├── main.py                   # FastAPI server
│   ├── index_rag.py              # ChromaDB indexing script
│   ├── retrieve.py               # Vector similarity retrieval
│   ├── cpic/                     # CPIC guideline text documents
│   ├── mechanisms/               # Drug mechanism references
│   └── phenotypes/               # Phenotype classification data
│
└── chroma_db/                    # ChromaDB vector store (auto-generated)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+ and pip
- **Google Gemini API Key** — get one from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/precision-medicine.git
cd precision-medicine
```

### 2. Set Up the RAG Service (Python)

```bash
cd rag_data
pip install -r requirements.txt
python index_rag.py          # Index CPIC guidelines into ChromaDB
uvicorn main:app --port 8000  # Start RAG API
```

### 3. Set Up the Backend (Node.js)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

```bash
npm start   # Start Express server on port 3000
```

### 4. Set Up the Frontend (React)

```bash
cd ../   # Back to project root
npm install
npm run dev   # Start Vite dev server (port 5173)
```

### 5. Open in Browser

Navigate to **http://localhost:5173** — Upload a VCF file, select a drug, and click **Analyze**.

---

## 🧪 Testing with Sample VCF Files

Sample VCF files are provided in `backend/mock_data/`:

| File | Gene | Genotype | Expected Phenotype |
|------|------|----------|--------------------|
| `vcf_cyp2c9_im.vcf` | CYP2C9 | 0/1 (het) | Intermediate Metabolizer |
| `vcf_cyp2c19_pm.vcf` | CYP2C19 | 1/1 (homo) | Poor Metabolizer |
| `vcf_cyp2d6_ur.vcf` | CYP2D6 | 1/1 (homo) | Ultra-Rapid Metabolizer |
| `vcf_slco1b1_risk.vcf` | SLCO1B1 | 0/1 (het) | Intermediate Function |
| `vcf_tpmt_pm.vcf` | TPMT | 1/1 (homo) | Poor Metabolizer |
| `vcf_dpyd_deficient.vcf` | DPYD | 1/1 (homo) | Poor Metabolizer |
| `vcf_normal_all.vcf` | All | 0/0 (ref) | Normal Metabolizer |
| `vcf_multi_gene_combo.vcf` | Multiple | Mixed | Varies by drug selected |

---

## 🔧 API Reference

### `POST /analyze`

Analyzes a VCF file against a specific drug.

**Request** (multipart/form-data):

| Field | Type | Description |
|-------|------|-------------|
| `vcf_file` | File | VCF file (max 5MB) |
| `drugs` | String | Drug name (e.g., `WARFARIN`) |

**Response** (JSON):

```json
{
  "patient_id": "PATIENT_042",
  "drug": "WARFARIN",
  "timestamp": "2026-02-20T01:30:00.000Z",
  "risk_assessment": {
    "risk_label": "Adjust Dosage",
    "severity": "Moderate",
    "confidence_score": 0.9
  },
  "pharmacogenomics_profile": {
    "primary_gene": "CYP2C9",
    "phenotype": "Intermediate Metabolizer",
    "diplotype": "*1/*3"
  },
  "detected_variants": [
    { "rsid": "rs1057910", "gene": "CYP2C9", "genotype": "0/1" }
  ],
  "clinical_recommendation": {
    "text": "Lower initial dose and monitor INR closely due to reduced metabolism."
  },
  "llm_generated_explanation": {
    "summary": "CYP2C9 intermediate metabolizers have reduced warfarin metabolism...",
    "expanded": "The patient carries a CYP2C9 variant resulting in..."
  },
  "quality_metrics": {
    "vcf_parsing_success": true
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Vite 6 |
| **Backend** | Node.js, Express.js |
| **AI/LLM** | Google Gemini API (2.5-flash / 2.0-flash / 1.5-pro) |
| **RAG** | FastAPI, ChromaDB, Sentence-Transformers |
| **Data Format** | VCF v4.2 (Variant Call Format) |
| **Guidelines** | CPIC (Clinical Pharmacogenetics Implementation Consortium) |

---

## ⚠️ Important Notes

- **Not for clinical use** — This is a research/educational tool. Do not use for real medical decisions.
- **API Key Security** — Never commit your `.env` file. Add it to `.gitignore`.
- **Free Tier Limits** — Gemini free-tier has daily per-model quotas. The multi-model fallback chain mitigates this.

---

## 📜 License

ISC License

---

## 👥 Contributors

Built for **RIFT 2026** HACKATHON Pharmacogenomics / Explainable AI Track.
