# E002: Counterfactual Thinking

## Purpose

Identify causal factors by asking "what if X didn't exist?"

## Core Question

```
"If [X] did not exist, would [Y] still occur?"
```

## Procedure

### 1. List System Elements

```
ELEMENTS:
├── [element 1]
├── [element 2]
├── [element 3]
└── ...
```

### 2. Subtraction Test

For each element:

```
ELEMENT: [name]

"If [element] didn't exist..."
• What would NOT happen: ___
• What would be different: ___
• What would stay the same: ___

TYPE:
[ ] NECESSARY - without it, result doesn't occur
[ ] SUFFICIENT - alone causes result
[ ] CATALYST - accelerates but not required
[ ] BACKGROUND - must exist but not causal
```

### 3. Find Leverage Points

```
HIGH LEVERAGE (change here = big effect):
• [element] - affects: ___

CHOKE POINTS (bottlenecks):
• [element] - blocks: ___

REDUNDANT (removal changes nothing):
• [element] - because: ___
```

### 4. Test Causation vs Correlation

For claims "A causes B":

```
CLAIM: "[A] causes [B]"

TEST: "If [A] didn't exist, would [B] still occur?"
• YES → correlation, not causation
• NO → A may be causal
• DEPENDS → A is contributing factor
```

## Output

```
ELEMENT CLASSIFICATION:
┌──────────────┬────────────┬──────────┐
│ Element      │ Type       │ Leverage │
├──────────────┼────────────┼──────────┤
│ [name]       │ NECESSARY  │ HIGH     │
│ [name]       │ CATALYST   │ MED      │
└──────────────┴────────────┴──────────┘

LEVERAGE POINTS: [list]
CAUSATION TESTS: [results]
```
