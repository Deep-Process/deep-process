# Step 02: Map (Divergent)

**INPUTS:** knowledge_map.yaml, research_queue.yaml (with findings)
**OUTPUTS:** option_map.yaml
**ENFORCEMENT:** ASSUMPTIONS_DECLARED, EVR, COUNTER-CHECKS, POST-PHASE CHECKLIST, GATE_02

---

## 02.0 ASSUMPTIONS_DECLARED (MANDATORY)

**Execute BEFORE any dimension discovery.**

```
ASSUMPTIONS_DECLARED for Phase 2:
┌──────┬──────────────────────────────────────┬──────────────┬────────────┬──────────────────────────────┐
│ ID   │ Assumption                           │ Type         │ Confidence │ Falsification Criterion      │
├──────┼──────────────────────────────────────┼──────────────┼────────────┼──────────────────────────────┤
│ H-2xx│ "[assumed completeness of dimensions]"│ INTERPRETIVE │ HIGH/MED/  │ "[dimension missing]"        │
│ H-2xx│ "[assumed independence of axes]"     │ DOMAIN       │ LOW        │ "[axes are coupled]"         │
│ H-2xx│ "[assumed constraint validity]"      │ CONTEXTUAL   │            │ "[constraint doesn't hold]"  │
└──────┴──────────────────────────────────────┴──────────────┴────────────┴──────────────────────────────┘
```

---

## 02.1 EXTRACT: Dimension Discovery

**M001 Dimension Discovery (embedded):**
1. Identify choice axes from research findings and knowledge map
2. Apply discovery questions: "What choices emerged?", "What are fundamental axes?", "What would expert add?"
3. Classify each dimension: INDEPENDENT (true axis) vs DEPENDENT (correlates with others)
4. Source each dimension: research finding, user statement, or inference
5. Test completeness: consider timing, funding, team, technology, market, legal dimensions

```
RAW DIMENSION EXTRACTION:

DISCOVERY QUESTIONS:
• "What choices emerged from our research?"
• "What are the fundamental axes?"
• "What would an expert add?"

DIMENSIONS FOUND (raw, unvalidated):
1. [dimension name] - type: [INDEPENDENT/DEPENDENT] - source: [where identified]
2. [dimension name] - type: [INDEPENDENT/DEPENDENT] - source: [where identified]
3. [dimension name] - type: [INDEPENDENT/DEPENDENT] - source: [where identified]
...

[EXTRACT_COMPLETE for dimensions]
```

**MINIMUM dimensions by depth: quick=3, standard=4, deep=5**

---

## 02.2 EXTRACT: Option Enumeration

**M002 Option Enumeration (embedded):**
1. For each dimension, list conventional options first
2. Apply expansion prompts to surface unconventional options
3. Always include "do nothing" or "status quo" option
4. Consider contrarian choices and hybrid combinations
5. Source each option: verified from research or assumed/inferred

**Expansion prompts:**
- "What would contrarian choose?"
- "What's unconventional choice?"
- "What if we combined options?"
- "What's 'do nothing' option?"

```
DIMENSION: [name]
RAW OPTIONS:
├── Option A: [description] - source: [where from?] - status: [VERIFIED/ASSUMED]
├── Option B: [description] - source: [where from?] - status: [VERIFIED/ASSUMED]
├── Option C: [description] - source: [where from?] - status: [VERIFIED/ASSUMED]
└── [Apply expansion prompts if <2 options]

[EXTRACT_COMPLETE for options]
```

**MINIMUM options by depth: quick=6 total, standard=12 total, deep=15 total**

---

## 02.3 EXTRACT: Constraint Mapping

**M003 Constraint Mapping (embedded):**
1. Identify HARD constraints: impossible combinations (technical, legal, physical impossibility)
2. Identify SOFT constraints: difficult but not impossible (resource, timing, political difficulty)
3. Verify each constraint: is it truly impossible or just assumed difficult?
4. Source constraints: cite evidence from research or mark as assumption
5. Build exclusion matrix: which dimension combinations are ruled out

```
RAW CONSTRAINTS:
HARD CONSTRAINTS:
• [constraint 1] - excluded: [D1:A + D2:B] - source: [evidence/assumption]

SOFT CONSTRAINTS:
• [constraint 2] - difficult: [D1:C + D3:A] - source: [evidence/assumption]

[EXTRACT_COMPLETE for constraints]
```

---

## 02.4 VERIFY: Validate Map Elements

```
VERIFICATION LOG:

DIMENSION VALIDATION:
┌────┬──────────────┬──────────────┬──────────┬─────────────────────────┐
│ #  │ Dimension    │ Type         │ Status   │ Notes                   │
├────┼──────────────┼──────────────┼──────────┼─────────────────────────┤
│ 1  │ [name]       │ INDEPENDENT  │ VERIFIED │ truly independent axis  │
│ 2  │ [name]       │ DEPENDENT    │ ASSUMED  │ may correlate with D1   │
└────┴──────────────┴──────────────┴──────────┴─────────────────────────┘

QUALITY CHECKS:
□ At least [3/4/5 per depth] dimensions?        [Y/N]
□ Each dimension has at least 2 options?         [Y/N]
□ Dimensions are truly independent?              [Y/N]
□ No obvious dimension missing?                  [Y/N]

CONSTRAINT VALIDATION:
┌────┬──────────────────────────────┬──────────┬───────────────┐
│ #  │ Constraint                   │ Status   │ Confidence    │
├────┼──────────────────────────────┼──────────┼───────────────┤
│ 1  │ [D1:A + D2:B impossible]     │ VERIFIED │ HIGH          │
│ 2  │ [D1:C + D3:A difficult]      │ ASSUMED  │ MED           │
└────┴──────────────────────────────┴──────────┴───────────────┘

[VERIFY_COMPLETE]
```

**★ KEY_CLAIM: "The morphological box captures the complete decision space."**

**COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):**
```
COUNTER-CHECK #N:
  claim: "The morphological box is complete — no major dimension is missing"
  disproof: "An expert or user would immediately identify a missing axis"
  search_attempt: "[consider: timing, funding, team, technology, market, legal, etc.]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add missing dimension, re-verify]
```

---

## 02.5 RENDER: Build Morphological Box

**PRECONDITION:** [VERIFY_COMPLETE] tag MUST exist. If missing → SEQUENCE_VIOLATION → HALT.

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                         MORPHOLOGICAL BOX                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  DIMENSION 1: [Name] — status: [VERIFIED/ASSUMED]                         ║
║  ├── Option A: [description]                                               ║
║  ├── Option B: [description]                                               ║
║  └── Option C: [description]                                               ║
║                                                                            ║
║  DIMENSION 2: [Name] — status: [VERIFIED/ASSUMED]                         ║
║  ├── Option A: [description]                                               ║
║  └── Option B: [description]                                               ║
║                                                                            ║
║  CONSTRAINTS:                                                              ║
║  • [constraint 1] - confidence: [level] - status: [VERIFIED/ASSUMED]      ║
║                                                                            ║
║  VALID COMBINATIONS: [N] of [total]                                        ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

[RENDER_COMPLETE]
```

**Write output to option_map.yaml following schema from workflow.md.**

---

## POST-PHASE CHECKLIST (MANDATORY)

```
PHASE_02 COMPLETION CHECKLIST:

□ ASSUMPTIONS_DECLARED logged?             [count: ___]
□ EVR sequence respected?                  [Y/N — EXTRACT→VERIFY→RENDER]
□ Dimensions discovered?                   [count: ___ (min per depth: quick=3, standard=4, deep=5)]
□ Options enumerated?                      [count: ___ (min per depth: quick=6, standard=12, deep=15)]
□ Each dimension verified for independence?[Y/N]
□ Constraints mapped?                      [Y/N]
□ Constraints tagged VERIFIED/ASSUMED?     [Y/N]
□ Morphological box rendered?              [Y/N]
□ Counter-checks performed?               [count: ___ (min per depth: quick=1, standard=2, deep=3)]
□ Expansion prompts applied?              [Y/N]

CHECKLIST_STATUS: PASS | FAIL
IF FAIL: Fix before proceeding or declare SCOPE_REDUCTION.
```

---

## GATE_02: MAP EXIT

```
GATE_02 BINDING CHECK:

□ Dimensions discovered (min per depth)     — [PASS/FAIL] — CRITICAL
□ Options enumerated (min per depth)        — [PASS/FAIL] — CRITICAL
□ Constraints mapped                        — [PASS/FAIL] — REQUIRED
□ Morphological box built                   — [PASS/FAIL] — CRITICAL
□ Counter-checks performed                  — [PASS/FAIL] — REQUIRED
□ Post-phase checklist PASSED               — [PASS/FAIL] — CRITICAL

GATE_02 STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed to Step 3. Fix failures or declare SCOPE_REDUCTION.
```

---

## Feedback Loop Check

```
□ Did mapping reveal new unknowns?
  → YES: Return to Step 1 (if iterations remaining per depth limits)

□ Did mapping reveal we misunderstood the problem?
  → YES: Return to Step 0

□ Is the map suspiciously simple?
  → YES: Challenge — are we missing dimensions?

□ Are ALL options unacceptable?
  → YES: Consider ABORT — no viable decision exists
```

## Iteration Tracking

```
LOOP COUNT: Step 1 ↔ Step 2 iterations: [N]

MAX ITERATIONS BY DEPTH:
- quick: 1 (no loops)
- standard: 3
- deep: unlimited

□ If looping exceeds max for depth:
  → STOP: Either proceed with current map OR declare SCOPE_REDUCTION with gaps flagged
```

---

## Transition

- **If GATE_02 = OPEN** → Proceed to Step 3
- **If knowledge gaps found AND iterations remaining** → Return to Step 1
- **If knowledge gaps found BUT max loops reached** → Proceed with gaps flagged (log in process_log.yaml)
- **If framing wrong** → Return to Step 0
- **If no viable options exist** → ABORT with justification
