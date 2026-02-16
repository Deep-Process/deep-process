# EXECUTIVE ORCHESTRATOR — RUNTIME GUIDE

**How it works in practice**

---

## TABLE OF CONTENTS

1. [Execution Flow Overview](#execution-flow-overview)
2. [Phase 3: Subprocess Invocation](#phase-3-subprocess-invocation)
3. [Translation Layer in Action](#translation-layer-in-action)
4. [State Persistence & Resume](#state-persistence--resume)
5. [Backlog Management](#backlog-management)
6. [Recursive Execution Pattern](#recursive-execution-pattern)
7. [Decision Handling](#decision-handling)
8. [Example: Complete Session](#example-complete-session)
9. [Troubleshooting](#troubleshooting)

---

## EXECUTION FLOW OVERVIEW

### High-Level Flow

```
User: /executive "Chcę stworzyć API dla e-commerce"
  ↓
Phase 1: INTAKE
  ├── Extract vision → "API dla e-commerce"
  ├── Ask constraints → budget, timeline, compliance
  ├── Declare goal → "Stworzyć API e-commerce z GDPR, timeline 2 miesiące"
  └── User confirms → GATE_1 opens
  ↓
Phase 2: PLAN (HIDDEN from user)
  ├── Decompose → requirements, architecture, implement, test, verify, deploy
  ├── Build backlog → 12 tasks
  ├── Identify decisions → database choice, deployment target
  └── GATE_2 opens
  ↓
Phase 3: EXECUTE (Main loop)
  ├── Select task → "Execute requirements gathering"
  ├── Display progress → "Progress: 10%. Current: Requirements..."
  ├── Invoke subprocess → deep-requirements
  ├── Translate output → "Requirements captured"
  ├── Mark done → task-001 DONE
  ├── Save snapshot → state saved
  └── REPEAT for all tasks
  ↓
Phase 4: VALIDATE
  ├── Load goal + deliverables
  ├── Calculate alignment → 92%
  ├── Classification → GOOD
  └── GATE_4 opens (alignment >= 90%)
  ↓
Phase 5: DELIVER
  ├── Generate executive summary
  ├── Package deliverables
  ├── Present to user (2 pages max)
  └── GATE_5 opens
  ↓
COMPLETE!
```

---

## PHASE 3: SUBPROCESS INVOCATION

### How Subprocesses Are Invoked

```yaml
# Phase 3 main loop (from phase-03-execute.md)

WHILE backlog has TODO tasks:

  # 1. SELECT NEXT TASK
  task = backlog_manager.select_next_task()

  IF task is null:
    # All done OR deadlock
    BREAK loop

  # 2. DISPLAY PROGRESS
  progress = backlog_manager.calculate_progress()

  progress_update = executive_interface.create_progress_update(
    goal = goal,
    current_task = task,
    backlog_state = backlog,
    recent_completed = last_3_tasks
  )

  DISPLAY to user: progress_update

  # 3. EXECUTE TASK
  IF task.type = SUBPROCESS_INVOCATION:

    # 3a. Load subprocess adapter
    subprocess_name = task.subprocess  # e.g., "deep-requirements"

    LOAD: subprocess-pool/{subprocess_name}/manifest.yaml
    EXTRACT:
      - inputs_required
      - outputs_produced
      - original_process location

    # 3b. Prepare inputs
    inputs = {}

    FOR EACH input IN inputs_required:
      # Locate artifact from previous tasks
      artifact = FIND artifact WHERE name = input

      IF artifact NOT found:
        MARK task as BLOCKED
        task.blocker = "Missing input: {input}"
        GOTO: handle_result

      inputs[input] = LOAD artifact

    # 3c. Invoke subprocess
    EXECUTE: subprocess-pool/{subprocess_name}/workflow.md

    # This workflow.md will:
    #   - Delegate to processes/{subprocess_name}
    #   - Provide inputs as context
    #   - Capture outputs
    #   - Return business summary + technical artifacts

    CAPTURE:
      technical_outputs = subprocess.artifacts
      business_summary = subprocess.business_summary

    # 3d. Translate to business terms
    business_description = translation_layer.output_to_business_value(
      technical_artifact = technical_outputs,
      artifact_type = task.subprocess,
      original_goal = goal
    )

    # 3e. Display to user (business level ONLY)
    formatted_summary = executive_interface.translate_subprocess_output(
      subprocess_name = subprocess_name,
      subprocess_technical_output = technical_outputs,
      subprocess_artifacts = technical_outputs.files,
      subprocess_decisions = technical_outputs.decisions
    )

    DISPLAY to user: formatted_summary
    # Example: "✓ Architecture design complete. Scalable 3-tier system."

    # 3f. Log technical details (HIDDEN from user)
    APPEND to execution-log.yaml:
      subprocess: {subprocess_name}
      technical_output: {full technical details}
      artifacts: {all files produced}
      timestamp: {now}
    # User never sees this log

    # 3g. Store outputs for next task
    FOR EACH output IN technical_outputs:
      SAVE: output to state/artifacts/{output_name}

    # 3h. Mark task complete
    task.state = DONE
    task.outputs_produced = [list of output names]

  # 4. SAVE STATE SNAPSHOT
  state_manager.save_snapshot(
    current_phase = "phase_3_execute",
    goal = goal,
    backlog_state = backlog,
    execution_log = log,
    last_completed_task = task,
    next_action = "Execute next task"
  )

  # 5. CHECK FOR USER INPUT
  IF user says "STOP":
    SAVE snapshot
    EXIT

  IF user says "change direction":
    GOTO: handle_direction_change

  # Loop continues...
```

---

## TRANSLATION LAYER IN ACTION

### How Technical → Business Translation Works

```yaml
# Example: deep-implement subprocess completed

TECHNICAL OUTPUT (from subprocess):
  artifacts:
    - UserService.java (432 lines)
    - UserRepository.java (156 lines)
    - UserController.java (287 lines)
    - AuthMiddleware.java (198 lines)
    - database_schema.sql (89 lines)

  decisions_made:
    - "Used JWT for authentication"
    - "Implemented CRUD operations"
    - "Added input validation"

  test_coverage: 95%

  complexity_metrics:
    cyclomatic_complexity: 12
    maintainability_index: 78

# TRANSLATION STEP 1: Identify artifact type
artifact_type = "code"

# TRANSLATION STEP 2: Apply translation rule
translation_rule = translation_layer.translation_patterns.pattern_1_capability_focus

# Rule: "Instead of 'implemented X', say 'created capability to Y'"

# TRANSLATION STEP 3: Extract business capabilities
FOR EACH artifact:
  UserService + UserRepository → "user management capability"
  UserController → "user API access"
  AuthMiddleware → "secure authentication"
  database_schema → "persistent data storage"

# TRANSLATION STEP 4: Format business summary
BUSINESS OUTPUT (to user):
  "✓ Implementation complete.

   Osiągnięcia:
   - Created user management capability
   - Added secure authentication
   - Implemented data persistence

   Wytworzone:
   - User API: Manage user accounts
   - Authentication: Secure access control
   - Database: Store user data safely

   Jakość: High-quality code (95% test coverage)"

# User never sees:
#  - Class names (UserService, UserRepository)
#  - Line counts (432 lines, 156 lines)
#  - Technical metrics (cyclomatic complexity)
#  - File names (.java files)
```

### Translation Glossary in Use

```yaml
# From translation-layer.yaml

technical_term → business_alternative:

"class UserService" → "user management capability"
"API endpoint /api/users" → "user data access"
"JWT authentication middleware" → "secure user authentication"
"PostgreSQL database with 5 tables" → "reliable data storage"
"React component with useState hook" → "interactive user interface"
"95% code coverage" → "high-quality implementation"
"Deployment to AWS EC2" → "system deployed and accessible"
```

---

## STATE PERSISTENCE & RESUME

### How Session Continuity Works

#### Save Snapshot (after each task)

```yaml
# From state-manager.yaml

TRIGGER: After task completion
ACTION: state_manager.save_snapshot()

PROCEDURE:
  1. Create snapshot object:
     snapshot:
       snapshot_id: "snap-2025-02-16-14-30-00"
       timestamp: "2025-02-16T14:30:00Z"
       current_phase: "phase_3_execute"
       goal: "Stworzyć API e-commerce..."
       completion_percentage: 42
       backlog_state:
         total_tasks: 12
         completed: 5
         in_progress: 0
         todo: 7
         tasks: [{full backlog}]
       execution_log: [{recent log entries}]
       last_completed_task:
         id: "task-005"
         name: "Execute architecture design"
         result: DONE
       next_action: "Execute implementation"

  2. Save to file:
     SAVE: state/snapshots/snap-2025-02-16-14-30-00.yaml

  3. Update current session:
     UPDATE: state/current-session.yaml
       last_snapshot_id: "snap-2025-02-16-14-30-00"
       status: ACTIVE
       updated_at: "2025-02-16T14:30:00Z"
```

#### Resume Session (after VSC reopen)

```yaml
# User reopens VSC days later, invokes: /executive

TRIGGER: /executive command
CHECK: state/current-session.yaml EXISTS?

IF EXISTS:
  # Resume flow

  1. Load last session:
     LOAD: state/current-session.yaml
     EXTRACT: last_snapshot_id = "snap-2025-02-16-14-30-00"

     LOAD: state/snapshots/snap-2025-02-16-14-30-00.yaml
     EXTRACT all state:
       - current_phase = "phase_3_execute"
       - goal = "Stworzyć API e-commerce..."
       - completion = 42%
       - next_action = "Execute implementation"

  2. Display resume prompt:
     DISPLAY to user:
       "Witaj ponownie!

        Ostatnia sesja: 2 dni temu

        Cel: Stworzyć API e-commerce z GDPR
        Faza: 3/5 (Execute) - 42% complete
        Ostatni task: Architecture design (done)
        Następny krok: Implementation

        Kontynuować? (tak/nie)"

  3. Wait for user response:
     IF user says "tak":
       RESTORE all state:
         - goal-declaration.yaml
         - constraints.yaml
         - backlog.yaml (with 5 DONE, 7 TODO)
         - execution-log.yaml

       JUMP to: phase-03-execute.md
       RESUME from: task-006 (implementation)

     IF user says "nie":
       DISPLAY: "Nowy cel OR modify obecny?"
       # Handle new/modify flow

ELSE:
  # New session flow
  GOTO: phase-01-intake.md section_new
```

---

## BACKLOG MANAGEMENT

### Dynamic Task Injection

```yaml
# Example: Test failure triggers task injection

SCENARIO:
  Task-008: "Test user authentication"
  Subprocess: deep-test
  Result: 3 tests FAIL

TRIGGER: backlog_manager.handle_test_failure()

PROCEDURE:
  1. Analyze failures:
     failed_tests = [
       {name: "test_password_validation", error: "AssertionError"},
       {name: "test_session_timeout", error: "TimeoutError"},
       {name: "test_token_refresh", error: "TokenExpiredError"}
     ]

  2. Create fix tasks:
     FOR EACH failed_test:
       fix_task = {
         task_id: "task-009" (auto-generated)
         task_name: "Fix: password validation"
         task_type: FIX
         parent_task: "task-007" (implementation task)
         issue: "AssertionError in password validation"
         state: TODO
         priority: HIGH
         estimated_effort: "30 minutes"
       }

       CREATE fix_task
       # task-009, task-010, task-011 created

  3. Inject into backlog:
     CURRENT backlog:
       task-007: Implementation [DONE]
       task-008: Testing [DONE but failed]
       task-009: Verification [TODO]

     INSERT fix tasks BEFORE task-008:
       task-007: Implementation [DONE]
       task-009: Fix password validation [TODO] ← INSERTED
       task-010: Fix session timeout [TODO] ← INSERTED
       task-011: Fix token refresh [TODO] ← INSERTED
       task-008: Testing [TODO] ← Changed to TODO (will retry)
       task-012: Verification [TODO]

  4. Update dependencies:
     task-008.dependencies = [task-009, task-010, task-011]
     # task-008 won't execute until fixes done

  5. Display to user (business level):
     "Tests detected 3 issues. Adding fix tasks.
      Will retest automatically after fixes."

  6. Continue execution:
     LOOP continues → select task-009 → execute fix → ... → retest
```

---

## RECURSIVE EXECUTION PATTERN

### Test Fail → Fix → Retest Loop

```
┌─────────────────────────────────────────┐
│ Execute Implementation (task-007)      │
│ → deep-implement subprocess             │
│ → Creates user authentication system    │
│ → Status: DONE                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Test Implementation (task-008)          │
│ → deep-test subprocess                  │
│ → Runs tests                            │
│ → Result: 3 FAIL ❌                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ RECURSIVE FIX PATTERN TRIGGERED         │
│ → Create 3 fix tasks (task-009-011)    │
│ → Inject BEFORE task-008                │
│ → Update task-008 dependencies          │
│ → Continue execution                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Execute Fix 1 (task-009)                │
│ → deep-implement fixes password issue   │
│ → Status: DONE                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Execute Fix 2 (task-010)                │
│ → deep-implement fixes timeout issue    │
│ → Status: DONE                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Execute Fix 3 (task-011)                │
│ → deep-implement fixes token issue      │
│ → Status: DONE                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ RETEST (task-008 retry)                 │
│ → deep-test subprocess                  │
│ → Runs tests again                      │
│ → Result: ALL PASS ✅                   │
│ → Status: DONE                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Continue to Next Task (task-012)        │
│ → Verification...                       │
└─────────────────────────────────────────┘
```

**User sees:**
```
Progress: 60%. Current: Testing
Tests detected 3 issues. Fixing automatically...
Progress: 65%. Current: Fixing password validation
Progress: 70%. Current: Fixing session timeout
Progress: 75%. Current: Fixing token refresh
Progress: 80%. Current: Retesting
✓ All tests passed. System validated.
Progress: 85%. Current: Verification
```

**User does NOT see:**
- Technical test failure details
- Fix implementation code
- Backlog manipulation
- Task injection mechanics

---

## DECISION HANDLING

### Critical Decision Flow

```yaml
# Scenario: Architecture phase needs database choice

TRIGGER: deep-architect subprocess identifies decision
DECISION_ID: "DECISION_ARCH_DATABASE"

PROCEDURE:
  1. Subprocess detects decision point:
     FROM: processes/deep-architect/workflow.md
     USER CHECKPOINT: "Database choice needed"

  2. Escalate to Executive Orchestrator:
     RETURN to Phase 3:
       decision_needed = TRUE
       decision = {
         id: "DECISION_ARCH_DATABASE",
         question: "Choose database: PostgreSQL vs MongoDB",
         options: [
           {name: "PostgreSQL", pros: [...], cons: [...]},
           {name: "MongoDB", pros: [...], cons: [...]},
         ],
         recommendation: "PostgreSQL",
         criticality: HIGH
       }

  3. Phase 3 checks criticality:
     IF criticality IN [CRITICAL, HIGH]:
       # User approval required
       INVOKE: executive_interface.format_decision_prompt()

  4. Translate to business terms:
     FROM: translation_layer.decision_to_impact()

     TECHNICAL decision:
       "PostgreSQL: ACID, strong consistency"
       "MongoDB: NoSQL, flexible schema"

     BUSINESS decision:
       "PostgreSQL (relational database)
        Korzyści: Data integrity, good for transactions
        Ryzyko: Schema changes need planning

        MongoDB (document database)
        Korzyści: Flexible structure
        Ryzyko: Less strict validation"

  5. Display to user:
     "Decyzja potrzebna:

      Cel: Stworzyć API e-commerce...

      Pytanie: Jak przechowywać dane?

      Opcja A: PostgreSQL (relational)
        ✓ Guarantees data integrity
        ✓ Good for financial/transaction data
        ⚠ Schema changes require planning

      Opcja B: MongoDB (document)
        ✓ Flexible data structure
        ✓ Easy to add new fields
        ⚠ Less strict data validation

      Rekomendacja: PostgreSQL (better for e-commerce)

      Wybierz: A | B"

  6. Wait for user decision:
     USER INPUT: "A"

  7. Record decision:
     APPEND to decisions_made:
       decision_id: "DECISION_ARCH_DATABASE"
       question: "Database choice"
       user_choice: "PostgreSQL"
       timestamp: "2025-02-16T15:00:00Z"
       rationale: "User selected based on recommendation"

  8. Resume subprocess with decision:
     CONTINUE: deep-architect subprocess
     PROVIDE: decision_result = "PostgreSQL"
     COMPLETE: architecture with PostgreSQL

  9. Continue execution:
     Architecture completes → next task
```

---

## EXAMPLE: COMPLETE SESSION

### Full execution from start to finish

```yaml
# User invokes: /executive "Chcę stworzyć API dla e-commerce z GDPR"

═══════════════════════════════════════════════════════════
 PHASE 1: INTAKE (5 minutes)
═══════════════════════════════════════════════════════════

User: /executive "Chcę stworzyć API dla e-commerce z GDPR"

System: "Rozumiem: API dla e-commerce, GDPR compliance.

         Kilka pytań o ograniczenia:

         1. Budget? (minimal/reasonable/flexible)"

User: "reasonable"

System: "2. Timeline? (kiedy gotowe?)"

User: "2 miesiące"

System: "3. Preferowane technologie?"

User: "Node.js, PostgreSQL"

System: "Podsumowanie:

         CEL: Stworzyć API e-commerce z GDPR compliance
         OGRANICZENIA:
         - Budget: reasonable
         - Timeline: 2 miesiące
         - Compliance: GDPR
         - Technologie: Node.js, PostgreSQL

         Poprawnie?"

User: "tak"

System: "✓ Cel zadeklarowany i zatwierdzony.
         Przechodzę do planowania..."

[GATE_1 opens]
[State saved: phase_1_complete]

═══════════════════════════════════════════════════════════
 PHASE 2: PLAN (2 minutes, HIDDEN from user)
═══════════════════════════════════════════════════════════

[System plans internally:]
  - Decomposes goal → 6 phases
  - Identifies subprocesses needed
  - Builds backlog → 12 tasks
  - Estimates effort → 8 hours
  - Detects decisions → database choice (already specified)
  - Saves: execution-plan.yaml, backlog.yaml

[GATE_2 opens]
[State saved: phase_2_complete]

System: "✓ Plan gotowy. 6 faz, 12 zadań. Rozpoczynam wykonanie..."

═══════════════════════════════════════════════════════════
 PHASE 3: EXECUTE (4-6 hours)
═══════════════════════════════════════════════════════════

# Task 1: Requirements gathering
System: "CEL: Stworzyć API e-commerce z GDPR

         Progress: 8% (1/12 tasks)

         Aktualnie: Requirements gathering
         Dlaczego: Need to capture what API must do

         Następny milestone: Architecture design"

[Subprocess: deep-requirements executes]
[Technical output captured, translated]

System: "✓ Requirements complete.

         Osiągnięcia:
         - Captured e-commerce API requirements
         - Defined GDPR compliance needs
         - Documented acceptance criteria

         Wytworzone:
         - Requirements specification"

[State saved: snapshot-001]

# Task 2: Architecture design
System: "Progress: 17% (2/12 tasks)

         Aktualnie: Architecture design
         Dlaczego: System structure before implementation"

[Subprocess: deep-architect executes]

System: "✓ Architecture complete.

         Osiągnięcia:
         - Designed scalable 3-tier API architecture
         - Selected PostgreSQL database (as specified)
         - Planned RESTful API structure

         Wytworzone:
         - Architecture specification
         - API design document"

[State saved: snapshot-002]

# Task 3-5: Implementation
System: "Progress: 25% (3/12 tasks)

         Aktualnie: Implementation
         Dlaczego: Building the actual API system"

[Subprocess: deep-implement executes - takes ~3 hours]
[Progress updates every 30 minutes]

System: "Progress: 35% (in progress)..."
System: "Progress: 45% (in progress)..."
System: "Progress: 55% (in progress)..."

System: "✓ Implementation complete.

         Osiągnięcia:
         - Created e-commerce API with product management
         - Implemented order processing capability
         - Added GDPR-compliant user data handling

         Wytworzone:
         - API server (Node.js)
         - Database schema (PostgreSQL)
         - GDPR compliance module"

[State saved: snapshot-003]

# Task 6: Testing
System: "Progress: 60% (6/12 tasks)

         Aktualnie: Testing
         Dlaczego: Validate system quality"

[Subprocess: deep-test executes]
[3 tests fail - triggers recursive fix]

System: "Tests detected 3 issues. Fixing automatically..."

[Tasks 7-9: Fix issues - auto-injected]
System: "Progress: 65%. Current: Fixing data validation"
System: "Progress: 70%. Current: Fixing session management"
System: "Progress: 75%. Current: Fixing GDPR consent"

[Task 6 retry: Retest]
System: "Progress: 80%. Current: Retesting"

System: "✓ All tests passed.

         Osiągnięcia:
         - System fully validated
         - All quality checks passed
         - High code quality confirmed"

[State saved: snapshot-004]

# Task 10: Verification
System: "Progress: 85% (10/12 tasks)

         Aktualnie: GDPR compliance verification"

[Subprocess: deep-verify executes]

System: "✓ Verification complete.

         Osiągnięcia:
         - GDPR compliance confirmed (98%)
         - Security validated
         - Code quality: excellent"

[State saved: snapshot-005]

# Task 11: Deployment
System: "Progress: 92% (11/12 tasks)

         Aktualnie: Deployment"

[Subprocess: deep-deploy executes]

System: "✓ Deployment complete.

         Osiągnięcia:
         - API deployed to cloud
         - Accessible at: https://api.example.com
         - Automated deployment configured"

[State saved: snapshot-006]

# Task 12: Final validation
System: "Progress: 100% (12/12 tasks)

         Aktualnie: Final validation"

System: "✓ Execution complete!

         Wykonane: 12/12 tasks (100%)

         Przechodzę do validation..."

[GATE_3 opens]
[State saved: phase_3_complete]

═══════════════════════════════════════════════════════════
 PHASE 4: VALIDATE (10 minutes)
═══════════════════════════════════════════════════════════

[System validates alignment]

System: "Walidacja: Alignment 94% (EXCELLENT)

         Cel był: Stworzyć API e-commerce z GDPR, 2 miesiące

         Osiągnięcia:
         ✓ E-commerce API created (products, orders, payments)
         ✓ GDPR compliance implemented (98% compliant)
         ✓ High-quality implementation (all tests pass)
         ✓ Deployed and accessible

         Alignment: 94% - EXCELLENT

         ✓ Validation passed. Przechodzę do delivery..."

[GATE_4 opens]
[State saved: phase_4_complete]

═══════════════════════════════════════════════════════════
 PHASE 5: DELIVER (5 minutes)
═══════════════════════════════════════════════════════════

[System generates executive summary]
[Packages deliverables]

System: [Displays 2-page executive summary]

         "═══════════════════════════════════════
          PROJEKT ZAKOŃCZONY
          ═══════════════════════════════════════

          CEL: Stworzyć API e-commerce z GDPR compliance
          STATUS: ✓ Osiągnięty (alignment: 94%)
          CZAS: 4.5 godziny (z 8h estimated)

          CO ZOSTAŁO ZROBIONE:

          ✓ Created e-commerce API
            - Product management (create, read, update, delete)
            - Order processing (cart, checkout, payment)
            - User authentication (secure login, sessions)

          ✓ Implemented GDPR compliance
            - User consent management
            - Data export capability
            - Right to deletion (right to be forgotten)
            - Audit logging

          ✓ Quality assurance
            - All tests passed (unit, integration, e2e)
            - Security validated
            - Performance optimized

          ✓ Deployment
            - API deployed to cloud
            - Accessible at: https://api.example.com
            - Automated deployment pipeline configured

          DELIVERABLES:

          ✓ E-commerce API (Node.js)
            - Product catalog management
            - Order processing system
            - Payment integration ready

          ✓ GDPR Module
            - User consent tracking
            - Data export/deletion tools
            - Audit logging system

          ✓ Documentation
            - API specification (OpenAPI)
            - Deployment guide
            - User manual

          ✓ Deployment artifacts
            - Automated deployment scripts
            - Rollback procedures
            - Monitoring setup

          TECHNOLOGIES USED:
          - Node.js (API server)
          - PostgreSQL (database)
          - Docker (containerization)
          - Cloud deployment

          SESSION METRICS:
          - Duration: 4.5 hours
          - Tasks completed: 12/12 (100%)
          - Alignment score: 94%
          - Quality: EXCELLENT

          NEXT STEPS:
          - API is live and ready for use
          - Monitor usage at https://api.example.com/health
          - Optional: Add additional features (recommendations available)

          ═══════════════════════════════════════

          Deliverables location: deliverables-package/

          Opcje:
          A) Start new session (new goal)
          B) Enhance current deliverables
          C) Close"

User: "C"

System: "✓ Session saved.

         Deliverables: deliverables-package/
         Resume: Use /executive to start new session

         Dziękuję!"

[GATE_5 opens]
[State saved: session_complete]
[Session archived]

═══════════════════════════════════════════════════════════
 COMPLETE!
═══════════════════════════════════════════════════════════
```

---

## TROUBLESHOOTING

### Common Issues & Solutions

#### Issue 1: Subprocess fails to invoke

**Symptoms:**
- Error: "Cannot find subprocess: deep-requirements"
- Task marked as BLOCKED

**Diagnosis:**
```bash
# Check subprocess exists
ls processes-executive/subprocess-pool/deep-requirements/

# Check manifest.yaml exists
cat processes-executive/subprocess-pool/deep-requirements/manifest.yaml

# Check original process exists
ls processes/deep-requirements/
```

**Solution:**
- Verify subprocess adapter exists in subprocess-pool/
- Verify original process exists in processes/
- Check manifest.yaml references correct path

---

#### Issue 2: Translation fails (technical jargon leaks to user)

**Symptoms:**
- User sees: "Implemented UserService class with CRUD operations"
- Should see: "Created user management capability"

**Diagnosis:**
- Check executive-interface.translate_subprocess_output() was called
- Check translation-layer.glossary contains term
- Check forbidden_terms list

**Solution:**
- Add missing term to translation glossary
- Update translation patterns
- Review executive-interface component

---

#### Issue 3: State not persisting

**Symptoms:**
- After VSC reopen, session not resumed
- "No previous session found"

**Diagnosis:**
```bash
# Check current-session.yaml exists
cat processes-executive/state/current-session.yaml

# Check snapshots directory
ls processes-executive/state/snapshots/
```

**Solution:**
- Verify state-manager.save_snapshot() is called after each task
- Verify state/ directory has write permissions
- Check snapshot files are being created

---

#### Issue 4: Recursive fix loop doesn't work

**Symptoms:**
- Tests fail but no fix tasks created
- System proceeds despite failures

**Diagnosis:**
- Check deep-test subprocess returned NEEDS_FIXES status
- Check backlog-manager.handle_test_failure() was called
- Check fix tasks were injected into backlog

**Solution:**
- Verify deep-test/workflow.md triggers recursive pattern
- Verify backlog-manager.inject_task() works
- Check task dependencies updated correctly

---

#### Issue 5: User sees too much technical detail

**Symptoms:**
- User sees code snippets, file names, technical metrics
- Violates "business communication only" principle

**Diagnosis:**
- executive-interface not filtering output
- subprocess returning raw output instead of business summary

**Solution:**
- Ensure subprocess workflow.md returns business_summary
- Verify executive-interface.translate_subprocess_output() is called
- Check executive-interface.enforce_communication_rules()

---

## PERFORMANCE NOTES

### Typical Execution Times

| Phase | Duration | Notes |
|-------|----------|-------|
| Phase 1: Intake | 5-10 min | User interaction time |
| Phase 2: Plan | 1-3 min | Automated, hidden |
| Phase 3: Execute | 4-8 hours | Varies by scope |
| Phase 4: Validate | 5-15 min | Automated validation |
| Phase 5: Deliver | 5-10 min | Summary generation |

### Optimization Tips

1. **Parallel execution** (if possible):
   - Some tasks can run in parallel
   - Reduces total execution time
   - Requires resource availability

2. **Incremental snapshots**:
   - Snapshot after each task (not every 5 minutes)
   - Balance: recoverability vs performance

3. **Subprocess caching**:
   - Cache subprocess results if reusable
   - Avoid re-running unchanged analyses

---

## CONCLUSION

This runtime guide demonstrates:
- ✅ How subprocess invocation works
- ✅ How translation layer filters technical details
- ✅ How state persistence enables resume
- ✅ How backlog management enables recursive execution
- ✅ How decision handling escalates to user
- ✅ Complete session example from start to finish

**Executive Orchestrator is ready for integration testing.**

---

# END RUNTIME-GUIDE.md
