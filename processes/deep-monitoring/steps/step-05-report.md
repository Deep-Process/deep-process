# STEP 5: REPORT

## ENFORCED SEQUENCE

```
1. LOAD_ASSESSMENT_RESULTS
2. GENERATE_EXECUTIVE_SUMMARY
3. GENERATE_METRICS_SECTION
4. GENERATE_FINDINGS_SECTION
5. GENERATE_RECOMMENDATIONS_SECTION
6. GENERATE_APPENDIX
7. VALIDATE_REPORT
8. COUNTER_CHECK
9. CHECKLIST
10. GATE_5
```

---

## 1. LOAD_ASSESSMENT_RESULTS

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

LOAD: All data from previous steps
  - process_metadata (step-01)
  - gate_metrics (step-02)
  - assumption_metrics (step-02)
  - counter_check_metrics (step-02)
  - evidence_metrics (step-02)
  - completeness_metrics (step-02)
  - violations (step-03)
  - anomalies (step-03)
  - gaps (step-03)
  - patterns (step-03)
  - prioritized_findings (step-04)
  - recommendations (step-04)

VERIFY: All data loaded
```

---

## 2. GENERATE_EXECUTIVE_SUMMARY

```
CREATE high-level summary of monitoring results.

EXECUTE:

  COMPUTE overall_verdict:
    IF critical_violations > 0:
      overall_verdict = FAILED
      verdict_reason = "Critical process violations detected"

    ELSE IF completeness_percentage < 60%:
      overall_verdict = INSUFFICIENT
      verdict_reason = "Execution completeness below acceptable threshold"

    ELSE IF gate_pass_rate < thresholds.gates_passed_min:
      overall_verdict = MARGINAL
      verdict_reason = "Gate passage rate below minimum threshold"

    ELSE IF critical_findings = 0 AND major_findings <= 2:
      overall_verdict = PASSED
      verdict_reason = "Process executed within quality standards"

    ELSE:
      overall_verdict = PASSED_WITH_CONCERNS
      verdict_reason = "Process completed but with quality concerns"

  IDENTIFY top_3_concerns:
    SELECT top 3 findings by risk_score
    FOR each:
      EXTRACT: finding description, risk_level

  COMPUTE key_metrics_summary:
    - Gate pass rate: [percentage]%
    - Completeness: [percentage]%
    - Critical findings: [N]
    - Immediate actions required: [N]

WRITE:
```markdown
# MONITORING REPORT

**Process:** [process_name] v[version]
**Execution ID:** [execution_id]
**Execution Date:** [timestamp]
**Monitoring Date:** [current_date]

---

## EXECUTIVE SUMMARY

**Overall Verdict:** [overall_verdict]

**Reason:** [verdict_reason]

**Key Metrics:**
- Gate Pass Rate: [percentage]% (threshold: [threshold]%)
- Execution Completeness: [percentage]%
- Critical Findings: [N]
- Immediate Actions Required: [N]

**Top 3 Concerns:**
1. [Finding 1 description] — Risk: [level]
2. [Finding 2 description] — Risk: [level]
3. [Finding 3 description] — Risk: [level]

**Recommendation:** [what decision-maker should do based on verdict]
```
```

---

## 3. GENERATE_METRICS_SECTION

```
CREATE detailed metrics breakdown.

WRITE:
```markdown
---

## EXECUTION METRICS

### Gate Performance

**Gates Passed:** [gates_passed] / [total_gates] ([percentage]%)
**First-Attempt Pass Rate:** [percentage]%

**Gate Details:**
| Gate ID | Status | Conditions Passed | Conditions Failed | Violations |
|---------|--------|-------------------|-------------------|------------|
[FOR each gate in gate_data:]
| [gate_id] | [status] | [conditions_passed] | [conditions_failed] | [violations_count] |

**Failed Gates:**
[IF gates_failed > 0:]
[FOR each gate WHERE status = CLOSED:]
- **[gate_id]:** [violations_list]
  - Severity: [severity]
  - Impact: [description]
[ELSE:]
- None

---

### Assumption Quality

**Total Assumptions Declared:** [total_assumptions]
**Average per Phase:** [per_phase_avg]

**Status Distribution:**
- Verified: [verified_count] ([verification_rate]%)
- Survived (untested): [survived_count] ([percentage]%)
- Falsified: [falsified_count] ([falsification_rate]%)
- Untested: [untested_count] ([untested_rate]%)

**Phases Missing Assumptions:**
[IF phases_missing_assumptions NOT EMPTY:]
[FOR each phase in phases_missing_assumptions:]
- Phase [phase_id]
[ELSE:]
- None

---

### Counter-Check Effectiveness

**Total Counter-Checks:** [total_counter_checks]
**Average per Phase:** [per_phase_avg]

**Results Distribution:**
- Confirmed: [confirmed_count]
- Weakened: [weakened_count]
- Refuted: [refuted_count]

**Effectiveness Rate:** [effectiveness_rate]% (claims challenged)

[IF effectiveness_rate = 0%:]
⚠️ **Warning:** No claims were challenged (possible rubber-stamping)
[ELSE IF effectiveness_rate = 100%:]
⚠️ **Warning:** All claims were challenged (possible excessive skepticism)

**Phases Missing Counter-Checks:**
[IF phases_missing_checks NOT EMPTY:]
[FOR each phase in phases_missing_checks:]
- Phase [phase_id]
[ELSE:]
- None

---

### Evidence Quality

[IF evidence_metrics.status = AVAILABLE:]
**Verified Evidence:** [verified_count]
**Assumed Evidence:** [assumed_count]
**Verified Ratio:** [verified_ratio]%

[IF verified_ratio < thresholds.verified_ratio_min:]
⚠️ **Below Threshold:** [verified_ratio]% < [threshold]%
[ELSE:]
✓ **Meets Threshold:** [verified_ratio]% ≥ [threshold]%

[ELSE:]
**Evidence Tracking:** Not available for this process type

---

### Completeness Score

**Overall Score:** [completeness_percentage]% — **[completeness_level]**

**Score Breakdown:**
- Phase Completion: [phase_completion_points] points
- Gate Passage: [gate_passage_points] points
- Assumptions Declared: [assumption_points] points
- Counter-Checks Executed: [counter_check_points] points
- Scope Reduction Penalty: -[penalty_points] points

**Total Raw Score:** [raw_score] / 100

**Classification:**
- 90-100%: EXCELLENT
- 75-89%: GOOD
- 60-74%: ADEQUATE
- 40-59%: MARGINAL
- <40%: INSUFFICIENT
```
```

---

## 4. GENERATE_FINDINGS_SECTION

```
CREATE detailed findings breakdown.

WRITE:
```markdown
---

## FINDINGS

**Total Findings:** [total_findings]
- Critical: [critical_count]
- Major: [major_count]
- Minor: [minor_count]

---

### IMMEDIATE ACTION REQUIRED ([immediate_action_count])

[FOR each finding in immediate_action_items:]
#### [finding_id]: [finding_type]

**Severity:** [severity]
**Risk Score:** [risk_score]
**Priority Rank:** [priority_rank]

**Description:** [description]

**Evidence:** [evidence]

**Impact:**
- Validity: [impact_on_validity]
- Rigor: [impact_on_rigor]
- Confidence: [impact_on_confidence]
- Completeness: [impact_on_completeness]

**Urgency:** [urgency_level]
- Time Sensitivity: [time_sensitivity]
- Cascading Effect: [cascading_effect]

**Action Required:** [action_required]

---

### PRIORITY ACTION ([priority_action_count])

[FOR each finding in priority_action_items:]
[Same structure as immediate action]

---

### PLANNED REMEDIATION ([planned_action_count])

[FOR each finding in planned_action_items:]
**[finding_id]:** [brief description] — Risk: [risk_level]

---

### MONITORING ([monitoring_count])

[FOR each finding in monitoring_items:]
**[finding_id]:** [brief description] — Trend: [watch for what]
```
```

---

## 5. GENERATE_RECOMMENDATIONS_SECTION

```
CREATE actionable recommendations.

WRITE:
```markdown
---

## RECOMMENDATIONS

### Immediate Actions (Must Address Before Using Results)

[FOR each recommendation WHERE deadline = IMMEDIATE:]
**[N].** [action]

**Rationale:** [rationale]

**Implementation:**
[implementation steps]

**Owner:** [owner]
**Deadline:** IMMEDIATE

---

### Priority Actions (Address Before Next Execution)

[FOR each recommendation WHERE deadline = BEFORE_NEXT_EXECUTION:]
**[N].** [action]

**Rationale:** [rationale]

**Implementation:** [implementation]

**Owner:** [owner]
**Deadline:** Before next process execution

---

### Planned Improvements (Next Improvement Cycle)

[FOR each recommendation WHERE deadline = NEXT_IMPROVEMENT_CYCLE:]
**[N].** [action]

**Rationale:** [rationale]

**Owner:** [owner]

---

### Ongoing Monitoring

[FOR each recommendation WHERE deadline = ONGOING:]
**[N].** [action]

**What to Track:** [metric/trend]

**Owner:** [owner]
```
```

---

## 6. GENERATE_APPENDIX

```
CREATE supporting data appendix.

WRITE:
```markdown
---

## APPENDIX

### A. Monitoring Configuration

**Monitoring Scope:** [scope_type]
**Dimensions Monitored:**
[FOR each dimension in monitoring_scope.dimensions:]
- [dimension]

**Thresholds:**
- Gate Pass Rate: ≥[threshold]%
- Assumptions per Phase: ≥[threshold]
- Counter-Checks per Phase: ≥[threshold]
- Verified Evidence Ratio: ≥[threshold]%

---

### B. Data Quality

**Artifact Collection:**
- Expected Artifacts: [expected_count]
- Found Artifacts: [found_count]
- Missing Artifacts: [missing_count]

[IF missing_count > 0:]
**Missing:**
[FOR each missing artifact:]
- [artifact_name] — Criticality: [criticality]

**Data Completeness:**
- Gate Data: [COMPLETE | INCOMPLETE]
- Assumption Data: [COMPLETE | INCOMPLETE]
- Counter-Check Data: [COMPLETE | INCOMPLETE]

**Quality Flags:**
[FOR each flag in data_quality.quality_flags:]
- [flag_name] — Severity: [severity]

---

### C. Scope Reductions

[IF scope_reductions.count > 0:]
**Total Scope Reductions:** [count]

[FOR each scope_reduction:]
**[reduction_id]:**
- **Omitted:** [what_omitted]
- **Reason:** [why]
- **Impact:** [impact_assessment]
- **Phase:** [phase]
- **User Approved:** [user_approved]
- **Criticality:** [criticality]

[ELSE:]
No scope reductions declared.

---

### D. Patterns Detected

[IF patterns.count > 0:]
[FOR each pattern:]
**[pattern_id]: [type]**
- **Description:** [description]
- **Evidence:** [evidence]
- **Hypothesis:** [hypothesis]

[ELSE:]
No significant patterns detected.

---

### E. Monitoring Process Log

**Monitoring Execution:**
- Start Time: [start_time]
- End Time: [end_time]
- Duration: [duration]

**Gates Passed:**
- GATE_0: [OPEN | CLOSED]
- GATE_1: [OPEN | CLOSED]
- GATE_2: [OPEN | CLOSED]
- GATE_3: [OPEN | CLOSED]
- GATE_4: [OPEN | CLOSED]
- GATE_5: [OPEN | CLOSED]

**Counter-Checks Executed:**
- Step 0: [count]
- Step 1: [count]
- Step 2: [count]
- Step 3: [count]
- Step 4: [count]
- Step 5: [count]

**Total Counter-Checks:** [total]
```
```

---

## 7. VALIDATE_REPORT

```
VERIFY report completeness and accuracy.

EXECUTE:

  COMPLETENESS_CHECK:
    □ Executive summary present?
    □ Metrics section present?
    □ Findings section present?
    □ Recommendations section present?
    □ Appendix present?

    FOR each section:
      IF NOT present:
        FLAG: missing_section = TRUE
        HALT with "ERROR: Section [name] missing"

  ACCURACY_CHECK:
    SELECT: 3 random metrics from report
    FOR each metric:
      VERIFY: Value matches source data
      IF mismatch:
        FLAG: data_error = TRUE
        RECORD: Metric name + expected vs actual
        CORRECT: Update report with correct value

  CONSISTENCY_CHECK:
    VERIFY: Total findings in summary = sum of findings in categories
    VERIFY: Recommendation count = findings count
    VERIFY: All finding IDs in recommendations section exist in findings section

    IF any mismatch:
      FLAG: consistency_error = TRUE
      CORRECT: Fix inconsistency

REQUIREMENT: All checks PASS before proceeding.
```

---

## 8. COUNTER_CHECK

```
REQUIREMENT: Verify report quality.

EXECUTE:
  1. ACTIONABILITY_CHECK:
     ASK: "Can someone act on this report without additional context?"
     EVALUATE:
       - Are findings clearly described?
       - Are recommendations specific?
       - Is verdict unambiguous?
     IF vague or unclear sections:
       FLAG: unclear_report = TRUE
       REVISE: Clarify unclear sections
     IF clear:
       CONFIRM: Report is actionable

  2. COMPLETENESS_VS_BREVITY_CHECK:
     ASK: "Does report include all critical information without excess?"
     EVALUATE:
       - All critical findings present?
       - Appendix not hiding important info?
       - Executive summary captures essence?
     IF critical info buried or missing:
       FLAG: incomplete_report = TRUE
       REVISE: Surface critical information
     IF balanced:
       CONFIRM: Report is complete and concise

  3. VERDICT_JUSTIFICATION_CHECK:
     ASK: "Is overall verdict justified by findings?"
     VERIFY:
       IF verdict = FAILED → critical_violations > 0
       IF verdict = PASSED → critical_findings = 0 AND major_findings low
     IF verdict unjustified:
       FLAG: verdict_mismatch = TRUE
       CORRECT: Adjust verdict OR re-evaluate findings
     IF justified:
       CONFIRM: Verdict appropriate

RECORD:
```yaml
counter_checks:
  - check_id: CC5-01
    check: "Report actionability"
    result: PASSED | REVISED
    revisions: [N]
  - check_id: CC5-02
    check: "Completeness vs brevity"
    result: PASSED | REVISED
    revisions: [N]
  - check_id: CC5-03
    check: "Verdict justification"
    result: PASSED | CORRECTED
    corrections: [N]
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 9. CHECKLIST

```
ANSWER YES/NO:
□ Assessment results loaded from step-04?
□ Executive summary generated?
□ Metrics section generated (all 4 metric types)?
□ Findings section generated (all severity levels)?
□ Recommendations section generated (all deadlines)?
□ Appendix generated (all subsections)?
□ Report validated (completeness, accuracy, consistency)?
□ Counter-checks executed (all 3)?
□ Counter-check results recorded?
□ All sections filled (no empty sections)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

---

## 10. GATE_5

```
EVALUATE:
  report_generated = TRUE
  all_sections_filled = TRUE
  counter_check_executed = TRUE

COUNT:
  sections_present = [N]
  expected_sections = 5 (exec summary, metrics, findings, recommendations, appendix)
  counter_checks_executed = 3

IF all TRUE AND sections_present = expected_sections AND counter_checks_executed = 3:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - report complete, verdict=[verdict]"

  WRITE report to file:
    FILENAME: [output_directory]/monitoring-report-[execution_id].md
    CONTENT: [generated report]

  WRITE monitoring log:
    FILENAME: [output_directory]/monitoring-log.yaml
    CONTENT:
```yaml
monitoring_execution:
  monitoring_date: "[date]"
  target_process: "[process_name]"
  target_execution_id: "[execution_id]"
  monitoring_scope: "[scope_type]"
  overall_verdict: "[verdict]"
  findings_count: [total_findings]
  critical_findings: [critical_count]
  immediate_actions: [immediate_count]
  gates_passed: [all_gates_passed]
  counter_checks_total: [total_counter_checks]
  report_file: "monitoring-report-[execution_id].md"
```

  MONITORING COMPLETE

IF any FALSE OR sections_present < expected_sections:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without generating executive summary:
  HALT
  OUTPUT: "VIOLATION: Section 2 GENERATE_EXECUTIVE_SUMMARY required"
  RETURN to section 2

IF agent proceeds without generating all sections:
  HALT
  OUTPUT: "VIOLATION: Sections 2-6 ALL required (no empty sections)"
  RETURN to missing section

IF agent proceeds without validating report:
  HALT
  OUTPUT: "VIOLATION: Section 7 VALIDATE_REPORT required"
  RETURN to section 7

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 8 COUNTER_CHECK required"
  RETURN to section 8
```
