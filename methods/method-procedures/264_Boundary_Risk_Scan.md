# 108 - Boundary Risk Scan

## Phase
IDENTIFY (Horizontal)

## Purpose
Systematically identify risks that live AT BOUNDARIES between components, teams, phases, or organizations. These risks are invisible to vertical analysis because each side assumes the other handles them.

## Boundary Types

| Boundary | Where Risks Hide | Example |
|----------|-----------------|---------|
| **Component interfaces** | API contracts, data format assumptions, error handling | Service A expects JSON, Service B sends XML |
| **Team handoffs** | Responsibility gaps, assumption mismatches, communication | "I thought you were doing validation" |
| **Phase transitions** | Dev->QA->Prod, design->implementation, POC->production | Works in dev, fails in prod |
| **Organizational edges** | Client<->vendor, team<->team, company<->regulator | Contract ambiguity |
| **Temporal boundaries** | Shift changes, sprint boundaries, fiscal year transitions | Handoff at midnight, weekend coverage |
| **Trust boundaries** | Internal<->external, authenticated<->anonymous, secure<->insecure | Trust assumption violated |

## The Handoff Triad

For each boundary, apply these three questions:

1. **What does Side A ASSUME Side B provides?**
   - Format, quality, timing, error handling

2. **What does Side B ASSUME Side A has done?**
   - Validation, authorization, completeness

3. **Are these assumptions WRITTEN DOWN and AGREED?**
   - Verbal = risk
   - Documented = less risk
   - Tested = even less risk

## Procedure

### Step 1: Boundary Mapping
Map ALL boundaries in the system/project.
- Draw them explicitly
- Don't assume any boundary is "obvious"

### Step 2: Apply Handoff Triad
For each boundary, answer the three questions.

### Step 3: Identify Mismatches
Where assumptions don't match = **boundary risk**

### Step 4: Identify Latent Risks
Where assumptions aren't documented = **latent boundary risk**
(Will surface under stress)

### Step 5: Document Context
For each boundary risk:
- Why did this mismatch occur?
- What would make it visible before production?

## Why Vertical Methods Miss This

Failure Mode Enumeration (#102) asks "how can THIS component fail?"

But many failures aren't IN components - they're BETWEEN them:
- Component A works perfectly
- Component B works perfectly
- A->B fails because A outputs ISO dates and B expects Unix timestamps
- Neither component "failed"

## Output Schema
```yaml
boundary_risks:
  - boundary_type: "[Component|Team|Phase|Organization|Temporal|Trust]"
    boundary_location: "Where this boundary exists"
    side_a: "First side of boundary"
    side_b: "Second side of boundary"
    side_a_assumption: "What A assumes about B"
    side_b_assumption: "What B assumes about A"
    mismatch: "How the assumptions conflict"
    documented: "[Yes|No|Partial]"
    documentation_location: "Where contract is written (if exists)"
    risk_description: "What can go wrong"
    discovery_scenario: "When this would be discovered"
```

## Quality Checks
- [ ] All boundary types examined
- [ ] Boundaries explicitly drawn/mapped
- [ ] Handoff Triad applied to each
- [ ] Mismatches identified
- [ ] Documentation status verified

## Connections
- Feeds into: #201 (detectability score), #303 (common mode at boundaries)
- Uses output from: Architecture diagrams, team structure
- Related to: #001 (Boundary genesis), #102 (failure modes)

## Examples

### Component Interface Boundary
```yaml
boundary_type: Component
boundary_location: "Databricks pipeline -> Synapse Serverless SQL"
side_a: "Databricks Delta writer"
side_b: "Synapse SQL queries"

side_a_assumption: "Delta tables are always available for Synapse to query"
side_b_assumption: "Queries will complete within serverless timeout"

mismatch: "Large Delta tables with many small files -> Synapse serverless times out"
documented: No
documentation_location: N/A

risk_description: "Silent query timeout -> stale dashboard -> wrong business decisions"
discovery_scenario: "Production with real data volumes, not caught in dev/test"
```

### Team Handoff Boundary
```yaml
boundary_type: Team
boundary_location: "Data Engineering Team -> Analytics Team"
side_a: "Data Engineering"
side_b: "Analytics"

side_a_assumption: "We provide the data, they handle data quality issues"
side_b_assumption: "They validate data before we receive it"

mismatch: "No one is doing data validation"
documented: No
documentation_location: N/A

risk_description: "Data quality issues propagate to reports, discovered by client"
discovery_scenario: "First major data anomaly in production"
```

### Phase Transition Boundary
```yaml
boundary_type: Phase
boundary_location: "Development -> Production"
side_a: "Development environment"
side_b: "Production environment"

side_a_assumption: "If it works in dev with sample data, it works"
side_b_assumption: "Dev tested with production-like data volumes"

mismatch: "Dev uses 1% sample, production has 100x data and different distribution"
documented: Partial (mentioned in test plan but not enforced)
documentation_location: "Test plan v2.3"

risk_description: "Performance issues, edge cases, memory errors in production only"
discovery_scenario: "Go-live day, first full data load"
```

### Trust Boundary
```yaml
boundary_type: Trust
boundary_location: "Internal API -> External Partner API"
side_a: "Our internal service"
side_b: "Partner's external API"

side_a_assumption: "Partner API validates and sanitizes their data"
side_b_assumption: "We're sending validated requests"

mismatch: "Neither side validates the boundary crossing"
documented: No (SLA exists but no data contract)
documentation_location: N/A

risk_description: "Injection attacks, malformed data, security breach"
discovery_scenario: "Security audit or actual incident"
```

## Common Boundary Risk Patterns

1. **"I thought you were doing it"** - Responsibility gap
2. **"Works on my machine"** - Environment boundary
3. **"The contract says X, but the implementation does Y"** - Specification drift
4. **"We never agreed on error handling"** - Exception path undefined
5. **"The time zone conversion happens... somewhere"** - Implicit transformation
6. **"SSL handles security"** - Trust assumption in wrong layer
