---
step: 6
name: "Pattern Candidate Evaluation"
time_estimate: "5-10 minutes"
goal: "Evaluate CRITICAL findings without pattern match for pattern-library inclusion"
requires_completion: [0, 1, 2, 3, 4, 5]
optional: true
trigger: "Deep mode AND CRITICAL finding survived Phase 3 without pattern match"
next_steps: null
gate: "GATE_6"
data_dependencies:
  - "../deep-verify/data/pattern-update-protocol.yaml"
  - "../deep-verify/data/pattern-library.yaml"
---

# Phase 6: Pattern Candidate Evaluation (Deep Mode Only)

## ENFORCEMENT RULES

```
1. This phase activates ONLY in Deep mode with unmatched CRITICAL findings.
2. LOAD data files BEFORE evaluation.
3. Distinguish IMPOSSIBILITY from INCOMPLETENESS — only impossibilities qualify.
4. ALL five significance questions must be answered YES to proceed.
5. Self-challenge is MANDATORY — attempt to break proposed pattern.
6. COMPLETE binding checklist before GATE_6.
```

---

## 6.0 Load Required Data

**Execute:**

1. Read `../deep-verify/data/pattern-update-protocol.yaml` → `significance_checklist`, `proposal_template`
2. Read `../deep-verify/data/pattern-library.yaml` → check for existing coverage

```
Data loaded:
  [ ] pattern-update-protocol.yaml
  [ ] pattern-library.yaml
```

> **HALT** — Confirm data loaded.

---

## 6.1 Identify Pattern Candidates

**Execute:** Review findings from completed verification.

```
For each finding with severity >= IMPORTANT AND survived_phase3 = true:

  Finding: F[N] — [description]
  Severity: [CRITICAL / IMPORTANT]
  Quote: "[exact text]"
  Method: #[N]
  Pattern match: [Yes / No]

  If pattern match = No → POTENTIAL CANDIDATE
```

```
Candidates identified:
  1. F[N] — ________________________________
  2. F[N] — ________________________________
```

---

## 6.2 Existing Pattern Coverage Check

**Execute for each candidate:**

```
Candidate: F[N] — [description]

Check EACH existing pattern category:
  [ ] definitional_contradictions (DC-001 to DC-004): Match? ________
  [ ] theorem_violations (TV-001 to TV-005): Match? ________
  [ ] statistical_impossibilities (SI-001 to SI-004): Match? ________
  [ ] regulatory_contradictions (RC-001 to RC-003): Match? ________
  [ ] ungrounded_core_concepts (UG-001 to UG-003): Match? ________

RESULT:
  [ ] Existing pattern covers this → DO NOT propose new. Suggest expanding: _____
  [ ] No existing pattern covers this → Proceed to 6.3
```

> **HALT** — Complete for each candidate.

---

## 6.3 Significance Pre-Check

**ENFORCEMENT:** Pattern Library contains IMPOSSIBILITIES, not INCOMPLETENESS.

```
Classification:
  [ ] IMPOSSIBILITY (X contradicts Y by theorem/definition) → proceed
  [ ] INCOMPLETENESS (missing details about X) → STOP — not pattern material
```

**Answer ALL five questions (ALL must be YES to proceed):**

```
Candidate: F[N] — [description]

[ ] 1. Pattern likely to appear in future artifacts (not one-off)?
       Answer: ________________________________

[ ] 2. Detecting this early would change a verdict direction?
       Answer: ________________________________

[ ] 3. Grounded in theorem, definition, regulation, or statistical proof?
       Type: [ ] THEOREM  [ ] DEFINITION  [ ] REGULATION  [ ] STATISTICAL
       Answer: ________________________________

[ ] 4. Existing patterns do NOT already cover this case?
       Answer: ________________________________

[ ] 5. Signal keywords won't match valid artifacts?
       Proposed signals: ________________________________
       Answer: ________________________________

ALL YES? [ ] Yes → Proceed to 6.4
          [ ] No → STOP. Document as "potential future pattern" only.
```

---

## 6.4 Draft Pattern Proposal

**Execute:** Fill proposal template.

```yaml
proposal:
  proposed_date: "[today ISO]"
  source: "deep-verify-v2"
  source_artifact: "[artifact name]"
  source_finding_id: "[F_id]"
  status: "PROPOSED"

  pattern:
    id: "[CATEGORY-NNN]"
    category: "[category]"
    name: "[descriptive name]"
    type: "[THEOREM / DEFINITION / REGULATION / STATISTICAL / HEURISTIC]"
    signals: ["keyword1", "keyword2"]
    why_impossible: "[explanation]"
    theorem: "[if applicable]"
    theorem_source: "[if applicable]"
    exception: "[if applicable — known valid exception to the impossibility]"
    severity: "[CRITICAL / IMPORTANT]"
    detection_methods: ["[NNN_Method.md]"]
    check: "[yes/no verification question]"
    falsified_if: "[what would disprove this pattern]"
```

---

## 6.5 Self-Challenge (Mandatory)

**Execute:** Attempt to construct a counterexample that breaks the proposed pattern.

```
Pattern claim: "[what the pattern says is impossible]"

Counterexample attempt 1:
  Construction: ________________________________
  Result: [ ] Breaks pattern  [ ] Fails (pattern holds)

Counterexample attempt 2:
  Construction: ________________________________
  Result: [ ] Breaks pattern  [ ] Fails (pattern holds)

If counterexample breaks pattern:
  [ ] Add exception and refine pattern
  [ ] Abandon pattern — not a true impossibility

If no counterexample possible:
  Explanation: ________________________________
```

---

## 6.6 Signal Specificity Check

**Execute:** Test signals against valid artifacts.

```
Apply signals to 3 VALID artifacts mentally:

  Valid artifact 1 (same domain, no issues):
    Would signals match? [ ] Yes (refine) [ ] No (good)

  Valid artifact 2 (similar domain, no issues):
    Would signals match? [ ] Yes (refine) [ ] No (good)

  Valid artifact 3 (different domain, similar keywords):
    Would signals match? [ ] Yes (refine) [ ] No (good)

If ANY match valid: narrow signals and re-check.
```

---

## 6.7 Recommendation

```
Pattern candidate: [name]

Recommendation:
  [ ] VALIDATED — Add to pattern-library.yaml
  [ ] PROVISIONAL — Add with PROVISIONAL status (promote after 5+ matches)
  [ ] DEFERRED — Needs more evidence
  [ ] REJECTED — Does not meet criteria

Reason: ________________________________
```

---

## 6.8 Output Pattern Candidate Report

```
═══════════════════════════════════════════════════════════════
PATTERN CANDIDATE REPORT
═══════════════════════════════════════════════════════════════

Source: Deep Verify V2.0 report for [artifact]
Finding: F[N] — [description]
Date: [ISO]

PROPOSED PATTERN:
  Name: [name]
  Category: [category]
  Type: [type]
  Severity: [severity]
  Signals: [list]
  Why impossible: [explanation]
  Check: [question]
  Falsified if: [condition]

VERIFICATION:
  Significance: PASSED (5/5)
  Counterexample: [IMPOSSIBLE / FOUND_WITH_EXCEPTION]
  Signal specificity: [PASSED / REFINED]

RECOMMENDATION: [VALIDATED / PROVISIONAL / DEFERRED / REJECTED]

ACTION REQUIRED:
  [ ] Human review before adding to pattern-library.yaml
  [ ] Add with status field
  [ ] Track in calibration.yaml
═══════════════════════════════════════════════════════════════
```

---

## BINDING CHECKLIST — Phase 6

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 6 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] All candidates identified                      Status: ____   │
│  [ ] Existing coverage checked                      Status: ____   │
│  [ ] Significance pre-check completed               Status: ____   │
│  [ ] Counterexample attempted                       Status: ____   │
│  [ ] Signal specificity verified                    Status: ____   │
│  [ ] Recommendation documented                      Status: ____   │
│  [ ] Pattern Candidate Report output                Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_6: Pattern Candidate → Workflow Complete

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_6: PATTERN CANDIDATE COMPLETE → WORKFLOW END                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] All candidates evaluated                       Status: ____   │
│  [ ] Phase 6 checklist ALL items addressed          Status: ____   │
│                                                                     │
│  GATE_6 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3, 4, 5, 6]
currentStep: null
completed: "[ISO timestamp]"
pattern_candidates:
  - finding_id: "[F_id]"
    proposed_pattern: "[name]"
    recommendation: "[VALIDATED / PROVISIONAL / DEFERRED / REJECTED]"
    added_to_library: false
```

---

## Workflow Complete

The Deep Verify V2.0 workflow is now complete.

