# 307 - Level Alignment Check

## Phase
RELATE

## Purpose
Ensure that when combining claims from different sources, they're operating at the SAME level of analysis. Mixing levels produces invalid synthesis and is a source of major logical fallacies.

## Theoretical Foundation
> **Simpson's Paradox:** A trend that appears in aggregated data can reverse when data is disaggregated.
> **Ecological Fallacy:** Inferring individual behavior from group-level statistics.
> **Atomistic Fallacy:** Inferring group behavior from individual-level data.

## Levels of Analysis (from #002)

| Level | Abstraction | Example | Danger |
|-------|------------|---------|--------|
| **Atomic** | Individual facts, events, data points | "Server X crashed at 14:32" | Can't generalize |
| **Pattern** | Recurring relationships across atoms | "Crashes correlate with memory pressure" | Correlation ≠ causation |
| **Structural** | Underlying mechanisms and models | "Memory leak in service Y causes cascading failures" | Model may not match reality |
| **Systemic** | System-wide dynamics and behaviors | "Our incident response is reactive" | May not apply to every subsystem |
| **Paradigmatic** | Fundamental assumptions and worldviews | "We treat reliability as a feature" | Hard to detect from inside |

## Procedure

### Step 1: Claim Level Assignment
For each claim being synthesized: determine its level
- Use the level framework from #002
- Be precise — "this claim applies at the X level"

### Step 2: Pairwise Level Comparison
For claims being COMBINED: check level alignment
- Are both claims at the same level?
- If not, what's the level difference?

### Step 3: Fallacy Risk Assessment
Check for level-mixing fallacies
- **Ecological fallacy risk:** Generalizing from aggregate to individual
- **Atomistic fallacy risk:** Generalizing from individual to aggregate
- **Simpson's Paradox risk:** Aggregate trend may not hold in subgroups

### Step 4: Cross-Level Inference Documentation
When levels don't match: document the inference
- What cross-level inference is being made?
- Is it justified?
- What caveats are needed?

### Step 5: Caveat Generation
For misaligned combinations: generate explicit caveats
- "This pattern-level finding may not apply to every atomic instance"
- "This individual case may not generalize to the population"

## Output Schema
```yaml
level_checks:
  - claim_pair_id: "LP1"
    claim_a:
      claim_id: "C1"
      level: "atomic/pattern/structural/systemic/paradigmatic"
    claim_b:
      claim_id: "C2"
      level: "atomic/pattern/structural/systemic/paradigmatic"
    aligned: true/false
    if_misaligned:
      level_difference: "[Description of difference]"
      fallacy_risks:
        ecological: true/false
        atomistic: true/false
        simpsons: true/false
      cross_level_inference: "[What inference is being made]"
      justified: true/false
      caveat: "[Required caveat for synthesis]"
level_summary:
  total_pairs_checked: N
  aligned: N
  misaligned_with_valid_inference: N
  misaligned_with_fallacy_risk: N
```

## Red Flags

### Ecological Fallacy Indicators
- "Groups that X tend to Y, therefore individuals who X tend to Y"
- Applying statistical patterns to individual predictions
- Using national/regional data to explain local behavior

### Atomistic Fallacy Indicators
- "This case shows X, therefore all cases are X"
- Generalizing from one project to all projects
- Extrapolating from single observation to rule

### Simpson's Paradox Indicators
- Aggregate data shows one trend
- But subgroup data might show opposite
- Risk especially when combining heterogeneous sources

## Resolution Strategies

### When Levels Don't Match
1. **Align up:** Abstract the lower-level claim to higher level (with caveats)
2. **Align down:** Specify the higher-level claim to lower level (with caveats)
3. **Keep separate:** Don't combine — report findings at their native levels
4. **Explicit cross-level:** Document the cross-level inference with full caveats

### Valid Cross-Level Inferences
- Structural claim explains pattern-level observation
- Systemic dynamic produces atomic manifestations
- But: always requires mechanism, not just correlation

## Quality Checks
- [ ] All claims have assigned levels
- [ ] Pairwise combinations checked for alignment
- [ ] Fallacy risks identified
- [ ] Cross-level inferences documented
- [ ] Caveats generated for misaligned combinations

## Connections
- Uses: #002 (Level-of-Analysis Selection), #201 (Claims)
- Feeds into: #401 (Dialectical Integration), #407 (Coherence Check)
- Prevents: Ecological fallacy, Atomistic fallacy, Simpson's Paradox
- Critical for: Logically valid synthesis
