# State Transition Logic
# Version: 7.1.0

## Purpose

Manage FSM state transitions with gate validation.
Ensures only valid transitions occur based on gate evaluation.

## Validation Before Transition

**6-step process:**

### 1. Load Gate Definition

From data/gates.yaml for current_state:

```yaml
# Example: GATE_0 for STATE_INIT
gates:
  - name: GATE_0
    state: STATE_INIT
    conditions:
      - id: G0-01
        check: "repo_inventory.yaml exists"
        severity: CRITICAL
      - id: G0-02
        check: "file count > 0"
        severity: BLOCKER
```

### 2. Evaluate All Conditions

For each condition:
- Execute check (verify file exists, count elements, validate schema)
- Record result: PASS or FAIL
- Record severity: BLOCKER, CRITICAL, ERROR, WARNING

### 3. Determine Transition

**Gate evaluation logic:**
```python
def evaluate_gate(gate_results):
    """
    Determine if gate passes and next action.

    Returns:
        (pass: bool, action: str)
    """
    blockers = [r for r in gate_results if r['severity'] == 'BLOCKER' and not r['pass']]
    criticals = [r for r in gate_results if r['severity'] == 'CRITICAL' and not r['pass']]
    errors = [r for r in gate_results if r['severity'] == 'ERROR' and not r['pass']]
    warnings = [r for r in gate_results if r['severity'] == 'WARNING' and not r['pass']]

    if blockers:
        return (False, "HALT")  # Process halts, display error
    if criticals:
        return (False, "STATE_ERROR")  # Transition to error state
    if errors:
        return (True, "LOG_WARNING")  # Continue but log warning
    if warnings:
        return (True, "LOG_INFO")  # Continue, log info only
    return (True, "PROCEED")  # All pass, proceed normally
```

### 4. Load Transitions Map

From data/transitions.yaml:

```yaml
transitions:
  - from: STATE_INIT
    to: STATE_ONTOLOGY_EXTRACTION
    condition: "GATE_0 passes"
  - from: STATE_INIT
    to: STATE_ERROR
    condition: "GATE_0 CRITICAL fails"
```

### 5. Execute Transition

**Update process-state.yaml:**
```yaml
execution_context:
  current_state: <next_state>  # Changed from current
  previous_state: <current_state>
  mode: <FULL|INCREMENTAL|QUALITY>
```

### 6. Log Transition

**In decisions[] array:**
```yaml
decisions:
  - timestamp: <ISO8601>
    decision: "STATE_TRANSITION"
    from_state: <current_state>
    to_state: <next_state>
    gate: <gate_name>
    gate_result: <PASS|FAIL>
    failed_conditions: [<list if any>]
    action: <PROCEED|LOG_WARNING|STATE_ERROR|HALT>
```

## Execution Steps

**After gate validation passes:**

1. **Update current_state** in execution_context

2. **Log transition** in decisions[]

3. **Update lock** with next agent/state:
   ```yaml
   lock:
     agent: <next_step_file>
     acquired_timestamp: <ISO8601>
     state: <next_state>
   ```

4. **Delegate to next step** (workflow.md SCENARIO C routing)

## Forbidden Transitions

From data/transitions.yaml:

```yaml
forbidden_transitions:
  - from: STATE_COMPLETE
    to: STATE_INIT
    reason: "Cannot restart from complete without RESET"
  - from: STATE_ERROR
    to: STATE_COMPLETE
    reason: "Must resolve error first"
```

**Enforcement:**
- Before executing transition, check forbidden_transitions
- If match found → BLOCKER, halt process

## Allowed Transitions (V6.2.1+)

**Special transitions for completed projects:**

```yaml
allowed_transitions:
  - from: STATE_COMPLETE
    to: STATE_QUALITY_AMENDMENT
    condition: "user chooses AMEND_QUALITY"
  - from: STATE_COMPLETE
    to: STATE_INIT
    condition: "execution_context.mode == INCREMENTAL"
```

## Example Flow

```
STATE_INIT
  ↓ (GATE_0 passes)
STATE_ONTOLOGY_EXTRACTION
  ↓ (GATE_OE passes)
STATE_TEMPLATE_ANALYSIS
  ↓ (GATE_TA passes)
STATE_DETECTION
  ↓ (GATE_D passes)
STATE_PLANNING
  ↓ (GATE_P passes)
USER_REVIEW_PLAN
  ↓ (user APPROVE)
STATE_COVERAGE
  ↓ (GATE_1 passes)
...
STATE_COMPLETE
```

## Dependencies

- data/gates.yaml (gate definitions)
- data/transitions.yaml (transition map)
- process-state.yaml (execution_context, decisions[], lock)
- utils/lock.md (lock operations)

## Version

**transitions.md Version:** 7.1.0
**Compatible with:** workflow.md 7.1.0
