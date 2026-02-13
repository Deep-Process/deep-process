---
step: 2
name: "TEMPLATE MAPPING"
time_estimate: "10-15 minutes"
goal: "Map extracted knowledge to template sections. Plan documentation structure and coverage."
requires_completion: true
next_steps: ["step-03-documentation"]
data_dependencies:
  - "preparation-report.yaml"
  - "knowledge-map.yaml"
outputs:
  - artifact: "documentation-plan.yaml"
    location: "deep-artifacts/documentation-plan.yaml"
    schema: "data/schemas/documentation-plan.schema.yaml"
    consumers: ["step-03-documentation", "step-04-verification"]
---

# PHASE 2: TEMPLATE MAPPING

## ENFORCED SEQUENCE

### STEP 1: Load Inputs (1 min)

**Actions:**
1. Read `preparation-report.yaml` → Extract `template_analysis.section_structure[]`
2. Read `knowledge-map.yaml` → Extract all 5 knowledge types
3. Count coverage:
   - Total template sections: N
   - Total knowledge items: M (execution flows + data flows + control flows + test files + config variables)

---

### STEP 2: Semantic Section-to-Knowledge Mapping (6-10 min)

**Actions:** Map knowledge items to template sections using semantic intent:

**2a. Load Semantic Intent (1 min)**
1. Read `preparation-report.yaml` → Extract `template_analysis.section_structure[].semantic_intent{}`
2. Read `knowledge-map.yaml` → Extract `entity_census{}` (from Phase 1 STEP 0)
3. For each section, note: purpose, depth, audience, entity_expectation

**2b. Intent-Driven Mapping (5-8 min)**

For EACH template section in `section_structure[]`:

1. **Select knowledge types based on PURPOSE:**

   | PURPOSE | Primary Knowledge Types | Secondary Knowledge Types |
   |---------|------------------------|--------------------------|
   | `explain` | execution_flows, control_flows | data_flows (for context) |
   | `reference` | data_flows, configuration_impact | execution_flows (for usage context) |
   | `guide` | configuration_impact, execution_flows | control_flows (for decision points) |
   | `catalog` | data_flows, execution_flows, configuration_impact | ALL types (exhaustive) |
   | `analyze` | test_coverage, control_flows | execution_flows (for coverage analysis) |

2. **Determine entity count based on ENTITY_EXPECTATION:**

   | ENTITY_EXPECTATION | Knowledge Item Selection Rule |
   |--------------------|-------------------------------|
   | `all` | Select ALL items of matching knowledge type. Cross-reference with entity_census. Count MUST match census. |
   | `primary` | Select items tagged as entry_points or core_domain in knowledge-map. Minimum 50% of census. |
   | `selective` | Select items matching section-specific criteria (e.g., auth-related for Security). Minimum 30% of census. |
   | `none` | No specific knowledge items required. Section uses narrative from other sources. |

   **CRITICAL RULE:** When entity_expectation = "all":
   - Agent MUST enumerate ALL knowledge items of matching type
   - Agent MUST cross-reference count against entity_census from Phase 1
   - IF mapped_items < entity_census.total for that type → MAPPING INCOMPLETE → must add missing items
   - Example: entity_census says 39 tables → data_flows mapping MUST include all 39 (D-001 through D-039)

3. **Prioritize critical entities (consumes priority_entities from Phase 1):**

   For ALL entity_expectation levels:
   - Load `priority_entities{}` from knowledge-map.yaml (produced in Phase 1 STEP 0)
   - **entity_expectation = "all":** Include ALL items (priority + standard). Priority entities already covered.
   - **entity_expectation = "primary":** FIRST include ALL `priority_entities.priority[]` matching section type. THEN add standard entities up to 50% threshold.
   - **entity_expectation = "selective":** FIRST include ALL `priority_entities.priority[]` matching section criteria (e.g., auth_functions for Security section). THEN add standard entities up to 30% threshold.
   - **entity_expectation = "none":** No entity mapping required.

   **CRITICAL RULE:** Priority entities (entry_points, auth_functions, error_handlers, core_domain) MUST appear in at least ONE section mapping. IF any priority entity appears in 0 sections → MAPPING INCOMPLETE.

4. **Determine narrative depth based on DEPTH:**

   | DEPTH | Narrative Approach | Estimated Length per Entity |
   |-------|-------------------|---------------------------|
   | `overview` | Summary paragraph, no code | 50-100 words/entity |
   | `standard` | Description + key properties | 100-200 words/entity |
   | `detailed` | Full description + code examples + relationships | 200-400 words/entity |
   | `deep-dive` | Implementation internals + edge cases + alternatives | 400-800 words/entity |

5. **Calculate estimated_length from entity count × depth:**
   ```
   estimated_length = mapped_items.count × words_per_entity[depth]
   Example: 39 tables × 200 words/table (standard depth) = 7,800 words
   ```

6. **Write mapping with full traceability:**
   - knowledge_sources[].items[] MUST list specific IDs (not "all flows")
   - coverage field MUST state fraction: "39/39 tables" (not "all entities")
   - entity_census_check MUST verify count matches census

**2c. Fallback for Unrecognized Sections (custom templates)**

For sections that don't match standard types:
1. Read section title + any template body text
2. Extract topic keywords from title (e.g., "Middleware Pipeline" → keywords: middleware, pipeline)
3. Search knowledge-map for matching entities by keyword:
   - Grep entity names for keyword matches
   - Grep file paths for keyword matches
   - Grep descriptions for keyword matches
4. Assign matching knowledge items with coverage note: "keyword-matched"
5. If 0 matches → mark as GAP in Step 3

**Output:**
```yaml
section_mappings:
  - section_id: "S-001"
    section_title: "Architecture Overview"
    section_level: 1
    template_location: "line 45-78"
    required: true
    semantic_intent:
      purpose: "explain"
      depth: "detailed"
      audience: "architect"
      entity_expectation: "all"
    knowledge_sources:
      - type: "execution_flows"
        items: ["F-001", "F-002", "F-003", "F-004", "F-005"]
        coverage: "5/5 execution flows (100%)"
      - type: "data_flows"
        items: ["D-001", "D-002", "D-003"]
        coverage: "3/39 tables (summary only — detail in Data Models)"
    entity_census_check:
      expected: 5  # execution_flows from census
      mapped: 5
      status: "COMPLETE"
    estimated_length: "1000-2000 words"  # 5 flows × 200-400 words (detailed)

  - section_id: "S-002"
    section_title: "Data Models"
    section_level: 1
    template_location: "line 120-180"
    required: true
    semantic_intent:
      purpose: "catalog"
      depth: "detailed"
      audience: "developer"
      entity_expectation: "all"
    knowledge_sources:
      - type: "data_flows"
        items: ["D-001", "D-002", "D-003", "D-004", "D-005", "D-006", "D-007",
                "D-008", "D-009", "D-010", "D-011", "D-012", "D-013", "D-014",
                "D-015", "D-016", "D-017", "D-018", "D-019", "D-020", "D-021",
                "D-022", "D-023", "D-024", "D-025", "D-026", "D-027", "D-028",
                "D-029", "D-030", "D-031", "D-032", "D-033", "D-034", "D-035",
                "D-036", "D-037", "D-038", "D-039"]
        coverage: "39/39 tables (100%)"
    entity_census_check:
      expected: 39  # tables from entity_census
      mapped: 39
      status: "COMPLETE"
    estimated_length: "7800-15600 words"  # 39 tables × 200-400 words (detailed)

  - section_id: "S-003"
    section_title: "API Reference"
    section_level: 1
    template_location: "line 200-350"
    required: true
    semantic_intent:
      purpose: "catalog"
      depth: "detailed"
      audience: "developer"
      entity_expectation: "all"
    knowledge_sources:
      - type: "execution_flows"
        items: ["F-001", "F-002", "F-003"]
        coverage: "3/3 HTTP flows (100%)"
      - type: "data_flows"
        items: ["D-001", "D-002", "D-003"]
        coverage: "3/3 request/response schemas"
    entity_census_check:
      expected: 3  # HTTP endpoints from census
      mapped: 3
      status: "COMPLETE"
    estimated_length: "1200-1800 words"
```

**Counter-Checks:**
1. **(Method #84 Coherence):** Verify no knowledge item used twice with contradictory narratives
2. **(Method #167 Baseline Census):** For EVERY section with entity_expectation="all", verify mapped_items.count == entity_census.total for that type. IF mismatch → MAPPING INCOMPLETE
3. **(Method #59 CUI BONO):** Check if any section with entity_expectation="all" has coverage < 100%. If yes → agent convenience bias detected → must add missing items

---

### STEP 2.5: Semantic Verification (2-3 min) [NEW - V8.1.0 Phase B]

**Purpose:** Prevent sparse planning by verifying that sections with `entity_expectation='all'` actually semantically match the knowledge types mapped.

**Context:** V7 evidence shows 30% sparse planning risk when keyword-only matching assigns wrong entity_expectation (e.g., "Service Layer" gets 'selective' instead of 'all'). Semantic matching prevents this failure mode.

**Actions:**

**2.5a. Load Semantic Matching Inputs (30 sec)**
1. Load `section_mappings[]` from STEP 2 output (not yet written to file, in memory)
2. Load `knowledge-map.yaml` → Extract `entity_census{}`
3. For each section with `entity_expectation='all'`, prepare for verification

**2.5b. Calculate Semantic Match Scores (1-2 min)**

FOR each section WHERE `semantic_intent.entity_expectation == 'all'`:

1. **Extract topic keywords from section:**
   ```
   keywords = extract_keywords(section_title + section_description)
   # Example: "Data Models" → keywords: [data, models, schema, table, entity]
   # Example: "API Reference" → keywords: [api, endpoint, request, response, method]
   # Example: "Database Design" → keywords: [database, table, schema, index, relation]
   ```

2. **Query knowledge-map for matching entities (FUZZY):**
   ```
   matching_entities = []

   FOR entity_type in ["execution_flows", "data_flows", "control_flows", "configuration"]:
     FOR entity in knowledge_map[entity_type]:
       # Fuzzy keyword matching
       entity_keywords = extract_keywords(entity.name + entity.description + entity.file_path)
       keyword_overlap = len(keywords ∩ entity_keywords) / len(keywords)

       IF keyword_overlap > 0:
         matching_entities.append({
           entity_id: entity.id,
           entity_type: entity_type,
           keyword_overlap: keyword_overlap
         })
   ```

3. **Calculate match_score:**
   ```
   # Determine expected entity type based on section type
   expected_type = infer_entity_type(section_title)
   # Example: "Data Models" → expected_type: "data_flows"
   # Example: "API Reference" → expected_type: "execution_flows"
   # Example: "Configuration" → expected_type: "configuration"

   # Get entities actually mapped in STEP 2
   mapped_entity_types = [source.type for source in section.knowledge_sources]

   # Calculate keyword overlap score
   keyword_overlap = len(keywords ∩ entity_names_in_mapped_types) / len(keywords)

   # Calculate entity type match score
   IF expected_type IN mapped_entity_types:
     entity_type_match = 1.0
   ELIF any_related_type IN mapped_entity_types:  # e.g., data_flows ~= configuration for DB configs
     entity_type_match = 0.5
   ELSE:
     entity_type_match = 0.0

   # Combined match score (weighted)
   match_score = (0.6 * keyword_overlap) + (0.4 * entity_type_match)
   ```

4. **Threshold check:**
   ```
   threshold = 0.60  # Match score threshold for entity_expectation='all'

   IF match_score < threshold:
     FLAG as POTENTIAL_MISMATCH
     potential_mismatches.append({
       section_id: section.id,
       section_title: section.title,
       entity_expectation: "all",
       match_score: match_score,
       keyword_overlap: keyword_overlap,
       entity_type_match: entity_type_match,
       recommendation: "Re-evaluate: semantic mismatch detected. Either declare SCOPE_REDUCTION, downgrade entity_expectation to 'primary'/'selective', or provide justification."
     })
   ```

**2.5c. High-Confidence Mismatch Detection (30 sec)**

1. **Detect critical mismatches:**
   ```
   critical_threshold = 0.40

   FOR mismatch in potential_mismatches:
     IF mismatch.match_score < critical_threshold:
       critical_mismatches.append(mismatch)
       # This is HIGH-CONFIDENCE mismatch (very likely wrong mapping)
   ```

2. **Require resolution:**
   - **match_score < 0.40:** HIGH-CONFIDENCE mismatch → MUST resolve (SCOPE_REDUCTION OR re-evaluate entity_expectation OR provide strong justification)
   - **match_score 0.40-0.60:** POTENTIAL mismatch → SHOULD resolve (SCOPE_REDUCTION OR justification)

**2.5d. Write Semantic Verification Results**

Add to `documentation-plan.yaml` (will be written in STEP 5):

**Output:**
```yaml
semantic_verification:
  sections_verified: 12  # Count of entity_expectation='all' sections
  mismatches_found: 2

  potential_mismatches:
    - section_id: "S-007"
      section_title: "Service Layer Architecture"
      entity_expectation: "all" # Assigned in Phase 0
      match_score: 0.45  # BELOW 0.60 threshold
      keyword_overlap: 0.50  # "service", "layer" matched
      entity_type_match: 0.40  # execution_flows partially matched
      recommendation: "Re-evaluate: title 'Service Layer' suggests selective (not all), but entity_expectation='all' assigned. Consider downgrading to 'primary' or provide SCOPE_REDUCTION justification."
      resolution: null  # To be filled by agent

    - section_id: "S-010"
      section_title: "Middleware Pipeline"
      entity_expectation: "all"
      match_score: 0.52
      keyword_overlap: 0.60
      entity_type_match: 0.40
      recommendation: "Borderline match. Verify that ALL middleware components are mapped (not just primary)."
      resolution: null

  critical_mismatches:
    - section_id: "S-012"
      section_title: "Error Handling Strategy"
      entity_expectation: "all"
      match_score: 0.35  # BELOW 0.40 critical threshold
      keyword_overlap: 0.30
      entity_type_match: 0.40
      recommendation: "HIGH-CONFIDENCE MISMATCH. Title suggests 'selective' (error-handling specific), not 'all'. Require SCOPE_REDUCTION OR downgrade entity_expectation."
      resolution: null  # MUST be filled (cannot proceed without resolution)

  verified_at: "2026-02-13T11:15:00Z"
```

**2.5e. Resolve Mismatches (REQUIRED before GATE_2)**

FOR each mismatch (potential + critical):

1. **Option 1: Declare SCOPE_REDUCTION**
   ```yaml
   resolution: "SCOPE_REDUCTION: Section title ambiguous, documenting only primary service components (not exhaustive)"
   ```

2. **Option 2: Downgrade entity_expectation**
   ```yaml
   resolution: "ENTITY_EXPECTATION_ADJUSTED: Changed from 'all' to 'primary' based on semantic analysis"
   # Update section_mappings[] to reflect new entity_expectation
   ```

3. **Option 3: Provide justification** (only for potential mismatches 0.40-0.60, NOT for critical < 0.40)
   ```yaml
   resolution: "JUSTIFIED: Match score borderline but section requires all middleware components per template requirement"
   ```

4. **Critical mismatches (< 0.40) CANNOT use Option 3** → Must use SCOPE_REDUCTION or downgrade entity_expectation

**GATE_2 Enforcement:**
- G2-09: No HIGH-CONFIDENCE mismatches (< 0.40) without resolution (SCOPE_REDUCTION or entity_expectation adjustment)
- G2-10: ALL potential mismatches (0.40-0.60) have resolution (SCOPE_REDUCTION OR adjustment OR justification)

**Counter-Checks:**

**CC4: Semantic Grounding (Method #85)**
```
Sample 3 random sections with entity_expectation='all'
FOR each:
  Recalculate match_score independently
  Verify match_score ≥ 0.60 OR resolution exists

PASS if all 3 samples grounded (match_score ≥ 0.60 OR valid resolution)
FAIL (ERROR) if any sample has match_score < 0.60 without resolution
```

**CC5: Threshold Coherence (Method #84)**
```
Verify threshold logic consistent:
  - match_score ≥ 0.60 AND no mismatch → PASS
  - match_score < 0.60 AND mismatch flagged → PASS
  - match_score < 0.60 AND no mismatch flagged → FAIL (threshold violation)

PASS if logic consistent across all sections
FAIL (ERROR) if any threshold violation found
```

**VIOLATION CHECK:** If agent proceeds with critical_mismatches[] unresolved → CRITICAL (GATE_2 blocks)

---

### STEP 3: Gap Identification (2-3 min)

**Actions:** Identify template sections with no knowledge sources:
1. For each template section:
   - IF `knowledge_sources[]` is empty → GAP
   - IF section is `required: true` → CRITICAL GAP
   - IF section is `required: false` → OPTIONAL GAP (acceptable)
2. For each gap:
   a. **Determine if fillable** - Can we derive knowledge from what we have?
   b. **Determine if reducible** - Can we declare SCOPE_REDUCTION for this section?
   c. **Determine if unknown** - Mark section as `[UNKNOWN]` in output?
3. Write to `documentation-plan.yaml` section: `gaps[]`

**Output:**
```yaml
gaps:
  - section_id: "S-008"
    section_title: "Performance Considerations"
    template_location: "line 450-480"
    required: false
    reason: "No performance benchmarks in repository"
    fillable: false
    action: "mark_unknown"
    impact: "low" # Optional section

  - section_id: "S-009"
    section_title: "Security"
    template_location: "line 500-550"
    required: true
    reason: "No security analysis in knowledge extraction"
    fillable: true # Can derive from control_flows (authorization decisions)
    action: "derive_from_control_flows"
    impact: "medium"
```

**CRITICAL:** If `required: true` section has gap AND `fillable: false` → Must declare SCOPE_REDUCTION or ABORT

**REASONING_DECLARATION** (Standard 10 — BINDING): For each gap, write reasoning for action chosen:
```yaml
gap_reasoning:
  section: "Performance Considerations"
  action: "mark_unknown"
  because: "No performance benchmarks found in repository (searched: tests/, benchmarks/, docs/). Section is optional (required: false)."
```
IF agent marks gap without gap_reasoning → **PROCESS VIOLATION** → Re-execute STEP 3.

---

### STEP 4: Coverage Calculation (1 min)

**Actions:**
1. Count sections:
   - `total_sections` = all sections in template
   - `covered_sections` = sections with `knowledge_sources[]` not empty
   - `gap_sections` = sections with empty `knowledge_sources[]`
   - `unknown_sections` = gaps marked with `action: "mark_unknown"`
2. Calculate coverage percentage:
   - `section_coverage = covered_sections / total_sections` (sections with knowledge sources)
   - `unknown_ratio = unknown_sections / total_sections` (sections marked [UNKNOWN])
   - Target: section_coverage ≥90% for GATE_2 to pass
   - **CRITICAL:** [UNKNOWN] sections do NOT count as covered. They represent gaps.
   - If unknown_ratio >10% → WARNING (too many unknowns)
3. Write to `documentation-plan.yaml` section: `coverage_summary{}`

**Output:**
```yaml
coverage_summary:
  total_sections: 12
  covered_sections: 10
  gap_sections: 2
  unknown_sections: 1
  section_coverage: 83.3 # 10 / 12 (only covered sections count)
  unknown_ratio: 8.3 # 1 / 12
  target: 90.0
  status: "FAIL" # section_coverage < target → need to fill gaps or declare SCOPE_REDUCTION
```

---

### STEP 5: Writing Order Planning (1-2 min)

**Actions:** Topological sort on section dependencies:
1. Identify dependencies:
   - "API Reference" depends on "Data Models" (needs schemas)
   - "Deployment" depends on "Architecture" (needs to understand what's deployed)
   - "Advanced Usage" depends on "Getting Started" (builds on basics)
2. Build dependency graph
3. Topological sort → writing order
4. Write to `documentation-plan.yaml` section: `writing_order[]`

**Output:**
```yaml
writing_order:
  - order: 1
    section_id: "S-001"
    section_title: "Architecture Overview"
    reason: "Foundation for all other sections"

  - order: 2
    section_id: "S-002"
    section_title: "Data Models"
    reason: "Needed by API Reference"

  - order: 3
    section_id: "S-003"
    section_title: "API Reference"
    reason: "Depends on Data Models"

  - order: 4
    section_id: "S-005"
    section_title: "Deployment"
    reason: "Depends on Architecture"
```

---

### STEP 6: Write Documentation Plan (1 min)

**Actions:**
1. Use Write tool to create `deep-artifacts/documentation-plan.yaml`
2. Include: section_mappings, gaps, coverage_summary, writing_order
3. Add metadata

**Output Schema:**
```yaml
version: "8.0.0"
phase: 2
phase_name: "TEMPLATE MAPPING"
generated_at: "2026-02-12T11:05:00Z"

section_mappings:
  # ... from STEP 2

gaps:
  # ... from STEP 3

coverage_summary:
  # ... from STEP 4

writing_order:
  # ... from STEP 5
```

---

### STEP 7: GATE_2 Evaluation

**Gate:** GATE_2 (TEMPLATE MAPPING COMPLETE)
**Severity:** CRITICAL

**Conditions:**
1. **G2-01:** All sections mapped (section_mappings[] covers all template sections)
2. **G2-02:** Gaps identified (gaps[] exists, all required gaps have action)
3. **G2-03:** Coverage threshold (coverage_summary.section_coverage ≥90%, [UNKNOWN] sections do NOT count as covered)
4. **G2-04:** Writing order planned (writing_order[] has topological order)
5. **G2-05:** All outputs written (documentation-plan.yaml exists)
6. **G2-06:** Entity census verification — for EVERY section with entity_expectation="all", verify `len(knowledge_sources[matching_type].items) == entity_census_check.expected`. Do NOT trust self-reported `status` field — count actual items array length. IF mapped_count < expected_count → GATE_2 LOCKED **[BLOCKER]**
7. **G2-07:** Semantic intent consumed — EVERY section_mapping has semantic_intent{} fields (purpose, depth, entity_expectation) carried from Phase 0 **[CRITICAL]**
8. **G2-08:** Priority entity coverage — EVERY entity in priority_entities.priority[] appears in at least ONE section_mapping.knowledge_sources[].items[]. IF any priority entity unmapped → GATE_2 LOCKED **[BLOCKER]**

**Evaluation:**
```
IF all 8 conditions pass → GATE_2 = OPEN → Proceed to Phase 3
IF G2-06 fails → GATE_2 = LOCKED (BLOCKER) → Must add missing knowledge items to section mappings
IF G2-07 fails → GATE_2 = LOCKED (CRITICAL) → Must add semantic_intent to all section mappings
IF G2-08 fails → GATE_2 = LOCKED (BLOCKER) → Must map priority entities to at least one section
IF any other condition fails → GATE_2 = LOCKED → SCOPE_REDUCTION_DECLARATION or ABORT
```

**Counter-Checks:**
1. Sample 3 section mappings → Verify knowledge items exist in knowledge-map.yaml
2. Verify writing_order has no circular dependencies (topological sort valid)
3. Verify required gaps have fillable=true OR SCOPE_REDUCTION declared
4. Sample 3 sections with entity_expectation="all" → Verify mapped count matches entity_census (Method #167)
5. Verify estimated_length is realistic: entity_count × words_per_entity[depth] (not artificially low)

---

## POST-PHASE CHECKLIST

After completing Phase 2, verify:

- [ ] All template sections mapped (section_mappings[] covers every section)
- [ ] Semantic intent consumed (every mapping has purpose, depth, entity_expectation from Phase 0)
- [ ] Entity census verified — sections with entity_expectation="all" have mapped_count == census_expected
- [ ] Priority entities mapped — every priority entity appears in at least one section
- [ ] Gaps identified with actions (gaps[] exists, all required gaps have fillable/scope_reduction)
- [ ] Gap reasoning declared (REASONING_DECLARATION for each gap action)
- [ ] Coverage ≥90% (section_coverage calculated, [UNKNOWN] does NOT count as covered)
- [ ] Writing order planned (topological sort, no circular dependencies)
- [ ] documentation-plan.yaml written
- [ ] GATE_2 evaluated (OPEN, all 8 conditions)
- [ ] Counter-checks passed (5/5)

**If checklist incomplete → Phase 2 not finished → Re-execute.**

---

## NEXT PHASE

After GATE_2 opens → Load `steps/step-03-documentation.md` → Begin Phase 3 (DOCUMENTATION)
