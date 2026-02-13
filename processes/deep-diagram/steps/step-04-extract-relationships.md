---
step: 4
name: "Extract Relationships"
time_estimate: "3-5 minutes"
goal: "Extract architectural relationships from evidence claims with type: relationship|behavior"
requires_completion: true
next_steps: ["step-05-build-metrics.md"]
data_dependencies: ["evidence_map.yaml", "components[] from step-03"]
outputs: ["relationships[] (in-memory)"]
---

# STEP 4: EXTRACT RELATIONSHIPS

**PRECONDITION:** Step 03 EXTRACT_COMPONENTS = complete (components[] populated)

**Input:** evidence_map.yaml claims[] (type: relationship|behavior), components[] from step-03
**Output:** relationships[] array (in-memory, written to file in step-09)

## ENFORCED SEQUENCE

**ACTION 1: Filter relevant claims**

From evidence_map.yaml, select claims where:
- claim_type == "relationship" OR claim_type == "behavior"
- OR claim_text contains relationship indicators:
  - "depends on", "calls", "imports", "extends", "implements"
  - "subscribes to", "publishes to", "uses", "contains"
  - "sends to", "receives from", "triggers", "invokes"

**ACTION 2: Parse relationships from claims**

For each filtered claim:

1. Parse claim_text to identify source and target:
   - Pattern: "[Source] [verb] [Target]"
   - Example: "UserService calls DatabaseRepository" -> source=UserService, target=DatabaseRepository
   - Example: "OrderHandler subscribes to OrderCreatedEvent" -> source=OrderHandler, target=OrderCreatedEvent

2. Match source and target to components[]:
   - Find component where component_name matches source entity name
   - Find component where component_name matches target entity name
   - IF source or target not found in components[] -> skip this claim (orphaned relationship)

3. Create relationship entry:
   - `relationship_id`: Sequential identifier (REL_001, REL_002, ...)
   - `source_component_id`: matched source component's component_id
   - `target_component_id`: matched target component's component_id
   - `relationship_type`: Classify from declared assumptions:
     - "calls", "invokes", "triggers" -> calls
     - "depends on", "imports", "requires" -> depends_on
     - "extends", "inherits" -> extends
     - "implements" -> implements
     - "subscribes to", "listens" -> subscribes
     - "publishes to", "emits", "sends" -> publishes
     - "contains", "includes", "has" -> contains
     - Default -> uses
   - `evidence_claim_ids`: [claim_id] (the claim that established this relationship)

**ACTION 3: Deduplicate relationships**

For relationships with same source_component_id AND target_component_id AND relationship_type:
1. Merge into single relationship
2. Combine evidence_claim_ids[] from all duplicate entries
3. Keep the relationship_id of the first occurrence

**ACTION 4: Validate relationships**

For each relationship:
1. Verify source_component_id exists in components[]
2. Verify target_component_id exists in components[]
3. Verify evidence_claim_ids is non-empty
4. Verify relationship_type is in declared assumptions list
5. IF any validation fails -> flag as INVALID_RELATIONSHIP

**ACTION 5: Handle orphaned claims**

For claims that could not be matched to components:
```yaml
orphaned_claims:
  - claim_id: <id>
    claim_text: <text>
    reason: "Source entity not in components[]" | "Target entity not in components[]"
    source_attempted: <name>
    target_attempted: <name>
```

**ACTION 6: Count and summarize**

```yaml
relationship_summary:
  total_claims_processed: <count>
  relationship_claims_found: <count>
  relationships_extracted: <count>
  relationships_after_dedup: <count>
  orphaned_claims: <count>
  invalid_relationships: <count>
  relationship_type_distribution:
    uses: <count>
    contains: <count>
    extends: <count>
    implements: <count>
    calls: <count>
    subscribes: <count>
    publishes: <count>
    depends_on: <count>
```

## VALIDATION

- relationships_after_dedup >= 1 (need at least 1 relationship for meaningful diagram)
- orphaned_claims / total_claims_processed < 0.30 (less than 30% orphaned)
- IF orphaned ratio > 0.30 -> WARNING: component extraction may have missed entities
- invalid_relationships == 0 (all relationships reference valid components)
