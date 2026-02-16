# Deep-Test Subprocess — Wrapper

> Delegates to processes/deep-test
> Enables recursive fix pattern (test fail → fix → retest)

---

## ENTRY POINT

```yaml
Invoked by: Executive Orchestrator Phase 3
Task type: SUBPROCESS_INVOCATION
Subprocess: deep-test
Trigger: After deep-implement completes
```

---

## INPUTS (from Executive Orchestrator)

```yaml
REQUIRED:
  - implementation_artifacts: Code from deep-implement subprocess
  - requirements_document: Acceptance criteria (from deep-requirements)
  - test_scope: What to test (unit, integration, e2e, all)

CONTEXT:
  - architecture_document: For integration test context
  - constraints: Performance targets, etc.
```

---

## EXECUTION PATTERN

```yaml
1. PREPARE TEST ENVIRONMENT:
   LOAD: implementation artifacts
   LOAD: requirements.yaml (acceptance criteria)
   LOAD: test_scope (from task definition)

   IDENTIFY: what to test
     IF test_scope = "unit": Run unit tests only
     IF test_scope = "integration": Run integration tests
     IF test_scope = "e2e": Run end-to-end tests
     IF test_scope = "all": Run all tests

2. DELEGATE TO ORIGINAL PROCESS:
   LOCATION: ../../../processes/deep-test/

   LOAD: process.yaml
   EXECUTE: steps in sequence

   FOR EACH test step:
     RUN tests
     CAPTURE results
     ANALYZE failures

3. CAPTURE OUTPUTS:
   FROM: ../../../processes/deep-test/artifacts/

   EXPECTED ARTIFACTS:
     - test_results.yaml (pass/fail summary)
     - test_coverage_report.yaml
     - failed_tests.yaml (if any)
     - test_log.yaml

4. ANALYZE RESULTS:

   CALCULATE:
     total_tests = COUNT all tests
     passed_tests = COUNT WHERE result = PASS
     failed_tests = COUNT WHERE result = FAIL
     pass_rate = (passed_tests / total_tests) * 100

   CLASSIFY outcome:
     IF pass_rate = 100%:
       outcome = SUCCESS
       action = PROCEED

     IF 80% <= pass_rate < 100%:
       outcome = PARTIAL_SUCCESS
       action = REPORT_FAILURES

     IF pass_rate < 80%:
       outcome = FAILURE
       action = TRIGGER_RECURSIVE_FIX

5. HANDLE OUTCOME:

   IF outcome = SUCCESS:
     TRANSLATE to business:
       "All tests passed - implementation validated"

     RETURN: SUCCESS

   IF outcome = PARTIAL_SUCCESS OR FAILURE:
     TRIGGER: recursive fix pattern

     FOR EACH failed_test IN failed_tests:
       CREATE fix_task:
         task_name: "Fix test: {failed_test.name}"
         task_type: FIX
         issue: {failed_test.error}
         parent_task: {current_implementation_task}
         priority: HIGH

       INJECT fix_task into backlog
         INSERT: BEFORE current implementation task

     UPDATE: current implementation task
       state: TODO (will retry after fixes)
       dependencies: [all fix_task_ids]

     TRANSLATE to business:
       "{count} issues detected - adding fix tasks to backlog"

     RETURN: NEEDS_FIXES (not an error - normal recursive flow)

6. FORMAT BUSINESS SUMMARY:

   IF outcome = SUCCESS:
     business_summary:
       subprocess: "Testing"
       status: "Complete"
       achievements:
         - "All tests passed ({total_tests} tests)"
         - "Code quality validated"
         - "Ready for deployment"
       business_value:
         "High-quality implementation confirmed"

   IF outcome = NEEDS_FIXES:
     business_summary:
       subprocess: "Testing"
       status: "Issues detected"
       achievements:
         - "Ran {total_tests} tests"
         - "Identified {failed_count} issues"
         - "Creating fix tasks"
       next_action:
         "Will fix issues and retest automatically"
       business_value:
         "Quality assurance caught issues before deployment"

7. RETURN TO EXECUTIVE ORCHESTRATOR:

   OUTPUTS:
     - test_results.yaml (technical)
     - business_summary (for user)
     - fix_tasks (if outcome = NEEDS_FIXES)

   LOG:
     - Test details to execution-log.yaml (hidden)
```

---

## RECURSIVE FIX PATTERN

```yaml
This subprocess enables the core recursive execution pattern:

EXECUTE implementation
  ↓
RUN tests
  ↓
TESTS FAIL?
  ↓ YES
CREATE fix tasks
  ↓
INJECT into backlog BEFORE implementation
  ↓
EXECUTE fix tasks
  ↓
RETEST (call deep-test again)
  ↓
TESTS PASS?
  ↓ YES
CONTINUE
```

### Example Flow:

```
1. Task: "Implement user authentication"
   → deep-implement creates auth system
   → Status: DONE

2. Task: "Test user authentication"
   → deep-test runs tests
   → Result: 3 tests fail

3. deep-test creates fix tasks:
   → "Fix: Password validation test"
   → "Fix: Session timeout test"
   → "Fix: Token refresh test"

4. Backlog updated:
   [Fix password validation] TODO
   [Fix session timeout] TODO
   [Fix token refresh] TODO
   [Implement user authentication] TODO ← Retry after fixes
   [Other tasks...] TODO

5. Execute fix tasks:
   → deep-implement fixes issues
   → All 3 fixes complete

6. Retry original task:
   → deep-test runs tests again
   → Result: ALL PASS ✓

7. Continue to next task
```

---

## ERROR HANDLING

```yaml
IF test execution fails (not test failures, but execution error):
  CLASSIFY: error_type

  IF test_environment_error:
    ERROR: "Test environment setup failed"
    FIX: Verify dependencies, configuration
    RETRY: After environment fix

  IF timeout:
    SAVE: partial test results
    MARK: task as IN_PROGRESS
    NOTIFY: user about timeout

  IF resource_exhaustion:
    ERROR: "Insufficient resources for testing"
    OPTION: Reduce test scope OR increase resources
    ESCALATE: to user for decision
```

---

## BUSINESS TRANSLATION EXAMPLES

### Example 1: All Tests Pass
```
TECHNICAL:
  "Unit tests: 147/147 passed (100%)"
  "Integration tests: 23/23 passed (100%)"
  "E2E tests: 8/8 passed (100%)"
  "Coverage: 95%"

BUSINESS:
  "All tests passed - implementation fully validated"
  "High-quality code with comprehensive testing"
  "Ready for next phase"
```

### Example 2: Some Tests Fail
```
TECHNICAL:
  "Unit tests: 144/147 passed (97.9%)"
  "Failed tests:"
  "  - test_user_auth_invalid_token (AssertionError)"
  "  - test_session_timeout (TimeoutError)"
  "  - test_password_validation (ValidationError)"

BUSINESS:
  "Tests identified 3 issues in authentication system"
  "Adding fix tasks to backlog"
  "Will retest automatically after fixes"
```

---

## VALIDATION

```yaml
BEFORE returning:

CHECK 1: test_results.yaml EXISTS
CHECK 2: test_results.yaml contains:
  - total_tests (number > 0)
  - passed_tests (number)
  - failed_tests (number)
  - pass_rate (0-100)

CHECK 3: IF failed_tests > 0:
  - failed_tests.yaml EXISTS
  - Contains failure details

IF any check fails:
  ERROR: "Test subprocess produced invalid output"
  ESCALATE: to user

IF all checks pass:
  RETURN: outcome (SUCCESS or NEEDS_FIXES)
```

---

## INTEGRATION WITH BACKLOG-MANAGER

```yaml
When tests fail, this subprocess calls backlog-manager:

backlog_manager.handle_test_failure(
  failed_tests = [
    {name: "test_auth", error: "AssertionError"},
    {name: "test_timeout", error: "TimeoutError"}
  ],
  original_task_id = "task-015"
)

backlog_manager will:
  1. CREATE fix tasks
  2. INSERT BEFORE task-015
  3. UPDATE task-015 dependencies
  4. RETURN fix_task_ids

Then deep-test returns to Phase 3 with:
  outcome = NEEDS_FIXES
  fix_tasks = [task-016, task-017]
```

---

## NOTES

- This subprocess is CRITICAL for quality assurance
- Test failures are NOT user-facing errors
- User sees: "Fixing detected issues..." (business level)
- Recursive fix pattern is AUTOMATIC
- Can retry indefinitely until tests pass OR user cancels

---

# END workflow.md
