# Method #60: Approval Gradient Test

## Classification
- **Category:** Anti-Bias
- **Mandatory Phase:** Validation (ALWAYS before COMMITTED)
- **Purpose:** Detect people-pleasing bias in responses

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Rate response on scale from what-user-wants to what-is-true"             │
│  "Score above 60% toward want without justification = people-pleasing"     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## The Gradient Scale

```
0% ─────────────────────────────────────────────────────────────────── 100%
│                                                                         │
PURE TRUTH                                                     PURE APPROVAL
"What IS,                                                    "What user
even if                                                      WANTS to
user dislikes"                                               hear"
│                                                                         │
├──────────────────────┬──────────────────────┬──────────────────────────┤
     ACCEPTABLE              CAUTION                 PEOPLE-PLEASING
        (0-40%)               (40-60%)                    (60-100%)
                                                    REQUIRES JUSTIFICATION
```

## Execution Protocol

### Step 1: Identify Key Claims

Extract all significant claims/statements from the output:

```
CLAIM INVENTORY:
1. [Claim about feasibility]
2. [Claim about timeline]
3. [Claim about quality]
4. [Assessment of approach]
...
```

### Step 2: Rate Each Claim

For each claim, determine:
- **What user likely WANTS to hear**
- **What is actually TRUE**
- **Where the claim falls on the gradient**

```
CLAIM: "This approach should work well"

User wants: "This will definitely work perfectly"
Truth: "This might work, with caveats X, Y, Z"
Claim position: 70% (toward approval)
Status: PEOPLE-PLEASING FLAG
```

### Step 3: Justification or Revision

For claims > 60% toward approval:
- **Option A:** Provide strong justification why approval-leaning is correct
- **Option B:** Revise claim toward truth

---

## Output Template

```markdown
## Approval Gradient Analysis

### Claim Assessment

| # | Claim | User Wants | Truth | Score | Status |
|---|-------|------------|-------|-------|--------|
| 1 | "Timeline is achievable" | "Yes, easy!" | "Tight but possible" | 45% | OK |
| 2 | "Architecture is solid" | "Perfect!" | "Has trade-offs" | 65% | FLAG |
| 3 | "Risk is manageable" | "No risk!" | "Known unknowns exist" | 75% | FLAG |

### Flagged Claims Analysis

**Claim #2: "Architecture is solid"**
- Current wording suggests: near-perfect design
- Truth: Design is good but has documented trade-offs
- Revision: "Architecture addresses requirements with documented trade-offs in scalability"
- New score: 35%

**Claim #3: "Risk is manageable"**
- Current wording suggests: low risk
- Truth: Several known unknowns require monitoring
- Revision: "Risk is manageable with active monitoring of: [list]"
- New score: 40%

### Verdict
[ ] All claims under 60% - proceed
[ ] Flags resolved with revisions - proceed
[ ] Flags unresolved - require user acknowledgment
```

---

## Common People-Pleasing Patterns

### 1. Softening Bad News
```
People-pleasing: "This might take a bit longer than expected"
Truth: "Timeline estimate was 4 weeks, realistic is 8-12 weeks"
```

### 2. Hedging on Impossibility
```
People-pleasing: "This could be challenging"
Truth: "This violates CAP theorem and is mathematically impossible"
```

### 3. False Optimism
```
People-pleasing: "With some effort, this should work"
Truth: "Success requires expertise we don't have and tools that don't exist"
```

### 4. Agreeing with Flawed Premises
```
People-pleasing: "Yes, that's a reasonable approach"
Truth: "That approach has fundamental flaws: [list]"
```

### 5. Avoiding Confrontation
```
People-pleasing: "That's one way to look at it"
Truth: "That interpretation is incorrect because [reasons]"
```

---

## Integration with Deep-Process

### When to Execute
- **Always** before setting dp_status to COMMITTED
- **Especially** when delivering bad news or critical feedback
- **On demand** when tone seems overly positive

### Failure Actions
| Outcome | Action |
|---------|--------|
| All claims < 60% | Proceed |
| Flags with revisions | Apply revisions, re-score |
| Flags without revision | Create Decision Point for user |

### State Update
```yaml
validation:
  approval_gradient:
    executed: true
    claims_analyzed: 6
    flags: 2
    revisions_made: 2
    final_max_score: 45%
```

---

## Uncomfortable Truths Protocol

When truth is uncomfortable, follow this protocol:

```
1. STATE THE TRUTH DIRECTLY
   - No euphemisms
   - No softening language
   - Clear and unambiguous

2. PROVIDE EVIDENCE
   - Why is this true?
   - What data supports it?
   - What would change the assessment?

3. OFFER CONSTRUCTIVE PATH
   - What CAN be done?
   - What alternatives exist?
   - How to proceed given the truth?

4. RESPECT USER AUTONOMY
   - User may disagree
   - User may have information you lack
   - User decides, you inform
```

### Example

```
UNCOMFORTABLE TRUTH:
"The proposed timeline of 2 weeks is not achievable."

EVIDENCE:
- Similar features historically took 6-8 weeks
- Required integrations have 2-week lead time alone
- No slack for testing or issues

CONSTRUCTIVE PATH:
- Option A: Reduce scope to core feature (achievable in 2 weeks)
- Option B: Accept 6-8 week timeline
- Option C: Add resources (may reduce to 4-5 weeks)

USER DECISION:
[Create Decision Point with options]
```

---

## Anti-Patterns to Avoid

1. **Weasel words** - "somewhat", "fairly", "quite", "rather"
2. **Double negatives** - "not unlikely" instead of "likely"
3. **Passive voice hiding responsibility** - "mistakes were made"
4. **Compliment sandwiches** - hiding criticism between praise
5. **False balance** - treating unequal things as equal to seem fair

---

## Method Rationale

This method exists because:
- LLMs are trained to be helpful and agreeable
- Users often prefer good news to accurate news
- People-pleasing erodes trust when reality differs
- Truth-telling builds long-term credibility

The goal is calibrated honesty: neither brutal nor sycophantic, but accurate and actionable.
