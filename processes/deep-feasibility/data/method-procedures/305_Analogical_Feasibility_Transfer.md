# #305 Analogical Feasibility Transfer

**Phase:** 3 (VALIDATE)
**Tier:** 2 — Recommended
**Purpose:** Transfer feasibility insights from similar past projects

## Theoretical Foundation

Projects are rarely truly unique. Analogical reasoning transfers feasibility insights from similar past projects, adjusting for key differences. This grounds assessment in evidence rather than speculation.

**Key insight:** "This is different" is usually wrong. Most projects share 80%+ characteristics with past projects. Finding the right analogue dramatically improves feasibility estimates.

## Analogy Strength

| Strength | Criteria | Transfer Confidence |
|----------|----------|---------------------|
| **Strong** | Same domain, same tech, same team | High |
| **Moderate** | Similar domain OR similar tech, comparable team | Medium |
| **Weak** | Different domain AND tech, lessons still apply | Low |
| **None** | Truly unprecedented, no useful analogues | Very Low |

## Step-by-step

### Step 1: Characterize Current Project

Define the key characteristics for matching:

```
PROJECT CHARACTERISTICS:

Domain: Data engineering
Type: Data pipeline / ETL
Scale: 100M+ records
Technology: Azure Databricks, Delta Lake, Synapse
Team: 4 engineers, 1 architect
Duration: 6-12 months
Complexity: Medium-High
Integration: External APIs, cloud services
Stakeholders: Multiple business units
```

### Step 2: Search for Analogues

Find past projects with similar characteristics:

```
ANALOGUE SEARCH:

Internal projects:
□ Project Alpha — Data pipeline, Azure, 50M records (2022)
□ Project Beta — Databricks implementation, different domain (2023)
□ Project Gamma — External API integration, different tech (2021)

External references:
□ Industry case study — Similar EPR implementation
□ Vendor reference — Databricks scale implementation
□ Competitor analysis — Known similar initiative
```

### Step 3: Score Analogue Similarity

| Dimension | Current | Analogue A | Analogue B | Analogue C |
|-----------|---------|------------|------------|------------|
| Domain | Data eng | Data eng ✓ | Data eng ✓ | Different |
| Tech stack | Azure/DB | Azure/DB ✓ | Azure ✓ | Different |
| Scale | 100M | 50M ~ | 200M ✓ | 20M |
| Team size | 5 | 4 ✓ | 8 | 3 ✓ |
| Duration | 9 mo | 6 mo | 12 mo ✓ | 4 mo |
| **Similarity** | — | **75%** | **70%** | **40%** |

### Step 4: Extract Feasibility Lessons

From each strong analogue:

```
ANALOGUE A: Project Alpha

What was feasible:
- Azure Databricks at 50M scale
- Delta Lake integration
- Basic ETL patterns

What wasn't feasible:
- Original 4-month timeline (took 6)
- Initial storage architecture (redesigned)
- Team learning curve was underestimated

What changed:
- Added 1 month for architecture rework
- Brought in Databricks specialist
- Simplified initial scope

Transferable lessons:
→ Timeline likely underestimated
→ Architecture may need revision
→ Team needs ramp-up time
```

### Step 5: Adjust for Differences

For each transferable lesson, adjust for context differences:

```
LESSON: Timeline underestimated by 50%

Analogue context:
- Team: First Databricks project
- Scale: 50M records
- Complexity: Medium

Current context:
- Team: Second Databricks project (experience +)
- Scale: 100M records (scale -)
- Complexity: Medium-High (complexity -)

Adjustment:
- Experience reduces risk: -20%
- Higher scale increases risk: +30%
- Higher complexity increases risk: +20%

Net adjustment: +30% timeline risk vs analogue
Analogue overrun: 50%
Adjusted expectation: 65% timeline risk
```

### Step 6: Synthesize Transferred Insights

Combine insights from all analogues:

```
SYNTHESIS:

Timeline:
- Analogue A: 50% overrun
- Analogue B: 20% overrun
- Adjusted for differences: 40-60% overrun likely

Technical risk:
- Analogue A: Architecture rework needed
- Analogue B: Smooth (similar tech)
- Transfer: Moderate risk, plan for iteration

Team capacity:
- Analogue A: Learning curve 3 weeks
- Current: Some experience, expect 2 weeks
- Transfer: Reduced but non-zero ramp-up

Integration:
- Analogue A: External API issues (4 weeks delay)
- Transfer: HIGH risk for Mars API integration
```

### Step 7: Score Analogical Transfer Quality

| Score | Criteria |
|-------|----------|
| 5 | Strong analogues found, clear lessons, well-adjusted |
| 4 | Good analogues, useful lessons transferred |
| 3 | Moderate analogues, some lessons transferable |
| 2 | Weak analogues, limited transfer value |
| 1 | No useful analogues found, truly unprecedented |

## Output format

```yaml
analogical_feasibility_transfer:
  score: 4
  confidence: "M"

  current_project_profile:
    domain: "Data engineering"
    type: "Data pipeline / ETL"
    scale: "100M+ records"
    technology:
      - "Azure Databricks"
      - "Delta Lake"
      - "Synapse Serverless"
    team_size: 5
    duration_estimate: "9 months"
    complexity: "Medium-High"
    key_challenges:
      - "External API integration"
      - "Scale requirements"
      - "Multi-stakeholder coordination"

  analogues:
    - id: "ANALOGUE-A"
      name: "Project Alpha"
      date: "2022"

      similarity:
        overall: "75%"
        by_dimension:
          domain: "Match"
          technology: "Match"
          scale: "Partial (50M vs 100M)"
          team: "Match"
          duration: "Shorter (6 vs 9 months)"

      outcomes:
        planned_duration: "4 months"
        actual_duration: "6 months"
        overrun: "50%"
        technical_success: true
        key_issues:
          - "Architecture rework in month 3"
          - "Team learning curve longer than expected"
          - "Storage layer redesign"

      transferable_lessons:
        - lesson: "Timeline underestimation"
          analogue_evidence: "50% overrun"
          adjustment_for_current: "+30% (higher scale/complexity)"
          transferred_insight: "Expect 60-80% schedule risk"

        - lesson: "Architecture iteration"
          analogue_evidence: "Rework needed despite upfront design"
          adjustment_for_current: "Similar risk"
          transferred_insight: "Plan for architecture review at week 6"

        - lesson: "Team ramp-up"
          analogue_evidence: "3 weeks to productivity"
          adjustment_for_current: "-1 week (prior experience)"
          transferred_insight: "2 weeks ramp-up, plan accordingly"

    - id: "ANALOGUE-B"
      name: "Project Beta"
      date: "2023"

      similarity:
        overall: "70%"
        by_dimension:
          domain: "Match"
          technology: "Partial (same platform, different tools)"
          scale: "Higher (200M)"
          team: "Larger (8 vs 5)"
          duration: "Longer (12 months)"

      outcomes:
        planned_duration: "10 months"
        actual_duration: "12 months"
        overrun: "20%"
        technical_success: true
        key_issues:
          - "Scale issues at 150M threshold"
          - "Performance tuning took longer"

      transferable_lessons:
        - lesson: "Scale thresholds"
          analogue_evidence: "Problems emerged at 150M"
          adjustment_for_current: "Lower scale (100M)"
          transferred_insight: "May hit threshold, validate at 100M"

        - lesson: "Performance tuning"
          analogue_evidence: "2 months for tuning"
          adjustment_for_current: "Similar need expected"
          transferred_insight: "Budget 4-6 weeks for performance work"

  synthesis:
    timeline_risk:
      analogues_say: "40-50% average overrun"
      adjusted_for_current: "50-70% risk"
      recommendation: "Use 12-15 months, not 9"

    technical_risk:
      analogues_say: "Architecture iteration likely"
      adjusted_for_current: "Similar pattern expected"
      recommendation: "Plan review checkpoint at week 6"

    team_risk:
      analogues_say: "Learning curve 2-3 weeks"
      adjusted_for_current: "2 weeks with experience"
      recommendation: "Factor into sprint 1 planning"

    integration_risk:
      analogues_say: "External API issues common"
      adjusted_for_current: "Mars API is similar pattern"
      recommendation: "HIGH priority early validation"

  no_analogue_areas:
    - area: "Synapse Serverless at this scale"
      reason: "No prior internal experience"
      impact: "Technical risk less well-calibrated"
      mitigation: "Vendor consultation, spike testing"

  feasibility_adjustments:
    - dimension: "Temporal"
      before: 4
      after: 3
      reason: "Analogue evidence suggests timeline risk"

    - dimension: "Technical"
      before: 4
      after: 4
      reason: "Analogues support feasibility with caveats"

    - dimension: "Dependency"
      before: 3
      after: 2
      reason: "Analogues show external API risk"

  recommendations:
    - "Extend timeline estimate to 12-15 months"
    - "Add architecture review at week 6"
    - "Prioritize Mars API validation"
    - "Conduct Synapse spike (no analogue coverage)"
```

## Integration Points

- **Feeds from:** #106 Precedent Check, project history
- **Feeds to:** #401 Overall profile, #304 Expert calibration

## Common Pitfalls

- **"This time is different":** Dismissing analogues too readily
- **Cherry-picking:** Only using analogues that support desired conclusion
- **Ignoring differences:** Not adjusting for context changes
- **Single analogue:** Relying on one comparison
- **Success bias:** Only looking at successful analogues
