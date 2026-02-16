# STEP 6: BASELINE

## PRECONDITION

```
GATE_ENTRY: GATE_5 = OPEN

IF GATE_5 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_5 not open"
```

## SEQUENCE

### 6.1: SNAPSHOT_PLAN

```
LOAD: work-breakdown-structure.yaml
LOAD: sequencing-plan.yaml
LOAD: resource-allocation.yaml
LOAD: risk-schedule.yaml

MERGE: INTO implementation-plan.yaml

COPY: implementation-plan.yaml TO baseline-plan-v1.0.yaml

RECORD:
  baseline_version: "1.0"
  baseline_date: {timestamp}
  baseline_scope: {total_tasks}
  baseline_duration: {total_sprints}
  baseline_cost: {total_cost}

VERIFY: baseline-plan-v1.0.yaml EXISTS
```

### 6.2: RECORD_ASSUMPTIONS

```
DOCUMENT: planning_assumptions

assumptions:
  - "Team size: {team_size} people, stable for {timeline} months"
  - "Velocity: {velocity} SP per person per sprint"
  - "Utilization: {utilization}% (productive time)"
  - "Sprint duration: 2 weeks, no holidays/disruptions"
  - "No major blockers lasting > 3 days"
  - "Critical risks mitigated by deadlines"
  - "Technology stack stable, no major changes"
  - "External dependencies (APIs) available"
  - "Budget allocated and available on schedule"
  - "Team skills match task requirements"

COUNT: total_assumptions

VERIFY: total_assumptions >= 10

IF < 10:
  OUTPUT: "Insufficient assumptions documented: {count}"
  ADD: More assumptions
```

### 6.3: GENERATE_FIRST_SPRINT_BACKLOG

```
LOAD: sprints[] FROM implementation-plan.yaml

EXTRACT: Sprint-01 tasks

FOR each task IN Sprint-01:

  DEFINE:
    task_id: {id}
    task_title: {title}
    assigned_to: {person}
    story_points: {sp}
    dependencies: {list}
    definition_of_done:
      - "Code written, follows standards"
      - "Tests written, coverage >= 80%"
      - "Code reviewed, approved"
      - "Documentation updated"
      - "Quality gates passed"

WRITE: sprint-backlog-01.yaml

VERIFY: sprint-backlog-01.yaml EXISTS
```

### 6.4: GENERATE_TIMELINE

```
COMPUTE:
  sprint_1_start = {current_date}
  sprint_1_end = sprint_1_start + 14 days

FOR each sprint IN sprints[]:

  COMPUTE:
    sprint_start = previous_sprint_end + 1 day
    sprint_end = sprint_start + 14 days

  RECORD: sprint.start_date, sprint.end_date

GENERATE: timeline visualization (text-based Gantt)

WRITE: timeline.md

content:
  - Sprint timeline table
  - Critical path visualization
  - Milestone dates
  - Risk mitigation deadlines
```

## COUNTER-CHECK

```
CLAIM: "Baseline plan complete and correct"

ATTEMPT_REFUTATION:
  CHECK: baseline-plan-v1.0.yaml missing?
  CHECK: implementation-plan.yaml != baseline-plan-v1.0.yaml?
  CHECK: sprint-backlog-01.yaml missing?
  CHECK: timeline.md missing?
  CHECK: assumptions < 10?

  IF any TRUE:
    REFUTATION: SUCCESS
    OUTPUT: "Baseline incomplete: [issue]"
    RETURN: To failed step

  REFUTATION: FAILED
  CONFIRMATION: "Baseline complete"
```

## CHECKLIST

```
□ Plan snapshot created (baseline-plan-v1.0.yaml)?
□ Assumptions documented (>= 10)?
□ First sprint backlog generated (sprint-backlog-01.yaml)?
□ Timeline generated (timeline.md)?
□ Counter-check executed (baseline complete)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_6
```

## GATE_6

```
EVALUATE:
  baseline_plan_exists = TRUE
  assumptions_documented >= 10
  sprint_backlog_01_exists = TRUE
  timeline_exists = TRUE
  baseline_complete = TRUE

IF all TRUE:
  GATE_6 = OPEN
  OUTPUT: "GATE_6 OPEN - baseline set, ready for execution"
  OUTPUT: "Baseline: {total_tasks} tasks, {total_sprints} sprints, {total_cost} cost"
  COMPLETE: deep-plan process

IF any FALSE:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED - incomplete: [condition]"
  HALT
```

## OUTPUT

```
PRIMARY OUTPUTS:
  - implementation-plan.yaml (master plan)
  - baseline-plan-v1.0.yaml (snapshot for comparison)
  - sprint-backlog-01.yaml (first sprint, ready for execution)
  - timeline.md (Gantt chart, milestones)

SUPPORTING OUTPUTS:
  - planning-context.yaml (from step-00)
  - work-breakdown-structure.yaml (from step-01)
  - sequencing-plan.yaml (from step-02)
  - resource-allocation.yaml (from step-03)
  - risk-schedule.yaml (from step-04)
  - validation-results.yaml (from step-05)
```
