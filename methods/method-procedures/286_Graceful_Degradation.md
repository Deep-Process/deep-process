# 404 - Graceful Degradation Planning

## Phase
MITIGATE

## Purpose
Design how the system behaves when risks partially materialize. Rather than binary (working/failed), maintain core value delivery under stress.

## Degradation Levels

| Level | State | Characteristics |
|-------|-------|-----------------|
| **Level 0: Normal** | Everything works as designed | Full functionality, within SLAs |
| **Level 1: Degraded** | Non-critical features disabled | Core works, performance reduced, some features off |
| **Level 2: Emergency** | Minimal viable operation | Only essential functions, manual interventions |
| **Level 3: Controlled Shutdown** | Orderly stop | Preserve data, communicate, minimize damage |

## Procedure

### Step 1: Define Core Value Chain
What MUST keep working for the system to provide value?
- Essential functions vs nice-to-have
- Critical data vs supplementary
- Must-meet SLAs vs best-effort

### Step 2: Map Degradation States
For each critical risk, define what happens at each level:

```
Normal → Degraded → Emergency → Shutdown
```

What's the trigger for each transition?
What functionality exists at each level?

### Step 3: Design Transitions
How do we move between levels?

| Aspect | Design Decision |
|--------|-----------------|
| **Automatic vs Manual** | Which transitions happen automatically? |
| **Decision Authority** | Who can trigger Level 2? Level 3? |
| **Reversibility** | How do we return to normal? |
| **Communication** | Who is notified at each transition? |

### Step 4: Test Degradation Paths
**Critical:** Most organizations have never actually run at Level 2.

- Game day exercises
- Chaos experiments (#110)
- Planned degradation tests

### Step 5: Document Runbooks
For each level transition:
- Trigger conditions
- Actions to take
- Rollback conditions
- Communication templates

## Output Schema
```yaml
degradation_plans:
  - risk_id: "RISK-XXX"
    title: "Risk description"

    core_value_chain:
      essential_functions:
        - "Function that must work"
      degradable_functions:
        - "Function that can be disabled"
      essential_data:
        - "Data that must be available"
      degradable_data:
        - "Data that can be stale/unavailable"

    levels:
      normal:
        description: "Everything working"
        sla: "All SLAs met"
        functionality: "100%"

      degraded:
        description: "What degraded looks like"
        trigger: "Condition that triggers L0→L1"
        disabled_functions:
          - "Function disabled"
        maintained_functions:
          - "Function maintained"
        sla_adjustment: "What changes"
        communication: "Who to notify"

      emergency:
        description: "What emergency looks like"
        trigger: "Condition that triggers L1→L2"
        minimal_functions:
          - "Only these work"
        manual_interventions:
          - "What requires manual action"
        sla_adjustment: "What changes"
        communication: "Who to notify"
        decision_authority: "Who can declare emergency"

      shutdown:
        description: "Controlled shutdown"
        trigger: "Condition that triggers L2→L3"
        data_preservation: "How data is saved"
        communication: "Who to notify"
        decision_authority: "Who can declare shutdown"
        restart_conditions: "What's needed to restart"

    transitions:
      - from: "Normal"
        to: "Degraded"
        automatic: true
        trigger: "Specific condition"
        actions: ["Action 1", "Action 2"]
      # ... other transitions

    tested: "[true|false]"
    last_test_date: "YYYY-MM-DD"
    test_findings: "What we learned"
```

## Quality Checks
- [ ] Core value chain defined
- [ ] All four levels designed
- [ ] Triggers clearly specified
- [ ] Decision authority assigned
- [ ] Communication plans in place
- [ ] Degradation paths tested

## Connections
- Feeds into: #503 (escalation protocol), #503 (alerting at transitions)
- Uses output from: #003 (Normal Accidents - systems needing graceful degradation)
- Related to: #403 (CONTAIN layer is graceful degradation)

## Example: Reporting Pipeline

```yaml
risk_id: "RISK-031"
title: "Month-end reporting pipeline failure"

core_value_chain:
  essential_functions:
    - "Regulatory report generation"
    - "Core financial calculations"
  degradable_functions:
    - "Ad-hoc query capability"
    - "Dashboard refresh"
    - "Email notifications"
  essential_data:
    - "Transaction data (T-1)"
    - "Reference data"
  degradable_data:
    - "Historical trends (can use cache)"
    - "Real-time updates (can be delayed)"

levels:
  normal:
    description: "Full automated pipeline, all reports on schedule"
    sla: "Reports delivered T+4 hours"
    functionality: "100% - all features available"

  degraded:
    description: "Core reports only, dashboards may be stale"
    trigger: "Pipeline latency >2x normal OR component failure"
    disabled_functions:
      - "Ad-hoc queries blocked"
      - "Dashboard auto-refresh paused"
      - "Non-essential reports postponed"
    maintained_functions:
      - "Regulatory reports (priority queue)"
      - "Core financial reports"
    sla_adjustment: "Reports delivered T+8 hours, dashboards T+24 hours"
    communication: "Slack alert to data team, email to stakeholders"

  emergency:
    description: "Manual processing, regulatory only"
    trigger: "Pipeline cannot complete OR data quality critical failure"
    minimal_functions:
      - "Manual regulatory report generation (fallback script)"
      - "Manual data validation"
    manual_interventions:
      - "Manual data export from source"
      - "Manual calculation verification"
      - "Manual report submission"
    sla_adjustment: "Regulatory met (hard deadline), others postponed"
    communication: "War room, executive notification, client notification"
    decision_authority: "Engineering Manager + Data Lead"

  shutdown:
    description: "Pipeline halted, preserve data state"
    trigger: "Data corruption detected OR security incident"
    data_preservation: "Checkpoint state, lock tables, export to backup"
    communication: "Executive notification, regulatory notification if relevant"
    decision_authority: "Director level"
    restart_conditions: |
      - Root cause identified
      - Data integrity verified
      - Fix deployed and tested
      - Approval from Data Lead

transitions:
  - from: "Normal"
    to: "Degraded"
    automatic: true
    trigger: "Monitoring alert: latency > 2x OR error rate > 5%"
    actions:
      - "Pause non-essential jobs"
      - "Prioritize regulatory queue"
      - "Send Slack notification"
    reversible_when: "Metrics return to normal for 30 min"

  - from: "Degraded"
    to: "Emergency"
    automatic: false
    trigger: "Pipeline cannot complete critical reports"
    actions:
      - "Activate war room"
      - "Notify stakeholders"
      - "Begin manual fallback"
    decision_authority: "Engineering Manager"

  - from: "Emergency"
    to: "Shutdown"
    automatic: false
    trigger: "Data corruption or security incident"
    actions:
      - "Halt all processing"
      - "Preserve state"
      - "Notify executives"
    decision_authority: "Director"

tested: true
last_test_date: "2024-01-15"
test_findings: |
  - L1 transition worked smoothly
  - L2 manual fallback took 2 hours longer than expected
  - Action: Updated runbook with missing steps
  - Action: Scheduled quarterly L2 drill
```

## Graceful Degradation Principles

1. **Fail gracefully, not completely:** Some function better than no function
2. **Protect the core:** Know what must survive
3. **Communicate clearly:** Stakeholders need to know the current state
4. **Test regularly:** Untested degradation paths fail when needed
5. **Automate where safe:** But keep human judgment for major transitions
6. **Design for recovery:** Every degradation level should have a path back to normal
