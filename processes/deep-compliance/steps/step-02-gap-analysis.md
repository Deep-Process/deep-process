# STEP 2: GAP ANALYSIS — Detailed Compliance Gap Assessment

**Phase:** 2 - Gap Identification
**Purpose:** Analyze compliance gaps, classify by severity, generate remediation recommendations
**Methods Used:** Method #329 (Compliance Gap Analyzer) - CRITICAL
**Output:** Comprehensive gap report with severity classification and recommendations

---

## ENFORCED SEQUENCE

```
1. LOAD_MAPPING_RESULTS → Import results from Step 1
2. EXECUTE_METHOD_329 → Automated gap analysis
3. CLASSIFY_SEVERITY → Assign CRITICAL/HIGH/MEDIUM/LOW to each gap
4. GENERATE_RECOMMENDATIONS → Suggest remediation for each gap
5. PRIORITIZE_GAPS → Order by severity + effort + deadline
6. EVALUATE_GATE_2 → Check if gap analysis is complete
```

**PRECONDITION:** GATE_1 = OPEN (requirements mapped)
**DO NOT proceed to Step 3 until GATE_2 = OPEN**

---

## 1. LOAD_MAPPING_RESULTS

**Goal:** Import mapping results from Step 1

```python
# Load from Step 1 output
mapping_result = load_yaml("compliance-mapping-{system}-{date}.yaml")

# Extract gaps
gaps = [
    req for article in mapping_result["articles"]
    for req in article["requirements"]
    if req["status"] in ["GAP", "PARTIAL"]
]

print(f"Found {len(gaps)} gaps to analyze")
# Example: Found 19 gaps to analyze (7 GAP + 12 PARTIAL)
```

---

## 2. EXECUTE_METHOD_329

**Goal:** Automated gap analysis with severity classification

### If Method #329 is available (RECOMMENDED):

```python
from methods.implementations.compliance_gap_analyzer import ComplianceGapAnalyzer

# Initialize analyzer
analyzer = ComplianceGapAnalyzer()

# Prepare inputs
regulatory_requirements = mapping_result["requirements"]
system_capabilities = inventory_result["capabilities"]
evidence_quality = mapping_result["confidence_scores"]

# Execute gap analysis
gap_analysis = analyzer.analyze_gaps(
    regulatory_requirements=regulatory_requirements,
    system_capabilities=system_capabilities,
    evidence_quality=evidence_quality
)
```

**Method #329 performs:**
1. Load gaps from mapping results
2. Assess impact (legal + business + technical)
3. Classify severity based on impact
4. Generate remediation recommendations (effort, steps, owner)
5. Compute timeline estimates

### If Method #329 NOT available (Fallback):

**Manual gap analysis process:**
```
For each gap:
1. Determine impact:
   - Legal: Does this violate EU AI Act?
   - Business: Could this block deployment?
   - Technical: How hard to fix?

2. Classify severity:
   - CRITICAL: Legal violation + deployment blocker
   - HIGH: Legal violation OR major business impact
   - MEDIUM: Best practice, not strictly required
   - LOW: Nice to have

3. Generate recommendation:
   - What needs to be done?
   - How long will it take?
   - Who should do it?
```

---

## 3. CLASSIFY_SEVERITY

**Goal:** Assign severity level to each gap

### Severity Classification Matrix

| Criteria | CRITICAL | HIGH | MEDIUM | LOW |
|----------|----------|------|--------|-----|
| **Legal Impact** | Direct EU AI Act violation | Indirect violation or ambiguous | Best practice, not required | Documentation only |
| **Business Impact** | Deployment blocker | Major delay (>1 month) | Minor delay (<1 week) | No delay |
| **Technical Effort** | Any (must fix regardless) | >2 weeks | 1-2 weeks | <1 week |
| **Evidence Strength** | Strong evidence gap is real | Moderate evidence | Weak evidence | Unclear if real gap |

### Example Classifications

**CRITICAL Gap:**
```yaml
- requirement_id: "Art10-2"
  requirement: "Training data shall be free from errors and biases"
  status: "GAP"
  severity: CRITICAL

  impact:
    legal: "Direct Article 10 violation"
    business: "Cannot deploy in EU without this"
    technical: "Need to implement bias testing pipeline"

  justification: "EU AI Act Article 10.2 is mandatory for high-risk systems. No bias testing = non-compliance = deployment blocker."
```

**HIGH Gap:**
```yaml
- requirement_id: "Art9-2"
  requirement: "Risk management shall be continuous and iterative"
  status: "PARTIAL"
  severity: HIGH

  current_state: "One-time risk assessment done in 2025"
  required_state: "Continuous risk monitoring with quarterly updates"

  impact:
    legal: "Article 9 violation (continuous process required)"
    business: "Regulatory audit would flag this as non-compliant"
    technical: "Need to set up quarterly review process"

  justification: "Risk management exists but doesn't meet 'continuous' requirement."
```

**MEDIUM Gap:**
```yaml
- requirement_id: "Art13-3"
  requirement: "Instructions for use shall be comprehensive"
  status: "PARTIAL"
  severity: MEDIUM

  current_state: "Basic user guide exists"
  required_state: "Comprehensive instructions including edge cases, limitations, contact info"

  impact:
    legal: "Article 13 requirement but enforcement is lenient"
    business: "Minor improvement to user documentation"
    technical: "1-2 days to expand documentation"

  justification: "Documentation exists but could be more comprehensive. Not a blocker."
```

---

## 4. GENERATE_RECOMMENDATIONS

**Goal:** For each gap, suggest how to remediate

### Recommendation Template

```yaml
remediation:
  gap_id: "GAP-001"
  requirement: "Art10-2 - Bias-free training data"

  current_state: "No bias testing implemented"
  target_state: "Bias metrics calculated and documented"

  remediation_steps:
    - step: 1
      action: "Implement Method #336 (Bias Metric Calculator)"
      owner: "ml-team@company.com"
      effort: "3-4 days"
      deliverable: "Bias analysis report"

    - step: 2
      action: "Run bias analysis on training dataset"
      owner: "ml-team@company.com"
      effort: "1 day"
      deliverable: "Bias metrics (demographic parity, equalized odds)"

    - step: 3
      action: "Document bias analysis in data governance docs"
      owner: "compliance@company.com"
      effort: "1 day"
      deliverable: "Updated docs/data-governance.md"

    - step: 4
      action: "If bias > 5% threshold, apply mitigation techniques"
      owner: "ml-team@company.com"
      effort: "1-2 weeks (if needed)"
      deliverable: "Bias-mitigated model"

  total_effort: "1-3 weeks"
  dependencies: ["Method #336 must be implemented first"]
  deadline: "2026-06-01" (2 months before EU AI Act enforcement)
  priority: P0
```

### Common Remediation Patterns

| Gap Type | Typical Remediation |
|----------|---------------------|
| **Missing bias testing** | Implement Method #336, run analysis, document results |
| **No human oversight** | Add override button, document escalation workflow |
| **Insufficient documentation** | Expand docs to cover requirements, edge cases, limitations |
| **No data governance** | Create data governance policy, document data quality checks |
| **Missing audit logs** | Implement Method #328 (Audit Trail Generator) |
| **Stale documentation** | Update docs to current system state, set review cadence |

---

## 5. PRIORITIZE_GAPS

**Goal:** Order gaps by priority for remediation

### Prioritization Algorithm

```python
def prioritize_gaps(gaps):
    """
    Priority = (severity_weight * deadline_urgency) / effort

    severity_weight:
      CRITICAL = 100
      HIGH = 50
      MEDIUM = 20
      LOW = 5

    deadline_urgency:
      < 30 days = 3.0
      30-90 days = 2.0
      90-180 days = 1.5
      > 180 days = 1.0

    effort (in days):
      Lower effort = higher priority
    """
    scored_gaps = []
    for gap in gaps:
        severity_weight = {"CRITICAL": 100, "HIGH": 50, "MEDIUM": 20, "LOW": 5}[gap.severity]
        days_to_deadline = (gap.deadline - today()).days
        urgency = 3.0 if days_to_deadline < 30 else 2.0 if days_to_deadline < 90 else 1.5 if days_to_deadline < 180 else 1.0
        effort_days = gap.remediation.total_effort_days

        priority_score = (severity_weight * urgency) / effort_days
        scored_gaps.append((gap, priority_score))

    return sorted(scored_gaps, key=lambda x: x[1], reverse=True)
```

### Example Prioritization

```yaml
prioritized_gaps:
  - rank: 1
    gap_id: "GAP-001"
    requirement: "Art10-2 - Bias testing"
    severity: CRITICAL
    effort: "1-3 weeks"
    deadline: "2026-06-01" (110 days)
    priority_score: 150.0
    action: "START IMMEDIATELY"

  - rank: 2
    gap_id: "GAP-003"
    requirement: "Art14-1 - Human oversight"
    severity: CRITICAL
    effort: "1 week"
    deadline: "2026-06-01" (110 days)
    priority_score: 142.8
    action: "START THIS WEEK"

  - rank: 3
    gap_id: "GAP-005"
    requirement: "Art12-1 - Audit logging"
    severity: HIGH
    effort: "2 weeks"
    deadline: "2026-07-01" (140 days)
    priority_score: 75.0
    action: "START WITHIN 2 WEEKS"

  # ... lower priority gaps
```

---

## 6. EVALUATE_GATE_2

**Before proceeding to Step 3, verify:**

### Checklist:
- [ ] **G2-01:** All requirements classified (COVERED/PARTIAL/GAP) ✓
- [ ] **G2-02:** Gap severity assigned (CRITICAL/HIGH/MEDIUM/LOW) ✓
- [ ] **G2-03:** Method #329 executed successfully ✓
- [ ] **G2-04:** Gaps have remediation recommendations ✓

**If ALL checked → GATE_2 = OPEN → Proceed to Step 3**

**If ANY missing → GATE_2 = CLOSED → Fix before proceeding**

---

## OUTPUT FORMAT

```yaml
gap_analysis:
  timestamp: "2026-02-14T16:00:00Z"
  system: "CustomerSupport-AI-Chatbot"
  regulation: "EU AI Act 2024"

  summary:
    total_gaps: 19
    breakdown:
      critical: 3
      high: 5
      medium: 8
      low: 3

    effort_estimate: "8-12 weeks total"
    compliance_readiness_date: "2026-06-15" (if all gaps remediated)

  gaps:
    - gap_id: "GAP-001"
      requirement_id: "Art10-2"
      requirement: "Training data shall be free from biases"
      article: "Article 10 - Data Governance"

      status: "GAP"
      severity: CRITICAL

      impact:
        legal: "Direct EU AI Act Article 10.2 violation"
        business: "Deployment blocker - cannot operate in EU"
        technical: "Need bias testing infrastructure"
        financial: "Potential fines up to 6% revenue if non-compliant"

      current_state: "No bias testing implemented"
      required_state: "Bias metrics calculated, documented, and monitored"

      remediation:
        steps:
          - "Implement Method #336 (Bias Metric Calculator)"
          - "Run bias analysis on training dataset"
          - "Document results in data governance docs"
          - "If bias > threshold, apply mitigation"

        effort: "1-3 weeks"
        owner: "ml-team@company.com"
        deadline: "2026-06-01"
        dependencies: ["Method #336"]

      priority_rank: 1
      priority_score: 150.0

    - gap_id: "GAP-002"
      requirement_id: "Art14-1"
      requirement: "Human oversight mechanism shall be in place"
      article: "Article 14 - Human Oversight"

      status: "PARTIAL"
      severity: CRITICAL

      current_state: "Override button exists but no audit trail"
      required_state: "Override button + audit log of all human interventions"

      remediation:
        steps:
          - "Integrate with Method #328 (Audit Trail Generator)"
          - "Log all override events with justification"
          - "Create monthly audit report"

        effort: "1 week"
        owner: "backend-team@company.com"
        deadline: "2026-06-01"
        dependencies: ["Method #328"]

      priority_rank: 2
      priority_score: 142.8

    # ... 17 more gaps

  method_execution:
    method_329_status: "SUCCESS"
    execution_time: "4.5 seconds"
    gaps_analyzed: 19
    recommendations_generated: 19

  gate_2_status: "OPEN"
  ready_for_step_3: true
```

---

## FAST-TRACK MODE ADJUSTMENTS

**If fast_track_mode = true:**

### Focus Only on Critical + High
```yaml
gaps_to_address:
  critical: 3  # All critical gaps
  high: 5      # All high gaps
  medium: 0    # Skip medium gaps in fast-track
  low: 0       # Skip low gaps in fast-track

total_gaps_in_scope: 8 (instead of 19)
```

### Immediate Actions Section
```markdown
## IMMEDIATE ACTIONS (Next 48 hours)

1. **GAP-001 (Art10-2 - Bias testing):**
   - Contact ML team to assess bias testing feasibility
   - If Method #336 not ready → manual bias analysis as stopgap

2. **GAP-002 (Art14-1 - Audit logging):**
   - Enable logging for override events
   - Create spreadsheet to track overrides manually (temporary)

3. **GAP-003 (Art12-1 - Record keeping):**
   - Collect all existing logs, docs, decisions
   - Package into folder for quick audit access
```

---

## COMMON GAP PATTERNS

### Pattern 1: "Documentation Gap" (Easy Fix)

**Symptom:** Capability exists, just not documented

**Example:**
```yaml
gap: "Human oversight mechanism"
reality: "Override button exists, team knows about it, just not in docs"
fix: "Document existing feature (1 day effort)"
severity: MEDIUM
```

### Pattern 2: "Partial Implementation Gap" (Medium Fix)

**Symptom:** Feature exists but incomplete

**Example:**
```yaml
gap: "Continuous risk management"
reality: "One-time risk assessment done, no ongoing monitoring"
fix: "Add quarterly risk review process (1 week setup)"
severity: HIGH
```

### Pattern 3: "Missing Capability Gap" (Hard Fix)

**Symptom:** Feature doesn't exist at all

**Example:**
```yaml
gap: "Bias testing"
reality: "No bias testing ever performed"
fix: "Implement Method #336 + run analysis + mitigate if needed (1-3 weeks)"
severity: CRITICAL
```

---

## GATE_2 VIOLATIONS → FIX ACTIONS

**If GATE_2 fails:**

### Violation: G2-01 (Not all requirements classified)
**Action:** Review mapping results, classify remaining requirements

### Violation: G2-02 (No severity assigned)
**Action:** Apply severity classification matrix to all gaps

### Violation: G2-03 (Method #329 failed)
**Actions:**
- Check: Method #329 installed?
- Check: Input format valid?
- Fallback: Manual gap analysis

### Violation: G2-04 (No recommendations)
**Action:** Generate at least basic recommendations (what to do + effort estimate)

---

## SUCCESS CRITERIA

**Step 2 is SUCCESSFUL when:**
1. ✅ All gaps identified and classified
2. ✅ Severity assigned to each gap
3. ✅ Remediation recommendations generated
4. ✅ Gaps prioritized by urgency + effort
5. ✅ GATE_2 = OPEN

**Time estimate:**
- With Method #329: 5-10 minutes
- Manual analysis: 1-2 hours (19 gaps)
- Review + adjustments: 15-30 minutes

**Next step:** Step 3 - Evidence Collection

---

**Version:** 1.0.0
**Last Updated:** 2026-02-14
**Dependencies:** Method #329 (CRITICAL - significantly slower without it)
