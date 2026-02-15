---
step: 5
name: "Remediation Planning"
time_estimate: "90-180 minutes"
goal: "Create actionable remediation plans, timeline and assign ownership"
requires_completion: [4]
next_steps:
  DEFAULT: "steps/step-06a-compile.md"
gate: "GATE_5"
data_dependencies:
  - "gap_analysis from step-03"
  - "evidence_coverage from step-04"
  - "data/severity-classification.yaml"
outputs:
  - remediation_plans
  - implementation_timeline
  - ownership_assignments
---

# STEP 5: REMEDIATION PLANNING

## ENFORCEMENT RULES

```
1. Create plans for ALL CRITICAL and HIGH gaps.
2. Plans MUST be actionable with specific steps.
3. Effort estimates required for ALL actions.
4. Timeline MUST be realistic.
5. Ownership MANDATORY for critical/high plans.
6. Counter-check MANDATORY.
7. NO proceeding until all critical/high planned.
```

---

## 5.0 Load Required Data

**PRECONDITION:** GATE_4 = OPEN

IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

**Execute:**

```
LOAD step-03 output:
  [ ] gap_analysis
  [ ] critical_gaps: [N]
  [ ] high_gaps: [N]

LOAD step-04 output:
  [ ] evidence_coverage
  [ ] evidence_gaps: [list]

READ data/severity-classification.yaml:
  [ ] remediation_effort estimates
  [ ] complexity_multipliers
  [ ] prioritization_tiers

FILTER planning_scope:
  planning_scope = WHERE severity = CRITICAL OR HIGH

COUNT:
  gaps_requiring_plans = COUNT(planning_scope)

RECORD:
  [ ] Planning scope: [N] gaps
```

> **HALT** — Data loaded.

---

## 5.1 Generate Plans

**Execute for EACH gap in planning_scope:**

```
FOR gap G:

  ANALYZE gap:
    gap_id = G.id
    requirement_id = G.requirement_id
    severity = G.severity

    IDENTIFY:
      missing_element = [what is missing]
      root_cause = [why missing]
      required_action = [what to do]

  DEFINE actions:
    actions = []

    IF requires documentation:
      ADD action:
        action_type: DOCUMENTATION
        description: "Create [document] for [requirement]"
        deliverable: "[doc name]"

    IF requires implementation:
      ADD action:
        action_type: IMPLEMENTATION
        description: "Implement [feature] in [component]"
        deliverable: "[code/config]"

    IF requires testing:
      ADD action:
        action_type: TESTING
        description: "Create tests validating [requirement]"
        deliverable: "[test files]"

    IF requires process:
      ADD action:
        action_type: PROCESS
        description: "Establish [process] for [requirement]"
        deliverable: "[process doc]"

    ALWAYS add verification:
      ADD action:
        action_type: VERIFICATION
        description: "Verify compliance with [requirement]"
        deliverable: "[evidence]"

  ESTIMATE effort:
    FOR each action A:

      DETERMINE base:
        IF type = DOCUMENTATION:
          base_effort = 4 OR 16 hours

        IF type = IMPLEMENTATION:
          IF config_only: base_effort = 8
          IF single_component: base_effort = 16
          IF multiple_components: base_effort = 40
          IF architectural: base_effort = 80

        IF type = TESTING:
          base_effort = 8 OR 24 hours

        IF type = PROCESS:
          base_effort = 16 OR 40 hours

        IF type = VERIFICATION:
          base_effort = 4 hours

      ASSESS complexity:
        complexity_factors = 0

        IF has_external_dependencies: complexity_factors += 1
        IF requires_coordination: complexity_factors += 1
        IF requires_new_technology: complexity_factors += 1
        IF affects_critical_path: complexity_factors += 1

        IF complexity_factors = 0: multiplier = 1.0
        IF complexity_factors = 1: multiplier = 1.5
        IF complexity_factors = 2: multiplier = 2.0
        IF complexity_factors >= 3: multiplier = 3.0

      COMPUTE:
        effort_hours = base_effort * multiplier
        ROUND to nearest 4 hours

  DEFINE acceptance:
    criteria = [
      "Implementation deployed and functioning",
      "Documentation complete and approved",
      "Tests pass demonstrating compliance",
      "Evidence collected and verified"
    ]

  CREATE plan:
    plan_id: PLAN-[NNN]
    gap_id: [G.id]
    requirement_id: [G.requirement_id]
    severity: [G.severity]
    actions: [list actions]
    total_effort_hours: [sum]
    acceptance_criteria: [list]

RECORD plan_summary:
  Total plans: [N]
  Total effort: [hours]
```

> **HALT** — Plans created.

---

## 5.2 Create Timeline

**Execute:**

```
LOAD all plans

PRIORITIZE:
  FOR each plan P:

    IF severity = CRITICAL:
      tier = TIER_1_IMMEDIATE
      max_delay = 7 days

    IF severity = HIGH:
      tier = TIER_2_URGENT
      max_delay = 30 days

    WITHIN tier order by:
      1. Detectability (high first)
      2. No dependencies first
      3. Lower effort first

BUILD dependency graph:
  FOR each plan P:
    FOR each dependency D:
      RECORD: P depends on D

  CHECK for cycles:
    RUN topological sort

    IF circular_dependency:
      LOG ERROR: "Circular: [list]"
      HALT

SCHEDULE into phases:

  PHASE 1 (Days 1-30):
    SELECT: WHERE tier = TIER_1_IMMEDIATE

    FOR each plan:
      start_date = MAX(current_date, dependency_completion)
      duration = effort_hours / (capacity_hours_per_week / 5)
      completion_date = start_date + duration

    phase_1_effort = SUM(effort_hours)
    phase_1_complete = MAX(completion_dates)

  PHASE 2 (Days 31-90):
    SELECT: WHERE tier = TIER_2_URGENT

    start_after = phase_1_complete

    FOR each plan:
      [same scheduling logic]

    phase_2_effort = SUM(effort_hours)
    phase_2_complete = MAX(completion_dates)

  PHASE 3+ (Days 91+):
    SELECT: WHERE tier = TIER_3 OR TIER_4
    [flexible scheduling]

VERIFY deadline:
  compliance_ready_date = phase_2_complete

  IF enforcement_deadline exists:
    buffer_days = enforcement_deadline - compliance_ready_date

    IF buffer_days < 0:
      timeline_risk = HIGH
      timeline_status = AT_RISK

    ELIF buffer_days < 30:
      timeline_risk = MEDIUM
      timeline_status = TIGHT

    ELSE:
      timeline_risk = LOW
      timeline_status = ON_TRACK

RECORD timeline:
  phase_1:
    duration_weeks: 4
    plans: [list IDs]
    effort_hours: [N]
    complete_date: [date]

  phase_2:
    duration_weeks: 8
    plans: [list IDs]
    effort_hours: [N]
    complete_date: [date]

  compliance_ready_date: [date]
  timeline_status: [status]
```

> **HALT** — Timeline created.

---

## 5.3 Assign Ownership

**Execute for EACH plan:**

```
FOR plan P:

  DETERMINE owner_type:
    action_types = [list types from P.actions]

    IF "IMPLEMENTATION" in action_types:
      primary_type = ENGINEER

    IF "DOCUMENTATION" dominant:
      primary_type = TECHNICAL_WRITER

    IF "TESTING" dominant:
      primary_type = QA_ENGINEER

    IF "PROCESS" dominant:
      primary_type = COMPLIANCE_OFFICER

  ASSIGN owner:
    CRITERIA:
      Has required skills
      Has capacity
      Not overloaded

    primary_owner = [name/email OR "UNASSIGNED"]

    IF severity = CRITICAL AND owner = "UNASSIGNED":
      escalation_required = TRUE
      LOG CRITICAL: "Critical plan unassigned"

  ASSIGN approver:
    IF severity = CRITICAL:
      approver = COMPLIANCE_LEAD
    ELSE:
      approver = TECHNICAL_LEAD

  RECORD ownership:
    plan_id: [P.id]
    primary_owner: [name OR "UNASSIGNED"]
    approver: [name]
    status: PENDING

COMPUTE stats:
  assigned_plans = COUNT WHERE owner != "UNASSIGNED"
  assignment_rate = assigned_plans / total_plans
```

> **HALT** — Ownership assigned.

---

## 5.4 Counter-Check

**Execute all 5 checks:**

### Check 1: Completeness

```
FOR gap WHERE severity = CRITICAL OR HIGH:

  VERIFY: Plan exists

  IF no_plan:
    LOG ERROR: "Missing plan for gap [id]"
    CREATE plan using 5.1
    UPDATE timeline and ownership

  IF has_plan:
    CONFIRM complete
```

### Check 2: Realism

```
FOR each plan:

  CHALLENGE effort:
    FOR each action:
      QUESTION: Is [effort] realistic?
      RE-EVALUATE complexity
      ADJUST if needed

  CHALLENGE timeline:
    VERIFY accounts for dependencies
    VERIFY capacity realistic
    ADJUST if unrealistic
```

### Check 3: Dependencies

```
REBUILD dependency graph

RUN topological sort

IF circular:
  LOG ERROR: "Circular dependencies"
  HALT

IF missing_dependencies:
  ADD explicit dependencies
  UPDATE timeline
```

### Check 4: Ownership

```
FOR critical/high plans:

  VERIFY: owner assigned

  IF unassigned:
    LOG CRITICAL: "Plan [id] no owner"
    ESCALATE

  CHECK workload:
    owner_effort = SUM(effort for owner)
    owner_capacity = [available]

    IF overloaded:
      LOG WARNING: "Owner overloaded"
      RECOMMEND redistribute
```

### Check 5: Deadline

```
VERIFY: compliance_ready_date vs deadline

buffer = deadline - ready_date

IF buffer < 0:
  LOG CRITICAL: "Exceeds deadline by [days]"
  CALCULATE capacity_needed
  ESCALATE

IF buffer < 30:
  LOG WARNING: "Only [days] buffer"

IF buffer >= 30:
  CONFIRM feasible
```

RECORD counter_check_results:
  Missing plans: [N]
  Effort adjusted: [N]
  Dependencies corrected: [N]
  Ownership issues: [N]
  Deadline feasible: [YES/NO/AT_RISK]

> **HALT** — Counter-check complete.

---

## 5.5 Compile Output

**Execute:**

```yaml
remediation_planning_output:
  planning_date: "[date]"
  regulation: [regulation_id]

  scope:
    total_gaps: [N]
    critical_gaps: [N]
    high_gaps: [N]

  plans:
    total_plans: [N]
    critical_plans: [N]
    high_plans: [N]

  effort:
    total_effort_hours: [N]
    by_type:
      DOCUMENTATION: [N]
      IMPLEMENTATION: [N]
      TESTING: [N]
      PROCESS: [N]
      VERIFICATION: [N]

  timeline:
    phase_1_effort: [N]
    phase_2_effort: [N]
    compliance_ready_date: [date]
    deadline_buffer_days: [N]
    timeline_status: [status]

  ownership:
    assigned_plans: [N]
    unassigned_plans: [N]
    assignment_rate: [%]

  counter_check:
    missing_plans: [N]
    effort_adjusted: [N]
    deadline_feasible: [status]
```

UPDATE process state:
  remediation_planned: true
  total_plans: [N]
  total_effort_hours: [N]
  compliance_ready_date: [date]
  timeline_feasible: [status]

> **HALT** — Output compiled.

---

## GATE_5: Planning → Reporting

**ENFORCEMENT:** ALL checklist items DONE.

### Checklist

```
[ ] G5.1: Gap analysis and evidence loaded
[ ] G5.2: Severity rules loaded
[ ] G5.3: Plans created for ALL critical/high
[ ] G5.4: All actions have effort estimates
[ ] G5.5: Timeline created with phases
[ ] G5.6: Dependencies resolved (no cycles)
[ ] G5.7: Ownership assigned to critical/high
[ ] G5.8: Counter-check executed (5 checks)
[ ] G5.9: Output compiled
[ ] G5.10: Process state updated
```

### Gate Passage

```
EVALUATE:
  all_planned = (plans_created >= critical_gaps + high_gaps)
  timeline_created = TRUE
  counter_check_passed = TRUE
  ownership_acceptable = (assignment_rate >= 1.0 FOR critical/high)
  no_cycles = TRUE

IF all TRUE:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - [P] plans, [E] hours, ready: [date]"
  PROCEED to step-06a-compile.md

ELSE:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED"
  OUTPUT: "Plans: [N]/[required]"
  OUTPUT: "Assignment: [%]%"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading data:
  HALT
  OUTPUT: "VIOLATION: Section 5.0 mandatory"
  RETURN to 5.0

IF agent plans subset only:
  HALT
  OUTPUT: "VIOLATION: Must plan ALL critical/high"
  RETURN to 5.1

IF agent skips timeline:
  HALT
  OUTPUT: "VIOLATION: Section 5.2 mandatory"
  RETURN to 5.2

IF agent skips ownership:
  HALT
  OUTPUT: "VIOLATION: Section 5.3 mandatory"
  RETURN to 5.3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5.4 mandatory"
  RETURN to 5.4

IF critical plans unassigned:
  HALT
  OUTPUT: "VIOLATION: Critical plans need owners"
  RETURN to 5.3
```

---

**END OF STEP 5**

**Next:** IF GATE_5 = OPEN → Load `steps/step-06a-compile.md`
