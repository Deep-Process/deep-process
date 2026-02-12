# SCENARIO E: COMPLETED_PROCESS
# Loaded just-in-time when STATE_COMPLETE reached
# Version: 7.1.0

**Purpose:** Post-completion options

---

## STEP 1: DISPLAY_COMPLETION

**Display as TEXT:**

```
═══════════════════════════════════════════════════════════════
  DOCUMENTATION PROCESS COMPLETE
═══════════════════════════════════════════════════════════════

Repository: <repository_path>
Output: <output_directory>
Version: <version>
Completed: <timestamp>

ARTIFACTS (all FRESH):
✓ repo_inventory.yaml
✓ domain-ontology.yaml
✓ template-analysis.yaml
✓ detection-report.yaml
✓ documentation-plan.yaml
✓ coverage_map.yaml
✓ evidence_map.yaml
✓ architectural-model.json
✓ docs/*.md (9 documents)
✓ verification-report.md
✓ consolidated-validation-report.md

GATES (all PASSED):
✓ GATE_0..4, GATE_GEN, GATE_D, GATE_P, GATE_OE, GATE_TA
✓ GATE_UA, GATE_UB, GATE_UC, GATE_UD (4 user approvals)

═══════════════════════════════════════════════════════════════
```

---

## STEP 2: OPTIONS_MENU

**Display as TEXT (no AskUserQuestion - see rules.md ANTI-BYPASS RULE 5):**

```
POST-COMPLETION OPTIONS:

[1] VERIFY_IMPROVE — Incremental verification mode
[2] AMEND_QUALITY — Apply V7 quality improvements
[3] RESET — Start over
[4] EXIT — Terminate

Your choice: [1/2/3/4]
```

**WAIT for user message with choice (1/2/3/4).**

---

## STEP 3: EXECUTE_OPTION

### OPTION 1 - VERIFY_IMPROVE (Incremental Mode)

**Display submenu as TEXT:**

```
VERIFY_IMPROVE - Select Target State:

[1] INVENTORY — Verify files (5-10 min, ~5%)
[2] ONTOLOGY — Verify entities (10-15 min, ~8%)
[3] TEMPLATE — Verify template analysis (5-10 min, ~5%)
[4] COVERAGE — Verify segments (15-25 min, ~10%)
[5] EVIDENCE — Verify claims (20-30 min, ~15%)
[6] DIAGRAMS — Verify architecture (25-35 min, ~15%)
[7] DOCUMENTATION — Verify docs (20-30 min, ~15%)
[8] VERIFICATION — Verify consolidated report (15-20 min, ~10%)

Your choice: [1-8]
```

**WAIT for user message with choice (1-8).**

**Execute based on choice:**
1. Set execution_context.mode = "INCREMENTAL"
2. Set execution_context.current_state = target_state (STATE_INIT, STATE_ONTOLOGY_EXTRACTION, STATE_TEMPLATE_ANALYSIS, STATE_COVERAGE, STATE_EVIDENCE, STATE_SYNTHESIS, STATE_GENERATION, or STATE_VERIFICATION)
3. Log decision in decisions[] with type="USER_CHOICE_VERIFY_IMPROVE"
4. Read tool: scenarios/continue.md (will route to target step with INCREMENTAL mode)

**Impact Summary (show before execution):**
- Preserved: <base_counts> artifacts FRESH
- Supplemented: <new_counts> items to add
- Staleness: DIRECT only (no cascade to grandchildren)
- Time: 5-35 minutes (vs 4 hours full)
- Tokens: ~5-15% budget (vs 100% full)

### OPTION 2 - AMEND_QUALITY (Quality Mode)

**Display as TEXT:**

```
AMEND_QUALITY - Apply V7 Quality Improvements:

Quality requirements to apply:
- GG-10: Paragraph length ≤300 chars (scannability)
- GG-11: Structure depth ≥2.0 (navigability)
- GG-12: [UNKNOWN] ratio ≤10% (completeness)
- GG-13: Format selection (tables/lists)
- GG-14: Citation density ≤30% (readability)

What changes:
- documentation-plan.yaml (amended with quality_requirements)
- docs/*.md (regenerated with quality rules)

What preserved:
- evidence_map.yaml (FRESH)
- architectural-model.json (FRESH)
- All verification artifacts (FRESH)

Token budget: ~15% (10-15 minutes)
Estimated time: 15 minutes

Process flow:
STATE_QUALITY_AMENDMENT → STATE_GENERATION → USER_REVIEW_DOCS → STATE_VERIFICATION → STATE_COMPLETE v2

Proceed? [Y/N]
```

**WAIT for user message with choice (Y/N).**

**IF Y (Yes):**
1. Set execution_context.mode = "QUALITY"
2. Set execution_context.current_state = "STATE_QUALITY_AMENDMENT"
3. Log decision in decisions[] with type="USER_CHOICE_AMEND_QUALITY"
4. Read tool: scenarios/continue.md (will route to STATE_PLANNING with QUALITY mode)

**IF N (No):**
Return to STEP 2 (OPTIONS_MENU)

### OPTION 3 - RESET

**Display as TEXT:**

```
⚠️  WARNING: RESET will DELETE all artifacts and start over.

This action:
- Deletes deep-artifacts/ directory
- Removes all process state
- Loses all generated documentation
- Cannot be undone

Time to regenerate: ~4 hours
Token budget: 100%

Are you sure? [Y/N]
```

**WAIT for user message with choice (Y/N).**

**IF Y (Yes):**
1. Delete deep-artifacts/ directory
2. Delete process-state.yaml
3. Log decision in decisions[] with type="USER_CHOICE_RESET"
4. Read tool: scenarios/new-project.md (start over)

**IF N (No):**
Return to STEP 2 (OPTIONS_MENU)

### OPTION 4 - EXIT

**Display as TEXT:**

```
═══════════════════════════════════════════════════════════════
  PROCESS TERMINATED
═══════════════════════════════════════════════════════════════

Documentation available at:
<output_directory>

Process state saved at:
<output_directory>/deep-artifacts/process-state.yaml

To resume later, run Deep-Document V7 and select [L] LOAD PROJECT.

═══════════════════════════════════════════════════════════════
```

**EXIT**
