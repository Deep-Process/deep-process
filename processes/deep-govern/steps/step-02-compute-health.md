# STEP 2: COMPUTE_HEALTH

## PRECONDITION

```
INPUT: monitoring-snapshot-{date}.yaml FROM step-01
```

## SEQUENCE

### 2.1: COMPUTE_SCHEDULE_HEALTH

```
LOAD: variance_snapshot.schedule_variance

CLASSIFY:
  IF ABS(schedule_variance) <= 0.05:
    schedule_health = GREEN

  IF ABS(schedule_variance) > 0.05 AND <= 0.10:
    schedule_health = YELLOW

  IF ABS(schedule_variance) > 0.10:
    schedule_health = RED

STORE: schedule_health
```

### 2.2: COMPUTE_BLOCKER_HEALTH

```
LOAD: blocker_snapshot.n_blockers

CLASSIFY:
  IF n_blockers <= 1:
    blocker_health = GREEN

  IF n_blockers = 2 OR n_blockers = 3:
    blocker_health = YELLOW

  IF n_blockers > 3:
    blocker_health = RED

STORE: blocker_health
```

### 2.3: COMPUTE_VELOCITY_HEALTH

```
LOAD: variance_snapshot.velocity_variance

CLASSIFY:
  IF velocity_variance >= -0.10:
    velocity_health = GREEN

  IF velocity_variance < -0.10 AND >= -0.20:
    velocity_health = YELLOW

  IF velocity_variance < -0.20:
    velocity_health = RED

STORE: velocity_health
```

### 2.4: COMPUTE_BUDGET_HEALTH

```
LOAD: budget_tracking.yaml (if exists, else assume GREEN)

IF exists:
  COMPUTE: budget_ratio = actual_spend / (planned_spend_at_this_point)

  CLASSIFY:
    IF budget_ratio <= 1.10:
      budget_health = GREEN

    IF budget_ratio > 1.10 AND <= 1.20:
      budget_health = YELLOW

    IF budget_ratio > 1.20:
      budget_health = RED

IF NOT exists:
  budget_health = GREEN (default, no tracking yet)

STORE: budget_health
```

### 2.5: COMPUTE_QUALITY_HEALTH

```
LOAD: quality_snapshot.n_failed

CLASSIFY:
  IF n_failed = 0:
    quality_health = GREEN

  IF n_failed = 1:
    quality_health = YELLOW

  IF n_failed >= 2:
    quality_health = RED

STORE: quality_health
```

### 2.6: COMPUTE_OVERALL_HEALTH

```
AGGREGATE: [schedule_health, blocker_health, velocity_health, budget_health, quality_health]

REASONING:
  schedule = {GREEN|YELLOW|RED}
  blockers = {GREEN|YELLOW|RED}
  velocity = {GREEN|YELLOW|RED}
  budget = {GREEN|YELLOW|RED}
  quality = {GREEN|YELLOW|RED}

  COUNT: red_flags = {n}
  COUNT: yellow_flags = {n}
  COUNT: green_flags = {n}

  LOGIC:
    any_red_flag = {yes/no}
    any_yellow_flag = {yes/no}
    all_green = {yes/no}

  CONCLUSION: overall_health = {GREEN|YELLOW|RED}

RULE:
  IF any = RED:
    overall_health = RED

  ELSE IF any = YELLOW:
    overall_health = YELLOW

  ELSE:
    overall_health = GREEN

STORE: overall_health
```

## CHECKLIST

```
□ Schedule health computed?
□ Blocker health computed?
□ Velocity health computed?
□ Budget health computed?
□ Quality health computed?
□ Overall health computed?

IF any NO → RETURN to failed computation
IF all YES → PROCEED to step-03
```

## OUTPUT

```
WRITE: health-score-{date}.yaml

content:
  date: {today}
  health_scores:
    schedule: {schedule_health}
    blockers: {blocker_health}
    velocity: {velocity_health}
    budget: {budget_health}
    quality: {quality_health}
    overall: {overall_health}

  metrics:
    schedule_variance: {value}
    n_blockers: {value}
    velocity_variance: {value}
    budget_ratio: {value}
    n_quality_failures: {value}
```
