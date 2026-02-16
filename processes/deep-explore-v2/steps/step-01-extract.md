# PHASE 1: EXTRACT

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_1
```

## 1. OBSERVE

```
PRECONDITION: GATE_0 = OPEN
IF GATE_0 ≠ OPEN → HALT WITH "GATE_0 not satisfied"

LOAD: ground-state.yaml
VERIFY: file exists AND readable
IF load fails → HALT WITH error_code_005

EXTRACT FROM ground-state.yaml:
  decision_question
  mode
  depth

LOAD: context_artifacts (if provided in input)
FOR EACH artifact IN context_artifacts:
  LOAD artifact ONLY IF artifact relevant to decision_question
  IF NOT relevant → SKIP (do not load unnecessary data)

STORE: loaded_context
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_005: "ALL relevant knowledge gaps can be identified from question + context"
  assumption_006: "knowledge gaps classification is comprehensive"
  assumption_007: "context_artifacts contain NO conflicting information"
  assumption_008: "gap detection criteria are appropriate for depth level"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
SCAN: decision_question + loaded_context

IDENTIFY knowledge_gaps:
  FOR EACH concept IN decision_question:
    IF concept requires background knowledge:
      EXTRACT gap:
        gap_id: [auto-increment]
        gap_description: "[what is unknown]"
        gap_type: [factual|procedural|contextual|evaluative]
        researchable: [true|false]
        priority: [critical|high|medium|low]

  FOR EACH assumption IN context:
    IF assumption unverified:
      EXTRACT gap:
        gap_id: [auto-increment]
        gap_description: "[assumption needing verification]"
        gap_type: verification
        researchable: true
        priority: high

REQUIREMENT: Extract ALL gaps, not subset
VIOLATION: Extracting "main" gaps only is VIOLATION
```

### 3B. VERIFY

```
VALIDATE extracted_gaps:

FOR EACH gap IN extracted_gaps:
  VERIFY gap_description NOT empty
  VERIFY gap_type IN [factual|procedural|contextual|evaluative|verification]
  VERIFY researchable IN [true|false]
  VERIFY priority IN [critical|high|medium|low]

  IF ANY field invalid:
    HALT WITH validation_error
    FIX gap specification
    RETRY validation

CHECK completeness:
  SEARCH: Are there gaps missed?
  FOR EACH concept in decision_question:
    IF concept NOT covered by any gap:
      MISSING_GAP = true
      ADD gap
      RETRY verification

IF ALL gaps validated AND no missing gaps:
  extracted_gaps = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

FOR EACH gap:
  DECLARE gap_detection_method: "[how gap was identified]"
  DECLARE gap_boundary: "[what is IN scope vs OUT of scope for this gap]"
  DECLARE research_approach: "[how this gap will be researched IF researchable]"

DECLARE overall_interpretation:
  total_gaps_identified: COUNT(extracted_gaps)
  gap_distribution: COUNT BY gap_type
  research_queue_size: COUNT WHERE researchable = true
  non_researchable_gaps: COUNT WHERE researchable = false

RECORD interpretation IN knowledge-gaps.yaml (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH gap IN extracted_gaps:

  IF gap.researchable = true AND gap.priority >= medium:
    DECISION: queue_for_research
    ADD to research_queue

  IF gap.researchable = true AND gap.priority < medium:
    DECISION: optional_research
    ADD to optional_queue

  IF gap.researchable = false:
    DECISION: mark_as_unknown
    ADD to unknowable_list

COMPUTE research_effort:
  required_items = COUNT(research_queue)
  optional_items = COUNT(optional_queue)

  IF required_items > 20 AND depth = quick:
    EMIT_WARNING: "Research queue large for quick depth"
    OFFER: increase depth OR reduce scope

  IF required_items = 0:
    EMIT_WARNING: "No researchable gaps - verify question understanding"

FINALIZE: research_queue, optional_queue, unknowable_list
```

## 5. ACT (RENDER)

```
NOW render the verified, declared gaps:

CREATE: knowledge-gaps.yaml

CONTENT:
  gaps: [ALL extracted_gaps WITH verification status]
  research_queue:
    required: [ALL items WHERE decision = queue_for_research]
    optional: [ALL items WHERE decision = optional_research]
  unknowable: [ALL items WHERE decision = mark_as_unknown]
  gap_statistics:
    total: COUNT(gaps)
    by_type: [COUNT grouped BY gap_type]
    by_priority: [COUNT grouped BY priority]
    researchable: COUNT WHERE researchable = true
    non_researchable: COUNT WHERE researchable = false
  assumptions_declared: [reference to assumptions 005-008]
  interpretation: [COPY from DECLARE phase]
  timestamp: [timestamp]

VERIFY: knowledge-gaps.yaml created
VERIFY: ALL gaps included (not subset)
VERIFY: EVERY gap has required fields

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "ALL relevant knowledge gaps identified"

ATTEMPT TO DISPROVE:

  METHOD 1 - Search for missed gaps:
    RE-SCAN decision_question with DIFFERENT interpretation
    CHECK: Are there gaps under alternative interpretation?
    IF yes → GAP_MISSED = true

  METHOD 2 - Check for implicit gaps:
    FOR EACH gap IN extracted_gaps:
      CHECK: Does this gap imply OTHER gaps?
      IF yes → IMPLICIT_GAP_FOUND = true

  METHOD 3 - Adversarial search:
    ASSUME: "I intentionally want to miss gaps"
    IDENTIFY: Which types of gaps are easiest to overlook?
    CHECK: Did I overlook any of those types?

  METHOD 4 - Cross-check with depth level:
    IF depth = comprehensive:
      CHECK: Are gaps granular enough?
      IF no → GRANULARITY_INSUFFICIENT = true

EVIDENCE_AGAINST:
  gaps_missed: [list any found]
  implicit_gaps: [list any found]
  granularity_issues: [list any found]

EVIDENCE_FOR:
  systematic_scan: [evidence of systematic approach]
  coverage: [evidence ALL areas covered]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    ADD missing gaps to extracted_gaps
    UPDATE knowledge-gaps.yaml
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check IN knowledge-gaps.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_0 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ ground-state.yaml loaded?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE extract?
  IF NO → HALT, RETURN to section 2

□ ALL knowledge gaps extracted (not "main" gaps)?
  IF NO → HALT, RETURN to section 3A

□ extracted gaps verified?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ EVERY gap classified into queue?
  IF NO → HALT, RETURN to section 4

□ knowledge-gaps.yaml created WITH ALL gaps?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check attempt to disprove claim?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_1
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_1

```
EVALUATE gate condition:
  knowledge-gaps.yaml EXISTS = [true|false]
  ALL gaps classified = [true|false]
  counter_check_executed = [true|false]

COUNT:
  total_gaps = COUNT(gaps)
  classified_gaps = COUNT WHERE decision ≠ null

IF knowledge-gaps.yaml EXISTS = true
   AND classified_gaps = total_gaps
   AND counter_check_executed = true:
  GATE_1 = OPEN
  OUTPUT: "GATE_1 OPEN - gaps = [total_gaps], researchable = [count]"
  NEXT: READ steps/step-02-research.md

ELSE:
  GATE_1 = CLOSED
  IDENTIFY: which condition failed

  IF classified_gaps < total_gaps:
    unclassified = total_gaps - classified_gaps
    OUTPUT: "GATE_1 CLOSED - [unclassified] gaps not classified"

  IF knowledge-gaps.yaml NOT exists:
    OUTPUT: "GATE_1 CLOSED - knowledge-gaps.yaml missing"

  IF counter_check_executed = false:
    OUTPUT: "GATE_1 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Cannot research ALL gaps due to constraints

DECLARE_SCOPE_REDUCTION:
  gate: GATE_1
  condition_failed: "EVERY gap in queue researched"
  gaps_affected: [list specific gap IDs]
  reason: "[e.g., time constraint, resource unavailable, not 'token limits']"
  impact: "Decision made with incomplete information on [topics]"
  alternatives_attempted:
    - "Attempted web search - failed"
    - "Checked context_artifacts - not found"
  mitigation: "Document as assumption: '[what is assumed about skipped gaps]'"
  user_approval: REQUIRED (if critical gaps) | AUTOMATIC (if optional gaps)

IF critical gaps affected:
  HALT until user APPROVES | DENIES | MODIFIES

IF only optional gaps affected:
  LOG reduction
  PROCEED with warning
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

IF agent extracts "main" gaps instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must extract ALL gaps, not 'main' subset"
  RETURN to section 3A

IF agent proceeds with GATE_1 = CLOSED without SCOPE_REDUCTION:
  HALT
  OUTPUT: "VIOLATION: Zasada 4 - cannot bypass closed gate"
  REQUIRE: SCOPE_REDUCTION declaration OR complete gate condition
```
