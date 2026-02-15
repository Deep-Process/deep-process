# 304 - Concentration Risk Detection

## Phase
INTERACT

## Purpose
Identify excessive dependency on any single entity. Concentration is the meta-risk that amplifies all other risks - when too much depends on one thing, that thing's failure becomes catastrophic.

## Concentration Dimensions

| Dimension | Question | High Concentration Threshold |
|-----------|----------|------------------------------|
| **Vendor** | What % of critical functions depend on one vendor? | >60% |
| **Person** | What functions only one person can perform? | Any |
| **Technology** | Migration cost to alternative? | >6 months effort |
| **Geographic** | All resources in one region/country? | All in one |
| **Temporal** | Many critical events on one deadline? | >3 concurrent |
| **Financial** | Revenue from one client/product? | >40% |
| **Knowledge** | Critical knowledge documented? | Undocumented |
| **Data** | Single source for critical data? | Single source |

## Procedure

### Step 1: Dimension Scan
For each concentration dimension, inventory:
- What depends on single points?
- What percentage of total?
- What's the substitution difficulty?

### Step 2: Identify Single Points
For each dimension, find:
- The single largest dependency
- All dependencies above threshold

### Step 3: Impact Assessment
For each single point:
- What fails if this fails?
- How many downstream systems affected?
- What's the recovery time?

### Step 4: Diversification Options
For each concentration:
- Can we diversify?
- What's the cost?
- What's the trade-off?

### Step 5: Concentration Score
Calculate overall concentration risk:
- Count dimensions with high concentration
- Weight by impact

## Output Schema
```yaml
concentrations:
  - dimension: "[Vendor|Person|Technology|Geographic|Temporal|Financial|Knowledge|Data]"
    single_point: "The concentrated dependency"
    dependency_percentage: "What % depends on this"
    threshold: "The high-concentration threshold"
    above_threshold: "[true|false]"
    failure_impact: "What happens if this fails"
    affected_systems: ["List of affected systems"]
    recovery_time: "Estimated time to recover/substitute"
    diversification_options:
      - option: "Alternative approach"
        cost: "Implementation cost"
        trade_off: "What we'd give up"
    concentration_level: "[Low|Medium|High|Critical]"

overall_concentration:
  dimensions_above_threshold: 4
  highest_concentration: "Vendor (Azure at 85%)"
  concentration_risk_score: "[Low|Medium|High|Critical]"
  single_best_diversification: "Recommended action"
```

## Quality Checks
- [ ] All dimensions examined
- [ ] Single points identified
- [ ] Percentages calculated
- [ ] Thresholds applied
- [ ] Diversification options explored
- [ ] Overall score calculated

## Connections
- Feeds into: #603 (portfolio concentration metric), #401 (strategy for concentrated risks)
- Uses output from: #104 (dependencies), organizational data
- Related to: #303 (concentration enables common mode failures)

## Examples

### Vendor Concentration
```yaml
dimension: Vendor
single_point: "Microsoft Azure"
dependency_percentage: "85%"
threshold: ">60%"
above_threshold: true
failure_impact: "All compute, storage, and services unavailable"
affected_systems:
  - "All data pipelines"
  - "All databases"
  - "All APIs"
  - "Authentication"
  - "Monitoring"
recovery_time: "6-12 months to migrate to alternative"
diversification_options:
  - option: "Multi-cloud (add AWS/GCP)"
    cost: "High - architecture changes, team training"
    trade_off: "Complexity, operational overhead"
  - option: "Critical path redundancy only"
    cost: "Medium - backup for critical services"
    trade_off: "Partial protection, still concentrated"
concentration_level: Critical
```

### Person Concentration
```yaml
dimension: Person
single_point: "Senior Architect (Maria)"
dependency_percentage: "N/A - single point for critical functions"
threshold: "Any single point"
above_threshold: true
failure_impact: "Architecture decisions blocked, critical knowledge lost"
affected_systems:
  - "Architecture decisions"
  - "Security review"
  - "Performance optimization"
  - "Incident escalation"
recovery_time: "6+ months to train replacement"
diversification_options:
  - option: "Cross-training program"
    cost: "Low - time investment"
    trade_off: "Slower short-term velocity"
  - option: "Documentation initiative"
    cost: "Medium - dedicated time"
    trade_off: "Maria's time diverted"
  - option: "Hire backup architect"
    cost: "High - salary, onboarding"
    trade_off: "Budget impact"
concentration_level: High
```

### Temporal Concentration
```yaml
dimension: Temporal
single_point: "Month-end close (last 3 days)"
dependency_percentage: "5 critical deadlines in 3 days"
threshold: ">3 concurrent"
above_threshold: true
failure_impact: "Any failure cascades to regulatory deadline"
affected_systems:
  - "Regulatory reporting"
  - "Client invoicing"
  - "Financial close"
  - "Performance reporting"
  - "Audit preparation"
recovery_time: "Cannot recover - deadlines are fixed"
diversification_options:
  - option: "Stagger deadlines where possible"
    cost: "Low - negotiation"
    trade_off: "Some deadlines non-negotiable"
  - option: "Pre-compute where possible"
    cost: "Medium - architecture changes"
    trade_off: "Data freshness trade-off"
  - option: "Additional capacity during peak"
    cost: "Medium - reserved capacity"
    trade_off: "Cost during non-peak"
concentration_level: High
```

### Financial Concentration
```yaml
dimension: Financial
single_point: "Mars client"
dependency_percentage: "62% of team revenue"
threshold: ">40%"
above_threshold: true
failure_impact: "Contract loss = team restructuring/layoffs"
affected_systems:
  - "Team budget"
  - "Team stability"
  - "Career planning"
recovery_time: "12-18 months to rebuild revenue base"
diversification_options:
  - option: "Aggressive new client pursuit"
    cost: "Medium - sales investment"
    trade_off: "Distraction from delivery"
  - option: "Expand scope with existing clients"
    cost: "Low - relationship leverage"
    trade_off: "Still concentrated if Mars expands too"
  - option: "Accept and manage relationship carefully"
    cost: "Low - relationship investment"
    trade_off: "Risk accepted, not mitigated"
concentration_level: Critical
```

## Overall Assessment Example

```yaml
overall_concentration:
  dimensions_above_threshold: 4
  concentrations:
    - "Vendor: Azure at 85% (Critical)"
    - "Person: Maria single point (High)"
    - "Temporal: Month-end 5 deadlines (High)"
    - "Financial: Mars at 62% (Critical)"
  highest_concentration: "Vendor and Financial (both Critical)"
  concentration_risk_score: Critical
  single_best_diversification: |
    Priority 1: Cross-train to reduce Maria dependency (lowest cost, high impact)
    Priority 2: Pursue 1-2 new clients to reduce Mars dependency (strategic)
    Priority 3: Accept Azure concentration with enhanced resilience planning
```

## Concentration Risk Cascade

Concentration creates risk multipliers:

```
High Vendor Concentration
    × High Person Concentration
    × High Financial Concentration
    = Fragile System

If Azure fails AND Maria leaves AND Mars terminates:
    = Catastrophic outcome

These are NOT independent events:
    - Economic downturn could trigger all three
    - Azure outage could cause Mars dissatisfaction could cause Maria stress
```

This is why concentration is a meta-risk - it amplifies everything else.
