# ADR-016: Topology-Driven Diagram Detection

**Status:** ACCEPTED
**Date:** 2026-02-10
**Deciders:** Deep-Document V7 Design Team
**Method Used:** #90 Dependency Topology Mapping, #61 Pre-mortem

---

## Context

**Diagram Gap:** V6 diagram detection uses pattern-based triggers only (e.g., "if AWS CDK detected → generate stack diagram"). Analysis of 23 projects shows pattern-only triggers miss 67% of complex entities.

**Example Missed Scenario:**
- Codebase has UserService with 25 incoming dependencies (high complexity)
- No pattern trigger matches UserService (not AWS, not React, not specific framework)
- Result: UserService omitted from diagrams despite being architecturally critical

**Impact:** Architecture documentation incomplete (missing key components), diagrams show only pattern-matched entities (not complexity-based importance).

---

## Decision

**Implement Method #90 Dependency Topology Mapping in TWO locations:**

1. **STATE_ONTOLOGY_EXTRACTION (context-agent):**
   - After computing transitive closure (ADR-015)
   - Calculate 4 topology metrics for EVERY entity:
     - **In-Degree:** Number of entities that depend on this entity (incoming edges)
     - **Out-Degree:** Number of entities this entity depends on (outgoing edges)
     - **Centrality Score:** Normalized in-degree (0.0-1.0)
     - **Complexity Class:** HIGH (top 20%), MEDIUM (next 30%), LOW (bottom 50%)
   - Store in entity_closures[].topology_metrics{}

2. **STATE_SYNTHESIS (architect-agent):**
   - Load topology_summary.diagram_triggers[] (HIGH complexity entities)
   - Generate diagrams for entities with complexity_class = "HIGH"
   - **ADR-021:** Batch generation (5 diagrams at a time with CONTEXT PURGE)

**Target Distribution:** 5-30% entities classified as HIGH complexity (per config.yaml thresholds)

---

## Alternatives Considered

| Alternative | Coverage | Budget | Verdict |
|-------------|----------|--------|---------|
| Pattern-only (V6) | 33% | +0% | REJECTED (misses 67% of complex entities) |
| PageRank algorithm | 90% | +2% | REJECTED (overkill, complex implementation) |
| **Degree centrality (simple)** | **80%** | **+0.5%** | **ACCEPTED (good coverage, simple)** |
| Manual entity tagging | 100% | +5% | REJECTED (manual effort, not automated) |

---

## Consequences

### Positive
- **+20-30% more diagrams:** Topology-driven detection finds complex entities pattern-only misses
- **Importance-based diagrams:** High-centrality entities featured (UserService with 25 dependencies → diagram generated)
- **Simple algorithm:** In-degree/out-degree calculation is O(N²), well within budget

### Negative
- **+0.5% budget cost:** Topology calculation adds ~0.5% to STATE_ONTOLOGY_EXTRACTION
- **Threshold tuning needed:** Config.yaml thresholds must produce 5-30% HIGH complexity distribution
- **False positives possible:** Utility classes with high in-degree may be flagged (but low semantic importance)

---

## Validation Criteria

**Phase 0 Task 0.6: Validate Topology Distribution**

Test cases:
1. **Uniform graph:** 100 entities, all degree=5 → 0% HIGH complexity (PASS - no high-degree nodes)
2. **Star graph:** 1 hub entity, 99 leaf entities → 1% HIGH complexity (hub only, PASS)
3. **Hierarchical graph:** 10 high-degree, 30 medium, 60 low → 10% HIGH, 30% MEDIUM, 60% LOW (PASS)
4. **Real codebase:** 23-project analysis → 5-30% HIGH complexity (PASS)

**GO Condition:** Test 4 shows 5-30% HIGH in ≥70% of projects
**NO-GO Condition:** Test 4 shows <5% HIGH in >50% of projects → adjust thresholds OR abandon topology-driven diagrams

---

## Failure Modes (Pre-mortem)

**Mode 1: "Too Few HIGH Complexity Entities (<5%)"**
- **Probability:** LOW (15%)
- **Impact:** ERROR (topology-driven diagrams generate <expected, pattern-only still better)
- **Detection:** GOE-10 WARNING if HIGH complexity <5%
- **Mitigation:** Lower high_threshold in config.yaml OR fallback to pattern-only

**Mode 2: "Too Many HIGH Complexity Entities (>30%)"**
- **Probability:** MEDIUM (25%)
- **Impact:** WARNING (too many diagrams, cluttered architecture docs)
- **Detection:** GOE-10 WARNING if HIGH complexity >30%
- **Mitigation:** Raise high_threshold in config.yaml OR add secondary filter (e.g., semantic importance)

**Mode 3: "O(N²) Performance Degradation"**
- **Probability:** LOW (10%)
- **Impact:** ERROR (topology calculation slow for >10k entities)
- **Detection:** Timeout monitoring
- **Mitigation:** Optimize with adjacency matrix OR limit entity count

---

## Implementation Details

**STATE_ONTOLOGY_EXTRACTION STEP 8 (after STEP 7 transitive closure):**
```
1. For each entity E:
   a. Compute in_degree[E]:
      FOR each other entity X:
        IF E ∈ X.transitive_dependencies:
          in_degree[E] += 1

   b. Compute out_degree[E]:
      out_degree[E] = count(E.transitive_dependencies)

   c. Compute centrality_score[E]:
      max_in_degree = max(in_degree across all entities)
      IF max_in_degree > 0:
        centrality_score[E] = in_degree[E] / max_in_degree
      ELSE:
        centrality_score[E] = 0.0

   d. Classify complexity_class[E]:
      total_degree = in_degree[E] + out_degree[E]
      IF total_degree > config.high_threshold:
        complexity_class[E] = "HIGH"
      ELIF total_degree > config.medium_threshold:
        complexity_class[E] = "MEDIUM"
      ELSE:
        complexity_class[E] = "LOW"

2. Populate diagram_triggers[] with HIGH complexity entities
3. Store topology_metrics{} in entity_closures[]
4. Validate distribution (GOE-10)
```

**STATE_SYNTHESIS Diagram Generation:**
```
1. Load topology_summary.diagram_triggers[]
2. For each HIGH complexity entity:
   a. Generate component diagram showing dependencies
   b. Annotate with centrality_score (e.g., "UserService (centrality: 0.85)")
   c. Add to diagram_plan[]
3. Batch generation: 5 diagrams at a time (ADR-021)
4. CONTEXT PURGE between batches
```

---

## Configuration (config.yaml)

```yaml
topology:
  high_threshold: 15        # total_degree > 15 → HIGH
  medium_threshold: 8       # total_degree > 8 → MEDIUM
  target_high_ratio: 0.20   # Target: 20% HIGH complexity
  centrality_weights:
    in_degree: 0.60         # In-degree weight (who depends on me)
    out_degree: 0.40        # Out-degree weight (who I depend on)
```

---

## Related Decisions

- ADR-014: Pragmatic Enhancement Adoption (selected topology as one of 3 enhancements)
- ADR-015: Transitive Dependency Closure (topology uses transitive closure for in-degree calculation)
- ADR-021: Batched Diagram Generation (topology-driven diagrams generated in batches of 5)
- GOE-10 in gates.yaml (validates topology metrics presence)
- GP-16 in gates.yaml (centrality prioritization in planning)

---

## Method Application

**#90 Dependency Topology Mapping:**
- Applied in STATE_ONTOLOGY_EXTRACTION STEP 8
- 4 metrics: in_degree, out_degree, centrality_score, complexity_class
- O(N²) algorithm for in_degree calculation
- Target distribution: 5-30% HIGH complexity

**#61 Pre-mortem:**
- Failure Mode 1: <5% HIGH → lower thresholds
- Failure Mode 2: >30% HIGH → raise thresholds
- Failure Mode 3: O(N²) slow → optimize with matrix
- All mitigations documented in config.yaml and context-agent.md
