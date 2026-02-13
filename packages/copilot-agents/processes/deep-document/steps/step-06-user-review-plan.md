---
step: 6
name: "User Review: Plan"
state: "USER_REVIEW_PLAN"
time_estimate: "5-15 minutes (user decision)"
goal: "User approves, rejects, or modifies documentation plan"
requires_completion: true
next_steps: ["step-07-coverage.md"]
data_dependencies: ["documentation-plan.yaml"]
outputs: ["plan-approval.yaml"]
---

# USER_REVIEW_PLAN

**Input:** documentation-plan.yaml
**Output:** plan-approval.yaml

## USER DECISION REQUIRED

**STEP 1: DISPLAY**
- Show plan summary: documents, sections, diagrams, scope estimate
- Show semantic matching: match_ratio, unmatched_sections[]
- Show template coverage: sections_matched / total_template_sections

**STEP 2: WAIT FOR USER**
Display options as TEXT OUTPUT:
```
[APPROVE] - Accept plan and proceed to STATE_COVERAGE
[REJECT]  - Halt process and log reason
[MODIFY]  - Request changes and rerun STATE_PLANNING

Your choice: [APPROVE/REJECT/MODIFY]
```

Wait for user text input (APPROVE, REJECT, or MODIFY)
- Read user's message
- Extract choice (case-insensitive)
- Validate choice is one of: APPROVE, REJECT, MODIFY
- IF invalid → display options again

**STEP 3: CHECKLIST (GATE_UA)**
```
[ ] User decision recorded (CRITICAL)
[ ] Decision logged in process-state.yaml decisions[] (CRITICAL)
```

**STEP 4: TRANSITION**
- IF user APPROVE → evaluate GATE_UA → STATE_COVERAGE
- IF user REJECT → log reason → STATE_HALT
- IF user MODIFY → prompt for changes → RERUN STATE_PLANNING with modifications
