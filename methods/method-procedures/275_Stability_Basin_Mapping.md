# 207 - Stability Basin Mapping

## Phase
QUANTIFY

## Purpose
Define the system's equilibrium state, then test how large a perturbation it can absorb before falling into a different (worse) equilibrium. Maps the "distance to cliff edge."

## Core Concept

**Stability Basin (from dynamical systems theory):**

A marble in a bowl is stable:
- Push it a little → it returns to center
- Push it too hard → it leaves the bowl entirely and finds a new resting place

Systems behave the same way:
- **Small perturbations** → recovery (resilient)
- **Large perturbations** → new (possibly catastrophic) state

The key question: **How far are we from the edge?**

## Procedure

### Step 1: Define Equilibrium
What does "system operating normally" look like?

Define in measurable terms:
- Performance metrics at normal levels
- Error rates within bounds
- Capacity utilization in target range
- Team operating sustainably

### Step 2: Identify Perturbations
What forces push the system away from equilibrium?

Common perturbations:
- Load spikes
- Team changes (departure, illness)
- Budget cuts
- Data quality drops
- Dependency failures
- Requirement changes

### Step 3: Response Classification
For each perturbation, classify the system's response:

| Response | Description | Indicator |
|----------|-------------|-----------|
| **Stable** | Returns to equilibrium after perturbation stops | Resilient |
| **Marginal** | Oscillates or takes long to recover | Warning zone |
| **Unstable** | Falls into new state and doesn't return | Catastrophe |

### Step 4: Find Tipping Points
For each perturbation: How large does it need to be before transition?

```
Perturbation Size →
[STABLE]----[MARGINAL]----[UNSTABLE]
        ↑              ↑
   First threshold  Second threshold
```

### Step 5: Measure Current Distance
How close to each tipping point are we NOW?

```
Distance to Tipping = (Tipping Point - Current State) / Tipping Point
```

Low distance = high risk

## Output Schema
```yaml
stability_basins:
  - perturbation: "What force pushes system from equilibrium"
    perturbation_type: "[Load|People|Financial|Quality|Dependency|Requirements]"

    equilibrium_definition:
      metric: "Measurable indicator of normal state"
      normal_value: "Value at equilibrium"
      unit: "Unit of measurement"

    thresholds:
      stable_threshold: "Perturbation size where system remains stable"
      marginal_threshold: "Perturbation size where recovery is slow"
      unstable_threshold: "Perturbation size where system fails to recover"

    responses:
      at_stable: "What happens within stable range"
      at_marginal: "What happens in marginal zone"
      at_unstable: "What happens beyond unstable threshold"

    current_state:
      value: "Where we are now"
      distance_to_marginal: "How much headroom"
      distance_to_unstable: "Distance to catastrophe"
      trend: "[Stable|Approaching|Receding]"

    risk_assessment: "[Low|Medium|High|Critical]"
```

## Quality Checks
- [ ] Equilibrium clearly defined with metrics
- [ ] All significant perturbation types considered
- [ ] Thresholds quantified where possible
- [ ] Current distance measured
- [ ] Trends tracked

## Connections
- Feeds into: #501 (leading indicators), #404 (degradation levels)
- Uses output from: System metrics, capacity data
- Related to: #111 (temporal risks approach thresholds over time)

## Examples

### Example 1: Data Volume
```yaml
perturbation: "Data volume increase"
perturbation_type: Load

equilibrium_definition:
  metric: "Pipeline completion time"
  normal_value: "3 hours"
  unit: "hours"

thresholds:
  stable_threshold: "+50% volume (still completes in <4 hours)"
  marginal_threshold: "+100% volume (completes in 5-6 hours, competes with next run)"
  unstable_threshold: "+150% volume (never catches up, backlog grows indefinitely)"

responses:
  at_stable: "Pipeline completes on time, some buffer consumed"
  at_marginal: "Runs overlap, queue builds up, recovers on low-volume days"
  at_unstable: "Permanent backlog, system never recovers without intervention"

current_state:
  value: "Current volume at 80% of design capacity"
  distance_to_marginal: "20% headroom (50% threshold - 80% current = can absorb +50% more)"
  distance_to_unstable: "70% headroom"
  trend: "Approaching (15% YoY growth)"

risk_assessment: Medium
# Note: At current growth rate, will reach marginal in ~1.3 years
```

### Example 2: Team Capacity
```yaml
perturbation: "Team member departure"
perturbation_type: People

equilibrium_definition:
  metric: "Sprint velocity and knowledge coverage"
  normal_value: "100% planned work delivered, all areas covered"
  unit: "percentage/coverage"

thresholds:
  stable_threshold: "1 person leaves (redistribute work, slower but functional)"
  marginal_threshold: "2 people leave (significant slowdown, some areas uncovered)"
  unstable_threshold: "3+ people or key person leaves (cannot maintain system)"

responses:
  at_stable: "Work redistributed, velocity drops 15-20%, recovers in 2-3 sprints"
  at_marginal: "Critical knowledge gaps, external help needed, 6+ month recovery"
  at_unstable: "Cannot maintain system, escalation required, potential project failure"

current_state:
  value: "Full team of 5, but key person concentration exists"
  distance_to_marginal: "1 person (key person departure = direct to marginal)"
  distance_to_unstable: "1-2 people depending on who"
  trend: "Stable (no known departure plans)"

risk_assessment: High
# Note: Key person dependency means effective threshold is lower
```

### Example 3: Budget
```yaml
perturbation: "Budget reduction"
perturbation_type: Financial

equilibrium_definition:
  metric: "Ability to deliver planned scope with acceptable quality"
  normal_value: "100% scope, acceptable quality, sustainable pace"
  unit: "percentage"

thresholds:
  stable_threshold: "10% budget cut (absorb with efficiency, no scope cut)"
  marginal_threshold: "25% budget cut (scope reduction required, quality pressure)"
  unstable_threshold: "40% budget cut (cannot deliver viable product)"

responses:
  at_stable: "Find efficiencies, optimize, maintain delivery"
  at_marginal: "Hard prioritization, scope cuts, quality risks, team stress"
  at_unstable: "Project failure, team layoffs, relationship damage"

current_state:
  value: "Currently at full budget allocation"
  distance_to_marginal: "25% (full distance available)"
  distance_to_unstable: "40%"
  trend: "Stable (budget approved for year)"

risk_assessment: Low
# But: If organization faces pressure, budget is often first cut
```

## Visualization

```
Stability Basin Diagram

         UNSTABLE
            |
    ========|======== Unstable Threshold (tipping point)
            |
         MARGINAL
            |    ↑ Danger Zone
    --------|-------- Marginal Threshold
            |
         STABLE
            |
            |    ← Current Position
    ________|________
            |
         EQUILIBRIUM

Distance to Tipping = Height from current position to unstable threshold
```

## Integration with Other Methods

- **#111 Temporal Risks:** Temporal risks often manifest as slow drift toward tipping points
- **#501 Leading Indicators:** Monitor proximity to thresholds as leading indicator
- **#404 Graceful Degradation:** Marginal zone = degraded operation
- **#505 Sorites Watch:** Track gradual approach to thresholds
