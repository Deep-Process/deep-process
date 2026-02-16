# Deep-Govern Workflow

## MODES

```
MODE 1: CONTINUOUS_MONITORING (daily)
MODE 2: WEEKLY_REVIEW (every Friday)
MODE 3: DECISION_EXECUTION (on-demand)
MODE 4: ESCALATION_HANDLING (on-demand)
```

## MODE 1: CONTINUOUS_MONITORING

```yaml
FREQUENCY: Daily at 09:00

EXECUTE: steps/step-01-ingest-status.md
EXECUTE: steps/step-02-compute-health.md
EXECUTE: steps/step-03-detect-anomalies.md

OUTPUT: governance-dashboard-daily.yaml
```

## MODE 2: WEEKLY_REVIEW

```yaml
FREQUENCY: Every Friday 14:00

PRECONDITION: CONTINUOUS_MONITORING active

EXECUTE: steps/step-04-weekly-review.md
WAIT: Decisions made

OUTPUT: health-report-week-{N}.md
OUTPUT: governance-decisions.yaml (appended)
```

## MODE 3: DECISION_EXECUTION

```yaml
TRIGGER: change-requests.yaml updated OR escalation.yaml created

EXECUTE: steps/step-05-evaluate-decision.md
EXECUTE: steps/step-06-make-decision.md
EXECUTE: steps/step-07-execute-decision.md

OUTPUT: governance-decisions.yaml (appended)
OUTPUT: approved-changes.yaml (if change approved)
```

## MODE 4: ESCALATION_HANDLING

```yaml
TRIGGER: escalation.yaml WHERE severity = CRITICAL

PRECONDITION: Issue cannot be resolved by governance board

EXECUTE: steps/step-08-prepare-escalation.md
EXECUTE: steps/step-09-await-stakeholder-decision.md
EXECUTE: steps/step-10-close-escalation.md

OUTPUT: escalations.yaml (updated)
```

## VIOLATION RECOVERY

```
IF decision made without evaluation:
  HALT
  OUTPUT: "VIOLATION: Step 05 (evaluate) required before step 06 (decide)"
  RETURN: To step-05

IF escalation not prepared:
  HALT
  OUTPUT: "VIOLATION: Step 08 (prepare) required before step 09 (await)"
  RETURN: To step-08
```
