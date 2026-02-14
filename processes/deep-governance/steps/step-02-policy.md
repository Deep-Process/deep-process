# STEP 2: POLICY

## ENFORCED SEQUENCE

```
1. LOAD_REQUIREMENTS
2. EXECUTE_METHOD_333
3. GENERATE_POLICIES
4. RESOLVE_CONFLICTS
5. DEFINE_CONTROLS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_2
```

## 1. LOAD_REQUIREMENTS

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: requirements list from step-01
LOAD: stakeholder mapping from step-01
FILTER: WHERE criticality = MANDATORY OR ESSENTIAL
STORE: high_priority_requirements
VERIFY: Count >= 1
```

## 2. EXECUTE_METHOD_333

```
IF Method 333 (Policy-as-Code Framework) available:
  EXECUTE: method_333.initialize_framework()

  CREATE: Policy repository structure
    /policies
      /access-control
      /data-protection
      /security
      /compliance
      /operations

  FOR each requirement in high_priority_requirements:
    EXECUTE: method_333.generate_policy(requirement)
    STORE: policy_code

  OUTPUT:
```yaml
policy_generation:
  method: "Method 333 - Policy-as-Code Framework"
  policies_generated: N
  policy_files_created: F
```

ELSE:
  EXECUTE: manual policy generation (section 3)
```

## 3. GENERATE_POLICIES

```
FOR each requirement:
  DECLARE policy intent:
    "Creating policy for [requirement_id]"
    "Intent: [what behavior this policy enforces]"
    "Scope: [what this policy applies to]"

  DEFINE policy:
```yaml
policy_id: POL-001
requirement_id: REQ-001
name: "[descriptive policy name]"
intent: "[what this policy achieves]"
scope: "[systems/processes/data covered]"

rules:
  - rule_id: RULE-001
    condition: "[when this rule applies]"
    action: ALLOW | DENY | REQUIRE | LOG
    target: "[what the rule acts on]"
    enforcement: PREVENTIVE | DETECTIVE | CORRECTIVE

  - rule_id: RULE-002
    condition: "[when this rule applies]"
    action: ALLOW | DENY | REQUIRE | LOG
    target: "[what the rule acts on]"
    enforcement: PREVENTIVE | DETECTIVE | CORRECTIVE

exceptions:
  - exception_id: EXC-001
    justification: "[why exception needed]"
    approver: "[who approved]"
    expiration: "[when exception expires]"
    conditions: "[when exception applies]"

enforcement:
  mechanism: AUTOMATED | MANUAL | HYBRID
  frequency: CONTINUOUS | PERIODIC | ON_DEMAND
  responsibility: "[who enforces]"

monitoring:
  metrics: "[what to measure]"
  threshold: "[when to alert]"
  reporting: "[who to notify]"

owner: "[stakeholder_id]"
approver: "[stakeholder_id]"
effective_date: "[date]"
review_date: "[date]"
```

REQUIREMENT: Create policy for EVERY requirement
VIOLATION: Creating policies for "main" requirements only is VIOLATION
```

## 4. RESOLVE_CONFLICTS

```
LOAD: conflicting_requirements from step-01

IF conflicting_requirements.count > 0:
  FOR each conflict:
    IDENTIFY: Policies derived from conflicting requirements
    DECLARE conflict resolution strategy:
      "Conflict between [POL-X] and [POL-Y]"
      "Conflict nature: [description]"
      "Resolution approach: [strategy]"

    SELECT resolution strategy:
      PRECEDENCE:
        IF one requirement MANDATORY, other ESSENTIAL:
          PRIORITY: MANDATORY requirement
          ACTION: MANDATORY policy takes precedence
          DOCUMENT: Override in ESSENTIAL policy

        IF both MANDATORY:
          ESCALATE: To stakeholder for decision
          WAIT: Stakeholder input
          APPLY: Stakeholder decision

      HARMONIZATION:
        IF requirements compatible with modification:
          MODIFY: Both policies to remove conflict
          CREATE: Combined rule that satisfies both
          VERIFY: Both requirements still met

      SEPARATION:
        IF requirements apply to different scopes:
          REFINE: Policy scopes to eliminate overlap
          VERIFY: No overlap remains

      TEMPORAL:
        IF requirements time-dependent:
          APPLY: Different policies at different times
          CREATE: Time-based rules

    RECORD resolution:
```yaml
conflict_resolution:
  conflict_id: CONF-001
  policies: [POL-X, POL-Y]
  requirements: [REQ-X, REQ-Y]
  strategy: PRECEDENCE | HARMONIZATION | SEPARATION | TEMPORAL
  resolution: "[description of how resolved]"
  approved_by: "[stakeholder_id]"
```

    UPDATE: Affected policies with resolution

  VERIFY: All conflicts resolved
  IF unresolved_conflicts > 0 → HALT until resolved

ELSE:
  OUTPUT: "No policy conflicts detected"
```

## 5. DEFINE_CONTROLS

```
FOR each policy:
  IDENTIFY required controls:

    IF enforcement = PREVENTIVE:
      CONTROLS:
        - Input validation
        - Access restrictions
        - Encryption enforcement
        - Configuration hardening

    IF enforcement = DETECTIVE:
      CONTROLS:
        - Logging
        - Monitoring
        - Alerting
        - Anomaly detection

    IF enforcement = CORRECTIVE:
      CONTROLS:
        - Automated remediation
        - Incident response
        - Rollback mechanisms
        - Recovery procedures

  FOR each control:
    DEFINE control specification:
```yaml
control_id: CTL-001
policy_id: POL-001
name: "[control name]"
type: TECHNICAL | ADMINISTRATIVE | PHYSICAL
category: PREVENTIVE | DETECTIVE | CORRECTIVE
implementation:
  method: "[how control is implemented]"
  technology: "[what technology/tool]"
  responsibility: "[who implements]"
verification:
  test_method: "[how to verify control works]"
  frequency: "[how often to test]"
  evidence: "[what evidence to collect]"
effectiveness:
  metric: "[how to measure effectiveness]"
  target: "[target value/state]"
```

  MAP: control_id → policy_id
  VERIFY: Every policy has at least one control
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify policy completeness and correctness
EXECUTE:
  1. COVERAGE CHECK:
     FOR each requirement:
       VERIFY: At least one policy addresses requirement
       IF no_policy → CREATE missing policy
       IF policy_exists → VERIFY policy rules sufficient

  2. CONFLICT RECHECK:
     FOR each policy:
       COMPARE: Against all other policies
       SEARCH: Implicit conflicts not found earlier
       IF conflict_found → RETURN to section 4
       IF no_conflict → CONFIRM

  3. ENFORCEMENT CHECK:
     FOR each policy:
       ASK: "Can this policy be enforced?"
       VERIFY: Required controls are implementable
       IF not_implementable → MARK: requires_alternative_approach
       IF implementable → CONFIRM

  4. SCOPE CHECK:
     FOR each policy:
       ASK: "Are there gaps in policy scope?"
       LIST: Systems/processes NOT covered
       IF critical_gaps → EXPAND policy scope
       IF no_gaps → CONFIRM scope complete

  5. STAKEHOLDER CHECK:
     FOR each policy:
       VERIFY: Owner assigned
       VERIFY: Approver assigned
       IF missing → ASSIGN from stakeholder list
       IF assigned → CONFIRM

  6. REPORT:
     "Counter-check executed"
     "Missing policies created: M"
     "Conflicts resolved: C"
     "Unenforceable policies: U"
     "Scope gaps closed: S"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Requirements loaded from GATE_1?
□ Method 333 executed OR manual policy generation complete?
□ Policy created for EVERY requirement?
□ ALL policy conflicts identified?
□ ALL policy conflicts resolved?
□ Controls defined for ALL policies?
□ Every policy has at least one control?
□ Counter-check executed?
□ All policies have owners and approvers?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

## 8. GATE_2

```
EVALUATE:
  policies_created >= requirements_count
  policy_conflicts_resolved = TRUE
  counter_check_executed = TRUE
  controls_defined = TRUE

COUNT:
  total_policies = COUNT(policy_id)
  total_controls = COUNT(control_id)
  unresolved_conflicts = COUNT(WHERE conflict_resolved = FALSE)

IF all TRUE AND unresolved_conflicts = 0:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - policies = P, controls = C, conflicts_resolved = ALL"
  PROCEED to workflow.md for next step

IF any FALSE OR unresolved_conflicts > 0:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading requirements:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_REQUIREMENTS required"
  RETURN to section 1

IF agent creates policies for subset:
  HALT
  OUTPUT: "VIOLATION: Policy required for ALL requirements"
  RETURN to section 3

IF agent skips conflict resolution:
  HALT
  OUTPUT: "VIOLATION: Section 4 RESOLVE_CONFLICTS required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
