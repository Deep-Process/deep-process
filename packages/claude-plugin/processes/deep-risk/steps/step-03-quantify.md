---
step: 3
name: QUANTIFY
phase: QUANTIFY
gate: GATE_3
time_estimate: "45-75 min"
goal: "Score ALL risks with 5D framework (P/I/V/D/R) and construct worst-case scenarios"
requires_completion: true
next_steps: ["step-04-interact"]
data_dependencies: [VERTICAL_RISK_INVENTORY, HORIZONTAL_RISK_INVENTORY]
outputs: [RISK_SCORES, EXPOSURE_WINDOWS, COST_ESTIMATES, WORST_CASE_SCENARIOS, ERGODICITY_TEST, STABILITY_BASINS, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 03: QUANTIFY

**PRECONDITION:** GATE_2 = OPEN OR (depth=quick AND GATE_1=OPEN)

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A3-01
    assumption: "Probability estimates based on [precedent/expert judgment/historical data]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If actual frequency differs >2x from estimate, calibration wrong"
  - id: A3-02
    assumption: "Impact estimates use [methodology: $ value / severity scale / time-based]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If actual impact differs >2x from estimate, methodology wrong"
  - id: A3-03
    assumption: "5D scoring thresholds from data/risk-scoring.yaml are appropriate for [system type]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If scoring produces counterintuitive results, thresholds miscalibrated"
```

---

## ENFORCED SEQUENCE

### 3.1 Five-Dimension Scoring (Method #201)

**EXTRACT:**

For EVERY risk in the consolidated inventory (step-01 + step-02), score all 5 dimensions.

**Method #201 (embedded, 6 steps):**
1. Load consolidated risk list from VERTICAL_RISK_INVENTORY + HORIZONTAL_RISK_INVENTORY
2. Load scoring anchors from `data/risk-scoring.yaml`
3. For EACH risk, score 5 dimensions:
   ```
   RISK: [ID] — [Description]

   P (Probability):  [0.0-1.0] — Evidence: [why this probability]
     Anchor: 0.1=rare precedent, 0.3=has happened elsewhere, 0.5=plausible,
             0.7=expected, 0.9=near certain
   I (Impact):       [1-5] — Evidence: [dollar/severity basis]
     Anchor: 1=negligible, 2=minor, 3=significant, 4=severe, 5=catastrophic
   V (Velocity):     [1-5] — Evidence: [time from trigger to impact]
     Anchor: 1=months, 2=weeks, 3=days, 4=hours, 5=minutes/instant
   D (Detectability): [1-5] — Evidence: [current monitoring capability]
     Anchor: 1=automatic detection, 2=routine check catches, 3=requires investigation,
             4=hard to detect, 5=invisible until impact
   R (Reversibility): [1-5] — Evidence: [recovery capability]
     Anchor: 1=automatic rollback, 2=manual fix <1h, 3=fix <1day,
             4=significant recovery effort, 5=irreversible
   ```
4. Calculate composite score: `Composite = P × I × max(V, D, R)`
5. Assign tier based on thresholds:
   - CRITICAL: composite ≥ 60
   - HIGH: composite ≥ 30
   - MEDIUM: composite ≥ 10
   - LOW: composite < 10
6. Flag special conditions:
   - IF R=5 (irreversible) AND P>0.3 → FLAG as NON-NEGOTIABLE (must address regardless of composite)
   - IF D=5 (invisible) AND I≥4 → FLAG as HIDDEN CRITICAL (may surprise)
   - IF V=5 (instant) AND D≥4 → FLAG as NO-WARNING (cannot respond in time)

**VERIFY:**
- 100% of risks from GATE_1 + GATE_2 scored (no gaps)
- Each score has evidence/rationale (not gut feel)
- Special condition flags applied where applicable
- Tier distribution is plausible (not all HIGH or all LOW)

**RENDER:** `risk-scores.yaml`
```yaml
risk_scores:
  scoring_methodology: "data/risk-scoring.yaml"
  risks:
    - id: "R-001"
      description: "[risk]"
      scores:
        probability: {value: [0.0-1.0], evidence: "[basis]"}
        impact: {value: [1-5], evidence: "[basis]"}
        velocity: {value: [1-5], evidence: "[basis]"}
        detectability: {value: [1-5], evidence: "[basis]"}
        reversibility: {value: [1-5], evidence: "[basis]"}
      composite: [calculated]
      tier: CRITICAL | HIGH | MEDIUM | LOW
      flags: [NON_NEGOTIABLE, HIDDEN_CRITICAL, NO_WARNING]
  summary:
    total_risks: [count]
    critical: [count]
    high: [count]
    medium: [count]
    low: [count]
    flagged: [count]
```

### 3.2 Exposure Window Analysis (Method #202)

**EXTRACT:**

For top 10 risks (by composite score), define WHEN and HOW LONG the system is vulnerable.

**Method #202 (embedded, 4 steps):**
1. For each top-10 risk, identify:
   - **Window open:** When does vulnerability begin? (deployment, config change, user growth threshold, time of day)
   - **Window close:** When does vulnerability end? (patch applied, migration complete, never)
   - **Duration:** How long is the system exposed? (hours, days, months, permanent)
   - **Frequency:** How often does the window open? (once, daily, on every deploy, continuous)
2. Calculate total exposure:
   ```
   RISK: [ID]
   WINDOW: [open trigger] → [close trigger]
   DURATION: [how long each time]
   FREQUENCY: [how often]
   TOTAL EXPOSURE: duration × frequency over assessment timeframe
   ```
3. Identify overlapping windows (multiple risks vulnerable simultaneously)
4. Flag permanent windows (risks that never close — architectural vulnerability)

**VERIFY:**
- Top 10 risks have exposure windows defined
- Each window has concrete open/close triggers (not "sometime")
- Permanent windows flagged as priority items

**RENDER:** `exposure-windows.yaml`
```yaml
exposure_windows:
  risks:
    - id: "R-001"
      window_open: "[trigger]"
      window_close: "[trigger]"
      duration: "[timespan]"
      frequency: "[how often]"
      total_exposure: "[calculated]"
      permanent: true | false
  overlapping_windows:
    - risks: ["R-001", "R-003"]
      overlap_period: "[when both open]"
      combined_impact: "[what happens if both hit]"
```

### 3.3 Cost Estimation (Method #203)

**EXTRACT:**

For top 10 risks, estimate concrete cost if risk materializes.

**Method #203 (embedded, 5 steps):**
1. For each risk, estimate cost in 3 dimensions:
   - **Direct cost:** Revenue loss, repair cost, penalty, compensation
   - **Indirect cost:** Reputation damage, customer churn, team morale, opportunity cost
   - **Recovery cost:** Time to fix, resources needed, external help required
2. Use reference class forecasting:
   - "What did similar incidents cost in comparable organizations?"
   - "What's the base rate for this type of failure?"
   - Cite source (industry report, case study, internal history)
3. Provide range estimate (not point estimate):
   ```
   RISK: [ID]
   BEST CASE: $[amount] — assumes [conditions]
   EXPECTED: $[amount] — assumes [conditions]
   WORST CASE: $[amount] — assumes [conditions]
   CONFIDENCE: HIGH | MEDIUM | LOW
   REFERENCE CLASS: [similar incident/data source]
   ```
4. Calculate expected loss: `probability × expected_cost`
5. Flag risks where worst_case > 10× expected (fat-tail risk — Taleb theorem)

**VERIFY:**
- Costs are concrete numbers (not just "HIGH" — demand $XX or XX hours)
- Reference class cited for each estimate
- Fat-tail risks flagged

**RENDER:** `cost-estimates.yaml`

### 3.4 Precedent Probability Calibration (Method #204)

**EXTRACT:**

Calibrate probability estimates against historical precedent.

**Method #204 (embedded, 4 steps):**
1. For each risk with P > 0.3, ask:
   - "Has this type of failure occurred in similar systems?"
   - "What's the historical frequency (incidents per year)?"
   - "Are conditions HERE more or less favorable than the reference?"
2. Adjust probability based on precedent:
   - IF precedent suggests higher P → increase estimate, document why
   - IF precedent suggests lower P → decrease estimate, document why
   - IF no precedent found → FLAG as NOVEL RISK (higher uncertainty)
3. Document calibration source for each adjustment
4. Flag uncalibrated estimates (P based on gut feel, no reference class)

**VERIFY:**
- All P > 0.3 risks have calibration attempt
- Novel risks (no precedent) flagged for extra scrutiny
- Calibration sources documented

**RENDER:** `probability-calibration.yaml`

### 3.5 Worst-Case Construction (Method #205)

**EXTRACT:**

For top 5 risks (by composite score), construct full worst-case narrative.

**Method #205 (embedded, 4 steps):**
1. For each top-5 risk, write narrative:
   ```
   WORST CASE: [Risk ID] — [Risk Name]

   TRIGGER: [What initiates the failure]
   SEQUENCE:
     1. [First thing that happens]
     2. [What that causes]
     3. [How it escalates]
     4. [What fails next due to cascade]
     5. [Final state — maximum damage]

   IMPACT:
     - Direct: [$ or severity]
     - Duration: [how long before recovery]
     - Blast radius: [what else is affected]
     - Recovery: [what it takes to fix]

   PROBABILITY OF THIS EXACT SEQUENCE: [estimate]
   ```
2. Identify which mitigations would BREAK the sequence (intervention points)
3. Identify which monitoring would DETECT the sequence before completion
4. Check: Is worst case survivable? (connects to ergodicity test)

**VERIFY:**
- Top 5 risks have full narratives (not abbreviated)
- Each narrative has concrete sequence (not "things get worse")
- Intervention points identified

**RENDER:** `worst-case-scenarios.yaml`

### 3.6 Ergodicity Test (Method #206)

**EXTRACT:** (IF depth=comprehensive/critical)

Test whether risks are ergodic (can average across many trials) or non-ergodic (one occurrence ends the game).

**Method #206 (embedded, 4 steps):**
1. For each CRITICAL/HIGH risk, ask:
   - "Can we survive this risk materializing once?" → IF NO → NON-ERGODIC
   - "Can we survive it materializing 3 times?" → IF NO → WEAKLY NON-ERGODIC
   - "Does the expected value calculation make sense, or is this an absorbing state?"
2. Non-ergodic test criteria:
   - Company goes bankrupt → NON-ERGODIC
   - Critical data permanently lost → NON-ERGODIC
   - Regulatory shutdown → NON-ERGODIC
   - Key person leaves with irreplaceable knowledge → WEAKLY NON-ERGODIC
   - Major customer permanently lost → WEAKLY NON-ERGODIC
3. For each NON-ERGODIC risk:
   - Expected value calculation is INVALID (can't average what you experience once)
   - Strategy shifts from "manage probability" to "ensure survival"
   - Mitigation priority: MAXIMUM (regardless of composite score)
4. Document: "This risk is non-ergodic because [reason]. Standard scoring may understate danger."

**VERIFY:**
- All CRITICAL risks tested for ergodicity
- Non-ergodic risks flagged for maximum mitigation priority
- Expected value calculations noted as invalid for non-ergodic risks

**RENDER:** `ergodicity-test.yaml`
```yaml
ergodicity_test:
  risks:
    - id: "R-001"
      ergodic: true | false
      reason: "[why non-ergodic]"
      survival_test: "Can survive [1/3/N] occurrences: YES | NO"
      strategy_implication: "[how this changes mitigation approach]"
  non_ergodic_count: [number]
```

### 3.7 Stability Basin Mapping (Method #207)

**EXTRACT:** (IF depth=comprehensive/critical)

Map stability basins — regions where the system operates normally vs regions where it enters irreversible failure.

**Method #207 (embedded, 3 steps):**
1. Identify key system parameters (load, data volume, team size, cash reserves)
2. For each parameter, identify:
   - Normal operating range (stability basin)
   - Boundary conditions (edge of basin)
   - Tipping points (where system falls into new basin — potentially unrecoverable)
3. Map: which risks push the system toward basin boundaries?
   ```
   PARAMETER: [name]
   NORMAL RANGE: [min] — [max]
   TIPPING POINT: [value at which system destabilizes]
   CURRENT POSITION: [where we are now]
   MARGIN: [distance to tipping point]
   RISKS THAT PUSH TOWARD BOUNDARY: [R-xxx, R-yyy]
   ```

**VERIFY:** Margins calculated for critical parameters.
**RENDER:** `stability-basins.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "5D scores for ALL risks (100% coverage, no gaps)"
    status: PASS | FAIL
  - item: "Exposure windows defined (top 10, concrete triggers)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Cost estimates (top 10, concrete $ numbers with reference class)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Probability calibrated against precedent (P>0.3 risks)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Worst-case scenarios constructed (top 5, full narratives)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Ergodicity tested (CRITICAL risks, IF depth=comprehensive/critical)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥3)"
    status: PASS | FAIL
  - item: "Counter-checks (CC3-01, CC3-02, CC3-03)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC3-01: Grounding Check (Method #85)**
1. Sample 3 scored risks (1 CRITICAL, 1 HIGH, 1 MEDIUM)
2. For each: verify EVERY dimension score has documented evidence/rationale
3. For each: verify composite score matches formula (P × I × max(V,D,R))
4. For each: verify tier assignment matches thresholds (≥60=CRITICAL, ≥30=HIGH, ≥10=MEDIUM)
5. Pass criteria: 3/3 scores grounded with evidence, calculations correct

**CC3-02: Phantom Hunt (Method #168)**
1. Count risks in consolidated inventory (from GATE_1 + GATE_2)
2. Count risks in RISK_SCORES
3. IF risk_scores_count > inventory_count → phantom risks added during scoring
4. IF risk_scores_count < inventory_count → risks dropped during scoring
5. Pass criteria: counts match exactly (delta = 0)

**CC3-03: Coherence Check (Method #84)**
1. Verify 5D score coherence across risk register:
   - High Impact (I≥4) + Low Reversibility (R≥4) → tier MUST be HIGH or CRITICAL (not MEDIUM)
   - High Velocity (V≥4) + Low Detectability (D≥4) → FLAG as NO_WARNING
   - High Probability (P≥0.7) + High Impact (I≥4) → tier MUST be CRITICAL
2. Verify cost estimates coherent with impact scores:
   - If I=5 (catastrophic) but cost estimate < $10k → INCOHERENT (investigate)
   - If I=1 (negligible) but cost estimate > $1M → INCOHERENT (investigate)
3. Verify tier distribution is plausible:
   - IF all risks CRITICAL → calibration likely wrong (everything can't be critical)
   - IF all risks LOW → assessment likely too optimistic (something should be higher)
4. Pass criteria: 0 incoherent score combinations

---

## GATE_3 EVALUATION

**Conditions:** G3-01 through G3-08 from gates.yaml
**IF GATE_3 PASS → proceed to step-04.**

---

## NEXT STEP

**Read tool:** `steps/step-04-interact.md`
**PRECONDITION:** GATE_3 = OPEN
