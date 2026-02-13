# 606 - Novel Information Test (Shannon)

## Phase
META (continuous)

## Purpose
Rigorously test whether the synthesis contains GENUINE new information or is merely reorganizing what sources already said. This is the definitive test for distinguishing synthesis from summary.

## Theoretical Foundation
> **Shannon Information Theory (1948):**
> Information = surprise.
> A message that tells you what you already know contains ZERO information.
>
> **Applied to Synthesis:**
> A synthesis that merely repeats source content contains no new information.
> Genuine synthesis CREATES information by combining sources in ways that produce novel insight.

## The Shannon Test

For each claimed synthesis insight:
1. Is it present in Source A? → **Extraction** from A
2. Is it present in Source B? → **Extraction** from B
3. Does it require COMBINING A and B? → **Genuine synthesis**
4. Does it come from synthesizer's prior knowledge? → **Added expertise** (label it)

## Insight Classifications

| Classification | Definition | Value | Treatment |
|----------------|------------|-------|-----------|
| **Genuine synthesis** | Requires multiple sources to derive | High | Core synthesis contribution |
| **Extraction** | Present in a single source | Low | Attribution, not synthesis |
| **Added expertise** | From synthesizer, not sources | Medium | Label explicitly |
| **Elaboration** | Expansion without new content | Low | May be useful but not synthesis |
| **Compilation** | Collection without integration | Low | Not synthesis |

## Procedure

### Step 1: Insight Inventory
List all claimed synthesis insights
- From #501 core insights
- From #403 emergent insights
- From #404 abductive conclusions
- From #503 principles

### Step 2: Source-by-Source Test
For each insight: can it be derived from any single source?
- Check against each source
- Document which sources (if any) contain it
- Be rigorous — partial presence counts

### Step 3: Combination Requirement Test
For insights not in any single source:
- Does deriving it REQUIRE combining multiple sources?
- Which sources must be combined?
- What is the combination mechanism?

### Step 4: Added Expertise Check
Does the insight come from the synthesizer?
- Prior knowledge brought to synthesis
- Domain expertise applied
- Valuable but different from source-derived synthesis

### Step 5: Classification Assignment
Assign classification to each insight
- Apply definitions above
- Be honest — many insights are extractions

### Step 6: Novelty Ratio Calculation
Calculate the overall novelty ratio
- Genuine synthesis / Total insights
- Target: at least 30%
- Below 30%: relabel as summary

## Output Schema
```yaml
novelty_test:
  insights_tested:
    - insight_id: "I1"
      insight: "[The insight]"
      source_test:
        present_in_source_a: true/false
        present_in_source_b: true/false
        # ... for all relevant sources
      requires_combination: true/false
      combination_sources: ["S1", "S2"]
      combination_mechanism: "[How sources combine to produce this]"
      from_synthesizer_expertise: true/false
      classification: "genuine_synthesis/extraction/added_expertise/elaboration/compilation"
  novelty_summary:
    total_insights: N
    genuine_synthesis: N
    extraction: N
    added_expertise: N
    elaboration: N
    compilation: N
    novelty_ratio: "X%" # genuine_synthesis / total
    meets_threshold: true/false # ≥30%
    verdict: "synthesis/summary"
```

## Novelty Ratio Benchmarks

| Ratio | Verdict | Action |
|-------|---------|--------|
| ≥50% | Strong synthesis | Excellent synthesis work |
| 30-50% | Valid synthesis | Meets threshold |
| 10-30% | Weak synthesis | Consider relabeling, add more integration |
| <10% | Summary | Relabel as summary, not synthesis |

## Common Failure Modes

### The Reorganizer
- All insights present in sources
- Synthesis just reorganizes them
- Value is in organization, not new knowledge
- → Relabel as "organized summary"

### The Quoter
- Insights are paraphrased source claims
- No genuine combination
- → Relabel as "annotated bibliography"

### The Expert
- Novel insights all from synthesizer
- Sources not actually synthesized
- → Relabel as "expert commentary on sources"

### The Elaborator
- Insights expand on sources without adding
- More words, same information
- → Cut the elaboration

## Genuine Synthesis Examples

### Cross-Domain Pattern
- Source A (domain 1): "X happens"
- Source B (domain 2): "Y happens"
- Synthesis: "X and Y are instances of the same pattern Z"
- Neither source sees the pattern

### Contradiction Resolution
- Source A: "Technology T works"
- Source B: "Technology T fails"
- Synthesis: "T works in context C1, fails in C2"
- Neither source had the contextual insight

### Implication Chain
- Source A: "A → B"
- Source B: "B → C"
- Synthesis: "A → C"
- Neither source drew the transitive inference

## Quality Checks
- [ ] All insights inventoried
- [ ] Source-by-source test applied
- [ ] Combination requirements identified
- [ ] Added expertise labeled
- [ ] Classifications assigned
- [ ] Novelty ratio calculated
- [ ] Threshold check performed
- [ ] Relabeling applied if needed

## When to Apply
- **Required for:** All synthesis depths
- **Critical at:** End of synthesis
- **Determines:** Whether output is synthesis or summary

## Connections
- Uses: #501 (Core Insights), #403 (Emergence), #503 (Principles)
- Feeds into: Final synthesis validation
- Grounded in: Shannon (1948) information theory
- Demarcation: Synthesis vs summary
