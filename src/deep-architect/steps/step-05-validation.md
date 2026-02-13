---
step: 5
name: "Validation"
time_estimate: "30-60 minutes"
goal: "Bounded validation of top 10 critical issues, unknown-unknown detection"
requires_completion: true
next_steps: ["step-06-verification.md"]
data_dependencies: ["data/schemas/validation-report.schema.yaml", "adversary-findings.yaml", "tradeoff-analysis.yaml"]
outputs: ["validation-report.yaml"]
gate: "GATE_5"
gate_conditions: 6
---

# PHASE 5: VALIDATION — ENFORCED SEQUENCE

## 5.0 ASSUMPTIONS_DECLARED

1. Declare assumptions about issue ranking, validation completeness, blind spots
2. Log in validation-report.yaml `assumptions[]` with A-5XX IDs
3. Minimum 2 assumptions

**IF zero assumptions → HALT (INV-03 violation)**

---

## 5.1 EXTRACT: Issue Collection

1. Read adversary-findings.yaml → collect ALL findings:
   - STRIDE threats (T-XXX)
   - FMEA failure modes (FM-XXX)
   - Bottlenecks (BN-XXX)
   - Anti-patterns (AP-XXX)
   - Complexity violations
   - Compliance gaps
   - Pre-mortem scenarios (PS-XXX)
   - Trade-off conflicts (TC-XXX)
2. Read tradeoff-analysis.yaml → collect unresolved trade-offs
3. Count total issues identified across all sources
4. Document source breakdown

---

## 5.2 EXTRACT: Issue Ranking

1. For each collected issue, score:
   - Severity (1-5): 1=minor cosmetic, 5=system failure
   - Impact (1-5): 1=single component, 5=entire system
   - Likelihood (1-5): 1=rare theoretical, 5=near certain
2. Calculate composite score: `severity × impact × likelihood`
3. Sort ALL issues by composite score descending
4. Select TOP 10 issues

**ENFORCEMENT:** Exactly 10 issues. Not 9, not 11. (INV-09, MA-004)
- IF fewer than 10 issues found total → validate ALL (document count in bounded_count_enforcement)
- IF more than 10 → select TOP 10 by composite score, document cutoff and items below

---

## 5.3 EXTRACT: Validation Tests

For each of the 10 selected issues, design a validation test:

```yaml
- rank: 1
  id: "VI-001"
  source_finding: "T-003"
  title: "[Issue title]"
  severity: 5
  impact: 4
  likelihood: 3
  composite_score: 60
  validation_test:
    test_id: "VT-001"
    test_type: "scenario"    # walkthrough | scenario | stress_test | review | analysis
    procedure: "[Step-by-step how to validate]"
    expected_result: "[What should happen if mitigation works]"
    actual_result: "[Observed result]"
    status: "PASS"           # PASS | FAIL | PARTIAL
  mitigation:
    description: "[Current mitigation]"
    adequate: true
    residual_risk: "[Remaining risk]"
  recommendation: "[Action item]"
```

**Validation test types:**
- **Walkthrough**: Step through scenario mentally, trace data flow
- **Scenario analysis**: Define stimulus-response, evaluate against quality targets
- **Stress test**: Push beyond normal parameters, observe behavior
- **Review**: Expert review of design against known patterns/anti-patterns
- **Analysis**: Formal analysis (complexity metrics, dependency graphs)

---

## 5.4 EXTRACT: Mitigation Adequacy Assessment

1. For each validated issue, assess mitigation:
   - `adequate`: Mitigation fully addresses the issue
   - `partially adequate`: Mitigation reduces but doesn't eliminate risk
   - `inadequate`: Mitigation insufficient, residual risk unacceptable
2. Count: adequate + partial + inadequate = 10 (sum check)
3. Determine overall assessment: `adequate | partially_adequate | inadequate`
4. List remaining risks (inadequate mitigations)

---

## 5.5 EXTRACT: Unknown-Unknown Detection

1. Execute blind spot scan:
   - What domains/technologies am I unfamiliar with?
   - What failure modes might exist outside my training data?
   - What stakeholders haven't been considered?
   - What environmental factors might change?
2. For each uncertainty area:
   ```yaml
   - area: "Third-party API reliability"
     nature: "External dependency behavior unknown"
     risk_level: "medium"
     recommendation: "Add circuit breaker, define SLA requirements"
   ```
3. Document `blind_spots_acknowledged[]` — what we know we don't know

**Method — Unknown-Unknown Detection:**
1. List all external dependencies → which ones have no SLA/documentation?
2. List all assumptions → which ones are untestable?
3. Consider adjacent systems → what could change without notice?
4. Consider time dimension → what will change in 6/12/24 months?
5. Document at least 3 acknowledged blind spots

---

## 5.6 VERIFY: Validation Quality

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 validated issues → verify source_finding references exist
   2. Verify composite scores calculated correctly (severity × impact × likelihood)
   3. IF any reference broken → fix before proceeding

2. **Method #84 Coherence Check:**
   1. Verify issues ranked by composite score (descending)
   2. Verify mitigation counts sum to validated count
   3. Verify test types match issue types

3. **Method #168 Phantom Hunt (for deep depth):**
   1. Check for validation tests that don't test actual issues
   2. Verify no duplicate issues in top 10
   3. Verify no issues artificially inflated/deflated

---

## 5.7 RENDER: Validation Report Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `validation-report.yaml` following schema
2. Include: metadata, assumptions, issue_ranking, issues_validated (exactly 10), bounded_count_enforcement, unknown_unknowns, mitigation_summary, checklist, counter_checks
3. Write to `{output_directory}/architecture-artifacts/validation-report.yaml`

---

## 5.8 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | All issues collected from Phase 3-4 | PASS/FAIL |
| 2 | Issues ranked by severity × impact × likelihood | PASS/FAIL |
| 3 | Exactly 10 issues selected for validation | PASS/FAIL |
| 4 | Validation test designed for each issue | PASS/FAIL |
| 5 | Mitigation adequacy assessed for each | PASS/FAIL |
| 6 | Unknown-unknown detection executed | PASS/FAIL |
| 7 | Blind spots acknowledged | PASS/FAIL |
| 8 | ASSUMPTIONS_DECLARED | PASS/FAIL |
| 9 | Counter-checks executed | PASS/FAIL |
| 10 | validation-report.yaml written | PASS/FAIL |

---

## 5.9 GATE_5 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G5-01 | Exactly 10 issues validated | BLOCKER | |
| G5-02 | Top 10 by severity/impact ranking | CRITICAL | |
| G5-03 | Validation tests designed (≥10) | CRITICAL | |
| G5-04 | Mitigation adequacy assessed | CRITICAL | |
| G5-05 | Unknown-unknown detection executed | ERROR | |
| G5-06 | ASSUMPTIONS_DECLARED for validation | REQUIRED | |

**Pass criteria:** G5-01 (BLOCKER) + ALL CRITICAL conditions met

- IF G5-01 fails (not exactly 10) → GATE_5 = **LOCKED** → ABORT (BLOCKER)
- IF CRITICAL fails → GATE_5 = **LOCKED** → HALT, fix
- IF ALL pass → GATE_5 = **OPEN** → proceed to Phase 6
