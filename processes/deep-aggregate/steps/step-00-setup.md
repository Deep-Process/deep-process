# STEP 0: SETUP

## ENFORCED SEQUENCE

```
1. LOAD_WORKFLOW_INPUT
2. LOAD_SCHEMAS
3. VERIFY_PREREQUISITES
4. INITIALIZE_STATE
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_0
```

## 1. LOAD_WORKFLOW_INPUT

```
LOAD: workflow_input.yaml
PARSE: AS YAML
VERIFY: File exists and is valid YAML

EXTRACT:
  workflow_id: FROM workflow_input.workflow_id
  execution_id: FROM workflow_input.execution_id
  task_states: FROM workflow_input.task_states
  workflow_metadata: FROM workflow_input.workflow_metadata
  monitoring_data: FROM workflow_input.monitoring_data

STORE: In aggregation_context
```

## 2. LOAD_SCHEMAS

```
LOAD: data/output-schema.yaml
PARSE: AS YAML
STORE: validation_schemas

LOAD: data/decision-brief-template.yaml
PARSE: AS YAML
STORE: brief_template

LOAD: data/metric-formulas.yaml
PARSE: AS YAML
STORE: metric_formulas

VERIFY: All schema files loaded successfully
```

## 3. VERIFY_PREREQUISITES

```
VERIFY: workflow_id is NOT_EMPTY
  IF empty → HALT with "ERROR: workflow_id required"

VERIFY: execution_id is NOT_EMPTY
  IF empty → HALT with "ERROR: execution_id required"

VERIFY: task_states is ARRAY with MIN_LENGTH 1
  IF invalid → HALT with "ERROR: At least 1 task required"

VERIFY: workflow_metadata.goal is NOT_EMPTY
  IF empty → HALT with "ERROR: Workflow goal required"

COUNT: completed_tasks WHERE status = COMPLETED
VERIFY: completed_tasks >= 1
  IF zero → HALT with "ERROR: At least 1 completed task required for aggregation"
```

## 4. INITIALIZE_STATE

```
CREATE: aggregation_state
  workflow_id: FROM aggregation_context.workflow_id
  execution_id: FROM aggregation_context.execution_id
  start_time: CURRENT_TIMESTAMP
  status: "IN_PROGRESS"

  tasks_to_aggregate: []
  outputs_collected: []
  critical_issues: []

  metrics:
    total_tasks: 0
    completed_tasks: 0
    failed_tasks: 0
    valid_outputs: 0
    invalid_outputs: 0

CREATE: output_paths
  decision_brief: "reports/decision-brief-{execution_id}.md"
  full_report: "reports/full-report-{execution_id}.md"
  metadata: "reports/metadata-{execution_id}.yaml"

VERIFY: State initialized
```

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify setup completeness and correctness
EXECUTE:
  1. INPUT_FILE_CHECK:
     QUESTION: "Is workflow_input.yaml loaded and parsed correctly?"
     VERIFY: aggregation_context contains all required fields
     IF missing fields:
       CORRECT: Reload workflow_input.yaml and extract missing data
     IF complete:
       CONFIRM: "Input file loaded correctly"

  2. SCHEMA_AVAILABILITY_CHECK:
     QUESTION: "Are all required schemas loaded?"
     VERIFY: validation_schemas EXISTS
     VERIFY: brief_template EXISTS
     VERIFY: metric_formulas EXISTS
     IF any missing:
       CORRECT: Load missing schema files
     IF all present:
       CONFIRM: "All schemas loaded"

  3. PREREQUISITE_VALIDATION_CHECK:
     QUESTION: "Are prerequisites satisfied for aggregation?"
     VERIFY: completed_tasks >= 1
     VERIFY: workflow_id is valid
     VERIFY: execution_id is unique
     IF unsatisfied:
       HALT: "Prerequisites not met"
     IF satisfied:
       CONFIRM: "Prerequisites verified"

  4. STATE_INITIALIZATION_CHECK:
     QUESTION: "Is aggregation state initialized correctly?"
     VERIFY: aggregation_state.status = IN_PROGRESS
     VERIFY: output_paths are defined
     IF incorrect:
       CORRECT: Reinitialize state with correct values
     IF correct:
       CONFIRM: "State initialized"

  5. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "Input validation: PASSED/FAILED"
     OUTPUT: "Schema loading: PASSED/FAILED"
     OUTPUT: "Prerequisites: PASSED/FAILED"
     OUTPUT: "State initialization: PASSED/FAILED"

VIOLATION: Skipping counter-check is VIOLATION
```

## 6. CHECKLIST

```
ANSWER YES/NO:
□ workflow_input.yaml loaded and parsed?
□ All required schemas loaded?
□ workflow_id and execution_id valid?
□ At least 1 completed task present?
□ aggregation_state initialized?
□ output_paths defined?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_0
```

## 7. GATE_0

```
EVALUATE:
  input_loaded = workflow_input EXISTS AND parsed
  schemas_loaded = ALL schema files loaded
  prerequisites_met = completed_tasks >= 1
  state_initialized = aggregation_state.status = IN_PROGRESS

IF all TRUE:
  GATE_0 = OPEN
  OUTPUT: "GATE_0 OPEN - Setup complete, proceeding to STEP 1 (COLLECT)"
  NEXT_STEP: "steps/step-01-collect.md"

IF any FALSE:
  GATE_0 = CLOSED
  OUTPUT: "GATE_0 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading workflow_input:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_WORKFLOW_INPUT required"
  RETURN to section 1

IF agent proceeds without loading schemas:
  HALT
  OUTPUT: "VIOLATION: Section 2 LOAD_SCHEMAS required"
  RETURN to section 2

IF agent skips prerequisite verification:
  HALT
  OUTPUT: "VIOLATION: Section 3 VERIFY_PREREQUISITES required"
  RETURN to section 3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
