# 111 - Temporal Risk Archaeology

## Phase
IDENTIFY (Horizontal)

## Purpose
Explicitly search for risks created by TIME - erosion, drift, accumulation, decay, and entropy. These risks are invisible in point-in-time analysis because each increment is negligible. Only the accumulated effect is catastrophic.

## Theoretical Foundation

**Sorites Paradox:** When does one grain of sand become a heap?
- Remove one grain from a heap - still a heap
- Therefore, removing grains can never make it not-a-heap
- Yet eventually, it's not a heap

**Applied to risk:**
- Each small degradation is acceptable
- Therefore, degradation is never alarming
- Yet eventually, the system is catastrophically degraded

## Temporal Risk Types

| Type | Question | Examples |
|------|----------|----------|
| **Degrading** | What is slowly getting worse? | Performance, data quality, test coverage, documentation accuracy |
| **Accumulating** | What is slowly building up? | Technical debt, configuration drift, permission creep, complexity |
| **Expiring** | What is slowly running out? | Certificates, contracts, vendor relationships, team knowledge, technology relevance |
| **Invalidating** | What worked N months ago but hasn't been re-validated? | Assumptions, capacity estimates, SLA compliance |

## Procedure

### Step 1: Temporal Scan
For each component/process/relationship, ask:
1. What is slowly degrading?
2. What is slowly accumulating?
3. What is slowly expiring?
4. What worked before but hasn't been re-validated?

### Step 2: State Estimation
For each temporal risk, estimate:
- Current accumulated state
- Threshold where it becomes critical
- Rate of change

### Step 3: Time-to-Threshold
Calculate: how long until threshold is crossed?
```
Time to Threshold = (Threshold - Current State) / Rate of Change
```

### Step 4: Prioritize by Time-to-Threshold
Which temporal risks hit threshold first?
These need monitoring NOW.

### Step 5: Identify Trigger Absence
Key insight: the trigger for temporal risks is NOT an event.
It's the ABSENCE of an event:
- No one checked
- No one updated
- No one noticed

## Output Schema
```yaml
temporal_risks:
  - what_is_changing: "Description of the temporal element"
    temporal_type: "[Degrading|Accumulating|Expiring|Invalidating]"
    direction: "[Worsening|Growing|Depleting]"
    current_state: "Current measured or estimated state"
    critical_threshold: "When it becomes a problem"
    rate_of_change: "How fast is it moving"
    estimated_time_to_threshold: "When threshold will be crossed"
    monitoring_exists: "[true|false]"
    monitoring_details: "What monitoring is in place (if any)"
    trigger_type: "[Event|Absence]"
    last_validated: "When this was last checked"
```

## Quality Checks
- [ ] All four temporal types examined
- [ ] Current state estimated
- [ ] Thresholds defined
- [ ] Rate of change estimated
- [ ] Time-to-threshold calculated
- [ ] Monitoring gaps identified

## Connections
- Feeds into: #505 (Sorites Accumulation Watch), #501 (leading indicators)
- Uses output from: System metrics, historical data
- Related to: Theoretical Foundations (Sorites Paradox)

## Examples

### Degrading: Pipeline Performance
```yaml
what_is_changing: "Data pipeline execution time"
temporal_type: Degrading
direction: Worsening
current_state: "3.2 hours average"
critical_threshold: "4 hours (SLA boundary)"
rate_of_change: "+4 minutes per week"
estimated_time_to_threshold: "12 weeks"
monitoring_exists: true
monitoring_details: "Dashboard shows duration but no trend alert"
trigger_type: Absence (no one analyzing trend)
last_validated: "Never formally reviewed"
```

### Accumulating: Technical Debt
```yaml
what_is_changing: "Unaddressed TODO comments in codebase"
temporal_type: Accumulating
direction: Growing
current_state: "347 TODOs"
critical_threshold: "500 (point where onboarding becomes impossible)"
rate_of_change: "+12 per sprint"
estimated_time_to_threshold: "13 sprints (~6 months)"
monitoring_exists: false
monitoring_details: N/A
trigger_type: Absence (no debt tracking)
last_validated: "N/A"
```

### Accumulating: Infrastructure Drift
```yaml
what_is_changing: "Terraform state vs actual Azure infrastructure"
temporal_type: Accumulating
direction: Growing
current_state: "Unknown (no drift detection)"
critical_threshold: "Any drift (next terraform apply may destroy resources)"
rate_of_change: "Unknown - manual changes not tracked"
estimated_time_to_threshold: "May already be there"
monitoring_exists: false
monitoring_details: N/A
trigger_type: Absence (no drift checking)
last_validated: "Last clean apply was 4 months ago"
```

### Expiring: Certificates
```yaml
what_is_changing: "TLS certificate for production API"
temporal_type: Expiring
direction: Depleting
current_state: "47 days until expiry"
critical_threshold: "0 days (production outage)"
rate_of_change: "1 day per day (deterministic)"
estimated_time_to_threshold: "47 days"
monitoring_exists: true
monitoring_details: "Alert at 30 days, but renewal process takes 2 weeks"
trigger_type: Event (expiry date known)
last_validated: "Certificate installed 11 months ago"
```

### Expiring: Knowledge
```yaml
what_is_changing: "Team knowledge of legacy reconciliation system"
temporal_type: Expiring
direction: Depleting
current_state: "1 person deeply knows, 1 person partially knows"
critical_threshold: "0 people know (system becomes unmaintainable)"
rate_of_change: "Attrition rate ~15%/year, no knowledge transfer"
estimated_time_to_threshold: "Unknown - depends on who leaves when"
monitoring_exists: false
monitoring_details: N/A
trigger_type: Event (person departure)
last_validated: "Never assessed"
```

### Invalidating: Capacity Assumptions
```yaml
what_is_changing: "Capacity planning assumptions from project start"
temporal_type: Invalidating
direction: Assumptions drifting from reality
current_state: "Original: 10M records/day. Current: 8M. Growth: 30%/year."
critical_threshold: "Capacity exceeded, SLA breach"
rate_of_change: "30% annual growth"
estimated_time_to_threshold: "18 months at current growth"
monitoring_exists: Partial
monitoring_details: "Daily volumes tracked but not compared to capacity model"
trigger_type: Absence (no capacity review)
last_validated: "Original estimate 14 months ago"
```

## Pattern: The Boiling Frog

Each temporal risk follows this pattern:
1. Small change - "not worth addressing"
2. Accumulated change - still "not urgent"
3. Threshold approached - "we should do something soon"
4. Threshold crossed - "how did this happen?!"

The solution: measure TRENDS, not just VALUES.
Alert on sustained directional movement, not just threshold crossing.
