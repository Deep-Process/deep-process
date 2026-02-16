# STEP 1: INGEST_STATUS

## PRECONDITION

```
NONE (first step of daily cycle)
```

## SEQUENCE

### 1.1: LOAD_EXECUTION_STATUS

```
READ: execution-status.yaml

EXTRACT:
  tasks_completed_yesterday: WHERE status = COMPLETED AND completed_date = yesterday
  tasks_in_progress: WHERE status = IN_PROGRESS
  tasks_blocked: WHERE status = BLOCKED
  tasks_pending: WHERE status = PENDING

COUNT:
  n_completed = COUNT(tasks_completed_yesterday)
  n_in_progress = COUNT(tasks_in_progress)
  n_blocked = COUNT(tasks_blocked)
  n_pending = COUNT(tasks_pending)

STORE: execution_snapshot
```

### 1.2: LOAD_PLAN_VARIANCE

```
READ: plan-variance-report.md (from deep-plan, if exists)

IF exists:
  EXTRACT:
    schedule_variance: {percentage}
    velocity_variance: {percentage}
    scope_variance: {percentage}

IF NOT exists:
  SET: all variances = 0 (first sprint, no baseline yet)

STORE: variance_snapshot
```

### 1.3: LOAD_BLOCKERS

```
READ: blockers.yaml (from deep-implement)

EXTRACT:
  active_blockers: WHERE status = ACTIVE

COUNT: n_blockers = COUNT(active_blockers)

FOR each active_blocker:
  EXTRACT:
    blocker_id: {id}
    affected_tasks_count: COUNT(affected_tasks)
    blocker_age_days: today - detected_date

STORE: blocker_snapshot
```

### 1.4: LOAD_CHANGES

```
READ: change-requests.yaml (from deep-change)

EXTRACT:
  pending_changes: WHERE status = ANALYZED OR INFO_REQUESTED
  approved_changes: WHERE status = APPROVED AND implementation_status != COMPLETED

COUNT:
  n_pending = COUNT(pending_changes)
  n_approved_in_progress = COUNT(approved_changes)

STORE: change_snapshot
```

### 1.5: LOAD_QUALITY_GATES

```
READ: quality-gate-results.yaml (from deep-verify, if exists)

IF exists:
  EXTRACT:
    gates_passed: WHERE result = PASS
    gates_failed: WHERE result = FAIL

  COUNT:
    n_passed = COUNT(gates_passed)
    n_failed = COUNT(gates_failed)

IF NOT exists:
  SET: n_passed = 0, n_failed = 0

STORE: quality_snapshot
```

## CHECKLIST

```
□ Execution status loaded?
□ Plan variance loaded (or set to 0)?
□ Blockers loaded?
□ Change requests loaded?
□ Quality gates loaded (or set to 0)?

IF any NO → RETRY load
IF all YES → PROCEED to step-02
```

## OUTPUT

```
WRITE: monitoring-snapshot-{date}.yaml

content:
  date: {today}
  execution:
    completed_yesterday: {n_completed}
    in_progress: {n_in_progress}
    blocked: {n_blocked}
    pending: {n_pending}

  variance:
    schedule: {schedule_variance}
    velocity: {velocity_variance}
    scope: {scope_variance}

  blockers:
    active: {n_blockers}

  changes:
    pending: {n_pending}
    approved_in_progress: {n_approved_in_progress}

  quality:
    gates_passed: {n_passed}
    gates_failed: {n_failed}
```
