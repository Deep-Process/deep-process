---
step: 3
name: "DOCUMENTATION"
time_estimate: "30-45 minutes"
goal: "Write documentation sections with evidence from knowledge-map. Apply quality rules."
requires_completion: true
next_steps: ["step-04-verification"]
data_dependencies:
  - "documentation-plan.yaml"
  - "knowledge-map.yaml"
outputs:
  - artifact: "docs/*.md"
    location: "docs/"
    schema: "Markdown files following template structure"
    consumers: ["step-04-verification", "User (final deliverable)"]
  - artifact: "entity-log.yaml"
    location: "deep-artifacts/entity-log.yaml"
    schema: "Entity tracking per section (documented entities, counts, coverage)"
    consumers: ["step-04-verification"]
---

# PHASE 3: DOCUMENTATION

## ENFORCED SEQUENCE

### STEP 1: Load Plan (1 min)
Read `documentation-plan.yaml` → Extract `writing_order[]`, `section_mappings[]`

### STEP 2: Write Sections in Order (25-40 min)

For each section in `writing_order[]`:

**2.1 Gather Evidence (2-3 min per section)** **[UPDATED — Uses semantic intent]**
- Load `section_mappings[].semantic_intent{}` → Read purpose, depth, entity_expectation
- Load knowledge items from `section_mappings[].knowledge_sources[]`
- Read relevant flows/schemas/decisions from `knowledge-map.yaml`
- **IF entity_expectation = "all":** Load ALL knowledge items of matching type. Count them. Verify count matches `entity_census_check.expected`. IF items missing → re-read knowledge-map.yaml to find missing items BEFORE writing.
- **IF entity_expectation = "primary":** Load items tagged as entry_points or core_domain.
- **IF entity_expectation = "selective":** Load items matching section-specific criteria only.

**2.2 Write Narrative (5-8 min per section)** **[UPDATED — Depth-driven writing]**

**CRITICAL: Adapt writing to DEPTH level from semantic_intent:**

| DEPTH | Writing Approach |
|-------|-----------------|
| `overview` | Summary paragraph per topic. No per-entity detail. 50-100 words/entity. |
| `standard` | Description + key properties per entity. 100-200 words/entity. |
| `detailed` | Full description + code examples + relationships per entity. 200-400 words/entity. |
| `deep-dive` | Implementation internals + edge cases + alternatives per entity. 400-800 words/entity. |

**CRITICAL: Enumerate entities based on ENTITY_EXPECTATION:**
- `all` → Write EVERY entity. Use tables for ≥5 entities with ≥3 properties. Group by category.
- `primary` → Write core entities only. Mention others in summary list.
- `selective` → Write only criteria-matching entities. State selection criteria.
- `none` → No per-entity writing. Narrative/procedural content only.

Apply **quality rules**:

**R1: Paragraph length ≤300 characters**
- Break long explanations into multiple paragraphs
- ONE idea per paragraph

**R2: Structure decomposition**
- Use H2/H3/H4 headings (depth ≥2.0)
- Don't write flat H2-only structure

**R3: Tables for ≥5 items with ≥3 properties**
- Example: API endpoints table (Method, Path, Request, Response, Status)

**R4: Lists for ≥3 items**
- Example: Bullet list of configuration variables

**R5: 70/30 citation strategy**
- 70% narrative in-text, 30% citations at end
- NOT 100% inline citations interrupting flow

**R6: [UNKNOWN] minimization <10%**
- Mark unknown only when truly unknown
- Prefer evidence-based statements

**R7: Progressive disclosure**
- Overview → Details → Examples

**R8: Code examples**
- Include relevant code snippets with line references

**2.3 Entity Log (per section with entity_expectation="all")**

After writing each section, log which entities were documented:
```yaml
entity_log:
  - section_id: "S-002"
    section_title: "Data Models"
    entity_expectation: "all"
    entity_type: "tables"
    census_expected: 39
    documented_entities:
      - "D-001: User"
      - "D-002: Product"
      - "D-003: Order"
      # ... all documented entities
    documented_count: 39
    coverage: 100%
    missing: []
```

**CRITICAL:** Entity log is consumed by Phase 4 (STEP 3.5) for completeness verification. Without entity_log, Phase 4 must parse entity names from free-text markdown — fragile and error-prone.

Write entity_log to `deep-artifacts/entity-log.yaml` after all sections are written.

**2.4 Quality Check (1 min per section)**
- Scan for paragraphs >300 chars → split
- Verify structure depth ≥2.0
- Count [UNKNOWN] → if >10% of section, flag

### STEP 3: Write Documentation Files (2-3 min)

1. Use Write tool to create `docs/` directory files
2. Follow template structure (section order, heading levels)
3. Include frontmatter if template specifies

---

## GATE_3 Evaluation

**Conditions:**
1. **G3-01:** All sections written (per documentation-plan)
2. **G3-02:** Quality gates pass:
   - Paragraph length ≤300 chars (scan all paragraphs)
   - Structure depth ≥2.0 (calculate avg heading depth)
   - [UNKNOWN] ratio <10% (count occurrences)
   - Citation density ≤30% (count inline citations)
3. **G3-03:** Evidence citations present (each claim has file:line reference)
4. **G3-04:** Code examples included (≥1 per section where applicable)
5. **G3-05:** Entity enumeration verified — for EVERY section with entity_expectation="all", count documented entities in output and verify ≥80% of entity_census_check.expected from documentation-plan.yaml **[BLOCKER]**
6. **G3-06:** Depth compliance — for EVERY section, verify writing depth matches semantic_intent.depth (overview sections don't have deep-dive detail, detailed sections don't have overview brevity) **[CRITICAL]**

```
IF all 6 conditions pass → GATE_3 = OPEN → Proceed to Phase 4
IF G3-05 fails → GATE_3 = LOCKED (BLOCKER) → Must document missing entities before proceeding
IF G3-06 fails → GATE_3 = LOCKED (CRITICAL) → Must adjust writing depth
ELSE → GATE_3 = LOCKED → Fix quality issues
```

---

## POST-PHASE CHECKLIST

After completing Phase 3, verify:

- [ ] All sections written (per documentation-plan writing_order)
- [ ] Entity enumeration verified — sections with entity_expectation="all" document ≥80% of census
- [ ] Depth compliance — writing depth matches semantic_intent.depth per section
- [ ] Quality rules applied (R1-R8: paragraph ≤300 chars, depth ≥2.0, [UNKNOWN] <10%, citation ≤30%)
- [ ] Evidence citations present (each claim has file:line reference)
- [ ] Code examples included (≥1 per applicable section)
- [ ] Entity log written (deep-artifacts/entity-log.yaml with per-section entity tracking)
- [ ] docs/*.md files created
- [ ] GATE_3 evaluated (OPEN, all 6 conditions)

**If checklist incomplete → Phase 3 not finished → Re-execute.**

---

## NEXT PHASE

After GATE_3 opens → Load `steps/step-04-verification.md` → Begin Phase 4 (VERIFICATION)
