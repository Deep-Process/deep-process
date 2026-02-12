---
step: 12
name: "Documentation Generation"
state: "STATE_GENERATION"
time_estimate: "15-30 minutes"
goal: "Generate documentation with quality enforcement (R1-R10, GG-10..14)"
requires_completion: true
next_steps: ["step-13-user-review-docs.md"]
data_dependencies: ["documentation-plan.yaml", "evidence_map.yaml", "architectural-model.json", "data/config.yaml", "data/patterns/documentation-standards.yaml"]
outputs: ["docs/*.md"]
---

# STATE_GENERATION

**Input:** documentation-plan.yaml, evidence_map.yaml, architectural-model.json, config.yaml, documentation-standards.yaml
**Output:** docs/*.md

## ENFORCED SEQUENCE

**STEP 1: LOAD_PLAN**
1. Read documentation-plan.yaml → extract planned_documents[], section_plan{}, quality_requirements[]
2. Read evidence_map.yaml → extract claims[]
3. Read architectural-model.json → extract diagrams[]
4. Load config.yaml from data/ (quality thresholds for R1-R10)
5. Load documentation-standards.yaml from data/patterns/ (quality rules enforcement)

**STEP 2: ASSUMPTIONS_DECLARED**
```yaml
assumptions:
  - "Quality rules R1-R10 enforced per documentation-standards.yaml"
  - "Gate conditions GG-10..14 binding (CRITICAL/ERROR severity)"
  - "Max paragraph length: 300 chars (R1, GG-10)"
  - "Min structure depth: 2.0 (R8, GG-11)"
  - "Max [UNKNOWN] ratio: 10% (R6, GG-12)"
  - "Format selection logic: tables for >=5 items with >=3 properties (R3)"
  - "Citation strategy: 70/30 (70% end-of-section, 30% inline) (R5, GG-14)"
  - "PD-UNIVERSAL patterns (68) blocked (no placeholders allowed)"
```

**STEP 3: GENERATE_DOCUMENTS**
For each planned_document:

**3.1: Filter Evidence**
From evidence_map (loaded in STEP 1), extract claims relevant to document sections

**3.2: Filter Diagrams**
From architectural-model (loaded in STEP 1), extract diagrams relevant to document

**3.3: Generate Content (per section)**
For each section in section_plan{}:

**R1 (Paragraph Length):**
- Write paragraphs ≤300 chars
- IF content >300 chars → decompose into multiple paragraphs OR use list/table format

**R2 (Structure Decomposition):**
- IF section has >3 paragraphs of content → use H3 subsections
- Progressive disclosure: high-level → details

**R3 (Table Format):**
- IF >=5 items with >=3 properties → use markdown table
- Example: 5 DynamoDB tables with name/keys/indexes → table, not prose

**R4 (List Format):**
- IF >=3 items → use bulleted/numbered list
- Example: 3 API endpoints → list, not prose

**R5 (Citation Strategy - 70/30):**
- Prefer end-of-section citations (70%)
- Use inline citations only for controversial/critical claims (30%)
- Format: `[1]` with footnotes at section end

**R6 ([UNKNOWN] Minimization):**
- 3-tier hierarchy: VERIFIED (code-based) > INFERRED (logical) > [UNKNOWN] (uncertain)
- Target: [UNKNOWN] ≤10%
- IF evidence_strength = hypothetical → use INFERRED with qualifier ("likely", "appears to")

**R7 (Progressive Disclosure):**
- Start with overview/summary
- Add details in nested sections (H3, H4)
- Use "See X for details" cross-references

**R8 (Hierarchical Depth):**
- Use H2 → H3 → H4 nesting (average depth >= 2.0)
- Avoid flat H2-only structure

**R9 (Code Examples):**
- Include code snippets from evidence citations when illustrating behavior
- Use fenced code blocks with language tags

**R10 (Diagrams Show Relationships):**
- Embed mermaid diagrams from architectural-model.json
- Show component relationships, not isolated boxes

**3.4: PD-UNIVERSAL Enforcement**
Scan generated content for all 68 placeholder patterns from config.yaml:
- IF pattern detected → BLOCKER error (no placeholders allowed)
- Exceptions: code blocks, inline code, escaped content (per config.yaml)

**3.5: Write Document**
Write docs/<filename>.md with generated content

**STEP 4: VERIFY_QUALITY**
For each generated document, verify:

**GG-10 (Paragraph Length - CRITICAL):**
Scan all paragraphs, calculate max length
IF any >300 chars → FAIL

**GG-11 (Structure Depth - ERROR):**
Count heading levels (H2=1, H3=2, H4=3)
Calculate: avg_depth = sum(levels) / count(headings)
IF avg_depth <2.0 → FAIL

**GG-12 ([UNKNOWN] Ratio - CRITICAL):**
Count occurrences of "[UNKNOWN]", "TBD", "TODO", etc.
Calculate: unknown_ratio = unknown_count / total_sentences
IF unknown_ratio >0.10 → FAIL

**GG-13 (Format Selection - ERROR):**
For lists with >=5 items and >=3 properties:
Verify markdown table used (not prose)
IF prose instead of table → FAIL

**GG-14 (Citation Density - WARNING):**
Count inline citations (citations within sentences)
Count total sentences
Calculate: inline_ratio = inline_citations / total_sentences
IF inline_ratio >0.30 → WARN

**STEP 5: COUNTER-CHECKS**
- **CC1 (Method #85 Grounding):** Sample 3 citations per document, verify evidence_claim_ids exist in evidence_map → BLOCKER if >30% fail
- **CC2 (Method #168 Phantom + PD-UNIVERSAL):** Scan docs for 68+ placeholder patterns → BLOCKER if detected
- **CC3 (Method #84 Coherence):** Verify all sections from section_plan{} present in document → ERROR if missing

**STEP 6: GATE_GEN CHECKLIST** ← BINDING
```
[ ] GG-01: docs/*.md files exist (BLOCKER)
[ ] GG-02: All planned documents generated (BLOCKER)
[ ] GG-03: Each document follows template (CRITICAL)
[ ] GG-04: Citations traceable to evidence (CRITICAL)
[ ] GG-05: No phantom content (PD-UNIVERSAL 68+ patterns) (BLOCKER)
[ ] GG-06: Counter-checks executed (ERROR)
[ ] GG-07: Generation version incremented (WARNING)
[ ] GG-08: Delta math correct (ERROR)
[ ] GG-09: Quality requirements met (ERROR)
[ ] GG-10: Paragraph length ≤300 chars (CRITICAL)
[ ] GG-11: Structure depth ≥2.0 (ERROR)
[ ] GG-12: [UNKNOWN] ratio ≤10% (CRITICAL)
[ ] GG-13: Format selection appropriate (tables/lists) (ERROR)
[ ] GG-14: Citation density ≤30% (WARNING)
```

**STEP 7: TRANSITION**
- IF all BLOCKER/CRITICAL conditions PASS → USER_REVIEW_DOCS
- IF any BLOCKER/CRITICAL FAIL → STATE_ERROR

**PREVENTS:** 35% [UNKNOWN] + poor quality via GG-05 (PD-UNIVERSAL) + GG-10..14 (quality gates)

---

## DOCUMENT CHECKLIST EXECUTION

After generating each document, execute checklist from documentation-plan.yaml:

```yaml
document_checklists:
  - document_id: DOC_001
    checklist:
      - "[ ] All sections from template present"
      - "[ ] Citations for all claims"
      - "[ ] No PD-UNIVERSAL violations"
      - "[ ] Quality gates GG-10..14 pass"
```

Mark each item as completed or failed
IF any item failed → document requires revision

---

## QUALITY_AMENDMENT MODE (V6.2.1)

### STATE_QUALITY_AMENDMENT → STATE_GENERATION

**STEP 1: LOAD_EXISTING_DOCS**
Read all docs/*.md files

**STEP 2: LOAD_PLAN_AMENDMENT**
Read documentation-plan.yaml with quality_requirements[] added

**STEP 3: APPLY_QUALITY_FIXES**
For each document:
1. Scan for R1 violations (paragraphs >300 chars) → split
2. Scan for R8 violations (depth <2.0) → add H3 subsections
3. Scan for R6 violations ([UNKNOWN] >10%) → replace with INFERRED or VERIFIED
4. Scan for R3/R4 violations → convert prose to tables/lists
5. Scan for R5 violations (inline citations >30%) → move to end-of-section

**STEP 4: PRESERVE_CONTENT**
DO NOT regenerate evidence or diagrams
ONLY modify prose structure (HOW written, not WHAT documented)

**STEP 5: WRITE_UPDATED_DOCS**
Overwrite docs/*.md files with quality-fixed content

**STEP 6: GATE_P_AMENDMENT**
Evaluate GPA-01 through GPA-07 conditions
Verify quality improvements applied without content changes

---

## INCREMENTAL MODE (V6.3)

### INCREMENTAL_GENERATION

**STEP 1: LOAD_BASE_DOCS**
Read existing docs/*.md files

**STEP 2: DETECT_CHANGES**
Compare documentation-plan.yaml with base docs
Identify: new sections, modified sections, deleted sections

**STEP 3: SUPPLEMENT**
For new/modified sections:
1. Generate new content OR update existing
2. Preserve all unchanged content (>=80% preservation required)
3. Apply quality rules R1-R10 to new/modified content only

**STEP 4: WRITE_DELTA**
Write deep-artifacts/generation-incremental-delta.yaml

**STEP 5: GATE_GEN_INCREMENTAL**
Evaluate gate conditions for incremental mode
Verify quality maintained for base + new content
