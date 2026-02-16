# Subprocess Pool

## PURPOSE

This directory contains subprocesses that can be invoked by Executive Orchestrator during Phase 3 (Execute).

## REQUIRED SUBPROCESSES

The following subprocesses are referenced in the execution plan but not yet populated:

### 1. deep-requirements
**Purpose:** Requirements gathering and analysis
**Expected location:** `subprocess-pool/deep-requirements/`
**Files needed:**
- `manifest.yaml` - Subprocess metadata
- `workflow.md` - Execution workflow

**Source:** Copy from `processes/deep-requirements/` (if exists) OR create new

### 2. deep-architect
**Purpose:** Architecture design
**Expected location:** `subprocess-pool/deep-architect/`
**Files needed:**
- `manifest.yaml`
- `workflow.md`

**Source:** Copy from `processes/deep-architect/` OR adapt from existing architecture processes

### 3. deep-implement
**Purpose:** Implementation and coding
**Expected location:** `subprocess-pool/deep-implement/`
**Files needed:**
- `manifest.yaml`
- `workflow.md`

**Source:** Copy from `processes/deep-implement/` OR create new

### 4. deep-test
**Purpose:** Testing and validation
**Expected location:** `subprocess-pool/deep-test/`
**Files needed:**
- `manifest.yaml`
- `workflow.md`

**Source:** Copy from `processes/deep-test/` (if exists) OR create new

### 5. deep-verify
**Purpose:** Verification and compliance checking
**Expected location:** `subprocess-pool/deep-verify/`
**Files needed:**
- `manifest.yaml`
- `workflow.md`

**Source:** Copy from `processes/deep-verify/` OR adapt from existing

### 6. deep-deploy
**Purpose:** Deployment and delivery
**Expected location:** `subprocess-pool/deep-deploy/`
**Files needed:**
- `manifest.yaml`
- `workflow.md`

**Source:** Create new OR adapt from deployment automation

## HOW SUBPROCESSES ARE INVOKED

During Phase 3 (Execute), Executive Orchestrator:

1. **Identifies subprocess needed** (from execution-plan.yaml)
2. **Loads subprocess manifest** from `subprocess-pool/{name}/manifest.yaml`
3. **Prepares inputs** (artifacts from previous tasks)
4. **Invokes subprocess** by executing `subprocess-pool/{name}/workflow.md`
5. **Captures outputs** (technical artifacts)
6. **Translates to business terms** (using translation-layer component)
7. **Displays business summary** to user (technical details hidden)
8. **Logs technical details** to execution-log.yaml (for reference)

## SUBPROCESS MANIFEST FORMAT

Each subprocess must have a `manifest.yaml` with:

```yaml
---
subprocess_id: {name}
subprocess_name: "{Display Name}"
version: 1.0.0

purpose: "Brief description"

inputs_required:
  - input_name_1: {description}
  - input_name_2: {description}

outputs_produced:
  - output_name_1: {description}
  - output_name_2: {description}

estimated_duration: "{time estimate}"

complexity: LOW | MEDIUM | HIGH | CRITICAL

error_handlers:
  - handler_name_1
  - handler_name_2
```

## SUBPROCESS WORKFLOW FORMAT

Each subprocess must have a `workflow.md` following the pattern:

```markdown
# {Subprocess Name} - Workflow

## ENTRY POINT
[How subprocess is invoked]

## EXECUTION FLOW
[Phase-by-phase execution]

## OUTPUTS
[What artifacts are produced]

## ERROR HANDLING
[How errors are handled]
```

## INTEGRATION WITH EXECUTIVE ORCHESTRATOR

Subprocesses are:
- **Transparent to user** - User doesn't see subprocess execution details
- **Logged for reference** - Technical output saved to execution-log.yaml
- **Translated to business terms** - Only business value shown to user

Example:
```
Technical output: "Created UserRepository.java with CRUD methods"
Business translation: "Created user management capability"
```

## ACTION REQUIRED

To complete Executive Orchestrator integration:

1. **Identify existing subprocesses** in `processes/` directory
2. **Copy or adapt** to `subprocess-pool/`
3. **Ensure manifest.yaml** format matches expected structure
4. **Test invocation** from Phase 3 (Execute)
5. **Verify translation** of outputs to business terms

## STATUS

- [ ] deep-requirements - NOT populated
- [ ] deep-architect - NOT populated
- [ ] deep-implement - NOT populated
- [ ] deep-test - NOT populated
- [ ] deep-verify - NOT populated
- [ ] deep-deploy - NOT populated

**Next step:** Populate this directory with subprocess definitions
