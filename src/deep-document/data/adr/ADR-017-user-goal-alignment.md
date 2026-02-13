# ADR-017: User-Goal Alignment Layer

**Status:** ACCEPTED
**Date:** 2026-02-10
**Deciders:** Deep-Document V7 Design Team
**Method Used:** #4 User Persona, #17 Abstraction Laddering, #59 CUI BONO

---

## Context

**Mechanical Documentation Problem:** V6 generates "code-structure" documentation that mirrors source code organization (e.g., all classes in API Reference, all types in Data Models) WITHOUT considering user goals or reading context.

**Example Issue:**
- User goal: "Understand how to deploy this service"
- V6 documentation: Deployment Guide has sections for all config files (alphabetically)
- Problem: User must search through 30 config files to find relevant deployment config
- Better approach: Group by deployment phase (build → test → deploy) or environment (dev → staging → prod)

**Impact:** Documentation is CORRECT but not USEFUL (54% of surveyed users found V6 docs "mechanical" and hard to navigate).

**Analysis Source:** Deep Explore V3.0 user feedback analysis (23 projects, 87 user interviews)

---

## Decision

**Implement User-Goal Alignment Layer in STATE_PLANNING:**

1. **Infer user goals from template sections:**
   - Template section "Deployment Guide" → user goal: "deploy service"
   - Template section "API Reference" → user goal: "integrate with API"
   - Template section "Architecture" → user goal: "understand system design"

2. **Organize entities by user goal (not code structure):**
   - Deployment Guide: group by phase (build → test → deploy) instead of alphabetically
   - API Reference: group by use case (authentication, data access, utilities) instead of class hierarchy
   - Architecture: group by layer (presentation → business → data) instead of package structure

3. **Add "Why" context:**
   - For each entity group, explain WHY this entity matters for the user goal
   - Example: "ConfigLoader is critical for deployment because it loads environment-specific settings"

4. **GATE_P GP-17 (WARNING):** "User-goal alignment applied (if template supports)"
   - Not CRITICAL (user-goal is enhancement, not correctness requirement)
   - Logs WARNING if template sections have no goal annotations

---

## Alternatives Considered

| Alternative | Improvement | Budget | Verdict |
|-------------|-------------|--------|---------|
| No user-goal (V6) | 0% | +0% | REJECTED (54% users find docs mechanical) |
| Manual goal tagging | +30% | +5% | REJECTED (manual effort, not scalable) |
| **Inferred from template** | **+15%** | **+0.5%** | **ACCEPTED (automated, good ROI)** |
| LLM-based goal inference | +25% | +3% | REJECTED (expensive, requires additional LLM calls) |

---

## Consequences

### Positive
- **+15% organization improvement:** Users find goal-aligned docs easier to navigate (survey feedback)
- **Automated:** No manual tagging required (inferred from template section titles)
- **Low cost:** +0.5% budget (planning phase extension only)

### Negative
- **Inference accuracy:** Goal inference may be wrong (e.g., "Deep Dive" section → unclear user goal)
- **Template dependency:** Only works if template sections have clear goal-oriented titles
- **Subjective:** User goals vary (developer vs operator vs architect) → one-size-fits-all may not suit everyone

---

## Validation Criteria

**Phase 0 Task 0.7: Validate User-Goal Alignment**

Test cases:
1. **Template A (goal-oriented):** Sections titled "How to Deploy", "How to Integrate" → goal inference 95% accurate (PASS)
2. **Template B (structure-oriented):** Sections titled "Classes", "Functions" → goal inference 30% accurate (FAIL)
3. **Template C (mixed):** Some goal-oriented, some structure-oriented → goal inference 60% accurate (CONDITIONAL)

**GO Condition:** Test 1 shows ≥80% accuracy for goal-oriented templates
**CONDITIONAL GO:** Test 3 shows ≥50% accuracy for mixed templates
**NO-GO:** Test 2 shows <30% accuracy → abandon user-goal layer OR require manual goal annotation

---

## Failure Modes (Pre-mortem)

**Mode 1: "Goal Inference Incorrect"**
- **Probability:** MEDIUM (30%)
- **Impact:** WARNING (entities grouped incorrectly, user confused)
- **Detection:** User feedback, manual review
- **Mitigation:** Fallback to code-structure grouping if goal inference confidence <0.50

**Mode 2: "Template Sections Not Goal-Oriented"**
- **Probability:** LOW (20% - most templates have goal-oriented sections)
- **Impact:** WARNING (user-goal layer inactive, falls back to code-structure)
- **Detection:** GP-17 logs WARNING if no goal annotations found
- **Mitigation:** Document in validation report "User-goal alignment not applicable for this template"

---

## Implementation Details

**STATE_PLANNING Goal Inference Algorithm:**
```
1. For each template section S:
   a. Extract section title (e.g., "Deployment Guide")
   b. Infer user goal from title keywords:
      - Keywords: "deploy", "installation" → goal = "deploy service"
      - Keywords: "API", "reference", "integrate" → goal = "integrate with API"
      - Keywords: "architecture", "design" → goal = "understand system"
      - Keywords: "troubleshoot", "debug" → goal = "fix issues"
      - No keywords → goal = UNKNOWN (fallback to code-structure)

2. For each entity E in section:
   a. Classify relevance to goal (HIGH/MEDIUM/LOW)
   b. Group by goal phase or category:
      - Deployment: build → test → deploy
      - API: authentication → data access → utilities
      - Architecture: presentation → business → data
   c. Add "Why" context: explain relevance to goal

3. Validate goal coverage:
   IF ≥50% sections have goals → user-goal alignment APPLIED
   ELSE → FALLBACK to code-structure, log GP-17 WARNING
```

**GATE_P GP-17 Validation:**
```
1. Load documentation-plan.yaml
2. Check for goal_alignment{} metadata
3. IF goal_alignment exists AND coverage ≥50%:
   PASS (user-goal applied)
   ELSE:
   WARNING (user-goal not applicable or failed, code-structure used)
```

---

## User Goal Taxonomy

| Section Type | User Goal | Organization Strategy |
|--------------|-----------|----------------------|
| Deployment | "Deploy service" | Phase-based (build → test → deploy) |
| API Reference | "Integrate with API" | Use-case-based (auth → data → utils) |
| Architecture | "Understand system" | Layer-based (presentation → business → data) |
| Troubleshooting | "Fix issues" | Symptom-based (error messages → solutions) |
| Data Models | "Model domain" | Entity-relationship-based (core → supporting) |
| Deep Dive | "Implement feature" | Algorithm-based (input → process → output) |

---

## Example Transformation

**BEFORE (Code-Structure Grouping):**
```
## Deployment Guide

### Configuration Files (alphabetical)
- app-config.yaml
- build-config.yaml
- db-config.yaml
- deploy-config.yaml
- env-config.yaml
- test-config.yaml
... (30 files)
```

**AFTER (User-Goal Alignment):**
```
## Deployment Guide

### Build Phase
- **build-config.yaml**: Defines build steps and dependencies
- **app-config.yaml**: Application settings for production

### Test Phase
- **test-config.yaml**: Test suite configuration
- **env-config.yaml**: Environment variables for testing

### Deploy Phase
- **deploy-config.yaml**: Deployment targets and strategies
- **db-config.yaml**: Database connection for production
```

---

## Related Decisions

- ADR-014: Pragmatic Enhancement Adoption (selected user-goal as one of 3 enhancements)
- GP-17 in gates.yaml (validates user-goal alignment applied)
- planner-agent.md (implements goal inference algorithm)

---

## Method Application

**#4 User Persona:**
- Identified 3 user personas: Developer (API integration), Operator (deployment), Architect (system design)
- Each persona has different goals and reading patterns
- Goal inference algorithm addresses all 3 personas

**#17 Abstraction Laddering:**
- Level 1 (Code Structure): Classes, Functions, Types (mechanical)
- Level 2 (User Goals): "How to deploy", "How to integrate" (useful)
- Level 3 (Business Value): "Deliver value to customers" (too abstract)
- Decision: Operate at Level 2 (user goals)

**#59 CUI BONO:**
- Code-structure grouping benefits AGENT (easier to generate, mirrors source)
- User-goal alignment benefits USER (easier to navigate, task-oriented)
- Decision: Prioritize user benefit
