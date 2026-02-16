# STEP 4: WEEKLY_REVIEW

## PRECONDITION

```
FREQUENCY: Every Friday 14:00
INPUT: Last 7 days of health-score-{date}.yaml
INPUT: anomalies-{date}.yaml for last 7 days
INPUT: change-requests.yaml (pending decisions)
```

## SEQUENCE

### 4.1: SUMMARIZE_WEEK

```
LOAD: health-score-{date}.yaml FOR date IN last_7_days

COMPUTE:
  green_days = COUNT(WHERE overall_health = GREEN)
  yellow_days = COUNT(WHERE overall_health = YELLOW)
  red_days = COUNT(WHERE overall_health = RED)

  trend = DETERMINE_TREND(overall_health over 7 days)
    trend = IMPROVING | STABLE | WORSENING

LOAD: anomalies-{date}.yaml FOR date IN last_7_days

COMPUTE:
  total_anomalies_week = SUM(total_anomalies)
  critical_anomalies_week = SUM(WHERE severity = CRITICAL)

STORE: week_summary
```

### 4.2: REVIEW_PLAN_VARIANCE

```
READ: plan-variance-report.md (most recent)

EXTRACT:
  schedule_variance: {value}
  velocity_variance: {value}
  scope_variance: {value}

CLASSIFY:
  IF ABS(schedule_variance) > 0.10:
    DECLARE: decision_required = TRUE
    decision_type = SCHEDULE_ADJUSTMENT

  IF ABS(velocity_variance) > 0.20:
    DECLARE: decision_required = TRUE
    decision_type = CAPACITY_ADJUSTMENT

  IF ABS(scope_variance) > 0.10:
    DECLARE: decision_required = TRUE
    decision_type = SCOPE_ADJUSTMENT

STORE: variance_decisions_needed[]
```

### 4.3: REVIEW_CHANGE_REQUESTS

```
READ: change-requests.yaml

EXTRACT: pending_changes WHERE status = ANALYZED

FOR each pending_change:

  LOAD: impact-analysis-{CR_id}.yaml

  EXTRACT:
    timeline_impact: {value}
    cost_impact: {value}
    priority: {CRITICAL|HIGH|MEDIUM|LOW}

  APPLY: approval_criteria (from step-05)

  QUEUE: For decision in this meeting

STORE: changes_for_decision[]
```

### 4.4: REVIEW_RISKS

```
READ: risk-updates.yaml (from deep-risk, if exists)

IF EXISTS:
  EXTRACT:
    new_critical_risks: WHERE risk_score >= 70 AND discovered_date IN last_7_days
    materialized_risks: WHERE status = MATERIALIZED

  FOR each new_critical_risk:
    QUEUE: For mitigation approval decision

  FOR each materialized_risk:
    QUEUE: For contingency execution decision

STORE: risk_decisions_needed[]
```

### 4.5: REVIEW_QUALITY_GATES

```
READ: quality-gate-results.yaml (most recent)

EXTRACT: failed_gates WHERE result = FAIL

FOR each failed_gate:

  CLASSIFY: gate_type
    IF gate_type = SECURITY:
      decision_type = HALT_SPRINT
    IF gate_type = PERFORMANCE:
      decision_type = FIX_OR_WAIVE
    IF gate_type = COSMETIC:
      decision_type = DEFER_TO_BACKLOG

  QUEUE: For decision in this meeting

STORE: quality_decisions_needed[]
```

### 4.6: MAKE_GO_NO_GO_DECISION

```
LOAD: week_summary.overall_health

EVALUATE: sprint_continuation

CRITERIA:
  GO:
    - overall_health = GREEN OR (YELLOW AND trend = IMPROVING)
    - critical_anomalies_week <= 2
    - n_blockers <= 2

  CONDITIONAL_GO:
    - overall_health = YELLOW AND trend = STABLE
    - CONDITIONS: List specific improvements needed

  PAUSE:
    - overall_health = RED
    - OR critical_anomalies_week > 3
    - OR n_blockers > 5

  PIVOT:
    - Architecture assumption invalidated
    - OR regulatory change
    - OR market shift

MAKE: decision = GO | CONDITIONAL_GO | PAUSE | PIVOT

IF decision = CONDITIONAL_GO:
  DEFINE: conditions[] (e.g., "Resolve blocker BLK-023 by Day 3")

IF decision = PAUSE:
  DEFINE: resume_criteria[]

IF decision = PIVOT:
  ESCALATE: To stakeholders (major change)

RECORD: decision + rationale

STORE: go_no_go_decision
```

## COUNTER-CHECK

```
CLAIM: "All pending decisions reviewed"

ATTEMPT_REFUTATION:
  CHECK: changes_for_decision[] empty BUT pending_changes exist?
  CHECK: risk_decisions_needed[] empty BUT new_critical_risks exist?
  CHECK: quality_decisions_needed[] empty BUT failed_gates exist?

  IF any mismatch:
    REFUTATION: SUCCESS
    OUTPUT: "Pending decisions missed: [list]"
    RETURN: To review step

  REFUTATION: FAILED
  CONFIRMATION: "All decisions reviewed"
```

## CHECKLIST

```
□ Week summarized (green/yellow/red days, trend)?
□ Plan variance reviewed (adjustments needed identified)?
□ Change requests reviewed (queued for decision)?
□ Risks reviewed (new critical/materialized)?
□ Quality gates reviewed (failed gates queued)?
□ GO/NO-GO decision made?
□ Counter-check executed (all decisions reviewed)?

IF any NO → RETURN to failed review
IF all YES → PROCEED to decision execution (steps 05-07)
```

## OUTPUT

```
WRITE: weekly-review-{week_number}.yaml

content:
  week: {week_number}
  review_date: {date}

  summary:
    green_days: {count}
    yellow_days: {count}
    red_days: {count}
    trend: {IMPROVING|STABLE|WORSENING}
    total_anomalies: {count}

  decisions_needed:
    variance_adjustments: {list}
    change_requests: {count}
    risk_decisions: {count}
    quality_decisions: {count}

  go_no_go:
    decision: {GO|CONDITIONAL_GO|PAUSE|PIVOT}
    rationale: {text}
    conditions: {list} (if CONDITIONAL_GO)
```
