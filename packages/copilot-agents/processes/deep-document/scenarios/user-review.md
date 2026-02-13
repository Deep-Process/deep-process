# SCENARIO D: USER_REVIEW
# Loaded just-in-time at USER_REVIEW_* states
# Version: 7.1.0

**Purpose:** User approval checkpoint

---

## STEP 1: LOAD_ARTIFACT

By review state:
- USER_REVIEW_PLAN → documentation-plan.yaml
- USER_REVIEW_EVIDENCE → evidence_map.yaml
- USER_REVIEW_DIAGRAMS → architectural-model.json
- USER_REVIEW_DOCS → docs/*.md

---

## STEP 2: DISPLAY_SUMMARY

Show artifact summary with key metrics.

---

## STEP 3: USER_DECISION

**Display as TEXT (no AskUserQuestion - see rules.md ANTI-BYPASS RULE 5):**

```
REVIEW OPTIONS:
[A] APPROVE
[R] REJECT
[M] MODIFY

Your choice: [A/R/M]
```

**WAIT for user message with choice (A/R/M).**

---

## STEP 4: EXECUTE

- **A (APPROVE):** Update approval flag, transition to next state per transitions.yaml → Read tool: scenarios/continue.md
- **R (REJECT):** Set current_state = "STATE_HALT", log reason → EXIT
- **M (MODIFY):** Set mode = "RERUN", prompt for improvement_request, transition back to processing state → Read tool: scenarios/continue.md
