# Deep Verify V2.0 — Execution Program

> This file is a PROGRAM. Execute it step by step. For reference documentation, see [reference.md](./reference.md).
> Data files are shared from `../deep-verify/data/`. V2-specific data is in `./data/`.

---

## DESIGN PRINCIPLES

```
+-----------------------------------------------------------------------------+
|  THIS IS AN EXECUTION PROCESS — NOT A DESCRIPTION                           |
+-----------------------------------------------------------------------------+
|                                                                              |
|  Every instruction specifies HOW and IN WHAT ORDER.                         |
|  No instruction says "should" or "consider" — all say MUST and DO.          |
|                                                                              |
|  PRIORITY: COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS               |
|                                                                              |
|  ENFORCEMENT: Every phase has BINDING GATES.                                |
|  No phase transition without explicit gate passage.                         |
|  No "intelligent" omissions without SCOPE_REDUCTION_RECORD.                 |
|                                                                              |
|  SEQUENCE: EXTRACT → VERIFY → RENDER (enforced, no jumping)                |
|  Agent MUST NOT generate report content until Phase 5.                      |
|  Agent MUST NOT assign severity until Phase 2.                              |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## COMMANDMENTS

```
+-----------------------------------------------------------------------------+
|  VERIFICATION COMMANDMENTS (V2 — ENFORCEMENT EDITION)                       |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. NO QUOTE = NO FINDING                                                   |
|     Every finding MUST cite exact text from the artifact.                   |
|     Violation: finding is VOID and MUST be removed.                        |
|                                                                              |
|  2. ALL PHASES ARE MANDATORY                                                |
|     There are NO early exits. Every phase executes fully.                  |
|     Quick mode reduces DEPTH within phases, not phase COUNT.               |
|                                                                              |
|  3. BINDING GATES BETWEEN PHASES                                            |
|     Every gate item: DONE or SCOPE_REDUCED with formal record.             |
|     Gate not passed = phase not started. No exceptions.                     |
|                                                                              |
|  4. ASSUMPTIONS BEFORE EXTRACTION                                           |
|     ASSUMPTIONS_DECLARED section MUST be completed before Phase 1.         |
|     Every interpretive decision = logged HYPOTHESIS.                       |
|                                                                              |
|  5. EXTRACT → VERIFY → RENDER                                              |
|     Phase 1 extracts. Phase 2 verifies. Phase 5 renders.                   |
|     Agent MUST NOT skip ahead in this sequence.                            |
|                                                                              |
|  6. CHECKLISTS AFTER EVERY PHASE                                            |
|     Every phase ends with a BINDING checklist.                             |
|     Checklist IS the gate. No shortcuts.                                   |
|                                                                              |
|  7. COUNTER-CHECKS ON KEY CLAIMS                                            |
|     Every CRITICAL/IMPORTANT claim gets a counter-hypothesis.              |
|     Counter-hypothesis MUST be tested, not just stated.                    |
|                                                                              |
|  8. HYPOTHESIS LOGGING                                                      |
|     Every interpretive decision is a HYPOTHESIS with:                      |
|     evidence_for, evidence_against, confidence, status.                    |
|                                                                              |
|  9. OUTPUT = REPORT (Phase 5 only)                                          |
|     No report fragments before Phase 5.                                    |
|     No conversational output during execution.                             |
|                                                                              |
| 10. SCOPE REDUCTION IS VISIBLE                                              |
|     Every omission requires SCOPE_REDUCTION_RECORD with:                   |
|     what_omitted, why, impact_assessment, user_approved.                   |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## START HERE

```
1. Load step-00-setup.md → EXECUTE it fully (includes ASSUMPTIONS_DECLARED)
2. Pass GATE_0 → Load step-01-extraction.md → EXECUTE fully
3. Pass GATE_1 → Load step-02-verification.md → EXECUTE fully
4. Pass GATE_2 → Load step-03-adversarial.md → EXECUTE fully
5. Pass GATE_3 → Load step-04-verdict.md → EXECUTE fully
6. Pass GATE_4 → Load step-05-render.md → EXECUTE fully
7. Pass GATE_5 → Workflow complete (or continue to step-06 in Deep mode)
```

**ENFORCEMENT:** Load ONE step file at a time. Complete it fully. Pass its gate. Then load next.

---

## PHASE SEQUENCE

```
Phase 0: SETUP + ASSUMPTIONS_DECLARED               [All Modes]
  Step 0   steps/step-00-setup.md
           Select mode, define artifact, set stakes/bias.
           DECLARE all assumptions. Log hypotheses.
           ──► GATE_0

Phase 1: EXTRACTION                                  [All Modes]
  Step 1   steps/step-01-extraction.md
           Extract claims, terms, structure from artifact.
           NO SEVERITY JUDGMENTS. Pure extraction only.
           Check Pattern Library for signal matching.
           ──► GATE_1

Phase 2: VERIFICATION                                [All Modes]
  Step 2   steps/step-02-verification.md
           Apply Tier 1 methods (#71, #100, #17) ALWAYS.
           Apply Tier 2 methods (2-4) based on extraction signals.
           Score findings. Create severity assignments.
           Counter-check every CRITICAL/IMPORTANT claim.
           ──► GATE_2

Phase 3: ADVERSARIAL VALIDATION                      [All Modes]
  Step 3   steps/step-03-adversarial.md
           Devil's advocate 4 prompts per IMPORTANT+ finding.
           Steel-man opposite verdict.
           False positive checklist.
           Counter-checks on retained findings.
           ──► GATE_3

Phase 4: VERDICT                                     [All Modes]
  Step 4   steps/step-04-verdict.md
           Calculate final S. Determine verdict.
           Validate verdict. Assess confidence. Check escalation.
           ──► GATE_4

Phase 5: RENDER                                      [All Modes]
  Step 5   steps/step-05-render.md
           Generate structured verification report.
           Fill template. Document what was NOT checked.
           THIS IS THE ONLY PHASE THAT PRODUCES OUTPUT.
           ──► GATE_5

Phase 6: PATTERN CANDIDATE                           [Deep Only]
  Step 6   steps/step-06-pattern-candidate.md
           Evaluate CRITICAL findings without pattern match.
           Propose new patterns for pattern-library.yaml.
```

---

## GATE MECHANISM

Every gate follows this exact structure:

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_N: [Phase Name] → [Next Phase Name]                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  For each REQUIRED item:                                            │
│                                                                     │
│  Status: [ ] DONE                                                   │
│          [ ] SCOPE_REDUCED → requires SCOPE_REDUCTION_RECORD        │
│                                                                     │
│  SCOPE_REDUCTION_RECORD (if applicable):                            │
│    what_omitted: "________________________________"                 │
│    why: "________________________________"                          │
│    impact_assessment: "________________________________"            │
│    user_approved: [ ] Yes  [ ] No (if No: HALT and ask user)       │
│                                                                     │
│  GATE PASS CONDITION:                                               │
│    ALL items DONE or SCOPE_REDUCED with user_approved=Yes           │
│                                                                     │
│  GATE LOG:                                                          │
│    timestamp: [ISO]                                                 │
│    items_done: [count]                                              │
│    items_reduced: [count]                                           │
│    gate_passed: [true/false]                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**ENFORCEMENT:** Agent MUST NOT load next step file until gate is passed.
**ENFORCEMENT:** If ANY item is neither DONE nor SCOPE_REDUCED, gate FAILS. Agent MUST complete or formally reduce scope.

---

## HYPOTHESIS LOGGING

Every interpretive decision during the process MUST be logged as a hypothesis:

```yaml
hypothesis:
  id: H[N]
  phase: [0-6]
  statement: "[what you interpreted/decided]"
  evidence_for: "[supporting evidence from artifact]"
  evidence_against: "[contradicting evidence, if any]"
  confidence: [0.0 - 1.0]
  status: [UNTESTED / CONFIRMED / REFUTED / INCONCLUSIVE]
  tested_by: "[method # or phase that tested this]"
```

**ENFORCEMENT:** Hypotheses with status=UNTESTED at GATE_4 MUST be listed in the NOT_CHECKED section of the report.

---

## SCORING QUICK REFERENCE

```
CRITICAL finding: +3     Clean method pass: -0.5
IMPORTANT finding: +1    Pattern match bonus: +1 (max once per finding)
MINOR finding: +0.3      Confirmation bonus: +1

Verdict: S >= 6 → REJECT | S <= -3 → ACCEPT | else → UNCERTAIN
```

Scoring rules: Load `../deep-verify/data/severity-scoring.yaml`
Decision thresholds: Load `../deep-verify/data/decision-thresholds.yaml`

---

## COUNTER-CHECK MECHANISM

For every finding rated CRITICAL or IMPORTANT, the agent MUST generate and test a counter-hypothesis:

```
FINDING: [description]
COUNTER-HYPOTHESIS: "This finding is FALSE because _______________"
COUNTER-EVIDENCE: [what would need to be true for counter-hypothesis to hold]
COUNTER-TEST: [how to test the counter-hypothesis]
COUNTER-RESULT: [ ] Counter holds (downgrade/remove finding)
                [ ] Counter fails (finding stands)
                [ ] Inconclusive (flag for Phase 3)
```

**ENFORCEMENT:** A finding without a tested counter-hypothesis MUST NOT be rated CRITICAL.

---

## MODE DEFINITIONS

```
┌─────────────────────────────────────────────────────────────────────┐
│  MODE       │ PHASES  │ DEPTH          │ DIFFERENCE FROM V1         │
├─────────────┼─────────┼────────────────┼────────────────────────────┤
│  Quick      │ 0-5     │ Tier 1 + min   │ V1: stops at Phase 1       │
│  Verify     │         │ 1 Tier 2       │ V2: ALL phases, reduced    │
│             │         │ method         │     depth within Phase 2   │
├─────────────┼─────────┼────────────────┼────────────────────────────┤
│  Standard   │ 0-5     │ Tier 1 + 2-4   │ Same phases, enforced      │
│  Verify     │         │ Tier 2 methods │ gates and counter-checks   │
├─────────────┼─────────┼────────────────┼────────────────────────────┤
│  Deep       │ 0-6     │ Full Tier 1+2  │ Same + Pattern Candidate   │
│  Verify     │         │ + Phase 6      │ phase at end               │
└─────────────┴─────────┴────────────────┴────────────────────────────┘
```

**ENFORCEMENT:** Quick mode in V2 still runs ALL phases 0-5. It reduces the NUMBER of Tier 2 methods in Phase 2 (minimum 1 instead of 2-4), not the number of phases.

---

## DATA FILES

Shared data (from `../deep-verify/data/`):
- `methods.csv` — Method definitions
- `method-procedures/` — Individual method procedures
- `pattern-library.yaml` — Merged patterns
- `pattern-libraries/` — Source libraries
- `severity-scoring.yaml` — Scoring rules
- `method-clusters.yaml` — Method selection guidance
- `decision-thresholds.yaml` — Verdict rules
- `report-template.md` — Report format
- `calibration.yaml` — Accuracy tracking
- `pattern-update-protocol.yaml` — Adding new patterns
- `examples.md` — Worked examples

V2-specific data (in `./data/`):
- `gate-definitions.yaml` — Gate requirements per phase
- `extraction-schema.yaml` — Extraction output format

---

## For detailed documentation see: [reference.md](./reference.md)

---

## VERSION HISTORY

- **V2.0** — Enforcement edition: binding gates, ASSUMPTIONS_DECLARED, extract→verify→render sequence, counter-checks, no early exits, checklists after every phase, hypothesis logging
- Based on Deep Verify V3.1

