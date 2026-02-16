# STEP 9: AWAIT_STAKEHOLDER_DECISION

## PRECONDITION

```
INPUT: escalations.yaml WHERE status = PREPARED
```

## SEQUENCE

### 9.1: COMMUNICATE_ESCALATION

```
LOAD: escalations.yaml → most recent WHERE status = PREPARED

FORMAT: escalation_document

  IF stakeholder_type = EXECUTIVE:
    format = EXECUTIVE_SUMMARY (1 page)
    content:
      - Situation (2-3 sentences)
      - Options table (pros/cons)
      - Recommendation
      - Decision needed by: {deadline}

  IF stakeholder_type = TECHNICAL:
    format = DETAILED_ANALYSIS (3-5 pages)
    content:
      - Full situation analysis
      - Technical implications
      - Options with detailed evaluations
      - Recommendation with technical rationale

SEND: escalation_document TO decision_authority

  via: Email + Slack notification + Calendar meeting invite

RECORD: communication_sent
  sent_to: {list}
  sent_date: {timestamp}
```

### 9.2: MONITOR_DEADLINE

```
LOAD: escalation.decision_deadline

WHILE decision NOT received AND today <= deadline:

  COMPUTE: days_until_deadline = deadline - today

  IF days_until_deadline = 1:
    SEND: reminder notification
    content: "Escalation {id} decision due tomorrow"

  IF days_until_deadline = 0:
    SEND: urgent reminder
    content: "Escalation {id} decision due TODAY"

  WAIT: 1 day
```

### 9.3: RECEIVE_DECISION

```
AWAIT: stakeholder_decision

  decision_inputs:
    - Email response
    - Meeting outcome
    - Decision document

WHEN decision received:

  EXTRACT:
    selected_option: {letter}
    decision_rationale: {text}
    conditions: {list} (if any)
    decided_by: {person}
    decided_date: {timestamp}

  VERIFY:
    selected_option IN options[] OR
    selected_option = CUSTOM (stakeholder proposes new option)

  IF selected_option = CUSTOM:
    DOCUMENT: custom_option details
    EVALUATE: feasibility (quick assessment)

STORE: stakeholder_decision
```

### 9.4: HANDLE_DEADLINE_PASSED

```
IF deadline passed AND decision NOT received:

  EXECUTE: fallback_option

  NOTIFY: stakeholders
    content:
      "Escalation {id} deadline passed without decision.
       Executing fallback: Option {letter}
       Rationale: {why this fallback}"

  RECORD:
    decision = fallback_option
    decided_by = GOVERNANCE_BOARD (fallback)
    decided_date = {timestamp}
    reason = "Deadline passed, no stakeholder decision"

  STORE: fallback_executed = TRUE
```

## CHECKLIST

```
□ Escalation communicated to stakeholders?
□ Deadline monitored?
□ Decision received (OR deadline passed)?
□ Decision extracted and verified?
□ Fallback executed (if needed)?

IF any NO → WAIT or EXECUTE fallback
IF all YES → PROCEED to step-10
```

## OUTPUT

```
UPDATE: escalations.yaml

content:
  escalation_id: {id}
  status: DECIDED
  communication_sent: {timestamp}
  decision_received: {timestamp}

  decision:
    selected_option: {letter}
    rationale: {text}
    decided_by: {person}
    decided_date: {timestamp}
    fallback_executed: {boolean}
```
