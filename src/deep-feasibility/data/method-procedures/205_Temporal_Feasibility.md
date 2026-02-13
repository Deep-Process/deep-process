# #205 Temporal Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if we can do this in the time available

## Theoretical Foundation

Based on critical path analysis and Brooks's Law. Not just total effort but CALENDAR time considering dependencies, parallelism limits, and waiting time.

**Key insight:** Hofstadter's Law: "It always takes longer than you expect, even when you take into account Hofstadter's Law."

## Calendar Time Traps

| Trap | Reality |
|------|---------|
| **Effort = Duration** | 40 hours of work ≠ 1 week (meetings, interruptions, context switching) |
| **Linear parallelism** | Two people ≠ half the time (Brooks — communication overhead) |
| **Invisible waiting** | Provisioning, approvals, third-party dependencies not in task estimates |
| **Integration ignored** | "Components done" ≠ "System done" — integration takes 30-50% of total |

## Step-by-step

### Step 1: Decompose into Tasks

Break work into estimable tasks:
- Include ALL task types (design, build, test, deploy, documentation)
- Include integration tasks explicitly
- Include waiting/approval tasks

### Step 2: Map Dependencies

```
Which tasks must complete before others can start?

Task A (Design)
  └──▶ Task B (Build component 1)
         └──▶ Task D (Integrate)
  └──▶ Task C (Build component 2)
         └──▶ Task D (Integrate)
              └──▶ Task E (Test)
                   └──▶ Task F (Deploy)
```

### Step 3: Identify Critical Path

Critical path = longest dependency chain = minimum calendar time

```
Example:
Path 1: A → B → D → E → F = 15 weeks
Path 2: A → C → D → E → F = 12 weeks
Path 3: Waiting for Mars data = 8 weeks

Critical path: Path 1 (15 weeks)
```

### Step 4: Assess Parallelism Limits

How much can happen simultaneously?

| Constraint | Impact |
|------------|--------|
| Team size | Max N tasks in parallel |
| Environment availability | May block parallel testing |
| Dependency chain | Some tasks inherently serial |
| Review capacity | Bottleneck on approvals |

### Step 5: Add Non-Work Time

```
Calendar time adjustments:
+ Holidays: 2 weeks
+ Meetings/overhead: 20% → 3 weeks on 15-week project
+ Context switching: 15% if shared resources
+ Sick/vacation: 5%
```

### Step 6: Add Waiting Time

```
Waiting time often invisible:
+ Environment provisioning: 2 weeks
+ Security review: 2 weeks
+ Third-party dependencies: varies
+ Approval cycles: 1-2 weeks each
```

### Step 7: Add Integration Time

Integration typically 30-50% of component development:

| Situation | Integration % |
|-----------|--------------|
| Well-defined interfaces, precedent | 15-20% |
| Partially defined interfaces | 30-40% |
| Undefined interfaces, no precedent | 50-70% |

### Step 8: Apply Corrections

```
Raw estimate: 15 weeks
+ Non-work time: +3 weeks
+ Waiting time: +4 weeks
+ Integration: +4 weeks
= Adjusted: 26 weeks

Hofstadter correction (×1.3 minimum):
= Corrected: 34 weeks

Deadline: 20 weeks
Gap: -14 weeks (INFEASIBLE as planned)
```

### Step 9: Score Temporal Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Corrected estimate well within deadline with buffer |
| 4 | Corrected estimate fits with small buffer |
| 3 | Corrected estimate tight, no buffer |
| 2 | Corrected estimate exceeds deadline |
| 1 | Corrected estimate far exceeds deadline |

## Output format

```yaml
temporal_feasibility:
  score: 2
  confidence: "H"

  deadline:
    date: "2024-06-30"
    type: "Fixed — regulatory"
    weeks_available: 20

  critical_path:
    path: "Design → Build Pipeline → Integration → Testing → Deployment"
    raw_duration: "15 weeks"
    tasks:
      - task: "Design"
        effort: "2 weeks"
        dependencies: []
      - task: "Build pipeline"
        effort: "6 weeks"
        dependencies: ["Design"]
      - task: "Integration"
        effort: "4 weeks"
        dependencies: ["Build pipeline", "Mars data ready"]
      - task: "Testing"
        effort: "2 weeks"
        dependencies: ["Integration"]
      - task: "Deployment"
        effort: "1 week"
        dependencies: ["Testing"]

  parallelism:
    max_parallel_tasks: 3
    limiting_factor: "Team size (4 FTE)"
    bottlenecks:
      - "Integration — single stream"
      - "Testing environment — shared"

  time_adjustments:
    non_work_time:
      holidays: "+2 weeks"
      meetings_overhead: "+3 weeks"
      context_switching: "+1 week"
    waiting_time:
      environment_provisioning: "+2 weeks"
      security_review: "+2 weeks"
      mars_data_dependency: "+2 weeks"
    integration_time: "+4 weeks"

  estimates:
    raw: "15 weeks"
    adjusted: "26 weeks"
    hofstadter_corrected: "34 weeks"
    correction_factor: 1.3

  gap_analysis:
    deadline: "20 weeks"
    corrected_estimate: "34 weeks"
    gap: "-14 weeks"
    status: "EXCEEDS DEADLINE"

  options:
    - option: "Extend deadline"
      new_deadline: "34 weeks"
      feasibility: "Requires sponsor approval"
    - option: "Reduce scope"
      scope_reduction: "Remove ML component (-6 weeks)"
      new_estimate: "28 weeks"
    - option: "Add resources"
      impact: "Limited — Brooks's Law"
      potential_reduction: "-2 weeks max"
    - option: "Parallel workstreams"
      feasibility: "Already maximized"
```

## Integration Points

- **Feeds from:** #003 Scope, #202 Resources, task breakdown
- **Feeds to:** #401 Overall profile, #502 Hofstadter correction

## Common Pitfalls

- **Estimating effort, not duration:** Hours ≠ calendar time
- **Ignoring waiting time:** Approvals, provisioning, dependencies
- **Optimistic parallelism:** "Both can work simultaneously"
- **Integration as afterthought:** Often 30-50% of total
- **No buffer:** Everything must go perfectly
