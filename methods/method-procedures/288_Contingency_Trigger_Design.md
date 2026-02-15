# 406 - Contingency Trigger Design

## Phase
MITIGATE

## Purpose
For tolerated/residual risks, define precise conditions that trigger escalation. Prevents "boiling frog" - gradual increase unnoticed until crisis.

## Core Problem: The Boiling Frog

Without explicit triggers:
- Situation gradually worsens
- Each increment seems acceptable
- No single point triggers action
- Crisis arrives "suddenly" (but was accumulating)

Solution: Pre-commit to specific thresholds that trigger specific actions.

## Procedure

### Step 1: Define Leading Indicators
For each tolerated/residual risk, identify signals that PRECEDE materialization.

Good indicators are:
- **Measurable:** Can be quantified
- **Available:** Data exists and is accessible
- **Leading:** Changes BEFORE the risk materializes
- **Actionable:** We can respond in time

### Step 2: Set Thresholds
Define specific, measurable, time-bound thresholds.

| Level | Meaning | Response |
|-------|---------|----------|
| **Green** | Normal operating range | Monitor |
| **Yellow** | Warning - investigate and prepare | Active monitoring, prepare response |
| **Red** | Materializing - act now | Execute contingency |

### Step 3: Define Response Protocol
For each threshold crossing:
- **What:** Specific actions to take
- **Who:** Responsible person/team
- **When:** Timeframe for response
- **Escalation:** Who to notify

### Step 4: Distinguish Trigger Types

| Type | Detection | Example |
|------|-----------|---------|
| **Threshold crossing** | Value exceeds limit | Error rate > 5% |
| **Trend trigger** | Direction sustained | 3 weeks of increasing latency |
| **Event trigger** | Specific event occurs | Vendor announces deprecation |
| **Compound trigger** | Multiple conditions | Volume high AND team reduced |

### Step 5: Document and Communicate
- Triggers must be documented
- Relevant parties must know them
- Monitoring must track them

## Output Schema
```yaml
contingency_triggers:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    strategy: "Tolerate"  # Usually for tolerated risks

    leading_indicators:
      - indicator_name: "Name of the signal"
        metric: "Specific measurement"
        collection: "[Automated|Manual]"
        collection_frequency: "How often measured"
        data_source: "Where data comes from"
        owner: "Who monitors this"

    thresholds:
      green:
        range: "Normal operating range"
        response: "Continue monitoring"

      yellow:
        threshold: "Specific value/condition"
        trigger_type: "[Threshold|Trend|Event|Compound]"
        response_protocol:
          actions:
            - "Action 1"
            - "Action 2"
          responsible: "Who acts"
          timeframe: "Within X hours/days"
          escalation: "Who to notify"
        reversible_when: "What returns us to green"

      red:
        threshold: "Specific value/condition"
        trigger_type: "[Threshold|Trend|Event|Compound]"
        response_protocol:
          actions:
            - "Immediate action 1"
            - "Immediate action 2"
          responsible: "Who acts"
          timeframe: "Immediate / Within X hours"
          escalation: "Executive notification"
          contingency_plan: "Reference to detailed plan"

    monitoring_configured: "[true|false]"
    last_review_date: "YYYY-MM-DD"
```

## Quality Checks
- [ ] Leading indicators identified for each tolerated risk
- [ ] Thresholds are specific and measurable
- [ ] Response protocols defined
- [ ] Responsibilities assigned
- [ ] Monitoring actually configured

## Connections
- Feeds into: #501 (leading indicators), #503 (escalation protocols)
- Uses output from: #401 (tolerated risks), #405 (residual risks)
- Related to: #505 (Sorites accumulation triggers)

## Example: Client Relationship Risk

```yaml
risk_id: "RISK-067"
title: "Primary client reduces engagement"
strategy: "Tolerate (with active monitoring)"

leading_indicators:
  - indicator_name: "Client communication frequency"
    metric: "Meetings/calls per month"
    collection: Manual
    collection_frequency: Weekly
    data_source: "Calendar review"
    owner: "Account Manager"

  - indicator_name: "NPS/Satisfaction score"
    metric: "Quarterly survey score"
    collection: Automated
    collection_frequency: Quarterly
    data_source: "Survey tool"
    owner: "Client Success"

  - indicator_name: "Scope change requests"
    metric: "Reduction requests in past 30 days"
    collection: Manual
    collection_frequency: Weekly
    data_source: "Change request log"
    owner: "Project Manager"

  - indicator_name: "Key stakeholder availability"
    metric: "Meeting acceptance rate"
    collection: Automated
    collection_frequency: Weekly
    data_source: "Calendar analytics"
    owner: "Account Manager"

thresholds:
  green:
    range: "Monthly meetings, NPS > 40, no scope reductions, >80% meeting acceptance"
    response: "Continue normal engagement"

  yellow:
    threshold: |
      ANY of:
      - Meetings reduced to quarterly
      - NPS drops below 30
      - Any scope reduction discussion initiated
      - Meeting acceptance < 60%
    trigger_type: Compound
    response_protocol:
      actions:
        - "Schedule executive relationship review"
        - "Conduct informal temperature check with client contacts"
        - "Review delivery metrics for any issues"
        - "Prepare value demonstration materials"
      responsible: "Account Manager + Delivery Lead"
      timeframe: "Within 1 week"
      escalation: "Director notified"
    reversible_when: "Metrics return to green for 4+ weeks"

  red:
    threshold: |
      ANY of:
      - Client mentions RFP or competitive evaluation
      - Formal scope reduction > 20%
      - Key sponsor leaves or changes
      - Multiple yellow indicators simultaneously
    trigger_type: Event
    response_protocol:
      actions:
        - "Executive intervention - VP level call"
        - "Prepare retention proposal"
        - "Analyze competitive position"
        - "Begin contingency planning for revenue impact"
      responsible: "VP Sales + VP Delivery"
      timeframe: "Within 48 hours"
      escalation: "Executive team notification"
      contingency_plan: "CLIENT-RETENTION-PLAYBOOK"

monitoring_configured: true
last_review_date: "2024-02-01"
```

## Example: Technical Risk Triggers

```yaml
risk_id: "RISK-023"
title: "Pipeline performance degradation"
strategy: "Treat (with triggers for escalation)"

leading_indicators:
  - indicator_name: "Pipeline execution time"
    metric: "P95 execution duration"
    collection: Automated
    collection_frequency: Per run
    data_source: "Databricks job metrics"
    owner: "Data Platform team"

  - indicator_name: "Error rate"
    metric: "Failed runs / total runs (7-day rolling)"
    collection: Automated
    collection_frequency: Hourly
    data_source: "Monitoring dashboard"
    owner: "Data Platform team"

thresholds:
  green:
    range: "P95 < 3 hours, Error rate < 2%"
    response: "Normal operations"

  yellow:
    threshold: "P95 > 3.5 hours OR Error rate > 3%"
    trigger_type: Threshold
    response_protocol:
      actions:
        - "Review recent changes (code, data volume, infrastructure)"
        - "Check for resource contention"
        - "Prepare optimization options"
      responsible: "Data Engineer on-call"
      timeframe: "Within 4 hours"
      escalation: "Team lead notified"
    reversible_when: "Metrics in green for 24 hours"

  red:
    threshold: "P95 > 4 hours (SLA boundary) OR Error rate > 5%"
    trigger_type: Threshold
    response_protocol:
      actions:
        - "Activate incident response"
        - "Scale resources if needed"
        - "Communicate SLA risk to stakeholders"
        - "Begin root cause analysis"
      responsible: "Data Platform Lead"
      timeframe: "Immediate"
      escalation: "Engineering Manager, stakeholders"
      contingency_plan: "PIPELINE-INCIDENT-RUNBOOK"

monitoring_configured: true
last_review_date: "2024-01-15"
```

## Trigger Design Principles

1. **Be specific:** "Error rate > 5%" not "errors increasing"
2. **Be leading:** Trigger before crisis, not during
3. **Be actionable:** Can respond in the time available
4. **Avoid alert fatigue:** Too many yellow = ignored yellow
5. **Test triggers:** Verify monitoring actually alerts
6. **Review regularly:** Thresholds may need adjustment
