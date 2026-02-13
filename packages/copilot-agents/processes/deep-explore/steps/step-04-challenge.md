# Step 04: Challenge

INPUTS (from workflow.md ARTIFACT SCHEMAS):
- option_map.yaml (from Step 02)
- consequence_map.yaml (from Step 03)
- assumptions_declared (from all previous phases)

OUTPUTS:
- challenge_results.yaml

ENFORCEMENT: ASSUMPTIONS_DECLARED, EVR, COUNTER_CHECKS (min 1/2/3), POST-PHASE CHECKLIST, GATE_04

---

## 04.0 ASSUMPTIONS_DECLARED

| ID    | Assumption                        | Type         | Confidence | Falsification Criterion    |
|-------|-----------------------------------|--------------|------------|----------------------------|
| H-4xx | [challenge completeness]          | INTERPRETIVE | HIGH/MED/LOW | [angle missed]            |
| H-4xx | [bias awareness]                  | CONTEXTUAL   | [level]    | [blind spot found]        |
| H-4xx | [failure mode assumptions]        | DOMAIN       | [level]    | [different failure mode]  |

Minimum 1 assumption declared. Add rows as needed.

---

## 04.1 EXTRACT: Falsification Attempts

PRECONDITION: None (first extraction in this phase)

METHOD Falsification (E006) (embedded):
1. For each key belief/assumption: identify what would show it is FALSE
2. Search for contradicting evidence
3. Document evidence found (or absence)
4. Record contradicting sources
5. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
belief_id: "[reference]"
belief: "[statement]"
disproof_criteria: "[what would show this is false - VERIFIED/ASSUMED]"
evidence_searched: "[what was looked for]"
evidence_found: "[what was found or 'none']"
contradicting_sources: ["[source]", ...]
status: VERIFIED | ASSUMED
```

[EXTRACT_COMPLETE]

---

## 04.2 EXTRACT: Premortem

PRECONDITION: [EXTRACT_COMPLETE from 04.1]

METHOD Premortem (M021) (embedded):
1. For top 2-3 options: imagine "It's 12 months later. We chose this. It failed badly."
2. List causes of failure
3. Classify each by type: STRUCTURAL (hard limits) | OPERATIONAL (constraints) | EXTERNAL (outside control) | COGNITIVE (assumptions)
4. Assess likelihood: HIGH | MEDIUM | LOW
5. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
failure_scenario: "[description of failure]"
causes:
  - cause: "[failure reason - VERIFIED/ASSUMED]"
    type: STRUCTURAL | OPERATIONAL | EXTERNAL | COGNITIVE
    likelihood: HIGH | MEDIUM | LOW
    mitigation: "[how to prevent - VERIFIED/ASSUMED]"
```

TYPE KEY:
- STRUCTURAL = Hard limits → Contingency plan or reject option
- OPERATIONAL = Constraints → Mitigate before proceeding
- EXTERNAL = Outside control → Monitor + contingency plan
- COGNITIVE = Assumptions → Verify or dismiss

[EXTRACT_COMPLETE]

---

## 04.3 EXTRACT: Black Swan Hunt

PRECONDITION: [EXTRACT_COMPLETE from 04.2]

METHOD Black Swan Hunt (M022) (embedded):
1. Identify positive black swans (low probability, high upside)
2. Identify negative black swans (low probability, catastrophic downside)
3. Document early warning indicators
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
black_swans:
  positive:
    - event: "[description - VERIFIED/ASSUMED]"
      impact: "[what it would enable]"
      indicator: "[early warning sign]"
  negative:
    - event: "[description - VERIFIED/ASSUMED]"
      impact: "[what it would destroy]"
      indicator: "[early warning sign]"
```

[EXTRACT_COMPLETE]

---

## 04.4 EXTRACT: Assumption Stress Test

PRECONDITION: [EXTRACT_COMPLETE from 04.3]

METHOD Assumption Stress Test (M023) (embedded):
1. For each key assumption: identify what would disprove it
2. Identify who would disagree (stakeholders with different view)
3. Assess impact if 50% wrong
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
assumption_id: "[reference]"
assumption: "[statement]"
disproof: "[what would show this is wrong - VERIFIED/ASSUMED]"
disagreeing_stakeholders: ["[who would disagree]", ...]
impact_if_50_percent_wrong: "[description - VERIFIED/ASSUMED]"
status: VERIFIED | ASSUMED
```

[EXTRACT_COMPLETE]

---

## 04.5 VERIFY: Challenge Results

PRECONDITION: [EXTRACT_COMPLETE from 04.4]

VERIFICATION:
1. Check falsification results are genuine (not rubber-stamped)
2. Verify premortem causes are specific (not generic)
3. Confirm assumption stress tests are thorough (not superficial)
4. Validate survivability assessments

★ KEY_CLAIM: "Challenge was genuine — not a rubber stamp"

COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):
```
CC-1:
  claim: "The challenge phase was thorough — no major angle was missed"
  disproof: "A critical failure mode, bias, or assumption was not examined"
  search: "[check: regulatory risk, team dynamics, market shift, technology obsolescence, second-order effects]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add missing challenge area]

CC-2:
  claim: "[premortem for option X is comprehensive]"
  disproof: "A likely failure mode was overlooked"
  search: "[check failure taxonomy: STRUCTURAL/OPERATIONAL/EXTERNAL/COGNITIVE all considered]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add missing failure modes]

CC-3 (if deep):
  claim: "[falsification tests were genuine]"
  disproof: "Contradicting evidence was available but not found"
  search: "[attempt to find contradicting evidence that should have been discovered]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [if WEAKENED: add overlooked contradictions]
```

OUTPUT FORMAT (challenge_results.yaml):
```yaml
falsification_tests:
  - belief_id: "[ref]"
    belief: "[claim]"
    result: FALSIFIED | SURVIVED | UNTESTABLE
    evidence: "[what found]"
    action: REMOVE | STRENGTHEN | FLAG_ASSUMPTION

premortem:
  - option_id: "[ref]"
    failure_scenario: "[description]"
    causes:
      - cause: "[reason]"
        type: STRUCTURAL | OPERATIONAL | EXTERNAL | COGNITIVE
        likelihood: HIGH | MEDIUM | LOW
        preventable: YES | NO | PARTIAL
        mitigation: "[action]"
    survivability:
      worst_case: "[description]"
      recoverable: YES | NO
      reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
      verdict: PROCEED | PROCEED_WITH_CAUTION | RECONSIDER | REJECT

assumption_stress_results:
  - assumption_id: "[ref]"
    result: HOLDS | WEAKENED | BROKEN
    impact: "[description]"
    action: "[none | reduce confidence | update map]"

black_swans:
  - event: "[description]"
    type: POSITIVE | NEGATIVE
    probability: VERY_LOW | LOW
    impact: CATASTROPHIC | SEVERE | MODERATE | BENEFICIAL
    indicator: "[early warning]"
```

[VERIFY_COMPLETE]

---

## 04.6 VERIFY: Bias Check (standard/deep only)

PRECONDITION: [VERIFY_COMPLETE from 04.5]

For each bias category, detect presence and apply remediation:

BIAS CATEGORIES:
1. CONFIRMATION BIAS — Did I seek contradicting evidence?
   Remediation: Force-search 3 sources that disagree
2. AVAILABILITY BIAS — Am I overweighting recent/vivid examples?
   Remediation: Check base rates, find statistical evidence
3. ANCHORING — Did first number/option overly influence me?
   Remediation: Generate estimate BEFORE seeing anchors
4. FRAMING EFFECT — Would I decide differently if framed as loss vs gain?
   Remediation: Reframe each option in opposite terms
5. SUNK COST FALLACY — Am I continuing because of past investment?
   Remediation: Imagine starting fresh today — same choice?
6. STATUS QUO BIAS — Am I favoring 'do nothing' without justification?
   Remediation: List costs of NOT changing
7. LOSS AVERSION — Am I overweighting losses vs gains?
   Remediation: Calculate expected value, not worst case
8. PLANNING FALLACY — Am I underestimating time/cost/difficulty?
   Remediation: Use reference class forecasting
9. OPTIMISM BIAS — Am I assuming things go better than typical?
   Remediation: "What if I'm wrong?" and plan for it
10. OVERCONFIDENCE — How certain am I, and is that justified?
    Remediation: Track past predictions, calibrate
11. AUTHORITY BIAS — Am I believing X because expert said so?
    Remediation: Check expert track record, seek opposing experts
12. GROUPTHINK — Is everyone agreeing too easily?
    Remediation: Assign devil's advocate, seek outside opinion
13. SURVIVORSHIP BIAS — Am I only seeing successes, not failures?
    Remediation: Actively search for failure cases

OUTPUT FORMAT (in challenge_results.yaml):
```yaml
bias_check:
  - bias_name: "[name]"
    present: YES | NO | UNCLEAR
    evidence: "[why detected]"
    impact: NONE | MINOR | SIGNIFICANT | CRITICAL
    remediation_applied: "[what was done]"

total_biases_checked: [count]
significant_critical_count: [count requiring map update]
```

[VERIFY_COMPLETE]

---

## 04.7 FEAR RESOLUTION (conditional: only when fear_analysis=on)

### 04.7a EXTRACT: Cognitive MVP Design

PRECONDITION: [VERIFY_COMPLETE from 04.6] AND fear_analysis=on

METHOD Cognitive MVP (E010) (embedded):
1. For each unresolved fear: design smallest test to learn if fear is valid
2. Define minimal action, effort level, learning outcomes
3. Frame failure as DATA (not defeat)
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
fear_id: "[reference]"
fear: "[what user is afraid of]"
minimal_test:
  action: "[smallest thing to do - VERIFIED/ASSUMED]"
  effort: LOW | MEDIUM | HIGH
  learning_if_succeeds: "[what learned]"
  learning_if_fails: "[what learned - failure = data]"
status: VERIFIED | ASSUMED
```

[EXTRACT_COMPLETE]

### 04.7b EXTRACT: Growth Assessment

PRECONDITION: [EXTRACT_COMPLETE from 04.7a]

METHOD Growth Test (E014) (embedded):
1. For each major option: assess growth dimensions
2. Check: new learning, new skill, new experience, network expansion, thinking change
3. Classify: HIGH_GROWTH (worth even if "fails") | GAMBLING (reconsider) | NEEDS_REDESIGN (add learning)
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
growth_assessment:
  new_learning_forced: YES | NO - "[what specifically - VERIFIED/ASSUMED]"
  new_skill_developed: YES | NO - "[what specifically - VERIFIED/ASSUMED]"
  new_experience_gained: YES | NO - "[what specifically - VERIFIED/ASSUMED]"
  network_access_expanded: YES | NO - "[what specifically - VERIFIED/ASSUMED]"
  thinking_changed: YES | NO - "[what specifically - VERIFIED/ASSUMED]"
  verdict: HIGH_GROWTH | GAMBLING | NEEDS_REDESIGN
```

[EXTRACT_COMPLETE]

### 04.7c VERIFY: Fear Map Resolution

PRECONDITION: [EXTRACT_COMPLETE from 04.7b]

VERIFICATION:
1. Match each original fear (from Step 0) with resolution status
2. Classify: RESOLVED (evidence shows unfounded) | ADDRESSED (mitigation exists) | REMAINS (true risk, accepted or pivoted)
3. Verify minimal tests are genuinely minimal (not complex)
4. Confirm growth assessments are realistic

OUTPUT FORMAT (in challenge_results.yaml):
```yaml
fear_resolution:
  - fear_id: "[from Step 0]"
    fear: "[original fear]"
    resolution_status: RESOLVED | ADDRESSED | REMAINS
    resolution_details: "[explanation]"
    minimal_test: "[reference to test designed]"
    growth_verdict: "[reference to growth assessment]"
```

[VERIFY_COMPLETE]

---

## 04.8 RENDER: Challenge Results

PRECONDITION: [VERIFY_COMPLETE from all previous sections]

OUTPUT (challenge_results.yaml — complete structure):
```yaml
falsification_tests:
  - belief_id: "[ref]"
    belief: "[claim]"
    result: FALSIFIED | SURVIVED | UNTESTABLE
    evidence: "[what found]"
    action: REMOVE | STRENGTHEN | FLAG_ASSUMPTION

premortem:
  - option_id: "[ref]"
    failure_scenario: "[description]"
    causes: [...]
    survivability: [...]

assumption_stress_results:
  - assumption_id: "[ref]"
    result: HOLDS | WEAKENED | BROKEN
    impact: "[description]"

black_swans:
  - event: "[description]"
    type: POSITIVE | NEGATIVE
    probability: VERY_LOW | LOW
    impact: CATASTROPHIC | SEVERE | MODERATE | BENEFICIAL

bias_check:
  - bias_name: "[name]"
    present: YES | NO | UNCLEAR
    impact: NONE | MINOR | SIGNIFICANT | CRITICAL
    remediation_applied: "[action]"

fear_resolution: # Only if fear_analysis=on
  - fear_id: "[ref]"
    resolution_status: RESOLVED | ADDRESSED | REMAINS
    minimal_test: [...]
    growth_verdict: [...]

summary:
  beliefs_tested: [count]
  beliefs_falsified: [count]
  beliefs_survived: [count]
  premortem_causes: [count]
  black_swans_found: [count]
  assumptions_stressed: [count]
  biases_detected: [count]
  counter_checks_performed: [count]
  map_updates: ["[what changed based on challenge]", ...]
```

[RENDER_COMPLETE]

---

## 04.9 POST-PHASE CHECKLIST

□ All outputs produced? [Y/N — list missing if N]
□ ASSUMPTIONS_DECLARED logged? [count ≥ 1]
□ EVR sequence respected? [Y/N — EXTRACT→VERIFY→RENDER]
□ Counter-checks performed? [count ≥ min per depth]
□ Key claims marked ★? [count ≥ 1]
□ ASSUMED items flagged? [Y/N]
□ Artifacts schema-compliant? [Y/N]
□ Falsification attempted on key beliefs? [Y/N]
□ Premortem completed for top options? [Y/N]
□ Bias checklist completed? [Y/N — standard/deep only]
□ Fear resolution done? [Y/N or N/A if fear_analysis=off]
□ Map updated with challenge findings? [Y/N]

CHECKLIST_STATUS: PASS | FAIL

IF FAIL: Fix issues before proceeding.

---

## 04.10 GATE_04 CONDITIONS

CRITICAL (must pass):
□ Key beliefs falsification-tested — IF FAIL → SCOPE_REDUCTION_DECLARATION required
□ Premortem completed for top options — IF FAIL → SCOPE_REDUCTION_DECLARATION required
□ Post-phase checklist PASSED — IF FAIL → fix issues

REQUIRED (should pass):
□ Assumption stress test done — IF FAIL → log + flag in process_log
□ Bias checklist completed (standard/deep) — IF FAIL → log + flag in process_log
□ Counter-checks ≥ minimum — IF FAIL → perform additional checks

GATE_STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed. Fix issues or execute SCOPE_REDUCTION protocol.

---

## 04.11 TRANSITION

IF GATE_04 = OPEN:
  → Load next step file: steps/step-05-synthesize.md
  → Continue to Phase 5

IF GATE_04 = LOCKED AND challenge reveals fundamental reframe needed:
  → Return to Step 0 (rare — requires user agreement)

IF challenge reveals ALL options fatally flawed:
  → ABORT exploration (document in process_log)
