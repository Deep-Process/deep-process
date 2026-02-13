# Step 00: Knowledge Audit

**INPUTS:** User's decision/question, context
**OUTPUTS:** knowledge_map.yaml, research_queue.yaml
**ENFORCEMENT:** ASSUMPTIONS_DECLARED, EVR, COUNTER-CHECKS, POST-PHASE CHECKLIST, GATE_00

---

## 00.0 INVOCATION — Depth Selection

**Display FIRST, before anything. HALT until user responds.**

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                      DEEP EXPLORE V3.0                                     ║
║                      Decision Space Exploration                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Before we begin, choose the exploration depth:                           ║
║                                                                            ║
║  [1] QUICK  (10-20 min)                                                   ║
║      Basic option map, top 2 options, quick readiness check               ║
║      → Urgent, low-stakes, or initial orientation                         ║
║                                                                            ║
║  [2] STANDARD  (45-90 min)                                                ║
║      Full option map (4-6 dims), VERIFIED vs ASSUMED consequences         ║
║      Premortem, bias check, strategic clusters, full report               ║
║      → Important decision, need confidence                                ║
║                                                                            ║
║  [3] DEEP  (2-4 hours)                                                    ║
║      Exhaustive map, all options, multiple iterations                      ║
║      Devil's advocate, black swan hunting, dependency analysis            ║
║      → Critical/irreversible, very high stakes                            ║
║                                                                            ║
║  Choose: [1] / [2] / [3]                                                  ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**After user selection:**
1. Save: `depth = quick | standard | deep`
2. Scan user's decision description for fear signals (see FEAR DETECTION below)
3. Set: `fear_analysis = on | off`
4. Initialize process_log.yaml with depth and fear_analysis settings
5. Continue to 00.1

**ENFORCEMENT:** If depth not set, ALL subsequent steps LOCKED.

### FEAR DETECTION (automatic)

**Scan user's decision description for:**
- "afraid", "worried", "concerned", "what if it fails"
- "blocked", "I can't decide", "impossible", "paralysis"
- "risk", "I'll lose", "failure", "everyone says it's bad"

**If ANY detected → `fear_analysis = on`**
**If NONE detected → `fear_analysis = off`**

---

## 00.1 ASSUMPTIONS_DECLARED (MANDATORY)

**Execute BEFORE any extraction.**

```
ASSUMPTIONS_DECLARED for Phase 0:
┌──────┬──────────────────────────────────────┬──────────────┬────────────┬──────────────────────────────┐
│ ID   │ Assumption                           │ Type         │ Confidence │ Falsification Criterion      │
├──────┼──────────────────────────────────────┼──────────────┼────────────┼──────────────────────────────┤
│ H-001│ "[what we interpret decision to be]" │ INTERPRETIVE │ HIGH/MED/  │ "[user clarifies otherwise]" │
│ H-002│ "[assumed scope of exploration]"     │ CONTEXTUAL   │ LOW        │ "[if scope is different]"    │
│ H-003│ "[domain assumption]"               │ DOMAIN       │            │ "[what disproves]"           │
└──────┴──────────────────────────────────────┴──────────────┴────────────┴──────────────────────────────┘

ENFORCEMENT: If empty → RED_FLAG "Zero assumptions — re-examine. Every framing has interpretive choices."
```

---

## 00.2 EXTRACT: Frame the Decision

```
RAW EXTRACTION:

USER'S WORDS (verbatim):
"[exact user input about decision]"

DECISION ELEMENTS EXTRACTED:
1. [element 1]
2. [element 2]
3. [element 3]

CONTEXT ELEMENTS:
• [context 1]
• [context 2]

FEAR SIGNALS DETECTED: [list or NONE]

[EXTRACT_COMPLETE for framing]
```

---

## 00.3 EXTRACT: Knowledge Inventory

**E001 Abductive Reasoning (embedded):**
1. List what user KNOWS (stated facts, clear information)
2. List what user DOESN'T KNOW (acknowledged gaps, unknowns)
3. List what user ASSUMES (unstated beliefs, implicit assumptions)
4. Generate hypotheses from observations: "If X is true, what explains it?"
5. Rank hypotheses by likelihood and testability

```
KNOWLEDGE INVENTORY (raw):

KNOWN (what user stated explicitly):
• [item with source: "user said..."]
• [item with source: "user said..."]

UNKNOWN (what user identified as gaps):
• [gap 1]
• [gap 2]

ASSUMED (inferred from user's language):
• [assumption 1] → links to H-001
• [assumption 2] → links to H-002

[EXTRACT_COMPLETE for inventory]
```

---

## 00.4 EXTRACT: Research Queue (if unknowns exist)

```
RESEARCH QUEUE:

┌──────┬─────────────────────────────────┬──────────┬─────────────────┐
│ ID   │ Question                        │ Priority │ Source Needed   │
├──────┼─────────────────────────────────┼──────────┼─────────────────┤
│ R-001│ "[what to research]"            │ P1       │ [type]          │
│ R-002│ "[what to research]"            │ P2       │ [type]          │
│ R-003│ "[what to research]"            │ P3       │ [type]          │
└──────┴─────────────────────────────────┴──────────┴─────────────────┘

PRIORITY KEY:
P1 = CRITICAL (must know before mapping options)
P2 = IMPORTANT (significant impact on decision)
P3 = NICE-TO-HAVE (helpful but not essential)

[EXTRACT_COMPLETE for queue]
```

---

## 00.5 EXTRACT: Fear Analysis (if fear_analysis=on)

**E008 Failure Reason Exploration (embedded):**
1. Ask: "What specifically are you afraid will happen?"
2. Categorize each fear by type: EXECUTIONAL, RESOURCE, ASSUMPTION, EXTERNAL, ADOPTION, TIMING
3. For each fear: "If this happened, what caused it?"
4. Separate controllable from uncontrollable factors
5. Transform fears into testable hypotheses

**E011 Control vs Influence Analysis (embedded):**
1. List all factors affecting decision
2. Classify each: CONTROL (you decide), INFLUENCE (you affect), NEITHER (external)
3. Focus energy on CONTROL items, plan for INFLUENCE items, accept NEITHER items

**E012 Fundamental Block Analysis (embedded):**
1. For each perceived "blocker": Is this a HARD WALL (truly impossible) or SOFT BARRIER (difficult but possible)?
2. Test: "Has anyone ever done this? Under what conditions?"
3. Identify true vs assumed constraints
4. Separate physics/law (hard walls) from effort/politics (soft barriers)

**E009 Reverse Abduction (if "impossible" detected):**
1. Assume success: "What would need to be true for this to work?"
2. Work backwards from success to current state
3. Identify required conditions and preconditions
4. Test each condition: which are achievable?

**E013 Contrast Exploration (embedded):**
1. Find examples: Who succeeded at similar decision? Who failed?
2. Extract patterns: What did successes do differently?
3. Apply to current: Which success patterns apply here?

```
FEAR INVENTORY (if fear_analysis=on):

FEARS IDENTIFIED:
┌──────┬─────────────────────────┬──────────────┬─────────────────────┐
│ ID   │ Fear                    │ Type         │ Control Level       │
├──────┼─────────────────────────┼──────────────┼─────────────────────┤
│ F-001│ "[specific fear]"       │ EXECUTIONAL  │ CONTROL/INFLUENCE/  │
│ F-002│ "[specific fear]"       │ RESOURCE     │ NEITHER             │
└──────┴─────────────────────────┴──────────────┴─────────────────────┘

TYPE KEY:
EXECUTIONAL = fear of doing it wrong
RESOURCE = fear of lacking time/money/people
ASSUMPTION = fear of wrong understanding
EXTERNAL = fear of outside forces
ADOPTION = fear of rejection by others
TIMING = fear of wrong moment

BLOCKERS ANALYZED:
┌──────┬─────────────────────────┬──────────────────────────────────┐
│ ID   │ Perceived Blocker       │ Classification                   │
├──────┼─────────────────────────┼──────────────────────────────────┤
│ B-001│ "[blocker]"             │ HARD WALL / SOFT BARRIER         │
│ B-002│ "[blocker]"             │ Evidence: [why classified thus]  │
└──────┴─────────────────────────┴──────────────────────────────────┘

[EXTRACT_COMPLETE for fear analysis]
```

---

## 00.6 VERIFY: Validate Knowledge Map

```
VERIFICATION LOG:

FRAMING VALIDATION:
□ Decision framed in one clear sentence?        [Y/N]
□ Stakes assessed (HIGH/MEDIUM/LOW)?            [Y/N]
□ Frame clarity confirmed with user?            [Y/N]

INVENTORY VALIDATION:
□ KNOWN items have sources?                     [Y/N]
□ UNKNOWN items actionable (can be researched)? [Y/N]
□ ASSUMED items linked to hypothesis IDs?       [Y/N]

RESEARCH QUEUE VALIDATION (if exists):
□ All critical unknowns have R-items?           [Y/N]
□ Priorities assigned to all items?             [Y/N]
□ P1 items are truly blocking?                  [Y/N]

[VERIFY_COMPLETE]
```

**★ KEY_CLAIM: "The knowledge inventory is complete — no major gap is hidden."**

**COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):**
```
COUNTER-CHECK #N:
  claim: "We've identified all critical unknowns"
  disproof: "An expert would immediately spot a missing question"
  search_attempt: "[consider: market, technology, resources, timing, stakeholders]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add to research queue, re-verify]
```

---

## 00.7 RENDER: Output Knowledge Map

**PRECONDITION:** [VERIFY_COMPLETE] tag MUST exist. If missing → SEQUENCE_VIOLATION → HALT.

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                         KNOWLEDGE MAP                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  DECISION FRAME:                                                           ║
║  "[one sentence framing]"                                                  ║
║                                                                            ║
║  STAKES: [HIGH / MEDIUM / LOW]                                             ║
║                                                                            ║
║  KNOWN:                                                                    ║
║  • [item 1] — source: [where from]                                         ║
║  • [item 2] — source: [where from]                                         ║
║                                                                            ║
║  UNKNOWN:                                                                  ║
║  • [gap 1] → research item R-001                                           ║
║  • [gap 2] → research item R-002                                           ║
║                                                                            ║
║  ASSUMED:                                                                  ║
║  • [assumption 1] → hypothesis H-001                                       ║
║  • [assumption 2] → hypothesis H-002                                       ║
║                                                                            ║
║  FEAR SIGNALS: [list or NONE]                                              ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

[RENDER_COMPLETE]
```

**Write output to knowledge_map.yaml and research_queue.yaml following schemas from workflow.md.**

---

## POST-PHASE CHECKLIST (MANDATORY)

```
PHASE_00 COMPLETION CHECKLIST:

□ Depth selected by user?                      [quick/standard/deep]
□ Fear analysis mode set?                      [on/off]
□ ASSUMPTIONS_DECLARED logged?                 [count: ___]
□ EVR sequence respected?                      [Y/N — EXTRACT→VERIFY→RENDER]
□ Decision framed (one sentence)?              [Y/N]
□ Stakes assessed?                             [HIGH/MEDIUM/LOW]
□ Knowledge inventory complete?                [Y/N]
□ Research queue generated (if unknowns exist)?[Y/N or N/A]
□ Fear analysis done (if fear_analysis=on)?    [Y/N or N/A]
□ Counter-checks performed?                   [count: ___ (min per depth)]
□ Artifacts written to YAML?                   [Y/N]

CHECKLIST_STATUS: PASS | FAIL
IF FAIL: Fix before proceeding.
```

---

## GATE_00: KNOWLEDGE AUDIT EXIT

```
GATE_00 BINDING CHECK:

□ Decision framed (one sentence)           — [PASS/FAIL] — CRITICAL
□ Stakes assessed (HIGH/MEDIUM/LOW)        — [PASS/FAIL] — REQUIRED
□ Knowledge inventory complete             — [PASS/FAIL] — CRITICAL
□ Research queue generated (if needed)     — [PASS/FAIL] — REQUIRED
□ ASSUMPTIONS_DECLARED logged              — [PASS/FAIL] — CRITICAL
□ Post-phase checklist PASSED              — [PASS/FAIL] — CRITICAL

GATE_00 STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed to Step 1. Fix failures.
```

---

## Decision Point

- **If research_queue is EMPTY** → Can skip Step 1, proceed directly to Step 2 (requires SCOPE_REDUCTION_DECLARATION)
- **If research_queue has P1 items** → MUST proceed to Step 1
- **If frame unclear after 3 attempts** → Escalate to user or ABORT

---

## Transition

- **If GATE_00 = OPEN and research_queue not empty** → Proceed to Step 1
- **If GATE_00 = OPEN and research_queue empty** → Skip to Step 2 with SCOPE_REDUCTION logged
- **If GATE_00 = LOCKED** → Fix critical failures before proceeding
