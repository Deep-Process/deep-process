# Method #99: Multi-Artifact Coherence

## Classification
- **Category:** Coherence
- **Phase:** Validation
- **Purpose:** Ensure consistency across related artifacts

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Check reference integrity, naming consistency, interface compatibility,   │
│   and duplication drift across related artifacts"                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Coherence Dimensions

| Dimension | What It Checks | Failure Mode |
|-----------|----------------|--------------|
| **Reference Integrity** | All links/paths resolve | Broken references |
| **Naming Consistency** | Same terms for same concepts | Synonym confusion |
| **Interface Compatibility** | Declared APIs match usage | Contract violations |
| **Duplication Drift** | Copied content stays aligned | Divergent copies |

## Execution Protocol

### Step 1: Build Artifact Graph

Identify all artifacts connected to the target:

```markdown
## Artifact Relationship Graph

Target: EPIC-AUTH-FLOW

Connected artifacts (via depends_on):
├── VISION-001 (semantic_source)
├── ARCH-001 (hard_constraint)
│   └── SECURITY-POLICY (hard_constraint)
└── EPIC-USER-PROFILE (weak_reference)

Artifacts depending on target:
├── TASK-LOGIN-UI
├── TASK-SESSION-MGMT
└── TASK-MFA-IMPL

Total artifacts to check: 7
```

### Step 2: Reference Integrity Check

Verify all references resolve:

```markdown
## Reference Integrity

| Source | Reference | Target | Status |
|--------|-----------|--------|--------|
| EPIC-AUTH-FLOW | artifacts/vision.md | VISION-001 | ✅ EXISTS |
| EPIC-AUTH-FLOW | artifacts/arch.md | ARCH-001 | ✅ EXISTS |
| EPIC-AUTH-FLOW | artifacts/api-spec.md | ??? | ❌ NOT FOUND |
| TASK-LOGIN-UI | EPIC-AUTH-FLOW | exists | ✅ EXISTS |

Broken references: 1
```

### Step 3: Naming Consistency Check

Verify terminology alignment:

```markdown
## Naming Consistency

### Concept: "User Authentication"

| Artifact | Term Used | Aligned? |
|----------|-----------|----------|
| VISION-001 | "user login" | ⚠️ |
| ARCH-001 | "authentication" | ✅ |
| EPIC-AUTH-FLOW | "auth flow" | ⚠️ |
| SECURITY-POLICY | "authentication" | ✅ |

Recommendation: Standardize to "authentication"

### Concept: "Session Duration"

| Artifact | Value/Term | Aligned? |
|----------|------------|----------|
| ARCH-001 | "24 hours" | ✅ |
| SECURITY-POLICY | "24h" | ✅ |
| EPIC-AUTH-FLOW | "1 day" | ⚠️ |

Recommendation: Standardize to "24 hours"
```

### Step 4: Interface Compatibility Check

Verify declared interfaces match usage:

```markdown
## Interface Compatibility

### Interface: Auth API (from ARCH-001)

Declared:
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh

Usage in EPIC-AUTH-FLOW:
- POST /auth/login ✅
- POST /auth/logout ✅
- GET /auth/status ❌ NOT IN SPEC

Compatibility: PARTIAL
Missing from spec: GET /auth/status
```

### Step 5: Duplication Drift Check

Find duplicated content and check alignment:

```markdown
## Duplication Drift

### Duplicated: "Session Timeout Rules"

Location 1: ARCH-001 (Section 4.2)
> "Sessions expire after 24 hours of inactivity.
> Refresh tokens are valid for 7 days."

Location 2: SECURITY-POLICY (Section 2.1)
> "Sessions expire after 24 hours of inactivity.
> Refresh tokens are valid for 30 days."

DRIFT DETECTED: Refresh token validity differs
- ARCH-001: 7 days
- SECURITY-POLICY: 30 days

Resolution: Create Decision Point
```

---

## Output Template

```markdown
## Multi-Artifact Coherence Analysis

### Artifact Graph
[Diagram showing connections]

Total artifacts analyzed: {N}

### Reference Integrity
- Checked: {count}
- Valid: {count}
- Broken: {count}
- [List broken references]

### Naming Consistency
- Concepts checked: {count}
- Aligned: {count}
- Misaligned: {count}
- [List recommendations]

### Interface Compatibility
- Interfaces checked: {count}
- Compatible: {count}
- Partial: {count}
- Incompatible: {count}
- [List issues]

### Duplication Drift
- Duplicates found: {count}
- Aligned: {count}
- Drifted: {count}
- [List drift with quotes]

### Issues Summary

| # | Type | Severity | Description | Resolution |
|---|------|----------|-------------|------------|
| 1 | Broken ref | HIGH | api-spec.md missing | Create or fix path |
| 2 | Naming | MEDIUM | "auth" vs "login" | Standardize |
| 3 | Drift | HIGH | Token validity differs | Decision Point |

### Verdict
[ ] Fully coherent - proceed
[ ] Minor issues - document and proceed
[ ] Critical issues - resolve before commit
```

---

## Integration with Deep-Process

### When to Execute
- **Before COMMITTED** on any artifact with dependencies
- **After bulk changes** affecting multiple artifacts
- **Periodically** as system health check

### Failure Actions
| Issue Type | Severity | Action |
|------------|----------|--------|
| Broken reference | HIGH | Block commit until fixed |
| Naming inconsistency | MEDIUM | Flag, proceed with warning |
| Interface incompatibility | HIGH | Block or Decision Point |
| Duplication drift | HIGH | Decision Point for resolution |

### State Update
```yaml
validation:
  multi_artifact_coherence:
    executed: true
    artifacts_checked: 7
    issues:
      broken_references: 1
      naming_issues: 2
      interface_issues: 1
      drift_issues: 1
    resolution_required: true
```

---

## Drift Resolution Strategies

When duplication drift is detected:

### Strategy 1: Single Source of Truth
```
Keep one location, reference from others:

SECURITY-POLICY:
  session_rules: See ARCH-001 Section 4.2
```

### Strategy 2: Decision Point
```
Create DP to resolve conflicting values:

DP-XXX:
  prompt: "Session refresh token validity"
  options:
    - A: 7 days (ARCH-001)
    - B: 30 days (SECURITY-POLICY)
```

### Strategy 3: Intentional Difference
```
Document that difference is intentional:

SECURITY-POLICY:
  note: "Differs from ARCH-001 because [reason]"
  semantic_hash:
    - "Refresh: 30 days (intentional deviation from arch)"
```

---

## Anti-Patterns to Avoid

1. **Copy-paste culture** - Creates drift-prone duplicates
2. **Implicit references** - "As discussed elsewhere" without links
3. **Synonym tolerance** - "Both terms mean the same thing"
4. **Interface evolution without propagation** - Changing spec, not usage

---

## Method Rationale

This method exists because:
- Distributed artifacts naturally drift over time
- Inconsistencies create confusion and bugs
- Single source of truth prevents divergence
- Cross-artifact checks catch what single-artifact checks miss

The goal is maintaining a coherent whole, not just individually valid parts.
