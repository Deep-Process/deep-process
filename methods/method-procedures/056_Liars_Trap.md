# Method #56: Liar's Trap

## Classification
- **Category:** Anti-Bias
- **Mandatory Phase:** Validation (ALWAYS before COMMITTED)
- **Purpose:** Force self-examination of potential deception vectors

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Demand agent lists 3 ways it could deceive you in its current response   │
│   - forces honest examination of potential deception vectors"              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Execution Protocol

### Step 1: Deception Vector Identification

Before finalizing any output, answer explicitly:

**"List 3 ways I could be deceiving the Operator in this response:"**

Common deception vectors:
1. **Omission** - Leaving out important information
2. **Misdirection** - Emphasizing irrelevant details
3. **False confidence** - Claiming certainty without evidence
4. **Scope reduction** - Quietly narrowing the problem
5. **Complexity hiding** - Making hard things seem easy
6. **People-pleasing** - Saying what user wants to hear
7. **Authority bluffing** - Citing expertise not possessed
8. **Future deferral** - Pushing hard parts to "later"

### Step 2: Evidence Provision

For EACH identified deception vector, provide:

```
DECEPTION VECTOR: [Name]
DESCRIPTION: How this could manifest in current response
EVIDENCE IT'S NOT BEING USED:
  - [Specific evidence 1]
  - [Specific evidence 2]
STATUS: CLEAR / FLAG
```

### Step 3: Flag Handling

If evidence CANNOT be provided for any vector:
- **FLAG** the vector
- **BLOCK** commit until addressed
- **REVISE** response to eliminate deception

---

## Output Template

```markdown
## Liar's Trap Analysis

### Identified Deception Vectors

**Vector 1: [Name]**
- Could manifest as: [How]
- Evidence against:
  - [Evidence 1]
  - [Evidence 2]
- Status: CLEAR

**Vector 2: [Name]**
- Could manifest as: [How]
- Evidence against:
  - [Evidence 1]
- Status: CLEAR

**Vector 3: [Name]**
- Could manifest as: [How]
- Evidence against:
  - CANNOT PROVIDE EVIDENCE
- Status: **FLAG - REQUIRES REVISION**

### Verdict
[ ] All vectors cleared - proceed to commit
[ ] Flags present - revision required
```

---

## Integration with Deep-Process

### When to Execute
- **Always** before setting dp_status to COMMITTED
- **Always** as part of validator-agent workflow
- **On demand** when Operator requests audit

### Failure Actions
| Outcome | Action |
|---------|--------|
| All cleared | Proceed to commit |
| 1 flag | Require revision, re-run trap |
| 2+ flags | Escalate to Operator review |

### State Update
```yaml
validation:
  liars_trap:
    executed: true
    vectors_checked: 3
    flags: 0
    cleared: true
```

---

## Examples

### Good Example (Cleared)

```
Vector 1: Omission of edge cases
- Could manifest as: Not mentioning error handling scenarios
- Evidence against:
  - Section 4.2 explicitly covers 5 error scenarios
  - Each has defined behavior and recovery path
- Status: CLEAR

Vector 2: False confidence in estimates
- Could manifest as: Claiming "easy to implement" without proof
- Evidence against:
  - All claims use measurable terms ("< 200ms", "3 API calls")
  - No subjective adjectives without quantification
- Status: CLEAR

Vector 3: Scope reduction
- Could manifest as: Ignoring mobile requirements
- Evidence against:
  - Mobile requirements listed in Section 2
  - Architecture includes mobile-specific components
- Status: CLEAR
```

### Bad Example (Flagged)

```
Vector 1: Complexity hiding
- Could manifest as: Making migration seem simpler than reality
- Evidence against:
  - CANNOT PROVIDE - no risk assessment included
  - Effort estimates missing
- Status: **FLAG**

Action: Add risk assessment and effort estimates before commit
```

---

## Anti-Patterns to Avoid

1. **Generic vectors** - Must be specific to current response
2. **Weak evidence** - "I tried my best" is not evidence
3. **Self-certification** - Can't just say "I'm being honest"
4. **Skipping the method** - Never bypass, even under time pressure

---

## Method Rationale

This method exists because:
- LLMs can produce plausible-sounding but incorrect content
- Operators may not have expertise to catch all errors
- Self-reflection forces explicit consideration of failure modes
- Making deception explicit makes it harder to commit unconsciously

The goal is not to assume bad faith, but to create a **forcing function** for thoroughness.
