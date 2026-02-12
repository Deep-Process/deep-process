# Deep-Architect V1.0 — Orchestrator

> Minimal orchestrator. All protocols, gates, schemas embedded in step files.
> Load ONE step file at a time. Execute it. Pass its gate. Load next.

---

## PRIORITY DECLARATION

```
PRIORITY ORDER (binding — when in conflict, higher wins):
1. COMPLETENESS — all 16 operations (8 canonical + 8 adversarial), all artifacts
2. CORRECTNESS — verified over assumed, counter-checks mandatory
3. DEPTH — thorough analysis of each operation
4. TOKEN_ECONOMY — conciseness

ENFORCEMENT: If agent abbreviates output citing "token limits" or "brevity",
this is a PRIORITY VIOLATION. Re-execute with full output.
```

---

## SCOPE_REDUCTION PROTOCOL

When agent cannot meet a gate condition:

```yaml
SCOPE_REDUCTION_DECLARATION:
  gate: GATE_N
  item_skipped: "[specific condition not met]"
  reason: "[honest reason — NOT 'for brevity']"
  impact_assessment: "[what is lost]"
  completeness_cost: "[how this affects architecture quality]"
  requires_user_approval: YES (BLOCKER/CRITICAL) | NO (ERROR/REQUIRED)
```

**IF requires_user_approval = YES:**
- HALT — present to user, wait for approval
- User may: APPROVE | DENY (must complete) | MODIFY

**IF requires_user_approval = NO:**
- LOG in process_log
- PROCEED with reduced scope

**ENFORCEMENT:** "Intelligent" omission without SCOPE_REDUCTION_DECLARATION = SILENT_OMISSION = CRITICAL PROCESS VIOLATION.

---

## EXECUTION SEQUENCE (ENFORCED — PROGRAMMATIC)

**Agent MUST execute phases 0→6 sequentially. Violation = ABORT process.**

### PHASE 0: CONTEXT ASSESSMENT

1. **Read tool:** `steps/step-00-context.md`
2. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_0)
3. **Verify:** GATE_0 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 1
4. **Violation check:** Agent MUST NOT read step-01 until GATE_0 = OPEN

---

### PHASE 1: CANONICAL OPERATIONS

1. **Precondition:** GATE_0 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-01-canonical.md`
3. **Execute fully** (includes 8 operations, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_1)
4. **Verify:** GATE_1 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 2
5. **Violation check:** Agent MUST NOT read step-02 until GATE_1 = OPEN

---

### PHASE 2: ARTIFACT GENERATION

1. **Precondition:** GATE_1 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-02-artifacts.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_2)
4. **Verify:** GATE_2 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 3
5. **Violation check:** Agent MUST NOT read step-03 until GATE_2 = OPEN

---

### PHASE 3: ADVERSARY

1. **Precondition:** GATE_2 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-03-adversary.md`
3. **Execute fully** (includes 8 adversarial operations, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_3)
4. **Verify:** GATE_3 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 4
5. **Violation check:** Agent MUST NOT read step-04 until GATE_3 = OPEN
6. **NOTE:** ADVERSARY is NON-NEGOTIABLE (user requirement + MA-005)

---

### PHASE 4: TRADE-OFF ANALYSIS

1. **Precondition:** GATE_3 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-04-tradeoffs.md`
3. **Execute fully** (includes ATAM/CBAM, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_4)
4. **Verify:** GATE_4 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 5
5. **Violation check:** Agent MUST NOT read step-05 until GATE_4 = OPEN

---

### PHASE 5: VALIDATION

1. **Precondition:** GATE_4 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-05-validation.md`
3. **Execute fully** (includes bounded validation top 10, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_5)
4. **Verify:** GATE_5 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to PHASE 6
5. **Violation check:** Agent MUST NOT read step-06 until GATE_5 = OPEN
6. **NOTE:** EXACTLY 10 issues validated (bounded per MA-004)

---

### PHASE 6: VERIFICATION

1. **Precondition:** GATE_5 = OPEN (if not, HALT)
2. **Read tool:** `steps/step-06-verification.md`
3. **Execute fully** (includes completeness audit, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_6)
4. **Verify:** GATE_6 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → process complete
5. **Output:** Final verification report delivered to user

---

## ENFORCEMENT RULES

1. **Sequential execution:** Phases MUST execute 0→1→2→3→4→5→6 in order
2. **Progressive loading:** Read ONE step file at entry, not multiple upfront
3. **Gate blocking:** Cannot proceed if current gate = LOCKED
4. **Precondition checks:** Every phase verifies previous gate = OPEN
5. **Violation = ABORT:** Out-of-order loading or gate skipping aborts process

---

## ROUTING TABLE (Self-Contained Steps)

| Phase | Step File | Operations | Time Est | Gate |
|-------|-----------|------------|----------|------|
| 0 | step-00-context.md | Context assessment (domain/team/stability) | 15-30m | GATE_0 |
| 1 | step-01-canonical.md | 8 canonical operations (Decomposition, Boundary, Relationship, Responsibility, Dependency, Pattern, Quality, Interface) | 60-120m | GATE_1 |
| 2 | step-02-artifacts.md | C4 diagrams, data model, deployment, ADRs | 45-90m | GATE_2 |
| 3 | step-03-adversary.md | 8 adversarial operations (STRIDE, FMEA, Bottleneck, Anti-patterns, Complexity, Compliance, Pre-mortem, Trade-offs) | 90-180m | GATE_3 |
| 4 | step-04-tradeoffs.md | ATAM/CBAM trade-off analysis | 45-90m | GATE_4 |
| 5 | step-05-validation.md | Bounded validation (top 10 critical issues) | 30-60m | GATE_5 |
| 6 | step-06-verification.md | Completeness audit, traceability | 20-40m | GATE_6 |

**Total time:** 5-10 hours (medium complexity with +25% buffer)

---

## ARTIFACT DIRECTORY

All artifacts saved to: `{output_directory}/architecture-artifacts/`

**Artifacts:**
- `context-assessment.yaml` (Phase 0)
- `canonical-operations.yaml` (Phase 1)
- `architecture-model.yaml` (Phase 2)
- `diagrams/` (C4, data model, deployment)
- `adrs/` (Architecture Decision Records)
- `adversary-findings.yaml` (Phase 3)
- `tradeoff-analysis.yaml` (Phase 4)
- `validation-report.yaml` (Phase 5)
- `verification-report.yaml` (Phase 6)
- `process-log.yaml` (all phases)

---

## INVARIANTS (Binding Process Rules)

**INV-01:** Sequential execution (0→6, no skipping)
**INV-02:** Gate blocking (LOCKED = cannot proceed)
**INV-03:** ASSUMPTIONS_DECLARED (every phase ≥1 assumption)
**INV-04:** Extract→Verify→Render sequence (every phase)
**INV-05:** Post-phase checklist (every phase)
**INV-06:** Counter-checks minimum (quick=1, standard=2, deep=3 per phase)
**INV-07:** Eight canonical operations (Phase 1, all 8 mandatory)
**INV-08:** Eight adversarial operations (Phase 3, all 8 mandatory, NON-NEGOTIABLE)
**INV-09:** Bounded validation (Phase 5, exactly 10 issues)
**INV-10:** Checkpoint maximum (max 4 checkpoints to prevent approval fatigue)
**INV-11:** Embedded methods (all methods inline in steps, no external files)
**INV-12:** Just-in-time loading (load only current step, not all upfront)

See `data/invariants.yaml` for full definitions and violation handling.

---

## VIOLATION DETECTION

**CRITICAL PROCESS VIOLATION** → ABORT execution, log in process-log.yaml:
- Out-of-order phase execution
- Gate skipped without OPEN status
- Step file loaded before previous gate OPEN
- SILENT_OMISSION (skipping without SCOPE_REDUCTION)
- < 8 canonical operations in Phase 1
- < 8 adversarial operations in Phase 3
- ≠ 10 issues validated in Phase 5

**Severity levels:**
- **BLOCKER:** Process halts immediately, cannot proceed
- **CRITICAL:** SCOPE_REDUCTION required with user approval
- **ERROR:** Logged, may proceed with degraded quality
- **REQUIRED:** Logged, non-blocking

---

**VERSION:** 1.0.0 (Deep-Architect Initial Release — 2026-02-11)
