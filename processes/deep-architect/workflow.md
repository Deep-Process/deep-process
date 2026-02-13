# Deep-Architect V1.4.1 — Orchestrator

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
   - IF OPEN → proceed to USER CHECKPOINT 1
5. **Violation check:** Agent MUST NOT read step-02 until GATE_1 = OPEN

---

### USER CHECKPOINT 1 (After Phase 1, Before Phase 2)

1. **Precondition:** GATE_1 = OPEN
2. **Present to user:** Summary of canonical operations (components, boundaries, patterns, quality attributes)
3. **User evaluation checklist:**

   | # | Evaluation Question | Answer |
   |---|---------------------|--------|
   | 1 | Does the decomposition cover ALL functional areas from the brief? | YES/NO/PARTIAL |
   | 2 | Are component boundaries clear (you can explain where each responsibility lives)? | YES/NO |
   | 3 | Do the selected patterns match the problem (not over/under-engineered)? | YES/NO |
   | 4 | Are quality attribute targets realistic and measurable? | YES/NO |
   | 5 | Does the architecture match the team's capability to build and maintain it? | YES/NO |

   **IF ≥2 answers are NO → recommend MODIFY**

4. **User decides:**
   - `APPROVE` → proceed to PHASE 2
   - `MODIFY` → user provides feedback → re-execute affected operations in Phase 1 → re-evaluate GATE_1
   - `ABORT` → log reason, terminate process

---

### PHASE 2: ARTIFACT GENERATION

1. **Precondition:** GATE_1 = OPEN AND Checkpoint 1 approved (if not, HALT)
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
   - IF OPEN → evaluate REDESIGN_LOOP (section 3.13)
5. **REDESIGN_LOOP evaluation (MANDATORY):**
   - IF redesign_required = TRUE → present to user → user decides:
     - `REDESIGN` → go to PHASE 1 (carry adversary findings as constraints)
     - `REDESIGN_ARTIFACTS` → go to PHASE 2 (update diagrams/ADRs)
     - `ACCEPT_RISK` → log risk acceptance, proceed to PHASE 4
   - IF redesign_required = FALSE → proceed to PHASE 4
   - Max iterations: config.iterations_max (1 quick / 3 standard / 10 deep)
6. **Violation check:** Agent MUST NOT read step-04 until GATE_3 = OPEN AND REDESIGN_LOOP evaluated

---

### USER CHECKPOINT 2 (After ADVERSARY + REDESIGN_LOOP, Before Phase 4)

1. **Precondition:** GATE_3 = OPEN AND REDESIGN_LOOP evaluated
2. **Present to user:** Summary of adversary findings:
   - Critical STRIDE threats (severity=critical)
   - High-RPN failure modes (RPN > 100)
   - Detected anti-patterns (severity=critical/high)
   - Pre-mortem scenarios (impact=catastrophic)
   - REDESIGN_LOOP result (triggered/not triggered, user decision)
3. **User evaluation checklist:**

   | # | Evaluation Question | Answer |
   |---|---------------------|--------|
   | 1 | Are the identified threats realistic for this system? | YES/NO |
   | 2 | Are the proposed mitigations adequate for critical findings? | YES/NO |
   | 3 | Are you comfortable proceeding to trade-off analysis? | YES/NO |

   **IF any answer is NO → recommend REVIEW_IN_DETAIL**

4. **User decides:**
   - `PROCEED` → proceed to PHASE 4
   - `REVIEW_IN_DETAIL` → user examines full adversary-findings.yaml, provides feedback
   - `ABORT` → log reason, terminate process

---

### PHASE 4: TRADE-OFF ANALYSIS

1. **Precondition:** GATE_3 = OPEN AND Checkpoint 2 approved (if not, HALT)
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

| Phase | Step File | Gate |
|-------|-----------|------|
| 0 | step-00-context.md | GATE_0 (8) |
| CP1 | — | User decision |
| 1 | step-01-canonical.md | GATE_1 (8) |
| 2 | step-02-artifacts.md | GATE_2 (7) |
| 3 | step-03-adversary.md | GATE_3 (7) |
| RL | — | REDESIGN_LOOP |
| CP2 | — | User decision |
| 4 | step-04-tradeoffs.md | GATE_4 (7) |
| 5 | step-05-validation.md | GATE_5 (7) |
| 6 | step-06-verification.md | GATE_6 (9) |

---

## ARTIFACT DIRECTORY

All artifacts saved to: `{output_directory}/architecture-artifacts/`

---

**VERSION:** 1.4.1
