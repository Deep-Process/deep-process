---
step: 2
name: "Targeted Verification"
time_estimate: "10-35 minutes"
goal: "Select and execute Tier 2 methods based on Phase 1 signals, assign severity, counter-check findings"
requires_completion: [0, 1]
next_steps:
  DEFAULT: "steps/step-03-adversarial.md"
gate: "GATE_2"
data_dependencies:
  - "data/methods.csv"
  - "data/method-clusters.yaml"
  - "data/severity-scoring.yaml"
  - "data/pattern-library.yaml"
outputs:
  - findings (with severity)
  - currentScore (updated)
  - methodsExecuted (updated)
  - counter_checks
---

# Phase 2: Targeted Verification

## ENFORCEMENT RULES

```
1. THIS IS WHERE SEVERITY ASSIGNMENT HAPPENS. Not before.
2. Select Tier 2 methods based on Phase 1 signals. Not random.
3. Quick: minimum 1 method. Standard: 2-3. Deep: 3-4.
4. Execute selected methods following procedures.
5. ASSIGN SEVERITY to each finding (CRITICAL/IMPORTANT/MINOR).
6. COUNTER-CHECK every CRITICAL/IMPORTANT finding.
7. Update score AFTER each method.
8. MANDATORY quotes. NO QUOTE = NO FINDING.
9. COMPLETE binding checklist before GATE_2.
10. NO early exits. ALL phases run.
```

---

## 2.0 Load Required Data

**Execute these steps in this order:**

1. Read `data/methods.csv` → full method catalog
2. Read `data/method-clusters.yaml` → cluster definitions, signal mappings
3. Read `data/severity-scoring.yaml` → severity rules, scoring formulas
4. Read `data/pattern-library.yaml` → pattern matching

```
Data loaded:
  [ ] methods.csv — method catalog loaded
  [ ] method-clusters.yaml — clusters and signals loaded
  [ ] severity-scoring.yaml — severity rules loaded
  [ ] pattern-library.yaml — [count] patterns loaded
```

> **HALT** — Confirm all 4 data files loaded. Do NOT proceed without all.

---

## 2.1 Analyze Phase 1 Signals

**Review Phase 1 results to identify signals:**

```
Phase 1 Summary:
  Tier 1 findings: [count]
  Initial score (S): [value]
  Claims extracted: [count]
  Terms extracted: [count]
  Hypotheses generated: [count]

Primary signals detected (check all that apply):

[ ] ABSOLUTE_CLAIMS
    Evidence: Guarantees, "always", "never", "100%", "perfect" found
    → Recommend: #153 (Theoretical Impossibility), #154 (Definitional Contradiction)

[ ] STRUCTURAL_COMPLEXITY
    Evidence: Multiple subsystems, complex dependencies, circular refs
    → Recommend: #116 (Strange Loop Detection), #86 (Topological Holes), #159 (Transitive Dependency)

[ ] UNGROUNDED_CLAIMS
    Evidence: Assertions without justification, missing evidence
    → Recommend: #85 (Grounding Check), #78 (Assumption Excavation), #130 (Assumption Torture)

[ ] VOCABULARY_ISSUES
    Evidence: Synonyms, homonyms, undefined terms from Phase 1
    → Recommend: #100 already executed, consider #109 (Contraposition)

[ ] CAUSATION_CLAIMS
    Evidence: "causes", "leads to", "results in" claims
    → Recommend: #165 (Constructive Counterexample), #162 (Theory Dependence)

[ ] DIFFUSE_BELIEF / CLEAN_PHASE1
    Evidence: General unease or all Tier 1 passed
    → Recommend: #84 (Coherence), #109 (Contraposition), #87 (Falsifiability)
```

> **HALT** — Confirm signals identified.

---

## 2.2 Method Selection

**Execute based on execution mode:**

### Quick Mode: Select 1 method

1. Pick the MOST relevant method for strongest signal.
2. Record selection:

```
Selected methods:
  - #[num]: [method name] — [reason for selection]
```

### Standard Mode: Select 2-3 methods

1. Pick 2-3 methods matching detected signals.
2. Respect cluster rules: Max 2 from same cluster.
3. Record selection:

```
Selected methods:
  - #[num]: [method name] — [reason]
  - #[num]: [method name] — [reason]
  - #[num]: [method name] — [reason] (optional)
```

### Deep Mode: Select 3-4 methods

1. Pick 3-4 methods covering multiple signal types.
2. Respect cluster rules: Max 2 from same cluster.
3. Record selection:

```
Selected methods:
  - #[num]: [method name] — [reason]
  - #[num]: [method name] — [reason]
  - #[num]: [method name] — [reason]
  - #[num]: [method name] — [reason] (optional)
```

> **HALT** — Confirm method selection.

---

## 2.3 Execute Selected Methods

**For EACH selected method:**

1. Load procedure file: `data/method-procedures/[num]_[Name].md`
2. Read procedure step-by-step
3. Execute procedure on artifact
4. Record findings with QUOTES
5. Proceed to 2.4 for severity assignment

---

### Template for Method Execution

```
METHOD #[num]: [Method Name]

Load: data/method-procedures/[num]_[Name].md

Execute procedure from file.

Findings:
  F[N]:
    method: [num]
    quote: "[exact text from artifact]"
    location: [line/section]
    description: "[what the finding is]"
    # Severity assigned in 2.4

  # ... for each finding

Clean pass: [ ] Yes (no findings)  [ ] No (findings recorded)
```

> **HALT** — Complete current method before next.

---

## 2.4 Severity Assignment

**ENFORCEMENT: This is the FIRST place severity is assigned.**

For EACH finding from 2.3:

1. Load `data/severity-scoring.yaml`
2. Apply severity rules:

```
SEVERITY ASSESSMENT for F[N]:

Finding: "[description]"
Quote: "[exact text]"

Severity determination:
  [ ] CRITICAL (+3 points)
      Triggers: Fundamental flaw, impossibility, definitional contradiction,
               violates known theorem/law, makes artifact unusable

  [ ] IMPORTANT (+1 point)
      Triggers: Significant issue, requires attention, affects core claims,
               introduces ambiguity in critical areas

  [ ] MINOR (+0.3 points)
      Triggers: Worth noting, not blocking, cosmetic, affects non-critical areas

Assigned severity: [CRITICAL / IMPORTANT / MINOR]
Base score contribution: [+3 / +1 / +0.3]
```

3. Check pattern match:

```
Pattern check:
  Pattern match: [pattern ID or null]
  Pattern bonus: [+1 if match, else 0]

Total score for this finding: [base + pattern bonus]
```

4. Update finding record:

```yaml
findings:
  - id: F[N]
    method: [num]
    quote: "[exact text]"
    location: [line/section]
    description: "[what]"
    severity: [CRITICAL/IMPORTANT/MINOR]
    score: [points]
    pattern_match: [pattern ID or null]
```

> **HALT** — Confirm severity assigned to all findings from current method.

---

## 2.5 Counter-Checks

**TRIGGER:** Every CRITICAL or IMPORTANT finding.

**ENFORCEMENT: This is MANDATORY for all CRITICAL/IMPORTANT findings.**

For each CRITICAL/IMPORTANT finding:

### Step 1: State the finding

```
Finding F[N]:
  Severity: [CRITICAL/IMPORTANT]
  Claim: "[description]"
  Evidence: "[quote]"
```

### Step 2: Generate counter-hypothesis

```
Counter-hypothesis:
  "What if this finding is wrong because..."

  Possible alternative explanations:
  1. ________________________________
  2. ________________________________
  3. ________________________________
```

### Step 3: Test counter-hypothesis

```
Test against artifact:
  Re-read context around finding quote.
  Look for evidence that contradicts the finding.
  Look for evidence that supports counter-hypothesis.

Evidence for counter-hypothesis:
  [ ] Found: "[quote supporting counter]"
  [ ] Not found

Evidence against counter-hypothesis:
  [ ] Found: "[quote refuting counter]"
  [ ] Not found
```

### Step 4: Conclusion

```
COUNTER-CHECK RESULT for F[N]:

Conclusion:
  [ ] FINDING_SURVIVES — Counter-hypothesis refuted, finding stands
  [ ] FINDING_WITHDRAWN — Counter-hypothesis confirmed, finding removed
  [ ] FINDING_DOWNGRADED — Finding partially refuted, severity reduced

If WITHDRAWN:
  - Remove finding from list
  - Subtract score contribution

If DOWNGRADED:
  - Update severity: [new severity]
  - Update score: [new score]
  - Document reason: "[why downgraded]"

If SURVIVES:
  - Keep finding as-is
  - Document counter-check: "[how it survived]"
```

> **HALT** — Complete counter-check before next finding.

---

## 2.6 Update Score

**After ALL methods executed and counter-checks complete:**

```
SCORE UPDATE:

Findings after counter-checks: [count]
  CRITICAL: [count] × 3 = [points]
  IMPORTANT: [count] × 1 = [points]
  MINOR: [count] × 0.3 = [points]

Pattern bonuses: [count] × 1 = [points]
Clean method passes: [count] × -0.5 = [points]

Updated Score (S): [total]
```

**Update frontmatter:**

```yaml
currentScore: [S]
methodsExecuted: [71, 100, 17, ...Tier 2 methods...]
findings: [all findings with severity]
counter_checks: [all counter-check results]
```

---

## GATE_2: Targeted Verification → Adversarial

**ENFORCEMENT:** ALL items MUST be DONE or SCOPE_REDUCED before proceeding.

Load `data/gate-definitions.yaml` → GATE_2 for complete requirements.

### Gate Checklist

```
[ ] G2.1: Tier 2 methods selected based on signals (not random)
[ ] G2.2: Minimum methods executed per mode (Quick: 1, Standard: 2-3, Deep: 3-4)
[ ] G2.3: ALL findings have quotes (NO QUOTE = NO FINDING)
[ ] G2.4: ALL findings have severity assigned (CRITICAL/IMPORTANT/MINOR)
[ ] G2.5: ALL CRITICAL/IMPORTANT findings counter-checked
[ ] G2.6: Counter-check results documented (SURVIVES/WITHDRAWN/DOWNGRADED)
[ ] G2.7: Score updated after all methods and counter-checks
[ ] G2.8: Pattern matches checked for all findings
[ ] G2.9: Clean method passes recorded (if any)
[ ] G2.10: Frontmatter updated with findings and score
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G2.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how affects verification]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. IF ALL DONE: Output `"GATE_2 PASSED"`
4. IF ANY SCOPE_REDUCED: Output `"GATE_2 PASSED (with scope reductions)"`
5. Proceed to Phase 3.

**ENFORCEMENT:** ALL phases run. NO early exits based on score.

**HALT** — Do NOT load Phase 3 until GATE_2 passes.

---

**END OF PHASE 2**

**Next action:** Load `steps/step-03-adversarial.md`
