---
step: 3
name: "Template Analysis"
state: "STATE_TEMPLATE_ANALYSIS"
time_estimate: "3-8 minutes"
goal: "Decompose custom template into sections, generate embeddings, compute dependency closure (prevents sparse planning)"
requires_completion: true
next_steps: ["step-04-detection.md"]
data_dependencies: ["process-state.yaml::configuration.templates.selected"]
outputs: ["template-decomposition.yaml", "dependency-closure.yaml"]
---

# STATE_TEMPLATE_ANALYSIS

**Input:** Template file (BUILT_IN or CUSTOM path from process-state.yaml)
**Output:** template-decomposition.yaml, dependency-closure.yaml
**NEW in V7:** Prevents sparse planning via semantic matching (GP-15)

## ENFORCED SEQUENCE

### STEP 1: LOAD_TEMPLATE
Based on configuration.templates.mode:
- **AUTO_DETECT:** Select template based on domain-ontology.yaml entity types (aws-cdk → infrastructure, react → frontend, express → backend)
- **BUILT_IN:** Load from data/templates/v7-standard-template.md
- **CUSTOM:** Load from configuration.templates.custom_path

### STEP 2: ASSUMPTIONS_DECLARED ← REQUIRED
```yaml
assumptions:
  - "Template sections identified by H2 headings (##)"
  - "Semantic embeddings use text-embedding-004 or equivalent (768 dimensions)"
  - "Min coverage ratio: 0.90 (90% sections must match ontology)"
  - "Dependency resolution via Method #159 (O(N³) transitive closure)"
  - "Typical template size: 30-50 sections"
```

### STEP 3: PARSE_TEMPLATE
Execute:
1. Extract all H2 headings as section_titles
2. For each section:
   - Assign section_id (sequential: S001, S002, ...)
   - Determine section_level (H2=1, H3=2, etc.)
   - Identify parent_section_id (nesting)
   - Classify content_type (prose|table|list|code|diagram|mixed)
   - Assign priority (CRITICAL|HIGH|MEDIUM|LOW based on keywords)

Output format:
```yaml
RAW EXTRACTION for template-decomposition (parse):
total_sections: <count>
section_sample_3:
  - section_id: S001
    section_title: "<title>"
    section_level: 1
    priority: CRITICAL
  - section_id: S002
    section_title: "<title>"
    section_level: 2
    priority: HIGH
  - section_id: S003
    section_title: "<title>"
    section_level: 1
    priority: MEDIUM

[EXTRACT_COMPLETE for template-decomposition (parse)]
```

### STEP 4: GENERATE_EMBEDDINGS
For each section:
1. Concatenate section_title + first_paragraph (if exists)
2. Call embedding API (e.g., OpenAI text-embedding-004)
3. Store embedding_vector (768 dimensions)
4. Normalize vector (L2 norm = 1.0)
5. Verify embedding_quality >= 0.95

### STEP 5: MAP_DEPENDENCIES
1. Analyze section content for cross-references
2. Build dependency graph:
   - Section A mentions Section B → A depends_on B (soft)
   - Section A requires Section B data → A depends_on B (hard)
3. Compute transitive closure using Method #159:
   ```
   closure = {}
   for each section S:
     closure[S] = direct_dependencies(S)
     for each dependency D in closure[S]:
       closure[S].union(closure[D])  # transitive
   ```
4. Verify no circular dependencies
5. Timeout: 600000ms (10 minutes) per config.yaml

### STEP 6: IDENTIFY_COVERAGE
1. Mark critical_sections (priority = CRITICAL)
2. Mark optional_sections (priority = LOW)
3. Calculate min_coverage_ratio = 0.90

### STEP 7: VERIFY
Execute:
1. Method #168 Phantom Hunt: verify all section_ids unique
2. Method #84 Coherence: verify parent_section_ids reference existing sections
3. Verify all embeddings normalized (L2 norm = 1.0)
4. Verify transitive closure complete (no orphaned dependencies)

Output format:
```yaml
VERIFICATION RESULTS for template-decomposition:
- section_ids_unique: PASS/FAIL
- parent_refs_valid: PASS/FAIL
- embeddings_normalized: PASS/FAIL
- closure_complete: PASS/FAIL

[VERIFY_COMPLETE for template-decomposition]
```

### STEP 8: RENDER (template-decomposition.yaml)
Output format:
```yaml
FINAL OUTPUT for template-decomposition:
total_sections: <count>
critical_sections: <count>
section_sample_3:
  - section_id: S001
    section_title: "<title>"
    embedding_vector: [768 dimensions]
  - section_id: S002
    ...
  - section_id: S003
    ...

[RENDER_COMPLETE for template-decomposition]
```

Write deep-artifacts/template-decomposition.yaml per schema

### STEP 9: SEMANTIC_MATCHING
Execute:
1. Load domain-ontology.yaml entities
2. For each entity, generate embedding from name + type
3. For each template section, compute cosine similarity with all entities:
   ```
   similarity = dot(section_embedding, entity_embedding)
   ```
4. IF similarity >= 0.90 → MATCH (store in dependency-closure.yaml)
5. IF similarity < 0.90 → UNMATCHED (log reason)

Output format:
```yaml
RAW EXTRACTION for dependency-closure (semantic matching):
total_sections: <count>
matched_sections: <count>
unmatched_sections: <count>
match_sample_3:
  - section_id: S001
    matched_entity: "<entity_name>"
    similarity: 0.95
  - section_id: S002
    matched_entity: "<entity_name>"
    similarity: 0.92
  - section_id: S003
    matched_entity: NONE
    similarity: 0.78

[EXTRACT_COMPLETE for dependency-closure (matching)]
```

### STEP 10: COMPUTE_COVERAGE
Execute:
```
coverage_ratio = matched_sections / total_critical_sections
```
Must be >= 0.90 per GP-15

Output format:
```yaml
VERIFICATION RESULTS for dependency-closure:
- coverage_ratio: <0.0-1.0> (BLOCKER if <0.90)
- matched_sections: <count>
- total_critical_sections: <count>

[VERIFY_COMPLETE for dependency-closure]
```

### STEP 11: RENDER (dependency-closure.yaml)
Output format:
```yaml
FINAL OUTPUT for dependency-closure:
coverage_ratio: <ratio>
total_matches: <count>
unmatched_sections: [<section_ids>]

[RENDER_COMPLETE for dependency-closure]
```

Write deep-artifacts/dependency-closure.yaml per schema

### STEP 12: COUNTER-CHECKS ← REQUIRED
- **CC1 (Method #85 Grounding):** Sample 3 matched sections, verify entities exist in ontology → BLOCKER if fail
- **CC2 (Method #168 Phantom):** Check for phantom matches (sections matched to non-existent entities) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify coverage_ratio calculation: matched / total == reported ratio → ERROR if mismatch

### STEP 13: CHECKLIST (GATE_TA) ← BINDING
```
[ ] GTA-01: template-decomposition.yaml exists (BLOCKER)
[ ] GTA-02: All template sections enumerated - 100% (BLOCKER)
[ ] GTA-03: Embeddings generated for all sections (CRITICAL)
[ ] GTA-04: Dependency closure computed (ERROR)
[ ] GTA-05: Semantic matching executed (CRITICAL)
[ ] GTA-06: Coverage ratio ≥0.90 (BLOCKER)
[ ] GTA-07: dependency-closure.yaml exists (BLOCKER)
[ ] GTA-08: No phantom matches (BLOCKER)
[ ] GTA-09: Counter-checks executed (ERROR)
[ ] GTA-10: Analysis version incremented (WARNING)
```

### STEP 14: TRANSITION
- IF all BLOCKER/CRITICAL conditions PASS → STATE_DETECTION
- IF any BLOCKER/CRITICAL FAIL → STATE_ERROR

---

## SCHEMAS

### template-decomposition.yaml
```yaml
metadata:
  version: "7.0.0"
  analysis_timestamp: <ISO8601>
  template_source: <BUILT_IN|CUSTOM|AUTO_DETECT>
  template_path: <path>
  total_sections: <count>

sections:
  - section_id: S001
    section_title: "<title>"
    section_level: 1
    parent_section_id: null
    content_type: "prose"
    priority: CRITICAL
    embedding_vector: [768 floats]
    dependencies: [S002, S003]

assumptions: [<list>]
```

### dependency-closure.yaml
```yaml
metadata:
  version: "7.0.0"
  matching_timestamp: <ISO8601>
  coverage_ratio: <0.0-1.0>

matches:
  - section_id: S001
    matched_entity: "<entity_name>"
    similarity: 0.95

unmatched_sections:
  - section_id: S003
    reason: "No ontology entity with similarity ≥0.90"

counter_check_results:
  - check_id: CC1_grounding
    status: PASS
  - check_id: CC2_phantom
    status: PASS
  - check_id: CC3_coherence
    status: PASS
```

---

**ROI:** 8x token economy (5% investment prevents 40% waste from sparse planning per ADR-007)
