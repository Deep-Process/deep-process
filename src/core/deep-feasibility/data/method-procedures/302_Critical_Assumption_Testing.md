# #302 Critical Assumption Testing

**Phase:** 3 (VALIDATE)
**Tier:** 1 — Mandatory
**Purpose:** Test the assumptions that would kill the project if wrong

## Theoretical Foundation

Every feasibility assessment rests on assumptions. Critical assumptions are those where being wrong would fundamentally change the feasibility verdict. These MUST be tested before commitment.

**Key insight:** An untested critical assumption is a hidden feasibility risk. The cost of testing is almost always less than the cost of discovering you were wrong after commitment.

## What to do

1. Identify all assumptions from previous phases
2. Rate each assumption's criticality
3. Design tests for critical assumptions
4. Execute tests before final decision

## Assumption Criticality Matrix

| Impact if Wrong | Probability of Being Wrong | Criticality |
|-----------------|---------------------------|-------------|
| Project fails | Unknown/High | **CRITICAL** — Must test |
| Major rework | Unknown/High | **HIGH** — Should test |
| Moderate rework | Unknown/High | **MEDIUM** — Consider testing |
| Minor adjustment | Any | **LOW** — Accept |

## Step-by-step

### Step 1: Harvest Assumptions

Collect assumptions from all previous methods:

```
FROM #003 SCOPE:
□ "Users will adopt new workflow"
□ "Data format is stable"

FROM #101 CONSTRAINTS:
□ "Budget is fixed at $500K"
□ "Deadline cannot move"

FROM #102 RESOURCE AVAILABILITY:
□ "Key developer available for 6 months"
□ "Cloud resources can be provisioned in 2 weeks"

FROM #201 TECHNICAL:
□ "Synapse can handle 100M records"
□ "Delta Lake works with our auth model"

FROM #210 DEPENDENCIES:
□ "Mars API will be available by Week 4"
□ "Partner will provide test data"
```

### Step 2: Rate Criticality

For each assumption:

| Assumption | Impact if Wrong | Probability Wrong | Criticality |
|------------|----------------|-------------------|-------------|
| Synapse handles 100M records | Project fails | Unknown | **CRITICAL** |
| Mars API by Week 4 | Major delay | Medium | **HIGH** |
| Budget is $500K | May need re-scope | Low | **MEDIUM** |
| Key dev available | Delay | Low | **LOW** |

### Step 3: Design Tests for Critical Assumptions

For each CRITICAL and HIGH assumption:

```
ASSUMPTION: Synapse can handle 100M records

Test Design:
- Type: Performance spike (#306)
- Duration: 3 days
- Success criteria: Query returns in <30 seconds
- Resources needed: Sample data, Synapse environment
- Owner: Tech Lead
- Deadline: Before Phase 4 decision

Test Result: [To be filled]
Conclusion: [Assumption validated / invalidated / partially validated]
```

### Step 4: Categorize Test Types

| Test Type | When to Use | Duration |
|-----------|-------------|----------|
| **Desk research** | Can find answer in documentation | Hours |
| **Expert consultation** | Need domain expertise | 1-2 days |
| **Proof of concept** | Technical uncertainty | 1-2 weeks |
| **Spike** | Specific integration question | 2-5 days |
| **Prototype** | End-to-end flow validation | 2-4 weeks |
| **Pilot** | User/business validation | 4+ weeks |

### Step 5: Execute Tests

Track test execution:

| Assumption | Test Type | Status | Result | Action |
|------------|-----------|--------|--------|--------|
| Synapse 100M | Spike | Complete | Validated | Proceed |
| Mars API Week 4 | Expert consult | Complete | Partially | Add buffer |
| Auth model | PoC | In progress | — | Wait |

### Step 6: Update Feasibility Based on Results

```
BEFORE TESTING:
Technical Feasibility: 3 (assumption-dependent)
Confidence: L (untested)

AFTER TESTING:
Assumption tested: Synapse performance ✓
Result: Validated at 120M records, 22 second response

Technical Feasibility: 4 (validated)
Confidence: H (tested)
```

### Step 7: Score Assumption Testing Coverage

| Score | Criteria |
|-------|----------|
| 5 | All critical assumptions tested and validated |
| 4 | Most critical tested, results positive |
| 3 | Some critical tested, mixed results |
| 2 | Few critical tested, results concerning |
| 1 | Critical assumptions untested or invalidated |

## Output format

```yaml
critical_assumption_testing:
  score: 4
  confidence: "H"

  assumptions_harvested:
    total: 24
    by_source:
      scope: 4
      constraints: 6
      technical: 8
      dependencies: 6

  criticality_breakdown:
    critical: 3
    high: 5
    medium: 8
    low: 8

  critical_assumptions:
    - id: "CA-001"
      assumption: "Synapse can handle 100M records with <30s query time"
      source: "#201 Technical Feasibility"
      impact_if_wrong: "Project fails — cannot meet reporting requirements"
      test_type: "Performance spike"
      test_design:
        duration: "3 days"
        resources: "Sample data (10M, 50M, 100M), Synapse environment"
        success_criteria: "Query returns in <30 seconds at 100M"
        owner: "Tech Lead"
      test_result:
        status: "Complete"
        outcome: "Validated"
        evidence: "22 second response at 120M records"
        confidence: "H"
      action: "Proceed with current architecture"

    - id: "CA-002"
      assumption: "Mars API will be available with test access by Week 4"
      source: "#210 Dependency Feasibility"
      impact_if_wrong: "4-week delay, integration cannot be tested"
      test_type: "Expert consultation + direct inquiry"
      test_design:
        duration: "2 days"
        resources: "Mars IT contact"
        success_criteria: "Written commitment with date"
        owner: "Project Manager"
      test_result:
        status: "Complete"
        outcome: "Partially validated"
        evidence: "Verbal commitment for Week 5, written pending"
        confidence: "M"
      action: "Add 1-week buffer, escalate for written commitment"

    - id: "CA-003"
      assumption: "Delta Lake integrates with Azure AD managed identity"
      source: "#201 Technical Feasibility"
      impact_if_wrong: "Security model redesign required"
      test_type: "Proof of concept"
      test_design:
        duration: "1 week"
        resources: "Dev environment, security team review"
        success_criteria: "End-to-end auth flow works"
        owner: "Platform Engineer"
      test_result:
        status: "Complete"
        outcome: "Validated"
        evidence: "PoC successful, documented in ADR-007"
        confidence: "H"
      action: "Proceed, use PoC as reference implementation"

  high_assumptions:
    - id: "HA-001"
      assumption: "Team can learn Databricks in 2 weeks"
      test_type: "Training spike"
      status: "In progress"
      preliminary: "On track"

    - id: "HA-002"
      assumption: "Partner data format matches specification"
      test_type: "Sample data validation"
      status: "Pending sample data"

  untested_risks:
    - assumption: "User adoption of new workflow"
      reason: "Cannot test until MVP"
      mitigation: "Plan user feedback loop in Phase 1"

  feasibility_updates:
    - dimension: "Technical"
      before: 3
      after: 4
      reason: "Synapse and auth assumptions validated"
    - dimension: "Dependency"
      before: 3
      after: 3
      reason: "Mars API partially validated, buffer added"

  summary:
    critical_tested: "3 of 3"
    critical_validated: "2 full, 1 partial"
    high_tested: "2 of 5"
    blocking_issues: 0
    conditions_added: 2
```

## Integration Points

- **Feeds from:** All Phase 2 methods (assumptions), #003 Scope
- **Feeds to:** #401 Overall profile, #402 Decision, conditions list

## Common Pitfalls

- **Assumption blindness:** Not recognizing something IS an assumption
- **Testing theater:** Tests that don't actually validate the assumption
- **Premature commitment:** Deciding before critical tests complete
- **Over-testing:** Testing low-impact assumptions while ignoring critical ones
- **Confirmation bias:** Designing tests to confirm rather than challenge
