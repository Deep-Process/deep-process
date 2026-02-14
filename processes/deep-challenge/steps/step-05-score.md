# STEP 5: SCORE

## ENFORCED SEQUENCE

```
1. LOAD_FAILURES
2. EXECUTE_METHOD_131
3. ASSIGN_CVSS_SCORES
4. CLASSIFY_SEVERITY
5. PRIORITIZE_REMEDIATION
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_5
```

## 1. LOAD_FAILURES

```
PRECONDITION: GATE_4 = OPEN
IF GATE_4 ≠ OPEN → HALT with "ERROR: GATE_4 not open"

LOAD: All failures from step-04
LOAD: All vulnerabilities from step-03
MERGE: Create vulnerability-failure map
VERIFY: vulnerability_count >= 0
```

## 2. EXECUTE_METHOD_131

```
IF Method 131 (CVSS Scoring Engine) available:
  FOR each vulnerability:
    EXECUTE: method_131.calculate_cvss(vulnerability)

    INPUT parameters:
      - Attack Vector (AV): NETWORK/ADJACENT/LOCAL/PHYSICAL
      - Attack Complexity (AC): LOW/HIGH
      - Privileges Required (PR): NONE/LOW/HIGH
      - User Interaction (UI): NONE/REQUIRED
      - Scope (S): UNCHANGED/CHANGED
      - Confidentiality (C): NONE/LOW/HIGH
      - Integrity (I): NONE/LOW/HIGH
      - Availability (A): NONE/LOW/HIGH

    COMPUTE: Base Score (0.0-10.0)
    STORE: cvss_score, cvss_vector

ELSE:
  EXECUTE: manual CVSS scoring (section 3)
```

## 3. ASSIGN_CVSS_SCORES

```
FOR each vulnerability WITHOUT cvss_score:
  EVALUATE Attack Vector:
    IF exploitable remotely → AV = NETWORK
    IF requires network access → AV = ADJACENT
    IF requires local access → AV = LOCAL
    IF requires physical access → AV = PHYSICAL

  EVALUATE Attack Complexity:
    IF single-step exploitation → AC = LOW
    IF requires specific conditions → AC = HIGH

  EVALUATE Privileges Required:
    IF no authentication needed → PR = NONE
    IF requires user account → PR = LOW
    IF requires admin account → PR = HIGH

  EVALUATE User Interaction:
    IF exploitation automatic → UI = NONE
    IF requires user action → UI = REQUIRED

  EVALUATE Scope:
    IF impact limited to vulnerable component → S = UNCHANGED
    IF impact extends beyond component → S = CHANGED

  EVALUATE Confidentiality Impact:
    IF no data disclosure → C = NONE
    IF limited data disclosure → C = LOW
    IF total data disclosure → C = HIGH

  EVALUATE Integrity Impact:
    IF no data modification → I = NONE
    IF limited modification → I = LOW
    IF total modification → I = HIGH

  EVALUATE Availability Impact:
    IF no service disruption → A = NONE
    IF performance degradation → A = LOW
    IF total service loss → A = HIGH

  COMPUTE Base Score using CVSS v3.1 formula:
    ISS = 1 - [(1-C) × (1-I) × (1-A)]
    IF S = UNCHANGED:
      Impact = 6.42 × ISS
    IF S = CHANGED:
      Impact = 7.52 × [ISS-0.029] - 3.25 × [ISS-0.02]^15

    Exploitability = 8.22 × AV × AC × PR × UI

    IF Impact <= 0:
      Base Score = 0
    IF S = UNCHANGED:
      Base Score = Roundup(minimum[(Impact + Exploitability), 10])
    IF S = CHANGED:
      Base Score = Roundup(minimum[1.08 × (Impact + Exploitability), 10])

  STORE: cvss_score, cvss_vector
```

## 4. CLASSIFY_SEVERITY

```
FOR each vulnerability:
  READ: cvss_score

  CLASSIFY severity:
    IF cvss_score >= 9.0 → severity = CRITICAL
    IF cvss_score >= 7.0 AND cvss_score < 9.0 → severity = HIGH
    IF cvss_score >= 4.0 AND cvss_score < 7.0 → severity = MEDIUM
    IF cvss_score >= 0.1 AND cvss_score < 4.0 → severity = LOW
    IF cvss_score = 0.0 → severity = INFORMATIONAL

  COMPUTE risk_priority:
    risk_priority = cvss_score × exploitability_factor

    WHERE exploitability_factor:
      IF public_exploit_exists = TRUE → 2.0
      IF proof_of_concept_available = TRUE → 1.5
      IF theoretical_only = TRUE → 1.0

  RECORD:
```yaml
vulnerability_score:
  vulnerability_id: VUL-001
  cvss_score: 8.5
  cvss_vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N"
  severity: HIGH
  risk_priority: 12.75
  exploitability: PUBLIC_EXPLOIT
```
```

## 5. PRIORITIZE_REMEDIATION

```
LOAD: All vulnerability_scores
SORT: BY risk_priority DESC

CREATE priority_list:
  Tier 1 (IMMEDIATE):
    - severity = CRITICAL
    - risk_priority >= 15.0
    - exploitability = PUBLIC_EXPLOIT

  Tier 2 (URGENT):
    - severity = HIGH
    - risk_priority >= 10.0
    - exploitability = PROOF_OF_CONCEPT

  Tier 3 (SCHEDULED):
    - severity = MEDIUM
    - risk_priority >= 5.0

  Tier 4 (BACKLOG):
    - severity = LOW
    - risk_priority < 5.0

FOR each tier:
  COUNT vulnerabilities
  COMPUTE: Total risk = SUM(risk_priority)
  ESTIMATE: Remediation effort
    - CRITICAL: 8-40 hours per vulnerability
    - HIGH: 4-16 hours per vulnerability
    - MEDIUM: 2-8 hours per vulnerability
    - LOW: 1-4 hours per vulnerability

OUTPUT:
```yaml
remediation_priorities:
  tier_1_immediate:
    count: N1
    total_risk: R1
    estimated_effort_hours: E1
  tier_2_urgent:
    count: N2
    total_risk: R2
    estimated_effort_hours: E2
  tier_3_scheduled:
    count: N3
    total_risk: R3
    estimated_effort_hours: E3
  tier_4_backlog:
    count: N4
    total_risk: R4
    estimated_effort_hours: E4
```
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify scoring accuracy
EXECUTE:
  1. REVIEW: Top 5 highest scored vulnerabilities
     FOR each:
       ASK: "Is CVSS score inflated?"
       CHECK: Each CVSS metric justified by evidence
       IF metric not justified → RECALCULATE score
       IF justified → CONFIRM score

  2. REVIEW: All vulnerabilities scored CRITICAL
     FOR each:
       ASK: "Could this be scored HIGH instead?"
       ASK: "Is impact truly maximum?"
       ASK: "Is exploitability truly trivial?"
       IF any doubt → DOWNGRADE to HIGH and document
       IF no doubt → CONFIRM CRITICAL

  3. COMPARE: Similar vulnerabilities
     GROUP: Vulnerabilities by type
     FOR each group:
       CHECK: Score consistency within group
       IF inconsistent → INVESTIGATE and ADJUST
       IF consistent → CONFIRM

  4. SEARCH: Underscored vulnerabilities
     FOR vulnerabilities WHERE severity = LOW:
       ASK: "Could impact be higher than assessed?"
       ASK: "Could exploitability be easier?"
       IF yes → RESCORE
       IF no → CONFIRM LOW

  5. REPORT:
     "Counter-check executed"
     "Scores adjusted: A"
     "Critical confirmations: C"
     "Underscore corrections: U"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Failures loaded from GATE_4?
□ Method 131 executed OR manual CVSS scoring complete?
□ CVSS score assigned to ALL vulnerabilities?
□ Severity classification complete for ALL vulnerabilities?
□ Risk priority calculated for ALL vulnerabilities?
□ Remediation priorities established?
□ Counter-check executed?
□ Score adjustments documented?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_5
```

## 8. GATE_5

```
EVALUATE:
  scores_assigned = TRUE
  severity_count_critical >= 0
  severity_count_high >= 0
  severity_count_medium >= 0
  severity_count_low >= 0
  counter_check_executed = TRUE

COUNT:
  critical_vulnerabilities = WHERE severity = CRITICAL
  high_vulnerabilities = WHERE severity = HIGH
  total_scored = critical + high + medium + low + informational

IF all TRUE AND total_scored >= vulnerabilities_count:
  GATE_5 = OPEN
  OUTPUT: "GATE_5 OPEN - scored = N, critical = C, high = H, medium = M, low = L"
  PROCEED to workflow.md for next step

IF any FALSE OR total_scored < vulnerabilities_count:
  GATE_5 = CLOSED
  OUTPUT: "GATE_5 CLOSED - reason: [which condition failed]"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without CVSS scoring:
  HALT
  OUTPUT: "VIOLATION: Section 3 CVSS scoring required for ALL vulnerabilities"
  RETURN to section 3

IF agent skips severity classification:
  HALT
  OUTPUT: "VIOLATION: Section 4 severity classification required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
