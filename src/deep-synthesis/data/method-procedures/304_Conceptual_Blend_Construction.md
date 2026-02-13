# 304 - Conceptual Blend Construction (Fauconnier-Turner)

## Phase
RELATE

## Purpose
Deliberately blend concepts from different input spaces to generate emergent insights that exist in neither space alone. The blend is not just A+B — it produces C that neither A nor B contains.

## Theoretical Foundation
> **Conceptual Blending Theory (Fauconnier & Turner, 2002):**
> Mental spaces from different domains can be blended into a NEW mental space that has emergent properties.
> The four-space model:
> - Input Space 1
> - Input Space 2
> - Generic Space (shared structure)
> - Blended Space (novel insight)

## Four-Space Model
```
Input Space 1    Input Space 2
     ↘              ↙
    Generic Space (shared structure)
           ↓
      Blended Space (novel insight)
```

## Procedure

### Step 1: Input Space Selection
Select two (or more) input spaces from different sources/domains
- Look for spaces that share some structure but have unique elements
- Best candidates: different domains with overlapping concepts

### Step 2: Generic Space Identification
Identify the shared abstract structure
- What do the input spaces have in common?
- What's the abstract pattern they both exemplify?

### Step 3: Selective Projection
Choose which elements from each input space to project into the blend
- Not everything transfers
- Select elements most relevant to synthesis question

### Step 4: Blended Space Construction
Build the blended space
- Combine selected elements
- Allow for new structure that emerges from combination

### Step 5: Emergent Structure Detection
Identify emergent properties
- What exists in the blend that wasn't in either input?
- What new relationships appear?
- What new predictions can be made?

### Step 6: Evaluation
Assess blend quality
- Is the emergent insight genuine? (Produces testable predictions)
- Or is it spurious? (Just sounds clever)

## Output Schema
```yaml
blends:
  - blend_id: "B1"
    input_space_1:
      name: "[Input space 1]"
      source_ids: ["S1"]
      key_elements:
        - "[Element 1]"
        - "[Element 2]"
    input_space_2:
      name: "[Input space 2]"
      source_ids: ["S2"]
      key_elements:
        - "[Element 1]"
        - "[Element 2]"
    generic_space:
      shared_structure: "[What the inputs have in common abstractly]"
    blended_space:
      name: "[Name for the blend]"
      projected_from_1: ["[Elements taken from input 1]"]
      projected_from_2: ["[Elements taken from input 2]"]
      emergent_structure:
        - "[New element/relationship 1]"
        - "[New element/relationship 2]"
    emergent_insights:
      - insight: "[The novel insight]"
        testable: true/false
        prediction: "[What this predicts]"
    blend_quality: "genuine/spurious"
```

## Example

```
Input 1: "Immune system" (biology)
├── Recognizes self vs non-self
├── Memory of past threats
├── Adaptive response to new threats
├── Autoimmune = attacking self

Input 2: "Data quality system" (data engineering)
├── Needs to recognize valid vs invalid data
├── Should learn from past quality issues
├── Should adapt to new data patterns
├── Over-strict validation = rejecting good data

Generic space: Adaptive recognition system

Blended space: "Data immune system"
├── EMERGENT: Just as immune systems need tolerance training to avoid autoimmune disease,
│   data quality systems need calibration periods to avoid rejecting legitimate new patterns
├── EMERGENT: Immune memory suggests a "data quality memory" that remembers past
│   issues and checks for recurrence — not just current rules
├── PREDICTION: A data quality system that "remembers" past issues will catch more
│   problems than a purely rule-based system → testable claim
```

## Blend Quality Criteria

### Genuine Blend
- Emergent structure is non-trivial
- Produces testable predictions
- Domain experts find it insightful
- Not obvious from either input alone

### Spurious Blend
- Sounds clever but empty
- No testable predictions
- Forces elements that don't fit
- Analogy breaks down under scrutiny

## Blend Optimality Principles (Fauconnier-Turner)

| Principle | Description |
|-----------|-------------|
| **Integration** | The blend should be tightly integrated |
| **Topology** | Preserve the topology of input spaces |
| **Web** | Maintain connections to input spaces |
| **Unpacking** | Should be able to trace back to inputs |
| **Good Reason** | Each element in blend should have purpose |

## Quality Checks
- [ ] Input spaces clearly defined
- [ ] Generic space identified
- [ ] Selective projection performed
- [ ] Emergent structure documented
- [ ] Testable predictions generated
- [ ] Blend quality evaluated

## Connections
- Uses: #303 (Analogical Structure Mapping)
- Feeds into: #403 (Emergence Detection), #502 (Mental Model Design)
- Grounded in: Fauconnier & Turner (2002) Conceptual Blending Theory
- Enables: Novel insight generation
