---
step: 0
name: GROUND
phase: GROUND
gate: GATE_0
time_estimate: "30-60 min (standard), 15 min (quick)"
goal: "Establish theoretical framing BEFORE searching for risks"
requires_completion: true
next_steps: ["step-01-identify-vertical"]
data_dependencies:
  - data/theoretical-foundations.yaml
  - data/coverage-scoring.yaml
outputs:
  - SCOPE_FRAME (subject, boundaries, timeframe, stakes)
  - RISK_GENESIS_SCAN (6 sources × risks)
  - SYSTEM_PROFILE (Perrow matrix: complexity + coupling)
  - UNCERTAINTY_MAP (risk vs uncertainty vs ambiguity)
  - ASSUMPTIONS_DECLARED (≥3 assumptions)
  - POST_PHASE_CHECKLIST (8/8 items)
---

# Step 00: GROUND

**IF crisis_mode=on → SKIP this step, go to step-01-identify-vertical.**

---

## ASSUMPTIONS_DECLARED (MANDATORY — Execute BEFORE proceeding)

**Declare ALL interpretative decisions and assumptions about scope, stakes, system.**

```yaml
assumptions:
  - id: A0-01
    assumption: "Scope boundaries defined as [X] exclude [Y]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If [condition], assumption violated"

  - id: A0-02
    assumption: "Stakes assessed as [LEVEL] because [rationale]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If impact exceeds [threshold], stakes underestimated"

  - id: A0-03
    assumption: "System characterized as [complexity] + [coupling] based on [evidence]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If [emergent behavior observed], complexity misclassified"
```

**Counter-check (Method #78 Assumption Excavation):**
1. For each assumption, ask: "What am I taking for granted?"
2. Surface: conscious (stated), inherited (industry standard), invisible (cultural)
3. Stress test: If assumption 50% wrong, does analysis break?

**IF 0 assumptions declared → GATE_0 BLOCKER → HALT, declare assumptions.**

---

## ENFORCED SEQUENCE

### 0.1 Frame Assessment Scope

**EXTRACT:**

```
ASSESSMENT_SCOPE:
"We are assessing risks for: [describe project/decision/system]"

SCOPE_BOUNDARIES:
• In scope: [what IS included]
• Out of scope: [what is NOT included]
• Timeframe: [assessment horizon: weeks? months? years?]

STAKES: [ ] LOW  [ ] MEDIUM  [ ] HIGH  [ ] CRITICAL

STAKES_RATIONALE:
• LOW: Inconvenience if risks materialize
• MEDIUM: Significant cost/delay but recoverable
• HIGH: Major impact, recovery uncertain
• CRITICAL: Existential threat, irreversible consequences
```

**VERIFY:**
1. Check boundaries mutually exclusive (no overlap between in-scope/out-of-scope)
2. Check timeframe coherent with stakes (CRITICAL + 1-week horizon = suspicious)
3. Check stakes justified (not arbitrary HIGH without evidence)

**RENDER:**
```yaml
scope_frame:
  subject: "[one-line description]"
  in_scope: ["item 1", "item 2", ...]
  out_of_scope: ["item 1", "item 2", ...]
  timeframe: "[duration]"
  stakes: LOW | MEDIUM | HIGH | CRITICAL
  stakes_rationale: "[why this level]"
```

---

### 0.2 Check Integration Inputs

**IF Deep-Explore OR Deep-Verify outputs available:**

```
DEEP_EXPLORE_INPUTS:
□ Exploration report available? [Y/N]
  → IF Y: Extract assumptions, dependencies, consequences

DEEP_VERIFY_INPUTS:
□ Verification report available? [Y/N]
  → IF Y: Extract impossibility findings, ungrounded claims

EXTRACTED_INPUTS:
• Assumptions from Explore: [list]
• Dependencies from Explore: [list]
• Consequences from Explore: [list]
• Impossibilities from Verify: [list]
• Ungrounded claims from Verify: [list]
```

**RENDER:**
```yaml
integration_inputs:
  deep_explore:
    available: true | false
    assumptions: ["assumption 1", ...]
    dependencies: ["dep 1", ...]
    consequences: ["consequence 1", ...]
  deep_verify:
    available: true | false
    impossibilities: ["impossibility 1", ...]
    ungrounded_claims: ["claim 1", ...]
```

---

### 0.3 Risk Genesis Model (Method #001)

**Systematically scan 6 fundamental sources from which ALL risks originate.**

**EXTRACT (for EACH source):**

#### SOURCE 1: COMPLEXITY
**Question:** "How does emergent behavior, non-linearity manifest here?"

```
COMPLEXITY_RISKS:
• Risk 1: [describe emergent behavior risk]
  Genesis: Interactions between [components] create [unexpected behavior]

• Risk 2: [describe non-linear risk]
  Genesis: Small change in [X] causes large change in [Y]

• Risk 3: [describe feedback loop risk]
  Genesis: [Reinforcing | Balancing] feedback between [elements]

Detection difficulty: HIGH (emerges only in combination)
```

#### SOURCE 2: COUPLING
**Question:** "How does propagation, cascade, shared dependencies manifest here?"

```
COUPLING_RISKS:
• Risk 1: [describe cascade risk]
  Genesis: Failure of [A] propagates to [B, C, D]

• Risk 2: [describe shared dependency risk]
  Genesis: [Multiple systems] depend on [single resource]

• Risk 3: [describe tight coupling risk]
  Genesis: [System A] cannot function without [System B]

Detection difficulty: MEDIUM (visible in architecture)
```

#### SOURCE 3: UNCERTAINTY
**Question:** "Where is information incomplete, volatile, unknowable?"

```
UNCERTAINTY_RISKS:
• Risk 1: [describe epistemic uncertainty]
  Genesis: We don't know [X] but could learn it

• Risk 2: [describe aleatoric uncertainty]
  Genesis: [X] is inherently random/unpredictable

• Risk 3: [describe ambiguity]
  Genesis: Multiple interpretations of [X] exist

Detection difficulty: VARIES (epistemic reducible, aleatoric not)
```

#### SOURCE 4: AGENCY
**Question:** "Who could act adversarially, negligently, with misaligned incentives?"

```
AGENCY_RISKS:
• Risk 1: [describe adversarial risk]
  Genesis: [Actor] could intentionally [attack/exploit/sabotage]

• Risk 2: [describe negligence risk]
  Genesis: [Actor] could accidentally [corrupt/delete/break]

• Risk 3: [describe misalignment risk]
  Genesis: [Actor] optimizes [their goal] at expense of [system goal]

Detection difficulty: HIGH (adversaries adapt)
```

#### SOURCE 5: TEMPORALITY
**Question:** "What is slowly eroding, drifting, accumulating, decaying?"

```
TEMPORALITY_RISKS:
• Risk 1: [describe drift risk]
  Genesis: [Configuration/code/data] gradually diverges from [specification]

• Risk 2: [describe accumulation risk]
  Genesis: [Technical debt/data/errors] accumulates over time

• Risk 3: [describe decay risk]
  Genesis: [Knowledge/skills/infrastructure] erodes without maintenance

Detection difficulty: VERY HIGH (each increment is small)
```

#### SOURCE 6: BOUNDARIES
**Question:** "Where do interfaces, handoffs, trust boundaries create gaps?"

```
BOUNDARY_RISKS:
• Risk 1: [describe interface risk]
  Genesis: [System A] assumes [X], but [System B] provides [Y]

• Risk 2: [describe handoff risk]
  Genesis: Responsibility transfers from [Team A] to [Team B], gap in [ownership]

• Risk 3: [describe trust boundary risk]
  Genesis: Data crosses from [trusted zone] to [untrusted zone] without [validation]

Detection difficulty: HIGH (each side assumes the other handles it)
```

**VERIFY:**
1. Check EVERY source has ≥1 risk (if 0 → investigate harder OR justify absence)
2. Check risks specific to project (not generic "technical debt might accumulate")
3. Check genesis explanation present (WHY risk exists, not just WHAT it is)

**RENDER:**
```yaml
risk_genesis_scan:
  complexity_risks: [{id, description, genesis, detection_difficulty}, ...]
  coupling_risks: [{id, description, genesis, detection_difficulty}, ...]
  uncertainty_risks: [{id, description, genesis, detection_difficulty}, ...]
  agency_risks: [{id, description, genesis, detection_difficulty}, ...]
  temporality_risks: [{id, description, genesis, detection_difficulty}, ...]
  boundary_risks: [{id, description, genesis, detection_difficulty}, ...]
  total_genesis_risks: [count]
```

---

### 0.4 Uncertainty Classification (Method #002)

**Classify EVERY identified uncertainty into Knight's categories.**

**EXTRACT:**

```
UNCERTAINTY_MAP:

RISK (measurable, probabilistic):
• [Uncertainty 1]: Known frequency from [data source]
  Probability: [X%]

• [Uncertainty 2]: Can model with [distribution]
  Probability: [range]

UNCERTAINTY (unmeasurable, no probability):
• [Uncertainty 1]: No historical data, novel situation
  Strategy: [scenario planning | hedging | options]

• [Uncertainty 2]: Complex interactions, unpredictable
  Strategy: [monitor | iterate | adaptive]

AMBIGUITY (multiple valid interpretations):
• [Ambiguity 1]: [Stakeholder A] interprets as [X], [Stakeholder B] as [Y]
  Resolution: [alignment meeting | explicit choice | both approaches]

• [Ambiguity 2]: [Regulation] unclear on [aspect]
  Resolution: [legal counsel | conservative interpretation | wait for clarity]
```

**VERIFY:**
1. Check classification appropriate (risk = has probability, uncertainty = doesn't)
2. Check strategy matches type (don't assign probabilities to unmeasurable uncertainty)
3. Check ambiguities identified stakeholders (who interprets differently?)

**RENDER:**
```yaml
uncertainty_map:
  risks: [{item, probability, data_source}, ...]
  uncertainties: [{item, strategy, rationale}, ...]
  ambiguities: [{item, interpretations, resolution}, ...]
```

---

### 0.5 System Characterization (Method #003 — Perrow Matrix)

**Assess system position on complexity + coupling dimensions.**

**EXTRACT:**

```
SYSTEM_CHARACTERIZATION (Perrow Normal Accidents Theory):

COMPLEXITY AXIS:
[ ] LINEAR: Sequential steps, visible relationships, predictable
[ ] COMPLEX: Interactions, feedback loops, emergent behavior

Evidence for complexity level:
• [Evidence 1]
• [Evidence 2]
• [Evidence 3]

COUPLING AXIS:
[ ] LOOSELY COUPLED: Buffers, slack, can pause/restart
[ ] TIGHTLY COUPLED: No buffers, real-time, failure propagates fast

Evidence for coupling level:
• [Evidence 1]
• [Evidence 2]
• [Evidence 3]

PERROW MATRIX POSITION:
┌─────────────────┬──────────────────┐
│ Linear +        │ Linear +         │
│ Loose           │ Tight            │
│ [Accidents rare]│ [Visible early]  │
├─────────────────┼──────────────────┤
│ Complex +       │ Complex +        │ ← [MARK YOUR POSITION]
│ Loose           │ Tight            │
│ [Manageable]    │ [INEVITABLE]     │
└─────────────────┴──────────────────┘

IMPLICATIONS:
• If Complex + Tight → Normal Accidents inevitable (Perrow)
• Strategy: Reduce complexity OR add buffers (loosen coupling)
• Cannot eliminate accidents, only frequency
```

**VERIFY:**
1. Check evidence supports classification (not gut feel)
2. Check position realistic (most modern systems = Complex + Tight)
3. Check implications acknowledged (if inevitable accidents, need graceful degradation)

**RENDER:**
```yaml
system_profile:
  complexity_level: LINEAR | COMPLEX
  complexity_evidence: ["evidence 1", "evidence 2", ...]
  coupling_level: LOOSE | TIGHT
  coupling_evidence: ["evidence 1", "evidence 2", ...]
  perrow_position: "linear_loose | linear_tight | complex_loose | complex_tight"
  accident_propensity: RARE | MODERATE | HIGH | INEVITABLE
  implications: ["implication 1", ...]
```

---

## POST_PHASE_CHECKLIST (MANDATORY — Execute BEFORE gate evaluation)

**Mark each item [PASS], [FAIL], or [SCOPE_REDUCED].**

```yaml
post_phase_checklist:
  - item: "Scope framed with all 4 fields (subject, boundaries, timeframe, stakes)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[where documented]"

  - item: "Genesis scan complete (6 sources, ≥1 risk each OR justified absence)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[risk counts per source]"

  - item: "Uncertainty map classified (risk vs uncertainty vs ambiguity)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[item counts per category]"

  - item: "System characterized (Perrow matrix position with evidence)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[complexity + coupling levels]"

  - item: "Integration inputs extracted (if available)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[Deep-Explore/Verify inputs listed]"

  - item: "ASSUMPTIONS_DECLARED (≥3 assumptions with falsification criteria)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[assumption count]"

  - item: "Counter-checks executed (CC0-01, CC0-02, CC0-03)"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[counter-check results]"

  - item: "All artifacts rendered in YAML format"
    status: PASS | FAIL | SCOPE_REDUCED
    evidence: "[artifact list]"
```

**IF any item = FAIL → return to that section, fix.**
**IF any item = SCOPE_REDUCED → document justification in process log.**

---

## COUNTER_CHECKS (Execute BEFORE gate evaluation)

### CC0-01: Grounding Check (Method #85)
**Action:** Sample 3 genesis risks → verify each has source traceability.

```
1. Select 3 random risks from RISK_GENESIS_SCAN
2. For each risk:
   a. Verify genesis source documented (which of 6 sources?)
   b. Verify description specific (not generic)
   c. Verify detection difficulty justified
3. Record results:
   - Risk 1: [GROUNDED | PHANTOM]
   - Risk 2: [GROUNDED | PHANTOM]
   - Risk 3: [GROUNDED | PHANTOM]
```

**Pass criteria:** All 3 = GROUNDED
**Fail action:** BLOCKER → remove phantom risks, re-scan genesis

### CC0-02: Phantom Hunt (Method #168)
**Action:** Re-scan scope boundaries → verify no out-of-scope elements included.

```
1. Load SCOPE_FRAME (in_scope, out_of_scope)
2. Scan RISK_GENESIS_SCAN for all risks
3. For each risk:
   a. Verify risk relates to in_scope items
   b. Verify risk does NOT relate to out_of_scope items
4. Record results:
   - In-scope risks: [count]
   - Out-of-scope risks found: [count] (PHANTOMS)
```

**Pass criteria:** 0 out-of-scope risks
**Fail action:** ERROR → flag scope drift, remove out-of-scope risks

### CC0-03: Coherence Check (Method #84)
**Action:** Verify stakes assessment coherent with timeframe + boundaries.

```
1. Load SCOPE_FRAME (stakes, timeframe, boundaries)
2. Check coherence:
   a. CRITICAL stakes + 1-week timeframe = suspicious (re-verify)
   b. LOW stakes + multi-year timeframe = suspicious (may escalate)
   c. Narrow boundaries + HIGH stakes = verify not missed scope
3. Record contradictions: [list OR "none found"]
```

**Pass criteria:** No contradictions OR contradictions justified
**Fail action:** WARNING → resolve contradiction OR document justification

---

## GATE_0 EVALUATION

**File:** `gates.yaml`, **Gate:** `GATE_0`

**Execute after completing ENFORCED SEQUENCE + POST_PHASE_CHECKLIST + COUNTER_CHECKS.**

**Conditions (from gates.yaml):**
- G0-01: Scope framed (BLOCKER)
- G0-02: Genesis sources scanned (CRITICAL)
- G0-03: System characterized (CRITICAL)
- G0-04: Uncertainty classified (ERROR)
- G0-05: ASSUMPTIONS_DECLARED (BLOCKER)

**IF GATE_0 PASS → proceed to step-01-identify-vertical.**
**IF GATE_0 FAIL (BLOCKER) → HALT, fix violations.**
**IF GATE_0 FAIL (CRITICAL) → SCOPE_REDUCTION OR fix.**

---

## ARTIFACTS OUTPUT

**Save to:** `{output_directory}/deep-risk-artifacts/`

**Files:**
1. `scope-frame.yaml` — Scope boundaries, timeframe, stakes
2. `risk-genesis-scan.yaml` — 6 sources × risks with genesis explanations
3. `uncertainty-map.yaml` — Risk vs uncertainty vs ambiguity classifications
4. `system-profile.yaml` — Perrow matrix position, accident propensity
5. `integration-inputs.yaml` — Deep-Explore/Verify extracted data (if available)
6. `assumptions-ground.yaml` — A0-01..A0-0N assumptions with falsification criteria
7. `counter-checks-ground.yaml` — CC0-01..CC0-03 results
8. `post-phase-checklist-ground.yaml` — 8/8 items with status

---

## DEPTH ADJUSTMENTS

**Quick depth:**
- Skip 0.4 (Uncertainty Classification) — proceed with risk/uncertainty mixed
- Skip 0.5 (System Characterization) — assume LINEAR + LOOSE
- Minimum genesis risks: 3 sources (not 6)
- Minimum assumptions: 2 (not 3)

**Standard depth:**
- Execute all sections as written

**Comprehensive/Critical depth:**
- Add external research validation (search for precedent systems, failures)
- Add stakeholder interviews (verify scope boundaries with actual users)
- Add sensitivity analysis (test assumptions at 10%, 50%, 100% wrong)

---

## NEXT STEP

**Read tool:** `steps/step-01-identify-vertical.md`

**PRECONDITION:** GATE_0 = OPEN OR crisis_mode = on
