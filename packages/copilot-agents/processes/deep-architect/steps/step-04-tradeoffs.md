---
step: 4
name: "Trade-off Analysis"
time_estimate: "45-90 minutes"
goal: "Analyze trade-offs using ATAM/CBAM, document decisions with rationale"
requires_completion: true
next_steps: ["step-05-validation.md"]
data_dependencies: ["data/schemas/tradeoff-analysis.schema.yaml", "canonical-operations.yaml", "architecture-model.yaml", "adversary-findings.yaml"]
outputs: ["tradeoff-analysis.yaml"]
gate: "GATE_4"
gate_conditions: 7
---

# PHASE 4: TRADE-OFF ANALYSIS — ENFORCED SEQUENCE

## 4.0 ASSUMPTIONS_DECLARED

1. Declare assumptions about quality attribute priorities, cost estimates, scenario relevance
2. Log in tradeoff-analysis.yaml `assumptions[]` with A-4XX IDs
3. Minimum 2 assumptions (3+ for deep depth)

**IF zero assumptions → HALT (INV-03 violation)**

---

## 4.1 EXTRACT: Quality Attribute Tree (ATAM)

1. Read canonical-operations.yaml → `quality_attributes.prioritized[]`
2. For each prioritized attribute, define refinements:
   ```yaml
   quality_attribute_tree:
     - attribute: "Performance"
       refinements:
         - sub_attribute: "Response Time"
           scenarios: ["SA-001"]
         - sub_attribute: "Throughput"
           scenarios: ["SA-002"]
   ```
3. Link each refinement to scenarios

---

## 4.2 EXTRACT: ATAM Scenarios

1. Define ≥3 quality attribute scenarios:
   ```yaml
   - id: "SA-001"
     type: "use_case"         # use_case | growth | exploratory
     stimulus: "1000 concurrent users send requests"
     source: "External users"
     environment: "Normal operation, peak hour"
     artifact: "API Gateway (C-001)"
     response: "Process all requests"
     response_measure: "95th percentile < 200ms"
     attribute: "Performance"
     priority: "high"
   ```
2. Include at least one of each type (use_case, growth, exploratory) for deep depth
3. Scenarios MUST reference real components (C-XXX from Phase 1)

---

## 4.3 EXTRACT: Sensitivity Points

1. Identify architectural elements where small changes significantly affect quality attributes
2. For each sensitivity point:
   ```yaml
   - id: "SP-001"
     component: "C-003"
     attribute: "Performance"
     description: "Database connection pool size"
     impact: "Changing pool size from 10 to 50 doubles throughput but increases memory 3x"
   ```
3. Minimum 2 sensitivity points (GATE_4 G4-02)

---

## 4.4 EXTRACT: Trade-off Points

1. Identify points where improving one attribute degrades another
2. For each trade-off:
   ```yaml
   - id: "TP-001"
     attribute_a: "Performance"
     attribute_b: "Security"
     component: "C-001"
     description: "Adding encryption increases latency"
     current_position: "TLS 1.3 with 10ms overhead"
     rationale: "Acceptable latency for required security"
     alternatives:
       - position: "No encryption, 0ms overhead"
         pros: ["Maximum performance"]
         cons: ["No data protection, compliance violation"]
       - position: "Custom encryption, 5ms overhead"
         pros: ["Lower latency"]
         cons: ["Maintenance burden, audit risk"]
   ```
3. Minimum 2 trade-off points (GATE_4 G4-03)

---

## 4.5 EXTRACT: CBAM Cost-Benefit Analysis

1. For significant architectural strategies, analyze costs vs benefits:
   ```yaml
   - strategy: "Microservices decomposition"
     quality_attributes_affected: ["Scalability", "Maintainability", "Complexity"]
     costs:
       development: "3 months additional setup"
       operational: "Container orchestration overhead"
       risk: "Distributed system complexity"
     benefits:
       - attribute: "Scalability"
         improvement: "Independent scaling per service"
         confidence: 0.85
       - attribute: "Maintainability"
         improvement: "Independent deployment cycles"
         confidence: 0.80
     roi_assessment: "Positive ROI for teams >5 developers"
   ```
2. Rank strategies by ROI

---

## 4.6 EXTRACT: FinOps / Cost Architecture

1. Estimate infrastructure costs per deployment environment:
   ```yaml
   cost_architecture:
     environments:
       - name: "production"
         monthly_estimate: "$X,XXX"
         cost_drivers:
           - resource: "Compute (EC2/Lambda/K8s)"
             monthly: "$X,XXX"
           - resource: "Storage (S3/RDS/DynamoDB)"
             monthly: "$XXX"
           - resource: "Network (data transfer)"
             monthly: "$XXX"
       - name: "staging"
         monthly_estimate: "$XXX"
     total_monthly: "$X,XXX"
     cost_optimization_strategies:
       - "[Reserved instances, Spot instances, auto-scaling policies]"
     cost_scaling_model: "linear | logarithmic | step-function"
     break_even_analysis: "[At what scale does architecture choice X pay off]"
   ```
2. Compare cost implications of architectural alternatives (from CBAM)
3. IF costs unknown → declare as assumption, estimate order of magnitude

---

## 4.7 EXTRACT: Evolution Strategy

1. Define architecture evolution roadmap:
   ```yaml
   evolution_strategy:
     phases:
       - phase: "MVP / Phase 1"
         timeline: "[0-3 months]"
         scope: "[Core features, monolith-first]"
         architecture: "[Simplified version]"
       - phase: "Growth / Phase 2"
         timeline: "[3-12 months]"
         scope: "[Scale features, extract services]"
         architecture: "[Decomposed version]"
       - phase: "Maturity / Phase 3"
         timeline: "[12+ months]"
         scope: "[Optimization, advanced features]"
         architecture: "[Full target architecture]"
     migration_path:
       - from: "[Current state]"
         to: "[Target state]"
         strategy: "strangler_fig | parallel_run | big_bang | incremental"
         risks: ["[Risk 1]", "[Risk 2]"]
         rollback_plan: "[How to revert if migration fails]"
     extensibility_points:
       - "[Where can new features be added with minimal disruption]"
     deprecation_plan:
       - "[What components will be retired and when]"
   ```
2. Ensure evolution aligns with team capacity and business roadmap
3. IF brownfield/migration (from context-assessment.yaml) → evolution strategy is MANDATORY

---

## 4.8 EXTRACT: Decisions

1. For each trade-off point, document the decision:
   ```yaml
   - id: "D-001"
     description: "Use TLS 1.3 despite latency overhead"
     rationale: "Security compliance required, 10ms acceptable"
     trade_off_point: "TP-001"
     alternatives_rejected:
       - option: "No encryption"
         reason: "Compliance violation"
     reversibility: "reversible"
     confidence: 0.90
   ```
2. ALL decisions MUST have rationale (GATE_4 G4-05)

---

## 4.9 VERIFY: Trade-off Validation

**PRECONDITION: [EXTRACT_COMPLETE]**

1. **Method #85 Grounding Check:**
   1. Sample 3 scenarios → verify referenced components exist in canonical-operations.yaml
   2. Sample 2 sensitivity points → verify impact claims are plausible
   3. IF rate < 0.70 → re-analyze with corrected references

2. **Method #84 Coherence Check:**
   1. Verify trade-off points don't contradict decisions
   2. Verify CBAM ranking is consistent with quality priorities
   3. Verify scenarios cover prioritized attributes

3. **Method #61 Pre-mortem (for deep depth):**
   1. Assume trade-off decisions were WRONG
   2. What would happen to the architecture?
   3. Identify 3+ failure scenarios from bad trade-offs
   4. Document mitigations

---

## 4.10 RENDER: Trade-off Analysis Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `tradeoff-analysis.yaml` following schema
2. Include: metadata, assumptions, atam (tree, scenarios, sensitivity, tradeoffs), cbam, cost_architecture, evolution_strategy, decisions, checklist, counter_checks
3. Write to `{output_directory}/architecture-artifacts/tradeoff-analysis.yaml`

---

## 4.11 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | Quality attribute tree built | PASS/FAIL |
| 2 | ATAM scenarios defined (≥3) | PASS/FAIL |
| 3 | Sensitivity points identified (≥2) | PASS/FAIL |
| 4 | Trade-off points documented (≥2) | PASS/FAIL |
| 5 | CBAM cost-benefit calculated | PASS/FAIL |
| 6 | FinOps / cost architecture estimated | PASS/FAIL |
| 7 | Evolution strategy defined | PASS/FAIL |
| 8 | Decisions with rationale | PASS/FAIL |
| 9 | ASSUMPTIONS_DECLARED | PASS/FAIL |
| 10 | Counter-checks executed | PASS/FAIL |
| 11 | tradeoff-analysis.yaml written | PASS/FAIL |

---

## 4.12 GATE_4 EVALUATION

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G4-01 | ATAM scenarios defined (≥3) | CRITICAL | |
| G4-02 | Sensitivity points identified (≥2) | CRITICAL | |
| G4-03 | Trade-off points documented (≥2) | CRITICAL | |
| G4-04 | CBAM cost-benefit calculated | ERROR | |
| G4-05 | Decisions justified | REQUIRED | |
| G4-06 | Evolution strategy defined | ERROR | |
| G4-07 | Cost architecture estimated | REQUIRED | |

**Pass criteria:** ALL CRITICAL conditions met

- IF ALL CRITICAL pass → GATE_4 = **OPEN** → proceed to Phase 5
- IF any CRITICAL fails → GATE_4 = **LOCKED** → HALT, fix
- IF G4-04/G4-06 fails → LOG warning, proceed (ERROR severity)
