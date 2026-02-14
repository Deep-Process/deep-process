---
step: 6
name: "Pattern Candidate Evaluation"
time_estimate: "5-10 minutes"
goal: "Evaluate CRITICAL findings without pattern match for new pattern library entries"
requires_completion: [0, 1, 2, 3, 4, 5]
optional: true
trigger: "Deep Mode only - CRITICAL findings without pattern match"
next_steps: null
gate: "GATE_6"
data_dependencies:
  - "data/pattern-update-protocol.yaml"
  - "data/pattern-library.yaml"
outputs:
  - pattern_candidates
---

# Phase 6: Pattern Candidate Evaluation

## ⚠️ OPTIONAL - Deep Mode Only

**This phase runs ONLY when:**
- Execution mode = Deep
- At least ONE CRITICAL finding survived Phase 3
- That finding has NO pattern match

**Otherwise:** SKIP this phase. Verification complete.

---

## ENFORCEMENT RULES

```
1. OPTIONAL phase. Only Deep mode.
2. Only evaluate CRITICAL findings without pattern match.
3. Check existing patterns first (avoid duplicates).
4. Use significance checklist from pattern-update-protocol.yaml.
5. Propose pattern only if passes ALL significance checks.
6. COMPLETE binding checklist before GATE_6.
```

---

## 6.0 Check Activation

**Execute:**

```
Activation Check:
  [ ] Mode = Deep?
  [ ] CRITICAL findings exist?
  [ ] Any CRITICAL without pattern match?

If ALL Yes: Continue to 6.1
If ANY No: SKIP Phase 6 → Verification COMPLETE
```

> **HALT** — Confirm activation or skip.

---

## 6.1 Load Required Data

**If activated, execute:**

1. Read `data/pattern-update-protocol.yaml`
   - Load significance_checklist
   - Load proposal_template
2. Read `data/pattern-library.yaml`
   - Check existing patterns

> **HALT** — Confirm data loaded.

---

## 6.2 Identify Candidates

**Review findings:**

```
For each CRITICAL finding that survived Phase 3:

Finding F[N]:
  Severity: CRITICAL
  Pattern match: [ID or null]

If pattern_match = null:
  → Candidate for pattern evaluation
  → List below

Candidates:
  - F[N]: [description]
  - F[M]: [description]
  ...
```

---

## 6.3 Existing Pattern Check

**For EACH candidate:**

```
Candidate: F[N] — [description]

Check existing pattern categories:
  [ ] Definitional Contradictions: Match? [Yes/No]
  [ ] Theorem Violations: Match? [Yes/No]
  [ ] Statistical Impossibilities: Match? [Yes/No]
  [ ] Regulatory Contradictions: Match? [Yes/No]
  [ ] Ungrounded Core Concepts: Match? [Yes/No]

If existing pattern covers this:
  → Do NOT propose new pattern
  → Note: "Covered by [pattern_id]. Suggest signal expansion: [keywords]"
  → SKIP to next candidate

If NO existing pattern covers:
  → Proceed to 6.4 Significance Check
```

---

## 6.4 Significance Check

**Apply checklist from pattern-update-protocol.yaml:**

```
Candidate: F[N]

Significance Checklist:
  [ ] Grounded in theorem/law/definition (not opinion)?
      Evidence: ________________________________

  [ ] Likely to recur in other artifacts?
      Evidence: ________________________________

  [ ] Detectable through observable signals?
      Keywords: ________________________________

  [ ] Not domain-specific edge case?
      Evidence: ________________________________

  [ ] CRITICAL severity (not just IMPORTANT)?
      Confirmed: [ ] Yes [ ] No

Result:
  [ ] PASS (all checks Yes) → Propose pattern
  [ ] FAIL (any check No) → Do NOT propose
```

---

## 6.5 Pattern Proposal

**If candidate PASSED significance check:**

```yaml
pattern_candidate:
  id: "[Category]-[Next Number]"
  name: "[Descriptive Name]"
  category: "[which category]"

  description: |
    [1-2 sentences: what this pattern detects]

  trigger_signals:
    - "[keyword 1]"
    - "[keyword 2]"
    - "[keyword 3]"

  example_quote: "[quote from F[N] that exemplifies this]"

  grounding:
    type: "[THEOREM / LAW / DEFINITION / REGULATION]"
    reference: "[specific theorem/law name]"

  severity: CRITICAL

  notes: |
    [Any implementation notes for future detection]
```

**Repeat for each candidate that passed.**

---

## 6.6 Output Candidates

**Execute:**

```
PATTERN CANDIDATES PROPOSED: [count]

[For each proposal, output full YAML above]

Next Steps:
  - Human review required before adding to pattern-library.yaml
  - If approved, update pattern-library.yaml with new entries
  - Re-run verification to confirm detection
```

---

## GATE_6: Pattern Candidate → Complete

**ENFORCEMENT:** ALL items MUST be DONE or SCOPE_REDUCED.

Load `data/gate-definitions.yaml` → GATE_6 for complete requirements.

### Gate Checklist

```
[ ] G6.1: Activation check completed (Deep mode + CRITICAL w/o pattern)
[ ] G6.2: All candidates identified
[ ] G6.3: Existing pattern check completed for each
[ ] G6.4: Significance checklist applied to each
[ ] G6.5: Pattern proposals generated (if any passed)
[ ] G6.6: Proposals documented in YAML format
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G6.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how affects pattern library]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. Output `"GATE_6 PASSED - Verification COMPLETE"`

---

**END OF PHASE 6**

**VERIFICATION COMPLETE**
