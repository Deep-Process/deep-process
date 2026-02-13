# 103 - Diversity Verification

## Phase
ACQUIRE

## Purpose
Verify that the source set is genuinely diverse — not just many sources saying the same thing from the same perspective. Diversity enables triangulation and reduces bias.

## Diversity Dimensions

| Dimension | Question | Why It Matters |
|-----------|----------|----------------|
| **Methodological** | Different methods? (quant + qual, empirical + theoretical) | Triangulation — convergence from different methods = strong evidence |
| **Perspectival** | Different viewpoints? (technical + business, builder + user) | Blind spots of one perspective covered by another |
| **Domain** | Different fields contributing? | Cross-domain synthesis produces novel insight |
| **Temporal** | Different time periods? | Temporal patterns only visible across time |
| **Geographical/Cultural** | Different contexts? | What works in one context may fail in another |
| **Epistemic** | Different certainty levels? (established fact + emerging theory + speculation) | Range of certainty matters for synthesis confidence |

## Procedure

### Step 1: Dimension Mapping
Map each source onto diversity dimensions
- Create a matrix: sources × dimensions
- Mark coverage for each cell

### Step 2: Cluster Analysis
Identify clusters
- If most sources are in one cluster, synthesis is biased toward that perspective
- Clusters might be: "all from same vendor", "all from same methodology", "all from same time period"

### Step 3: Gap Identification
Identify underrepresented dimensions
- Which perspectives are missing?
- Which methods are not represented?

### Step 4: Deliberate Seeking
Actively seek sources from underrepresented clusters
- Don't just document gaps — address them
- This is where the most valuable sources often are

### Step 5: Minimum Check
Verify minimum diversity threshold
- At least 2 of 6 diversity dimensions should be well-represented
- Below this, synthesis has high bias risk

## Output Schema
```yaml
diversity_map:
  dimensions:
    - dimension: "Methodological"
      coverage: "GOOD/PARTIAL/POOR"
      sources_covering: ["S1", "S3"]
      gap_description: "[If PARTIAL/POOR]"
    - dimension: "Perspectival"
      coverage: "GOOD/PARTIAL/POOR"
      sources_covering: ["S2", "S4"]
      gap_description: "[If PARTIAL/POOR]"
    # ... for each dimension
  clusters_identified:
    - name: "[Cluster name]"
      sources: ["S1", "S2"]
      concern: "[Why this clustering is a problem]"
  dimensions_well_covered: "[count]/6"
  deliberate_additions_needed:
    - "[Source type needed for diversity]"
```

## Quality Checks
- [ ] All 6 dimensions assessed
- [ ] Clusters identified and documented
- [ ] At least 2/6 dimensions well-covered
- [ ] Gaps have mitigation plan
- [ ] No single perspective dominates

## Connections
- Uses: #101 (Source Collection), #003 (Landscape)
- Feeds into: #105 (Counter-Source Search)
- Grounded in: Triangulation (Denzin), Methodological Pluralism (Feyerabend)
