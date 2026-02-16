# PHASE 7: RENDER

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_7
```

## 1. OBSERVE

```
PRECONDITION: GATE_6 = OPEN
IF GATE_6 ≠ OPEN → HALT WITH "GATE_6 not satisfied"

LOAD: synthesis-report.yaml
VERIFY: file exists AND readable
IF load fails → HALT WITH error_code_011

EXTRACT ALL sections:
  executive_summary
  option_comparison
  detailed_option_analysis
  uncertainty_analysis
  critical_path
  phase_integration_summary

VERIFY: ALL sections present
IF ANY section missing → HALT WITH incomplete_synthesis

LOAD ALL supporting artifacts (for reference):
  ground-state.yaml
  knowledge-gaps.yaml
  research-results.yaml
  option-map.yaml
  consequence-map.yaml
  assumption-challenge-results.yaml

VERIFY: ALL artifacts accessible
STORE: loaded_synthesis, loaded_artifacts
```

## 2. DECLARE_ASSUMPTIONS

```
BEFORE proceeding to ORIENT:

DECLARE:
  assumption_028: "markdown format adequate for human readability"
  assumption_029: "tables effective for comparison visualization"
  assumption_030: "ALL technical content translatable to plain language"
  assumption_031: "reader has context from decision_question (no external context needed)"

RECORD assumptions IN assumptions_log.yaml
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT

```
TRANSFORM synthesis data to human-readable format:

EXTRACT narrative_structure:

  SECTION 1 - Executive Summary:
    decision_question: [plain language restatement]
    exploration_summary: [what was done in phases 0-6]
    key_finding: [primary insight]
    recommendation: [recommended_option OR why none]
    confidence: [high|medium|low + explanation]
    next_steps: [actionable items]

  SECTION 2 - Decision Context:
    original_question: [from phase 0]
    question_interpretation: [how it was understood]
    exploration_scope:
      - gaps_identified: [count + nature]
      - research_conducted: [count + methods]
      - options_discovered: [count + categories]
      - consequences_analyzed: [count + timeframes]
      - assumptions_tested: [count + results]

  SECTION 3 - Options Overview:
    FOR EACH option IN option_comparison:
      EXTRACT overview_entry:
        option_name: [name]
        one_line_description: [concise summary]
        confidence_level: [with rationale]
        key_strength: [primary advantage]
        key_weakness: [primary disadvantage]
        overall_assessment: [recommended|viable|risky|not_recommended]

  SECTION 4 - Detailed Option Analysis:
    FOR EACH option IN detailed_option_analysis:
      EXTRACT detailed_entry:
        option_name: [name]
        full_description: [comprehensive explanation]

        what_it_means:
          immediate_impact: [0-3 months]
          short_term_impact: [3-12 months]
          long_term_impact: [1+ years]

        why_consider:
          strengths: [list ALL strengths]
          opportunities: [positive consequences]
          when_best: [scenarios where this option optimal]

        why_be_cautious:
          weaknesses: [list ALL weaknesses]
          risks: [list ALL risks with probability + impact]
          when_avoid: [scenarios where this option poor fit]

        key_assumptions:
          FOR EACH assumption:
            - assumption: [plain language]
              confidence_in_assumption: [strong|moderate|weak]
              what_if_wrong: [consequence]

        reversibility:
          can_reverse: [yes|no]
          IF yes:
            reversal_difficulty: [easy|moderate|hard]
            reversal_cost: [description]
            reversal_timeframe: [duration]
          IF no:
            why_irreversible: [explanation]
            implications: [why this matters]

  SECTION 5 - Option Comparison:
    CREATE comparison_table:
      columns: [Option Name, Confidence, Net Impact, Risk Level, Reversible, Rank]
      rows: [ONE row per option with ALL columns filled]

    CREATE consequence_matrix:
      rows: [options]
      columns: [dimensions from option-map.yaml]
      cells: [impact on dimension: ++, +, 0, -, -- OR qualitative]

  SECTION 6 - Uncertainty & Assumptions:
    weak_assumptions_summary:
      FOR EACH weak assumption:
        - assumption: [plain language]
          why_weak: [challenge results]
          affects: [which options]
          mitigation: [strategy]
          residual_risk: [what remains uncertain]

    overall_confidence_assessment:
      high_confidence_count: [count + list]
      medium_confidence_count: [count + list]
      low_confidence_count: [count + list]
      interpretation: [what this means for decision quality]

  SECTION 7 - Critical Path & Next Steps:
    must_address_first:
      FOR EACH critical_item:
        - what: [item description]
          why_critical: [blocks X options]
          how_to_address: [resolution approach]
          priority: [high|medium|low]

    decision_sequence:
      IF sequential decisions:
        - step_1: [first decision + options]
        - step_2: [next decision + depends on step_1]
      ELSE:
        - single_decision: [all options available now]

    immediate_next_steps:
      1. [first action]
      2. [second action]
      3. [third action]

  SECTION 8 - Exploration Process Summary:
    phase_by_phase:
      Phase 0 - Ground: [what was established]
      Phase 1 - Extract: [gaps identified]
      Phase 2 - Research: [findings obtained]
      Phase 3 - Map: [options discovered]
      Phase 4 - Deepen: [consequences analyzed]
      Phase 5 - Challenge: [assumptions tested]
      Phase 6 - Synthesize: [integration completed]
      Phase 7 - Render: [this report]

    key_insights: [top 3 cross-phase patterns]
    process_quality: [integration completeness assessment]

  SECTION 9 - Appendices:
    appendix_a: "Artifact Reference" [list ALL .yaml files]
    appendix_b: "Assumption Log" [ALL assumptions 001-031]
    appendix_c: "Research Sources" [from research-results.yaml]
    appendix_d: "Risk Register" [ALL identified risks]

EXTRACT formatting_specifications:

  markdown_elements:
    headers: "# ## ### for hierarchy"
    emphasis: "**bold** for key terms, *italic* for emphasis"
    lists: "- bullets for items, 1. for sequences"
    tables: "| column | format | for comparisons"
    code_blocks: "``` for technical data preservation"
    blockquotes: "> for important callouts"

  visualization_requirements:
    comparison_table: REQUIRED in Section 5
    consequence_matrix: REQUIRED in Section 5
    assumption_robustness_chart: REQUIRED in Section 6
    decision_tree_diagram: IF decision_sequence exists

  readability_targets:
    executive_summary: max 1 page
    option_overview: max 2 pages
    detailed_analysis: max 2 pages per option
    full_report: max 20 pages (for typical 3-5 option exploration)

REQUIREMENT: Transform EVERY option, not subset
VIOLATION: Rendering "top" options only is VIOLATION
REQUIREMENT: Include ALL sections, not just "important"
```

### 3B. VERIFY

```
VALIDATE rendering_completeness:

CHECK section_coverage:
  FOR section IN [1, 2, 3, 4, 5, 6, 7, 8, 9]:
    VERIFY section content extracted
    VERIFY section NOT empty

    IF section missing:
      SECTION_MISSING = true
      REQUIRE: extract section content
      RETRY verification

CHECK option_coverage:
  total_options = COUNT(synthesis-report.yaml options)
  rendered_options = COUNT(extracted option entries)

  IF rendered_options < total_options:
    MISSING_OPTIONS = true
    LIST: which options not rendered
    REQUIRE: extract missing options
    RETRY verification

CHECK data_consistency:
  FOR EACH option:
    VERIFY same data in overview AND detailed_analysis
    VERIFY confidence matches synthesis-report.yaml
    VERIFY consequences match consequence-map.yaml

    IF inconsistency:
      DATA_MISMATCH = true
      IDENTIFY: which fields conflict
      REQUIRE: resolve to source of truth (synthesis-report.yaml)

CHECK visualization_completeness:
  VERIFY comparison_table includes ALL options
  VERIFY comparison_table includes ALL required columns
  VERIFY consequence_matrix includes ALL options × ALL dimensions

  IF table incomplete:
    TABLE_INCOMPLETE = true
    REQUIRE: complete table
    RETRY verification

CHECK readability:
  FOR EACH section:
    SCAN for technical_jargon:
      IF jargon without explanation:
        JARGON_UNEXPLAINED = true
        REQUIRE: add plain language explanation

    CHECK sentence_complexity:
      IF average_sentence_length > 25 words:
        COMPLEXITY_HIGH = true
        SUGGEST: break into shorter sentences

    CHECK paragraph_length:
      IF paragraph > 8 sentences:
        PARAGRAPH_TOO_LONG = true
        SUGGEST: split into multiple paragraphs

IF ALL validations pass:
  rendered_content = verified
  PROCEED to DECLARE
```

### 3C. DECLARE

```
DECLARE interpretation:

DECLARE content_statistics:
  sections_rendered: 9
  options_rendered: COUNT(ALL options)
  tables_created: COUNT(tables)
  total_assumptions_logged: 31 (001-031)
  artifacts_referenced: 6

DECLARE recommendation_clarity:
  IF recommended_option exists:
    clarity = explicit
    recommendation_stated: [option_name]
    confidence_stated: [level]
    rationale_provided: true
  ELSE:
    clarity = explicit_absence
    no_recommendation_because: [reason]
    path_forward: [what needed for recommendation]

DECLARE uncertainty_transparency:
  weak_assumptions_disclosed: COUNT(weak)
  fragile_decisions_disclosed: COUNT(fragile)
  risks_disclosed: COUNT(ALL risks)
  mitigation_strategies_provided: true|false

DECLARE actionability:
  IF immediate_next_steps defined:
    actionable = true
    next_step_count: COUNT(next steps)
  ELSE:
    actionable = false
    blocker: [what prevents action]

DECLARE process_traceability:
  phase_progression_documented: true
  artifact_chain_complete: true
  assumptions_logged: true
  counter_checks_executed: 7 (one per phase)
  gates_passed: 7 (GATE_0 through GATE_7)

DECLARE overall_interpretation:
  report_ready_for_user: [true|false]
  report_complete: [true|false]
  report_quality: [high|medium|low]
  quality_evidence:
    - "ALL options rendered"
    - "ALL assumptions disclosed"
    - "ALL risks identified"
    - "Clear recommendation OR clear explanation why none"

RECORD interpretation (do NOT render yet)
```

## 4. DECIDE

```
FOR EACH section IN narrative_structure:

  EVALUATE inclusion:
    IF section = executive_summary:
      DECISION: include_first
      PRIORITY: highest

    IF section = detailed_option_analysis:
      DECISION: include_complete
      REQUIREMENT: EVERY option, not subset

    IF section = appendices:
      DECISION: include_at_end
      PRIORITY: reference only

  EVALUATE format:
    IF section contains comparison data:
      DECISION: use_table_format
      FORMAT: markdown table

    IF section contains narrative:
      DECISION: use_prose_format
      FORMAT: paragraphs with headers

    IF section contains technical data:
      DECISION: use_structured_format
      FORMAT: code blocks OR lists

EVALUATE report_structure:
  DECISION: sequential_sections
  ORDER: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  RATIONALE: "executive first, details middle, process last"

EVALUATE output_format:
  DECISION: markdown_file
  FILENAME: "exploration-report.md"
  LOCATION: [same directory as synthesis-report.yaml]

FINALIZE: report_content, report_structure, output_specification
```

## 5. ACT (RENDER)

```
NOW render the verified, declared report:

CREATE: exploration-report.md

CONTENT:

---
# Decision Exploration Report

**Decision Question:** [decision_question from synthesis-report.yaml]

**Report Generated:** [timestamp]

**Exploration Scope:** [phases 0-6 summary]

---

## Executive Summary

[executive_summary content in plain language]

**Recommendation:** [recommended_option OR "No single option recommended - see Section 7"]

**Confidence Level:** [high|medium|low] - [rationale]

**Key Finding:** [primary insight from exploration]

**Next Steps:**
1. [immediate action 1]
2. [immediate action 2]
3. [immediate action 3]

---

## 1. Decision Context

### Original Question
[decision_question verbatim]

### How We Interpreted It
[question_type + exploration_mode + interpretation]

### What We Explored
- **Knowledge Gaps Identified:** [count] gaps across [categories]
- **Research Conducted:** [count] findings from [methods]
- **Options Discovered:** [count] viable options
- **Consequences Analyzed:** [count] consequence sets across 3 timeframes
- **Assumptions Tested:** [count] assumptions challenged with [results]

---

## 2. Options Overview

[FOR EACH option IN option_comparison]

### Option [N]: [option_name]

**In Brief:** [one_line_description]

**Confidence:** [level] - [rationale]

**Key Strength:** [primary advantage]

**Key Weakness:** [primary disadvantage]

**Assessment:** [✓ Recommended | ○ Viable | ⚠ Risky | ✗ Not Recommended]

---

---

## 3. Detailed Option Analysis

[FOR EACH option IN detailed_option_analysis]

### Option [N]: [option_name]

#### What This Option Means

**Description:** [full_description]

**Timeline of Impact:**
- **Immediate (0-3 months):** [immediate_impact]
- **Short-term (3-12 months):** [short_term_impact]
- **Long-term (1+ years):** [long_term_impact]

#### Why Consider This Option

**Strengths:**
- [strength 1]
- [strength 2]
- [strength N]

**Opportunities:** [positive consequences]

**Best When:** [scenarios where optimal]

#### Why Be Cautious

**Weaknesses:**
- [weakness 1]
- [weakness 2]
- [weakness N]

**Risks:**
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [risk 1] | [H/M/L] | [H/M/L] | [strategy] |
| [risk N] | [H/M/L] | [H/M/L] | [strategy] |

**Avoid When:** [scenarios where poor fit]

#### Key Assumptions This Option Relies On

[FOR EACH assumption]

**Assumption:** [plain language statement]
- **Confidence in Assumption:** [strong|moderate|weak]
- **If Wrong:** [consequence]

#### Can This Be Reversed?

**Reversible:** [Yes|No]

[IF yes]
- **Difficulty:** [easy|moderate|hard]
- **Cost:** [description]
- **Timeframe:** [duration]

[IF no]
- **Why Not:** [explanation]
- **Implications:** [why this matters]

---

---

## 4. Option Comparison

### Comparison Table

| Option | Confidence | Net Impact | Risk Level | Reversible | Rank |
|--------|-----------|------------|------------|------------|------|
| [option 1] | [level] | [positive/mixed/negative] | [H/M/L] | [Yes/No] | 1 |
| [option N] | [level] | [positive/mixed/negative] | [H/M/L] | [Yes/No] | N |

### Consequence Matrix

Impact by Dimension:

| Option | [Dimension 1] | [Dimension 2] | [Dimension N] |
|--------|--------------|--------------|--------------|
| [option 1] | [++/+/0/-/--] | [++/+/0/-/--] | [++/+/0/-/--] |
| [option N] | [++/+/0/-/--] | [++/+/0/-/--] | [++/+/0/-/--] |

**Legend:** ++ Very Positive | + Positive | 0 Neutral | - Negative | -- Very Negative

---

## 5. Uncertainty & Assumptions

### What We're Uncertain About

[FOR EACH weak assumption]

**Uncertain Assumption:** [plain language]
- **Why Uncertain:** [challenge results]
- **Affects Options:** [which options]
- **Mitigation:** [strategy]
- **Residual Risk:** [what remains unknown]

### Overall Confidence Assessment

- **High Confidence Options:** [count] - [list names]
  - Strong assumption foundation, low uncertainty

- **Medium Confidence Options:** [count] - [list names]
  - Moderate assumption foundation, requires monitoring

- **Low Confidence Options:** [count] - [list names]
  - Weak assumption foundation, high uncertainty

**What This Means:** [interpretation for decision quality]

---

## 6. Critical Path & Next Steps

### Must Address First

[FOR EACH critical_item in priority order]

**[Priority]** [what]
- **Why Critical:** [blocks X options]
- **How to Address:** [resolution approach]

### Decision Sequence

[IF sequential]
1. **First Decision:** [decision + options]
   - Proceed to step 2 based on outcome
2. **Second Decision:** [decision + options]

[ELSE]
**Single Decision Point:** All [count] options available for immediate consideration

### Immediate Next Steps

1. **[action 1]**
2. **[action 2]**
3. **[action 3]**

---

## 7. How This Exploration Was Conducted

### Phase-by-Phase Summary

**Phase 0 - Ground:** [what was established]

**Phase 1 - Extract:** [count] knowledge gaps identified across [categories]

**Phase 2 - Research:** [count] findings obtained using [methods]

**Phase 3 - Map:** [count] viable options discovered from research

**Phase 4 - Deepen:** Consequences analyzed for ALL options across 3 timeframes

**Phase 5 - Challenge:** [count] assumptions tested, [count] weakened

**Phase 6 - Synthesize:** Findings integrated into coherent framework

**Phase 7 - Render:** This report

### Key Insights

1. [insight 1 - cross-phase pattern]
2. [insight 2 - cross-phase pattern]
3. [insight 3 - cross-phase pattern]

### Process Quality

**Integration Completeness:** [complete|partial - with issues if partial]

**Artifacts Generated:**
- ✓ ground-state.yaml
- ✓ knowledge-gaps.yaml
- ✓ research-results.yaml
- ✓ option-map.yaml
- ✓ consequence-map.yaml
- ✓ assumption-challenge-results.yaml
- ✓ synthesis-report.yaml
- ✓ exploration-report.md (this file)

---

## Appendices

### Appendix A: Artifact Reference

All technical artifacts available in YAML format:
- `ground-state.yaml` - Decision question interpretation
- `knowledge-gaps.yaml` - Identified knowledge gaps
- `research-results.yaml` - Research findings and sources
- `option-map.yaml` - Option mapping with dimensions
- `consequence-map.yaml` - Consequence analysis by option
- `assumption-challenge-results.yaml` - Assumption testing results
- `synthesis-report.yaml` - Integrated synthesis

### Appendix B: Assumption Log

[FOR EACH assumption 001-031]
- **A[number]:** [assumption_text] - [robustness if tested]

### Appendix C: Research Sources

[FROM research-results.yaml]
[List ALL sources with credibility ratings]

### Appendix D: Risk Register

[FROM consequence-map.yaml]
[ALL identified risks across ALL options]

| Risk ID | Risk Description | Option | Probability | Impact | Mitigation |
|---------|-----------------|--------|-------------|--------|------------|
| R001 | [description] | [option] | [H/M/L] | [H/M/L] | [strategy] |

---

**End of Report**

---

VERIFY: exploration-report.md created
VERIFY: ALL sections present (1-9)
VERIFY: ALL options included
VERIFY: ALL tables complete
VERIFY: executive summary <= 1 page
VERIFY: recommendation clear OR absence explained

IF ANY verification fails → HALT WITH creation_error
```

## 6. COUNTER_CHECK

```
CLAIM: "report is complete, accurate, and readable"

ATTEMPT TO DISPROVE:

  METHOD 1 - Completeness check:
    VERIFY: Every option from synthesis-report.yaml in exploration-report.md
    VERIFY: Every section 1-9 present
    VERIFY: All tables filled (no empty cells)
    IF anything missing:
      COMPLETENESS_FAIL = true

  METHOD 2 - Accuracy check:
    FOR EACH option:
      CROSS_CHECK: Does report data match synthesis-report.yaml?
      IF discrepancy:
        ACCURACY_FAIL = true

  METHOD 3 - Readability check:
    SCAN for:
      - Unexplained jargon
      - Sentences > 30 words
      - Paragraphs > 10 sentences
      - Unclear recommendations
    IF readability issues:
      READABILITY_FAIL = true

  METHOD 4 - Actionability check:
    QUESTION: "Can reader act on this report?"
    CHECK: Are next steps clear and specific?
    CHECK: Is recommendation (or lack thereof) unambiguous?
    IF not actionable:
      ACTIONABILITY_FAIL = true

  METHOD 5 - Consistency check:
    COMPARE executive summary vs detailed sections:
      CHECK: Does summary match details?
      CHECK: Are there contradictions?
      IF inconsistent:
        CONSISTENCY_FAIL = true

  METHOD 6 - Traceability check:
    FOR EACH claim in report:
      VERIFY: Can trace back to artifact?
      IF claim unsupported:
        TRACEABILITY_FAIL = true

EVIDENCE_AGAINST:
  completeness_issues: [list missing elements]
  accuracy_issues: [list discrepancies]
  readability_issues: [list jargon/complexity]
  actionability_issues: [list unclear items]
  consistency_issues: [list contradictions]
  traceability_issues: [list unsupported claims]

EVIDENCE_FOR:
  all_options_included: [verification]
  data_matches_source: [verification]
  plain_language_used: [verification]
  clear_next_steps: [verification]
  consistent_narrative: [verification]
  traceable_claims: [verification]

VERDICT:
  IF evidence_against is significant:
    claim_fails = true
    ADD missing elements
    CORRECT discrepancies
    SIMPLIFY language
    CLARIFY next steps
    RESOLVE contradictions
    ADD source references
    UPDATE exploration-report.md
    RE-RUN counter-check
  ELSE:
    claim_holds = true
    PROCEED

RECORD counter_check (append to exploration-report.md as metadata comment)
```

## 7. CHECKLIST

```
ANSWER YES/NO for EACH item:

□ GATE_6 verified as OPEN before starting?
  IF NO → HALT, RETURN to precondition check

□ synthesis-report.yaml loaded?
  IF NO → HALT, RETURN to section 1

□ ALL 6 supporting artifacts loaded for reference?
  IF NO → HALT, RETURN to section 1

□ assumptions declared BEFORE orient?
  IF NO → HALT, RETURN to section 2

□ narrative structure extracted for ALL 9 sections?
  IF NO → HALT, RETURN to section 3A

□ EVERY option included in extraction (not "top" options)?
  IF NO → HALT, RETURN to section 3A

□ ALL required visualizations extracted (tables, matrices)?
  IF NO → HALT, RETURN to section 3A

□ rendering completeness verified?
  IF NO → HALT, RETURN to section 3B

□ ALL options verified present in rendered content?
  IF NO → HALT, RETURN to section 3B

□ data consistency verified (report matches synthesis)?
  IF NO → HALT, RETURN to section 3B

□ readability verified (no unexplained jargon)?
  IF NO → HALT, RETURN to section 3B

□ interpretation declared BEFORE rendering?
  IF NO → HALT, RETURN to section 3C

□ recommendation clarity declared?
  IF NO → HALT, RETURN to section 3C

□ ALL 9 sections included in final report?
  IF NO → HALT, RETURN to section 4

□ exploration-report.md created?
  IF NO → HALT, RETURN to section 5

□ executive summary present and <= 1 page?
  IF NO → HALT, RETURN to section 5

□ ALL tables complete (no empty cells)?
  IF NO → HALT, RETURN to section 5

□ counter-check executed?
  IF NO → HALT, RETURN to section 6

□ counter-check verified completeness + accuracy + readability?
  IF NO → HALT, RETURN to section 6

IF ALL YES → PROCEED to GATE_7
IF ANY NO → FIX issue THEN re-run checklist
```

## 8. GATE_7

```
EVALUATE gate condition:
  exploration-report.md EXISTS = [true|false]
  ALL sections present = [true|false]
  ALL options rendered = [true|false]
  counter_check_executed = [true|false]

COUNT:
  sections_rendered = COUNT(sections in report)
  options_rendered = COUNT(options in report)
  options_in_synthesis = COUNT(options in synthesis-report.yaml)

IF exploration-report.md EXISTS = true
   AND sections_rendered = 9
   AND options_rendered = options_in_synthesis
   AND counter_check_executed = true:
  GATE_7 = OPEN
  OUTPUT: "GATE_7 OPEN - PROCESS COMPLETE"
  OUTPUT: "Report: exploration-report.md"
  OUTPUT: "Options analyzed: [options_rendered]"
  OUTPUT: "Recommendation: [recommended_option OR 'See report Section 7']"
  PROCESS_COMPLETE = true
  EXIT with success

ELSE:
  GATE_7 = CLOSED
  IDENTIFY: which condition failed

  IF exploration-report.md NOT exists:
    OUTPUT: "GATE_7 CLOSED - exploration-report.md missing"

  IF sections_rendered < 9:
    OUTPUT: "GATE_7 CLOSED - only [sections_rendered] sections rendered"

  IF options_rendered < options_in_synthesis:
    missing = options_in_synthesis - options_rendered
    OUTPUT: "GATE_7 CLOSED - [missing] options not rendered"

  IF counter_check_executed = false:
    OUTPUT: "GATE_7 CLOSED - counter-check not executed"

  HALT
  WAIT: condition satisfied OR scope_reduction declared
```

## SCOPE_REDUCTION PROTOCOL

```
IF gate condition cannot be met:

EXAMPLE: Cannot render option due to missing data

DECLARE_SCOPE_REDUCTION:
  gate: GATE_7
  condition_failed: "ALL options rendered"
  options_affected: [list specific option_ids]
  reason: "[e.g., data corruption in synthesis, NOT 'brevity']"
  impact: "Report incomplete - [option_name] not included"
  alternatives_attempted:
    - "Attempted data reconstruction from consequence-map.yaml - failed"
    - "Attempted partial rendering with disclaimer - insufficient data"
  mitigation: "Add disclaimer in report about missing option + render available [N-1] options"
  user_approval: REQUIRED (incomplete report may affect decision)

HALT until user responds:
  APPROVE → LOG reduction + RENDER partial report with disclaimer
  DENY → MUST fix data OR re-execute phase 6
  MODIFY → Adjust approach and retry
```

## VIOLATION RECOVERY

```
IF agent renders "top" options instead of ALL:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must render EVERY option"
  RETURN to section 3A

IF agent skips section without scope_reduction:
  HALT
  OUTPUT: "VIOLATION: Zasada 2 - must include ALL 9 sections"
  RETURN to section 3A

IF agent renders before verify:
  HALT
  OUTPUT: "VIOLATION: Zasada 6 - must VERIFY before RENDER"
  RETURN to section 3B

IF agent creates report with data not matching synthesis:
  HALT
  OUTPUT: "VIOLATION: Accuracy - report must match synthesis-report.yaml"
  RETURN to section 3B

IF agent proceeds without counter-check:
  HALT
  OUTPUT: "VIOLATION: Zasada 8 - counter-check MANDATORY"
  RETURN to section 6
```

## PROCESS COMPLETION

```
WHEN GATE_7 = OPEN:

FINAL_OUTPUT:
  primary_artifact: "exploration-report.md"
  technical_artifacts:
    - "ground-state.yaml"
    - "knowledge-gaps.yaml"
    - "research-results.yaml"
    - "option-map.yaml"
    - "consequence-map.yaml"
    - "assumption-challenge-results.yaml"
    - "synthesis-report.yaml"
  assumptions_logged: "assumptions_log.yaml" (31 assumptions)

PROCESS_METRICS:
  phases_completed: 8 (0-7)
  gates_passed: 8 (GATE_0 through GATE_7)
  assumptions_declared: 31
  assumptions_challenged: [count from phase 5]
  counter_checks_executed: 8
  checklists_completed: 8
  scope_reductions: [count if any]
  violations: [count if any]

USER_DELIVERABLE: exploration-report.md
AGENT_VERDICT: PROCESS_COMPLETE
```
