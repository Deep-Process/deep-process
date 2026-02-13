# Deep-Document V8.0 - Code Documentation Process

**Version:** 8.0.1
**Pattern:** Deep-Verify minimal core (6 phases, 0 phantom artifacts, <40% overhead)

---

## PRIORITY DECLARATION

**COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS**

If choice between:
- Read all files (expensive) vs sample files (cheap) → **Read all**
- Extract all knowledge (thorough) vs quick scan (fast) → **Extract all**
- Verify every claim (careful) vs spot-check (efficient) → **Verify every**

Agent abbreviates or skips → **PRIORITY VIOLATION** → Re-execute phase with COMPLETENESS enforcement.

---

## PROCESS OVERVIEW

**Input:** Repository path + documentation template
**Output:** Comprehensive documentation in `docs/` directory
**Phases:** 6 mandatory (PREPARATION → KNOWLEDGE → MAPPING → DOCUMENTATION → VERIFICATION → REFINEMENT)
**Time:** 90-180 minutes typical (depends on project size: small <50 files: 90 min, medium 50-200 files: 120 min, large >200 files: 180 min)
**Artifacts:** 6 total (all consumed by downstream phases, 0 phantoms)

---

## ROUTING TABLE (Just-In-Time Loading)

Agent loads **ONE step file at a time** when entering phase. NOT all upfront.

| Phase | Step File | Load When | Time Est | Gate |
|-------|-----------|-----------|----------|------|
| 0 | `steps/step-00-preparation.md` | Process start | 15-20 min | GATE_0 |
| 1 | `steps/step-01-knowledge.md` | GATE_0 passes | 30-90 min | GATE_1 |
| 2 | `steps/step-02-mapping.md` | GATE_1 passes | 10-15 min | GATE_2 |
| 3 | `steps/step-03-documentation.md` | GATE_2 passes | 30-45 min | GATE_3 |
| 4 | `steps/step-04-verification.md` | GATE_3 passes | 15-20 min | GATE_4 |
| 5 | `steps/step-05-refinement.md` | GATE_4 passes OR user request | 10-15 min | GATE_5 |

**VIOLATION:** Agent reading step-03 during phase 0 = **ZASADA 12 violation** → HALT.

---

## EXECUTION SEQUENCE (ENFORCED - PROGRAMMATIC)

### Phase 0: PREPARATION
```
1. Read tool: steps/step-00-preparation.md
2. Execute ENFORCED SEQUENCE from step file
3. Evaluate GATE_0 (template understood, assumptions declared)
4. IF GATE_0 fails → SCOPE_REDUCTION_DECLARATION or ABORT
5. IF GATE_0 passes → Proceed to Phase 1
```

PRECONDITION: None (entry point)
VIOLATION CHECK: Agent MUST NOT read step-01 until GATE_0 = OPEN

### Phase 1: KNOWLEDGE EXTRACTION
```
1. Read tool: steps/step-01-knowledge.md
2. Execute ENFORCED SEQUENCE (execution/data/control/test/config flow analysis)
3. Evaluate GATE_1 (≥80% coverage, counter-checks pass)
4. IF GATE_1 fails → SCOPE_REDUCTION_DECLARATION or ABORT
5. IF GATE_1 passes → Proceed to Phase 2
```

PRECONDITION: GATE_0 = OPEN (if not, HALT)
VIOLATION CHECK: Agent MUST NOT read step-02 until GATE_1 = OPEN

### Phase 2: TEMPLATE MAPPING
```
1. Read tool: steps/step-02-mapping.md
2. Execute ENFORCED SEQUENCE (map knowledge → template sections)
3. Evaluate GATE_2 (≥90% template coverage)
4. IF GATE_2 fails → SCOPE_REDUCTION_DECLARATION or ABORT
5. IF GATE_2 passes → Proceed to Phase 3
```

PRECONDITION: GATE_1 = OPEN
VIOLATION CHECK: Agent MUST NOT read step-03 until GATE_2 = OPEN

### Phase 3: DOCUMENTATION
```
1. Read tool: steps/step-03-documentation.md
2. Execute ENFORCED SEQUENCE (write sections with evidence)
3. Evaluate GATE_3 (quality gates pass)
4. IF GATE_3 fails → SCOPE_REDUCTION_DECLARATION or ABORT
5. IF GATE_3 passes → Proceed to Phase 4
```

PRECONDITION: GATE_2 = OPEN
VIOLATION CHECK: Agent MUST NOT read step-04 until GATE_3 = OPEN

### Phase 4: VERIFICATION
```
1. Read tool: steps/step-04-verification.md
2. Execute ENFORCED SEQUENCE (verify claims, detect hallucinations)
3. Evaluate GATE_4 (<5% claim degradation)
4. IF GATE_4 fails → SCOPE_REDUCTION_DECLARATION or ABORT
5. IF GATE_4 passes → Proceed to Phase 5 OR Complete (user choice)
```

PRECONDITION: GATE_3 = OPEN
VIOLATION CHECK: Agent MUST NOT read step-05 until GATE_4 = OPEN

### Phase 5: REFINEMENT (Optional)
```
1. Read tool: steps/step-05-refinement.md
2. Execute ENFORCED SEQUENCE (address issues, polish)
3. Evaluate GATE_5 (user approval)
4. IF GATE_5 passes → COMPLETE
```

PRECONDITION: GATE_4 = OPEN OR user explicit request
VIOLATION CHECK: None (terminal phase)

---

## ENFORCEMENT RULES

### Rule E-01: Sequential Execution (BINDING)
Agent MUST execute phases in order 0→1→2→3→4→5. Skipping phases = **PROCESS VIOLATION** → ABORT.

### Rule E-02: Progressive Loading (BINDING - ZASADA 12)
Agent loads ONE step file per phase. Loading all steps upfront = **PROCESS VIOLATION** → ABORT.

### Rule E-03: Gate Enforcement (BINDING)
Agent CANNOT proceed to Phase N+1 if GATE_N = LOCKED. Attempting bypass = **PROCESS VIOLATION** → ABORT.

### Rule E-04: SCOPE_REDUCTION Protocol (BINDING)
If gate fails, agent has 2 options:
1. **SCOPE_REDUCTION_DECLARATION** - Log decision to reduce scope (e.g., "Cannot analyze config files, proceeding without config analysis")
2. **ABORT** - Halt process, report failure

Agent proceeding without either = **PROCESS VIOLATION** → ABORT.

### Rule E-05: Artifact Consumption (BINDING)
Every artifact MUST have downstream consumer. Creating unused artifact = **PROCESS VIOLATION** → Flag in verification.

### Rule E-06: User Checkpoint (BINDING)
After Phase 1 (KNOWLEDGE EXTRACTION), agent MUST present knowledge-map summary to user and wait for confirmation before proceeding to Phase 2. All gates are self-evaluated — user checkpoint provides external validation of extraction quality. Skipping checkpoint = **PROCESS VIOLATION** → ABORT.

---

## SCOPE_REDUCTION_PROTOCOL

When gate condition fails but proceeding is acceptable:

```yaml
scope_reduction:
  phase: <phase_number>
  gate: <gate_id>
  condition_failed: <which condition>
  justification: <why reduction acceptable>
  impact: <what coverage lost>
  mitigation: <how to minimize impact>
  logged_at: <timestamp>
```

Example:
```yaml
scope_reduction:
  phase: 1
  gate: GATE_1
  condition_failed: "Config analysis completeness <80%"
  justification: "No config files found in repository"
  impact: "Configuration section will be minimal"
  mitigation: "Document absence of config files explicitly"
  logged_at: 2026-02-12T10:30:00Z
```

---

## ARTIFACT DIRECTORY

All artifacts saved to: `{output_directory}/deep-artifacts/`

| Artifact | Producer | Consumers | Purpose |
|----------|----------|-----------|---------|
| `preparation-report.yaml` | Phase 0 | Phase 1, 2 (assumptions reference) | Template understanding, assumptions |
| `knowledge-map.yaml` | Phase 1 | Phase 2, 3, 4 (mapping, writing, entity verification) | Execution/data/control/test/config flows |
| `documentation-plan.yaml` | Phase 2 | Phase 3, 4 (writing order, verification) | Template section mapping, coverage plan |
| `entity-log.yaml` | Phase 3 | Phase 4 (entity completeness verification) | Entity tracking per section |
| `docs/*.md` | Phase 3 | Phase 4, 5 (verification target), User (deliverable) | Final documentation output |
| `verification-report.yaml` | Phase 4 | Phase 5 (issues to fix), User (quality report) | Claim verification, hallucination detection |

**Total:** 6 artifacts, 0 phantoms, 100% consumer coverage.

---

## VIOLATION DETECTION

### Severity Levels
- **CRITICAL PROCESS VIOLATION** → ABORT execution immediately, log in process state
- **ERROR** → Block progression to next phase, require fix
- **WARNING** → Flag for review, allow progression with user acknowledgment

### Compliance Principles
1. **Sequential loading** — Agent reads step-N+1 before completing phase-N → CRITICAL VIOLATION
2. **Gate enforcement** — Agent proceeds without gate evaluation → CRITICAL VIOLATION
3. **Artifact consumption** — Every artifact has downstream consumer (verified in Phase 4)
4. **Scope reduction** — Gate fails without SCOPE_REDUCTION_DECLARATION → ERROR

---

## ENFORCEMENT SUMMARY

| Mechanism | Type | Enforcement |
|-----------|------|-------------|
| **6 Binding Gates** | GATE_0..5 | Block progression if conditions fail |
| **Sequential execution** | Rule E-01 | Phases must run 0→1→2→3→4→5 |
| **Just-in-time loading** | Rule E-02 | ONE step file per phase |
| **SCOPE_REDUCTION** | Protocol | Required when gate fails but proceed acceptable |
| **Artifact consumption** | Rule E-05 | All artifacts must have consumers |
| **Violation detection** | System | CRITICAL violations abort process |

