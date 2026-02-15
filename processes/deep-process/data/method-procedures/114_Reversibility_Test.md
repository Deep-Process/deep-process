# Method #114: Reversibility Test

## Classification
- **Category:** Epistemology
- **Phase:** Validation
- **Purpose:** Verify reasoning can be traced backward from output to input

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Trace reasoning backwards from output to input - steps that cannot be    │
│   reconstructed indicate gaps or shortcuts"                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

If output cannot reconstruct input, information was lost or reasoning was skipped.

## Execution Protocol

### Step 1: Identify Output Claims

List all conclusions, decisions, or outputs:

```markdown
## Output Inventory

| # | Output | Type |
|---|--------|------|
| 1 | "Use PostgreSQL for data storage" | Architecture decision |
| 2 | "Timeline is 8 weeks" | Estimate |
| 3 | "Authentication uses OAuth2" | Design choice |
| 4 | "Risk is MEDIUM" | Assessment |
```

### Step 2: Backward Trace Each Output

For each output, trace reasoning backward to sources:

```markdown
## Backward Trace

### Output 1: "Use PostgreSQL"

**Step back 1:** Why PostgreSQL specifically?
← Need relational data with ACID

**Step back 2:** Why relational with ACID?
← User data has complex relationships + financial transactions

**Step back 3:** Why complex relationships + transactions?
← Requirements doc section 3.2 specifies user-order-payment model

**Step back 4:** Can we reach the source?
← YES: Requirements doc section 3.2

**Trace Status:** ✅ COMPLETE - can reach source

---

### Output 2: "Timeline is 8 weeks"

**Step back 1:** How was 8 weeks calculated?
← [UNABLE TO TRACE]

**Step back 2:** What inputs went into estimate?
← [NO EVIDENCE OF CALCULATION]

**Trace Status:** ❌ INCOMPLETE - reasoning gap

---

### Output 3: "Authentication uses OAuth2"

**Step back 1:** Why OAuth2?
← Security requirement for SSO

**Step back 2:** Why SSO requirement?
← Enterprise customers need it (stakeholder meeting)

**Step back 3:** Where is SSO requirement documented?
← [NOT FOUND IN DOCS]

**Trace Status:** ⚠️ PARTIAL - verbal requirement not documented
```

### Step 3: Identify Gaps

Categorize trace failures:

```markdown
## Gap Analysis

| Output | Trace Status | Gap Type | Severity |
|--------|--------------|----------|----------|
| PostgreSQL | ✅ Complete | None | - |
| 8 weeks | ❌ Incomplete | Missing calculation | HIGH |
| OAuth2 | ⚠️ Partial | Undocumented input | MEDIUM |
| MEDIUM risk | ❌ Incomplete | No methodology | HIGH |

### Gap Types Explained

**Missing calculation:**
- Output exists but no reasoning shown
- Cannot verify correctness
- Others cannot reproduce

**Undocumented input:**
- Reasoning exists but source not in artifacts
- Creates dependency on memory/meetings
- Risk of losing context

**No methodology:**
- Assessment given without criteria
- Subjective/arbitrary appearance
- Cannot be validated
```

### Step 4: Fill Gaps

For each gap, document the missing reasoning:

```markdown
## Gap Remediation

### Gap 1: Timeline (8 weeks)

**Add to document:**
```
Timeline Calculation:
- Feature breakdown: 15 features estimated
- Velocity: 2 features/week (based on last 3 sprints)
- Buffer: 20% for unknowns
- Calculation: 15/2 * 1.2 = 9 weeks, rounded to 8 with parallel work
- Source: Sprint velocity report Q3
```

### Gap 2: OAuth2 (undocumented SSO)

**Add to requirements:**
```
REQ-AUTH-05: Single Sign-On
Source: Stakeholder meeting 2025-01-15 (John, Sarah)
Rationale: Enterprise customers require SSO for compliance
Decision: OAuth2 selected for SSO capability
```

### Gap 3: Risk Assessment

**Add methodology:**
```
Risk Assessment Methodology:
- Impact score: 3 (affects core functionality)
- Likelihood score: 2 (team has some experience)
- Risk = Impact × Likelihood = 6 → MEDIUM (scale: 1-3 LOW, 4-6 MEDIUM, 7-9 HIGH)
```
```

---

## Output Template

```markdown
## Reversibility Test

### Outputs Analyzed: {count}

### Trace Results

| # | Output | Trace Status | Gap | Severity |
|---|--------|--------------|-----|----------|
| 1 | {output} | ✅/⚠️/❌ | {gap type or none} | {severity} |

### Complete Traces ({count})
[List outputs with full traceback]

### Partial Traces ({count})
[List with what's missing]

### Failed Traces ({count})
[List with gap analysis]

### Gap Remediation Plan

**{Gap 1}**
- Missing: {what}
- Add: {content to add}
- Location: {where to document}

### Verdict
[ ] All traces complete - output is well-grounded
[ ] Gaps documented and filled - proceed
[ ] Critical gaps remain - cannot verify output
```

---

## Integration with Deep-Process

### When to Execute
- **Before COMMITTED** - Ensure all outputs traceable
- **On estimates/decisions** - Verify reasoning documented
- **During review** - Check if decisions can be understood

### Semantic Hash Validation
```yaml
# Each fact in semantic_hash should be reversibly traceable
semantic_hash:
  - "Database: PostgreSQL"  # ← Can trace to requirements
  - "Timeline: 8 weeks"     # ← Must have traceable calculation
  - "Auth: OAuth2"          # ← Must have traceable decision
```

### State Update
```yaml
validation:
  reversibility:
    outputs_checked: 8
    complete_traces: 5
    partial_traces: 2
    failed_traces: 1
    gaps_remediated: true
```

---

## Reversibility Indicators

### Good Signs (Traceable)
- "Based on requirement X in document Y"
- "Calculated from A × B = C"
- "Decided in meeting Z (minutes attached)"
- "Following pattern from similar project"
- "As specified in standard XYZ"

### Bad Signs (Untraceable)
- "It's obvious that..."
- "Everyone knows..."
- "Based on experience..."
- "The estimate is..."
- "We decided to..."

---

## Common Reversibility Failures

### 1. Estimate Gaps
```
Problem: "Project takes 3 months"
Missing: Task breakdown, velocity data, buffer calculation
Fix: Show work - list tasks, estimate each, sum with buffer
```

### 2. Decision Gaps
```
Problem: "We chose React"
Missing: Alternatives considered, criteria, evaluation
Fix: Add decision record with options and rationale
```

### 3. Assessment Gaps
```
Problem: "Security risk is HIGH"
Missing: Threat model, vulnerability analysis, scoring
Fix: Document threat assessment methodology and results
```

### 4. Requirement Gaps
```
Problem: "Users need feature X"
Missing: Source of requirement (who said, when, why)
Fix: Trace to user research, stakeholder request, or data
```

---

## Reversibility Questions

Use these to test any output:

1. **Can another person reproduce this conclusion?**
2. **What documents/data would they need?**
3. **Is the reasoning written down somewhere?**
4. **Could this be audited by an external party?**
5. **If the author disappeared, could we understand why?**

If any answer is "no" → reversibility gap exists.

---

## Method Rationale

This method exists because:
- Conclusions without traceable reasoning are unverifiable
- "Trust me" doesn't scale or persist
- Future readers need to understand why, not just what
- Audits and reviews require reasoning chains

The goal is ensuring every output can be understood and verified by following the reasoning backward to its sources.
