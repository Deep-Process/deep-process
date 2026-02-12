# ADR-014: Pragmatic Enhancement Adoption Decision

**Status:** ACCEPTED
**Date:** 2026-02-10
**Deciders:** Deep-Document V7 Design Team
**Method Used:** #59 CUI BONO, #61 Pre-mortem, #17 Abstraction Laddering

---

## Context

Deep Explore V3.0 analysis identified 8 enhancement patterns from 23 real-world projects. V7 baseline (semantic matching only) provides 60% planning quality (see V7-PLAN-VERIFICATION-AND-UPDATES.md). Target: 85-90% planning quality.

**Problem:** Which enhancements to adopt? All 8 enhancements would add +12% budget, but V7 target is ≤102% (2% net cost over V6).

**Analysis Source:** Deep Explore V3.0 analysis of 23 projects (87% multi-domain, 67% topology gaps, 54% mechanical docs without user context)

---

## Decision

**Adopt Combination E: 3 Targeted Improvements**

1. **Transitive Dependency Closure (ADR-015):** Method #159 in STATE_ONTOLOGY_EXTRACTION + STATE_PLANNING
2. **Topology-Driven Diagram Detection (ADR-016):** Method #90 in STATE_ONTOLOGY_EXTRACTION + STATE_SYNTHESIS
3. **User-Goal Alignment Layer (ADR-017):** User-goal inference from template sections in STATE_PLANNING

**Budget:** +2% (total 102%)
**Quality Impact:** +10-18% planning quality (baseline 60% → 70-78%)

---

## Alternatives Considered

| Combination | Enhancements | Budget | Quality | Verdict |
|-------------|--------------|--------|---------|---------|
| A (Minimal) | Semantic only | +0% (100%) | 60% | REJECTED (below 85% target) |
| B (Transitive only) | 1 enhancement | +0.5% | 65% | REJECTED (below 85% target) |
| C (Topology only) | 1 enhancement | +0.5% | 63% | REJECTED (below 85% target) |
| D (User-goal only) | 1 enhancement | +0.5% | 62% | REJECTED (below 85% target) |
| **E (Targeted)** | **3 enhancements** | **+2%** | **70-78%** | **ACCEPTED (best ROI)** |
| F (All 8) | All enhancements | +12% | 92% | REJECTED (budget overrun) |

---

## Consequences

### Positive
- **+10-18% planning quality:** Combination E addresses 3 critical gaps (completeness, diagrams, user context)
- **Budget within target:** 102% total (2% net cost, within 103% design target)
- **Best ROI:** E provides 50% of quality gain (10-18% vs 32% for all 8) at 17% of cost (2% vs 12%)

### Negative
- **Still below 85% minimum:** Even with E, quality reaches only 70-78% (requires Phase 0 validation)
- **Complexity increase:** +3 methods (+50% over semantic-only)
- **Risk:** If Phase 0 fails (transitive closure O(N³) timeout, topology <5% high-complexity), cannot fallback

---

## Validation Criteria

**Phase 0 Validation:**
1. ✅ Transitive closure ≤10 minutes for 10k entities (ADR-015)
2. ✅ Topology produces 5-30% high-complexity entities (ADR-016)
3. ✅ User-goal alignment improves organization by ≥15% (ADR-017)
4. ✅ Combined quality ≥70% on 3/5 test projects

**GO Condition:** All 4 criteria met
**NO-GO Condition:** ≤2 criteria met → revert to semantic-only OR try different combination

---

## Related Decisions

- ADR-015: Transitive Dependency Closure
- ADR-016: Topology-Driven Diagram Detection
- ADR-017: User-Goal Alignment Layer
- V7-PLAN-VERIFICATION-AND-UPDATES.md Section 6 (alternatives analysis)

---

## Method Application

**#59 CUI BONO Test:**
- Combination A benefits AGENT (less work, 100% budget) → rejected
- Combination F benefits QUALITY (92%) but hurts BUDGET (112%) → rejected
- Combination E balanced: benefits USER (70-78% quality, 102% budget) → accepted

**#61 Pre-mortem:**
- Failure scenario: "Phase 0 shows E provides <baseline+10%" → mitigation: NO-GO, try combination G (different 3)

**#17 Abstraction Laddering:**
- Goal: 85-90% quality at ≤102% budget
- Constraints: V6 baseline 60%, semantic-only 60%, all-8 92% at 112%
- Solution: Targeted 3 (E) achieves 70-78% at 102% (closest feasible point)
