# 305 - Causal Chain Reconciliation

## Phase
RELATE

## Purpose
Different sources may present different causal explanations for the same phenomenon. Reconcile into a unified causal model — or explain why they diverge. Understanding causal structure is essential for actionable synthesis.

## Divergence Types

| Type | Description | Resolution Approach |
|------|-------------|---------------------|
| **Missing variable** | Source A omits mediator that Source B includes | Integrate the mediator into unified model |
| **Reversed causation** | A says X→Y, B says Y→X | Investigate directionality with evidence |
| **Confounded** | Both correct, but Z causes both X and Y | Add confounding variable to model |
| **Level difference** | A describes micro-level, B describes macro-level | Both may be correct at their level |
| **Temporal** | A describes short-term, B describes long-term | Causation may reverse over time |
| **Paradigm conflict** | Different causal frameworks entirely | May require paradigm synthesis |

## Procedure

### Step 1: Causal Claim Extraction
From #201 claims: extract all causal claims
- Identify explicit "X causes Y" claims
- Surface implicit causal assumptions
- Note strength of causal claim (correlation vs causation)

### Step 2: Per-Source Causal Graph
Build causal graph for each source
- Nodes = variables/concepts
- Edges = causal relationships (directed)
- Annotate edge strength if possible

### Step 3: Graph Comparison
Compare causal graphs across sources
- Where do they agree? (Same edge in both)
- Where do they diverge? (Different or opposite edges)
- Where do they have gaps? (Edge in one but not other)

### Step 4: Divergence Classification
For each divergence: classify the type
- Apply the divergence types above
- Determine most likely explanation

### Step 5: Evidence Evaluation
For diverging claims: what evidence supports each?
- Which has stronger evidence (from #204)?
- Is there evidence that could adjudicate?

### Step 6: Unified Model Construction
Build unified causal model
- Incorporate agreements
- Resolve divergences (or document as unresolved)
- Note remaining conflicts

## Output Schema
```yaml
causal_analysis:
  source_causal_graphs:
    - source_id: "S1"
      variables:
        - "[Variable 1]"
        - "[Variable 2]"
      causal_edges:
        - from: "[Variable 1]"
          to: "[Variable 2]"
          strength: "strong/moderate/weak"
          evidence: "[Supporting evidence]"
  divergences:
    - claim_a:
        source_id: "S1"
        causal_claim: "[X causes Y]"
      claim_b:
        source_id: "S2"
        causal_claim: "[Different causal claim]"
      divergence_type: "missing_variable/reversed_causation/confounded/level_difference/temporal/paradigm_conflict"
      resolution: "[How resolved or why unresolved]"
  unified_model:
    variables:
      - "[All variables]"
    causal_edges:
      - from: "[Variable]"
        to: "[Variable]"
        source_agreement: "all/partial"
        confidence: "high/medium/low"
    remaining_conflicts:
      - "[Unresolved causal disputes]"
```

## Resolution Strategies

### For Missing Variable
1. Identify the mediator from the more complete source
2. Check if other sources' evidence is consistent with mediator
3. Add mediator to unified model if evidence supports

### For Reversed Causation
1. Look for temporal evidence (what comes first?)
2. Look for intervention evidence (manipulating X affects Y?)
3. Consider bidirectional causation possibility
4. If unresolvable, document as uncertainty

### For Confounded
1. Identify potential confounders
2. Check if any source addresses confounders
3. Add confounders to model with appropriate causal structure

### For Level Difference
1. Verify levels of each source (use #002)
2. Both may be correct at their level
3. Document as multi-level causation

### For Temporal
1. Note time horizon of each source
2. Short-term and long-term effects may differ
3. Document temporal dynamics in model

## Quality Checks
- [ ] All causal claims extracted
- [ ] Per-source graphs built
- [ ] Divergences identified and classified
- [ ] Evidence for divergences evaluated
- [ ] Unified model constructed
- [ ] Remaining conflicts documented

## Connections
- Uses: #201 (Claims), #204 (Evidence Grading), #205 (Assumptions)
- Feeds into: #401 (Dialectical Integration), #502 (Mental Model Design)
- Critical for: Actionable synthesis (understanding cause enables intervention)
