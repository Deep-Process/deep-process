# PHASE 1: INTAKE & GOAL DECLARATION

## PRECONDITION
```
NONE (entry point)
```

## PURPOSE
```
Extract user vision.
Declare goal in business terms.
Get user confirmation.
NO technical planning yet.
```

## ENFORCED SEQUENCE
```
1. DETECT_SESSION_TYPE
2. EXTRACT_VISION
3. EXTRACT_CONSTRAINTS
4. DECLARE_GOAL
5. CONFIRM_WITH_USER
6. SAVE_ARTIFACTS
7. GATE_1
```

---

## 1. DETECT_SESSION_TYPE

```yaml
IF state/current-session.yaml EXISTS:
  session_type = RESUME
  LOAD: last snapshot
  GOTO: section_resume

ELSE:
  session_type = NEW
  GOTO: section_new
```

### SECTION_RESUME (Resuming existing session)

```yaml
LOAD: state/current-session.yaml

EXTRACT:
  - last_phase
  - goal
  - completion_percentage
  - next_action

DISPLAY to user:
  "Witaj ponownie!

   Ostatnia sesja: {timestamp}
   Cel: {goal}
   Faza: {last_phase}/5 ({completion_percentage}% complete)
   Następny krok: {next_action}

   Kontynuować?"

WAIT user response:
  IF "tak" OR "yes" OR "kontynuuj":
    LOAD: complete state
    JUMP to: {last_phase}

  IF "nie" OR "no":
    ASK: "Nowy cel OR modify obecny?"
    WAIT response:
      IF "nowy":
        GOTO: section_new
      IF "modify":
        GOTO: section_modify_goal

  IF unclear:
    REPHRASE: "Kontynuować ostatnią sesję? (tak/nie)"
    WAIT response
```

### SECTION_NEW (New session)

```yaml
DISPLAY:
  "Nowa sesja executive orchestration.

   Opisz co chcesz stworzyć (1-2 zdania, business level):"

WAIT user input

STORE: user_vision_raw
GOTO: section 2
```

### SECTION_MODIFY_GOAL (Modify existing goal)

```yaml
LOAD: goal-declaration.yaml

DISPLAY current goal:
  "Obecny cel: {goal}

   Co chcesz zmienić?"

WAIT user input

STORE: goal_modification
GOTO: section 4 (re-declare with modification)
```

---

## 2. EXTRACT_VISION

```yaml
INPUT: user_vision_raw

PARSE for components:
  - what: What user wants to create/achieve
  - why: Purpose/motivation (if mentioned)
  - scope: Rough scope (if mentioned)

EXAMPLE parsing:
  User: "Chcę stworzyć system CRM dla małej firmy"

  Extracted:
    what: "system CRM"
    target: "mała firma"
    scope: NOT_SPECIFIED
    constraints: NOT_SPECIFIED

STORE: vision_components
```

---

## 3. EXTRACT_CONSTRAINTS

```yaml
ANALYZE: vision_components

IDENTIFY mentioned constraints:
  - budget (if mentioned)
  - timeline (if mentioned)
  - technology (if mentioned)
  - team_size (if mentioned)
  - compliance (if mentioned)

IDENTIFY missing constraints:
  FOR EACH standard_constraint NOT mentioned:
    ADD to constraints_to_ask

PRIORITIZE constraints_to_ask:
  CRITICAL: budget, timeline, compliance
  IMPORTANT: technology preferences, team size
  OPTIONAL: other preferences

ASK user for CRITICAL constraints:
  DISPLAY:
    "Kilka pytań o ograniczenia:

     1. Budget/koszty: Czy są ograniczenia budżetowe?"

  WAIT response
  STORE: budget_constraint

  DISPLAY:
    "2. Timeline: Kiedy to ma być gotowe?"

  WAIT response
  STORE: timeline_constraint

  DISPLAY:
    "3. Compliance: Czy są wymagania regulacyjne (GDPR, etc.)?"

  WAIT response
  STORE: compliance_constraint

ASK user for IMPORTANT constraints (optional):
  DISPLAY:
    "Opcjonalne:
     - Preferowane technologie? (Enter = brak preferencji)"

  WAIT response (timeout 30s)
  STORE: tech_preferences OR null

COMPILE constraints:
  constraints:
    budget: {budget_constraint OR "nieokreślony"}
    timeline: {timeline_constraint OR "nieokreślony"}
    compliance: {compliance_constraint OR "brak"}
    technology: {tech_preferences OR "wybór techniczny"}
```

---

## 4. DECLARE_GOAL

```yaml
INPUT:
  - vision_components
  - constraints

FORMULATE goal statement:

  TEMPLATE:
    "Stworzyć {what} dla {target}
     z ograniczeniami: {key_constraints}
     cel biznesowy: {why OR inferred_purpose}"

EXAMPLE:
  "Stworzyć system CRM dla małej firmy
   z ograniczeniami: timeline 3 miesiące, GDPR compliance
   cel biznesowy: zarządzanie relacjami z klientami"

VALIDATE goal statement:
  CHECK: Is goal measurable?
  CHECK: Is goal achievable?
  CHECK: Are constraints clear?

  IF any check fails:
    REFINE goal statement
    REPEAT validation

STORE: goal_statement_draft
```

---

## 5. CONFIRM_WITH_USER

```yaml
INPUT: goal_statement_draft, constraints

DISPLAY to user:
  "Podsumowanie:

   CEL: {goal_statement}

   OGRANICZENIA:
   - Budget: {budget}
   - Timeline: {timeline}
   - Compliance: {compliance}
   - Technologie: {technology}

   ZAKRES (wstępnie):
   {inferred_scope}

   Czy to poprawnie oddaje co chcesz?"

WAIT user response:

  IF "tak" OR "yes" OR "ok" OR "poprawnie":
    user_approved = true
    GOTO: section 6

  IF "nie" OR "no":
    ASK: "Co należy zmienić?"
    WAIT correction
    APPLY correction to goal_statement
    REPEAT section 5 (confirm again)

  IF modification provided:
    APPLY modification
    GOTO: section 4 (re-declare)

  IF unclear:
    REPHRASE: "Zatwierdzić ten cel? (tak/nie)"
    WAIT response
```

---

## 6. SAVE_ARTIFACTS

```yaml
PRECONDITION: user_approved = true

CREATE: goal-declaration.yaml
CONTENT:
  goal: {goal_statement}
  declared_at: {timestamp}
  user_approved: true

  vision:
    what: {what}
    why: {why}
    target: {target}

  constraints:
    budget: {budget}
    timeline: {timeline}
    compliance: {compliance}
    technology: {technology}

  metadata:
    session_id: {generate_uuid}
    session_type: {NEW | RESUME | MODIFIED}

SAVE to: processes-executive/state/goal-declaration.yaml

CREATE: constraints.yaml
CONTENT:
  budget:
    value: {budget}
    type: {HARD | SOFT | NONE}

  timeline:
    value: {timeline}
    type: {HARD | SOFT | NONE}

  compliance:
    requirements: [{compliance_list}]
    critical: {true | false}

  technology:
    preferences: [{tech_list}]
    mandatory: {true | false}

SAVE to: processes-executive/state/constraints.yaml

CREATE: intake-summary.yaml
CONTENT:
  phase: phase_1_intake
  status: COMPLETE
  timestamp: {timestamp}

  extracted:
    vision: {vision_components}
    constraints: {constraints}

  declared:
    goal: {goal_statement}
    user_approved: true

  next_phase: phase_2_plan

SAVE to: processes-executive/state/intake-summary.yaml
```

---

## 7. GATE_1

```yaml
EVALUATE gate condition:

  CHECK 1: goal-declaration.yaml EXISTS
  CHECK 2: user_approved = true in goal-declaration.yaml
  CHECK 3: constraints.yaml EXISTS

IF ALL checks pass:
  GATE_1 = OPEN

  DISPLAY:
    "✓ Cel zadeklarowany i zatwierdzony.

     Cel: {goal}

     Przechodzę do planowania technicznego..."

  SAVE state snapshot:
    current_phase: phase_2_plan
    goal: {goal}
    completion: 20%

  NEXT: phase-02-plan.md

ELSE:
  GATE_1 = CLOSED

  IDENTIFY failed check

  IF check 1 failed:
    ERROR: "goal-declaration.yaml not created"
    RETURN to: section 6

  IF check 2 failed:
    ERROR: "User did not approve goal"
    RETURN to: section 5

  IF check 3 failed:
    ERROR: "constraints.yaml not created"
    RETURN to: section 6

HALT until gate opens
```

---

## VIOLATION RECOVERY

```yaml
IF agent proceeds to planning without goal confirmation:
  HALT
  OUTPUT: "VIOLATION: Cannot plan without confirmed goal"
  RETURN to: section 5

IF agent skips constraint extraction:
  HALT
  OUTPUT: "VIOLATION: Must extract constraints before declaring goal"
  RETURN to: section 3

IF agent saves artifacts before user approval:
  HALT
  OUTPUT: "VIOLATION: Must get approval before saving"
  DELETE premature artifacts
  RETURN to: section 5
```

---

## SCOPE_REDUCTION PROTOCOL

```yaml
IF user says "skip constraints - just use defaults":

  DECLARE_SCOPE_REDUCTION:
    phase: phase_1_intake
    condition_skipped: "constraint extraction"
    reason: "User requested defaults"
    impact: "Plan created without explicit constraints - may need revision later"
    user_approval: GRANTED

  SET default constraints:
    budget: "reasonable"
    timeline: "as soon as practical"
    compliance: "standard best practices"
    technology: "technical choice"

  LOG scope reduction
  PROCEED to section 4
```

---

# END phase-01-intake.md
