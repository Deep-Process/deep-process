# 203 - Cost-of-Materialization Estimation

## Phase
QUANTIFY

## Purpose
Estimate concrete cost if each risk materializes - forces specificity beyond vague "High impact" labels. Converts abstract severity into actionable numbers.

## Cost Categories

| Category | Estimation Method | Units |
|----------|------------------|-------|
| **Direct Financial** | Rework hours × rate, infrastructure costs, penalties, legal fees | Currency |
| **Time** | Schedule delay, critical path impact | Days/Weeks |
| **Opportunity** | Market window missed, deals lost, advantage eroded | Currency/% |
| **Reputation** | Customer trust, employer brand, partner confidence | Qualitative → Currency |
| **Technical Debt** | Workaround complexity, refactoring cost, maintenance burden | Future effort |
| **Knowledge** | Information lost, learning wasted, decisions invalidated | Recovery cost |

## Procedure

### Step 1: Category Applicability
For each high-scoring risk (composite ≥30), identify which cost categories apply.

### Step 2: Three-Point Estimation
For each applicable category, estimate:
- **Best case:** If we're lucky
- **Most likely:** Expected outcome
- **Worst case:** If things go badly

### Step 3: Expected Cost Calculation
```
Expected Cost = (Best + 4×Likely + Worst) / 6
```
This PERT formula weights the most likely outcome while accounting for variance.

### Step 4: Fat-Tail Adjustment
If risk is flagged FAT_TAIL (#201):
- The worst case is MORE likely than formula assumes
- Use percentile estimates instead:
  - P50 (median expected)
  - P90 (bad case)
  - P99 (tail case)
- Decision-making should use P90/P99, not expected value

### Step 5: Aggregate by Category
Sum costs across all risks by category for portfolio view.

## Output Schema
```yaml
cost_estimates:
  - risk_id: "RISK-XXX"
    title: "Risk short description"
    composite_score: 45

    estimates:
      - category: "Direct Financial"
        applicable: true
        best_case: 50000
        likely_case: 150000
        worst_case: 500000
        expected: 175000
        currency: "USD"
        rationale: "Rework estimate based on similar past incident"

      - category: "Time"
        applicable: true
        best_case: "3 days"
        likely_case: "2 weeks"
        worst_case: "6 weeks"
        expected: "2.5 weeks"
        rationale: "Based on team capacity and parallel work"

      - category: "Reputation"
        applicable: true
        best_case: "Internal awareness only"
        likely_case: "Client escalation, VP involvement"
        worst_case: "Public disclosure, PR response needed"
        expected: "Client escalation"
        estimated_cost: 100000
        rationale: "Client relationship repair, potential discount"

    fat_tail_adjusted: false
    p90_estimate: null
    p99_estimate: null

    total_expected_cost: 275000
    confidence: "[High|Medium|Low]"
```

## Quality Checks
- [ ] All HIGH/CRITICAL risks have cost estimates
- [ ] All applicable categories assessed
- [ ] Three-point estimation used
- [ ] Fat-tail risks use percentile estimates
- [ ] Rationale provided for estimates
- [ ] Confidence level stated

## Connections
- Feeds into: #402 (cost-benefit), #603 (portfolio metrics)
- Uses output from: #201 (scores and flags)
- Related to: #205 (worst-case narratives)

## Examples

### Example 1: Data Pipeline Failure
```yaml
risk_id: "RISK-023"
title: "Source system schema change breaks pipeline"
composite_score: 80

estimates:
  - category: "Direct Financial"
    applicable: true
    best_case: 10000
    likely_case: 40000
    worst_case: 150000
    expected: 50000
    currency: "USD"
    rationale: "Engineer time: 2-20 person-days @ $1000/day, plus infrastructure"

  - category: "Time"
    applicable: true
    best_case: "4 hours"
    likely_case: "2 days"
    worst_case: "1 week"
    expected: "2.5 days"
    rationale: "Detection, diagnosis, fix, reprocess"

  - category: "Opportunity"
    applicable: true
    best_case: 0
    likely_case: 20000
    worst_case: 100000
    expected: 30000
    rationale: "Delayed business decisions, potential SLA breach"

total_expected_cost: 80000
confidence: Medium
```

### Example 2: Key Person Departure (Fat-Tail)
```yaml
risk_id: "RISK-045"
title: "Senior architect leaves without knowledge transfer"
composite_score: 60

estimates:
  - category: "Direct Financial"
    applicable: true
    # Standard three-point
    best_case: 50000
    likely_case: 200000
    worst_case: 1000000
    expected: 275000

    # Fat-tail adjustment
    fat_tail_flag: true
    p50_estimate: 200000
    p90_estimate: 600000
    p99_estimate: 1500000
    rationale: "Recruitment, onboarding, and potential project delays.
                Fat-tail: Worst case includes project failure if critical
                knowledge is truly unrecoverable."

  - category: "Time"
    applicable: true
    best_case: "2 months"
    likely_case: "6 months"
    worst_case: "18 months"
    expected: "7 months"
    fat_tail_flag: true
    p90_estimate: "12 months"
    rationale: "Time to find, hire, and ramp replacement"

  - category: "Knowledge"
    applicable: true
    best_case: "Minimal - well documented"
    likely_case: "Significant - 6 months to rebuild context"
    worst_case: "Critical - some knowledge permanently lost"
    estimated_cost: 150000
    rationale: "Learning curve, mistakes during gap, lost institutional knowledge"

total_expected_cost: 425000
fat_tail_adjusted_p90: 750000
confidence: Low  # High uncertainty
```

## Monetizing Non-Financial Costs

| Category | Monetization Approach |
|----------|----------------------|
| **Time delay** | Delay cost = (project daily burn rate) × days |
| **Reputation** | Estimated customer/revenue at risk × probability of loss |
| **Technical debt** | Future refactoring cost + maintenance overhead |
| **Knowledge loss** | Relearning cost + error correction cost |

## Estimation Pitfalls

1. **Anchoring:** Don't let first estimate constrain range
2. **Optimism bias:** Worst case is usually worse than first thought
3. **Hidden costs:** Include ripple effects (other teams, future work)
4. **Forgetting categories:** Time cost often underestimated
5. **False precision:** Round numbers are fine; $127,543 implies false accuracy
