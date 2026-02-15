# 403 - Defense in Depth Design (Swiss Cheese Validated)

## Phase
MITIGATE

## Purpose
For critical risks, design layered defenses where no single layer is sole protection. Validated against Swiss Cheese Model - layers must be INDEPENDENT.

## Defense Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| **PREVENT** | Stop the risk from occurring | Input validation, access control, design constraints |
| **DETECT** | Identify early when it does occur | Monitoring, alerting, anomaly detection |
| **CONTAIN** | Limit the blast radius | Circuit breakers, isolation, rate limiting |
| **RECOVER** | Restore normal operation | Backups, rollback, failover |
| **LEARN** | Prevent recurrence | Post-incident review, process improvement |

## Procedure

### Step 1: Select Critical Risks
Apply Defense in Depth to:
- CRITICAL tier risks (composite ≥60)
- HIGH tier risks with FAT_TAIL flag
- All NON_ERGODIC risks

### Step 2: Design Each Layer
For each critical risk, design defense at each layer:

```
Risk: [Description]
├── PREVENT: [What stops it from happening]
├── DETECT: [How we know it's happening]
├── CONTAIN: [How we limit damage]
├── RECOVER: [How we restore normal]
└── LEARN: [How we improve]
```

### Step 3: Swiss Cheese Validation
**Critical step:** After designing layers, validate independence.

For each pair of layers, check:

| Question | If Yes... |
|----------|-----------|
| Same person maintains both? | Correlated holes |
| Share infrastructure? | Common mode failure |
| Same event can disable both? | Correlated failure |
| If Layer N fails silently, does N+1 still detect? | Independence test |

### Step 4: Independence Remediation
Where correlation found:
- Different people for different layers
- Different vendors/tools for different layers
- Explicit "Layer N failed" detection in Layer N+1

### Step 5: Document Defense Matrix
Create matrix showing all layers and their independence status.

## Output Schema
```yaml
defense_in_depth:
  - risk_id: "RISK-XXX"
    title: "Risk description"
    criticality: "CRITICAL"

    layers:
      prevent:
        mechanism: "What prevents the risk"
        implementation: "Specific controls"
        responsible: "Who/what implements this"
        can_fail_silently: "[true|false]"

      detect:
        mechanism: "What detects the risk"
        implementation: "Specific monitoring"
        responsible: "Who/what implements this"
        detection_time: "How fast we'd know"
        depends_on_prevent: "[true|false]"

      contain:
        mechanism: "What limits damage"
        implementation: "Specific containment"
        responsible: "Who/what implements this"
        blast_radius_if_activated: "What's protected"

      recover:
        mechanism: "What restores normal"
        implementation: "Specific recovery"
        responsible: "Who/what implements this"
        rto: "Recovery time objective"
        rpo: "Recovery point objective"

      learn:
        mechanism: "What improves after incident"
        implementation: "Post-incident process"
        responsible: "Who owns improvement"

    swiss_cheese_validation:
      - layer_pair: "Prevent-Detect"
        independent: "[true|false]"
        shared_dependency: "What they share (if any)"
        remediation: "How to make independent (if needed)"
      # ... for all pairs

    overall_independence: "[High|Medium|Low]"
    weakest_link: "Which layer is least independent"
```

## Quality Checks
- [ ] All five layers defined
- [ ] Each layer has specific implementation
- [ ] Swiss Cheese validation performed
- [ ] Correlations identified and addressed
- [ ] Silent failure detection addressed

## Connections
- Feeds into: #404 (degradation as contain fails), #503 (escalation uses detect)
- Uses output from: #401 (risks marked for Treat), #303 (common mode check)
- Related to: Theoretical Foundations (Swiss Cheese Model)

## Example: Data Pipeline Corruption Risk

```yaml
risk_id: "RISK-023"
title: "Data corruption from source schema change"
criticality: "CRITICAL"

layers:
  prevent:
    mechanism: "Schema validation at ingestion"
    implementation: "Great Expectations suite validates schema before processing"
    responsible: "Data Engineering team"
    can_fail_silently: false  # Validation explicitly fails loud

  detect:
    mechanism: "Data quality monitoring"
    implementation: "dbt tests + row count reconciliation + anomaly detection"
    responsible: "Automated monitoring (DataDog)"
    detection_time: "< 30 minutes"
    depends_on_prevent: false  # Works even if validation disabled

  contain:
    mechanism: "Pipeline isolation"
    implementation: "Each source isolated; failure doesn't cascade"
    responsible: "Architecture (separate Delta tables per source)"
    blast_radius_if_activated: "Only affected source's data"

  recover:
    mechanism: "Point-in-time restore"
    implementation: "Delta time travel + source replay capability"
    responsible: "Platform (Delta Lake versioning)"
    rto: "4 hours"
    rpo: "24 hours (daily checkpoint)"

  learn:
    mechanism: "Blameless post-incident"
    implementation: "PIR template, action items tracked in Jira"
    responsible: "Engineering Manager"

swiss_cheese_validation:
  - layer_pair: "Prevent-Detect"
    independent: true
    shared_dependency: "None - different tools, different triggers"

  - layer_pair: "Detect-Contain"
    independent: true
    shared_dependency: "None - monitoring independent of isolation"

  - layer_pair: "Prevent-Recover"
    independent: false
    shared_dependency: "Both require Delta Lake to be functioning"
    remediation: "Add external backup location for extreme cases"

  - layer_pair: "Detect-Recover"
    independent: true
    shared_dependency: "None"

overall_independence: Medium
weakest_link: "Prevent-Recover share Delta dependency; if Delta is down, both fail"
```

## Swiss Cheese Visualization

```
RISK EVENT
    │
    ▼
┌─────────────────┐
│    PREVENT      │  ← Holes: Schema drift not anticipated
│   ○    ○       │
└────────┬────────┘
         │ (some get through)
         ▼
┌─────────────────┐
│    DETECT       │  ← Holes: Subtle anomalies missed
│      ○    ○    │
└────────┬────────┘
         │ (some detected late)
         ▼
┌─────────────────┐
│    CONTAIN      │  ← Holes: Isolation incomplete
│   ○      ○     │
└────────┬────────┘
         │ (some damage occurs)
         ▼
┌─────────────────┐
│    RECOVER      │  ← Holes: Backup too old
│    ○       ○   │
└────────┬────────┘
         │ (mostly recovered)
         ▼
    RESIDUAL IMPACT

Key: Each ○ is a "hole" in that layer.
Incident occurs when holes ALIGN across all layers.
Independent layers = holes don't align.
Correlated layers = holes align together.
```

## Anti-Patterns

1. **Single layer:** Only prevention, no detection or recovery
2. **Correlated layers:** Same person maintains all defenses
3. **Silent prevention failure:** If prevention fails, no one knows
4. **Recovery depends on availability:** Can't restore during outage
5. **No learning:** Same incidents repeat
