---
step: 5
name: "Documentation Planning"
state: "STATE_PLANNING"
time_estimate: "8-15 minutes"
goal: "Plan documentation with GP-15 FAISS-optimized semantic matching, template binding, incremental construction"
requires_completion: true
next_steps: ["step-06-user-review-plan.md"]
data_dependencies: ["detection-report.yaml", "template-decomposition.yaml", "dependency-closure.yaml", "domain-ontology.yaml", "data/patterns/quality-patterns.yaml"]
outputs: ["documentation-plan.yaml"]
---

# STATE_PLANNING

**Input:** detection-report.yaml, template-decomposition.yaml, dependency-closure.yaml, domain-ontology.yaml, quality-patterns.yaml
**Output:** documentation-plan.yaml

## ENFORCED SEQUENCE (MODE: FULL)

### STEP 1: MODE_DETECTION
Check execution_context.mode:
- **FULL:** Create new plan from scratch (this section)
- **INCREMENTAL:** Load existing plan, supplement with changes (per R-01)
- **RERUN:** Load existing plan, apply improvement_request

Execute appropriate mode below.

### STEP 2: ASSUMPTIONS_DECLARED ← REQUIRED
```yaml
assumptions:
  - "Template sections from template-decomposition.yaml binding (100% enumeration)"
  - "Active domains from detection-report.yaml final_domains (pattern source)"
  - "Coverage requirement: >= 90% template sections planned (INV-25)"
  - "Incremental construction via Edit tool (batch size: 3-5 docs per batch)"
  - "PD-UNIVERSAL patterns (68) enforced throughout"
  - "GP-15 semantic matching threshold: 0.90 (FAISS-optimized)"
```

### STEP 3: LOAD_CONTEXT
1. Read detection-report.yaml → extract final_domains[]
2. Read template-decomposition.yaml → extract template_sections[]
3. Read dependency-closure.yaml → extract matches[]
4. Read domain-ontology.yaml → extract entities[]
5. Load quality-patterns.yaml from data/patterns/ (for STEP 7 quality requirements)

**Note:** diagram-triggers.yaml loaded in STATE_SYNTHESIS (when diagrams generated)
**Note:** documentation-standards.yaml loaded in STATE_GENERATION (when docs written)

### STEP 4: DETERMINE_DOCUMENTS
For each matched template section from dependency-closure.yaml:
1. Extract section_id, section_title, matched ontology entities
2. Create planned_document entry

Output format:
```yaml
RAW EXTRACTION for planned_documents:
total_documents: <count>
document_sample_3:
  - document_id: DOC_001
    document_name: "Project Overview"
    template_section_id: S001
    priority: CRITICAL
    estimated_lines: 250
    target_file: docs/project-overview.md
  - document_id: DOC_002
    document_name: "Architecture"
    template_section_id: S005
    priority: HIGH
    estimated_lines: 400
    target_file: docs/architecture.md
  - document_id: DOC_003
    document_name: "Data Models"
    template_section_id: S007
    priority: MEDIUM
    estimated_lines: 350
    target_file: docs/data-models.md

[EXTRACT_COMPLETE for planned_documents]
```

### STEP 5: PLAN_SECTIONS
For each planned_document:
1. Load template section content from template-decomposition.yaml
2. Decompose into subsections (H2 → H3 structure)
3. For each subsection:
   - Assign section_id
   - Map to ontology entities
   - Determine content_format (prose|table|list|diagram)
   - Estimate line count

### STEP 6: IDENTIFY_DIAGRAMS
Using diagram-triggers.yaml from active domains:
1. For each trigger (e.g., DT-CDK-STACK if aws-cdk domain):
   - Evaluate trigger conditions against ontology entities
   - IF conditions met → add to diagram_plan
2. Apply topology metrics from architectural-model (will be generated in STATE_SYNTHESIS)
3. Prioritize high-centrality components per Method #90

### STEP 7: DEFINE_QUALITY
From quality-patterns.yaml and config.yaml:
```yaml
quality_requirements:
  - id: QR-01
    requirement: "Paragraphs <= 300 chars"
    gate: GG-10
    severity: CRITICAL
  - id: QR-02
    requirement: "Structure depth >= 2.0"
    gate: GG-11
    severity: ERROR
  - id: QR-03
    requirement: "[UNKNOWN] ratio <= 10%"
    gate: GG-12
    severity: CRITICAL
  - id: QR-04
    requirement: "Format selection (tables ≥5 items, lists ≥3 items)"
    gate: GG-13
    severity: ERROR
  - id: QR-05
    requirement: "Citation density <= 30%"
    gate: GG-14
    severity: WARNING
```

### STEP 8: CREATE_CHECKLISTS
For each document, generate checklist from documentation-standards.yaml:
```yaml
document_checklists:
  - document_id: DOC_001
    checklist:
      - "[ ] All sections from template present"
      - "[ ] Citations for all claims (evidence_map)"
      - "[ ] No PD-UNIVERSAL violations"
      - "[ ] Quality gates GG-10..14 pass"
      - "[ ] Structure depth ≥2.0"
      - "[ ] Paragraphs ≤300 chars"
```

### STEP 9: VERIFY_TEMPLATE_COVERAGE
1. Count template_sections from template-decomposition.yaml
2. Count planned_documents matching template sections
3. Calculate coverage:
```
coverage = (sections_with_content + sections_unknown) / total_template_sections
```
4. Verify coverage >= 0.90 per INV-25
5. For unmatched sections:
   - IF optional → log SCOPE_REDUCTION
   - IF critical → ERROR (coverage violation)

### STEP 10: INCREMENTAL_CONSTRUCTION
**DO NOT** Write entire plan in one call (token overflow risk).
Use Edit tool with batched additions:

#### 10.1: Write Skeleton
```yaml
metadata:
  version: "7.0.0"
  planning_timestamp: <ISO8601>
  total_documents: 0
  construction_mode: "INCREMENTAL"
  batches_planned: 0

planned_documents: []
section_plan: {}
diagram_plan: []
quality_requirements: []
document_checklists: {}
template_coverage_verification: {}
scope_estimate: {}
```

#### 10.2: Add planned_documents (Batched)
Batch size:
- Small projects (<10 files): 5-7 docs per batch
- Medium (10-30 files): 3-5 docs per batch
- Large (>30 files): 2-3 docs per batch

For each batch:
1. Edit documentation-plan.yaml, add batch to planned_documents[]
2. Increment metadata.batches_planned counter
3. Read file to verify append succeeded

#### 10.3: Add section_plan (Sequential)
For each planned_document (one at a time):
1. Edit documentation-plan.yaml, add document's sections to section_plan{}
2. Read file to verify

#### 10.4: Add diagram_plan
Edit documentation-plan.yaml, add all diagrams

#### 10.5: Add quality_requirements
Edit documentation-plan.yaml, add all QR entries

#### 10.6: Add document_checklists
Edit documentation-plan.yaml, add all checklists

#### 10.7: Add template_coverage_verification
```yaml
template_coverage_verification:
  total_template_sections: <count>
  sections_with_content: <count>
  sections_unknown: <count>
  coverage_ratio: <ratio>
  coverage_threshold: 0.90
  coverage_pass: <true|false>
  scope_reductions: []
```

#### 10.8: Add scope_estimate
```yaml
scope_estimate:
  total_documents: <count>
  total_estimated_lines: <sum>
  total_diagrams: <count>
  estimated_duration_hours: <estimate>
```

### STEP 11: GP-15 SEMANTIC MATCHING (FAISS-OPTIMIZED)
**Algorithm:** FAISS IndexFlatIP or IndexHNSWFlat for fast nearest neighbor search

**Performance:**
- Complexity: O(N×log(M)) with HNSW index vs O(N×M) naive loops
- 60 template × 120 plan sections = <5 seconds (was 72 seconds naive)
- Speedup: 17x with IndexFlatIP, 24x with IndexHNSWFlat for M>1000

**Implementation:**
```python
import faiss
import numpy as np

# Step 1: Normalize embeddings (cosine similarity via inner product)
def normalize(embeddings):
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    return embeddings / norms

# Step 2: Build FAISS index once for all plan embeddings (O(M))
embedding_dim = 768
M = len(plan_sections)
plan_embeddings = np.array([section.embedding for section in plan_sections])
plan_embeddings_normalized = normalize(plan_embeddings)

if M < 1000:
    index = faiss.IndexFlatIP(embedding_dim)  # Exact search, O(N×M)
else:
    index = faiss.IndexHNSWFlat(embedding_dim, 32)  # Approximate, O(N×log(M))

index.add(plan_embeddings_normalized)

# Step 3: Batch search for all template embeddings (O(N×log(M)))
N = len(template_sections)
template_embeddings = np.array([section.embedding for section in template_sections])
template_embeddings_normalized = normalize(template_embeddings)

similarities, indices = index.search(template_embeddings_normalized, k=1)
# similarities: (N, 1) array of cosine similarities
# indices: (N, 1) array of best match indices

# Step 4: Count matches >= 0.90 threshold
matches = sum(1 for sim in similarities if sim[0] >= 0.90)
match_ratio = matches / N

# Step 5: Verify threshold
if match_ratio < 0.90:
    # BLOCKER: semantic matching failed
    unmatched = [template_sections[i].section_id for i, sim in enumerate(similarities) if sim[0] < 0.90]
    log_error(f"GP-15 FAIL: match_ratio={match_ratio:.2f} < 0.90, unmatched={unmatched}")
```

**Fallback:** Keyword overlap if embeddings unavailable (validated P0-R-02)

**Threshold:** match_ratio ≥ 0.90 (90% of template sections matched) → BLOCKER if fail

### STEP 12: COUNTER-CHECKS ← REQUIRED
- **CC1 (Method #85 Grounding):** Sample 3 planned documents, verify template sections exist → BLOCKER if fail
- **CC2 (Method #168 Phantom):** Check for phantom diagram triggers (triggers not from active domains) → ERROR if >0
- **CC3 (Method #84 Coherence):** Verify batches_planned >= ceil(total_documents / 5.0) per GP-10b → CRITICAL if fail

### STEP 13: CHECKLIST (GATE_P) ← BINDING
```
[ ] GP-01: documentation-plan.yaml exists (BLOCKER)
[ ] GP-02: All required documents planned (BLOCKER)
[ ] GP-03: Section plan complete for each document (CRITICAL)
[ ] GP-04: Diagram plan complete (CRITICAL)
[ ] GP-05: Quality requirements specified (ERROR)
[ ] GP-06: Document checklists created (ERROR)
[ ] GP-07: Scope estimate provided (WARNING)
[ ] GP-08: ASSUMPTIONS_DECLARED (CRITICAL)
[ ] GP-09: Template coverage ≥90% (keyword matching) (CRITICAL)
[ ] GP-10: Incremental construction if ≥20 files (CRITICAL)
[ ] GP-10b: Batch count realistic ≥ceil(docs/5) (CRITICAL)
[ ] GP-11: Counter-checks executed (ERROR)
[ ] GP-15: Semantic matching ≥90% (FAISS cosine similarity) (BLOCKER)
```

### STEP 14: TRANSITION
- IF all BLOCKER/CRITICAL conditions PASS → USER_REVIEW_PLAN
- IF any BLOCKER/CRITICAL FAIL → STATE_ERROR

---

## MODE: INCREMENTAL (R-01)

### STEP 2: LOAD_EXISTING
Read deep-artifacts/documentation-plan.yaml

### STEP 3: VERIFY_AGAINST_INVENTORY
1. Load repo_inventory.yaml
2. Compare planned_documents sources vs current inventory
3. Identify: ADD (new files), MODIFY (changed files), REMOVE (deleted files)

### STEP 4: SUPPLEMENT_PLAN
For each ADD/MODIFY:
1. Create new planned_document entry OR update existing
2. Append to planned_documents[] using Edit tool
3. Update section_plan{} for affected documents
4. Increment metadata.batches_planned

### STEP 5: DELTA_REPORT
Write deep-artifacts/incremental-delta.yaml:
```yaml
base_summary:
  total_documents: <original_count>
supplement_summary:
  added: <count>
  modified: <count>
  removed: <count>
```

### STEP 6: COUNTER-CHECKS
Same as FULL mode

### STEP 7: GATE_P_INCREMENTAL
Evaluate GPI-01 through GPI-09 conditions

### STEP 8: TRANSITION
Return to orchestrator for USER_REVIEW_PLAN

---

## SCHEMA

### documentation-plan.yaml
```yaml
metadata:
  version: "7.0.0"
  planning_timestamp: <ISO8601>
  total_documents: <count>
  construction_mode: "INCREMENTAL"
  batches_planned: <count>

planned_documents:
  - document_id: DOC_001
    document_name: "Project Overview"
    template_section_id: S001
    priority: CRITICAL
    estimated_lines: 250
    target_file: docs/project-overview.md

section_plan:
  DOC_001:
    - section_id: SEC_001
      section_name: "1. Introduction"
      content_format: prose
      estimated_lines: 80

diagram_plan:
  - diagram_id: DIAG_001
    diagram_name: "System Architecture"
    diagram_type: C4_SYSTEM
    trigger: DT-CDK-STACK
    estimated_complexity: HIGH

quality_requirements: [<QR-01 through QR-05>]

document_checklists: {<checklists per document>}

template_coverage_verification:
  total_template_sections: 45
  sections_with_content: 42
  sections_unknown: 1
  coverage_ratio: 0.96
  coverage_threshold: 0.90
  coverage_pass: true

semantic_matching:
  match_ratio: 0.93
  algorithm: "FAISS IndexFlatIP"
  unmatched_sections: [S023, S034]

scope_estimate:
  total_documents: 9
  total_estimated_lines: 2800
  total_diagrams: 12
  estimated_duration_hours: 2.5
```

---

**PREVENTS:** Sparse planning (30% missing sections in V6) via GATE_TA + GP-15 FAISS semantic matching
