# #207 Economic Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if it's WORTH doing (costs vs benefits)

## Theoretical Foundation

Even if technically achievable, if costs exceed benefits, the project is economically infeasible.

**Key insight:** Include ALL costs (visible and hidden) and compare against alternatives. Strategic value may justify negative direct ROI.

## What to do

1. Estimate total cost (all categories)
2. Estimate total benefit (tangible and strategic)
3. Calculate ROI, payback, NPV
4. Sensitivity analysis
5. Compare against alternatives

## Cost Categories

| Category | Components |
|----------|------------|
| **Development** | Labor, contractors, training |
| **Infrastructure** | Cloud resources, licenses, tools |
| **Operations** | Ongoing support, monitoring |
| **Maintenance** | Updates, bug fixes, enhancements |
| **Opportunity** | What else could this budget achieve? |
| **Hidden** | Context switching, learning curve, technical debt |

## Step-by-step

### Step 1: Estimate Total Cost

```
DEVELOPMENT COSTS:
□ Internal labor: FTE × months × rate
□ Contractors/consultants
□ Training
□ Tools and licenses (one-time)

INFRASTRUCTURE COSTS:
□ Cloud resources (projected usage)
□ Software licenses (recurring)
□ Environment costs

OPERATIONS COSTS:
□ Support team allocation
□ Monitoring and alerting
□ Incident response

MAINTENANCE COSTS:
□ Planned updates
□ Bug fixes
□ Enhancement budget

HIDDEN COSTS:
□ Context switching during development
□ Learning curve productivity loss
□ Technical debt servicing
```

### Step 2: Estimate Total Benefit

```
DIRECT BENEFITS:
□ Revenue increase
□ Cost savings
□ Efficiency gains
□ Risk reduction (quantified)
□ Compliance (penalty avoidance)

STRATEGIC BENEFITS:
□ Capability building
□ Market positioning
□ Competitive advantage
□ Platform for future
□ Organizational learning
```

### Step 3: Calculate ROI

```
ROI = (Total Benefit - Total Cost) / Total Cost × 100%

Example:
Total Cost: $500,000
Total Benefit: $1,500,000 over 3 years
ROI = ($1,500,000 - $500,000) / $500,000 = 200%
```

### Step 4: Calculate Payback Period

```
When does cumulative benefit exceed cumulative cost?

Year 0: Cost $500K, Benefit $0 → Net: -$500K
Year 1: Cost $50K, Benefit $400K → Net: -$150K
Year 2: Cost $50K, Benefit $500K → Net: +$300K

Payback: ~1.3 years
```

### Step 5: Sensitivity Analysis

```
What if costs increase? What if benefits decrease?

Base case: ROI = 200%

Costs +50%: ROI = 100% (still positive)
Benefits -30%: ROI = 110% (still positive)
Both: ROI = 40% (marginal but positive)

Break-even: Costs can increase 200% OR benefits decrease 67%
```

### Step 6: Compare Alternatives

```
Option A (Build): Cost $500K, Benefit $1.5M, ROI 200%
Option B (Buy): Cost $300K, Benefit $1.0M, ROI 233%
Option C (Do nothing): Cost $0, Benefit $0, Risk of penalty $500K
```

### Step 7: Score Economic Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Strong positive ROI, short payback, low sensitivity |
| 4 | Positive ROI, reasonable payback |
| 3 | Break-even or small positive with strategic value |
| 2 | Negative ROI unless strategic value considered |
| 1 | Strongly negative ROI, no clear strategic value |

## Output format

```yaml
economic_feasibility:
  score: 4
  confidence: "M"

  costs:
    development:
      labor: "$350,000"
      contractors: "$50,000"
      training: "$10,000"
      tools: "$15,000"
      subtotal: "$425,000"

    infrastructure:
      cloud_year1: "$36,000"
      cloud_ongoing: "$48,000/year"
      licenses: "$12,000/year"

    operations:
      support: "$24,000/year"

    total_year1: "$497,000"
    total_3_year: "$737,000"

  benefits:
    direct:
      compliance_penalty_avoided: "$200,000/year"
      efficiency_gains: "$100,000/year"
      manual_process_elimination: "$50,000/year"
      subtotal_annual: "$350,000/year"

    strategic:
      - benefit: "Foundation for future data platform"
        value: "Not quantified"
      - benefit: "Regulatory positioning"
        value: "Risk reduction"

    total_3_year: "$1,050,000"

  analysis:
    roi: "42%"  # (1050 - 737) / 737
    roi_note: "Conservative — excludes strategic value"
    payback_period: "1.7 years"
    npv_10_percent: "$213,000"

  sensitivity:
    cost_increase_breakeven: "+42%"
    benefit_decrease_breakeven: "-30%"
    assessment: "Moderately robust"

  alternatives:
    - option: "Build (this project)"
      cost: "$737K"
      benefit: "$1,050K"
      roi: "42%"
    - option: "Buy SaaS solution"
      cost: "$500K"
      benefit: "$800K"
      roi: "60%"
      note: "Less customizable, vendor lock-in"
    - option: "Do nothing"
      cost: "$0"
      benefit: "$0"
      risk: "EPR penalties starting 2025"

  recommendation: "Proceed — positive ROI with strategic upside"
```

## Integration Points

- **Feeds from:** #003 Scope, cost estimates, benefit analysis
- **Feeds to:** #401 Overall profile, decision justification

## Common Pitfalls

- **Underestimating costs:** Hidden costs, maintenance, opportunity cost
- **Overestimating benefits:** Optimistic projections, unvalidated assumptions
- **Ignoring alternatives:** Not comparing to buy/do-nothing options
- **Strategic value as escape hatch:** Using "strategic" to justify any cost
