# PHASE 5: DELIVERY & CLOSURE

## PRECONDITION
```
GATE_4 = OPEN
validation passed
alignment confirmed
deliverables produced
```

## PURPOSE
```
Package deliverables.
Generate executive summary.
Save complete session state.
Present to user in business terms.
Determine next action.
```

## ENFORCED SEQUENCE
```
1. COLLECT_DELIVERABLES
2. GENERATE_EXECUTIVE_SUMMARY
3. PACKAGE_ARTIFACTS
4. SAVE_SESSION_STATE
5. PRESENT_TO_USER
6. DETERMINE_NEXT_ACTION
7. GATE_5
```

---

## 1. COLLECT_DELIVERABLES

```yaml
LOAD: execution-log.yaml
LOAD: validation-report.yaml

IDENTIFY all deliverables produced during Phase 3:

  deliverables = []

  FOR EACH entry IN execution_log:
    IF entry.type = DELIVERABLE:
      ADD to deliverables:
        name: {entry.artifact_name}
        type: {entry.artifact_type}
        location: {entry.path}
        produced_by: {entry.task_id}
        timestamp: {entry.timestamp}
        business_description: {translate to business value}

CATEGORIZE deliverables:

  PRIMARY (core goal fulfillment):
    FOR EACH deliverable WHERE criticality = HIGH:
      ADD to primary_deliverables

  SUPPORTING (enables primary):
    FOR EACH deliverable WHERE type IN [DOCUMENTATION, TESTS, CONFIG]:
      ADD to supporting_deliverables

  TECHNICAL (implementation artifacts):
    FOR EACH deliverable WHERE type IN [CODE, SCRIPTS]:
      ADD to technical_deliverables

VERIFY deliverables completeness:

  LOAD: goal-declaration.yaml

  FOR EACH goal_component IN goal:
    CHECK: Does at least one deliverable serve this component?

    IF NO:
      WARNING: "Goal component not addressed: {component}"
      # This should have been caught in Phase 4, but double-check

STORE:
  primary_deliverables[]
  supporting_deliverables[]
  technical_deliverables[]
```

---

## 2. GENERATE_EXECUTIVE_SUMMARY

```yaml
INPUT:
  - goal-declaration.yaml
  - validation-report.yaml
  - execution-log.yaml
  - deliverables[]

LOAD: templates/executive-summary.yaml

FILL template sections:

  SECTION 1: Goal & Outcome
    original_goal: {goal from goal-declaration.yaml}
    achieved: {YES | MOSTLY | PARTIALLY}
    alignment_score: {from validation-report.yaml}

    outcome_statement:
      "Cel: {goal}
       Status: {achieved} (alignment: {score}%)
       {IF drift_detected: Note: Goal evolved during execution}"

  SECTION 2: What Was Done (Business Level)

    EXTRACT key achievements from execution_log:
      # NOT technical tasks - business outcomes

      EXAMPLE:
        NOT: "Implemented UserService class"
        BUT: "Created user management capability"

      SELECT top 5 achievements by business impact:
        FOR EACH deliverable IN primary_deliverables:
          DESCRIBE in business terms:
            - What capability was added
            - Why it matters for goal
            - How user benefits

      FORMAT as bullets (max 5):
        achievements: [
          "✓ {achievement_1}",
          "✓ {achievement_2}",
          ...
        ]

  SECTION 3: Key Decisions Made

    LOAD: decisions_made[] from execution-log.yaml

    FILTER to critical decisions only:
      FOR EACH decision WHERE criticality IN [CRITICAL, HIGH]:
        ADD to key_decisions:
          decision: {decision.question}
          chosen: {decision.user_choice}
          impact: {decision.impact_on_goal}

    FORMAT as bullets (max 3):
      key_decisions: [
        "Decision: {question} → Chosen: {choice}",
        ...
      ]

  SECTION 4: Deliverables Produced

    BUSINESS-LEVEL description (NOT file paths):

    FOR EACH deliverable IN primary_deliverables:
      DESCRIBE what it is, what it does:
        "{deliverable.name}: {business_description}"

    EXAMPLE:
      NOT: "src/components/UserDashboard.tsx (452 lines)"
      BUT: "User Dashboard: Displays user data and key metrics"

    GROUP by category:
      primary: [{list primary with business value}]
      supporting: [{list supporting if relevant}]

  SECTION 5: Metrics

    EXTRACT from execution-log:
      total_tasks: {count}
      completed_tasks: {count DONE}
      completion_rate: {completed / total * 100}%

      session_duration: {calculate from timestamps}
      phases_completed: 5/5

      alignment_score: {from validation}

      decisions_made: {count critical decisions}
      blockers_resolved: {count blockers}

  SECTION 6: Next Steps (if any)

    IF validation identified accepted gaps:
      IDENTIFY gap-closing opportunities:
        "Optional enhancements:
         - {gap_1} - effort: {estimate}
         - {gap_2} - effort: {estimate}"

    IF deployment pending:
      "Deployment: Ready for {deployment_target}"

    IF no next steps:
      "Project complete. No further action needed."

COMPILE sections into executive_summary_content

VALIDATE summary:
  CHECK: Length <= 2 pages (when rendered)
  CHECK: No technical jargon
  CHECK: Business value clear
  CHECK: All sections present

STORE: executive_summary_content
```

---

## 3. PACKAGE_ARTIFACTS

```yaml
INPUT:
  - deliverables[]
  - executive_summary_content

CREATE package structure:

  deliverables-package/
    ├── executive-summary.md
    ├── deliverables/
    │   ├── primary/
    │   │   └── {primary deliverables}
    │   └── supporting/
    │       └── {supporting deliverables}
    ├── documentation/
    │   ├── decisions-made.yaml
    │   ├── validation-report.yaml
    │   └── execution-summary.yaml
    └── metadata/
        ├── goal-declaration.yaml
        ├── constraints.yaml
        └── session-complete.yaml

COPY artifacts to package:

  FOR EACH deliverable IN deliverables[]:
    source = deliverable.location

    IF deliverable IN primary_deliverables:
      destination = deliverables-package/deliverables/primary/
    ELSE:
      destination = deliverables-package/deliverables/supporting/

    COPY: source → destination

    CREATE: {deliverable.name}.meta.yaml
    CONTENT:
      artifact_name: {name}
      business_description: {description}
      produced_by: {task_id}
      timestamp: {timestamp}
      serves_goal: {goal_component}

SAVE executive summary:

  WRITE: deliverables-package/executive-summary.md
  CONTENT: {executive_summary_content (formatted as markdown)}

COPY documentation:

  COPY: state/decisions-made.yaml → package/documentation/
  COPY: state/validation-report.yaml → package/documentation/

  CREATE: execution-summary.yaml
  CONTENT:
    session_id: {session_id}
    goal: {goal}
    phases_completed: 5
    total_tasks: {count}
    completion_rate: {rate}
    alignment_score: {score}
    session_duration: {duration}

COPY metadata:

  COPY: state/goal-declaration.yaml → package/metadata/
  COPY: state/constraints.yaml → package/metadata/

GENERATE package manifest:

  CREATE: deliverables-package/MANIFEST.yaml
  CONTENT:
    package_id: {generate_uuid}
    created_at: {timestamp}

    goal: {goal_statement}
    status: COMPLETE

    deliverables_count:
      primary: {count}
      supporting: {count}

    alignment_score: {score}

    session_metadata:
      session_id: {session_id}
      duration: {duration}
      phases: 5

CALCULATE package checksum:

  HASH all files in deliverables-package/
  SAVE: checksum to MANIFEST.yaml

STORE: package_location = "deliverables-package/"
```

---

## 4. SAVE_SESSION_STATE

```yaml
CREATE final session state:

  session-complete.yaml:
    session_id: {session_id}
    status: COMPLETE
    timestamp: {now}

    goal:
      statement: {goal}
      declared_at: {timestamp}
      achieved: {YES | MOSTLY | PARTIALLY}
      alignment_score: {score}

    execution_summary:
      phases_completed: 5
      total_tasks: {count}
      completed_tasks: {count DONE}
      skipped_tasks: {count SKIPPED}
      completion_rate: {rate}

      session_duration: {duration}
      start_time: {phase_1_start}
      end_time: {now}

    deliverables:
      package_location: {package_location}
      primary_count: {count}
      supporting_count: {count}

    validation:
      alignment_score: {score}
      classification: {EXCELLENT | GOOD | ACCEPTABLE}
      drift_detected: {boolean}
      user_accepted_gaps: {boolean if applicable}

    key_decisions:
      count: {count}
      critical_count: {count critical}
      decisions: [{list of decision records}]

    metadata:
      phases:
        phase_1_intake:
          duration: {duration}
          status: COMPLETE
        phase_2_plan:
          duration: {duration}
          status: COMPLETE
        phase_3_execute:
          duration: {duration}
          status: COMPLETE
          tasks_executed: {count}
        phase_4_validate:
          duration: {duration}
          status: COMPLETE
          alignment_score: {score}
        phase_5_deliver:
          duration: {duration}
          status: COMPLETE

      snapshots_count: {count snapshots created}
      blockers_resolved: {count}

SAVE to: processes-executive/state/session-complete.yaml

CREATE archive snapshot:

  ARCHIVE all state files:
    - goal-declaration.yaml
    - constraints.yaml
    - execution-plan.yaml
    - backlog.yaml
    - execution-log.yaml
    - validation-report.yaml
    - session-complete.yaml
    - all snapshots/

  COMPRESS to: state/archives/session-{session_id}.tar.gz

UPDATE current-session.yaml:

  CONTENT:
    last_session_id: {session_id}
    status: COMPLETE
    completed_at: {now}

    goal: {goal}
    alignment_score: {score}

    deliverables_location: {package_location}

    next_action: "Start new session OR review deliverables"

STORE: session_state_saved = TRUE
```

---

## 5. PRESENT_TO_USER

```yaml
INPUT:
  - executive_summary_content
  - package_location
  - session-complete.yaml

FORMAT presentation:

  presentation_text:

    HEADER:
      "═══════════════════════════════════════════
       PROJEKT ZAKOŃCZONY
       ═══════════════════════════════════════════"

    BODY:
      {executive_summary_content (formatted)}

    DELIVERABLES:
      "
      DELIVERABLES PACKAGE:
      Lokalizacja: {package_location}

      Zawartość:
      {FOR EACH primary_deliverable:
        "✓ {name}: {business_description}"}

      {IF supporting_deliverables:
        "
        Supporting artifacts:
        {list supporting (max 3)}"}
      "

    FOOTER:
      "
      ═══════════════════════════════════════════

      Session ID: {session_id}
      Duration: {session_duration}
      Alignment: {alignment_score}%
      Status: ✓ COMPLETE

      ═══════════════════════════════════════════
      "

DISPLAY to user:

  OUTPUT: {presentation_text}

  # Ensure formatting is clean
  # No technical details leaked
  # Business value clear
  # Professional appearance

LOG presentation:

  SAVE: {presentation_text} to state/final-presentation.txt
```

---

## 6. DETERMINE_NEXT_ACTION

```yaml
AFTER presenting to user:

DISPLAY options:

  "Opcje:

   A) Start new session (new goal)
   B) Enhance current deliverables (add features)
   C) Close (save and exit)

   Wybierz opcję:"

WAIT: user response

BRANCH by response:

  IF user chooses A (new session):

    DISPLAY: "Nowa sesja - opisz nowy cel:"

    WAIT: user input

    CLEAR current session context:
      ARCHIVE current session
      RESET state variables

    JUMP to: phase-01-intake.md (section_new)

  IF user chooses B (enhance):

    DISPLAY:
      "Enhancement mode.

       Co chcesz dodać/ulepszyć?"

    WAIT: user input

    EXTRACT: enhancement_goal

    CREATE enhancement session:
      LOAD: previous session as baseline
      UPDATE: goal to include enhancement
      CREATE: new backlog with enhancement tasks

    JUMP to: phase-02-plan.md
      # Plan enhancement execution

  IF user chooses C (close):

    DISPLAY:
      "✓ Session saved.

       Deliverables: {package_location}
       Resume: Use /executive to start new session"

    FINALIZE session:
      MARK: session as closed
      SAVE: final state

    EXIT process

  IF unclear response:

    REPHRASE:
      "Wybierz:
       A = Nowy projekt
       B = Ulepszenia
       C = Zakończ

       (A/B/C):"

    WAIT: response
    REPEAT branch logic

STORE: next_action_determined = TRUE
```

---

## 7. GATE_5

```yaml
EVALUATE gate condition:

  CHECK 1: executive-summary.md EXISTS in package
  CHECK 2: session-complete.yaml EXISTS and VALID
  CHECK 3: deliverables-package/ EXISTS and NOT empty
  CHECK 4: MANIFEST.yaml EXISTS in package
  CHECK 5: presentation displayed to user
  CHECK 6: next_action_determined = TRUE

IF ALL checks pass:
  GATE_5 = OPEN

  LOG:
    "✓ GATE_5 OPEN
     ✓ Delivery complete
     ✓ Session finalized"

  MARK: process_status = COMPLETE

  IF next_action = NEW_SESSION:
    # Gate stays open, transition to Phase 1
    TRANSITION to: phase-01-intake.md

  IF next_action = ENHANCE:
    # Gate stays open, transition to Phase 2
    TRANSITION to: phase-02-plan.md

  IF next_action = CLOSE:
    # Gate closes process
    FINALIZE and EXIT

ELSE:
  GATE_5 = CLOSED

  IDENTIFY failed check

  IF check 1 failed:
    ERROR: "Executive summary not generated"
    RETURN to: section 2

  IF check 2 failed:
    ERROR: "Session state not saved"
    RETURN to: section 4

  IF check 3 failed:
    ERROR: "Deliverables package not created"
    RETURN to: section 3

  IF check 4 failed:
    ERROR: "Package manifest missing"
    RETURN to: section 3

  IF check 5 failed:
    ERROR: "Presentation not displayed"
    RETURN to: section 5

  IF check 6 failed:
    ERROR: "Next action not determined"
    RETURN to: section 6

HALT until gate opens
```

---

## VIOLATION RECOVERY

```yaml
IF agent proceeds without generating executive summary:
  HALT
  OUTPUT: "VIOLATION: Must generate executive summary before delivery"
  RETURN to: section 2

IF agent shows technical details to user in summary:
  HALT
  OUTPUT: "VIOLATION: Executive summary must be business-level only"
  SUPPRESS technical details
  RETURN to: section 2 (regenerate)

IF agent skips packaging deliverables:
  HALT
  OUTPUT: "VIOLATION: Must package deliverables before completion"
  RETURN to: section 3

IF agent saves incomplete session state:
  HALT
  OUTPUT: "VIOLATION: Session state incomplete"
  RETURN to: section 4
```

---

## DELIVERABLES VERIFICATION

```yaml
BEFORE closing gate:

VERIFY deliverables completeness:

  CHECK 1: All primary deliverables have business descriptions
    FOR EACH primary_deliverable:
      IF business_description = NULL OR empty:
        ERROR: "Missing business description for {deliverable.name}"
        REQUIRE: description before proceeding

  CHECK 2: Package structure complete
    VERIFY: deliverables-package/executive-summary.md EXISTS
    VERIFY: deliverables-package/deliverables/ NOT empty
    VERIFY: deliverables-package/MANIFEST.yaml EXISTS

  CHECK 3: Executive summary readable
    LOAD: executive-summary.md
    CHECK: Length <= 2 pages
    CHECK: No TODO or placeholder text
    CHECK: All sections filled

  CHECK 4: Session state complete
    VERIFY: session-complete.yaml has all required fields
    VERIFY: goal recorded
    VERIFY: alignment_score recorded
    VERIFY: deliverables_count > 0

IF any check fails:
  HALT
  REPORT failed check to user
  FIX issue
  REPEAT verification

IF all checks pass:
  verification_passed = TRUE
  PROCEED to GATE_5
```

---

## COUNTER-CHECK

```yaml
CLAIM: "Project successfully delivered"

ATTEMPT TO DISPROVE:

  METHOD 1: Verify goal actually achieved
    LOAD: original goal from goal-declaration.yaml
    LOAD: deliverables produced

    QUESTION: Do deliverables actually achieve goal?

    SIMULATE: independent evaluator with ONLY goal and deliverables
    ASK: "Would they conclude goal was met?"

    IF NO:
      COUNTER-EVIDENCE: "Goal not actually achieved"
      LOWER success_claim

  METHOD 2: Check for missing components
    EXTRACT: goal components from goal-declaration.yaml

    FOR EACH component:
      CHECK: Is component addressed by deliverables?

      IF NO:
        COUNTER-EVIDENCE: "Goal component not addressed: {component}"

  METHOD 3: Validate executive summary accuracy
    COMPARE: executive summary vs actual execution log

    CHECK: Are achievements overstated?
    CHECK: Are problems hidden?
    CHECK: Are metrics accurate?

    IF discrepancies found:
      COUNTER-EVIDENCE: "Summary not accurate"

  METHOD 4: Check business value claim
    FOR EACH deliverable claimed as primary:
      QUESTION: Does this actually provide business value?
      QUESTION: Would user care about this?

      IF NO to either:
        COUNTER-EVIDENCE: "Deliverable lacks business value"

RECORD counter-check results:
  evidence_against: [{counter-evidence found}]
  evidence_for: [{supporting evidence}]

  verdict:
    IF evidence_against > evidence_for:
      claim_holds = FALSE
      ALERT: "Delivery claim questionable"
      PRESENT issues to user
      REQUIRE: user confirmation before closing

    ELSE:
      claim_holds = TRUE
      PROCEED normally

ADD to session-complete.yaml:
  counter_check:
    performed: TRUE
    verdict: {claim_holds}
    evidence_against: [{list}]
    evidence_for: [{list}]
```

---

## SCOPE_REDUCTION PROTOCOL

```yaml
IF time constraint OR user requests minimal delivery:

  DECLARE_SCOPE_REDUCTION:
    phase: phase_5_deliver
    condition: "Time constraint OR user request"
    reduction: "Minimal delivery package"
    impact: "Reduced documentation, essential deliverables only"
    user_approval: REQUIRED

  MINIMAL delivery mode:

    SKIP: Supporting deliverables packaging
    SKIP: Detailed documentation
    SKIP: Archive snapshot creation

    DELIVER: Primary deliverables + brief summary only

    executive_summary:
      # Ultra-brief (max 1 page)
      - Goal
      - Outcome (achieved/not)
      - Primary deliverables (list only)
      - Alignment score

    package:
      - Primary deliverables
      - Minimal manifest
      - No supporting artifacts

  PRESENT to user:
    "Minimal delivery due to {reason}.

     Primary deliverables: {count}
     Alignment: {score}%

     Full package available on request."

  SAVE scope reduction:
    LOG: "Delivery scope reduced - minimal package"
    STORE: reduction_reason
```

---

# END phase-05-deliver.md
