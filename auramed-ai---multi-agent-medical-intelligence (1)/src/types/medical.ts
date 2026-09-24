export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'low' | 'attention';
  statusLabel: string;
  referenceRange: string;
  plainExplanation: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  warning?: string;
  takeWithFood?: boolean;
}

export interface NegationItem {
  condition: string;
  clinicalQuote: string;
  patientClarification: string;
  status: 'ruled_out' | 'absent' | 'negative';
}

export interface AgentStep {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'running' | 'completed';
  latencyMs: number;
  outputSummary: string;
  iconName: string;
}

export interface MedicalRecordData {
  id: string;
  title: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  facility: string;
  physician: string;
  documentType: string;
  rawExcerpt: string;
  overallSeverity: 'low' | 'moderate' | 'urgent';
  severityHeadline: string;
  severityReasoning: string;
  plainSummary: string;
  whatItMeansForYou: string[];
  vitalsAndBiomarkers: Biomarker[];
  medications: Medication[];
  negations: NegationItem[];
  questionsForDoctor: string[];
  recommendedFollowUp: string;
}
