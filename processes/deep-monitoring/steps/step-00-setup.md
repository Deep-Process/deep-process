# STEP 0: SETUP

## ENFORCED SEQUENCE

```
1. DECLARE_ASSUMPTIONS
2. DEFINE_SCOPE
3. IDENTIFY_ARTIFACTS
4. SET_THRESHOLDS
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_0
```

---

## 1. DECLARE_ASSUMPTIONS

```
EXECUTE BEFORE any other action.

RECORD:
```yaml
assumptions:
  - id: A0-01
    assumption: "[what you assume about process execution]"
    type: INTERPRETIVE | CONTEXTUAL | TECHNICAL
    confidence: HIGH | MEDIUM | LOW
    falsification: "[what would prove this wrong]"
  - id: A0-02
    assumption: "[what you assume about artifact completeness]"
    type: INTERPRETIVE | CONTEXTUAL | TECHNICAL
    confidence: HIGH | MEDIUM | LOW
    falsification: "[what would prove this wrong]"
```

REQUIREMENT: Minimum 2 assumptions.
VIOLATION: Zero assumptions = HALT, re-examine scope definition.
```

---

## 2. DEFINE_SCOPE

```
IDENTIFY target process execution:

INPUT required:
  - Process name: [deep-risk | deep-feasibility | deep-explore | etc.]
  - Execution ID: [timestamp or unique identifier]
  - Output directory: [path to artifacts]

DETERMINE monitoring dimensions:

SELECT monitoring scope:
  [ ] GATE_ONLY — Monitor gate pass/fail, violations, counter-checks
  [ ] COMPREHENSIVE — Monitor gates + domain metrics + assumptions
  [ ] SELECTIVE — Monitor user-specified dimensions only

IF SELECTIVE selected:
  LIST dimensions to monitor:
    [ ] Gate results
    [ ] Counter-check execution
    [ ] Assumption declarations
    [ ] Evidence ratio (VERIFIED vs ASSUMED)
    [ ] Scope reductions
    [ ] Phase completion
    [ ] [other: specify]

STORE:
```yaml
monitoring_scope:
  process: "[name]"
  execution_id: "[id]"
  output_directory: "[path]"
  scope_type: GATE_ONLY | COMPREHENSIVE | SELECTIVE
  dimensions: ["[dimension1]", "[dimension2]", ...]
```

REQUIREMENT: All fields filled.
VIOLATION: Missing field = HALT, complete definition.
```

---

## 3. IDENTIFY_ARTIFACTS

```
LOCATE expected artifacts for target process.

EXECUTE:
  READ: [output_directory]/process-log.yaml
  IF NOT EXISTS:
    MARK: process_log_missing = TRUE
    RECORD: Missing artifact (CRITICAL)

  FOR each expected artifact type:
    CHECK existence:
      - process-log.yaml (CRITICAL)
      - [process-specific artifacts per process type]

    IF process = deep-risk:
      EXPECT:
        - risk-register.yaml
        - risk-interaction-map.yaml
        - mitigation-portfolio.yaml
        - monitoring-system.yaml
        - risk-report.md

    IF process = deep-feasibility:
      EXPECT:
        - dimension-scores.yaml
        - constraint-map.yaml
        - feasibility-decision.yaml
        - feasibility-report.md

    IF process = deep-explore:
      EXPECT:
        - knowledge_map.yaml
        - option_map.yaml
        - consequence_map.yaml
        - exploration_report.md

    IF process = [other]:
      USER INPUT: List expected artifacts
      STORE: custom_artifacts = ["[file1]", "[file2]", ...]

RECORD:
```yaml
artifact_inventory:
  expected: [N]
  found: [M]
  missing:
    - artifact: "[filename]"
      criticality: CRITICAL | REQUIRED | OPTIONAL
```

REQUIREMENT: All CRITICAL artifacts found OR missing logged with SCOPE_REDUCTION.
VIOLATION: Missing CRITICAL artifact without SCOPE_REDUCTION = HALT.
```

---

## 4. SET_THRESHOLDS

```
DEFINE quality thresholds for monitoring.

CONFIGURE:

Gate pass threshold:
  minimum_gates_passed: [N] of [total]

Counter-check threshold:
  minimum_counter_checks: [N]

Evidence ratio threshold:
  minimum_verified_ratio: [percentage]%

Assumption threshold:
  minimum_assumptions_declared: [N]

STORE:
```yaml
thresholds:
  gates_passed_min: [N]
  counter_checks_min: [N]
  verified_ratio_min: [percentage]
  assumptions_declared_min: [N]
```

DEFAULT VALUES (if not specified):
  gates_passed_min: 80% of total gates
  counter_checks_min: 2 per phase
  verified_ratio_min: 30%
  assumptions_declared_min: 1 per phase

REQUIREMENT: All thresholds set (explicit or default).
```

---

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify setup completeness.

EXECUTE:
  1. SCOPE_DEFINITION_CHECK:
     ASK: "Is monitoring scope too narrow to detect quality issues?"
     SEARCH: Missing critical dimensions
     IF found:
       ADD to dimensions list
       RECHECK scope definition
     IF not found:
       CONFIRM: Scope adequate

  2. ARTIFACT_COVERAGE_CHECK:
     ASK: "Are there artifacts we should check but didn't list?"
     SEARCH: Additional files in output directory
     IF found unexpected files:
       EVALUATE: Should these be monitored?
       IF YES: ADD to artifact_inventory
     IF no unexpected files:
       CONFIRM: Coverage complete

  3. THRESHOLD_APPROPRIATENESS_CHECK:
     ASK: "Are thresholds too lenient or too strict for this process?"
     COMPARE: Against process criticality
     IF high-stakes process + lenient thresholds:
       FLAG: Threshold mismatch
       RECOMMEND: Stricter thresholds
     IF low-stakes process + strict thresholds:
       FLAG: Threshold mismatch (acceptable)
     IF appropriate:
       CONFIRM: Thresholds match stakes

RECORD:
```yaml
counter_checks:
  - check_id: CC0-01
    check: "Scope coverage"
    result: PASSED | ADJUSTED
    action: "[what changed if adjusted]"
  - check_id: CC0-02
    check: "Artifact coverage"
    result: PASSED | ADJUSTED
    action: "[what changed if adjusted]"
  - check_id: CC0-03
    check: "Threshold appropriateness"
    result: PASSED | FLAGGED
    action: "[recommendation if flagged]"
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 6. CHECKLIST

```
ANSWER YES/NO:
□ Assumptions declared (≥2)?
□ Monitoring scope defined (process, execution_id, output_directory)?
□ Scope type selected (GATE_ONLY | COMPREHENSIVE | SELECTIVE)?
□ Artifacts identified (expected list created)?
□ Missing CRITICAL artifacts logged OR SCOPE_REDUCTION declared?
□ Thresholds set (all 4 thresholds configured)?
□ Counter-checks executed (all 3)?
□ Counter-check results recorded?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_0
```

---

## 7. GATE_0

```
EVALUATE:
  monitoring_scope_defined = TRUE
  target_artifacts_identified = TRUE
  counter_check_executed = TRUE

COUNT:
  assumptions_declared = [N]
  artifacts_expected = [N]
  counter_checks_executed = [N]

IF all TRUE AND assumptions_declared ≥ 2 AND counter_checks_executed = 3:
  GATE_0 = OPEN
  OUTPUT: "GATE_0 OPEN - scope defined, artifacts=[N], checks=3"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_0 = CLOSED
  OUTPUT: "GATE_0 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without scope definition:
  HALT
  OUTPUT: "VIOLATION: Section 2 DEFINE_SCOPE required"
  RETURN to section 2

IF agent proceeds without artifact identification:
  HALT
  OUTPUT: "VIOLATION: Section 3 IDENTIFY_ARTIFACTS required"
  RETURN to section 3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
