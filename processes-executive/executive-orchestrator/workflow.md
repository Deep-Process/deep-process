# Executive Orchestrator — Workflow

## ENTRY POINT

```
User invokes: /executive "Chcę stworzyć [opis projektu]"

OR

User resumes: /executive (loads last session)
```

## EXECUTION FLOW

```
START
  ↓
[INTAKE] Phase 1: Extract vision, declare goal, confirm
  ↓ GATE_1: goal declared AND user approved
[PLAN] Phase 2: Create execution plan, build backlog (HIDDEN)
  ↓ GATE_2: plan exists AND backlog not empty
[EXECUTE] Phase 3: Execute backlog, report progress, adapt
  ↓ GATE_3: all tasks done/blocked AND blockers resolved
[VALIDATE] Phase 4: Check goal alignment, detect drift
  ↓ GATE_4: alignment >= 90% OR user accepted gap
[DELIVER] Phase 5: Package deliverables, save state
  ↓ GATE_5: summary exists AND state saved
END
```

---

## PHASE 1: INTAKE

**Purpose:** Extract user vision, declare goal, get confirmation.

**User sees:**
- Questions about vision, constraints, boundaries
- Proposed goal declaration
- Confirmation prompt

**Execution:**
1. IF resuming: LOAD last session, DISPLAY status, ASK "Kontynuować?"
2. IF new: ASK user vision ("Co chcesz stworzyć?")
3. EXTRACT: requirements, constraints, boundaries
4. DETECT: missing constraints, ASK for them
5. DECLARE: goal (business terms)
6. DISPLAY: "Cel: [goal]. Ograniczenia: [constraints]. Poprawnie?"
7. WAIT: user approval
8. SAVE: goal-declaration.yaml, constraints.yaml

**Output:** goal-declaration.yaml, constraints.yaml

**Gate:** User approved goal

---

## PHASE 2: PLAN (Hidden from user)

**Purpose:** Create technical execution plan.

**User sees:** Nothing (planning hidden)

**Execution:**
1. DECOMPOSE: goal into phases (requirements → architecture → implementation → testing → deployment)
2. IDENTIFY: which subprocesses needed (deep-requirements, deep-architect, etc.)
3. CREATE: backlog with all tasks
4. ESTIMATE: effort per task
5. DETECT: critical decisions needing user input
6. PLAN: execution order (respect dependencies)
7. SAVE: execution-plan.yaml, backlog.yaml, decision-points.yaml

**Output:** execution-plan.yaml, backlog.yaml

**Gate:** Plan exists AND backlog not empty

---

## PHASE 3: EXECUTE (Main execution)

**Purpose:** Execute backlog, report progress, ask critical decisions, adapt to changes.

**User sees:**
- Goal reminder (always)
- Progress updates after each task
- Decision prompts (when critical decision needed)
- Adaptive responses to user direction changes

**Execution:**

```
FOR EACH task IN backlog:

  1. DISPLAY goal reminder
  2. DISPLAY progress update (brief)

  3. EXECUTE task:
     - IF task requires subprocess:
         INVOKE subprocess (e.g., deep-implement)
         CAPTURE output
         TRANSLATE to business terms
     - IF task is direct action:
         EXECUTE directly

  4. UPDATE backlog status (TODO → IN_PROGRESS → DONE/BLOCKED)

  5. SAVE state snapshot

  6. IF critical decision needed:
       FORMAT decision prompt (business terms)
       PRESENT options with impact on goal
       WAIT user decision
       UPDATE plan based on decision
       CONTINUE

  7. IF user changes direction ("teraz chcę coś innego"):
       LOAD new vision
       RECALCULATE impact on plan
       UPDATE goal-declaration.yaml
       REBUILD backlog
       DISPLAY: "Nowy cel: [goal]. Plan zaktualizowany."
       CONTINUE with new direction

  8. IF tests fail (recursive):
       ADD to backlog: "Fix [failing test]"
       PRIORITIZE: high
       EXECUTE fix task
       RETEST
       REPEAT until pass

  9. IF blocker detected:
       MARK task as BLOCKED
       IDENTIFY blocker
       PRESENT to user: "Blocked: [reason]. Opcje: A) Fix B) Skip C) Cancel"
       WAIT user decision

  10. NEXT task

WHEN all tasks done/blocked with resolved blockers:
  PROCEED to Phase 4
```

**Output:** execution-log.yaml, progress-updates/, state-snapshots/

**Gate:** All tasks DONE/BLOCKED AND blockers resolved

---

## PHASE 4: VALIDATE

**Purpose:** Validate that output aligns with declared goal.

**User sees:**
- Alignment report
- If misalignment: gap explanation and options

**Execution:**
1. LOAD: original goal from goal-declaration.yaml
2. ANALYZE: final artifacts produced in Phase 3
3. CHECK: Does output achieve goal?
4. CALCULATE: alignment score (0-1)
5. DETECT: goal drift (did goal change during execution?)

6. IF alignment >= 0.9:
     PROCEED to delivery

7. IF alignment < 0.9:
     IDENTIFY: gap between goal and output
     PRESENT: "Cel był: [goal]. Output jest: [summary]. Gap: [gap description]."
     ASK: "Opcje: A) Accept output B) Add tasks to close gap C) Revise goal"

     IF user chooses A (accept):
       MARK user_accepted_gap = true
       PROCEED to delivery

     IF user chooses B (add tasks):
       UPDATE backlog with gap-closing tasks
       RETURN to Phase 3 (execute)

     IF user chooses C (revise goal):
       UPDATE goal-declaration.yaml
       RETURN to Phase 2 (re-plan)

**Output:** validation-report.yaml, alignment-score.yaml

**Gate:** alignment >= 90% OR user accepted gap

---

## PHASE 5: DELIVER

**Purpose:** Package deliverables, generate executive summary, save session.

**User sees:**
- Executive summary (2 pages max)
- Deliverables package
- Next action prompt

**Execution:**
1. GENERATE: executive summary (use template)
   - What was done (business impact)
   - Key decisions made
   - Deliverables produced
   - Alignment with goal
   - Next steps (if any)

2. PACKAGE: all deliverables
   - Code/artifacts produced
   - Documentation
   - Test results (summary)
   - Deployment artifacts

3. SAVE: complete session state
   - session-complete.yaml
   - All artifacts
   - Execution log
   - State snapshots

4. DISPLAY: executive summary to user

5. ASK: "Kontynuować z nowym celem OR zakończyć?"
   - IF new goal: RETURN to Phase 1
   - IF done: END

**Output:** executive-summary.md, deliverables-package/, session-complete.yaml

**Gate:** Summary exists AND state saved

---

## STATE PERSISTENCE (Continuity)

**Snapshots saved:**
- After each phase completion
- Before critical decisions
- On user request
- On error

**Snapshot contains:**
- current_phase
- goal-declaration.yaml
- backlog.yaml (current state)
- execution-log.yaml
- last_decision
- next_action

**Resume protocol:**
```
User opens VSC after closing:

LOAD: last snapshot from state/sessions/

DISPLAY:
  "Witaj ponownie!
   Ostatnia sesja: [timestamp]
   Cel: [goal]
   Faza: [current_phase]
   Status: [completion %]
   Następny krok: [next_action]

   Kontynuować?"

IF user says YES:
  RESUME from snapshot
  CONTINUE execution

IF user says NO:
  OFFER: "Nowy cel OR modify current?"
```

---

## GOAL TRACKING (Always Visible)

**Goal displayed:**
- Before each phase
- In every progress update
- In every decision prompt
- In executive summary
- After completing tasks

**Goal validation:**
- After each phase
- In Phase 4 (dedicated validation)
- When user changes direction

**Goal drift detection:**
- Compare current output trend with original goal
- If alignment drops below 80%: ALERT user
- Ask: "Kontynuować OR skorygować?"

---

## ADAPTATION SCENARIOS

### Scenario 1: User Changes Direction Mid-Flight

```
User: "Teraz chcę coś innego - zamiast web app zrób CLI tool"

Process:
  1. CAPTURE new vision
  2. COMPARE with current plan
  3. IDENTIFY: what can be reused, what must be discarded
  4. PRESENT impact:
       "Zmiana kierunku z web app na CLI.
        Reusable: [list]
        Discarded: [list]
        New effort: [estimate]
        Kontynuować?"
  5. IF yes:
       UPDATE goal-declaration.yaml
       REBUILD backlog
       MARK obsolete tasks as CANCELLED
       ADD new tasks
       CONTINUE from current position
```

### Scenario 2: Tests Fail (Recursive Fix)

```
EXECUTE: deep-test subprocess
RESULT: 5 tests fail

Process:
  1. CAPTURE failure details
  2. FOR EACH failed test:
       ADD to backlog: "Fix test: [test name]"
       PRIORITIZE: high
  3. EXECUTE fix tasks
  4. RETEST
  5. IF still failing: REPEAT
  6. IF passing: CONTINUE to next task
```

### Scenario 3: Critical Decision Needed

```
During architecture phase:
  Subprocess identifies: "Database choice needed"

Process:
  1. DETECT: this is critical decision (affects goal significantly)
  2. FORMAT decision prompt:
       "Potrzebuję wybrać bazę danych.

        Opcja A: PostgreSQL (relational)
          Pros: [business impact]
          Cons: [business impact]

        Opcja B: MongoDB (document)
          Pros: [business impact]
          Cons: [business impact]

        Rekomendacja: PostgreSQL (better for [goal aspect])

        Którą wybrać?"
  3. WAIT user decision
  4. RECORD decision
  5. UPDATE plan
  6. CONTINUE
```

### Scenario 4: User Resumes After Days

```
User closed VSC 3 days ago, opens now:

Process:
  1. LOAD last snapshot (session-047.yaml)
  2. DISPLAY:
       "Witaj ponownie!
        Ostatnia sesja: 3 dni temu

        Cel: System CRM dla małej firmy
        Faza: 3/5 (Execute) - 75% complete
        Ostatni task: Dashboard UI (in progress)
        Następny krok: Dokończyć dashboard, potem email notifications

        Kontynuować od dashboard?"
  3. WAIT user response
  4. IF yes: RESUME execution
  5. IF no: OFFER modify or new goal
```

---

## ERROR HANDLING

All errors use handlers from manifest.yaml.

**Common errors:**
- missing_input → ASK user
- invalid_input → EXPLAIN + REQUEST correction
- partial_completion → IDENTIFY blockers, PRESENT options
- timeout → SAVE state, ASK user to continue
- user_cancellation → SAVE state immediately

---

## SUBPROCESS INTEGRATION

**Subprocesses available:**
- deep-requirements
- deep-architect
- deep-implement
- deep-test
- deep-verify
- deep-deploy

**Invocation:**
1. Subprocess executed in subprocess-pool/
2. Technical output captured
3. Output TRANSLATED to business terms
4. Business summary presented to user
5. Technical details logged (hidden)

**Example:**
```
Task: "Design architecture"

Process:
  1. INVOKE: deep-architect subprocess
  2. CAPTURE: architecture.yaml (technical)
  3. TRANSLATE:
       "Architecture designed: 3-tier web application
        - Frontend: React
        - Backend: Node.js + PostgreSQL
        - Deployment: Docker containers

        This supports goal: [how it serves goal]"
  4. DISPLAY: translated summary (not raw architecture.yaml)
  5. LOG: architecture.yaml to execution-log (for later reference)
```

---

## METRICS & TRACKING

**Tracked automatically:**
- Goal alignment score (per phase)
- Backlog completion (%)
- Blockers count
- Critical decisions count
- Session duration
- Phase durations

**Visible to user:**
- Overall completion %
- Current phase
- Goal alignment
- Blockers (if any)

**Hidden from user:**
- Detailed task metrics
- Subprocess execution times
- Technical complexity scores

---

## COMPLIANCE WITH 14 GUIDELINES

This workflow enforces all 14 guidelines:

1. **Self-contained** - Each phase loads only needed data
2. **Completeness** - Backlog must be complete, filtered through summaries
3. **Mechanism not intention** - All rules = trigger + action
4. **Binding gates** - 5 gates block progression
5. **Assumptions before action** - Phase 1 declares before Phase 2 plans
6. **Enforced sequence** - Phases 1→2→3→4→5, cannot skip
7. **Checklist after phase** - Each gate = checklist
8. **Counter-check** - Phase 4 validates goal alignment
9. **Executive language** - Imperative verbs throughout
10. **Visible reasoning** - Execution log + summaries
11. **Instruction + min data** - Just-in-time loading
12. **Info at moment of use** - Data per phase
13. **Zero decorations** - Only executable mechanisms
14. **YAML frontmatter** - All artifacts use frontmatter

---

# END workflow.md
