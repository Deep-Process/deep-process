# PHASE 6: SYNTHESIZE

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_6
```

## 1. OBSERVE

```
PRECONDITION: GATE_5 = OPEN
IF GATE_5 ≠ OPEN → HALT WITH "GATE_5 not satisfied"

LOAD ALL artifacts:
  ground-state.yaml (Phase 0)
  knowledge-gaps.yaml (Phase 1)
  research-results.yaml (Phase 2)
  option-map.yaml (Phase 3)
  consequence-map.yaml (Phase 4)
  assumption-challenge-results.yaml (Phase 5)

VERIFY: ALL files exist AND readable
IF ANY load fails → HALT WITH error_code_010

EXTRACT FROM ground-state.yaml:
  decision_question (original question)
  question_type (exploratory|closed|open)
  exploration_mode (mode)

EXTRACT FROM knowledge-gaps.yaml:
  total_gaps_identified
  gaps_classified

EXTRACT FROM research-results.yaml:
  findings (ALL research findings)
  gaps_filled

EXTRACT FROM option-map.yaml:
  viable_options (ALL viable options)
  dimensions (ALL dimensions)
  constraints (ALL constraints)

EXTRACT FROM consequence-map.yaml:
  consequences_by_option (ALL consequence analyses)
  critical_decisions (ALL critical flags)
  risk_summary (ALL risks)

EXTRACT FROM assumption-challenge-results.yaml:
  challenged_assumptions (ALL challenge results)
  weak_assumptions (flagged assumptions)
  fragile_decisions (decisions on weak foundation)

VERIFY: ALL extractions NOT empty
STORE: loaded_artifacts
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_024: "synthesis can integrate ALL findings coherently"
  assumption_025: "patterns identifiable across phases"
  assumption_026: "decision sequence derivable from integrated findings"
  assumption_027: "synthesis completeness verifiable through coverage check"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
INTEGRATE findings ACROSS phases:

EXTRACT exploration_journey:
  phase_0_output:
    decision_question: [original question]
    question_type: [type]
    interpretation: [how question interpreted]

  phase_1_output:
    gaps_identified: COUNT(knowledge-gaps.yaml)
    gap_categories: [list of gap types]
    critical_gaps: [gaps marked critical]

  phase_2_output:
    gaps_researched: COUNT(research-results.yaml)
    findings_count: COUNT(findings)
    research_methods_used: [list of methods]

  phase_3_output:
    options_extracted: COUNT(option-map.yaml viable)
    dimensions_identified: COUNT(dimensions)
    constraints_identified: COUNT(constraints)

  phase_4_output:
    options_analyzed: COUNT(consequence-map.yaml)
    consequences_identified: COUNT(ALL consequences)
    critical_decisions: COUNT(critical flags)
    risks_identified: COUNT(ALL risks)

  phase_5_output:
    assumptions_challenged: COUNT(challenged)
    assumptions_weakened: COUNT(weak)
    fragile_decisions: COUNT(fragile foundation)
    mitigation_needed: COUNT(mitigation required)

IDENTIFY cross_phase_patterns:

  PATTERN 1 - Option viability vs assumption robustness:
    FOR EACH option IN viable_options:
      EXTRACT option_assumptions:
        assumptions_supporting_option: [list assumption_ids]
        robustness_profile:
          strong: COUNT WHERE robustness = strong
          moderate: COUNT WHERE robustness = moderate
          weak: COUNT WHERE robustness = weak

      COMPUTE option_confidence:
        IF weak = 0 AND strong > moderate:
          confidence = high
        ELSE IF weak = 0:
          confidence = medium
        ELSE:
          confidence = low

  PATTERN 2 - Risk vs reversibility:
    FOR EACH option:
      CROSS_REFERENCE:
        risk_profile: [from consequence-map.yaml]
        reversibility: [from consequence-map.yaml]

      IDENTIFY risk_reversibility_pattern:
        IF risk_profile = high_risk AND reversibility = false:
          pattern = extreme_caution
        IF risk_profile = high_risk AND reversibility = true:
          pattern = manageable_risk
        IF risk_profile = low_risk:
          pattern = acceptable

  PATTERN 3 - Gap coverage:
    FOR EACH gap IN knowledge-gaps.yaml:
      CHECK: Was gap researched in phase 2?
      CHECK: Did research lead to options in phase 3?
      CHECK: Were option consequences analyzed in phase 4?

      TRACE gap_to_decision_path:
        gap_id → finding_id → option_id → consequence_analysis
        path_complete: [true|false]

      IF path_complete = false:
        ORPHANED_GAP = true
        RECORD: gap not integrated into final options

  PATTERN 4 - Constraint satisfaction:
    FOR EACH option:
      FOR EACH constraint IN option-map.yaml:
        IF constraint.applies_to includes option:
          CHECK: Does option violate constraint?
          IF violation:
            CONSTRAINT_VIOLATION = true
            RECORD: option infeasible despite viability flag

SYNTHESIZE decision_framework:

  COMPONENT 1 - Option ranking:
    FOR EACH option:
      COMPUTE composite_score:
        net_impact: [from consequence-map.yaml]
        risk_profile: [from consequence-map.yaml]
        confidence: [from option_confidence above]
        reversibility: [from consequence-map.yaml]
        constraint_compliance: [no violations = 1, violations = 0]

      RANK options BY:
        1. constraint_compliance DESC (eliminate violators)
        2. confidence DESC
        3. net_impact DESC (positive > mixed > negative)
        4. risk_profile ASC (low > medium > high)
        5. reversibility DESC (reversible preferred if all else equal)

  COMPONENT 2 - Decision sequence:
    IDENTIFY decision_dependencies:
      FOR EACH option:
        EXTRACT prerequisites:
          IF option depends_on other_option:
            sequence: other_option BEFORE current_option

        EXTRACT mutual_exclusivity:
          IF option conflicts_with other_option:
            choice_required: pick ONE from set

    CONSTRUCT decision_tree:
      root: decision_question
      branches: [viable options]
      FOR EACH branch:
        prerequisites: [what must be decided first]
        consequences: [from consequence-map.yaml]
        assumptions: [supporting assumptions with robustness]
        risks: [identified risks]
        reversibility: [can_reverse + cost]

  COMPONENT 3 - Uncertainty map:
    FOR EACH weak assumption:
      EXTRACT affected_options:
        options_relying_on_assumption: [list]
        impact_if_assumption_wrong: [consequence]

    FOR EACH fragile decision:
      EXTRACT uncertainty_source:
        weak_assumptions: [list]
        mitigation: [strategy]

    COMPUTE overall_uncertainty:
      high_uncertainty_options: COUNT WHERE confidence = low
      medium_uncertainty_options: COUNT WHERE confidence = medium
      low_uncertainty_options: COUNT WHERE confidence = high

  COMPONENT 4 - Critical path:
    IDENTIFY must_address_items:
      critical_gaps: [gaps that block ALL options if unresolved]
      critical_assumptions: [weak assumptions affecting top-ranked options]
      critical_risks: [high probability + high impact risks]
      critical_constraints: [hard constraints that eliminate options]

    PRIORITIZE by_impact:
      FOR EACH critical_item:
        options_affected: COUNT(options blocked by item)
        RANK BY options_affected DESC

REQUIREMENT: Extract findings from EVERY phase, not subset
VIOLATION: Synthesizing "key" findings only is VIOLATION
REQUIREMENT: Identify ALL patterns, not just "obvious"
```

### 3B. VERIFY

```
VALIDATE synthesis_completeness:

CHECK phase_coverage:
  FOR phase IN [0, 1, 2, 3, 4, 5]:
    VERIFY phase_output extracted
    VERIFY phase_output NOT empty

    IF phase_output missing:
      PHASE_COVERAGE_INCOMPLETE = true
      REQUIRE: extract from phase
      RETRY verification

CHECK pattern_identification:
  VERIFY option_confidence computed FOR EVERY option
  VERIFY risk_reversibility_pattern identified FOR EVERY option
  VERIFY gap_to_decision_path traced FOR EVERY gap
  VERIFY constraint_satisfaction checked FOR EVERY option

  IF ANY pattern missing:
    PATTERN_INCOMPLETE = true
    REQUIRE: complete pattern analysis
    RETRY verification

CHECK decision_framework_components:
  VERIFY option_ranking includes ALL viable options
  VERIFY decision_sequence includes ALL dependencies
  VERIFY uncertainty_map includes ALL weak assumptions
  VERIFY critical_path includes ALL must_address items

  FOR EACH option IN viable_options:
    VERIFY option in ranking
    VERIFY option in decision_tree
    VERIFY option confidence computed

    IF option missing from ANY component:
      FRAMEWORK_INCOMPLETE = true

CHECK integration_consistency:
  FOR EACH option:
    VERIFY same option_id across all artifacts
    VERIFY consequence data matches between artifacts
    VERIFY no contradictions in assessments

    IF inconsistency found:
      INTEGRATION_ERROR = true
      IDENTIFY: which artifacts conflict
      REQUIRE: resolve contradiction

CHECK orphaned_elements:
  FOR EACH gap IN knowledge-gaps.yaml:
    IF gap_to_decision_path = false:
      ORPHANED_GAP = true
      DECISION_REQUIRED: Was gap actually irrelevant OR synthesis missed it?

  FOR EACH finding IN research-results.yaml:
    CHECK: Does finding contribute to ANY option?
    IF NO:
      ORPHANED_FINDING = true
      DECISION_REQUIRED: Why was this researched if not used?

IF ALL validations pass:
  synthesis = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

DECLARE synthesis_statistics:
  phases_integrated: 6
  artifacts_loaded: 6
  total_gaps_identified: COUNT(knowledge-gaps.yaml)
  gaps_researched: COUNT(research-results.yaml)
  options_extracted: COUNT(option-map.yaml viable)
  options_fully_analyzed: COUNT(consequence-map.yaml)
  assumptions_challenged: COUNT(assumption-challenge-results.yaml)
  weak_assumptions: COUNT WHERE robustness = weak
  fragile_decisions: COUNT WHERE foundation = fragile

DECLARE option_landscape:
  high_confidence_options:
    count: COUNT WHERE confidence = high
    options: [list names]
    characteristics: "strong assumption foundation, acceptable risk"

  medium_confidence_options:
    count: COUNT WHERE confidence = medium
    options: [list names]
    characteristics: "moderate assumption foundation, requires monitoring"

  low_confidence_options:
    count: COUNT WHERE confidence = low
    options: [list names]
    characteristics: "weak assumption foundation, high uncertainty"

  recommended_option:
    IF high_confidence_options > 0:
      recommended = top_ranked WHERE confidence = high
      rationale: "highest confidence + best net_impact + lowest risk"
    ELSE IF medium_confidence_options > 0:
      recommended = top_ranked WHERE confidence = medium
      rationale: "best available given moderate confidence"
      caveat: "requires assumption validation during implementation"
    ELSE:
      recommended = null
      rationale: "all options have low confidence"
      recommendation: "strengthen assumptions OR expand option search"

DECLARE uncertainty_assessment:
  primary_uncertainties: [list top 3 weak assumptions]
  uncertainty_mitigation: [strategies from phase 5]
  residual_risk: [risk remaining after mitigation]

DECLARE decision_readiness:
  IF recommended_option exists AND confidence >= medium:
    ready_to_decide = true
    prerequisites: [list must_address items]
    next_steps: "review synthesis-report.yaml, validate recommendation"

  ELSE:
    ready_to_decide = false
    blockers: [list issues preventing decision]
    required_actions: [what needs to happen before decision possible]

DECLARE integration_quality:
  orphaned_gaps: COUNT WHERE gap_to_decision_path = false
  orphaned_findings: COUNT WHERE finding not used
  constraint_violations: COUNT WHERE option violates constraint

  IF orphaned_gaps = 0 AND orphaned_findings = 0 AND constraint_violations = 0:
    integration = complete
  ELSE:
    integration = partial
    issues: [describe what not integrated]

RECORD interpretation (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH option IN viable_options:

  EVALUATE final_viability:
    IF option has constraint_violation:
      DECISION: disqualify_option
      REASON: "violates hard constraint"
      REMOVE from viable_options

    IF option.confidence = low AND option.risk_profile = high_risk:
      DECISION: flag_as_inadvisable
      REASON: "low confidence + high risk = unacceptable"
      MARK: not recommended

    IF option.confidence >= medium:
      DECISION: include_in_final_set
      ADD to recommendable_options

EVALUATE decision_tree_structure:
  IF decision_dependencies exist:
    DECISION: sequence_required
    CONSTRUCT: ordered decision sequence
  ELSE:
    DECISION: single_decision_point
    PRESENT: all options as parallel choices

EVALUATE synthesis_output_format:
  COMPONENT 1 - Executive summary:
    DECISION: include
    CONTENT: decision_question + recommended_option + rationale

  COMPONENT 2 - Option comparison table:
    DECISION: include
    CONTENT: ALL options with key metrics (confidence, risk, reversibility)

  COMPONENT 3 - Detailed option analysis:
    DECISION: include
    CONTENT: FOR EACH option - full consequences + assumptions + risks

  COMPONENT 4 - Uncertainty analysis:
    DECISION: include
    CONTENT: weak assumptions + fragile decisions + mitigation

  COMPONENT 5 - Critical path:
    DECISION: include
    CONTENT: must_address items + priorities

  COMPONENT 6 - Decision sequence:
    DECISION: include
    CONTENT: decision_tree + prerequisites + mutual_exclusivity

  COMPONENT 7 - Phase integration summary:
    DECISION: include
    CONTENT: exploration_journey + patterns + integration_quality

FINALIZE: synthesis_components, recommended_option, decision_readiness
```

## 5. ACT (RENDER)

```
NOW render the verified, declared synthesis:

CREATE: synthesis-report.yaml

CONTENT:
  executive_summary:
    decision_question: [original question from phase 0]
    exploration_scope:
      gaps_identified: [count]
      gaps_researched: [count]
      options_extracted: [count]
      options_analyzed: [count]
      assumptions_challenged: [count]

    recommendation:
      recommended_option: [option_name OR null]
      confidence_level: [high|medium|low|none]
      rationale: [explanation]
      caveat: [limitations OR null]
      prerequisites: [list must_address items]

    decision_readiness:
      ready: [true|false]
      blockers: [list OR null]
      next_steps: [actions]

  option_comparison:
    dimensions: [list dimension names]
    options:
      FOR EACH option IN viable_options:
        - option_name: [name]
          rank: [1..N based on composite_score]
          confidence: [high|medium|low]
          net_impact: [assessment]
          risk_profile: [level]
          reversibility: [true|false + cost]
          assumption_foundation:
            strong: [count]
            moderate: [count]
            weak: [count]
          key_strengths: [top 3 strengths]
          key_weaknesses: [top 3 weaknesses]
          constraint_violations: [count]

  detailed_option_analysis:
    FOR EACH option IN viable_options:
      - option_id: [id]
        option_name: [name]
        option_description: [full description]

        consequences:
          immediate: [from consequence-map.yaml]
          short_term: [from consequence-map.yaml]
          long_term: [from consequence-map.yaml]
          secondary_effects: [from consequence-map.yaml]

        assumptions:
          FOR EACH assumption supporting this option:
            - assumption_text: [statement]
              robustness: [weak|moderate|strong]
              challenge_result: [from phase 5]

        risks:
          FOR EACH risk:
            - risk_description: [what could go wrong]
              probability: [high|medium|low]
              impact: [high|medium|low]
              mitigation: [strategy OR "accept"]

        dependencies: [what must happen first]
        constraints_applicable: [relevant constraints]
        overall_assessment: [synthesized judgment]

  uncertainty_analysis:
    weak_assumptions:
      FOR EACH assumption WHERE robustness = weak:
        - assumption_text: [statement]
          affects_options: [list option names]
          mitigation: [strategy]
          residual_uncertainty: [description]

    fragile_decisions:
      FOR EACH decision WHERE foundation = fragile:
        - decision_name: [name]
          fragile_because: [weak assumptions]
          risk_level: [high|medium|low]
          mitigation_required: [true|false]

    overall_uncertainty:
      high_uncertainty_options: [count + list]
      medium_uncertainty_options: [count + list]
      low_uncertainty_options: [count + list]

      uncertainty_mitigation_plan:
        strengthen_assumptions: [list research needed]
        monitor_during_implementation: [list items to watch]
        accept_documented_risk: [list accepted risks]

  critical_path:
    must_address_before_decision:
      FOR EACH critical_item:
        - item_type: [gap|assumption|risk|constraint]
          item_description: [what it is]
          options_affected: [count + list]
          priority: [rank by impact]
          resolution_approach: [how to address]

    decision_sequence:
      IF dependencies exist:
        ordered_decisions:
          - step_1: [first decision]
            options: [available options]
            next_step_depends_on: [outcome]
          - step_2: [subsequent decision]
            options: [available options]
      ELSE:
        single_decision: true
        all_options_parallel: [list]

  phase_integration_summary:
    exploration_journey:
      phase_0_ground: [summary]
      phase_1_extract: [summary]
      phase_2_research: [summary]
      phase_3_map: [summary]
      phase_4_deepen: [summary]
      phase_5_challenge: [summary]

    cross_phase_patterns:
      option_viability_vs_assumption_robustness: [pattern]
      risk_vs_reversibility: [pattern]
      gap_coverage: [pattern]
      constraint_satisfaction: [pattern]

    integration_quality:
      complete: [true|false]
      orphaned_gaps: [count + list OR null]
      orphaned_findings: [count + list OR null]
      constraint_violations: [count + list OR null]
      issues: [description OR null]

  artifacts_reference:
    ground_state: "ground-state.yaml"
    knowledge_gaps: "knowledge-gaps.yaml"
    research_results: "research-results.yaml"
    option_map: "option-map.yaml"
    consequence_map: "consequence-map.yaml"
    assumption_challenges: "assumption-challenge-results.yaml"

  assumptions_declared: [reference to assumptions 024-027]
  interpretation: [COPY from DECLARE phase]
  timestamp: [timestamp]

VERIFY: synthesis-report.yaml created
VERIFY: ALL options included in comparison
VERIFY: ALL phases integrated in journey
VERIFY: recommendation present OR blockers explained

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "synthesis is complete and coherent"

ATTEMPT TO DISPROVE:

  METHOD 1 - Coverage check:
    FOR EACH phase [0-5]:
      QUESTION: "Did I extract ALL relevant outputs?"
      CHECK: Re-scan phase artifact for missed elements
      IF elements missed:
        COVERAGE_INCOMPLETE = true

  METHOD 2 - Integration consistency:
    FOR EACH option:
      CHECK: Does option_id match across ALL artifacts?
      CHECK: Do assessments contradict between phases?
      IF inconsistency:
        INTEGRATION_INCONSISTENT = true

  METHOD 3 - Recommendation validity:
    IF recommended_option exists:
      QUESTION: "Is this REALLY the best option?"
      CHECK: Did I apply ranking criteria consistently?
      CHECK: Am I biased toward this option?
      IF ranking questionable:
        RECOMMENDATION_BIASED = true

    IF recommended_option = null:
      QUESTION: "Is there REALLY no viable option?"
      CHECK: Did I apply too strict criteria?
      IF some option could work:
        RECOMMENDATION_TOO_CONSERVATIVE = true

  METHOD 4 - Pattern validity:
    FOR EACH cross_phase_pattern:
      QUESTION: "Is this pattern real or coincidence?"
      CHECK: Does pattern hold for ALL instances?
      IF pattern breaks for some cases:
        PATTERN_OVERGENERALIZED = true

  METHOD 5 - Orphaned element investigation:
    IF orphaned_gaps > 0 OR orphaned_findings > 0:
      QUESTION: "Are these ACTUALLY orphaned or did I miss connection?"
      RE-TRACE: gap → finding → option → consequence
      IF connection exists:
        FALSE_ORPHAN = true

  METHOD 6 - Uncertainty completeness:
    QUESTION: "Did I identify ALL sources of uncertainty?"
    CHECK: Are there hidden weak assumptions?
    CHECK: Are there unanalyzed risks?
    IF additional uncertainty sources:
      UNCERTAINTY_UNDERESTIMATED = true

EVIDENCE_AGAINST:
  coverage_gaps: [list missed elements]
  integration_inconsistencies: [list contradictions]
  recommendation_bias: [evidence of bias]
  invalid_patterns: [patterns that don't hold]
  false_orphans: [elements thought orphaned but connected]
  hidden_uncertainties: [unidentified uncertainty sources]

EVIDENCE_FOR:
  systematic_extraction: [evidence ALL phases covered]
  consistent_integration: [evidence no contradictions]
  objective_recommendation: [evidence unbiased ranking]
  validated_patterns: [evidence patterns hold]
  complete_uncertainty_map: [evidence ALL uncertainties identified]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    ADD missed elements
    RESOLVE inconsistencies
    RE-EVALUATE recommendation
    CORRECT patterns
    RE-TRACE orphaned elements
    EXPAND uncertainty analysis
    UPDATE synthesis-report.yaml
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check IN synthesis-report.yaml
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_5 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ ALL 6 phase artifacts loaded?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ findings extracted from EVERY phase (not "key" phases)?
  IF NO → HALT, RETURN to section 3A

□ ALL cross-phase patterns identified?
  IF NO → HALT, RETURN to section 3A

□ decision framework ALL 4 components constructed?
  IF NO → HALT, RETURN to section 3A

□ synthesis completeness verified?
  IF NO → HALT, RETURN to section 3B

□ phase coverage verified (all 6 phases)?
  IF NO → HALT, RETURN to section 3B

□ pattern identification verified?
  IF NO → HALT, RETURN to section 3B

□ integration consistency checked?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ option_landscape declared?
  IF NO → HALT, RETURN to section 3C

□ decision_readiness declared?
  IF NO → HALT, RETURN to section 3C

□ ALL synthesis components included in output?
  IF NO → HALT, RETURN to section 4

□ synthesis-report.yaml created WITH ALL options?
  IF NO → HALT, RETURN to section 5

□ executive summary includes recommendation OR explains why none?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check verified coverage of ALL phases?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_6
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_6

```
EVALUATE gate condition:
  synthesis-report.yaml EXISTS = [true|false]
  ALL phases integrated = [true|false]
  counter_check_executed = [true|false]

COUNT:
  phases_integrated = 6
  options_in_synthesis = COUNT(options in synthesis-report.yaml)
  options_in_option_map = COUNT(viable options in option-map.yaml)

IF synthesis-report.yaml EXISTS = true
   AND phases_integrated = 6
   AND options_in_synthesis = options_in_option_map
   AND counter_check_executed = true:
  GATE_6 = OPEN
  OUTPUT: "GATE_6 OPEN - phases = [phases_integrated], options = [options_in_synthesis]"
  NEXT: READ steps/step-07-render.md

ELSE:
  GATE_6 = CLOSED
  IDENTIFY: which condition failed

  IF synthesis-report.yaml NOT exists:
    OUTPUT: "GATE_6 CLOSED - synthesis-report.yaml missing"

  IF phases_integrated < 6:
    OUTPUT: "GATE_6 CLOSED - only [phases_integrated] phases integrated"

  IF options_in_synthesis < options_in_option_map:
    missing = options_in_option_map - options_in_synthesis
    OUTPUT: "GATE_6 CLOSED - [missing] options not in synthesis"

  IF counter_check_executed = false:
    OUTPUT: "GATE_6 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Cannot integrate phase due to artifact corruption

DECLARE_SCOPE_REDUCTION:
  gate: GATE_6
  condition_failed: "ALL phases integrated"
  phases_affected: [list specific phase numbers]
  reason: "[e.g., artifact corrupted/missing, NOT 'brevity']"
  impact: "Synthesis incomplete - missing [phase_name] findings"
  alternatives_attempted:
    - "Attempted artifact reconstruction from logs - failed"
    - "Attempted partial integration - insufficient data"
    - "Attempted phase re-execution - [result]"
  mitigation: "Document missing phase + synthesize from available 5 phases"
  user_approval: REQUIRED (incomplete synthesis affects decision quality)

HALT until user responds:
  APPROVE → LOG reduction + PROCEED with incomplete synthesis documented
  DENY → MUST re-execute missing phase OR restore artifact
  MODIFY → Adjust approach and retry
```

## VIOLATION RECOVERY

```
IF agent synthesizes "key" findings instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must integrate ALL findings from ALL phases"
  RETURN to section 3A

IF agent renders before verify:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must VERIFY before RENDER"
  RETURN to section 3B

IF agent skips phase in integration:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must integrate EVERY phase"
  RETURN to section 3A

IF agent identifies "main" patterns instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must identify ALL cross-phase patterns"
  RETURN to section 3A

IF agent proceeds with orphaned elements without investigation:
  HALT
  OUTPUT: "VIOLATION: Completeness - must investigate ALL orphaned elements"
  RETURN to section 3B
```
