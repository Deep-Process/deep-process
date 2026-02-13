# SCENARIO A: NEW_PROJECT
# Loaded just-in-time when user chooses [N]
# Version: 7.1.1 (Universal incremental approach)

**Purpose:** Initialize new documentation project

---

## STEP 1: INITIALIZE

1. Create output_directory if not exists
2. Create deep-artifacts/ subdirectory
3. Set execution_context.mode = "FULL"
4. Set current_state = "STATE_INIT"

---

## STEP 2: TEMPLATE_SELECTION

**Display as TEXT (no AskUserQuestion - see rules.md ANTI-BYPASS RULE 5):**

```
SELECT TEMPLATE MODE:
[A] AUTO-DETECT
[B] BUILT-IN V7
[C] CUSTOM TEMPLATE

Your choice: [A/B/C]
```

**WAIT for user message with choice (A/B/C).**

**Execute based on choice:**
- A: Set configuration.templates.mode = "AUTO_DETECT"
- B: Set configuration.templates.mode = "BUILT_IN"
- C: Prompt for path, set mode = "CUSTOM", custom_path = <path>

---

## STEP 3: CREATE_STATE

**UNIVERSAL INCREMENTAL APPROACH:**

### Why Incremental?
- Reduces function call complexity (works reliably across all LLMs)
- Easier to debug if any step fails
- Allows validation between steps
- More maintainable and predictable

### PHASE 3a: Create Minimal Skeleton

Write tool: `<output_directory>/deep-artifacts/process-state.yaml`

**Content:**
```yaml
metadata:
  version: "7.1.1"
  created_timestamp: <ISO8601>
  repository_path: <absolute_path>
  output_directory: <absolute_path>
execution_context:
  mode: "FULL"
  current_state: "STATE_INIT"
configuration:
  templates:
    mode: <A=AUTO_DETECT, B=BUILT_IN, C=CUSTOM>
    selected: []
artifacts: []
decisions: []
lock: null
```

**Validation:** Read file to verify creation succeeded.

### PHASE 3b: Add Template Path (ONLY if mode=CUSTOM)

**Skip this phase if mode is AUTO_DETECT or BUILT_IN.**

**IF user chose option C (CUSTOM):**

Edit tool: `<output_directory>/deep-artifacts/process-state.yaml`

Find:
```yaml
  templates:
    mode: CUSTOM
    selected: []
```

Replace with:
```yaml
  templates:
    mode: CUSTOM
    custom_path: "<user_provided_path>"
    selected: []
```

**Validation:** Read file to verify custom_path added correctly.

---

---

## STEP 4: DELEGATE

Transition to STATE_INIT → Read tool: scenarios/continue.md
