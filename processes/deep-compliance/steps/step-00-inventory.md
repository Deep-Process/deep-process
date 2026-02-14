# STEP 0: INVENTORY — System Discovery and Documentation Collection

**Phase:** 0 - Grounding
**Purpose:** Collect comprehensive inventory of AI systems, capabilities, and documentation
**Methods Used:** None (manual collection + optional Method #332 for classification)
**Output:** System inventory with metadata for compliance assessment

---

## ENFORCED SEQUENCE

```
1. IDENTIFY_SYSTEMS → List all AI systems in scope
2. COLLECT_CAPABILITIES → Document what each system does
3. GATHER_DOCUMENTATION → Find existing docs, code, tests
4. CLASSIFY_RISK → Determine if system is "high-risk" per EU AI Act
5. EVALUATE_GATE_0 → Check if inventory is sufficient to proceed
```

**DO NOT proceed to Step 1 until GATE_0 = OPEN**

---

## 1. IDENTIFY_SYSTEMS

**Goal:** Create list of all AI systems that need compliance assessment

**Questions to ask user:**
```
1. What AI systems are you deploying/operating?
2. Which systems process EU citizen data or operate in EU?
3. Are there systems in development that need assessment?
4. Any third-party AI services you use?
```

**System inventory template:**
```yaml
systems:
  - system_id: "CS-AI-001"
    name: "CustomerSupport-AI-Chatbot"
    description: "AI chatbot for customer support inquiries"
    status: "production"  # or: development, pilot, deprecated
    deployment_regions: ["EU", "US"]
    user_facing: true
    processes_personal_data: true
    business_owner: "customer-success@company.com"
    technical_owner: "ml-team@company.com"
```

**Minimum required:** At least 1 system

**Fast-track mode:** Accept system name + description only

---

## 2. COLLECT_CAPABILITIES

**Goal:** Document what each AI system does (features, use cases, decisions it makes)

**For each system, collect:**

### a) Core Capabilities
```yaml
capabilities:
  - "Answers customer questions using natural language"
  - "Routes conversations to human agents when needed"
  - "Suggests knowledge base articles"
  - "Analyzes sentiment to detect frustrated customers"
```

**Required:** At least 3-5 capabilities per system

### b) AI/ML Components
```yaml
ai_components:
  - type: "Large Language Model"
    model: "GPT-4"
    provider: "OpenAI API"
    fine_tuned: false

  - type: "Sentiment Classifier"
    model: "Custom RoBERTa"
    training_data: "10K labeled support conversations"
    accuracy: "92%"
```

### c) Decisions Made
```yaml
decisions:
  - decision: "Route to human agent"
    impact: "Customer experience, support cost"
    human_override: true

  - decision: "Suggest knowledge article"
    impact: "Customer satisfaction"
    human_override: false
```

**Critical for compliance:** What decisions does AI make autonomously?

---

## 3. GATHER_DOCUMENTATION

**Goal:** Find all existing documentation, code, and tests

### a) Documentation Inventory
```yaml
documentation:
  - type: "Architecture Docs"
    location: "docs/architecture/chatbot-design.md"
    last_updated: "2026-01-15"

  - type: "API Documentation"
    location: "docs/api/chatbot-api-spec.yaml"
    last_updated: "2026-02-01"

  - type: "Data Governance"
    location: "docs/governance/data-policy.md"
    last_updated: "2025-10-20"
    stale: true  # >3 months old
```

### b) Code References
```yaml
code_repositories:
  - repo: "github.com/company/chatbot-backend"
    key_files:
      - "src/models/llm_wrapper.py"  # LLM integration
      - "src/routing/escalation_logic.py"  # Human routing
      - "src/safety/content_filter.py"  # Safety guardrails

  - repo: "github.com/company/chatbot-training"
    key_files:
      - "notebooks/sentiment_model_training.ipynb"
      - "data/training_data_stats.md"
```

### c) Testing Artifacts
```yaml
testing:
  - type: "Unit Tests"
    location: "tests/unit/"
    coverage: "85%"

  - type: "Integration Tests"
    location: "tests/integration/"
    coverage: "70%"

  - type: "Bias Testing"
    location: "tests/fairness/bias_analysis.ipynb"
    status: "exists"  # Good sign for compliance
```

**Minimum required:** At least 1 documentation file OR 1 code repository

**Fast-track mode:** Optional - can skip detailed documentation collection

---

## 4. CLASSIFY_RISK

**Goal:** Determine if system is "high-risk" per EU AI Act Annex III

**EU AI Act High-Risk Categories (Annex III):**

1. Biometric identification and categorization
2. Management of critical infrastructure
3. Education and vocational training (access/admissions)
4. Employment, workers management, and self-employment (recruitment, promotions, termination)
5. Access to essential services (credit, insurance, emergency services)
6. Law enforcement
7. Migration, asylum, and border control
8. Administration of justice and democratic processes

**Classification logic:**

### Option A: Manual Classification
```
Ask user:
- Does your AI system fall into any of these categories?
- If YES → High-risk system
- If NO → General-purpose AI (lighter compliance requirements)
```

### Option B: Automated Classification (Method #332)
```python
# If Method #332 (High-Risk AI Classifier) is available:
from methods.implementations import high_risk_ai_classifier

classifier = HighRiskAIClassifier()
result = classifier.classify(system_description)

if result.classification == "HIGH_RISK":
    print(f"High-risk: {result.annex_iii_match}")
    print(f"Obligations: {result.compliance_requirements}")
else:
    print("General-purpose AI")
```

**Output:**
```yaml
risk_classification:
  classification: "HIGH_RISK"  # or "GENERAL_PURPOSE"
  annex_iii_category: "Annex III.4 - Employment (recruitment)"
  rationale: "System makes automated hiring recommendations"
  compliance_requirements: 15  # Number of applicable requirements
  estimated_effort: "12-16 weeks"  # From Method #332
```

**If HIGH_RISK:**
- All EU AI Act requirements apply (100+ requirements)
- Mandatory: risk management, data governance, transparency, human oversight, accuracy

**If GENERAL_PURPOSE:**
- Lighter requirements (mainly transparency obligations)
- Still need compliance, but less rigorous

---

## 5. EVALUATE_GATE_0

**Before proceeding to Step 1, verify:**

### Checklist:
- [ ] **G0-01:** At least 1 AI system identified ✓
- [ ] **G0-02:** System capabilities list not empty (3+ capabilities) ✓
- [ ] **G0-03:** Documentation references provided ✓ (OR fast_track_mode=on)
- [ ] **G0-04:** System owner identified ✓

**If ALL checked → GATE_0 = OPEN → Proceed to Step 1**

**If ANY missing → GATE_0 = CLOSED → Fix before proceeding**

---

## OUTPUT FORMAT

```yaml
inventory_result:
  systems_count: 1
  scope_confirmed: true

  system:
    id: "CS-AI-001"
    name: "CustomerSupport-AI-Chatbot"
    description: "AI chatbot for customer support using LLM"

    capabilities:
      - "Natural language understanding"
      - "Response generation"
      - "Sentiment analysis"
      - "Escalation routing"

    ai_components:
      - "OpenAI GPT-4 API"
      - "Custom sentiment classifier (RoBERTa)"

    decisions:
      - "Route to human (impact: customer experience)"
      - "Suggest articles (impact: satisfaction)"

    documentation:
      - "docs/architecture/chatbot-design.md"
      - "docs/api/chatbot-api-spec.yaml"

    code:
      - "github.com/company/chatbot-backend"

    testing:
      - "Unit tests (85% coverage)"
      - "Bias testing (exists)"

    ownership:
      business_owner: "customer-success@company.com"
      technical_owner: "ml-team@company.com"
      compliance_owner: "compliance@company.com"

    risk_classification:
      classification: "HIGH_RISK"
      category: "Annex III.5(b) - Access to essential services"
      compliance_requirements: 15

  gate_0_status: "OPEN"
  ready_for_step_1: true
```

---

## TIPS FOR EFFECTIVE INVENTORY

### 1. Don't Overlook Systems
- Check: production, staging, pilot, deprecated
- Include: third-party AI services (OpenAI, AWS, etc.)
- Remember: embedded AI (autocomplete, recommendations, search)

### 2. Capabilities > Features
- Not just "what buttons do we have"
- Focus on "what decisions does AI make"
- Example: "Ranks candidates" > "Has ranking feature"

### 3. Documentation Detective Work
- Check: Confluence, Google Docs, GitHub wikis
- Ask: engineering team, product team
- Look for: design docs, ADRs, RFC documents

### 4. Code is Documentation
- If docs missing → code + tests can substitute
- Well-tested code = implicit documentation
- Look for: docstrings, comments, README files

### 5. Fast-Track Pragmatism
- If urgent → accept minimal inventory
- Flag gaps as TODO
- Prioritize CRITICAL gaps over perfect documentation

---

## COMMON PITFALLS

### ❌ "We don't have documentation"
**Solution:** Code + tests + interviews = sufficient documentation

### ❌ "It's just a simple chatbot"
**Problem:** "Simple" can still be high-risk if it makes decisions
**Solution:** Classify honestly per Annex III

### ❌ "We use third-party AI, not our problem"
**Problem:** EU AI Act liability extends to operators, not just providers
**Solution:** Assess your usage, not just the provider's compliance

### ❌ "Too many systems to inventory"
**Solution:** Start with production + high-risk systems first

---

## GATE_0 VIOLATIONS → FIX ACTIONS

**If GATE_0 fails:**

### Violation: G0-01 (No systems identified)
**Action:** Ask user to provide at least 1 system name

### Violation: G0-02 (Capabilities empty)
**Action:** Interview system owner - "What does it do?"

### Violation: G0-03 (No documentation)
**Action:**
- Try: Search GitHub for README, docs/
- Try: Ask for code repository link
- Fast-track: Bypass with warning

### Violation: G0-04 (No owner)
**Action:** Ask user - "Who is responsible for this system?"

---

## SUCCESS CRITERIA

**Step 0 is SUCCESSFUL when:**
1. ✅ At least 1 AI system fully documented
2. ✅ Risk classification determined (HIGH_RISK or GENERAL_PURPOSE)
3. ✅ System capabilities clearly listed
4. ✅ Owner identified
5. ✅ GATE_0 = OPEN

**Time estimate:**
- Quick scan: 10-15 minutes
- Standard: 30-45 minutes
- Comprehensive: 1-2 hours (detailed documentation review)

**Next step:** Step 1 - Requirements Mapping

---

**Version:** 1.0.0
**Last Updated:** 2026-02-14
