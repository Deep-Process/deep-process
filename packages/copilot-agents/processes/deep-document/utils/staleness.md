# Staleness Propagation Algorithm
# Version: 7.1.0

## Purpose

Manage artifact staleness propagation when source artifacts change.
Three modes: FULL (transitive closure), QUALITY_ONLY (docs only), INCREMENTAL_VERIFY (direct only).

## Algorithm

```python
def propagate_staleness(changed_artifact, override=None):
    """
    Propagate staleness from changed_artifact to dependents.

    Args:
        changed_artifact: Name of artifact that changed (e.g., "repo_inventory.yaml")
        override: Optional override mode ("QUALITY_ONLY", "INCREMENTAL_VERIFY", or None)

    Returns:
        List of artifacts marked STALE
    """

    if override == "QUALITY_ONLY":
        # QUALITY MODE: Mark ONLY docs/*.md STALE
        # Does NOT cascade to evidence_map.yaml or architectural-model.json
        mark_stale(["docs/*.md"])
        log_decision("QUALITY_ONLY: no cascade to evidence/model")
        return ["docs/*.md"]

    if override == "INCREMENTAL_VERIFY":
        # INCREMENTAL MODE: Mark direct dependents STALE, stop cascade
        # Grandchildren remain FRESH
        direct_dependents = get_direct_dependents(changed_artifact)
        mark_stale([changed_artifact] + direct_dependents)
        log_decision("INCREMENTAL_VERIFY: direct only, no transitive")
        return [changed_artifact] + direct_dependents

    # FULL MODE: Mark ALL dependents STALE (transitive closure)
    all_dependents = compute_transitive_closure(changed_artifact)
    mark_stale([changed_artifact] + all_dependents)
    log_decision("Full transitive closure")
    return [changed_artifact] + all_dependents
```

## Execution Steps

1. **Determine override type** from execution_context.mode:
   - mode == "QUALITY" → override = "QUALITY_ONLY"
   - mode == "INCREMENTAL" → override = "INCREMENTAL_VERIFY"
   - mode == "FULL" → override = None

2. **Execute algorithm** (see pseudocode above)

3. **Update artifact registry** in process-state.yaml:
   ```yaml
   artifacts:
     - name: <artifact>
       status: STALE  # Changed from FRESH
       last_modified: <ISO8601>
   ```

4. **Log decision** in process-state.yaml:
   ```yaml
   decisions:
     - timestamp: <ISO8601>
       decision: "STALENESS_PROPAGATED"
       changed_artifact: <name>
       override: <type>
       marked_stale: [<list>]
   ```

## Dependency Graph

**Transitive closure computation:**
```python
def compute_transitive_closure(artifact):
    """
    Compute all artifacts that transitively depend on artifact.
    Uses DFS to find all reachable nodes in dependency graph.
    """
    visited = set()
    stack = [artifact]

    while stack:
        current = stack.pop()
        if current in visited:
            continue
        visited.add(current)

        # Get direct dependents from artifact registry
        dependents = get_dependents(current)
        stack.extend(dependents)

    return list(visited - {artifact})  # Exclude artifact itself
```

**Example dependency chains:**
- repo_inventory → detection-report → plan → coverage → evidence → model → docs
- plan → coverage → evidence (plan change cascades to evidence)
- model → docs (model change cascades to docs)

## Override Rationale

**QUALITY_ONLY (V6.2.1):**
- Quality amendment affects HOW docs written (prose structure)
- Does NOT affect WHAT documented (facts) or HOW modeled (diagrams)
- Token economy: docs regeneration = ~15% budget vs full evidence+diagrams = ~60%

**INCREMENTAL_VERIFY (V6.3.0):**
- Incremental mode supplements existing work (doesn't invalidate downstream)
- Example: repo_inventory modified → detection-report STALE, but plan remains FRESH
- Rationale: Plan already accounts for existing inventory (no need to replan)

**FULL (default):**
- Complete transitive cascade ensures consistency
- Used when base artifact changes fundamentally

## Dependencies

- artifact registry in process-state.yaml (for dependency graph)
- decisions[] array in process-state.yaml (for logging)

## Version

**staleness.md Version:** 7.1.0
**Compatible with:** workflow.md 7.1.0
