# STEP 3: SYNTHESIZE

## ENFORCED SEQUENCE

```
1. EXTRACT_KEY_FINDINGS
2. IDENTIFY_CRITICAL_ISSUES
3. GENERATE_RECOMMENDATION
4. GENERATE_NEXT_STEPS
5. COUNTER_CHECK
6. CHECKLIST
7. GATE_3
```

## 1. EXTRACT_KEY_FINDINGS

```
PRECONDITION: GATE_2 = OPEN
IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

LOAD: extraction_rules FROM brief_template

IF deep_explore_output EXISTS:
  APPLY: extraction_rules.extract_from_deep_explore
  SORT: options BY score DESC
  LIMIT: top 5 options
  STORE: In synthesis_data.options_identified

IF deep_risk_output EXISTS:
  APPLY: extraction_rules.extract_from_deep_risk
  SORT: risks BY severity DESC
  LIMIT: top 5 risks
  STORE: In synthesis_data.top_risks

IF deep_verify_output EXISTS:
  APPLY: extraction_rules.extract_from_deep_verify
  EXTRACT:
    verdict: deep_verify_output.verdict
    score: deep_verify_output.score
    confidence: deep_verify_output.confidence
  STORE: In synthesis_data.verification_status

IF deep_synthesis_output EXISTS:
  APPLY: extraction_rules.extract_from_deep_synthesis
  EXTRACT: themes
  STORE: In synthesis_data.synthesis_themes
```

## 2. IDENTIFY_CRITICAL_ISSUES

```
INITIALIZE: critical_issues = []

IF deep_verify_output EXISTS:
  EXTRACT: issues FROM deep_verify_output.critical_issues
  FOR each issue:
    IF issue.severity IN [BLOCKER, CRITICAL]:
      ADD: To critical_issues
        severity: issue.severity
        description: issue.description
        impact: issue.impact

IF deep_risk_output EXISTS:
  FOR each risk IN deep_risk_output.risks:
    IF risk.severity >= 8.0 AND risk.mitigation = "NONE":
      ADD: To critical_issues
        severity: "CRITICAL"
        description: risk.name
        impact: risk.impact

SORT: critical_issues BY severity DESC (BLOCKER > CRITICAL)
STORE: In synthesis_data.critical_issues
COUNT: critical_issues_count
```

## 3. GENERATE_RECOMMENDATION

```
LOAD: recommendation_synthesis FROM brief_template

APPLY: decision_tree rules IN ORDER:

  1. CHECK: critical_issues contains severity = BLOCKER
     IF TRUE:
       FIND: blocker_issue = FIRST issue WHERE severity = BLOCKER
       SET: recommendation
         action: "NO-GO"
         priority: "CRITICAL"
         rationale: "Blocker issue present - {blocker_issue.description}. Cannot proceed without resolution."
       GOTO: store_recommendation

  2. CHECK: deep_verify_output.verdict = "NO-GO"
     IF TRUE:
       SET: recommendation
         action: "NO-GO"
         priority: "HIGH"
         rationale: "Verification failed with verdict: {verdict}. Score: {score}/10."
       GOTO: store_recommendation

  3. CHECK: critical_issues_count >= 3
     IF TRUE:
       SET: recommendation
         action: "NO-GO"
         priority: "HIGH"
         rationale: "{critical_issues_count} critical issues identified. Risk level too high to proceed."
       GOTO: store_recommendation

  4. CHECK: deep_verify_output.verdict = "GO" AND critical_issues_count < 2
     IF TRUE:
       SET: recommendation
         action: "GO"
         priority: "NORMAL"
         rationale: "Verification passed. {score}/10 score with {confidence} confidence. Proceed with planned approach."
       GOTO: store_recommendation

  5. CHECK: deep_verify_output.verdict = "CONDITIONAL-GO"
     IF TRUE:
       EXTRACT: conditions FROM deep_verify_output
       SET: recommendation
         action: "CONDITIONAL-GO"
         priority: "NORMAL"
         rationale: "Conditional approval. Must resolve: {conditions}."
       GOTO: store_recommendation

  6. CHECK: deep_verify_output.verdict = "UNCERTAIN"
     IF TRUE:
       SET: recommendation
         action: "PIVOT"
         priority: "MEDIUM"
         rationale: "Verification uncertain. Additional analysis required before decision."
       GOTO: store_recommendation

  7. DEFAULT:
     SET: recommendation
       action: "REVIEW-REQUIRED"
       priority: "MEDIUM"
       rationale: "Insufficient information for automated recommendation. Manual review required."

LABEL: store_recommendation
STORE: recommendation IN synthesis_data
```

## 4. GENERATE_NEXT_STEPS

```
LOAD: next_steps_generation FROM brief_template

INITIALIZE: next_steps = []

IF recommendation.action = "NO-GO":
  APPLY: next_steps_generation.for_NO_GO
  FOR each issue IN critical_issues WHERE severity = BLOCKER:
    ADD: "Resolve blocker: {issue.description}"
  FOR each issue IN critical_issues WHERE severity = CRITICAL:
    ADD: "Address critical issue: {issue.description}"
  ADD: "Re-assess decision readiness after resolution"

IF recommendation.action = "GO":
  APPLY: next_steps_generation.for_GO
  EXTRACT: top_option FROM synthesis_data.options_identified LIMIT 1
  ADD: "Proceed with {top_option.name}"
  FOR each risk IN synthesis_data.top_risks WHERE impact IN [HIGH, CRITICAL]:
    ADD: "Monitor risk: {risk.name}"

IF recommendation.action = "CONDITIONAL-GO":
  APPLY: next_steps_generation.for_CONDITIONAL_GO
  EXTRACT: conditions FROM deep_verify_output
  FOR each condition:
    ADD: "Fulfill condition: {condition.description}"

IF recommendation.action = "PIVOT":
  APPLY: next_steps_generation.for_PIVOT
  IDENTIFY: information_gaps
  FOR each gap:
    ADD: "Conduct additional analysis: {gap}"

STORE: next_steps IN synthesis_data
```

## 5. COUNTER_CHECK

```
REQUIREMENT: Verify synthesis logic and recommendation soundness
EXECUTE:
  1. EXTRACTION_COMPLETENESS_CHECK:
     QUESTION: "Were key findings extracted from all available outputs?"
     FOR each output_type IN [deep_explore, deep_risk, deep_verify, deep_synthesis]:
       IF output EXISTS:
         VERIFY: Findings extracted
       IF output MISSING:
         CONFIRM: "Output not available - acceptable"
     CONFIRM: "Key findings extracted"

  2. CRITICAL_ISSUE_IDENTIFICATION_CHECK:
     QUESTION: "Are all critical issues correctly identified?"
     FOR each issue IN critical_issues:
       VERIFY: severity is BLOCKER or CRITICAL
       VERIFY: description is NOT_EMPTY
     IF invalid_issues:
       CORRECT: Remove or reclassify
     IF valid:
       CONFIRM: "{critical_issues_count} critical issues identified"

  3. RECOMMENDATION_LOGIC_CHECK:
     QUESTION: "Does recommendation follow decision tree logic?"
     VERIFY: recommendation.action matches decision tree rules
     VERIFY: recommendation.rationale is specific and actionable
     IF illogical:
       CORRECT: Re-apply decision tree
     IF logical:
       CONFIRM: "Recommendation: {recommendation.action}"

  4. NEXT_STEPS_RELEVANCE_CHECK:
     QUESTION: "Are next steps relevant to recommendation?"
     FOR each step IN next_steps:
       VERIFY: step addresses recommendation.action
       VERIFY: step is actionable
     IF irrelevant_steps:
       CORRECT: Remove or refine steps
     IF relevant:
       CONFIRM: "{LENGTH(next_steps)} next steps generated"

  5. BLOCKER_HANDLING_CHECK:
     QUESTION: "If blockers exist, is recommendation NO-GO?"
     COUNT: blockers WHERE severity = BLOCKER
     IF blockers > 0:
       VERIFY: recommendation.action = "NO-GO"
       IF not_NO_GO:
         CORRECT: Override recommendation to NO-GO
       IF correct:
         CONFIRM: "Blocker present - NO-GO enforced"

  6. REPORT:
     OUTPUT: "Counter-check executed"
     OUTPUT: "Key findings extracted: YES/NO"
     OUTPUT: "Critical issues: {critical_issues_count}"
     OUTPUT: "Recommendation: {recommendation.action}"
     OUTPUT: "Next steps: {LENGTH(next_steps)}"

VIOLATION: Skipping counter-check is VIOLATION
```

## 6. CHECKLIST

```
ANSWER YES/NO:
□ Key findings extracted from all available outputs?
□ Critical issues identified and classified?
□ Recommendation generated via decision tree?
□ Next steps generated for recommendation?
□ Blocker handling verified?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_3
```

## 7. GATE_3

```
EVALUATE:
  key_findings_extracted = synthesis_data.options_identified EXISTS OR synthesis_data.top_risks EXISTS
  critical_issues_identified = critical_issues IS_SET
  recommendation_generated = recommendation EXISTS
  next_steps_generated = next_steps EXISTS AND LENGTH(next_steps) >= 1

IF all TRUE:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - Synthesis complete, proceeding to STEP 4 (RENDER)"
  OUTPUT: "Recommendation: {recommendation.action}"
  OUTPUT: "Priority: {recommendation.priority}"
  OUTPUT: "Critical issues: {critical_issues_count}"
  OUTPUT: "Next steps: {LENGTH(next_steps)}"
  NEXT_STEP: "steps/step-04-render.md"

IF any FALSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without extracting findings:
  HALT
  OUTPUT: "VIOLATION: Section 1 EXTRACT_KEY_FINDINGS required"
  RETURN to section 1

IF agent skips critical issue identification:
  HALT
  OUTPUT: "VIOLATION: Section 2 IDENTIFY_CRITICAL_ISSUES required"
  RETURN to section 2

IF agent skips recommendation generation:
  HALT
  OUTPUT: "VIOLATION: Section 3 GENERATE_RECOMMENDATION required"
  RETURN to section 3

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 5 COUNTER_CHECK required"
  RETURN to section 5
```
