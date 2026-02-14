# STEP 4: ASSESS

## ENFORCED SEQUENCE

```
1. LOAD_FINDINGS
2. ASSESS_IMPACT
3. ASSESS_URGENCY
4. CALCULATE_RISK_SCORE
5. PRIORITIZE_FINDINGS
6. GENERATE_RECOMMENDATIONS
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_4
```

---

## 1. LOAD_FINDINGS

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: Findings detected in step-03
  - violations
  - anomalies
  - gaps
  - patterns
  - findings_summary

VERIFY: All findings loaded
```

---

## 2. ASSESS_IMPACT

```
EVALUATE impact of each finding on process quality.

FOR each finding in all_findings:
  DETERMINE impact_dimension:

    IF finding.type IN [GATE_BLOCKING_VIOLATION, MISSING_ASSUMPTIONS]:
      impact_on_validity = HIGH
      description = "Undermines process validity"

    IF finding.type IN [MISSING_COUNTER_CHECKS, RUBBER_STAMPING]:
      impact_on_rigor = HIGH
      description = "Reduces critical thinking rigor"

    IF finding.type IN [EXCESSIVE_ASSUMPTIONS, BELOW_EVIDENCE_THRESHOLD]:
      impact_on_confidence = HIGH
      description = "Lowers confidence in conclusions"

    IF finding.type IN [BELOW_GATE_THRESHOLD, BELOW_ASSUMPTION_THRESHOLD]:
      impact_on_completeness = HIGH
      description = "Reduces execution completeness"

    IF finding.type IN [SUSPICIOUSLY_FAST, QUALITY_DEGRADATION]:
      impact_on_trustworthiness = MEDIUM
      description = "Questions execution thoroughness"

  QUANTIFY impact:
    impact_score = 0

    IF impact_on_validity = HIGH:
      impact_score += 10
    IF impact_on_rigor = HIGH:
      impact_score += 7
    IF impact_on_confidence = HIGH:
      impact_score += 5
    IF impact_on_completeness = HIGH:
      impact_score += 3
    IF impact_on_trustworthiness = MEDIUM:
      impact_score += 2

  CLASSIFY impact_level:
    IF impact_score >= 10:
      impact_level = SEVERE
    ELSE IF impact_score >= 7:
      impact_level = HIGH
    ELSE IF impact_score >= 4:
      impact_level = MEDIUM
    ELSE:
      impact_level = LOW

  STORE for finding:
```yaml
impact_assessment:
  impact_score: [N]
  impact_level: SEVERE | HIGH | MEDIUM | LOW
  dimensions_affected:
    validity: HIGH | MEDIUM | LOW | NONE
    rigor: HIGH | MEDIUM | LOW | NONE
    confidence: HIGH | MEDIUM | LOW | NONE
    completeness: HIGH | MEDIUM | LOW | NONE
    trustworthiness: HIGH | MEDIUM | LOW | NONE
  description: "[impact description]"
```
```

---

## 3. ASSESS_URGENCY

```
EVALUATE urgency of addressing each finding.

FOR each finding in all_findings:
  DETERMINE urgency_factors:

    time_sensitivity:
      IF finding.type = GATE_BLOCKING_VIOLATION:
        time_sensitivity = IMMEDIATE (blocks current execution)
      ELSE IF finding.type IN [MISSING_ASSUMPTIONS, MISSING_COUNTER_CHECKS]:
        time_sensitivity = HIGH (affects ongoing phases)
      ELSE IF finding.type IN [BELOW_THRESHOLD]:
        time_sensitivity = MEDIUM (affects future executions)
      ELSE:
        time_sensitivity = LOW (informational)

    cascading_effect:
      IF finding.affected_phase = early phase (0-2):
        cascading_effect = HIGH (errors propagate forward)
      ELSE IF finding.affected_phase = middle phase (3-4):
        cascading_effect = MEDIUM
      ELSE IF finding.affected_phase = late phase (5+):
        cascading_effect = LOW (limited propagation)
      ELSE:
        cascading_effect = NONE (cross-phase issue)

  QUANTIFY urgency:
    urgency_score = 0

    IF time_sensitivity = IMMEDIATE:
      urgency_score += 10
    ELSE IF time_sensitivity = HIGH:
      urgency_score += 7
    ELSE IF time_sensitivity = MEDIUM:
      urgency_score += 4
    ELSE:
      urgency_score += 1

    IF cascading_effect = HIGH:
      urgency_score += 5
    ELSE IF cascading_effect = MEDIUM:
      urgency_score += 3
    ELSE IF cascading_effect = LOW:
      urgency_score += 1

  CLASSIFY urgency_level:
    IF urgency_score >= 12:
      urgency_level = CRITICAL
    ELSE IF urgency_score >= 8:
      urgency_level = HIGH
    ELSE IF urgency_score >= 4:
      urgency_level = MEDIUM
    ELSE:
      urgency_level = LOW

  STORE for finding:
```yaml
urgency_assessment:
  urgency_score: [N]
  urgency_level: CRITICAL | HIGH | MEDIUM | LOW
  factors:
    time_sensitivity: IMMEDIATE | HIGH | MEDIUM | LOW
    cascading_effect: HIGH | MEDIUM | LOW | NONE
```
```

---

## 4. CALCULATE_RISK_SCORE

```
COMBINE impact and urgency into risk score.

FOR each finding in all_findings:
  CALCULATE:
    risk_score = (impact_score × 0.6) + (urgency_score × 0.4)

  CLASSIFY risk_level:
    IF risk_score >= 15:
      risk_level = CRITICAL
    ELSE IF risk_score >= 10:
      risk_level = HIGH
    ELSE IF risk_score >= 5:
      risk_level = MEDIUM
    ELSE:
      risk_level = LOW

  DETERMINE action_required:
    IF risk_level = CRITICAL:
      action_required = IMMEDIATE_REMEDIATION
      description = "Must be addressed before using process results"

    ELSE IF risk_level = HIGH:
      action_required = PRIORITY_REMEDIATION
      description = "Should be addressed before next process execution"

    ELSE IF risk_level = MEDIUM:
      action_required = PLANNED_REMEDIATION
      description = "Address in process improvement cycle"

    ELSE:
      action_required = MONITOR
      description = "Track but no immediate action needed"

  STORE for finding:
```yaml
risk_assessment:
  risk_score: [N]
  risk_level: CRITICAL | HIGH | MEDIUM | LOW
  action_required: "[action]"
  description: "[description]"
```
```

---

## 5. PRIORITIZE_FINDINGS

```
SORT findings by priority for remediation.

EXECUTE:

  CREATE priority_queue:
    PRIMARY sort: risk_level (CRITICAL > HIGH > MEDIUM > LOW)
    SECONDARY sort: risk_score (descending within risk_level)
    TERTIARY sort: urgency_score (descending within risk_score)

  ASSIGN priority_rank:
    rank = 1
    FOR each finding in priority_queue:
      finding.priority_rank = rank
      rank += 1

  GROUP by action_required:
    immediate_action_items = findings WHERE action_required = IMMEDIATE_REMEDIATION
    priority_action_items = findings WHERE action_required = PRIORITY_REMEDIATION
    planned_action_items = findings WHERE action_required = PLANNED_REMEDIATION
    monitoring_items = findings WHERE action_required = MONITOR

STORE:
```yaml
prioritized_findings:
  immediate_action:
    count: [N]
    items:
      - finding_id: "[id]"
        priority_rank: [N]
        risk_score: [score]
        description: "[brief description]"
  priority_action:
    count: [N]
    items: [...]
  planned_action:
    count: [N]
    items: [...]
  monitoring:
    count: [N]
    items: [...]
```
```

---

## 6. GENERATE_RECOMMENDATIONS

```
CREATE actionable recommendations for each finding category.

FOR each finding in immediate_action_items:
  GENERATE recommendation:
    what: "[specific action to take]"
    why: "[rationale based on impact/urgency]"
    how: "[implementation steps]"
    owner: "[who should address]"
    deadline: IMMEDIATE

  EXAMPLE:
    IF finding = GATE_BLOCKING_VIOLATION:
      what: "Halt process execution and fix gate condition"
      why: "Process proceeded past failed gate, invalidating subsequent phases"
      how: "1. Identify root cause of gate failure. 2. Fix violation. 3. Re-execute from failed gate"
      owner: "Process executor"
      deadline: IMMEDIATE

FOR each finding in priority_action_items:
  GENERATE recommendation:
    what: "[specific action]"
    why: "[rationale]"
    how: "[steps]"
    owner: "[who]"
    deadline: BEFORE_NEXT_EXECUTION

FOR each finding in planned_action_items:
  GENERATE recommendation:
    what: "[improvement action]"
    why: "[rationale]"
    how: "[steps]"
    owner: "[who]"
    deadline: NEXT_IMPROVEMENT_CYCLE

FOR each finding in monitoring_items:
  GENERATE recommendation:
    what: "Track [metric] for trend"
    why: "[watching for degradation]"
    how: "Monitor in next N executions"
    owner: "Process monitor"
    deadline: ONGOING

STORE:
```yaml
recommendations:
  - finding_id: "[id]"
    action: "[what]"
    rationale: "[why]"
    implementation: "[how]"
    owner: "[who]"
    deadline: IMMEDIATE | BEFORE_NEXT_EXECUTION | NEXT_IMPROVEMENT_CYCLE | ONGOING
```
```

---

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify assessment accuracy.

EXECUTE:
  1. IMPACT_ASSESSMENT_CHECK:
     SELECT: 2 SEVERE impact findings
     FOR each:
       ASK: "Is impact truly SEVERE or overstated?"
       EXAMINE: Impact dimensions affected
       CONSIDER: Could process results still be valid despite finding?
       IF impact overstated:
         FLAG: impact_overassessed = TRUE
         RECOMMEND: Downgrade impact level
       IF impact appropriate:
         CONFIRM: Impact assessment valid

  2. RISK_SCORE_CALCULATION_CHECK:
     SELECT: 1 CRITICAL risk finding
     VERIFY: Manual calculation
       manual_risk = (impact_score × 0.6) + (urgency_score × 0.4)
     COMPARE: manual_risk vs finding.risk_score
     IF mismatch:
       FLAG: calculation_error = TRUE
       CORRECT: Use manual calculation
     IF match:
       CONFIRM: Calculation accurate

  3. RECOMMENDATION_ACTIONABILITY_CHECK:
     SELECT: 3 random recommendations
     FOR each:
       ASK: "Is this recommendation actionable and specific?"
       EVALUATE:
         - Does it specify WHAT to do?
         - Does it specify HOW to do it?
         - Is WHO responsible clear?
       IF vague or unactionable:
         FLAG: vague_recommendation = TRUE
         REVISE: Make recommendation more specific
       IF actionable:
         CONFIRM: Recommendation clear

RECORD:
```yaml
counter_checks:
  - check_id: CC4-01
    check: "Impact assessment accuracy"
    result: PASSED | ADJUSTED
    adjustments: [N]
  - check_id: CC4-02
    check: "Risk score calculation"
    result: PASSED | CORRECTED
    errors_found: [N]
  - check_id: CC4-03
    check: "Recommendation actionability"
    result: PASSED | REVISED
    revisions: [N]
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Findings loaded from step-03?
□ Impact assessed for ALL findings?
□ Urgency assessed for ALL findings?
□ Risk score calculated for ALL findings?
□ Findings prioritized (sorted by risk)?
□ Action required assigned to ALL findings?
□ Recommendations generated for ALL findings?
□ Counter-checks executed (all 3)?
□ Counter-check results recorded?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

---

## 9. GATE_4

```
EVALUATE:
  severity_assessed = TRUE
  impact_evaluated = TRUE
  counter_check_executed = TRUE

COUNT:
  findings_assessed = COUNT(findings WITH impact_assessment AND urgency_assessment AND risk_assessment)
  recommendations_generated = COUNT(recommendations)
  counter_checks_executed = 3

IF all TRUE AND findings_assessed = total_findings AND counter_checks_executed = 3:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - findings assessed, recommendations=[N]"
  PROCEED to workflow.md for next step

IF any FALSE OR findings_assessed < total_findings:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without impact assessment:
  HALT
  OUTPUT: "VIOLATION: Section 2 ASSESS_IMPACT required for ALL findings"
  RETURN to section 2

IF agent proceeds without urgency assessment:
  HALT
  OUTPUT: "VIOLATION: Section 3 ASSESS_URGENCY required for ALL findings"
  RETURN to section 3

IF agent proceeds without recommendations:
  HALT
  OUTPUT: "VIOLATION: Section 6 GENERATE_RECOMMENDATIONS required"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
