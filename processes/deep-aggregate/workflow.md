# Deep-Aggregate Workflow

## PURPOSE

Aggregate outputs from multiple deep-processes into concise Decision Brief (5-10 pages) with actionable GO/NO-GO recommendation.

**Problem Solved:** Decision paralysis from 100+ pages of disconnected analysis across deep-explore, deep-risk, deep-verify, deep-synthesis.

**Solution:** Systematic aggregation with quality gates and counter-checks producing 5-page Decision Brief with clear recommendation.

---

## INPUTS

```yaml
workflow_input.yaml:
  workflow_id: "unique-workflow-identifier"
  execution_id: "unique-execution-identifier"

  task_states:
    - task_id: "explore-options"
      process_name: "deep-explore"
      status: "COMPLETED"
      output_location: "results/deep-explore.yaml"
      start_time: "timestamp"
      end_time: "timestamp"
      duration: "seconds"

    - task_id: "identify-risks"
      process_name: "deep-risk"
      status: "COMPLETED"
      output_location: "results/deep-risk.yaml"

  workflow_metadata:
    goal: "Decision question or objective"
    pattern: "SEQUENTIAL | PARALLEL | HYBRID"
    budget: "optional budget constraint"
    planned_duration: "optional duration estimate"

  monitoring_data:
    execution_time: "total execution time in seconds"
    token_usage: "total tokens used"
    cost: "total cost incurred"
```

---

## OUTPUTS

```yaml
decision_brief:
  path: "reports/decision-brief-{execution_id}.md"
  format: "markdown"
  pages: "5-10"
  sections:
    - "Header"
    - "Recommendation (GO/NO-GO/CONDITIONAL-GO/PIVOT)"
    - "Key Findings"
    - "Critical Issues"
    - "Execution Summary"
    - "Decision Readiness"

full_report:
  path: "reports/full-report-{execution_id}.md"
  format: "markdown"
  content: "Comprehensive analysis with all details"

metadata:
  path: "reports/metadata-{execution_id}.yaml"
  format: "yaml"
  fields:
    - "outcome"
    - "decision_readiness"
    - "primary_recommendation"
    - "metrics"
    - "critical_issues_count"
```

---

## EXECUTION SEQUENCE

```
STEP 0: SETUP       → GATE_0 → OPEN/CLOSED
STEP 1: COLLECT     → GATE_1 → OPEN/CLOSED
STEP 2: AGGREGATE   → GATE_2 → OPEN/CLOSED
STEP 3: SYNTHESIZE  → GATE_3 → OPEN/CLOSED
STEP 4: RENDER      → GATE_4 → OPEN/CLOSED
STEP 5: OUTPUT      → GATE_5 → OPEN/CLOSED
```

**ENFORCED:** Each step MUST complete and pass its gate before next step begins.

**VIOLATIONS:** Skipping steps, skipping gates, or skipping counter-checks → HALT

---

## STEP SUMMARIES

### STEP 0: SETUP
```
1. LOAD_WORKFLOW_INPUT
2. LOAD_SCHEMAS (output-schema, brief-template, metric-formulas)
3. VERIFY_PREREQUISITES (at least 1 completed task)
4. INITIALIZE_STATE
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_0
```

### STEP 1: COLLECT
```
1. RETRIEVE_TASK_OUTPUTS (from all completed tasks)
2. VALIDATE_OUTPUTS (against schemas)
3. RECORD_MISSING (track failed/skipped tasks)
4. COUNTER_CHECK
5. CHECKLIST
6. GATE_1
```

### STEP 2: AGGREGATE
```
1. DETERMINE_PATTERN (SEQUENTIAL/PARALLEL/HYBRID)
2. AGGREGATE_BY_PATTERN
3. COMPUTE_METRICS (success_rate, coherence, decision_readiness)
4. CLASSIFY_OUTCOME (SUCCESS/PARTIAL/FAILURE)
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_2
```

### STEP 3: SYNTHESIZE
```
1. EXTRACT_KEY_FINDINGS (options, risks, verdict, themes)
2. IDENTIFY_CRITICAL_ISSUES (BLOCKER/CRITICAL severity)
3. GENERATE_RECOMMENDATION (via decision tree: NO-GO/GO/CONDITIONAL-GO/PIVOT)
4. GENERATE_NEXT_STEPS (specific to recommendation)
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_3
```

### STEP 4: RENDER
```
1. LOAD_TEMPLATE (6-section structure)
2. RENDER_DECISION_BRIEF (5-10 pages)
3. RENDER_FULL_REPORT (comprehensive details)
4. VERIFY_PAGE_LIMIT (≤10 pages, HALT if exceeded)
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_4
```

### STEP 5: OUTPUT
```
1. CREATE_OUTPUT_DIRECTORY
2. WRITE_DECISION_BRIEF
3. WRITE_FULL_REPORT
4. WRITE_METADATA
5. VERIFY_FILES (existence, integrity, readability)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

---

## GATES

### GATE_0: Setup Complete
```
EVALUATE:
  input_loaded = workflow_input EXISTS AND parsed
  schemas_loaded = ALL schema files loaded
  prerequisites_met = completed_tasks >= 1
  state_initialized = aggregation_state.status = IN_PROGRESS

IF all TRUE → GATE_0 = OPEN → PROCEED to STEP 1
IF any FALSE → GATE_0 = CLOSED → HALT
```

### GATE_1: Collection Complete
```
EVALUATE:
  outputs_collected >= 1
  validation_executed = ALL outputs have validation_status
  valid_outputs_present = valid_outputs >= 1
  collection_rate >= 0.8

IF all TRUE → GATE_1 = OPEN → PROCEED to STEP 2
IF any FALSE → GATE_1 = CLOSED → HALT
```

### GATE_2: Aggregation Complete
```
EVALUATE:
  pattern_determined = workflow_pattern IS_SET
  aggregation_complete = aggregated_data EXISTS
  metrics_computed = ALL required metrics calculated
  outcome_classified = outcome IS_SET

IF all TRUE → GATE_2 = OPEN → PROCEED to STEP 3
IF any FALSE → GATE_2 = CLOSED → HALT
```

### GATE_3: Synthesis Complete
```
EVALUATE:
  key_findings_extracted = synthesis_data EXISTS
  critical_issues_identified = critical_issues IS_SET
  recommendation_generated = recommendation EXISTS
  next_steps_generated = next_steps LENGTH >= 1

IF all TRUE → GATE_3 = OPEN → PROCEED to STEP 4
IF any FALSE → GATE_3 = CLOSED → HALT
```

### GATE_4: Rendering Complete
```
EVALUATE:
  decision_brief_rendered = decision_brief_content EXISTS
  full_report_rendered = full_report_content EXISTS
  page_limit_satisfied = estimated_pages <= 10
  all_sections_present = 6 sections in brief

IF all TRUE → GATE_4 = OPEN → PROCEED to STEP 5
IF any FALSE → GATE_4 = CLOSED → HALT
```

### GATE_5: Output Complete
```
EVALUATE:
  all_files_written = 3 files exist
  all_files_valid = ALL files readable AND size > 0
  metadata_accurate = metadata matches results
  page_limit_met = decision_brief.pages <= 10

IF all TRUE → GATE_5 = OPEN → PROCESS COMPLETE
IF any FALSE → GATE_5 = CLOSED → HALT
```

---

## COUNTER-CHECKS

**REQUIREMENT:** Every step includes counter-check section that challenges assumptions and verifies correctness.

**Pattern:**
```
COUNTER_CHECK:
  1. CHECK_A: Ask question → VERIFY/CORRECT
  2. CHECK_B: Ask question → CONFIRM/FIX
  3. CHECK_C: Ask question → VALIDATE/UPDATE
  ...
  N. REPORT: Output counter-check results

VIOLATION: Skipping counter-check is VIOLATION
```

---

## QUALITY GUARANTEES

1. **Enforced Sequence:** Steps execute in order 0→1→2→3→4→5, no skipping
2. **Binding Gates:** Each gate MUST be OPEN before proceeding
3. **Counter-Checks:** Every step includes verification logic
4. **Page Limit:** Decision brief MUST be ≤10 pages (HALT if exceeded)
5. **Validation:** All outputs validated against schemas
6. **Metrics:** All metrics calculated with explicit formulas
7. **Recommendation:** Generated via decision tree, not arbitrary
8. **File Integrity:** SHA-256 hashes verify output files

---

## EXECUTION EXAMPLE

```
INPUT: workflow_input.yaml with 4 completed tasks
  - deep-explore (5 options identified)
  - deep-risk (8 risks identified)
  - deep-verify (verdict: UNCERTAIN, 1 BLOCKER)
  - deep-synthesis (5 themes identified)

STEP 0: Setup complete → GATE_0 OPEN
STEP 1: Collected 4 outputs, validation rate 100% → GATE_1 OPEN
STEP 2: Pattern=SEQUENTIAL, coherence=0.75, readiness=MOSTLY_READY → GATE_2 OPEN
STEP 3: Recommendation=NO-GO (blocker present), 5 next steps → GATE_3 OPEN
STEP 4: Brief rendered (5.8 pages), full report rendered → GATE_4 OPEN
STEP 5: 3 files written, integrity verified → GATE_5 OPEN

OUTPUT: decision-brief-exec-001.md (5.8 pages)
  Recommendation: NO-GO
  Rationale: Blocker issue - infrastructure budget frozen
  Next steps: 5 actionable items
  Decision readiness: MOSTLY_READY (75%)
```

---

## VIOLATIONS

```
IF agent skips any step → HALT, RETURN to missing step
IF agent skips any counter-check → HALT, RETURN to counter-check
IF agent skips any gate → HALT, RETURN to gate
IF agent proceeds with GATE = CLOSED → HALT
IF decision brief exceeds 10 pages → HALT
IF recommendation generated without decision tree → HALT
```

---

## INTEGRATION

**Called by:** deep-orchestration (STEP 6: AGGREGATE)

**Invocation:**
```
LOAD: processes/deep-aggregate/workflow.md
PREPARE: workflow_input.yaml FROM orchestration context
EXECUTE: Deep-aggregate process (STEP 0 → STEP 5)
RECEIVE: decision_brief, full_report, metadata
STORE: In orchestration results
```

---

## START EXECUTION

```
TO EXECUTE THIS PROCESS:
  LOAD: steps/step-00-setup.md
  BEGIN: STEP 0
```
