---
name: deep-plan
description: >
  Use when user needs to plan implementation of a designed system. Triggers:
  "plan the implementation", "create a project plan", "break this into sprints",
  "how do we implement this", "implementation roadmap".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Plan — Implementation Planning from Architecture + Risk

## Purpose

Decompose a designed system into actionable work packages with risk-adjusted estimates, sprint allocation, and critical path identification.

## When to Use

- Architecture/design docs exist and the team needs an implementation roadmap
- Risk assessment is available and should inform planning
- User asks for sprint planning, work breakdown, or implementation sequencing

## Process

### Step 1: Load Inputs

- Read architecture docs, design decisions, component inventory
- Read risk assessment if available (from deep-risk or similar)
- Read requirements for scope confirmation
- Note: if inputs are missing, state what's missing and plan with what's available

### Step 2: Decompose into Work Packages

For each architectural component or feature, create a work package:

| Field | Description |
|-------|-------------|
| ID | WP-001, WP-002, ... |
| Name | Short descriptive name |
| Description | What gets built |
| Dependencies | Which other WPs must complete first |
| Skills Required | Frontend, backend, data, infra, etc. |
| Estimate | T-shirt size: S (1-2d), M (3-5d), L (1-2w), XL (2-4w) |

### Step 3: Sequence — Critical Path

- Build dependency graph from work packages
- Identify critical path (longest chain of dependent WPs)
- Identify parallel tracks (independent WP chains that can run simultaneously)
- Flag bottlenecks: WPs with many dependents

### Step 4: Allocate to Sprints

- Group WPs into sprints respecting dependencies
- Balance effort across sprints (avoid front/back loading)
- Each sprint should have a clear deliverable/milestone

### Step 5: Risk Integration

- Map known risks to specific work packages
- For high-risk WPs: add buffer (typically +50% for high, +25% for medium)
- Flag WPs that need spike/investigation before estimation is reliable
- Identify risk-driven sequencing: should risky items go early (fail fast) or late (more info)?

### Step 6: Produce Output

## Output Format

### Work Packages Table

| ID | Name | Dependencies | Skills | Estimate | Risk Level | Buffered Estimate |
|----|------|-------------|--------|----------|------------|-------------------|
| WP-001 | ... | — | ... | M | High | L |

### Sprint Plan

For each sprint:
- Sprint goal / milestone
- Work packages included
- Total effort (with and without risk buffer)
- Key risks in this sprint

### Critical Path

List the critical path chain: WP-X -> WP-Y -> WP-Z
Total critical path duration: X weeks (buffered: Y weeks)

### Parallel Tracks

- Track A: WP-1 -> WP-4 -> WP-7
- Track B: WP-2 -> WP-5 (independent)

### Assumptions & Gaps

- List planning assumptions
- List items that need clarification before plan is reliable

## Success Criteria

- [ ] Work packages defined with dependencies and T-shirt estimates
- [ ] Critical path identified with total duration
- [ ] Sprint plan has clear deliverable/milestone per sprint
- [ ] Risks mapped to specific work packages with buffered estimates

## Scope Transparency

This skill produces a **plan**, not a guarantee. It does NOT:
- Replace team estimation sessions (use this as a starting point)
- Account for team velocity (it uses abstract T-shirt sizes)
- Handle resource allocation to specific people
- Manage ongoing backlog refinement
