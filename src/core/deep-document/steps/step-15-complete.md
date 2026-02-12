---
step: 15
name: "Complete"
state: "STATE_COMPLETE"
agent: "orchestrator-agent.md"
time_estimate: "N/A"
goal: "Documentation complete, offer post-completion options"
requires_completion: false
next_steps: []
data_dependencies: []
outputs: []
---

# STATE_COMPLETE

## COMPLETION ACTIONS

**STEP 1: DISPLAY**
- Show completion summary: all artifacts FRESH, all gates PASS, total time, token usage

**STEP 2: OFFER OPTIONS**
Display options as TEXT OUTPUT:
```
[VERIFY_IMPROVE] - Incremental verification (8 state options, UPDATED: 6 → 8)
[AMEND_QUALITY] - Quality-only improvements (V6.2.1)
[RESET] - Start over
[EXIT] - Exit process

Your choice: [VERIFY_IMPROVE/AMEND_QUALITY/RESET/EXIT]
```

**STEP 3: WAIT FOR USER COMMAND**
Wait for user text input (VERIFY_IMPROVE, AMEND_QUALITY, RESET, or EXIT)
- Read user's message
- Extract command (case-insensitive)
- Validate command is one of: VERIFY_IMPROVE, AMEND_QUALITY, RESET, EXIT
- IF invalid → display options (STEP 2) again and wait

**STEP 4: EXECUTE COMMAND**
- VERIFY_IMPROVE → Display submenu as TEXT OUTPUT:
  ```
  SELECT STATE TO VERIFY:
  [1] INVENTORY (verify files)
  [2] ONTOLOGY (verify entities) ← NEW V7
  [3] TEMPLATE (verify sections) ← NEW V7
  [4] COVERAGE (verify segments)
  [5] EVIDENCE (verify claims)
  [6] DIAGRAMS (verify architecture)
  [7] DOCUMENTATION (verify docs)
  [8] VERIFICATION (verify tests)

  Your choice: [1-8]
  ```
  Wait for user text input (digit 1-8)
  - Read user's message, extract choice
  - Validate choice is 1-8
  - IF invalid → display submenu again
  → Transition to selected state with mode=INCREMENTAL
- AMEND_QUALITY → transition to STATE_QUALITY_AMENDMENT with mode=QUALITY
- RESET → transition to STATE_INIT with mode=FULL
- EXIT → terminate process
