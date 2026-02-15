# 502 - Risk Review Cadence Design

## Phase
MONITOR

## Purpose
Design structured review schedule matching velocity and volatility of the risk portfolio. Not all risks need the same review frequency - match cadence to risk characteristics.

## Cadence by Risk Velocity

| Risk Velocity | Review Frequency | Format | Rationale |
|---------------|-----------------|--------|-----------|
| **Flash** (V=5) | Real-time alerting | Automated dashboard | No time for scheduled review |
| **Fast** (V=4) | Weekly | 15-min standup addition | Needs frequent attention |
| **Medium** (V=3) | Bi-weekly | Dedicated risk review | Regular but not urgent |
| **Slow** (V=1-2) | Monthly / Quarterly | Strategic risk review | Fundamental, slow-moving |

## Procedure

### Step 1: Classify Risks by Velocity
Group risks by their velocity score (#201):
- V=5: Flash
- V=4: Fast
- V=3: Medium
- V=1-2: Slow

### Step 2: Design Cadence for Each Group
For each velocity group, define:
- Frequency
- Format
- Duration
- Participants
- Inputs required
- Outputs expected

### Step 3: Define Ad-Hoc Triggers
Beyond scheduled reviews, what triggers an immediate review?
- Indicator crosses threshold (#501)
- Related incident occurs
- Major external change
- Stakeholder request

### Step 4: Assign Ownership
Who owns each review cadence?
- Who schedules?
- Who facilitates?
- Who ensures actions are tracked?

### Step 5: Document Review Ritual
For each review type, document:
- Agenda template
- Required preparation
- Decision authority
- Documentation requirements

## Output Schema
```yaml
review_cadence:
  flash_velocity:
    risks: ["RISK-XXX", "RISK-YYY"]
    monitoring: "Real-time automated dashboard"
    alert_channel: "PagerDuty / Slack alert channel"
    response_sla: "< 15 minutes acknowledgment"
    owner: "On-call engineer"

  fast_velocity:
    risks: ["RISK-AAA", "RISK-BBB"]
    frequency: "Weekly"
    format: "15-minute addition to team standup"
    duration: "15 minutes"
    participants: ["Team lead", "Risk owners"]
    agenda:
      - "Review indicator status for each risk"
      - "Any threshold crossings this week?"
      - "Actions from last week complete?"
      - "New risks to add?"
    preparation: "Indicator dashboard reviewed before meeting"
    owner: "Team lead"

  medium_velocity:
    risks: ["RISK-CCC", "RISK-DDD"]
    frequency: "Bi-weekly"
    format: "Dedicated risk review meeting"
    duration: "30 minutes"
    participants: ["Engineering Manager", "Tech leads", "Risk owners"]
    agenda:
      - "Risk register update"
      - "Mitigation progress"
      - "New risks identified"
      - "Re-scoring if conditions changed"
    preparation: "Risk register updated, mitigations status checked"
    owner: "Engineering Manager"

  slow_velocity:
    risks: ["RISK-EEE", "RISK-FFF"]
    frequency: "Monthly / Quarterly"
    format: "Strategic risk review"
    duration: "60 minutes"
    participants: ["Director", "Senior leadership", "Key stakeholders"]
    agenda:
      - "Portfolio health assessment"
      - "Strategic risks review"
      - "Long-term trend analysis"
      - "Budget and resource allocation"
    preparation: "Full risk report prepared, portfolio metrics calculated"
    owner: "Director / Risk lead"

  ad_hoc_triggers:
    - trigger: "Any indicator crosses red threshold"
      action: "Immediate review by risk owner + escalation"
    - trigger: "Related production incident"
      action: "Post-incident risk review within 48 hours"
    - trigger: "Significant external change (regulatory, market, competitor)"
      action: "Impact assessment within 1 week"
    - trigger: "Quarterly business review"
      action: "Portfolio presentation to leadership"
```

## Quality Checks
- [ ] All risks assigned to velocity group
- [ ] Each velocity has appropriate cadence
- [ ] Rituals documented
- [ ] Ownership assigned
- [ ] Ad-hoc triggers defined
- [ ] Calendar invites created

## Connections
- Feeds into: Organizational calendar, #503 (escalation uses review structure)
- Uses output from: #201 (velocity scores), #501 (indicators to review)
- Related to: #606 (Goodhart check - are reviews becoming rubber stamps?)

## Example Implementation

### Weekly Fast Review (15 min in team standup)
```yaml
ritual:
  name: "Weekly Risk Check"
  frequency: "Every Monday in team standup"
  duration: "15 minutes"
  facilitator: "Team lead (rotating)"

  preparation:
    - "Check risk dashboard before meeting"
    - "Note any threshold changes"

  agenda:
    1_status_check:
      duration: "5 min"
      content: "Quick scan of fast-velocity risk indicators"
      questions:
        - "Any yellows or reds?"
        - "Any trends concerning?"

    2_action_review:
      duration: "5 min"
      content: "Previous week's actions"
      questions:
        - "Completed?"
        - "Blocked?"

    3_new_items:
      duration: "5 min"
      content: "New risks or changes"
      questions:
        - "Anything new to add?"
        - "Any conditions changed?"

  outputs:
    - "Risk dashboard updated"
    - "Action items assigned"
    - "Escalations flagged"

  skip_criteria:
    - "All indicators green"
    - "No actions pending"
    - "Can reduce to 5-min check"
```

### Monthly Strategic Review (60 min)
```yaml
ritual:
  name: "Monthly Strategic Risk Review"
  frequency: "First Thursday of month"
  duration: "60 minutes"
  facilitator: "Engineering Manager"

  preparation:
    by_risk_lead:
      - "Update risk register completely"
      - "Calculate portfolio metrics"
      - "Prepare trend analysis (3-month)"
      - "Draft executive summary"
    by_participants:
      - "Review summary before meeting"
      - "Come with questions/concerns"

  agenda:
    1_portfolio_health:
      duration: "15 min"
      content: "Overall risk posture"
      metrics:
        - "Total risks by tier"
        - "New/closed this month"
        - "Mitigation coverage"
        - "Residual risk trend"

    2_top_risks:
      duration: "20 min"
      content: "Deep dive on top 5 risks"
      for_each_risk:
        - "Current status"
        - "Mitigation progress"
        - "Any score changes"
        - "Decisions needed"

    3_strategic_risks:
      duration: "15 min"
      content: "Long-term / slow-moving risks"
      questions:
        - "Any accumulation concerning?"
        - "External environment changes?"
        - "Resource allocation needed?"

    4_actions:
      duration: "10 min"
      content: "Decisions and next steps"
      outputs:
        - "Decisions documented"
        - "Actions assigned"
        - "Escalations noted"

  outputs:
    - "Updated risk register"
    - "Monthly risk report"
    - "Action items with owners"
    - "Escalations to leadership if needed"
```

## Review Cadence Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|--------------|---------|-----|
| **All risks same cadence** | Fast risks under-reviewed, slow risks over-reviewed | Match cadence to velocity |
| **Review without prep** | Meetings waste time getting up to speed | Require preparation |
| **No decisions made** | "Let's discuss offline" every time | Assign decision authority |
| **Rubber stamp** | All risks "green," no questions asked | #606 Goodhart check |
| **Too many participants** | Scheduling impossible, discussions unfocused | Right-size by risk type |
| **No follow-through** | Actions assigned but never tracked | Track actions in system |
