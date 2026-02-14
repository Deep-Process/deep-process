# STEP 2: MAP

## ENFORCED SEQUENCE

```
1. LOAD_INVENTORY
2. EXECUTE_METHOD_327
3. MAP_REQUIREMENTS
4. VERIFY_MAPPING
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_2
```

## 1. LOAD_INVENTORY

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: System inventory from step-01
LOAD: Risk classifications from step-01
FILTER: HIGH_RISK systems for full requirements
FILTER: GENERAL_PURPOSE systems for transparency requirements
STORE: mapping_scope
VERIFY: system_count >= 1
```

## 2. EXECUTE_METHOD_327

```
IF Method 327 (Regulatory Requirement Mapper) available:
  EXECUTE: method_327.initialize()
  LOAD: EU AI Act requirements database

  FOR each system:
    INPUT: system capabilities, classification, deployment context
    EXECUTE: method_327.map_requirements(system)
    STORE: requirements_mapping

  OUTPUT:
```yaml
requirements_mapping:
  method: "Method 327 - Regulatory Requirement Mapper"
  systems_mapped: N
  requirements_identified: R
  articles_covered: A
  mapping_coverage: "[percentage]"
```

ELSE:
  EXECUTE: manual requirements mapping (section 3)
```

## 3. MAP_REQUIREMENTS

```
LOAD: EU AI Act requirements by classification

FOR each HIGH_RISK system:
  MAP all applicable requirements:

    Article 9 - Risk Management:
      - Establish risk management system
      - Perform risk assessment
      - Implement risk mitigation measures
      - Test risk controls

    Article 10 - Data Governance:
      - Define training/testing/validation datasets
      - Implement data quality measures
      - Document data lineage
      - Address data bias

    Article 11 - Technical Documentation:
      - Maintain comprehensive technical docs
      - Document intended purpose
      - Document system architecture
      - Document performance metrics

    Article 12 - Record-Keeping:
      - Implement automatic logging
      - Ensure log traceability
      - Retain logs per requirements
      - Protect log integrity

    Article 13 - Transparency:
      - Provide clear user information
      - Disclose AI usage
      - Explain decision logic
      - Implement transparency measures

    Article 14 - Human Oversight:
      - Design for human oversight
      - Implement override mechanisms
      - Train human overseers
      - Define oversight procedures

    Article 15 - Accuracy/Robustness:
      - Achieve appropriate accuracy levels
      - Implement robustness measures
      - Test under various conditions
      - Monitor performance degradation

  RECORD mapping:
```yaml
requirement_mapping:
  system_id: SYS-001
  requirement_id: REQ-001
  article: "Article 9"
  section: "9.2 - Risk Assessment"
  requirement_text: "[exact text from regulation]"
  applicability: MANDATORY | CONDITIONAL | NOT_APPLICABLE
  condition: "[condition if CONDITIONAL]"
  system_capability_match: "[which capability this applies to]"
  current_status: UNKNOWN
```

FOR each GENERAL_PURPOSE system:
  MAP transparency requirements only:
    - Article 52 - Transparency obligations
    - Article 53 - Information duties
    - Basic documentation requirements

REQUIREMENT: Map ALL applicable requirements
VIOLATION: Mapping only "major" requirements is VIOLATION
```

## 4. VERIFY_MAPPING

```
FOR each requirements_mapping:
  VALIDATE mapping correctness:

    CHECK applicability:
      VERIFY: Article applies to system type
      VERIFY: System capabilities match requirement
      IF mismatch:
        UPDATE: applicability = NOT_APPLICABLE
        DOCUMENT: Why not applicable

    CHECK completeness:
      COUNT: Requirements mapped
      IF classification = HIGH_RISK:
        VERIFY: Coverage >= 90% of applicable articles
      IF classification = GENERAL_PURPOSE:
        VERIFY: Coverage >= 80% of transparency requirements
      IF insufficient_coverage:
        INVESTIGATE: Missing requirements
        ADD: Missing mappings

    CHECK accuracy:
      FOR each mapping:
        VERIFY: Requirement text matches regulation
        VERIFY: Capability match is correct
        IF inaccurate:
          CORRECT: Mapping
          DOCUMENT: Correction reason

COMPUTE mapping statistics:
  total_requirements = COUNT(requirement_id)
  applicable_requirements = WHERE applicability = MANDATORY OR CONDITIONAL
  not_applicable_requirements = WHERE applicability = NOT_APPLICABLE
  coverage_percentage = (applicable_requirements / total_eu_ai_act_requirements) * 100
```

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify mapping accuracy
EXECUTE:
  1. MISSING REQUIREMENT CHECK:
     FOR each EU AI Act article:
       CHECK: Article considered in mapping
       IF article_not_considered:
         INVESTIGATE: Why missing
         ADD: Missing article requirements
       IF considered:
         CONFIRM: Coverage complete

  2. OVER-MAPPING CHECK:
     FOR each mapping WHERE applicability = MANDATORY:
       ASK: "Does this requirement truly apply?"
       VERIFY: System capabilities actually trigger requirement
       IF not_applicable:
         UPDATE: applicability = NOT_APPLICABLE
         DOCUMENT: Rationale
       IF applicable:
         CONFIRM: Mapping correct

  3. CONDITIONAL LOGIC CHECK:
     FOR each mapping WHERE applicability = CONDITIONAL:
       VERIFY: Condition clearly stated
       EVALUATE: Whether condition is met
       IF condition_met:
         UPDATE: applicability = MANDATORY
       IF condition_not_met:
         UPDATE: applicability = NOT_APPLICABLE
       IF condition_unclear:
         ESCALATE: For clarification

  4. CAPABILITY MATCH CHECK:
     FOR each mapping:
       VERIFY: system_capability_match points to real capability
       VERIFY: Capability actually relates to requirement
       IF mismatch:
         CORRECT: Capability match
       IF match:
         CONFIRM: Correct mapping

  5. COVERAGE CHECK:
     COMPUTE: coverage_percentage
     IF coverage < 90% FOR HIGH_RISK:
       INVESTIGATE: Missing requirements
       ADD: Until coverage >= 90%
     IF coverage < 80% FOR GENERAL_PURPOSE:
       INVESTIGATE: Missing requirements
       ADD: Until coverage >= 80%
     IF adequate_coverage:
       CONFIRM: Mapping complete

  6. REPORT:
     "Counter-check executed"
     "Missing requirements added: M"
     "Over-mappings corrected: O"
     "Conditional logic resolved: C"
     "Final coverage: [percentage]%"

VIOLATION: Skipping counter-check is VIOLATION
```

## 6. CHECKLIST

```
ANSWER YES/NO:
□ Inventory loaded from GATE_1?
□ Method 327 executed OR manual mapping complete?
□ ALL applicable requirements mapped?
□ Mapping coverage >= 90% (HIGH_RISK) or >= 80% (GENERAL)?
□ Applicability determined (MANDATORY/CONDITIONAL/NOT_APPLICABLE)?
□ Capability matches verified?
□ Counter-check executed?
□ Coverage threshold met?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## 7. GATE_2

```
EVALUATE:
  requirements_mapped >= 90% (for HIGH_RISK) OR >= 80% (for GENERAL_PURPOSE)
  mapping_verified = TRUE
  counter_check_executed = TRUE

COUNT:
  total_requirements = COUNT(requirement_id)
  mandatory_requirements = WHERE applicability = MANDATORY
  conditional_requirements = WHERE applicability = CONDITIONAL
  not_applicable_requirements = WHERE applicability = NOT_APPLICABLE

COMPUTE:
  coverage = (mandatory + conditional) / total_eu_ai_act_requirements

IF all TRUE AND coverage >= threshold:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - requirements = R, coverage = C%, mandatory = M"
  PROCEED to workflow.md for next step

IF any FALSE OR coverage < threshold:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  OUTPUT: "Coverage: [coverage]% (threshold: [threshold]%)"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading inventory:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_INVENTORY required"
  RETURN to section 1

IF agent maps subset of requirements:
  HALT
  OUTPUT: "VIOLATION: ALL applicable requirements must be mapped"
  RETURN to section 3

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 4 VERIFY_MAPPING required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
