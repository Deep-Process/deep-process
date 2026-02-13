---
step: 9
name: "User Review: Evidence"
state: "USER_REVIEW_EVIDENCE"
time_estimate: "5-10 minutes (user decision)"
goal: "User approves, rejects, or supplements evidence"
requires_completion: true
next_steps: ["step-10-synthesis.md"]
data_dependencies: ["evidence_map.yaml"]
outputs: ["evidence-approval.yaml"]
---

# USER_REVIEW_EVIDENCE

**Input:** evidence_map.yaml
**Output:** evidence-approval.yaml

## USER DECISION REQUIRED

**STEP 1: DISPLAY**
- Show evidence summary: claim counts, verifiability ratio, [UNKNOWN] ratio
- Show: VERIFIED count, INFERRED count, UNKNOWN count

**STEP 2: WAIT FOR USER**
Display options as TEXT OUTPUT:
```
[APPROVE]    - Accept evidence and proceed to STATE_SYNTHESIS
[REJECT]     - Halt process and log reason
[SUPPLEMENT] - Add more evidence and rerun STATE_EVIDENCE

Your choice: [APPROVE/REJECT/SUPPLEMENT]
```

Wait for user text input (APPROVE, REJECT, or SUPPLEMENT)
- Read user's message
- Extract choice (case-insensitive)
- Validate choice is one of: APPROVE, REJECT, SUPPLEMENT
- IF invalid → display options again

**STEP 3: CHECKLIST (GATE_UB)**
```
[ ] User decision recorded (CRITICAL)
[ ] Decision logged in process-state.yaml decisions[] (CRITICAL)
```

**STEP 4: TRANSITION**
- IF user APPROVE → evaluate GATE_UB → STATE_SYNTHESIS
- IF user REJECT → log reason → STATE_HALT
- IF user SUPPLEMENT → prompt for additional evidence → RERUN STATE_EVIDENCE
