---
step: 2
name: IDENTIFY_HORIZONTAL
phase: IDENTIFY_HORIZONTAL
gate: GATE_2
time_estimate: "30-60 min"
goal: "Discover boundary and systemic risks through horizontal scanning"
requires_completion: true
next_steps: ["step-03-quantify"]
data_dependencies: [VERTICAL_RISK_INVENTORY]
outputs: [BOUNDARY_SCAN, BLIND_SPOTS, TEMPORAL_RISKS, SCENARIO_MATRIX, HORIZONTAL_RISK_INVENTORY, ASSUMPTIONS_DECLARED, POST_PHASE_CHECKLIST]
---

# Step 02: IDENTIFY_HORIZONTAL

**PRECONDITION:** GATE_1 = OPEN
**IF depth=quick → skip to step-03-quantify**

---

## ASSUMPTIONS_DECLARED

```yaml
assumptions:
  - id: A2-01
    assumption: "Boundaries defined as [list] based on [architecture/organizational structure]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If unlisted boundary produces risk, assumption wrong"
  - id: A2-02
    assumption: "Temporal scope [duration] captures drift/accumulation risks"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If risk materializes outside timeframe, scope too narrow"
  - id: A2-03
    assumption: "Blind spot interrogation covers [organizational/technical/process] domains"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If unknown-unknown emerges from uncovered domain, assumption wrong"
```

---

## ENFORCED SEQUENCE

### 2.1 Boundary Risk Scan (Method #108)

**EXTRACT:**

For EVERY boundary in the system (interfaces, handoffs, trust boundaries, organizational boundaries, technology boundaries), identify risks that exist AT the boundary.

**Method #108 (embedded, 5 steps):**
1. List ALL boundaries from system characterization (step-00):
   - Technical interfaces (API endpoints, message queues, database connections)
   - Organizational handoffs (team A → team B, vendor → internal)
   - Trust boundaries (authenticated → unauthenticated, internal → external)
   - Technology boundaries (language changes, protocol translations, platform edges)
   - Data boundaries (format conversions, encoding changes, timezone transitions)
2. For EACH boundary, ask:
   - "What can go wrong at this transition point?"
   - "What assumptions does each side make about the other?"
   - "What happens when the interface contract is violated?"
   - "Who owns failure at this boundary?"
3. Extract boundary risks (minimum 3):
   ```
   BOUNDARY: [name/location]
   SIDES: [component A] ↔ [component B]
   RISKS:
   • Risk 1: [what fails] — Mechanism: [how it fails at boundary]
   • Risk 2: [...]
   OWNERSHIP: [who is responsible for boundary failure?]
   ```
4. Identify ORPHAN boundaries (boundaries nobody owns or monitors)
5. Cross-reference with vertical risks from step-01 (boundary risk may amplify component risk)

**VERIFY:**
- ALL boundaries from architecture mapped (0 boundaries missing)
- Each boundary risk has concrete mechanism (not "things could go wrong")
- Orphan boundaries flagged as HIGH priority
- Cross-reference with step-01 completed

**RENDER:** `boundary-scan.yaml`
```yaml
boundary_scan:
  boundaries:
    - id: "B-001"
      name: "[boundary name]"
      type: TECHNICAL | ORGANIZATIONAL | TRUST | TECHNOLOGY | DATA
      sides: {a: "[component]", b: "[component]"}
      risks:
        - description: "[risk]"
          mechanism: "[how]"
          severity: HIGH | MEDIUM | LOW
      ownership: "[team/person]"
      orphan: true | false
  summary:
    total_boundaries: [count]
    total_risks: [count]
    orphan_boundaries: [count]
```

### 2.2 Blind Spot Interrogation (Method #109)

**EXTRACT:**

Systematically uncover what is NOT being seen. Three categories:

**Method #109 (embedded, 4 steps):**
1. **Known Unknowns** — gaps we acknowledge:
   - "What risks have we identified but NOT analyzed?"
   - "What data do we NEED but don't HAVE?"
   - "What questions remain UNANSWERED from step-01?"
   - List each with: gap description, why it matters, what would resolve it
2. **Unknown Knowns** — knowledge in denial:
   - "What risks does the team KNOW about but DOESN'T discuss?"
   - "What problems are 'not my job' or 'someone else handles that'?"
   - "What uncomfortable truths are being avoided?"
   - "What past incidents are being downplayed?"
   - List each with: denial mechanism, consequence of ignoring
3. **Structural blind spots** — what the process itself cannot see:
   - "What risks would a DIFFERENT team/methodology find that we missed?"
   - "What risks exist in domains we have NO expertise in?"
   - "What risks are invisible because we're inside the system?"
4. Prioritize blind spots: which ones, if illuminated, would MOST change the risk assessment?

**VERIFY:**
- ≥2 Known Unknowns identified (genuine gaps, not vague statements)
- ≥1 Unknown Known identified (requires honest self-interrogation)
- ≥1 Structural blind spot identified
- Stakeholder perspectives considered (not just analyst's view)

**RENDER:** `blind-spots.yaml`
```yaml
blind_spots:
  known_unknowns:
    - id: "KU-001"
      gap: "[what we don't know]"
      impact: "[why it matters]"
      resolution: "[what would close the gap]"
      priority: HIGH | MEDIUM | LOW
  unknown_knowns:
    - id: "UK-001"
      knowledge: "[what's being denied/ignored]"
      denial_mechanism: "[why it's being avoided]"
      consequence: "[what happens if ignored]"
  structural_blind_spots:
    - id: "SB-001"
      blind_spot: "[what we can't see]"
      reason: "[why we can't see it]"
      mitigation: "[how to reduce blind spot]"
```

### 2.3 Chaos Probe Design (Method #110)

**EXTRACT:** (IF depth=comprehensive/critical ONLY)

Design probes that would reveal hidden risks through controlled disruption.

**Method #110 (embedded, 3 steps):**
1. For top 5 critical risks from step-01, design a probe:
   - "What minimal disruption would PROVE this risk exists?"
   - "What experiment would reveal the ACTUAL failure mode?"
   - "What test would expose the REAL blast radius?"
2. For each probe, specify:
   ```
   PROBE: [name]
   TARGET: [component/boundary/process]
   DISRUPTION: [what to break/change/inject]
   EXPECTED: [what happens if risk is real]
   SAFETY: [how to limit blast radius of probe itself]
   ```
3. Prioritize probes by information value (highest uncertainty → most valuable)

**VERIFY:** Each probe has safety controls (probe must not CREATE new risks).
**RENDER:** `chaos-probes.yaml`

### 2.4 Temporal Risk Archaeology (Method #111)

**EXTRACT:**

Identify risks that emerge or change OVER TIME. Four temporal categories:

**Method #111 (embedded, 5 steps):**
1. **Drift risks** — gradual deviation from intended state:
   - Configuration drift (settings change incrementally)
   - Skill drift (team knowledge erodes as people leave)
   - Architecture drift (actual system diverges from documented system)
   - Ask: "What looks the same as 6 months ago but ISN'T?"
2. **Accumulation risks** — slow buildup of pressure:
   - Technical debt accumulation (each shortcut adds pressure)
   - Data growth (storage, performance, compliance obligations grow)
   - Regulatory burden (compliance requirements accumulate)
   - Ask: "What's growing 1% per week that nobody notices?"
3. **Decay risks** — degradation over time:
   - Dependency decay (libraries become unmaintained, CVEs accumulate)
   - Knowledge decay (documentation becomes stale, tribal knowledge lost)
   - Infrastructure decay (hardware ages, certificates expire)
   - Ask: "What works today but will BREAK if left untouched?"
4. **Erosion risks** — competitive/environmental erosion:
   - Market erosion (technology becomes obsolete)
   - Trust erosion (repeated small failures erode stakeholder confidence)
   - Ask: "What external force is slowly undermining us?"
5. For EACH temporal risk, estimate:
   - Time to materialization (weeks/months/years)
   - Sorites threshold (at what point does accumulation become crisis?)
   - Leading indicator (what signals the approaching tipping point?)

**VERIFY:**
- ≥1 risk per temporal category (drift, accumulation, decay, erosion)
- Timeframe coherent with step-00 scope (if scope is 3 months, 10-year risks are out of scope)
- Sorites thresholds defined (not just "it will eventually be a problem")

**RENDER:** `temporal-risks.yaml`
```yaml
temporal_risks:
  risks:
    - id: "T-001"
      type: DRIFT | ACCUMULATION | DECAY | EROSION
      description: "[what changes over time]"
      current_state: "[where we are now]"
      trigger_threshold: "[when it becomes crisis]"
      time_to_materialization: "[estimate]"
      leading_indicator: "[what to watch]"
      sorites_threshold: "[tipping point]"
```

### 2.5 Scenario Planning Matrix (Method #112)

**EXTRACT:**

Construct 2×2 scenario matrix from two key uncertainties.

**Method #112 (embedded, 5 steps):**
1. From all risks identified (step-01 + step-02), identify the TWO uncertainties with:
   - Highest impact on outcomes
   - Most binary (can go either way, not gradual)
   - Most independent of each other
2. Create 2×2 matrix:
   ```
   UNCERTAINTY A: [description]
     Pole 1: [outcome if A goes well]
     Pole 2: [outcome if A goes badly]

   UNCERTAINTY B: [description]
     Pole 1: [outcome if B goes well]
     Pole 2: [outcome if B goes badly]

   SCENARIOS:
     Q1 (A+, B+): [name] — [best case narrative]
     Q2 (A+, B-): [name] — [mixed narrative]
     Q3 (A-, B+): [name] — [mixed narrative]
     Q4 (A-, B-): [name] — [worst case narrative]
   ```
3. For EACH quadrant, identify:
   - Which risks from register materialize in this scenario?
   - What NEW risks emerge only in this scenario?
   - What mitigations work vs fail in this scenario?
4. Verify: scenarios are genuinely DIFFERENT (not variations of same theme)
5. Identify "robust strategies" — mitigations that work across ALL 4 scenarios

**VERIFY:**
- Two uncertainties are genuinely independent
- Four scenarios are genuinely different (distinct risk profiles)
- Each scenario has specific risks identified (not copy-paste)
- Robust strategies identified (work in all scenarios)

**RENDER:** `scenario-matrix.yaml`
```yaml
scenario_matrix:
  uncertainty_a:
    description: "[uncertainty]"
    poles: {positive: "[A+]", negative: "[A-]"}
  uncertainty_b:
    description: "[uncertainty]"
    poles: {positive: "[B+]", negative: "[B-]"}
  scenarios:
    - quadrant: "Q1 (A+, B+)"
      name: "[scenario name]"
      narrative: "[description]"
      risks_that_materialize: ["R-xxx", ...]
      new_risks: ["description", ...]
      mitigations_that_work: ["M-xxx", ...]
      mitigations_that_fail: ["M-xxx", ...]
    - quadrant: "Q2 (A+, B-)"
      # ...
    - quadrant: "Q3 (A-, B+)"
      # ...
    - quadrant: "Q4 (A-, B-)"
      # ...
  robust_strategies:
    - "[strategy that works in all 4 scenarios]"
```

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Boundary scan (≥3 boundary risks, all boundaries mapped)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Blind spots interrogated (≥2 KU, ≥1 UK, ≥1 SB)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Chaos probes designed (IF depth=comprehensive/critical)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Temporal risks (≥1 per category: drift, accumulation, decay, erosion)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "Scenario planning (4 distinct scenarios, robust strategies)"
    status: PASS | FAIL | SCOPE_REDUCED
  - item: "ASSUMPTIONS_DECLARED (≥3)"
    status: PASS | FAIL
  - item: "Counter-checks (CC2-01, CC2-02, CC2-03)"
    status: PASS | FAIL
  - item: "Horizontal inventory coherent with vertical (no contradictions)"
    status: PASS | FAIL
```

---

## COUNTER_CHECKS

**CC2-01: Grounding Check (Method #85)**
1. Sample 3 boundary risks from BOUNDARY_SCAN
2. For each: verify the boundary EXISTS in system architecture (trace to component diagram, API spec, or organizational chart)
3. For each: verify the risk MECHANISM is concrete (not "could go wrong" but "message format mismatch causes silent data corruption")
4. IF any sample fails grounding → BLOCKER: remove phantom boundary risks, re-scan
5. Pass criteria: 3/3 boundary risks have concrete source + mechanism

**CC2-02: Phantom Hunt (Method #168)**
1. Re-scan system boundaries independently (fresh scan, don't reference BOUNDARY_SCAN)
2. Compare fresh scan with BOUNDARY_SCAN results
3. IF boundaries in BOUNDARY_SCAN don't appear in fresh scan → phantom boundary
4. IF fresh scan finds boundaries NOT in BOUNDARY_SCAN → missed boundary (add)
5. Pass criteria: 0 phantom boundaries, ≤1 missed boundary

**CC2-03: Coherence Check (Method #84)**
1. Load VERTICAL_RISK_INVENTORY from step-01
2. Load HORIZONTAL_RISK_INVENTORY from step-02
3. Verify: no contradictions (risk rated HIGH in vertical but dismissed in horizontal)
4. Verify: boundary risks connect to component risks (boundaries are WHERE components meet)
5. Verify: temporal risks don't conflict with step-00 timeframe
6. Pass criteria: 0 contradictions between vertical and horizontal

---

## GATE_2 EVALUATION

**Conditions:** G2-01 through G2-06 from gates.yaml
**IF GATE_2 PASS → proceed to step-03.**

---

## NEXT STEP

**Read tool:** `steps/step-03-quantify.md`
**PRECONDITION:** GATE_2 = OPEN OR (depth=quick AND GATE_1=OPEN)
