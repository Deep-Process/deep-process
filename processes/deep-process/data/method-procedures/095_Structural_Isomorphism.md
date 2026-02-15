# Method #95: Structural Isomorphism

## Classification
- **Category:** Coherence
- **Phase:** Validation
- **Purpose:** Compare structure of new element against existing patterns

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Measure structure (nesting/length/complexity/size) of new vs existing    │
│   elements - delta above 30% needs justification"                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Structural Metrics

| Metric | Description | How to Measure |
|--------|-------------|----------------|
| **Nesting Depth** | Maximum indentation level | Count header levels (##, ###, ####) |
| **Section Count** | Number of top-level sections | Count ## headers |
| **Subsection Ratio** | Subsections per section | Total ### / Total ## |
| **Line Count** | Total content lines | Count non-empty lines |
| **Code/Prose Ratio** | Code blocks vs text | Lines in ``` / Total |
| **List Density** | Use of bullet points | List items / Total lines |
| **Link Density** | References and links | Link count / Section count |

## Execution Protocol

### Step 1: Identify Comparison Set

Find similar existing artifacts:

```markdown
## Comparison Set

New element: EPIC-AUTH-FLOW (type: artifact/epic)

Similar existing elements:
1. EPIC-USER-PROFILE - same type, similar scope
2. EPIC-PAYMENT-FLOW - same type, similar complexity
3. EPIC-NOTIFICATION - same type, smaller scope

Using: Average of 1, 2, 3 as baseline
```

### Step 2: Measure Structures

```markdown
## Structural Measurements

| Metric | Baseline (avg) | New Element | Delta | Status |
|--------|----------------|-------------|-------|--------|
| Nesting Depth | 3 | 5 | +67% | ⚠️ OVER |
| Section Count | 6 | 8 | +33% | ⚠️ OVER |
| Subsection Ratio | 2.0 | 2.5 | +25% | ✅ OK |
| Line Count | 150 | 280 | +87% | ⚠️ OVER |
| Code/Prose Ratio | 0.1 | 0.4 | +300% | ⚠️ OVER |
| List Density | 0.3 | 0.25 | -17% | ✅ OK |
| Link Density | 1.5 | 1.2 | -20% | ✅ OK |
```

### Step 3: Delta Analysis

For each metric > 30% delta:

```markdown
## Delta Justification Required

### Nesting Depth: +67%
- Baseline: 3 levels
- New element: 5 levels
- Justification: [REQUIRED]
- Possible reasons:
  - Content genuinely more complex
  - Over-engineering structure
  - Should be split into sub-artifacts

### Line Count: +87%
- Baseline: 150 lines
- New element: 280 lines
- Justification: [REQUIRED]
- Possible reasons:
  - More comprehensive coverage
  - Verbose writing style
  - Should be split

### Code/Prose Ratio: +300%
- Baseline: 10% code
- New element: 40% code
- Justification: [REQUIRED]
- Possible reasons:
  - Technical artifact needs examples
  - Wrong artifact type (should be code doc?)
  - Excessive examples
```

---

## Output Template

```markdown
## Structural Isomorphism Analysis

### Comparison Baseline
- Elements compared: [list]
- Baseline calculation: [average/median]

### Metric Comparison

| Metric | Baseline | New | Delta | Threshold | Status |
|--------|----------|-----|-------|-----------|--------|
| Nesting | X | Y | Z% | 30% | ✅/⚠️ |
| Sections | X | Y | Z% | 30% | ✅/⚠️ |
| Lines | X | Y | Z% | 30% | ✅/⚠️ |
| ... | | | | | |

### Justifications Required: {count}

**{Metric 1}**
- Delta: {value}
- Justification: {reason or NONE}
- Verdict: ACCEPTABLE / REQUIRES_FIX

### Structural Recommendations

1. [If applicable: Consider splitting...]
2. [If applicable: Reduce nesting by...]
3. [If applicable: Add more sections for...]

### Verdict
[ ] All metrics within threshold - proceed
[ ] Deltas justified - proceed
[ ] Unjustified deltas - requires restructuring
```

---

## Visual Structure Comparison

When helpful, create visual comparison:

```
BASELINE STRUCTURE          NEW ELEMENT STRUCTURE

# Title                     # Title
## Section A                ## Section A
  ### Sub A1                  ### Sub A1
  ### Sub A2                    #### Deep 1    ← Extra depth
## Section B                    #### Deep 2    ← Extra depth
  ### Sub B1                  ### Sub A2
## Section C                ## Section B
                              ### Sub B1
                              ### Sub B2      ← Extra subsection
                            ## Section C
                            ## Section D      ← Extra section
                            ## Section E      ← Extra section
```

---

## Integration with Deep-Process

### When to Execute
- **Before COMMITTED** for any new artifact
- **After significant edits** to existing artifacts
- **During migration** of external content

### Failure Actions
| Outcome | Action |
|---------|--------|
| All within threshold | Proceed |
| Deltas justified | Document and proceed |
| Deltas unjustified | Restructure or split |

### State Update
```yaml
validation:
  structural_isomorphism:
    executed: true
    metrics_checked: 7
    over_threshold: 3
    all_justified: true
```

---

## Common Structural Issues

### 1. Over-Nesting
```
Problem: Too many heading levels (####, #####)
Solution: Flatten hierarchy, use lists instead
```

### 2. Giant Monoliths
```
Problem: Single artifact > 2x baseline size
Solution: Split into focused sub-artifacts
```

### 3. Anemic Sections
```
Problem: Many sections with minimal content
Solution: Consolidate or remove thin sections
```

### 4. Inconsistent Granularity
```
Problem: Some sections detailed, others sparse
Solution: Balance coverage across sections
```

### 5. Wrong Artifact Type
```
Problem: Structure doesn't match declared type
Solution: Reclassify or restructure
```

---

## Threshold Calibration

The 30% threshold is a default. Adjust based on context:

| Context | Threshold | Rationale |
|---------|-----------|-----------|
| Strict standardization | 20% | Enforce consistency |
| Default | 30% | Balance flexibility/consistency |
| Exploratory work | 50% | Allow experimentation |
| Migration | 40% | External content varies |

```yaml
# In project config
validation:
  structural_isomorphism:
    threshold: 30  # Percentage delta allowed
    strict_mode: false  # If true, use 20%
```

---

## Method Rationale

This method exists because:
- Structural consistency aids navigation and comprehension
- Outliers often indicate scope creep or misclassification
- Readers build mental models based on existing patterns
- Review effort scales with structural complexity

The goal is not rigid uniformity but coherent variation within expected ranges.
