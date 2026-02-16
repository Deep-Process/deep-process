# Deep-Implement Workflow

## MODES

```
MODE 1: SPRINT_EXECUTION (2-week cycle)
MODE 2: TASK_EXECUTION (individual task)
MODE 3: BLOCKER_HANDLING (on-demand)
```

## MODE 1: SPRINT_EXECUTION

```yaml
DAY 0 (Friday): SPRINT_PLANNING
  EXECUTE: steps/step-01-sprint-planning.md
  OUTPUT: Sprint commitment

DAY 1-10: DAILY_EXECUTION
  09:00: EXECUTE: steps/step-02-daily-standup.md
  09:15-17:00: EXECUTE: steps/step-03-task-execution.md (parallel, all tasks)
  CONTINUOUS: EXECUTE: steps/step-04-blocker-detection.md

DAY 7 (Friday): MID_SPRINT_CHECKPOINT
  EXECUTE: steps/step-05-mid-sprint-checkpoint.md
  OUTPUT: GO/NO-GO decision for sprint continuation

DAY 14 (Friday): SPRINT_RETROSPECTIVE
  EXECUTE: steps/step-06-sprint-retrospective.md
  OUTPUT: sprint-retrospective-{N}.yaml
```

## MODE 2: TASK_EXECUTION
```
TRIGGER: Task claimed from backlog
EXECUTE: steps/step-03-task-execution.md
OUTPUT: Task completed OR blocked
```

## MODE 3: BLOCKER_HANDLING
```
TRIGGER: Blocker detected (manual OR automatic)
EXECUTE: steps/step-04-blocker-detection.md
IF unresolved:
  TRIGGER: deep-change (create CR)
```
