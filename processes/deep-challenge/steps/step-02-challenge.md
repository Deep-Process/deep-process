# STEP 2: CHALLENGE

## ENFORCED SEQUENCE

```
1. LOAD_ASSUMPTIONS
2. GENERATE_ATTACK_VECTORS
3. EXECUTE_METHOD_063
4. STRESS_EACH_ASSUMPTION
5. DOCUMENT_ATTACKS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_2
```

## 1. LOAD_ASSUMPTIONS

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: assumptions list from step-01
VERIFY: assumptions_count >= 1
STORE: assumptions
```

## 2. GENERATE_ATTACK_VECTORS

```
FOR each assumption in assumptions:
  GENERATE attack vector:
    IF assumption = TRUE → What happens if FALSE?
    IF assumption = FALSE → System behavior?

  OUTPUT format:
```yaml
attack_vector_id: ATK-001
assumption_id: ASM-001
assumption_text: "Users will provide valid input"
attack_type: FALSIFY
attack_action: "Provide invalid input (null, malformed, extreme values)"
expected_impact: "System crash or undefined behavior"
```

REQUIREMENT: Generate attack for EVERY assumption
VIOLATION: Generating attacks for "main" assumptions only is VIOLATION
```

## 3. EXECUTE_METHOD_063

```
IF Method 063 (Challenge from Critical Perspective) available:
  FOR each attack_vector:
    EXECUTE: method_063.challenge(attack_vector)
    STORE: method_063_output
ELSE:
  EXECUTE: manual challenge (section 4)
```

## 4. STRESS_EACH_ASSUMPTION

```
FOR each assumption WHERE criticality = CRITICAL OR HIGH:
  DECLARE reasoning:
    "I will test assumption [ID] by [attack action]"
    "Expected result if assumption false: [impact]"
    "Expected result if assumption true: [normal behavior]"

  EXECUTE attack:
    IF system = code:
      CONSTRUCT: Test case that violates assumption
      PREDICT: Outcome before running
    IF system = architecture:
      CONSTRUCT: Scenario that violates assumption
      PREDICT: System behavior
    IF system = design:
      CONSTRUCT: Use case that violates assumption
      PREDICT: Failure mode

  DOCUMENT result:
```yaml
challenge_id: CHL-001
assumption_id: ASM-001
attack_vector_id: ATK-001
reasoning: "Testing by providing null input to validate input handler"
predicted_outcome: "System crashes or returns error"
actual_outcome: "[filled during execution or analysis]"
vulnerability_found: YES | NO | UNKNOWN
```
```

## 5. DOCUMENT_ATTACKS

```
COMPILE:
  Total assumptions challenged: N
  Attack vectors generated: M
  Vulnerabilities found: V
  Vulnerabilities suspected: S

FOR each challenge WHERE vulnerability_found = YES:
  EXTRACT:
    - What breaks?
    - How does it break?
    - What is the impact?
  STORE: For step-03
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Attempt to disprove your findings
EXECUTE:
  1. SELECT: 3 challenges marked vulnerability_found = YES
  2. FOR each:
     ASK: "Could this be a false positive?"
     ASK: "Does a defense mechanism exist that I missed?"
     SEARCH: System for defensive code/patterns
     IF found → RECLASSIFY as NO or UNKNOWN
     IF not found → CONFIRM as YES

  3. INVERSE CHECK:
     LIST: Assumptions marked vulnerability_found = NO
     ASK: "Did I test this assumption thoroughly?"
     IF test was superficial → RE-TEST
     IF test was thorough → CONFIRM NO

  4. REPORT:
     "Counter-check executed"
     "False positives eliminated: F"
     "Re-tests performed: R"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Assumptions loaded from GATE_1?
□ Attack vector generated for EVERY assumption?
□ Method 063 executed OR manual challenge complete?
□ Reasoning declared BEFORE each challenge?
□ Predicted outcome documented BEFORE testing?
□ Results documented for ALL challenges?
□ Counter-check executed?
□ False positives eliminated?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## 8. GATE_2

```
EVALUATE:
  challenges_generated >= assumptions_count
  attack_vectors_identified = TRUE
  counter_check_executed = TRUE

IF all TRUE:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - challenges_generated = N, vulnerabilities_found = V"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading assumptions:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_ASSUMPTIONS required"
  RETURN to section 1

IF agent challenges subset of assumptions:
  HALT
  OUTPUT: "VIOLATION: ALL assumptions must be challenged"
  RETURN to section 2

IF agent tests without declaring reasoning:
  HALT
  OUTPUT: "VIOLATION: Section 4 DECLARE reasoning required before testing"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
