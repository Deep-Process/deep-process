# 305 - Compound Risk Scenarios

## Phase
INTERACT

## Purpose
Construct realistic scenarios where multiple individually-acceptable risks combine for catastrophic outcomes. Tests the risk PORTFOLIO, not individual risks.

## Core Insight

Individual risk assessment asks: "Is Risk A acceptable?"
Compound scenario analysis asks: "Is A+B+C acceptable?"

The answer can differ dramatically:
- Risk A: acceptable
- Risk B: acceptable
- Risk C: acceptable
- A + B + C: catastrophic

## Procedure

### Step 1: Select Correlated Clusters
Take top 3-5 correlated clusters from #302.
These are risks that tend to materialize together.

### Step 2: Construct Compound Scenario
For each cluster, construct a narrative:
> "What if ALL of these hit simultaneously?"

Include:
- Trigger event (what sets off the cluster)
- Simultaneous effects
- Compound consequences

### Step 3: Assess Combination Effect
Is the combined impact:

| Type | Description | Formula |
|------|-------------|---------|
| **Additive** | Sum of individual impacts | A + B + C |
| **Multiplicative** | Much worse than sum | A × B × C |
| **Threshold-crossing** | Crosses critical threshold | (A + B + C) > T → catastrophe |

### Step 4: Test Current Mitigations
Do current mitigations hold under compound stress?
- Were mitigations designed for single risks?
- Do they still work when multiple risks hit?

### Step 5: Apply Normal Accident Theory
If system is Complex + Tightly Coupled (#003):
- Compound scenarios are not hypothetical
- They are EXPECTED
- Plan accordingly

## Output Schema
```yaml
compound_scenarios:
  - scenario_id: "COMPOUND-001"
    name: "Descriptive scenario name"
    trigger: "What initiates the compound event"

    constituent_risks:
      - risk_id: "RISK-XXX"
        individual_impact: "Impact if alone"
      - risk_id: "RISK-YYY"
        individual_impact: "Impact if alone"
      - risk_id: "RISK-ZZZ"
        individual_impact: "Impact if alone"

    cluster_source: "CLUSTER-XXX from #302"
    common_driver: "What causes all to hit simultaneously"

    narrative: |
      Full scenario narrative describing how all risks
      combine and what the compound effect looks like.

    impact_analysis:
      additive_impact: "Sum of individual impacts"
      compound_impact: "Actual combined impact"
      non_linearity_factor: "How much worse than additive"
      threshold_crossed: "[true|false]"
      threshold_description: "What threshold is crossed"

    current_mitigation_status:
      designed_for_compound: "[true|false]"
      mitigations_that_fail: "Which mitigations break under compound"
      gaps: "What's missing"

    perrow_expected: "[true|false]"
    perrow_rationale: "Why this is/isn't expected per Normal Accident Theory"
```

## Quality Checks
- [ ] Top correlated clusters analyzed
- [ ] Compound narratives constructed
- [ ] Non-linearity assessed
- [ ] Mitigations tested for compound stress
- [ ] Perrow analysis applied

## Connections
- Feeds into: #401 (compound-aware strategy), #403 (compound-resilient defense)
- Uses output from: #302 (correlated clusters), #003 (Perrow characterization)
- Related to: Theoretical Foundations (Normal Accident Theory)

## Examples

### Example 1: Month-End Perfect Storm
```yaml
scenario_id: "COMPOUND-001"
name: "Month-End Perfect Storm"
trigger: "Month-end coincides with source system issues"

constituent_risks:
  - risk_id: "RISK-031"
    individual_impact: "Processing delays (Medium)"
  - risk_id: "RISK-032"
    individual_impact: "Team stretched (Medium)"
  - risk_id: "RISK-023"
    individual_impact: "Source schema issue (High)"
  - risk_id: "RISK-033"
    individual_impact: "Regulatory deadline pressure (High)"

cluster_source: "CLUSTER-003: Month-End Crunch"
common_driver: "Month-end timing + source system instability"

narrative: |
  It's the last day of the month. The regulatory report is due in 8 hours.
  The source system pushes an unexpected schema change at 2 AM. The pipeline
  fails. The team is already stretched handling other month-end tasks. The
  senior engineer who knows the schema mapping is on vacation. Junior
  engineers attempt fix but introduce additional bugs. By the time issues
  are identified, only 4 hours remain. Manual processing attempted but
  incomplete. Deadline missed. Regulatory penalty applied.

impact_analysis:
  additive_impact: "Delays + stress + technical issues = significant disruption"
  compound_impact: "Regulatory deadline miss, financial penalty, trust damage"
  non_linearity_factor: "3x - deadline is hard threshold"
  threshold_crossed: true
  threshold_description: "Regulatory submission deadline"

current_mitigation_status:
  designed_for_compound: false
  mitigations_that_fail:
    - "Schema validation - not monitored on weekends"
    - "On-call - senior engineer exempt during vacation"
    - "Manual fallback - requires full team, team is stretched"
  gaps:
    - "No pre-month-end schema check"
    - "No backup for senior engineer knowledge"
    - "Mitigations designed for single failures, not compound"

perrow_expected: true
perrow_rationale: "System is complex (multiple dependencies) and tightly coupled (hard deadline). Compound failures are expected, not exceptional."
```

### Example 2: Infrastructure + People Compound
```yaml
scenario_id: "COMPOUND-002"
name: "Knowledge Loss During Crisis"
trigger: "Key person leaves during critical system failure"

constituent_risks:
  - risk_id: "RISK-045"
    individual_impact: "Knowledge loss (High)"
  - risk_id: "RISK-011"
    individual_impact: "System outage (High)"
  - risk_id: "RISK-004"
    individual_impact: "Client escalation (Medium)"

cluster_source: "Not from single cluster - cross-cluster compound"
common_driver: "Stress and burnout accelerate both system issues and departures"

narrative: |
  A critical production issue occurs on Tuesday. The team is under pressure
  to resolve. On Wednesday, the senior engineer who knows the system best
  announces resignation (two weeks notice, offer they can't refuse). The
  outage continues. Knowledge transfer is impossible - all hands on incident.
  By Thursday, the client has escalated to VP level. Resolution requires
  knowledge that only departing engineer has. Two weeks pass. Engineer leaves.
  Incident still unresolved. Team is demoralized. Second engineer starts
  looking for new job.

impact_analysis:
  additive_impact: "Outage + knowledge loss + client issue = bad month"
  compound_impact: "Prolonged outage, permanent knowledge loss, talent exodus"
  non_linearity_factor: "5x - creates vicious cycle"
  threshold_crossed: true
  threshold_description: "Team stability threshold"

current_mitigation_status:
  designed_for_compound: false
  mitigations_that_fail:
    - "On-call rotation - assumes responders have knowledge"
    - "Documentation - incomplete, not accessible during crisis"
    - "Relationship management - impossible while firefighting"
  gaps:
    - "No crisis knowledge capture protocol"
    - "No 'all-hands-off-deck' for critical departures"
    - "No separation of incident response from BAU"

perrow_expected: true
perrow_rationale: "High coupling between people and systems. One failure amplifies the other."
```

### Example 3: Financial + Vendor Compound
```yaml
scenario_id: "COMPOUND-003"
name: "Economic Downturn Cascade"
trigger: "Economic recession affects multiple dimensions"

constituent_risks:
  - risk_id: "RISK-041"
    individual_impact: "Budget cut 20% (High)"
  - risk_id: "RISK-067"
    individual_impact: "Client reduces scope (High)"
  - risk_id: "RISK-051"
    individual_impact: "Vendor increases prices (Medium)"
  - risk_id: "RISK-046"
    individual_impact: "Key people leave for stability (Medium)"

cluster_source: "Economic stress cluster"
common_driver: "Economic recession"

narrative: |
  Economic downturn hits. Client announces 30% scope reduction for next
  year. Internal budget cut of 20% announced. At the same time, cloud
  vendor announces 15% price increase (they're also under pressure). Team
  faces layoffs. Before layoffs happen, two senior engineers leave for more
  stable companies. Remaining team is demoralized and under-resourced.
  Delivery quality drops. Client further reduces confidence. Death spiral.

impact_analysis:
  additive_impact: "Budget cut + revenue cut + cost increase + attrition = difficult year"
  compound_impact: "Potential team dissolution or major restructuring"
  non_linearity_factor: "4x - each element makes others worse"
  threshold_crossed: true
  threshold_description: "Team viability threshold"

current_mitigation_status:
  designed_for_compound: false
  mitigations_that_fail:
    - "Cost optimization - limited when already lean"
    - "Retention programs - hard when layoffs happening"
    - "Client diversification - takes years, not months"
  gaps:
    - "No scenario planning for economic downturn"
    - "No financial reserves/buffer"
    - "No early warning indicators for economic stress"

perrow_expected: false
perrow_rationale: "Not a technical system - but economic systems have their own tight coupling."
```

## Compound Scenario Design Principles

1. **Use real correlations:** Build from #302 clusters, not imagination
2. **Include the human element:** People are often the weak link in compounds
3. **Test thresholds:** Many compounds cross thresholds that single risks don't
4. **Challenge mitigations:** Mitigations often assume single failure mode
5. **Apply Perrow:** Complex + coupled systems should expect compounds
