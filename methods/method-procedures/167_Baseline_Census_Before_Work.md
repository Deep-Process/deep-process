# #167 Baseline Census Before Work

**Category:** grounding
**Purpose:** Count and inventory elements BEFORE starting work to establish what SHOULD be covered — enables quantified completeness checking at end. Without baseline, "did I cover everything?" is unanswerable.

**Theoretical basis:** Harnad's grounding requirement for categorical representations — you need concrete anchors before symbolic manipulation.

## What to do

1. Identify what type of elements need covering (files, endpoints, models, components, etc.)
2. Count them systematically BEFORE generating any output
3. Record the baseline inventory
4. After work completes, compare output against baseline
5. Calculate coverage percentage per category

## Step-by-step

```
1. Define element categories relevant to the task:
   Examples:
     - API endpoints (GET/POST/PUT/DELETE)
     - Data models / entities
     - Source files by directory
     - Configuration files
     - External integrations

2. For each category, perform census:
   FOR each category C:
     elements[C] = ListAll(codebase, C)
     count[C] = len(elements[C])
     Record: "Category C: N elements found"

3. Store baseline:
   BASELINE = {
     timestamp: now(),
     categories: { C: { count, elements } for each C },
     total: sum(counts)
   }

4. Proceed with work...

5. After work completes, measure coverage:
   FOR each category C:
     covered[C] = CountCoveredInOutput(output, elements[C])
     coverage[C] = covered[C] / count[C] * 100
     IF coverage[C] < 80%:
       FLAG: "Low coverage in category C: {coverage[C]}%"

6. Report:
   - Total coverage: X/Y elements (Z%)
   - Per-category breakdown
   - Uncovered elements list
```

## Output

```
BASELINE CENSUS:
- Category: [name] | Elements: [N] | Covered: [M] | Coverage: [M/N %]
- ...
TOTAL: [X/Y] elements covered ([Z]%)
GAPS: [list of uncovered elements]
```
