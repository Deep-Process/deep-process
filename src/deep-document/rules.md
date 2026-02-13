# Deep-Document V7 - Shared Rules
# Wczytywane przez workflow.md + wszystkie steps/*.md

**Version:** 7.1.0
**Type:** SHARED ENFORCEMENT RULES (loaded everywhere)

---

## PRIORITY (Binding)

**COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS**

This is the PRIMARY DIRECTIVE. When choosing between:
- Complete coverage (expensive) vs partial coverage (cheap) → choose COMPLETE
- Reading all files vs sampling → choose ALL
- Full verification vs quick check → choose FULL

Token optimization is SECONDARY to ensuring 0% phantom content and 100% coverage.

---

## ANTI-BYPASS RULES (Binding)

**RULE 1:** Orchestrator MUST execute SCENARIO 0 first.
**RULE 2:** CANNOT assume NEW or LOAD without user choice.
**RULE 3:** MUST check for existing process-state.yaml before menu.
**RULE 4:** ALWAYS show menu regardless of context.
**RULE 5:** NEVER EVER use AskUserQuestion tool - it is BROKEN and causes infinite loops.

**CRITICAL: AskUserQuestion tool is DISABLED for this process.**
- Display ALL menus as TEXT OUTPUT (normal message text)
- Wait for user response in message input
- Read user's text message to get choice
- DO NOT call AskUserQuestion - it WILL FAIL

Severity: BLOCKER
Violation: Process HALT, restart from SCENARIO 0

---

## EXECUTION RULES (Binding)

1. **BINDING GATES** - All checklist items must PASS, cannot skip
2. **ASSUMPTIONS_DECLARED** - Every state STEP 2 declares assumptions
3. **Extract → Verify → Render** - ENFORCED sequence in all states
4. **Counter-Checks** - 3 checks (CC1: grounding, CC2: phantoms, CC3: coherence) REQUIRED
5. **Checklists** - Gate conditions checked AFTER every phase
6. **Transitions** - Only if checklist PASS, else → STATE_ERROR
7. **Just-In-Time Loading** - Load ONLY current step file, not all at once (ZASADA 12)

---

## INCREMENTAL MODE (V6.3 inherited)

When `execution_context.mode == "INCREMENTAL"`:

### 9-STEP ENFORCED SEQUENCE (applies to ALL processing states)

**STEP 1:** Load base artifact + execution_context.mode
**STEP 2:** ASSUMPTIONS_DECLARED about base quality
**STEP 3:** Scan changes in source repository
**STEP 4:** Compare base vs current (preserved/new/modified/removed)
**STEP 5:** Validate preservation ≥80% (BINDING - if <80% abort to FULL)
**STEP 6:** Supplement base with new/modified ONLY (not regenerate)
**STEP 7:** Write delta artifact (verification + supplementation)
**STEP 8:** Evaluate incremental gate (6-8 conditions)
**STEP 9:** Write updated artifact (base + supplement)

**Staleness Override:** INCREMENTAL_VERIFY marks direct dependents STALE, stops cascade (grandchildren remain FRESH)

---

## QUALITY MODE (V6.2.1 inherited)

When `execution_context.mode == "QUALITY"` (STATE_QUALITY_AMENDMENT):

### ENFORCED SEQUENCE

**STEP 1:** Load existing documentation-plan.yaml
**STEP 2:** ASSUMPTIONS_DECLARED about quality improvements needed
**STEP 3:** Amend plan with quality_requirements (GG-10..14)
**STEP 4:** Evaluate GATE_P_AMENDMENT (7 conditions)
**STEP 5:** Mark docs/*.md STALE (QUALITY_ONLY override - no cascade to evidence/model)
**STEP 6:** Delegate to STATE_GENERATION

**Staleness Override:** QUALITY_ONLY marks ONLY docs/*.md STALE, does NOT cascade to evidence_map.yaml or architectural-model.json

---

## EXTRACT → VERIFY → RENDER PATTERN (Binding)

ALL processing states MUST follow this sequence:

1. **EXTRACT:** Read data from source (files, artifacts, user input)
2. **VERIFY:** Validate extraction quality (gates, counter-checks, checklists)
3. **RENDER:** Write output artifact

Agent CANNOT skip to RENDER without completing EXTRACT + VERIFY.

FSM transitions enforce sequence via gates (STATE_X → STATE_Y only if GATE_X passes).

---

## ASSUMPTIONS_DECLARED REQUIREMENT (Binding)

EVERY state STEP 2 must declare assumptions:

```yaml
assumptions:
  - id: A-001
    assumption: "[statement]"
    confidence: [HIGH|MEDIUM|LOW]
    evidence: "[source]"
    impact_if_false: "[consequence]"
```

Counter-checks validate critical assumptions (Method #85 Grounding Check samples 3 assumptions, verifies against evidence).

---

## COUNTER-CHECK PATTERN (3 Required)

ALL processing states MUST execute 3 counter-checks:

**CC1 (Grounding - Method #85):** Sample 3 items, verify each exists at source, fail if >30% unverifiable
**CC2 (Phantom Hunt - Method #168):** Re-scan borderline items, fail if phantoms detected
**CC3 (Coherence - Method #84):** Verify delta math (base + new - removed = final), fail if mismatch

Counter-checks MUST be executed BEFORE gate evaluation.
Results logged in artifact `counter_check_results[]`.

---

## GATE ENFORCEMENT PATTERN (Binding)

Gates have severity levels:
- **BLOCKER:** Cannot proceed, process HALT
- **CRITICAL:** Transition to STATE_ERROR
- **ERROR:** Log warning, mark in process_log
- **WARNING:** Log only

Gate evaluation order:
1. Execute phase ENFORCED SEQUENCE
2. Execute 3 counter-checks (CC1/CC2/CC3)
3. Complete phase checklist
4. Evaluate gate conditions
5. If BLOCKER/CRITICAL fail → error handling
6. Else → transition to next state per transitions.yaml

---

## JUST-IN-TIME LOADING (ZASADA 12)

**CRITICAL PRINCIPLE:** Data for phase N appears at phase N. NOT earlier.

**Agent in STATE_INIT:**
- Reads: workflow.md (scenarios A-E), rules.md (this file), steps/step-01-init.md
- Does NOT read: step-02-ontology.md, step-03-template.md, etc. (loaded later)

**Agent in STATE_COVERAGE:**
- Reads: rules.md (this file), steps/step-07-coverage.md
- Does NOT read: other step files (not needed yet)

**Loading Pattern (in every step YAML frontmatter):**
```yaml
requires_load:
  - rules.md  # ALWAYS loaded first
  - data/[specific-configs-for-this-step]
```

**Execution:**
1. Read rules.md (shared rules - THIS FILE)
2. Read current step file (step-NN-*.md)
3. Execute ENFORCED SEQUENCE from step file
4. Load data files as needed (just-in-time)
5. Do NOT load future step files or unused configs

---

## SELF-CONTAINED THROUGH LOADING

Process is **self-contained** by having ALL necessary information in files.
Process is **just-in-time** by loading files ONLY when needed.

**NOT self-contained:** External dependencies, tribal knowledge, missing schemas
**IS self-contained:** All info in files, loaded progressively as needed

Example:
- Step-01 needs repo_inventory.schema.yaml → loads it in STEP 1
- Step-02 needs domain-ontology.schema.yaml → loads it in STEP 2
- Step-01 does NOT load domain-ontology.schema.yaml (not needed yet)

---

## DUPLICATION PROHIBITION

**ZERO TOLERANCE for duplication.**

If rule appears in multiple places:
1. Extract to rules.md (this file)
2. Reference from other files: "See rules.md section X"
3. Delete duplicates

If schema appears in multiple places:
1. Keep in data/schemas/[name].schema.yaml
2. Reference from steps: "Schema: data/schemas/[name].schema.yaml"
3. Delete duplicates

**CUI BONO Test (Method #59):** Duplication benefits AGENT (write once, reuse) but harms USER (inconsistency, maintenance burden, 60% token overhead).

---

## COHERENCE REQUIREMENTS (Method #84)

**Definitions STABLE:** Same term = same meaning everywhere
**No CONTRADICTIONS:** No conflicting statements
**No REDUNDANCY:** Each fact stated ONCE

Violations:
- Synonym confusion (same concept, different words)
- Homonym confusion (same word, different concepts)
- Version drift (rule updated in one place, not others)

Enforcement:
- Method #100 Vocabulary Consistency (extract all terms, identify synonyms/homonyms)
- Method #99 Multi-Artifact Coherence (reference integrity, naming consistency, interface compatibility)

---

## REVERSIBILITY REQUIREMENT (Method #114)

**Every decision MUST be traceable backward.**

For each output artifact:
1. Can trace to input sources (citations, file:line references)
2. Can reconstruct reasoning (decisions[] array in process-state.yaml)
3. Can verify against source (grounding checks pass)

If cannot trace backward → indicates gaps or shortcuts → BLOCKER.

---

## CUI BONO PRINCIPLE (Method #59)

**For every decision: WHO BENEFITS?**

- If decision benefits AGENT (less work, simpler implementation) → RED FLAG, requires justification
- If decision benefits USER (better quality, correct results, time savings) → PREFERRED

Examples:
- Sampling 50 files vs reading all → benefits AGENT (faster) but harms USER (75% entity loss)
- Incremental verification vs full regeneration → benefits USER (15 min vs 4 hours)

When RED FLAG detected → apply one of:
1. Justify with evidence (token limits, API constraints)
2. Reject decision, choose alternative that benefits USER
3. Escalate to user for explicit approval

---

## VERSION

**rules.md Version:** 7.1.0
**Compatible with:** workflow.md 7.1.0, steps/*.md 7.1.0

**Changelog:**
- 2026-02-11: Created rules.md extracting shared rules from workflow.md + orchestrator-agent.md
- Consolidated: PRIORITY, ANTI-BYPASS, EXECUTION, INCREMENTAL, QUALITY, EVR, ASSUMPTIONS, COUNTER-CHECKS, GATES, ZASADA 12, SELF-CONTAINED, DUPLICATION, COHERENCE, REVERSIBILITY, CUI BONO
