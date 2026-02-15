# 107 - Contraposition Failure Guarantee

## Phase
IDENTIFY (Vertical)

## Purpose
Instead of asking "what leads to success," ask "what GUARANTEES failure?" then check if the current plan does any of those things. Based on logical contraposition: if A->B, then NOT-B->NOT-A. Finding guaranteed failure conditions is often easier and more rigorous than finding success conditions.

## Logical Foundation

**Contraposition principle:**
- If "doing X leads to success" is true
- Then "NOT having success means NOT doing X" is also true
- Inversely: "doing NOT-X guarantees NOT-success"

Finding failure guarantees is often more tractable because:
- Success has many sufficient conditions (any can work)
- Failure has many necessary conditions (any missing one fails)
- Humans reason better about concrete failures than abstract successes

## Procedure

### Step 1: Define Success Criteria
What does success look like for this project/decision?
Be specific and measurable.

### Step 2: Generate Failure Guarantees
Invert: "What would GUARANTEE this fails?"
Generate at least 10 failure guarantees.

### Step 3: Classify Guarantees

| Type | Source | Confidence |
|------|--------|------------|
| **Theorem-based** | Mathematical/logical impossibility | 100% - proven |
| **Empirical** | Historical data, base rates | High - observed |
| **Structural** | Architecture prevents success | High - by design |
| **Practical** | Common failure patterns | Medium - typical |

### Step 4: Check Current Plan
For each failure guarantee: Is this present in the current plan?
- Present = guaranteed failure (fix immediately)
- Absent = one less failure mode

### Step 5: Theorem Integration
Where known theorems apply, these are PROVEN failure guarantees:

| Theorem | Guarantee | If Present, Then... |
|---------|-----------|---------------------|
| **FLP** | Async consensus + crash failures + no synchrony | GUARANTEED deadlock possible |
| **CAP** | Full C + Full A + P tolerance | GUARANTEED impossible |
| **Halting** | Universal termination checker | GUARANTEED undecidable |
| **M-S** | Strategy-proof + IR + efficient + budget balanced | GUARANTEED impossible |
| **Arrow** | All voting fairness criteria | GUARANTEED impossible |

## Output Schema
```yaml
failure_guarantees:
  - guarantee: "Statement of what guarantees failure"
    type: "[Theorem|Empirical|Structural|Practical]"
    source: "Theorem name or evidence source"
    present_in_plan: "[Yes|No|Partially]"
    how_present: "Where in the plan this appears"
    severity: "[Critical|High|Medium]"
    remediation: "How to remove this guarantee"
```

## Quality Checks
- [ ] At least 10 failure guarantees generated
- [ ] Theorem-based guarantees checked against architecture
- [ ] Each guarantee checked against current plan
- [ ] Remediation identified for present guarantees
- [ ] Zero tolerance for theorem violations

## Connections
- Feeds into: #201 (probability = 1.0 for theorem violations), #401 (must TERMINATE theorem violations)
- Uses output from: Architecture documentation, Deep-Verify theorem checks
- Related to: Deep-Verify theorem analysis

## Examples

### Theorem-Based Guarantees
```yaml
- guarantee: "Claiming consistent + available + partition-tolerant distributed system"
  type: Theorem
  source: "CAP Theorem"
  present_in_plan: Yes
  how_present: "Architecture doc claims 'always consistent and always available'"
  severity: Critical
  remediation: "Acknowledge trade-off, design for chosen two of three"

- guarantee: "Async message system with exactly-once delivery guarantee"
  type: Theorem
  source: "Two Generals Problem"
  present_in_plan: Partially
  how_present: "Message queue configured for 'exactly-once' but no idempotency"
  severity: High
  remediation: "Implement idempotent consumers, accept at-least-once"
```

### Practical Guarantees
```yaml
- guarantee: "No testing before production deployment"
  type: Practical
  source: "Empirical - every project that skipped testing had production bugs"
  present_in_plan: No
  how_present: "N/A"
  severity: N/A
  remediation: N/A

- guarantee: "Single person knows critical process + no documentation"
  type: Practical
  source: "Empirical - knowledge loss on departure is certain"
  present_in_plan: Yes
  how_present: "Deployment process only documented in John's head"
  severity: High
  remediation: "Document process, cross-train team member"

- guarantee: "No monitoring + distributed system"
  type: Practical
  source: "Empirical - undetected failures are certain in distributed systems"
  present_in_plan: Partially
  how_present: "Monitoring exists but only for happy path"
  severity: High
  remediation: "Add error rate, latency percentiles, heartbeat monitoring"
```

### Structural Guarantees
```yaml
- guarantee: "Synchronous calls through 5+ services for user request"
  type: Structural
  source: "Latency multiplication - each hop adds tail latency"
  present_in_plan: Yes
  how_present: "Request path: Gateway -> Auth -> API -> Service -> Database"
  severity: Medium
  remediation: "Add caching, async where possible, circuit breakers"

- guarantee: "All eggs in one basket (single cloud region)"
  type: Structural
  source: "Region failures happen; single region = total outage"
  present_in_plan: Yes
  how_present: "All infrastructure in West Europe only"
  severity: High
  remediation: "Add failover region or accept downtime risk explicitly"
```

## Anti-Patterns to Detect

These are common "failure guarantee" patterns to check for:

1. **Claims of perfection**: "100% uptime", "zero bugs", "always consistent"
2. **Missing basics**: No backups, no monitoring, no documentation, no testing
3. **Theorem violations**: CAP, FLP, Halting, Arrow
4. **Single points of failure**: One person, one region, one vendor, one path
5. **Implicit assumptions**: "This will never happen", "They would never do that"
6. **Undefined failure modes**: No error handling, no timeout, no retry policy
