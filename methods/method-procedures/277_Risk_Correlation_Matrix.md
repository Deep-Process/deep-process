# 302 - Risk Correlation Matrix

## Phase
INTERACT

## Purpose
Identify which risks materialize SIMULTANEOUSLY - not because one causes another (#301) but because they share common drivers.

## Cascade vs Correlation

| Relationship | Nature | Example |
|--------------|--------|---------|
| **Cascade** (#301) | A causes B | Server failure → data loss |
| **Correlation** (#302) | A and B share common cause | Server failure AND network failure (both caused by power outage) |

Correlation is dangerous because:
- P(A and B) >> P(A) × P(B)
- Most risk registers assume independence
- This assumption can be fatally wrong

## Procedure

### Step 1: Build N×N Matrix
Create matrix of all identified risks.

### Step 2: Pairwise Analysis
For each pair, ask:
> "Could these hit at the same time? What common condition causes both?"

### Step 3: Classify Relationship

| Classification | Meaning | P(A and B) |
|----------------|---------|------------|
| **Independent** | No relationship | = P(A) × P(B) |
| **Correlated** | Tend to occur together | >> P(A) × P(B) |
| **Anti-correlated** | Tend NOT to occur together | << P(A) × P(B) |

### Step 4: Identify Common Drivers
For correlated pairs: What shared condition triggers both?

Common drivers include:
- Shared infrastructure
- Common dependency
- Same team/person
- Same time period (month-end, holidays)
- Same market conditions
- Same adversary

### Step 5: Cluster Correlated Risks
Group risks that share drivers into clusters.
A cluster represents a single "scenario" not independent events.

## Output Schema
```yaml
correlation_matrix:
  # N×N matrix, showing only non-independent pairs
  correlations:
    - risk_a: "RISK-XXX"
      risk_b: "RISK-YYY"
      relationship: "[Independent|Correlated|Anti-correlated]"
      common_driver: "What causes both (if correlated)"
      correlation_strength: "[Weak|Moderate|Strong]"

clusters:
  - cluster_id: "CLUSTER-001"
    name: "Descriptive name for this cluster"
    common_driver: "What drives all risks in this cluster"
    risks:
      - "RISK-XXX"
      - "RISK-YYY"
      - "RISK-ZZZ"
    combined_probability: "Probability of cluster scenario"
    combined_impact: "Impact if cluster materializes"
```

## Quality Checks
- [ ] All risk pairs analyzed
- [ ] Common drivers identified for correlations
- [ ] Clusters formed from correlated groups
- [ ] Independence assumption violations flagged
- [ ] Anti-correlations noted (can be exploited for hedging)

## Connections
- Feeds into: #305 (compound scenarios use clusters), #603 (portfolio correlation)
- Uses output from: #101-#112 (risk inventory), #301 (cascade = correlation via causation)
- Related to: #303 (common mode failures are extreme correlations)

## Example: Data Platform Risks

### Correlation Analysis
```yaml
correlations:
  - risk_a: "RISK-011: Databricks cluster failure"
    risk_b: "RISK-012: Azure Storage outage"
    relationship: Correlated
    common_driver: "Azure region outage"
    correlation_strength: Strong

  - risk_a: "RISK-011: Databricks cluster failure"
    risk_b: "RISK-015: Key engineer unavailable"
    relationship: Independent
    common_driver: N/A
    correlation_strength: N/A

  - risk_a: "RISK-021: Pipeline A failure"
    risk_b: "RISK-022: Pipeline B failure"
    relationship: Correlated
    common_driver: "Same source system, same credentials"
    correlation_strength: Strong

  - risk_a: "RISK-031: Month-end processing overload"
    risk_b: "RISK-032: Team capacity crunch"
    relationship: Correlated
    common_driver: "Month-end timing"
    correlation_strength: Strong

  - risk_a: "RISK-041: Budget cut"
    risk_b: "RISK-042: Team expansion"
    relationship: Anti-correlated
    common_driver: "Fiscal policy (opposite effects)"
    correlation_strength: Moderate
```

### Clusters Identified
```yaml
clusters:
  - cluster_id: "CLUSTER-001"
    name: "Azure Region Failure"
    common_driver: "West Europe region outage"
    risks:
      - "RISK-011: Databricks cluster failure"
      - "RISK-012: Azure Storage outage"
      - "RISK-013: Azure SQL unavailable"
      - "RISK-014: Azure AD authentication fails"
    combined_probability: "2-4 incidents/year (region-level)"
    combined_impact: "Total platform unavailability"

  - cluster_id: "CLUSTER-002"
    name: "Source System Dependency"
    common_driver: "Source system issues"
    risks:
      - "RISK-021: Pipeline A failure"
      - "RISK-022: Pipeline B failure"
      - "RISK-023: Pipeline C failure"
    combined_probability: "~Monthly (source system unstable)"
    combined_impact: "All downstream reports delayed"

  - cluster_id: "CLUSTER-003"
    name: "Month-End Crunch"
    common_driver: "Month-end timing pressure"
    risks:
      - "RISK-031: Processing overload"
      - "RISK-032: Team capacity crunch"
      - "RISK-033: Regulatory deadline pressure"
      - "RISK-034: Client escalation likelihood"
    combined_probability: "Every month-end (12x/year)"
    combined_impact: "Maximum stress, minimum slack"
```

## Visualization: Correlation Heatmap

```
Risk Correlation Matrix

         R011  R012  R013  R021  R022  R031  R032
R011      -    ███   ███    ·     ·     ·     ·
R012     ███    -    ███    ·     ·     ·     ·
R013     ███   ███    -     ·     ·     ·     ·
R021      ·     ·     ·     -    ███    ·     ·
R022      ·     ·     ·    ███    -     ·     ·
R031      ·     ·     ·     ·     ·     -    ███
R032      ·     ·     ·     ·     ·    ███    -

Legend: ███ = Correlated  · = Independent  ░░░ = Anti-correlated

Clusters visible as blocks on diagonal
```

## Critical Insight: Independence Assumption

**Most risk registers implicitly assume risks are independent.**

If your register has:
- RISK-A: P=20%, I=High
- RISK-B: P=20%, I=High

And treats them as independent:
- P(A and B) = 0.20 × 0.20 = 4%

But if they're correlated (e.g., same driver):
- P(A and B) might be 15-20% (same as either one)

**This difference can be catastrophic for planning.**

## Using Correlations in Portfolio Analysis

1. **Don't double-count:** If A and B are correlated, their combined risk is NOT additive
2. **Scenario-based thinking:** Think "CLUSTER-001 happens" not "RISK-A happens"
3. **Diversification:** Anti-correlated risks can hedge each other
4. **Common driver mitigation:** Fixing the driver fixes multiple risks at once
