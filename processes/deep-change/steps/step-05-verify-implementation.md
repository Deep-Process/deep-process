# STEP 5: VERIFY_IMPLEMENTATION

## PRECONDITION
```
GATE_ENTRY: GATE_4 = OPEN
INPUT: execution-status.yaml
```

## SEQUENCE

### 5.1: AWAIT_COMPLETION
```
MONITOR: execution-status.yaml
WAIT: ALL CR tasks WHERE status = COMPLETED
```

### 5.2: VERIFY_GOAL
```
LOAD: CR.original_goal (from submission)
CHECK:
  - Functional: feature works?
  - Quality: tests pass?
  - Integration: no breakage?
RESULT: GOAL_ACHIEVED | PARTIAL | NOT_ACHIEVED
```

### 5.3: MEASURE_ACTUAL_IMPACT
```
COMPARE: estimated vs actual
METRICS:
  timeline_variance = actual_days - estimated_days
  cost_variance = actual_cost - estimated_cost
VERIFY: variance WITHIN ±50% (acceptable)
```

### 5.4: EXTRACT_LESSONS
```
DOCUMENT:
  what_went_well: {list}
  what_went_wrong: {list}
  what_to_improve: {list}
STORE: lessons_learned
```

### 5.5: CLOSE_CR
```
UPDATE: CR.status = COMPLETED
RECORD:
  completion_date, outcome, lessons
OUTPUT: change-outcome-{CR_id}.yaml
```

## GATE_5
```
IF CR.status = COMPLETED:
  GATE_5 = OPEN
  COMPLETE: deep-change process
ELSE:
  HALT
```
