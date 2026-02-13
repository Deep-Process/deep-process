# #501 Planning Fallacy Detection

**Phase:** META (Continuous)
**Tier:** 1 — Mandatory
**Purpose:** Detect and correct for the planning fallacy throughout assessment

## Theoretical Foundation

The planning fallacy (Kahneman & Tversky) is the systematic tendency to underestimate time, costs, and risks while overestimating benefits. It affects nearly all project planning regardless of experience or expertise.

**Key insight:** The planning fallacy is not fixed by trying harder. It requires structural countermeasures: reference class forecasting, outside view, and explicit debiasing.

## Planning Fallacy Signatures

| Signature | What It Looks Like |
|-----------|-------------------|
| **Best-case thinking** | Estimates assume everything goes right |
| **Unique project illusion** | "This is different from past projects" |
| **Scope optimism** | "We'll figure out the details later" |
| **Coordination amnesia** | Forgetting handoff and integration time |
| **Perfect resource assumption** | Assuming 100% productivity, no context switching |
| **Risk blindness** | Not accounting for unknowns |

## Step-by-step

### Step 1: Check for Best-Case Estimates

Review all estimates for best-case thinking:

```
ESTIMATE REVIEW:

Original estimate: "6 months to complete"

Check questions:
□ What has to go RIGHT for this to happen?
  → No blockers, team at full capacity, no scope change
□ What could go WRONG?
  → Integration issues, resource conflicts, external delays
□ What's the probability of best case?
  → ~20%

Best-case detected: YES
```

### Step 2: Compare Inside vs Outside View

| View | Approach | Result |
|------|----------|--------|
| **Inside view** | Bottom-up from tasks | 6 months |
| **Outside view** | Similar projects historically | 9-12 months |
| **Gap** | 50-100% discrepancy | **Planning fallacy indicator** |

```
INSIDE VIEW (task-based):
Task 1: 4 weeks
Task 2: 6 weeks
Task 3: 8 weeks
Integration: 2 weeks
Buffer: 2 weeks
Total: 22 weeks (~5.5 months)

OUTSIDE VIEW (reference class):
Similar project A: Estimated 4 months, actual 7 months
Similar project B: Estimated 6 months, actual 9 months
Similar project C: Estimated 5 months, actual 8 months
Average overrun: 60%

CORRECTED ESTIMATE: 5.5 months × 1.6 = 8.8 months
```

### Step 3: Test "This Time Is Different"

When someone claims uniqueness, challenge it:

```
CLAIM: "This project is different because we have experienced team"

Challenge questions:
□ Did previous projects have inexperienced teams? No — teams were experienced
□ Did experience prevent overruns before? No — still overran
□ What specifically is different? "Better tooling"
□ Was tooling the cause of overruns before? No — it was integration issues

Conclusion: "Different" claim not supported
Apply reference class adjustment
```

### Step 4: Check for Coordination Time

Coordination often missing from estimates:

```
COORDINATION AUDIT:

Explicit in estimate:
□ Development time: Yes
□ Testing time: Yes
□ Deployment time: Yes

Missing from estimate:
□ Handoff meetings: Not included
□ Code review iterations: Not included
□ Stakeholder feedback loops: Not included
□ Integration debugging: Not included
□ Documentation: Not included

Estimated missing time: 15-20% of total
```

### Step 5: Apply Planning Fallacy Correction

Standard correction factors based on project type:

| Project Type | Typical Overrun | Correction Factor |
|--------------|-----------------|-------------------|
| Software development | 50-100% | 1.5-2.0× |
| Infrastructure | 40-80% | 1.4-1.8× |
| Data projects | 60-120% | 1.6-2.2× |
| Novel technology | 100-200% | 2.0-3.0× |
| Integration heavy | 80-150% | 1.8-2.5× |

```
This project: Data + Integration
Base estimate: 6 months
Correction factor: 1.8× (data + integration)
Corrected estimate: 10.8 months
Recommended range: 9-12 months
```

### Step 6: Document Debiasing Applied

```
PLANNING FALLACY CORRECTION LOG:

Original estimate: 6 months

Corrections applied:
1. Reference class: +60% (similar projects)
2. Missing coordination: +15%
3. Unknown unknowns: +20%

Cumulative factor: 1.95×
Corrected estimate: 11.7 months
Recommended: 10-12 months with conditions
```

### Step 7: Score Planning Fallacy Awareness

| Score | Criteria |
|-------|----------|
| 5 | Outside view used, corrections applied, team acknowledges bias |
| 4 | Reference class considered, some correction applied |
| 3 | Aware of planning fallacy, limited correction |
| 2 | Inside view only, no reference class |
| 1 | Best-case estimates, no awareness of bias |

## Output format

```yaml
planning_fallacy_detection:
  score: 4
  confidence: "H"

  original_estimates:
    timeline: "6 months"
    cost: "$450,000"
    effort: "5 FTE-months"
    basis: "Task decomposition (inside view)"

  planning_fallacy_signatures:
    - signature: "Best-case thinking"
      detected: true
      evidence: "Estimate assumes no blockers, full productivity"
      severity: "High"

    - signature: "Unique project illusion"
      detected: true
      evidence: "'This team is more experienced'"
      severity: "Medium"
      challenge: "Previous projects also had experienced teams"

    - signature: "Coordination amnesia"
      detected: true
      evidence: "Handoff time not in estimate"
      severity: "Medium"
      missing_time: "15%"

    - signature: "Perfect resource assumption"
      detected: true
      evidence: "100% productivity assumed"
      severity: "Medium"
      realistic: "70-80% effective"

  inside_vs_outside_view:
    inside_view:
      method: "Task decomposition"
      result: "6 months"
      confidence: "Felt high by team"

    outside_view:
      method: "Reference class forecasting"
      reference_class: "Similar data pipeline projects"
      sample_size: 4
      findings:
        - project: "Project A"
          estimated: "4 months"
          actual: "7 months"
          overrun: "75%"
        - project: "Project B"
          estimated: "6 months"
          actual: "9 months"
          overrun: "50%"
        - project: "Project C"
          estimated: "5 months"
          actual: "8 months"
          overrun: "60%"
        - project: "Project D"
          estimated: "8 months"
          actual: "12 months"
          overrun: "50%"
      average_overrun: "59%"
      result: "9-10 months based on reference class"

    gap: "50-67%"
    interpretation: "Strong planning fallacy indicator"

  "this_time_is_different":
    claims:
      - claim: "Team is more experienced"
        validity: false
        reason: "Previous teams were also experienced, still overran"

      - claim: "Better tooling available"
        validity: "Partial"
        reason: "Tooling may save 10%, but integration was main issue"

      - claim: "Simpler scope"
        validity: false
        reason: "Scope complexity is comparable"

    conclusion: "Claims do not justify deviation from reference class"

  corrections_applied:
    reference_class:
      factor: 1.6
      source: "Historical average overrun"

    coordination_time:
      factor: 1.15
      missing_items:
        - "Handoff meetings"
        - "Code review cycles"
        - "Stakeholder feedback"

    unknown_unknowns:
      factor: 1.1
      rationale: "Novel integration not in reference class"

    total_correction: 1.93

  corrected_estimates:
    timeline:
      original: "6 months"
      corrected: "11.6 months"
      recommended: "10-12 months"
      range: "9-15 months (90% confidence)"

    cost:
      original: "$450,000"
      corrected: "$870,000"
      recommended: "$800,000 - $1,000,000"

    effort:
      original: "5 FTE-months"
      corrected: "9.7 FTE-months"
      recommended: "9-11 FTE-months"

  team_acknowledgment:
    aware_of_bias: true
    accepted_correction: "Partial"
    resistance_points:
      - "Feels pessimistic"
      - "Stakeholders expect 6 months"
    resolution: "Present corrected estimate with range"

  recommendations:
    - "Present range (10-12 months) not point estimate"
    - "Set milestones at reference class percentiles"
    - "Build explicit buffer into plan"
    - "Track actuals to calibrate future estimates"
```

## Integration Points

- **Applies to:** All estimates in all phases
- **Feeds to:** #205 Temporal, #207 Economic, overall decision

## Common Pitfalls

- **Knowing vs applying:** Knowing about the fallacy but not correcting
- **Political estimates:** Giving stakeholders what they want to hear
- **Overconfidence in correction:** Single-point corrected estimate still optimistic
- **Correction resistance:** "That seems too pessimistic"
- **Anchoring to original:** Corrections anchored to inside view
