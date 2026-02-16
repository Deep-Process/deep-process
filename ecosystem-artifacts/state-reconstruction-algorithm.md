# State Reconstruction Algorithm v1.0

**ARCHITECT-TASK.yaml task_02 deliverable**
**Date:** 2026-02-16
**Purpose:** Detailed algorithm for reconstructing state from event log

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Algorithm Specification](#algorithm-specification)
3. [Event Handler Implementations](#event-handler-implementations)
4. [Performance Optimizations](#performance-optimizations)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## OVERVIEW

### Purpose

Reconstruct current process state by replaying events from most recent snapshot.

### Key Principles

- **Deterministic**: Same events → same state (always)
- **Incremental**: Only replay events since last snapshot
- **Efficient**: O(N) where N = events since snapshot (max 100)
- **Fault-tolerant**: Handle corrupted events gracefully

### Performance Target

- Reconstruct state from snapshot: <100ms (for 100 events)
- Cold start (no snapshot): <5s (for 10,000 events)

---

## ALGORITHM SPECIFICATION

### Main Algorithm

```python
def reconstruct_state(target_event_sequence: int) -> ProcessState:
    """
    Reconstruct process state at given event sequence.

    Args:
        target_event_sequence: Event sequence to reconstruct to

    Returns:
        ProcessState: Reconstructed state

    Raises:
        CorruptionError: If event log corruption detected
        SnapshotNotFoundError: If no snapshot and too many events
    """

    # STEP 1: Find most recent snapshot
    snapshot = find_latest_snapshot_before(target_event_sequence)

    if snapshot is not None:
        # Load snapshot as base state
        state = load_snapshot(snapshot)
        start_sequence = snapshot.event_sequence + 1

        log_info(f"Loaded snapshot at sequence {snapshot.event_sequence}")
    else:
        # No snapshot found - start from scratch
        state = initialize_empty_state()
        start_sequence = 1

        # WARNING: This will replay ALL events (slow!)
        if target_event_sequence > 1000:
            log_warning(f"No snapshot found, replaying {target_event_sequence} events")

    # STEP 2: Load events to replay
    events = load_events_range(start_sequence, target_event_sequence)

    # STEP 3: Validate event chain integrity
    validate_event_chain(events)

    # STEP 4: Replay events
    for event in events:
        try:
            state = apply_event(state, event)
        except EventHandlerError as e:
            # Handle corrupted or invalid events
            log_error(f"Failed to apply event {event.dp_id}: {e}")

            # Decision point: Continue with warning OR halt?
            if event.event_type in CRITICAL_EVENT_TYPES:
                raise CorruptionError(f"Critical event {event.dp_id} failed")
            else:
                # Non-critical: log and continue
                state.warnings.append(f"Skipped event {event.dp_id}")

    # STEP 5: Validate reconstructed state
    validate_state_consistency(state)

    return state
```

### Helper Functions

#### 1. Find Latest Snapshot

```python
def find_latest_snapshot_before(target_sequence: int) -> Optional[Snapshot]:
    """
    Find most recent snapshot before target sequence.

    Algorithm:
    1. Load snapshot index (.deep-process/snapshots/index.yaml)
    2. Filter snapshots where snapshot.event_sequence < target_sequence
    3. Return snapshot with max(event_sequence)

    Time complexity: O(log N) if index is sorted
    """

    snapshot_index = load_yaml(".deep-process/snapshots/index.yaml")

    # Filter valid snapshots
    candidates = [
        s for s in snapshot_index.snapshots
        if s.event_sequence < target_sequence
    ]

    if not candidates:
        return None

    # Return most recent
    latest = max(candidates, key=lambda s: s.event_sequence)

    return latest
```

#### 2. Load Events Range

```python
def load_events_range(start: int, end: int) -> List[Event]:
    """
    Load events from start (inclusive) to end (inclusive).

    Handles file rotation:
    - Events may span multiple event-log-*.yaml files
    - Use event-log-index.yaml to find correct files

    Time complexity: O(N) where N = (end - start)
    """

    events = []

    # Load event log index
    index = load_yaml(".deep-process/event-log-index.yaml")

    # Find files containing events in range
    for log_file in index.log_files:
        if log_file.sequence_range_overlaps(start, end):
            file_events = load_yaml(log_file.path)

            # Filter to range
            for event in file_events.events:
                if start <= event.event_sequence <= end:
                    events.append(event)

    # Sort by sequence (should already be sorted, but defensive)
    events.sort(key=lambda e: e.event_sequence)

    return events
```

#### 3. Validate Event Chain

```python
def validate_event_chain(events: List[Event]) -> None:
    """
    Validate hash chain integrity.

    Checks:
    1. Monotonic sequence (N, N+1, N+2, ...)
    2. Hash chain links (event[i].previous_hash = event[i-1].hash)
    3. Hash correctness (recalculate and compare)

    Raises:
        HashChainBrokenError: If chain integrity violated
        SequenceGapError: If sequence numbers not consecutive
    """

    for i, event in enumerate(events):
        # Check 1: Sequence monotonicity
        if i > 0:
            expected_sequence = events[i-1].event_sequence + 1
            if event.event_sequence != expected_sequence:
                raise SequenceGapError(
                    f"Gap: expected {expected_sequence}, got {event.event_sequence}"
                )

        # Check 2: Hash chain
        if i > 0:
            previous_hash = events[i-1].event_hash
            if event.previous_event_hash != previous_hash:
                raise HashChainBrokenError(
                    f"Event {event.dp_id}: previous_hash mismatch"
                )

        # Check 3: Hash correctness
        calculated_hash = calculate_event_hash(event)
        if event.event_hash != calculated_hash:
            raise HashCorruptionError(
                f"Event {event.dp_id}: hash mismatch (tampering detected?)"
            )
```

#### 4. Apply Event

```python
def apply_event(state: ProcessState, event: Event) -> ProcessState:
    """
    Apply single event to state using event-specific handler.

    Dispatcher pattern:
    - Each event_type has dedicated handler function
    - Handler takes (state, payload) → returns new state

    Time complexity: O(1) for most handlers
    """

    # Get handler for event type
    handler = EVENT_HANDLERS.get(event.event_type)

    if handler is None:
        log_warning(f"No handler for event type {event.event_type}")
        return state  # Skip unknown events

    # Apply handler
    new_state = handler(state, event.event_payload)

    # Record event in history
    new_state.event_history.append({
        'sequence': event.event_sequence,
        'type': event.event_type,
        'timestamp': event.timestamp
    })

    return new_state
```

---

## EVENT HANDLER IMPLEMENTATIONS

### Process Lifecycle Handlers

#### PROCESS_STARTED

```python
def handle_PROCESS_STARTED(state: ProcessState, payload: dict) -> ProcessState:
    """Initialize process state from PROCESS_STARTED event."""

    state.process_id = payload['process_id']
    state.process_name = payload['process_name']
    state.status = 'RUNNING'
    state.started_at = payload['timestamp']
    state.started_by = payload['started_by']

    # Initialize empty collections
    state.artifacts = []
    state.gates_passed = []
    state.variables = payload.get('initial_state', {})

    return state
```

#### PROCESS_COMPLETED

```python
def handle_PROCESS_COMPLETED(state: ProcessState, payload: dict) -> ProcessState:
    """Mark process as completed."""

    state.status = 'COMPLETED'
    state.completed_at = payload['timestamp']
    state.completion_status = payload['completion_status']
    state.final_artifacts = payload['final_artifacts']

    if 'final_score' in payload:
        state.final_score = payload['final_score']

    return state
```

#### PROCESS_FAILED

```python
def handle_PROCESS_FAILED(state: ProcessState, payload: dict) -> ProcessState:
    """Mark process as failed with error details."""

    state.status = 'FAILED'
    state.failed_at = payload['timestamp']
    state.error = {
        'type': payload['error_type'],
        'message': payload['error_message'],
        'stack_trace': payload.get('stack_trace')
    }

    return state
```

### Artifact Lifecycle Handlers

#### ARTIFACT_CREATED

```python
def handle_ARTIFACT_CREATED(state: ProcessState, payload: dict) -> ProcessState:
    """Add new artifact to state."""

    artifact = {
        'id': payload['artifact_id'],
        'type': payload['artifact_type'],
        'status': 'CREATED',
        'created_by': payload['created_by'],
        'created_at': payload['timestamp'],
        'version': '1.0.0',
        'file_path': payload['file_path'],
        'parent': payload.get('parent_artifact')
    }

    state.artifacts.append(artifact)

    # Update artifact registry
    state.artifact_registry[artifact['id']] = artifact

    return state
```

#### ARTIFACT_UPDATED

```python
def handle_ARTIFACT_UPDATED(state: ProcessState, payload: dict) -> ProcessState:
    """Update artifact version and mark children STALE."""

    artifact_id = payload['artifact_id']
    artifact = state.artifact_registry.get(artifact_id)

    if artifact is None:
        log_warning(f"Artifact {artifact_id} not found for update")
        return state

    # Update version
    artifact['version'] = payload['version_after']
    artifact['updated_at'] = payload['timestamp']
    artifact['updated_by'] = payload['updated_by']

    # Cascade STALE to children
    children = find_children(state, artifact_id)
    for child in children:
        if child['status'] != 'COMMITTED_PINNED':
            child['status'] = 'STALE'

    return state
```

### Gate Handlers

#### GATE_PASSED

```python
def handle_GATE_PASSED(state: ProcessState, payload: dict) -> ProcessState:
    """Record gate passage."""

    gate_record = {
        'gate_id': payload['gate_id'],
        'gate_name': payload['gate_name'],
        'passed_at': payload['timestamp'],
        'checklist_items': payload['checklist_items']
    }

    state.gates_passed.append(gate_record)

    # Update current phase (if gate transitions phases)
    if 'next_phase' in payload:
        state.current_phase = payload['next_phase']

    return state
```

#### GATE_FAILED

```python
def handle_GATE_FAILED(state: ProcessState, payload: dict) -> ProcessState:
    """Record gate failure and HALT status."""

    state.status = 'HALTED'
    state.halt_reason = f"Gate {payload['gate_id']} failed"
    state.failed_gate = {
        'gate_id': payload['gate_id'],
        'gate_name': payload['gate_name'],
        'failed_items': payload['failed_items']
    }

    return state
```

---

## PERFORMANCE OPTIMIZATIONS

### 1. Snapshot Distance Limit

```python
# In reconstruct_state():
events_to_replay = target_sequence - start_sequence

if events_to_replay > 100:
    log_warning(f"Replaying {events_to_replay} events (>100, consider more frequent snapshots)")
```

**Rationale:** Max 100 events to replay ensures <100ms reconstruction time.

### 2. Event Index (B-tree)

```python
# Create index on event_sequence for O(log N) lookup
CREATE INDEX idx_event_sequence ON events(event_sequence)
```

### 3. State Caching

```python
# Cache reconstructed state for 30 seconds
state_cache = {}

def get_current_state():
    cache_key = "current_state"

    if cache_key in state_cache:
        cached_state, cached_at = state_cache[cache_key]

        if time.now() - cached_at < 30:  # 30s TTL
            return cached_state

    # Cache miss - reconstruct
    state = reconstruct_state(get_latest_event_sequence())
    state_cache[cache_key] = (state, time.now())

    return state
```

---

## ERROR HANDLING

### Error Types

1. **HashChainBrokenError**: Hash chain integrity violated
2. **SequenceGapError**: Missing event sequences
3. **CorruptionError**: Event data corrupted
4. **SnapshotNotFoundError**: No snapshot when needed

### Recovery Strategy

```python
def safe_reconstruct_state(target_sequence: int) -> ProcessState:
    """
    Reconstruct state with error recovery.

    Recovery strategy:
    1. Try normal reconstruction
    2. If hash chain broken: rollback to last valid snapshot
    3. If snapshot corrupted: use older snapshot
    4. If all fail: restore from backup
    """

    try:
        return reconstruct_state(target_sequence)

    except HashChainBrokenError as e:
        log_error(f"Hash chain broken: {e}")

        # Strategy 1: Rollback to last valid snapshot
        last_valid_snapshot = find_last_valid_snapshot()
        if last_valid_snapshot:
            return load_snapshot(last_valid_snapshot)

    except CorruptionError as e:
        log_error(f"Corruption detected: {e}")

        # Strategy 2: Restore from backup
        return restore_from_backup()

    except Exception as e:
        log_critical(f"Unhandled error: {e}")
        raise
```

---

## EXAMPLES

### Example 1: Reconstruct from Recent Snapshot

```python
# Scenario: 450 events total, last snapshot at 400

state = reconstruct_state(target_sequence=450)

# Steps:
# 1. Find snapshot at sequence 400
# 2. Load snapshot (state at event 400)
# 3. Replay events 401-450 (50 events)
# 4. Return state at event 450

# Time: ~50ms (1ms per event)
```

### Example 2: Cold Start (No Snapshot)

```python
# Scenario: 150 events total, no snapshot

state = reconstruct_state(target_sequence=150)

# Steps:
# 1. No snapshot found
# 2. Initialize empty state
# 3. Replay events 1-150 (150 events)
# 4. Return state at event 150

# Time: ~150ms (1ms per event)
# WARNING: Should create snapshot at event 100!
```

### Example 3: Recover from Corruption

```python
# Scenario: Event 425 corrupted (hash mismatch)

try:
    state = reconstruct_state(target_sequence=450)
except HashChainBrokenError:
    # Detected corruption at event 425
    # Rollback to snapshot 400
    state = load_snapshot(find_snapshot_at(400))
    # Continue with state at event 400
    # Events 401-450 lost (need manual recovery)
```

---

## VALIDATION TESTS

### Test 1: Deterministic Replay

```python
def test_deterministic_replay():
    """Same events should produce same state (always)."""

    state1 = reconstruct_state(100)
    state2 = reconstruct_state(100)

    assert state1 == state2, "Replay not deterministic!"
```

### Test 2: Snapshot Consistency

```python
def test_snapshot_consistency():
    """Snapshot must match replayed state."""

    # Create snapshot at event 100
    create_snapshot(100)
    snapshot_state = load_snapshot(find_snapshot_at(100))

    # Replay from scratch
    replayed_state = reconstruct_state(100)

    assert snapshot_state == replayed_state, "Snapshot inconsistent!"
```

### Test 3: Corruption Detection

```python
def test_corruption_detection():
    """Corrupted events should be detected."""

    # Corrupt event 50 (modify hash)
    corrupt_event(50)

    # Should raise error
    with pytest.raises(HashChainBrokenError):
        reconstruct_state(100)
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Implement `reconstruct_state()` main function
- [ ] Implement all 17 event handlers
- [ ] Create snapshot index structure
- [ ] Implement hash chain validation
- [ ] Add error recovery (rollback, restore)
- [ ] Performance optimization (caching, indexing)
- [ ] Write unit tests (determinism, consistency, corruption)
- [ ] Integration test with real event log
- [ ] Benchmark performance (should be <100ms)
- [ ] Document failure scenarios and recovery

---

**END OF DOCUMENT**

For questions or clarifications, refer to:
- `event-sourcing-architecture.yaml` (high-level design)
- `event-log-schema.yaml` (event format)
