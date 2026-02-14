# STEP 5: MONITOR

## ENFORCED SEQUENCE

```
1. LOAD_EXECUTION_STATE
2. TRACK_PROGRESS
3. DETECT_ANOMALIES
4. HANDLE_INCIDENTS
5. ADJUST_EXECUTION
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. LOAD_EXECUTION_STATE

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

LOAD: Workflow execution state from step-04
LOAD: Task states from step-04
LOAD: Execution timeline from step-03
STORE: monitoring_context
VERIFY: state_tracking_active = TRUE
```

## 2. TRACK_PROGRESS

```
CONTINUOUSLY monitor execution:

  TASK-LEVEL monitoring:
    FOR each task WHERE status = RUNNING:
      TRACK metrics:
```yaml
task_metrics:
  task_id: TSK-001
  execution_id: EXEC-[timestamp]
  current_status: RUNNING
  elapsed_time: "[duration since start]"
  estimated_remaining_time: "[estimate]"
  progress_percentage: N%
  resource_usage:
    cpu_usage: N%
    memory_usage: M MB
    disk_io: D IOPS
    network_io: B Mbps
  health_status: HEALTHY | DEGRADED | CRITICAL
  last_heartbeat: "[timestamp]"
```

      DETECT: Stuck tasks
        IF last_heartbeat > heartbeat_timeout:
          MARK: task_health = CRITICAL
          ESCALATE: For investigation

        IF elapsed_time > estimated_duration * 1.5:
          MARK: task_running_long = TRUE
          CHECK: Still making progress

        IF progress_percentage unchanged for timeout_period:
          MARK: task_stuck = TRUE
          INVESTIGATE: Root cause

  WORKFLOW-LEVEL monitoring:
    AGGREGATE: All task metrics
```yaml
workflow_metrics:
  workflow_id: WF-001
  execution_id: EXEC-[timestamp]
  current_stage: N
  total_stages: S
  overall_progress: N%
  tasks_completed: C
  tasks_failed: F
  tasks_running: R
  tasks_pending: P
  elapsed_time: "[duration since start]"
  estimated_completion_time: "[timestamp]"
  on_schedule: YES | NO
  schedule_variance: "[ahead/behind by duration]"
  total_resource_usage:
    cpu: N%
    memory: M GB
    cost_accrued: "[currency amount]"
```

  DEPENDENCY monitoring:
    FOR each active task:
      VERIFY: Dependency states
      IF dependency_failed:
        PREDICT: Impact on current task
        DECIDE: Continue, abort, or switch to fallback

  RESOURCE monitoring:
    FOR each allocated resource:
      MEASURE: Utilization
      DETECT: Exhaustion or contention
      PREDICT: Future resource needs

  RECORD monitoring data:
    WRITE: Metrics to time-series database
    UPDATE: Monitoring dashboards
    TRIGGER: Alerts if thresholds exceeded
```

## 3. DETECT_ANOMALIES

```
ANALYZE: Execution patterns for anomalies

  PERFORMANCE anomalies:
    FOR each task:
      COMPARE: Actual duration vs estimated duration
      IF actual > estimated * 2:
        MARK: performance_anomaly = TRUE
        CLASSIFY: Anomaly type
          - Resource contention
          - Unexpected data volume
          - External service degradation
          - Algorithm inefficiency

      DETECT: Resource usage spikes
        IF cpu_usage > threshold:
          anomaly_type = CPU_SPIKE
        IF memory_usage > threshold:
          anomaly_type = MEMORY_LEAK
        IF disk_io > threshold:
          anomaly_type = IO_BOTTLENECK

  CORRECTNESS anomalies:
    FOR each task:
      VALIDATE: Outputs against expected schema
      IF schema_mismatch:
        MARK: correctness_anomaly = TRUE
        INVESTIGATE: Why output unexpected

      CHECK: Invariants
        IF invariant_violated:
          MARK: invariant_violation = TRUE
          HALT: Task or workflow if critical

  BEHAVIORAL anomalies:
    DETECT: Unusual patterns
      - Task retrying excessively
      - Task producing no output
      - Task consuming all available resources
      - Task communicating with unexpected endpoints

    FOR each unusual_pattern:
      CLASSIFY: Severity
      IF high_severity:
        ALERT: Operations team
        CONSIDER: Stopping task

  SECURITY anomalies:
    MONITOR: For suspicious activity
      - Unauthorized access attempts
      - Data exfiltration
      - Privilege escalation
      - Malicious code execution

    IF security_event_detected:
      HALT: Affected tasks immediately
      ISOLATE: Affected resources
      ESCALATE: To security team

  RECORD anomalies:
```yaml
anomaly:
  anomaly_id: ANOM-001
  detection_time: "[timestamp]"
  anomaly_type: PERFORMANCE | CORRECTNESS | BEHAVIORAL | SECURITY
  severity: CRITICAL | HIGH | MEDIUM | LOW
  affected_tasks: [TSK-001, TSK-003]
  description: "[what was detected]"
  metrics: "[relevant metric values]"
  root_cause_hypothesis: "[initial diagnosis]"
```
```

## 4. HANDLE_INCIDENTS

```
FOR each anomaly WHERE severity = CRITICAL OR HIGH:
  CREATE incident:
```yaml
incident:
  incident_id: INC-001
  anomaly_id: ANOM-001
  creation_time: "[timestamp]"
  severity: CRITICAL | HIGH
  status: OPEN
  affected_tasks: [TSK-001]
  affected_resources: [CPU-01, MEM-02]
  impact: "[description of impact]"
  assigned_to: "[who is handling]"
```

  CLASSIFY incident type:
    TASK_FAILURE: Task failed or failing
    PERFORMANCE_DEGRADATION: Task running slow
    RESOURCE_EXHAUSTION: Resources depleted
    EXTERNAL_DEPENDENCY_FAILURE: External service down
    DATA_CORRUPTION: Data integrity issue
    SECURITY_BREACH: Security incident

  EXECUTE incident response:

    IF incident_type = TASK_FAILURE:
      CHECK: Retry policy
      IF retries_available:
        RETRY: Task with backoff
      IF retries_exhausted:
        EXECUTE: Failure handling from step-04
        INVOKE: Fallback if available

    IF incident_type = PERFORMANCE_DEGRADATION:
      DIAGNOSE: Bottleneck
      IF resource_contention:
        REALLOCATE: Resources to task
        DELAY: Lower priority tasks
      IF external_slowness:
        INCREASE: Timeout
        ADD: Caching if applicable

    IF incident_type = RESOURCE_EXHAUSTION:
      FREE: Resources from completed tasks
      SCALE: Resources if auto-scaling available
      DELAY: Pending tasks until resources available
      IF critical_exhaustion:
        PAUSE: Workflow until resolved

    IF incident_type = EXTERNAL_DEPENDENCY_FAILURE:
      RETRY: With exponential backoff
      SWITCH: To backup endpoint if available
      SKIP: Task if non-critical
      WAIT: For dependency recovery

    IF incident_type = DATA_CORRUPTION:
      HALT: Affected task
      ROLLBACK: To last valid checkpoint
      INVESTIGATE: Corruption source
      FIX: Corrupted data
      RESUME: From checkpoint

    IF incident_type = SECURITY_BREACH:
      HALT: All affected tasks immediately
      ISOLATE: Compromised resources
      REVOKE: Credentials
      ALERT: Security team
      PRESERVE: Evidence
      AWAIT: Security clearance before resuming

  TRACK incident resolution:
    UPDATE: incident.status = IN_PROGRESS
    RECORD: Actions taken
    MONITOR: Resolution effectiveness
    IF resolved:
      UPDATE: incident.status = RESOLVED
      RECORD: Resolution time and method
    IF not_resolved:
      ESCALATE: To higher tier support

  RECORD incident:
```yaml
incident_resolution:
  incident_id: INC-001
  resolution_time: "[timestamp]"
  resolution_method: "[how resolved]"
  actions_taken: ["action1", "action2"]
  successful: YES | NO
  time_to_resolve: "[duration]"
  prevented_recurrence: YES | NO
```
```

## 5. ADJUST_EXECUTION

```
APPLY runtime optimizations based on observations:

  RESOURCE reallocation:
    FOR each task:
      IF under_utilizing_resources:
        REDUCE: Resource allocation
        REALLOCATE: To resource-starved tasks

      IF over_utilizing_resources:
        INCREASE: Resource allocation if available
        THROTTLE: Task if resources unavailable

  SCHEDULE adjustment:
    IF critical_path_delayed:
      PRIORITIZE: Critical path tasks
      DELAY: Non-critical tasks
      ALLOCATE: Maximum resources to critical path

    IF ahead_of_schedule:
      ADVANCE: Pending tasks
      INCREASE: Parallelization if possible

  TIMEOUT adjustment:
    FOR each task_type:
      COMPUTE: Actual average duration
      IF actual_duration > estimated_duration:
        UPDATE: Timeout to actual_duration * 1.5
        PREVENT: Premature timeouts

  RETRY policy adjustment:
    FOR each task_type:
      ANALYZE: Retry success rate
      IF retry_often_succeeds:
        INCREASE: Max retry attempts
      IF retry_rarely_succeeds:
        DECREASE: Max retry attempts to fail faster

  PARALLELIZATION adjustment:
    IF resources_underutilized:
      INCREASE: Parallel task execution
      START: More tasks simultaneously

    IF resources_overutilized:
      DECREASE: Parallel task execution
      SERIALIZE: Some task execution

  RECORD adjustments:
```yaml
runtime_adjustment:
  adjustment_id: ADJ-001
  adjustment_time: "[timestamp]"
  adjustment_type: RESOURCE | SCHEDULE | TIMEOUT | RETRY | PARALLELIZATION
  reason: "[why adjustment made]"
  changes_made: "[specific changes]"
  expected_impact: "[predicted improvement]"
```
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify monitoring effectiveness
EXECUTE:
  1. MONITORING COVERAGE CHECK:
     FOR each task:
       VERIFY: Task being monitored
       VERIFY: Metrics being collected
       IF not_monitored:
         ENABLE: Monitoring for task
         BACKFILL: Metrics if possible
       IF monitored:
         CONFIRM: Coverage complete

  2. ALERT ACCURACY CHECK:
     REVIEW: Recent alerts
     FOR each alert:
       VERIFY: Alert was valid (not false positive)
       VERIFY: Alert was actionable
       IF false_positive:
         TUNE: Alert threshold
         REDUCE: Alert noise
       IF valid:
         CONFIRM: Alert accurate

  3. INCIDENT RESPONSE CHECK:
     FOR each incident:
       VERIFY: Incident was handled
       VERIFY: Resolution was effective
       IF not_handled:
         ESCALATE: Immediately
       IF ineffective_resolution:
         RETRY: Different resolution approach
       IF handled_effectively:
         CONFIRM: Response adequate

  4. ANOMALY DETECTION CHECK:
     ASK: "Are there undetected anomalies?"
     SEARCH: For patterns not caught by automated detection
     IF undetected_anomalies_found:
       ADD: Detection rules
       INVESTIGATE: Why missed
     IF none_found:
       CONFIRM: Detection comprehensive

  5. ADJUSTMENT EFFECTIVENESS CHECK:
     FOR each runtime_adjustment:
       MEASURE: Impact of adjustment
       VERIFY: Improvement achieved
       IF no_improvement:
         REVERT: Adjustment
         TRY: Alternative approach
       IF improved:
         CONFIRM: Adjustment beneficial

  6. REPORT:
     "Counter-check executed at [timestamp]"
     "Monitoring gaps closed: M"
     "False positive alerts tuned: F"
     "Unhandled incidents escalated: I"
     "Undetected anomalies found: A"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Execution state loaded from GATE_4?
□ Progress tracking active for ALL tasks?
□ Anomaly detection running?
□ Incidents detected and handled?
□ Runtime adjustments applied based on observations?
□ Counter-check executed?
□ All tasks monitored?
□ All incidents resolved or escalated?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## 8. GATE_5

```
EVALUATE:
  monitoring_complete = TRUE
  failures_handled = TRUE
  counter_check_executed = TRUE
  workflow_status = FINISHING OR COMPLETED OR ABORTED

COUNT:
  total_incidents = COUNT(incident_id)
  incidents_resolved = WHERE status = RESOLVED
  incidents_open = WHERE status = OPEN
  anomalies_detected = COUNT(anomaly_id)

IF all TRUE AND workflow_status != RUNNING:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - monitoring_complete = TRUE, incidents = I, resolved = R, anomalies = A"
  PROCEED to workflow.md for next step

IF any FALSE OR workflow_status = RUNNING:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  OUTPUT: "Workflow still executing, monitoring continues"
  CONTINUE: Monitoring until workflow completes
```

## VIOLATION RECOVERY

```
IF agent proceeds without progress tracking:
  HALT
  OUTPUT: "VIOLATION: Section 2 TRACK_PROGRESS required"
  RETURN to section 2

IF agent skips anomaly detection:
  HALT
  OUTPUT: "VIOLATION: Section 3 DETECT_ANOMALIES required"
  RETURN to section 3

IF agent skips incident handling:
  HALT
  OUTPUT: "VIOLATION: Section 4 HANDLE_INCIDENTS required for ALL incidents"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
