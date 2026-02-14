# STEP 3: DETECT

## ENFORCED SEQUENCE

```
1. LOAD_ANALYSIS_RESULTS
2. DETECT_VIOLATIONS
3. DETECT_ANOMALIES
4. DETECT_GAPS
5. DETECT_PATTERNS
6. CLASSIFY_FINDINGS
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_3
```

---

## 1. LOAD_ANALYSIS_RESULTS

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: Metrics calculated in step-02
  - gate_metrics
  - assumption_metrics
  - counter_check_metrics
  - evidence_metrics
  - completeness_metrics
  - threshold_flags

VERIFY: All metrics loaded
```

---

## 2. DETECT_VIOLATIONS

```
IDENTIFY process execution violations.

EXECUTE:

  VIOLATION_TYPE_1: Gate blocking violations
    FOR each gate WHERE status = CLOSED:
      IF process proceeded to next phase despite CLOSED gate:
        RECORD:
          violation_id: V-G-[N]
          type: GATE_BLOCKING_VIOLATION
          gate_id: [id]
          description: "Process proceeded past closed gate"
          evidence: "Gate [id] = CLOSED, but phase [N+1] executed"
          severity: CRITICAL

  VIOLATION_TYPE_2: Missing mandatory elements
    IF phases_missing_assumptions NOT EMPTY:
      FOR each phase in phases_missing_assumptions:
        RECORD:
          violation_id: V-A-[N]
          type: MISSING_ASSUMPTIONS
          phase: [phase_id]
          description: "Phase executed without declaring assumptions"
          severity: CRITICAL

    IF phases_missing_checks NOT EMPTY:
      FOR each phase in phases_missing_checks:
        RECORD:
          violation_id: V-C-[N]
          type: MISSING_COUNTER_CHECKS
          phase: [phase_id]
          description: "Phase executed without counter-checks"
          severity: CRITICAL

  VIOLATION_TYPE_3: Unapproved scope reductions
    FOR each scope_reduction WHERE user_approved = NO AND criticality = CRITICAL:
      RECORD:
        violation_id: V-S-[N]
        type: UNAPPROVED_SCOPE_REDUCTION
        reduction_id: [id]
        description: "Critical omission without user approval"
        omitted: [what_omitted]
        severity: CRITICAL

STORE:
```yaml
violations:
  - violation_id: "[id]"
    type: "[type]"
    severity: CRITICAL | MAJOR | MINOR
    description: "[description]"
    evidence: "[evidence]"
    affected_phase: [N] | null
```

COUNT:
  total_violations = COUNT(violations)
  critical_violations = COUNT(severity = CRITICAL)
  major_violations = COUNT(severity = MAJOR)
  minor_violations = COUNT(severity = MINOR)
```

---

## 3. DETECT_ANOMALIES

```
IDENTIFY unusual patterns in execution metrics.

EXECUTE:

  ANOMALY_TYPE_1: Gate pass rate anomaly
    IF gate_pass_rate < 50%:
      RECORD:
        anomaly_id: A-G-01
        type: LOW_GATE_PASS_RATE
        metric: gate_pass_rate
        value: [percentage]%
        threshold: 50%
        description: "Unusually low gate passage rate"

  ANOMALY_TYPE_2: Counter-check effectiveness anomaly
    IF effectiveness_rate = 0%:
      RECORD:
        anomaly_id: A-C-01
        type: RUBBER_STAMPING
        metric: counter_check_effectiveness
        value: 0%
        description: "No claims challenged (all counter-checks confirmed)"

    IF effectiveness_rate = 100%:
      RECORD:
        anomaly_id: A-C-02
        type: EXCESSIVE_CHALLENGE
        metric: counter_check_effectiveness
        value: 100%
        description: "All claims challenged (no confirmations)"

  ANOMALY_TYPE_3: Evidence ratio anomaly
    IF evidence_metrics.verified_ratio < 10%:
      RECORD:
        anomaly_id: A-E-01
        type: EXCESSIVE_ASSUMPTIONS
        metric: verified_ratio
        value: [percentage]%
        threshold: 10%
        description: "Nearly all evidence is ASSUMED"

  ANOMALY_TYPE_4: Execution duration anomaly
    IF process_metadata contains execution_duration:
      EXTRACT: execution_duration
      EXTRACT: expected_duration_for_depth

      IF execution_duration < expected_duration × 0.3:
        RECORD:
          anomaly_id: A-T-01
          type: SUSPICIOUSLY_FAST
          metric: execution_duration
          value: [duration]
          expected: [expected_duration]
          description: "Process completed much faster than expected (possible shortcuts)"

      IF execution_duration > expected_duration × 3:
        RECORD:
          anomaly_id: A-T-02
          type: SUSPICIOUSLY_SLOW
          metric: execution_duration
          value: [duration]
          expected: [expected_duration]
          description: "Process took much longer than expected"

STORE:
```yaml
anomalies:
  - anomaly_id: "[id]"
    type: "[type]"
    metric: "[metric_name]"
    value: "[value]"
    threshold: "[threshold]" | null
    description: "[description]"
```

COUNT:
  total_anomalies = COUNT(anomalies)
```

---

## 4. DETECT_GAPS

```
IDENTIFY missing or incomplete execution elements.

EXECUTE:

  GAP_TYPE_1: Below threshold performance
    IF below_gate_threshold = TRUE:
      RECORD:
        gap_id: G-01
        type: BELOW_GATE_THRESHOLD
        description: "Gate pass rate below minimum threshold"
        actual: [gate_pass_rate]%
        required: [thresholds.gates_passed_min]%
        impact: "Process execution quality insufficient"

    IF below_assumption_threshold = TRUE:
      RECORD:
        gap_id: G-02
        type: BELOW_ASSUMPTION_THRESHOLD
        description: "Assumption declarations below minimum"
        actual: [assumptions_per_phase_avg]
        required: [thresholds.assumptions_declared_min]
        impact: "Insufficient interpretive clarity"

    IF below_counter_check_threshold = TRUE:
      RECORD:
        gap_id: G-03
        type: BELOW_COUNTER_CHECK_THRESHOLD
        description: "Counter-checks below minimum"
        actual: [counter_checks_per_phase_avg]
        required: [thresholds.counter_checks_min]
        impact: "Insufficient adversarial validation"

    IF below_evidence_threshold = TRUE:
      RECORD:
        gap_id: G-04
        type: BELOW_EVIDENCE_THRESHOLD
        description: "Verified evidence ratio below minimum"
        actual: [verified_ratio]%
        required: [thresholds.verified_ratio_min]%
        impact: "Excessive reliance on assumptions"

  GAP_TYPE_2: Missing artifacts
    FOR each artifact in artifact_inventory WHERE found = FALSE AND criticality != OPTIONAL:
      RECORD:
        gap_id: G-A-[N]
        type: MISSING_ARTIFACT
        artifact: [filename]
        criticality: [criticality]
        description: "Expected artifact not found"
        impact: "Incomplete monitoring data"

  GAP_TYPE_3: Incomplete data
    IF data_quality.completeness contains INCOMPLETE:
      FOR each incomplete data type:
        RECORD:
          gap_id: G-D-[N]
          type: INCOMPLETE_DATA
          data_type: [gate_data | assumptions | counter_checks]
          description: "Data collection incomplete"
          impact: "Reduced monitoring accuracy"

STORE:
```yaml
gaps:
  - gap_id: "[id]"
    type: "[type]"
    description: "[description]"
    actual: "[value]" | null
    required: "[value]" | null
    impact: "[impact]"
```

COUNT:
  total_gaps = COUNT(gaps)
```

---

## 5. DETECT_PATTERNS

```
IDENTIFY recurring patterns in findings.

EXECUTE:

  PATTERN_TYPE_1: Consistent phase failures
    GROUP violations BY affected_phase
    FOR each phase:
      IF violations_in_phase > 2:
        RECORD:
          pattern_id: P-01
          type: PHASE_FAILURE_PATTERN
          phase: [phase_id]
          violation_count: [N]
          description: "Multiple violations in same phase"
          hypothesis: "Phase [id] has systemic issues"

  PATTERN_TYPE_2: Declining quality over phases
    CALCULATE quality_trend:
      FOR each phase:
        phase_quality = (gate_pass + assumptions_declared + counter_checks_executed)

      IF phase_quality shows decreasing trend:
        RECORD:
          pattern_id: P-02
          type: QUALITY_DEGRADATION
          description: "Execution quality decreases over phases"
          hypothesis: "Agent fatigue or rushing to completion"

  PATTERN_TYPE_3: Scope reduction clustering
    GROUP scope_reductions BY phase
    FOR each phase:
      IF scope_reductions_in_phase > 1:
        RECORD:
          pattern_id: P-03
          type: SCOPE_REDUCTION_CLUSTER
          phase: [phase_id]
          reduction_count: [N]
          description: "Multiple omissions in same phase"
          hypothesis: "Phase [id] too complex or time-constrained"

STORE:
```yaml
patterns:
  - pattern_id: "[id]"
    type: "[type]"
    description: "[description]"
    evidence: "[supporting data]"
    hypothesis: "[explanation]"
```

COUNT:
  total_patterns = COUNT(patterns)
```

---

## 6. CLASSIFY_FINDINGS

```
CATEGORIZE all detected findings by severity and type.

EXECUTE:

  AGGREGATE findings:
    all_findings = violations + anomalies + gaps + patterns

  FOR each finding:
    IF NOT has severity:
      ASSIGN severity based on type:
        CRITICAL types: GATE_BLOCKING_VIOLATION, MISSING_ASSUMPTIONS, UNAPPROVED_SCOPE_REDUCTION
        MAJOR types: BELOW_GATE_THRESHOLD, RUBBER_STAMPING, EXCESSIVE_ASSUMPTIONS
        MINOR types: SUSPICIOUSLY_SLOW, INCOMPLETE_DATA

  GROUP findings BY severity:
    critical_findings = findings WHERE severity = CRITICAL
    major_findings = findings WHERE severity = MAJOR
    minor_findings = findings WHERE severity = MINOR

  SORT findings within each severity:
    BY impact (highest impact first)

STORE:
```yaml
findings_summary:
  total_findings: [N]
  by_severity:
    critical: [N]
    major: [N]
    minor: [N]
  by_type:
    violations: [N]
    anomalies: [N]
    gaps: [N]
    patterns: [N]
```
```

---

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify detection accuracy.

EXECUTE:
  1. FALSE_POSITIVE_CHECK:
     SELECT: 3 random CRITICAL findings
     FOR each finding:
       ASK: "Could this be a false positive?"
       EXAMINE: Evidence supporting finding
       TEST: Alternative explanations
       IF alternative explanation valid:
         FLAG: possible_false_positive = TRUE
         RECORD: Finding ID + alternative explanation
       IF no alternative explanation:
         CONFIRM: Finding likely valid

  2. FALSE_NEGATIVE_CHECK:
     ASK: "Are there issues we should detect but didn't?"
     SCAN: Metrics for suspicious patterns not captured
     CONSIDER:
       - High completeness score but many violations
       - Perfect gate pass but low evidence ratio
       - No anomalies detected despite unusual metrics
     IF suspicious pattern found:
       INVESTIGATE: Why not detected?
       ADD: New finding if valid issue
     IF no suspicious patterns:
       CONFIRM: Detection appears complete

  3. SEVERITY_CLASSIFICATION_CHECK:
     SELECT: 2 CRITICAL findings, 2 MAJOR findings
     FOR each:
       ASK: "Is severity assignment appropriate?"
       COMPARE: Impact vs severity level
       IF severity too high:
         FLAG: severity_overassigned = TRUE
         RECOMMEND: Downgrade severity
       IF severity too low:
         FLAG: severity_underassigned = TRUE
         RECOMMEND: Upgrade severity
       IF appropriate:
         CONFIRM: Severity correct

RECORD:
```yaml
counter_checks:
  - check_id: CC3-01
    check: "False positive detection"
    result: PASSED | FLAGGED
    possible_false_positives: [N]
  - check_id: CC3-02
    check: "False negative detection"
    result: PASSED | ADJUSTED
    findings_added: [N]
  - check_id: CC3-03
    check: "Severity classification"
    result: PASSED | ADJUSTED
    adjustments: [N]
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Analysis results loaded from step-02?
□ Violations detected (all 3 types checked)?
□ Anomalies detected (all 4 types checked)?
□ Gaps detected (all 3 types checked)?
□ Patterns detected (all 3 types checked)?
□ Findings classified by severity?
□ Findings sorted by impact within severity?
□ Counter-checks executed (all 3)?
□ Counter-check results recorded?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

---

## 9. GATE_3

```
EVALUATE:
  violations_detected = TRUE
  anomalies_classified = TRUE
  counter_check_executed = TRUE

COUNT:
  total_findings = violations + anomalies + gaps + patterns
  critical_findings = [N]
  counter_checks_executed = 3

IF all TRUE AND counter_checks_executed = 3:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - findings detected, total=[N], critical=[M]"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without detecting violations:
  HALT
  OUTPUT: "VIOLATION: Section 2 DETECT_VIOLATIONS required"
  RETURN to section 2

IF agent proceeds without detecting anomalies:
  HALT
  OUTPUT: "VIOLATION: Section 3 DETECT_ANOMALIES required"
  RETURN to section 3

IF agent proceeds without classifying findings:
  HALT
  OUTPUT: "VIOLATION: Section 6 CLASSIFY_FINDINGS required"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
