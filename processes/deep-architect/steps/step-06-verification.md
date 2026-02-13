---
step: 6
name: "Verification"
time_estimate: "20-40 minutes"
goal: "Final completeness audit — 16 operations, traceability, gate summary, verdict"
requires_completion: true
next_steps: []
data_dependencies: ["data/schemas/verification-report.schema.yaml", "ALL previous artifacts"]
outputs: ["verification-report.yaml", "process-log.yaml"]
gate: "GATE_6"
gate_conditions: 7
---

# PHASE 6: VERIFICATION — ENFORCED SEQUENCE

## 6.0 ASSUMPTIONS_DECLARED

1. Declare assumptions about completeness assessment, traceability coverage
2. Log in verification-report.yaml `assumptions[]` with A-6XX IDs
3. Minimum 1 assumption

**IF zero assumptions → HALT (INV-03 violation)**

---

## 6.1 EXTRACT: Operations Completeness Audit

1. Read canonical-operations.yaml → verify 8 canonical operations executed:

   | # | Operation | Status | Artifact Reference | Evidence |
   |---|-----------|--------|-------------------|----------|
   | 1 | Decomposition | EXECUTED/SKIPPED | canonical-operations.yaml | components exist |
   | 2 | Boundary Definition | EXECUTED/SKIPPED | canonical-operations.yaml | context_map exists |
   | 3 | Relationship Mapping | EXECUTED/SKIPPED | canonical-operations.yaml | dependencies exist |
   | 4 | Responsibility Allocation | EXECUTED/SKIPPED | canonical-operations.yaml | SRP compliance |
   | 5 | Dependency Management | EXECUTED/SKIPPED | canonical-operations.yaml | coupling analysis |
   | 6 | Pattern Application | EXECUTED/SKIPPED | canonical-operations.yaml | patterns applied |
   | 7 | Quality Attribute Analysis | EXECUTED/SKIPPED | canonical-operations.yaml | priorities set |
   | 8 | Interface Design | EXECUTED/SKIPPED | canonical-operations.yaml | interfaces defined |

2. Read adversary-findings.yaml → verify 8 adversarial operations executed:

   | # | Operation | Status | Artifact Reference | Evidence |
   |---|-----------|--------|-------------------|----------|
   | 1 | STRIDE | EXECUTED/SKIPPED | adversary-findings.yaml | threats exist |
   | 2 | FMEA | EXECUTED/SKIPPED | adversary-findings.yaml | failure modes exist |
   | 3 | Bottleneck Detection | EXECUTED/SKIPPED | adversary-findings.yaml | bottlenecks exist |
   | 4 | Anti-Pattern Detection | EXECUTED/SKIPPED | adversary-findings.yaml | scan completed |
   | 5 | Complexity Analysis | EXECUTED/SKIPPED | adversary-findings.yaml | metrics exist |
   | 6 | Compliance Analysis | EXECUTED/SKIPPED | adversary-findings.yaml | regulations checked |
   | 7 | Pre-mortem | EXECUTED/SKIPPED | adversary-findings.yaml | scenarios exist |
   | 8 | Trade-off Identification | EXECUTED/SKIPPED | adversary-findings.yaml | conflicts exist |

3. Total operations: canonical_count + adversarial_count **MUST equal 16**

**IF total < 16 → BLOCKER (G6-01, INV-07, INV-08)**

---

## 6.2 EXTRACT: Traceability Matrix

1. Read user brief → extract all requirements
2. For each requirement, trace to:
   - Design element (C-XXX component, I-XXX interface, or ADR-XXX decision)
   - Validation (VI-XXX validated issue or VT-XXX test)
3. Classify: `traced | partially_traced | untraceable`
4. Calculate coverage percentage

---

## 6.3 EXTRACT: Gate Summary

1. Compile gate results from all 7 gates:
   ```yaml
   - gate: "GATE_0"
     status: "OPEN"
     conditions_total: 5
     conditions_passed: 5
     conditions_failed: 0
     scope_reductions: 0
   ```
2. Verify ALL 7 gates OPEN (G6-03)

---

## 6.4 EXTRACT: Assumptions Summary

1. Collect assumptions from ALL phases (A-0XX through A-6XX)
2. Total MUST be ≥10 (G6-04)
3. Identify unvalidated assumptions (not yet tested)
4. Identify falsified assumptions (proven wrong during process)

---

## 6.5 EXTRACT: Scope Reductions

1. Collect all SCOPE_REDUCTION_DECLARATION entries from process
2. Document total count, each entry's gate/reason/impact/approval
3. Assess cumulative impact

---

## 6.6 EXTRACT: Counter-Checks Summary

1. Count total counter-checks executed across all phases
2. Verify minimum met (quick=6, standard=12, deep=18)
3. Document methods used per phase
4. Count passed/failed/warnings

---

## 6.7 EXTRACT: Invariant Compliance

1. Check each of the 12 invariants:
   ```yaml
   - invariant: "INV-01"
     name: "Sequential Execution"
     status: "COMPLIANT"
     evidence: "Phases executed 0→1→2→3→4→5→6"
   ```
2. Count compliant vs violated
3. All 12 MUST be checked (G6-07 implicit)

---

## 6.8 VERIFY: Verification Quality

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 operations → verify EXECUTED status matches actual artifact content
   2. Sample 3 traceability entries → verify design elements exist
   3. IF rate < 0.70 → re-audit

2. **Method #84 Coherence Check:**
   1. Verify gate summary consistent with individual gate evaluations
   2. Verify assumptions count matches collected count
   3. Verify counter-check count matches claimed

3. **Method #168 Phantom Hunt:**
   1. Check for phantom operations (claimed EXECUTED but no evidence)
   2. Check for phantom traceability (claimed traced but element doesn't exist)
   3. Any phantoms → fix before verdict

---

## 6.9 RENDER: Final Verdict

**PRECONDITION: [VERIFY_COMPLETE]**

1. Determine verdict based on:
   - **PASS**: All 16 operations, all gates OPEN, all invariants COMPLIANT, counter-checks met
   - **CONDITIONAL_PASS**: All 16 operations, all gates OPEN, minor invariant violations or counter-check gaps
   - **FAIL**: Missing operations, LOCKED gates, or BLOCKER invariant violations

2. Assess confidence (0.0-1.0)
3. Summarize strengths and weaknesses
4. List recommendations
5. Determine readiness:
   - `deep_risk`: Ready for risk assessment?
   - `deep_verify`: Ready for external verification?
   - `implementation`: Ready for development?

---

## 6.10 RENDER: Artifacts

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `verification-report.yaml` following schema — include ALL sections
2. Create `process-log.yaml` — complete audit trail of all phases, decisions, violations
3. Write to `{output_directory}/architecture-artifacts/`
4. Present verification report summary to user

---

## 6.11 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | Operations audit (16/16 verified) | PASS/FAIL |
| 2 | Traceability matrix complete | PASS/FAIL |
| 3 | All 7 gates summarized | PASS/FAIL |
| 4 | Assumptions summary (≥10 total) | PASS/FAIL |
| 5 | Scope reductions logged | PASS/FAIL |
| 6 | Counter-checks summary | PASS/FAIL |
| 7 | Invariant compliance (12/12 checked) | PASS/FAIL |
| 8 | ASSUMPTIONS_DECLARED | PASS/FAIL |
| 9 | Final verdict rendered | PASS/FAIL |
| 10 | verification-report.yaml written | PASS/FAIL |
| 11 | process-log.yaml written | PASS/FAIL |

---

## 6.12 GATE_6 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G6-01 | All 16 operations documented | BLOCKER | |
| G6-02 | Traceability matrix complete | CRITICAL | |
| G6-03 | All gates passed (all OPEN) | CRITICAL | |
| G6-04 | Assumptions summary (≥10 total) | CRITICAL | |
| G6-05 | Scope reductions logged | ERROR | |
| G6-06 | Counter-checks (≥ minimum for depth) | CRITICAL | |
| G6-07 | Final verdict rendered | REQUIRED | |

**Pass criteria:** G6-01 (BLOCKER) + ALL CRITICAL conditions met

- IF G6-01 fails → GATE_6 = **LOCKED** → ABORT (BLOCKER, INV-07/08 violation)
- IF CRITICAL fails → GATE_6 = **LOCKED** → HALT, fix
- IF ALL pass → GATE_6 = **OPEN** → **PROCESS COMPLETE**

**OUTPUT:** Present final verification report to user with verdict, confidence, strengths, weaknesses, recommendations, readiness assessment.
