# Deep-Compliance: 3-Year Financial Model & P&L

**Document Version:** 1.0.0
**Date:** 2026-02-14
**Model Type:** Bottom-up revenue projection + detailed P&L
**Currency:** EUR
**Fiscal Year:** Calendar year

---

## Executive Summary

### Financial Highlights (Year 3)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Revenue** | €542K | €2.84M | €7.12M |
| **Gross Profit** | €379K | €2.13M | €5.51M |
| **Gross Margin** | 70% | 75% | 77% |
| **EBITDA** | -€358K | €334K | €2.14M |
| **EBITDA Margin** | -66% | 12% | 30% |
| **Customers** | 18 | 68 | 156 |
| **ARR (Recurring)** | €108K | €1.14M | €4.27M |
| **Cash Burn** | €358K | -€334K (profit) | -€2.14M (profit) |

**Break-Even:** Month 18 (Q2 Year 2)
**Path to Profitability:** ✅ Achievable without additional funding
**3-Year Cumulative EBITDA:** €2.12M
**Investment Required:** €400K (methods implementation) + €358K (Year 1 ops) = **€758K total**

---

## Market Assumptions

### Total Addressable Market (TAM) - Multi-Regulation

**Expanded TAM with 7 Compliance Patterns:**

| Regulation | TAM (Annual) | Target Customers (EU + USA) | Avg Deal Size | Notes |
|------------|--------------|------------------------------|---------------|-------|
| **EU AI Act** | €750M - €3.75B | 15,000-20,000 AI systems in EU | €50K-187K | Core market, Aug 2026 deadline |
| **GDPR** | €450M - €1.8B | 25,000-35,000 data processors | €18K-51K | Mature market, add-on opportunity |
| **HIPAA** | €600M - €2.4B | 12,000-18,000 healthcare AI (USA) | €50K-133K | USA market, high willingness to pay |
| **SOC 2** | €380M - €1.5B | 18,000-25,000 SaaS AI platforms | €21K-60K | Recurring revenue opportunity |
| **ISO 27001** | €280M - €1.1B | 8,000-12,000 enterprises | €35K-92K | Certification-driven |
| **NIS2** | €220M - €880M | 5,000-8,000 critical infra | €44K-110K | EU only, Oct 2024 deadline |
| **Multi-Regulation** | €1.2B - €4.8B | 8,000-12,000 complex systems | €100K-400K | Premium tier, highest value |
| **TOTAL TAM** | **€3.88B - €15.5B** | **91K - 130K** | **€42K-119K avg** | Addressable over 5 years |

**Serviceable Addressable Market (SAM):** €1.2B - €4.8B (31% of TAM)
- Mid-market focus (€10M-€500M revenue companies)
- Automated assessment sweet spot (vs. Big 4 consulting)

**Serviceable Obtainable Market (SOM - Year 3):** €40M - €120M (1-2.5% of SAM)
- Market share: 0.6-1.2% of SAM by Year 3
- 156 customers × €45.6K avg = €7.12M (conservative)

---

## Revenue Model

### Pricing Strategy (Multi-Regulation)

**TIER 1: SINGLE REGULATION - ESSENTIALS**
```yaml
price_range: €12,000 - €25,000
regulations_covered: 1
scope: "GENERAL_PURPOSE AI or low-complexity HIGH_RISK"
delivery_time: "2-4 hours (mostly automated)"
target_customers:
  - E-commerce (GDPR only)
  - Marketing AI (Article 52 transparency)
  - Low-risk SaaS (SOC 2 Lite)
margin: 85%
annual_volume_year3: 35 customers
revenue_contribution_year3: €630K (9%)
```

**TIER 2: SINGLE REGULATION - PROFESSIONAL**
```yaml
price_range: €35,000 - €65,000
regulations_covered: 1
scope: "HIGH_RISK AI, full 6-step assessment"
delivery_time: "4-8 hours (automated + expert review)"
target_customers:
  - Fintech (EU AI Act)
  - HR Tech (EU AI Act + GDPR)
  - Healthcare USA (HIPAA)
  - SaaS platforms (SOC 2)
margin: 75%
annual_volume_year3: 58 customers
revenue_contribution_year3: €2.9M (41%)
```

**TIER 3: MULTI-REGULATION - ENTERPRISE**
```yaml
price_range: €80,000 - €150,000
regulations_covered: 2-3
scope: "Portfolio assessment (up to 5 systems)"
delivery_time: "Annual subscription + quarterly updates"
target_customers:
  - Healthcare AI (EU AI Act + GDPR + HIPAA)
  - Financial services (EU AI Act + GDPR + NIS2)
  - Critical infrastructure (EU AI Act + NIS2 + ISO 27001)
margin: 78%
annual_volume_year3: 48 customers
revenue_contribution_year3: €5.28M (74%)
```

**TIER 4: CRITICAL + ADVISORY**
```yaml
price_range: €120,000 - €300,000
regulations_covered: 3-5
scope: "Full assessment + expert remediation + white-glove"
delivery_time: "Hybrid tool + consulting"
target_customers:
  - Autonomous vehicles (EU AI Act + ISO 27001 + sector-specific)
  - Medical devices (EU AI Act + GDPR + MDR + HIPAA)
  - Banking Tier 1 (EU AI Act + GDPR + NIS2 + ISO 27001 + PSD2)
margin: 60% (consulting-heavy)
annual_volume_year3: 15 customers
revenue_contribution_year3: €3.15M (44%)
```

**ADD-ONS**
```yaml
additional_regulation: "+€8,000 - €15,000 per regulation"
expedited_delivery: "+30% premium (< 2 weeks)"
continuous_monitoring: "€15,000 - €35,000/year (recurring)"
remediation_advisory: "€180/hour"
training_certification: "€3,500 per practitioner"
api_access: "€15,000 - €40,000/year"
white_label_reseller: "€20,000 - €50,000/year + €5K-10K per seat"
```

---

## Year 1 Revenue Model (Validation Year)

### Assumptions
- **Focus:** Customer validation, pricing discovery, pilot program
- **Mix:** 70% one-time assessments, 30% recurring (subscriptions + monitoring)
- **Channels:** 80% direct sales, 20% partner referrals
- **Methods Implementation:** Assume 4/5 methods completed by Month 6

### Customer Acquisition

| Quarter | New Customers | Regulation Mix | Avg Deal Size | Revenue | Cumulative |
|---------|---------------|----------------|---------------|---------|------------|
| **Q1** | 3 | 2 EU AI Act, 1 GDPR | €28K | €84K | 3 |
| **Q2** | 5 | 3 EU AI Act, 1 HIPAA, 1 SOC2 | €36K | €180K | 8 |
| **Q3** | 6 | 2 EU AI Act, 2 Multi (EU+GDPR), 1 ISO 27001, 1 HIPAA | €38K | €228K | 14 |
| **Q4** | 4 | 1 Multi (3 regs), 2 SOC2, 1 NIS2 | €42K | €168K | 18 |
| **TOTAL Y1** | **18** | **Mixed** | **€36.7K** | **€660K** | **18** |

**Revenue Breakdown:**
- One-time assessments: €462K (70%)
- Recurring (subscriptions): €108K (16%)
- Add-ons (training, expedited): €90K (14%)
- **Total Y1 Booked Revenue:** €660K
- **Y1 Recognized Revenue:** €542K (some Q4 deals deferred to Y2)

### Customer Segmentation Y1

| Segment | Customers | Avg Deal | Revenue | % of Total |
|---------|-----------|----------|---------|------------|
| Fintech (EU AI Act) | 4 | €45K | €180K | 27% |
| HR Tech (EU AI Act + GDPR) | 3 | €55K | €165K | 25% |
| Healthcare (HIPAA or Multi) | 3 | €62K | €186K | 28% |
| SaaS (SOC 2) | 4 | €28K | €112K | 17% |
| Other (ISO, NIS2) | 4 | €42K | €168K | 25% |
| **TOTAL** | **18** | **€36.7K** | **€660K** | **100%** |

---

## Year 2 Revenue Model (Traction Year)

### Assumptions
- **Focus:** Scale validated model, partner channel ramp, product expansion
- **Mix:** 50% one-time, 40% recurring, 10% consulting/add-ons
- **Channels:** 60% direct, 40% partners
- **Methods:** All 5 methods operational, full automation (60-80% time savings)
- **Expansion Revenue:** 25% of Y1 customers upgrade or renew

### Customer Acquisition

| Quarter | New Customers | Regulation Mix | Avg Deal Size | Revenue | Cumulative |
|---------|---------------|----------------|---------------|---------|------------|
| **Q1** | 12 | 5 EU AI Act, 3 GDPR, 2 Multi, 1 HIPAA, 1 SOC2 | €42K | €504K | 30 |
| **Q2** | 15 | 6 EU AI Act, 4 Multi, 2 HIPAA, 2 SOC2, 1 ISO | €48K | €720K | 45 |
| **Q3** | 18 | 7 Multi, 5 EU AI Act, 3 HIPAA, 2 SOC2, 1 NIS2 | €52K | €936K | 63 |
| **Q4** | 15 | 6 Multi, 4 EU AI Act, 3 ISO, 2 SOC2 | €54K | €810K | 78 |
| **TOTAL Y2 New** | **60** | **Mixed** | **€49K** | **€2,970K** | **78** |

**Expansion Revenue (Y1 Customers):**
- Renewals: 13 customers (72% retention) × €18K avg = €234K
- Upgrades: 5 customers add regulations × €12K avg = €60K
- **Total Expansion:** €294K

**Add-On Revenue:**
- Continuous monitoring: 8 customers × €25K = €200K
- Training: 12 practitioners × €3.5K = €42K
- Expedited delivery: 6 customers × €12K premium = €72K
- **Total Add-Ons:** €314K

**Total Y2 Revenue:** €2,970K + €294K + €314K = **€3,578K** (€2.84M recognized after deferrals)

### Customer Segmentation Y2

| Segment | Customers (Total) | Avg Deal | Revenue | % of Total |
|---------|-------------------|----------|---------|------------|
| Multi-Regulation (2-3 regs) | 22 | €95K | €2,090K | 58% |
| EU AI Act (single) | 18 | €48K | €864K | 24% |
| HIPAA (USA healthcare) | 8 | €58K | €464K | 13% |
| SOC 2 (SaaS) | 12 | €32K | €384K | 11% |
| ISO 27001 / NIS2 | 8 | €52K | €416K | 12% |
| Renewals & Expansion | 13 | €22K avg | €294K | 8% |
| **TOTAL** | **81** (68 net) | **€44.2K** | **€3,578K** | **100%** |

---

## Year 3 Revenue Model (Scale Year)

### Assumptions
- **Focus:** Market leadership, geographic expansion, ecosystem partnerships
- **Mix:** 30% one-time, 60% recurring, 10% consulting/add-ons
- **Channels:** 40% direct, 60% partners
- **Methods:** v2.0 features (continuous monitoring, predictive scoring, integrations)
- **Expansion Revenue:** 35% of Y1+Y2 customers renew/expand
- **International:** UK, DACH, Nordics expansion (+30% TAM)

### Customer Acquisition

| Quarter | New Customers | Regulation Mix | Avg Deal Size | Revenue | Cumulative |
|---------|---------------|----------------|---------------|---------|------------|
| **Q1** | 18 | 8 Multi, 5 EU AI Act, 3 HIPAA, 2 ISO | €58K | €1,044K | 96 |
| **Q2** | 22 | 10 Multi, 6 EU AI Act, 4 SOC2, 2 HIPAA | €62K | €1,364K | 118 |
| **Q3** | 25 | 12 Multi, 7 EU AI Act, 4 HIPAA, 2 NIS2 | €64K | €1,600K | 143 |
| **Q4** | 23 | 11 Multi, 6 EU AI Act, 4 ISO, 2 SOC2 | €66K | €1,518K | 166 |
| **TOTAL Y3 New** | **88** | **Mixed** | **€62.5K** | **€5,526K** | **166** |

**Expansion Revenue (Y1+Y2 Customers):**
- Renewals: 48 customers (60% retention) × €28K avg = €1,344K
- Upgrades: 18 customers add regs/monitoring × €22K = €396K
- **Total Expansion:** €1,740K

**Add-On Revenue:**
- Continuous monitoring: 35 customers × €28K = €980K
- Training/certification: 45 practitioners × €3.5K = €158K
- API access: 8 customers × €25K = €200K
- White-label (2 partners): 2 × €35K = €70K
- Expedited delivery: 12 customers × €15K = €180K
- **Total Add-Ons:** €1,588K

**Total Y3 Revenue:** €5,526K + €1,740K + €1,588K = **€8,854K** (€7.12M recognized after deferrals)

### Customer Segmentation Y3

| Segment | Customers (Total) | Avg Deal | Revenue | % of Total |
|---------|-------------------|----------|---------|------------|
| Multi-Regulation (2-5 regs) | 65 | €115K | €7,475K | 84% |
| EU AI Act (single) | 35 | €52K | €1,820K | 21% |
| HIPAA (USA) | 18 | €68K | €1,224K | 14% |
| SOC 2 (SaaS) | 20 | €38K | €760K | 9% |
| ISO 27001 / NIS2 | 18 | €58K | €1,044K | 12% |
| Renewals & Expansion | 48 | €36K avg | €1,740K | 20% |
| **TOTAL** | **204** (156 net) | **€43.4K avg** | **€8,854K** | **100%** |

**Note:** Customers can span multiple segments (e.g., Multi-Regulation customer counted in "Multi" + constituent regulations)

---

## 3-Year P&L Statement

### Revenue

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **NEW CUSTOMER REVENUE** |
| Tier 1 (Essentials) | €168K | €420K | €630K |
| Tier 2 (Professional) | €294K | €1,176K | €2,900K |
| Tier 3 (Multi-Regulation) | - | €1,080K | €5,280K |
| Tier 4 (Critical + Advisory) | - | €294K | €3,150K |
| **Subtotal New Customers** | **€462K** | **€2,970K** | **€11,960K** |
| **EXPANSION REVENUE** |
| Renewals | - | €234K | €1,344K |
| Upsells (add regulations) | - | €60K | €396K |
| **Subtotal Expansion** | **-** | **€294K** | **€1,740K** |
| **ADD-ON REVENUE** |
| Continuous Monitoring | €72K | €200K | €980K |
| Training & Certification | €18K | €42K | €158K |
| Expedited Delivery | - | €72K | €180K |
| API Access | - | - | €200K |
| White-Label | - | - | €70K |
| **Subtotal Add-Ons** | **€90K** | **€314K** | **€1,588K** |
| **TOTAL REVENUE (Booked)** | **€552K** | **€3,578K** | **€15,288K** |
| Revenue Recognition Adjustment | (€10K) | (€734K) | (€8,168K) |
| **TOTAL REVENUE (Recognized)** | **€542K** | **€2,844K** | **€7,120K** |

### Cost of Goods Sold (COGS)

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **DIRECT LABOR** |
| Delivery Engineers (2 FTE Y1, 4 Y2, 8 Y3) | €120K | €280K | €560K |
| Compliance Experts (1 FTE Y1, 2 Y2, 4 Y3) | €70K | €160K | €320K |
| **Subtotal Direct Labor** | **€190K** | **€440K** | **€880K** |
| **INFRASTRUCTURE** |
| Cloud Compute (NLP, processing) | €24K | €60K | €120K |
| Storage (evidence packages) | €12K | €30K | €60K |
| APIs & Third-Party (OpenAI, etc.) | €18K | €48K | €80K |
| **Subtotal Infrastructure** | **€54K** | **€138K** | **€260K** |
| **OTHER COGS** |
| Method Licensing (spaCy, Plotly) | €3K | €8K | €15K |
| Expert Review (external, per-engagement) | €16K | €42K | €68K |
| **Subtotal Other** | **€19K** | **€50K** | **€83K** |
| **TOTAL COGS** | **€263K** | **€628K** | **€1,223K** |
| **GROSS PROFIT** | **€379K** | **€2,216K** | **€5,897K** |
| **GROSS MARGIN** | **70%** | **78%** | **83%** |

**Note:** Gross margin improves with automation (methods) and scale.

### Operating Expenses (OpEx)

#### Sales & Marketing

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **PERSONNEL** |
| Sales AEs (0 → 2 → 4 FTE) | - | €180K | €360K |
| SDRs (0 → 1 → 2 FTE) | - | €60K | €120K |
| Marketing Manager (0.5 → 1 → 1 FTE) | €35K | €80K | €90K |
| **Subtotal Personnel** | **€35K** | **€320K** | **€570K** |
| **PROGRAMS** |
| Demand Gen (ads, content) | €30K | €80K | €150K |
| Events & Conferences | €20K | €60K | €120K |
| Partner Enablement | €15K | €40K | €80K |
| Marketing Tools (HubSpot, etc.) | €12K | €24K | €36K |
| **Subtotal Programs** | **€77K** | **€204K** | **€386K** |
| **TOTAL S&M** | **€112K** | **€524K** | **€956K** |
| **% of Revenue** | **21%** | **18%** | **13%** |

#### Research & Development

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **PERSONNEL** |
| Senior Engineers (2 → 3 → 5 FTE) | €180K | €300K | €500K |
| ML/NLP Engineers (1 → 2 → 3 FTE) | €90K | €200K | €300K |
| Product Manager (0.5 → 1 → 1 FTE) | €40K | €90K | €100K |
| QA/Testing (0.5 → 1 → 2 FTE) | €30K | €70K | €140K |
| **Subtotal Personnel** | **€340K** | **€660K** | **€1,040K** |
| **PROGRAMS** |
| Cloud Development (GPU, compute) | €36K | €60K | €90K |
| Tools & Licenses | €12K | €20K | €30K |
| Method Development (one-time Y1) | €80K | - | - |
| **Subtotal Programs** | **€128K** | **€80K** | **€120K** |
| **TOTAL R&D** | **€468K** | **€740K** | **€1,160K** |
| **% of Revenue** | **86%** | **26%** | **16%** |

**Note:** Y1 R&D includes €80K methods implementation (4/5 methods). High % of revenue normal for SaaS early stage.

#### General & Administrative

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **PERSONNEL** |
| CEO/Founders (2 × 50% salary) | €100K | €120K | €150K |
| CFO/Finance (0.5 → 1 FTE) | €40K | €90K | €100K |
| Office Manager/HR (0.5 → 1 FTE) | €30K | €60K | €70K |
| **Subtotal Personnel** | **€170K** | **€270K** | **€320K** |
| **PROGRAMS** |
| Office & Facilities | €24K | €48K | €72K |
| Legal & Compliance | €30K | €50K | €70K |
| Accounting & Tax | €18K | €30K | €42K |
| Insurance | €12K | €24K | €36K |
| Software (Slack, GSuite, etc.) | €8K | €16K | €24K |
| Recruiting | €15K | €40K | €80K |
| **Subtotal Programs** | **€107K** | **€208K** | **€324K** |
| **TOTAL G&A** | **€277K** | **€478K** | **€644K** |
| **% of Revenue** | **51%** | **17%** | **9%** |

### EBITDA Summary

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **Revenue** | €542K | €2,844K | €7,120K |
| **COGS** | (€263K) | (€628K) | (€1,223K) |
| **Gross Profit** | **€379K** | **€2,216K** | **€5,897K** |
| **Gross Margin %** | **70%** | **78%** | **83%** |
| **Operating Expenses** |
| Sales & Marketing | (€112K) | (€524K) | (€956K) |
| Research & Development | (€468K) | (€740K) | (€1,160K) |
| General & Administrative | (€277K) | (€478K) | (€644K) |
| **Total OpEx** | **(€857K)** | **(€1,742K)** | **(€2,760K)** |
| **EBITDA** | **-€478K** | **€474K** | **€3,137K** |
| **EBITDA Margin %** | **-88%** | **17%** | **44%** |

**Adjustments (Non-Cash):**
- Depreciation & Amortization: €30K/year (minimal, SaaS model)
- Stock-Based Compensation: €90K Y1, €140K Y2, €200K Y3 (10-15% of personnel costs)

### Net Income (After D&A and SBC)

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **EBITDA** | -€478K | €474K | €3,137K |
| Depreciation & Amortization | (€30K) | (€30K) | (€30K) |
| Stock-Based Compensation | (€90K) | (€140K) | (€200K) |
| **EBIT** | **-€598K** | **€304K** | **€2,907K** |
| Interest Income/(Expense) | €5K | €10K | €20K |
| **Pre-Tax Income** | **-€593K** | **€314K** | **€2,927K** |
| Income Tax (25% effective) | - | (€79K) | (€732K) |
| **NET INCOME** | **-€593K** | **€235K** | **€2,195K** |
| **Net Margin %** | **-109%** | **8%** | **31%** |

---

## Cash Flow Statement (3-Year Summary)

| Line Item | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| **OPERATING ACTIVITIES** |
| Net Income | -€593K | €235K | €2,195K |
| Add: Depreciation & Amortization | €30K | €30K | €30K |
| Add: Stock-Based Compensation | €90K | €140K | €200K |
| Changes in Working Capital | (€50K) | (€120K) | (€200K) |
| **Net Cash from Operations** | **-€523K** | **€285K** | **€2,225K** |
| **INVESTING ACTIVITIES** |
| CapEx (servers, equipment) | (€40K) | (€60K) | (€80K) |
| Method Development (capitalized) | (€80K) | - | - |
| **Net Cash from Investing** | **-€120K** | **-€60K** | **-€80K** |
| **FINANCING ACTIVITIES** |
| Equity Raised | €800K | - | - |
| Debt Financing | - | - | - |
| **Net Cash from Financing** | **€800K** | **-** | **-** |
| **NET CHANGE IN CASH** | **€157K** | **€225K** | **€2,145K** |
| **Beginning Cash** | €100K | €257K | €482K |
| **ENDING CASH** | **€257K** | **€482K** | **€2,627K** |

**Funding Requirement:**
- **Year 1:** Raise €800K (seed round) to cover:
  - Methods implementation: €400K
  - Year 1 burn: €523K
  - Buffer: €100K working capital
- **Year 2+:** Self-funded from operations (cash flow positive)

---

## Unit Economics

### Customer Acquisition Cost (CAC)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Sales & Marketing Expense | €112K | €524K | €956K |
| New Customers | 18 | 60 | 88 |
| **CAC** | **€6,222** | **€8,733** | **€10,864** |

**CAC Trend:** Increases with scale (hiring sales team), but stable as % of revenue (21% → 18% → 13%)

### Customer Lifetime Value (LTV)

**Assumptions:**
- Avg Customer Lifespan: 3.2 years (churn rate: 31% annual)
- Avg Annual Contract Value: €36.7K Y1, €44.2K Y2, €43.4K Y3 (blended)
- Gross Margin: 70% Y1, 78% Y2, 83% Y3

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Annual Contract Value | €36.7K | €44.2K | €43.4K |
| Customer Lifespan (years) | 3.2 | 3.2 | 3.2 |
| Gross Lifetime Revenue | €117K | €141K | €139K |
| Gross Margin | 70% | 78% | 83% |
| **LTV** | **€82K** | **€110K** | **€115K** |

### LTV/CAC Ratio

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| LTV | €82K | €110K | €115K |
| CAC | €6.2K | €8.7K | €10.9K |
| **LTV/CAC** | **13.2x** | **12.6x** | **10.6x** |

**Benchmark:** SaaS healthy = 3x+, great = 10x+. Deep-compliance exceeds "great" threshold.

**Note:** LTV/CAC decreases slightly in Y3 due to higher CAC (sales team ramp) but remains excellent.

### Payback Period

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| CAC | €6.2K | €8.7K | €10.9K |
| Gross Margin | 70% | 78% | 83% |
| Monthly Gross Profit per Customer | €2.1K | €2.9K | €3.0K |
| **Payback Period (months)** | **3.0** | **3.0** | **3.6** |

**Benchmark:** SaaS healthy = < 12 months, great = < 6 months. Deep-compliance: **3-4 months** (excellent).

### Magic Number (Sales Efficiency)

Formula: `(ARR added in quarter) / (S&M spend in prior quarter)`

| Quarter | S&M Spend (Prior Q) | ARR Added | Magic Number |
|---------|---------------------|-----------|--------------|
| Q2 Y1 | €25K | €45K | 1.8 |
| Q4 Y1 | €32K | €63K | 2.0 |
| Q2 Y2 | €120K | €288K | 2.4 |
| Q4 Y2 | €145K | €378K | 2.6 |
| Q2 Y3 | €230K | €545K | 2.4 |
| Q4 Y3 | €260K | €600K | 2.3 |

**Benchmark:** > 0.75 = efficient, > 1.0 = very efficient. Deep-compliance: **2.0-2.6** (exceptional).

---

## Key Performance Indicators (KPIs)

### Growth Metrics

| KPI | Year 1 | Year 2 | Year 3 | CAGR |
|-----|--------|--------|--------|------|
| **Revenue Growth** | - | 425% | 150% | **~260%** |
| **Customer Growth** | 18 | 68 (278%) | 156 (129%) | **~190%** |
| **ARR Growth** | €108K | €1,138K (954%) | €4,272K (275%) | **~580%** |
| **MRR (End of Year)** | €9K | €95K | €356K | **~580%** |

### Efficiency Metrics

| KPI | Year 1 | Year 2 | Year 3 | Benchmark |
|-----|--------|--------|--------|-----------|
| **CAC Payback (months)** | 3.0 | 3.0 | 3.6 | < 12 ✅ |
| **LTV/CAC** | 13.2x | 12.6x | 10.6x | > 3x ✅ |
| **Magic Number** | 2.0 | 2.5 | 2.3 | > 0.75 ✅ |
| **Gross Margin** | 70% | 78% | 83% | > 70% ✅ |
| **Net Revenue Retention** | - | 145% | 152% | > 100% ✅ |

**Net Revenue Retention (NRR):** Measures expansion revenue from existing customers.
- Year 2: 13 renewals (€234K) + 5 upsells (€60K) = €294K vs €108K prior year ARR = **272% NRR** (adjusted for small base)
- Year 3: 48 renewals (€1,344K) + 18 upsells (€396K) = €1,740K vs €1,138K prior year ARR = **153% NRR**

### Profitability Metrics

| KPI | Year 1 | Year 2 | Year 3 | Target |
|-----|--------|--------|--------|--------|
| **EBITDA Margin** | -88% | 17% | 44% | > 20% by Y3 ✅ |
| **Net Margin** | -109% | 8% | 31% | > 15% by Y3 ✅ |
| **Revenue per Employee** | €48K | €127K | €210K | > €150K by Y3 ✅ |
| **Gross Profit per Employee** | €34K | €99K | €174K | > €100K by Y3 ✅ |

**Employee Count:**
- Year 1: 11.3 FTE (blended average)
- Year 2: 22.4 FTE
- Year 3: 33.9 FTE

### Customer Health Metrics

| KPI | Year 1 | Year 2 | Year 3 | Benchmark |
|-----|--------|--------|--------|-----------|
| **Churn Rate** | - | 28% | 31% | < 20% (target) |
| **Retention Rate** | - | 72% | 69% | > 80% (target) |
| **Expansion Rate** | - | 38% | 41% | > 20% ✅ |
| **Avg Contract Value** | €36.7K | €44.2K | €43.4K | Growing ✅ |
| **% Multi-Regulation** | 22% | 38% | 58% | Growing ✅ |

**Note:** Churn higher than ideal (target < 20%) but offset by strong expansion (41%). Focus on retention improvements in Y2-3.

---

## Sensitivity Analysis

### Revenue Sensitivity

**What if revenue is 20% lower than projected?**

| Scenario | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Base Case Revenue** | €542K | €2,844K | €7,120K |
| **-20% Revenue** | €434K | €2,275K | €5,696K |
| **EBITDA (Base)** | -€478K | €474K | €3,137K |
| **EBITDA (-20% Rev)** | -€586K | €45K | €1,851K |
| **Impact** | -€108K | -€429K | -€1,286K |

**Result:** Still achieves profitability in Y2, but at lower margin (2% vs 17%).

**What if revenue is 20% higher than projected?**

| Scenario | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Base Case Revenue** | €542K | €2,844K | €7,120K |
| **+20% Revenue** | €650K | €3,413K | €8,544K |
| **EBITDA (Base)** | -€478K | €474K | €3,137K |
| **EBITDA (+20% Rev)** | -€370K | €903K | €4,423K |
| **Impact** | +€108K | +€429K | +€1,286K |

**Result:** Accelerates profitability, Y3 EBITDA margin 52% (vs 44% base).

### Cost Sensitivity

**What if COGS is 10% higher?**

| Scenario | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Base COGS** | €263K | €628K | €1,223K |
| **+10% COGS** | €289K | €691K | €1,345K |
| **Gross Margin (Base)** | 70% | 78% | 83% |
| **Gross Margin (+10% COGS)** | 67% | 76% | 81% |
| **EBITDA Impact** | -€26K | -€63K | -€122K |

**Result:** Margins still healthy (67-81%), but EBITDA reduced. Emphasizes importance of automation.

**What if S&M is 30% higher (aggressive growth)?**

| Scenario | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Base S&M** | €112K | €524K | €956K |
| **+30% S&M** | €146K | €681K | €1,243K |
| **EBITDA (Base)** | -€478K | €474K | €3,137K |
| **EBITDA (+30% S&M)** | -€512K | €317K | €2,850K |
| **Impact** | -€34K | -€157K | -€287K |

**Result:** Profitability delayed but customer acquisition accelerated. Trade-off: growth vs. profitability.

---

## Break-Even Analysis

### Monthly Break-Even

**Fixed Costs (Monthly Average Y2):**
- Salaries: €124K/month
- Infrastructure: €19K/month
- Overhead: €24K/month
- **Total Fixed:** €167K/month

**Contribution Margin:**
- Avg Deal Size: €44.2K
- Gross Margin: 78%
- **Contribution per Deal:** €34.5K

**Break-Even Customers per Month:** €167K / €34.5K = **4.8 customers/month** (5-6 deals/month)

**Y2 Actuals:** 60 customers / 12 months = **5 customers/month** ✅ (break-even achieved)

### Annual Break-Even

**Year 2 Break-Even Point:**
- Fixed costs: €2,006K (OpEx)
- Gross margin: 78%
- **Break-even revenue:** €2,006K / 0.78 = **€2,572K**
- **Y2 Actual Revenue:** €2,844K ✅ (€272K above break-even)

**Year 3 Break-Even Point:**
- Fixed costs: €2,760K (OpEx)
- Gross margin: 83%
- **Break-even revenue:** €2,760K / 0.83 = **€3,325K**
- **Y3 Actual Revenue:** €7,120K ✅ (€3,795K above break-even)

**Conclusion:** Break-even achieved in **Month 18** (Q2 Year 2), cash flow positive from Month 20 onward.

---

## Scenario Planning

### Best Case Scenario (+30% Revenue, -10% Costs)

**Assumptions:**
- Faster customer acquisition (partner channel overperforms)
- Higher average deal size (more multi-regulation deals)
- Better cost efficiency (automation at 80% vs 60%)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue | €705K | €3,697K | €9,256K |
| COGS | €237K | €565K | €1,101K |
| OpEx | €771K | €1,568K | €2,484K |
| **EBITDA** | **-€303K** | **€1,564K** | **€5,671K** |
| **EBITDA Margin** | **-43%** | **42%** | **61%** |
| **Net Income** | **-€423K** | **€1,267K** | **€4,129K** |

**Outcome:** Hyper-growth trajectory, Series A fundraise at €20M-30M valuation (Year 2).

### Worst Case Scenario (-30% Revenue, +10% Costs)

**Assumptions:**
- Slower adoption (regulatory deadline delays)
- Lower pricing (competitive pressure)
- Higher costs (talent scarcity, churn)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue | €379K | €1,991K | €4,984K |
| COGS | €289K | €691K | €1,345K |
| OpEx | €943K | €1,916K | €3,036K |
| **EBITDA** | **-€853K** | **-€616K** | **€603K** |
| **EBITDA Margin** | **-225%** | **-31%** | **12%** |
| **Net Income** | **-€973K** | **-€786K** | **€200K** |

**Outcome:** Requires additional funding (€1M-1.5M Series A in Year 2), profitability delayed to Year 3.

**Risk Mitigation:**
- Reduce burn: Cut S&M by 30% (slower growth but extends runway)
- Pivot pricing: Increase avg deal size (target enterprise)
- Focus retention: Improve churn from 31% → 20% (boosts LTV)

### Most Likely Scenario (Base Case)

**See main P&L above.** This is the **conservative, achievable** projection assuming:
- Methods implementation on schedule (6 months)
- Customer validation succeeds (50%+ pilot conversion)
- Partner channel delivers (40% of revenue by Y3)
- Market conditions stable (no major regulatory delays)

**Probability:** 60-70% (base case is realistic)

---

## Funding Strategy

### Seed Round (Year 0-1) — €800K

**Use of Funds:**
- Methods implementation: €400K (50%)
- Year 1 operations: €300K (38%)
- Working capital buffer: €100K (12%)

**Investor Profile:**
- Early-stage VCs focused on B2B SaaS, RegTech, AI
- Angels with domain expertise (compliance, enterprise software)
- Target: 10-15% dilution

**Valuation:** €4M-6M pre-money (€4.8M-6.8M post-money)

**Milestones to Unlock:**
- Complete 4/5 methods (Month 6)
- Sign 10+ paying customers (Month 9)
- Achieve €400K+ ARR (Month 12)
- Validate €35K-65K pricing (Month 12)

### Series A (Year 2, Optional) — €2M-3M

**Use of Funds:**
- Sales team expansion: €800K-1.2M (40%)
- Product expansion (v2.0 features): €600K-900K (30%)
- Geographic expansion: €400K-600K (20%)
- Working capital: €200K-300K (10%)

**Conditions:**
- **Only if pursuing aggressive growth** (Best Case scenario)
- Base Case: Self-funded from operations (no Series A needed)
- **Trigger:** If opportunity to capture 3-5% market share in 18 months

**Valuation:** €15M-25M pre-money (ARR multiple: 8-12x on €2M ARR)

**Investor Profile:**
- Growth VCs (Series A specialists)
- Strategic investors (compliance platforms, consulting firms)
- Target: 12-18% dilution

### Exit Strategy (Year 4-5)

**Exit Options:**

**Option 1: Strategic Acquisition** (Most Likely, 60% probability)
- **Acquirers:** OneTrust, ServiceNow, SAP, Salesforce, Microsoft (Power Platform)
- **Rationale:** Deep-compliance fills compliance workflow gap in their platforms
- **Timing:** Year 4-5 (€15M-30M ARR)
- **Valuation:** €100M-250M (5-8x ARR multiple)
- **Founders/Investors Return:** 12-30x on seed investment

**Option 2: Private Equity Buyout** (30% probability)
- **Acquirers:** Insight Partners, Thoma Bravo, Vista Equity
- **Rationale:** Profitable SaaS with strong unit economics
- **Timing:** Year 5 (€30M-50M ARR, EBITDA positive)
- **Valuation:** €120M-200M (4-5x ARR, 12-15x EBITDA)
- **Structure:** Management retains 20-30%, PE buys rest

**Option 3: IPO** (10% probability, ambitious)
- **Conditions:** €50M+ ARR, Rule of 40 > 50%, category leader
- **Timing:** Year 6-7
- **Valuation:** €300M-500M
- **Feasibility:** Requires Series B-C (€10M-30M raised), aggressive expansion

**Most Realistic:** Strategic acquisition Year 4-5 at €150M-200M (6-7x ARR).

---

## Risk Factors & Mitigation

### Market Risks

**RISK M1: Regulatory Deadline Delays**
- **Probability:** MEDIUM (40%)
- **Impact:** HIGH (reduces urgency, slows sales)
- **Mitigation:**
  - Diversify across regulations (not just EU AI Act)
  - Position as "future-proof compliance" (ongoing need)
  - Pivot to continuous monitoring (recurring revenue)

**RISK M2: Big 4 Enters Market**
- **Probability:** HIGH (70%)
- **Impact:** MEDIUM (pricing pressure, brand competition)
- **Mitigation:**
  - Speed to market (18-month head start)
  - Mid-market focus (Big 4 targets enterprise only)
  - Superior automation (60-80% vs their 20-30%)
  - Data moat (benchmark database)

**RISK M3: Market Smaller Than Projected**
- **Probability:** LOW (20%)
- **Impact:** HIGH (limits growth)
- **Mitigation:**
  - Conservative TAM estimates (already using lower bound)
  - International expansion (UK, DACH) increases TAM 50%
  - Adjacent markets (ISO 27001, SOC 2) diversify

### Execution Risks

**RISK E1: Methods Implementation Delays**
- **Probability:** MEDIUM (40%)
- **Impact:** CRITICAL (value prop unsupportable)
- **Mitigation:**
  - Pre-recruit team (Month -1)
  - Parallel development (methods #332-#329)
  - Fallback: Reframe as "40% automation + methodology" (lower price)
  - Contingency budget: €50K-100K

**RISK E2: Customer Validation Fails**
- **Probability:** LOW (15%)
- **Impact:** CRITICAL (pivot required)
- **Mitigation:**
  - Pilot program (10-15 customers at €10K-20K)
  - 50%+ conversion threshold (Month 9 gate)
  - Multiple pricing tests (€25K, €35K, €50K, €65K)
  - If fail: Pivot to consulting-led model

**RISK E3: Talent Acquisition Delays**
- **Probability:** MEDIUM (40%)
- **Impact:** HIGH (timeline slip)
- **Mitigation:**
  - Start recruiting Month -1 (before funding)
  - Remote-first (EU + UK + Eastern Europe talent pool)
  - Competitive comp (top 25% market rate)
  - Contractors for short-term gaps

### Financial Risks

**RISK F1: Higher Churn Than Projected**
- **Probability:** MEDIUM (50%)
- **Impact:** MEDIUM (LTV reduced)
- **Projection:** 31% churn (base case)
- **Downside:** 45% churn → LTV drops 30% (€115K → €80K)
- **Mitigation:**
  - Customer success program (dedicated CSM Year 2+)
  - Continuous monitoring (stickier product)
  - Multi-year contracts (lock-in)

**RISK F2: CAC Increases**
- **Probability:** MEDIUM (50%)
- **Impact:** MEDIUM (margins compressed)
- **Projection:** €10.9K CAC (Year 3)
- **Downside:** €16K CAC → LTV/CAC drops to 7x (still healthy)
- **Mitigation:**
  - Partner channel (60% of revenue, €5K-8K CAC)
  - Product-led growth (self-serve Tier 1)
  - Referral program (10-15% of new customers)

**RISK F3: Pricing Pressure**
- **Probability:** MEDIUM (40%)
- **Impact:** MEDIUM (revenue growth slows)
- **Mitigation:**
  - Value-based pricing (ROI = €200K+ fines avoided)
  - Differentiation (60-80% time savings proven)
  - Premium positioning (not competing on price)

---

## Appendices

### Appendix A: Detailed Revenue Build

[See separate spreadsheet: `deep-compliance-revenue-model.xlsx`]

**Includes:**
- Monthly customer acquisition by tier
- Cohort analysis (retention, expansion)
- ARR waterfall
- Bookings vs. revenue recognition

### Appendix B: Cost Assumptions

**Salary Ranges (EU Market, 2026):**
- Senior Engineer: €90K-110K
- ML/NLP Engineer: €95K-120K
- Sales AE: €80K-100K base + €40K-60K commission
- SDR: €50K-65K base + €10K-15K commission
- Compliance Expert: €70K-90K
- Delivery Engineer: €65K-85K
- Product Manager: €85K-105K

**Cloud Costs:**
- NLP processing: €1.5K-2.5K per 1,000 assessments
- Storage: €0.5K-1K per 1,000 evidence packages
- APIs (OpenAI GPT-4): €0.8K-1.2K per 1,000 gap descriptions

### Appendix C: Customer Cohort Analysis

**Year 1 Cohort (18 customers):**
- Month 12 retention: 83% (15 customers)
- Month 24 retention: 72% (13 customers)
- Month 36 retention: 61% (11 customers)
- Expansion rate: 38% (5 customers add regulations/monitoring)
- **Cohort LTV:** €95K

**Year 2 Cohort (60 customers):**
- Month 12 retention: 78% (47 customers)
- Month 24 retention: 68% (41 customers)
- Expansion rate: 42% (18 customers upgrade)
- **Cohort LTV:** €112K

**Year 3 Cohort (88 customers):**
- Projected Month 12 retention: 75%
- Expansion rate: 45%
- **Cohort LTV:** €118K

### Appendix D: Competitive Pricing Benchmarks

| Competitor | Type | Price Range | Delivery Time | Notes |
|------------|------|-------------|---------------|-------|
| **Big 4 (Deloitte, PwC)** | Consulting | €150K-400K | 2-6 months | Manual, high-touch, enterprise |
| **OneTrust** | Platform | €50K-200K/year | Self-service | Continuous monitoring, no one-time |
| **DataRobot Compliance** | Tool | €40K-120K/year | Self-service | Model monitoring only, not full compliance |
| **TrustArc** | Platform | €35K-100K/year | Hybrid | GDPR focus, limited AI Act |
| **Deep-Compliance** | Process + Tool | €35K-150K | 2-8 hours | ⭐ Sweet spot: automation + expertise |

### Appendix E: Regulation Coverage Matrix

| Regulation | Requirements Count | Assessment Time | Avg Deal Size | TAM |
|------------|-------------------|-----------------|---------------|-----|
| EU AI Act | 100-120 | 4-8 hours | €50K | €750M-3.75B |
| GDPR | 20-35 | 2-4 hours | €18K | €450M-1.8B |
| HIPAA | 18-25 | 3-6 hours | €50K | €600M-2.4B |
| SOC 2 | 64-80 | 4-8 hours | €38K | €380M-1.5B |
| ISO 27001 | 114 controls | 6-10 hours | €52K | €280M-1.1B |
| NIS2 | 40-60 | 4-7 hours | €44K | €220M-880M |
| Multi (3 regs) | 180-250 | 8-16 hours | €115K | €1.2B-4.8B |

---

## Summary & Recommendations

### Financial Viability: ✅ STRONG

**Key Strengths:**
1. **Exceptional Unit Economics:** LTV/CAC 10-13x (benchmark: 3x+)
2. **Fast Payback:** 3-4 months (benchmark: 12 months)
3. **High Margins:** 83% gross margin by Year 3 (SaaS benchmark: 70%+)
4. **Path to Profitability:** Break-even Month 18, no additional funding required post-seed
5. **Strong Growth:** 260% revenue CAGR, 190% customer CAGR
6. **Scalable Model:** Revenue per employee €210K by Year 3 (benchmark: €150K+)

**Areas of Concern:**
1. **Churn Rate:** 31% (target: < 20%) — Needs improvement via CS program
2. **Y1 Burn:** €478K EBITDA loss (acceptable for seed stage, but requires €800K raise)
3. **Revenue Concentration:** 58% from multi-regulation (diversification risk if market smaller)
4. **Execution Risk:** Methods implementation critical path (6-month timeline)

### Recommended Action: PROCEED

**Immediate Steps (Month 0-6):**
1. ✅ Raise €800K seed round (targeting RegTech/B2B SaaS investors)
2. ✅ Recruit core team (2 engineers, 1 compliance expert, 1 delivery lead)
3. ✅ Complete 4/5 methods implementation (€400K investment)
4. ✅ Launch pilot program (10-15 customers at €10K-20K)

**Validation Gates (Month 6-12):**
1. ✅ Methods operational (automation 60-80%)
2. ✅ 50%+ pilot conversion to paid
3. ✅ €400K+ ARR (18+ customers)
4. ✅ Pricing validated (€35K-65K avg)

**IF VALIDATION SUCCEEDS (Month 12):**
- Execute Year 2-3 plan (self-funded from operations)
- Target: €7M revenue, 156 customers, 44% EBITDA margin by Year 3
- Exit: Strategic acquisition €150M-200M (Year 4-5)

**IF VALIDATION FAILS:**
- Pivot to consulting-led model (tool-assisted expert delivery)
- OR sell IP/methodology to incumbent (OneTrust, ServiceNow)
- Founders/investors recover 50-80% of investment

**Expected Outcome (Base Case):** €150M-200M exit in Year 4-5, representing **18-25x return** on €800K seed investment.

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-14 | Deep-Process Financial Team | Initial 3-year P&L model |

**Approval Signatures:**

- [ ] CFO: ___________________________ Date: ___________
- [ ] CEO: ___________________________ Date: ___________
- [ ] Board/Investors: ________________ Date: ___________

**END OF FINANCIAL MODEL**
