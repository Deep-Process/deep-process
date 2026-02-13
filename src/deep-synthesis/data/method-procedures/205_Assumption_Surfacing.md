# 205 - Assumption Surfacing

## Phase
DECOMPOSE

## Purpose
Make EXPLICIT the implicit assumptions that each source carries. Assumptions are the hidden load-bearing elements — when they break, everything built on them collapses. Diverging assumptions are often the real source of disagreement between sources.

## Assumption Categories

| Category | Question | Example |
|----------|----------|---------|
| **Domain** | What does the source assume about the problem space? | "Customers want this feature" |
| **Technical** | What technical facts are taken for granted? | "The system can handle this load" |
| **Temporal** | What's assumed about time and change? | "This will still be true in 12 months" |
| **Methodological** | What's assumed about how knowledge is obtained? | "Our measurement captures reality" |
| **Paradigmatic** | What worldview is taken for granted? | "Agile is the right approach" |
| **Organizational** | What's assumed about people and process? | "The team has the skills for this" |
| **Economic** | What's assumed about costs and resources? | "Budget will be available" |

## Procedure

### Step 1: Explicit Assumption Listing
For each source: what does it ASSUME that it doesn't state?
- Read claims and ask "what must be true for this claim to hold?"
- Look for unstated prerequisites
- Identify background beliefs taken for granted

### Step 2: Category Assignment
Classify each assumption by category
- Some assumptions span multiple categories
- Note which category is most critical

### Step 3: Explicit vs Surfaced Marking
Distinguish assumptions
- **Explicit:** Stated by the source
- **Surfaced:** Identified through analysis but not stated

### Step 4: Cross-Source Comparison
Compare assumptions across sources
- Where do assumptions ALIGN? → Common ground
- Where do assumptions DIVERGE? → Potential conflict source
- Where is one source's assumption another's claim? → Opportunity for validation

### Step 5: Criticality Assessment
Evaluate how critical each assumption is
- If this assumption is wrong, what happens to the conclusions?
- Which assumptions are load-bearing vs incidental?

## Output Schema
```yaml
assumptions:
  - source_id: "S1"
    assumption: "[The assumption]"
    category: "domain/technical/temporal/methodological/paradigmatic/organizational/economic"
    explicit_or_surfaced: "explicit/surfaced"
    criticality: "high/medium/low"
    if_wrong: "[What happens if this assumption fails]"
  divergences:
    - assumption_topic: "[What the assumption is about]"
      source_a: "S1"
      source_a_assumption: "[What S1 assumes]"
      source_b: "S2"
      source_b_assumption: "[What S2 assumes]"
      implication: "[Why this divergence matters for synthesis]"
  alignments:
    - assumption: "[Shared assumption]"
      sources: ["S1", "S2", "S3"]
      confidence_boost: "[Why alignment increases confidence]"
```

## Detection Techniques

### For Domain Assumptions
- "Why does the source think this matters?"
- "Who is the source assuming as the audience?"
- "What problem definition is taken for granted?"

### For Technical Assumptions
- "What technical capabilities are assumed to exist?"
- "What performance characteristics are assumed?"
- "What integrations are assumed to work?"

### For Temporal Assumptions
- "What's assumed about past events?"
- "What's assumed to stay stable?"
- "What change rate is assumed?"

### For Methodological Assumptions
- "How does the source think knowledge is obtained?"
- "What counts as evidence for this source?"
- "What's assumed about measurement validity?"

### For Paradigmatic Assumptions
- "What fundamental beliefs underlie this source?"
- "What would this source never question?"
- "What alternative worldview would this source reject?"

## Quality Checks
- [ ] All sources analyzed for assumptions
- [ ] Both explicit and surfaced assumptions captured
- [ ] Categories assigned
- [ ] Criticality assessed
- [ ] Divergences identified and documented
- [ ] Alignments noted with confidence implications

## Connections
- Uses: #201 (Claim Extraction), #203 (Model Inventory)
- Feeds into: #302 (Dialectical Tension), #401 (Dialectical Integration)
- Critical for: Understanding WHY sources disagree
- Grounded in: Critical thinking traditions, assumption-based planning
