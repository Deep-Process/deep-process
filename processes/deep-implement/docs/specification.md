# Deep-Implement Process Specification

## PURPOSE

**Problem Solved:** Masz plan (z deep-plan), ale nikt go nie wykonuje. Potrzebujesz:
- Task execution engine (execute tasks from sprint backlog)
- Blocker detection (automatic detection when stuck)
- Progress tracking (what's done, what's in progress, what's blocked)
- Quality validation (verify outputs before marking complete)
- Change request generation (when plan diverges from reality)

**Solution:** Proces deep-implement to "Execution Engine" - wykonuje zadania z planu, wykrywa problemy, raportuje postęp, generuje change requests gdy potrzeba adaptacji.

---

## CORE CAPABILITY

**Kluczowa funkcja:** **Controlled Task Execution with Feedback Loop**

Execute → Detect Issues → Report → Adapt → Execute (OODA loop)

**Execution Modes:**
1. **HUMAN-GUIDED**: Human executes tasks, process tracks and validates
2. **AI-ASSISTED**: AI suggests implementation, human reviews and executes
3. **AUTOMATED**: AI executes tasks autonomously (where possible)

**Initial implementation:** HUMAN-GUIDED (track and validate human work)

---

## INPUTS

```yaml
primary_inputs:

  - sprint-backlog.yaml:
      source: deep-plan
      frequency: "Every 2 weeks (sprint boundary)"
      content: "Tasks for current sprint (2 weeks)"
      structure:
        sprint_id: "Sprint-06"
        sprint_duration: "2 weeks"
        sprint_start: "2026-03-01"
        sprint_end: "2026-03-14"
        tasks:
          - task_id: TASK-018-01
            title: "Enable Auth0 MFA tenant settings"
            story_points: 1
            assigned_to: "Security Engineer 1"
            dependencies: []
            definition_of_done: "MFA enabled in Auth0 dashboard, documented"

  - approved-changes.yaml:
      source: deep-change
      frequency: "Continuous (as changes approved)"
      content: "Changes approved mid-sprint (add to backlog)"

  - architecture-comprehensive.md:
      source: deep-architect
      content: "Architecture design (reference for implementation)"

  - implementation-plan.yaml:
      source: deep-plan
      content: "Full plan (context for current sprint)"

context_inputs:

  - definition-of-done.yaml:
      source: user/project-standards
      content: "Quality criteria for 'task complete'"
      example:
        code_written: "Implementation complete, follows coding standards"
        tests_written: "Unit tests ≥80% coverage, integration tests for critical paths"
        code_reviewed: "At least 1 peer review, all comments addressed"
        documentation_updated: "README, API docs, inline comments"
        quality_gates_passed: "SAST scan, linting, tests passing"
```

---

## OUTPUTS

```yaml
primary_outputs:

  - execution-status.yaml:
      size: ~20-50KB
      content: "Real-time status of all tasks (completed, in-progress, blocked, pending)"
      frequency: "Continuous (updated as tasks progress)"
      format: YAML
      feeds: deep-monitor, deep-govern

  - blockers.yaml:
      size: ~10-20KB
      content: "Active blockers preventing progress"
      frequency: "Real-time (as blockers detected)"
      format: YAML
      feeds: deep-change (trigger change requests)

  - sprint-retrospective.yaml:
      size: ~10-20KB
      content: "Sprint outcomes (what completed, what didn't, why, lessons)"
      frequency: "Every 2 weeks (sprint boundary)"
      format: YAML
      feeds: deep-govern, deep-plan (for adaptive re-planning)

  - deliverables/:
      content: "Actual implementation artifacts (code, docs, configs)"
      structure:
        code/: "Source code committed to git"
        docs/: "Documentation (README, API docs, guides)"
        configs/: "Configuration files (Kubernetes manifests, env files)"
        tests/: "Test code (unit, integration, e2e)"

  - execution-challenges.yaml:
      size: ~5-10KB
      content: "Challenges encountered (not blockers, but difficulties)"
      frequency: "Sprint retrospective"
      feeds: deep-change (process improvements)

supporting_outputs:

  - task-completion-log.yaml: "Audit trail of all task completions"
  - time-tracking.yaml: "Actual time spent per task (for estimation improvement)"
  - quality-validation-results.yaml: "Quality gate results per task"
```

---

## PROCESS WORKFLOW

### Mode 1: SPRINT EXECUTION (2-Week Cycle)

```yaml
sprint_lifecycle:

  day_0_sprint_planning:
    time: "Friday before sprint (14:00-16:00)"

    steps:
      1. LOAD_SPRINT_BACKLOG:
          READ: sprint-backlog-{N}.yaml (from deep-plan)
          VERIFY:
            - All tasks have clear Definition of Done
            - All dependencies satisfied (prerequisite tasks complete)
            - All resources assigned (people allocated)
            - Total capacity ≤ team capacity (225 SP for 15 people)

          IF verification_failed:
            HALT: Sprint planning
            ESCALATE: To deep-govern (sprint not ready)

      2. SPRINT_KICKOFF_MEETING:
          PARTICIPANTS: Full team (15 people) + Product Owner
          DURATION: 2 hours

          agenda:
            - Review sprint goal: "What are we achieving this sprint?"
            - Review tasks: Each task explained, questions answered
            - Confirm assignments: Each person knows their tasks
            - Identify risks: Anything that might block us?
            - Commit: Team commits to sprint goal

          OUTPUT: Sprint commitment (YES/NO vote)

          IF no_commitment:
            REASON: "Team feels sprint is too ambitious"
            ACTION: Descope tasks (remove lowest priority)
            RETRY: Sprint planning with reduced scope

      3. INITIALIZE_SPRINT_STATE:
          CREATE: execution-status-sprint-{N}.yaml

          initial_state:
            sprint_id: "Sprint-06"
            sprint_start: "2026-03-01"
            sprint_end: "2026-03-14"
            sprint_goal: "Implement MFA and API Gateway rate limiting"
            total_tasks: 42
            total_story_points: 225
            tasks:
              - task_id: TASK-018-01
                status: PENDING
                assigned_to: "Security Engineer 1"
                started: null
                completed: null
                blocked: NO
                blocked_reason: null

  day_1-10_sprint_execution:
    DAILY_CYCLE:

      morning_standup (09:00-09:15):
        format: "Each person answers 3 questions"
        questions:
          - "What did I complete yesterday?"
          - "What am I working on today?"
          - "Any blockers?"

        process:
          FOR each person:
            LISTEN: Their update
            DETECT: Blockers mentioned
            IF blocker_mentioned:
              CREATE: Blocker in blockers.yaml
              ESCALATE: If blocker is CRITICAL (blocks >3 tasks)

      work_execution (09:15-17:00):
        FOR each task WHERE status = IN_PROGRESS:
          HUMAN: Executes task (writes code, configures, tests)
          PROCESS: Tracks progress, validates quality

          task_lifecycle:
            1. TASK_START:
                HUMAN: Claims task from backlog
                PROCESS:
                  UPDATE: task.status = IN_PROGRESS
                  RECORD: task.started = timestamp
                  NOTIFY: deep-monitor (task started)

            2. TASK_EXECUTION:
                HUMAN: Implements task (code, config, docs, tests)
                PROCESS:
                  MONITOR: Time since start
                  IF time_since_start > 2× estimated_duration:
                    FLAG: Task running long (potential blocker)
                    NOTIFY: Assigned person + Tech Lead

                execution_assistance:
                  AI_ASSISTANT: Suggest implementation approach
                  CODE_GENERATION: Generate boilerplate code
                  TEST_GENERATION: Generate test templates
                  DOC_GENERATION: Generate documentation templates

            3. TASK_VALIDATION:
                HUMAN: Self-validates against Definition of Done
                CHECKLIST (from definition-of-done.yaml):
                  - Code written: Implementation complete
                  - Tests written: Unit tests ≥80% coverage
                  - Code reviewed: Peer review done
                  - Documentation: Updated
                  - Quality gates: SAST scan passed, linting clean

                IF any_item_incomplete:
                  CONTINUE: Task execution (not done yet)

                IF all_items_complete:
                  PROCEED: To quality validation

            4. QUALITY_VALIDATION:
                AUTOMATED_CHECKS:
                  - Run SAST scan (Semgrep, Bandit)
                  - Run linters (eslint, pylint)
                  - Run unit tests (pytest, jest)
                  - Run integration tests (where applicable)
                  - Check code coverage (≥80% target)

                RESULTS:
                  IF all_checks_pass:
                    PROCEED: To task completion

                  IF any_check_fails:
                    CREATE: quality-issue.yaml
                    STATUS: Task remains IN_PROGRESS
                    NOTIFY: Assigned person (fix issues)

                    IF security_vulnerability_detected:
                      HALT: Task immediately
                      ESCALATE: To deep-govern (security issue)

            5. TASK_COMPLETION:
                HUMAN: Marks task as complete
                PROCESS:
                  VERIFY: Quality validation passed
                  UPDATE: task.status = COMPLETED
                  RECORD: task.completed = timestamp
                  COMPUTE: task.actual_duration = completed - started
                  NOTIFY: deep-monitor (task completed)
                  RELEASE: Allocated resources
                  UNBLOCK: Dependent tasks (if any)

                  OUTPUT: Append to task-completion-log.yaml

                celebration:
                  IF task_is_epic_or_milestone:
                    NOTIFY: Team (celebration, morale boost)

      blocker_detection (continuous):
        triggers:
          - HUMAN_REPORTED: Person says "I'm blocked" in standup
          - AUTOMATIC: Task in IN_PROGRESS for >2× estimated duration
          - AUTOMATIC: Task has dependency task still PENDING/BLOCKED
          - AUTOMATIC: External service down (API unavailable)

        process:
          WHEN blocker_detected:
            1. CREATE_BLOCKER:
                GENERATE: BLK-{NNN} (unique ID)
                blocker:
                  blocker_id: "BLK-023"
                  detected_date: "2026-03-03T10:15:00Z"
                  detected_by: "HUMAN_REPORTED" | "AUTOMATIC"
                  affected_tasks: ["TASK-018-02", "TASK-018-04"]
                  blocker_type: EXTERNAL_DEPENDENCY | TECHNICAL | RESOURCE | KNOWLEDGE
                  description: "Auth0 API returning 503 (service down)"
                  impact: "Blocks 2 tasks (5 SP), affects critical path: NO"
                  workaround_available: "Use local auth (temporary)"
                  estimated_resolution_time: "Unknown (external service)"

            2. CLASSIFY_SEVERITY:
                CRITICAL (escalate immediately):
                  - Blocks >3 tasks
                  - OR affects critical path
                  - OR security/compliance blocker
                  - OR no workaround available

                HIGH (resolve within 24h):
                  - Blocks 1-3 tasks
                  - OR workaround available but costly

                MEDIUM (resolve within 3 days):
                  - Blocks 1 task
                  - AND workaround available

            3. ATTEMPT_RESOLUTION:
                FOR each blocker:
                  IF workaround_available:
                    EXECUTE: Workaround (temporary solution)
                    EXAMPLE: "Switch to local auth while Auth0 down"

                  IF external_dependency:
                    CONTACT: External provider
                    ESCALATE: If no ETA within 4 hours

                  IF technical_blocker:
                    ASSIGN: Tech Lead to investigate
                    SCHEDULE: Pairing session if complex

                  IF knowledge_blocker:
                    SCHEDULE: Knowledge transfer session
                    DOCUMENT: Knowledge for future

            4. ESCALATE_IF_UNRESOLVED:
                IF blocker_unresolved_for_24h AND severity = CRITICAL:
                  TRIGGER: deep-change (create change request)
                  OPTIONS:
                    - Alternative approach (workaround)
                    - Descope blocked tasks (remove from sprint)
                    - Delay sprint (wait for blocker resolution)

                  EXAMPLE (BLK-023):
                    CR-025: "Implement local auth fallback for Auth0 outage"
                    Impact: +3 days, +$8K
                    Benefit: Unblocks 2 tasks, resilience improvement

  day_7_mid_sprint_checkpoint:
    time: "Wednesday mid-sprint (14:00-15:00)"

    steps:
      1. REVIEW_PROGRESS:
          COMPUTE:
            - Progress: completed_story_points / total_story_points
            - Target: 50% at mid-sprint
            - Variance: actual - target

          example:
            total_story_points: 225
            completed: 95 SP (42%)
            target: 112.5 SP (50%)
            variance: -17.5 SP (-8%) → SLIGHTLY BEHIND

      2. FORECAST_COMPLETION:
          BASED ON: Current velocity
          COMPUTE:
            - Current velocity: 95 SP / 7 days = 13.6 SP/day
            - Remaining: 225 - 95 = 130 SP
            - Days needed: 130 / 13.6 = 9.6 days
            - Forecast completion: Day 7 + 9.6 = Day 16.6
            - Sprint end: Day 14
            - Forecast: WILL NOT COMPLETE (2.6 days over)

      3. DECIDE_ACTION:
          IF forecast_completion ≤ sprint_end:
            ACTION: Continue (on track)

          IF forecast_completion > sprint_end BUT <sprint_end + 2 days:
            ACTION: Mild concern, watch closely
            MITIGATION: Identify tasks for descope if velocity doesn't improve

          IF forecast_completion > sprint_end + 2 days:
            ACTION: ESCALATE to deep-govern
            OPTIONS:
              A: Descope lowest-priority tasks (cut 30 SP)
              B: Accept sprint overflow (extend by 2-3 days)
              C: Add resources (overtime, contractors)

          example_decision:
            Forecast: Day 16.6 (2.6 days over)
            Action: ESCALATE
            Recommendation: Descope 30 SP (lowest-priority tasks)
            Tasks to descope: [TASK-019-05, TASK-019-06, TASK-019-07]

  day_14_sprint_retrospective:
    time: "Friday end of sprint (14:00-16:00)"

    steps:
      1. REVIEW_OUTCOMES:
          COMPUTE:
            total_tasks: 42
            completed_tasks: 38 (90%)
            incomplete_tasks: 4 (10%)
            total_story_points: 225
            completed_story_points: 203 (90%)
            incomplete_story_points: 22 (10%)

          velocity_actual: 203 SP / 2 weeks

      2. ANALYZE_WHAT_WENT_WELL:
          DISCUSS: Successes, wins, positive surprises
          EXAMPLES:
            - "MFA integration smoother than expected (Auth0 easy)"
            - "Pairing sessions very effective (knowledge sharing)"
            - "Automated testing caught bugs early"

      3. ANALYZE_WHAT_WENT_WRONG:
          DISCUSS: Failures, blockers, pain points
          EXAMPLES:
            - "Auth0 outage blocked 2 tasks for 2 days (external dependency risk)"
            - "Underestimated SMS provider integration (third-party complexity)"
            - "Test environment unstable (caused rework)"

      4. EXTRACT_LESSONS_LEARNED:
          ACTIONABLE_IMPROVEMENTS:
            - "Add 30% buffer for third-party integrations (estimation)"
            - "Implement fallback for Auth0 (resilience improvement)" → CR-025
            - "Dedicate test environment to reduce instability" → CR-026

      5. CLASSIFY_INCOMPLETE_TASKS:
          FOR each incomplete_task:
            REASON:
              - BLOCKED: External blocker (carry to next sprint with blocker resolved)
              - DESCOPED: Intentionally descoped mid-sprint (defer to backlog)
              - UNDERESTIMATED: Task harder than expected (re-estimate, carry to next sprint)
              - LOW_PRIORITY: Ran out of time (defer to backlog)

      6. GENERATE_RETROSPECTIVE_REPORT:
          OUTPUT: sprint-retrospective-06.yaml

          content:
            sprint_id: "Sprint-06"
            sprint_goal: "Implement MFA and API Gateway rate limiting"
            sprint_goal_achieved: YES (core features completed)

            metrics:
              tasks_completed: 38/42 (90%)
              story_points_completed: 203/225 (90%)
              velocity: 203 SP / 2 weeks = 101.5 SP/week
              blockers_encountered: 3 (2 resolved, 1 escalated)

            outcomes:
              what_went_well:
                - "MFA integration smooth"
                - "Pairing sessions effective"
                - "Automated testing valuable"

              what_went_wrong:
                - "Auth0 outage (external dependency)"
                - "SMS provider underestimated"
                - "Test environment unstable"

              lessons_learned:
                - "Add 30% buffer for third-party integrations"
                - "Implement fallbacks for external dependencies"
                - "Stabilize test environment"

              action_items:
                - CR-025: "Auth0 fallback implementation" (HIGH priority)
                - CR-026: "Dedicated test environment" (MEDIUM priority)
                - Update estimation guidelines: "Third-party = +30%"

            incomplete_tasks:
              - task_id: TASK-019-05
                reason: BLOCKED (Auth0 outage)
                carry_to_sprint: "Sprint-07"

              - task_id: TASK-019-06
                reason: DESCOPED (mid-sprint decision)
                defer_to: "Backlog"

      7. PREPARE_NEXT_SPRINT:
          CARRY_OVER: Incomplete tasks (if not descoped)
          NOTIFY: deep-plan (velocity actual = 203 SP, update future estimates)
          REQUEST: sprint-backlog-07.yaml (next sprint)
```

---

### Mode 2: TASK EXECUTION (Individual Task)

```yaml
task_execution_detail:

  step_1_task_selection:
    HUMAN: Selects task from sprint backlog
    CRITERIA:
      - Dependencies satisfied (prerequisite tasks complete)
      - Resource available (person with right skills)
      - Highest priority first (within available tasks)

    process:
      UPDATE: task.status = CLAIMED
      NOTIFY: Team (visibility into who's working on what)

  step_2_task_understanding:
    HUMAN: Reads task description, DoD, acceptance criteria
    PROCESS: Provides context

    context_provided:
      - Task description: "What needs to be done"
      - Definition of Done: "When is it complete"
      - Acceptance criteria: "How to verify it works"
      - Dependencies: "What must be done first"
      - Related docs: Links to architecture, design docs

    AI_ASSISTANCE:
      - Explain task in simpler terms (if complex)
      - Provide implementation approach suggestions
      - Link to similar tasks completed before

  step_3_task_implementation:
    HUMAN: Writes code, configures, creates docs, writes tests
    MODE: AI-ASSISTED (AI suggests, human reviews and executes)

    ai_assistance_levels:

      level_1_guidance:
        - "Suggest implementation approach"
        - "Provide architecture pattern to follow"
        - "Link to relevant docs and examples"

      level_2_code_generation:
        - "Generate boilerplate code (class structure, API endpoints)"
        - "Generate test templates (given-when-then structure)"
        - "Generate configuration templates (K8s manifests)"

      level_3_implementation:
        - "Implement simple CRUD operations"
        - "Implement standard patterns (auth middleware, error handling)"
        - "Generate documentation from code"

    example_task_018_01 (Enable Auth0 MFA):

      step_3a_research:
        HUMAN: Reads Auth0 MFA documentation
        AI: Summarizes key steps from Auth0 docs

      step_3b_implementation:
        HUMAN: Logs into Auth0 dashboard
        HUMAN: Navigates to Security → Multi-factor Auth
        HUMAN: Enables MFA (TOTP, SMS)
        HUMAN: Configures MFA policy (require for all users)

      step_3c_verification:
        HUMAN: Tests MFA flow (create test user, enroll MFA, login)
        AI: Generates test cases (happy path, error cases)

      step_3d_documentation:
        HUMAN: Documents setup steps in README.md
        AI: Generates documentation template

  step_4_quality_validation:
    AUTOMATED_CHECKS (run before task completion):

      check_1_linting:
        TOOL: ESLint (JavaScript), Pylint (Python)
        PASS_CRITERIA: Zero errors, warnings acceptable
        IF_FAIL: Show errors, suggest fixes

      check_2_sast:
        TOOL: Semgrep (multi-language), Bandit (Python)
        PASS_CRITERIA: Zero CRITICAL or HIGH vulnerabilities
        IF_FAIL: HALT task, escalate to security team

      check_3_tests:
        TOOL: Pytest (Python), Jest (JavaScript)
        PASS_CRITERIA: All tests pass, coverage ≥80%
        IF_FAIL: Show failing tests, suggest fixes

      check_4_integration_tests:
        TOOL: Custom integration test suite
        PASS_CRITERIA: Critical paths work end-to-end
        IF_FAIL: Show failures, debug assistance

    HUMAN_CHECKS:

      check_5_code_review:
        REVIEWER: Peer (another team member)
        REVIEW_FOR:
          - Correctness: Does it work as intended?
          - Security: Any vulnerabilities?
          - Performance: Any obvious inefficiencies?
          - Maintainability: Is it readable, well-structured?
        PASS_CRITERIA: Reviewer approves (no blocking comments)

      check_6_definition_of_done:
        REVIEWER: Task owner (self-review)
        CHECKLIST:
          - Code written: YES
          - Tests written: YES (unit + integration)
          - Code reviewed: YES (peer approved)
          - Documentation: YES (README updated)
          - Quality gates: YES (all automated checks passed)
        PASS_CRITERIA: All checklist items YES

  step_5_task_completion:
    HUMAN: Marks task complete
    PROCESS:
      VERIFY: All quality checks passed
      UPDATE: task.status = COMPLETED
      RECORD: task.completed = timestamp
      COMPUTE: task.actual_duration = completed - started
      NOTIFY: deep-monitor, deep-govern
      OUTPUT: Append to task-completion-log.yaml

  step_6_task_handoff:
    IF task_has_dependent_tasks:
      NOTIFY: Assignees of dependent tasks (you can start now)
      TRANSFER: Outputs to dependent tasks (API contract, data schema, etc.)
```

---

### Mode 3: BLOCKER HANDLING (Problem Resolution)

```yaml
blocker_handling:

  blocker_types:

    type_1_external_dependency:
      example: "Auth0 API down (503 error)"
      detection: Automatic (HTTP errors) OR human-reported
      resolution_approach:
        1. CHECK: Status page (status.auth0.com)
        2. ESTIMATE: ETA for resolution (from status page)
        3. IF ETA_known AND <4h:
             WAIT: Resume when service restored
        4. IF ETA_unknown OR >4h:
             IMPLEMENT: Workaround (fallback to local auth)
             TRIGGER: deep-change (CR: Make fallback permanent)

    type_2_technical_blocker:
      example: "Database migration failing (foreign key constraint)"
      detection: Human-reported (error during task)
      resolution_approach:
        1. ASSIGN: Tech Lead OR senior engineer
        2. DEBUG: Root cause analysis (2-4 hours)
        3. IF fix_simple (<4 hours):
             FIX: Immediately
        4. IF fix_complex (>4 hours):
             TRIGGER: deep-change (CR: Alternative approach OR descope)

    type_3_resource_blocker:
      example: "Need security review but Security Engineer on vacation"
      detection: Human-reported (during task planning)
      resolution_approach:
        1. CHECK: Resource availability calendar
        2. IF available_soon (<2 days):
             DELAY: Task until resource available
        3. IF available_later (>2 days):
             REASSIGN: To another qualified person OR
             DEFER: Task to next sprint

    type_4_knowledge_blocker:
      example: "Don't know how to configure Kubernetes Ingress"
      detection: Human-reported (skill gap)
      resolution_approach:
        1. PAIR: With person who has knowledge (2-4 hours)
        2. DOCUMENT: Knowledge transfer (create guide)
        3. IF no_internal_knowledge:
             HIRE: Consultant (short-term) OR
             TRAINING: Team member (long-term)

  blocker_escalation:

    escalate_to_deep_change:
      WHEN:
        - Blocker unresolved for >24 hours AND severity = CRITICAL
        - OR: Blocker affects critical path
        - OR: No viable workaround

      CREATE: Change request
        - Type: BLOCKER_MITIGATION
        - Options: [Workaround, Alternative approach, Descope task, Delay sprint]
        - Recommendation: [Based on impact analysis]

      EXAMPLE (BLK-023: Auth0 down):
        CR-025: "Implement local auth fallback"
        Impact: +3 days, +$8K
        Benefit: Unblocks 2 tasks, improves resilience
        Recommendation: APPROVE (unblocks progress, strategic value)

    escalate_to_deep_govern:
      WHEN:
        - Blocker affects >5 tasks
        - OR: Blocker invalidates sprint goal
        - OR: Blocker requires strategic decision (pivot, halt, etc.)

      ESCALATE: With options and recommendation
```

---

## INTEGRATION WITH OTHER PROCESSES

```yaml
integration_points:

  consumes_from:
    - deep-plan:
        artifacts: sprint-backlog.yaml
        frequency: "Every 2 weeks (sprint start)"
        usage: "Tasks to execute in sprint"

    - deep-change:
        artifacts: approved-changes.yaml
        frequency: "Continuous"
        usage: "New tasks to add mid-sprint"

    - deep-architect:
        artifacts: architecture-comprehensive.md
        usage: "Reference for implementation"

  produces_for:
    - deep-monitor:
        artifacts: execution-status.yaml
        frequency: "Continuous"
        usage: "Real-time progress tracking"

    - deep-govern:
        artifacts: sprint-retrospective.yaml, blockers.yaml
        frequency: "Every 2 weeks, real-time"
        usage: "Sprint outcomes, escalations"

    - deep-change:
        artifacts: blockers.yaml, execution-challenges.yaml
        frequency: "Real-time, every 2 weeks"
        usage: "Trigger change requests"

    - deep-plan:
        artifacts: sprint-retrospective.yaml (velocity actual)
        frequency: "Every 2 weeks"
        usage: "Adaptive re-planning"

    - deep-verify:
        artifacts: deliverables/
        frequency: "Continuous"
        usage: "Validate quality"
```

---

## METRICS & KPIS

```yaml
execution_metrics:

  velocity:
    - sprint_velocity: "Story points completed per sprint"
      target: "225 SP/sprint (for 15 people)"
      measure: "Per sprint"

    - velocity_trend: "Velocity over last 3 sprints"
      target: "Stable or improving (±10%)"
      measure: "Every 3 sprints"

  quality:
    - defect_rate: "Bugs found in production / Tasks completed"
      target: "≤5%"
      measure: "Monthly"

    - rework_rate: "Tasks requiring rework / Total tasks"
      target: "≤10%"
      measure: "Per sprint"

  efficiency:
    - task_completion_rate: "Tasks completed / Tasks started"
      target: "≥90%"
      measure: "Per sprint"

    - blocker_resolution_time: "Time from blocker detection to resolution"
      target: "≤24 hours (CRITICAL), ≤3 days (HIGH)"
      measure: "Per blocker"

  estimation_accuracy:
    - estimation_variance: "Actual duration / Estimated duration"
      target: "0.8-1.2 (within ±20%)"
      measure: "Per task (retrospective)"
```

---

## EXAMPLES

### Example: Sprint 6 Execution

**Sprint Goal:** Implement MFA and API Gateway rate limiting

**Sprint Backlog:** 42 tasks, 225 SP

**Week 1:**
- Day 1: Sprint kickoff, team commits
- Day 2-4: 18 tasks completed (85 SP)
- Day 5: BLK-023 detected (Auth0 down, blocks 2 tasks)
- Day 5: Workaround implemented (local auth fallback)

**Week 2:**
- Day 7: Mid-sprint checkpoint (95 SP completed, forecast: will not complete)
- Day 7: Descope 3 tasks (30 SP) to fit sprint
- Day 8-13: 20 tasks completed (108 SP)
- Day 14: Sprint retrospective (38/42 tasks completed, 203 SP)

**Outcome:**
- Sprint goal: ACHIEVED (core features done)
- Velocity: 203 SP (90% of planned)
- Lessons: Add 30% buffer for third-party integrations

---

## ANTI-PATTERNS TO AVOID

```yaml
anti_patterns:

  AP-IMPLEMENT-001_no_definition_of_done:
    description: "Complete tasks without clear DoD"
    why_bad: "Quality varies, rework needed"
    instead: "Define DoD upfront, validate before marking complete"

  AP-IMPLEMENT-002_hero_culture:
    description: "One person does all critical tasks"
    why_bad: "Single point of failure, knowledge silos"
    instead: "Distribute knowledge, pair programming"

  AP-IMPLEMENT-003_ignore_blockers:
    description: "Work around blockers without escalating"
    why_bad: "Blockers compound, project derails"
    instead: "Escalate blockers within 24h"

  AP-IMPLEMENT-004_no_retrospective:
    description: "Skip retrospectives to save time"
    why_bad: "No learning, repeat same mistakes"
    instead: "Always do retrospectives, extract lessons"
```

---

## DEPENDENCIES

**Required processes:**
- deep-plan: Provides sprint backlog

**Optional but recommended:**
- deep-change: Receives blocker escalations, execution challenges
- deep-monitor: Receives execution status
- deep-govern: Receives retrospectives
- deep-verify: Validates deliverables

---

## NEXT STEPS

1. **Create workflow.md** - Sprint execution workflow
2. **Create steps/** - Detailed step files
3. **Test with example** - Simulate Sprint 1 execution
4. **Setup tracking tools** - Jira/Linear integration for task tracking
5. **Define quality gates** - Automated checks (SAST, linting, tests)

---

**Version:** 1.0
**Status:** DRAFT - Ready for implementation
**Author:** Claude (Sonnet 4.5)
**Date:** 2026-02-16
