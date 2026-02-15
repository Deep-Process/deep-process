# Method #72: 5 Whys Deep Dive

## Classification
- **Category:** Core
- **Phase:** Implementation
- **Purpose:** Drill to root causes through repeated questioning

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Repeatedly ask why to drill down to root causes - simple but powerful    │
│   for understanding failures"                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Execution Protocol

### Step 1: State the Problem

Define the problem or requirement clearly:

```markdown
## Problem Statement

WHAT: Users are abandoning the checkout process
WHERE: Payment step (step 3 of 4)
WHEN: After entering credit card details
IMPACT: 40% conversion loss
```

### Step 2: The 5 Whys Chain

Ask "Why?" repeatedly until reaching bedrock:

```markdown
## Why Chain

**WHY 1: Why are users abandoning at payment?**
→ The page shows a loading spinner for too long (>5 seconds)

**WHY 2: Why does the page load for so long?**
→ The payment API call takes 5-10 seconds to respond

**WHY 3: Why does the payment API take so long?**
→ It performs fraud checks synchronously before responding

**WHY 4: Why are fraud checks synchronous?**
→ The system was designed to reject bad payments immediately

**WHY 5: Why must rejection be immediate?**
→ Original requirement from legal team (2019) for compliance

**ROOT CAUSE:** Outdated compliance requirement now causing UX harm
**BEDROCK:** Organizational policy (can be changed with authority)
```

### Step 3: Validate the Chain

Check each link is causal, not just correlated:

```markdown
## Chain Validation

| Link | Causal? | Evidence |
|------|---------|----------|
| WHY 1 → WHY 2 | YES | Logs show API latency correlates with abandonment |
| WHY 2 → WHY 3 | YES | APM traces show fraud check is 80% of latency |
| WHY 3 → WHY 4 | YES | Code explicitly awaits fraud result |
| WHY 4 → WHY 5 | YES | Design doc references legal requirement |
| WHY 5 → ROOT | YES | Requirement document from 2019 found |
```

### Step 4: Identify Solution Level

Determine where to intervene:

```markdown
## Solution Analysis

| Level | Intervention | Effort | Impact | Sustainability |
|-------|--------------|--------|--------|----------------|
| WHY 1 | Hide spinner, show progress | LOW | LOW | Treats symptom |
| WHY 2 | Add caching | MEDIUM | MEDIUM | Partial fix |
| WHY 3 | Make fraud async | MEDIUM | HIGH | Addresses cause |
| WHY 4 | Redesign flow | HIGH | HIGH | Systemic fix |
| WHY 5 | Update policy | LOW | HIGH | **ROOT SOLUTION** |

RECOMMENDATION: Address WHY 5 (update policy) + WHY 3 (async fraud)
```

---

## Output Template

```markdown
## 5 Whys Analysis

### Problem Statement
[Clear definition of the problem]

### Why Chain

| # | Question | Answer |
|---|----------|--------|
| 1 | Why {problem}? | {answer 1} |
| 2 | Why {answer 1}? | {answer 2} |
| 3 | Why {answer 2}? | {answer 3} |
| 4 | Why {answer 3}? | {answer 4} |
| 5 | Why {answer 4}? | {answer 5} |

### Root Cause
{The fundamental cause identified}

### Bedrock Type
[ ] Technical limitation
[ ] Organizational policy
[ ] Human nature
[ ] Physical constraint
[ ] Economic reality

### Chain Validation
[Evidence that each link is causal]

### Solution Options

| Level | Solution | Trade-offs |
|-------|----------|------------|
| {level} | {solution} | {pros/cons} |

### Recommendation
[Which level(s) to address and why]
```

---

## Stopping Conditions

Stop asking "Why?" when you hit bedrock:

### Technical Bedrock
```
"Why can't we have zero latency?"
→ Speed of light / physics

STOP: Cannot question further
```

### Organizational Bedrock
```
"Why do we need approval?"
→ Corporate governance structure

STOP: Would require org change beyond scope
```

### Human Nature Bedrock
```
"Why do users make mistakes?"
→ Humans have limited attention

STOP: Cannot change human nature
```

### Economic Bedrock
```
"Why don't we have more engineers?"
→ Budget constraints

STOP: Resource allocation beyond scope
```

---

## Integration with Deep-Process

### When to Execute
- **Requirement analysis** - Why is this needed?
- **Bug investigation** - Why did this happen?
- **Process improvement** - Why is this slow?
- **Contradiction resolution** - Why do these conflict?

### Synergy with #152 Socratic Decomposition
```
1. Use #152 to decompose problem into sub-questions
2. Use #72 on areas where sub-answers contradict
3. Root causes reveal hidden assumptions
```

### State Update
```yaml
execution:
  five_whys:
    depth_reached: 5
    root_cause: "Outdated policy"
    bedrock_type: "organizational"
    solution_level: 5
```

---

## Common Patterns

### The Blame Loop
```
BAD:
Why did deployment fail? → Developer made a mistake
Why did developer make a mistake? → They weren't careful
Why weren't they careful? → They don't care
→ DEAD END (blame, not cause)

GOOD:
Why did deployment fail? → Config was wrong
Why was config wrong? → No validation in CI
Why no validation? → Validation tool doesn't exist
Why doesn't it exist? → Nobody built it
Why didn't anyone build it? → Not prioritized
→ ROOT: Process gap (actionable)
```

### The Circular Why
```
BAD:
Why is system slow? → Database is slow
Why is database slow? → Too many queries
Why too many queries? → Code is inefficient
Why inefficient? → System is slow
→ CIRCULAR (no root cause)

GOOD:
Why too many queries? → N+1 query pattern
Why N+1? → ORM default behavior
Why using ORM default? → Didn't know about eager loading
Why didn't know? → No code review caught it
→ ROOT: Knowledge gap (actionable)
```

### The External Blame
```
BAD:
Why is API slow? → Third party is slow
→ DEAD END (external, uncontrollable)

GOOD:
Why is API slow? → Third party is slow
Why are we dependent on their speed? → No caching
Why no caching? → Data assumed to be real-time
Why real-time assumption? → Original spec from 2018
→ ROOT: Outdated requirement (actionable)
```

---

## Facilitation Tips

### Getting Past Surface Answers
```
Surface: "It broke"
Probe: "What specifically broke?"
Probe: "What was happening when it broke?"
Probe: "What changed before it broke?"
```

### Getting Past "I Don't Know"
```
"I don't know" →
- "Who would know?"
- "Where would that be documented?"
- "What would we need to find out?"
- "What's your best guess?"
```

### Getting Past Blame
```
"John messed up" →
- "What conditions led to that?"
- "What would have prevented it?"
- "What system gaps existed?"
- "How could anyone have avoided this?"
```

---

## Anti-Patterns to Avoid

1. **Stopping too early** - Surface answers aren't root causes
2. **Going too deep** - Some things can't be changed
3. **Blame chains** - People aren't root causes, systems are
4. **Circular reasoning** - Each why must be new information
5. **Multiple branches** - Focus on one thread at a time

---

## Method Rationale

This method exists because:
- Surface problems often have deeper causes
- Fixing symptoms without addressing causes wastes effort
- Simple questions reveal complex truths
- Five levels usually reach actionable root causes

The goal is finding where intervention will have lasting impact, not just immediate relief.
