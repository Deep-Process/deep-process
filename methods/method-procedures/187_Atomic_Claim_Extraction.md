# 201 - Atomic Claim Extraction

## Phase
DECOMPOSE

## Purpose
Extract individual, independent claims from each source. Each claim should be testable or evaluable on its own. This is the foundation for relationship mapping and integration.

## Claim Types

| Type | Pattern | Evidence Need | Example |
|------|---------|---------------|---------|
| **Factual** | "X is Y" | Verification | "Delta Lake supports ACID transactions" |
| **Causal** | "X causes Y" | Mechanism + evidence | "Tight coupling caused the cascade failure" |
| **Evaluative** | "X is better than Y" | Criteria + comparison | "Databricks is better than Synapse for this use case" |
| **Prescriptive** | "You should do X" | Justification | "Always use Unity Catalog for governance" |
| **Predictive** | "X will happen" | Basis + track record | "Data volumes will double in 12 months" |
| **Definitional** | "X means Y" | Authority + scope | "EPR compliance means filing reports in each EU market" |

## Procedure

### Step 1: Source Decomposition
For each source: list every distinct claim
- One claim per row
- Keep claims atomic (not compound)

### Step 2: Claim Classification
Classify each claim by type
- Type determines how to evaluate it
- Type influences weight in synthesis

### Step 3: Explicit vs Implicit
Separate EXPLICIT claims from IMPLICIT claims
- Explicit: What the source states directly
- Implicit: What the source assumes but doesn't state
- Both are important for synthesis

### Step 4: Context Notation
Note the SOURCE and CONTEXT for each claim
- A claim about performance in a PoC may not apply at production scale
- Context shapes validity and transferability

### Step 5: Quality Tagging
Tag with quality grade from #102
- Inherit source quality to claims
- Individual claims may have different evidence levels

## Output Schema
```yaml
claims:
  - claim_id: "C1"
    source_id: "S1"
    text: "[The claim statement]"
    type: "factual/causal/evaluative/prescriptive/predictive/definitional"
    explicit_or_implicit: "explicit/implicit"
    context: "[Scope, conditions, limitations]"
    quality_grade: "A/B/C/D"
```

## Quality Checks
- [ ] All sources decomposed
- [ ] Claims are atomic (not compound)
- [ ] Type assigned to each claim
- [ ] Explicit vs implicit distinguished
- [ ] Context documented
- [ ] Quality grades inherited or assessed

## Connections
- Uses: #101-105 (all ACQUIRE methods)
- Feeds into: #202 (Concept Taxonomy), #204 (Evidence Grading), #301 (Convergence-Divergence)
- Foundation for: All RELATE and INTEGRATE work
