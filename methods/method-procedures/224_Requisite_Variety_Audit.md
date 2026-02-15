# #102 Requisite Variety Audit

**Phase:** 1 (CONSTRAIN)
**Tier:** 1 — Mandatory
**Purpose:** Measure whether team/tools/process have enough variety to control problem complexity

## Theoretical Foundation

Based on Ashby's Law of Requisite Variety (1956): A controller must have AT LEAST as many response options as the system it controls has disturbance types.

**Key insight:** If problem has N dimensions of complexity and your team/tools cover M < N, control is **fundamentally impossible**. Not hard — impossible.

## What to do

1. Enumerate all problem dimensions (complexity axes)
2. Enumerate team variety (capabilities and responses)
3. Compare — identify gaps
4. Determine if gaps are closable within constraints

## The Variety Equation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ASHBY'S LAW OF REQUISITE VARIETY                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Required: Variety(Controller) ≥ Variety(System)                            │
│                                                                              │
│  Translation for projects:                                                  │
│  Team capabilities must match or exceed problem complexity dimensions       │
│                                                                              │
│  If gap exists:                                                             │
│  • Acquire missing variety (hire, train, outsource)                         │
│  • OR reduce problem complexity (simplify, descope)                         │
│  • OR accept that control is impossible (project will fail)                 │
│                                                                              │
│  Variety Gap = Problem Dimensions - Team Capabilities                       │
│  If Gap > 0 → Project is INFEASIBLE without intervention                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Enumerate Problem Dimensions

List every independent axis of complexity:

```
TECHNOLOGY DIMENSIONS:
□ Languages (Python, SQL, Scala)
□ Platforms (Databricks, Azure, Synapse)
□ Services (Storage, Compute, Networking)
□ Tools (Terraform, CI/CD, Monitoring)

DOMAIN DIMENSIONS:
□ Business domain (EPR regulations, packaging data)
□ Data domain (schemas, quality rules, transformations)
□ Regulatory domain (compliance requirements)

INTEGRATION DIMENSIONS:
□ APIs (Mars ERP, Synapse, external services)
□ Data formats (JSON, Parquet, Delta)
□ Organizations (internal teams, partners, vendors)

OPERATIONAL DIMENSIONS:
□ Failure modes to handle
□ Scale variations
□ Security requirements
□ Performance requirements

STAKEHOLDER DIMENSIONS:
□ Different user groups
□ Different approval authorities
□ Different success criteria
```

### Step 2: Enumerate Team Variety

List response capabilities:

```
SKILLS PRESENT:
□ List each skill and level (strong/moderate/basic/absent)

TOOLS AVAILABLE:
□ List tools team can use effectively

DECISION AUTHORITY:
□ What can team decide without escalation?

TIME FOR LEARNING:
□ How much time available to acquire new skills?

ACCESS TO EXPERTISE:
□ Can we bring in specialists if needed?
□ Consultants available?
□ Partner expertise?
```

### Step 3: Compare and Identify Gaps

For each problem dimension:

| Dimension | Required | Available | Gap | Closable? |
|-----------|----------|-----------|-----|-----------|
| Databricks | Yes | Strong | None | ✓ |
| Synapse | Yes | Basic | Moderate | ? |
| EPR regulations | Yes | None | Critical | ? |
| Mars data model | Yes | Basic | Moderate | ✓ |
| Terraform | Yes | Strong | None | ✓ |

### Step 4: Assess Gap Closure

For each gap:

| Gap | Closure Method | Time | Cost | Feasible? |
|-----|---------------|------|------|-----------|
| Synapse expertise | Training | 3 weeks | $5K | Yes |
| EPR regulations | Hire consultant | 2 weeks | $15K | Yes |
| Mars data model | Knowledge transfer | 1 week | - | Yes |

### Step 5: Calculate Net Feasibility

```
Total problem dimensions: 15
Team capabilities: 12
Raw gap: 3

Gap closure:
• Synapse: Closable with training (3 weeks)
• EPR: Closable with consultant ($15K)
• Mars data: Closable with KT (1 week)

Net gap after closure: 0
Assessment: CONDITIONALLY FEASIBLE
Conditions: Training + consultant + KT must happen
```

## Output format

```yaml
variety_audit:
  problem_dimensions:
    - dimension: "Databricks platform"
      category: "Technology"
      required: true
      complexity: "High"

    - dimension: "EPR regulations"
      category: "Domain"
      required: true
      complexity: "High"

    - dimension: "Synapse optimization"
      category: "Technology"
      required: true
      complexity: "Medium"

  team_capabilities:
    - capability: "Databricks"
      level: "Strong"
      coverage: "Full"

    - capability: "Python/PySpark"
      level: "Strong"
      coverage: "Full"

    - capability: "EPR regulations"
      level: "None"
      coverage: "Gap"

    - capability: "Synapse"
      level: "Basic"
      coverage: "Partial"

  variety_gap:
    - dimension: "EPR regulations"
      gap_type: "Missing"
      closure_method: "Hire regulatory consultant"
      closure_time: "2 weeks to onboard"
      closure_cost: "$15,000"
      closable: true

    - dimension: "Synapse expertise"
      gap_type: "Partial"
      closure_method: "Training + documentation study"
      closure_time: "3 weeks"
      closure_cost: "$5,000"
      closable: true

  summary:
    total_dimensions: 15
    covered: 12
    gaps: 3
    closable_gaps: 3
    net_gap: 0

  feasibility_assessment: "CONDITIONAL"
  conditions:
    - "EPR consultant engaged by Week 2"
    - "Synapse training completed by Week 4"
```

## Integration Points

- **Feeds from:** #001 Domain classification, #003 Scope definition
- **Feeds to:** #203 Knowledge Feasibility, #202 Resource Feasibility, conditions list

## Common Pitfalls

- **Underestimating problem variety:** Missing hidden complexity dimensions
- **Overestimating team variety:** "We can figure it out" without specific skills
- **Ignoring tacit knowledge:** Domain expertise that can't be quickly acquired
- **Optimistic gap closure:** "We'll learn Synapse in a week" when it takes months
