import { MedicalRecordData } from '../types/medical';

export const SAMPLE_RECORDS: MedicalRecordData[] = [
  {
    id: 'rec_nikolas_pascal',
    title: 'Metabolic & Cardiovascular Follow-Up Note',
    patientName: 'Nikolas Pascal',
    patientAge: 32,
    patientGender: 'Male',
    date: 'September 18, 2026',
    facility: 'St. Jude Comprehensive Health Center, San Francisco',
    physician: 'Dr. Elena Vance, MD, FACC',
    documentType: 'Clinical Progress Note & Lab Report (PDF)',
    rawExcerpt: `PATIENT: Pascal, Nikolas. 32 y.o. male.
CHIEF COMPLAINT: Routine metabolic check, mild fatigue, sleep fragmentation.
VITALS: BP 120/80 mmHg, HR 72 bpm regular, SpO2 99% room air, BMI 25.4.
LABS: Fasting Blood Sugar (FBS) 116 mg/dL [H], HbA1c 5.5% [WNL], Fasting Lipid Panel: Total Chol 188 mg/dL, Triglycerides 142 mg/dL, HDL 48 mg/dL, LDL 112 mg/dL.
ASSESSMENT & NEGATIONS:
- Patient denies chest pressure, dyspnea on exertion, or syncope.
- No historical or acute electrocardiographic signs of myocardial infarction or ischemic ST changes.
- Patient denies polyuria or polydipsia.
- No diabetic retinopathy or peripheral neuropathy noted on exam.
- Mild sleep architecture disruption with reduced restorative REM.
PLAN:
- Initiate Metformin 500mg PO daily with evening meal to optimize insulin sensitivity.
- Continue lifestyle intervention: aerobic exercise 150 min/wk.
- Sleep hygiene protocol. Follow-up lab panel in 90 days.`,
    overallSeverity: 'moderate',
    severityHeadline: 'Mild Metabolic Attention (Prediabetic Threshold Glucose)',
    severityReasoning: 'Your blood pressure and long-term HbA1c are excellent. However, your morning fasting glucose is slightly above normal (116 mg/dL), indicating early insulin resistance that is easily managed with diet and low-dose medication.',
    plainSummary: 'Overall, your cardiovascular health and vitals are in good shape. Your blood pressure (120/80) and resting pulse (72 bpm) are optimal. The primary finding is that your fasting blood sugar is slightly higher than normal (116 mg/dL vs. goal of under 100 mg/dL). Fortunately, your 3-month average blood sugar (HbA1c of 5.5%) shows this is still early and completely reversible with targeted nutrition and the gentle medication your doctor prescribed.',
    whatItMeansForYou: [
      'Your heart and blood circulation are healthy and working well.',
      'Your morning blood sugar is slightly high, but you do not have full diabetes.',
      'Your fatigue is likely related to interrupted sleep cycles rather than cardiac or thyroid issues.',
      'Starting Metformin will help your cells respond better to insulin and keep your blood sugar steady.'
    ],
    vitalsAndBiomarkers: [
      {
        name: 'Fasting Blood Sugar (FBS)',
        value: '116',
        unit: 'mg/dL',
        status: 'elevated',
        statusLabel: 'Elevated',
        referenceRange: '70 - 99 mg/dL',
        plainExplanation: 'Your sugar level after fasting overnight. 116 is in the early prediabetic range, but highly responsive to diet adjustments.'
      },
      {
        name: 'Blood Pressure (BP)',
        value: '120/80',
        unit: 'mmHg',
        status: 'normal',
        statusLabel: 'Normal Range',
        referenceRange: '< 120/80 mmHg',
        plainExplanation: 'The pressure of circulating blood against your vessel walls. Perfectly controlled.'
      },
      {
        name: 'Heart Rate (HR)',
        value: '72',
        unit: 'bpm',
        status: 'normal',
        statusLabel: 'Stable',
        referenceRange: '60 - 100 bpm',
        plainExplanation: 'Resting pulse rate is calm, regular, and well within safe athletic boundaries.'
      },
      {
        name: 'Hemoglobin A1c (HbA1c)',
        value: '5.5',
        unit: '%',
        status: 'normal',
        statusLabel: 'Good Control',
        referenceRange: '< 5.7 %',
        plainExplanation: 'Measures your average blood sugar over the past 90 days. 5.5% is firmly in the healthy normal zone.'
      },
      {
        name: 'Total Cholesterol',
        value: '188',
        unit: 'mg/dL',
        status: 'normal',
        statusLabel: 'Desirable',
        referenceRange: '< 200 mg/dL',
        plainExplanation: 'Total amount of cholesterol in blood. Good baseline.'
      },
      {
        name: 'Oxygen Saturation (SpO2)',
        value: '99',
        unit: '%',
        status: 'normal',
        statusLabel: 'Optimal',
        referenceRange: '95 - 100 %',
        plainExplanation: 'Percentage of oxygen carried by red blood cells. Full oxygenation.'
      }
    ],
    medications: [
      {
        name: 'Metformin HCl',
        dosage: '500 mg',
        frequency: 'Once daily with evening meal',
        purpose: 'Improves how your body responds to insulin and prevents fasting blood sugar spikes.',
        warning: 'Take with food to minimize mild stomach upset. Avoid excessive alcohol intake.',
        takeWithFood: true
      },
      {
        name: 'Melatonin (Extended Release)',
        dosage: '3 mg',
        frequency: '30-45 minutes before bedtime',
        purpose: 'Supports circadian rhythm alignment for deeper restorative sleep.',
        warning: 'Use for 2-4 weeks alongside consistent dim-light bedtime habits.',
        takeWithFood: false
      }
    ],
    negations: [
      {
        condition: 'Heart Attack / Myocardial Infarction',
        clinicalQuote: 'No historical or acute electrocardiographic signs of myocardial infarction or ischemic ST changes.',
        patientClarification: 'Your ECG and examination show zero damage or blockage in your heart muscles.',
        status: 'negative'
      },
      {
        condition: 'Chest Pain / Angina',
        clinicalQuote: 'Patient denies chest pressure, dyspnea on exertion, or syncope.',
        patientClarification: 'You reported no tightness in your chest or shortness of breath during physical exertion.',
        status: 'ruled_out'
      },
      {
        condition: 'Diabetic Nerve or Eye Complications',
        clinicalQuote: 'No diabetic retinopathy or peripheral neuropathy noted on exam.',
        patientClarification: 'No nerve numbness in fingers/toes and no vision blood vessel damage.',
        status: 'absent'
      }
    ],
    questionsForDoctor: [
      'Should I monitor my morning fingerstick blood sugar at home, or wait until the 90-day lab recheck?',
      'Would working with a registered dietitian on carbohydrate timing benefit my sleep patterns?',
      'If my stomach feels sensitive to Metformin, can we switch to the extended-release (ER) version?'
    ],
    recommendedFollowUp: 'Repeat fasting metabolic panel and HbA1c in 90 days. Schedule a brief telehealth sleep review in 4 weeks.'
  },
  {
    id: 'rec_clara_torres',
    title: 'Comprehensive Chemistry & Thyroid Diagnostic Panel',
    patientName: 'Clara Torres',
    patientAge: 44,
    patientGender: 'Female',
    date: 'September 12, 2026',
    facility: 'Pacific Memorial Diagnostic Laboratories',
    physician: 'Dr. Marcus Chen, MD',
    documentType: 'Laboratory Chemistry Report (PDF)',
    rawExcerpt: `PATIENT: Torres, Clara. 44 y.o. female.
SPECIMEN: Serum / Venipuncture.
LAB RESULTS:
- Thyroid Stimulating Hormone (TSH): 4.82 uIU/mL [H] (Ref: 0.40 - 4.00)
- Free Thyroxine (Free T4): 1.12 ng/dL [WNL] (Ref: 0.80 - 1.80)
- Serum Ferritin: 18 ng/mL [L] (Ref: 24 - 307)
- 25-OH Vitamin D: 22 ng/mL [L] (Ref: 30 - 100)
- Serum Creatinine: 0.81 mg/dL [WNL] (Ref: 0.50 - 1.10)
- eGFR: > 90 mL/min/1.73m2 [Normal renal filtration]
CLINICAL COMMENTS:
- Borderline subclinical hypothyroidism with low iron stores and insufficiency of Vitamin D.
- Patient denies palpitations, heat intolerance, or sudden weight fluctuation.
- Negative for thyroid nodules on previous ultrasound.
RECOMMENDATION:
- Elemental Iron 65mg alternate days.
- Ergocalciferol (Vitamin D3) 2000 IU daily.
- Re-evaluate TSH in 8 weeks before considering Levothyroxine.`,
    overallSeverity: 'moderate',
    severityHeadline: 'Nutritional Deficiency & Borderline Thyroid Sluggishness',
    severityReasoning: 'Your kidneys and core electrolytes are working great. Two mineral levels (Iron and Vitamin D) are low, which explains feeling drained, and your thyroid controller hormone (TSH) is working a bit harder than usual.',
    plainSummary: 'Your lab panel confirms your kidneys and core metabolism are filtering properly. It also pinpoints why you may have felt tired: your iron reserve (Ferritin) and Vitamin D levels are lower than recommended. Your thyroid stimulating hormone (TSH) is slightly elevated, meaning your body is gently signaling the thyroid to produce energy. These can easily be replenished with oral supplements.',
    whatItMeansForYou: [
      'Your kidneys and vital organs are functioning normally.',
      'Low iron stores and low Vitamin D are the main culprits behind daytime lethargy.',
      'Your thyroid is not diseased; it is slightly sluggish and will be re-tested after replenishing iron.',
      'Taking iron on alternating days actually improves how your body absorbs it.'
    ],
    vitalsAndBiomarkers: [
      {
        name: 'Thyroid Stimulating Hormone (TSH)',
        value: '4.82',
        unit: 'uIU/mL',
        status: 'elevated',
        statusLabel: 'Mildly High',
        referenceRange: '0.40 - 4.00 uIU/mL',
        plainExplanation: 'The chemical signal your brain sends to your thyroid. Higher numbers mean your brain is asking your thyroid to work harder.'
      },
      {
        name: 'Free Thyroxine (Free T4)',
        value: '1.12',
        unit: 'ng/dL',
        status: 'normal',
        statusLabel: 'Balanced',
        referenceRange: '0.80 - 1.80 ng/dL',
        plainExplanation: 'Actual active thyroid hormone circulating in your system. Completely normal.'
      },
      {
        name: 'Serum Ferritin (Iron Storage)',
        value: '18',
        unit: 'ng/mL',
        status: 'low',
        statusLabel: 'Low Reserve',
        referenceRange: '24 - 307 ng/mL',
        plainExplanation: 'The "fuel tank" of iron stored in your liver and bone marrow. Below the healthy target of 24.'
      },
      {
        name: 'Vitamin D (25-Hydroxy)',
        value: '22',
        unit: 'ng/mL',
        status: 'low',
        statusLabel: 'Insufficient',
        referenceRange: '30 - 100 ng/mL',
        plainExplanation: 'Essential for bone density, mood, and immune health. Needs a daily boost.'
      },
      {
        name: 'Glomerular Filtration Rate (eGFR)',
        value: '> 90',
        unit: 'mL/min',
        status: 'normal',
        statusLabel: 'Optimal',
        referenceRange: '> 60 mL/min',
        plainExplanation: 'Measures how efficiently your kidneys clean your blood. Perfect performance.'
      }
    ],
    medications: [
      {
        name: 'Ferrous Sulfate (Elemental Iron)',
        dosage: '65 mg',
        frequency: 'Every other day with Vitamin C or orange juice',
        purpose: 'Rebuilds depleted iron reserves to restore red blood cell energy transport.',
        warning: 'Avoid taking at the exact same hour as coffee, dairy, or calcium antacids.',
        takeWithFood: false
      },
      {
        name: 'Cholecalciferol (Vitamin D3)',
        dosage: '2,000 IU',
        frequency: 'Daily with morning breakfast containing healthy fats',
        purpose: 'Elevates blood Vitamin D to target levels (>30 ng/mL).',
        warning: 'Fat-soluble vitamin; absorbs best with meals.',
        takeWithFood: true
      }
    ],
    negations: [
      {
        condition: 'Thyroid Nodules / Tumors',
        clinicalQuote: 'Negative for thyroid nodules on previous ultrasound.',
        patientClarification: 'Your thyroid gland is smooth with no lumps, cysts, or masses.',
        status: 'negative'
      },
      {
        condition: 'Clinical Hyperthyroidism',
        clinicalQuote: 'Patient denies palpitations, heat intolerance, or sudden weight fluctuation.',
        patientClarification: 'No rapid racing heart or overactive thyroid symptoms.',
        status: 'ruled_out'
      }
    ],
    questionsForDoctor: [
      'Could my low iron and Vitamin D be directly causing my subclinical TSH elevation?',
      'Do you recommend checking anti-TPO antibodies if TSH remains elevated after 8 weeks?',
      'Which food sources of dietary iron should I incorporate alongside the supplement?'
    ],
    recommendedFollowUp: 'Recheck Ferritin, Vitamin D, and TSH in 8 weeks to assess absorption.'
  },
  {
    id: 'rec_marcus_vance',
    title: 'Emergency Department Acute Triage & Discharge Record',
    patientName: 'Marcus Rivera',
    patientAge: 51,
    patientGender: 'Male',
    date: 'September 22, 2026',
    facility: 'University Medical Center Emergency Department',
    physician: 'Dr. Sarah Al-Mansoor, MD, FACEP',
    documentType: 'Hospital Discharge Summary (PDF)',
    rawExcerpt: `PATIENT: Rivera, Marcus. 51 y.o. male.
PRESENTATION: Evaluated for sudden substernal chest discomfort following yard work.
DIAGNOSTIC WORKUP:
- Serial High-Sensitivity Troponin I: < 0.01 ng/mL at 0h, < 0.01 ng/mL at 3h [Negative for acute coronary syndrome].
- 12-Lead ECG: Normal sinus rhythm at 68 bpm, no ST segment elevation or depression, no T-wave inversions.
- Chest Radiograph (CXR): Clear lung fields, normal cardiothoracic ratio, no pneumothorax, no focal consolidations.
- D-Dimer: < 0.20 ug/mL FEU [Negative for pulmonary embolism].
ASSESSMENT:
- Chest pain non-cardiac in origin. Diagnosed with acute musculoskeletal costochondritis / intercostal strain.
- Patient explicitly denies radiation to left jaw or arm, diaphoresis, or presyncope.
DISCHARGE MEDICATIONS & ORDERS:
- Ibuprofen 400mg PO every 8 hours PRN pain with meals for 5 days.
- Topical heat therapy to anterior chest wall.
- Refrain from heavy lifting > 20 lbs for 72 hours.
- Strict red-flag return precautions reviewed and acknowledged.`,
    overallSeverity: 'low',
    severityHeadline: 'Heart Attack Ruled Out — Chest Wall Muscle Strain (Costochondritis)',
    severityReasoning: 'All serial heart enzyme tests (Troponin), ECG readings, and chest X-rays were completely normal. Your chest discomfort is muscular, not from your heart or lungs.',
    plainSummary: 'Great news: the hospital emergency team did a comprehensive workup and ruled out any heart attack or lung issues. Your blood tests for cardiac strain (Troponin) were negative across repeated tests, and your ECG was pristine. Your chest tightness is caused by "costochondritis" — inflammation of the cartilage linking your ribs to your breastbone, likely triggered by physical exertion. It will heal with rest and mild anti-inflammatories.',
    whatItMeansForYou: [
      'You did NOT have a heart attack. Your heart muscles are undamaged.',
      'Your lungs and major blood vessels are clear with no clots.',
      'The pain is from strained muscle and cartilage in your chest wall.',
      'Short-term anti-inflammatory medication and warm compresses will relieve the soreness.'
    ],
    vitalsAndBiomarkers: [
      {
        name: 'Cardiac Troponin I (0 hr & 3 hr)',
        value: '< 0.01',
        unit: 'ng/mL',
        status: 'normal',
        statusLabel: 'Zero Heart Strain',
        referenceRange: '< 0.04 ng/mL',
        plainExplanation: 'Enzyme released only if heart muscle cells are damaged. Repeated negative result completely rules out a heart attack.'
      },
      {
        name: 'D-Dimer (Blood Clot Marker)',
        value: '< 0.20',
        unit: 'ug/mL',
        status: 'normal',
        statusLabel: 'Negative',
        referenceRange: '< 0.50 ug/mL',
        plainExplanation: 'Tests for blood clot fragments. Normal value rules out pulmonary embolism.'
      },
      {
        name: 'Heart Rate (ECG)',
        value: '68',
        unit: 'bpm',
        status: 'normal',
        statusLabel: 'Normal Sinus',
        referenceRange: '60 - 100 bpm',
        plainExplanation: 'Regular electrical rhythm without arrhythmia or electrical disturbance.'
      },
      {
        name: 'Blood Pressure',
        value: '128/82',
        unit: 'mmHg',
        status: 'normal',
        statusLabel: 'Normal',
        referenceRange: '< 130/85 mmHg',
        plainExplanation: 'Within safe limits during emergency evaluation.'
      }
    ],
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '400 mg',
        frequency: 'Every 8 hours as needed for chest wall discomfort (max 5 days)',
        purpose: 'Reduces inflammation in the costochondral cartilage.',
        warning: 'Always take with food or milk to safeguard stomach lining.',
        takeWithFood: true
      }
    ],
    negations: [
      {
        condition: 'Acute Coronary Syndrome (Heart Attack)',
        clinicalQuote: 'Serial High-Sensitivity Troponin I negative at 0h and 3h; ECG normal sinus rhythm with no ST deviations.',
        patientClarification: 'The emergency physician verified your heart had zero blockage or reduced blood flow.',
        status: 'negative'
      },
      {
        condition: 'Pulmonary Embolism (Lung Clot)',
        clinicalQuote: 'D-Dimer < 0.20 ug/mL FEU negative for pulmonary embolism; CXR clear.',
        patientClarification: 'No blood clots in the lungs and no fluid accumulation.',
        status: 'ruled_out'
      },
      {
        condition: 'Radiating Cardiac Pain',
        clinicalQuote: 'Patient explicitly denies radiation to left jaw or arm, diaphoresis, or presyncope.',
        patientClarification: 'Classic warning signs of cardiac distress were completely absent.',
        status: 'absent'
      }
    ],
    questionsForDoctor: [
      'How long does costochondritis cartilage inflammation typically take to fully resolve?',
      'Are there gentle stretching exercises I can do to prevent recurrence when working outdoors?',
      'When can I safely resume aerobic exercise and weightlifting?'
    ],
    recommendedFollowUp: 'Follow up with your primary care provider in 7-10 days if chest wall tenderness persists.'
  }
];
