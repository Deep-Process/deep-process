---
name: deep-change
description: >
  Use when user needs to evaluate impact of a proposed change to an existing
  system. Triggers: "what's the impact of changing", "change impact analysis",
  "if we change X what breaks", "migration impact", "refactoring impact".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Change — Change Impact Analysis

## Purpose

Analyze the impact of a proposed change before making it. Map direct effects and ripple effects. Identify risks and produce a rollback plan.

## When to Use

- User wants to change something and needs to understand the blast radius
- Refactoring, migration, API changes, schema changes, dependency updates
- Before any change that touches shared components or external interfaces

## Process

### Step 1: Define the Change

| Item | Value |
|------|-------|
| What is changing | Specific component, API, schema, dependency |
| Why | Business reason, tech debt, bug fix, new feature |
| Current state | How it works now |
| Proposed state | How it should work after |

### Step 2: Impact Map

Scan the codebase for everything that touches the changed component.

**Direct impacts (1st order):**

| Affected Item | Type | How Affected | Severity |
|--------------|------|-------------|----------|
| /src/api/users.ts | Code | Calls changed function directly | High |
| /tests/user.test.ts | Test | Tests the changed function | Medium |
| /docs/api.md | Docs | Documents the changed API | Low |

**Ripple effects (2nd order):**

| Affected Item | Via | How Affected | Severity |
|--------------|-----|-------------|----------|
| Mobile app | API contract | Consumes changed endpoint | High |
| Reporting service | Shared DB table | Reads changed schema | High |
| CI pipeline | Test suite | Tests may break | Medium |

Search strategy:
- Grep for function/class/API names being changed
- Check imports and dependency trees
- Check configuration files that reference changed components
- Check tests that exercise changed behavior
- Check documentation that describes changed behavior

### Step 3: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Mobile app breaks on deploy | High | Critical | Version API, coordinate release |
| Data loss during schema migration | Low | Critical | Backup before migration, test on staging |
| Performance regression | Medium | Medium | Benchmark before and after |

### Step 4: Produce Output

## Output Format

### Change Summary

One-paragraph description of what's changing and why.

### Impact Table

Direct impacts table from Step 2.

### Ripple Effects

Second-order effects table from Step 2.

### Risk Assessment

Risk table from Step 3.

### Recommended Change Sequence

Ordered steps to implement the change safely:
1. Add new API version alongside old
2. Migrate consumers to new version
3. Run integration tests
4. Remove old version
5. Update documentation

### Rollback Plan

| Trigger | Action | Verification |
|---------|--------|-------------|
| API errors spike >5% | Revert deployment, restore old endpoint | Check error rate returns to baseline |
| Data inconsistency detected | Stop migration, restore from backup | Verify data integrity checks pass |

## Scope Transparency

This skill does NOT:
- Make the change (it analyzes impact only)
- Guarantee finding all impacts (it searches systematically but codebases are complex)
- Assess organizational/team impact (it focuses on technical impact)
- Handle multi-system changes across repositories it can't access
