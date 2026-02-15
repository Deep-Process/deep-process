# Deep Verify — Execution Program

> **LOAD AND EXECUTE:** This is a PROGRAM, not documentation. Execute step-by-step.

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
|  SEQUENCE: SETUP → SCAN → TARGETED → ADVERSARIAL → VERDICT → REPORT        |
|  Agent MUST NOT generate report content until Phase 5.                      |
|  Agent MUST NOT assign severity until Phase 2.                              |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## COMMANDMENTS

```
+-----------------------------------------------------------------------------+
|  VERIFICATION COMMANDMENTS — ENFORCEMENT EDITION                             |
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
|  5. SCAN → TARGETED → REPORT                                               |
|     Phase 1 scans patterns. Phase 2 targets issues. Phase 5 reports.       |
|     Agent MUST NOT skip ahead in this sequence.                            |
|                                                                              |
|  6. CHECKLISTS AFTER EVERY PHASE                                            |
|     Every phase ends with a BINDING checklist.                             |
|     Checklist IS the gate. No shortcuts.                                   |
|                                                                              |
|  7. COUNTER-CHECKS ON KEY CLAIMS                                            |
|     Every CRITICAL/IMPORTANT finding gets a counter-hypothesis.            |
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
1. Load steps/step-00-setup.md → EXECUTE fully (includes ASSUMPTIONS_DECLARED)
2. Pass GATE_0 → Load steps/step-01-pattern-scan.md → EXECUTE fully
3. Pass GATE_1 → Load steps/step-02-targeted.md → EXECUTE fully
4. Pass GATE_2 → Load steps/step-03-adversarial.md → EXECUTE fully
5. Pass GATE_3 → Load steps/step-04-verdict.md → EXECUTE fully
6. Pass GATE_4 → Load steps/step-05-report.md → EXECUTE fully
7. Pass GATE_5 → Workflow complete (or continue to step-06 if Deep mode)
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

Phase 1: PATTERN SCAN                                [All Modes]
  Step 1   steps/step-01-pattern-scan.md
           Extract claims, terms, structure from artifact.
           Execute Tier 1 methods (#71, #100, #17).
           Check Pattern Library for signal matching.
           Calculate initial score (S).
           NO SEVERITY JUDGMENTS on extracted claims.
           ──► GATE_1

Phase 2: TARGETED VERIFICATION                       [All Modes]
  Step 2   steps/step-02-targeted.md
           Select Tier 2 methods (1-4) based on Phase 1 signals.
           Execute selected methods.
           Assign severity to findings.
           Counter-check every CRITICAL/IMPORTANT finding.
           Update score (S).
           ──► GATE_2

Phase 3: ADVERSARIAL VALIDATION                      [All Modes]
  Step 3   steps/step-03-adversarial.md
           Devil's advocate 4 prompts per IMPORTANT+ finding.
           Steel-man opposite verdict.
           False positive checklist.
           Counter-checks on retained findings.
           Adjust score (S).
           ──► GATE_3

Phase 4: VERDICT                                     [All Modes]
  Step 4   steps/step-04-verdict.md
           Calculate final score (S).
           Determine verdict per decision-thresholds.yaml.
           Validate verdict. Assess confidence. Check escalation.
           ──► GATE_4

Phase 5: REPORT                                      [All Modes]
  Step 5   steps/step-05-report.md
           Generate structured verification report.
           Fill template from data/report-template.md.
           Document what was NOT checked.
           THIS IS THE ONLY PHASE THAT PRODUCES OUTPUT.
           ──► GATE_5

Phase 6: PATTERN CANDIDATE                           [Deep Only]
  Step 6   steps/step-06-pattern-candidate.md
           Evaluate CRITICAL findings without pattern match.
           Propose new patterns for pattern-library.yaml.
```

---

## EXECUTION MODES

**Selection:** Mode determined in Phase 0 via CLI flags or interactive prompt.

### Quick Verify (QV)
- **Time:** 5-10 min
- **Tier 2 Methods:** 1 method minimum
- **Adversarial:** Lighter (2 prompts per finding)
- **Phases:** ALL (0-5)
- **Triggers:** `--quick`, `-q`

### Standard Verify (SV)
- **Time:** 15-30 min
- **Tier 2 Methods:** 2-3 methods
- **Adversarial:** Full (4 prompts per finding)
- **Phases:** ALL (0-5)
- **Triggers:** Default, `--full`

### Deep Verify (DV)
- **Time:** 30-60 min
- **Tier 2 Methods:** 3-4 methods
- **Adversarial:** Thorough (4 prompts + extended steel-man)
- **Phases:** ALL (0-6)
- **Triggers:** `--deep`, `--high-stakes`

---

## REPORT MODES

**Selection:** Report mode determined in Phase 0 via CLI flags or interactive prompt.

### Full Report (Default)
- **Content:** All details including scores, methods, adversarial validation
- **Sections:** Executive summary, configuration, execution details, findings, verdict justification, limitations, recommendations
- **Use when:** Need complete audit trail, documentation, transparency
- **Triggers:** Default, `--full-report`

### Compact Report
- **Content:** Summary only - verdict, critical findings, recommendations
- **Quality:** Validated using methods #082, #083, #084, #088, #089
- **Internal:** ALL phases execute fully, only presentation is condensed
- **Sections:** Conclusion, critical issues, important findings, recommendations, scope, metadata
- **Use when:** Need quick actionable results without overwhelming detail
- **Triggers:** `--compact`, `-c`

**IMPORTANT:**
- Compact mode does NOT skip analysis - all 6 phases execute fully
- Only the PRESENTATION is condensed
- Quality is ensured through 5 validation methods
- Internal processing remains identical to full mode

---

## SCORING SYSTEM

### Evidence Score (S)

| Finding Severity | Points | Trigger |
|------------------|--------|---------|
| CRITICAL | +3 | Fundamental flaw, impossibility, definitional contradiction |
| IMPORTANT | +1 | Significant issue requiring attention |
| MINOR | +0.3 | Worth noting, not blocking |
| Clean method pass | -0.5 | Method executed, found nothing |
| Pattern match bonus | +1 | Finding matches known pattern (max once per finding) |

### Verdict Thresholds

| Score Range | Verdict | Meaning |
|-------------|---------|---------|
| S ≥ 6 | REJECT | Artifact contains fatal flaws |
| -3 < S < 6 | UNCERTAIN | Cannot determine validity |
| S ≤ -3 | ACCEPT | Artifact appears sound |
| Any + ESCALATE | ESCALATE | Needs human expert |

**Full rules:** See `data/decision-thresholds.yaml`

---

## METHOD TIERS

### Tier 1 — Phase 1 (ALL mandatory)

| # | Method | File |
|---|--------|------|
| 71 | First Principles Analysis | `data/method-procedures/071_First_Principles_Analysis.md` |
| 100 | Vocabulary Consistency | `data/method-procedures/100_Vocabulary_Consistency.md` |
| 17 | Abstraction Laddering | `data/method-procedures/017_Abstraction_Laddering.md` |

### Tier 2 — Phase 2 (Select based on signals)

| Signal from Phase 1 | Recommended Methods |
|---------------------|---------------------|
| Absolute claims ("always", "never", "100%") | #153, #154 |
| Structural complexity, dependencies | #116, #86 |
| Ungrounded claims, missing evidence | #85, #78 |
| Diffuse belief, clean Phase 1 | #84, #109 |
| Causation claims | #165, #162 |
| Circular reasoning detected | #116, #159 |

**Method Catalog:** `data/methods.csv`
**Method Procedures:** `data/method-procedures/*.md`

---

## DATA FILES (Just-In-Time Loading)

| File | Load When | Purpose |
|------|-----------|---------|
| `data/gate-definitions.yaml` | Before each gate | Binding gate requirements |
| `data/extraction-schema.yaml` | Phase 1 | Claim/term/structure schemas |
| `data/methods.csv` | Phase 2 | Method catalog |
| `data/method-procedures/*.md` | Phase 1-2 | Method execution procedures |
| `data/pattern-library.yaml` | Phase 1 | Known patterns |
| `data/severity-scoring.yaml` | Phase 2 | Severity assignment rules |
| `data/decision-thresholds.yaml` | Phase 4 | Verdict calculation rules |
| `data/calibration.yaml` | Phase 4 | Scoring calibration |
| `data/report-template.md` | Phase 5 (full mode) | Full report structure |
| `data/compact-report-template.md` | Phase 5 (compact mode) | Compact report structure |
| `data/pattern-update-protocol.yaml` | Phase 6 | New pattern rules |
| `methods/method-procedures/082_Scope_Integrity_Audit.md` | Phase 5 (compact) | Scope integrity validation |
| `methods/method-procedures/083_Closure_Check.md` | Phase 5 (compact) | Completeness validation |
| `methods/method-procedures/084_Coherence_Check.md` | Phase 5 (compact) | Coherence validation |
| `methods/method-procedures/088_Executability_Check.md` | Phase 5 (compact) | Actionability validation |
| `methods/method-procedures/089_Output_Quality_Score.md` | Phase 5 (compact) | Quality scoring |

---

## BINDING GATES

**MECHANISM:** Every gate transition requires ALL items DONE or SCOPE_REDUCED.

**SCOPE_REDUCTION_RECORD format:**
```yaml
what_omitted: "Exact description of what was skipped"
why: "Justification for omission"
impact_assessment: "How this affects verification quality"
user_approved: true/false  # If false, HALT and request approval
```

**Gate definitions:** `data/gate-definitions.yaml`

---

## HYPOTHESIS LOGGING

**WHEN:** Every interpretive decision (infers synonym, assumes scope, interprets ambiguity).

**FORMAT:**
```yaml
hypothesis_id: H{N}
claim: "What I am assuming"
basis: "EXPLICIT | INFERRED | CONTEXTUAL"
evidence_for: ["Quote 1", "Quote 2"]
evidence_against: ["Counter-quote 1"]
confidence: "HIGH | MEDIUM | LOW"
status: "ACTIVE | TESTED | FALSIFIED"
linked_finding_id: F{N}  # if applicable
```

---

## COUNTER-CHECKS

**TRIGGER:** Every CRITICAL or IMPORTANT finding.

**PROCEDURE:**
1. State the finding
2. Generate counter-hypothesis: "What if the finding is wrong because..."
3. Test counter-hypothesis against artifact
4. Document result: FINDING_SURVIVES or FINDING_WITHDRAWN

**FORMAT:**
```yaml
finding_id: F{N}
counter_hypothesis: "Alternative explanation"
test_result: "Evidence from artifact"
conclusion: "FINDING_SURVIVES | FINDING_WITHDRAWN"
```

---

## ENFORCEMENT REMINDERS

**Before starting Phase N:**
1. Confirm GATE_{N-1} passed
2. Load step-{N} file
3. Load required data files (just-in-time)
4. Execute step fully
5. Complete binding checklist
6. Pass GATE_N or SCOPE_REDUCE with formal record

**During execution:**
- NO conversational output
- NO premature report generation
- ALL findings MUST have quotes
- ALL phases run (no early exits)
- ALL gate items checked

---

**END OF WORKFLOW**

**Next action:** Load `steps/step-00-setup.md` and BEGIN execution.
