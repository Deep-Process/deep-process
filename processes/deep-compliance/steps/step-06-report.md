# STEP 6: REPORT

## ENFORCED SEQUENCE

```
1. LOAD_PLANS
2. COMPILE_FINDINGS
3. GENERATE_REPORT
4. CALCULATE_COMPLIANCE
5. CREATE_DELIVERABLES
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_6
```

## 1. LOAD_PLANS

```
PRECONDITION: GATE_5 = OPEN
IF GATE_5 ≠ OPEN → HALT with "ERROR: GATE_5 not open"

LOAD: All data from previous steps
  - System inventory (step-01)
  - Requirements mapping (step-02)
  - Gap analysis (step-03)
  - Evidence collection (step-04)
  - Remediation plans (step-05)
STORE: report_context
VERIFY: all_data_loaded = TRUE
```

## 2. COMPILE_FINDINGS

```
AGGREGATE all assessment results:

SYSTEM summary:
  total_systems = COUNT(systems)
  high_risk_systems = COUNT WHERE classification = HIGH_RISK
  general_purpose_systems = COUNT WHERE classification = GENERAL_PURPOSE

REQUIREMENTS summary:
  total_requirements = COUNT(requirements)
  applicable_requirements = WHERE applicability = MANDATORY
  not_applicable = WHERE applicability = NOT_APPLICABLE

COMPLIANCE summary:
  covered_requirements = WHERE status = COVERED
  partial_requirements = WHERE status = PARTIAL
  gap_requirements = WHERE status = GAP

GAP summary:
  critical_gaps = WHERE severity = CRITICAL
  high_gaps = WHERE severity = HIGH
  medium_gaps = WHERE severity = MEDIUM
  low_gaps = WHERE severity = LOW

EVIDENCE summary:
  total_evidence_items = COUNT(evidence)
  verified_evidence = WHERE status = VERIFIED
  stale_evidence = WHERE staleness = STALE

REMEDIATION summary:
  total_plans = COUNT(plans)
  critical_plans = WHERE gap_severity = CRITICAL
  high_plans = WHERE gap_severity = HIGH
  total_effort_hours = SUM(all plan efforts)
  compliance_ready_date = FROM timeline

RECORD compiled_findings:
```yaml
assessment_summary:
  systems: N
  high_risk: H
  requirements: R
  covered: C
  gaps: G
  critical_gaps: CR
  evidence_items: E
  remediation_plans: P
  total_effort_hours: T
  compliance_ready_date: "[date]"
```
```

## 3. GENERATE_REPORT

```
CREATE comprehensive compliance report:

SECTION 1: Executive Summary
```yaml
executive_summary:
  assessment_date: "[date]"
  regulatory_framework: "EU AI Act 2024"
  enforcement_deadline: "August 1, 2026"

  systems_assessed: N
  high_risk_systems: H

  compliance_percentage: "[percentage]"
  compliance_status: COMPLIANT | PARTIAL | NON_COMPLIANT

  critical_findings:
    - "[finding 1]"
    - "[finding 2]"
    - "[finding 3]"

  remediation_timeline: "[weeks/months to compliance]"
  total_effort: "[person-hours]"
  compliance_ready_date: "[date]"

  recommendation: "[immediate actions required]"
```

SECTION 2: System Inventory
  FOR each system:
    INCLUDE:
      - System ID and name
      - Risk classification
      - Capabilities
      - AI components
      - Deployment context
      - Ownership

SECTION 3: Requirements Mapping
  FOR each requirement:
    INCLUDE:
      - Requirement ID
      - Article reference
      - Applicability
      - Current status
      - Evidence (if covered)
      - Gap (if not covered)

GROUP by:
  - By Article (9, 10, 11, 12, 13, 14, 15)
  - By Status (COVERED, PARTIAL, GAP)
  - By System

SECTION 4: Gap Analysis
  FOR each gap:
    INCLUDE:
      - Gap ID
      - Requirement
      - Severity
      - Description
      - Impact
      - Remediation plan reference

SORT BY: severity DESC

SECTION 5: Evidence Inventory
  FOR each evidence_artifact:
    INCLUDE:
      - Evidence ID
      - Requirement covered
      - Type
      - Location
      - Quality
      - Freshness

SECTION 6: Remediation Roadmap
  FOR each phase:
    INCLUDE:
      - Duration
      - Gaps addressed
      - Effort required
      - Key milestones
      - Dependencies
      - Completion date

CREATE Gantt chart visualization

SECTION 7: Recommendations
  IMMEDIATE actions (next 30 days):
    - Address all CRITICAL gaps
    - Establish compliance governance
    - Begin documentation updates

  SHORT-TERM actions (31-90 days):
    - Address all HIGH gaps
    - Implement missing controls
    - Complete testing requirements

  LONG-TERM actions (91+ days):
    - Address MEDIUM/LOW gaps
    - Continuous monitoring
    - Periodic reassessment
```

## 4. CALCULATE_COMPLIANCE

```
COMPUTE compliance percentage:

  compliance_percentage = (covered_requirements / applicable_requirements) * 100

CLASSIFY compliance level:
  IF compliance_percentage >= 95% AND critical_gaps = 0:
    compliance_level = COMPLIANT
    readiness = AUDIT_READY

  IF compliance_percentage >= 80% AND critical_gaps <= 2:
    compliance_level = SUBSTANTIALLY_COMPLIANT
    readiness = NEAR_READY

  IF compliance_percentage >= 60%:
    compliance_level = PARTIALLY_COMPLIANT
    readiness = IN_PROGRESS

  IF compliance_percentage < 60%:
    compliance_level = NON_COMPLIANT
    readiness = EARLY_STAGE

ESTIMATE time to compliance:
  remaining_effort_hours = SUM(gap remediation efforts)
  available_capacity_hours_per_week = "[estimated]"
  weeks_to_compliance = remaining_effort_hours / available_capacity_hours_per_week
  compliance_date = current_date + weeks_to_compliance

RECORD compliance status:
```yaml
compliance_status:
  percentage: "[percentage]"
  level: COMPLIANT | SUBSTANTIALLY | PARTIALLY | NON_COMPLIANT
  readiness: AUDIT_READY | NEAR_READY | IN_PROGRESS | EARLY_STAGE
  critical_gaps_remaining: N
  high_gaps_remaining: H
  estimated_compliance_date: "[date]"
  days_until_deadline: D
  at_risk: YES | NO
```
```

## 5. CREATE_DELIVERABLES

```
GENERATE report artifacts:

  compliance-report.md:
    FORMAT: Markdown with YAML frontmatter
    CONTENT: Full report (all 7 sections)
    SIZE: Comprehensive

  compliance-summary.yaml:
    FORMAT: YAML
    CONTENT: Key metrics and findings
    SIZE: 1-2 pages

  gap-analysis.csv:
    FORMAT: CSV
    CONTENT: All gaps with details
    COLUMNS: gap_id, requirement, severity, status, plan_id

  remediation-roadmap.md:
    FORMAT: Markdown with Gantt chart
    CONTENT: Timeline and milestones
    SIZE: 3-5 pages

  evidence-inventory.yaml:
    FORMAT: YAML
    CONTENT: All evidence artifacts
    PURPOSE: Audit preparation

STORE all deliverables in:
  compliance-reports/[assessment-date]/
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify report accuracy and completeness
EXECUTE:
  1. DATA CONSISTENCY CHECK:
     VERIFY: Numbers add up correctly
       total_requirements = covered + partial + gaps
       total_gaps = critical + high + medium + low
     IF inconsistent:
       INVESTIGATE: Data discrepancy
       CORRECT: Numbers
     IF consistent:
       CONFIRM: Data accurate

  2. COMPLETENESS CHECK:
     VERIFY: All 7 sections present
     VERIFY: All required subsections included
     IF missing_sections:
       COMPLETE: Missing content
     IF complete:
       CONFIRM: Report comprehensive

  3. ACCURACY CHECK:
     FOR critical_findings:
       VERIFY: Finding supported by data
       VERIFY: Severity justified
       IF unsupported:
         REMOVE: Or downgrade finding
       IF supported:
         CONFIRM: Finding accurate

  4. ACTIONABILITY CHECK:
     FOR recommendations:
       VERIFY: Recommendation specific and actionable
       VERIFY: Timeline realistic
       IF vague:
         REFINE: Recommendation with specifics
       IF actionable:
         CONFIRM: Recommendation useful

  5. CALCULATION VERIFICATION:
     RECOMPUTE: compliance_percentage
     RECOMPUTE: estimated_compliance_date
     COMPARE: Against reported values
     IF discrepancy:
       CORRECT: Calculations
     IF match:
       CONFIRM: Calculations accurate

  6. REPORT:
     "Counter-check executed"
     "Data inconsistencies corrected: D"
     "Missing sections completed: M"
     "Calculations verified: YES/NO"
     "Report ready for delivery: YES/NO"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Plans loaded from GATE_5?
□ All findings compiled?
□ Report generated with all 7 sections?
□ Compliance percentage calculated?
□ All deliverables created?
□ Counter-check executed?
□ Data consistency verified?
□ Report comprehensive and accurate?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_6
```

## 8. GATE_6

```
EVALUATE:
  report_complete = TRUE
  compliance_percentage_calculated = TRUE
  counter_check_executed = TRUE
  deliverables_generated = TRUE

COUNT:
  report_sections = COUNT(sections in report)
  deliverables = COUNT(files generated)

VERIFY:
  report_sections >= 7
  deliverables >= 5

IF all TRUE AND report_sections >= 7:
  GATE_6 = OPEN
  OUTPUT: "GATE_6 OPEN - report_complete = TRUE, compliance = C%, readiness = R"
  OUTPUT: "Deep-Compliance process COMPLETE"
  OUTPUT: "Compliance level: [level]"
  OUTPUT: "Critical gaps: [count]"
  OUTPUT: "Estimated compliance date: [date]"
  OUTPUT: "Deliverables: [list]"

IF any FALSE OR report_sections < 7:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED - reason: [which condition failed]"
  OUTPUT: "Missing sections: [7 - report_sections]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading plans:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_PLANS required"
  RETURN to section 1

IF agent generates incomplete report:
  HALT
  OUTPUT: "VIOLATION: All 7 sections required"
  RETURN to section 3

IF agent skips compliance calculation:
  HALT
  OUTPUT: "VIOLATION: Section 4 CALCULATE_COMPLIANCE required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
