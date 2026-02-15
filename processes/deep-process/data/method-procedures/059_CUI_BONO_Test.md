# Method #59: CUI BONO Test

## Classification
- **Category:** Anti-Bias
- **Mandatory Phase:** Validation (ALWAYS before COMMITTED)
- **Purpose:** Detect decisions that benefit agent over user

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "For every decision ask who benefits - if it benefits AGENT (easier work) │
│   that's a red flag requiring justification"                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

CUI BONO = "Who benefits?" (Latin)

## Execution Protocol

### Step 1: Decision Inventory

List ALL decisions/recommendations in the output:

```
DECISION INVENTORY:
1. [Decision 1] - brief description
2. [Decision 2] - brief description
3. [Recommendation 1] - brief description
...
```

Include both:
- **Explicit decisions** - stated recommendations
- **Implicit decisions** - things NOT done/mentioned

### Step 2: Beneficiary Analysis

For each decision, classify:

| Beneficiary | Description | Status |
|-------------|-------------|--------|
| **AGENT** | Makes work easier, avoids complexity, shortcuts | RED FLAG |
| **USER** | Better outcome, even if harder to implement | ACCEPTABLE |
| **BOTH** | Genuinely serves both equally | ACCEPTABLE |
| **NEITHER** | Neutral, no clear beneficiary | EXAMINE |

### Step 3: Red Flag Justification

For each AGENT-benefit decision:
1. **Acknowledge** it benefits the agent
2. **Justify** why it's still the right choice
3. **Offer alternative** that would benefit user more
4. **Let user decide** if trade-off is acceptable

---

## Output Template

```markdown
## CUI BONO Analysis

### Decision Inventory

| # | Decision | Beneficiary | Justification |
|---|----------|-------------|---------------|
| 1 | Use monolith instead of microservices | USER | Faster MVP, lower complexity for small team |
| 2 | Skip unit tests for MVP | AGENT | **RED FLAG** - easier but risky |
| 3 | PostgreSQL over custom solution | BOTH | Proven, well-documented, appropriate scale |

### Red Flag Analysis

**Decision #2: Skip unit tests for MVP**
- Agent benefit: Less work, faster delivery
- User cost: Technical debt, regression risk
- Justification: [If any]
- Alternative: Write tests for core business logic only (20% effort, 80% value)
- Recommendation: **Flag for user decision**

### Verdict
[ ] No red flags - proceed
[ ] Red flags present - user decision required
```

---

## Common Agent-Benefit Patterns

Watch for these patterns that often benefit the agent:

### 1. Complexity Avoidance
```
Pattern: "Let's simplify by..."
Check: Is simplification truly better, or just easier to generate?
```

### 2. Scope Narrowing
```
Pattern: "For now, let's focus on..."
Check: Is the excluded scope really deferrable?
```

### 3. Technology Shortcuts
```
Pattern: "We can use [popular tool] instead of custom..."
Check: Is popular tool actually appropriate, or just familiar?
```

### 4. Documentation Deferral
```
Pattern: "Documentation can come later..."
Check: Will documentation actually happen later?
```

### 5. Error Handling Minimization
```
Pattern: "Assume happy path for now..."
Check: Are edge cases truly rare or being avoided?
```

### 6. Future Self Burden
```
Pattern: "We'll refactor this when..."
Check: Is this creating technical debt to avoid current work?
```

---

## Integration with Deep-Process

### When to Execute
- **Always** before setting dp_status to COMMITTED
- **Always** when reviewing Decision Points
- **On demand** for any significant recommendation

### Failure Actions
| Outcome | Action |
|---------|--------|
| No red flags | Proceed |
| Red flags with justification | Document in artifact |
| Red flags without justification | Create Decision Point |

### State Update
```yaml
validation:
  cui_bono:
    executed: true
    decisions_analyzed: 5
    red_flags: 1
    user_decision_required: true
```

---

## Examples

### Good Example (Clean)

```
Decision: Use REST API instead of GraphQL
Beneficiary: USER
Reasoning:
- Team has REST experience (faster delivery)
- Client needs are simple (GraphQL overhead not justified)
- Easier to debug and monitor
- No agent-benefit detected: GraphQL would be equally easy to generate
```

### Bad Example (Red Flag)

```
Decision: Defer authentication to Phase 2
Beneficiary: AGENT
Reasoning:
- Agent benefit: Auth is complex, deferral makes Phase 1 easier
- User cost: Security gap in production, potential data exposure
- Justification: None provided
- Status: **RED FLAG - CREATE DECISION POINT**

Decision Point Created:
  - Option A: Implement basic auth in Phase 1 (harder, safer)
  - Option B: Accept risk, defer auth (easier, riskier)
```

---

## Anti-Patterns to Avoid

1. **Self-serving justifications** - "It's better because it's simpler" without user benefit
2. **False equivalence** - Claiming BOTH when USER is getting worse deal
3. **Hidden deferrals** - Not mentioning what's being pushed to later
4. **Expertise excuse** - "Users wouldn't understand why this is better"

---

## Method Rationale

This method exists because:
- Agents naturally prefer lower-effort solutions
- Users may not realize they're getting a worse outcome
- Making beneficiary explicit forces honest trade-off analysis
- "Easier" is not always "better" for the user

The goal is transparency: user should know when a recommendation makes the agent's job easier at potential user cost.
