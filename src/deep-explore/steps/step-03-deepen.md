# Step 03: Deepen

INPUTS (from workflow.md ARTIFACT SCHEMAS):
- option_map.yaml (from Step 02)

OUTPUTS:
- consequence_map.yaml

ENFORCEMENT: ASSUMPTIONS_DECLARED, EVR, COUNTER_CHECKS (min 1/2/3), POST-PHASE CHECKLIST, GATE_03

---

## 03.0 ASSUMPTIONS_DECLARED

| ID    | Assumption                      | Type         | Confidence | Falsification Criterion       |
|-------|---------------------------------|--------------|------------|-------------------------------|
| H-3xx | [causal relationships]          | DOMAIN       | HIGH/MED/LOW | [causation doesn't hold]     |
| H-3xx | [consequence scope]             | INTERPRETIVE | [level]    | [scope wider/narrower]       |
| H-3xx | [reversibility assumptions]     | CONTEXTUAL   | [level]    | [less reversible than assumed]|

Minimum 1 assumption declared. Add rows as needed.

---

## 03.1 EXTRACT: Abstraction Navigation

PRECONDITION: None (first extraction in this phase)

METHOD Abstraction Laddering (E002) (embedded):
1. For each key option: identify WHY (higher purpose), WHAT (current level), HOW (implementation), DETAILS (specifics)
2. Record observations at each level without interpretation
3. Tag each observation with level marker: [WHY]/[WHAT]/[HOW]/[DETAILS]
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
abstraction_levels:
  why: ["[observation - VERIFIED/ASSUMED]", ...]
  what: ["[observation - VERIFIED/ASSUMED]", ...]
  how: ["[observation - VERIFIED/ASSUMED]", ...]
  details: ["[observation - VERIFIED/ASSUMED]", ...]
```

[EXTRACT_COMPLETE]

---

## 03.2 EXTRACT: Counterfactual Analysis

PRECONDITION: [EXTRACT_COMPLETE from 03.1]

METHOD Counterfactual Thinking (E004) (embedded):
1. For each option, ask: "What would NOT happen if this didn't exist?"
2. Identify NECESSARY elements (cannot achieve goal without)
3. Identify NICE-TO-HAVE elements (helpful but not essential)
4. Tag each with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
counterfactuals:
  - would_not_happen: "[outcome - VERIFIED/ASSUMED]"
    necessity_level: NECESSARY | NICE_TO_HAVE
```

[EXTRACT_COMPLETE]

---

## 03.3 EXTRACT: Boundary Analysis

PRECONDITION: [EXTRACT_COMPLETE from 03.2]

METHOD Boundary Analysis (E005) (embedded):
1. For each option: identify where it stops working (edge cases, limits)
2. Document boundary conditions
3. Assess boundary type: HARD (cannot cross) | SOFT (costly to cross)
4. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
boundaries:
  - boundary: "[description - VERIFIED/ASSUMED]"
    type: HARD | SOFT
    condition: "[when reached]"
```

[EXTRACT_COMPLETE]

---

## 03.4 EXTRACT: Causal Relationships

PRECONDITION: [EXTRACT_COMPLETE from 03.3]

METHOD Causal Models (M011) (embedded):
1. Identify what influences what (A → B relationships)
2. Mark direction: positive (A increases → B increases) | negative (A increases → B decreases)
3. Mark dependency type: direct | indirect
4. Identify leverage points (high impact interventions)
5. Tag with STATUS: VERIFIED | ASSUMED

OUTPUT FORMAT:
```yaml
option_id: "[reference]"
causal_relationships:
  - from: "[element A]"
    to: "[element B]"
    direction: positive | negative
    type: direct | indirect
    status: VERIFIED | ASSUMED
leverage_points: ["[point - VERIFIED/ASSUMED]", ...]
```

[EXTRACT_COMPLETE]

---

## 03.5 VERIFY: Consequence Verification

PRECONDITION: [EXTRACT_COMPLETE from 03.4]

METHOD Consequence Analysis (M012) (embedded):
1. For each option: enumerate immediate consequences (gains, costs, risks)
2. Enumerate downstream consequences (opens, closes, requires)
3. Verify each with evidence or mark ASSUMED with reason
4. Calculate verification_ratio = verified/(verified+assumed)
5. Tag EVERY consequence with STATUS: VERIFIED | ASSUMED

VERIFICATION:
1. Check each consequence has status tag (UNTAGGED = HALT)
2. Verify sources for VERIFIED consequences
3. Document reason for ASSUMED consequences

★ KEY_CLAIM: "Each verified consequence is genuinely verified (not rubber-stamped)"

COUNTER-CHECKS (minimum per depth: quick=1, standard=2, deep=3):
```
CC-1:
  claim: "[verified consequence X]"
  disproof: "[what would show this consequence doesn't follow]"
  search: "[alternative causal path checked]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [none | downgrade to ASSUMED | remove]

CC-2:
  claim: "[verified consequence Y]"
  disproof: "[what would show this is incorrect]"
  search: "[edge case or exception checked]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [none | downgrade to ASSUMED | remove]

CC-3 (if deep):
  claim: "[verified consequence Z]"
  disproof: "[what would invalidate this]"
  search: "[contradicting evidence sought]"
  result: CONFIRMED | WEAKENED | REFUTED
  action: [none | downgrade to ASSUMED | remove]
```

[VERIFY_COMPLETE]

---

## 03.6 VERIFY: Reversibility Check

PRECONDITION: [VERIFY_COMPLETE from 03.5]

METHOD Reversibility Check (M013) (embedded):
1. For each option: assess how easily it can be undone
2. Identify point of no return (when becomes hard/impossible to reverse)
3. Classify: HIGH (minimal cost) | MEDIUM (significant cost) | LOW (very difficult) | IRREVERSIBLE
4. Tag with STATUS: VERIFIED | ASSUMED

VERIFICATION:
1. Check point of no return is specific (not vague "later")
2. Verify reversibility classification has supporting evidence
3. Confirm irreversibility claims are accurate (not exaggerated)

OUTPUT FORMAT (in consequence_map.yaml):
```yaml
option_id: "[reference]"
reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
point_of_no_return: "[specific trigger - VERIFIED/ASSUMED]"
reversal_cost: "[description - VERIFIED/ASSUMED]"
```

[VERIFY_COMPLETE]

---

## 03.7 VERIFY: Dependency Analysis

PRECONDITION: [VERIFY_COMPLETE from 03.6]

METHOD Dependency Mapping (embedded):
1. Identify decision dependencies (A blocks B, C requires A first)
2. Identify external dependencies (controlled by others)
3. Verify dependency relationships (not assumed)
4. Tag with STATUS: VERIFIED | ASSUMED

VERIFICATION:
1. Check dependencies are real (not hypothetical)
2. Verify external dependency status is current
3. Confirm dependency direction is correct

OUTPUT FORMAT (in consequence_map.yaml):
```yaml
decision_dependencies:
  - decision_a: "[name]"
    blocks: ["[decision B]", ...]
    requires: ["[decision C must happen first]", ...]
external_dependencies:
  - dependency: "[what]"
    controlled_by: "[who/what]"
    status: VERIFIED | ASSUMED
    current_state: "[description]"
```

[VERIFY_COMPLETE]

---

## 03.8 RENDER: Consequence Map

PRECONDITION: [VERIFY_COMPLETE from 03.7]

OUTPUT (consequence_map.yaml):
```yaml
consequences:
  - option_id: "[reference]"
    immediate:
      gains: ["[gain - VERIFIED/ASSUMED]", ...]
      costs: ["[cost - VERIFIED/ASSUMED]", ...]
      risks: ["[risk - VERIFIED/ASSUMED]", ...]
    downstream:
      opens: ["[opportunity - VERIFIED/ASSUMED]", ...]
      closes: ["[foreclosed path - VERIFIED/ASSUMED]", ...]
      requires: ["[prerequisite - VERIFIED/ASSUMED]", ...]
    reversibility: HIGH | MEDIUM | LOW | IRREVERSIBLE
    point_of_no_return: "[trigger - VERIFIED/ASSUMED]"
    dependencies:
      decision: ["[what must be decided first]", ...]
      external: ["[dependency - VERIFIED/ASSUMED]", ...]
    verification_ratio: "[verified/(verified+assumed)]"

abstraction_levels:
  - option_id: "[reference]"
    why: ["[observation - VERIFIED/ASSUMED]", ...]
    what: ["[observation - VERIFIED/ASSUMED]", ...]
    how: ["[observation - VERIFIED/ASSUMED]", ...]
    details: ["[observation - VERIFIED/ASSUMED]", ...]

causal_relationships:
  - option_id: "[reference]"
    relationships:
      - from: "[A]"
        to: "[B]"
        direction: positive | negative
        type: direct | indirect
        status: VERIFIED | ASSUMED
    leverage_points: ["[point - VERIFIED/ASSUMED]", ...]

boundaries:
  - option_id: "[reference]"
    boundaries:
      - boundary: "[description - VERIFIED/ASSUMED]"
        type: HARD | SOFT
        condition: "[when reached]"

counterfactuals:
  - option_id: "[reference]"
    would_not_happen: ["[outcome - VERIFIED/ASSUMED]", ...]
    necessary_elements: ["[element - VERIFIED/ASSUMED]", ...]
    nice_to_have: ["[element - VERIFIED/ASSUMED]", ...]
```

[RENDER_COMPLETE]

---

## 03.9 POST-PHASE CHECKLIST

□ All outputs produced? [Y/N — list missing if N]
□ ASSUMPTIONS_DECLARED logged? [count ≥ 1]
□ EVR sequence respected? [Y/N — EXTRACT→VERIFY→RENDER]
□ Counter-checks performed? [count ≥ min per depth]
□ Key claims marked ★? [count ≥ 1]
□ ASSUMED items flagged? [Y/N]
□ Artifacts schema-compliant? [Y/N]
□ Each consequence tagged VERIFIED/ASSUMED? [Y/N — untagged count: 0]
□ Reversibility assessed per option? [Y/N]
□ Dependencies mapped? [Y/N]
□ Verification ratio calculated? [Y/N — value: ___]

CHECKLIST_STATUS: PASS | FAIL

IF FAIL: Fix issues before proceeding.

---

## 03.10 GATE_03 CONDITIONS

CRITICAL (must pass):
□ Consequences analyzed per option — IF FAIL → SCOPE_REDUCTION_DECLARATION required
□ Each consequence tagged VERIFIED/ASSUMED — IF FAIL → go back and tag (BLOCKER)
□ Post-phase checklist PASSED — IF FAIL → fix issues

REQUIRED (should pass):
□ Reversibility assessed — IF FAIL → log + flag in process_log
□ Dependencies mapped — IF FAIL → log + flag in process_log
□ Counter-checks ≥ minimum — IF FAIL → perform additional checks

GATE_STATUS: OPEN | LOCKED

IF LOCKED: Cannot proceed. Fix issues or execute SCOPE_REDUCTION protocol.

---

## 03.11 TRANSITION

IF GATE_03 = OPEN:
  → Load next step file: steps/step-04-challenge.md
  → Continue to Phase 4

IF GATE_03 = LOCKED AND consequences unverifiable:
  → Consider return to Step 1 (if iterations remaining)
  → OR proceed with ASSUMED flags (if max loops reached)

IF reframe needed (problem redefined):
  → Return to Step 0 (rare — requires user agreement)

IF all options' consequences unacceptable:
  → Consider ABORT (document in process_log)
