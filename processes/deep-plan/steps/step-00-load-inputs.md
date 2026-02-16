# STEP 0: LOAD_INPUTS

## PRECONDITION

```
GATE_ENTRY: NONE (first step)
```

## SEQUENCE

### 0.1: LOAD_ARCHITECTURE

```
READ: architecture-comprehensive.md

EXTRACT:
  components: COUNT(microservices)
  bounded_contexts: LIST(context names)
  technology_stack: LIST(languages, frameworks, databases)
  deployment_models: LIST(deployment types)
  quality_attributes: LIST(attribute name, target value)

VERIFY:
  components > 0
  bounded_contexts > 0
  technology_stack NOT empty

IF verification FAILED:
  HALT
  OUTPUT: "Architecture incomplete: [missing element]"

STORE: architecture_context
```

### 0.2: LOAD_RISKS

```
READ: risk-report.md

EXTRACT:
  critical_risks: WHERE risk_score >= 70
  high_risks: WHERE risk_score >= 50 AND < 70
  mitigation_deadlines: FOR each critical_risk

VERIFY:
  critical_risks identified
  mitigation_deadlines specified

STORE: risk_context
```

### 0.3: LOAD_CONSTRAINTS

```
READ: tradeoff-analysis.yaml

EXTRACT:
  budget: total_cost
  timeline: total_duration_months
  team_size: number_of_people

VERIFY:
  budget > 0
  timeline > 0
  team_size > 0

IF any value = 0:
  HALT
  OUTPUT: "Constraint missing: [name]"

STORE: constraint_context
```

### 0.4: EXTRACT_PHASE

```
FROM: tradeoff-analysis.yaml → evolution_strategy

EXTRACT:
  phase_1: MVP details
  phase_1_duration: months
  phase_1_scope: features

FOCUS: phase_1 ONLY

STORE: phase_context
```

## COUNTER-CHECK

```
CLAIM: "All required inputs loaded"

ATTEMPT_REFUTATION:
  CHECK: architecture_context.components = NULL?
  CHECK: risk_context.critical_risks = NULL?
  CHECK: constraint_context.budget = NULL?

  IF any NULL:
    REFUTATION: SUCCESS
    ACTION: RETURN to failed extraction step

  IF all NOT NULL:
    REFUTATION: FAILED
    CONFIRMATION: "All inputs loaded"
```

## CHECKLIST

```
□ architecture-comprehensive.md read?
□ Components extracted (count > 0)?
□ risk-report.md read?
□ Critical risks identified?
□ tradeoff-analysis.yaml read?
□ Budget, timeline, team_size extracted?
□ Phase 1 scope focused?
□ Counter-check executed?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_0
```

## GATE_0

```
EVALUATE:
  architecture_context EXISTS
  risk_context EXISTS
  constraint_context EXISTS
  phase_context EXISTS

IF all TRUE:
  GATE_0 = OPEN
  OUTPUT: "GATE_0 OPEN - inputs_loaded = TRUE"
  OUTPUT: "Components: {components}, Budget: {budget}, Timeline: {timeline}"
  PROCEED: To step-01-decompose.md

IF any FALSE:
  GATE_0 = CLOSED
  OUTPUT: "GATE_0 CLOSED - missing: [context name]"
  HALT
```

## OUTPUT

```
WRITE: planning-context.yaml

content:
  components: {count}
  bounded_contexts: {list}
  technology_stack: {list}
  critical_risks: {list}
  budget: {value}
  timeline: {value}
  team_size: {value}
  phase_focus: "MVP"
```
