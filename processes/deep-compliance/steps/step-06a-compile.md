---
step: 6a
name: "Compile Findings"
time_estimate: "20-30 minutes"
goal: "Load all process outputs, aggregate metrics, identify critical findings"
requires_completion: [5]
next_steps:
  DEFAULT: "steps/step-06b-calculate.md"
gate: "GATE_6A"
data_dependencies:
  - "outputs from steps 01-05"
  - "data/regulations-info.yaml"
outputs:
  - assessment_findings
  - aggregated_metrics
  - critical_findings
---

# STEP 6A: COMPILE FINDINGS

## ENFORCEMENT RULES

```
1. LOAD all outputs from steps 01-05 (no partial loading).
2. AGGREGATE all metrics (verify consistency).
3. IDENTIFY top 5 critical findings (data-driven only).
4. NO generating reports yet (that is step 6c).
5. Counter-check MANDATORY - verify data consistency.
6. HALT if any data missing or inconsistent.
```

---

## 6A.0 Load Process Outputs

**PRECONDITION:** GATE_5 = OPEN

IF GATE_5 ≠ OPEN → HALT with "ERROR: GATE_5 not open"

**Execute:**

```
LOAD step-01 output:
  [ ] system_inventory
  [ ] total_systems: [N]
  [ ] high_risk_systems: [N]
  [ ] general_purpose_systems: [N]
  [ ] capabilities_extracted: [N]

LOAD step-02 output:
  [ ] requirements_mapping
  [ ] regulation: [id]
  [ ] total_requirements: [N]
  [ ] applicable_requirements: [N]
  [ ] coverage_percentage: [%]

LOAD step-03 output:
  [ ] gap_analysis
  [ ] covered_requirements: [N]
  [ ] partial_requirements: [N]
  [ ] gap_requirements: [N]
  [ ] critical_gaps: [N]
  [ ] high_gaps: [N]
  [ ] medium_gaps: [N]
  [ ] low_gaps: [N]

LOAD step-04 output:
  [ ] evidence_collection
  [ ] total_evidence_artifacts: [N]
  [ ] verified_evidence: [N]
  [ ] coverage_rate: [%]
  [ ] sufficiency_rate: [%]

LOAD step-05 output:
  [ ] remediation_planning
  [ ] total_plans: [N]
  [ ] critical_plans: [N]
  [ ] high_plans: [N]
  [ ] total_effort_hours: [N]
  [ ] compliance_ready_date: [date]
  [ ] timeline_feasible: [YES/NO/AT_RISK]

READ data/regulations-info.yaml:
  [ ] regulation_name
  [ ] enforcement_deadline (if applicable)

IF any data missing:
  LOG ERROR: "Missing: [list]"
  HALT
```

> **HALT** — All data loaded.

---

## 6A.1 Aggregate System Metrics

**Execute:**

```
COUNT systems by classification:
  high_risk_count = COUNT WHERE classification = HIGH_RISK
  general_purpose_count = COUNT WHERE classification = GENERAL_PURPOSE

COUNT systems by deployment:
  production_count = COUNT WHERE status = PRODUCTION
  staging_count = COUNT WHERE status = STAGING
  development_count = COUNT WHERE status = DEVELOPMENT

SELECT top 5 systems by gap count:
  FOR each system ORDER BY gap_count DESC LIMIT 5:
    RECORD:
      system_id: [id]
      classification: [type]
      gap_count: [N]
      highest_gap_severity: [severity]

STORE as system_summary
```

> **HALT** — System metrics aggregated.

---

## 6A.2 Aggregate Requirements Metrics

**Execute:**

```
COUNT requirements by applicability:
  applicable_count = COUNT WHERE applicability = MANDATORY
  conditional_count = COUNT WHERE applicability = CONDITIONAL
  not_applicable_count = COUNT WHERE applicability = NOT_APPLICABLE

COUNT requirements by status:
  covered_count = COUNT WHERE status = COVERED
  partial_count = COUNT WHERE status = PARTIAL
  gap_count = COUNT WHERE status = GAP

GROUP requirements by article:
  FOR each distinct article:
    article_requirements = COUNT WHERE article = [article]
    article_covered = COUNT WHERE article = [article] AND status = COVERED
    article_gaps = COUNT WHERE article = [article] AND status = GAP
    article_coverage = (article_covered / article_requirements) * 100

    RECORD:
      article: [name]
      total: [N]
      covered: [N]
      gaps: [N]
      coverage_pct: [%]

STORE as requirements_summary
```

> **HALT** — Requirements metrics aggregated.

---

## 6A.3 Aggregate Compliance Metrics

**Execute:**

```
COMPUTE coverage:
  total_applicable = applicable_count
  fully_covered = covered_count
  coverage_percentage = (fully_covered / total_applicable) * 100

COUNT gaps by severity:
  critical_gaps = COUNT WHERE severity = CRITICAL
  high_gaps = COUNT WHERE severity = HIGH
  medium_gaps = COUNT WHERE severity = MEDIUM
  low_gaps = COUNT WHERE severity = LOW
  total_gaps = critical_gaps + high_gaps + medium_gaps + low_gaps

COUNT evidence:
  total_artifacts = total_evidence_artifacts
  verified_artifacts = verified_evidence
  high_quality = COUNT WHERE quality_status = HIGH

COUNT remediation:
  total_plans = total_plans
  critical_plans = critical_plans
  high_plans = high_plans
  total_effort = total_effort_hours
  ready_date = compliance_ready_date

STORE as compliance_metrics
```

> **HALT** — Compliance metrics aggregated.

---

## 6A.4 Identify Critical Findings

**Execute exactly 5 checks:**

### Finding 1: Highest severity gap

```
SELECT TOP 1 gap ORDER BY severity_score DESC

IF gap found:
  RECORD critical_finding_1:
    type: CRITICAL_GAP
    requirement_id: [gap.requirement_id]
    article: [gap.article]
    severity: [gap.severity]
    description: [gap.description]
    impact: [gap.impact_description]
```

### Finding 2: High detectability gaps

```
COUNT gaps WHERE detectability_score >= 4

IF count >= 3:
  SELECT TOP 3 WHERE detectability_score >= 4

  RECORD critical_finding_2:
    type: HIGH_DETECTABILITY
    gap_count: [count]
    gap_ids: [list top 3]
    risk: "Auditor will immediately identify"
```

### Finding 3: Deadline risk

```
READ enforcement_deadline FROM regulations-info
READ compliance_ready_date FROM step-05

IF enforcement_deadline exists:
  COMPUTE shortfall = compliance_ready_date - enforcement_deadline

  IF shortfall > 0:
    RECORD critical_finding_3:
      type: DEADLINE_RISK
      ready_date: [date]
      deadline: [date]
      shortfall_days: [N]
```

### Finding 4: Evidence quality issues

```
COUNT low_quality = WHERE quality_status = LOW OR INSUFFICIENT
COMPUTE pct = (low_quality / total_artifacts) * 100

IF pct > 20:
  RECORD critical_finding_4:
    type: EVIDENCE_QUALITY
    low_quality_count: [N]
    percentage: [%]
```

### Finding 5: Coverage below target

```
IF coverage_percentage < 95:
  COMPUTE gap_count = (total_applicable * 0.95) - fully_covered

  RECORD critical_finding_5:
    type: COVERAGE_GAP
    current: [%]
    target: 95
    requirements_needed: [N]
```

STORE all recorded findings as critical_findings

> **HALT** — Critical findings identified.

---

## 6A.5 Counter-Check

**Execute all 5 checks:**

### Check 1: Numerical consistency

```
VERIFY: total_requirements = covered + partial + gaps

IF NOT equal:
  LOG ERROR: "Requirements sum mismatch"
  COMPUTE actual_sum = covered + partial + gaps
  COMPUTE difference = total_requirements - actual_sum
  HALT

VERIFY: total_gaps = critical + high + medium + low

IF NOT equal:
  LOG ERROR: "Gap severity sum mismatch"
  HALT

VERIFY: coverage_percentage = (covered / applicable) * 100

RECOMPUTE check_coverage = (covered / applicable) * 100
IF ABS(coverage_percentage - check_coverage) > 0.1:
  LOG ERROR: "Coverage calculation error"
  CORRECT coverage_percentage = check_coverage
```

### Check 2: Data completeness

```
VERIFY all outputs present:
  [ ] system_inventory loaded
  [ ] requirements_mapping loaded
  [ ] gap_analysis loaded
  [ ] evidence_collection loaded
  [ ] remediation_planning loaded

IF any missing:
  LOG ERROR: "Missing output: [name]"
  HALT
```

### Check 3: Critical findings validity

```
FOR each critical_finding:
  TRACE to source data:
    IF type = CRITICAL_GAP:
      VERIFY gap exists in gap_analysis
    IF type = HIGH_DETECTABILITY:
      VERIFY gaps exist with detectability >= 4
    IF type = DEADLINE_RISK:
      VERIFY dates exist and calculation correct
    IF type = EVIDENCE_QUALITY:
      VERIFY count and percentage correct
    IF type = COVERAGE_GAP:
      VERIFY calculation correct

  IF finding NOT supported by data:
    REMOVE finding
    LOG: "Removed unsupported finding"
```

### Check 4: Aggregation accuracy

```
RECOUNT all aggregations:
  CHECK system_summary counts = actual system counts
  CHECK requirements_summary counts = actual requirement counts
  CHECK compliance_metrics = actual metric values

IF any mismatch:
  LOG ERROR: "Aggregation error in [metric]"
  RECALCULATE correct value
  UPDATE stored metric
```

### Check 5: Cross-reference validation

```
FOR each system_id in system_summary:
  VERIFY exists in system_inventory

FOR each article in requirements_summary:
  VERIFY exists in requirements_mapping

FOR each gap_id in critical_findings:
  VERIFY exists in gap_analysis

IF any reference invalid:
  LOG ERROR: "Invalid reference: [id]"
  HALT
```

RECORD counter_check_results:
  inconsistencies_found: [N]
  corrections_made: [N]
  findings_removed: [N]

> **HALT** — Counter-check complete.

---

## 6A.6 Compile Output

**Execute:**

```yaml
assessment_findings:
  assessment_date: "[current date]"
  regulation: [regulation_id]
  regulation_name: "[name]"

  system_summary:
    total_systems: [N]
    high_risk: [N]
    general_purpose: [N]
    production: [N]
    staging: [N]
    development: [N]
    top_5_by_gaps: [list]

  requirements_summary:
    total: [N]
    applicable: [N]
    conditional: [N]
    not_applicable: [N]
    covered: [N]
    partial: [N]
    gaps: [N]
    by_article: [list]

  compliance_metrics:
    coverage_percentage: [%]
    total_gaps: [N]
    critical_gaps: [N]
    high_gaps: [N]
    medium_gaps: [N]
    low_gaps: [N]
    total_artifacts: [N]
    verified_artifacts: [N]
    high_quality_artifacts: [N]
    total_plans: [N]
    critical_plans: [N]
    total_effort_hours: [N]
    compliance_ready_date: [date]
    timeline_feasible: [status]

  critical_findings: [list of 1-5 findings]

  counter_check_results:
    inconsistencies_found: [N]
    corrections_made: [N]
    findings_removed: [N]
```

UPDATE process state:
  findings_compiled: true
  critical_findings_count: [N]

> **HALT** — Output compiled.

---

## GATE_6A: Compilation → Calculation

**ENFORCEMENT:** ALL checklist items DONE before proceeding.

### Checklist

```
[ ] G6A.1: All process outputs loaded (steps 01-05)
[ ] G6A.2: Regulation metadata loaded
[ ] G6A.3: System metrics aggregated
[ ] G6A.4: Requirements metrics aggregated
[ ] G6A.5: Compliance metrics aggregated
[ ] G6A.6: Critical findings identified (1-5)
[ ] G6A.7: Counter-check executed (all 5 checks)
[ ] G6A.8: Numerical consistency verified
[ ] G6A.9: No missing data
[ ] G6A.10: assessment_findings compiled
```

### Gate Passage

```
EVALUATE:
  all_data_loaded = TRUE
  metrics_aggregated = TRUE
  findings_identified = (critical_findings_count >= 1)
  counter_check_passed = TRUE
  no_inconsistencies = (inconsistencies_found = 0 OR corrections_made = inconsistencies_found)

IF all TRUE:
  GATE_6A = OPEN
  OUTPUT: "GATE_6A OPEN - [N] findings, [%] coverage"
  PROCEED to step-06b-calculate.md

ELSE:
  GATE_6A = CLOSED
  OUTPUT: "GATE_6A CLOSED"
  OUTPUT: "Reason: [failed condition]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading all outputs:
  HALT
  OUTPUT: "VIOLATION: Section 6A.0 Load Process Outputs mandatory"
  RETURN to 6A.0

IF agent skips aggregation:
  HALT
  OUTPUT: "VIOLATION: Sections 6A.1-6A.3 Aggregate Metrics mandatory"
  RETURN to section where stopped

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6A.5 Counter-Check mandatory"
  RETURN to 6A.5

IF data inconsistent and not corrected:
  HALT
  OUTPUT: "VIOLATION: Must correct inconsistencies before proceeding"
  RETURN to 6A.5
```

---

**END OF STEP 6A**

**Next:** IF GATE_6A = OPEN → Load `steps/step-06b-calculate.md`
