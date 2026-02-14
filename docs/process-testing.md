# Process Testing Guide

## Purpose

Test all 4 deep-* processes on realistic scenarios to verify:
- ENFORCED SEQUENCE compliance
- GATE functionality
- COUNTER_CHECK execution
- VIOLATION RECOVERY
- Integration points

---

## TEST 1: deep-challenge

### Scenario
Test security vulnerability detection in authentication system

### Input
```yaml
system_description: |
  Authentication service for web application
  - JWT token generation
  - Password hashing with bcrypt
  - Session management
  - OAuth integration (Google, GitHub)
  - Rate limiting on login attempts

code_reference: "src/auth/login.py"
```

### Expected Flow
```
STEP 1 (EXTRACT):
  - Extract assumptions about authentication security
  - Expected: 10-15 assumptions
  - GATE_1: assumptions_count >= 1 ✓

STEP 2 (CHALLENGE):
  - Generate attack vectors for each assumption
  - Test: "JWT secret is secure" → Try weak secrets
  - GATE_2: challenges_generated >= assumptions_count ✓

STEP 3 (DETECT):
  - Use Method #341 (Jailbreak patterns) - not applicable
  - Use Method #342 (Injection detector) - applicable
  - Detect: SQL injection, XSS, JWT manipulation
  - GATE_3: vulnerabilities_count >= 0 ✓

STEP 4 (STRESS):
  - Test boundary conditions (max password length)
  - Test edge cases (null passwords, SQL injection strings)
  - GATE_4: tests_executed >= vulnerabilities_count ✓

STEP 5 (SCORE):
  - Calculate CVSS scores
  - Expected: 2-3 CRITICAL, 5-7 HIGH
  - GATE_5: scores_assigned = TRUE ✓

STEP 6 (REMEDIATE):
  - Match remediation patterns
  - Generate fixes for injection vulnerabilities
  - GATE_6: remediation_count >= critical_count ✓
```

### Success Criteria
- All 6 GATES open
- COUNTER_CHECK executed at each step
- Vulnerabilities detected and remediated
- No VIOLATIONS

---

## TEST 2: deep-governance

### Scenario
Establish access control policies for cloud infrastructure

### Input
```yaml
organization: "TechCorp Inc."
systems:
  - name: "Production AWS"
    users: 50
    roles: ["admin", "developer", "viewer"]
  - name: "Development Environment"
    users: 30
    roles: ["developer", "tester"]

requirements:
  - "Only admins can modify production"
  - "Developers need read/write to development"
  - "All access must be logged"
  - "MFA required for production access"
```

### Expected Flow
```
STEP 1 (INVENTORY):
  - Extract 4 requirements
  - Identify 2 stakeholders (users, admins)
  - GATE_1: requirements >= 1, stakeholders >= 1 ✓

STEP 2 (POLICY):
  - Create 4 policies from requirements
  - Resolve any policy conflicts
  - GATE_2: policies >= requirements_count ✓

STEP 3 (ENFORCE):
  - Implement access control matrix
  - Configure enforcement (IAM policies)
  - GATE_3: controls_implemented >= policies_count ✓

STEP 4 (MONITOR):
  - Collect compliance data
  - Detect violations (unauthorized access attempts)
  - GATE_4: monitoring_active = TRUE ✓

STEP 5 (AUDIT):
  - Generate audit trail
  - Collect evidence of compliance
  - GATE_5: audit_trail_generated = TRUE ✓

STEP 6 (REMEDIATE):
  - Fix any violations found
  - Verify risk reduction
  - GATE_6: remediation_count >= critical_violations ✓
```

### Success Criteria
- All 6 GATES open
- Policies created and enforced
- Violations detected and remediated
- Audit trail complete

---

## TEST 3: deep-orchestration

### Scenario
Orchestrate multi-step ML pipeline execution

### Input
```yaml
workflow: "ML Training Pipeline"
tasks:
  - task: "data_extraction"
    type: AUTOMATED
    duration: "2 hours"
    depends_on: []

  - task: "data_cleaning"
    type: AUTOMATED
    duration: "1 hour"
    depends_on: ["data_extraction"]

  - task: "feature_engineering"
    type: AUTOMATED
    duration: "3 hours"
    depends_on: ["data_cleaning"]

  - task: "model_training"
    type: AUTOMATED
    duration: "8 hours"
    depends_on: ["feature_engineering"]
    resources:
      cpu: 16
      memory: 64GB
      gpu: 2

  - task: "model_validation"
    type: AUTOMATED
    duration: "1 hour"
    depends_on: ["model_training"]

  - task: "model_deployment"
    type: MANUAL
    duration: "30 minutes"
    depends_on: ["model_validation"]
    approval_required: true
```

### Expected Flow
```
STEP 1 (DEFINE):
  - Extract 6 tasks
  - Define workflow structure (SEQUENTIAL with dependencies)
  - GATE_1: tasks >= 1, workflow_defined = TRUE ✓

STEP 2 (MAP):
  - Map dependencies (data flow)
  - Allocate resources (CPU, memory, GPU)
  - GATE_2: dependencies_mapped = TRUE, resources_allocated = TRUE ✓

STEP 3 (SEQUENCE):
  - Identify parallelization (none - sequential)
  - Optimize execution (minimize idle time)
  - GATE_3: execution_sequence_defined = TRUE ✓

STEP 4 (EXECUTE):
  - Start workflow execution
  - Track state for each task
  - GATE_4: execution_started = TRUE ✓

STEP 5 (MONITOR):
  - Monitor progress
  - Detect anomalies (task taking too long)
  - GATE_5: monitoring_complete = TRUE ✓

STEP 6 (AGGREGATE):
  - Collect outputs from all tasks
  - Generate execution report
  - GATE_6: results_aggregated = TRUE ✓
```

### Success Criteria
- All 6 GATES open
- Dependencies respected
- Resources allocated correctly
- Workflow completes successfully

---

## TEST 4: deep-compliance

### Scenario
EU AI Act compliance assessment for recruitment AI

### Input
```yaml
system_name: "RecruitAI"
system_type: "AI-powered candidate screening"
description: |
  AI system that analyzes CVs and ranks candidates
  - NLP for resume parsing
  - ML model for candidate scoring
  - Automated interview scheduling
  - Integration with ATS

deployment: "EU-wide (Germany, France, Netherlands)"
users: "HR departments, recruiters"
decisions: "Candidate ranking, interview invitations"
```

### Expected Flow
```
STEP 1 (INVENTORY):
  - Identify 1 system (RecruitAI)
  - Extract 4+ capabilities
  - Classify as HIGH_RISK (Annex III.4 - Employment)
  - GATE_1: systems >= 1, capabilities >= 3 ✓

STEP 2 (MAP):
  - Map EU AI Act requirements
  - Expected: 100+ requirements (high-risk system)
  - Coverage >= 90%
  - GATE_2: requirements_mapped >= 90% ✓

STEP 3 (ANALYZE):
  - Assess compliance for each requirement
  - Identify gaps (missing documentation, testing)
  - Expected: 20-30 gaps (CRITICAL: 3-5, HIGH: 10-15)
  - GATE_3: gaps_classified = TRUE ✓

STEP 4 (COLLECT):
  - Collect evidence for covered requirements
  - Verify evidence quality
  - GATE_4: evidence_collected >= covered_count ✓

STEP 5 (PLAN):
  - Generate remediation plans for all gaps
  - Create timeline (12-16 weeks to compliance)
  - GATE_5: plans >= critical_gaps_count ✓

STEP 6 (REPORT):
  - Generate compliance report
  - Calculate compliance % (expected: 65-75%)
  - GATE_6: report_complete = TRUE ✓
```

### Success Criteria
- All 6 GATES open
- High-risk classification correct
- Critical gaps identified
- Remediation plan feasible before Aug 2026 deadline

---

## INTEGRATION TEST: Multi-Process Workflow

### Scenario
Full security and compliance assessment of production system

### Process Flow
```
1. deep-compliance (FIRST):
   - Assess EU AI Act compliance
   - Output: Compliance gaps, requirements

2. deep-challenge (PARALLEL):
   - Test for vulnerabilities
   - Output: Security vulnerabilities

3. deep-governance (USES OUTPUTS FROM 1,2):
   - Create policies addressing compliance + security
   - Input: Compliance gaps, vulnerabilities
   - Output: Policies, controls

4. deep-orchestration (ORCHESTRATES 1,2,3):
   - Coordinate execution of all processes
   - Input: All process definitions
   - Output: Aggregated results, timeline
```

### Data Flow
```yaml
deep-compliance →
  compliance_gaps.yaml →
    deep-governance (input as requirements)

deep-challenge →
  vulnerabilities.yaml →
    deep-governance (input as requirements)

deep-governance →
  policies.yaml →
    Implementation team

deep-orchestration →
  execution_plan.yaml →
    Project manager
  aggregated_results.yaml →
    Executive report
```

### Success Criteria
- All processes complete without VIOLATIONS
- Data flows correctly between processes
- No duplicate work
- Aggregated report includes all findings

---

## COUNTER_CHECK Testing

### Test: Verify COUNTER_CHECK prevents false positives

**Scenario:** deep-challenge identifies false vulnerability

**Flow:**
```
STEP 3 (DETECT):
  - Initial: 10 vulnerabilities detected

STEP 3 Section 7 (COUNTER_CHECK):
  - Select 5 CRITICAL vulnerabilities
  - For each: "Is this real or measurement error?"
  - Test: 2 vulnerabilities are false positives (defense exists)
  - Update: Remove 2 false positives
  - Final: 8 real vulnerabilities

GATE_3 evaluation:
  - vulnerabilities_count = 8 (not 10)
  - Confirms COUNTER_CHECK reduced false positives
```

**Success:** COUNTER_CHECK successfully eliminated false positives

---

## VIOLATION Testing

### Test 1: Attempt to skip GATE
```
Scenario: Agent tries to proceed from step-02 to step-03 before GATE_2 opens

Expected behavior:
  VIOLATION HANDLER triggers:
    "VIOLATION: GATE_2 not open"
    HALT execution
    RETURN to step-02

Verify: Process does not proceed until GATE_2 = OPEN
```

### Test 2: Attempt to skip COUNTER_CHECK
```
Scenario: Agent skips section 6 (COUNTER_CHECK) in any step

Expected behavior:
  VIOLATION HANDLER triggers:
    "VIOLATION: Section 6 COUNTER_CHECK required"
    HALT execution
    RETURN to section 6

Verify: COUNTER_CHECK is mandatory, cannot be skipped
```

### Test 3: Extract subset instead of ALL
```
Scenario: In deep-compliance step-01, agent extracts only "main" systems

Expected behavior:
  VIOLATION HANDLER triggers:
    "VIOLATION: ALL systems required, not subset"
    RETURN to section 4 (IDENTIFY_SYSTEMS)

Verify: Process enforces completeness, not partial extraction
```

---

## Performance Metrics

### Measure for each process:
- **Execution time**: How long does each step take?
- **GATE passage rate**: What % of runs pass each GATE?
- **COUNTER_CHECK effectiveness**: How many false positives eliminated?
- **VIOLATION triggers**: How often does VIOLATION handling activate?

### Target Benchmarks:
- GATE passage rate: >= 90% on well-formed inputs
- COUNTER_CHECK: Should eliminate 10-20% false positives
- VIOLATION triggers: Should be 0% on compliant agent execution

---

## Test Execution Checklist

□ Run TEST 1 (deep-challenge) on authentication system
□ Run TEST 2 (deep-governance) on access control
□ Run TEST 3 (deep-orchestration) on ML pipeline
□ Run TEST 4 (deep-compliance) on recruitment AI
□ Run INTEGRATION TEST (multi-process workflow)
□ Verify COUNTER_CHECK effectiveness
□ Test VIOLATION handling
□ Measure performance metrics
□ Document any issues found
□ Confirm all processes follow strict guidelines

**Status:** Ready for execution
**Next step:** Execute tests and collect results
