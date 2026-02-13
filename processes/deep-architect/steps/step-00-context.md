---
step: 0
name: "Context Assessment"
time_estimate: "15-30 minutes"
goal: "Classify domain, team, constraints, stability → select execution mode"
requires_completion: true
next_steps: ["step-01-canonical.md"]
data_dependencies: ["data/schemas/context-assessment.schema.yaml", "data/config.yaml", "data/patterns/architecture-domains.yaml", "data/patterns/domain-detection-rules.yaml"]
outputs: ["context-assessment.yaml"]
gate: "GATE_0"
gate_conditions: 8
---

# PHASE 0: CONTEXT ASSESSMENT — ENFORCED SEQUENCE

## 0.0 ASSUMPTIONS_DECLARED (BEFORE ANY EXTRACTION)

Declare ALL interpretive assumptions as falsifiable hypotheses.

1. Read user brief / project description
2. For each interpretive decision, create assumption entry:
   ```yaml
   - id: "A-001"
     assumption: "[what you assume]"
     confidence: 0.X
     falsification: "[how to disprove]"
     impact_if_wrong: "[consequence]"
   ```
3. Minimum 1 assumption required (3+ for standard/deep depth)
4. Log in context-assessment.yaml `assumptions[]`

**IF zero assumptions declared → HALT (INV-03 violation)**

---

## 0.1 EXTRACT: Project Metadata

1. Extract project name from user brief
2. Write 1-3 sentence project description (scope and purpose)
3. Define scope boundary — what is IN vs OUT of scope for architecture

---

## 0.2 EXTRACT: System Maturity Classification

1. Classify system maturity:
   - `greenfield` → new system, no existing code
   - `brownfield` → existing system to redesign/extend
   - `migration` → moving from one platform/architecture to another
2. IF brownfield or migration:
   1. Document existing system inventory:
      ```yaml
      existing_system:
        name: "[Current system name]"
        age_years: X
        codebase_size: "[small <10K LOC | medium 10-100K | large >100K]"
        known_problems: ["[Problem 1]", "[Problem 2]"]
        constraints_from_existing:
          - "[Must maintain backwards compatibility with X]"
          - "[Cannot change database schema for Y]"
          - "[Legacy API consumers depend on Z]"
        migration_scope: "full | partial | incremental"
      ```
   2. Document what MUST be preserved vs what CAN change
   3. Identify migration risks (data loss, downtime, compatibility breaks)
3. IF greenfield: set `existing_system: null`, note freedom from legacy constraints
4. Document evidence for classification

---

## 0.2b EXTRACT: Project Scale Classification

Classify project scale to calibrate proportional depth expectations.

1. Assess project scale based on indicators:
   ```yaml
   project_scale:
     classification: "small | medium | large | enterprise"
     indicators:
       expected_components: "[count or range]"
       team_size: "[count]"
       expected_integrations: "[count]"
       regulatory_requirements: "[none | basic | extensive]"
     depth_calibration:
       # small: Quick depth often sufficient, 16 ops still required but analysis proportional
       # medium: Standard depth, full analysis
       # large: Deep depth recommended, thorough analysis
       # enterprise: Deep depth mandatory, maximum rigor
   ```

2. Scale classification criteria:
   - `small`: ≤5 components, ≤3 integrations, no regulatory, ≤3 people
   - `medium`: 5-15 components, 3-10 integrations, basic regulatory, 3-10 people
   - `large`: 15-50 components, 10+ integrations, compliance required, 10-30 people
   - `enterprise`: 50+ components, many integrations, heavy compliance, 30+ people

3. **Proportionality rule:** Agent MUST match analysis depth to project scale.
   - Small project with enterprise-grade complexity analysis = OVER-ENGINEERING (wasteful)
   - Enterprise project with superficial analysis = UNDER-ENGINEERING (dangerous)
   - Document scale-to-depth mapping in context-assessment.yaml

4. IF project_scale = small AND depth = deep → LOG warning "Deep depth may be disproportionate for small project"
5. IF project_scale = enterprise AND depth = quick → LOG warning "Quick depth may be insufficient for enterprise project"

---

## 0.3 EXTRACT: Domain Classification

1. Analyze user brief for domain indicators
2. Classify domain: `web | embedded | data | cloud | hybrid`
3. Document evidence (what indicates this domain)
4. Assess confidence (0.0-1.0)

---

## 0.4 EXTRACT: Architecture Domain Detection

1. Read `data/patterns/architecture-domains.yaml` (domain hierarchy)
2. Read `data/patterns/domain-detection-rules.yaml` (detection rules)
3. Collect BASE domains (auto_apply: true):
   - DOM-BASE-SOLID (SOLID Principles)
   - DOM-BASE-SEC (Security Baseline)
   - DOM-BASE-OBS (Observability Baseline)
4. Normalize user brief text (lowercase, strip punctuation)
5. For EACH detection rule in domain-detection-rules.yaml:
   1. Evaluate ALL conditions against normalized brief
   2. For each condition: calculate match_score (binary: 1.0/0.0, threshold_linear: min(1.0, matches/threshold))
   3. If condition has `invert: true`: score = 1.0 if NO keywords found, 0.0 otherwise
   4. Compute confidence = sum(weight × match_score) / sum(weight)
   5. IF confidence ≥ detection_threshold → add to detected_domains with confidence + matched keywords
6. Resolve transitive dependencies:
   1. For each detected domain: collect `requires[]` from architecture-domains.yaml
   2. For each required domain: IF not already in detected_domains → add to auto_included
   3. Repeat until no new domains added (transitive closure)
   4. IF circular dependency detected → ERROR, log and halt
7. Compute final_domains = base_domains ∪ detected_domains ∪ auto_included
8. Run counter-checks:
   - CC-DOM-01 (Method #85 Grounding): Sample 3 detected domains, verify keywords exist in brief. IF >1 ungrounded → remove and re-resolve.
   - CC-DOM-02 (Method #168 Phantom Hunt): Re-scan brief for borderline domains (confidence 0.50 - threshold). IF strong secondary evidence → add to detected.
   - CC-DOM-03 (Method #84 Coherence): Verify no conflicting paradigms (e.g., monolithic + microservices) without explicit rationale. IF conflict → log as ASSUMPTION.
9. Write `architecture_domains{}` section to context-assessment.yaml

**IF final_domains contains <3 domains → check: at minimum 3 BASE domains must be present**

---

## 0.5 EXTRACT: Team Assessment

1. Determine team size (number of people)
2. Assess expertise level: `junior | mid | senior | mixed`
3. Assess maturity: `low | medium | high`
4. Note architecture experience (boolean)
5. Document evidence basis

---

## 0.6 EXTRACT: Conway's Law Mapping

1. Map team structure to planned system structure:
   ```yaml
   conways_law:
     team_units:
       - name: "[Team/Squad Name]"
         size: N
         ownership: ["C-XXX", "C-YYY"]  # components they'll own
         communication_channels: ["[other teams they talk to]"]
     alignment_assessment:
       team_to_system_match: "aligned | misaligned | unknown"
       misalignment_risks: ["[Risk if team structure doesn't match architecture]"]
       recommendations: ["[Restructure team X]", "[Merge components Y and Z]"]
   ```
2. IF team structure unknown → document as assumption, flag for Phase 1
3. Misalignment between team boundaries and component boundaries = high risk

---

## 0.7 EXTRACT: Organizational Constraints

1. Budget level: `limited | moderate | generous | unknown`
2. Timeline level: `urgent | normal | flexible | unknown`
3. Culture type: `startup | corporate | regulated | academic | unknown`
4. List technical constraints (existing tech, infrastructure limits)
5. List regulatory constraints (GDPR, HIPAA, PCI-DSS, SOC2, etc.)

---

## 0.8 EXTRACT: Requirements Stability

1. Assess how stable/volatile requirements are
2. Calculate stability score (0.0-1.0):
   - 0.0-0.4 = low stability (requirements changing frequently)
   - 0.4-0.7 = medium stability (some areas uncertain)
   - 0.7-1.0 = high stability (well-defined, unlikely to change)
3. Document evidence factors (each with stable/unstable direction, weight)
4. Calculate weighted score

---

## 0.9 EXTRACT: Execution Mode Selection

Based on collected context, select execution mode:

1. IF stability_score < 0.4 AND team_maturity == high → `iterative`
2. IF stability_score > 0.7 → `waterfall`
3. ELSE → `hybrid`
4. Document rationale linking stability, team, domain to choice
5. Override allowed with user approval + documented reason

---

## 0.10 VERIFY: Context Validation

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 claims from domain/team/constraints
   2. For each: verify against user brief or observable facts
   3. Calculate verification_rate = verified / sampled
   4. IF rate < 0.70 → re-extract with more evidence

2. **Method #84 Coherence Check:**
   1. Verify domain→execution_mode mapping is consistent
   2. Verify stability_score→mode selection follows rules in 0.9
   3. Check constraints don't contradict mode (e.g., regulated + iterative needs care)
   4. Flag inconsistencies

3. **Method #61 Pre-mortem (for deep depth):**
   1. Assume context assessment was WRONG
   2. What would the consequences be for Phase 1-6?
   3. Identify 3+ failure scenarios
   4. Document preventive measures

---

## 0.11 RENDER: Context Assessment Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `context-assessment.yaml` following schema (`data/schemas/context-assessment.schema.yaml`)
2. Include ALL sections: metadata, project, system_maturity, existing_system, domain, architecture_domains, team, conways_law, constraints, stability, execution_mode, assumptions, checklist, counter_checks
3. Write to `{output_directory}/architecture-artifacts/context-assessment.yaml`

---

## 0.12 CHECKLIST (Post-Phase)

| # | Item | Status |
|---|------|--------|
| 1 | System maturity classified (greenfield/brownfield/migration) | PASS/FAIL |
| 2 | Existing system inventory (if brownfield/migration) | PASS/FAIL |
| 2b | Project scale classified (small/medium/large/enterprise) | PASS/FAIL |
| 3 | Domain classified with evidence | PASS/FAIL |
| 4 | Architecture domains detected and resolved | PASS/FAIL |
| 5 | Team assessed (size/expertise/maturity) | PASS/FAIL |
| 6 | Conway's Law mapping documented | PASS/FAIL |
| 7 | Constraints documented (budget/timeline/culture) | PASS/FAIL |
| 8 | Stability score calculated (0.0-1.0) | PASS/FAIL |
| 9 | Execution mode selected with rationale | PASS/FAIL |
| 10 | ASSUMPTIONS_DECLARED (≥1 assumption logged) | PASS/FAIL |
| 11 | Counter-checks executed (≥ depth minimum) | PASS/FAIL |
| 12 | context-assessment.yaml written | PASS/FAIL |

**IF any PASS/FAIL item = FAIL → GATE_0 evaluation may LOCK**

---

## 0.13 GATE_0 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G0-01 | Domain classification completed | CRITICAL | |
| G0-02 | Team assessment documented | CRITICAL | |
| G0-03 | Organizational constraints captured | ERROR | |
| G0-04 | Requirements stability measured (0.0-1.0) | CRITICAL | |
| G0-05 | Execution mode selected | BLOCKER | |
| G0-06 | System maturity classified (greenfield/brownfield/migration) | CRITICAL | |
| G0-07 | Architecture domains detected and resolved (≥3 base + ≥1 detected unless exploratory) | CRITICAL | |
| G0-08 | Project scale classified (small/medium/large/enterprise) with proportionality check | ERROR | |

**Pass criteria:** ALL CRITICAL + BLOCKER conditions met

- IF ALL pass → GATE_0 = **OPEN** → proceed to Phase 1
- IF G0-05 fails → GATE_0 = **LOCKED** → ABORT (BLOCKER)
- IF G0-01/02/04/06/07 fails → GATE_0 = **LOCKED** → HALT, fix, re-evaluate
- IF G0-03/08 fails → LOG warning, proceed (ERROR severity)
