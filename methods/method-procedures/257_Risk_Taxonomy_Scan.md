# 101 - Risk Taxonomy Scan

## Phase
IDENTIFY (Vertical)

## Purpose
Systematic sweep across predefined risk categories to ensure no domain is overlooked. The taxonomy forces consideration of categories the team might naturally ignore.

## Risk Taxonomy

| Category | Technical Examples | Business Examples |
|----------|-------------------|-------------------|
| **Architecture** | Single points of failure, scaling limits, tech debt | Vendor lock-in, platform dependency |
| **Data** | Corruption, loss, inconsistency, schema drift | Privacy breach, regulatory non-compliance |
| **Security** | Unauthorized access, injection, supply chain | Reputational damage, legal liability |
| **Operations** | Deployment failure, monitoring gaps, incident response | SLA breach, customer churn |
| **Dependency** | Library vulnerability, API deprecation, service outage | Vendor bankruptcy, contract termination |
| **People** | Key person dependency, skill gaps, turnover | Knowledge loss, hiring market shifts |
| **Regulatory** | Compliance gaps, audit failures | Fines, market access loss, forced changes |
| **Financial** | Cost overrun, resource constraints | ROI miss, budget cuts, currency risk |
| **Timeline** | Deadline miss, scope creep, integration delays | Market window miss, competitive response |
| **Strategic** | Wrong technology choice, wrong abstraction level | Wrong market, wrong timing, wrong positioning |

## Procedure

### Step 1: Category Walk
Walk through each category row systematically.

### Step 2: Risk Generation
For each category, ask: "What could go wrong in THIS category for THIS project/decision?"

### Step 3: Minimum Coverage
Generate at least 1 risk per category.
- Empty category = blind spot, investigate harder
- Document why category is empty if truly not applicable

### Step 4: Tagging
Tag each risk with:
- Category (from taxonomy)
- Genesis source (from #001)

## Output Schema
```yaml
taxonomy_risks:
  - id: "RISK-XXX"
    category: "[Architecture|Data|Security|Operations|Dependency|People|Regulatory|Financial|Timeline|Strategic]"
    genesis_source: "[Complexity|Coupling|Uncertainty|Agency|Temporality|Boundary]"
    description: "What could go wrong"
    technical_or_business: "[Technical|Business|Both]"
```

## Quality Checks
- [ ] All 10 categories examined
- [ ] At least 1 risk per category (or documented justification)
- [ ] Each risk tagged with category AND genesis source
- [ ] No false negatives from assumption that category doesn't apply

## Connections
- Feeds into: #201 (scoring), #301 (cascade mapping)
- Uses output from: #001 (genesis sources for tagging)
- Related to: #102 (failure modes), #104 (dependency risks)

## Examples by Category

### Architecture
```
Risk: Monolithic pipeline has no horizontal scaling capability
Genesis: Coupling
Impact: Cannot handle 3x data volume growth projected for next year
```

### Data
```
Risk: No schema validation between ingestion and transformation
Genesis: Boundary
Impact: Silent data corruption propagates to downstream reports
```

### People
```
Risk: Only one engineer understands the legacy reconciliation logic
Genesis: Temporality (knowledge eroded as others left)
Impact: Feature changes blocked, incidents escalate slowly
```

### Strategic
```
Risk: Technology choice optimized for current scale, not projected growth
Genesis: Uncertainty
Impact: Major replatforming required in 18 months
```
