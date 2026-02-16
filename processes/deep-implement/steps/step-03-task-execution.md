# STEP 3: TASK_EXECUTION

## SEQUENCE

### 3.1: CLAIM_TASK
```
HUMAN: Selects task from backlog
UPDATE: task.status = IN_PROGRESS
RECORD: task.started = timestamp
```

### 3.2: EXECUTE_TASK
```
HUMAN: Implements (code, config, docs, tests)
MONITOR: time_since_start
IF > 2× estimated: FLAG as potentially blocked
```

### 3.3: VALIDATE_QUALITY
```
RUN: automated_checks
  - SAST scan
  - Linting
  - Unit tests
  - Coverage check
IF any FAIL: REMAIN in IN_PROGRESS
IF all PASS: PROCEED to completion
```

### 3.4: COMPLETE_TASK
```
VERIFY: DoD satisfied
UPDATE: task.status = COMPLETED
RECORD: task.completed, actual_duration
NOTIFY: deep-monitor
UNBLOCK: dependent tasks
```
