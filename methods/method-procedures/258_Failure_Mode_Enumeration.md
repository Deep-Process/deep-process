# 102 - Failure Mode Enumeration

## Phase
IDENTIFY (Vertical)

## Purpose
For each component, decision, or process step - systematically enumerate HOW it can fail. Adapted from FMEA but covering both technical and business contexts.

## Failure Mode Types

| Mode | Description | Detection | Danger Level |
|------|-------------|-----------|--------------|
| **Total** | Component stops working entirely | Usually detectable, triggers alert | MEDIUM - visible |
| **Partial/Degraded** | Works but below spec | Harder to detect, may propagate bad data | HIGH - subtle |
| **Intermittent** | Fails sometimes, works sometimes | Hardest to debug, may pass tests | HIGH - elusive |
| **Silent/Undetected** | Produces wrong output with no error signal | No error signal | CRITICAL - invisible |
| **Byzantine** | Appears to work to some, fail to others | Conflicting observations | CRITICAL - distributed |

## Procedure

### Step 1: Component Inventory
List all:
- Technical components (services, pipelines, databases)
- Decisions (architecture choices, vendor selections)
- Process steps (deployment, review, handoff)

### Step 2: Three Questions per Component
For each component:
1. **How can this fail?** (failure modes)
2. **What happens when it fails?** (effects - local AND downstream)
3. **What causes this failure?** (root causes)

### Step 3: Mode Classification
For each failure, classify by mode type:
- Total, Partial, Intermittent, Silent, or Byzantine

### Step 4: Detectability Assessment
How would we know this failure occurred?
- Immediately? Hours later? Never?

## Output Schema
```yaml
failure_modes:
  - component: "Component name"
    mode_type: "[Total|Partial|Intermittent|Silent|Byzantine]"
    description: "How this failure manifests"
    effect_local: "Impact on this component"
    effect_downstream: "Impact on dependent systems"
    root_cause: "Why this failure occurs"
    detectability: "[Immediate|Hours|Days|Never]"
    detection_mechanism: "How we would detect this"
```

## Quality Checks
- [ ] All critical components enumerated
- [ ] Each component has at least 2 failure modes identified
- [ ] Silent and Byzantine modes specifically considered
- [ ] Downstream effects traced
- [ ] Detection mechanisms identified

## Connections
- Feeds into: #201 (detectability score), #403 (defense layers)
- Uses output from: Architecture documentation, component inventory
- Related to: #108 (boundary risks), #303 (common mode failures)

## Examples

### Technical: Delta Lake Merge Pipeline
```yaml
Component: Delta Lake merge pipeline

Failure Modes:
  - mode_type: Total
    description: Cluster crash
    effect_local: Pipeline stops
    effect_downstream: No data updates, stale reports
    detectability: Immediate (alert fires)

  - mode_type: Partial
    description: Merge timeout on large batches
    effect_local: Some records missing
    effect_downstream: Incomplete reports
    detectability: Hours (unless row count monitored)

  - mode_type: Intermittent
    description: Concurrent write conflict
    effect_local: Non-deterministic duplicates
    effect_downstream: Inflated metrics
    detectability: Days (passes individual tests)

  - mode_type: Silent
    description: Schema drift in source
    effect_local: Wrong values in correct columns
    effect_downstream: Wrong business decisions
    detectability: Never (no error, just wrong)

  - mode_type: Byzantine
    description: UI shows success, executor OOM killed mid-write
    effect_local: Partial parquet files
    effect_downstream: Queries return partial data
    detectability: Hours (conflicting symptoms)
```

### Business: Market Expansion Decision
```yaml
Component: Expand to new EU market

Failure Modes:
  - mode_type: Total
    description: Regulatory block
    effect_local: Cannot enter at all
    effect_downstream: Investment lost
    detectability: Immediate (clear rejection)

  - mode_type: Partial
    description: GDPR forces feature removal
    effect_local: Reduced value proposition
    effect_downstream: Lower adoption than projected
    detectability: Days (slow realization)

  - mode_type: Silent
    description: Cultural misread
    effect_local: Product adopted for wrong use case
    effect_downstream: Strategy fails despite good metrics
    detectability: Never (metrics look OK)
```
