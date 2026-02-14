# STEP 3: ENFORCE

## ENFORCED SEQUENCE

```
1. LOAD_POLICIES
2. EXECUTE_METHOD_334
3. IMPLEMENT_CONTROLS
4. CONFIGURE_ENFORCEMENT
5. VERIFY_ENFORCEMENT
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_3
```

## 1. LOAD_POLICIES

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: policies from step-02
LOAD: controls from step-02
SORT: BY policy criticality DESC
STORE: enforcement_queue
VERIFY: policies_count >= 1
```

## 2. EXECUTE_METHOD_334

```
IF Method 334 (Access Control Matrix Generator) available:
  EXECUTE: method_334.initialize()

  EXTRACT: All access-related policies
  EXTRACT: All subjects (users, roles, groups)
  EXTRACT: All objects (resources, data, systems)
  EXTRACT: All operations (read, write, execute, delete)

  FOR each access policy:
    EXECUTE: method_334.generate_matrix(policy)
    STORE: access_control_matrix

  OUTPUT:
```yaml
access_control_matrix:
  method: "Method 334 - Access Control Matrix Generator"
  subjects_identified: S
  objects_identified: O
  permissions_defined: P
  matrix_generated: TRUE
```

ELSE:
  EXECUTE: manual access control definition (section 3)
```

## 3. IMPLEMENT_CONTROLS

```
FOR each control in enforcement_queue:
  READ: control specification
  DECLARE implementation plan:
    "Implementing [control_id] for [policy_id]"
    "Method: [implementation.method]"
    "Technology: [implementation.technology]"

  SELECT implementation approach:

    IF type = TECHNICAL AND category = PREVENTIVE:
      IMPLEMENT:
        - Configure access controls
        - Set up input validation
        - Enable encryption
        - Apply security configurations
        - Deploy policy enforcement points

    IF type = TECHNICAL AND category = DETECTIVE:
      IMPLEMENT:
        - Configure logging
        - Set up monitoring dashboards
        - Create alert rules
        - Deploy detection agents
        - Enable audit trails

    IF type = TECHNICAL AND category = CORRECTIVE:
      IMPLEMENT:
        - Configure auto-remediation
        - Set up incident workflows
        - Create rollback procedures
        - Deploy recovery mechanisms

    IF type = ADMINISTRATIVE:
      IMPLEMENT:
        - Document procedures
        - Assign responsibilities
        - Create approval workflows
        - Define escalation paths
        - Establish review schedules

    IF type = PHYSICAL:
      IMPLEMENT:
        - Configure physical access systems
        - Set up monitoring cameras
        - Deploy badge readers
        - Establish visitor procedures

  RECORD implementation:
```yaml
control_implementation:
  control_id: CTL-001
  policy_id: POL-001
  status: IMPLEMENTED | IN_PROGRESS | FAILED
  implementation_date: "[date]"
  implemented_by: "[who]"
  configuration: "[details of how implemented]"
  evidence: "[proof of implementation]"
```

REQUIREMENT: Implement ALL controls
VIOLATION: Implementing "critical" controls only is VIOLATION
```

## 4. CONFIGURE_ENFORCEMENT

```
FOR each policy:
  READ: enforcement.mechanism
  READ: enforcement.frequency

  CONFIGURE enforcement engine:

    IF mechanism = AUTOMATED:
      SELECT automation platform:
        - Policy engine (OPA, Casbin, etc.)
        - Infrastructure-as-Code (Terraform, Ansible)
        - Cloud-native policy (AWS IAM, Azure Policy)
        - API gateway (Kong, Apigee)

      DEPLOY policy rules to platform:
```yaml
enforcement_rule:
  policy_id: POL-001
  platform: "[platform name]"
  rule_code: |
    [executable policy code]
  enforcement_point: "[where rule is evaluated]"
  action_on_violation: BLOCK | LOG | ALERT | REMEDIATE
```

      TEST: Rule functionality
        INPUT: Compliant request
        VERIFY: Request allowed
        INPUT: Non-compliant request
        VERIFY: Request blocked/logged

    IF mechanism = MANUAL:
      CREATE manual procedure:
```yaml
manual_procedure:
  policy_id: POL-001
  procedure_name: "[procedure name]"
  steps:
    - step: 1
      action: "[what to do]"
      responsible: "[who does it]"
      verification: "[how to verify]"
    - step: 2
      action: "[what to do]"
      responsible: "[who does it]"
      verification: "[how to verify]"
  documentation: "[where procedure documented]"
  training_required: YES | NO
```

    IF mechanism = HYBRID:
      COMBINE:
        - Automated checks for technical controls
        - Manual reviews for administrative controls
      COORDINATE:
        - Automated system triggers manual workflow
        - Manual approval gates automated process

  CONFIGURE enforcement frequency:
    IF frequency = CONTINUOUS:
      ENABLE: Real-time policy evaluation
      SET: Event-driven triggers

    IF frequency = PERIODIC:
      SCHEDULE: Batch enforcement runs
      SET: Cron/scheduled jobs
      DEFINE: Enforcement interval

    IF frequency = ON_DEMAND:
      CREATE: Manual trigger mechanism
      DEFINE: Who can trigger enforcement
      SET: Trigger conditions

  RECORD configuration:
```yaml
enforcement_configuration:
  policy_id: POL-001
  mechanism: AUTOMATED | MANUAL | HYBRID
  frequency: CONTINUOUS | PERIODIC | ON_DEMAND
  platform: "[platform/system]"
  active: TRUE | FALSE
  last_enforcement: "[timestamp]"
```
```

## 5. VERIFY_ENFORCEMENT

```
FOR each control WHERE status = IMPLEMENTED:
  READ: verification specification

  EXECUTE pre-enforcement test:
    DECLARE: "Testing [control_id] before enforcement"
    PREDICT: Expected behavior

    TEST compliant scenario:
      INPUT: Request that complies with policy
      EXECUTE: Enforcement check
      VERIFY: Request allowed
      IF blocked → Control misconfigured
      IF allowed → Test passed

    TEST non-compliant scenario:
      INPUT: Request that violates policy
      EXECUTE: Enforcement check
      VERIFY: Request blocked/logged
      IF allowed → Control not working
      IF blocked → Test passed

  EXECUTE effectiveness test:
    MEASURE: control effectiveness metric
    COMPARE: Against target value
    IF below_target → Control insufficient
    IF at_or_above_target → Control effective

  CLASSIFY verification result:
    IF all_tests_passed:
      verification_status = VERIFIED
      enforcement_ready = TRUE

    IF any_test_failed:
      verification_status = FAILED
      enforcement_ready = FALSE
      DIAGNOSE: Root cause
      FIX: Control implementation
      RETEST: After fix

  RECORD verification:
```yaml
verification_result:
  control_id: CTL-001
  verification_date: "[date]"
  verification_status: VERIFIED | FAILED
  tests_executed: N
  tests_passed: P
  tests_failed: F
  effectiveness_metric: "[value]"
  effectiveness_target: "[target]"
  enforcement_ready: TRUE | FALSE
  issues_found: "[description if any]"
```

REQUIREMENT: Verify ALL controls before declaring GATE_3 open
VIOLATION: Skipping verification is VIOLATION
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify enforcement completeness
EXECUTE:
  1. COVERAGE CHECK:
     FOR each policy:
       VERIFY: All controls implemented
       COUNT: controls_implemented vs controls_defined
       IF mismatch → INVESTIGATE and IMPLEMENT missing
       IF match → CONFIRM

  2. BYPASS CHECK:
     FOR each control:
       ASK: "Can this control be bypassed?"
       TEST: Alternative paths that skip control
       IF bypass_found:
         MARK: control_insufficient = TRUE
         ADD: Additional enforcement point
         RETEST: After adding enforcement
       IF no_bypass:
         CONFIRM: control_effective = TRUE

  3. CONFLICT CHECK:
     FOR each pair of controls:
       TEST: Controls operating together
       VERIFY: No conflicts in enforcement
       IF conflict → RESOLVE and RECONFIGURE
       IF no_conflict → CONFIRM

  4. PERFORMANCE CHECK:
     FOR each automated control:
       MEASURE: Enforcement latency
       MEASURE: Resource utilization
       IF performance_degradation:
         OPTIMIZE: Control implementation
         VERIFY: Performance acceptable
       IF acceptable:
         CONFIRM: control_performant = TRUE

  5. COMPLETENESS CHECK:
     FOR each policy:
       ASK: "Are there enforcement gaps?"
       LIST: Scenarios not covered by controls
       IF critical_gaps → ADD controls
       IF no_gaps → CONFIRM complete

  6. REPORT:
     "Counter-check executed"
     "Controls verified: V"
     "Bypasses found and fixed: B"
     "Conflicts resolved: C"
     "Performance optimizations: P"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Policies loaded from GATE_2?
□ Method 334 executed OR manual access control definition complete?
□ ALL controls implemented?
□ Enforcement configured for ALL policies?
□ Enforcement verified for ALL controls?
□ All verification tests passed?
□ Counter-check executed?
□ No bypasses remain?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## 8. GATE_3

```
EVALUATE:
  controls_implemented >= policies_count
  enforcement_verified = TRUE
  counter_check_executed = TRUE
  bypasses_found = 0

COUNT:
  total_controls_defined = FROM step-02
  total_controls_implemented = WHERE status = IMPLEMENTED
  total_controls_verified = WHERE verification_status = VERIFIED
  controls_failed = WHERE verification_status = FAILED

IF all TRUE AND controls_failed = 0 AND total_controls_verified = total_controls_defined:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - controls_implemented = N, verified = V, failed = 0"
  PROCEED to workflow.md for next step

IF any FALSE OR controls_failed > 0:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  OUTPUT: "Controls failed: [count], require fixing"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without implementing controls:
  HALT
  OUTPUT: "VIOLATION: Section 3 IMPLEMENT_CONTROLS required for ALL"
  RETURN to section 3

IF agent skips enforcement configuration:
  HALT
  OUTPUT: "VIOLATION: Section 4 CONFIGURE_ENFORCEMENT required"
  RETURN to section 4

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 5 VERIFY_ENFORCEMENT required for ALL controls"
  RETURN to section 5

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
