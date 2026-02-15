# 604 - Risk Communication Framework

## Phase
META (During OUTPUT)

## Purpose
Ensure the right view for the right audience. Different stakeholders need different risk presentations - one size does not fit all.

## Audience Needs Matrix

| Audience | Needs | Format | Level of Detail |
|----------|-------|--------|-----------------|
| **Engineering** | Technical detail, actions | Detailed register, tickets | Full |
| **PM/EM** | Priority, timeline impact | Top-10 dashboard | Summary + critical details |
| **Executives** | Business impact, strategic implications | Heat map, 3-bullet summary | Executive summary |
| **Client** | Assurance, material risks | Curated report | Appropriate disclosure |
| **Regulators** | Compliance evidence | Formal assessment | Per requirements |

## Procedure

### Step 1: Identify Audiences
Who needs to see risk information?
- Internal: Engineering, PM, EM, Director, VP, Steering
- External: Client, Regulator, Auditor, Partner

### Step 2: Determine Needs Per Audience
For each audience:
- What decisions will they make based on this?
- What level of detail do they need?
- What format works for them?
- What frequency?

### Step 3: Design Views
Create tailored views:
- Filter appropriate risks
- Select appropriate level of detail
- Choose appropriate format
- Set appropriate frequency

### Step 4: Define Update Cadence
How often does each audience receive updates?
- Real-time: Engineering (dashboards)
- Weekly: PM/EM
- Monthly: Directors
- Quarterly: Executives, Clients

### Step 5: Establish Communication Channels
How is each view delivered?
- Dashboard (real-time)
- Email summary (periodic)
- Meeting presentation (review)
- Formal report (documentation)

## Output Schema
```yaml
communication_framework:
  audiences:
    - audience: "Engineering Team"
      needs:
        - "Technical detail on risks"
        - "Specific actions to take"
        - "Impact on their components"
      format: "Detailed register + Jira tickets"
      level_of_detail: "Full"
      frequency: "Real-time (dashboard) + weekly review"
      channel: "Confluence + Grafana + Jira"
      content_filter: "All risks, full detail"
      owner: "Tech Lead"

    - audience: "PM/EM"
      needs:
        - "Priority ranking"
        - "Timeline impact"
        - "Resource needs"
        - "Escalations"
      format: "Top-10 dashboard + summary"
      level_of_detail: "Summary with detail on top risks"
      frequency: "Weekly"
      channel: "Email summary + weekly meeting"
      content_filter: "HIGH/CRITICAL + escalations"
      owner: "Risk Lead"

    - audience: "Director/VP"
      needs:
        - "Portfolio health"
        - "Strategic implications"
        - "Resource/budget asks"
        - "Escalations requiring decision"
      format: "Portfolio dashboard + 3-bullet summary"
      level_of_detail: "Executive summary"
      frequency: "Monthly (ad-hoc for escalations)"
      channel: "Monthly review meeting + escalation path"
      content_filter: "CRITICAL + portfolio metrics + decisions needed"
      owner: "Engineering Manager"

    - audience: "Client"
      needs:
        - "Assurance of quality"
        - "Material risks affecting them"
        - "Mitigation status"
      format: "Curated risk summary"
      level_of_detail: "Appropriate disclosure"
      frequency: "Monthly or per milestone"
      channel: "Formal report in client meeting"
      content_filter: "Client-facing risks only, no internal details"
      owner: "Account Manager"
```

## Quality Checks
- [ ] All audiences identified
- [ ] Needs documented for each
- [ ] Formats appropriate to audience
- [ ] Frequency defined
- [ ] Channels specified
- [ ] Content filters applied

## Connections
- Feeds into: OUTPUT deliverables
- Uses output from: All phases (content to communicate)
- Related to: #502 (review cadence aligns with communication)

## Communication Templates

### Engineering View
```
┌─────────────────────────────────────────────────────────────┐
│ ENGINEERING RISK REGISTER                                    │
├─────────────────────────────────────────────────────────────┤
│ RISK-023: Source schema change breaks pipeline              │
│ Tier: CRITICAL | Score: 80 | Owner: Maria                   │
│ Component: data-pipeline/ingestion                          │
│ ─────────────────────────────────────────────────────────── │
│ Description: Schema drift in source system causes parsing   │
│ failures. Last occurrence: 2024-02-01.                      │
│ ─────────────────────────────────────────────────────────── │
│ Mitigation: Add Great Expectations schema validation        │
│ Status: In Progress | Due: 2024-03-01 | Jira: DATA-1234    │
│ ─────────────────────────────────────────────────────────── │
│ Indicators: Error rate, Schema diff alerts                  │
│ Current: GREEN | Last checked: 2024-02-15 09:00            │
└─────────────────────────────────────────────────────────────┘
```

### PM/EM View
```
┌─────────────────────────────────────────────────────────────┐
│ WEEKLY RISK SUMMARY                     Week of 2024-02-12  │
├─────────────────────────────────────────────────────────────┤
│ Portfolio: YELLOW (1 escalation, 2 approaching threshold)   │
│                                                             │
│ TOP 5 RISKS:                                                │
│ #  Risk                      Score  Trend   Action Needed   │
│ ── ────────────────────────  ─────  ─────   ─────────────   │
│ 1  Client concentration       50     →      Exec decision   │
│ 2  Pipeline performance       48     ↑      Investigation   │
│ 3  Key person dependency      45     →      Cross-training  │
│ 4  Budget overrun             40     ↓      Monitoring      │
│ 5  Integration delay          35     ↑      Mitigation      │
│                                                             │
│ ESCALATIONS:                                                │
│ • RISK-067: Needs VP decision on diversification strategy   │
│                                                             │
│ MITIGATIONS DUE THIS WEEK: 3                                │
│ • DATA-1234 (schema validation) - Maria - 2024-02-16       │
└─────────────────────────────────────────────────────────────┘
```

### Executive View
```
┌─────────────────────────────────────────────────────────────┐
│ EXECUTIVE RISK BRIEF                         February 2024  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ PORTFOLIO STATUS: YELLOW                                    │
│                                                             │
│ KEY MESSAGES:                                               │
│ • Client concentration (62%) exceeds threshold - decision   │
│   required on diversification investment                    │
│ • Technical risks well-managed, no immediate concerns       │
│ • Month-end period remains highest risk window              │
│                                                             │
│ HEAT MAP:              LOW IMPACT ───── HIGH IMPACT         │
│                        │    │    │    │    │                │
│ HIGH PROBABILITY       │    │    │ ●  │ ● ●│                │
│                        │    │    │    │    │                │
│ LOW PROBABILITY        │ ●● │ ●  │ ●  │    │                │
│                        │    │    │    │    │                │
│                                                             │
│ DECISION REQUIRED:                                          │
│ Approve $50K investment in client diversification program?  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Client View
```
┌─────────────────────────────────────────────────────────────┐
│ PROJECT RISK SUMMARY                         February 2024  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ RISK MANAGEMENT STATUS: HEALTHY                             │
│                                                             │
│ We actively monitor and manage project risks. Current       │
│ assessment shows no material risks to timeline or quality.  │
│                                                             │
│ MATERIAL RISKS:                                             │
│ • Integration timeline has 2-week buffer; tracking well     │
│ • Third-party API dependency has backup plan in place       │
│                                                             │
│ MITIGATION HIGHLIGHTS:                                      │
│ • Added automated monitoring for data quality               │
│ • Completed security review - no issues found               │
│ • Performance testing confirmed capacity headroom           │
│                                                             │
│ NEXT REVIEW: March 15, 2024                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Communication Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Same report for everyone | Execs get TMI, engineers get TLI | Tailor to audience |
| All bad news all the time | Stakeholders tune out | Include context and progress |
| Hiding risks from client | Trust breakdown when discovered | Appropriate transparency |
| Technical jargon to execs | Misunderstanding, poor decisions | Translate to business impact |
| No decisions requested | Report is ignored | Always include asks |
