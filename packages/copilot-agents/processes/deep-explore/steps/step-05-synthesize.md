# Step 05: Synthesize

INPUTS (from workflow.md ARTIFACT SCHEMAS):
- option_map.yaml (from Step 02)
- consequence_map.yaml (from Step 03)
- challenge_results.yaml (from Step 04)
- all assumptions_declared (from all previous phases)

OUTPUTS:
- synthesis.yaml

ENFORCEMENT: ASSUMPTIONS_DECLARED, EVR, COUNTER_CHECKS (min 1/2/3), POST-PHASE CHECKLIST, GATE_05

---

## 05.0 ASSUMPTIONS_DECLARED

| ID    | Assumption                     | Type         | Confidence | Falsification Criterion       |
|-------|--------------------------------|--------------|------------|-------------------------------|
| H-5xx | [clustering criteria]          | INTERPRETIVE | HIGH/MED/LOW | [better clustering exists]   |
| H-5xx | [decision sequence]            | DOMAIN       | [level]    | [order is wrong]             |
| H-5xx | [readiness assessment]         | CONTEXTUAL   | [level]    | [not ready when said ready]  |

Minimum 1 assumption declared. Add rows as needed.

---

## 05.1 EXTRACT: Raw Insights Collection

PRECONDITION: None (first extraction in this phase)

METHOD Minimal Assertions (E003) (embedded):
1. Gather all raw insights from Phases 0-4
2. Compress each insight to minimal form (half the words, keep accuracy)
3. Tag each with usefulness (what decision it helps)
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
raw_insights:
  from_phase_0: ["[insight - VERIFIED/ASSUMED]", ...]
  from_phase_1: ["[insight - VERIFIED/ASSUMED]", ...]
  from_phase_2: ["[insight - VERIFIED/ASSUMED]", ...]
  from_phase_3: ["[insight - VERIFIED/ASSUMED]", ...]
  from_phase_4: ["[insight - VERIFIED/ASSUMED]", ...]
```

[EXTRACT_COMPLETE]

---

## 05.2 EXTRACT: Cluster Candidates

PRECONDITION: [EXTRACT_COMPLETE from 05.1]

METHOD Clustering (embedded):
1. Identify options that share characteristics
2. Group by: risk profile, resource needs, reversibility, speed, philosophy
3. Aim for 2-5 clusters (avoid over-clustering)
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
cluster_candidates:
  - cluster_name: "[descriptive name]"
    shared_characteristic: "[what unifies - VERIFIED/ASSUMED]"
    options: ["[option ref]", ...]
    clustering_criteria: RISK_PROFILE | RESOURCE_NEED | REVERSIBILITY | SPEED | PHILOSOPHY
```

[EXTRACT_COMPLETE]

---

## 05.3 VERIFY: Compression Verification

PRECONDITION: [EXTRACT_COMPLETE from 05.2]

VERIFICATION:
1. Check each insight is minimal (no unnecessary words)
2. Verify accuracy preserved after compression
3. Confirm usefulness tag is specific (not vague)

METHOD Minimal Assertions (E003) verification:
1. For each assertion: ask "Can I say this in half the words AND keep accuracy?"
2. If yes: compress further
3. If no: mark as minimal

OUTPUT FORMAT (in synthesis.yaml):
```yaml
minimal_assertions:
  - id: MA-001
    assertion: "[key learning - 1 sentence - VERIFIED/ASSUMED]"
    useful_for: "[specific decision]"
    supporting_evidence: ["[reference]", ...]
```

[VERIFY_COMPLETE]

---

## 05.4 VERIFY: Cluster Validation

PRECONDITION: [VERIFY_COMPLETE from 05.3]

VERIFICATION:
1. Check clusters are genuinely distinct (not overlapping)
2. Verify 2-5 clusters total (not fragmented or monolithic)
3. Confirm options within cluster feel similar
4. Confirm options across clusters feel different

★ KEY_CLAIM: "Clusters represent genuinely distinct strategic paths, not arbitrary groupings"

COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):
```
CC-1:
  claim: "These clusters capture the distinct strategic options"
  disproof: "An alternative clustering would be more useful or accurate"
  search: "[try clustering by different dimension: risk vs resource vs philosophy]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: revise clustering]

CC-2:
  claim: "[cluster A is coherent and distinct from B]"
  disproof: "Options within cluster A are too different OR overlap with cluster B"
  search: "[check if cluster members share core characteristic, check boundaries]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: reconsider cluster definition]

CC-3 (if deep):
  claim: "The number of clusters (N) is appropriate"
  disproof: "Too many clusters (fragmentation) OR too few (loss of distinctions)"
  search: "[try merging clusters, try splitting clusters]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: adjust cluster count]
```

OUTPUT FORMAT (in synthesis.yaml):
```yaml
strategic_clusters:
  - cluster_id: CL-001
    name: "[cluster name]"
    core_philosophy: "[underlying approach - VERIFIED/ASSUMED]"
    options: ["[option ref]", ...]
    best_for: "[situation - VERIFIED/ASSUMED]"
    requires: ["[resources/skills/conditions - VERIFIED/ASSUMED]", ...]
    risk_profile: HIGH | MEDIUM | LOW
    reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
    time_to_results: FAST | MEDIUM | SLOW
    key_tradeoff: "[what sacrificed - VERIFIED/ASSUMED]"
```

[VERIFY_COMPLETE]

---

## 05.5 EXTRACT: Decision Sequence

PRECONDITION: [VERIFY_COMPLETE from 05.4]

METHOD Sequencing (embedded):
1. Identify dependencies (what must be decided first)
2. Classify timing: NOW (prerequisite) | AFTER_[dependency] | DELAY_UNTIL_[condition] | WILL_EMERGE
3. Document rationale for sequence
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
decision_sequence:
  - order: 1
    decision: "[what to decide - VERIFIED/ASSUMED]"
    timing: NOW | AFTER_[dependency] | DELAY_UNTIL_[condition] | WILL_EMERGE
    rationale: "[why this order - VERIFIED/ASSUMED]"
  - order: 2
    decision: "[what to decide - VERIFIED/ASSUMED]"
    timing: AFTER_[decision 1]
    rationale: "[why this order - VERIFIED/ASSUMED]"
```

[EXTRACT_COMPLETE]

---

## 05.6 EXTRACT: Readiness Assessment

PRECONDITION: [EXTRACT_COMPLETE from 05.5]

VERIFICATION:
1. For each decision: assess readiness (READY | ALMOST | NOT_READY)
2. Identify what would help (specific actions)
3. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT (in synthesis.yaml):
```yaml
readiness_assessment:
  - decision: "[what to decide]"
    readiness: READY | ALMOST | NOT_READY
    what_would_help: "[specific action - VERIFIED/ASSUMED]"
    can_decide_now: YES | NO
    missing_information: ["[gap - VERIFIED/ASSUMED]", ...]
```

[VERIFY_COMPLETE]

---

## 05.7 EXTRACT: Remaining Information Gaps

PRECONDITION: [VERIFY_COMPLETE from 05.6]

METHOD Information Questions (E007) (embedded):
1. Identify highest-value questions: "Which information would change my decision the most?"
2. Identify ignored obvious: "What is everyone ignoring because it seems obvious?"
3. Tag with impact: HIGH | MEDIUM
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT (in synthesis.yaml):
```yaml
information_gaps:
  highest_value_questions:
    - question: "[what to learn - VERIFIED/ASSUMED]"
      impact: HIGH | MEDIUM
      would_change_decision: "[how - VERIFIED/ASSUMED]"
  ignored_obvious:
    - observation: "[what's overlooked - VERIFIED/ASSUMED]"
      why_ignored: "[reason - VERIFIED/ASSUMED]"
```

[EXTRACT_COMPLETE]

---

## 05.8 RENDER: Synthesis Output

PRECONDITION: [EXTRACT_COMPLETE from 05.7]

OUTPUT (synthesis.yaml — complete structure):
```yaml
minimal_assertions:
  - id: MA-001
    assertion: "[key learning - 1 sentence - VERIFIED/ASSUMED]"
    useful_for: "[specific decision]"
    supporting_evidence: ["[reference]", ...]

strategic_clusters:
  - cluster_id: CL-001
    name: "[cluster name]"
    core_philosophy: "[approach - VERIFIED/ASSUMED]"
    options: ["[option ref]", ...]
    best_for: "[situation - VERIFIED/ASSUMED]"
    requires: ["[resources - VERIFIED/ASSUMED]", ...]
    risk_profile: HIGH | MEDIUM | LOW
    reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
    time_to_results: FAST | MEDIUM | SLOW
    key_tradeoff: "[what sacrificed - VERIFIED/ASSUMED]"

cluster_comparison:
  criteria: [RISK, INVESTMENT, TIME_TO_RESULTS, REVERSIBILITY, UPSIDE, COMPLEXITY]
  matrix:
    - cluster_id: CL-001
      risk: HIGH | MEDIUM | LOW
      investment: HIGH | MEDIUM | LOW
      time_to_results: FAST | MEDIUM | SLOW
      reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
      upside: HIGH | MEDIUM | LOW
      complexity: HIGH | MEDIUM | LOW
  best_cluster_for:
    maximize_upside: "[cluster_id]"
    minimize_risk: "[cluster_id]"
    move_fast: "[cluster_id]"
    preserve_optionality: "[cluster_id]"

decision_sequence:
  - order: 1
    decision: "[what to decide - VERIFIED/ASSUMED]"
    timing: NOW | AFTER_[dependency] | DELAY_UNTIL_[condition]
    rationale: "[why this order - VERIFIED/ASSUMED]"

readiness_assessment:
  - decision: "[what to decide]"
    readiness: READY | ALMOST | NOT_READY
    what_would_help: "[specific action - VERIFIED/ASSUMED]"
    can_decide_now: YES | NO
    missing_information: ["[gap - VERIFIED/ASSUMED]", ...]

information_gaps:
  highest_value_questions:
    - question: "[what to learn - VERIFIED/ASSUMED]"
      impact: HIGH | MEDIUM
  ignored_obvious:
    - observation: "[what's overlooked - VERIFIED/ASSUMED]"

independent_decisions:
  - decision: "[not tied to cluster choice - VERIFIED/ASSUMED]"
    orthogonal_to: "[main choice]"
```

[RENDER_COMPLETE]

---

## 05.9 POST-PHASE CHECKLIST

□ All outputs produced? [Y/N — list missing if N]
□ ASSUMPTIONS_DECLARED logged? [count ≥ 1]
□ EVR sequence respected? [Y/N — EXTRACT→VERIFY→RENDER]
□ Counter-checks performed? [count ≥ min per depth]
□ Key claims marked ★? [count ≥ 1]
□ ASSUMED items flagged? [Y/N]
□ Artifacts schema-compliant? [Y/N]
□ Minimal assertions produced? [Y/N]
□ Strategic clusters identified (2-5)? [Y/N — count: ___]
□ Clusters validated (distinct)? [Y/N]
□ Decision sequence defined? [Y/N]
□ Readiness assessed per decision? [Y/N]
□ Remaining gaps identified? [Y/N]

CHECKLIST_STATUS: PASS | FAIL

IF FAIL: Fix issues before proceeding.

---

## 05.10 GATE_05 CONDITIONS

CRITICAL (must pass):
□ Minimal assertions produced — IF FAIL → SCOPE_REDUCTION_DECLARATION required
□ Strategic clusters identified — IF FAIL → SCOPE_REDUCTION_DECLARATION required
□ Post-phase checklist PASSED — IF FAIL → fix issues

REQUIRED (should pass):
□ Decision sequence defined — IF FAIL → log + flag in process_log
□ Readiness assessed — IF FAIL → log + flag in process_log
□ Counter-checks ≥ minimum — IF FAIL → perform additional checks

GATE_STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed. Fix issues or execute SCOPE_REDUCTION protocol.

---

## 05.11 TRANSITION

IF GATE_05 = OPEN:
  → Load next step file: steps/step-06-output.md
  → Continue to Phase 6 (always — synthesis is complete)
