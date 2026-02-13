---
step: 4
name: "Decide"
time_estimate: "20-45 minutes"
goal: "Synthesize into Go/No-Go/Conditional decision with confidence"
requires_completion: [0, 1, 2]  # 3 optional for quick depth
next_steps:
  DEFAULT: "steps/step-05-output.md"
data_dependencies:
  - "data/method-procedures/401-404*.md"
  - "data/decision-thresholds.yaml"
  - "data/feasibility-scoring.yaml"
outputs:
  - feasibility_profile
  - decision
  - conditions
  - decay_triggers
---

# Phase 4: DECIDE

## PRECONDITION CHECK

1. **PRECONDITION:** GATE_3 = PASS OR depth = quick
2. **Verify:** dimension_scores, binding_constraint, validation_results exist
3. **IF NOT:** HALT, report SEQUENCE VIOLATION
4. **IF PASS:** PROCEED to decision methods

---

## ENFORCED SEQUENCE

**STEP 1:** Read tool: data/decision-thresholds.yaml
**STEP 2:** Read tool: data/method-procedures/401_Multi_Axis_Feasibility_Profile.md
**STEP 3:** Read tool: data/method-procedures/402_Confidence_Weighted_Decision.md → decide
**STEP 4:** IF CONDITIONAL: Read tool: data/method-procedures/403_Conditional_Feasibility_Map.md
**STEP 5:** Read tool: data/method-procedures/404_Feasibility_Decay_Monitoring.md
**STEP 6:** Record: decision (GO/NO-GO/CONDITIONAL/INVESTIGATE), conditions, decay_triggers

---

## 4.1 Multi-Axis Feasibility Profile (#401)

**1. Read tool:** `data/method-procedures/401_Multi_Axis_Feasibility_Profile.md`

**Purpose:** Aggregate all 10 dimensions into a visual profile showing feasibility shape.

### Generate Visual Profile

```
FEASIBILITY PROFILE
═══════════════════════════════════════════════════════════════

Technical     ████████░░  4  H    Proven technology, TRL 8-9
Resource      ██████░░░░  3  M    Gap in headcount, closable
Knowledge     ████████░░  4  M    Strong tech, domain gap
Organization  ██████░░░░  3  L    Cross-team coordination needed
Temporal      ████░░░░░░  2  H    Critical path exceeds deadline ← BINDING
Compositional ██████░░░░  3  M    Integration effort ~35%
Economic      ████████░░  4  M    Positive ROI, 8-month payback
Regulatory    ██████████  5  H    Clear requirements, compliance path
Scale         ██████░░░░  3  L    Not tested at production scale
Cognitive     ████████░░  4  H    Manageable complexity

───────────────────────────────────────────────────────────────
BINDING CONSTRAINT: Temporal (score: 2)
OVERALL FEASIBILITY: 2 (Doubtful)
CONFIDENCE PROFILE: Mixed (4H, 4M, 2L)
═══════════════════════════════════════════════════════════════
```

### Profile Analysis

1. **Identify binding constraint** (lowest score)
2. **Assess constraint addressability:**
   - What would raise it by 1 point?
   - What's the cost?
   - Does improving it worsen another dimension?

3. **Check for low-confidence scores:**
   - Low confidence on binding constraint = investigate before deciding
   - Low confidence on high score = may be overestimated

### Record Profile

```yaml
feasibility_profile:
  dimensions:
    technical: {score: 4, confidence: "H", note: "Proven tech"}
    resource: {score: 3, confidence: "M", note: "Gap closable"}
    knowledge: {score: 4, confidence: "M", note: "Domain gap exists"}
    organizational: {score: 3, confidence: "L", note: "Coordination risk"}
    temporal: {score: 2, confidence: "H", note: "Critical path issue"}
    compositional: {score: 3, confidence: "M", note: "35% integration"}
    economic: {score: 4, confidence: "M", note: "Positive ROI"}
    regulatory: {score: 5, confidence: "H", note: "Clear path"}
    scale: {score: 3, confidence: "L", note: "Untested"}
    cognitive: {score: 4, confidence: "H", note: "Manageable"}

  binding_constraint: "temporal"
  overall_score: 2
  improvement_path: "Extend deadline 3 weeks OR reduce scope by 20%"
```

---

## 4.2 Confidence-Weighted Decision (#402)

**1. Read tool:** `data/method-procedures/402_Confidence_Weighted_Decision.md`

**Purpose:** Combine feasibility score with CONFIDENCE. Score of 4 with high confidence ≠ Score of 4 with low confidence.

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DECISION MATRIX                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         HIGH CONFIDENCE        LOW CONFIDENCE                │
│  ┌───────────────────┬────────────────────┬────────────────────────┐        │
│  │ FEASIBLE (4-5)    │ GO                 │ CONDITIONAL GO         │        │
│  │                   │ Proceed with       │ Proceed but invest     │        │
│  │                   │ standard management│ in validation          │        │
│  ├───────────────────┼────────────────────┼────────────────────────┤        │
│  │ BORDERLINE (3)    │ CONDITIONAL GO     │ INVESTIGATE            │        │
│  │                   │ Proceed with       │ More information       │        │
│  │                   │ explicit conditions│ needed before decision │        │
│  ├───────────────────┼────────────────────┼────────────────────────┤        │
│  │ INFEASIBLE (1-2)  │ NO GO              │ INVESTIGATE or NO GO   │        │
│  │                   │ Stop, redirect,    │ May be infeasible,     │        │
│  │                   │ or redesign        │ may be unknown         │        │
│  └───────────────────┴────────────────────┴────────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Confidence Assessment

| Level | Basis | Reliability |
|-------|-------|-------------|
| **High** | Empirical evidence — probes, spikes, reference class, measurements | Strong |
| **Medium** | Expert judgment (calibrated), analogies with verified transfer | Moderate |
| **Low** | Team gut feeling, planning estimates (uncalibrated), assumptions | Weak |

### Apply Decision Logic

```
1. Take binding constraint score
2. Assess confidence on binding constraint
3. Look up decision in matrix

Example:
  Binding: Temporal = 2 (Doubtful)
  Confidence: High
  Decision: NO GO (infeasible with high confidence)

Alternative:
  Binding: Temporal = 2 (Doubtful)
  Confidence: Low
  Decision: INVESTIGATE (may be infeasible, may be unknown)
```

### Record Decision

```yaml
decision:
  raw_score: 2
  binding_dimension: "temporal"
  binding_confidence: "H"
  matrix_lookup: "Infeasible + High Confidence"
  decision: "NO GO"
  rationale: "Critical path exceeds deadline by 20% with high confidence"
```

---

## 4.3 Conditional Feasibility Map (#403)

**1. Read tool:** `data/method-procedures/403_Conditional_Feasibility_Map.md`

**Purpose:** Most projects are not simply "feasible" or "infeasible" — they are "feasible IF." Map ALL conditions.

### Execution Process

1. **List ALL conditions** identified across phases:
   - From scope (#003): "IF Mars delivers data by March"
   - From constraints (#101-106): "IF we can hire Synapse specialist"
   - From dimensions (#201-210): "IF cluster costs stay under $X"
   - From validation (#301-306): "IF no regulatory changes"

2. **For each condition:**

| Attribute | Question |
|-----------|----------|
| **Probability** | How likely is this condition to hold? (High/Medium/Low/Unknown) |
| **Controller** | Who controls it? (Us/Partner/External/Regulation) |
| **Fallback** | What happens if it fails? Is there a Plan B? |
| **Monitoring** | How will we know if it's failing? |

3. **Calculate compound probability:**
   ```
   If you need 5 independent conditions, each P=0.8:
   Combined P = 0.8^5 = 0.33

   Many "likely" conditions → "unlikely" combined feasibility
   ```

### Record Conditions

```yaml
conditions:
  - condition: "Mars delivers sample data by March 1"
    probability: "Medium"
    controller: "Partner (Mars)"
    fallback: "Design based on spec, risk of rework"
    monitoring: "Weekly check-in with Mars PM"

  - condition: "Synapse specialist hired within 4 weeks"
    probability: "Medium"
    controller: "Us (hiring)"
    fallback: "Train existing team (adds 3 weeks)"
    monitoring: "HR pipeline weekly"

  - condition: "Databricks costs stay under $15K/month"
    probability: "High"
    controller: "Us (architecture)"
    fallback: "Optimize or accept higher cost"
    monitoring: "Cost alerts in Azure"

  - condition: "No EPR regulatory changes before go-live"
    probability: "High"
    controller: "External (EU)"
    fallback: "Re-scope if major changes"
    monitoring: "Regulatory news tracking"

compound_probability:
  independent_conditions: 4
  individual_probabilities: [0.6, 0.6, 0.9, 0.9]
  combined: 0.29  # 60% × 60% × 90% × 90%
  note: "Only 29% chance ALL conditions hold"
```

### Conditional Decision

```
IF all conditions hold → FEASIBLE
IF one condition fails:
  → [Condition 1]: Fallback X, cost Y
  → [Condition 2]: Fallback Z, cost W
  → etc.

Compound probability determines REAL feasibility confidence
```

---

## 4.4 Feasibility Decay Monitoring (#404)

**1. Read tool:** `data/method-procedures/404_Feasibility_Decay_Monitoring.md`

**Purpose:** Feasibility is not static. Design triggers that indicate feasibility is degrading.

### Decay Trigger Types

| Trigger Category | Examples | Dimension Affected |
|-----------------|----------|-------------------|
| **Scope change** | New requirements added | Compositional, Temporal, Cognitive |
| **Team change** | Key person leaves | Knowledge, Resource, Organizational |
| **Dependency change** | API deprecated, vendor acquired | Technical, Dependency |
| **Budget change** | Cut | Resource, Economic |
| **Timeline change** | Accelerated deadline | Temporal |
| **Regulatory change** | New regulation | Regulatory |
| **Technology change** | Major version, deprecation | Technical, Scale |
| **Market change** | Competitor launch | Economic |

### Design Monitoring

For each dimension, identify:
1. **What events would change the score?**
2. **How often to re-check?**
3. **What threshold triggers full reassessment?**

### Reassessment Schedule (Boehm Spiral)

| Milestone | Reassessment Scope |
|-----------|-------------------|
| Sprint boundary | Quick check on binding constraint |
| Phase gate | Standard reassessment of all dimensions |
| Major scope change | Full reassessment |
| External shock | Immediate targeted reassessment |

### Record Decay Monitoring

```yaml
decay_monitoring:
  triggers:
    - event: "Scope change >10%"
      dimensions_affected: ["temporal", "compositional", "cognitive"]
      action: "Reassess affected dimensions"

    - event: "Key team member leaves"
      dimensions_affected: ["knowledge", "resource"]
      action: "Immediate knowledge gap assessment"

    - event: "Budget cut >15%"
      dimensions_affected: ["resource", "economic"]
      action: "Full reassessment"

    - event: "Deadline moved up"
      dimensions_affected: ["temporal"]
      action: "Critical path reanalysis"

  scheduled_reviews:
    - milestone: "End of Sprint 1"
      type: "Quick check"
      focus: ["temporal", "resource"]

    - milestone: "Phase 1 complete"
      type: "Standard reassessment"
      focus: "All dimensions"

    - milestone: "Go-live -4 weeks"
      type: "Final feasibility gate"
      focus: "All dimensions + conditions"
```

---

## 4.5 Depth Adjustments

### Quick Depth
- **Execute:** #401, #402 only
- **Skip:** #403 (basic conditions only), #404

### Standard+ Depth
- **Execute:** All decision methods

---

## 4.6 Final Decision Statement

Synthesize all inputs into a clear decision:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DECISION STATEMENT                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DECISION: [GO / NO GO / CONDITIONAL GO / INVESTIGATE]                      │
│                                                                              │
│  OVERALL FEASIBILITY: [X]/5 ([Label])                                       │
│  BINDING CONSTRAINT: [Dimension] (score: [Y], confidence: [H/M/L])          │
│  COMPOUND CONDITION PROBABILITY: [Z%]                                       │
│                                                                              │
│  RATIONALE:                                                                 │
│  [2-3 sentences explaining the decision]                                    │
│                                                                              │
│  CONDITIONS (if CONDITIONAL GO):                                            │
│  1. [Condition 1]                                                           │
│  2. [Condition 2]                                                           │
│  ...                                                                        │
│                                                                              │
│  NEXT STEPS:                                                                │
│  • [Immediate action 1]                                                     │
│  • [Immediate action 2]                                                     │
│                                                                              │
│  REASSESSMENT TRIGGER:                                                      │
│  [When to revisit this decision]                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.7 Update Frontmatter

After completing DECIDE:

```yaml
decision:
  verdict: "CONDITIONAL GO"
  overall_score: 3
  binding_constraint: "temporal"
  binding_score: 2
  binding_confidence: "M"
  compound_probability: 0.45

conditions:
  - "Deadline extended by 2 weeks"
  - "Synapse specialist hired by Week 3"
  - "Mars data sample received by March 1"

next_steps:
  - "Request deadline extension"
  - "Escalate hiring priority"
  - "Follow up with Mars on data sample"

decay_triggers:
  - event: "Deadline extension denied"
    action: "Reassess with NO GO likely"
  - event: "No Synapse hire by Week 4"
    action: "Activate training fallback"

steps_completed: [0, 1, 2, 3, 4]  # or [0, 1, 2, 4] for quick
current_step: 5
```

---

## GATE_4 EVALUATION

AFTER decision methods:

1. **Read tool:** data/gates.yaml
2. **Load GATE_4 conditions** (5 conditions)
3. **FOR EACH condition:**
   - G4-01: decision IN [GO/NO-GO/CONDITIONAL/INVESTIGATE] (BLOCKER)
   - G4-02: IF CONDITIONAL → conditions listed (CRITICAL)
   - G4-03: IF ≥2 conditions → compound probability calculated (ERROR)
   - G4-04: #402 Confidence-Weighted Decision executed (CRITICAL)
   - G4-05: Decay triggers defined (WARNING)

4. **Evaluation:**
   - IF G4-01 (decision exists) fails → GATE_4 = FAIL
   - IF G4-04 (confidence weighting) fails → GATE_4 = FAIL
   - ELSE → GATE_4 = PASS

5. **IF GATE_4 = FAIL:**
   - HALT (binding constraint not identified = incomplete assessment)
   - Cannot proceed without decision

6. **IF GATE_4 = PASS:**
   - Proceed to Step 5 (OUTPUT)

## VIOLATION CHECKS

**R2 COMPLETENESS:**
- Decision based on ALL 10 dimensions (via binding constraint)
- Conditions enumerated if CONDITIONAL

**R12 JUST-IN-TIME:**
- Agent MUST NOT read step-05-output.md until GATE_4 = PASS

---

## 4.8 Proceed to OUTPUT

**Before loading Step 5, verify:**

- [ ] Feasibility profile generated
- [ ] Decision made using matrix
- [ ] Conditions mapped (for CONDITIONAL GO)
- [ ] Decay monitoring designed
- [ ] Decision statement complete

**Next step:** Load `steps/step-05-output.md`

---

## Output Checklist

Before proceeding, confirm:

- [ ] `decision.verdict` set
- [ ] `decision.overall_score` calculated
- [ ] `decision.binding_constraint` identified
- [ ] `conditions` list complete (if applicable)
- [ ] `decay_triggers` defined
- [ ] Ready to generate report
