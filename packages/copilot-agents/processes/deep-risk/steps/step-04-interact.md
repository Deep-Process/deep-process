---
step: 4
name: INTERACT
phase: INTERACT
gate: GATE_4
time_estimate: "45-90 min"
goal: "Analyze risk interactions, challenge risk register with ADVERSARY, reconcile findings"
requires_completion: true
next_steps: ["step-05-mitigate"]
data_dependencies: [RISK_SCORES, VERTICAL_RISK_INVENTORY, HORIZONTAL_RISK_INVENTORY]
outputs: [RISK_CASCADES, CORRELATION_MATRIX, COMMON_MODE_FAILURES, CONCENTRATION_RISKS, COMPOUND_SCENARIOS, ADVERSARY_CHALLENGE, MISSING_RISK_HUNT, RISK_REGISTER_RECONCILIATION, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
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
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If 'independent' risks co-occur, assumption wrong"
  - id: A4-02
    assumption: "Cascade thresholds: failure of [A] triggers [B] if [condition]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If cascade occurs without condition, threshold wrong"
  - id: A4-03
    assumption: "Risk register from steps 01-03 is complete enough for adversarial challenge"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If ADVERSARY finds >30% new risks, original identification inadequate"
```

---

## ENFORCED SEQUENCE

### 4.1 Risk Cascade Mapping (Method #301)

**EXTRACT:**

Build directed graph showing which risks TRIGGER other risks.

**Method #301 (embedded, 5 steps):**
1. Load all risks from RISK_SCORES (step-03)
2. For EACH risk, ask: "If this risk materializes, what OTHER risks does it trigger or amplify?"
3. Build cascade chains:
   ```
   CASCADE CHAIN [CC-001]:
   R-003 (database failure)
     → R-007 (service unavailability) [mechanism: no data = no service]
       → R-012 (customer churn) [mechanism: SLA breach > 4h]
         → R-015 (revenue loss) [mechanism: contract penalties]

   TRIGGER MECHANISM: [concrete causal link, not correlation]
   AMPLIFICATION FACTOR: [does triggered risk score INCREASE? By how much?]
   CIRCUIT BREAKER: [what stops the cascade?]
   ```
4. Identify cascade ROOT CAUSES (risks that trigger many others but are triggered by few)
5. Identify cascade AMPLIFIERS (risks that make downstream impacts worse)

**VERIFY:**
- ≥3 cascade chains identified (for standard/comprehensive/critical depth)
- Each link has concrete causal mechanism (not "could lead to")
- Circuit breakers identified for each chain
- Root causes flagged as priority mitigation targets

**RENDER:** `risk-cascades.yaml`
```yaml
risk_cascades:
  chains:
    - id: "CC-001"
      links:
        - from: "R-003"
          to: "R-007"
          mechanism: "[causal link]"
          amplification: "[factor]"
      circuit_breaker: "[what stops cascade]"
      root_cause: "R-003"
      total_impact: "[cumulative if full chain fires]"
  root_causes: ["R-003", "R-005"]
  amplifiers: ["R-007"]
```

### 4.2 Risk Correlation Matrix (Method #302)

**EXTRACT:**

Build NxN matrix showing which risks tend to materialize SIMULTANEOUSLY.

**Method #302 (embedded, 4 steps):**
1. List all CRITICAL + HIGH risks (from step-03 tiers)
2. For each PAIR of risks, assess correlation:
   - **POSITIVE** (>0): Both materialize together (shared root cause, common trigger)
   - **ZERO** (0): Independent (no relationship)
   - **NEGATIVE** (<0): One prevents the other (mutually exclusive scenarios)
3. Build matrix:
   ```
   CORRELATION MATRIX:
           R-001  R-003  R-007  R-012
   R-001    1.0    0.7    0.0   -0.2
   R-003    0.7    1.0    0.9    0.3
   R-007    0.0    0.9    1.0    0.5
   R-012   -0.2    0.3    0.5    1.0

   HIGH CORRELATIONS (>0.6):
   - R-001 ↔ R-003 (0.7): Shared driver = [dependency X]
   - R-003 ↔ R-007 (0.9): Causal = [database drives service]
   ```
4. Identify CORRELATION CLUSTERS (groups of risks that move together)

**VERIFY:**
- Matrix covers all CRITICAL + HIGH risks
- High correlations (>0.6) have documented shared driver
- Correlation clusters identified

**RENDER:** `risk-correlation-matrix.yaml`

### 4.3 Common-Mode Failure Detection (Method #303)

**EXTRACT:**

Identify single points whose failure breaks MULTIPLE independent systems.

**Method #303 (embedded, 4 steps):**
1. List all shared dependencies from step-01 (DEPENDENCY_RISKS)
2. For each shared dependency, ask:
   - "How many systems/components depend on this?"
   - "What happens if this single point fails COMPLETELY?"
   - "Is there a backup/alternative for this dependency?"
3. Apply Swiss Cheese model (Reason's theorem):
   ```
   COMMON-MODE FAILURE: [CMF-001]
   SHARED POINT: [what is shared]
   DEPENDENT SYSTEMS: [list of systems relying on it]
   FAILURE SCENARIO: [what happens when shared point fails]
   DEFENSE LAYERS:
     Layer 1: [defense] — Hole: [how it can be bypassed]
     Layer 2: [defense] — Hole: [how it can be bypassed]
     Layer 3: [defense] — Hole: [how it can be bypassed]
   ALIGNED HOLES SCENARIO: [when ALL layers fail simultaneously]
   ```
4. Flag CMFs where ≥3 systems depend on single point (HIGH concentration)

**VERIFY:**
- ≥1 common-mode failure identified OR explicit "none exist" declaration with justification
- Swiss Cheese analysis applied (defense layers + holes documented)
- CMFs with ≥3 dependent systems flagged

**RENDER:** `common-mode-failures.yaml`

### 4.4 Concentration Risk Detection (Method #304)

**EXTRACT:**

Identify excessive dependency on single entities (vendor, person, technology, region).

**Method #304 (embedded, 4 steps):**
1. Scan across 6 concentration dimensions:
   - **Vendor concentration:** Single vendor provides >50% of critical services
   - **Person concentration:** Single person holds >50% of critical knowledge
   - **Technology concentration:** Single technology stack with no alternative
   - **Geographic concentration:** All infrastructure in single region/datacenter
   - **Customer concentration:** Single customer provides >30% of revenue
   - **Temporal concentration:** All critical deadlines cluster in same period
2. For each concentration found:
   ```
   CONCENTRATION: [CON-001]
   TYPE: VENDOR | PERSON | TECHNOLOGY | GEOGRAPHIC | CUSTOMER | TEMPORAL
   ENTITY: [what/who is concentrated on]
   DEPENDENCY: [percentage or count]
   ALTERNATIVE: [backup option, if any]
   RISK IF ENTITY FAILS: [consequence]
   ```
3. Calculate Herfindahl-Hirschman Index (HHI) where applicable: `HHI = Σ(share²)`. HHI > 0.25 = concentrated.
4. Flag concentrations without alternatives as CRITICAL

**VERIFY:**
- All 6 dimensions scanned
- Each concentration has dependency measurement
- Critical concentrations (no alternative) flagged

**RENDER:** `concentration-risks.yaml`

### 4.5 Compound Risk Scenarios (Method #305)

**EXTRACT:**

Construct realistic scenarios where multiple risks materialize simultaneously.

**Method #305 (embedded, 4 steps):**
1. From correlation matrix (4.2), take top 3 correlation clusters
2. For each cluster, construct compound scenario:
   ```
   COMPOUND SCENARIO: [CS-001]
   RISKS INVOLVED: [R-001, R-003, R-007]
   TRIGGER: [what initiates the compound event]
   SEQUENCE:
     1. [R-001 materializes because...]
     2. [This triggers R-003 via cascade...]
     3. [R-007 materializes simultaneously because shared driver...]
   COMBINED IMPACT: [total damage, worse than sum of individual impacts]
   PROBABILITY: [P(all occurring together) — NOT P(A) × P(B) if correlated]
   ```
3. Identify compound scenarios where combined impact exceeds NON-ERGODIC threshold
4. Check: Are compound scenarios accounted for in mitigation plans?

**VERIFY:**
- ≥2 compound scenarios constructed
- Combined probability correctly calculated (accounting for correlation, not naive multiplication)
- Compound impacts compared to ergodicity thresholds

**RENDER:** `compound-scenarios.yaml`

### 4.6 Critical Path Severance Test (Method #306)

**EXTRACT:** (IF depth=comprehensive/critical)

Identify what happens if critical paths are severed.

**Method #306 (embedded, 3 steps):**
1. Identify the 3 most critical paths in the system (data flow, deployment pipeline, customer journey)
2. For each path, simulate complete severance: "What if this path is 100% broken for 24 hours?"
3. Document: which risks materialize, what cascades trigger, is system recoverable?

**VERIFY:** Critical paths identified and severance impact assessed.
**RENDER:** `critical-path-severance.yaml`

### 4.7 Risk Interaction Paradoxes (Method #307)

**EXTRACT:** (IF depth=comprehensive/critical)

Identify paradoxical risk interactions.

**Method #307 (embedded, 3 steps):**
1. Scan for HEDGING PARADOXES: mitigating risk A increases risk B
2. Scan for SAFETY PARADOXES: adding safety measures increases overall risk (complexity-based)
3. Scan for OPTIMIZATION PARADOXES: optimizing for metric X degrades metric Y (Goodhart-adjacent)

**VERIFY:** Paradoxes documented with resolution strategy.
**RENDER:** `risk-paradoxes.yaml`

---

## ADVERSARY — CHALLENGE RISK REGISTER

**This section is MANDATORY for depth=standard/comprehensive/critical.**
**IF depth=quick → skip ADVERSARY, proceed to POST_PHASE_CHECKLIST.**

### 4.8 Devil's Advocate: Challenge Risk Register (ADVERSARY Phase 1) — CRITICAL SAFETY

**EXTRACT:**

Agent REVERSES perspective and attempts to BREAK its own risk assessment. The goal is to find flaws, overstatements, and missing risks.

**Method #ADVERSARY-01 (embedded, 6 steps — adapted from Deep-Verify ADVERSARY pattern):**
1. **Attack the risk register from 5 angles:**

   **Angle 1 — OVERSTATEMENT ATTACK:**
   - "Which risks have I scored TOO HIGH?"
   - "Am I catastrophizing? Is this REALLY critical, or am I anchored to the worst case?"
   - "Would a skeptic look at this score and say 'that's ridiculous'?"
   - For each potential overstatement: document why score might be wrong, provide alternative score

   **Angle 2 — UNDERSTATEMENT ATTACK:**
   - "Which risks have I scored TOO LOW?"
   - "Am I being complacent? Is this REALLY low-risk, or am I avoiding uncomfortable truth?"
   - "What would a paranoid security engineer say about my LOW-scored risks?"
   - For each potential understatement: document why score should be higher

   **Angle 3 — COMPLETENESS ATTACK:**
   - "What category of risk is ENTIRELY ABSENT from my register?"
   - "If I showed this register to a domain expert in [security/operations/compliance/finance], what would they immediately notice is missing?"
   - "What risks exist in the GAPS BETWEEN my identified risks?"

   **Angle 4 — ASSUMPTION ATTACK:**
   - "Which of my ASSUMPTIONS_DECLARED are most likely WRONG?"
   - "What happens to my entire risk assessment if assumption A3-01 is false?"
   - "Am I assuming good faith where adversarial intent is possible?"

   **Angle 5 — METHODOLOGY ATTACK:**
   - "Is my 5D scoring model APPROPRIATE for this system, or does it miss something?"
   - "Have I been using the scoring anchors consistently, or have I drifted?"
   - "Would a different risk framework (FAIR, bow-tie, fault tree) find different risks?"

2. **Document each challenge:**
   ```
   ADVERSARY CHALLENGE: [ADV-001]
   ANGLE: OVERSTATEMENT | UNDERSTATEMENT | COMPLETENESS | ASSUMPTION | METHODOLOGY
   TARGET: [Risk ID or assumption or methodology aspect]
   CHALLENGE: [specific argument against current assessment]
   EVIDENCE: [why this challenge has merit]
   VERDICT: UPHELD (assessment stands) | ADJUSTED (score/assessment changed) | NEW_RISK (risk added)
   ACTION: [what changes, if any]
   ```

3. **Minimum challenges:** ≥2 per angle = ≥10 total challenges
4. **Honesty requirement:** Agent MUST find at least 3 challenges with ADJUSTED or NEW_RISK verdict (if 0 adjustments, adversary was not genuine)
5. **Log adjusted scores:** If ADJUSTED, record old score → new score with justification
6. **Log new risks:** If NEW_RISK, add to risk register with full 5D scoring

**VERIFY:**
- ≥10 challenges documented (≥2 per angle)
- ≥3 challenges resulted in ADJUSTED or NEW_RISK (adversary was genuine)
- No challenge was dismissed with "N/A" or "not applicable" (must engage seriously)
- Each ADJUSTED verdict has old → new score documented

**RENDER:**
```yaml
adversary_challenge:
  challenges:
    - id: "ADV-001"
      angle: OVERSTATEMENT | UNDERSTATEMENT | COMPLETENESS | ASSUMPTION | METHODOLOGY
      target: "[R-xxx or A-xxx or methodology]"
      challenge: "[argument]"
      evidence: "[supporting evidence]"
      verdict: UPHELD | ADJUSTED | NEW_RISK
      action: "[change made]"
      score_change: {old: [value], new: [value]}  # if ADJUSTED
  summary:
    total_challenges: [count]
    upheld: [count]
    adjusted: [count]
    new_risks: [count]
    adjustment_rate: "[adjusted + new_risks / total]"
```

**IF adjustment_rate < 0.20 (less than 20% of challenges produce changes) → WARNING: adversary may be too lenient. Increase challenge intensity.**
**IF adjustment_rate > 0.60 (more than 60% produce changes) → WARNING: original assessment may be fundamentally flawed. Consider re-executing steps 01-03.**

### 4.9 Missing Risk Hunt (ADVERSARY Phase 2)

**EXTRACT:**

Independent re-scan for risks that the original identification MISSED.

**Method #ADVERSARY-02 (embedded, 5 steps):**
1. **Perspective rotation:** Assume the role of 5 different stakeholders:
   - End user ("what risks affect MY experience?")
   - Operations engineer ("what risks affect MY on-call life?")
   - Security analyst ("what risks affect MY threat model?")
   - Business owner ("what risks affect MY revenue/reputation?")
   - Regulator ("what risks affect MY compliance requirements?")
2. For EACH perspective, identify ≥1 risk NOT in current register
3. **Method cross-check:** Review step-01 methods (taxonomy, FMEA, STRIDE, dependency) and ask: "Did I apply each method THOROUGHLY, or did I rush any?"
4. **Pattern library cross-check:** Load relevant pattern libraries from `data/risk-pattern-libraries/`. For each active library, scan patterns not yet matched:
   - Compare EACH pattern signature against system characteristics
   - IF ≥3 signature elements match AND risk NOT in register → MISSING RISK
   - Document: pattern ID, matching signatures, risk description
5. Consolidate missing risks with full 5D scoring

**VERIFY:**
- ≥5 new risks identified from perspective rotation (1 per stakeholder)
- Pattern library cross-check completed for all relevant libraries
- New risks have full 5D scores

**RENDER:**
```yaml
missing_risk_hunt:
  perspective_risks:
    - perspective: "end_user"
      new_risks:
        - description: "[risk]"
          why_missed: "[why original scan didn't find this]"
          scores: {P: [x], I: [x], V: [x], D: [x], R: [x]}
  pattern_library_risks:
    - pattern_id: "[CORE-005]"
      matching_signatures: ["sig1", "sig2", "sig3"]
      new_risk: "[description]"
      scores: {P: [x], I: [x], V: [x], D: [x], R: [x]}
  total_new_risks: [count]
```

### 4.10 Risk Register Reconciliation (ADVERSARY Phase 3)

**EXTRACT:**

Merge ADVERSARY findings back into the master risk register.

**Method #ADVERSARY-03 (embedded, 4 steps):**
1. Apply all ADJUSTED scores from 4.8 to risk register
2. Add all NEW_RISK entries from 4.8 and 4.9 to risk register
3. Re-sort risk register by updated composite scores
4. Document reconciliation:
   ```
   RECONCILIATION SUMMARY:
   - Risks BEFORE adversary: [count]
   - Scores ADJUSTED: [count] (list IDs + direction: ↑ or ↓)
   - New risks ADDED: [count]
   - Risks AFTER adversary: [count]
   - Net change: [+N risks, M score adjustments]
   - Tier changes: [any risks that moved between tiers]
   ```

**VERIFY:**
- Updated register coherent (no contradictions between original and adversary findings)
- New risks integrated with full 5D scores
- Tier assignments updated after score changes
- Delta math correct: after_count = before_count + new_risks

**RENDER:** Updated `risk-scores.yaml` (merged) + `adversary-reconciliation.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Cascade graph (≥3 chains with causal mechanisms)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Correlation matrix (NxN for CRITICAL+HIGH risks)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Common-mode failures (≥1 OR 'none exist' declaration)"
    status: PASS | FAIL
  - item: "Concentration risks identified (6 dimensions scanned)"
    status: PASS | FAIL
  - item: "Compound scenarios (≥2 multi-risk scenarios)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ADVERSARY challenge completed (≥10 challenges, ≥3 adjustments)"
    status: PASS | FAIL
  - item: "Missing risk hunt (≥5 new risks from perspective rotation)"
    status: PASS | FAIL
  - item: "Risk register reconciled (adversary findings merged)"
    status: PASS | FAIL
  - item: "ASSUMPTIONS_DECLARED (≥3)"
    status: PASS | FAIL
  - item: "Counter-checks (CC4-01 through CC4-05)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC4-01: Grounding Check (Method #85)**
1. Sample 3 cascade chains from RISK_CASCADES
2. For each chain link: verify causal mechanism is concrete (not speculative)
3. For each chain: verify circuit breaker exists
4. Pass criteria: 3/3 cascade chains fully grounded

**CC4-02: Phantom Hunt (Method #168)**
1. Re-scan risk interactions independently (fresh analysis)
2. Compare with RISK_CASCADES and CORRELATION_MATRIX
3. IF interactions in artifacts don't appear in fresh scan → phantom interaction
4. Pass criteria: 0 phantom interactions

**CC4-03: Coherence Check (Method #84)**
1. Verify cascade graph is coherent (directed acyclic graph OR cycles documented with justification)
2. Verify correlation matrix is symmetric (cor(A,B) = cor(B,A))
3. Verify compound scenarios use correlated (not independent) probabilities
4. Pass criteria: 0 structural incoherences

**CC4-04: Adversary Grounding Check (Method #85)**
1. Sample 3 ADVERSARY challenges with ADJUSTED or NEW_RISK verdict
2. For each: verify the adjustment has concrete evidence (not just "I think I was wrong")
3. For each new risk: verify it's genuinely NEW (not a restatement of existing risk)
4. Pass criteria: 3/3 adversary findings are grounded and distinct

**CC4-05: Adversary Coherence Check (Method #84)**
1. Verify reconciled risk register coherence:
   - No duplicate risks (original + adversary saying same thing differently)
   - No contradictory scores (risk R-005 scored HIGH originally but adversary says LOW without resolution)
   - Delta math correct (before_count + new_risks = after_count)
2. Pass criteria: 0 duplicates, 0 contradictions, delta math verified

---

## GATE_4 EVALUATION

**Conditions:** G4-01 through G4-10 from gates.yaml
**IF GATE_4 PASS → proceed to step-05.**

---

## NEXT STEP

**Read tool:** `steps/step-05-mitigate.md`
**PRECONDITION:** GATE_4 = OPEN OR (depth=quick AND GATE_3=OPEN)
