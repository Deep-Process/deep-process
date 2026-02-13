# Artifact Registry Operations
# Version: 7.1.0

## Purpose

Manage artifact registry in process-state.yaml.
Track artifact status (FRESH/STALE/IN_PROGRESS/MISSING), hash, dependencies.

## When to Update

**After EVERY state completion.**

## Operations

### 1. Add/Update Artifact

**Steps:**
1. Read artifact file from output directory
2. Calculate hash_sha256
3. Update or add entry in artifacts[] array:

```yaml
artifacts:
  - name: <artifact_name>
    file_path: ./docs/deep-artifacts/<artifact_name>
    status: FRESH
    hash: <sha256>
    last_modified: <ISO8601>
    dependencies: [<list of artifacts this depends on>]
    dependents: [<list of artifacts that depend on this>]
```

4. Write updated process-state.yaml

### 2. Mark Artifact STALE

**Called by staleness propagation.**

Update status:
```yaml
artifacts:
  - name: <artifact_name>
    status: STALE  # Changed from FRESH
    last_modified: <ISO8601>
```

### 3. Mark Artifact IN_PROGRESS

**Called when state execution starts.**

Update status:
```yaml
artifacts:
  - name: <artifact_name>
    status: IN_PROGRESS
    last_modified: <ISO8601>
```

### 4. Calculate Hash

```python
import hashlib

def calculate_artifact_hash(file_path):
    """Calculate SHA-256 hash of artifact file."""
    with open(file_path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()
```

### 5. Get Dependencies

**From artifact registry:**
```python
def get_dependencies(artifact_name):
    """Get list of artifacts that artifact_name depends on."""
    registry = read_artifact_registry()
    for artifact in registry['artifacts']:
        if artifact['name'] == artifact_name:
            return artifact.get('dependencies', [])
    return []
```

### 6. Get Dependents

**From artifact registry:**
```python
def get_dependents(artifact_name):
    """Get list of artifacts that depend on artifact_name."""
    registry = read_artifact_registry()
    for artifact in registry['artifacts']:
        if artifact['name'] == artifact_name:
            return artifact.get('dependents', [])
    return []
```

## Artifact Status States

- **FRESH:** Artifact is up-to-date, no regeneration needed
- **STALE:** Source changed, artifact needs regeneration
- **IN_PROGRESS:** Currently being generated
- **MISSING:** Expected artifact not found in output directory

## Dependency Graph

**Key artifacts and their dependencies:**

```
repo_inventory.yaml
  ↓
detection-report.yaml (depends on repo_inventory)
  ↓
documentation-plan.yaml (depends on detection-report)
  ↓
coverage_map.yaml (depends on plan)
  ↓
evidence_map.yaml (depends on coverage)
  ↓
architectural-model.json (depends on evidence)
  ↓
docs/*.md (depends on model, evidence, plan)
```

## Example Entry

```yaml
artifacts:
  - name: repo_inventory.yaml
    file_path: ./docs/deep-artifacts/repo_inventory.yaml
    status: FRESH
    hash: a1b2c3d4e5f6...
    last_modified: 2026-02-11T10:30:00Z
    dependencies: []  # Root artifact
    dependents:
      - detection-report.yaml

  - name: documentation-plan.yaml
    file_path: ./docs/deep-artifacts/documentation-plan.yaml
    status: STALE
    hash: f6e5d4c3b2a1...
    last_modified: 2026-02-11T10:32:00Z
    dependencies:
      - detection-report.yaml
    dependents:
      - coverage_map.yaml
      - evidence_map.yaml
      - docs/index.md
```

## Dependencies

- process-state.yaml (artifact registry stored here)
- decisions[] array (for logging registry operations)

## Version

**artifact-registry.md Version:** 7.1.0
**Compatible with:** workflow.md 7.1.0
