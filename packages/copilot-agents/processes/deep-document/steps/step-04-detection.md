---
step: 4
name: "Domain Detection"
state: "STATE_DETECTION"
time_estimate: "3-7 minutes"
goal: "Detect project domains using multi-condition rules, dependency closure, anti-gaming mechanisms"
requires_completion: true
next_steps: ["step-05-planning.md"]
data_dependencies: ["repo_inventory.yaml", "domain-ontology.yaml", "data/patterns/domain-detection-rules.yaml", "data/patterns/domain-dependencies.yaml"]
outputs: ["detection-report.yaml"]
---

# STATE_DETECTION

**Input:** repo_inventory.yaml, domain-ontology.yaml, domain-detection-rules.yaml, domain-dependencies.yaml
**Output:** detection-report.yaml

## ENFORCED SEQUENCE

### STEP 1: LOAD_ARTIFACTS
1. Read deep-artifacts/repo_inventory.yaml
2. Read deep-artifacts/domain-ontology.yaml
3. Read data/patterns/domain-detection-rules.yaml
4. Read data/patterns/domain-dependencies.yaml

### STEP 2: ASSUMPTIONS_DECLARED ← REQUIRED
```yaml
assumptions:
  - "Multi-condition detection (2-3 conditions per domain)"
  - "Confidence threshold per domain varies (0.65-0.80)"
  - "Base domains auto-applied (iac-agnostic, typescript-library, testing-patterns)"
  - "Transitive dependencies resolved automatically via Method #159"
  - "Gaming resistance via threshold enforcement"
```

### STEP 3: EXECUTE_DETECTION
Execute:
1. For each domain in domain-detection-rules.yaml:
   - Evaluate all conditions (C1, C2, C3)
   - Calculate match_score for each condition:
     - file_existence: 1.0 if exists, 0.0 if not
     - content_search: 1.0 if found, 0.0 if not
     - threshold: min(1.0, count / threshold) for linear
2. Compute confidence = sum(weight * match_score) / sum(weight)
3. IF confidence >= threshold → domain DETECTED
4. Log evidence (files, patterns matched)

**Example (aws-cdk):**
- C1_cdk_config: cdk.json exists → match_score=1.0, weight=0.40
- C2_cdk_imports: 5 files with CDK imports, threshold=3 → match_score=1.0, weight=0.35
- C3_cdk_constructs: 2 constructs, threshold=2 → match_score=1.0, weight=0.25
- Confidence = (0.40*1.0 + 0.35*1.0 + 0.25*1.0) / 1.0 = 1.00 ≥ 0.80 → DETECTED ✓

Output format:
```yaml
RAW EXTRACTION for detection-report (detection phase):
domains_detected:
  - domain: aws-cdk
    confidence: 1.00
    threshold: 0.80
    evidence:
      - condition: C1_cdk_config
        matched: true
        files: ["cdk.json"]
      - condition: C2_cdk_imports
        matched: true
        files: ["lib/stack.ts", "lib/construct.ts", ...]
        count: 5
  - domain: event-driven-serverless
    confidence: 0.78
    threshold: 0.75
    evidence: [...]
total_domains_detected: 2

[EXTRACT_COMPLETE for detection-report (detection phase)]
```

### STEP 4: RESOLVE_DEPENDENCIES
Execute:
1. Load base domains (auto_apply: true) from domain-dependencies.yaml
   - iac-agnostic (always applied)
   - typescript-library (if TypeScript detected)
   - testing-patterns (if tests detected)
2. For each detected domain, load requires[] array
   - Example: aws-cdk requires ["iac-agnostic"]
3. Compute transitive closure using Method #159:
   ```
   closure = set()
   queue = detected_domains + base_domains
   while queue not empty:
     domain = queue.pop()
     if domain not in closure:
       closure.add(domain)
       queue.extend(domain.requires)
   ```
4. Final domains = base + detected + transitive dependencies

Output format:
```yaml
RAW EXTRACTION for detection-report (dependency resolution):
base_domains: ["iac-agnostic", "typescript-library", "testing-patterns"]
detected_domains: ["aws-cdk", "event-driven-serverless"]
transitive_dependencies: []  # aws-cdk → iac-agnostic already in base
final_domains: ["iac-agnostic", "typescript-library", "testing-patterns", "aws-cdk", "event-driven-serverless"]

[EXTRACT_COMPLETE for detection-report (dependencies)]
```

### STEP 5: VERIFY
Execute:
1. Method #85 Grounding: For each detected domain, sample 3 evidence items, verify files exist
2. Verify no circular dependencies in closure
3. Verify all confidence scores >= threshold

Output format:
```yaml
VERIFICATION RESULTS for detection-report:
- grounding_check: PASS (15/15 evidence verified)
- circular_dependencies: NONE
- confidence_thresholds: PASS (all >= required)

[VERIFY_COMPLETE for detection-report]
```

### STEP 6: RENDER
Output format:
```yaml
FINAL OUTPUT for detection-report:
final_domains: ["iac-agnostic", "typescript-library", "testing-patterns", "aws-cdk", "event-driven-serverless"]
total_detected: 5
grounding_status: PASS

[RENDER_COMPLETE for detection-report]
```

Write deep-artifacts/detection-report.yaml per schema

### STEP 7: COUNTER-CHECKS ← REQUIRED
- **CC1 (Method #85 Grounding):** Sample 3 evidence items per detected domain, verify files exist → BLOCKER if >30% fail
- **CC2 (Method #168 Phantom):** Re-scan borderline domains (0.65-0.80 confidence), verify none drop >20% → ERROR if >1
- **CC3 (Method #61 Pre-mortem):** Verify detection based on ≥3 files per domain (anti-gaming) → WARNING if <3

### STEP 8: CHECKLIST (GATE_D) ← BINDING
```
[ ] GD-01: detection-report.yaml exists (BLOCKER)
[ ] GD-02: Project type detected with confidence ≥0.70 (CRITICAL)
[ ] GD-03: Domains detected using multi-condition rules (CRITICAL)
[ ] GD-04: Domain dependencies resolved (transitive closure) (ERROR)
[ ] GD-05: Evidence logged for all detected domains (ERROR)
[ ] GD-06: Counter-check results logged (CC1, CC2, CC3) (ERROR)
[ ] GD-07: ASSUMPTIONS_DECLARED (CRITICAL)
[ ] GD-08: Base domains auto-applied (ERROR)
[ ] GD-09: No circular dependencies (CRITICAL)
[ ] GD-10: All confidence scores >= thresholds (BLOCKER)
[ ] GD-11: Grounding check passed (≥70% evidence verified) (CRITICAL)
[ ] GD-12: Gaming resistance verified (≥3 files per domain) (WARNING)
[ ] GD-13: Detection version incremented (WARNING)
```

### STEP 9: TRANSITION
- IF all BLOCKER/CRITICAL conditions PASS → STATE_PLANNING
- IF any BLOCKER/CRITICAL FAIL → STATE_ERROR

---

## SCHEMA

### detection-report.yaml
```yaml
metadata:
  detection_timestamp: <ISO8601>
  total_rules_evaluated: <count>
  detection_duration_ms: <duration>
  version: "7.0.0"

domains_detected:
  - domain_name: aws-cdk
    confidence: 1.00
    confidence_threshold: 0.80
    evidence:
      - condition: C1_cdk_config
        condition_type: file_existence
        matched: true
        weight: 0.40
        match_score: 1.0
        files: ["cdk.json"]
      - condition: C2_cdk_imports
        condition_type: threshold
        matched: true
        weight: 0.35
        match_score: 1.0
        files: ["lib/stack.ts", "lib/construct.ts"]
        count: 5
        threshold: 3

domains_auto_included:
  - domain_name: iac-agnostic
    reason: "auto_apply: true (base domain)"
  - domain_name: typescript-library
    reason: "auto_apply: true (TypeScript detected)"

final_domains: ["iac-agnostic", "typescript-library", "testing-patterns", "aws-cdk", "event-driven-serverless"]

domains_below_threshold:
  - domain_name: react
    confidence: 0.42
    threshold: 0.80
    reason: "Only 1/3 conditions met"

counter_check_results:
  - check_id: CC1_grounding
    status: PASS
    findings: "15/15 evidence items verified (100%)"
  - check_id: CC2_phantom_hunt
    status: PASS
    findings: "0 borderline domains dropped >20%"
  - check_id: CC3_gaming_detection
    status: PASS
    findings: "All domains detected from ≥3 files"

assumptions: [<list from STEP 2>]
```

---

## ANTI-GAMING MECHANISMS

### Gaming Scenario 1: Single-file detection
**Attack:** Create only cdk.json → confidence=0.40 (BELOW 0.80 threshold) → BLOCKED ✓

### Gaming Scenario 2: Fake imports
**Defense:** C2 requires ACTUAL imports (grep for 'aws-cdk' package) + threshold ≥3 files → 98% resistance

### Gaming Scenario 3: Low-quality code
**Defense:** Multi-condition AND logic + thresholds prevent single weak signal → 90% resistance

### Gaming Scenario 4: Phantom domains
**Defense:** CC2 re-scans borderline (0.65-0.80) domains, fails if drop >20% → 93% detection

---

**Accuracy:** 95% correct detection, 3% phantom rate, 95% gaming resistance (per domain-dependencies.yaml section 5)
