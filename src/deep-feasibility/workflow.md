# Deep-Feasibility V2.0 — Systematic Feasibility Assessment

---

## PRIORITY

**COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS**

Agent ALWAYS completes ALL dimensions (10 total) for selected depth.
- "Main dimensions" = VIOLATION
- "Typical constraints" = VIOLATION
- "Relevant methods" = VIOLATION

No shortcuts. No intelligent skipping without SCOPE_REDUCTION_DECLARATION.

---

## EXECUTION SEQUENCE (ENFORCED — PROGRAMMATIC)

### Step 0: FRAME

1. Read tool: steps/step-00-frame.md
2. Execute ENFORCED SEQUENCE
3. Evaluate GATE_0 (defined: data/gates.yaml)
4. IF GATE_0 = FAIL → HALT
5. IF GATE_0 = PASS → PROCEED Step 1

**PRECONDITION:** NONE (entry point)

**VIOLATION CHECK:** Agent MUST NOT read step-01 until GATE_0 = PASS

---

### Step 1: CONSTRAIN

1. Read tool: steps/step-01-constrain.md
2. Execute ENFORCED SEQUENCE
3. Evaluate GATE_1
4. IF GATE_1 = FAIL → RERUN Step 1 OR SCOPE_REDUCTION
5. IF GATE_1 = PASS → PROCEED Step 2

**PRECONDITION:** GATE_0 = PASS (if not, HALT)

**VIOLATION CHECK:** Agent MUST NOT skip constraint methods per depth level

---

### Step 2: ASSESS

1. Read tool: steps/step-02-assess.md
2. Execute ENFORCED SEQUENCE (10 dimensions, ALL required per COMPLETENESS priority)
3. Evaluate GATE_2
4. IF GATE_2 = FAIL → RERUN Step 2
5. IF GATE_2 = PASS → PROCEED Step 3

**PRECONDITION:** GATE_1 = PASS

**VIOLATION CHECK:** Agent MUST score ALL 10 dimensions, not "main" or "relevant"

---

### Step 3: VALIDATE

1. Read tool: steps/step-03-validate.md
2. Execute ENFORCED SEQUENCE (depth-dependent methods)
3. Evaluate GATE_3
4. IF GATE_3 = FAIL → RERUN Step 3
5. IF GATE_3 = PASS → PROCEED Step 4

**PRECONDITION:** GATE_2 = PASS

**VIOLATION CHECK:** Quick depth can skip (GATE_3 = auto-pass), standard+ MUST execute validation

---

### Step 4: DECIDE

1. Read tool: steps/step-04-decide.md
2. Execute ENFORCED SEQUENCE
3. Evaluate GATE_4
4. IF GATE_4 = FAIL → HALT (binding constraint not identified = assessment incomplete)
5. IF GATE_4 = PASS → PROCEED Step 5

**PRECONDITION:** GATE_3 = PASS OR depth = quick

**VIOLATION CHECK:** Decision MUST have conditions (if conditional) OR evidence (if go/no-go)

---

### Step 5: OUTPUT

1. Read tool: steps/step-05-output.md
2. Execute ENFORCED SEQUENCE
3. Evaluate GATE_5
4. IF GATE_5 = FAIL → HALT (incomplete outputs)
5. IF GATE_5 = PASS → COMPLETE

**PRECONDITION:** GATE_4 = PASS

**VIOLATION CHECK:** ALL outputs from frontmatter MUST be generated

---

## ENFORCEMENT RULES

1. **Sequential Execution:** Steps MUST execute 0→1→2→3→4→5 in order. No skipping.

2. **Progressive Loading:** Agent reads ONE step file at execution time, not all upfront.

3. **Gate Blocking:** GATE_N = FAIL prevents progression to Step N+1.

4. **Precondition Checks:** Each step verifies previous GATE passed before executing.

5. **Violation = ABORT:** Any VIOLATION CHECK failure stops execution, logs to process_log.

---

## VIOLATION DETECTION

| Violation | Severity | Action |
|-----------|----------|--------|
| Skip step without GATE pass | CRITICAL | ABORT execution, report SEQUENCE VIOLATION |
| Read multiple steps upfront | ERROR | ABORT, report R12 VIOLATION (just-in-time) |
| Score subset of dimensions | CRITICAL | ABORT, report R2 VIOLATION (completeness) |
| Skip method without depth exemption | ERROR | RERUN step with missing methods |
| Generate output without GATE_5 pass | BLOCKER | HALT, no incomplete outputs |

---

## SCOPE_REDUCTION_PROTOCOL

IF agent cannot complete dimension/method:

1. **DECLARE:** "Cannot assess [X] because [reason]"

2. **DOCUMENT:** Add to feasibility report "NOT ASSESSED" section with justification

3. **LOG:** Record in process_log as SCOPE_REDUCTION with CUI_BONO analysis
   - Does omission benefit AGENT (easier work)?
   - Does omission benefit USER (better assessment)?
   - If benefits agent → require completion OR explicit user approval

4. **PROCEED:** Only after explicit declaration, not silent omission

---

## DEPTH CONFIGURATION

1. **Read tool:** data/feasibility-scoring.yaml
2. **Extract:** depth levels, method execution rules, coverage targets

**Depth levels:** quick, standard, comprehensive, critical

**Method execution:**
- Quick: core methods only (see step files for depth exemptions)
- Standard: all methods except probes/spikes
- Comprehensive: all methods including validation
- Critical: all methods + iterations + external validation

**Coverage targets:**
- Quick: C ≥ 15
- Standard: C ≥ 35
- Comprehensive: C ≥ 50
- Critical: C ≥ 65

3. **Read tool:** data/coverage-scoring.yaml
4. **Calculate:** coverage score per activity

---

## ARTIFACT DIRECTORY

All working artifacts save to: `{output_directory}/deep-feasibility-artifacts/`

**Artifacts:**
- `process-state.yaml` — execution state, depth, current_step, gate_results
- `assessment-log.yaml` — method executions, timestamps, outputs
- `dimension-scores.yaml` — 10 dimension scores, confidence, binding constraint
- `constraint-map.yaml` — H0-H5 classifications, contradictions
- `validation-results.yaml` — reference class, assumption tests, probes
- `feasibility-decision.yaml` — go/no-go, conditions, triggers

**Final outputs:** `{output_directory}/`
- `feasibility-register.md` — summary entry
- `feasibility-report.md` — full assessment report

---

## FILE REFERENCES

**Steps:** `steps/step-00-frame.md` through `steps/step-05-output.md`

**Gates:** `data/gates.yaml` (6 gates, 30+ conditions)

**Methods:** `data/method-procedures/{NNN}_{Name}.md` (35 methods total)

**Config:**
- `data/feasibility-scoring.yaml` — dimension scoring rules
- `data/coverage-scoring.yaml` — process coverage metrics
- `data/decision-thresholds.yaml` — go/no-go thresholds
- `data/theoretical-foundations.yaml` — 16 foundational theorems

**Templates:**
- `data/feasibility-register-template.md`
- `data/feasibility-report-template.md`

**META:** `meta/meta-checklist.yaml` — continuous meta-method checks

---

## VERSION

**V2.0.0** — R1-R13 ZASAD compliance edition (2026-02-11)

**Changes from V1.0:**
- Removed 477 lines decorative content (PHILOSOPHY, INTEGRATION, USAGE GUIDE)
- Added COMPLETENESS > TOKEN_ECONOMY priority
- Converted declarative → programmatic execution (Read tool commands)
- Added 6 binding gates (GATE_0..5) with 32 conditions
- Added PRECONDITION checks to all steps
- Added VIOLATION detection and SCOPE_REDUCTION protocol
- Token economy: 627 → 172 lines (-72% upfront loading)
