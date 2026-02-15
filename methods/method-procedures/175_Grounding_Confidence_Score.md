# #175 Grounding Confidence Score

**Category:** grounding
**Purpose:** Weighted composite metric combining existence check, completeness, freshness, and structural similarity into a single "how grounded is this artifact?" score.

## What to do

1. Run four component checks (or collect results if already run)
2. Apply weights to each dimension
3. Compute composite score
4. Classify confidence level

## Step-by-step

```
1. Collect component scores (each normalized to 0.0-1.0):

   E = Existence Score (#168)
       = (verified_references) / (total_references)
       Weight: 0.30

   C = Completeness Score (#167)
       = (documented_elements) / (baseline_elements)
       Weight: 0.25

   F = Freshness Score (#169)
       = (fresh_artifacts) / (total_artifacts)
       Weight: 0.25

   S = Structural Similarity (#171)
       = GraphSimilarity(code_graph, doc_graph)
       Weight: 0.20

2. Compute composite:
   GCS = (E × 0.30) + (C × 0.25) + (F × 0.25) + (S × 0.20)

3. Classify:
   GCS ≥ 0.90 → HIGH CONFIDENCE    — artifact is well-grounded
   GCS 0.75-0.89 → MODERATE         — usable but verify key claims
   GCS 0.50-0.74 → LOW              — significant grounding gaps
   GCS < 0.50 → UNGROUNDED          — artifact unreliable

4. Identify weakest dimension:
   weakest = min(E, C, F, S)
   IF weakest < 0.60:
     FLAG: "Critical weakness in [dimension]: [score]"
     RECOMMEND: specific remediation action

5. Trend analysis (if historical data available):
   delta = GCS_current - GCS_previous
   IF delta < -0.10:
     ALERT: "Grounding degrading: was [prev], now [curr]"
```

## Output

```
GROUNDING CONFIDENCE SCORE:
  Existence (30%):     [E] — [verdict]
  Completeness (25%):  [C] — [verdict]
  Freshness (25%):     [F] — [verdict]
  Similarity (20%):    [S] — [verdict]
  ──────────────────────────────────
  COMPOSITE GCS:       [score] — [confidence level]

  Weakest dimension: [name] ([score])
  Recommended action: [action]
```
