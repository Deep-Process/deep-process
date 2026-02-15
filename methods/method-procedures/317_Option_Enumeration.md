# M002: Option Enumeration

## Purpose

List ALL options for each dimension, not just obvious ones.

## Core Question

```
"What are ALL the ways to satisfy this dimension?"
```

## Procedure

### 1. List Obvious Options

```
DIMENSION: [name]

OBVIOUS OPTIONS:
• Option A: [description]
• Option B: [description]
```

### 2. Apply Expansion Prompts

```
CONTRARIAN: "What would someone who disagrees with conventional wisdom choose?"
→ [option]

EXTREME RESOURCES: "With unlimited resources?"
→ [option]

MINIMAL RESOURCES: "With almost no resources?"
→ [option]

HYBRID: "What combination of other options?"
→ [option]

NULL: "What if we chose nothing / delayed?"
→ [option]

ADJACENT: "What do similar problems use?"
→ [option]
```

### 3. Record Source

```
For each option:
• [Option] - source: [research / brainstorm / example / expert]
```

### 4. Remove Duplicates

```
Check: Are any options really the same thing with different names?
Merge if yes.
```

## Output

```
DIMENSION: [name]
├── Option A: [description] - source: ___
├── Option B: [description] - source: ___
├── Option C: [description] - source: ___
└── Option D: [description] - source: ___

TOTAL OPTIONS: [count]
```
