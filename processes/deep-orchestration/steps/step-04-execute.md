# STEP 4: EXECUTE

## ENFORCED SEQUENCE

```
1. LOAD_EXECUTION_PLAN
2. EXECUTE_METHOD_350
3. INITIALIZE_WORKFLOW
4. EXECUTE_TASKS
5. HANDLE_FAILURES
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_4
```

## 1. LOAD_EXECUTION_PLAN

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: execution plan from step-03
LOAD: execution timeline from step-03
LOAD: resource allocations from step-02
STORE: execution_context
VERIFY: execution_plan_valid = TRUE
```

## 2. EXECUTE_METHOD_350

```
IF Method 350 (Workflow State Manager) available:
  EXECUTE: method_350.initialize()

  CREATE: State tracking system
  ENABLE: State persistence
  CONFIGURE: State checkpointing

  OUTPUT:
```yaml
workflow_state_management:
  method: "Method 350 - Workflow State Manager"
  state_tracking: ENABLED
  checkpoint_frequency: "[interval]"
  recovery_enabled: TRUE
```

ELSE:
  EXECUTE: manual state management (section 3)
```

## 3. INITIALIZE_WORKFLOW

```
CREATE workflow execution context:
```yaml
workflow_execution:
  workflow_id: WF-001
  execution_id: EXEC-[timestamp]
  start_time: "[timestamp]"
  status: INITIALIZING
  total_tasks: N
  completed_tasks: 0
  failed_tasks: 0
  running_tasks: 0
```

INITIALIZE state tracking:
  FOR each task:
    CREATE: Task state
```yaml
task_state:
  task_id: TSK-001
  execution_id: EXEC-[timestamp]
  status: PENDING
  dependencies_satisfied: NO
  resources_allocated: NO
  start_time: null
  end_time: null
  duration: null
  retry_count: 0
  last_error: null
```

PREPARE execution environment:
  ALLOCATE: Resources per execution plan
  INITIALIZE: Data storage locations
  CONFIGURE: Logging and monitoring
  ESTABLISH: Communication channels between tasks
  CREATE: Synchronization primitives (locks, barriers, semaphores)

VALIDATE prerequisites:
  VERIFY: All workflow inputs available
  VERIFY: All required resources accessible
  VERIFY: All external dependencies reachable
  IF prerequisites_not_met:
    HALT: With error details
  IF prerequisites_met:
    UPDATE: workflow_status = READY

CREATE execution checkpoint:
  SAVE: Workflow state to persistent storage
  RECORD: Checkpoint ID and timestamp
```

## 4. EXECUTE_TASKS

```
UPDATE: workflow_status = RUNNING

FOR each execution level in sequence:
  FOR each parallel group in level:

    SYNCHRONIZATION barrier:
      WAIT: Previous level completion
      VERIFY: All tasks in previous level completed or failed
      IF critical_task_failed:
        EXECUTE: Failure handling (section 5)
      IF all_completed:
        PROCEED: To next level

    FOR each task in parallel_group:
      LAUNCH: Task execution (in parallel)

      TASK EXECUTION:
        UPDATE: task_state.status = STARTING
        CHECKPOINT: Task state

        CHECK: Dependencies satisfied
          FOR each dependency:
            VERIFY: Prerequisite task completed successfully
            VERIFY: Required data available
          IF dependencies_not_satisfied:
            UPDATE: task_state.status = WAITING
            WAIT: Until dependencies satisfied
          IF dependencies_satisfied:
            UPDATE: task_state.dependencies_satisfied = YES

        ACQUIRE: Resources
          FOR each required_resource:
            REQUEST: Resource allocation
            WAIT: Until resource available
          IF resources_acquired:
            UPDATE: task_state.resources_allocated = YES
          IF acquisition_failed:
            UPDATE: task_state.status = FAILED
            RECORD: task_state.last_error = "Resource acquisition failed"
            GOTO: Failure handling

        EXECUTE: Task logic
          UPDATE: task_state.status = RUNNING
          UPDATE: task_state.start_time = [timestamp]
          CHECKPOINT: Task state

          RUN: Task implementation
          CAPTURE: Task output
          CAPTURE: Task errors
          MONITOR: Task progress

        HANDLE: Task completion
          IF task_succeeded:
            UPDATE: task_state.status = COMPLETED
            UPDATE: task_state.end_time = [timestamp]
            COMPUTE: task_state.duration = end_time - start_time
            STORE: Task outputs
            RELEASE: Allocated resources
            CHECKPOINT: Task state
            INCREMENT: completed_tasks

          IF task_failed:
            UPDATE: task_state.status = FAILED
            UPDATE: task_state.end_time = [timestamp]
            RECORD: task_state.last_error = "[error details]"
            RELEASE: Allocated resources
            INCREMENT: failed_tasks
            EXECUTE: Retry logic

        RETRY logic:
          IF task_failed AND retry_count < max_attempts:
            INCREMENT: task_state.retry_count
            WAIT: retry_delay
            APPLY: Backoff strategy
            RESET: task_state.status = PENDING
            GOTO: CHECK dependencies
          IF task_failed AND retry_count >= max_attempts:
            EXECUTE: Failure handling (section 5)

    WAIT: All tasks in parallel_group to complete or fail

  CHECKPOINT: Level completion
  RECORD: Level end time and status

UPDATE: workflow_status = FINISHING
```

## 5. HANDLE_FAILURES

```
FOR each failed task:
  CLASSIFY: Failure type
    TRANSIENT: Temporary issue, retry likely to succeed
    PERMANENT: Fundamental issue, retry unlikely to succeed
    RESOURCE: Resource exhaustion or unavailability
    DEPENDENCY: Failed because dependency failed
    TIMEOUT: Task exceeded time limit
    ERROR: Task threw exception or error

  APPLY: Failure handling policy from execution plan
    IF on_failure = RETRY:
      ALREADY HANDLED in retry logic

    IF on_failure = SKIP:
      MARK: task_state.status = SKIPPED
      PROPAGATE: Outputs as empty/null
      CONTINUE: Workflow execution

    IF on_failure = ABORT_WORKFLOW:
      UPDATE: workflow_status = ABORTING
      CANCEL: All running and pending tasks
      ROLLBACK: Workflow state if configured
      UPDATE: workflow_status = ABORTED
      HALT: Workflow execution

    IF on_failure = CONTINUE:
      MARK: task_state.status = FAILED_CONTINUE
      PROPAGATE: Failure status to dependent tasks
      CONTINUE: Workflow execution with degraded state

    IF on_failure = FALLBACK AND fallback_task defined:
      EXECUTE: Fallback task instead
      IF fallback_succeeds:
        MARK: Original task as FAILED_FALLBACK_SUCCEEDED
        USE: Fallback outputs
        CONTINUE: Workflow
      IF fallback_fails:
        APPLY: Original failure policy

  RECORD failure event:
```yaml
failure_event:
  event_id: EVT-FAIL-001
  task_id: TSK-001
  execution_id: EXEC-[timestamp]
  failure_time: "[timestamp]"
  failure_type: TRANSIENT | PERMANENT | RESOURCE | DEPENDENCY | TIMEOUT | ERROR
  error_message: "[message]"
  stack_trace: "[trace]"
  retry_count: N
  handling_action: RETRY | SKIP | ABORT | CONTINUE | FALLBACK
  impact: "[description of impact on workflow]"
```

  NOTIFY: Stakeholders if critical failure
  UPDATE: Monitoring dashboards
  CHECKPOINT: Failure state
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify execution correctness during runtime
EXECUTE:
  1. STATE CONSISTENCY CHECK:
     VERIFY: Workflow state is consistent
     FOR each task:
       CHECK: task_state matches actual execution status
       IF inconsistency:
         LOG: State inconsistency
         CORRECT: State from actual status
       IF consistent:
         CONFIRM: State accurate

  2. RESOURCE LEAK CHECK:
     FOR each allocated resource:
       VERIFY: Resource properly released after task completion
       IF resource_leaked:
         FORCE: Resource release
         LOG: Resource leak
       IF properly_released:
         CONFIRM: No leak

  3. DEADLOCK DETECTION:
     ANALYZE: Task dependency state
     DETECT: Circular waits
     IF deadlock_detected:
       BREAK: Deadlock by failing one task
       LOG: Deadlock event
       RECOVER: Workflow
     IF no_deadlock:
       CONFIRM: No circular waits

  4. PROGRESS VERIFICATION:
     CHECK: Workflow making progress
     IF tasks_stuck:
       IDENTIFY: Stuck tasks
       DIAGNOSE: Why stuck
       UNSTICK: By timeout or manual intervention
     IF progressing:
       CONFIRM: Execution advancing

  5. DATA INTEGRITY CHECK:
     FOR each data handoff:
       VERIFY: Data properly transferred
       VERIFY: Data not corrupted
       IF integrity_issue:
         RETRY: Data transfer
         LOG: Integrity issue
       IF intact:
         CONFIRM: Data integrity maintained

  6. TIMING VERIFICATION:
     COMPARE: Actual execution time vs estimates
     IF significant_deviation:
       INVESTIGATE: Cause
       UPDATE: Estimates for future executions
     IF within_expected:
       CONFIRM: Timing as expected

  7. REPORT:
     "Counter-check executed at [timestamp]"
     "State inconsistencies corrected: S"
     "Resource leaks fixed: R"
     "Deadlocks resolved: D"
     "Stuck tasks unstuck: T"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Execution plan loaded from GATE_3?
□ Method 350 executed OR manual state management initialized?
□ Workflow initialized with all prerequisites verified?
□ Task execution started?
□ State tracking active for ALL tasks?
□ Failures handled according to policies?
□ Counter-check executed during execution?
□ All checkpoints created?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## 8. GATE_4

```
EVALUATE:
  execution_started = TRUE
  state_tracking_active = TRUE
  counter_check_executed = TRUE
  workflow_status = RUNNING OR FINISHING

COUNT:
  total_tasks = FROM execution_plan
  completed_tasks = WHERE task_state.status = COMPLETED
  failed_tasks = WHERE task_state.status = FAILED
  running_tasks = WHERE task_state.status = RUNNING

IF all TRUE AND (running_tasks > 0 OR completed_tasks > 0):
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - execution_active = TRUE, completed = C, failed = F, running = R"
  PROCEED to workflow.md for next step

IF any FALSE OR (running_tasks = 0 AND completed_tasks = 0):
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  OUTPUT: "Execution not started or immediately failed"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without initialization:
  HALT
  OUTPUT: "VIOLATION: Section 3 INITIALIZE_WORKFLOW required"
  RETURN to section 3

IF agent starts execution without verifying prerequisites:
  HALT
  OUTPUT: "VIOLATION: Prerequisites must be verified before execution"
  RETURN to section 3

IF agent skips state tracking:
  HALT
  OUTPUT: "VIOLATION: Section 2 or 3 state tracking required"
  RETURN to section 2

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
