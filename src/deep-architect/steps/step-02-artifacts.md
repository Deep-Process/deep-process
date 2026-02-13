---
step: 2
name: "Artifact Generation"
time_estimate: "45-90 minutes"
goal: "Generate architecture diagrams, data model, deployment, ADRs"
requires_completion: true
next_steps: ["step-03-adversary.md"]
data_dependencies: ["data/schemas/architecture-model.schema.yaml", "canonical-operations.yaml"]
outputs: ["architecture-model.yaml", "diagrams/", "adrs/"]
gate: "GATE_2"
gate_conditions: 5
---

# PHASE 2: ARTIFACT GENERATION — ENFORCED SEQUENCE

## 2.0 ASSUMPTIONS_DECLARED

1. Declare assumptions about diagram scope, data model completeness, deployment targets
2. Log in architecture-model.yaml `assumptions[]` with A-2XX IDs
3. Minimum 1 assumption (3+ for deep depth)

**IF zero assumptions → HALT (INV-03 violation)**

---

## 2.1 EXTRACT: C4 Context Diagram

1. Read canonical-operations.yaml → extract system name, external actors, external systems
2. Generate Mermaid C4 Context diagram:
   ```
   C4Context
     title System Context Diagram - [System Name]
     Person(user, "User", "Description")
     System(system, "System", "Description")
     System_Ext(ext, "External System", "Description")
     Rel(user, system, "Uses")
     Rel(system, ext, "Calls")
   ```
3. Write to `diagrams/c4-context.mermaid`

---

## 2.2 EXTRACT: C4 Container Diagram

1. Read decomposition → extract top-level containers (services, databases, queues)
2. Generate Mermaid C4 Container diagram:
   ```
   C4Container
     title Container Diagram - [System Name]
     Container(api, "API", "Technology", "Description")
     ContainerDb(db, "Database", "Technology", "Description")
     Rel(api, db, "Reads/Writes")
   ```
3. Include technology choices for each container
4. Write to `diagrams/c4-container.mermaid`

---

## 2.3 EXTRACT: C4 Component Diagram

1. Select most complex container from decomposition
2. Break into internal components
3. Generate Mermaid C4 Component diagram
4. Show component responsibilities and relationships
5. Write to `diagrams/c4-component.mermaid`

---

## 2.4 EXTRACT: Data Model

1. Read canonical-operations.yaml → extract entities from responsibility allocation
2. Identify attributes for each entity
3. Map relationships (one-to-one, one-to-many, many-to-many)
4. Generate Mermaid ER diagram:
   ```
   erDiagram
     ENTITY_A ||--o{ ENTITY_B : "relationship"
     ENTITY_A {
       string id PK
       string name
     }
   ```
5. Write to `diagrams/data-model.mermaid`

---

## 2.5 EXTRACT: Deployment Diagram

1. Read context assessment → extract domain (cloud/embedded/etc)
2. Define deployment environments (production, staging, etc)
3. Map containers to infrastructure nodes
4. Generate Mermaid deployment diagram
5. Write to `diagrams/deployment.mermaid`

---

## 2.6 EXTRACT: Architecture Decision Records

1. Review all decisions from Phase 0 + Phase 1
2. For each significant decision, create ADR:
   ```yaml
   - id: "ADR-001"
     title: "[Decision Title]"
     status: "accepted"
     context: "[Why decision needed]"
     decision: "[What decided]"
     rationale: "[Why this option]"
     alternatives_considered:
       - option: "[Alternative]"
         rejected_because: "[Reason]"
     consequences:
       positive: ["[Benefit]"]
       negative: ["[Cost]"]
   ```
3. Minimum 3 ADRs required (GATE_2 G2-04)
4. Write to `adrs/` directory (one file per ADR or combined)

---

## 2.7 EXTRACT: Technology Stack

1. Compile technology choices from canonical operations
2. For each layer (frontend, backend, database, infrastructure):
   - Technology name and version
   - Rationale for selection

---

## 2.8 VERIFY: Artifact Validation

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 diagram elements (components, entities, relationships)
   2. Verify each traces back to canonical-operations.yaml
   3. IF rate < 0.70 → re-generate with proper tracing

2. **Method #84 Coherence Check:**
   1. Verify C4 Context → Container → Component hierarchy is consistent
   2. Verify data model entities match components
   3. Verify deployment maps all containers

3. **Method #168 Phantom Hunt (for deep depth):**
   1. Re-scan diagrams for elements NOT in canonical-operations.yaml
   2. Each phantom element must be justified or removed

---

## 2.9 RENDER: Architecture Model Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `architecture-model.yaml` following schema
2. Include: metadata, assumptions, diagrams (with content), adrs, technology_stack
3. Write to `{output_directory}/architecture-artifacts/architecture-model.yaml`

---

## 2.10 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | C4 Context diagram generated | PASS/FAIL |
| 2 | C4 Container diagram generated | PASS/FAIL |
| 3 | C4 Component diagram generated | PASS/FAIL |
| 4 | Data model with entities/relationships | PASS/FAIL |
| 5 | Deployment diagram generated | PASS/FAIL |
| 6 | ADRs created (≥3) | PASS/FAIL |
| 7 | Technology stack documented | PASS/FAIL |
| 8 | ASSUMPTIONS_DECLARED | PASS/FAIL |
| 9 | Counter-checks executed | PASS/FAIL |
| 10 | architecture-model.yaml written | PASS/FAIL |

---

## 2.11 GATE_2 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G2-01 | C4 Context diagram generated | CRITICAL | |
| G2-02 | C4 Container diagram generated | CRITICAL | |
| G2-03 | Data model documented | CRITICAL | |
| G2-04 | ADRs created (≥3) | ERROR | |
| G2-05 | Deployment model defined | REQUIRED | |

**Pass criteria:** ALL CRITICAL conditions met

- IF ALL CRITICAL pass → GATE_2 = **OPEN** → proceed to Phase 3
- IF any CRITICAL fails → GATE_2 = **LOCKED** → HALT, fix
