# STEP 6: REMEDIATE

## ENFORCED SEQUENCE

```
1. LOAD_AUDIT_FINDINGS
2. EXECUTE_METHOD_329
3. PRIORITIZE_REMEDIATIONS
4. PLAN_REMEDIATIONS
5. EXECUTE_REMEDIATIONS
6. VERIFY_REMEDIATIONS
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_6
```

## 1. LOAD_AUDIT_FINDINGS

```
PRECONDITION: GATE_5 = OPEN
IF GATE_5 ≠ OPEN → HALT with "ERROR: GATE_5 not open"

LOAD: violations from step-04
LOAD: audit report from step-05
LOAD: evidence from step-05
FILTER: WHERE status = OPEN OR IN_PROGRESS
STORE: remediation_queue
VERIFY: remediation_queue defined
```

## 2. EXECUTE_METHOD_329

```
IF Method 329 (Risk Heat Map Generator) available:
  EXECUTE: method_329.initialize()

  EXTRACT: All violations with severity and impact
  FOR each violation:
    EXECUTE: method_329.plot_risk(violation)

  GENERATE: Risk heat map
  IDENTIFY: High-risk areas
  STORE: risk_visualization

  OUTPUT:
```yaml
risk_heat_map:
  method: "Method 329 - Risk Heat Map Generator"
  violations_plotted: N
  high_risk_areas: H
  risk_concentration: "[description]"
```

ELSE:
  EXECUTE: manual risk assessment (section 3)
```

## 3. PRIORITIZE_REMEDIATIONS

```
FOR each violation in remediation_queue:
  COMPUTE remediation priority:

    ASSESS impact:
      IF affects_mandatory_requirement:
        impact_score = 10
      IF affects_essential_requirement:
        impact_score = 7
      IF affects_recommended_requirement:
        impact_score = 4
      IF affects_optional_requirement:
        impact_score = 1

    ASSESS urgency:
      IF regulatory_deadline_days <= 7:
        urgency_score = 10
      IF regulatory_deadline_days <= 30:
        urgency_score = 7
      IF regulatory_deadline_days <= 90:
        urgency_score = 4
      IF no_deadline:
        urgency_score = 1

    ASSESS exposure:
      IF violation_affects_external_parties:
        exposure_score = 10
      IF violation_affects_sensitive_data:
        exposure_score = 7
      IF violation_affects_internal_operations:
        exposure_score = 4
      IF violation_isolated:
        exposure_score = 1

    ASSESS remediation_effort:
      ESTIMATE: Hours required to fix
      IF effort <= 4_hours:
        effort_factor = 1.5
      IF effort <= 16_hours:
        effort_factor = 1.0
      IF effort <= 40_hours:
        effort_factor = 0.7
      IF effort > 40_hours:
        effort_factor = 0.5

    COMPUTE priority_score:
      priority_score = (impact_score + urgency_score + exposure_score) × effort_factor

  CLASSIFY priority:
    IF priority_score >= 25:
      priority_class = IMMEDIATE
      sla_hours = 4
    IF priority_score >= 15 AND priority_score < 25:
      priority_class = URGENT
      sla_hours = 24
    IF priority_score >= 8 AND priority_score < 15:
      priority_class = SCHEDULED
      sla_hours = 168
    IF priority_score < 8:
      priority_class = BACKLOG
      sla_hours = 720

  RECORD prioritization:
```yaml
remediation_priority:
  violation_id: VIO-001
  priority_score: "[score]"
  priority_class: IMMEDIATE | URGENT | SCHEDULED | BACKLOG
  impact_score: "[score]"
  urgency_score: "[score]"
  exposure_score: "[score]"
  effort_estimate_hours: "[hours]"
  sla_hours: "[hours]"
  deadline: "[calculated deadline]"
```

SORT remediation_queue BY priority_score DESC
```

## 4. PLAN_REMEDIATIONS

```
FOR each violation in remediation_queue:
  ANALYZE root cause:

    INVESTIGATE:
      - Why did violation occur?
      - What control failed?
      - Was control insufficient or misconfigured?
      - Is this a systemic issue?

    CLASSIFY root cause:
      - CONTROL_MISSING: No control implemented
      - CONTROL_MISCONFIGURED: Control exists but wrong settings
      - CONTROL_BYPASSED: Control bypassed by alternate path
      - CONTROL_INSUFFICIENT: Control inadequate for threat
      - PROCESS_FAILURE: Manual process not followed
      - AWARENESS_GAP: Personnel unaware of policy
      - SYSTEMIC_ISSUE: Design flaw affecting multiple controls

  SELECT remediation strategy:

    IF root_cause = CONTROL_MISSING:
      STRATEGY: Implement_Control
      ACTIONS:
        1. Design control per policy requirement
        2. Implement control
        3. Verify control effectiveness
        4. Enable monitoring

    IF root_cause = CONTROL_MISCONFIGURED:
      STRATEGY: Reconfigure_Control
      ACTIONS:
        1. Identify correct configuration
        2. Apply configuration changes
        3. Test configuration
        4. Verify compliance

    IF root_cause = CONTROL_BYPASSED:
      STRATEGY: Close_Bypass
      ACTIONS:
        1. Identify bypass path
        2. Block bypass path
        3. Add detection for bypass attempts
        4. Verify bypass closed

    IF root_cause = CONTROL_INSUFFICIENT:
      STRATEGY: Strengthen_Control
      ACTIONS:
        1. Assess control gap
        2. Enhance control (add rules, increase coverage)
        3. Test enhanced control
        4. Deploy enhancement

    IF root_cause = PROCESS_FAILURE:
      STRATEGY: Process_Improvement
      ACTIONS:
        1. Identify process breakdown point
        2. Redesign process
        3. Document new process
        4. Train personnel
        5. Add process monitoring

    IF root_cause = AWARENESS_GAP:
      STRATEGY: Training_And_Communication
      ACTIONS:
        1. Create training materials
        2. Conduct training
        3. Verify understanding
        4. Add periodic reminders

    IF root_cause = SYSTEMIC_ISSUE:
      STRATEGY: Systemic_Fix
      ACTIONS:
        1. Map all affected controls
        2. Design systemic solution
        3. Plan phased implementation
        4. Execute across all affected areas
        5. Verify system-wide

  CREATE remediation plan:
```yaml
remediation_plan:
  remediation_id: REM-001
  violation_id: VIO-001
  policy_id: POL-001
  control_id: CTL-001
  root_cause: CONTROL_MISSING | CONTROL_MISCONFIGURED | CONTROL_BYPASSED | CONTROL_INSUFFICIENT | PROCESS_FAILURE | AWARENESS_GAP | SYSTEMIC_ISSUE
  strategy: "[strategy name]"
  actions:
    - action_id: ACT-001
      description: "[what to do]"
      responsible: "[who does it]"
      estimated_hours: "[hours]"
      dependencies: [ACT-000]
    - action_id: ACT-002
      description: "[what to do]"
      responsible: "[who does it]"
      estimated_hours: "[hours]"
      dependencies: [ACT-001]
  total_effort_hours: "[sum of action hours]"
  target_completion: "[deadline based on sla_hours]"
  approval_required: YES | NO
  approver: "[stakeholder_id if approval required]"
```

REQUIREMENT: Create remediation plan for ALL violations
VIOLATION: Planning remediation for "critical" violations only is VIOLATION
```

## 5. EXECUTE_REMEDIATIONS

```
FOR each remediation_plan WHERE priority_class = IMMEDIATE OR URGENT:
  DECLARE execution:
    "Executing remediation [remediation_id] for [violation_id]"
    "Strategy: [strategy]"
    "Estimated effort: [total_effort_hours] hours"

  IF approval_required = YES:
    REQUEST: Approval from approver
    WAIT: Approval decision
    IF denied → SKIP to next remediation
    IF approved → PROCEED

  FOR each action in actions ORDER BY dependencies:
    VERIFY: Dependencies completed
    IF dependencies_incomplete → WAIT

    EXECUTE action:
      RECORD: Action start timestamp
      PERFORM: Action description steps
      COLLECT: Evidence of action completion
      RECORD: Action end timestamp

    VERIFY action completion:
      CHECK: Action objectives met
      IF not_met → RETRY or ESCALATE
      IF met → MARK action_status = COMPLETED

  UPDATE remediation_plan:
```yaml
remediation_execution:
  remediation_id: REM-001
  execution_start: "[timestamp]"
  execution_end: "[timestamp]"
  actual_effort_hours: "[hours]"
  status: COMPLETED | IN_PROGRESS | FAILED | BLOCKED
  actions_completed: "[count]"
  actions_total: "[count]"
  evidence_ids: [EVD-010, EVD-011]
```

FOR each remediation_plan WHERE priority_class = SCHEDULED OR BACKLOG:
  CREATE: Remediation ticket
  ASSIGN: To responsible party
  SET: Due date based on sla_hours
  TRACK: Until completion
```

## 6. VERIFY_REMEDIATIONS

```
FOR each remediation WHERE status = COMPLETED:
  EXECUTE verification:

    PRE-VERIFICATION:
      READ: Original violation
      READ: Evidence of violation
      VERIFY: Violation was reproducible

    POST-REMEDIATION VERIFICATION:
      RETEST: Original violation scenario
      VERIFY: Violation no longer occurs
      IF violation_persists:
        remediation_status = FAILED
        DIAGNOSE: Why remediation failed
        UPDATE: Remediation plan
        RETRY: Remediation
      IF violation_resolved:
        remediation_status = VERIFIED

    CONTROL VERIFICATION:
      TEST: Control that failed originally
      VERIFY: Control now functioning
      MEASURE: Control effectiveness
      IF control_ineffective:
        remediation_status = PARTIAL
        ENHANCE: Control further
      IF control_effective:
        control_status = VERIFIED

    COMPLIANCE VERIFICATION:
      RECHECK: Policy compliance
      COLLECT: New compliance data
      VERIFY: Policy now compliant
      IF non_compliant:
        remediation_status = INCOMPLETE
        INVESTIGATE: Remaining issues
      IF compliant:
        compliance_status = VERIFIED

    REGRESSION VERIFICATION:
      TEST: Related controls
      VERIFY: No negative side effects
      IF regression_detected:
        remediation_status = REGRESSION
        ROLLBACK: Remediation if severe
        FIX: Regression
      IF no_regression:
        regression_status = NONE

  CLASSIFY verification result:
    IF all_verifications_passed:
      verification_result = SUCCESS
      CLOSE: Violation
      UPDATE: Compliance status

    IF any_verification_failed:
      verification_result = FAILED
      REOPEN: Violation
      ESCALATE: For review

  RECORD verification:
```yaml
verification_result:
  remediation_id: REM-001
  violation_id: VIO-001
  verification_date: "[timestamp]"
  verification_status: SUCCESS | FAILED | PARTIAL | REGRESSION
  violation_resolved: YES | NO
  control_effective: YES | NO
  policy_compliant: YES | NO
  regression_detected: YES | NO
  evidence_ids: [EVD-012, EVD-013]
```

COMPUTE remediation metrics:
  success_rate = successful_remediations / total_remediations
  mean_remediation_time = AVG(execution_time)
  adherence_to_sla = remediations_within_sla / total_remediations
```

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify remediation completeness
EXECUTE:
  1. COMPLETENESS CHECK:
     FOR each violation WHERE priority_class = IMMEDIATE OR URGENT:
       VERIFY: Remediation executed
       IF not_remediated:
         ESCALATE: Critical violation not remediated
         EXECUTE: Emergency remediation
       IF remediated:
         CONFIRM: Completion

  2. EFFECTIVENESS CHECK:
     FOR each remediation WHERE verification_result = SUCCESS:
       ASK: "Could the violation recur?"
       TEST: Edge cases and variations
       IF recurrence_possible:
         MARK: remediation_insufficient = TRUE
         STRENGTHEN: Remediation
       IF recurrence_blocked:
         CONFIRM: Remediation effective

  3. SYSTEMIC CHECK:
     FOR each violation:
       ASK: "Are there similar violations elsewhere?"
       SEARCH: For related violations in other areas
       IF similar_found:
         APPLY: Remediation pattern to similar cases
         VERIFY: System-wide fix
       IF unique:
         CONFIRM: Isolated issue

  4. SUSTAINABILITY CHECK:
     FOR each remediation:
       ASK: "Will this remediation persist?"
       VERIFY: Monitoring in place
       VERIFY: Process documented
       VERIFY: Training completed
       IF not_sustainable:
         ADD: Sustainability measures
       IF sustainable:
         CONFIRM: Remediation durable

  5. RISK CHECK:
     REGENERATE: Risk heat map
     COMPARE: Before vs after remediation
     VERIFY: Risk reduction achieved
     IF risk_not_reduced:
       INVESTIGATE: Why risk persists
       ENHANCE: Remediation
     IF risk_reduced:
       CONFIRM: Risk mitigation successful

  6. REPORT:
     "Counter-check executed"
     "Emergency remediations: E"
     "Insufficient remediations strengthened: I"
     "Systemic fixes applied: S"
     "Risk reduction: [percentage]"

VIOLATION: Skipping counter-check is VIOLATION
```

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Audit findings loaded from GATE_5?
□ Method 329 executed OR manual risk assessment complete?
□ ALL violations prioritized?
□ Remediation plans created for ALL violations?
□ IMMEDIATE and URGENT remediations executed?
□ ALL completed remediations verified?
□ Verification successful for all critical violations?
□ Counter-check executed?
□ Risk reduction achieved?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_6
```

## 9. GATE_6

```
EVALUATE:
  remediation_count >= critical_violations_count
  risk_reduced = TRUE
  counter_check_executed = TRUE
  verification_complete = TRUE

COUNT:
  critical_violations = FROM step-04 WHERE severity = CRITICAL
  critical_remediated = WHERE severity = CRITICAL AND verification_result = SUCCESS
  urgent_violations = FROM step-04 WHERE severity = HIGH
  urgent_remediated = WHERE severity = HIGH AND verification_result = SUCCESS
  total_remediated = WHERE verification_result = SUCCESS

COMPUTE:
  critical_remediation_rate = critical_remediated / critical_violations
  overall_remediation_rate = total_remediated / total_violations

IF all TRUE AND critical_remediation_rate = 1.0:
  GATE_6 = OPEN
  OUTPUT: "GATE_6 OPEN - remediations = N, critical = C, urgent = U, success_rate = R%"
  OUTPUT: "Deep-Governance process COMPLETE"
  OUTPUT: "Governance posture improved: compliance rate now at [rate]%"

IF any FALSE OR critical_remediation_rate < 1.0:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED - reason: [which condition failed]"
  OUTPUT: "Critical violations remaining: [critical_violations - critical_remediated]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without prioritization:
  HALT
  OUTPUT: "VIOLATION: Section 3 PRIORITIZE_REMEDIATIONS required for ALL"
  RETURN to section 3

IF agent skips remediation planning:
  HALT
  OUTPUT: "VIOLATION: Section 4 PLAN_REMEDIATIONS required for ALL violations"
  RETURN to section 4

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 6 VERIFY_REMEDIATIONS required for ALL completed remediations"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7

IF critical violations remain unresolved:
  HALT
  OUTPUT: "VIOLATION: All CRITICAL violations must be remediated before GATE_6"
  RETURN to section 5 for emergency remediation
```
