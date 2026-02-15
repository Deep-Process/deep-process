# E008: Failure Reason Exploration

## Purpose

Transform vague fear into a concrete map of risks. This is NOT pessimism - it's controlled risk exploration.

**When to use:** Early in exploration (Step 0) when user expresses fear, worry, or uncertainty.

**Related method:** M021 (Premortem) uses the same classification but is applied later to specific options.

## Core Question

```
"What EXACTLY would have to be true for this to NOT work?"
```

## Why This Matters

Fear is usually a fog. This method turns fog into a map.

Instead of: "I'm afraid this won't work"
You get: "Here are the 7 specific things that could fail, and 4 of them I can address"

---

## Procedure

### 1. Generate Failure Reasons

Force yourself to list 5-10 specific reasons why it might fail:

```
WHY THIS MIGHT NOT WORK:
1. [reason]
2. [reason]
3. [reason]
4. [reason]
5. [reason]
...
```

Don't filter. Include everything, even things that seem unlikely.

### 2. Classify Each Reason (Unified Taxonomy)

Use this UNIFIED CLASSIFICATION (shared with M021 Premortem):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FAILURE REASON TAXONOMY (used by E008 and M021)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STRUCTURAL (hard limits - cannot be worked around)                         │
│  ├── Physics, math, logic constraints                                       │
│  ├── Legal/regulatory requirements                                          │
│  ├── Economic fundamentals (market size, unit economics)                    │
│  └── Biological/human limitations                                           │
│                                                                              │
│  OPERATIONAL (constraints - can potentially be addressed)                   │
│  ├── Resources: time, money, people                                         │
│  ├── Skills: missing expertise, learning curve                              │
│  ├── Access: connections, permissions, tools                                │
│  └── Execution: coordination, timing, dependencies                          │
│                                                                              │
│  EXTERNAL (outside control - must monitor and adapt)                        │
│  ├── Market: competition, demand shifts, timing                             │
│  ├── Technology: platform changes, obsolescence                             │
│  ├── Environment: economic conditions, regulations                          │
│  └── Stakeholders: partner decisions, customer behavior                     │
│                                                                              │
│  COGNITIVE (assumptions - may not be real, need verification)               │
│  ├── Untested beliefs about users/market                                    │
│  ├── Assumed capabilities or limitations                                    │
│  ├── Inherited wisdom that may be outdated                                  │
│  └── Personal biases or fears without evidence                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

For each failure reason:

```
┌────────────────────────────┬────────────┬─────────────────────────────────┐
│ Failure Reason             │ Type       │ Evidence/Source                 │
├────────────────────────────┼────────────┼─────────────────────────────────┤
│ [reason 1]                 │ STRUCTURAL │ [why you believe this]          │
│ [reason 2]                 │ OPERATIONAL│ [why you believe this]          │
│ [reason 3]                 │ EXTERNAL   │ [why you believe this]          │
│ [reason 4]                 │ COGNITIVE  │ [why you believe this]          │
└────────────────────────────┴────────────┴─────────────────────────────────┘
```

### 3. Test Each Class

```
STRUCTURAL:
□ Is this truly a hard limit? Or just very difficult?
□ Has anyone found a way around it?
□ Am I sure about the underlying constraint?
→ If confirmed: BLOCKER
→ If uncertain: Move to COGNITIVE for verification

OPERATIONAL:
□ Can I acquire the resource/skill/time?
□ Is there a cheaper/faster alternative?
□ Can I partner/outsource/delegate?
→ If solvable: ADDRESSABLE with [solution]
→ If not solvable: Escalate to STRUCTURAL

EXTERNAL:
□ Can I influence this factor?
□ Can I monitor for early warning signs?
□ Can I build contingency plans?
→ Output: MONITOR + CONTINGENCY

COGNITIVE:
□ How do I know this is true?
□ What evidence do I have?
□ What would change my mind?
→ If evidence exists: Reclassify to correct type
→ If no evidence: IMAGINARY (dismiss) or UNVERIFIED (research)
```

### 4. Transform Fear to Map

```
UNCERTAINTY MAP:

BLOCKERS (confirmed structural limits):
• [reason] - cannot proceed unless: ___
  Action: STOP or PIVOT

ADDRESSABLE (operational, have solutions):
• [reason] - solution: ___
  Action: PLAN + EXECUTE

MONITOR (external, outside control):
• [reason] - early warning: ___
  Action: WATCH + CONTINGENCY

UNVERIFIED (cognitive, need research):
• [reason] - to verify: ___
  Action: ADD TO RESEARCH QUEUE

DISMISSED (cognitive, no evidence):
• [reason] - evidence against: ___
  Action: PROCEED (don't let this stop you)
```

---

## Output

```
FAILURE REASON EXPLORATION

Original fear: "[vague fear]"

BREAKDOWN:
┌────────────────────────────┬────────────┬────────────┬──────────────────┐
│ Failure Reason             │ Type       │ Status     │ Action           │
├────────────────────────────┼────────────┼────────────┼──────────────────┤
│ [reason 1]                 │ STRUCTURAL │ BLOCKER    │ Pivot/Stop       │
│ [reason 2]                 │ OPERATIONAL│ ADDRESSABLE│ [solution]       │
│ [reason 3]                 │ EXTERNAL   │ MONITOR    │ [contingency]    │
│ [reason 4]                 │ COGNITIVE  │ UNVERIFIED │ Research         │
│ [reason 5]                 │ COGNITIVE  │ DISMISSED  │ Proceed          │
└────────────────────────────┴────────────┴────────────┴──────────────────┘

SUMMARY:
• BLOCKERS: [count] - [stop/pivot required?]
• ADDRESSABLE: [count] - [solutions identified]
• MONITOR: [count] - [contingencies needed]
• RESEARCH: [count] - [add to queue]
• DISMISSED: [count] - [fears cleared]

FEAR CLARITY: fog → map
```

---

## Relationship to M021 (Premortem)

| Aspect | E008 (This method) | M021 (Premortem) |
|--------|-------------------|------------------|
| **Trigger** | Vague fear/worry | Specific option to analyze |
| **When** | Step 0 (early) | Step 4 (after options mapped) |
| **Input** | "I'm afraid..." | "If we chose X..." |
| **Focus** | Clearing fear fog | Stress-testing options |
| **Classification** | Same taxonomy | Same taxonomy |
| **Output** | Uncertainty map | Mitigation plan |

**Use E008 when:** User expresses fear before options are clear.
**Use M021 when:** Analyzing a specific option's failure modes.

Both methods share the same classification taxonomy for consistency.

---

## Integration

Use in: Step 0 (when fear_analysis=on), Step 4 (to revisit unresolved fears)
