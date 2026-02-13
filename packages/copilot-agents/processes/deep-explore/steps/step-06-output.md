# Step 06: Output

INPUTS (from workflow.md ARTIFACT SCHEMAS):
- All outputs from Steps 0-5
- process_log.yaml (from all phases)

OUTPUTS:
- exploration_report.md (final deliverable)
- process_log.yaml (finalized)

ENFORCEMENT: ASSUMPTIONS_DECLARED, EVR, COUNTER_CHECKS (min 1/2/2), POST-PHASE CHECKLIST, GATE_06

NOTE: References external data files (do NOT embed):
- data/coverage-scoring.yaml (for scoring calculation)
- data/exploration-report-template.md (for report structure)

---

## 06.0 ASSUMPTIONS_DECLARED

| ID    | Assumption                  | Type         | Confidence | Falsification Criterion    |
|-------|-----------------------------|--------------|------------|----------------------------|
| H-6xx | [report completeness]       | INTERPRETIVE | HIGH/MED/LOW | [section missing content] |
| H-6xx | [score accuracy]            | CONTEXTUAL   | [level]    | [scoring error found]     |

Minimum 1 assumption declared. Add rows as needed.

---

## 06.1 EXTRACT: Gather All Phase Outputs

PRECONDITION: None (first extraction in this phase)

VERIFICATION:
1. Check each phase output exists
2. Document missing items
3. Classify missing as CRITICAL or REQUIRED
4. If CRITICAL missing: HALT and go back
5. If REQUIRED missing: SCOPE_REDUCTION_DECLARATION required

OUTPUT FORMAT:
```yaml
phase_output_inventory:
  phase_0:
    - knowledge_map: EXISTS | MISSING
    - research_queue: EXISTS | MISSING
    - fear_map: EXISTS | MISSING | N/A
  phase_1:
    - research_summary: EXISTS | MISSING
    - updated_knowledge_map: EXISTS | MISSING
  phase_2:
    - option_map: EXISTS | MISSING
  phase_3:
    - consequence_map: EXISTS | MISSING
    - reversibility_assessment: EXISTS | MISSING
    - dependency_graph: EXISTS | MISSING
  phase_4:
    - challenge_results: EXISTS | MISSING
    - fear_resolution: EXISTS | MISSING | N/A
  phase_5:
    - minimal_assertions: EXISTS | MISSING
    - strategic_clusters: EXISTS | MISSING
    - decision_sequence: EXISTS | MISSING
    - readiness_assessment: EXISTS | MISSING

missing_count: [N]
critical_missing: ["[item]", ...]
scope_reductions: ["[all SCOPE_REDUCTION_DECLARATIONs from all phases]", ...]
```

[EXTRACT_COMPLETE]

---

## 06.2 VERIFY: Coverage Score Calculation

PRECONDITION: [EXTRACT_COMPLETE from 06.1]

REFERENCE: data/coverage-scoring.yaml (for formulas and thresholds)

METHOD Coverage Scoring (embedded):
1. Count each scored element from all phases
2. Apply multipliers per coverage-scoring.yaml
3. Sum to raw score
4. Check quality gate requirements (per depth)
5. Apply threshold classification

SCORING ELEMENTS (from coverage-scoring.yaml):
- Dimensions discovered: count × 1.5 (cap 8)
- Options enumerated: count × 0.5 (cap 20)
- Consequences VERIFIED: count × 2.0
- Consequences ASSUMED: count × 0.2
- Assumptions tested: count × 1.5
- Assumptions falsified: count × 2.0
- Unknown unknowns surfaced: count × 1.5
- Boundaries identified: count × 1.0
- Causal relationships: count × 1.0
- Premortem causes: count × 0.5
- Black swans: count × 0.5
- Biases checked: count × 0.3
- Beliefs stress tested: count × 0.5
- Gates passed clean: count × 1.0
- Counter-checks performed: count × 0.5
- ASSUMED→VERIFIED upgrades: count × 1.5

IF fear_analysis=on, ADD:
- Fears classified: count × 0.5
- False walls identified: count × 1.5
- True walls confirmed: count × 1.5
- Controllable concerns: count × 0.5
- Success paths discovered: count × 2.0
- Comparables analyzed: count × 0.5

QUALITY GATE CHECK (per depth):
| Requirement                | Quick | Standard | Deep |
|----------------------------|-------|----------|------|
| Dimensions (min)           | 3     | 4        | 5    |
| Options (min)              | 6     | 12       | 15   |
| Verified consequences (min)| 2     | 5        | 10   |
| Assumptions tested (min)   | 1     | 3        | 5    |
| Verification ratio (min)   | -     | 30%      | 50%  |
| Premortem causes (min)     | -     | 3        | 5    |
| Biases checked (min)       | -     | -        | 5    |
| Counter-checks total (min) | 6     | 12       | 18   |

VERIFICATION_RATIO = verified / (verified + assumed) × 100%

THRESHOLDS (by depth, from coverage-scoring.yaml):
- Quick: C≥15 COMPREHENSIVE | C≥10 ADEQUATE | C≥5 PARTIAL | <5 INSUFFICIENT
- Standard: C≥35 COMPREHENSIVE | C≥22 ADEQUATE | C≥12 PARTIAL | <12 INSUFFICIENT
- Deep: C≥50 COMPREHENSIVE | C≥35 ADEQUATE | C≥20 PARTIAL | <20 INSUFFICIENT

NOTE: Quality gate failure caps level regardless of score.
When fear_analysis=on, thresholds increase by +5.

OUTPUT FORMAT (in process_log.yaml):
```yaml
coverage_calculation:
  raw_score: [N]
  quality_gate_passed: YES | NO
  quality_gate_failures: ["[requirement not met]", ...]
  final_level: COMPREHENSIVE | ADEQUATE | PARTIAL | INSUFFICIENT
  verification_ratio: [N]%
```

[VERIFY_COMPLETE]

---

## 06.3 RENDER: Generate Report

PRECONDITION: [VERIFY_COMPLETE from 06.2]

REFERENCE: data/exploration-report-template.md (for report structure)

METHOD Report Generation (embedded):
1. Load template from data/exploration-report-template.md
2. Fill each section with content from phase outputs
3. Verify each section has content (no empty sections)
4. If section empty AND applicable: Flag MISSING_CONTENT → go back
5. If section empty AND not applicable: Mark "N/A — [reason]"

REPORT SECTIONS (from template):
1. WHAT WE LEARNED — key discoveries, surprises, changed assumptions (from Step 1)
2. WHAT WE STILL DON'T KNOW — critical unknowns, uncertainties, parked questions (from Step 1)
3. OPTION MAP — dimensions, options, constraints, valid combinations (from Step 2)
4. STRATEGIC CLUSTERS — clusters, best-for scenarios, trade-offs (from Step 5)
5. CONSEQUENCE MAP — consequences per cluster, VERIFIED/ASSUMED tags, risks (from Step 3)
6. DECISION READINESS — sequence, readiness per decision, what would help (from Step 5)
7. SUGGESTED NEXT STEPS — if want clarity/decide/explore deeper
8. FEAR RESOLUTION (when fear_analysis=on) — original fears, resolution status, minimal tests, growth assessment, false/true walls (from Steps 0, 4)
9. PROCESS INTEGRITY (V3.0) — all SCOPE_REDUCTION_DECLARATIONs, all ASSUMPTIONS_DECLARED with final status, gate pass/fail summary, counter-check summary, EVR compliance per phase

★ KEY_CLAIM: "Report is complete and actionable"

COUNTER-CHECKS (minimum: quick=1, standard=2, deep=2):
```
CC-1:
  claim: "Report covers all required sections with substantive content"
  disproof: "A section is empty or lacks actionable information"
  search: "[scan each section: does it answer the section's purpose?]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add missing content or mark N/A]

CC-2:
  claim: "Process integrity section accurately reflects process execution"
  disproof: "Scope reductions, assumptions, or gate results are misrepresented"
  search: "[cross-check process_log.yaml with report section 9]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: correct discrepancies]
```

OUTPUT (exploration_report.md):
```markdown
# DEEP EXPLORE V3.0 REPORT

**Decision:** [from Step 0]
**Date:** [today]
**Config:** depth=[quick|standard|deep] fear_analysis=[on|off]
**Coverage:** [score] — [level]
**Quality Gate:** [PASSED/FAILED]

**Process Integrity:**
- Gates passed: [N]/7
- Scope reductions: [N]
- Counter-checks: [N]
- Assumptions declared: [N]
- EVR compliance: [N]/7 phases

---

## 1. WHAT WE LEARNED
[Content from Step 1: key discoveries, surprises, changed assumptions]

## 2. WHAT WE STILL DON'T KNOW
[Content from Step 1: critical unknowns, uncertainties, parked questions, flagged for expert]

## 3. OPTION MAP
[Content from Step 2: dimensions, options, constraints, valid combinations]

## 4. STRATEGIC CLUSTERS
[Content from Step 5: clusters, best-for scenarios, trade-offs]

## 5. CONSEQUENCE MAP
[Content from Step 3: consequences per cluster, VERIFIED/ASSUMED tags, risks]

## 6. DECISION READINESS
[Content from Step 5: sequence, readiness per decision, what would help]

## 7. SUGGESTED NEXT STEPS
- If want more clarity: [actions]
- If ready to decide: [guidance]
- If want to explore deeper: [options]

## 8. FEAR RESOLUTION (when fear_analysis=on)
[Content from Steps 0, 4: original fears, resolution status, minimal tests, growth assessment, false/true walls]

## 9. PROCESS INTEGRITY (V3.0)
### Scope Reductions
[All SCOPE_REDUCTION_DECLARATIONs from all phases]

### Assumptions Declared
[All ASSUMPTIONS_DECLARED with final status: VERIFIED/SURVIVED/FALSIFIED/UNTESTED]

### Gate Summary
[Gate pass/fail for all 7 gates]

### Counter-Check Summary
[Total counter-checks performed, results summary]

### EVR Sequence Compliance
[Per-phase compliance: EXTRACT→VERIFY→RENDER]
```

[RENDER_COMPLETE]

---

## 06.4 POST-PHASE CHECKLIST

□ All outputs produced? [Y/N — list missing if N]
□ ASSUMPTIONS_DECLARED logged? [count ≥ 1]
□ EVR sequence respected? [Y/N — EXTRACT→VERIFY→RENDER]
□ Counter-checks performed? [count ≥ min per depth]
□ Key claims marked ★? [count ≥ 1]
□ ASSUMED items flagged? [Y/N]
□ Artifacts schema-compliant? [Y/N]
□ All phase outputs collected? [Y/N — missing: ___]
□ All report sections filled? [Y/N — empty: ___]
□ Coverage score calculated? [Y/N — score: ___]
□ Quality gate checked? [Y/N — result: ___]
□ Process integrity section complete? [Y/N]
□ All SCOPE_REDUCTION_DECLARATIONs listed? [Y/N — count: ___]
□ Process log finalized? [Y/N]

CHECKLIST_STATUS: PASS | FAIL

IF FAIL: Fix issues before finalizing.

---

## 06.5 GATE_06 CONDITIONS

CRITICAL (must pass):
□ All report sections filled — IF FAIL → go back and fill or mark N/A (BLOCKER)
□ Coverage score calculated — IF FAIL → recalculate using coverage-scoring.yaml
□ Quality gate checked — IF FAIL → verify calculation
□ All SCOPE_REDUCTION_DECLARATIONs listed — IF FAIL → review all phases and list (BLOCKER)
□ Post-phase checklist PASSED — IF FAIL → fix issues

REQUIRED (should pass):
□ Process log complete — IF FAIL → log + flag
□ Counter-checks ≥ minimum — IF FAIL → perform additional checks

GATE_STATUS: OPEN | LOCKED

IF LOCKED: Cannot finalize. Fix issues.

---

## 06.6 TRANSITION

IF GATE_06 = OPEN:
  → EXPLORATION COMPLETE
  → Report is final deliverable
  → User has: understanding of what learned, clarity on unknowns, option map with consequences, decision readiness assessment, next steps guidance, process integrity evidence

IF fear_analysis=on, user also has:
  → Fear resolution status
  → Minimal tests designed
  → False/true walls identified
  → Growth assessment per option
