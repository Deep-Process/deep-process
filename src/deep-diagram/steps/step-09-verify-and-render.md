---
step: 9
name: "Verify and Render"
time_estimate: "3-5 minutes"
goal: "Execute counter-checks, evaluate GATE_DIAG, write architectural-model.json"
requires_completion: true
next_steps: []
data_dependencies: ["components[]", "relationships[]", "diagrams[]", "coverage_assessment", "data/schemas/architectural-model.schema.yaml"]
outputs: ["architectural-model.json", "dependency-metrics.yaml"]
---

# STEP 9: VERIFY AND RENDER

**PRECONDITION:** Step 08 VERIFY_COVERAGE = PASS (coverage_ratio >= 0.90 or adjusted)

**Input:** components[], relationships[], diagrams[], coverage_assessment,
  all data accumulated from steps 01-08
**Output:** architectural-model.json, dependency-metrics.yaml

## ENFORCED SEQUENCE

### PHASE A: COUNTER-CHECKS

**CC1 (Method #85 Grounding Check):**
1. Sample 3 components randomly from components[]
2. For each sampled component:
   a. Verify source_segments references exist (file paths are real)
   b. Verify evidence_claim_ids exist in evidence_map
   c. Verify component_type matches entity type from ontology
3. Result:
   - IF all 3 verified -> CC1_PASS
   - IF >1 fails -> CC1_FAIL (BLOCKER: phantom components detected)

**CC2 (Method #168 Phantom Hunt + PD-UNIVERSAL):**
1. Scan ALL diagram mermaid_code for placeholder patterns:
   - "...", "TODO", "PLACEHOLDER", "[content]", "{{var}}", etc.
   - Use PD-UNIVERSAL pattern list (68+ patterns)
2. Scan ALL diagram component[] IDs:
   - Verify each component_id exists in components[] array
   - Any ID not in components[] = phantom reference
3. Scan ALL diagram relationship[] IDs:
   - Verify each relationship_id exists in relationships[] array
4. Result:
   - IF zero phantoms AND zero placeholders -> CC2_PASS
   - IF any detected -> CC2_FAIL (BLOCKER: phantom content in diagrams)

**CC3 (Method #84 Coherence Check):**
1. Verify delta math:
   - total_components == len(components[])
   - total_relationships == len(relationships[])
   - total_diagrams == len(diagrams[])
2. Verify all relationship source/target reference components[]:
   - For each relationship: source_component_id IN components[], target_component_id IN components[]
3. Verify all diagram component references:
   - For each diagram: all components[] entries exist in main components[] array
4. Result:
   - IF all checks pass -> CC3_PASS
   - IF any orphaned references -> CC3_FAIL (ERROR: coherence violation)

### PHASE B: GATE_DIAG EVALUATION

```
[ ] GD-01: architectural-model.json will be written (BLOCKER)
        Verify: all data available for rendering
[ ] GD-02: Diagrams generated per plan (BLOCKER)
        Verify: all diagram_plan[] entries have corresponding diagrams[]
        OR: SCOPE_REDUCTION logged for missing entries
[ ] GD-03: Each diagram has source evidence (CRITICAL)
        Verify: all diagram.relationships[] have evidence_claim_ids
[ ] GD-04: Diagram types appropriate (ERROR)
        Verify: diagram_type matches content (no sequence diagram for static components)
[ ] GD-05: No phantom diagrams (PD-UNIVERSAL) (BLOCKER)
        Verify: CC2 passed (no phantom content)
[ ] GD-06: Counter-checks executed (ERROR)
        Verify: CC1, CC2, CC3 all executed with logged results
[ ] GD-07: Version incremented (WARNING)
        Verify: metadata.version is set
[ ] GD-08: Delta math correct (ERROR)
        Verify: CC3 delta math passed (counts match)
[ ] GD-09: Coverage ratio >= 0.90 (CRITICAL)
        Verify: coverage_assessment.final_status == "PASS"
[ ] GD-10: Topology metrics computed (WARNING)
        Verify: all components have priority_score
```

**Gate evaluation:**
- IF any BLOCKER fails -> PROCESS FAILS (cannot write output)
- IF any CRITICAL fails -> WARNING to user, output may be incomplete
- IF any ERROR fails -> log warning, proceed
- IF any WARNING fails -> log only, proceed

### PHASE C: RENDER OUTPUT

**Render architectural-model.json:**

```json
{
  "metadata": {
    "synthesis_timestamp": "<ISO8601>",
    "version": "0.1.0",
    "process": "deep-diagram",
    "total_components": <count>,
    "total_relationships": <count>,
    "total_diagrams": <count>,
    "synthesis_duration_ms": <duration>
  },
  "components": [
    {
      "component_id": "CMP_001",
      "component_name": "UserService",
      "component_type": "service",
      "layer": "business",
      "source_segments": ["src/services/user.ts"],
      "evidence_claims": ["CLM_001", "CLM_015", "CLM_032"],
      "priority_score": {
        "in_degree": 12,
        "out_degree": 5,
        "total_degree": 17,
        "degree_centrality": 0.74,
        "is_high_priority": true
      }
    }
  ],
  "relationships": [
    {
      "relationship_id": "REL_001",
      "source_component_id": "CMP_001",
      "target_component_id": "CMP_005",
      "relationship_type": "calls",
      "evidence_claim_ids": ["CLM_003"]
    }
  ],
  "diagrams": [
    {
      "diagram_id": "DIAG_001",
      "diagram_type": "component",
      "title": "High-Level Architecture",
      "trigger_source": "topology_driven",
      "components": ["CMP_001", "CMP_002", "CMP_005"],
      "relationships": ["REL_001", "REL_002"],
      "mermaid_code": "graph TD\n  CMP_001[UserService] -->|calls| CMP_005[DatabaseRepository]\n  CMP_001 -->|publishes| CMP_002[EventBus]"
    }
  ],
  "topology_metrics": {
    "high_priority_components": [
      {
        "component_id": "CMP_001",
        "total_degree": 17,
        "degree_centrality": 0.74
      }
    ],
    "diagram_coverage": {
      "total_components": 45,
      "components_in_diagrams": 42,
      "coverage_ratio": 0.93
    },
    "priority_distribution": {
      "high_count": 9,
      "high_ratio": 0.20,
      "assessment": "NORMAL"
    }
  },
  "counter_checks": {
    "cc1_grounding": {
      "status": "PASS",
      "samples": 3,
      "verified": 3
    },
    "cc2_phantom_hunt": {
      "status": "PASS",
      "phantoms_found": 0,
      "placeholders_found": 0
    },
    "cc3_coherence": {
      "status": "PASS",
      "delta_math_valid": true,
      "orphaned_references": 0
    }
  },
  "gate_diag": {
    "gd_01": "PASS",
    "gd_02": "PASS",
    "gd_03": "PASS",
    "gd_04": "PASS",
    "gd_05": "PASS",
    "gd_06": "PASS",
    "gd_07": "PASS",
    "gd_08": "PASS",
    "gd_09": "PASS",
    "gd_10": "PASS"
  }
}
```

**Write file:**
1. Write architectural-model.json to output directory
2. Verify file was written successfully (Read back and check)

**Render dependency-metrics.yaml (secondary output):**

```yaml
metadata:
  generated_by: "deep-diagram v0.1.0"
  timestamp: <ISO8601>

component_metrics:
  - component_id: <id>
    component_name: <name>
    in_degree: <count>
    out_degree: <count>
    total_degree: <count>
    degree_centrality: <float>
    is_high_priority: <bool>

summary:
  total_components: <count>
  total_relationships: <count>
  max_degree: <count>
  avg_degree: <float>
  high_priority_count: <count>
  coverage_ratio: <float>
```

**Write file:**
1. Write dependency-metrics.yaml to output directory
2. Verify file was written successfully

### PHASE D: COMPLETION

IF all BLOCKER/CRITICAL gate conditions PASS:
```
OUTPUT: architectural-model.json written successfully
        dependency-metrics.yaml written successfully
        Total diagrams: <count>
        Coverage ratio: <ratio>
        High-priority components: <count>
        Counter-checks: CC1=PASS CC2=PASS CC3=PASS
        GATE_DIAG: ALL PASS
```

IF any BLOCKER gate condition FAILS:
```
ERROR: GATE_DIAG failed
       Failed conditions: <list>
       Counter-check results: CC1=<status> CC2=<status> CC3=<status>
       Action required: Fix issues and re-run from affected step
```

## VALIDATION

- architectural-model.json MUST exist after this step
- File MUST be valid JSON
- All required fields per schema MUST be present
- GATE_DIAG MUST have all conditions evaluated (no skipped conditions)
