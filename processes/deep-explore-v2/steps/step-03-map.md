# PHASE 3: MAP

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_3
```

## 1. OBSERVE

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT WITH "GATE_2 not satisfied"

LOAD: research-results.yaml
VERIFY: file exists AND readable
IF load fails → HALT WITH error_code_006

EXTRACT FROM research-results.yaml:
  findings (ALL research findings)
  sources (ALL sources)
  gaps_researched (list of researched gap IDs)

VERIFY: findings NOT empty
IF findings.count = 0 → EMIT_WARNING "No findings to map"

STORE: loaded_research
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_012: "research findings contain ALL viable options"
  assumption_013: "option viability can be determined from findings"
  assumption_014: "options are mutually exclusive OR clearly overlapping"
  assumption_015: "minimum 2 options will be identified"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
SCAN: ALL findings IN research-results.yaml

IDENTIFY potential_options:
  FOR EACH finding IN findings:
    IF finding describes actionable_path:
      EXTRACT option:
        option_id: [auto-increment]
        option_name: "[extracted name]"
        option_description: "[what this option entails]"
        source_finding: [finding_id]
        source_gap: [gap_id that led to this finding]

    IF finding describes constraint:
      EXTRACT constraint:
        constraint_id: [auto-increment]
        constraint_description: "[what is constrained]"
        applies_to: [list of option_ids OR "all"]

    IF finding describes dimension:
      EXTRACT dimension:
        dimension_id: [auto-increment]
        dimension_name: "[e.g., cost, time, risk]"
        dimension_values: [possible values on this dimension]

REQUIREMENT: Extract ALL options mentioned in findings, not subset
VIOLATION: Extracting "main" options only is VIOLATION
REQUIREMENT: Extract ALL constraints, not just "critical"
REQUIREMENT: Extract ALL dimensions, not just "key"
```

### 3B. VERIFY

```
VALIDATE extracted_options:

FOR EACH option IN extracted_options:
  VERIFY option_name NOT empty
  VERIFY option_description NOT empty
  VERIFY source_finding valid reference
  VERIFY source_gap valid reference

  IF ANY field invalid:
    HALT WITH validation_error
    FIX option specification
    RETRY validation

CHECK completeness:
  SEARCH: Are there options mentioned but not extracted?

  FOR EACH finding IN research-results.yaml:
    IF finding mentions option_keyword:
      CHECK: Is this option in extracted_options?
      IF NOT → MISSING_OPTION = true

  IF MISSING_OPTION = true:
    ADD missed options
    RETRY verification

CHECK minimum viability:
  COUNT viable_options = WHERE viability_preliminary = true

  IF viable_options < 2:
    EMIT_WARNING: "Insufficient options for comparison"
    DECISION_REQUIRED: expand research OR accept limited set

VALIDATE extracted_constraints:
  VERIFY ALL constraints have applies_to defined
  VERIFY ALL referenced option_ids exist

VALIDATE extracted_dimensions:
  VERIFY ALL dimensions have values defined
  VERIFY dimension_values NOT empty

IF ALL validations pass:
  extracted_data = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

FOR EACH option:
  DECLARE viability_criteria:
    technical_feasibility: [can it be done?]
    resource_availability: [do we have resources?]
    constraint_compliance: [violates any constraints?]
    alignment: [aligns with decision_question?]

  COMPUTE viability_score:
    IF ALL criteria met → viable = true
    IF ANY critical criterion fails → viable = false
    IF uncertain → viable = pending_clarification

FOR EACH dimension:
  DECLARE dimension_importance: [critical|high|medium|low]
  DECLARE measurement_method: "[how to measure options on this dimension]"

FOR EACH constraint:
  DECLARE constraint_type: [hard|soft]
  DECLARE violation_impact: "[what happens if violated]"

DECLARE overall_interpretation:
  total_options_extracted: COUNT(extracted_options)
  viable_options: COUNT WHERE viable = true
  non_viable_options: COUNT WHERE viable = false
  pending_options: COUNT WHERE viable = pending_clarification
  dimensions_identified: COUNT(extracted_dimensions)
  constraints_identified: COUNT(extracted_constraints)

RECORD interpretation (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH option IN extracted_options:

  EVALUATE viability:
    IF option.viable = true:
      DECISION: include_in_map
      ADD to viable_options_list

    IF option.viable = false:
      DECISION: exclude_from_map
      RECORD exclusion_reason
      ADD to excluded_options_list

    IF option.viable = pending_clarification:
      DECISION: flag_for_review
      ADD to pending_options_list

CHECK minimum threshold:
  viable_count = COUNT(viable_options_list)

  IF viable_count < 2:
    DECISION: insufficient_options
    OUTPUT: "Only [viable_count] viable option(s) found"

    IF viable_count = 0:
      HALT WITH error_code_007
      REQUIRE: RETURN_TO_PHASE_2 OR SCOPE_REDUCTION

    IF viable_count = 1:
      EMIT_WARNING: "Single option - no comparison possible"
      OFFER: RETURN_TO_PHASE_2 to find more OR accept single option
      WAIT: user decision

  IF viable_count >= 2:
    DECISION: sufficient_options
    PROCEED

FOR EACH dimension IN extracted_dimensions:
  IF dimension.importance >= medium:
    DECISION: include_in_analysis
  ELSE:
    DECISION: document_but_skip

FINALIZE: viable_options_list, excluded_options_list, pending_options_list, dimensions_to_analyze
```

## 5. ACT (RENDER)

```
NOW render the verified, declared options:

CREATE: option-map.yaml

CONTENT:
  options:
    viable: [ALL options WHERE decision = include_in_map]
    excluded: [ALL options WHERE decision = exclude_from_map]
    pending: [ALL options WHERE decision = flag_for_review]

  option_details:
    FOR EACH option IN viable:
      - option_id: [id]
        option_name: [name]
        option_description: [description]
        viability_score: [score with criteria breakdown]
        source_finding: [finding_id]
        source_gap: [gap_id]
        constraints_applicable: [list of constraint_ids]

  dimensions:
    FOR EACH dimension WHERE decision = include_in_analysis:
      - dimension_id: [id]
        dimension_name: [name]
        dimension_importance: [level]
        dimension_values: [possible values]
        measurement_method: [how to measure]

  constraints:
    FOR EACH constraint:
      - constraint_id: [id]
        constraint_description: [description]
        constraint_type: [hard|soft]
        applies_to: [option_ids OR "all"]
        violation_impact: [impact description]

  morphological_box:
    dimensions: [list of dimension names]
    options_matrix:
      FOR EACH option:
        - option_name: [name]
          dimension_values:
            FOR EACH dimension:
              [dimension_name]: [option's value on this dimension]

  map_statistics:
    total_options_extracted: COUNT(ALL options)
    viable_options: COUNT(viable)
    excluded_options: COUNT(excluded)
    pending_options: COUNT(pending)
    dimensions_count: COUNT(dimensions)
    constraints_count: COUNT(constraints)

  assumptions_declared: [reference to assumptions 012-015]
  interpretation: [COPY from DECLARE phase]
  timestamp: [timestamp]

VERIFY: option-map.yaml created
VERIFY: ALL viable options included (not subset)
VERIFY: EVERY dimension included
VERIFY: EVERY constraint included

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "option set is complete"

ATTEMPT TO DISPROVE:

  METHOD 1 - Search for missed options:
    RE-SCAN research-results.yaml with DIFFERENT interpretation
    QUESTION: "What if I interpreted findings differently?"
    CHECK: Would different interpretation reveal more options?
    IF yes → OPTION_MISSED = true

  METHOD 2 - Check for hybrid options:
    FOR EACH pair of viable options:
      QUESTION: "Could these be combined into hybrid?"
      IF combination makes sense:
        HYBRID_OPTION_POSSIBLE = true
        RECORD hybrid possibility

  METHOD 3 - Check for implicit options:
    FOR EACH constraint:
      QUESTION: "Does this constraint imply an option not listed?"
      IF yes → IMPLICIT_OPTION_FOUND = true

  METHOD 4 - Dimension coverage:
    FOR EACH dimension:
      CHECK: Do ALL options have values on this dimension?
      IF option missing dimension value:
        DIMENSION_COVERAGE_INCOMPLETE = true

  METHOD 5 - Viability re-check:
    FOR EACH excluded option:
      QUESTION: "Could this be viable under different assumptions?"
      CHECK: Is exclusion_reason still valid?
      IF exclusion questionable:
        VIABILITY_REASSESSMENT_NEEDED = true

EVIDENCE_AGAINST:
  options_missed: [list any found]
  hybrid_options: [list possibilities]
  implicit_options: [list any found]
  dimension_gaps: [list gaps]
  viability_questions: [list reassessments]

EVIDENCE_FOR:
  systematic_extraction: [evidence of systematic approach]
  coverage: [evidence ALL findings scanned]
  viability_criteria_applied: [evidence consistent criteria]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    ADD missing options to option-map.yaml
    CREATE hybrid options if appropriate
    REASSESS viability for questioned exclusions
    UPDATE option-map.yaml
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check IN option-map.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_2 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ research-results.yaml loaded?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ ALL options extracted from findings (not "main" options)?
  IF NO → HALT, RETURN to section 3A

□ ALL constraints extracted?
  IF NO → HALT, RETURN to section 3A

□ ALL dimensions extracted?
  IF NO → HALT, RETURN to section 3A

□ extracted data verified?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ EVERY option evaluated for viability?
  IF NO → HALT, RETURN to section 4

□ Minimum 2 viable options OR user accepted less?
  IF NO → HALT, RETURN to section 4

□ option-map.yaml created WITH ALL viable options?
  IF NO → HALT, RETURN to section 5

□ morphological box includes ALL dimensions × ALL options?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check attempted to disprove completeness?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_3
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_3

```
EVALUATE gate condition:
  option-map.yaml EXISTS = [true|false]
  options >= 2 = [true|false]
  counter_check_executed = [true|false]

COUNT:
  total_viable_options = COUNT(viable options)
  total_dimensions = COUNT(dimensions)
  total_constraints = COUNT(constraints)

IF option-map.yaml EXISTS = true
   AND total_viable_options >= 2
   AND counter_check_executed = true:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - options = [total_viable_options], dimensions = [total_dimensions]"
  NEXT: READ steps/step-04-deepen.md

ELSE:
  GATE_3 = CLOSED
  IDENTIFY: which condition failed

  IF total_viable_options < 2:
    OUTPUT: "GATE_3 CLOSED - only [total_viable_options] viable option(s)"
    REQUIRE: RETURN_TO_PHASE_2 to expand research

  IF option-map.yaml NOT exists:
    OUTPUT: "GATE_3 CLOSED - option-map.yaml missing"

  IF counter_check_executed = false:
    OUTPUT: "GATE_3 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Only 1 viable option found, cannot find more

DECLARE_SCOPE_REDUCTION:
  gate: GATE_3
  condition_failed: "options >= 2"
  options_found: 1
  reason: "[e.g., research exhausted, no other options exist in domain]"
  impact: "No comparison possible, single-option decision"
  alternatives_attempted:
    - "Re-scanned ALL research findings - no more options"
    - "Checked for hybrid combinations - none viable"
    - "Reviewed excluded options - exclusions valid"
  mitigation: "Accept single option OR return to Phase 2 with expanded scope"
  user_approval: REQUIRED (this is critical decision point)

HALT until user responds:
  APPROVE → LOG reduction + PROCEED with single option
  DENY → MUST RETURN_TO_PHASE_2 with expanded scope
  MODIFY → Adjust criteria and retry
```

## VIOLATION RECOVERY

```
IF agent renders (ACT) before verify:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must VERIFY before RENDER"
  RETURN to section 3B

IF agent renders before declare:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must DECLARE before RENDER"
  RETURN to section 3C

IF agent extracts "main" options instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must extract ALL options, not 'main' subset"
  RETURN to section 3A

IF agent extracts "key" dimensions instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must extract ALL dimensions, not 'key' subset"
  RETURN to section 3A

IF agent proceeds with < 2 options without SCOPE_REDUCTION:
  HALT
  OUTPUT: "VIOLATION: Zasada 4 - cannot bypass gate condition"
  REQUIRE: SCOPE_REDUCTION declaration OR RETURN_TO_PHASE_2
```
