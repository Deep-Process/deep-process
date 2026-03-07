---
name: deep-implement
description: >
  Use when user needs to implement a designed system from architecture docs.
  Triggers: "implement this architecture", "generate the code", "build this
  system", "scaffold this project", "implement the design".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit]
---

# Deep Implement — Architecture-Driven Code Generation

## Purpose

Generate a working project scaffold from architecture documents. Layer-by-layer implementation with architecture traceability. Not just "write code" — structured generation with design alignment.

## When to Use

- Architecture/design docs exist and code needs to be generated
- User wants a project scaffold that follows a specific design
- Implementation needs to trace back to architecture decisions

## Process

### Step 1: Prepare

Read architecture and requirements. Extract:

| Item | Source |
|------|--------|
| Tech stack | Architecture doc — languages, frameworks, databases |
| Layers | Architecture doc — presentation, business, data, infra |
| Components | Component diagram or component list |
| APIs | API specs, interface definitions |
| Data models | ER diagrams, schema definitions |
| Implementation order | Dependencies between components |

If tech stack is not specified, recommend one with brief justification. Do not assume.

### Step 2: Structure

Create project directory structure:
- Follow conventions of the chosen framework/language
- Config files: package.json, requirements.txt, Cargo.toml, etc.
- Environment config: .env.example, docker-compose if applicable
- CI stub: basic pipeline config if relevant

### Step 3: Implement Layer by Layer

Order: data models -> business logic -> API/interface -> integration -> presentation

For each component:
- Reference which architecture decision it implements (comment at top of file)
- Follow framework conventions and best practices
- Include error handling patterns consistent across the project
- Use dependency injection or equivalent for testability

**Checklist per component:**
- [ ] Implements the specified architecture component
- [ ] Has consistent error handling
- [ ] Is testable (dependencies injectable)
- [ ] Follows project naming conventions
- [ ] Has necessary imports and type definitions

### Step 4: Test Stubs

For each implemented component, generate a corresponding test file:
- Correct test framework setup
- Test cases as descriptive stubs covering happy path + key edge cases
- Mock/stub setup for external dependencies

### Step 5: Verify — Architecture Traceability

Produce a traceability matrix:

| Architecture Component | Implementation File(s) | Status |
|-----------------------|----------------------|--------|
| User Service | src/services/user.ts | Done |
| Auth Middleware | src/middleware/auth.ts | Done |
| Notification Queue | — | GAP |

## Output Format

### Project Structure

```
project/
  src/
    ...
  tests/
    ...
  config/
    ...
```

### Architecture Traceability Matrix

The table from Step 5.

### Implementation Decisions

Brief log of decisions made during implementation that weren't specified in architecture:
- "Used bcrypt for password hashing (not specified, industry standard)"
- "Added request validation middleware (implied by API spec)"

### Known Gaps

Components from the architecture that were NOT implemented, with reason.

## Safety — Bash Usage

- **Scoped to project directory**: Only run Bash commands within the project being scaffolded. Never operate outside it.
- **Allowed**: project init commands (`npm init`, `cargo init`, `mkdir`, `touch`), running tests, linting, build validation.
- **Forbidden**: `rm -rf`, `git push`, `sudo`, `chmod 777`, force flags (`--force`, `--no-verify`), commands targeting system directories.
- **No credential handling**: Do not echo, log, or pipe secrets, tokens, or passwords through Bash.
- **Confirm before executing**: If a command installs dependencies (`npm install`, `pip install`) or modifies git state, describe it to the user first.

## Scope Transparency

This skill does NOT:
- Deploy or configure infrastructure (it generates code)
- Make architecture decisions (it implements existing ones)
- Generate production-ready security configurations
- Handle data migration or seeding beyond schema creation
