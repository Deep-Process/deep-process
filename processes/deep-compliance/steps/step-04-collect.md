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
  - "gap analysis from step-03"
  - "requirements mapping from step-02"
outputs:
  - evidence_inventory
  - verification_results
  - coverage_assessment
---

# STEP 4: COLLECT EVIDENCE

## ENFORCEMENT RULES

```
1. Collect evidence for EVERY covered requirement (no sampling).
2. Verify ALL evidence (existence, freshness, quality).
3. Evidence MUST be accessible - no "planned" or "future" evidence.
4. Quality assessment required for each artifact.
5. Counter-check MANDATORY - adversarial evidence review.
6. Coverage threshold: >= 90% of covered requirements with verified evidence.
7. NO proceeding to GATE_4 until all requirements processed.
```

---

## 4.0 Load Required Data

**PRECONDITION:** GATE_3 = OPEN

IF GATE_3 ≠ OPEN → HALT with "ERROR: GATE_3 not open"

**Execute these steps in this order:**

### Step 1: Load gap analysis from GATE_3

```
FROM step-03 output:
  [ ] gap_analysis loaded
  [ ] total_requirements: [N]
  [ ] covered_requirements: [count where status = COVERED]
  [ ] partial_requirements: [count where status = PARTIAL]
  [ ] gap_requirements: [count where status = GAP]
```

### Step 2: Load requirements mapping

```
FROM step-02 output:
  [ ] requirements_mapping loaded
  [ ] system_inventory loaded
  [ ] regulation: [regulation_id]
```

### Step 3: Determine evidence collection scope

```
FILTER requirements:
  evidence_collection_scope = WHERE status = COVERED OR status = PARTIAL

COUNT scope:
  requirements_to_collect = COUNT(evidence_collection_scope)

RECORD:
  [ ] Evidence collection scope: [count] requirements
  [ ] Systems involved: [list system IDs]
```

> **HALT** — Confirm all data loaded before proceeding.

---

## 4.1 Collect Evidence Artifacts

**Execute for EACH requirement in evidence_collection_scope:**

### Step 1: Determine evidence types needed

```
FOR requirement R:
  EXTRACT requirement details:
    requirement_id = R.id
    requirement_text = R.text
    article = R.article
    system_capability = R.capability_match

  IDENTIFY evidence types based on requirement:

    IF requirement relates to "documentation|policy|procedure":
      evidence_types += DOCUMENTATION

    IF requirement relates to "implementation|code|algorithm|system":
      evidence_types += CODE

    IF requirement relates to "testing|validation|verification|quality":
      evidence_types += TESTING

    IF requirement relates to "logging|monitoring|audit|tracking":
      evidence_types += OPERATIONAL

    IF requirement relates to "process|workflow|governance":
      evidence_types += PROCESS

  RECORD needed types:
    Required evidence types for R: [list]
```

### Step 2: Search for evidence artifacts

```
FOR each evidence_type in evidence_types:

  DOCUMENTATION evidence:
    SEARCH locations:
      - docs/ folder
      - README files
      - wiki/confluence pages
      - architecture diagrams
      - design documents
      - policy documents
      - user guides
      - compliance documentation

    MATCH criteria:
      - File contains keywords from requirement_text
      - File describes system capability
      - File explicitly addresses requirement

    FOR each matching file:
      RECORD artifact:
        artifact_type = DOCUMENTATION
        artifact_path = [file path]
        artifact_description = "[brief description]"

  CODE evidence:
    SEARCH locations:
      - src/ folder
      - implementation files matching capability
      - configuration files
      - infrastructure-as-code
      - deployment scripts

    MATCH criteria:
      - Code implements system capability
      - Code addresses requirement
      - Configuration enables compliance

    FOR each matching file:
      RECORD artifact:
        artifact_type = CODE
        artifact_path = [file path]
        artifact_description = "[what it implements]"

  TESTING evidence:
    SEARCH locations:
      - test/ folder
      - unit test files
      - integration test files
      - security test files
      - compliance test files
      - test reports
      - CI/CD results

    MATCH criteria:
      - Tests verify requirement compliance
      - Tests validate system capability
      - Test results show passing status

    FOR each matching file:
      RECORD artifact:
        artifact_type = TESTING
        artifact_path = [file path]
        artifact_description = "[what it tests]"

  OPERATIONAL evidence:
    SEARCH locations:
      - logs/ folder
      - monitoring dashboards
      - audit trail files
      - incident reports
      - metrics/analytics

    MATCH criteria:
      - Logs show compliant behavior
      - Monitoring proves requirement met
      - Audit trail demonstrates control

    FOR each matching file/system:
      RECORD artifact:
        artifact_type = OPERATIONAL
        artifact_path = [path or URL]
        artifact_description = "[what it proves]"

  PROCESS evidence:
    SEARCH locations:
      - Process documentation
      - Workflow definitions
      - Runbooks
      - SOPs (Standard Operating Procedures)
      - Governance documents

    MATCH criteria:
      - Process addresses requirement
      - Workflow ensures compliance
      - Governance establishes control

    FOR each matching document:
      RECORD artifact:
        artifact_type = PROCESS
        artifact_path = [file path]
        artifact_description = "[what process]"
```

### Step 3: Create evidence artifacts

```
FOR each found artifact:
  CREATE evidence record:
```yaml
evidence_artifact:
  evidence_id: EVD-[NNN]
  requirement_id: [R.id]
  article: [R.article]
  system_id: [R.system_id]

  artifact_type: DOCUMENTATION | CODE | TESTING | OPERATIONAL | PROCESS
  artifact_path: "[absolute path or URL]"
  artifact_description: "[brief description of what this proves]"

  file_size_bytes: [if file]
  created_date: [file creation date]
  last_modified_date: [file modification date]

  verification_status: PENDING
  quality_score: null
  staleness_status: null
  issues: []
```

RECORD collection summary:
  Requirement R[N]: [evidence_count] artifacts collected
  Types: [list types found]
```

### Step 4: Handle missing evidence

```
FOR requirement R:
  IF evidence_count = 0:
    LOG WARNING: "No evidence found for requirement R.id"

    CREATE placeholder:
```yaml
evidence_gap:
  requirement_id: [R.id]
  gap_reason: "NO_EVIDENCE_FOUND"
  searched_locations: [list locations searched]
  evidence_types_expected: [list expected types]
  recommendation: "Requirement marked COVERED but no evidence - may need to downgrade to PARTIAL or GAP"
```

    FLAG for counter-check review

  IF evidence_count > 0:
    CONTINUE to verification
```

**ENFORCEMENT:** Collect evidence for ALL requirements in scope. NO partial collection.

> **HALT** — Confirm evidence collected for all requirements.

---

## 4.2 Verify Evidence Artifacts

**Execute for EACH evidence_artifact:**

### Step 1: Verify existence and accessibility

```
FOR evidence E:

  ATTEMPT access:
    IF artifact_type = FILE:
      TRY: Read file at artifact_path

      IF file_exists AND readable:
        verification_status = EXISTS
        COMPUTE: file_hash = SHA256(file content)
        RECORD: artifact_hash = file_hash

      IF file_not_found:
        verification_status = MISSING
        ISSUE: "File not found at specified path"

      IF file_not_readable:
        verification_status = INACCESSIBLE
        ISSUE: "File exists but cannot be read (permissions?)"

    IF artifact_type = URL or DASHBOARD:
      TRY: Access URL

      IF accessible:
        verification_status = EXISTS
        RECORD: access_verified_date = [current date]

      IF not_accessible:
        verification_status = INACCESSIBLE
        ISSUE: "URL not accessible (404, auth, network?)"

  RECORD verification:
    Artifact E.id: verification_status = [status]
```

### Step 2: Verify freshness

```
FOR evidence E WHERE verification_status = EXISTS:

  COMPUTE age:
    freshness_days = current_date - last_modified_date

  CLASSIFY freshness:
    IF freshness_days <= 30:
      staleness_status = VERY_FRESH
      staleness_score = 5

    IF freshness_days <= 90:
      staleness_status = FRESH
      staleness_score = 4

    IF freshness_days <= 180:
      staleness_status = ACCEPTABLE
      staleness_score = 3

    IF freshness_days <= 365:
      staleness_status = AGING
      staleness_score = 2
      WARNING: "Evidence is aging - consider updating"

    IF freshness_days > 365:
      staleness_status = STALE
      staleness_score = 1
      ISSUE: "Evidence is stale (>1 year old)"

  RECORD:
    Artifact E.id:
      freshness_days = [days]
      staleness_status = [status]
      staleness_score = [score]
```

### Step 3: Verify quality

```
FOR evidence E WHERE verification_status = EXISTS:

  ASSESS quality based on artifact_type:

  IF artifact_type = DOCUMENTATION:
    CHECK:
      [ ] Addresses requirement explicitly
      [ ] Contains specific details (not generic)
      [ ] Includes examples or specifics
      [ ] Clearly written and understandable
      [ ] Up-to-date with current system

    COUNT passing_checks
    quality_score = passing_checks / 5

  IF artifact_type = CODE:
    CHECK:
      [ ] Code implements claimed functionality
      [ ] Code is properly commented
      [ ] Code follows project standards
      [ ] Code has associated tests
      [ ] Code is in active use (not deprecated)

    COUNT passing_checks
    quality_score = passing_checks / 5

  IF artifact_type = TESTING:
    CHECK:
      [ ] Tests are comprehensive
      [ ] Tests are passing (green)
      [ ] Test results are recent
      [ ] Tests specifically validate requirement
      [ ] Tests have good coverage

    COUNT passing_checks
    quality_score = passing_checks / 5

  IF artifact_type = OPERATIONAL:
    CHECK:
      [ ] Logs/monitoring show compliant behavior
      [ ] Data is recent (< 30 days)
      [ ] Data is representative (not cherry-picked)
      [ ] Data demonstrates consistent compliance
      [ ] Data source is reliable

    COUNT passing_checks
    quality_score = passing_checks / 5

  IF artifact_type = PROCESS:
    CHECK:
      [ ] Process is documented clearly
      [ ] Process is actively followed
      [ ] Process has evidence of execution
      [ ] Process is approved/official
      [ ] Process is sufficient for requirement

    COUNT passing_checks
    quality_score = passing_checks / 5

  CLASSIFY quality:
    IF quality_score >= 0.8:
      quality_status = HIGH
    IF quality_score >= 0.6:
      quality_status = MEDIUM
    IF quality_score >= 0.4:
      quality_status = LOW
    IF quality_score < 0.4:
      quality_status = INSUFFICIENT
      ISSUE: "Evidence quality too low to support requirement"

  RECORD:
    Artifact E.id:
      quality_score = [0.0-1.0]
      quality_status = [status]
```

### Step 4: Compile verification results

```
FOR each evidence_artifact:
  UPDATE record:
```yaml
evidence_artifact:
  evidence_id: EVD-[NNN]
  requirement_id: [R.id]

  # ... existing fields ...

  # Verification results:
  verification_status: EXISTS | MISSING | INACCESSIBLE
  artifact_hash: "[SHA256 if exists]"

  freshness_days: [N]
  staleness_status: VERY_FRESH | FRESH | ACCEPTABLE | AGING | STALE
  staleness_score: [1-5]

  quality_score: [0.0-1.0]
  quality_status: HIGH | MEDIUM | LOW | INSUFFICIENT

  verification_date: "[current date]"
  issues: ["[issue 1]", "[issue 2]"]
```

COMPUTE verification statistics:
  total_artifacts = COUNT(evidence_artifacts)
  verified_exists = COUNT WHERE verification_status = EXISTS
  verified_missing = COUNT WHERE verification_status = MISSING
  verified_inaccessible = COUNT WHERE verification_status = INACCESSIBLE

  high_quality = COUNT WHERE quality_status = HIGH
  medium_quality = COUNT WHERE quality_status = MEDIUM
  low_quality = COUNT WHERE quality_status = LOW
  insufficient_quality = COUNT WHERE quality_status = INSUFFICIENT

  stale_evidence = COUNT WHERE staleness_status = STALE
```

> **HALT** — Confirm all evidence verified.

---

## 4.3 Assess Evidence Coverage

**Execute for EACH requirement in evidence_collection_scope:**

### Step 1: Aggregate evidence per requirement

```
FOR requirement R:

  GATHER all evidence:
    evidence_for_R = WHERE requirement_id = R.id AND verification_status = EXISTS

  COUNT evidence:
    evidence_count = COUNT(evidence_for_R)
    evidence_types = DISTINCT(artifact_type from evidence_for_R)

  COMPUTE aggregate quality:
    IF evidence_count = 0:
      aggregate_quality = 0.0
    ELSE:
      quality_scores = [E.quality_score for E in evidence_for_R]
      aggregate_quality = AVG(quality_scores)

  COMPUTE aggregate freshness:
    IF evidence_count = 0:
      aggregate_freshness = 0
    ELSE:
      staleness_scores = [E.staleness_score for E in evidence_for_R]
      aggregate_freshness = AVG(staleness_scores)
```

### Step 2: Determine evidence sufficiency

```
FOR requirement R:

  EVALUATE sufficiency:

    CRITERIA 1: Multiple evidence types
      IF COUNT(evidence_types) >= 2:
        criterion_1 = PASS
      ELSE:
        criterion_1 = FAIL
        NOTE: "Only single evidence type - need corroboration"

    CRITERIA 2: Minimum quantity
      IF evidence_count >= 2:
        criterion_2 = PASS
      ELSE:
        criterion_2 = FAIL
        NOTE: "Only single piece of evidence - need multiple sources"

    CRITERIA 3: Quality threshold
      IF aggregate_quality >= 0.6:
        criterion_3 = PASS
      ELSE:
        criterion_3 = FAIL
        NOTE: "Quality below threshold - need better evidence"

    CRITERIA 4: Freshness threshold
      IF aggregate_freshness >= 3.0:
        criterion_4 = PASS
      ELSE:
        criterion_4 = FAIL
        NOTE: "Evidence is stale - need recent evidence"

  DETERMINE sufficiency:
    passing_criteria = COUNT(criterion_* = PASS)

    IF passing_criteria = 4:
      evidence_sufficient = YES
      confidence = HIGH

    IF passing_criteria = 3:
      evidence_sufficient = MOSTLY
      confidence = MEDIUM
      RECOMMEND: "Address failing criterion for full confidence"

    IF passing_criteria <= 2:
      evidence_sufficient = NO
      confidence = LOW
      REQUIRE: "Collect additional evidence to support requirement"
```

### Step 3: Create coverage assessment

```
FOR requirement R:
  RECORD coverage:
```yaml
evidence_coverage:
  requirement_id: [R.id]
  article: [R.article]
  system_id: [R.system_id]

  evidence_count: [N]
  evidence_types: [list of types]
  evidence_ids: [list of evidence IDs]

  aggregate_quality: [0.0-1.0]
  aggregate_freshness: [1-5]

  sufficiency_criteria:
    multiple_types: PASS | FAIL
    minimum_quantity: PASS | FAIL
    quality_threshold: PASS | FAIL
    freshness_threshold: PASS | FAIL

  evidence_sufficient: YES | MOSTLY | NO
  confidence: HIGH | MEDIUM | LOW

  gaps: ["[gap 1 if insufficient]", "[gap 2]"]
  recommendations: ["[recommendation 1]", "[recommendation 2]"]
```

COMPUTE overall coverage:
  total_requirements_in_scope = COUNT(evidence_collection_scope)
  requirements_with_evidence = COUNT WHERE evidence_count > 0
  requirements_sufficient = COUNT WHERE evidence_sufficient = YES
  requirements_mostly_sufficient = COUNT WHERE evidence_sufficient = MOSTLY

  coverage_rate = requirements_with_evidence / total_requirements_in_scope
  sufficiency_rate = requirements_sufficient / total_requirements_in_scope
```

> **HALT** — Confirm coverage assessed for all requirements.

---

## 4.4 Counter-Check

**REQUIREMENT:** Adversarial review of evidence collection.

**Execute these checks:**

### Check 1: Missing Evidence Detection

```
FOR each requirement WHERE evidence_count = 0:

  INVESTIGATE: "Where might evidence exist?"

  EXPAND search:
    - Check parent directories
    - Check documentation in different formats (PDF, Confluence, etc.)
    - Check related systems or repositories
    - Check test results in CI/CD systems
    - Check operational logs and monitoring
    - Ask: "Does implementation exist but just not documented?"

  FOR each additional location searched:
    IF evidence_found:
      ADD: To evidence inventory
      RE-RUN: Verification for new evidence
      UPDATE: Coverage assessment

    IF truly_no_evidence:
      EVALUATE: "Was requirement correctly marked COVERED?"

      IF incorrectly_marked:
        RECOMMEND: Downgrade requirement status to PARTIAL or GAP
        DOCUMENT: Why evidence doesn't exist

      IF correctly_marked_but_undocumented:
        RECOMMEND: Create documentation for existing compliance
        DOCUMENT: What needs to be documented
```

### Check 2: Quality False Positives

```
FOR each evidence WHERE quality_status = HIGH:

  CHALLENGE: "Is this evidence truly high quality?"

  RE-EVALUATE:
    1. Read evidence artifact completely
    2. Verify it actually addresses requirement (not just keyword match)
    3. Check evidence is specific (not generic/boilerplate)
    4. Verify evidence is current (reflects actual system)
    5. Confirm evidence is from authoritative source

  IF any check fails:
    DOWNGRADE: quality_status and quality_score
    UPDATE: Quality justification
    DOCUMENT: Why downgraded

  IF all checks pass:
    CONFIRM: High quality rating justified
```

### Check 3: Stale Evidence Review

```
FOR each evidence WHERE staleness_status = STALE OR AGING:

  INVESTIGATE: "Is this evidence still valid?"

  CHECK current state:
    - Has the system changed since evidence was created?
    - Are there newer versions of documentation?
    - Do recent logs/tests contradict old evidence?
    - Is the evidence technically outdated?

  IF evidence_outdated:
    MARK: verification_status = INVALID
    ISSUE: "Evidence no longer reflects current state"
    REQUIRE: Updated evidence
    DOWNGRADE: requirement status if no other evidence

  IF evidence_still_valid:
    ACCEPT: With staleness notation
    RECOMMEND: Update evidence when convenient
```

### Check 4: Sufficiency False Negatives

```
FOR each requirement WHERE evidence_sufficient = NO:

  SEARCH more aggressively:
    - Implicit evidence (code that implements but isn't documented)
    - Indirect evidence (tests that prove but don't explicitly state)
    - Operational evidence (system behavior that demonstrates)
    - Process evidence (workflows that ensure compliance)

  FOR each new evidence found:
    ADD: To inventory
    RE-VERIFY: Evidence
    RE-ASSESS: Sufficiency

  IF still_insufficient:
    DOCUMENT: Specific evidence gaps
    RECOMMEND: What evidence to create/collect

  IF now_sufficient:
    UPDATE: Coverage assessment to YES or MOSTLY
```

### Check 5: Coverage Calculation Validation

```
RECOMPUTE all metrics:

  total_artifacts_CHECK = COUNT(evidence_artifacts)
  verified_exists_CHECK = COUNT WHERE verification_status = EXISTS
  coverage_rate_CHECK = requirements_with_evidence / total_requirements_in_scope
  sufficiency_rate_CHECK = requirements_sufficient / total_requirements_in_scope

COMPARE against reported values:

  IF discrepancy found:
    LOG ERROR: "Metrics calculation error detected"
    CORRECT: Metrics to accurate values
    UPDATE: All dependent calculations

  IF no discrepancy:
    CONFIRM: Metrics accurate
```

### Report Counter-Check Results

```
Counter-Check Execution Report:
  Missing evidence found and added: [count]
  Quality ratings adjusted: [count]
  Stale evidence invalidated: [count]
  Sufficiency re-evaluations: [count]
  Coverage recalculated: [YES/NO]

  Final metrics:
    Total evidence artifacts: [count]
    Verified evidence: [count]
    Coverage rate: [percentage]%
    Sufficiency rate: [percentage]%
```

> **HALT** — Confirm counter-check complete.

---

## 4.5 Compile Evidence Collection Output

**Execute:**

### Step 1: Aggregate all evidence data

```yaml
evidence_collection_output:
  regulation: [regulation_id]
  collection_date: "[current date]"

  scope:
    total_requirements: [N]
    covered_requirements: [count]
    requirements_processed: [count]

  evidence_inventory:
    total_artifacts: [count]
    by_type:
      DOCUMENTATION: [count]
      CODE: [count]
      TESTING: [count]
      OPERATIONAL: [count]
      PROCESS: [count]

    by_status:
      EXISTS: [count]
      MISSING: [count]
      INACCESSIBLE: [count]

    by_quality:
      HIGH: [count]
      MEDIUM: [count]
      LOW: [count]
      INSUFFICIENT: [count]

    by_freshness:
      VERY_FRESH: [count]
      FRESH: [count]
      ACCEPTABLE: [count]
      AGING: [count]
      STALE: [count]

  coverage_assessment:
    requirements_with_evidence: [count]
    requirements_sufficient: [count]
    requirements_mostly_sufficient: [count]
    requirements_insufficient: [count]

    coverage_rate: [percentage]%
    sufficiency_rate: [percentage]%

  evidence_gaps:
    - [list requirements with no or insufficient evidence]

  recommendations:
    - [list key recommendations for evidence improvement]

  artifacts:
    - [full list of all evidence_artifact records]

  coverage_details:
    - [full list of all evidence_coverage records]
```

### Step 2: Update frontmatter

```yaml
# Add to process state:
evidence_collected: true
total_evidence_artifacts: [count]
coverage_rate: [percentage]
sufficiency_rate: [percentage]
evidence_gaps_identified: [count]
```

---

## GATE_4: Evidence Collection → Remediation Planning

**ENFORCEMENT:** ALL checklist items MUST be DONE before proceeding.

### Gate Checklist

```
[ ] G4.1: Gap analysis and requirements mapping loaded from GATE_3
[ ] G4.2: Evidence collection scope determined
[ ] G4.3: Evidence collected for ALL requirements in scope
[ ] G4.4: Evidence types identified for each requirement
[ ] G4.5: ALL evidence artifacts verified (existence, freshness, quality)
[ ] G4.6: Coverage assessed for every requirement
[ ] G4.7: Sufficiency determined for every requirement
[ ] G4.8: Counter-check executed (all 5 checks)
[ ] G4.9: Coverage rate >= 90% (verified evidence for covered requirements)
[ ] G4.10: evidence_collection_output compiled
```

### Coverage Threshold Evaluation

```
COMPUTE final coverage:
  coverage_rate = requirements_with_evidence / total_requirements_in_scope
  sufficiency_rate = requirements_sufficient / total_requirements_in_scope

EVALUATE thresholds:
  IF coverage_rate >= 0.9 AND sufficiency_rate >= 0.8:
    coverage_acceptable = TRUE

  IF coverage_rate < 0.9:
    coverage_acceptable = FALSE
    missing_count = (total_requirements_in_scope * 0.9) - requirements_with_evidence
    LOG WARNING: "Coverage [coverage_rate]% below 90% threshold"
    LOG: "Need evidence for [missing_count] more requirements"

  IF sufficiency_rate < 0.8:
    coverage_acceptable = FALSE
    insufficient_count = (total_requirements_in_scope * 0.8) - requirements_sufficient
    LOG WARNING: "Sufficiency [sufficiency_rate]% below 80% threshold"
    LOG: "Need to improve evidence for [insufficient_count] requirements"
```

### Gate Passage

```
EVALUATE:
  all_requirements_processed = (requirements_processed = total_requirements_in_scope)
  counter_check_executed = TRUE
  coverage_rate >= 0.9
  sufficiency_rate >= 0.8

IF all TRUE:
  GATE_4 = OPEN
  OUTPUT: "GATE_4 OPEN - [N] requirements, [E] evidence artifacts, [C]% coverage, [S]% sufficiency"
  PROCEED to step-05-plan.md

ELSE:
  GATE_4 = CLOSED
  OUTPUT: "GATE_4 CLOSED"
  OUTPUT: "Reason: [which condition failed]"
  OUTPUT: "Requirements processed: [count]/[total]"
  OUTPUT: "Coverage: [percentage]% (threshold: 90%)"
  OUTPUT: "Sufficiency: [percentage]% (threshold: 80%)"
  HALT
```

**ENFORCEMENT:** Do NOT proceed to step 5 until GATE_4 = OPEN.

---

## VIOLATION RECOVERY

```
IF agent proceeds without loading gap analysis:
  HALT
  OUTPUT: "VIOLATION: Section 4.0 Load Required Data mandatory"
  RETURN to section 4.0

IF agent collects evidence for only subset of requirements:
  HALT
  OUTPUT: "VIOLATION: Evidence must be collected for ALL requirements in scope"
  OUTPUT: "Processed [N] of [M] requirements"
  RETURN to section 4.1

IF agent skips verification:
  HALT
  OUTPUT: "VIOLATION: Section 4.2 Verify Evidence Artifacts is MANDATORY"
  RETURN to section 4.2

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 4.4 Counter-Check is MANDATORY"
  RETURN to section 4.4

IF agent proceeds with coverage < threshold:
  HALT
  OUTPUT: "VIOLATION: Coverage [X]% below threshold 90%"
  OUTPUT: "GATE_4 cannot open"
  RETURN to section 4.1 to collect additional evidence
```

---

**END OF STEP 4**

**Next action:** IF GATE_4 = OPEN → Load `steps/step-05-plan.md`
