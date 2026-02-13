---
step: 1
name: IDENTIFY_VERTICAL
phase: IDENTIFY_VERTICAL
gate: GATE_1
time_estimate: "45-90 min (standard), 20 min (quick)"
goal: "Systematically discover risks by drilling DEEP into components"
requires_completion: true
next_steps: ["step-02-identify-horizontal"]
data_dependencies:
  - RISK_GENESIS_SCAN (from step-00)
  - SYSTEM_PROFILE (from step-00)
outputs:
  - TAXONOMY_SCAN (10 categories × risks)
  - FAILURE_MODE_ENUMERATION (component failures)
  - THREAT_MODEL (STRIDE adversarial scenarios)
  - DEPENDENCY_RISKS (external dependencies)
  - VERTICAL_RISK_INVENTORY (all component-level risks)
  - ASSUMPTIONS_DECLARED (≥3 assumptions)
  - POST_PHASE_CHECKLIST (8/8 items)
---

# Step 01: IDENTIFY_VERTICAL

**PRECONDITION:** GATE_0 = OPEN OR crisis_mode = on
**IF PRECONDITION NOT MET → CRITICAL PROCESS VIOLATION → HALT**

---

## ASSUMPTIONS_DECLARED (MANDATORY — Execute BEFORE proceeding)

```yaml
assumptions:
  - id: A1-01
    assumption: "Component boundaries defined as [X] based on [architecture/docs]"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If actual component structure differs, boundaries wrong"

  - id: A1-02
    assumption: "Failure modes assumed independent (no cascades within vertical extraction)"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If failure of [A] triggers [B], independence violated"

  - id: A1-03
    assumption: "Taxonomy categories [list] exhaustive for this project type"
    confidence: HIGH | MEDIUM | LOW
    falsification_criteria: "If risk found not fitting any category, taxonomy incomplete"
```

---

## ENFORCED SEQUENCE

### 1.1 Risk Taxonomy Scan (Method #101)

**EXTRACT:** Systematic sweep across 10 predefined categories.

```
ARCHITECTURE RISKS:
• Technical: [describe risk] — Genesis: [which source from step-00?]
• Business: [describe risk] — Genesis: [source]

DATA RISKS:
• Technical: [e.g., data loss, corruption, staleness]
• Business: [e.g., privacy breach, compliance violation]

SECURITY RISKS:
• Technical: [e.g., injection, XSS, auth bypass]
• Business: [e.g., reputation damage, legal liability]

OPERATIONS RISKS:
• Technical: [e.g., deployment failure, monitoring blind spots]
• Business: [e.g., SLA breach, customer churn]

DEPENDENCY RISKS:
• Technical: [e.g., library vulnerability, API deprecation]
• Business: [e.g., vendor lock-in, pricing changes]

PEOPLE RISKS:
• Technical: [e.g., key person departure, knowledge loss]
• Business: [e.g., team burnout, hiring delays]

REGULATORY RISKS:
• Technical: [e.g., compliance controls missing]
• Business: [e.g., regulatory fine, audit failure]

FINANCIAL RISKS:
• Technical: [e.g., cloud cost spike, inefficient resource use]
• Business: [e.g., budget overrun, ROI negative]

TIMELINE RISKS:
• Technical: [e.g., estimation error, technical blockers]
• Business: [e.g., market window missed, competitor launch first]

STRATEGIC RISKS:
• Technical: [e.g., wrong technology choice, technical debt]
• Business: [e.g., product-market misfit, pivot too late]
```

**VERIFY:**
1. Each category has ≥1 risk (if empty → investigate harder OR justify)
2. Each risk tagged with genesis source from step-00 (complexity/coupling/etc.)
3. Risks specific to project (not generic checklist items)

**RENDER:**
```yaml
taxonomy_scan:
  architecture_risks: [{id, description, genesis_source, severity}, ...]
  data_risks: [...]
  security_risks: [...]
  operations_risks: [...]
  dependency_risks: [...]
  people_risks: [...]
  regulatory_risks: [...]
  financial_risks: [...]
  timeline_risks: [...]
  strategic_risks: [...]
  total_risks: [count]
  empty_categories: [list OR "none"]
```

---

### 1.2 Failure Mode Enumeration (Method #102)

**EXTRACT:** For each critical component, enumerate HOW it can fail.

**Method #102 (embedded, 4 steps):**
1. List critical components (from architecture)
2. For EACH component, ask: "How can this fail?" (modes: crash, hang, corrupt, slow, incorrect output)
3. For EACH mode, assess: Probability, Detectability, Effect on system
4. Prioritize by RPN (Risk Priority Number = P × D × E)

```
COMPONENT: [Component Name]
Failure Mode 1: [e.g., crashes on invalid input]
  - Probability: HIGH | MEDIUM | LOW
  - Detectability: EASY | MEDIUM | HARD
  - Effect: CATASTROPHIC | MAJOR | MINOR
  - RPN: [P×D×E score]

Failure Mode 2: [e.g., returns stale data]
  - [similar fields]

[Repeat for all critical components]
```

**VERIFY:**
1. All critical components have ≥1 failure mode
2. RPN calculated for prioritization
3. Detection mechanisms identified (logs, monitors, tests)

**RENDER:**
```yaml
failure_mode_enumeration:
  components:
    - name: "[Component A]"
      failure_modes:
        - mode: "[description]"
          probability: HIGH | MEDIUM | LOW
          detectability: EASY | MEDIUM | HARD
          effect: CATASTROPHIC | MAJOR | MINOR
          rpn: [score]
      [...]
  total_failure_modes: [count]
  top_5_by_rpn: [list]
```

---

### 1.3 Threat Modeling (Method #103 — STRIDE)

**EXTRACT:** Apply STRIDE framework for adversarial scenarios.

**Method #103 (embedded, STRIDE categories):**
1. **S**poofing: Can attacker impersonate legitimate user/system?
2. **T**ampering: Can attacker modify data/code in transit or storage?
3. **R**epudiation: Can actor deny actions they performed?
4. **I**nformation Disclosure: Can attacker access confidential data?
5. **D**enial of Service: Can attacker make system unavailable?
6. **E**levation of Privilege: Can attacker gain unauthorized permissions?

```
SPOOFING THREATS:
• [Threat 1]: Attacker could [action] by [method]
  Likelihood: HIGH | MEDIUM | LOW
  Mitigation: [existing OR planned]

TAMPERING THREATS:
• [e.g., attacker modifies request in transit]

REPUDIATION THREATS:
• [e.g., user denies transaction, no audit trail]

INFORMATION DISCLOSURE THREATS:
• [e.g., SQL injection exposes customer data]

DENIAL OF SERVICE THREATS:
• [e.g., resource exhaustion attack]

ELEVATION OF PRIVILEGE THREATS:
• [e.g., path traversal allows admin access]
```

**VERIFY:**
1. All STRIDE categories considered (even if "no threat identified")
2. Existing mitigations documented
3. Residual threats flagged

**RENDER:**
```yaml
threat_model:
  spoofing: [{threat, likelihood, mitigation}, ...]
  tampering: [...]
  repudiation: [...]
  information_disclosure: [...]
  denial_of_service: [...]
  elevation_of_privilege: [...]
  total_threats: [count]
  unmitigated_threats: [count]
```

---

### 1.4 Dependency Risk Discovery (Method #104)

**EXTRACT:** Map ALL external dependencies and assess risks.

**Method #104 (embedded, 5 steps):**
1. Enumerate dependencies (libraries, APIs, services, vendors)
2. For EACH dependency: Check maintenance status, security history, bus factor
3. Assess criticality: Can system function without it?
4. Assess replaceability: How hard to switch?
5. Identify risks: abandonment, vulnerability, price change, vendor failure

```
DEPENDENCY: [Name/Vendor]
  Type: [Library | API | Service | Vendor]
  Criticality: CRITICAL | HIGH | MEDIUM | LOW
  Replaceability: EASY | MEDIUM | HARD | IMPOSSIBLE

  Maintenance Status:
  • Last update: [date]
  • Active maintainers: [count]
  • Issue response time: [duration]

  Security History:
  • Known vulnerabilities: [count]
  • Severity: CRITICAL | HIGH | MEDIUM | LOW
  • Patched: YES | NO

  Bus Factor: [number of people who understand it]

  Identified Risks:
  • [Risk 1: e.g., abandonment — no updates in 2 years]
  • [Risk 2: e.g., vulnerability — CVE-XXXX unpatched]
  • [Risk 3: e.g., vendor lock-in — proprietary format]
```

**VERIFY:**
1. ALL dependencies enumerated (check package.json, requirements.txt, terraform, etc.)
2. Criticality assessed realistically
3. Mitigation strategies identified for CRITICAL dependencies

**RENDER:**
```yaml
dependency_risks:
  dependencies:
    - name: "[Dependency]"
      type: LIBRARY | API | SERVICE | VENDOR
      criticality: CRITICAL | HIGH | MEDIUM | LOW
      replaceability: EASY | MEDIUM | HARD | IMPOSSIBLE
      maintenance_status: {...}
      security_history: {...}
      bus_factor: [number]
      risks: [...]
  total_dependencies: [count]
  critical_dependencies: [count]
  high_risk_dependencies: [list]
```

---

### 1.5 Additional Methods (Quick execution for standard depth)

**Method #105 — Assumption Torture:** Test each assumption from A1-01..A1-03 at 10%, 50%, 100% wrong. Which errors survivable vs catastrophic?

**Method #106 — Historical Pattern Matching:** Search analogies from past projects, industry incidents, known anti-patterns. Correct for survivorship bias.

**Method #107 — Contraposition Failure Guarantee:** Instead of "what leads to success", ask "what GUARANTEES failure?" Check if current plan does any of those.

*(Execute these if depth=standard or higher. Quick depth: skip 105-107)*

---

## POST_PHASE_CHECKLIST

```yaml
post_phase_checklist:
  - item: "Taxonomy scan complete (10 categories, ≥1 risk each OR justified)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Failure modes enumerated (≥5 total, RPN calculated)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Threat model complete (STRIDE categories checked)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Dependencies mapped (ALL enumerated, criticality assessed)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Genesis sources tagged (each risk linked to step-00 source)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "ASSUMPTIONS_DECLARED (≥3 assumptions)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Counter-checks executed (CC1-01, CC1-02, CC1-03)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Vertical risk inventory consolidated (all risks from 1.1-1.4)"
    status: PASS | FAIL | SCOPE_REDUCED

  - item: "Pattern libraries detected (detection-rules.yaml algorithm executed, domains selected)"
    status: PASS | FAIL | SCOPE_REDUCED
```

---

## COUNTER_CHECKS

### CC1-01: Grounding Check (Method #85)
Sample 3 risks → verify each has concrete source (component, dependency, threat).

### CC1-02: Phantom Hunt (Method #168)
Re-scan taxonomy → verify no hallucinated categories (e.g., "quantum risks" for non-quantum project).

### CC1-03: Coherence Check (Method #84)
Verify failure modes coherent with system characterization from step-00 (High complexity → emergent failures present).

---

## GATE_1 EVALUATION

**File:** `gates.yaml`, **Gate:** `GATE_1`

**Conditions:**
- G1-01: Taxonomy complete (CRITICAL)
- G1-02: Failure modes enumerated (CRITICAL)
- G1-03: Threat modeling complete (ERROR)
- G1-04: Dependencies mapped (CRITICAL)
- G1-05: ASSUMPTIONS_DECLARED (BLOCKER)
- G1-06: POST_PHASE_CHECKLIST complete 9/9 (CRITICAL)
- G1-07: Pattern libraries detected (CRITICAL)

**IF GATE_1 PASS → proceed to step-02-identify-horizontal.**

---

## ARTIFACTS OUTPUT

1. `taxonomy-scan.yaml`
2. `failure-mode-enumeration.yaml`
3. `threat-model.yaml`
4. `dependency-risks.yaml`
5. `vertical-risk-inventory.yaml` (consolidated)
6. `assumptions-identify-vertical.yaml`
7. `counter-checks-identify-vertical.yaml`
8. `post-phase-checklist-identify-vertical.yaml`

---

## DEPTH ADJUSTMENTS

**Quick:**
- Methods 101-104 only (skip 105-107)
- Minimum: 3 categories in taxonomy, 3 failure modes, 3 dependencies

**Standard:**
- All methods 101-107

**Comprehensive/Critical:**
- Add chaos probe design for top failure modes (#110)
- Add external validation (security audit, penetration test)

---

## NEXT STEP

**Read tool:** `steps/step-02-identify-horizontal.md`

**PRECONDITION:** GATE_1 = OPEN
