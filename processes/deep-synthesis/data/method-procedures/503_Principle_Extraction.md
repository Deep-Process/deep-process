# 503 - Principle Extraction

## Phase
CRYSTALLIZE

## Purpose
Derive GENERAL PRINCIPLES from the synthesis — rules that apply beyond the specific context of the sources. Principles are the most durable form of synthesized knowledge — they outlast the specific situations from which they were derived.

## Principle Quality Criteria

A good principle is:

| Criterion | Description | Test |
|-----------|-------------|------|
| **General** | Applies to a class of situations, not just one | "Does this apply to more than the studied cases?" |
| **Predictive** | Makes testable claims about what will happen | "What does this predict?" |
| **Actionable** | Tells you what to DO (or avoid) | "Given this principle, what action follows?" |
| **Memorable** | Short enough to remember | "Can you state it in one sentence?" |
| **Falsifiable** | Can be proven wrong (Popper) | "What evidence would disprove this?" |

## Principle Structure

Recommended format:
> "When [context], [action/observation] because [mechanism]"

This structure ensures:
- Context: Where the principle applies
- Action/observation: What happens or what to do
- Mechanism: WHY it works (increases transferability)

## Procedure

### Step 1: Candidate Identification
From core insights (#501): which generalize beyond the specific synthesis context?
- Look for insights that don't depend on specific details
- Look for insights with clear mechanisms

### Step 2: Principle Formulation
Formulate as principles using the structure:
- "When [context], [action/observation] because [mechanism]"
- Be specific enough to be useful
- Be general enough to transfer

### Step 3: Retrospective Test
Would this principle have been useful BEFORE the sources were collected?
- If yes: it's genuinely general
- If no: it might be hindsight rationalization

### Step 4: Boundary Definition
Where does this principle NOT apply?
- Define exclusions explicitly
- Prevent over-generalization

### Step 5: Novelty Check
Is this a known principle under a different name?
- Search for existing principles
- If known, acknowledge; if novel, note as contribution

### Step 6: Falsifiability Specification
What would disprove this principle?
- Define concrete evidence that would invalidate it
- If nothing could disprove it, it's a platitude, not a principle

## Output Schema
```yaml
principles:
  - principle_id: "P1"
    principle_statement: "[When context, action/observation because mechanism]"
    context: "[Where it applies]"
    action_or_observation: "[What to do or what happens]"
    mechanism: "[Why it works]"
    boundaries:
      applies_to: "[Where it applies]"
      does_not_apply_to: "[Where it doesn't apply]"
    retrospective_test: "passed/failed"
    novelty: "novel/known"
    if_known: "[Reference to known principle]"
    falsifiable_by: "[What evidence would disprove this]"
    derived_from:
      insights: ["I1", "I2"]
      sources: ["S1", "S2"]
    confidence: "high/medium/low"
```

## Example

```
From synthesis of 5 project post-mortems:

Insight: "Every project underestimated integration time"

Principle: "When building systems with N components,
           integration effort is proportional to the SQUARE of N,
           not N itself,
           because each pair of components has potential integration issues
           and pairs grow quadratically."

Context: Multi-component system development
Action: Budget integration time as O(N²), not O(N)
Mechanism: Pairwise interactions grow quadratically

Boundaries:
- Applies to: Tightly coupled systems
- Does not apply to: Loosely coupled with standardized interfaces (may be more linear)

Falsifiable by:
- Measure actual integration effort vs component count across projects
- If plot is linear, not quadratic, principle is wrong

Novelty: Related to Brooks's Law but specifically about integration time
```

## Principle Formulation Guidelines

### Be Specific Enough
Bad: "Integration is important"
Good: "Integration time scales quadratically with component count"

### Include Mechanism
Bad: "When teams communicate, projects succeed"
Good: "When teams communicate daily, misalignments are caught early, reducing rework by 30%"

### Make It Actionable
Bad: "Quality matters"
Good: "When quality gates are automated, defects in production drop by 60%"

### Ensure Falsifiability
Bad: "Good teams do good work"
Good: "Teams with <10% turnover outperform high-turnover teams on delivery predictability"

## Common Principle Pitfalls

### Tautologies
- "Successful projects have good management"
- True by definition, no predictive power

### Unfalsifiable
- "It depends on the situation"
- Can never be wrong, thus not useful

### Too Specific
- "Use PostgreSQL version 14.3 for this exact workload"
- Doesn't transfer to other contexts

### Too General
- "Be agile"
- No specific guidance

## Quality Checks
- [ ] Principles follow "When/action/because" structure
- [ ] Context clearly defined
- [ ] Mechanism specified
- [ ] Boundaries documented
- [ ] Retrospective test passed
- [ ] Novelty assessed
- [ ] Falsifiability specified
- [ ] Confidence rated

## Connections
- Uses: #501 (Core Insights)
- Feeds into: #505 (Actionability), final synthesis output
- Popper: Falsifiability requirement
- Goal: Durable, transferable knowledge
