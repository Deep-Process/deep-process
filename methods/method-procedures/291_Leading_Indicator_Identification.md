# 501 - Leading Indicator Identification

## Phase
MONITOR

## Purpose
For each risk, identify observable signals that PRECEDE materialization. Leading indicators provide early warning, enabling response before full impact.

## Leading vs Lagging Indicators

| Type | Timing | Example | Value |
|------|--------|---------|-------|
| **Leading** | Before risk materializes | Error rate increasing | Early warning, time to act |
| **Lagging** | After risk materializes | System down | Confirms problem, too late to prevent |

Focus on LEADING indicators - we want warning, not confirmation.

## Indicator Types

| Type | Examples | Lead Time |
|------|---------|-----------|
| **Metric** | Error rate increasing 2x week-over-week | Days to weeks |
| **Event** | Competitor announces similar product | Weeks to months |
| **Behavioral** | Key stakeholder stops attending meetings | Days to weeks |
| **Environmental** | New regulation proposed in draft | Months |
| **Technical** | Dependency releases major version | Weeks |
| **Financial** | Burn rate exceeding forecast >20% | Weeks to months |
| **Temporal** | Certificate expiry in <30 days | Days (predictable) |

## Procedure

### Step 1: Identify Candidate Indicators
For each risk, brainstorm 2-3 potential leading indicators.

Ask:
- What changes BEFORE this risk materializes?
- What early symptoms would we see?
- What precursor events typically occur?

### Step 2: Assess Indicator Quality

Good indicators are:
| Quality | Question |
|---------|----------|
| **Measurable** | Can we quantify this? |
| **Available** | Does the data exist? Can we access it? |
| **Leading** | Does it change BEFORE the risk, not during? |
| **Specific** | Does it indicate THIS risk, not many things? |
| **Actionable** | Is there time to respond after signal? |

### Step 3: Design Collection

| Method | When to Use |
|--------|-------------|
| **Automated** | Preferred - consistent, continuous |
| **Manual** | When automation not possible, schedule it |

For manual: schedule the collection, assign owner.

### Step 4: Goodhart Check
> "Can this indicator be gamed?"

If the indicator becomes a target, it may cease to be useful.

Examples of gaming:
- If "number of risks reported" is an indicator, team may under-report
- If "test coverage %" is an indicator, may add useless tests
- If "deployment frequency" is an indicator, may do empty deploys

Design indicators that resist gaming.

### Step 5: Set Thresholds
Define what indicator values mean (feeds into #406):
- Green: Normal
- Yellow: Warning - investigate
- Red: Act now

## Output Schema
```yaml
leading_indicators:
  - risk_id: "RISK-XXX"
    title: "Risk description"

    indicators:
      - indicator_name: "Name of the indicator"
        indicator_type: "[Metric|Event|Behavioral|Environmental|Technical|Financial|Temporal]"
        description: "What this indicator measures"

        measurement:
          metric: "Specific measurement"
          unit: "Unit of measurement"
          data_source: "Where data comes from"
          collection_method: "[Automated|Manual]"
          collection_frequency: "How often"
          owner: "Who is responsible"

        quality_assessment:
          measurable: "[true|false]"
          available: "[true|false]"
          leading: "[true|false]"
          lead_time: "How much warning"
          specific: "[true|false]"
          actionable: "[true|false]"

        goodhart_resistance:
          can_be_gamed: "[true|false]"
          gaming_scenario: "How it might be gamed"
          gaming_mitigation: "How to prevent gaming"

        thresholds:
          green: "Normal range"
          yellow: "Warning threshold"
          red: "Action threshold"

        monitoring_status: "[Configured|Pending|Not possible]"
```

## Quality Checks
- [ ] 2-3 indicators per significant risk
- [ ] Quality assessment completed
- [ ] Collection method defined
- [ ] Goodhart check performed
- [ ] Thresholds set
- [ ] Monitoring actually configured

## Connections
- Feeds into: #406 (triggers use indicators), #502 (review cadence)
- Uses output from: #201 (risks to monitor), #401 (tolerated risks need indicators)
- Related to: #606 (Goodhart audit of indicators)

## Examples

### Technical Risk Indicators
```yaml
risk_id: "RISK-023"
title: "Pipeline performance degradation"

indicators:
  - indicator_name: "Execution time trend"
    indicator_type: Metric
    description: "Week-over-week change in P95 execution time"

    measurement:
      metric: "ΔP95 execution time (current week vs previous week)"
      unit: "minutes change"
      data_source: "Databricks job metrics"
      collection_method: Automated
      collection_frequency: "Daily calculation"
      owner: "Data Platform team"

    quality_assessment:
      measurable: true
      available: true
      leading: true
      lead_time: "2-4 weeks before SLA breach"
      specific: true  # Specifically indicates performance
      actionable: true

    goodhart_resistance:
      can_be_gamed: false
      gaming_scenario: "N/A - can't fake execution time"
      gaming_mitigation: "N/A"

    thresholds:
      green: "Δ < +5 minutes"
      yellow: "Δ > +5 minutes sustained 2 weeks"
      red: "Δ > +15 minutes OR approaching SLA boundary"

    monitoring_status: Configured

  - indicator_name: "Data volume growth rate"
    indicator_type: Metric
    description: "Rate of increase in daily data volume"

    measurement:
      metric: "Monthly growth rate of daily records processed"
      unit: "% growth"
      data_source: "Pipeline metadata tables"
      collection_method: Automated
      collection_frequency: "Weekly"
      owner: "Data Platform team"

    quality_assessment:
      measurable: true
      available: true
      leading: true
      lead_time: "Months - growth is gradual"
      specific: true
      actionable: true

    goodhart_resistance:
      can_be_gamed: false
      gaming_scenario: "N/A"
      gaming_mitigation: "N/A"

    thresholds:
      green: "< 10% monthly growth"
      yellow: "> 15% monthly growth"
      red: "> 25% monthly growth OR capacity utilization > 80%"

    monitoring_status: Configured
```

### People/Business Risk Indicators
```yaml
risk_id: "RISK-045"
title: "Key person departure"

indicators:
  - indicator_name: "Engagement signals"
    indicator_type: Behavioral
    description: "Observable engagement changes"

    measurement:
      metric: "Composite of meeting attendance, contribution frequency, initiative"
      unit: "Qualitative assessment"
      data_source: "Manager observation, 1:1 notes"
      collection_method: Manual
      collection_frequency: "Weekly 1:1s"
      owner: "Engineering Manager"

    quality_assessment:
      measurable: false  # Qualitative
      available: true
      leading: true
      lead_time: "Weeks to months"
      specific: false  # Could indicate many things
      actionable: true

    goodhart_resistance:
      can_be_gamed: true
      gaming_scenario: "Person masks disengagement"
      gaming_mitigation: "Multiple data points, skip-levels, anonymous surveys"

    thresholds:
      green: "Engaged, initiating, growing"
      yellow: "Withdrawing, fewer initiatives, complaints"
      red: "Minimal engagement, LinkedIn activity, explicit discussions"

    monitoring_status: Configured

  - indicator_name: "Market conditions"
    indicator_type: Environmental
    description: "External job market conditions for this role"

    measurement:
      metric: "Job postings for similar roles, salary trends"
      unit: "Postings count, salary delta"
      data_source: "LinkedIn, Glassdoor, industry reports"
      collection_method: Manual
      collection_frequency: "Monthly"
      owner: "HR / Manager"

    quality_assessment:
      measurable: true
      available: true
      leading: true
      lead_time: "Months"
      specific: false  # Affects all team members
      actionable: true

    goodhart_resistance:
      can_be_gamed: false
      gaming_scenario: "N/A - external data"
      gaming_mitigation: "N/A"

    thresholds:
      green: "Market stable, competitive compensation"
      yellow: "Hot market, compensation falling behind >10%"
      red: "Very hot market, significantly below market"

    monitoring_status: Pending
```

## Common Indicator Anti-Patterns

1. **Lagging indicators only:** "System went down" - too late
2. **Unmeasurable:** "Team morale is concerning" - how do you measure?
3. **Unavailable data:** "Customer sentiment" - do you actually track it?
4. **Not leading:** "Revenue dropped" - already happened
5. **Gameable:** "Lines of code" - incentivizes bloat
6. **Not actionable:** "Asteroid approaching" - can't do anything
