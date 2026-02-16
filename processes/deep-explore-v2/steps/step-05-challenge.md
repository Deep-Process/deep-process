# PHASE 5: CHALLENGE

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. OBSERVE

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT WITH "GATE_4 not satisfied"

LOAD: consequence-map.yaml
LOAD: assumptions_log.yaml
VERIFY: files exist AND readable
IF load fails → HALT WITH error_code_009

EXTRACT FROM consequence-map.yaml:
  categorized_options (ALL options with assessments)
  critical_decisions (ALL critical flags)
  risk_summary (ALL identified risks)

EXTRACT FROM assumptions_log.yaml:
  ALL assumptions (from phases 0-4)
  assumption_001 through assumption_019

VERIFY: assumptions_log NOT empty
VERIFY: assumptions_log.count >= 19 (all phases declared)

STORE: loaded_assumptions, loaded_decisions
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_020: "assumptions can be falsified through logical challenge"
  assumption_021: "fragile assumptions identifiable through stress testing"
  assumption_022: "decisions dependent on fragile assumptions carry higher risk"
  assumption_023: "assumption robustness measurable on [weak|moderate|strong] scale"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
FOR EACH assumption IN assumptions_log.yaml:

  EXTRACT assumption_metadata:
    assumption_id: [id]
    assumption_text: [statement]
    phase_declared: [0-4]
    decisions_dependent: [which decisions rely on this]

  DESIGN falsification_test:

    EXTRACT challenge_method:
      IF assumption contains "can be":
        method = capability_challenge
        test: "Find scenario where capability fails"

      IF assumption contains "will" OR "always":
        method = universality_challenge
        test: "Find single counter-example"

      IF assumption contains "sufficient" OR "adequate":
        method = sufficiency_challenge
        test: "Find case where insufficient"

      IF assumption contains "accurate" OR "correct":
        method = accuracy_challenge
        test: "Find contradicting evidence"

      IF assumption contains timeframe:
        method = temporal_challenge
        test: "Check if timeframe realistic"

    EXTRACT stress_scenarios:
      FOR EACH assumption:
        GENERATE scenario_1: "worst case conditions"
        GENERATE scenario_2: "opposite conditions from expected"
        GENERATE scenario_3: "partial failure conditions"

  EXECUTE falsification_attempt:
    FOR EACH challenge_method:
      ATTEMPT TO FIND:
        counter_example: [evidence assumption false]
        edge_case: [scenario where assumption breaks]
        contradiction: [logic error in assumption]
        insufficiency: [assumption too weak/narrow]

    RECORD falsification_results:
      falsified: [true|false]
      evidence_against: [counter-examples found OR null]
      edge_cases: [scenarios where fails OR null]
      contradictions: [logical errors OR null]

  ASSESS assumption_robustness:
    IF falsification_attempt found NO evidence_against:
      robustness = strong
      justification: "survived all challenge attempts"

    IF falsification_attempt found minor edge_cases:
      robustness = moderate
      justification: "holds in most cases, fragile in [edge_cases]"

    IF falsification_attempt found counter_example OR contradiction:
      robustness = weak
      justification: "assumption questionable due to [evidence_against]"

    IF assumption cannot be tested:
      robustness = untestable
      justification: "no falsification method available"

  IDENTIFY dependent_decisions:
    FOR EACH decision IN consequence-map.yaml:
      IF decision relies_on current_assumption:
        EXTRACT dependency:
          decision_id: [id]
          decision_name: [name]
          dependency_type: [critical|supporting]
          risk_if_assumption_fails: [impact description]

REQUIREMENT: Challenge EVERY assumption, not subset
VIOLATION: Challenging "key" assumptions only is VIOLATION
REQUIREMENT: Execute ALL stress scenarios, not just "likely"
```

### 3B. VERIFY

```
VALIDATE challenge_execution:

FOR EACH assumption IN assumptions_log.yaml:
  VERIFY assumption has challenge_method assigned
  VERIFY assumption has falsification_attempt executed
  VERIFY assumption has robustness assessed
  VERIFY assumption has dependent_decisions identified

  FOR EACH challenge_method:
    VERIFY stress_scenarios executed (must have 3 scenarios)
    VERIFY falsification_results recorded

    IF robustness = weak:
      VERIFY evidence_against NOT empty
      VERIFY justification explains weakness

    IF robustness = strong:
      VERIFY challenge_attempts documented
      VERIFY justification explains why survived

CHECK completeness:
  total_assumptions = COUNT(assumptions_log.yaml)
  challenged_assumptions = COUNT WHERE falsification_attempt executed

  IF challenged_assumptions < total_assumptions:
    MISSING_CHALLENGES = true
    LIST: which assumptions not challenged
    REQUIRE: challenge missing assumptions
    RETRY verification

CHECK dependency_mapping:
  FOR EACH decision IN consequence-map.yaml:
    FOR EACH assumption it relies on:
      VERIFY dependency documented
      VERIFY risk_if_assumption_fails specified

IF ALL validations pass:
  challenge_results = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

CATEGORIZE assumptions BY robustness:
  strong_assumptions: COUNT WHERE robustness = strong
  moderate_assumptions: COUNT WHERE robustness = moderate
  weak_assumptions: COUNT WHERE robustness = weak
  untestable_assumptions: COUNT WHERE robustness = untestable

FOR EACH weak assumption:
  DECLARE fragility_impact:
    assumption_id: [id]
    affects_decisions: [list of decision_ids]
    criticality: [how critical are affected decisions]
    mitigation_needed: true
    mitigation_type: [strengthen assumption|remove dependency|accept risk]

FOR EACH decision IN critical_decisions:
  EVALUATE assumption_foundation:
    relies_on_weak: COUNT WHERE dependency.robustness = weak
    relies_on_moderate: COUNT WHERE dependency.robustness = moderate
    relies_on_strong: COUNT WHERE dependency.robustness = strong

    COMPUTE foundation_strength:
      IF relies_on_weak > 0:
        foundation = fragile
        risk_level = high
      ELSE IF relies_on_moderate > relies_on_strong:
        foundation = questionable
        risk_level = medium
      ELSE:
        foundation = solid
        risk_level = low

DECLARE overall_interpretation:
  total_assumptions_challenged: COUNT(ALL assumptions)
  assumptions_falsified: COUNT WHERE falsified = true
  assumptions_weakened: COUNT WHERE robustness = weak
  assumptions_validated: COUNT WHERE robustness = strong
  decisions_on_fragile_foundation: COUNT WHERE foundation = fragile
  high_risk_decisions: COUNT WHERE risk_level = high

RECORD interpretation (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH assumption IN assumptions_log.yaml:

  EVALUATE robustness_outcome:
    IF assumption.robustness = weak:
      DECISION: flag_for_mitigation
      REQUIRE: strengthen OR remove_dependency OR accept_documented_risk

    IF assumption.robustness = strong:
      DECISION: accept_as_foundation
      MARK: reliable for decision-making

    IF assumption.robustness = moderate:
      DECISION: monitor_in_implementation
      MARK: validate during execution

    IF assumption.robustness = untestable:
      DECISION: flag_as_uncertainty
      REQUIRE: document as unknown risk factor

FOR EACH decision WHERE foundation = fragile:

  EVALUATE mitigation_options:
    OPTION 1: strengthen_weak_assumptions
      IF possible to gather more evidence:
        mitigation = research_to_strengthen

    OPTION 2: remove_dependency
      IF decision can be restructured:
        mitigation = redesign_decision

    OPTION 3: accept_risk
      IF impact manageable:
        mitigation = document_and_proceed
        REQUIRE: user_approval

    OPTION 4: reject_decision
      IF risk unacceptable:
        mitigation = exclude_from_options
        MARK: decision too risky

  DECISION: apply_mitigation
  SELECT: mitigation strategy from options

CATEGORIZE decisions BY foundation_strength:
  solid_decisions: WHERE foundation = solid
  questionable_decisions: WHERE foundation = questionable
  fragile_decisions: WHERE foundation = fragile

FINALIZE: challenged_assumptions, mitigation_strategies, risk_flags
```

## 5. ACT (RENDER)

```
NOW render the verified, declared challenge results:

CREATE: assumption-challenge-results.yaml

CONTENT:
  challenged_assumptions:
    FOR EACH assumption IN assumptions_log.yaml:
      - assumption_id: [id]
        assumption_text: [statement]
        phase_declared: [0-4]
        challenge_method: [method]
        stress_scenarios:
          - scenario_1: [worst case]
          - scenario_2: [opposite conditions]
          - scenario_3: [partial failure]
        falsification_attempt:
          falsified: [true|false]
          evidence_against: [findings OR null]
          edge_cases: [scenarios OR null]
          contradictions: [errors OR null]
        robustness: [weak|moderate|strong|untestable]
        robustness_justification: [explanation]
        dependent_decisions: [list of decision_ids]

  assumption_robustness_summary:
    strong_assumptions:
      count: COUNT(strong)
      assumptions: [list of assumption_ids]
    moderate_assumptions:
      count: COUNT(moderate)
      assumptions: [list of assumption_ids]
    weak_assumptions:
      count: COUNT(weak)
      assumptions: [list of assumption_ids]
      mitigation_required: true
    untestable_assumptions:
      count: COUNT(untestable)
      assumptions: [list of assumption_ids]
    falsified_assumptions:
      count: COUNT WHERE falsified = true
      assumptions: [list of assumption_ids]

  decision_foundation_analysis:
    FOR EACH decision IN consequence-map.yaml:
      - decision_id: [id]
        decision_name: [name]
        assumption_dependencies:
          weak: COUNT WHERE robustness = weak
          moderate: COUNT WHERE robustness = moderate
          strong: COUNT WHERE robustness = strong
        foundation_strength: [solid|questionable|fragile]
        risk_level: [low|medium|high]
        mitigation:
          required: [true|false]
          strategy: [chosen mitigation OR null]
          user_approval_needed: [true|false]

  fragile_decisions:
    FOR EACH decision WHERE foundation = fragile:
      - decision_name: [name]
        fragile_because: [list weak assumption_ids]
        mitigation_strategy: [strategy]
        risk_if_proceed: [description]

  mitigation_recommendations:
    strengthen_assumptions:
      FOR EACH assumption WHERE mitigation = research_to_strengthen:
        - assumption_id: [id]
          research_needed: [what evidence to gather]
          estimated_effort: [high|medium|low]

    redesign_decisions:
      FOR EACH decision WHERE mitigation = redesign_decision:
        - decision_id: [id]
          restructure_approach: [how to remove dependency]

    accepted_risks:
      FOR EACH WHERE mitigation = document_and_proceed:
        - decision_id: [id]
          risk_accepted: [description]
          user_approval: [required]

    excluded_decisions:
      FOR EACH WHERE mitigation = exclude_from_options:
        - decision_id: [id]
          exclusion_reason: [unacceptable risk]

  challenge_summary:
    total_assumptions_challenged: COUNT(ALL)
    assumptions_falsified: COUNT(falsified)
    assumptions_weakened: COUNT(weak)
    assumptions_validated: COUNT(strong)
    decisions_on_fragile_foundation: COUNT(fragile)
    high_risk_decisions: COUNT WHERE risk_level = high
    mitigation_actions_required: COUNT WHERE mitigation.required = true

  assumptions_declared: [reference to assumptions 020-023]
  interpretation: [COPY from DECLARE phase]
  timestamp: [timestamp]

VERIFY: assumption-challenge-results.yaml created
VERIFY: EVERY assumption challenged (not subset)
VERIFY: ALL decisions analyzed for foundation strength
VERIFY: mitigation strategy assigned where needed

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "assumption challenges complete and rigorous"

ATTEMPT TO DISPROVE:

  METHOD 1 - Challenge method adequacy:
    FOR EACH assumption:
      QUESTION: "Is challenge_method appropriate for assumption type?"
      CHECK: Did I use strongest possible falsification approach?
      IF weaker method used:
        CHALLENGE_METHOD_INADEQUATE = true

  METHOD 2 - Stress scenario coverage:
    FOR EACH assumption:
      QUESTION: "Are stress scenarios comprehensive?"
      CHECK: Did I test edge cases thoroughly?
      IF scenarios superficial:
        STRESS_TEST_INCOMPLETE = true

  METHOD 3 - Robustness assessment bias:
    FOR EACH assumption WHERE robustness = strong:
      QUESTION: "Am I being too optimistic?"
      CHECK: Did I genuinely try to break this assumption?
      IF challenge half-hearted:
        ROBUSTNESS_OVERESTIMATED = true

    FOR EACH assumption WHERE robustness = weak:
      QUESTION: "Am I being too pessimistic?"
      CHECK: Is weakness actually critical or minor?
      IF weakness overstated:
        ROBUSTNESS_UNDERESTIMATED = true

  METHOD 4 - Dependency mapping completeness:
    FOR EACH decision:
      QUESTION: "Did I identify ALL assumption dependencies?"
      CHECK: Are there hidden dependencies not mapped?
      IF dependencies missed:
        DEPENDENCY_MAPPING_INCOMPLETE = true

  METHOD 5 - Mitigation adequacy:
    FOR EACH fragile decision:
      QUESTION: "Is mitigation strategy actually feasible?"
      CHECK: Can proposed mitigation realistically address weakness?
      IF mitigation ineffective:
        MITIGATION_INADEQUATE = true

  METHOD 6 - Challenge recursion:
    QUESTION: "Did I challenge my OWN assumptions (020-023)?"
    CHECK: Are phase 5 assumptions also tested?
    IF meta-assumptions not challenged:
      SELF_EXEMPTION_VIOLATION = true

EVIDENCE_AGAINST:
  inadequate_challenges: [list methods that were too weak]
  incomplete_stress_tests: [list scenarios that need deepening]
  robustness_bias: [list assumptions with questionable ratings]
  missed_dependencies: [list decision-assumption links not mapped]
  ineffective_mitigations: [list strategies that won't work]
  unchallenged_meta_assumptions: [phase 5 assumptions not tested]

EVIDENCE_FOR:
  systematic_challenge: [evidence of rigorous approach]
  comprehensive_stress_testing: [evidence all scenarios tested]
  objective_assessment: [evidence of unbiased robustness rating]
  complete_dependency_mapping: [evidence all links identified]
  feasible_mitigations: [evidence strategies will work]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    STRENGTHEN challenge methods
    ADD missing stress scenarios
    CORRECT robustness assessments
    COMPLETE dependency mapping
    REVISE mitigation strategies
    CHALLENGE meta-assumptions (020-023)
    UPDATE assumption-challenge-results.yaml
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check IN assumption-challenge-results.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_4 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ consequence-map.yaml AND assumptions_log.yaml loaded?
  IF NO → HALT, RETURN to section 1

□ assumptions_log contains ALL assumptions from phases 0-4?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ phase 5 assumptions (020-023) recorded?
  IF NO → HALT, RETURN to section 2

□ challenge method assigned FOR EVERY assumption?
  IF NO → HALT, RETURN to section 3A

□ stress scenarios executed (3 per assumption)?
  IF NO → HALT, RETURN to section 3A

□ falsification attempt executed FOR EVERY assumption?
  IF NO → HALT, RETURN to section 3A

□ robustness assessed FOR EVERY assumption?
  IF NO → HALT, RETURN to section 3A

□ dependent decisions identified FOR EVERY assumption?
  IF NO → HALT, RETURN to section 3A

□ challenge results verified?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ mitigation strategy assigned FOR EVERY fragile decision?
  IF NO → HALT, RETURN to section 4

□ assumption-challenge-results.yaml created WITH ALL assumptions?
  IF NO → HALT, RETURN to section 5

□ decision foundation analysis includes ALL decisions?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check challenged meta-assumptions (phase 5 assumptions)?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_5
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_5

```
EVALUATE gate condition:
  assumption-challenge-results.yaml EXISTS = [true|false]
  EVERY assumption challenged = [true|false]
  counter_check_executed = [true|false]

COUNT:
  total_assumptions = COUNT(assumptions_log.yaml)
  challenged_assumptions = COUNT(assumption-challenge-results.yaml)
  weak_assumptions = COUNT WHERE robustness = weak
  fragile_decisions = COUNT WHERE foundation = fragile

IF assumption-challenge-results.yaml EXISTS = true
   AND challenged_assumptions = total_assumptions
   AND counter_check_executed = true:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - challenged = [challenged_assumptions], weak = [weak_assumptions], fragile_decisions = [fragile_decisions]"
  NEXT: READ steps/step-06-synthesize.md

ELSE:
  GATE_5 = CLOSED
  IDENTIFY: which condition failed

  IF challenged_assumptions < total_assumptions:
    missing = total_assumptions - challenged_assumptions
    OUTPUT: "GATE_5 CLOSED - [missing] assumptions not challenged"
    LIST: which assumptions missing

  IF assumption-challenge-results.yaml NOT exists:
    OUTPUT: "GATE_5 CLOSED - assumption-challenge-results.yaml missing"

  IF counter_check_executed = false:
    OUTPUT: "GATE_5 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Cannot challenge assumption due to untestable nature

DECLARE_SCOPE_REDUCTION:
  gate: GATE_5
  condition_failed: "EVERY assumption challenged"
  assumptions_affected: [list specific assumption_ids]
  reason: "[e.g., assumption inherently untestable, NOT 'brevity']"
  impact: "Decision made with unchallenged assumption [assumption_id]"
  alternatives_attempted:
    - "Attempted multiple challenge methods - none applicable"
    - "Attempted proxy testing - no valid proxies found"
    - "Attempted expert analogy - none available"
  mitigation: "Document as UNTESTABLE assumption with HIGH UNCERTAINTY flag"
  user_approval: REQUIRED (unchallenged assumptions create blind spots)

HALT until user responds:
  APPROVE → LOG reduction + PROCEED with uncertainty documented
  DENY → MUST find challenge method OR remove assumption dependency
  MODIFY → Adjust approach and retry
```

## VIOLATION RECOVERY

```
IF agent assesses robustness without executing falsification attempt:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must EXECUTE challenge before ASSESS"
  RETURN to section 3A

IF agent challenges "key" assumptions instead of EVERY assumption:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must challenge EVERY assumption"
  RETURN to section 3A

IF agent skips stress scenarios:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must execute ALL stress scenarios"
  RETURN to section 3A

IF agent renders before verify:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must VERIFY before RENDER"
  RETURN to section 3B

IF agent does not challenge own phase 5 assumptions:
  HALT
  OUTPUT: "VIOLATION: Recursion required - must challenge meta-assumptions"
  RETURN to section 6 counter-check METHOD 6
```
