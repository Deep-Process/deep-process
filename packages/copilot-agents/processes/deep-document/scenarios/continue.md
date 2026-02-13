# SCENARIO C: CONTINUE
# Loaded after SCENARIO A or B
# Version: 7.1.0

**Purpose:** Execute current state and transition to next

---

## STEP 1: LOAD_STATE

1. Read process-state.yaml
2. Read execution_context.current_state
3. Load artifact registry

---

## STEP 2: STALENESS_CHECK

For current_state artifacts:
- status == "STALE" → regenerate required
- status == "IN_PROGRESS" → resume execution
- status == "FRESH" → advance

---

## STEP 3: ROUTING TO STEPS (Just-In-Time Loading)

**CRITICAL: Load ONLY current step file (see rules.md ZASADA 12)**

**Routing Table:**

| State | Step File | Load Just-In-Time |
|-------|-----------|-------------------|
| STATE_INIT | steps/step-01-init.md | Read tool: steps/step-01-init.md |
| STATE_ONTOLOGY_EXTRACTION | steps/step-02-ontology.md | Read tool: steps/step-02-ontology.md |
| STATE_TEMPLATE_ANALYSIS | steps/step-03-template.md | Read tool: steps/step-03-template.md |
| STATE_DETECTION | steps/step-04-detection.md | Read tool: steps/step-04-detection.md |
| STATE_PLANNING | steps/step-05-planning.md | Read tool: steps/step-05-planning.md |
| USER_REVIEW_PLAN | steps/step-06-user-review-plan.md | Read tool: steps/step-06-user-review-plan.md |
| STATE_COVERAGE | steps/step-07-coverage.md | Read tool: steps/step-07-coverage.md |
| STATE_EVIDENCE | steps/step-08-evidence.md | Read tool: steps/step-08-evidence.md |
| USER_REVIEW_EVIDENCE | steps/step-09-user-review-evidence.md | Read tool: steps/step-09-user-review-evidence.md |
| STATE_SYNTHESIS | steps/step-10-synthesis.md | Read tool: steps/step-10-synthesis.md |
| USER_REVIEW_DIAGRAMS | steps/step-11-user-review-diagrams.md | Read tool: steps/step-11-user-review-diagrams.md |
| STATE_GENERATION | steps/step-12-generation.md | Read tool: steps/step-12-generation.md |
| USER_REVIEW_DOCS | steps/step-13-user-review-docs.md | Read tool: steps/step-13-user-review-docs.md |
| STATE_VERIFICATION | steps/step-14-verification.md | Read tool: steps/step-14-verification.md |
| STATE_COMPLETE | steps/step-15-complete.md | Read tool: steps/step-15-complete.md |

**Execution Pattern:**
1. Read rules.md (if not already loaded)
2. Read tool: corresponding step-NN-*.md file (ONLY that file)
3. Step file is self-contained (ENFORCED SEQUENCE + schemas + counter-checks + gates)
4. Execute from step file
5. Evaluate GATE conditions (from step file)
6. Call utils/ functions as needed:
   - Read tool: utils/staleness.md (staleness propagation)
   - Read tool: utils/artifact-registry.md (artifact updates)
   - Read tool: utils/transitions.md (state transitions)
   - Read tool: utils/lock.md (concurrency control)
7. Update process-state.yaml
8. Transition to next state
9. Loop back to SCENARIO C (unless USER_REVIEW or COMPLETE)

---

## STEP 4: USER_REVIEW STATES

**IF current_state is USER_REVIEW_*:**
  → Read tool: scenarios/user-review.md

---

## STEP 5: COMPLETE STATE

**IF current_state == "STATE_COMPLETE":**
  → Read tool: scenarios/completed.md
