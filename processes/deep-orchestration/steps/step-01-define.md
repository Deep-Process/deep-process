# STEP 1: DEFINE

## ENFORCED SEQUENCE

```
1. LOAD_INPUT
2. DECLARE_INTERPRETATION
3. EXTRACT_TASKS
4. DEFINE_WORKFLOW
5. SPECIFY_INPUTS_OUTPUTS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_1
```

## 1. LOAD_INPUT

```
READ: Input (workflow requirements / process description / task list)
STORE: input_text
VERIFY: input_text.length > 0
IF input_text.length = 0 → HALT with "ERROR: No input provided"
```

## 2. DECLARE_INTERPRETATION

```
OUTPUT: "INTERPRETATION:"
LIST: What workflow is being orchestrated
LIST: What tasks are identified
LIST: What the goal of the workflow is
LIST: What is ambiguous or unclear
WAIT: User confirmation or correction
IF user corrects → UPDATE interpretation → RESTART from 2
IF user confirms → PROCEED to 3
```

## 3. EXTRACT_TASKS

```
SCAN: input_text
IDENTIFY: Every discrete task or process

FOR each task:
  EXTRACT:
    - Task name/identifier
    - Task description
    - Task type (process, script, API call, manual action)
    - Expected inputs
    - Expected outputs
    - Success criteria
    - Failure modes

  CLASSIFY task type:
    ATOMIC: Single indivisible operation
    COMPOSITE: Contains sub-tasks
    PROCESS: Invokes another process
    MANUAL: Requires human action
    AUTOMATED: Fully automated

  CLASSIFY task criticality:
    CRITICAL: Workflow fails if this fails
    ESSENTIAL: Major workflow degradation if fails
    OPTIONAL: Workflow continues if fails
    BEST_EFFORT: Failure is acceptable

  OUTPUT format per task:
```yaml
task_id: TSK-001
name: "[task name]"
description: "[what this task does]"
type: ATOMIC | COMPOSITE | PROCESS | MANUAL | AUTOMATED
criticality: CRITICAL | ESSENTIAL | OPTIONAL | BEST_EFFORT
inputs:
  - input_id: INP-001
    name: "[input name]"
    type: "[data type]"
    required: YES | NO
    source: "[where input comes from]"
outputs:
  - output_id: OUT-001
    name: "[output name]"
    type: "[data type]"
    destination: "[where output goes]"
success_criteria: "[how to determine success]"
failure_modes: ["mode1", "mode2"]
estimated_duration: "[time estimate]"
```

REQUIREMENT: Extract ALL tasks, not subset
VIOLATION: Extracting "main" tasks only is VIOLATION
EXECUTE: Until no more tasks found
```

## 4. DEFINE_WORKFLOW

```
CREATE workflow definition:

IDENTIFY workflow pattern:
  SEQUENTIAL: Tasks execute one after another
  PARALLEL: Tasks execute simultaneously
  CONDITIONAL: Tasks execute based on conditions
  ITERATIVE: Tasks repeat until condition met
  HYBRID: Combination of above

DEFINE workflow structure:
```yaml
workflow_id: WF-001
name: "[workflow name]"
description: "[workflow purpose]"
pattern: SEQUENTIAL | PARALLEL | CONDITIONAL | ITERATIVE | HYBRID
goal: "[what workflow achieves]"
tasks: [TSK-001, TSK-002, TSK-003, ...]
entry_point: TSK-001
exit_criteria: "[when workflow completes]"
```

FOR each task in workflow:
  DEFINE task relationship:

    SEQUENCE relationships:
      IF task B follows task A:
        RECORD: TSK-A → TSK-B
        TYPE: sequential_dependency

    PARALLEL relationships:
      IF tasks execute simultaneously:
        RECORD: TSK-A || TSK-B
        TYPE: parallel_group

    CONDITIONAL relationships:
      IF task execution depends on condition:
        RECORD: IF condition THEN TSK-A ELSE TSK-B
        TYPE: conditional_branch

    ITERATIVE relationships:
      IF task repeats:
        RECORD: WHILE condition DO TSK-A
        TYPE: loop

  RECORD relationship:
```yaml
relationship:
  relationship_id: REL-001
  type: SEQUENTIAL | PARALLEL | CONDITIONAL | ITERATIVE
  source_task: TSK-001
  target_task: TSK-002
  condition: "[condition if applicable]"
  loop_variable: "[variable if iterative]"
```

DEFINE workflow boundaries:
  START: First task to execute
  END: Task that completes workflow
  SUCCESS_PATH: Tasks that lead to success
  FAILURE_PATH: Tasks that handle failures
  TIMEOUT: Maximum workflow duration
  RETRY_POLICY: How to handle task failures
```

## 5. SPECIFY_INPUTS_OUTPUTS

```
IDENTIFY workflow-level inputs:
  FOR each task:
    FOR each input:
      IF input.source = EXTERNAL:
        ADD to workflow_inputs

  DEDUPLICATE: workflow_inputs

  FOR each workflow_input:
    SPECIFY:
```yaml
workflow_input:
  input_id: WF-INP-001
  name: "[input name]"
  type: "[data type]"
  required: YES | NO
  default_value: "[default if optional]"
  validation: "[validation rules]"
  source: "[where input comes from]"
  used_by_tasks: [TSK-001, TSK-003]
```

IDENTIFY workflow-level outputs:
  FOR each task:
    FOR each output:
      IF output.destination = EXTERNAL:
        ADD to workflow_outputs

  FOR each workflow_output:
    SPECIFY:
```yaml
workflow_output:
  output_id: WF-OUT-001
  name: "[output name]"
  type: "[data type]"
  source_task: TSK-005
  format: "[output format]"
  destination: "[where output is delivered]"
```

MAP internal data flow:
  FOR each task output:
    FOR each task input:
      IF output feeds input:
        CREATE: data_flow mapping
```yaml
data_flow:
  flow_id: FLOW-001
  source_task: TSK-001
  source_output: OUT-001
  target_task: TSK-002
  target_input: INP-002
  transformation: "[any transformation needed]"
```

VERIFY data flow completeness:
  FOR each task:
    FOR each required input:
      VERIFY: Input has source
      IF no_source → MARK: missing_input = TRUE
      IF has_source → CONFIRM
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Attempt to disprove workflow definition
EXECUTE:
  1. COMPLETENESS CHECK:
     ASK: "Are there missing tasks?"
     REVIEW: Workflow from start to end
     SEARCH: For implicit tasks not explicitly mentioned
     IF missing_tasks_found:
       ADD: To task list
       UPDATE: Workflow definition
     IF complete:
       CONFIRM: All tasks identified

  2. REDUNDANCY CHECK:
     FOR each task:
       ASK: "Is this task necessary?"
       ASK: "Could this be combined with another task?"
       IF redundant:
         REMOVE: Or combine with other task
         UPDATE: Workflow
       IF necessary:
         CONFIRM: Task required

  3. DEPENDENCY CHECK:
     FOR each task relationship:
       ASK: "Is this relationship correct?"
       VERIFY: Source task output matches target task input
       IF mismatch:
         FIX: Relationship or add transformation
       IF match:
         CONFIRM: Relationship valid

  4. DATA FLOW CHECK:
     FOR each data flow:
       ASK: "Could there be a data flow I missed?"
       TRACE: Data from workflow input to workflow output
       IF gaps_in_flow:
         ADD: Missing data flows
       IF complete:
         CONFIRM: Data flow complete

  5. EXIT CRITERIA CHECK:
     ASK: "Are all possible outcomes covered?"
     LIST: All possible workflow end states
     VERIFY: Each end state has exit criteria
     IF missing_criteria:
       ADD: Exit criteria
     IF complete:
       CONFIRM: All outcomes defined

  6. REPORT:
     "Counter-check executed"
     "Missing tasks added: M"
     "Redundant tasks removed: R"
     "Data flow gaps closed: D"
     "Exit criteria added: E"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Input loaded and verified?
□ Interpretation declared and confirmed?
□ ALL tasks extracted (not just main tasks)?
□ Workflow structure defined?
□ Workflow pattern identified?
□ Workflow-level inputs and outputs specified?
□ Internal data flows mapped?
□ All required inputs have sources?
□ Counter-check executed?
□ Missing tasks added?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## 8. GATE_1

```
EVALUATE:
  workflow_defined = TRUE
  tasks_count >= 1
  counter_check_executed = TRUE
  data_flow_complete = TRUE

COUNT:
  total_tasks = COUNT(task_id)
  critical_tasks = WHERE criticality = CRITICAL
  missing_inputs = WHERE required_input has no source

IF all TRUE AND missing_inputs = 0:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - tasks = N, critical = C, workflow_pattern = P"
  PROCEED to workflow.md for next step

IF any FALSE OR missing_inputs > 0:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - reason: [which condition failed]"
  OUTPUT: "Missing inputs: [count]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without declaring interpretation:
  HALT
  OUTPUT: "VIOLATION: Section 2 DECLARE_INTERPRETATION required"
  RETURN to section 2

IF agent extracts subset of tasks:
  HALT
  OUTPUT: "VIOLATION: ALL tasks required, not subset"
  RETURN to section 3

IF agent skips workflow definition:
  HALT
  OUTPUT: "VIOLATION: Section 4 DEFINE_WORKFLOW required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6

IF agent proceeds before GATE_1 = OPEN:
  HALT
  OUTPUT: "VIOLATION: GATE_1 not open"
  RETURN to section 7 CHECKLIST
```
