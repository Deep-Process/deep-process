# 402 - Mitigation Cost-Benefit Analysis

## Phase
MITIGATE

## Purpose
Compare mitigation cost against expected loss. Prevents both under-investment (accepting too much risk) and over-investment (spending more on mitigation than the risk warrants).

## Core Formula

```
Mitigation Value = (Expected Loss WITHOUT) - (Expected Loss WITH) - (Mitigation Cost)

Where:
  Expected Loss = P × I × Exposure Duration
  Mitigation Cost = Implementation + Ongoing + Opportunity Cost
```

**Decision Rule:**
- Mitigation Value > 0 → Mitigation is justified
- Mitigation Value < 0 → Mitigation costs more than it saves

## Procedure

### Step 1: Calculate Expected Loss WITHOUT Mitigation
```
Expected Loss = P(risk) × I(cost) × Duration
```

Use cost estimates from #203.
Use probability from #201 (calibrated via #204).

### Step 2: Calculate Expected Loss WITH Mitigation
After mitigation:
- What's the new probability? (P_new)
- What's the new impact? (I_new)

```
Expected Loss (with) = P_new × I_new × Duration
```

### Step 3: Calculate Mitigation Cost
Total cost of mitigation:

| Component | Description | Example |
|-----------|-------------|---------|
| **Implementation** | One-time setup cost | Development time, infrastructure |
| **Ongoing** | Recurring cost | Maintenance, monitoring, licenses |
| **Opportunity** | What else could we do with these resources? | Alternative projects foregone |

```
Mitigation Cost = Implementation + (Ongoing × Duration) + Opportunity
```

### Step 4: Calculate Mitigation Value
```
Value = (Expected Loss WITHOUT) - (Expected Loss WITH) - (Mitigation Cost)
```

### Step 5: Apply Adjustments

#### Fat-Tail Adjustment
For FAT_TAIL risks (#201):
- Don't use expected value
- Use P90/P99 impact estimates
- Expected value systematically underestimates fat-tailed risks

#### Non-Ergodic Override
For NON_ERGODIC risks (#206):
- Cost-benefit is SECONDARY
- Primary question: "Can we survive without mitigation?"
- If NO → mitigate regardless of cost-benefit

## Output Schema
```yaml
cost_benefit:
  - risk_id: "RISK-XXX"
    title: "Risk description"

    without_mitigation:
      probability: 0.30
      impact: 150000
      duration_years: 2
      expected_loss: 90000  # 0.30 × 150000 × 2

    with_mitigation:
      probability: 0.10
      impact: 50000
      expected_loss: 10000  # 0.10 × 50000 × 2

    mitigation_cost:
      implementation: 25000
      ongoing_per_year: 5000
      duration_years: 2
      opportunity_cost: 10000
      total: 45000  # 25000 + (5000 × 2) + 10000

    analysis:
      loss_reduction: 80000  # 90000 - 10000
      net_value: 35000  # 80000 - 45000
      roi: "178%"  # (80000 - 45000) / 45000

    fat_tail_adjusted:
      applicable: false
      p90_without: null
      p90_with: null
      adjusted_value: null

    non_ergodic_override:
      applicable: false
      survival_question: null
      override_decision: null

    recommendation: "[Proceed|Reconsider|Reject]"
    rationale: "Explanation of recommendation"
```

## Quality Checks
- [ ] All costs identified (implementation + ongoing + opportunity)
- [ ] Pre and post-mitigation states estimated
- [ ] Fat-tail adjustment applied where needed
- [ ] Non-ergodic override considered
- [ ] Recommendation documented

## Connections
- Feeds into: #401 (informs Treat vs Tolerate decision)
- Uses output from: #201 (scores), #203 (cost estimates), #206 (ergodicity)
- Related to: #408 (regret minimization for uncertain cases)

## Examples

### Standard Cost-Benefit: Positive Value
```yaml
risk_id: "RISK-023"
title: "Source schema change breaks pipeline"

without_mitigation:
  probability: 0.80  # Very likely given history
  impact: 75000  # Rework + delays
  duration_years: 1
  expected_loss: 60000

with_mitigation:
  probability: 0.20  # Schema validation catches 75% of issues
  impact: 25000  # Caught earlier, less damage
  expected_loss: 5000

mitigation_cost:
  implementation: 15000  # Build validation layer
  ongoing_per_year: 3000  # Maintain, update
  duration_years: 1
  opportunity_cost: 5000  # Other features delayed
  total: 23000

analysis:
  loss_reduction: 55000
  net_value: 32000
  roi: "139%"

recommendation: Proceed
rationale: "Strong positive ROI. Mitigation pays for itself in first year."
```

### Negative Value: Mitigation Not Justified
```yaml
risk_id: "RISK-099"
title: "Minor admin panel UI bug"

without_mitigation:
  probability: 0.50
  impact: 500  # Minor user inconvenience
  duration_years: 1
  expected_loss: 250

with_mitigation:
  probability: 0.00  # Fixed completely
  impact: 0
  expected_loss: 0

mitigation_cost:
  implementation: 4000  # 2 days developer time
  ongoing_per_year: 0
  duration_years: 1
  opportunity_cost: 2000  # Other work delayed
  total: 6000

analysis:
  loss_reduction: 250
  net_value: -5750  # NEGATIVE
  roi: "-96%"

recommendation: Reject
rationale: "Mitigation cost far exceeds expected loss. Tolerate is appropriate."
```

### Fat-Tail Adjusted: Changes Decision
```yaml
risk_id: "RISK-067"
title: "Major client terminates contract"

without_mitigation:
  probability: 0.15
  impact: 500000  # Expected impact
  duration_years: 1
  expected_loss: 75000

with_mitigation:
  probability: 0.05
  impact: 200000  # Better positioned
  expected_loss: 10000

mitigation_cost:
  implementation: 50000  # Diversification effort
  ongoing_per_year: 20000
  duration_years: 1
  opportunity_cost: 30000
  total: 100000

analysis:
  loss_reduction: 65000
  net_value: -35000  # NEGATIVE by standard calc
  roi: "-35%"

fat_tail_adjusted:
  applicable: true
  p90_without: 1500000  # Could be 3x expected
  p90_with: 400000
  adjusted_loss_reduction: 330000  # (0.15 × 1.5M) - (0.05 × 400k) = 225k - 20k
  adjusted_value: 230000  # Much better

recommendation: Proceed
rationale: |
  Standard expected value shows negative ROI.
  But this is a fat-tail risk - P90 scenario is much worse.
  Fat-tail adjusted analysis shows strong positive value.
  Additionally, this risk may be non-ergodic (team viability).
```

### Non-Ergodic Override
```yaml
risk_id: "RISK-078"
title: "Regulatory license revocation"

without_mitigation:
  probability: 0.05
  impact: 10000000  # Business ending
  expected_loss: 500000

with_mitigation:
  probability: 0.01
  impact: 1000000  # Remediation possible
  expected_loss: 10000

mitigation_cost:
  total: 300000  # Comprehensive compliance program

analysis:
  loss_reduction: 490000
  net_value: 190000
  roi: "63%"

non_ergodic_override:
  applicable: true
  survival_question: "Can the business survive license revocation?"
  answer: "No - this is game over"
  override_decision: "PROCEED regardless of ROI"

recommendation: Proceed (Override)
rationale: |
  Even if cost-benefit were negative, this is an existential risk.
  The question is not "is mitigation profitable?" but "can we survive without it?"
  Answer is no. Therefore: mitigate.
```

## Common Pitfalls

1. **Forgetting opportunity cost:** Every dollar spent here can't be spent elsewhere
2. **Underestimating ongoing costs:** Maintenance often exceeds implementation
3. **Using expected value for fat tails:** P90/P99 is more relevant
4. **Ignoring non-ergodicity:** Some risks must be mitigated regardless of ROI
5. **False precision:** Round numbers are fine; $47,382 implies false accuracy
