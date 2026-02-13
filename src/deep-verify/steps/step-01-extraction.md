---
step: 1
name: "Extraction"
time_estimate: "5-15 minutes"
goal: "Extract claims, terms, and structure from artifact — NO severity judgments"
requires_completion: [0]
next_steps:
  DEFAULT: "steps/step-02-verification.md"
gate: "GATE_1"
data_dependencies:
  - "../deep-verify/data/pattern-library.yaml"
outputs:
  - claims_extracted
  - terms_extracted
  - structure_extracted
  - pattern_signals
---

# Phase 1: Extraction

## ENFORCEMENT RULES

```
1. THIS PHASE IS EXTRACTION ONLY. Do NOT assign severity to anything.
2. Do NOT create findings. Do NOT calculate scores.
3. Extract claims, terms, and structure as RAW DATA.
4. Check Pattern Library for SIGNAL MATCHING only (not scoring).
5. Every extraction decision is a HYPOTHESIS — log it.
6. COMPLETE the binding checklist before GATE_1.
```

**CRITICAL DISTINCTION FROM V1:** In V1, Phase 1 ran methods and scored findings. In V2, Phase 1 only EXTRACTS raw material. Methods run in Phase 2.

---

## 1.0 Load Required Data

**Execute these steps in this order:**

1. Read `../deep-verify/data/pattern-library.yaml`
   - Load all pattern categories
   - Note signal keywords for each pattern
2. Read artifact file(s) specified in frontmatter

```
Data loaded:
  [ ] pattern-library.yaml — [count] patterns across [count] categories
  [ ] Artifact file(s) — [count] files, [count] total lines
```

> **HALT** — Confirm data loaded. Do NOT proceed without both.

---

## 1.1 Claim Extraction

**Execute these steps for the ENTIRE artifact:**

### Step 1: Read the artifact completely

Read every line. Do not skim. Do not sample.

### Step 2: Extract every claim

A CLAIM is any statement that asserts something is true, possible, guaranteed, required, or forbidden.

**For each claim, record:**

```
CLAIM C[N]:
  text: "[exact quote from artifact]"
  location: [line number / section]
  claim_type:
    [ ] FACTUAL — states something is true
    [ ] CAPABILITY — states something can be done
    [ ] GUARANTEE — states something will always/never happen
    [ ] REQUIREMENT — states something must be true
    [ ] CONSTRAINT — states a limitation
    [ ] DEFINITION — defines a term or concept
  implicit: [ ] No (explicitly stated)  [ ] Yes (implied by context)

  If implicit:
    LOG HYPOTHESIS:
      H[N]: "Artifact implies [claim]"
      evidence_for: "[what suggests this]"
      confidence: [0.0-1.0]
      status: UNTESTED
```

### Step 3: Compile claim register

```yaml
claims_extracted:
  total: [count]
  by_type:
    FACTUAL: [count]
    CAPABILITY: [count]
    GUARANTEE: [count]
    REQUIREMENT: [count]
    CONSTRAINT: [count]
    DEFINITION: [count]
  implicit_claims: [count]
  hypotheses_generated: [count]
```

**ENFORCEMENT:** Do NOT assess whether claims are TRUE or FALSE. Only extract them.

> **HALT** — Confirm all claims extracted.

---

## 1.2 Term Extraction

**Execute these steps for the ENTIRE artifact:**

### Step 1: Extract all key terms

A KEY TERM is any technical term, domain jargon, abbreviation, or concept name.

**For each term, record:**

```
TERM T[N]:
  term: "[exact word/phrase]"
  locations: [list of line numbers/sections where it appears]
  usage_count: [how many times it appears]
  definition_found: [ ] Yes — at [location]  [ ] No
  meaning_consistent: [ ] Yes  [ ] Unclear  [ ] Cannot determine yet
```

### Step 2: Identify potential vocabulary issues (DO NOT SCORE)

```
POTENTIAL SYNONYMS (same concept, different words):
  - "[term A]" and "[term B]" — possibly same concept
    LOG HYPOTHESIS: H[N]: "Terms A and B refer to the same concept"

POTENTIAL HOMONYMS (same word, different meanings):
  - "[term]" at [location 1] vs [location 2] — possibly different meanings
    LOG HYPOTHESIS: H[N]: "Term X has different meanings at locations Y and Z"

UNDEFINED TERMS (used but never defined):
  - "[term]" — appears [N] times, never defined
```

### Step 3: Compile term register

```yaml
terms_extracted:
  total: [count]
  defined: [count]
  undefined: [count]
  potential_synonyms: [count pairs]
  potential_homonyms: [count]
  hypotheses_generated: [count]
```

**ENFORCEMENT:** Do NOT judge whether synonym/homonym issues are problems. Only flag them as potential issues for Phase 2.

> **HALT** — Confirm all terms extracted.

---

## 1.3 Structure Extraction

**Execute these steps:**

### Step 1: Map the artifact's structure

```
STRUCTURE:
  format: [prose / structured / mixed / code]
  sections: [list of section names/headers]
  hierarchy_depth: [number of nesting levels]

  Abstraction levels present:
    HIGH (goals/vision): [ ] Present  [ ] Absent
      Sections: ________________________________
    MID (design/approach): [ ] Present  [ ] Absent
      Sections: ________________________________
    LOW (implementation): [ ] Present  [ ] Absent
      Sections: ________________________________
```

### Step 2: Map dependencies between sections

```
DEPENDENCY MAP:
  [Section A] → references → [Section B]
  [Section B] → depends on → [Section C]
  ...

  Forward references (X references Y that comes later): [count]
  Back references (X references Y that came before): [count]
  Circular references (X → ... → X): [list or "none detected"]
  Dead references (X references Y that doesn't exist): [list or "none detected"]
```

### Step 3: Compile structure register

```yaml
structure_extracted:
  format: [type]
  section_count: [count]
  hierarchy_depth: [count]
  abstraction_levels: {HIGH: bool, MID: bool, LOW: bool}
  dependency_count: [count]
  forward_refs: [count]
  back_refs: [count]
  circular_refs: [count]
  dead_refs: [count]
```

**ENFORCEMENT:** Do NOT assess whether structural issues are problems. Only map the structure.

> **HALT** — Confirm structure extracted.

---

## 1.4 Pattern Signal Matching

**Execute these steps:**

### Step 1: Scan claims against Pattern Library signals

For each pattern in `pattern-library.yaml`, check if its signal keywords appear in the extracted claims.

```
PATTERN SIGNAL SCAN:
  Pattern [ID] "[name]":
    Signals searched: [list of keywords]
    Matches in claims: [list of C[N] ids, or "none"]
    Signal strength: [ ] STRONG (multiple signals match)
                     [ ] WEAK (one signal matches)
                     [ ] NONE

  [Repeat for each pattern...]
```

### Step 2: Compile signal register

```yaml
pattern_signals:
  total_patterns_checked: [count]
  patterns_with_signals: [count]
  strong_signals: [list of pattern IDs]
  weak_signals: [list of pattern IDs]
  no_signals: [count]
```

**ENFORCEMENT:** Pattern signals are INPUT for Phase 2. Do NOT conclude anything from them. Do NOT assign severity. Do NOT calculate scores.

> **HALT** — Confirm pattern signals compiled.

---

## 1.5 Extraction Summary

**Compile the complete extraction output:**

```yaml
extraction_summary:
  claims:
    total: [count]
    by_type: {FACTUAL: N, CAPABILITY: N, GUARANTEE: N, REQUIREMENT: N, CONSTRAINT: N, DEFINITION: N}
    implicit: [count]
  terms:
    total: [count]
    defined: [count]
    undefined: [count]
    synonym_pairs: [count]
    homonym_candidates: [count]
  structure:
    sections: [count]
    abstraction_levels: [count present]
    dead_refs: [count]
    circular_refs: [count]
  pattern_signals:
    strong: [list]
    weak: [list]
  hypotheses:
    total: [count]
    untested: [count]
```

---

## BINDING CHECKLIST — Phase 1

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1 COMPLETION CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] Artifact read COMPLETELY (every line)          Status: ____   │
│  [ ] ALL claims extracted with exact quotes         Status: ____   │
│  [ ] ALL key terms extracted with locations         Status: ____   │
│  [ ] Structure mapped (sections, dependencies)      Status: ____   │
│  [ ] Pattern Library signals scanned                Status: ____   │
│  [ ] ALL implicit claims logged as HYPOTHESES       Status: ____   │
│  [ ] ALL potential synonyms logged as HYPOTHESES    Status: ____   │
│  [ ] ALL potential homonyms logged as HYPOTHESES    Status: ____   │
│  [ ] Extraction summary compiled                    Status: ____   │
│  [ ] NO severity judgments made in this phase       Status: ____   │
│  [ ] NO scores calculated in this phase             Status: ____   │
│                                                                     │
│  For each item: DONE or SCOPE_REDUCED                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## GATE_1: Extraction → Verification

```
┌─────────────────────────────────────────────────────────────────────┐
│  GATE_1: EXTRACTION COMPLETE → VERIFICATION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ] claims_extracted populated (total > 0)         Status: ____   │
│  [ ] terms_extracted populated                      Status: ____   │
│  [ ] structure_extracted populated                  Status: ____   │
│  [ ] pattern_signals populated                      Status: ____   │
│  [ ] All HYPOTHESES from extraction logged          Status: ____   │
│  [ ] Phase 1 checklist ALL items addressed          Status: ____   │
│  [ ] NO severity/scoring occurred in Phase 1        Status: ____   │
│  [ ] Frontmatter updated with extraction data       Status: ____   │
│                                                                     │
│  GATE_1 passed: [ ] Yes  [ ] No                                    │
│  Timestamp: ________________________________                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**IF GATE_1 PASSED:** Load `steps/step-02-verification.md`
**IF GATE_1 FAILED:** Complete missing items. Do NOT proceed.

---

## Update Frontmatter

```yaml
stepsCompleted: [0, 1]
currentStep: 2
claims_extracted: [full list]
terms_extracted: [full list]
structure_extracted: [full structure]
pattern_signals: [signal register]
gates_passed:
  - gate: GATE_0
    timestamp: [ISO]
    items_done: [count]
    items_reduced: [count]
  - gate: GATE_1
    timestamp: [ISO]
    items_done: [count]
    items_reduced: [count]
```

