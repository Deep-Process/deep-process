# STEP 5: EVALUATE_DECISION

## PRECONDITION

```
TRIGGER: change-request OR escalation requiring decision
INPUT: change-requests.yaml OR escalations.yaml
```

## SEQUENCE

### 5.1: CLASSIFY_DECISION_TYPE

```
LOAD: decision_trigger

DETERMINE: decision_type

types:
  CHANGE_REQUEST: approve/reject scope, timeline, or budget change
  RISK_DECISION: accept risk OR approve mitigation
  QUALITY_DECISION: waive gate OR halt for fix
  GO_NO_GO: proceed with next phase OR pause/pivot
  ESCALATION: resolve issue OR escalate to stakeholders

STORE: decision_type
```

### 5.2: LOAD_IMPACT_ANALYSIS

```
IF decision_type = CHANGE_REQUEST:
  READ: impact-analysis-{CR_id}.yaml

  EXTRACT:
    timeline_impact: {value}
    cost_impact: {value}
    risk_impact: {value}
    scope_impact: {value}

IF decision_type = RISK_DECISION:
  READ: risk-updates.yaml → specific risk

  EXTRACT:
    risk_score: {value}
    mitigation_cost: {value}
    mitigation_roi: {value}

IF decision_type = QUALITY_DECISION:
  READ: quality-gate-results.yaml → specific gate

  EXTRACT:
    gate_type: {SECURITY|PERFORMANCE|RELIABILITY|COMPLIANCE}
    failure_severity: {CRITICAL|HIGH|MEDIUM}
    fix_effort: {value}

STORE: impact_data
```

### 5.3: APPLY_DECISION_CRITERIA

```
IF decision_type = CHANGE_REQUEST:

  auto_approve_criteria:
    timeline_impact <= 2 days AND
    cost_impact <= $5000 AND
    NOT affects_critical_path

  manual_review_criteria:
    timeline_impact <= 5% total AND
    cost_impact <= 10% total AND
    provides_value (reduces risk OR regulatory OR customer demand)

  reject_criteria:
    timeline_impact > 10% total OR
    cost_impact > 20% total OR
    no_clear_value

  APPLY: criteria to impact_data

  REASONING:
    timeline_impact_value = {extracted}
    cost_impact_value = {extracted}
    critical_path_affected = {yes/no}

    EVAL: auto_approve_criteria → {met/not_met}
    EVAL: manual_review_criteria → {met/not_met}
    EVAL: reject_criteria → {met/not_met}

    CONCLUSION: Based on criteria alignment → {recommendation}

  DETERMINE: recommendation = AUTO_APPROVE | APPROVE | REJECT | DEFER

IF decision_type = RISK_DECISION:

  approve_mitigation_criteria:
    risk_score >= 70 OR
    (risk_score >= 50 AND mitigation_roi > 10)

  accept_risk_criteria:
    risk_score < 50 AND
    mitigation_cost > $50000

  escalate_criteria:
    risk_score >= 70 AND mitigation_cost > $200000

  APPLY: criteria to impact_data

  REASONING:
    risk_score_value = {extracted}
    mitigation_cost_value = {extracted}
    mitigation_roi_value = {extracted}

    EVAL: approve_mitigation_criteria → {met/not_met}
    EVAL: accept_risk_criteria → {met/not_met}
    EVAL: escalate_criteria → {met/not_met}

    CONCLUSION: Based on criteria alignment → {recommendation}

  DETERMINE: recommendation = APPROVE_MITIGATION | ACCEPT_RISK | ESCALATE

IF decision_type = QUALITY_DECISION:

  halt_criteria:
    gate_type = SECURITY AND failure_severity = CRITICAL

  fix_next_sprint_criteria:
    gate_type = PERFORMANCE OR RELIABILITY

  waive_criteria:
    gate_type = COSMETIC

  APPLY: criteria to impact_data

  REASONING:
    gate_type_value = {extracted}
    failure_severity_value = {extracted}
    fix_effort_value = {extracted}

    EVAL: halt_criteria → {met/not_met}
    EVAL: fix_next_sprint_criteria → {met/not_met}
    EVAL: waive_criteria → {met/not_met}

    CONCLUSION: Based on criteria alignment → {recommendation}

  DETERMINE: recommendation = HALT | FIX_NEXT_SPRINT | WAIVE

STORE: recommendation + rationale
```

### 5.4: IDENTIFY_ALTERNATIVES

```
FOR decision_type:

  GENERATE: alternatives[]

  IF decision_type = CHANGE_REQUEST:
    alternatives:
      A: APPROVE change as proposed
      B: APPROVE with reduced scope
      C: REJECT, propose alternative solution
      D: DEFER to post-MVP

  IF decision_type = RISK_DECISION:
    alternatives:
      A: APPROVE full mitigation
      B: APPROVE partial mitigation (lower cost)
      C: ACCEPT risk with monitoring
      D: ESCALATE to stakeholders

  IF decision_type = QUALITY_DECISION:
    alternatives:
      A: HALT sprint, fix immediately
      B: FIX in next sprint (add to backlog)
      C: WAIVE gate (add to tech debt)

FOR each alternative:
  EVALUATE: pros, cons, cost, risk

STORE: alternatives[] with evaluations
```

### 5.5: COMPUTE_DECISION_CONFIDENCE

```
BASED ON: completeness of impact_data, alignment with criteria

COMPUTE: confidence_score

factors:
  - Impact analysis complete? (+20%)
  - Similar decisions in history? (+20%)
  - Criteria clearly met/not met? (+30%)
  - Alternatives evaluated? (+15%)
  - Risks identified? (+15%)

confidence = SUM(factors_met)

REASONING:
  impact_analysis_complete = {yes/no} → {+20% or 0%}
  similar_decisions_exist = {yes/no} → {+20% or 0%}
  criteria_clearly_met = {yes/no} → {+30% or 0%}
  alternatives_evaluated = {yes/no} → {+15% or 0%}
  risks_identified = {yes/no} → {+15% or 0%}

  total_confidence = {computed_sum}%

  CONCLUSION: confidence_level = {HIGH|MEDIUM|LOW}

CLASSIFY:
  IF confidence >= 80%: confidence = HIGH
  IF confidence 50-80%: confidence = MEDIUM
  IF confidence < 50%: confidence = LOW

IF confidence = LOW:
  FLAG: request_more_info = TRUE

STORE: confidence_score, confidence_level
```

## COUNTER-CHECK

```
CLAIM: "Recommendation is well-supported"

ATTEMPT_REFUTATION:
  CHECK: impact_data incomplete?
  CHECK: criteria not applied?
  CHECK: alternatives not considered?
  CHECK: confidence < 50%?

  IF any TRUE:
    REFUTATION: SUCCESS
    OUTPUT: "Insufficient analysis: [issue]"
    RETURN: To failed step

  REFUTATION: FAILED
  CONFIRMATION: "Recommendation supported"
```

## CHECKLIST

```
□ Decision type classified?
□ Impact analysis loaded?
□ Decision criteria applied?
□ Alternatives identified and evaluated?
□ Confidence computed (>= 50%)?
□ Counter-check executed (recommendation supported)?

IF any NO → RETURN to failed step
IF all YES → PROCEED to step-06 (make decision)
```

## OUTPUT

```
WRITE: decision-evaluation-{id}.yaml

content:
  decision_id: {id}
  decision_type: {type}
  evaluation_date: {timestamp}

  impact:
    timeline: {value}
    cost: {value}
    risk: {value}
    scope: {value}

  recommendation: {AUTO_APPROVE|APPROVE|REJECT|DEFER}
  rationale: {text}

  alternatives:
    FOR each alternative:
      - option: {letter}
        description: {text}
        pros: {list}
        cons: {list}

  confidence: {HIGH|MEDIUM|LOW}
```
