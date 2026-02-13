---
step: 1
name: "KNOWLEDGE EXTRACTION"
time_estimate: "30-90 minutes (depends on project size)"
goal: "Extract deep code understanding: execution flows, data flows, control flows, test coverage, configuration impact."
requires_completion: true
next_steps: ["step-02-mapping"]
data_dependencies:
  - "preparation-report.yaml"
outputs:
  - artifact: "knowledge-map.yaml"
    location: "deep-artifacts/knowledge-map.yaml"
    schema: "data/schemas/knowledge-map.schema.yaml"
    consumers: ["step-02-mapping", "step-03-documentation", "step-04-verification"]
---

# PHASE 1: KNOWLEDGE EXTRACTION

## ENFORCED SEQUENCE

Extract 5 types of knowledge in order (some depend on previous):

0. **Entity Baseline Census** (3-5 min) - COUNT all entities BEFORE extraction (Method #167)
1. **Execution Flow Analysis** (6-8 min) - How does code RUN?
2. **Data Flow Analysis** (5-7 min) - How does information FLOW?
3. **Control Flow Analysis** (4-6 min) - What DECISIONS are made?
4. **Test Coverage Analysis** (3-5 min) - What's TESTED vs UNTESTED?
5. **Configuration Impact Analysis** (2-4 min) - How does CONFIG change behavior?

---

### STEP 0: Entity Baseline Census (3-5 min)

COUNT → EXTRACT → VERIFY pattern: Establish baseline count of all entities BEFORE extraction.

**Actions:**
1. Scan repository for all entity types using Glob + Grep:

   a. **Classes:**
      ```bash
      Glob "**/*.ts" "**/*.js" "**/*.py"
      Grep "^class " → Count N_classes
      ```

   b. **Functions:**
      ```bash
      Glob "**/*.ts" "**/*.js" "**/*.py"
      Grep "^function |^def " → Count N_functions
      ```

   c. **Tables/Schemas:**
      ```bash
      Glob "**/schema/*.ts" "**/models/*.ts" "**/db/*.ts" "**/migrations/*.sql"
      Grep "CREATE TABLE|table(|Schema({" → Count N_tables
      ```

   d. **API Endpoints:**
      ```bash
      Glob "**/routes/*.ts" "**/controllers/*.ts"
      Grep "app\.(get|post|put|delete)|@(Get|Post|Put|Delete)" → Count N_endpoints
      ```

2. Write census to `knowledge-map.yaml` (at top, before other sections):
   ```yaml
   entity_census:
     scanned_at: "2026-02-12T10:30:00Z"
     scan_method: "Glob + Grep pattern matching"
     entities:
       classes:
         total: 45
         locations: ["src/models/", "src/services/", "src/controllers/"]
       functions:
         total: 120
         locations: ["src/utils/", "src/helpers/", "src/lib/"]
       tables:
         total: 12
         locations: ["src/schema/", "migrations/"]
       api_endpoints:
         total: 38
         locations: ["src/routes/", "src/api/"]
     extraction_targets:
       execution_flows_target: 96  # 80% of 120 functions
       data_flows_target: 10        # 80% of 12 tables
       control_flows_target: 30     # 80% of ~38 decision points
   ```

3. Set extraction targets (80% coverage):
   - execution_flows_target = N_functions × 0.80
   - data_flows_target = N_tables × 0.80
   - api_endpoints_target = N_endpoints × 0.80

4. **Classify priority entities** (anti-gaming — Method #59 CUI BONO):
   ```yaml
   priority_entities:
     # PRIORITY = MUST document (100% required, no exceptions)
     priority:
       - type: "entry_points"
         source: "preparation-report.yaml repository_scan.entry_points[]"
         items: ["bin/stack-resources.ts", "src/server.ts"]
       - type: "auth_functions"
         pattern: "auth|login|token|session|permission|role"
         items: ["AuthMiddleware", "validateToken", "checkPermission"]
       - type: "error_handlers"
         pattern: "error|exception|catch|fallback|retry"
         items: ["GlobalErrorHandler", "retryWithBackoff"]
       - type: "core_domain_entities"
         pattern: "most imported/referenced classes or schemas"
         items: ["User", "Product", "Order"]

     # STANDARD = should document (80% target)
     standard:
       - all remaining classes, functions, tables

     # SKIPPED = explicitly excluded with justification
     skipped: []
       # Each skipped entity MUST have:
       # - entity_name: "formatDate"
       # - reason: "stdlib wrapper, no business logic"
       # - impact: "low - used in 2 places, trivial implementation"
   ```

   **Anti-Gaming Rules:**
   - Agent CANNOT skip priority entities (100% coverage required)
   - Agent CAN skip standard entities up to 20% (80% coverage)
   - Every skipped entity requires `reason` + `impact` classification
   - Skipping >5 entities without justification → GATE_1 LOCKED

   **REASONING_DECLARATION** (Standard 10 — BINDING): For each skipped entity, write:
   ```yaml
   skip_reasoning:
     entity: "formatDate"
     classification: "standard"
     reason: "stdlib wrapper, no business logic"
     impact: "low — used in 2 places, trivial implementation"
   ```
   IF agent skips entity without skip_reasoning → **PROCESS VIOLATION** → Re-execute STEP 0.

**Output:** `entity_census{}` + `priority_entities{}` in knowledge-map.yaml.

---

### STEP 1: Execution Flow Analysis (6-8 min)

**Actions:** Trace call graphs from entry points:
1. Load `preparation-report.yaml` → Read `repository_scan.entry_points[]`
2. For each entry point (e.g., main.ts, server.ts):
   a. Read the file with Read tool
   b. Identify exported functions/classes (entry points for consumers)
   c. Trace execution path: What does this function call?
   d. Build call tree (depth 3-4 levels, or until reaching stdlib/framework)
   e. Annotate with purpose (what is this execution achieving?)
3. Identify critical paths:
   - **Happy path:** Normal execution without errors
   - **Error paths:** Exception handling, fallbacks
   - **Edge cases:** Rare conditions
4. Extract patterns:
   - Request-response cycles (web servers)
   - Event loops (async systems)
   - Batch processing (data pipelines)
   - State machines (workflow systems)
5. Write to `knowledge-map.yaml` section: `execution_flows[]`

**Output:** Write to `knowledge-map.yaml` section `execution_flows[]`:
```yaml
execution_flows:
  - flow_id: "F-001"         # Unique ID
    entry_point: "file:line"  # Source entry point
    trigger: "event/request"  # What triggers this flow
    purpose: "description"    # What flow achieves
    call_sequence:            # Ordered function calls
      - step: 1
        function: "Class.method(args)"
        file: "src/path/file.ts"
        line: 23
    path_type: "happy_path|error|edge_case"
    error_handling:           # Error conditions + handlers
      - condition: "what fails"
        handler: "how handled"
```

**Counter-Check (Method #85):** Sample 3 random functions from call_sequence → Read source files → Verify function exists at specified line

**VIOLATION CHECK:** If agent skips execution flow analysis → ERROR (cannot document "how it works" without understanding execution)

---

### STEP 2: Data Flow Analysis (5-7 min)

**Actions:** Trace data transformations through system:
1. Identify data entry points:
   - HTTP request bodies
   - Database reads
   - File inputs
   - External API responses
2. Trace data transformations:
   a. **Input stage:** What shape does data arrive? (raw JSON, form data, etc.)
   b. **Validation stage:** What checks are applied? (schema validation, business rules)
   c. **Domain stage:** How is data represented in business logic? (domain models, DTOs)
   d. **Persistence stage:** How is data stored? (database schema, serialization)
   e. **Output stage:** How is data returned? (response serialization, formatting)
3. Extract schemas at each stage:
   - TypeScript interfaces
   - Database table definitions
   - API request/response schemas
4. Identify data stores:
   - Databases (PostgreSQL, MongoDB, etc.)
   - Caches (Redis, Memcached)
   - File systems
   - External services
5. Write to `knowledge-map.yaml` section: `data_flows[]`

**Output:** Write to `knowledge-map.yaml` section `data_flows[]`:
```yaml
data_flows:
  - flow_id: "D-001"         # Unique ID
    data_entity: "Entity"     # What data entity
    entry_point: "source"     # Where data enters
    stages:                   # Data transformation pipeline
      - stage: "input|validation|domain|persistence|output"
        format: "JSON|class|row"
        schema: {}            # Properties at this stage
        location: "file:line"
    transformations:          # Between-stage changes
      - from: "stage_a"
        to: "stage_b"
        operation: "what changes"
        location: "file:line"
```

**Counter-Check (Method #85):** Sample 3 schemas → Read source → Verify properties match

**VIOLATION CHECK:** If agent skips data flow analysis → ERROR (cannot document data models without understanding transformations)

---

### STEP 3: Control Flow Analysis (4-6 min)

**Actions:** Extract decision points and business rules:
1. Scan source files for decision points:
   - `if` / `else` statements
   - `switch` / `case` statements
   - Ternary operators (`condition ? a : b`)
   - Guard clauses
   - Error handling (`try`/`catch`)
2. For each decision point:
   a. Extract condition (what's being checked?)
   b. Extract branches (what happens in each case?)
   c. Identify business rules (why does this condition matter?)
   d. Link to execution flows (where in F-001 does this appear?)
3. Categorize decisions:
   - **Authorization:** Who can do what?
   - **Validation:** Is data acceptable?
   - **Business logic:** Application-specific rules
   - **Error handling:** What happens when things fail?
4. Write to `knowledge-map.yaml` section: `control_flows[]`

**Output:** Write to `knowledge-map.yaml` section `control_flows[]`:
```yaml
control_flows:
  - decision_id: "C-001"      # Unique ID
    location: "file:line"      # Source location
    execution_flow: "F-001"    # Links to execution flow
    condition: "expression"    # What's checked
    branches:                  # Possible outcomes
      - condition_result: true
        action: "what happens"
      - condition_result: false
        action: "what happens"
    business_rule: "why"       # Business justification
    category: "authorization|validation|business_logic|error_handling"
```

**Counter-Check (Method #85):** Sample 3 decisions → Read source → Verify condition exists at line

**VIOLATION CHECK:** If agent skips control flow analysis → WARNING (documentation will lack decision rationale)

---

### STEP 4: Test Coverage Analysis (3-5 min)

**Actions:** Scan test files and map coverage:
1. Load `preparation-report.yaml` → Read `repository_scan.test_files[]`
2. For each test file:
   a. Read file with Read tool
   b. Identify test cases (describe(), it(), test())
   c. Extract what's being tested (function name, scenario)
   d. Classify test type (unit, integration, e2e)
3. Map tests to source files:
   - Test file `UserService.test.ts` → Source file `UserService.ts`
   - Extract coverage: which functions have tests? which don't?
4. Calculate coverage by category:
   - Happy paths: % of execution flows with tests
   - Error handling: % of error paths with tests
   - Edge cases: % of boundary conditions with tests
5. Identify untested areas (critical for documentation - highlight risk)
6. Write to `knowledge-map.yaml` section: `test_coverage[]`

**Output:** Write to `knowledge-map.yaml` section `test_coverage[]`:
```yaml
test_coverage:
  - source_file: "src/path/file.ts"
    test_file: "tests/path/file.test.ts"
    coverage_summary:
      total_functions: 8
      tested_functions: 7
      untested_functions: 1
      coverage_percentage: 87.5
    tested_scenarios:
      - function: "functionName"
        scenarios: ["scenario1", "scenario2"]
        test_type: "unit|integration|e2e"
        test_location: "file:lines"
    untested_functions:
      - function: "functionName"
        reason: "why untested"
        risk: "high|medium|low"
  overall_coverage:
    happy_path_coverage: 95    # % execution flows with tests
    error_handling_coverage: 30 # % error paths with tests
    edge_case_coverage: 10     # % boundary conditions with tests
```

**Counter-Check (Method #85):** Sample 3 test files → Verify they exist and contain test cases

**VIOLATION CHECK:** If agent skips test coverage → WARNING (documentation won't highlight quality gaps)

---

### STEP 5: Configuration Impact Analysis (2-4 min)

**Actions:** Parse config files and map environment-specific behavior:
1. Load `preparation-report.yaml` → Read `repository_scan.config_files[]`
2. For each config file:
   a. Read file with Read tool
   b. Parse configuration variables
   c. Identify environment-specific overrides (dev, staging, prod)
   d. Extract impact: how does this config affect behavior?
3. Common config patterns to look for:
   - Database connection strings (different per environment)
   - Feature flags (enable/disable features)
   - Logging levels (verbose in dev, structured in prod)
   - API endpoints (different services per environment)
   - Cache settings (disabled in dev, enabled in prod)
   - Security settings (relaxed in dev, strict in prod)
4. Map config to code impact:
   - Which source files read this config?
   - What behavior changes based on config value?
5. Write to `knowledge-map.yaml` section: `configuration_impact[]`

**Output:** Write to `knowledge-map.yaml` section `configuration_impact[]`:
```yaml
configuration_impact:
  - config_file: "config/file.json"
    variables:
      - name: "VARIABLE_NAME"
        values:
          development: "dev_value"
          production: "prod_value"
        impact: "what changes between environments"
        affected_files: ["src/path/file.ts"]
        behavior_change: "observable difference"
```

**Counter-Check (Method #85):** Sample 3 config files → Verify they exist and contain variables

**VIOLATION CHECK:** If agent skips config analysis → WARNING (deployment docs will be incomplete)

---

### STEP 6: Write Knowledge Map (2-5 min)

**Actions:**

**INCREMENTAL CONSTRUCTION** (prevents token overflow for large projects):

For projects with >50 files OR >20 entities:
1. **Write skeleton** with Write tool: metadata + `entity_census{}` + `priority_entities{}` + empty sections
2. **Add execution_flows[]** with Edit tool (batch: 5-10 flows per Edit call)
3. **Add data_flows[]** with Edit tool (batch: 3-5 flows per Edit)
4. **Add control_flows[]** with Edit tool (batch: 5-10 decisions per Edit)
5. **Add test_coverage[]** with Edit tool (batch: 3-5 files per Edit)
6. **Add configuration_impact[]** with Edit tool (batch: 3-5 configs per Edit)
7. **Add gate_evaluation{}** with Edit tool
8. **Verify** with Read tool: confirm all sections present

For small projects (<50 files AND <20 entities):
1. Use Write tool to create `deep-artifacts/knowledge-map.yaml` in single call
2. Include all sections: entity_census, priority_entities, execution_flows, data_flows, control_flows, test_coverage, configuration_impact
3. Add metadata: version, phase, timestamp

**Output Schema:**
```yaml
version: "8.0.0"
phase: 1
phase_name: "KNOWLEDGE EXTRACTION"
generated_at: "2026-02-12T10:50:00Z"

execution_flows:
  # ... from STEP 1

data_flows:
  # ... from STEP 2

control_flows:
  # ... from STEP 3

test_coverage:
  # ... from STEP 4

configuration_impact:
  # ... from STEP 5
```

---

### STEP 7: GATE_1 Evaluation

**Gate:** GATE_1 (KNOWLEDGE EXTRACTION COMPLETE)
**Severity:** CRITICAL (blocks Phase 2 if fails)

**Conditions:** **[UPDATED - Fixes F-001, F-003, GAP-1]**
1. **G1-01:** Execution flow coverage ≥80% (execution_flows.count / entity_census.functions ≥ 0.80)
2. **G1-02:** Data flow coverage ≥80% (data_flows.count / entity_census.tables ≥ 0.80)
3. **G1-03:** Control flow coverage ≥70% (control_flows.count / entity_census.decisions ≥ 0.70)
4. **G1-04:** Test coverage analyzed (test_coverage[] exists, overall_coverage calculated)
5. **G1-05:** Configuration analyzed (configuration_impact[] exists, environment differences documented)
6. **G1-06:** Entity census complete (entity_census.scanned_at exists, all 4 entity types counted)
7. **G1-07:** All outputs written (knowledge-map.yaml exists and valid YAML)
8. **G1-08:** Priority entity coverage = 100% (ALL priority_entities.priority[] extracted, 0 skipped) **[BLOCKER]**
9. **G1-09:** Skipped entities justified (every priority_entities.skipped[] has reason + impact) **[CRITICAL]**

**Coverage Calculation Examples:**
- Repository has 120 functions → target 96 flows (80%) → extracted 100 flows → 100/120 = 83% → PASS ✓
- Repository has 12 tables → target 10 flows (80%) → extracted 5 flows → 5/12 = 42% → FAIL ✗ (need 5 more)
- Repository has 45 decisions → target 32 (70%) → extracted 35 → 35/45 = 78% → PASS ✓

**Evaluation:**
```
IF all 9 conditions pass → GATE_1 = OPEN → Proceed to Phase 2
IF G1-08 fails → GATE_1 = LOCKED (BLOCKER) → Must extract missing priority entities
IF any other condition fails → GATE_1 = LOCKED → SCOPE_REDUCTION_DECLARATION or ABORT
```

**Counter-Checks (Method #85 Grounding Check):**
1. Sample 3 execution flows → Read source files → Verify call sequence exists
2. Sample 3 data transformations → Read source → Verify transformation logic exists
3. Sample 3 test files → Verify they exist and test claimed functions

**Output:** Log gate evaluation result in `knowledge-map.yaml`:
```yaml
gate_evaluation:
  gate: "GATE_1"
  status: "OPEN"
  conditions:
    - id: "G1-01"
      status: "PASS"
      evidence: "execution_flows has 5 flows (F-001 to F-005)"
    - id: "G1-02"
      status: "PASS"
      evidence: "data_flows has 3 flows (User, Product, Order)"
    # ... all 7 conditions
  counter_checks:
    - check: "Sample 3 execution flows"
      status: "PASS"
      samples: ["F-001 verified", "F-002 verified", "F-003 verified"]
    - check: "Sample 3 data transformations"
      status: "PASS"
      samples: ["D-001 stage 3 verified", "D-002 stage 2 verified", "D-003 stage 4 verified"]
    - check: "Sample 3 test files"
      status: "PASS"
      samples: ["UserService.test.ts exists", "ProductService.test.ts exists", "OrderService.test.ts exists"]
  evaluated_at: "2026-02-12T10:50:00Z"
```

---

## POST-PHASE CHECKLIST

After completing Phase 1, verify:

- [ ] Entity census complete (all entity types counted)
- [ ] Priority entities classified (entry points, auth, error handlers, core domain)
- [ ] Execution flows extracted (≥80% of entity_census.functions)
- [ ] Data flows extracted (≥80% of entity_census.tables)
- [ ] Control flows extracted (≥70% of entity_census.decisions)
- [ ] Priority entities 100% extracted (0 priority skipped)
- [ ] Skipped entities justified (reason + impact for each)
- [ ] Test coverage analyzed (files mapped, coverage calculated)
- [ ] Configuration impact analyzed (environment differences documented)
- [ ] knowledge-map.yaml written
- [ ] GATE_1 evaluated (OPEN, all 9 conditions)
- [ ] Counter-checks passed (3/3)

**If checklist incomplete → Phase 1 not finished → Re-execute.**

---

## USER CHECKPOINT (Rule E-06 — BINDING)

After GATE_1 opens, BEFORE loading step-02:
1. Present knowledge-map summary to user: entity_census counts, extraction coverage per type, priority entity status, skipped entities list
2. Wait for user confirmation
3. IF user rejects → Re-execute flagged steps
4. IF user approves → Proceed to Phase 2

Skipping user checkpoint = **PROCESS VIOLATION** → ABORT.

---

## NEXT PHASE

After user checkpoint passes → Load `steps/step-02-mapping.md` → Begin Phase 2 (TEMPLATE MAPPING)
