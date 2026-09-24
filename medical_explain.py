import os, re, fitz, base64, time, google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
PDF_PATH = r'c:\Users\kevin\OneDrive\Desktop\Meetmux ai\dummy_medical_report_johny_s_scanned.pdf'
OCR_CACHE_PATH = r'c:\Users\kevin\OneDrive\Desktop\Meetmux ai\extracted_ocr.txt'
MODEL_NAME = 'gemini-3.5-flash'

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(MODEL_NAME) if GEMINI_API_KEY else None

SEP = '=' * 65

def psep(title):
    print('\n' + SEP)
    print('  ' + title)
    print(SEP)

def call_with_retry(fn, max_retries=5, base_wait=10):
    """Call Gemini API with retry logic."""
    for attempt in range(max_retries):
        try:
            return fn()
        except ResourceExhausted as e:
            wait = base_wait * (attempt + 1)
            print(f'  [Rate limit hit] Waiting {wait}s before retry {attempt+1}/{max_retries}...')
            time.sleep(wait)
    raise RuntimeError('Max retries exceeded for Gemini API call.')

# === STAGE 1: OCR ===
psep('STAGE 1: OCR via Gemini Vision (scanned PDF)')
if os.path.exists(OCR_CACHE_PATH):
    print(f'  Loading cached OCR text from {os.path.basename(OCR_CACHE_PATH)}...')
    with open(OCR_CACHE_PATH, 'r', encoding='utf-8') as f:
        raw_text = f.read()
    print(f'  Total characters loaded: {len(raw_text)}')
else:
    doc = fitz.open(PDF_PATH)
    parts = []
    print(f'  Extracting all {len(doc)} pages in single batch...')
    for i, page in enumerate(doc):
        mat = fitz.Matrix(1.5, 1.5)
        pix = page.get_pixmap(matrix=mat)
        img_b64 = base64.b64encode(pix.tobytes('png')).decode()
        parts.append({'inline_data': {'mime_type': 'image/png', 'data': img_b64}})
        parts.append(f'This is page {i+1} of the medical report.')
    doc.close()
    parts.append('Extract ALL text from all pages above in exact sequential order. Separate pages with --- Page N ---. Include all tables, labels, numbers, and units.')
    resp = call_with_retry(lambda: model.generate_content(parts))
    raw_text = resp.text
    with open(OCR_CACHE_PATH, 'w', encoding='utf-8') as f:
        f.write(raw_text)
    print(f'  Total characters extracted: {len(raw_text)}')

# === STAGE 2: SECTION PARSING ===
psep('STAGE 2: Section Parsing')
HEADERS = [
    'chief complaint','history of present illness','past medical history',
    'past history','social history','family history','review of systems',
    'physical examination','physical exam','vital signs','laboratory',
    'lab results','investigations','imaging','x-ray','mri','ct scan',
    'ultrasound','ecg','echocardiogram','diagnosis','diagnoses','impression',
    'assessment','plan','treatment','medications','allergies',
    'discharge summary','follow up','conclusion','summary','findings',
    'recommendations','blood test','urine','current medications',
    'assessment and plan','laboratory results',
]
sections = {}
current = 'General'
buf = []
for line in raw_text.splitlines():
    s = line.strip()
    low = s.lower().rstrip(':').strip()
    if low in HEADERS or any(low.startswith(h) for h in HEADERS):
        if buf:
            sections[current] = '\n'.join(buf).strip()
        current = s.rstrip(':')
        buf = []
    elif s:
        buf.append(s)
if buf:
    sections[current] = '\n'.join(buf).strip()
print(f'  Sections found: {list(sections.keys())}')

# === STAGE 3: NER + NEGATION ===
psep('STAGE 3: Biomedical NER + Negation Detection')
EP = {
    'DISEASE': [
        r'\bdiabetes mellitus\b',r'\btype [12] diabetes\b',r'\bprediabetes\b',
        r'\bhypertension\b',r'\bpneumonia\b',r'\basthma\b',r'\bcopd\b',
        r'\bheart failure\b',r'\bmyocardial infarction\b',r'\bangina\b',
        r'\bstroke\b',r'\banemia\b',r'\banaemi\w+\b',r'\bhypothyroid\w*\b',
        r'\bhyperthyroid\w*\b',r'\bkidney disease\b',r'\brenal failure\b',
        r'\bhepatitis\b',r'\bcirrhosis\b',r'\bcancer\b',r'\bcarcinoma\b',
        r'\bsepsis\b',r'\bcovid[- ]?19\b',r'\bcoronary artery disease\b',
        r'\bdyslipid\w+\b',r'\bhyperlipid\w+\b',r'\bmixed hyperlipidemia\b',
        r'\bhypercholesterol\w+\b',r'\bobesity\b',r'\bgout\b',r'\barthritis\b',
        r'\bdepression\b',r'\banxiety\b',r'\bpleural effusion\b',
        r'\bconsolidation\b',r'\bischemi\w+\b',r'\bedema\b',r'\boedem\w+\b',
        r'\bgerd\b',r'\bgastroesophageal reflux\b',r'\bacid reflux\b',
        r'\bnasal congestion\b',r'\ballergic rhinitis\b',r'\bheartburn\b',
    ],
    'MEDICATION': [
        r'\bmetformin\b',r'\binsulin\b',r'\baspirin\b',r'\batorvastatin\b',
        r'\blisinopril\b',r'\bamlodipine\b',r'\bwarfarin\b',r'\bheparin\b',
        r'\bomeprazole\b',r'\bsalbutamol\b',r'\bprednisolone\b',
        r'\blevothyroxine\b',r'\bfurosemide\b',r'\bmetoprolol\b',
        r'\brosuvastatin\b',r'\bclopidogrel\b',
    ],
    'LAB_TEST': [
        r'\bhba1c\b',r'\bfasting blood\b',r'\bblood glucose\b',
        r'\bserum creatinine\b',r'\begfr\b',r'\burea\b',r'\bsodium\b',
        r'\bpotassium\b',r'\bcbc\b',r'\bhemoglobin\b',r'\bhaemoglobin\b',
        r'\bwbc\b',r'\bplatelet\b',r'\balt\b',r'\bast\b',r'\bbilirubin\b',
        r'\bcholesterol\b',r'\btriglyceride\b',r'\bldl\b',r'\bhdl\b',
        r'\btsh\b',r'\bcrp\b',r'\bvitamin d\b',r'\bchest x.?ray\b',
        r'\bblood pressure\b',r'\bbmi\b',r'\bspo2\b',r'\becg\b',
        r'\burine microalbumin\b',r'\blipid profile\b',
    ],
    'SYMPTOM': [
        r'\bcough\b',r'\bfever\b',r'\bshortness of breath\b',r'\bchest pain\b',
        r'\bfatigue\b',r'\bweakness\b',r'\bnausea\b',r'\bvomiting\b',
        r'\bheadache\b',r'\bdizziness\b',r'\bpalpitation\b',r'\bsyncope\b',
        r'\bswelling\b',r'\bweight loss\b',r'\bweight gain\b',
        r'\bnight sweat\b',r'\bjaundice\b',r'\bblurred vision\b',
        r'\bpolyuria\b',r'\bpolydipsia\b',r'\bpolyphagia\b',
        r'\bheartburn\b',r'\bepigastric\b',r'\bnasal congestion\b',
        r'\bsneezing\b',r'\bwheezing\b',r'\bthirst\b',
    ],
}
NEG  = [r'no\b',r'not\b',r'without\b',r'absent\b',r'deny\b',r'denies\b',r'negative for\b',r'no evidence of\b',r'ruled? out\b',r'free of\b']
HIST = [r'history of\b',r'h/o\b',r'prior\b',r'previous\b',r'known case of\b',r'noted previously\b',r'diagnosed in\b']
SUSP = [r'possible\b',r'probable\b',r'suspected\b',r'likely\b',r'suggestive of\b',r'consistent with\b',r'possibly\b',r'cannot rule out\b']
tl = raw_text.lower()
ents = []
for etype, pats in EP.items():
    for pat in pats:
        for m in re.finditer(pat, tl):
            ctx = tl[max(0, m.start()-80):m.start()]
            st = 'CONFIRMED'
            if any(re.search(t, ctx) for t in NEG): st = 'NEGATED'
            elif any(re.search(t, ctx) for t in HIST): st = 'HISTORICAL'
            elif any(re.search(t, ctx) for t in SUSP): st = 'SUSPECTED'
            ents.append({'entity': m.group().strip(), 'type': etype, 'status': st})
seen = set()
uniq = []
for e in ents:
    k = (e['entity'].lower(), e['status'])
    if k not in seen:
        seen.add(k)
        uniq.append(e)
ents = uniq
c = [e for e in ents if e['status']=='CONFIRMED']
n = [e for e in ents if e['status']=='NEGATED']
s = [e for e in ents if e['status']=='SUSPECTED']
h = [e for e in ents if e['status']=='HISTORICAL']
print(f'  Total: {len(ents)} | Confirmed:{len(c)} Negated:{len(n)} Suspected:{len(s)} Historical:{len(h)}')
ICON = {'CONFIRMED':'[CONFIRMED]','NEGATED':'[NEGATED  ]','SUSPECTED':'[SUSPECTED]','HISTORICAL':'[HISTORICL]'}
for e in ents:
    print(f'  {ICON.get(e["status"],"[?]")} {e["entity"]}  ({e["type"]})')

# === STAGE 4: LAB VALUES ===
psep('STAGE 4: Lab Value Extraction')
LP = [
    (r'hba1c\s*[:\-]?\s*([\d.]+)\s*(%|mmol/mol)?','HbA1c','Normal: <5.7% healthy | 5.7-6.4% pre-diabetic | >=6.5% diabetic range'),
    (r'fasting\s*(?:blood\s*)?(?:glucose|sugar)\s*[:\-]?\s*([\d.]+)\s*(mg/dl|mmol/l)?','Fasting Blood Glucose','Normal: 70-99 mg/dL'),
    (r'(?:hemoglobin|haemoglobin)\s*(?:\([a-z]+\)\s*)?[:\-]?\s*([\d.]+)\s*(g/dl)?','Hemoglobin','Normal: 13.5-17.5 g/dL (men) | 12.0-15.5 g/dL (women)'),
    (r'serum\s*creatinine\s*[:\-]?\s*([\d.]+)\s*(mg/dl)?','Serum Creatinine','Normal: 0.74-1.35 mg/dL (men) | 0.59-1.04 mg/dL (women)'),
    (r'sodium\s*(?:\([a-z+]+\))?\s*[:\-]?\s*([\d.]+)\s*(meq/l|mmol/l)?','Sodium','Normal: 136-145 mEq/L'),
    (r'potassium\s*(?:\([a-z+]+\))?\s*[:\-]?\s*([\d.]+)\s*(meq/l|mmol/l)?','Potassium','Normal: 3.5-5.0 mEq/L'),
    (r'total\s*cholesterol\s*[:\-]?\s*([\d.]+)\s*(mg/dl)?','Total Cholesterol','Normal: <200 mg/dL'),
    (r'ldl[- ]?(?:cholesterol|c)?\s*[:\-]?\s*([\d.]+)\s*(mg/dl)?','LDL Cholesterol','Normal: <100 mg/dL optimal'),
    (r'hdl[- ]?(?:cholesterol|c)?\s*[:\-]?\s*([\d.]+)\s*(mg/dl)?','HDL Cholesterol','Normal: >40 mg/dL (men) | >50 mg/dL (women)'),
    (r'triglycerides?\s*[:\-]?\s*([\d.]+)\s*(mg/dl)?','Triglycerides','Normal: <150 mg/dL'),
    (r'tsh\s*[:\-]?\s*([\d.]+)\s*(miu/l|uiu/ml|miu/ml)?','TSH (Thyroid)','Normal: 0.4-4.0 mIU/L'),
    (r'\balt\s*[:\-]?\s*([\d.]+)\s*(u/l|iu/l)?','ALT (Liver Enzyme)','Normal: 7-56 U/L'),
    (r'\bast\s*[:\-]?\s*([\d.]+)\s*(u/l|iu/l)?','AST (Liver Enzyme)','Normal: 10-40 U/L'),
    (r'(?:blood\s*pressure|bp)\s*[:\-]?\s*([\d]+/[\d]+)\s*(mmhg)?','Blood Pressure','Normal: <120/80 mmHg'),
    (r'pulse\s*[:\-]?\s*([\d.]+)\s*(bpm|/min)?','Pulse','Normal: 60-100 bpm'),
    (r'spo2\s*[:\-]?\s*([\d.]+)\s*(%)?','SpO2 (Oxygen Saturation)','Normal: 95-100%'),
    (r'temperature\s*[:\-]?\s*([\d.]+)\s*(c|f)?','Temperature','Normal: 36.1-37.2 C'),
    (r'\bbmi\b\s*[:\-]?\s*([\d.]+)','BMI','Normal: 18.5-24.9 kg/m2'),
    (r'wbc\s*[:\-]?\s*([\d.]+)','WBC Count','Normal: 4.5-11.0 x10^3/uL'),
    (r'platelet\s*(?:count)?\s*[:\-]?\s*([\d.]+)','Platelet Count','Normal: 150-400 x10^3/uL'),
    (r'egfr\s*[:\-]?\s*([\d.]+)','eGFR (Kidney Function)','Normal: >=60 mL/min/1.73m2'),
    (r'urine\s*microalbumin\s*[:\-]?\s*([\d.]+)\s*(mg/g)?','Urine Microalbumin','Normal: <30 mg/g creatinine'),
    (r'vitamin\s*d\s*[:\-]?\s*([\d.]+)\s*(ng/ml)?','Vitamin D','Normal: 20-50 ng/mL'),
    (r'respiratory\s*rate\s*[:\-]?\s*([\d.]+)','Respiratory Rate','Normal: 12-20 breaths/min'),
]
labs = []
for pat, name, nr in LP:
    m = re.search(pat, tl)
    if m:
        val = m.group(1)
        unit = (m.group(2) or '') if m.lastindex and m.lastindex >= 2 else ''
        labs.append({'test': name, 'value': val, 'unit': unit, 'normal_range': nr})
if labs:
    for lv in labs:
        print(f'  {lv["test"]}: {lv["value"]} {lv["unit"]}')
        print(f'    Range: {lv["normal_range"]}')
else:
    print('  No lab values matched.')

# === STAGE 5: ICD-10 ===
psep('STAGE 5: ICD-10 Mapping')
ICD = {
    'diabetes mellitus': ('E11.9','Type 2 diabetes mellitus without complications'),
    'type 2 diabetes': ('E11.9','Type 2 diabetes mellitus without complications'),
    'prediabetes': ('R73.09','Other abnormal glucose'),
    'hypertension': ('I10','Essential (primary) hypertension'),
    'pneumonia': ('J18.9','Unspecified pneumonia'),
    'heart failure': ('I50.9','Heart failure, unspecified'),
    'myocardial infarction': ('I21.9','Acute myocardial infarction, unspecified'),
    'stroke': ('I63.9','Cerebral infarction, unspecified'),
    'anemia': ('D64.9','Anaemia, unspecified'),
    'anaemia': ('D64.9','Anaemia, unspecified'),
    'hypothyroidism': ('E03.9','Hypothyroidism, unspecified'),
    'chronic kidney disease': ('N18.9','Chronic kidney disease, unspecified'),
    'renal failure': ('N19','Unspecified kidney failure'),
    'dyslipidemia': ('E78.5','Hyperlipidaemia, unspecified'),
    'hyperlipidemia': ('E78.5','Hyperlipidaemia, unspecified'),
    'mixed hyperlipidemia': ('E78.2','Mixed hyperlipidaemia'),
    'hypercholesterolemia': ('E78.00','Pure hypercholesterolaemia'),
    'obesity': ('E66.9','Obesity, unspecified'),
    'gerd': ('K21.0','Gastro-oesophageal reflux disease with oesophagitis'),
    'gastroesophageal reflux': ('K21.0','Gastro-oesophageal reflux disease'),
    'acid reflux': ('K21.9','Gastro-oesophageal reflux disease without oesophagitis'),
    'heartburn': ('K21.9','Gastro-oesophageal reflux disease'),
    'allergic rhinitis': ('J30.1','Allergic rhinitis'),
    'nasal congestion': ('J30.9','Allergic rhinitis, unspecified'),
    'pleural effusion': ('J90','Pleural effusion'),
    'coronary artery disease': ('I25.10','Atherosclerotic heart disease'),
    'sepsis': ('A41.9','Sepsis, unspecified organism'),
    'edema': ('R60.9','Oedema, unspecified'),
    'oedema': ('R60.9','Oedema, unspecified'),
}
icd10 = []
for ent in ents:
    nm = ent['entity'].lower()
    for key, (code, desc) in ICD.items():
        if key in nm or nm in key:
            icd10.append({'entity': ent['entity'], 'status': ent['status'], 'code': code, 'desc': desc})
            break
for item in icd10:
    print(f'  [{item["status"]}] {item["entity"]} -> {item["code"]} ({item["desc"]})')
if not icd10:
    print('  No ICD-10 mappings found.')

# === STAGE 6+7: GEMINI LLM SUMMARY ===
psep('STAGE 6+7: Generating Plain-Language Explanation via Gemini')

SYSPROMPT = """You are a medical-report explanation assistant.
Your job is to explain a medical report to a person with NO medical background.

STRICT RULES:
1. NEVER just repeat medical terms. Explain every medical term in simple everyday language.
2. ONLY use information present in the provided data. Do NOT invent anything.
3. ALWAYS correctly label each condition as: confirmed / suspected / from past history / ruled out.
4. Preserve ALL numbers, values, and units exactly.
5. For each lab result: explain what the test measures, give the result, give the normal range, and say simply if it is normal, high, or low.
6. Do NOT provide a medical diagnosis or recommend any treatment.
7. Do NOT show ICD codes. Explain conditions in plain language.
8. Do NOT mention NER labels, ICD, or internal pipeline processing.
9. If something is unclear in the report, say it is unclear.
10. Do NOT tell the user to start, stop, or change any medication.
11. Use second person where appropriate.
12. Be concise but thorough. Focus on what matters most to the patient.
13. NEGATED means NOT found - say so clearly.
14. HISTORICAL means from patient past history - say so clearly.
15. SUSPECTED means a possibility only, not confirmed - say so clearly.

Write in Markdown with these headings:
## Medical Report - Easy Explanation
### What This Report Is About
### Patient Information
### Main Findings
### Test Results Explained
### Conditions Mentioned in the Report
### What Was Ruled Out
### What the Medical Terms Mean
### Important Things to Be Aware Of

Tone: warm, clear, like a kind doctor explaining to a patient."""

prompt = '=== ORIGINAL OCR TEXT ===\n' + raw_text[:6000]
prompt += '\n\n=== SECTIONS ===\n'
for sec, cont in list(sections.items())[:12]:
    prompt += f'[{sec}]\n{cont[:700]}\n\n'
prompt += '\n=== DETECTED ENTITIES ===\n'
for e in ents[:60]:
    prompt += f'- {e["entity"]} | {e["type"]} | {e["status"]}\n'
prompt += '\n=== LAB VALUES ===\n'
for lv in labs:
    prompt += f'- {lv["test"]}: {lv["value"]} {lv["unit"]} | {lv["normal_range"]}\n'
prompt += '\n=== CONDITIONS (DO NOT SHOW ICD CODES TO USER) ===\n'
for item in icd10:
    prompt += f'- [{item["status"]}] {item["entity"]} -> {item["desc"]}\n'

def llm_call():
    llm = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSPROMPT)
    return llm.generate_content(prompt)
resp = call_with_retry(llm_call)
psep('USER-FACING OUTPUT: PLAIN-LANGUAGE EXPLANATION')
print(resp.text)
print('\n' + SEP)
print('  Pipeline Complete!')
print(SEP)
