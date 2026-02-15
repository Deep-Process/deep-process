---
dp_id: "L1-ARCHITECTURE"
dp_type: "artifact"
dp_status: "NOW"
version: "1.0"

context:
  depends_on:
    - path: "L0-constitution.md"
      type: "semantic_source"
      propagation_mode: "IMMEDIATE"

semantic_hash:
  - "System Type: [e.g. Monolith, Microservices]"
  - "Core Pattern: [e.g. CQRS, Event Sourcing]"

execution:
  active_methods: [159, 95]
---

# L1: Architecture Map (The What)

## 1. High-Level Design
> How do the pieces fit together? (Mermaid diagram preferred)

## 2. Core Components
> Major blocks of the system.
- **Component A:** Responsibility
- **Component B:** Responsibility

## 3. Data Flow
> How does data move through the system?

## 4. Key Decisions (ADR Summary)
> Which architectural decisions drive this structure?
