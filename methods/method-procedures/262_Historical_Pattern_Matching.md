# 106 - Historical Pattern Matching (Survivorship-Corrected)

## Phase
IDENTIFY (Vertical)

## Purpose
Search for analogies from past projects, industry incidents, and known anti-patterns - while actively correcting for survivorship bias.

## Pattern Libraries

### Data Engineering
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| Schema drift | No validation layer, multiple upstream sources | Silent data corruption |
| Silent corruption | Missing row counts, no checksums | Wrong reports, late discovery |
| Pipeline backpressure | No rate limiting, unbounded queues | Cascade failure, data loss |
| Zombie jobs | No heartbeat monitoring, stale checkpoints | Resource waste, stale data |
| Merge storms | Concurrent writes to same partition | Exponential retry, timeout |
| Credential expiry | No rotation, no expiry alerts | Production outage at worst time |
| Cost explosion | No budget alerts, auto-scaling without limits | Surprise bills, budget exhaustion |

### Cloud Architecture
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| Region outage | No multi-region, no failover tested | Total outage |
| Cold start cascades | Serverless at scale, traffic spike | Latency spike, timeout |
| Noisy neighbor | Shared tenancy, no isolation | Unpredictable performance |
| Terraform state drift | Manual changes, no drift detection | Destroy resources on apply |
| Quota exhaustion | No quota monitoring, rapid scaling | Service denial |

### Enterprise Integration
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| API version mismatch | No contract testing, loose coupling | Silent failures |
| Timeout cascading | Synchronous calls, no circuit breakers | System-wide slowdown |
| Retry storms | Aggressive retries, no backoff | Amplified failures |
| Data format evolution | No schema registry, implicit contracts | Integration breaks |
| Certificate expiry | Manual renewal, no alerts | Production outage |

### Project Management
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| 90% done syndrome | No definition of done, vague milestones | Endless almost-done |
| Integration hell | Late integration, no CI/CD | Last-minute chaos |
| Second system effect | Rewrite with scope expansion | Over-engineering, delay |
| Scope creep | No change control, verbal commitments | Deadline miss |
| Brooks's law | Late staff additions, complex onboarding | Further delays |

### Business Strategy
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| Innovator's dilemma | Established player, dismissing disruption | Market displacement |
| Winner's curse | Competitive bid, pressure to win | Unprofitable engagement |
| Premature scaling | Scaling before product-market fit | Burn rate, pivot failure |
| Platform dependency | Single platform, no exit strategy | Lock-in exploitation |

### Security
| Pattern | Warning Signs | Typical Outcome |
|---------|--------------|-----------------|
| Supply chain attack | No dependency scanning, popular packages | Compromised build |
| Credential stuffing | Shared passwords, no MFA | Account takeover |
| Privilege escalation | Complex permissions, no audit | Unauthorized access |
| Insider threat | No separation of duties, trust-based access | Data exfiltration |
| Dependency confusion | Mixed public/private packages | Malicious code execution |

## Procedure

### Step 1: Project Description
Describe the project/decision in one paragraph - key characteristics, technology, team, timeline.

### Step 2: Pattern Search
Search each pattern library: "What historical failures look like ours?"

### Step 3: Match Analysis
For each match, document:
- Root cause of historical failure
- Warning signs present
- Outcome severity
- Our similarity score

### Step 4: Survivorship Correction
After matching, explicitly ask:
- "How many projects/companies failed this exact way and we never heard about it?"
- "Are we only seeing the patterns of those who survived?"
- "What does the BASE RATE of failure look like for this type of project?"

**Adjustment:** Increase probability estimates upward - things are probably worse than case studies suggest.

### Step 5: Exposure Assessment
For each pattern match: Are we exhibiting the warning signs?

## Output Schema
```yaml
pattern_matches:
  - pattern_name: "Name from library"
    domain: "[Data Engineering|Cloud|Enterprise|Project|Strategy|Security]"
    similarity: "[Low|Medium|High]"
    similarity_rationale: "Why this applies to us"
    historical_outcome: "What happened in historical cases"
    our_warning_signs: "Which warning signs we exhibit"
    our_exposure: "[Low|Medium|High|Critical]"
    survivorship_adjustment: "Factor applied to account for invisible failures"
    adjusted_probability: "After survivorship correction"
```

## Quality Checks
- [ ] All relevant pattern libraries checked
- [ ] Similarity rationale documented
- [ ] Survivorship bias explicitly considered
- [ ] Warning signs compared to current state
- [ ] Probability estimates adjusted upward

## Connections
- Feeds into: #204 (base rates), #201 (calibrated probability)
- Uses output from: Project description, #101 (risk categories)
- Related to: Theoretical Foundations (Survivorship Bias, Lindy Effect)

## Examples

### Data Pipeline Project
```yaml
pattern_name: "Schema drift"
domain: Data Engineering
similarity: High
similarity_rationale: "We have 5 upstream sources, no schema validation layer"
historical_outcome: "Silent corruption for 3 months before discovery"
our_warning_signs:
  - "No schema validation between sources and warehouse"
  - "Multiple upstream teams making changes"
  - "No schema registry"
our_exposure: High
survivorship_adjustment: "1.5x - many such failures never reported publicly"
adjusted_probability: "70% (from naive 50%)"
```

### Platform Migration
```yaml
pattern_name: "Second system effect"
domain: Project Management
similarity: Medium
similarity_rationale: "Rewriting legacy system with expanded scope"
historical_outcome: "2-3x timeline overrun, feature creep"
our_warning_signs:
  - "Requirements include 'nice to have' features"
  - "No explicit scope freeze"
our_exposure: Medium
survivorship_adjustment: "1.3x - many rewrites quietly abandoned"
adjusted_probability: "40% (from naive 30%)"
```
