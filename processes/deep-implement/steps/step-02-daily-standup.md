# STEP 2: DAILY_STANDUP

## PRECONDITION
```
TIME: 09:00 (every workday)
DURATION: 15 minutes
```

## SEQUENCE

### 2.1: EACH_PERSON_REPORTS
```
FOR each person IN team:
  ASK:
    - "What completed yesterday?"
    - "What working on today?"
    - "Any blockers?"
  
  IF blocker_mentioned:
    CREATE: blocker IN blockers.yaml
    ESCALATE: IF severity = CRITICAL
```

### 2.2: UPDATE_STATUS
```
RECORD: standup outcomes
UPDATE: execution-status.yaml
FLAG: blockers for resolution
```
