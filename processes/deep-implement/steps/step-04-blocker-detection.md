# STEP 4: BLOCKER_DETECTION

## TRIGGERS
```
- HUMAN_REPORTED: "I'm blocked"
- AUTOMATIC: task IN_PROGRESS > 2× estimated
- AUTOMATIC: dependency unavailable
- AUTOMATIC: external service down
```

## SEQUENCE

### 4.1: CREATE_BLOCKER
```
GENERATE: BLK-{seq}
CLASSIFY:
  type: EXTERNAL | TECHNICAL | RESOURCE | KNOWLEDGE
  severity: CRITICAL | HIGH | MEDIUM
RECORD: affected_tasks, impact
```

### 4.2: ATTEMPT_RESOLUTION
```
IF workaround_available:
  EXECUTE: workaround
IF external_dependency:
  CONTACT: provider
IF technical:
  ASSIGN: Tech Lead
IF knowledge:
  SCHEDULE: Pairing session
```

### 4.3: ESCALATE_IF_UNRESOLVED
```
IF unresolved_24h AND severity = CRITICAL:
  TRIGGER: deep-change (create CR for alternative)
```
