# #401 Multi-Axis Feasibility Profile

**Phase:** 4 (DECIDE)
**Tier:** 1 — Mandatory
**Purpose:** Synthesize all dimensions into overall feasibility assessment

## Theoretical Foundation

Feasibility is not a single number — it's a multi-dimensional profile. The binding constraint principle: overall feasibility is limited by the weakest dimension. A project can't be "80% feasible" if one dimension is at 20%.

**Key insight:** The binding constraint (lowest dimension) determines the ceiling. High scores elsewhere don't compensate for critical weaknesses.

## The 10 Feasibility Dimensions

| # | Dimension | Question |
|---|-----------|----------|
| 201 | Technical | Can we build it with known methods? |
| 202 | Resource | Do we have people/money/tools? |
| 203 | Knowledge | Does the team know how? |
| 204 | Organizational | Will the org support it? |
| 205 | Temporal | Can we do it in time? |
| 206 | Compositional | Do parts work together? |
| 207 | Economic | Is it worth doing? |
| 208 | Scale | Does it work at production scale? |
| 209 | Cognitive | Can we understand/maintain it? |
| 210 | Dependency | Are dependencies available? |

## Step-by-step

### Step 1: Collect All Dimension Scores

Gather scores from all Phase 2 assessments:

| Dimension | Score (1-5) | Confidence (H/M/L) | Binding? |
|-----------|-------------|-------------------|----------|
| Technical | 4 | H | |
| Resource | 3 | M | |
| Knowledge | 4 | H | |
| Organizational | 3 | M | |
| Temporal | 2 | L | **← Binding** |
| Compositional | 3 | M | |
| Economic | 4 | H | |
| Scale | 3 | L | |
| Cognitive | 4 | H | |
| Dependency | 3 | M | |

### Step 2: Identify Binding Constraints

The binding constraint is the lowest score:

```
BINDING CONSTRAINT ANALYSIS:

Lowest scores:
1. Temporal: 2 (L confidence) ← PRIMARY BINDING
2. Resource: 3 (M confidence)
3. Organizational: 3 (M confidence)
4. Compositional: 3 (M confidence)
5. Scale: 3 (L confidence)
6. Dependency: 3 (M confidence)

Primary binding: TEMPORAL (score 2)
Secondary concerns: Multiple dimensions at 3

Overall feasibility ceiling: 2 (limited by temporal)
```

### Step 3: Apply Confidence Weighting

Low confidence scores should be treated more conservatively:

```
CONFIDENCE-WEIGHTED VIEW:

Score 2 + Confidence L = Effective score: 1-2 range
Score 3 + Confidence M = Effective score: 2-4 range
Score 4 + Confidence H = Effective score: 3-5 range

Most concerning:
- Temporal: 2 (L) → Could be 1-3, assume 1-2
- Scale: 3 (L) → Could be 2-4, assume 2-3
```

### Step 4: Calculate Profile Metrics

```
PROFILE METRICS:

Average score: 3.3 / 5
Minimum score: 2 (Temporal)
Maximum score: 4 (Technical, Knowledge, Economic, Cognitive)

Standard deviation: 0.64
Score distribution:
  Score 5: 0 dimensions
  Score 4: 4 dimensions
  Score 3: 5 dimensions
  Score 2: 1 dimension
  Score 1: 0 dimensions

Binding constraint: Temporal (2)
Secondary constraints: Resource, Organizational, Compositional, Scale, Dependency (all 3)

Low confidence dimensions: 2 (Temporal, Scale)
```

### Step 5: Visualize Profile

```
FEASIBILITY PROFILE:

Technical      ████████░░ 4/5 (H)
Resource       ██████░░░░ 3/5 (M)
Knowledge      ████████░░ 4/5 (H)
Organizational ██████░░░░ 3/5 (M)
Temporal       ████░░░░░░ 2/5 (L) ← BINDING
Compositional  ██████░░░░ 3/5 (M)
Economic       ████████░░ 4/5 (H)
Scale          ██████░░░░ 3/5 (L)
Cognitive      ████████░░ 4/5 (H)
Dependency     ██████░░░░ 3/5 (M)

Overall: 2/5 (limited by Temporal)
Confidence: LOW (binding constraint has low confidence)
```

### Step 6: Determine Overall Verdict

| Overall Score | Verdict | Meaning |
|---------------|---------|---------|
| 5 | Fully feasible | Proceed with confidence |
| 4 | Highly feasible | Proceed with minor conditions |
| 3 | Moderately feasible | Proceed with significant conditions |
| 2 | Marginally feasible | Conditional GO or investigate further |
| 1 | Not feasible | NO-GO unless conditions resolve |

```
VERDICT DETERMINATION:

Binding score: 2 (Temporal)
Binding confidence: L

Verdict: MARGINAL FEASIBILITY
Recommendation: CONDITIONAL GO or INVESTIGATE

Conditions for upgrade to "Moderately feasible":
1. Resolve temporal constraint (extend timeline or reduce scope)
2. Validate scale assumptions with spike
```

### Step 7: Generate Profile Summary

| Score | Criteria |
|-------|----------|
| 5 | All dimensions ≥ 4, no low confidence |
| 4 | Most dimensions ≥ 4, binding ≥ 3 |
| 3 | Binding constraint ≥ 3, no dimension ≤ 2 |
| 2 | Binding constraint = 2, resolvable |
| 1 | Binding constraint ≤ 1 OR multiple dimensions ≤ 2 |

## Output format

```yaml
multi_axis_feasibility_profile:
  overall_score: 2
  overall_confidence: "L"
  verdict: "Marginal feasibility — CONDITIONAL GO or INVESTIGATE"

  dimensions:
    - name: "Technical"
      id: 201
      score: 4
      confidence: "H"
      binding: false
      summary: "Architecture proven, technology validated"

    - name: "Resource"
      id: 202
      score: 3
      confidence: "M"
      binding: false
      summary: "Team available with minor gaps"

    - name: "Knowledge"
      id: 203
      score: 4
      confidence: "H"
      binding: false
      summary: "Team has required skills"

    - name: "Organizational"
      id: 204
      score: 3
      confidence: "M"
      binding: false
      summary: "Stakeholder support with coordination needed"

    - name: "Temporal"
      id: 205
      score: 2
      confidence: "L"
      binding: true
      summary: "Timeline aggressive, significant risk"
      binding_reason: "Lowest score, determines ceiling"

    - name: "Compositional"
      id: 206
      score: 3
      confidence: "M"
      binding: false
      summary: "Integration points identified, some uncertainty"

    - name: "Economic"
      id: 207
      score: 4
      confidence: "H"
      binding: false
      summary: "Positive ROI, budget available"

    - name: "Scale"
      id: 208
      score: 3
      confidence: "L"
      binding: false
      summary: "Scale validation needed"

    - name: "Cognitive"
      id: 209
      score: 4
      confidence: "H"
      binding: false
      summary: "System maintainable by team"

    - name: "Dependency"
      id: 210
      score: 3
      confidence: "M"
      binding: false
      summary: "Most dependencies confirmed, Mars API uncertain"

  profile_metrics:
    average: 3.3
    minimum: 2
    maximum: 4
    std_deviation: 0.64
    binding_constraint: "Temporal"

    distribution:
      score_5: 0
      score_4: 4
      score_3: 5
      score_2: 1
      score_1: 0

    confidence_summary:
      high: 4
      medium: 4
      low: 2

  visualization: |
    Technical      ████████░░ 4/5 (H)
    Resource       ██████░░░░ 3/5 (M)
    Knowledge      ████████░░ 4/5 (H)
    Organizational ██████░░░░ 3/5 (M)
    Temporal       ████░░░░░░ 2/5 (L) ← BINDING
    Compositional  ██████░░░░ 3/5 (M)
    Economic       ████████░░ 4/5 (H)
    Scale          ██████░░░░ 3/5 (L)
    Cognitive      ████████░░ 4/5 (H)
    Dependency     ██████░░░░ 3/5 (M)

  binding_analysis:
    primary_binding: "Temporal"
    primary_score: 2
    primary_confidence: "L"
    impact: "Overall feasibility capped at 2"

    secondary_constraints:
      - dimension: "Resource"
        score: 3
      - dimension: "Scale"
        score: 3
        note: "Low confidence adds risk"
      - dimension: "Dependency"
        score: 3
        note: "Mars API is critical path"

  conditions_to_improve:
    - condition: "Extend timeline by 6 weeks"
      impact: "Temporal → 3, Overall → 3"
      confidence: "M"

    - condition: "Reduce scope (Phase 1 only)"
      impact: "Temporal → 3, Scale → 4, Overall → 3"
      confidence: "H"

    - condition: "Validate Mars API access"
      impact: "Dependency → 4"
      confidence: "Depends on Mars"

  recommendations:
    - "Address temporal constraint before commitment"
    - "Validate scale assumptions with spike"
    - "Confirm Mars API access"
    - "Consider phased approach to improve feasibility"
```

## Integration Points

- **Feeds from:** All Phase 2 dimension assessments
- **Feeds to:** #402 Decision, #403 Conditional map, executive summary

## Common Pitfalls

- **Averaging trap:** Using average instead of minimum
- **Ignoring confidence:** High score with low confidence ≠ high feasibility
- **Optimism in aggregation:** "Most dimensions are good" when one is critical
- **Single dimension focus:** Only looking at familiar dimensions
