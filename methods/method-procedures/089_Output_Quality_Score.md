# #89 Output Quality Score

**Tier:** 3 (On-Complete - Finalization)
**Purpose:** Apply a structured rubric to assess overall documentation quality before final scoring.

## What to do

1. Apply quality rubric across 6 dimensions to the full documentation set
2. Score each dimension independently (0-100)
3. Identify the weakest dimension for targeted improvement
4. Provide concrete recommendations per dimension

## Step-by-step

```
1. Assess COMPLETENESS dimension:
   - Are all expected document types present?
   - Are all project parts documented?
   - Are all code categories covered (API, models, components)?
   Score: coverage_pct from Step 11

2. Assess ACCURACY dimension:
   - Do documented details match actual code?
   - Are version numbers correct?
   - Are file paths valid?
   Score: accuracy_pct from Step 11 spot-checks

3. Assess DEPTH dimension:
   - Are documents surface-level or detailed?
   - Architecture doc: does it explain WHY, not just WHAT?
   - API docs: do they include request/response schemas?
   - Data models: do they show relationships?
   Scoring:
     90+: Explains decisions, trade-offs, alternatives
     70-89: Describes structure and behavior
     50-69: Lists elements without explanation
     <50: Superficial or missing

4. Assess NAVIGABILITY dimension:
   - Is index.md a complete entry point?
   - Can you find any topic in 2 clicks from index?
   - Are cross-references between docs helpful?
   - Are section headings descriptive?
   Scoring:
     90+: Every topic reachable in 2 clicks, clear headings
     70-89: Most topics linked, minor gaps
     50-69: Partial linking, some orphan docs
     <50: No clear navigation structure

5. Assess FRESHNESS dimension:
   - Does documentation reference actual current code?
   - Are there stale references to removed features?
   - Do version numbers match current package versions?
   Scoring:
     90+: All references current, no stale content
     70-89: Minor version mismatches
     50-69: Some stale references
     <50: Significantly out of date

6. Assess ACTIONABILITY dimension:
   - Can a new developer onboard using these docs?
   - Are setup instructions complete and tested?
   - Do examples work?
   Score: From Executability Check (#88) if available,
          otherwise assess independently
```

## Output format

```
Quality Rubric Assessment
=========================

| Dimension      | Score | Assessment |
|----------------|-------|------------|
| Completeness   | [0-100] | [brief assessment] |
| Accuracy       | [0-100] | [brief assessment] |
| Depth          | [0-100] | [brief assessment] |
| Navigability   | [0-100] | [brief assessment] |
| Freshness      | [0-100] | [brief assessment] |
| Actionability  | [0-100] | [brief assessment] |

Weakest dimension: [name] ([score])
Recommendation: [specific improvement]

Strongest dimension: [name] ([score])

Overall quality impression: [1-2 sentences]

FINDING (if any): [description]
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
