---
step: 14
name: "Verification"
state: "STATE_VERIFICATION"
time_estimate: "10-20 minutes"
goal: "Validate all gates, invariants, and quality tests (retrospective audit)"
requires_completion: true
next_steps: ["step-15-complete.md"]
data_dependencies: ["all artifacts"]
outputs: ["verification-report.md", "consolidated-validation-report.md"]
---

# STATE_VERIFICATION

**Input:** All artifacts
**Output:** verification-report.md, consolidated-validation-report.md

## ENFORCED SEQUENCE

**STEP 1: LOAD_ALL_ARTIFACTS**
Read all artifacts:
- repo_inventory.yaml
- domain-ontology.yaml
- template-decomposition.yaml
- dependency-closure.yaml
- detection-report.yaml
- documentation-plan.yaml
- coverage_map.yaml
- evidence_map.yaml
- architectural-model.json
- docs/*.md (all 9 documents)

**STEP 2: ASSUMPTIONS_DECLARED**
```yaml
assumptions:
  - "All 23 gates must be validated (no skipping)"
  - "All 25 invariants must be checked"
  - "7 quality tests must be executed (V-PROSE-001..V-SCAN-001, V-DOMAIN-001, V-PD-UNIVERSAL-001)"
  - "Verification is RETROSPECTIVE audit (shows what WAS checked)"
  - "Consolidated validation report aggregates ALL verification mechanisms"
```

**STEP 3: VERIFY_GATES** (23 total)

Execute verification for each gate from gates.yaml:

**3.1: GATE_0** (G0-01 through G0-10)
Verify repo_inventory.yaml completeness

**3.2: GATE_OE** (GOE-01 through GOE-10)
Verify domain-ontology.yaml quality (NEW V7)

**3.3: GATE_TA** (GTA-01 through GTA-10)
Verify template-decomposition.yaml and dependency-closure.yaml (NEW V7)

**3.4: GATE_D** (GD-01 through GD-13)
Verify detection-report.yaml domain detection

**3.5: GATE_P** (GP-01 through GP-15)
Verify documentation-plan.yaml completeness
(NEW V7: GP-15 semantic matching >=90%)

**3.6: GATE_UA/UB/UC/UD** (user approval gates)
Verify approval flags in process-state.yaml

**3.7: GATE_1** (G1-01 through G1-10)
Verify coverage_map.yaml completeness

**3.8: GATE_2** (G2-01 through G2-10)
Verify evidence_map.yaml quality

**3.9: GATE_3** (G3-01 through G3-10)
Verify architectural-model.json and diagrams

**3.10: GATE_GEN** (GG-01 through GG-14)
Verify docs/*.md quality (includes V7 quality gates GG-10..14)

**3.11: GATE_4** (Gate 4 final verification)
Verify consolidated validation report completeness

Record gate results:
```yaml
gate_results:
  - gate_id: GATE_0
    status: PASS
    conditions_passed: 10
    conditions_failed: 0
    failures: []
```

**STEP 4: VERIFY_INVARIANTS** (25 total)

Check each invariant from invariants.yaml:

**V6.3 Invariants (22):**
- INV-01 through INV-22 (inherited from V6)
- INV-23: State File Integrity
- INV-24: Staleness Propagation (with QUALITY_ONLY and INCREMENTAL_VERIFY exceptions)
- INV-25: Template Completeness (>=90% coverage)

**V7 Invariants (3 NEW):**
- INV-26: Ontology Grounding (all entities confidence >=0.95)
- INV-27: Semantic Matching (coverage_ratio >=0.90)
- INV-28: PD-Universal Enforcement (zero violations in documentation)

Record invariant results:
```yaml
invariant_results:
  - invariant_id: INV-01
    description: "Single Source of Truth"
    status: SATISFIED
    violations: []
```

**STEP 5: EXECUTE_VERIFICATION_TESTS**

**V-PROSE-001: Paragraph Scanning**
For each doc in docs/*.md:
1. Extract all paragraphs (blocks between newlines, excluding lists/tables/code)
2. Calculate length for each paragraph
3. Record: max_length, avg_length, violations (paragraphs >300 chars)
4. PASS if max_length <=300, FAIL otherwise

**V-PROSE-002: Depth Calculation**
For each doc:
1. Count headings by level (H2=1, H3=2, H4=3, H5=4, H6=5)
2. Calculate: avg_depth = sum(levels) / count(headings)
3. PASS if avg_depth >=2.0, FAIL otherwise

**V-PROSE-003: [UNKNOWN] Ratio Analysis**
For each doc:
1. Count occurrences: "[UNKNOWN]", "TBD", "TODO", "PLACEHOLDER", etc.
2. Count total sentences
3. Calculate: unknown_ratio = unknown_count / total_sentences
4. PASS if unknown_ratio <=0.10, FAIL otherwise

**V-PROSE-004: Format Selection Verification**
For each doc:
1. Search for lists with >=5 items and >=3 properties
2. Verify markdown table used (| column | format)
3. Record violations (prose used instead of table)
4. PASS if no violations, FAIL otherwise

**V-SCAN-001: Citation Density Scan**
For each doc:
1. Count inline citations (citations within sentences, e.g., `[1]` mid-sentence)
2. Count total sentences
3. Calculate: inline_ratio = inline_citations / total_sentences
4. PASS if inline_ratio <=0.30, WARN otherwise

**V-DOMAIN-001: Domain Detection Verification**
From detection-report.yaml:
1. Load counter_check_results[]
2. Verify all 3 checks executed (CC1_grounding, CC2_phantom_hunt, CC3_gaming_detection)
3. Categorize findings by severity (BLOCKER/ERROR/WARNING)
4. IF any BLOCKER/ERROR → FAIL (documentation used phantom domains)
5. PASS if all checks PASS

**V-PD-UNIVERSAL-001: Placeholder Pattern Scan** (NEW V7)
For each doc in docs/*.md:
1. Scan for all 68 PD-UNIVERSAL patterns from config.yaml
2. Apply exceptions (code blocks, inline code, escaped content)
3. Record violations by category (ellipsis, generic_names, bracketed, etc.)
4. PASS if zero violations, FAIL if >0

Record test results:
```yaml
verification_test_results:
  - test_id: V-PROSE-001
    description: "Paragraph length verification"
    status: PASS
    findings: []
```

**STEP 6: VERIFY_DOCUMENTATION_STANDARDS**

Check 22 quality standards from documentation-standards.yaml:
1. Scannability (<=300 char paragraphs, lists/tables where appropriate)
2. Navigability (depth >=2.0, clear hierarchy)
3. Completeness (<10% [UNKNOWN], all template sections present)
4. Format appropriateness (tables for >=5 items)
5. Readability (<=30% inline citations)
6. ... (17 more standards)

Record standard results:
```yaml
documentation_standard_results:
  - standard_id: DS-01
    description: "Scannability"
    status: PASS
    violations: []
```

**STEP 7: AGGREGATE_METRICS**

Calculate summary metrics:
```yaml
summary_metrics:
  total_gates: 23
  gates_passed: 23
  gates_failed: 0

  total_invariants: 25
  invariants_satisfied: 25
  invariants_violated: 0

  total_verification_tests: 7
  tests_passed: 7
  tests_failed: 0

  total_documentation_standards: 22
  standards_passed: 22
  standards_failed: 0

  overall_status: PASS
```

**STEP 8: RENDER_VERIFICATION_REPORT**

Write deep-artifacts/verification-report.md:
```markdown
# Verification Report (V7)

## Summary
- Overall Status: **PASS**
- Verification Timestamp: 2026-02-10T15:30:00Z

## Gate Results (23)
[Details for each gate]

## Invariant Results (25)
[Details for each invariant]

## Verification Test Results (7)
[Details for each test]

## Documentation Standard Results (22)
[Details for each standard]

## Findings
[Any BLOCKER/ERROR/WARNING findings]

## Conclusion
All verification mechanisms passed. Documentation ready for delivery.
```

**STEP 9: RENDER_CONSOLIDATED_VALIDATION_REPORT**

Write deep-artifacts/consolidated-validation-report.md (aggregates ALL verification):
```markdown
# Consolidated Validation Report (V7)

## Executive Summary
This report aggregates ALL verification mechanisms used throughout Deep-Document V7 process.

## Verification Layers

### Layer 1: Gates (23 binding gates, 100+ conditions)
[Full gate results with condition details]

### Layer 2: Invariants (25 process constraints)
[Full invariant satisfaction results]

### Layer 3: User Checkpoints (4 approval points)
[Approval status for plan, evidence, diagrams, docs]

### Layer 4: Per-Document Checklists
[Checklist results for all 9 documents]

### Layer 5: Quality Standards (22 checks)
[Documentation standard results]

### Layer 6: Verification Tests (7 tests)
[V-PROSE-001 through V-PD-UNIVERSAL-001 results]

### Layer 7: Evidence Metrics
[Claims, citations, verification percentages]

### Layer 8: Phantom Detection
[Method #168 results across all states]

### Layer 9: Scope Reductions
[Any template sections marked as SCOPE_REDUCTION]

## Retrospective Audit
[What WAS checked, not what SHOULD be checked - shows actual verification executed]

## Overall Verdict
**PASS** - All verification mechanisms satisfied
```

**STEP 10: COUNTER-CHECKS**
- **CC1 (Method #85 Grounding):** Sample 3 random gate results, verify conditions actually evaluated → BLOCKER if phantom
- **CC2 (Method #168 Phantom):** Check for phantom verification (results claimed but not actually executed) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify gate_results count == 23, invariant_results count == 25 → ERROR if mismatch

**STEP 11: GATE_4 CHECKLIST** ← BINDING
```
[ ] G4-01: verification-report.md exists (BLOCKER)
[ ] G4-02: All gates validated (23/23) (BLOCKER)
[ ] G4-03: All invariants checked (25/25) (BLOCKER)
[ ] G4-04: Quality tests passed (7/7) (CRITICAL)
[ ] G4-05: No BLOCKER findings (BLOCKER)
[ ] G4-06: Counter-checks executed (ERROR)
[ ] G4-07: Verification complete flag set (CRITICAL)
[ ] G4-08: Consolidated validation report generated (ERROR)
[ ] G4-09: Delta math correct (ERROR)
[ ] G4-10: Plan compliance verified (CRITICAL)
[ ] G4-11: Template compliance verified ≥90% (CRITICAL)
[ ] G4-12: Evidence grounding verified (ERROR)
```

**STEP 12: TRANSITION**
- IF all BLOCKER/CRITICAL conditions PASS → STATE_COMPLETE
- IF any BLOCKER/CRITICAL FAIL → STATE_ERROR

---

## INCREMENTAL MODE (V6.3)

### INCREMENTAL_VERIFICATION

**STEP 1: LOAD_BASE_REPORTS**
Read existing verification-report.md and consolidated-validation-report.md

**STEP 2: DETECT_CHANGES**
Identify which artifacts were regenerated (status = STALE → FRESH)

**STEP 3: VERIFY_DELTA**
Re-verify only changed artifacts (preserve verification of unchanged artifacts)

**STEP 4: UPDATE_REPORTS**
Update reports with delta verification results

**STEP 5: GATE_4_INCREMENTAL_VERIFY**
Evaluate gate conditions for incremental mode
Verify no regression (base verification still valid, delta verification passed)
