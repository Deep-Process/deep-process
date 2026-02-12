# Deep-Architect V1.0 — Architecture Plan

**Status:** PLANNING
**Date:** 2026-02-11
**Based on:** Deep-Explore V3.2.0 report (256.1 points COMPREHENSIVE)
**Compliance target:** 13 ZASAD + R1-R12 requirements

---

## ZASADY COMPLIANCE MATRIX

| Zasada | Requirement | Implementation Strategy |
|--------|-------------|------------------------|
| Z0 | No decorative content | Delete reference.md, embed methods in steps, only executable instructions |
| Z0b | Split large files | Max 400 lines per step file, split if larger |
| Z1 | Self-contained (JIT) | workflow.md routing only, steps/ loaded one at a time |
| Z2 | Completeness > tokens | "All 8 operations", "Every artifact", "Each checkpoint" |
| Z3 | Mechanism not intention | Gates with IF FAIL → action, not "should" |
| Z4 | Binding gates | 7 gates (GATE_0..6), cannot skip without SCOPE_REDUCTION |
| Z5 | Assumptions before action | ASSUMPTIONS_DECLARED mandatory in every step |
| Z6 | Enforced sequence | Extract→Verify→Render, PRECONDITION checks |
| Z7 | Checklist after phase | Post-phase checklist in every step |
| Z8 | Counter-checks | Min 1/2/3 per depth (quick/standard/deep) |
| Z9 | Executable language | Imperative verbs, numbered steps, conditions |
| Z10 | Visible reasoning | Log decisions, show method application |
| Z11 | Instruction + data | Each step contains instructions + schemas + methods |
| Z12 | JIT information delivery | Data for phase N in step-N file only |
| Z13 | Zero decorations | No "Purpose", "Background", "Context" headers |

**Compliance score target:** 13/13 (100%)

---

## ARCHITECTURE DECISION (from Exploration)

**Selected cluster:** Quality-Focused Systematic (CL-001)

**Configuration:**
- **16 operations:** 8 canonical + 8 adversarial (MA-001, MA-005)
- **Execution mode:** Iterative with max 4 checkpoints (MA-003)
- **Method integration:** Embedded (MA-006, V3.1.0 pattern)
- **ADVERSARY integration:** Phase 3 post-design (MA-005)
- **Validation scope:** Bounded issue-driven (top 10 critical, MA-004)
- **Trade-off analysis:** ATAM/CBAM formal methods
- **Artifact format:** Domain-aware where applicable (MA-007)
- **Timeline buffer:** +25% for planning fallacy (MA-008)

---

## PROCESS STRUCTURE

### Directory Layout

```
src/core/deep-architect/
├── workflow.md                 # Routing table ONLY (150-200 lines)
├── process.yaml                # Framework registration
├── steps/
│   ├── step-00-context.md      # Context assessment (NEW from MA-007)
│   ├── step-01-canonical.md    # 8 canonical operations
│   ├── step-02-artifacts.md    # Generate architecture artifacts
│   ├── step-03-adversary.md    # 8 adversarial operations (NON-NEGOTIABLE)
│   ├── step-04-tradeoffs.md    # ATAM/CBAM trade-off analysis
│   ├── step-05-validation.md   # Bounded issue-driven (top 10)
│   └── step-06-verification.md # Final verification + completeness
├── data/
│   ├── gates.yaml              # 7 gate definitions with conditions
│   ├── invariants.yaml         # Process invariants
│   ├── config.yaml             # Configuration (checkpoints max 4, etc.)
│   └── schemas/
│       ├── context-assessment.schema.yaml
│       ├── canonical-operations.schema.yaml
│       ├── architecture-model.schema.yaml
│       ├── adversary-findings.schema.yaml
│       ├── tradeoff-analysis.schema.yaml
│       ├── validation-report.schema.yaml
│       └── verification-report.schema.yaml
```

**Files NOT included (ZASADA 0, Z13):**
- ❌ reference.md (decorative documentation)
- ❌ agents/ directory (V7.1.0 pattern - steps are self-contained)
- ❌ data/method-procedures/ (methods embedded in steps inline)

---

## PHASE DESIGN (7 phases: 0-6)

### Phase 0: Context Assessment (NEW)

**Rationale:** MA-007 "Context massively affects outcomes"

**Inputs:** User brief (requirements, constraints, domain)

**Enforced sequence:**
1. EXTRACT: Domain analysis (web/embedded/data/cloud)
2. EXTRACT: Team assessment (size, expertise, maturity)
3. EXTRACT: Org constraints (budget, timeline, culture)
4. EXTRACT: Requirements stability (churn rate, uncertainty)
5. VERIFY: Context classification (stable/dynamic, simple/complex)
6. VERIFY: Execution mode selection (iterative/waterfall per MA-002)
7. RENDER: context-assessment.yaml

**Methods embedded:**
- M167 Baseline Census (enumerate all constraints)
- M078 Assumption Excavation (context assumptions)

**Outputs:** context-assessment.yaml
- domain_type: web | embedded | data | cloud | hybrid
- team_size: solo | small (2-5) | medium (6-15) | large (16+)
- team_maturity: junior | mixed | senior
- requirements_stability: stable (<10% churn) | moderate | dynamic (>30% churn)
- execution_mode: iterative | waterfall | hybrid (selected based on stability)
- checkpoint_strategy: 2 | 3 | 4 (based on complexity)

**Gate:** GATE_0 (5 conditions)
- G0-01: Domain identified (CRITICAL)
- G0-02: Team assessed (CRITICAL)
- G0-03: Stability measured (CRITICAL)
- G0-04: Execution mode selected (CRITICAL)
- G0-05: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 15-30 minutes

---

### Phase 1: Canonical Operations (8 operations)

**Rationale:** MA-001 "8 canonical operations for completeness"

**Inputs:** context-assessment.yaml

**Enforced sequence (8 operations, SEQUENTIAL):**

1. **EXTRACT: Decomposition**
   - METHOD: Identify system boundaries
   - Decompose into components/modules/services
   - Define component responsibilities
   - Output: components[] list with responsibilities

2. **EXTRACT: Boundary Definition**
   - METHOD: Define context boundaries
   - Identify external systems/actors
   - Define system-to-external interfaces
   - Output: boundaries[] with external_system + interface

3. **EXTRACT: Relationship Mapping**
   - METHOD: Map component relationships
   - Document dependencies (uses, depends_on, calls)
   - Identify data flows
   - Output: relationships[] graph

4. **EXTRACT: Responsibility Allocation**
   - METHOD: Assign responsibilities to components
   - Apply Single Responsibility Principle
   - Document decision rationale (ADR pattern)
   - Output: allocations[] with component + responsibility + rationale

5. **EXTRACT: Dependency Management**
   - METHOD: Analyze dependencies
   - Identify circular dependencies (anti-pattern)
   - Calculate coupling metrics
   - Output: dependencies[] with type + direction + coupling_score

6. **EXTRACT: Pattern Application**
   - METHOD: Select architectural patterns
   - Document pattern choice rationale
   - Map patterns to components
   - Output: patterns[] with pattern_name + rationale + components

7. **EXTRACT: Quality Attribute Analysis**
   - METHOD: ISO 25010 quality attributes
   - Assess: Performance, Reliability, Security, Maintainability, Usability, Portability
   - Document target metrics per attribute
   - Output: quality_attributes[] with attribute + target + measurement

8. **EXTRACT: Interface Design**
   - METHOD: Define component interfaces
   - Document contracts (input/output/exceptions)
   - Apply interface segregation
   - Output: interfaces[] with component + contract

**VERIFY: Completeness check**
- Counter-check: All 8 operations executed? (BLOCKER if <8)
- Counter-check: Each operation has output? (CRITICAL if missing)
- Verification ratio: verified vs assumed operations

**RENDER: canonical-operations.yaml**

**Gate:** GATE_1 (6 conditions)
- G1-01: All 8 operations executed (BLOCKER)
- G1-02: Components decomposed (CRITICAL)
- G1-03: Dependencies mapped (CRITICAL)
- G1-04: Quality attributes defined (ERROR)
- G1-05: Counter-checks performed (min 1/2/3) (REQUIRED)
- G1-06: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 1-2 hours (simple) / 3-5 hours (complex)

---

### Phase 2: Artifact Generation

**Rationale:** Architecture documentation needs diagrams, models, ADRs

**Inputs:** canonical-operations.yaml

**Enforced sequence:**
1. EXTRACT: Generate C4 Context diagram (system boundaries)
2. EXTRACT: Generate C4 Container diagram (components)
3. EXTRACT: Generate C4 Component diagram (internal structure)
4. EXTRACT: Generate data model (entities, relationships)
5. EXTRACT: Generate deployment diagram (infrastructure)
6. EXTRACT: Write Architecture Decision Records (ADRs for key decisions)
7. VERIFY: Diagram completeness (all components represented)
8. VERIFY: Traceability (artifacts trace to canonical operations)
9. RENDER: architecture-model.yaml + diagrams/ + adrs/

**Methods embedded:**
- C4 model generation
- ADR template (Context, Decision, Consequences)
- Diagram validation (phantom detection)

**Outputs:**
- architecture-model.yaml (structured model)
- diagrams/ (C4 diagrams in Mermaid or PlantUML)
- adrs/ (ADR-001.md, ADR-002.md, etc.)

**Gate:** GATE_2 (5 conditions)
- G2-01: All diagram types generated (CRITICAL)
- G2-02: ADRs written for key decisions (ERROR)
- G2-03: Traceability verified (ERROR)
- G2-04: Counter-checks performed (REQUIRED)
- G2-05: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 45-90 minutes

---

### Phase 3: ADVERSARY (8 adversarial operations)

**Rationale:** MA-005 "ADVERSARY non-negotiable, Phase 3 after constructive"

**Inputs:** canonical-operations.yaml, architecture-model.yaml

**Enforced sequence (8 adversarial operations, SEQUENTIAL):**

1. **EXTRACT: Threat Modeling (STRIDE)**
   - METHOD: Apply STRIDE (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
   - For each component: identify applicable threats
   - Document threat severity (HIGH/MEDIUM/LOW)
   - Output: threats[] with component + threat_type + severity + mitigation

2. **EXTRACT: Failure Mode and Effects Analysis (FMEA)**
   - METHOD: For each component: identify failure modes
   - Calculate risk priority number (RPN = severity × occurrence × detection)
   - Prioritize top 10 critical failures
   - Output: failure_modes[] with component + failure + RPN + mitigation

3. **EXTRACT: Bottleneck Detection**
   - METHOD: Analyze performance bottlenecks
   - Identify: CPU-bound, IO-bound, memory-bound, network-bound
   - Calculate theoretical limits (back-of-envelope)
   - Output: bottlenecks[] with component + type + limit + mitigation

4. **EXTRACT: Anti-Pattern Detection**
   - METHOD: Scan for anti-patterns
   - Check: God Object, Big Ball of Mud, Spaghetti Code, Golden Hammer, Cargo Cult
   - Document detected anti-patterns
   - Output: anti_patterns[] with pattern_name + location + refactoring

5. **EXTRACT: Complexity Analysis**
   - METHOD: Measure complexity
   - Calculate: Cyclomatic complexity, coupling, cohesion
   - Identify high-complexity modules (threshold: CC > 10)
   - Output: complexity_metrics[] with component + metric + value + threshold

6. **EXTRACT: Compliance Analysis**
   - METHOD: Check regulatory/standard compliance
   - Identify applicable: GDPR, HIPAA, PCI-DSS, SOC2, ISO 27001
   - Document compliance gaps
   - Output: compliance[] with standard + requirement + gap + remediation

7. **EXTRACT: Pre-mortem (from Step 4 Challenge)**
   - METHOD: "12 months later, architecture failed badly"
   - Enumerate failure causes (STRUCTURAL/OPERATIONAL/EXTERNAL/COGNITIVE)
   - Assess preventability
   - Output: premortem[] with failure + causes + mitigation

8. **EXTRACT: Trade-off Identification**
   - METHOD: Identify conflicting quality attributes
   - Document trade-offs (e.g., performance vs security)
   - Prepare for Phase 4 ATAM analysis
   - Output: tradeoffs[] with attribute_a + attribute_b + conflict + decision_needed

**VERIFY: ADVERSARY completeness**
- Counter-check: All 8 adversarial operations executed? (BLOCKER if <8)
- Counter-check: Top 10 critical issues identified? (CRITICAL per MA-004)
- Counter-check: Each finding has mitigation? (ERROR if missing)

**RENDER: adversary-findings.yaml**

**Gate:** GATE_3 (7 conditions)
- G3-01: All 8 adversarial operations executed (BLOCKER)
- G3-02: Threat model complete (CRITICAL)
- G3-03: FMEA top 10 identified (CRITICAL per MA-004)
- G3-04: Anti-patterns detected (ERROR)
- G3-05: Pre-mortem causes documented (ERROR)
- G3-06: Counter-checks performed (min 1/2/3) (REQUIRED)
- G3-07: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 1.5-3 hours

---

### Phase 4: Trade-off Analysis (ATAM/CBAM)

**Rationale:** Formal trade-off analysis for quality attributes

**Inputs:** canonical-operations.yaml, adversary-findings.yaml

**Enforced sequence:**
1. EXTRACT: Load quality attributes (from Phase 1)
2. EXTRACT: Load trade-offs (from Phase 3)
3. EXTRACT: For each trade-off: apply ATAM scenario analysis
   - Quality attribute scenario (source, stimulus, response)
   - Architectural tactics evaluation
   - Sensitivity points identification
   - Trade-off points documentation
4. EXTRACT: Apply CBAM cost-benefit analysis (if budget-constrained)
   - Estimate cost per tactic
   - Estimate benefit (quality improvement)
   - Calculate ROI
5. VERIFY: Trade-off decisions justified (rationale documented)
6. VERIFY: Sensitivity points validated (impact assessed)
7. RENDER: tradeoff-analysis.yaml

**Methods embedded:**
- ATAM scenario template
- CBAM ROI calculation
- Sensitivity analysis

**Outputs:**
- tradeoff-analysis.yaml
  - scenarios[] (quality attribute scenarios)
  - tactics[] (architectural tactics evaluated)
  - sensitivity_points[] (where small changes = big impact)
  - tradeoff_points[] (conflicting quality attributes)
  - decisions[] (justified trade-off decisions)

**Gate:** GATE_4 (5 conditions)
- G4-01: All trade-offs analyzed (CRITICAL)
- G4-02: Decisions justified (ERROR)
- G4-03: Sensitivity points documented (ERROR)
- G4-04: Counter-checks performed (REQUIRED)
- G4-05: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 45-90 minutes

---

### Phase 5: Validation (Bounded Issue-Driven)

**Rationale:** MA-004 "Issue-driven MUST be bounded (top 10) or risks infinite scope"

**Inputs:** adversary-findings.yaml, tradeoff-analysis.yaml

**Enforced sequence:**
1. EXTRACT: Load top 10 critical issues (from FMEA RPN ranking)
2. For each of top 10 issues:
   - EXTRACT: Define validation test
   - EXTRACT: Execute validation (manual reasoning or tool-based)
   - VERIFY: Issue confirmed or false positive
   - VERIFY: Mitigation adequate or needs improvement
3. VERIFY: Bounded validation (exactly 10 issues, not more)
4. VERIFY: Unknown-unknown check (did validation reveal NEW issues?)
5. RENDER: validation-report.yaml

**Methods embedded:**
- Validation test design
- Mitigation adequacy assessment
- Unknown-unknown detection (MA-004 blind spot awareness)

**Outputs:**
- validation-report.yaml
  - validated_issues[] (10 issues, validation results)
  - false_positives[] (issues ruled out)
  - new_issues_discovered[] (unknown-unknowns surfaced)
  - mitigation_status[] (adequate | needs_improvement)

**Gate:** GATE_5 (6 conditions)
- G5-01: Exactly 10 issues validated (BLOCKER if != 10, per MA-004)
- G5-02: Each issue has validation test (CRITICAL)
- G5-03: Mitigation status documented (ERROR)
- G5-04: Unknown-unknown check performed (ERROR)
- G5-05: Counter-checks performed (REQUIRED)
- G5-06: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 30-60 minutes

---

### Phase 6: Verification (Final Completeness)

**Rationale:** Final pass to ensure all requirements met, nothing missed

**Inputs:** All previous phase outputs

**Enforced sequence:**
1. EXTRACT: Completeness audit
   - All 8 canonical operations executed? (count from Phase 1)
   - All 8 adversarial operations executed? (count from Phase 3)
   - All artifacts generated? (count from Phase 2)
   - All trade-offs analyzed? (count from Phase 4)
   - Top 10 validated? (count from Phase 5)
2. VERIFY: Traceability matrix
   - Requirements → operations → artifacts → validations
   - No orphaned requirements (all traced)
   - No phantom artifacts (all trace to requirements)
3. VERIFY: Quality gate summary (all GATE_0..5 passed?)
4. VERIFY: Assumptions status (confirmed/falsified/hypothetical)
5. VERIFY: Counter-check summary (min counts met per depth?)
6. RENDER: verification-report.yaml

**Methods embedded:**
- M167 Baseline Census (count all elements)
- M168 Phantom Hunt (detect hallucinated items)
- M084 Coherence Check (traceability)

**Outputs:**
- verification-report.yaml
  - completeness_audit (counts per phase)
  - traceability_matrix (requirements → artifacts)
  - gate_summary (GATE_0..6 status)
  - assumptions_summary (26+ assumptions from all phases)
  - counter_check_summary (15+ checks)
  - final_verdict: COMPLETE | INCOMPLETE (with gaps listed)

**Gate:** GATE_6 (7 conditions)
- G6-01: All phases executed (BLOCKER if phase skipped)
- G6-02: All gates passed (BLOCKER if any LOCKED)
- G6-03: Completeness audit passed (CRITICAL)
- G6-04: Traceability verified (ERROR)
- G6-05: No scope reductions OR all justified (ERROR)
- G6-06: Counter-checks performed (REQUIRED)
- G6-07: Post-phase checklist PASSED (CRITICAL)

**Time estimate:** 20-40 minutes

---

## FILE SIZE LIMITS (ZASADA 0b)

**Rule:** Max 400 lines per step file (Deep-Verify step-03-adversarial.md = 623 lines is max observed)

**Enforcement:**
- Step 0: ~250 lines (context assessment, 5 extractions)
- Step 1: ~400 lines (8 canonical operations, may need split if >400)
  - **Mitigation:** Use sub-sections 1.1-1.8, compact method embeddings (3-5 bullets each)
- Step 2: ~300 lines (artifact generation, 6 diagram types)
- Step 3: ~450 lines (8 adversarial operations, HIGHEST risk of exceeding 400)
  - **Mitigation if >400:** Split into step-03a-threats.md (operations 1-4) and step-03b-complexity.md (operations 5-8)
- Step 4: ~250 lines (ATAM/CBAM, scenario-based)
- Step 5: ~200 lines (bounded validation, exactly 10 issues)
- Step 6: ~250 lines (verification, audit)

**Splitting strategy if needed:**
- Step 3 → step-03a-adversary-threats.md (STRIDE, FMEA, Bottleneck, Anti-patterns)
- Step 3 → step-03b-adversary-complexity.md (Complexity, Compliance, Pre-mortem, Trade-offs)
- Maintain continuity: GATE_3a checks first 4 operations, GATE_3b checks last 4 operations
- Final GATE_3 checks all 8 operations

---

## GATES SUMMARY

| Gate | Phase | Conditions | Severity Distribution |
|------|-------|------------|----------------------|
| GATE_0 | Context | 5 | 5 CRITICAL |
| GATE_1 | Canonical | 6 | 3 CRITICAL, 1 ERROR, 1 BLOCKER, 1 REQUIRED |
| GATE_2 | Artifacts | 5 | 2 CRITICAL, 2 ERROR, 1 REQUIRED |
| GATE_3 | Adversary | 7 | 4 CRITICAL, 2 ERROR, 1 BLOCKER, 1 REQUIRED |
| GATE_4 | Trade-offs | 5 | 1 CRITICAL, 2 ERROR, 1 REQUIRED |
| GATE_5 | Validation | 6 | 2 CRITICAL, 2 ERROR, 1 BLOCKER, 1 REQUIRED |
| GATE_6 | Verification | 7 | 2 CRITICAL, 2 ERROR, 2 BLOCKER, 1 REQUIRED |

**Total:** 7 gates, 41 conditions

**Severity levels:**
- BLOCKER: Cannot proceed, process halts (3 conditions)
- CRITICAL: Must pass or SCOPE_REDUCTION required (14 conditions)
- ERROR: Should pass, logged if fail (9 conditions)
- REQUIRED: Logged but non-blocking (6 conditions)

---

## INVARIANTS (Process Rules)

**INV-01: Sequential Execution**
- Type: ENFORCEMENT
- Rule: Phases execute 0→1→2→3→4→5→6 sequentially
- Violation: BLOCKER (process aborts)

**INV-02: Gate Blocking**
- Type: ENFORCEMENT
- Rule: Cannot proceed to Phase N+1 if GATE_N = LOCKED
- Violation: BLOCKER

**INV-03: ASSUMPTIONS_DECLARED**
- Type: ENFORCEMENT
- Rule: Every phase MUST declare ≥1 assumption before extraction
- Violation: CRITICAL

**INV-04: Extract→Verify→Render Sequence**
- Type: ENFORCEMENT
- Rule: Every phase MUST follow EVR sequence
- Violation: CRITICAL (SEQUENCE_VIOLATION)

**INV-05: Post-Phase Checklist**
- Type: ENFORCEMENT
- Rule: Every phase MUST execute checklist before gate
- Violation: CRITICAL

**INV-06: Counter-Check Minimum**
- Type: QUALITY
- Rule: Min counter-checks per depth: quick=1, standard=2, deep=3 per phase
- Violation: REQUIRED (logged but not blocking)

**INV-07: Eight Canonical Operations**
- Type: COMPLETENESS
- Rule: Phase 1 MUST execute all 8 operations (no skipping)
- Violation: BLOCKER

**INV-08: Eight Adversarial Operations**
- Type: COMPLETENESS
- Rule: Phase 3 MUST execute all 8 operations (non-negotiable per MA-005)
- Violation: BLOCKER

**INV-09: Bounded Validation**
- Type: COMPLETENESS
- Rule: Phase 5 validates exactly 10 issues (per MA-004)
- Violation: BLOCKER if != 10

**INV-10: Checkpoint Maximum**
- Type: QUALITY
- Rule: Max 4 checkpoints to prevent approval fatigue (per MA-003)
- Violation: ERROR (warn user)

**INV-11: Embedded Methods**
- Type: SELF-CONTAINMENT
- Rule: All methods embedded inline in step files (no external references)
- Violation: CRITICAL (breaks R1)

**INV-12: Just-In-Time Loading**
- Type: EFFICIENCY
- Rule: Load only current step file, not all upfront
- Violation: ERROR (violates Z12)

---

## TIMELINE ESTIMATES (with +25% buffer per MA-008)

### Base estimates:
- **Simple architecture** (solo, web app, stable): 2-4 hours
- **Medium architecture** (small team, microservices, moderate): 4-8 hours
- **Complex architecture** (large team, distributed, dynamic): 8-12 hours

### With +25% planning fallacy buffer:
- **Simple:** 2.5-5 hours
- **Medium:** 5-10 hours
- **Complex:** 10-15 hours

### Per-phase breakdown (medium architecture):
```
Phase 0: Context         30 min
Phase 1: Canonical      120 min (8 operations × 15 min)
Phase 2: Artifacts       60 min
Phase 3: Adversary      150 min (8 operations × 18-20 min)
Phase 4: Trade-offs      60 min
Phase 5: Validation      45 min
Phase 6: Verification    30 min
─────────────────────────────
Base total:             495 min (8.25 hours)
+25% buffer:            619 min (10.3 hours)
```

---

## ARTIFACT SCHEMAS (Summary)

### context-assessment.schema.yaml
```yaml
domain_type: string (enum: web, embedded, data, cloud, hybrid)
team_size: string (enum: solo, small, medium, large)
team_maturity: string (enum: junior, mixed, senior)
requirements_stability: string (enum: stable, moderate, dynamic)
stability_percentage: number (churn rate 0-100%)
execution_mode: string (enum: iterative, waterfall, hybrid)
checkpoint_strategy: number (2-4)
constraints: array (budget, timeline, regulatory)
assumptions: array (H-0xx assumptions)
```

### canonical-operations.schema.yaml
```yaml
operations:
  decomposition:
    components: array (component_id, name, responsibility)
  boundaries:
    external_systems: array (system_id, name, interface)
  relationships:
    dependencies: array (from, to, type, coupling_score)
  responsibilities:
    allocations: array (component_id, responsibility, rationale)
  dependency_management:
    circular_dependencies: array (detected cycles)
    coupling_metrics: object (afferent, efferent, instability)
  patterns:
    applied_patterns: array (pattern_name, rationale, components)
  quality_attributes:
    attributes: array (attribute, target, measurement, status: VERIFIED|ASSUMED)
  interfaces:
    contracts: array (component, input, output, exceptions)
verification_ratio: number (verified / total)
assumptions: array (H-1xx assumptions)
```

### architecture-model.schema.yaml
```yaml
diagrams:
  c4_context: object (systems, actors, relationships)
  c4_container: object (containers, technologies, interactions)
  c4_component: object (components, responsibilities)
  data_model: object (entities, relationships, attributes)
  deployment: object (nodes, containers, connections)
adrs: array (adr_id, title, context, decision, consequences, status)
traceability: array (requirement_id, operations[], artifacts[])
assumptions: array (H-2xx assumptions)
```

### adversary-findings.schema.yaml
```yaml
threats: array (component, threat_type, severity, mitigation, status: VERIFIED|ASSUMED)
failure_modes: array (component, failure, RPN, mitigation, status)
bottlenecks: array (component, type, limit, mitigation, status)
anti_patterns: array (pattern_name, location, refactoring, status)
complexity_metrics: array (component, metric, value, threshold, status)
compliance: array (standard, requirement, gap, remediation, status)
premortem: array (failure_scenario, causes[], mitigation[], status)
tradeoffs: array (attribute_a, attribute_b, conflict, decision_needed, status)
top_10_critical: array (issue_id, RPN, description, mitigation) # EXACTLY 10
verification_ratio: number
assumptions: array (H-3xx assumptions)
```

### tradeoff-analysis.schema.yaml
```yaml
scenarios: array (scenario_id, quality_attribute, source, stimulus, response, status: VERIFIED|ASSUMED)
tactics: array (tactic_name, quality_benefit, cost, roi, status)
sensitivity_points: array (decision_point, impact, alternatives, status)
tradeoff_points: array (attribute_a, attribute_b, conflict, resolution, rationale, status)
decisions: array (decision_id, tradeoff, chosen_option, rationale, consequences, status)
assumptions: array (H-4xx assumptions)
```

### validation-report.schema.yaml
```yaml
validated_issues: array (issue_id, validation_test, result, mitigation_status) # EXACTLY 10
false_positives: array (issue_id, reason)
new_issues_discovered: array (issue_id, description, severity) # unknown-unknowns
mitigation_adequacy: array (issue_id, status: adequate | needs_improvement)
bounded_validation_check: boolean (exactly_10_issues: true|false)
assumptions: array (H-5xx assumptions)
```

### verification-report.schema.yaml
```yaml
completeness_audit:
  canonical_operations: number (should be 8)
  adversarial_operations: number (should be 8)
  artifacts_generated: number
  tradeoffs_analyzed: number
  issues_validated: number (should be 10)
traceability_matrix: array (requirement, operations[], artifacts[], validations[])
gate_summary: array (gate_id, status: OPEN|LOCKED, failures[])
assumptions_summary:
  total_declared: number
  confirmed: number
  falsified: number
  hypothetical: number
counter_check_summary:
  total_performed: number
  required_minimum: number (18 for deep)
  gap: number
scope_reductions: array (gate, item, reason, impact) # should be empty
final_verdict: string (enum: COMPLETE, INCOMPLETE)
gaps: array (gap_description, severity)
assumptions: array (H-6xx assumptions)
```

---

## IMPLEMENTATION PHASES (Recommended Order)

### Phase 0: Foundation (2-3 days)
- [ ] Create directory structure
- [ ] Write workflow.md (routing table only, 150-200 lines)
- [ ] Write process.yaml (framework registration)
- [ ] Create data/gates.yaml (41 conditions across 7 gates)
- [ ] Create data/invariants.yaml (12 invariants)
- [ ] Create data/config.yaml (checkpoint max 4, depth levels, etc.)

### Phase 1: Schemas (1-2 days)
- [ ] Write all 7 schema files in data/schemas/
- [ ] Verify schema completeness (all fields documented)

### Phase 2: Step Files (5-7 days, sequential)
- [ ] Write step-00-context.md (~250 lines)
- [ ] Write step-01-canonical.md (~400 lines, watch size)
- [ ] Write step-02-artifacts.md (~300 lines)
- [ ] Write step-03-adversary.md (~450 lines, may split to 03a/03b if >400)
- [ ] Write step-04-tradeoffs.md (~250 lines)
- [ ] Write step-05-validation.md (~200 lines)
- [ ] Write step-06-verification.md (~250 lines)

### Phase 3: Verification (1-2 days)
- [ ] Run Deep-Verify V2.0 on complete process
- [ ] Check 13 ZASAD compliance (target: 13/13)
- [ ] Check R1-R12 compliance (target: 12/12)
- [ ] Fix any violations found

### Phase 4: Pilot (3-5 days)
- [ ] Execute deep-architect on 1-2 real projects
- [ ] Measure timeline accuracy (vs estimates)
- [ ] Measure integration complexity (ADVERSARY rework rate)
- [ ] Collect user feedback

**Total estimated implementation time:** 12-19 days (2.5-4 weeks)

---

## SUCCESS METRICS

### Process Compliance:
- [ ] 13/13 ZASAD compliance (100%)
- [ ] 12/12 R1-R12 compliance (100%)
- [ ] 7/7 gates passed on pilot projects (100%)
- [ ] 0 scope reductions (ideal) or all justified
- [ ] 12/12 invariants enforced (100%)

### Quality Metrics:
- [ ] 16/16 operations executed (8 canonical + 8 adversarial)
- [ ] Verification ratio ≥50% (VERIFIED vs ASSUMED)
- [ ] Top 10 critical issues validated (100%, per MA-004)
- [ ] Max 4 checkpoints (per MA-003)
- [ ] Counter-checks ≥18 for deep (per Deep-Explore standard)

### Timeline Metrics:
- [ ] Actual time within ±25% of estimate (MA-008 buffer validation)
- [ ] ADVERSARY phase ≤30% of total time (integration smoothness)
- [ ] Rework rate ≤15% (changes after ADVERSARY phase)

### User Satisfaction:
- [ ] Architecture completeness ≥90% (no major gaps)
- [ ] ADVERSARY findings actionable ≥80% (not false positives)
- [ ] Trade-off decisions justified ≥100% (all have rationale)
- [ ] User confidence in architecture ≥8/10

---

## KNOWN RISKS & MITIGATIONS

### Risk 1: Step 3 file size >400 lines
**Probability:** HIGH (8 adversarial operations, methods embedded)
**Impact:** MEDIUM (violates ZASADA 0b)
**Mitigation:** Split to step-03a-adversary-threats.md (ops 1-4) and step-03b-adversary-complexity.md (ops 5-8)

### Risk 2: ADVERSARY rework explosion
**Probability:** MEDIUM (30-40% per Exploration F8)
**Impact:** HIGH (timeline blow-up)
**Mitigation:** (a) Pilot validation to measure actual rework rate, (b) Design feedback loops in step-03, (c) Incremental hardening vs full rework

### Risk 3: Context assessment inaccuracy
**Probability:** MEDIUM (new phase, untested)
**Impact:** HIGH (wrong execution mode → process mismatch)
**Mitigation:** (a) Counter-checks on stability measurement, (b) User confirmation before execution mode lock-in

### Risk 4: Bounded validation too narrow
**Probability:** LOW (per MA-004 finding)
**Impact:** MEDIUM (unknown-unknowns missed)
**Mitigation:** (a) Unknown-unknown check in Phase 5, (b) Document validation scope limits explicitly

### Risk 5: Method embedding bloat
**Probability:** MEDIUM (45+ methods to embed)
**Impact:** MEDIUM (file size, readability)
**Mitigation:** (a) Compact format (3-5 bullets per method), (b) Only embed methods used in that step

### Risk 6: ATAM/CBAM adaptation unclear
**Probability:** MEDIUM (Exploration flagged for expert)
**Impact:** MEDIUM (trade-off quality)
**Mitigation:** (a) Solo architect adaptation documented in step-04, (b) Pilot validation, (c) Fallback to qualitative if ATAM too complex

---

## DECISION LOG

| ID | Decision | Rationale | Status |
|----|----------|-----------|--------|
| D-001 | 7 phases (0-6) | Aligns with Deep-Explore/Verify pattern, adds context phase | APPROVED |
| D-002 | Quality-Focused Systematic cluster | Exploration recommendation (CL-001, 256.1 COMPREHENSIVE) | APPROVED |
| D-003 | 16 operations (8+8) | MA-001, MA-005 (canonical + adversarial completeness) | APPROVED |
| D-004 | ADVERSARY as Phase 3 | MA-005 (post-design, pre-implementation) | APPROVED |
| D-005 | Bounded validation (top 10) | MA-004 (prevents infinite scope) | APPROVED |
| D-006 | Max 4 checkpoints | MA-003 (prevents approval fatigue) | APPROVED |
| D-007 | Embedded methods | MA-006 (R1 self-containment, V3.1.0 pattern) | APPROVED |
| D-008 | +25% timeline buffer | MA-008 (planning fallacy mitigation) | APPROVED |
| D-009 | Context assessment first | MA-007 (context massively affects outcomes) | APPROVED |
| D-010 | No reference.md | ZASADA 0, Z13 (zero decorations) | APPROVED |
| D-011 | Max 400 lines per step | ZASADA 0b (split large files) | APPROVED |
| D-012 | workflow.md routing only | ZASADA 1, Z12 (JIT loading) | APPROVED |

---

## NEXT ACTIONS

1. **User approval:** Review this architecture plan, approve/modify
2. **Pilot decision:** Proceed with implementation OR pilot exploration findings first?
3. **Implementation:** If approved, start Phase 0 (Foundation, 2-3 days)
4. **Alternative:** If prefer pilot first, implement simplified version for 1-2 projects

**Recommendation:** APPROVE plan, proceed with implementation Phase 0 (Foundation).

**Rationale:**
- Exploration findings (256.1 COMPREHENSIVE) provide strong foundation
- 13 ZASAD compliance designed-in from start
- Risks identified with mitigations
- Timeline realistic (2.5-4 weeks implementation)
- Pilot validation built into Phase 4

---

**END OF ARCHITECTURE PLAN**
