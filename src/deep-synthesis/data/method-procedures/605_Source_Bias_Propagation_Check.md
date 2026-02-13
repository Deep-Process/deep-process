# 605 - Source Bias Propagation Check

## Phase
META (continuous)

## Purpose
Assess whether biases in individual sources have propagated into the synthesis. Even quality-assessed sources carry biases — and synthesis can AMPLIFY them if most sources share the same bias.

## Key Insight
> Individual source biases can cancel out (if diverse) or AMPLIFY (if aligned).
> Synthesis from biased sources may be MORE biased than any single source.

## Common Bias Types

| Bias Type | Mechanism | Synthesis Impact |
|-----------|-----------|------------------|
| **Survivorship** | Only successful cases reported | Overestimates success rates |
| **Publication** | Only positive results published | Overestimates effect sizes |
| **Selection** | Sources selected to confirm hypothesis | Circular validation |
| **Recency** | Recent sources overweighted | Temporal myopia |
| **Authority** | High-status sources overweighted | Misses practitioner insight |
| **Cultural** | Dominant culture assumed universal | Limited generalizability |
| **Methodological** | One method dominates | Method-specific conclusions |
| **Commercial** | Vendor sources overrepresented | Solution-biased conclusions |
| **Optimism** | Sources systematically optimistic | Underestimates challenges |
| **Expert** | Expert sources dominate | Misses beginner perspective |

## Procedure

### Step 1: Bias Type Inventory
For each bias type: check if source set is affected
- Review #102 (Source Quality) for bias indicators
- Review #103 (Diversity) for bias clustering

### Step 2: Bias Prevalence Assessment
For affected biases: how prevalent?
- What percentage of sources share this bias?
- Are biased sources the high-quality ones?

### Step 3: Synthesis Impact Assessment
For prevalent biases: how does it affect conclusions?
- Which conclusions are influenced by this bias?
- In what direction does it push the synthesis?

### Step 4: Mitigation Assessment
Was bias mitigated during synthesis?
- Did diversity of sources counteract bias?
- Were counter-sources sought?
- Was bias explicitly addressed?

### Step 5: Correction or Acknowledgment
For biases that propagated:
- **Correct:** If possible, adjust conclusions
- **Acknowledge:** Document bias influence in output

## Output Schema
```yaml
bias_propagation_check:
  bias_assessment:
    - bias_type: "survivorship/publication/selection/recency/authority/cultural/methodological/commercial/optimism/expert"
      affected: true/false
      if_affected:
        prevalence: "high/medium/low"
        percentage_of_sources: "X%"
        affected_sources: ["S1", "S2"]
        synthesis_impact:
          conclusions_affected: ["CON1", "CON2"]
          direction_of_bias: "[How bias pushes conclusions]"
        mitigation:
          mitigated: true/false
          mitigation_method: "[How mitigated]"
        residual_effect: "significant/minor/none"
      correction_or_acknowledgment:
        action: "corrected/acknowledged/none_needed"
        details: "[What was done]"
  summary:
    biases_checked: N
    biases_present: N
    biases_with_significant_effect: N
    mitigated: N
    acknowledged_in_output: N
    overall_bias_risk: "low/medium/high"
```

## Bias Detection Questions

### Survivorship Bias
- Are failure cases represented in sources?
- Do sources only describe successes?
- What would failure cases tell us?

### Publication Bias
- Are null results included?
- Are sources only reporting positive findings?
- What unpublished information might exist?

### Selection Bias
- Were sources gathered systematically?
- Were sources selected to confirm expectations?
- What sources were NOT selected?

### Recency Bias
- Are historical perspectives included?
- Are recent sources overweighted?
- What long-term patterns might be missed?

### Authority Bias
- Are practitioner perspectives included?
- Are only expert/academic sources used?
- What ground-level knowledge might be missing?

### Cultural Bias
- Are diverse cultural perspectives represented?
- Is one cultural context assumed universal?
- What context-specific insights might be missed?

### Methodological Bias
- Are multiple methods represented?
- Is one methodology dominant?
- What would different methods reveal?

### Commercial Bias
- Are vendor sources balanced with independent sources?
- Do commercial interests align across sources?
- What would disinterested parties say?

## Bias Interaction Effects

Multiple biases can compound:
- Survivorship + Publication = Extreme positive bias
- Authority + Cultural = Western expert dominance
- Selection + Confirmation = Circular validation

Check for compounding effects when multiple biases present.

## Mitigation Strategies

### Diversity Solution
- Ensure diverse sources (different biases cancel)
- Apply #103 Diversity Verification

### Counter-Source Solution
- Actively seek counter-biased sources
- Apply #105 Counter-Source Search

### Weighting Solution
- Adjust synthesis weights for known bias
- Downweight biased sources

### Acknowledgment Solution
- When bias can't be corrected, acknowledge explicitly
- Note direction and magnitude of bias effect

## Quality Checks
- [ ] All bias types systematically checked
- [ ] Prevalence assessed for affected biases
- [ ] Synthesis impact evaluated
- [ ] Mitigation assessed
- [ ] Corrections applied where possible
- [ ] Residual biases acknowledged
- [ ] Overall bias risk rated

## When to Apply
- **Required for:** All synthesis depths
- **Critical for:** Policy/decision synthesis
- **Especially when:** Sources from similar contexts

## Connections
- Uses: #102 (Source Quality), #103 (Diversity), #105 (Counter-Source)
- Feeds into: Final synthesis validation
- Prevents: Amplified bias in synthesis
- Key: Biases don't cancel automatically — must check
