# M021: Premortem

## Purpose

Imagine failure and trace its causes before it happens. Stress-test a specific option.

**When to use:** Step 4 (Challenge) when analyzing specific options that have been mapped.

**Related method:** E008 (Failure Reason Exploration) uses the same classification but is applied earlier for vague fears.

## Core Question

```
"It's [time later]. We chose [X]. It failed. What went wrong?"
```

---

## Procedure

### 1. Set the Scene

```
OPTION: [specific option being analyzed]
TIMEFRAME: [how far in future - typically 6-12 months]
SCENARIO: "We chose [option]. It failed badly. Looking back..."
```

### 2. Generate Failure Causes

Write as if failure already happened (hindsight mode):

```
"The project failed because..."

CAUSES (force at least 5):
1. [cause]
2. [cause]
3. [cause]
4. [cause]
5. [cause]
```

### 3. Classify Each Cause (Unified Taxonomy)

Use this UNIFIED CLASSIFICATION (shared with E008 Failure Reason Exploration):

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

```
┌────────────────────────────┬────────────┬──────────────────────────────────┐
│ Cause                      │ Type       │ Why this type                    │
├────────────────────────────┼────────────┼──────────────────────────────────┤
│ [cause 1]                  │ STRUCTURAL │ [explanation]                    │
│ [cause 2]                  │ OPERATIONAL│ [explanation]                    │
│ [cause 3]                  │ EXTERNAL   │ [explanation]                    │
│ [cause 4]                  │ COGNITIVE  │ [explanation]                    │
└────────────────────────────┴────────────┴──────────────────────────────────┘
```

### 4. Assess Preventability

For each cause:

```
CAUSE: [description]
TYPE: [STRUCTURAL/OPERATIONAL/EXTERNAL/COGNITIVE]

PREVENTABILITY:
□ Could we have seen this coming? [Y/N]
□ Is this within our control? [FULL/PARTIAL/NONE]
□ What would have prevented it? [action]

CLASSIFICATION:
[ ] PREVENTABLE - we can act now to avoid this
[ ] INFLUENCEABLE - we can reduce probability/impact
[ ] UNPREVENTABLE - true uncertainty, need contingency
```

### 5. Assess Survivability

```
IF THIS OPTION FAILS:

What's the worst case scenario?
[description]

Can we recover from worst case? [Y/N]
Recovery path: [how we would recover]

Is worst case survivable? [Y/N]
If NO → Consider rejecting this option

REVERSIBILITY:
[ ] HIGH - can easily switch to alternative
[ ] MEDIUM - can switch with significant cost
[ ] LOW - difficult to undo
[ ] IRREVERSIBLE - point of no return
```

### 6. Build Mitigation Plan

```
FOR PREVENTABLE CAUSES:
┌────────────────────────────┬──────────────────────────────────────────────┐
│ Cause                      │ Mitigation (do before choosing)              │
├────────────────────────────┼──────────────────────────────────────────────┤
│ [cause]                    │ [specific action to prevent]                 │
│ [cause]                    │ [specific action to prevent]                 │
└────────────────────────────┴──────────────────────────────────────────────┘

FOR INFLUENCEABLE CAUSES:
┌────────────────────────────┬──────────────────────────────────────────────┐
│ Cause                      │ Risk Reduction (do to reduce likelihood)     │
├────────────────────────────┼──────────────────────────────────────────────┤
│ [cause]                    │ [action to reduce probability/impact]        │
│ [cause]                    │ [action to reduce probability/impact]        │
└────────────────────────────┴──────────────────────────────────────────────┘

FOR UNPREVENTABLE CAUSES:
┌────────────────────────────┬──────────────────────────────────────────────┐
│ Cause                      │ Contingency (plan if it happens)             │
├────────────────────────────┼──────────────────────────────────────────────┤
│ [cause]                    │ [what to do if this happens]                 │
│ [cause]                    │ [what to do if this happens]                 │
└────────────────────────────┴──────────────────────────────────────────────┘

EARLY WARNING SIGNS:
• [signal that indicates this cause is materializing]
• [signal that indicates this cause is materializing]
```

---

## Output

```
PREMORTEM: [option name]

FAILURE SCENARIO: "We chose [option] and it failed because..."

CAUSE ANALYSIS:
┌────────────────────────┬────────────┬──────────────┬──────────────────┐
│ Cause                  │ Type       │ Preventable? │ Action           │
├────────────────────────┼────────────┼──────────────┼──────────────────┤
│ [cause 1]              │ STRUCTURAL │ NO           │ Contingency      │
│ [cause 2]              │ OPERATIONAL│ YES          │ [mitigation]     │
│ [cause 3]              │ EXTERNAL   │ PARTIAL      │ Monitor + reduce │
│ [cause 4]              │ COGNITIVE  │ YES          │ Verify first     │
└────────────────────────┴────────────┴──────────────┴──────────────────┘

SUMMARY:
• Preventable causes: [count] → Mitigate before proceeding
• Influenceable causes: [count] → Reduce probability/impact
• Unpreventable causes: [count] → Accept or reject option

SURVIVABILITY:
• Worst case: [description]
• Recoverable: [Y/N]
• Reversibility: [HIGH/MEDIUM/LOW/IRREVERSIBLE]

VERDICT:
[ ] PROCEED - risks acceptable, mitigations identified
[ ] PROCEED WITH CAUTION - significant risks, need mitigation plan first
[ ] RECONSIDER - high unpreventable risks, consider alternatives
[ ] REJECT - unacceptable worst case or too many structural blockers
```

---

## Relationship to E008 (Failure Reason Exploration)

| Aspect | E008 (Failure Reason) | M021 (This method) |
|--------|----------------------|-------------------|
| **Trigger** | Vague fear/worry | Specific option to stress-test |
| **When** | Step 0 (early) | Step 4 (after options mapped) |
| **Input** | "I'm afraid..." | "If we chose X..." |
| **Focus** | Clearing fear fog | Option viability assessment |
| **Classification** | Same taxonomy | Same taxonomy |
| **Output** | Uncertainty map | Mitigation plan + verdict |

**Use E008 when:** User expresses fear before options are clear.
**Use M021 when:** You have a specific option and want to stress-test it.

**If E008 was done earlier:** Review its output - some causes may already be classified.

Both methods share the same classification taxonomy for consistency.

---

## Integration

Use in: Step 4 (Challenge) - apply to top 2-3 options being considered
