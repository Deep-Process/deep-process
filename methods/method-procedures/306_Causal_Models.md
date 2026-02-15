# E005: Causal Models

## Purpose

Map influence relationships, not just correlations.

## Core Questions

```
"What influences what?"
"In what order?"
"What is the mechanism?"
```

## Notation

```
A → B       A causes/enables B
A ⊣ B       A inhibits/blocks B
A → M → B   A causes B through M
A ← C → B   C causes both (confounder)
A → B → A   Feedback loop
```

## Procedure

### 1. List Variables

```
OUTCOMES (what we want):
• [variable]

INPUTS (what we control):
• [variable]

INTERMEDIATES (what's between):
• [variable]

EXTERNALS (what we don't control):
• [variable]
```

### 2. Map Relationships

For each pair, ask:
```
Does [A] influence [B]? [Y/N]
Direction? [+ positive / - negative]
Direct or through something? [direct / through X]
```

Record:
```
A [→/⊣] B — because: [mechanism]
```

### 3. Find Confounders

For each correlation:
```
"A and B occur together"

Is there C causing both?
A ← C → B ?

If YES: correlation is spurious
```

### 4. Find Feedback Loops

```
POSITIVE LOOP (self-reinforcing):
A → B → A (more A → more B → more A)

NEGATIVE LOOP (self-limiting):
A → B ⊣ A (more A → more B → less A)
```

### 5. Find Intervention Points

```
HIGH LEVERAGE:
• [variable] - upstream, affects many
• [loop] - can change system dynamics

LOW LEVERAGE:
• [variable] - downstream, limited effect
```

## Output

```
CAUSAL MODEL:

[variable 1]
    │
    ▼
[variable 2] ──────► [variable 3]
    │                    │
    ▼                    ▼
[variable 4] ◄────── [variable 5]

RELATIONSHIPS:
• A → B (because: ___)
• C ⊣ D (because: ___)

CONFOUNDERS:
• A←X→B (X causes both)

FEEDBACK LOOPS:
• [describe]

INTERVENTION POINTS:
• [where to act for effect]
```
