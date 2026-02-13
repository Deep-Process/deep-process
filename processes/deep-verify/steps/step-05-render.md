---
step: 5
name: "Render"
time_estimate: "5-10 minutes"
goal: "Generate the verification report — THIS IS THE ONLY PHASE THAT PRODUCES OUTPUT"
requires_completion: [0, 1, 2, 3, 4]
next_steps:
  DEEP_MODE_CRITICAL: "steps/step-06-pattern-candidate.md"
  DEFAULT: null
gate: "GATE_5"
data_dependencies:
  - "../deep-verify/data/report-template.md"
outputs:
  - verification_report
---

# Phase 5: Render

## ENFORCEMENT RULES

```
1. THIS IS THE ONLY PHASE THAT GENERATES THE REPORT.
   No report fragments were produced in earlier phases.
2. LOAD report template FIRST.
3. Fill ALL sections. No placeholders in final report.
4. Use EXACT quotes — copy from findings array.
5. VERIFY calculations — score must add up.
6. Document ALL NOT_CHECKED items including UNTESTED hypotheses.
7. COMPLETE binding checklist before GATE_5.
```

**CRITICAL:** The extract→verify→render sequence culminates HERE. All analysis is done. This phase only RENDERS existing results into the report format.

---

## 5.0 Load Report Template

**Execute:**

1. Read `../deep-verify/data/report-template.md`
2. Verify all frontmatter data is available for template filling.

```
Data loaded:
  [ ] report-template.md — loaded
  [ ] Frontmatter contains: verdict, confidence, score, findings, methods, hypotheses
```

> **HALT** — Confirm template loaded and data available.

---

## 5.1 Gather Report Data

**Execute:** Collect all data from frontmatter into a render-ready structure.

```
RENDER DATA:
  artifact: [from frontmatter]
  started: [from frontmatter]
  stakes: [from frontmatter]
  bias_mode: [from frontmatter]
  initial_assessment: [from frontmatter]
  execution_mode: [from frontmatter]

  verdict: [from frontmatter]
  confidence: [from frontmatter]
  currentScore: [from frontmatter]
  earlyExit: false  (always false in V2)

  findings: [from frontmatter — full array]
  patternsMatched: [from frontmatter]
  methodsExecuted: [from frontmatter — full array]

  phase3_summary: [from frontmatter]
  escalation: [from frontmatter]
  counter_checks: [from frontmatter]
  hypotheses: [from frontmatter — full array]
  assumptions_declared: [from frontmatter]
  scope_reductions: [from frontmatter]
  gates_passed: [from frontmatter]
```

---

## 5.2 Generate Report

**Execute:** Fill the report template section by section.

```
═══════════════════════════════════════════════════════════════
VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

ARTIFACT: [artifact]
DATE: [current ISO date]
WORKFLOW VERSION: Deep Verify V2.0

───────────────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────────────

VERDICT: [verdict]
CONFIDENCE: [confidence]
EVIDENCE SCORE: S = [currentScore]
EARLY EXIT: No — Full process (V2 has no early exits)
PATTERN MATCH: [list or "No"]
```

---

## 5.3 Executive Summary

**Execute:** Write 2-3 sentences summarizing the verdict rationale.

```
───────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────

[Write 2-3 sentences based on:
 - The verdict and why
 - The strongest evidence
 - The confidence level]

Key factors:
- [Factor 1 — most impactful finding or clean pass]
- [Factor 2 — pattern match or counter-check result]
- [Factor 3 — adversarial review outcome]
```

---

## 5.4 Findings Section

**Execute:** List ALL findings ordered by severity (CRITICAL first, then IMPORTANT, then MINOR).

```
───────────────────────────────────────────────────────────────
KEY FINDINGS
───────────────────────────────────────────────────────────────

[For each finding in findings array, ordered by severity:]

[F{id}] [{severity}] — [{description}]
     Quote: "[{quote}]"
     Location: [{location}]
     Pattern: [{pattern || "None"}]
     Method: #{method_id} [{method_name}]
     Counter-check: [{counter_result}]
     Survived Phase 3: [{survived_phase3}]
     Phase 3 notes: [{phase3_notes}]

[If no findings:]
[No CRITICAL or IMPORTANT findings identified]
```

---

## 5.5 Score Calculation Section

**Execute:** Show complete calculation audit trail.

```
───────────────────────────────────────────────────────────────
SCORE CALCULATION
───────────────────────────────────────────────────────────────

Phase 2 — Tier 1:
  #71: [Clean (-0.5) / Finding: F[N] (+severity)]
  #100: [Clean (-0.5) / Finding: F[N] (+severity)]
  #17: [Clean (-0.5) / Finding: F[N] (+severity)]
  Tier 1 subtotal: _____

Phase 2 — Tier 2:
  #[X]: [Clean (-0.5) / Finding: F[N] (+severity)]
  [Repeat]
  Tier 2 subtotal: _____

Bonuses:
  Pattern: _____ × +1 = _____
  Confirmations: _____ × +1 = _____
  Bonus subtotal: _____

Phase 3 adjustments:
  Removed: [F_ids] = -_____
  Downgraded: [F_ids] = -_____
  Adjustment subtotal: _____

Final: _____ + _____ + _____ + _____ = S = _____
```

---

## 5.6 Methods Section

**Execute:** List all methods per phase with results.

```
───────────────────────────────────────────────────────────────
METHODS EXECUTED
───────────────────────────────────────────────────────────────

Phase 0 (Setup):
  □ Stakes Assessment: [stakes]
  □ Bias Mode: [bias_mode]
  □ Assumptions Declared: [count] assumptions, [count] hypotheses

Phase 1 (Extraction):
  □ Claim Extraction: [count] claims extracted
  □ Term Extraction: [count] terms extracted
  □ Structure Mapping: [sections, dependencies]
  □ Pattern Signal Scan: [strong/weak/none signals]

Phase 2 (Verification):
  □ #71 First Principles — [Clean / Finding: brief]
  □ #100 Vocabulary — [Clean / Finding: brief]
  □ #17 Abstraction Laddering — [Clean / Finding: brief]
  □ #[X] [Name] — [Clean / Finding: brief]
    Selected because: [signal]
  [Repeat for each Tier 2 method]

Phase 3 (Adversarial):
  □ Hypothesis Resolution — [count] resolved, [count] remaining
  □ Devil's Advocate — [count] findings examined
  □ Adversarial Prompts — [count] findings weakened
  □ Steel-man — [count]/3 arguments held
  □ False Positive Checklist — [count]/5 or "N/A"
  □ Counter-check Reconciliation — [count] consistent, [count] reconciled

Phase 4 (Verdict):
  □ Score Verification — [Match / Discrepancy]
  □ Validation Checklist — [All passed / exceptions]
  □ Escalation Check — [Not needed / Triggered: reason]
```

---

## 5.7 Adversarial Review Details

**Execute:** Include Phase 3 details for each reviewed finding.

```
───────────────────────────────────────────────────────────────
ADVERSARIAL REVIEW DETAILS
───────────────────────────────────────────────────────────────

[For each IMPORTANT+ finding:]

Finding F[N]: [description]
  □ Alternative Explanation: [answer] — Weakens? [Y/N]
  □ Hidden Context: [answer] — Weakens? [Y/N]
  □ Domain Exception: [answer] — Weakens? [Y/N]
  □ Survivorship Bias: [answer] — Weakens? [Y/N]
  Result: [X/4] prompts weaken
  Action: [Keep / Downgrade / Remove]

Steel-man for [opposite verdict]:
  1. [Argument] — Holds? [Y/N]
  2. [Argument] — Holds? [Y/N]
  3. [Argument] — Holds? [Y/N]
```

---

## 5.8 NOT CHECKED Section

**ENFORCEMENT:** This section MUST include ALL of the following:

```
───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

UNTESTED HYPOTHESES (from process):
  [For each hypothesis with status=UNTESTED or CANNOT_RESOLVE:]
  - H[N]: "[statement]" — Reason not tested: [reason]

SCOPE REDUCTIONS (from gates):
  [For each SCOPE_REDUCTION_RECORD:]
  - Gate [N]: "[what_omitted]" — Why: [reason]

ASPECTS NOT EXAMINED:
  - [Aspect 1]: Not examined because [reason]
  - [Aspect 2]: Outside scope because [reason]
  - [Aspect 3]: Would require [external resource/expertise]

ASSUMPTIONS NOT VERIFIED:
  [For each assumption with basis=INFERRED that was not tested:]
  - "[assumption]" — Status: ASSUMED, not verified
```

---

## 5.9 Recommendations Section

**Execute:** Generate recommendations based on verdict.

```
───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[Follow the verdict-specific template from report-template.md]
```

---

## 5.10 Assumptions & Hypotheses Section (V2-specific)

```
───────────────────────────────────────────────────────────────
ASSUMPTIONS & HYPOTHESES LOG
───────────────────────────────────────────────────────────────

Assumptions declared at start: [count]
  By basis: STATED=[N], INFERRED=[N], DOMAIN=[N], UNKNOWN=[N]

Hypotheses generated during process: [count]
  CONFIRMED: [count]
  REFUTED: [count]
  INCONCLUSIVE: [count]
  UNTESTED: [count] (see NOT CHECKED)

[List each hypothesis with final status]
```

---

## 5.11 Process Integrity Section (V2-specific)

```
───────────────────────────────────────────────────────────────
PROCESS INTEGRITY
───────────────────────────────────────────────────────────────

Gates passed: [list with timestamps]
Scope reductions: [count]
Counter-checks performed: [count]
Sequence enforcement: EXTRACT → VERIFY → RENDER [confirmed]
Phases executed: [0, 1, 2, 3, 4, 5]
Early exits: NONE (V2 policy)
```

---

## 5.12 Metadata Section

```
───────────────────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────────────────

Verification started: [timestamp]
Verification completed: [timestamp]
Total methods executed: [count]
Data files loaded: [list]
Early exit: No (V2 has no early exits)
Workflow version: Deep Verify V2.0
Gates passed: [count]/[total]
Scope reductions: [count]
Hypotheses: [count] generated, [count] resolved

═══════════════════════════════════════════════════════════════
```

---

## 5.13 Report Validation

**Execute:** Verify report completeness before output.

```
□ ALL [PLACEHOLDER] fields replaced with actual values
□ ALL quotes are exact (copy-paste from artifact)
□ ALL line numbers/sections are accurate
□ Score calculation adds up correctly
□ Methods list matches methodsExecuted
□ Findings list matches findings array
□ Verdict matches decision-thresholds.yaml rules
□ Confidence level matches conditions
□ NOT CHECKED section includes ALL untested hypotheses
□ NOT CHECKED section includes ALL scope reductions
□ Recommendations are actionable and specific
□ Assumptions & Hypotheses log is complete
□ Process Integrity section is accurate
```

> **HALT** — Complete validation before output.

---

## BINDING CHECKLIST — Phase 5

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 5 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] Report template loaded and filled              Status: ____   │
│  [ ] ALL sections populated (no placeholders)       Status: ____   │
│  [ ] ALL quotes are exact copies                    Status: ____   │
│  [ ] Score calculation verified correct             Status: ____   │
│  [ ] NOT CHECKED section complete and honest        Status: ____   │
│  [ ] Assumptions & Hypotheses log complete          Status: ____   │
│  [ ] Process Integrity section accurate             Status: ____   │
│  [ ] Report validation checklist passed             Status: ____   │
│  [ ] Report output to user                          Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_5: Render → Complete (or Pattern Candidate)

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_5: RENDER COMPLETE → WORKFLOW END / PATTERN CANDIDATE        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] Report fully populated and validated           Status: ____   │
│  [ ] Report output to user                          Status: ____   │
│  [ ] Phase 5 checklist ALL items addressed          Status: ____   │
│                                                                     │
│  POST-RENDER CHECK:                                                │
│  CRITICAL finding survived Phase 3 without pattern match?          │
│                                                                     │
│  IF execution_mode == Deep:                                        │
│    [ ] Yes → Load steps/step-06-pattern-candidate.md               │
│    [ ] No → Workflow COMPLETE                                      │
│                                                                     │
│  IF execution_mode == Standard OR Quick:                           │
│    [ ] Yes → Append PATTERN CANDIDATE NOTE to report:              │
│         "Finding F[id] ([description]) has no Pattern Library       │
│          match. Reason this may be a new pattern: [1 sentence].    │
│          To evaluate: request Phase 6 (Pattern Candidate)."        │
│         NOTE: This is a PASSIVE note. Do NOT ask user.             │
│    [ ] No → Workflow COMPLETE                                      │
│                                                                     │
│  GATE_5 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3, 4, 5]
currentStep: null  # or 6 if Deep mode
completed: "[current ISO timestamp]"
report_generated: true
```

