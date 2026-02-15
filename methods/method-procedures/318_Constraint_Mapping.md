# M003: Constraint Mapping

## Purpose

Identify what combinations are impossible or difficult.

## Core Question

```
"Which combinations cannot exist together?"
```

## Procedure

### 1. Identify Hard Constraints

```
HARD = combination is IMPOSSIBLE

For each potential constraint:

CONSTRAINT: [D1:A + D2:B] is impossible
REASON: [why they can't coexist]
SOURCE: [VERIFIED by research / ASSUMED]
CONFIDENCE: [HIGH / MED / LOW]

If LOW confidence → flag for verification in Step 1
```

### 2. Identify Soft Constraints

```
SOFT = combination is DIFFICULT but possible

CONSTRAINT: [combination] is difficult
REASON: [what makes it hard]
COST: [what it would take]
```

### 3. Challenge Constraints

```
For each "hard" constraint, ask:

"Is this truly impossible, or just hard?"
"Has anyone done this combination successfully?"
"What would need to change to make this possible?"

RESULT:
[ ] Confirmed HARD
[ ] Downgrade to SOFT
[ ] Remove (not really a constraint)
```

### 4. Calculate Impact

```
TOTAL COMBINATIONS: [D1 options × D2 options × ...]
ELIMINATED BY HARD: [count]
REMAINING VALID: [count]

If >50% eliminated → constraints may be too aggressive
If <10% eliminated → constraints may be missing
```

## Output

```
HARD CONSTRAINTS:
┌───────────────────────────────────┬────────────┬──────────────┐
│ Constraint                        │ Confidence │ Source       │
├───────────────────────────────────┼────────────┼──────────────┤
│ [D1:A + D2:B] impossible because..│ HIGH       │ VERIFIED     │
│ [D3:C] requires [condition]       │ MED        │ ASSUMED      │
└───────────────────────────────────┴────────────┴──────────────┘

SOFT CONSTRAINTS:
• [combination] difficult because: ___

VALID COMBINATIONS: [N] of [total]
```
