# #505 Meta-Feasibility Check

**Phase:** META (Continuous)
**Tier:** 1 — Mandatory
**Purpose:** Check that the feasibility assessment itself is valid

## Theoretical Foundation

A feasibility assessment can itself be flawed. Meta-feasibility asks: "Is this assessment valid?" Check for completeness, consistency, bias, and whether the assessment process itself was feasible.

**Key insight:** An incomplete, biased, or rushed assessment may be worse than no assessment — it provides false confidence in a flawed conclusion.

## Meta-Feasibility Questions

| Question | What It Checks |
|----------|---------------|
| **Complete?** | Were all dimensions assessed? |
| **Consistent?** | Do conclusions follow from evidence? |
| **Current?** | Is information still valid? |
| **Independent?** | Was assessment influenced by desired outcome? |
| **Sufficient depth?** | Was enough investigation done? |
| **Assumptions explicit?** | Are hidden assumptions surfaced? |

## Step-by-step

### Step 1: Check Completeness

Were all required dimensions assessed?

```
COMPLETENESS CHECK:

Required dimensions (Tier 1):
□ Technical (201) — ✓ Complete
□ Resource (202) — ✓ Complete
□ Knowledge (203) — ✓ Complete
□ Organizational (204) — ⚠ Partial
□ Temporal (205) — ✓ Complete
□ Compositional (206) — ✓ Complete
□ Economic (207) — ✓ Complete
□ Scale (208) — ⚠ Needs validation
□ Cognitive (209) — ✓ Complete
□ Dependency (210) — ✓ Complete

Completeness: 80% full, 20% partial
Gap: Organizational and Scale need more depth
```

### Step 2: Check Consistency

Do conclusions follow from evidence?

```
CONSISTENCY CHECK:

Claim: "Technical feasibility is HIGH (4/5)"
Evidence provided:
□ Architecture design reviewed? Yes
□ Technology validated? Partially
□ Integration tested? No
□ Scale proven? No

Question: Does evidence support HIGH confidence?
Answer: No — evidence supports MEDIUM at best

Inconsistency detected: Score-evidence mismatch
```

### Step 3: Check Currency

Is the assessment still valid?

```
CURRENCY CHECK:

Assessment date: 2024-01-15
Current date: 2024-02-01
Time elapsed: 2 weeks

Changes since assessment:
□ Scope changes? No
□ Team changes? No
□ External factors? Mars API delayed
□ New information? Spike completed (positive)

Currency status: PARTIALLY STALE
Update needed: Dependency dimension (Mars delay)
```

### Step 4: Check Independence

Was assessment influenced by desired outcome?

```
INDEPENDENCE CHECK:

Desired outcome: Project approved
Assessment result: CONDITIONAL GO

Influence checks:
□ Assessor has stake in outcome? Yes — project team
□ Pressure to approve? Yes — stakeholder expectations
□ Contradictory evidence suppressed? Not detected
□ Uncertainty downplayed? Possibly (confidence ratings high)
□ Alternative outcomes considered? Limited

Independence: COMPROMISED
Risk: Assessment may be biased toward approval
Mitigation: Independent review recommended
```

### Step 5: Check Depth Sufficiency

Was the assessment thorough enough?

```
DEPTH SUFFICIENCY CHECK:

Assessment depth: STANDARD

For project complexity: HIGH (novel integration, external dependencies)
Required depth: COMPREHENSIVE

Depth gap: Assessment less thorough than complexity requires

Missing at this depth:
□ Integration spike not completed
□ Expert judgment not calibrated
□ Reference class not fully analyzed
□ Conditions not fully mapped

Sufficiency: INSUFFICIENT for project complexity
```

### Step 6: Check Assumption Transparency

Are assumptions explicit?

```
ASSUMPTION TRANSPARENCY CHECK:

Explicit assumptions:
□ Timeline assumes no scope changes
□ Resources assumes verbal commitments honored
□ Technical assumes spike validates architecture

Hidden assumptions found:
□ Stakeholder alignment (not tested)
□ Vendor stability (not checked)
□ Market conditions (not considered)
□ Team continuity (assumed but not stated)

Transparency: PARTIAL
Hidden assumptions: 4 found
Action: Make explicit and assess
```

### Step 7: Score Meta-Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Assessment complete, consistent, current, independent, sufficient, transparent |
| 4 | Minor gaps in one area |
| 3 | Gaps in multiple areas, conclusions still reasonable |
| 2 | Significant gaps, conclusions uncertain |
| 1 | Assessment fundamentally flawed, should not be trusted |

## Output format

```yaml
meta_feasibility_check:
  score: 3
  confidence: "M"
  verdict: "Assessment has gaps — conclusions directionally correct but uncertain"

  completeness:
    score: 4
    dimensions_required: 10
    dimensions_complete: 8
    dimensions_partial: 2

    gaps:
      - dimension: "Organizational"
        status: "Partial"
        missing: "Change management assessment"
        impact: "Medium"

      - dimension: "Scale"
        status: "Partial"
        missing: "Empirical validation"
        impact: "High"

  consistency:
    score: 3

    inconsistencies:
      - claim: "Technical feasibility HIGH (4/5)"
        evidence: "Integration not tested"
        resolution: "Should be MEDIUM until spike completes"

      - claim: "Resource confidence HIGH"
        evidence: "Only verbal commitments"
        resolution: "Should be MEDIUM"

    evidence_gaps:
      - "Integration not validated"
      - "Scale not tested"
      - "Mars API access not confirmed"

  currency:
    score: 4
    assessment_date: "2024-01-15"
    review_date: "2024-02-01"
    elapsed: "2 weeks"

    changes_since:
      - change: "Mars API delayed"
        impact: "Dependency dimension affected"
        update_needed: true

      - change: "Synapse spike completed"
        impact: "Scale partially validated"
        update_needed: true

    staleness: "Partial"
    update_priority: "Medium"

  independence:
    score: 2

    checks:
      - check: "Assessor stake in outcome"
        result: true
        note: "Project team performed assessment"

      - check: "Pressure to approve"
        result: true
        note: "Stakeholder expectations visible"

      - check: "Contradictory evidence suppressed"
        result: false
        note: "Not detected"

      - check: "Uncertainty downplayed"
        result: "Possibly"
        note: "Confidence ratings seem high given evidence"

    assessment: "Compromised"
    recommendation: "Independent review recommended"

  depth_sufficiency:
    score: 3

    project_complexity: "High"
    required_depth: "Comprehensive"
    actual_depth: "Standard"

    missing_for_depth:
      - "Integration spike (in progress)"
      - "Full reference class analysis"
      - "Expert judgment calibration"
      - "Complete condition mapping"

    assessment: "Depth insufficient for complexity"
    recommendation: "Complete spikes before final decision"

  assumption_transparency:
    score: 3

    explicit_assumptions: 12
    hidden_assumptions_found: 4

    hidden_assumptions:
      - assumption: "Stakeholder alignment sustained"
        made_explicit: true
        assessment_needed: true

      - assumption: "Vendor remains viable"
        made_explicit: true
        assessment_needed: false

      - assumption: "Market conditions stable"
        made_explicit: true
        assessment_needed: false

      - assumption: "Team continuity"
        made_explicit: true
        assessment_needed: true

  process_quality:
    methods_applied:
      tier_1: "8 of 10"
      tier_2: "3 of 8"
      tier_3: "1 of 4"
      meta: "4 of 5"

    coverage: "65%"
    gaps:
      - "#302 Critical Assumption Testing — Incomplete"
      - "#304 Expert Judgment Calibration — Not done"
      - "#305 Analogical Transfer — Partial"

  overall_assessment:
    validity: "Partial"

    strengths:
      - "All dimensions addressed at some level"
      - "Key risks identified"
      - "Conditions clearly stated"

    weaknesses:
      - "Independence compromised"
      - "Depth insufficient for complexity"
      - "Some inconsistencies unresolved"

    confidence_in_assessment: "Medium"

  recommendations:
    immediate:
      - "Complete integration spike"
      - "Resolve score-evidence inconsistencies"
      - "Update for Mars delay"

    before_decision:
      - "Independent review of assessment"
      - "Complete Tier 2 methods"
      - "Validate hidden assumptions"

    process_improvement:
      - "Use independent assessor for high-stakes projects"
      - "Match depth to complexity"
      - "Explicit assumption tracking from start"

  meta_verdict:
    can_trust_assessment: "With caveats"
    caveats:
      - "Discount confidence levels by one"
      - "Complete spikes before commitment"
      - "Get independent review"

    if_decision_forced_now:
      recommendation: "CONDITIONAL GO with low confidence"
      risk: "Assessment gaps may hide feasibility issues"
```

## Integration Points

- **Applies to:** Entire assessment
- **Feeds to:** Final decision, assessment improvement

## Common Pitfalls

- **Skipping meta-check:** Assuming assessment is valid
- **Self-review:** Assessors checking their own work
- **Meta-theater:** Going through motions without real evaluation
- **Perfect paralysis:** Refusing to decide because assessment isn't perfect
- **Ignoring findings:** Noting gaps but not addressing them
