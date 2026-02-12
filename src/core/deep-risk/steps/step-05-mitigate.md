---
step: 5
name: MITIGATE
phase: MITIGATE
gate: GATE_5
time_estimate: "60-90 min"
goal: "Design mitigation portfolio with Cobra Effect checks (CRITICAL SAFETY)"
requires_completion: true
next_steps: ["step-06-monitor"]
data_dependencies:
  - RISK_SCORES (from step-03)
  - RISK_CASCADES (from step-04)
outputs:
  - MITIGATION_PORTFOLIO (4T classification for ALL risks)
  - COST_BENEFIT_ANALYSIS (for TREAT mitigations)
  - DEFENSE_IN_DEPTH (for critical risks)
  - RESIDUAL_RISK_ASSESSMENT (post-mitigation scores)
  - COBRA_EFFECT_CHECK (MANDATORY — every TREAT mitigation)
  - ASSUMPTIONS_DECLARED (≥3 assumptions)
  - POST_PHASE_CHECKLIST (8/8 items)
---

# Step 05: MITIGATE

**PRECONDITION:** GATE_4 = OPEN OR (depth=quick AND GATE_3=OPEN)
**IF PRECONDITION NOT MET → CRITICAL PROCESS VIOLATION → HALT**

---

## ASSUMPTIONS_DECLARED (MANDATORY)

```yaml
assumptions:
  - id: A5-01
    assumption: "Mitigation effectiveness estimated as [X]% based on [precedent/expert judgment]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If actual effectiveness <50% of estimate, wrong"

  - id: A5-02
    assumption: "Implementation cost estimated as [amount/effort] based on [source]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If actual cost >2× estimate, wrong"

  - id: A5-03
    assumption: "Cobra Effect checks identify perverse effects with [X]% confidence"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If mitigation creates worse risk and check missed it, process failed"
```

---

## ENFORCED SEQUENCE

### 5.1 Four-T Classification (Method #401)

**EXTRACT:** Classify EVERY risk into mitigation strategy.

**Method #401 (embedded, 4 strategies):**
1. **TOLERATE** (Accept): Risk acceptable, do nothing. Justify why.
2. **TREAT** (Mitigate): Reduce probability OR impact. Design specific action.
3. **TRANSFER** (Share): Insurance, contracts, outsource. Identify partner.
4. **TERMINATE** (Avoid): Remove risky activity entirely. Justify feasibility.

```
FOR EACH RISK (from step-03 RISK_SCORES):

RISK: [ID + Description]
5D Score: P=[X] I=[X] V=[X] D=[X] R=[X]

STRATEGY: [ ] TOLERATE  [ ] TREAT  [ ] TRANSFER  [ ] TERMINATE

JUSTIFICATION:
• TOLERATE: Risk score acceptable because [reason]. Residual risk = [score].
• TREAT: Reduce [P | I] by [action]. Expected reduction: [before] → [after].
• TRANSFER: Share with [partner] via [insurance | contract | SLA]. Coverage: [%].
• TERMINATE: Remove [activity/feature/dependency]. Impact: [what's lost].

IMPLEMENTATION:
• Actions: [list concrete steps]
• Owner: [person/team]
• Timeline: [when implemented]
• Cost: [effort/budget]
```

**VERIFY:**
1. EVERY risk has ONE strategy (no gaps, no "TBD")
2. Justification present (not arbitrary choice)
3. TREAT mitigations have concrete actions (not vague "improve security")

**RENDER:**
```yaml
mitigation_portfolio:
  risks:
    - risk_id: "[ID]"
      strategy: TOLERATE | TREAT | TRANSFER | TERMINATE
      justification: "[why this strategy]"
      actions: ["action 1", "action 2", ...]
      owner: "[person/team]"
      timeline: "[date]"
      cost: "[amount]"
      expected_reduction: {before: [score], after: [score]}
  strategy_counts:
    tolerate: [count]
    treat: [count]
    transfer: [count]
    terminate: [count]
```

---

### 5.2 Cost-Benefit Analysis (Method #402)

**EXTRACT:** For ALL TREAT mitigations, compare mitigation cost vs expected loss.

**Method #402 (embedded, formula):**
```
Expected Loss = Probability × Impact × Exposure_Window
Mitigation Cost = Implementation + Maintenance (annual)
Net Benefit = Expected Loss - Mitigation Cost

IF Net Benefit > 0 → Mitigation justified
IF Net Benefit < 0 → Over-investment (reconsider OR justify strategic value)
```

```
MITIGATION: [Action for Risk ID]

Expected Loss (without mitigation):
• Probability: [X%]
• Impact: [$Y OR Z person-hours]
• Exposure Window: [duration]
• Expected Loss = [calculation]

Mitigation Cost:
• Implementation: [$A OR B hours]
• Annual Maintenance: [$C OR D hours]
• Total Cost (5 years): [calculation]

Cost-Benefit:
• Net Benefit = Expected Loss - Total Cost = [result]
• ROI = (Expected Loss / Total Cost) - 1 = [X%]
• Decision: [ ] JUSTIFIED  [ ] OVER_INVESTMENT  [ ] STRATEGIC_VALUE
```

**VERIFY:**
1. Calculations shown (not just "justified")
2. Over-investment mitigations have justification (e.g., regulatory requirement, strategic hedge)
3. Time horizon consistent (5 years? 1 year?)

**RENDER:**
```yaml
cost_benefit_analysis:
  mitigations:
    - mitigation_id: "[ID]"
      expected_loss: [amount]
      implementation_cost: [amount]
      maintenance_cost_annual: [amount]
      total_cost_5yr: [amount]
      net_benefit: [amount]
      roi: [percentage]
      decision: JUSTIFIED | OVER_INVESTMENT | STRATEGIC_VALUE
```

---

### 5.3 Defense-in-Depth (Method #403)

**EXTRACT:** For CRITICAL risks (top 5), design layered defenses.

**Method #403 (embedded, Swiss Cheese Model):**
1. Layer 1: Prevention (stop risk from occurring)
2. Layer 2: Detection (catch it early if occurs)
3. Layer 3: Containment (limit damage if spreads)
4. Layer 4: Recovery (restore after failure)

**Key:** Layers must be INDEPENDENT (no single-point failure across layers).

```
CRITICAL RISK: [ID + Description]

Layer 1 — PREVENTION:
• Mitigation: [action to prevent occurrence]
• Independence: [verify not dependent on Layers 2-4]

Layer 2 — DETECTION:
• Mitigation: [monitoring, alerts, tests]
• Independence: [verify works even if Layer 1 fails]

Layer 3 — CONTAINMENT:
• Mitigation: [isolation, circuit breakers, limits]
• Independence: [verify works if Layers 1-2 fail]

Layer 4 — RECOVERY:
• Mitigation: [backups, rollback, failover]
• Independence: [verify works if all else fails]

Swiss Cheese Validation:
□ All 4 layers present?
□ Layers independent (no shared failure modes)?
□ Tested in isolation?
```

**VERIFY:**
1. Top 5 risks have ≥2 layers (ideally 4)
2. Independence validated (Layer 2 doesn't depend on Layer 1 working)
3. No common-mode failures (e.g., all layers depend on same database)

**RENDER:**
```yaml
defense_in_depth:
  critical_risks:
    - risk_id: "[ID]"
      layers:
        prevention: "[action]"
        detection: "[action]"
        containment: "[action]"
        recovery: "[action]"
      independence_verified: true | false
      common_mode_failures: [list OR "none"]
```

---

### 5.4 Residual Risk Assessment (Method #405)

**EXTRACT:** Re-score ALL risks AFTER mitigations applied.

```
FOR EACH RISK:

ORIGINAL 5D SCORE:
P=[X] I=[X] V=[X] D=[X] R=[X]

MITIGATION APPLIED:
[Strategy + Actions]

POST-MITIGATION 5D SCORE:
P=[X'] I=[X'] V=[X'] D=[X'] R=[X']

REDUCTION:
P: [X] → [X'] (reduced by [%])
I: [X] → [X'] (reduced by [%])
[etc.]

RESIDUAL RISK ACCEPTABLE: [ ] YES  [ ] NO

IF NO → Requires additional mitigation OR SCOPE_REDUCTION
```

**VERIFY:**
1. ALL risks re-scored (not just TREAT mitigations)
2. Residual scores realistic (if TOLERATE, residual = original)
3. Unacceptable residual risks flagged

**RENDER:**
```yaml
residual_risk_assessment:
  risks:
    - risk_id: "[ID]"
      original_score: {P, I, V, D, R}
      mitigation: "[strategy + actions]"
      residual_score: {P, I, V, D, R}
      reduction: {P: [%], I: [%], ...}
      acceptable: true | false
  unacceptable_residual_risks: [list]
```

---

### 5.5 Cobra Effect Check (Method #407) — CRITICAL SAFETY

**EXTRACT:** For EVERY TREAT mitigation, check if it creates WORSE risks.

**Method #407 (embedded, 5 questions):**
1. **Gaming:** Can mitigation be gamed to create perverse incentives?
2. **Unintended Consequences:** What 2nd-order effects might mitigation cause?
3. **Resource Shift:** Does mitigation consume resources needed elsewhere?
4. **Complexity:** Does mitigation add complexity that introduces new risks?
5. **Moral Hazard:** Does mitigation reduce caution and increase risk-taking?

```
MITIGATION: [Action for Risk ID]

COBRA EFFECT CHECK:

1. GAMING:
   Question: Can actors game this mitigation?
   Answer: [YES/NO + example]
   New Risk: [if YES, describe perverse incentive]

2. UNINTENDED CONSEQUENCES:
   Question: What else might this mitigation affect?
   Answer: [2nd-order effects]
   New Risk: [if negative, describe]

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
[ ] COBRA_DETECTED (mitigation creates worse risk → REDESIGN)
[ ] UNCERTAIN (need further analysis)

IF COBRA_DETECTED → Mitigation REJECTED, must redesign.
```

**VERIFY:**
1. EVERY TREAT mitigation checked (no skips)
2. All 5 questions answered (not just "N/A")
3. COBRA_DETECTED mitigations redesigned (not just flagged and ignored)

**RENDER:**
```yaml
cobra_effect_check:
  mitigations:
    - mitigation_id: "[ID]"
      checks:
        gaming: {answer, new_risk}
        unintended_consequences: {answer, new_risk}
        resource_shift: {answer, new_risk}
        complexity: {answer, new_risk}
        moral_hazard: {answer, new_risk}
      verdict: SAFE | COBRA_DETECTED | UNCERTAIN
      action: APPROVED | REDESIGN | INVESTIGATE
  cobra_detected_count: [number]
```

**IF cobra_detected_count > 0 → GATE_5 FAIL (BLOCKER) → HALT, redesign mitigations.**

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "4T classification complete (ALL risks assigned strategy)"
    status: PASS | FAIL

  - item: "Cost-benefit analysis (for ALL TREAT mitigations)"
    status: PASS | FAIL

  - item: "Defense-in-depth designed (for top 5 critical risks)"
    status: PASS | FAIL

  - item: "Residual risk assessment (ALL risks re-scored post-mitigation)"
    status: PASS | FAIL

  - item: "Cobra Effect check PASSED (EVERY TREAT mitigation checked, 0 COBRA_DETECTED)"
    status: PASS | FAIL

  - item: "ASSUMPTIONS_DECLARED (≥3 assumptions)"
    status: PASS | FAIL

  - item: "Counter-checks executed (CC5-01, CC5-02, CC5-03)"
    status: PASS | FAIL

  - item: "Mitigation portfolio consolidated"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

### CC5-01: Grounding Check (Method #85)
Sample 3 mitigations → verify each has concrete implementation path (not vague "improve").

### CC5-02: Phantom Hunt (Method #168)
Re-scan mitigation list → verify no phantom mitigations (unimplementable or duplicate).

### CC5-03: Coherence Check (Method #84)
Verify Cobra checks coherent with strategies (e.g., monitoring doesn't create alert fatigue).

---

## GATE_5 EVALUATION

**File:** `gates.yaml`, **Gate:** `GATE_5`

**Conditions:**
- G5-01: 4T classification complete (BLOCKER)
- G5-02: Cost-benefit analysis (CRITICAL)
- G5-03: Defense-in-depth (CRITICAL)
- G5-04: Graceful degradation (ERROR)
- G5-05: Residual risk assessed (CRITICAL)
- G5-06: **Cobra Effect check PASSED** (BLOCKER — CRITICAL SAFETY)
- G5-07: ASSUMPTIONS_DECLARED (BLOCKER)
- G5-08: POST_PHASE_CHECKLIST (CRITICAL)

**IF Cobra Effect FAIL → GATE_5 BLOCKER → HALT, redesign.**
**IF GATE_5 PASS → proceed to step-06-monitor.**

---

## ARTIFACTS OUTPUT

1. `mitigation-portfolio.yaml`
2. `cost-benefit-analysis.yaml`
3. `defense-in-depth.yaml`
4. `residual-risk-assessment.yaml`
5. `cobra-effect-check.yaml` (CRITICAL — must show 0 detected)
6. `assumptions-mitigate.yaml`
7. `counter-checks-mitigate.yaml`
8. `post-phase-checklist-mitigate.yaml`

---

## NEXT STEP

**Read tool:** `steps/step-06-monitor.md`

**PRECONDITION:** GATE_5 = OPEN (Cobra Effect PASSED)
