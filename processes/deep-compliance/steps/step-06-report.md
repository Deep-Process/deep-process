---
step: 6
name: "Compliance Reporting"
time_estimate: "60-90 minutes"
goal: "Generate comprehensive compliance report with findings, gaps, plans and readiness assessment"
requires_completion: [5]
next_steps:
  DEFAULT: null
gate: "GATE_6"
data_dependencies:
  - "all outputs from steps 01-05"
outputs:
  - compliance_report
  - executive_summary
  - gap_analysis_csv
  - remediation_roadmap
  - evidence_inventory
---

# STEP 6: COMPLIANCE REPORTING

## ENFORCEMENT RULES

```
1. Report MUST include ALL 7 sections (no partial reports).
2. All numbers MUST be consistent across sections (cross-verify calculations).
3. Findings MUST be data-driven with specific references.
4. Recommendations MUST be actionable (no generic advice).
5. Compliance percentage MUST be accurately calculated.
6. Counter-check MANDATORY - verify report accuracy.
7. NO proceeding to GATE_6 until report complete and verified.
```

---

## 6.0 Load Required Data

**PRECONDITION:** GATE_5 = OPEN

IF GATE_5 ≠ OPEN → HALT with "ERROR: GATE_5 not open"

**Execute these steps in this order:**

### Step 1: Load all process outputs

```
LOAD from step-01 (System Inventory):
  [ ] system_inventory
  [ ] total_systems: [count]
  [ ] high_risk_systems: [count]
  [ ] general_purpose_systems: [count]

LOAD from step-02 (Requirements Mapping):
  [ ] requirements_mapping
  [ ] regulation: [regulation_id]
  [ ] total_requirements: [count]
  [ ] applicable_requirements: [count]

LOAD from step-03 (Gap Analysis):
  [ ] gap_analysis
  [ ] covered_requirements: [count]
  [ ] partial_requirements: [count]
  [ ] gap_requirements: [count]
  [ ] critical_gaps: [count]
  [ ] high_gaps: [count]
  [ ] medium_gaps: [count]
  [ ] low_gaps: [count]

LOAD from step-04 (Evidence Collection):
  [ ] evidence_collection
  [ ] total_evidence_artifacts: [count]
  [ ] verified_evidence: [count]
  [ ] coverage_rate: [percentage]

LOAD from step-05 (Remediation Planning):
  [ ] remediation_planning
  [ ] total_plans: [count]
  [ ] total_effort_hours: [hours]
  [ ] compliance_ready_date: [date]
  [ ] timeline_feasible: [YES/NO/AT_RISK]
```

### Step 2: Load regulation metadata

```
READ: data/regulations-info.yaml

EXTRACT for current regulation:
  [ ] regulation_name: [name]
  [ ] enforcement_deadline: [date if applicable]
  [ ] regulatory_authority: [authority]
```

### Step 3: Verify data completeness

```
VERIFY all required data loaded:
  [ ] System inventory: present
  [ ] Requirements mapping: present
  [ ] Gap analysis: present
  [ ] Evidence collection: present
  [ ] Remediation planning: present
  [ ] Regulation metadata: present

IF any data missing:
  LOG ERROR: "Missing required data: [list]"
  HALT
```

> **HALT** — Confirm all data loaded before proceeding.

---

## 6.1 Compile Assessment Findings

**Execute:**

### Step 1: Aggregate system metrics

```
COMPUTE system summary:
```yaml
system_summary:
  total_systems: [count from step-01]
  by_classification:
    high_risk: [count]
    general_purpose: [count]

  by_deployment_status:
    production: [count where status = PRODUCTION]
    staging: [count where status = STAGING]
    development: [count where status = DEVELOPMENT]

  top_systems_by_risk:
    - system_id: [S1.id]
      classification: HIGH_RISK
      capabilities_count: [count]
      gaps_count: [count from gap analysis]

    - system_id: [S2.id]
      # ... (top 5 systems)
```
```

### Step 2: Aggregate requirements metrics

```
COMPUTE requirements summary:
```yaml
requirements_summary:
  regulation: [regulation_id]
  regulation_name: [name]

  total_requirements: [count]
  by_applicability:
    applicable: [count where applicability = MANDATORY]
    conditional: [count where applicability = CONDITIONAL]
    not_applicable: [count where applicability = NOT_APPLICABLE]

  by_article:
    - article: "Article 9"
      requirements: [count for Article 9]
      covered: [count where status = COVERED]
      gaps: [count where status = GAP]

    - article: "Article 10"
      # ... (for each article)

  compliance_distribution:
    covered: [count where status = COVERED]
    partial: [count where status = PARTIAL]
    gaps: [count where status = GAP]
```
```

### Step 3: Aggregate compliance metrics

```
COMPUTE compliance summary:
```yaml
compliance_summary:
  assessment_date: "[current date]"
  assessment_scope: "[description of what was assessed]"

  coverage_metrics:
    total_applicable: [count]
    fully_covered: [count where status = COVERED]
    partially_covered: [count where status = PARTIAL]
    not_covered: [count where status = GAP]

    coverage_percentage: [(fully_covered / total_applicable) * 100]%

  gap_severity_breakdown:
    critical: [count]
    high: [count]
    medium: [count]
    low: [count]

  evidence_metrics:
    total_artifacts: [count]
    verified_artifacts: [count]
    high_quality_artifacts: [count where quality = HIGH]
    evidence_coverage_rate: [percentage]%

  remediation_metrics:
    total_plans: [count]
    critical_plans: [count]
    high_plans: [count]
    total_effort_hours: [hours]
    compliance_ready_date: [date]
```
```

### Step 4: Identify critical findings

```
SELECT top critical findings:

  FINDING 1: Highest severity gap
    gap = SELECT TOP 1 FROM gaps ORDER BY severity_score DESC

    critical_finding_1:
      type: "CRITICAL_GAP"
      requirement: [gap.requirement_id]
      article: [gap.article]
      description: "[gap.description]"
      impact: "[gap.impact_description]"
      recommended_action: "[from remediation plan]"

  FINDING 2: Most detectability gaps (auditor will find)
    gaps_detectable = SELECT FROM gaps WHERE detectability_score >= 4

    critical_finding_2:
      type: "HIGH_DETECTABILITY_GAPS"
      count: [count of highly detectable gaps]
      examples: [list top 3]
      risk: "Auditor will immediately identify these gaps"

  FINDING 3: Timeline risk
    IF compliance_ready_date > enforcement_deadline:
      critical_finding_3:
        type: "DEADLINE_RISK"
        compliance_ready: [date]
        deadline: [date]
        shortfall_days: [days]
        required_action: "Increase capacity by [X] hours/week"

  FINDING 4: Evidence quality issues
    low_quality_evidence = COUNT WHERE quality = LOW OR INSUFFICIENT

    IF low_quality_evidence > total_artifacts * 0.2:
      critical_finding_4:
        type: "EVIDENCE_QUALITY"
        low_quality_count: [count]
        percentage: [percentage]
        impact: "May not withstand audit scrutiny"

  FINDING 5: Coverage threshold
    IF coverage_percentage < 95%:
      critical_finding_5:
        type: "COVERAGE_BELOW_TARGET"
        current_coverage: [percentage]%
        target_coverage: 95%
        gap_count: [requirements needed for 95%]

RECORD critical findings:
  critical_findings: [list of findings 1-5 that apply]
```

### Step 5: Record compiled findings

```yaml
assessment_findings:
  assessment_date: "[date]"
  systems_summary: [from step 1]
  requirements_summary: [from step 2]
  compliance_summary: [from step 3]
  critical_findings: [from step 4]
```

> **HALT** — Confirm findings compiled.

---

## 6.2 Calculate Compliance Status

**Execute:**

### Step 1: Compute compliance percentage

```
CALCULATE baseline compliance:

  total_applicable_requirements = COUNT WHERE applicability = MANDATORY
  fully_covered_requirements = COUNT WHERE status = COVERED

  compliance_percentage = (fully_covered_requirements / total_applicable_requirements) * 100

RECORD:
  Compliance percentage: [percentage]%
  Numerator (covered): [fully_covered_requirements]
  Denominator (applicable): [total_applicable_requirements]
```

### Step 2: Classify compliance level

```
DETERMINE compliance level based on percentage and gaps:

  IF compliance_percentage >= 95% AND critical_gaps = 0 AND high_gaps = 0:
    compliance_level = "COMPLIANT"
    readiness_status = "AUDIT_READY"
    description = "System meets regulatory requirements and is ready for audit"

  ELIF compliance_percentage >= 85% AND critical_gaps = 0 AND high_gaps <= 2:
    compliance_level = "SUBSTANTIALLY_COMPLIANT"
    readiness_status = "NEAR_READY"
    description = "System substantially compliant with minor gaps remaining"

  ELIF compliance_percentage >= 70% AND critical_gaps <= 2:
    compliance_level = "PARTIALLY_COMPLIANT"
    readiness_status = "IN_PROGRESS"
    description = "Significant compliance progress made but important gaps remain"

  ELIF compliance_percentage >= 50%:
    compliance_level = "MINIMALLY_COMPLIANT"
    readiness_status = "EARLY_STAGE"
    description = "Basic compliance framework in place but substantial work needed"

  ELSE:
    compliance_level = "NON_COMPLIANT"
    readiness_status = "NOT_READY"
    description = "System does not meet minimum compliance requirements"

RECORD compliance classification
```

### Step 3: Estimate time to full compliance

```
COMPUTE time to compliance:

  remaining_effort_hours = SUM(plan.total_effort_hours WHERE status != COMPLETED)

  DETERMINE available capacity:
    # This would come from resource planning
    # For process: use estimated capacity
    available_capacity_hours_per_week = [estimated or provided]

  CALCULATE timeline:
    weeks_to_compliance = CEILING(remaining_effort_hours / available_capacity_hours_per_week)
    estimated_compliance_date = current_date + (weeks_to_compliance * 7 days)

  IF enforcement_deadline exists:
    days_until_deadline = enforcement_deadline - current_date
    days_buffer = enforcement_deadline - estimated_compliance_date

    IF days_buffer < 0:
      timeline_risk = "HIGH"
      timeline_status = "AT_RISK"
      recommendation = "Critical: Increase capacity to meet deadline"

    ELIF days_buffer < 30:
      timeline_risk = "MEDIUM"
      timeline_status = "TIGHT"
      recommendation = "Monitor closely: Limited buffer before deadline"

    ELSE:
      timeline_risk = "LOW"
      timeline_status = "ON_TRACK"
      recommendation = "Adequate buffer for planned remediation"

RECORD timeline estimate
```

### Step 4: Create compliance status output

```yaml
compliance_status:
  assessed_date: "[current date]"

  current_state:
    compliance_percentage: [percentage]%
    compliance_level: COMPLIANT | SUBSTANTIALLY | PARTIALLY | MINIMALLY | NON_COMPLIANT
    readiness_status: AUDIT_READY | NEAR_READY | IN_PROGRESS | EARLY_STAGE | NOT_READY
    description: "[description]"

  gap_summary:
    total_gaps: [count]
    critical_gaps: [count]
    high_gaps: [count]
    medium_gaps: [count]
    low_gaps: [count]

  timeline:
    remaining_effort_hours: [hours]
    available_capacity_weekly: [hours]
    weeks_to_compliance: [weeks]
    estimated_compliance_date: [date]

  deadline_analysis:
    enforcement_deadline: [date if applicable]
    days_until_deadline: [days]
    days_buffer: [days]
    timeline_risk: HIGH | MEDIUM | LOW
    timeline_status: AT_RISK | TIGHT | ON_TRACK

  recommendation: "[specific recommendation based on status]"
```

> **HALT** — Confirm compliance status calculated.

---

## 6.3 Generate Comprehensive Report

**Execute:**

### SECTION 1: Executive Summary

```markdown
# Compliance Assessment Report

## Executive Summary

**Assessment Date:** [current date]
**Regulatory Framework:** [regulation_name]
**Enforcement Deadline:** [date if applicable]

### Overall Compliance Status

**Compliance Level:** [compliance_level]
**Compliance Percentage:** [percentage]%
**Readiness Status:** [readiness_status]

### Systems Assessed

- **Total Systems:** [count]
- **High-Risk Systems:** [count]
- **General-Purpose Systems:** [count]

### Key Findings

**Critical Findings:**
1. [critical_finding_1.description]
2. [critical_finding_2.description]
3. [critical_finding_3.description]

**Gap Summary:**
- Critical Gaps: [count] - Require immediate attention
- High Priority Gaps: [count] - Address within 30 days
- Total Requirements Assessed: [count]
- Requirements Fully Covered: [count] ([percentage]%)

### Remediation Overview

**Planned Remediation:**
- Total Remediation Plans: [count]
- Total Effort Required: [hours] hours
- Estimated Timeline: [weeks] weeks
- Compliance Ready Date: [date]

**Timeline Assessment:**
- Days Until Deadline: [days]
- Timeline Status: [status]
- Risk Level: [risk]

### Immediate Actions Required

1. [Action 1 from critical gaps]
2. [Action 2 from critical gaps]
3. [Action 3 from high gaps]

### Recommendation

[Specific, actionable recommendation based on compliance status and timeline]
```

### SECTION 2: System Inventory

```markdown
## System Inventory

### Overview

Total systems assessed: [count]

### Systems by Classification

#### High-Risk AI Systems ([count])

| System ID | Name | Risk Classification | Annex III Category | Gaps |
|-----------|------|--------------------|--------------------|------|
FOR each system WHERE classification = HIGH_RISK:
| [system.id] | [system.name] | HIGH_RISK | [category] | [gap_count] |

#### General-Purpose AI Systems ([count])

| System ID | Name | Model Type | Deployment | Gaps |
|-----------|------|------------|------------|------|
FOR each system WHERE classification = GENERAL_PURPOSE:
| [system.id] | [system.name] | [type] | [deployment] | [gap_count] |

### System Details

FOR each system:
#### System: [system.id]

- **Name:** [system.name]
- **Classification:** [classification]
- **Deployment Status:** [status]
- **Capabilities:** [count]
- **Requirements Applicable:** [count]
- **Requirements Covered:** [count]
- **Gaps Identified:** [count]
- **Highest Severity Gap:** [severity]
```

### SECTION 3: Requirements Mapping

```markdown
## Requirements Mapping

### Overview

- **Regulation:** [regulation_name]
- **Total Requirements:** [count]
- **Applicable Requirements:** [count]
- **Not Applicable:** [count]

### Requirements by Article

FOR each article:
#### [Article Name]

**Requirements:** [count]
**Covered:** [count]
**Partial:** [count]
**Gaps:** [count]
**Coverage:** [percentage]%

##### Requirement Details

FOR each requirement in article:
| ID | Requirement | Status | Evidence | Gap Severity |
|----|-------------|--------|----------|--------------|
| [req.id] | [req.text] | [status] | [evidence_count] | [severity if gap] |

### Coverage Summary by Status

| Status | Count | Percentage |
|--------|-------|------------|
| Covered | [count] | [percentage]% |
| Partial | [count] | [percentage]% |
| Gap | [count] | [percentage]% |

### Top 10 Requirements at Risk

FOR top 10 requirements with highest severity gaps:
1. **[requirement.id]** ([article]) - Severity: [severity]
   - Gap: [description]
   - Impact: [impact]
   - Plan: [plan_id]
```

### SECTION 4: Gap Analysis

```markdown
## Gap Analysis

### Gap Summary

| Severity | Count | Percentage | Avg Remediation Effort |
|----------|-------|------------|------------------------|
| CRITICAL | [count] | [%] | [hours] |
| HIGH | [count] | [%] | [hours] |
| MEDIUM | [count] | [%] | [hours] |
| LOW | [count] | [%] | [hours] |
| **TOTAL** | [total] | 100% | [total_hours] |

### Critical Gaps (Immediate Action Required)

FOR each gap WHERE severity = CRITICAL:
#### Gap [gap.id]: [requirement.article]

**Requirement:** [requirement.text]

**Gap Description:** [gap.description]

**Impact:** [gap.impact_description]

**Detectability:** [detectability_status] - Auditor will [likely/unlikely] identify

**Remediation:**
- Plan ID: [plan_id]
- Estimated Effort: [effort_hours] hours
- Owner: [primary_owner]
- Target Completion: [completion_date]
- Actions: [count actions]

**Acceptance Criteria:**
FOR each criterion:
- [criterion]

---

### High Priority Gaps

FOR each gap WHERE severity = HIGH:
[Similar format as critical gaps, but more concise]

### Gap Distribution by System

| System ID | Critical | High | Medium | Low | Total |
|-----------|----------|------|--------|-----|-------|
FOR each system:
| [system.id] | [count] | [count] | [count] | [count] | [total] |
```

### SECTION 5: Evidence Inventory

```markdown
## Evidence Inventory

### Evidence Summary

| Metric | Count |
|--------|-------|
| Total Evidence Artifacts | [count] |
| Verified Evidence | [count] |
| High Quality Evidence | [count] |
| Medium Quality Evidence | [count] |
| Low Quality Evidence | [count] |
| Stale Evidence (>1 year) | [count] |

### Evidence by Type

| Type | Count | Avg Quality | Avg Freshness |
|------|-------|-------------|---------------|
| Documentation | [count] | [score] | [score] |
| Code | [count] | [score] | [score] |
| Testing | [count] | [score] | [score] |
| Operational | [count] | [score] | [score] |
| Process | [count] | [score] | [score] |

### Evidence Coverage by Requirement

FOR each requirement WHERE status = COVERED:
#### [requirement.id] - [article]

**Evidence Artifacts:** [count]

FOR each evidence artifact:
- **[evidence.id]** - [artifact_type]
  - Location: [path]
  - Quality: [quality_status]
  - Freshness: [staleness_status]
  - Description: [description]

### Evidence Quality Issues

FOR each evidence WHERE quality = LOW OR INSUFFICIENT:
- **[evidence.id]** - [requirement.id]
  - Issue: [quality issue description]
  - Recommendation: [what to improve]
```

### SECTION 6: Remediation Roadmap

```markdown
## Remediation Roadmap

### Timeline Overview

```mermaid
gantt
    title Compliance Remediation Timeline
    dateFormat YYYY-MM-DD

    section Phase 1 - Immediate
    FOR each plan in phase_1:
    [plan.gap_id] : [start_date], [duration]d

    section Phase 2 - Urgent
    FOR each plan in phase_2:
    [plan.gap_id] : [start_date], [duration]d

    section Phase 3 - Scheduled
    FOR each plan in phase_3:
    [plan.gap_id] : [start_date], [duration]d
```

### Phase 1: Immediate (Days 1-30)

**Objective:** Address all CRITICAL gaps
**Duration:** 30 days
**Total Effort:** [hours] hours
**Completion Date:** [date]

#### Plans in Phase 1

FOR each plan in phase_1:
**Plan [plan_id]** - [gap.requirement.article]
- Gap: [gap.description]
- Actions: [count]
- Effort: [hours] hours
- Owner: [owner]
- Start: [start_date]
- Complete: [completion_date]

**Key Milestones:**
- [Milestone 1]
- [Milestone 2]

### Phase 2: Urgent (Days 31-90)

**Objective:** Address all HIGH priority gaps
**Duration:** 60 days
**Total Effort:** [hours] hours
**Completion Date:** [date]

[Similar format as Phase 1]

### Phase 3: Scheduled (Days 91-180)

**Objective:** Address MEDIUM priority gaps
**Duration:** 90 days
**Total Effort:** [hours] hours
**Completion Date:** [date]

[Similar format]

### Phase 4: Backlog (Days 181+)

**Objective:** Address remaining LOW priority gaps
**Duration:** Flexible
**Total Effort:** [hours] hours

### Resource Requirements

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|------|---------|---------|---------|---------|-------|
| Engineer | [hours] | [hours] | [hours] | [hours] | [hours] |
| Technical Writer | [hours] | [hours] | [hours] | [hours] | [hours] |
| QA Engineer | [hours] | [hours] | [hours] | [hours] | [hours] |
| Compliance Officer | [hours] | [hours] | [hours] | [hours] | [hours] |

### Timeline Risks

FOR each identified risk:
- **[Risk]:** [description]
  - Impact: [impact]
  - Mitigation: [mitigation strategy]
```

### SECTION 7: Recommendations

```markdown
## Recommendations

### Immediate Actions (Next 7 Days)

FOR top 3 critical items:
1. **[Action]**
   - Why: [justification]
   - How: [approach]
   - Owner: [who]
   - Effort: [hours]
   - Impact: [expected outcome]

### Short-Term Actions (Next 30 Days)

FOR next 3-5 high priority items:
[Similar format]

### Long-Term Actions (Next 90 Days)

FOR strategic improvements:
[Similar format]

### Governance Recommendations

1. **Establish Compliance Governance**
   - Create compliance steering committee
   - Define roles and responsibilities
   - Schedule regular compliance reviews

2. **Continuous Compliance Monitoring**
   - Implement automated compliance checks
   - Establish compliance metrics dashboard
   - Schedule quarterly reassessments

3. **Documentation and Training**
   - Create compliance documentation repository
   - Develop compliance training program
   - Establish documentation standards

### Resource Recommendations

Based on timeline analysis:
- **Current Capacity:** [hours/week]
- **Required Capacity:** [hours/week]
- **Gap:** [hours/week]
- **Recommendation:** [how to close gap]

### Risk Mitigation

FOR each major risk:
**Risk:** [risk description]
- Likelihood: [LOW/MEDIUM/HIGH]
- Impact: [LOW/MEDIUM/HIGH]
- Mitigation: [strategy]
- Contingency: [backup plan]
```

> **HALT** — Confirm all 7 sections generated.

---

## 6.4 Create Deliverable Artifacts

**Execute:**

### Artifact 1: Main compliance report (Markdown)

```
CREATE FILE: compliance-report-[regulation]-[date].md

CONTENT:
  - All 7 sections from 6.3
  - YAML frontmatter with metadata
  - Proper markdown formatting
  - Links to evidence and plans

FRONTMATTER:
```yaml
---
title: "[Regulation] Compliance Assessment Report"
date: "[current date]"
regulation: [regulation_id]
regulation_name: "[name]"
assessment_scope: "[description]"
compliance_percentage: [percentage]
compliance_level: [level]
critical_gaps: [count]
high_gaps: [count]
compliance_ready_date: [date]
generated_by: "deep-compliance process"
---
```

SAVE to: output/compliance-reports/[date]/
```

### Artifact 2: Executive summary (YAML)

```
CREATE FILE: compliance-summary-[regulation]-[date].yaml

CONTENT:
```yaml
compliance_summary:
  assessment_date: "[date]"
  regulation: [regulation_id]
  regulation_name: "[name]"

  compliance_status:
    percentage: [percentage]
    level: [level]
    readiness: [status]

  systems:
    total: [count]
    high_risk: [count]
    general_purpose: [count]

  requirements:
    total: [count]
    applicable: [count]
    covered: [count]
    partial: [count]
    gaps: [count]

  gap_severity:
    critical: [count]
    high: [count]
    medium: [count]
    low: [count]

  remediation:
    total_plans: [count]
    total_effort_hours: [hours]
    compliance_ready_date: [date]
    timeline_status: [status]

  critical_findings:
    - [finding 1]
    - [finding 2]
    - [finding 3]

  immediate_actions:
    - [action 1]
    - [action 2]
    - [action 3]
```

SAVE to: output/compliance-reports/[date]/
```

### Artifact 3: Gap analysis (CSV)

```
CREATE FILE: gap-analysis-[regulation]-[date].csv

COLUMNS:
  gap_id, requirement_id, article, system_id, severity, impact_score, urgency_score, detectability_score, description, plan_id, owner, target_date, effort_hours

FOR each gap:
  WRITE CSV row with all fields

SAVE to: output/compliance-reports/[date]/
```

### Artifact 4: Remediation roadmap (Markdown)

```
CREATE FILE: remediation-roadmap-[regulation]-[date].md

CONTENT:
  - Section 6 from main report (Remediation Roadmap)
  - Gantt chart visualization
  - Phase details
  - Resource requirements
  - Timeline risks

SAVE to: output/compliance-reports/[date]/
```

### Artifact 5: Evidence inventory (YAML)

```
CREATE FILE: evidence-inventory-[regulation]-[date].yaml

CONTENT:
```yaml
evidence_inventory:
  assessment_date: "[date]"
  regulation: [regulation_id]

  summary:
    total_artifacts: [count]
    verified: [count]
    high_quality: [count]
    medium_quality: [count]
    low_quality: [count]

  artifacts:
    FOR each evidence_artifact:
    - evidence_id: [id]
      requirement_id: [req_id]
      article: [article]
      system_id: [sys_id]
      artifact_type: [type]
      artifact_path: "[path]"
      quality_status: [status]
      staleness_status: [status]
      verification_status: [status]
      description: "[description]"
```

SAVE to: output/compliance-reports/[date]/
```

RECORD all artifact paths:
```yaml
deliverables_created:
  - path: compliance-report-[regulation]-[date].md
    type: MARKDOWN_REPORT
    size_bytes: [size]

  - path: compliance-summary-[regulation]-[date].yaml
    type: YAML_SUMMARY
    size_bytes: [size]

  - path: gap-analysis-[regulation]-[date].csv
    type: CSV_DATA
    size_bytes: [size]

  - path: remediation-roadmap-[regulation]-[date].md
    type: MARKDOWN_ROADMAP
    size_bytes: [size]

  - path: evidence-inventory-[regulation]-[date].yaml
    type: YAML_INVENTORY
    size_bytes: [size]
```

> **HALT** — Confirm all deliverables created.

---

## 6.5 Counter-Check

**REQUIREMENT:** Verify report accuracy and completeness.

**Execute these checks:**

### Check 1: Data Consistency Validation

```
VERIFY numerical consistency:

  CHECK 1: Requirements total
    total = covered + partial + gaps
    VERIFY: total_requirements = covered_requirements + partial_requirements + gap_requirements

    IF inconsistent:
      LOG ERROR: "Requirements totals do not match"
      IDENTIFY: Source of discrepancy
      CORRECT: Numbers

  CHECK 2: Gap severity total
    total_gaps = critical + high + medium + low
    VERIFY: gap_requirements = critical_gaps + high_gaps + medium_gaps + low_gaps

    IF inconsistent:
      LOG ERROR: "Gap severity counts do not sum correctly"
      CORRECT: Numbers

  CHECK 3: Compliance percentage
    RECOMPUTE: (covered_requirements / applicable_requirements) * 100
    COMPARE: Against reported compliance_percentage

    IF discrepancy > 0.1%:
      LOG ERROR: "Compliance percentage calculation error"
      CORRECT: To accurate value

  CHECK 4: Evidence coverage
    VERIFY: evidence_artifacts mapped to requirements correctly
    VERIFY: Coverage rate calculation accurate

  CHECK 5: Effort totals
    total_effort = SUM(all plan efforts)
    VERIFY: Matches reported total

FOR each inconsistency found:
  CORRECT: Value
  DOCUMENT: What was corrected
  UPDATE: All dependent sections
```

### Check 2: Completeness Verification

```
VERIFY all required sections present:

  CHECKLIST:
    [ ] Section 1: Executive Summary - complete with all subsections
    [ ] Section 2: System Inventory - all systems included
    [ ] Section 3: Requirements Mapping - all requirements mapped
    [ ] Section 4: Gap Analysis - all gaps detailed
    [ ] Section 5: Evidence Inventory - all evidence listed
    [ ] Section 6: Remediation Roadmap - all phases defined
    [ ] Section 7: Recommendations - actionable recommendations provided

  FOR each missing section or subsection:
    COMPLETE: Missing content using source data
    VERIFY: Completeness

  VERIFY subsection completeness:
    [ ] All critical gaps detailed in Section 4
    [ ] All remediation plans included in Section 6
    [ ] All critical findings listed in Section 1
    [ ] All recommendations are actionable
```

### Check 3: Accuracy of Critical Findings

```
FOR each critical_finding:

  VERIFY finding supported by data:

    TRACE finding to source:
      - Gap analysis data
      - Severity scores
      - Impact assessments

    VERIFY:
      [ ] Finding accurately describes gap
      [ ] Severity justified by scores
      [ ] Impact description factual
      [ ] Recommendation aligned with remediation plan

    IF finding unsupported or inaccurate:
      OPTION 1: Find supporting data
      OPTION 2: Revise finding to match data
      OPTION 3: Remove finding if cannot justify

    IF finding supported:
      CONFIRM: Finding accurate and justified
```

### Check 4: Actionability of Recommendations

```
FOR each recommendation:

  EVALUATE actionability:

    CRITERIA:
      [ ] Specific (not vague like "improve security")
      [ ] Measurable (can determine if done)
      [ ] Assignable (clear who should do it)
      [ ] Realistic (achievable given constraints)
      [ ] Time-bound (has timeframe)

  COUNT passing_criteria

  IF passing_criteria < 3:
    REFINE recommendation:
      - Add specificity
      - Add measurable outcomes
      - Add ownership
      - Add timeframe
      - Add concrete steps

  IF passing_criteria >= 3:
    CONFIRM: Recommendation actionable

VERIFY at least 3 immediate actions listed
VERIFY at least 5 short-term actions listed
```

### Check 5: Cross-Reference Validation

```
VERIFY cross-references accurate:

  CHECK: All referenced gap IDs exist
    FOR each gap_id mentioned in report:
      VERIFY: Gap exists in gap analysis

  CHECK: All referenced plan IDs exist
    FOR each plan_id mentioned in report:
      VERIFY: Plan exists in remediation planning

  CHECK: All referenced evidence IDs exist
    FOR each evidence_id mentioned in report:
      VERIFY: Evidence exists in evidence inventory

  CHECK: All referenced requirement IDs exist
    FOR each requirement_id mentioned:
      VERIFY: Requirement exists in requirements mapping

  FOR each broken reference:
    CORRECT: Reference to valid ID OR remove reference
    UPDATE: All affected sections
```

### Report Counter-Check Results

```
Counter-Check Execution Report:
  Data inconsistencies corrected: [count]
  Missing sections completed: [count]
  Inaccurate findings revised: [count]
  Vague recommendations refined: [count]
  Broken references fixed: [count]

  Final validation:
    All 7 sections complete: [YES/NO]
    Data consistency verified: [YES/NO]
    Findings supported by data: [YES/NO]
    Recommendations actionable: [YES/NO]
    Cross-references valid: [YES/NO]

  Report ready for delivery: [YES/NO]
```

> **HALT** — Confirm counter-check complete and all issues resolved.

---

## 6.6 Compile Final Output

**Execute:**

### Step 1: Package deliverables

```
CREATE report package:
  output/compliance-reports/[regulation]-[date]/
    ├── compliance-report.md (main report)
    ├── executive-summary.yaml (key metrics)
    ├── gap-analysis.csv (all gaps data)
    ├── remediation-roadmap.md (timeline and plans)
    ├── evidence-inventory.yaml (all evidence)
    └── README.md (package overview)

CREATE README.md:
```markdown
# Compliance Assessment Report Package

**Assessment Date:** [date]
**Regulation:** [regulation_name]
**Compliance Level:** [level] ([percentage]%)

## Contents

1. **compliance-report.md** - Full compliance assessment report (7 sections)
2. **executive-summary.yaml** - Key metrics and findings in YAML format
3. **gap-analysis.csv** - Detailed gap analysis data (CSV for analysis)
4. **remediation-roadmap.md** - Remediation timeline and plans
5. **evidence-inventory.yaml** - Complete evidence inventory

## Key Findings

- Critical Gaps: [count]
- High Priority Gaps: [count]
- Compliance Percentage: [percentage]%
- Compliance Ready Date: [date]

## Next Steps

1. [Immediate action 1]
2. [Immediate action 2]
3. [Immediate action 3]

For questions or clarification, refer to the full compliance-report.md.
```

COMPUTE package metadata:
  total_files: 6
  total_size_bytes: [sum of all file sizes]
  package_path: "output/compliance-reports/[regulation]-[date]/"
```

### Step 2: Generate process summary

```yaml
deep_compliance_process_summary:
  process_id: "deep-compliance"
  execution_date: "[current date]"
  regulation: [regulation_id]
  regulation_name: "[name]"

  process_execution:
    step_01_inventory:
      status: COMPLETE
      systems_identified: [count]
      capabilities_extracted: [count]

    step_02_mapping:
      status: COMPLETE
      requirements_mapped: [count]
      coverage_percentage: [percentage]

    step_03_analysis:
      status: COMPLETE
      gaps_identified: [count]
      critical_gaps: [count]

    step_04_collection:
      status: COMPLETE
      evidence_collected: [count]
      evidence_verified: [count]

    step_05_planning:
      status: COMPLETE
      plans_created: [count]
      total_effort_hours: [hours]

    step_06_reporting:
      status: COMPLETE
      deliverables_generated: [count]

  final_assessment:
    compliance_percentage: [percentage]%
    compliance_level: [level]
    readiness_status: [status]
    critical_gaps_remaining: [count]
    high_gaps_remaining: [count]
    compliance_ready_date: [date]
    timeline_feasible: [YES/NO/AT_RISK]

  deliverables:
    package_path: "[path]"
    total_files: [count]
    total_size: [bytes]

  next_actions:
    - [action 1]
    - [action 2]
    - [action 3]
```

### Step 3: Update process state

```yaml
# Add to process frontmatter:
reporting_complete: true
compliance_percentage: [percentage]
compliance_level: [level]
deliverables_generated: [count]
report_package_path: "[path]"
process_complete_date: "[current date]"
```

---

## GATE_6: Process Completion

**ENFORCEMENT:** ALL checklist items MUST be DONE before declaring process complete.

### Gate Checklist

```
[ ] G6.1: All process outputs loaded (steps 01-05)
[ ] G6.2: Assessment findings compiled
[ ] G6.3: Compliance status calculated
[ ] G6.4: All 7 report sections generated
[ ] G6.5: All 5 deliverable artifacts created
[ ] G6.6: Counter-check executed (all 5 checks)
[ ] G6.7: Data consistency verified
[ ] G6.8: Findings supported by data
[ ] G6.9: Recommendations are actionable
[ ] G6.10: Report package complete
```

### Completeness Validation

```
VERIFY report sections:
  section_count = COUNT(sections in main report)

  IF section_count < 7:
    GATE_6 = CLOSED
    LOG ERROR: "Missing report sections: [7 - section_count]"
    LIST: Missing sections
    HALT

VERIFY deliverables:
  deliverable_count = COUNT(files created)

  IF deliverable_count < 5:
    GATE_6 = CLOSED
    LOG ERROR: "Missing deliverables: [5 - deliverable_count]"
    LIST: Missing files
    HALT

VERIFY data consistency:
  IF counter_check_passed = FALSE:
    GATE_6 = CLOSED
    LOG ERROR: "Data consistency issues remain"
    HALT
```

### Gate Passage

```
EVALUATE:
  all_sections_complete = (section_count >= 7)
  all_deliverables_created = (deliverable_count >= 5)
  counter_check_passed = TRUE
  data_consistent = TRUE
  findings_supported = TRUE
  recommendations_actionable = TRUE

IF all TRUE:
  GATE_6 = OPEN
  PROCESS_STATUS = COMPLETE

  OUTPUT: "GATE_6 OPEN - Deep-Compliance process COMPLETE"
  OUTPUT: "Compliance Level: [level]"
  OUTPUT: "Compliance Percentage: [percentage]%"
  OUTPUT: "Critical Gaps: [count]"
  OUTPUT: "High Gaps: [count]"
  OUTPUT: "Compliance Ready Date: [date]"
  OUTPUT: "Report Package: [path]"
  OUTPUT: "Deliverables: [count] files generated"

  DISPLAY summary of next actions

ELSE:
  GATE_6 = CLOSED
  OUTPUT: "GATE_6 CLOSED"
  OUTPUT: "Reason: [which condition failed]"
  OUTPUT: "Report sections: [count]/7"
  OUTPUT: "Deliverables: [count]/5"
  HALT
```

**ENFORCEMENT:** Process only complete when GATE_6 = OPEN.

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading all process outputs:
  HALT
  OUTPUT: "VIOLATION: Section 6.0 Load Required Data mandatory"
  RETURN to section 6.0

IF agent generates incomplete report (< 7 sections):
  HALT
  OUTPUT: "VIOLATION: All 7 sections required"
  OUTPUT: "Missing: [list missing sections]"
  RETURN to section 6.3

IF agent skips compliance calculation:
  HALT
  OUTPUT: "VIOLATION: Section 6.2 Calculate Compliance Status is MANDATORY"
  RETURN to section 6.2

IF agent doesn't create all deliverables:
  HALT
  OUTPUT: "VIOLATION: All 5 deliverable artifacts required"
  OUTPUT: "Missing: [list missing files]"
  RETURN to section 6.4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6.5 Counter-Check is MANDATORY"
  RETURN to section 6.5
```

---

**END OF STEP 6**

**END OF DEEP-COMPLIANCE PROCESS**

**Process Result:** [COMPLIANT | SUBSTANTIALLY_COMPLIANT | PARTIALLY_COMPLIANT | MINIMALLY_COMPLIANT | NON_COMPLIANT]

**Next Action:** Review report package at [path] and begin remediation execution according to roadmap.
