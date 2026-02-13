# #106 Precedent Existence Check

**Phase:** 1 (CONSTRAIN)
**Tier:** 1 — Mandatory
**Purpose:** Has anyone done something substantially similar before?

## Theoretical Foundation

Existence of precedent is strong evidence of feasibility. Absence of precedent is a WARNING — not proof of infeasibility, but reason for deeper investigation.

**Key insight:** "Novel combination without precedent" is where feasibility estimates most often fail. Each part feasible ≠ combination feasible.

## What to do

1. Define the core capability/outcome being assessed
2. Search for precedents (same domain, adjacent, analogous)
3. Classify precedent type and evidence strength
4. Compare context to assess transferability

## Precedent Types

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRECEDENT CLASSIFICATION                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DIRECT PRECEDENT                                                           │
│  Someone did essentially this                                               │
│  Same domain, same technology, similar scale                                │
│  Evidence strength: STRONG                                                  │
│  Example: "Company X built Delta Lake pipeline for regulatory reporting"    │
│                                                                              │
│  ANALOGOUS PRECEDENT                                                        │
│  Someone did something structurally similar in different domain             │
│  Same patterns, different context                                           │
│  Evidence strength: MODERATE                                                │
│  Example: "Similar architecture used for financial reporting"               │
│                                                                              │
│  PARTIAL PRECEDENT                                                          │
│  Parts exist but combination is novel                                       │
│  Each component has precedent, integration doesn't                          │
│  Evidence strength: UNCERTAIN                                               │
│  Example: "Databricks has precedent, Synapse has precedent, combo is new"   │
│                                                                              │
│  NO PRECEDENT                                                               │
│  Nobody has done this                                                       │
│  Evidence strength: WARNING                                                 │
│  → Not impossible, but investigate deeply                                   │
│  → Consider: Why hasn't anyone done this?                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Define Core Capability

What is the essential thing being done?

```
Bad: "Build a data platform"
Good: "Build a Delta Lake pipeline that ingests from SAP, transforms
      per EPR regulations, and feeds Synapse for regulatory reporting"
```

### Step 2: Search for Precedents

Search in:
- Same domain (other EPR reporting systems)
- Adjacent domains (other regulatory reporting)
- Same technology stack (Databricks + Synapse implementations)
- Company history (similar projects done before)
- Industry case studies
- Vendor references

### Step 3: Classify Each Precedent

| Precedent | Type | Context Match | Evidence |
|-----------|------|---------------|----------|
| Company X Delta Lake | Direct | Same tech, similar scale | Strong |
| Financial reporting pipeline | Analogous | Similar pattern, different domain | Moderate |
| Databricks case study | Partial | Same platform, different use case | Limited |

### Step 4: Assess Context Similarity

For each precedent, compare:

| Factor | Precedent | Our Project | Match |
|--------|-----------|-------------|-------|
| Team size | 5 | 4 | Similar |
| Timeline | 6 months | 4 months | Tighter |
| Complexity | Medium | Medium-High | Similar |
| Technology | Databricks 10.x | Databricks 13.x | Newer |
| Regulatory | SOX | EPR | Different |

### Step 5: Draw Conclusions

| Precedent Status | Conclusion | Action |
|-----------------|------------|--------|
| Direct exists | Feasibility evidence strong | Proceed with confidence |
| Analogous exists | Feasibility evidence moderate | Verify transfer applies |
| Partial only | Composition is key question | Focus on #206 |
| None exists | WARNING | Investigate why, consider probing |

## Output format

```yaml
precedent_check:
  capability_defined: |
    "Delta Lake pipeline for EPR packaging data reporting,
    ingesting from Mars ERP, transforming per EU regulations,
    feeding Synapse for compliance dashboards"

  precedents:
    - description: "Company X Delta Lake regulatory pipeline"
      type: "Direct"
      domain: "Regulatory reporting (SOX)"
      technology: "Databricks + Synapse"
      scale: "Similar (50M records/day)"
      context:
        team_size: 5
        timeline: "6 months"
        budget: "$600K"
      our_comparison:
        team_size: "4 (smaller)"
        timeline: "4 months (shorter)"
        budget: "$500K (similar)"
      evidence_strength: "Strong"
      transferability: "High — similar tech, different regulation"

    - description: "Internal: Financial reporting pipeline"
      type: "Analogous"
      domain: "Financial reporting"
      technology: "Databricks (no Synapse)"
      scale: "Larger (100M records/day)"
      evidence_strength: "Moderate"
      transferability: "Partial — Databricks transfers, Synapse is new"

    - description: "Databricks + Synapse vendor case study"
      type: "Partial"
      domain: "Generic analytics"
      technology: "Same stack"
      evidence_strength: "Limited"
      transferability: "Pattern only, not domain-specific"

  novel_combination_alert:
    triggered: true
    components_with_precedent:
      - "Databricks ingestion and transformation"
      - "Delta Lake storage"
      - "Synapse reporting"
    novel_aspects:
      - "EPR-specific transformation rules"
      - "Specific Databricks-Synapse integration pattern"
      - "Mars data format handling"

  conclusion:
    precedent_type: "Partial"
    evidence_strength: "Moderate"
    key_uncertainty: "Composition of Databricks + Synapse for EPR"
    recommendation: "Focus validation on integration (#306 spike) and EPR rules"

  feasibility_evidence:
    score_adjustment: 0  # Partial precedent = neutral
    confidence_impact: "Medium — validate integration specifically"
```

## Integration Points

- **Feeds from:** #003 Scope definition
- **Feeds to:** #206 Compositional Feasibility, #305 Analogical Transfer, #301 Reference Class

## Common Pitfalls

- **Surface-level matching:** "They used Databricks too" without checking context
- **Ignoring novel combination:** Each part has precedent but combination doesn't
- **Survivorship bias:** Only seeing successful precedents, not failures
- **Underweighting "no precedent":** If no one's done it, ask WHY
- **Overweighting vendor case studies:** Often best-case scenarios, not typical
