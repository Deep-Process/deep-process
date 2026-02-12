---
step: 7
name: OUTPUT
phase: OUTPUT
gate: GATE_7
time_estimate: "45-60 min"
goal: "Generate risk assessment outputs and validate coverage"
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
  - id: A7-02
    assumption: "Coverage score methodology: [formula from data/coverage-scoring.yaml]"
```

---

## ENFORCED SEQUENCE

### 7.1 META Audit (Methods #601-606)

**IF depth=quick/standard → skip META audit, go to 7.2**
**IF depth=comprehensive/critical → execute all 6 META methods:**

**Method #601 — Cognitive Bias Audit:** Check for optimism bias, availability bias, confirmation bias.
**Method #602 — Risk Appetite Calibration:** Stated appetite vs revealed appetite (gap analysis).
**Method #603 — Portfolio Risk View:** Aggregate risks, check portfolio acceptable even if individual risks OK.
**Method #604 — Risk Communication Framework:** Right view for right audience.
**Method #605 — Simpson's Paradox Audit:** Aggregate metrics hide dangerous subgroup patterns?
**Method #606 — Goodhart's Law Check:** Risk metrics gamed as targets?

**Render:** `meta-audit.yaml`

### 7.2 Risk Register Generation

**Extract:** Consolidate ALL risks from steps 1-6 into structured YAML.

```yaml
risk_register:
  version: "[date]"
  depth: quick | standard | comprehensive | critical
  risks:
    - id: "[R-001]"
      description: "[what]"
      genesis_source: "[which of 6 from step-00]"
      phase_discovered: GROUND | IDENTIFY_V | IDENTIFY_H | QUANTIFY | INTERACT
      scores:
        probability: [0.0-1.0]
        impact: LOW | MEDIUM | HIGH | CRITICAL
        velocity: SLOW | MEDIUM | FAST | INSTANT
        detectability: EASY | MEDIUM | HARD | IMPOSSIBLE
        reversibility: EASY | MEDIUM | HARD | IRREVERSIBLE
        composite: [calculated score]
      mitigation:
        strategy: TOLERATE | TREAT | TRANSFER | TERMINATE
        actions: ["action 1", ...]
        owner: "[person/team]"
        timeline: "[date]"
        cost: "[amount]"
      monitoring:
        leading_indicators: ["indicator 1", ...]
        review_frequency: DAILY | WEEKLY | MONTHLY | QUARTERLY
      residual_score: {...}
      interactions:
        triggers: ["risk IDs this risk triggers"]
        triggered_by: ["risk IDs that trigger this"]
        correlates_with: ["risk IDs that correlate"]
```

**Verify:** ALL risks from ALL phases included (no gaps).
**Render:** `risk-register.yaml`

### 7.3 Risk Interaction Map Generation

**Extract:** Cascade graph + correlation matrix from step-04.
**Render:** `risk-interaction-map.yaml`

### 7.4 Mitigation Portfolio Generation

**Extract:** 4T classification + Cobra checks from step-05.
**Render:** `mitigation-portfolio.yaml`

### 7.5 Monitoring System Generation

**Extract:** Leading indicators + cadence + escalation from step-06.
**Render:** `monitoring-system.yaml`

### 7.6 Risk Report Generation

**Extract:** Executive summary + portfolio view + recommendations.

**Template:** `data/risk-report-template.md`

**Sections:**
1. Executive Summary (1-2 pages: stakes, top 5 risks, key recommendations)
2. Assessment Methodology (depth level, phases executed, coverage achieved)
3. Risk Landscape (by genesis source, by category, by severity)
4. Top Risks Deep Dive (top 10 risks: description, score, mitigation, monitoring)
5. Risk Interactions (cascade map, correlation matrix, common-mode failures)
6. Mitigation Portfolio (4T strategy distribution, cost-benefit summary, Cobra Effect findings)
7. Monitoring System (leading indicators, review cadence, escalation protocol)
8. Portfolio View (aggregate risk assessment, concentration risks, non-ergodic risks)
9. Recommendations (prioritized actions, quick wins, strategic investments)
10. Appendices (full risk register, theoretical foundations, META audit if comprehensive)

**Render:** `risk-report.md`

### 7.7 Coverage Score Calculation

**Formula:** From `data/coverage-scoring.yaml`

```
Coverage Score (C) = weighted sum of:
  - Genesis coverage (6 sources checked) × 0.20
  - Taxonomy coverage (10 categories checked) × 0.15
  - Horizontal coverage (boundaries/blind spots/temporal/scenarios) × 0.15
  - Quantification coverage (5D scores for all) × 0.15
  - Interaction coverage (cascades/correlations/common-mode) × 0.15
  - Mitigation coverage (4T for all + Cobra checks) × 0.10
  - Monitoring coverage (indicators for top 10) × 0.10

Target:
  Quick: C ≥ 15
  Standard: C ≥ 35
  Comprehensive: C ≥ 50
  Critical: C ≥ 65
```

**Verify:** Calculate actual coverage.
**Render:** `coverage-score.yaml`

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "META audit complete (if depth=comprehensive/critical)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Risk register generated (ALL risks included)"
    status: PASS | FAIL
  - item: "Risk interaction map generated"
    status: PASS | FAIL
  - item: "Mitigation portfolio generated"
    status: PASS | FAIL
  - item: "Monitoring system generated"
    status: PASS | FAIL
  - item: "Risk report generated (all sections)"
    status: PASS | FAIL
  - item: "Coverage target met (C ≥ target for depth)"
    status: PASS | FAIL
  - item: "ASSUMPTIONS_DECLARED (≥2)"
    status: PASS | FAIL
  - item: "Counter-checks (CC7-01, CC7-02, CC7-03)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC7-01:** Sample 3 recommendations → verify grounded in analysis (not generic).
**CC7-02:** Re-scan artifacts → verify no phantoms added during output.
**CC7-03:** Coherence check → verify register ↔ interaction map links valid.

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
8. `assumptions-output.yaml`
9. `counter-checks-output.yaml`
10. `post-phase-checklist-output.yaml`

---

## COMPLETION

**IF GATE_7 PASS:**

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DEEP RISK ASSESSMENT COMPLETE                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Depth: [quick | standard | comprehensive | critical]                     ║
║  Coverage: [score] / [target] — [PASS | SCOPE_REDUCED]                   ║
║  Total Risks: [count]                                                      ║
║  Iterations: [count]                                                       ║
║                                                                            ║
║  OUTPUTS GENERATED:                                                        ║
║  ✓ Risk Register (risk-register.yaml)                                    ║
║  ✓ Risk Interaction Map (risk-interaction-map.yaml)                      ║
║  ✓ Mitigation Portfolio (mitigation-portfolio.yaml)                      ║
║  ✓ Monitoring System (monitoring-system.yaml)                            ║
║  ✓ Risk Report (risk-report.md)                                          ║
║                                                                            ║
║  TOP 5 RISKS:                                                              ║
║  1. [Risk ID + one-line description]                                      ║
║  2. [...]                                                                  ║
║  3. [...]                                                                  ║
║  4. [...]                                                                  ║
║  5. [...]                                                                  ║
║                                                                            ║
║  KEY RECOMMENDATIONS:                                                      ║
║  • [Recommendation 1]                                                      ║
║  • [Recommendation 2]                                                      ║
║  • [Recommendation 3]                                                      ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**All artifacts saved to:** `{output_directory}/deep-risk-artifacts/`
