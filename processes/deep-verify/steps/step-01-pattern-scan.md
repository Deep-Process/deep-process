---
step: 1
name: "Pattern Scan"
time_estimate: "8-20 minutes"
goal: "Extract claims/terms/structure, execute Tier 1 methods, check patterns, calculate initial score"
requires_completion: [0]
next_steps:
  DEFAULT: "steps/step-02-targeted.md"
gate: "GATE_1"
data_dependencies:
  - "data/extraction-schema.yaml"
  - "data/methods.csv"
  - "data/method-procedures/071_First_Principles_Analysis.md"
  - "data/method-procedures/100_Vocabulary_Consistency.md"
  - "data/method-procedures/017_Abstraction_Laddering.md"
  - "data/pattern-library.yaml"
  - "data/severity-scoring.yaml"
outputs:
  - claims_extracted
  - terms_extracted
  - structure_extracted
  - pattern_signals
  - findings
  - currentScore
  - methodsExecuted
---

# Phase 1: Pattern Scan

## ENFORCEMENT RULES

```
1. THIS PHASE IS EXTRACTION + PATTERN DETECTION ONLY.
2. Do NOT assign severity to extracted claims.
3. Do NOT create findings until executing methods.
4. Extract claims, terms, structure as RAW DATA first.
5. THEN execute ALL Tier 1 methods (#71, #100, #17).
6. Check Pattern Library for signal matching.
7. Every extraction decision = logged HYPOTHESIS.
8. COMPLETE binding checklist before GATE_1.
9. NO early exits. ALL phases run.
```

---

## 1.0 Load Required Data

**Execute these steps in this order:**

1. Read `data/extraction-schema.yaml`
   - Load claim types, term schema, structure schema
2. Read `data/methods.csv` → rows: num=71, num=100, num=17
3. Read method procedure files (071, 100, 017)
4. Read `data/pattern-library.yaml`
5. Read `data/severity-scoring.yaml`

```
Data loaded:
  [ ] extraction-schema.yaml
  [ ] methods.csv (Tier 1: 71, 100, 17)
  [ ] method-procedures (3 files)
  [ ] pattern-library.yaml — [count] patterns
  [ ] severity-scoring.yaml
  [ ] Artifact file(s) — [count] files, [count] lines
```

> **HALT** — Confirm all data loaded. Do NOT proceed without all files.

---

## 1.1 Claim Extraction

**Execute these steps for the ENTIRE artifact:**

### Step 1: Read artifact completely

Read every line. Do not skim. Do not sample.

### Step 2: Extract every claim

A CLAIM is any statement asserting something is true, possible, guaranteed, required, or forbidden.

**For each claim, record:**

```
CLAIM C[N]:
  text: "[exact quote from artifact]"
  location: [line/section]
  claim_type:
    [ ] FACTUAL — states something is true
    [ ] CAPABILITY — states something can be done
    [ ] GUARANTEE — states something will always/never happen
    [ ] REQUIREMENT — states something must be true
    [ ] CONSTRAINT — states a limitation
    [ ] DEFINITION — defines a term/concept
  implicit: [ ] No (explicit)  [ ] Yes (implied)

  If implicit → LOG HYPOTHESIS:
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

**ENFORCEMENT:** Do NOT assess claims as true/false. Only extract.

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
  locations: [line numbers where appears]
  usage_count: [count]
  definition_found: [ ] Yes at [location]  [ ] No
  meaning_consistent: [ ] Yes  [ ] Unclear  [ ] TBD
```

### Step 2: Identify potential vocabulary issues (DO NOT SCORE)

```
POTENTIAL SYNONYMS:
  - "[term A]" and "[term B]" — possibly same concept
    LOG HYPOTHESIS: H[N]: "Terms A and B refer to same concept"

POTENTIAL HOMONYMS:
  - "[term]" at [loc1] vs [loc2] — possibly different meanings
    LOG HYPOTHESIS: H[N]: "Term X has different meanings at Y, Z"

UNDEFINED TERMS:
  - "[term]" — appears [N] times, never defined
```

### Step 3: Compile term register

```yaml
terms_extracted:
  total: [count]
  defined: [count]
  undefined: [count]
  potential_synonyms: [count]
  potential_homonyms: [count]
  hypotheses_generated: [count]
```

**ENFORCEMENT:** Do NOT judge if synonym/homonym issues are problems. Only flag as potential.

> **HALT** — Confirm all terms extracted.

---

## 1.3 Structure Extraction

**Execute these steps:**

### Step 1: Map artifact structure

```
STRUCTURE:
  format: [prose / structured / mixed / code]
  sections: [list section names/headers]
  hierarchy_depth: [nesting levels]

  Abstraction levels present:
    HIGH (goals/vision): [ ] Present  [ ] Absent
      Sections: ________________________________
    MID (design/approach): [ ] Present  [ ] Absent
      Sections: ________________________________
    LOW (implementation): [ ] Present  [ ] Absent
      Sections: ________________________________
```

### Step 2: Map dependencies

```
DEPENDENCY MAP:
  [Section A] → references → [Section B]
  ...

  Forward references: [count]
  Back references: [count]
  Circular references: [list or "none"]
  Dead references: [list or "none"]
```

### Step 3: Compile structure register

```yaml
structure_extracted:
  format: [type]
  section_count: [count]
  hierarchy_depth: [count]
  abstraction_levels: [HIGH/MID/LOW present]
  forward_refs: [count]
  circular_refs: [count]
  dead_refs: [count]
```

> **HALT** — Confirm structure extracted.

---

## 1.4 Execute Tier 1 Methods

**ENFORCEMENT:** Execute ALL three methods. No skipping.

For each method:
1. Load procedure file
2. Follow step-by-step instructions
3. Apply to artifact
4. Record findings with QUOTES (NO QUOTE = NO FINDING)
5. Check Pattern Library for matches
6. Update score

### Method #71: First Principles Analysis

**Load:** `data/method-procedures/071_First_Principles_Analysis.md`

**Execute procedure from file. Then record:**

```
Findings from #71:
  F[N]:
    method: 71
    quote: "[exact text from artifact]"
    location: [line/section]
    description: "[what the finding is]"
    pattern_match: [pattern ID or null]
  # ... for each finding

Score contribution: [calculate per severity-scoring.yaml]
```

> **HALT** — Confirm method #71 complete.

### Method #100: Vocabulary Consistency

**Load:** `data/method-procedures/100_Vocabulary_Consistency.md`

**Execute procedure from file. Then record:**

```
Findings from #100:
  F[N]:
    method: 100
    quote: "[exact text]"
    location: [line/section]
    description: "[what the finding is]"
    pattern_match: [pattern ID or null]

Score contribution: [calculate]
```

> **HALT** — Confirm method #100 complete.

### Method #17: Abstraction Laddering

**Load:** `data/method-procedures/017_Abstraction_Laddering.md`

**Execute procedure from file. Then record:**

```
Findings from #17:
  F[N]:
    method: 17
    quote: "[exact text]"
    location: [line/section]
    description: "[what the finding is]"
    pattern_match: [pattern ID or null]

Score contribution: [calculate]
```

> **HALT** — Confirm method #17 complete.

---

## 1.5 Pattern Library Check

**Execute for EACH finding from 1.4:**

1. Read finding description
2. Scan `pattern-library.yaml` for matching patterns
3. IF match found:
   - Record pattern ID
   - Add +1 pattern bonus to finding score (max once per finding)
4. IF no match:
   - Record pattern_match: null
   - Note as potential pattern candidate (if CRITICAL severity in Phase 2)

```yaml
pattern_signals:
  patterns_matched: [count]
  matched_patterns: [list of pattern IDs]
  findings_with_patterns: [count]
  findings_without_patterns: [count]
```

---

## 1.6 Calculate Initial Score

**Execute:**

1. Sum all finding scores from 1.4
2. Add pattern bonuses from 1.5
3. Calculate total S

```
SCORE CALCULATION:
  Findings: [count]
  Total base points: [sum]
  Pattern bonuses: [count × +1]

  Current Score (S): [total]
```

**Update frontmatter:**
```yaml
currentScore: [S]
methodsExecuted: [71, 100, 17]
findings: [all findings from 1.4]
```

---

## GATE_1: Pattern Scan → Targeted Verification

**ENFORCEMENT:** ALL items MUST be DONE or SCOPE_REDUCED before proceeding.

Load `data/gate-definitions.yaml` → GATE_1 for complete requirements.

### Gate Checklist

```
[ ] G1.1: claims_extracted populated (total > 0)
[ ] G1.2: terms_extracted populated (total > 0)
[ ] G1.3: structure_extracted populated
[ ] G1.4: pattern_signals populated
[ ] G1.5: All hypotheses from extraction logged
[ ] G1.6: ALL Tier 1 methods executed (71, 100, 17)
[ ] G1.7: ALL findings have quotes (NO QUOTE = NO FINDING)
[ ] G1.8: Pattern library checked for all findings
[ ] G1.9: Score calculated correctly
[ ] G1.10: NO severity assigned yet (happens in Phase 2)
```

### SCOPE_REDUCTION (if needed)

If ANY item cannot be completed:

```yaml
SCOPE_REDUCTION_RECORD:
  gate_item: "G1.X"
  what_omitted: "[exact description]"
  why: "[justification]"
  impact_assessment: "[how affects verification]"
  user_approved: [true/false]
```

**IF user_approved = false:** HALT and request approval.

---

### Gate Passage

1. Review all checklist items.
2. Confirm ALL are DONE or formally SCOPE_REDUCED.
3. IF ALL DONE: Output `"GATE_1 PASSED"`
4. IF ANY SCOPE_REDUCED: Output `"GATE_1 PASSED (with scope reductions)"`
5. Proceed to Phase 2.

**ENFORCEMENT:** ALL phases run. NO early exits based on score.

**HALT** — Do NOT load Phase 2 until GATE_1 passes.

---

**END OF PHASE 1**

**Next action:** Load `steps/step-02-targeted.md`
