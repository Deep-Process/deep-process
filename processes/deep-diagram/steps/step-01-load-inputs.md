---
step: 1
name: "Load Inputs"
time_estimate: "1-2 minutes"
goal: "Load all required input artifacts and data files for diagram generation"
requires_completion: true
next_steps: ["step-02-declare-assumptions.md"]
data_dependencies: ["evidence_map.yaml", "documentation-plan.yaml", "domain-ontology.yaml", "data/patterns/diagram-triggers.yaml"]
outputs: []
---

# STEP 1: LOAD INPUTS

**Purpose:** Load and validate all required input artifacts before diagram generation begins.

## ENFORCED SEQUENCE

**ACTION 1: Load evidence_map.yaml**
1. Read evidence_map.yaml from input directory (deep-artifacts/ or provided path)
2. Extract all claims[] with type: relationship OR type: behavior
3. Store relationship_claims[] and behavior_claims[] separately
4. Count: total_claims, relationship_claims_count, behavior_claims_count
5. IF evidence_map.yaml does not exist -> BLOCKER: Cannot generate diagrams without evidence

**ACTION 2: Load documentation-plan.yaml**
1. Read documentation-plan.yaml from input directory
2. Extract diagram_plan[] array
3. For each planned diagram: record diagram_type, target_sections, trigger_id (if present)
4. Count: total_planned_diagrams
5. IF documentation-plan.yaml does not exist -> WARNING: Generate diagrams based on evidence only (no plan)
6. IF diagram_plan[] is empty -> WARNING: No diagrams planned, will generate based on topology

**ACTION 3: Load domain-ontology.yaml**
1. Read domain-ontology.yaml from input directory
2. Extract entities[] array with entity_id, name, type, file_path, relationships[]
3. Count: total_entities
4. IF domain-ontology.yaml does not exist -> BLOCKER: Cannot extract components without ontology

**ACTION 4: Load diagram-triggers.yaml**
1. Read data/patterns/diagram-triggers.yaml (from this process's data directory)
2. Extract trigger definitions with trigger_id, conditions, diagram_type, domain
3. Count: total_triggers
4. IF file does not exist -> WARNING: No domain-specific triggers, will use topology-driven generation only

**ACTION 5: Identify active domains**
1. Check if active_domains list was provided as input parameter
2. OR read from detection-report.yaml final_domains[] (if available)
3. OR default to empty list (topology-driven generation only, no domain triggers)
4. Count: total_active_domains

**ACTION 6: Validate inputs**
1. Verify relationship_claims_count > 0 (need relationships for diagrams)
2. Verify total_entities >= 2 (need at least 2 entities for a relationship)
3. Log input summary:
```yaml
input_summary:
  evidence_map:
    loaded: true|false
    total_claims: <count>
    relationship_claims: <count>
    behavior_claims: <count>
  documentation_plan:
    loaded: true|false
    planned_diagrams: <count>
  domain_ontology:
    loaded: true|false
    total_entities: <count>
  diagram_triggers:
    loaded: true|false
    total_triggers: <count>
  active_domains:
    count: <count>
    domains: [<list>]
```

## VALIDATION

- IF evidence_map missing -> BLOCKER
- IF domain-ontology missing -> BLOCKER
- IF relationship_claims_count == 0 -> CRITICAL (no relationships to diagram)
- IF total_entities < 2 -> CRITICAL (insufficient components)
- IF documentation-plan missing -> WARNING (proceed with topology-driven)
- IF diagram-triggers missing -> WARNING (proceed without domain triggers)
