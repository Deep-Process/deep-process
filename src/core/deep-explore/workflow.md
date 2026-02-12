# Deep Explore V3.2 — Orchestrator

> Minimal orchestrator. All protocols, gates, schemas embedded in step files.
> Load ONE step file at a time. Execute it. Pass its gate. Load next.

---

## PRIORITY DECLARATION

```
PRIORITY ORDER (binding — when in conflict, higher wins):
1. COMPLETENESS — every element covered, no silent omissions
2. DEPTH — thorough analysis of each element
3. ACCURACY — verified over assumed
4. TOKEN_ECONOMY — conciseness

ENFORCEMENT: If agent abbreviates output citing "token limits" or "brevity",
this is a PRIORITY VIOLATION. Re-execute with full output.
```

---

## SCOPE_REDUCTION PROTOCOL

When agent cannot meet a gate condition:

```yaml
SCOPE_REDUCTION_DECLARATION:
  gate: GATE_NN
  item_skipped: "[specific condition not met]"
  reason: "[honest reason — NOT 'for brevity']"
  impact_assessment: "[what is lost]"
  completeness_cost: "[how this affects output]"
  requires_user_approval: YES (CRITICAL items) | NO (REQUIRED items)
```

**IF requires_user_approval = YES:**
- HALT — present to user, wait for approval
- User may: APPROVE | DENY (must complete) | MODIFY

**IF requires_user_approval = NO:**
- LOG in process log
- PROCEED with reduced scope

**ENFORCEMENT:** "Intelligent" omission without SCOPE_REDUCTION_DECLARATION = SILENT_OMISSION = CRITICAL PROCESS VIOLATION.

---

## EXECUTION SEQUENCE

**Agent MUST execute steps 0→6 sequentially. Violation = ABORT process.**

### STEP 0: KNOWLEDGE AUDIT

1. **Read:** `steps/step-00-knowledge-audit.md`
2. **Execute fully** (includes depth selection, ASSUMPTIONS_DECLARED, EVR, checklist, GATE_00)
3. **Verify:** GATE_00 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 1
4. **Violation check:** Agent MUST NOT read step-01 until GATE_00 = OPEN

---

### STEP 1: RESEARCH

1. **Precondition:** GATE_00 = OPEN (if not, HALT)
2. **Read:** `steps/step-01-research.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_01)
4. **Verify:** GATE_01 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 2
5. **Violation check:** Agent MUST NOT read step-02 until GATE_01 = OPEN

---

### STEP 2: MAP

1. **Precondition:** GATE_01 = OPEN (if not, HALT)
2. **Read:** `steps/step-02-map.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_02)
4. **Verify:** GATE_02 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 3
5. **Violation check:** Agent MUST NOT read step-03 until GATE_02 = OPEN

---

### STEP 3: DEEPEN

1. **Precondition:** GATE_02 = OPEN (if not, HALT)
2. **Read:** `steps/step-03-deepen.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_03)
4. **Verify:** GATE_03 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 4
5. **Violation check:** Agent MUST NOT read step-04 until GATE_03 = OPEN

---

### STEP 4: CHALLENGE

1. **Precondition:** GATE_03 = OPEN (if not, HALT)
2. **Read:** `steps/step-04-challenge.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_04)
4. **Verify:** GATE_04 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 5
5. **Violation check:** Agent MUST NOT read step-05 until GATE_04 = OPEN

---

### STEP 5: SYNTHESIZE

1. **Precondition:** GATE_04 = OPEN (if not, HALT)
2. **Read:** `steps/step-05-synthesize.md`
3. **Execute fully** (includes ASSUMPTIONS_DECLARED, EVR, checklist, GATE_05)
4. **Verify:** GATE_05 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → proceed to STEP 6
5. **Violation check:** Agent MUST NOT read step-06 until GATE_05 = OPEN

---

### STEP 6: OUTPUT

1. **Precondition:** GATE_05 = OPEN (if not, HALT)
2. **Read:** `steps/step-06-output.md`
3. **Execute fully** (includes scoring, report generation, GATE_06)
4. **Verify:** GATE_06 = OPEN?
   - IF LOCKED → HALT (fix issues or declare SCOPE_REDUCTION)
   - IF OPEN → process complete
5. **Output:** Final exploration report delivered to user

---

## ENFORCEMENT RULES

1. **Sequential execution:** Steps MUST execute 0→1→2→3→4→5→6 in order
2. **Progressive loading:** Read ONE step file at entry, not multiple upfront
3. **Gate blocking:** Cannot proceed if current gate = LOCKED
4. **Precondition checks:** Every step verifies previous gate = OPEN
5. **Violation = ABORT:** Out-of-order loading or gate skipping aborts process

---

**VERSION:** 3.2.0 (Minimal Orchestrator — Just-In-Time Architecture)
