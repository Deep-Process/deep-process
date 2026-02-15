# #168 Existence Verification (Phantom Hunt)

**Category:** grounding
**Purpose:** For each symbol referenced in an artifact, verify it EXISTS in the source of truth. Documented elements not found in code are PHANTOMS (hallucinations). Addresses Korzybski's map-territory distinction — phantoms are maps without territory.

## What to do

1. Extract all named references from the artifact (class names, function names, endpoints, file paths, etc.)
2. For each reference, search the codebase to verify existence
3. Classify results: EXISTS / PHANTOM / RENAMED / AMBIGUOUS
4. Report all phantoms for removal or correction

## Step-by-step

```
1. Extract references from artifact:
   FOR each section in artifact:
     Find all:
       - Class/struct names (e.g., "UserService", "OrderModel")
       - Function/method names (e.g., "processPayment()")
       - File paths (e.g., "src/auth/login.ts")
       - API endpoints (e.g., "GET /api/users")
       - Table/collection names (e.g., "users table")
       - Configuration keys

2. Verify existence:
   FOR each reference R:
     query = BuildSearchQuery(R)
     results = Search(codebase, query)

     IF results.found:
       status = EXISTS
       location = results.path
     ELIF results.similar_found:
       status = RENAMED
       suggestion = results.similar
     ELSE:
       status = PHANTOM

     Record: { reference: R, status, location_or_suggestion }

3. Classify severity:
   - PHANTOM in architecture doc → HIGH (structural lie)
   - PHANTOM in API doc → CRITICAL (users will try to call it)
   - PHANTOM in internal notes → LOW (misleading but contained)

4. Report:
   Phantoms found: N out of M references (X%)
   For each phantom: reference, where mentioned, suggested action
```

## Output

```
EXISTENCE VERIFICATION:
- Total references checked: [M]
- Verified existing: [N]
- PHANTOMS: [P] — [list with locations and severity]
- Renamed/moved: [R] — [list with suggestions]
- Grounding score: [N/M %]
```
