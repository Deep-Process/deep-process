---
step: 3
name: "Adversarial Validation"
time_estimate: "10-20 minutes"
goal: "Attack findings to ensure they survive scrutiny, test counter-hypotheses"
requires_completion: [0, 1, 2]
next_steps:
  DEFAULT: "steps/step-04-verdict.md"
gate: "GATE_3"
data_dependencies:
  - "../deep-verify/data/severity-scoring.yaml"
  - "../deep-verify/data/method-procedures/063_Challenge_from_Critical_Perspective.md"
outputs:
  - findings (updated with survived_phase3)
  - currentScore (adjusted)
  - hypotheses (updated statuses)
---

# Phase 3: Adversarial Validation

## ENFORCEMENT RULES

```
1. THIS PHASE IS MANDATORY IN ALL MODES. No exceptions.
2. Review ALL IMPORTANT+ findings. No skipping.
3. Answer ALL FOUR adversarial prompts per finding. No shortcuts.
4. Construct steel-man for opposite verdict.
5. Complete False Positive Checklist if REJECT direction.
6. Test all UNTESTED hypotheses from Phase 0 and Phase 1.
7. Adjust scores HONESTLY based on what prompts reveal.
8. COMPLETE binding checklist before GATE_3.
```

---

## 3.0 Load Required Data

**Execute:**

1. Read `../deep-verify/data/severity-scoring.yaml` → `phase3_adjustment_rules` section
2. Optionally read `../deep-verify/data/method-procedures/063_Challenge_from_Critical_Perspective.md`

```
Data loaded:
  [ ] severity-scoring.yaml — phase3 rules loaded
  [ ] Method #63 procedure — [ ] loaded  [ ] using inline guide
```

> **HALT** — Confirm data loaded.

---

## 3.1 Hypothesis Resolution

**ENFORCEMENT:** Before attacking findings, resolve all UNTESTED hypotheses from earlier phases.

**Execute for each hypothesis with status=UNTESTED:**

```
HYPOTHESIS H[N]: "[statement]"
  Original confidence: [0.0-1.0]

  Resolution method:
    [ ] RE-READ artifact sections [location] for evidence
    [ ] COMPARE against extracted claims
    [ ] DOMAIN KNOWLEDGE check
    [ ] CANNOT RESOLVE — will note in report

  Evidence found:
    For: "________________________________"
    Against: "________________________________"

  Updated status:
    [ ] CONFIRMED — evidence supports hypothesis
    [ ] REFUTED — evidence contradicts hypothesis
    [ ] INCONCLUSIVE — insufficient evidence
    [ ] CANNOT_RESOLVE — requires external input

  Updated confidence: [0.0-1.0]

  IMPACT on findings:
    [ ] No impact on existing findings
    [ ] Affects finding F[N]: [describe impact]
    [ ] Creates new finding: [describe]
```

> **HALT** — Resolve all hypotheses before proceeding to adversarial prompts.

---

## 3.2 Devil's Advocate Prompts

**Execute for EACH finding with severity >= IMPORTANT:**

### Finding F[N]: [description]

```
ORIGINAL SEVERITY: [CRITICAL / IMPORTANT]
QUOTE: "[exact text]"
COUNTER-CHECK RESULT from Phase 2: [HOLDS / FAILS / INCONCLUSIVE]
```

---

#### PROMPT 1: ALTERNATIVE EXPLANATION

```
Question: "What if the author meant X instead of Y?"
         "Is there a reading where this is NOT a problem?"

Answer: ________________________________

Evidence for alternative: "________________________________"

Weakens finding? [ ] Yes  [ ] No

If Yes — explain: ________________________________
```

---

#### PROMPT 2: HIDDEN CONTEXT

```
Question: "What unstated assumption would make this work?"
         "Is there a footnote/appendix/convention that resolves this?"

Answer: ________________________________

Evidence for hidden context: "________________________________"

Weakens finding? [ ] Yes  [ ] No

If Yes — explain: ________________________________
```

---

#### PROMPT 3: DOMAIN EXCEPTION

```
Question: "Is there a known exception in this domain?"
         "Do practitioners actually treat this as a problem?"

Answer: ________________________________

Evidence for domain exception: "________________________________"

Weakens finding? [ ] Yes  [ ] No

If Yes — explain: ________________________________
```

---

#### PROMPT 4: SURVIVORSHIP BIAS

```
Question: "Am I focusing on this because I found it first?"
         "What would I conclude if I'd read in different order?"

Answer: ________________________________

Evidence for survivorship bias: "________________________________"

Weakens finding? [ ] Yes  [ ] No

If Yes — explain: ________________________________
```

---

#### ADVERSARIAL RESULT FOR F[N]

```
Prompts that weaken this finding: _____/4

ACTION (execute the matching rule):

[ ] 0-1 prompts weaken → KEEP severity unchanged
    Finding status: SURVIVED_PHASE3

[ ] 2 prompts weaken → CONSIDER downgrade
    Downgrade decision:
      [ ] DOWNGRADE: CRITICAL → IMPORTANT (S adjustment: -2)
      [ ] DOWNGRADE: IMPORTANT → MINOR (S adjustment: -0.7)
      [ ] KEEP (explain why: ________________________________)

[ ] 3 prompts weaken → DOWNGRADE (mandatory)
    [ ] CRITICAL → IMPORTANT (S adjustment: -2)
    [ ] IMPORTANT → MINOR (S adjustment: -0.7)

[ ] 4 prompts weaken → REMOVE finding
    S adjustment: -[original severity points]
    Finding status: REMOVED_PHASE3
    Removal reason: "________________________________"
```

> **HALT** — Complete ALL four prompts for EACH IMPORTANT+ finding before proceeding.

---

## 3.3 Steel-Man Construction

**Execute:** Construct the strongest possible case for the OPPOSITE of your current leaning.

```
Current evidence direction: [ ] REJECT  [ ] ACCEPT  [ ] UNCERTAIN

STEEL-MAN for [OPPOSITE DIRECTION]:
```

### Argument 1:

```
Claim: "________________________________"
Evidence FROM ARTIFACT: "[exact quote]" at [location]
Holds up under scrutiny? [ ] Yes  [ ] No
If No — why: ________________________________
```

### Argument 2:

```
Claim: "________________________________"
Evidence FROM ARTIFACT: "[exact quote]" at [location]
Holds up under scrutiny? [ ] Yes  [ ] No
If No — why: ________________________________
```

### Argument 3:

```
Claim: "________________________________"
Evidence FROM ARTIFACT: "[exact quote]" at [location]
Holds up under scrutiny? [ ] Yes  [ ] No
If No — why: ________________________________
```

### Steel-Man Assessment

```
Arguments that hold up: _____/3

ENFORCEMENT RULE:
  If ANY steel-man argument holds:
    [ ] Reconsider verdict direction
    [ ] Document why proceeding anyway:
        "________________________________"
```

> **HALT** — Complete steel-man before proceeding.

---

## 3.4 False Positive Checklist (Before REJECT)

**ENFORCEMENT:** If current direction is REJECT, execute this checklist. Otherwise skip to 3.5.

```
□ 1. Did I search for disconfirming evidence with same rigor as confirming?
     Answer: ________________________________
     Evidence of balanced search: ________________________________

□ 2. Could a domain expert reasonably disagree with my interpretation?
     Answer: ________________________________
     Specific expert perspective: ________________________________

□ 3. Is my finding based on what artifact SAYS vs what it IMPLIES?
     Answer: ________________________________
     If IMPLIES — LOG HYPOTHESIS

□ 4. Did I give artifact benefit of the doubt on ambiguous language?
     Answer: ________________________________
     Ambiguities resolved in favor: [count] Against: [count]

□ 5. Would the original author recognize my characterization as fair?
     Answer: ________________________________
     Strongest author defense: ________________________________

Boxes checked: _____/5

ENFORCEMENT RULE:
  If 2+ boxes unchecked → RETURN to 3.2 and re-examine findings
  with explicit focus on the unchecked dimensions.
```

> **HALT** — Complete checklist if REJECT direction.

---

## 3.5 Counter-Check Reconciliation

**Execute:** Reconcile Phase 2 counter-checks with Phase 3 adversarial results.

```
For each CRITICAL/IMPORTANT finding:
  F[N]:
    Phase 2 counter-check: [HOLDS / FAILS / INCONCLUSIVE]
    Phase 3 adversarial: [SURVIVED / DOWNGRADED / REMOVED]
    Combined assessment:
      [ ] CONSISTENT — both phases agree
      [ ] INCONSISTENT — phases disagree
          Resolution: ________________________________
```

**ENFORCEMENT:** If counter-check and adversarial review DISAGREE:
- If counter-check said HOLDS (finding is false) but adversarial SURVIVED → RE-EXAMINE.
  Log: "Counter-check and adversarial disagree on F[N]. Resolution: ___"
- If counter-check said FAILS (finding stands) but adversarial REMOVED → RE-EXAMINE.
  Log: "Counter-check and adversarial disagree on F[N]. Resolution: ___"

---

## 3.6 Reconciliation Summary

```
═══════════════════════════════════════════════════════════════
PHASE 3 RECONCILIATION
═══════════════════════════════════════════════════════════════

Original findings count:
  CRITICAL: _____
  IMPORTANT: _____
  MINOR: _____

After adversarial review:
  Findings removed: _____ (total points: _____)
  Findings downgraded: _____ (total adjustment: _____)
  Findings unchanged: _____

Final findings count:
  CRITICAL: _____
  IMPORTANT: _____
  MINOR: _____

Score before Phase 3: _____
Phase 3 adjustments: _____
Score after Phase 3: _____

Hypotheses resolved: _____/[total]
Hypotheses still UNTESTED: _____ (will go to NOT_CHECKED)

═══════════════════════════════════════════════════════════════
```

---

## BINDING CHECKLIST — Phase 3

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] ALL UNTESTED hypotheses resolved or flagged    Status: ____   │
│  [ ] ALL IMPORTANT+ findings adversarially reviewed Status: ____   │
│  [ ] ALL FOUR prompts answered per finding          Status: ____   │
│  [ ] Steel-man constructed for opposite verdict     Status: ____   │
│  [ ] False Positive Checklist completed (if REJECT) Status: ____   │
│  [ ] Counter-check reconciliation completed         Status: ____   │
│  [ ] Score adjusted based on adversarial results    Status: ____   │
│  [ ] Reconciliation summary compiled                Status: ____   │
│  [ ] Frontmatter updated                            Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_3: Adversarial → Verdict

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_3: ADVERSARIAL COMPLETE → VERDICT                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] ALL IMPORTANT+ findings reviewed adversarially Status: ____   │
│  [ ] ALL four prompts answered per finding          Status: ____   │
│  [ ] Steel-man attempted                            Status: ____   │
│  [ ] False Positive Checklist done (if applicable)  Status: ____   │
│  [ ] Counter-checks reconciled with adversarial     Status: ____   │
│  [ ] Score adjusted: S = _____                      Status: ____   │
│  [ ] Phase 3 checklist ALL items addressed          Status: ____   │
│  [ ] All findings have survived_phase3 set          Status: ____   │
│                                                                     │
│  GATE_3 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**IF GATE_3 PASSED:** Load `steps/step-04-verdict.md`
**IF GATE_3 FAILED:** Complete missing items. Do NOT proceed.

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3]
currentStep: 4
currentScore: [adjusted S]
scoreHistory:
  - step: 2
    # ...
  - step: 3
    action: "adversarial_review"
    findings_examined: [count]
    findings_removed: [count]
    findings_downgraded: [count]
    delta: "[calculation]"
    total: [adjusted S]

findings:
  - id: F1
    severity: [original or adjusted]
    survived_phase3: [true / false]
    phase3_notes: "[notes]"
  # ...

phase3_summary:
  findings_examined: [count]
  findings_weakened: [count]
  adversarial_prompts_applied: true
  steel_man_attempted: true
  steel_man_arguments_held: [count]
  false_positive_checklist: [count]/5 or "N/A"
  hypotheses_resolved: [count]
  hypotheses_remaining: [count]
```

