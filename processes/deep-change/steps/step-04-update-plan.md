# STEP 4: UPDATE_PLAN

## PRECONDITION
```
GATE_ENTRY: GATE_3 = OPEN AND decision = APPROVED
```

## SEQUENCE

### 4.1: MOVE_TO_APPROVED
```
UPDATE: change-requests.yaml
  CR.status = APPROVED

WRITE: approved-changes.yaml (append)
  change_id, approved_date, approved_by
```

### 4.2: TRIGGER_PLAN_UPDATE
```
SEND: approved-changes.yaml TO deep-plan
REQUEST: Execute step-06-replan.md
PAYLOAD:
  - tasks_to_add: {from impact analysis}
  - dependencies: {prerequisite tasks}
  - target_sprint: {calculated}
```

### 4.3: AWAIT_PLAN_UPDATE
```
MONITOR: implementation-plan.yaml (version change)
WAIT: deep-plan completes re-planning
VERIFY: CR tasks in plan
```

### 4.4: TRIGGER_IMPLEMENTATION
```
SEND: approved-changes.yaml TO deep-implement
NOTIFY: Tasks added to Sprint {N}
```

### 4.5: UPDATE_STATUS
```
UPDATE: CR.status = IN_IMPLEMENTATION
TRACK: implementation_progress
```

## GATE_4
```
IF plan_updated AND implementation_triggered:
  GATE_4 = OPEN
  PROCEED: To step-05
ELSE:
  HALT
```
