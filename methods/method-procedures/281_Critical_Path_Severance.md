# 306 - Critical Path Severance (Min-Cut Analysis)

## Phase
INTERACT

## Purpose
Model the system as a flow graph and find the minimum cut - the smallest set of elements whose simultaneous failure disconnects the system entirely. Mathematical rigor for finding single points of failure.

## Core Concept: Min-Cut

**Graph Theory Foundation:**
- **Nodes:** Components, services, people, data stores
- **Edges:** Dependencies, data flows, communication paths
- **Source:** Inputs to the system
- **Sink:** Outputs / value delivery

**Min-Cut:** The smallest set of edges (or nodes) whose removal disconnects source from sink.

**Why Min-Cut Matters:**
- It's mathematically complete - if there's a way to sever the system, this finds the cheapest one
- This is exactly what an adversary, or unlucky coincidence, would exploit
- Ad-hoc SPOF hunting can miss structural vulnerabilities

## Procedure

### Step 1: Model System as Graph
Create directed graph:
- **Nodes:** All components in the value delivery chain
- **Edges:** All dependencies and data flows
- **Source node:** Where inputs enter (users, data sources)
- **Sink node:** Where value is delivered (outputs, customers)

### Step 2: Assign Capacities (Optional)
If doing weighted analysis:
- Edge capacity = difficulty to sever (1 = easy, 10 = hard)
- This shifts analysis to "weakest link"

### Step 3: Compute Min-Cut
Find the minimum cut:
- Smallest set of edges that disconnects source from sink
- Use Ford-Fulkerson, Edmonds-Karp, or similar algorithm
- For manual analysis: trace all paths, find common chokepoints

### Step 4: Interpret Results
Each element in the min-cut set is a **structural SPOF**:
- Failure there severs the value chain
- No workaround exists through the graph

### Step 5: Assess Redundancy
For each min-cut element:
- Does redundancy exist?
- Is it real or false (#303)?
- Can we add parallel paths?

### Step 6: Design Mitigations
Add parallel paths to increase the min-cut size:
- Larger min-cut = more resilient system
- Multiple elements must fail to sever

## Output Schema
```yaml
min_cut_analysis:
  graph_summary:
    nodes: 15
    edges: 23
    source: "User requests"
    sink: "Report delivery"

  min_cut:
    cut_size: 2
    elements:
      - element: "API Gateway"
        type: "[Node|Edge]"
        failure_mode: "What failure looks like"
        current_redundancy: "[None|Partial|Full]"
        false_redundancy_check: "Result of #303 check"
      - element: "Database connection"
        type: "[Node|Edge]"
        failure_mode: "What failure looks like"
        current_redundancy: "[None|Partial|Full]"
        false_redundancy_check: "Result of #303 check"

    interpretation: "System can be severed by failing these 2 elements"

  all_paths:
    - path: ["Source", "A", "B", "C", "Sink"]
      chokepoints: ["B"]
    - path: ["Source", "A", "D", "C", "Sink"]
      chokepoints: ["A", "C"]

  recommendations:
    - element: "API Gateway"
      recommendation: "Add second gateway with DNS failover"
      new_cut_size_if_implemented: 3
    - element: "Database"
      recommendation: "Add read replica in different region"
      new_cut_size_if_implemented: 4
```

## Quality Checks
- [ ] System modeled as complete graph
- [ ] All paths traced
- [ ] Min-cut computed
- [ ] Redundancy assessed for each min-cut element
- [ ] False redundancy checked (#303)
- [ ] Mitigation recommendations made

## Connections
- Feeds into: #403 (defense depth design), #404 (degradation planning)
- Uses output from: Architecture documentation, #303 (false redundancy check)
- Related to: #304 (concentration at chokepoints)

## Example: Data Pipeline System

### System Graph
```
                    ┌──────────────┐
                    │   Source     │
                    │  (Data API)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Ingestion   │
                    │   Service    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐┌────▼─────┐┌────▼─────┐
       │  Pipeline A ││Pipeline B││Pipeline C│
       └──────┬──────┘└────┬─────┘└────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │   Delta      │
                    │   Lake       │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Synapse    │
                    │   (Serving)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Sink      │
                    │  (Reports)   │
                    └──────────────┘
```

### Min-Cut Analysis
```yaml
min_cut_analysis:
  graph_summary:
    nodes: 8
    edges: 9
    source: "Data API"
    sink: "Reports"

  min_cut:
    cut_size: 1
    elements:
      - element: "Ingestion Service"
        type: Node
        failure_mode: "Service crashes or becomes unavailable"
        current_redundancy: None
        false_redundancy_check: "N/A - no redundancy exists"
      # OR
      - element: "Delta Lake"
        type: Node
        failure_mode: "Storage unavailable or corrupted"
        current_redundancy: Partial (replicas exist)
        false_redundancy_check: "Same region - common mode with Synapse"
      # OR
      - element: "Synapse"
        type: Node
        failure_mode: "Query service unavailable"
        current_redundancy: None
        false_redundancy_check: "N/A - no redundancy exists"

    interpretation: |
      Cut size of 1 means system has multiple SPOFs.
      ANY of Ingestion, Delta Lake, or Synapse failing severs the system.
      The parallel pipelines (A, B, C) don't help because they all
      converge at the same points.

  recommendations:
    - element: "Ingestion Service"
      recommendation: "Add second ingestion path (e.g., direct file drop)"
      new_cut_size_if_implemented: 2

    - element: "Delta Lake"
      recommendation: "Add cross-region replication, failover Synapse endpoint"
      new_cut_size_if_implemented: 2

    - element: "Synapse"
      recommendation: "Add alternative serving layer (direct Delta query)"
      new_cut_size_if_implemented: 2
```

## Manual Min-Cut Finding

For systems too complex to model formally, use this heuristic:

1. **List all paths** from source to sink
2. **Find intersection:** What appears on ALL paths?
3. **That's your min-cut:** Elements that appear on every path

```
Path 1: Source → Ingestion → Pipeline A → Delta → Synapse → Sink
Path 2: Source → Ingestion → Pipeline B → Delta → Synapse → Sink
Path 3: Source → Ingestion → Pipeline C → Delta → Synapse → Sink

Intersection: {Source, Ingestion, Delta, Synapse, Sink}
Min-cut: Any one of {Ingestion, Delta, Synapse}
```

## Why This Beats Ad-Hoc SPOF Hunting

| Ad-Hoc | Min-Cut |
|--------|---------|
| "What could be a SPOF?" (imagination-limited) | Mathematically complete enumeration |
| May miss structural vulnerabilities | Finds ALL chokepoints |
| Depends on expertise | Algorithmic, reproducible |
| Subjective | Objective |

Min-cut doesn't ask "what might fail?" - it asks "what's the cheapest way to break this system?" and then tells you.
