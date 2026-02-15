# 406 - Boundary Condition Mapping

## Phase
INTEGRATE

## Purpose
Define WHERE the synthesis applies and where it doesn't. Every synthesis has scope limits — making them explicit prevents misapplication and false confidence outside the valid domain.

## Core Principle
> A synthesis without explicit boundaries is dangerous.
> It invites extrapolation beyond where conclusions are valid.
> Boundaries are not limitations — they are PRECISION.

## Boundary Types

| Type | Question | Example |
|------|----------|---------|
| **Scale** | At what scale does this hold? | "Works for N<1000 but breaks at N>1M" |
| **Context** | In what environments? | "Valid in cloud but not on-prem" |
| **Temporal** | When is this true? | "True now but may change when X happens" |
| **Domain** | Which fields/areas? | "Works for data engineering but not ML engineering" |
| **Organizational** | What organization types? | "Works for small teams but not enterprises" |
| **Technical** | What technical conditions? | "Requires version 3.0+ of the platform" |
| **Methodological** | Under what methods? | "Holds for quantitative analysis but not qualitative" |
| **Epistemic** | At what certainty level? | "Strong evidence in X, weak evidence in Y" |

## Procedure

### Step 1: Conclusion Inventory
List all synthesis conclusions
- From #401 dialectical syntheses
- From #402 unified framework
- From #403 emergent insights
- From #404 abductive conclusions

### Step 2: Boundary Identification
For each conclusion: define boundaries by type
- Walk through each boundary type
- Ask "Under what conditions does this hold?"
- Document both valid range and invalid range

### Step 3: Outside-Boundary Behavior
For each boundary: what happens OUTSIDE?
- **Gradual degradation:** Conclusion becomes less accurate
- **Complete failure:** Conclusion is wrong outside boundary
- **Unknown:** No data on what happens outside
- **Reversal:** Conclusion may reverse outside boundary

### Step 4: Extrapolation Risk Assessment
Rate risk of applying synthesis beyond boundaries
- How likely are users to extrapolate?
- What would be the impact of invalid extrapolation?
- How visible are the boundaries?

### Step 5: Boundary Documentation
Create explicit boundary documentation
- Include in synthesis output
- Make boundaries as prominent as conclusions
- Provide examples of valid vs invalid application

## Output Schema
```yaml
boundaries:
  - conclusion_id: "CON1"
    conclusion: "[The conclusion]"
    boundaries:
      - type: "scale/context/temporal/domain/organizational/technical/methodological/epistemic"
        valid_range: "[Where it applies]"
        invalid_range: "[Where it doesn't apply]"
        outside_behavior: "gradual_degradation/complete_failure/unknown/reversal"
        confidence_in_boundary: "high/medium/low"
    extrapolation_risk:
      likelihood: "high/medium/low"
      impact: "high/medium/low"
      risk_rating: "high/medium/low"
    boundary_examples:
      valid_application: "[Example of correct use]"
      invalid_application: "[Example of misuse]"
  boundary_summary:
    most_critical_boundaries:
      - "[Boundary that, if violated, causes most harm]"
    universal_limitations:
      - "[Boundaries that apply to all conclusions]"
```

## Example

```
Conclusion: "Data mesh architecture improves team autonomy and data quality"

Boundaries:
├── Scale: Organizations with 5+ data-producing teams
│   └── Outside: <5 teams → overhead outweighs benefit
├── Organizational: Mature DevOps culture required
│   └── Outside: Traditional ops → mesh fails
├── Technical: Modern data stack (cloud, APIs)
│   └── Outside: Legacy systems → integration nightmare
├── Temporal: Valid 2023-2025
│   └── Outside: Architecture paradigms shift

Outside behavior:
├── <5 teams: Gradual degradation (overhead increases)
├── No DevOps: Complete failure (teams can't self-serve)
├── Legacy: Unknown (limited case studies)

Extrapolation risk: HIGH
├── "Data mesh" is trendy
├── Many will adopt without checking fit
├── Impact of failed adoption: significant
```

## Boundary Discovery Questions

### Scale Boundaries
- At what scale was this observed?
- What happens at 10×? 100×?
- Is there a threshold effect?

### Context Boundaries
- In what environment was this observed?
- What contextual factors might matter?
- What contexts are explicitly NOT represented?

### Temporal Boundaries
- When was this observed?
- What might change over time?
- Is there a "shelf life" on this conclusion?

### Domain Boundaries
- In what domain was this observed?
- Does it transfer to adjacent domains?
- What domain-specific assumptions are embedded?

### Organizational Boundaries
- What organization types contributed to sources?
- Size? Industry? Culture?
- What organizations are NOT represented?

## Quality Checks
- [ ] All major conclusions have boundaries defined
- [ ] Each boundary type considered
- [ ] Outside-boundary behavior documented
- [ ] Extrapolation risk assessed
- [ ] Examples of valid/invalid application provided
- [ ] Boundaries are prominent in synthesis output

## Warning
> **Extrapolation warning:** Applying synthesis beyond its boundaries without validation is a common source of FALSE COHERENCE.
> Boundaries are not defensive hedging — they are PRECISION about what we actually know.

## Connections
- Uses: All integration methods (#401-404)
- Feeds into: #407 (Coherence Check), #501 (Core Insight), final output
- Prevents: Over-generalization, false confidence
- Critical: Boundaries = synthesis precision
