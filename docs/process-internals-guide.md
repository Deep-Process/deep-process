# Process Internals - Technical Guide

## Overview

This guide explains the internal mechanics of the deep-* processes: how enforced sequences work, how gates prevent progression, how counter-checks eliminate false positives, and how violations are recovered.

---

## 1. Anatomy of a Process Step

Every step file follows this structure:

```
# STEP N: [NAME]

## ENFORCED SEQUENCE        ← Mandatory execution order
1. SECTION_A
2. SECTION_B
3. COUNTER_CHECK           ← Always section N-2
4. CHECKLIST               ← Always section N-1
5. GATE_N                  ← Always final section

## 1. SECTION_A             ← Numbered sections execute in order
[executable instructions]

## 2. SECTION_B
[executable instructions]

## N-2. COUNTER_CHECK        ← Verifies work quality
[verification instructions]

## N-1. CHECKLIST           ← Pre-gate validation
□ Item 1?
□ Item 2?

## N. GATE_N                ← Binary decision: OPEN or CLOSED
IF conditions_met:
  GATE_N = OPEN
  PROCEED
ELSE:
  GATE_N = CLOSED
  HALT
```

---

## 2. ENFORCED SEQUENCE Mechanics

### Purpose
Prevent agents from skipping steps or executing out of order.

### Implementation
```yaml
# At top of each step file
ENFORCED SEQUENCE:
  1. LOAD_INPUT
  2. PROCESS_DATA
  3. GENERATE_OUTPUT
  4. COUNTER_CHECK
  5. CHECKLIST
  6. GATE_N
```

### Enforcement Mechanism
Each section begins with a check:
```
## 3. GENERATE_OUTPUT

PRECONDITION: Section 2 (PROCESS_DATA) complete
IF NOT complete → HALT with "ERROR: Must complete section 2 first"

[section logic]
```

### Violation Recovery
```
IF agent skips section:
  VIOLATION HANDLER triggers
  HALT execution
  OUTPUT: "VIOLATION: Section X required"
  RETURN to section X
```

---

## 3. GATE System

### Gate Purpose
Binary checkpoint: can agent proceed to next step?

### Gate Structure
```
GATE_N evaluation:

EVALUATE:
  condition_1 = TRUE/FALSE
  condition_2 = TRUE/FALSE
  condition_3 = TRUE/FALSE

COUNT:
  metric_A = [value]
  metric_B = [value]

COMPUTE:
  derived_metric = f(metric_A, metric_B)

IF all_conditions_TRUE AND metrics_within_thresholds:
  GATE_N = OPEN
  OUTPUT: "GATE_N OPEN - [metrics]"
  PROCEED to next step
ELSE:
  GATE_N = CLOSED
  OUTPUT: "GATE_N CLOSED - reason: [failed_condition]"
  HALT
```

### Example: GATE_3 from deep-challenge
```
GATE_3 evaluation:

EVALUATE:
  vulnerabilities_count >= 0            ← Condition 1
  detection_method_executed = TRUE      ← Condition 2
  counter_check_executed = TRUE         ← Condition 3

IF all TRUE:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - vulnerabilities_count = 4"
  PROCEED to step-04
ELSE:
  GATE_3 = CLOSED
  HALT
```

### Gate Binding
Gates are **binding**: workflow cannot proceed until gate opens.

```
workflow.md enforcement:

STEP 3: DETECT
  PRECONDITION: GATE_2 = OPEN
  FILE: step-03-detect.md
  GATE: GATE_3
  VIOLATION: Reading step-04 before GATE_3 = OPEN is VIOLATION
```

---

## 4. COUNTER_CHECK System

### Purpose
Eliminate false positives and verify work quality through adversarial self-review.

### Counter-Check Pattern
```
REQUIREMENT: [What we're verifying]
EXECUTE:
  1. CHECK_TYPE_1:
     FOR each item:
       ASK: "[Adversarial question]"
       VERIFY: [Condition]
       IF issue_found:
         FIX: [Action]
       IF no_issue:
         CONFIRM: [Status]

  2. CHECK_TYPE_2:
     [Another verification]

  3. REPORT:
     "Counter-check executed"
     "Issues found: N"
     "Corrections made: M"

VIOLATION: Skipping counter-check is VIOLATION
```

### Example: deep-challenge Step 3 Counter-Check
```
COUNTER_CHECK:

  1. MISSING DEPENDENCY CHECK:
     SELECT: 3 HIGH confidence vulnerabilities
     ASK: "Could this be false positive?"
     SEARCH: For defensive code/mitigations
     IF mitigation_found:
       RECLASSIFY: As non-vulnerability
     IF no_mitigation:
       CONFIRM: Real vulnerability

  2. FALSE POSITIVE CHECK:
     FOR vulnerabilities WHERE confidence = MEDIUM:
       ASK: "Is this theoretical or exploitable?"
       TEST: Can it actually be exploited?
       IF theoretical_only:
         DOWNGRADE: To LOW
       IF exploitable:
         UPGRADE: To HIGH

  3. REPORT:
     "False positives eliminated: 2"
     "Confidence adjustments: 3"
```

### Counter-Check Effectiveness
Typical results:
- 10-20% of findings adjusted
- False positive rate reduced from ~25% to ~5%
- Confidence scores more accurate

---

## 5. VIOLATION RECOVERY System

### Violation Types

**Type 1: Skipping Sections**
```
IF agent proceeds from section 2 directly to section 4:
  VIOLATION: Section 3 skipped
  HALT
  OUTPUT: "VIOLATION: Section 3 [NAME] required"
  RETURN to section 3
```

**Type 2: Skipping COUNTER_CHECK**
```
IF agent skips section N-2 (COUNTER_CHECK):
  VIOLATION: Counter-check mandatory
  HALT
  OUTPUT: "VIOLATION: Section N-2 COUNTER_CHECK required"
  RETURN to section N-2
```

**Type 3: Proceeding with GATE Closed**
```
IF agent reads step-04 before GATE_3 = OPEN:
  VIOLATION: Gate not open
  HALT
  OUTPUT: "VIOLATION: GATE_3 not open"
  RETURN to step-03
```

**Type 4: Partial Extraction**
```
IF agent extracts subset instead of ALL:
  VIOLATION: Completeness requirement
  HALT
  OUTPUT: "VIOLATION: ALL items required, not subset"
  RETURN to extraction section
```

### Recovery Mechanism
```
VIOLATION RECOVERY section (in each step):

IF [violation_condition]:
  HALT
  OUTPUT: "VIOLATION: [description]"
  RETURN to [section_id]
```

---

## 6. Data Flow Between Steps

### Within a Process

```
Step 1 → Output A → Step 2
         Output B ↓
Step 2 → Output C → Step 3
         Uses B   ↓
Step 3 → Output D → Step 4
         Uses C   ↓
```

### Load Pattern (JIT)
```
STEP N+1:

Section 1: LOAD_PREVIOUS_OUTPUT
  PRECONDITION: GATE_N = OPEN
  LOAD: output_from_step_N
  VERIFY: output_complete
  STORE: working_data
```

### Example: deep-compliance Step 2
```
STEP 2: MAP

Section 1: LOAD_INVENTORY
  PRECONDITION: GATE_1 = OPEN
  IF GATE_1 ≠ OPEN → HALT

  LOAD: System inventory from step-01
  LOAD: Risk classifications from step-01
  STORE: mapping_scope
  VERIFY: system_count >= 1
```

---

## 7. Method Execution Pattern

### Method Availability Check
```
IF Method XYZ available:
  EXECUTE: method_xyz.function(input)
  STORE: result
ELSE:
  EXECUTE: manual_process (fallback)
```

### Example: Method #327
```
IF Method 327 (Regulatory Requirement Mapper) available:
  EXECUTE: method_327.initialize()
  LOAD: EU AI Act requirements database

  FOR each system:
    INPUT: system capabilities
    EXECUTE: method_327.map_requirements(system)
    STORE: requirements_mapping

ELSE:
  EXECUTE: manual requirements mapping (section 3)
```

### Graceful Degradation
- If method not available, fallback to manual process
- Manual process produces same output format
- Quality may differ but process completes

---

## 8. Mechanistic Language

### Imperative Commands
```
DO NOT use: "you should", "consider", "maybe"
USE: "EXECUTE", "DO", "IF/THEN", "VERIFY"
```

### Examples

**❌ Intentional (wrong):**
```
You should extract assumptions from the input.
Consider whether the JWT secret is strong enough.
Maybe check if rate limiting is in place.
```

**✅ Mechanistic (correct):**
```
EXTRACT: All assumptions from input
VERIFY: JWT secret length >= 32 bytes
CHECK: Rate limiting active = TRUE/FALSE
```

### Trigger + Action Pattern
```
IF [condition]:
  [action]
ELSE:
  [alternative_action]
```

**Example:**
```
IF jwt_secret.length < 32:
  MARK: vulnerability = CRITICAL
  RECOMMEND: Generate new 256-bit secret
ELSE:
  MARK: secret_strength = ADEQUATE
```

---

## 9. Zero Decoration Principle

### What to Remove

**❌ Remove:**
- Tips sections
- Best practices boxes
- Example scenarios (unless in test files)
- Common pitfalls warnings
- Explanatory text
- "Why this matters" sections

**✅ Keep:**
- Executable instructions
- IF/THEN logic
- Data structures (YAML examples)
- Verification steps
- Error conditions

### Before vs After

**Before (with decoration):**
```
## Tips for Effective Testing

When testing authentication, consider these best practices:
- Always test with various input types
- Don't forget edge cases like empty strings
- Remember that SQL injection is still a threat

Example:
  Testing login with username="admin' OR 1=1--"
  should be blocked by input validation.
```

**After (zero decoration):**
```
## TEST_AUTHENTICATION

FOR each test_case:
  INPUT: test_value
  EXECUTE: authentication_check
  VERIFY: result matches expected
  IF mismatch → MARK: vulnerability_found

Test cases:
  - username="admin' OR 1=1--" → Expected: BLOCKED
  - username="" → Expected: ERROR
  - username=NULL → Expected: ERROR
```

---

## 10. JIT Information Delivery

### Principle
Load information only when needed, not upfront.

### Anti-Pattern (upfront loading)
```
STEP 1:
  LOAD: All data from all steps
  LOAD: All method specifications
  LOAD: All reference documentation
  [Agent overwhelmed with info]
```

### Correct Pattern (JIT)
```
STEP 1:
  LOAD: Only step-01 instructions
  LOAD: Only data needed for step-01

STEP 2:
  LOAD: Only output from step-01 (not earlier steps)
  LOAD: Only step-02 instructions
```

### Benefits
- Smaller context window usage
- Focused attention
- Less confusion
- Better performance

---

## 11. Self-Contained Steps

### Principle
Each step file is executable without external references (except previous step outputs).

### Requirements
- All instructions in step file
- All data structures defined
- All conditions specified
- All validation rules included

### Example
```
# STEP 3: ANALYZE

Contains:
  - All gap classification logic
  - All severity scoring rules
  - All prioritization algorithms
  - All validation checks

Does NOT require:
  - External documentation
  - Method manuals
  - Best practice guides
```

---

## 12. Process Execution State Machine

### State Diagram
```
START
  ↓
[STEP 1: Section 1]
  ↓
[STEP 1: Section 2]
  ↓
[STEP 1: COUNTER_CHECK]
  ↓
[STEP 1: CHECKLIST]
  ↓
[STEP 1: GATE_1] ──→ CLOSED → HALT
  ↓ OPEN
[STEP 2: Section 1]
  ↓
...
  ↓
[STEP 6: GATE_6] ──→ CLOSED → HALT
  ↓ OPEN
COMPLETE
```

### State Transitions
- **Forward**: Section N → Section N+1 (automatic)
- **Gate**: GATE_N closed → HALT (no forward)
- **Gate**: GATE_N open → Next step (forward)
- **Violation**: Any → HALT → Return to violated section (backward)

---

## 13. Output Format Standardization

### Process Output Schema
```yaml
process_output:
  process_id: "deep-[name]"
  execution_id: "exec-[timestamp]"
  timestamp: "2026-02-14T15:00:00Z"
  status: "COMPLETED"

  results:
    [process-specific metrics]

  outputs:
    - output_id: "[name]"
      format: "yaml"
      location: "outputs/[name].yaml"
      schema: "[schema_name]"

  metadata:
    duration_seconds: N
    gate_status:
      GATE_1: "OPEN"
      GATE_2: "OPEN"
      ...
```

### Common Schemas
- `requirement`: Used across all processes
- `gap`: Used in compliance, governance
- `policy`: Used in governance
- `vulnerability`: Used in challenge

---

## 14. Debugging Failed Gates

### Gate Failure Analysis

**GATE_2 CLOSED Example:**
```
GATE_2 CLOSED - reason: coverage < 90%

Debug steps:
  1. Check: Which requirements not mapped?
     OUTPUT: Requirements [REQ-45, REQ-67, REQ-89]

  2. Why not mapped?
     - REQ-45: System capability mismatch
     - REQ-67: Conditional requirement, condition not met
     - REQ-89: Requirement overlooked

  3. Fix:
     - REQ-45: Adjust capability matching logic
     - REQ-67: Document condition evaluation
     - REQ-89: Add mapping

  4. Re-evaluate GATE_2
```

### Common Gate Failures
1. **Insufficient coverage**: Extract more items
2. **Counter-check not executed**: Run counter-check
3. **Quality threshold not met**: Improve quality
4. **Dependencies not satisfied**: Complete dependencies

---

## 15. Best Practices for Process Execution

### 1. Read Instructions Carefully
- Don't skip sections
- Don't assume intent
- Execute exactly as written

### 2. Complete Counter-Checks
- Counter-checks are mandatory
- They improve accuracy significantly
- Never skip

### 3. Verify Before Proceeding
- Check checklist items
- Ensure all conditions met
- Don't force gates open

### 4. Document Everything
- Record all findings
- Document all decisions
- Create evidence trail

### 5. Use Violation Recovery
- If violated, return to section
- Fix issue properly
- Don't try to skip ahead

---

## Quick Reference

### Process Anatomy
```
manifest.yaml          ← Process metadata
workflow.md            ← Routing + Gates
steps/
  step-01-[name].md    ← Executable step
  step-02-[name].md
  ...
  step-06-[name].md
```

### Step Anatomy
```
ENFORCED SEQUENCE      ← Order declaration
Section 1              ← Numbered sections
Section 2
...
Section N-2: COUNTER_CHECK
Section N-1: CHECKLIST
Section N: GATE
VIOLATION RECOVERY     ← Error handling
```

### Gate Checklist
- [ ] All conditions evaluated
- [ ] All metrics computed
- [ ] Thresholds checked
- [ ] Binary decision made (OPEN/CLOSED)
- [ ] Output message generated

### Counter-Check Checklist
- [ ] Adversarial questions asked
- [ ] False positives checked
- [ ] Missing items searched
- [ ] Quality verified
- [ ] Report generated

---

**Status:** Complete guide to process internals
**Usage:** Reference when executing or debugging processes
