---
step: 3
name: QUANTIFY
phase: QUANTIFY
gate: GATE_3
time_estimate: "45-75 min"
goal: "Score ALL risks with 5D framework (P/I/V/D/R)"
requires_completion: true
next_steps: ["step-04-interact"]
data_dependencies: [VERTICAL_RISK_INVENTORY, HORIZONTAL_RISK_INVENTORY]
outputs: [RISK_SCORES, EXPOSURE_WINDOWS, COST_ESTIMATES, WORST_CASE_SCENARIOS, ERGODICITY_TEST, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 03: QUANTIFY

**PRECONDITION:** GATE_2 = OPEN OR (depth=quick AND GATE_1=OPEN)

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A3-01
    assumption: "Probability estimates based on [precedent/expert judgment]"
  - id: A3-02
    assumption: "Impact estimates use [methodology]"
  - id: A3-03
    assumption: "5D scoring thresholds: P>0.5=HIGH, I>$100k=HIGH, etc."
```

---

## ENFORCED SEQUENCE

### 3.1 Five-Dimension Scoring (Method #201)

**Extract:** For EVERY risk, score 5 dimensions.

```
RISK: [ID]
  Probability (P): 0.0-1.0 [likelihood of occurrence]
  Impact (I): LOW | MEDIUM | HIGH | CRITICAL [$amount OR severity]
  Velocity (V): SLOW | MEDIUM | FAST | INSTANT [how quickly materializes]
  Detectability (D): EASY | MEDIUM | HARD | IMPOSSIBLE [can we catch early?]
  Reversibility (R): EASY | MEDIUM | HARD | IRREVERSIBLE [can we undo damage?]

Composite Score: [formula from data/risk-scoring.yaml]
```

**Verify:** ALL risks from GATE_1 + GATE_2 scored.
**Render:** `risk-scores.yaml`

### 3.2 Exposure Window Analysis (Method #202)
**Extract:** WHEN vulnerable, HOW LONG exposed (for top 10).
**Render:** `exposure-windows.yaml`

### 3.3 Cost Estimation (Method #203)
**Extract:** Concrete $ or time impact if materialized (for top 10).
**Render:** `cost-estimates.yaml`

### 3.4 Worst-Case Construction (Method #205)
**Extract:** Full narrative for top 5 risks.
**Render:** `worst-case-scenarios.yaml`

### 3.5 Ergodicity Test (Method #206)
**Extract:** Non-ergodic risks (game over if hit — can't average).
**Render:** `ergodicity-test.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "5D scores for ALL risks (100% coverage)"
    status: PASS | FAIL
  - item: "Exposure windows (top 10)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Cost estimates (top 10, concrete numbers)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Worst-case scenarios (top 5)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Ergodicity tested (high-impact risks)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥3)"
    status: PASS | FAIL
  - item: "Counter-checks (CC3-01, CC3-02, CC3-03)"
    status: PASS | FAIL
  - item: "Scores coherent (no contradictory scores)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC3-01:** Sample 3 scores → verify evidence/rationale.
**CC3-02:** Re-scan risk list → verify no phantoms added during scoring.
**CC3-03:** Coherence check → verify scores coherent (High I + Low R = CRITICAL).

---

## GATE_3 EVALUATION

**Conditions:** G3-01 through G3-08 from gates.yaml
**IF GATE_3 PASS → proceed to step-04.**

---

## NEXT STEP

**Read tool:** `steps/step-04-interact.md`
**PRECONDITION:** GATE_3 = OPEN
