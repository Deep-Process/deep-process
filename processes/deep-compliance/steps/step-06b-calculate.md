---
step: 6b
name: "Calculate Status"
time_estimate: "15-20 minutes"
goal: "Calculate compliance percentage, classify compliance level, estimate timeline to compliance"
requires_completion: ["6a"]
next_steps:
  DEFAULT: "steps/step-06c-report.md"
gate: "GATE_6B"
data_dependencies:
  - "assessment_findings from step-06a"
  - "data/regulations-info.yaml"
outputs:
  - compliance_status
  - compliance_level
  - timeline_estimate
---

# STEP 6B: CALCULATE STATUS

## ENFORCEMENT RULES

```
1. CALCULATE compliance percentage (exact formula).
2. CLASSIFY compliance level (exact thresholds).
3. ESTIMATE timeline (based on effort and capacity).
4. Counter-check MANDATORY - recalculate all values.
5. NO proceeding if calculations inconsistent.
```

---

## 6B.0 Load Required Data

**PRECONDITION:** GATE_6A = OPEN

IF GATE_6A ≠ OPEN → HALT with "ERROR: GATE_6A not open"

**Execute:**

```
LOAD from step-06a:
  [ ] assessment_findings
  [ ] compliance_metrics.coverage_percentage
  [ ] compliance_metrics.critical_gaps
  [ ] compliance_metrics.high_gaps
  [ ] compliance_metrics.total_effort_hours
  [ ] compliance_metrics.compliance_ready_date
  [ ] requirements_summary.applicable
  [ ] requirements_summary.covered

READ data/regulations-info.yaml:
  [ ] enforcement_deadline (if exists)

VERIFY all loaded:
  IF any missing → HALT
```

> **HALT** — Data loaded.

---

## 6B.1 Calculate Compliance Percentage

**Execute:**

```
EXTRACT values:
  total_applicable = requirements_summary.applicable
  fully_covered = requirements_summary.covered

COMPUTE:
  compliance_percentage = (fully_covered / total_applicable) * 100

ROUND to 1 decimal place

RECORD:
  compliance_percentage: [%]
  numerator: [fully_covered]
  denominator: [total_applicable]
```

> **HALT** — Percentage calculated.

---

## 6B.2 Classify Compliance Level

**Execute classification logic:**

```
EXTRACT:
  pct = compliance_percentage
  critical = critical_gaps
  high = high_gaps

APPLY rules:

IF pct >= 95 AND critical = 0 AND high = 0:
  compliance_level = COMPLIANT
  readiness_status = AUDIT_READY

ELIF pct >= 85 AND critical = 0 AND high <= 2:
  compliance_level = SUBSTANTIALLY_COMPLIANT
  readiness_status = NEAR_READY

ELIF pct >= 70 AND critical <= 2:
  compliance_level = PARTIALLY_COMPLIANT
  readiness_status = IN_PROGRESS

ELIF pct >= 50:
  compliance_level = MINIMALLY_COMPLIANT
  readiness_status = EARLY_STAGE

ELSE:
  compliance_level = NON_COMPLIANT
  readiness_status = NOT_READY

RECORD:
  compliance_level: [level]
  readiness_status: [status]
```

> **HALT** — Level classified.

---

## 6B.3 Estimate Timeline to Compliance

**Execute:**

```
EXTRACT:
  remaining_effort_hours = total_effort_hours
  compliance_ready_date = compliance_ready_date FROM step-05

DETERMINE capacity:
  available_capacity_hours_per_week = [from input OR estimate 40]

CALCULATE:
  weeks_to_compliance = CEILING(remaining_effort_hours / available_capacity_hours_per_week)
  estimated_compliance_date = current_date + (weeks_to_compliance * 7 days)

IF enforcement_deadline exists:
  days_until_deadline = enforcement_deadline - current_date
  days_buffer = enforcement_deadline - estimated_compliance_date

  CLASSIFY risk:
    IF days_buffer < 0:
      timeline_risk = HIGH
      timeline_status = AT_RISK

    ELIF days_buffer < 30:
      timeline_risk = MEDIUM
      timeline_status = TIGHT

    ELSE:
      timeline_risk = LOW
      timeline_status = ON_TRACK

ELSE:
  timeline_risk = null
  timeline_status = NO_DEADLINE

RECORD:
  remaining_effort_hours: [N]
  available_capacity_weekly: [N]
  weeks_to_compliance: [N]
  estimated_compliance_date: [date]
  enforcement_deadline: [date OR null]
  days_until_deadline: [N OR null]
  days_buffer: [N OR null]
  timeline_risk: [HIGH/MEDIUM/LOW/null]
  timeline_status: [status]
```

> **HALT** — Timeline estimated.

---

## 6B.4 Counter-Check

**Execute all checks:**

### Check 1: Recalculate compliance percentage

```
RECOMPUTE:
  check_pct = (fully_covered / total_applicable) * 100

COMPARE:
  IF ABS(compliance_percentage - check_pct) > 0.01:
    LOG ERROR: "Compliance % mismatch"
    CORRECT compliance_percentage = check_pct
```

### Check 2: Verify classification logic

```
REAPPLY classification rules to compliance_percentage, critical_gaps, high_gaps

COMPARE result to recorded compliance_level

IF mismatch:
  LOG ERROR: "Classification error"
  CORRECT compliance_level and readiness_status
```

### Check 3: Verify timeline calculation

```
RECOMPUTE:
  check_weeks = CEILING(remaining_effort_hours / available_capacity_weekly)
  check_date = current_date + (check_weeks * 7)

COMPARE to estimated_compliance_date

IF dates differ by > 1 day:
  LOG ERROR: "Timeline calculation error"
  CORRECT estimated_compliance_date = check_date
```

### Check 4: Verify deadline analysis

```
IF enforcement_deadline exists:
  RECOMPUTE:
    check_buffer = enforcement_deadline - estimated_compliance_date

  COMPARE to days_buffer

  IF ABS(days_buffer - check_buffer) > 0:
    LOG ERROR: "Buffer calculation error"
    CORRECT days_buffer = check_buffer

  REAPPLY risk classification

  COMPARE to timeline_risk

  IF mismatch:
    LOG ERROR: "Risk classification error"
    CORRECT timeline_risk and timeline_status
```

RECORD counter_check_results:
  errors_found: [N]
  corrections_made: [N]

> **HALT** — Counter-check complete.

---

## 6B.5 Compile Status Output

**Execute:**

```yaml
compliance_status:
  assessed_date: "[current date]"

  current_state:
    compliance_percentage: [%]
    compliance_level: [level]
    readiness_status: [status]

  gap_summary:
    total_gaps: [N]
    critical_gaps: [N]
    high_gaps: [N]
    medium_gaps: [N]
    low_gaps: [N]

  timeline:
    remaining_effort_hours: [N]
    available_capacity_weekly: [N]
    weeks_to_compliance: [N]
    estimated_compliance_date: [date]

  deadline_analysis:
    enforcement_deadline: [date OR null]
    days_until_deadline: [N OR null]
    days_buffer: [N OR null]
    timeline_risk: [level OR null]
    timeline_status: [status]

  counter_check_results:
    errors_found: [N]
    corrections_made: [N]
```

UPDATE process state:
  status_calculated: true
  compliance_percentage: [%]
  compliance_level: [level]
  timeline_status: [status]

> **HALT** — Status compiled.

---

## GATE_6B: Calculation → Reporting

**ENFORCEMENT:** ALL checklist items DONE before proceeding.

### Checklist

```
[ ] G6B.1: assessment_findings loaded from 6A
[ ] G6B.2: Compliance percentage calculated
[ ] G6B.3: Compliance level classified
[ ] G6B.4: Timeline estimated
[ ] G6B.5: Deadline analysis performed (if applicable)
[ ] G6B.6: Counter-check executed (all 4 checks)
[ ] G6B.7: All calculations verified
[ ] G6B.8: No calculation errors remain
[ ] G6B.9: compliance_status compiled
[ ] G6B.10: Process state updated
```

### Gate Passage

```
EVALUATE:
  percentage_calculated = TRUE
  level_classified = TRUE
  timeline_estimated = TRUE
  counter_check_passed = TRUE
  no_errors = (errors_found = 0 OR corrections_made = errors_found)

IF all TRUE:
  GATE_6B = OPEN
  OUTPUT: "GATE_6B OPEN - [level] at [%]%"
  PROCEED to step-06c-report.md

ELSE:
  GATE_6B = CLOSED
  OUTPUT: "GATE_6B CLOSED"
  OUTPUT: "Reason: [failed condition]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading data:
  HALT
  OUTPUT: "VIOLATION: Section 6B.0 Load Required Data mandatory"
  RETURN to 6B.0

IF agent skips percentage calculation:
  HALT
  OUTPUT: "VIOLATION: Section 6B.1 Calculate Compliance Percentage mandatory"
  RETURN to 6B.1

IF agent skips classification:
  HALT
  OUTPUT: "VIOLATION: Section 6B.2 Classify Compliance Level mandatory"
  RETURN to 6B.2

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6B.4 Counter-Check mandatory"
  RETURN to 6B.4

IF calculations inconsistent:
  HALT
  OUTPUT: "VIOLATION: Must correct calculation errors"
  RETURN to 6B.4
```

---

**END OF STEP 6B**

**Next:** IF GATE_6B = OPEN → Load `steps/step-06c-report.md`
