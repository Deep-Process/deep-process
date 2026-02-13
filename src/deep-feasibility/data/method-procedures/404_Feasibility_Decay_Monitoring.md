# #404 Feasibility Decay Monitoring

**Phase:** 4 (DECIDE)
**Tier:** 2 — Recommended
**Purpose:** Define how to monitor feasibility post-decision and detect decay

## Theoretical Foundation

Feasibility is not static — it decays over time. Assumptions become stale, contexts change, and new information emerges. Projects that were feasible at decision time become infeasible without anyone noticing.

**Key insight:** Feasibility must be monitored, not just assessed once. Define leading indicators that signal feasibility decay before it becomes critical.

## Decay Drivers

| Driver | How Feasibility Decays |
|--------|----------------------|
| **Time passing** | Assumptions become stale, contexts change |
| **Scope creep** | Original feasibility no longer applies to new scope |
| **Resource changes** | Team members leave, budgets cut |
| **External changes** | Dependencies deprecated, regulations change |
| **Technical discovery** | "Unknown unknowns" become known problems |
| **Market changes** | Value proposition no longer valid |

## Step-by-step

### Step 1: Identify Decay Vectors

For each dimension, identify what could cause decay:

```
DECAY VECTORS BY DIMENSION:

Technical:
□ Technology deprecated
□ Security vulnerability discovered
□ Integration breaks due to vendor update

Resource:
□ Key person leaves
□ Budget cut
□ Competing priority emerges

Temporal:
□ Scope additions without timeline extension
□ Underestimated complexity discovered
□ Dependencies delayed

Dependency:
□ API deprecated or changed
□ Vendor goes out of business
□ License terms change

Economic:
□ Cost estimates prove wrong
□ Benefit realization delayed
□ Market conditions change
```

### Step 2: Define Leading Indicators

Leading indicators signal decay before it becomes critical:

| Dimension | Leading Indicator | Threshold | Action |
|-----------|------------------|-----------|--------|
| Temporal | Velocity below plan | <80% for 2 sprints | Re-assess timeline |
| Resource | Team capacity | Key person utilization >120% | Add resources or reduce scope |
| Technical | Blocker frequency | >2 blockers per sprint | Architecture review |
| Dependency | Integration success rate | <95% | Investigate dependency |
| Economic | Burn rate | >110% of plan | Cost review |

### Step 3: Set Monitoring Cadence

```
MONITORING CADENCE:

Weekly checks:
□ Velocity vs plan
□ Blocker count
□ Team capacity

Sprint-end checks:
□ Dimension-level feasibility review
□ Assumption status update
□ Dependency health check

Monthly checks:
□ Full feasibility re-assessment
□ Condition status review
□ External change scan

Trigger-based checks:
□ Major scope change → Immediate re-assessment
□ Key person leaves → Resource feasibility check
□ Dependency failure → Integration feasibility check
```

### Step 4: Define Decay Thresholds

When does decay require action?

```
DECAY SEVERITY LEVELS:

WATCH (Yellow):
- Single indicator crosses threshold
- Score drops by 0.5 points
- Confidence drops one level

Action: Add to next review agenda

CONCERN (Orange):
- Multiple indicators cross threshold
- Score drops by 1 point
- Binding constraint affected

Action: Immediate stakeholder discussion

CRITICAL (Red):
- Binding constraint drops to 2 or below
- New NO-GO condition emerges
- Unrecoverable assumption invalidated

Action: Stop work, emergency re-assessment
```

### Step 5: Create Monitoring Dashboard

```
FEASIBILITY MONITORING DASHBOARD

Last assessed: 2024-01-15
Next full re-assessment: 2024-02-15

DIMENSION STATUS:
Technical      ████████░░ 4/5 (H) → ████████░░ 4/5 (H) ● STABLE
Resource       ██████░░░░ 3/5 (M) → ██████░░░░ 3/5 (M) ● STABLE
Knowledge      ████████░░ 4/5 (H) → ████████░░ 4/5 (H) ● STABLE
Organizational ██████░░░░ 3/5 (M) → ██████░░░░ 3/5 (M) ● STABLE
Temporal       ████░░░░░░ 2/5 (L) → ████░░░░░░ 2/5 (M) ▲ IMPROVING
Compositional  ██████░░░░ 3/5 (M) → ██████░░░░ 3/5 (M) ● STABLE
Economic       ████████░░ 4/5 (H) → ████████░░ 4/5 (H) ● STABLE
Scale          ██████░░░░ 3/5 (L) → ██████░░░░ 3/5 (M) ▲ IMPROVING
Cognitive      ████████░░ 4/5 (H) → ████████░░ 4/5 (H) ● STABLE
Dependency     ██████░░░░ 3/5 (M) → ████░░░░░░ 2/5 (M) ▼ DECAYING

LEADING INDICATORS:
Velocity:        85% of plan  ● OK (threshold: 80%)
Blockers:        1 this sprint ● OK (threshold: 2)
Team capacity:   95%          ● OK (threshold: 120%)
Burn rate:       98% of plan  ● OK (threshold: 110%)
Integration:     90%          ⚠ WATCH (threshold: 95%)

CONDITION STATUS:
Timeline +6 weeks: ✓ Approved
Mars API access:   ⚠ Delayed (now Week 6)
Synapse validated: ✓ Complete

ALERTS:
⚠ Dependency dimension decaying (Mars API delayed)
  Action: Activate file-based fallback plan
```

### Step 6: Define Re-Assessment Triggers

```
RE-ASSESSMENT TRIGGERS:

Automatic triggers:
□ Binding constraint score drops
□ New dimension crosses threshold
□ Monthly cadence reached

Decision triggers:
□ Major scope change approved
□ Timeline change (extension or compression)
□ Budget change (increase or cut)
□ Team change (addition or departure)

External triggers:
□ Dependency status changes
□ Technology announcement (deprecation, vulnerability)
□ Regulatory change
□ Market change
```

### Step 7: Score Monitoring Readiness

| Score | Criteria |
|-------|----------|
| 5 | All indicators defined, dashboards live, triggers automated |
| 4 | Key indicators defined, regular monitoring scheduled |
| 3 | Some indicators, manual monitoring |
| 2 | Awareness of decay risk, no systematic monitoring |
| 1 | No monitoring plan, assume feasibility is static |

## Output format

```yaml
feasibility_decay_monitoring:
  score: 4
  confidence: "H"

  decay_vectors:
    technical:
      - "Technology deprecation"
      - "Security vulnerabilities"
      - "Vendor updates breaking integration"

    resource:
      - "Key person departure"
      - "Budget cuts"
      - "Competing priorities"

    temporal:
      - "Scope creep without timeline extension"
      - "Complexity discovery"
      - "Dependency delays"

    dependency:
      - "API changes or deprecation"
      - "Vendor viability issues"
      - "License term changes"

    economic:
      - "Cost overruns"
      - "Benefit realization delays"
      - "Market condition changes"

  leading_indicators:
    - indicator: "Sprint velocity"
      dimension: "Temporal"
      measurement: "Story points completed vs planned"
      threshold: "< 80% for 2 consecutive sprints"
      action: "Re-assess timeline feasibility"
      owner: "Scrum Master"
      frequency: "Weekly"

    - indicator: "Blocker frequency"
      dimension: "Technical"
      measurement: "Blockers raised per sprint"
      threshold: "> 2 blockers per sprint"
      action: "Architecture review"
      owner: "Tech Lead"
      frequency: "Weekly"

    - indicator: "Team capacity utilization"
      dimension: "Resource"
      measurement: "Actual hours vs planned"
      threshold: "> 120% sustained"
      action: "Resource review"
      owner: "PM"
      frequency: "Weekly"

    - indicator: "Integration success rate"
      dimension: "Dependency"
      measurement: "Successful integration calls / total"
      threshold: "< 95%"
      action: "Dependency health check"
      owner: "Tech Lead"
      frequency: "Weekly"

    - indicator: "Burn rate"
      dimension: "Economic"
      measurement: "Actual spend vs budget"
      threshold: "> 110% of planned"
      action: "Cost review meeting"
      owner: "PM"
      frequency: "Monthly"

  monitoring_cadence:
    weekly:
      - "Velocity check"
      - "Blocker review"
      - "Capacity review"

    sprint_end:
      - "Dimension-level review"
      - "Assumption status update"
      - "Dependency health check"

    monthly:
      - "Full feasibility re-assessment"
      - "Condition status review"
      - "External change scan"

  decay_thresholds:
    watch:
      criteria:
        - "Single indicator crosses threshold"
        - "Score drops by 0.5"
        - "Confidence drops one level"
      action: "Add to next review"
      escalation: "Team lead"

    concern:
      criteria:
        - "Multiple indicators cross threshold"
        - "Score drops by 1 point"
        - "Binding constraint affected"
      action: "Immediate stakeholder discussion"
      escalation: "Sponsor"

    critical:
      criteria:
        - "Binding constraint drops to 2 or below"
        - "New NO-GO condition emerges"
        - "Unrecoverable assumption invalidated"
      action: "Stop work, emergency re-assessment"
      escalation: "Steering committee"

  re_assessment_triggers:
    automatic:
      - "Monthly cadence (scheduled: 15th)"
      - "Binding constraint score drops"
      - "New dimension crosses threshold"

    decision_based:
      - "Major scope change"
      - "Timeline change"
      - "Budget change > 10%"
      - "Key team member change"

    external:
      - "Dependency status change"
      - "Technology announcement"
      - "Regulatory change"

  current_status:
    last_full_assessment: "2024-01-15"
    next_scheduled: "2024-02-15"

    dimension_trends:
      - dimension: "Temporal"
        previous: 2
        current: 2
        trend: "Improving"
        note: "Confidence increased after planning"

      - dimension: "Dependency"
        previous: 3
        current: 2
        trend: "Decaying"
        note: "Mars API delayed"
        alert: "CONCERN"
        action: "Activate fallback plan"

    indicator_status:
      velocity: "85% — OK"
      blockers: "1 — OK"
      capacity: "95% — OK"
      integration: "90% — WATCH"
      burn_rate: "98% — OK"

    active_alerts:
      - alert: "Dependency decay"
        severity: "CONCERN"
        dimension: "Dependency"
        cause: "Mars API delayed to Week 6"
        action: "Activate file-based fallback"
        owner: "PM"
        due: "Week 5"

  dashboard_location: "link/to/monitoring/dashboard"

  recommendations:
    - "Implement automated indicator tracking"
    - "Schedule monthly re-assessment on calendar"
    - "Define clear escalation paths"
    - "Document assumptions for decay tracking"
```

## Integration Points

- **Feeds from:** All Phase 2 assessments, #403 Conditions
- **Feeds to:** Project monitoring, risk management, status reporting

## Common Pitfalls

- **Set and forget:** Assessing once, never monitoring
- **Lagging indicators only:** Only seeing decay after it's critical
- **No thresholds:** Monitoring without action triggers
- **Manual everything:** Relying on memory, not systems
- **Decay denial:** Ignoring warning signs
