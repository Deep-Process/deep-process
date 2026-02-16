# STEP 5: MID_SPRINT_CHECKPOINT

## PRECONDITION
```
DAY: 7 (Wednesday mid-sprint)
```

## SEQUENCE

### 5.1: COMPUTE_PROGRESS
```
COMPUTE:
  completed_sp / total_sp
  target = 50%
  variance = actual - target
```

### 5.2: FORECAST_COMPLETION
```
velocity_daily = completed_sp / days_elapsed
remaining_days = remaining_sp / velocity_daily
forecast = days_elapsed + remaining_days
```

### 5.3: DECIDE_ACTION
```
IF forecast <= sprint_end:
  ACTION: Continue
IF forecast > sprint_end + 2 days:
  ACTION: ESCALATE to deep-govern
  OPTIONS: Descope | Accept slip | Add resources
```
