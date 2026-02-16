# STEP 3: DETECT_ANOMALIES

## PRECONDITION

```
INPUT: health-score-{date}.yaml FROM step-02
INPUT: health-score-{date-1}.yaml (yesterday, if exists)
```

## SEQUENCE

### 3.1: DETECT_SCHEDULE_SLIP

```
LOAD: today's schedule_variance
LOAD: yesterday's schedule_variance (if exists)

IF yesterday exists:
  COMPUTE: variance_delta = today - yesterday

  IF variance_delta > 0.05:
    CREATE: anomaly_id = ANOM-SCHEDULE-{date}
    anomaly_type = SCHEDULE_SLIP
    severity = HIGH
    description = "Schedule variance increased by {variance_delta} in 1 day"

STORE: anomalies[]
```

### 3.2: DETECT_VELOCITY_DROP

```
LOAD: today's velocity_variance
LOAD: velocity_variance from 1 week ago (if exists)

IF week_ago exists:
  COMPUTE: velocity_drop = today - week_ago

  IF velocity_drop < -0.20:
    CREATE: anomaly_id = ANOM-VELOCITY-{date}
    anomaly_type = VELOCITY_DROP
    severity = HIGH
    description = "Velocity dropped {velocity_drop} week-over-week"

STORE: anomalies[]
```

### 3.3: DETECT_BLOCKER_SURGE

```
LOAD: today's n_blockers
LOAD: yesterday's n_blockers (if exists)

IF yesterday exists:
  COMPUTE: blocker_increase = today - yesterday

  IF blocker_increase >= 3:
    CREATE: anomaly_id = ANOM-BLOCKER-{date}
    anomaly_type = BLOCKER_SURGE
    severity = CRITICAL
    description = "{blocker_increase} new blockers in 1 day"

STORE: anomalies[]
```

### 3.4: DETECT_BUDGET_OVERRUN

```
LOAD: today's budget_ratio

IF budget_ratio > 1.20:
  CREATE: anomaly_id = ANOM-BUDGET-{date}
  anomaly_type = BUDGET_OVERRUN
  severity = HIGH
  description = "Budget overrun: {budget_ratio}× planned spend"

STORE: anomalies[]
```

### 3.5: DETECT_QUALITY_DEGRADATION

```
LOAD: today's n_quality_failures
LOAD: average n_quality_failures over last 4 weeks (if exists)

IF average exists:
  COMPUTE: failure_increase = today - average

  IF failure_increase >= 2:
    CREATE: anomaly_id = ANOM-QUALITY-{date}
    anomaly_type = QUALITY_DEGRADATION
    severity = HIGH
    description = "Quality failures increased by {failure_increase}"

STORE: anomalies[]
```

### 3.6: FLAG_FOR_REVIEW

```
COUNT: total_anomalies = COUNT(anomalies[])

IF total_anomalies > 0:
  FLAG: for_weekly_review = TRUE

  FOR each anomaly WHERE severity = CRITICAL:
    ALERT: governance_board (immediate attention)
    CREATE: alert notification

IF total_anomalies = 0:
  FLAG: for_weekly_review = FALSE
```

## CHECKLIST

```
□ Schedule slip detection executed?
□ Velocity drop detection executed?
□ Blocker surge detection executed?
□ Budget overrun detection executed?
□ Quality degradation detection executed?
□ Anomalies flagged for review?

IF any NO → RETURN to detection
IF all YES → COMPLETE daily monitoring cycle
```

## OUTPUT

```
WRITE: anomalies-{date}.yaml

content:
  date: {today}
  total_anomalies: {count}
  flagged_for_review: {boolean}

  anomalies:
    FOR each anomaly:
      - anomaly_id: {id}
        type: {type}
        severity: {severity}
        description: {text}
        detected_date: {date}

OUTPUT: governance-dashboard-daily.yaml (summary)

content:
  date: {today}
  overall_health: {GREEN|YELLOW|RED}
  anomalies_detected: {count}
  critical_anomalies: {count}
  action_required: {boolean}
```
