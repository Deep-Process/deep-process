# STEP 1: COLLECT

## ENFORCED SEQUENCE

```
1. LOAD_PROCESS_LOG
2. EXTRACT_GATE_RESULTS
3. EXTRACT_ASSUMPTIONS
4. EXTRACT_COUNTER_CHECKS
5. EXTRACT_SCOPE_REDUCTIONS
6. VERIFY_DATA_QUALITY
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_1
```

---

## 1. LOAD_PROCESS_LOG

```
PRECONDITION: GATE_0 = OPEN
IF GATE_0 ≠ OPEN → HALT with "ERROR: GATE_0 not open"

EXECUTE:
  READ: [output_directory]/process-log.yaml

  IF file NOT EXISTS:
    IF process_log_missing = TRUE (flagged in step-00):
      HALT with "CRITICAL: process-log.yaml missing, cannot monitor"
    ELSE:
      HALT with "ERROR: process-log.yaml not found"

  PARSE: process-log.yaml structure

  EXTRACT required fields:
    - process_name
    - process_version
    - execution_timestamp
    - depth (quick | standard | deep | comprehensive | critical)
    - current_phase
    - gate_results[]
    - assumptions[]
    - counter_checks[]
    - scope_reductions[]

  IF any required field MISSING:
    RECORD: incomplete_process_log = TRUE
    LOG: missing_fields = ["[field1]", "[field2]", ...]

STORE:
```yaml
process_metadata:
  name: "[name]"
  version: "[version]"
  timestamp: "[timestamp]"
  depth: "[depth]"
  current_phase: "[phase]"
  log_completeness: COMPLETE | INCOMPLETE
  missing_fields: ["[field]", ...] | []
```

REQUIREMENT: Process log loaded successfully.
VIOLATION: Cannot load process log = CRITICAL MONITORING FAILURE.
```

---

## 2. EXTRACT_GATE_RESULTS

```
EXTRACT gate pass/fail data from process-log.yaml.

FOR each gate in process:
  READ: gate_results[gate_id]

  EXTRACT:
    - gate_id: [GATE_0, GATE_1, GATE_2, ...]
    - status: OPEN | CLOSED | NOT_EVALUATED
    - timestamp: [when evaluated]
    - conditions_passed: [N]
    - conditions_failed: [M]
    - violations: ["[violation1]", "[violation2]", ...]

  STORE:
```yaml
gate_data:
  - gate_id: "[id]"
    status: OPEN | CLOSED | NOT_EVALUATED
    timestamp: "[timestamp]"
    conditions:
      passed: [N]
      failed: [M]
      total: [N+M]
    violations: ["[violation]", ...] | []
```

COUNT:
  total_gates = [number of gates in process]
  gates_passed = COUNT(status = OPEN)
  gates_failed = COUNT(status = CLOSED)
  gates_not_evaluated = COUNT(status = NOT_EVALUATED)

REQUIREMENT: All gates extracted.
VIOLATION: Missing gate data without SCOPE_REDUCTION = ERROR.
```

---

## 3. EXTRACT_ASSUMPTIONS

```
EXTRACT assumption declarations from process-log.yaml.

FOR each phase:
  READ: assumptions[phase_id]

  FOR each assumption:
    EXTRACT:
      - assumption_id: [A0-01, A1-01, ...]
      - assumption_text: "[what was assumed]"
      - type: INTERPRETIVE | CONTEXTUAL | DOMAIN | TECHNICAL
      - confidence: HIGH | MEDIUM | LOW
      - phase: [0-N]
      - status: VERIFIED | SURVIVED | FALSIFIED | UNTESTED

  STORE:
```yaml
assumptions_data:
  - assumption_id: "[id]"
    text: "[assumption]"
    type: "[type]"
    confidence: "[level]"
    phase: [N]
    status: VERIFIED | SURVIVED | FALSIFIED | UNTESTED
```

COUNT:
  total_assumptions = COUNT(assumptions)
  assumptions_per_phase = GROUP_BY(phase)
  verified_assumptions = COUNT(status = VERIFIED)
  falsified_assumptions = COUNT(status = FALSIFIED)

REQUIREMENT: All assumptions extracted.
VIOLATION: Missing assumptions for phase without SCOPE_REDUCTION = ERROR.
```

---

## 4. EXTRACT_COUNTER_CHECKS

```
EXTRACT counter-check execution data from process-log.yaml.

FOR each phase:
  READ: counter_checks[phase_id]

  FOR each counter-check:
    EXTRACT:
      - check_id: [CC0-01, CC1-01, ...]
      - check_description: "[what was checked]"
      - claim_tested: "[original claim]"
      - counter_hypothesis: "[alternative explanation]"
      - result: CONFIRMED | WEAKENED | REFUTED
      - action_taken: "[what changed]"
      - phase: [0-N]

  STORE:
```yaml
counter_check_data:
  - check_id: "[id]"
    description: "[what checked]"
    claim: "[original claim]"
    counter_hypothesis: "[alternative]"
    result: CONFIRMED | WEAKENED | REFUTED
    action: "[action taken]"
    phase: [N]
```

COUNT:
  total_counter_checks = COUNT(counter_checks)
  counter_checks_per_phase = GROUP_BY(phase)
  claims_confirmed = COUNT(result = CONFIRMED)
  claims_weakened = COUNT(result = WEAKENED)
  claims_refuted = COUNT(result = REFUTED)

REQUIREMENT: All counter-checks extracted.
VIOLATION: Missing counter-checks for phase = QUALITY VIOLATION.
```

---

## 5. EXTRACT_SCOPE_REDUCTIONS

```
EXTRACT scope reduction declarations from process-log.yaml.

READ: scope_reductions[]

FOR each scope reduction:
  EXTRACT:
    - reduction_id: [SR-01, SR-02, ...]
    - what_omitted: "[exact description]"
    - why: "[reason for omission]"
    - impact_assessment: "[what quality loses]"
    - phase: [0-N]
    - user_approved: YES | NO
    - criticality: CRITICAL | REQUIRED | OPTIONAL

  STORE:
```yaml
scope_reduction_data:
  - reduction_id: "[id]"
    omitted: "[what]"
    reason: "[why]"
    impact: "[impact]"
    phase: [N]
    user_approved: YES | NO
    criticality: CRITICAL | REQUIRED | OPTIONAL
```

COUNT:
  total_scope_reductions = COUNT(scope_reductions)
  critical_omissions = COUNT(criticality = CRITICAL)
  unapproved_omissions = COUNT(user_approved = NO)

REQUIREMENT: All scope reductions extracted.
VIOLATION: Unapproved CRITICAL omission = PROCESS VIOLATION.
```

---

## 6. VERIFY_DATA_QUALITY

```
VALIDATE extracted data for completeness and consistency.

EXECUTE:

  1. COMPLETENESS CHECK:
     FOR each required data type:
       IF gate_data is EMPTY:
         FLAG: missing_gate_data = TRUE
       IF assumptions_data is EMPTY:
         FLAG: missing_assumptions = TRUE
       IF counter_check_data is EMPTY:
         FLAG: missing_counter_checks = TRUE

     IF any flag TRUE:
       ASSESS criticality:
         IF monitoring_scope = GATE_ONLY:
           missing_gate_data = CRITICAL
           missing_assumptions = REQUIRED
           missing_counter_checks = REQUIRED
         IF monitoring_scope = COMPREHENSIVE:
           missing_gate_data = CRITICAL
           missing_assumptions = CRITICAL
           missing_counter_checks = CRITICAL

  2. CONSISTENCY CHECK:
     VERIFY:
       gates_passed + gates_failed + gates_not_evaluated = total_gates

     IF NOT equal:
       FLAG: gate_count_mismatch = TRUE
       RECORD: expected=[total_gates], actual=[sum]

  3. TIMESTAMP CHECK:
     FOR each gate:
       IF gate.timestamp is MISSING:
         FLAG: missing_timestamp = TRUE
       IF gate.timestamp > current_time:
         FLAG: future_timestamp = TRUE (clock skew or error)

RECORD:
```yaml
data_quality:
  completeness:
    gate_data: COMPLETE | INCOMPLETE
    assumptions: COMPLETE | INCOMPLETE
    counter_checks: COMPLETE | INCOMPLETE
  consistency:
    gate_count: CONSISTENT | MISMATCH
  timestamp_validity: VALID | INVALID
  quality_flags:
    - flag: "[flag_name]"
      severity: CRITICAL | REQUIRED | OPTIONAL
```

REQUIREMENT: Data quality verified.
VIOLATION: CRITICAL data missing without SCOPE_REDUCTION = HALT.
```

---

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify data collection accuracy.

EXECUTE:
  1. EXTRACTION_ACCURACY_CHECK:
     SELECT: 3 random gates
     FOR each gate:
       RE-READ: Raw YAML for gate data
       COMPARE: Extracted data vs raw data
       IF mismatch:
         FLAG: extraction_error = TRUE
         RECORD: Details of mismatch
       IF match:
         CONFIRM: Extraction accurate

  2. MISSING_DATA_CHECK:
     ASK: "Are there data points in process-log.yaml we should monitor but didn't extract?"
     SCAN: Unextracted fields
     IF found relevant fields:
       EVALUATE: Should these be extracted?
       IF YES: ADD to extraction list, re-extract
     IF no relevant fields:
       CONFIRM: Extraction complete

  3. DATA_QUALITY_THRESHOLD_CHECK:
     COMPARE: data_quality results vs thresholds
     IF completeness below threshold:
       FLAG: insufficient_data = TRUE
       ASSESS: Can monitoring continue?
       IF NO: HALT with SCOPE_REDUCTION required
       IF YES: PROCEED with quality caveat

RECORD:
```yaml
counter_checks:
  - check_id: CC1-01
    check: "Extraction accuracy"
    result: PASSED | FAILED
    errors: [N]
  - check_id: CC1-02
    check: "Missing data identification"
    result: PASSED | ADJUSTED
    fields_added: ["[field]", ...] | []
  - check_id: CC1-03
    check: "Quality threshold"
    result: PASSED | INSUFFICIENT
    action: "[proceed with caveat | HALT]"
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Process log loaded from output_directory?
□ Gate results extracted (all gates)?
□ Assumptions extracted (all phases)?
□ Counter-checks extracted (all phases)?
□ Scope reductions extracted (all)?
□ Data quality verified (completeness, consistency, timestamps)?
□ Counter-checks executed (all 3)?
□ Data quality meets threshold OR SCOPE_REDUCTION declared?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

---

## 9. GATE_1

```
EVALUATE:
  artifacts_collected = TRUE
  data_quality_verified = TRUE
  counter_check_executed = TRUE

COUNT:
  gates_extracted = [N]
  assumptions_extracted = [N]
  counter_checks_extracted = [N]
  data_quality_flags = [N]

IF all TRUE AND data_quality_flags.CRITICAL = 0:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - data collected, gates=[N], assumptions=[N], checks=[N]"
  PROCEED to workflow.md for next step

IF any FALSE OR data_quality_flags.CRITICAL > 0:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading process log:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_PROCESS_LOG required"
  RETURN to section 1

IF agent proceeds without extracting gates:
  HALT
  OUTPUT: "VIOLATION: Section 2 EXTRACT_GATE_RESULTS required"
  RETURN to section 2

IF agent skips data quality verification:
  HALT
  OUTPUT: "VIOLATION: Section 6 VERIFY_DATA_QUALITY required"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
