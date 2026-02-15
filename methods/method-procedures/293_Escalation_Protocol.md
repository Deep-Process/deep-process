# 503 - Escalation Protocol Design

## Phase
MONITOR

## Purpose
Define clear escalation paths - who decides what, when, with what authority. Prevents both under-escalation (serious issues not raised) and over-escalation (noise drowning signal).

## Escalation Levels

| Level | Authority | Trigger | Scope |
|-------|----------|---------|-------|
| **L0: Monitor** | IC / On-call | Indicators normal | Observe and track |
| **L1: Investigate** | Team lead | Yellow threshold crossed | Investigate, prepare |
| **L2: Act** | PM/EM | Red threshold crossed | Execute mitigation |
| **L3: Escalate** | Director/VP | Impact > single team | Cross-team coordination |
| **L4: Crisis** | Executive/Steering | Multiple compound risks, existential | Organization-wide response |

## Procedure

### Step 1: Define Levels for Context
Adapt the generic levels to your organizational context:
- What titles/roles correspond to each level?
- What's the scope of authority at each level?
- What resources can each level mobilize?

### Step 2: Map Risks to Escalation Paths
For each risk, determine:
- What level is initial owner?
- What triggers escalation to next level?
- Who specifically at each level?

### Step 3: Define Information Requirements
At each level, what information is needed to make decisions?
- What data must be provided?
- What format?
- What context?

### Step 4: Set Response Timeframes
Maximum time to acknowledge and respond at each level:
- L0: Continuous
- L1: Within hours
- L2: Within 1 business day
- L3: Within hours (business-critical)
- L4: Immediate

### Step 5: Document Communication Channels
How is escalation communicated?
- Normal: Email, Slack
- Urgent: Page, phone call
- Crisis: War room, exec bridge

## Output Schema
```yaml
escalation_protocols:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    current_tier: "HIGH"

    levels:
      L0_monitor:
        authority: "Data Engineer on-call"
        trigger: "Indicators in normal range"
        scope: "Observe, log, no action needed"
        response_time: "Continuous monitoring"
        channel: "Dashboard"

      L1_investigate:
        authority: "Team Lead (specific name)"
        trigger: "Yellow threshold crossed"
        scope: "Investigate, prepare response, alert stakeholders"
        response_time: "Acknowledge within 4 hours"
        channel: "Slack alert to #risk-alerts"
        info_required:
          - "Which indicator(s) triggered"
          - "Current values and thresholds"
          - "Initial assessment"

      L2_act:
        authority: "Engineering Manager (specific name)"
        trigger: "Red threshold crossed OR L1 cannot resolve"
        scope: "Authorize mitigation actions, allocate resources"
        response_time: "Acknowledge within 1 hour"
        channel: "Slack escalation + page if after hours"
        info_required:
          - "L1 investigation summary"
          - "Proposed action"
          - "Resource needs"
          - "Impact assessment"

      L3_escalate:
        authority: "Director (specific name)"
        trigger: "Impact exceeds single team OR mitigation needs cross-team coordination"
        scope: "Cross-team resource allocation, stakeholder communication"
        response_time: "Acknowledge within 30 minutes"
        channel: "Phone call + email to leadership"
        info_required:
          - "Full incident summary"
          - "Business impact assessment"
          - "Resources needed from other teams"
          - "Communication plan"

      L4_crisis:
        authority: "VP / Executive (specific name)"
        trigger: "Multiple compound risks OR existential threat OR external escalation"
        scope: "Organization-wide response, executive decisions"
        response_time: "Immediate"
        channel: "Executive bridge call"
        info_required:
          - "Crisis summary"
          - "Options with recommendations"
          - "Resource requirements"
          - "External communication needs"

    de_escalation:
      trigger: "Indicators return to green AND stable for defined period"
      process: "Reverse level by level, document resolution"
```

## Quality Checks
- [ ] All levels defined with specific names
- [ ] Triggers are clear and measurable
- [ ] Response times are realistic
- [ ] Channels are appropriate for urgency
- [ ] Information requirements specified
- [ ] De-escalation path defined

## Connections
- Feeds into: #404 (degradation uses escalation), #502 (escalation triggers review)
- Uses output from: #406 (triggers), #501 (indicators)
- Related to: Incident management process

## Example: Pipeline Risk Escalation

```yaml
risk_id: "RISK-023"
title: "Data pipeline failure during critical period"
current_tier: "CRITICAL"

levels:
  L0_monitor:
    authority: "Data Platform on-call"
    trigger: "Pipeline running, metrics in normal range"
    scope: "Monitor dashboard, acknowledge alerts"
    response_time: "Continuous"
    channel: "Grafana dashboard, Slack #pipeline-alerts"

  L1_investigate:
    authority: "Maria (Data Platform Lead)"
    trigger: |
      ANY of:
      - Execution time > 3.5 hours (yellow)
      - Error rate > 3% (yellow)
      - Data quality score < 95%
    scope: "Investigate root cause, assess impact, prepare response"
    response_time: "Acknowledge within 2 hours"
    channel: "Slack mention + DM if no response"
    info_required:
      - "Which metric triggered"
      - "Time of trigger"
      - "Initial diagnosis"
      - "Affected downstream systems"

  L2_act:
    authority: "James (Engineering Manager)"
    trigger: |
      ANY of:
      - Execution time > 4 hours (SLA boundary)
      - Error rate > 5%
      - L1 investigation finds serious issue
      - Month-end regulatory deadline within 8 hours
    scope: "Authorize resource allocation, approve emergency changes"
    response_time: "Acknowledge within 30 minutes"
    channel: "Page (PagerDuty) + Slack escalation"
    info_required:
      - "L1 summary"
      - "Impact on SLA/regulatory deadline"
      - "Proposed mitigation"
      - "Resource/access needed"
    decisions_available:
      - "Approve emergency compute scaling"
      - "Approve emergency data fixes"
      - "Engage vendor support"
      - "Activate manual fallback"

  L3_escalate:
    authority: "Sarah (Director of Engineering)"
    trigger: |
      ANY of:
      - Regulatory deadline will be missed
      - Multiple downstream systems affected
      - L2 mitigation not working
      - External stakeholder (client) awareness
    scope: "Cross-team coordination, stakeholder communication, budget decisions"
    response_time: "Acknowledge within 15 minutes"
    channel: "Phone call + email to leadership list"
    info_required:
      - "Full situation report"
      - "Business impact (revenue, regulatory, client)"
      - "Resources needed from other teams"
      - "Communication draft for stakeholders"
    decisions_available:
      - "Mobilize resources from other teams"
      - "Approve significant unplanned spend"
      - "Authorize client communication"
      - "Approve deviation from standard process"

  L4_crisis:
    authority: "VP Engineering + VP Client Success"
    trigger: |
      ANY of:
      - Regulatory penalty imminent
      - Client threatening contract action
      - Multiple critical risks materializing simultaneously
      - Public/media exposure
    scope: "Executive decision authority, external communication"
    response_time: "Immediate (drop everything)"
    channel: "Emergency bridge call"
    info_required:
      - "Crisis brief (1-page)"
      - "Options with pros/cons"
      - "Recommended action"
      - "External communication draft"
    decisions_available:
      - "Full organizational response"
      - "External communications"
      - "Contractual decisions"
      - "Regulatory engagement"

de_escalation:
  trigger: "Pipeline completing normally for 24 hours AND no outstanding issues"
  process: |
    L4 → L3: VP confirms crisis resolved, communication complete
    L3 → L2: Director confirms cross-team coordination complete
    L2 → L1: EM confirms mitigation effective, normal process resumed
    L1 → L0: Lead confirms indicators stable, monitoring normal
  documentation: "Post-incident review within 5 business days"
```

## Escalation Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Unclear ownership** | "Someone should look at this" | Specific names at each level |
| **Fear of escalation** | Issues hidden until too late | Blameless culture, celebrate early escalation |
| **Over-escalation** | Executives get noise, become deaf | Clear triggers, trust lower levels |
| **Escalation cliff** | Jump straight to L4 | Graduate through levels |
| **No de-escalation** | War mode never ends | Explicit de-escalation criteria |
| **Wrong channel** | Email for urgent, page for routine | Match channel to urgency |
