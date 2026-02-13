# #301 Reference Class Forecasting

**Phase:** 3 (VALIDATE)
**Tier:** 1 — Mandatory for standard+ depths
**Purpose:** Replace inside-view estimates with outside-view base rates

## Theoretical Foundation

Based on Flyvbjerg's Reference Class Forecasting (2006). The only proven antidote to planning fallacy.

**Key insight:** Inside view ("our project is special") is systematically worse than outside view ("what happens to projects like this"). External base rates beat internal analysis.

## What to do

1. Define the reference class for this project
2. Find base rate data for that class
3. Start from base rate, then make modest adjustments
4. Produce calibrated estimate anchored to external data

## Why Reference Class Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INSIDE VIEW vs OUTSIDE VIEW                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INSIDE VIEW (Your Analysis)              OUTSIDE VIEW (Reference Class)    │
│  ─────────────────────────────            ──────────────────────────────    │
│  "Our project is special"                 "What happens to projects like    │
│                                            this?"                           │
│                                                                              │
│  Focuses on unique details                Focuses on statistical patterns   │
│                                                                              │
│  Systematically optimistic                Empirically calibrated            │
│  (planning fallacy)                       (base rates)                      │
│                                                                              │
│  "We'll deliver on time because           "25% of similar projects          │
│   we have a good plan"                     delivered on time"               │
│                                                                              │
│  Result: Overconfident, usually wrong     Result: Calibrated, more accurate │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Define Reference Class

Ask: "What type of project is this?"

Common reference classes:
- Enterprise data platform
- Cloud migration
- Regulatory compliance system
- Greenfield software product
- Infrastructure automation
- System integration
- Legacy modernization
- ML/AI implementation

Be specific enough to find relevant data, general enough to have sufficient cases.

### Step 2: Find Base Rates

Sources:
- Standish Group CHAOS reports
- Flyvbjerg meta-analyses
- Industry benchmarks (Gartner, Forrester)
- Company historical data
- Published case studies

### Reference Class Base Rates

| Project Type | On-Time | On-Budget | Full Scope | Avg Cost Overrun | Avg Schedule Overrun |
|-------------|---------|-----------|------------|-----------------|---------------------|
| Enterprise data platform | ~25% | ~30% | ~40% | +60-100% | +50-80% |
| Cloud migration | ~30% | ~35% | ~45% | +40-80% | +40-60% |
| Regulatory compliance | ~35% | ~40% | ~50% | +30-60% | +30-50% |
| Greenfield software | ~20% | ~25% | ~35% | +100-200% | +80-150% |
| Infrastructure automation | ~40% | ~45% | ~55% | +30-50% | +30-50% |
| System integration | ~25% | ~30% | ~40% | +50-100% | +40-80% |
| Legacy modernization | ~20% | ~25% | ~35% | +80-150% | +60-100% |
| ML/AI implementation | ~15% | ~20% | ~30% | +100-200% | +100-150% |

*(Ranges from Standish CHAOS, Flyvbjerg meta-analyses, industry surveys)*

### Step 3: Start from Base Rate

**CRITICAL: Anchor to the base rate.**

Do NOT:
- Start from your internal estimate and "adjust"
- Dismiss base rate because "we're different"
- Average internal and external estimates

DO:
- Start from base rate
- Make MODEST adjustments for specific factors
- Remember: base rate is almost always more accurate

### Step 4: Adjust for Project-Specific Factors

**Factors that might make THIS project better than typical:**

| Factor | Adjustment | Evidence Required |
|--------|------------|------------------|
| Experienced team with same technology | +5-10% | Direct experience documented |
| Clear, stable requirements | +5-10% | Written, signed-off requirements |
| Proven architecture pattern | +5% | Reference implementation exists |
| Strong organizational support | +5% | Sponsor engagement documented |

**Factors that might make THIS project worse than typical:**

| Factor | Adjustment | Evidence Required |
|--------|------------|------------------|
| Novel technology combination | -10-15% | No direct precedent |
| Unclear or changing requirements | -10-15% | Requirements still evolving |
| Cross-organizational coordination | -5-10% | Multiple stakeholder groups |
| Tight timeline | -5-10% | Deadline driven, not scope driven |
| Inexperienced team | -10% | Team new to domain or tech |

**Cap adjustments:**
- Total positive adjustment: max +20%
- Total negative adjustment: no cap (can go to 0%)
- Net adjustment should be MODEST — the base rate is usually right

### Step 5: Produce Calibrated Estimate

```
Base rate (on-time): 25%
+ Experienced team: +5%
+ Clear requirements: +5%
- Cross-org coordination: -5%
- Novel combination: -10%
───────────────────────────
Calibrated probability: 20%
```

**Interpretation:** "Based on what happens to similar projects, there's about a 20% chance we deliver on time. Our internal estimate of 70% is likely overconfident."

## Output format

```yaml
reference_class:
  type: "Enterprise data platform with regulatory reporting"
  sources:
    - "Standish Group CHAOS Report 2024"
    - "Internal company data (12 similar projects)"

  base_rates:
    on_time: "25%"
    on_budget: "30%"
    full_scope: "40%"
    avg_cost_overrun: "+75%"
    avg_schedule_overrun: "+60%"

  adjustments:
    positive:
      - factor: "Team has Databricks experience"
        adjustment: "+5%"
        evidence: "3 prior Databricks projects completed"
      - factor: "Requirements mandated by regulation"
        adjustment: "+5%"
        evidence: "EPR requirements are fixed"

    negative:
      - factor: "Novel Databricks + Synapse integration"
        adjustment: "-10%"
        evidence: "No internal precedent for this combination"
      - factor: "Cross-org coordination (Mars + Lingaro)"
        adjustment: "-5%"
        evidence: "Different organizations, time zones"

    net_adjustment: "-5%"

  calibrated_estimates:
    on_time_probability: "20%"
    expected_schedule_overrun: "+65%"
    expected_cost_overrun: "+80%"
    confidence: "Medium"

  internal_estimate_comparison:
    internal_on_time: "70%"
    reference_class_on_time: "20%"
    gap: "50 percentage points"
    interpretation: "Internal estimate is significantly optimistic"
```

## The Uncomfortable Truth

**The estimate that feels uncomfortably pessimistic is usually the most accurate.**

If the calibrated estimate feels too pessimistic:
- That's the planning fallacy talking
- The base rate includes projects with experienced teams and good plans
- Your "special circumstances" probably aren't as special as they feel

## Integration Points

- **Feeds from:** Project characterization, internal estimates
- **Feeds to:** #205 Temporal Feasibility, #502 Hofstadter Correction, decision confidence

## Common Pitfalls

- **Dismissing the base rate:** "That's for other projects, not ours"
- **Over-adjusting:** More than +/-20% total adjustment is suspicious
- **Averaging with internal estimate:** Base rate should REPLACE internal estimate, not be averaged with it
- **Using wrong reference class:** Too broad (all IT projects) or too narrow (no data)
- **Ignoring negative factors:** Counting positives but explaining away negatives
