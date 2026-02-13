---
step: 2
name: "Domain Ontology Extraction"
state: "STATE_ONTOLOGY_EXTRACTION"
time_estimate: "5-15 minutes"
goal: "Extract entities and relationships using Gemini API with batch processing"
requires_completion: true
next_steps: ["step-03-template.md"]
data_dependencies: ["repo_inventory.yaml"]
outputs: ["domain-ontology.yaml", "dependency-closure.yaml"]
---

# STATE_ONTOLOGY_EXTRACTION

**Input:** deep-artifacts/repo_inventory.yaml
**Output:** deep-artifacts/domain-ontology.yaml, deep-artifacts/dependency-closure.yaml
**NEW in V7:** L2 semantic understanding via entity extraction

## ENFORCED SEQUENCE

### STEP 1: LOAD_INVENTORY
Read repo_inventory.yaml, extract files[] array

### STEP 2: ASSUMPTIONS_DECLARED
```yaml
assumptions:
  - "Gemini API available with valid credentials"
  - "Gemini model: gemini-2.0-flash-exp or equivalent"
  - "Extraction confidence threshold: 0.95"
  - "Timeout: 120 seconds per API call"
  - "Code files prioritized over config files"
```

### STEP 3: PREPARE_BATCHES
**CRITICAL (C-01 FIX): Batch processing for COMPLETENESS**

1. Filter files to code files (exclude: .json, .yaml, .md, .txt)
2. Prioritize by file_type: .ts, .tsx, .js, .jsx, .py, .java
3. **BATCH SPLITTING (COMPLETENESS > TOKEN_ECONOMY):**
   ```python
   # Split filtered files into batches of 50
   batch_size = 50  # from config.yaml
   code_files = [f for f in files if f.type in prioritized_types]
   batches = []
   for i in range(0, len(code_files), batch_size):
       batch = code_files[i:i+batch_size]
       batches.append({
           'batch_id': i // batch_size,
           'files': batch,
           'file_count': len(batch)
       })
   total_batches = len(batches)
   ```
4. Log batch plan: `total_files={len(code_files)}, total_batches={total_batches}, batch_size=50`

### STEP 4: EXTRACT_BATCHES
**Loop over ALL batches (COMPLETENESS requirement)**

For **each batch** in batches:

#### STEP 4a: PREPARE_BATCH_CONTEXT
1. Read file contents for current batch (up to 50 files)
2. Concatenate into context string (max 100K tokens per batch)
3. If batch exceeds 100K tokens → split into sub-batches at file boundaries

#### STEP 4b: CALL_GEMINI_FOR_BATCH
Prompt:
```
Analyze this code batch (batch {batch_id}/{total_batches}) and extract domain ontology:

REQUIRED OUTPUT (JSON):
{
  "batch_metadata": {
    "batch_id": {batch_id},
    "files_in_batch": {file_count}
  },
  "entities": [
    {
      "id": "unique_id",
      "name": "EntityName",
      "type": "class|interface|type|enum|function|module",
      "source_files": ["path1", "path2"],
      "confidence": 0.95
    }
  ],
  "relationships": [
    {
      "id": "unique_id",
      "source_entity_id": "entity1",
      "target_entity_id": "entity2",
      "relationship_type": "uses|extends|implements|contains",
      "confidence": 0.95
    }
  ]
}

REQUIREMENTS:
1. Confidence >= 0.95 for all extractions
2. Source files must exist in provided file list
3. Entity IDs must be unique WITHIN this batch
4. Relationships may reference entities from previous batches (use entity name for cross-batch refs)

CODE BATCH {batch_id}:
<file contents>
```

Execute Gemini API call with timeout 120s

#### STEP 4c: STORE_BATCH_RESULTS
1. Parse JSON response
2. Store in temporary structure:
   ```python
   batch_results.append({
       'batch_id': batch_id,
       'entities': response['entities'],
       'relationships': response['relationships']
   })
   ```
3. Continue to next batch

#### STEP 4d: MERGE_ALL_BATCHES
**Purpose:** Combine results from ALL batches into single ontology

**Algorithm (5-step merge):**
```python
# Input: batch_results[] from STEP 4c
# Output: merged_entities[], merged_relationships[]

# STEP 1: Merge entities (deduplicate by name + source_file)
merged_entities = []
entity_map = {}  # {(name, source_file): merged_entity}

for batch in batch_results:
    for entity in batch['entities']:
        # Key for deduplication
        key = (entity['name'], tuple(sorted(entity['source_files'])))

        if key not in entity_map:
            # New entity - add to merged set
            entity_map[key] = entity
            merged_entities.append(entity)
        else:
            # Duplicate entity - merge confidence scores
            existing = entity_map[key]
            existing['confidence'] = max(existing['confidence'], entity['confidence'])

# STEP 2: Merge relationships (deduplicate by source + target + type)
merged_relationships = []
relationship_set = set()  # {(source, target, type)}

for batch in batch_results:
    for rel in batch['relationships']:
        key = (rel['source_entity_id'], rel['target_entity_id'], rel['relationship_type'])

        if key not in relationship_set:
            relationship_set.add(key)
            merged_relationships.append(rel)

# STEP 3: Reconcile cross-batch relationships
# Replace entity IDs with canonical IDs from merged_entities
id_mapping = {}  # {old_id: new_id}
for entity in merged_entities:
    id_mapping[entity['id']] = entity['id']  # canonical ID

for rel in merged_relationships:
    # If relationship references entity by name instead of ID (cross-batch)
    if rel['source_entity_id'] not in id_mapping:
        # Find entity by name
        for entity in merged_entities:
            if entity['name'] == rel['source_entity_id']:
                rel['source_entity_id'] = entity['id']
                break
    if rel['target_entity_id'] not in id_mapping:
        for entity in merged_entities:
            if entity['name'] == rel['target_entity_id']:
                rel['target_entity_id'] = entity['id']
                break

# STEP 4: Validate merge results
total_entities_before = sum(len(b['entities']) for b in batch_results)
total_entities_after = len(merged_entities)
deduplication_ratio = 1.0 - (total_entities_after / total_entities_before)

merge_statistics = {
    'total_batches': len(batch_results),
    'entities_before_merge': total_entities_before,
    'entities_after_merge': total_entities_after,
    'deduplication_ratio': deduplication_ratio,
    'relationships_merged': len(merged_relationships)
}

# STEP 5: Log merge summary
log(f"Batch merge complete: {total_entities_before} → {total_entities_after} entities ({deduplication_ratio:.1%} deduplicated)")
```

**Validation checks:**
- Verify deduplication_ratio in range 0.05-0.50 (expect 10-30% duplicates across batches)
- Verify all relationships reference valid entity IDs from merged_entities
- If deduplication_ratio >0.50 → log WARNING (excessive duplication)
- If deduplication_ratio <0.05 → log WARNING (insufficient overlap)

### STEP 5: VERIFY_MERGED_RESULTS
Execute:
1. Verify all merged_entities have confidence >= 0.95
2. Verify all source_files exist in repo_inventory
3. Verify entity IDs unique in merged_entities[]
4. Verify all relationships reference valid entity IDs
5. **Method #85 Grounding:** Sample 10 entities (or 10%), grep verify in source files
   - Calculate grounding_rate = verified_count / sampled_count
   - BLOCKER if grounding_rate <0.70 (phantom entities)
   - WARNING if grounding_rate <0.95 (low confidence)
6. Verify merge_statistics.deduplication_ratio in range 0.05-0.50
7. **Method #168 Phantom Hunt:** Scan for entities with non-existent source_files
   - BLOCKER if any phantom entities detected

### STEP 6: RENDER (domain-ontology.yaml)
Write deep-artifacts/domain-ontology.yaml:

```yaml
metadata:
  extraction_timestamp: <ISO8601>
  gemini_model: "gemini-2.0-flash-exp"
  total_entities: <count>
  total_relationships: <count>
  extraction_mode: "BATCH_PROCESSING"
  batch_metadata:
    total_batches: <count>
    batch_size: 50
    total_files_processed: <count>
    entities_before_merge: <count>
    entities_after_merge: <count>
    deduplication_ratio: <0.0-1.0>

entities: <merged_entities[]>

relationships: <merged_relationships[]>

quality_metrics:
  avg_confidence: <float>
  min_confidence: <float>
  extraction_completeness: <float>
  grounding_rate: <float>
  merge_integrity: <"PASS" if deduplication_ratio in 0.05-0.50>

assumptions: <from STEP 2>
```

### STEP 6A: COMPUTE_TRANSITIVE_CLOSURE
**Purpose:** Compute transitive dependencies (Method #159, ADR-015)

**Algorithm (Floyd-Warshall O(N³)):**
```python
# Input: entities[] with relationships[] from domain-ontology.yaml
# Output: entity_closures[] with transitive_dependencies

# Step 1: Build adjacency list (O(N))
adjacency = {}
for entity in entities:
    adjacency[entity.id] = []
for relationship in relationships:
    if relationship.type in ['depends_on', 'uses', 'extends', 'implements']:
        adjacency[relationship.source_entity_id].append(relationship.target_entity_id)

# Step 2: Initialize closure (O(N))
closure = {}
for entity_id in adjacency:
    closure[entity_id] = set(adjacency[entity_id])  # direct dependencies

# Step 3: Compute transitive closure (O(N³))
changed = True
iteration = 0
max_iterations = len(entities)  # prevent infinite loop

while changed and iteration < max_iterations:
    changed = False
    iteration += 1

    for entity_id in closure:
        # For each direct dependency, add its dependencies
        original_size = len(closure[entity_id])

        for dependency_id in list(closure[entity_id]):
            if dependency_id in closure:
                closure[entity_id] = closure[entity_id].union(closure[dependency_id])

        if len(closure[entity_id]) > original_size:
            changed = True

# Step 4: Detect cycles (O(N))
cycles_detected = []
for entity_id in closure:
    if entity_id in closure[entity_id]:
        cycles_detected.append(entity_id)
        closure[entity_id].remove(entity_id)  # break cycle

# Step 5: Store results
entity_closures = []
for entity_id in closure:
    entity_closures.append({
        'entity_id': entity_id,
        'direct_dependencies': list(adjacency[entity_id]),
        'transitive_dependencies': list(closure[entity_id])
    })
```

**Timeout:** 600000ms (10 minutes)
**Failure Handling:** If timeout, log ERROR and use direct dependencies only (SCOPE_REDUCTION)

### STEP 6B: CALCULATE_TOPOLOGY
**Purpose:** Calculate topology metrics for diagram detection (Method #90, ADR-016)

**Algorithm (O(N²) in-degree, O(N) others):**
```python
# Input: entity_closures[] from STEP 6A
# Output: topology_metrics{} per entity

# Step 1: Compute in-degree (O(N²))
in_degree = {}
for entity in entities:
    in_degree[entity.id] = 0

for entity in entities:
    for dependency_id in closure[entity.id]:
        in_degree[dependency_id] += 1

# Step 2: Compute out-degree (O(N))
out_degree = {}
for entity in entities:
    out_degree[entity.id] = len(closure[entity.id])

# Step 3: Compute centrality_score (O(N))
max_in_degree = max(in_degree.values()) if in_degree else 1
centrality_score = {}
for entity in entities:
    centrality_score[entity.id] = in_degree[entity.id] / max_in_degree if max_in_degree > 0 else 0.0

# Step 4: Classify complexity (O(N))
complexity_class = {}
high_threshold = 15  # from config.yaml
medium_threshold = 8  # from config.yaml

for entity in entities:
    total_degree = in_degree[entity.id] + out_degree[entity.id]
    if total_degree > high_threshold:
        complexity_class[entity.id] = "HIGH"
    elif total_degree > medium_threshold:
        complexity_class[entity.id] = "MEDIUM"
    else:
        complexity_class[entity.id] = "LOW"

# Step 5: Store topology metrics
for entity_closure in entity_closures:
    entity_id = entity_closure['entity_id']
    entity_closure['topology_metrics'] = {
        'in_degree': in_degree[entity_id],
        'out_degree': out_degree[entity_id],
        'centrality_score': centrality_score[entity_id],
        'complexity_class': complexity_class[entity_id]
    }

# Step 6: Identify diagram triggers (HIGH complexity entities)
diagram_triggers = []
for entity in entities:
    if complexity_class[entity.id] == "HIGH":
        diagram_triggers.append(entity.id)
```

### STEP 6C: RENDER (dependency-closure.yaml)
Write deep-artifacts/dependency-closure.yaml:

```yaml
metadata:
  closure_timestamp: <ISO8601>
  total_entities: <count>
  transitive_closure_iterations: <iteration_count>
  cycles_detected: <cycle_count>

entity_closures:
  - entity_id: <id>
    direct_dependencies: [<ids>]
    transitive_dependencies: [<ids>]
    topology_metrics:
      in_degree: <int>
      out_degree: <int>
      centrality_score: <float 0.0-1.0>
      complexity_class: <HIGH|MEDIUM|LOW>

dependency_matrix: {}  # for O(1) lookup (optional)

topology_summary:
  high_complexity: [<entity_ids>]
  medium_complexity: [<entity_ids>]
  low_complexity: [<entity_ids>]
  diagram_triggers: [<entity_ids>]

validation:
  closure_complete: true
  cycles_detected: [<entity_ids if any>]
  orphan_entities: []
```

**Validation:**
1. Verify closure_complete = true
2. If cycles_detected non-empty → log WARNING (circular dependencies)
3. Verify topology distribution: 5-30% HIGH complexity (GOE-10)
4. Verify all entity_ids reference entities from domain-ontology.yaml

### STEP 7: COUNTER-CHECKS
- **CC1 (Method #85 Grounding):** Sample 3 entities, verify source files exist and contain definitions → BLOCKER if >30% fail
- **CC2 (Method #168 Phantom):** Check for phantom entities (entities with source_files not in repo_inventory) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify all relationships reference valid entity IDs → ERROR if any orphaned

### STEP 8: GATE_OE
Evaluate all GOE-01 through GOE-10 conditions from gates.yaml:
```
[ ] GOE-01: domain-ontology.yaml exists (BLOCKER)
[ ] GOE-02: ≥5 entities extracted OR SCOPE_REDUCTION logged (BLOCKER)
[ ] GOE-03: Entity relationships mapped (CRITICAL)
[ ] GOE-04: Gemini confidence ≥0.95 OR limitation logged (WARNING)
[ ] GOE-05: ASSUMPTIONS_DECLARED (CRITICAL)
[ ] GOE-06: Grounding evidence provided (ERROR)
[ ] GOE-07: Counter-checks executed (ERROR)
[ ] GOE-08: Ontology version incremented (WARNING)
[ ] GOE-09: Batch merge integrity PASS (CRITICAL)
[ ] GOE-10: Entity grounding rate ≥70% (BLOCKER)
```

### STEP 9: TRANSITION
- IF GATE_OE PASS → return to orchestrator for STATE_TEMPLATE_ANALYSIS
- IF GATE_OE FAIL → return to orchestrator for STATE_ERROR
