# 404 - Abductive Integration

## Phase
INTEGRATE

## Purpose
When evidence doesn't fully determine a conclusion, construct the BEST EXPLANATION that accounts for all evidence — the inference to the best explanation. This is the creative core of synthesis, enabling conclusions that go beyond what the data strictly proves.

## Theoretical Foundation
> **Peirce's Abductive Reasoning (1903):**
> Three types of inference:
> - **Deduction:** A + rule → conclusion (certain but no new knowledge)
> - **Induction:** observations → generalization (probable but may be wrong)
> - **Abduction:** observations → best explanation (creative, novel, but uncertain)
>
> Synthesis primarily uses ABDUCTION — inferring the best explanation that accounts for all sources.

## Abduction Quality Criteria

| Criterion | Question | Weight |
|-----------|----------|--------|
| **Coverage** | How much evidence does it explain? | High |
| **Simplicity** | How simple is it? (Occam's razor) | High |
| **Consistency** | Does it conflict with established knowledge? | High |
| **Fertility** | Does it generate new testable predictions? | Medium |
| **Plausibility** | Is it believable given domain knowledge? | Medium |
| **Mechanism** | Does it propose HOW, not just that? | Medium |

## Procedure

### Step 1: Evidence Assembly
Gather all relevant evidence from all sources
- Claims from #201
- Patterns from #306
- Convergences from #301
- Resolved tensions from #401

### Step 2: Candidate Generation
Generate candidate explanations that could account for ALL evidence
- Don't censor at this stage
- Include even seemingly unlikely candidates
- Aim for 3-5 candidates minimum

### Step 3: Coverage Assessment
For each candidate: how much evidence does it explain?
- Full coverage = explains all evidence
- Partial coverage = explains some, silent on rest
- Contradicted = conflicts with some evidence

### Step 4: Multi-Criteria Evaluation
Evaluate candidates on all criteria
- Score each criterion
- Note trade-offs (e.g., simple but low coverage)

### Step 5: Best Explanation Selection
Select the explanation that BEST balances all criteria
- Not necessarily highest on any single criterion
- Overall best fit to evidence and criteria
- Document reasoning for selection

### Step 6: Confidence Calibration
Assign appropriate confidence
- Abductive conclusions are HYPOTHESES, not certainties
- They are the best current explanation, not the final truth
- Confidence should reflect evidence strength and alternative explanations

## Output Schema
```yaml
abductive_integration:
  evidence_base:
    - evidence_id: "E1"
      evidence: "[Evidence item]"
      source: "[From which method]"
  candidate_explanations:
    - candidate_id: "C1"
      explanation: "[The candidate explanation]"
      coverage:
        explains: ["E1", "E2", "E3"]
        silent_on: ["E4"]
        contradicts: []
      scores:
        coverage: "full/partial/contradicted"
        simplicity: "high/medium/low"
        consistency: "high/medium/low"
        fertility: "high/medium/low"
        plausibility: "high/medium/low"
        mechanism: "clear/partial/absent"
  best_explanation:
    candidate_id: "C1"
    explanation: "[The selected explanation]"
    selection_reasoning: "[Why this is best]"
    confidence: "high/medium/low"
    confidence_basis: "[Why this confidence]"
    explicit_caveat: "This is abductive inference — the best current explanation, not proven truth"
  alternative_explanations:
    - candidate_id: "C2"
      why_not_selected: "[Why this wasn't chosen]"
      when_might_be_better: "[Conditions under which this would be preferred]"
```

## Candidate Generation Techniques

### Hypothesis Extension
- Take existing hypothesis, extend to cover more evidence
- "If X is true, then Y must also be true"

### Mechanism Inference
- Evidence shows correlation → infer mechanism that would produce it
- "What PROCESS would generate these observations?"

### Analogical Transfer
- Use #303 analogies → "In similar domain, this mechanism explains it"
- Transfer candidate explanation from analogous situation

### Negation Exploration
- What if the obvious explanation is WRONG?
- Generate alternatives by negating assumptions

### Expert Hypothesis
- What would domain expert propose?
- Use synthesizer's expertise (label as added)

## Evaluation Trade-offs

### Coverage vs Simplicity
- Simple explanation that explains most vs complex explanation that explains all
- Prefer simplicity unless coverage gap is critical

### Consistency vs Coverage
- If most consistent explanation doesn't cover all evidence...
- Check: is uncovered evidence reliable?

### Plausibility vs Novelty
- Novel explanation may be implausible but correct
- Balance domain knowledge against evidence

## Quality Checks
- [ ] All relevant evidence assembled
- [ ] Multiple candidate explanations generated
- [ ] Coverage assessed for each candidate
- [ ] All criteria scored
- [ ] Best explanation selected with reasoning
- [ ] Confidence appropriately calibrated
- [ ] Explicit caveat about abductive nature included

## Warning
> Abductive conclusions are HYPOTHESES, not certainties.
> Always include the caveat that this is the best current explanation,
> subject to revision with new evidence.

## Connections
- Uses: #201 (Claims), #301 (Convergence-Divergence), #306 (Patterns), #401 (Dialectical Integration)
- Feeds into: #501 (Core Insight), #604 (Falsifiability Check)
- Grounded in: Peirce (1903) abductive reasoning
- Nature: Creative but uncertain
