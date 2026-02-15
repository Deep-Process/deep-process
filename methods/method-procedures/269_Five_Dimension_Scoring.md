# 201 - Five-Dimension Risk Scoring

## Phase
QUANTIFY

## Purpose
Score each risk across five dimensions. Single-dimension scoring collapses critical information. P x I is necessary but insufficient - velocity, detectability, and reversibility complete the picture.

## The Five Dimensions

| Dimension | Scale | Question | Why It Matters |
|-----------|-------|----------|----------------|
| **P (Probability)** | 1-5 | How likely is this to occur? | Frequency of exposure |
| **I (Impact)** | 1-5 | How severe are the consequences? | Magnitude of harm |
| **V (Velocity)** | 1-5 | How fast does it materialize? | Time to respond |
| **D (Detectability)** | 1-5 | How hard to detect BEFORE impact? | Early warning capability |
| **R (Reversibility)** | 1-5 | How hard to recover? | Recovery possibility |

**Note:** For V, D, R: higher = worse (5 = instant/invisible/permanent)

## Composite Score Formula

```
Risk Score = P × I × max(V, D, R)
```

The `max()` captures the worst amplifier:
- Invisible (D=5) OR
- Irreversible (R=5) OR
- Instant (V=5)

Any one of these fundamentally changes the character of the risk.

## Calibration Anchors

### Probability (P)
| Score | Probability | Anchor |
|-------|------------|--------|
| 1 | <5% | Rare - unlikely in project lifetime |
| 2 | 5-20% | Uncommon - has happened to others |
| 3 | 20-50% | Possible - could go either way |
| 4 | 50-80% | Likely - more probable than not |
| 5 | >80% | Near-certain - assume it will happen |

### Impact (I)
| Score | Impact | Anchor |
|-------|--------|--------|
| 1 | Minor | Inconvenience, workaround exists, hours to resolve |
| 2 | Moderate | Noticeable delay or cost, contained to team |
| 3 | Significant | Requires plan revision, stakeholder notification |
| 4 | Major | Threatens project objectives, executive escalation |
| 5 | Catastrophic | Project failure, legal, safety, existential |

### Velocity (V)
| Score | Velocity | Anchor |
|-------|----------|--------|
| 1 | Months | Slow development, time to respond |
| 2 | Weeks | Gradual, can prepare response |
| 3 | Days | Moderate, some response time |
| 4 | Hours | Fast, limited response window |
| 5 | Instant | Immediate, no time to react |

### Detectability (D)
| Score | Detectability | Anchor |
|-------|---------------|--------|
| 1 | Obvious | Immediately visible, alerts fire |
| 2 | Easy | Routine monitoring catches it |
| 3 | Moderate | Requires investigation to find |
| 4 | Difficult | Only discovered under specific conditions |
| 5 | Invisible | No signal until impact occurs |

### Reversibility (R)
| Score | Reversibility | Anchor |
|-------|---------------|--------|
| 1 | Trivial | Undo button, minutes to restore |
| 2 | Easy | Standard rollback, hours |
| 3 | Moderate | Significant effort, days |
| 4 | Difficult | Major effort, weeks, partial loss |
| 5 | Permanent | Cannot be undone, data/trust/life lost |

## Risk Flags

### FAT_TAIL Flag
After scoring Impact, check:
- Is Impact ACTUALLY linear?
- Or is "Impact: 5" potentially 100x worse than "Impact: 4"?

If yes: mark as **FAT_TAIL**
- Composite score is an UNDERESTIMATE
- Use P90/P99 estimates in cost analysis
- Special handling in MITIGATE phase

### NON_ERGODIC Flag
From #206 Ergodicity Test:
- If risk materializing = potentially game over
- Mark as **NON_ERGODIC**
- Expected value calculations don't apply
- Survival-first response required

### LOW_CONFIDENCE Flag
From #002 Uncertainty Classification:
- If Knight-Uncertainty or Ambiguity (not true Risk)
- Mark as **LOW_CONFIDENCE**
- P score is an estimate, not a probability
- Don't treat low-confidence P=2 same as high-confidence P=2

## Tier Classification

Based on composite score:

| Tier | Score | Implication |
|------|-------|-------------|
| **CRITICAL** | ≥60 | Immediate attention required |
| **HIGH** | 30-59 | Active mitigation required |
| **MEDIUM** | 10-29 | Monitor and mitigate if practical |
| **LOW** | <10 | Accept or treat opportunistically |

## Output Schema
```yaml
scored_risks:
  - risk_id: "RISK-XXX"
    title: "Short description"

    scores:
      probability:
        value: 3
        rationale: "Why this probability"
      impact:
        value: 4
        rationale: "Why this impact"
      velocity:
        value: 2
        rationale: "Why this velocity"
      detectability:
        value: 4
        rationale: "Why this detectability"
      reversibility:
        value: 3
        rationale: "Why this reversibility"

    composite: 48  # P(3) × I(4) × max(V2,D4,R3) = 3×4×4
    tier: "HIGH"

    flags:
      fat_tail: false
      non_ergodic: false
      low_confidence: true
      flag_rationale: "P estimate based on expert judgment, not data"
```

## Quality Checks
- [ ] All five dimensions scored
- [ ] Rationale provided for each score
- [ ] Calibration anchors used
- [ ] Fat-tail flag assessed
- [ ] Ergodicity flag from #206 applied
- [ ] Confidence flag from #002 applied
- [ ] Tier assigned

## Connections
- Feeds into: #405 (residual risk), #401 (strategy selection), #603 (portfolio view)
- Uses output from: #001-#112 (risk identification), #002 (confidence), #206 (ergodicity)
- Related to: risk-scoring.yaml (full scale definitions)

## Example

```yaml
risk_id: "RISK-023"
title: "Source system schema change breaks pipeline"

scores:
  probability:
    value: 4
    rationale: "Source team makes changes quarterly, no notification process"
  impact:
    value: 4
    rationale: "Pipeline failure blocks all downstream reports"
  velocity:
    value: 5
    rationale: "Instant failure when incompatible data arrives"
  detectability:
    value: 4
    rationale: "Only detected when pipeline fails, no schema validation"
  reversibility:
    value: 2
    rationale: "Can revert to previous schema handler, lose daily data"

composite: 80  # 4 × 4 × 5 = 80
tier: "CRITICAL"

flags:
  fat_tail: false
  non_ergodic: false
  low_confidence: false
  flag_rationale: "Based on historical frequency of schema changes"
```
