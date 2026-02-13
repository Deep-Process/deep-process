---
step: 8
name: "Verify Coverage"
time_estimate: "1-2 minutes"
goal: "Verify diagram coverage ratio >= 0.90 (90% of components in at least one diagram)"
requires_completion: true
next_steps: ["step-09-verify-and-render.md"]
data_dependencies: ["components[] from step-03", "diagrams[] from step-07"]
outputs: ["coverage_assessment (in-memory)"]
---

# STEP 8: VERIFY COVERAGE

**PRECONDITION:** Step 07 GENERATE_DIAGRAMS = complete (diagrams[] populated)

**Input:** components[] from step-03, diagrams[] from step-07
**Output:** coverage_assessment with ratio and gap analysis

## ENFORCED SEQUENCE

**ACTION 1: Calculate coverage ratio**

1. Collect ALL unique component_ids across ALL diagrams:
   ```
   components_in_diagrams = union(diagram.components for each diagram in diagrams[])
   ```

2. Count unique components represented:
   ```
   unique_components_in_diagrams = len(components_in_diagrams)
   ```

3. Calculate ratio:
   ```
   coverage_ratio = unique_components_in_diagrams / total_components
   ```

4. Store result:
   ```yaml
   diagram_coverage:
     total_components: <count>
     components_in_diagrams: <count>
     coverage_ratio: <0.0-1.0>
     target: 0.90
     status: "PASS" | "FAIL"
   ```

**ACTION 2: Identify uncovered components**

For each component NOT in any diagram:
```yaml
uncovered_components:
  - component_id: <id>
    component_name: <name>
    layer: <layer>
    total_degree: <degree>
    is_high_priority: <bool>
    reason_uncovered: "low_degree" | "no_matching_trigger" | "isolated_component"
```

**ACTION 3: Gap analysis (if coverage < 0.90)**

IF coverage_ratio < 0.90:

1. Check if uncovered components are high_priority:
   - IF any high_priority uncovered -> CRITICAL: important component missing from diagrams
   - Generate additional diagram for uncovered high-priority components

2. Check if uncovered components form a cluster:
   - IF uncovered components share relationships -> generate cluster diagram

3. Check if coverage gap is due to isolated components (zero relationships):
   - IF isolated -> log SCOPE_REDUCTION (isolated components legitimately excluded)
   - Recalculate coverage excluding isolated:
   ```
   adjusted_ratio = components_in_diagrams / (total_components - isolated_count)
   ```

4. IF adjusted_ratio >= 0.90 -> PASS with note about isolated components
5. IF adjusted_ratio < 0.90 -> FAIL: need more diagrams

**ACTION 4: Log coverage assessment**

```yaml
coverage_assessment:
  raw_coverage_ratio: <ratio>
  isolated_components: <count>
  adjusted_coverage_ratio: <ratio>  # Excluding isolated
  uncovered_high_priority: <count>
  uncovered_low_priority: <count>
  gaps_filled: <count>  # Additional diagrams generated in ACTION 3
  final_status: "PASS" | "FAIL"
  note: <explanation if adjusted>
```

## VALIDATION

- coverage_ratio >= 0.90 -> PASS (proceed to step-09)
- coverage_ratio < 0.90 AND adjusted_ratio >= 0.90 -> PASS with SCOPE_REDUCTION logged
- coverage_ratio < 0.90 AND adjusted_ratio < 0.90 -> FAIL
  - IF FAIL: return to step-07 to generate additional diagrams for gaps
  - Maximum 2 retry attempts before logging SCOPE_REDUCTION for remainder
- uncovered_high_priority MUST be 0 (high-priority components always get diagrams)
