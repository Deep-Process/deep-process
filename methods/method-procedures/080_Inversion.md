# Method #80: Inversion

## Classification
- **Category:** Core
- **Phase:** Implementation
- **Purpose:** Find success by identifying and avoiding failure paths

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Instead of how to succeed, ask how to guarantee failure, then avoid      │
│   those paths - reveals hidden obstacles"                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Inspired by Charlie Munger: "Invert, always invert."

## Execution Protocol

### Step 1: State the Goal

Define what success looks like:

```markdown
## Goal Definition

SUCCESS: Launch a reliable authentication system

Key success criteria:
- Users can log in consistently
- No unauthorized access
- System handles load
- Users trust the system
```

### Step 2: Invert - How to Guarantee Failure

Ask: "How would I GUARANTEE this project fails?"

```markdown
## Guaranteed Failure Paths

### Technical Failures
1. Store passwords in plain text
2. Skip rate limiting on login attempts
3. Use synchronous calls for everything
4. No monitoring or alerting
5. Single point of failure in architecture
6. No backup or recovery plan

### Process Failures
7. Skip security review
8. No load testing before launch
9. Launch on Friday afternoon
10. No rollback plan
11. No documentation
12. No incident response process

### People Failures
13. Don't involve security team
14. Assume users will behave correctly
15. Ignore edge cases as "won't happen"
16. Rush to meet arbitrary deadline
17. No knowledge transfer / bus factor = 1
```

### Step 3: Check Current Plan Against Failures

For each failure path, verify your plan avoids it:

```markdown
## Failure Avoidance Check

| # | Failure Path | Our Plan Avoids? | How |
|---|--------------|------------------|-----|
| 1 | Plain text passwords | ✅ YES | bcrypt with cost 12 |
| 2 | No rate limiting | ❌ NO | NOT IN PLAN |
| 3 | All synchronous | ✅ YES | Async email/SMS |
| 4 | No monitoring | ❌ NO | NOT IN PLAN |
| 5 | Single point of failure | ✅ YES | Multi-AZ deployment |
| 6 | No backup | ❌ NO | NOT IN PLAN |
| 7 | Skip security review | ✅ YES | Scheduled for week 3 |
| 8 | No load testing | ❌ NO | NOT IN PLAN |
| ... | ... | ... | ... |

GAPS FOUND: 4 failure paths not addressed
```

### Step 4: Close the Gaps

Add mitigation for each unaddressed failure:

```markdown
## Gap Closure Plan

### Gap 1: No rate limiting
- Failure risk: Brute force attacks succeed
- Mitigation: Add rate limiting (10 attempts/min/IP)
- Added to: Architecture doc, Sprint backlog

### Gap 2: No monitoring
- Failure risk: Issues go undetected
- Mitigation: Add auth metrics dashboard + alerts
- Added to: Sprint 2 tasks

### Gap 3: No backup
- Failure risk: Data loss unrecoverable
- Mitigation: Daily backups + point-in-time recovery
- Added to: Infrastructure requirements

### Gap 4: No load testing
- Failure risk: Launch fails under real load
- Mitigation: Load test at 3x expected traffic
- Added to: Launch checklist
```

---

## Output Template

```markdown
## Inversion Analysis

### Goal
{What success looks like}

### Guaranteed Failure Paths

| # | Category | Failure Path | Severity |
|---|----------|--------------|----------|
| 1 | Technical | {failure} | CRITICAL |
| 2 | Process | {failure} | HIGH |
| ... | ... | ... | ... |

### Failure Avoidance Matrix

| # | Failure Path | Avoided? | Mitigation |
|---|--------------|----------|------------|
| 1 | {failure} | ✅/❌ | {how or NONE} |

### Gaps Identified: {count}

**Gap {N}: {Failure Path}**
- Risk: {what happens}
- Mitigation: {solution}
- Action: {what to add to plan}

### Updated Plan Elements
[List of additions to close gaps]

### Verdict
[ ] All failure paths avoided - plan is robust
[ ] Gaps closed with mitigations - plan updated
[ ] Critical gaps remain - escalate
```

---

## Failure Categories

### Technical Failures
- Security vulnerabilities
- Performance bottlenecks
- Single points of failure
- Data integrity risks
- Integration failures
- Scaling limitations

### Process Failures
- Missing reviews/approvals
- Inadequate testing
- No rollback capability
- Poor timing (launches, dependencies)
- Missing documentation
- No incident response

### People Failures
- Key person dependency
- Communication gaps
- Stakeholder misalignment
- Skill gaps
- Burnout/rushed work
- Unclear ownership

### External Failures
- Vendor/dependency failures
- Compliance violations
- Market timing issues
- Competitor actions
- Economic changes

---

## Integration with Deep-Process

### When to Execute
- **Planning phase** - Before finalizing architecture
- **Pre-launch** - Final check before go-live
- **Risk assessment** - Complement to risk register
- **Post-mortem** - Identify what wasn't inverted

### Synergy with Other Methods
- **#71 First Principles** - Question assumptions that lead to failure
- **#72 5 Whys** - Understand WHY each failure would occur
- **#87 Falsifiability** - Make failure detection testable

### State Update
```yaml
execution:
  inversion:
    failure_paths_identified: 17
    avoided: 13
    gaps_found: 4
    gaps_closed: 4
```

---

## Example: Startup Launch Inversion

### Goal
Launch MVP successfully, acquire first 100 users

### Guaranteed Failure Paths

| # | How to Fail | Severity |
|---|-------------|----------|
| 1 | Build features nobody wants | CRITICAL |
| 2 | Launch with critical bugs | CRITICAL |
| 3 | Make onboarding confusing | HIGH |
| 4 | Have no feedback channel | HIGH |
| 5 | Run out of money before traction | CRITICAL |
| 6 | Compete on features with incumbents | HIGH |
| 7 | Ignore early user feedback | HIGH |
| 8 | Scale before product-market fit | MEDIUM |
| 9 | Hire too fast | MEDIUM |
| 10 | Have no differentiation | CRITICAL |

### Avoidance Plan

| Failure | Avoidance Strategy |
|---------|---------------------|
| Build wrong thing | Customer interviews before building |
| Critical bugs | Manual QA + dogfooding week |
| Confusing onboarding | User testing with 5 people |
| No feedback | In-app feedback widget + user interviews |
| Run out of money | 18-month runway, monthly burn review |
| Feature competition | Compete on UX and niche |
| Ignore feedback | Weekly user call, feature voting |
| Premature scaling | Wait for 100 active users |
| Hire too fast | Only hire after 3 months validated need |
| No differentiation | Clear positioning doc, say no to "me too" |

---

## Advanced: Pre-Mortem

Combine Inversion with time-travel:

```markdown
## Pre-Mortem

Imagine it's 6 months from now. The project has FAILED spectacularly.

Write the post-mortem:

"The authentication system failed because:
1. We didn't anticipate the load from viral growth
2. The security review found issues too late to fix
3. Key engineer left with undocumented knowledge
4. Users bypassed 2FA by social engineering support
5. Competitor launched similar feature first"

Now: What would we do TODAY to prevent each?
```

---

## Anti-Patterns to Avoid

1. **Superficial inversion** - Only listing obvious failures
2. **Ignoring uncomfortable truths** - "That won't happen to us"
3. **No action on gaps** - Identifying but not closing
4. **Over-engineering** - Avoiding every conceivable failure (diminishing returns)
5. **Pessimism paralysis** - So focused on failure you don't ship

---

## Method Rationale

This method exists because:
- We're biased toward optimistic planning
- Failure modes are often obvious in retrospect
- Prevention is cheaper than recovery
- Inverting perspective reveals blind spots

The goal is not pessimism but robust planning that survives contact with reality.
