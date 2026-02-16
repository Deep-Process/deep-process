# PHASE 0: GROUND

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT
4. DECIDE
5. ACT
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_0
```

## 1. OBSERVE

```
LOAD: decision_question FROM input
VERIFY: decision_question IS string
IF decision_question = null → HALT WITH error_code_001
IF decision_question = "" → HALT WITH error_code_001
IF decision_question.length = 0 → HALT WITH error_code_001
STORE: question_raw
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_001: "question is interpretable"
  assumption_002: "question has single primary intent"
  assumption_003: "question requires exploration"
  assumption_004: "context is complete"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT

```
ANALYZE: question_raw

CLASSIFY question_type:
  IF question contains "how" OR "why" OR "what if":
    question_type = exploratory
  IF question contains "which" OR "should I":
    question_type = decision
  IF question contains "is" OR "can":
    question_type = verification
  ELSE:
    question_type = undefined

EXTRACT question_components:
  subject = [extract subject]
  action = [extract action if present]
  constraints = [extract constraints if present]
  scope = [extract scope if present]

IDENTIFY interpretation_ambiguities:
  FOR EACH component:
    IF component has multiple interpretations:
      RECORD ambiguity
      DECLARE preferred_interpretation WITH reason

OUTPUT: question_analysis.yaml WITH:
  - question_type
  - question_components
  - ambiguities
  - interpretations
```

## 4. DECIDE

```
EVALUATE question_type:

IF question_type = exploratory:
  SET mode = exploration
  SET min_options = 3
  SET depth_default = standard

IF question_type = decision:
  SET mode = comparison
  SET min_options = 2
  SET depth_default = comprehensive

IF question_type = verification:
  SET mode = validation
  SET min_options = 1
  SET depth_default = quick

IF question_type = undefined:
  HALT WITH error_code_003
  REQUIRE user clarification

RECORD: mode, min_options, depth_default
```

## 5. ACT

```
CREATE: ground-state.yaml

CONTENT:
  decision_question: [question_raw]
  question_type: [question_type]
  mode: [mode]
  min_options: [min_options]
  depth: [depth_default OR user_specified_depth]
  assumptions_declared:
    - assumption_001
    - assumption_002
    - assumption_003
    - assumption_004
  question_analysis: [reference to question_analysis.yaml]
  timestamp: [timestamp]

VERIFY: ground-state.yaml created successfully
IF creation fails → HALT WITH error_code_004
```

## 6. COUNTER_CHECK

```
CLAIM: "question_type classification is correct"

ATTEMPT TO DISPROVE:
  IF question_type = exploratory:
    CHECK: Does question have definitive answer? (would indicate verification type)
    CHECK: Does question ask for binary choice? (would indicate decision type)

  IF question_type = decision:
    CHECK: Is question actually asking "how" not "which"? (would indicate exploratory)
    CHECK: Are options pre-defined or need discovery? (exploratory if discovery needed)

  IF question_type = verification:
    CHECK: Does question actually require multi-option analysis? (would indicate decision/exploratory)

EVIDENCE_AGAINST: [record counter-evidence found]
EVIDENCE_FOR: [record supporting evidence]

VERDICT:
  IF counter_evidence weight > 50%:
    classification_holds = false
    RECLASSIFY question_type
    UPDATE ground-state.yaml
  ELSE:
    classification_holds = true
    PROCEED

RECORD counter_check results IN ground-state.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ decision_question loaded from input?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ question_type classified?
  IF NO → HALT, RETURN to section 3

□ mode set based on question_type?
  IF NO → HALT, RETURN to section 4

□ ground-state.yaml created?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ ALL checklist items answered?
  IF NO → COMPLETE remaining items

IF ALL YES → PROCEED to GATE_0
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_0

```
EVALUATE gate condition:
  ground-state.yaml EXISTS = [true|false]
  assumptions_declared = [true|false]
  counter_check_executed = [true|false]

IF ground-state.yaml EXISTS = true
   AND assumptions_declared = true
   AND counter_check_executed = true:
  GATE_0 = OPEN
  OUTPUT: "GATE_0 OPEN - proceeding to PHASE 1"
  NEXT: READ steps/step-01-extract.md

ELSE:
  GATE_0 = CLOSED
  IDENTIFY: which condition failed
  OUTPUT: "GATE_0 CLOSED - [failed condition]"
  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

DECLARE_SCOPE_REDUCTION:
  gate: GATE_0
  condition_failed: "[specific condition]"
  reason: "[honest reason - NOT 'brevity' or 'token limits']"
  impact: "[what is lost]"
  alternatives_attempted: "[list what was tried]"
  user_approval: REQUIRED (this is Phase 0, critical)

HALT until user responds:
  APPROVE → LOG reduction + PROCEED
  DENY → MUST complete condition
  MODIFY → Adjust and retry
```

## VIOLATION RECOVERY

```
IF agent skips DECLARE_ASSUMPTIONS (section 2):
  HALT
  OUTPUT: "VIOLATION: Assumptions must be declared BEFORE orient"
  RETURN to section 2

IF agent skips COUNTER_CHECK (section 6):
  HALT
  OUTPUT: "VIOLATION: Counter-check required in every phase"
  RETURN to section 6

IF agent skips CHECKLIST (section 7):
  HALT
  OUTPUT: "VIOLATION: Checklist required after every phase"
  RETURN to section 7

IF agent attempts to proceed with GATE_0 = CLOSED without SCOPE_REDUCTION:
  HALT
  OUTPUT: "VIOLATION: Cannot bypass closed gate without scope reduction"
  REQUIRE: SCOPE_REDUCTION declaration OR complete gate condition
```
