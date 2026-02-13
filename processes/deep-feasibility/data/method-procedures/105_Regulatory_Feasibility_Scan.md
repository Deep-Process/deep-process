# #105 Regulatory Feasibility Scan

**Phase:** 1 (CONSTRAIN)
**Tier:** 2 — Standard+ depths
**Purpose:** Determine whether the project is LEGALLY PERMITTED

## Theoretical Foundation

Regulatory constraints are often H5 — they cannot be overcome by effort. Brilliant technical execution of something illegal is worthless.

**Key insight:** Prohibited activity is a hard constraint. Check early to avoid wasted effort.

## What to do

1. Identify all regulatory jurisdictions that apply
2. Map activities to regulatory requirements
3. Check for regulatory contradictions between jurisdictions
4. Assess regulatory stability over project timeline

## Regulatory Mapping Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  REGULATORY STATUS CATEGORIES                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  REQUIRED                                                                   │
│  Activities mandated by regulation                                          │
│  Must do regardless of project preferences                                  │
│  Example: Data retention for 7 years (financial regulations)                │
│                                                                              │
│  PERMITTED                                                                  │
│  Activities allowed by regulation                                           │
│  No restrictions, proceed freely                                            │
│  Example: Processing anonymized data                                        │
│                                                                              │
│  RESTRICTED                                                                 │
│  Activities allowed under specific conditions                               │
│  Conditions must be met for feasibility                                     │
│  Example: Cross-border data transfer with SCCs                              │
│                                                                              │
│  PROHIBITED                                                                 │
│  Activities forbidden by regulation                                         │
│  → H5 CONSTRAINT — Cannot proceed on this path                              │
│  Example: Storing health data without consent                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Identify Jurisdictions

List all applicable regulatory frameworks:

```
GEOGRAPHIC:
□ EU (GDPR, EPR, country-specific)
□ US (federal, state-specific)
□ Other countries involved

INDUSTRY:
□ Financial (SOX, PCI-DSS)
□ Healthcare (HIPAA)
□ Energy (specific regulations)

DOMAIN-SPECIFIC:
□ Data protection (GDPR, CCPA)
□ Environmental (EPR)
□ Sector-specific
```

### Step 2: Map Activities to Regulations

For each project activity, determine regulatory status:

| Activity | Regulation | Status | Conditions |
|----------|------------|--------|------------|
| Collect packaging data | EPR | Required | Must report to authority |
| Store in EU | GDPR | Permitted | Standard controls |
| Transfer to US | GDPR | Restricted | SCCs required |
| Process without consent | GDPR | Prohibited | Cannot do |

### Step 3: Check for Contradictions

Look for conflicts between jurisdictions:

```
Example contradiction:
• EU requires: Data must be deletable on request (GDPR Art 17)
• Finance requires: Data must be retained for 7 years (audit)
• Resolution: Legal basis for retention overrides deletion right
```

| Jurisdiction A | Jurisdiction B | Conflict? | Resolution |
|----------------|----------------|-----------|------------|
| GDPR deletion | Audit retention | Yes | Legal basis exception |
| EU data residency | US processing | Yes | SCCs + EU compute |

### Step 4: Assess Regulatory Stability

Consider timeline risk:

| Regulation | Status | Change Risk | Impact if Changes |
|------------|--------|-------------|------------------|
| GDPR | Stable | Low | Minimal |
| EPR | Evolving | Medium | Reporting format may change |
| CBAM | New | High | May require additional data |

### Step 5: Determine Feasibility Impact

| Finding | Hardness | Feasibility Impact |
|---------|----------|-------------------|
| Activity prohibited | H5 | Path infeasible |
| Activity restricted | H2-H3 | Conditions required |
| Regulatory conflict | H4-H5 | May need legal resolution |
| Regulation changing | Risk | Monitor and adapt |

## Output format

```yaml
regulatory_scan:
  jurisdictions:
    - jurisdiction: "EU"
      regulations:
        - name: "GDPR"
          status: "Stable"
          relevance: "Data processing, storage, transfer"
        - name: "EPR Directive"
          status: "Evolving"
          relevance: "Core business requirement"

    - jurisdiction: "Global"
      regulations:
        - name: "ISO 27001"
          status: "Stable"
          relevance: "Security certification required"

  activity_mapping:
    - activity: "Collect packaging data from manufacturers"
      regulations: ["EPR"]
      status: "Required"
      notes: "Mandatory reporting"

    - activity: "Store data in Azure EU"
      regulations: ["GDPR"]
      status: "Permitted"
      conditions: ["Appropriate security measures"]

    - activity: "Process data for ML training"
      regulations: ["GDPR"]
      status: "Restricted"
      conditions: ["Legal basis required", "Purpose limitation"]

    - activity: "Transfer to non-EU analytics"
      regulations: ["GDPR"]
      status: "Restricted"
      conditions: ["SCCs", "Transfer impact assessment"]

  contradictions:
    - conflict: "Deletion right vs audit retention"
      jurisdictions: ["GDPR", "Financial audit"]
      resolution: "Art 17(3)(b) exemption for legal obligation"
      resolved: true

  prohibited_activities:
    - activity: "None identified"

  feasibility_assessment:
    status: "FEASIBLE"
    conditions:
      - "SCCs in place for any US processing"
      - "Legal basis documented for processing"
    risks:
      - "EPR reporting format may change — monitor"

  regulatory_stability:
    - regulation: "EPR"
      change_probability: "Medium"
      monitoring: "Quarterly regulatory review"
```

## Integration Points

- **Feeds from:** Activity list from scope, geographic scope
- **Feeds to:** #101 (prohibited = H5), conditions list, risk register

## Common Pitfalls

- **Assuming compliance:** "We're in the cloud, so GDPR is handled"
- **Missing jurisdictions:** Forgetting where data travels through
- **Ignoring evolving regulations:** EPR, CBAM are actively changing
- **Treating restricted as permitted:** Conditions exist but are ignored
- **Late discovery:** Finding prohibition after significant investment
