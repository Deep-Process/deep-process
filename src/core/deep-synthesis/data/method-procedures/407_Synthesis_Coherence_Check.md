# 407 - Synthesis Coherence Check

## Phase
INTEGRATE

## Purpose
Test whether the integrated synthesis is internally consistent. Synthesis that contradicts itself is worse than no synthesis — it creates confusion and undermines trust.

## Core Principle
> Internal consistency is NECESSARY but NOT SUFFICIENT.
> A synthesis can be perfectly consistent and perfectly wrong (beautiful but false theory).
> But inconsistent synthesis is definitely problematic.

## Coherence Dimensions

| Dimension | Question | Check Method |
|-----------|----------|--------------|
| **Logical** | Do conclusions contradict each other? | Pairwise comparison |
| **Level** | Are conclusions at compatible levels? | Level alignment (#307) |
| **Boundary** | Do boundaries overlap consistently? | Boundary comparison |
| **Temporal** | Are time-dependent claims consistent? | Timeline check |
| **Implication** | Do implications of conclusions conflict? | Forward reasoning |

## Procedure

### Step 1: Conclusion Inventory
List all synthesis conclusions
- All claims from integration phase
- All emergent insights
- All abductive conclusions
- All principles and recommendations

### Step 2: Pairwise Compatibility Check
For each pair of conclusions: are they mutually compatible?
- Can both be true simultaneously?
- Does one imply the negation of another?
- Are there hidden conflicts?

### Step 3: Level Consistency Check
Are conclusions at compatible levels of analysis?
- Apply #307 logic
- Cross-level claims need explicit connection

### Step 4: Boundary Consistency Check
Do boundary conditions create conflicts?
- Conclusion A valid in context X
- Conclusion B valid in context X
- Do A and B conflict in context X?

### Step 5: Implication Testing
Do conclusions imply contradictions?
- Conclusion A + Conclusion B → X
- Does X contradict Conclusion C?
- Follow logical implications forward

### Step 6: Contradiction Resolution or Acknowledgment
For any contradictions found:
- Resolve if possible (different levels? different scopes?)
- Acknowledge explicitly if unresolvable
- Rate as resolved, acknowledged, or problematic

## Output Schema
```yaml
coherence_check:
  conclusions_checked:
    - conclusion_id: "CON1"
      conclusion: "[Brief statement]"
  pairwise_checks:
    - pair: ["CON1", "CON2"]
      compatible: true/false
      if_incompatible:
        conflict_type: "logical/level/boundary/temporal/implication"
        description: "[What the conflict is]"
        resolution: "resolved/acknowledged/problematic"
        resolution_method: "[How resolved, if resolved]"
  level_consistency:
    all_compatible: true/false
    issues:
      - "[Any level mixing issues]"
  boundary_consistency:
    all_compatible: true/false
    issues:
      - "[Any boundary conflicts]"
  implication_test:
    contradictions_found: true/false
    contradictions:
      - "[Any implication-based contradictions]"
  overall_coherence:
    status: "coherent/mostly_coherent/problematic"
    resolved_contradictions: N
    acknowledged_contradictions: N
    unresolved_contradictions: N
    assessment: "[Overall coherence assessment]"
```

## Contradiction Types and Handling

### Direct Contradiction
- "A is true" AND "A is false"
- Must resolve or synthesis is invalid

### Scope Contradiction
- "A is true in context X" AND "A is false in context X"
- Resolution: Refine contexts or resolve

### Level Contradiction
- "Pattern shows X" AND "Individual case shows not-X"
- May be fine if acknowledged (Simpson's Paradox territory)

### Temporal Contradiction
- "X is true now" AND "X is false now"
- Resolution: Identify time-dependent conditions

### Implication Contradiction
- A → B, A → C, B contradicts C
- Hidden contradiction, requires careful analysis

## Acceptable vs Problematic Contradictions

### Acceptable (with acknowledgment)
- Different levels of analysis
- Different temporal scopes
- Productive tensions maintained intentionally
- Different boundary conditions

### Problematic
- Same level, same scope, same time, same boundaries
- No resolution possible
- Undermines synthesis validity

## Quality Checks
- [ ] All conclusions inventoried
- [ ] Pairwise compatibility checked for key pairs
- [ ] Level consistency verified
- [ ] Boundary consistency verified
- [ ] Implications tested for contradictions
- [ ] All contradictions resolved or explicitly acknowledged
- [ ] Overall coherence assessed

## Warning
> **Consistency ≠ Truth**
> Internal consistency is necessary but not sufficient for valid synthesis.
> A perfectly coherent synthesis can still be wrong if it doesn't match reality.
> Use coherence check alongside evidence-based checks (#604, #606).

## Connections
- Uses: All integration methods (#401-406), #307 (Level Alignment)
- Feeds into: Final synthesis validation
- Necessary: For synthesis validity
- Not sufficient: Doesn't guarantee truth
- Meta: Part of synthesis quality assurance
