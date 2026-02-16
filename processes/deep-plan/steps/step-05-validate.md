# STEP 5: VALIDATE

## PRECONDITION

```
GATE_ENTRY: GATE_4 = OPEN

IF GATE_4 ≠ OPEN:
  HALT
  OUTPUT: "ERROR: GATE_4 not open"
```

## SEQUENCE

### 5.1: VALIDATE_CONSTRAINTS

```
LOAD: constraint_context
LOAD: sequencing-plan.yaml → total_sprints

COMPUTE: planned_duration_months = total_sprints × 0.5

CHECK: planned_duration_months <= constraint_context.timeline

IF NOT:
  OUTPUT: "Timeline exceeded: {planned} > {constraint}"
  DECLARE: scope_reduction_required = TRUE
  HALT

COMPUTE: total_cost = SUM(resource_allocation × planned_duration)

CHECK: total_cost <= constraint_context.budget

IF NOT:
  OUTPUT: "Budget exceeded: {total_cost} > {budget}"
  DECLARE: scope_reduction_required = TRUE
  HALT

IF both constraints MET:
  CONFIRM: "Constraints satisfied"
```

### 5.2: VALIDATE_DEPENDENCIES

```
LOAD: sequencing-plan.yaml → dependencies[]

FOR each dependency IN dependencies[]:

  task_a = dependency.source_task
  task_b = dependency.target_task

  CHECK: task_a.sprint_number <= task_b.sprint_number

  IF NOT:
    OUTPUT: "Dependency violation: {task_a} (Sprint {n}) → {task_b} (Sprint {m})"
    DECLARE: resequencing_required = TRUE

  CHECK: task_a NOT IN circular_chain

  IF IN circular_chain:
    OUTPUT: "Circular dependency: {chain}"
    HALT

IF all dependencies VALID:
  CONFIRM: "Dependencies valid"
```

### 5.3: VALIDATE_CAPACITY

```
LOAD: resource-allocation.yaml

FOR each sprint IN sprints[]:

  FOR each person IN team_structure:

    COMPUTE: allocated_hours = person.sprint_workload[sprint]

    CHECK: allocated_hours <= 70

    IF exceeded:
      OUTPUT: "Overallocation: {person} in Sprint {sprint}: {hours}h"
      DECLARE: rebalancing_required = TRUE

IF NO overallocations:
  CONFIRM: "Capacity sufficient"
```

### 5.4: SIMULATE_EXECUTION

```
DEFINE: simulation_iterations = 100

FOR iteration FROM 1 TO simulation_iterations:

  FOR each task IN tasks[]:

    VARY: task.duration BY random(-30%, +30%)

    RECOMPUTE: sprint_durations[]
    RECOMPUTE: total_duration

  RECORD: total_duration_iteration

COMPUTE:
  p50_duration = MEDIAN(total_duration_iterations)
  p90_duration = PERCENTILE(total_duration_iterations, 90)
  on_time_probability = COUNT(total_duration <= planned_duration) / 100

VERIFY: on_time_probability >= 0.70

IF < 0.70:
  OUTPUT: "High risk of delay: P(on-time) = {probability}"
  OUTPUT: "P90 duration: {p90_duration} vs planned: {planned_duration}"
  DECLARE: buffer_insufficient = TRUE
  HALT

IF >= 0.70:
  CONFIRM: "Simulation acceptable: P(on-time) = {probability}"
```

## COUNTER-CHECK

```
CLAIM: "Plan is feasible"

ATTEMPT_REFUTATION:
  CHECK: scope_reduction_required = TRUE?
  CHECK: resequencing_required = TRUE?
  CHECK: rebalancing_required = TRUE?
  CHECK: buffer_insufficient = TRUE?

  IF any TRUE:
    REFUTATION: SUCCESS
    OUTPUT: "Plan infeasible: [issues list]"
    RETURN: To failed validation step

  REFUTATION: FAILED
  CONFIRMATION: "Plan feasible"
```

## CHECKLIST

```
□ Timeline constraint met (planned <= target)?
□ Budget constraint met (cost <= budget)?
□ Dependencies valid (no violations, no cycles)?
□ Capacity sufficient (no overallocations)?
□ Simulation acceptable (P(on-time) >= 70%)?
□ Counter-check executed (plan feasible)?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## GATE_5

```
EVALUATE:
  constraints_met = TRUE
  dependencies_valid = TRUE
  capacity_sufficient = TRUE
  simulation_acceptable = TRUE
  plan_feasible = TRUE

IF all TRUE:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - plan validated, P(on-time) = {probability}"
  PROCEED: To step-06-baseline.md

IF any FALSE:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - validation failed: [condition]"
  HALT
```

## OUTPUT

```
WRITE: validation-results.yaml

content:
  constraints:
    timeline_met: {boolean}
    budget_met: {boolean}

  dependencies:
    valid: {boolean}
    violations: {count}

  capacity:
    sufficient: {boolean}
    overallocations: {count}

  simulation:
    p50_duration: {value}
    p90_duration: {value}
    on_time_probability: {value}

  verdict: FEASIBLE | INFEASIBLE
```
