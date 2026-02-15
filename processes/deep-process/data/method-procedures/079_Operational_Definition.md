# Method #79: Operational Definition

## Classification
- **Category:** Core
- **Phase:** Implementation
- **Purpose:** Convert abstract concepts into measurable operations

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Convert abstract concept into observable measurable operations -         │
│   makes fuzzy concepts testable"                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## The Operationalization Process

```
ABSTRACT CONCEPT → OBSERVABLE INDICATORS → MEASUREMENT PROCEDURE → TESTABLE DEFINITION
```

## Execution Protocol

### Step 1: Identify Abstract Terms

Find fuzzy, unmeasurable terms in requirements:

```markdown
## Abstract Terms Found

| Term | Context | Measurable? |
|------|---------|-------------|
| "fast" | "System should be fast" | NO |
| "user-friendly" | "Create user-friendly interface" | NO |
| "secure" | "Must be secure" | NO |
| "scalable" | "Should scale well" | NO |
| "reliable" | "System must be reliable" | NO |
| "high quality" | "Deliver high quality code" | NO |
```

### Step 2: Define Observable Indicators

For each abstract term, identify what you'd OBSERVE if it were true:

```markdown
## Observable Indicators

### "Fast"
If the system is fast, we would observe:
- API responses return quickly
- Pages render without delay
- Users don't wait for operations

### "Secure"
If the system is secure, we would observe:
- No unauthorized access succeeds
- Data cannot be intercepted
- Attacks are blocked or logged
```

### Step 3: Create Measurement Procedures

Specify exactly HOW to measure each indicator:

```markdown
## Measurement Procedures

### "Fast" → Response Time
PROCEDURE:
1. Send 1000 requests to each endpoint
2. Record response time for each
3. Calculate p50, p95, p99 percentiles
4. Compare against threshold

THRESHOLD: p95 < 200ms, p99 < 500ms

### "Secure" → Vulnerability Scan
PROCEDURE:
1. Run OWASP ZAP scan
2. Run dependency vulnerability check
3. Perform penetration test (quarterly)
4. Count findings by severity

THRESHOLD: 0 critical, 0 high, <5 medium
```

### Step 4: Write Testable Definitions

Combine into operational definitions:

```markdown
## Operational Definitions

### "Fast"
**Definition:** A system is "fast" when:
- 95th percentile response time < 200ms
- 99th percentile response time < 500ms
- Page load time (LCP) < 2.5 seconds
- Time to interactive (TTI) < 3.5 seconds

**Measurement:** Load test with k6, Lighthouse audit

### "Secure"
**Definition:** A system is "secure" when:
- OWASP ZAP scan shows 0 high/critical issues
- All dependencies have no known CVEs (critical/high)
- Penetration test finds no exploitable vulnerabilities
- Authentication passes NIST 800-63B guidelines

**Measurement:** Automated scans in CI, quarterly pen test

### "Scalable"
**Definition:** A system is "scalable" when:
- Response time degrades < 10% at 10x current load
- Can add capacity without code changes
- Horizontal scaling adds linear capacity

**Measurement:** Load test at 2x, 5x, 10x baseline
```

---

## Output Template

```markdown
## Operational Definition Analysis

### Abstract Terms Identified: {count}

### Operationalization Table

| Abstract Term | Observable Indicators | Measurement | Threshold |
|---------------|----------------------|-------------|-----------|
| {term} | {what you'd see} | {how to measure} | {pass/fail} |

### Full Definitions

#### {Term 1}

**Original:** "{fuzzy requirement}"

**Operational Definition:**
{Term} means:
1. {Specific measurable criterion 1}
2. {Specific measurable criterion 2}

**Measurement Procedure:**
{Step-by-step how to verify}

**Pass Criteria:**
{Specific thresholds}

---

### Unmeasurable Terms (Flagged)

| Term | Why Unmeasurable | Recommendation |
|------|------------------|----------------|
| {term} | {reason} | {action} |

### Verdict
[ ] All terms operationalized
[ ] Some terms need clarification (Decision Point)
[ ] Terms fundamentally unmeasurable (escalate)
```

---

## Banned Words Without Quantification

These words MUST be operationalized:

| Banned | Requires |
|--------|----------|
| fast | < X ms at pY |
| slow | > X ms at pY |
| quick | < X time units |
| easy | < X steps/clicks |
| hard | > X complexity |
| simple | < X components |
| complex | > X interactions |
| good | {specific quality metric} |
| bad | {specific defect metric} |
| better | {comparative metric} |
| efficient | < X resources per Y |
| secure | {specific security standard} |
| reliable | > X% uptime |
| scalable | {load multiplier} |
| user-friendly | {usability metric} |
| high quality | {quality metrics} |
| robust | {failure handling} |

---

## Integration with Deep-Process

### When to Execute
- **Requirements gathering** - Operationalize fuzzy terms immediately
- **Architecture decisions** - Make trade-offs measurable
- **Acceptance criteria** - Define done operationally
- **Validation** - Check all claims are testable

### YAML Header Integration
```yaml
semantic_hash:
  - "Performance: p95 response < 200ms"  # Operational
  - "Security: OWASP ZAP clean"          # Operational
  - "Scalability: Linear to 10x load"    # Operational
  # NOT: "System is fast"                # Abstract - BANNED
```

### State Update
```yaml
execution:
  operational_definition:
    abstract_terms_found: 8
    operationalized: 7
    unmeasurable: 1
    decision_point_created: true
```

---

## Examples

### Example 1: "User-Friendly"

**Abstract:** "The interface should be user-friendly"

**Operational:**
```
"User-friendly" means:
1. New users complete core task in < 3 minutes (first use)
2. Error rate < 5% for common operations
3. System Usability Scale (SUS) score > 68
4. Help/support requests < 2% of sessions
5. Task completion rate > 95% for trained users

Measurement:
- Usability testing with 5 users
- Analytics tracking completion/error rates
- SUS survey at end of onboarding
```

### Example 2: "Scalable"

**Abstract:** "The system should scale well"

**Operational:**
```
"Scalable" means:
1. Handles 10x current load without architecture changes
2. Response time increases < 20% at 5x load
3. Adding nodes increases capacity linearly (±10%)
4. Cost per transaction remains constant at scale

Measurement:
- Load test at 2x, 5x, 10x baseline (monthly)
- Track cost-per-transaction in production
- Verify horizontal scaling in staging
```

### Example 3: "High Quality Code"

**Abstract:** "We need high quality code"

**Operational:**
```
"High quality code" means:
1. Test coverage > 80% (lines), > 90% (branches for critical paths)
2. Static analysis: 0 critical, 0 high, < 10 medium issues
3. Cyclomatic complexity < 10 per function
4. Code review approval from 2 reviewers
5. Documentation coverage > 90% for public APIs
6. No known security vulnerabilities in dependencies

Measurement:
- CI pipeline enforces all thresholds
- Weekly quality report from SonarQube
- Dependency scan via Snyk/Dependabot
```

---

## Anti-Patterns to Avoid

1. **Fake precision** - "Response time should be approximately around 200ms-ish"
2. **Unmeasurable metrics** - "User satisfaction should be high"
3. **Moving goalposts** - Changing definition after measurement
4. **Vanity metrics** - Measuring what's easy, not what matters
5. **Over-specification** - 47 criteria for "good" (pick the important ones)

---

## Method Rationale

This method exists because:
- Abstract requirements cause disagreement about "done"
- Unmeasurable goals can't be verified
- Specific numbers enable objective decisions
- Teams align when success is clearly defined

The goal is making every requirement testable: if you can't measure it, you can't manage it.
