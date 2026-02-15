# 206 - Ergodicity Test

## Phase
QUANTIFY

## Purpose
For each high-impact risk, test whether the standard risk score (Probability × Impact) is meaningful for a single pass through time, or only meaningful for an ensemble of parallel runs.

## Theoretical Foundation

**Ergodicity** (from Peters, 2019):
- In an **ergodic** system, the time average equals the ensemble average
- In a **non-ergodic** system, they differ

**The Casino Analogy:**
- A casino playing 10,000 games simultaneously can accept a 5% chance of losing each game
- A person playing those 10,000 games sequentially CANNOT - because if you lose everything on game 47, you don't play game 48

**Most risk scores implicitly assume ergodicity.** This assumption is often wrong.

## The Core Question

> "If this risk materializes, can we recover and continue, or is it GAME OVER?"

## Procedure

### Step 1: Select High-Impact Risks
Test all risks where:
- Impact (I) ≥ 4, OR
- Reversibility (R) ≥ 4

### Step 2: Ensemble Framing
Ask: "Across 100 similar projects, X% would experience this."

In this framing, expected value calculation works:
- EV = P × I
- If EV is acceptable across the portfolio, the risk is manageable

### Step 3: Time-Series Framing
Ask: "For OUR ONE project, if this hits, what happens NEXT?"

Key question: Can we play the next round?

| If answer is... | Then... |
|-----------------|---------|
| "We recover and continue" | Risk is ergodic |
| "Nothing - project is dead" | Risk is NON-ERGODIC |

### Step 4: Classify
- **Ergodic:** We can absorb this loss and continue. Standard scoring applies.
- **Non-ergodic:** This loss is potentially fatal. **No amount of small wins compensates.**

### Step 5: Strategy Implication
For non-ergodic risks, traditional P × I optimization doesn't apply.

Strategy shifts to:
- **AVOID** the risk entirely if possible
- **LIMIT** maximum exposure (position sizing)
- Ensure **SURVIVAL** first, optimize second

## Output Schema
```yaml
ergodicity_tests:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    impact_score: 5
    reversibility_score: 4

    ensemble_framing:
      statement: "How this looks across many instances"
      probability: "X% of similar projects"
      expected_value: "Acceptable in portfolio"

    time_series_framing:
      statement: "What happens to US if this hits"
      next_round_possible: "[Yes|No|Maybe]"
      recovery_path: "How we would recover (if possible)"
      game_over_scenario: "What 'game over' looks like"

    classification: "[Ergodic|Non-Ergodic]"
    confidence: "[High|Medium|Low]"

    strategy_implication:
      standard_pxi_applies: "[true|false]"
      recommended_approach: "What to do differently"
      survival_first: "[true|false]"
```

## Quality Checks
- [ ] All I≥4 or R≥4 risks tested
- [ ] Both framings explicitly analyzed
- [ ] Classification justified
- [ ] Strategy implications documented
- [ ] Non-ergodic risks flagged for special treatment

## Connections
- Feeds into: #201 (NON_ERGODIC flag), #401 (strategy override)
- Uses output from: #201 (impact/reversibility scores), #205 (worst case)
- Related to: Theoretical Foundations (Non-Ergodicity)

## Examples

### Ergodic Risk: Pipeline Failure
```yaml
risk_id: "RISK-023"
title: "Data pipeline fails during batch processing"
impact_score: 4
reversibility_score: 3

ensemble_framing:
  statement: "20% of data pipelines have significant failures per year"
  probability: "~20%"
  expected_value: "Acceptable - factor into planning"

time_series_framing:
  statement: "If our pipeline fails, we fix it and resume"
  next_round_possible: Yes
  recovery_path: "Debug, fix, reprocess affected data"
  game_over_scenario: "N/A - not existential"

classification: Ergodic
confidence: High

strategy_implication:
  standard_pxi_applies: true
  recommended_approach: "Standard mitigation, monitoring, incident response"
  survival_first: false
```

### Non-Ergodic Risk: Client Contract Termination
```yaml
risk_id: "RISK-067"
title: "Primary client (60% of revenue) terminates contract"
impact_score: 5
reversibility_score: 5

ensemble_framing:
  statement: "~15% of vendor contracts terminated annually"
  probability: "~15%"
  expected_value: "P=15% × I=catastrophic = 'acceptable' by math, but..."

time_series_framing:
  statement: "If Mars terminates, 60% of team revenue disappears"
  next_round_possible: No
  recovery_path: "Would require major restructuring, layoffs, may not survive"
  game_over_scenario: "Team dissolution, layoffs, reputational damage"

classification: Non-Ergodic
confidence: High

strategy_implication:
  standard_pxi_applies: false
  recommended_approach: |
    - DIVERSIFY client base (reduce exposure)
    - CONTRACT protections (transfer via penalties)
    - RELATIONSHIP management (avoid trigger)
    - DO NOT accept P=15% as "low priority"
  survival_first: true
```

### Non-Ergodic Risk: Regulatory Violation
```yaml
risk_id: "RISK-078"
title: "Material regulatory compliance failure"
impact_score: 5
reversibility_score: 5

ensemble_framing:
  statement: "~5% of companies face significant regulatory action annually"
  probability: "~5%"
  expected_value: "Low probability, but..."

time_series_framing:
  statement: "If we face regulatory action, license could be revoked"
  next_round_possible: Maybe
  recovery_path: "Remediation possible but expensive and damaging"
  game_over_scenario: "Loss of operating license, criminal liability"

classification: Non-Ergodic
confidence: High

strategy_implication:
  standard_pxi_applies: false
  recommended_approach: |
    - COMPLIANCE must be non-negotiable
    - AUDIT regularly to catch issues early
    - LEGAL review of all edge cases
    - P=5% is NOT acceptable for existential risk
  survival_first: true
```

## Key Insight

**Expected value is a useful fiction that only works if you can play multiple times.**

For one-shot games (your career, your company, your project), the math of expected value can lead you astray.

A rational person should NOT accept:
- 1% chance of losing everything for a 10% expected gain
- Even though EV = 0.99 × 1.10 - 0.01 × 1.0 = positive

Because if you're in the 1%, you don't get to play again.

## Non-Ergodic Risk Handling Rules

1. **Never use expected value** for non-ergodic risks
2. **Survival threshold** trumps optimization
3. **Position sizing** - limit exposure to non-ergodic risks
4. **Redundancy** - ensure alternatives exist
5. **Early warning** - maximum detection investment
6. **Terminate or Transfer** preferred over Treat or Tolerate
