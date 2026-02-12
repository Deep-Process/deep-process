# 502 - Mental Model Design

## Phase
CRYSTALLIZE

## Purpose
Construct one or more MENTAL MODELS that capture the synthesis in a form that can be internalized and applied. A good mental model enables someone to make correct predictions in new situations — it's not just description but operational knowledge.

## Mental Model Types

| Type | Form | Best For | Example |
|------|------|----------|---------|
| **Visual diagram** | Boxes, arrows, flows | System structure and dynamics | Architecture diagram |
| **Matrix/grid** | 2×2 or N×M | Classification and trade-offs | Risk matrix, priority grid |
| **Hierarchy** | Tree structure | Decomposition and categorization | Taxonomy, org chart |
| **Cycle** | Circular/spiral | Recurring processes and feedback | PDCA, seasons |
| **Spectrum** | Linear scale | Continuous dimensions and positioning | Maturity model |
| **Formula** | Mathematical expression | Quantitative relationships | ROI = (Gain - Cost) / Cost |
| **Metaphor** | Analogy to familiar domain | Intuitive understanding | "Data immune system" |
| **Decision tree** | Branching logic | Choices and consequences | Diagnostic flowchart |

## Procedure

### Step 1: Form Selection
What FORM best captures the synthesis?
- Consider the nature of the insight
- Consider the audience
- Consider how it will be used
- The form shapes understanding — choose carefully

### Step 2: Essential Elements Identification
What are the ESSENTIAL elements?
- Only include what's necessary
- Apply Kolmogorov compression principle
- A model should be simpler than the underlying synthesis

### Step 3: Model Construction
Build the model
- Draft the structure
- Populate with synthesis content
- Ensure internal consistency

### Step 4: Predictive Test
Can someone who hasn't seen the sources use this model to make correct predictions?
- Give model to someone unfamiliar with sources
- Ask them to predict outcomes
- Check predictions against evidence

### Step 5: Generalization Test
Does the model GENERALIZE beyond the specific cases in the sources?
- Apply to novel situations
- Does it still provide useful guidance?
- Where does generalization break down?

### Step 6: Naming
Give the model a memorable name
- A good name makes it shareable
- Should capture essence
- Should be unique enough to recall

## Output Schema
```yaml
mental_models:
  - model_id: "M1"
    name: "[Name of the model]"
    type: "diagram/matrix/hierarchy/cycle/spectrum/formula/metaphor/decision_tree"
    description: "[What the model represents]"
    essential_elements:
      - element: "[Element 1]"
        role: "[What this element represents]"
      - element: "[Element 2]"
        role: "[What this element represents]"
    relationships:
      - "[How elements connect]"
    visual_representation: "[Description or reference to diagram]"
    predictive_test:
      test_description: "[How tested]"
      result: "passed/partial/failed"
    generalization_scope:
      generalizes_to: "[What contexts it applies to]"
      does_not_generalize_to: "[Where it breaks down]"
    usage_instructions: "[How to apply the model]"
```

## Model Quality Criteria

### Good Mental Model
- **Simple:** Fewer elements than the synthesis itself
- **Predictive:** Can generate novel predictions
- **Memorable:** Easy to recall and share
- **Actionable:** Guides decisions and actions
- **Accurate:** Matches the underlying synthesis
- **Generalizable:** Works beyond specific cases

### Bad Mental Model
- As complex as what it models
- Only describes, doesn't predict
- Forgettable or generic
- No clear action implications
- Misrepresents the synthesis
- Only works for the specific sources

## Example

```
Synthesis insight: "Data platform success depends on alignment between
technology maturity, organizational readiness, and market ecosystem"

Model Type: Matrix (3×3)

Name: "Data Platform Fit Matrix"

         Tech Ready │ Tech Emerging │ Tech Immature
─────────────────────────────────────────────────────
Org Ready     │   GO       │   PILOT     │   WAIT
─────────────────────────────────────────────────────
Org Learning  │  INVEST    │   EXPERIMENT│   RESEARCH
─────────────────────────────────────────────────────
Org Unready   │  FOUNDATION│   NO-GO     │   NO-GO
─────────────────────────────────────────────────────

Essential elements:
- Technology maturity (three levels)
- Organizational readiness (three levels)
- Action recommendation (outcome)

Predictive: Given a tech/org combination, predicts appropriate action
Generalizable: Applies to any data platform decision, not just the specific cases studied
```

## Model Design Principles

### Compression
- Model should be simpler than the full synthesis
- If it's as complex, it's not a model — it's a copy

### Completeness
- Model should capture essential structure
- Missing essentials = misleading model

### Consistency
- Elements should relate logically
- No internal contradictions

### Operationalization
- Model should guide action
- "Given X, do Y" should be derivable

## Quality Checks
- [ ] Appropriate form selected
- [ ] Essential elements identified (no more, no less)
- [ ] Model constructed with internal consistency
- [ ] Predictive test performed
- [ ] Generalization scope defined
- [ ] Memorable name assigned
- [ ] Usage instructions provided

## Connections
- Uses: #501 (Core Insights), #401-407 (Integration outputs)
- Feeds into: #504 (Narrative), final synthesis output
- Enables: Practical application of synthesis
- Goal: Operational knowledge that travels
