# STEP 3: ALLOCATE

## PRECONDITION

```
GATE_ENTRY: GATE_2 = OPEN

IF GATE_2 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_2 not open"
```

## SEQUENCE

### 3.1: DEFINE_ROLES

```
LOAD: constraint_context.team_size

DEFINE: role_distribution
  tech_lead: 1
  senior_backend: FLOOR(team_size × 0.27)
  mid_backend: FLOOR(team_size × 0.20)
  senior_frontend: 1
  devops: FLOOR(team_size × 0.13)
  security: FLOOR(team_size × 0.13)
  qa: 1
  product_owner: 1

COMPUTE: total_allocated = SUM(role_distribution)

VERIFY: total_allocated = team_size

IF NOT equal:
  ADJUST: mid_backend += (team_size - total_allocated)

STORE: team_structure
```

### 3.2: ASSIGN_TO_WORK_STREAMS

```
LOAD: work_stream_allocation FROM step-01

FOR each work_stream:

  ALLOCATE: people FROM team_structure

  work_stream_teams:
    platform_core:
      - tech_lead: 1
      - senior_backend: 2
      - senior_frontend: 1
      - mid_backend: 1

    process_integration:
      - senior_backend: 2
      - mid_backend: 2

    observability_data:
      - devops: 2
      - mid_backend: 1

    security_compliance:
      - security: 2
      - qa: 1

VERIFY: ALL people allocated
VERIFY: NO person in >1 work_stream
```

### 3.3: ASSIGN_TASKS

```
LOAD: sprints[] FROM step-02

FOR each sprint IN sprints[]:

  FOR each task IN sprint.tasks:

    MATCH: task skill_requirement to person skills

    task_type_assignment:
      IF task.type = SECURITY → security engineer
      IF task.type = INFRASTRUCTURE → devops
      IF task.type = CORE_SERVICE → senior_backend
      IF task.type = FEATURE → mid_backend
      IF task.type = FRONTEND → senior_frontend
      IF task.type = TEST → qa + task_developer

    ASSIGN: person to task

    STORE: task.assigned_to

VERIFY: ALL tasks assigned
```

### 3.4: COMPUTE_WORKLOAD

```
FOR each person IN team_structure:

  FOR each sprint IN sprints[]:

    COMPUTE: person_workload_sprint_n = SUM(
      tasks WHERE assigned_to = person AND sprint = n
    ).story_points

    CONVERT: hours = person_workload_sprint_n × 4

    target_hours = 60 (per 2-week sprint)

    VERIFY: hours BETWEEN 40 AND 70

    IF hours < 40:
      FLAG: underallocated
      ACTION: Pull tasks from backlog

    IF hours > 70:
      FLAG: overallocated
      ACTION: Move tasks to next sprint OR assign to different person

    STORE: person.sprint_workload[]
```

### 3.5: BALANCE_WORKLOAD

```
FOR each person WHERE overallocated:

  IDENTIFY: lowest_priority_tasks

  FOR each task IN lowest_priority_tasks:

    FIND: alternative_person WITH
      same_skills AND
      underallocated

    IF found:
      REASSIGN: task to alternative_person
      RECOMPUTE: workloads

    IF NOT found:
      DEFER: task to next sprint
      RECOMPUTE: workloads

REPEAT: Until NO overallocated people OR max_iterations = 5

IF still overallocated after max_iterations:
  OUTPUT: "Cannot balance workload. Consider: add people OR extend timeline."
  HALT
```

## COUNTER-CHECK

```
CLAIM: "All tasks assigned to qualified people"

ATTEMPT_REFUTATION:
  FOR each task IN tasks[]:
    person = task.assigned_to

    CHECK: person.skills INCLUDES task.required_skill

    IF NOT:
      REFUTATION: SUCCESS
      OUTPUT: "Skill mismatch: {person} lacks {skill} for {task}"
      RETURN: To assignment

  REFUTATION: FAILED
  CONFIRMATION: "All assignments match skills"
```

## CHECKLIST

```
□ Team roles defined (sum = team_size)?
□ Work streams staffed (all allocated)?
□ All tasks assigned to people?
□ Workload computed (all sprints, all people)?
□ Workload balanced (40-70h per person per sprint)?
□ Counter-check executed (skills match)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## GATE_3

```
EVALUATE:
  all_tasks_assigned = TRUE
  workload_balanced = TRUE
  skills_matched = TRUE
  no_overallocation = TRUE

IF all TRUE:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - assignments complete, workload balanced"
  PROCEED: To step-04-integrate-risks.md

IF any FALSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - failed: [condition]"
  HALT
```

## OUTPUT

```
WRITE: resource-allocation.yaml

content:
  team_structure: {roles and counts}
  work_stream_teams: {allocations}

  person_assignments:
    FOR each person:
      - person_id: {id}
        role: {role}
        work_stream: {stream}
        sprint_workloads:
          FOR each sprint:
            - sprint: {n}
              hours: {value}
              tasks: {list}
```
