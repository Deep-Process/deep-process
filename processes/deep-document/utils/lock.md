# Lock Mechanism (Concurrency Control)
# Version: 7.1.0

## Purpose

Prevent concurrent modifications to process-state.yaml.
Ensure only one agent/state executes at a time.

## Lock Structure

In process-state.yaml:

```yaml
lock:
  agent: <step_file_name>
  acquired_timestamp: <ISO8601>
  state: <current_state>
```

When no lock:
```yaml
lock: null
```

## Operations

### 1. Acquire Lock

**Before delegating to step:**

```python
def acquire_lock(step_file, state):
    """
    Acquire lock before executing step.

    Args:
        step_file: Name of step file (e.g., "step-01-init.md")
        state: State name (e.g., "STATE_INIT")

    Returns:
        bool: True if acquired, False if already locked
    """
    process_state = read_process_state()

    if process_state['lock'] is not None:
        # Lock already held
        return False

    process_state['lock'] = {
        'agent': step_file,
        'acquired_timestamp': datetime.now().isoformat(),
        'state': state
    }

    write_process_state(process_state)
    return True
```

**Execution:**
1. Read process-state.yaml
2. Check if lock == null
3. If not null → BLOCKER (another process running)
4. If null → set lock with agent/timestamp/state
5. Write process-state.yaml

### 2. Release Lock

**After step completion:**

```python
def release_lock():
    """
    Release lock after step completion.
    Allows next state to execute.
    """
    process_state = read_process_state()
    process_state['lock'] = None
    write_process_state(process_state)
```

**Execution:**
1. Read process-state.yaml
2. Set lock = null
3. Write process-state.yaml

### 3. Check Lock

**On process load (SCENARIO B):**

```python
def check_lock():
    """
    Verify no lock when loading process.

    Returns:
        dict: Lock info if held, None if free
    """
    process_state = read_process_state()
    return process_state.get('lock')
```

**Enforcement:**
- If lock != null → display warning
- Show: "Process locked by {agent} at {timestamp} in state {state}"
- Options: [W]ait, [F]orce release (dangerous), [Q]uit

## Lock States

**FREE (lock == null):**
- Process can be loaded
- New state execution can start

**HELD (lock != null):**
- Process is being executed by another agent
- Cannot load or modify
- Must wait or force release

## Concurrency Scenarios

### Scenario 1: Single User, Sequential
```
Load process → lock == null → acquire → execute → release → lock == null
```
**Result:** Normal operation

### Scenario 2: Multiple Windows, Same Process
```
Window A: Load → acquire → executing...
Window B: Load → lock != null → BLOCKER
```
**Result:** Window B blocked until A releases

### Scenario 3: Crash During Execution
```
Load → acquire → crash → lock never released
```
**Result:** Next load finds lock, offers [F]orce release

## Force Release (Dangerous)

**When to use:**
- Previous process crashed without releasing lock
- Lock timestamp > 30 minutes old
- User confirms no other process running

**How to force:**
```python
def force_release_lock():
    """
    Force release lock (use only if process crashed).
    Logs forced release in decisions[].
    """
    process_state = read_process_state()

    old_lock = process_state['lock']
    process_state['lock'] = None

    process_state['decisions'].append({
        'timestamp': datetime.now().isoformat(),
        'decision': 'FORCED_LOCK_RELEASE',
        'old_lock': old_lock,
        'reason': 'User forced release after crash/timeout'
    })

    write_process_state(process_state)
```

## Lock Timeout

**Recommended timeout: 30 minutes**

If lock held > 30 minutes:
- Likely process crashed or hung
- Safe to offer force release
- Log forced release for audit trail

## Example Lock Lifecycle

```yaml
# Initial state
lock: null

# After workflow delegates to STATE_INIT
lock:
  agent: "step-01-init.md"
  acquired_timestamp: "2026-02-11T10:30:00Z"
  state: "STATE_INIT"

# After STATE_INIT completes, before transition
lock: null

# After transition to STATE_ONTOLOGY_EXTRACTION
lock:
  agent: "step-02-ontology.md"
  acquired_timestamp: "2026-02-11T10:35:00Z"
  state: "STATE_ONTOLOGY_EXTRACTION"

# After all states complete
lock: null
```

## Dependencies

- process-state.yaml (lock field)
- decisions[] array (for forced release logging)

## Version

**lock.md Version:** 7.1.0
**Compatible with:** workflow.md 7.1.0
