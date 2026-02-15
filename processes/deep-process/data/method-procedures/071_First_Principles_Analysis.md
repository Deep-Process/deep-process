# Method #71: First Principles Analysis

## Classification
- **Category:** Core
- **Phase:** Implementation
- **Purpose:** Strip assumptions to rebuild from fundamental truths

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Strip away assumptions to rebuild from fundamental truths - breakthrough  │
│   technique for innovation and solving impossible problems"                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Execution Protocol

### Step 1: Assumption Excavation

List ALL assumptions being made (explicit and implicit):

```markdown
## Assumption Inventory

### Explicit Assumptions (stated in requirements)
1. Users have email addresses
2. System runs on cloud infrastructure
3. Team has 3 developers

### Implicit Assumptions (unstated but assumed)
1. Users want a web interface
2. Authentication must use passwords
3. Data must be stored in a database
4. Users are human

### Inherited Assumptions (from industry/tradition)
1. MVC is the right architecture
2. REST is better than alternatives
3. More features = better product
4. Users read documentation
```

### Step 2: Truth Testing

For each assumption, ask: "Is this actually true?"

```markdown
## Truth Test Results

| # | Assumption | Actually True? | Evidence |
|---|------------|----------------|----------|
| 1 | Users have email | MOSTLY | 98% have email, 2% phone-only |
| 2 | Cloud infrastructure | MAYBE | On-prem could work too |
| 3 | Web interface needed | UNCERTAIN | CLI might suffice |
| 4 | Passwords required | FALSE | Passwordless exists |
| 5 | Database required | FALSE | File system could work |
```

### Step 3: Identify Fundamental Truths

What remains after stripping false assumptions:

```markdown
## Fundamental Truths

Things that are ACTUALLY true and cannot be avoided:

1. Users need to identify themselves somehow
2. Data must persist across sessions
3. Multiple users must not corrupt each other's data
4. System must be accessible to users
5. Budget is limited

These are the REAL constraints.
```

### Step 4: Rebuild from Fundamentals

Design solution using only fundamental truths:

```markdown
## First Principles Design

Given only fundamentals:

1. "Users need to identify themselves"
   → Could be: email, phone, biometric, magic link, hardware key
   → CHOSEN: Magic link (simplest, no password to manage)

2. "Data must persist"
   → Could be: RDBMS, NoSQL, files, blockchain, memory + snapshot
   → CHOSEN: Files + Git (simplest, version history free)

3. "Multi-user isolation"
   → Could be: Row-level security, separate DBs, file permissions
   → CHOSEN: File-per-user (simplest, no conflicts)

4. "Accessible to users"
   → Could be: Web, mobile, CLI, desktop, API-only
   → CHOSEN: CLI first (target audience is technical)
```

---

## Output Template

```markdown
## First Principles Analysis

### Assumptions Identified: {count}
- Explicit: {count}
- Implicit: {count}
- Inherited: {count}

### Assumptions Tested

| Assumption | Status | Evidence |
|------------|--------|----------|
| {assumption} | TRUE/FALSE/UNCERTAIN | {evidence} |

### Fundamental Truths

1. {Truth 1} - cannot be avoided because {reason}
2. {Truth 2} - cannot be avoided because {reason}

### Reconstructed Approach

For each fundamental:
- Fundamental: {truth}
- Options: {list possible solutions}
- Choice: {selected option}
- Rationale: {why this option}

### Comparison

| Aspect | Traditional Approach | First Principles | Difference |
|--------|---------------------|------------------|------------|
| {aspect} | {traditional} | {new} | {improvement} |

### Verdict
New approach is: SIMPLER / MORE COMPLEX / SAME
Recommendation: ADOPT / INVESTIGATE / REJECT
```

---

## Integration with Deep-Process

### When to Execute
- **At project start** before making architectural decisions
- **When stuck** on seemingly impossible requirements
- **During migration** to question legacy patterns
- **For innovation** when breakthrough is needed

### Synergy with Other Methods
- Pairs with **#72 5 Whys** for root cause analysis
- Feeds into **#79 Operational Definition** for precision
- Validates against **#87 Falsifiability** for testability

### State Update
```yaml
execution:
  first_principles:
    assumptions_found: 15
    assumptions_false: 5
    fundamentals_identified: 5
    approach_changed: true
```

---

## Common False Assumptions

### Technology Assumptions
```
FALSE: "We need a database"
TRUTH: We need data persistence (many solutions)

FALSE: "We need a web framework"
TRUTH: We need HTTP handling (stdlib may suffice)

FALSE: "We need microservices for scale"
TRUTH: We need to handle load (monolith can scale too)
```

### Process Assumptions
```
FALSE: "We need sprints"
TRUTH: We need iterative delivery (many approaches)

FALSE: "We need documentation"
TRUTH: We need shared understanding (code can be docs)

FALSE: "We need meetings"
TRUTH: We need alignment (async can work)
```

### User Assumptions
```
FALSE: "Users want features"
TRUTH: Users want problems solved (fewer features may be better)

FALSE: "Users will learn the system"
TRUTH: Users want immediate value (learning is a cost)

FALSE: "Users read error messages"
TRUTH: Users want things to work (prevent errors instead)
```

---

## Example: Authentication First Principles

### Traditional Approach
```
1. Username + password
2. Hash passwords with bcrypt
3. Session cookies
4. Password reset via email
5. Remember me checkbox
```

### First Principles Analysis

**Fundamental truth:** Users need to prove they are who they claim to be.

**Rebuild:**
```
Option A: Magic links (email proves ownership)
Option B: Hardware keys (possession proves identity)
Option C: OAuth (delegate to trusted provider)
Option D: Biometrics (physical trait proves identity)

Analysis:
- Magic links: No password to manage, email already verified
- Simpler for users, simpler to implement
- Only "assumption": Users have email (98% true)

Choice: Magic links as primary, OAuth as fallback
```

**Result:** Eliminated passwords, reset flows, bcrypt, sessions complexity.

---

## Anti-Patterns to Avoid

1. **Shallow questioning** - "Do we need a database?" → "Yes" (no digging)
2. **Premature rebuild** - Challenging assumptions without evidence
3. **Ignoring context** - Some assumptions exist for good reasons
4. **Analysis paralysis** - Questioning everything forever
5. **Contrarianism** - Rejecting convention just to be different

---

## Method Rationale

This method exists because:
- Most solutions inherit unnecessary complexity
- "Best practices" may not be best for your context
- Innovation comes from questioning fundamentals
- Simpler solutions often emerge from first principles

The goal is not to reject all convention, but to consciously choose what to inherit vs. reinvent.
