---
step: 2
name: IDENTIFY_HORIZONTAL
phase: IDENTIFY_HORIZONTAL
gate: GATE_2
time_estimate: "30-60 min"
goal: "Discover boundary and systemic risks through horizontal scanning"
requires_completion: true
next_steps: ["step-03-quantify"]
data_dependencies: [VERTICAL_RISK_INVENTORY]
outputs: [BOUNDARY_SCAN, BLIND_SPOTS, TEMPORAL_RISKS, SCENARIO_MATRIX, HORIZONTAL_RISK_INVENTORY, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 02: IDENTIFY_HORIZONTAL

**PRECONDITION:** GATE_1 = OPEN
**IF depth=quick → skip to step-03-quantify**

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A2-01
    assumption: "Boundaries defined as [list] based on [architecture]"
  - id: A2-02
    assumption: "Temporal scope [duration] captures drift/accumulation risks"
```

---

## ENFORCED SEQUENCE

### 2.1 Boundary Risk Scan (Method #108)
**Extract:** Identify risks at interfaces, handoffs, trust boundaries.
**Verify:** All boundaries from architecture mapped.
**Render:** `boundary-scan.yaml`

### 2.2 Blind Spot Interrogation (Method #109)
**Extract:** Known Unknowns (gaps we know exist) + Unknown Knowns (denial).
**Verify:** Stakeholders consulted.
**Render:** `blind-spots.yaml`

### 2.3 Temporal Risk Archaeology (Method #111)
**Extract:** Drift, accumulation, decay, erosion risks.
**Verify:** Timeframe coherent with step-00.
**Render:** `temporal-risks.yaml`

### 2.4 Scenario Planning (Method #112)
**Extract:** 2×2 matrix from key uncertainties → 4 scenarios.
**Verify:** Scenarios genuinely different (not variations).
**Render:** `scenario-matrix.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Boundary scan (≥3 boundary risks)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Blind spots interrogated"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Temporal risks (≥1 identified)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Scenario planning (4 scenarios)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥2)"
    status: PASS | FAIL
  - item: "Counter-checks (CC2-01, CC2-02, CC2-03)"
    status: PASS | FAIL
  - item: "Horizontal inventory consolidated"
    status: PASS | FAIL
  - item: "Coherence with vertical (no contradictions)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC2-01:** Sample 3 boundary risks → verify concrete interface/handoff.
**CC2-02:** Re-scan boundaries → verify not hallucinated.
**CC2-03:** Coherence check → verify horizontal + vertical coherent.

---

## GATE_2 EVALUATION

**Conditions:** G2-01 through G2-06 from gates.yaml
**IF GATE_2 PASS → proceed to step-03.**

---

## NEXT STEP

**Read tool:** `steps/step-03-quantify.md`
**PRECONDITION:** GATE_2 = OPEN OR (depth=quick AND GATE_1=OPEN)
