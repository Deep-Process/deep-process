# STEP 6: SPRINT_RETROSPECTIVE

## PRECONDITION
```
DAY: 14 (Friday end of sprint)
DURATION: 2 hours
```

## SEQUENCE

### 6.1: COMPUTE_OUTCOMES
```
COUNT:
  tasks_completed, tasks_incomplete
  story_points_completed
COMPUTE: velocity_actual = completed_sp / 2 weeks
```

### 6.2: ANALYZE_WHAT_WENT_WELL
```
DISCUSS: Successes
RECORD: {list}
```

### 6.3: ANALYZE_WHAT_WENT_WRONG
```
DISCUSS: Failures, blockers, pain points
RECORD: {list}
```

### 6.4: EXTRACT_LESSONS
```
GENERATE: action_items[]
CLASSIFY: incomplete_tasks (BLOCKED | DESCOPED | UNDERESTIMATED)
```

### 6.5: GENERATE_RETROSPECTIVE
```
OUTPUT: sprint-retrospective-{N}.yaml
CONTENT:
  - Metrics (velocity, completion%)
  - What went well/wrong
  - Lessons learned
  - Action items (CRs to create)
```

### 6.6: NOTIFY_PROCESSES
```
SEND: retrospective TO deep-govern, deep-plan, deep-synthesis
REQUEST: deep-plan update velocity estimates
```
