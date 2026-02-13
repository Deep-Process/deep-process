# SCENARIO B: LOAD_PROJECT
# Loaded just-in-time when user chooses [1-N]/[F]
# Version: 7.1.0

**Purpose:** Load existing project from process-state.yaml

**INPUT:** file_path (from SCENARIO 0)

---

## STEP 1: VALIDATE

1. Read process-state.yaml from file_path
2. Verify metadata.version compatible with "7.1.x"
3. Check lock == null

**Display:**
```
PROJECT LOADED
Repository: <repository_path>
State: <current_state>
Version: <version>
Modified: <last_modified>
```

**IF validation fails:**
```
VALIDATION FAILED: <error>

[R] RETRY
[N] NEW
[Q] QUIT
```

---

## STEP 2: RESUME

**IF current_state == "STATE_COMPLETE":**
  → Read tool: scenarios/completed.md

**ELSE:**
  → Read tool: scenarios/continue.md
