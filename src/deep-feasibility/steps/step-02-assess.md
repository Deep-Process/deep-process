---
step: 2
name: "Assess"
time_estimate: "45-90 minutes"
goal: "Evaluate feasibility across 10 independent dimensions"
requires_completion: [0, 1]
next_steps:
  DEFAULT: "steps/step-03-validate.md"
  QUICK_DEPTH: "steps/step-04-decide.md"
  NEW_CONSTRAINTS: "steps/step-01-constrain.md"
data_dependencies:
  - "data/method-procedures/201-210*.md"
  - "data/feasibility-scoring.yaml"
  - "data/theoretical-foundations.yaml"
outputs:
  - dimension_scores
  - binding_constraint
  - feasibility_profile
---

# Phase 2: ASSESS

## PRECONDITION CHECK

BEFORE executing this step:

1. **PRECONDITION:** GATE_1 = PASS
2. **Verify:** constraint_map from Step 1 exists
3. **IF NOT:** HALT, report SEQUENCE VIOLATION
4. **IF PASS:** PROCEED to dimension scoring

---

## ENFORCED SEQUENCE

**CRITICAL: ALL 10 dimensions MUST be scored (R2 COMPLETENESS)**

**STEP 0:** Read tool: data/feasibility-scoring.yaml

**STEP 1-10:** For EACH dimension (#201-210):
1. Read tool: data/method-procedures/{NNN}_*.md
2. Execute method
3. Score: 1-5 (5=Proven, 4=Likely, 3=Possible, 2=Doubtful, 1=Infeasible)
4. Confidence: High/Medium/Low
5. Record: dimension_scores.{name} = {score, confidence, evidence}

**ALL 10 required:**
- Technical, Resource, Knowledge, Organizational, Temporal, Compositional, Economic, Scale, Cognitive, Dependency

**STEP 11:** binding_constraint = min(all 10 scores)

**STEP 12:** Verify ALL 10 scored (NO zeros/nulls) OR HALT (R2 VIOLATION)

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BINDING CONSTRAINT PRINCIPLE (Goldratt)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  A project feasible on 9 of 10 axes but infeasible on 1 is INFEASIBLE.     │
│                                                                              │
│  DO NOT:                                                                    │
│  • Average the scores                                                       │
│  • Weight by "importance"                                                   │
│  • Ignore low-scoring dimensions                                            │
│                                                                              │
│  DO:                                                                        │
│  • Identify the BINDING CONSTRAINT (lowest score)                           │
│  • Focus improvement efforts there                                          │
│  • Overall feasibility = min(all dimensions)                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scoring Scale (1-5)

**1. Read tool:** `data/feasibility-scoring.yaml`

| Score | Label | Meaning |
|-------|-------|---------|
| 5 | **Proven** | Demonstrated, precedented, no significant challenges |
| 4 | **Likely** | Strong evidence of feasibility, minor concerns |
| 3 | **Possible** | Feasible but significant challenges / uncertainties |
| 2 | **Doubtful** | Major challenges, may require fundamental changes |
| 1 | **Infeasible** | Cannot be done under current constraints |

**Confidence Levels:**
- **High:** Based on empirical evidence, direct experience, measurements
- **Medium:** Based on expert judgment, analogies, documented patterns
- **Low:** Based on gut feeling, assumptions, limited information

---

## 2.1 Technical Feasibility — TRL Analysis (#201)

**1. Read tool:** `data/method-procedures/201_Technical_Feasibility_TRL.md`

**Question:** Does the required technology exist, work, and work at the needed scale?

### NASA Technology Readiness Levels

| TRL | Description | Feasibility Status |
|-----|-------------|-------------------|
| 1-3 | Research phase | Theoretical only |
| 4-6 | Development phase | Works in lab/prototype |
| 7-9 | Operations phase | Production-ready |

### Sub-Factors to Assess

```
□ Does the core technology exist?
□ Has it been proven at similar scale?
□ Are there known limitations that affect us?
□ What's the maturity of each component?
□ System TRL = min(component TRLs)
```

### Score

```yaml
dimension: technical
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Core platform (Databricks)"
    trl: 9
    note: "Proven at scale"
  - factor: "Custom ML pipeline"
    trl: 4
    note: "Works in POC, not production-tested"
binding_sub_factor: "Custom ML pipeline"
evidence: "[What supports this score]"
```

---

## 2.2 Resource Feasibility (#202)

**1. Read tool:** `data/method-procedures/202_Resource_Feasibility.md`

**Question:** Do we have the people, money, infrastructure, and tools?

### Sub-Factors to Assess

```
□ PEOPLE: Headcount, skills, availability, continuity
□ BUDGET: Allocated vs needed, contingency, approval status
□ INFRASTRUCTURE: Compute, storage, network, environments
□ TOOLS/LICENSES: Software, services, access, procurement
□ TIME: Calendar time vs work time vs elapsed time
```

### Brooks's Law Check

```
IF gap is people:
  □ Can we actually add people productively?
  □ Communication overhead: n(n-1)/2 channels for n people
  □ Ramp-up time: How long until new people are productive?
```

### Score

```yaml
dimension: resource
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Headcount"
    status: "3 available, 4 needed"
    gap_closable: true
  - factor: "Budget"
    status: "Approved with 20% contingency"
  - factor: "Infrastructure"
    status: "Azure subscription ready"
brooks_law_flag: [true/false]
evidence: "[What supports this score]"
```

---

## 2.3 Knowledge Feasibility (#203)

**1. Read tool:** `data/method-procedures/203_Knowledge_Feasibility.md`

**Question:** Does the team know HOW to do this? (Distinct from having resources)

### Knowledge Types

| Type | Question | If Missing |
|------|----------|------------|
| **Domain** | Do we understand the business? | Hire expert, consult client |
| **Technical** | Do we know the technologies? | Train, hire, consultant |
| **Architectural** | Do we know how to design at scale? | Senior architect needed |
| **Procedural** | Do we know the processes? | Document, train, automate |
| **Tacit** | Is there undocumented knowledge needed? | Pairing, mentoring, risk |

### Dunning-Kruger Check

```
For each knowledge area:
  □ What is our actual expertise level?
  □ What is our confidence level?

DANGER ZONE: Low expertise + High confidence
  → Scores are unreliable
  → Seek external validation
```

### Score

```yaml
dimension: knowledge
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Domain (EPR regulations)"
    present: false
    acquirable: true
    method: "Hire consultant"
  - factor: "Technical (Databricks)"
    present: true
    level: "strong"
dunning_kruger_risk: ["EPR regulations — low expertise, medium confidence"]
evidence: "[What supports this score]"
```

---

## 2.4 Organizational Feasibility (#204)

**1. Read tool:** `data/method-procedures/204_Organizational_Feasibility.md`

**Question:** Can the organization execute this? (Structure, processes, culture)

### Sub-Factors to Assess

```
□ Decision authority: Can necessary decisions be made locally?
□ Cross-team coordination: How well do required teams work together?
□ Conway alignment: Does org match architecture? (from #104)
□ Culture fit: Does approach match org culture?
□ Change capacity: How much change is org already absorbing?
□ Stakeholder alignment: Are key stakeholders aligned?
□ Political feasibility: Are there blockers or champions?
```

### Score

```yaml
dimension: organizational
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Decision authority"
    status: "Have authority for tech decisions, not budget"
  - factor: "Cross-team coordination"
    status: "Works with Data team, not with Finance"
  - factor: "Stakeholder alignment"
    status: "Sponsor supportive, compliance unclear"
evidence: "[What supports this score]"
```

---

## 2.5 Temporal Feasibility — Critical Path (#205)

**1. Read tool:** `data/method-procedures/205_Temporal_Feasibility.md`

**Question:** Can we do this in the time available?

### Sub-Factors to Assess

```
□ Critical path: What's the longest dependency chain?
□ Parallelism limits: How much can happen simultaneously?
□ Non-work time: Holidays, meetings, context switching
□ Waiting time: Approvals, provisioning, third parties
□ Integration time: Usually 30-50% of total
```

### Calendar Time Traps

| Trap | Reality |
|------|---------|
| Effort = Duration | 40 hours ≠ 1 week (meetings, interruptions) |
| Linear parallelism | Two people ≠ half the time (Brooks) |
| Invisible waiting | Provisioning delays not in estimates |
| Integration ignored | "Components done" ≠ "System done" |

### Apply Corrections

```
1. Sum raw estimates
2. Add waiting time (often invisible)
3. Add integration time (30-50%)
4. Apply Hofstadter correction (×1.5 minimum)
5. Compare to deadline
```

### Score

```yaml
dimension: temporal
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Critical path"
    estimate: "12 weeks"
  - factor: "Deadline"
    date: "10 weeks"
  - factor: "Buffer"
    amount: "-2 weeks (NEGATIVE)"
hofstadter_applied: true
evidence: "[What supports this score]"
```

---

## 2.6 Compositional Feasibility (#206)

**1. Read tool:** `data/method-procedures/206_Compositional_Feasibility.md`

**Question:** Every component is individually feasible — but does the WHOLE work?

### Integration Complexity Drivers

```
□ Data format mismatches (timestamps, encodings, schemas)
□ Timing assumptions (sync vs async, timeouts)
□ Error handling gaps (what does A do when B fails?)
□ State management (who owns state? synchronization?)
□ Version coupling (must components deploy together?)
```

### Integration Effort Estimates

| Situation | Integration as % of Total |
|-----------|--------------------------|
| Well-defined interfaces, precedent | 15-20% |
| Partially defined, partial precedent | 30-40% |
| Undefined interfaces, no precedent | 50-70% |

### Ship of Theseus Test

If incremental migration:
- Is each step feasible?
- Does accumulated change remain coherent?
- At what point is it a "different system"?

### Score

```yaml
dimension: compositional
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Interface definitions"
    status: "70% defined"
  - factor: "Integration precedent"
    status: "Similar done elsewhere"
  - factor: "Error handling"
    status: "Not fully specified"
integration_effort_pct: 35
evidence: "[What supports this score]"
```

---

## 2.7 Economic Feasibility (#207)

**1. Read tool:** `data/method-procedures/207_Economic_Feasibility.md`

**Question:** Is it WORTH doing? Even if achievable, if costs exceed benefits, it's infeasible.

### Sub-Factors to Assess

```
□ Total cost: Development + infrastructure + operations + maintenance
□ Total benefit: Revenue, savings, risk reduction, strategic value
□ ROI: (Benefit - Cost) / Cost
□ Payback period: When does benefit exceed cost?
□ Sensitivity: How much can costs increase before negative?
□ Strategic value: Value beyond direct ROI
```

### Score

```yaml
dimension: economic
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Total cost"
    estimate: "$500K"
  - factor: "Total benefit"
    estimate: "$2M over 3 years"
  - factor: "ROI"
    value: "300%"
  - factor: "Payback"
    period: "8 months"
sensitivity: "Costs can increase 100% and still positive"
evidence: "[What supports this score]"
```

---

## 2.8 Scale Feasibility (#208)

**1. Read tool:** `data/method-procedures/208_Scale_Feasibility.md`

**Question:** Does it work at PRODUCTION scale? Demo ≠ production.

### Scale Dimensions

| Dimension | Demo | Production | Gap |
|-----------|------|------------|-----|
| Data volume | 1K records | 1B records | 1,000,000× |
| Concurrent users | 1-5 | 100-10,000 | 1,000× |
| Uptime | Best effort | 99.9%+ | Qualitative shift |
| Error handling | Happy path | All paths | 10× complexity |
| Security | None/basic | Production-grade | 5-10× effort |

### PoC-to-Production Multiplier

| Situation | Multiplier |
|-----------|------------|
| Similar scale done before | 3× |
| New scale, known patterns | 5× |
| New scale, new patterns | 10× |

### Score

```yaml
dimension: scale
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Data volume"
    demo: "1M records"
    production: "100M records"
    tested_at_scale: false
  - factor: "Uptime"
    demo: "Best effort"
    production: "99.9%"
    qualitative_shift: true
poc_to_prod_multiplier: 5
evidence: "[What supports this score]"
```

---

## 2.9 Cognitive Feasibility (#209)

**1. Read tool:** `data/method-procedures/209_Cognitive_Feasibility.md`

**Question:** Can the team UNDERSTAND what they're building? System exceeding cognitive capacity = infeasible to maintain.

### Sub-Factors to Assess

```
□ Concept count: Independent concepts to hold in mind simultaneously
   (If >7-9, exceeds working memory)
□ Concept coupling: How many concepts interact?
□ Abstraction quality: Do abstractions reduce or leak complexity?
□ Onboarding time: How long for competent engineer to be productive?
   (>3 months = cognitive risk)
```

### Score

```yaml
dimension: cognitive
score: [1-5]
confidence: [H/M/L]
sub_factors:
  - factor: "Concept count"
    count: 6
    acceptable: true
  - factor: "Coupling"
    degree: "moderate"
  - factor: "Onboarding estimate"
    time: "4-6 weeks"
evidence: "[What supports this score]"
```

---

## 2.10 Dependency Feasibility (#210)

**1. Read tool:** `data/method-procedures/210_Dependency_Feasibility.md`

**Question:** Are all external dependencies available, reliable, and affordable?

### For Each Dependency

```
□ Available? Does it exist? Can we access it?
□ Reliable? Does it meet our uptime/quality requirements?
□ Affordable? Can we pay at production scale?
□ Stable? Will it exist in 12 months?
□ Timely? Available WHEN we need it?
```

### Dependency Chain Check

If A → B → C, is the CHAIN feasible?
(Transitivity: A's feasibility depends on B's, which depends on C's)

### Score

```yaml
dimension: dependency
score: [1-5]
confidence: [H/M/L]
dependencies:
  - name: "Mars data feed"
    available: true
    reliable: "Unknown — SLA not defined"
    affordable: true
    stable: true
    timely: "Uncertain"
  - name: "Azure Synapse"
    available: true
    reliable: true
    affordable: "Needs pricing review at scale"
evidence: "[What supports this score]"
```

---

## 2.11 Calculate Binding Constraint

After scoring all 10 dimensions:

```
BINDING CONSTRAINT = min(all dimension scores)

Example:
  Technical:      4
  Resource:       3
  Knowledge:      4
  Organizational: 3
  Temporal:       2  ← BINDING CONSTRAINT
  Compositional:  3
  Economic:       4
  Scale:          3
  Cognitive:      4
  Dependency:     3

Overall Feasibility: 2 (Doubtful)
Binding Constraint: Temporal
```

### What to do with Binding Constraint

1. **Identify:** What exactly is causing this score?
2. **Can it be raised?** What would change the score by 1 point?
3. **At what cost?** What's required to improve it?
4. **Trade-offs:** Does improving this worsen another dimension?

---

## 2.12 Update Frontmatter

After completing ASSESS:

```yaml
dimension_scores:
  technical: {score: 4, confidence: "H"}
  resource: {score: 3, confidence: "M"}
  knowledge: {score: 4, confidence: "M"}
  organizational: {score: 3, confidence: "L"}
  temporal: {score: 2, confidence: "H"}
  compositional: {score: 3, confidence: "M"}
  economic: {score: 4, confidence: "M"}
  scale: {score: 3, confidence: "L"}
  cognitive: {score: 4, confidence: "H"}
  dependency: {score: 3, confidence: "M"}

binding_constraint:
  dimension: "temporal"
  score: 2
  reason: "Critical path exceeds deadline by 2 weeks"
  improvement_path: "Reduce scope OR extend deadline OR add parallel work"

overall_feasibility: 2
steps_completed: [0, 1, 2]
current_step: 3
```

---

## 2.13 Proceed to VALIDATE

**Before loading Step 3, verify:**

- [ ] All 10 dimensions scored
- [ ] Confidence level assigned to each
- [ ] Binding constraint identified
- [ ] Sub-factors analyzed (for standard+ depth)
- [ ] No new constraints discovered that need Step 1 revisit

**Depth-based routing:**
- **Quick:** Skip VALIDATE, go directly to DECIDE (step-04)
- **Standard+:** Proceed to VALIDATE (step-03)

**Next step:**
- Quick: `steps/step-04-decide.md`
- Standard+: `steps/step-03-validate.md`

**Navigation:**
- ↓ PROCEED if all dimensions scored
- ↑ RETURN TO STEP 1 if new constraints discovered
- ↑ RETURN TO STEP 0 if scope needs change

---

## GATE_2 EVALUATION

AFTER scoring all 10 dimensions:

1. **Read tool:** data/gates.yaml
2. **Load GATE_2 conditions** (8 conditions — MOST CRITICAL for R2)
3. **FOR EACH condition:**
   - G2-01: ALL 10 dimensions scored (BLOCKER — R2 COMPLETENESS)
   - G2-02: NO dimension = 0 (BLOCKER)
   - G2-03: ALL confidence levels assigned (CRITICAL)
   - G2-04: binding_constraint = min(scores) (BLOCKER)
   - G2-05: binding sub-factors if depth≥standard (CRITICAL)
   - G2-06: infeasible (1-2) justified (ERROR)
   - G2-07: scoring matches yaml definitions (ERROR)
   - G2-08: ≥3 counter-checks executed (WARNING)

4. **Evaluation:**
   - IF ANY BLOCKER (G2-01, 02, 04) fails → GATE_2 = FAIL
   - IF ≥50% CRITICAL fail → GATE_2 = FAIL
   - ELSE → GATE_2 = PASS

5. **IF GATE_2 = FAIL:**
   - RERUN Step 2 with ALL 10 dimensions
   - NO partial assessments accepted

6. **IF GATE_2 = PASS:**
   - Proceed to Step 3 (VALIDATE) OR Step 4 if depth=quick

## VIOLATION CHECKS

**R2 COMPLETENESS (CRITICAL):**
- Agent MUST score ALL 10 dimensions: Technical, Resource, Knowledge, Organizational, Temporal, Compositional, Economic, Scale, Cognitive, Dependency
- "Main dimensions" = VIOLATION
- "Relevant dimensions" = VIOLATION
- "Key dimensions" = VIOLATION
- ONLY acceptable: ALL 10 scored OR SCOPE_REDUCTION with explicit declaration

**R12 JUST-IN-TIME:**
- Agent MUST NOT read step-03-validate.md until GATE_2 = PASS

---

## Output Checklist

Before proceeding, confirm:

- [ ] All 10 `dimension_scores` populated with score + confidence
- [ ] `binding_constraint` identified and documented
- [ ] `overall_feasibility` calculated as min(dimensions)
- [ ] Ready for validation or decision
