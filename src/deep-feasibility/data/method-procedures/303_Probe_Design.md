# #303 Probe Design

**Phase:** 3 (VALIDATE)
**Tier:** 2 — Recommended
**Purpose:** Design minimal experiments to test feasibility assumptions

## Theoretical Foundation

A probe is a minimal, focused experiment designed to answer a specific feasibility question with minimal investment. Good probe design maximizes information gained per unit of effort.

**Key insight:** The goal is learning, not building. A probe that fails fast is more valuable than one that succeeds slowly.

## Probe Design Principles

| Principle | Description |
|-----------|-------------|
| **Minimal** | Smallest possible investment to answer the question |
| **Focused** | One question per probe |
| **Time-boxed** | Hard deadline, even if incomplete |
| **Falsifiable** | Clear criteria for success/failure |
| **Disposable** | Code/artifacts can be thrown away |

## Step-by-step

### Step 1: Identify Probe Candidates

From critical assumptions, identify those requiring empirical testing:

```
Questions that need probes:
□ Can Synapse handle our query patterns at scale?
□ Does the Delta Lake → Synapse integration work?
□ Can we parse Mars data format correctly?
□ Will the transformation logic handle edge cases?

Questions that DON'T need probes:
□ Is Azure available in our region? (documentation)
□ Does the team have Python skills? (interview)
□ What's the SLA? (contract review)
```

### Step 2: Design Each Probe

For each probe candidate:

```
PROBE: Synapse Query Performance

Question: Can Synapse handle 100M records with <30s query response?

Minimal Design:
- Generate synthetic data matching production schema
- Load 10M, 50M, 100M records
- Run 5 representative queries
- Measure response times

NOT in scope:
- Production-quality code
- Full data pipeline
- Security implementation
- Documentation

Time box: 3 days
Resources: 1 engineer, Synapse dev environment

Success criteria:
- P95 query time < 30 seconds at 100M records
- No timeout errors
- Linear or sub-linear scaling

Failure criteria:
- Query time > 60 seconds at any scale
- Timeout errors at scale
- Super-linear scaling pattern
```

### Step 3: Probe Types

| Type | Duration | Purpose | Example |
|------|----------|---------|---------|
| **Spike** | 1-3 days | Answer specific technical question | "Can X integrate with Y?" |
| **Vertical slice** | 3-5 days | Prove end-to-end flow works | "Can data flow from A to B to C?" |
| **Performance probe** | 2-5 days | Validate scale assumptions | "Does it work at 100× scale?" |
| **Integration probe** | 3-5 days | Test component interfaces | "Do A and B actually connect?" |
| **User probe** | 1-2 weeks | Validate user assumptions | "Will users accept this workflow?" |

### Step 4: Information Gain Matrix

Prioritize probes by information gain:

| Probe | Uncertainty Before | Effort | Information Gain | Priority |
|-------|-------------------|--------|------------------|----------|
| Synapse perf | High | 3 days | High | **1** |
| Delta integration | High | 5 days | High | **2** |
| Mars parsing | Medium | 2 days | Medium | **3** |
| Edge cases | Medium | 3 days | Low | **4** |

```
Priority formula: Information Gain / Effort
Higher uncertainty + lower effort = higher priority
```

### Step 5: Execute and Document

Track probe execution:

```
PROBE EXECUTION LOG

Probe: Synapse Query Performance
Start: 2024-01-15
End: 2024-01-17

Day 1:
- Set up Synapse workspace
- Generated 10M synthetic records
- Initial queries: 3-5 seconds ✓

Day 2:
- Scaled to 50M records
- Queries: 12-18 seconds ✓
- No issues observed

Day 3:
- Scaled to 100M records
- Queries: 22-28 seconds ✓
- Tested concurrent queries: slight degradation
- Documented findings

Result: SUCCESS
Confidence: HIGH
Evidence: [Link to test results]

Learnings:
- Synapse handles scale well
- Concurrent queries need monitoring
- Recommend connection pooling
```

### Step 6: Interpret Results

| Result | Meaning | Action |
|--------|---------|--------|
| **Clear success** | Assumption validated | Proceed with confidence |
| **Clear failure** | Assumption invalidated | Redesign or de-scope |
| **Partial success** | Works with conditions | Add conditions to feasibility |
| **Inconclusive** | Need more data | Extend probe or redesign |

### Step 7: Score Probe Effectiveness

| Score | Criteria |
|-------|----------|
| 5 | All probes answered questions decisively |
| 4 | Most probes successful, minor ambiguity |
| 3 | Mixed results, some questions unanswered |
| 2 | Many probes inconclusive |
| 1 | Probes failed to reduce uncertainty |

## Output format

```yaml
probe_design:
  score: 4
  confidence: "H"

  probes_designed: 4
  probes_executed: 3
  probes_pending: 1

  probes:
    - id: "PROBE-001"
      name: "Synapse Query Performance"
      question: "Can Synapse handle 100M records with <30s response?"
      type: "Performance probe"
      time_box: "3 days"
      resources:
        - "1 engineer"
        - "Synapse dev environment"
        - "Synthetic data generator"

      design:
        in_scope:
          - "Generate synthetic data (10M, 50M, 100M)"
          - "Run 5 representative query patterns"
          - "Measure P50, P95, P99 response times"
        out_of_scope:
          - "Production code quality"
          - "Security implementation"
          - "Documentation"

        success_criteria:
          - "P95 < 30 seconds at 100M"
          - "No timeout errors"
          - "Sub-linear or linear scaling"

        failure_criteria:
          - "P95 > 60 seconds"
          - "Timeout errors at scale"
          - "Super-linear scaling"

      execution:
        status: "Complete"
        actual_duration: "3 days"
        result: "Success"

        findings:
          - "10M: 3-5 seconds"
          - "50M: 12-18 seconds"
          - "100M: 22-28 seconds"
          - "120M: 26-32 seconds (bonus test)"

        evidence: "link/to/test-results"

        learnings:
          - "Synapse handles scale well"
          - "Concurrent queries show slight degradation"
          - "Recommend connection pooling for production"

      conclusion:
        assumption_status: "Validated"
        confidence: "H"
        conditions: []
        recommendations:
          - "Implement connection pooling"
          - "Monitor concurrent query patterns"

    - id: "PROBE-002"
      name: "Delta-Synapse Integration"
      question: "Does Delta Lake integrate with Synapse serverless?"
      type: "Integration probe"
      time_box: "5 days"

      execution:
        status: "Complete"
        result: "Partial success"

        findings:
          - "Direct query works for simple tables"
          - "Complex schemas require view layer"
          - "Time travel queries not supported"

        learnings:
          - "Need abstraction layer for schema evolution"
          - "Time travel requires Databricks, not Synapse"

      conclusion:
        assumption_status: "Partially validated"
        confidence: "M"
        conditions:
          - "Implement view layer for complex schemas"
          - "Use Databricks for time-travel queries"

    - id: "PROBE-003"
      name: "Mars Data Parsing"
      question: "Can we correctly parse Mars ERP export format?"
      type: "Spike"
      time_box: "2 days"

      execution:
        status: "Pending"
        blocker: "Waiting for sample data from Mars"
        expected_completion: "Week 3"

  information_gain_summary:
    high_uncertainty_resolved: 2
    medium_uncertainty_resolved: 0
    remaining_uncertainty:
      - "Mars data format (pending sample)"
      - "Edge case handling (deprioritized)"

  recommendations:
    - "Proceed with Synapse architecture"
    - "Plan view layer for Delta-Synapse"
    - "Escalate Mars sample data request"
```

## Integration Points

- **Feeds from:** #302 Critical Assumption Testing (what to probe)
- **Feeds to:** #401 Overall profile, #306 Spike execution

## Common Pitfalls

- **Over-engineering probes:** Building production code instead of learning
- **Scope creep:** Adding features to probe
- **Ignoring failures:** Not treating probe failure as valuable information
- **No time box:** Probes that run indefinitely
- **Testing the wrong thing:** Probe doesn't actually answer the question
