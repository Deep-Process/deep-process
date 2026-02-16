# STEP 10: CLOSE_ESCALATION

## PRECONDITION

```
INPUT: escalations.yaml WHERE status = DECIDED
```

## SEQUENCE

### 10.1: EXECUTE_DECISION

```
LOAD: escalation.decision.selected_option

APPLY: option actions

IF option = INCREASE_BUDGET:
  UPDATE: constraint_context.budget += delta
  NOTIFY: deep-plan (update budget constraint)
  NOTIFY: Finance (budget allocation change)

IF option = DESCOPE_FEATURES:
  IDENTIFY: tasks_to_descope ({percentage}% lowest priority)
  NOTIFY: deep-plan (remove tasks from plan)
  UPDATE: baseline-plan.yaml (scope reduction)

IF option = EXTEND_TIMELINE:
  UPDATE: constraint_context.timeline += weeks
  NOTIFY: deep-plan (regenerate plan with new timeline)
  UPDATE: stakeholder_expectations

IF option = PIVOT:
  TRIGGER: deep-architect (redesign)
  HALT: Current implementation
  SCHEDULE: Emergency architecture review

RECORD: actions_executed[]
```

### 10.2: UPDATE_AFFECTED_ARTIFACTS

```
BASED ON: executed_actions

UPDATE: implementation-plan.yaml

  IF budget_increased:
    plan.budget = new_budget

  IF timeline_extended:
    plan.duration = new_duration
    plan.end_date = new_end_date

  IF scope_reduced:
    plan.tasks = tasks - descoped_tasks
    plan.total_sp = total_sp - descoped_sp

REGENERATE: plan_version (increment)

WRITE: implementation-plan-v{N}.yaml

UPDATE: governance-decisions.yaml (append)

content:
  decision_id: GOV-DEC-{seq}
  decision_type: ESCALATION_RESOLUTION
  escalation_id: {id}
  decision: {selected_option}
  impact: {changes made}
```

### 10.3: COMMUNICATE_OUTCOME

```
IDENTIFY: stakeholders_to_notify

parties:
  - Decision authority (confirmation)
  - Eng

ineering team (impact on their work)
  - Product owner (scope/timeline changes)
  - Finance (budget changes)

FOR each party:

  FORMAT: outcome_notification

    content:
      escalation_id: {id}
      decision: {selected_option}
      actions_taken: {list}
      impact_on_[party]: {specific impact}
      next_steps: {what party needs to do}

  SEND: notification

RECORD: notifications_sent[]
```

### 10.4: EXTRACT_LESSONS_LEARNED

```
ANALYZE: escalation

questions:
  - Why did this escalation occur?
  - Could it have been prevented?
  - What early warning signs were missed?
  - How can we prevent similar escalations?

DOCUMENT: lessons

content:
  root_cause: {text}
  prevention_measures: {list}
  process_improvements: {list}
  early_warning_indicators: {list}

STORE: lessons_learned
```

### 10.5: CLOSE_ESCALATION_RECORD

```
UPDATE: escalations.yaml

content:
  escalation_id: {id}
  status: CLOSED
  closure_date: {timestamp}

  outcome:
    decision_executed: {boolean}
    actions_taken: {list}
    impact: {summary}

  lessons_learned: {text}

VERIFY: status = CLOSED
```

## CHECKLIST

```
□ Decision executed (actions taken)?
□ Affected artifacts updated (plan, budget, timeline)?
□ Outcome communicated to stakeholders?
□ Lessons learned extracted?
□ Escalation record closed?

IF any NO → RETURN to failed step
IF all YES → COMPLETE escalation handling
```

## OUTPUT

```
WRITE: escalation-resolution-{id}.md

content:
  escalation_id: {id}
  trigger: {reason}
  decision: {selected_option}
  actions_taken: {list}

  impact:
    budget: {change}
    timeline: {change}
    scope: {change}

  lessons_learned:
    root_cause: {text}
    prevention: {list}

  closure_date: {timestamp}
```
