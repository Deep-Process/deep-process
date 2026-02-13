---
step: 3
name: "Validate"
time_estimate: "1-4 hours (depth dependent)"
goal: "Empirically test critical feasibility assumptions"
requires_completion: [0, 1, 2]
next_steps:
  DEFAULT: "steps/step-04-decide.md"
  NEW_CONSTRAINTS: "steps/step-01-constrain.md"
  NEW_DIMENSION_DATA: "steps/step-02-assess.md"
data_dependencies:
  - "data/method-procedures/301-306*.md"
  - "data/theoretical-foundations.yaml"
outputs:
  - reference_class_data
  - assumptions_tested
  - probes_designed
  - calibrated_estimates
---

# Phase 3: VALIDATE

## PRECONDITION CHECK

1. **PRECONDITION:** GATE_2 = PASS
2. **Verify:** dimension_scores, binding_constraint from Step 2 exist
3. **IF NOT:** HALT, report SEQUENCE VIOLATION
4. **IF depth=quick:** GATE_3 auto-passes (skip to Step 4)
5. **IF depth≥standard:** PROCEED to validation methods

---

## ENFORCED SEQUENCE

**IF depth=quick:** GATE_3 auto-passes → skip all, proceed to Step 4

**STEP 1:** Read tool: data/method-procedures/301_Reference_Class_Forecasting.md (Standard+ MANDATORY)
**STEP 2:** Read tool: data/method-procedures/302_Critical_Assumption_Testing.md (Standard+ MANDATORY)
**STEP 3:** Read tool: data/method-procedures/303_Probe_Design.md (IF complex_mode=on OR comprehensive+)
**STEP 4:** Read tool: data/method-procedures/304_Expert_Judgment_Calibration.md (Standard+)
**STEP 5:** Record: reference_class_data, assumptions_tested, probes_designed, calibrated_estimates
4. **UPDATE SCORES** — Validation may change dimension scores

---

## Core Principle: Analysis Tells You What SHOULD Work, Validation Tells You What ACTUALLY Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VALIDATION VS ANALYSIS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ANALYSIS (Steps 0-2):                                                      │
│  • Expert judgment                                                          │
│  • Reasoning from first principles                                          │
│  • Pattern matching                                                         │
│  • Produces: "This SHOULD work because..."                                  │
│                                                                              │
│  VALIDATION (Step 3):                                                       │
│  • Reference class data (what actually happened to similar projects)        │
│  • Empirical testing (probes, spikes)                                       │
│  • Calibrated expert judgment (debiased)                                    │
│  • Produces: "This ACTUALLY works/doesn't work because..."                  │
│                                                                              │
│  The gap between "should" and "actually" is where planning fallacy lives.  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.1 Reference Class Forecasting (#301)

**1. Read tool:** `data/method-procedures/301_Reference_Class_Forecasting.md`

**Purpose:** Replace inside-view estimates with outside-view base rates. The single most effective debiasing technique for feasibility assessment (Flyvbjerg).

### Why Reference Class Works

| Inside View (Your Analysis) | Outside View (Reference Class) |
|-----------------------------|---------------------------------|
| "Our project is special" | "What happens to projects like this?" |
| Focuses on unique details | Focuses on statistical patterns |
| Systematically optimistic | Empirically calibrated |
| "We'll deliver on time" | "25% of similar projects deliver on time" |

### Execution Process

1. **Define reference class:** What type of project is this?
   - Data platform migration?
   - New product launch?
   - Regulatory compliance system?
   - Technology adoption?

2. **Find base rates:**

| Project Type | On-Time | On-Budget | Full Scope | Avg Cost Overrun | Avg Schedule Overrun |
|-------------|---------|-----------|------------|-----------------|---------------------|
| Enterprise data platform | ~25% | ~30% | ~40% | +60-100% | +50-80% |
| Cloud migration | ~30% | ~35% | ~45% | +40-80% | +40-60% |
| Regulatory compliance | ~35% | ~40% | ~50% | +30-60% | +30-50% |
| Greenfield software | ~20% | ~25% | ~35% | +100-200% | +80-150% |
| Infrastructure automation | ~40% | ~45% | ~55% | +30-50% | +30-50% |

3. **Adjust from base rate:**
   - What makes THIS project better than typical?
   - What makes it worse than typical?
   - **Anchor to base rate** — adjustments should be modest

### Record Reference Class

```yaml
reference_class:
  type: "Enterprise data platform"
  base_rates:
    on_time: "25%"
    on_budget: "30%"
    avg_cost_overrun: "+80%"
    avg_schedule_overrun: "+65%"

  adjustments_positive:
    - "Experienced team with similar platform"
    - "Clear requirements from regulatory mandate"

  adjustments_negative:
    - "New technology combination (Databricks + Synapse)"
    - "Cross-organizational coordination required"

  calibrated_estimate:
    on_time_probability: "30%"  # Slight improvement from base
    expected_schedule_overrun: "+50%"
    confidence: "Medium"
```

**Key rule:** The estimate that feels uncomfortably pessimistic is usually the most accurate.

---

## 3.2 Critical Assumption Testing (#302)

**1. Read tool:** `data/method-procedures/302_Critical_Assumption_Testing.md`

**Purpose:** Identify assumptions that feasibility MOST depends on, then test them BEFORE committing.

### Execution Process

1. **List all assumptions** from Steps 0-2
   - Scope assumptions (#003)
   - Constraint assumptions (#101-106)
   - Dimension assumptions (#201-210)

2. **Rank by: Impact if Wrong × Uncertainty**

| Assumption | Impact if Wrong | Uncertainty | Priority |
|------------|-----------------|-------------|----------|
| "Databricks handles 10M records in 4 hours" | High | Medium | **P1** |
| "Mars data format is stable" | High | High | **P1** |
| "Team can learn Synapse in 2 weeks" | Medium | Medium | P2 |

3. **For top 3-5 assumptions, design minimal test:**

```
Assumption: "[Statement]"
├── Test: [How to confirm/refute]
├── Cost: [Time, money, effort required]
├── Decision threshold:
│   • If [X] → CONFIRMED, proceed
│   • If [Y] → INVESTIGATE further
│   • If [Z] → REFUTED, redesign
└── Outcome: [CONFIRMED / REFUTED / INCONCLUSIVE]
```

### Example

```yaml
assumption_tests:
  - assumption: "Databricks cluster can process 10M records in 4-hour window"
    impact: "High — core SLA requirement"
    uncertainty: "Medium — similar done but not this data"
    test: "Run 10M records on production-sized cluster"
    cost: "1 day engineering + $200 cluster"
    threshold:
      confirmed: "<3.5 hours"
      investigate: "3.5-5 hours"
      refuted: ">5 hours"
    outcome: "CONFIRMED — 2.8 hours"
    value_of_test: "Prevented potential discovery-in-production"

  - assumption: "Mars provides data in agreed format"
    impact: "High — pipeline design depends on it"
    uncertainty: "High — no sample data yet"
    test: "Request sample data file"
    cost: "0 engineering, 1 week wait"
    threshold:
      confirmed: "Matches spec"
      investigate: "Minor deviations"
      refuted: "Major format differences"
    outcome: "INCONCLUSIVE — awaiting sample"
```

**IF assumption REFUTED:** Return to relevant step to update assessment

---

## 3.3 Probe Design (#303)

**1. Read tool:** `data/method-procedures/303_Probe_Design.md`

**Purpose:** For Complex-domain sub-problems (#001), design safe-to-fail experiments that REVEAL feasibility through action, not analysis.

### When to Use

- `complex_mode = on` (detected in Step 0)
- Sub-problems in Complex Cynefin domain
- "We can't know until we try" situations
- Novel combinations without precedent

### Probe Properties

```
SAFE-TO-FAIL:  Probe failure must be survivable (limited blast radius)
INFORMATIVE:   Probe outcome must change feasibility assessment
FAST:          Results in days/weeks, not months
CHEAP:         Cost small relative to full project cost
MULTIPLE:      Run several probes in parallel (different approaches)
```

### Execution Process

1. **For each Complex sub-problem:**
   - What does "feasibility" mean in observable terms?
   - How would we know if it works?

2. **Design 2-3 parallel probes:**
   - Different approaches to same question
   - Different risk profiles

3. **Define success/failure criteria BEFORE running:**
   - Prevents post-hoc rationalization
   - Clear decision rules

4. **Run probes with time/cost limits**

5. **Amplify or Dampen:**
   - Probe succeeds → Amplify (invest more)
   - Probe fails → Dampen (stop that path)

### Example

```yaml
probes:
  - complex_question: "Can we build ML-based data quality detection?"
    probe_designs:
      - id: "A"
        approach: "Rule-based anomaly detection"
        cost: "3 days"
        risk: "Low"
      - id: "B"
        approach: "Statistical outlier detection"
        cost: "3 days"
        risk: "Medium"
      - id: "C"
        approach: "Transformer-based detection"
        cost: "5 days"
        risk: "High"

    success_criteria: "Detect >80% of known-bad records in test set"

    results:
      - probe: "A"
        result: "60%"
        action: "DAMPEN — insufficient alone"
      - probe: "B"
        result: "82%"
        action: "AMPLIFY — pursue this approach"
      - probe: "C"
        result: "75% (overfit)"
        action: "DAMPEN — not feasible with current skills"

    conclusion: "B is feasible, proceed with statistical approach"
```

---

## 3.4 Expert Judgment Calibration (#304)

**1. Read tool:** `data/method-procedures/304_Expert_Judgment_Calibration.md`

**Purpose:** Gather expert estimates but apply structured debiasing.

### Execution Process

1. **Identify right experts:**
   - Domain experience
   - Relevant track record
   - No conflict of interest

2. **Structure elicitation:**
   - **Three-point estimate:** Optimistic / Likely / Pessimistic
   - **Confidence level:** "How confident? 60%? 90%?"
   - **Independent:** Ask separately (prevent anchoring)

3. **Apply debiasing:**

| Bias | Correction |
|------|------------|
| Narrow ranges | Widen 80% intervals by 2× (typically contain true value only 50%) |
| Optimistic center | Shift 20-30% pessimistic |
| Anchoring | Compare across independent estimates |
| Overconfidence | Calibrate against expert's track record if available |

4. **Aggregate:**
   - Use **median** (not mean — resistant to outliers)
   - Note range and disagreement

### Record Expert Estimates

```yaml
expert_estimates:
  - question: "How long to build data pipeline?"
    experts:
      - expert: "Senior DE"
        three_point: {optimistic: "4 weeks", likely: "6 weeks", pessimistic: "10 weeks"}
        confidence: "70%"
      - expert: "Tech Lead"
        three_point: {optimistic: "6 weeks", likely: "8 weeks", pessimistic: "14 weeks"}
        confidence: "60%"

    debiased:
      widened_range: "3-16 weeks"
      shifted_center: "8 weeks"
      calibrated_estimate: "8-12 weeks"

    aggregated: "Median likely = 7 weeks, calibrated = 9-10 weeks"
```

---

## 3.5 Analogical Feasibility Transfer (#305)

**1. Read tool:** `data/method-procedures/305_Analogical_Feasibility_Transfer.md`

**Purpose:** Assess how well precedent (#106) transfers to current situation.

### Execution Process

1. **For each precedent from #106:**

2. **Assess structural similarity:**

| Similarity Type | Question | Value |
|-----------------|----------|-------|
| **Surface** | Same domain, same tech? | Useful but can mislead |
| **Structural** | Same architecture patterns, complexity? | More valuable |
| **Context** | Same team size, org, timeline? | Most valuable |

3. **For each dimension where analogy DIVERGES:**
   - What's the impact on feasibility?
   - Does divergence help or hurt?

4. **Anti-pattern check:**
   - "Netflix did it, so can we" — surface similarity only
   - Different scale, different org, different resources

### Record Analogies

```yaml
analogies:
  - precedent: "Company X's Delta Lake implementation"
    surface_similarity: "High — same tech stack"
    structural_similarity: "Medium — simpler data model"
    context_similarity: "Medium — larger team, more time"

    divergences:
      - area: "Data complexity"
        impact: "Our data more complex — harder"
      - area: "Team experience"
        impact: "Similar experience — neutral"
      - area: "Timeline"
        impact: "We have less time — harder"

    transferability: "Partial — core approach transfers, timeline risk higher"
```

---

## 3.6 Integration Spike (#306)

**1. Read tool:** `data/method-procedures/306_Integration_Spike.md`

**Purpose:** Build the HARDEST integration point first. If the hardest part is feasible, project is likely feasible. If not, find out early.

### When to Use

- Comprehensive+ depth
- Compositional feasibility (#206) score < 4
- Novel integration without precedent
- High-risk interfaces identified

### Execution Process

1. **Identify riskiest integration point** (from #206)

2. **Build minimal spike testing ONLY that integration:**
   - Happy path: Does data flow?
   - Error path: What happens when one side fails?
   - Scale path: Does it work at representative volume?

3. **Time-box the spike:**
   - If can't get basic integration working in N days → STRONG infeasibility signal

4. **This is NOT a PoC of whole system**
   - Targeted test of compositional risk only

### Record Spike Results

```yaml
integration_spike:
  integration_point: "Databricks → Synapse data transfer"

  tests:
    - test: "Happy path"
      result: "PASS — data flows correctly"
      time: "4 hours"

    - test: "Error path"
      result: "PARTIAL — retry works, but no dead letter queue"
      time: "2 hours"

    - test: "Scale path"
      result: "PASS — 1M records in 15 minutes"
      time: "3 hours"

  total_effort: "1.5 days"
  feasibility_verdict: "Feasible with minor work on error handling"
```

---

## 3.7 Depth Adjustments

### Quick Depth
- **Skip entirely** — no validation
- Proceed directly to DECIDE

### Standard Depth
- **Execute:** #301, #302, #304
- **Skip:** #303 (unless complex_mode=on), #305, #306

### Comprehensive+ Depth
- **Execute:** All validation methods
- **#303** required if complex_mode=on
- **#306** recommended if compositional score < 4

---

## 3.8 Update Scores Based on Validation

Validation may change dimension scores from Step 2:

```
IF reference class shows worse base rates:
  → Consider lowering temporal/resource scores

IF assumption refuted:
  → Update relevant dimension score

IF probe fails:
  → Mark Complex sub-problem as infeasible OR redesign

IF integration spike fails:
  → Lower compositional score

IF expert estimates much higher:
  → Lower temporal score
```

---

## 3.9 Update Frontmatter

After completing VALIDATE:

```yaml
validation:
  reference_class:
    type: "Enterprise data platform"
    on_time_probability: "30%"
    expected_overrun: "+50%"

  assumptions_tested:
    - assumption: "10M records in 4 hours"
      outcome: "CONFIRMED"
    - assumption: "Mars data format stable"
      outcome: "INCONCLUSIVE"

  probes:
    - question: "ML data quality"
      outcome: "Statistical approach feasible"

  expert_calibration:
    timeline: "8-12 weeks (calibrated)"

  integration_spike:
    point: "Databricks → Synapse"
    result: "Feasible"

# Update if validation changed scores:
dimension_scores:
  temporal: {score: 2, confidence: "H"}  # unchanged or updated

steps_completed: [0, 1, 2, 3]
current_step: 4
```

---

## GATE_3 EVALUATION

AFTER validation methods:

1. **Read tool:** data/gates.yaml
2. **Load GATE_3 conditions** (5 conditions)
3. **FOR EACH condition:**
   - G3-01: IF depth=quick → auto-pass (N/A)
   - G3-02: IF depth≥standard → #301 Reference Class executed (CRITICAL)
   - G3-03: IF depth≥standard → #302 Assumptions tested (CRITICAL)
   - G3-04: IF complex OR depth≥comprehensive → #303 Probes designed (ERROR)
   - G3-05: Calibrated estimates recorded (WARNING)

4. **Evaluation:**
   - IF depth=quick → GATE_3 = PASS (auto)
   - IF depth≥standard AND (G3-02 OR G3-03) fail → GATE_3 = FAIL
   - ELSE → GATE_3 = PASS

5. **IF GATE_3 = FAIL:**
   - Execute missing validation methods
   - RERUN Step 3

6. **IF GATE_3 = PASS:**
   - Proceed to Step 4 (DECIDE)

## VIOLATION CHECKS

**R2 COMPLETENESS:**
- Depth-required methods executed (no intelligent skipping)

**R12 JUST-IN-TIME:**
- Agent MUST NOT read step-04-decide.md until GATE_3 = PASS

---

## 3.10 Proceed to DECIDE

**Before loading Step 4, verify:**

- [ ] Reference class data gathered (standard+)
- [ ] Critical assumptions tested or flagged
- [ ] Probes designed/executed (if complex_mode=on)
- [ ] Expert estimates calibrated (if used)
- [ ] Integration spike completed (if comprehensive+)
- [ ] Dimension scores updated based on validation

**Next step:** Load `steps/step-04-decide.md`

**Navigation:**
- ↓ PROCEED if validation complete
- ↑ RETURN TO STEP 2 if validation changed dimension understanding
- ↑ RETURN TO STEP 1 if validation revealed new constraints

---

## Output Checklist

Before proceeding, confirm:

- [ ] `reference_class` data documented
- [ ] `assumptions_tested` list complete
- [ ] `probes` results recorded (if applicable)
- [ ] Dimension scores updated if validation changed them
- [ ] Ready to make decision
