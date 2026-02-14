# STEP 4: COLLECT

## ENFORCED SEQUENCE

```
1. LOAD_GAPS
2. EXECUTE_METHOD_328
3. COLLECT_EVIDENCE
4. VERIFY_EVIDENCE
5. DOCUMENT_COVERAGE
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_4
```

## 1. LOAD_GAPS

```
PRECONDITION: GATE_3 = OPEN
IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

LOAD: Gap analysis from step-03
FILTER: WHERE status = COVERED
STORE: evidence_collection_scope
VERIFY: covered_requirements_count >= 0
```

## 2. EXECUTE_METHOD_328

```
IF Method 328 (Audit Trail Generator) available:
  EXECUTE: method_328.initialize()

  FOR each covered_requirement:
    EXECUTE: method_328.collect_evidence(requirement)
    STORE: evidence_trail

  OUTPUT:
```yaml
evidence_collection:
  method: "Method 328 - Audit Trail Generator"
  requirements_processed: N
  evidence_items_collected: E
  trail_complete: TRUE
```

ELSE:
  EXECUTE: manual evidence collection (section 3)
```

## 3. COLLECT_EVIDENCE

```
FOR each requirement WHERE status = COVERED:
  IDENTIFY evidence types needed:

    DOCUMENTATION evidence:
      - Architecture diagrams
      - Design documents
      - Policy documents
      - Process definitions
      - User guides

    CODE evidence:
      - Implementation files
      - Configuration files
      - Test files
      - Infrastructure-as-code

    TESTING evidence:
      - Unit test results
      - Integration test results
      - Security test results
      - Bias/fairness test results

    OPERATIONAL evidence:
      - Logs showing requirement compliance
      - Monitoring dashboards
      - Incident response records
      - Audit trails

  COLLECT evidence artifacts:
```yaml
evidence_artifact:
  evidence_id: EVD-001
  requirement_id: REQ-001
  evidence_type: DOCUMENTATION | CODE | TESTING | OPERATIONAL
  artifact_location: "[file path or URL]"
  artifact_hash: "[SHA-256]"
  created_date: "[date]"
  last_modified: "[date]"
  freshness_days: N
  quality: HIGH | MEDIUM | LOW
```

REQUIREMENT: Collect evidence for ALL covered requirements
VIOLATION: Collecting evidence for "critical" requirements only is VIOLATION
```

## 4. VERIFY_EVIDENCE

```
FOR each evidence_artifact:
  VERIFY existence:
    ACCESS: artifact_location
    IF not_accessible:
      MARK: evidence_status = MISSING
      DOCUMENT: Why inaccessible
    IF accessible:
      COMPUTE: artifact_hash
      MARK: evidence_status = VERIFIED

  VERIFY freshness:
    COMPUTE: freshness_days = current_date - last_modified
    IF freshness_days > 180:
      MARK: staleness = STALE
      RECOMMEND: Update evidence
    IF freshness_days <= 180:
      MARK: staleness = FRESH

  VERIFY quality:
    CHECK completeness:
      - Documentation complete and clear?
      - Code properly commented?
      - Tests comprehensive?
      - Logs sufficient?

    CLASSIFY quality:
      IF complete AND clear AND comprehensive:
        quality = HIGH
      IF mostly_complete:
        quality = MEDIUM
      IF incomplete:
        quality = LOW

  RECORD verification:
```yaml
evidence_verification:
  evidence_id: EVD-001
  verification_date: "[date]"
  status: VERIFIED | MISSING | INVALID
  staleness: FRESH | STALE
  quality: HIGH | MEDIUM | LOW
  issues: ["[issue 1]", "[issue 2]"]
```
```

## 5. DOCUMENT_COVERAGE

```
FOR each requirement:
  AGGREGATE evidence:
    COUNT: evidence_artifacts for requirement
    COMPUTE: quality_score = AVG(evidence quality)

  ASSESS evidence sufficiency:
    IF evidence_count >= 2 AND quality_score >= MEDIUM:
      evidence_sufficient = YES
    IF evidence_count < 2 OR quality_score < MEDIUM:
      evidence_sufficient = NO
      DOCUMENT: What additional evidence needed

  CREATE coverage report:
```yaml
evidence_coverage:
  requirement_id: REQ-001
  evidence_count: N
  evidence_types: [DOCUMENTATION, CODE, TESTING]
  quality_score: "[average]"
  sufficient: YES | NO
  gaps: ["[gap 1 if insufficient]", "[gap 2]"]
```

COMPUTE overall statistics:
  total_covered_requirements = FROM step-03
  requirements_with_evidence = WHERE evidence_count > 0
  requirements_sufficient_evidence = WHERE sufficient = YES
  evidence_coverage_rate = requirements_with_evidence / total_covered_requirements
```

## 6. COUNTER_CHECK

```
REQUIREMENT: Verify evidence completeness
EXECUTE:
  1. MISSING EVIDENCE CHECK:
     FOR requirements WHERE evidence_count = 0:
       ASK: "Where might evidence exist?"
       SEARCH: Additional locations
       IF evidence_found:
         ADD: To evidence inventory
       IF truly_missing:
         DOWNGRADE: requirement status to PARTIAL or GAP

  2. QUALITY CHECK:
     FOR evidence WHERE quality = LOW:
       INVESTIGATE: Why low quality
       IF improvable:
         RECOMMEND: Evidence improvement
       IF inherent_limitation:
         DOCUMENT: Quality limitation

  3. FRESHNESS CHECK:
     FOR evidence WHERE staleness = STALE:
       VERIFY: Still accurate
       IF outdated:
         MARK: evidence_invalid = TRUE
         REQUIRE: Updated evidence
       IF still_valid:
         ACCEPT: With staleness note

  4. SUFFICIENCY CHECK:
     FOR requirements WHERE sufficient = NO:
       IDENTIFY: What evidence is missing
       SEARCH: For missing evidence types
       IF found:
         ADD: To collection
       IF not_found:
         DOCUMENT: Evidence gap

  5. REPORT:
     "Counter-check executed"
     "Missing evidence found: M"
     "Quality issues resolved: Q"
     "Stale evidence updated: S"
     "Sufficiency gaps addressed: G"

VIOLATION: Skipping counter-check is VIOLATION
```

## 7. CHECKLIST

```
ANSWER YES/NO:
□ Gaps loaded from GATE_3?
□ Method 328 executed OR manual collection complete?
□ Evidence collected for ALL covered requirements?
□ Evidence verified (existence, freshness, quality)?
□ Coverage documented?
□ Counter-check executed?
□ All evidence accessible?

IF any NO → FIX before proceeding
IF all YES → PROCEED to GATE_4
```

## 8. GATE_4

```
EVALUATE:
  evidence_collected >= covered_requirements_count
  evidence_verified = TRUE
  counter_check_executed = TRUE

COUNT:
  total_covered = FROM step-03 WHERE status = COVERED
  requirements_with_evidence = WHERE evidence_count > 0
  verified_evidence = WHERE status = VERIFIED

COMPUTE:
  evidence_coverage = requirements_with_evidence / total_covered

IF all TRUE AND evidence_coverage >= 0.9:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - evidence = E, coverage = C%, verified = V"
  PROCEED to workflow.md for next step

IF any FALSE OR evidence_coverage < 0.9:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED - reason: [which condition failed]"
  OUTPUT: "Evidence coverage: [coverage]% (threshold: 90%)"
  HALT
```

## VIOLATION RECOVERY

```
IF agent proceeds without loading gaps:
  HALT
  OUTPUT: "VIOLATION: Section 1 LOAD_GAPS required"
  RETURN to section 1

IF agent collects evidence for subset:
  HALT
  OUTPUT: "VIOLATION: Evidence required for ALL covered requirements"
  RETURN to section 3

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 4 VERIFY_EVIDENCE required"
  RETURN to section 4

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 6 COUNTER_CHECK required"
  RETURN to section 6
```
