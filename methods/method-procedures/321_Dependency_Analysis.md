# M013: Dependency Analysis

## Purpose

Map which decisions must come before others.

## Core Question

```
"What must be decided before we can decide [X]?"
```

## Procedure

### 1. List All Decisions

```
DECISIONS TO MAKE:
• [decision 1]
• [decision 2]
• [decision 3]
```

### 2. Map Dependencies

```
For each decision:

DECISION: [name]

BLOCKS: [what can't be decided until this is decided]
• [decision]
• [decision]

BLOCKED BY: [what must be decided first]
• [decision]
• [decision]
```

### 3. Find Critical Path

```
SEQUENCE:

1. FIRST (no dependencies):
   • [decision] - because: nothing blocks it

2. SECOND (depends on #1):
   • [decision] - after: [what]

3. LATER (depends on earlier):
   • [decision] - after: [what]

4. INDEPENDENT (can do anytime):
   • [decision] - no dependencies
```

### 4. External Dependencies

```
EXTERNAL (not in our control):
• [dependency] - controlled by: [who] - status: [known/unknown]
• [dependency] - controlled by: [who] - status: [known/unknown]
```

## Output

```
DEPENDENCY MAP:

[Decision A] ──► [Decision B] ──► [Decision D]
                      │
                      └──► [Decision C]

[Decision E] (independent)

SEQUENCE:
1. First: [list]
2. Next: [list]
3. Later: [list]
4. Anytime: [list]

EXTERNAL: [list with status]
```
