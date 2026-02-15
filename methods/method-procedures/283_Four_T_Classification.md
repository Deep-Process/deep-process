# 401 - Four-T Classification

## Phase
MITIGATE

## Purpose
Classify each risk into a response strategy. Forces explicit decision rather than default tolerance. Every risk must have a conscious strategy assignment.

## The Four Strategies

| Strategy | When to Use | Action | Example |
|----------|-------------|--------|---------|
| **Terminate** | Risk source can be removed entirely | Eliminate the activity/dependency/exposure | Don't use risky vendor, don't enter risky market |
| **Transfer** | Someone else is better equipped to handle | Shift risk via contract, insurance, outsourcing | SLA with penalties, cyber insurance, specialist contractor |
| **Treat** | Risk can be reduced to acceptable level | Reduce probability or impact | Monitoring, backups, redundancy, validation |
| **Tolerate** | Cost of mitigation exceeds benefit | Accept consciously with monitoring | Document acceptance, set review date, define escalation |

## Procedure

### Step 1: Evaluate All Four Options
For each risk, evaluate ALL four strategies:
- Could we Terminate?
- Could we Transfer?
- How would we Treat?
- Can we Tolerate?

### Step 2: Apply Strategy Selection Logic

```
                    ┌─────────────────────────────┐
                    │  Can we eliminate the       │
                    │  source entirely?           │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │            YES              │──────► TERMINATE
                    │             NO              │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │  Can someone else handle    │
                    │  this better than us?       │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │            YES              │──────► TRANSFER
                    │             NO              │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │  Is treatment cost-         │
                    │  effective? (#402)          │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │            YES              │──────► TREAT
                    │             NO              │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                              TOLERATE
                    (with explicit justification)
```

### Step 3: Non-Ergodic Override
For NON_ERGODIC risks (#206):
- **Terminate or Transfer STRONGLY preferred**
- Treating may be insufficient (can't "treat" existential risk)
- Tolerating requires EXTRAORDINARY justification

### Step 4: Document Decision
For each risk, document:
- Chosen strategy
- Why other strategies were rejected
- Owner and review date
- Escalation triggers (especially for Tolerate)

### Step 5: Tolerate Requirements
Every TOLERATE decision must have:
- **Owner:** Who is responsible for monitoring?
- **Review date:** When will we reconsider?
- **Escalation trigger:** What condition upgrades to Treat/Terminate?

## Output Schema
```yaml
mitigations:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    composite_score: 45
    non_ergodic: false

    strategy: "[Terminate|Transfer|Treat|Tolerate]"

    evaluation:
      terminate:
        feasible: "[true|false]"
        rationale: "Why we can/can't eliminate"
      transfer:
        feasible: "[true|false]"
        rationale: "Why we can/can't transfer"
        potential_transferee: "Who could take this on"
      treat:
        feasible: "[true|false]"
        treatment_options:
          - option: "Treatment approach 1"
            cost: "Estimated cost"
            effectiveness: "Expected risk reduction"
        cost_benefit_positive: "[true|false]"
      tolerate:
        acceptable: "[true|false]"
        rationale: "Why this is/isn't acceptable to tolerate"

    selected_strategy:
      strategy: "Treat"
      rationale: "Why this strategy was chosen"
      rejected_alternatives: "Why Terminate/Transfer/Tolerate not chosen"

    owner: "Person responsible"
    review_date: "YYYY-MM-DD"

    # Required for Tolerate
    tolerate_details:
      justification: "Why we're accepting this risk"
      escalation_trigger: "What condition changes our decision"
      monitoring: "How we're watching this"
```

## Quality Checks
- [ ] All four strategies evaluated for each risk
- [ ] Strategy selection logic followed
- [ ] Non-ergodic risks get special treatment
- [ ] Every Tolerate has owner + review date + trigger
- [ ] Rationale documented for selected strategy

## Connections
- Feeds into: #402 (cost-benefit for Treat), #403-404 (Treat implementation)
- Uses output from: #201 (scores), #206 (ergodicity flags)
- Related to: Anti-pattern is "Tolerate by default"

## Examples

### Terminate Example
```yaml
risk_id: "RISK-088"
title: "Vulnerable legacy library with known CVE"
composite_score: 60

evaluation:
  terminate:
    feasible: true
    rationale: "Can replace library with maintained alternative"
  transfer:
    feasible: false
    rationale: "Cannot outsource our own codebase"
  treat:
    feasible: true
    treatment_options:
      - option: "Apply patches, monitor for exploits"
        cost: "Medium ongoing"
        effectiveness: "Partial - new CVEs will emerge"
  tolerate:
    acceptable: false
    rationale: "Known vulnerability is not acceptable"

selected_strategy:
  strategy: Terminate
  rationale: "Remove root cause rather than perpetual patching"
  rejected_alternatives: "Treat is ongoing cost; Tolerate unacceptable"

owner: "Tech Lead"
review_date: "N/A - once removed, risk is gone"
```

### Transfer Example
```yaml
risk_id: "RISK-044"
title: "Cyber attack / data breach"
composite_score: 75

evaluation:
  terminate:
    feasible: false
    rationale: "Cannot eliminate all attack vectors"
  transfer:
    feasible: true
    rationale: "Cyber insurance available, incident response specialists exist"
    potential_transferee: "Insurance provider, MSSP for incident response"
  treat:
    feasible: true
    treatment_options:
      - option: "Security hardening, monitoring"
        cost: "High ongoing"
        effectiveness: "Reduces probability but doesn't eliminate"
  tolerate:
    acceptable: false
    rationale: "Data breach consequences too severe"

selected_strategy:
  strategy: "Treat + Transfer"
  rationale: "Treat to reduce probability, Transfer residual via insurance"
  rejected_alternatives: "Cannot fully Terminate; too risky to only Tolerate"

owner: "Security Lead"
review_date: "Quarterly"
```

### Tolerate Example
```yaml
risk_id: "RISK-099"
title: "Minor UI inconsistency in admin panel"
composite_score: 8

evaluation:
  terminate:
    feasible: true
    rationale: "Could fix the UI"
  transfer:
    feasible: false
    rationale: "Not transferable"
  treat:
    feasible: true
    treatment_options:
      - option: "Fix UI inconsistency"
        cost: "2 days developer time"
        effectiveness: "Complete"
    cost_benefit_positive: false
  tolerate:
    acceptable: true
    rationale: "Low impact, affects only internal admins, workaround exists"

selected_strategy:
  strategy: Tolerate
  rationale: "Cost of fix exceeds benefit; low impact, low probability of issue"
  rejected_alternatives: "Treat not cost-effective for this low-severity issue"

owner: "Product Owner"
review_date: "2024-06-01"
tolerate_details:
  justification: "Risk score 8 (LOW), only affects internal users, workaround exists"
  escalation_trigger: "User complaints exceed 5/month OR external user affected"
  monitoring: "Track support tickets related to admin panel"
```

## Anti-Pattern: Tolerate by Default

**The Failure Mode:**
- Risk identified
- No explicit strategy assigned
- Risk is implicitly tolerated
- No owner, no review, no trigger
- Risk accumulates unmonitored

**The Solution:**
- EVERY risk must have explicit strategy
- Tolerate is a VALID choice - but must be documented
- Undecided ≠ Tolerate
