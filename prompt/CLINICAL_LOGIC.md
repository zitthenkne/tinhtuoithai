# CLINICAL LOGIC & OBSTETRICAL ALGORITHMS (UMP HCMC STANDARDS)
> Academic reference: Department of Obstetrics and Gynecology, University of Medicine and Pharmacy at Ho Chi Minh City (Lectures by Assoc. Prof. Au Nhut Luan and Assoc. Prof. Tran Nhat Thang, Practical Textbook 2025).

---

## 1. THE ZERO-HOUR RECKONING & GESTATIONAL AGE (GA)
- **Theoretical Conception Point:** Fertilization occurs approximately 14 days after the onset of menses in a standard 28-day cycle.
- **Gestational Age (Amenorrhea Age):** Counted from the FIRST DAY of the Last Menstrual Period (LMP). Clinically, this adds approximately 14 days before actual biological conception.

### The 4 Mandatory Reliability Criteria for LMP:
A reported LMP is medically reliable ONLY IF all 4 conditions are verified:
1. Menstrual regularity: Cycle length between 28 and 30 days for at least 3 consecutive cycles.
2. Exact recall: The patient accurately recalls the first calendar day of menstrual bleeding.
3. Hormonal contraceptive wash-out: No oral contraceptive pills, injectables, or implants used within the last 3 months.
4. No postpartum lactation amenorrhea: Patient is not currently breastfeeding or experiencing prolactin-induced amenorrhea.

*Decision Rule:* If any condition fails, flag LMP as UNRELIABLE. The clinician must discard Naegele's formula and rely strictly on First Trimester Ultrasound (CRL).

---

## 2. NAEGELE'S FORMULA CALCULATION
Calculates the Expected Date of Delivery (EDD) corresponding to 40 weeks (280 days) from LMP:
- Standard case (Months 4 to 12):
  - EDD Day = LMP Day + 7
  - EDD Month = LMP Month - 3
  - EDD Year = LMP Year + 1
- Early year case (Months 1, 2, 3):
  - EDD Day = LMP Day + 7
  - EDD Month = LMP Month + 9
  - EDD Year = LMP Year + 0

### Calendar Precision Engine:
When calculating current gestational age (elapsed days from LMP to Exam Date):
- Accurately count elapsed calendar days accounting for month lengths (30 vs 31 days).
- February leap-year verification: February has 29 days if `(year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)`.
- Format output: `X weeks Y days` (e.g., `12+3 weeks`).

---

## 3. FIRST TRIMESTER ULTRASOUND ARBITRATION (CROWN-RUMP LENGTH - CRL)
Crown-Rump Length (CRL) is the golden biological standard because embryonic growth in the first trimester follows a strict genetic clock with minimal individual variance (biological error margin: +- 3 to 5 days).

- Ideal measurement window: $CRL = 30 - 84$ mm (equivalent to $10 - 13^{+6}$ weeks).
- Measurement window for rapid clinical estimation: $CRL = 10 - 30$ mm.
- **Rapid Clinical Formula (Luan-Duy Rule):**
  $$\text{Gestational Age (days)} = 42 + CRL\text{ (mm)}$$
  *(Example: $CRL = 14$ mm -> $\text{Gestational Age} = 42 + 14 = 56$ days = 8 weeks 0 days).*

### ACOG / ISUOG Discrepancy Arbitration Matrix:
1. If Gestational Age $< 9$ weeks ($CRL < 23$ mm):
   - If $|GA_{LMP} - GA_{CRL}| > 5$ days: REVISE EDD to match Ultrasound CRL.
   - If $|GA_{LMP} - GA_{CRL}| \le 5$ days: MAINTAIN LMP-derived EDD.
2. If Gestational Age $9 - 13^{+6}$ weeks ($CRL = 24 - 84$ mm):
   - If $|GA_{LMP} - GA_{CRL}| > 7$ days: REVISE EDD to match Ultrasound CRL.
   - If $|GA_{LMP} - GA_{CRL}| \le 7$ days: MAINTAIN LMP-derived EDD.

### Immutable Dating Axiom:
Once an official EDD is established in the first trimester (via CRL or reliable LMP), THAT EDD IS IMMUTABLE THROUGHOUT THE ENTIRE PREGNANCY. NEVER modify gestational age during second or third trimester scans. Second and third trimester biometric changes reflect fetal growth pathology (FGR or macrosomia), not dating variation.

---

## 4. IN VITRO FERTILIZATION (IVF / ART) DATING AXIOM
In assisted reproductive technology, the exact fertilization and embryo transfer times are known with microscopic certainty:
- **Day 3 Embryo Transfer (Cleavage Stage):**
  $$\text{Gestational Age at Transfer} = 14 + 3 = 17\text{ days}$$
  $$\text{Current GA (days)} = (\text{Exam Date} - \text{Transfer Date}) + 17\text{ days}$$
- **Day 5 Blastocyst Transfer:**
  $$\text{Gestational Age at Transfer} = 14 + 5 = 19\text{ days}$$
  $$\text{Current GA (days)} = (\text{Exam Date} - \text{Transfer Date}) + 19\text{ days}$$

### OSCE Clinical Trap:
If a 12-week ultrasound shows a fetal CRL measuring smaller than the IVF gestational age by 8 days, THE EXAMINER EXPECTS YOU TO RETAIN THE IVF AGE. NEVER revise IVF dates backwards. Smaller biometry is an early warning sign of Early Fetal Growth Restriction (Early FGR) or aneuploidy, NOT a dating error.

---

## 5. CLINICAL & PHYSICAL CORRELATIONS
- **Expected Symphysis-Fundal Height (BCTC):**
  $$\text{Expected BCTC (cm)} = \text{Gestational Age (weeks)} - 4$$
- **Rapid Estimation of Age from BCTC:**
  $$\text{Gestational Age (weeks)} = BCTC + 4$$
  $$\text{Gestational Age (months)} = \frac{BCTC}{4} + 1$$
- **Johnson's Formula for Fetal Weight (Term Cephalic Pregnancy):**
  $$\text{Fetal Weight (grams)} = (BCTC - n) \times 155$$
  - $n = 12$ when fetal head is NOT engaged (Leopold 4 hands converge).
  - $n = 11$ when fetal head IS engaged (Leopold 4 hands diverge).

---

## 6. CLINICAL MILESTONES BY GESTATIONAL AGE
- Week $11 - 13^{+6}$: Combined Test / NIPT and Nuchal Translucency (NT) measurement.
- Week $20 - 22$: Detailed level II fetal anomaly scan.
- Week $24 - 28$: 75g Oral Glucose Tolerance Test (OGTT) for gestational diabetes.
- Week $28$: Tetanus Toxoid vaccination (VAT dose 1) and Anti-D immunoglobulin if Rh(-).
- Week $32$: Growth evaluation and placental localization scan.
- Week $35 - 37$: Vagino-rectal swab for Group B Streptococcus (GBS) culture.
- Week $37 - 41^{+6}$: Full-term gestational period.
- Week $\ge 42$: Post-term pregnancy (high risk for oligohydramnios and fetal compromise).
