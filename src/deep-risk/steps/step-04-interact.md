---
step: 4
name: INTERACT
phase: INTERACT
gate: GATE_4
time_estimate: "30-60 min"
goal: "Analyze risk interactions (cascades, correlations, common-mode failures)"
requires_completion: true
next_steps: ["step-05-mitigate"]
data_dependencies: [RISK_SCORES]
outputs: [RISK_CASCADES, CORRELATION_MATRIX, COMMON_MODE_FAILURES, CONCENTRATION_RISKS, COMPOUND_SCENARIOS, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 04: INTERACT

**PRECONDITION:** GATE_3 = OPEN
**IF depth=quick → skip to step-05-mitigate**

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A4-01
    assumption: "Independence assumptions: [list risks assumed independent]"
  - id: A4-02
    assumption: "Cascade thresholds: failure of [A] triggers [B] if [condition]"
```

---

## ENFORCED SEQUENCE

### 4.1 Risk Cascade Mapping (Method #301)
**Extract:** Which risks trigger others? Build cascade graph.
**Verify:** Each cascade link has causal mechanism.
**Render:** `risk-cascades.yaml`

### 4.2 Risk Correlation Matrix (Method #302)
**Extract:** NxN matrix — which risks materialize simultaneously?
**Verify:** Correlations justified (shared drivers).
**Render:** `risk-correlation-matrix.yaml`

### 4.3 Common-Mode Failure Detection (Method #303)
**Extract:** Single points whose failure breaks multiple systems.
**Verify:** ≥1 common-mode identified OR "none exist" declared.
**Render:** `common-mode-failures.yaml`

### 4.4 Concentration Risk Detection (Method #304)
**Extract:** Excessive dependency on single entity.
**Verify:** Concentration > threshold flagged.
**Render:** `concentration-risks.yaml`

### 4.5 Compound Risk Scenarios (Method #305)
**Extract:** Realistic multi-risk combinations.
**Render:** `compound-scenarios.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Cascade graph (≥3 chains)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Correlation matrix (NxN)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Common-mode failures (≥1 OR none declared)"
    status: PASS | FAIL
  - item: "Concentration risks identified"
    status: PASS | FAIL
  - item: "Compound scenarios (≥2)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥2)"
    status: PASS | FAIL
  - item: "Counter-checks (CC4-01, CC4-02, CC4-03)"
    status: PASS | FAIL
  - item: "Interaction map coherent (no circular dependencies without justification)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC4-01:** Sample 3 cascade chains → verify each link has causal mechanism.
**CC4-02:** Re-scan interactions → verify not hallucinated.
**CC4-03:** Coherence check → verify cascade graph coherent (DAG OR cycles documented).

---

## GATE_4 EVALUATION

**Conditions:** G4-01 through G4-07 from gates.yaml
**IF GATE_4 PASS → proceed to step-05.**

---

## NEXT STEP

**Read tool:** `steps/step-05-mitigate.md`
**PRECONDITION:** GATE_4 = OPEN OR (depth=quick AND GATE_3=OPEN)
