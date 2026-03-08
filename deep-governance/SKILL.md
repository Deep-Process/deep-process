---
name: deep-governance
description: >
  Use when user needs to define, enforce, or audit policies and access controls.
  Triggers: "define policies", "access control review", "audit trail",
  "policy enforcement", "who has access to what", "governance framework".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Governance

Policy/compliance enforcement and audit trail generation.

## Procedure

### Step 1 — Inventory

Extract requirements from regulations, standards, or internal policies:

- List each regulation/standard/policy source
- Extract specific requirements as atomic rules
- Identify stakeholders: who is affected, who enforces, who audits

Output table:

| Source | Requirement ID | Requirement | Stakeholders |
|--------|---------------|-------------|-------------|

### Step 2 — Policy

Define policies as enforceable rules:

- Convert each requirement into a policy statement with clear pass/fail criteria
- Check for conflicts between policies (two policies that contradict each other)
- Flag gaps — requirements without corresponding policies

| Policy ID | Statement | Pass/Fail Criteria | Source Requirement | Conflicts |
|-----------|-----------|--------------------|--------------------|-----------|

### Step 3 — Enforce

Map controls to policies and verify enforcement:

- For each policy, identify the control mechanism (technical, procedural, manual)
- Verify enforcement status: enforced / partially enforced / not enforced
- Access control matrix: who has access to what, and is it appropriate

| Policy ID | Control | Type | Enforcement Status | Evidence |
|-----------|---------|------|--------------------|----------|

Access control matrix:

| Resource | Role | Access Level | Justified | Notes |
|----------|------|-------------|-----------|-------|

### Step 4 — Audit

Generate audit trail:

- Who did what, when, with what evidence
- Flag actions without evidence or outside policy
- Identify audit gaps — areas with no trail

| Timestamp | Actor | Action | Policy | Evidence | Compliant |
|-----------|-------|--------|--------|----------|-----------|

### Step 5 — Output

Produce governance report:

```
## Governance Report — [Scope] — [Date]

### Policy Matrix
| Policy ID | Statement | Criteria | Status |

### Access Control Matrix
| Resource | Role | Access | Justified |

### Audit Trail Summary
- Total actions reviewed: N
- Compliant: N
- Non-compliant: N
- Missing evidence: N

### Gaps
1. ...

### Recommendations
1. ...
```

## Success Criteria

- [ ] All source requirements inventoried
- [ ] Policies have clear pass/fail criteria
- [ ] Policy conflicts identified
- [ ] Controls mapped to every policy
- [ ] Access control reviewed for appropriateness
- [ ] Audit trail gaps flagged
