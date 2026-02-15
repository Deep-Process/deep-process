# 303 - Common Mode Failure Detection

## Phase
INTERACT

## Purpose
Find single points whose failure breaks multiple supposedly independent systems. The most dangerous pattern: N "redundant" things that all depend on one hidden thing.

## Core Concept: False Redundancy

**The Illusion:**
- "We have a backup system"
- "We have two data centers"
- "Two people know this process"

**The Reality:**
- Backup runs on same infrastructure
- Both data centers use same DNS provider
- Both people learned from same (now departed) person

**Common Mode Failure:** A single failure that defeats multiple redundant systems because they share a hidden dependency.

## Procedure

### Step 1: List Redundancies
List all stated redundancies and backup systems:
- "If X fails, we have Y"
- "Both A and B can handle this"
- "We have N+1 redundancy"

### Step 2: Trace Dependencies
For each pair of "independent" components, trace dependencies until you find shared elements.

Check across ALL dimensions:
| Dimension | What to look for |
|-----------|------------------|
| **Infrastructure** | Same cloud region, same rack, same power |
| **Data** | Same database, same source, same backup location |
| **People** | Same person maintains both, same knowledge source |
| **Process** | Same CI/CD, same deployment process |
| **Vendor** | Same vendor provides both services |
| **Knowledge** | Same documentation, same training |
| **Time** | Same maintenance window, same backup schedule |

### Step 3: Identify Hidden Shared Points
Where dependencies converge = **common mode failure point**

### Step 4: Apply Swiss Cheese Model
Are the holes in your defense layers correlated?

| Question | If Yes... |
|----------|-----------|
| Same vendor runs primary and backup? | Common mode |
| Same person maintains both systems? | Common mode |
| Same CI/CD pipeline deploys both? | Common mode |
| Same monitoring system watches both? | Common mode |
| Same time window for maintenance? | Common mode |

### Step 5: Assess False Redundancy
For each common mode point:
- What's the blast radius?
- Is the stated redundancy actually false?
- What's the real redundancy level?

## Output Schema
```yaml
common_modes:
  - shared_dependency: "The hidden common element"
    dependency_type: "[Infrastructure|Data|People|Process|Vendor|Knowledge|Time]"
    affected_components:
      - "Component A (supposedly independent)"
      - "Component B (supposedly independent)"
    false_redundancy_flag: true
    stated_redundancy: "What we claim"
    actual_redundancy: "What's really true"
    blast_radius: "[Low|Medium|High|Critical]"
    blast_radius_detail: "What fails if this dependency fails"
    swiss_cheese_violation: "How this correlates defense layers"
```

## Quality Checks
- [ ] All claimed redundancies examined
- [ ] Dependencies traced across all dimensions
- [ ] Hidden shared points identified
- [ ] Swiss Cheese Model applied
- [ ] False redundancy explicitly flagged

## Connections
- Feeds into: #306 (min-cut includes common modes), #403 (defense validation)
- Uses output from: #104 (dependencies), architecture documentation
- Related to: Theoretical Foundations (Swiss Cheese Model)

## Examples

### Example 1: Database Redundancy
```yaml
shared_dependency: "Azure region West Europe"
dependency_type: Infrastructure
affected_components:
  - "Primary database (Azure SQL)"
  - "Replica database (Azure SQL)"
  - "Backup storage (Azure Blob)"
false_redundancy_flag: true
stated_redundancy: "We have database replica and backups"
actual_redundancy: "Single region - all three fail together on region outage"
blast_radius: Critical
blast_radius_detail: "All data access fails, no recovery option within region"
swiss_cheese_violation: "All defense layers (primary, replica, backup) share same failure mode"
```

### Example 2: Knowledge Redundancy
```yaml
shared_dependency: "Original system designer (now departed)"
dependency_type: Knowledge
affected_components:
  - "Engineer A (learned from designer)"
  - "Engineer B (learned from designer)"
  - "Documentation (written by designer)"
false_redundancy_flag: true
stated_redundancy: "Two engineers know the system, plus documentation"
actual_redundancy: "All knowledge traces to one source; no independent verification"
blast_radius: High
blast_radius_detail: "If original understanding was wrong, all inheritors share the error"
swiss_cheese_violation: "Knowledge layers have correlated 'holes' (same blind spots)"
```

### Example 3: Monitoring Redundancy
```yaml
shared_dependency: "Datadog monitoring platform"
dependency_type: Vendor
affected_components:
  - "Application monitoring"
  - "Infrastructure monitoring"
  - "Alerting system"
  - "On-call paging"
false_redundancy_flag: true
stated_redundancy: "Comprehensive monitoring across all systems"
actual_redundancy: "Single monitoring vendor - if Datadog fails, we're blind"
blast_radius: High
blast_radius_detail: "Cannot detect failures in any system; on-call not notified"
swiss_cheese_violation: "Detection layer failure affects all monitored systems"
```

### Example 4: Deployment Redundancy
```yaml
shared_dependency: "GitHub Actions CI/CD"
dependency_type: Process
affected_components:
  - "Production deployment"
  - "Staging deployment"
  - "Rollback process"
  - "Hotfix deployment"
false_redundancy_flag: true
stated_redundancy: "We can deploy to staging first, rollback if needed"
actual_redundancy: "All deployment paths use same CI/CD; GitHub outage blocks all"
blast_radius: Medium
blast_radius_detail: "Cannot deploy fixes during CI/CD outage"
swiss_cheese_violation: "All deployment options share single failure mode"
```

## Common Mode Detection Techniques

### 1. The "What If" Test
For each redundancy pair:
> "What single event could make BOTH fail simultaneously?"

If you can answer this easily → common mode exists.

### 2. Dependency Tree Merge
Draw dependency trees for both "independent" systems.
Where trees merge = common mode.

```
System A                System B
    │                       │
    ▼                       ▼
 Service A              Service B
    │                       │
    └───────┬───────────────┘
            ▼
      Shared Database  ← COMMON MODE
            │
            ▼
       Azure Region    ← COMMON MODE
```

### 3. Vendor Consolidation Check
List all vendors. If same vendor appears multiple times in "redundant" systems → common mode.

### 4. Person/Team Overlap Check
List all responsible parties. If same person/team appears in "independent" backup → common mode.

## Mitigation Strategies

Once common mode is identified:

| Strategy | Approach |
|----------|----------|
| **True diversity** | Different vendor, different region, different person |
| **Failure mode separation** | Accept shared dependency but add independent fallback |
| **Graceful degradation** | Plan for common mode failure explicitly |
| **Monitoring the monitor** | Independent alerting for the common dependency |
