# PHASE 4: GOAL ALIGNMENT VALIDATION

## PRECONDITION
```
GATE_3 = OPEN
execution complete
backlog all tasks DONE/SKIPPED
```

## PURPOSE
```
Validate output aligns with declared goal.
Detect goal drift.
Identify gaps between goal and output.
Get user acceptance OR add fix tasks.
```

## ENFORCED SEQUENCE
```
1. LOAD_GOAL_AND_OUTPUT
2. ANALYZE_ALIGNMENT
3. DETECT_DRIFT
4. CALCULATE_SCORE
5. PRESENT_FINDINGS
6. HANDLE_USER_DECISION
7. GATE_4
```

---

## 1. LOAD_GOAL_AND_OUTPUT

```yaml
LOAD: goal-declaration.yaml
EXTRACT: original_goal = goal declared in Phase 1

LOAD: execution-log.yaml
EXTRACT: all artifacts produced during Phase 3

IDENTIFY final deliverables:
  FOR EACH artifact WHERE artifact.type = DELIVERABLE:
    ADD to deliverables_list

VERIFY deliverables not empty:
  IF deliverables_list = []:
    ERROR: "No deliverables produced - execution may have failed"
    ESCALATE to user

LOAD: constraints.yaml
EXTRACT: constraints against which to validate

STORE:
  original_goal
  deliverables_list[]
  constraints
```

---

## 2. ANALYZE_ALIGNMENT

```yaml
INPUT:
  - original_goal
  - deliverables_list[]

FOR EACH deliverable IN deliverables_list:

  ANALYZE how deliverable serves goal:

    QUESTION 1: Does this deliverable contribute to achieving goal?
      ANSWER: YES | NO | PARTIALLY

    QUESTION 2: What aspect of goal does it serve?
      IDENTIFY: specific goal component

    QUESTION 3: Is contribution complete or partial?
      ANSWER: COMPLETE | PARTIAL | MISSING

    QUESTION 4: Are there gaps?
      IDENTIFY: what's missing relative to goal

  SCORE alignment:
    per_deliverable_score = (contribution_completeness / goal_requirements) * 100

  RECORD:
    deliverable_name: {name}
    goal_component_served: {component}
    contribution_level: {COMPLETE | PARTIAL | MISSING}
    alignment_score: {per_deliverable_score}
    gaps: [{list of gaps}]

AGGREGATE across all deliverables:
  overall_alignment = AVERAGE of all per_deliverable_scores

IDENTIFY overall gaps:
  FOR EACH goal_component:
    IF no deliverable serves this component:
      ADD to overall_gaps: {goal_component}

STORE: alignment_analysis{}
```

---

## 3. DETECT_DRIFT

```yaml
COMPARE: original_goal vs execution trajectory

LOAD: all decision records from Phase 3
LOAD: all plan modifications from Phase 3

ANALYZE if goal changed during execution:

  CHECK 1: Goal text modified?
    COMPARE: original goal-declaration.yaml vs current
    IF different:
      drift_detected = TRUE
      drift_type = EXPLICIT_CHANGE
      drift_description = "User changed goal from X to Y"

  CHECK 2: Implicit drift through decisions?
    ANALYZE: decisions_made[]
    FOR EACH decision:
      IF decision diverges from original goal direction:
        drift_detected = TRUE
        drift_type = IMPLICIT_DRIFT
        drift_description = "Decisions led away from original goal"

  CHECK 3: Scope reduction caused drift?
    CHECK: execution-log for SCOPE_REDUCTION declarations
    IF any scope reductions:
      ANALYZE: did reductions change goal achievability?
      IF yes:
        drift_detected = TRUE
        drift_type = SCOPE_DRIFT
        drift_description = "Scope reductions changed achievable goal"

CALCULATE drift magnitude:
  IF drift_detected:
    drift_magnitude = semantic_distance(original_goal, current_trajectory)
    # 0 = no drift, 1 = completely different goal

  ELSE:
    drift_magnitude = 0

STORE:
  drift_detected: {boolean}
  drift_type: {type if detected}
  drift_description: {description}
  drift_magnitude: {0-1}
```

---

## 4. CALCULATE_SCORE

```yaml
INPUT:
  - alignment_analysis
  - drift analysis
  - constraints

CALCULATE alignment_score:

  base_score = alignment_analysis.overall_alignment  # 0-100

  ADJUST for drift:
    IF drift_magnitude > 0.3:
      drift_penalty = drift_magnitude * 20
      adjusted_score = base_score - drift_penalty
    ELSE:
      adjusted_score = base_score

  ADJUST for constraint violations:
    FOR EACH constraint:
      IF constraint violated:
        constraint_penalty = constraint.weight * 10
        adjusted_score -= constraint_penalty

  CLAMP: adjusted_score to [0, 100]

  NORMALIZE: final_alignment_score = adjusted_score / 100  # 0-1

CLASSIFY result:
  IF final_alignment_score >= 0.9:
    classification = EXCELLENT

  IF 0.7 <= final_alignment_score < 0.9:
    classification = GOOD

  IF 0.5 <= final_alignment_score < 0.7:
    classification = ACCEPTABLE_WITH_GAPS

  IF final_alignment_score < 0.5:
    classification = MISALIGNED

STORE:
  final_alignment_score
  classification
```

---

## 5. PRESENT_FINDINGS

```yaml
INPUT:
  - alignment_analysis
  - drift analysis
  - final_alignment_score
  - classification

FORMAT validation report:

  SECTION 1: Goal Reminder
    "CEL (original): {original_goal}"
    {IF drift_detected:
      "CEL (evolved): {current_goal_description}
       Drift detected: {drift_description}"}

  SECTION 2: Alignment Summary
    "Alignment score: {final_alignment_score * 100}%
     Classification: {classification}"

  SECTION 3: Per-Deliverable Analysis
    FOR EACH deliverable:
      "- {deliverable_name}
         Serves: {goal_component}
         Contribution: {contribution_level}
         Gaps: {gaps if any}"

  SECTION 4: Overall Gaps
    {IF overall_gaps exist:
      "Goal components not addressed:
       {list overall_gaps}"}

  SECTION 5: Recommendation
    IF classification = EXCELLENT OR GOOD:
      "Recommendation: Accept output. Goal achieved."

    IF classification = ACCEPTABLE_WITH_GAPS:
      "Recommendation: Accept OR address gaps.
       Gaps are: {list gaps}
       Effort to close: {estimate_gap_effort}"

    IF classification = MISALIGNED:
      "Recommendation: Do NOT accept. Significant misalignment.
       Required: {describe what's needed to align}"

DISPLAY to user (formatted clearly):
  {validation_report}

SAVE: validation-report.yaml
```

---

## 6. HANDLE_USER_DECISION

```yaml
BASED on classification:

IF classification IN [EXCELLENT, GOOD]:

  # Auto-proceed with informational message
  DISPLAY:
    "✓ Validation passed. Output aligned with goal ({score}%).

     Deliverables:
     {list deliverables with business description}

     Przechodzę do delivery..."

  PROCEED to section 7

IF classification = ACCEPTABLE_WITH_GAPS:

  # User decision required
  DISPLAY:
    "Validation: Alignment {score}% (ACCEPTABLE with gaps)

     Gaps identified:
     {list gaps}

     Effort to close gaps: {estimated_effort}

     Opcje:
     A) Accept output (gaps acceptable)
     B) Add tasks to close gaps
     C) Revise goal (adjust expectations)"

  WAIT: user decision

  IF user chooses A (accept):
    user_accepted_gap = TRUE
    RECORD: "User accepted gaps: {gaps}"
    PROCEED to section 7

  IF user chooses B (add tasks):
    GENERATE gap-closing tasks:
      FOR EACH gap:
        CREATE task:
          task_name: "Close gap: {gap_description}"
          task_type: GAP_FIX
          target: {deliverable to enhance}
          goal: {specific gap to close}

        ADD task to backlog

    UPDATE: backlog.yaml
    DISPLAY: "✓ Added {count} gap-closing tasks to backlog"

    RETURN to: phase-03-execute.md (re-execute with new tasks)

  IF user chooses C (revise goal):
    ASK: "Jak skorygować cel?"
    WAIT: user input

    UPDATE: goal-declaration.yaml
    RECALCULATE: alignment with new goal
    RETURN to: section 2 (re-analyze with new goal)

IF classification = MISALIGNED:

  # Critical - cannot auto-proceed
  DISPLAY:
    "⚠ CRITICAL: Output misaligned with goal.

     Goal was: {original_goal}
     Output is: {summarize deliverables}
     Alignment: {score}% (MISALIGNED)

     Gaps:
     {list all gaps}

     This requires significant rework.

     Opcje:
     A) Rework (add corrective tasks)
     B) Revise goal to match output
     C) Cancel project (accept as exploratory work)"

  WAIT: user decision

  IF user chooses A (rework):
    GENERATE corrective tasks:
      ANALYZE: what went wrong
      CREATE: tasks to correct course

    ADD tasks to backlog
    RETURN to: phase-03-execute.md

  IF user chooses B (revise goal):
    PROPOSE: new goal that matches actual output
    WAIT: user confirmation
    UPDATE: goal-declaration.yaml
    RECALCULATE: alignment (should now be high)
    PROCEED to section 7

  IF user chooses C (cancel):
    MARK: project as exploratory/cancelled
    SAVE: partial deliverables
    DISPLAY: "Project marked as exploratory. Deliverables saved."
    GOTO: early termination in phase-05-deliver.md
```

---

## 7. GATE_4

```yaml
EVALUATE gate condition:

  CHECK 1: alignment_score calculated
  CHECK 2: classification determined
  CHECK 3: validation-report.yaml EXISTS

  CHECK 4: EITHER:
    - alignment_score >= 0.9
    OR
    - user_accepted_gap = TRUE

IF ALL checks pass:
  GATE_4 = OPEN

  SAVE state snapshot:
    current_phase: phase_5_deliver
    goal: {goal}
    completion: 90%
    validation_passed: TRUE
    alignment_score: {score}

  DISPLAY:
    "✓ Validation complete. Alignment confirmed.

     Przechodzę do delivery..."

  NEXT: phase-05-deliver.md

ELSE:
  GATE_4 = CLOSED

  IDENTIFY failed check

  IF check 4 failed (low alignment, no user acceptance):
    DISPLAY:
      "Validation failed. Cannot proceed to delivery.

       Alignment: {score}%
       User acceptance: {user_accepted_gap}

       Choose option in section 6."

    RETURN to: section 6

  IF check 1-3 failed (missing artifacts):
    ERROR: "Validation incomplete - missing artifacts"
    RETURN to: appropriate section

HALT until gate opens
```

---

## COUNTER-CHECK

```yaml
CLAIM: "Output aligns with goal"

ATTEMPT TO DISPROVE:

  METHOD 1: Find goal components not addressed
    LIST: all goal components
    FOR EACH component:
      CHECK: is this component served by ANY deliverable?
      IF NO: COUNTER-EVIDENCE found

  METHOD 2: Find deliverables that don't serve goal
    FOR EACH deliverable:
      CHECK: does this serve ANY goal component?
      IF NO: COUNTER-EVIDENCE found (wasted effort)

  METHOD 3: Detect hidden misalignment
    SIMULATE: user with DIFFERENT interpretation of goal
    CHECK: would they accept these deliverables?
    IF NO: POTENTIAL misalignment

RECORD counter-check results:
  evidence_against: [{counter-evidence found}]
  evidence_for: [{supporting evidence}]

  verdict:
    IF evidence_against > evidence_for:
      claim_holds = FALSE
      LOWER alignment_score
    ELSE:
      claim_holds = TRUE

ADD to validation-report.yaml
```

---

## VIOLATION RECOVERY

```yaml
IF agent proceeds to delivery without validation:
  HALT
  OUTPUT: "VIOLATION: Must validate alignment before delivery"
  RETURN to: section 1

IF agent skips user decision when alignment < 90%:
  HALT
  OUTPUT: "VIOLATION: User decision required when alignment < 90%"
  RETURN to: section 6

IF agent accepts misaligned output without user approval:
  HALT
  OUTPUT: "VIOLATION: Cannot auto-accept misaligned output"
  RETURN to: section 6
```

---

# END phase-04-validate.md
