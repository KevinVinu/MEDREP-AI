import requests

url = 'http://127.0.0.1:8000/api/process-report'
file_path = 'dummy_medical_report_johny_s_scanned.pdf'

print(f"Sending {file_path} to {url}...")
with open(file_path, 'rb') as f:
    files = {'file': ('dummy_medical_report_johny_s_scanned.pdf', f, 'application/pdf')}
    resp = requests.post(url, files=files)

print("Status code:", resp.status_code)
if resp.status_code == 200:
    data = resp.json()
    print("[SUCCESS] Report processed successfully!")
    print("Success:", data.get('success'))
    print("Patient:", data.get('patientInfo'))
    print("Highlights:", len(data.get('keyHighlights', [])))
    print("Medications:", len(data.get('medications', [])))
    print("PDF base64 size:", len(data.get('pdfBase64', '')))
    print("PDF URL:", data.get('pdfDownloadUrl'))
else:
    print("[ERROR]:", resp.text)
