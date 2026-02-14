# STEP 1: INVENTORY

## ENFORCED SEQUENCE

```
1. LOAD_INPUT
2. DECLARE_INTERPRETATION
3. EXECUTE_METHOD_335
4. EXECUTE_METHOD_327
5. EXTRACT_REQUIREMENTS
6. CLASSIFY_STAKEHOLDERS
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_1
```

## 1. LOAD_INPUT

```
READ: Input (system description / organization context / regulatory scope)
STORE: input_text
VERIFY: input_text.length > 0
IF input_text.length = 0 → HALT with "ERROR: No input provided"
```

## 2. DECLARE_INTERPRETATION

```
OUTPUT: "INTERPRETATION:"
LIST: What governance domain is being addressed
LIST: What stakeholders are identified
LIST: What regulatory frameworks apply
LIST: What is ambiguous or unclear
WAIT: User confirmation or correction
IF user corrects → UPDATE interpretation → RESTART from 2
IF user confirms → PROCEED to 3
```

## 3. EXECUTE_METHOD_335

```
IF Method 335 (Stakeholder Requirement Extractor) available:
  EXECUTE: method_335.extract(input_text)
  STORE: method_335_output

  OUTPUT:
```yaml
stakeholder_extraction:
  method: "Method 335 - Stakeholder Requirement Extractor"
  stakeholders_found: N
  requirements_found: R
```

ELSE:
  EXECUTE: manual stakeholder extraction (section 6)
```

## 4. EXECUTE_METHOD_327

```
IF Method 327 (Regulatory Requirement Mapper) available:
  EXECUTE: method_327.map_requirements(input_text)
  STORE: method_327_output

  OUTPUT:
```yaml
regulatory_mapping:
  method: "Method 327 - Regulatory Requirement Mapper"
  frameworks_identified: F
  requirements_mapped: R
  obligations_extracted: O
```

ELSE:
  EXECUTE: manual regulatory mapping (section 5)
```

## 5. EXTRACT_REQUIREMENTS

```
SCAN: input_text, method_335_output, method_327_output
IDENTIFY: Every governance requirement

CLASSIFY requirement source:
  - REGULATORY: From laws, regulations, standards
  - CONTRACTUAL: From agreements, SLAs, contracts
  - INTERNAL: From organizational policies
  - STAKEHOLDER: From stakeholder demands
  - RISK_BASED: From risk assessments

OUTPUT format per requirement:
```yaml
requirement_id: REQ-001
text: "[exact requirement text]"
source: REGULATORY | CONTRACTUAL | INTERNAL | STAKEHOLDER | RISK_BASED
authority: "[source document/regulation/stakeholder]"
criticality: MANDATORY | ESSENTIAL | RECOMMENDED | OPTIONAL
scope: "[what system/process/data this applies to]"
deadline: "[compliance deadline if applicable]"
```

REQUIREMENT: Extract ALL requirements, not subset
VIOLATION: Extracting "main" or "critical" requirements only is VIOLATION
EXECUTE: Until no more requirements found
```

## 6. CLASSIFY_STAKEHOLDERS

```
IDENTIFY all stakeholders:
  INTERNAL stakeholders:
    - Executive management
    - Compliance officers
    - Security team
    - Development team
    - Operations team
    - Legal team
    - Audit team

  EXTERNAL stakeholders:
    - Regulators
    - Auditors
    - Customers
    - Partners
    - Public interest groups

FOR each stakeholder:
  ASSIGN role:
    AUTHORITY: Can mandate requirements
    APPROVER: Must approve policies
    IMPLEMENTER: Implements controls
    MONITOR: Monitors compliance
    AUDITOR: Verifies compliance

  ASSESS power:
    HIGH: Can block or mandate changes
    MEDIUM: Can influence decisions
    LOW: Informed but limited influence

  ASSESS interest:
    HIGH: Directly affected by governance
    MEDIUM: Indirectly affected
    LOW: Minimal impact

  COMPUTE: Priority = Power × Interest

OUTPUT:
```yaml
stakeholder:
  stakeholder_id: STK-001
  name: "[stakeholder name/role]"
  type: INTERNAL | EXTERNAL
  role: AUTHORITY | APPROVER | IMPLEMENTER | MONITOR | AUDITOR
  power: HIGH | MEDIUM | LOW
  interest: HIGH | MEDIUM | LOW
  priority: HIGH | MEDIUM | LOW
  requirements: [REQ-001, REQ-002, ...]
```

FOR each requirement:
  MAP: requirement_id → stakeholder_id
  VERIFY: Every requirement has at least one stakeholder
  IF no stakeholder → ADD stakeholder or mark requirement as orphaned
```

## 7. COUNTER_CHECK

```
REQUIREMENT: Attempt to disprove requirement extraction
EXECUTE:
  1. SELECT: 3 requirements marked MANDATORY
  2. FOR each:
     ASK: "Could I have missed related requirements?"
     SEARCH: Source documents for related obligations
     IF found → ADD to requirements list
     IF not found → DOCUMENT search attempt

  3. INVERSE CHECK:
     LIST: Stakeholders WITHOUT requirements
     ASK: "Do these stakeholders have implicit requirements?"
     SEARCH: For unstated expectations
     IF found → ADD to requirements list
     IF not found → CONFIRM no requirements

  4. CONFLICT CHECK:
     FOR each pair of requirements:
       ASK: "Do these requirements conflict?"
       IF conflict_detected:
         MARK: conflicting_requirements = [REQ-X, REQ-Y]
         DOCUMENT: Nature of conflict
         ESCALATE: For resolution

  5. COMPLETENESS CHECK:
     FOR each regulatory framework identified:
       LIST: All obligations from framework
       COMPARE: Against extracted requirements
       IF obligations_missing:
         ADD: Missing requirements
         MARK: discovered_in_counter_check = TRUE

  6. REPORT:
     "Counter-check executed"
     "Additional requirements found: N"
     "Conflicts identified: C"
     "Stakeholder gaps closed: S"

VIOLATION: Skipping counter-check is VIOLATION
```

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Input loaded and verified?
□ Interpretation declared and confirmed?
□ Method 335 executed OR manual stakeholder extraction complete?
□ Method 327 executed OR manual regulatory mapping complete?
□ ALL governance requirements extracted (not just main/critical)?
□ ALL requirements classified by source and criticality?
□ ALL stakeholders identified and classified?
□ Every requirement mapped to at least one stakeholder?
□ Counter-check executed?
□ Requirement conflicts identified and documented?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_1
```

## 9. GATE_1

```
EVALUATE:
  requirements_extracted = TRUE
  requirements_count >= 1
  stakeholders_count >= 1
  counter_check_executed = TRUE
  conflicting_requirements_identified = TRUE OR FALSE

COUNT:
  mandatory_requirements = WHERE criticality = MANDATORY
  essential_requirements = WHERE criticality = ESSENTIAL
  stakeholders_mapped = UNIQUE stakeholder_ids in requirements

IF all TRUE AND stakeholders_mapped >= 1:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - requirements = N, stakeholders = S, mandatory = M"
  PROCEED to workflow.md for next step

IF any FALSE OR stakeholders_mapped = 0:
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

IF agent extracts subset of requirements:
  HALT
  OUTPUT: "VIOLATION: ALL requirements required, not subset"
  RETURN to section 5

IF agent skips stakeholder classification:
  HALT
  OUTPUT: "VIOLATION: Section 6 CLASSIFY_STAKEHOLDERS required"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7

IF agent proceeds before GATE_1 = OPEN:
  HALT
  OUTPUT: "VIOLATION: GATE_1 not open"
  RETURN to section 8 CHECKLIST
```
