# #202 Resource Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess whether we have the people, money, infrastructure, and tools

## Theoretical Foundation

Based on Brooks's Law: "Adding people to a late project makes it later." Team capacity is NOT linearly scalable — communication overhead grows as n(n-1)/2.

## What to do

1. Assess each resource type (people, budget, infrastructure, tools, time)
2. Calculate gaps between needed and available
3. Determine if gaps are closable and at what cost
4. Apply Brooks's Law check for people-related gaps

## Resource Types

| Type | Check | Common Failure Mode |
|------|-------|-------------------|
| **People** | Headcount, skills, availability, continuity | Key person bottleneck, skill gap, part-time allocation |
| **Budget** | Allocated vs needed, contingency, approval | Hidden costs, no contingency, late budget cuts |
| **Infrastructure** | Compute, storage, network, environments | Provisioning delays, capacity limits, environment parity |
| **Tools/Licenses** | Software, services, access | Procurement delays, license restrictions, vendor approval |
| **Time** | Calendar time, work time, elapsed time | Calendar ≠ work time, holidays, context switching |

## Step-by-step

### Step 1: Inventory Available Resources

```
PEOPLE:
□ Headcount available: ___
□ FTE equivalent (accounting for part-time): ___
□ Key skills present: ___
□ Key skills missing: ___
□ Continuity risk (planned departures): ___

BUDGET:
□ Approved amount: ___
□ Contingency included: ___
□ Approval status: ___
□ Spending constraints: ___

INFRASTRUCTURE:
□ Cloud resources available: ___
□ Environments (dev/test/prod): ___
□ Provisioning status: ___
□ Capacity vs need: ___

TOOLS:
□ Required tools available: ___
□ Licenses in place: ___
□ Procurement needed: ___
□ Vendor approvals: ___
```

### Step 2: Estimate Needed Resources

Based on scope and technical requirements:
- People: roles and time
- Budget: all cost categories
- Infrastructure: capacity requirements
- Tools: what's needed

### Step 3: Calculate Gaps

| Resource | Needed | Available | Gap | Closable? |
|----------|--------|-----------|-----|-----------|
| Senior DE | 2 FTE | 1 FTE | 1 FTE | Hire (6 weeks) |
| Budget | $500K | $450K | $50K | Contingency request |
| Databricks cluster | 64 cores | Available | None | ✓ |
| Synapse workspace | 1 | Not provisioned | 1 | Provision (2 weeks) |

### Step 4: Brooks's Law Check

If gap involves adding people:

```
Current team size: N
Communication channels: N(N-1)/2

Adding 1 person:
New team size: N+1
New channels: (N+1)N/2
Added channels: N

Ramp-up time for new person: ___ weeks
Net productivity gain starts: Week ___
```

**Red flags:**
- Adding people with < 3 months remaining
- Adding people without mentor capacity
- Doubling team size

### Step 5: Score Resource Feasibility

| Score | Criteria |
|-------|----------|
| 5 | All resources available, contingency exists |
| 4 | Minor gaps, easily closable |
| 3 | Significant gaps, closable with effort |
| 2 | Major gaps, closure uncertain |
| 1 | Critical resources unavailable, no path to acquire |

## Output format

```yaml
resource_feasibility:
  score: 3
  confidence: "M"

  people:
    needed:
      - role: "Senior Data Engineer"
        fte: 2
      - role: "Platform Engineer"
        fte: 1
    available:
      - role: "Senior Data Engineer"
        fte: 1
        name: "Alice"
      - role: "Platform Engineer"
        fte: 0.5
        name: "Bob (50% allocated)"
    gap:
      - role: "Senior Data Engineer"
        fte: 1
        closure: "Hire — 6 weeks"
        cost: "$15K recruitment"
    brooks_law_flag: true
    brooks_law_note: "Adding 1 person to 2.5 FTE team — monitor ramp-up"

  budget:
    needed: "$500,000"
    available: "$450,000"
    gap: "$50,000"
    closure: "Request contingency from sponsor"
    contingency_buffer: "10% — adequate"

  infrastructure:
    needed:
      - item: "Databricks workspace"
        status: "Available"
      - item: "Synapse workspace"
        status: "Not provisioned"
        lead_time: "2 weeks"
      - item: "Dev/Test environments"
        status: "Partial — need parity"
    gap:
      - item: "Synapse workspace"
        closure: "Provision via Terraform"
        lead_time: "2 weeks"

  tools:
    needed:
      - tool: "Databricks Unity Catalog"
        status: "Available"
      - tool: "Azure DevOps"
        status: "Available"
    gap: []

  summary:
    total_gaps: 3
    closable: 3
    net_gap: 0
    critical_gaps: 0

  conditions:
    - "Hire Data Engineer within 6 weeks"
    - "Provision Synapse workspace by Week 2"
    - "Secure additional $50K contingency"
```

## Integration Points

- **Feeds from:** #003 Scope, technical requirements
- **Feeds to:** #401 Overall profile, #205 Temporal (resource availability affects timeline)

## Common Pitfalls

- **Ignoring part-time allocation:** 50% allocation ≠ 50% productivity
- **Optimistic hiring timelines:** "We'll hire someone next week"
- **Hidden costs:** Infrastructure costs, license costs, training costs
- **Context switching tax:** People on multiple projects lose 20-40% to switching
