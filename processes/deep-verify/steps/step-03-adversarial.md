---
step: 3
name: "Adversarial Validation"
time_estimate: "10-20 minutes"
goal: "Attack findings with devil's advocate and steel-man to ensure they survive scrutiny"
requires_completion: [0, 1, 2]
next_steps:
  DEFAULT: "steps/step-04-verdict.md"
gate: "GATE_3"
data_dependencies:
  - "data/method-procedures/063_Challenge_from_Critical_Perspective.md"
  - "data/severity-scoring.yaml"
outputs:
  - findings (updated with survived_phase3)
  - currentScore (adjusted)
---

# Phase 3: Adversarial Validation

## ENFORCEMENT RULES

```
1. THIS PHASE IS MANDATORY. No early exits.
2. Review ALL IMPORTANT+ findings with devil's advocate.
3. Answer ALL FOUR adversarial prompts per finding.
4. Construct steel-man for opposite verdict.
5. Complete False Positive Checklist if REJECT direction.
6. Adjust scores based on what prompts reveal.
7. COMPLETE binding checklist before GATE_3.
8. ALL phases run. NO skipping based on score.
```

**CRITICAL:** Empirical data shows adversarial review changes verdict in 57% of borderline cases.

---

## 3.0 Load Required Data

**Execute:**

1. Read `data/method-procedures/063_Challenge_from_Critical_Perspective.md`
2. Read `data/severity-scoring.yaml` → phase3_adjustment_rules section

> **HALT** — Confirm data files loaded.

---

## 3.1 Devil's Advocate Prompts

**For EACH finding with severity ≥ IMPORTANT:**

Execute ALL FOUR prompts. No skipping.

### Finding: F[N] — [description]

**Original severity:** [CRITICAL / IMPORTANT]
**Quote:** "[exact text]"
**Location:** [line/section]

---

#### □ PROMPT 1: ALTERNATIVE EXPLANATION

> "What if the author meant X instead of Y?"
> "Is there a reading where this is not a problem?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 2: HIDDEN CONTEXT

> "What unstated assumption would make this work?"
> "Is there a footnote/appendix that resolves this?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 3: DOMAIN EXCEPTION

> "Is there a known exception in this domain?"
> "Do practitioners actually treat this as a problem?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 4: SURVIVORSHIP BIAS

> "Am I focusing on this because I found it first?"
> "What would I conclude if I'd read in different order?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### RESULT for F[N]

```
Prompts that weaken this finding: [count]/4

DECISION RULE:
  0-1 weakened → Keep severity as-is
  2-3 weakened → Downgrade severity
  4 weakened → Remove finding

ACTION:
[ ] KEEP (0-1 prompts weakened)
    survived_phase3: true
    severity: [unchanged]
    score: [unchanged]

[ ] DOWNGRADE (2-3 prompts weakened)
    survived_phase3: true (but downgraded)
    Old severity: [CRITICAL/IMPORTANT]
    New severity: [IMPORTANT/MINOR]
    Score adjustment: [CRITICAL→IMPORTANT: -2, IMPORTANT→MINOR: -0.7]

[ ] REMOVE (4 prompts weakened)
    survived_phase3: false
    Remove from findings list
    Score adjustment: -[original points]
```

> **HALT** — Complete prompts for each IMPORTANT+ finding before 3.2.

---

## 3.2 Steel-Man the Artifact

**Construct the strongest possible case for the OPPOSITE of your current direction:**

```
Current evidence direction: [ ] REJECT [ ] ACCEPT [ ] UNCERTAIN

Steel-man target: Build best case for [opposite direction]
```

### Argument 1

**Claim:** ________________________________

**Evidence from artifact:** "[quote supporting this claim]"

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Argument 2

**Claim:** ________________________________

**Evidence from artifact:** "[quote]"

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Argument 3

**Claim:** ________________________________

**Evidence from artifact:** "[quote]"

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Steel-Man Assessment

```
Arguments that hold up: [count]/3

If ANY steel-man argument holds:
  → Reconsider verdict direction
  → If NOT changing verdict, document why:
    Reason: ________________________________
```

> **HALT** — Complete steel-man construction.

---

## 3.3 False Positive Checklist

**TRIGGER:** If current direction is REJECT, complete this checklist.

**Execute:**

```
□ Did I search for disconfirming evidence with same rigor as confirming?
  Answer: ________________________________

□ Could a domain expert reasonably disagree with my interpretation?
  Answer: ________________________________

□ Is my finding based on what artifact SAYS vs what it IMPLIES?
  Answer: ________________________________

□ Did I give artifact benefit of doubt on ambiguous language?
  Answer: ________________________________

□ Would original author recognize my characterization as fair?
  Answer: ________________________________

□ Am I conflating "not proven" with "disproven"?
  Answer: ________________________________
```

**If ANY answer raises doubt:** Re-examine affected findings.

> **HALT** — Complete checklist if REJECT direction.

---

## 3.4 Update Score

**After ALL adversarial work complete:**

```
SCORE ADJUSTMENTS:

Findings removed: [count]
  Score impact: -[sum of removed finding points]

Findings downgraded: [count]
  CRITICAL → IMPORTANT: [count] × -2 = [points]
  IMPORTANT → MINOR: [count] × -0.7 = [points]

Total adjustment: [sum]

Updated Score (S): [previous S] + [adjustment] = [new S]
```

**Update frontmatter:**

```yaml
currentScore: [new S]
findings: [updated list with survived_phase3 flags]
phase3_summary:
  findings_reviewed: [count]
  findings_removed: [count]
  findings_downgraded: [count]
  findings_kept: [count]
  steel_man_attempted: true
  false_positive_checklist: [completed if REJECT, else N/A]
```

---

## GATE_3: Adversarial → Verdict

**ENFORCEMENT:** ALL items MUST be DONE or SCOPE_REDUCED before proceeding.

Load `data/gate-definitions.yaml` → GATE_3 for complete requirements.

### Gate Checklist

```
[ ] G3.1: ALL IMPORTANT+ findings reviewed adversarially
[ ] G3.2: ALL four prompts answered per finding (no skipping)
[ ] G3.3: survived_phase3 flag set for each finding
[ ] G3.4: Steel-man attempted for opposite verdict
[ ] G3.5: Steel-man arguments documented (3 minimum)
[ ] G3.6: False Positive Checklist completed (if REJECT direction)
[ ] G3.7: Score adjusted based on removed/downgraded findings
[ ] G3.8: Frontmatter updated with phase3_summary
[ ] G3.9: Counter-checks from Phase 2 reconciled with adversarial results
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G3.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how affects verification quality]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. IF ALL DONE: Output `"GATE_3 PASSED"`
4. IF ANY SCOPE_REDUCED: Output `"GATE_3 PASSED (with scope reductions)"`
5. Proceed to Phase 4.

**ENFORCEMENT:** ALL phases run. NO early exits based on score.

**HALT** — Do NOT load Phase 4 until GATE_3 passes.

---

**END OF PHASE 3**

**Next action:** Load `steps/step-04-verdict.md`
