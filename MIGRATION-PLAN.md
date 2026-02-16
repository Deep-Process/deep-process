# Process Directory Structure Migration Plan
**Date:** 2026-02-16
**Goal:** Consistent directory structure for ALL processes

---

## Current Problem

**❌ INCONSISTENT structure:**

```
processes/
  ✅ deep-architect/process.yaml          # CORRECT
  ✅ deep-explore/process.yaml            # CORRECT
  ✅ deep-risk/process.yaml               # CORRECT

  ❌ orchestrator-master.yaml             # WRONG - should be in subdirectory
  ❌ deep-implement.yaml                  # WRONG - directory exists but empty
  ❌ deep-deploy.yaml                     # WRONG - no directory exists
  ❌ deep-test.yaml                       # WRONG - no directory exists
  ❌ deep-requirements.yaml               # WRONG - directory exists but empty
  ❌ deep-explore.yaml                    # DUPLICATE!
  ❌ context-manager.yaml                 # WRONG - no directory exists
  ❌ feedback-loop-handler.yaml           # WRONG - no directory exists
```

---

## Target Structure

**✅ CONSISTENT structure:**

```
processes/
  orchestrator-master/
    process.yaml              # Main process definition
    steps/                    # Step-by-step checklists (JIT loaded)
      step-0.md
      step-1.md
      ...
    artifacts/                # Generated outputs
    README.md                 # Optional documentation

  deep-implement/
    process.yaml              # Move from root + fix to template
    steps/                    # Already exists
    docs/                     # Already exists
    artifacts/

  deep-deploy/
    process.yaml              # Move from root + fix to template
    steps/
    artifacts/

  deep-test/
    process.yaml              # Move from root + fix to template
    steps/
    artifacts/

  deep-requirements/
    process.yaml              # Move from root + fix to template
    steps/
    artifacts/

  context-manager/
    process.yaml              # Move from root + fix to template
    steps/
    artifacts/

  feedback-loop-handler/
    process.yaml              # Move from root + fix to template
    steps/
    artifacts/
```

---

## Migration Steps

### Phase 1: Analyze Root Files

```bash
# Which root files need migration?
ls -1 processes/*.yaml

# Output:
# - orchestrator-master.yaml     → needs directory + migration
# - deep-implement.yaml           → directory exists, just move
# - deep-deploy.yaml              → needs directory + migration
# - deep-test.yaml                → needs directory + migration
# - deep-requirements.yaml        → directory exists, just move
# - deep-explore.yaml             → DELETE (duplicate)
# - context-manager.yaml          → needs directory + migration
# - feedback-loop-handler.yaml    → needs directory + migration
```

### Phase 2: Delete Duplicate

```bash
# deep-explore.yaml is duplicate of deep-explore/process.yaml
rm processes/deep-explore.yaml
```

**Verification:** Check orchestrator-master references "deep-explore" (generic name),
which should resolve to `deep-explore/process.yaml`, not root file.

### Phase 3: Create Missing Directories

```bash
# Create directories that don't exist yet
mkdir -p processes/orchestrator-master/{steps,artifacts}
mkdir -p processes/deep-deploy/{steps,artifacts}
mkdir -p processes/deep-test/{steps,artifacts}
mkdir -p processes/context-manager/{steps,artifacts}
mkdir -p processes/feedback-loop-handler/{steps,artifacts}

# deep-implement/ and deep-requirements/ already exist, just need artifacts/
mkdir -p processes/deep-implement/artifacts
mkdir -p processes/deep-requirements/artifacts
```

### Phase 4: Move Files

```bash
# Move root files to their directories as process.yaml
mv processes/orchestrator-master.yaml processes/orchestrator-master/process.yaml
mv processes/deep-implement.yaml processes/deep-implement/process.yaml
mv processes/deep-deploy.yaml processes/deep-deploy/process.yaml
mv processes/deep-test.yaml processes/deep-test/process.yaml
mv processes/deep-requirements.yaml processes/deep-requirements/process.yaml
mv processes/context-manager.yaml processes/context-manager/process.yaml
mv processes/feedback-loop-handler.yaml processes/feedback-loop-handler/process.yaml
```

### Phase 5: Fix Each process.yaml to Template

For each moved file, apply PROCESS-TEMPLATE.yaml compliance:
1. Add/verify `13_zasady_version: "1.0.0"`
2. Restructure all phases to OODA format
3. Add ALL 8 error handlers
4. Delete forbidden content
5. Compress to <300L (or split to sub-processes if needed)

**Priority order:**
1. orchestrator-master (already fixed, just needs move)
2. deep-requirements (orchestrator phase 1)
3. deep-implement (orchestrator phase 5) - will need splitting
4. deep-test (orchestrator phase 6)
5. deep-deploy (orchestrator phase 8)
6. context-manager (support)
7. feedback-loop-handler (support)

### Phase 6: Verify References

Update any hard-coded paths in orchestrator-master or other processes:

```bash
# Search for references to root files
grep -r "processes/[^/]*\.yaml" processes/

# Should return NONE (all should reference directory names only)
```

### Phase 7: Final Verification

```bash
# No YAML files should exist in processes root
ls -1 processes/*.yaml 2>&1
# Expected: "No such file or directory"

# All processes should have process.yaml in subdirectories
find processes -maxdepth 2 -name "process.yaml" | wc -l
# Expected: ~20+ files

# All should have steps/ directories
find processes -maxdepth 2 -type d -name "steps" | wc -l
# Expected: ~20+ directories
```

---

## Execution Plan

### Option A: Migrate First, Then Fix (Recommended)

**Step 1:** Migrate all files to correct structure (15 min)
**Step 2:** Fix each process.yaml to template compliance (8-12 hours)

**Pros:** Clean structure immediately, fixes happen in right place
**Cons:** Broken processes during fix period

### Option B: Fix First, Then Migrate

**Step 1:** Fix root files to template compliance (8-12 hours)
**Step 2:** Move fixed files to directories (15 min)

**Pros:** No broken processes (if root files currently work)
**Cons:** More work if references break during migration

### Option C: Fix + Migrate Incrementally

For each process:
**Step 1:** Create directory structure
**Step 2:** Fix root file to template
**Step 3:** Move to directory
**Step 4:** Verify references

**Pros:** Systematic, test each process
**Cons:** Takes longer overall

---

## Recommended: Option A

```bash
# 1. Delete duplicate
rm processes/deep-explore.yaml

# 2. Create directories
mkdir -p processes/{orchestrator-master,deep-deploy,deep-test,context-manager,feedback-loop-handler}/{steps,artifacts}
mkdir -p processes/{deep-implement,deep-requirements}/artifacts

# 3. Move files
mv processes/orchestrator-master.yaml processes/orchestrator-master/process.yaml
mv processes/deep-implement.yaml processes/deep-implement/process.yaml
mv processes/deep-deploy.yaml processes/deep-deploy/process.yaml
mv processes/deep-test.yaml processes/deep-test/process.yaml
mv processes/deep-requirements.yaml processes/deep-requirements/process.yaml
mv processes/context-manager.yaml processes/context-manager/process.yaml
mv processes/feedback-loop-handler.yaml processes/feedback-loop-handler/process.yaml

# 4. Verify clean root
ls -1 processes/*.yaml
# Should output: "No such file or directory"

# 5. Now fix each process.yaml to template (separate task)
```

---

## After Migration

**Updated inventory:**

| Process | Path | Status | Next Action |
|---------|------|--------|-------------|
| orchestrator-master | orchestrator-master/process.yaml | ✅ Already fixed | None |
| deep-implement | deep-implement/process.yaml | ❌ Needs fix | Apply template |
| deep-deploy | deep-deploy/process.yaml | ❌ Needs fix | Apply template |
| deep-test | deep-test/process.yaml | ❌ Needs fix | Apply template |
| deep-requirements | deep-requirements/process.yaml | ❌ Needs fix | Apply template |
| context-manager | context-manager/process.yaml | ❌ Needs fix | Apply template |
| feedback-loop-handler | feedback-loop-handler/process.yaml | ❌ Needs fix | Apply template |

---

**NEXT QUESTION:** Wykonać migrację (Option A)? Zajmie to 15 minut.
