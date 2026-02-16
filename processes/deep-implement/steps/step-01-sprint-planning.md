# STEP 1: SPRINT_PLANNING

## PRECONDITION
```
TRIGGER: Friday before sprint (14:00)
INPUT: sprint-backlog-{N}.yaml FROM deep-plan
```

## SEQUENCE

### 1.1: LOAD_BACKLOG
```
READ: sprint-backlog-{N}.yaml
VERIFY:
  - All tasks have DoD
  - Dependencies satisfied
  - Resources assigned
  - Capacity <= team_capacity
```

### 1.2: KICKOFF_MEETING
```
DURATION: 2 hours
REVIEW:
  - Sprint goal
  - Tasks (each explained)
  - Assignments
  - Risks
VOTE: Team commits? (YES/NO)

IF NO:
  DESCOPE: Lowest priority tasks
  RETRY: Commitment vote
```

### 1.3: INITIALIZE_STATE
```
CREATE: execution-status-sprint-{N}.yaml
FOR each task:
  status: PENDING
  assigned_to: {person}
  started: null
  completed: null
OUTPUT: Sprint initialized
```

## GATE_1
```
IF team_committed:
  GATE_1 = OPEN
  BEGIN: Sprint execution
ELSE:
  HALT
```
