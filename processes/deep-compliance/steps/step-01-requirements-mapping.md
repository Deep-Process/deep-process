# STEP 1: REQUIREMENTS MAPPING — EU AI Act to System Capabilities

**Phase:** 1 - Requirements Analysis
**Purpose:** Map EU AI Act articles to system capabilities, identify coverage
**Methods Used:** Method #327 (Regulatory Requirement Mapper) - CRITICAL
**Output:** Complete mapping with coverage status for each requirement

---

## ENFORCED SEQUENCE

```
1. LOAD_REGULATORY_SOURCE → Load EU AI Act requirements
2. EXECUTE_METHOD_327 → Automated requirement-to-capability mapping
3. REVIEW_MAPPING → Validate mapping accuracy
4. CALCULATE_COVERAGE → Compute coverage percentage
5. EVALUATE_GATE_1 → Check if mapping is sufficient to proceed
```

**PRECONDITION:** GATE_0 = OPEN (inventory complete)
**DO NOT proceed to Step 2 until GATE_1 = OPEN**

---

## 1. LOAD_REGULATORY_SOURCE

**Goal:** Load EU AI Act requirements for the system's risk classification

### For HIGH-RISK Systems (Annex III)

**Full compliance requirements from:**
- Article 9: Risk management system
- Article 10: Data and data governance
- Article 11: Technical documentation
- Article 12: Record-keeping
- Article 13: Transparency and provision of information
- Article 14: Human oversight
- Article 15: Accuracy, robustness, cybersecurity
- Article 16: Obligations of providers of high-risk AI systems
- Article 17-29: Additional provider/deployer obligations

**Total requirements:** ~47 atomic requirements

### For GENERAL-PURPOSE AI

**Lighter requirements from:**
- Article 52: Transparency obligations
- Article 53: Obligations for providers

**Total requirements:** ~8 atomic requirements

**Regulatory source format:**
```yaml
regulation: "EU AI Act 2024"
system_classification: "HIGH_RISK"  # from Step 0

requirements:
  - requirement_id: "Art9-1"
    article: "Article 9 - Risk Management System"
    text: "Providers shall establish and maintain a risk management system"
    key_terms: ["risk management", "systematic process", "continuous"]

  - requirement_id: "Art10-1"
    article: "Article 10 - Data and Data Governance"
    text: "Training data shall be subject to appropriate data governance"
    key_terms: ["data governance", "training data", "quality"]

  - requirement_id: "Art10-2"
    article: "Article 10.2"
    text: "Training data shall be relevant, representative, free of errors and complete"
    key_terms: ["data quality", "representative", "bias-free"]

  # ... 44 more requirements
```

**Source location:** `data/eu-ai-act-requirements.yaml`

---

## 2. EXECUTE_METHOD_327

**Goal:** Automated mapping of requirements to system capabilities

### If Method #327 is available (RECOMMENDED):

```python
from methods.implementations.regulatory_requirement_mapper import RegulatoryRequirementMapper

# Initialize mapper
mapper = RegulatoryRequirementMapper(
    regulatory_source="data/eu-ai-act-requirements.yaml"
)

# Prepare system description from Step 0
system_description = {
    "capabilities": inventory_result["capabilities"],
    "documentation": inventory_result["documentation"],
    "code_references": inventory_result["code"],
    "ai_components": inventory_result["ai_components"]
}

# Execute mapping
mapping_result = mapper.map_to_capabilities(system_description)
```

**Method #327 performs:**
1. Parse EU AI Act into atomic requirements
2. Extract system capabilities from inventory
3. Apply semantic similarity + keyword matching
4. Find evidence in documentation/code
5. Classify coverage: COVERED / PARTIAL / GAP

### If Method #327 NOT available (Fallback):

**Manual mapping process:**
```
For each requirement:
1. Read requirement text
2. Check if system has capability
3. Search documentation for evidence
4. Classify: COVERED / PARTIAL / GAP
5. Document reasoning
```

**Warning:** Manual mapping is slow (~2-4 hours) and error-prone

---

## 3. REVIEW_MAPPING

**Goal:** Validate that automated mapping is accurate

### Spot-Check Critical Requirements

**Review these high-risk requirements manually:**

| Requirement | Check |
|-------------|-------|
| Art. 10 - Data Governance | Does system have documented data quality checks? |
| Art. 14 - Human Oversight | Can humans override AI decisions? |
| Art. 15 - Accuracy | Is model accuracy documented and monitored? |
| Art. 13 - Transparency | Are users informed they're interacting with AI? |

**Validation questions:**
```
1. Does COVERED status have strong evidence?
   → Check: documentation exists, code reference valid

2. Are PARTIAL mappings justified?
   → Check: what's missing? Why only partial?

3. Are GAP classifications correct?
   → Check: is capability truly missing or just not documented?
```

### Adjust Mapping if Needed

**If automated mapping is wrong:**
```yaml
# Override in mapping_result
requirements:
  - requirement_id: "Art14-1"
    original_status: "GAP"
    corrected_status: "PARTIAL"
    reason: "Human override exists but not documented in scanned docs"
    evidence_manual: ["Confirmed with product team - override button exists"]
```

---

## 4. CALCULATE_COVERAGE

**Goal:** Compute compliance coverage percentage

### Coverage Formula

```python
# From gates.yaml - compliance_percentage_formula
covered = count(requirements where status == COVERED)
partial = count(requirements where status == PARTIAL)
gaps = count(requirements where status == GAP)
total = covered + partial + gaps

# Partial coverage counts as 50%
coverage_percentage = ((covered + partial * 0.5) / total) * 100
```

### Example Calculation

```yaml
total_requirements: 47
covered: 28 (60%)
partial: 12 (25%)
gaps: 7 (15%)

coverage = ((28 + 12*0.5) / 47) * 100
         = ((28 + 6) / 47) * 100
         = (34 / 47) * 100
         = 72.3%
```

### Coverage Interpretation

| Coverage | Status | Action |
|----------|--------|--------|
| 90-100% | ✅ Excellent | Minor gaps to address |
| 70-89% | ⚠️ Good | Several gaps need remediation |
| 50-69% | 🟠 Moderate | Significant work required |
| <50% | 🔴 Poor | Major compliance gaps - urgent action |

---

## 5. EVALUATE_GATE_1

**Before proceeding to Step 2, verify:**

### Checklist:
- [ ] **G1-01:** All EU AI Act articles processed ✓
- [ ] **G1-02:** Mapping coverage > 90% ✓ (OR fast_track AND coverage > 70%)
- [ ] **G1-03:** Method #327 executed successfully ✓
- [ ] **G1-04:** Mapping result has valid structure ✓

**If ALL checked → GATE_1 = OPEN → Proceed to Step 2**

**If G1-02 fails (low coverage):**
```
Option 1: Re-run Method #327 with refined mapping rules
Option 2: Manual review to find missed capabilities
Option 3: Accept lower coverage if fast_track_mode=on
```

---

## OUTPUT FORMAT

```yaml
requirements_mapping:
  regulation: "EU AI Act 2024"
  system: "CustomerSupport-AI-Chatbot"
  classification: "HIGH_RISK"
  total_requirements: 47

  articles:
    - article: "Art. 9 - Risk Management System"
      requirements:
        - requirement_id: "Art9-1"
          text: "Providers shall establish and maintain a risk management system"
          status: "PARTIAL"
          mapped_to: ["risk_assessment_doc"]
          evidence: ["docs/risk-assessment-2025.pdf"]
          gap_reason: "Risk management exists but not continuously updated"
          severity: HIGH

    - article: "Art. 10 - Data and Data Governance"
      requirements:
        - requirement_id: "Art10-1"
          text: "Training data shall be subject to appropriate data governance"
          status: "COVERED"
          mapped_to: ["data_governance_policy", "data_quality_checks"]
          evidence:
            - "docs/data-governance.md"
            - "code/data_pipeline.py:lines 123-156"
            - "tests/test_data_quality.py"
          confidence: 0.95

        - requirement_id: "Art10-2"
          text: "Training data shall be relevant representative free of errors"
          status: "GAP"
          mapped_to: []
          evidence: []
          gap_reason: "No documented bias analysis or data quality validation"
          severity: CRITICAL
          recommendation: "Implement bias testing using Method #336 (Bias Metric Calculator)"

    - article: "Art. 14 - Human Oversight"
      requirements:
        - requirement_id: "Art14-1"
          text: "High-risk AI systems shall be designed to enable human oversight"
          status: "COVERED"
          mapped_to: ["human_override_button", "escalation_workflow"]
          evidence:
            - "docs/human-oversight.md"
            - "code/escalation_logic.py:lines 45-78"
          confidence: 0.92

    # ... 44 more requirements

  coverage_summary:
    total: 47
    covered: 28 (60%)
    partial: 12 (25%)
    gaps: 7 (15%)
    coverage_percentage: 72.3%

    critical_gaps: 3
    high_gaps: 2
    medium_gaps: 2
    low_gaps: 0

  method_execution:
    method_327_status: "SUCCESS"
    execution_time: "3.2 seconds"
    confidence_avg: 0.87

  gate_1_status: "CLOSED"  # Coverage 72.3% < 90% threshold
  gate_1_recommendation: "Accept with fast-track OR improve mapping to 90%"
```

---

## MAPPING CONFIDENCE LEVELS

**Method #327 assigns confidence scores:**

| Confidence | Meaning | Action |
|------------|---------|--------|
| 0.9-1.0 | Very High | Evidence is strong, mapping certain |
| 0.7-0.89 | High | Evidence exists, mapping likely correct |
| 0.5-0.69 | Medium | Some evidence, manual review recommended |
| 0.3-0.49 | Low | Weak evidence, likely incorrect |
| 0.0-0.29 | Very Low | No evidence, mapping is guess |

**Manual review required for:**
- Any mapping with confidence < 0.7
- All CRITICAL gaps
- All requirements with status = PARTIAL

---

## COMMON MAPPING ISSUES

### Issue 1: False Positives (COVERED when actually GAP)

**Symptom:** Method #327 marks as COVERED but evidence is weak

**Example:**
```yaml
requirement: "Data shall be representative"
status: "COVERED"
evidence: ["docs/data-policy.md mentions 'representative'"]
confidence: 0.45  # Low!
```

**Fix:** Manual review → downgrade to GAP or PARTIAL

### Issue 2: False Negatives (GAP when actually COVERED)

**Symptom:** Capability exists but not documented

**Example:**
```yaml
requirement: "Human oversight mechanism"
status: "GAP"
actual: "Override button exists in UI, just not documented"
```

**Fix:** Add manual evidence → upgrade to COVERED
```yaml
evidence_manual: ["Confirmed with product team - override button at top-right"]
```

### Issue 3: Synonym Mismatch

**Symptom:** Different terminology prevents matching

**Example:**
```yaml
requirement: "bias mitigation"
capability: "fairness testing"  # Same thing, different words
status: "GAP"  # Wrong!
```

**Fix:** Add custom mapping rules to Method #327
```python
custom_rules = {
    "bias mitigation": ["fairness testing", "bias detection", "demographic parity"]
}
```

---

## FAST-TRACK MODE ADJUSTMENTS

**If fast_track_mode = true:**

### Relaxed Threshold
```
Normal: coverage > 90%
Fast-track: coverage > 70%
```

### Faster Execution
```
- Skip manual review of medium confidence mappings
- Accept automated mapping even if confidence < 0.7
- Focus only on CRITICAL requirements
```

### Warning in Report
```markdown
**FAST-TRACK MODE ACTIVE**

Coverage threshold lowered to 70% due to urgent deadline.
Manual review of lower-confidence mappings recommended post-assessment.
```

---

## GATE_1 VIOLATIONS → FIX ACTIONS

**If GATE_1 fails:**

### Violation: G1-01 (Not all articles processed)
**Action:** Re-run Method #327, check for errors in regulatory source

### Violation: G1-02 (Coverage < threshold)
**Actions (pick one):**
1. Manual review to find missed capabilities → increase coverage
2. Refine Method #327 mapping rules → re-run
3. Enable fast-track mode (if justified by urgency)
4. Scope reduction (assess fewer requirements)

### Violation: G1-03 (Method #327 failed)
**Actions:**
- Check: Method #327 installed correctly?
- Check: Regulatory source file format valid?
- Fallback: Manual mapping (slow but works)

### Violation: G1-04 (Invalid structure)
**Action:** Validate output schema, fix Method #327 output format

---

## SUCCESS CRITERIA

**Step 1 is SUCCESSFUL when:**
1. ✅ All requirements mapped
2. ✅ Coverage ≥ 90% (or ≥ 70% in fast-track)
3. ✅ Evidence exists for COVERED requirements
4. ✅ Gaps documented with severity
5. ✅ GATE_1 = OPEN

**Time estimate:**
- With Method #327: 5-10 minutes
- Manual mapping: 2-4 hours (47 requirements)
- Review + adjustments: 15-30 minutes

**Next step:** Step 2 - Gap Analysis

---

**Version:** 1.0.0
**Last Updated:** 2026-02-14
**Dependencies:** Method #327 (CRITICAL - process blocked without it)
