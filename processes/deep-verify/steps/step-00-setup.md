---
step: 0
name: "Setup + Assumptions Declaration"
time_estimate: "3-8 minutes"
goal: "Configure verification, declare all assumptions, log initial hypotheses"
requires_completion: []
next_steps:
  DEFAULT: "steps/step-01-pattern-scan.md"
gate: "GATE_0"
data_dependencies:
  - "data/decision-thresholds.yaml"
outputs:
  - stakes
  - bias_mode
  - initial_assessment
  - assumptions_declared
  - hypotheses
---

# Phase 0: Setup + Assumptions Declaration

## ENFORCEMENT RULES

```
1. EXECUTE the interaction sequence IN ORDER. Do not skip steps.
2. COMPLETE ASSUMPTIONS_DECLARED before proceeding.
3. LOG every interpretive decision as a HYPOTHESIS.
4. PASS GATE_0 before loading Phase 1.
```

---

## 0.0 Argument Parsing (Internal)

**Execute these steps in this order:**

1. Read the `USER ARGUMENTS` section from the prompt.
2. Scan for flags: `--quick`, `-q`, `--deep`, `--full`.
   - IF flag found: SET `execution_mode` to matching mode.
   - IF no flag found: SET `execution_mode` = null (will ask user).
3. Scan for non-flag strings (does not start with `-`).
   - IF found: SET `artifact` to the string value.
   - IF not found: SET `artifact` = null (will ask user).
4. Record parsed values:

```yaml
parsed:
  execution_mode: [Quick / Standard / Deep / null]
  artifact: [path or null]
  flags_found: [list]
```

---

## 0.1 Verification Mode Selection

**Execute:**

1. Check if `execution_mode` was set in 0.0.
2. IF YES: Output `"Mode: [mode] (selected via flag)"`. Proceed to 0.2.
3. IF NO: Display this exact menu and HALT:

```
Select Verification Mode:
1. Quick Verify (Reduced Tier 2 depth, lighter adversarial)
2. Standard Verify (Full rigor, 2-3 Tier 2 methods)
3. Deep Verify (Maximum rigor + Pattern Candidate evaluation)

NOTE: ALL phases run in every mode. Quick reduces method depth,
not phase count.
```

> **HALT** — Wait for user response. Record selection.

---

## 0.2 Artifact Definition

**Execute:**

1. Check if `artifact` was detected in 0.0.
2. IF YES:
   - Output: `"Target Artifact: [artifact_path]"`
   - Output: `"Is this correct? (Y/N)"`
   - **HALT** — Wait for confirmation.
   - IF Y: proceed to 0.3.
   - IF N: ask for new path.
3. IF NO:
   - Output this exact prompt:

```
1. The Artifact: Provide the PATH to the file/folder to verify.
2. Description: Briefly describe what this artifact is
   (e.g., 'API Spec', 'Auth Module', 'PRD').
```

> **HALT** — Wait for user response. Record artifact path and description.

---

## 0.3 Stakes & Bias Configuration

**Execute:**

0. Load `data/decision-thresholds.yaml` → `stakes_assessment` section. This defines LOW/MEDIUM/HIGH stakes criteria.

1. Display this exact prompt:

```
Configure Stakes & Bias settings, or use DEFAULT?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPLANATION OF SETTINGS:

1. STAKES — Impact of accepting a flawed artifact vs. rejecting a sound one

   LOW: Minor rework, <$10K cost, <1 week delay, reversible changes
        → More lenient thresholds, early ACCEPT allowed (S ≤ -3)

   MEDIUM: Significant rework, $10K-$100K, 1-4 weeks
        → Standard thresholds, balanced rigor

   HIGH: Major damage, >$100K, >1 month, safety/reputation risks
        → Strictest thresholds, UNCERTAIN always escalates
        → NO early ACCEPT (forces full verification)
        → Recommended for production systems, public APIs, safety-critical code

2. BIAS MODE — How to handle pre-existing expectations about the artifact

   Standard: You state your initial impression (Sound/Uncertain/Flawed)
             Used in Quick/Standard modes

   Blind: You do NOT state initial expectations (sets initial_assessment=BLIND)
          Prevents confirmation bias in Deep Mode
          Agent evaluates evidence without knowing your expectations

3. INITIAL ASSESSMENT — Your gut feeling about the artifact (if not Blind)

   Sound: You expect the artifact to be correct/valid
   Uncertain: You're unsure, need verification
   Flawed: You suspect issues exist
   BLIND: No initial assessment (prevents bias)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
- DEFAULT: Uses standard settings for [Selected Mode] (Recommended)
            - Stakes: HIGH
            - Bias Mode: Blind
            - Initial Assessment: BLIND

- CUSTOM: Manually configure each setting based on your context

Your choice? (DEFAULT or CUSTOM)
```

> **HALT** — Wait for user response.

2. IF DEFAULT:
   - Quick/Standard Mode: SET `stakes=MEDIUM`, `bias_mode=Standard`, `initial_assessment=Uncertain`.
   - Deep Mode: SET `stakes=HIGH`, `bias_mode=Blind`, `initial_assessment=BLIND`.
   - Proceed to 0.4.

3. IF CUSTOM:
   - Ask Stakes Assessment: "Which is worse: accepting a flawed artifact, or rejecting a sound one?"
     - Accept flawed is worse → stakes=HIGH
     - Reject sound is worse → stakes=LOW
     - Both equally bad → stakes=MEDIUM
   - Ask Initial Assessment: Sound / Uncertain / Flawed / BLIND
   - Ask Bias Check: Any expectations or pressures?
   - Record all answers. Proceed to 0.4.

---

## 0.4 ASSUMPTIONS_DECLARED

**ENFORCEMENT: This section is MANDATORY. Do not skip.**

Before ANY extraction or analysis, the agent MUST declare all assumptions it is making. This prevents silent interpretive drift.

**Execute these steps in this exact order:**

### Step 1: Artifact Type Assumptions

```
ASSUMPTION_TYPE: artifact_classification
What I assume this artifact IS:
  type: [code / documentation / PRD / architecture / claims / paper / other]
  domain: [web / distributed-systems / ML / security / medical / other]
  maturity: [draft / review-ready / published / production]

Classification basis:
  [ ] STATED_IN_ARTIFACT — artifact explicitly declares its type
  [ ] INFERRED — I inferred from file extension, content, context
  [ ] USER_STATED — user told me in the prompt

If INFERRED → LOG AS HYPOTHESIS:
  H1: "This artifact is a [type] in the [domain] domain"
  evidence_for: "[what I saw that suggests this]"
  evidence_against: "[what might contradict this]"
  confidence: [0.0-1.0]
  status: UNTESTED
```

### Step 2: Scope Assumptions

```
ASSUMPTION_TYPE: scope
What I assume is IN SCOPE for verification:
  1. ________________________________
  2. ________________________________
  3. ________________________________

What I assume is OUT OF SCOPE:
  1. ________________________________
  2. ________________________________

Scope basis:
  [ ] STATED — user explicitly defined scope
  [ ] INFERRED — I inferred from artifact boundaries

If INFERRED → LOG AS HYPOTHESIS:
  H2: "Verification scope is limited to [description]"
  evidence_for: "[what suggests this scope]"
  evidence_against: "[what suggests broader/narrower scope]"
  confidence: [0.0-1.0]
  status: UNTESTED
```

### Step 3: Domain Assumptions

```
ASSUMPTION_TYPE: domain_knowledge
Domain knowledge I am assuming:
  1. [specific domain assumption, e.g., "REST APIs follow HTTP semantics"]
  2. [specific domain assumption]
  3. [specific domain assumption]

For each assumption:
  basis: [ ] WELL_ESTABLISHED  [ ] DOMAIN_CONVENTION  [ ] MY_INFERENCE
  If MY_INFERENCE → LOG AS HYPOTHESIS with evidence
```

### Step 4: Context Assumptions

```
ASSUMPTION_TYPE: context
What I assume about the artifact's context:
  - Intended audience: ________________________________
  - Production environment: ________________________________
  - Dependencies/prerequisites: ________________________________

Context basis:
  [ ] EXPLICIT_IN_ARTIFACT
  [ ] INFERRED
  [ ] UNKNOWN — will note as limitation

If INFERRED → LOG AS HYPOTHESIS
```

### Step 5: Compile Assumptions Register

```yaml
assumptions_declared:
  count: [total]
  by_basis:
    STATED_IN_ARTIFACT: [count]
    USER_STATED: [count]
    INFERRED: [count]
    WELL_ESTABLISHED: [count]
    DOMAIN_CONVENTION: [count]
    UNKNOWN: [count]

hypotheses_generated:
  count: [total]
  list:
    - id: H1
      statement: "________________________________"
      confidence: [0.0-1.0]
      status: UNTESTED
    # ... continue for all hypotheses
```

> **HALT** — Review assumptions register. Confirm completeness.

---

## 0.5 Initialize Frontmatter

**Execute:** Write this exact structure to the working document:

```yaml
---
verification_session:
  id: "DV-[timestamp]"
  mode: [Quick / Standard / Deep]
  artifact: "[path/description]"
  stakes: [LOW / MEDIUM / HIGH]
  bias_mode: [Standard / Blind]
  initial_assessment: [Sound / Uncertain / Flawed / BLIND]

assumptions_declared:
  artifact_type: "[from 0.4.1]"
  scope: "[from 0.4.2]"
  domain: "[from 0.4.3]"
  context: "[from 0.4.4]"
  basis_summary:
    explicit: [count]
    inferred: [count]

hypotheses:
  # Populated from 0.4
  - H1: ...
  - H2: ...

claims_extracted: []
terms_extracted: []
structure_extracted: {}
pattern_signals: {}
findings: []
methodsExecuted: []
currentScore: 0.0
verdict: null
confidence: null
escalation: {needed: false}
---
```

---

## GATE_0: Setup → Pattern Scan

**ENFORCEMENT:** ALL items MUST be marked DONE or SCOPE_REDUCED before proceeding.

Load `data/gate-definitions.yaml` → GATE_0 section for complete requirements.

### Gate Checklist

```
[ ] G0.1: execution_mode is set (Quick / Standard / Deep)
[ ] G0.2: artifact is defined and accessible
[ ] G0.3: stakes and bias_mode are set
[ ] G0.4: ASSUMPTIONS_DECLARED section completed (count > 0)
[ ] G0.5: All INFERRED assumptions logged as HYPOTHESES
[ ] G0.6: Frontmatter initialized with all required fields
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G0.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how this affects verification]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. IF ALL DONE: Output `"GATE_0 PASSED"`
4. IF ANY SCOPE_REDUCED: Output `"GATE_0 PASSED (with scope reductions)"`
5. Proceed to Phase 1.

**HALT** — Do NOT load Phase 1 until GATE_0 passes.

---

**END OF PHASE 0**

**Next action:** Load `steps/step-01-pattern-scan.md`
