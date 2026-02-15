# 307 - Risk Interaction Paradoxes

## Phase
INTERACT

## Purpose
Check for paradoxical interactions where managing one risk CREATES or AMPLIFIES another - the risk management equivalent of Braess Paradox. This is the INTERACT-level version of what #407 (Cobra Effect) does at the individual mitigation level.

## Theoretical Foundation

**Braess Paradox:** Adding a road to a network can INCREASE total travel time.

**Applied to risk:** Mitigating Risk A can INCREASE Risk B.

This happens because:
- Resources are finite (spending on A reduces spending on B)
- Systems are interconnected (changing A affects B's context)
- Trade-offs are fundamental (safety vs speed, security vs usability)

## Known Interaction Paradoxes

| Paradox | Mechanism | Example |
|---------|-----------|---------|
| **Safety-Liveness** | Making system safer (more checks) slows it down | Adding validation → pipeline too slow for SLA |
| **Security-Usability** | More security → more friction → users bypass | Complex passwords → Post-it notes on monitors |
| **Consistency-Availability** | CAP theorem → can't maximize both | Strong consistency → unavailable during partitions |
| **Efficiency-Resilience** | Optimizing for efficiency removes slack | JIT pipeline → no buffer for retries |
| **Transparency-Security** | More logging for transparency → more data to leak | Detailed audit logs contain sensitive data |
| **Simplicity-Completeness** | Simpler design → fewer edge cases handled | Minimal MVP → fails on real-world variety |
| **Speed-Quality** | Faster delivery → less validation | Rapid deployment → more production bugs |
| **Cost-Reliability** | Lower cost → less redundancy | Budget cuts → single points of failure |

## Procedure

### Step 1: Map Mitigation Relationships
For each pair of risks with mitigations:
> "Does mitigating Risk A increase Risk B?"

### Step 2: Classify Interaction

| Interaction | Description | Action |
|-------------|-------------|--------|
| **No effect** | Mitigations independent | Proceed independently |
| **Synergistic** | Mitigating A helps B | Prioritize for efficiency |
| **Antagonistic** | Mitigating A hurts B | Paradox - needs balancing |

### Step 3: Analyze Antagonistic Pairs
For paradoxical interactions:
- What's the mechanism?
- Is the net effect positive or negative?
- Is there an optimal trade-off point?

### Step 4: Find Optimal Trade-Off
For paradoxes, find the balance:
- Not "maximize A, ignore B"
- Not "maximize B, ignore A"
- Find point where total risk is minimized

### Step 5: Document Constraints
Record interactions as constraints on mitigation design:
> "Mitigation for RISK-A cannot exceed threshold T because of impact on RISK-B"

## Output Schema
```yaml
paradoxes:
  - risk_a: "RISK-XXX"
    risk_a_mitigation: "What we're doing for A"
    risk_b: "RISK-YYY"
    risk_b_impact: "How A's mitigation affects B"
    paradox_type: "[Safety-Liveness|Security-Usability|Consistency-Availability|Efficiency-Resilience|Transparency-Security|Simplicity-Completeness|Speed-Quality|Cost-Reliability|Other]"
    mechanism: "How the paradox works"
    net_effect: "[Positive|Negative|Neutral]"
    optimal_trade_off:
      description: "Where to balance"
      threshold: "Specific limit if applicable"
    constraint: "Rule for mitigation design"
```

## Quality Checks
- [ ] All mitigation pairs examined
- [ ] Paradox types identified
- [ ] Mechanisms understood
- [ ] Trade-offs analyzed
- [ ] Constraints documented

## Connections
- Feeds into: #401 (strategy selection aware of paradoxes), #407 (individual Cobra check)
- Uses output from: #401 (mitigations), INTERACT analysis
- Related to: Theoretical Foundations (Braess Paradox)

## Examples

### Safety-Liveness Paradox
```yaml
risk_a: "RISK-023: Data quality issues"
risk_a_mitigation: "Add comprehensive validation at every pipeline stage"
risk_b: "RISK-031: SLA breach for report delivery"
risk_b_impact: "Validation adds 45 minutes to pipeline, pushing against SLA"
paradox_type: Safety-Liveness
mechanism: |
  Each validation step adds latency.
  More validation = safer data but slower processing.
  At some point, the pipeline can't meet time SLA.
net_effect: Negative (SLA risk created exceeds quality risk reduced)
optimal_trade_off:
  description: "Validate only critical fields in real-time; full validation in parallel/async"
  threshold: "Real-time validation budget: 15 minutes max"
constraint: "Data quality mitigations must not add >15 min to critical path"
```

### Security-Usability Paradox
```yaml
risk_a: "RISK-044: Unauthorized data access"
risk_a_mitigation: "Require MFA + VPN + session timeout every 15 minutes"
risk_b: "RISK-055: Shadow IT / workaround usage"
risk_b_impact: "Engineers share credentials, use personal devices to avoid friction"
paradox_type: Security-Usability
mechanism: |
  High security friction → users find workarounds.
  Workarounds are less secure than official path.
  Net security may decrease despite more controls.
net_effect: Potentially negative (workarounds worse than original risk)
optimal_trade_off:
  description: "Risk-based authentication - high friction only for sensitive actions"
  threshold: "Session timeout 4 hours for read-only; 15 min for write"
constraint: "Security controls must not create workaround incentive"
```

### Efficiency-Resilience Paradox
```yaml
risk_a: "RISK-051: Cost overrun"
risk_a_mitigation: "Optimize infrastructure - remove idle capacity, use spot instances"
risk_b: "RISK-011: System unavailability during load spike"
risk_b_impact: "No headroom for spikes; spot instances can be revoked"
paradox_type: Efficiency-Resilience
mechanism: |
  Efficient = no waste = no slack.
  No slack = no buffer for unexpected load.
  Spot instances = cheap but unreliable.
  Cost savings bought with reliability risk.
net_effect: Negative during incidents; positive otherwise
optimal_trade_off:
  description: "Reserved capacity for critical path; spot for non-critical batch"
  threshold: "Minimum 30% headroom on critical path; spot only for <P2 workloads"
constraint: "Cost optimization cannot reduce critical path headroom below 30%"
```

### Transparency-Security Paradox
```yaml
risk_a: "RISK-066: Audit failure due to insufficient logging"
risk_a_mitigation: "Log all data access with full query details and results"
risk_b: "RISK-044: Data breach / exfiltration"
risk_b_impact: "Logs now contain sensitive data; logs become target"
paradox_type: Transparency-Security
mechanism: |
  Detailed logging for audit = logging sensitive data.
  Logs are often less protected than primary data.
  Attacker can exfiltrate via logs.
net_effect: Mixed - audit risk down, breach risk up
optimal_trade_off:
  description: "Log access patterns, not data contents; tokenize sensitive values"
  threshold: "No PII or business-sensitive values in logs"
constraint: "Audit logging must not replicate sensitive data in less-secure location"
```

## Interaction Matrix Template

Use this to systematically check all pairs:

```
              RISK-A  RISK-B  RISK-C  RISK-D
RISK-A mit.     -       ↑       ↓       ·
RISK-B mit.     ·       -       ↓       ·
RISK-C mit.     ·       ·       -       ↑
RISK-D mit.     ·       ·       ·       -

Legend:
↑ = Mitigating row risk increases column risk (PARADOX)
↓ = Mitigating row risk decreases column risk (SYNERGY)
· = No interaction
```

## Resolving Paradoxes

When paradox is identified:

1. **Acknowledge the trade-off:** Don't pretend it doesn't exist
2. **Find the Pareto frontier:** What's the best achievable point?
3. **Make explicit choice:** Document which side you prioritize
4. **Set constraints:** Encode limits in mitigation design
5. **Monitor both sides:** Track both risks as you mitigate
