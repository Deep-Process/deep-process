# Deep-Plan Workflow

## ENFORCED SEQUENCE

```
STEP 0: LOAD_INPUTS       → GATE_0
STEP 1: DECOMPOSE         → GATE_1
STEP 2: SEQUENCE          → GATE_2
STEP 3: ALLOCATE          → GATE_3
STEP 4: INTEGRATE_RISKS   → GATE_4
STEP 5: VALIDATE          → GATE_5
STEP 6: BASELINE          → GATE_6
```

**VIOLATION RECOVERY:**
```
IF agent skips step → HALT
OUTPUT: "VIOLATION: Step X required"
RETURN: To step X
```

## EXECUTION

```yaml
PRECONDITION: Files exist
  - architecture-comprehensive.md
  - risk-report.md
  - tradeoff-analysis.yaml

IF any file missing:
  HALT
  OUTPUT: "Missing required input: [filename]"

EXECUTE: steps/step-00-load-inputs.md
WAIT: GATE_0 = OPEN

EXECUTE: steps/step-01-decompose.md
WAIT: GATE_1 = OPEN

EXECUTE: steps/step-02-sequence.md
WAIT: GATE_2 = OPEN

EXECUTE: steps/step-03-allocate.md
WAIT: GATE_3 = OPEN

EXECUTE: steps/step-04-integrate-risks.md
WAIT: GATE_4 = OPEN

EXECUTE: steps/step-05-validate.md
WAIT: GATE_5 = OPEN

EXECUTE: steps/step-06-baseline.md
WAIT: GATE_6 = OPEN

OUTPUT: "Deep-plan complete. GATE_6 OPEN."
OUTPUT: "Artifacts: implementation-plan.yaml, sprint-backlog-01.yaml"
```

## ADAPTIVE RE-PLANNING MODE

```yaml
TRIGGER: execution-status.yaml updated

PRECONDITION: baseline-plan.yaml exists
IF NOT exists → HALT: "Run initial planning first"

EXECUTE: steps/step-06-replan.md
OUTPUT: implementation-plan-v{N}.yaml
```
