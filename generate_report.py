import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# ==============================================================================
# COLOR PALETTE (Healthcare Modern Design System)
# ==============================================================================
PRIMARY_NAVY   = colors.HexColor('#0F2942')  # Deep medical navy for titles/headers
TEXT_DARK      = colors.HexColor('#1E293B')  # Slate 800 - primary body text
TEXT_MUTED     = colors.HexColor('#64748B')  # Slate 500 - subheadings/meta
TEXT_LIGHT     = colors.HexColor('#94A3B8')  # Slate 400 - subtle notes

# Semantic Red (Confirmed Condition / Major Abnormal)
RED_TEXT       = colors.HexColor('#B91C1C')  # Red 700
RED_BG         = colors.HexColor('#FEF2F2')  # Red 50
RED_BORDER     = colors.HexColor('#FCA5A5')  # Red 300
RED_BADGE      = colors.HexColor('#DC2626')  # Red 600

# Semantic Amber / Orange (Abnormal / Needs Attention / Historical)
AMBER_TEXT     = colors.HexColor('#B45309')  # Amber 700
AMBER_BG       = colors.HexColor('#FFFBEB')  # Amber 50
AMBER_BORDER   = colors.HexColor('#FCD34D')  # Amber 300
AMBER_BADGE    = colors.HexColor('#D97706')  # Amber 600

# Semantic Green (Normal / Reassuring / Ruled Out)
GREEN_TEXT     = colors.HexColor('#15803D')  # Green 700
GREEN_BG       = colors.HexColor('#F0FDF4')  # Green 50
GREEN_BORDER   = colors.HexColor('#86EFAC')  # Green 300
GREEN_BADGE    = colors.HexColor('#16A34A')  # Green 600

# Semantic Blue (Medications)
BLUE_TEXT      = colors.HexColor('#0369A1')  # Sky 700
BLUE_BG        = colors.HexColor('#F0F9FF')  # Sky 50
BLUE_BORDER    = colors.HexColor('#7DD3FC')  # Sky 300
BLUE_BADGE     = colors.HexColor('#0284C7')  # Sky 600

# Semantic Purple (Follow-up & Instructions)
PURPLE_TEXT    = colors.HexColor('#6D28D9')  # Purple 700
PURPLE_BG      = colors.HexColor('#F5F3FF')  # Purple 50
PURPLE_BORDER  = colors.HexColor('#C4B5FD')  # Purple 300
PURPLE_BADGE   = colors.HexColor('#7C3AED')  # Purple 600

# Neutral Gray (Cards & Borders)
CARD_BG        = colors.HexColor('#F8FAFC')  # Slate 50
CARD_BORDER    = colors.HexColor('#E2E8F0')  # Slate 200
DIVIDER_LINE   = colors.HexColor('#E2E8F0')

# ==============================================================================
# NUMBERED CANVAS (Header & Dynamic 'Page X of Y' Footer)
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        page_w, page_h = letter
        margin = 36  # 0.5 in

        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(TEXT_MUTED)
            self.drawString(margin, page_h - 26, "MEDICAL REPORT  •  EASY EXPLANATION")
            self.setFont("Helvetica", 8)
            self.drawRightString(page_w - margin, page_h - 26, "Patient: Johny S.  |  MRN: RMF-TEST-20481")
            
            # Subtle header divider
            self.setStrokeColor(DIVIDER_LINE)
            self.setLineWidth(0.75)
            self.line(margin, page_h - 30, page_w - margin, page_h - 30)

        # Footer (All pages)
        self.setStrokeColor(DIVIDER_LINE)
        self.setLineWidth(0.75)
        self.line(margin, 32, page_w - margin, 32)

        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)
        self.drawString(margin, 20, "Confidential Health Summary  •  Prepared for Patient Understanding")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(page_w - margin, 20, page_str)

        self.restoreState()


# ==============================================================================
# REPORT BUILDER CLASS
# ==============================================================================
class MedicalReportPDFBuilder:
    def __init__(self, output_path):
        self.output_path = output_path
        self.content = []
        self.usable_width = 540  # 612 - 2 * 36
        self._init_styles()

    def _init_styles(self):
        base = getSampleStyleSheet()

        self.style_doc_super = ParagraphStyle(
            'DocSuper',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=BLUE_BADGE,
            spaceAfter=3,
            textTransform='uppercase'
        )

        self.style_doc_title = ParagraphStyle(
            'DocTitle',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=PRIMARY_NAVY,
            spaceAfter=4
        )

        self.style_doc_subtitle = ParagraphStyle(
            'DocSubtitle',
            parent=base['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=15,
            textColor=TEXT_MUTED,
            spaceAfter=14
        )

        self.style_section_heading = ParagraphStyle(
            'SectionHeading',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=PRIMARY_NAVY,
            spaceBefore=12,
            spaceAfter=6,
            keepWithNext=True
        )

        self.style_subsection_heading = ParagraphStyle(
            'SubSectionHeading',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=TEXT_DARK,
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=True
        )

        self.style_body = ParagraphStyle(
            'Body',
            parent=base['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=TEXT_DARK
        )

        self.style_body_bold = ParagraphStyle(
            'BodyBold',
            parent=self.style_body,
            fontName='Helvetica-Bold'
        )

        self.style_meta_label = ParagraphStyle(
            'MetaLabel',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8.5,
            leading=11,
            textColor=TEXT_MUTED
        )

        self.style_meta_value = ParagraphStyle(
            'MetaValue',
            parent=base['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=12,
            textColor=TEXT_DARK
        )

        self.style_table_header = ParagraphStyle(
            'TableHeader',
            parent=base['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8.5,
            leading=11,
            textColor=PRIMARY_NAVY
        )

        self.style_table_cell = ParagraphStyle(
            'TableCell',
            parent=base['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11.5,
            textColor=TEXT_DARK
        )

        self.style_table_cell_bold = ParagraphStyle(
            'TableCellBold',
            parent=self.style_table_cell,
            fontName='Helvetica-Bold'
        )

        self.style_table_cell_muted = ParagraphStyle(
            'TableCellMuted',
            parent=self.style_table_cell,
            fontSize=8,
            leading=10.5,
            textColor=TEXT_MUTED
        )

        self.style_disclaimer = ParagraphStyle(
            'Disclaimer',
            parent=base['Normal'],
            fontName='Helvetica',
            fontSize=7.5,
            leading=10.5,
            textColor=TEXT_MUTED,
            alignment=1  # Centered
        )

    # --------------------------------------------------------------------------
    # Helper Flowables & Badges
    # --------------------------------------------------------------------------
    def _badge(self, text, color_type):
        """Generates inline HTML styled badge markup."""
        colors_map = {
            'HIGH': (RED_TEXT, RED_BG, RED_BORDER),
            'LOW': (AMBER_TEXT, AMBER_BG, AMBER_BORDER),
            'NORMAL': (GREEN_TEXT, GREEN_BG, GREEN_BORDER),
            'OVERWEIGHT': (AMBER_TEXT, AMBER_BG, AMBER_BORDER),
            'CONFIRMED': (RED_TEXT, RED_BG, RED_BORDER),
            'HISTORICAL': (AMBER_TEXT, AMBER_BG, AMBER_BORDER),
            'SUSPECTED': (AMBER_TEXT, AMBER_BG, AMBER_BORDER),
            'RULED OUT': (GREEN_TEXT, GREEN_BG, GREEN_BORDER),
            'MEDICATION': (BLUE_TEXT, BLUE_BG, BLUE_BORDER),
        }
        text_c, bg_c, border_c = colors_map.get(color_type, (TEXT_DARK, CARD_BG, CARD_BORDER))
        tc = text_c.hexval()
        bg = bg_c.hexval()
        return f'<font color="#{tc}"><b> {text} </b></font>'

    def _card_table(self, inner_flowables, bg_color=CARD_BG, border_color=CARD_BORDER, left_accent=None, padding=10):
        """Wraps flowables into a clean bounded card table with optional left accent border."""
        t = Table([[inner_flowables]], colWidths=[self.usable_width])
        style = [
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('BOX', (0,0), (-1,-1), 0.75, border_color),
            ('TOPPADDING', (0,0), (-1,-1), padding),
            ('BOTTOMPADDING', (0,0), (-1,-1), padding),
            ('LEFTPADDING', (0,0), (-1,-1), padding + (4 if left_accent else 0)),
            ('RIGHTPADDING', (0,0), (-1,-1), padding),
        ]
        if left_accent:
            style.append(('LINEBEFORE', (0,0), (0,0), 3.5, left_accent))
        t.setStyle(TableStyle(style))
        return t

    # --------------------------------------------------------------------------
    # Page 1: Header, Patient Info, Overview & Important Findings
    # --------------------------------------------------------------------------
    def add_page_1(self):
        # Header banner
        self.content.append(Paragraph("HEALTH REPORT EXPLANATION", self.style_doc_super))
        self.content.append(Paragraph("Medical Report — Easy Explanation", self.style_doc_title))
        self.content.append(Paragraph("An easy-to-understand explanation of your medical report and test results", self.style_doc_subtitle))

        # Patient Info Card (Clean 2-Column Grid)
        patient_grid = [
            [
                Paragraph("<b>Patient Name:</b> Johny S.", self.style_meta_value),
                Paragraph("<b>Date of Visit:</b> September 24, 2026", self.style_meta_value)
            ],
            [
                Paragraph("<b>Date of Birth:</b> August 14, 1989 (37 yrs)", self.style_meta_value),
                Paragraph("<b>Attending Doctor:</b> Dr. Emily Carter, MD", self.style_meta_value)
            ],
            [
                Paragraph("<b>Sex / MRN:</b> Male | RMF-TEST-20481", self.style_meta_value),
                Paragraph("<b>Department:</b> Internal Medicine Clinic", self.style_meta_value)
            ]
        ]
        pt_table = Table(patient_grid, colWidths=[260, 260])
        pt_table.setStyle(TableStyle([
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))

        p_info_card = self._card_table([
            Paragraph("<b>PATIENT INFORMATION</b>", self.style_table_header),
            Spacer(1, 4),
            pt_table
        ], bg_color=CARD_BG, border_color=CARD_BORDER, padding=8)
        self.content.append(p_info_card)
        self.content.append(Spacer(1, 10))

        # Report Overview Card
        overview_p = Paragraph(
            "This report explains your outpatient medical follow-up visit on September 24, 2026. "
            "The primary focus of this appointment was to evaluate your <b>blood pressure control</b>, review your <b>recent blood and cholesterol lab results</b>, "
            "and address symptoms of <b>seasonal nasal congestion and heartburn</b>. Below is a structured, plain-language translation of all medical findings.",
            self.style_body
        )
        overview_card = self._card_table([
            Paragraph("<b>REPORT OVERVIEW</b>", self.style_table_header),
            Spacer(1, 4),
            overview_p
        ], bg_color=colors.white, border_color=CARD_BORDER, padding=8)
        self.content.append(overview_card)
        self.content.append(Spacer(1, 12))

        # Important Findings Card (High-Impact Visual Box)
        findings_data = [
            [
                Paragraph('<font color="#B91C1C"><b>🔴 ELEVATED</b></font>', self.style_table_cell_bold),
                Paragraph("<b>Blood Pressure remains elevated</b> — Clinic reading was 148/92 mmHg, matching home averages of 145–150/90–94 mmHg.", self.style_body)
            ],
            [
                Paragraph('<font color="#B45309"><b>🟠 HIGH</b></font>', self.style_table_cell_bold),
                Paragraph("<b>Blood Sugar results are high</b> — Fasting blood glucose is 156 mg/dL and HbA1c is 7.4% (in the diabetes range).", self.style_body)
            ],
            [
                Paragraph('<font color="#B45309"><b>🟠 ABNORMAL</b></font>', self.style_table_cell_bold),
                Paragraph("<b>Cholesterol panel is elevated</b> — Total cholesterol (232 mg/dL), LDL (152 mg/dL), and triglycerides (205 mg/dL) are above target; HDL (39 mg/dL) is low.", self.style_body)
            ],
            [
                Paragraph('<font color="#15803D"><b>🟢 NORMAL</b></font>', self.style_table_cell_bold),
                Paragraph("<b>Kidney, Liver & Thyroid functions are healthy</b> — Creatinine (1.0 mg/dL), eGFR (94), ALT liver enzyme (29 U/L), and TSH (2.1 mIU/L) are all fully within normal limits.", self.style_body)
            ],
            [
                Paragraph('<font color="#0369A1"><b>🔵 NOTED</b></font>', self.style_table_cell_bold),
                Paragraph("<b>Allergies & Reflux noted</b> — Mild nasal swelling seen on physical exam from seasonal allergies, and heartburn symptoms noted.", self.style_body)
            ]
        ]
        f_table = Table(findings_data, colWidths=[90, 420])
        f_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 4),
            ('RIGHTPADDING', (0,0), (-1,-1), 4),
            ('LINEBELOW', (0,0), (-1,-2), 0.5, CARD_BORDER),
        ]))

        findings_card = self._card_table([
            Paragraph("<b>KEY HIGHLIGHTS & IMPORTANT FINDINGS</b>", ParagraphStyle('FH', parent=self.style_table_header, fontSize=10, leading=12, textColor=PRIMARY_NAVY)),
            Spacer(1, 6),
            f_table
        ], bg_color=CARD_BG, border_color=PRIMARY_NAVY, left_accent=PRIMARY_NAVY, padding=10)

        self.content.append(findings_card)
        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 2: Detailed Test Results & Labs
    # --------------------------------------------------------------------------
    def add_page_2(self):
        self.content.append(Paragraph("TEST RESULTS EXPLAINED", self.style_section_heading))
        self.content.append(Paragraph("Complete breakdown of laboratory blood tests, reference ranges, and plain-language interpretations.", self.style_body))
        self.content.append(Spacer(1, 8))

        # 1. Blood Sugar Section
        sugar_data = [
            [
                Paragraph("<b>Test Name</b>", self.style_table_header),
                Paragraph("<b>Your Result</b>", self.style_table_header),
                Paragraph("<b>Healthy Target</b>", self.style_table_header),
                Paragraph("<b>Status</b>", self.style_table_header),
            ],
            [
                Paragraph("<b>Fasting Blood Glucose</b><br/><font color='#64748B' size='7.5'>Blood sugar after 8+ hrs fasting</font>", self.style_table_cell),
                Paragraph("<b>156 mg/dL</b>", ParagraphStyle('R1', parent=self.style_table_cell_bold, textColor=AMBER_TEXT)),
                Paragraph("70 – 99 mg/dL", self.style_table_cell),
                Paragraph('<font color="#B45309"><b>HIGH</b></font>', self.style_table_cell_bold),
            ],
            [
                Paragraph("<b>HbA1c (Hemoglobin A1c)</b><br/><font color='#64748B' size='7.5'>Average 3-month blood sugar</font>", self.style_table_cell),
                Paragraph("<b>7.4 %</b>", ParagraphStyle('R2', parent=self.style_table_cell_bold, textColor=RED_TEXT)),
                Paragraph("&lt; 5.7% (Healthy)<br/>5.7–6.4% (Pre-diabetes)<br/>&ge; 6.5% (Diabetes range)", self.style_table_cell_muted),
                Paragraph('<font color="#B91C1C"><b>HIGH (Diabetic)</b></font>', self.style_table_cell_bold),
            ]
        ]
        st_table = Table(sugar_data, colWidths=[160, 95, 175, 90])
        st_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))

        sugar_meaning = Paragraph(
            "<b>What this means:</b> HbA1c shows your average blood sugar over the last 2 to 3 months. "
            "A result of <b>7.4%</b> indicates that average blood sugar is elevated into the diabetes range, meaning your body is having trouble processing glucose efficiently.",
            self.style_body
        )

        self.content.append(Paragraph("1. Blood Sugar & Glucose Control", self.style_subsection_heading))
        self.content.append(st_table)
        self.content.append(Spacer(1, 4))
        self.content.append(self._card_table([sugar_meaning], bg_color=AMBER_BG, border_color=AMBER_BORDER, left_accent=AMBER_BADGE, padding=6))
        self.content.append(Spacer(1, 10))

        # 2. Cholesterol Panel
        lipid_data = [
            [
                Paragraph("<b>Lipid Component</b>", self.style_table_header),
                Paragraph("<b>Your Result</b>", self.style_table_header),
                Paragraph("<b>Healthy Target</b>", self.style_table_header),
                Paragraph("<b>Status</b>", self.style_table_header),
            ],
            [
                Paragraph("<b>Total Cholesterol</b>", self.style_table_cell),
                Paragraph("<b>232 mg/dL</b>", self.style_table_cell_bold),
                Paragraph("&lt; 200 mg/dL", self.style_table_cell),
                Paragraph('<font color="#B45309"><b>HIGH</b></font>', self.style_table_cell_bold),
            ],
            [
                Paragraph("<b>LDL Cholesterol</b> (Bad fat)", self.style_table_cell),
                Paragraph("<b>152 mg/dL</b>", self.style_table_cell_bold),
                Paragraph("&lt; 100 mg/dL (Optimal)", self.style_table_cell),
                Paragraph('<font color="#B45309"><b>HIGH</b></font>', self.style_table_cell_bold),
            ],
            [
                Paragraph("<b>HDL Cholesterol</b> (Good fat)", self.style_table_cell),
                Paragraph("<b>39 mg/dL</b>", self.style_table_cell_bold),
                Paragraph("&ge; 40 mg/dL (Men)", self.style_table_cell),
                Paragraph('<font color="#B45309"><b>LOW</b></font>', self.style_table_cell_bold),
            ],
            [
                Paragraph("<b>Triglycerides</b> (Stored fat)", self.style_table_cell),
                Paragraph("<b>205 mg/dL</b>", self.style_table_cell_bold),
                Paragraph("&lt; 150 mg/dL", self.style_table_cell),
                Paragraph('<font color="#B45309"><b>HIGH</b></font>', self.style_table_cell_bold),
            ],
        ]
        lp_table = Table(lipid_data, colWidths=[160, 95, 175, 90])
        lp_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))

        lipid_meaning = Paragraph(
            "<b>What this means:</b> LDL ('bad' cholesterol) can build up along artery walls over time. "
            "Higher LDL and triglycerides combined with lower HDL ('good' protective cholesterol) increase cardiovascular risk, which is why your doctor prescribes cholesterol medication and lifestyle changes.",
            self.style_body
        )

        self.content.append(Paragraph("2. Cholesterol & Lipid Panel", self.style_subsection_heading))
        self.content.append(lp_table)
        self.content.append(Spacer(1, 4))
        self.content.append(self._card_table([lipid_meaning], bg_color=AMBER_BG, border_color=AMBER_BORDER, left_accent=AMBER_BADGE, padding=6))
        self.content.append(Spacer(1, 10))

        # 3. Kidney, Liver, Thyroid & Vitals Grid (Compact 2-Column Tables)
        organ_data = [
            [
                Paragraph("<b>Kidney, Liver & Thyroid Tests</b>", self.style_table_header),
                Paragraph("<b>Result & Status</b>", self.style_table_header)
            ],
            [
                Paragraph("<b>Creatinine</b> (Kidney filter waste)<br/><font size='7.5' color='#64748B'>Normal: 0.7 – 1.3 mg/dL</font>", self.style_table_cell),
                Paragraph("<b>1.0 mg/dL</b> &nbsp; <font color='#15803D'><b>[NORMAL]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>eGFR</b> (Kidney filtration efficiency)<br/><font size='7.5' color='#64748B'>Normal: &ge; 60 mL/min/1.73m²</font>", self.style_table_cell),
                Paragraph("<b>94</b> &nbsp; <font color='#15803D'><b>[NORMAL]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>ALT</b> (Liver enzyme)<br/><font size='7.5' color='#64748B'>Normal: 7 – 56 U/L</font>", self.style_table_cell),
                Paragraph("<b>29 U/L</b> &nbsp; <font color='#15803D'><b>[NORMAL]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>TSH</b> (Thyroid hormone)<br/><font size='7.5' color='#64748B'>Normal: 0.4 – 4.0 mIU/L</font>", self.style_table_cell),
                Paragraph("<b>2.1 mIU/L</b> &nbsp; <font color='#15803D'><b>[NORMAL]</b></font>", self.style_table_cell)
            ],
        ]
        org_table = Table(organ_data, colWidths=[160, 100])
        org_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))

        vitals_data = [
            [
                Paragraph("<b>Vital Signs & Measurements</b>", self.style_table_header),
                Paragraph("<b>Result & Status</b>", self.style_table_header)
            ],
            [
                Paragraph("<b>Blood Pressure (BP)</b><br/><font size='7.5' color='#64748B'>Target: &lt; 120/80 mmHg</font>", self.style_table_cell),
                Paragraph("<b>148/92 mmHg</b> &nbsp; <font color='#B91C1C'><b>[HIGH]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>Body Mass Index (BMI)</b><br/><font size='7.5' color='#64748B'>Normal: 18.5 – 24.9 kg/m²</font>", self.style_table_cell),
                Paragraph("<b>27.9 kg/m²</b> &nbsp; <font color='#B45309'><b>[OVERWEIGHT]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>Blood Oxygen (SpO2)</b><br/><font size='7.5' color='#64748B'>Normal: 95 – 100%</font>", self.style_table_cell),
                Paragraph("<b>98% (Room Air)</b> &nbsp; <font color='#15803D'><b>[NORMAL]</b></font>", self.style_table_cell)
            ],
            [
                Paragraph("<b>Pulse / Temp / Resp</b><br/><font size='7.5' color='#64748B'>Heart rate, temperature, breathing</font>", self.style_table_cell),
                Paragraph("<b>82 bpm | 98.4°F | 16/min</b><br/><font color='#15803D'><b>[ALL NORMAL]</b></font>", self.style_table_cell)
            ],
        ]
        vit_table = Table(vitals_data, colWidths=[160, 100])
        vit_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, CARD_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))

        combo_table = Table([[org_table, vit_table]], colWidths=[265, 265])
        combo_table.setStyle(TableStyle([
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))

        self.content.append(Paragraph("3. Organ Health & Vital Signs", self.style_subsection_heading))
        self.content.append(combo_table)
        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 3: Conditions Mentioned in the Report
    # --------------------------------------------------------------------------
    def add_page_3(self):
        self.content.append(Paragraph("CONDITIONS MENTIONED IN THE REPORT", self.style_section_heading))
        self.content.append(Paragraph("Every condition identified in your report is clearly classified below by its clinical status (Confirmed, Past History, or Assessment).", self.style_body))
        self.content.append(Spacer(1, 8))

        # Condition 1: Hypertension (Confirmed)
        htn_card = self._card_table([
            Paragraph('<font color="#B91C1C"><b>🔴 CONFIRMED CONDITION  •  ACTIVE DIAGNOSIS</b></font>', self.style_table_header),
            Spacer(1, 2),
            Paragraph("<b>Essential Hypertension (High Blood Pressure)</b>", self.style_subsection_heading),
            Paragraph("<b>What it means:</b> The force of blood against your artery walls is consistently higher than it should be (measured at 148/92 mmHg in clinic and 145–150/90–94 mmHg at home). "
                      "Uncontrolled high blood pressure places extra strain on the heart and arteries over time.", self.style_body)
        ], bg_color=RED_BG, border_color=RED_BORDER, left_accent=RED_BADGE, padding=8)
        self.content.append(htn_card)
        self.content.append(Spacer(1, 7))

        # Condition 2: Mixed Hyperlipidemia (Confirmed)
        lipid_card = self._card_table([
            Paragraph('<font color="#B91C1C"><b>🔴 CONFIRMED CONDITION  •  ACTIVE DIAGNOSIS</b></font>', self.style_table_header),
            Spacer(1, 2),
            Paragraph("<b>Mixed Hyperlipidemia (High Cholesterol & Triglycerides)</b>", self.style_subsection_heading),
            Paragraph("<b>What it means:</b> You have an unhealthy balance of fats in your blood: high total cholesterol (232 mg/dL), high bad LDL (152 mg/dL), high triglycerides (205 mg/dL), and low good HDL (39 mg/dL).", self.style_body)
        ], bg_color=RED_BG, border_color=RED_BORDER, left_accent=RED_BADGE, padding=8)
        self.content.append(lipid_card)
        self.content.append(Spacer(1, 7))

        # Condition 3: Gastroesophageal Reflux (Confirmed)
        gerd_card = self._card_table([
            Paragraph('<font color="#B91C1C"><b>🔴 CONFIRMED CONDITION  •  ACTIVE SYMPTOM</b></font>', self.style_table_header),
            Spacer(1, 2),
            Paragraph("<b>Gastroesophageal Reflux Disease (Heartburn / Acid Reflux)</b>", self.style_subsection_heading),
            Paragraph("<b>What it means:</b> Stomach acid backs up into the esophagus (food pipe), causing burning chest discomfort and a sour taste, especially after heavy meals.", self.style_body)
        ], bg_color=RED_BG, border_color=RED_BORDER, left_accent=RED_BADGE, padding=8)
        self.content.append(gerd_card)
        self.content.append(Spacer(1, 7))

        # Condition 4: Allergic Rhinitis (Confirmed)
        allergy_card = self._card_table([
            Paragraph('<font color="#B91C1C"><b>🔴 CONFIRMED CONDITION  •  ACTIVE SYMPTOM</b></font>', self.style_table_header),
            Spacer(1, 2),
            Paragraph("<b>Allergic Rhinitis (Seasonal Allergies / Nasal Congestion)</b>", self.style_subsection_heading),
            Paragraph("<b>What it means:</b> Seasonal allergies causing sneezing, runny nose, and mild swelling inside the nasal passages.", self.style_body)
        ], bg_color=RED_BG, border_color=RED_BORDER, left_accent=RED_BADGE, padding=8)
        self.content.append(allergy_card)
        self.content.append(Spacer(1, 7))

        # Condition 5: Prediabetes (Historical) & Type 2 Diabetes Note
        hist_card = self._card_table([
            Paragraph('<font color="#B45309"><b>🟠 FROM PAST MEDICAL HISTORY & CLINICAL ASSESSMENT</b></font>', self.style_table_header),
            Spacer(1, 2),
            Paragraph("<b>Prediabetes & Blood Sugar Elevation (Type 2 Diabetes Criteria)</b>", self.style_subsection_heading),
            Paragraph("<b>What it means:</b> Prediabetes was previously documented in your medical history. Your current lab results (Fasting Glucose 156 mg/dL and HbA1c 7.4%) indicate progression into the Type 2 Diabetes range. "
                      "Your doctor has you on blood sugar medication (metformin) and scheduled repeat testing in 3 months.", self.style_body)
        ], bg_color=AMBER_BG, border_color=AMBER_BORDER, left_accent=AMBER_BADGE, padding=8)
        self.content.append(hist_card)
        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 4: Medications
    # --------------------------------------------------------------------------
    def add_page_4(self):
        self.content.append(Paragraph("MEDICATIONS SUMMARY", self.style_section_heading))
        self.content.append(Paragraph("The medications mentioned in your visit summary, including their dosages, schedules, and specific purposes.", self.style_body))
        self.content.append(Spacer(1, 8))

        meds = [
            {
                'name': 'Amlodipine',
                'dose': '10 mg once daily (Increased from 5 mg)',
                'purpose': 'Blood pressure control',
                'details': 'Relaxes and widens your blood vessels so blood can flow more easily, lowering blood pressure. Your doctor increased the dose to help reach your target pressure.'
            },
            {
                'name': 'Metformin',
                'dose': '500 mg twice daily with meals',
                'purpose': 'Blood sugar management',
                'details': 'Helps your body use insulin more effectively and reduces the amount of glucose produced by your liver. Taking it with meals reduces stomach upset.'
            },
            {
                'name': 'Atorvastatin',
                'dose': '20 mg once daily at bedtime',
                'purpose': 'Cholesterol & cardiovascular protection',
                'details': 'A statin medication that lowers "bad" LDL cholesterol and triglycerides while stabilizing blood vessel walls.'
            },
            {
                'name': 'Omeprazole',
                'dose': '20 mg once daily before breakfast (as needed)',
                'purpose': 'Stomach acid & heartburn relief',
                'details': 'Reduces the amount of acid your stomach produces to soothe the esophagus and prevent heartburn.'
            }
        ]

        for m in meds:
            m_content = [
                Paragraph('<font color="#0369A1"><b>🔵 CURRENT MEDICATION</b></font>', self.style_table_header),
                Spacer(1, 2),
                Paragraph(f"<b>{m['name']}</b> &nbsp; — &nbsp; <font color='#0369A1'><b>{m['dose']}</b></font>", self.style_subsection_heading),
                Paragraph(f"<b>Prescribed For:</b> {m['purpose']}", self.style_body_bold),
                Spacer(1, 1),
                Paragraph(f"<b>How it works:</b> {m['details']}", self.style_body),
            ]
            self.content.append(self._card_table(m_content, bg_color=BLUE_BG, border_color=BLUE_BORDER, left_accent=BLUE_BADGE, padding=7))
            self.content.append(Spacer(1, 7))

        med_note = Paragraph(
            "<b>Important Note:</b> Never change, stop, or skip your prescribed medication without discussing it first with your doctor or pharmacist.",
            self.style_body
        )
        self.content.append(self._card_table([med_note], bg_color=CARD_BG, border_color=CARD_BORDER, padding=7))
        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 5: What the Report Did NOT Find (Negative / Ruled-Out Findings)
    # --------------------------------------------------------------------------
    def add_page_5(self):
        self.content.append(Paragraph("WHAT THE REPORT DID NOT FIND", self.style_section_heading))
        self.content.append(Paragraph("These critical conditions and symptoms were explicitly evaluated during your visit and were <b>ruled out / not present</b>. This provides reassuring context about your overall health.", self.style_body))
        self.content.append(Spacer(1, 8))

        neg_cards = [
            ("✓ No Evidence of Heart Attack (Myocardial Infarction)",
             "You had no severe chest pain, left arm pain, or pressure, and your cardiovascular evaluation was reassuring."),
            ("✓ No Evidence of Stroke",
             "Your neurological examination was completely normal with no facial drooping, focal muscle weakness, or speech issues."),
            ("✓ No Evidence of Kidney Disease",
             "Your kidney blood tests (Creatinine 1.0 mg/dL and eGFR 94) confirm that both kidneys are filtering waste normally."),
            ("✓ No Evidence of Edema (Fluid Swelling)",
             "Physical examination showed no swelling in your lower legs, ankles, or feet."),
            ("✓ No Shortness of Breath or Breathing Difficulty",
             "Your lungs were completely clear upon examination and oxygen levels were optimal at 98%."),
            ("✓ No Fever, Cough, or Acute Infection",
             "There were no signs of respiratory tract infection, pneumonia, or systemic illness.")
        ]

        for title, desc in neg_cards:
            item = [
                Paragraph(f'<font color="#15803D"><b>{title}</b></font>', self.style_subsection_heading),
                Paragraph(desc, self.style_body)
            ]
            self.content.append(self._card_table(item, bg_color=GREEN_BG, border_color=GREEN_BORDER, left_accent=GREEN_BADGE, padding=6))
            self.content.append(Spacer(1, 6))

        denied_syms = Paragraph(
            "<b>Additional Symptoms Evaluated and Denied:</b> Chest pain, syncope (fainting), palpitations (rapid heart beats), "
            "vomiting, abdominal pain, excessive urination (polyuria), wheezing, and unexplained weight loss were all confirmed <b>absent</b>.",
            self.style_body
        )
        self.content.append(self._card_table([denied_syms], bg_color=CARD_BG, border_color=CARD_BORDER, padding=7))
        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 6: Medical Terms Explained
    # --------------------------------------------------------------------------
    def add_page_6(self):
        self.content.append(Paragraph("MEDICAL TERMS EXPLAINED", self.style_section_heading))
        self.content.append(Paragraph("Medical reports often use technical clinical terms. Here are simple, everyday translations of the terms used in your report.", self.style_body))
        self.content.append(Spacer(1, 8))

        terms = [
            ("Epigastric Discomfort",
             "Burning, fullness, or pain felt in the upper-middle area of your abdomen right below the ribcage (commonly known as heartburn or indigestion)."),
            ("Nasal Mucosal Edema",
             "Mild swelling of the delicate, pink tissue lining the inside of your nose, typically triggered by seasonal airborne allergies."),
            ("Clear to Auscultation (Lungs CTA)",
             "When the physician listened to your chest and back using a stethoscope, normal and healthy airflow was heard with no wheezing or crackles."),
            ("Non-Distended, Non-Tender Abdomen",
             "Your belly area was soft, not swollen or bloated, and did not hurt when the doctor pressed gently on it."),
            ("Grossly Intact Neurological Exam",
             "Your nerve function, body reflexes, muscle strength, balance, and sensations across arms and legs are completely normal."),
            ("Fasting Blood Glucose vs. HbA1c",
             "Fasting glucose measures your blood sugar at one exact moment in the morning; HbA1c measures your average blood sugar level over the past 90 days.")
        ]

        for term, meaning in terms:
            t_box = [
                Paragraph(f"<b>{term.upper()}</b>", ParagraphStyle('TH', parent=self.style_table_header, fontSize=9.5, leading=12, textColor=PRIMARY_NAVY)),
                Spacer(1, 2),
                Paragraph(f"<b>In simple terms:</b> {meaning}", self.style_body)
            ]
            self.content.append(self._card_table(t_box, bg_color=CARD_BG, border_color=CARD_BORDER, padding=7))
            self.content.append(Spacer(1, 6))

        self.content.append(PageBreak())

    # --------------------------------------------------------------------------
    # Page 7: Follow-up, Instructions & Disclaimer
    # --------------------------------------------------------------------------
    def add_page_7(self):
        self.content.append(Paragraph("FOLLOW-UP & ACTION PLAN", self.style_section_heading))
        self.content.append(Paragraph("Important next steps, home monitoring instructions, repeat laboratory tests, and upcoming appointments scheduled by your healthcare provider.", self.style_body))
        self.content.append(Spacer(1, 8))

        actions = [
            ("1. Home Blood Pressure Monitoring",
             "Record your blood pressure at home <b>twice daily</b> (morning and evening) for the next <b>14 days</b>. Bring your written log or phone app log to your next clinic appointment."),
            ("2. Continue Prescribed Medication Routine",
             "Take your adjusted <b>Amlodipine (10 mg)</b> once daily and continue <b>Metformin</b> twice daily with meals. Take Atorvastatin at bedtime."),
            ("3. Dietary & Lifestyle Adjustments",
             "Emphasize a heart-healthy, lower-sodium diet. Avoid late-night heavy meals and spicy/acidic foods that trigger heartburn."),
            ("4. Repeat Laboratory Testing in 3 Months",
             "Schedule repeat blood tests for <b>HbA1c</b> (blood sugar) and a <b>Lipid Panel</b> (cholesterol) in approximately 3 months to monitor medication effectiveness."),
            ("5. Clinic Follow-up Visit in 4 Weeks",
             "Return to the Internal Medicine clinic in <b>4 weeks</b> with Dr. Emily Carter to review your home blood pressure log and discuss your response to the adjusted medication dose.")
        ]

        for title, desc in actions:
            a_box = [
                Paragraph(f'<font color="#6D28D9"><b>🟣 {title}</b></font>', self.style_subsection_heading),
                Paragraph(desc, self.style_body)
            ]
            self.content.append(self._card_table(a_box, bg_color=PURPLE_BG, border_color=PURPLE_BORDER, left_accent=PURPLE_BADGE, padding=7))
            self.content.append(Spacer(1, 6))

        self.content.append(Spacer(1, 14))

        # Bottom Disclaimer Box
        disclaimer_text = (
            "<b>Important Medical Disclaimer:</b> This document is an AI-generated plain-language explanation "
            "of the uploaded medical report. It is intended solely to help make clinical information easier to understand "
            "and does not replace medical advice, diagnosis, or treatment from a qualified healthcare professional. "
            "If you experience severe symptoms, chest pain, or shortness of breath, seek immediate medical attention."
        )
        disc_box = self._card_table([Paragraph(disclaimer_text, self.style_disclaimer)], bg_color=CARD_BG, border_color=CARD_BORDER, padding=8)
        self.content.append(disc_box)

    # --------------------------------------------------------------------------
    # Build Method
    # --------------------------------------------------------------------------
    def build(self):
        doc = SimpleDocTemplate(
            self.output_path,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        self.add_page_1()
        self.add_page_2()
        self.add_page_3()
        self.add_page_4()
        self.add_page_5()
        self.add_page_6()
        self.add_page_7()

        doc.build(self.content, canvasmaker=NumberedCanvas)
        print(f"[SUCCESS] PDF generated at: {self.output_path}")


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
if __name__ == '__main__':
    outputs_dir = os.path.join(os.path.dirname(__file__), 'outputs')
    os.makedirs(outputs_dir, exist_ok=True)

    pdf_target_1 = os.path.join(outputs_dir, 'medical_report_easy_explanation.pdf')
    pdf_target_2 = os.path.join(os.path.dirname(__file__), 'Medical_Report_Easy_Explanation.pdf')

    builder = MedicalReportPDFBuilder(pdf_target_1)
    builder.build()

    # Copy to root clean filename
    shutil.copyfile(pdf_target_1, pdf_target_2)
    print(f"[SUCCESS] Copy created at: {pdf_target_2}")
