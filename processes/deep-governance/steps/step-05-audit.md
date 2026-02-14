# STEP 5: AUDIT

## ENFORCED SEQUENCE

```
1. LOAD_VIOLATIONS
2. EXECUTE_METHOD_328
3. COLLECT_EVIDENCE
4. GENERATE_AUDIT_TRAIL
5. PREPARE_AUDIT_REPORT
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. LOAD_VIOLATIONS

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

LOAD: violations from step-04
LOAD: compliance_data from step-04
LOAD: policies from step-02
LOAD: controls from step-02
STORE: audit_scope
VERIFY: audit_scope defined
```

## 2. EXECUTE_METHOD_328

```
IF Method 328 (Audit Trail Generator) available:
  EXECUTE: method_328.initialize()

  FOR each violation:
    EXECUTE: method_328.trace_event(violation)
    STORE: audit_event

  FOR each policy:
    EXECUTE: method_328.generate_compliance_log(policy)
    STORE: compliance_log

  OUTPUT:
```yaml
audit_trail_generation:
  method: "Method 328 - Audit Trail Generator"
  events_traced: E
  logs_generated: L
  trail_complete: TRUE
```

ELSE:
  EXECUTE: manual audit trail generation (section 4)
```

## 3. COLLECT_EVIDENCE

```
FOR each violation:
  IDENTIFY required evidence:
    - What action occurred?
    - Who performed the action?
    - When did it occur?
    - What was the result?
    - What policy was violated?
    - What control failed?

  COLLECT evidence artifacts:

    LOGS:
      EXTRACT: Relevant log entries
        - Authentication logs
        - Access logs
        - Application logs
        - System logs
        - Audit logs

      FOR each log:
        VERIFY: Timestamp integrity
        VERIFY: Log completeness
        VERIFY: Log authenticity
        STORE: log_evidence

    CONFIGURATIONS:
      CAPTURE: System configuration state
        - Security settings
        - Access control rules
        - Policy configurations
        - Network configurations

      FOR each configuration:
        COMPUTE: Hash for integrity
        STORE: configuration_snapshot

    TRANSACTIONS:
      TRACE: Transaction chain
        - Request details
        - Processing steps
        - Decision points
        - Response details

      FOR each transaction:
        LINK: To policy evaluation
        STORE: transaction_evidence

    COMMUNICATIONS:
      COLLECT: Relevant communications
        - Approval requests
        - Exception approvals
        - Incident notifications
        - Status updates

      FOR each communication:
        VERIFY: Authenticity
        REDACT: Sensitive information
        STORE: communication_evidence

    METADATA:
      EXTRACT: Contextual information
        - User identity
        - Source IP/location
        - Device information
        - Application version
        - Environment details

  CREATE evidence record:
```yaml
evidence:
  evidence_id: EVD-001
  violation_id: VIO-001
  evidence_type: LOG | CONFIGURATION | TRANSACTION | COMMUNICATION | METADATA
  source: "[system/file/database]"
  timestamp: "[timestamp]"
  hash: "[SHA-256 hash]"
  chain_of_custody:
    - collected_by: "[who]"
      collected_at: "[timestamp]"
      collection_method: "[how]"
    - verified_by: "[who]"
      verified_at: "[timestamp]"
  artifact: "[evidence content or reference]"
```

REQUIREMENT: Collect evidence for ALL violations
VIOLATION: Collecting evidence for "critical" violations only is VIOLATION
```

## 4. GENERATE_AUDIT_TRAIL

```
FOR each policy:
  CREATE policy audit trail:

    TRACE policy lifecycle:
      - Policy creation (from step-02)
      - Policy approval (who, when)
      - Policy activation (when enforcement started)
      - Policy evaluations (how many times evaluated)
      - Policy violations (count, details)
      - Policy modifications (changes over time)

    RECORD compliance events:
```yaml
compliance_event:
  event_id: EVT-001
  policy_id: POL-001
  event_type: EVALUATION | VIOLATION | COMPLIANCE | MODIFICATION
  timestamp: "[timestamp]"
  actor: "[who/what triggered event]"
  action: "[what happened]"
  result: COMPLIANT | NON_COMPLIANT | ERROR
  evidence_ids: [EVD-001, EVD-002]
  metadata:
    source_system: "[system]"
    context: "[additional context]"
```

    COMPUTE policy metrics:
      - Total evaluations
      - Compliance rate = compliant_events / total_evaluations
      - Violation count
      - Mean time to detect violation
      - Mean time to remediate violation

FOR each control:
  CREATE control audit trail:

    TRACE control lifecycle:
      - Control implementation (from step-03)
      - Control verification (test results)
      - Control activation (when monitoring started)
      - Control effectiveness (metrics)
      - Control failures (when violations occurred despite control)

    RECORD control events:
```yaml
control_event:
  event_id: EVT-002
  control_id: CTL-001
  event_type: IMPLEMENTATION | VERIFICATION | ACTIVATION | DETECTION | FAILURE
  timestamp: "[timestamp]"
  status: SUCCESS | FAILURE | WARNING
  details: "[event details]"
  evidence_ids: [EVD-003]
```

FOR each violation:
  CREATE violation audit trail:

    TRACE violation lifecycle:
      - Detection (when, how)
      - Classification (severity assigned)
      - Investigation (evidence collected)
      - Notification (who was notified)
      - Remediation (actions taken)
      - Verification (remediation confirmed)
      - Closure (when resolved)

    RECORD violation events:
```yaml
violation_event:
  event_id: EVT-003
  violation_id: VIO-001
  event_type: DETECTED | CLASSIFIED | INVESTIGATED | NOTIFIED | REMEDIATED | VERIFIED | CLOSED
  timestamp: "[timestamp]"
  performed_by: "[who]"
  action_taken: "[what was done]"
  status: OPEN | IN_PROGRESS | RESOLVED | CLOSED
  evidence_ids: [EVD-001, EVD-002]
```

CHAIN events chronologically:
  SORT: All events by timestamp
  LINK: Related events
  VERIFY: Event chain integrity
  COMPUTE: Hash of complete audit trail
```

## 5. PREPARE_AUDIT_REPORT

```
COMPILE comprehensive audit report:

SECTION 1: Executive Summary
  SUMMARIZE:
    - Audit period
    - Policies in scope
    - Total violations detected
    - Critical violations
    - Overall compliance rate
    - Key findings

SECTION 2: Compliance Status
  FOR each policy:
    REPORT:
```yaml
policy_compliance:
  policy_id: POL-001
  policy_name: "[name]"
  requirement_id: REQ-001
  evaluations: N
  violations: V
  compliance_rate: "[percentage]"
  status: COMPLIANT | NON_COMPLIANT | PARTIALLY_COMPLIANT
  evidence_count: E
```

SECTION 3: Violations Summary
  FOR each violation:
    REPORT:
```yaml
violation_summary:
  violation_id: VIO-001
  policy_id: POL-001
  severity: CRITICAL | HIGH | MEDIUM | LOW
  detected_at: "[timestamp]"
  status: OPEN | RESOLVED | CLOSED
  remediation_time: "[duration]"
  evidence_ids: [EVD-001, EVD-002]
```

  GROUP violations:
    BY severity
    BY policy
    BY recurrence
    BY status

  COMPUTE statistics:
    - Total violations
    - Violations by severity
    - Recurring violations
    - Open violations
    - Mean time to remediate

SECTION 4: Control Effectiveness
  FOR each control:
    REPORT:
```yaml
control_effectiveness:
  control_id: CTL-001
  policy_id: POL-001
  implementation_status: IMPLEMENTED | FAILED
  verification_status: VERIFIED | FAILED
  effectiveness_metric: "[value]"
  effectiveness_target: "[target]"
  effectiveness_rating: EFFECTIVE | PARTIALLY_EFFECTIVE | INEFFECTIVE
  failures: "[count]"
```

SECTION 5: Evidence Inventory
  LIST all evidence:
```yaml
evidence_inventory:
  total_evidence_items: N
  evidence_types:
    logs: L
    configurations: C
    transactions: T
    communications: M
  integrity_verified: TRUE | FALSE
  chain_of_custody_complete: TRUE | FALSE
```

SECTION 6: Audit Trail
  INCLUDE:
    - Complete event timeline
    - Evidence references
    - Integrity hashes
    - Chain of custody records

SECTION 7: Recommendations
  FOR each finding:
    PROVIDE:
      - What needs improvement
      - Why it matters
      - How to remediate
      - Priority level

GENERATE report artifacts:
  - Full audit report (PDF/HTML)
  - Evidence package (ZIP)
  - Compliance certificates (for compliant policies)
  - Violation tickets (for remediation tracking)
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify audit completeness and accuracy
EXECUTE:
  1. COVERAGE CHECK:
     FOR each policy:
       VERIFY: Policy included in audit
       VERIFY: All evaluations captured
       IF missing_data:
         INVESTIGATE: Data gaps
         COLLECT: Missing evidence
         UPDATE: Audit trail
       IF complete:
         CONFIRM: Coverage complete

  2. EVIDENCE CHECK:
     FOR each violation:
       VERIFY: Evidence collected
       VERIFY: Evidence integrity (hash matches)
       VERIFY: Chain of custody complete
       IF evidence_incomplete:
         MARK: insufficient_evidence = TRUE
         COLLECT: Additional evidence
       IF evidence_complete:
         CONFIRM: Evidence sufficient

  3. TIMELINE CHECK:
     REVIEW: Event chronology
     VERIFY: Timestamps logical
     VERIFY: No gaps in timeline
     IF timeline_inconsistency:
       INVESTIGATE: Discrepancies
       CORRECT: Timeline errors
     IF consistent:
       CONFIRM: Timeline accurate

  4. CALCULATION CHECK:
     RECOMPUTE: All metrics and statistics
     VERIFY: Calculations correct
     IF calculation_error:
       CORRECT: Errors
       UPDATE: Report
     IF correct:
       CONFIRM: Metrics accurate

  5. COMPLETENESS CHECK:
     VERIFY: All required sections present
     VERIFY: All references resolvable
     VERIFY: All evidence accessible
     IF incomplete:
       COMPLETE: Missing sections
     IF complete:
       CONFIRM: Report complete

  6. REPORT:
     "Counter-check executed"
     "Evidence gaps filled: E"
     "Timeline corrections: T"
     "Calculation corrections: C"
     "Completeness confirmed: YES/NO"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Violations loaded from GATE_4?
□ Method 328 executed OR manual audit trail generation complete?
□ Evidence collected for ALL violations?
□ Audit trail generated for ALL policies and controls?
□ Audit report prepared with all required sections?
□ Evidence integrity verified (hashes checked)?
□ Chain of custody documented?
□ Counter-check executed?
□ All evidence accessible and complete?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## 8. GATE_5

```
EVALUATE:
  audit_trail_generated = TRUE
  evidence_count >= violations_count
  counter_check_executed = TRUE
  report_complete = TRUE

COUNT:
  total_evidence = COUNT(evidence_id)
  total_violations = FROM step-04
  evidence_integrity_verified = WHERE hash_verified = TRUE
  chain_of_custody_complete = WHERE custody_documented = TRUE

IF all TRUE AND evidence_count >= violations_count:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - evidence = E, violations = V, audit_trail_complete = TRUE"
  PROCEED to workflow.md for next step

IF any FALSE OR evidence_count < violations_count:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  OUTPUT: "Evidence shortfall: [violations_count - evidence_count]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without evidence collection:
  HALT
  OUTPUT: "VIOLATION: Section 3 COLLECT_EVIDENCE required for ALL violations"
  RETURN to section 3

IF agent generates partial audit trail:
  HALT
  OUTPUT: "VIOLATION: Section 4 requires complete audit trail for ALL policies"
  RETURN to section 4

IF agent skips report preparation:
  HALT
  OUTPUT: "VIOLATION: Section 5 PREPARE_AUDIT_REPORT required"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
