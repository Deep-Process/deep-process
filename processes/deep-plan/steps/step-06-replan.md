# STEP 6-REPLAN: ADAPTIVE_RE_PLANNING

## PRECONDITION

```
TRIGGER: execution-status.yaml updated (weekly OR on-demand)

GATE_ENTRY: baseline-plan.yaml EXISTS

IF baseline-plan.yaml NOT EXISTS:
  HALT
  OUTPUT: "ERROR: Run initial planning first (step-00 through step-06)"
```

## SEQUENCE

### 6R.1: LOAD_ACTUALS

```
READ: execution-status.yaml

EXTRACT:
  completed_tasks: WHERE status = COMPLETED
  in_progress_tasks: WHERE status = IN_PROGRESS
  blocked_tasks: WHERE status = BLOCKED
  pending_tasks: WHERE status = PENDING

FOR each completed_task:
  EXTRACT:
    actual_duration: completed - started
    actual_story_points: {sp}

COMPUTE:
  total_completed_sp = SUM(completed_tasks.story_points)
  elapsed_sprints = {count}
  actual_velocity = total_completed_sp / elapsed_sprints

STORE: actuals_context
```

### 6R.2: LOAD_CHANGES

```
READ: approved-changes.yaml (from deep-change)

FOR each approved_change:

  IF change.status = APPROVED AND NOT implemented:

    EXTRACT:
      change_id: {id}
      new_tasks: {list}
      removed_tasks: {list}
      modified_tasks: {list}

    STORE: changes_to_integrate[]

VERIFY: changes_to_integrate NOT empty OR actuals require update
```

### 6R.3: COMPUTE_VARIANCE

```
LOAD: baseline-plan.yaml

COMPARE: actuals vs baseline

COMPUTE:
  schedule_variance = (actual_progress - planned_progress) / planned_progress
  velocity_variance = (actual_velocity - planned_velocity) / planned_velocity
  scope_variance = (current_tasks - baseline_tasks) / baseline_tasks

FLAG_IF:
  ABS(schedule_variance) > 0.10 → significant_schedule_variance
  ABS(velocity_variance) > 0.10 → significant_velocity_variance
  ABS(scope_variance) > 0.05 → significant_scope_variance

IF any significant_variance:
  DECLARE: replanning_required = TRUE
```

### 6R.4: UPDATE_ESTIMATES

```
FOR each task_type IN [CODE, TEST, DOCS, CONFIG]:

  COMPUTE:
    actual_avg_duration = AVG(completed_tasks WHERE type = task_type).actual_duration
    baseline_avg_duration = AVG(baseline_tasks WHERE type = task_type).estimated_duration

    adjustment_factor = actual_avg_duration / baseline_avg_duration

  FOR each future_task WHERE type = task_type AND status = PENDING:

    UPDATE: task.estimated_duration *= adjustment_factor

VERIFY: ALL future tasks re-estimated
```

### 6R.5: INTEGRATE_CHANGES

```
FOR each change IN changes_to_integrate[]:

  FOR each new_task IN change.new_tasks:
    INSERT: task INTO tasks[]
    ASSIGN: priority, dependencies, assignments

  FOR each removed_task IN change.removed_tasks:
    REMOVE: task FROM tasks[]
    UPDATE: dependent tasks

  FOR each modified_task IN change.modified_tasks:
    UPDATE: task properties

RECOMPUTE: total_tasks, total_story_points
```

### 6R.6: RESEQUENCE

```
BASED ON: updated_estimates, integrated_changes, blocked_tasks

RE-EXECUTE: topological_sort (from step-02)

FOR each blocked_task:

  IF blocker resolved:
    UNBLOCK: task
    RESCHEDULE: According to dependencies

  IF blocker unresolved:
    FIND: alternative tasks (not blocked)
    REORDER: Sprint backlog to work around blocker

REGENERATE: critical_path
RECOMPUTE: total_duration
```

### 6R.7: REBALANCE_CAPACITY

```
IF actual_velocity < planned_velocity:

  COMPUTE: velocity_gap = planned_velocity - actual_velocity

  OPTIONS:
    A: extend_timeline = CEILING(velocity_gap / actual_velocity) sprints
    B: descope_tasks = velocity_gap × remaining_sprints story_points
    C: add_resources = CEILING(velocity_gap / (velocity_per_person)) people

  RECOMMEND: Option based on constraints

  OUTPUT: "Velocity below plan. Options: A (extend {n} sprints), B (descope {sp} SP), C (add {n} people)"
  ESCALATE: To deep-govern for decision

AWAIT: governance decision

APPLY: approved option
```

### 6R.8: REGENERATE_PLAN

```
RERUN: sequencing (step-02)
RERUN: allocation (step-03)
RERUN: risk integration (step-04)
RERUN: validation (step-05)

WITH: updated data (actuals, changes, rebalanced capacity)

GENERATE: implementation-plan-v{N}.yaml

INCREMENT: plan_version

COMPUTE: change_impact
  timeline_delta = new_duration - baseline_duration
  cost_delta = new_cost - baseline_cost
  scope_delta = new_tasks - baseline_tasks
```

### 6R.9: GENERATE_NEXT_SPRINT_BACKLOG

```
EXTRACT: next_sprint_tasks FROM implementation-plan-v{N}.yaml

INCREMENT: sprint_number

WRITE: sprint-backlog-{N+1}.yaml

WITH:
  - Carry-over incomplete tasks FROM current sprint
  - New tasks FROM re-sequenced plan
  - Priority-ordered (P0 first)
  - Capacity-balanced
```

## COUNTER-CHECK

```
CLAIM: "Re-plan preserves all critical requirements"

ATTEMPT_REFUTATION:
  FOR each critical_risk IN risk_schedule.yaml:

    CHECK: mitigation tasks still scheduled by deadline?

    IF NOT:
      REFUTATION: SUCCESS
      OUTPUT: "Risk mitigation no longer on schedule: {risk_id}"
      RETURN: To resequencing

  FOR each quality_attribute IN architecture_context:

    CHECK: tasks supporting attribute still in plan?

    IF NOT:
      REFUTATION: SUCCESS
      OUTPUT: "Quality attribute no longer covered: {attribute}"
      RETURN: To rescoping

  REFUTATION: FAILED
  CONFIRMATION: "Critical requirements preserved"
```

## CHECKLIST

```
□ Actuals loaded (completed, in-progress, blocked)?
□ Changes loaded (approved-changes.yaml)?
□ Variance computed (schedule, velocity, scope)?
□ Estimates updated (task durations adjusted)?
□ Changes integrated (new/removed/modified tasks)?
□ Plan resequenced (dependencies, blockers handled)?
□ Capacity rebalanced (velocity gap addressed)?
□ Plan regenerated (new version created)?
□ Next sprint backlog generated?
□ Counter-check executed (critical requirements preserved)?

IF any NO → FIX before proceeding
IF all YES → COMPLETE re-planning
```

## OUTPUT

```
WRITE: implementation-plan-v{N}.yaml (updated plan)
WRITE: sprint-backlog-{N+1}.yaml (next sprint)
WRITE: plan-variance-report.md

content:
  previous_version: "v{N-1}"
  current_version: "v{N}"
  replan_date: {timestamp}
  replan_trigger: "Weekly update" | "Major change" | "Variance exceeded"

  variance_summary:
    schedule_variance: {percentage}
    velocity_variance: {percentage}
    scope_variance: {percentage}

  changes_integrated:
    new_tasks: {count}
    removed_tasks: {count}
    modified_tasks: {count}

  impact:
    timeline_delta: {value}
    cost_delta: {value}
    scope_delta: {value}

  next_sprint: {sprint_number}
```
