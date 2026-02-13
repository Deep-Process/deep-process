# #002 Feasibility Question Decomposition

**Phase:** 0 (FRAME)
**Tier:** 1 — Mandatory
**Purpose:** Break monolithic "Is this feasible?" into atomic, independently assessable sub-questions

## Theoretical Foundation

Based on problem decomposition principles. "Can we build this system?" is unanswerable. "Can we build the authentication module with current team skills?" is assessable.

**Key insight:** Zeno's paradox warning — infinite decomposition is itself infeasible. Stop when sub-questions are directly assessable OR clearly need probing.

## What to do

1. Start with top-level feasibility question
2. Decompose along natural fault lines
3. Assess each sub-question's assessability
4. Map dependencies between sub-questions

## Decomposition Dimensions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DECOMPOSITION FAULT LINES                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BY COMPONENT/MODULE                                                        │
│  • What are the distinct parts?                                             │
│  • Can each be assessed independently?                                      │
│  • What are the interfaces between them?                                    │
│                                                                              │
│  BY PHASE                                                                   │
│  • Design feasibility                                                       │
│  • Build feasibility                                                        │
│  • Test feasibility                                                         │
│  • Deploy feasibility                                                       │
│  • Operate feasibility                                                      │
│                                                                              │
│  BY DIMENSION (preview of ASSESS)                                           │
│  • Technical, Resource, Knowledge, Organizational                           │
│  • Temporal, Compositional, Economic, Regulatory                            │
│  • Scale, Cognitive, Dependency                                             │
│                                                                              │
│  BY UNCERTAINTY                                                             │
│  • What's most uncertain?                                                   │
│  • What has least precedent?                                                │
│  • What depends on external factors?                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: State Top-Level Question

Start with: "Is [subject] feasible?"

Make it specific:
- Bad: "Is the project feasible?"
- Good: "Is delivering a production-ready EPR reporting pipeline by Q2 feasible?"

### Step 2: First Decomposition Pass

Break down by the most natural fault line for this subject:

```
Example: EPR Reporting Pipeline
├── Data ingestion component
├── Transformation layer
├── Storage layer
├── Reporting interface
├── Integration with Mars systems
└── Regulatory compliance validation
```

### Step 3: For Each Sub-Component, Ask

| Question | Answer | Implication |
|----------|--------|-------------|
| Is this assessable NOW? | Yes | Direct assessment possible |
| Does it need investigation? | Yes | Add to research queue |
| Does it depend on others? | Yes | Map dependency |
| What domain is it in? | Complex | Flag for probing |

### Step 4: Map Dependencies

```
Example dependency map:
├── Data ingestion (depends on: Mars data format)
├── Transformation (depends on: ingestion, business rules)
├── Storage (depends on: transformation output schema)
├── Reporting (depends on: storage, Synapse access)
└── Compliance (depends on: all above + regulatory specs)
```

### Step 5: Stop Decomposing When

- Sub-question is directly assessable with available information
- Sub-question clearly needs a probe (Complex domain)
- Further decomposition doesn't add clarity
- You're decomposing indefinitely (Zeno warning)

## Output format

```yaml
sub_questions:
  - id: "Q1"
    question: "Can we build data ingestion from Mars ERP?"
    component: "Data ingestion"
    assessable_now: false
    needs_investigation: true
    investigation: "Need Mars data format specification"
    depends_on: []
    cynefin_domain: "Complicated"

  - id: "Q2"
    question: "Can we transform data per EPR requirements?"
    component: "Transformation"
    assessable_now: true
    needs_investigation: false
    depends_on: ["Q1"]
    cynefin_domain: "Complicated"

  - id: "Q3"
    question: "Will users adopt the new reporting workflow?"
    component: "User adoption"
    assessable_now: false
    needs_investigation: false
    probe_needed: true
    depends_on: ["Q4"]
    cynefin_domain: "Complex"

  - id: "Q4"
    question: "Can we build Synapse reports meeting latency SLA?"
    component: "Reporting"
    assessable_now: false
    needs_investigation: true
    investigation: "Need performance testing"
    depends_on: ["Q2"]
    cynefin_domain: "Complicated"

dependency_graph: |
  Q1 → Q2 → Q4 → Q3
         ↓
       Storage
```

## Integration Points

- **Feeds from:** #001 Cynefin classification, initial subject description
- **Feeds to:** All ASSESS methods (guides what to assess), #303 Probe Design (Complex sub-questions)

## Common Pitfalls

- **Too coarse:** "Is the technical part feasible?" — still not assessable
- **Too fine:** Decomposing into hundreds of tiny questions
- **Missing dependencies:** Sub-questions assessed in isolation when they depend on each other
- **Ignoring non-technical:** Decomposing only technical aspects, missing organizational/regulatory
