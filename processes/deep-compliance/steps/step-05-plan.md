---
step: 5
name: "Remediation Planning"
time_estimate: "90-180 minutes"
goal: "Create actionable remediation plans, timeline and assign ownership for all gaps"
requires_completion: [4]
next_steps:
  DEFAULT: "steps/step-06-report.md"
gate: "GATE_5"
data_dependencies:
  - "gap analysis from step-03"
  - "evidence coverage from step-04"
  - "severity-classification.yaml"
outputs:
  - remediation_plans
  - implementation_timeline
  - ownership_assignments
---

# STEP 5: REMEDIATION PLANNING

## ENFORCEMENT RULES

```
1. Create plans for ALL CRITICAL and HIGH severity gaps (no exceptions).
2. Plans MUST be actionable with specific steps (no generic "fix it").
3. Effort estimates required for ALL actions (no TBD estimates).
4. Timeline MUST be realistic and account for dependencies.
5. Ownership MANDATORY for all critical/high plans (no unassigned).
6. Counter-check MANDATORY - adversarial plan review.
7. NO proceeding to GATE_5 until all critical/high gaps have plans.
```

---

## 5.0 Load Required Data

**PRECONDITION:** GATE_4 = OPEN

IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

**Execute these steps in this order:**

### Step 1: Load gap analysis from GATE_3

```
FROM step-03 output:
  [ ] gap_analysis loaded
  [ ] total_gaps: [count]
  [ ] critical_gaps: [count where severity = CRITICAL]
  [ ] high_gaps: [count where severity = HIGH]
  [ ] medium_gaps: [count where severity = MEDIUM]
  [ ] low_gaps: [count where severity = LOW]
```

### Step 2: Load evidence coverage from GATE_4

```
FROM step-04 output:
  [ ] evidence_coverage loaded
  [ ] requirements_with_evidence: [count]
  [ ] requirements_insufficient: [count]
  [ ] evidence_gaps: [list]
```

### Step 3: Load severity classification rules

```
READ: data/severity-classification.yaml

LOAD:
  [ ] remediation_effort base estimates
  [ ] complexity_multipliers
  [ ] prioritization_tiers
```

### Step 4: Determine planning scope

```
FILTER gaps for planning:
  planning_scope = WHERE severity = CRITICAL OR severity = HIGH

COUNT scope:
  gaps_requiring_plans = COUNT(planning_scope)

ALSO INCLUDE:
  evidence_gaps_requiring_action = WHERE evidence_sufficient = NO

RECORD:
  [ ] Planning scope: [count] gaps
  [ ] Critical gaps: [count]
  [ ] High gaps: [count]
  [ ] Evidence gaps needing remediation: [count]
```

> **HALT** — Confirm all data loaded before proceeding.

---

## 5.1 Generate Remediation Plans

**Execute for EACH gap in planning_scope:**

### Step 1: Analyze gap

```
FOR gap G:

  EXTRACT gap details:
    gap_id = G.id
    requirement_id = G.requirement_id
    requirement_text = G.requirement_text
    article = G.article
    system_id = G.system_id
    severity = G.severity
    impact_score = G.impact_score
    urgency_score = G.urgency_score
    detectability_score = G.detectability_score

  UNDERSTAND the gap:
    QUESTION 1: What is missing?
      missing_element = [specific capability, documentation, process, control]

    QUESTION 2: Why is it missing?
      root_cause = [never implemented | deprioritized | overlooked | not designed]

    QUESTION 3: What needs to be done?
      required_action = [implement feature | create documentation | establish process | deploy control]

    QUESTION 4: What are the dependencies?
      dependencies = [other gaps | external systems | third-party tools | organizational changes]

  RECORD analysis:
```yaml
gap_analysis_detail:
  gap_id: [G.id]
  missing_element: "[specific description]"
  root_cause: "[why missing]"
  required_action: "[what must be done]"
  dependencies: ["[dep 1]", "[dep 2]"]
```
```

### Step 2: Define remediation actions

```
FOR gap G:

  DECOMPOSE remediation into discrete actions:

  ACTION 1: Documentation/Design
    IF requirement needs specification:
      CREATE action:
        action_id: ACT-[gap_id]-001
        action_type: DOCUMENTATION
        description: "Create [specific document] describing [requirement compliance]"
        deliverable: "[document name and location]"

  ACTION 2: Implementation
    IF requirement needs code/system changes:
      CREATE action:
        action_id: ACT-[gap_id]-002
        action_type: IMPLEMENTATION
        description: "Implement [specific feature/control] in [system/component]"
        deliverable: "[code/configuration changes]"
        technical_details:
          - Component: "[which component]"
          - Approach: "[how to implement]"
          - Integration: "[how it integrates]"

  ACTION 3: Testing
    IF implementation requires validation:
      CREATE action:
        action_id: ACT-[gap_id]-003
        action_type: TESTING
        description: "Create and execute tests validating [requirement]"
        deliverable: "[test files and results]"
        test_types:
          - Unit tests
          - Integration tests
          - Compliance tests

  ACTION 4: Process/Operational
    IF requirement needs process establishment:
      CREATE action:
        action_id: ACT-[gap_id]-004
        action_type: PROCESS
        description: "Establish [process/workflow] for [requirement]"
        deliverable: "[process documentation and evidence of execution]"

  ACTION 5: Verification
    ALWAYS include verification:
      CREATE action:
        action_id: ACT-[gap_id]-005
        action_type: VERIFICATION
        description: "Verify and document compliance with [requirement]"
        deliverable: "[evidence artifacts showing compliance]"

  FOR each action:
    DEFINE dependencies:
      IF action depends on prior action:
        dependencies: [list prior action IDs]
      ELSE:
        dependencies: []

    IDENTIFY required skills:
      required_skills = [based on action_type and technical_details]

      Examples:
        DOCUMENTATION → ["technical writing", "compliance knowledge"]
        IMPLEMENTATION → ["backend development", "security engineering"]
        TESTING → ["QA engineering", "test automation"]
        PROCESS → ["process design", "organizational change"]

    RECORD action details
```

### Step 3: Estimate effort

```
FOR each action A:

  DETERMINE base effort:

    IF action_type = DOCUMENTATION:
      IF deliverable is single document:
        base_effort = 4 hours
      IF deliverable is comprehensive documentation set:
        base_effort = 16 hours

    IF action_type = IMPLEMENTATION:
      ASSESS implementation scope:
        IF configuration_change_only:
          base_effort = 8 hours
        IF single_component_change:
          base_effort = 16 hours
        IF multiple_components:
          base_effort = 40 hours
        IF architectural_change:
          base_effort = 80 hours
        IF fundamental_redesign:
          base_effort = 160 hours

    IF action_type = TESTING:
      ASSESS test scope:
        IF simple_unit_tests:
          base_effort = 8 hours
        IF comprehensive_test_suite:
          base_effort = 24 hours

    IF action_type = PROCESS:
      ASSESS process complexity:
        IF simple_workflow:
          base_effort = 16 hours
        IF complex_governance_process:
          base_effort = 40 hours

    IF action_type = VERIFICATION:
      base_effort = 4 hours

  DETERMINE complexity multiplier:

    ASSESS complexity:
      complexity_factors = 0

      IF has_external_dependencies:
        complexity_factors += 1

      IF requires_coordination_across_teams:
        complexity_factors += 1

      IF requires_new_technology_or_tools:
        complexity_factors += 1

      IF affects_critical_path:
        complexity_factors += 1

    CLASSIFY complexity:
      IF complexity_factors = 0:
        complexity = SIMPLE
        multiplier = 1.0

      IF complexity_factors = 1:
        complexity = MODERATE
        multiplier = 1.5

      IF complexity_factors = 2:
        complexity = COMPLEX
        multiplier = 2.0

      IF complexity_factors >= 3:
        complexity = VERY_COMPLEX
        multiplier = 3.0

  COMPUTE final effort:
    effort_hours = base_effort * multiplier
    ROUND to nearest 4 hours (half-day increments)

  RECORD effort estimate:
    Action A.id:
      base_effort: [hours]
      complexity: [SIMPLE|MODERATE|COMPLEX|VERY_COMPLEX]
      multiplier: [1.0-3.0]
      final_effort_hours: [hours]
```

### Step 4: Define acceptance criteria

```
FOR gap G:

  CREATE specific, measurable acceptance criteria:

  CRITERIA based on requirement:

    CRITERION 1: Implementation exists
      - "[Specific feature/control] is implemented and deployed"
      - "[System capability] is available and functioning"

    CRITERION 2: Documentation complete
      - "[Required documentation] created and reviewed"
      - "[Technical specs] approved by compliance officer"

    CRITERION 3: Testing validates compliance
      - "All tests pass demonstrating [requirement] met"
      - "Test coverage >= [percentage]% for [component]"

    CRITERION 4: Evidence collected
      - "[Evidence artifacts] collected and verified"
      - "Evidence quality rated HIGH or MEDIUM"

    CRITERION 5: Approval obtained
      - "Compliance officer approves remediation"
      - "Technical lead confirms implementation"

  ENSURE criteria are:
    - Specific (not vague)
    - Measurable (can verify objectively)
    - Achievable (realistic given constraints)
    - Relevant (directly addresses requirement)

  RECORD acceptance criteria
```

### Step 5: Compile remediation plan

```
FOR gap G:
  CREATE complete plan:
```yaml
remediation_plan:
  plan_id: PLAN-[NNN]
  gap_id: [G.id]
  requirement_id: [G.requirement_id]
  article: [G.article]
  system_id: [G.system_id]
  severity: [G.severity]

  gap_summary:
    missing_element: "[what is missing]"
    root_cause: "[why missing]"
    required_action: "[what needs to be done]"

  actions:
    - action_id: ACT-[gap_id]-001
      action_type: DOCUMENTATION | IMPLEMENTATION | TESTING | PROCESS | VERIFICATION
      description: "[specific action description]"
      deliverable: "[what will be produced]"
      effort_hours: [N]
      complexity: SIMPLE | MODERATE | COMPLEX | VERY_COMPLEX
      dependencies: [list of action IDs]
      required_skills: ["[skill 1]", "[skill 2]"]

    - action_id: ACT-[gap_id]-002
      # ... (additional actions)

  total_effort_hours: [sum of all action efforts]
  estimated_duration_days: [total_effort_hours / available_hours_per_day]

  dependencies:
    gap_dependencies: [other gaps that must be resolved first]
    external_dependencies: [third-party or organizational dependencies]

  acceptance_criteria:
    - "[criterion 1]"
    - "[criterion 2]"
    - "[criterion 3]"

  risk_factors:
    - "[risk 1 if complex]"
    - "[risk 2 if dependencies]"
```

COMPUTE plan statistics:
  Total actions: [count]
  Total effort: [hours]
  Estimated duration: [days]
```

**ENFORCEMENT:** Create complete plans for ALL critical and high gaps.

> **HALT** — Confirm plans created for all critical/high gaps.

---

## 5.2 Create Implementation Timeline

**Execute:**

### Step 1: Load all remediation plans

```
LOAD all plans:
  all_plans = [list of all remediation_plan objects]

COUNT plans:
  critical_plans = WHERE severity = CRITICAL
  high_plans = WHERE severity = HIGH
  medium_plans = WHERE severity = MEDIUM (if created)
  low_plans = WHERE severity = LOW (if created)
```

### Step 2: Determine prioritization

```
FOR each plan P:

  ASSIGN priority tier (from severity-classification.yaml):

    IF severity = CRITICAL:
      tier = TIER_1_IMMEDIATE
      max_start_delay_days = 7

    IF severity = HIGH:
      tier = TIER_2_URGENT
      max_start_delay_days = 30

    IF severity = MEDIUM:
      tier = TIER_3_SCHEDULED
      max_start_delay_days = 90

    IF severity = LOW:
      tier = TIER_4_BACKLOG
      max_start_delay_days = 180

  WITHIN tier, prioritize by:
    1. Detectability (higher detectability = higher priority)
    2. Dependencies (plans with no dependencies first)
    3. Effort (shorter effort first, for quick wins)

  RECORD prioritization:
    Plan P.id:
      tier: [tier]
      within_tier_priority: [1-N]
      max_start_delay: [days]
```

### Step 3: Resolve dependencies

```
BUILD dependency graph:

  FOR each plan P:
    FOR each dependency D in P.gap_dependencies:
      RECORD: P depends on completion of plan for gap D

  DETECT circular dependencies:
    RUN topological sort on dependency graph

    IF circular_dependency_detected:
      LOG ERROR: "Circular dependency detected: [list cycles]"
      REQUIRE: Manual resolution of circular dependency
      HALT

    IF no_circular_dependencies:
      dependency_order = topological_sort_result

  DETERMINE execution order:
    plans_execution_order = ORDER BY:
      1. dependency_order (dependencies first)
      2. tier (TIER_1 before TIER_2, etc.)
      3. within_tier_priority
```

### Step 4: Schedule plans into phases

```
INITIALIZE schedule:
  current_date = [today]
  available_capacity_hours_per_week = [estimated team capacity]

PHASE 1 - IMMEDIATE (Weeks 1-4):

  SELECT plans:
    phase_1_plans = WHERE tier = TIER_1_IMMEDIATE

  SCHEDULE plans:
    FOR plan in phase_1_plans (in execution order):
      IF plan has dependencies:
        WAIT until dependencies complete

      start_date = MAX(current_date, latest_dependency_completion)
      duration_days = plan.total_effort_hours / (available_capacity_hours_per_week / 5)
      completion_date = start_date + duration_days

      RECORD schedule:
        plan.start_date = start_date
        plan.completion_date = completion_date

      UPDATE current_date = completion_date (for sequential plans)

  COMPUTE phase metrics:
    phase_1_duration = MAX(completion_dates) - MIN(start_dates)
    phase_1_total_effort = SUM(plan.total_effort_hours)

  VERIFY feasibility:
    IF phase_1_duration > 30 days:
      LOG WARNING: "Critical gaps cannot be completed within 30 days"
      RECOMMEND: "Increase capacity or parallelize work streams"

PHASE 2 - URGENT (Weeks 5-12):

  SELECT plans:
    phase_2_plans = WHERE tier = TIER_2_URGENT

  SCHEDULE plans:
    start_after = phase_1_completion_date

    FOR plan in phase_2_plans (in execution order):
      # Same scheduling logic as Phase 1
      start_date = MAX(start_after, latest_dependency_completion)
      duration_days = plan.total_effort_hours / (available_capacity_hours_per_week / 5)
      completion_date = start_date + duration_days

      RECORD schedule

  COMPUTE phase metrics:
    phase_2_duration = [duration]
    phase_2_total_effort = [effort]

PHASE 3 - SCHEDULED (Weeks 13-26):

  SELECT plans:
    phase_3_plans = WHERE tier = TIER_3_SCHEDULED

  SCHEDULE plans:
    start_after = phase_2_completion_date
    # Same scheduling logic

  COMPUTE phase metrics

PHASE 4 - BACKLOG (Week 27+):

  SELECT plans:
    phase_4_plans = WHERE tier = TIER_4_BACKLOG

  SCHEDULE as capacity allows:
    # Flexible scheduling based on available capacity

  COMPUTE phase metrics
```

### Step 5: Create timeline output

```
COMPILE implementation timeline:
```yaml
implementation_timeline:
  timeline_created: "[current date]"
  total_plans: [count]
  total_effort_hours: [sum across all plans]

  phases:
    phase_1_immediate:
      tier: TIER_1_IMMEDIATE
      duration_weeks: 4
      start_date: "[date]"
      completion_date: "[date]"
      plans: [list of plan IDs]
      total_effort_hours: [sum]
      critical_milestones:
        - "[milestone 1]"
        - "[milestone 2]"

    phase_2_urgent:
      tier: TIER_2_URGENT
      duration_weeks: 8
      start_date: "[date]"
      completion_date: "[date]"
      plans: [list of plan IDs]
      total_effort_hours: [sum]
      dependencies: ["phase_1"]

    phase_3_scheduled:
      tier: TIER_3_SCHEDULED
      duration_weeks: 13
      start_date: "[date]"
      completion_date: "[date]"
      plans: [list of plan IDs]
      total_effort_hours: [sum]
      dependencies: ["phase_2"]

    phase_4_backlog:
      tier: TIER_4_BACKLOG
      duration_weeks: flexible
      start_date: "[date]"
      completion_date: "[date]"
      plans: [list of plan IDs]
      total_effort_hours: [sum]

  key_dates:
    compliance_ready_date: "[when all TIER_1 and TIER_2 complete]"
    full_compliance_date: "[when all tiers complete]"
    regulatory_deadline: "[from regulation]"

  capacity_analysis:
    total_effort_required: [hours]
    available_capacity_weekly: [hours]
    weeks_to_completion: [total_effort / weekly_capacity]
    capacity_constraint: YES | NO

  risks:
    - "[risk 1 if timeline tight]"
    - "[risk 2 if capacity constrained]"
```

VERIFY timeline against deadline:
  IF compliance_ready_date > regulatory_deadline:
    LOG CRITICAL: "Timeline exceeds regulatory deadline"
    CALCULATE shortfall: regulatory_deadline - compliance_ready_date
    RECOMMEND: "Need [X] additional hours/week capacity to meet deadline"
```

> **HALT** — Confirm timeline created and validated.

---

## 5.3 Assign Ownership

**Execute for EACH remediation plan:**

### Step 1: Determine owner type

```
FOR plan P:

  DETERMINE primary owner type based on action types:

    action_types = [list of action_type from P.actions]

    IF "IMPLEMENTATION" in action_types:
      primary_owner_type = ENGINEER
      required_skills_primary = ["software development", "system implementation"]

    IF "DOCUMENTATION" is dominant action_type:
      primary_owner_type = TECHNICAL_WRITER
      required_skills_primary = ["technical writing", "compliance documentation"]

    IF "TESTING" is dominant action_type:
      primary_owner_type = QA_ENGINEER
      required_skills_primary = ["test automation", "quality assurance"]

    IF "PROCESS" is dominant action_type:
      primary_owner_type = COMPLIANCE_OFFICER
      required_skills_primary = ["process design", "compliance management"]

  DETERMINE secondary owner:
    IF plan involves multiple action types:
      secondary_owner_type = [second most common action type owner]
    ELSE:
      secondary_owner_type = null

  DETERMINE approver:
    IF severity = CRITICAL:
      approver_type = COMPLIANCE_LEAD
    IF severity = HIGH:
      approver_type = COMPLIANCE_OFFICER
    ELSE:
      approver_type = TECHNICAL_LEAD
```

### Step 2: Assign specific owners

```
FOR plan P:

  ASSIGN primary owner:
    # In real execution, this would query resource availability
    # For process: document the assignment logic

    CRITERIA for owner selection:
      1. Has required skills from P.required_skills
      2. Has capacity for P.total_effort_hours
      3. Is not overloaded with other critical plans
      4. Has domain expertise in P.system_id

    SELECT owner:
      primary_owner = [name/email of selected person]

    IF no_suitable_owner_available:
      primary_owner = "UNASSIGNED"
      escalation_required = TRUE
      LOG WARNING: "No owner available for plan P.id"

  ASSIGN secondary owner (if needed):
    IF secondary_owner_type not null:
      secondary_owner = [name/email]
    ELSE:
      secondary_owner = null

  ASSIGN approver:
    approver = [name/email based on approver_type]

  IDENTIFY stakeholders:
    stakeholders = [
      - System owner for P.system_id
      - Compliance team
      - Security team (if security-related)
      - Product owner (if affects product)
    ]

  VERIFY owner confirmation:
    # In real execution: request confirmation from owner
    # For process: document that confirmation is required

    owner_confirmed = PENDING
    # Set to YES only after owner explicitly confirms
```

### Step 3: Record ownership

```
FOR plan P:
  UPDATE plan with ownership:
```yaml
ownership:
  plan_id: [P.id]
  primary_owner: "[name/email]"
  primary_owner_type: ENGINEER | TECHNICAL_WRITER | QA_ENGINEER | COMPLIANCE_OFFICER
  secondary_owner: "[name/email or null]"
  approver: "[name/email]"
  stakeholders:
    - "[stakeholder 1]"
    - "[stakeholder 2]"

  assignment_status:
    primary_owner_confirmed: YES | NO | PENDING
    secondary_owner_confirmed: YES | NO | PENDING
    capacity_verified: YES | NO
    escalation_required: YES | NO

  workload:
    estimated_effort_hours: [P.total_effort_hours]
    scheduled_start: [P.start_date]
    scheduled_completion: [P.completion_date]
```

COMPUTE ownership statistics:
  total_plans = COUNT(plans)
  assigned_plans = WHERE primary_owner != "UNASSIGNED"
  confirmed_plans = WHERE primary_owner_confirmed = YES
  unassigned_plans = WHERE primary_owner = "UNASSIGNED"

  assignment_rate = assigned_plans / total_plans
```

**ENFORCEMENT:** ALL critical and high severity plans MUST have assigned owners.

> **HALT** — Confirm ownership assigned for all critical/high plans.

---

## 5.4 Counter-Check

**REQUIREMENT:** Adversarial review of remediation plans.

**Execute these checks:**

### Check 1: Completeness - Missing Plans

```
FOR each gap WHERE severity = CRITICAL OR HIGH:

  VERIFY: Remediation plan exists for this gap

  IF no_plan_exists:
    LOG ERROR: "Missing remediation plan for gap G.id (severity: G.severity)"
    CREATE: Plan immediately using section 5.1
    UPDATE: Timeline and ownership

  IF plan_exists:
    CONFIRM: Plan is complete with all required fields
```

### Check 2: Realism - Effort and Timeline

```
FOR each remediation_plan:

  CHALLENGE effort estimates:
    FOR each action in plan.actions:
      QUESTION: "Is [effort_hours] realistic for [action.description]?"

      RE-EVALUATE:
        - Compare against similar past projects
        - Check if complexity properly accounted for
        - Verify dependencies considered

      IF estimate_too_optimistic:
        ADJUST: Increase effort estimate
        UPDATE: Total plan effort
        UPDATE: Timeline

      IF estimate_too_pessimistic:
        ADJUST: Decrease effort estimate
        UPDATE: Accordingly

  CHALLENGE timeline:
    VERIFY: completion_date accounts for:
      - Dependencies
      - Available capacity
      - Parallel vs sequential work

    IF timeline_unrealistic:
      ADJUST: Timeline with justification
      LOG: What changed and why

  CHALLENGE acceptance criteria:
    VERIFY: Criteria are specific and measurable

    IF criteria_vague:
      REFINE: Make criteria more specific
      ADD: Measurable targets
```

### Check 3: Dependencies - Circular and Missing

```
REBUILD dependency graph:

  FOR each plan:
    FOR each dependency:
      VERIFY: Dependency plan exists
      VERIFY: Dependency is necessary

  RUN topological sort:

  IF circular_dependencies:
    LOG ERROR: "Circular dependencies detected: [list]"
    REQUIRE: Resolution of circular dependencies
    HALT until resolved

  IF missing_dependencies:
    LOG WARNING: "Plan P depends on non-existent plan D"
    FIX: Either remove dependency or create missing plan

  CHECK for missing dependencies:
    FOR each plan P:
      ANALYZE: Should P depend on other plans?

      IF implicit_dependency_exists:
        ADD: Explicit dependency
        UPDATE: Timeline
```

### Check 4: Ownership - Unassigned and Overloaded

```
FOR critical_and_high_plans:

  VERIFY: primary_owner assigned

  IF primary_owner = "UNASSIGNED":
    LOG CRITICAL: "Critical plan P.id has no owner"
    ESCALATE: Immediate owner assignment required
    HALT if critical plan unassigned

  IF primary_owner assigned:
    CHECK workload:
      owner_total_effort = SUM(effort for all plans assigned to owner)
      owner_available_capacity = [from resource planning]

      IF owner_total_effort > owner_available_capacity:
        LOG WARNING: "Owner [name] overloaded: [effort] hours assigned, [capacity] hours available"
        RECOMMEND: Redistribute plans or increase capacity

VERIFY confirmation:
  FOR critical_plans WHERE primary_owner_confirmed != YES:
    LOG WARNING: "Critical plan P.id owner not confirmed"
    REQUIRE: Explicit owner confirmation
```

### Check 5: Deadline Feasibility

```
VERIFY timeline vs regulatory deadline:

  compliance_ready_date = [from timeline]
  regulatory_deadline = [from regulation]

  days_buffer = regulatory_deadline - compliance_ready_date

  IF days_buffer < 0:
    LOG CRITICAL: "Compliance ready date exceeds regulatory deadline by [abs(days_buffer)] days"
    CALCULATE: Additional capacity needed
    RECOMMEND: "Increase capacity by [X] hours/week OR reduce scope"
    ESCALATE: Urgent intervention required

  IF days_buffer < 30:
    LOG WARNING: "Compliance ready date has only [days_buffer] days buffer before deadline"
    RECOMMEND: "Consider accelerating critical paths"

  IF days_buffer >= 30:
    CONFIRM: Timeline feasible with acceptable buffer
```

### Report Counter-Check Results

```
Counter-Check Execution Report:
  Missing plans created: [count]
  Effort estimates adjusted: [count]
  Timeline adjustments: [count]
  Dependencies corrected: [count]
  Ownership issues resolved: [count]

  Final assessment:
    All critical/high plans complete: [YES/NO]
    Timeline realistic: [YES/NO]
    Ownership assigned: [percentage]%
    Deadline feasible: [YES/NO/AT_RISK]
    Buffer days: [count]
```

> **HALT** — Confirm counter-check complete.

---

## 5.5 Compile Remediation Planning Output

**Execute:**

### Step 1: Aggregate all planning data

```yaml
remediation_planning_output:
  planning_date: "[current date]"
  regulation: [regulation_id]

  scope:
    total_gaps: [count]
    gaps_requiring_plans: [count]
    critical_gaps: [count]
    high_gaps: [count]

  plans_created:
    total_plans: [count]
    critical_plans: [count]
    high_plans: [count]
    medium_plans: [count]
    low_plans: [count]

  effort_summary:
    total_effort_hours: [sum across all plans]
    critical_effort_hours: [sum for critical]
    high_effort_hours: [sum for high]

    by_action_type:
      DOCUMENTATION: [hours]
      IMPLEMENTATION: [hours]
      TESTING: [hours]
      PROCESS: [hours]
      VERIFICATION: [hours]

  timeline:
    phases: [from implementation_timeline]
    compliance_ready_date: "[date]"
    full_compliance_date: "[date]"
    regulatory_deadline: "[date]"
    deadline_buffer_days: [days]
    timeline_feasible: YES | NO | AT_RISK

  ownership:
    total_plans: [count]
    assigned_plans: [count]
    confirmed_plans: [count]
    unassigned_plans: [count]
    assignment_rate: [percentage]%

  risks:
    - "[risk 1]"
    - "[risk 2]"

  recommendations:
    - "[recommendation 1]"
    - "[recommendation 2]"

  plans:
    - [full list of all remediation_plan objects]
```

### Step 2: Update frontmatter

```yaml
# Add to process state:
remediation_planned: true
total_plans: [count]
critical_plans: [count]
total_effort_hours: [hours]
compliance_ready_date: "[date]"
timeline_feasible: [YES/NO/AT_RISK]
```

---

## GATE_5: Remediation Planning → Reporting

**ENFORCEMENT:** ALL checklist items MUST be DONE before proceeding.

### Gate Checklist

```
[ ] G5.1: Gap analysis and evidence coverage loaded from previous gates
[ ] G5.2: Severity classification rules loaded
[ ] G5.3: Planning scope determined (all critical/high gaps)
[ ] G5.4: Remediation plans created for ALL critical and high gaps
[ ] G5.5: All actions have effort estimates
[ ] G5.6: Implementation timeline created with phases
[ ] G5.7: Dependencies resolved (no circular dependencies)
[ ] G5.8: Ownership assigned to ALL critical and high plans
[ ] G5.9: Counter-check executed (all 5 checks)
[ ] G5.10: remediation_planning_output compiled
```

### Ownership Threshold Evaluation

```
COMPUTE ownership metrics:
  critical_plans_count = COUNT WHERE severity = CRITICAL
  high_plans_count = COUNT WHERE severity = HIGH
  critical_high_assigned = COUNT WHERE (severity = CRITICAL OR HIGH) AND primary_owner != "UNASSIGNED"

  assignment_rate_critical_high = critical_high_assigned / (critical_plans_count + high_plans_count)

EVALUATE threshold:
  IF assignment_rate_critical_high >= 1.0:
    ownership_acceptable = TRUE

  IF assignment_rate_critical_high < 1.0:
    ownership_acceptable = FALSE
    unassigned_count = (critical_plans_count + high_plans_count) - critical_high_assigned
    LOG WARNING: "[unassigned_count] critical/high plans remain unassigned"
```

### Gate Passage

```
EVALUATE:
  all_critical_high_plans_created = (plans_created >= critical_gaps + high_gaps)
  timeline_created = TRUE
  counter_check_executed = TRUE
  ownership_acceptable = TRUE
  no_circular_dependencies = TRUE

IF all TRUE:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - [P] plans created, [E] total effort hours, compliance ready: [date]"
  PROCEED to step-06-report.md

ELSE:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED"
  OUTPUT: "Reason: [which condition failed]"
  OUTPUT: "Plans created: [count]/[required]"
  OUTPUT: "Assignment rate: [percentage]%"
  OUTPUT: "Timeline feasible: [YES/NO/AT_RISK]"
  HALT
```

**ENFORCEMENT:** Do NOT proceed to step 6 until GATE_5 = OPEN.

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading gap analysis:
  HALT
  OUTPUT: "VIOLATION: Section 5.0 Load Required Data mandatory"
  RETURN to section 5.0

IF agent creates plans for only subset of critical/high gaps:
  HALT
  OUTPUT: "VIOLATION: Plans required for ALL critical and high severity gaps"
  OUTPUT: "Required: [critical + high count], Created: [plans count]"
  RETURN to section 5.1

IF agent skips timeline creation:
  HALT
  OUTPUT: "VIOLATION: Section 5.2 Create Implementation Timeline is MANDATORY"
  RETURN to section 5.2

IF agent skips ownership assignment:
  HALT
  OUTPUT: "VIOLATION: Section 5.3 Assign Ownership is MANDATORY"
  RETURN to section 5.3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5.4 Counter-Check is MANDATORY"
  RETURN to section 5.4

IF agent proceeds with critical plans unassigned:
  HALT
  OUTPUT: "VIOLATION: ALL critical/high plans must have assigned owners"
  OUTPUT: "Unassigned: [count]"
  RETURN to section 5.3
```

---

**END OF STEP 5**

**Next action:** IF GATE_5 = OPEN → Load `steps/step-06-report.md`
