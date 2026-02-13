# #104 Conway Alignment Check

**Phase:** 1 (CONSTRAIN)
**Tier:** 2 — Standard+ depths
**Purpose:** Assess whether required architecture is compatible with organizational structure

## Theoretical Foundation

Based on Conway's Law (1968): "Organizations produce systems that mirror their communication structures."

**Key insight:** If required architecture demands cross-team integration that doesn't exist in org structure, that architecture is **structurally infeasible** (H3) regardless of individual competence.

## What to do

1. Map the required system architecture
2. Map the organizational structure
3. Check alignment between architectural and organizational interfaces
4. Identify misalignments and resolution options

## Conway's Law in Practice

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONWAY'S LAW                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  "Any organization that designs a system will produce a design whose        │
│   structure is a copy of the organization's communication structure."       │
│                                                                              │
│  Implications:                                                              │
│                                                                              │
│  1. Architecture follows organization                                       │
│     You can't design architecture independent of org structure              │
│                                                                              │
│  2. Tight integration requires tight communication                          │
│     Teams that rarely talk can't build tightly coupled components           │
│                                                                              │
│  3. Misalignment causes friction                                            │
│     Architecture that doesn't match org will face constant resistance       │
│                                                                              │
│  Resolution options:                                                        │
│  • Change the org to match required architecture                            │
│  • Change the architecture to match the org                                 │
│  • Accept friction and manage it explicitly                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Map System Architecture

Document:
- Components/services
- Interfaces between components
- Data flows
- Shared resources
- Decision points

```
Example Architecture:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ingest    │───▶│  Transform  │───▶│   Storage   │
│  Component  │    │  Component  │    │  Component  │
└─────────────┘    └─────────────┘    └─────────────┘
      ▲                   │                   │
      │                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Mars ERP   │    │  Business   │    │  Reporting  │
│  (external) │    │   Rules     │    │  (Synapse)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Step 2: Map Organizational Structure

Document:
- Teams involved
- Reporting lines
- Communication channels
- Meeting cadences
- Decision authority

```
Example Organization:
┌─────────────────────────────────────────────────────────┐
│                      Mars (Client)                       │
│  ┌─────────────┐              ┌─────────────┐          │
│  │  IT Team    │              │  Business   │          │
│  │             │              │  (EPR SME)  │          │
│  └─────────────┘              └─────────────┘          │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ Monthly review
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Lingaro (Vendor)                      │
│  ┌─────────────┐              ┌─────────────┐          │
│  │ Data Eng    │──(daily)────│  Platform   │          │
│  │ Team        │              │  Team       │          │
│  └─────────────┘              └─────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Check Interface Alignment

For each architectural interface:

| Arch Interface | Org Channel | Frequency | Aligned? |
|----------------|-------------|-----------|----------|
| Ingest ↔ Transform | Same team | Daily | ✓ Yes |
| Transform ↔ Rules | Lingaro ↔ Mars | Monthly | ✗ No |
| Storage ↔ Reporting | Data Eng ↔ Platform | Daily | ✓ Yes |
| Ingest ↔ Mars ERP | Lingaro ↔ Mars IT | Monthly | ✗ No |

### Step 4: Assess Misalignment Impact

For each misalignment:

| Interface | Required Integration | Actual Communication | Impact |
|-----------|---------------------|---------------------|--------|
| Transform ↔ Rules | Tight (daily changes) | Monthly meetings | HIGH |
| Ingest ↔ Mars ERP | Moderate (format changes) | Monthly meetings | MEDIUM |

### Step 5: Determine Resolution

| Misalignment | Resolution Options | Recommendation |
|--------------|-------------------|----------------|
| Transform ↔ Rules | (A) Create shared channel (B) Redesign for loose coupling | A: Weekly sync + Slack channel |
| Ingest ↔ Mars ERP | (A) More frequent communication (B) Accept risk | B: Accept with buffer in timeline |

## Output format

```yaml
conway_check:
  architecture_map:
    components:
      - name: "Data Ingestion"
        owner: "Lingaro Data Eng"
      - name: "Transformation"
        owner: "Lingaro Data Eng"
      - name: "Business Rules"
        owner: "Mars Business"
      - name: "Storage"
        owner: "Lingaro Platform"
      - name: "Reporting"
        owner: "Lingaro Platform / Mars IT"

    interfaces:
      - from: "Ingestion"
        to: "Transformation"
        coupling: "Tight"
      - from: "Transformation"
        to: "Business Rules"
        coupling: "Tight"
      - from: "Transformation"
        to: "Storage"
        coupling: "Moderate"

  org_map:
    teams:
      - name: "Lingaro Data Eng"
        org: "Lingaro"
        size: 3
      - name: "Mars Business"
        org: "Mars"
        size: 2
      - name: "Mars IT"
        org: "Mars"
        size: 1

    channels:
      - teams: ["Lingaro Data Eng", "Mars Business"]
        type: "Monthly review"
        adequacy: "Insufficient for tight coupling"

  alignment_assessment:
    - interface: "Transformation ↔ Business Rules"
      architecture_need: "Tight coupling — daily interaction"
      org_reality: "Monthly meetings only"
      aligned: false
      impact: "HIGH"
      resolution: "Create weekly sync + shared Slack channel"
      feasibility_of_resolution: "Medium — requires Mars engagement"

    - interface: "Ingestion ↔ Mars ERP"
      architecture_need: "Moderate — format change coordination"
      org_reality: "Monthly meetings"
      aligned: false
      impact: "MEDIUM"
      resolution: "Accept risk, add timeline buffer"

  overall_alignment: "PARTIAL"
  structural_feasibility: "CONDITIONAL"
  conditions:
    - "Weekly Transform↔Rules sync established"
    - "Shared communication channel created"
```

## Integration Points

- **Feeds from:** Architecture design, org structure information
- **Feeds to:** #204 Organizational Feasibility, #101 (H3 constraint if misaligned)

## Common Pitfalls

- **Ignoring org structure:** Designing architecture as if teams don't exist
- **Assuming communication:** "They'll work it out" without establishing channels
- **Underestimating friction:** Misalignment causes constant small delays that compound
- **Changing neither:** Accepting misalignment without mitigation
