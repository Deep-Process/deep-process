---
step: 6c
name: "Generate Report"
time_estimate: "25-40 minutes"
goal: "Generate compliance report files and package deliverables"
requires_completion: ["6a", "6b"]
next_steps:
  DEFAULT: null
gate: "GATE_6"
data_dependencies:
  - "assessment_findings from step-06a"
  - "compliance_status from step-06b"
  - "all process outputs"
outputs:
  - compliance_report_md
  - executive_summary_yaml
  - gap_analysis_csv
  - remediation_roadmap_md
  - evidence_inventory_yaml
---

# STEP 6C: GENERATE REPORT

## ENFORCEMENT RULES

```
1. GENERATE 5 deliverable files (not templates).
2. WRITE actual files to output directory.
3. VERIFY all files created and valid.
4. Counter-check MANDATORY - validate file contents.
5. NO proceeding until all deliverables verified.
```

---

## 6C.0 Load Required Data

**PRECONDITION:** GATE_6B = OPEN

IF GATE_6B ≠ OPEN → HALT with "ERROR: GATE_6B not open"

**Execute:**

```
LOAD from step-06a:
  [ ] assessment_findings
  [ ] system_summary
  [ ] requirements_summary
  [ ] compliance_metrics
  [ ] critical_findings

LOAD from step-06b:
  [ ] compliance_status
  [ ] compliance_level
  [ ] timeline

LOAD all process outputs:
  [ ] system_inventory (step-01)
  [ ] requirements_mapping (step-02)
  [ ] gap_analysis (step-03)
  [ ] evidence_collection (step-04)
  [ ] remediation_planning (step-05)

VERIFY all loaded:
  IF any missing → HALT
```

> **HALT** — Data loaded.

---

## 6C.1 Generate Main Report

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/compliance-report.md

WRITE frontmatter:
---
title: "[regulation_name] Compliance Assessment"
date: "[current date]"
regulation: [regulation_id]
compliance_percentage: [%]
compliance_level: [level]
critical_gaps: [N]
generated_by: "deep-compliance"
---

WRITE Section 1 - Executive Summary:
# Compliance Assessment Report

Assessment Date: [date]
Regulatory Framework: [regulation_name]
Enforcement Deadline: [date OR "N/A"]

## Overall Status

Compliance Level: [compliance_level]
Compliance Percentage: [%]
Readiness: [readiness_status]

## Systems Assessed

Total: [N]
High-Risk: [N]
General-Purpose: [N]

## Critical Findings

FOR each finding in critical_findings:
[N]. [finding.type] - [finding.description]

## Gap Summary

Critical: [N] - Immediate action required
High: [N] - Address within 30 days
Medium: [N] - Schedule next 90 days
Low: [N] - Backlog

## Remediation

Total Plans: [N]
Total Effort: [N] hours
Ready Date: [date]
Timeline Status: [status]

## Immediate Actions

FOR top 3 critical gaps:
[N]. [gap.requirement_id] - [gap.description]

WRITE Section 2 - System Inventory:
## System Inventory

Total systems: [N]

### High-Risk Systems

FOR each system WHERE classification = HIGH_RISK:
- [system_id]: [name] - [gap_count] gaps

### General-Purpose Systems

FOR each system WHERE classification = GENERAL_PURPOSE:
- [system_id]: [name] - [gap_count] gaps

WRITE Section 3 - Requirements Coverage:
## Requirements Coverage

Total: [N]
Applicable: [N]
Covered: [N] ([%]%)
Gaps: [N]

### By Article

FOR each article in requirements_summary.by_article:
- [article]: [total] total, [covered] covered, [gaps] gaps ([coverage_pct]%)

WRITE Section 4 - Gap Analysis:
## Gap Analysis

### Critical Gaps

FOR each gap WHERE severity = CRITICAL:
#### [gap.id]: [requirement.article]

Requirement: [requirement.text]
Gap: [gap.description]
Impact: [gap.impact_description]
Plan: [plan_id]
Owner: [owner]
Target: [date]

### High Priority Gaps

FOR each gap WHERE severity = HIGH:
[similar structure, more concise]

### Gap Distribution

FOR each system:
[system_id]: Critical=[N], High=[N], Medium=[N], Low=[N]

WRITE Section 5 - Evidence:
## Evidence Inventory

Total Artifacts: [N]
Verified: [N]
High Quality: [N]

### By Type

Documentation: [N]
Code: [N]
Testing: [N]
Operational: [N]
Process: [N]

WRITE Section 6 - Remediation:
## Remediation Roadmap

### Phase 1: Immediate (Days 1-30)

Objective: Address CRITICAL gaps
Duration: 30 days
Effort: [N] hours

Plans:
FOR each plan in phase_1:
- [plan_id]: [gap.article] - [effort] hours

### Phase 2: Urgent (Days 31-90)

[similar structure]

### Phase 3: Scheduled (Days 91-180)

[similar structure]

### Timeline

Compliance Ready: [date]
Full Compliance: [date]
Deadline: [date OR "N/A"]
Buffer: [N] days OR "At risk"

WRITE Section 7 - Recommendations:
## Recommendations

### Immediate (Next 7 Days)

FOR top 3 critical actions:
[N]. [action] - [effort] hours

### Short-Term (Next 30 Days)

FOR next 5 high priority actions:
[N]. [action] - [effort] hours

### Long-Term (Next 90 Days)

FOR strategic improvements:
[N]. [action]

CLOSE file
```

> **HALT** — Main report generated.

---

## 6C.2 Generate Executive Summary

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/executive-summary.yaml

WRITE:
compliance_summary:
  assessment_date: "[date]"
  regulation: [regulation_id]
  regulation_name: "[name]"

  status:
    percentage: [%]
    level: [level]
    readiness: [status]

  systems:
    total: [N]
    high_risk: [N]
    general_purpose: [N]

  requirements:
    total: [N]
    applicable: [N]
    covered: [N]
    gaps: [N]

  gap_severity:
    critical: [N]
    high: [N]
    medium: [N]
    low: [N]

  remediation:
    total_plans: [N]
    total_effort_hours: [N]
    compliance_ready_date: [date]
    timeline_status: [status]

  critical_findings:
    FOR each finding:
    - [finding.description]

  immediate_actions:
    FOR top 3 critical gaps:
    - [gap.requirement_id]: [gap.description]

CLOSE file
```

> **HALT** — Executive summary generated.

---

## 6C.3 Generate Gap Analysis CSV

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/gap-analysis.csv

WRITE header:
gap_id,requirement_id,article,system_id,severity,impact_score,urgency_score,detectability_score,description,plan_id,owner,target_date,effort_hours

WRITE rows:
FOR each gap in gap_analysis:
  [gap.id],[gap.requirement_id],[gap.article],[gap.system_id],[gap.severity],[gap.impact_score],[gap.urgency_score],[gap.detectability_score],"[gap.description]",[gap.plan_id],[plan.owner],[plan.target_date],[plan.effort_hours]

CLOSE file
```

> **HALT** — Gap CSV generated.

---

## 6C.4 Generate Remediation Roadmap

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/remediation-roadmap.md

WRITE:
# Remediation Roadmap

## Timeline

Total Plans: [N]
Total Effort: [N] hours
Compliance Ready: [date]

## Phase 1: Immediate (Days 1-30)

Objective: CRITICAL gaps
Duration: 30 days
Effort: [N] hours

### Plans

FOR each plan WHERE tier = TIER_1:
**[plan_id]** - [gap.article]
- Gap: [gap.description]
- Actions: [N]
- Effort: [N] hours
- Owner: [owner]
- Target: [date]

## Phase 2: Urgent (Days 31-90)

[similar structure for TIER_2]

## Phase 3: Scheduled (Days 91-180)

[similar structure for TIER_3]

## Phase 4: Backlog (Days 181+)

[similar structure for TIER_4]

## Resource Requirements

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|------|---------|---------|---------|---------|-------|
| Engineer | [N] | [N] | [N] | [N] | [N] |
| Technical Writer | [N] | [N] | [N] | [N] | [N] |
| QA Engineer | [N] | [N] | [N] | [N] | [N] |
| Compliance Officer | [N] | [N] | [N] | [N] | [N] |

CLOSE file
```

> **HALT** — Roadmap generated.

---

## 6C.5 Generate Evidence Inventory

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/evidence-inventory.yaml

WRITE:
evidence_inventory:
  assessment_date: "[date]"
  regulation: [regulation_id]

  summary:
    total_artifacts: [N]
    verified: [N]
    high_quality: [N]
    medium_quality: [N]
    low_quality: [N]

  artifacts:
    FOR each evidence in evidence_collection:
    - evidence_id: [id]
      requirement_id: [req_id]
      article: [article]
      system_id: [sys_id]
      artifact_type: [type]
      artifact_path: "[path]"
      quality_status: [status]
      staleness_status: [status]
      verification_status: [status]

CLOSE file
```

> **HALT** — Evidence inventory generated.

---

## 6C.6 Create Package README

**Execute:**

```
CREATE file: output/compliance-reports/[regulation]-[date]/README.md

WRITE:
# Compliance Assessment Report Package

Assessment Date: [date]
Regulation: [regulation_name]
Compliance Level: [level] ([%]%)

## Contents

1. compliance-report.md - Full report (7 sections)
2. executive-summary.yaml - Key metrics
3. gap-analysis.csv - Gap data
4. remediation-roadmap.md - Timeline
5. evidence-inventory.yaml - Evidence data

## Key Metrics

- Critical Gaps: [N]
- High Gaps: [N]
- Coverage: [%]%
- Ready Date: [date]

## Immediate Actions

FOR top 3:
[N]. [action]

CLOSE file
```

> **HALT** — README created.

---

## 6C.7 Counter-Check

**Execute all checks:**

### Check 1: Verify all files created

```
VERIFY files exist:
  [ ] compliance-report.md
  [ ] executive-summary.yaml
  [ ] gap-analysis.csv
  [ ] remediation-roadmap.md
  [ ] evidence-inventory.yaml
  [ ] README.md

IF any missing:
  LOG ERROR: "Missing file: [name]"
  HALT
```

### Check 2: Verify file sizes

```
FOR each file:
  READ file_size

  IF file_size = 0:
    LOG ERROR: "Empty file: [name]"
    HALT

  IF file_size < 100:
    LOG WARNING: "Suspiciously small: [name]"
```

### Check 3: Verify data consistency in files

```
READ compliance_percentage FROM compliance-report.md
READ compliance_percentage FROM executive-summary.yaml

IF values differ:
  LOG ERROR: "Inconsistent coverage % across files"
  HALT

READ critical_gaps FROM compliance-report.md
READ critical_gaps FROM executive-summary.yaml
COUNT critical gaps in gap-analysis.csv

IF values differ:
  LOG ERROR: "Inconsistent critical gap count"
  HALT
```

### Check 4: Verify CSV format

```
READ gap-analysis.csv

VERIFY:
  [ ] Header row present
  [ ] All data rows have same column count
  [ ] No empty required fields

IF format invalid:
  LOG ERROR: "CSV format error"
  HALT
```

### Check 5: Verify YAML format

```
FOR executive-summary.yaml, evidence-inventory.yaml:
  ATTEMPT parse as YAML

  IF parse fails:
    LOG ERROR: "Invalid YAML: [filename]"
    HALT
```

RECORD counter_check_results:
  files_verified: [N]
  errors_found: [N]

> **HALT** — Counter-check complete.

---

## 6C.8 Compile Final Output

**Execute:**

```
COMPUTE package metadata:
  total_files = 6
  package_path = "output/compliance-reports/[regulation]-[date]/"

  FOR each file:
    READ file_size
    total_size_bytes += file_size

RECORD deliverables:
  - path: compliance-report.md
    type: MARKDOWN
    size: [bytes]
  - path: executive-summary.yaml
    type: YAML
    size: [bytes]
  - path: gap-analysis.csv
    type: CSV
    size: [bytes]
  - path: remediation-roadmap.md
    type: MARKDOWN
    size: [bytes]
  - path: evidence-inventory.yaml
    type: YAML
    size: [bytes]
  - path: README.md
    type: MARKDOWN
    size: [bytes]

UPDATE process state:
  reporting_complete: true
  deliverables_generated: 6
  report_package_path: [path]
  process_complete_date: "[current date]"
```

> **HALT** — Final output compiled.

---

## GATE_6: Process Completion

**ENFORCEMENT:** ALL checklist items DONE.

### Checklist

```
[ ] G6.1: All data loaded (6a, 6b, all steps)
[ ] G6.2: Main report generated
[ ] G6.3: Executive summary generated
[ ] G6.4: Gap CSV generated
[ ] G6.5: Roadmap generated
[ ] G6.6: Evidence inventory generated
[ ] G6.7: README generated
[ ] G6.8: Counter-check executed (all 5 checks)
[ ] G6.9: All files verified (exist, valid format)
[ ] G6.10: Package metadata compiled
```

### Gate Passage

```
COUNT deliverables = 6

EVALUATE:
  all_files_created = (deliverables = 6)
  counter_check_passed = TRUE
  no_errors = (errors_found = 0)

IF all TRUE:
  GATE_6 = OPEN
  PROCESS_STATUS = COMPLETE

  OUTPUT: "GATE_6 OPEN - Deep-Compliance COMPLETE"
  OUTPUT: "Level: [compliance_level]"
  OUTPUT: "Coverage: [%]%"
  OUTPUT: "Critical Gaps: [N]"
  OUTPUT: "Package: [path]"

ELSE:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED"
  OUTPUT: "Files: [count]/6"
  OUTPUT: "Errors: [count]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading data:
  HALT
  OUTPUT: "VIOLATION: Section 6C.0 mandatory"
  RETURN to 6C.0

IF agent skips file generation:
  HALT
  OUTPUT: "VIOLATION: Must generate all 6 deliverables"
  OUTPUT: "Missing: [list files]"
  RETURN to section where file should be created

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6C.7 Counter-Check mandatory"
  RETURN to 6C.7

IF files invalid:
  HALT
  OUTPUT: "VIOLATION: Files must be valid format"
  RETURN to section where file created
```

---

**END OF STEP 6C**

**END OF DEEP-COMPLIANCE PROCESS**

**Result:** [compliance_level] at [%]%

**Deliverables:** [path] (6 files)
