# PHASE 2: TECHNICAL PLANNING

## PRECONDITION
```
GATE_1 = OPEN
goal-declaration.yaml EXISTS
constraints.yaml EXISTS
```

## PURPOSE
```
Create technical execution plan.
Generate backlog.
Identify subprocesses needed.
Detect critical decisions.

IMPORTANT: This phase is HIDDEN from user.
User sees: "Planowanie..." (brief message)
User does NOT see: technical details
```

## ENFORCED SEQUENCE
```
1. LOAD_GOAL_AND_CONSTRAINTS
2. DECOMPOSE_INTO_PHASES
3. IDENTIFY_SUBPROCESSES
4. BUILD_BACKLOG
5. ESTIMATE_EFFORT
6. DETECT_CRITICAL_DECISIONS
7. SAVE_PLAN
8. GATE_2
```

---

## 1. LOAD_GOAL_AND_CONSTRAINTS

```yaml
LOAD: processes-executive/state/goal-declaration.yaml
LOAD: processes-executive/state/constraints.yaml

EXTRACT:
  goal: {goal_statement}
  budget_constraint: {budget}
  timeline_constraint: {timeline}
  compliance_constraint: {compliance}
  tech_preferences: {technology}

VERIFY:
  goal NOT null
  goal NOT empty

IF verification fails:
  HALT: "GATE_1 passed but artifacts invalid"
  RETURN to: phase-01-intake.md
```

---

## 2. DECOMPOSE_INTO_PHASES

```yaml
ANALYZE goal: {goal_statement}

CLASSIFY project type:
  IF goal contains ["program", "software", "system", "app", "web", "mobile"]:
    project_type = SOFTWARE_DEVELOPMENT

  IF goal contains ["analiza", "research", "study"]:
    project_type = ANALYSIS

  IF goal contains ["migrate", "refactor"]:
    project_type = MIGRATION

  ELSE:
    project_type = CUSTOM

FOR project_type = SOFTWARE_DEVELOPMENT:

  STANDARD phases:
    1. Requirements gathering
    2. Architecture design
    3. Implementation
    4. Testing
    5. Deployment

  MAP to subprocesses:
    phase_1_requirements → deep-requirements
    phase_2_architecture → deep-architect
    phase_3_implementation → deep-implement
    phase_4_testing → deep-test
    phase_5_deployment → deep-deploy

  CHECK constraints for modifications:
    IF compliance_constraint = GDPR:
      INSERT: deep-compliance AFTER architecture
      UPDATE phases count

    IF budget_constraint = "minimal":
      REMOVE: deep-deploy (manual deployment)
      NOTE: "Deployment manual due to budget"

STORE: phases_plan[]
```

---

## 3. IDENTIFY_SUBPROCESSES

```yaml
INPUT: phases_plan[]

FOR EACH phase IN phases_plan:

  MAP phase to subprocess:
    phase.name → subprocess_name

  VERIFY subprocess exists:
    CHECK: processes-executive/subprocess-pool/{subprocess_name}/ EXISTS

    IF NOT exists:
      OPTION 1: Use subprocess from processes/
      OPTION 2: Create placeholder
      OPTION 3: Mark as MANUAL

  LOAD subprocess manifest:
    READ: subprocess-pool/{subprocess_name}/manifest.yaml

  EXTRACT:
    - inputs_required
    - outputs_produced
    - estimated_duration
    - complexity

  STORE in phases_plan[phase]:
    subprocess: {subprocess_name}
    inputs: {inputs_required}
    outputs: {outputs_produced}
    duration_estimate: {estimated_duration}

BUILD dependency graph:
  FOR EACH phase:
    phase.dependencies = [phases whose outputs are this phase's inputs]

DETECT cycles:
  RUN: topological sort on dependency graph
  IF cycle detected:
    HALT: "Circular dependency in plan"
    LOG: cycle details
    ESCALATE to user

STORE: subprocess_mapping{}
STORE: dependency_graph
```

---

## 4. BUILD_BACKLOG

```yaml
INPUT:
  - phases_plan[]
  - subprocess_mapping{}
  - dependency_graph

INITIALIZE: backlog = []

FOR EACH phase IN phases_plan (in dependency order):

  CREATE task:
    task_id: {generate_task_id}
    task_name: "Execute {phase.name}"
    task_type: SUBPROCESS_INVOCATION
    subprocess: {phase.subprocess}

    inputs_needed: {phase.inputs}
    outputs_produced: {phase.outputs}

    dependencies: {phase.dependencies}
    state: TODO

    estimated_effort: {phase.duration_estimate}

    metadata:
      phase_id: {phase.id}
      criticality: {CRITICAL if no alternatives, HIGH otherwise}

  ADD task to backlog

ADD integration tasks:
  FOR EACH adjacent phase pair (A, B):
    IF A.outputs NOT perfectly match B.inputs:
      CREATE integration_task:
        task_name: "Integrate {A} → {B}"
        task_type: INTEGRATION
        action: "Transform {A.outputs} to match {B.inputs}"
        dependencies: [A.task_id]
        state: TODO

      INSERT integration_task between A and B in backlog

ADD validation tasks:
  FOR EACH phase:
    CREATE validation_task:
      task_name: "Validate {phase.name} output"
      task_type: VALIDATION
      action: "Check {phase.outputs} against goal"
      dependencies: [phase.task_id]
      state: TODO

    INSERT after phase.task in backlog

STORE: backlog[]
```

---

## 5. ESTIMATE_EFFORT

```yaml
INPUT: backlog[]

FOR EACH task IN backlog:

  IF task.type = SUBPROCESS_INVOCATION:
    base_estimate = task.subprocess.duration_estimate

    ADJUST for complexity:
      IF goal complexity HIGH:
        adjusted = base_estimate * 1.5
      IF goal complexity LOW:
        adjusted = base_estimate * 0.8

    ADJUST for constraints:
      IF timeline_constraint TIGHT:
        NOTE: "Timeline tight - may need parallel execution"
      IF budget_constraint LOW:
        NOTE: "Budget constraint - avoid expensive subprocesses"

    task.estimated_effort = adjusted

  IF task.type = INTEGRATION:
    task.estimated_effort = 15 minutes

  IF task.type = VALIDATION:
    task.estimated_effort = 10 minutes

CALCULATE total_estimated_effort:
  SUM all task.estimated_effort

CALCULATE critical_path:
  FIND longest dependency chain in backlog
  critical_path_duration = SUM of tasks on critical path

STORE in execution-plan:
  total_effort: {total_estimated_effort}
  critical_path: {critical_path_duration}
  estimated_completion: {calculate from timeline_constraint}
```

---

## 6. DETECT_CRITICAL_DECISIONS

```yaml
INPUT: backlog[], constraints

SCAN for decision points:

  DECISION_POINT 1: Technology choices
    IF tech_preferences = "wybór techniczny":
      FOR EACH phase requiring technology choice:
        CREATE decision_point:
          id: DECISION_{phase_id}_TECH
          phase: {phase.name}
          question: "Wybór technologii dla {phase.name}"
          timing: BEFORE_{phase_id}
          criticality: MEDIUM
          options: [inferred from phase requirements]

  DECISION_POINT 2: Architecture patterns
    IF architecture phase exists:
      CREATE decision_point:
        id: DECISION_ARCHITECTURE_PATTERN
        phase: architecture
        question: "Wzorzec architektury"
        timing: DURING_ARCHITECTURE
        criticality: HIGH
        options: [monolith, microservices, serverless, etc.]

  DECISION_POINT 3: Deployment strategy
    IF deployment phase exists:
      CREATE decision_point:
        id: DECISION_DEPLOYMENT
        phase: deployment
        question: "Strategia deployment"
        timing: BEFORE_DEPLOYMENT
        criticality: MEDIUM
        options: [manual, CI/CD, containers, etc.]

  DECISION_POINT 4: Scope adjustments
    IF total_effort > timeline_constraint:
      CREATE decision_point:
        id: DECISION_SCOPE
        phase: planning
        question: "Timeline tight - reduce scope OR extend timeline?"
        timing: NOW
        criticality: CRITICAL
        options: [reduce_scope, extend_timeline, increase_resources]

PRIORITIZE decision_points by criticality

STORE: decision-points.yaml
```

---

## 7. SAVE_PLAN

```yaml
CREATE: execution-plan.yaml
CONTENT:
  plan_id: {generate_uuid}
  created_at: {timestamp}
  goal: {goal_statement}

  phases: {phases_plan[]}

  total_phases: {count}
  estimated_duration: {total_estimated_effort}
  critical_path: {critical_path_duration}

  subprocesses_needed:
    {list of subprocess names}

  dependency_graph: {dependency_graph}

SAVE to: processes-executive/state/execution-plan.yaml

CREATE: backlog.yaml
CONTENT:
  backlog_id: {generate_uuid}
  created_at: {timestamp}

  tasks: {backlog[]}

  statistics:
    total_tasks: {count}
    todo_count: {count TODO}
    estimated_total: {sum of estimates}

  critical_path: {task IDs on critical path}

SAVE to: processes-executive/state/backlog.yaml

CREATE: decision-points.yaml
CONTENT:
  decision_points: {decision_points[]}

  critical_count: {count where criticality=CRITICAL}
  high_count: {count where criticality=HIGH}

SAVE to: processes-executive/state/decision-points.yaml

DISPLAY to user (brief):
  "✓ Plan techniczny gotowy.

   Fazy: {total_phases}
   Zadania: {total_tasks}
   Szacowany czas: {estimated_duration}

   Rozpoczynam wykonanie..."
```

---

## 8. GATE_2

```yaml
EVALUATE gate condition:

  CHECK 1: execution-plan.yaml EXISTS
  CHECK 2: backlog.yaml EXISTS
  CHECK 3: backlog NOT empty (at least 1 task)
  CHECK 4: dependency_graph has NO cycles

IF ALL checks pass:
  GATE_2 = OPEN

  SAVE state snapshot:
    current_phase: phase_3_execute
    goal: {goal}
    completion: 30%
    backlog_size: {total_tasks}

  NEXT: phase-03-execute.md

ELSE:
  GATE_2 = CLOSED

  IDENTIFY failed check

  IF check 1 OR check 2 failed:
    ERROR: "Plan artifacts not created"
    RETURN to: section 7

  IF check 3 failed:
    ERROR: "Empty backlog - cannot execute nothing"
    RETURN to: section 4

  IF check 4 failed:
    ERROR: "Circular dependencies in plan"
    LOG: cycle details
    ESCALATE to user: "Detected circular dependency. Manual intervention needed."

HALT until gate opens OR user resolves
```

---

## VIOLATION RECOVERY

```yaml
IF agent shows technical details to user:
  HALT
  OUTPUT: "VIOLATION: Phase 2 is HIDDEN - user should not see technical planning"
  SUPPRESS output to user

IF agent proceeds to execution without backlog:
  HALT
  OUTPUT: "VIOLATION: Cannot execute without backlog"
  RETURN to: section 4

IF agent creates plan without analyzing goal:
  HALT
  OUTPUT: "VIOLATION: Must analyze goal before planning"
  RETURN to: section 2
```

---

## SCOPE_REDUCTION PROTOCOL

```yaml
IF timeline extremely tight AND backlog too large:

  CALCULATE: tasks_can_fit = timeline / avg_task_duration

  IF total_tasks > tasks_can_fit:

    DECLARE_SCOPE_REDUCTION:
      phase: phase_2_plan
      condition: "Cannot fit all tasks in timeline"
      reduction: "Remove {total_tasks - tasks_can_fit} optional tasks"
      impact: "Reduced scope - some features dropped"
      user_approval: REQUIRED

    IDENTIFY optional tasks:
      FOR EACH task WHERE criticality != CRITICAL:
        MARK as candidate for removal

    PRESENT to user (INTERRUPT planning):
      "Timeline tight ({timeline_constraint}).
       Plan ma {total_tasks} zadań, zmieści się {tasks_can_fit}.

       Opcje:
       A) Reduce scope (drop {count} optional features)
       B) Extend timeline
       C) Increase resources (parallel execution)

       Którą wybrać?"

    WAIT user decision

    APPLY decision:
      IF A: REMOVE optional tasks from backlog
      IF B: UPDATE timeline_constraint
      IF C: MARK tasks for parallel execution

    SAVE scope reduction
    CONTINUE
```

---

# END phase-02-plan.md
