# #403 Conditional Feasibility Map

**Phase:** 4 (DECIDE)
**Tier:** 1 — Mandatory
**Purpose:** Map conditions under which feasibility changes

## Theoretical Foundation

Feasibility is rarely binary. Most projects are feasible under certain conditions and infeasible under others. A conditional feasibility map makes these dependencies explicit.

**Key insight:** "It depends" is not a cop-out — it's accurate. The value is in specifying exactly what it depends on.

## Condition Types

| Type | Description | Example |
|------|-------------|---------|
| **Scope condition** | Feasibility changes with scope | "Feasible if Phase 1 only" |
| **Timeline condition** | Feasibility changes with time | "Feasible if deadline extends 6 weeks" |
| **Resource condition** | Feasibility changes with resources | "Feasible if we add 1 senior dev" |
| **Budget condition** | Feasibility changes with budget | "Feasible if budget increases 20%" |
| **External condition** | Depends on external factors | "Feasible if Mars provides API access" |
| **Technical condition** | Depends on technical validation | "Feasible if spike proves integration works" |

## Step-by-step

### Step 1: Identify All Conditions

From previous phases, collect all conditions mentioned:

```
CONDITIONS HARVESTED:

From #205 Temporal:
□ "If deadline extends by 6 weeks" → Score 2→3
□ "If scope reduces to Phase 1" → Score 2→4

From #210 Dependencies:
□ "If Mars API access confirmed by Week 4"
□ "If SLA defined in contract"

From #302 Critical Assumptions:
□ "If Synapse performance validated"
□ "If budget approved for scale"

From #306 Integration Spike:
□ "If Delta-Synapse integration works"
```

### Step 2: Map Condition Impact

For each condition, map the feasibility impact:

| Condition | Dimension Affected | Current | If True | If False |
|-----------|-------------------|---------|---------|----------|
| Timeline +6 weeks | Temporal | 2 | 3 | 2 |
| Phase 1 only | Temporal, Scale | 2, 3 | 4, 4 | 2, 3 |
| Mars API confirmed | Dependency | 3 | 4 | 2 |
| Synapse validated | Technical, Scale | 4, 3 | 4, 4 | 3, 2 |
| Add 1 senior dev | Resource, Knowledge | 3, 4 | 4, 4 | 3, 4 |

### Step 3: Create Condition Tree

```
CONDITION TREE:

                    CURRENT STATE
                    Score: 2 (Temporal binding)
                         │
            ┌────────────┴────────────┐
            │                         │
      Timeline extends           Timeline fixed
      by 6 weeks                      │
            │                         │
      Score: 3                   Reduce scope?
            │                         │
      ┌─────┴─────┐             ┌─────┴─────┐
      │           │             │           │
  Mars API    Mars API     Phase 1     Full scope
  confirmed    denied       only       required
      │           │             │           │
   Score: 4   Score: 3      Score: 4    NO-GO
   (GO)    (CONDITIONAL)    (GO)        Score: 2
```

### Step 4: Define Condition Dependencies

Some conditions depend on others:

```
CONDITION DEPENDENCIES:

Independent conditions:
□ Timeline extension (decision)
□ Scope reduction (decision)
□ Budget increase (decision)

Dependent conditions:
□ Mars API access (external — cannot control)
□ Synapse validation (depends on spike completing)
□ Team availability (depends on other projects)

Conditional chains:
1. Spike completes → Synapse validated → Scale confirmed
2. Mars responds → API access confirmed → Integration possible
3. Budget approved → Resources added → Capacity increased
```

### Step 5: Calculate Conditional Scenarios

Map out key scenarios:

```
SCENARIO A: Best case
Conditions: Timeline +6 weeks, Mars API confirmed, Synapse validated
Probability: 40%
Feasibility: Score 4 (GO)

SCENARIO B: Likely case
Conditions: Timeline +6 weeks, Mars delayed, Synapse validated
Probability: 35%
Feasibility: Score 3 (CONDITIONAL GO)

SCENARIO C: Constrained case
Conditions: Timeline fixed, Phase 1 only
Probability: 15%
Feasibility: Score 4 (GO — reduced scope)

SCENARIO D: Worst case
Conditions: Timeline fixed, Full scope required, Mars delayed
Probability: 10%
Feasibility: Score 2 (NO-GO)
```

### Step 6: Identify Decision Points

When must conditions be resolved?

| Condition | Decision Point | Latest Date | Owner |
|-----------|---------------|-------------|-------|
| Timeline extension | Project approval | Week 0 | Sponsor |
| Mars API access | Integration planning | Week 4 | PM |
| Synapse validation | Architecture decision | Week 2 | Tech Lead |
| Scope decision | Planning | Week 1 | Product Owner |
| Budget approval | Resource planning | Week 0 | Finance |

### Step 7: Score Conditional Clarity

| Score | Criteria |
|-------|----------|
| 5 | All conditions identified, quantified, with clear decision points |
| 4 | Most conditions clear, some uncertainty in probability |
| 3 | Key conditions identified, impacts partially quantified |
| 2 | Conditions vague, impacts unclear |
| 1 | Conditions not identified, feasibility appears unconditional |

## Output format

```yaml
conditional_feasibility_map:
  score: 4
  confidence: "M"

  current_state:
    overall_score: 2
    overall_confidence: "L"
    binding_constraint: "Temporal"
    verdict: "INVESTIGATE"

  conditions:
    - id: "COND-001"
      condition: "Timeline extends by 6 weeks"
      type: "Timeline"
      controllable: true
      owner: "Sponsor"
      decision_point: "Week 0"

      impact:
        dimension: "Temporal"
        score_before: 2
        score_after: 3
        confidence_after: "M"
        overall_impact: "Score 2→3, verdict changes to CONDITIONAL GO"

      dependencies: []
      cost: "6 weeks delay"
      probability: "70% if requested"

    - id: "COND-002"
      condition: "Reduce scope to Phase 1 only"
      type: "Scope"
      controllable: true
      owner: "Product Owner"
      decision_point: "Week 1"

      impact:
        dimensions:
          - dimension: "Temporal"
            score_before: 2
            score_after: 4
          - dimension: "Scale"
            score_before: 3
            score_after: 4
        overall_impact: "Score 2→4, verdict changes to GO"

      dependencies: []
      cost: "Deferred functionality"
      probability: "50% — stakeholder acceptance uncertain"

    - id: "COND-003"
      condition: "Mars API access confirmed"
      type: "External"
      controllable: false
      owner: "Mars IT"
      decision_point: "Week 4"

      impact:
        dimension: "Dependency"
        score_before: 3
        score_after: 4
        confidence_after: "H"
        overall_impact: "Removes critical path risk"

      dependencies: []
      cost: "None (just confirmation)"
      probability: "60% by Week 4"

      if_false:
        impact: "Dependency score drops to 2"
        mitigation: "File-based fallback (adds 2 weeks)"

    - id: "COND-004"
      condition: "Synapse performance validated at 100M"
      type: "Technical"
      controllable: true
      owner: "Tech Lead"
      decision_point: "Week 2"

      impact:
        dimensions:
          - dimension: "Scale"
            score_before: 3
            score_after: 4
          - dimension: "Technical"
            score_before: 4
            score_after: 4
            confidence_after: "H"
        overall_impact: "Confidence increases, risk reduces"

      dependencies:
        - "Spike must be executed first"
      cost: "3 days engineering time"
      probability: "80% success expected"

      if_false:
        impact: "Scale score drops to 2, Technical to 3"
        mitigation: "Alternative architecture needed"

  condition_tree: |
    CURRENT: Score 2 (Temporal binding)
         │
    ┌────┴────┐
    │         │
    +6 weeks  Fixed timeline
    Score: 3       │
         │    ┌────┴────┐
    ┌────┴────┐   │         │
    │         │   Phase 1   Full scope
    Mars ✓    Mars ✗  Score: 4   Score: 2
    Score: 4  Score: 3  (GO)     (NO-GO)
    (GO)   (COND GO)

  scenarios:
    - id: "SCENARIO-A"
      name: "Best case"
      conditions:
        - "COND-001 (Timeline +6 weeks)"
        - "COND-003 (Mars confirmed)"
        - "COND-004 (Synapse validated)"
      probability: "40%"
      overall_score: 4
      verdict: "GO"
      notes: "Full scope, extended timeline"

    - id: "SCENARIO-B"
      name: "Likely case"
      conditions:
        - "COND-001 (Timeline +6 weeks)"
        - "COND-004 (Synapse validated)"
        - "Mars delayed to Week 6"
      probability: "35%"
      overall_score: 3
      verdict: "CONDITIONAL GO"
      notes: "Proceed with Mars fallback plan ready"

    - id: "SCENARIO-C"
      name: "Constrained case"
      conditions:
        - "COND-002 (Phase 1 only)"
      probability: "15%"
      overall_score: 4
      verdict: "GO"
      notes: "Reduced scope fits timeline"

    - id: "SCENARIO-D"
      name: "Worst case"
      conditions:
        - "Timeline fixed"
        - "Full scope required"
        - "Mars delayed"
      probability: "10%"
      overall_score: 2
      verdict: "NO-GO"
      notes: "Cannot meet requirements"

  decision_points:
    - condition: "Timeline extension"
      date: "Week 0"
      owner: "Sponsor"
      decision_type: "Approval"
      impact_if_no: "Must reduce scope or accept high risk"

    - condition: "Scope decision"
      date: "Week 1"
      owner: "Product Owner"
      decision_type: "Requirements"
      impact_if_no: "Full scope commits to higher risk"

    - condition: "Synapse validation"
      date: "Week 2"
      owner: "Tech Lead"
      decision_type: "Technical"
      impact_if_fail: "Architecture redesign needed"

    - condition: "Mars API confirmation"
      date: "Week 4"
      owner: "PM"
      decision_type: "External"
      impact_if_no: "Activate file-based fallback"

  expected_value:
    calculation: "Probability-weighted average of scenarios"
    weighted_score: 3.45
    weighted_verdict: "Between CONDITIONAL GO and GO"
    recommendation: "Proceed with conditions monitored"

  recommendations:
    - "Request timeline extension at project approval"
    - "Complete Synapse spike by Week 2"
    - "Have scope reduction as fallback if timeline denied"
    - "Prepare file-based ingestion as Mars API fallback"
```

## Integration Points

- **Feeds from:** #401 Profile, #402 Decision, all Phase 2 conditions
- **Feeds to:** Risk register, project plan, decision documentation

## Common Pitfalls

- **Binary thinking:** "Feasible or not" without conditions
- **Ignoring dependencies:** Treating conditions as independent
- **No decision points:** Conditions without resolution timeline
- **Uncontrollable conditions:** Depending on things you can't influence
- **Too many conditions:** Feasibility depends on everything
