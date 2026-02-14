# STEP 4: STRESS

## ENFORCED SEQUENCE

```
1. LOAD_VULNERABILITIES
2. EXECUTE_METHOD_129
3. EXECUTE_METHOD_130
4. TEST_BOUNDARIES
5. TEST_EDGE_CASES
6. DOCUMENT_FAILURES
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_4
```

## 1. LOAD_VULNERABILITIES

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: vulnerabilities from step-03
FILTER: WHERE confidence = HIGH OR MEDIUM
STORE: vulnerabilities_to_test
VERIFY: Count >= 0
```

## 2. EXECUTE_METHOD_129

```
IF Method 129 (Stress Test Battery) available:
  FOR each vulnerability in vulnerabilities_to_test:
    EXECUTE: method_129.test_battery(vulnerability)

    Test sequence:
      1. Normal input
      2. Edge values (min, max)
      3. Beyond boundaries (min-1, max+1)
      4. Invalid types
      5. Malicious payloads

    STORE: test_results

ELSE:
  EXECUTE: manual stress testing (sections 4, 5)
```

## 3. EXECUTE_METHOD_130

```
IF Method 130 (Assumption Torture) available:
  FOR each assumption from step-01:
    TEST at graduated error levels:
      - 10% wrong
      - 50% wrong
      - 100% wrong

    FOR each error level:
      PREDICT: System behavior before testing
      EXECUTE: Test
      OBSERVE: Actual behavior
      COMPARE: Predicted vs Actual

    CLASSIFY survivability:
      - CATASTROPHIC: System fails at 10% wrong
      - HIGH_IMPACT: System fails at 50% wrong
      - MODERATE: System fails at 100% wrong
      - RESILIENT: System survives 100% wrong

    STORE: torture_results

ELSE:
  EXECUTE: manual assumption testing (section 4)
```

## 4. TEST_BOUNDARIES

```
FOR each vulnerability WHERE type contains BOUNDARY or INPUT:
  DECLARE test plan:
    "Testing [vulnerability_id] at boundaries"
    "Expected failure mode: [prediction]"

  EXECUTE tests:
    Lower boundary:
      - At limit: [value]
      - Below limit: [value - 1]
      - Far below: [value - 1000]

    Upper boundary:
      - At limit: [value]
      - Above limit: [value + 1]
      - Far above: [value + 1000]

    Type boundary:
      - Correct type
      - Wrong type (string vs int)
      - Null/None/undefined
      - Empty string/array/object

  RECORD results:
```yaml
boundary_test:
  vulnerability_id: VUL-001
  test_type: BOUNDARY
  tests_executed: N
  failures: F
  failure_modes: [list]
  critical_failures: C
```
```

## 5. TEST_EDGE_CASES

```
FOR each vulnerability:
  GENERATE edge cases:
    IF vulnerability = INJECTION:
      - SQL injection payloads
      - XSS payloads
      - Command injection
      - Path traversal

    IF vulnerability = LOGIC_ERROR:
      - Race conditions (concurrent requests)
      - State transitions (invalid sequences)
      - Authorization bypass attempts

    IF vulnerability = BOUNDARY:
      - Integer overflow
      - Buffer overflow
      - Stack overflow
      - Memory exhaustion

  FOR each edge_case:
    PREDICT: Outcome before testing
    EXECUTE: Test
    OBSERVE: Actual outcome
    DOCUMENT: Discrepancy between predicted and actual

  RECORD:
```yaml
edge_case_test:
  vulnerability_id: VUL-002
  edge_cases_tested: M
  predictions_correct: P
  predictions_wrong: W
  unexpected_behaviors: U
```
```

## 6. DOCUMENT_FAILURES

```
COMPILE all test results from sections 2, 3, 4, 5

FOR each test WHERE result = FAILURE:
  EXTRACT:
    - What input caused failure?
    - What was the failure mode?
    - Is failure reproducible?
    - What is the impact?

  CREATE failure record:
```yaml
failure_id: FAIL-001
vulnerability_id: VUL-001
test_type: BOUNDARY | EDGE_CASE | STRESS | ASSUMPTION
input: "[exact input that caused failure]"
failure_mode: "[how it failed - crash, error, hang, corruption]"
reproducible: YES | NO | INTERMITTENT
impact: CRITICAL | HIGH | MEDIUM | LOW
```

REQUIREMENT: Document ALL failures, not just critical
VIOLATION: Filtering to "important" failures is VIOLATION
```

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify stress test thoroughness
EXECUTE:
  1. REVIEW: Test coverage
     FOR each vulnerability:
       COUNT: Tests executed
       IF count < 5 → INSUFFICIENT
       IF count >= 5 → SUFFICIENT

  2. CHECK: Prediction accuracy
     COMPUTE: predictions_correct / total_predictions
     IF accuracy < 50% → Tests not understood well
     IF accuracy >= 50% → Tests well understood

  3. SEARCH: Missed edge cases
     ASK: "What edge cases did I not test?"
     FOR each vulnerability:
       LIST: 3 edge cases NOT tested
       ASSESS: Would testing these find new failures?
       IF YES → ADD to test plan and EXECUTE
       IF NO → DOCUMENT why not

  4. REPORT:
     "Counter-check executed"
     "Insufficient test coverage: N vulnerabilities"
     "Prediction accuracy: P%"
     "Additional edge cases tested: A"

VIOLATION: Skipping counter-check is VIOLATION
```

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Vulnerabilities loaded from GATE_3?
□ Method 129 executed OR manual stress tests complete?
□ Method 130 executed OR manual assumption tests complete?
□ Boundary tests executed for ALL applicable vulnerabilities?
□ Edge cases generated and tested for ALL vulnerabilities?
□ Predictions documented BEFORE each test?
□ ALL failures documented (not just critical)?
□ Counter-check executed?
□ Test coverage verified as sufficient?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## 9. GATE_4

```
EVALUATE:
  stress_tests_executed = TRUE
  test_count >= vulnerabilities_count
  counter_check_executed = TRUE

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - tests_executed = N, failures = F"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent tests without prediction:
  HALT
  OUTPUT: "VIOLATION: Prediction required BEFORE testing"
  RETURN to section where violation occurred

IF agent documents subset of failures:
  HALT
  OUTPUT: "VIOLATION: ALL failures must be documented"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
