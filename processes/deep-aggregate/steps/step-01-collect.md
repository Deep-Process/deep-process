# STEP 1: COLLECT

## ENFORCED SEQUENCE

```
1. RETRIEVE_TASK_OUTPUTS
2. VALIDATE_OUTPUTS
3. RECORD_MISSING
4. COUNTER_CHECK
5. CHECKLIST
6. GATE_1
```

## 1. RETRIEVE_TASK_OUTPUTS

```
PRECONDITION: GATE_0 = OPEN
IF GATE_0 ≠ OPEN → HALT with "ERROR: GATE_0 not open"

FOR each task IN aggregation_context.task_states:
  IF task.status = COMPLETED:
    LOAD: task.output_location
    PARSE: AS YAML

    STORE: In aggregation_state.outputs_collected
      task_id: task.task_id
      process_name: task.process_name
      output_data: PARSED_YAML
      retrieved_at: CURRENT_TIMESTAMP

    INCREMENT: aggregation_state.metrics.completed_tasks

  IF task.status = FAILED OR task.status = SKIPPED:
    RECORD: In missing_outputs
      task_id: task.task_id
      process_name: task.process_name
      reason: task.status

    INCREMENT: aggregation_state.metrics.failed_tasks

UPDATE: aggregation_state.metrics.total_tasks = COUNT(task_states)
```

## 2. VALIDATE_OUTPUTS

```
FOR each output IN aggregation_state.outputs_collected:
  EXTRACT: process_name FROM output

  LOAD: Schema FOR process_name FROM validation_schemas
  IF schema NOT_FOUND:
    MARK: output.validation_status = UNKNOWN
    RECORD: "No schema for process: {process_name}"
    CONTINUE to next output

  FOR each required_field IN schema.required_fields:
    EXTRACT: field_path FROM required_field.field
    EXTRACT: actual_value FROM output.output_data AT field_path

    VERIFY: actual_value matches required_field.type
    VERIFY: actual_value satisfies required_field.rule

    IF validation_failed:
      MARK: output.validation_status = INVALID
      RECORD: In output.validation_errors
        field: required_field.field
        error: required_field.error
        actual_value: actual_value

      INCREMENT: aggregation_state.metrics.invalid_outputs
      BREAK validation loop

  IF all_validations_passed:
    MARK: output.validation_status = VALID
    INCREMENT: aggregation_state.metrics.valid_outputs

COMPUTE: validation_rate = valid_outputs / (valid_outputs + invalid_outputs)
IF validation_rate < 0.5:
  OUTPUT: "WARNING: Validation rate below 50% - data quality issues present"
```

## 3. RECORD_MISSING

```
FOR each task WHERE status = FAILED OR status = SKIPPED:
  CREATE: missing_output_record
    task_id: task.task_id
    process_name: task.process_name
    reason: task.status
    expected_output: task.output_location
    impact: "Output unavailable for aggregation"

  STORE: In aggregation_state.missing_outputs

COUNT: total_missing = LENGTH(missing_outputs)
IF total_missing > 0:
  OUTPUT: "WARNING: {total_missing} outputs missing"

  FOR each missing IN missing_outputs:
    OUTPUT: "  - {missing.process_name} (reason: {missing.reason})"
```

## 4. COUNTER_CHECK

```
REQUIREMENT: Verify output collection completeness and validity
EXECUTE:
  1. COLLECTION_COMPLETENESS_CHECK:
     QUESTION: "Were all completed task outputs retrieved?"
     COUNT: expected_outputs WHERE task.status = COMPLETED
     COUNT: actual_outputs IN outputs_collected
     VERIFY: expected_outputs = actual_outputs
     IF mismatch:
       INVESTIGATE: Which outputs were not retrieved
       CORRECT: Retrieve missing outputs
     IF match:
       CONFIRM: "All completed task outputs collected"

  2. VALIDATION_EXECUTION_CHECK:
     QUESTION: "Was validation executed for all collected outputs?"
     FOR each output IN outputs_collected:
       VERIFY: output.validation_status IS_SET
       IF not_set:
         CORRECT: Execute validation for output
     CONFIRM: "All outputs validated"

  3. SCHEMA_COVERAGE_CHECK:
     QUESTION: "Are schemas available for all process types?"
     EXTRACT: unique_process_names FROM outputs_collected
     FOR each process_name:
       VERIFY: Schema exists IN validation_schemas
       IF missing:
         RECORD: "Schema missing for {process_name}"
         MARK: As limitation
     CONFIRM: "Schema coverage assessed"

  4. VALIDATION_QUALITY_CHECK:
     QUESTION: "Is validation rate acceptable?"
     COMPUTE: validation_rate = valid_outputs / total_outputs
     IF validation_rate < 0.5:
       OUTPUT: "WARNING: Low validation rate - investigate data quality"
     IF validation_rate >= 0.8:
       CONFIRM: "High validation rate"

  5. MISSING_OUTPUT_IMPACT_CHECK:
     QUESTION: "Do missing outputs affect aggregation quality?"
     COUNT: missing_critical_outputs WHERE process IN [deep-verify, deep-explore]
     IF missing_critical_outputs > 0:
       OUTPUT: "WARNING: Critical process outputs missing"
       ASSESS: Impact on decision quality
     IF missing_critical_outputs = 0:
       CONFIRM: "No critical outputs missing"

  6. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "Outputs collected: {actual_outputs}"
     OUTPUT: "Validation rate: {validation_rate}%"
     OUTPUT: "Invalid outputs: {invalid_outputs}"
     OUTPUT: "Missing outputs: {total_missing}"

VIOLATION: Skipping counter-check is VIOLATION
```

## 5. CHECKLIST

```
ANSWER YES/NO:
□ All completed task outputs retrieved?
□ All outputs validated against schemas?
□ Missing outputs recorded?
□ Validation rate calculated?
□ Invalid outputs identified?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## 6. GATE_1

```
EVALUATE:
  outputs_collected = LENGTH(outputs_collected) >= 1
  validation_executed = ALL outputs have validation_status
  valid_outputs_present = valid_outputs >= 1

COMPUTE:
  collection_rate = outputs_collected / completed_tasks

IF all TRUE AND collection_rate >= 0.8:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - Collection complete, proceeding to STEP 2 (AGGREGATE)"
  OUTPUT: "Outputs collected: {outputs_collected}"
  OUTPUT: "Valid outputs: {valid_outputs}"
  OUTPUT: "Invalid outputs: {invalid_outputs}"
  NEXT_STEP: "steps/step-02-aggregate.md"

IF any FALSE OR collection_rate < 0.8:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - reason: [which condition failed]"
  OUTPUT: "Collection rate: {collection_rate}% (threshold: 80%)"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without retrieving outputs:
  HALT
  OUTPUT: "VIOLATION: Section 1 RETRIEVE_TASK_OUTPUTS required"
  RETURN to section 1

IF agent skips validation:
  HALT
  OUTPUT: "VIOLATION: Section 2 VALIDATE_OUTPUTS required"
  RETURN to section 2

IF agent skips recording missing outputs:
  HALT
  OUTPUT: "VIOLATION: Section 3 RECORD_MISSING required"
  RETURN to section 3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 4 COUNTER_CHECK required"
  RETURN to section 4
```
