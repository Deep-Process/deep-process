# #209 Cognitive Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if the team can UNDERSTAND what they're building

## Theoretical Foundation

Grounded in Ashby's Requisite Variety and George Miller's "7±2" cognitive limit. A system that exceeds the cognitive capacity of its builders/operators is infeasible even if each component is individually understandable.

**Key insight:** Complexity that exceeds working memory leads to inevitable errors. If you can't hold the system in your head, you can't maintain it.

## Cognitive Limits

| Limit | Value | Implication |
|-------|-------|-------------|
| Working memory | 7±2 items | Can't hold more than ~7 independent concepts simultaneously |
| Coupling explosion | n² | Each interaction adds cognitive load |
| Abstraction depth | ~3-4 levels | Beyond this, mental model breaks down |
| Onboarding time | 3 months warning | If onboarding > 3 months, system may be too complex |

## Step-by-step

### Step 1: Count Independent Concepts

How many independent things must someone understand to:

| Activity | Concept Count |
|----------|---------------|
| Design the system | ___ |
| Modify a component | ___ |
| Debug production issue | ___ |
| Onboard new team member | ___ |

```
Example concepts for data pipeline:
1. Ingestion flow
2. Transformation logic
3. Business rules
4. Storage layer
5. Query patterns
6. Error handling
7. Monitoring
8. Security model
9. Deployment process
...

If count > 7-9: Risk of cognitive overload
```

### Step 2: Assess Concept Coupling

How many concepts interact with each other?

| Coupling Degree | Cognitive Load |
|-----------------|---------------|
| Low (concepts independent) | Manageable |
| Medium (some interactions) | Challenging |
| High (everything connected) | Overwhelming |

```
Coupling matrix:
              A B C D E
Concept A     - Y Y N N
Concept B     Y - Y Y N
Concept C     Y Y - N Y
Concept D     N Y N - Y
Concept E     N N Y Y -

Coupling count: 8 of 10 possible
Coupling degree: High
```

### Step 3: Evaluate Abstraction Quality

Do good abstractions reduce cognitive load?

| Abstraction Quality | Sign |
|---------------------|------|
| Good | Can use without understanding implementation |
| Leaky | Must understand implementation to use correctly |
| Missing | No abstraction, must understand everything |

```
Example:
• Data ingestion API: Good abstraction ✓
• Transformation layer: Leaky — must understand internals
• Error handling: Missing — ad-hoc everywhere
```

### Step 4: Estimate Onboarding Time

How long for a competent engineer to become productive?

| Time | Assessment |
|------|------------|
| < 2 weeks | Well-designed, good docs |
| 2-6 weeks | Normal complexity |
| 6-12 weeks | Complex but manageable |
| > 12 weeks | Cognitive feasibility risk |

### Step 5: Score Cognitive Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Concept count < 7, low coupling, good abstractions |
| 4 | Manageable concepts, moderate coupling |
| 3 | High concept count OR high coupling, onboarding 6-12 weeks |
| 2 | Both high count AND coupling, onboarding > 12 weeks |
| 1 | Exceeds cognitive limits, cannot be maintained |

## Output format

```yaml
cognitive_feasibility:
  score: 4
  confidence: "H"

  concept_count:
    design: 8
    modification: 6
    debugging: 9
    onboarding: 12
    assessment: "At upper limit for debugging/onboarding"

  coupling_analysis:
    total_concepts: 12
    possible_couplings: 66  # n(n-1)/2
    actual_couplings: 24
    coupling_degree: "Medium"
    highly_coupled_concepts:
      - "Transformation ↔ Business Rules"
      - "Error Handling ↔ Everything"

  abstraction_quality:
    - layer: "Data Ingestion"
      quality: "Good"
      notes: "Clean API, internals hidden"
    - layer: "Transformation"
      quality: "Medium"
      notes: "Some leaky abstractions around business rules"
    - layer: "Error Handling"
      quality: "Poor"
      notes: "No consistent pattern, must understand each case"
      improvement: "Implement consistent error handling framework"

  onboarding_estimate:
    time: "4-6 weeks"
    bottlenecks:
      - "Business rules complexity"
      - "Mars data quirks"
    improvements:
      - "Document key concepts"
      - "Create architecture diagram"

  recommendations:
    - "Improve error handling abstraction"
    - "Document top 7 concepts for quick reference"
    - "Create onboarding guide for new team members"
```

## Integration Points

- **Feeds from:** Architecture design, complexity analysis
- **Feeds to:** #401 Overall profile, documentation recommendations

## Common Pitfalls

- **Expert blindness:** Experts forget how hard it was to learn
- **Incremental complexity:** Each addition is "small" but total is overwhelming
- **Documentation as solution:** Docs don't reduce inherent complexity
- **Abstraction theater:** Abstractions that don't actually simplify
