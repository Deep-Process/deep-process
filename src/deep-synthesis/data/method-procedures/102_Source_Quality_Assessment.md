# 102 - Source Quality Assessment

## Phase
ACQUIRE

## Purpose
Not all sources are equal. Assess quality to weight contributions appropriately during synthesis. Poor-quality sources given equal weight distort synthesis.

## Quality Dimensions

| Dimension | Question | Rating |
|-----------|----------|--------|
| **Reliability** | Is the source consistently accurate? Track record? | H/M/L |
| **Validity** | Does it measure/describe what it claims to? | H/M/L |
| **Recency** | Is the information current? | H/M/L |
| **Methodology** | Was information gathered rigorously? | H/M/L |
| **Bias** | Does the source have systematic distortion? | None/Low/High |
| **Completeness** | Does it cover its claimed scope? | H/M/L |
| **Provenance** | Can we trace where the information came from? | Clear/Partial/Unknown |

## Quality Grades

| Grade | Meaning | Synthesis Weight |
|-------|---------|------------------|
| **A** | High confidence — strong on most dimensions | Weight heavily |
| **B** | Moderate confidence — adequate on most dimensions | Standard weight |
| **C** | Use with caution — significant limitations | Note limitations |
| **D** | Unreliable — major concerns | Use only for triangulation |

## Procedure

### Step 1: Dimension Rating
For each source: rate on all 7 dimensions
- Use H/M/L or specific scale
- Document reasoning

### Step 2: Overall Grade Assignment
Assign grade A/B/C/D based on dimension ratings
- No single formula — judgment required
- Consider which dimensions matter most for this synthesis

### Step 3: Weight Assignment
Determine weight in synthesis
- Higher quality = higher weight
- Document weight assignments

### Step 4: Red Flag Check
**RED FLAG:** If ALL high-quality sources agree but a low-quality source disagrees...
- INVESTIGATE the disagreement before dismissing it
- The dissenter may have access to information others don't

## Output Schema
```yaml
source_quality:
  - source_id: "S1"
    dimensions:
      reliability: "H/M/L"
      validity: "H/M/L"
      recency: "H/M/L"
      methodology: "H/M/L"
      bias: "None/Low/High"
      completeness: "H/M/L"
      provenance: "Clear/Partial/Unknown"
    grade: "A/B/C/D"
    weight_in_synthesis: "[numeric or descriptive]"
    notes: "[Any special considerations]"
```

## Quality Checks
- [ ] All dimensions rated for each source
- [ ] Grades assigned with reasoning
- [ ] Weights determined
- [ ] Dissenting low-quality sources investigated, not dismissed
- [ ] Quality distribution documented

## Connections
- Uses: #101 (Source Collection)
- Feeds into: #204 (Evidence Grading)
- Grounded in: Meta-Analysis (Glass, 1976)
