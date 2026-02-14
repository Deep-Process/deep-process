# STEP 5: PLAN

## ENFORCED SEQUENCE

```
1. LOAD_EVIDENCE
2. EXECUTE_METHOD_329
3. GENERATE_REMEDIATION_PLANS
4. CREATE_TIMELINE
5. ASSIGN_OWNERSHIP
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. LOAD_EVIDENCE

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

LOAD: Gap analysis from step-03
LOAD: Evidence coverage from step-04
FILTER: WHERE status = GAP OR PARTIAL
STORE: remediation_scope
VERIFY: gaps_count >= 0
```

## 2. EXECUTE_METHOD_329

```
IF Method 329 (Risk Heat Map Generator) available:
  EXECUTE: method_329.initialize()

  INPUT: All gaps with severity and impact
  EXECUTE: method_329.generate_heat_map(gaps)
  IDENTIFY: High-risk areas requiring immediate attention
  STORE: risk_visualization

  OUTPUT:
```yaml
risk_heat_map:
  method: "Method 329 - Risk Heat Map Generator"
  gaps_plotted: N
  high_risk_areas: H
  remediation_focus: "[description]"
```

ELSE:
  EXECUTE: manual risk assessment and prioritization (section 3)
```

## 3. GENERATE_REMEDIATION_PLANS

```
FOR each gap in remediation_scope:
  CREATE remediation plan:

    ANALYZE gap:
      - What is missing?
      - Why is it missing?
      - What needs to be done?
      - What are dependencies?

    DEFINE actions:
```yaml
remediation_plan:
  plan_id: PLAN-001
  gap_id: GAP-001
  requirement_id: REQ-001
  severity: CRITICAL | HIGH | MEDIUM | LOW

  actions:
    - action_id: ACT-001
      description: "[specific action to take]"
      type: DOCUMENTATION | IMPLEMENTATION | TESTING | PROCESS
      effort_hours: H
      dependencies: [ACT-000]
      required_skills: ["[skill]"]

    - action_id: ACT-002
      description: "[next action]"
      type: DOCUMENTATION | IMPLEMENTATION | TESTING | PROCESS
      effort_hours: H
      dependencies: [ACT-001]
      required_skills: ["[skill]"]

  total_effort_hours: "[sum of action hours]"
  estimated_duration_days: D
  resources_required:
    - "[resource type]"
  acceptance_criteria:
    - "[criterion 1]"
    - "[criterion 2]"
```

REQUIREMENT: Create plan for ALL gaps WHERE severity = CRITICAL OR HIGH
VIOLATION: Planning only for "some" critical gaps is VIOLATION
```

## 4. CREATE_TIMELINE

```
LOAD: All remediation_plans
SORT: BY severity DESC, deadline ASC

CREATE implementation timeline:

  Phase 1 (IMMEDIATE - Days 1-30):
    INCLUDE: All CRITICAL gaps
    COMPUTE: total_effort = SUM(effort WHERE severity = CRITICAL)
    VERIFY: total_effort achievable in 30 days
    IF not_achievable:
      SPLIT: Into parallel streams
      ADD: Resources

  Phase 2 (URGENT - Days 31-90):
    INCLUDE: All HIGH gaps
    COMPUTE: total_effort = SUM(effort WHERE severity = HIGH)
    SCHEDULE: After critical gaps resolved

  Phase 3 (SCHEDULED - Days 91-180):
    INCLUDE: All MEDIUM gaps
    SCHEDULE: After high gaps resolved

  Phase 4 (BACKLOG - Days 181+):
    INCLUDE: All LOW gaps
    SCHEDULE: As capacity allows

RECORD timeline:
```yaml
remediation_timeline:
  phase_1_immediate:
    duration_days: 30
    gaps_addressed: [GAP-001, GAP-003]
    total_effort_hours: E1
    parallel_streams: N
    completion_date: "[date]"

  phase_2_urgent:
    duration_days: 60
    gaps_addressed: [GAP-002, GAP-005]
    total_effort_hours: E2
    dependencies: [phase_1]
    completion_date: "[date]"

  phase_3_scheduled:
    duration_days: 90
    gaps_addressed: [GAP-004, GAP-006]
    total_effort_hours: E3
    dependencies: [phase_2]
    completion_date: "[date]"

  compliance_ready_date: "[date when all critical/high gaps resolved]"
  full_compliance_date: "[date when all gaps resolved]"
```

VERIFY timeline realism:
  IF compliance_ready_date > regulatory_deadline:
    ESCALATE: Timeline infeasible
    RECOMMEND: Increase resources or reduce scope
```

## 5. ASSIGN_OWNERSHIP

```
FOR each remediation_plan:
  ASSIGN owners:

    IDENTIFY responsible party:
      IF gap_type = DOCUMENTATION:
        owner_type = TECHNICAL_WRITER
      IF gap_type = IMPLEMENTATION:
        owner_type = ENGINEER
      IF gap_type = TESTING:
        owner_type = QA_ENGINEER
      IF gap_type = PROCESS:
        owner_type = COMPLIANCE_OFFICER

    ASSIGN specific owner:
      BASED ON: available resources, skills, workload
      VERIFY: Owner has required skills
      VERIFY: Owner has capacity

  RECORD ownership:
```yaml
ownership:
  plan_id: PLAN-001
  primary_owner: "[name/email]"
  secondary_owner: "[name/email]"
  approver: "[name/email]"
  stakeholders: ["[stakeholder 1]", "[stakeholder 2]"]
  owner_confirmed: YES | NO
```

REQUIREMENT: Assign owners to ALL CRITICAL and HIGH gap plans
VIOLATION: Leaving critical gaps unassigned is VIOLATION
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify remediation plans feasibility
EXECUTE:
  1. COMPLETENESS CHECK:
     FOR gaps WHERE severity = CRITICAL OR HIGH:
       VERIFY: Remediation plan exists
       IF no_plan:
         CREATE: Plan immediately
       IF has_plan:
         CONFIRM: Plan complete

  2. REALISM CHECK:
     FOR each plan:
       VERIFY: Effort estimates realistic
       VERIFY: Timeline achievable
       VERIFY: Resources available
       IF unrealistic:
         ADJUST: Estimates or resources
       IF realistic:
         CONFIRM: Plan feasible

  3. DEPENDENCY CHECK:
     FOR each plan:
       VERIFY: Dependencies valid
       VERIFY: No circular dependencies
       IF circular:
         RESOLVE: Dependency cycle
       IF valid:
         CONFIRM: Dependencies correct

  4. OWNERSHIP CHECK:
     FOR critical_plans:
       VERIFY: Owner assigned
       VERIFY: Owner has capacity
       VERIFY: Owner confirmed
       IF issues:
         REASSIGN: Owner
       IF confirmed:
         CONFIRM: Ownership

  5. DEADLINE CHECK:
     VERIFY: compliance_ready_date <= regulatory_deadline
     IF missed:
       ESCALATE: Urgent action needed
       RECOMMEND: Fast-track approach
     IF achievable:
       CONFIRM: Timeline acceptable

  6. REPORT:
     "Counter-check executed"
     "Missing plans created: M"
     "Unrealistic plans adjusted: U"
     "Dependencies resolved: D"
     "Ownership confirmed: O"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Evidence loaded from GATE_4?
□ Method 329 executed OR manual assessment complete?
□ Remediation plans created for ALL critical/high gaps?
□ Timeline created with phases?
□ Ownership assigned to ALL critical/high plans?
□ Counter-check executed?
□ Compliance ready date <= regulatory deadline?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## 8. GATE_5

```
EVALUATE:
  remediation_plans >= critical_gaps_count + high_gaps_count
  timeline_realistic = TRUE
  counter_check_executed = TRUE

COUNT:
  critical_gaps = FROM step-03 WHERE severity = CRITICAL
  high_gaps = FROM step-03 WHERE severity = HIGH
  plans_created = COUNT(plan_id)
  plans_with_owners = WHERE primary_owner != NULL

IF all TRUE AND plans_with_owners >= critical_gaps:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - plans = P, critical_plans = C, timeline_feasible = TRUE"
  PROCEED to workflow.md for next step

IF any FALSE OR plans_with_owners < critical_gaps:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  OUTPUT: "Plans missing: [critical_gaps - plans_with_owners]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading evidence:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_EVIDENCE required"
  RETURN to section 1

IF agent creates plans for subset of critical gaps:
  HALT
  OUTPUT: "VIOLATION: Plans required for ALL critical/high gaps"
  RETURN to section 3

IF agent skips timeline creation:
  HALT
  OUTPUT: "VIOLATION: Section 4 CREATE_TIMELINE required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
