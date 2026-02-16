# Deep-Requirements Subprocess — Wrapper

> Delegates to processes/deep-requirements
> Translates outputs to business terms for Executive Orchestrator

---

## ENTRY POINT

```yaml
Invoked by: Executive Orchestrator Phase 3
Task type: SUBPROCESS_INVOCATION
Subprocess: deep-requirements
```

---

## INPUTS (from Executive Orchestrator)

```yaml
REQUIRED:
  - goal_declaration: From Phase 1 (goal-declaration.yaml)
  - constraints: From Phase 1 (constraints.yaml)
  - user_vision: Original user vision statement

CONTEXT:
  - session_id: Current session identifier
  - backlog_context: What other tasks are planned
```

---

## EXECUTION PATTERN

```yaml
1. PREPARE CONTEXT:
   LOAD: goal-declaration.yaml
   LOAD: constraints.yaml
   EXTRACT:
     - goal statement (business level)
     - budget, timeline, compliance constraints
     - technology preferences
     - target audience

2. DELEGATE TO ORIGINAL PROCESS:
   LOCATION: ../../../processes/deep-requirements/

   IF process.yaml EXISTS:
     LOAD: process.yaml
     EXECUTE: steps defined in process.yaml

     FOR EACH step:
       PROVIDE context: {goal, constraints, vision}
       EXECUTE step
       CAPTURE outputs

   ELSE IF steps/ directory EXISTS:
     EXECUTE: steps in sequence
     step-00 → step-01 → ... → step-N

3. CAPTURE OUTPUTS:
   FROM: ../../../processes/deep-requirements/artifacts/

   EXPECTED ARTIFACTS:
     - requirements.yaml (structured requirements)
     - functional_requirements.yaml
     - non_functional_requirements.yaml
     - acceptance_criteria.yaml

4. TRANSLATE TO BUSINESS TERMS:

   Technical artifacts → Business value:

   "50 functional requirements, 15 quality attributes" →
   "Requirements captured: user management, data processing, reporting, etc."

   "Performance: <2s response time, 1000 concurrent users" →
   "System designed for fast response and high user capacity"

5. FORMAT BUSINESS SUMMARY:

   business_summary:
     subprocess: "Requirements Gathering"
     status: "Complete"
     achievements:
       - "Captured {X} functional requirements"
       - "Defined {Y} quality attributes"
       - "Documented acceptance criteria"
     artifacts_for_next_phase:
       - requirements.yaml (for deep-architect)
     business_value:
       "Converted business vision into structured, actionable requirements"

6. RETURN TO EXECUTIVE ORCHESTRATOR:

   OUTPUTS:
     - requirements.yaml (technical - for next subprocess)
     - business_summary (for user display)

   LOG:
     - Technical details to execution-log.yaml (hidden from user)
```

---

## ERROR HANDLING

```yaml
IF process execution fails:
  CAPTURE: error details
  CLASSIFY: error type

  IF missing_input:
    ERROR: "Missing required input: {input_name}"
    ESCALATE to Executive Orchestrator
    MARK task as BLOCKED

  IF invalid_input:
    ERROR: "Invalid goal or constraints format"
    ESCALATE to user
    REQUEST clarification

  IF partial_completion:
    CAPTURE: what was completed
    MARK: incomplete areas
    CREATE: fix task for missing parts

  IF timeout:
    SAVE: progress so far
    MARK: task as IN_PROGRESS (resumable)
    NOTIFY: user about timeout
```

---

## BUSINESS TRANSLATION EXAMPLES

### Example 1: Functional Requirements
```
TECHNICAL:
  "FR-001: User shall authenticate via email/password"
  "FR-002: System shall support CRUD operations on entities"
  "FR-003: Admin shall manage user permissions"

BUSINESS:
  "User login and security capabilities"
  "Data management functionality"
  "Administrative controls"
```

### Example 2: Non-Functional Requirements
```
TECHNICAL:
  "NFR-001: Response time < 2s for 95% of requests"
  "NFR-002: Support 1000 concurrent users"
  "NFR-003: 99.9% uptime"

BUSINESS:
  "Fast, responsive system"
  "Handles high user traffic"
  "Highly reliable"
```

---

## SUBPROCESS INVOCATION

```yaml
# How Executive Orchestrator invokes this wrapper:

Phase 3 Execute:
  task = select_next_task()

  IF task.type = SUBPROCESS_INVOCATION:
    IF task.subprocess = "deep-requirements":

      # Load this wrapper
      EXECUTE: subprocess-pool/deep-requirements/workflow.md

      # Provide inputs
      PROVIDE:
        goal_declaration: state/goal-declaration.yaml
        constraints: state/constraints.yaml
        user_vision: from intake

      # Capture outputs
      RECEIVE:
        requirements.yaml → state/artifacts/
        business_summary → display to user

      # Mark complete
      UPDATE: task.state = DONE
      UPDATE: task.outputs_produced = ["requirements.yaml"]
```

---

## VALIDATION

```yaml
BEFORE returning:

CHECK 1: requirements.yaml EXISTS
CHECK 2: requirements.yaml is valid YAML
CHECK 3: requirements.yaml contains:
  - functional_requirements (array, not empty)
  - non_functional_requirements (array)
  - acceptance_criteria (array)

IF any check fails:
  ERROR: "Requirements subprocess produced invalid output"
  RETURN: partial_completion error

IF all checks pass:
  RETURN: SUCCESS with artifacts
```

---

## NOTES

- This wrapper is HIDDEN from user
- User sees only business summary via executive-interface
- Technical requirements.yaml saved for deep-architect subprocess
- Can be invoked standalone OR via Executive Orchestrator

---

# END workflow.md
