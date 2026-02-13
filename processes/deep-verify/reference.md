# Deep Verify V2.0 — Reference Documentation

> **This is reference documentation.** For execution, see [workflow.md](./workflow.md).
> Data files shared from `../deep-verify/data/`.

---

## CORE PHILOSOPHY

```
+-----------------------------------------------------------------------------+
|  DEEP VERIFY V2 = ENFORCED VERIFICATION + PATTERN INTELLIGENCE + EVIDENCE   |
+-----------------------------------------------------------------------------+
|                                                                              |
|  INPUT:   Any artifact (code, documentation, PRD, architecture, claims)     |
|  OUTPUT:  Structured VERIFICATION REPORT with verdict & evidence            |
|                                                                              |
|  PRIORITY: COMPLETENESS > TOKEN_ECONOMY > DEPTH > AESTHETICS               |
|                                                                              |
|  V2 PRINCIPLES:                                                             |
|   1. ENFORCEMENT over intention — mechanisms, not hopes                     |
|   2. BINDING GATES — no skipping without formal scope reduction             |
|   3. ASSUMPTIONS DECLARED — before extraction begins                        |
|   4. EXTRACT → VERIFY → RENDER — enforced sequence                         |
|   5. COUNTER-CHECKS — every key claim challenged                           |
|   6. HYPOTHESIS LOGGING — every interpretation tracked                      |
|   7. CHECKLISTS — binding, after every phase                               |
|   8. COMPLETENESS — all phases run in all modes                            |
|                                                                              |
|  EXECUTION: Designed for LLM CLI (Claude, Gemini, Ollama, etc.)            |
|             Single prompt -> Structured output                               |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## KEY DIFFERENCES FROM V1 (Deep Verify V3.1)

| Aspect | V1 (V3.1) | V2 (V2.0) |
|--------|-----------|-----------|
| Early exits | Yes (Quick stops at Phase 1, pattern+score exits) | No — ALL phases run in ALL modes |
| Phase 1 | Pattern Scan (methods + scoring) | Extraction ONLY (no severity, no scores) |
| Phase 2 | Targeted Analysis (methods + scoring) | Verification (ALL methods + scoring + counter-checks) |
| Phase 5 | Report | Render (enforced as output-only phase) |
| Gates | Checklists (advisory) | BINDING GATES with SCOPE_REDUCTION_RECORD |
| Assumptions | Not declared | ASSUMPTIONS_DECLARED mandatory before extraction |
| Hypotheses | Not tracked | Every interpretive decision logged as HYPOTHESIS |
| Counter-checks | Adversarial in Phase 3 only | Counter-hypothesis required for every CRITICAL/IMPORTANT finding |
| Completeness | Token economy considered | COMPLETENESS > TOKEN_ECONOMY |
| Quick mode | Phases 0+1 only | All phases, reduced Tier 2 depth |
| Scope reduction | Implicit | Explicit SCOPE_REDUCTION_RECORD required |
| Language | Mix of "should" and "must" | All enforcement ("MUST", "DO", imperative) |

---

## EXECUTION MODES

### 1. Quick Verify (QV)
- **Time:** 5-15 min
- **Phases:** ALL (0-5)
- **Depth:** Tier 1 methods + minimum 1 Tier 2 method
- **V2 difference:** Still runs adversarial and render phases

### 2. Standard Verify (SV)
- **Time:** 20-50 min
- **Phases:** ALL (0-5)
- **Depth:** Tier 1 + 2-4 Tier 2 methods
- **Default mode**

### 3. Deep Verify (DV)
- **Time:** 35-70 min
- **Phases:** ALL (0-6)
- **Depth:** Full method set + Pattern Candidate evaluation

---

## SCORING SYSTEM

Identical to V1. Load `../deep-verify/data/severity-scoring.yaml`.

| Finding Severity | Points |
|------------------|--------|
| CRITICAL | +3 |
| IMPORTANT | +1 |
| MINOR | +0.3 |
| Clean method pass | -0.5 |
| Pattern match bonus | +1 (max once per finding) |
| Cross-cluster confirmation | +1 |

| Score | Verdict |
|-------|---------|
| S >= 6 | REJECT |
| S <= -3 | ACCEPT |
| -3 < S < 6 | UNCERTAIN |

---

## METHOD TIERS

Identical to V1. Load `../deep-verify/data/method-clusters.yaml`.

### Tier 1 (Phase 2 — ALL mandatory)

| # | Method | File |
|---|--------|------|
| 71 | First Principles Analysis | `071_First_Principles_Analysis.md` |
| 100 | Vocabulary Consistency | `100_Vocabulary_Consistency.md` |
| 17 | Abstraction Laddering | `017_Abstraction_Laddering.md` |

### Tier 2 (Phase 2 — signal-based selection)

| Signal | Recommended Cluster |
|--------|---------------------|
| Absolute claims | Theory (#153, #154, #163) |
| Structural complexity | Structure (#116, #86, #159) |
| Ungrounded claims | Grounding (#85, #78, #130) |
| Diffuse belief | Mix (#84, #109, #165) |
| Clean Tier 1 | Mix (#78, #109, #86) |

### Tier 3 (Phase 3 — adversarial)

| # | Method |
|---|--------|
| 63 | Challenge from Critical Perspective |

---

## GATE MECHANISM (V2-SPECIFIC)

Gates are the enforcement mechanism that prevents phase-skipping.

### Gate Structure

Every gate between phases requires:
1. ALL required items marked DONE or SCOPE_REDUCED
2. SCOPE_REDUCED items have a SCOPE_REDUCTION_RECORD:
   - `what_omitted` — exact description of what was skipped
   - `why` — justification
   - `impact_assessment` — what this omission means for verification quality
   - `user_approved` — user must approve (HALT if not)
3. Gate log with timestamp and counts

### Gate List

| Gate | Between | Required Items |
|------|---------|----------------|
| GATE_0 | Setup → Extraction | Mode, artifact, stakes, assumptions, hypotheses, frontmatter |
| GATE_1 | Extraction → Verification | Claims, terms, structure, signals, hypotheses logged, no severity |
| GATE_2 | Verification → Adversarial | Tier 1+2 methods, findings with quotes, counter-checks, score |
| GATE_3 | Adversarial → Verdict | Hypotheses resolved, findings reviewed, steel-man, checklist, score adjusted |
| GATE_4 | Verdict → Render | Score verified, verdict, confidence, escalation, validation |
| GATE_5 | Render → Complete/Phase6 | Report complete, validated, output |
| GATE_6 | Pattern → Complete | Candidates evaluated, report output |

---

## HYPOTHESIS SYSTEM (V2-SPECIFIC)

Every interpretive decision generates a hypothesis with:
- `id` — unique identifier (H1, H2, ...)
- `phase` — when generated
- `statement` — what was interpreted/decided
- `evidence_for` / `evidence_against`
- `confidence` — 0.0 to 1.0
- `status` — UNTESTED / CONFIRMED / REFUTED / INCONCLUSIVE / CANNOT_RESOLVE
- `tested_by` — method or phase that resolved it

Hypotheses with status=UNTESTED at report time go to NOT_CHECKED section.

---

## COUNTER-CHECK MECHANISM (V2-SPECIFIC)

Every CRITICAL/IMPORTANT finding requires:
1. Counter-hypothesis: "This finding is FALSE because ___"
2. Counter-test: How to verify the counter-hypothesis
3. Counter-result: HOLDS (finding weakened), FAILS (finding stands), INCONCLUSIVE

A CRITICAL finding without a tested counter-check MUST be downgraded to IMPORTANT.

---

## ASSUMPTIONS_DECLARED (V2-SPECIFIC)

Before extraction, the agent declares:
1. **Artifact type assumptions** — what kind of artifact this is
2. **Scope assumptions** — what's in/out of scope
3. **Domain assumptions** — domain knowledge being applied
4. **Context assumptions** — intended audience, environment, dependencies

Each assumption classified: STATED_IN_ARTIFACT / INFERRED / DOMAIN_DEFAULT / UNKNOWN
INFERRED assumptions become HYPOTHESES that must be tested.

---

## PATTERN LIBRARY

Shared from V1. Load `../deep-verify/data/pattern-library.yaml`.

See [`../deep-verify/reference.md`](../deep-verify/reference.md) for full pattern documentation.

---

## ARTIFACT TYPES & APPROACHES

Shared from V1. See [`../deep-verify/reference.md`](../deep-verify/reference.md) for full artifact type documentation.

---

## CONTEXT MANAGEMENT

Shared from V1. See [`../deep-verify/reference.md`](../deep-verify/reference.md) for context level documentation.

---

## ADVERSARIAL PROMPTS (Phase 3)

Same four prompts as V1:
1. Alternative Explanation
2. Hidden Context
3. Domain Exception
4. Survivorship Bias

V2 addition: Counter-check reconciliation (compare Phase 2 counter-checks with Phase 3 results).

---

## DIRECTORY STRUCTURE

```
deep-verify-v2/
├── workflow.md                 <-- Execution program (V2)
├── reference.md                <-- YOU ARE HERE
├── data/
│   ├── gate-definitions.yaml        # Gate requirements (V2-specific)
│   └── extraction-schema.yaml       # Extraction output format (V2-specific)
└── steps/
    ├── step-00-setup.md             # Setup + ASSUMPTIONS_DECLARED
    ├── step-01-extraction.md        # Pure extraction (no severity)
    ├── step-02-verification.md      # Methods + scoring + counter-checks
    ├── step-03-adversarial.md       # Devil's advocate + hypothesis resolution
    ├── step-04-verdict.md           # Score + verdict + validation
    ├── step-05-render.md            # Report generation (output-only)
    └── step-06-pattern-candidate.md # Pattern evaluation (Deep only)

Shared data from ../deep-verify/data/:
    ├── methods.csv
    ├── method-procedures/
    ├── pattern-library.yaml
    ├── pattern-libraries/
    ├── severity-scoring.yaml
    ├── method-clusters.yaml
    ├── decision-thresholds.yaml
    ├── report-template.md
    ├── calibration.yaml
    └── pattern-update-protocol.yaml
```

---

## CLI INVOCATION

```bash
# Quick verify (V2: all phases, reduced depth)
claude "QV this PRD" < document.md

# Standard verify
claude "DV this code with project context" --context src/main.py

# Deep verify
claude "DV --deep" < architecture.md
```

---

## VERSION HISTORY

- **V2.0** — Enforcement edition: binding gates, ASSUMPTIONS_DECLARED, extract→verify→render, counter-checks, no early exits, hypothesis logging, binding checklists
- Based on Deep Verify V3.1

