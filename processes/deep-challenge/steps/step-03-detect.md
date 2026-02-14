# STEP 3: DETECT

## ENFORCED SEQUENCE

```
1. LOAD_CHALLENGES
2. CLASSIFY_SYSTEM_TYPE
3. EXECUTE_METHOD_341
4. EXECUTE_METHOD_342
5. SCAN_ATTACK_SURFACE
6. IDENTIFY_VULNERABILITIES
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_3
```

## 1. LOAD_CHALLENGES

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: challenges list from step-02
FILTER: WHERE vulnerability_found = YES OR UNKNOWN
STORE: potential_vulnerabilities
VERIFY: Count >= 0
```

## 2. CLASSIFY_SYSTEM_TYPE

```
EXAMINE: input_text
CLASSIFY:
  IF contains AI/ML/LLM → system_type = AI_SYSTEM
  IF contains API endpoints → system_type = API_SYSTEM
  IF contains user input handling → system_type = INPUT_SYSTEM
  IF none above → system_type = GENERIC_SYSTEM

STORE: system_type
SELECT detection methods based on system_type
```

## 3. EXECUTE_METHOD_341

```
IF system_type = AI_SYSTEM AND Method 341 (Jailbreak Pattern Library) available:
  LOAD: jailbreak_patterns from Method 341
  FOR each potential_vulnerability:
    MATCH: vulnerability against known jailbreak patterns
    IF match found:
      RECORD: pattern_id, severity, detection_confidence
    IF no match:
      RECORD: "No known pattern match"

  OUTPUT:
```yaml
detection_result:
  method: "Method 341 - Jailbreak Pattern Library"
  matches_found: N
  patterns_matched: [pattern_id_1, pattern_id_2, ...]
```

ELSE:
  OUTPUT: "Method 341 not applicable or not available"
  PROCEED to section 4
```

## 4. EXECUTE_METHOD_342

```
IF system_type = AI_SYSTEM AND Method 342 (Prompt Injection Detector) available:
  FOR each potential_vulnerability WHERE type = INJECTION:
    EXECUTE: method_342.detect(vulnerability_description)
    STORE: detection_result

    IF detection_result.attack_detected = TRUE:
      CLASSIFY: severity (CRITICAL/HIGH/MEDIUM/LOW)
      EXTRACT: matched_rules
      COMPUTE: confidence_score

  OUTPUT:
```yaml
injection_detection:
  method: "Method 342 - Prompt Injection Detector"
  injections_detected: M
  critical_injections: C
  high_injections: H
```

ELSE:
  OUTPUT: "Method 342 not applicable or not available"
  PROCEED to section 5
```

## 5. SCAN_ATTACK_SURFACE

```
IDENTIFY all attack vectors:
  INPUT attack_vectors:
    - User input fields
    - API parameters
    - File uploads
    - URL parameters
    - Headers
    - Cookies

  PROCESS attack_vectors:
    - Data transformations
    - Business logic
    - Authorization checks
    - Rate limiting
    - Caching

  OUTPUT attack_vectors:
    - API responses
    - UI rendering
    - Database writes
    - External API calls
    - Logs

FOR each attack_vector:
  ASSESS: Exploitability (LOW/MEDIUM/HIGH)
  ASSESS: Impact (LOW/MEDIUM/HIGH/CRITICAL)
  COMPUTE: Priority = Exploitability × Impact

OUTPUT:
```yaml
attack_surface:
  total_vectors: N
  input_vectors: I
  process_vectors: P
  output_vectors: O
  high_priority: H
```
```

## 6. IDENTIFY_VULNERABILITIES

```
REQUIREMENT: Consolidate findings from sections 3, 4, 5

FOR each finding:
  CREATE vulnerability record:
```yaml
vulnerability_id: VUL-001
source: "Method 341" | "Method 342" | "Attack Surface Scan" | "Challenge Result"
type: "INJECTION" | "JAILBREAK" | "LOGIC_ERROR" | "BOUNDARY" | "RACE_CONDITION" | "OTHER"
description: "[what is vulnerable]"
attack_vector: "[how to exploit]"
impact: "[what breaks if exploited]"
affected_component: "[file:line or component name]"
detection_method: "[how was this found]"
confidence: HIGH | MEDIUM | LOW
```

REQUIREMENT: Create record for EVERY potential vulnerability
VIOLATION: Filtering to "significant" vulnerabilities only is VIOLATION
```

## 7. COUNTER_CHECK

```
REQUIREMENT: Attempt to disprove vulnerability findings
EXECUTE:
  1. SELECT: All vulnerabilities marked confidence = HIGH
  2. FOR each:
     ASK: "Does a mitigation already exist?"
     SEARCH: System for:
       - Input validation
       - Sanitization
       - Rate limiting
       - Authentication checks
       - Error handling
     IF mitigation found:
       UPDATE: confidence = MEDIUM or LOW
       ADD: mitigation_exists = TRUE
     IF no mitigation:
       CONFIRM: confidence = HIGH

  3. FALSE POSITIVE CHECK:
     FOR vulnerabilities WHERE confidence = MEDIUM:
       ASK: "Is this a real vulnerability or theoretical?"
       ASK: "Can this be exploited in practice?"
       IF theoretical only → DOWNGRADE to LOW
       IF exploitable → UPGRADE to HIGH

  4. REPORT:
     "Counter-check executed"
     "Mitigations found: M"
     "Confidence adjustments: A"
     "False positives identified: F"

VIOLATION: Skipping counter-check is VIOLATION
```

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Challenges loaded from GATE_2?
□ System type classified?
□ Method 341 executed (if applicable)?
□ Method 342 executed (if applicable)?
□ Attack surface scanned completely?
□ Vulnerability record created for EVERY finding?
□ Counter-check executed?
□ Mitigations identified and documented?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## 9. GATE_3

```
EVALUATE:
  vulnerabilities_count >= 0
  detection_method_executed = TRUE
  counter_check_executed = TRUE

IF all TRUE:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - vulnerabilities_count = N"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without classification:
  HALT
  OUTPUT: "VIOLATION: Section 2 CLASSIFY_SYSTEM_TYPE required"
  RETURN to section 2

IF agent creates records for subset:
  HALT
  OUTPUT: "VIOLATION: Record required for ALL findings"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
