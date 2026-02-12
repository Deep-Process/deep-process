# ADR-008: Template Decomposition Strategy

> **Note:** This ADR originated in Deep-Document V6 and applies to V7. The template decomposition algorithm and 8x ROI justification are shared between V6 and V7, with V7 implementing template analysis in STATE_TEMPLATE_ANALYSIS (vs V6's STATE_DETECTION).

## Status
**ACCEPTED** (2026-02-10)

## Context

### Problem Statement
Users provide custom templates defining documentation structure. V6.3.0 has template analysis (STATE_DETECTION) and coverage verification (INV-25, GP-09) but **NO specification** for decomposing template sections into multiple document files.

**Gemini Plan Deviation Analysis** (2026-02-10) revealed:
- User provided template: 1 file, 49 sections
- Gemini Plan v1: 8 documents (ignored template, used heuristics)
- Gemini Plan v2: 1 document (followed template literally)
- **Result**: User dissatisfaction, unnavigable monolithic document

**Root cause**: Missing decomposition algorithm connecting template analysis → document planning.

### User Observations
Direct quotes from user feedback:
- *"najgorsza dokumentacja jaką dało się stworzyć"* (worst documentation that could be created)
- 35% [UNKNOWN] sections, 2730-character paragraphs, flat H2-only structure
- Multi-file expectation: index, overview, architecture, data-models, etc.

### Gap in V6 Process
V6 Deep-Document has:
- ✅ Template analysis (STATE_DETECTION creates template-decomposition.yaml)
- ✅ Template coverage verification (INV-25 requires ≥90% sections)
- ✅ Template compliance checking (GP-09 verifies template parsing)
- ❌ **MISSING**: Rule for "How many document files should be generated from template?"
- ❌ **MISSING**: Rule for "How to map template sections to document files?"
- ❌ **MISSING**: Gate validating "Document architecture is navigable?"

## Decision

We add **GATE_P_ARCHITECTURE** with **binding decomposition algorithm** to systematically transform template sections into navigable multi-file documentation.

### Decomposition Algorithm (BINDING)

```
INPUT: template-decomposition.yaml (N sections)
OUTPUT: documentation-plan.yaml (M documents)

STEP 1: Count sections
  total_sections = len([s for s in sections if s.scope_decision == "INCLUDE"])
  h2_sections = len([s for s in sections if s.level == 2])

STEP 2: Determine file strategy
  IF total_sections <= 10:
    strategy = SINGLE_FILE
    target_files = 1
  ELIF total_sections <= 30:
    strategy = MULTI_FILE_SMALL
    target_files = 3-5 (prefer h2_count if in range)
  ELSE:
    strategy = MULTI_FILE_LARGE
    target_files = 5-10 (prefer h2_count if in range)

STEP 3: Apply grouping logic
  IF strategy == SINGLE_FILE:
    documents = [all_sections_in_one_file]

  ELSE:
    # Group by H2 boundaries
    groups = split_by_h2_headers(sections)

    # Apply size constraints
    groups = merge_small_groups(groups, min_size=5)
    groups = split_large_groups(groups, max_size=20)

    # Assign thematic filenames
    FOR group IN groups:
      filename = infer_thematic_name(group)  # architecture.md, data-models.md, etc.
      documents.append({doc_id, filename, sections: group})

STEP 4: Assign target_document
  FOR document IN documents:
    FOR section IN document.sections:
      section.target_document = document.doc_id

STEP 5: Validate architecture
  ASSERT 1 <= len(documents) <= 10  # Total files
  FOR doc IN documents:
    ASSERT 3 <= len(doc.sections) <= 20  # Sections per file

STEP 6: User confirmation
  PRESENT file structure with alternatives:
    [A] Single file (all sections)
    [B] Proposed multi-file (recommended)
    [C] Custom structure (user specifies)
  REQUIRE explicit approval

OUTPUT: documentation-plan.yaml with M documents
```

### Navigability Constraints

Based on **empirical evidence** (user observation + GitHub behavior):

| Constraint | Threshold | Rationale |
|------------|-----------|-----------|
| **Single file limit** | ≤10 sections | Small projects only, anything larger needs decomposition |
| **Per-file limit** | 5-20 sections | Goldilocks zone (not too small, not too large) |
| **Total files limit** | 1-10 files | Avoid both monolith (1 giant file) and fragmentation (50 tiny files) |
| **Estimated lines** | ≤2000 lines/file | GitHub markdown renders well, >3000 = slow |

### GATE_P_ARCHITECTURE Conditions

| ID | Check | Severity | Method |
|----|-------|----------|--------|
| GPA-01 | IF template ≥15 sections, THEN planned_documents ≥2 | BLOCKER | #167 Baseline Census |
| GPA-02 | Each document ≤20 sections | CRITICAL | #17 Abstraction Laddering |
| GPA-03 | Total files 1-10 (no fragmentation) | ERROR | #59 CUI BONO |
| GPA-04 | 100% sections assigned to document_id | CRITICAL | #84 Coherence Check |
| GPA-05 | Filenames follow thematic naming | WARNING | #100 Vocabulary Consistency |

### Counter-Checks

- **CC1** (Method #59 CUI BONO): Does structure benefit user or agent?
  - 1 file = fewer Write operations (agent convenience) ❌
  - N files = better navigation (user benefit) ✅

- **CC2** (Method #17 Abstraction Laddering): Is navigation intuitive?
  - Test: "Where do I find architecture info?" → Obvious from filename ✅

- **CC3** (Method #61 Pre-mortem): What would cause user rejection?
  - Too many files (>10) → Fragmentation
  - Files too large (>20 sections) → Unnavigable
  - Bad naming (generic) → Can't find content

## Rationale

### Why This Approach?

1. **COMPLETENESS > TOKEN_ECONOMY**: Algorithm covers ALL cases (small, medium, large templates)
2. **User-centric**: Multi-file default benefits navigation (CUI BONO: User)
3. **Binding**: GATE_P_ARCHITECTURE enforces (no agent discretion)
4. **Reversible**: User can override via CUSTOM option (flexibility)
5. **Grounded**: Based on empirical observation (Gemini case, user feedback)
6. **Deterministic**: Same input → same output (repeatability)

### Token Economy Analysis

**Scenario A** (without decomposition):
- Template: 49 sections
- Agent creates: 1 file
- User dissatisfied → RERUN with 8 files
- Cost: 2x full generation = 200% budget waste

**Scenario B** (with decomposition):
- Template: 49 sections
- Algorithm determines: 8 files (first time correct)
- User satisfied → No RERUN
- Cost: 1x generation = 100% budget

**ROI**: Prevents 1-2 RERUNs per project = 50-100% token savings

## Alternatives Considered

### Alternative 1: No decomposition (keep template as-is)
- **PRO**: Simplest implementation, follows template literally
- **CON**: Produces unnavigable monoliths (user harm)
- **CUI BONO**: Benefits agent (less work), harms user (poor UX)
- **REJECTED**: Fails user-centricity test

### Alternative 2: Always decompose (never single file)
- **PRO**: Consistent multi-file output
- **CON**: Over-fragments small projects (3 sections → 3 files = overkill)
- **REJECTED**: Violates COMPLETENESS (doesn't handle small templates well)

### Alternative 3: H1-based splitting
- **PRO**: Top-level hierarchy as file boundaries
- **CON**: Many templates have single H1 (no split), or too many H1s (>10 files)
- **REJECTED**: Unreliable heuristic, doesn't adapt

### Alternative 4: Fixed file count (always 8 files)
- **PRO**: Predictable structure
- **CON**: Doesn't adapt to template size (10 sections → 8 files = over-fragmentation)
- **REJECTED**: Not adaptive to project size

## Consequences

### Positive
- ✅ **Navigability**: Users get structured, navigable documentation
- ✅ **Predictability**: Deterministic algorithm (same input → same output)
- ✅ **User control**: Can override via CUSTOM option
- ✅ **Completeness**: Handles all template sizes (10, 30, 50+ sections)
- ✅ **V6 compliance**: Binding gate enforces (no agent shortcuts)
- ✅ **Token economy**: Prevents RERUN waste (50-100% savings)

### Negative
- ❌ **Complexity**: Adds ~200 lines to planner-agent.md
- ❌ **New gate**: Increases verification overhead (GATE_P_ARCHITECTURE)
- ❌ **Schema changes**: template-decomposition.yaml needs new fields (`target_document`, `document_group`)
- ❌ **Learning curve**: Users must understand file structure options (A/B/C)

### Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Threshold tuning** (15 sections trigger, 20 sections limit) | Medium | Low | Start conservative, collect metrics, adjust based on data |
| **Theme detection complexity** (grouping logic) | Medium | Medium | Use simple H2-based grouping first, enhance later with ML |
| **User override confusion** (A/B/C options) | Low | Medium | Clear descriptions, default recommendation [B] |
| **Algorithm bugs** (edge cases) | High | Low | Comprehensive test coverage (5 scenarios in test plan) |

## Metrics

Track these to validate decision:

1. **User satisfaction**: Post-generation survey (1-5 scale)
   - Target: ≥4.0/5.0

2. **File count distribution**: Histogram of M (1, 3-5, 5-10)
   - Expect: 70% in 3-5 range (medium projects)

3. **RERUN rate**: % of projects requiring file structure revision
   - Target: <10% (stable first-pass structure)

4. **Render performance**: Median markdown load time per file
   - Target: <500ms (fast navigation)

5. **Navigation time**: Time to find specific content in docs
   - Multi-file should be 50% faster than single file

**Success criteria**:
- User satisfaction ≥4.0/5.0
- RERUN rate <10%
- Render time <500ms per file
- Navigation 50% faster vs monolithic

## Implementation Timeline

- **2026-02-10**: ADR drafted
- **2026-02-10**: GATE_P_ARCHITECTURE added to gates.yaml
- **2026-02-10**: Decomposition algorithm added to planner-agent.md
- **2026-02-10**: Schema extended in context-agent.md (template-decomposition.yaml)
- **2026-02-10**: User confirmation added to orchestrator-agent.md
- **2026-02-10**: Documentation updated (reference.md, workflow.md)
- **2026-02-10**: Metadata updated (process.yaml v3.7.30, _manifest.yaml)

## Related Decisions

- **ADR-007**: Template Analysis ROI (8x token economy)
- **INV-25**: Template Completeness (≥90% coverage)
- **GP-09**: Template coverage verification
- **GATE_P**: Planning phase validation
- **V6.2.0 Quality Mechanisms**: Documentation quality layer (R1-R10, GG-10..14)

## References

- Gemini Plan Deviation Analysis (2026-02-10) — Root cause identification
- Method #167: Baseline Census Before Work
- Method #159: Transitive Dependency Closure
- Method #59: CUI BONO Test
- Method #17: Abstraction Laddering
- Method #61: Pre-mortem Analysis
- User feedback: "najgorsza dokumentacja" (worst documentation)

## Revision History

- **2026-02-10**: Initial version (v1.0.0) — ACCEPTED
- Status: ACTIVE
- Next review: After 10 projects using decomposition algorithm (measure metrics)

---

**Signature**: Every template decomposed, every section assigned, every file navigable.
