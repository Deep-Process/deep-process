# STEP 2: MAP

## ENFORCED SEQUENCE

```
1. LOAD_WORKFLOW
2. EXECUTE_METHOD_347
3. MAP_DEPENDENCIES
4. ALLOCATE_RESOURCES
5. IDENTIFY_CONSTRAINTS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_2
```

## 1. LOAD_WORKFLOW

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: workflow definition from step-01
LOAD: tasks from step-01
LOAD: data flows from step-01
STORE: orchestration_context
VERIFY: tasks_count >= 1
```

## 2. EXECUTE_METHOD_347

```
IF Method 347 (Process Dependency Mapper) available:
  EXECUTE: method_347.initialize()

  FOR each task:
    EXECUTE: method_347.map_dependencies(task)
    STORE: dependency_graph

  OUTPUT:
```yaml
dependency_mapping:
  method: "Method 347 - Process Dependency Mapper"
  tasks_analyzed: N
  dependencies_found: D
  graph_generated: TRUE
```

ELSE:
  EXECUTE: manual dependency mapping (section 3)
```

## 3. MAP_DEPENDENCIES

```
FOR each task:
  IDENTIFY dependencies:

    DATA dependencies:
      FOR each task input:
        SEARCH: Which task produces this input?
        IF found:
          CREATE: data_dependency
```yaml
data_dependency:
  dependency_id: DEP-001
  type: DATA
  source_task: TSK-001
  target_task: TSK-002
  data_item: OUT-001
  required: YES | NO
```

    CONTROL dependencies:
      ASK: "Must this task wait for another to complete?"
      FOR each preceding task:
        IF task_must_complete_first:
          CREATE: control_dependency
```yaml
control_dependency:
  dependency_id: DEP-002
  type: CONTROL
  source_task: TSK-001
  target_task: TSK-003
  reason: "[why dependency exists]"
  blocking: YES | NO
```

    RESOURCE dependencies:
      ASK: "Does this task require exclusive resource access?"
      FOR each resource:
        IF resource_shared_with_other_tasks:
          CREATE: resource_dependency
```yaml
resource_dependency:
  dependency_id: DEP-003
  type: RESOURCE
  source_task: TSK-001
  target_task: TSK-004
  resource: "[resource name]"
  conflict_type: EXCLUSIVE | SHARED | RATE_LIMITED
```

    TEMPORAL dependencies:
      ASK: "Does this task require specific timing?"
      IF timing_constraint_exists:
        CREATE: temporal_dependency
```yaml
temporal_dependency:
  dependency_id: DEP-004
  type: TEMPORAL
  task: TSK-005
  constraint: EARLIEST_START | LATEST_END | FIXED_TIME | AFTER_DELAY
  value: "[time/duration]"
  reason: "[why timing matters]"
```

  CLASSIFY dependency strength:
    HARD: Task cannot execute without dependency satisfied
    SOFT: Task can execute but may fail or degrade
    OPTIONAL: Task prefers dependency but not required

BUILD dependency graph:
  CREATE: Directed graph G = (V, E)
  WHERE:
    V = set of all tasks
    E = set of all dependencies

  FOR each dependency:
    ADD: Edge from source_task to target_task
    LABEL: Edge with dependency type and strength

  DETECT cycles:
    EXECUTE: Depth-first search for cycles
    IF cycle_detected:
      MARK: circular_dependency = TRUE
      LIST: Tasks in cycle
      ESCALATE: For resolution
    IF no_cycles:
      MARK: acyclic = TRUE

  COMPUTE topological order:
    IF acyclic = TRUE:
      EXECUTE: Topological sort
      STORE: execution_order
    IF cyclic = TRUE:
      HALT: Cannot determine execution order
```

## 4. ALLOCATE_RESOURCES

```
IDENTIFY resource requirements:
  FOR each task:
    EXTRACT resource needs:

      COMPUTE resources:
        - CPU cores
        - Memory (GB)
        - Disk space (GB)
        - Network bandwidth (Mbps)

      STORAGE resources:
        - Database connections
        - File handles
        - Temporary storage

      EXTERNAL resources:
        - API rate limits
        - Third-party service quotas
        - License seats

      HUMAN resources:
        - Required expertise
        - Approval authority
        - Manual intervention

    RECORD resource requirement:
```yaml
resource_requirement:
  task_id: TSK-001
  compute:
    cpu_cores: N
    memory_gb: M
    disk_gb: D
  storage:
    db_connections: C
    file_handles: F
  external:
    api_calls_per_minute: R
    service_quota: Q
  human:
    expertise_required: "[skill]"
    approval_needed: YES | NO
```

ASSESS resource availability:
  INVENTORY: Available resources
```yaml
resource_inventory:
  compute:
    total_cpu_cores: N
    total_memory_gb: M
    total_disk_gb: D
  storage:
    max_db_connections: C
    max_file_handles: F
  external:
    api_rate_limits: [list]
    service_quotas: [list]
  human:
    available_personnel: [list]
```

ALLOCATE resources to tasks:
  FOR each task in execution_order:
    CHECK: Resource availability
    IF resources_available:
      RESERVE: Required resources
      MARK: task_resource_status = ALLOCATED
    IF resources_insufficient:
      MARK: task_resource_status = WAITING
      QUEUE: Task for later allocation

  RECORD allocation:
```yaml
resource_allocation:
  task_id: TSK-001
  allocated_resources:
    cpu_cores: N
    memory_gb: M
    disk_gb: D
  allocation_status: ALLOCATED | WAITING | FAILED
  wait_reason: "[why waiting if applicable]"
```

DETECT resource conflicts:
  FOR each pair of tasks:
    IF both_require_same_exclusive_resource:
      MARK: resource_conflict = TRUE
      RECORD: Conflicting tasks
      RESOLVE: By sequencing or resource addition
```

## 5. IDENTIFY_CONSTRAINTS

```
ANALYZE workflow constraints:

  TIME constraints:
    COMPUTE: Critical path
      EXECUTE: Longest path algorithm on dependency graph
      IDENTIFY: Tasks on critical path
      COMPUTE: Total workflow duration = SUM(critical_path_task_durations)

    IDENTIFY: Deadlines
      FOR each task:
        IF deadline_specified:
          VERIFY: Deadline achievable given dependencies
          IF not_achievable → ESCALATE

    RECORD:
```yaml
time_constraints:
  critical_path: [TSK-001, TSK-003, TSK-005]
  critical_path_duration: "[total duration]"
  workflow_deadline: "[deadline]"
  slack_time: "[deadline - critical_path_duration]"
```

  CAPACITY constraints:
    COMPUTE: Peak resource usage
      FOR each time slice:
        SUM: Resource requirements of concurrent tasks
        TRACK: Maximum concurrent usage

    VERIFY: Peak usage within capacity
      IF peak_usage > capacity:
        MARK: capacity_constraint = TRUE
        OPTIMIZE: Task scheduling or add capacity

    RECORD:
```yaml
capacity_constraints:
  peak_cpu_cores: N
  peak_memory_gb: M
  capacity_exceeded: YES | NO
  mitigation: "[how to resolve if exceeded]"
```

  RATE constraints:
    IDENTIFY: Rate-limited resources
      - API calls per minute
      - Database transactions per second
      - Network throughput

    COMPUTE: Required rate vs available rate
      IF required_rate > available_rate:
        MARK: rate_constraint = TRUE
        SOLUTION: Throttle or batch tasks

    RECORD:
```yaml
rate_constraints:
  resource: "[resource name]"
  required_rate: "[rate]"
  available_rate: "[rate]"
  throttling_needed: YES | NO
```

  ORDERING constraints:
    IDENTIFY: Must-execute-before relationships
    VERIFY: Ordering consistent with dependencies
    IF inconsistency:
      FIX: Dependency graph

  EXCLUSION constraints:
    IDENTIFY: Tasks that cannot run concurrently
    MARK: Mutual exclusion groups
    ENFORCE: Sequencing within groups
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify dependency mapping accuracy
EXECUTE:
  1. MISSING DEPENDENCY CHECK:
     FOR each task:
       ASK: "Are there dependencies I missed?"
       REVIEW: Task inputs and preconditions
       SEARCH: For implicit dependencies
       IF missing_dependency_found:
         ADD: To dependency graph
         RECOMPUTE: Topological order
       IF complete:
         CONFIRM: All dependencies mapped

  2. FALSE DEPENDENCY CHECK:
     FOR each dependency:
       ASK: "Is this dependency real or assumed?"
       TEST: Can target task execute without source task?
       IF not_real_dependency:
         REMOVE: From dependency graph
         UPDATE: Execution order
       IF real:
         CONFIRM: Dependency valid

  3. RESOURCE ALLOCATION CHECK:
     FOR each task WHERE allocation_status = ALLOCATED:
       ASK: "Is resource allocation optimal?"
       CHECK: Resource usage vs task requirements
       IF over_allocated:
         REDUCE: Allocation
       IF under_allocated:
         INCREASE: Allocation
       IF optimal:
         CONFIRM: Allocation appropriate

  4. CIRCULAR DEPENDENCY CHECK:
     VERIFY: No cycles in dependency graph
     IF cycles_exist:
       IDENTIFY: Tasks in cycle
       RESOLVE: By removing or reversing dependencies
       VERIFY: Resolution maintains correctness
     IF no_cycles:
       CONFIRM: Graph acyclic

  5. CONSTRAINT FEASIBILITY CHECK:
     FOR each constraint:
       ASK: "Is this constraint satisfiable?"
       SIMULATE: Workflow execution
       IF constraint_violated:
         RELAX: Constraint or modify workflow
       IF satisfied:
         CONFIRM: Constraint feasible

  6. REPORT:
     "Counter-check executed"
     "Missing dependencies added: M"
     "False dependencies removed: F"
     "Resource allocations optimized: R"
     "Circular dependencies resolved: C"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Workflow loaded from GATE_1?
□ Method 347 executed OR manual dependency mapping complete?
□ ALL task dependencies mapped?
□ Dependency graph is acyclic?
□ Resources allocated to ALL tasks?
□ Resource conflicts identified and resolved?
□ Constraints identified and validated?
□ Counter-check executed?
□ All dependencies verified?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## 8. GATE_2

```
EVALUATE:
  dependencies_mapped = TRUE
  resources_allocated = TRUE
  counter_check_executed = TRUE
  dependency_graph_acyclic = TRUE

COUNT:
  total_dependencies = COUNT(dependency_id)
  circular_dependencies = COUNT cycles in graph
  tasks_with_resources = WHERE allocation_status = ALLOCATED
  tasks_without_resources = WHERE allocation_status = WAITING OR FAILED

IF all TRUE AND circular_dependencies = 0 AND tasks_without_resources = 0:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - dependencies = D, resources_allocated = ALL, graph_acyclic = TRUE"
  PROCEED to workflow.md for next step

IF any FALSE OR circular_dependencies > 0 OR tasks_without_resources > 0:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  OUTPUT: "Circular dependencies: [count]"
  OUTPUT: "Tasks without resources: [count]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without dependency mapping:
  HALT
  OUTPUT: "VIOLATION: Section 3 MAP_DEPENDENCIES required for ALL tasks"
  RETURN to section 3

IF agent skips resource allocation:
  HALT
  OUTPUT: "VIOLATION: Section 4 ALLOCATE_RESOURCES required"
  RETURN to section 4

IF agent skips constraint identification:
  HALT
  OUTPUT: "VIOLATION: Section 5 IDENTIFY_CONSTRAINTS required"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
