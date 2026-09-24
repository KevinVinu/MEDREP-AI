# MedRep AI - Clinical NLP & Medical Report Simplifier

MedRep AI transforms complex medical records, lab reports, and clinical notes into patient-friendly, 6th-grade readable explanations and downloadable color-coded summary PDFs.

## Architecture

- **Backend / ML Engine:** Python (FastAPI, PyMuPDF OCR, Google Gemini AI / Clinical NLP, ReportLab PDF Engine)
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Spline 3D

## Features

- **Multi-format Ingestion:** Upload PDF, DOCX, TXT, or image-based medical records.
- **OCR & Clinical Parsing:** Extracts vital signs, lab values, medication schedules, diagnoses, and negated findings.
- **AI Medical Translation:** Rewrites medical terminology into clear language without loss of clinical nuance.
- **Color-Coded Explanations:**
  - 🔴 Red: Critical / Elevated
  - 🟠 Orange: High / Abnormal
  - 🟢 Green: Normal / Healthy
  - 🔵 Blue: Medications
  - 🟣 Purple: Follow-up Actions
  - ⚫ Grey: Medical Terms
- **Instant PDF Export:** Generates an easy-to-read, beautifully formatted summary PDF for the patient.

## Getting Started

### 1. Backend Setup

```bash
# Set your Gemini API Key
export GEMINI_API_KEY="your_api_key_here"  # On Linux/macOS
$env:GEMINI_API_KEY="your_api_key_here"    # On Windows PowerShell

# Install requirements
pip install fastapi uvicorn pymupdf reportlab google-generativeai python-docx

# Start the backend server
python backend_api.py
```
Backend will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup

```bash
cd "auramed-ai---multi-agent-medical-intelligence (1)"
npm install
npm run dev
```
Frontend will run at `http://localhost:5173` (or `http://localhost:3000`).

## License
MIT
