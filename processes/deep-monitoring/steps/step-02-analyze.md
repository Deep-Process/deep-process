# STEP 2: ANALYZE

## ENFORCED SEQUENCE

```
1. LOAD_COLLECTED_DATA
2. CALCULATE_GATE_METRICS
3. CALCULATE_ASSUMPTION_METRICS
4. CALCULATE_COUNTER_CHECK_METRICS
5. CALCULATE_EVIDENCE_RATIO
6. CALCULATE_COMPLETENESS_SCORE
7. COUNTER_CHECK
8. CHECKLIST
9. GATE_2
```

---

## 1. LOAD_COLLECTED_DATA

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT with "ERROR: GATE_1 not open"

LOAD: Data collected in step-01
  - gate_data
  - assumptions_data
  - counter_check_data
  - scope_reduction_data
  - process_metadata

VERIFY: All data structures loaded
```

---

## 2. CALCULATE_GATE_METRICS

```
COMPUTE gate passage metrics.

EXECUTE:

  gate_pass_rate = (gates_passed / total_gates) × 100%

  gate_failure_details:
    FOR each gate WHERE status = CLOSED:
      EXTRACT:
        - gate_id
        - conditions_failed
        - violations

      CLASSIFY failure severity:
        IF violations contains "CRITICAL":
          severity = CRITICAL
        ELSE IF violations contains "BLOCKER":
          severity = BLOCKER
        ELSE:
          severity = STANDARD

  first_attempt_pass_rate:
    COUNT gates passed on first evaluation (no re-attempts)
    first_attempt_passes / total_gates × 100%

STORE:
```yaml
gate_metrics:
  total_gates: [N]
  gates_passed: [N]
  gates_failed: [N]
  gates_not_evaluated: [N]
  pass_rate: [percentage]%
  first_attempt_pass_rate: [percentage]%
  failures:
    - gate_id: "[id]"
      severity: CRITICAL | BLOCKER | STANDARD
      conditions_failed: [N]
      violations: ["[violation]", ...]
```

COMPARE to threshold:
  IF gate_pass_rate < thresholds.gates_passed_min:
    FLAG: below_gate_threshold = TRUE
  ELSE:
    FLAG: below_gate_threshold = FALSE
```

---

## 3. CALCULATE_ASSUMPTION_METRICS

```
COMPUTE assumption declaration and verification metrics.

EXECUTE:

  assumptions_per_phase_avg = total_assumptions / number_of_phases

  assumption_status_distribution:
    verified_count = COUNT(status = VERIFIED)
    survived_count = COUNT(status = SURVIVED)
    falsified_count = COUNT(status = FALSIFIED)
    untested_count = COUNT(status = UNTESTED)

  verification_rate = (verified_count / total_assumptions) × 100%
  falsification_rate = (falsified_count / total_assumptions) × 100%
  untested_rate = (untested_count / total_assumptions) × 100%

  phases_without_assumptions:
    FOR each phase:
      IF assumptions_per_phase[phase] = 0:
        RECORD: phase missing assumptions

STORE:
```yaml
assumption_metrics:
  total_assumptions: [N]
  per_phase_avg: [avg]
  status_distribution:
    verified: [N]
    survived: [N]
    falsified: [N]
    untested: [N]
  rates:
    verification: [percentage]%
    falsification: [percentage]%
    untested: [percentage]%
  phases_missing_assumptions: ["[phase_id]", ...] | []
```

COMPARE to threshold:
  IF assumptions_per_phase_avg < thresholds.assumptions_declared_min:
    FLAG: below_assumption_threshold = TRUE
  IF untested_rate > 50%:
    FLAG: high_untested_rate = TRUE
```

---

## 4. CALCULATE_COUNTER_CHECK_METRICS

```
COMPUTE counter-check execution and effectiveness metrics.

EXECUTE:

  counter_checks_per_phase_avg = total_counter_checks / number_of_phases

  counter_check_results_distribution:
    confirmed_count = COUNT(result = CONFIRMED)
    weakened_count = COUNT(result = WEAKENED)
    refuted_count = COUNT(result = REFUTED)

  effectiveness_rate = (weakened_count + refuted_count) / total_counter_checks × 100%

  phases_without_counter_checks:
    FOR each phase:
      IF counter_checks_per_phase[phase] = 0:
        RECORD: phase missing counter-checks

STORE:
```yaml
counter_check_metrics:
  total_counter_checks: [N]
  per_phase_avg: [avg]
  results_distribution:
    confirmed: [N]
    weakened: [N]
    refuted: [N]
  effectiveness_rate: [percentage]%
  phases_missing_checks: ["[phase_id]", ...] | []
```

COMPARE to threshold:
  IF counter_checks_per_phase_avg < thresholds.counter_checks_min:
    FLAG: below_counter_check_threshold = TRUE
  IF effectiveness_rate = 0%:
    FLAG: no_claims_challenged = TRUE (rubber-stamping)
```

---

## 5. CALCULATE_EVIDENCE_RATIO

```
COMPUTE ratio of VERIFIED to ASSUMED evidence.

PREREQUISITE: Process must track evidence status (VERIFIED vs ASSUMED).

IF evidence data available in process-log.yaml:
  EXTRACT:
    verified_evidence_count
    assumed_evidence_count

  CALCULATE:
    total_evidence = verified_evidence_count + assumed_evidence_count
    verified_ratio = (verified_evidence_count / total_evidence) × 100%

  STORE:
```yaml
evidence_metrics:
  verified_count: [N]
  assumed_count: [M]
  total_count: [N+M]
  verified_ratio: [percentage]%
```

  COMPARE to threshold:
    IF verified_ratio < thresholds.verified_ratio_min:
      FLAG: below_evidence_threshold = TRUE

ELSE (evidence data not available):
  RECORD:
```yaml
evidence_metrics:
  status: NOT_AVAILABLE
  reason: "Process does not track VERIFIED/ASSUMED status"
```

  FLAG: evidence_tracking_unavailable = TRUE
```

---

## 6. CALCULATE_COMPLETENESS_SCORE

```
COMPUTE overall process execution completeness score.

EXECUTE:

  ASSIGN points:
    phase_completion_points:
      FOR each phase completed:
        points += 10

    gate_passage_points:
      points += (gates_passed / total_gates) × 50

    assumption_declaration_points:
      points += MIN(total_assumptions, 20)

    counter_check_execution_points:
      points += MIN(total_counter_checks × 2, 20)

  SUBTRACT penalties:
    scope_reduction_penalty:
      FOR each scope_reduction WHERE criticality = CRITICAL:
        points -= 10
      FOR each scope_reduction WHERE criticality = REQUIRED:
        points -= 5

  CALCULATE:
    completeness_score = phase_completion_points
                       + gate_passage_points
                       + assumption_declaration_points
                       + counter_check_execution_points
                       - scope_reduction_penalty

  NORMALIZE:
    completeness_percentage = (completeness_score / 100) × 100%
    completeness_percentage = MIN(completeness_percentage, 100%)

STORE:
```yaml
completeness_metrics:
  raw_score: [N]
  percentage: [percentage]%
  components:
    phase_completion: [N]
    gate_passage: [N]
    assumptions: [N]
    counter_checks: [N]
    penalties: [N]
```

CLASSIFY:
  IF completeness_percentage >= 90%:
    completeness_level = EXCELLENT
  ELSE IF completeness_percentage >= 75%:
    completeness_level = GOOD
  ELSE IF completeness_percentage >= 60%:
    completeness_level = ADEQUATE
  ELSE IF completeness_percentage >= 40%:
    completeness_level = MARGINAL
  ELSE:
    completeness_level = INSUFFICIENT
```

---

## 7. COUNTER_CHECK

```
REQUIREMENT: Verify metric calculations.

EXECUTE:
  1. METRIC_CALCULATION_CHECK:
     SELECT: gate_pass_rate calculation
     VERIFY: Manual recount
       gates_passed_manual = COUNT gates WHERE status = OPEN
       rate_manual = (gates_passed_manual / total_gates) × 100%
     COMPARE: rate_manual vs gate_pass_rate
     IF mismatch:
       FLAG: calculation_error = TRUE
       RECORD: Expected=[rate_manual], Actual=[gate_pass_rate]
       CORRECT: Use manual calculation
     IF match:
       CONFIRM: Calculation accurate

  2. THRESHOLD_COMPARISON_CHECK:
     ASK: "Are threshold comparisons correctly evaluated?"
     FOR each threshold check:
       VERIFY: Flag set correctly based on comparison
     IF incorrect flag:
       FLAG: threshold_evaluation_error = TRUE
       CORRECT: Re-evaluate threshold comparison
     IF all correct:
       CONFIRM: Thresholds evaluated correctly

  3. COMPLETENESS_SCORE_SANITY_CHECK:
     ASK: "Does completeness score match intuition about execution quality?"
     CONSIDER:
       - High gate pass rate + high score = consistent
       - Low gate pass rate + high score = suspicious
       - Many critical scope reductions + high score = suspicious
     IF suspicious combination:
       FLAG: score_inconsistency = TRUE
       INVESTIGATE: Scoring formula validity
     IF consistent:
       CONFIRM: Score appears valid

RECORD:
```yaml
counter_checks:
  - check_id: CC2-01
    check: "Metric calculation accuracy"
    result: PASSED | CORRECTED
    errors_found: [N]
  - check_id: CC2-02
    check: "Threshold evaluation"
    result: PASSED | CORRECTED
    errors_found: [N]
  - check_id: CC2-03
    check: "Completeness score sanity"
    result: PASSED | FLAGGED
    flags: ["[flag]", ...] | []
```

VIOLATION: Skipping counter-check is VIOLATION.
```

---

## 8. CHECKLIST

```
ANSWER YES/NO:
□ Collected data loaded from step-01?
□ Gate metrics calculated (pass rate, failure details)?
□ Assumption metrics calculated (per phase, status distribution)?
□ Counter-check metrics calculated (per phase, effectiveness)?
□ Evidence ratio calculated OR unavailability recorded?
□ Completeness score calculated (with all components)?
□ Threshold comparisons performed (all flags set)?
□ Counter-checks executed (all 3)?
□ Counter-check results recorded?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_2
```

---

## 9. GATE_2

```
EVALUATE:
  execution_quality_scored = TRUE
  metrics_calculated = TRUE
  counter_check_executed = TRUE

COUNT:
  metrics_calculated = 4 (gate, assumption, counter-check, completeness)
  thresholds_evaluated = 4
  counter_checks_executed = 3

IF all TRUE AND metrics_calculated = 4 AND counter_checks_executed = 3:
  GATE_2 = OPEN
  OUTPUT: "GATE_2 OPEN - metrics calculated, completeness=[percentage]%"
  PROCEED to workflow.md for next step

IF any FALSE:
  GATE_2 = CLOSED
  OUTPUT: "GATE_2 CLOSED - reason: [which condition failed]"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading data:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_COLLECTED_DATA required"
  RETURN to section 1

IF agent proceeds without calculating gate metrics:
  HALT
  OUTPUT: "VIOLATION: Section 2 CALCULATE_GATE_METRICS required"
  RETURN to section 2

IF agent skips completeness score:
  HALT
  OUTPUT: "VIOLATION: Section 6 CALCULATE_COMPLETENESS_SCORE required"
  RETURN to section 6

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 7 COUNTER_CHECK required"
  RETURN to section 7
```
