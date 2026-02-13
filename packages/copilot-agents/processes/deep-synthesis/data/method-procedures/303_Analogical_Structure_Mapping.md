# 303 - Analogical Structure Mapping (Gentner)

## Phase
RELATE

## Purpose
Find structural parallels between different domains in the source set. Surface features may differ but RELATIONAL STRUCTURE may be identical — enabling powerful cross-domain transfer of solutions and insights.

## Theoretical Foundation
> **Structure Mapping Theory (Gentner, 1983):**
> Analogical reasoning works by mapping STRUCTURAL relationships (not surface features) from a known domain to a new one.
> The power of analogy comes from shared RELATIONAL structure, not shared surface attributes.

## Structural Elements

| Element | Description | Example |
|---------|-------------|---------|
| **Objects** | Entities in the domain | "pipeline", "data stream", "buffer" |
| **Attributes** | Properties of objects | "fast", "large", "reliable" |
| **Relations** | Connections between objects | "causes", "flows to", "depends on" |
| **Higher-order relations** | Relations between relations | "if X causes Y, then preventing X prevents Y" |

## Key Principle
> **Systematicity:** Prefer mappings that preserve systems of relations over isolated matches.
> One mapping = weak analogy. Multiple aligned mappings = structural isomorphism (strong).

## Procedure

### Step 1: Domain Identification
Identify domain-different sources in the set
- Which sources come from different fields?
- Which discuss different types of systems?

### Step 2: Relational Extraction
For each domain: extract key relations
- Focus on RELATIONS (A causes B, A contains B, A flows to B)
- Ignore surface attributes (big, fast, blue)

### Step 3: Structural Alignment
Map structural relationships across domains
- "A causes B" in domain 1 maps to "X causes Y" in domain 2
- The CAUSE relationship is the structural element, not the specific entities

### Step 4: Systematicity Assessment
Evaluate how systematic the mapping is
- One mapping = weak analogy
- Multiple aligned mappings = structural isomorphism
- Rate systematicity: High/Medium/Low

### Step 5: Transfer Candidate Identification
Identify what could transfer between domains
- Solutions from domain A applicable to domain B?
- Insights from domain B inform domain A?
- Test: does the transfer make sense given the structural mapping?

### Step 6: Danger Check
Verify structural validity
- Surface similarity without structural similarity = FALSE ANALOGY
- Check that the mapping preserves the relations that matter for the insight

## Output Schema
```yaml
analogies:
  - analogy_id: "A1"
    domain_1:
      name: "[Domain 1]"
      source_ids: ["S1", "S3"]
      key_relations:
        - "[Relation 1]"
        - "[Relation 2]"
    domain_2:
      name: "[Domain 2]"
      source_ids: ["S2"]
      key_relations:
        - "[Relation 1 analog]"
        - "[Relation 2 analog]"
    structural_mappings:
      - domain_1_element: "[Element in domain 1]"
        domain_2_element: "[Corresponding element in domain 2]"
        relation_preserved: "[What relation this mapping preserves]"
    systematicity: "high/medium/low"
    transfer_candidates:
      - from_domain: "[Source domain]"
        to_domain: "[Target domain]"
        insight: "[What transfers]"
        validity: "[Why the transfer is valid]"
    false_analogy_risk: "high/medium/low"
    false_analogy_reason: "[If risk exists, why]"
```

## Example

```
Domain 1: Data pipeline (data engineering)
├── Backpressure from slow consumer
├── Buffer overflow when buffer full
├── Cascading failure when one stage stalls

Domain 2: Supply chain (logistics)
├── Backlog from slow processing
├── Warehouse overflow when storage full
├── Cascade when one supplier delays

Structural mapping: BOTH are flow systems with capacity constraints
├── "pipeline stage" → "supply chain node"
├── "backpressure" → "backlog"
├── "buffer" → "inventory/warehouse"
├── "cascading failure" → "supply chain disruption"

Systematicity: HIGH (multiple aligned mappings)

Transfer: Supply chain solutions (kanban, JIT, buffer management) may apply to data pipelines
Validated: Kafka's consumer groups ARE a form of kanban
```

## False Analogy Detection

### Warning Signs
- Only surface features match (both are "big" or "complex")
- Key relations don't map
- Transfer candidate fails when examined closely
- Analogy requires forcing or special pleading

### Validation Questions
- If this relation holds in domain 1, does its mapped version hold in domain 2?
- Are there counter-examples where the analogy breaks?
- Would domain experts recognize this structural similarity?

## Quality Checks
- [ ] Domain-different sources identified
- [ ] Relations extracted (not just attributes)
- [ ] Structural mappings documented
- [ ] Systematicity rated
- [ ] Transfer candidates identified
- [ ] False analogy risk assessed

## Connections
- Uses: #201 (Claims), #203 (Models)
- Feeds into: #304 (Conceptual Blending), #403 (Emergence Detection)
- Grounded in: Gentner (1983) Structure Mapping Theory
- Enables: Cross-domain insight transfer
