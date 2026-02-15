# STEP 6: AGGREGATE

## ENFORCED SEQUENCE

```
1. LOAD_MONITORING_RESULTS
2. EXECUTE_METHOD_349
3. COLLECT_OUTPUTS
4. AGGREGATE_RESULTS
5. GENERATE_REPORT
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_6
```

## 1. LOAD_MONITORING_RESULTS

```
PRECONDITION: GATE_5 = OPEN
IF GATE_5 ≠ OPEN → HALT with "ERROR: GATE_5 not open"

LOAD: Workflow execution state from step-05
LOAD: All task states from step-04
LOAD: Monitoring data from step-05
LOAD: Incident records from step-05
STORE: aggregation_context
VERIFY: workflow_status = COMPLETED OR ABORTED OR FINISHED
```

## 2. EXECUTE_METHOD_349

```
IF Method 349 (Result Aggregator) available:
  LOAD: ../../methods/method-349-result-aggregator/method.md

  PREPARE: workflow_input.yaml
    workflow_id: FROM orchestration_context.workflow_id
    execution_id: FROM orchestration_context.execution_id

    task_states:
      FOR each task IN execution_state.tasks:
        CREATE task_state:
          task_id: task.task_id
          process_name: task.process_name
          status: task.status
          output_location: task.output_location
          start_time: task.start_time
          end_time: task.end_time
          duration: task.duration
          retry_count: task.retry_count

    workflow_metadata:
      goal: orchestration_context.objective.name
      pattern: orchestration_context.workflow_pattern
      budget: orchestration_context.budget
      planned_duration: orchestration_context.planned_duration

    monitoring_data:
      execution_time: monitoring_results.total_execution_time
      token_usage: monitoring_results.total_tokens
      cost: monitoring_results.total_cost

  WRITE: workflow_input.yaml TO methods/method-349-result-aggregator/workflow_input.yaml

  EXECUTE: Method #349 Result Aggregator
    FOLLOW: methods/method-349-result-aggregator/method.md
    ENFORCED SEQUENCE: STEP 0 → STEP 1 → STEP 2 → STEP 3 → STEP 4 → STEP 5

    STEP 0: SETUP
      LOAD workflow_input.yaml
      LOAD schemas
      VERIFY prerequisites
      INITIALIZE state

    STEP 1: COLLECT
      RETRIEVE all task outputs
      VALIDATE each output
      RECORD missing outputs

    STEP 2: AGGREGATE
      DETERMINE workflow pattern
      AGGREGATE by pattern
      COMPUTE metrics
      CLASSIFY outcome

    STEP 3: SYNTHESIZE
      EXTRACT key findings
      IDENTIFY critical issues
      GENERATE recommendations
      ASSESS decision readiness

    STEP 4: RENDER
      RENDER decision brief
      RENDER full report
      FORMAT markdown
      VERIFY completeness

    STEP 5: OUTPUT
      WRITE decision brief
      WRITE full report
      WRITE metadata
      VERIFY output files

  RECEIVE: Method #349 outputs
    decision_brief_path: reports/decision-brief-[execution_id].md
    full_report_path: reports/full-report-[execution_id].md
    metadata_path: reports/metadata-[execution_id].yaml

  READ: metadata_path
  PARSE: AS YAML
  EXTRACT:
    outcome: metadata.outcome
    decision_readiness: metadata.decision_readiness
    primary_recommendation: metadata.primary_recommendation
    metrics: metadata.metrics
    critical_issues_count: metadata.critical_issues_count

  STORE: In orchestration_results
    aggregation_method: "Method 349 - Result Aggregator"
    decision_brief: decision_brief_path
    full_report: full_report_path
    metadata: metadata_path
    recommendation: primary_recommendation
    readiness: decision_readiness
    outcome: outcome

  OUTPUT:
```yaml
result_aggregation:
  method: "Method 349 - Result Aggregator"
  tasks_aggregated: [tasks_count]
  outputs_collected: [outputs_count]
  aggregation_complete: TRUE
  decision_brief_generated: TRUE
  decision_brief_path: [decision_brief_path]
  recommendation: [primary_recommendation]
  decision_readiness: [decision_readiness]
```

ELSE:
  HALT: "VIOLATION: Method #349 Result Aggregator required but not available"
  OUTPUT: "Method #349 must be installed at methods/method-349-result-aggregator/"
  OUTPUT: "Cannot proceed with manual aggregation - enforced process required"
```

## 3. COLLECT_OUTPUTS

```
FOR each task WHERE status = COMPLETED:
  RETRIEVE: Task outputs
```yaml
task_output:
  task_id: TSK-001
  execution_id: EXEC-[timestamp]
  output_id: OUT-001
  output_type: "[data type]"
  output_size: "[bytes]"
  output_location: "[storage path]"
  output_hash: "[SHA-256]"
  output_timestamp: "[when produced]"
  output_data: "[actual data or reference]"
```

  VALIDATE: Output correctness
    VERIFY: Output schema matches specification
    VERIFY: Output constraints satisfied
    VERIFY: Output integrity (hash check)
    IF validation_failed:
      MARK: output_invalid = TRUE
      RECORD: Validation errors
    IF validated:
      MARK: output_valid = TRUE

FOR each task WHERE status = FAILED OR SKIPPED:
  RECORD: Missing outputs
```yaml
missing_output:
  task_id: TSK-002
  execution_id: EXEC-[timestamp]
  expected_output_id: OUT-002
  reason: TASK_FAILED | TASK_SKIPPED
  impact: "[which downstream tasks affected]"
```

FOR each workflow-level output:
  TRACE: From source task
  RETRIEVE: Output data
  VALIDATE: Against workflow output specification
  STORE: In final results
```

## 4. AGGREGATE_RESULTS

```
COMBINE outputs according to workflow pattern:

  IF workflow_pattern = SEQUENTIAL:
    AGGREGATE: Outputs in execution order
    CREATE: Ordered list of results
    LINK: Each output to next input

  IF workflow_pattern = PARALLEL:
    AGGREGATE: Outputs by collecting all results
    CREATE: Combined result set
    MERGE: Parallel outputs if needed

  IF workflow_pattern = CONDITIONAL:
    AGGREGATE: Outputs from executed branches
    RECORD: Which branches executed
    EXCLUDE: Outputs from unexecuted branches

  IF workflow_pattern = ITERATIVE:
    AGGREGATE: Outputs from all iterations
    CREATE: Iteration result history
    EXTRACT: Final iteration result

  IF workflow_pattern = HYBRID:
    APPLY: Appropriate aggregation for each sub-pattern
    COMPOSE: Final result from sub-results

COMPUTE workflow-level results:
```yaml
workflow_results:
  workflow_id: WF-001
  execution_id: EXEC-[timestamp]
  status: COMPLETED | PARTIAL | FAILED
  completion_time: "[timestamp]"
  total_duration: "[duration]"

  outputs:
    - output_id: WF-OUT-001
      name: "[output name]"
      type: "[data type]"
      size: "[bytes]"
      location: "[storage path]"
      hash: "[SHA-256]"
      produced_by: TSK-005

  tasks_summary:
    total: N
    completed: C
    failed: F
    skipped: S
    retried: R

  resource_summary:
    total_cpu_hours: N
    total_memory_gb_hours: M
    total_cost: "[currency amount]"
    peak_cpu_usage: N%
    peak_memory_usage: M GB

  performance_summary:
    planned_duration: "[estimated]"
    actual_duration: "[actual]"
    variance: "[difference]"
    speedup_achieved: "[factor vs sequential]"
    efficiency: "[percentage]"

  quality_summary:
    outputs_valid: V
    outputs_invalid: I
    data_quality_score: "[score]"

  incidents_summary:
    total_incidents: N
    critical_incidents: C
    resolved_incidents: R
    unresolved_incidents: U
```

GENERATE derived metrics:
  success_rate = completed_tasks / total_tasks
  failure_rate = failed_tasks / total_tasks
  retry_effectiveness = successful_retries / total_retries
  resource_efficiency = actual_usage / allocated_resources
  cost_efficiency = actual_cost / budgeted_cost
  schedule_adherence = planned_duration / actual_duration

CLASSIFY workflow outcome:
  IF all_tasks_completed AND all_outputs_valid:
    outcome = SUCCESS

  IF critical_tasks_completed AND outputs_mostly_valid:
    outcome = PARTIAL_SUCCESS

  IF critical_tasks_failed OR missing_critical_outputs:
    outcome = FAILURE

  IF workflow_aborted:
    outcome = ABORTED

RECORD outcome:
```yaml
workflow_outcome:
  workflow_id: WF-001
  execution_id: EXEC-[timestamp]
  outcome: SUCCESS | PARTIAL_SUCCESS | FAILURE | ABORTED
  success_rate: N%
  failure_rate: F%
  quality_score: Q%
  satisfaction_criteria_met: YES | NO
```
```

## 5. GENERATE_REPORT

```
COMPILE comprehensive execution report:

SECTION 1: Executive Summary
  SUMMARIZE:
    - Workflow name and ID
    - Execution timeframe
    - Overall outcome
    - Key metrics
    - Critical issues

  FORMAT:
```yaml
executive_summary:
  workflow: "[name]"
  execution_period: "[start] to [end]"
  duration: "[total duration]"
  outcome: SUCCESS | PARTIAL_SUCCESS | FAILURE | ABORTED
  tasks_completed: N of T
  outputs_produced: O
  issues_encountered: I
  cost_incurred: "[amount]"
```

SECTION 2: Task Execution Details
  FOR each task:
    REPORT:
```yaml
task_report:
  task_id: TSK-001
  task_name: "[name]"
  status: COMPLETED | FAILED | SKIPPED
  start_time: "[timestamp]"
  end_time: "[timestamp]"
  duration: "[actual]"
  estimated_duration: "[estimated]"
  variance: "[difference]"
  retry_count: N
  resource_usage:
    cpu: N core-hours
    memory: M GB-hours
  outputs_produced: [OUT-001, OUT-002]
  errors: "[if any]"
```

  GROUP tasks by:
    - Execution level
    - Status (completed/failed/skipped)
    - Criticality

SECTION 3: Resource Utilization
  REPORT:
```yaml
resource_report:
  compute:
    allocated_cpu: N cores
    used_cpu: U cores
    utilization: U%
    allocated_memory: M GB
    used_memory: U GB
    utilization: U%
  storage:
    data_read: R GB
    data_written: W GB
    storage_used: S GB
  network:
    data_transferred: T GB
    bandwidth_used: B Mbps
  cost:
    compute_cost: "[amount]"
    storage_cost: "[amount]"
    network_cost: "[amount]"
    total_cost: "[amount]"
    budget: "[amount]"
    variance: "[over/under budget]"
```

SECTION 4: Performance Analysis
  ANALYZE:
    - Critical path actual vs planned
    - Parallelization effectiveness
    - Bottlenecks encountered
    - Optimization opportunities

  REPORT:
```yaml
performance_analysis:
  critical_path:
    tasks: [TSK-001, TSK-003, TSK-005]
    planned_duration: "[time]"
    actual_duration: "[time]"
    variance: "[difference]"
  parallelization:
    parallel_groups: N
    average_group_size: S
    speedup_achieved: Fx
    efficiency: E%
  bottlenecks:
    - type: RESOURCE_CONTENTION
      affected_tasks: [TSK-002]
      impact: "[duration delay]"
    - type: DEPENDENCY_WAIT
      affected_tasks: [TSK-004]
      impact: "[duration delay]"
```

SECTION 5: Incidents and Anomalies
  LIST: All incidents and anomalies
  FOR each:
    INCLUDE:
      - Description
      - Severity
      - Impact
      - Resolution
      - Prevention measures

SECTION 6: Outputs and Deliverables
  LIST: All workflow outputs
  FOR each output:
    INCLUDE:
      - Output name and type
      - Size and location
      - Validation status
      - Quality metrics

SECTION 7: Recommendations
  GENERATE recommendations:
    BASED ON: Execution observations

    PERFORMANCE recommendations:
      IF tasks_consistently_slow:
        RECOMMEND: Increase resources or optimize code

      IF low_parallelization:
        RECOMMEND: Identify more parallelization opportunities

    RELIABILITY recommendations:
      IF high_failure_rate:
        RECOMMEND: Add error handling or improve robustness

      IF frequent_retries:
        RECOMMEND: Fix root causes instead of relying on retries

    COST recommendations:
      IF resource_underutilization:
        RECOMMEND: Reduce resource allocation

      IF resource_overutilization:
        RECOMMEND: Increase allocation or optimize usage

    QUALITY recommendations:
      IF output_validation_failures:
        RECOMMEND: Add upstream validation

SECTION 8: Lessons Learned
  DOCUMENT:
    - What went well
    - What went wrong
    - What was unexpected
    - What to improve next time

GENERATE report artifacts:
  - Full execution report (PDF/HTML)
  - Metrics dashboard (interactive)
  - Timeline visualization (Gantt chart)
  - Resource utilization charts
  - Cost breakdown
  - Raw data export (JSON/CSV)
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify result aggregation completeness
EXECUTE:
  1. OUTPUT COMPLETENESS CHECK:
     FOR each workflow_output:
       VERIFY: Output was produced
       VERIFY: Output was collected
       VERIFY: Output was validated
       IF missing:
         INVESTIGATE: Why missing
         MARK: incomplete_results = TRUE
       IF present:
         CONFIRM: Output collected

  2. CALCULATION VERIFICATION:
     RECOMPUTE: All metrics and statistics
     COMPARE: Against reported values
     IF discrepancy:
       INVESTIGATE: Calculation error
       CORRECT: Values
       UPDATE: Report
     IF match:
       CONFIRM: Calculations accurate

  3. DATA INTEGRITY CHECK:
     FOR each aggregated output:
       VERIFY: Hash matches source
       VERIFY: No data corruption
       IF integrity_issue:
         REINGEST: Data from source
         RECOMPUTE: Aggregation
       IF intact:
         CONFIRM: Data integrity maintained

  4. COVERAGE CHECK:
     VERIFY: All tasks accounted for in report
     VERIFY: All incidents documented
     VERIFY: All anomalies explained
     IF gaps:
       COMPLETE: Missing sections
     IF complete:
       CONFIRM: Full coverage

  5. CONSISTENCY CHECK:
     VERIFY: Numbers add up correctly
       total_tasks = completed + failed + skipped
       total_cost = compute + storage + network
     IF inconsistent:
       INVESTIGATE: Discrepancy
       CORRECT: Numbers
     IF consistent:
       CONFIRM: Report internally consistent

  6. RECOMMENDATION VALIDITY CHECK:
     FOR each recommendation:
       VERIFY: Recommendation supported by data
       VERIFY: Recommendation actionable
       IF unsupported:
         REMOVE: Recommendation
       IF valid:
         CONFIRM: Recommendation sound

  7. REPORT:
     "Counter-check executed"
     "Missing outputs investigated: M"
     "Calculation errors corrected: C"
     "Data integrity verified: YES/NO"
     "Coverage gaps filled: G"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Monitoring results loaded from GATE_5?
□ Method 349 executed OR manual aggregation complete?
□ Outputs collected from ALL completed tasks?
□ Results aggregated according to workflow pattern?
□ Workflow-level results computed?
□ Execution report generated with all sections?
□ Counter-check executed?
□ All outputs accounted for?
□ All calculations verified?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_6
```

## 8. GATE_6

```
EVALUATE:
  results_aggregated = TRUE
  workflow_complete = TRUE
  counter_check_executed = TRUE
  report_generated = TRUE

COUNT:
  expected_outputs = FROM workflow definition
  actual_outputs = WHERE output_valid = TRUE
  tasks_completed = WHERE status = COMPLETED
  tasks_total = FROM workflow definition

COMPUTE:
  output_completeness = actual_outputs / expected_outputs
  task_completeness = tasks_completed / tasks_total

IF all TRUE AND output_completeness >= 0.8:
  GATE_6 = OPEN
  OUTPUT: "GATE_6 OPEN - workflow_complete = TRUE, outputs = O, tasks_completed = C/T"
  OUTPUT: "Deep-Orchestration process COMPLETE"
  OUTPUT: "Workflow outcome: [outcome]"
  OUTPUT: "Success rate: [success_rate]%"
  OUTPUT: "Duration: [actual_duration] (planned: [planned_duration])"
  OUTPUT: "Cost: [actual_cost] (budget: [budget])"

IF any FALSE OR output_completeness < 0.8:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED - reason: [which condition failed]"
  OUTPUT: "Output completeness: [percentage]% (threshold: 80%)"
  OUTPUT: "Missing outputs: [expected_outputs - actual_outputs]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without collecting outputs:
  HALT
  OUTPUT: "VIOLATION: Section 3 COLLECT_OUTPUTS required for ALL tasks"
  RETURN to section 3

IF agent skips result aggregation:
  HALT
  OUTPUT: "VIOLATION: Section 4 AGGREGATE_RESULTS required"
  RETURN to section 4

IF agent skips report generation:
  HALT
  OUTPUT: "VIOLATION: Section 5 GENERATE_REPORT required"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6

IF output completeness insufficient:
  HALT
  OUTPUT: "VIOLATION: At least 80% of expected outputs required"
  OUTPUT: "Investigate missing outputs before completing"
  RETURN to section 3
```
