# 104 - Dependency Risk Discovery

## Phase
IDENTIFY (Vertical)

## Purpose
Map ALL external dependencies and assess each as a risk source. Dependencies are the #1 blind spot - teams treat them as stable when they're the most volatile risk source.

## Dependency Types

| Type | Examples | Risk Pattern |
|------|----------|-------------|
| **Vendor/Service** | Cloud provider, SaaS API, payment processor | Outage, price hike, deprecation, acquisition |
| **Library/Package** | npm packages, Python libs, OS packages | Vulnerability, abandonment, breaking change |
| **Data** | External data feeds, shared databases, APIs | Schema change, quality degradation, access revocation |
| **People** | Key engineer, domain expert, single approver | Departure, illness, bottleneck, burnout |
| **Infrastructure** | DNS, certificates, domains, credentials | Expiry, misconfiguration, provider change |
| **Organizational** | Budget approval, legal review, partner agreement | Delay, rejection, renegotiation |
| **Knowledge** | Undocumented processes, tribal knowledge | Loss on departure, inconsistent execution |

## Procedure

### Step 1: Exhaustive Dependency Inventory
List EVERY external dependency. Be exhaustive:
- Check build files (package.json, requirements.txt, pom.xml)
- Check CI/CD configuration
- Check DNS, certificates, domains
- Check external APIs and services
- Check data sources and feeds
- Check people and organizational dependencies

### Step 2: Blast Radius Assessment
For each dependency: What is the blast radius if this dependency fails?
- How many systems affected?
- Which business processes blocked?
- What's the time-to-impact?

### Step 3: Substitution Cost
For each dependency: How hard to replace?
- Drop-in alternative exists?
- Migration effort required?
- Lock-in factors (data format, API compatibility, contracts)?

### Step 4: Criticality Classification
```
Criticality = Blast Radius x Substitution Cost
```
- High blast radius + High substitution cost = CRITICAL

### Step 5: Lindy Effect Assessment
How old is this dependency?
- New dependencies (< 2 years) = Higher base-rate failure risk
- Established dependencies (> 5 years) = More robust

### Step 6: Shared Dependency Check
Are any dependencies shared between "redundant" systems?
This feeds into #303 (Common Mode Failure).

## Output Schema
```yaml
dependency_risks:
  - dependency: "Dependency name/identifier"
    type: "[Vendor|Library|Data|People|Infrastructure|Organizational|Knowledge]"
    blast_radius: "[Low|Medium|High|Critical]"
    blast_radius_details: "What fails if this fails"
    substitution_cost: "[Low|Medium|High|Very High]"
    substitution_details: "What it takes to replace"
    age_lindy: "[New (<2yr)|Established (2-5yr)|Mature (>5yr)]"
    criticality: "[Low|Medium|High|Critical]"
    shared_with: "List of other systems sharing this dependency"
    monitoring_exists: "[true|false]"
```

## Quality Checks
- [ ] All dependency types examined
- [ ] Build files and configs parsed for hidden dependencies
- [ ] People and knowledge dependencies included
- [ ] Shared dependencies identified for redundancy check
- [ ] Lindy Effect applied to assess newness risk

## Connections
- Feeds into: #201 (scoring), #303 (common mode failures)
- Uses output from: Architecture documentation, build configurations
- Related to: Theoretical Foundations (Lindy Effect)

## Examples

### Vendor Dependency
```yaml
dependency: "Azure Databricks"
type: Vendor
blast_radius: Critical
blast_radius_details: "All data pipelines stop, no reporting, no ETL"
substitution_cost: Very High
substitution_details: "6+ months migration to alternative (Snowflake, Spark on EMR)"
age_lindy: Established (4 years with this vendor)
criticality: Critical
shared_with: ["Prod pipelines", "Dev environments", "ML training"]
monitoring_exists: true
```

### Library Dependency
```yaml
dependency: "lodash (npm)"
type: Library
blast_radius: Medium
blast_radius_details: "Frontend utilities, many implicit usages"
substitution_cost: Medium
substitution_details: "Can migrate to native JS, ~2 weeks effort"
age_lindy: Mature (10+ years)
criticality: Medium
shared_with: ["All frontend apps"]
monitoring_exists: false (no CVE scanning)
```

### People Dependency
```yaml
dependency: "Senior Engineer (John)"
type: People
blast_radius: High
blast_radius_details: "Only person who understands legacy reconciliation system"
substitution_cost: High
substitution_details: "3-6 months to train replacement, if documentation exists"
age_lindy: N/A
criticality: Critical
shared_with: ["Reconciliation", "Audit support", "Incident response"]
monitoring_exists: false
```

### Knowledge Dependency
```yaml
dependency: "Deployment runbook (undocumented)"
type: Knowledge
blast_radius: High
blast_radius_details: "Production deployments blocked if key people unavailable"
substitution_cost: Medium
substitution_details: "2-4 weeks to document and validate"
age_lindy: N/A (undocumented = fragile regardless)
criticality: High
shared_with: ["All production services"]
monitoring_exists: false
```
