# 301 - Convergence-Divergence Mapping

## Phase
RELATE

## Purpose
For every pair of claims: do they agree, disagree, or address different aspects? This mapping reveals the relationship structure between knowledge atoms — the foundation for integration.

## Relationship Types

| Relationship | Definition | Synthesis Action |
|-------------|------------|-----------------|
| **Convergence** | Multiple sources make same/similar claim | Strengthens confidence — especially valuable if sources used different methods (triangulation) |
| **Divergence** | Sources contradict each other | MOST VALUABLE — requires understanding WHY. Resolve or preserve as productive tension |
| **Complementarity** | Sources address different aspects of same topic | Combine for more complete picture |
| **Independence** | No meaningful relationship | May or may not be relevant |
| **Dependency** | Claim B is only true IF claim A is true | Create conditional chains |
| **Subsumption** | Claim A is a special case of broader claim B | Organize into hierarchies |

## Procedure

### Step 1: Pairwise Comparison
For key claims from #201: compare pairs
- Not all pairs need analysis — focus on claims related to synthesis question
- Start with highest-quality claims (from #204)

### Step 2: Relationship Classification
For each pair: determine relationship type
- Apply the definition that best fits
- Document reasoning for classification

### Step 3: Divergence Deep-Dive
For each divergence: understand WHY
- Different data? → Check data quality
- Different methods? → Potential triangulation issue
- Different assumptions? → Check #205
- Different levels of analysis? → Check #307
- Different paradigms? → Potential Kuhn conflict

### Step 4: Priority Assignment
Rate synthesis priority for each relationship
- Divergences = highest priority (synthesis opportunity)
- Convergences across diverse sources = high priority (strong evidence)
- Complements = medium priority (coverage expansion)
- Dependencies/Subsumptions = lower but needed for structure

### Step 5: Relationship Graph Construction
Build graph representation
- Nodes = claims
- Edges = relationships (typed and weighted)
- Visualize or document structure

## Output Schema
```yaml
relationships:
  - claim_a_id: "C1"
    claim_b_id: "C2"
    relationship_type: "convergence/divergence/complementarity/independence/dependency/subsumption"
    explanation: "[Why this relationship]"
    if_divergence:
      reason: "[Why they diverge]"
      resolution_needed: true/false
    synthesis_priority: "high/medium/low"
  relationship_summary:
    convergences: N
    divergences: N
    complements: N
    key_divergences_requiring_resolution:
      - "[Description of critical divergence]"
```

## Convergence Analysis

### Strong Convergence (High Confidence)
- Same conclusion
- Different methods
- Different sources
- Independent data
→ Triangulation achieved

### Weak Convergence (Lower Confidence)
- Same conclusion
- Same method
- Same paradigm
- Possibly shared data source
→ May be echo chamber

## Divergence Analysis

### Productive Divergence
- Sources disagree
- Both have valid evidence
- Disagreement points to deeper complexity
→ Synthesis opportunity

### False Divergence
- Appears contradictory
- Actually addresses different scopes/contexts/levels
→ Not real disagreement, just different domains

### Paradigm Divergence
- Sources disagree
- Disagreement rooted in paradigm difference
- Terms mean different things
→ Requires translation before resolution

## Quality Checks
- [ ] Key claims mapped pairwise
- [ ] Relationship types assigned
- [ ] Divergences analyzed for cause
- [ ] Priorities assigned
- [ ] Graph structure documented or visualized

## Connections
- Uses: #201 (Claims), #202 (Taxonomy), #204 (Evidence Grades), #205 (Assumptions)
- Feeds into: #302 (Dialectical Tension), #306 (Pattern Detection), #401 (Dialectical Integration)
- Core of: Understanding source relationships
