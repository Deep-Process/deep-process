---
step: 11
name: "User Review: Diagrams"
state: "USER_REVIEW_DIAGRAMS"
time_estimate: "5-10 minutes (user decision)"
goal: "User approves, rejects, or adds diagrams"
requires_completion: true
next_steps: ["step-12-generation.md"]
data_dependencies: ["architectural-model.json"]
outputs: ["diagram-approval.yaml"]
---

# USER_REVIEW_DIAGRAMS

**Input:** architectural-model.json
**Output:** diagram-approval.yaml

## USER DECISION REQUIRED

**STEP 1: DISPLAY**
- Show diagram summary: count, coverage, centrality prioritization
- Show: high-priority diagrams (top 20% centrality)

**STEP 2: WAIT FOR USER**
Display options as TEXT OUTPUT:
```
[APPROVE]      - Accept diagrams and proceed to STATE_GENERATION
[REJECT]       - Halt process and log reason
[ADD_DIAGRAMS] - Add more diagrams and rerun STATE_SYNTHESIS

Your choice: [APPROVE/REJECT/ADD_DIAGRAMS]
```

Wait for user text input (APPROVE, REJECT, or ADD_DIAGRAMS)
- Read user's message
- Extract choice (case-insensitive)
- Validate choice is one of: APPROVE, REJECT, ADD_DIAGRAMS
- IF invalid → display options again

**STEP 3: CHECKLIST (GATE_UC)**
```
[ ] User decision recorded (CRITICAL)
[ ] Decision logged in process-state.yaml decisions[] (CRITICAL)
```

**STEP 4: TRANSITION**
- IF user APPROVE → evaluate GATE_UC → STATE_GENERATION
- IF user REJECT → log reason → STATE_HALT
- IF user ADD_DIAGRAMS → prompt for additions → RERUN STATE_SYNTHESIS
