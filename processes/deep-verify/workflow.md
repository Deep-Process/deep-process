# Deep Verify V3.0 — Universal Verification Workflow for LLM CLI

## CORE PHILOSOPHY

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DEEP VERIFY = RIGOROUS VERIFICATION + PATTERN INTELLIGENCE + EVIDENCE     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INPUT:   Any artifact (code, documentation, PRD, architecture, claims)    │
│  OUTPUT:  Structured VERIFICATION REPORT with verdict & evidence           │
│                                                                              │
│  PRINCIPLE: NO QUOTE = NO FINDING                                          │
│             Every finding must cite exact text from the artifact            │
│                                                                              │
│  EXECUTION: Designed for LLM CLI (Claude, Gemini, Ollama, etc.)           │
│             Single prompt → Structured output                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## EXECUTION MODES

**Selection:** Mode is determined in **Phase 0 (Setup)** via CLI flags or interactive prompt.

### 1. Quick Verify (QV) — Fast Triage
*   **Time:** 2-5 min
*   **Scope:** Phase 0 + Phase 1 ONLY
*   **Goal:** Rapid assessment, sanity check
*   **Triggers:** `--quick`, `-q`, or interactive selection

### 2. Standard Verify (SV) — Full Process
*   **Time:** 15-45 min
*   **Scope:** Phase 0 through Phase 5
*   **Goal:** Complete verification with adversarial review
*   **Triggers:** Default, `--full`, or interactive selection

### 3. Deep Verify (DV) — Maximum Rigor
*   **Time:** 30-60 min
*   **Scope:** Standard + Phase 6 (Pattern Candidate Evaluation)
*   **Goal:** High stakes, finding new patterns
*   **Triggers:** `--deep`, `--high-stakes`, or interactive selection

---

## WORKFLOW LOGIC

**Execute the following sequence based on selected MODE:**

1.  **SETUP (All Modes)**
    *   Assess stakes, note biases, record metadata.

2.  **PHASE 1: PATTERN SCAN (All Modes)**
    *   Execute Tier 1 Methods (#71, #100, #17).
    *   Check Pattern Library.
    *   Calculate Score (S).
    *   **DECISION POINT:**
        *   If **Quick Verify**: STOP here. Proceed directly to REPORT.
        *   If **Early Exit condition met** (S ≥ 6 with pattern OR S ≤ -3): STOP. Proceed directly to VERDICT -> REPORT.
        *   Otherwise: Continue to PHASE 2.

3.  **PHASE 2: TARGETED (Standard/Deep Only)**
    *   Select methods based on signals.
    *   Execute methods.

4.  **PHASE 3: ADVERSARIAL (Standard/Deep Only)**
    *   **MANDATORY** unless Early Exit occurred.
    *   Devil's Advocate & Steel-man.

5.  **PHASE 4: VERDICT (Standard/Deep Only)**
    *   Final Score calculation.

6.  **PHASE 5: REPORT (All Modes)**
    *   Generate output.
    *   Note if "Quick Verify" mode was used.

7.  **PHASE 6: PATTERN CANDIDATE (Deep Only)**
    *   Evaluates critical findings for new patterns.

---

## SCORING SYSTEM

### Evidence Score (S)

| Finding Severity | Points | Notes |
|------------------|--------|-------|
| CRITICAL | +3 | Fundamental flaw, impossibility |
| IMPORTANT | +1 | Significant issue, requires attention |
| MINOR | +0.3 | Worth noting, not blocking |
| Clean method pass | -0.5 | Method found nothing |
| Pattern match bonus | +1 | Max once per finding |

### Verdict Thresholds

| Score | Verdict | Meaning |
|-------|---------|---------|
| S ≥ 6 | REJECT | Artifact contains fatal flaws |
| -3 < S < 6 | UNCERTAIN | Cannot determine validity |
| S ≤ -3 | ACCEPT | Artifact appears sound |
| Any + ESCALATE flag | ESCALATE | Needs human expert |

---

## METHOD TIERS

### Tier 1 — Phase 1 (ALL mandatory)

| # | Method | When to Use | File |
|---|--------|-------------|------|
| 71 | First Principles Analysis | Always first | `071_First_Principles_Analysis.md` |
| 100 | Vocabulary Consistency | Always second | `100_Vocabulary_Consistency.md` |
| 17 | Abstraction Laddering | Always third | `017_Abstraction_Laddering.md` |

### Tier 2 — Phase 2 (Select based on signals)

| Signal from Phase 1 | Recommended Methods |
|---------------------|---------------------|
| Absolute claims ("always", "never", "100%") | #153, #154 |
| Structural complexity, dependencies | #116, #86 |
| Ungrounded claims, missing evidence | #85, #78 |
| Diffuse belief, clean Phase 1 | #84, #109 |
| Causation claims | #165, #162 |
| Circular reasoning detected | #116, #159 |

**Tier 2 Method Files:**
```
data/method-procedures/
├── 078_Assumption_Excavation.md
├── 084_Coherence_Check.md
├── 085_Grounding_Check.md
├── 086_Topological_Hole_Detection.md
├── 087_Falsifiability_Check.md
├── 109_Contraposition_Inversion.md
├── 116_Strange_Loop_Detection.md
├── 130_Assumption_Torture.md
├── 153_Theoretical_Impossibility_Check.md
├── 154_Definitional_Contradiction_Detector.md
├── 159_Transitive_Dependency_Closure.md
├── 162_Theory_Dependence_Verification.md
├── 163_Existence_Proof_Demand.md
└── 165_Constructive_Counterexample.md
```

### Tier 3 — Phase 3 (Adversarial)

| # | Method | Purpose |
|---|--------|---------|
| 63 | Challenge from Critical Perspective | Attack your own findings |

---

## PATTERN LIBRARY

**Load:** `data/pattern-library.yaml`

The Pattern Library contains known impossibility patterns, definitional contradictions, and theorem violations. Pattern match = higher confidence + enables early exit.

### Quick Reference — Critical Patterns

| ID | Pattern | Signals | Check |
|----|---------|---------|-------|
| DC-001 | PFS + Escrow | "forward secrecy" + "key recovery" | Both claimed? |
| DC-002 | Gradual Typing + Termination | "dynamic types" + "guarantees termination" | Both claimed? |
| DC-004 | CAP Violation | "strong consistency" + "high availability" + "partition tolerance" | All three? |
| TV-002 | FLP Impossibility | "async" + "consensus" + "fault tolerance" + "guaranteed termination" | All four? |
| TV-004 | Universal Detection | "100% recall", "finds all bugs", "no false negatives" | Unbounded claim? |
| SI-001 | Accuracy Without N | High % + no sample size | Missing N? |
| UG-001 | Undefined Core Term | Key concept never operationalized | Can you measure it? |

---

## DOMAIN-SPECIFIC PATTERNS

Deep Verify supports domain libraries that add specialized patterns:

```
data/pattern-libraries/
├── _manifest.yaml        # Library metadata
├── core.yaml             # Universal patterns (always included)
├── agile-process.yaml    # Agile/Scrum patterns
├── documentation.yaml    # Technical docs patterns
├── fiction.yaml          # Narrative consistency
├── iac.yaml              # Infrastructure as Code
├── medical-research.yaml # Clinical/regulatory
├── microservices.yaml    # Distributed systems
└── prd.yaml              # Product requirements
```

**During installation/setup:** Selected domains are merged into `pattern-library.yaml`

---

## ARTIFACT TYPES & APPROACHES

### Code Artifacts
```
Focus: Logic correctness, edge cases, security
Methods: #71, #100, #85, #165
Patterns: Load language-specific patterns
Context: Include imports, types, related files
```

### Documentation Artifacts
```
Focus: Consistency, accuracy, completeness
Methods: #100, #84, #85, #17
Patterns: documentation.yaml
Context: Include code it describes
```

### PRD / Requirements
```
Focus: Feasibility, completeness, contradictions
Methods: #71, #78, #154, #153
Patterns: prd.yaml
Context: Include technical constraints
```

### Architecture / Design
```
Focus: Theoretical soundness, constraint satisfaction
Methods: #153, #116, #86, #159
Patterns: microservices.yaml (if applicable)
Context: Include requirements, constraints
```

### Claims / Papers / Proposals
```
Focus: Falsifiability, evidence, logical structure
Methods: #87, #85, #163, #165
Patterns: core.yaml
Context: Include cited sources if available
```

---

## CONTEXT MANAGEMENT

### Context Levels

| Level | Includes | When to Use |
|-------|----------|-------------|
| Minimal | Target artifact only | Quick triage |
| File | Target + same-file context | Standard verification |
| Imports | Target + imported/referenced files | Code with dependencies |
| Project | Target + related project files | Complex verification |
| Full | Everything relevant | HIGH stakes |

### Context Budget

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONTEXT BUDGET MANAGEMENT                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLMs have context limits. Deep Verify manages this automatically:          │
│                                                                              │
│  1. Always include: Target artifact (full)                                  │
│  2. Priority: Pattern library excerpts (matching domain)                    │
│  3. Priority: Method procedures (loaded as needed)                          │
│  4. Remaining: Context files (most relevant first)                          │
│                                                                              │
│  If context exceeds budget:                                                  │
│  - Summarize less relevant context                                          │
│  - Note in report what was excluded                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## CLI INVOCATION EXAMPLES

### Claude CLI
```bash
# Quick verify
claude "QV this PRD" < document.md

# Standard verify with context
claude "DV this code with project context" \
  --context src/main.py src/utils/*.py

# Full verify with domain
claude "DV --domain medical-research" < research_paper.md
```

### Gemini CLI
```bash
# Quick verify
gemini "QV: verify this architecture" < architecture.md

# Standard verify
gemini "Run Deep Verify full process" < code.py
```

### Generic Pattern
```bash
<llm-cli> "<trigger> <options>" < <artifact>

Triggers: QV, DV, verify, "Deep Verify"
Options: --quick, --full, --deep, --domain <domain>, --context <files>
```

---

## FILE LOADING PROTOCOL

When you need specific data, announce and load:

| Situation | Load | Announcement |
|-----------|------|--------------|
| Start verification | `data/pattern-library.yaml` | "📂 Loading pattern library" |
| Execute method | `data/method-procedures/{NUM}_{Name}.md` | "📂 Loading method #N" |
| Calculate score | `data/severity-scoring.yaml` | "📂 Loading scoring rules" |
| Select Phase 2 methods | `data/method-clusters.yaml` | "📂 Loading method clusters" |
| Generate report | `data/report-template.md` | "📂 Loading report template" |
| Pattern candidate eval | `data/pattern-update-protocol.yaml` | "📂 Loading pattern protocol" |

---

## ADVERSARIAL PROMPTS (Phase 3)

For each IMPORTANT+ finding, challenge with:

```
1. ALTERNATIVE EXPLANATION
   "What innocent explanation could account for this text?"
   → If plausible, WEAKENS finding

2. HIDDEN CONTEXT
   "What domain knowledge might make this valid?"
   → If likely, WEAKENS finding

3. DOMAIN EXCEPTION
   "Is this an accepted practice in this field?"
   → If yes, WEAKENS finding

4. SURVIVORSHIP BIAS
   "Am I only seeing problems and missing the valid parts?"
   → If yes, recalibrate

RESULT:
- 0/4 weaken → Finding HOLDS
- 1-2/4 weaken → Consider DOWNGRADE
- 3-4/4 weaken → REMOVE finding
```

---

## CRITICAL RULES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VERIFICATION COMMANDMENTS                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. NO QUOTE = NO FINDING                                                   │
│     Every finding MUST cite exact text from the artifact                    │
│                                                                              │
│  2. MANDATORY PHASE 3                                                       │
│     Always do adversarial review (except early exit with pattern match)    │
│                                                                              │
│  3. OUTPUT = REPORT                                                         │
│     Deliverable is a structured verification report, not conversation       │
│                                                                              │
│  4. DON'T NARRATE                                                           │
│     Don't describe reasoning steps; DO announce file loads briefly          │
│                                                                              │
│  5. LOAD FILES WHEN NEEDED                                                  │
│     Read method procedures, templates, data files as you need them          │
│                                                                              │
│  6. BE CALIBRATED                                                           │
│     Track confidence levels, acknowledge uncertainty                        │
│                                                                              │
│  7. SIGNAL LIMITATIONS                                                      │
│     Report what was NOT checked and why                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DIRECTORY STRUCTURE

```
deep-verify/
├── workflow.md                 ← YOU ARE HERE
├── data/
│   ├── methods.csv                  # Method definitions (reference)
│   ├── method-procedures/           # Individual method procedures
│   │   ├── 017_Abstraction_Laddering.md
│   │   ├── 063_Challenge_from_Critical_Perspective.md
│   │   ├── 071_First_Principles_Analysis.md
│   │   ├── 078_Assumption_Excavation.md
│   │   ├── 084_Coherence_Check.md
│   │   ├── 085_Grounding_Check.md
│   │   ├── 086_Topological_Hole_Detection.md
│   │   ├── 087_Falsifiability_Check.md
│   │   ├── 100_Vocabulary_Consistency.md
│   │   ├── 109_Contraposition_Inversion.md
│   │   ├── 116_Strange_Loop_Detection.md
│   │   ├── 130_Assumption_Torture.md
│   │   ├── 153_Theoretical_Impossibility_Check.md
│   │   ├── 154_Definitional_Contradiction_Detector.md
│   │   ├── 159_Transitive_Dependency_Closure.md
│   │   ├── 162_Theory_Dependence_Verification.md
│   │   ├── 163_Existence_Proof_Demand.md
│   │   └── 165_Constructive_Counterexample.md
│   ├── pattern-library.yaml         # ★ MERGED patterns (load this)
│   ├── pattern-libraries/           # Source libraries (reference)
│   │   ├── _manifest.yaml
│   │   ├── core.yaml
│   │   └── {domain}.yaml
│   ├── pattern-update-protocol.yaml # Adding new patterns
│   ├── severity-scoring.yaml        # Scoring rules
│   ├── method-clusters.yaml         # Method selection guidance
│   ├── decision-thresholds.yaml     # Verdict rules
│   ├── report-template.md           # Report format
│   ├── examples.md                  # Worked examples
│   └── calibration.yaml             # Accuracy tracking
└── steps/                           # Detailed step files (optional)
    ├── step-00-setup.md
    ├── step-01-pattern-scan.md
    ├── step-02-targeted.md
    ├── step-03-adversarial.md
    ├── step-04-verdict.md
    ├── step-05-report.md
    └── step-06-pattern-candidate.md
```

---

## INTEGRATION WITH DEVELOPMENT WORKFLOWS

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Get changed files
CHANGED=$(git diff --cached --name-only --diff-filter=ACM)

# Run Quick Verify on each
for file in $CHANGED; do
  result=$(claude "QV --output json" < "$file")
  if echo "$result" | jq -e '.verdict == "REJECT"' > /dev/null; then
    echo "❌ Verification failed for $file"
    exit 1
  fi
done
```

### CI/CD Pipeline
```yaml
# .github/workflows/verify.yml
name: Deep Verify
on: [pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Deep Verify
        run: |
          for file in $(git diff --name-only origin/main); do
            claude "DV --output json" < "$file" > "verify-${file//\//-}.json"
          done

      - name: Check Results
        run: |
          if grep -l '"verdict":"REJECT"' verify-*.json; then
            echo "Critical issues found"
            exit 1
          fi
```

### IDE Integration (Conceptual)
Developers can configure their IDEs to trigger the CLI agent:

*   **Quick Check:** Map keybinding to `<cli> run .<cli>/commands/deep-verify --quick <current_file>`
*   **Full Verify:** Map keybinding to `<cli> run .<cli>/commands/deep-verify <current_file>`

---

## VERSION HISTORY

- **V12.2** — Original with bias mitigation, mandatory Phase 3
