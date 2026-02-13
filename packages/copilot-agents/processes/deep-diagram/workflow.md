# Deep-Diagram V0.1.0 - Workflow (Main Entry Point)
# Standalone Architecture Diagram Generation Process
# Extracted from Deep-Document V7.1.4 STATE_SYNTHESIS pipeline
# Version: 0.1.0

---

## PRIORITY DECLARATION

```
COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS
```

- Diagram coverage >= 0.90 (90% of components represented)
- All diagrams grounded in evidence (no phantom components)
- All relationships backed by evidence claims
- If choice between "include all components" (expensive) vs "sample components" (cheap), choose include all

---

## EXTRACTION NOTICE (V0.1.0)

This process is an initial extraction from Deep-Document V7.1.4. It contains the
complete DEEP-DIAGRAM pipeline (9 steps) but requires pre-built input artifacts:

**Required Inputs (from upstream process or manual preparation):**
- `evidence_map.yaml` - extracted claims with type: relationship|behavior
- `documentation-plan.yaml` - diagram_plan[] with planned diagram types
- `domain-ontology.yaml` - entities[] with relationships
- Active domain list (for diagram trigger evaluation)

**Required Data Files (included):**
- `data/patterns/diagram-triggers.yaml` - DT-* trigger definitions
- `data/schemas/architectural-model.schema.yaml` - output schema

**For standalone operation, the following needs development:**
- INPUT_PREPARATION step (build evidence/ontology from source code directly)
- Standalone domain detection (lightweight trigger evaluation)
- Process state management (process-state.yaml)
- User review integration (approve/reject/add diagrams)
- Incremental mode (supplement without regeneration)

---

## ROUTING TABLE

| Step | File                          | Goal                                          |
|------|-------------------------------|-----------------------------------------------|
| 01   | steps/step-01-load-inputs.md          | Load evidence, plan, ontology, triggers |
| 02   | steps/step-02-declare-assumptions.md  | Declare assumptions about types/layers/thresholds |
| 03   | steps/step-03-extract-components.md   | Extract components from ontology entities |
| 04   | steps/step-04-extract-relationships.md | Extract relationships from evidence claims |
| 05   | steps/step-05-build-metrics.md        | Build dependency metrics (degree counting) |
| 06   | steps/step-06-rank-components.md      | Rank by centrality, select high-priority |
| 07   | steps/step-07-generate-diagrams.md    | Evaluate triggers, select components, generate Mermaid |
| 08   | steps/step-08-verify-coverage.md      | Verify coverage ratio >= 0.90 |
| 09   | steps/step-09-verify-and-render.md    | Counter-checks, GATE_DIAG, write output |

**Execution Pattern:**
1. Read step-01 -> execute -> proceed to step-02
2. Read step-02 -> execute -> proceed to step-03
3. ...continue sequentially...
4. Read step-09 -> execute GATE_DIAG -> output or error

**Self-Contained:** Each step file contains ALL instructions needed for that step
(YAML frontmatter + ENFORCED SEQUENCE + schemas where needed).

---

## EXECUTION RULES

### RULE 1: SEQUENTIAL EXECUTION
Steps MUST execute in order 01 through 09. No skipping.

### RULE 2: PROGRESSIVE LOADING
Load ONLY current step file. Do NOT read step-07 while executing step-03.

### RULE 3: GATE ENFORCEMENT
GATE_DIAG in step-09 is BINDING. Process cannot produce output if any
BLOCKER or CRITICAL condition fails.

### RULE 4: ASSUMPTIONS BEFORE EXTRACTION
Step-02 (ASSUMPTIONS_DECLARED) MUST complete before step-03 (EXTRACT_COMPONENTS).
Extraction without declared assumptions is a SEQUENCE VIOLATION.

### RULE 5: EVIDENCE-BACKED DIAGRAMS ONLY
Every component in a diagram MUST reference evidence_claim_ids.
Every relationship MUST reference evidence_claim_ids.
Diagrams without evidence backing are PHANTOM CONTENT (BLOCKER).

### RULE 6: MERMAID SYNTAX VALIDATION
All generated Mermaid code MUST be syntactically valid.
Node IDs MUST match component_ids from components[] array.
Relationship arrows MUST match relationships[] array.

---

## SCOPE_REDUCTION PROTOCOL

If a planned diagram cannot be generated (insufficient evidence, no matching
components, trigger conditions not met):

```yaml
scope_reduction:
  - timestamp: <ISO8601>
    diagram_id: <planned_diagram_id>
    reason: <specific justification>
    evidence: <what was attempted>
    impact: <what is lost>
    approved_by: "SCOPE_REDUCTION_DECLARATION"
```

Log in decisions[] array. Coverage ratio recalculated excluding reduced scope.

---

## INPUT ARTIFACTS

### evidence_map.yaml (Required)
Source: Deep-Document STATE_EVIDENCE or manual preparation
Contains: claims[] with claim_id, claim_text, claim_type, file_path, line_number
Used by: step-03, step-04 (extract components and relationships from claims)

### documentation-plan.yaml (Required)
Source: Deep-Document STATE_PLANNING or manual preparation
Contains: diagram_plan[] with diagram_type, target_sections, trigger_id
Used by: step-07 (diagram generation targets)

### domain-ontology.yaml (Required)
Source: Deep-Document STATE_ONTOLOGY_EXTRACTION or manual preparation
Contains: entities[] with entity_id, name, type, file_path, relationships[]
Used by: step-03 (primary source for component extraction)

### diagram-triggers.yaml (Included)
Source: data/patterns/diagram-triggers.yaml (this process)
Contains: trigger definitions with conditions, diagram types, domains
Used by: step-07 (trigger evaluation for diagram generation)

---

## OUTPUT ARTIFACTS

### architectural-model.json (Primary Output)
Schema: data/schemas/architectural-model.schema.yaml
Contains: metadata, components[], relationships[], diagrams[], topology_metrics
Written by: step-09

### dependency-metrics.yaml (Secondary Output)
Contains: per-component degree metrics, priority scores, centrality rankings
Written by: step-09

---

## DIAGRAM TYPES

| Type        | Description                    | Mermaid Keyword | Use Case                     |
|-------------|--------------------------------|-----------------|------------------------------|
| component   | High-level system components   | graph TD        | Top 20% by degree centrality |
| sequence    | Call chains and interactions   | sequenceDiagram | High-priority function flows |
| deployment  | Infrastructure layout          | graph LR        | Infrastructure components    |
| class       | Type hierarchy                 | classDiagram    | Class/interface inheritance  |
| data_flow   | Data transformations           | graph LR        | Data pipeline stages         |
| architecture| Full system layer view         | graph TD        | Complete system overview      |

---

## GATE_DIAG (Binding)

Full conditions defined in step-09. Summary:

| ID     | Description                              | Severity |
|--------|------------------------------------------|----------|
| GD-01  | architectural-model.json exists          | BLOCKER  |
| GD-02  | Diagrams generated per plan              | BLOCKER  |
| GD-03  | Each diagram has source evidence         | CRITICAL |
| GD-04  | Diagram types appropriate                | ERROR    |
| GD-05  | No phantom diagrams (PD-UNIVERSAL)       | BLOCKER  |
| GD-06  | Counter-checks executed                  | ERROR    |
| GD-07  | Version incremented                      | WARNING  |
| GD-08  | Delta math correct                       | ERROR    |
| GD-09  | Coverage ratio >= 0.90                   | CRITICAL |
| GD-10  | Topology metrics computed                | WARNING  |

---

**Version:** 0.1.0 (2026-02-13)
**Origin:** Extracted from Deep-Document V7.1.4 STATE_SYNTHESIS
**Pattern:** Deep-Verify canonical structure (workflow.md + steps/ + data/)
**ZASADA 12 Compliance:** Step files loaded just-in-time, not upfront
