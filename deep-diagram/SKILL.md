---
name: deep-diagram
description: >
  Use when user needs diagrams generated from code or documentation. Triggers:
  "create a diagram", "visualize this", "draw the architecture", "sequence
  diagram", "flow diagram", "class diagram", "mermaid diagram".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, Write]
---

# Deep Diagram — Structured Diagram Generation

## Purpose

Generate meaningful diagrams from code or documentation. Multiple diagram types in Mermaid format. Include only relevant detail — not everything.

## When to Use

- User wants to visualize a codebase, architecture, or process
- Documentation needs diagrams generated from existing code
- User asks for a specific diagram type (sequence, class, flow, etc.)

## Process

### Step 1: Analyze

Read the codebase or documentation. Identify:
- **Entities:** services, classes, modules, actors, data stores
- **Relationships:** calls, inherits, contains, depends on
- **Flows:** request paths, data pipelines, state transitions
- **Layers:** presentation, business, data, infrastructure

### Step 2: Select Diagram Types

Choose based on what was found — don't force all types:

| Diagram Type | When to Use | Good For |
|-------------|-------------|----------|
| C4 Context | System has external actors/systems | Big picture, stakeholder view |
| C4 Container | Multi-service or multi-layer system | Service architecture |
| C4 Component | Detailed module structure | Internal design |
| Sequence | API calls, multi-step flows | Request/response patterns |
| State | Entities with lifecycle states | Order status, user state |
| ER | Database or data models exist | Data relationships |
| Flowchart | Business logic with decisions | Algorithms, processes |
| Class | OOP codebase | Inheritance, composition |

Pick 1-3 diagram types that add the most value. State why others were skipped.

### Step 3: Generate Mermaid Diagrams

For each selected type, produce a Mermaid code block:
- Include only entities relevant to the user's question or the system's core
- Group related items (subgraphs, namespaces)
- Use clear labels — no abbreviations without context
- Keep diagrams readable: 5-15 entities per diagram (split if larger)

### Step 4: Annotate

Add notes as Mermaid comments or note nodes for:
- Key design decisions ("this is async because...")
- Notable patterns ("repository pattern used here")
- Potential issues ("this is a single point of failure")

## Output Format

### Diagram Selection

"Generated X diagrams. Skipped Y because [reason]."

### Diagrams

One Mermaid code block per diagram, preceded by:
- Diagram type and title
- What it shows and what it intentionally omits
- The mermaid code block

Example structure:
```
#### System Context — Who interacts with the system

Shows: external actors, system boundary, key integrations
Omits: internal components (see Container diagram)

[mermaid code block]
```

## Success Criteria

- [ ] Diagram types selected with justification for skipped types
- [ ] Each diagram contains 5-15 entities and is readable
- [ ] Each diagram states what it shows and what it omits
- [ ] Key design decisions and patterns annotated

## Scope Transparency

This skill does NOT:
- Render diagrams (it produces Mermaid text — use a Mermaid renderer)
- Model every entity in a large codebase (it curates for readability)
- Generate UML-strict diagrams (Mermaid has its own syntax)
- Replace architecture documentation (diagrams supplement, not replace)
