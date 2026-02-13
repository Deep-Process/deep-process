---
step: 0
name: "Setup"
time_estimate: "2-5 minutes"
goal: "Assess stakes, document biases, prepare for verification"
requires_completion: []
next_steps:
  DEFAULT: "steps/step-01-pattern-scan.md"
data_dependencies:
  - "data/decision-thresholds.yaml"
  - "_bmad/dv/deep-verify-config.yaml (optional - for default stakes)"
outputs:
  - stakes
  - bias_mode
  - initial_assessment
---

# Phase 0: Setup

## INTERACTION PROTOCOL (CRITICAL)

**Do NOT present all questions at once.** You must engage the user in a sequential dialogue.
Follow the **Interaction Sequence** below strictly. Stop and wait for the user's response after each step.

---

## 0.0 Argument Parsing (Internal)

**Before starting the menu, analyze the `USER ARGUMENTS` section from the prompt:**

1.  **Flags:** Look for `--quick`, `-q`, `--deep`, `--full`. Set `execution_mode` if found.
2.  **Artifact:** Look for any **non-flag string** (does not start with `-`).
    *   *Example:* `/deep-verify src/main.py` -> Artifact is `src/main.py`.
    *   *Example:* `/deep-verify --deep @src/core` -> Artifact is `src/core`.
    *   If found, set `artifact` variable immediately.

---

## Interaction Sequence

### Step 1: Verification Mode

**Logic:**
1.  Check if `execution_mode` was set via CLI flags in step 0.0.
2.  If **YES**: Log the selection (e.g., "Mode: Deep Verify (selected via flag)") and **SKIP** to Step 2.
3.  If **NO**: Display the menu below and **HALT**.

> **Prompt to User:**
> "Select Verification Mode:
> 1. **Quick Verify** (Fast triage, Phase 1 only)
> 2. **Standard Verify** (Full rigor, Phases 1-5)
> 3. **Deep Verify** (High stakes, includes Pattern Evaluation)"

→ **HALT** — Wait for user response.

---

### Step 2: Artifact Definition

**Logic:**
1.  Check if `artifact` was detected in step 0.0 (Argument Parsing) or context.
2.  If **YES**:
    *   State: "Target Artifact: [artifact_path]"
    *   Ask: "Is this correct? (Y/N)"
    *   **HALT** and wait.
    *   If user says Y -> Proceed to Step 3.
    *   If user says N -> Ask for new path.
3.  If **NO**: Ask the user to define the target.

> **Prompt to User:**
> "1. **The Artifact:** Please provide the **path** to the file/folder you want to verify.
>  2. **Description:** Briefly describe what this artifact is (e.g., 'API Spec', 'Auth Module')."

→ **HALT** — Wait for user response.

---

### Step 3: Stakes & Bias Configuration

**Logic:**
Now that Mode and Artifact are known, ask if the user wants detailed configuration or smart defaults.

> **Prompt to User:**
> "Do you want to configure **Stakes & Bias settings**, or use **DEFAULT** values based on your selected Mode?
>
> **Options:**
> - **DEFAULT**: Uses standard settings for [Selected Mode] (Recommended).
> - **CUSTOM**: Manually set Stakes, Initial Assessment, and Bias Check."

→ **HALT** — Wait for user response.

**Branching Logic:**

*   **IF DEFAULT:**
    *   **Quick/Standard Mode**: Set `stakes=MEDIUM`, `bias_mode=Standard`, `initial_assessment=Uncertain`.
    *   **Deep Mode**: Set `stakes=HIGH`, `bias_mode=Blind`, `initial_assessment=BLIND`.
    *   Proceed to **0.4 Update Frontmatter**.

*   **IF CUSTOM**:
    *   Ask **Stakes Assessment** (Accept Flawed vs Reject Sound).
    *   Ask **Initial Assessment** (Sound/Uncertain/Flawed).
    *   Ask **Bias Check** (Expectations/Pressure).
    *   Proceed to **0.4 Update Frontmatter**.

---

## 0.4 Update Frontmatter

After completing the sequence above, update the working document frontmatter:

```yaml
---
workflow: deep-verify
artifact: "[Path from Step 2]"
started: "[current ISO timestamp]"
execution_mode: [Quick / Standard / Deep]
stakes: [LOW / MEDIUM / HIGH]
bias_mode: [Standard / Blind / ForcedAlternative]
initial_assessment: [ProbablySound / Uncertain / ProbablyFlawed / BLIND]
expected_outcome: "[User input or 'Default']"
change_mind_criteria: "[User input or 'Evidence']"

stepsCompleted: [0]
currentStep: 1
currentScore: 0
scoreHistory: []
findings: []
patternsMatched: []
methodsExecuted: []
earlyExit: false
earlyExitReason: null
verdict: null
confidence: null
---
```

---

## 0.5 Proceed to Pattern Scan

**Stakes-based guidance for next step:**

| Stakes | Recommendation for Phase 1 |
|--------|---------------------------|
| LOW | Standard execution |
| MEDIUM | Standard execution, be thorough |
| HIGH | Extra attention to Pattern Library, consider additional Tier 1 scrutiny |

**Next step:** Load `steps/step-01-pattern-scan.md`

Before loading, verify:
- [ ] Mode selected
- [ ] Artifact defined
- [ ] Stakes/Bias set (Default or Custom)
- [ ] Frontmatter updated

---

## Output Checklist

Before proceeding, confirm:

- [ ] `execution_mode` is set
- [ ] `artifact` is defined
- [ ] `stakes` and `bias_mode` are populated
- [ ] Frontmatter initialized
- [ ] Ready to load Phase 1 data files
