# PHASE 4: DEEPEN

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_4
```

## 1. OBSERVE

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT WITH "GATE_3 not satisfied"

LOAD: option-map.yaml
VERIFY: file exists AND readable
IF load fails → HALT WITH error_code_008

EXTRACT FROM option-map.yaml:
  viable_options (ALL viable options)
  dimensions (ALL dimensions)
  constraints (ALL constraints)

VERIFY: viable_options NOT empty
VERIFY: viable_options.count >= 2 (gate condition)

STORE: loaded_options
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_016: "consequences can be identified for EVERY option"
  assumption_017: "consequence horizon = [timeframe, e.g., 1 year, 5 years]"
  assumption_018: "reversibility can be assessed objectively"
  assumption_019: "ALL significant consequences are predictable"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
FOR EACH option IN viable_options:

  ANALYZE consequences:

    EXTRACT immediate_consequences:
      timeframe: 0-3 months
      FOR EACH dimension:
        impact_on_dimension: [positive|negative|neutral|unknown]
        magnitude: [high|medium|low]
        certainty: [certain|probable|possible|uncertain]

    EXTRACT short_term_consequences:
      timeframe: 3-12 months
      [same structure as immediate]

    EXTRACT long_term_consequences:
      timeframe: 1+ years
      [same structure as immediate]

    EXTRACT secondary_effects:
      FOR EACH primary consequence:
        IF consequence triggers other_effects:
          EXTRACT secondary_effect:
            triggered_by: [primary_consequence_id]
            effect_description: [what happens]
            likelihood: [certain|probable|possible|unlikely]

    EXTRACT dependencies:
      IF option depends_on external_factor:
        EXTRACT dependency:
          dependency_id: [auto-increment]
          factor: [what must happen/exist]
          criticality: [critical|high|medium|low]
          controllability: [full|partial|none]

    EXTRACT risks:
      IF option introduces risk:
        EXTRACT risk:
          risk_id: [auto-increment]
          risk_description: [what could go wrong]
          probability: [high|medium|low]
          impact: [high|medium|low]
          mitigation: [possible|difficult|impossible]

  ASSESS reversibility:
    IF option can be undone:
      reversibility = true
      reversal_cost: [high|medium|low]
      reversal_timeframe: [duration]
    ELSE:
      reversibility = false
      irreversibility_reason: [why cannot undo]

REQUIREMENT: Extract consequences for EVERY option, not subset
VIOLATION: Analyzing "main" options only is VIOLATION
REQUIREMENT: Extract ALL consequence types, not just "critical"
```

### 3B. VERIFY

```
VALIDATE extracted_consequences:

FOR EACH option IN viable_options:
  VERIFY option has immediate_consequences analyzed
  VERIFY option has short_term_consequences analyzed
  VERIFY option has long_term_consequences analyzed
  VERIFY option has reversibility assessed

  FOR EACH consequence:
    VERIFY impact_on_dimension NOT unknown (must analyze)
    VERIFY magnitude specified
    VERIFY certainty specified

  FOR EACH dimension IN option-map.yaml:
    CHECK: Does option have consequence analysis for this dimension?
    IF NOT → MISSING_DIMENSION_ANALYSIS = true

  IF MISSING_DIMENSION_ANALYSIS = true:
    ADD missing dimension analysis
    RETRY verification

CHECK completeness:
  FOR EACH option:
    COUNT total_consequences = immediate + short_term + long_term + secondary
    IF total_consequences = 0:
      MISSING_CONSEQUENCES = true
      REQUIRE: re-analyze option

CHECK consistency:
  FOR EACH option:
    IF reversibility = true:
      VERIFY reversal_cost specified
      VERIFY reversal_timeframe specified
    IF reversibility = false:
      VERIFY irreversibility_reason specified

IF ALL validations pass:
  extracted_consequences = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

FOR EACH option:
  DECLARE consequence_pattern:
    net_impact: [overwhelmingly_positive|positive|mixed|negative|overwhelmingly_negative]
    risk_profile: [low_risk|medium_risk|high_risk]
    dependency_level: [independent|partially_dependent|highly_dependent]

  DECLARE criticality_flag:
    IF reversibility = false:
      criticality = CRITICAL
      justification: "irreversible decision requires highest scrutiny"
    ELSE IF reversibility = true AND reversal_cost = high:
      criticality = HIGH
      justification: "difficult to reverse, requires careful consideration"
    ELSE:
      criticality = NORMAL
      justification: "reversible with reasonable cost"

  DECLARE time_sensitivity:
    IF ANY consequence has timeframe = immediate:
      time_sensitive = true
    ELSE:
      time_sensitive = false

DECLARE overall_interpretation:
  total_options_analyzed: COUNT(viable_options)
  critical_decisions: COUNT WHERE criticality = CRITICAL
  high_risk_options: COUNT WHERE risk_profile = high_risk
  reversible_options: COUNT WHERE reversibility = true
  irreversible_options: COUNT WHERE reversibility = false

RECORD interpretation (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH option IN viable_options:

  EVALUATE criticality:
    IF option.criticality = CRITICAL:
      DECISION: flag_as_critical
      REQUIRE: extra validation in Phase 5

    IF option.reversibility = false AND option.risk_profile = high_risk:
      DECISION: flag_as_extreme_caution
      REQUIRE: counter-check in Phase 5

  EVALUATE time_sensitivity:
    IF option.time_sensitive = true:
      DECISION: flag_urgent
      MARK: requires timely decision

  CATEGORIZE option:
    IF net_impact = overwhelmingly_positive AND risk_profile = low_risk:
      category = preferred
    IF net_impact = positive AND risk_profile = low_risk:
      category = favorable
    IF net_impact = mixed:
      category = trade_off
    IF net_impact = negative OR risk_profile = high_risk:
      category = risky
    IF net_impact = overwhelmingly_negative:
      category = avoid

SORT options BY criticality DESC, then risk_profile ASC, then net_impact DESC

FINALIZE: categorized_options, critical_flags, time_sensitive_flags
```

## 5. ACT (RENDER)

```
NOW render the verified, declared consequence analysis:

CREATE: consequence-map.yaml

CONTENT:
  consequences_by_option:
    FOR EACH option IN viable_options:
      - option_id: [id]
        option_name: [name]
        consequences:
          immediate: [ALL immediate consequences]
          short_term: [ALL short_term consequences]
          long_term: [ALL long_term consequences]
          secondary_effects: [ALL secondary effects]
        dependencies: [ALL dependencies]
        risks: [ALL risks]
        reversibility:
          can_reverse: [true|false]
          reversal_cost: [level OR null]
          reversal_timeframe: [duration OR null]
          irreversibility_reason: [reason OR null]
        assessment:
          net_impact: [assessment]
          risk_profile: [level]
          dependency_level: [level]
          criticality: [flag]
          time_sensitive: [boolean]
          category: [preferred|favorable|trade_off|risky|avoid]

  consequence_matrix:
    dimensions: [dimension names]
    options_impacts:
      FOR EACH option:
        - option_name: [name]
          impacts:
            FOR EACH dimension:
              [dimension_name]:
                immediate: [impact]
                short_term: [impact]
                long_term: [impact]

  critical_decisions:
    FOR EACH option WHERE criticality = CRITICAL:
      - option_name: [name]
        why_critical: [irreversibility_reason]
        extra_validation_required: true

  risk_summary:
    high_risk_options: [list of option names]
    total_risks_identified: COUNT(ALL risks)
    critical_risks: COUNT WHERE probability = high AND impact = high

  assumptions_declared: [reference to assumptions 016-019]
  interpretation: [COPY from DECLARE phase]
  timestamp: [timestamp]

VERIFY: consequence-map.yaml created
VERIFY: EVERY option analyzed (not subset)
VERIFY: ALL dimensions covered for EACH option
VERIFY: ALL consequences recorded

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "consequences are complete and accurate"

ATTEMPT TO DISPROVE:

  METHOD 1 - Search for unconsidered consequences:
    FOR EACH option:
      QUESTION: "What could I have missed?"
      THINK: "If I were trying to hide negative consequences, which would I hide?"
      CHECK: Are there plausible consequences not listed?
      IF yes → CONSEQUENCE_MISSED = true

  METHOD 2 - Second-order effects:
    FOR EACH primary consequence:
      QUESTION: "What does THIS consequence cause?"
      CHECK: Are second-order effects captured?
      IF missing → SECOND_ORDER_MISSED = true

  METHOD 3 - Time horizon adequacy:
    FOR EACH option:
      QUESTION: "Are long-term consequences far enough?"
      CHECK: Is assumption_017 timeframe sufficient?
      IF consequence_horizon too short:
        HORIZON_INADEQUATE = true

  METHOD 4 - Reversibility challenge:
    FOR EACH option WHERE reversibility = true:
      QUESTION: "Is it REALLY reversible?"
      CHECK: Hidden costs or barriers to reversal?
      IF reversal harder than stated:
        REVERSIBILITY_OVERESTIMATED = true

    FOR EACH option WHERE reversibility = false:
      QUESTION: "Is there NO way to reverse?"
      CHECK: Could partial reversal be possible?
      IF reversal possible in some form:
        REVERSIBILITY_UNDERESTIMATED = true

  METHOD 5 - Risk assessment challenge:
    FOR EACH risk:
      QUESTION: "Is probability and impact correctly assessed?"
      CHECK: Am I being optimistic or pessimistic?
      IF assessment biased:
        RISK_MISASSESSED = true

EVIDENCE_AGAINST:
  consequences_missed: [list any found]
  second_order_effects_missed: [list any]
  horizon_issues: [list concerns]
  reversibility_errors: [list corrections]
  risk_misassessments: [list corrections]

EVIDENCE_FOR:
  systematic_analysis: [evidence of thorough analysis]
  multi_timeframe_coverage: [evidence ALL timeframes considered]
  dimension_coverage: [evidence ALL dimensions analyzed]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    ADD missed consequences
    EXTEND time horizon if inadequate
    CORRECT reversibility assessments
    ADJUST risk assessments
    UPDATE consequence-map.yaml
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check IN consequence-map.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_3 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ option-map.yaml loaded?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ assumptions include consequence_horizon timeframe?
  IF NO → HALT, RETURN to section 2

□ consequences extracted for EVERY option (not "main" options)?
  IF NO → HALT, RETURN to section 3A

□ ALL three timeframes analyzed (immediate, short, long)?
  IF NO → HALT, RETURN to section 3A

□ ALL dimensions covered for EACH option?
  IF NO → HALT, RETURN to section 3A

□ reversibility assessed for EVERY option?
  IF NO → HALT, RETURN to section 3A

□ extracted consequences verified?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ EVERY option categorized?
  IF NO → HALT, RETURN to section 4

□ critical decisions flagged?
  IF NO → HALT, RETURN to section 4

□ consequence-map.yaml created WITH ALL options?
  IF NO → HALT, RETURN to section 5

□ consequence matrix includes ALL dimensions × ALL options × ALL timeframes?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check challenged reversibility assumptions?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_4
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_4

```
EVALUATE gate condition:
  consequence-map.yaml EXISTS = [true|false]
  EVERY option analyzed = [true|false]
  counter_check_executed = [true|false]

COUNT:
  total_options = COUNT(viable_options in option-map.yaml)
  analyzed_options = COUNT(options in consequence-map.yaml)
  critical_options = COUNT WHERE criticality = CRITICAL

IF consequence-map.yaml EXISTS = true
   AND analyzed_options = total_options
   AND counter_check_executed = true:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - analyzed = [analyzed_options], critical = [critical_options]"
  NEXT: READ steps/step-05-challenge.md

ELSE:
  GATE_4 = CLOSED
  IDENTIFY: which condition failed

  IF analyzed_options < total_options:
    missing = total_options - analyzed_options
    OUTPUT: "GATE_4 CLOSED - [missing] options not analyzed"
    LIST: which options missing

  IF consequence-map.yaml NOT exists:
    OUTPUT: "GATE_4 CLOSED - consequence-map.yaml missing"

  IF counter_check_executed = false:
    OUTPUT: "GATE_4 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Cannot assess consequences for option due to insufficient information

DECLARE_SCOPE_REDUCTION:
  gate: GATE_4
  condition_failed: "EVERY option analyzed"
  options_affected: [list specific option IDs]
  reason: "[e.g., consequences unpredictable due to novel situation, NOT 'brevity']"
  impact: "Decision made without full consequence understanding for [options]"
  alternatives_attempted:
    - "Attempted research - no precedents found"
    - "Attempted expert analogy - none applicable"
    - "Attempted scenario planning - too speculative"
  mitigation: "Document as HIGH UNCERTAINTY assumption: '[what is uncertain]'"
  user_approval: REQUIRED (incomplete consequence analysis is critical)

HALT until user responds:
  APPROVE → LOG reduction + PROCEED with uncertainty documented
  DENY → MUST complete analysis OR remove option from consideration
  MODIFY → Adjust approach and retry
```

## VIOLATION RECOVERY

```
IF agent renders before verify:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must VERIFY before RENDER"
  RETURN to section 3B

IF agent analyzes "main" options instead of EVERY option:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must analyze EVERY option"
  RETURN to section 3A

IF agent skips timeframe (e.g., only immediate, not long-term):
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must analyze ALL timeframes"
  RETURN to section 3A

IF agent proceeds without analyzing ALL dimensions for EACH option:
  HALT
  OUTPUT: "VIOLATION: Completeness - ALL dimensions required"
  RETURN to section 3A
```
