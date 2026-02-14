# Deep-Monitoring — Execution Program

> **LOAD AND EXECUTE:** Sequential process execution with binding gates.

---

## ENTRY

```
READ: steps/step-00-setup.md
EXECUTE: ENFORCED SEQUENCE
EVALUATE: GATE_0
IF GATE_0 = OPEN → READ steps/step-01-collect.md
IF GATE_0 = CLOSED → HALT
```

---

## EXECUTION SEQUENCE

### STEP 0: SETUP
```
PRECONDITION: NONE
FILE: steps/step-00-setup.md
GATE: GATE_0
VIOLATION: Reading step-01 before GATE_0 = OPEN is VIOLATION
```

### STEP 1: COLLECT
```
PRECONDITION: GATE_0 = OPEN
FILE: steps/step-01-collect.md
GATE: GATE_1
VIOLATION: Reading step-02 before GATE_1 = OPEN is VIOLATION
```

### STEP 2: ANALYZE
```
PRECONDITION: GATE_1 = OPEN
FILE: steps/step-02-analyze.md
GATE: GATE_2
VIOLATION: Reading step-03 before GATE_2 = OPEN is VIOLATION
```

### STEP 3: DETECT
```
PRECONDITION: GATE_2 = OPEN
FILE: steps/step-03-detect.md
GATE: GATE_3
VIOLATION: Reading step-04 before GATE_3 = OPEN is VIOLATION
```

### STEP 4: ASSESS
```
PRECONDITION: GATE_3 = OPEN
FILE: steps/step-04-assess.md
GATE: GATE_4
VIOLATION: Reading step-05 before GATE_4 = OPEN is VIOLATION
```

### STEP 5: REPORT
```
PRECONDITION: GATE_4 = OPEN
FILE: steps/step-05-report.md
GATE: GATE_5
VIOLATION: Proceeding before GATE_5 = OPEN is VIOLATION
```

---

## GATES

```
GATE_0: monitoring_scope_defined = TRUE AND target_artifacts_identified = TRUE AND counter_check_executed = TRUE
GATE_1: artifacts_collected = TRUE AND data_quality_verified = TRUE AND counter_check_executed = TRUE
GATE_2: execution_quality_scored = TRUE AND metrics_calculated = TRUE AND counter_check_executed = TRUE
GATE_3: violations_detected = TRUE AND anomalies_classified = TRUE AND counter_check_executed = TRUE
GATE_4: severity_assessed = TRUE AND impact_evaluated = TRUE AND counter_check_executed = TRUE
GATE_5: report_generated = TRUE AND all_sections_filled = TRUE AND counter_check_executed = TRUE
```

---

## VIOLATION HANDLING

```
IF agent reads step N before GATE_(N-1) = OPEN:
  HALT execution
  OUTPUT: "VIOLATION: GATE_(N-1) not open"
  RETURN to step (N-1)

IF agent skips counter-check:
  HALT execution
  OUTPUT: "VIOLATION: Counter-check required"
  EXECUTE counter-check

IF agent proceeds without artifact collection:
  HALT execution
  OUTPUT: "VIOLATION: Artifact collection required before analysis"
  RETURN to STEP 1
```

---

## SCOPE_REDUCTION_PROTOCOL

```
IF agent cannot complete required action:
  DECLARE:
    what_omitted: "[exact description]"
    why: "[technical/resource reason]"
    impact: "[what monitoring quality loses]"
    user_approved: YES/NO

  IF user_approved = NO:
    HALT
    REQUEST approval

  IF user_approved = YES:
    LOG in monitoring-log.yaml
    PROCEED with reduced scope
```

---

**VERSION:** 1.0.0 (Artifact-Based Post-Execution Monitoring)
