# Deep-Risk V2.0 — Execution Program

> **This file is ROUTING + ENFORCEMENT RULES.** For execution details, see steps/step-NN-*.md files.

---

## START HERE

```
1. Present INVOCATION dialog → user selects depth
2. Check CRISIS_DETECTION → set crisis_mode
3. Execute step files in sequence (load one at a time)
4. Evaluate GATE_X after each step
5. Proceed to next step OR iterate/halt based on gate result
```

---

## INVOCATION

**When user wants to assess risks, ALWAYS start with this dialog:**

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                      DEEP RISK V2.0                                        ║
║                      Systematic Risk Assessment                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Select assessment depth:                                                  ║
║                                                                            ║
║  [1] QUICK     (1-2 hours)   — Top 10 risks, basic scoring, key indicators║
║  [2] STANDARD  (half day)    — Full analysis, interactions, portfolio     ║
║  [3] COMPREHENSIVE (1-2 days)— Everything + ergodicity + stability + META ║
║  [4] CRITICAL  (multi-day)   — Maximum rigor + chaos probes + validation  ║
║                                                                            ║
║  Select: [1] / [2] / [3] / [4]                                            ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**After selection:**
1. Record `depth = quick | standard | comprehensive | critical`
2. Scan input for crisis signals (see CRISIS_DETECTION)
3. Load step-00-ground.md

---

## CRISIS DETECTION (automatic)

**Do not ask user. Detect from language.**

If description contains: "urgent", "emergency", "crisis", "incident", "already failed", "happening now", "in production", "deadline tomorrow", "no time", "everything is down", "critical outage"

**→ Set `crisis_mode = on`**

**Effect:**
- Skip GATE_0 (go directly to step-01)
- Focus on GATE_1, GATE_5, GATE_6 (identify, mitigate, monitor)
- Deprioritize GATE_3, GATE_4 (quantify, interact)
- Add Crisis Response section to report

**If no signals → `crisis_mode = off`** (standard flow)

---

## EXECUTION SEQUENCE (ENFORCED — PROGRAMMATIC)

**Load ONE step file at a time. Evaluate gate. Proceed or halt.**

### Step 0: GROUND (Phase 0)
```
1. Read tool: steps/step-00-ground.md
2. Execute ENFORCED SEQUENCE from step file
3. Evaluate GATE_0 (file: gates.yaml, gate: GATE_0)
4. IF crisis_mode=on → skip step, go to Step 1
5. IF GATE_0 PASS → proceed to Step 1
6. IF GATE_0 FAIL (BLOCKER) → HALT, fix violations
7. IF GATE_0 FAIL (CRITICAL) → SCOPE_REDUCTION OR fix
```
**PRECONDITION:** NONE (entry point)
**VIOLATION CHECK:** Agent MUST NOT read step-01 until GATE_0 = OPEN OR crisis_mode=on

### Step 1: IDENTIFY_VERTICAL (Phase 1)
```
1. PRECONDITION: GATE_0 = OPEN OR crisis_mode=on (if not, HALT)
2. Read tool: steps/step-01-identify-vertical.md
3. Execute ENFORCED SEQUENCE (includes pattern library detection via data/risk-pattern-libraries/detection-rules.yaml)
4. Evaluate GATE_1 (file: gates.yaml, gate: GATE_1, conditions G1-01 through G1-07)
5. IF GATE_1 PASS → proceed to Step 2
6. IF GATE_1 FAIL → address violations
```
**VIOLATION CHECK:** Agent MUST NOT read step-02 until GATE_1 = OPEN
**PATTERN CHECK:** Agent MUST execute detection-rules.yaml algorithm to select domain pattern libraries before GATE_1 evaluation

### Step 2: IDENTIFY_HORIZONTAL (Phase 2)
```
1. PRECONDITION: GATE_1 = OPEN (if not, HALT)
2. Read tool: steps/step-02-identify-horizontal.md
3. Execute ENFORCED SEQUENCE
4. Evaluate GATE_2 (file: gates.yaml, gate: GATE_2)
5. IF depth=quick AND GATE_2 allows skip → skip to Step 3
6. IF GATE_2 PASS → proceed to Step 3
```
**VIOLATION CHECK:** Agent MUST NOT read step-03 until GATE_2 = OPEN OR depth=quick

### Step 3: QUANTIFY (Phase 3)
```
1. PRECONDITION: GATE_2 = OPEN OR (depth=quick AND GATE_1=OPEN)
2. Read tool: steps/step-03-quantify.md
3. Execute ENFORCED SEQUENCE
4. Evaluate GATE_3 (file: gates.yaml, gate: GATE_3)
5. IF GATE_3 PASS → proceed to Step 4
```
**VIOLATION CHECK:** Agent MUST NOT read step-04 until GATE_3 = OPEN

### Step 4: INTERACT (Phase 4)
```
1. PRECONDITION: GATE_3 = OPEN
2. IF depth=quick → skip to Step 5
3. Read tool: steps/step-04-interact.md
4. Execute ENFORCED SEQUENCE (includes ADVERSARY mechanism: Devil's Advocate + Missing Risk Hunt + Reconciliation)
5. Evaluate GATE_4 (file: gates.yaml, gate: GATE_4, conditions G4-01 through G4-10)
6. IF GATE_4 FAIL (ADVERSARY) → HALT, execute adversarial challenge (CRITICAL SAFETY)
7. IF GATE_4 PASS → proceed to Step 5
```
**VIOLATION CHECK:** Agent MUST NOT read step-05 until GATE_4 = OPEN OR depth=quick
**ADVERSARY CHECK:** Agent MUST execute Devil's Advocate (≥10 challenges, 5 angles) before GATE_4 evaluation

### Step 5: MITIGATE (Phase 5)
```
1. PRECONDITION: GATE_4 = OPEN OR (depth=quick AND GATE_3=OPEN)
2. Read tool: steps/step-05-mitigate.md
3. Execute ENFORCED SEQUENCE
4. Evaluate GATE_5 (file: gates.yaml, gate: GATE_5)
5. IF GATE_5 FAIL (Cobra Effect) → HALT, redesign mitigations (CRITICAL SAFETY)
6. IF GATE_5 PASS → proceed to Step 6
```
**VIOLATION CHECK:** Agent MUST NOT proceed until Cobra Effect checks PASS

### Step 6: MONITOR (Phase 6)
```
1. PRECONDITION: GATE_5 = OPEN
2. Read tool: steps/step-06-monitor.md
3. Execute ENFORCED SEQUENCE
4. Evaluate GATE_6 (file: gates.yaml, gate: GATE_6)
5. IF GATE_6 FAIL (Cobra Monitoring) → HALT, redesign monitoring (CRITICAL SAFETY)
6. IF GATE_6 PASS → proceed to Step 7
```
**VIOLATION CHECK:** Agent MUST NOT read step-07 until GATE_6 = OPEN

### Step 7: OUTPUT (Phase 7)
```
1. PRECONDITION: GATE_6 = OPEN
2. Read tool: steps/step-07-output.md
3. Execute ENFORCED SEQUENCE
4. Evaluate GATE_7 (file: gates.yaml, gate: GATE_7)
5. IF coverage < target AND iteration < max_iterations → return to Step 1
6. IF GATE_7 PASS → COMPLETE
```
**VIOLATION CHECK:** Agent MUST NOT declare COMPLETE until GATE_7 = OPEN

---

## ENFORCEMENT RULES

**R1: Sequential Execution**
- Agent loads ONE step file at a time (never load step N+1 before completing step N)
- "Read tool: steps/step-NN-*.md" is COMMAND, not suggestion

**R2: Progressive Loading**
- Step 0 loads ONLY step-00-ground.md (NOT step-01, step-02, etc.)
- Each step loads ONLY when PRECONDITION satisfied

**R3: Gate Blocking**
- GATE_X evaluation happens AFTER step execution, BEFORE next step
- BLOCKER severity → HALT (no proceed, no exceptions)
- CRITICAL severity → SCOPE_REDUCTION OR fix (explicit declaration required)
- ERROR severity → FLAG (allow proceed if depth permits)

**R4: PRECONDITION Checks**
- Every step (except step-00) has PRECONDITION
- IF PRECONDITION not met → CRITICAL PROCESS VIOLATION → HALT

**R5: Violation Detection**
- IF agent reads step-NN before GATE_(NN-1) OPEN → CRITICAL PROCESS VIOLATION → ABORT execution, log in process log

---

## DEPTH ADJUSTMENTS

| Depth | Phases | Gates | Coverage Target | Max Iterations |
|-------|--------|-------|-----------------|----------------|
| **Quick** | 0, 1, 3, 5, 6 | GATE_0, GATE_1, GATE_3, GATE_5, GATE_6 | C ≥ 15 | 1 |
| **Standard** | 0-6 | GATE_0-6 | C ≥ 35 | 3 |
| **Comprehensive** | 0-7 | GATE_0-7 | C ≥ 50 | 5 |
| **Critical** | 0-7 | GATE_0-7 (full rigor) | C ≥ 65 | Unlimited |

**Gate enforcement varies by depth:**
- Quick: Skip GATE_2 (horizontal), GATE_4 (interact), GATE_7 (META audit)
- Standard: All gates except depth=comprehensive features (ergodicity, stability, META)
- Comprehensive/Critical: All gates, full enforcement

---

## GATE DEFINITIONS

**File:** `gates.yaml`

**Structure:** Each gate has:
- **conditions[]**: Requirements to pass (BLOCKER/CRITICAL/ERROR severity)
- **counter_checks[]**: 3 verifications using methods #85, #168, #84
- **enforcement_rules**: How violations handled

**Example:** GATE_0 (GROUND_COMPLETE)
- 5 conditions: scope framed, genesis scanned, system characterized, uncertainty classified, assumptions declared
- 3 counter-checks: grounding (sample 3 risks), phantom hunt (re-scan scope), coherence (verify stakes ↔ timeframe)
- Enforcement: BLOCKER → halt, CRITICAL → scope reduction OR fix

**See gates.yaml for all 8 gates.**

---

## ARTIFACTS DIRECTORY

**All working artifacts saved to:** `{output_directory}/deep-risk-artifacts/`

**Artifacts generated:**
- `risk-register.yaml` — All risks with 5D scores, mitigations, indicators
- `risk-interaction-map.yaml` — Cascades, correlations, common-mode failures
- `mitigation-portfolio.yaml` — 4T classification, cost-benefit, Cobra checks
- `monitoring-system.yaml` — Leading indicators, review cadence, escalation protocol
- `risk-report.md` — Executive summary, portfolio view, recommendations
- `process-log.yaml` — Execution trace, gate results, decisions, assumptions

---

## ITERATION PROTOCOL

**When to iterate:**
- After GATE_7, IF coverage < target AND iteration < max_iterations
- After any gate, IF new risks discovered during execution

**How to iterate:**
- Return to Step 1 (IDENTIFY_VERTICAL)
- Merge new findings with existing risk register
- Re-evaluate affected phases (e.g., new risks → re-score → re-quantify)
- Increment iteration counter
- Re-evaluate GATE_7 coverage

**Stop conditions:**
- Coverage ≥ target for depth
- Iteration = max_iterations for depth
- SCOPE_REDUCTION declared (document what's not covered)

---

## SCOPE REDUCTION PROTOCOL

**When allowed:**
- CRITICAL severity gate failure (not BLOCKER)
- Coverage < target at max_iterations (with justification)

**Requirements:**
1. Explicit declaration: "SCOPE_REDUCTION: [phase/gate/requirement]"
2. Justification: WHY reduced (time, complexity, irrelevance)
3. Impact assessment: WHAT'S LOST (blind spots created)
4. Log in process-log.yaml decisions[] array

**Not allowed:**
- BLOCKER severity conditions (must satisfy)
- Cobra Effect check (CRITICAL SAFETY — cannot skip in GATE_5 or GATE_6)
- ASSUMPTIONS_DECLARED (mandatory before all phases)

---

## THEORETICAL FOUNDATIONS

**File:** `data/theoretical-foundations.yaml`

**9 theorems:**
1. Normal Accidents (Perrow) — Complex + tightly coupled = accidents inevitable
2. Non-Ergodicity (Peters) — Can't average what you only experience once
3. Fat Tails (Taleb) — Extremes dominate, means mislead
4. Swiss Cheese (Reason) — Aligned holes in layers = failure
5. Cobra Effect — Interventions can backfire
6. Goodhart's Law — Measured target → gamed target
7. Knight's Distinction — Risk ≠ Uncertainty ≠ Ambiguity
8. Survivorship Bias — We only learn from visible failures
9. Lindy Effect — Old = robust, new = fragile

**Used in:** GATE_0 (system characterization), GATE_5 (Cobra check), GATE_6 (Cobra monitoring check), GATE_7 (META audit)

---

## INTEGRATION

**Consumes:**
- **Deep-Explore outputs:** Exploration reports with assumptions, dependencies, consequences
- **Deep-Verify outputs:** Verification reports with impossibility findings, ungrounded claims

**Produces:**
- **Risk intelligence:** Register, interaction map, mitigation portfolio, monitoring system, report

**How to integrate:**
1. In Step 0 (GROUND), load explore/verify reports if available
2. Extract: assumptions → ASSUMPTIONS_DECLARED, dependencies → DEPENDENCY_RISKS, consequences → WORST_CASE_SCENARIOS
3. Merge with Deep-Risk analysis
4. Cross-reference in risk report

---

## VERSION

**V2.2.0** (2026-02-13)

**Changes from V2.1.0:**
- EXPANDED: Steps 02, 03, 04, 07 from stubs to self-contained (R1/R11 compliance: full EVR, embedded methods, ASSUMPTIONS_DECLARED)
- ADDED: ADVERSARY mechanism to INTERACT phase (Devil's Advocate + Missing Risk Hunt + Reconciliation)
- ADDED: G4-08 (BLOCKER), G4-09 (CRITICAL), G4-10 (BLOCKER), CC4-04, CC4-05 to GATE_4
- ADDED: Pattern detection algorithm (data/risk-pattern-libraries/detection-rules.yaml)
- ADDED: G1-07 (CRITICAL) pattern libraries detected to GATE_1
- ADDED: 6 domain pattern libraries (cloud-infrastructure, security-cybersecurity, ai-ml-systems, web-applications, microservices, serverless-realtime — 50 new patterns, 119 total)
- UPDATED: GATE_1 conditions 6 → 7, checklist 8/8 → 9/9
- UPDATED: GATE_4 conditions 7 → 10, counter-checks 3 → 5, checklist 8/8 → 10/10

**V2.1.0** (2026-02-13)
- ADDED: Cobra Monitoring Check (Method #506) + Adversarial Monitoring Test (Method #507) to MONITOR phase
- ADDED: G6-08 (BLOCKER), G6-09 (CRITICAL), CC6-04 to GATE_6
- UPDATED: GATE_6 conditions 7 → 9, counter-checks 3 → 4, checklist 8 → 10 items
- UPDATED: Cobra Effect scope extended to GATE_5 + GATE_6

**V2.0.0** (2026-02-12)
- SYSTEMATIC REFACTOR: V1.1 → V2.0 for R0-R13 compliance
- Pure Deep-Verify Pattern, 8 binding gates, 75% token reduction

**See:** `process.yaml` for full changelog
