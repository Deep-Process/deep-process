# STEP 8: PREPARE_ESCALATION

## PRECONDITION

```
TRIGGER: Issue cannot be resolved by governance board
INPUT: escalation_trigger (decision from step-06 OR critical issue)
```

## SEQUENCE

### 8.1: CLASSIFY_ESCALATION_TRIGGER

```
DETERMINE: escalation_reason

triggers:
  BUDGET_OVERRUN: projected_cost > 110% baseline
  TIMELINE_SLIP: projected_completion > 110% baseline
  SCOPE_CREEP: scope_increase > 20% baseline
  CRITICAL_RISK_NO_MITIGATION: risk_score >= 70 AND no_viable_mitigation
  TEAM_CAPACITY_LOSS: key_person_departed AND no_replacement
  ARCHITECTURAL_INVALIDATION: core_assumption_wrong
  REGULATORY_CHANGE: new_regulation_requires_rework

STORE: escalation_reason
```

### 8.2: PREPARE_SITUATION_SUMMARY

```
CREATE: escalation_id = ESC-{seq}

DEFINE:
  escalation_id: {id}
  escalation_date: {timestamp}
  trigger: {reason}
  severity: {CRITICAL|HIGH}

DESCRIBE: current_situation

  IF trigger = BUDGET_OVERRUN:
    summary = "Projected total cost: ${projected} vs baseline: ${baseline} ({percentage}% over)"

  IF trigger = TIMELINE_SLIP:
    summary = "Projected completion: {projected_date} vs baseline: {baseline_date} ({weeks} weeks delay)"

  IF trigger = SCOPE_CREEP:
    summary = "Scope increased from {baseline_tasks} to {current_tasks} tasks ({percentage}% increase)"

DOCUMENT:
  - What happened?
  - Why did it happen?
  - What is the impact?
  - When was it detected?

STORE: situation_summary
```

### 8.3: IDENTIFY_OPTIONS

```
FOR escalation_trigger:

  GENERATE: options[]

  EXAMPLE (BUDGET_OVERRUN):
    option_a:
      description: "Increase budget by ${delta}"
      pros: ["Maintain full scope", "On-time delivery"]
      cons: ["Higher cost", "Needs funding approval"]
      cost: "+${delta}"
      timeline: "No change"

    option_b:
      description: "Descope {percentage}% features"
      pros: ["Stay on budget", "Feasible with current team"]
      cons: ["Reduced MVP value", "May affect customer appeal"]
      cost: "No change"
      timeline: "No change"

    option_c:
      description: "Extend timeline by {weeks} weeks"
      pros: ["Stay on budget", "Maintain scope"]
      cons: ["Delayed launch", "Competitive risk"]
      cost: "No change"
      timeline: "+{weeks} weeks"

FOR each option:
  EVALUATE:
    - Financial impact
    - Timeline impact
    - Risk impact
    - Market impact

RANK: options BY overall_impact

STORE: options[] with rankings
```

### 8.4: MAKE_RECOMMENDATION

```
SELECT: recommended_option FROM options[] (typically lowest_risk OR highest_value)

REASONING:
  FOR each option:
    option_{letter}:
      cost_impact = {value}
      timeline_impact = {value}
      risk_score = {computed}
      value_score = {computed}

  COMPARE:
    lowest_risk = option_{letter} (risk_score = {min})
    highest_value = option_{letter} (value_score = {max})
    best_balanced = option_{letter} (weighted_score = {best})

  EVALUATE: project_priorities
    IF priority = TIME_TO_MARKET: prefer lowest_timeline_impact
    IF priority = COST_CONTROL: prefer lowest_cost_impact
    IF priority = RISK_MINIMIZATION: prefer lowest_risk

  CONCLUSION: recommended_option = option_{letter}
  RATIONALE: {why this option aligns with priorities}

DOCUMENT: recommendation_rationale

content:
  recommendation: "Option {letter}"
  rationale: "Why this option is best"
  alignment: "How it aligns with project goals"
  risks: "What risks remain"
  confidence: {HIGH|MEDIUM|LOW}

DEFINE: fallback_option (if stakeholders reject recommendation)

STORE: recommendation
```

### 8.5: IDENTIFY_DECISION_AUTHORITY

```
DETERMINE: who_decides

rules:
  IF involves_budget_change > $50000:
    decision_authority = CFO + CTO

  IF involves_timeline_change > 4 weeks:
    decision_authority = CTO + Product_Owner

  IF involves_scope_change > 20%:
    decision_authority = CTO + Product_Owner + Business_Stakeholder

  IF involves_architectural_pivot:
    decision_authority = CTO + Engineering_Leadership

DEFINE: decision_deadline = {date}

  IF severity = CRITICAL:
    deadline = today + 2 days

  IF severity = HIGH:
    deadline = today + 5 days

STORE: decision_authority, decision_deadline
```

## CHECKLIST

```
□ Escalation trigger classified?
□ Situation summary prepared?
□ Options identified (>= 2)?
□ Recommendation made?
□ Decision authority identified?
□ Decision deadline defined?

IF any NO → RETURN to failed step
IF all YES → PROCEED to step-09
```

## OUTPUT

```
WRITE: escalations.yaml (append OR update)

content:
  escalation_id: {id}
  status: PREPARED
  escalation_date: {timestamp}
  trigger: {reason}
  severity: {CRITICAL|HIGH}

  situation:
    summary: {text}
    impact: {description}
    detected_date: {date}

  options:
    FOR each option:
      - option: {letter}
        description: {text}
        pros: {list}
        cons: {list}
        cost_impact: {value}
        timeline_impact: {value}

  recommendation:
    option: {letter}
    rationale: {text}
    confidence: {level}

  decision_required_from: {authority}
  decision_deadline: {date}
  fallback_if_no_decision: "Option {letter}"
```
