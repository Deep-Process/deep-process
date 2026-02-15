# 605 - Simpson's Paradox Audit

## Phase
META (After QUANTIFY, Before OUTPUT)

## Purpose
Check if aggregate risk metrics hide dangerous subgroup patterns. A portfolio that looks healthy in aggregate may be catastrophic for specific clients, regions, or components.

## What is Simpson's Paradox?

**Simpson's Paradox:** A trend that appears in aggregate data DISAPPEARS or REVERSES when data is disaggregated into subgroups.

**Classic Example:**
- Overall: Drug A has better outcomes than Drug B
- Men only: Drug B has better outcomes than Drug A
- Women only: Drug B has better outcomes than Drug A
- Paradox: B is better in BOTH subgroups, but worse overall (due to different subgroup sizes)

**Applied to Risk:**
- Aggregate: "Average risk score 2.3" → Looks fine
- By component: Core=1.2, Auth=1.5, Reporting=4.8
- Paradox: The aggregate hides that ONE component is in crisis

## Disaggregation Dimensions

| Dimension | Why It Matters |
|-----------|---------------|
| **Client** | One client may have much higher risk exposure |
| **Team** | One team may be drowning while others float |
| **Component/Module** | One module may be a disaster |
| **Geography/Region** | Risk may concentrate regionally |
| **Time Period** | Risk may spike at certain times |
| **Vendor/Dependency** | One vendor may dominate risk |

## Procedure

### Step 1: Calculate Aggregate Metrics
From #603, take all aggregate portfolio metrics:
- Total expected loss
- Average risk score
- Mitigation coverage %
- etc.

### Step 2: Disaggregate by Each Dimension
For each dimension, calculate the SAME metrics for each subgroup.

### Step 3: Compare Subgroup to Aggregate
For each subgroup:
- Is the subgroup metric similar to aggregate? → OK
- Is the subgroup metric MUCH WORSE than aggregate? → Simpson's Paradox

### Step 4: Document Hidden Risks
Where paradoxes found:
- What's hidden?
- Why didn't aggregate show it?
- What's the real risk?

### Step 5: Adjust Reporting
Don't just report aggregate - include subgroup analysis where paradoxes exist.

## Output Schema
```yaml
simpsons_paradox_audit:
  audit_date: "YYYY-MM-DD"

  aggregate_metrics:
    average_risk_score: 2.3
    total_expected_loss: 385000
    mitigation_coverage: 86%

  disaggregations:
    - dimension: "Component"
      subgroups:
        - name: "Core Pipeline"
          average_risk_score: 1.2
          deviation_from_aggregate: "-48%"
          status: "[OK|PARADOX]"
        - name: "Auth Module"
          average_risk_score: 1.5
          deviation_from_aggregate: "-35%"
          status: "[OK|PARADOX]"
        - name: "Reporting Module"
          average_risk_score: 4.8
          deviation_from_aggregate: "+109%"
          status: "PARADOX"

      paradox_found: true
      paradox_description: "Aggregate hides that Reporting Module is in crisis"
      hidden_risk: "Reporting module risk is 2x average, masked by healthy core"
      action: "Separate reporting module risk tracking, dedicated mitigation"

  paradoxes_found:
    - dimension: "Component"
      subgroup: "Reporting Module"
      aggregate_metric: "Average risk 2.3"
      subgroup_metric: "Average risk 4.8"
      ratio: "2.1x"
      hidden_risk: "Module-specific crisis masked by overall average"

  recommendations:
    - "Always report component-level breakdown, not just aggregate"
    - "Create dedicated risk review for Reporting Module"
```

## Quality Checks
- [ ] All relevant dimensions disaggregated
- [ ] Subgroup vs aggregate comparison made
- [ ] Paradoxes identified and documented
- [ ] Hidden risks surfaced
- [ ] Reporting adjusted to show subgroups

## Connections
- Feeds into: #603 (portfolio view should include subgroups), #604 (communication)
- Uses output from: #201 (scores), risk register
- Related to: #601 (averaging bias hides subgroup issues)

## Examples

### Example 1: Component-Level Paradox
```yaml
dimension: Component
aggregate_metric: "Average risk score: 2.3"

subgroups:
  - name: "Data Ingestion"
    metric: 1.8
    status: OK
  - name: "Transformation"
    metric: 1.5
    status: OK
  - name: "Quality Layer"
    metric: 2.1
    status: OK
  - name: "Reporting Engine"
    metric: 4.8
    status: PARADOX
  - name: "API Layer"
    metric: 1.2
    status: OK

paradox_analysis: |
  The Reporting Engine has risk score 4.8, more than double the
  aggregate 2.3. The other 4 components pull the average down,
  masking that one critical component is in danger zone.

  This is the component that produces regulatory reports.
  Its hidden high-risk status is particularly dangerous because
  regulatory deadlines are non-negotiable.

hidden_risk: |
  Regulatory reporting module failure risk is masked by
  healthy aggregate metrics. If this module fails during
  month-end, no aggregate health will matter.

action:
  - "Add Reporting Engine to separate monitoring track"
  - "Report component breakdown, not just aggregate"
  - "Prioritize Reporting Engine mitigations"
```

### Example 2: Client-Level Paradox
```yaml
dimension: Client
aggregate_metric: "98% delivery success rate"

subgroups:
  - name: "Client A (60% revenue)"
    metric: "99.5%"
    status: OK
  - name: "Client B (25% revenue)"
    metric: "99%"
    status: OK
  - name: "Client C (15% revenue)"
    metric: "88%"
    status: PARADOX

paradox_analysis: |
  Overall 98% success rate looks good.
  But Client C has only 88% success rate - significantly worse.
  Because Client C is smaller, their poor experience is
  drowned out in the weighted average.

hidden_risk: |
  Client C is unhappy but aggregate metrics don't show it.
  If Client C is a growing relationship or has expansion
  potential, this hidden dissatisfaction is a real risk.

action:
  - "Report per-client metrics to client team"
  - "Investigate Client C delivery issues"
  - "Don't let revenue weighting hide smaller client problems"
```

### Example 3: Time-Period Paradox
```yaml
dimension: Time Period
aggregate_metric: "95% pipeline success rate (monthly)"

subgroups:
  - name: "Days 1-25"
    metric: "99%"
    status: OK
  - name: "Days 26-28 (month-end)"
    metric: "72%"
    status: PARADOX

paradox_analysis: |
  Monthly aggregate of 95% looks acceptable.
  But month-end period (when it matters most) is only 72%.
  The other 25 days dilute the month-end failures.

hidden_risk: |
  The 3 days that matter most (regulatory deadline)
  have 4x the failure rate of normal days.
  Aggregate monthly metric completely hides this.

action:
  - "Separate reporting for month-end period"
  - "Month-end gets its own SLA and monitoring"
  - "Staff differently for month-end window"
```

## Simpson's Paradox Detection Rule

**When to suspect paradox:**
- Aggregate looks "fine" but stakeholders complain
- Some subgroups seem worse than others anecdotally
- High variance within aggregate metric
- Different teams have different experiences

**Detection formula:**
If any subgroup metric is >50% different from aggregate → investigate for paradox.

## Reporting Recommendation

**Never report only aggregates. Always include:**
1. Aggregate metric
2. Range across subgroups (min-max)
3. Any subgroup that deviates >50%
4. Context for why aggregate may be misleading
