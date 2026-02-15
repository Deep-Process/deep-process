# 112 - Scenario Planning Matrix

## Phase
IDENTIFY (Horizontal)

## Purpose
Construct structured scenarios from key uncertainties to identify risks that only emerge in specific futures. Not a single "what could go wrong" but "WHICH WORLD might we be in, and what are the risks in each?"

## Scenario Planning vs. Risk Analysis

Traditional risk analysis assumes one future. Scenario planning acknowledges multiple possible futures.

| Approach | Question | Output |
|----------|----------|--------|
| Risk Analysis | "What could go wrong in our expected future?" | Risk list for one scenario |
| Scenario Planning | "What are the plausible futures, and what risks emerge in each?" | Risk lists per scenario + robustness analysis |

## Procedure

### Step 1: Identify Key Uncertainties
Identify the 2 most:
- **Impactful** (if it goes one way vs another, project outcome changes significantly)
- **Uncertain** (genuinely don't know which way it will go)

Good dimensions: market growth, regulatory pressure, technology adoption, competitive response, resource availability.

### Step 2: Construct 2x2 Matrix
Create four distinct future scenarios from the two dimensions.

```
                    Dimension 2: LOW          Dimension 2: HIGH
                ┌───────────────────────┬───────────────────────┐
Dimension 1:    │                       │                       │
HIGH            │      Scenario C       │      Scenario D       │
                │                       │                       │
                ├───────────────────────┼───────────────────────┤
Dimension 1:    │                       │                       │
LOW             │      Scenario A       │      Scenario B       │
                │                       │                       │
                └───────────────────────┴───────────────────────┘
```

### Step 3: Name Each Scenario
Give each scenario a memorable name that captures its essence.
Names make scenarios discussable and memorable.

### Step 4: Identify Scenario-Specific Risks
For each scenario: What risks emerge that don't exist (or are minor) in other scenarios?

### Step 5: Classify Risks by Robustness
- **Robust risks:** Appear in 3+ scenarios = HIGH PRIORITY (need mitigation regardless of future)
- **Conditional risks:** Unique to 1-2 scenarios = MONITOR for that scenario's indicators

### Step 6: Plan Robustness Assessment
Is the current plan robust across ALL 4 scenarios, or only optimized for 1-2?

## Output Schema
```yaml
scenario_planning:
  dimensions:
    - name: "First dimension"
      low_state: "What LOW means"
      high_state: "What HIGH means"
    - name: "Second dimension"
      low_state: "What LOW means"
      high_state: "What HIGH means"

  scenarios:
    - name: "Scenario name"
      dimensions: "Dim1: Low, Dim2: Low"
      description: "What this world looks like"
      risks_unique_to_scenario:
        - risk_id: "RISK-XXX"
          description: "Risk that emerges in this scenario"
      key_indicators: "How we'd know we're in this scenario"

  robust_risks:
    - risk_id: "RISK-XXX"
      description: "Risk that appears across scenarios"
      scenarios_present: ["A", "B", "C", "D"]
      priority: "[High|Critical]"

  current_plan_robustness:
    optimized_for: "Which scenario(s) the plan assumes"
    vulnerable_in: "Which scenarios would cause plan failure"
    recommendations: "How to increase robustness"
```

## Quality Checks
- [ ] Two most impactful + uncertain dimensions selected
- [ ] All four scenarios named and described
- [ ] Risks identified for each scenario
- [ ] Robust vs conditional risks classified
- [ ] Current plan assessed for scenario robustness

## Connections
- Feeds into: #305 (compound scenarios), #201 (probability in context)
- Uses output from: Business context, market analysis
- Related to: #002 (Knight uncertainty - scenarios for uncertain futures)

## Example: Data Platform Project

### Dimensions Selected
```yaml
dimensions:
  - name: "Data volume growth"
    low_state: "Steady state, 10-20% annual growth"
    high_state: "Explosive growth, 3-5x in 2 years"
  - name: "Regulatory pressure"
    low_state: "Current requirements, gradual evolution"
    high_state: "GDPR-style mandates, aggressive enforcement"
```

### Scenario Matrix
```
                    Regulatory: LOW         Regulatory: HIGH
                ┌───────────────────────┬───────────────────────┐
Volume:         │                       │                       │
HIGH            │    "Data Explosion"   │   "Perfect Storm"     │
                │                       │                       │
                ├───────────────────────┼───────────────────────┤
Volume:         │                       │                       │
LOW             │    "Steady State"     │  "Compliance Storm"   │
                │                       │                       │
                └───────────────────────┴───────────────────────┘
```

### Scenario Details

```yaml
scenarios:
  - name: "Steady State"
    dimensions: "Volume: Low, Regulatory: Low"
    description: "Business as usual. Moderate growth, current compliance sufficient."
    risks_unique_to_scenario:
      - description: "Complacency - underinvestment in platform capabilities"
      - description: "Team stagnation - no challenging problems to solve"
    key_indicators: "Flat growth metrics, no new regulatory announcements"

  - name: "Data Explosion"
    dimensions: "Volume: High, Regulatory: Low"
    description: "Rapid data growth without regulatory constraint. Scale is the challenge."
    risks_unique_to_scenario:
      - description: "Scaling costs exceed budget"
      - description: "Pipeline bottlenecks under volume"
      - description: "Data quality degradation at scale"
      - description: "Team capacity insufficient for growth"
    key_indicators: "Volume growth >50%/year, infrastructure costs rising"

  - name: "Compliance Storm"
    dimensions: "Volume: Low, Regulatory: High"
    description: "Heavy compliance burden without scale to justify investment."
    risks_unique_to_scenario:
      - description: "Compliance overhead exceeds business value of data"
      - description: "Talent drain to larger companies with resources"
      - description: "Feature removal for compliance, reduced utility"
    key_indicators: "New regulations announced, audit requirements increasing"

  - name: "Perfect Storm"
    dimensions: "Volume: High, Regulatory: High"
    description: "Simultaneous scaling and compliance challenges. Maximum difficulty."
    risks_unique_to_scenario:
      - description: "Resource impossible - can't staff for both"
      - description: "Compliance at scale has multiplicative complexity"
      - description: "Time-to-market for features dramatically increased"
    key_indicators: "Both sets of indicators active simultaneously"

robust_risks:
  - description: "Key person dependency on data architect"
    scenarios_present: ["All four"]
    priority: Critical

  - description: "Vendor lock-in to cloud provider"
    scenarios_present: ["Data Explosion", "Perfect Storm", "Compliance Storm"]
    priority: High

current_plan_robustness:
  optimized_for: "Steady State with some Data Explosion preparation"
  vulnerable_in: "Compliance Storm, Perfect Storm"
  recommendations:
    - "Add compliance flexibility to architecture decisions"
    - "Build abstraction layers to reduce vendor lock-in"
    - "Document and cross-train to reduce key person risk"
```

## Scenario Indicators

For each scenario, define leading indicators:

| Scenario | Early Indicators (6-12 months out) |
|----------|-----------------------------------|
| **Steady State** | Flat growth projections, regulatory stability |
| **Data Explosion** | Rapid customer acquisition, new data sources announced |
| **Compliance Storm** | Draft regulations published, industry association warnings |
| **Perfect Storm** | Both indicator sets active |

Monitor these indicators to know which scenario is emerging.
