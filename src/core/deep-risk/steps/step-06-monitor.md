---
step: 6
name: MONITOR
phase: MONITOR
gate: GATE_6
time_estimate: "30-45 min"
goal: "Design monitoring system with leading indicators and escalation protocol"
requires_completion: true
next_steps: ["step-07-output"]
data_dependencies: [MITIGATION_PORTFOLIO, RESIDUAL_RISK_ASSESSMENT]
outputs: [LEADING_INDICATORS, REVIEW_CADENCE, ESCALATION_PROTOCOL, POST_INCIDENT_FEEDBACK, SORITES_WATCH, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 06: MONITOR

**PRECONDITION:** GATE_5 = OPEN

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A6-01
    assumption: "Indicator sensitivity: [X] detects risk Y hours before materialization"
  - id: A6-02
    assumption: "Review capacity: team can review [N] risks per [timeframe]"
```

---

## ENFORCED SEQUENCE

### 6.1 Leading Indicator Identification (Method #501)

**Extract:** For top 10 risks, identify signals that PRECEDE materialization.

**Method #501 (embedded, 3 steps):**
1. Ask: "What happens BEFORE this risk materializes?"
2. Identify observable signals (metrics, events, thresholds)
3. Verify indicator is LEADING (not lagging/coincident)

```
RISK: [ID + Description]

LEADING INDICATORS:
• Indicator 1: [metric/event] — Precedes risk by [duration]
  Observable: [how to measure]
  Threshold: [value that triggers alert]

• Indicator 2: [...]

Verification:
□ Indicator precedes risk (not lagging)?
□ Observable (can actually measure)?
□ Actionable (time to respond)?
```

**Verify:** ALL top 10 risks have ≥1 leading indicator.
**Render:** `leading-indicators.yaml`

### 6.2 Review Cadence Design (Method #502)
**Extract:** Match review frequency to risk velocity.
**Verify:** Fast risks → frequent review, slow risks → less frequent.
**Render:** `review-cadence.yaml`

### 6.3 Escalation Protocol (Method #503)
**Extract:** Who decides what, when, with what authority.
**Verify:** Decision matrix covers all risk severity levels.
**Render:** `escalation-protocol.yaml` (BLOCKER gate requirement)

### 6.4 Post-Incident Feedback (Method #504)
**Extract:** How incidents improve risk assessment.
**Render:** `post-incident-feedback.yaml`

### 6.5 Sorites Watch (Method #505)
**Extract:** Gradual accumulation monitoring for temporal risks.
**Render:** `sorites-watch.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Leading indicators (≥1 per top 10 risks)"
    status: PASS | FAIL
  - item: "Review cadence designed (frequency matches velocity)"
    status: PASS | FAIL
  - item: "Escalation protocol defined (decision matrix)"
    status: PASS | FAIL
  - item: "Post-incident feedback loop designed"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Sorites watch configured (for temporal risks)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥2)"
    status: PASS | FAIL
  - item: "Counter-checks (CC6-01, CC6-02, CC6-03)"
    status: PASS | FAIL
  - item: "Monitoring system coherent (cadence ↔ velocity)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC6-01:** Sample 3 indicators → verify observable and leading (not lagging).
**CC6-02:** Re-scan indicators → verify not phantom (can actually measure).
**CC6-03:** Coherence check → verify cadence matches velocity.

---

## GATE_6 EVALUATION

**Conditions:** G6-01 through G6-07 from gates.yaml
**IF GATE_6 PASS → proceed to step-07.**

---

## NEXT STEP

**Read tool:** `steps/step-07-output.md`
**PRECONDITION:** GATE_6 = OPEN
