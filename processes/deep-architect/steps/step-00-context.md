---
step: 0
name: "Context Assessment"
time_estimate: "15-30 minutes"
goal: "Classify domain, team, constraints, stability → select execution mode"
requires_completion: true
next_steps: ["step-01-canonical.md"]
data_dependencies: ["data/schemas/context-assessment.schema.yaml", "data/config.yaml"]
outputs: ["context-assessment.yaml"]
gate: "GATE_0"
gate_conditions: 5
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

## 0.1 EXTRACT: Domain Classification

1. Analyze user brief for domain indicators
2. Classify domain: `web | embedded | data | cloud | hybrid`
3. Document evidence (what indicates this domain)
4. Assess confidence (0.0-1.0)

**Domain impacts (from MA-007):**
- web → REST patterns, frontend/backend split, session management
- embedded → real-time constraints, hardware interfaces, safety
- data → ETL pipelines, storage layers, query optimization
- cloud → infrastructure-as-code, auto-scaling, multi-region
- hybrid → combination, document which aspects

---

## 0.2 EXTRACT: Team Assessment

1. Determine team size (number of people)
2. Assess expertise level: `junior | mid | senior | mixed`
3. Assess maturity: `low | medium | high`
4. Note architecture experience (boolean)
5. Document evidence basis

**Team impacts (from MA-002):**
- junior/low maturity → more guidance, waterfall may be safer
- senior/high maturity → can handle iterative, less prescriptive
- mixed → hybrid approach, pair experienced with junior

---

## 0.3 EXTRACT: Organizational Constraints

1. Budget level: `limited | moderate | generous | unknown`
2. Timeline level: `urgent | normal | flexible | unknown`
3. Culture type: `startup | corporate | regulated | academic | unknown`
4. List technical constraints (existing tech, infrastructure limits)
5. List regulatory constraints (GDPR, HIPAA, PCI-DSS, SOC2, etc.)

---

## 0.4 EXTRACT: Requirements Stability

1. Assess how stable/volatile requirements are
2. Calculate stability score (0.0-1.0):
   - 0.0-0.4 = low stability (requirements changing frequently)
   - 0.4-0.7 = medium stability (some areas uncertain)
   - 0.7-1.0 = high stability (well-defined, unlikely to change)
3. Document evidence factors (each with stable/unstable direction, weight)
4. Calculate weighted score

---

## 0.5 EXTRACT: Execution Mode Selection

Based on collected context, select execution mode:

1. IF stability_score < 0.4 AND team_maturity == high → `iterative`
2. IF stability_score > 0.7 → `waterfall`
3. ELSE → `hybrid`
4. Document rationale linking stability, team, domain to choice
5. Override allowed with user approval + documented reason

---

## 0.6 VERIFY: Context Validation

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 claims from domain/team/constraints
   2. For each: verify against user brief or observable facts
   3. Calculate verification_rate = verified / sampled
   4. IF rate < 0.70 → re-extract with more evidence

2. **Method #84 Coherence Check:**
   1. Verify domain→execution_mode mapping is consistent
   2. Verify stability_score→mode selection follows rules in 0.5
   3. Check constraints don't contradict mode (e.g., regulated + iterative needs care)
   4. Flag inconsistencies

3. **Method #61 Pre-mortem (for deep depth):**
   1. Assume context assessment was WRONG
   2. What would the consequences be for Phase 1-6?
   3. Identify 3+ failure scenarios
   4. Document preventive measures

---

## 0.7 RENDER: Context Assessment Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `context-assessment.yaml` following schema (`data/schemas/context-assessment.schema.yaml`)
2. Include ALL sections: metadata, project, domain, team, constraints, stability, execution_mode, assumptions, checklist, counter_checks
3. Write to `{output_directory}/architecture-artifacts/context-assessment.yaml`

---

## 0.8 CHECKLIST (Post-Phase)

| # | Item | Status |
|---|------|--------|
| 1 | Domain classified with evidence | PASS/FAIL |
| 2 | Team assessed (size/expertise/maturity) | PASS/FAIL |
| 3 | Constraints documented (budget/timeline/culture) | PASS/FAIL |
| 4 | Stability score calculated (0.0-1.0) | PASS/FAIL |
| 5 | Execution mode selected with rationale | PASS/FAIL |
| 6 | ASSUMPTIONS_DECLARED (≥1 assumption logged) | PASS/FAIL |
| 7 | Counter-checks executed (≥ depth minimum) | PASS/FAIL |
| 8 | context-assessment.yaml written | PASS/FAIL |

**IF any PASS/FAIL item = FAIL → GATE_0 evaluation may LOCK**

---

## 0.9 GATE_0 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G0-01 | Domain classification completed | CRITICAL | |
| G0-02 | Team assessment documented | CRITICAL | |
| G0-03 | Organizational constraints captured | ERROR | |
| G0-04 | Requirements stability measured (0.0-1.0) | CRITICAL | |
| G0-05 | Execution mode selected | BLOCKER | |

**Pass criteria:** ALL CRITICAL + BLOCKER conditions met

- IF ALL pass → GATE_0 = **OPEN** → proceed to Phase 1
- IF G0-05 fails → GATE_0 = **LOCKED** → ABORT (BLOCKER)
- IF G0-01/02/04 fails → GATE_0 = **LOCKED** → HALT, fix, re-evaluate
- IF G0-03 fails → LOG warning, proceed (ERROR severity)
