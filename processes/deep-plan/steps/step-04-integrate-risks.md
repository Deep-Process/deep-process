# STEP 4: INTEGRATE_RISKS

## PRECONDITION

```
GATE_ENTRY: GATE_3 = OPEN

IF GATE_3 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_3 not open"
```

## SEQUENCE

### 4.1: LOAD_RISK_MITIGATIONS

```
LOAD: risk_context.critical_risks

FOR each critical_risk:

  EXTRACT:
    risk_id: {id}
    mitigation_cost: {value}
    mitigation_deadline: {date}
    mitigation_description: {text}

  STORE: risk_mitigations[]

COUNT: total_mitigations = COUNT(risk_mitigations)

VERIFY: total_mitigations > 0
```

### 4.2: CREATE_MITIGATION_TASKS

```
FOR each mitigation IN risk_mitigations[]:

  DECOMPOSE: mitigation_description INTO tasks

  FOR each mitigation_task:

    CREATE: task_id = TASK-{risk_id}-{seq}

    DEFINE:
      task_title: "Mitigate {risk_id}: {action}"
      task_type: RISK_MITIGATION
      task_priority: P0_CRITICAL
      task_deadline: mitigation.mitigation_deadline
      task_story_points: ESTIMATE from mitigation_cost

    STORE: mitigation_tasks[]

VERIFY: ALL critical_risks have mitigation_tasks
```

### 4.3: SCHEDULE_BY_DEADLINE

```
FOR each mitigation_task IN mitigation_tasks[]:

  deadline = task.task_deadline

  FIND: sprint WHERE sprint.end_date <= deadline

  IF found:
    INSERT: task into sprint.tasks (highest priority)
    RECOMPUTE: sprint.total_sp

    IF sprint.total_sp > sprint_capacity:
      DESCOPE: lowest_priority non-mitigation task
      DEFER: To next sprint

  IF NOT found:
    OUTPUT: "Cannot schedule {task_id} by deadline {deadline}"
    HALT

VERIFY: ALL mitigation_tasks scheduled by deadline
```

### 4.4: CREATE_CHECKPOINTS

```
DEFINE: checkpoint_frequency = 2 weeks (sprint boundary)

FOR each sprint IN sprints[]:

  CREATE: checkpoint_id = CHK-{sprint.id}

  DEFINE:
    checkpoint_date: sprint.end_date
    checkpoint_validations:
      - technical: "Code works, tests pass"
      - security: "Mitigations effective, pen test results"
      - quality: "Quality attributes met, performance OK"
      - business: "On budget, on schedule, scope aligned"

  STORE: checkpoints[]

VERIFY: checkpoints[] = sprints[] (1:1 mapping)
```

### 4.5: ADD_CONTINGENCY

```
COMPUTE: total_duration_sprints = COUNT(sprints)

COMPUTE: buffer_sprints = CEILING(total_duration_sprints × 0.15)

FOR buffer_sprint_n FROM 1 TO buffer_sprints:

  CREATE: sprint_id = Sprint-{total + n}

  ALLOCATE: sprint_capacity (empty, for contingency)

  STORE: sprints[]

UPDATE: total_sprints += buffer_sprints

VERIFY: buffer_sprints >= 2
```

## COUNTER-CHECK

```
CLAIM: "All critical risks scheduled for mitigation by deadline"

ATTEMPT_REFUTATION:
  FOR each critical_risk IN risk_context.critical_risks:

    SEARCH: mitigation_tasks WHERE risk_id = critical_risk.id

    IF NOT found:
      REFUTATION: SUCCESS
      OUTPUT: "No mitigation tasks for {risk_id}"
      RETURN: To task creation

    FOR each mitigation_task:
      CHECK: task.scheduled_sprint.end_date <= risk.deadline

      IF NOT:
        REFUTATION: SUCCESS
        OUTPUT: "Mitigation {task_id} scheduled after deadline"
        RETURN: To scheduling

  REFUTATION: FAILED
  CONFIRMATION: "All mitigations scheduled by deadline"
```

## CHECKLIST

```
□ Risk mitigations loaded (> 0)?
□ Mitigation tasks created (all risks covered)?
□ Tasks scheduled by deadline (all)?
□ Checkpoints created (1 per sprint)?
□ Contingency buffer added (>= 15%)?
□ Counter-check executed (deadlines met)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## GATE_4

```
EVALUATE:
  all_mitigations_scheduled = TRUE
  all_deadlines_met = TRUE
  checkpoints_created = TRUE
  contingency_added = TRUE

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - risks integrated, checkpoints defined, buffer added"
  PROCEED: To step-05-validate.md

IF any FALSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - failed: [condition]"
  HALT
```

## OUTPUT

```
WRITE: risk-schedule.yaml

content:
  risk_mitigations:
    FOR each mitigation_task:
      - risk_id: {id}
        task_id: {id}
        deadline: {date}
        scheduled_sprint: {sprint_id}
        on_time: {boolean}

  checkpoints:
    FOR each checkpoint:
      - checkpoint_id: {id}
        date: {date}
        validations: {list}

  contingency:
    buffer_sprints: {count}
    total_sprints: {count}
```
