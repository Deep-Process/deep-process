---
step: 4
name: "Evidence Collection"
time_estimate: "60-120 minutes"
goal: "Collect, verify and document evidence for covered requirements"
requires_completion: [3]
next_steps:
  DEFAULT: "steps/step-05-plan.md"
gate: "GATE_4"
data_dependencies:
  - "gap_analysis from step-03"
  - "requirements_mapping from step-02"
outputs:
  - evidence_inventory
  - verification_results
  - coverage_assessment
---

# STEP 4: COLLECT EVIDENCE

## ENFORCEMENT RULES

```
1. Collect evidence for EVERY covered requirement.
2. Verify ALL evidence (existence, freshness, quality).
3. Evidence MUST be accessible.
4. Counter-check MANDATORY.
5. Coverage threshold >= 90%.
6. NO proceeding until all processed.
```

---

## 4.0 Load Required Data

**PRECONDITION:** GATE_3 = OPEN

IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

**Execute:**

```
LOAD step-03 output:
  [ ] gap_analysis
  [ ] covered_requirements: [N]
  [ ] partial_requirements: [N]

LOAD step-02 output:
  [ ] requirements_mapping
  [ ] system_inventory

FILTER scope:
  evidence_scope = WHERE status = COVERED OR PARTIAL
  requirements_to_collect = COUNT(evidence_scope)

RECORD:
  [ ] Scope: [N] requirements
  [ ] Systems: [list IDs]

IF scope = 0:
  LOG: "No covered requirements"
  SKIP to GATE_4
```

> **HALT** — Data loaded.

---

## 4.1 Collect Evidence

**Execute for EACH requirement in evidence_scope:**

```
FOR requirement R:

  EXTRACT:
    requirement_id = R.id
    requirement_text = R.text
    system_capability = R.capability_match

  IDENTIFY evidence types:
    evidence_types = []

    IF requirement_text contains "documentation|policy|procedure":
      evidence_types += DOCUMENTATION

    IF requirement_text contains "implementation|code|system":
      evidence_types += CODE

    IF requirement_text contains "test|validation|verification":
      evidence_types += TESTING

    IF requirement_text contains "log|monitor|audit|track":
      evidence_types += OPERATIONAL

    IF requirement_text contains "process|workflow|governance":
      evidence_types += PROCESS

  SEARCH for evidence:
    FOR each type in evidence_types:

      SEARCH locations:
        IF type = DOCUMENTATION:
          paths = ["docs/", "README*", "*.md"]

        IF type = CODE:
          paths = ["src/", "lib/", "*.py", "*.js", "*.ts"]

        IF type = TESTING:
          paths = ["test/", "tests/", "*_test.*", "*_spec.*"]

        IF type = OPERATIONAL:
          paths = ["logs/", "metrics/", "monitoring/"]

        IF type = PROCESS:
          paths = ["docs/processes/", "runbooks/", "procedures/"]

      FOR each path:
        SCAN for keywords from requirement_text

        FOR each matching file:
          CREATE evidence_artifact:
            evidence_id: EVD-[NNN]
            requirement_id: [R.id]
            artifact_type: [type]
            artifact_path: "[path]"
            created_date: [file.created]
            modified_date: [file.modified]
            verification_status: PENDING

  IF no evidence found:
    CREATE evidence_gap:
      requirement_id: [R.id]
      gap_reason: NO_EVIDENCE_FOUND
      searched_paths: [list]

RECORD collection_summary:
  Total requirements: [N]
  Evidence artifacts: [count]
  Evidence gaps: [count]
```

> **HALT** — Evidence collected.

---

## 4.2 Verify Evidence

**Execute for EACH evidence_artifact:**

```
FOR evidence E:

  VERIFY existence:
    TRY access artifact_path

    IF accessible:
      verification_status = EXISTS
      artifact_hash = SHA256(content)

    IF not_accessible:
      verification_status = MISSING
      ISSUE: "Cannot access"

  VERIFY freshness:
    age_days = current_date - modified_date

    IF age_days <= 90:
      staleness_status = FRESH
      staleness_score = 5

    IF age_days <= 180:
      staleness_status = ACCEPTABLE
      staleness_score = 3

    IF age_days > 180:
      staleness_status = STALE
      staleness_score = 1

  VERIFY quality:
    quality_checks = 0
    total_checks = 5

    CHECK 1: Addresses requirement
    CHECK 2: Contains specifics
    CHECK 3: Current/up-to-date
    CHECK 4: Clear/understandable
    CHECK 5: From authoritative source

    FOR each check:
      IF pass: quality_checks += 1

    quality_score = quality_checks / total_checks

    IF quality_score >= 0.8:
      quality_status = HIGH
    ELIF quality_score >= 0.6:
      quality_status = MEDIUM
    ELIF quality_score >= 0.4:
      quality_status = LOW
    ELSE:
      quality_status = INSUFFICIENT

  UPDATE evidence:
    verification_status: [status]
    artifact_hash: [hash]
    staleness_status: [status]
    staleness_score: [1-5]
    quality_score: [0.0-1.0]
    quality_status: [status]
    verification_date: [date]

RECORD verification_summary:
  Total artifacts: [N]
  Verified exists: [N]
  Missing: [N]
  High quality: [N]
  Stale: [N]
```

> **HALT** — Evidence verified.

---

## 4.3 Assess Coverage

**Execute for EACH requirement:**

```
FOR requirement R:

  GATHER evidence:
    evidence_for_R = WHERE requirement_id = R.id AND verification_status = EXISTS

  COUNT:
    evidence_count = COUNT(evidence_for_R)
    evidence_types = DISTINCT(artifact_type)

  COMPUTE quality:
    IF evidence_count = 0:
      aggregate_quality = 0
    ELSE:
      aggregate_quality = AVG(quality_score FOR evidence_for_R)

  COMPUTE freshness:
    IF evidence_count = 0:
      aggregate_freshness = 0
    ELSE:
      aggregate_freshness = AVG(staleness_score FOR evidence_for_R)

  EVALUATE sufficiency:
    criteria_passed = 0

    IF COUNT(evidence_types) >= 2:
      criteria_passed += 1

    IF evidence_count >= 2:
      criteria_passed += 1

    IF aggregate_quality >= 0.6:
      criteria_passed += 1

    IF aggregate_freshness >= 3.0:
      criteria_passed += 1

    IF criteria_passed = 4:
      evidence_sufficient = YES
      confidence = HIGH

    ELIF criteria_passed = 3:
      evidence_sufficient = MOSTLY
      confidence = MEDIUM

    ELSE:
      evidence_sufficient = NO
      confidence = LOW

  RECORD coverage:
    requirement_id: [R.id]
    evidence_count: [N]
    evidence_types: [list]
    aggregate_quality: [0-1]
    aggregate_freshness: [1-5]
    evidence_sufficient: [YES/MOSTLY/NO]
    confidence: [HIGH/MEDIUM/LOW]

COMPUTE overall:
  requirements_with_evidence = COUNT WHERE evidence_count > 0
  requirements_sufficient = COUNT WHERE evidence_sufficient = YES
  coverage_rate = requirements_with_evidence / total_requirements
  sufficiency_rate = requirements_sufficient / total_requirements
```

> **HALT** — Coverage assessed.

---

## 4.4 Counter-Check

**Execute all 5 checks:**

### Check 1: Missing evidence search

```
FOR requirement WHERE evidence_count = 0:

  EXPAND search:
    SEARCH parent directories
    SEARCH alternative formats
    SEARCH related repositories

  IF evidence_found:
    ADD to inventory
    RE-VERIFY

  IF truly_missing:
    EVALUATE: Was requirement correctly marked COVERED?
    IF no: RECOMMEND downgrade to PARTIAL or GAP
```

### Check 2: Quality validation

```
FOR evidence WHERE quality_status = HIGH:

  CHALLENGE: Is quality truly high?

  RE-EVALUATE:
    READ artifact completely
    VERIFY addresses requirement
    VERIFY specific not generic
    VERIFY current not outdated

  IF fails:
    DOWNGRADE quality_status
    UPDATE quality_score

  IF passes:
    CONFIRM rating
```

### Check 3: Stale evidence review

```
FOR evidence WHERE staleness_status = STALE:

  CHECK current state:
    Has system changed?
    Are there newer versions?
    Do recent tests contradict?

  IF outdated:
    verification_status = INVALID
    REQUIRE updated evidence

  IF still_valid:
    ACCEPT with notation
```

### Check 4: Sufficiency re-evaluation

```
FOR requirement WHERE evidence_sufficient = NO:

  SEARCH more aggressively:
    Implicit evidence
    Indirect evidence
    Operational evidence
    Process evidence

  IF found:
    ADD to inventory
    RE-ASSESS sufficiency

  IF still_insufficient:
    DOCUMENT gaps
    RECOMMEND actions
```

### Check 5: Coverage recalculation

```
RECOMPUTE:
  total_artifacts_CHECK = COUNT(artifacts)
  coverage_rate_CHECK = requirements_with_evidence / total_requirements

COMPARE to reported values

IF discrepancy:
  CORRECT to accurate values
  UPDATE all dependent calculations

IF no discrepancy:
  CONFIRM accuracy
```

RECORD counter_check_results:
  Missing evidence added: [N]
  Quality adjusted: [N]
  Stale invalidated: [N]
  Sufficiency re-evaluated: [N]
  Coverage recalculated: [YES/NO]

> **HALT** — Counter-check complete.

---

## 4.5 Compile Output

**Execute:**

```yaml
evidence_collection_output:
  collection_date: "[date]"
  regulation: [regulation_id]

  scope:
    total_requirements: [N]
    covered_requirements: [N]
    requirements_processed: [N]

  evidence_inventory:
    total_artifacts: [N]
    by_type:
      DOCUMENTATION: [N]
      CODE: [N]
      TESTING: [N]
      OPERATIONAL: [N]
      PROCESS: [N]
    by_status:
      EXISTS: [N]
      MISSING: [N]
    by_quality:
      HIGH: [N]
      MEDIUM: [N]
      LOW: [N]
      INSUFFICIENT: [N]

  coverage_assessment:
    requirements_with_evidence: [N]
    requirements_sufficient: [N]
    coverage_rate: [%]
    sufficiency_rate: [%]

  evidence_gaps:
    - [list requirements with no/insufficient evidence]

  counter_check:
    evidence_added: [N]
    quality_adjusted: [N]
    stale_invalidated: [N]
```

UPDATE process state:
  evidence_collected: true
  total_evidence_artifacts: [N]
  coverage_rate: [%]
  sufficiency_rate: [%]

> **HALT** — Output compiled.

---

## GATE_4: Evidence → Planning

**ENFORCEMENT:** ALL checklist items DONE.

### Checklist

```
[ ] G4.1: Gap analysis loaded from GATE_3
[ ] G4.2: Evidence scope determined
[ ] G4.3: Evidence collected for ALL requirements
[ ] G4.4: ALL evidence verified
[ ] G4.5: Coverage assessed for ALL requirements
[ ] G4.6: Counter-check executed (5 checks)
[ ] G4.7: Coverage rate >= 90%
[ ] G4.8: Sufficiency rate >= 80%
[ ] G4.9: Output compiled
[ ] G4.10: Process state updated
```

### Gate Passage

```
EVALUATE:
  all_processed = (requirements_processed = total_requirements)
  counter_check_executed = TRUE
  coverage_rate >= 0.9
  sufficiency_rate >= 0.8

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - [N] artifacts, [C]% coverage, [S]% sufficiency"
  PROCEED to step-05-plan.md

ELSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED"
  OUTPUT: "Coverage: [%]% (need 90%)"
  OUTPUT: "Sufficiency: [%]% (need 80%)"
  HALT
```

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading data:
  HALT
  OUTPUT: "VIOLATION: Section 4.0 mandatory"
  RETURN to 4.0

IF agent collects for subset only:
  HALT
  OUTPUT: "VIOLATION: Must collect for ALL requirements"
  RETURN to 4.1

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 4.2 mandatory"
  RETURN to 4.2

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 4.4 mandatory"
  RETURN to 4.4

IF coverage below threshold:
  HALT
  OUTPUT: "VIOLATION: Coverage [%]% below 90%"
  RETURN to 4.1
```

---

**END OF STEP 4**

**Next:** IF GATE_4 = OPEN → Load `steps/step-05-plan.md`
