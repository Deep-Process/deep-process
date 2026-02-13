# 403 - Emergence Detection

## Phase
INTEGRATE

## Purpose
Look for properties, insights, or patterns that EMERGE from the combination of sources but aren't present in any single source. This is the core test of genuine synthesis — if nothing emerges, it's extraction or summarization, not synthesis.

## Theoretical Foundation
> **Shannon Information Theory:**
> Information = surprise. A synthesis that merely repeats what sources say contains ZERO new information.
> A valid synthesis must produce statements that are NOT present in any single source but EMERGE from their combination.

> **Systems Theory:**
> Emergence: the whole is more than the sum of parts.
> Properties of the system not predictable from properties of components alone.

## Shannon Test

For each synthesis finding, ask:
- Can this be derived from Source A alone? → If yes, it's **extraction** from A
- Can this be derived from Source B alone? → If yes, it's **extraction** from B
- Does it require BOTH A and B (and possibly more)? → If yes, it's **genuine emergence**
- Does it come from the synthesizer's prior knowledge, not sources? → It's **added expertise** (label it)

## Categories of Emergent Insight

| Category | Description | Example |
|----------|-------------|---------|
| **Cross-domain pattern** | Same pattern visible across different domains | Risk cascade in pipelines mirrors supply chain disruption |
| **Missing middle** | Gap between sources reveals an unexplored territory | Source A covers input, Source C covers output — what happens in between? |
| **Contradiction resolution** | Understanding WHY sources disagree reveals deeper truth | They disagree because they measured at different scales |
| **Implication chain** | A implies B (Source 1), B implies C (Source 2), therefore A implies C (novel) | Technology trend + regulatory direction → market opportunity no source identified |
| **Boundary condition** | Synthesis reveals WHERE something is true vs false | "This approach works for < 1M records" (from combining success and failure reports) |
| **Meta-pattern** | Pattern in the patterns | All successful cases share X that none explicitly mention |

## Procedure

### Step 1: Candidate Identification
Identify candidate emergent findings
- From #401 syntheses
- From #402 unified framework
- From #306 patterns
- From #304 conceptual blends

### Step 2: Shannon Test Application
For each candidate: apply Shannon test rigorously
- Source-by-source check
- Document which sources contribute
- Classify: extraction, genuine emergence, or added expertise

### Step 3: Emergence Category Classification
For genuine emergences: classify by category
- Which type of emergence is this?
- What makes it emergent?

### Step 4: Testability Assessment
Is the emergent insight testable?
- What would confirm it?
- What would refute it?
- If not testable, note as hypothesis only

### Step 5: Confidence Rating
Rate confidence in emergence
- More sources contributing → higher confidence
- More diverse sources → higher confidence
- Clearer mechanism → higher confidence

## Output Schema
```yaml
emergence_analysis:
  candidates:
    - finding_id: "E1"
      finding: "[The finding]"
      source: "synthesis_401/framework_402/pattern_306/blend_304"
  shannon_tests:
    - finding_id: "E1"
      source_a_alone: false
      source_b_alone: false
      requires_combination: true
      classification: "extraction/genuine_emergence/added_expertise"
      contributing_sources: ["S1", "S2", "S3"]
  emergent_insights:
    - finding_id: "E1"
      insight: "[The emergent insight]"
      category: "cross_domain/missing_middle/contradiction_resolution/implication_chain/boundary_condition/meta_pattern"
      emergence_explanation: "[Why this is emergent]"
      testable: true/false
      test_method: "[How to test]"
      confidence: "high/medium/low"
      confidence_basis: "[Why this confidence level]"
  novelty_summary:
    total_candidates: N
    genuine_emergences: N
    extractions: N
    added_expertise: N
    novelty_ratio: "[% genuine emergence]"
```

## Emergence Confidence Factors

### High Confidence
- Multiple diverse sources contribute
- Clear mechanism explains emergence
- Testable and test is feasible
- Domain experts recognize the insight

### Medium Confidence
- Few sources contribute
- Mechanism unclear but plausible
- Testable but difficult
- Some expert recognition

### Low Confidence
- Single source plus reasoning
- Mechanism speculative
- Hard to test
- Novel to experts (could be insight or error)

## Added Expertise Handling

When synthesizer contributes from prior knowledge:
1. **Label explicitly** — don't claim it came from sources
2. **Assess validity** — is the added knowledge reliable?
3. **Check for bias** — is added knowledge distorting synthesis?
4. **Value appropriately** — added expertise is valuable but different from emergent synthesis

## Quality Checks
- [ ] All candidate findings identified
- [ ] Shannon test applied rigorously
- [ ] Emergences properly classified
- [ ] Testability assessed
- [ ] Confidence rated with justification
- [ ] Extractions vs emergences clearly distinguished
- [ ] Added expertise labeled

## Target Metric
> At least 30% of key insights should be genuine synthesis (combining sources to produce new understanding).
> Below this, it's a summary, not a synthesis. Relabel accordingly.

## Connections
- Uses: #401 (Dialectical Integration), #402 (Framework Unification), #306 (Pattern Detection), #304 (Conceptual Blending)
- Feeds into: #501 (Core Insight Distillation), #606 (Novel Information Test)
- Shannon: Information theory foundation
- Core test: Is this genuine synthesis?
