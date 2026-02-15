# M023: Assumption Stress Test

## Purpose

Break each key assumption to see what happens.

## Core Question

```
"What if [assumption] is wrong?"
```

## Procedure

### 1. List Key Assumptions

```
From exploration so far, what are we assuming?

ASSUMPTIONS:
• [assumption 1] - confidence: [HIGH/MED/LOW]
• [assumption 2] - confidence: [HIGH/MED/LOW]
• [assumption 3] - confidence: [HIGH/MED/LOW]
```

### 2. Stress Test Each

```
ASSUMPTION: "[statement]"
CONFIDENCE: [level]

STRESS TESTS:

1. "What would disprove this?"
   → [what evidence would show it's wrong]

2. "Is there evidence against it we're ignoring?"
   → [check for disconfirming evidence]

3. "Who would disagree with this?"
   → [whose perspective conflicts]

4. "What if this is 50% wrong?"
   → [what changes if partially wrong]

5. "What's the opposite assumption?"
   → [state the inverse]
   → [is the inverse plausible?]
```

### 3. Assess Results

```
RESULT:
[ ] HOLDS - assumption survives stress test
[ ] WEAKENED - need to reduce confidence
[ ] BROKEN - assumption was wrong, update everything

If WEAKENED or BROKEN:
What in our map needs to change?
```

### 4. Update

```
HOLDS:
Keep assumption, note it was tested

WEAKENED:
• Reduce confidence: [HIGH→MED] or [MED→LOW]
• Add conditions: "Only true when ___"

BROKEN:
• Remove assumption
• Update all conclusions that depended on it
• May need to return to earlier steps
```

## Output

```
ASSUMPTION STRESS TEST:

┌─────────────────────────┬────────────┬──────────┬─────────────┐
│ Assumption              │ Confidence │ Result   │ Action      │
├─────────────────────────┼────────────┼──────────┼─────────────┤
│ [assumption 1]          │ HIGH       │ HOLDS    │ Keep        │
│ [assumption 2]          │ MED        │ WEAKENED │ Add cond.   │
│ [assumption 3]          │ LOW        │ BROKEN   │ Remove      │
└─────────────────────────┴────────────┴──────────┴─────────────┘

MAP UPDATES NEEDED:
• [what changes based on broken/weakened assumptions]
```
