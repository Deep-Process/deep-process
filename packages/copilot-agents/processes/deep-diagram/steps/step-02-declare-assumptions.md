---
step: 2
name: "Declare Assumptions"
time_estimate: "1 minute"
goal: "Explicitly declare all assumptions before extraction begins (R5 ASSUMPTIONS_DECLARED)"
requires_completion: true
next_steps: ["step-03-extract-components.md"]
data_dependencies: []
outputs: []
---

# STEP 2: ASSUMPTIONS_DECLARED

**Purpose:** Document all interpretive decisions as falsifiable hypotheses before any extraction work.
This is MANDATORY per R5 (ASSUMPTIONS_DECLARED). Extraction without declared assumptions is a SEQUENCE VIOLATION.

## ENFORCED SEQUENCE

**ACTION 1: Declare assumptions**

Record the following assumptions block. Modify values ONLY if input data provides
evidence for different values.

```yaml
assumptions:
  component_types:
    values: ["module", "service", "function", "class", "interface", "config", "external"]
    rationale: "Standard software architecture component taxonomy"
    falsifiable: "If entity types in ontology use different taxonomy, update this list"

  layer_classification:
    values: ["presentation", "business", "data", "infrastructure", "integration"]
    rationale: "Standard layered architecture model"
    falsifiable: "If project uses different layer model (e.g., hexagonal), update"

  relationship_types:
    values: ["uses", "contains", "extends", "implements", "calls", "subscribes", "publishes", "depends_on"]
    rationale: "Common software relationship types from evidence claims"
    falsifiable: "If evidence contains relationship types not in this list, extend it"

  topology_metrics:
    method: "Degree centrality (in_degree + out_degree)"
    rationale: "LLM-executable counting (no graph algorithms required)"
    falsifiable: "If project requires betweenness/closeness/PageRank, external tool needed"
    note: "v7.1.3 fix: LLM cannot execute Brandes algorithm, BFS, or iterative matrix multiplication"

  high_priority_threshold:
    value: "top 20% by total_degree (percentile >= 0.80)"
    alternative: "absolute threshold: total_degree > 10"
    rationale: "Focus diagrams on most-connected components"
    falsifiable: "If 20% yields too few or too many, adjust percentage"

  diagram_coverage_target:
    value: 0.90
    rationale: "90% of components should appear in at least one diagram"
    falsifiable: "If project has many utility components, lower to 0.80"

  mermaid_syntax:
    output_format: "Mermaid"
    keywords: ["graph TD", "graph LR", "sequenceDiagram", "classDiagram", "flowchart"]
    rationale: "Mermaid is widely supported in Markdown renderers"
    falsifiable: "If target platform requires PlantUML/D2, output format changes"

  evidence_requirement:
    rule: "Every component and relationship MUST have evidence_claim_ids"
    rationale: "No phantom content allowed (R5 EVIDENCE-BACKED DIAGRAMS ONLY)"
    falsifiable: "Not falsifiable - this is a binding process rule"
```

**ACTION 2: Log assumptions**

Store assumptions in working memory for use by subsequent steps.
All steps 03-09 operate under these declared assumptions.

**ACTION 3: Note overrides**

If any input artifact suggests different values (e.g., ontology uses custom entity types
not in the component_types list), log the override:

```yaml
assumption_overrides:
  - assumption: <which assumption>
    original_value: <declared value>
    override_value: <new value from evidence>
    evidence: <what justified the override>
    timestamp: <ISO8601>
```

## VALIDATION

- Assumptions block MUST be non-empty
- All 7 assumption categories MUST be declared
- Overrides MUST cite evidence source
- PRECONDITION for step-03: assumptions declared = true
