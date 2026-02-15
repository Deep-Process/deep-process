# STEP 5: OUTPUT

## ENFORCED SEQUENCE

```
1. CREATE_OUTPUT_DIRECTORY
2. WRITE_DECISION_BRIEF
3. WRITE_FULL_REPORT
4. WRITE_METADATA
5. VERIFY_FILES
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. CREATE_OUTPUT_DIRECTORY

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

EXTRACT: output_directory = "reports"
VERIFY: Directory exists
IF NOT_EXISTS:
  CREATE: Directory at output_directory
  VERIFY: Creation successful

VERIFY: Write permissions
IF NO_PERMISSIONS:
  HALT: "ERROR: No write permissions for {output_directory}"
```

## 2. WRITE_DECISION_BRIEF

```
EXTRACT: decision_brief_path FROM output_paths
RESOLVE: full_path = output_directory + "/" + decision_brief_path

WRITE: decision_brief_content TO full_path
VERIFY: File written successfully
VERIFY: File size > 0

COMPUTE: file_hash = SHA256(decision_brief_content)
STORE: In output_metadata
  decision_brief:
    path: full_path
    size_bytes: LENGTH(decision_brief_content)
    pages: estimated_pages
    hash: file_hash
    written_at: CURRENT_TIMESTAMP
```

## 3. WRITE_FULL_REPORT

```
EXTRACT: full_report_path FROM output_paths
RESOLVE: full_path = output_directory + "/" + full_report_path

WRITE: full_report_content TO full_path
VERIFY: File written successfully
VERIFY: File size > 0

COMPUTE: file_hash = SHA256(full_report_content)
STORE: In output_metadata
  full_report:
    path: full_path
    size_bytes: LENGTH(full_report_content)
    hash: file_hash
    written_at: CURRENT_TIMESTAMP
```

## 4. WRITE_METADATA

```
EXTRACT: metadata_path FROM output_paths
RESOLVE: full_path = output_directory + "/" + metadata_path

CREATE: metadata_content
```yaml
workflow_id: {workflow_id}
execution_id: {execution_id}
timestamp: {CURRENT_TIMESTAMP}

outcome: {outcome}
decision_readiness: {decision_readiness}
decision_readiness_score: {decision_readiness_score}

primary_recommendation: {recommendation.action}

metrics:
  success_rate: {success_rate}
  output_quality: {output_quality}
  coherence: {coherence}

outputs:
  decision_brief:
    path: {decision_brief_path}
    size_bytes: {decision_brief.size_bytes}
    pages: {decision_brief.pages}

critical_issues_count: {critical_issues_count}
recommendations_count: {LENGTH(next_steps)}
```

WRITE: metadata_content TO full_path AS YAML
VERIFY: File written successfully
VERIFY: Valid YAML

STORE: In output_metadata
  metadata:
    path: full_path
    written_at: CURRENT_TIMESTAMP
```

## 5. VERIFY_FILES

```
FOR each output_file IN [decision_brief, full_report, metadata]:
  VERIFY: File exists at path
  VERIFY: File size > 0
  VERIFY: File readable

  IF verification_failed:
    HALT: "ERROR: Output file verification failed for {output_file}"

COMPUTE: total_output_size = SUM(file.size_bytes FOR all files)
OUTPUT: "Total output size: {total_output_size} bytes"
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify all outputs written correctly and completely
EXECUTE:
  1. FILE_EXISTENCE_CHECK:
     QUESTION: "Do all 3 output files exist?"
     VERIFY: decision_brief file exists
     VERIFY: full_report file exists
     VERIFY: metadata file exists
     IF any_missing:
       CORRECT: Re-write missing files
     IF all_exist:
       CONFIRM: "All 3 files written"

  2. CONTENT_INTEGRITY_CHECK:
     QUESTION: "Is file content complete and uncorrupted?"
     FOR each file:
       READ: file_content FROM file
       COMPUTE: actual_hash = SHA256(file_content)
       VERIFY: actual_hash matches stored hash
       IF mismatch:
         CORRECT: Re-write file
       IF match:
         CONFIRM: "File {file} integrity verified"

  3. METADATA_ACCURACY_CHECK:
     QUESTION: "Does metadata accurately reflect outputs?"
     READ: metadata_content FROM metadata file
     VERIFY: metadata.outcome matches aggregation_state.outcome
     VERIFY: metadata.critical_issues_count matches critical_issues_count
     VERIFY: metadata.decision_readiness matches decision_readiness
     IF discrepancy:
       CORRECT: Update metadata with correct values
     IF accurate:
       CONFIRM: "Metadata accurate"

  4. PAGE_LIMIT_VALIDATION_CHECK:
     QUESTION: "Does decision brief meet page constraints?"
     VERIFY: metadata.outputs.decision_brief.pages <= 10
     IF exceeded:
       HALT: "VIOLATION: Page limit exceeded in final output"
     IF within_limit:
       CONFIRM: "Page limit: {pages}/10 pages"

  5. READABILITY_CHECK:
     QUESTION: "Are all files readable?"
     FOR each file:
       TRY: READ file
       IF read_failed:
         HALT: "ERROR: Cannot read output file {file}"
       IF readable:
         CONFIRM: "File {file} readable"

  6. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "Files written: 3/3"
     OUTPUT: "Content integrity: VERIFIED/FAILED"
     OUTPUT: "Metadata accuracy: VERIFIED/FAILED"
     OUTPUT: "Page limit: {pages}/10"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Output directory created?
□ Decision brief written?
□ Full report written?
□ Metadata written?
□ All files verified (existence, size, readability)?
□ File integrity checked (hashes)?
□ Metadata accuracy verified?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## 8. GATE_5

```
EVALUATE:
  all_files_written = decision_brief EXISTS AND full_report EXISTS AND metadata EXISTS
  all_files_valid = ALL files readable AND size > 0
  metadata_accurate = metadata matches aggregation results
  page_limit_met = decision_brief.pages <= 10

COUNT:
  files_written = 3

IF all TRUE:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - Method #349 Result Aggregator COMPLETE"
  OUTPUT: "Decision brief: {decision_brief_path} ({decision_brief.pages} pages)"
  OUTPUT: "Full report: {full_report_path}"
  OUTPUT: "Metadata: {metadata_path}"
  OUTPUT: "Recommendation: {recommendation.action}"
  OUTPUT: "Decision readiness: {decision_readiness} ({decision_readiness_score})"
  OUTPUT: "Process outcome: {outcome}"

  RETURN: To calling process
    decision_brief_path: {decision_brief_path}
    full_report_path: {full_report_path}
    metadata_path: {metadata_path}
    recommendation: {recommendation.action}
    decision_readiness: {decision_readiness}
    outcome: {outcome}

IF any FALSE:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without creating output directory:
  HALT
  OUTPUT: "VIOLATION: Section 1 CREATE_OUTPUT_DIRECTORY required"
  RETURN to section 1

IF agent skips writing decision brief:
  HALT
  OUTPUT: "VIOLATION: Section 2 WRITE_DECISION_BRIEF required"
  RETURN to section 2

IF agent skips writing metadata:
  HALT
  OUTPUT: "VIOLATION: Section 4 WRITE_METADATA required"
  RETURN to section 4

IF agent skips file verification:
  HALT
  OUTPUT: "VIOLATION: Section 5 VERIFY_FILES required"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
