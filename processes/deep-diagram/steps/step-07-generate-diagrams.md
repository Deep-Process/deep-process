---
step: 7
name: "Generate Diagrams"
time_estimate: "5-10 minutes"
goal: "Generate Mermaid diagrams using triggers, component selection, and topology ranking"
requires_completion: true
next_steps: ["step-08-verify-coverage.md"]
data_dependencies: ["components[]", "relationships[]", "high_priority_components[]", "diagram_plan from documentation-plan.yaml", "diagram-triggers.yaml"]
outputs: ["diagrams[] (in-memory)"]
---

# STEP 7: GENERATE DIAGRAMS

**PRECONDITION:** Step 06 RANK_COMPONENTS = complete (priority_score and high_priority populated)

**Input:** components[], relationships[], high_priority_components[],
  diagram_plan[] from documentation-plan.yaml, diagram-triggers.yaml
**Output:** diagrams[] array (in-memory, written to file in step-09)

## ENFORCED SEQUENCE

**ACTION 1: Apply Diagram Triggers**

For each trigger in diagram-triggers.yaml:
1. Check if trigger's required domain is in active_domains[]
2. Evaluate trigger conditions against components[] and evidence
3. IF conditions met -> add to generation_queue[]

Examples:
- DT-CDK-STACK: IF "aws-cdk" in active_domains -> generate CDK stack diagram
- DT-DYNAMODB-SCHEMA: IF >5 DynamoDB table components -> generate schema diagram
- DT-EVENT-FLOW: IF "event-driven-serverless" in active_domains -> generate event flow
- DT-COMPONENT-TREE: IF "react" in active_domains -> generate component tree
- DT-OPENAPI-CONTRACT: IF "api-gateway" in active_domains -> generate API contract
- DT-EXTERNAL-INTEGRATION: IF "external-integrations" in active_domains -> generate integration map
- DT-MULTI-TENANT: IF "multi-tenant" in active_domains -> generate tenant architecture

**ACTION 2: Add topology-driven diagrams**

For each high_priority component NOT already covered by trigger-based diagrams:
1. Generate component diagram showing its dependencies (both in and out)
2. This ensures architecturally important components always get diagrams
3. Per ADR-016: topology-driven detection finds complex entities pattern-only misses

**ACTION 3: Add planned diagrams**

For each diagram in diagram_plan[] from documentation-plan.yaml:
1. Check if already covered by trigger or topology generation
2. IF not covered -> add to generation_queue[]
3. Record trigger source: "planned" (from documentation plan)

**ACTION 4: Select components per diagram**

For each diagram in generation_queue[]:

Based on diagram type and high-priority components:
- **component**: Show top 20% by degree centrality + their direct relationships
- **sequence**: Show call chains for high-priority functions (relationship_type: calls)
- **deployment**: Show infrastructure-layer components (layer: infrastructure)
- **class**: Show type hierarchy (relationship_type: extends|implements)
- **data_flow**: Show data transformations (components in data layer + their flows)
- **architecture**: Show ALL layers with inter-layer relationships (full system view)

For each diagram, record:
- selected_component_ids[]
- selected_relationship_ids[]

**ACTION 5: Generate Mermaid Code**

For each diagram in generation_queue[]:

1. Select appropriate Mermaid diagram type:
   - component -> `graph TD`
   - sequence -> `sequenceDiagram`
   - deployment -> `graph LR`
   - class -> `classDiagram`
   - data_flow -> `graph LR`
   - architecture -> `graph TD`

2. Generate node declarations:
   ```
   CMP_001[UserService]
   CMP_005[DatabaseRepository]
   ```

3. Generate relationship arrows:
   ```
   CMP_001 -->|calls| CMP_005
   CMP_001 -->|publishes| CMP_010
   ```

4. Apply syntax rules:
   - Node IDs MUST match component_ids from components[]
   - Relationship arrows MUST match relationships[] entries
   - Labels MUST use component_name (not raw IDs in display)
   - No duplicate edges
   - No self-referencing edges (source == target)

5. Validate Mermaid syntax:
   - Verify diagram starts with valid keyword (graph/flowchart/sequenceDiagram/classDiagram)
   - Verify all node references are declared
   - Verify arrow syntax is valid (-->, -->>>, -.->, etc.)
   - Verify no special characters that break Mermaid parsing

**ACTION 6: Store diagram entries**

For each generated diagram:
```json
{
  "diagram_id": "DIAG_001",
  "diagram_type": "component",
  "title": "High-Level Architecture",
  "trigger_source": "DT-CDK-STACK" | "topology_driven" | "planned",
  "components": ["CMP_001", "CMP_002", "..."],
  "relationships": ["REL_001", "REL_002", "..."],
  "mermaid_code": "graph TD\n  CMP_001[UserService] --> CMP_005[DatabaseRepository]\n  ..."
}
```

**ACTION 7: Summarize generation**

```yaml
generation_summary:
  total_diagrams_generated: <count>
  trigger_based: <count>
  topology_driven: <count>
  plan_based: <count>
  diagram_types:
    component: <count>
    sequence: <count>
    deployment: <count>
    class: <count>
    data_flow: <count>
    architecture: <count>
  total_components_in_diagrams: <count>
  total_unique_components_in_diagrams: <count>
```

## VALIDATION

- total_diagrams_generated >= 1 (at least one diagram)
- All diagram component[] IDs MUST reference components[] array
- All diagram relationship[] IDs MUST reference relationships[] array
- Mermaid syntax MUST be valid for each diagram
- No phantom components (components in diagrams not in components[])
