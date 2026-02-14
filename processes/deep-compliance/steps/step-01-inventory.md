# STEP 1: INVENTORY

## ENFORCED SEQUENCE

```
1. LOAD_INPUT
2. DECLARE_SCOPE
3. EXECUTE_METHOD_332
4. IDENTIFY_SYSTEMS
5. EXTRACT_CAPABILITIES
6. CLASSIFY_RISK
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_1
```

## 1. LOAD_INPUT

```
READ: Input (system description / organization context / deployment scope)
STORE: input_text
VERIFY: input_text.length > 0
IF input_text.length = 0 → HALT with "ERROR: No input provided"
```

## 2. DECLARE_SCOPE

```
OUTPUT: "SCOPE DECLARATION:"
LIST: AI systems to be assessed
LIST: Geographic deployment (EU operations)
LIST: Compliance deadline
LIST: What is unclear
WAIT: User confirmation or correction
IF user corrects → UPDATE scope → RESTART from 2
IF user confirms → PROCEED to 3
```

## 3. EXECUTE_METHOD_332

```
IF Method 332 (High-Risk AI Classifier) available:
  EXECUTE: method_332.initialize()

  FOR each system_description in input:
    EXECUTE: method_332.classify(system_description)
    STORE: classification_result

  OUTPUT:
```yaml
risk_classification:
  method: "Method 332 - High-Risk AI Classifier"
  systems_classified: N
  high_risk_count: H
  general_purpose_count: G
```

ELSE:
  EXECUTE: manual risk classification (section 6)
```

## 4. IDENTIFY_SYSTEMS

```
SCAN: input_text
EXTRACT: All AI systems

FOR each system:
  RECORD system metadata:
```yaml
system_id: SYS-001
name: "[system name]"
description: "[what system does]"
status: PRODUCTION | DEVELOPMENT | PILOT | DEPRECATED
deployment_regions: [EU, US, ...]
processes_personal_data: YES | NO
user_facing: YES | NO
business_owner: "[email/name]"
technical_owner: "[email/name]"
deployment_date: "[date if production]"
```

REQUIREMENT: Extract ALL AI systems
VIOLATION: Extracting only "main" systems is VIOLATION
EXECUTE: Until no more systems found

VERIFY: system_count >= 1
IF system_count = 0 → HALT with "ERROR: No AI systems identified"
```

## 5. EXTRACT_CAPABILITIES

```
FOR each system:
  IDENTIFY capabilities:

    CORE functions:
      - What does system do?
      - What inputs does it process?
      - What outputs does it generate?
      - What decisions does it make?

    AI components:
      - Models used (LLM, classifier, etc.)
      - Model providers (OpenAI, custom, etc.)
      - Training data (if applicable)
      - Model performance metrics

    AUTONOMOUS decisions:
      - What decisions made without human?
      - What impact do decisions have?
      - Can humans override decisions?
      - Are decisions legally binding?

  RECORD capabilities:
```yaml
system_capabilities:
  system_id: SYS-001
  core_functions:
    - "[function 1]"
    - "[function 2]"
    - "[function 3]"
  ai_components:
    - component: "[component name]"
      type: LLM | CLASSIFIER | RECOMMENDER | DETECTOR | OTHER
      provider: "[provider]"
      model: "[model name]"
  autonomous_decisions:
    - decision: "[decision type]"
      impact: CRITICAL | HIGH | MEDIUM | LOW
      human_override: YES | NO
      legally_binding: YES | NO
  documentation_refs:
    - "[doc path or URL]"
  code_refs:
    - "[repo URL or file path]"
```

REQUIREMENT: Extract at least 3 capabilities per system
VIOLATION: Generic capabilities like "AI processing" without specifics is VIOLATION
```

## 6. CLASSIFY_RISK

```
FOR each system:
  EVALUATE against EU AI Act Annex III:

    HIGH-RISK categories:
      1. Biometric identification
      2. Critical infrastructure management
      3. Education access/admissions
      4. Employment (recruitment/promotion/termination)
      5. Essential services access (credit/insurance/emergency)
      6. Law enforcement
      7. Migration/asylum/border control
      8. Justice/democratic processes

  CLASSIFY:
    IF system matches ANY Annex III category:
      classification = HIGH_RISK
      annex_iii_category = "[category number and name]"
      rationale = "[why this category applies]"

    IF system does NOT match Annex III:
      classification = GENERAL_PURPOSE
      annex_iii_category = NONE
      rationale = "[why not high-risk]"

  RECORD classification:
```yaml
risk_assessment:
  system_id: SYS-001
  classification: HIGH_RISK | GENERAL_PURPOSE
  annex_iii_category: "[category]"
  rationale: "[reasoning]"
  compliance_requirements: N
  estimated_effort_weeks: W
```

IF classification = HIGH_RISK:
  compliance_requirements_count = 100+
  estimated_effort_weeks = 12-24

IF classification = GENERAL_PURPOSE:
  compliance_requirements_count = 20-30
  estimated_effort_weeks = 4-8
```

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify inventory completeness
EXECUTE:
  1. SYSTEM COMPLETENESS CHECK:
     ASK: "Are there AI systems I missed?"
     SEARCH: Input for implicit AI systems
       - Recommendation engines
       - Search algorithms
       - Autocomplete features
       - Content moderation
       - Fraud detection
     IF additional_systems_found:
       ADD: To system inventory
       EXTRACT: Capabilities for new systems
     IF complete:
       CONFIRM: All systems identified

  2. CAPABILITY DEPTH CHECK:
     FOR each system:
       VERIFY: Capability count >= 3
       VERIFY: Capabilities specific (not generic)
       IF insufficient_detail:
         INVESTIGATE: System functionality further
         ADD: Missing capabilities
       IF sufficient:
         CONFIRM: Capabilities adequate

  3. CLASSIFICATION VALIDATION:
     FOR each system WHERE classification = GENERAL_PURPOSE:
       ASK: "Could this actually be high-risk?"
       REVIEW: Against all 8 Annex III categories
       IF potentially_high_risk:
         RECLASSIFY: As HIGH_RISK
         UPDATE: Compliance requirements
       IF confirmed_general:
         CONFIRM: Classification correct

     FOR each system WHERE classification = HIGH_RISK:
       ASK: "Is high-risk classification justified?"
       VERIFY: Clear match to Annex III category
       IF not_justified:
         RECLASSIFY: As GENERAL_PURPOSE
       IF justified:
         CONFIRM: Classification correct

  4. OWNERSHIP CHECK:
     FOR each system:
       VERIFY: Business owner assigned
       VERIFY: Technical owner assigned
       IF missing_owners:
         ASK: User for owner information
       IF owners_assigned:
         CONFIRM: Ownership complete

  5. REPORT:
     "Counter-check executed"
     "Additional systems found: S"
     "Capabilities enhanced: C"
     "Reclassifications: R"
     "Ownership gaps closed: O"

VIOLATION: Skipping counter-check is VIOLATION
```

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Input loaded and verified?
□ Scope declared and confirmed?
□ Method 332 executed OR manual classification complete?
□ ALL AI systems identified (not just main systems)?
□ Capabilities extracted (>= 3 per system)?
□ Risk classification complete for ALL systems?
□ Annex III category determined for high-risk systems?
□ Ownership assigned to ALL systems?
□ Counter-check executed?
□ All systems validated?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## 9. GATE_1

```
EVALUATE:
  systems_identified = TRUE
  capabilities_count >= 3 per system
  counter_check_executed = TRUE
  ownership_complete = TRUE

COUNT:
  total_systems = COUNT(system_id)
  high_risk_systems = WHERE classification = HIGH_RISK
  general_purpose_systems = WHERE classification = GENERAL_PURPOSE

IF all TRUE AND total_systems >= 1:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - systems = N, high_risk = H, general_purpose = G"
  PROCEED to workflow.md for next step

IF any FALSE OR total_systems = 0:
  GATE_1 = CLOSED
  OUTPUT: "GATE_1 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without scope declaration:
  HALT
  OUTPUT: "VIOLATION: Section 2 DECLARE_SCOPE required"
  RETURN to section 2

IF agent extracts subset of systems:
  HALT
  OUTPUT: "VIOLATION: ALL AI systems required, not subset"
  RETURN to section 4

IF agent skips capability extraction:
  HALT
  OUTPUT: "VIOLATION: Section 5 EXTRACT_CAPABILITIES required for ALL systems"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7

IF agent proceeds before GATE_1 = OPEN:
  HALT
  OUTPUT: "VIOLATION: GATE_1 not open"
  RETURN to section 8 CHECKLIST
```
