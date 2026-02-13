# #204 Organizational Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if the organization can execute this

## Theoretical Foundation

Not just "do we have people" but "can our org structure, processes, culture, and decision-making support this?"

**Key insight:** Organizational debt is like technical debt — accumulated dysfunction that taxes every project.

## Organizational Dimensions

| Dimension | Question |
|-----------|----------|
| **Decision authority** | Can necessary decisions be made by people on the project? |
| **Cross-team coordination** | Does this require coordinated effort across teams? How well do they coordinate? |
| **Conway alignment** | Does org structure match required architecture? (from #104) |
| **Culture fit** | Does the approach align with org culture? |
| **Change capacity** | How much change is the org already absorbing? |
| **Stakeholder alignment** | Are key stakeholders aligned on goals and approach? |
| **Political feasibility** | Are there political dynamics that could block execution? |

## Step-by-step

### Step 1: Assess Decision Authority

```
DECISIONS NEEDED:
□ Technical architecture decisions
□ Budget allocation decisions
□ Scope change decisions
□ Vendor/tool selection
□ Timeline adjustments
□ Resource allocation

FOR EACH:
□ Who has authority?
□ How long does approval take?
□ What escalation is needed?
```

| Decision Type | Authority | Approval Time | On Project? |
|--------------|-----------|---------------|-------------|
| Technical choices | Tech Lead | Immediate | ✓ Yes |
| Budget changes | Sponsor | 1 week | ✗ No |
| Scope changes | Steering Committee | 2 weeks | ✗ No |

### Step 2: Assess Cross-Team Coordination

```
TEAMS INVOLVED:
□ List all teams that must coordinate
□ Current coordination mechanisms
□ Historical coordination effectiveness
```

| Teams | Mechanism | Effectiveness | Issues |
|-------|-----------|---------------|--------|
| Data Eng + Platform | Daily standup | High | None |
| Lingaro + Mars IT | Monthly review | Low | Infrequent |
| Lingaro + Mars Business | Weekly call | Medium | Time zones |

### Step 3: Assess Culture Fit

```
PROJECT APPROACH vs ORG CULTURE:
□ Agile in waterfall org?
□ Data mesh in centralized org?
□ DevOps in siloed org?
□ Experimentation in risk-averse org?
```

| Approach | Culture | Fit | Mitigation |
|----------|---------|-----|------------|
| Agile sprints | Mars: Waterfall | Poor | Adapt reporting to waterfall cadence |
| Self-service data | Lingaro: Centralized | Good | N/A |

### Step 4: Assess Change Capacity

```
CURRENT ORGANIZATIONAL LOAD:
□ Other major initiatives underway
□ Recent reorganizations
□ Upcoming changes (mergers, leadership)
□ General stress level
```

| Factor | Status | Impact |
|--------|--------|--------|
| Other initiatives | 2 major projects | Competing for attention |
| Recent reorg | 6 months ago | Settled |
| Upcoming changes | None known | Low risk |

### Step 5: Assess Stakeholder Alignment

```
KEY STAKEHOLDERS:
□ Sponsor: Aligned on goals?
□ Users: Supportive of change?
□ IT: Willing to support?
□ Compliance: Engaged?
```

| Stakeholder | Aligned | Concerns | Engagement |
|-------------|---------|----------|------------|
| Sponsor | Yes | Budget | Active |
| Mars IT | Partial | Integration effort | Passive |
| Compliance | Yes | None | Consulting |

### Step 6: Score Organizational Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Full alignment, strong support, appropriate authority |
| 4 | Minor misalignments, manageable |
| 3 | Significant coordination challenges, partial alignment |
| 2 | Major organizational barriers, stakeholder conflicts |
| 1 | Structural impediments, political opposition |

## Output format

```yaml
organizational_feasibility:
  score: 3
  confidence: "L"

  decision_authority:
    - type: "Technical decisions"
      holder: "Tech Lead (on project)"
      approval_time: "Immediate"
      adequate: true

    - type: "Budget changes"
      holder: "Project Sponsor"
      approval_time: "1 week"
      adequate: true

    - type: "Scope changes >10%"
      holder: "Steering Committee"
      approval_time: "2 weeks"
      adequate: false
      risk: "Slow response to change requests"

  cross_team:
    teams_involved: 4
    coordination_quality:
      - teams: ["Lingaro DE", "Lingaro Platform"]
        mechanism: "Daily standup"
        effectiveness: "High"
      - teams: ["Lingaro", "Mars IT"]
        mechanism: "Monthly review"
        effectiveness: "Low"
        improvement_needed: "Weekly sync required"

  culture_fit:
    approach: "Agile sprints"
    org_culture: "Mixed — Lingaro agile, Mars waterfall"
    fit: "Partial"
    mitigation: "Translate deliverables to waterfall milestones for Mars"

  change_capacity:
    current_load: "Medium — 2 other initiatives"
    capacity_for_this: "Adequate"
    risk: "Attention competition during peak periods"

  stakeholder_alignment:
    sponsor:
      aligned: true
      engagement: "Active"
      concerns: ["Budget control", "Timeline"]
    mars_it:
      aligned: "Partial"
      engagement: "Passive"
      concerns: ["Integration effort", "Support burden"]
    compliance:
      aligned: true
      engagement: "Consulting"

  political_factors:
    supporters: ["Sponsor", "Compliance lead"]
    blockers: []
    neutral: ["Mars IT"]

  summary:
    strengths:
      - "Sponsor support"
      - "Internal team coordination"
    weaknesses:
      - "Cross-org coordination (Lingaro-Mars)"
      - "Scope change approval delay"
    conditions:
      - "Establish weekly Lingaro-Mars sync"
      - "Pre-negotiate scope change authority"
```

## Integration Points

- **Feeds from:** #104 Conway check, stakeholder analysis
- **Feeds to:** #401 Overall profile, conditions list

## Common Pitfalls

- **Ignoring informal power:** Formal org chart ≠ actual influence
- **Assuming alignment:** "Everyone wants this to succeed"
- **Underestimating culture:** Culture eats strategy for breakfast
- **Overlooking change fatigue:** Organizations have limited change capacity
