# STEP 7: EXECUTE_DECISION

## PRECONDITION

```
INPUT: governance-decisions.yaml (most recent decision)
```

## SEQUENCE

### 7.1: ROUTE_DECISION

```
LOAD: most recent decision FROM governance-decisions.yaml

EXTRACT:
  decision: {APPROVE|REJECT|DEFER|ESCALATE|HALT}
  decision_type: {CHANGE_REQUEST|RISK|QUALITY|GO_NO_GO}
  target_id: {CR_id|risk_id|gate_id|sprint_id}

DETERMINE: routing

IF decision = APPROVE AND decision_type = CHANGE_REQUEST:
  ROUTE: To deep-change (move to approved-changes.yaml)
  TRIGGER: deep-plan (update plan)

IF decision = APPROVE AND decision_type = RISK:
  ROUTE: To deep-risk (execute mitigation)
  TRIGGER: deep-plan (schedule mitigation tasks)

IF decision = HALT AND decision_type = QUALITY:
  ROUTE: To deep-implement (halt current sprint)
  TRIGGER: deep-change (create corrective action CR)

IF decision = GO AND decision_type = GO_NO_GO:
  ROUTE: To deep-implement (proceed with next sprint)

IF decision = PAUSE AND decision_type = GO_NO_GO:
  ROUTE: To deep-implement (pause sprint)
  TRIGGER: Root cause analysis

IF decision = ESCALATE:
  PROCEED: To step-08 (prepare escalation)

IF decision = REJECT:
  NOTIFY: Submitter (decision + rejection_reason)

IF decision = DEFER:
  SCHEDULE: Revisit at revisit_date
```

### 7.2: NOTIFY_AFFECTED_PARTIES

```
IDENTIFY: affected_parties

parties:
  IF decision affects change_request:
    - Submitter (person who requested change)
    - deep-plan (needs to update plan)
    - deep-implement (needs to execute OR descope)

  IF decision affects risk:
    - deep-risk (execute mitigation OR accept risk)
    - deep-plan (schedule mitigation tasks)

  IF decision affects quality:
    - deep-implement (halt OR fix OR waive)
    - Task assignee (needs to fix issue)

FOR each party:
  SEND: notification

  content:
    decision_id: {id}
    decision: {value}
    rationale: {text}
    action_required: {description}
    deadline: {date} (if applicable)

RECORD: notifications_sent[]
```

### 7.3: UPDATE_AFFECTED_ARTIFACTS

```
IF decision = APPROVE AND decision_type = CHANGE_REQUEST:

  READ: change-requests.yaml
  FIND: change_request WHERE id = target_id
  UPDATE: status = APPROVED

  WRITE: approved-changes.yaml (append)

  content:
    change_id: {id}
    approved_date: {timestamp}
    approved_by: GOV-DEC-{id}

IF decision = REJECT:

  READ: change-requests.yaml
  FIND: change_request WHERE id = target_id
  UPDATE: status = REJECTED
  RECORD: rejection_reason

IF decision = DEFER:

  READ: change-requests.yaml
  FIND: change_request WHERE id = target_id
  UPDATE: status = DEFERRED
  RECORD: revisit_date

VERIFY: All updates applied
```

### 7.4: TRIGGER_DOWNSTREAM_PROCESSES

```
FOR each triggered_process:

  IF trigger = deep-plan:
    ACTION: deep-plan starts step-06-replan.md

  IF trigger = deep-implement:
    ACTION: deep-implement updates execution based on decision

  IF trigger = deep-change:
    ACTION: deep-change creates new CR (e.g., corrective action)

  IF trigger = deep-risk:
    ACTION: deep-risk executes mitigation OR updates risk status

RECORD: processes_triggered[]
```

### 7.5: SCHEDULE_FOLLOW_UP

```
IF decision.review_checkpoint = TRUE:

  COMPUTE: review_date = decision_date + 2 sprints

  CREATE: follow_up_review

  content:
    decision_id: {id}
    review_date: {date}
    review_purpose: "Verify decision outcome, assess if reversal needed"

  STORE: scheduled_reviews[]

IF decision.conditions[] NOT empty:

  FOR each condition:

    CREATE: condition_tracking

    content:
      decision_id: {id}
      condition: {text}
      verification_criteria: {text}
      due_date: {date}
      status: PENDING

  STORE: condition_tracking[]
```

## CHECKLIST

```
□ Decision routed to correct process?
□ Affected parties notified?
□ Affected artifacts updated (status changed)?
□ Downstream processes triggered?
□ Follow-up scheduled (if needed)?

IF any NO → RETURN to failed step
IF all YES → COMPLETE decision execution
```

## OUTPUT

```
WRITE: decision-execution-log.yaml (append)

content:
  decision_id: {id}
  execution_date: {timestamp}

  routing:
    routed_to: {process names}

  notifications:
    sent_to: {list of parties}

  artifacts_updated:
    - change-requests.yaml: {status changed}
    - approved-changes.yaml: {appended}

  processes_triggered:
    - deep-plan: "Re-planning triggered"
    - deep-implement: "Execution updated"

  follow_up:
    review_scheduled: {boolean}
    conditions_tracked: {count}
```
