# STEP 2: IMPACT_ANALYSIS

## PRECONDITION
```
GATE_ENTRY: GATE_1 = OPEN
INPUT: change-requests.yaml WHERE status = READY_FOR_ANALYSIS
```

## SEQUENCE

### 2.1: LOAD_CONTEXT
```
READ: implementation-plan.yaml, architecture-comprehensive.md, risk-report.md
STORE: planning_context
```

### 2.2: DECOMPOSE_SOLUTION
```
FROM: CR.proposed_solution
CREATE: tasks[] (WBS decomposition)
ESTIMATE: story_points per task
COMPUTE: total_effort_sp = SUM(tasks.sp)
CONVERT: hours = total_effort_sp × 4
```

### 2.3: ANALYZE_TIMELINE
```
COMPUTE:
  effort_weeks = hours / (team_size × 40h)
  critical_path_affected = (tasks affect critical_path?)

REASONING:
  total_effort = {computed_hours}h
  available_capacity = {team_size} × 40h/week = {total}h/week
  theoretical_duration = {effort_weeks} weeks

  IF critical_path_affected = YES:
    timeline_delay = effort_weeks (sequential)
  ELSE:
    timeline_delay = effort_weeks / parallelization_factor

  CONCLUSION: timeline_impact = {best/likely/worst}_case

CLASSIFY:
  best_case = parallel execution
  likely_case = some contention
  worst_case = sequential + blockers
```

### 2.4: ANALYZE_COST
```
COMPUTE:
  dev_cost = hours × hourly_rate
  recurring_cost = subscriptions × months
  total_year_1 = dev_cost + recurring_cost

REASONING:
  development_effort = {hours}h
  blended_rate = ${rate}/h
  one_time_cost = {hours} × ${rate} = ${dev_cost}

  recurring_services = {list}
  monthly_recurring = ${amount}/month
  annual_recurring = ${amount} × 12 = ${recurring_cost}

  total_first_year = ${dev_cost} + ${recurring_cost} = ${total_year_1}

  CONCLUSION: cost_impact = ${total_year_1} ({percentage}% of budget)
```

### 2.5: ANALYZE_RISK
```
EVALUATE: risk_changes[]
FOR each affected_risk:
  COMPUTE: score_delta = new_score - current_score

REASONING:
  affected_risks = {list_of_risk_ids}

  FOR each risk:
    current_score = {value}
    new_score = {value}
    delta = {new} - {current} = {score_delta}

  total_risk_delta = SUM(all_deltas)

  IF total_risk_delta < 0: net_impact = POSITIVE (risk reduced)
  IF total_risk_delta = 0: net_impact = NEUTRAL
  IF total_risk_delta > 0: net_impact = NEGATIVE (risk increased)

  CONCLUSION: risk_impact = {POSITIVE|NEUTRAL|NEGATIVE}

CLASSIFY: net_impact = POSITIVE | NEUTRAL | NEGATIVE
```

### 2.6: CLASSIFY_PRIORITY
```
BASED ON: trigger_type, timeline_impact, cost_impact
APPLY: priority_rules
SET: priority = CRITICAL | HIGH | MEDIUM | LOW
```

### 2.7: GENERATE_RECOMMENDATION
```
APPLY: approval_criteria

REASONING:
  timeline_impact = {value} weeks ({percentage}% of total)
  cost_impact = ${value} ({percentage}% of budget)
  risk_impact = {POSITIVE|NEUTRAL|NEGATIVE}
  priority = {CRITICAL|HIGH|MEDIUM|LOW}

  approval_criteria_met:
    - Timeline acceptable? {yes/no}
    - Cost justified? {yes/no}
    - Risk acceptable? {yes/no}
    - Provides value? {yes/no}

  criteria_passing = {count}/4

  IF criteria_passing >= 3: recommendation = APPROVE
  IF criteria_passing = 2: recommendation = DEFER (needs justification)
  IF criteria_passing < 2: recommendation = REJECT

  CONCLUSION: recommendation = {APPROVE|REJECT|DEFER}
  RATIONALE: {documented_reasoning}

DETERMINE: recommendation = APPROVE | REJECT | DEFER
DOCUMENT: rationale
```

## CHECKLIST
```
□ Context loaded?
□ Tasks decomposed?
□ Timeline analyzed?
□ Cost analyzed?
□ Risk impact analyzed?
□ Priority classified?
□ Recommendation generated?

IF all YES → GATE_2 OPEN
```

## GATE_2
```
IF all_analyses_complete:
  GATE_2 = OPEN
  OUTPUT: impact-analysis-{CR_id}.yaml
  PROCEED: To step-03
ELSE:
  HALT
```
