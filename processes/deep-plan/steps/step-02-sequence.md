# STEP 2: SEQUENCE

## PRECONDITION

```
GATE_ENTRY: GATE_1 = OPEN

IF GATE_1 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_1 not open"
```

## SEQUENCE

### 2.1: MAP_DEPENDENCIES

```
LOAD: work-breakdown-structure.yaml → tasks[]

FOR each task IN tasks[]:

  IDENTIFY: dependencies

  dependency_types:
    TECHNICAL: task_b needs task_a output
    RESOURCE: same person cannot do both simultaneously
    KNOWLEDGE: task_b requires skill from task_a

  FOR each dependency:
    CREATE: dependency_id = DEP-{seq}
    DEFINE:
      source_task: {task_id_a}
      target_task: {task_id_b}
      dependency_type: {type}

    STORE: dependencies[]

COUNT: total_dependencies

VERIFY: dependencies[] NOT empty
```

### 2.2: DETECT_CYCLES

```
BUILD: dependency_graph FROM dependencies[]

EXECUTE: cycle_detection_algorithm

IF cycle DETECTED:
  OUTPUT: "Circular dependency: {task_ids in cycle}"
  HALT

IF NO cycles:
  CONFIRM: "Dependency graph acyclic"
```

### 2.3: TOPOLOGICAL_SORT

```
EXECUTE: topological_sort ON dependency_graph

OUTPUT: task_levels[]

FOR each level IN task_levels[]:
  ASSIGN: level_number = {n}
  RECORD: tasks in level can execute in parallel

COMPUTE: total_levels = COUNT(task_levels)

VERIFY: total_levels > 0
```

### 2.4: PRIORITIZE_TASKS

```
LOAD: risk_context.critical_risks

FOR each task IN tasks[]:

  ASSIGN: priority = P3_LOW (default)

  IF task implements critical_risk mitigation:
    priority = P0_CRITICAL

  IF task on critical_path:
    priority = P1_HIGH

  IF task is infrastructure:
    priority = P0_CRITICAL

  STORE: task.priority

COUNT:
  p0_tasks = WHERE priority = P0
  p1_tasks = WHERE priority = P1

VERIFY: p0_tasks > 0
```

### 2.5: SCHEDULE_TASKS

```
APPLY: Critical Path Method

FOR each level IN task_levels[]:

  FOR each task IN level:

    COMPUTE:
      earliest_start = MAX(predecessor.earliest_finish)
      earliest_finish = earliest_start + task.duration

    IF task on critical_path:
      latest_start = earliest_start
      latest_finish = earliest_finish
      slack = 0

    ELSE:
      COMPUTE: slack = latest_start - earliest_start

    STORE: task.earliest_start, task.slack

IDENTIFY: critical_path = tasks WHERE slack = 0

COMPUTE: critical_path_duration = SUM(critical_path.duration)
```

### 2.6: CREATE_SPRINTS

```
DEFINE: sprint_duration = 2 weeks

COMPUTE:
  sprint_capacity = team_size × 10 days × 6 hours × 0.25 story_points/hour
  total_sprints = CEILING(total_story_points / sprint_capacity)

FOR sprint_n FROM 1 TO total_sprints:

  CREATE: sprint_id = Sprint-{n}

  SELECT: tasks WHERE
    dependencies satisfied
    total_sp <= sprint_capacity
    priority highest first

  ASSIGN: tasks to sprint_n

  COMPUTE: sprint_n.total_sp = SUM(selected_tasks.story_points)

  VERIFY: sprint_n.total_sp <= sprint_capacity

  IF exceeded:
    REMOVE: lowest_priority_task
    DEFER: To next sprint

  STORE: sprints[]

VERIFY: ALL tasks assigned to sprint
```

## COUNTER-CHECK

```
CLAIM: "All dependencies preserved in schedule"

ATTEMPT_REFUTATION:
  FOR each dependency IN dependencies[]:
    task_a = source_task
    task_b = target_task

    CHECK: task_a.earliest_finish <= task_b.earliest_start

    IF NOT:
      REFUTATION: SUCCESS
      OUTPUT: "Dependency violated: {task_a} → {task_b}"
      RETURN: To scheduling

  REFUTATION: FAILED
  CONFIRMATION: "All dependencies preserved"
```

## CHECKLIST

```
□ Dependencies mapped (> 0)?
□ No circular dependencies?
□ Topological sort complete?
□ Tasks prioritized (P0 tasks > 0)?
□ Critical path identified?
□ Sprints created (all tasks assigned)?
□ Counter-check executed (dependencies preserved)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## GATE_2

```
EVALUATE:
  dependency_graph_acyclic = TRUE
  critical_path_identified = TRUE
  all_tasks_assigned_to_sprint = TRUE
  dependencies_preserved = TRUE

IF all TRUE:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - sprints = {total_sprints}, critical_path = {duration}"
  PROCEED: To step-03-allocate.md

IF any FALSE:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - failed: [condition]"
  HALT
```

## OUTPUT

```
WRITE: sequencing-plan.yaml

content:
  total_sprints: {count}
  critical_path_duration: {value}
  dependencies: {count}

  sprints:
    FOR each sprint:
      - sprint_id: {id}
        sprint_start: {date}
        sprint_end: {date}
        total_sp: {value}
        tasks: {list of task_ids}
```
