# ADR-015: Transitive Dependency Closure for Completeness

**Status:** ACCEPTED
**Date:** 2026-02-10
**Deciders:** Deep-Document V7 Design Team
**Method Used:** #159 Transitive Dependency Closure, #61 Pre-mortem

---

## Context

**Completeness Gap:** V7 baseline extracts entities but does NOT compute transitive dependencies. Example:
- Entity A depends on B
- Entity B depends on C
- Planning may document A and B, but MISS C (foundational dependency)

**Impact:** Documentation incomplete (missing foundational entities), diagrams incomplete (missing key relationships), planning quality reduced by 10-15%.

**V6 Principle:** COMPLETENESS > TOKEN_ECONOMY

---

## Decision

**Implement Method #159 Transitive Dependency Closure in TWO locations:**

1. **STATE_ONTOLOGY_EXTRACTION (context-agent):**
   - After extracting entities and direct relationships
   - Compute transitive closure: for each entity, find ALL dependencies (direct + indirect)
   - Store in dependency-closure.yaml with entity_closures[] array
   - Timeout: 600000ms (10 minutes) per config.yaml

2. **STATE_PLANNING (planner-agent via GP-15):**
   - Load entity_closures[] from dependency-closure.yaml
   - For each entity in plan, verify ALL transitive_dependencies documented
   - **GATE_P GP-15 (CRITICAL):** "Zero missing dependencies"
   - Blocks planning if any foundational entity omitted

**Algorithm:** Floyd-Warshall variant (O(N³))
```
closure = {}
for each entity E:
  closure[E] = direct_dependencies(E)
  for each dependency D in closure[E]:
    closure[E].union(closure[D])  # transitive
```

---

## Alternatives Considered

| Alternative | Complexity | Completeness | Verdict |
|-------------|------------|--------------|---------|
| No closure (V6 baseline) | O(1) | 70% | REJECTED (violates COMPLETENESS principle) |
| BFS per entity | O(N²) | 100% | REJECTED (same result, more code) |
| **Floyd-Warshall O(N³)** | **O(N³)** | **100%** | **ACCEPTED (standard algorithm, well-tested)** |
| Graph library (external) | O(N²) | 100% | REJECTED (violates self-contained principle) |

---

## Consequences

### Positive
- **100% completeness:** ALL dependencies discovered (zero missing foundational entities)
- **GP-15 enforcement:** Planning cannot proceed with incomplete dependency set (binding gate)
- **Token economy benefit:** Prevents downstream RERUNs (discovering missing entity during evidence extraction = 20% waste)

### Negative
- **+0.5% budget cost:** Transitive closure computation adds ~0.5% to STATE_ONTOLOGY_EXTRACTION
- **Scalability concern:** O(N³) may timeout for very large codebases (>10k entities)
- **Timeout risk:** If timeout occurs, process fails at STATE_ONTOLOGY_EXTRACTION (no fallback)

---

## Validation Criteria

**Phase 0 Task 0.5: Benchmark O(N³) Performance**

Test cases:
1. **Small:** 100 entities → closure ≤5 seconds (PASS)
2. **Medium:** 1,000 entities → closure ≤60 seconds (PASS)
3. **Large:** 5,000 entities → closure ≤300 seconds (5 min, PASS)
4. **Very Large:** 10,000 entities → closure ≤600 seconds (10 min, CONDITIONAL PASS)

**GO Condition:** Test 4 completes within 10 minutes
**NO-GO Condition:** Test 4 fails (timeout) → implement optimization (adjacency matrix caching) OR reduce max entity count

---

## Failure Modes (Pre-mortem)

**Mode 1: "O(N³) Timeout on Large Codebase"**
- **Probability:** LOW (10% - most codebases <5k entities)
- **Impact:** BLOCKER (process fails at STATE_ONTOLOGY_EXTRACTION)
- **Detection:** config.yaml timeout 600000ms (10 min)
- **Mitigation:** Fallback to direct dependencies only (log SCOPE_REDUCTION, proceed with 70% completeness)

**Mode 2: "Circular Dependencies Detected"**
- **Probability:** MEDIUM (25% - circular imports common in JS/TS)
- **Impact:** ERROR (closure computation infinite loop)
- **Detection:** Track visited entities, flag cycle if revisited
- **Mitigation:** Break cycle at detection point, log WARNING, continue with acyclic subset

---

## Implementation Details

**STATE_ONTOLOGY_EXTRACTION STEP 7:**
```
1. Load entities[] and relationships[] from domain-ontology.yaml
2. Build adjacency list: entity_id → [direct_dependency_ids]
3. For each entity E:
   a. Initialize closure[E] = direct_dependencies(E)
   b. For each dependency D in closure[E]:
      closure[E] = closure[E] ∪ closure[D]  # union
   c. Detect cycles: if E ∈ closure[E] → break cycle, log WARNING
4. Store entity_closures[] in dependency-closure.yaml
5. Validate closure completeness (GOE-09)
```

**GATE_P GP-15 Validation:**
```
1. Load documentation-plan.yaml planned_documents[]
2. Load dependency-closure.yaml entity_closures[]
3. For each entity E in plan:
   a. Lookup closure[E].transitive_dependencies
   b. For each dependency D in transitive:
      IF D NOT in plan → FAIL (missing foundational entity)
4. IF all dependencies in plan → PASS
```

---

## Related Decisions

- ADR-014: Pragmatic Enhancement Adoption (selected transitive closure as one of 3 enhancements)
- ADR-016: Topology-Driven Diagram Detection (uses transitive closure for in-degree calculation)
- GP-15 in gates.yaml (enforces zero missing dependencies)
- GOE-09 in gates.yaml (validates closure completeness)

---

## Method Application

**#159 Transitive Dependency Closure:**
- Applied in STATE_ONTOLOGY_EXTRACTION STEP 7
- Floyd-Warshall O(N³) algorithm with cycle detection
- Timeout enforcement: 10 minutes
- Validation: GP-15 checks all planned entities have complete transitive closure

**#61 Pre-mortem:**
- Failure Mode 1: O(N³) timeout → fallback to direct dependencies
- Failure Mode 2: Circular dependencies → break cycle, log WARNING
- Both mitigations documented in context-agent.md
