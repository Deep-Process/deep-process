# 002 - Level-of-Analysis Selection

## Phase
SCOPE

## Purpose
Explicitly choose the level of abstraction for synthesis. Different levels produce different (and potentially contradictory) conclusions. This prevents Simpson's Paradox, ecological fallacy, and atomistic fallacy.

## Abstraction Levels

| Level | Description | Example | Risk |
|-------|-------------|---------|------|
| **Atomic** | Individual facts, events, data points | "Server X crashed at 14:32" | Atomistic fallacy — can't generalize |
| **Pattern** | Recurring relationships across atoms | "Crashes correlate with memory pressure" | Correlation ≠ causation |
| **Structural** | Underlying mechanisms and models | "Memory leak in service Y causes cascading failures" | Model may not match reality |
| **Systemic** | System-wide dynamics and behaviors | "Our incident response is reactive, not preventive" | Ecological fallacy |
| **Paradigmatic** | Fundamental assumptions and worldviews | "We treat reliability as a feature, not a requirement" | Hard to detect from inside |

## Procedure

### Step 1: Target Level Identification
What level does the synthesis question target?
- Match the level to the question's intent
- Higher levels = broader applicability but less precision
- Lower levels = more precision but less generalizability

### Step 2: Source Level Assessment
At what level do the sources operate?
- List each source and its level
- Sources at different levels need alignment

### Step 3: Cross-Level Interaction Analysis
Are there CROSS-LEVEL interactions?
- Does an atomic detail change systemic understanding?
- Does a systemic insight reframe atomic facts?
- These interactions are often the most valuable synthesis findings

### Step 4: Transfer Limitation Documentation
Where do conclusions NOT transfer between levels?
- Aggregate findings may not apply to individuals (ecological fallacy)
- Individual findings may not generalize to groups (atomistic fallacy)
- State these limitations explicitly

## Output Schema
```yaml
level_selection:
  target_level: "[Atomic/Pattern/Structural/Systemic/Paradigmatic]"
  source_levels:
    - source: "[Source 1]"
      level: "[Level]"
    - source: "[Source 2]"
      level: "[Level]"
  cross_level_interactions:
    - description: "[Interaction]"
      significance: "[Why it matters]"
  transfer_limitations:
    - "[What conclusions don't transfer to other levels]"
```

## Quality Checks
- [ ] Target level explicitly stated
- [ ] All source levels identified
- [ ] Level alignment issues noted
- [ ] Cross-level interactions explored
- [ ] Transfer limitations documented

## Connections
- Feeds into: #201 (Claim Extraction), #307 (Level Alignment Check)
- Grounded in: Simpson's Paradox, Ecological/Atomistic Fallacy
- Revisit if: New sources at different levels added
