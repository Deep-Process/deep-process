# STEP 3: SUBMIT_TO_GOVERNANCE

## PRECONDITION
```
GATE_ENTRY: GATE_2 = OPEN
INPUT: impact-analysis-{CR_id}.yaml
```

## SEQUENCE

### 3.1: PREPARE_SUBMISSION
```
LOAD: CR + impact_analysis
FORMAT: governance_submission
CONTENT:
  - CR summary
  - Impact (timeline, cost, risk)
  - Recommendation
  - Alternatives
```

### 3.2: ROUTE_BY_PRIORITY
```
IF priority = CRITICAL:
  ROUTE: Immediate escalation (Slack + email)
IF priority = HIGH:
  ROUTE: Weekly board agenda
IF priority = MEDIUM | LOW:
  ROUTE: Backlog queue
```

### 3.3: AWAIT_DECISION
```
MONITOR: governance-decisions.yaml
WAIT: decision WHERE change_id = CR_id
TIMEOUT: based on priority
```

### 3.4: RECORD_DECISION
```
WHEN decision received:
  EXTRACT: decision, rationale, conditions
  UPDATE: CR.status = APPROVED | REJECTED | DEFERRED
  STORE: decision_record
```

## GATE_3
```
IF decision_received:
  GATE_3 = OPEN
  ROUTE: Based on decision
    APPROVED → step-04
    REJECTED → step-06
    DEFERRED → step-07
ELSE:
  WAIT
```
