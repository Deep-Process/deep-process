# Process Registry Update Protocol v1.0

**ARCHITECT-TASK.yaml task_05 deliverable**

## Registry Structure

```yaml
registry:
  instances:
    - instance_id: "deep-verify-042"
      status: "RUNNING"
      lifecycle_state:
        current_phase: "phase-3"
        progress: 75
      lock_status:
        is_locked: true
        locked_by: "claude-sonnet-4.5"
      created_at: "2026-02-16T10:00:00Z"
```

## State Transitions

```
CREATED → RUNNING → (PAUSED) → COMPLETED | FAILED → ARCHIVED
```

### Transition Rules

**CREATED → RUNNING**
```
WHEN: Instance initialized
ACTION: Set status=RUNNING, emit PROCESS_STARTED event
```

**RUNNING → PAUSED**
```
WHEN: Operator pauses
ACTION: Set status=PAUSED, emit PROCESS_PAUSED event
```

**PAUSED → RUNNING**
```
WHEN: Operator resumes
ACTION: Set status=RUNNING, emit PROCESS_RESUMED event
```

**RUNNING → COMPLETED**
```
WHEN: Process finishes successfully
ACTION: Set status=COMPLETED, emit PROCESS_COMPLETED event
```

**RUNNING → FAILED**
```
WHEN: Process encounters error
ACTION: Set status=FAILED, emit PROCESS_FAILED event
```

**COMPLETED|FAILED → ARCHIVED**
```
WHEN: After 90 days OR operator archives
ACTION: Move to archived registry, compress artifacts
```

## Locking Mechanism

```python
def acquire_lock(instance_id, locked_by):
    entry = registry.get(instance_id)
    if entry.lock_status.is_locked:
        raise LockAlreadyHeld(f"Locked by {entry.lock_status.locked_by}")
    entry.lock_status.is_locked = True
    entry.lock_status.locked_by = locked_by
    entry.lock_status.locked_at = now()
    registry.save()

def release_lock(instance_id):
    entry = registry.get(instance_id)
    entry.lock_status.is_locked = False
    entry.lock_status.locked_by = null
    registry.save()
```

## Registry Update Operations

**CREATE**: Add new instance entry
**UPDATE**: Modify instance state/progress
**DELETE**: Remove from active registry (archive)
**QUERY**: Look up instance by ID or filter by status

---
**END**
