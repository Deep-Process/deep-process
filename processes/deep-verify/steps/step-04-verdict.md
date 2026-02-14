---
step: 4
name: "Verdict"
time_estimate: "3-5 minutes"
goal: "Calculate final score, determine verdict, assess confidence, check escalation"
requires_completion: [0, 1, 2, 3]
next_steps:
  DEFAULT: "steps/step-05-report.md"
gate: "GATE_4"
data_dependencies:
  - "data/decision-thresholds.yaml"
  - "data/severity-scoring.yaml"
  - "data/calibration.yaml"
outputs:
  - verdict
  - confidence
  - escalation_needed
---

# Phase 4: Verdict

## ENFORCEMENT RULES

```
1. Calculate final score accurately using ALL adjustments.
2. Apply verdict rules from decision-thresholds.yaml consistently.
3. Validate verdict using appropriate checklist.
4. Assess confidence honestly based on evidence quality.
5. Check escalation criteria before finalizing.
6. COMPLETE binding checklist before GATE_4.
7. NO early exits. ALL phases run.
```

---

## 4.0 Load Required Data

**Execute:**

1. Read `data/decision-thresholds.yaml`
   - Load final_verdict_rules
   - Load confidence_levels
   - Load escalation_criteria
2. Read `data/severity-scoring.yaml` for score verification
3. Read `data/calibration.yaml` for confidence assessment

> **HALT** — Confirm all data files loaded.

---

## 4.1 Final Score Calculation

**Recalculate score from scratch to verify:**

```
═══════════════════════════════════════════════════════════════
FINAL EVIDENCE SCORE CALCULATION
═══════════════════════════════════════════════════════════════

Phase 1 contributions:
  Tier 1 findings:
    CRITICAL: [count] × 3 = [points]
    IMPORTANT: [count] × 1 = [points]
    MINOR: [count] × 0.3 = [points]
  Pattern bonuses: [count] × 1 = [points]
  Clean passes: [count] × -0.5 = [points]
  ─────────────────────────────────
  Phase 1 subtotal: [sum]

Phase 2 contributions:
  Tier 2 findings:
    CRITICAL: [count] × 3 = [points]
    IMPORTANT: [count] × 1 = [points]
    MINOR: [count] × 0.3 = [points]
  Pattern bonuses: [count] × 1 = [points]
  Clean passes: [count] × -0.5 = [points]
  ─────────────────────────────────
  Phase 2 subtotal: [sum]

Phase 3 adjustments:
  Findings removed: -[points from removed findings]
  Downgrades CRITICAL→IMPORTANT: [count] × -2 = [points]
  Downgrades IMPORTANT→MINOR: [count] × -0.7 = [points]
  ─────────────────────────────────
  Phase 3 adjustment: [sum]

═══════════════════════════════════════════════════════════════
FINAL SCORE (S): [Phase 1] + [Phase 2] + [Phase 3] = [TOTAL]
═══════════════════════════════════════════════════════════════
```

**Verification:**
- Matches frontmatter.currentScore? [ ] Yes [ ] No
- If No: Recalculate and update frontmatter

> **HALT** — Confirm score calculation verified.

---

## 4.2 Verdict Determination

**Apply decision rules from data/decision-thresholds.yaml:**

```
VERDICT DETERMINATION

Final Score (S): [value]

Threshold Analysis:
  [ ] S ≥ 6     → REJECT (artifact contains fatal flaws)
  [ ] -3 < S < 6 → UNCERTAIN (cannot determine validity)
  [ ] S ≤ -3    → ACCEPT (artifact appears sound)

Escalation Check:
  [ ] Escalation flag raised in Phase 0-3?
  [ ] High stakes + borderline score (4 < S < 7)?
  [ ] Conflicting evidence (mix of CRITICAL + clean passes)?

If ANY escalation trigger: Verdict = ESCALATE

─────────────────────────────────
VERDICT: [ACCEPT / UNCERTAIN / REJECT / ESCALATE]
─────────────────────────────────
```

---

## 4.3 Verdict Validation

**Execute the checklist for your verdict:**

### If REJECT:

```
□ At least ONE CRITICAL finding survived Phase 3?
  Answer: ________________________________

□ Quote(s) directly support impossibility/contradiction?
  Quotes: ________________________________

□ Could NOT construct steel-man that held up?
  Confirmed in Phase 3: [ ] Yes [ ] No

□ False Positive Checklist passed?
  Confirmed in Phase 3: [ ] Yes [ ] No
```

### If UNCERTAIN:

```
□ Score is in uncertain range (-3 < S < 6)?
  S = [value]: [ ] Yes [ ] No

□ Mixed evidence (both issues and clean passes)?
  CRITICAL: [count], IMPORTANT: [count], Clean: [count]

□ Ambiguity in artifact prevents clear determination?
  Examples: ________________________________
```

### If ACCEPT:

```
□ Score ≤ -3 OR no CRITICAL/IMPORTANT findings?
  S = [value], CRITICAL: [count], IMPORTANT: [count]

□ All Tier 1 methods passed OR findings removed in Phase 3?
  Summary: ________________________________

□ Steel-man did NOT reveal unaddressed issues?
  Confirmed in Phase 3: [ ] Yes [ ] No
```

### If ESCALATE:

```
□ Escalation trigger identified?
  Trigger: ________________________________

□ Justification for human expert?
  Reason: ________________________________
```

> **HALT** — Complete validation checklist for verdict.

---

## 4.4 Confidence Assessment

**Assess confidence using data/calibration.yaml guidance:**

```
CONFIDENCE ASSESSMENT

Evidence Quality:
  [ ] HIGH - All findings have strong quotes, patterns matched,
             counter-checks passed, steel-man failed
  [ ] MEDIUM - Most findings have quotes, some ambiguity,
               counter-checks mostly passed
  [ ] LOW - Weak quotes, high ambiguity, steel-man partially succeeded,
            or insufficient coverage

Hypothesis Testing:
  Hypotheses generated in Phase 0-1: [count]
  Hypotheses tested: [count]
  Hypotheses untested: [count]
  Untested % = [percentage]

Coverage:
  Phases completed: [0-5 or 0-6]
  Tier 2 methods: [count executed]
  Scope reductions: [count]

─────────────────────────────────
CONFIDENCE: [HIGH / MEDIUM / LOW]
─────────────────────────────────

Confidence Basis:
  [1-2 sentences explaining why this confidence level]
```

> **HALT** — Confirm confidence assessed.

---

## 4.5 Escalation Decision

**Check escalation criteria from data/decision-thresholds.yaml:**

```
ESCALATION CRITERIA CHECK

□ Stakes = HIGH AND Score borderline (4 < S < 7)?
  Stakes: [LOW/MEDIUM/HIGH], S: [value]
  Triggers: [ ] Yes [ ] No

□ Conflicting CRITICAL findings (one says X, one says NOT X)?
  Check findings list: [ ] Yes [ ] No

□ Domain-specific issue requiring expert judgment?
  Examples: ________________________________
  Triggers: [ ] Yes [ ] No

□ Explicit escalation flag raised in Phase 0-3?
  Check frontmatter: [ ] Yes [ ] No

─────────────────────────────────
ESCALATION NEEDED: [true / false]
─────────────────────────────────

If true, override verdict to ESCALATE.
If false, keep determined verdict.

FINAL VERDICT: [ACCEPT / UNCERTAIN / REJECT / ESCALATE]
```

---

## 4.6 Update Frontmatter

**Execute:**

```yaml
verdict: [ACCEPT / UNCERTAIN / REJECT / ESCALATE]
confidence: [HIGH / MEDIUM / LOW]
escalation:
  needed: [true / false]
  triggers: [list of triggers if needed]
  reason: "[explanation if needed]"

verdict_summary:
  final_score: [S]
  threshold_applied: "[which threshold rule]"
  validation_checklist: "[which checklist used]"
  confidence_basis: "[brief explanation]"
```

---

## GATE_4: Verdict → Report

**ENFORCEMENT:** ALL items MUST be DONE or SCOPE_REDUCED before proceeding.

Load `data/gate-definitions.yaml` → GATE_4 for complete requirements.

### Gate Checklist

```
[ ] G4.1: Score recalculated from scratch and verified
[ ] G4.2: Score matches frontmatter.currentScore
[ ] G4.3: Verdict determined per decision-thresholds.yaml rules
[ ] G4.4: Verdict validation checklist completed
[ ] G4.5: Confidence assessed (HIGH/MEDIUM/LOW)
[ ] G4.6: Confidence basis documented
[ ] G4.7: Escalation criteria checked
[ ] G4.8: Escalation decision made (if applicable)
[ ] G4.9: Frontmatter updated with verdict, confidence, escalation
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G4.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how affects verdict]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. IF ALL DONE: Output `"GATE_4 PASSED"`
4. IF ANY SCOPE_REDUCED: Output `"GATE_4 PASSED (with scope reductions)"`
5. Proceed to Phase 5.

**ENFORCEMENT:** ALL phases run. NO early exits.

**HALT** — Do NOT load Phase 5 until GATE_4 passes.

---

**END OF PHASE 4**

**Next action:** Load `steps/step-05-report.md`
