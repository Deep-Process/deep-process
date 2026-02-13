---
step: 13
name: "User Review: Documentation"
state: "USER_REVIEW_DOCS"
time_estimate: "10-20 minutes (user decision)"
goal: "User approves, rejects, or revises documentation"
requires_completion: true
next_steps: ["step-14-verification.md"]
data_dependencies: ["docs/*.md"]
outputs: ["docs-approval.yaml"]
---

# USER_REVIEW_DOCS

**Input:** docs/*.md
**Output:** docs-approval.yaml

## USER DECISION REQUIRED

**STEP 1: DISPLAY**
- Show documentation summary: document count, quality metrics, [UNKNOWN] ratio

**STEP 2: WAIT FOR USER**
Display options as TEXT OUTPUT:
```
[APPROVE] - Accept documentation and proceed to STATE_VERIFICATION
[REJECT]  - Halt process and log reason
[REVISE]  - Request revisions and rerun STATE_GENERATION

Your choice: [APPROVE/REJECT/REVISE]
```

Wait for user text input (APPROVE, REJECT, or REVISE)
- Read user's message
- Extract choice (case-insensitive)
- Validate choice is one of: APPROVE, REJECT, REVISE
- IF invalid → display options again

**STEP 3: CHECKLIST (GATE_UD)**
```
[ ] User decision recorded (CRITICAL)
[ ] Decision logged in process-state.yaml decisions[] (CRITICAL)
```

**STEP 4: TRANSITION**
- IF user APPROVE → evaluate GATE_UD → STATE_VERIFICATION
- IF user REJECT → log reason → STATE_HALT
- IF user REVISE → prompt for revisions → RERUN STATE_GENERATION
