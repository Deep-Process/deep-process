# #210 Dependency Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if external dependencies are available, reliable, and affordable

## Theoretical Foundation

Every external dependency is a feasibility assumption that must be verified. Dependency chains compound — if A depends on B depends on C, failure anywhere breaks A.

**Key insight:** Dependencies outside your control are risks. Dependencies you assume "will be there" often aren't.

## What to do

1. List ALL external dependencies
2. Assess each for availability, reliability, affordability, stability, timeliness
3. Check dependency chains
4. Identify alternatives and fallbacks

## Dependency Attributes

| Attribute | Question |
|-----------|----------|
| **Available** | Does it exist? Can we access it? (licenses, approvals, network) |
| **Reliable** | Does it meet our uptime/quality requirements? (SLA, historical) |
| **Affordable** | Can we pay at production scale? (pricing often changes at scale) |
| **Stable** | Will it exist in 12 months? (deprecation risk, vendor viability) |
| **Timely** | Available WHEN we need it? (partner deliverables, provisioning) |

## Step-by-step

### Step 1: List All Dependencies

```
EXTERNAL SERVICES:
□ Cloud services (Azure, Databricks, Synapse)
□ Third-party APIs
□ SaaS products
□ Authentication services

DATA SOURCES:
□ Partner data feeds
□ External APIs
□ Public datasets

APPROVALS/ACCESS:
□ Security approvals
□ Network access
□ License agreements

PARTNER DELIVERABLES:
□ Data format specifications
□ API documentation
□ Test environments
```

### Step 2: Assess Each Dependency

| Dependency | Available | Reliable | Affordable | Stable | Timely |
|------------|-----------|----------|------------|--------|--------|
| Azure Databricks | ✓ | ✓ (SLA) | ? (scale) | ✓ | ✓ |
| Mars ERP API | ? | ? | ✓ | ✓ | ? |
| Synapse Serverless | ✓ | ✓ | ? | ✓ | ✓ |

### Step 3: Deep-Dive Problem Areas

For each "?" or "✗":

```
Dependency: Mars ERP API
Issue: Availability unknown

Questions:
□ Does the API exist?
□ Do we have access credentials?
□ Is documentation available?
□ Is test environment available?
□ What's the SLA?

Finding: API exists but no test environment available
Impact: Cannot test integration until Mars provides access
Mitigation: Request test access by Week 2
```

### Step 4: Check Dependency Chains

```
Chain: Our Pipeline → Databricks → Azure Storage → Azure AD

If Azure AD has an outage:
→ Azure Storage auth fails
→ Databricks can't access data
→ Our pipeline fails

Chain strength: Limited by weakest link
```

### Step 5: Identify Alternatives

| Dependency | Alternative | Switching Cost |
|------------|-------------|---------------|
| Databricks | Synapse Spark | High (code rewrite) |
| Mars API | File-based ingestion | Medium (interface change) |
| Synapse | Power BI Direct | Medium (different approach) |

### Step 6: Score Dependency Feasibility

| Score | Criteria |
|-------|----------|
| 5 | All dependencies confirmed, reliable, affordable |
| 4 | Most dependencies confirmed, minor concerns |
| 3 | Some dependencies uncertain, alternatives exist |
| 2 | Key dependencies uncertain, limited alternatives |
| 1 | Critical dependencies unavailable or unreliable |

## Output format

```yaml
dependency_feasibility:
  score: 3
  confidence: "M"

  dependencies:
    - name: "Azure Databricks"
      type: "Cloud service"
      attributes:
        available: true
        reliable: true
        affordable: "Uncertain at scale"
        stable: true
        timely: true
      sla: "99.9%"
      concerns:
        - "Cluster costs at production scale"
      mitigation: "Cost modeling before scale-up"

    - name: "Mars ERP API"
      type: "Partner data source"
      attributes:
        available: "Unknown"
        reliable: "Unknown"
        affordable: true
        stable: true
        timely: "Unknown"
      sla: "None defined"
      concerns:
        - "No test environment access"
        - "No SLA defined"
        - "Format specification incomplete"
      mitigation:
        - "Request test access by Week 2"
        - "Define SLA in contract"
        - "Get sample data for validation"

    - name: "Synapse Serverless"
      type: "Cloud service"
      attributes:
        available: true
        reliable: true
        affordable: "Uncertain at scale"
        stable: true
        timely: true
      concerns:
        - "Query costs at 100M record scale"
      mitigation: "Performance and cost testing"

  dependency_chains:
    - chain: "Pipeline → Databricks → Storage → Azure AD"
      weakest_link: "Azure AD (auth)"
      impact_of_failure: "Total pipeline failure"
      mitigation: "Monitor Azure AD status, retry logic"

  alternatives:
    - dependency: "Mars API"
      alternative: "File-based ingestion"
      switching_cost: "Medium — 2 weeks"
      when_to_switch: "If API not available by Week 4"

  summary:
    total_dependencies: 8
    confirmed: 5
    uncertain: 3
    critical_uncertain: 1
    chains_identified: 2

  conditions:
    - "Mars test environment access by Week 2"
    - "Mars SLA defined before go-live"
    - "Cost validation for cloud services at scale"
```

## Integration Points

- **Feeds from:** Architecture design, #003 Assumptions
- **Feeds to:** #401 Overall profile, conditions list, risk register

## Common Pitfalls

- **Assuming availability:** "Of course we'll have access"
- **Ignoring SLAs:** Partner reliability not contractually defined
- **Scale pricing surprise:** "It's cheap" at demo scale, expensive at production
- **Deprecation blindness:** APIs and services get deprecated
- **Chain blindness:** Not seeing how dependencies cascade
