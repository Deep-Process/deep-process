# Step 01: Research

**INPUTS:** research_queue.yaml (from Step 0)
**OUTPUTS:** Updated research_queue.yaml with findings
**ENFORCEMENT:** ASSUMPTIONS_DECLARED, EVR, COUNTER-CHECKS, POST-PHASE CHECKLIST, GATE_01

---

## 01.0 ASSUMPTIONS_DECLARED (MANDATORY)

```
ASSUMPTIONS_DECLARED for Phase 1:
┌──────┬──────────────────────────────────────┬──────────────┬────────────┬──────────────────────────────┐
│ ID   │ Assumption                           │ Type         │ Confidence │ Falsification Criterion      │
├──────┼──────────────────────────────────────┼──────────────┼────────────┼──────────────────────────────┤
│ H-1xx│ "[assumed source reliability]"       │ CONTEXTUAL   │ HIGH/MED/  │ "[source contradicted]"      │
│ H-1xx│ "[assumed research completeness]"    │ INTERPRETIVE │ LOW        │ "[key source missing]"       │
└──────┴──────────────────────────────────────┴──────────────┴────────────┴──────────────────────────────┘
```

---

## 01.1 EXTRACT: Execute Research Queue

**Execute by priority: P1 first, then P2, then P3 (if time permits per depth).**

**Research execution by depth:**
- quick: Top 2-3 P1 items only
- standard: All P1, all P2 items
- deep: All P1, P2, P3 + exploratory research

**E007 Information Questions (embedded — for prioritization):**
1. Which research question, if answered, would most reduce uncertainty?
2. Which question has highest decision impact?
3. Which questions are testable vs unknowable?
4. Rank by: (uncertainty_reduction × decision_impact) / effort
5. Execute highest-value questions first

```
RESEARCH EXECUTION LOG:

ITEM: R-001 (Priority: P1)
QUESTION: "[research question]"
METHOD: [web search / documentation / experiment / expert consultation]
SOURCES CONSULTED: ["[source 1]", "[source 2]"]
RAW FINDINGS:
• [finding 1 from source 1]
• [finding 2 from source 2]
• [finding 3 synthesis]

ITEM: R-002 (Priority: P2)
QUESTION: "[research question]"
METHOD: [research method]
SOURCES CONSULTED: ["[source]"]
RAW FINDINGS:
• [finding 1]

[EXTRACT_COMPLETE for research]
```

---

## 01.2 VERIFY: Source and Finding Validation

```
VERIFICATION LOG:

FINDING VALIDATION:
┌────┬──────────────────────┬──────────┬─────────────────────────┐
│ ID │ Finding              │ Status   │ Source / Reason         │
├────┼──────────────────────┼──────────┼─────────────────────────┤
│ F-1│ "[finding]"          │ VERIFIED │ Source: [citation/URL]  │
│ F-2│ "[finding]"          │ ASSUMED  │ Reason: [inference]     │
│ F-3│ "[finding]"          │ VERIFIED │ Source: [citation]      │
└────┴──────────────────────┴──────────┴─────────────────────────┘

QUALITY CHECKS:
□ All P1 items addressed?                       [Y/N]
□ Sources credible and cited?                   [Y/N]
□ Findings tagged VERIFIED/ASSUMED?             [Y/N]
□ Contradictions identified and noted?          [Y/N]

[VERIFY_COMPLETE]
```

**★ KEY_CLAIM: Each VERIFIED finding is genuinely sourced, not assumed.**

**COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):**
```
COUNTER-CHECK #N:
  claim: "[research finding]"
  disproof: "Source is unreliable, outdated, or misinterpreted"
  search_attempt: "[check source date, author credibility, alternative sources]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [none | downgrade to ASSUMED | remove finding]
```

---

## 01.3 RENDER: Update Knowledge Map

**PRECONDITION:** [VERIFY_COMPLETE] tag MUST exist. If missing → SEQUENCE_VIOLATION → HALT.

```
KNOWLEDGE MAP UPDATE:

NEW KNOWN ITEMS (from research):
• [item] — source: [R-001 finding F-1]
• [item] — source: [R-002 finding F-2]

RESOLVED UNKNOWNS:
• [previous unknown] → NOW KNOWN: [finding]

NEW UNKNOWNS DISCOVERED (from research):
• [new gap discovered during research]
• [new gap discovered during research]

ASSUMPTIONS UPDATED:
• H-002 confidence: MED → HIGH (research confirmed)
• H-003 status: REFUTED (research contradicted)

[RENDER_COMPLETE]
```

**Write updated findings to research_queue.yaml following schema from workflow.md.**

---

## POST-PHASE CHECKLIST (MANDATORY)

```
PHASE_01 COMPLETION CHECKLIST:

□ ASSUMPTIONS_DECLARED logged?                 [count: ___]
□ EVR sequence respected?                      [Y/N — EXTRACT→VERIFY→RENDER]
□ Research queue executed by priority?         [Y/N]
□ All P1 items addressed?                      [Y/N]
□ Findings recorded with sources?              [Y/N]
□ Findings tagged VERIFIED/ASSUMED?            [Y/N]
□ Knowledge map updated?                       [Y/N]
□ New unknowns captured?                       [Y/N]
□ Counter-checks performed?                   [count: ___ (min per depth)]

CHECKLIST_STATUS: PASS | FAIL
IF FAIL: Fix before proceeding.
```

---

## GATE_01: RESEARCH EXIT

```
GATE_01 BINDING CHECK:

□ Research queue executed by priority       — [PASS/FAIL] — CRITICAL
□ Findings recorded with sources           — [PASS/FAIL] — CRITICAL
□ Knowledge map updated                    — [PASS/FAIL] — REQUIRED
□ Counter-checks on key findings           — [PASS/FAIL] — REQUIRED
□ Post-phase checklist PASSED              — [PASS/FAIL] — CRITICAL

GATE_01 STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed to Step 2. Fix failures.
```

---

## Decision Point

**Iteration check:**
```
□ Did research reveal NEW critical unknowns?
  → YES AND iterations remaining: Add to queue, loop back to research
  → YES BUT max loops reached: Proceed with gaps flagged

□ Are critical P1 items still unresolved?
  → YES: Either continue research OR proceed with ASSUMED status flagged
```

**MAX ITERATIONS BY DEPTH:**
- quick: 1 (no loops)
- standard: 3
- deep: unlimited

---

## Transition

- **If GATE_01 = OPEN and no new critical unknowns** → Proceed to Step 2
- **If new unknowns discovered AND iterations remaining** → Stay in Step 1
- **If max iterations reached** → Proceed to Step 2 with gaps flagged in process_log.yaml
