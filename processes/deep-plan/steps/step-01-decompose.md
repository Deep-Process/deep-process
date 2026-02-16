# STEP 1: DECOMPOSE

## PRECONDITION

```
GATE_ENTRY: GATE_0 = OPEN

IF GATE_0 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_0 not open"
```

## SEQUENCE

### 1.1: IDENTIFY_WORK_STREAMS

```
LOAD: planning-context.yaml → bounded_contexts

COMPUTE: work_streams = CEILING(team_size / 3)

FOR each bounded_context:
  ASSIGN: To work_stream
  ALLOCATE: FLOOR(team_size / work_streams) people

VERIFY:
  work_streams >= 1
  ALL bounded_contexts assigned

STORE: work_stream_allocation
```

### 1.2: DECOMPOSE_TO_EPICS

```
FOR each component IN architecture_context.components:

  CREATE: epic_id = EPIC-{seq}

  DEFINE:
    epic_title: "Build {component_name}"
    epic_scope: {component_description}
    epic_bounded_context: {context_assignment}

  STORE: epics[]

COUNT: total_epics

VERIFY: total_epics >= components × 0.8

IF verification FAILED:
  OUTPUT: "Insufficient epics: {total_epics} for {components} components"
  RETURN: To decomposition
```

### 1.3: DECOMPOSE_TO_STORIES

```
FOR each epic IN epics[]:

  DECOMPOSE: Into user_stories

  RULE: story_duration BETWEEN 0.5 AND 5 days

  FOR each user_story:
    CREATE: story_id = STORY-{epic_id}-{seq}
    DEFINE:
      story_title: "As a {role}, I can {action}"
      story_acceptance: LIST(criteria)
      story_bounded_context: {epic.bounded_context}

    STORE: stories[]

COUNT: total_stories

VERIFY: total_stories >= epics × 3

IF verification FAILED:
  OUTPUT: "Insufficient stories: {total_stories} for {total_epics} epics"
  RETURN: To story decomposition
```

### 1.4: DECOMPOSE_TO_TASKS

```
FOR each story IN stories[]:

  DECOMPOSE: Into tasks

  RULE: task_duration BETWEEN 0.5 AND 2 days

  FOR each task:
    CREATE: task_id = TASK-{story_id}-{seq}
    DEFINE:
      task_title: "[Action verb] {deliverable}"
      task_type: CODE | TEST | DOCS | CONFIG | REVIEW
      task_duration_estimate: {hours}

    STORE: tasks[]

COUNT: total_tasks

VERIFY:
  total_tasks >= stories × 2
  total_tasks BETWEEN 300 AND 800

IF total_tasks < 300:
  OUTPUT: "Too few tasks: {total_tasks}. Decompose further."
  RETURN: To task decomposition

IF total_tasks > 800:
  OUTPUT: "Too many tasks: {total_tasks}. Consider scope reduction."
  HALT
```

### 1.5: ESTIMATE_EFFORT

```
FOR each task IN tasks[]:

  ESTIMATE: story_points USING Fibonacci(1,2,3,5,8)

  RULE:
    IF task_type = CODE → 3-5 SP
    IF task_type = TEST → 2-3 SP
    IF task_type = DOCS → 1-2 SP
    IF task_type = CONFIG → 2-3 SP
    IF task_type = REVIEW → 1 SP

  APPLY: complexity_adjustment
  APPLY: buffer = story_points × 1.2

  STORE: task.story_points

COMPUTE:
  total_story_points = SUM(tasks[].story_points)
  team_capacity = team_size × timeline_months × 4 weeks × 25 SP/person/week
  utilization = total_story_points / team_capacity

VERIFY: utilization BETWEEN 0.15 AND 0.30

IF utilization < 0.15:
  OUTPUT: "Under-scoped: {utilization}. Add tasks or reduce team."
  HALT

IF utilization > 0.30:
  OUTPUT: "Over-scoped: {utilization}. Reduce scope or extend timeline."
  HALT
```

## COUNTER-CHECK

```
CLAIM: "All architecture components mapped to tasks"

ATTEMPT_REFUTATION:
  FOR each component IN architecture_context.components:
    SEARCH: tasks[] WHERE description CONTAINS component_name

    IF NOT found:
      REFUTATION: SUCCESS
      OUTPUT: "Component {component_name} not mapped to tasks"
      RETURN: To decomposition

  REFUTATION: FAILED
  CONFIRMATION: "All components mapped"
```

## CHECKLIST

```
□ Work streams identified (>= 1)?
□ Epics created (>= components × 0.8)?
□ Stories created (>= epics × 3)?
□ Tasks created (300-800 range)?
□ Story points estimated (all tasks)?
□ Utilization verified (15-30%)?
□ Counter-check executed (all components mapped)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## GATE_1

```
EVALUATE:
  total_tasks BETWEEN 300 AND 800
  total_story_points > 0
  utilization BETWEEN 0.15 AND 0.30
  all_components_mapped = TRUE

IF all conditions MET:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - tasks = {total_tasks}, SP = {total_story_points}, utilization = {utilization}"
  PROCEED: To step-02-sequence.md

IF any condition NOT MET:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - condition failed: [which]"
  HALT
```

## OUTPUT

```
WRITE: work-breakdown-structure.yaml

content:
  work_streams: {count}
  epics: {count}
  stories: {count}
  tasks: {count}
  total_story_points: {value}
  utilization: {value}

  tasks_list:
    FOR each task:
      - task_id: {id}
        title: {title}
        story_points: {sp}
        bounded_context: {context}
```
