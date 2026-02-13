---
step: 7
name: "Coverage Mapping"
state: "STATE_COVERAGE"
time_estimate: "5-12 minutes"
goal: "Map files to segments with logical boundaries (no over-segmentation)"
requires_completion: true
next_steps: ["step-08-evidence.md"]
data_dependencies: ["repo_inventory.yaml", "documentation-plan.yaml"]
outputs: ["coverage_map.yaml"]
---

# STATE_COVERAGE

**Input:** deep-artifacts/repo_inventory.yaml, deep-artifacts/documentation-plan.yaml
**Output:** deep-artifacts/coverage_map.yaml

## ENFORCED SEQUENCE

**STEP 1: LOAD_PLAN**
Read documentation-plan.yaml → extract all source files referenced

**STEP 2: ASSUMPTIONS_DECLARED**
```yaml
assumptions:
  - "Files <3000 lines: read as ONE segment (no splitting)"
  - "Files >=3000 lines: split into 1000-1500 line chunks at logical boundaries"
  - "Segment types: class|function|interface|type|config|documentation|other"
  - "Priority assigned based on documentation-plan requirements"
  - "Coverage completeness target: >= 0.90"
```

**STEP 3: SEGMENT_FILES**
For each file in repo_inventory.yaml:
1. Check line_count:
   - IF <3000 → create ONE segment (whole file)
   - IF >=3000 → split at logical boundaries (class/function definitions)
2. For each segment:
   - Assign segment_id (sequential: SEG_001, SEG_002, ...)
   - Record file_path, start_line, end_line
   - Classify segment_type (analyze content)
   - Assign priority (CRITICAL if in documentation-plan critical docs)
   - Determine semantic_category (business_logic|infrastructure|configuration|testing|documentation)

**STEP 4: VERIFY**
1. Method #168 Phantom Hunt: verify all file_paths exist in repo_inventory
2. Verify line ranges valid (start <= end, within file bounds)
3. Verify no gaps (all lines covered) and no overlaps

**STEP 5: RENDER**
Write deep-artifacts/coverage_map.yaml per schema
Calculate statistics:
```yaml
statistics:
  total_segments: <count>
  segments_by_type:
    class: <count>
    function: <count>
    # ...
  segments_by_priority:
    CRITICAL: <count>
    HIGH: <count>
    MEDIUM: <count>
    LOW: <count>
  avg_segment_size: <lines>
  coverage_completeness: <ratio>
```

**STEP 6: COUNTER-CHECKS**
- **CC1 (Method #85 Grounding):** Sample 3 segments, verify file_paths exist and line ranges valid → BLOCKER if fail
- **CC2 (Method #168 Phantom):** Check for phantom segments (file_paths not in repo_inventory) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify statistics.total_segments == len(segments[]) → ERROR if mismatch

**STEP 7: GATE_1**
Evaluate all G1-01 through G1-10 conditions from gates.yaml

**STEP 8: TRANSITION**
IF GATE_1 PASS → return to orchestrator for STATE_EVIDENCE
IF GATE_1 FAIL → return to orchestrator for STATE_ERROR

## SEGMENTATION STRATEGY (V6.1.1 Anti-Over-Segmentation)

**Efficiency Note:** V6.1.1 fixed excessive segmentation that caused 28 Read calls for 824-line file. New thresholds prevent token waste:
- Files <3000 lines: Read as ONE whole segment (no splitting)
- Files ≥3000 lines: Split into 1000-1500 line chunks at logical boundaries

This reduces Read overhead 15x for typical files while maintaining logical structure.

## GATE_1 CONDITIONS (from gates.yaml)

```
[ ] G1-01: coverage_map.yaml exists (BLOCKER)
[ ] G1-02: All files from inventory mapped (BLOCKER)
[ ] G1-03: Segment boundaries logical (CRITICAL)
[ ] G1-04: No phantom files (BLOCKER)
[ ] G1-05: Segmentation strategy documented (ERROR)
[ ] G1-06: Counter-checks executed (ERROR)
[ ] G1-07: Coverage version incremented (WARNING)
[ ] G1-08: Delta math correct for incremental mode (ERROR)
[ ] G1-09: Coverage completeness >= 0.90 (ERROR)
[ ] G1-10: Segment metadata complete (WARNING)
```

## INCREMENTAL MODE (V6.3)

When execution_context.mode == "INCREMENTAL":

**STEP 1: LOAD_BASE**
Read existing coverage_map.yaml

**STEP 2: DETECT_CHANGES**
Compare repo_inventory.yaml with base coverage_map
Identify: new files, modified files, deleted files

**STEP 3: SUPPLEMENT**
For new/modified files:
1. Create new segments OR update existing
2. Preserve all unchanged segments (>=80% preservation required)

**STEP 4: WRITE_DELTA**
Write deep-artifacts/coverage-incremental-delta.yaml

**STEP 5: GATE_1_INCREMENTAL_VERIFY**
Evaluate gate conditions for incremental mode (8 conditions, >=80% preservation)
