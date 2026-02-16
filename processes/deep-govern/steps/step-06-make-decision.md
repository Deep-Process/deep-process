# STEP 6: MAKE_DECISION

## PRECONDITION

```
INPUT: decision-evaluation-{id}.yaml FROM step-05
```

## SEQUENCE

### 6.1: REVIEW_RECOMMENDATION

```
LOAD: decision-evaluation-{id}.yaml

EXTRACT:
  recommendation: {value}
  rationale: {text}
  confidence: {level}
  alternatives: {list}
```

### 6.2: APPLY_DECISION_AUTHORITY

```
DETERMINE: decision_authority

rules:
  IF decision.impact.timeline <= 2 days AND cost <= $5000:
    decision_authority = AUTO (no human review)

  IF decision.impact.timeline <= 10 days AND cost <= $50000:
    decision_authority = GOVERNANCE_BOARD

  IF decision.impact.timeline > 10 days OR cost > $50000:
    decision_authority = STAKEHOLDERS (escalate)

  IF decision.type = SECURITY AND severity = CRITICAL:
    decision_authority = IMMEDIATE_HALT (no review needed)

STORE: decision_authority
```

### 6.3: MAKE_FINAL_DECISION

```
IF decision_authority = AUTO:
  decision = recommendation (approve automatically)

IF decision_authority = GOVERNANCE_BOARD:

  EVALUATE: recommendation + alternatives

  SELECT: decision FROM [APPROVE, REJECT, DEFER, APPROVE_WITH_CONDITIONS]

  IF APPROVE_WITH_CONDITIONS:
    DEFINE: conditions[] (e.g., "Complete integration testing before production")

IF decision_authority = STAKEHOLDERS:
  decision = ESCALATE
  PROCEED: To step-08 (prepare escalation)

IF decision_authority = IMMEDIATE_HALT:
  decision = HALT
  EXECUTE: Immediate halt actions

STORE: final_decision
```

### 6.4: DOCUMENT_RATIONALE

```
FOR final_decision:

  RECORD:
    decision: {APPROVE|REJECT|DEFER|ESCALATE|HALT}
    rationale: {text explaining WHY this decision}
    data_used: {list of inputs considered}
    alternatives_considered: {list}
    decision_maker: {GOVERNANCE_BOARD|AUTO|IMMEDIATE_HALT}
    decision_date: {timestamp}

  IF decision = APPROVE_WITH_CONDITIONS:
    DOCUMENT: conditions[] with verification criteria

  IF decision = REJECT:
    DOCUMENT: rejection_reason + alternative_suggested

  IF decision = DEFER:
    DOCUMENT: revisit_date + revisit_trigger

STORE: decision_record
```

### 6.5: ASSESS_REVERSIBILITY

```
EVALUATE: decision_reversibility

IF decision = APPROVE:

  CLASSIFY:
    HIGH_REVERSIBILITY:
      - Can undo if wrong (e.g., add feature, can remove later)
      - Low sunk cost

    MEDIUM_REVERSIBILITY:
      - Can undo but with effort (e.g., database schema change, migration needed)

    LOW_REVERSIBILITY:
      - Hard to undo (e.g., multi-tenant architecture decision)
      - High sunk cost

  IF reversibility = LOW:
    FLAG: review_checkpoint = TRUE
    SCHEDULE: Review decision in 2 sprints

STORE: reversibility_assessment
```

## COUNTER-CHECK

```
CLAIM: "Decision aligns with project goals"

ATTEMPT_REFUTATION:
  CHECK: Decision increases timeline beyond acceptable limit?
  CHECK: Decision increases cost beyond budget?
  CHECK: Decision introduces unacceptable risk?
  CHECK: Decision conflicts with architecture principles?

  IF any TRUE:
    REFUTATION: SUCCESS
    OUTPUT: "Decision misaligned: [issue]"
    RECONSIDER: decision

  REFUTATION: FAILED
  CONFIRMATION: "Decision aligned with goals"
```

## CHECKLIST

```
□ Recommendation reviewed?
□ Decision authority determined?
□ Final decision made?
□ Rationale documented?
□ Reversibility assessed?
□ Counter-check executed (decision aligned)?

IF any NO → RETURN to failed step
IF all YES → PROCEED to step-07 (execute decision)
```

## OUTPUT

```
WRITE: Append to governance-decisions.yaml

content:
  decision_id: GOV-DEC-{seq}
  decision_type: {type}
  decision: {APPROVE|REJECT|DEFER|ESCALATE|HALT}
  decision_date: {timestamp}
  decision_maker: {authority}

  rationale: {text}
  data_used: {list}
  alternatives_considered: {list}

  conditions: {list} (if APPROVE_WITH_CONDITIONS)
  rejection_reason: {text} (if REJECT)
  revisit_date: {date} (if DEFER)

  reversibility: {HIGH|MEDIUM|LOW}
  review_checkpoint: {boolean}

  impact:
    timeline: {value}
    cost: {value}
    risk: {value}
```
