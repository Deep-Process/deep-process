---
step: 0
name: "PREPARATION"
time_estimate: "15-20 minutes"
goal: "Understand project structure and documentation template. Declare assumptions about codebase."
requires_completion: true
next_steps: ["step-01-knowledge"]
data_dependencies: []
outputs:
  - artifact: "preparation-report.yaml"
    location: "deep-artifacts/preparation-report.yaml"
    schema: "data/schemas/preparation-report.schema.yaml"
    consumers: ["step-01-knowledge", "step-02-mapping"]
---

# PHASE 0: PREPARATION

## ENFORCED SEQUENCE

### STEP 1: Repository Scan (5 min)

**Actions:**
1. Use Glob tool: `**/*` to enumerate ALL files in repository
2. Categorize files by type:
   - Source code (*.ts, *.js, *.py, *.java, *.go, etc.)
   - Configuration (*.json, *.yaml, *.toml, *.env, etc.)
   - Tests (*test.*, *spec.*, test/, tests/)
   - Documentation (*.md, docs/)
   - Build/Deploy (package.json, Dockerfile, *.tf, etc.)
3. Calculate statistics:
   - Total files
   - Source files count
   - Test files count
   - Primary language (by file count)
4. Identify entry points:
   - Main files (main.ts, index.js, app.py, etc.)
   - Package definitions (package.json, setup.py, go.mod, etc.)
   - **For libraries/SDKs without main:** Use exported modules (index.ts, lib/index.js) as entry points
   - **For IaC projects (CDK, Terraform):** Use stack definitions (bin/*.ts, main.tf) as entry points
   - **For monorepos:** Use each package's entry point
   - **IF no entry points found:** Use most-imported files (files with highest fan-in) as synthetic entry points. Log as assumption: "No explicit entry point, using most-imported files"
5. Write to `preparation-report.yaml` section: `repository_scan{}`

**Output:**
```yaml
repository_scan:
  total_files: 142
  source_files: 87
  test_files: 23
  config_files: 18
  documentation_files: 8
  build_files: 6
  primary_language: "typescript"
  entry_points:
    - "src/index.ts"
    - "src/server.ts"
  scanned_at: "2026-02-12T10:00:00Z"
```

**VIOLATION CHECK:** If agent proceeds without glob scan → CRITICAL (cannot plan without inventory)

---

### STEP 2: Template Analysis — Structure + Semantic Intent (5-8 min)

**Actions:**

**2a. Structural Analysis (2 min)**
1. Read documentation template file provided by user
2. Parse template structure:
   - Extract all section headings (H1, H2, H3)
   - Count total sections
3. Identify required vs optional sections:
   - Required: Sections marked with "REQUIRED" or without placeholders
   - Optional: Sections with `_(To be generated)_` or marked "OPTIONAL"

**2b. Semantic Intent Extraction (2-3 min) [Simplified — only ENTITY_EXPECTATION is critical]**

For EACH section in template, extract semantic intent. **ENTITY_EXPECTATION is the primary dimension** (determines entity coverage). Other dimensions are lightweight guidance.

1. **ENTITY_EXPECTATION** (CRITICAL — drives Phase 1-3 entity coverage):
   - `all`: ALL entities of the relevant type (e.g., "Data Models" → ALL tables/schemas)
   - `primary`: Only primary/core entities (e.g., "Overview" → key concepts only)
   - `selective`: Specific entities based on criteria (e.g., "Security" → auth-related only)
   - `none`: No specific entities (e.g., "Getting Started" → procedural, not entity-based)

2. **PURPOSE** (lightweight — guides writing style):
   - `explain` / `reference` / `guide` / `catalog` / `analyze`

3. **DEPTH** (lightweight — guides word count per entity):
   - `overview` (50-100 words/entity) / `standard` (100-200) / `detailed` (200-400)

**How to extract semantic intent:**
1. Read section title → Assign ENTITY_EXPECTATION first:
   - "API Reference" / "Data Models" / "Configuration" / "Endpoints" → entity_expectation: `all`
   - "Architecture" / "Overview" → entity_expectation: `primary`
   - "Security" / "Testing" → entity_expectation: `selective`
   - "Getting Started" / "Deployment" → entity_expectation: `none`
2. Assign purpose and depth from title (lightweight, no over-analysis):
   - "Overview" → purpose: explain, depth: overview
   - "Data Models" → purpose: catalog, depth: detailed
   - "Deployment" → purpose: guide, depth: standard
3. Read section content/placeholders only if title is ambiguous

**CRITICAL RULE:** If section title contains "Reference", "Models", "Tables", "Endpoints", "Configuration" → entity_expectation MUST be `all`. Agent CANNOT downgrade to `selective` or `primary` without SCOPE_REDUCTION declaration.

4. **REASONING_DECLARATION** (Standard 10 — BINDING): Before assigning entity_expectation to each section, write explicit reasoning:
   ```yaml
   reasoning:
     section: "Data Models"
     assigned: "all"
     because: "Title contains 'Models' → CRITICAL RULE requires entity_expectation='all'"
   ```
   IF agent assigns entity_expectation without reasoning → **PROCESS VIOLATION** → Re-execute STEP 2b.

5. Write to `preparation-report.yaml` section: `template_analysis{}`

**Output:**
```yaml
template_analysis:
  template_path: "templates/technical-documentation.md"
  total_sections: 12
  required_sections: 9
  optional_sections: 3
  section_structure:
    - level: 1
      title: "Project Overview"
      type: "overview"
      required: true
      semantic_intent:
        purpose: "explain"
        depth: "overview"
        audience: "stakeholder"
        entity_expectation: "primary"

    - level: 2
      title: "Architecture"
      type: "architecture"
      required: true
      semantic_intent:
        purpose: "explain"
        depth: "detailed"
        audience: "architect"
        entity_expectation: "all"

    - level: 2
      title: "API Reference"
      type: "api"
      required: true
      semantic_intent:
        purpose: "catalog"
        depth: "detailed"
        audience: "developer"
        entity_expectation: "all"

    - level: 2
      title: "Data Models"
      type: "data"
      required: true
      semantic_intent:
        purpose: "catalog"
        depth: "detailed"
        audience: "developer"
        entity_expectation: "all"

    - level: 2
      title: "Deployment"
      type: "deployment"
      required: true
      semantic_intent:
        purpose: "guide"
        depth: "standard"
        audience: "operator"
        entity_expectation: "selective"
    # ... more sections

  special_instructions:
    - "Technical audience (developers)"
    - "Include code examples for complex concepts"
    - "Link to test files when documenting features"

  semantic_summary:
    sections_requiring_all_entities: 4  # Count of entity_expectation: "all"
    sections_catalog_type: 3            # Count of purpose: "catalog"
    max_depth_required: "detailed"      # Highest depth level across sections
    primary_audience: "developer"       # Most frequent audience

  analyzed_at: "2026-02-12T10:05:00Z"
```

**VIOLATION CHECK:** If agent proceeds without template analysis → CRITICAL (cannot plan documentation without understanding target structure)
**VIOLATION CHECK:** If agent proceeds without semantic_intent on every section → ERROR (Phase 2 mapping will lack intent awareness, leading to shallow documentation)

---

### STEP 2.5: Multi-Domain Detection (5 min) [NEW - V8.1.0]

**Purpose:** Detect project type and apply domain-specific patterns (quality checks, diagram triggers)

**Context:** 87% of real projects are multi-domain (e.g., AWS CDK + Serverless + API Gateway). Single-domain approach loses 40% scope. This step implements V7's multi-domain detection adapted for V8's stateless architecture.

**Actions:**

**2.5a. Load Domain Configuration (1 min)**
1. Read: `data/patterns/domain-config.yaml`
2. Understand structure:
   - **Base domains** (3): iac-agnostic, typescript-library, testing-patterns — auto-applied to ALL projects
   - **Specific domains** (6): aws-cdk, event-driven-serverless, api-gateway, multi-tenant, dynamodb-heavy — detection required
3. Note: Each domain provides `quality` patterns (QP-*) and `diagram_triggers` (DT-*)

**2.5b. Auto-Include Base Domains (30 sec)**
1. FOR each base_domain:
   - IF `auto_apply: true` → include immediately
   - IF `auto_apply_if: <condition>` → evaluate condition:
     - Example: `typescript-library` if `tsconfig.json EXISTS OR package.json contains 'typescript'`
2. Add to `base_domains_included[]`

**2.5c. Detect Specific Domains (2 min)**

FOR each `specific_domain`:

1. **Evaluate ALL detection conditions:**
   ```
   FOR condition in domain.detection.conditions:
     IF condition.type == "file_existence":
       match_score = 1.0 if Glob(pattern) finds file, else 0.0

     IF condition.type == "content_search":
       files_matching = Grep(pattern, output_mode="files_with_matches")
       match_score = match_score_function(count=len(files_matching), threshold=condition.threshold)
       # Example: "min(1.0, count / threshold)"
   ```

2. **Calculate confidence:**
   ```
   confidence = 0.0
   FOR condition in conditions:
     confidence += condition.weight * condition.match_score
   # Example for aws-cdk:
   # C1_cdk_config: weight=0.40, match_score=1.0 (cdk.json exists)
   # C2_cdk_imports: weight=0.35, match_score=1.0 (5 files > threshold 3)
   # C3_cdk_constructs: weight=0.25, match_score=1.0 (3 files > threshold 2)
   # confidence = 0.40*1.0 + 0.35*1.0 + 0.25*1.0 = 1.00
   ```

3. **Apply threshold:**
   ```
   IF confidence >= domain.confidence_threshold:
     detected_domains.append({
       id: domain.id,
       confidence: confidence,
       evidence: [list of files/patterns that matched]
     })
   ```

4. Log ALL domains evaluated (even those below threshold) for transparency

**2.5d. Resolve Dependencies (1 min)**

1. **Transitive closure (Method #159):**
   ```
   queue = [detected_domains]
   final_domains = []

   WHILE queue not empty:
     domain = queue.pop()
     IF domain not in final_domains:
       final_domains.append(domain)
       FOR required_domain in domain.requires:
         IF required_domain not in final_domains:
           queue.append(required_domain)
   ```

2. **Example:**
   - Detected: `aws-cdk` (confidence 1.00)
   - aws-cdk.requires: [iac-agnostic, typescript-library]
   - Auto-include: iac-agnostic, typescript-library → final_domains

3. Add to `domains_auto_included[]`

**2.5e. Collect Active Patterns (30 sec)**

1. **Aggregate provides[] from all final_domains:**
   ```
   active_patterns = {quality: [], diagram_triggers: []}

   FOR domain in (base_domains_included + detected_domains + domains_auto_included):
     active_patterns.quality.extend(domain.provides.quality)
     active_patterns.diagram_triggers.extend(domain.provides.diagram_triggers)

   # Remove duplicates (each pattern should appear once)
   active_patterns.quality = unique(active_patterns.quality)
   active_patterns.diagram_triggers = unique(active_patterns.diagram_triggers)
   ```

2. **Validate:** No phantom patterns (all patterns come from active domains)

**2.5f. Write Detection Results**

Write to `preparation-report.yaml` section: `domain_detection{}`

**Output:**
```yaml
domain_detection:
  # Base domains (auto-applied)
  base_domains_included:
    - id: iac-agnostic
      reason: "auto_apply=true"
    - id: typescript-library
      reason: "tsconfig.json exists"
    - id: testing-patterns
      reason: "auto_apply=true"

  # Specific domains (detected via confidence)
  domains_detected:
    - id: aws-cdk
      confidence: 1.00
      confidence_breakdown:
        C1_cdk_config: {weight: 0.40, match_score: 1.0, evidence: "cdk.json"}
        C2_cdk_imports: {weight: 0.35, match_score: 1.0, evidence: "5 files with @aws-cdk/ imports"}
        C3_cdk_constructs: {weight: 0.25, match_score: 1.0, evidence: "3 files with 'extends Construct'"}
      evidence:
        - "cdk.json"
        - "src/stack-resources/index.ts (import @aws-cdk)"
        - "src/constructs/table/index.ts (extends Construct)"

    - id: event-driven-serverless
      confidence: 0.90
      confidence_breakdown:
        C1_lambda: {weight: 0.40, match_score: 1.0, evidence: "0 Lambda definitions (CDK project)"}
        C2_events: {weight: 0.35, match_score: 1.0, evidence: "SNS topics found"}
        C3_dynamodb: {weight: 0.25, match_score: 1.0, evidence: "39 DynamoDB tables"}
      evidence:
        - "src/stack-resources/sns-topics.ts (65 SNS topics)"
        - "src/stack-resources/db-tables.ts (39 DynamoDB tables)"

    - id: dynamodb-heavy
      confidence: 1.00
      confidence_breakdown:
        C1_table_count: {weight: 0.60, match_score: 1.0, evidence: "39 tables > threshold 10"}
        C2_gsi_usage: {weight: 0.40, match_score: 1.0, evidence: "25 GSIs > threshold 5"}
      evidence:
        - "src/stack-resources/db-tables.ts (39 tables, 25 GSIs)"

  # Domains below threshold (not included)
  domains_below_threshold:
    - id: api-gateway
      confidence: 0.35
      reason: "No API Gateway resources found (threshold 0.70)"
    - id: multi-tenant
      confidence: 0.60
      reason: "Some tenant references but below threshold 0.75"

  # Auto-included via dependency resolution
  domains_auto_included: []
  # (iac-agnostic, typescript-library already in base_domains_included)

  # Final active domains
  final_domains:
    - iac-agnostic
    - typescript-library
    - testing-patterns
    - aws-cdk
    - event-driven-serverless
    - dynamodb-heavy

  # Active patterns available for use in Phase 2-3
  active_patterns:
    quality:
      - QP-DTAP-CONFIGURATION
      - QP-PARAMETER-STORE
      - QP-ENVIRONMENT-SEPARATION
      - QP-TYPE-SAFETY
      - QP-DEPENDENCY-MANAGEMENT
      - QP-BUILD-CONFIG
      - QP-TEST-COVERAGE
      - QP-CI-PIPELINE
      - QP-TEST-STRUCTURE
      - QP-CDK-CUSTOM-CONSTRUCTS
      - QP-CONDITIONAL-CFN
      - QP-CDK-OUTPUT-EXPORTS
      - QP-EVENT-LOGGING
      - QP-DLQ-ERROR-HANDLING
      - QP-LAMBDA-INVENTORY
      - QP-DYNAMODB-SCHEMA
      - QP-GSI-PATTERNS
      - QP-DYNAMODB-CAPACITY

    diagram_triggers:
      - DT-DEPLOYMENT-PIPELINE
      - DT-ENVIRONMENT-DIAGRAM
      - DT-MODULE-STRUCTURE
      - DT-DEPENDENCY-GRAPH
      - DT-TEST-HIERARCHY
      - DT-CDK-STACK
      - DT-CDK-CONSTRUCT-TREE
      - DT-EVENT-FLOW
      - DT-LAMBDA-INVENTORY
      - DT-SNS-TAXONOMY
      - DT-DYNAMODB-SCHEMA
      - DT-GSI-STRUCTURE

  detected_at: "2026-02-13T10:07:00Z"
```

**Counter-Checks (Method #85, #159, #84):**

**CC1: Grounding Check (Method #85)** — Verify detection evidence exists
```
Sample 3 random detected domains (aws-cdk, event-driven-serverless, dynamodb-heavy)
FOR each:
  Verify detection evidence files/patterns exist in repository
  Example: aws-cdk → verify cdk.json exists, verify 5 files with @aws-cdk/ imports

PASS if all 3 samples have valid evidence
FAIL (BLOCKER) if >30% evidence is hallucinated → Re-scan repository
```

**CC2: Dependency Closure (Method #159)** — Verify transitive dependencies complete
```
Re-compute dependency closure independently:
  Start from detected_domains
  Follow requires[] edges using BFS
  Compare result with final_domains

PASS if no missing dependencies
FAIL (CRITICAL) if final_domains missing required domains → Add to final_domains
```

**CC3: Pattern Coherence (Method #84)** — Verify no phantom patterns
```
Count patterns in active_patterns{}
Count union of provides[] from final_domains

PASS if pattern_count == sum(provides[] from final_domains)
FAIL (ERROR) if phantom patterns found → Remove from active_patterns
```

**VIOLATION CHECK:** If agent proceeds without domain detection → ERROR (loses 40% scope on 87% of projects)
**VIOLATION CHECK:** If agent uses patterns not in active_patterns → CRITICAL (phantom pattern usage, prevents by GATE_2 G2-09)

**Usage in Later Phases:**
- **Phase 2 (Mapping):** Read `active_patterns{}` to suggest diagram types (DT-*) and quality checks (QP-*)
- **Phase 3 (Documentation):** Apply quality patterns from `active_patterns.quality[]` when writing sections

---

### STEP 3: ASSUMPTIONS_DECLARED (3 min)

**Actions:**
1. Declare assumptions in 3 layers:
   - **Surface assumptions:** Explicit decisions you're making
   - **Inherited assumptions:** From template or user instructions
   - **Invisible assumptions:** Default behaviors you're applying
2. For each assumption:
   - State the assumption clearly
   - Provide justification (why making this assumption)
   - Define falsification criteria (what evidence would prove it wrong)
   - Assign confidence level (high/medium/low)
3. Write to `preparation-report.yaml` section: `assumptions[]`

**Output:**
```yaml
assumptions:
  - id: "A-001"
    layer: "surface"
    assumption: "Primary language is TypeScript based on file count"
    justification: "87 of 142 files are *.ts, next highest is *.json (18 files)"
    falsification: "If package.json specifies different language or if *.ts are generated files"
    confidence: "high"

  - id: "A-002"
    layer: "surface"
    assumption: "Project uses Express.js framework"
    justification: "package.json lists express as dependency"
    falsification: "If express is dev dependency only or unused in source"
    confidence: "medium"

  - id: "A-003"
    layer: "inherited"
    assumption: "Documentation targets developers (not end users)"
    justification: "Template has 'API Reference' section, implies technical audience"
    falsification: "If user specifies different audience later"
    confidence: "high"

  - id: "A-004"
    layer: "invisible"
    assumption: "Test files correlate with tested functionality"
    justification: "Standard practice: test files document what's tested"
    falsification: "If tests are mocks or stubs without actual coverage"
    confidence: "medium"

  - id: "A-005"
    layer: "invisible"
    assumption: "Configuration files affect runtime behavior"
    justification: "Config files typically change behavior per environment"
    falsification: "If config files are templates or examples only"
    confidence: "high"
```

**VIOLATION CHECK:** If agent proceeds without declaring assumptions → ERROR (Method #78 requires explicit assumptions)

---

### STEP 4: Knowledge Area Identification (2-3 min)

**Actions:**
1. Based on repository scan + template analysis + assumptions, identify knowledge areas:
   - **Execution flows:** Needed if template has "How it works" or "Architecture" sections
   - **Data flows:** Needed if template has "Data Models" or "API" sections
   - **Control flows:** Needed if template has "Business Logic" or "Decision Points" sections
   - **Test coverage:** Needed if template requires "Quality" or "Testing" sections
   - **Configuration:** Needed if template has "Deployment" or "Configuration" sections
2. Prioritize knowledge areas (critical/important/optional):
   - Critical: Required to satisfy template required sections
   - Important: Improves documentation quality
   - Optional: Nice-to-have context
3. Write to `preparation-report.yaml` section: `knowledge_areas[]`

**Output:**
```yaml
knowledge_areas:
  - area: "execution_flows"
    priority: "critical"
    justification: "Template requires 'Architecture' and 'How it Works' sections"
    template_sections: ["Architecture", "How it Works"]

  - area: "data_flows"
    priority: "critical"
    justification: "Template requires 'Data Models' and 'API Reference'"
    template_sections: ["Data Models", "API Reference"]

  - area: "control_flows"
    priority: "important"
    justification: "Template has 'Business Logic' section"
    template_sections: ["Business Logic"]

  - area: "test_coverage"
    priority: "important"
    justification: "Template has 'Quality Assurance' section"
    template_sections: ["Quality Assurance"]

  - area: "configuration"
    priority: "critical"
    justification: "Template requires 'Deployment' section"
    template_sections: ["Deployment", "Configuration"]
```

**VIOLATION CHECK:** If agent proceeds without identifying knowledge areas → ERROR (Phase 1 won't know what to extract)

---

### STEP 5: Write Preparation Report (1 min)

**Actions:**
1. Use Write tool to create `deep-artifacts/preparation-report.yaml`
2. Include all 4 sections: repository_scan, template_analysis, assumptions, knowledge_areas
3. Add metadata: version, phase, timestamp

**Output Schema:**
```yaml
version: "8.0.0"
phase: 0
phase_name: "PREPARATION"
generated_at: "2026-02-12T10:20:00Z"

repository_scan:
  # ... from STEP 1

template_analysis:
  # ... from STEP 2

assumptions:
  # ... from STEP 3

knowledge_areas:
  # ... from STEP 4
```

---

### STEP 6: GATE_0 Evaluation

**Gate:** GATE_0 (PREPARATION COMPLETE)
**Severity:** CRITICAL (blocks Phase 1 if fails)

**Conditions:**
1. **G0-01:** Repository scan completed (repository_scan{} exists, total_files > 0)
2. **G0-02:** Template analyzed (template_analysis{} exists, total_sections > 0)
3. **G0-03:** Assumptions declared (assumptions[] has ≥3 entries covering all 3 layers)
4. **G0-04:** Knowledge areas identified (knowledge_areas[] has ≥3 entries)
5. **G0-05:** All outputs written (preparation-report.yaml exists and valid YAML)
6. **G0-06:** Semantic intent extracted (EVERY section in section_structure[] has semantic_intent{} with purpose, depth, audience, entity_expectation) **[CRITICAL]**
7. **G0-07:** Entity expectation coherence (sections with title containing "Reference"/"Models"/"Tables"/"Endpoints"/"Configuration" have entity_expectation = "all", unless SCOPE_REDUCTION declared) **[BLOCKER]**

**Evaluation:**
```
IF all 7 conditions pass → GATE_0 = OPEN → Proceed to Phase 1
IF G0-07 fails → GATE_0 = LOCKED (BLOCKER) → Must fix entity_expectation or declare SCOPE_REDUCTION
IF G0-06 fails → GATE_0 = LOCKED (CRITICAL) → Must add semantic_intent to all sections
IF any other condition fails → GATE_0 = LOCKED → SCOPE_REDUCTION_DECLARATION or ABORT
```

**Counter-Checks (Method #85 Grounding Check):**
1. Sample 3 random files from repository_scan.total_files → Verify they exist (not hallucinated)
2. Sample 3 random sections from template_analysis.section_structure → Verify they exist in template
3. Sample 3 assumptions → Verify each has falsification criteria (not unfalsifiable claims)
4. Sample 3 sections with entity_expectation="all" → Verify title/content justifies exhaustive enumeration (not agent convenience downgrade)

**Output:** Log gate evaluation result in `preparation-report.yaml`:
```yaml
gate_evaluation:
  gate: "GATE_0"
  status: "OPEN" # or "LOCKED"
  conditions:
    - id: "G0-01"
      status: "PASS"
      evidence: "repository_scan exists, 142 files"
    - id: "G0-02"
      status: "PASS"
      evidence: "template_analysis exists, 12 sections"
    # ... all 5 conditions
  counter_checks:
    - check: "Sample 3 files"
      status: "PASS"
      evidence: "src/index.ts, src/server.ts, package.json all exist"
    # ... 3 counter-checks
  evaluated_at: "2026-02-12T10:20:00Z"
```

---

## POST-PHASE CHECKLIST

After completing Phase 0, verify:

- [ ] Repository scanned (all files enumerated)
- [ ] Template analyzed (structure understood)
- [ ] Semantic intent extracted (PURPOSE, DEPTH, AUDIENCE, ENTITY_EXPECTATION for every section)
- [ ] Entity expectation coherence verified (catalog sections have entity_expectation="all")
- [ ] Assumptions declared (≥3, all 3 layers)
- [ ] Knowledge areas identified (≥3, prioritized)
- [ ] preparation-report.yaml written
- [ ] GATE_0 evaluated (OPEN, all 7 conditions)
- [ ] Counter-checks passed (4/4)

**If checklist incomplete → Phase 0 not finished → Re-execute.**

---

## NEXT PHASE

After GATE_0 opens → Load `steps/step-01-knowledge.md` → Begin Phase 1 (KNOWLEDGE EXTRACTION)
