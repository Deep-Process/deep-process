# 606 - Goodhart's Law Check

## Phase
META (After MONITOR, Before OUTPUT)

## Purpose
Audit risk metrics and processes for signs they've become targets rather than measures - at which point they stop being useful.

## Theoretical Foundation

**Goodhart's Law:**
> "When a measure becomes a target, it ceases to be a good measure."

**Implications for Risk:**
- A risk dashboard showing zero alerts may mean:
  - (a) No risks (good!)
  - (b) Team stopped reporting risks (bad!)
  - (c) Thresholds set too high (bad!)

- 100% mitigation completion may mean:
  - (a) Excellent execution (good!)
  - (b) "Done" ≠ "Working" (bad!)

When people are measured on a metric, they optimize for the metric, not the underlying goal.

## Warning Signs

| Signal | What It Might Really Mean |
|--------|--------------------------|
| **All metrics are green** | Either truly excellent OR being gamed |
| **Risk count never increases** | Either no new risks OR stopped identifying |
| **All estimates are round numbers** | P=3, I=3 for everything = not actually estimating |
| **Reviews always take exact scheduled time** | Either perfectly calibrated OR rubber-stamped |
| **No risks ever escalated** | Either nothing serious OR escalation is punished |
| **Mitigation completion is 100%** | Either excellent execution OR "done" ≠ "working" |
| **Metrics improve after target set** | Either improvement OR gaming |
| **Team confident in weak areas** | Dunning-Kruger + gaming |

## Procedure

### Step 1: List All Risk Metrics
Enumerate every metric used in risk management:
- Dashboard metrics
- KPIs
- Review metrics
- Performance indicators

### Step 2: Check for Gaming Signals
For each metric, look for warning signs:
- Suspiciously good values
- Perfect alignment with targets
- Lack of variance
- Improvement without evident cause

### Step 3: Assess Proxy Validity
For each metric, ask:
> "Is this metric still measuring what we ACTUALLY care about?"
> "Or are people optimizing the metric while ignoring the goal?"

### Step 4: Check Incentive Alignment
What do people get rewarded for?
- Reporting risks vs hiding risks
- Accurate estimates vs optimistic estimates
- Real completion vs claimed completion

### Step 5: Recommend Countermeasures
Where gaming detected or suspected:
- Rotate metrics periodically
- Audit with spot checks
- Use multiple uncorrelated indicators
- Align incentives with goals, not metrics

## Output Schema
```yaml
goodhart_audit:
  audit_date: "YYYY-MM-DD"

  metrics_reviewed:
    - metric: "Metric name"
      purpose: "What it should measure"
      current_value: "Current reading"

      gaming_assessment:
        warning_signs_present:
          - sign: "Warning sign observed"
            evidence: "What we saw"
        gaming_likelihood: "[Low|Medium|High]"
        gaming_mechanism: "How it might be gamed"

      proxy_validity:
        still_valid: "[true|false]"
        drift_description: "How metric diverged from goal"

      incentive_check:
        current_incentive: "What people are rewarded for"
        aligned_with_goal: "[true|false]"
        misalignment: "How incentives diverge from goal"

      recommendation:
        action: "What to do"
        priority: "[Low|Medium|High]"

  overall_assessment:
    metrics_at_risk: 3
    most_gamed: "Metric most likely being gamed"
    systemic_issues: "Patterns across metrics"

  recommendations:
    - "Recommendation 1"
    - "Recommendation 2"
```

## Quality Checks
- [ ] All metrics reviewed
- [ ] Warning signs checked
- [ ] Proxy validity assessed
- [ ] Incentives analyzed
- [ ] Recommendations made
- [ ] Gaming risks addressed

## Connections
- Feeds into: Metric redesign, process improvement
- Uses output from: #501 (indicators), #502 (review cadence)
- Related to: #601 (gaming is a form of bias)

## Examples

### Example 1: Risk Count Metric
```yaml
metric: "Number of risks in register"
purpose: "Track comprehensive risk identification"
current_value: "28 risks (unchanged for 6 months)"

gaming_assessment:
  warning_signs_present:
    - sign: "Risk count never increases"
      evidence: "Last new risk added 6 months ago"
    - sign: "External incidents not captured"
      evidence: "Industry vulnerabilities not in register"
  gaming_likelihood: High
  gaming_mechanism: |
    Adding risks creates work. Team may unconsciously avoid
    identifying new risks to avoid creating more tracking/mitigation work.

proxy_validity:
  still_valid: false
  drift_description: |
    Static count doesn't mean no new risks - it means
    identification has stopped. Metric shows "stable" when
    reality is "blind."

incentive_check:
  current_incentive: "Team praised for 'managing risks well' when count low"
  aligned_with_goal: false
  misalignment: "Low count is rewarded, but may indicate poor identification"

recommendation:
  action: "Track 'risks identified this period' not just total count. Celebrate discovery."
  priority: High
```

### Example 2: Mitigation Completion
```yaml
metric: "Mitigation completion rate"
purpose: "Track progress on risk reduction"
current_value: "100% (all mitigations marked complete)"

gaming_assessment:
  warning_signs_present:
    - sign: "100% completion (perfect)"
      evidence: "No mitigation ever incomplete"
    - sign: "Incidents still occurring for 'mitigated' risks"
      evidence: "RISK-023 still causing issues despite 'complete' mitigation"
  gaming_likelihood: High
  gaming_mechanism: |
    Mitigations marked "complete" when implemented, not when effective.
    "Done" checkbox filled without verification of actual risk reduction.

proxy_validity:
  still_valid: false
  drift_description: |
    Completion measures activity, not effectiveness.
    A risk can be "100% mitigated" but still materialize.

incentive_check:
  current_incentive: "Team measured on completion rate"
  aligned_with_goal: false
  misalignment: "Incentive is to close tickets, not reduce risk"

recommendation:
  action: "Add 'mitigation effectiveness' metric: did residual risk actually decrease?"
  priority: High
```

### Example 3: Review Meeting Metric
```yaml
metric: "Risk review meeting completion"
purpose: "Ensure regular risk review"
current_value: "100% of scheduled reviews held, all in 30 minutes"

gaming_assessment:
  warning_signs_present:
    - sign: "All meetings exactly scheduled time"
      evidence: "Every review is exactly 30 minutes"
    - sign: "No debates or changes"
      evidence: "Meeting notes show 'reviewed, no changes' every time"
  gaming_likelihood: Medium
  gaming_mechanism: |
    Meetings may be rubber-stamped to check box.
    "We had the meeting" ≠ "We actually reviewed."

proxy_validity:
  still_valid: Partially
  drift_description: |
    Meeting happened, but quality unclear.
    Metric measures occurrence, not value.

incentive_check:
  current_incentive: "Calendar compliance"
  aligned_with_goal: Partially
  misalignment: "No incentive for meeting quality"

recommendation:
  action: "Random deep-dive audits on review quality. Track decisions/changes per review."
  priority: Medium
```

## Countermeasures for Gaming

| Countermeasure | How It Helps |
|----------------|-------------|
| **Rotate metrics** | Gaming one metric doesn't persist |
| **Multiple uncorrelated indicators** | Hard to game all at once |
| **Spot check audits** | Random verification |
| **Incentive redesign** | Align rewards with goals |
| **Celebrate discovery** | Make finding risks positive |
| **Effectiveness over activity** | Measure outcomes, not outputs |
| **External validation** | Third party can't game internal metrics |

## Goodhart's Law Mantra

Before trusting any metric, ask:
1. "If people knew they were measured on this, how would they game it?"
2. "Is there evidence of that gaming?"
3. "Does improvement in this metric guarantee improvement in the actual goal?"

If you can imagine the gaming, it's probably happening.
