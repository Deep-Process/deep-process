# E004: Boundary Analysis

## Purpose

Find where things stop working. Boundaries reveal structure.

## Core Question

```
"When does [X] NOT work?"
```

## Procedure

### 1. State the Claim

```
CLAIM: "[what you believe works]"
```

### 2. Apply Boundary Questions

```
QUANTITY:
• Minimum where it works: ___
• Maximum where it works: ___
• Sweet spot: ___

QUALITY:
• Works for: [types]
• Fails for: [types]
• Edge cases: [borderline]

TIME:
• How long valid: ___
• When expires: ___
• How degrades: ___

COMBINATION:
• Works with: ___
• Fails with: ___

ENVIRONMENT:
• Requires: ___
• Cannot tolerate: ___
• Assumes: ___
```

### 3. Extract Insights

From each boundary:
```
STRUCTURE: "This limit reveals [internal structure]"
DEPENDENCY: "This limit shows dependence on [X]"
ASSUMPTION: "This limit exposes assumption [Y]"
RISK: "This limit means risk when [condition]"
```

### 4. Define Operating Envelope

```
WORKS WHEN:
[list of conditions]

FAILS WHEN:
[list of conditions]
```

## Output

```
CLAIM: "[statement]"

BOUNDARIES:
┌─────────────┬──────────────────────────┐
│ Dimension   │ Limit                    │
├─────────────┼──────────────────────────┤
│ Quantity    │ min: ___ max: ___       │
│ Quality     │ works: ___ fails: ___   │
│ Time        │ valid: ___ expires: ___ │
│ Environment │ requires: ___           │
└─────────────┴──────────────────────────┘

OPERATING ENVELOPE:
"Works when ___, fails when ___"

INSIGHTS: [what boundaries reveal]
```
