# 110 - Chaos Probe Design

## Phase
IDENTIFY (Horizontal)

## Purpose
Design controlled experiments that EMPIRICALLY discover risks by deliberately injecting failures. All other IDENTIFY methods are analytical (thinking about what could go wrong). This is the only method that TESTS what actually goes wrong.

## Why This Matters

Analytical methods suffer from imagination limits - you can only find risks you can think of.

Chaos probes find risks you COULDN'T think of because they let the system reveal its own failure modes.

**Finding from chaos engineering:**
> "You don't truly understand a system until you've watched it break."

## Procedure

### Step 1: Define Steady State
What does "system working correctly" look like in measurable terms?
- Key metrics that indicate health
- SLOs and thresholds
- Observable behaviors

### Step 2: Design Probes
For each critical component/dependency, design a probe:

| Element | Description |
|---------|-------------|
| **What to break** | Kill process, inject latency, corrupt data, exhaust memory, revoke credentials |
| **Blast radius control** | Feature flags, canary, staging environment, percentage rollout |
| **Observation plan** | What to measure, how to know if handled |
| **Abort criteria** | When to stop the experiment |
| **Rollback plan** | How to restore normal state |

### Step 3: Environment Graduation
Start in safest environment, graduate toward production:
1. Unit test (mocked failure)
2. Integration test (controlled environment)
3. Staging (production-like)
4. Production canary (limited blast radius)
5. Production (with controls)

### Step 4: Execute and Observe
Run probes with monitoring active.
Document: what actually happened vs what you expected.

### Step 5: Discover Risks
Every UNEXPECTED result = discovered risk.
Catalog and feed into risk register.

## Probe Types

### Infrastructure Probes
| Probe | Injection | What It Reveals |
|-------|-----------|-----------------|
| **Kill process** | SIGKILL random process | Recovery behavior, single points |
| **Kill node** | Terminate VM/container | Replication, failover |
| **Network partition** | Block traffic between zones | Split-brain, consensus |
| **DNS failure** | Return NXDOMAIN | DNS caching, hard-coded IPs |
| **Certificate expiry** | Use expired cert | TLS handling, error messages |

### Application Probes
| Probe | Injection | What It Reveals |
|-------|-----------|-----------------|
| **Latency injection** | Add N ms to responses | Timeout handling, cascades |
| **Error injection** | Return 500s, exceptions | Error handling, retries |
| **Memory pressure** | Allocate until limit | OOM behavior, graceful degradation |
| **CPU starvation** | Consume CPU | Priority handling, timeouts |
| **Disk full** | Fill disk | Logging, write handling |

### Data Probes
| Probe | Injection | What It Reveals |
|-------|-----------|-----------------|
| **Corrupt data** | Invalid values in records | Validation, error handling |
| **Schema mismatch** | Send wrong schema | Schema validation, defaults |
| **Duplicate data** | Send same record twice | Idempotency |
| **Out of order** | Send events out of sequence | Ordering assumptions |
| **Missing data** | Omit required fields | Null handling, defaults |

## Output Schema
```yaml
chaos_probes:
  - probe_name: "Name of the experiment"
    target: "What component/dependency is being tested"
    what_to_break: "The failure injection"
    expected_result: "What we thought would happen"
    actual_result: "What actually happened"
    discrepancy: "Difference between expected and actual"
    discovered_risks:
      - risk_id: "RISK-XXX"
        description: "Risk discovered by this probe"
        severity: "[Low|Medium|High|Critical]"
    blast_radius_control: "How impact was limited"
    environment: "[Unit|Integration|Staging|Canary|Production]"
    abort_triggered: "[true|false]"
    abort_reason: "Why experiment was stopped (if applicable)"
```

## Quality Checks
- [ ] Steady state clearly defined
- [ ] Blast radius controls in place
- [ ] Abort criteria defined
- [ ] Rollback plan tested
- [ ] All unexpected results catalogued as risks

## Connections
- Feeds into: Risk register (newly discovered risks)
- Uses output from: #102 (failure modes to test), #104 (dependencies to probe)
- Related to: #403 (validate defense layers)

## Examples

### Probe 1: Kill Executor Mid-Merge
```yaml
probe_name: "Executor death during Delta merge"
target: "Databricks Delta Lake merge operation"
what_to_break: "Kill a Spark executor process mid-merge"

expected_result: "Spark retry handles it, merge completes"
actual_result: "Partial write occurred, checkpoint corrupted, manual recovery needed"
discrepancy: "Expected automatic recovery, got data inconsistency"

discovered_risks:
  - risk_id: "RISK-047"
    description: "Delta merge not atomic under executor failure"
    severity: Critical
  - risk_id: "RISK-048"
    description: "Checkpoint corruption requires manual intervention"
    severity: High

blast_radius_control: "Staging environment, isolated table"
environment: Staging
abort_triggered: false
```

### Probe 2: Latency to Source API
```yaml
probe_name: "30-second latency injection to source API"
target: "Data ingestion pipeline"
what_to_break: "Inject 30-second delay on API responses"

expected_result: "Pipeline retries with backoff, completes slowly"
actual_result: "Connection pool exhausted, all workers blocked, cascade to other pipelines"
discrepancy: "Expected isolated impact, got system-wide cascade"

discovered_risks:
  - risk_id: "RISK-049"
    description: "Shared connection pool creates cascade failure"
    severity: Critical
  - risk_id: "RISK-050"
    description: "No circuit breaker on external API calls"
    severity: High

blast_radius_control: "Feature flag to route 10% traffic"
environment: Staging
abort_triggered: true
abort_reason: "Cascade affected other test pipelines"
```

### Probe 3: Malformed Schema
```yaml
probe_name: "Schema mismatch in validation layer"
target: "Data quality validation"
what_to_break: "Send records with new column not in schema"

expected_result: "Validation rejects records, alert fires"
actual_result: "Unknown columns silently dropped, no alert"
discrepancy: "Expected rejection, got silent data loss"

discovered_risks:
  - risk_id: "RISK-051"
    description: "Schema validation permissive, silent data loss"
    severity: High

blast_radius_control: "Test dataset, isolated validation instance"
environment: Integration
abort_triggered: false
```

## Safety Guidelines

1. **Never skip blast radius controls** - even in staging
2. **Always have abort criteria** - know when to stop
3. **Monitor actively** - don't "fire and forget"
4. **Start small** - percentage rollout, then increase
5. **Document everything** - including "nothing happened" results
6. **Communicate** - team should know experiments are running
