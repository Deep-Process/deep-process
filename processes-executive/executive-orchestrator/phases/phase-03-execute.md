# PHASE 3: EXECUTION WITH PROGRESS UPDATES

## PRECONDITION
```
GATE_2 = OPEN
execution-plan.yaml EXISTS
backlog.yaml EXISTS
backlog NOT empty
```

## PURPOSE
```
Execute all tasks in backlog.
Report progress in business terms.
Ask critical decisions.
Adapt to user direction changes.
Handle failures recursively.
```

## ENFORCED SEQUENCE
```
WHILE backlog has TODO tasks:
  1. SELECT_NEXT_TASK
  2. DISPLAY_PROGRESS_UPDATE
  3. EXECUTE_TASK
  4. HANDLE_RESULT
  5. SAVE_STATE_SNAPSHOT
  6. CHECK_FOR_USER_INPUT

WHEN backlog complete:
  7. GATE_3
```

---

## MAIN EXECUTION LOOP

```yaml
LOAD: backlog.yaml
LOAD: goal-declaration.yaml

INITIALIZE:
  execution_log = []
  snapshots = []
  decisions_made = []

WHILE TRUE:

  # Check if done
  remaining_tasks = COUNT tasks WHERE state IN [TODO, IN_PROGRESS]

  IF remaining_tasks = 0:
    CHECK for BLOCKED tasks:
      blocked_count = COUNT tasks WHERE state = BLOCKED

      IF blocked_count > 0:
        GOTO: section_handle_blocked_tasks

      ELSE:
        # All tasks done
        BREAK loop
        GOTO: section 7 (GATE_3)

  # Select next task
  next_task = SELECT_NEXT_TASK()

  # Execute task
  EXECUTE: section 1-6 for next_task

  # Check for interrupts
  CHECK_FOR_USER_INPUT()
```

---

## 1. SELECT_NEXT_TASK

```yaml
LOAD: backlog.yaml

FILTER tasks:
  eligible = tasks WHERE:
    - state = TODO
    - ALL dependencies IN [DONE]
    - NOT blocked

PRIORITIZE eligible tasks:
  SORT by:
    1. criticality DESC
    2. on_critical_path DESC
    3. dependencies_count ASC

SELECT: first task from sorted list

IF no eligible tasks AND remaining tasks exist:
  # Deadlock - all remaining tasks blocked
  GOTO: section_handle_deadlock

RETURN: selected_task
```

---

## 2. DISPLAY_PROGRESS_UPDATE

```yaml
INPUT: selected_task, backlog

CALCULATE progress:
  total_tasks = COUNT all tasks
  completed = COUNT tasks WHERE state = DONE
  progress_pct = (completed / total_tasks) * 100

LOAD: goal from goal-declaration.yaml

FORMAT progress update using template:
  progress_update:
    goal_reminder: {goal}
    current_status:
      phase: "3/5 (Execute)"
      completion: "{progress_pct}%"
      status: "on_track"  # or "delayed" or "blocked"

    recent_work:
      completed: [last 3 completed tasks - business level description]

    in_progress:
      task: {selected_task.name}
      purpose: {explain how task serves goal}
      estimated_completion: {selected_task.estimated_effort}

    next_milestone: {identify next significant milestone}

DISPLAY to user:
  "CEL: {goal}

   Progress: {progress_pct}% ({completed}/{total_tasks} tasks)

   Aktualnie: {selected_task.name}
   Dlaczego: {purpose}

   Następny milestone: {next_milestone}"

# Keep it brief - max half page
```

---

## 3. EXECUTE_TASK

```yaml
INPUT: selected_task

UPDATE: selected_task.state = IN_PROGRESS
SAVE: backlog.yaml

LOG: execution_log
  timestamp: {now}
  task_id: {selected_task.id}
  task_name: {selected_task.name}
  action: STARTED

BRANCH by task_type:

  IF selected_task.type = SUBPROCESS_INVOCATION:
    GOTO: section_execute_subprocess

  IF selected_task.type = INTEGRATION:
    GOTO: section_execute_integration

  IF selected_task.type = VALIDATION:
    GOTO: section_execute_validation

  IF selected_task.type = MANUAL:
    GOTO: section_execute_manual

  ELSE:
    ERROR: "Unknown task type: {selected_task.type}"
```

### SECTION_EXECUTE_SUBPROCESS

```yaml
INPUT: selected_task

IDENTIFY: subprocess_name = selected_task.subprocess

LOAD: subprocess manifest
  READ: subprocess-pool/{subprocess_name}/manifest.yaml

PREPARE inputs:
  FOR EACH input IN selected_task.inputs_needed:
    LOCATE input artifact from previous tasks
    VERIFY artifact exists
    LOAD artifact content

  IF any input missing:
    MARK: selected_task.state = BLOCKED
    MARK: blocker = "Missing input: {input_name}"
    GOTO: section 4 (handle_result)

INVOKE subprocess:
  EXECUTE: subprocess-pool/{subprocess_name}/workflow.md
  PROVIDE: inputs
  CAPTURE: outputs
  CAPTURE: subprocess_execution_log (technical details)

  # Subprocess execution is HIDDEN from user
  # User does NOT see technical subprocess output

TRANSLATE subprocess results to business terms:
  LOAD: subprocess outputs
  EXTRACT: key achievements
  EXTRACT: critical decisions made by subprocess
  EXTRACT: artifacts produced

  FORMAT business summary:
    "✓ {subprocess_name} complete.

     Osiągnięcia:
     - {achievement_1 in business terms}
     - {achievement_2 in business terms}

     Wytworzone:
     - {artifact_1 - what it is, why it matters}

     {IF critical decisions made:
       Decyzje techniczne:
       - {decision_1 - business impact}
     }"

DISPLAY business summary to user
LOG technical details to execution_log (hidden)

STORE: subprocess outputs in appropriate locations
UPDATE: selected_task.outputs_produced = [list of artifacts]
UPDATE: selected_task.state = DONE

RETURN: SUCCESS
```

### SECTION_EXECUTE_INTEGRATION

```yaml
INPUT: selected_task

IDENTIFY:
  source_artifact = selected_task.source
  target_format = selected_task.target_format

LOAD: source_artifact

TRANSFORM:
  Apply transformation to match target_format
  VALIDATE: transformed artifact matches target schema

IF transformation succeeds:
  SAVE: transformed artifact
  UPDATE: selected_task.state = DONE
  RETURN: SUCCESS

IF transformation fails:
  LOG: transformation error
  MARK: selected_task.state = BLOCKED
  MARK: blocker = "Transformation failed: {error}"
  RETURN: BLOCKED
```

### SECTION_EXECUTE_VALIDATION

```yaml
INPUT: selected_task

IDENTIFY: artifact_to_validate = selected_task.target_artifact

LOAD: artifact
LOAD: goal from goal-declaration.yaml

VALIDATE against goal:
  CHECK: Does artifact serve goal?
  CHECK: Does artifact meet constraints?
  CHECK: Is artifact complete?

CALCULATE: alignment_score (0-1)

IF alignment_score >= 0.8:
  UPDATE: selected_task.state = DONE
  UPDATE: selected_task.validation_result = PASS
  RETURN: SUCCESS

IF alignment_score < 0.8:
  UPDATE: selected_task.state = DONE  # Task executed
  UPDATE: selected_task.validation_result = FAIL
  UPDATE: selected_task.alignment_score = {score}

  # Validation failed - will handle in Phase 4
  RETURN: VALIDATION_FAILED
```

### SECTION_EXECUTE_MANUAL

```yaml
INPUT: selected_task

DISPLAY to user:
  "Zadanie manualne:

   {selected_task.name}

   Opis: {selected_task.description}

   Kiedy wykonasz to zadanie, potwierdź."

WAIT: user confirmation

UPDATE: selected_task.state = DONE
RETURN: SUCCESS
```

---

## 4. HANDLE_RESULT

```yaml
INPUT:
  - selected_task
  - execution_result from section 3

BRANCH by result:

  IF result = SUCCESS:
    UPDATE: selected_task.state = DONE
    LOG: "Task {selected_task.id} completed successfully"

  IF result = BLOCKED:
    UPDATE: selected_task.state = BLOCKED
    LOG: "Task {selected_task.id} blocked: {selected_task.blocker}"
    ESCALATE: section_handle_blocker(selected_task)

  IF result = VALIDATION_FAILED:
    UPDATE: selected_task.validation_failed = true
    LOG: "Task {selected_task.id} validation failed (score: {score})"
    # Will address in Phase 4

  IF result = SUBPROCESS_FAILED:
    LOG: "Subprocess {subprocess_name} failed: {error}"

    ANALYZE failure:
      IF failure_type = RECOVERABLE:
        # Add fix task to backlog
        CREATE fix_task:
          task_name: "Fix {subprocess_name} failure"
          task_type: FIX
          parent_task: {selected_task.id}
          issue: {error}
          state: TODO
          priority: HIGH

        INSERT fix_task to backlog BEFORE selected_task

        UPDATE: selected_task.state = TODO  # Will retry after fix
        LOG: "Added fix task, will retry"

      IF failure_type = CRITICAL:
        MARK: selected_task.state = BLOCKED
        ESCALATE to user:
          "Critical failure in {selected_task.name}.
           Error: {error}

           Opcje:
           A) Debug manually
           B) Skip this task
           C) Cancel project"

        WAIT: user decision

SAVE: backlog.yaml
```

---

## 5. SAVE_STATE_SNAPSHOT

```yaml
AFTER each task execution:

CREATE snapshot:
  snapshot_id: {generate_uuid}
  timestamp: {now}

  current_phase: phase_3_execute
  goal: {goal}
  completion_percentage: {calculate from backlog}

  backlog_state: {current backlog}
  execution_log: {log since last snapshot}

  last_completed_task:
    id: {selected_task.id}
    name: {selected_task.name}
    result: {SUCCESS | BLOCKED | FAILED}

  next_action: {describe next task to execute}

SAVE: processes-executive/state/snapshots/snapshot-{timestamp}.yaml

UPDATE: processes-executive/state/current-session.yaml with latest snapshot
```

---

## 6. CHECK_FOR_USER_INPUT

```yaml
CHECK for user interrupts:

  IF user says "STOP" OR "PAUSE":
    SAVE: immediate state snapshot
    DISPLAY: "Stan zapisany. Możesz kontynuować później."
    HALT execution
    EXIT phase

  IF user says "change direction" OR "teraz chcę coś innego":
    GOTO: section_handle_direction_change

  IF critical decision needed:
    CHECK: decision-points.yaml for pending decisions
    FOR EACH decision WHERE timing = NOW:
      GOTO: section_handle_critical_decision(decision)

  # No interrupt - continue execution
  RETURN to main loop
```

---

## SECTION_HANDLE_DIRECTION_CHANGE

```yaml
TRIGGER: User changes direction mid-execution

SAVE: current state snapshot

DISPLAY:
  "Rozumiem - zmiana kierunku.

   Obecny cel: {current_goal}

   Opisz nowy cel:"

WAIT: user input

EXTRACT: new_goal from user input

ANALYZE impact:
  COMPARE: new_goal vs current_goal

  IDENTIFY:
    - Tasks that can be reused
    - Tasks that must be discarded
    - New tasks needed

  ESTIMATE: effort delta

DISPLAY impact analysis:
  "Zmiana z: {current_goal}
   Na: {new_goal}

   Wpływ:
   - Reusable: {reusable_tasks_count} tasks ({reusable_effort})
   - Discard: {discard_tasks_count} tasks ({discarded_effort})
   - New: {new_tasks_count} tasks ({new_effort})

   Kontynuować ze zmianą?"

WAIT: user confirmation

IF confirmed:
  UPDATE: goal-declaration.yaml with new_goal
  UPDATE: backlog:
    MARK discarded tasks as CANCELLED
    ADD new tasks

  RECALCULATE: progress percentage

  DISPLAY:
    "✓ Cel zaktualizowany: {new_goal}
     ✓ Backlog przebudowany
     ✓ Kontynuuję z nowym kierunkiem..."

  RETURN to main loop

ELSE:
  DISPLAY: "Zachowuję poprzedni cel. Kontynuuję."
  RETURN to main loop
```

---

## SECTION_HANDLE_CRITICAL_DECISION

```yaml
INPUT: decision (from decision-points.yaml)

FORMAT decision prompt using template:
  decision_prompt:
    context:
      current_phase: "Execution"
      goal_reminder: {goal}
      why_decision_needed: {decision.rationale}

    decision:
      question: {decision.question}
      criticality: {decision.criticality}

      options: {decision.options}  # Each with pros/cons/impact

    recommendation: {decision.recommendation if exists}

    impact_on_goal: {how each option affects goal}

DISPLAY to user (formatted)

WAIT: user decision

RECORD decision:
  decision_id: {decision.id}
  user_choice: {selected_option}
  timestamp: {now}
  rationale: {user_rationale if provided}

SAVE to: decisions_made[]

APPLY decision to plan:
  UPDATE relevant tasks based on decision
  UPDATE backlog if needed

RETURN to main loop
```

---

## SECTION_HANDLE_BLOCKED_TASKS

```yaml
TRIGGER: Backlog complete but some tasks still BLOCKED

LOAD: blocked_tasks = tasks WHERE state = BLOCKED

FOR EACH blocked_task:

  DISPLAY blocker to user:
    "Zadanie blocked: {blocked_task.name}

     Blocker: {blocked_task.blocker}

     Wpływ na cel: {analyze impact}

     Opcje:
     A) Fix blocker (provide solution)
     B) Skip task (accept incomplete result)
     C) Cancel project"

  WAIT: user decision

  IF user chooses A (fix):
    ASK: "Jak naprawić blocker?"
    WAIT: user solution

    APPLY solution:
      CREATE fix_task based on user input
      ADD to backlog
      EXECUTE fix_task
      RETRY blocked_task

  IF user chooses B (skip):
    UPDATE: blocked_task.state = SKIPPED
    LOG: "Task skipped by user decision"
    NOTE: "Incomplete - {blocked_task.name} skipped"

  IF user chooses C (cancel):
    HALT execution
    GOTO: early termination

RETURN to main loop OR (if all resolved) GOTO section 7
```

---

## SECTION_HANDLE_DEADLOCK

```yaml
TRIGGER: No eligible tasks but remaining tasks exist
         (circular dependency or all tasks blocked)

ANALYZE deadlock:
  IDENTIFY:
    - Circular dependencies
    - Commonly blocked tasks
    - Root blocker

DISPLAY to user:
  "Deadlock detected.

   Remaining tasks: {count}
   All blocked by: {root_blocker OR 'circular dependency'}

   Potrzebuję Twojej pomocy do resolution."

PRESENT options based on deadlock type:
  IF circular dependency:
    "Options:
     A) Break dependency (specify which)
     B) Merge conflicting tasks
     C) Cancel project"

  IF common blocker:
    "All tasks blocked by: {blocker}
     How to resolve: {blocker}?"

WAIT: user decision

APPLY user solution

RETURN to main loop
```

---

## 7. GATE_3

```yaml
EVALUATE gate condition:

  CHECK 1: ALL tasks IN [DONE, SKIPPED] (no TODO or IN_PROGRESS)
  CHECK 2: IF any BLOCKED tasks: blockers_resolved = true
  CHECK 3: execution_log NOT empty

IF ALL checks pass:
  GATE_3 = OPEN

  CALCULATE final stats:
    total_tasks = COUNT all tasks
    completed = COUNT WHERE state = DONE
    skipped = COUNT WHERE state = SKIPPED
    completion_rate = (completed / total_tasks) * 100

  DISPLAY to user:
    "✓ Execution complete!

     Wykonane: {completed}/{total_tasks} tasks ({completion_rate}%)
     {IF skipped > 0: Pominięte: {skipped} tasks}

     Przechodzę do validation..."

  SAVE state snapshot:
    current_phase: phase_4_validate
    goal: {goal}
    completion: 80%
    execution_complete: true

  NEXT: phase-04-validate.md

ELSE:
  GATE_3 = CLOSED

  IDENTIFY failed check

  IF check 1 failed:
    remaining = COUNT WHERE state IN [TODO, IN_PROGRESS]
    ERROR: "{remaining} tasks not complete"
    RETURN to main loop

  IF check 2 failed:
    blocked_unresolved = COUNT WHERE state=BLOCKED AND blocker not resolved
    ERROR: "{blocked_unresolved} blockers unresolved"
    GOTO: section_handle_blocked_tasks

HALT until gate opens
```

---

## VIOLATION RECOVERY

```yaml
IF agent shows technical subprocess details to user:
  HALT
  OUTPUT: "VIOLATION: Technical details should be hidden from user"
  SUPPRESS technical output
  SHOW only business summary

IF agent proceeds without goal reminder:
  HALT
  OUTPUT: "VIOLATION: Must display goal reminder in progress updates"
  RETURN to section 2

IF agent skips state snapshot:
  HALT
  OUTPUT: "VIOLATION: Must save state after each task"
  RETURN to section 5
```

---

# END phase-03-execute.md
