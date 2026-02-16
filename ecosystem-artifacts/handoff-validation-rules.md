# Handoff Validation Rules v1.0

**ARCHITECT-TASK.yaml task_03 deliverable**
**Date:** 2026-02-16

## PRE-HANDOFF VALIDATION (Method #348)

### Rule V1: Process Completion
```
IF source_process.status != "COMPLETED" THEN
  FAIL with "Cannot handoff incomplete process"
```

### Rule V2: Required Artifacts
```
required = get_handoff_requirements(target_process)
FOR artifact IN required:
  IF NOT exists(artifact) THEN
    FAIL with "Missing required artifact: {artifact}"
```

### Rule V3: Schema Validation
```
FOR artifact IN handoff_payload:
  IF NOT validate_schema(artifact) THEN
    FAIL with "Invalid artifact schema: {artifact.id}"
```

### Rule V4: No Failed Gates
```
IF any_gate_failed(source_process) THEN
  FAIL with "Unresolved gate failures"
```

### Rule V5: Critical Warnings
```
warnings = get_critical_warnings(source_process)
IF len(warnings) > 0 THEN
  FAIL with "Unresolved critical warnings: {warnings}"
```

### Rule V6: Context Completeness
```
required_context = get_context_requirements(target)
FOR field IN required_context:
  IF field NOT IN handoff_payload.context THEN
    FAIL with "Missing context field: {field}"
```

### Rule V7: Dependencies Resolved
```
FOR artifact IN handoff_payload:
  deps = get_dependencies(artifact)
  FOR dep IN deps:
    IF dep.status IN ["STALE", "BLOCKED"] THEN
      FAIL with "Unresolved dependency: {dep.id}"
```

## POST-HANDOFF VERIFICATION

### Rule P1: Instance Created
```
IF target_instance_id = null THEN
  FAIL with "Target instance creation failed"
```

### Rule P2: Artifacts Accessible
```
FOR artifact IN handoff_payload:
  IF NOT can_read(artifact.file_path) THEN
    FAIL with "Artifact not accessible: {artifact.id}"
```

### Rule P3: Checksum Integrity
```
FOR artifact IN handoff_payload:
  actual = compute_sha256(artifact.file_path)
  IF actual != artifact.checksum_sha256 THEN
    FAIL with "Checksum mismatch (corruption): {artifact.id}"
```

### Rule P4: Context Loaded
```
state = get_instance_state(target_instance_id)
FOR key IN handoff_payload.context:
  IF key NOT IN state.context THEN
    FAIL with "Context not loaded: {key}"
```

### Rule P5: Dependencies Available
```
FOR artifact IN handoff_payload:
  FOR dep IN get_dependencies(artifact):
    IF NOT can_access(dep) THEN
      FAIL with "Dependency unavailable: {dep.id}"
```

## VALIDATION EXECUTION

```python
def execute_pre_validation(handoff_checkpoint):
    results = []
    for rule in PRE_VALIDATION_RULES:
        result = rule.validate(handoff_checkpoint)
        results.append(result)
        if result.severity == "CRITICAL" and result.status == "FAIL":
            return VALIDATION_FAILED(results)
    return VALIDATION_PASSED(results)
```

---
**END**
