# STEP 4: MONITOR

## ENFORCED SEQUENCE

```
1. LOAD_ENFORCEMENT_CONFIG
2. EXECUTE_METHOD_336
3. COLLECT_COMPLIANCE_DATA
4. DETECT_VIOLATIONS
5. CLASSIFY_VIOLATIONS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_4
```

## 1. LOAD_ENFORCEMENT_CONFIG

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: enforcement configurations from step-03
LOAD: controls from step-02
LOAD: policies from step-02
STORE: monitoring_targets
VERIFY: monitoring_targets.count >= 1
```

## 2. EXECUTE_METHOD_336

```
IF Method 336 (Compliance Gap Analyzer) available:
  EXECUTE: method_336.initialize()

  FOR each policy:
    EXECUTE: method_336.analyze_compliance(policy)
    STORE: compliance_analysis

  OUTPUT:
```yaml
compliance_analysis:
  method: "Method 336 - Compliance Gap Analyzer"
  policies_analyzed: P
  gaps_identified: G
  compliance_rate: "[percentage]"
```

ELSE:
  EXECUTE: manual compliance monitoring (section 3)
```

## 3. COLLECT_COMPLIANCE_DATA

```
FOR each control:
  READ: monitoring.metrics
  READ: monitoring.threshold

  DEFINE data collection:

    IF control.type = TECHNICAL:
      COLLECT from systems:
        - Access logs
        - Audit trails
        - System events
        - Configuration snapshots
        - Performance metrics
        - Error logs

      SOURCES:
        - Application logs
        - Infrastructure logs
        - Security information and event management (SIEM)
        - Cloud provider logs
        - Database audit logs
        - Network flow logs

    IF control.type = ADMINISTRATIVE:
      COLLECT from processes:
        - Approval records
        - Review completion status
        - Training completion records
        - Exception requests
        - Incident reports
        - Change requests

      SOURCES:
        - Workflow systems
        - Document management
        - HR systems
        - Ticketing systems
        - Email archives

    IF control.type = PHYSICAL:
      COLLECT from facilities:
        - Access badge scans
        - Camera footage metadata
        - Visitor logs
        - Environmental sensors
        - Alarm events

      SOURCES:
        - Physical access control systems
        - Building management systems
        - Security monitoring systems

  EXTRACT compliance indicators:
    FOR each metric:
      QUERY: Data source for metric
      AGGREGATE: By time period
      COMPUTE: Metric value
      STORE: metric_value with timestamp

  RECORD data collection:
```yaml
compliance_data:
  control_id: CTL-001
  collection_timestamp: "[timestamp]"
  metrics:
    - metric_name: "[metric]"
      value: "[value]"
      threshold: "[threshold]"
      status: COMPLIANT | NON_COMPLIANT | WARNING
  data_sources: ["source1", "source2"]
  data_quality: COMPLETE | PARTIAL | MISSING
```

REQUIREMENT: Collect data for ALL controls
VIOLATION: Collecting data for "critical" controls only is VIOLATION
```

## 4. DETECT_VIOLATIONS

```
FOR each compliance_data record:
  READ: metric values
  READ: thresholds

  EVALUATE compliance:

    FOR each metric:
      COMPARE: metric_value vs threshold

      IF metric > threshold (where higher is worse):
        violation_detected = TRUE
        violation_type = THRESHOLD_EXCEEDED

      IF metric < threshold (where lower is worse):
        violation_detected = TRUE
        violation_type = THRESHOLD_NOT_MET

      IF metric within acceptable range:
        violation_detected = FALSE
        compliance_status = COMPLIANT

  ANALYZE violation patterns:

    DETECT anomalies:
      COMPARE: Current metric vs historical baseline
      IF deviation > 2 standard deviations:
        anomaly_detected = TRUE
        INVESTIGATE: Root cause

    DETECT trends:
      COMPUTE: Metric trend over time
      IF trend_deteriorating:
        trend_violation = TRUE
        PREDICT: When threshold will be breached

    DETECT correlations:
      FOR each pair of violations:
        COMPUTE: Correlation coefficient
        IF high_correlation:
          MARK: related_violations
          INVESTIGATE: Common root cause

  CREATE violation record:
```yaml
violation:
  violation_id: VIO-001
  control_id: CTL-001
  policy_id: POL-001
  detection_timestamp: "[timestamp]"
  violation_type: THRESHOLD_EXCEEDED | THRESHOLD_NOT_MET | ANOMALY | TREND
  metric_name: "[metric]"
  metric_value: "[value]"
  threshold: "[threshold]"
  deviation: "[how much over/under threshold]"
  affected_systems: ["system1", "system2"]
  related_violations: [VIO-002, VIO-003]
```

SEARCH: Active enforcement rules
FOR each violation:
  CHECK: Was enforcement active?
  IF enforcement_inactive:
    MARK: enforcement_failure = TRUE
  IF enforcement_active:
    MARK: control_insufficient = TRUE

REQUIREMENT: Detect ALL violations, not subset
VIOLATION: Reporting only "critical" violations is VIOLATION
```

## 5. CLASSIFY_VIOLATIONS

```
FOR each violation:
  ASSESS severity:

    COMPUTE impact:
      IF affects_mandatory_requirement:
        impact = CRITICAL
      IF affects_essential_requirement:
        impact = HIGH
      IF affects_recommended_requirement:
        impact = MEDIUM
      IF affects_optional_requirement:
        impact = LOW

    COMPUTE urgency:
      IF regulatory_deadline_imminent:
        urgency = CRITICAL
      IF audit_scheduled_soon:
        urgency = HIGH
      IF no_immediate_deadline:
        urgency = MEDIUM
      IF no_deadline:
        urgency = LOW

    COMPUTE exposure:
      IF violation_public_facing:
        exposure = HIGH
      IF violation_internal_only:
        exposure = MEDIUM
      IF violation_isolated:
        exposure = LOW

    COMPUTE severity = MAX(impact, urgency) + exposure_factor

  CLASSIFY violation severity:
    IF severity >= 9.0:
      severity_class = CRITICAL
    IF severity >= 7.0 AND severity < 9.0:
      severity_class = HIGH
    IF severity >= 4.0 AND severity < 7.0:
      severity_class = MEDIUM
    IF severity < 4.0:
      severity_class = LOW

  ASSESS recurrence:
    SEARCH: Historical violations for same control
    COUNT: Occurrences in last 30 days
    IF count >= 3:
      recurrence_status = RECURRING
      ESCALATE: For systemic fix
    IF count < 3:
      recurrence_status = ISOLATED

  UPDATE violation record:
```yaml
violation_classification:
  violation_id: VIO-001
  severity: CRITICAL | HIGH | MEDIUM | LOW
  severity_score: "[numeric score]"
  impact: CRITICAL | HIGH | MEDIUM | LOW
  urgency: CRITICAL | HIGH | MEDIUM | LOW
  exposure: HIGH | MEDIUM | LOW
  recurrence: RECURRING | ISOLATED
  recurrence_count: "[count]"
  requires_immediate_action: TRUE | FALSE
```

PRIORITIZE violations:
  SORT: BY severity DESC, urgency DESC, recurrence DESC
  CREATE: remediation_priority_queue
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify violation detection accuracy
EXECUTE:
  1. FALSE POSITIVE CHECK:
     SELECT: 5 violations marked CRITICAL
     FOR each:
       ASK: "Is this a real violation or measurement error?"
       VERIFY: Data source accuracy
       VERIFY: Threshold appropriateness
       IF false_positive:
         RECLASSIFY: As non-violation
         UPDATE: Detection logic
       IF true_positive:
         CONFIRM: Violation valid

  2. FALSE NEGATIVE CHECK:
     SELECT: 3 policies marked COMPLIANT
     FOR each:
       ASK: "Could there be undetected violations?"
       SEARCH: For edge cases not monitored
       TEST: Alternative violation scenarios
       IF violation_found:
         ADD: To violation list
         UPDATE: Monitoring coverage
       IF no_violation:
         CONFIRM: Compliant status

  3. SEVERITY CHECK:
     FOR violations WHERE severity = CRITICAL:
       ASK: "Is severity rating accurate?"
       REVIEW: Impact, urgency, exposure assessments
       IF overrated → DOWNGRADE severity
       IF underrated → UPGRADE severity
       IF accurate → CONFIRM

  4. CORRELATION CHECK:
     FOR related_violations:
       VERIFY: Correlation is causal, not coincidental
       INVESTIGATE: Root cause
       IF same_root_cause:
         GROUP: As single incident
         MARK: requires_systemic_fix = TRUE
       IF different_causes:
         UNLINK: Violations

  5. COVERAGE CHECK:
     FOR each control:
       VERIFY: Monitoring is active
       VERIFY: Data collection is complete
       IF monitoring_gap:
         FIX: Monitoring configuration
         RECHECK: For missed violations
       IF complete:
         CONFIRM: Coverage adequate

  6. REPORT:
     "Counter-check executed"
     "False positives eliminated: F"
     "False negatives found: N"
     "Severity adjustments: S"
     "Monitoring gaps fixed: G"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Enforcement configurations loaded from GATE_3?
□ Method 336 executed OR manual compliance monitoring complete?
□ Compliance data collected for ALL controls?
□ Violation detection executed for ALL metrics?
□ ALL violations classified by severity?
□ Recurrence patterns identified?
□ Counter-check executed?
□ False positives eliminated?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## 8. GATE_4

```
EVALUATE:
  monitoring_active = TRUE
  violations_count >= 0
  counter_check_executed = TRUE
  data_collection_complete = TRUE

COUNT:
  total_violations = COUNT(violation_id)
  critical_violations = WHERE severity = CRITICAL
  high_violations = WHERE severity = HIGH
  recurring_violations = WHERE recurrence = RECURRING

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - violations = N, critical = C, high = H, recurring = R"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without data collection:
  HALT
  OUTPUT: "VIOLATION: Section 3 COLLECT_COMPLIANCE_DATA required for ALL"
  RETURN to section 3

IF agent detects subset of violations:
  HALT
  OUTPUT: "VIOLATION: Section 4 requires detection of ALL violations"
  RETURN to section 4

IF agent skips classification:
  HALT
  OUTPUT: "VIOLATION: Section 5 CLASSIFY_VIOLATIONS required for ALL"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
