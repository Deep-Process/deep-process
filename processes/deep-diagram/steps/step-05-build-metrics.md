---
step: 5
name: "Build Dependency Metrics"
time_estimate: "2-3 minutes"
goal: "Calculate degree-based dependency metrics for each component (LLM-executable)"
requires_completion: true
next_steps: ["step-06-rank-components.md"]
data_dependencies: ["components[] from step-03", "relationships[] from step-04"]
outputs: ["component.dependency_metrics (in-memory)"]
---

# STEP 5: BUILD DEPENDENCY METRICS

**PRECONDITION:** Step 04 EXTRACT_RELATIONSHIPS = complete (relationships[] populated)

**Input:** components[] from step-03, relationships[] from step-04
**Output:** Updated components[] with dependency_metrics per component

## ENFORCED SEQUENCE

**v7.1.3 C-02 Fix Applied:** This step uses degree counting ONLY (LLM-executable).
No Floyd-Warshall, no adjacency matrix, no transitive closure computation.
LLM counts relationships from evidence -- no graph algorithms required.

**ACTION 1: Count relationships_in (incoming dependencies)**

For EACH component in components[]:
1. Count how many relationships[] have this component as target_component_id
2. Store count as component.dependency_metrics.relationships_in
3. Also store the list of source_component_ids as component.dependency_metrics.depended_on_by[]

Example:
- Component CMP_005 (DatabaseRepository)
- Relationships where target_component_id == CMP_005: REL_003, REL_007, REL_012
- relationships_in = 3
- depended_on_by = [CMP_001, CMP_003, CMP_008]

**ACTION 2: Count relationships_out (outgoing dependencies)**

For EACH component in components[]:
1. Count how many relationships[] have this component as source_component_id
2. Store count as component.dependency_metrics.relationships_out
3. Also store the list of target_component_ids as component.dependency_metrics.depends_on[]

Example:
- Component CMP_001 (UserService)
- Relationships where source_component_id == CMP_001: REL_001, REL_002, REL_003
- relationships_out = 3
- depends_on = [CMP_005, CMP_006, CMP_010]

**ACTION 3: Store dependency_metrics per component**

For EACH component, the dependency_metrics block should be:

```yaml
dependency_metrics:
  relationships_in: <count>      # How many components reference THIS component
  relationships_out: <count>     # How many components THIS component references
  depended_on_by: [<ids>]        # List of components that depend on this
  depends_on: [<ids>]            # List of components this depends on
```

**ACTION 4: Validate metric correctness**

Cross-check: The sum of ALL relationships_in across ALL components should equal
the sum of ALL relationships_out across ALL components, which should equal
the total number of relationships.

```
sum(relationships_in) == sum(relationships_out) == total_relationships
```

IF this equality does not hold -> ERROR: metric calculation incorrect, recount.

**ACTION 5: Summarize metrics**

```yaml
metrics_summary:
  total_components: <count>
  total_relationships: <count>
  max_in_degree: <highest relationships_in>
  max_out_degree: <highest relationships_out>
  avg_in_degree: <average>
  avg_out_degree: <average>
  components_with_zero_in: <count>   # Leaf/entry point components
  components_with_zero_out: <count>  # Foundation/sink components
  cross_check_passed: true|false
```

## VALIDATION

- cross_check_passed MUST be true
- IF max_in_degree == 0 AND max_out_degree == 0 -> CRITICAL: no relationships detected
- All components MUST have dependency_metrics populated
