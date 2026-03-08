---
name: deep-test
description: >
  Use when user needs a test strategy, test plan, or test generation for a
  system. Triggers: "test strategy", "how to test this", "test plan",
  "what should we test", "testing approach".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, Bash, Write]
---

# Deep Test — Test Strategy & Generation

## Purpose

Produce a risk-prioritized test strategy with coverage analysis. Generate test stubs for highest-priority items. Go beyond "write unit tests."

## When to Use

- System needs a testing approach and the user wants more than boilerplate
- Existing test coverage has gaps that need systematic identification
- User wants risk-based test prioritization

## Process

### Step 1: Inventory

Scan the project to understand what exists:
- **Codebase:** languages, frameworks, modules, entry points
- **Architecture:** layers, external integrations, data stores
- **Requirements:** what's supposed to work (from docs or conversation)
- **Existing tests:** what's already tested, what framework is used, current coverage

### Step 2: Test Strategy

Build the test pyramid for this specific system:

| Level | What to Test | Tools/Framework | Priority |
|-------|-------------|-----------------|----------|
| **Unit** | Business logic, utilities, data transforms | ... | ... |
| **Integration** | API contracts, DB queries, service interactions | ... | ... |
| **E2E** | Critical user journeys, happy paths | ... | ... |
| **Security** | Auth bypass, injection, data exposure | ... | ... |
| **Performance** | Load, latency, resource usage | ... | ... |

**Risk-based prioritization:**
- Components with highest business impact get most coverage
- Components with most complexity/change frequency get most coverage
- New or recently changed code gets priority over stable code
- Integration points and external dependencies get integration tests

### Step 3: Generate Test Stubs

For the top-priority items, produce:
- Test file with correct framework setup
- Test cases as descriptive stubs (describe/it or test function signatures)
- Key assertions noted as comments
- Edge cases explicitly listed

Generate actual test code only for the most critical paths. Use stubs for the rest.

### Step 4: Coverage Analysis

| Component | Unit | Integration | E2E | Security | Overall | Risk if Untested |
|-----------|------|-------------|-----|----------|---------|-----------------|
| Auth module | Yes | Yes | Yes | Partial | Good | Critical |
| Data import | No | No | No | No | None | High |

## Output Format

### Test Strategy Matrix

The pyramid table from Step 2, filled in for this specific project.

### Priority-Ordered Test List

1. [CRITICAL] Auth token validation — unit + security tests
2. [HIGH] Payment processing — unit + integration + E2E
3. [MEDIUM] User profile CRUD — unit + integration
4. ...

### Coverage Gaps

| Gap | Risk Level | Recommendation |
|-----|-----------|----------------|
| No integration tests for payment API | Critical | Add contract tests immediately |
| No security tests for file upload | High | Add input validation + file type checks |

### Generated Test Stubs

Actual test files written to the project (if Write tool is available and user wants them).

## Success Criteria

- [ ] Test strategy matrix filled for this specific project
- [ ] Priority-ordered test list with risk-based ranking
- [ ] Coverage gaps identified with risk level and recommendation
- [ ] Test stubs generated for highest-priority items

## Scope Transparency

This skill does NOT:
- Run tests or measure actual code coverage (it analyzes structurally)
- Replace manual/exploratory testing strategy
- Generate complete test implementations (it produces stubs + critical path tests)
- Handle test environment setup or CI/CD pipeline configuration
