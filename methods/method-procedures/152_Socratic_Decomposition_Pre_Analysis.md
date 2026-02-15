# Method #152: Socratic Decomposition Pre-Analysis

## Classification
- **Category:** Core
- **Phase:** Implementation
- **Purpose:** Decompose complex problems into atomic questions

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Decompose problem into atomic sub-questions and answer each independently │
│   - apply 5 Whys only to areas where independent answers contradict"       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Execution Protocol

### Step 1: State the Complex Problem

Define the problem or requirement to analyze:

```markdown
## Problem Statement

PROBLEM: Design authentication system for enterprise SaaS

COMPLEXITY INDICATORS:
- Multiple stakeholders (security, UX, ops)
- Multiple constraints (compliance, performance, usability)
- Multiple solutions possible (OAuth, SAML, custom)
```

### Step 2: Decompose into Atomic Questions

Break into smallest answerable questions:

```markdown
## Question Decomposition

### User Questions
Q1: Who are the users? (Employees, customers, admins?)
Q2: How many concurrent users expected?
Q3: What devices will they use?
Q4: What's their technical sophistication?

### Security Questions
Q5: What compliance requirements exist? (SOC2, GDPR, HIPAA?)
Q6: What's the sensitivity of protected data?
Q7: Is MFA required? For whom?
Q8: What's the acceptable session duration?

### Technical Questions
Q9: What existing identity systems exist?
Q10: What's the latency budget for auth?
Q11: What's the availability requirement?
Q12: How should password recovery work?

### Business Questions
Q13: What's the budget for auth infrastructure?
Q14: What's the timeline?
Q15: Are there existing vendor relationships?
Q16: What's the cost of a security breach?
```

### Step 3: Answer Each Independently

Answer without reference to other answers:

```markdown
## Independent Answers

| Q# | Question | Independent Answer |
|----|----------|-------------------|
| Q1 | Who are users? | B2B employees + some external partners |
| Q2 | Concurrent users? | 10,000 peak |
| Q3 | Devices? | Laptops + mobile (60/40) |
| Q4 | Technical level? | Mixed (IT admins to non-technical) |
| Q5 | Compliance? | SOC2 required, HIPAA for some clients |
| Q6 | Data sensitivity? | HIGH (financial + personal data) |
| Q7 | MFA required? | Yes for all users (compliance) |
| Q8 | Session duration? | 8 hours with refresh |
| Q9 | Existing systems? | Most clients have Okta or Azure AD |
| Q10 | Latency budget? | <200ms for auth flow |
| Q11 | Availability? | 99.9% |
| Q12 | Password recovery? | Self-service with manager approval |
| Q13 | Budget? | $50k setup + $2k/month |
| Q14 | Timeline? | 3 months |
| Q15 | Vendors? | Existing Okta integration preferred |
| Q16 | Breach cost? | $2M+ (regulatory + reputation) |
```

### Step 4: Check for Contradictions

Compare answers for conflicts:

```markdown
## Contradiction Analysis

### Comparing Answers

| Q-Pair | Answers | Contradiction? |
|--------|---------|----------------|
| Q4 + Q7 | Non-technical users + MFA required | ⚠️ POTENTIAL |
| Q10 + Q7 | 200ms latency + MFA | ⚠️ POTENTIAL |
| Q13 + Q6 | $50k budget + HIGH sensitivity | ⚠️ POTENTIAL |
| Q14 + Q11 | 3 months + 99.9% availability | ⚠️ POTENTIAL |

### Contradiction Details

**C1: Non-technical users + MFA**
- Q4 says users are non-technical
- Q7 requires MFA for all
- Conflict: MFA friction vs usability
- Resolution needed: YES

**C2: Latency + MFA**
- Q10 requires 200ms
- Q7 requires MFA
- Analysis: MFA can add 2-5s for user input
- Conflict: NO - 200ms is system latency, MFA is user interaction

**C3: Budget + Sensitivity**
- Q13: $50k setup
- Q6: HIGH sensitivity, Q16: $2M breach cost
- Analysis: $50k may be insufficient for HIGH security
- Conflict: POSSIBLE - needs investigation

**C4: Timeline + Availability**
- Q14: 3 months
- Q11: 99.9% availability
- Analysis: Can we build reliable system in 3 months?
- Conflict: POSSIBLE - needs investigation
```

### Step 5: Apply 5 Whys to Contradictions

Only dive deep where contradictions exist:

```markdown
## Targeted 5 Whys

### Contradiction C1: Non-technical users + MFA requirement

**Why is MFA required?**
← Compliance (SOC2)

**Why is SOC2 compliance needed?**
← Enterprise clients require it for vendor assessment

**Why do enterprise clients require it?**
← Their security policies mandate it

**Why can't we have exceptions?**
← Compliance is binary - either compliant or not

**ROOT:** Cannot avoid MFA; must make it user-friendly

**Resolution:** Use push notifications (Duo/Okta Verify) instead of TOTP codes

---

### Contradiction C3: Budget vs Sensitivity

**Why is budget $50k?**
← Initial allocation from product budget

**Why wasn't security budget separate?**
← Auth seen as feature, not infrastructure

**Why does high sensitivity need more budget?**
← Better tools, audits, redundancy cost money

**Why can't we use cheaper options?**
← Cheap auth for sensitive data creates unacceptable risk

**ROOT:** Budget underestimates security needs for data sensitivity

**Resolution:** Create Decision Point - increase budget or accept higher risk
```

### Step 6: Synthesize Consistent Whole

Combine resolved answers:

```markdown
## Synthesis

### Resolved Design Constraints

1. **Users:** B2B employees + partners, mixed technical levels
2. **Scale:** 10,000 concurrent, 99.9% availability
3. **Security:** SOC2 + HIPAA compliant, MFA required
4. **UX:** Push-based MFA for non-technical users
5. **Integration:** Okta/Azure AD federation (existing client systems)
6. **Performance:** <200ms system latency
7. **Timeline:** 3 months
8. **Budget:** DECISION POINT NEEDED (current $50k vs recommended $100k)

### Design Recommendation

Given synthesis, recommend:
- Federated auth via Okta (most clients have it)
- Push MFA (usability for non-technical users)
- Fallback TOTP for edge cases
- 8-hour sessions with silent refresh

### Open Decision Point
DP-XXX: Budget for auth infrastructure
- Option A: $50k (higher risk, basic implementation)
- Option B: $100k (lower risk, enterprise-grade)
```

---

## Output Template

```markdown
## Socratic Decomposition Analysis

### Problem
{Complex problem statement}

### Decomposition
{List of atomic questions}

### Independent Answers

| Q# | Question | Answer |
|----|----------|--------|
| 1 | {q} | {a} |

### Contradictions Found: {count}

| Contradiction | Questions | Resolution Status |
|---------------|-----------|-------------------|
| {description} | Q{x} vs Q{y} | RESOLVED/OPEN |

### 5 Whys Applied To:
- {Contradiction 1}: {root cause} → {resolution}
- {Contradiction 2}: {root cause} → {resolution}

### Synthesis
{Consistent set of resolved answers}

### Decision Points Created
{If contradictions couldn't be resolved}

### Verdict
[ ] All questions answered consistently - proceed
[ ] Contradictions resolved - proceed with synthesis
[ ] Decision points created - await user input
```

---

## Integration with Deep-Process

### When to Execute
- **Complex requirements** - Multiple constraints to balance
- **Architecture decisions** - Many factors to consider
- **Planning** - When estimates have many variables
- **Conflict resolution** - When stakeholders disagree

### Synergy with Other Methods
- Feeds into **#72 5 Whys** for contradictions only
- Produces inputs for **#154 Contradiction Detector**
- Results inform **#79 Operational Definitions**

### State Update
```yaml
execution:
  socratic_decomposition:
    questions_identified: 16
    contradictions_found: 4
    resolved: 3
    decision_points_created: 1
```

---

## Method Rationale

This method exists because:
- Complex problems have many interacting parts
- Answering holistically hides internal contradictions
- Independent answers reveal hidden conflicts
- Targeted deep dives save effort vs. analyzing everything

The goal is finding where the hard problems actually lie, not spreading analysis uniformly.
