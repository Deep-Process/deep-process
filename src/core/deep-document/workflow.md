# Deep-Document V7 - Workflow (Main Entry Point)
# Version: 7.1.0
# Pure Self-Contained Structure with Just-In-Time Loading

---

## CRITICAL: Load Shared Rules First

**Before ANY execution, read:**
```
Read tool: rules.md
```

This file contains ALL shared rules (PRIORITY, ANTI-BYPASS, EXECUTION, modes, patterns).

---

## SCENARIO 0: STARTUP

**Purpose:** Discover existing projects and show menu

### STEP 1: SCAN_PROJECTS

Search for process-state.yaml files:

**Paths:**
1. `./docs/deep-artifacts/process-state.yaml`
2. `./**/deep-artifacts/process-state.yaml` (depth 3)
3. `../**/deep-artifacts/process-state.yaml` (2 levels up)

**Command:**
```bash
# Windows
Get-ChildItem -Path . -Recurse -Depth 3 -Filter "process-state.yaml" -ErrorAction SilentlyContinue | Where-Object { $_.Directory.Name -eq "deep-artifacts" }

# Linux/Mac
find . -maxdepth 3 -name "process-state.yaml" -path "*/deep-artifacts/*" 2>/dev/null
```

**For each found file:**
1. Read: metadata.version, execution_context.current_state, metadata.last_modified, metadata.repository_path
2. Store in projects[] array:
```yaml
- path: <absolute_path>
  repository: <repository_path>
  state: <current_state>
  modified: <ISO8601>
  version: <version>
  is_default: <true if ./docs/deep-artifacts/>
```

Sort by: is_default first, then last_modified descending.

### STEP 2: DISPLAY_MENU

**Display as TEXT (no AskUserQuestion - see rules.md ANTI-BYPASS RULE 5):**

IF projects found:
```
DEEP-DOCUMENT V7 ORCHESTRATOR
DISCOVERED PROJECTS: <count>

[1] <repository_name>
    Path: <path>
    State: <state> | Modified: <time> | Version: <version>
    [DEFAULT]

[2] <repository_name>
    Path: <path>
    State: <state> | Modified: <time> | Version: <version>

...

[N] NEW PROJECT
[F] CUSTOM FILE
[Q] QUIT

Choice: [1-<count>/N/F/Q]
```

IF no projects:
```
DEEP-DOCUMENT V7 ORCHESTRATOR
No projects found

[N] NEW PROJECT
[F] CUSTOM FILE
[Q] QUIT

Choice: [N/F/Q]
```

### STEP 3: READ_CHOICE

**WAIT for user message with choice.**
- DO NOT call tools to read input
- User will type choice (1, N, F, Q) and press send
- Extract choice from user's message

Validate:
- IF projects found: accept [1], [2], ..., [N], [F], [Q]
- IF no projects: accept [N], [F], [Q]
- IF invalid → display menu again and wait

### STEP 4: COUNTER_CHECKS

**CC1 (Grounding - Method #85):**
- Sample 3 projects (if any)
- Verify each file exists at path, is readable
- IF >30% fail → WARNING

**CC2 (Phantom Hunt - Method #168):**
- Re-scan 1 search path
- Compare with original results
- IF mismatch >1 project → ERROR

**CC3 (Coherence - Method #84):**
- IF [1-N]: verify projects[selected].path exists
- IF [F]: verify provided file_path exists
- IF fail → BLOCKER

### STEP 5: CHECKLIST

```yaml
startup_checklist:
  - item: "Scan executed"
    status: <DONE|SKIPPED>
    paths: <list>
  - item: "Projects discovered"
    status: <DONE>
    count: <N>
  - item: "Menu displayed"
    status: <DONE>
    options: <list>
  - item: "User choice recorded"
    status: <DONE>
    choice: <input>
  - item: "Counter-checks executed"
    status: <DONE|FAILED>
    results: <PASS|WARNING|ERROR|BLOCKER>
  - item: "Decision logged"
    status: <DONE>
```

### STEP 6: GATE_STARTUP

**Load gate definition:** data/gates.yaml GATE_STARTUP

Evaluate conditions:
- GS-01: Scan executed for ≥1 path (CRITICAL)
- GS-02: Menu displayed with all options (CRITICAL)
- GS-03: User choice received and valid (BLOCKER)
- GS-04: CC1/CC2/CC3 all executed, no BLOCKER (ERROR)
- GS-05: Checklist complete (ERROR)

**Enforcement (see rules.md GATE ENFORCEMENT PATTERN):**
- IF BLOCKER → halt, display error, return to failed step
- IF CRITICAL → STATE_ERROR
- IF ERROR → log warning, continue

### STEP 7: ROUTE

Based on user choice, load scenario file **just-in-time**:

**[1-N] Load Existing Project:**
```
Read tool: scenarios/load-project.md
```
Pass: file_path = projects[selected].path

**[N] New Project:**
```
Read tool: scenarios/new-project.md
```

**[F] Custom File:**
Prompt user: "Enter process-state.yaml path:"
```
Read tool: scenarios/load-project.md
```
Pass: file_path = user_input

**[Q] Quit:**
Exit

### STEP 8: LOG

```yaml
decisions:
  - timestamp: <ISO8601>
    decision: "STARTUP_MENU_EXECUTED"
    user_choice: <choice>
    projects_discovered: <count>
    selected_project: <path>
    gate_startup: PASSED
    counter_checks:
      cc1: <status>
      cc2: <status>
      cc3: <status>
    checklist_complete: true
```

---

## SCENARIOS (Loaded Just-In-Time)

Scenarios are loaded progressively based on execution path:

**SCENARIO A (NEW_PROJECT):**
- Loaded ONLY when user chooses [N]
- File: scenarios/new-project.md
- Content: Initialize, template selection, create state, delegate to STATE_INIT

**SCENARIO B (LOAD_PROJECT):**
- Loaded ONLY when user chooses [1-N] or [F]
- File: scenarios/load-project.md
- Content: Validate, load state, resume from current_state

**SCENARIO C (CONTINUE):**
- Loaded ALWAYS after A or B
- File: scenarios/continue.md
- Content: Execute current state, route to steps/, handle staleness, call utils/, transition to next state
- Loops for each processing state (15 total)

**SCENARIO D (USER_REVIEW):**
- Loaded ONLY at USER_REVIEW_* states (4 times)
- File: scenarios/user-review.md
- Content: Display artifact, approve/reject/modify decision, route to continue or halt

**SCENARIO E (COMPLETED_PROCESS):**
- Loaded ONLY when STATE_COMPLETE reached
- File: scenarios/completed.md
- Content: Display completion, post-completion options (VERIFY_IMPROVE, AMEND_QUALITY, RESET, EXIT)

**Token Savings:**
- NEW PROJECT path: 180L + 60L + 67L + 37L×4 + 83L = 538L (vs 567L = 5% savings)
- LOAD EXISTING (mid-process): 180L + 38L + 67L + 37L×2 = 359L (vs 567L = 37% savings)
- LOAD COMPLETED: 180L + 38L + 83L = 301L (vs 567L = 47% savings)

**Decision Tree Optimization:**
Each execution path loads ONLY scenarios needed for that path, not all 5 scenarios upfront.

---

**Version:** 7.1.0 (2026-02-11)
**Pattern:** Minimal Orchestrator with Just-In-Time Scenario Loading
**ZASADA 12 Compliance:** ✓ Data appears when needed, not earlier
