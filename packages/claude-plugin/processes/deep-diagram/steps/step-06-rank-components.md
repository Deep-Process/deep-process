---
step: 6
name: "Rank Components"
time_estimate: "2-3 minutes"
goal: "Rank components by degree centrality and select high-priority for diagram inclusion"
requires_completion: true
next_steps: ["step-07-generate-diagrams.md"]
data_dependencies: ["components[] with dependency_metrics from step-05"]
outputs: ["component.priority_score, high_priority_components[] (in-memory)"]
---

# STEP 6: RANK COMPONENTS

**PRECONDITION:** Step 05 BUILD_DEPENDENCY_METRICS = complete (dependency_metrics populated)

**Input:** components[] with dependency_metrics from step-05
**Output:** Updated components[] with priority_score, high_priority_components[] list

## ENFORCED SEQUENCE

**v7.1.3 C-02 Fix Applied:** Uses degree centrality ONLY.
Removed betweenness (0.30 weight), closeness (0.25 weight), PageRank (0.20 weight)
from original config. Now 100% degree centrality. Same prioritization outcome
(high-dependency components get diagrams) without fiction of computing graph
algorithms LLM cannot execute.

**Rationale (Method #71 First Principles):** LLM cannot execute Brandes algorithm
(betweenness), BFS from each node (closeness), or iterative matrix multiplication
(PageRank). Need: identify important components for diagram prioritization.
Solution: count dependencies (degree centrality).

**ACTION 1: Compute degree_centrality**

For EACH component:
1. in_degree = dependency_metrics.relationships_in
2. out_degree = dependency_metrics.relationships_out
3. total_degree = in_degree + out_degree
4. degree_centrality = total_degree / (total_components - 1)
   - This normalizes to 0.0-1.0 range
   - IF total_components == 1 -> degree_centrality = 0.0

**ACTION 2: Identify high-priority components**

Apply BOTH criteria (whichever selects the component):

1. **Percentile threshold:** Sort components by total_degree descending.
   Select top 20% as high_priority.
   - Count: ceil(total_components * 0.20)
   - Example: 45 components -> top 9 are high-priority

2. **Absolute threshold:** All components with total_degree > 10.
   - This catches important components in large graphs where 20% is too many
   - This catches important components in small graphs where 20% is too few

3. **Union:** high_priority = (top 20% by degree) UNION (total_degree > 10)

**ACTION 3: Store priority_score per component**

```yaml
priority_score:
  in_degree: <count>           # How many depend ON this
  out_degree: <count>          # How many this depends on
  total_degree: <count>        # Total connections
  degree_centrality: <0.0-1.0> # Normalized
  is_high_priority: true | false
```

**ACTION 4: Build high_priority_components list**

```yaml
high_priority_components:
  - component_id: CMP_001
    component_name: "UserService"
    total_degree: 25
    degree_centrality: 0.85
    reason: "top_20_percent AND absolute_threshold"
  - component_id: CMP_005
    component_name: "DatabaseRepository"
    total_degree: 18
    degree_centrality: 0.62
    reason: "top_20_percent AND absolute_threshold"
  ...
```

**ACTION 5: Validate distribution**

Per ADR-016 Topology-Driven Diagram Detection:
- Target: 5-30% of entities classified as high-priority
- IF high_priority < 5% -> WARNING: may need to lower threshold
- IF high_priority > 30% -> WARNING: may need to raise threshold
- Log distribution:

```yaml
priority_distribution:
  total_components: <count>
  high_priority_count: <count>
  high_priority_ratio: <ratio>  # Should be 0.05-0.30
  distribution_assessment: "NORMAL" | "TOO_FEW" | "TOO_MANY"
```

## VALIDATION

- All components MUST have priority_score populated
- high_priority_components MUST be non-empty (at least 1 component)
- degree_centrality values MUST be in range 0.0-1.0
- high_priority_ratio SHOULD be 0.05-0.30 (WARNING if outside)
