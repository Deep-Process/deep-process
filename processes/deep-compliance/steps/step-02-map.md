---
step: 2
name: "Requirements Mapping"
time_estimate: "30-90 minutes"
goal: "Load regulation requirements, map to system capabilities, determine applicability"
requires_completion: [1]
next_steps:
  DEFAULT: "steps/step-03-analyze.md"
gate: "GATE_2"
data_dependencies:
  - "data/regulations-info.yaml"
  - "data/requirements-[regulation].json"
outputs:
  - requirements_mapping
  - applicability_assessment
  - coverage_percentage
---

# STEP 2: MAP REQUIREMENTS

## ENFORCEMENT RULES

```
1. LOAD regulation requirements from data file BEFORE mapping.
2. Map requirements to EVERY system from GATE_1.
3. Determine applicability for EACH requirement (MANDATORY/CONDITIONAL/NOT_APPLICABLE).
4. Coverage threshold: HIGH_RISK >= 90%, GENERAL_PURPOSE >= 80%.
5. Counter-check ALL mappings before GATE_2.
6. NO skipping requirements.
7. NO assumptions about capability matches - extract from system inventory.
```

---

## 2.0 Load Required Data

**PRECONDITION:** GATE_1 = OPEN

IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

**Execute these steps in this order:**

### Step 1: Load system inventory from GATE_1

```
FROM step-01 output:
  [ ] system_inventory loaded
  [ ] system_count: [N]
  [ ] high_risk_systems: [count]
  [ ] general_purpose_systems: [count]
  [ ] capabilities_extracted: [total count]
```

### Step 2: Determine regulation

```
FROM input OR configuration:
  regulation_id: "[eu-ai-act|gdpr|hipaa|soc2|iso27001|nis2]"

IF regulation_id not specified:
  DEFAULT: "eu-ai-act"
  LOG: "Using default regulation: eu-ai-act"
```

### Step 3: Load regulation requirements

```
1. Read `data/regulations-info.yaml`
2. Lookup regulation_id → get requirements file name
3. Read `data/requirements-[regulation].json`
4. Parse requirements array

Loaded:
  [ ] regulations-info.yaml
  [ ] requirements file: [filename]
  [ ] requirements_count: [total]
  [ ] regulation_name: "[name]"
```

> **HALT** — Confirm all data loaded before proceeding.

---

## 2.1 Map Requirements to Systems

**Execute for EACH system from system_inventory:**

### Step 1: Determine applicable requirements

```
FOR system S[N]:
  classification = S.classification  # HIGH_RISK or GENERAL_PURPOSE

  IF classification = "HIGH_RISK":
    applicable_requirements = ALL requirements WHERE:
      general_purpose_applicable = false OR
      annex_iii_categories contains S.annex_iii_category OR
      annex_iii_categories contains "all"

  IF classification = "GENERAL_PURPOSE":
    applicable_requirements = ALL requirements WHERE:
      general_purpose_applicable = true

  RECORD:
    System: [S.system_id]
    Classification: [classification]
    Applicable requirements: [count]
```

### Step 2: Map each requirement to system capabilities

```
FOR each requirement R in applicable_requirements:

  EXTRACT from requirement:
    requirement_id = R.id
    article = R.article
    section = R.section
    requirement_text = R.text
    keywords = R.keywords

  MATCH to system capabilities:
    1. Scan S.capabilities for keyword matches
    2. For each capability:
       score = 0
       FOR keyword in R.keywords:
         IF keyword appears in capability text (case-insensitive):
           score += 1

       normalized_score = score / len(R.keywords)

    3. Select best match:
       best_capability = capability with highest normalized_score
       confidence = normalized_score

  DETERMINE applicability:
    IF best_capability exists AND confidence >= 0.5:
      applicability = "MANDATORY"
      capability_match = best_capability
    ELIF best_capability exists AND confidence >= 0.3:
      applicability = "CONDITIONAL"
      capability_match = best_capability
      condition = "Verify if [capability_match] fully addresses requirement"
    ELSE:
      applicability = "NOT_APPLICABLE"
      capability_match = null

  RECORD mapping:
```yaml
requirement_mapping:
  system_id: [S.system_id]
  requirement_id: [R.id]
  article: [R.article]
  section: [R.section]
  requirement_text: [R.text]
  applicability: [MANDATORY|CONDITIONAL|NOT_APPLICABLE]
  system_capability_match: [capability_match or null]
  confidence: [0.0-1.0]
  condition: [condition if CONDITIONAL, else null]
```

### Step 3: Compile mappings for system

```
System S[N] mapping complete:
  Total requirements mapped: [count]
  MANDATORY: [count]
  CONDITIONAL: [count]
  NOT_APPLICABLE: [count]
```

**ENFORCEMENT:** Map ALL applicable requirements. NO partial mapping.

> **HALT** — Confirm all systems mapped before proceeding.

---

## 2.2 Calculate Coverage

**Execute for EACH system:**

### Step 1: Count applicable vs satisfied

```
FOR system S[N]:

  applicable_count = COUNT(applicability = MANDATORY OR CONDITIONAL)
  total_requirements = COUNT(all requirements for regulation)

  coverage_percentage = (applicable_count / total_requirements) * 100

  RECORD:
```yaml
coverage_metrics:
  system_id: [S.system_id]
  regulation: [regulation_id]
  total_requirements: [total]
  applicable_requirements: [applicable_count]
  mandatory_requirements: [count where applicability = MANDATORY]
  conditional_requirements: [count where applicability = CONDITIONAL]
  not_applicable_requirements: [count where applicability = NOT_APPLICABLE]
  coverage_percentage: [percentage]
```

### Step 2: Verify coverage threshold

```
IF S.classification = "HIGH_RISK":
  threshold = 90%
ELSE:
  threshold = 80%

IF coverage_percentage >= threshold:
  coverage_status = "PASS"
ELSE:
  coverage_status = "FAIL"
  missing_count = [requirements needed to reach threshold]

  LOG WARNING: "Coverage [coverage_percentage]% below threshold [threshold]%"
  LOG: "Missing [missing_count] requirements"
```

**ENFORCEMENT:** Do NOT proceed to GATE_2 if coverage < threshold.

> **HALT** — Confirm coverage calculated for all systems.

---

## 2.3 Counter-Check

**REQUIREMENT:** Adversarial review of all mappings.

**Execute these checks:**

### Check 1: Missing Requirements

```
FOR each requirement R in requirements file:
  CHECK: Requirement considered in mapping?

  IF requirement R not in any system mapping:
    INVESTIGATE: Why excluded?

    Possible reasons:
      - Regulation filtering excluded it
      - Classification mismatch
      - Error in mapping logic

    IF should be included:
      ADD: To appropriate system mapping
      UPDATE: Coverage metrics
    IF correctly excluded:
      DOCUMENT: Exclusion reason
```

### Check 2: Over-Mapping (False Positives)

```
FOR each mapping WHERE applicability = "MANDATORY":
  CHALLENGE: "Does this requirement TRULY apply?"

  RE-EVALUATE:
    1. Check system capabilities actually exist
    2. Check confidence score is >= 0.5
    3. Check requirement applies to system type

  IF confidence < 0.5:
    DOWNGRADE: applicability = "CONDITIONAL"
    UPDATE: condition

  IF no real capability match:
    UPDATE: applicability = "NOT_APPLICABLE"
    DOCUMENT: Reason
```

### Check 3: Conditional Logic Resolution

```
FOR each mapping WHERE applicability = "CONDITIONAL":
  EVALUATE: Can condition be resolved now?

  IF condition clearly MET:
    UPGRADE: applicability = "MANDATORY"
    REMOVE: condition

  IF condition clearly NOT MET:
    UPDATE: applicability = "NOT_APPLICABLE"
    DOCUMENT: Why not met

  IF condition UNCLEAR:
    KEEP: as CONDITIONAL
    ENHANCE: condition description
```

### Check 4: Capability Match Verification

```
FOR each mapping WHERE capability_match is not null:
  VERIFY: Capability exists in system inventory
  VERIFY: Capability text actually relates to requirement

  IF capability not found:
    ERROR: "Invalid capability reference"
    CORRECT: Match to actual capability OR set to null

  IF capability unrelated to requirement:
    RECALCULATE: keyword matching
    UPDATE: capability_match with correct match
```

### Check 5: Coverage Re-Calculation

```
AFTER all corrections from checks 1-4:
  FOR each system:
    RECALCULATE: coverage_percentage
    REVERIFY: coverage_status against threshold

    IF coverage now >= threshold:
      UPDATE: coverage_status = "PASS"
    IF coverage still < threshold:
      IDENTIFY: Specific missing requirements
      LOG: "Still need [N] requirements for coverage"
```

### Report Counter-Check Results

```
Counter-Check Execution Report:
  Missing requirements added: [count]
  Over-mappings corrected: [count]
  Conditional resolutions: [count]
  Capability matches verified: [count]
  Final coverage: [percentage]%
  Coverage status: [PASS/FAIL]
```

> **HALT** — Confirm counter-check complete.

---

## 2.4 Compile Requirements Mapping Output

**Execute:**

### Step 1: Aggregate all mappings

```yaml
requirements_mapping:
  regulation: [regulation_id]
  regulation_name: [name from data file]
  total_systems: [count]
  total_requirements: [count]

  systems:
    - system_id: [S1.system_id]
      classification: [HIGH_RISK|GENERAL_PURPOSE]
      coverage_percentage: [percentage]
      coverage_status: [PASS|FAIL]
      requirements:
        - [all mappings for S1]

    - system_id: [S2.system_id]
      # ... etc for all systems

  summary:
    total_mappings: [count across all systems]
    mandatory_mappings: [count]
    conditional_mappings: [count]
    not_applicable_mappings: [count]
    systems_passing_threshold: [count]
    systems_failing_threshold: [count]
```

### Step 2: Update frontmatter

```yaml
# Add to process state:
requirements_mapped: true
regulation_used: [regulation_id]
mapping_coverage: [average coverage across systems]
```

---

## GATE_2: Requirements Mapping → Gap Analysis

**ENFORCEMENT:** ALL checklist items MUST be DONE before proceeding.

### Gate Checklist

```
[ ] G2.1: System inventory loaded from GATE_1
[ ] G2.2: Regulation requirements file loaded
[ ] G2.3: ALL systems mapped (no skipped systems)
[ ] G2.4: ALL applicable requirements mapped (no skipped requirements)
[ ] G2.5: Applicability determined for every mapping
[ ] G2.6: Coverage calculated for every system
[ ] G2.7: Counter-check executed (all 5 checks)
[ ] G2.8: Coverage >= threshold (90% HIGH_RISK, 80% GENERAL_PURPOSE)
[ ] G2.9: requirements_mapping output compiled
```

### Coverage Threshold Evaluation

```
FOR each system:
  IF coverage_status = "FAIL":
    LIST: Missing requirements
    OPTION 1: Add missing capabilities to system
    OPTION 2: Accept risk and proceed (requires justification)
    OPTION 3: Reduce scope (exclude non-critical requirements)

    User decision required: _________________
```

### Gate Passage

```
EVALUATE:
  all_systems_covered = (systems_passing_threshold >= total_systems * 0.8)
  counter_check_executed = TRUE
  requirements_mapped >= 90% (for all systems combined)

IF all_systems_covered AND counter_check_executed AND requirements_mapped >= 90%:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - [N] systems mapped, [R] requirements, [C]% avg coverage"
  PROCEED to step-03-analyze.md

ELSE:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED"
  OUTPUT: "Reason: [which condition failed]"
  OUTPUT: "Systems failing: [list]"
  OUTPUT: "Average coverage: [percentage]%"
  HALT
```

**ENFORCEMENT:** Do NOT proceed to step 3 until GATE_2 = OPEN.

---

## VIOLATION RECOVERY

```
IF agent skips loading requirements file:
  HALT
  OUTPUT: "VIOLATION: Section 2.0 Load Required Data mandatory"
  RETURN to section 2.0

IF agent maps only subset of requirements:
  HALT
  OUTPUT: "VIOLATION: ALL applicable requirements must be mapped"
  OUTPUT: "Found [N] requirements, only [M] mapped"
  RETURN to section 2.1

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 2.3 Counter-Check is MANDATORY"
  RETURN to section 2.3

IF agent proceeds with coverage < threshold:
  HALT
  OUTPUT: "VIOLATION: Coverage [X]% below threshold [Y]%"
  OUTPUT: "GATE_2 cannot open"
  RETURN to section 2.2 or request scope reduction
```

---

**END OF STEP 2**

**Next action:** IF GATE_2 = OPEN → Load `steps/step-03-analyze.md`
