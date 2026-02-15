# #206 Compositional Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if individually feasible parts work together as a system

## Theoretical Foundation

Every component can be individually feasible while the whole is infeasible (compositional gap). Integration is where feasibility estimates most often fail.

**Key insight:** "Parts work" ≠ "System works." The gap between these is often larger than the effort to build the parts.

## Integration Complexity Drivers

| Driver | Issue |
|--------|-------|
| **Data format mismatches** | Timestamps, encodings, schemas, null handling |
| **Timing assumptions** | Sync vs async, timeout expectations, ordering |
| **Error handling gaps** | What does A do when B fails? |
| **State management** | Who owns state? How is it synchronized? |
| **Version coupling** | Must components be deployed together? |

## Step-by-step

### Step 1: List All Components

Enumerate everything that must integrate:
- Internal components
- External services
- Data stores
- APIs
- User interfaces

### Step 2: Map Interfaces

For each pair of components that interact:

```
┌─────────────┐         ┌─────────────┐
│ Component A │────────▶│ Component B │
└─────────────┘         └─────────────┘
       │
       ▼
  Interface Definition:
  • Protocol: REST/gRPC/Kafka/etc.
  • Data format: JSON/Avro/Parquet
  • Contract: Schema defined?
  • Error handling: Specified?
```

### Step 3: Assess Each Interface

| Interface | Defined | Tested | Precedent | Risk |
|-----------|---------|--------|-----------|------|
| Ingest → Transform | Yes | Yes | Internal | Low |
| Transform → Synapse | Partial | No | None | High |
| Pipeline → Mars ERP | Spec only | No | Vendor doc | Medium |

### Step 4: Identify Integration Complexity

For each high-risk interface:

```
Interface: Transform → Synapse

Complexity drivers:
□ Data format: Delta → Synapse SQL format
□ Timing: Batch vs streaming expectations
□ Error handling: What if Synapse is slow?
□ State: Synapse serverless = stateless
□ Versioning: Delta versions vs Synapse queries

Assessment: HIGH complexity
Reason: No internal precedent, format conversion needed
```

### Step 5: Estimate Integration Effort

| Situation | Integration as % of Total |
|-----------|--------------------------|
| Well-defined interfaces, existing precedent | 15-20% |
| Partially defined interfaces, partial precedent | 30-40% |
| Undefined interfaces, no precedent | 50-70% |

### Step 6: Ship of Theseus Test

If incremental migration:
- Is each step feasible?
- Does accumulated change remain coherent?
- At what point is it a "different system"?

```
Migration steps:
1. Add ingestion (system still works) ✓
2. Add transformation (system still works) ✓
3. Switch to Delta Lake (breaking change!) ⚠
4. Add Synapse reporting (new capability) ✓
5. Decommission old (point of no return) ⚠
```

### Step 7: Score Compositional Feasibility

| Score | Criteria |
|-------|----------|
| 5 | All interfaces defined, tested, precedented |
| 4 | Most interfaces defined, minor gaps |
| 3 | Significant interface gaps, integration uncertain |
| 2 | Major interface unknowns, high integration risk |
| 1 | No clear integration path, composition likely to fail |

## Output format

```yaml
compositional_feasibility:
  score: 3
  confidence: "M"

  components:
    - name: "Data Ingestion"
      owner: "Lingaro DE"
      status: "Defined"
    - name: "Transformation"
      owner: "Lingaro DE"
      status: "Defined"
    - name: "Delta Lake Storage"
      owner: "Lingaro Platform"
      status: "Defined"
    - name: "Synapse Reporting"
      owner: "Lingaro Platform"
      status: "Partial"
    - name: "Mars ERP Source"
      owner: "Mars IT"
      status: "Spec only"

  interfaces:
    - from: "Ingestion"
      to: "Transformation"
      protocol: "Delta Lake"
      defined: true
      tested: true
      precedent: "Internal"
      risk: "Low"

    - from: "Transformation"
      to: "Synapse"
      protocol: "Delta Sharing / Direct query"
      defined: "Partial"
      tested: false
      precedent: "None"
      risk: "High"
      complexity_drivers:
        - "Format conversion Delta → SQL"
        - "Serverless timeout handling"
        - "Query performance at scale"

    - from: "Mars ERP"
      to: "Ingestion"
      protocol: "API / File drop"
      defined: "Spec only"
      tested: false
      precedent: "Vendor documentation"
      risk: "Medium"
      complexity_drivers:
        - "Data format validation"
        - "Error handling for source issues"

  integration_effort:
    estimate_percentage: 35
    basis: "Partially defined interfaces, partial precedent"
    high_risk_interfaces: 2
    effort_breakdown:
      - interface: "Transform → Synapse"
        effort: "3 weeks"
        risk: "High"
      - interface: "Mars ERP → Ingest"
        effort: "2 weeks"
        risk: "Medium"

  ship_of_theseus:
    migration_type: "Greenfield with integration"
    coherence_risk: "Low — new system"

  recommendations:
    - "Run integration spike (#306) on Transform → Synapse"
    - "Validate Mars ERP interface with sample data early"
    - "Define error handling contracts before building"
```

## Integration Points

- **Feeds from:** Architecture design, #106 Precedent check
- **Feeds to:** #401 Overall profile, #306 Integration spike, #205 Temporal (integration time)

## Common Pitfalls

- **Component-focused planning:** "Parts are done" when integration isn't started
- **Undefined error handling:** Happy path works, errors cause cascading failures
- **Timing assumptions:** Async vs sync, batching expectations
- **Underestimated integration time:** Often 30-50% of total effort
