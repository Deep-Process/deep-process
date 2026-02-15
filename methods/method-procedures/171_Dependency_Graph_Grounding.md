# #171 Dependency Graph Grounding

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Compare the dependency graph extracted from code with the reference graph extracted from documentation to find structural grounding gaps.

## What to do

1. Build a dependency graph from code (nodes = modules/files, edges = imports/calls)
2. Build a reference graph from documentation (nodes = documented elements, edges = "uses"/"calls"/"references")
3. Compare both graphs: find missing nodes, phantom nodes, and structural divergence
4. Calculate structural similarity score

## Step-by-step

```
1. Extract code dependency graph (from Step 4 findings):
   code_graph = {
     nodes: [all modules/files/classes detected in code_inventory],
     edges: [import relationships from dependency tracking]
   }

   If dependency_graph exists in state.findings:
     Use existing data
   Else:
     Build from code_inventory + import tracking data

2. Extract documentation reference graph:
   FOR each generated document:
     Extract all references to code elements:
       - "Module X imports Y"
       - "Service A calls Service B"
       - "Component X depends on Y"
       - Cross-document links (architecture.md → data-models.md)

   docs_graph = {
     nodes: [all code elements mentioned in docs],
     edges: [all relationships described between elements]
   }

3. Compare graphs — Node analysis:
   missing_in_docs = code_graph.nodes - docs_graph.nodes
   → Code elements that exist but are NOT documented

   phantom_in_docs = docs_graph.nodes - code_graph.nodes
   → Documented elements that do NOT exist in code (phantoms)

   Coverage: documented_nodes / total_code_nodes

4. Compare graphs — Edge analysis:
   FOR each edge (A→B) in docs_graph:
     Verify: Does code_graph also have edge (A→B)?
     If not: FALSE RELATIONSHIP (docs claim A depends on B, but code disagrees)

   FOR each edge (A→B) in code_graph:
     Check: Is this relationship captured in any doc?
     If not: UNDOCUMENTED DEPENDENCY

5. Structural similarity:
   Jaccard similarity (nodes) = |intersection| / |union|
   Jaccard similarity (edges) = |intersection| / |union|

   Overall structural grounding = 0.4 * node_similarity + 0.6 * edge_similarity
```

## Output format

```
Graph comparison:
| Metric | Code Graph | Docs Graph | Overlap |
|--------|-----------|------------|---------|
| Nodes  | [N]       | [N]        | [N]     |
| Edges  | [N]       | [N]        | [N]     |

Missing from docs (undocumented code):
- [module/class] — referenced by [N] other modules
- [module/class] — [0] references (isolated, low priority)

Phantom docs (no code match):
- [documented element] in [doc file] — NO CODE EVIDENCE
- [documented element] in [doc file] — NO CODE EVIDENCE

False relationships (docs claim, code disagrees):
- "[A] depends on [B]" in [doc] — code shows no import/call

Undocumented dependencies:
- [A] → [B] exists in code, not captured in docs

Structural grounding score: [0-100]%
- Node coverage: [%]
- Edge coverage: [%]
- Phantoms: [count]
- False relationships: [count]

FINDING (if any): Documentation graph diverges from code graph — [N] phantoms, [N] missing, [N] false relationships
SEVERITY: CRITICAL (phantoms > 3 or false relationships > 0), IMPORTANT (missing > 30%), MINOR (cosmetic gaps)
```
