# Deep-Compliance Execution Program

## ENTRY

```
READ: steps/step-01-inventory.md
EXECUTE: step-01-inventory.md ENFORCED SEQUENCE
EVALUATE: GATE_1
IF GATE_1 = OPEN → READ steps/step-02-map.md
IF GATE_1 = CLOSED → HALT
```

## EXECUTION SEQUENCE

### STEP 1: INVENTORY
```
PRECONDITION: NONE
FILE: steps/step-01-inventory.md
GATE: GATE_1
VIOLATION: Reading step-02 before GATE_1 = OPEN is VIOLATION
```

### STEP 2: MAP
```
PRECONDITION: GATE_1 = OPEN
FILE: steps/step-02-map.md
GATE: GATE_2
VIOLATION: Reading step-03 before GATE_2 = OPEN is VIOLATION
```

### STEP 3: ANALYZE
```
PRECONDITION: GATE_2 = OPEN
FILE: steps/step-03-analyze.md
GATE: GATE_3
VIOLATION: Reading step-04 before GATE_3 = OPEN is VIOLATION
```

### STEP 4: COLLECT
```
PRECONDITION: GATE_3 = OPEN
FILE: steps/step-04-collect.md
GATE: GATE_4
VIOLATION: Reading step-05 before GATE_4 = OPEN is VIOLATION
```

### STEP 5: PLAN
```
PRECONDITION: GATE_4 = OPEN
FILE: steps/step-05-plan.md
GATE: GATE_5
VIOLATION: Reading step-06a before GATE_5 = OPEN is VIOLATION
```

### STEP 6A: COMPILE
```
PRECONDITION: GATE_5 = OPEN
FILE: steps/step-06a-compile.md
GATE: GATE_6A
VIOLATION: Reading step-06b before GATE_6A = OPEN is VIOLATION
```

### STEP 6B: CALCULATE
```
PRECONDITION: GATE_6A = OPEN
FILE: steps/step-06b-calculate.md
GATE: GATE_6B
VIOLATION: Reading step-06c before GATE_6B = OPEN is VIOLATION
```

### STEP 6C: REPORT
```
PRECONDITION: GATE_6B = OPEN
FILE: steps/step-06c-report.md
GATE: GATE_6
VIOLATION: Proceeding before GATE_6 = OPEN is VIOLATION
```

## GATES

GATE_1: systems_identified = TRUE AND capabilities_count >= 3 AND counter_check_executed = TRUE
GATE_2: requirements_mapped >= 90% AND mapping_verified = TRUE AND counter_check_executed = TRUE
GATE_3: gaps_classified = TRUE AND severity_assigned = TRUE AND counter_check_executed = TRUE
GATE_4: evidence_collected >= covered_requirements_count AND evidence_verified = TRUE AND counter_check_executed = TRUE
GATE_5: remediation_plans >= critical_gaps_count AND timeline_realistic = TRUE AND counter_check_executed = TRUE
GATE_6A: findings_compiled = TRUE AND metrics_aggregated = TRUE AND counter_check_executed = TRUE
GATE_6B: compliance_calculated = TRUE AND level_classified = TRUE AND counter_check_executed = TRUE
GATE_6: deliverables_generated = 6 AND all_files_verified = TRUE AND counter_check_executed = TRUE

## VIOLATION HANDLING

IF agent reads step N before GATE_(N-1) = OPEN:
  HALT execution
  OUTPUT: "VIOLATION: GATE_(N-1) not open"
  RETURN to step (N-1)

IF agent skips counter-check:
  HALT execution
  OUTPUT: "VIOLATION: Counter-check required"
  EXECUTE counter-check

IF agent proceeds without system inventory:
  HALT execution
  OUTPUT: "VIOLATION: System inventory required before mapping"
  RETURN to STEP 1
