# Orchestration State Machine - State Transition Rules v1.0

**ARCHITECT-TASK.yaml task_06 deliverable**

## State Machine Overview

```
IDLE → PLANNING → EXECUTING → VALIDATING → COMPLETED
                                    ↓
                               FAILED
```

## States

### IDLE
- **Description**: Awaiting new process request
- **On Entry**: Log idle state
- **On Exit**: Create instance registry entry

### PLANNING
- **Description**: Loading process definition, validating inputs
- **On Entry**: Load process.yaml, validate inputs
- **On Exit**: Create execution plan

### EXECUTING
- **Description**: Running process steps
- **On Entry**: Start execution, emit PROCESS_STARTED event
- **On Exit**: Finalize outputs

### VALIDATING
- **Description**: Running final validation/gates
- **On Entry**: Run validation checklist
- **On Exit**: Emit VALIDATION_PASSED/FAILED event

### COMPLETED
- **Description**: Process finished successfully
- **Terminal State**: true
- **On Entry**: Emit PROCESS_COMPLETED event, archive

### FAILED
- **Description**: Process encountered error
- **Terminal State**: true
- **On Entry**: Emit PROCESS_FAILED event, log error

## Transitions

### T001: IDLE → PLANNING
```yaml
trigger: REQUEST_RECEIVED
guard: input_valid = true
action: create_instance
```

### T002: PLANNING → EXECUTING
```yaml
trigger: PLAN_APPROVED
guard: plan_valid = true
action: start_execution
```

### T003: EXECUTING → VALIDATING
```yaml
trigger: EXECUTION_COMPLETE
guard: all_steps_done = true
action: run_validation
```

### T004: VALIDATING → COMPLETED
```yaml
trigger: VALIDATION_PASSED
guard: all_validations_pass = true
action: finalize_and_archive
```

### T005: VALIDATING → FAILED
```yaml
trigger: VALIDATION_FAILED
guard: any_validation_fails = true
action: log_failure
```

### T006: EXECUTING → FAILED
```yaml
trigger: EXECUTION_ERROR
guard: error_is_fatal = true
action: log_error_and_cleanup
```

## Error Handlers

### Handle Validation Failure
```
IF error_type = "VALIDATION_FAILED" THEN
  transition_to(FAILED)
  emit_event(VALIDATION_FAILED)
```

### Handle Execution Error
```
IF error_type = "EXECUTION_ERROR" THEN
  IF retryable THEN
    retry_with_backoff()
  ELSE
    transition_to(FAILED)
```

---
**END**
