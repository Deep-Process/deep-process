---
step: 2
name: "Verification"
time_estimate: "15-40 minutes"
goal: "Apply methods to extracted data, create findings with severity, score, counter-check"
requires_completion: [0, 1]
next_steps:
  DEFAULT: "steps/step-03-adversarial.md"
gate: "GATE_2"
data_dependencies:
  - "../deep-verify/data/methods.csv"
  - "../deep-verify/data/method-clusters.yaml"
  - "../deep-verify/data/severity-scoring.yaml"
  - "../deep-verify/data/pattern-library.yaml"
  - "../deep-verify/data/decision-thresholds.yaml"
outputs:
  - findings
  - currentScore
  - patternsMatched
  - methodsExecuted
  - counter_checks
---

# Phase 2: Verification

## ENFORCEMENT RULES

```
1. LOAD ALL data files BEFORE any analysis. No exceptions.
2. Execute ALL Tier 1 methods. No skipping, no shortcuts.
3. Select and execute Tier 2 methods based on Phase 1 extraction signals.
4. Quick mode: minimum 1 Tier 2 method. Standard/Deep: minimum 2, maximum 4.
5. For every CRITICAL/IMPORTANT finding: generate and test COUNTER-HYPOTHESIS.
6. Update score AFTER EACH method.
7. MANDATORY quotes for every finding. NO QUOTE = NO FINDING.
8. COMPLETE the binding checklist before GATE_2.
```

**THIS is where severity judgments happen. NOT before.**

---

## 2.0 Load Required Data

**Execute these steps in this order:**

1. Read `../deep-verify/data/methods.csv` → Find rows: num=71, num=100, num=17 (Tier 1)
2. Read `../deep-verify/data/method-clusters.yaml` → Load cluster definitions, signal mapping
3. Read `../deep-verify/data/severity-scoring.yaml` → Load base_scoring, bonus_rules
4. Read `../deep-verify/data/decision-thresholds.yaml` → Load evidence_thresholds
5. Read `../deep-verify/data/pattern-library.yaml` → Load for pattern matching

```
Data loaded:
  [ ] methods.csv — Tier 1 methods found: #71, #100, #17
  [ ] method-clusters.yaml — [count] clusters loaded
  [ ] severity-scoring.yaml — scoring rules loaded
  [ ] decision-thresholds.yaml — thresholds loaded
  [ ] pattern-library.yaml — [count] patterns loaded
```

> **HALT** — Confirm ALL 5 data files loaded. Do NOT proceed without all.

---

## 2.1 Execute Tier 1 Methods

**Execute ALL three Tier 1 methods on the EXTRACTED DATA from Phase 1.**

The input is the claims, terms, and structure extracted in Phase 1. The methods VERIFY this data against the artifact.

---

### Method #71: First Principles Analysis

**Execute these steps in this order:**

1. Take the claims_extracted list from Phase 1.
2. For each GUARANTEE and CAPABILITY claim:
   a. Identify what fundamentals MUST be true for this claim to hold.
   b. Check: are these fundamentals explicitly stated in the artifact?
   c. Check: are these fundamentals consistent with known constraints (theorems, physical limits, logical requirements)?
   d. Check: do any fundamentals contradict each other?
3. Record results:

```
METHOD #71 RESULTS:
  Claims examined: [count]
  Fundamentals identified: [count]

  For each problematic claim:
    CLAIM: C[N] — "[exact quote]"
    FUNDAMENTAL MISSING/VIOLATED: "[description]"
    EVIDENCE: "[quote from artifact showing the gap/violation]"

  Clean pass: [ ] Yes (no issues found)  [ ] No (issues found)
```

4. IF issues found → create FINDING (see 2.4).
5. IF clean pass → record clean pass.

> **HALT** — Complete #71 before proceeding to #100.

---

### Method #100: Vocabulary Consistency

**Execute these steps in this order:**

1. Take the terms_extracted list from Phase 1.
2. For each POTENTIAL SYNONYM pair flagged in Phase 1:
   a. Read both terms in context.
   b. Determine: are they truly the same concept? Provide evidence.
   c. If YES: this is a vocabulary inconsistency.
3. For each POTENTIAL HOMONYM flagged in Phase 1:
   a. Read the term in each location.
   b. Determine: does it truly mean different things? Provide evidence.
   c. If YES: this is a vocabulary ambiguity.
4. For each UNDEFINED TERM from Phase 1:
   a. Is this term central to the artifact's value proposition?
   b. If YES and undefined: this is a potential ungrounded core concept.
5. Record results:

```
METHOD #100 RESULTS:
  Terms examined: [count]
  Synonym pairs confirmed: [count]
  Homonym pairs confirmed: [count]
  Undefined critical terms: [count]

  For each confirmed issue:
    TERM: "[term]"
    ISSUE: [SYNONYM / HOMONYM / UNDEFINED_CRITICAL]
    EVIDENCE: "[quote 1 at location A]" vs "[quote 2 at location B]"

  Clean pass: [ ] Yes  [ ] No
```

6. IF issues found → create FINDING (see 2.4).
7. IF clean pass → record clean pass.

> **HALT** — Complete #100 before proceeding to #17.

---

### Method #17: Abstraction Laddering

**Execute these steps in this order:**

1. Take the structure_extracted from Phase 1.
2. Check vertical coherence:
   a. For each HIGH-level promise: is there a MID-level explanation of HOW?
   b. For each MID-level design: is there a LOW-level specification of WHAT exactly?
   c. For each LOW-level detail: does it connect to a higher-level goal?
3. Identify gaps:
   a. HIGH promises with no MID explanation = ABSTRACTION GAP
   b. LOW details with no higher connection = ORPHAN DETAIL
   c. MID designs with no LOW specification = UNGROUNDED DESIGN
4. Record results:

```
METHOD #17 RESULTS:
  Abstraction levels present: [HIGH / MID / LOW]
  Vertical coherence: [ ] Full  [ ] Partial  [ ] Broken

  Gaps found:
    ABSTRACTION GAP: "[HIGH claim]" has no MID explanation
      Evidence: "[quote]" at [location]
    ORPHAN DETAIL: "[LOW detail]" connects to no higher goal
      Evidence: "[quote]" at [location]
    UNGROUNDED DESIGN: "[MID design]" has no LOW specification
      Evidence: "[quote]" at [location]

  Clean pass: [ ] Yes  [ ] No
```

5. IF issues found → create FINDING (see 2.4).
6. IF clean pass → record clean pass.

> **HALT** — Complete #17 before proceeding to Tier 2 selection.

---

## 2.2 Tier 2 Method Selection

**Execute these steps in this order:**

### Step 1: Review Phase 1 signals

```
Phase 1 extraction signals:
  Pattern signals (strong): [list from Phase 1]
  Pattern signals (weak): [list from Phase 1]
  Claims with GUARANTEE type: [count]
  Undefined terms: [count]
  Dead references: [count]
  Circular references: [count]
  Abstraction gaps: [count from #17]
  Vocabulary issues: [count from #100]

Tier 1 results:
  #71 First Principles: [Clean / Finding]
  #100 Vocabulary: [Clean / Finding]
  #17 Abstraction: [Clean / Finding]
```

### Step 2: Map signals to clusters

Read `../deep-verify/data/method-clusters.yaml` → `signal_to_cluster_mapping`.

```
Signal → Cluster mapping:
  [ ] ABSOLUTE_CLAIMS detected → theory cluster (#153, #154, #163)
  [ ] STRUCTURAL_COMPLEXITY detected → structure cluster (#116, #86, #159)
  [ ] UNGROUNDED_CLAIMS detected → grounding cluster (#85, #78, #130)
  [ ] DIFFUSE_BELIEF → mix (#84, #109, #165)
  [ ] CLEAN_TIER1 → hidden issues (#78, #109, #86)

Primary signal: ________________________________
```

### Step 3: Select methods

```
Mode-based minimum:
  Quick: 1 Tier 2 method minimum
  Standard: 2-4 Tier 2 methods
  Deep: 2-4 Tier 2 methods (+ more thorough execution)

Selected methods:
1. #_____ _____________________ (cluster: _____) — Reason: _____
2. #_____ _____________________ (cluster: _____) — Reason: _____
3. #_____ _____________________ (cluster: _____) — Reason: _____ [if applicable]
4. #_____ _____________________ (cluster: _____) — Reason: _____ [if applicable]

Cluster constraint check:
  [ ] No cluster has 3+ methods selected
  [ ] If first from cluster found nothing, rest of cluster skipped (after execution)
```

> **HALT** — Confirm method selection before execution.

---

## 2.3 Execute Tier 2 Methods

**For each selected method:**

1. Read method procedure from `../deep-verify/data/method-procedures/[NUM]_[Name].md`
2. Execute the procedure against the Phase 1 extraction data AND the original artifact.
3. Record results using the execution template.
4. IF issues found → create FINDING (see 2.4).
5. Update score after EACH method.

### Method Execution Template

```
METHOD #[N]: [Name]
  WHY SELECTED: [signal that triggered]
  LOOKING FOR: [specific thing that would change belief]

  CLAIMS EXAMINED:
    1. C[N]: "[quote]" (line ___) — tested for [what]
    2. C[N]: "[quote]" (line ___) — tested for [what]
    3. C[N]: "[quote]" (line ___) — tested for [what]

  EXECUTION STEPS:
    [Follow the procedure file step by step]

  RESULTS:
    [ ] CLEAN PASS — No issues found
    [ ] FINDING — Issue(s) detected (record in 2.4)

  DIRECTION: [ ] Toward REJECT  [ ] Toward ACCEPT  [ ] Neutral
```

**After each method, update score:**

```
S before method #___: _____
Adjustment: _____ ([clean pass -0.5 / finding +severity / pattern +1 / confirmation +1])
S after method #___: _____
```

> **HALT** — Complete each method fully before starting the next.

---

## 2.4 Finding Creation

**ENFORCEMENT:** This is the ONLY place where findings are created.

For EACH issue discovered by a method, create a finding:

```
FINDING F[N]:
  description: "[description]"
  quote: "[EXACT text from artifact — MANDATORY]"
  location: [line number / section]
  method: #[N] [name]
  pattern_match: [pattern_id from pattern-library.yaml, or "None"]
  severity: [CRITICAL / IMPORTANT / MINOR]

  SEVERITY ASSIGNMENT (execute this decision process):
    1. Read severity-scoring.yaml → severity_anchoring_guide
    2. For CRITICAL: "Does this finding ALONE justify REJECT?"
       [ ] Yes → CRITICAL (+3)
       [ ] No → continue
    3. For IMPORTANT: "Would 2-3 of these together justify REJECT?"
       [ ] Yes → IMPORTANT (+1)
       [ ] No → continue
    4. For MINOR: "Does this only matter if other problems exist?"
       [ ] Yes → MINOR (+0.3)

  PATTERN CHECK (execute for every finding):
    1. Read pattern-library.yaml
    2. Check against each category:
       [ ] definitional_contradictions
       [ ] theorem_violations
       [ ] statistical_impossibilities
       [ ] regulatory_contradictions
       [ ] ungrounded_core_concepts
    3. Pattern match found: [ ] Yes → +1 bonus  [ ] No
```

**ENFORCEMENT:** If `quote` is empty → DISCARD the finding. It is VOID.

---

## 2.5 Counter-Check on Key Claims

**ENFORCEMENT:** Every CRITICAL and IMPORTANT finding MUST have a counter-check.

For each finding with severity >= IMPORTANT:

```
COUNTER-CHECK CC[N]:
  finding: F[N]
  finding_claim: "[what the finding asserts]"

  COUNTER-HYPOTHESIS:
    statement: "This finding is FALSE because _______________"
    what_must_be_true: "[conditions for counter-hypothesis to hold]"

  COUNTER-TEST:
    method: "[how to test — re-read artifact, check domain knowledge, logical analysis]"
    execution: "[actually do the test — describe what you did]"

  COUNTER-RESULT:
    [ ] COUNTER HOLDS → Finding is likely false. Downgrade to MINOR or REMOVE.
        Evidence: "________________________________"
    [ ] COUNTER FAILS → Finding stands. Counter-hypothesis disproven.
        Evidence: "________________________________"
    [ ] INCONCLUSIVE → Flag for Phase 3 adversarial review.
        Why: "________________________________"
```

**ENFORCEMENT:** A CRITICAL finding without a tested counter-check MUST be downgraded to IMPORTANT until Phase 3 reviews it.

---

## 2.6 Method Agreement Check

**Execute after all methods completed:**

```
METHODS AGREEMENT:
  Phase 2 methods executed:
    1. #_____ _____________________ — Direction: _____
    2. #_____ _____________________ — Direction: _____
    3. #_____ _____________________ — Direction: _____ [if executed]
    4. #_____ _____________________ — Direction: _____ [if executed]

  ALL methods (Tier 1 + Tier 2):
    Toward REJECT: _____/[total] methods
    Toward ACCEPT: _____/[total] methods
    Neutral: _____/[total] methods

  Agreement:
    [ ] Strong (4+ methods same direction)
    [ ] Moderate (3 methods same direction)
    [ ] Weak (2 methods same direction)
    [ ] Disagreement (methods conflict)

  LOG HYPOTHESIS if Disagreement:
    H[N]: "Methods disagree because _______________"
    evidence_for: "Methods [X] suggest [direction] because ___"
    evidence_against: "Methods [Y] suggest [opposite] because ___"
    status: UNTESTED (flag for Phase 3)
```

---

## 2.7 Score Consolidation

```
═══════════════════════════════════════════════════════════════
PHASE 2 SCORE CONSOLIDATION
═══════════════════════════════════════════════════════════════

Tier 1 Results:
  #71 First Principles:
    [ ] Clean pass: -0.5
    [ ] Finding(s): [count] × [severity points] = _____
  #100 Vocabulary:
    [ ] Clean pass: -0.5
    [ ] Finding(s): [count] × [severity points] = _____
  #17 Abstraction:
    [ ] Clean pass: -0.5
    [ ] Finding(s): [count] × [severity points] = _____

Tier 2 Results:
  #_____ [Name]:
    [ ] Clean pass: -0.5
    [ ] Finding(s): [count] × [severity points] = _____
  [Repeat for each Tier 2 method]

Bonuses:
  Pattern matches: [count] × +1 = _____
  Confirmations (different cluster): [count] × +1 = _____

Counter-check adjustments:
  Findings removed by counter-check: [count] (-[points])
  Findings downgraded by counter-check: [count] (-[points])

───────────────────────────────────────────────────────────────
CURRENT S = _____
═══════════════════════════════════════════════════════════════
```

---

## BINDING CHECKLIST — Phase 2

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] ALL Tier 1 methods executed (#71, #100, #17)   Status: ____   │
│  [ ] Tier 2 methods selected based on signals       Status: ____   │
│  [ ] Tier 2 methods executed (min 1 Quick / 2 Std)  Status: ____   │
│  [ ] Cluster rules respected (no 3+ from same)      Status: ____   │
│  [ ] ALL findings have exact quotes                 Status: ____   │
│  [ ] ALL findings have severity assigned            Status: ____   │
│  [ ] Pattern Library checked for EACH finding       Status: ____   │
│  [ ] Counter-check done for EACH CRITICAL/IMPORTANT Status: ____   │
│  [ ] Score calculated and consolidated              Status: ____   │
│  [ ] Method agreement assessed                      Status: ____   │
│  [ ] Frontmatter updated                            Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_2: Verification → Adversarial

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_2: VERIFICATION COMPLETE → ADVERSARIAL                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] ALL Tier 1 methods executed                    Status: ____   │
│  [ ] Tier 2 methods executed per mode requirement   Status: ____   │
│  [ ] ALL findings have quotes (no quote=no finding) Status: ____   │
│  [ ] ALL CRITICAL/IMPORTANT counter-checked         Status: ____   │
│  [ ] Score S = _____ calculated correctly            Status: ____   │
│  [ ] Phase 2 checklist ALL items addressed          Status: ____   │
│  [ ] Frontmatter updated with findings + score      Status: ____   │
│                                                                     │
│  GATE_2 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**IF GATE_2 PASSED:** Load `steps/step-03-adversarial.md`
**IF GATE_2 FAILED:** Complete missing items. Do NOT proceed.

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2]
currentStep: 3
currentScore: [calculated S]
scoreHistory:
  - step: 2
    methods: [list of all method IDs]
    delta: "[calculation details]"
    total: [S]
findings:
  - id: F1
    severity: [CRITICAL/IMPORTANT/MINOR]
    description: "[description]"
    quote: "[exact text]"
    location: "[line/section]"
    pattern: "[pattern_id or null]"
    method: [method_num]
    counter_checked: [true/false]
    counter_result: [HOLDS/FAILS/INCONCLUSIVE]
    survived_phase3: null
  # ...
methodsExecuted:
  - method_id: [N]
    name: "[name]"
    tier: [1/2]
    result: [Clean/Finding]
    selected_because: "[signal or 'Tier 1 mandatory']"
counter_checks:
  - id: CC1
    finding: F1
    counter_hypothesis: "..."
    counter_result: [HOLDS/FAILS/INCONCLUSIVE]
```

