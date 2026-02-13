---
step: 0
name: "Setup + Assumptions Declaration"
time_estimate: "3-8 minutes"
goal: "Configure verification, declare all assumptions, log initial hypotheses"
requires_completion: []
next_steps:
  DEFAULT: "steps/step-01-extraction.md"
gate: "GATE_0"
data_dependencies:
  - "../deep-verify/data/decision-thresholds.yaml"
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
1. Quick Verify (All phases, reduced Tier 2 depth)
2. Standard Verify (Full rigor, all methods)
3. Deep Verify (Maximum rigor + Pattern Evaluation)

NOTE: V2 runs ALL phases in every mode. Quick mode reduces
method depth within Phase 2, not phase count.
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

0. Load `../deep-verify/data/decision-thresholds.yaml` → `stakes_assessment` section. This defines LOW/MEDIUM/HIGH stakes criteria.

1. Display this exact prompt:

```
Configure Stakes & Bias settings, or use DEFAULT?

Options:
- DEFAULT: Uses standard settings for [Selected Mode] (Recommended).
- CUSTOM: Manually set Stakes, Initial Assessment, and Bias Check.
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
workflow: deep-verify-v2
version: "2.0"
artifact: "[Path from 0.2]"
artifact_description: "[Description from 0.2]"
started: "[current ISO timestamp]"
execution_mode: [Quick / Standard / Deep]
stakes: [LOW / MEDIUM / HIGH]
bias_mode: [Standard / Blind / ForcedAlternative]
initial_assessment: [ProbablySound / Uncertain / ProbablyFlawed / BLIND]

# Assumptions & Hypotheses
assumptions_declared:
  count: [from 0.4]
  by_basis: {STATED: N, INFERRED: N, ...}
hypotheses:
  - id: H1
    statement: "..."
    confidence: 0.0
    status: UNTESTED
  # ...

# Process State
stepsCompleted: [0]
currentStep: 1
currentScore: 0
scoreHistory: []

# Extraction (populated in Phase 1)
claims_extracted: []
terms_extracted: []
structure_extracted: null

# Findings (populated in Phase 2+)
findings: []
patternsMatched: []
methodsExecuted: []

# Counter-checks (populated in Phase 2+)
counter_checks: []

# Gates
gates_passed: []
scope_reductions: []

# Results (populated in Phase 4+)
earlyExit: false  # ALWAYS false in V2
verdict: null
confidence: null
---
```

---

## GATE_0: Setup → Extraction

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_0: SETUP COMPLETE → EXTRACTION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] execution_mode is set                          Status: ____   │
│  [ ] artifact is defined and accessible             Status: ____   │
│  [ ] stakes and bias_mode are set                   Status: ____   │
│  [ ] ASSUMPTIONS_DECLARED section completed         Status: ____   │
│  [ ] All INFERRED assumptions logged as HYPOTHESES  Status: ____   │
│  [ ] Frontmatter initialized                        Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│  If SCOPE_REDUCED: fill SCOPE_REDUCTION_RECORD                     │
│                                                                     │
│  GATE_0 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**IF GATE_0 PASSED:** Load `steps/step-01-extraction.md`
**IF GATE_0 FAILED:** Complete missing items. Do NOT proceed.

