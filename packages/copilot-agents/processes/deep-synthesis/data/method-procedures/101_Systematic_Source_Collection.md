# 101 - Systematic Source Collection

## Phase
ACQUIRE

## Purpose
Structured gathering of sources that covers the landscape mapped in #003. Ensures no major source type is missed and includes dissenting sources.

## Hegelian Principle
> Contradiction is not a problem to eliminate — it is the ENGINE of synthesis.
> Sources that DISAGREE are MORE VALUABLE than sources that agree.

## Procedure

### Step 1: Coverage Planning
From landscape map (#003): list all source types needed
- Prioritize by relevance to synthesis question
- Note which types are critical vs nice-to-have

### Step 2: Source Identification
For each type: identify specific sources
- Name the actual documents, people, datasets
- Note expected contribution of each

### Step 3: Disagreement Hunting
Include sources expected to DISAGREE
- Actively seek dissenting views
- These are the most valuable for synthesis

### Step 4: Saturation Assessment
Set a boundary: when to STOP collecting
- Saturation heuristic: When new sources add >80% redundant information
- EXCEPTION: A DISSENTING source is NEVER redundant

### Step 5: Source List Finalization
Compile the source list with metadata
- Expected contribution
- Expected position (agreeing/dissenting)
- Priority for collection

## Depth Adjustments
- **Quick:** 2-5 sources, focus on highest-value
- **Standard:** 5-15 sources, cover landscape
- **Rigorous:** 10-30 sources, comprehensive coverage
- **Comprehensive:** Full landscape coverage

## Output Schema
```yaml
sources:
  - source_id: "S1"
    name: "[Source name]"
    type: "[Source type from #003]"
    description: "[What this source contains]"
    expected_contribution: "[What we expect to learn]"
    expected_position: "agreeing/dissenting/unknown"
    priority: "P1/P2/P3"
saturation_check:
  status: "not_reached/reached"
  redundancy_level: "[percentage]"
```

## Quality Checks
- [ ] All critical source types covered
- [ ] At least one dissenting source included
- [ ] Expected contributions documented
- [ ] Saturation point considered
- [ ] No obvious gaps in landscape coverage

## Connections
- Uses: #003 (Source Landscape)
- Feeds into: #102 (Quality Assessment), #103 (Diversity Verification)
- Related to: Triangulation (Denzin)
