# Deep-Change Workflow

## ENFORCED SEQUENCE

```
PHASE 1: INTAKE           → GATE_1
PHASE 2: IMPACT_ANALYSIS  → GATE_2
PHASE 3: DECISION_REQUEST → GATE_3
PHASE 4: PLAN_UPDATE      → GATE_4
PHASE 5: VERIFICATION     → GATE_5
```

## EXECUTION

```yaml
TRIGGER: Change need detected FROM
  - blockers.yaml (deep-implement)
  - emergent-requirements.yaml (deep-requirements)
  - risk-materialized.yaml (deep-risk)
  - quality-gate-failures.yaml (deep-verify)
  - performance-anomalies.yaml (deep-monitor)

EXECUTE: steps/step-01-intake.md
WAIT: GATE_1 = OPEN

EXECUTE: steps/step-02-impact-analysis.md
WAIT: GATE_2 = OPEN

EXECUTE: steps/step-03-submit-to-governance.md
WAIT: GATE_3 = OPEN (governance decision received)

IF decision = APPROVED:
  EXECUTE: steps/step-04-update-plan.md
  WAIT: GATE_4 = OPEN

  EXECUTE: steps/step-05-verify-implementation.md
  WAIT: GATE_5 = OPEN

IF decision = REJECTED:
  EXECUTE: steps/step-06-close-rejected.md
  COMPLETE

IF decision = DEFERRED:
  EXECUTE: steps/step-07-schedule-revisit.md
  COMPLETE
```

## VIOLATION RECOVERY

```
IF agent skips impact analysis:
  HALT
  OUTPUT: "VIOLATION: Step 02 (impact analysis) required before governance submission"
  RETURN: To step-02

IF agent submits without recommendation:
  HALT
  OUTPUT: "VIOLATION: Impact analysis must include recommendation"
  RETURN: To step-02
```
