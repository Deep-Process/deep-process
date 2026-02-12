---
step: 4
name: "Verdict"
time_estimate: "3-5 minutes"
goal: "Calculate final score, determine verdict, validate, assess confidence, check escalation"
requires_completion: [0, 1, 2, 3]
next_steps:
  DEFAULT: "steps/step-05-render.md"
gate: "GATE_4"
data_dependencies:
  - "../deep-verify/data/decision-thresholds.yaml"
  - "../deep-verify/data/severity-scoring.yaml"
outputs:
  - verdict
  - confidence
  - escalation_needed
---

# Phase 4: Verdict

## ENFORCEMENT RULES

```
1. LOAD data files BEFORE any calculations.
2. Calculate final score with FULL audit trail.
3. Apply verdict rules from decision-thresholds.yaml — no deviation.
4. Validate verdict using the MATCHING checklist.
5. Assess confidence HONESTLY based on evidence quality.
6. Check ALL escalation criteria.
7. COMPLETE binding checklist before GATE_4.
```

**ENFORCEMENT:** This phase determines the verdict. It does NOT generate the report. Report generation is Phase 5 ONLY.

---

## 4.0 Load Required Data

**Execute:**

1. Read `../deep-verify/data/decision-thresholds.yaml` → `final_verdict_rules`, `confidence_levels`, `escalation_criteria`
2. Read `../deep-verify/data/severity-scoring.yaml` → for score verification

```
Data loaded:
  [ ] decision-thresholds.yaml — verdict rules, confidence, escalation
  [ ] severity-scoring.yaml — scoring reference
```

> **HALT** — Confirm data loaded.

---

## 4.1 Final Evidence Score Calculation

**Execute:** Recalculate score from scratch as verification audit.

```
═══════════════════════════════════════════════════════════════
FINAL EVIDENCE SCORE AUDIT
═══════════════════════════════════════════════════════════════

Phase 2 — Tier 1 contributions:
  #71 First Principles:
    Clean pass: [ ] Yes (-0.5) / [ ] No
    Findings: [list F_ids] × [severity points] = _____
  #100 Vocabulary:
    Clean pass: [ ] Yes (-0.5) / [ ] No
    Findings: [list F_ids] × [severity points] = _____
  #17 Abstraction:
    Clean pass: [ ] Yes (-0.5) / [ ] No
    Findings: [list F_ids] × [severity points] = _____

  Tier 1 subtotal: _____

Phase 2 — Tier 2 contributions:
  #_____ [Name]:
    Clean pass: [ ] Yes (-0.5) / [ ] No
    Findings: [list F_ids] × [severity points] = _____
  [Repeat for each]

  Tier 2 subtotal: _____

Bonuses:
  Pattern matches: [count] × +1 = _____
  Confirmations (cross-cluster): [count] × +1 = _____

  Bonus subtotal: _____

Phase 3 adjustments:
  Findings removed: [count F_ids] = -_____
  Downgrades CRITICAL→IMPORTANT: [count] × -2 = _____
  Downgrades IMPORTANT→MINOR: [count] × -0.7 = _____

  Phase 3 adjustment subtotal: _____

Counter-check adjustments (Phase 2):
  Findings removed by counter-check: [count] = -_____
  Findings downgraded by counter-check: [count] = -_____

  Counter-check adjustment subtotal: _____

═══════════════════════════════════════════════════════════════
FINAL S = [Tier1] + [Tier2] + [Bonuses] + [Phase3 adj] + [CC adj]
FINAL S = _____ + _____ + _____ + _____ + _____ = _____
═══════════════════════════════════════════════════════════════

VERIFICATION: Does recalculated S match running total?
  Running total from frontmatter: _____
  Recalculated: _____
  Match: [ ] Yes  [ ] No — if No, investigate discrepancy
```

---

## 4.2 Determine Verdict

**Execute:** Apply rules from `decision-thresholds.yaml` → `final_verdict_rules`:

```
┌─────────────────────────────────────────────────────────────────────┐
│  S ≥ 6           → REJECT                                           │
│  S ≤ -3          → ACCEPT                                           │
│  -3 < S < 6      → UNCERTAIN                                        │
└─────────────────────────────────────────────────────────────────────┘

Current S = _____

VERDICT: _______________
```

---

## 4.3 Validate Verdict

**Execute the checklist that MATCHES the verdict:**

### IF REJECT:

```
□ 1. At least one CRITICAL finding survived Phase 3
     Finding: F[N] — "[description]"
     Status: ________________________________

□ 2. Pattern Library match exists OR cross-cluster confirmation obtained
     Evidence: ________________________________

□ 3. False Positive Checklist completed in Phase 3
     Result: _____/5 checked

□ 4. Steel-man arguments for ACCEPT addressed
     Arguments held: _____/3
     Why proceeding with REJECT: ________________________________

□ 5. Counter-checks on CRITICAL findings all FAIL (finding stands)
     Counter-check results: ________________________________

All items checked: [ ] Yes  [ ] No
If No — document exception: ________________________________
```

### IF ACCEPT:

```
□ 1. All Tier 1 methods passed clean
     Result: ________________________________

□ 2. No CRITICAL findings at any phase
     Confirm: ________________________________

□ 3. If IMPORTANT findings existed, all resolved in Phase 3
     Confirm: ________________________________

□ 4. Steel-man for REJECT attempted and failed
     Confirm: ________________________________

□ 5. No UNTESTED hypotheses that could change verdict
     Untested hypotheses: [count]
     Assessment: ________________________________

All items checked: [ ] Yes  [ ] No
If No — document exception: ________________________________
```

### IF UNCERTAIN:

```
□ 1. Score is genuinely in uncertain range (-3 < S < 6)
     S = _____

□ 2. Specific uncertainties documented
     1. ________________________________
     2. ________________________________

□ 3. Escalation criteria checked (see 4.5)

□ 4. If S is negative AND no CRITICAL/IMPORTANT findings remain:
     → Include recommendation: "ACCEPT with caveats"
     → Document caveats

□ 5. UNTESTED hypotheses that contribute to uncertainty
     Count: _____
     List: ________________________________
```

> **HALT** — Complete validation checklist.

---

## 4.4 Assess Confidence

**Execute:** Check conditions from `decision-thresholds.yaml` → `confidence_levels`:

```
HIGH confidence — ALL conditions must be met:
  [ ] |S| > 10                           (S = _____)
  [ ] Methods agree (strong agreement)
  [ ] Adversarial attacks failed to weaken findings
  → All met? [ ] Yes → HIGH  [ ] No → check MEDIUM

MEDIUM confidence — conditions:
  [ ] 6 ≤ |S| ≤ 10                       (S = _____)
  [ ] Most methods agree (moderate+ agreement)
  → Met? [ ] Yes → MEDIUM  [ ] No → check LOW

LOW confidence — ANY condition:
  [ ] |S| near threshold (within 1 point)
  [ ] Methods disagree
  [ ] Findings weakened in Phase 3
  [ ] Multiple UNTESTED hypotheses remain
  → Any met? [ ] Yes → LOW

CONFIDENCE: _______________
```

---

## 4.5 Check Escalation Criteria

**Execute:** Check ALL escalation triggers from `decision-thresholds.yaml`:

### Mandatory Escalation (ANY triggers escalation):

```
[ ] UNCERTAIN verdict AND stakes are HIGH
    Stakes: _____  Verdict: _____

[ ] Methods strongly disagree (some toward REJECT, some toward ACCEPT)
    Method agreement: _____

[ ] False Positive Checklist has 2+ unchecked items
    Unchecked items: _____

[ ] Counter-check and adversarial review disagree on CRITICAL finding
    Disagreement on: ________________________________
```

### Recommended Escalation (consider if ANY apply):

```
[ ] Findings require domain expertise agent lacks
    Domain: ________________________________

[ ] Novel pattern not in library, uncertain severity
    Pattern: ________________________________

[ ] Multiple steel-man arguments hold
    Count: _____/3

[ ] UNTESTED hypotheses that could change verdict
    Count: _____
```

### Escalation Decision

```
Escalation needed? [ ] Yes  [ ] No

If Yes:
  Type: [ ] MANDATORY  [ ] RECOMMENDED
  Reason: ________________________________
  Specific question for reviewer: ________________________________
  What information would resolve: ________________________________
```

---

## BINDING CHECKLIST — Phase 4

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 4 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] Final score recalculated and verified          Status: ____   │
│  [ ] Verdict determined per threshold rules         Status: ____   │
│  [ ] Validation checklist completed for verdict     Status: ____   │
│  [ ] Confidence level assigned                      Status: ____   │
│  [ ] ALL escalation criteria checked                Status: ____   │
│  [ ] Escalation decision documented                 Status: ____   │
│  [ ] Frontmatter updated                            Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_4: Verdict → Render

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_4: VERDICT COMPLETE → RENDER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] Score verified (recalculated matches running)  Status: ____   │
│  [ ] Verdict: _____ determined correctly            Status: ____   │
│  [ ] Validation checklist passed                    Status: ____   │
│  [ ] Confidence: _____ assigned                     Status: ____   │
│  [ ] Escalation: _____ decided                      Status: ____   │
│  [ ] Phase 4 checklist ALL items addressed          Status: ____   │
│  [ ] ALL data needed for report is ready            Status: ____   │
│                                                                     │
│  GATE_4 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**IF GATE_4 PASSED:** Load `steps/step-05-render.md`
**IF GATE_4 FAILED:** Complete missing items. Do NOT proceed.

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3, 4]
currentStep: 5
currentScore: [final S]
verdict: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
confidence: [HIGH / MEDIUM / LOW]

escalation:
  needed: [true/false]
  type: [MANDATORY / RECOMMENDED / null]
  reason: "[reason or null]"
  question: "[question or null]"
  information_needed: "[info or null]"

validation:
  checklist_completed: true
  exceptions_documented: "[any exceptions]"
```

