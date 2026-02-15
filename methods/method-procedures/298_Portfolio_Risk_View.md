# 603 - Portfolio Risk View

## Phase
META (Continuous)

## Purpose
Aggregate all risks into portfolio view. Portfolio may be unacceptable even if every individual risk is acceptable. The whole is different from the sum of parts.

## When to Apply
- Before OUTPUT (portfolio health check)
- Periodically (portfolio monitoring)

## Portfolio Metrics

| Metric | Formula | Threshold | Action if Exceeded |
|--------|---------|-----------|-------------------|
| **Total Expected Loss** | Σ(P × I) for all risks | vs total budget/value | Reduce highest-impact risks |
| **Max Simultaneous Loss** | Sum of correlated clusters | vs survivability | Break correlations or add insurance |
| **Risk Concentration** | Top 3 risks as % of total | >60% = too concentrated | Diversify mitigations |
| **Mitigation Coverage** | % CRITICAL/HIGH with mitigation | <80% = gap | Add mitigations |
| **Monitoring Coverage** | % risks with leading indicators | <70% = blind flying | Add indicators |
| **Non-Ergodic Count** | Count of unmitigated NON_ERGODIC | Any = RED | Must address existential risks |
| **Fat-Tail Count** | Count of unmitigated FAT_TAIL | Any = RED | Use P99 estimates |

## Procedure

### Step 1: Calculate Each Metric
Compute all portfolio metrics from the risk register.

### Step 2: Compare to Thresholds
For each metric, compare to threshold.
Flag any that exceed.

### Step 3: Assess Overall Portfolio Health
Combine metric results:
- **GREEN:** All metrics within thresholds
- **YELLOW:** Some metrics approaching thresholds
- **RED:** Critical thresholds breached OR any unmitigated NON_ERGODIC/FAT_TAIL

### Step 4: Identify Single Best Improvement
If portfolio is YELLOW or RED:
What single action would most improve portfolio health?

### Step 5: Document Portfolio Decision
If portfolio is unacceptable:
- What changes are required?
- Who decides if portfolio is acceptable?
- Is explicit acceptance documented?

## Output Schema
```yaml
portfolio_view:
  assessment_date: "YYYY-MM-DD"
  total_risks: 25

  distribution:
    critical: 2
    high: 5
    medium: 10
    low: 8

  metrics:
    total_expected_loss:
      value: 450000
      threshold: "500000 (10% of project value)"
      status: "[Green|Yellow|Red]"

    max_simultaneous_loss:
      value: 800000
      threshold: "1000000 (survivability limit)"
      status: "[Green|Yellow|Red]"
      based_on: "CLUSTER-001 + CLUSTER-003 simultaneous"

    risk_concentration:
      top_3_percent: 55
      top_3_risks: ["RISK-067", "RISK-023", "RISK-045"]
      threshold: "60%"
      status: "[Green|Yellow|Red]"

    mitigation_coverage:
      critical_high_count: 7
      mitigated_count: 6
      coverage_percent: 86
      threshold: "80%"
      status: "[Green|Yellow|Red]"
      unmitigated: ["RISK-XXX"]

    monitoring_coverage:
      total_count: 25
      monitored_count: 18
      coverage_percent: 72
      threshold: "70%"
      status: "[Green|Yellow|Red]"

    non_ergodic_count:
      total: 2
      unmitigated: 1
      status: "[Green|Red]"  # No yellow for this
      risks: ["RISK-067 (unmitigated)"]

    fat_tail_count:
      total: 3
      unmitigated: 1
      status: "[Green|Red]"
      risks: ["RISK-045 (unmitigated)"]

  overall_status: "[Green|Yellow|Red]"
  status_rationale: "Why this status"

  key_concerns:
    - "Concern 1"
    - "Concern 2"

  single_best_improvement:
    action: "What to do"
    impact: "How much it improves portfolio"
    owner: "Who should do it"

  acceptance:
    acceptable: "[true|false]"
    accepted_by: "Name if accepted"
    conditions: "Any conditions on acceptance"
```

## Quality Checks
- [ ] All metrics calculated
- [ ] Thresholds defined
- [ ] Status assigned
- [ ] Concerns documented
- [ ] Improvement identified
- [ ] Acceptance documented

## Connections
- Feeds into: OUTPUT (portfolio summary in reports)
- Uses output from: All phases (aggregates everything)
- Related to: #405 (residual portfolio), #302 (correlation for max loss)

## Example Portfolio Assessment

```yaml
portfolio_view:
  assessment_date: "2024-02-15"
  total_risks: 28

  distribution:
    critical: 3
    high: 6
    medium: 12
    low: 7

  metrics:
    total_expected_loss:
      value: 385000
      threshold: "500000"
      status: Green
      calculation: "Sum of P×I for all risks"

    max_simultaneous_loss:
      value: 950000
      threshold: "1000000"
      status: Yellow
      based_on: "Azure region failure cluster (RISK-011,012,013,014)"
      note: "Approaching survivability limit"

    risk_concentration:
      top_3_percent: 52
      top_3_risks:
        - "RISK-067: Client concentration (28%)"
        - "RISK-023: Pipeline failure (14%)"
        - "RISK-045: Key person (10%)"
      threshold: "60%"
      status: Green

    mitigation_coverage:
      critical_high_count: 9
      mitigated_count: 8
      coverage_percent: 89
      threshold: "80%"
      status: Green
      unmitigated: ["RISK-067"]

    monitoring_coverage:
      total_count: 28
      monitored_count: 19
      coverage_percent: 68
      threshold: "70%"
      status: Yellow
      note: "Below threshold - some risks flying blind"

    non_ergodic_count:
      total: 2
      unmitigated: 1
      status: Red
      risks:
        - "RISK-067: Client concentration (Tolerated - NON_ERGODIC)"
      note: "CRITICAL - existential risk without full mitigation"

    fat_tail_count:
      total: 4
      unmitigated: 2
      status: Red
      risks:
        - "RISK-045: Key person (fat-tail knowledge loss)"
        - "RISK-078: Regulatory (fat-tail penalty)"

  overall_status: Red
  status_rationale: |
    Red due to unmitigated NON_ERGODIC risk (RISK-067) and
    unmitigated FAT_TAIL risks. Individual metrics look acceptable,
    but existential risks must be addressed.

  key_concerns:
    - "RISK-067 is non-ergodic but only tolerated - needs transfer or terminate"
    - "Two fat-tail risks without P99 mitigation"
    - "Monitoring coverage below threshold"
    - "Max simultaneous loss approaching limit"

  single_best_improvement:
    action: "Address RISK-067 (client concentration) - either diversify or transfer via contract protection"
    impact: "Would move portfolio from Red to Yellow"
    owner: "VP Sales + VP Delivery"

  acceptance:
    acceptable: false
    conditions: "Cannot accept until NON_ERGODIC risk addressed"
```

## Portfolio Visualization

```
PORTFOLIO RISK DASHBOARD
========================

Distribution:          Total Expected Loss:     Max Simultaneous:
CRITICAL: ██ 3        [====|.....] $385K       [========|..] $950K
HIGH:     ██████ 6
MEDIUM:   ████████████ 12   < $500K OK          Approaching $1M limit
LOW:      ███████ 7

Coverage:
Mitigation (CRIT/HIGH): [========|] 89%  ✓
Monitoring:             [======|..] 68%  ⚠️

EXISTENTIAL RISKS:
NON_ERGODIC unmitigated: 1  ❌ MUST ADDRESS
FAT_TAIL unmitigated:    2  ❌ MUST ADDRESS

STATUS: RED
Single best improvement: Mitigate RISK-067 (client concentration)
```

## Portfolio Decision Framework

| Portfolio Status | Decision |
|------------------|----------|
| GREEN | Proceed with confidence, maintain monitoring |
| YELLOW | Proceed with caution, prioritize improvements |
| RED | STOP - address critical issues before proceeding |

**Red status always requires escalation and explicit decision to proceed.**
