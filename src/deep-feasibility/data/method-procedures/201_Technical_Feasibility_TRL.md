# #201 Technical Feasibility (TRL Analysis)

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess whether required technology exists, works, and works at needed scale

## Theoretical Foundation

Based on NASA Technology Readiness Levels (TRL). Adapted for software/data projects.

**Key insight:** System TRL = min(component TRLs). A system with nine TRL-9 components and one TRL-2 component has effective TRL of 2.

## What to do

1. List all technology components required
2. Assign TRL (1-9) to each component
3. Identify system TRL as minimum
4. Assess scale validation status
5. Determine overall technical feasibility score (1-5)

## Technology Readiness Levels

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NASA TECHNOLOGY READINESS LEVELS (adapted for software/data)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  RESEARCH PHASE (TRL 1-3) — Feasibility unknown                             │
│  ─────────────────────────────────────────────                              │
│  TRL 1: Basic principles observed and reported                              │
│         "We've read about this approach"                                    │
│                                                                              │
│  TRL 2: Technology concept and/or application formulated                    │
│         "We've designed how it would work"                                  │
│                                                                              │
│  TRL 3: Analytical/experimental proof of concept                            │
│         "We've proven it can work in isolation"                             │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DEVELOPMENT PHASE (TRL 4-6) — Feasibility partially demonstrated           │
│  ────────────────────────────────────────────────                           │
│  TRL 4: Component validated in laboratory environment                       │
│         "It works in controlled test environment"                           │
│                                                                              │
│  TRL 5: Component validated in relevant environment                         │
│         "It works with realistic conditions"                                │
│                                                                              │
│  TRL 6: System/subsystem demonstrated in relevant environment               │
│         "Prototype works end-to-end"                                        │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OPERATIONS PHASE (TRL 7-9) — Feasibility proven                            │
│  ──────────────────────────────────────────────                             │
│  TRL 7: System prototype demonstration in operational environment           │
│         "Works in production-like environment"                              │
│                                                                              │
│  TRL 8: System complete and qualified                                       │
│         "Ready for production deployment"                                   │
│                                                                              │
│  TRL 9: System proven through successful operations                         │
│         "Running in production successfully"                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: List Technology Components

Enumerate all technology required:
- Core platform/framework
- Languages and runtimes
- Data stores and processing engines
- Integration technologies
- Infrastructure components
- Custom code/algorithms
- Third-party services

### Step 2: Assess Each Component's TRL

For each component:

| Question | TRL |
|----------|-----|
| Only theoretical? | 1-2 |
| Proof of concept exists? | 3 |
| Works in test environment? | 4-5 |
| Prototype demonstrated? | 6 |
| Works in prod-like environment? | 7 |
| Qualified and ready? | 8 |
| Proven in production? | 9 |

### Step 3: Identify System TRL

**System TRL = min(component TRLs)**

Example:
```
Databricks:     TRL 9 (mature, production-proven)
Python:         TRL 9 (mature)
Delta Lake:     TRL 8 (production-ready, widely used)
Custom ML model: TRL 4 (validated in lab, not production)
───────────────────────────────────────────────
System TRL:     TRL 4 (limited by custom ML)
```

### Step 4: Assess Scale Status

For each component, compare:
- **Scale tested:** What volume/load has been validated?
- **Scale needed:** What does production require?
- **Gap:** Is there a qualitative jump?

Warning signs:
- 10× volume increase (may need architecture change)
- 100× or more (almost certainly needs redesign)
- 99.9% uptime requirement (fundamentally different from "best effort")

### Step 5: Convert to Feasibility Score

| System TRL | Scale Status | Feasibility Score |
|------------|--------------|------------------|
| TRL 7-9 | Tested at production scale | **5** (Proven) |
| TRL 7-9 | Tested at representative scale | **4** (Likely) |
| TRL 5-6 | Prototype works | **3** (Possible) |
| TRL 3-4 | Concept proven only | **2** (Doubtful) |
| TRL 1-2 | Theoretical only | **1** (Infeasible) |

Adjust down if:
- Scale gap is large (10× or more untested)
- Integration with low-TRL components
- Novel combination of proven technologies

## Output format

```yaml
technical_feasibility:
  score: 4
  confidence: "H"

  components:
    - name: "Databricks"
      trl: 9
      scale_tested: "10B records"
      scale_needed: "5B records"
      scale_status: "✓ Proven at scale"

    - name: "Custom ML pipeline"
      trl: 4
      scale_tested: "100K records"
      scale_needed: "100M records"
      scale_status: "⚠ 1000× gap, untested"
      note: "Binding component"

    - name: "Synapse integration"
      trl: 7
      scale_tested: "1M records"
      scale_needed: "10M records"
      scale_status: "⚠ 10× gap"

  system_trl: 4
  binding_component: "Custom ML pipeline"

  evidence:
    - "Databricks proven at required scale (internal experience)"
    - "ML pipeline only tested in POC environment"
    - "Synapse integration documented but not at full scale"

  development_needed:
    - component: "Custom ML pipeline"
      gap: "TRL 4 → TRL 7"
      effort: "4-6 weeks of development + testing"
      uncertainty: "Medium — similar work done, not this specific model"
```

## Integration Points

- **Feeds from:** Technology stack from requirements, #001 domain classification
- **Feeds to:** #401 Overall feasibility profile, #206 compositional feasibility

## Common Pitfalls

- **Confusing TRL with familiarity:** Team knows the technology ≠ technology is mature
- **Ignoring scale jumps:** "It works" at 1K records doesn't mean it works at 1B
- **Averaging instead of minimum:** System limited by weakest component
- **Overconfidence in "proven" tech:** Proven for others doesn't mean proven for your use case
- **Missing custom code:** Often the lowest-TRL component is what you're building

## Confidence Guidance

- **High confidence:** Direct production experience with same technology at same scale
- **Medium confidence:** Experience with similar technology/scale, or documented case studies
- **Low confidence:** Theoretical assessment only, no direct validation
