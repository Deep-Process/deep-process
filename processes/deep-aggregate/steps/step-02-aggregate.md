# STEP 2: AGGREGATE

## ENFORCED SEQUENCE

```
1. DETERMINE_PATTERN
2. AGGREGATE_BY_PATTERN
3. COMPUTE_METRICS
4. CLASSIFY_OUTCOME
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_2
```

## 1. DETERMINE_PATTERN

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: workflow_metadata.pattern FROM aggregation_context
IF pattern is SPECIFIED:
  USE: pattern AS workflow_pattern
ELSE:
  ANALYZE: task dependencies
  IF all tasks sequential:
    SET: workflow_pattern = SEQUENTIAL
  IF all tasks parallel:
    SET: workflow_pattern = PARALLEL
  IF mixed:
    SET: workflow_pattern = HYBRID

STORE: workflow_pattern IN aggregation_state
```

## 2. AGGREGATE_BY_PATTERN

```
IF workflow_pattern = SEQUENTIAL:
  SORT: outputs_collected BY execution_order
  CREATE: ordered_results = []
  FOR each output IN sorted_outputs:
    APPEND: output TO ordered_results
  STORE: ordered_results IN aggregation_state.aggregated_data

IF workflow_pattern = PARALLEL:
  CREATE: combined_results = {}
  FOR each output IN outputs_collected:
    MERGE: output INTO combined_results BY process_name
  STORE: combined_results IN aggregation_state.aggregated_data

IF workflow_pattern = HYBRID:
  IDENTIFY: sequential_segments
  IDENTIFY: parallel_segments
  FOR each segment:
    APPLY: Appropriate aggregation method
  COMPOSE: final_results FROM segment_results
  STORE: final_results IN aggregation_state.aggregated_data

EXTRACT: By process type
  deep_explore_output = FIND output WHERE process_name = "deep-explore"
  deep_risk_output = FIND output WHERE process_name = "deep-risk"
  deep_verify_output = FIND output WHERE process_name = "deep-verify"
  deep_synthesis_output = FIND output WHERE process_name = "deep-synthesis"

STORE: In aggregation_state.outputs_by_type
```

## 3. COMPUTE_METRICS

```
LOAD: metric_formulas FROM brief_template

COMPUTE: Task metrics
  success_rate = completed_tasks / total_tasks
  output_quality = valid_outputs / (valid_outputs + invalid_outputs)

COMPUTE: Decision coherence
  INITIALIZE: contradiction_count = 0
  INITIALIZE: total_comparisons = 0

  IF deep_explore_output EXISTS AND deep_risk_output EXISTS:
    FOR each option IN deep_explore_output.options:
      FIND: corresponding_risks WHERE target = option.name
      FOR each risk:
        IF risk.severity >= 7 AND risk.mitigation = "NONE":
          INCREMENT: contradiction_count BY 0.5
        INCREMENT: total_comparisons

  IF deep_verify_output EXISTS:
    IF deep_verify_output.verdict = "GO":
      COUNT: blockers IN deep_verify_output.critical_issues WHERE severity = "BLOCKER"
      IF blockers > 0:
        INCREMENT: contradiction_count BY 1.0
      INCREMENT: total_comparisons

  COMPUTE: coherence = 1 - (contradiction_count / MAX(total_comparisons, 1))

COMPUTE: Information completeness
  information_completeness = completed_tasks / total_tasks

COMPUTE: Critical issue density
  IF deep_verify_output EXISTS:
    EXTRACT: critical_issues FROM deep_verify_output
    critical_issues_count = COUNT(critical_issues WHERE severity IN [BLOCKER, CRITICAL])
  ELSE:
    critical_issues_count = 0

  critical_issue_density = critical_issues_count / MAX(completed_tasks, 1)

COMPUTE: Decision readiness
  data_quality = output_quality
  critical_unresolved = critical_issues_count

  decision_readiness_score = (information_completeness + data_quality + coherence - (critical_unresolved / 10)) / 3
  decision_readiness_score = CLAMP(decision_readiness_score, 0, 1)

  IF decision_readiness_score >= 0.9:
    decision_readiness = "READY"
  ELSE IF decision_readiness_score >= 0.7:
    decision_readiness = "MOSTLY_READY"
  ELSE IF decision_readiness_score >= 0.5:
    decision_readiness = "PARTIAL"
  ELSE:
    decision_readiness = "NOT_READY"

STORE: All metrics IN aggregation_state.metrics
  success_rate: success_rate
  output_quality: output_quality
  coherence: coherence
  information_completeness: information_completeness
  critical_issue_density: critical_issue_density
  decision_readiness: decision_readiness
  decision_readiness_score: decision_readiness_score
  critical_issues_count: critical_issues_count
```

## 4. CLASSIFY_OUTCOME

```
DETERMINE: Workflow outcome

IF all_tasks_completed AND all_outputs_valid:
  outcome = "SUCCESS"
ELSE IF critical_tasks_completed AND output_quality >= 0.8:
  outcome = "PARTIAL_SUCCESS"
ELSE IF critical_tasks_failed OR output_quality < 0.5:
  outcome = "FAILURE"
ELSE:
  outcome = "COMPLETED_WITH_WARNINGS"

STORE: outcome IN aggregation_state
```

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify aggregation accuracy and metric correctness
EXECUTE:
  1. PATTERN_DETECTION_CHECK:
     QUESTION: "Is workflow pattern correctly identified?"
     VERIFY: workflow_pattern matches actual task dependencies
     IF incorrect:
       CORRECT: Re-analyze dependencies and update pattern
     IF correct:
       CONFIRM: "Pattern correctly identified as {workflow_pattern}"

  2. AGGREGATION_COMPLETENESS_CHECK:
     QUESTION: "Were all valid outputs aggregated?"
     COUNT: aggregated_outputs
     COUNT: valid_outputs
     VERIFY: aggregated_outputs = valid_outputs
     IF mismatch:
       INVESTIGATE: Missing outputs
       CORRECT: Include missing outputs
     IF match:
       CONFIRM: "All valid outputs aggregated"

  3. METRIC_CALCULATION_CHECK:
     QUESTION: "Are metrics calculated correctly?"
     RECOMPUTE: success_rate = completed_tasks / total_tasks
     VERIFY: Matches stored value
     RECOMPUTE: output_quality = valid_outputs / total_outputs
     VERIFY: Matches stored value
     IF discrepancy:
       CORRECT: Recalculate and update metrics
     IF accurate:
       CONFIRM: "Metrics calculated correctly"

  4. COHERENCE_LOGIC_CHECK:
     QUESTION: "Is coherence calculation sound?"
     VERIFY: contradiction_count reflects actual contradictions
     VERIFY: total_comparisons is accurate
     IF flawed:
       CORRECT: Recalculate coherence
     IF sound:
       CONFIRM: "Coherence: {coherence}"

  5. OUTCOME_CLASSIFICATION_CHECK:
     QUESTION: "Does outcome match actual execution results?"
     VERIFY: outcome aligns with success_rate and output_quality
     IF misaligned:
       CORRECT: Reclassify outcome
     IF aligned:
       CONFIRM: "Outcome: {outcome}"

  6. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "Pattern: {workflow_pattern}"
     OUTPUT: "Metrics verified: YES/NO"
     OUTPUT: "Coherence: {coherence}"
     OUTPUT: "Decision readiness: {decision_readiness} ({decision_readiness_score})"

VIOLATION: Skipping counter-check is VIOLATION
```

## 6. CHECKLIST

```
ANSWER YES/NO:
□ Workflow pattern determined?
□ Outputs aggregated by pattern?
□ All metrics computed?
□ Outcome classified?
□ Metrics verified via counter-check?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## 7. GATE_2

```
EVALUATE:
  pattern_determined = workflow_pattern IS_SET
  aggregation_complete = aggregated_data EXISTS
  metrics_computed = ALL required metrics calculated
  outcome_classified = outcome IS_SET

IF all TRUE:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - Aggregation complete, proceeding to STEP 3 (SYNTHESIZE)"
  OUTPUT: "Workflow pattern: {workflow_pattern}"
  OUTPUT: "Success rate: {success_rate}"
  OUTPUT: "Decision readiness: {decision_readiness}"
  OUTPUT: "Outcome: {outcome}"
  NEXT_STEP: "steps/step-03-synthesize.md"

IF any FALSE:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without determining pattern:
  HALT
  OUTPUT: "VIOLATION: Section 1 DETERMINE_PATTERN required"
  RETURN to section 1

IF agent skips aggregation:
  HALT
  OUTPUT: "VIOLATION: Section 2 AGGREGATE_BY_PATTERN required"
  RETURN to section 2

IF agent skips metric computation:
  HALT
  OUTPUT: "VIOLATION: Section 3 COMPUTE_METRICS required"
  RETURN to section 3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
