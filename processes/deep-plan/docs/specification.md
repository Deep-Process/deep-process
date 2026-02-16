# Deep-Plan Process Specification

## PURPOSE

**Problem Solved:** Masz strategię i architekturę (enterprise-architecture-final.md), ale nie masz szczegółowego planu wdrożenia z zadaniami, harmonogramem, alokacją zasobów i kontrolą zmian.

**Solution:** Proces deep-plan tworzy i adaptacyjnie aktualizuje implementation plan, rozkładając architekturę na wykonywalne zadania z zależnościami, szacunkami i checkpoint'ami.

---

## CORE CAPABILITY

Transformuje:
- **Z:** Architecture design (high-level, strategic) + Risk mitigation requirements
- **NA:** Implementation plan (task-level, tactical) z Work Breakdown Structure (WBS)

**Kluczowa cecha:** **Adaptive Re-Planning** - plan aktualizuje się na podstawie rzeczywistego postępu i zmian.

---

## INPUTS

```yaml
primary_inputs:
  - architecture-comprehensive.md:
      source: deep-architect
      size: ~35KB
      content: "Architecture design, technology stack, deployment model"

  - risk-report.md:
      source: deep-risk
      size: ~150KB
      content: "97 risks with priorities, critical mitigations (VR-001, VR-010, VR-008)"

  - tradeoff-analysis.yaml:
      source: deep-architect (Phase 4)
      content: "FinOps analysis, cost breakdown, evolution phases"

optional_inputs:
  - execution-status.yaml:
      source: deep-monitor
      content: "Actual progress, task completion, blockers (for re-planning)"

  - approved-changes.yaml:
      source: deep-change
      content: "Change requests approved by deep-govern (for plan updates)"

  - team-capacity.yaml:
      source: user/external
      content: "Team size, skills, availability (default: 15 people)"

constraints:
  - budget: "$410K-$710K (6 months MVP)"
  - timeline: "6 months to MVP"
  - team_size: "15 people across 4 bounded contexts"
  - quality_gates: "SOC 2, security mitigations mandatory"
```

---

## OUTPUTS

```yaml
primary_outputs:
  - implementation-plan.yaml:
      size: ~100-200KB
      content: "Complete WBS with tasks, dependencies, estimates, assignments"
      format: YAML
      update_frequency: "Weekly (adaptive re-planning)"

  - sprint-backlog.yaml:
      size: ~20-40KB
      content: "2-week sprint tasks, ready for deep-implement"
      format: YAML
      update_frequency: "Every 2 weeks (sprint boundary)"

  - resource-allocation.yaml:
      size: ~10-20KB
      content: "Team assignments to bounded contexts, capacity planning"

  - timeline.md:
      size: ~10-15KB
      content: "Gantt chart (text-based), critical path, milestones"
      format: Markdown + Mermaid diagrams

  - planning-decisions.yaml:
      size: ~5-10KB
      content: "Key planning decisions, assumptions, constraints"

supporting_outputs:
  - task-estimates.yaml: "All tasks with effort estimates (story points, hours)"
  - dependency-graph.yaml: "Task dependencies for sequencing"
  - risk-schedule.yaml: "When each risk mitigation happens"
  - checkpoint-plan.yaml: "Validation checkpoints every 2 weeks"
```

---

## PROCESS WORKFLOW

### Phase 0: CONTEXT (Zrozumienie Architektury)

**Purpose:** Zrozum co ma być zbudowane i w jakim kontekście.

```yaml
steps:
  1. LOAD_ARCHITECTURE:
      READ: architecture-comprehensive.md
      EXTRACT:
        - Components: 23 microservices
        - Bounded contexts: 7 (identify work streams)
        - Technology stack: Node.js, Python, PostgreSQL, Kubernetes
        - Deployment models: SaaS, Hybrid, On-Prem
        - Quality attributes: 99.9% uptime, <2s latency, etc.

  2. LOAD_RISKS:
      READ: risk-report.md
      EXTRACT:
        - Critical risks: VR-001, VR-010, VR-008 (must mitigate by Month 3)
        - Medium risks: BN-001, BN-002, BN-003 (bottleneck mitigations)
        - Compliance: SOC 2, GDPR, HIPAA roadmap
      PRIORITIZE: Security mitigations FIRST (Month 0-3)

  3. LOAD_CONSTRAINTS:
      READ: tradeoff-analysis.yaml
      EXTRACT:
        - Budget: $410K-$710K
        - Timeline: 6 months
        - Cost breakdown: $190K-$305K security, $154K ops
        - Team: 15 people

  4. IDENTIFY_PHASES:
      FROM: architecture evolution strategy (3 phases)
      EXTRACT:
        - Phase 1: MVP (Month 0-6) - 10 customers, core platform
        - Phase 2: Growth (Month 6-12) - 50 customers, scaling features
        - Phase 3: Scale (Month 12-24) - 300 customers, multi-region
      FOCUS: Phase 1 MVP only for this plan

  5. OUTPUT:
      WRITE: planning-context.yaml
```

**Gate 0:** Context complete? (Architecture loaded, risks prioritized, constraints clear)

---

### Phase 1: DECOMPOSITION (Rozkład na Zadania)

**Purpose:** Rozłóż architekturę na Work Breakdown Structure (WBS).

```yaml
steps:
  1. IDENTIFY_WORK_STREAMS:
      FROM: Bounded contexts (7 contexts)
      CREATE: 4 work streams (align with 15-person team)

      work_streams:
        - Platform Core (5 people):
            - API Gateway
            - IAM Service
            - MCP Server
            - Dashboard

        - Process Integration (4 people):
            - Process Orchestrator
            - Process Services (5 services: architect, risk, verify, requirements, compliance)
            - Job Queue
            - Executor Pool

        - Observability & Data (3 people):
            - Monitoring Service
            - Logging
            - Metrics
            - PostgreSQL Multi-Tenant Setup
            - S3 Storage

        - Security & Compliance (3 people):
            - VR-001 mitigation (multi-tenant isolation)
            - VR-010 mitigation (OAuth hardening)
            - VR-008 mitigation (rate limiting)
            - SOC 2 compliance

  2. DECOMPOSE_TO_EPICS:
      FOR each work_stream:
        IDENTIFY: Major deliverables (Epics)

      example_epics:
        - EPIC-001: "API Gateway with rate limiting and authentication"
        - EPIC-002: "Multi-tenant PostgreSQL with schema-per-tenant"
        - EPIC-003: "VR-001: SQL injection prevention (WAF + parameterized queries)"
        - EPIC-004: "MCP Server integration with GitHub Copilot"
        - EPIC-005: "Process Orchestrator with state management"
        - ... (estimate 30-40 epics total)

  3. DECOMPOSE_TO_STORIES:
      FOR each epic:
        BREAK DOWN: Into user stories (2-5 days each)

      example_stories (EPIC-001):
        - STORY-001-01: "As a user, I can authenticate via OAuth 2.0"
        - STORY-001-02: "As an admin, I can configure rate limits per tenant"
        - STORY-001-03: "As a developer, I can deploy API Gateway to Kubernetes"
        - STORY-001-04: "As a user, I see meaningful errors when rate limited"
        - STORY-001-05: "As an operator, I can monitor API Gateway health"

  4. DECOMPOSE_TO_TASKS:
      FOR each story:
        BREAK DOWN: Into tasks (0.5-2 days each)

      example_tasks (STORY-001-01):
        - TASK-001-01-A: "Setup Auth0 tenant and configure OAuth flow"
        - TASK-001-01-B: "Implement /auth/login endpoint"
        - TASK-001-01-C: "Implement JWT validation middleware"
        - TASK-001-01-D: "Add integration tests for auth flow"
        - TASK-001-01-E: "Document OAuth setup in README"

  5. ESTIMATE_EFFORT:
      FOR each task:
        ESTIMATE: Effort in story points (Fibonacci: 1, 2, 3, 5, 8)
        CONVERT: To hours (1 SP = 4 hours for planning)
        ADD: Buffer (20% for unknowns)

      estimation_rules:
        - Simple CRUD: 1-2 SP
        - Integration with external service: 3-5 SP
        - Security-critical code: 5-8 SP (needs review)
        - Infrastructure setup: 2-3 SP
        - Testing: 20% of implementation effort

  6. OUTPUT:
      WRITE: work-breakdown-structure.yaml
        - Total tasks: ~400-600 (for 6-month MVP)
        - Total effort: ~2000-3000 hours (15 people × 6 months × 160h/month = 14,400h capacity)
        - Utilization: 20-25% (rest is meetings, support, etc.)
```

**Gate 1:** WBS complete? (All architecture components mapped to tasks, effort estimated)

---

### Phase 2: SEQUENCING (Harmonogram i Zależności)

**Purpose:** Określ kolejność zadań na podstawie zależności i priorytetów.

```yaml
steps:
  1. MAP_DEPENDENCIES:
      FOR each task:
        IDENTIFY: Dependencies (what must complete BEFORE this task)

      dependency_types:
        - Technical: "Task B needs Task A output (e.g., DB schema before API)"
        - Resource: "Same person can't do both tasks simultaneously"
        - Risk: "Security mitigation must complete before feature launch"
        - Knowledge: "Proof-of-concept before full implementation"

      example_dependencies:
        - TASK-002-01 (PostgreSQL schema-per-tenant setup):
            depends_on: [TASK-002-00 (PostgreSQL cluster installation)]
        - TASK-003-01 (VR-001 WAF implementation):
            depends_on: [TASK-001-01 (API Gateway deployment)]
        - ALL feature tasks:
            depends_on: [VR-001, VR-010, VR-008 security mitigations]

  2. PRIORITIZE_TASKS:
      APPLY: Priority rules

      priority_rules:
        P0_CRITICAL (must do first):
          - Infrastructure setup (EKS, RDS, S3)
          - VR-001, VR-010, VR-008 security mitigations (Month 0-3)
          - Core authentication (IAM Service)

        P1_HIGH (core MVP features):
          - API Gateway
          - MCP Server
          - Process Orchestrator
          - 4 core processes (architect, risk, verify, requirements)

        P2_MEDIUM (nice-to-have MVP):
          - Dashboard
          - Advanced monitoring
          - Webhook notifications

        P3_LOW (post-MVP):
          - Hybrid deployment
          - Multi-region
          - Advanced analytics

  3. APPLY_SCHEDULING_ALGORITHM:
      ALGORITHM: Critical Path Method (CPM)

      steps:
        a. Create dependency graph (DAG)
        b. Calculate earliest start time (EST) for each task
        c. Calculate latest finish time (LFT) for each task
        d. Identify critical path (tasks with zero slack)
        e. Schedule non-critical tasks to optimize resource utilization

      optimization_goals:
        - Minimize total duration (primary)
        - Balance team workload (secondary)
        - Front-load risk mitigations (constraint)
        - Respect checkpoint boundaries (every 2 weeks)

  4. CREATE_SPRINTS:
      DURATION: 2 weeks per sprint
      CAPACITY: 15 people × 10 days × 6h productive/day = 900 hours per sprint
      VELOCITY: ~225 story points per sprint (assuming 1 SP = 4h)

      FOR each sprint (Sprint 1 to Sprint 13 over 6 months):
        SELECT: Tasks that:
          - Dependencies satisfied
          - Fit team capacity
          - Align with sprint goal
          - Balance across work streams

        CREATE: sprint-backlog-{N}.yaml

      sprint_goals_example:
        - Sprint 1-2 (Month 1): "Infrastructure + Security foundations"
          - Setup EKS, RDS, S3
          - Implement VR-001 multi-tenant isolation
          - Setup CI/CD pipeline

        - Sprint 3-4 (Month 2): "Core platform services"
          - API Gateway + IAM
          - VR-010 OAuth hardening
          - VR-008 rate limiting

        - Sprint 5-6 (Month 3): "Process integration"
          - MCP Server
          - Process Orchestrator
          - deep-architect service
          - deep-risk service

        - Sprint 7-8 (Month 4): "Feature completion"
          - deep-verify service
          - deep-requirements service
          - Webhook notifications

        - Sprint 9-10 (Month 5): "Testing & hardening"
          - Load testing (identify BN-001, BN-002, BN-003)
          - Security penetration testing
          - SOC 2 gap remediation

        - Sprint 11-13 (Month 6): "MVP launch prep"
          - Documentation
          - Pilot customer onboarding (10 customers)
          - Production deployment

  5. OUTPUT:
      WRITE: implementation-plan.yaml (master plan)
      WRITE: sprint-backlog-01.yaml (first sprint, ready to execute)
      WRITE: timeline.md (Gantt chart visualization)
```

**Gate 2:** Sequencing complete? (Dependencies mapped, critical path identified, sprints planned)

---

### Phase 3: RESOURCE ALLOCATION (Przydział Ludzi)

**Purpose:** Przypisz konkretne osoby/role do zadań.

```yaml
steps:
  1. DEFINE_TEAM_STRUCTURE:
      total_team: 15 people

      roles:
        - Tech Lead (1): Architecture decisions, code review, blockers
        - Senior Backend Engineers (4): Core services implementation
        - Mid Backend Engineers (3): Feature implementation
        - Senior Frontend Engineer (1): Dashboard, MCP client
        - DevOps Engineer (2): Infrastructure, CI/CD, monitoring
        - Security Engineer (2): VR-001/010/008 mitigation, pen testing
        - QA Engineer (1): Test automation, quality gates
        - Product Owner (1): Requirements, priorities, stakeholder liaison

  2. ASSIGN_ROLES_TO_WORK_STREAMS:
      Platform Core (5 people):
        - 1 Tech Lead
        - 2 Senior Backend
        - 1 Senior Frontend
        - 1 Mid Backend

      Process Integration (4 people):
        - 2 Senior Backend
        - 2 Mid Backend

      Observability & Data (3 people):
        - 2 DevOps
        - 1 Mid Backend

      Security & Compliance (3 people):
        - 2 Security Engineers
        - 1 QA Engineer

  3. ASSIGN_TASKS_TO_PEOPLE:
      FOR each task in sprint:
        MATCH: Task skill requirements to person skills
        CHECK: Person capacity (max 6h productive/day)
        ASSIGN: Task to person

      assignment_rules:
        - Security tasks → Security Engineers
        - Infrastructure → DevOps
        - Core services → Senior Backend
        - Features → Mid Backend
        - Code review → Tech Lead (20% time allocation)
        - Testing → QA + developers (test own code)

  4. BALANCE_WORKLOAD:
      FOR each person:
        COMPUTE: Total allocated hours
        IF overallocated (> 60h per sprint):
          REBALANCE: Move lower-priority tasks to next sprint
        IF underallocated (< 40h per sprint):
          PULL: Tasks from backlog

      target_utilization: 50-60h per sprint (allows for meetings, support, learning)

  5. OUTPUT:
      WRITE: resource-allocation.yaml
        - Person-level assignments
        - Utilization per person
        - Skill gaps (if any)
```

**Gate 3:** Resources allocated? (All tasks assigned, workload balanced, no overallocation)

---

### Phase 4: RISK-AWARE PLANNING (Uwzględnienie Ryzyk)

**Purpose:** Wbuduj risk mitigations do planu.

```yaml
steps:
  1. LOAD_CRITICAL_RISKS:
      FROM: risk-report.md
      EXTRACT:
        - VR-001: Multi-tenant SQL injection ($100K-$145K mitigation, Month 3 deadline)
        - VR-010: OAuth cross-tenant ($60K-$100K, Month 3 deadline)
        - VR-008: Resource exhaustion ($30K-$60K, Month 2 deadline)

  2. CREATE_MITIGATION_TASKS:
      FOR each critical_risk:
        DECOMPOSE: Mitigation into tasks (already in WBS)
        SCHEDULE: By deadline (enforce in sequencing)

      example (VR-001 mitigation tasks):
        - TASK-VR001-01: "Implement Web Application Firewall (WAF) rules" (5 SP, Month 1)
        - TASK-VR001-02: "Refactor all SQL to parameterized queries" (13 SP, Month 2)
        - TASK-VR001-03: "Add SQL injection detection in monitoring" (3 SP, Month 2)
        - TASK-VR001-04: "Penetration testing for SQL injection" (5 SP, Month 3)
        - TASK-VR001-05: "Security audit and remediation" (8 SP, Month 3)

  3. SCHEDULE_CHECKPOINTS:
      FREQUENCY: Every 2 weeks (sprint boundary)

      checkpoint_types:
        - Technical checkpoint: "Does code work? Tests pass?"
        - Security checkpoint: "Mitigations effective? Pen test results?"
        - Quality checkpoint: "Meets quality attributes? Performance OK?"
        - Business checkpoint: "On budget? On schedule? Scope aligned?"

      checkpoint_enforcement:
        IF checkpoint_failed:
          HALT: Do not proceed to next sprint
          TRIGGER: deep-govern (escalation)
          REQUIRE: Corrective action plan

  4. ADD_CONTINGENCY:
      BUFFER: 20% time buffer for unknowns

      contingency_allocation:
        - Sprint-level: 1-2 days per sprint (for unplanned work)
        - Project-level: 2-4 weeks at end (for integration, bug fixes)

      buffer_usage_rules:
        - Use buffer for: Blockers, emergent requirements, technical debt
        - Do not use buffer for: Scope creep, gold-plating
        - Track buffer burn: Alert if >50% consumed by mid-project

  5. OUTPUT:
      WRITE: risk-schedule.yaml (when each mitigation happens)
      WRITE: checkpoint-plan.yaml (validation gates)
      UPDATE: implementation-plan.yaml (with risk tasks and checkpoints)
```

**Gate 4:** Risk planning complete? (All critical risks scheduled, checkpoints defined)

---

### Phase 5: VALIDATION & BASELINE (Walidacja Planu)

**Purpose:** Zweryfikuj że plan jest wykonalny i ustaw baseline.

```yaml
steps:
  1. VALIDATE_CONSTRAINTS:
      CHECK:
        - Duration: 6 months (13 sprints) ≤ 6 months target ✓
        - Budget: Total cost ≤ $710K ✓
        - Team: 15 people available ✓
        - Critical path: ≤ 5.5 months (leaves 2 weeks buffer) ✓

      IF any_constraint_violated:
        REPLAN: Adjust scope or timeline
        ESCALATE: To deep-govern for decision

  2. VALIDATE_DEPENDENCIES:
      RUN: Dependency graph analysis
      CHECK:
        - No circular dependencies ✓
        - All dependencies satisfiable ✓
        - Critical path optimized ✓

      IF dependency_issues:
        FIX: Resequence tasks
        RERUN: Scheduling algorithm

  3. VALIDATE_CAPACITY:
      FOR each sprint:
        CHECK: Allocated hours ≤ Team capacity
        CHECK: Skill availability (right people for right tasks)

      IF capacity_exceeded:
        REBALANCE: Move tasks to later sprints
        OR: Descope low-priority features

  4. SIMULATE_EXECUTION:
      RUN: Monte Carlo simulation (1000 iterations)
      VARY: Task durations (±30%)
      MEASURE:
        - Probability of on-time delivery: 75% (acceptable if ≥70%)
        - Expected completion: Month 6.2 (within buffer)
        - P90 completion: Month 6.8 (worst case)

      IF simulation_shows_high_risk:
        ADD: More buffer
        OR: Descope features

  5. BASELINE_PLAN:
      SNAPSHOT: implementation-plan.yaml as baseline-plan-v1.0.yaml
      RECORD:
        - Baseline scope: 400 tasks
        - Baseline duration: 6 months
        - Baseline cost: $560K
        - Baseline assumptions: 15 people, 50% utilization, no major blockers

      PURPOSE: Future comparison (plan vs actual)

  6. OUTPUT:
      WRITE: baseline-plan-v1.0.yaml
      WRITE: planning-validation-report.md
      WRITE: simulation-results.yaml
```

**Gate 5:** Plan validated? (Constraints met, dependencies OK, capacity sufficient, baseline set)

---

### Phase 6: ADAPTIVE RE-PLANNING (Aktualizacja Planu)

**Purpose:** Zaktualizuj plan na podstawie rzeczywistego postępu i zmian.

**Trigger:** Weekly (after deep-monitor status report) OR on-demand (major change)

```yaml
steps:
  1. LOAD_ACTUALS:
      FROM: deep-monitor (execution-status.yaml)
      EXTRACT:
        - Completed tasks: Which tasks done
        - Task durations: Actual vs estimated
        - Blockers: Active blockers preventing progress
        - Velocity: Actual story points per sprint

      FROM: deep-change (approved-changes.yaml)
      EXTRACT:
        - Scope changes: New tasks added
        - Priority changes: Tasks re-prioritized
        - Constraint changes: Timeline or budget adjusted

  2. COMPUTE_VARIANCE:
      COMPARE: Actual vs baseline

      metrics:
        - Schedule variance: Actual progress - planned progress
          Example: "Sprint 3 completed 180 SP (planned: 225 SP) = -20% variance"

        - Velocity variance: Actual velocity - planned velocity
          Example: "Team velocity 180 SP/sprint (planned: 225) = -20%"

        - Scope variance: Actual scope - baseline scope
          Example: "Scope increased by 15 tasks (+3%) due to CR-012, CR-013"

      IF variance_significant (>10%):
        FLAG: For re-planning

  3. UPDATE_ESTIMATES:
      BASED ON: Actual task durations

      FOR each task_type:
        COMPUTE: Actual average duration
        UPDATE: Estimates for similar future tasks

      example:
        - Task type: "Database migration"
          Baseline estimate: 5 SP
          Actual average: 8 SP
          Updated estimate: 7 SP (weighted average)

  4. RESEQUENCE_TASKS:
      BASED ON: Blockers, priority changes

      IF blocker_detected:
        FIND: Alternative tasks (not blocked)
        REORDER: Sprint backlog to work around blocker

      IF priority_changed (from deep-govern):
        RESCHEDULE: Tasks according to new priorities
        EXAMPLE: "VR-009 newly discovered critical risk → pull mitigation forward to Sprint 5"

  5. REBALANCE_RESOURCES:
      IF team_velocity_lower_than_expected:
        OPTION A: Extend timeline (add sprints)
        OPTION B: Descope features (cut low-priority)
        OPTION C: Add resources (hire contractors)

        DECISION: Escalate to deep-govern

      IF team_member_unavailable (sick, quit):
        REALLOCATE: Their tasks to others
        REBALANCE: Workload

  6. REGENERATE_PLAN:
      RERUN: Scheduling algorithm with updated data
      GENERATE: New sprint backlogs for remaining sprints
      COMPARE: New plan vs baseline

      change_impact_analysis:
        - Timeline impact: "+2 weeks due to velocity variance"
        - Cost impact: "+$35K due to CR-012 (SAML SSO)"
        - Scope impact: "-3 features descoped (Dashboard analytics)"

  7. COMMUNICATE_CHANGES:
      GENERATE: Plan update report
      NOTIFY: deep-govern (for approval)
      NOTIFY: deep-implement (new sprint backlog)
      NOTIFY: Stakeholders (timeline/scope changes)

  8. OUTPUT:
      WRITE: implementation-plan-v1.1.yaml (updated plan)
      WRITE: sprint-backlog-{N+1}.yaml (next sprint)
      WRITE: plan-variance-report.md
      UPDATE: timeline.md (new Gantt chart)
```

**Gate 6:** Re-planning complete? (Actuals incorporated, variances analyzed, plan updated, stakeholders notified)

---

## INTEGRATION WITH OTHER PROCESSES

```yaml
integration_points:

  consumes_from:
    - deep-architect:
        artifact: architecture-comprehensive.md
        usage: "Input for WBS decomposition"

    - deep-risk:
        artifact: risk-report.md
        usage: "Critical mitigations scheduled in plan"

    - deep-monitor:
        artifact: execution-status.yaml
        frequency: "Weekly"
        usage: "Adaptive re-planning based on actuals"

    - deep-change:
        artifact: approved-changes.yaml
        frequency: "As changes approved"
        usage: "Update plan with scope/priority changes"

  produces_for:
    - deep-implement:
        artifact: sprint-backlog.yaml
        frequency: "Every 2 weeks"
        usage: "Tasks to execute in next sprint"

    - deep-govern:
        artifact: implementation-plan.yaml
        frequency: "Weekly (updated)"
        usage: "Oversight, approve plan changes"

    - deep-monitor:
        artifact: baseline-plan-v1.0.yaml
        frequency: "Once (at start)"
        usage: "Compare actual vs planned"

    - deep-change:
        artifact: planning-decisions.yaml
        usage: "Context for change impact analysis"
```

---

## DECISION FRAMEWORKS

### Planning Trade-Offs

```yaml
scenario_1_timeline_vs_scope:
  situation: "Plan shows 7 months needed, but constraint is 6 months"
  options:
    A: "Extend timeline to 7 months (request timeline change)"
    B: "Descope 15% features to fit 6 months"
    C: "Add 3 contractors ($120K cost increase)"

  decision_criteria:
    - IF MVP_viability_requires_full_scope:
        CHOOSE: A (extend timeline)
    - IF budget_flexible AND timeline_fixed:
        CHOOSE: C (add resources)
    - IF scope_has_low_priority_items:
        CHOOSE: B (descope) - RECOMMENDED

  recommendation: "Descope P2 features (Dashboard analytics, advanced monitoring) → saves 4 weeks"

scenario_2_risk_mitigation_timing:
  situation: "VR-001 mitigation takes 6 weeks, but other features waiting"
  options:
    A: "Complete VR-001 fully before starting features (sequential)"
    B: "Parallelize VR-001 and features (risk: rework if VR-001 changes architecture)"
    C: "Implement VR-001 minimum viable mitigation (2 weeks), then features, then harden (4 weeks)"

  decision_criteria:
    - IF VR-001_likely_to_change_architecture:
        CHOOSE: A (sequential) - safest
    - IF team_has_separate_security_track:
        CHOOSE: B (parallel) - fastest
    - IF VR-001_can_be_split:
        CHOOSE: C (incremental) - RECOMMENDED

  recommendation: "Incremental approach: WAF + parameterized queries first (covers 80% of risk), then full hardening later"

scenario_3_team_velocity_variance:
  situation: "Sprint 3 velocity was 180 SP (planned: 225 SP) = -20%"
  options:
    A: "Assume anomaly, keep plan unchanged"
    B: "Reduce future sprint capacity to 180 SP (extend timeline by 3 weeks)"
    C: "Investigate root cause (blockers? skill gaps? estimation errors?)"

  decision_criteria:
    - IF one_time_event (holiday, sick leave):
        CHOOSE: A (keep plan)
    - IF systemic_issue (estimates consistently wrong):
        CHOOSE: B (adjust capacity)
    - IF unclear:
        CHOOSE: C (investigate) - RECOMMENDED

  recommendation: "Investigate first (2 days), then decide. Common causes: underestimation, blockers, context switching."
```

---

## METRICS & KPIS

```yaml
planning_quality_metrics:

  accuracy:
    - estimate_accuracy: "Actual duration / Estimated duration"
      target: "0.8 - 1.2 (within 20%)"
      measure_frequency: "Per sprint"

    - schedule_variance: "Actual completion - planned completion"
      target: "≤ 5% (≤ 1 week for 6-month project)"
      measure_frequency: "Weekly"

    - scope_stability: "Baseline tasks / Current tasks"
      target: "≥ 0.90 (≤10% scope change)"
      measure_frequency: "Monthly"

  efficiency:
    - planning_overhead: "Time spent planning / Total project time"
      target: "≤ 5% (2-3 weeks of 26 weeks)"
      measure_frequency: "End of project"

    - re-planning_frequency: "Number of major plan updates"
      target: "≤ 3 over 6 months (monthly re-baseline acceptable)"
      measure_frequency: "Continuous"

  effectiveness:
    - critical_path_optimization: "Critical path duration / Sequential duration"
      target: "≤ 0.60 (40% reduction via parallelization)"
      measure_frequency: "At planning, at re-planning"

    - resource_utilization: "Actual hours / Allocated hours"
      target: "50-60% (healthy utilization)"
      measure_frequency: "Per sprint"

    - risk_mitigation_timing: "Risk mitigations completed on time"
      target: "100% (all critical risks by deadline)"
      measure_frequency: "Monthly"
```

---

## EXAMPLES

### Example 1: Initial Planning

**Input:**
- enterprise-architecture-final.md (66KB)
- 23 microservices to build
- $560K budget, 6 months, 15 people

**Process:**
1. Decompose to 387 tasks
2. Estimate 2,340 hours total effort
3. Sequence with CPM → critical path 4.8 months
4. Create 13 sprints × 225 SP = 2,925 SP capacity
5. Allocate 2,340 SP (80% utilization)

**Output:**
- implementation-plan.yaml (150KB, 387 tasks)
- sprint-backlog-01.yaml (first 2-week sprint, 42 tasks, 225 SP)
- timeline.md (shows Month 6.0 completion, 0.2 month buffer)

---

### Example 2: Adaptive Re-Planning

**Situation (Week 7, Sprint 4 retrospective):**
- Actual velocity: 180 SP/sprint (planned: 225 SP)
- Blocker: Auth0 API down (blocks 8 tasks)
- Change request: CR-012 (add SAML SSO, +35 SP, approved)

**Process:**
1. Load actuals: 180 SP/sprint × 3 sprints = 540 SP (planned: 675 SP) = -20%
2. Compute variance: 3 weeks behind schedule
3. Update estimates: Reduce future sprints to 190 SP (conservative)
4. Resequence: Work around Auth0 blocker (11 alternative tasks identified)
5. Add CR-012: +35 SP to Sprint 6
6. Regenerate plan: Now shows Month 6.6 completion (0.6 month slip)

**Decision:**
- Escalate to deep-govern: "Accept 0.6 month slip OR descope 3 features?"
- deep-govern decision: "Descope Dashboard analytics (40 SP) → back to Month 6.0"

**Output:**
- implementation-plan-v1.1.yaml (updated plan, 422 tasks)
- sprint-backlog-05.yaml (excludes Auth0-dependent tasks, includes alternatives)
- plan-variance-report.md (explains slip, mitigation)

---

## QUALITY GATES

```yaml
gate_0_context:
  conditions:
    - architecture_loaded: TRUE
    - risks_prioritized: TRUE
    - constraints_clear: TRUE
  verdict: "OPEN if all TRUE"

gate_1_wbs:
  conditions:
    - all_components_mapped_to_tasks: TRUE
    - effort_estimated: TRUE
    - total_tasks: "300-600 (reasonable for 6 months)"
  verdict: "OPEN if all TRUE"

gate_2_sequencing:
  conditions:
    - dependencies_mapped: TRUE
    - critical_path_identified: TRUE
    - sprints_created: TRUE
    - duration_within_constraint: "≤ 6 months"
  verdict: "OPEN if all TRUE"

gate_3_resources:
  conditions:
    - all_tasks_assigned: TRUE
    - workload_balanced: "50-60h per sprint per person"
    - no_skill_gaps: TRUE
  verdict: "OPEN if all TRUE"

gate_4_risk_planning:
  conditions:
    - critical_risks_scheduled: TRUE (VR-001, VR-010, VR-008 by Month 3)
    - checkpoints_defined: TRUE (every 2 weeks)
    - contingency_buffer: "≥ 15%"
  verdict: "OPEN if all TRUE"

gate_5_validation:
  conditions:
    - constraints_validated: TRUE
    - dependencies_validated: TRUE
    - capacity_validated: TRUE
    - simulation_acceptable: "P(on-time) ≥ 70%"
    - baseline_set: TRUE
  verdict: "OPEN if all TRUE, plan approved for execution"

gate_6_replan:
  conditions:
    - actuals_incorporated: TRUE
    - variance_analyzed: TRUE
    - plan_updated: TRUE
    - stakeholders_notified: TRUE
  verdict: "OPEN if all TRUE, updated plan approved"
```

---

## ANTI-PATTERNS TO AVOID

```yaml
anti_patterns:

  AP-PLAN-001_waterfall_planning:
    description: "Create detailed 6-month plan upfront, never update"
    why_bad: "Reality always differs from plan, rigidity causes failure"
    instead: "Adaptive planning: detailed next sprint, rough future sprints, re-plan weekly"

  AP-PLAN-002_no_baseline:
    description: "Continuously update plan without preserving baseline"
    why_bad: "Can't measure variance, can't learn from estimation errors"
    instead: "Set baseline at start, version all plan updates, track variance"

  AP-PLAN-003_optimistic_estimation:
    description: "Estimate tasks with zero buffer, assume perfect execution"
    why_bad: "Any blocker causes slip, no resilience"
    instead: "Add 20% buffer, use P80 estimates (80% confidence), validate via simulation"

  AP-PLAN-004_ignore_dependencies:
    description: "Schedule tasks without checking dependencies"
    why_bad: "Tasks start but can't complete (waiting for dependency)"
    instead: "Map dependencies explicitly, use CPM to find critical path"

  AP-PLAN-005_over_allocate_resources:
    description: "Assign 8h/day of tasks to each person"
    why_bad: "No time for meetings, reviews, support → burnout, quality suffers"
    instead: "Target 50-60% allocation (6h productive/day), rest is overhead"

  AP-PLAN-006_plan_without_risk:
    description: "Create plan ignoring risks"
    why_bad: "Risks materialize, no mitigation scheduled, project derails"
    instead: "Schedule risk mitigations as first-class tasks, enforce deadlines"
```

---

## DEPENDENCIES

**Required processes (must exist):**
- deep-architect: Provides architecture design
- deep-risk: Provides risk analysis

**Optional but recommended:**
- deep-monitor: Provides actual progress for re-planning
- deep-change: Provides approved changes to incorporate
- deep-govern: Approves plan and changes

**Produces for:**
- deep-implement: Consumes sprint backlogs
- deep-govern: Reviews and approves plan
- Stakeholders: Timeline visibility

---

## NEXT STEPS

1. **Create workflow.md** - Step-by-step enforcement sequence
2. **Create steps/** - Detailed step files (step-00-context.md, step-01-decomposition.md, etc.)
3. **Test with example** - Run deep-plan on enterprise-architecture-final.md
4. **Integrate with deep-implement** - Ensure sprint-backlog.yaml format compatible
5. **Setup monitoring** - Track planning accuracy metrics

---

**Version:** 1.0
**Status:** DRAFT - Ready for implementation
**Author:** Claude (Sonnet 4.5)
**Date:** 2026-02-16
