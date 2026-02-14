# STEP 3: ANALYZE

## ENFORCED SEQUENCE

```
1. LOAD_MAPPINGS
2. EXECUTE_METHOD_336
3. ASSESS_COMPLIANCE
4. CLASSIFY_GAPS
5. PRIORITIZE_GAPS
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_3
```

## 1. LOAD_MAPPINGS

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: Requirements mappings from step-02
FILTER: WHERE applicability = MANDATORY OR CONDITIONAL
STORE: assessment_scope
VERIFY: requirements_count >= 1
```

## 2. EXECUTE_METHOD_336

```
IF Method 336 (Compliance Gap Analyzer) available:
  EXECUTE: method_336.initialize()

  FOR each requirement:
    EXECUTE: method_336.assess_gap(requirement, system_state)
    STORE: gap_analysis_result

  OUTPUT:
```yaml
gap_analysis:
  method: "Method 336 - Compliance Gap Analyzer"
  requirements_assessed: N
  gaps_identified: G
  covered_requirements: C
  partial_coverage: P
```

ELSE:
  EXECUTE: manual gap assessment (section 3)
```

## 3. ASSESS_COMPLIANCE

```
FOR each requirement:
  EVALUATE current compliance:

    SEARCH evidence:
      - Documentation exists?
      - Code implements requirement?
      - Tests verify compliance?
      - Processes defined?
      - Controls active?

    CLASSIFY status:
      IF all_evidence_exists AND implementation_complete:
        status = COVERED
        evidence_quality = HIGH | MEDIUM | LOW

      IF some_evidence_exists AND implementation_partial:
        status = PARTIAL
        gap_description = "[what is missing]"
        estimated_effort = "[hours to close gap]"

      IF no_evidence_exists OR no_implementation:
        status = GAP
        gap_description = "[what needs to be done]"
        estimated_effort = "[hours to implement]"

  RECORD assessment:
```yaml
compliance_assessment:
  requirement_id: REQ-001
  system_id: SYS-001
  status: COVERED | PARTIAL | GAP
  evidence:
    documentation: YES | NO | PARTIAL
    code_implementation: YES | NO | PARTIAL
    testing: YES | NO | PARTIAL
    processes: YES | NO | PARTIAL
  gap_description: "[description if PARTIAL or GAP]"
  estimated_effort_hours: H
```

REQUIREMENT: Assess ALL requirements
VIOLATION: Assessing only "important" requirements is VIOLATION
```

## 4. CLASSIFY_GAPS

```
FOR each assessment WHERE status = GAP OR PARTIAL:
  ASSIGN severity:

    COMPUTE impact:
      IF requirement = Article 9 (Risk Management):
        impact = CRITICAL
      IF requirement = Article 14 (Human Oversight):
        impact = CRITICAL
      IF requirement = Article 10 (Data Governance):
        impact = HIGH
      IF requirement = Article 13 (Transparency):
        impact = HIGH
      IF requirement = Article 11 (Documentation):
        impact = MEDIUM
      IF requirement = Article 12 (Record-Keeping):
        impact = MEDIUM
      ELSE:
        impact = LOW

    COMPUTE urgency:
      IF deadline_days <= 90:
        urgency = CRITICAL
      IF deadline_days <= 180:
        urgency = HIGH
      IF deadline_days <= 365:
        urgency = MEDIUM
      IF deadline_days > 365:
        urgency = LOW

    COMPUTE detectability:
      IF requirement_easily_auditable:
        detectability = HIGH
      IF requirement_requires_deep_inspection:
        detectability = MEDIUM
      IF requirement_hard_to_verify:
        detectability = LOW

    COMPUTE severity = MAX(impact, urgency) + detectability_factor

  CLASSIFY severity:
    IF severity >= 9:
      severity_class = CRITICAL
    IF severity >= 7 AND severity < 9:
      severity_class = HIGH
    IF severity >= 4 AND severity < 7:
      severity_class = MEDIUM
    IF severity < 4:
      severity_class = LOW

  RECORD gap classification:
```yaml
gap:
  gap_id: GAP-001
  requirement_id: REQ-001
  system_id: SYS-001
  severity: CRITICAL | HIGH | MEDIUM | LOW
  impact: CRITICAL | HIGH | MEDIUM | LOW
  urgency: CRITICAL | HIGH | MEDIUM | LOW
  detectability: HIGH | MEDIUM | LOW
  gap_type: DOCUMENTATION | IMPLEMENTATION | TESTING | PROCESS | CONTROL
  remediation_effort_hours: H
```
```

## 5. PRIORITIZE_GAPS

```
SORT gaps BY severity DESC, urgency DESC, effort ASC

CREATE priority tiers:
  Tier 1 (IMMEDIATE):
    - severity = CRITICAL
    - deadline < 90 days
    - Action: Must fix before any audit

  Tier 2 (URGENT):
    - severity = HIGH
    - deadline < 180 days
    - Action: Fix in next sprint

  Tier 3 (SCHEDULED):
    - severity = MEDIUM
    - deadline < 365 days
    - Action: Plan for next quarter

  Tier 4 (BACKLOG):
    - severity = LOW
    - deadline > 365 days
    - Action: Address when capacity allows

COMPUTE remediation totals:
  tier_1_effort = SUM(effort WHERE tier = 1)
  tier_2_effort = SUM(effort WHERE tier = 2)
  tier_3_effort = SUM(effort WHERE tier = 3)
  tier_4_effort = SUM(effort WHERE tier = 4)

OUTPUT:
```yaml
gap_priorities:
  tier_1_immediate:
    count: N1
    total_effort_hours: E1
    deadline: "[earliest deadline]"
  tier_2_urgent:
    count: N2
    total_effort_hours: E2
  tier_3_scheduled:
    count: N3
    total_effort_hours: E3
  tier_4_backlog:
    count: N4
    total_effort_hours: E4
```
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify gap assessment accuracy
EXECUTE:
  1. FALSE GAP CHECK:
     FOR gaps WHERE severity = CRITICAL:
       ASK: "Is this truly a gap or did we miss evidence?"
       SEARCH: Deeper for evidence
         - Alternative documentation locations
         - Code patterns that implement requirement
         - Implicit processes
       IF evidence_found:
         UPDATE: status = COVERED or PARTIAL
         REMOVE: From gap list
       IF truly_gap:
         CONFIRM: Gap classification

  2. MISSED GAP CHECK:
     FOR assessments WHERE status = COVERED:
       ASK: "Is this truly covered or superficially?"
       VERIFY: Evidence quality
       TEST: Implementation actually works
       IF coverage_superficial:
         DOWNGRADE: status = PARTIAL or GAP
         ADD: To gap list
       IF truly_covered:
         CONFIRM: Coverage status

  3. SEVERITY CHECK:
     FOR gaps WHERE severity = CRITICAL:
       VERIFY: Impact and urgency ratings justified
       IF overrated:
         DOWNGRADE: Severity
       IF underrated:
         UPGRADE: Severity
       IF accurate:
         CONFIRM: Severity classification

  4. EFFORT ESTIMATE CHECK:
     FOR each gap:
       VERIFY: Effort estimate realistic
       COMPARE: Against similar implementations
       IF underestimated:
         INCREASE: Effort estimate
       IF overestimated:
         DECREASE: Effort estimate
       IF realistic:
         CONFIRM: Estimate

  5. REPORT:
     "Counter-check executed"
     "False gaps eliminated: F"
     "Missed gaps added: M"
     "Severity adjustments: S"
     "Effort estimates refined: E"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Mappings loaded from GATE_2?
□ Method 336 executed OR manual assessment complete?
□ ALL requirements assessed?
□ Gaps classified by severity?
□ Gaps prioritized by tier?
□ Effort estimates provided for ALL gaps?
□ Counter-check executed?
□ False gaps eliminated?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## 8. GATE_3

```
EVALUATE:
  gaps_classified = TRUE
  severity_assigned = TRUE
  counter_check_executed = TRUE

COUNT:
  total_requirements = FROM step-02
  covered_requirements = WHERE status = COVERED
  partial_requirements = WHERE status = PARTIAL
  gap_requirements = WHERE status = GAP
  critical_gaps = WHERE severity = CRITICAL
  high_gaps = WHERE severity = HIGH

COMPUTE:
  compliance_percentage = (covered_requirements / total_requirements) * 100

IF all TRUE:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - compliance = C%, gaps = G, critical = CR, high = H"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading mappings:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_MAPPINGS required"
  RETURN to section 1

IF agent assesses subset of requirements:
  HALT
  OUTPUT: "VIOLATION: ALL requirements must be assessed"
  RETURN to section 3

IF agent skips gap classification:
  HALT
  OUTPUT: "VIOLATION: Section 4 CLASSIFY_GAPS required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
