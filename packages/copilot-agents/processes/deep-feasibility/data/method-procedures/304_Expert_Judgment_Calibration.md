# #304 Expert Judgment Calibration

**Phase:** 3 (VALIDATE)
**Tier:** 2 — Recommended
**Purpose:** Calibrate expert estimates and identify systematic biases

## Theoretical Foundation

Expert judgment is essential for feasibility assessment but suffers from known biases. Calibrated experts have estimates that match reality over time. Uncalibrated experts are consistently wrong in predictable ways.

**Key insight:** Most technical experts are overconfident. Their 90% confidence intervals contain the true value only 50-60% of the time. Calibration corrects for this.

## Calibration Concepts

| Concept | Definition |
|---------|------------|
| **Calibration** | How well confidence matches accuracy |
| **Overconfidence** | Confidence exceeds accuracy |
| **Underconfidence** | Accuracy exceeds confidence |
| **Reference class** | Similar past projects for comparison |

## Step-by-step

### Step 1: Identify Expert Estimates

Collect all expert estimates from the feasibility assessment:

```
TECHNICAL ESTIMATES:
□ "This will take 6 weeks" — Senior Dev
□ "Performance will be fine" — Architect
□ "Integration is straightforward" — Tech Lead

BUSINESS ESTIMATES:
□ "Users will adopt quickly" — Product Owner
□ "ROI is 200%" — Business Analyst
□ "Risk is low" — Project Manager
```

### Step 2: Assess Expert Calibration History

For each expert, check historical accuracy:

| Expert | Domain | Past Estimates | Actual Outcomes | Calibration |
|--------|--------|----------------|-----------------|-------------|
| Senior Dev | Time estimates | 5 projects | 4 overrun by 50%+ | Overconfident |
| Architect | Technical risk | 3 projects | 2 accurate | Well calibrated |
| Tech Lead | Integration | 4 projects | 3 underestimated | Overconfident |

### Step 3: Apply Calibration Factors

For known biases, apply correction:

```
ESTIMATE: "Integration will take 2 weeks"
Expert: Tech Lead
Historical bias: 1.5× overconfident on integration

Calibrated estimate: 2 weeks × 1.5 = 3 weeks

Range:
- Expert range: 1.5 - 2.5 weeks
- Calibrated range: 2 - 4 weeks (widened + shifted)
```

### Step 4: Use Reference Class Forecasting

Compare to similar past projects:

```
ESTIMATE: Data pipeline project, 6 months

Reference class: Similar data pipeline projects
□ Project A: Estimated 4 months, actual 7 months
□ Project B: Estimated 6 months, actual 9 months
□ Project C: Estimated 3 months, actual 6 months
□ Project D: Estimated 5 months, actual 8 months

Reference class statistics:
- Average overrun: 67%
- Range: 50% - 100% overrun

Calibrated estimate:
- Point estimate: 6 months × 1.67 = 10 months
- Range: 9-12 months
```

### Step 5: Conduct Structured Estimation

Use structured techniques to improve estimates:

**Three-point estimation:**
```
Optimistic (10th percentile): 4 months
Most likely (50th percentile): 6 months
Pessimistic (90th percentile): 12 months

PERT estimate: (4 + 4×6 + 12) / 6 = 6.7 months
Standard deviation: (12 - 4) / 6 = 1.3 months

90% confidence range: 6.7 ± 2.1 = 4.6 - 8.8 months
```

**Delphi method:**
```
Round 1:
- Expert A: 5 months
- Expert B: 8 months
- Expert C: 6 months

Share reasoning, Round 2:
- Expert A: 6 months (adjusted up based on B's concerns)
- Expert B: 7 months (adjusted down after discussion)
- Expert C: 6 months (unchanged)

Consensus: 6-7 months
```

### Step 6: Check for Anchoring

Identify if estimates are anchored to initial numbers:

```
WARNING SIGNS OF ANCHORING:
□ All estimates cluster around first stated number
□ Estimates exactly match stakeholder expectations
□ No one challenged the initial scope
□ "We need it by X" driving estimates backward

ANCHOR CHECK:
Initial timeline stated: "We need this by June"
All estimates: 5-6 months (just making June)

Question: Would estimates be different if deadline wasn't stated?
Test: Re-estimate without deadline anchor
```

### Step 7: Score Expert Judgment Quality

| Score | Criteria |
|-------|----------|
| 5 | Multiple calibrated experts, reference class used, structured methods |
| 4 | Some calibration applied, diverse expert input |
| 3 | Expert estimates with basic sanity checking |
| 2 | Single expert, no calibration, potential anchoring |
| 1 | Uncalibrated estimates, clear bias indicators |

## Output format

```yaml
expert_judgment_calibration:
  score: 3
  confidence: "M"

  experts_consulted:
    - name: "Tech Lead"
      domain: "Technical architecture"
      experience: "8 years"
      calibration_history:
        projects_checked: 4
        accuracy: "70% within stated range"
        bias: "Slightly overconfident on integration"
        correction_factor: 1.3

    - name: "Senior Developer"
      domain: "Time estimation"
      experience: "5 years"
      calibration_history:
        projects_checked: 5
        accuracy: "40% within stated range"
        bias: "Significantly overconfident"
        correction_factor: 1.6

    - name: "Architect"
      domain: "Technical risk"
      experience: "12 years"
      calibration_history:
        projects_checked: 3
        accuracy: "85% within stated range"
        bias: "Well calibrated"
        correction_factor: 1.0

  estimates_calibrated:
    - estimate: "Development time"
      original: "6 months"
      expert: "Senior Developer"
      method: "Reference class + calibration"
      reference_class:
        similar_projects: 4
        average_overrun: "67%"
      calibrated: "10 months"
      range: "8-12 months"
      confidence: "M"

    - estimate: "Integration complexity"
      original: "Straightforward (2 weeks)"
      expert: "Tech Lead"
      method: "Historical calibration"
      calibrated: "Moderate (3-4 weeks)"
      range: "2-5 weeks"
      confidence: "M"

    - estimate: "Technical risk"
      original: "Medium"
      expert: "Architect"
      method: "No adjustment (well calibrated)"
      calibrated: "Medium"
      confidence: "H"

  structured_estimation:
    method: "Three-point PERT"
    optimistic: "6 months"
    most_likely: "10 months"
    pessimistic: "18 months"
    pert_estimate: "10.7 months"
    confidence_90: "7-15 months"

  bias_checks:
    anchoring:
      detected: true
      anchor: "June deadline"
      impact: "Estimates clustered around 6 months"
      mitigation: "Re-estimated without deadline constraint"

    overconfidence:
      detected: true
      indicators:
        - "Narrow confidence ranges"
        - "No contingency in estimates"
      mitigation: "Widened ranges, added buffer"

    groupthink:
      detected: false
      notes: "Diverse opinions expressed"

  reference_class_analysis:
    class: "Enterprise data pipeline projects"
    sample_size: 4
    findings:
      - "Average 67% schedule overrun"
      - "Integration consistently underestimated"
      - "Data quality issues common"
    applied_correction: "1.5× schedule, +2 weeks integration"

  recommendations:
    - "Use calibrated timeline (10 months) for planning"
    - "Add integration buffer based on historical pattern"
    - "Revalidate estimates at Phase gate"
    - "Track actuals for future calibration"
```

## Integration Points

- **Feeds from:** All expert estimates from Phases 1-2
- **Feeds to:** #401 Overall profile, #205 Temporal feasibility (calibrated timeline)

## Common Pitfalls

- **Trusting uncalibrated experts:** Assuming expertise = calibration
- **Ignoring reference class:** Treating project as unique
- **Anchoring acceptance:** Not questioning initial constraints
- **Narrow ranges:** 90% confidence should be wide
- **Single expert reliance:** No diverse perspectives
