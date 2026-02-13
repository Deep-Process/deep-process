# #203 Knowledge Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if the team knows HOW to do this

## Theoretical Foundation

Knowledge feasibility is distinct from resource feasibility — you can have enough people but not enough knowledge.

**Key insight:** Dunning-Kruger effect means low knowledge + high confidence is a danger zone. Seek external validation for these areas.

## Knowledge Types

| Type | Question | If Missing |
|------|----------|------------|
| **Domain** | Do we understand the business? | Hire expert, consult client, study |
| **Technical** | Do we know the technologies? | Train, hire, consultant |
| **Architectural** | Do we know how to design at this scale? | Senior architect, reference architecture |
| **Procedural** | Do we know the processes? | Document, train, automate |
| **Tacit** | Is there undocumented knowledge needed? | Pairing, mentoring, risk acceptance |

## Step-by-step

### Step 1: Identify Knowledge Requirements

For each sub-component (#002), what knowledge is needed?

```
DOMAIN KNOWLEDGE:
□ Business domain (EPR regulations, packaging data)
□ Client-specific processes
□ Regulatory requirements

TECHNICAL KNOWLEDGE:
□ Platform (Databricks, Azure)
□ Languages (Python, SQL, Spark)
□ Tools (Terraform, CI/CD)

ARCHITECTURAL KNOWLEDGE:
□ Design patterns for this scale
□ Integration patterns
□ Data modeling

PROCEDURAL KNOWLEDGE:
□ Development process
□ Testing approach
□ Deployment procedures

TACIT KNOWLEDGE:
□ Tribal knowledge about legacy systems
□ Undocumented client preferences
□ Historical context
```

### Step 2: Assess Current Knowledge

For each area, rate team knowledge:

| Level | Description |
|-------|-------------|
| **Strong** | Team can execute independently |
| **Moderate** | Team can execute with some guidance |
| **Basic** | Team has familiarity, needs significant support |
| **None** | Team has no relevant knowledge |

### Step 3: Dunning-Kruger Check

For each knowledge area:

| Area | Expertise Level | Confidence Level | Zone |
|------|-----------------|------------------|------|
| Databricks | Strong | High | ✓ Calibrated |
| EPR regulations | None | Medium | ⚠ DK Alert |
| Synapse | Basic | High | ⚠ DK Alert |

**DK Alert:** Low expertise + High confidence = unreliable assessments

### Step 4: Assess Acquisition Path

For each gap:

| Gap | Acquisition Method | Time | Feasible? |
|-----|-------------------|------|-----------|
| EPR regulations | Hire consultant | 2 weeks | Yes |
| Synapse deep skills | Training + practice | 4 weeks | Yes |
| Mars data model | KT from client | 1 week | Dependent on client |

**Tacit knowledge warning:** Cannot be transferred by documentation — requires pairing, mentoring, or hiring someone who has it.

### Step 5: Score Knowledge Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Team has all required knowledge |
| 4 | Minor gaps, easily acquired |
| 3 | Significant gaps, acquirable with effort |
| 2 | Major gaps, acquisition uncertain |
| 1 | Critical knowledge missing, no acquisition path |

## Output format

```yaml
knowledge_feasibility:
  score: 4
  confidence: "M"

  requirements:
    domain:
      - area: "EPR regulations"
        required: true
        present: false
        level: "None"
        acquisition: "Consultant"
        time: "2 weeks"

      - area: "Mars business processes"
        required: true
        present: false
        level: "Basic"
        acquisition: "Knowledge transfer from Mars"
        time: "1 week"

    technical:
      - area: "Databricks/Spark"
        required: true
        present: true
        level: "Strong"

      - area: "Synapse"
        required: true
        present: true
        level: "Basic"
        acquisition: "Training + practice"
        time: "3 weeks"

      - area: "Terraform"
        required: true
        present: true
        level: "Strong"

    architectural:
      - area: "Data pipeline design"
        required: true
        present: true
        level: "Strong"

    tacit:
      - area: "Mars legacy data quirks"
        required: true
        present: false
        level: "None"
        acquisition: "Pairing with Mars IT"
        time: "Ongoing"
        risk: "May surface issues late"

  dunning_kruger_zones:
    - area: "Synapse optimization"
      expertise: "Basic"
      confidence: "High"
      action: "Require external review of Synapse design"
      validation: "Consultant review before implementation"

  gaps:
    - area: "EPR regulations"
      criticality: "High"
      closure_method: "Hire regulatory consultant"
      closure_time: "2 weeks"
      closure_feasible: true

    - area: "Mars data model"
      criticality: "Medium"
      closure_method: "KT sessions with Mars IT"
      closure_time: "1 week"
      closure_feasible: true
      dependency: "Mars availability"

  summary:
    total_areas: 8
    gaps: 3
    closable_gaps: 3
    dk_zones: 1
    tacit_knowledge_risk: "Medium — Mars legacy data"
```

## Integration Points

- **Feeds from:** #002 Sub-questions, #102 Variety audit
- **Feeds to:** #401 Overall profile, conditions list, #504 DK map

## Common Pitfalls

- **Confusing familiarity with expertise:** "I've heard of it" ≠ "I can do it"
- **Underestimating tacit knowledge:** Can't document everything
- **Dunning-Kruger blindness:** Confident in areas with least expertise
- **Optimistic learning curves:** "We'll pick it up quickly"
