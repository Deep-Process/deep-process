# 003 - System Characterization (Perrow Matrix)

## Phase
GROUND

## Purpose
Assess the project/system's position on Perrow's two dimensions - complexity and coupling - to determine its inherent accident propensity. This sets expectations: in some systems, accidents are INEVITABLE and the goal shifts from prevention to survivability.

## Perrow Matrix

```
                    COUPLING
                    Loose           Tight
                +-----------+-----------+
    Linear      |  LOW RISK |  MODERATE |
COMPLEXITY      |  (simple  |  (fast    |
                |  + slack) |   but     |
                |           |   linear) |
                +-----------+-----------+
    Complex     |  MODERATE |  NORMAL   |
    (non-       |  (complex |  ACCIDENTS|
     linear)    |   but     |  zone     |
                |   slack)  |  <- HERE  |
                +-----------+-----------+
```

## Complexity Indicators

Score 1-5 based on these factors:

| Factor | Low (1) | High (5) |
|--------|---------|----------|
| Feedback loops | Few, linear | Many, non-linear |
| Component interactions | A affects B | A affects B which affects C which changes A |
| Paths between components | One clear path | Multiple, hard to trace |
| Component functions | Single purpose | Serve multiple functions |
| Emergent properties | Predictable from parts | Not predictable |

## Coupling Indicators

Score 1-5 based on these factors:

| Factor | Loose (1) | Tight (5) |
|--------|-----------|-----------|
| Time-dependency | Can pause, reorder | Sequence matters, can't pause |
| Slack/buffer | Abundant buffers | No slack between stages |
| Substitution | Multiple ways to achieve | One way only |
| Redundancy | Real redundancy | Little or coupled redundancy |
| Propagation speed | Slow, can intervene | Fast, no time to react |

## Procedure

### Step 1: Score Complexity
Rate 1-5 using complexity indicators.
Document evidence for each factor.

### Step 2: Score Coupling
Rate 1-5 using coupling indicators.
Document evidence for each factor.

### Step 3: Plot on Matrix
Determine which zone the system falls into:
- **Low Risk** (Complexity <=2, Coupling <=2): Standard risk management
- **Moderate Linear** (Complexity <=2, Coupling >2): Fast but predictable
- **Moderate Complex** (Complexity >2, Coupling <=2): Complex but slack to absorb
- **Normal Accidents Zone** (Complexity >3, Coupling >3): Accidents INEVITABLE

### Step 4: Strategic Implications

If in Normal Accidents Zone (both >= 4):
- Accept that some failures are inevitable
- Shift investment from PREVENTION to:
  - DETECTION (fast awareness)
  - RECOVERY (fast restoration)
  - GRACEFUL DEGRADATION (survive failure)
- Design for survivability, not perfection

### Step 5: Subsystem Analysis
A system may span multiple zones. Map each subsystem separately.

## Output Schema
```yaml
system_profile:
  complexity_score: 4
  complexity_evidence:
    - "Multiple feedback loops between data pipelines and reporting"
    - "Components serve dual purposes (ETL + validation)"
  coupling_score: 4
  coupling_evidence:
    - "Time-dependent SLA for regulatory reporting"
    - "Limited buffer between stages"
  perrow_zone: "Normal Accidents"
  strategic_implication: "Focus on detection and recovery over prevention"

  subsystem_profiles:
    - name: "Batch Pipeline"
      complexity: 3
      coupling: 2
      zone: "Moderate Complex"
    - name: "Real-time Alerts"
      complexity: 4
      coupling: 5
      zone: "Normal Accidents"
```

## Quality Checks
- [ ] Both dimensions scored with evidence
- [ ] Zone correctly identified
- [ ] Strategic implications documented
- [ ] Subsystems analyzed where applicable
- [ ] Implication cascaded to MITIGATE phase planning

## Connections
- Feeds into: #305 (compound scenarios), #403 (defense design), #404 (graceful degradation)
- Uses output from: Architecture documentation, Deep-Explore system analysis
- Related to: Theoretical Foundations (Normal Accident Theory)

## Examples

### Complex + Tightly Coupled (Normal Accidents Zone)
```
System: Real-time fraud detection pipeline
Complexity: 5
- Non-linear ML models with feedback
- Components affect each other's thresholds
- Emergent false-positive patterns
Coupling: 5
- Must process within milliseconds
- No slack - transaction waits for decision
- No redundancy in ML inference path

Zone: Normal Accidents
Implication: Some false positives/negatives are INEVITABLE.
Design for fast correction, not zero errors.
```

### Complex + Loosely Coupled
```
System: Data lake with multiple consumers
Complexity: 4
- Many pipelines with subtle dependencies
- Schema changes ripple unpredictably
Coupling: 2
- Consumers read at their own pace
- Significant time buffers
- Multiple paths to same data

Zone: Moderate Complex
Implication: Can absorb failures gracefully, but failures hard to predict.
Invest in observability and root cause tools.
```
