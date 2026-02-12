# #504 Dunning-Kruger Dimension Map

**Phase:** META (Continuous)
**Tier:** 3 — As-Needed
**Purpose:** Identify dimensions where expertise mismatch creates estimation bias

## Theoretical Foundation

The Dunning-Kruger effect: low expertise leads to overconfidence (don't know what you don't know), while high expertise can lead to underconfidence (assume others know what you know). Both distort feasibility assessment.

**Key insight:** For each feasibility dimension, assess whether evaluators have the expertise to calibrate their confidence. Overconfident novices and underconfident experts both create estimation errors.

## Dunning-Kruger Patterns

| Pattern | Description | Risk |
|---------|-------------|------|
| **Novice overconfidence** | Low expertise, high confidence | Underestimate difficulty |
| **Expert underconfidence** | High expertise, low confidence | Overestimate difficulty |
| **Assumed expertise** | Overconfidence in adjacent domain | Miss domain-specific issues |
| **Expertise mismatch** | Wrong expert for the question | Both directions possible |

## Step-by-step

### Step 1: Map Evaluator Expertise by Dimension

For each feasibility dimension, who evaluated it and what's their expertise?

| Dimension | Evaluator | Expertise Level | Confidence Stated |
|-----------|-----------|-----------------|-------------------|
| Technical | Tech Lead | High | Medium |
| Resource | PM | Medium | High |
| Knowledge | Dev Manager | High | High |
| Temporal | PM | Low | High |
| Compositional | Architect | High | Medium |
| Scale | Dev Lead | Low | High |
| Economic | Finance | High | High |
| Dependency | PM | Medium | High |

### Step 2: Identify Expertise-Confidence Gaps

```
EXPERTISE-CONFIDENCE ANALYSIS:

Temporal feasibility:
Evaluator: PM
Expertise in estimation: LOW (no formal training)
Confidence stated: HIGH
→ GAP: Dunning-Kruger risk (overconfidence)

Scale feasibility:
Evaluator: Dev Lead
Expertise in scale: LOW (first time at this scale)
Confidence stated: HIGH
→ GAP: Dunning-Kruger risk (overconfidence)

Technical feasibility:
Evaluator: Tech Lead
Expertise: HIGH (10 years, similar projects)
Confidence stated: MEDIUM
→ POSSIBLE: Expert underconfidence
```

### Step 3: Check for "Mount Stupid"

The peak of overconfidence before the valley of despair:

```
MOUNT STUPID CHECK:

Question: "How complex is the Synapse integration?"

Dev Lead response: "Not too bad, I've read the docs"
Expertise: Has read docs, no hands-on experience
Location: MOUNT STUPID (peak of overconfidence)

Tech Lead response: "Several unknowns, we should spike"
Expertise: Has done similar integrations
Location: SLOPE OF ENLIGHTENMENT

Which opinion is weighted more in decision?
→ Currently equal — should weight Tech Lead higher
```

### Step 4: Identify Assumed Expertise

```
ASSUMED EXPERTISE CHECK:

Claim: "I know data pipelines, Databricks is just another tool"

Check:
□ Experience with Databricks specifically? No
□ Experience with Spark? No
□ Experience with Delta Lake? No
□ Experience with data pipelines? Yes — but different tools

Assessment: ASSUMED EXPERTISE
Risk: Missing Databricks-specific challenges
Recommendation: Consult Databricks expert
```

### Step 5: Map by Dimension

Create a dimension-by-dimension map:

```
DUNNING-KRUGER DIMENSION MAP:

Technical (201):
├─ Evaluator: Tech Lead
├─ Expertise: ████████░░ High
├─ Confidence: ██████░░░░ Medium
├─ Pattern: Possible underconfidence
└─ Action: Trust assessment, may be conservative

Resource (202):
├─ Evaluator: PM
├─ Expertise: ██████░░░░ Medium
├─ Confidence: ████████░░ High
├─ Pattern: Slight overconfidence
└─ Action: Verify resource commitments

Temporal (205):
├─ Evaluator: PM
├─ Expertise: ████░░░░░░ Low
├─ Confidence: ████████░░ High
├─ Pattern: DUNNING-KRUGER (overconfidence)
└─ Action: Apply correction, consult expert

Scale (208):
├─ Evaluator: Dev Lead
├─ Expertise: ████░░░░░░ Low
├─ Confidence: ████████░░ High
├─ Pattern: DUNNING-KRUGER (overconfidence)
└─ Action: Validate with scale expert
```

### Step 6: Apply Corrections

For each Dunning-Kruger pattern:

```
DIMENSION: Temporal (205)
Pattern: Novice overconfidence

Correction:
□ Reduce confidence level: H → M or L
□ Seek expert input (experienced PM, reference class)
□ Apply planning fallacy correction (#501)
□ Use outside view, not inside view

DIMENSION: Scale (208)
Pattern: Novice overconfidence

Correction:
□ Reduce confidence level: H → L
□ Consult scale expert
□ Run validation spike
□ Do not trust current assessment without validation
```

### Step 7: Score Expertise Calibration

| Score | Criteria |
|-------|----------|
| 5 | Expert evaluators for all dimensions, expertise-confidence aligned |
| 4 | Most dimensions have appropriate expertise |
| 3 | Some expertise gaps identified and addressed |
| 2 | Significant expertise gaps, overconfidence likely |
| 1 | Non-experts evaluating critical dimensions with high confidence |

## Output format

```yaml
dunning_kruger_dimension_map:
  score: 3
  confidence: "M"

  dimensions:
    - dimension: "Technical"
      id: 201
      evaluator: "Tech Lead"
      expertise:
        level: "High"
        basis: "10 years experience, 3 similar projects"
      confidence_stated: "Medium"
      pattern: "Possible underconfidence"
      dk_risk: "Low"
      action: "Trust assessment — may be conservative"
      adjustment: "None"

    - dimension: "Resource"
      id: 202
      evaluator: "PM"
      expertise:
        level: "Medium"
        basis: "General PM experience, not resource specialist"
      confidence_stated: "High"
      pattern: "Slight overconfidence"
      dk_risk: "Medium"
      action: "Verify resource commitments in writing"
      adjustment: "Confidence H → M"

    - dimension: "Knowledge"
      id: 203
      evaluator: "Dev Manager"
      expertise:
        level: "High"
        basis: "Knows team well, accurate skill inventory"
      confidence_stated: "High"
      pattern: "Appropriate confidence"
      dk_risk: "Low"
      action: "Trust assessment"
      adjustment: "None"

    - dimension: "Organizational"
      id: 204
      evaluator: "PM"
      expertise:
        level: "Medium"
        basis: "Knows org, less depth on change management"
      confidence_stated: "Medium"
      pattern: "Appropriate caution"
      dk_risk: "Low"
      action: "Trust assessment"
      adjustment: "None"

    - dimension: "Temporal"
      id: 205
      evaluator: "PM"
      expertise:
        level: "Low"
        basis: "No formal estimation training, limited track record"
      confidence_stated: "High"
      pattern: "DUNNING-KRUGER — overconfidence"
      dk_risk: "High"
      action:
        - "Reduce confidence level"
        - "Seek expert input"
        - "Apply planning fallacy correction"
      adjustment: "Confidence H → L"

    - dimension: "Compositional"
      id: 206
      evaluator: "Architect"
      expertise:
        level: "High"
        basis: "Integration specialist, relevant experience"
      confidence_stated: "Medium"
      pattern: "Appropriate caution"
      dk_risk: "Low"
      action: "Trust assessment"
      adjustment: "None"

    - dimension: "Economic"
      id: 207
      evaluator: "Finance"
      expertise:
        level: "High"
        basis: "Financial analyst, ROI specialist"
      confidence_stated: "High"
      pattern: "Expert confidence"
      dk_risk: "Low"
      action: "Trust assessment"
      adjustment: "None"

    - dimension: "Scale"
      id: 208
      evaluator: "Dev Lead"
      expertise:
        level: "Low"
        basis: "First project at this scale"
      confidence_stated: "High"
      pattern: "DUNNING-KRUGER — overconfidence"
      dk_risk: "High"
      action:
        - "Reduce confidence level"
        - "Consult scale expert"
        - "Run validation spike"
      adjustment: "Confidence H → L, Score 3 → uncertain"

    - dimension: "Cognitive"
      id: 209
      evaluator: "Architect"
      expertise:
        level: "High"
        basis: "Systems thinking, complexity management"
      confidence_stated: "High"
      pattern: "Expert confidence"
      dk_risk: "Low"
      action: "Trust assessment"
      adjustment: "None"

    - dimension: "Dependency"
      id: 210
      evaluator: "PM"
      expertise:
        level: "Medium"
        basis: "Vendor management experience, less technical depth"
      confidence_stated: "High"
      pattern: "Slight overconfidence"
      dk_risk: "Medium"
      action: "Validate technical assumptions with Tech Lead"
      adjustment: "Confidence H → M"

  mount_stupid_cases:
    - dimension: "Scale"
      evaluator: "Dev Lead"
      quote: "I've read about Synapse, it should handle our scale"
      reality: "No hands-on experience at this scale"
      recommendation: "Spike before committing"

    - dimension: "Temporal"
      evaluator: "PM"
      quote: "We've added buffer, should be fine"
      reality: "Buffer calculation not evidence-based"
      recommendation: "Reference class forecasting"

  assumed_expertise:
    - area: "Databricks at scale"
      claim: "We know data pipelines"
      reality: "Pipeline experience but not with Databricks/Spark"
      risk: "Missing platform-specific challenges"
      recommendation: "Consult Databricks specialist"

    - area: "Synapse performance"
      claim: "It's just SQL queries"
      reality: "Serverless has different characteristics"
      risk: "Unexpected performance issues"
      recommendation: "Run performance spike"

  summary:
    dimensions_assessed: 10
    appropriate_expertise: 6
    dk_risk_high: 2
    dk_risk_medium: 2

    adjustments_needed:
      - dimension: "Temporal"
        confidence: "H → L"
      - dimension: "Scale"
        confidence: "H → L"
      - dimension: "Resource"
        confidence: "H → M"
      - dimension: "Dependency"
        confidence: "H → M"

  recommendations:
    - "Bring in estimation expert for Temporal dimension"
    - "Run Scale spike before trusting current assessment"
    - "Get written resource commitments"
    - "Have Tech Lead review Dependency assumptions"
    - "Discount confidence on dimensions with DK risk"
```

## Integration Points

- **Applies to:** All dimension confidence ratings
- **Feeds to:** #402 Decision (adjusted confidence), expert consultation needs

## Common Pitfalls

- **Equal weighting:** Treating all evaluators as equally expert
- **Title = expertise:** Assuming role means domain expertise
- **Self-assessment:** People rate their own expertise (DK applies here too)
- **No correction:** Identifying DK but not adjusting
- **Overcorrection:** Dismissing valid expertise due to DK concerns
