---
step: 8
name: "Evidence Extraction"
state: "STATE_EVIDENCE"
time_estimate: "10-25 minutes"
goal: "Extract claims with source locations and verifiability classification"
requires_completion: true
next_steps: ["step-09-user-review-evidence.md"]
data_dependencies: ["coverage_map.yaml", "documentation-plan.yaml"]
outputs: ["evidence_map.yaml"]
---

# STATE_EVIDENCE

**Input:** deep-artifacts/coverage_map.yaml, deep-artifacts/documentation-plan.yaml, Repository files (for reading)
**Output:** deep-artifacts/evidence_map.yaml

## ENFORCED SEQUENCE

**STEP 1: LOAD_SEGMENTS**
Read coverage_map.yaml → extract segments[] array

**STEP 2: ASSUMPTIONS_DECLARED**
```yaml
assumptions:
  - "Claim types: fact|behavior|relationship|property|constraint|other"
  - "Evidence strength: verified (code present) | inferred (implied) | hypothetical (uncertain)"
  - "Target: >=70% verified, <=10% hypothetical"
  - "Each claim requires >= 1 citation"
  - "PD-UNIVERSAL patterns (68) enforced in extracted claims"
```

**STEP 3: EXTRACT_CLAIMS**
For each segment:
1. Read file content for segment line range
2. Analyze code to extract claims:
   - **fact**: "Function X exists", "Interface Y has property Z"
   - **behavior**: "Function A calls function B", "Module C processes events"
   - **relationship**: "Class D extends class E", "Service F depends on G"
   - **property**: "Variable H is type T", "Parameter I is required"
   - **constraint**: "Input must be non-null", "Output range 0-100"
3. For each claim:
   - Assign claim_id (sequential: CLM_001, CLM_002, ...)
   - Record claim_text
   - Classify claim_type
   - Determine evidence_strength (verified if code explicitly shows, inferred if implied)
   - Extract citations (file_path, line_number, snippet)
4. Scan claim_text for PD-UNIVERSAL violations:
   - IF violations found → replace with grounded facts OR mark evidence_strength = hypothetical

**STEP 4: VERIFY**
1. Method #85 Grounding: sample 3 claims, verify citations point to actual code
2. Verify all claims have >= 1 citation
3. Verify evidence_strength distribution: >=70% verified, <=10% hypothetical
4. Method #168 Phantom Hunt: check for phantom citations (files not in repo_inventory)

**STEP 5: RENDER**
Write deep-artifacts/evidence_map.yaml per schema
Calculate statistics:
```yaml
statistics:
  total_claims: <count>
  claims_by_type:
    fact: <count>
    behavior: <count>
    # ...
  claims_by_strength:
    verified: <count>
    inferred: <count>
    hypothetical: <count>
  avg_citations_per_claim: <ratio>
  evidence_completeness: <ratio>
```

**STEP 6: COUNTER-CHECKS**
- **CC1 (Method #85 Grounding):** Sample 3 claims, verify citations exist and match claim → BLOCKER if >30% fail
- **CC2 (Method #168 Phantom):** Check for phantom claims (citations to non-existent files/lines) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify verified_ratio >= 0.70 AND hypothetical_ratio <= 0.10 → ERROR if fail

**STEP 7: GATE_2**
Evaluate all G2-01 through G2-10 conditions from gates.yaml

**STEP 8: TRANSITION**
IF GATE_2 PASS → return to orchestrator for USER_REVIEW_EVIDENCE
IF GATE_2 FAIL → return to orchestrator for STATE_ERROR

## CLAIM EXTRACTION ALGORITHM

**Claim Types:**
- **fact**: Entity existence ("Function X exists", "Interface Y has property Z")
- **behavior**: Runtime actions ("Function A calls function B", "Module C processes events")
- **relationship**: Structural connections ("Class D extends class E", "Service F depends on G")
- **property**: Type/attribute information ("Variable H is type T", "Parameter I is required")
- **constraint**: Rules/limitations ("Input must be non-null", "Output range 0-100")
- **other**: Uncategorized claims

**Evidence Strength Classification:**
- **verified**: Direct code evidence (explicit declaration, implementation visible)
- **inferred**: Implied from multiple sources (no direct evidence but triangulated from context)
- **hypothetical**: Uncertain (no evidence, speculative)

**Citation Requirements:**
- Each claim requires >= 1 citation (file_path, line_number, snippet)
- Citations must be verifiable via Method #85 Grounding Check
- Phantom citations (non-existent files/lines) blocked by Method #168

**PD-UNIVERSAL Enforcement (68+ patterns):**
Scan claim_text for placeholder patterns. IF violations found:
- Option A: Replace with grounded facts from code
- Option B: Mark evidence_strength = hypothetical (contributes to 10% budget)
- BLOCKER if hypothetical_ratio > 0.10 (G2-05)

## GATE_2 CONDITIONS (from gates.yaml)

```
[ ] G2-01: evidence_map.yaml exists (BLOCKER)
[ ] G2-02: Claims extracted for all segments (BLOCKER)
[ ] G2-03: Each claim has source location (CRITICAL)
[ ] G2-04: Claim types classified (fact/behavior/relationship/property/constraint) (CRITICAL)
[ ] G2-05: No phantom claims - PD-UNIVERSAL scan passed (BLOCKER)
[ ] G2-06: Evidence verifiable - grounding check passed (ERROR)
[ ] G2-07: Counter-checks executed (ERROR)
[ ] G2-08: Evidence version incremented (WARNING)
[ ] G2-09: Delta math correct for incremental mode (ERROR)
[ ] G2-10: Evidence strength distribution meets targets (>=70% verified, <=10% hypothetical) (ERROR)
```

## INCREMENTAL MODE (V6.3)

When execution_context.mode == "INCREMENTAL":

**STEP 1: LOAD_BASE**
Read existing evidence_map.yaml

**STEP 2: DETECT_CHANGES**
Identify changed segments from coverage_map

**STEP 3: SUPPLEMENT**
Extract new claims for changed segments only
Preserve all unchanged claims (>=80% preservation required)

**STEP 4: WRITE_DELTA**
Write deep-artifacts/evidence-incremental-delta.yaml

**STEP 5: GATE_2_INCREMENTAL_VERIFY**
Evaluate gate conditions for incremental mode (8 conditions, >=80% preservation)

## PREVENTS 35% [UNKNOWN] PROBLEM (V6.2.0)

V6.2.0 Quality Mechanisms prevent documentation quality crisis:
- PD-UNIVERSAL scans for 68+ placeholder patterns
- G2-05 BLOCKER if violations detected
- Evidence strength targets: >=70% verified, <=10% hypothetical
- 3-tier hierarchy: VERIFIED → INFERRED → hypothetical (not [UNKNOWN])
