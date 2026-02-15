# #170 Documentation-Reality Audit

**Category:** grounding
**Purpose:** Systematic 4-point verification following Tarski's semantic truth: COMPLETENESS (baseline vs documented), EXISTENCE (no phantoms), ACCURACY (spot-check details match), FRESHNESS (timestamps). Comprehensive grounding check.

## What to do

1. Run all four grounding dimensions sequentially
2. Score each dimension independently
3. Combine into overall grounding verdict
4. Prioritize remediation by impact

## Step-by-step

```
1. COMPLETENESS CHECK (uses #167 Baseline Census):
   baseline = Census(codebase)
   documented = ExtractDocumented(artifact)
   completeness = |documented ∩ baseline| / |baseline|

   Verdict:
     ≥90% = COMPLETE
     70-89% = PARTIAL
     <70% = INCOMPLETE

2. EXISTENCE CHECK (uses #168 Phantom Hunt):
   references = ExtractReferences(artifact)
   FOR each ref in references:
     Verify exists in codebase
   phantom_rate = phantoms / total_references

   Verdict:
     0% phantoms = CLEAN
     1-5% = MINOR DRIFT
     >5% = SIGNIFICANT PHANTOMS

3. ACCURACY CHECK (spot-check):
   Sample 10-20% of documented elements
   FOR each sampled element:
     Compare artifact description vs actual code:
       - Parameter types match?
       - Return types match?
       - Behavior description accurate?
       - Dependencies listed correctly?
   accuracy = correct_samples / total_samples

   Verdict:
     ≥95% = ACCURATE
     80-94% = MOSTLY ACCURATE
     <80% = INACCURATE

4. FRESHNESS CHECK (uses #169 Staleness Detection):
   FOR each artifact-source pair:
     Compare modification timestamps
     Classify: Fresh / Aging / Stale / Critical
   freshness = fresh_count / total_count

   Verdict:
     ≥80% fresh = CURRENT
     50-79% fresh = AGING
     <50% fresh = STALE

5. COMPOSITE VERDICT:
   Score = (completeness × 0.25) + (existence × 0.25) +
           (accuracy × 0.30) + (freshness × 0.20)

   ≥85% = GROUNDED
   70-84% = PARTIALLY GROUNDED
   <70% = UNGROUNDED — remediation required
```

## Output

```
DOCUMENTATION-REALITY AUDIT:
  Completeness: [X%] — [verdict]
  Existence:    [X%] — [verdict]
  Accuracy:     [X%] — [verdict]
  Freshness:    [X%] — [verdict]
  ─────────────────────────────
  COMPOSITE:    [X%] — [verdict]

  TOP ISSUES:
  1. [issue + remediation]
  2. [issue + remediation]
  ...
```
