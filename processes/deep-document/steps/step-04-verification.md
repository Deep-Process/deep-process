---
step: 4
name: "VERIFICATION"
time_estimate: "15-20 minutes"
goal: "Verify documentation accuracy against source code. Detect hallucinations and degraded claims."
requires_completion: true
next_steps: ["step-05-refinement"]
data_dependencies:
  - "docs/*.md"
  - "knowledge-map.yaml"
  - "entity-log.yaml"
outputs:
  - artifact: "verification-report.yaml"
    location: "deep-artifacts/verification-report.yaml"
    schema: "data/schemas/verification-report.schema.yaml"
    consumers: ["step-05-refinement", "User (quality report)"]
---

# PHASE 4: VERIFICATION

## ENFORCED SEQUENCE

### STEP 1: Extract Claims (5 min)

**Actions:**
1. Read all `docs/*.md` files
2. Identify claims (statements with evidence citations):
   - "Function X calls function Y" → citation: file.ts:line
   - "Schema has property P" → citation: model.ts:line
   - "Test covers scenario S" → citation: test.ts:line
3. Build claims list with file:line references

**Output:**
```yaml
claims:
  - claim_id: "C-001"
    statement: "UserController.create() calls UserService.createUser()"
    evidence: "src/controllers/UserController.ts:23"
    doc_location: "docs/architecture.md:45"
```

### STEP 2: Verify Claims (8-12 min)

**Actions:**
1. For each claim:
   a. Read source file at cited line
   b. Verify claim still true
   c. Mark status: VERIFIED / DEGRADED / HALLUCINATED

**Verification criteria:**
- **VERIFIED:** Code matches claim exactly
- **DEGRADED:** Code changed, claim partially true (e.g., function moved to different line)
- **HALLUCINATED:** Code doesn't match claim at all (function doesn't exist, wrong behavior)

**Counter-Check (Method #85):** Sample 10% of claims, re-verify independently

**Output:**
```yaml
verification_results:
  - claim_id: "C-001"
    status: "VERIFIED"
    evidence_check: "Line 23 contains: UserService.createUser(data)"

  - claim_id: "C-087"
    status: "DEGRADED"
    evidence_check: "Function moved to line 31 (was 23)"
    impact: "low" # Citation line number wrong, but function exists

  - claim_id: "C-143"
    status: "HALLUCINATED"
    evidence_check: "No such function at line 45, file doesn't contain 'validateUser'"
    impact: "critical" # False claim
```

### STEP 3: Calculate Degradation Rate (1 min)

```
degradation_rate = (DEGRADED + HALLUCINATED) / total_claims
```

Target: <5% for GATE_4 to pass

---

### STEP 3.5: Entity Completeness Check (3-5 min)

**Actions:** Find entities in knowledge-map NOT in docs (reversed Phantom Hunt):
1. Load `knowledge-map.yaml` → Read `entity_census{}` (from Phase 1 STEP 0)

2. Load `deep-artifacts/entity-log.yaml` → Read documented entity counts per section (produced by Phase 3 STEP 2.3):
   - For each section with entity_expectation="all", read `documented_count` and `documented_entities[]`
   - This is the AUTHORITATIVE source for what was documented (NOT parsing from markdown)
   - **FALLBACK:** If entity-log.yaml does not exist, extract from docs/*.md evidence citations (fragile — pattern: `file.ts:line`, extract entity names from context)

3. For each entity type, calculate orphaned entities:
   ```
   orphaned_classes = census.classes.total - documented_classes.count
   orphaned_functions = census.functions.total - documented_functions.count
   orphaned_tables = census.tables.total - documented_tables.count
   ```

4. Calculate entity coverage:
   ```
   entity_coverage = documented_entities / total_entities

   Example:
   - Census: 120 functions, 12 tables, 45 classes = 177 total
   - Documented: 95 functions, 10 tables, 30 classes = 135 total
   - Coverage: 135 / 177 = 76.3%
   ```

5. Write to `verification-report.yaml`:
   ```yaml
   entity_completeness:
     classes:
       total: 45
       documented: 30
       orphaned: 15
       coverage: 66.7%
       orphaned_list: ["UtilityHelper", "CacheManager", "LogFormatter", ...]

     functions:
       total: 120
       documented: 95
       orphaned: 25
       coverage: 79.2%
       orphaned_list: ["parseConfig", "formatDate", "sanitizeInput", ...]

     tables:
       total: 12
       documented: 10
       orphaned: 2
       coverage: 83.3%
       orphaned_list: ["AuditLog", "SessionStore"]

     overall:
       total_entities: 177
       documented_entities: 135
       orphaned_entities: 42
       entity_coverage: 76.3%
       target: 80.0%
       status: "FAIL"  # Below 80% target
   ```

**Counter-Check (Method #85):**
- Sample 5 orphaned entities
- Verify they exist in repository (not phantom)
- Confirm they're not documented (check all docs/*.md)

---

### STEP 4: Write Verification Report (1 min)

**Output:**
```yaml
version: "8.0.0"
phase: 4
generated_at: "2026-02-12T12:00:00Z"

summary:
  total_claims: 157
  verified: 149
  degraded: 6
  hallucinated: 2
  degradation_rate: 5.1 # (6+2)/157

entity_completeness:  # NEW - from STEP 3.5
  overall:
    total_entities: 177
    documented_entities: 135
    orphaned_entities: 42
    entity_coverage: 76.3%
    target: 80.0%
    status: "FAIL"
  by_type:
    classes: {total: 45, documented: 30, coverage: 66.7%}
    functions: {total: 120, documented: 95, coverage: 79.2%}
    tables: {total: 12, documented: 10, coverage: 83.3%}

claims:
  # ... all claim verification results

counter_check:
  sampled_claims: 16 # 10% of 157
  verified: 16
  status: "PASS"
```

---

## GATE_4 Evaluation

**Conditions:** **[UPDATED - Adds G4-05 for entity coverage]**
1. **G4-01:** All claims verified (verification_results[] covers all claims)
2. **G4-02:** Degradation rate <5% (verified claims ≥95%)
3. **G4-03:** No critical hallucinations (hallucinated claims with impact=critical must be 0)
4. **G4-04:** Counter-check passed (sampled claims verified)
5. **G4-05:** Entity coverage ≥80% (entity_completeness.overall.entity_coverage ≥ 0.80) **[BLOCKER]**

```
IF all 5 conditions pass → GATE_4 = OPEN → User chooses: Complete OR Refinement
IF degradation >5% → Recommend Phase 5 refinement
IF critical hallucinations → MUST fix before completion
IF entity_coverage <80% → BLOCKER: Must document orphaned entities OR declare SCOPE_REDUCTION
```

---

## POST-PHASE CHECKLIST

After completing Phase 4, verify:

- [ ] All claims extracted from docs/*.md
- [ ] All claims verified against source code (VERIFIED/DEGRADED/HALLUCINATED)
- [ ] Degradation rate calculated (<5% target)
- [ ] No critical hallucinations (impact=critical count = 0)
- [ ] Entity completeness checked (entity_coverage ≥80% from entity-log.yaml)
- [ ] Counter-checks passed (10% re-verification, phantom scan, formula check)
- [ ] verification-report.yaml written
- [ ] GATE_4 evaluated (OPEN, all 5 conditions)

**If checklist incomplete → Phase 4 not finished → Re-execute.**

---

## NEXT PHASE

After GATE_4 opens → User choice:
- **Skip refinement** → COMPLETE
- **Refine docs** → Load `steps/step-05-refinement.md`
