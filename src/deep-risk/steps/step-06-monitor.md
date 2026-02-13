---
step: 6
name: MONITOR
phase: MONITOR
gate: GATE_6
time_estimate: "45-60 min"
goal: "Design monitoring system with leading indicators, escalation protocol, Cobra monitoring check, and adversarial testing"
requires_completion: true
next_steps: ["step-07-output"]
data_dependencies: [MITIGATION_PORTFOLIO, RESIDUAL_RISK_ASSESSMENT, COBRA_EFFECT_CHECK]
outputs: [LEADING_INDICATORS, REVIEW_CADENCE, ESCALATION_PROTOCOL, POST_INCIDENT_FEEDBACK, SORITES_WATCH, COBRA_MONITORING_CHECK, ADVERSARIAL_MONITORING_TEST, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
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

### 6.6 Cobra Monitoring Check (Method #506) — CRITICAL SAFETY

**EXTRACT:** For EVERY monitoring component, check if it creates perverse effects.

**Target components:** LEADING_INDICATORS, REVIEW_CADENCE, ESCALATION_PROTOCOL

**Method #506 (embedded, 5 questions per component — adapted from Method #407):**
1. **Gaming:** Can this monitoring component be gamed to create perverse incentives?
2. **Unintended Consequences:** What 2nd-order effects might this component cause?
3. **Resource Shift:** Does this component consume resources needed elsewhere?
4. **Complexity:** Does this component add complexity that introduces new risks?
5. **Moral Hazard:** Does this component reduce caution and increase risk-taking?

**Component-specific adaptations:**
- **LEADING_INDICATORS:** Gaming = Goodhart's Law (measured indicator becomes gamed target), Moral Hazard = "indicators say safe → complacency, stop investigating"
- **REVIEW_CADENCE:** Resource Shift = team time consumed by reviews instead of actual work, Complexity = coordination overhead across teams/timezones
- **ESCALATION_PROTOCOL:** Gaming = over-escalation to avoid blame (CYA escalation), Unintended Consequences = decision bottleneck at senior level

```
MONITORING COMPONENT: [LEADING_INDICATORS | REVIEW_CADENCE | ESCALATION_PROTOCOL]

COBRA MONITORING CHECK:

1. GAMING:
   Question: Can actors game this monitoring component?
   Answer: [YES/NO + example]
   New Risk: [if YES, describe perverse incentive]

2. UNINTENDED CONSEQUENCES:
   Question: What else might this component affect?
   Answer: [2nd-order effects]
   New Risk: [if negative, describe — e.g., alert fatigue]

3. RESOURCE SHIFT:
   Question: What resources does this consume?
   Answer: [budget/people/time]
   New Risk: [opportunity cost — what's NOT done?]

4. COMPLEXITY:
   Question: Does this add complexity?
   Answer: [YES/NO + measurement]
   New Risk: [if YES, new failure modes from complexity]

5. MORAL HAZARD:
   Question: Does this reduce caution?
   Answer: [YES/NO + scenario]
   New Risk: [if YES, increased risk-taking]

VERDICT:
[ ] SAFE (no Cobra Effects OR effects acceptable)
[ ] COBRA_DETECTED (component creates worse risk → REDESIGN)
[ ] UNCERTAIN (need further analysis)

IF COBRA_DETECTED → Monitoring component REJECTED, must redesign.
```

**VERIFY:**
1. ALL 3 monitoring components checked (LEADING_INDICATORS, REVIEW_CADENCE, ESCALATION_PROTOCOL)
2. All 5 questions answered per component (not just "N/A")
3. COBRA_DETECTED components redesigned (not just flagged and ignored)

**RENDER:**
```yaml
cobra_monitoring_check:
  components:
    - component: LEADING_INDICATORS
      checks:
        gaming: {answer, new_risk}
        unintended_consequences: {answer, new_risk}
        resource_shift: {answer, new_risk}
        complexity: {answer, new_risk}
        moral_hazard: {answer, new_risk}
      verdict: SAFE | COBRA_DETECTED | UNCERTAIN
      action: APPROVED | REDESIGN | INVESTIGATE
    - component: REVIEW_CADENCE
      checks: {gaming, unintended_consequences, resource_shift, complexity, moral_hazard}
      verdict: SAFE | COBRA_DETECTED | UNCERTAIN
      action: APPROVED | REDESIGN | INVESTIGATE
    - component: ESCALATION_PROTOCOL
      checks: {gaming, unintended_consequences, resource_shift, complexity, moral_hazard}
      verdict: SAFE | COBRA_DETECTED | UNCERTAIN
      action: APPROVED | REDESIGN | INVESTIGATE
  cobra_detected_count: [number]
```

**IF cobra_detected_count > 0 → GATE_6 FAIL (BLOCKER) → HALT, redesign monitoring.**

---

### 6.7 Adversarial Monitoring Test (Method #507)

**EXTRACT:** Self-adversarial test for monitoring system robustness.

**Method #507 (embedded, 4 steps — based on Method #56 Liar's Trap pattern):**
1. List 3 ways the monitoring system could be gamed DESPITE Cobra checks passing
2. For each gaming vector: assess likelihood (HIGH/MEDIUM/LOW), impact, detectability
3. Design defense for HIGH or MEDIUM likelihood vectors
4. Render verdict

```
ADVERSARIAL MONITORING TEST:

GAMING VECTOR 1: [Description — how could monitoring be circumvented?]
  Likelihood: HIGH | MEDIUM | LOW
  Impact: [What happens if gamed?]
  Detectability: [Would we know?]
  Defense: [IF HIGH/MEDIUM → specific countermeasure. IF LOW → accept risk]

GAMING VECTOR 2: [...]
  Likelihood: HIGH | MEDIUM | LOW
  Impact: [...]
  Detectability: [...]
  Defense: [...]

GAMING VECTOR 3: [...]
  Likelihood: HIGH | MEDIUM | LOW
  Impact: [...]
  Detectability: [...]
  Defense: [...]

VERDICT:
[ ] HARDENED (defenses added for HIGH/MEDIUM vectors)
[ ] ACCEPTABLE (all vectors LOW likelihood)
[ ] VULNERABLE (HIGH vectors without viable defense → needs redesign)
```

**VERIFY:**
1. ≥3 gaming vectors identified (not generic — specific to THIS monitoring system)
2. HIGH/MEDIUM vectors have concrete defenses (not "we'll monitor it")
3. VULNERABLE verdict → return to monitoring design

**RENDER:**
```yaml
adversarial_monitoring_test:
  gaming_vectors:
    - id: GV-01
      description: "[specific gaming scenario]"
      likelihood: HIGH | MEDIUM | LOW
      impact: "[consequence]"
      detectability: "[how/if detected]"
      defense: "[countermeasure]"
    - id: GV-02
      description: "[...]"
      likelihood: HIGH | MEDIUM | LOW
      impact: "[...]"
      detectability: "[...]"
      defense: "[...]"
    - id: GV-03
      description: "[...]"
      likelihood: HIGH | MEDIUM | LOW
      impact: "[...]"
      detectability: "[...]"
      defense: "[...]"
  verdict: HARDENED | ACCEPTABLE | VULNERABLE
  defenses_added: [number]
```

**IF verdict = VULNERABLE → GATE_6 FAIL (CRITICAL) → redesign monitoring system.**

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
  - item: "Counter-checks (CC6-01, CC6-02, CC6-03, CC6-04)"
    status: PASS | FAIL
  - item: "Monitoring system coherent (cadence ↔ velocity)"
    status: PASS | FAIL
  - item: "Cobra Monitoring Check PASSED (all 3 components checked)"
    status: PASS | FAIL
  - item: "Adversarial Monitoring Test completed (≥3 vectors, verdict not VULNERABLE)"
    status: PASS | FAIL | SCOPE_REDUCED
```

---

## COUNTER_CHECKS

**CC6-01:** Sample 3 indicators → verify observable and leading (not lagging).
**CC6-02:** Re-scan indicators → verify not phantom (can actually measure).
**CC6-03:** Coherence check → verify cadence matches velocity.
**CC6-04:** Coherence check → verify Cobra monitoring checks coherent with mitigation Cobra checks (GATE_5 Cobra outcomes don't contradict GATE_6 monitoring design).

---

## GATE_6 EVALUATION

**Conditions:** G6-01 through G6-09 from gates.yaml
**IF GATE_6 PASS → proceed to step-07.**

---

## NEXT STEP

**Read tool:** `steps/step-07-output.md`
**PRECONDITION:** GATE_6 = OPEN
