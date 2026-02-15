# Step 06: EXTEND (Instance Self-Extension)

Reference: SPECIFICATION.md Section 5, Phase 6

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXTEND ≠ SPAWN NEW INSTANCE                                                │
│  EXTEND = ADD ARTIFACT TO CURRENT INSTANCE                                  │
│                                                                             │
│  When {parent_artifact} commits → Instance can extend with child artifacts  │
│  All artifacts remain WITHIN the same instance                              │
│                                                                             │
│  Artifact types are GENERIC — defined by process, not framework             │
│                                                                             │
│  Reference: SPECIFICATION.md Section 2.3                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Trigger Conditions

This step executes when:

1. **User-triggered:** User invokes "Add [artifact_type]" (e.g., "Add Epic", "Add Story")
2. **Auto-triggered:** Artifact commits AND `self_extension.auto_extend = true`

**Prerequisites:**
- Instance has `self_extension.enabled = true` in `process.yaml`
- Requested artifact type is in `extensible_artifacts`
- Parent artifact (if specified) can contain requested type

## Execution Protocol

### 1. Validate Extension Request

```yaml
EXTENSION REQUEST:
  instance_id: {current_instance}      # The instance being extended
  parent_artifact: {parent_dp_id}      # Parent artifact (or null for root level)
  new_artifact_type: {type}            # Any type defined by the process

CHECK process.yaml:
  □ self_extension.enabled = true?
  □ new_artifact_type IN extensible_artifacts?
  □ IF parent_artifact specified:
      □ parent_artifact.artifact_type.can_contain includes new_artifact_type?

IF all true → CONTINUE
ELSE → ERROR: "Cannot add {type} to this instance/parent"
```

**Error Responses:**

| Condition | Error |
|-----------|-------|
| self_extension.enabled = false | "This process does not support self-extension" |
| type not in extensible_artifacts | "Artifact type '{type}' is not extensible in this process" |
| parent cannot contain type | "Cannot add {type} under {parent_type}" |
| max_depth exceeded | "Maximum artifact depth ({N}) reached" |

### 2. Load Extension Configuration

```yaml
LOAD from process.yaml:
  extensible_artifacts:
    - artifact_type: "{REQUESTED_TYPE}"
      depth_level: {N}
      can_contain: ["{CHILD_TYPES}"]
      template: "templates/{type}-template.md"
      context_inheritance:
        - parent_name: "$.parent.content.name"
        - parent_id: "$.parent.dp_id"

  artifact_hierarchy:
    max_depth: {N}
    depth_labels: ["{L0}", "{L1}", "{L2}", "{L3}"]

  aggregation:
    strategy: "{ALL_ARTIFACTS | ANY_ARTIFACT | N_OF_M | MANUAL}"
    incomplete_artifact_blocks_parent: {true | false}
```

### 3. Compute Artifact Context

Context flows from parent artifact to child artifact (within same instance):

```yaml
PARENT ARTIFACT (within instance):
  dp_id: {parent_dp_id}
  content:
    name: {parent_name}
    description: {parent_description}
  context: {parent_context}

NEW ARTIFACT CONTEXT (computed):
  # Apply context_inheritance mappings
  FOR each mapping in context_inheritance:
    new_context[key] = evaluate(parent_artifact, mapping.value)

  # Add standard context
  ADD:
    instance_id: {current_instance}      # Same instance!
    parent_artifact_id: {parent_dp_id}
    depth_level: parent.depth + 1
    depth_label: artifact_hierarchy.depth_labels[depth_level]
```

### 4. Generate Artifact ID

```yaml
ID GENERATION:
  pattern: "{ARTIFACT_TYPE}-{context}-{sequence}"

  components:
    ARTIFACT_TYPE: uppercase type name
    context: sanitized parent name or instance context
    sequence: 3-digit incrementing number

  examples:
    - "EPIC-AUTH-001"
    - "STORY-LOGIN-001"
    - "TASK-VALIDATE-002"
```

### 5. Create New Artifact File

```yaml
FILE CREATION:
  path: artifacts/processes/{instance_id}/{parent_folder}/{artifact_name}.md

  folder_structure:
    depth_0: artifacts/processes/{instance_id}/{artifact}.md
    depth_1: artifacts/processes/{instance_id}/{group}/{artifact}.md
    depth_2: artifacts/processes/{instance_id}/{group}/{subgroup}/{artifact}.md

  template: load from process.yaml extensible_artifacts[].template
```

**Artifact YAML Header:**

```yaml
---
dp_id: "{generated_id}"
dp_type: "artifact"
dp_status: "NOW"
version: "3.7"

# Artifact hierarchy (within instance)
artifact_type: "{new_artifact_type}"
parent_artifact: "{parent_dp_id}"      # Parent ARTIFACT, not instance
instance_id: "{current_instance}"      # Same instance!
depth_level: {computed_depth}

# Context inherited from parent
context:
  instance_id: "{current_instance}"
  parent_artifact_id: "{parent_dp_id}"
  {inherited_context_fields}

# Dependencies
depends_on:
  - path: "{parent_artifact_path}"
    type: "semantic_source"
    propagation_mode: "IMMEDIATE"

# Semantic hash (to be filled)
semantic_hash: []

# Transaction
transaction:
  saga_id: "{current_saga}"
---
```

### 6. Update State

```yaml
[UPDATE_STATE]
{
  "saga_id": "tx-XXXX",
  "operations": [
    {
      "type": "EXTEND",
      "instance_id": "{current_instance}",     # Same instance!
      "parent_artifact": "{parent_dp_id}",
      "new_artifact": "{new_dp_id}",
      "artifact_type": "{type}",
      "depth_level": {depth}
    },
    {
      "type": "CREATE",
      "target": "{new_dp_id}",
      "dp_type": "artifact",
      "dp_status": "NOW",
      "path": "{file_path}"
    },
    {
      "type": "ADD_EDGE",
      "from": "{parent_dp_id}",
      "to": "{new_dp_id}",
      "edge_type": "contains"                  # Artifact containment
    },
    {
      "type": "UPDATE",
      "target": "{parent_dp_id}",
      "field": "children",
      "operation": "append",
      "value": "{new_dp_id}"
    }
  ]
}
[/UPDATE_STATE]
```

### 7. Update Artifact Hierarchy

```yaml
UPDATE .deep-process/state.json OR .deep-process/artifact-hierarchy.json:

  artifact_tree["{new_dp_id}"]:
    dp_id: "{new_dp_id}"
    artifact_type: "{type}"
    depth: {depth}
    depth_label: "{label}"
    parent_artifact: "{parent_dp_id}"
    children: []
    file_path: "{relative_path}"
    status: "NOW"
    progress: 0

  artifact_tree["{parent_dp_id}"].children.append("{new_dp_id}")

  IF depth > max_depth_reached:
    max_depth_reached = depth

  total_artifacts += 1
  last_extended_at = NOW
```

### 8. Validate Depth

```yaml
CURRENT_DEPTH = parent_artifact.depth_level + 1

IF CURRENT_DEPTH > self_extension.artifact_hierarchy.max_depth:
  WARN: "Max artifact depth ({max}) reached"

  OPTIONS:
    [A] Override limit (requires explicit confirmation)
    [B] Restructure hierarchy
    [C] Cancel extension

  IF no override:
    ABORT extension
```

## Aggregation Logic

Instance completion depends on ALL contained artifacts:

```python
def check_instance_completion(instance_id):
    artifacts = state.artifact_tree.values()
    config = process.yaml.self_extension.aggregation

    if config.strategy == "ALL_ARTIFACTS":
        all_committed = all(
            a.status == "COMMITTED"
            for a in artifacts
        )
        if not all_committed and config.incomplete_artifact_blocks_parent:
            blocking = [a for a in artifacts if a.status != "COMMITTED"]
            return "BLOCKED", blocking
        if all_committed:
            return "COMPLETED", []

    elif config.strategy == "ANY_ARTIFACT":
        any_committed = any(
            a.status == "COMMITTED"
            for a in artifacts
        )
        if any_committed:
            return "COMPLETED", []

    elif config.strategy == "N_OF_M":
        committed_count = sum(
            1 for a in artifacts if a.status == "COMMITTED"
        )
        if committed_count >= config.n_required:
            return "COMPLETED", []

    return "IN_PROGRESS", []
```

## Display in SENSE

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.7                                              │
│  [Instancja: {instance-id}]                                     │
└─────────────────────────────────────────────────────────────────┘

Hierarchia artefaktów (wewnątrz instancji):
  📁 {instance-id} ──────────────────────────── {progress}%
     │
     ├── 📄 vision.md ───────────────────────── ✅ COMMITTED
     ├── 📄 scope.md ────────────────────────── ✅ COMMITTED
     │
     ├── 📁 epics/
     │   ├── 📄 epic-auth.md ────────────────── 60%
     │   │   ├── 📄 story-login.md ──────────── ✅ COMMITTED
     │   │   └── 📄 story-logout.md ─────────── 🔄 STALE
     │   └── 📄 epic-payment.md ─────────────── 30%
     │       └── 📄 story-checkout.md ───────── 🔄 NOW
     │
     └── 📄 constraints.md ──────────────────── ✅ COMMITTED

Wszystkie artefakty należą do tej samej instancji {instance-id}

[A] Dodaj artefakt    [U] Aktualizuj    [V] Waliduj    [H] Pomoc
```

## User Commands

| Command | Action |
|---------|--------|
| `[A]` Add artifact | Prompt for artifact type and parent |
| Add {type} | Add artifact of specific type to current context |
| Add {type} to {parent} | Add artifact under specific parent |

**Add Artifact Flow:**

```
1. User: [A] Dodaj artefakt

2. System:
   Dostępne typy artefaktów:
   [1] EPIC    - Epik (poziom 1)
   [2] STORY   - User Story (poziom 2)
   [3] TASK    - Zadanie (poziom 3)

   Wybierz typ: _

3. User: 1

4. System:
   Gdzie dodać EPIC?
   [1] Pod VISION-001 (root)
   [2] Pod SCOPE-001 (root)

   Wybierz rodzica: _

5. User: 1

6. System:
   Podaj nazwę: _

7. User: User Authentication

8. System:
   ✅ Utworzono EPIC-AUTH-001
   📁 artifacts/processes/{instance}/epics/epic-auth.md

   Artefakt czeka na wypełnienie (status: NOW)
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| MAX_DEPTH_EXCEEDED | New artifact would exceed max_depth | Restructure or override |
| INVALID_PARENT_TYPE | Parent artifact cannot contain this type | Choose correct parent |
| ARTIFACT_TYPE_NOT_EXTENSIBLE | Type not in extensible_artifacts | Update process.yaml |
| TEMPLATE_NOT_FOUND | Template for artifact type missing | Create template |
| INSTANCE_NOT_ACTIVE | Instance is not in RUNNING status | Activate instance first |
| PARENT_NOT_FOUND | Specified parent artifact doesn't exist | Check parent ID |

## Integration with Other Steps

| Step | Integration |
|------|-------------|
| step-01-sense.md | Displays artifact hierarchy |
| step-03-act.md | Generates artifact content |
| step-04-validate.md | Validates new artifact |
| step-05-sync.md | Triggers extension on commit |

## Methods Used

| Method | Purpose |
|--------|---------|
| #93 (DNA Inheritance) | Verify new artifact inherits system patterns |
| #95 (Structural Isomorphism) | Check consistency with existing artifacts |
| #99 (Multi-Artifact Coherence) | Verify references and naming |
| #100 (Vocabulary Consistency) | Standardize terminology |

## Notes

- Extension is typically **user-triggered**, not automatic
- All artifacts remain **within the same instance**
- Artifact types are **generic** — defined by each process
- Parent-child relationships are between **artifacts**, not instances
- Context inheritance ensures consistency across hierarchy
