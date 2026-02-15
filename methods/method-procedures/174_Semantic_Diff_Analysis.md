# #174 Semantic Diff Analysis

**Category:** grounding
**Purpose:** When source code changes, compute semantic diff and identify which documentation sections need updates. Proactive staleness prevention rather than reactive detection.

## What to do

1. Identify what changed in the source (git diff, file comparison)
2. Classify changes by semantic impact (signature, behavior, structure, cosmetic)
3. Map each significant change to affected documentation sections
4. Generate update queue prioritized by impact

## Step-by-step

```
1. Capture source changes:
   diff = GitDiff(from: last_doc_update, to: HEAD)

   FOR each changed file F:
     changes[F] = ParseDiff(diff, F)
     // changes = list of { type, location, before, after }

2. Classify semantic impact:
   FOR each change C:
     IF C.type in [function_signature, api_route, model_schema]:
       impact = HIGH — "Contract change: consumers affected"
     ELIF C.type in [function_body, algorithm, business_logic]:
       impact = MEDIUM — "Behavior change: docs may be inaccurate"
     ELIF C.type in [rename, move, reorganize]:
       impact = MEDIUM — "Structure change: references may break"
     ELIF C.type in [formatting, comments, internal_refactor]:
       impact = LOW — "Cosmetic: docs likely still valid"

3. Map to documentation:
   FOR each HIGH/MEDIUM change C:
     affected_docs = FindDocSections(C.element_name)
     // Search docs for mentions of changed element

     FOR each doc_section in affected_docs:
       update_queue.append({
         change: C,
         doc_section: doc_section,
         impact: C.impact,
         action: DetermineAction(C)
         // UPDATE_TEXT, UPDATE_EXAMPLE, VERIFY_STILL_VALID, REMOVE_REFERENCE
       })

4. Prioritize:
   Sort update_queue by:
     1. Impact (HIGH first)
     2. Doc visibility (public API docs > internal docs)
     3. Number of affected sections
```

## Output

```
SEMANTIC DIFF ANALYSIS:
Source changes: [N] files, [M] semantic changes
  HIGH impact:   [H] changes
  MEDIUM impact: [M] changes
  LOW impact:    [L] changes

UPDATE QUEUE:
| Priority | Change | Affected Doc | Action |
|----------|--------|-------------|--------|
| 1        | ...    | ...         | UPDATE |
```
