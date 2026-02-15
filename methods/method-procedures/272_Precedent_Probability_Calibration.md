# 204 - Precedent Probability Calibration

## Phase
QUANTIFY

## Purpose
Calibrate probability using base rates from historical data and reference class forecasting. Counteracts optimism bias and planning fallacy.

## Core Concept: Reference Class Forecasting

Instead of inside-view estimation ("what's special about our project"), use outside-view calibration ("what happens to projects like this").

| Approach | Question | Typical Result |
|----------|----------|----------------|
| **Inside View** | "What are our specific factors?" | Optimistic - we focus on what's different |
| **Outside View** | "What's the base rate for this class?" | Realistic - based on actual outcomes |

## Procedure

### Step 1: Define Reference Class
For each risk, identify: "What type of event is this?"

The reference class should be:
- Specific enough to be relevant
- Broad enough to have statistical data
- Based on observable characteristics, not intentions

### Step 2: Find Base Rate
"How often do events in this class actually occur?"

Sources:
- Industry reports (Standish, Gartner, Verizon DBIR)
- Public incident data
- Internal historical data
- Published research

### Step 3: Anchor to Base Rate
Start with the base rate, then adjust for project-specific factors.

**Key principle:** Adjust conservatively. Reasons to deviate from base rate should be strong and documented.

### Step 4: Survivorship Correction
Published base rates likely underestimate because failures are under-reported.

Apply survivorship correction factor (typically 1.2x to 1.5x upward).

### Step 5: Compare to Initial Estimate
If calibrated P differs significantly from initial estimate (#201), investigate:
- Why the discrepancy?
- Which is more reliable?
- Update the score with rationale

## Reference Class Examples

### Project Management

| Risk Type | Base Rate | Source |
|-----------|----------|--------|
| Enterprise SW project >50% over budget | ~66% | Standish CHAOS, Flyvbjerg |
| IT project fails to deliver expected value | ~70% | McKinsey, Standish |
| Large IT project severely over budget (>200%) | ~15% | Flyvbjerg |
| Project timeline slips | ~75% | Various |

### Infrastructure

| Risk Type | Base Rate | Source |
|-----------|----------|--------|
| Cloud major outage per region per year | ~2-4 incidents | Public incident reports |
| Database corruption requiring restore | ~2-5% annually | Industry surveys |
| Deployment causes production incident | ~5-15% | DevOps research |

### Security

| Risk Type | Base Rate | Source |
|-----------|----------|--------|
| Critical CVE in popular npm package/year | ~15-30 | NVD data |
| Data breach per year (mid-size company) | ~10-15% | Verizon DBIR |
| Phishing success rate | ~3-5% | Security research |
| Supply chain attack affecting dependencies | ~5-10% annually | Sonatype reports |

### People

| Risk Type | Base Rate | Source |
|-----------|----------|--------|
| Key person departure within 12 months | ~15-25% | Industry turnover |
| Technical hire fails probation | ~10-15% | HR research |
| Team burnout during crunch | ~30-50% | Developer surveys |

### Vendor/Dependency

| Risk Type | Base Rate | Source |
|-----------|----------|--------|
| SaaS provider significant outage/year | ~2-6 hours | SLA reports |
| API breaking change within 2 years | ~20-40% | Version history analysis |
| Vendor acquired/pivots within 3 years | ~10-20% | Market research |

## Output Schema
```yaml
calibrated_risks:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    initial_P: 3
    initial_rationale: "Original probability reasoning"

    reference_class:
      class_name: "Type of event"
      class_definition: "How this class is defined"
      relevance: "Why this class applies"

    base_rate:
      value: "X%"
      source: "Where this data comes from"
      confidence: "[High|Medium|Low]"

    adjustment:
      direction: "[Higher|Lower|Same]"
      factor: 1.2
      rationale: "Why we adjusted from base rate"

    survivorship_correction:
      applied: true
      factor: 1.3
      rationale: "Under-reporting likely in this domain"

    calibrated_P:
      value: 4
      probability_range: "35-55%"
      confidence: "[High|Medium|Low]"

    discrepancy:
      initial_vs_calibrated: "P3 → P4"
      explanation: "Base rate higher than intuitive estimate"
      resolution: "Updated to calibrated value"
```

## Quality Checks
- [ ] Reference class clearly defined
- [ ] Base rate sourced and cited
- [ ] Adjustment rationale documented
- [ ] Survivorship correction considered
- [ ] Final P compared to initial estimate
- [ ] Discrepancies explained

## Connections
- Feeds into: #201 (calibrated probability scores)
- Uses output from: #106 (historical patterns)
- Related to: Theoretical Foundations (Survivorship Bias)

## Example: Project Delay Risk

```yaml
risk_id: "RISK-055"
title: "Data platform migration takes longer than planned"
initial_P: 2
initial_rationale: "We have experienced team and good planning"

reference_class:
  class_name: "Enterprise data platform migration"
  class_definition: "Moving from legacy data warehouse to modern platform, >$1M budget"
  relevance: "Our project matches these characteristics"

base_rate:
  value: "66% experience >50% schedule overrun"
  source: "Standish CHAOS report, Flyvbjerg megaproject research"
  confidence: High

adjustment:
  direction: Same
  factor: 1.0
  rationale: "No strong evidence we're different from reference class.
              Experienced team is table stakes, not differentiator."

survivorship_correction:
  applied: true
  factor: 1.2
  rationale: "Failed projects often quietly cancelled, not reported"

calibrated_P:
  value: 4
  probability_range: "55-70%"
  confidence: High

discrepancy:
  initial_vs_calibrated: "P2 → P4"
  explanation: "Inside view optimism. Base rate significantly higher than
                intuitive estimate. This is the planning fallacy in action."
  resolution: "Updated to P4. Team notified of calibration."
```

## Common Calibration Errors

1. **Ignoring base rates:** "Our project is different" without evidence
2. **Narrow reference class:** Cherry-picking favorable comparison set
3. **Anchoring to hope:** Using base rate as ceiling, not anchor
4. **Forgetting survivorship:** Published success rates are biased
5. **Overconfident adjustment:** Large deviations without strong rationale
