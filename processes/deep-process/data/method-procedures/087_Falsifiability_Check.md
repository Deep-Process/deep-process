# Method #87: Falsifiability Check

## Classification
- **Category:** Sanity
- **Phase:** Implementation / Validation
- **Purpose:** Ensure all claims are testable and disprovable

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "For each claim specify what evidence would prove it wrong. Theoretical   │
│   claims may be unfalsifiable by THEOREM not just lack of test."          │
└─────────────────────────────────────────────────────────────────────────────┘
```

A claim that cannot be disproven is either:
1. A tautology (true by definition)
2. Too vague to test
3. Fundamentally unfalsifiable
4. Or against a known impossibility theorem

## Execution Protocol

### Step 1: Extract Claims

List all factual claims from the artifact:

```markdown
## Claims Inventory

| # | Claim | Type | Source |
|---|-------|------|--------|
| 1 | "System is secure" | Capability | Architecture |
| 2 | "Handles 10k concurrent users" | Performance | Requirements |
| 3 | "Always returns correct results" | Correctness | Specification |
| 4 | "Never loses data" | Reliability | Marketing |
| 5 | "AI improves accuracy" | Capability | Feature doc |
```

### Step 2: Define Falsification Criteria

For each claim, specify what would DISPROVE it:

```markdown
## Falsification Criteria

### Claim 1: "System is secure"
**Would be DISPROVEN if:**
- Penetration test finds exploitable vulnerability
- Unauthorized access is achieved
- Data breach occurs
- OWASP scan finds critical issues

**Testable:** YES - run security audits

### Claim 2: "Handles 10k concurrent users"
**Would be DISPROVEN if:**
- Load test at 10k fails
- Response times exceed SLA at 10k
- Errors rate > 0.1% at 10k

**Testable:** YES - run load test

### Claim 3: "Always returns correct results"
**Would be DISPROVEN if:**
- Any single incorrect result found
- Edge case produces wrong output

**Problem:** "Always" is too strong
**Testable:** PARTIALLY - can test known cases, cannot prove ALL

### Claim 4: "Never loses data"
**Would be DISPROVEN if:**
- Single data loss incident
- Recovery fails after failure scenario

**Problem:** "Never" is too strong + depends on failure scenarios
**Testable:** PARTIALLY - can test recovery, cannot guarantee all scenarios

### Claim 5: "AI improves accuracy"
**Would be DISPROVEN if:**
- Controlled test shows no improvement
- Accuracy decreases with AI

**Problem:** Compared to what baseline? How measured?
**Testable:** UNCLEAR - needs operationalization
```

### Step 3: Theorem Check

Check claims against known impossibility theorems:

```markdown
## Theorem Violation Check

| Claim | Potentially Violates | Analysis |
|-------|---------------------|----------|
| "Consensus always reached" | FLP Impossibility | YES - async + faults + consensus = impossible |
| "100% availability + consistency" | CAP Theorem | YES - during partitions, must choose |
| "Detects all bugs" | Halting Problem / Rice | YES - non-trivial properties undecidable |
| "Optimal auction mechanism" | Myerson-Satterthwaite | CHECK - may violate efficiency bounds |
```

### Step 4: Classify and Recommend

```markdown
## Classification

| # | Claim | Falsifiable? | Action |
|---|-------|--------------|--------|
| 1 | "System is secure" | YES | Define specific test |
| 2 | "Handles 10k users" | YES | Load test exists |
| 3 | "Always correct" | PARTIALLY | Weaken claim |
| 4 | "Never loses data" | PARTIALLY | Weaken claim |
| 5 | "AI improves accuracy" | UNCLEAR | Operationalize |
| 6 | "Consensus guaranteed" | NO (FLP) | Remove or qualify |
```

---

## Output Template

```markdown
## Falsifiability Analysis

### Claims Analyzed: {count}

### Falsification Table

| # | Claim | Falsifiable? | Would Disprove | Test Method |
|---|-------|--------------|----------------|-------------|
| 1 | {claim} | YES/NO/PARTIAL | {criteria} | {how to test} |

### Theorem Violations

| Claim | Theorem | Violation | Recommendation |
|-------|---------|-----------|----------------|
| {claim} | {theorem} | YES/NO | {action} |

### Banned Phrases Found

| Phrase | Context | Replacement |
|--------|---------|-------------|
| {phrase} | {where} | {better version} |

### Recommendations

1. **Weaken claim X:** "{original}" → "{qualified version}"
2. **Operationalize claim Y:** Define measurement for "{vague term}"
3. **Remove claim Z:** Violates {theorem}, cannot be true

### Verdict
[ ] All claims falsifiable - proceed
[ ] Some claims weakened - update document
[ ] Unfalsifiable claims remain - escalate
```

---

## Banned Absolute Claims

These phrases require qualification or removal:

| Banned | Why | Better |
|--------|-----|--------|
| "always" | Cannot verify all cases | "in tested scenarios" |
| "never" | Cannot verify all scenarios | "not in tested failure modes" |
| "100%" | Perfect systems don't exist | "99.9%" or specific SLA |
| "impossible" | May just be unknown how | "not achievable with current approach" |
| "guaranteed" | Implies certainty | "designed to ensure" |
| "completely" | Totality claims | "extensively" |
| "perfectly" | Perfection is unfalsifiable | "within specifications" |
| "all" | Universal claims | "tested cases" |
| "no" (as in "no bugs") | Absence claims | "no known bugs" |
| "instant" | Implies zero time | "< X ms" |

---

## Impossibility Theorems Quick Reference

### FLP Impossibility
```
CONTEXT: Distributed systems
CLAIM: "Consensus is guaranteed in async system with failures"
VIOLATION: Impossible - at least one of {async, failures, consensus} must give
```

### CAP Theorem
```
CONTEXT: Distributed data
CLAIM: "System is consistent, available, and partition-tolerant"
VIOLATION: During partition, must choose consistency OR availability
```

### Halting Problem / Rice's Theorem
```
CONTEXT: Program analysis
CLAIM: "Detects all X" or "Guarantees termination for all programs"
VIOLATION: Non-trivial properties of programs are undecidable
```

### Myerson-Satterthwaite
```
CONTEXT: Mechanism design / auctions
CLAIM: "Efficient, budget-balanced, individually rational, incentive compatible"
VIOLATION: Cannot have all four simultaneously
```

### Arrow's Impossibility
```
CONTEXT: Voting systems
CLAIM: "Fair voting system satisfying all criteria"
VIOLATION: No system satisfies unrestricted domain, Pareto, IIA, non-dictatorship
```

### No Free Lunch
```
CONTEXT: Optimization / ML
CLAIM: "Algorithm X is best for all problems"
VIOLATION: No algorithm outperforms random across all possible problems
```

---

## Integration with Deep-Process

### When to Execute
- **Requirements phase** - Catch impossible requirements early
- **Architecture phase** - Verify claims are testable
- **Validation phase** - Ensure semantic_hash facts are falsifiable

### Semantic Hash Integration
```yaml
# BAD - unfalsifiable
semantic_hash:
  - "System is fast"
  - "Always works correctly"

# GOOD - falsifiable
semantic_hash:
  - "API response p95 < 200ms"
  - "Passes test suite v2.3"
```

### State Update
```yaml
validation:
  falsifiability:
    claims_checked: 8
    falsifiable: 5
    unfalsifiable: 2
    theorem_violations: 1
    claims_weakened: 2
```

---

## Anti-Patterns to Avoid

1. **Vague tests** - "We'll know it when we see it"
2. **Untestable timelines** - "Eventually will be stable"
3. **Subjective criteria** - "Users will be happy"
4. **Moving goalposts** - Changing criteria after failure
5. **Ignoring theorems** - "We'll figure it out"

---

## Method Rationale

This method exists because:
- Unfalsifiable claims cannot be verified
- Marketing language creeps into technical docs
- Impossibility theorems are often unknown or ignored
- Testable claims enable objective evaluation

The goal is ensuring every claim can be tested and potentially disproven - if it can't be tested, it shouldn't be a requirement.
