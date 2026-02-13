---
step: 3
name: "Extract Components"
time_estimate: "3-5 minutes"
goal: "Extract architectural components from ontology entities and evidence claims"
requires_completion: true
next_steps: ["step-04-extract-relationships.md"]
data_dependencies: ["domain-ontology.yaml", "evidence_map.yaml"]
outputs: ["components[] (in-memory)"]
---

# STEP 3: EXTRACT COMPONENTS

**PRECONDITION:** Step 02 ASSUMPTIONS_DECLARED = complete

**Input:** domain-ontology.yaml entities[], evidence_map.yaml claims[]
**Output:** components[] array (in-memory, written to file in step-09)

## ENFORCED SEQUENCE

**ACTION 1: Iterate over ontology entities**

For each entity in domain-ontology.yaml entities[]:

1. Create component entry with:
   - `component_id`: Sequential identifier (CMP_001, CMP_002, ...)
   - `component_name`: entity.name
   - `component_type`: Map entity.type to declared assumption component_types:
     - class -> class
     - interface -> interface
     - function -> function
     - module -> module
     - service -> service
     - configuration -> config
     - external dependency -> external
     - IF entity.type not in list -> log override, use closest match
   - `layer`: Classify based on entity source files and imports:
     - Files in routes/, controllers/, handlers/, pages/ -> presentation
     - Files in services/, domain/, core/, business/ -> business
     - Files in models/, repositories/, db/, data/ -> data
     - Files in infra/, cdk/, terraform/, deploy/ -> infrastructure
     - Files in integrations/, clients/, adapters/ -> integration
     - IF ambiguous -> use import analysis (what layer does it depend on most?)
   - `source_segments`: entity.file_path (link to source location)
   - `evidence_claims`: Find all claims in evidence_map that reference this entity
     - Match by entity.name in claim_text
     - Match by entity.file_path in claim citations
     - Store as list of claim_ids

**ACTION 2: Validate component extraction**

For each component:
1. Verify component_id is unique
2. Verify source_segments is non-empty (grounding)
3. Verify evidence_claims is non-empty (at least 1 claim backs this component)
4. IF evidence_claims is empty -> flag as UNGROUNDED_COMPONENT

**ACTION 3: Handle ungrounded components**

For components with empty evidence_claims[]:
1. IF component is from ontology (entity extraction) -> keep but mark as "low_confidence"
2. IF component has no source_segments -> REMOVE (phantom component)
3. Log ungrounded components:
```yaml
ungrounded_components:
  - component_id: <id>
    component_name: <name>
    reason: "No evidence claims reference this component"
    action: "kept_low_confidence" | "removed_phantom"
```

**ACTION 4: Count and validate**

```yaml
extraction_summary:
  total_entities_processed: <count>
  total_components_extracted: <count>
  components_with_evidence: <count>
  ungrounded_kept: <count>
  phantoms_removed: <count>
  component_types_distribution:
    module: <count>
    service: <count>
    function: <count>
    class: <count>
    interface: <count>
    config: <count>
    external: <count>
  layer_distribution:
    presentation: <count>
    business: <count>
    data: <count>
    infrastructure: <count>
    integration: <count>
```

## VALIDATION

- total_components_extracted >= 2 (need at least 2 for a diagram)
- phantoms_removed == 0 (no phantom components should exist if ontology is grounded)
- IF phantoms_removed > 0 -> WARNING: ontology may contain hallucinated entities
