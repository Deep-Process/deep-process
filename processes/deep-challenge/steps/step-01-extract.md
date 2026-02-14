# STEP 1: EXTRACT

## ENFORCED SEQUENCE

```
1. LOAD_INPUT
2. DECLARE_INTERPRETATION
3. EXECUTE_METHOD_078
4. EXTRACT_ASSUMPTIONS
5. CLASSIFY_ASSUMPTIONS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_1
```

## 1. LOAD_INPUT

```
READ: Input from user (code / architecture / system description)
STORE: input_text
VERIFY: input_text.length > 0
IF input_text.length = 0 → HALT with "ERROR: No input provided"
```

## 2. DECLARE_INTERPRETATION

```
OUTPUT: "INTERPRETATION:"
LIST: What you understand the input to be
LIST: What assumptions you are making about the input
LIST: What is ambiguous or unclear
WAIT: User confirmation or correction
IF user corrects → UPDATE interpretation → RESTART from 2
IF user confirms → PROCEED to 3
```

## 3. EXECUTE_METHOD_078

```
IF Method 078 (Assumption Excavation) available:
  EXECUTE: method_078.excavate(input_text)
  STORE: method_078_output
ELSE:
  EXECUTE: manual extraction (section 4)
```

## 4. EXTRACT_ASSUMPTIONS

```
SCAN: input_text
IDENTIFY: Every statement that could be false
CLASSIFY each statement:
  - EXPLICIT: Stated directly in input
  - IMPLICIT: Logically required but not stated
  - INHERITED: Assumed from domain/context
  - INVISIBLE: Cultural/paradigm assumptions

OUTPUT format per assumption:
```yaml
assumption_id: ASM-001
text: "[exact text or paraphrase]"
type: EXPLICIT | IMPLICIT | INHERITED | INVISIBLE
location: "[file:line or section]"
criticality: CRITICAL | HIGH | MEDIUM | LOW
```

REQUIREMENT: Extract ALL assumptions, not subset
VIOLATION: Extracting "main" or "key" assumptions only is VIOLATION
EXECUTE: Until no more assumptions found
```

## 5. CLASSIFY_ASSUMPTIONS

```
FOR each assumption:
  ASSIGN criticality:
    CRITICAL: If false, system fails completely
    HIGH: If false, major function broken
    MEDIUM: If false, degraded performance
    LOW: If false, minor inconvenience

  COMPUTE: falsifiability
    Can this assumption be tested? YES/NO
    If YES → HOW would you test it?
    If NO → WHY is it untestable?

OUTPUT:
```yaml
assumptions:
  - id: ASM-001
    text: "Users will provide valid input"
    type: IMPLICIT
    criticality: CRITICAL
    falsifiable: YES
    test_method: "Provide invalid input and observe behavior"

  - id: ASM-002
    text: "Network is always available"
    type: INHERITED
    criticality: HIGH
    falsifiable: YES
    test_method: "Disconnect network during operation"
```
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Attempt to disprove your own extraction
EXECUTE:
  1. SELECT: 3 assumptions marked CRITICAL or HIGH
  2. FOR each:
     ASK: "Could I have missed similar assumptions?"
     SEARCH: Input for related assumptions
     IF found → ADD to list
     IF not found → DOCUMENT search attempt

  3. INVERSE CHECK:
     LIST: Assumptions that are NOT made
     ASK: "Are any of these actually assumed implicitly?"
     IF yes → ADD to list

  4. REPORT:
     "Counter-check executed"
     "Additional assumptions found: N"
     "Search attempts documented: M"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Input loaded and verified?
□ Interpretation declared and confirmed?
□ Method 078 executed OR manual extraction complete?
□ ALL assumptions extracted (not just main/key)?
□ ALL assumptions classified by criticality?
□ ALL assumptions tested for falsifiability?
□ Counter-check executed?
□ Additional assumptions found in counter-check?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## 8. GATE_1

```
EVALUATE:
  assumptions_extracted = TRUE
  assumptions_count >= 1
  counter_check_executed = TRUE

IF all TRUE:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - assumptions_count = N"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without declaring interpretation:
  HALT
  OUTPUT: "VIOLATION: Section 2 DECLARE_INTERPRETATION required"
  RETURN to section 2

IF agent extracts subset of assumptions:
  HALT
  OUTPUT: "VIOLATION: ALL assumptions required, not subset"
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
