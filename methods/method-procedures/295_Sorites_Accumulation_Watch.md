# 505 - Sorites Accumulation Watch

## Phase
MONITOR

## Purpose
Monitor for gradual, incremental risk accumulation that falls below event-detection thresholds. Each increment is negligible - the accumulated effect is catastrophic. The "boiling frog" detector.

## Theoretical Foundation

**Sorites Paradox:**
- Remove one grain of sand from a heap - still a heap
- Keep removing grains - at what point is it no longer a heap?
- No single grain matters, but the accumulated removal does

**Applied to Risk:**
Many catastrophic failures are GRADUAL:
- Technical debt accumulates one shortcut at a time
- Data quality degrades one bad record at a time
- Performance declines one additional query at a time
- Security posture erodes one exception at a time
- Team morale drops one bad day at a time

**No single increment triggers an alert. The accumulation crosses a threshold silently.**

## The Problem with Event-Based Monitoring

Event-based monitoring catches sudden changes:
- Error rate spikes → Alert
- System down → Alert
- Threshold crossed → Alert

But gradual accumulation evades event-based monitoring:
- Technical debt: +0.5% complexity per sprint (no single event)
- Performance: +2 seconds per month (within daily variance)
- Quality: -0.1% coverage per quarter (rounding error)

## Procedure

### Step 1: Identify Accumulation Risks
From #111 (Temporal Risk Archaeology), identify risks that:
- Change gradually
- Each increment is below detection threshold
- Accumulated change is significant

### Step 2: Define Trend Metrics
For each accumulation risk, define what to track:
- Not just the VALUE (point-in-time)
- But the DERIVATIVE (rate of change over time)

### Step 3: Set Accumulation Alerts
Trigger alerts based on:
- Sustained directional trend (not absolute value)
- Projected threshold crossing (not current position)

### Step 4: Periodic Recalibration
Every N weeks:
- Re-measure the baseline
- Calculate "distance to threshold"
- Ask: "Are we closer to the cliff than last time?"

### Step 5: Apply Sorites Test
For any metric:
> "If we remove/add one increment, does it matter?"
> "No? Then you won't notice. That's exactly why the accumulation is dangerous."

## Output Schema
```yaml
accumulation_watches:
  - metric_name: "What we're tracking"
    related_risk: "RISK-XXX"
    accumulation_type: "[Degrading|Accumulating|Depleting]"

    measurement:
      current_value: "Today's value"
      unit: "Unit of measurement"
      threshold: "Critical threshold"
      data_source: "Where data comes from"
      collection_frequency: "How often measured"

    trend_analysis:
      trend_direction: "[Increasing|Decreasing|Stable]"
      trend_magnitude: "Rate of change (per week/month)"
      trend_duration: "How long trending this direction"
      confidence: "[High|Medium|Low]"

    projection:
      projected_threshold_crossing: "Date or period"
      projection_method: "Linear/exponential/etc"
      projection_confidence: "[High|Medium|Low]"

    alerts:
      value_alert: "Absolute threshold (traditional)"
      trend_alert: "Sustained trend threshold"
      projection_alert: "Projected crossing threshold"

    current_status:
      distance_to_threshold: "How far from critical"
      distance_to_threshold_percent: "As percentage"
      periods_to_threshold: "At current rate, how long"
      status: "[Safe|Warning|Approaching|Critical]"

    action:
      recommended_action: "What to do"
      action_owner: "Who is responsible"
      review_frequency: "How often to check"
```

## Quality Checks
- [ ] All temporal risks from #111 have accumulation watches
- [ ] Trend metrics defined (not just values)
- [ ] Projections calculated
- [ ] Alerts set for trends, not just thresholds
- [ ] Regular recalibration scheduled

## Connections
- Feeds into: #406 (triggers include accumulation alerts)
- Uses output from: #111 (temporal risks)
- Related to: #601 (bias - normalcy bias misses accumulation)

## Examples

### Example 1: Pipeline Execution Time
```yaml
metric_name: "Pipeline P95 execution time"
related_risk: "RISK-031: SLA breach risk"
accumulation_type: Degrading

measurement:
  current_value: "3.2 hours"
  unit: "hours"
  threshold: "4.0 hours (SLA)"
  data_source: "Databricks job metrics"
  collection_frequency: "Daily"

trend_analysis:
  trend_direction: Increasing
  trend_magnitude: "+4 minutes per week"
  trend_duration: "8 weeks sustained"
  confidence: High

projection:
  projected_threshold_crossing: "12 weeks from now"
  projection_method: "Linear extrapolation"
  projection_confidence: Medium  # Could accelerate or plateau

alerts:
  value_alert: "P95 > 3.8 hours"  # Traditional
  trend_alert: "> +5 min/week sustained 3 weeks"  # Trend-based
  projection_alert: "Projected crossing < 8 weeks"  # Forward-looking

current_status:
  distance_to_threshold: "0.8 hours"
  distance_to_threshold_percent: "20%"
  periods_to_threshold: "12 weeks at current rate"
  status: Warning

action:
  recommended_action: "Investigate cause of degradation NOW, not in 12 weeks"
  action_owner: "Data Platform Lead"
  review_frequency: "Weekly"
```

### Example 2: Technical Debt
```yaml
metric_name: "Code complexity score"
related_risk: "RISK-045: Unmaintainable codebase"
accumulation_type: Accumulating

measurement:
  current_value: "347 high-complexity functions"
  unit: "count"
  threshold: "500 (team-defined maintainability limit)"
  data_source: "SonarQube"
  collection_frequency: "Per PR"

trend_analysis:
  trend_direction: Increasing
  trend_magnitude: "+12 functions per sprint"
  trend_duration: "6 sprints"
  confidence: High

projection:
  projected_threshold_crossing: "13 sprints (~6 months)"
  projection_method: "Linear"
  projection_confidence: Medium

alerts:
  value_alert: "Count > 400"
  trend_alert: "> +10/sprint sustained 4 sprints"
  projection_alert: "Projected crossing < 10 sprints"

current_status:
  distance_to_threshold: "153 functions"
  distance_to_threshold_percent: "31%"
  periods_to_threshold: "13 sprints"
  status: Warning

action:
  recommended_action: "Allocate 20% of sprint capacity to debt reduction"
  action_owner: "Tech Lead"
  review_frequency: "Per sprint"
```

### Example 3: Test Coverage
```yaml
metric_name: "Unit test coverage"
related_risk: "RISK-018: Regression risk"
accumulation_type: Depleting

measurement:
  current_value: "78%"
  unit: "percentage"
  threshold: "70% (policy minimum)"
  data_source: "CI coverage report"
  collection_frequency: "Per PR"

trend_analysis:
  trend_direction: Decreasing
  trend_magnitude: "-0.5% per sprint"
  trend_duration: "6 sprints"
  confidence: High

projection:
  projected_threshold_crossing: "16 sprints (~8 months)"
  projection_method: "Linear"
  projection_confidence: Medium

alerts:
  value_alert: "Coverage < 72%"
  trend_alert: "< -0.3%/sprint sustained 4 sprints"
  projection_alert: "Projected crossing < 12 sprints"

current_status:
  distance_to_threshold: "8%"
  distance_to_threshold_percent: "10%"
  periods_to_threshold: "16 sprints"
  status: Warning

action:
  recommended_action: "Enforce coverage requirement on new PRs"
  action_owner: "Engineering Manager"
  review_frequency: "Per sprint"
```

## Accumulation Watch Dashboard

```
SORITES ACCUMULATION DASHBOARD

                          Current    Threshold   Distance   Trend      ETA
                          -------    ---------   --------   -----      ---
Pipeline Time (hrs)        3.2        4.0         20%       +4m/wk    12 wks ⚠️
Complexity (count)         347        500         31%       +12/spr   13 spr ⚠️
Test Coverage (%)          78%        70%         10%       -0.5/spr  16 spr ⚠️
Tech Debt ($)              125k       200k        37%       +8k/mo    9 mo   ⚠️
Response Time (ms)         450        800         44%       +15/mo    23 mo  ✓

⚠️ = Warning (approaching or trending)
✓ = Safe (stable or receding)

CLOSEST TO THRESHOLD: Pipeline Time (12 weeks)
MOST CONCERN: Test Coverage (smallest margin + steady decline)
```

## The Sorites Solution

**Traditional monitoring:** "Alert when value exceeds threshold"
**Sorites monitoring:** "Alert when trajectory leads to threshold"

The difference:
- Traditional waits until it's a problem
- Sorites warns while there's still time to act
