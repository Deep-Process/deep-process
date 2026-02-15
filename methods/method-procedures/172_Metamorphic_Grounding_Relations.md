# #172 Metamorphic Grounding Relations

**Category:** grounding
**Purpose:** Define metamorphic relations between documentation and code, then test them automatically. If docs say "function F takes parameter P of type T", then code's F must have parameter P of type T. Violations indicate grounding failures.

**Theoretical basis:** Adapted from metamorphic testing (Chen et al., 2018) — instead of checking outputs directly, check that RELATIONS between doc claims and code properties hold.

## What to do

1. Extract testable claims from documentation
2. Formulate each as a metamorphic relation (MR)
3. Check each MR against the codebase
4. Report violations

## Step-by-step

```
1. Identify claim types in the artifact:

   TYPE A — Signature claims:
     "Function F accepts parameter P of type T"
     MR: signature(F).params contains (P: T)

   TYPE B — Endpoint claims:
     "GET /api/users returns a list of User objects"
     MR: route(GET, /api/users).response.type == Array<User>

   TYPE C — Relationship claims:
     "Service A calls Service B"
     MR: imports(A) contains B OR calls(A) contains B.method

   TYPE D — Data claims:
     "Table Users has column email of type VARCHAR"
     MR: schema(Users).columns contains (email: VARCHAR)

   TYPE E — Behavioral claims:
     "On error, returns HTTP 404"
     MR: error_handler(F).status_codes contains 404

2. Extract and formulate MRs:
   FOR each claim C in artifact:
     Classify claim type (A-E)
     Formulate as MR:
       MR_i: predicate(code_element, expected_property)
     Record: { claim: C, type, MR, location_in_doc }

3. Test each MR:
   FOR each MR_i:
     result = Evaluate(MR_i, codebase)
     IF result == VIOLATION:
       Record: { MR_i, expected, actual, severity }

4. Classify violations:
   - CONTRADICTION: doc says X, code says NOT X
   - PARTIAL: doc partially correct (e.g., 3 of 5 params match)
   - UNTESTABLE: cannot verify (behavior requires runtime)
```

## Output

```
METAMORPHIC GROUNDING CHECK:
- Relations tested: [N]
- Passed: [P]
- Violations: [V]
- Untestable: [U]

VIOLATIONS:
| # | Claim | Expected | Actual | Severity |
|---|-------|----------|--------|----------|
| 1 | ...   | ...      | ...    | HIGH     |
```
