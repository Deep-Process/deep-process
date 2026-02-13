---
step: 1
name: "Canonical Operations"
time_estimate: "60-120 minutes"
goal: "Execute ALL 8 canonical architecture operations — no exceptions"
requires_completion: true
next_steps: ["step-02-artifacts.md"]
data_dependencies: ["data/schemas/canonical-operations.schema.yaml", "context-assessment.yaml", "data/patterns/architecture-patterns.yaml"]
outputs: ["canonical-operations.yaml"]
gate: "GATE_1"
gate_conditions: 8
operations_required: 8
---

# PHASE 1: CANONICAL OPERATIONS — ENFORCED SEQUENCE

**ALL 8 operations MUST be executed (INV-07, BLOCKER). Skipping any = ABORT.**

**REASONING REQUIREMENT (INV-16):** Every key decision in canonical operations MUST include a `reasoning` field explaining WHY, not just WHAT was decided. Reasoning must be 1-2 sentences linking the decision to user requirements, context, or trade-offs. Decisions without reasoning = gate violation (G1-08).

## 1.0 ASSUMPTIONS_DECLARED (BEFORE ANY EXTRACTION)

1. Read context-assessment.yaml → understand domain, team, constraints, execution mode
2. Declare assumptions about system boundaries, technology choices, scale expectations
3. Log in canonical-operations.yaml `assumptions[]` with A-1XX IDs
4. Minimum 3 assumptions required

**IF zero assumptions → HALT (INV-03 violation)**

---

## 1.1 OPERATION 1: DECOMPOSITION

Break the system into components/modules/services.

1. Read user brief → identify major functional areas
2. Apply decomposition strategy based on domain:
   - web → frontend/backend/database layers
   - cloud → service-oriented, bounded contexts
   - data → ingestion/processing/storage/serving
   - embedded → hardware interface/control/monitoring
3. For each component:
   ```yaml
   - id: "C-001"
     name: "[Component Name]"
     type: "service|module|component|library|database|queue|cache|external"
     responsibility: "[Single responsibility — one sentence]"
     reasoning: "[WHY this component exists — what user need does it address]"
     dependencies: ["C-002", "C-003"]
     interfaces: ["I-001"]
   ```
4. Ensure decomposition has ≥2 levels (GATE_1 G1-02)
5. Ensure ≥2 components (non-trivial system)

---

## 1.2 OPERATION 2: BOUNDARY DEFINITION

Define system and component boundaries.

1. Define system boundary — what is IN vs OUT of scope
2. Identify external actors (users, external systems):
   ```yaml
   - id: "EA-001"
     name: "[Actor]"
     type: "user|system|service|database"
     interaction: "[How they interact]"
   ```
3. Define bounded contexts (DDD):
   ```yaml
   - id: "BC-001"
     name: "[Context]"
     components: ["C-001", "C-002"]
     relationships:
       - target: "BC-002"
         type: "customer_supplier"
   ```
4. Relationship types: partnership, shared_kernel, customer_supplier, conformist, anticorruption_layer, open_host, published_language, separate_ways

---

## 1.3 OPERATION 3: RELATIONSHIP MAPPING

Map all dependencies and data flows between components.

1. For each dependency:
   ```yaml
   - source: "C-001"
     target: "C-002"
     type: "sync|async|event|shared_data|import"
     direction: "unidirectional|bidirectional"
     criticality: "low|medium|high|critical"
   ```
2. For each data flow:
   ```yaml
   - id: "DF-001"
     source: "C-001"
     target: "C-003"
     data: "User profile"
     protocol: "REST/JSON"
   ```
3. Check for circular dependencies → flag if found
4. Assess overall dependency graph shape (star, chain, mesh)

---

## 1.4 OPERATION 4: RESPONSIBILITY ALLOCATION

Assign single responsibilities per SRP.

1. For each component, verify single responsibility:
   ```yaml
   - component: "C-001"
     single_responsibility: "Handle user authentication"
     srp_score: 0.95
     violations: []
   ```
2. SRP score: 1.0 = perfect single responsibility, 0.0 = god class
3. IF srp_score < 0.6 for any component → recommend splitting
4. Document any violations with remediation

---

## 1.5 OPERATION 5: DEPENDENCY MANAGEMENT

Analyze coupling and cohesion.

1. For each component, calculate:
   - Afferent coupling (Ca): incoming dependencies count
   - Efferent coupling (Ce): outgoing dependencies count
   - Instability: I = Ce / (Ca + Ce) — 0=stable, 1=unstable
2. Calculate cohesion score (0.0-1.0):
   - functional (highest), sequential, communicational, procedural, temporal, logical, coincidental (lowest)
3. Flag hotspots: components with high coupling (Ca + Ce > threshold from config)
4. Flag cold spots: components with low cohesion (< threshold from config)

---

## 1.6 OPERATION 6: PATTERN APPLICATION

Select and apply patterns from the architecture pattern library.

**Prerequisites:**
- Read `data/patterns/architecture-patterns.yaml` (35 patterns catalog)
- Read `context-assessment.yaml` → `architecture_domains.final_domains` (detected domains)
- IF platform domain detected (DOM-PLT-*): Read `data/patterns/cloud-patterns.yaml` (platform section only, R12)
- IF domain-specific file referenced: Read corresponding `data/patterns/domain-*.yaml` (R12)

**7-Step Pattern Selection Algorithm:**

1. **Filter by domain:** From architecture-patterns.yaml, select patterns where `domain_applicability` intersects with `final_domains`
2. **Evaluate when_to_use:** For each candidate pattern, check `when_to_use` conditions against user brief and context
3. **Check when_not_to_use:** Eliminate patterns where `when_not_to_use` conditions match current context
4. **Select primary pattern:** Choose the architectural pattern with strongest fit as primary decomposition pattern
5. **Select supporting patterns:** Choose communication, data, resilience, integration patterns that complement primary
6. **Add cloud patterns:** IF platform domain detected → select applicable cloud-specific patterns from cloud-patterns.yaml
7. **Document rejections:** For each considered-but-rejected pattern, record rationale

**Output:**
```yaml
pattern_application:
  architectural_pattern:
    pattern_id: "AP-DEC-001"  # FROM library
    name: "Microservices"
    source_domains: ["DOM-PAR-MICRO"]
    rationale: "Multiple teams, independent deployment required"
    trade_offs: "Distributed complexity vs team autonomy"
  supporting_patterns:
    - pattern_id: "AP-COM-001"
      name: "Event-Driven Architecture"
      source: "architecture-patterns.yaml / DOM-PAR-EVENT"
      applied_to: "C-001, C-002 inter-service communication"
      rationale: "Loose coupling between order and payment services"
    - pattern_id: "AP-RES-001"
      name: "Circuit Breaker"
      source: "architecture-patterns.yaml / DOM-PAR-MICRO"
      applied_to: "C-003 payment gateway calls"
      rationale: "External dependency failure isolation"
  cloud_patterns:
    - pattern_id: "CP-AWS-003"
      name: "SQS/SNS Fan-out"
      applied_to: "C-001→C-002 event delivery"
      rationale: "Guaranteed delivery with DLQ"
  rejected_alternatives:
    - pattern_id: "AP-DEC-002"
      name: "Modular Monolith"
      rejection_rationale: "Multiple teams need independent deployment — monolith would create release coupling"
```

8. Apply design patterns where appropriate:
   - Repository, Factory, Strategy, Observer, Circuit Breaker, Saga, etc.
9. For each design pattern: name, applied_to (C-XXX), rationale

**G1-07 enforcement:** Primary pattern MUST reference valid `pattern_id` from library. Source domains MUST be subset of detected domains.

---

## 1.7 OPERATION 7: QUALITY ATTRIBUTE ANALYSIS

Prioritize quality attributes (ISO 25010).

1. From user brief + domain context, identify relevant attributes:
   - Functional Suitability, Performance, Compatibility, Usability, Reliability, Security, Maintainability, Portability
2. Prioritize top ≥3 attributes (GATE_1 G1-05):
   ```yaml
   prioritized:
     - rank: 1
       attribute: "Reliability"
       target: "99.9% uptime SLA"
       rationale: "User requirement, financial impact of downtime"
     - rank: 2
       attribute: "Security"
       target: "SOC2 compliance"
       rationale: "Regulatory requirement"
     - rank: 3
       attribute: "Performance"
       target: "P95 < 200ms"
       rationale: "User experience"
   ```
3. Targets MUST be measurable (not "good performance" but "P95 < 200ms")
4. For performance/reliability attributes, include capacity planning:
   ```yaml
   capacity_planning:
     current_load: "[N users/requests/transactions per unit time]"
     projected_load_6m: "[projected growth]"
     projected_load_12m: "[projected growth]"
     scaling_strategy: "horizontal | vertical | hybrid"
     bottleneck_threshold: "[when does current design fail]"
   ```
5. IF capacity projections unknown → declare as assumption with confidence level

---

## 1.8 OPERATION 8: INTERFACE DESIGN

Define contracts and protocols.

1. For each boundary between components/services:
   ```yaml
   - id: "I-001"
     name: "User API"
     type: "REST|gRPC|GraphQL|event|message|file|database|SDK"
     provider: "C-001"
     consumers: ["C-002", "C-003"]
     contract: "POST /users → 201 Created with {id, name, email}"
     versioning: "URL versioning (/v1/users)"
   ```
2. Define error handling contracts
3. Define authentication/authorization approach
4. Consider backward compatibility strategy

---

## 1.9 VERIFY: Canonical Operations Validation

**PRECONDITION: [EXTRACT_COMPLETE — all 8 operations executed]**

1. **Completeness check:** Count executed operations — MUST be 8
2. **Method #85 Grounding Check:**
   1. Sample 3 components → verify they address real user needs
   2. Sample 3 dependencies → verify they exist bidirectionally
   3. Calculate verification_rate — IF < 0.70 → re-execute with more care
3. **Method #168 Phantom Hunt:**
   1. Re-scan for hallucinated components (not needed by any requirement)
   2. Re-scan for phantom dependencies (components that don't interact)
   3. Any phantoms → remove or justify
4. **Method #84 Coherence Check:**
   1. Verify dependency graph is acyclic (or cycles explicitly justified)
   2. Verify all interface providers exist as components
   3. Verify all interface consumers exist as components
   4. Cross-check: bounded contexts contain only declared components

---

## 1.10 RENDER: Canonical Operations Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `canonical-operations.yaml` following schema
2. Include ALL 8 operations with full data
3. Include: metadata (operations_executed=8), assumptions, all 8 operation sections, checklist, counter_checks
4. Write to `{output_directory}/architecture-artifacts/canonical-operations.yaml`

---

## 1.11 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | Decomposition executed (≥2 levels, ≥2 components) | PASS/FAIL |
| 2 | Boundary Definition executed (context map) | PASS/FAIL |
| 3 | Relationship Mapping executed (dependencies + data flows) | PASS/FAIL |
| 4 | Responsibility Allocation executed (SRP scores) | PASS/FAIL |
| 5 | Dependency Management executed (coupling/cohesion) | PASS/FAIL |
| 6 | Pattern Application executed (architectural + design) | PASS/FAIL |
| 7 | Quality Attribute Analysis executed (≥3 prioritized) | PASS/FAIL |
| 8 | Interface Design executed (contracts defined) | PASS/FAIL |
| 9 | ASSUMPTIONS_DECLARED (≥3) | PASS/FAIL |
| 10 | Counter-checks executed (≥ depth minimum) | PASS/FAIL |
| 11 | canonical-operations.yaml written | PASS/FAIL |

---

## 1.12 GATE_1 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G1-01 | All 8 canonical operations executed | BLOCKER | |
| G1-02 | Decomposition depth ≥ 2 levels | CRITICAL | |
| G1-03 | Boundaries explicitly defined | CRITICAL | |
| G1-04 | Dependencies mapped | ERROR | |
| G1-05 | Quality attributes prioritized (≥3) | CRITICAL | |
| G1-06 | ASSUMPTIONS_DECLARED present (≥3) | CRITICAL | |
| G1-07 | Primary pattern references valid pattern_id from library, source_domains ⊆ detected domains | CRITICAL | |
| G1-08 | Key decisions include reasoning (WHY not just WHAT) — ≥80% of components have reasoning field | ERROR | |

**Pass criteria:** G1-01 (BLOCKER) + ALL CRITICAL conditions met

- IF G1-01 fails → GATE_1 = **LOCKED** → ABORT (BLOCKER, INV-07 violation)
- IF CRITICAL fails → GATE_1 = **LOCKED** → HALT, fix, re-evaluate
- IF ALL pass → GATE_1 = **OPEN** → proceed to Phase 2
