# STEP 4: RENDER

## ENFORCED SEQUENCE

```
1. LOAD_TEMPLATE
2. RENDER_DECISION_BRIEF
3. RENDER_FULL_REPORT
4. VERIFY_PAGE_LIMIT
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_4
```

## 1. LOAD_TEMPLATE

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: decision_brief_structure FROM brief_template
VERIFY: All 6 sections defined
  1. Header
  2. Recommendation
  3. Key Findings
  4. Critical Issues
  5. Execution Summary
  6. Decision Readiness

LOAD: page_limit FROM brief_template
VERIFY: target_pages = 5
VERIFY: maximum_pages = 10
```

## 2. RENDER_DECISION_BRIEF

```
CREATE: decision_brief_content

SECTION 1: Header
RENDER:
```markdown
# Decision Brief: {workflow_metadata.goal}

**Workflow ID:** {workflow_id}
**Execution ID:** {execution_id}
**Date:** {CURRENT_DATE}
**Status:** {outcome}
```

SECTION 2: Recommendation
RENDER:
```markdown
## 🎯 Recommendation: {recommendation.action}

**Priority:** {recommendation.priority}

**Rationale:** {recommendation.rationale}

**Next Steps:**
{FOR each step IN next_steps:}
{index}. {step}
{END FOR}
```

SECTION 3: Key Findings
RENDER:
```markdown
## 📊 Key Findings

{IF synthesis_data.options_identified EXISTS:}
### Options Identified
{FOR each option IN synthesis_data.options_identified LIMIT 5:}
- {option.name} (score: {option.score})
{END FOR}
{END IF}

{IF synthesis_data.top_risks EXISTS:}
### Top Risks
{FOR each risk IN synthesis_data.top_risks LIMIT 5:}
- {risk.name} ({risk.severity}) - {risk.impact}
{END FOR}
{END IF}

{IF synthesis_data.verification_status EXISTS:}
### Verification Status
- Verdict: {verification_status.verdict}
- Score: {verification_status.score}/10
- Confidence: {verification_status.confidence}
{END IF}
```

SECTION 4: Critical Issues
IF critical_issues_count > 0:
RENDER:
```markdown
## ⚠️ Critical Issues

{FOR each issue IN critical_issues:}
{index}. **{issue.severity}:** {issue.description}
{END FOR}
```
ELSE:
RENDER:
```markdown
## ⚠️ Critical Issues

No critical issues identified.
```

SECTION 5: Execution Summary
RENDER:
```markdown
## 📈 Execution Summary

- **Tasks Completed:** {completed_tasks}/{total_tasks}
- **Success Rate:** {success_rate * 100}%
- **Output Quality:** {output_quality * 100}%
- **Execution Time:** {monitoring_data.execution_time}
- **Token Usage:** {monitoring_data.token_usage}
- **Cost:** {monitoring_data.cost}
```

SECTION 6: Decision Readiness
RENDER:
```markdown
## 🎲 Decision Readiness: {decision_readiness} ({decision_readiness_score * 100}%)

- **Information Completeness:** {information_completeness * 100}%
- **Data Quality:** {output_quality * 100}%
- **Coherence:** {coherence * 100}%
- **Critical Issues Unresolved:** {critical_issues_count}
```

STORE: decision_brief_content IN render_state
```

## 3. RENDER_FULL_REPORT

```
CREATE: full_report_content

INCLUDE: All sections from decision_brief_content

ADD: Detailed sections

SECTION 7: Detailed Findings
FOR each output IN outputs_collected:
  RENDER:
```markdown
### {output.process_name}

**Status:** {output.validation_status}
**Retrieved:** {output.retrieved_at}

{IF output.validation_status = VALID:}
**Key Data:**
{DUMP output.output_data AS formatted YAML}
{END IF}

{IF output.validation_status = INVALID:}
**Validation Errors:**
{FOR each error IN output.validation_errors:}
- {error.field}: {error.error}
{END FOR}
{END IF}
```

SECTION 8: Metrics Detail
RENDER:
```markdown
### Metrics Breakdown

- **Success Rate:** {success_rate} ({completed_tasks}/{total_tasks} tasks)
- **Output Quality:** {output_quality} ({valid_outputs}/{total_outputs} valid)
- **Coherence:** {coherence} ({contradiction_count} contradictions in {total_comparisons} comparisons)
- **Information Completeness:** {information_completeness}
- **Critical Issue Density:** {critical_issue_density}
```

SECTION 9: Aggregation Metadata
RENDER:
```markdown
### Aggregation Details

- **Workflow Pattern:** {workflow_pattern}
- **Aggregation Method:** Method #349 Result Aggregator
- **Outputs Aggregated:** {LENGTH(outputs_collected)}
- **Missing Outputs:** {LENGTH(missing_outputs)}
```

STORE: full_report_content IN render_state
```

## 4. VERIFY_PAGE_LIMIT

```
ESTIMATE: decision_brief_pages
  character_count = LENGTH(decision_brief_content)
  estimated_pages = character_count / 2000

VERIFY: estimated_pages <= 10
IF estimated_pages > 10:
  HALT: "VIOLATION: Decision brief exceeds 10-page limit"
  OUTPUT: "Estimated pages: {estimated_pages}"
  OUTPUT: "Must reduce content to meet limit"

IF estimated_pages > 5:
  OUTPUT: "WARNING: Decision brief is {estimated_pages} pages (target: 5)"

IF estimated_pages <= 5:
  OUTPUT: "Decision brief is {estimated_pages} pages (within target)"

STORE: estimated_pages IN render_state
```

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify rendering completeness and correctness
EXECUTE:
  1. TEMPLATE_COMPLIANCE_CHECK:
     QUESTION: "Does decision brief include all 6 required sections?"
     FOR each section IN [Header, Recommendation, Key Findings, Critical Issues, Execution Summary, Decision Readiness]:
       VERIFY: section present IN decision_brief_content
       IF missing:
         CORRECT: Add missing section
       IF present:
         CONFIRM: "Section {section} included"

  2. CONTENT_ACCURACY_CHECK:
     QUESTION: "Is rendered content accurate to source data?"
     VERIFY: recommendation.action in brief matches synthesis_data.recommendation.action
     VERIFY: critical_issues_count matches LENGTH(critical_issues)
     VERIFY: metrics in brief match aggregation_state.metrics
     IF discrepancy:
       CORRECT: Re-render with correct data
     IF accurate:
       CONFIRM: "Content accurate"

  3. PAGE_LIMIT_CHECK:
     QUESTION: "Does decision brief meet page limit constraints?"
     VERIFY: estimated_pages <= 10
     IF exceeded:
       HALT: "Page limit violation - must reduce content"
     IF within_limit:
       CONFIRM: "Page limit satisfied: {estimated_pages} pages"

  4. MARKDOWN_VALIDITY_CHECK:
     QUESTION: "Is markdown formatting valid?"
     VERIFY: No unclosed code blocks
     VERIFY: Headers properly formatted
     VERIFY: Lists properly formatted
     IF invalid:
       CORRECT: Fix formatting errors
     IF valid:
       CONFIRM: "Markdown valid"

  5. COMPLETENESS_CHECK:
     QUESTION: "Is full report more comprehensive than brief?"
     VERIFY: LENGTH(full_report_content) > LENGTH(decision_brief_content)
     VERIFY: full_report includes detailed sections
     IF incomplete:
       CORRECT: Add missing details to full report
     IF complete:
       CONFIRM: "Full report comprehensive"

  6. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "All sections present: YES/NO"
     OUTPUT: "Content accurate: YES/NO"
     OUTPUT: "Page limit: {estimated_pages}/10 pages"
     OUTPUT: "Markdown valid: YES/NO"

VIOLATION: Skipping counter-check is VIOLATION
```

## 6. CHECKLIST

```
ANSWER YES/NO:
□ Template loaded with all 6 sections?
□ Decision brief rendered completely?
□ Full report rendered with details?
□ Page limit verified (≤10 pages)?
□ All content accurate to source data?
□ Markdown formatting valid?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## 7. GATE_4

```
EVALUATE:
  decision_brief_rendered = decision_brief_content EXISTS
  full_report_rendered = full_report_content EXISTS
  page_limit_satisfied = estimated_pages <= 10
  all_sections_present = 6 sections in decision_brief

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - Rendering complete, proceeding to STEP 5 (OUTPUT)"
  OUTPUT: "Decision brief: {estimated_pages} pages"
  OUTPUT: "Full report: {LENGTH(full_report_content)} characters"
  NEXT_STEP: "steps/step-05-output.md"

IF any FALSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  IF page_limit_satisfied = FALSE:
    OUTPUT: "Page limit exceeded: {estimated_pages}/10 pages"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading template:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_TEMPLATE required"
  RETURN to section 1

IF agent skips decision brief rendering:
  HALT
  OUTPUT: "VIOLATION: Section 2 RENDER_DECISION_BRIEF required"
  RETURN to section 2

IF agent skips page limit verification:
  HALT
  OUTPUT: "VIOLATION: Section 4 VERIFY_PAGE_LIMIT required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
