---
step: 7
name: OUTPUT
phase: OUTPUT
gate: GATE_7
time_estimate: "45-75 min"
goal: "Generate risk assessment outputs, run META audit, validate coverage"
requires_completion: true
next_steps: ["COMPLETE OR iterate"]
data_dependencies: [ALL prior artifacts]
outputs: [META_AUDIT, RISK_REGISTER, RISK_INTERACTION_MAP, MITIGATION_PORTFOLIO, MONITORING_SYSTEM, RISK_REPORT, COVERAGE_SCORE, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 07: OUTPUT

**PRECONDITION:** GATE_6 = OPEN

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A7-01
    assumption: "Report scope [boundaries] matches assessment scope from step-00"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If report addresses risks outside original scope OR omits in-scope risks, scope mismatch"
  - id: A7-02
    assumption: "Coverage score methodology from data/coverage-scoring.yaml is appropriate for [system type]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If coverage score says PASS but obvious risks missing, methodology flawed"
  - id: A7-03
    assumption: "META audit biases [list] are the primary biases relevant to this assessment"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If domain-specific bias (e.g., technology hype cycle) distorts assessment but wasn't checked"
```

---

## ENFORCED SEQUENCE

### 7.1 META Audit (Methods #601-606)

**IF depth=quick/standard → skip META audit, go to 7.2**
**IF depth=comprehensive/critical → execute ALL 6 META methods:**

#### 7.1.1 Cognitive Bias Audit (Method #601)

**EXTRACT:**

Scan the ENTIRE risk assessment (steps 0-6) for systematic cognitive biases.

**Method #601 (embedded, 6 steps):**
1. Check for **Optimism Bias** — are risk probabilities systematically too low?
   - Compare: Are >60% of risks rated P<0.3? → SUSPICIOUS (most systems have moderate-probability risks)
   - Compare: Are worst-case estimates too mild? → Check against industry base rates
2. Check for **Availability Bias** — are risks over-represented that match recent events?
   - Ask: "Which recent incident influenced this assessment most?"
   - Check: Is that incident's risk type disproportionately represented?
3. Check for **Confirmation Bias** — did assessment seek disconfirming evidence?
   - Check: Were ADVERSARY challenges in step-04 genuinely adversarial (adjustment_rate >0.20)?
   - Check: Were any initial hypotheses from step-00 CONTRADICTED by later findings?
4. Check for **Anchoring** — did first risks found dominate the final register?
   - Compare: Risks from step-01 (first found) vs step-02/04 (found later) — are early risks systematically rated higher?
5. Check for **Groupthink** — does the risk register reflect only one perspective?
   - Check: Did ADVERSARY step-04 use ≥5 stakeholder perspectives?
   - Check: Are there risks that ONLY one perspective would identify?
6. For EACH bias detected:
   ```
   BIAS: [name]
   EVIDENCE: [how it manifests in this assessment]
   AFFECTED RISKS: [R-xxx, R-yyy — which risks' scores may be distorted]
   CORRECTION: [recommended adjustment]
   SEVERITY: DISTORTS_SCORES | DISTORTS_PRIORITIES | MINOR
   ```

**VERIFY:**
- All 5 biases checked (not just "no bias found" — demand evidence for EACH)
- IF any DISTORTS_SCORES bias found → risk re-scoring recommended
- IF any DISTORTS_PRIORITIES bias found → mitigation re-prioritization recommended

**RENDER:** Include in `meta-audit.yaml` under `cognitive_bias_audit:`

#### 7.1.2 Risk Appetite Calibration (Method #602)

**EXTRACT:**

Compare STATED risk appetite (from stakeholders/policy) with REVEALED risk appetite (from actual mitigation decisions).

**Method #602 (embedded, 4 steps):**
1. Identify **Stated Appetite** from step-00 context:
   - What risks did stakeholders say are "unacceptable"?
   - What risk level triggers "immediate action"?
   - What is the explicit risk tolerance (if documented)?
2. Identify **Revealed Appetite** from step-05 mitigation decisions:
   - Which risks were TOLERATED (accepted without mitigation)?
   - Which risks were TREATED (reduced but not eliminated)?
   - Which risks were left with residual scores above "unacceptable" threshold?
3. Calculate **Appetite Gap:**
   ```
   RISK: [ID]
   STATED: "Unacceptable — must mitigate"
   REVEALED: "Tolerated — accepted as-is"
   GAP: [description of inconsistency]
   IMPLICATION: [what this means for actual risk posture]
   ```
4. Flag risks where stated ≠ revealed (gap > 0):
   - IF gap count > 3 → APPETITE_INCOHERENT (stated policy doesn't match decisions)
   - IF gap count = 0 → APPETITE_ALIGNED (or check for rubber-stamping)

**VERIFY:**
- Gap analysis completed for ALL risks with mitigation decisions
- Incoherent appetites flagged for stakeholder attention

**RENDER:** Include in `meta-audit.yaml` under `risk_appetite_calibration:`

#### 7.1.3 Portfolio Risk View (Method #603)

**EXTRACT:**

Assess whether the aggregate risk portfolio is acceptable even if individual risks are individually acceptable.

**Method #603 (embedded, 5 steps):**
1. Sum expected losses: `total_expected_loss = sum(P_i × expected_cost_i)` for all risks
   - Is total_expected_loss survivable? (compare to budget/revenue/reserves)
2. Check correlation-adjusted portfolio risk:
   - IF correlated risks from step-04 materialize simultaneously → what's the COMBINED impact?
   - Sum WORST CASE across top 5 correlated risk clusters
3. Check risk concentration by category:
   - Count risks per genesis source, per category, per system component
   - IF >50% of risks cluster in ONE area → CONCENTRATION_RISK (portfolio unbalanced)
4. Check non-ergodic portfolio:
   - From step-03 ergodicity test: how many NON-ERGODIC risks exist?
   - IF any non-ergodic risk has P>0.1 → PORTFOLIO_FRAGILE (one event could end game)
5. Portfolio verdict:
   ```
   TOTAL_EXPECTED_LOSS: $[amount] per [timeframe]
   SURVIVABLE: YES | NO | MARGINAL
   CONCENTRATION: [description of clusters]
   NON_ERGODIC_EXPOSURE: [count] risks, combined P = [probability]
   PORTFOLIO_VERDICT: ACCEPTABLE | CONCERNING | UNACCEPTABLE
   ```

**VERIFY:**
- Portfolio math correct (sum of expected losses)
- Concentration analysis completed
- Non-ergodic exposure assessed

**RENDER:** Include in `meta-audit.yaml` under `portfolio_risk_view:`

#### 7.1.4 Risk Communication Framework (Method #604)

**EXTRACT:**

Design right communication for right audience.

**Method #604 (embedded, 4 steps):**
1. Identify audiences: Executive, Technical, Operations, External (regulator/customer)
2. For EACH audience, determine:
   - What risks matter MOST to them? (filter by relevance)
   - What FORMAT works? (executives: dashboard + top 5; technical: full register; ops: monitoring + escalation)
   - What LANGUAGE? (executives: business impact $; technical: system components; ops: procedures)
3. Design report sections mapped to audiences:
   ```
   AUDIENCE: [name]
   RELEVANT_SECTIONS: [which report sections]
   KEY_RISKS: [top 3 for this audience]
   FORMAT: DASHBOARD | DETAILED | PROCEDURAL
   LANGUAGE: BUSINESS | TECHNICAL | OPERATIONAL
   ```
4. Flag risks that NO audience is receiving (communication blind spots)

**VERIFY:**
- ≥3 audiences identified
- Each audience has mapped sections and key risks
- No critical risk is absent from ALL audience views

**RENDER:** Include in `meta-audit.yaml` under `risk_communication:`

#### 7.1.5 Simpson's Paradox Audit (Method #605)

**EXTRACT:**

Check whether aggregate risk metrics hide dangerous subgroup patterns.

**Method #605 (embedded, 4 steps):**
1. Identify subgroups to analyze:
   - By component (frontend vs backend vs infrastructure)
   - By risk category (technical vs organizational vs external)
   - By genesis source (complexity vs coupling vs uncertainty etc.)
2. For EACH subgroup, calculate:
   - Subgroup average composite score
   - Subgroup distribution (CRITICAL/HIGH/MEDIUM/LOW counts)
3. Compare subgroup statistics to aggregate statistics:
   - IF subgroup has higher CRITICAL ratio than aggregate → POSSIBLE SIMPSON'S PARADOX
   - IF subgroup trend differs from aggregate trend → FLAG for investigation
4. For each paradox detected:
   ```
   PARADOX: [description]
   AGGREGATE: "[metric] shows [value]"
   SUBGROUP: "[subgroup] shows [different value]"
   IMPLICATION: "[what's hidden by aggregation]"
   ACTION: "[recommended disaggregation or attention]"
   ```

**VERIFY:**
- ≥3 subgroup analyses completed
- Any detected paradoxes flagged with specific implications

**RENDER:** Include in `meta-audit.yaml` under `simpsons_paradox_audit:`

#### 7.1.6 Goodhart's Law Check (Method #606)

**EXTRACT:**

Check whether risk metrics could be gamed when used as targets.

**Method #606 (embedded, 4 steps):**
1. List all risk metrics that will be used as KPIs/targets:
   - Coverage score (C ≥ target)
   - Risk count by severity
   - Mitigation completion rate
   - Leading indicator thresholds
   - Review cadence compliance
2. For EACH metric-as-target, ask:
   - "How could someone improve this metric WITHOUT reducing actual risk?"
   - "Does improving this metric GUARANTEE risk reduction?"
   - "Could optimizing this metric CREATE new risks?"
3. Flag gameable metrics:
   ```
   METRIC: [name]
   GAMING_VECTOR: [how it could be gamed]
   EXAMPLE: "[concrete scenario]"
   DEFENSE: [how to prevent gaming]
   ```
4. Recommend metric pairs (each metric paired with counter-metric that prevents gaming):
   - Risk count + severity distribution (can't just add LOW risks to inflate count)
   - Coverage score + ADVERSARY challenge results (can't achieve coverage by shallow analysis)
   - Mitigation completion + residual score improvement (can't mark done without effect)

**VERIFY:**
- All KPI metrics checked for gameability
- Gaming defenses designed for HIGH-risk gaming vectors
- Metric pairs recommended

**RENDER:** Include in `meta-audit.yaml` under `goodharts_law_check:`

**META AUDIT RENDER SCHEMA:**
```yaml
meta_audit:
  cognitive_bias_audit:
    biases_checked: [optimism, availability, confirmation, anchoring, groupthink]
    biases_detected:
      - bias: "[name]"
        evidence: "[how manifested]"
        affected_risks: ["R-xxx"]
        correction: "[adjustment]"
        severity: DISTORTS_SCORES | DISTORTS_PRIORITIES | MINOR
  risk_appetite_calibration:
    stated_appetite: "[description]"
    revealed_appetite: "[description]"
    gaps:
      - risk_id: "[R-xxx]"
        stated: "[what was said]"
        revealed: "[what was done]"
        gap: "[inconsistency]"
    verdict: ALIGNED | INCOHERENT
  portfolio_risk_view:
    total_expected_loss: "[amount]"
    survivable: YES | NO | MARGINAL
    concentration: "[description]"
    non_ergodic_exposure: {count: [N], combined_probability: [P]}
    verdict: ACCEPTABLE | CONCERNING | UNACCEPTABLE
  risk_communication:
    audiences:
      - name: "[audience]"
        relevant_sections: ["section1", ...]
        key_risks: ["R-xxx", ...]
        format: DASHBOARD | DETAILED | PROCEDURAL
  simpsons_paradox_audit:
    subgroups_analyzed: [count]
    paradoxes_detected:
      - description: "[paradox]"
        aggregate_value: "[metric]"
        subgroup_value: "[metric]"
        implication: "[hidden pattern]"
  goodharts_law_check:
    metrics_checked: [count]
    gameable_metrics:
      - metric: "[name]"
        gaming_vector: "[how]"
        defense: "[prevention]"
    metric_pairs: ["pair1", ...]
```

---

### 7.2 Risk Register Generation

**EXTRACT:**

Consolidate ALL risks from steps 1-6 into structured YAML.

1. Load RISK_SCORES from step-03 (complete list with 5D scores)
2. Load RISK_REGISTER_RECONCILIATION from step-04 (ADVERSARY adjustments + new risks)
3. Load MITIGATION_PORTFOLIO from step-05 (4T classification + Cobra checks for each risk)
4. Load MONITORING_SYSTEM from step-06 (leading indicators + cadence for each risk)
5. For EACH risk, merge ALL data into single record:
   - ID, description, genesis source, phase discovered
   - 5D scores (P/I/V/D/R + composite + tier + flags)
   - Mitigation strategy (4T + actions + owner + timeline + cost)
   - Monitoring (leading indicators + review frequency)
   - Interactions (triggers + triggered_by + correlates_with)
   - Residual scores (post-mitigation)
6. Sort by composite score (descending — highest risk first)

**VERIFY:**
- Count risks in register = count from RISK_REGISTER_RECONCILIATION (step-04) — delta MUST be 0
- ALL risks have ALL fields populated (no partial records)
- Sort order correct (descending composite)
- Residual scores present for all TREAT/TRANSFER risks

**RENDER:** `risk-register.yaml`
```yaml
risk_register:
  version: "[date]"
  depth: quick | standard | comprehensive | critical
  iteration: [count]
  risks:
    - id: "R-001"
      description: "[what]"
      genesis_source: "[which of 6 from step-00]"
      phase_discovered: GROUND | IDENTIFY_V | IDENTIFY_H | QUANTIFY | INTERACT
      scores:
        probability: {value: [0.0-1.0], evidence: "[basis]"}
        impact: {value: [1-5], evidence: "[basis]"}
        velocity: {value: [1-5], evidence: "[basis]"}
        detectability: {value: [1-5], evidence: "[basis]"}
        reversibility: {value: [1-5], evidence: "[basis]"}
        composite: [calculated]
        tier: CRITICAL | HIGH | MEDIUM | LOW
        flags: [NON_NEGOTIABLE, HIDDEN_CRITICAL, NO_WARNING]
      mitigation:
        strategy: TOLERATE | TREAT | TRANSFER | TERMINATE
        actions: ["action 1", ...]
        owner: "[person/team]"
        timeline: "[date]"
        cost: "[amount]"
        cobra_check: SAFE | COBRA_DETECTED
      monitoring:
        leading_indicators: ["indicator 1", ...]
        review_frequency: DAILY | WEEKLY | MONTHLY | QUARTERLY
      residual_scores:
        probability: [adjusted]
        impact: [adjusted]
        composite: [recalculated]
        tier: [new tier]
      interactions:
        triggers: ["R-xxx"]
        triggered_by: ["R-xxx"]
        correlates_with: ["R-xxx"]
  summary:
    total_risks: [count]
    by_tier: {critical: [N], high: [N], medium: [N], low: [N]}
    by_strategy: {tolerate: [N], treat: [N], transfer: [N], terminate: [N]}
    flagged: [count]
```

---

### 7.3 Risk Interaction Map Generation

**EXTRACT:**

Consolidate cascade chains + correlation matrix + common-mode failures from step-04.

1. Load CASCADE_MAP from step-04 (cascade chains with trigger→impact sequences)
2. Load CORRELATION_MATRIX from step-04 (risk-to-risk correlation strengths)
3. Load COMMON_MODE_FAILURES from step-04 (single points affecting multiple risks)
4. Load CONCENTRATION_RISKS from step-04 (HHI index results)
5. Merge into single interaction map

**VERIFY:**
- All risk IDs in interaction map exist in risk register (no orphan references)
- Cascade chain directions consistent (A triggers B ≠ B triggers A unless documented as bidirectional)
- Correlation strengths coherent (if A correlates with B at 0.8, B correlates with A at 0.8)
- Common-mode failures reference valid component names from step-00

**RENDER:** `risk-interaction-map.yaml`
```yaml
risk_interaction_map:
  cascades:
    - chain_id: "C-001"
      root_cause: "R-xxx"
      sequence: [{risk: "R-xxx", mechanism: "[how]"}, ...]
      amplifiers: ["[what makes it worse]"]
      intervention_points: ["[where to break chain]"]
  correlations:
    matrix_size: [N×N]
    clusters:
      - name: "[cluster name]"
        risks: ["R-xxx", ...]
        correlation_strength: [0.0-1.0]
  common_mode_failures:
    - id: "CMF-001"
      single_point: "[component]"
      affected_risks: ["R-xxx", ...]
      swiss_cheese_layers: [count]
  concentration:
    hhi_index: [value]
    concentrated_dimensions: ["[dimension]"]
```

---

### 7.4 Mitigation Portfolio Generation

**EXTRACT:**

Consolidate 4T classification + cost-benefit + Cobra checks from step-05.

1. Load MITIGATION_PORTFOLIO from step-05 (all mitigations with 4T classification)
2. Load COBRA_EFFECT_CHECK from step-05 (Cobra verdict per mitigation)
3. Load RESIDUAL_RISK from step-05 (post-mitigation scores)
4. Aggregate by strategy (TOLERATE/TREAT/TRANSFER/TERMINATE counts and costs)

**VERIFY:**
- Every risk has exactly ONE 4T classification
- Every TREAT mitigation has cost-benefit analysis
- Every mitigation has Cobra check verdict
- Total mitigation cost calculated

**RENDER:** `mitigation-portfolio.yaml`
```yaml
mitigation_portfolio:
  strategy_distribution:
    tolerate: {count: [N], risk_ids: ["R-xxx"]}
    treat: {count: [N], total_cost: "[amount]", risk_ids: ["R-xxx"]}
    transfer: {count: [N], risk_ids: ["R-xxx"]}
    terminate: {count: [N], risk_ids: ["R-xxx"]}
  cobra_findings:
    checked: [count]
    safe: [count]
    cobra_detected: [count]
    cobras: [{risk_id: "R-xxx", effect: "[perverse outcome]", redesign: "[fix]"}]
  total_mitigation_cost: "[amount]"
  residual_risk_reduction: "[percentage improvement in composite scores]"
```

---

### 7.5 Monitoring System Generation

**EXTRACT:**

Consolidate leading indicators + review cadence + escalation + Cobra monitoring from step-06.

1. Load LEADING_INDICATORS from step-06 (indicators per risk)
2. Load REVIEW_CADENCE from step-06 (frequency assignments)
3. Load ESCALATION_PROTOCOL from step-06 (decision matrix)
4. Load COBRA_MONITORING_CHECK from step-06 (monitoring Cobra verdict)
5. Load ADVERSARIAL_MONITORING_TEST from step-06 (gaming vectors + defenses)

**VERIFY:**
- Top 10 risks have ≥1 leading indicator each
- Review frequencies coherent with risk velocity (fast risks → frequent review)
- Escalation protocol complete (decision matrix filled, authority defined)
- Cobra monitoring check passed for all 3 components

**RENDER:** `monitoring-system.yaml`
```yaml
monitoring_system:
  leading_indicators:
    - risk_id: "R-xxx"
      indicators:
        - name: "[indicator]"
          measurement: "[how to observe]"
          threshold: "[when to alert]"
          frequency: DAILY | WEEKLY | MONTHLY
  review_cadence:
    - tier: CRITICAL
      frequency: DAILY | WEEKLY
    - tier: HIGH
      frequency: WEEKLY | MONTHLY
    - tier: MEDIUM
      frequency: MONTHLY | QUARTERLY
    - tier: LOW
      frequency: QUARTERLY
  escalation_protocol:
    levels:
      - level: 1
        trigger: "[condition]"
        authority: "[who decides]"
        response_time: "[how fast]"
  cobra_monitoring_verdict: SAFE | REDESIGNED
  adversarial_test_verdict: HARDENED | ACCEPTABLE
```

---

### 7.6 Risk Report Generation

**EXTRACT:**

Generate human-readable risk report from all artifacts.

1. Load risk-register.yaml, risk-interaction-map.yaml, mitigation-portfolio.yaml, monitoring-system.yaml, meta-audit.yaml (if exists), coverage-score.yaml
2. For EACH section, extract relevant data and write prose summary:

**Report Sections (10 sections):**
1. **Executive Summary** (1-2 pages): Stakes from step-00, top 5 risks by composite, key recommendations, portfolio verdict
2. **Assessment Methodology**: Depth level, phases executed, coverage achieved, iterations completed, biases checked
3. **Risk Landscape**: By genesis source (6 categories), by severity tier, by system component
4. **Top Risks Deep Dive** (top 10): Description, 5D score with evidence, worst-case scenario, mitigation strategy, monitoring indicators
5. **Risk Interactions**: Cascade map summary, correlation clusters, common-mode failures, concentration analysis
6. **Mitigation Portfolio**: 4T strategy distribution, cost-benefit summary, Cobra Effect findings, residual risk improvement
7. **Monitoring System**: Leading indicators summary, review cadence, escalation protocol, Cobra monitoring findings
8. **Portfolio View** (if depth=comprehensive/critical): Aggregate assessment, concentration risks, non-ergodic exposure, survivability verdict
9. **Recommendations**: Prioritized actions (immediate/short-term/long-term), quick wins (low cost + high impact), strategic investments
10. **Appendices**: Full risk register reference, theoretical foundations used, META audit results (if comprehensive), ADVERSARY challenge log, assumptions registry

**VERIFY:**
- All 10 sections populated (or justified SCOPE_REDUCTION if depth=quick/standard)
- Executive summary covers top 5 risks (not top 3, not top 7)
- Recommendations are SPECIFIC to this assessment (not generic "monitor regularly")
- Cross-references between sections are valid (risk IDs match)

**RENDER:** `risk-report.md`

---

### 7.7 Coverage Score Calculation

**EXTRACT:**

Calculate assessment coverage using weighted formula.

1. Load all artifacts from steps 0-6
2. Score each dimension (0-100):

```
Coverage Score (C) = weighted sum of:
  - Genesis coverage (6 sources checked) × 0.20
    Score: (sources_with_risks / 6) × 100
  - Taxonomy coverage (10 categories checked) × 0.15
    Score: (categories_with_risks / 10) × 100
  - Horizontal coverage (boundaries/blind spots/temporal/scenarios) × 0.15
    Score: (horizontal_components_complete / 4) × 100
  - Quantification coverage (5D scores for all risks) × 0.15
    Score: (risks_scored / total_risks) × 100
  - Interaction coverage (cascades/correlations/common-mode) × 0.15
    Score: (interaction_components_complete / 3) × 100
  - Mitigation coverage (4T for all + Cobra checks) × 0.10
    Score: (risks_with_mitigation / total_risks) × 100
  - Monitoring coverage (indicators for top 10) × 0.10
    Score: (top10_with_indicators / 10) × 100

C = sum of (dimension_score × weight)

Target:
  Quick: C ≥ 15
  Standard: C ≥ 35
  Comprehensive: C ≥ 50
  Critical: C ≥ 65
```

3. Calculate actual score
4. Compare to target for selected depth
5. IF C < target → flag gaps (which dimensions below expectation)

**VERIFY:**
- Formula applied correctly (weights sum to 1.0)
- Each dimension score has backing data (not estimated)
- Gap analysis for below-target dimensions

**RENDER:** `coverage-score.yaml`
```yaml
coverage_score:
  depth: "[selected]"
  target: [number]
  actual: [calculated]
  verdict: PASS | BELOW_TARGET
  dimensions:
    genesis: {score: [N], weight: 0.20, weighted: [N]}
    taxonomy: {score: [N], weight: 0.15, weighted: [N]}
    horizontal: {score: [N], weight: 0.15, weighted: [N]}
    quantification: {score: [N], weight: 0.15, weighted: [N]}
    interaction: {score: [N], weight: 0.15, weighted: [N]}
    mitigation: {score: [N], weight: 0.10, weighted: [N]}
    monitoring: {score: [N], weight: 0.10, weighted: [N]}
  gaps:
    - dimension: "[name]"
      score: [actual]
      expected: [minimum for depth]
      gap: "[what's missing]"
```

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "META audit complete (all 6 methods, if depth=comprehensive/critical)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Risk register generated (ALL risks from ALL phases, delta=0)"
    status: PASS | FAIL
  - item: "Risk interaction map generated (cascades + correlations + common-mode)"
    status: PASS | FAIL
  - item: "Mitigation portfolio generated (4T + Cobra + residual)"
    status: PASS | FAIL
  - item: "Monitoring system generated (indicators + cadence + escalation)"
    status: PASS | FAIL
  - item: "Risk report generated (all 10 sections populated)"
    status: PASS | FAIL
  - item: "Coverage target met (C ≥ target for depth)"
    status: PASS | FAIL
  - item: "ASSUMPTIONS_DECLARED (≥3)"
    status: PASS | FAIL
  - item: "Counter-checks (CC7-01, CC7-02, CC7-03)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC7-01: Grounding Check (Method #85)**
1. Sample 3 recommendations from risk-report.md "Recommendations" section
2. For each: trace recommendation back to specific risk in register (risk ID referenced)
3. For each: verify recommendation is SPECIFIC (not generic "improve monitoring" — must name WHAT to monitor, WHO owns it, WHEN to implement)
4. For each: verify recommendation addresses root cause (not symptom)
5. Pass criteria: 3/3 recommendations are specific, grounded in analysis, address root cause

**CC7-02: Phantom Hunt (Method #168)**
1. Count risks in RISK_REGISTER_RECONCILIATION from step-04 (the final count after ADVERSARY)
2. Count risks in risk-register.yaml generated in 7.2
3. IF register_count > reconciliation_count → phantom risks added during output (hallucinated)
4. IF register_count < reconciliation_count → risks dropped during output (lost)
5. Count mitigations in step-05 vs mitigation-portfolio.yaml — must match
6. Count indicators in step-06 vs monitoring-system.yaml — must match
7. Pass criteria: ALL counts match (delta = 0 for risks, mitigations, indicators)

**CC7-03: Coherence Check (Method #84)**
1. Sample 5 risk IDs from risk-register.yaml
2. For each: verify same risk appears in risk-interaction-map.yaml (if it has interactions)
3. For each: verify cascade links use valid risk IDs (no R-999 that doesn't exist)
4. For each: verify mitigation in register matches mitigation in portfolio
5. For each: verify monitoring indicators in register match indicators in monitoring-system
6. Cross-check: coverage score dimensions match actual artifact contents (e.g., if genesis coverage = 100% but only 4 of 6 sources have risks → INCOHERENT)
7. Pass criteria: 0 incoherent references, 0 broken links, 0 mismatched data

---

## GATE_7 EVALUATION

**Conditions:** G7-01 through G7-09 from gates.yaml

**IF coverage < target AND iteration < max_iterations:**
→ Iterate: return to step-01, merge new findings, increment iteration counter.

**IF coverage ≥ target OR iteration = max_iterations:**
→ COMPLETE (if coverage < target → declare SCOPE_REDUCTION).

**IF GATE_7 PASS → ASSESSMENT COMPLETE.**

---

## ITERATION PROTOCOL

**IF iterating:**
1. Increment iteration counter
2. Return to step-01-identify-vertical
3. Merge new risks with existing risk-register.yaml
4. Re-evaluate affected phases (new risks → re-score → re-interact → re-mitigate)
5. Re-calculate coverage
6. Return to step-07, re-evaluate GATE_7

---

## ARTIFACTS OUTPUT

1. `meta-audit.yaml` (if depth=comprehensive/critical)
2. `risk-register.yaml` (consolidated, ALL risks)
3. `risk-interaction-map.yaml` (cascades + correlations)
4. `mitigation-portfolio.yaml` (4T + Cobra checks)
5. `monitoring-system.yaml` (indicators + cadence + escalation)
6. `risk-report.md` (executive summary + recommendations)
7. `coverage-score.yaml` (actual vs target)
8. `process-log.yaml` (execution trace, gate results, decisions, assumptions)

---

## COMPLETION

**IF GATE_7 PASS:**

```
+===========================================================================+
|                    DEEP RISK ASSESSMENT COMPLETE                          |
+===========================================================================+
|                                                                           |
|  Depth: [quick | standard | comprehensive | critical]                     |
|  Coverage: [score] / [target] -- [PASS | SCOPE_REDUCED]                   |
|  Total Risks: [count]                                                     |
|  Iterations: [count]                                                      |
|                                                                           |
|  OUTPUTS GENERATED:                                                       |
|  + Risk Register (risk-register.yaml)                                     |
|  + Risk Interaction Map (risk-interaction-map.yaml)                       |
|  + Mitigation Portfolio (mitigation-portfolio.yaml)                       |
|  + Monitoring System (monitoring-system.yaml)                             |
|  + Risk Report (risk-report.md)                                           |
|                                                                           |
|  TOP 5 RISKS:                                                             |
|  1. [Risk ID + one-line description]                                      |
|  2. [...]                                                                 |
|  3. [...]                                                                 |
|  4. [...]                                                                 |
|  5. [...]                                                                 |
|                                                                           |
|  KEY RECOMMENDATIONS:                                                     |
|  - [Recommendation 1]                                                     |
|  - [Recommendation 2]                                                     |
|  - [Recommendation 3]                                                     |
|                                                                           |
+===========================================================================+
```

**All artifacts saved to:** `{output_directory}/deep-risk-artifacts/`
