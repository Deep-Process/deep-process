---
step: 3
name: "ADVERSARY"
time_estimate: "90-180 minutes"
goal: "Execute ALL 8 adversarial operations — NON-NEGOTIABLE"
requires_completion: true
next_steps: ["step-04-tradeoffs.md"]
data_dependencies: ["data/schemas/adversary-findings.schema.yaml", "architecture-model.yaml", "canonical-operations.yaml"]
outputs: ["adversary-findings.yaml"]
gate: "GATE_3"
gate_conditions: 7
operations_required: 8
non_negotiable: true
---

# PHASE 3: ADVERSARY — ENFORCED SEQUENCE (NON-NEGOTIABLE)

**ALL 8 adversarial operations MUST be executed (INV-08, BLOCKER).**
**NO scope reduction allowed. NO user approval can override.**
**User requirement: "ADVERSARY jest potrzebne" + MA-005.**

## 3.0 ASSUMPTIONS_DECLARED (BEFORE ANY EXTRACTION)

1. Read architecture-model.yaml + canonical-operations.yaml
2. Declare assumptions about threat landscape, failure modes, complexity expectations
3. Log in adversary-findings.yaml `assumptions[]` with A-3XX IDs
4. Minimum 3 assumptions required

**IF zero assumptions → HALT (INV-03 violation)**

---

## 3.1 OPERATION 1: THREAT MODELING (STRIDE)

Analyze security threats across ALL 6 STRIDE categories.

1. For each component/interface, evaluate 6 categories:
   - **S**poofing: Can identity be faked? Authentication weaknesses?
   - **T**ampering: Can data/code be modified? Integrity checks?
   - **R**epudiation: Can actions be denied? Logging/audit trail?
   - **I**nformation Disclosure: Can data leak? Encryption? Access control?
   - **D**enial of Service: Can service be disrupted? Rate limiting?
   - **E**levation of Privilege: Can unauthorized access be gained? Authorization?

2. For each threat found:
   ```yaml
   - id: "T-001"
     category: "Spoofing"
     target: "C-001"
     description: "API endpoint accepts tokens without validation"
     severity: "high"
     mitigation: "Implement JWT validation middleware"
     residual_risk: "Token theft via XSS still possible"
   ```

3. Coverage MUST include ALL 6 categories (GATE_3 G3-02)
4. Minimum 6 threats total (≥1 per category)

---

## 3.2 OPERATION 2: FMEA (Failure Mode and Effects Analysis)

Identify failure modes, effects, and mitigations.

1. For each critical component, identify how it can fail:
   ```yaml
   - id: "FM-001"
     component: "C-003"
     failure_mode: "Database connection pool exhaustion"
     effect: "All queries timeout, API returns 503"
     severity: 8          # 1-10
     occurrence: 4         # 1-10
     detection: 6          # 1-10 (1=easy to detect, 10=impossible)
     rpn: 192              # severity × occurrence × detection
     mitigation: "Connection pool monitoring + auto-scaling"
     mitigated_rpn: 48     # after mitigation
   ```

2. Calculate RPN (Risk Priority Number) = severity × occurrence × detection
3. Flag items with RPN > 100 (threshold from config)
4. Minimum 5 failure modes (GATE_3 G3-03)
5. Prioritize by RPN for mitigation

---

## 3.3 OPERATION 3: BOTTLENECK DETECTION

Identify performance choke points.

1. Trace critical data flows (from relationship mapping)
2. For each flow, identify bottlenecks:
   ```yaml
   - id: "BN-001"
     location: "C-003 (Database)"
     type: "throughput"    # throughput|latency|resource|contention|bandwidth
     description: "Single DB instance handles all read/write"
     current_capacity: "1000 queries/sec"
     projected_load: "5000 queries/sec at peak"
     headroom: "-4000 queries/sec (insufficient)"
     mitigation: "Read replicas + connection pooling"
     priority: "critical"
   ```
3. Minimum 2 bottlenecks identified (GATE_3 G3-04)
4. Consider: network, compute, storage, memory, I/O, external API limits

---

## 3.4 OPERATION 4: ANTI-PATTERN DETECTION

Scan architecture for known anti-patterns.

1. Check for common architectural anti-patterns:
   - **God Component**: One component with too many responsibilities
   - **Distributed Monolith**: Microservices with tight coupling
   - **Chatty Communication**: Excessive inter-service calls
   - **Shared Database**: Multiple services sharing one database
   - **No API Gateway**: Direct client-to-service communication
   - **Missing Circuit Breaker**: No fault isolation
   - **Synchronous Chain**: Long synchronous call chains
   - **Big Ball of Mud**: No clear structure

2. For each detected:
   ```yaml
   - id: "AP-001"
     name: "Distributed Monolith"
     location: "Services C-001, C-002, C-003"
     description: "Services share database and deploy together"
     recommendation: "Separate databases, async communication"
     severity: "high"
   ```

---

## 3.5 OPERATION 5: COMPLEXITY ANALYSIS

Calculate complexity metrics.

1. **Cyclomatic complexity** per component:
   - Count independent paths / decision points
   - Threshold: 10 (from config)
   - Status: PASS (≤10) | WARNING (11-15) | FAIL (>15)

2. **Cognitive complexity** per component:
   - Assess difficulty of understanding
   - Threshold: 15 (from config)

3. **Coupling metrics** (from dependency management):
   - Overall coupling score (average Ca + Ce)
   - Hotspots: top 3 most coupled components

4. **Cohesion metrics** (from dependency management):
   - Overall cohesion score (average)
   - Cold spots: top 3 least cohesive components

5. Summary:
   ```yaml
   summary:
     total_components_analyzed: 12
     violations: 3
     health: "concerning"    # healthy|concerning|critical
   ```

---

## 3.6 OPERATION 6: COMPLIANCE ANALYSIS

Verify regulatory and policy compliance.

1. Read context-assessment.yaml → regulatory constraints
2. For each applicable regulation (GDPR, HIPAA, PCI-DSS, SOC2, etc.):
   ```yaml
   - regulation: "GDPR"
     relevance: "EU user data processing"
     requirements:
       - requirement: "Right to deletion"
         status: "met"
         evidence: "Data deletion endpoint in C-001"
       - requirement: "Data minimization"
         status: "partially_met"
         evidence: "Some components collect unnecessary fields"
   ```
3. Document gaps with remediation and priority
4. IF no regulations apply → document "not_applicable" with rationale

---

## 3.7 OPERATION 7: PRE-MORTEM

Assume the architecture FAILED. Work backward to causes.

**Method #61 Pre-mortem (embedded):**
1. Assume system has been deployed and FAILED catastrophically
2. Brainstorm: WHY did it fail?
3. For each failure scenario:
   ```yaml
   - id: "PS-001"
     scenario: "System crashed under Black Friday load"
     root_cause: "No auto-scaling, single database bottleneck"
     probability: "high"
     impact: "catastrophic"
     early_warning_signs:
       - "Response times increasing steadily"
       - "Connection pool utilization >80%"
     preventive_measures:
       - "Implement auto-scaling"
       - "Add read replicas"
       - "Load testing before launch"
   ```
4. Minimum 5 failure scenarios (GATE_3 G3-07)
5. Cover: performance, security, data loss, integration, human error

---

## 3.8 OPERATION 8: TRADE-OFF IDENTIFICATION

Identify conflicting quality attributes.

1. From quality attribute priorities (Phase 1), identify conflicts:
   ```yaml
   - id: "TC-001"
     attribute_a: "Performance"
     attribute_b: "Security"
     tension: "Encryption adds latency; strong auth adds overhead"
     current_resolution: "TLS 1.3 with 10ms overhead, JWT validation cached"
     alternative_resolutions:
       - "No encryption (faster, insecure)"
       - "Custom lightweight encryption (faster, less secure)"
   ```
2. Minimum 2 conflicts identified
3. These feed into Phase 4 (ATAM/CBAM trade-off analysis)

---

## 3.9 VERIFY: Adversary Validation

**PRECONDITION: [EXTRACT_COMPLETE — all 8 operations executed]**

1. **Completeness check:** Count executed operations — MUST be 8 (NON-NEGOTIABLE)

2. **Method #85 Grounding Check:**
   1. Sample 3 STRIDE threats → verify target components exist
   2. Sample 2 FMEA failure modes → verify components exist and failure plausible
   3. Sample 2 bottlenecks → verify data flows exist
   4. IF rate < 0.70 → re-execute with proper references

3. **Method #84 Coherence Check:**
   1. Verify STRIDE covers all 6 categories (boolean check)
   2. Verify FMEA RPN calculations correct (severity × occurrence × detection)
   3. Verify bottleneck capacity vs projected load numbers consistent
   4. Verify pre-mortem scenarios don't contradict design choices

4. **Method #61 Pre-mortem on ADVERSARY itself (for deep depth):**
   1. What adversarial findings did we MISS?
   2. What threat categories are we blind to?
   3. Are there attack vectors from unexpected directions?

---

## 3.10 RENDER: Adversary Findings Artifact

**PRECONDITION: [VERIFY_COMPLETE]**

1. Create `adversary-findings.yaml` following schema
2. Include ALL 8 operations with full data, summary with severity breakdown
3. Write to `{output_directory}/architecture-artifacts/adversary-findings.yaml`

---

## 3.11 CHECKLIST

| # | Item | Status |
|---|------|--------|
| 1 | STRIDE executed (all 6 categories, ≥6 threats) | PASS/FAIL |
| 2 | FMEA executed (≥5 failure modes, RPN calculated) | PASS/FAIL |
| 3 | Bottleneck Detection executed (≥2 bottlenecks) | PASS/FAIL |
| 4 | Anti-Pattern Detection executed | PASS/FAIL |
| 5 | Complexity Analysis executed (metrics calculated) | PASS/FAIL |
| 6 | Compliance Analysis executed | PASS/FAIL |
| 7 | Pre-mortem executed (≥5 failure scenarios) | PASS/FAIL |
| 8 | Trade-off Identification executed (≥2 conflicts) | PASS/FAIL |
| 9 | ASSUMPTIONS_DECLARED (≥3) | PASS/FAIL |
| 10 | Counter-checks executed (≥ depth minimum) | PASS/FAIL |
| 11 | adversary-findings.yaml written | PASS/FAIL |

---

## 3.12 GATE_3 EVALUATION (NON-NEGOTIABLE)

| Condition | Description | Severity | Status |
|-----------|-------------|----------|--------|
| G3-01 | All 8 adversarial operations executed | BLOCKER | |
| G3-02 | STRIDE complete (all 6 categories) | CRITICAL | |
| G3-03 | FMEA failure modes identified (≥5) | CRITICAL | |
| G3-04 | Bottlenecks identified (≥2) | ERROR | |
| G3-05 | Anti-patterns scanned | REQUIRED | |
| G3-06 | Complexity metrics calculated | CRITICAL | |
| G3-07 | Pre-mortem executed (≥5 scenarios) | CRITICAL | |

**Pass criteria:** G3-01 (BLOCKER) + ALL CRITICAL conditions met

- IF G3-01 fails → GATE_3 = **LOCKED** → ABORT (BLOCKER, INV-08 violation, **NO SCOPE REDUCTION**)
- IF CRITICAL fails → GATE_3 = **LOCKED** → HALT, fix, re-evaluate
- IF ALL pass → GATE_3 = **OPEN** → proceed to Phase 4

**ENFORCEMENT:** ADVERSARY is NON-NEGOTIABLE. Agent CANNOT:
- Skip any of the 8 operations
- Declare SCOPE_REDUCTION for G3-01
- Request user approval to bypass
- Cite "token limits" or "brevity" to abbreviate
