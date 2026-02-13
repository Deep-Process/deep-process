# 308 - Gap Significance Analysis

## Phase
RELATE

## Purpose
Determine whether knowledge gaps (#206) are RANDOM or SYSTEMATIC. Systematic gaps reveal blind spots in the field itself — and are themselves a synthesis finding. What no one studies or discusses is often what everyone needs to understand.

## Gap Classification

| Type | Nature | Implication |
|------|--------|-------------|
| **Random gap** | Missing data, addressable | Seek more sources |
| **Systematic gap** | Field-wide blind spot | This IS a finding |
| **Structural gap** | Paradigm can't see this | Requires paradigm awareness |
| **Political gap** | Sensitive topic avoided | Important but dangerous to surface |
| **Methodological gap** | Tools can't measure this | Need new methods |

## Procedure

### Step 1: Gap Inventory
Collect all gaps from #206
- List all identified knowledge gaps
- Categorize by gap type from #206

### Step 2: Pattern Detection
Look for patterns in gaps
- Do gaps cluster around a topic?
- Do gaps cluster around a perspective?
- Do gaps cluster around a methodology?
- Do gaps cluster around a time period?

### Step 3: Randomness vs Systematic Assessment
For each gap cluster: determine nature
- **Random:** No pattern, just missing data
- **Systematic:** Consistent avoidance or inability

### Step 4: Systematic Gap Analysis
For systematic gaps: understand WHY
- Is it politically sensitive?
- Is it hard to study/measure?
- Does it not fit dominant paradigm?
- Is it in the "unknown unknowns" territory?

### Step 5: Synthesis Implication
Document what systematic gaps mean
- The gap itself is a finding
- May point to important unexplored territory
- May reveal field-wide bias

## Output Schema
```yaml
gap_analysis:
  gap_inventory:
    - gap_id: "G1"
      from_206: "[Gap description from #206]"
      gap_type_206: "[Type from #206]"
  gap_patterns:
    - pattern: "[What gaps cluster around]"
      gaps_in_cluster: ["G1", "G3", "G5"]
      pattern_significance: "[Why this clustering matters]"
  gap_classifications:
    - gap_id: "G1"
      classification: "random/systematic/structural/political/methodological"
      if_systematic:
        reason: "[Why this gap is systematic]"
        avoidance_explanation: "[Why the field avoids this]"
      synthesis_implication: "[What this means for synthesis]"
  systematic_gap_findings:
    - finding: "[What the systematic gap reveals]"
      importance: "high/medium/low"
      recommendation: "[What should be done]"
```

## Why Systematic Gaps Matter

### Politically Sensitive Gaps
- Topics avoided because they're uncomfortable
- May involve power dynamics, failures, or accountability
- Often the most important areas for honest synthesis

### Hard-to-Study Gaps
- Phenomena that resist measurement
- Long-term effects in short-term oriented fields
- Tacit knowledge that can't be articulated

### Paradigm-Invisible Gaps
- Things the dominant framework can't see
- Anomalies that don't fit the model
- Questions the field doesn't think to ask

### Unknown Unknown Gaps
- Areas no one knows to look
- Revealed by cross-domain synthesis
- May be most valuable synthesis contribution

## Systematic Gap Questions

### Detection Questions
- Is this topic missing from ALL sources, or just some?
- Would practitioners find this question obvious or strange?
- Is there a reason no one studies this?

### Explanation Questions
- What incentive structure creates this gap?
- What paradigm makes this invisible?
- Who benefits from this gap remaining?

### Implication Questions
- What would we know if this gap were filled?
- How does this gap bias existing knowledge?
- Should filling this gap be a synthesis recommendation?

## Quality Checks
- [ ] All gaps from #206 inventoried
- [ ] Patterns in gaps detected
- [ ] Random vs systematic distinguished
- [ ] Systematic gaps explained
- [ ] Synthesis implications documented
- [ ] Recommendations generated for high-importance gaps

## Connections
- Uses: #206 (Knowledge Gap Identification), #103 (Diversity Verification)
- Feeds into: #501 (Core Insight Distillation), final synthesis output
- Critical finding: Systematic gaps are synthesis contributions
- Grounded in: Philosophy of science (what paradigms can't see)
