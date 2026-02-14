# STEP 3: SEQUENCE

## ENFORCED SEQUENCE

```
1. LOAD_DEPENDENCIES
2. EXECUTE_METHOD_348
3. IDENTIFY_PARALLELIZATION
4. OPTIMIZE_SEQUENCE
5. GENERATE_EXECUTION_PLAN
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_3
```

## 1. LOAD_DEPENDENCIES

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: dependency graph from step-02
LOAD: resource allocations from step-02
LOAD: constraints from step-02
STORE: sequencing_context
VERIFY: dependency_graph_acyclic = TRUE
```

## 2. EXECUTE_METHOD_348

```
IF Method 348 (Parallel Execution Optimizer) available:
  EXECUTE: method_348.initialize()

  INPUT: dependency_graph, resource_allocations, constraints
  EXECUTE: method_348.optimize_parallelism()
  STORE: optimization_result

  OUTPUT:
```yaml
parallelization_optimization:
  method: "Method 348 - Parallel Execution Optimizer"
  parallel_groups_identified: N
  execution_stages: S
  estimated_speedup: "[factor]"
```

ELSE:
  EXECUTE: manual parallelization (section 3)
```

## 3. IDENTIFY_PARALLELIZATION

```
PARTITION tasks into levels:
  EXECUTE: Level-based topological sort

  LEVEL 0: Tasks with no dependencies
    IDENTIFY: Tasks with in-degree = 0
    GROUP: As level_0
    MARK: Can execute immediately

  FOR each subsequent level:
    IDENTIFY: Tasks whose dependencies are all in previous levels
    GROUP: As level_N
    MARK: Can execute after level_(N-1) completes

  RECORD levels:
```yaml
execution_level:
  level: 0
  tasks: [TSK-001, TSK-002]
  can_execute_in_parallel: YES
  dependencies_satisfied: NONE
```

FOR each level:
  IDENTIFY parallelization opportunities:

    INDEPENDENT tasks:
      FOR each pair of tasks in level:
        CHECK: Shared dependencies
        CHECK: Resource conflicts
        CHECK: Ordering constraints

        IF no_conflicts:
          MARK: tasks_independent = TRUE
          GROUP: In parallel_group

    DEPENDENT tasks:
      IF tasks_share_exclusive_resource:
        MARK: tasks_sequential = TRUE
        SEQUENCE: By priority or resource efficiency

  CREATE parallel groups:
```yaml
parallel_group:
  group_id: PG-001
  level: 0
  tasks: [TSK-001, TSK-003, TSK-005]
  parallelization: FULL | PARTIAL | NONE
  resource_requirements:
    total_cpu: N
    total_memory: M
  estimated_duration: "[max task duration in group]"
```

COMPUTE parallelization metrics:
  total_sequential_time = SUM(all_task_durations)
  critical_path_time = SUM(critical_path_task_durations)
  theoretical_speedup = total_sequential_time / critical_path_time
  resource_limited_speedup = "[based on resource constraints]"
```

## 4. OPTIMIZE_SEQUENCE

```
APPLY optimization strategies:

  STRATEGY 1: Maximize parallelism
    FOR each level:
      COUNT: Tasks that can run in parallel
      VERIFY: Resource capacity sufficient
      IF capacity_sufficient:
        SCHEDULE: All tasks in parallel
      IF capacity_insufficient:
        PARTITION: Into batches
        SCHEDULE: Batches sequentially

  STRATEGY 2: Minimize critical path
    IDENTIFY: Critical path tasks
    FOR each critical_path_task:
      PRIORITIZE: Resource allocation
      SCHEDULE: As early as possible
      MINIMIZE: Wait time

  STRATEGY 3: Balance resource utilization
    FOR each time slice:
      COMPUTE: Resource usage
      IF under_utilized:
        SCHEDULE: Additional tasks if dependencies allow
      IF over_utilized:
        DELAY: Non-critical tasks

  STRATEGY 4: Respect rate limits
    FOR each rate_limited_resource:
      GROUP: Tasks using resource
      COMPUTE: Required rate
      IF exceeds_limit:
        BATCH: Tasks to stay within limit
        ADD: Delays between batches

  STRATEGY 5: Minimize data transfer
    FOR tasks_with_large_data_flow:
      SCHEDULE: On same resources when possible
      COLOCATE: Producer and consumer tasks
      MINIMIZE: Cross-network data transfer

SELECT optimization objective:
  MINIMIZE: Total execution time (default)
  MINIMIZE: Resource cost
  MINIMIZE: Energy consumption
  MAXIMIZE: Throughput
  BALANCE: Multiple objectives

APPLY selected optimization:
  EXECUTE: Optimization algorithm
  GENERATE: Optimized sequence
  VERIFY: Constraints still satisfied
  COMPARE: Against baseline (sequential execution)

RECORD optimization result:
```yaml
optimization_result:
  objective: MINIMIZE_TIME | MINIMIZE_COST | MAXIMIZE_THROUGHPUT
  baseline_duration: "[sequential execution time]"
  optimized_duration: "[parallel execution time]"
  speedup: "[factor]"
  resource_efficiency: "[percentage]"
  constraints_satisfied: TRUE | FALSE
```
```

## 5. GENERATE_EXECUTION_PLAN

```
CREATE detailed execution plan:

FOR each execution level:
  FOR each parallel group:
    FOR each task in group:
      DEFINE execution specification:
```yaml
execution_spec:
  task_id: TSK-001
  execution_order: N
  level: L
  parallel_group: PG-001
  start_condition: "[when task can start]"
  dependencies:
    required_tasks_completed: [TSK-000]
    required_data_available: [OUT-000]
    required_resources_available: [CPU, MEM]
  allocated_resources:
    cpu_cores: N
    memory_gb: M
    executor: "[where task runs]"
  estimated_start_time: "[time offset from workflow start]"
  estimated_duration: "[duration]"
  estimated_end_time: "[start + duration]"
  timeout: "[max allowed duration]"
  retry_policy:
    max_attempts: N
    backoff: EXPONENTIAL | LINEAR | FIXED
    retry_delay: "[delay between retries]"
  failure_handling:
    on_failure: RETRY | SKIP | ABORT_WORKFLOW | CONTINUE
    fallback_task: TSK-XXX
  success_criteria: "[how to determine success]"
```

CREATE execution timeline:
  SORT: All tasks by estimated_start_time
  PLOT: Timeline showing:
    - Task execution windows
    - Parallel execution periods
    - Resource utilization over time
    - Critical path highlighted

  RECORD timeline:
```yaml
execution_timeline:
  total_duration: "[time]"
  stages:
    - stage: 1
      start_time: 0
      end_time: T1
      parallel_tasks: [TSK-001, TSK-002]
      resource_usage:
        cpu: N%
        memory: M%
    - stage: 2
      start_time: T1
      end_time: T2
      parallel_tasks: [TSK-003, TSK-004, TSK-005]
      resource_usage:
        cpu: N%
        memory: M%
```

DEFINE coordination mechanisms:
  SYNCHRONIZATION points:
    FOR each level boundary:
      CREATE: Barrier
      WAIT: All tasks in level complete before proceeding

  DATA handoff:
    FOR each data_flow:
      CREATE: Data transfer mechanism
      VERIFY: Producer completes before consumer starts

  RESOURCE locks:
    FOR each exclusive_resource:
      CREATE: Lock acquisition/release protocol
      SEQUENCE: Tasks requiring lock

  ERROR propagation:
    DEFINE: How errors propagate through workflow
    CREATE: Error handling paths

GENERATE execution artifacts:
  - Execution plan document (YAML/JSON)
  - Gantt chart visualization
  - Dependency graph diagram
  - Resource utilization chart
  - Timeline animation
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify execution plan correctness
EXECUTE:
  1. DEPENDENCY PRESERVATION CHECK:
     FOR each dependency:
       VERIFY: Source task executes before target task
       IF violated:
         FIX: Task ordering
         REGENERATE: Execution plan
       IF preserved:
         CONFIRM: Dependency respected

  2. RESOURCE CONSTRAINT CHECK:
     FOR each time slice:
       SUM: Allocated resources
       VERIFY: Total <= available capacity
       IF exceeded:
         RESCHEDULE: Tasks to reduce peak usage
       IF within_capacity:
         CONFIRM: Resource constraints met

  3. PARALLELIZATION SAFETY CHECK:
     FOR each parallel group:
       VERIFY: Tasks are truly independent
       TEST: No hidden dependencies
       TEST: No resource conflicts
       IF unsafe:
         SPLIT: Group into sequential tasks
       IF safe:
         CONFIRM: Safe to parallelize

  4. CRITICAL PATH CHECK:
     RECOMPUTE: Critical path
     VERIFY: Optimization didn't lengthen critical path
     IF lengthened:
       INVESTIGATE: Why
       REOPTIMIZE: If possible
     IF maintained_or_shortened:
       CONFIRM: Optimization valid

  5. FEASIBILITY CHECK:
     SIMULATE: Execution plan
     DETECT: Deadlocks, race conditions, bottlenecks
     IF issues_found:
       FIX: Plan issues
       RESIMULATE: After fixes
     IF no_issues:
       CONFIRM: Plan feasible

  6. OPTIMIZATION VERIFICATION:
     COMPARE: Optimized vs baseline execution time
     VERIFY: Speedup achieved
     VERIFY: No correctness sacrificed for speed
     IF optimization_invalid:
       REVERT: To conservative plan
     IF valid:
       CONFIRM: Optimization beneficial

  7. REPORT:
     "Counter-check executed"
     "Dependency violations fixed: D"
     "Resource conflicts resolved: R"
     "Unsafe parallelization prevented: P"
     "Critical path maintained: YES/NO"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Dependencies loaded from GATE_2?
□ Method 348 executed OR manual optimization complete?
□ Parallelization opportunities identified for ALL levels?
□ Execution sequence optimized?
□ Execution plan generated with all task specifications?
□ Timeline created?
□ Coordination mechanisms defined?
□ Counter-check executed?
□ All dependencies preserved in execution plan?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## 8. GATE_3

```
EVALUATE:
  execution_sequence_defined = TRUE
  parallelization_optimized = TRUE
  counter_check_executed = TRUE
  execution_plan_valid = TRUE

COUNT:
  total_tasks = COUNT(task_id)
  tasks_in_plan = COUNT(execution_spec)
  parallel_groups = COUNT(parallel_group)
  execution_stages = COUNT(distinct level)

COMPUTE:
  speedup = baseline_duration / optimized_duration

IF all TRUE AND tasks_in_plan = total_tasks AND speedup >= 1.0:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - tasks = N, stages = S, speedup = Fx, parallel_groups = P"
  PROCEED to workflow.md for next step

IF any FALSE OR tasks_in_plan < total_tasks OR speedup < 1.0:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  OUTPUT: "Tasks missing from plan: [total_tasks - tasks_in_plan]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without parallelization analysis:
  HALT
  OUTPUT: "VIOLATION: Section 3 IDENTIFY_PARALLELIZATION required"
  RETURN to section 3

IF agent skips optimization:
  HALT
  OUTPUT: "VIOLATION: Section 4 OPTIMIZE_SEQUENCE required"
  RETURN to section 4

IF agent generates incomplete execution plan:
  HALT
  OUTPUT: "VIOLATION: Section 5 requires execution spec for ALL tasks"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
