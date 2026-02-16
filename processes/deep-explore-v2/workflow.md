# Deep Explore V2 — Execution Program

## ENTRY

```
READ: steps/step-00-ground.md
EXECUTE: ENFORCED SEQUENCE FROM step file
EVALUATE: GATE_0
IF GATE_0 = OPEN → READ steps/step-01-extract.md
IF GATE_0 = CLOSED → HALT
```

## EXECUTION SEQUENCE

### PHASE 0: GROUND
```
PRECONDITION: NONE
FILE: steps/step-00-ground.md
GATE: GATE_0
VIOLATION: Reading step-01 before GATE_0 = OPEN is VIOLATION
```

### PHASE 1: EXTRACT
```
PRECONDITION: GATE_0 = OPEN
FILE: steps/step-01-extract.md
GATE: GATE_1
VIOLATION: Reading step-02 before GATE_1 = OPEN is VIOLATION
```

### PHASE 2: RESEARCH
```
PRECONDITION: GATE_1 = OPEN
FILE: steps/step-02-research.md
GATE: GATE_2
VIOLATION: Reading step-03 before GATE_2 = OPEN is VIOLATION
```

### PHASE 3: MAP
```
PRECONDITION: GATE_2 = OPEN
FILE: steps/step-03-map.md
GATE: GATE_3
VIOLATION: Reading step-04 before GATE_3 = OPEN is VIOLATION
```

### PHASE 4: DEEPEN
```
PRECONDITION: GATE_3 = OPEN
FILE: steps/step-04-deepen.md
GATE: GATE_4
VIOLATION: Reading step-05 before GATE_4 = OPEN is VIOLATION
```

### PHASE 5: CHALLENGE
```
PRECONDITION: GATE_4 = OPEN
FILE: steps/step-05-challenge.md
GATE: GATE_5
VIOLATION: Reading step-06 before GATE_5 = OPEN is VIOLATION
```

### PHASE 6: SYNTHESIZE
```
PRECONDITION: GATE_5 = OPEN
FILE: steps/step-06-synthesize.md
GATE: GATE_6
VIOLATION: Reading step-07 before GATE_6 = OPEN is VIOLATION
```

### PHASE 7: RENDER
```
PRECONDITION: GATE_6 = OPEN
FILE: steps/step-07-render.md
GATE: GATE_7
VIOLATION: Proceeding before GATE_7 = OPEN is VIOLATION
```

## GATES

GATE_0: ground-state.yaml EXISTS AND assumptions_declared = true
GATE_1: knowledge-gaps.yaml EXISTS AND ALL gaps classified
GATE_2: research-results.yaml EXISTS AND EVERY queued gap addressed
GATE_3: option-map.yaml EXISTS AND options >= 2
GATE_4: consequence-map.yaml EXISTS AND EVERY option analyzed
GATE_5: challenge-results.yaml EXISTS AND EVERY critical assumption validated
GATE_6: synthesis.yaml EXISTS AND coherence = true
GATE_7: exploration-report.md EXISTS AND coverage >= target

## VIOLATION HANDLING

IF agent reads step N before GATE_(N-1) = OPEN:
  HALT execution
  OUTPUT: "VIOLATION: GATE_(N-1) not open"
  RETURN to step (N-1)

IF agent skips counter-check:
  HALT execution
  OUTPUT: "VIOLATION: Counter-check required in every phase"
  EXECUTE counter-check

IF agent skips checklist:
  HALT execution
  OUTPUT: "VIOLATION: Checklist required after every phase"
  EXECUTE checklist

IF agent proceeds without SCOPE_REDUCTION declaration:
  HALT execution
  OUTPUT: "VIOLATION: Cannot skip gate conditions without SCOPE_REDUCTION"
  DECLARE scope reduction OR complete gate condition
