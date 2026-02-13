# 604 - Falsifiability Check (Popper)

## Phase
META (continuous)

## Purpose
Verify that the synthesis produces claims that could, in principle, be proven wrong. A synthesis that explains everything and predicts nothing is narrative, not knowledge. Falsifiability is the demarcation between science and non-science.

## Theoretical Foundation
> **Popper's Falsifiability (1934):**
> A good theory is falsifiable — it makes predictions that could be wrong.
> A theory that can't be proven wrong can't be proven right either.
> "Every test of a theory is an attempt to falsify it."
>
> **Implication for Synthesis:**
> Synthesis conclusions should be testable.
> If no evidence could disprove a conclusion, it's opinion, not knowledge.

## Procedure

### Step 1: Conclusion Inventory
List all major synthesis conclusions
- Core insights from #501
- Principles from #503
- Predictions from #404
- Claims from the integrated framework

### Step 2: Falsifiability Assessment
For each conclusion: what evidence would DISPROVE it?
- Be specific about what would count as disproof
- "Nothing could disprove it" = unfalsifiable
- Vague answers = weak falsifiability

### Step 3: Obtainability Check
Is the disproving evidence obtainable?
- **In principle:** Could such evidence exist?
- **Practically:** Can we actually get it?
- Rate: obtainable / difficult / impossible

### Step 4: Unfalsifiable Handling
For unfalsifiable conclusions:
- Downgrade from "finding" to "perspective" or "narrative"
- Don't present as knowledge
- Label explicitly as unfalsifiable

### Step 5: Test Method Specification
For falsifiable conclusions: what's the cheapest/fastest way to test?
- Identify practical test approach
- Estimate effort to test
- Note if test is feasible

### Step 6: Timeline Documentation
For conclusions that need time to test:
- What timeline before testable?
- Set review date for future assessment
- Document as "pending falsification test"

## Output Schema
```yaml
falsifiability_check:
  conclusions_checked:
    - conclusion_id: "CON1"
      conclusion: "[The conclusion]"
      falsifiability:
        disproof_evidence: "[What would disprove this]"
        specific: true/false
        disproof_examples:
          - "[Specific thing that would count as disproof]"
      obtainability:
        in_principle: true/false
        practically: "obtainable/difficult/impossible"
        barriers: "[If difficult/impossible, why]"
      status: "falsifiable/weakly_falsifiable/unfalsifiable"
      if_unfalsifiable:
        reclassification: "perspective/narrative/assumption"
        reason: "[Why unfalsifiable]"
      test_method:
        approach: "[How to test]"
        effort: "low/medium/high"
        feasible: true/false
      timeline:
        testable_now: true/false
        timeline_if_not: "[When testable]"
        review_date: "[Date to check]"
  summary:
    total_conclusions: N
    falsifiable: N
    weakly_falsifiable: N
    unfalsifiable: N
    falsifiable_ratio: "X/Y"
    unfalsifiable_items: ["[Items reclassified as narrative/perspective]"]
```

## Falsifiability Spectrum

| Level | Description | Example | Treatment |
|-------|-------------|---------|-----------|
| **Strongly falsifiable** | Clear, specific disproof conditions | "Performance will be >100ms at scale" | Keep as finding |
| **Weakly falsifiable** | Disproof possible but vague | "This approach is generally better" | Strengthen or qualify |
| **Unfalsifiable** | No conceivable disproof | "Success requires good culture" | Reclassify as perspective |

## Common Unfalsifiable Patterns

### The Escape Hatch
- "This works unless something prevents it"
- Any failure can be attributed to the escape clause
- Cannot be proven wrong

### The Vague Principle
- "Good teams succeed"
- "Appropriate governance is important"
- No specific content to disprove

### The Self-Referential
- "This is true for those who understand it"
- Failure to find truth attributed to not understanding
- Circular protection from disproof

### The Tautology
- "If X is done right, it succeeds"
- "Right" defined by success
- True by definition

## Strengthening Weak Falsifiability

### Make Specific
- Bad: "Good culture helps"
- Better: "Teams with weekly retrospectives have 30% fewer recurring bugs"

### Add Boundaries
- Bad: "This approach works"
- Better: "This approach works for teams <20 people with >6 months agile experience"

### Add Metrics
- Bad: "Performance will improve"
- Better: "P95 latency will decrease by at least 40%"

### Add Timeline
- Bad: "This will succeed"
- Better: "This will show measurable benefit within 6 months"

## Quality Checks
- [ ] All major conclusions inventoried
- [ ] Falsifiability assessed for each
- [ ] Disproof evidence specified
- [ ] Obtainability evaluated
- [ ] Unfalsifiable items reclassified
- [ ] Test methods identified where feasible
- [ ] Timelines documented for delayed tests
- [ ] Falsifiable ratio calculated

## Warning
> A synthesis that explains EVERYTHING explains NOTHING.
> If your synthesis can never be wrong, it's not knowledge.
> The willingness to be proven wrong is the mark of genuine synthesis.

## When to Apply
- **Required for:** All synthesis depths
- **Especially for:** Prescriptive conclusions, predictions
- **Critical for:** High-stakes decisions

## Connections
- Uses: #501 (Core Insights), #503 (Principles), #404 (Abductive Conclusions)
- Feeds into: Final synthesis validation
- Grounded in: Popper (1934) falsificationism
- Demarcation: Knowledge vs narrative
