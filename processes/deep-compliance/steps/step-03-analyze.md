---
step: 3
name: "Gap Analysis"
time_estimate: "45-120 minutes"
goal: "Identify compliance gaps, classify by severity, estimate remediation effort"
requires_completion: [2]
next_steps:
  DEFAULT: "steps/step-04-collect.md"
gate: "GATE_3"
data_dependencies:
  - "data/severity-classification.yaml"
outputs:
  - gap_analysis
  - compliance_assessment
  - gap_priorities
  - remediation_estimates
---

# STEP 3: ANALYZE GAPS

## ENFORCEMENT RULES

```
1. LOAD requirements mapping from GATE_2 BEFORE analysis.
2. Assess EVERY requirement (MANDATORY and CONDITIONAL).
3. Search for evidence BEFORE declaring gap.
4. Classify severity using impact + urgency + detectability.
5. Counter-check ALL CRITICAL gaps (eliminate false positives).
6. NO skipping assessments.
7. NO assumptions about evidence - search documentation, code, tests.
```

---

## 3.0 Load Required Data

**PRECONDITION:** GATE_2 = OPEN

IF GATE_2 ≠ OPEN → HALT with "ERROR: GATE_2 not open"

**Execute these steps in this order:**

### Step 1: Load requirements mapping from GATE_2

```
FROM step-02 output:
  [ ] requirements_mapping loaded
  [ ] total_systems: [N]
  [ ] total_requirements: [R]
  [ ] mandatory_requirements: [M]
  [ ] conditional_requirements: [C]
  [ ] regulation: [regulation_id]
```

### Step 2: Load severity classification rules

```
Read `data/severity-classification.yaml`

IF file not exists:
  CREATE default classification rules:
```yaml
severity_rules:
  impact_by_article:
    "Article 9": CRITICAL   # Risk Management
    "Article 14": CRITICAL  # Human Oversight
    "Article 10": HIGH      # Data Governance
    "Article 13": HIGH      # Transparency
    "Article 11": MEDIUM    # Documentation
    "Article 12": MEDIUM    # Record-Keeping
    "Article 15": MEDIUM    # Accuracy/Robustness
    default: LOW

  urgency_by_deadline:
    - days: 90
      level: CRITICAL
    - days: 180
      level: HIGH
    - days: 365
      level: MEDIUM
    - days: 999999
      level: LOW

  detectability_rules:
    - pattern: "logging|record|audit|trail"
      level: HIGH
    - pattern: "documentation|technical|spec"
      level: MEDIUM
    - pattern: "oversight|intervention|review"
      level: LOW
    default: MEDIUM

  effort_by_type:
    CRITICAL: 40    # 1 week
    HIGH: 20        # 0.5 week
    MEDIUM: 8       # 1 day
    LOW: 4          # 0.5 day
```

Loaded:
  [ ] severity_rules loaded
  [ ] impact_by_article: [count] rules
  [ ] urgency_by_deadline: [count] rules
  [ ] effort_by_type: [count] rules
```

### Step 3: Load system state from inventory

```
FROM step-01 output:
  [ ] system_inventory loaded
  [ ] documentation_paths: [list]
  [ ] code_paths: [list]
  [ ] test_paths: [list]
  [ ] process_documentation: [list]
```

> **HALT** — Confirm all data loaded before proceeding.

---

## 3.1 Assess Compliance for Each Requirement

**Execute for EACH requirement from requirements_mapping WHERE applicability = MANDATORY OR CONDITIONAL:**

### Step 1: Extract requirement details

```
FOR requirement R[N]:
  EXTRACT:
    requirement_id = R.requirement_id
    system_id = R.system_id
    article = R.article
    requirement_text = R.text
    applicability = R.applicability
    capability_match = R.system_capability_match
    confidence = R.confidence
```

### Step 2: Search for evidence

```
SEARCH for evidence in:
  1. Documentation
  2. Code implementation
  3. Tests
  4. Processes/procedures

Evidence search procedure:

1. DOCUMENTATION EVIDENCE:
   FOR each doc in documentation_paths:
     SCAN for keywords from requirement_text
     SCAN for article reference (e.g., "Article 9")

     IF found AND describes implementation:
       documentation_evidence = YES
       evidence_location = [file:line]
     ELIF found BUT incomplete:
       documentation_evidence = PARTIAL
       gap_description = "Documentation incomplete: [what's missing]"
     ELSE:
       documentation_evidence = NO

2. CODE IMPLEMENTATION EVIDENCE:
   FOR each code_file in code_paths:
     SCAN for implementation patterns:
       - Risk management → "risk" + "assessment|mitigation|control"
       - Data governance → "data" + "quality|validation|lineage"
       - Logging → "log" + "event|decision|audit"
       - Transparency → "explain|description|documentation"
       - Human oversight → "override|review|intervention"
       - Accuracy → "metrics|performance|testing"

     IF implementation_found AND complete:
       code_evidence = YES
       evidence_location = [file:line]
     ELIF implementation_found BUT partial:
       code_evidence = PARTIAL
       gap_description = "Implementation partial: [what's missing]"
     ELSE:
       code_evidence = NO

3. TESTING EVIDENCE:
   FOR each test_file in test_paths:
     SCAN for test coverage:
       - Tests verify requirement?
       - Tests check compliance?
       - Tests validate controls?

     IF tests_exist AND adequate:
       test_evidence = YES
       evidence_location = [file:line]
     ELIF tests_exist BUT inadequate:
       test_evidence = PARTIAL
       gap_description = "Testing incomplete: [what's missing]"
     ELSE:
       test_evidence = NO

4. PROCESS EVIDENCE:
   FOR each process_doc in process_documentation:
     SCAN for procedures:
       - Process defined?
       - Responsibilities assigned?
       - Controls documented?

     IF process_exists AND operational:
       process_evidence = YES
       evidence_location = [file]
     ELIF process_exists BUT not operational:
       process_evidence = PARTIAL
       gap_description = "Process not operational: [issue]"
     ELSE:
       process_evidence = NO

COMPILE evidence summary:
```yaml
evidence:
  documentation: [YES|PARTIAL|NO]
  code_implementation: [YES|PARTIAL|NO]
  testing: [YES|PARTIAL|NO]
  processes: [YES|PARTIAL|NO]
  evidence_locations: [list of file:line references]
```

### Step 3: Determine compliance status

```
EVALUATE evidence:

IF ALL evidence types = YES:
  status = COVERED
  gap_exists = false

ELIF ANY evidence type = YES AND ANY = PARTIAL:
  status = PARTIAL
  gap_exists = true
  gap_type = [which evidence type is partial/missing]

ELIF ALL evidence types = NO:
  status = GAP
  gap_exists = true
  gap_type = "COMPLETE"

RECORD assessment:
```yaml
compliance_assessment:
  requirement_id: [R.requirement_id]
  system_id: [R.system_id]
  article: [R.article]
  status: [COVERED|PARTIAL|GAP]
  gap_exists: [true|false]
  gap_type: [DOCUMENTATION|IMPLEMENTATION|TESTING|PROCESS|COMPLETE]
  evidence: [evidence summary from above]
  gap_description: "[what's missing if GAP or PARTIAL]"
```

**ENFORCEMENT:** Assess ALL requirements. NO skipping.

> **HALT** — Confirm all requirements assessed before proceeding.

---

## 3.2 Classify Gap Severity

**Execute for EACH assessment WHERE gap_exists = true:**

### Step 1: Compute impact score

```
FOR gap G[N]:

  LOOKUP article in severity_rules.impact_by_article:
    IF article found:
      impact_level = severity_rules.impact_by_article[article]
    ELSE:
      impact_level = severity_rules.impact_by_article.default

  CONVERT to numeric:
    CRITICAL = 10
    HIGH = 7
    MEDIUM = 4
    LOW = 1

  impact_score = numeric value
```

### Step 2: Compute urgency score

```
CALCULATE days to deadline:
  deadline_date = [from input or default to 2026-08-01 for EU AI Act]
  current_date = [today]
  days_remaining = deadline_date - current_date

LOOKUP urgency in severity_rules.urgency_by_deadline:
  FOR rule in urgency_by_deadline (sorted by days ascending):
    IF days_remaining <= rule.days:
      urgency_level = rule.level
      BREAK

  CONVERT to numeric:
    CRITICAL = 10
    HIGH = 7
    MEDIUM = 4
    LOW = 1

  urgency_score = numeric value
```

### Step 3: Compute detectability score

```
SCAN requirement_text for detectability patterns:
  detectability_level = MEDIUM  # default

  FOR pattern in severity_rules.detectability_rules:
    IF pattern.pattern matches requirement_text (case-insensitive):
      detectability_level = pattern.level
      BREAK

  CONVERT to numeric:
    HIGH = 3    # Easily auditable → higher risk if missing
    MEDIUM = 2  # Moderate inspection needed
    LOW = 1     # Hard to verify

  detectability_score = numeric value
```

### Step 4: Compute final severity

```
CALCULATE composite score:
  severity_score = MAX(impact_score, urgency_score) + detectability_score

CLASSIFY severity:
  IF severity_score >= 12:
    severity = CRITICAL
  ELIF severity_score >= 9:
    severity = HIGH
  ELIF severity_score >= 6:
    severity = MEDIUM
  ELSE:
    severity = LOW

RECORD gap classification:
```yaml
gap:
  gap_id: "GAP-[system_id]-[N]"
  requirement_id: [R.requirement_id]
  system_id: [R.system_id]
  article: [R.article]
  requirement_text: [R.text]
  severity: [CRITICAL|HIGH|MEDIUM|LOW]
  impact_level: [CRITICAL|HIGH|MEDIUM|LOW]
  urgency_level: [CRITICAL|HIGH|MEDIUM|LOW]
  detectability_level: [HIGH|MEDIUM|LOW]
  gap_type: [DOCUMENTATION|IMPLEMENTATION|TESTING|PROCESS|COMPLETE]
  gap_description: "[what's missing]"
  evidence: [evidence summary]
```

> **HALT** — Confirm all gaps classified before proceeding.

---

## 3.3 Estimate Remediation Effort

**Execute for EACH gap:**

### Step 1: Determine base effort

```
FOR gap G[N]:

  LOOKUP base_effort in severity_rules.effort_by_type:
    base_hours = effort_by_type[G.severity]

  # CRITICAL = 40h, HIGH = 20h, MEDIUM = 8h, LOW = 4h
```

### Step 2: Apply complexity multipliers

```
ADJUST for gap type:
  IF gap_type = COMPLETE:
    multiplier = 2.0    # Full implementation needed
  ELIF gap_type = IMPLEMENTATION:
    multiplier = 1.5    # Code changes needed
  ELIF gap_type = DOCUMENTATION:
    multiplier = 0.5    # Just documentation
  ELIF gap_type = TESTING:
    multiplier = 1.0    # Test creation
  ELIF gap_type = PROCESS:
    multiplier = 1.2    # Process setup

ADJUST for requirement complexity:
  IF requirement_text contains "system" OR "framework":
    multiplier *= 1.5   # More complex, multiple components

CALCULATE final effort:
  remediation_hours = ROUND(base_hours * multiplier)

RECORD estimate:
```yaml
remediation_estimate:
  gap_id: [G.gap_id]
  base_effort_hours: [base_hours]
  complexity_multiplier: [multiplier]
  remediation_effort_hours: [remediation_hours]
  estimated_weeks: [remediation_hours / 40]
```

> **HALT** — Confirm all efforts estimated before proceeding.

---

## 3.4 Prioritize Gaps

**Execute:**

### Step 1: Sort gaps by priority

```
SORT all gaps BY:
  1. severity DESC (CRITICAL first)
  2. urgency_level DESC
  3. remediation_effort_hours ASC (quick wins first within same severity)
```

### Step 2: Assign priority tiers

```
CREATE tiers:

Tier 1 (IMMEDIATE):
  SELECT gaps WHERE:
    severity = CRITICAL OR
    urgency_level = CRITICAL OR
    days_to_deadline <= 90

  Action: Must fix BEFORE any deployment or audit

Tier 2 (URGENT):
  SELECT gaps WHERE:
    severity = HIGH OR
    urgency_level = HIGH OR
    days_to_deadline <= 180

  Action: Fix within 4 weeks

Tier 3 (SCHEDULED):
  SELECT gaps WHERE:
    severity = MEDIUM OR
    urgency_level = MEDIUM OR
    days_to_deadline <= 365

  Action: Plan for next 12 weeks

Tier 4 (BACKLOG):
  SELECT gaps WHERE:
    severity = LOW AND
    urgency_level = LOW AND
    days_to_deadline > 365

  Action: Address when capacity allows

COMPUTE totals for each tier:
  FOR tier in [1, 2, 3, 4]:
    tier_count = COUNT(gaps in tier)
    tier_effort = SUM(remediation_effort_hours in tier)
    tier_earliest_deadline = MIN(deadline_date in tier)

RECORD priorities:
```yaml
gap_priorities:
  tier_1_immediate:
    count: [N1]
    total_effort_hours: [E1]
    earliest_deadline: [date]
    gaps: [list of gap_ids]

  tier_2_urgent:
    count: [N2]
    total_effort_hours: [E2]
    earliest_deadline: [date]
    gaps: [list of gap_ids]

  tier_3_scheduled:
    count: [N3]
    total_effort_hours: [E3]
    gaps: [list of gap_ids]

  tier_4_backlog:
    count: [N4]
    total_effort_hours: [E4]
    gaps: [list of gap_ids]
```

> **HALT** — Confirm prioritization complete.

---

## 3.5 Counter-Check

**REQUIREMENT:** Adversarial review to eliminate false gaps and find missed gaps.

**Execute these checks:**

### Check 1: False Gap Elimination

```
FOR each gap WHERE severity = CRITICAL OR HIGH:
  CHALLENGE: "Is this TRULY a gap or did we miss evidence?"

  RE-SEARCH for evidence:
    - Alternative documentation locations
    - Implicit implementations (code that works but isn't documented)
    - Equivalent controls (different approach, same outcome)
    - Industry-standard practices (common patterns)

  IF evidence found:
    UPDATE: status = COVERED or PARTIAL
    REMOVE: gap from gap list
    DOCUMENT: Why initially missed

  IF no evidence found after deep search:
    CONFIRM: Gap is real
    KEEP: In gap list

  LOG: "Gap [gap_id] reviewed: [CONFIRMED|ELIMINATED]"
```

### Check 2: Missed Gap Detection

```
FOR each assessment WHERE status = COVERED:
  CHALLENGE: "Is this TRULY covered or superficially?"

  VERIFY evidence quality:
    IF documentation_evidence = YES:
      CHECK: Documentation is current (not outdated)
      CHECK: Documentation is specific (not generic boilerplate)

    IF code_evidence = YES:
      CHECK: Code actually runs (not commented out)
      CHECK: Code is complete (not TODO/stub)

    IF test_evidence = YES:
      CHECK: Tests pass (not failing)
      CHECK: Tests are meaningful (not trivial)

    IF process_evidence = YES:
      CHECK: Process is operational (not just documented)
      CHECK: Process is followed (evidence of execution)

  IF evidence quality LOW:
    DOWNGRADE: status = PARTIAL or GAP
    CREATE: New gap
    DOCUMENT: Why initially over-rated

  IF evidence quality adequate:
    CONFIRM: Covered status
    KEEP: As covered

  LOG: "Assessment [requirement_id] reviewed: [CONFIRMED|DOWNGRADED]"
```

### Check 3: Severity Validation

```
FOR each gap WHERE severity = CRITICAL:
  CHALLENGE: "Is CRITICAL severity justified?"

  RE-EVALUATE:
    CHECK: Impact truly CRITICAL? (deployment blocker, fine risk, safety)
    CHECK: Urgency truly CRITICAL? (deadline < 90 days)
    CHECK: Detectability accurate?

  IF severity over-rated:
    DOWNGRADE: severity to HIGH or MEDIUM
    RECALCULATE: priority tier
    DOCUMENT: Adjustment reason

  IF severity under-rated (for other gaps):
    UPGRADE: severity
    RECALCULATE: priority tier
    DOCUMENT: Adjustment reason

  IF severity accurate:
    CONFIRM: Severity classification

  LOG: "Severity [gap_id] reviewed: [CONFIRMED|ADJUSTED]"
```

### Check 4: Effort Estimate Validation

```
FOR each gap:
  CHALLENGE: "Is effort estimate realistic?"

  COMPARE against:
    - Similar implementations in codebase
    - Industry benchmarks
    - Complexity of requirement

  IF underestimated (too optimistic):
    INCREASE: remediation_effort_hours
    UPDATE: tier totals
    DOCUMENT: Adjustment reason

  IF overestimated (too pessimistic):
    DECREASE: remediation_effort_hours
    UPDATE: tier totals
    DOCUMENT: Adjustment reason

  IF realistic:
    CONFIRM: Effort estimate

  LOG: "Effort [gap_id] reviewed: [CONFIRMED|ADJUSTED]"
```

### Report Counter-Check Results

```
Counter-Check Execution Report:
  False gaps eliminated: [count]
  Missed gaps detected: [count]
  Severity adjustments: [count upgrades, count downgrades]
  Effort adjustments: [count increases, count decreases]

  Final gap counts:
    CRITICAL: [count]
    HIGH: [count]
    MEDIUM: [count]
    LOW: [count]

  Final effort totals:
    Tier 1: [hours]
    Tier 2: [hours]
    Tier 3: [hours]
    Tier 4: [hours]
```

> **HALT** — Confirm counter-check complete.

---

## 3.6 Compile Gap Analysis Output

**Execute:**

### Step 1: Aggregate results

```yaml
gap_analysis:
  regulation: [regulation_id]
  total_systems: [count]
  total_requirements: [count]

  compliance_summary:
    covered_requirements: [count]
    partial_requirements: [count]
    gap_requirements: [count]
    compliance_percentage: [(covered / total) * 100]

  gap_summary:
    total_gaps: [count]
    critical_gaps: [count]
    high_gaps: [count]
    medium_gaps: [count]
    low_gaps: [count]

  remediation_summary:
    total_effort_hours: [sum all gaps]
    estimated_weeks: [total_effort_hours / 40]
    tier_1_effort_hours: [Tier 1 sum]
    tier_2_effort_hours: [Tier 2 sum]

  gaps: [array of all gap objects]

  priorities: [gap_priorities from 3.4]
```

### Step 2: Update process state

```yaml
# Add to frontmatter:
gaps_analyzed: true
total_gaps: [count]
critical_gaps: [count]
compliance_percentage: [percentage]
```

---

## GATE_3: Gap Analysis → Evidence Collection

**ENFORCEMENT:** ALL checklist items MUST be DONE before proceeding.

### Gate Checklist

```
[ ] G3.1: Requirements mapping loaded from GATE_2
[ ] G3.2: Severity classification rules loaded
[ ] G3.3: ALL requirements assessed (no skipped)
[ ] G3.4: Evidence searched for EVERY requirement
[ ] G3.5: Gaps classified by severity
[ ] G3.6: Remediation effort estimated for ALL gaps
[ ] G3.7: Gaps prioritized into 4 tiers
[ ] G3.8: Counter-check executed (all 4 checks)
[ ] G3.9: False gaps eliminated
[ ] G3.10: Gap analysis output compiled
```

### Gate Passage

```
EVALUATE:
  all_requirements_assessed = TRUE
  gaps_classified = TRUE
  severity_assigned = TRUE
  counter_check_executed = TRUE

COUNT:
  total_gaps = [count]
  critical_gaps = [count where severity = CRITICAL]
  compliance_percentage = (covered / total) * 100

IF all_requirements_assessed AND counter_check_executed:
  GATE_3 = OPEN
  OUTPUT: "GATE_3 OPEN - [G] gaps found, [C] critical, [P]% compliant"
  PROCEED to step-04-collect.md

ELSE:
  GATE_3 = CLOSED
  OUTPUT: "GATE_3 CLOSED"
  OUTPUT: "Reason: [which condition failed]"
  HALT
```

**ENFORCEMENT:** Do NOT proceed to step 4 until GATE_3 = OPEN.

---

## VIOLATION RECOVERY

```
IF agent skips loading requirements mapping:
  HALT
  OUTPUT: "VIOLATION: Section 3.0 Load Required Data mandatory"
  RETURN to section 3.0

IF agent assesses only subset of requirements:
  HALT
  OUTPUT: "VIOLATION: ALL requirements must be assessed"
  OUTPUT: "Found [total] requirements, only [assessed] assessed"
  RETURN to section 3.1

IF agent skips evidence search:
  HALT
  OUTPUT: "VIOLATION: Evidence search mandatory (section 3.1 step 2)"
  RETURN to section 3.1

IF agent skips gap classification:
  HALT
  OUTPUT: "VIOLATION: Section 3.2 Classify Gap Severity mandatory"
  RETURN to section 3.2

IF agent skips counter-check:
  HALT
  OUTPUT: "VIOLATION: Section 3.5 Counter-Check is MANDATORY"
  RETURN to section 3.5

IF agent declares gaps without evidence search:
  HALT
  OUTPUT: "VIOLATION: Must search for evidence BEFORE declaring gap"
  RETURN to section 3.1 step 2
```

---

**END OF STEP 3**

**Next action:** IF GATE_3 = OPEN → Load `steps/step-04-collect.md`
