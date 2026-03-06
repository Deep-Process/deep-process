---
name: deep-requirements
description: >
  Use when user needs to extract, clarify, or structure requirements from
  conversations, documents, or vague descriptions. Triggers: "what are the
  requirements", "extract requirements", "clarify what we need", "requirement
  analysis", "what should this system do".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Requirements — Structured Requirements Extraction

## Purpose

Extract, classify, and validate requirements from ambiguous inputs. Detect contradictions. Identify gaps. Produce a traceable requirements register.

## When to Use

- Input is vague, conversational, or scattered across documents
- User needs structured requirements from informal descriptions
- Requirements need contradiction checking or completeness analysis

## Process

### Step 1: Extract

Read all input sources and pull out every requirement statement. Classify each:

| Category | Description | Examples |
|----------|-------------|---------|
| **Functional** | What the system must do | "Users can upload files" |
| **Non-functional** | Quality attributes | "Page load under 2 seconds" |
| **Constraint** | Imposed limitations | "Must use PostgreSQL" |
| **Assumption** | Unstated beliefs taken as true | "Users have modern browsers" |

Extraction rules:
- If something sounds like a requirement but is ambiguous, extract it AND flag the ambiguity
- Implicit requirements count — if a feature implies authentication, note it
- Separate compound requirements ("system must X and Y" becomes two entries)

### Step 2: Elaborate

For each requirement:

| Field | Description |
|-------|-------------|
| ID | REQ-F-001 (F=functional, NF=non-functional, C=constraint, A=assumption) |
| Statement | Clear, testable requirement statement |
| Priority | MoSCoW: Must / Should / Could / Won't |
| Acceptance Criteria | How to verify this requirement is met |
| Dependencies | Other requirements this depends on |
| Ambiguities | What's unclear about this requirement |
| Source | Where this came from (document, conversation, implied) |

### Step 3: Validate

**Contradiction check:** Compare requirements pairwise for conflicts:
- Direct contradictions ("must be real-time" vs "batch processing only")
- Resource conflicts (two requirements that compete for same budget/time)
- Priority conflicts (two "Must" items that are mutually exclusive)

**Completeness check** — are these areas covered:
- [ ] User roles and permissions
- [ ] Error handling and edge cases
- [ ] Data retention and lifecycle
- [ ] Performance and scalability
- [ ] Security and access control
- [ ] Integration points
- [ ] Migration from existing systems (if applicable)
- [ ] Monitoring and observability

### Step 4: Produce Output

## Output Format

### Requirements Register

| ID | Category | Statement | Priority | Acceptance Criteria | Ambiguities |
|----|----------|-----------|----------|-------------------|-------------|
| REQ-F-001 | Functional | ... | Must | ... | ... |

### Contradictions Found

| Req A | Req B | Nature of Contradiction | Suggested Resolution |
|-------|-------|------------------------|---------------------|

### Gaps Identified

List areas from the completeness checklist that have no requirements. For each gap, suggest whether it's:
- **Missing** — likely needed, should be added
- **Out of scope** — intentionally excluded
- **Unknown** — needs stakeholder input

### Assumptions

List all assumptions with risk level if assumption proves wrong.

## Scope Transparency

This skill produces a **structured extraction**, not invention. It does NOT:
- Invent requirements the user didn't imply
- Make priority decisions (it suggests, user decides)
- Replace stakeholder conversations for ambiguity resolution
- Guarantee completeness (it checks common areas, not domain-specific ones)
