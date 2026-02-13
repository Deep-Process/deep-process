# #402 Confidence-Weighted Decision

**Phase:** 4 (DECIDE)
**Tier:** 1 — Mandatory
**Purpose:** Make GO/NO-GO decision accounting for uncertainty

## Theoretical Foundation

A feasibility score without confidence is meaningless. "Score 4 with low confidence" could actually be anywhere from 2-5. Decisions must weight both the score AND the confidence in that score.

**Key insight:** Confidence determines how much to trust the score. Low confidence = wider range of actual outcomes = more risk.

## Decision Matrix

| Score | Confidence | Decision |
|-------|------------|----------|
| 4-5 | H | **GO** |
| 4-5 | M | GO with monitoring |
| 4-5 | L | INVESTIGATE (validate assumptions) |
| 3 | H | **CONDITIONAL GO** |
| 3 | M | CONDITIONAL GO with validation |
| 3 | L | INVESTIGATE |
| 2 | H | NO-GO unless scope reduces |
| 2 | M | **NO-GO** or major pivot |
| 2 | L | **INVESTIGATE** (can't decide yet) |
| 1 | Any | **NO-GO** |

## Step-by-step

### Step 1: Input From Profile

From #401 Multi-Axis Profile:

```
Overall Score: 2
Overall Confidence: L
Binding Constraint: Temporal

This places us in: Score 2, Confidence L → INVESTIGATE
```

### Step 2: Assess Confidence Sources

Why is confidence low?

```
CONFIDENCE ANALYSIS:

Temporal (Score 2, Confidence L):
- Estimate based on similar projects? No
- Team experience with this tech? Limited
- External dependencies validated? No
- Contingency included? No

→ Confidence is low because: Estimate is largely aspirational

Scale (Score 3, Confidence L):
- Tested at production scale? No
- Similar scale achieved before? Not internally
- Vendor guarantees? Yes, but not our specific use case

→ Confidence is low because: No empirical validation
```

### Step 3: Calculate Effective Range

For low confidence scores, estimate the actual range:

```
EFFECTIVE RANGE CALCULATION:

Score 2 + Confidence L:
- Optimistic interpretation: 3 (could be underestimating)
- Pessimistic interpretation: 1 (could be worse)
- Effective range: 1-3
- Expected value: ~2

Score 3 + Confidence L:
- Optimistic: 4
- Pessimistic: 2
- Effective range: 2-4
- Expected value: ~3
```

### Step 4: Determine Decision Path

```
DECISION PATH:

Current position: Score 2, Confidence L
Matrix says: INVESTIGATE

What INVESTIGATE means:
□ Don't commit yet
□ Reduce key uncertainties
□ Revisit decision after investigation

Investigation needed:
1. Temporal: Validate timeline with detailed planning
2. Scale: Run performance spike
3. Dependency: Confirm Mars API access

Decision after investigation:
- If investigation positive → CONDITIONAL GO
- If investigation negative → NO-GO
- If investigation mixed → Re-assess
```

### Step 5: Define GO/NO-GO Criteria

Make decision criteria explicit:

```
GO CRITERIA (all must be true):
□ Overall score ≥ 3 with confidence ≥ M
□ No dimension ≤ 2 with confidence L
□ Binding constraint has clear resolution path
□ Critical assumptions validated

NO-GO CRITERIA (any is sufficient):
□ Overall score ≤ 2 with confidence H (definitely infeasible)
□ Binding constraint unresolvable
□ Economic infeasibility confirmed
□ Hard deadline impossible to meet

CONDITIONAL GO CRITERIA:
□ Score = 3 with specific conditions identified
□ Conditions are achievable
□ Fallback exists if conditions fail
```

### Step 6: Weight by Confidence

Apply confidence weighting to decision:

```
CONFIDENCE-WEIGHTED SCORING:

High confidence scores: Count at face value
Medium confidence scores: Apply 0.8× multiplier
Low confidence scores: Apply 0.6× multiplier

Example:
Technical: 4 × H(1.0) = 4.0
Resource: 3 × M(0.8) = 2.4
Temporal: 2 × L(0.6) = 1.2 ← CRITICAL

Weighted overall: 3.3 × 0.8 average = 2.6 effective
```

### Step 7: Make Recommendation

| Score | Confidence | Recommendation |
|-------|----------|----------------|
| 5 | Full confidence | Proceed immediately |
| 4 | Good confidence | Proceed with standard oversight |
| 3 | Medium confidence | Proceed with conditions & checkpoints |
| 2 | Low confidence | Investigate before committing |
| 1 | Cannot recommend | Stop or fundamentally redesign |

## Output format

```yaml
confidence_weighted_decision:
  decision: "INVESTIGATE"
  confidence_in_decision: "M"

  input_summary:
    overall_score: 2
    overall_confidence: "L"
    binding_constraint: "Temporal"
    binding_score: 2
    binding_confidence: "L"

  confidence_analysis:
    low_confidence_dimensions:
      - dimension: "Temporal"
        score: 2
        why_low: "Estimate not based on precedent, aspirational"
        effective_range: "1-3"
        investigation_needed: "Detailed planning with historical calibration"

      - dimension: "Scale"
        score: 3
        why_low: "No empirical validation"
        effective_range: "2-4"
        investigation_needed: "Performance spike at production scale"

    medium_confidence_dimensions:
      - dimension: "Resource"
        score: 3
        why_medium: "Verbal commitments, not contracted"
        risk: "Team availability could change"

    high_confidence_dimensions:
      - dimension: "Technical"
        score: 4
        why_high: "Proven technology, validated architecture"

      - dimension: "Economic"
        score: 4
        why_high: "Clear ROI calculation, budget approved"

  effective_ranges:
    - dimension: "Temporal"
      score: 2
      confidence: "L"
      effective_range: "1-3"
      expected_value: 2.0

    - dimension: "Scale"
      score: 3
      confidence: "L"
      effective_range: "2-4"
      expected_value: 2.8

    - dimension: "Resource"
      score: 3
      confidence: "M"
      effective_range: "2-4"
      expected_value: 2.8

  weighted_calculation:
    method: "Confidence multiplier (H=1.0, M=0.8, L=0.6)"
    weighted_scores:
      Technical: 4.0
      Resource: 2.4
      Knowledge: 4.0
      Organizational: 2.4
      Temporal: 1.2
      Compositional: 2.4
      Economic: 4.0
      Scale: 1.8
      Cognitive: 4.0
      Dependency: 2.4
    weighted_average: 2.86
    effective_binding: 1.2

  decision_matrix_position:
    score: 2
    confidence: "L"
    matrix_result: "INVESTIGATE"
    meaning: "Cannot make confident GO/NO-GO decision yet"

  go_criteria:
    - criterion: "Overall score ≥ 3"
      current: 2
      met: false

    - criterion: "Confidence ≥ M on binding constraint"
      current: "L"
      met: false

    - criterion: "Critical assumptions validated"
      current: "Partial"
      met: false

  investigation_plan:
    required_before_decision:
      - investigation: "Detailed timeline planning"
        purpose: "Raise Temporal confidence"
        duration: "1 week"
        success_criteria: "Timeline based on historical data"

      - investigation: "Performance spike"
        purpose: "Validate Scale assumption"
        duration: "3 days"
        success_criteria: "100M records, <30s query"

      - investigation: "Mars API access confirmation"
        purpose: "Validate Dependency"
        duration: "1 week"
        success_criteria: "Written commitment with date"

    decision_timeline: "Re-assess in 2 weeks"

  scenarios:
    - scenario: "Investigation successful"
      probability: "60%"
      outcome: "CONDITIONAL GO"
      conditions:
        - "Extended timeline (12 months)"
        - "Phased approach"

    - scenario: "Timeline cannot improve"
      probability: "25%"
      outcome: "NO-GO or scope reduction"
      fallback: "Phase 1 only, extend timeline"

    - scenario: "Scale validation fails"
      probability: "15%"
      outcome: "Architecture redesign needed"
      fallback: "Alternative approach or NO-GO"

  recommendation:
    decision: "INVESTIGATE"
    rationale: "Cannot make confident GO/NO-GO with current uncertainty"
    next_steps:
      - "Complete investigation plan (2 weeks)"
      - "Re-run feasibility assessment"
      - "Make final decision with improved confidence"

    if_forced_decision_now:
      decision: "NO-GO"
      rationale: "Insufficient confidence in binding constraint"
      risk: "High probability of timeline failure"
```

## Integration Points

- **Feeds from:** #401 Multi-Axis Profile
- **Feeds to:** Executive decision, #403 Conditional map, project planning

## Common Pitfalls

- **Ignoring confidence:** Deciding based on score alone
- **Confidence theater:** Claiming high confidence without evidence
- **Analysis paralysis:** Investigating indefinitely
- **Premature commitment:** Deciding before critical uncertainties resolved
- **Binary thinking:** Only GO or NO-GO, ignoring CONDITIONAL and INVESTIGATE
