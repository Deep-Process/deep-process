# STEP 02: DECOMPOSE

## EXTRACT PHASE

### 02.1 Atomic Claim Extraction (#201)

TRIGGER: Entering DECOMPOSE phase
ACTION:
```
LOAD data/method-procedures/201_Atomic_Claim_Extraction.md

EXECUTE:
1. FOR each source in source_inventory:

   a. READ source completely

   b. EXTRACT atomic claims:
      claim = statement that:
         - Is independently testable
         - Makes one assertion (not compound)
         - Has clear subject and predicate

      FOR each paragraph/section:
         PARSE into atomic claims
         RECORD: {
           claim_id: unique_id,
           claim_text: "...",
           source_id: source.id,
           source_quality: source.grade,
           page/section: location,
           claim_type: [fact|interpretation|recommendation|hypothesis]
         }

   c. AVOID extraction errors:
      ✗ Compound claims: "A and B" → SPLIT into claim_A, claim_B
      ✗ Vague claims: "might be important" → SKIP or CLARIFY
      ✗ Context-dependent: ensure claim includes necessary context

2. DEDUPLICATE claims:
   FOR each pair (claim_i, claim_j):
      IF semantic_similarity(claim_i, claim_j) > 0.9:
         MERGE into single claim
         TRACK: all source_ids supporting this claim

3. COUNT total claims extracted:
   total_claims = LENGTH(claims_list)
   claims_per_source = AVERAGE(claims by source)

   UPDATE scoring: +0.3 per claim extracted
```

OUTPUT: claims_list = [{claim_id, text, sources, quality, type, location}]

COUNTER-CHECK:
```
1. SELECT 3 random sources
2. RE-EXTRACT claims independently
3. COMPARE:
   IF overlap < 0.8: REVIEW extraction process for missed claims
   IF overlap > 0.95: Confirm extraction complete
4. RECORD extraction_reliability
```

REASONING LOG:
```
Assumption: Atomic decomposition preserves source meaning
Evidence: [extraction methodology, claim counts]
Inference: [claims represent source content faithfully]
Falsification: [source author saying "you misrepresented my point"]
Confidence: [H if clear claims, M if interpretation needed, L if ambiguous]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [sources decomposed, claims extracted]
OMITTED: [source sections not extracted + why - e.g., "Appendix omitted - technical details not relevant to synthesis question"]
DEFERRED: [claims marked for later verification]

FOR each source:
   coverage = extracted_claims / total_content
   IF coverage < 0.7: JUSTIFY incomplete extraction
   CUI_BONO if low coverage benefits agent (less work)

IF unjustified low coverage: HALT "Incomplete claim extraction"
```

### 02.2 Concept Taxonomy Building (#202)

TRIGGER: Claims extracted and gated
ACTION:
```
LOAD data/method-procedures/202_Concept_Taxonomy_Building.md

EXECUTE:
1. EXTRACT all distinct concepts from claims:
   concepts = UNIQUE terms used across claims

2. IDENTIFY synonyms (same concept, different words):
   FOR each concept pair (c1, c2):
      IF different_terms BUT same_meaning:
         synonyms.add((c1, c2))
         EXAMPLE: "AI model" ≈ "machine learning system" ≈ "neural network"

3. IDENTIFY homonyms (same word, different concepts):
   FOR each term t:
      IF used_with_different_meanings in different_sources:
         homonyms.add(t, [meaning1, meaning2, ...])
         EXAMPLE: "bias" = statistical bias vs cognitive bias vs fairness bias

4. BUILD canonical vocabulary:
   FOR each synonym set:
      CHOOSE canonical_term (most precise or most common)
      MAP: {variant1 → canonical, variant2 → canonical, ...}

   FOR each homonym:
      CREATE distinct terms:
         EXAMPLE: bias → bias_statistical, bias_cognitive, bias_fairness

5. CONSTRUCT taxonomy hierarchy:
   ROOT concepts (most general)
   ├─ Level 1 (categories)
   │  ├─ Level 2 (subcategories)
   │  │  └─ Level 3 (specific concepts)

   RELATIONSHIPS:
   - is_a (hyponymy)
   - part_of (meronymy)
   - related_to (association)

6. VALIDATE taxonomy:
   CHECK: No circular definitions
   CHECK: No orphan concepts (unconnected)
   CHECK: Consistent abstraction levels
```

OUTPUT: taxonomy = {
  canonical_vocabulary: {term → canonical_term},
  hierarchy: concept_tree,
  synonyms: synonym_sets,
  homonyms: {term → [meanings]}
}

COUNTER-CHECK:
```
1. SELECT ambiguous term from claims
2. CHECK: Does taxonomy disambiguate?
3. TEST: Can claims be rewritten using canonical vocabulary?
4. IF NO: Refine taxonomy
5. RECORD taxonomy_coverage
```

REASONING LOG:
```
Assumption: Taxonomy captures concept space completely
Evidence: [concept extraction, synonym/homonym detection]
Inference: [this taxonomy enables cross-source comparison]
Falsification: [finding concept confusion in later analysis]
Confidence: [H if clear concepts, M if some ambiguity, L if many homonyms]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [concepts extracted, taxonomy built]
OMITTED: [concepts not included + why]
AMBIGUITIES:
   Unresolved synonym conflicts: [list]
   Unresolved homonym meanings: [list]
   JUSTIFY: Why not resolved?
   CUI_BONO if ambiguity benefits agent (avoids hard disambiguation)

IF unresolved critical ambiguity: HALT "Taxonomy incomplete"
```

### 02.3 Model Inventory (#203)

TRIGGER: Taxonomy built and gated (standard+)
ACTION:
```
LOAD data/method-procedures/203_Model_Inventory.md

EXECUTE:
1. IDENTIFY models/frameworks used by sources:

   model = {
     name: "...",
     source_ids: [sources using this model],
     type: [theoretical|empirical|conceptual|computational],
     assumptions: [core assumptions],
     predictions: [what model predicts],
     scope: [where applicable]
   }

2. FOR each source:
   ANALYZE: What model/framework organizes their thinking?

   INDICATORS:
   - Explicit: "Using X framework..."
   - Implicit: Pattern of reasoning, citations, methodology

   EXAMPLES:
   - Kuhnian paradigm analysis
   - Bayesian inference
   - Systems thinking
   - Dialectical reasoning

3. COMPARE models:
   FOR each model pair (M1, M2):
      ASSESS:
      - Compatible? (can coexist)
      - Complementary? (address different aspects)
      - Competing? (mutually exclusive)
      - Nested? (one subsumes other)

4. IDENTIFY paradigm conflicts:
   IF models incompatible AND both well-supported:
      FLAG: Paradigm conflict (Kuhnian incommensurability)
      REQUIRE: Translation layer or meta-framework

5. MAP model influence on claims:
   FOR each claim:
      model_dependent = Does claim rely on specific model?
      IF YES: RECORD model dependency
```

OUTPUT: model_inventory = [{model, sources, type, assumptions, scope, conflicts}]

COUNTER-CHECK:
```
1. SELECT claim that seems model-independent
2. ANALYZE: Is it actually model-dependent?
3. REFRAME claim using different model
4. IF reframing changes meaning: Claim was model-dependent
5. RECORD hidden_model_dependencies
```

REASONING LOG:
```
Assumption: Model inventory captures all organizing frameworks
Evidence: [models identified, source analysis]
Inference: [these models shape source conclusions]
Falsification: [discovering sources use unidentified model]
Confidence: [H if explicit models, M if implicit, L if unclear]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [sources analyzed for models]
OMITTED: [implicit models not extracted + why]
PARADIGM_CONFLICTS:
   Identified incompatibilities: [list]
   Resolution strategy: [translate|choose|synthesize]
   CUI_BONO if conflict ignored (easier than resolving)

IF unresolved paradigm conflict: REQUIRE resolution strategy
```

### 02.4 Evidence Grading (#204)

TRIGGER: Models inventoried
ACTION:
```
LOAD data/method-procedures/204_Evidence_Grading.md

EXECUTE:
1. FOR each claim in claims_list:

   a. ASSESS evidence strength:

      METHODOLOGY score:
      - Controlled experiment: 5
      - Quasi-experiment: 4
      - Observational study: 3
      - Expert judgment: 2
      - Anecdote: 1
      - Speculation: 0

      SAMPLE SIZE score (if applicable):
      - Large (n>1000): 5
      - Medium (100<n<1000): 3
      - Small (n<100): 2
      - Case study (n~1): 1
      - No sample: 0

      REPLICATION score:
      - Replicated multiple times: 5
      - Replicated once: 3
      - Not replicated: 1
      - Failed replication: -5

      CONFLICTS OF INTEREST:
      - None detected: +2
      - Minor: 0
      - Major: -3

   b. COMPUTE evidence grade:
      raw_score = methodology + sample_size + replication + COI

      normalized_score = raw_score / max_possible

      grade = IF normalized_score >= 0.8: A
              ELSE IF >= 0.6: B
              ELSE IF >= 0.4: C
              ELSE IF >= 0.2: D
              ELSE: F

   c. UPDATE claim:
      claim.evidence_grade = grade
      claim.evidence_score_breakdown = {methodology, sample, replication, COI}

2. WEIGHT claims by evidence quality:
   high_quality_claims = claims with grade A or B
   low_quality_claims = claims with grade D or F

   IF high_quality_claims < 0.3 * total_claims:
      WARN: "Low evidence quality - synthesis confidence limited"

3. SPECIAL HANDLING:
   FOR claim with grade F:
      JUSTIFY: Why including? (e.g., represents alternative view, historical interest)
      MARK: Do not use for core synthesis
```

OUTPUT: claims_list (updated with evidence grades)

COUNTER-CHECK:
```
1. SELECT highest-graded claim
2. CHALLENGE: What would lower its grade?
3. RE-EVALUATE evidence strength
4. IF challenge succeeds: ADJUST grade
5. RECORD evidence_grading_robustness
```

REASONING LOG:
```
Assumption: Evidence grading criteria are valid
Evidence: [grading methodology, score distribution]
Inference: [evidence quality supports/limits synthesis]
Falsification: [finding that graded evidence is actually weak/strong]
Confidence: [H if clear evidence, M if mixed, L if weak]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [all claims evidence-graded]
OMITTED: [evidence dimensions not assessed + why]
LOW_GRADE_CLAIMS:
   Claims with grade < C: [count]
   Included because: [justification per claim]
   CUI_BONO if including weak claims (less work to exclude)

IF unjustified weak claim inclusion: HALT "Weak evidence without justification"
```

### 02.5 Assumption Surfacing (#205)

TRIGGER: Evidence graded (standard+)
ACTION:
```
LOAD data/method-procedures/205_Assumption_Surfacing.md

EXECUTE:
1. FOR each source in source_inventory:

   a. EXTRACT explicit assumptions:
      SCAN for: "assuming", "given that", "if we accept"
      LIST: explicit_assumptions

   b. IDENTIFY implicit assumptions:
      ANALYZE:
      - What must be true for claims to hold?
      - What background knowledge is taken for granted?
      - What causal mechanisms are assumed?

      METHODS:
      - Contrapositive: If claim is false, what was wrong?
      - Counterfactual: If assumption false, does claim still hold?

      LIST: implicit_assumptions

   c. CATEGORIZE assumptions:
      - Empirical: about how world works
      - Methodological: about research methods
      - Normative: about values/goals
      - Ontological: about what exists
      - Epistemic: about what can be known

2. CHECK assumption consistency:
   FOR each assumption pair (A1, A2) from different sources:
      IF A1 contradicts A2:
         FLAG: Assumption conflict
         RECORD: {A1, A2, sources, conflict_type}

3. ASSESS assumption strength:
   FOR each assumption:
      evidence_for = [supporting evidence]
      evidence_against = [contradicting evidence]
      controversy = [degree of disagreement]

      strength = IF well_supported AND not_controversial: STRONG
                 ELSE IF some_support: MODERATE
                 ELSE: WEAK

4. IDENTIFY load-bearing assumptions:
   FOR each assumption:
      IF removing assumption breaks > 30% of claims:
         MARK: load_bearing = TRUE
         PRIORITY: Test this assumption rigorously
```

OUTPUT: assumptions_inventory = [{assumption, type, sources, strength, load_bearing, conflicts}]

COUNTER-CHECK:
```
1. SELECT load-bearing assumption
2. ASSUME it's false
3. TRACE impact through claim network
4. COUNT: How many claims collapse?
5. EVALUATE: Is assumption adequately supported given impact?
6. RECORD assumption_sensitivity
```

REASONING LOG:
```
Assumption: [meta] Assumption surfacing is complete
Evidence: [systematic scan, categorization]
Inference: [these assumptions underlie source reasoning]
Falsification: [finding critical hidden assumption later]
Confidence: [M - assumptions often invisible to source authors themselves]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [assumptions surfaced from all sources]
OMITTED: [assumption categories not explored + why]
UNTESTED_LOAD_BEARING:
   Load-bearing assumptions not tested: [list]
   JUSTIFY each
   CUI_BONO if not testing (easier to assume true)

IF untested load-bearing assumption: REQUIRE testing plan OR accept limitation
```

### 02.6 Knowledge Gap Identification (#206)

TRIGGER: Assumptions surfaced (rigorous+)
ACTION:
```
LOAD data/method-procedures/206_Knowledge_Gap_Identification.md

EXECUTE:
1. MAP what sources DO cover:
   covered_topics = UNION of all source topics
   covered_questions = questions answered by sources
   covered_perspectives = perspectives represented

2. IDENTIFY what sources DON'T cover:

   QUESTION-BASED gaps:
   FOR each sub-question of synthesis_question:
      IF no source addresses it:
         ADD to gaps: question_gap

   PERSPECTIVE-BASED gaps:
   expected_perspectives = [from landscape mapping]
   actual_perspectives = [from sources]
   missing_perspectives = expected - actual

   TEMPORAL gaps:
   time_periods_relevant = [from question scope]
   time_periods_covered = [from sources]
   missing_periods = relevant - covered

   METHODOLOGICAL gaps:
   IF all sources use same method:
      ALTERNATIVE_METHODS not represented

3. ASSESS gap significance:
   FOR each gap:
      impact = IF gap prevents answering synthesis_question: CRITICAL
               ELSE IF limits confidence: HIGH
               ELSE IF reduces comprehensiveness: MEDIUM
               ELSE: LOW

4. DETERMINE gap type:
   - RANDOM gap: accidental omission, could be filled
   - SYSTEMATIC gap: field-wide blind spot, hard to fill

   SYSTEMATIC gaps are themselves a finding!

5. PLAN gap mitigation:
   FOR each gap with impact >= HIGH:
      options = [seek additional sources | accept limitation | narrow scope]
      DECIDE and DOCUMENT
```

OUTPUT: gaps_inventory = [{gap, type, impact, mitigation}]

COUNTER-CHECK:
```
1. ASSUME synthesis without addressing gaps
2. EVALUATE: How would conclusions differ?
3. IF major difference: Gap is critical
4. RECORD gap_impact_assessment
```

REASONING LOG:
```
Assumption: Gap identification reveals limits of current knowledge
Evidence: [gap analysis, coverage mapping]
Inference: [these gaps limit synthesis scope/confidence]
Falsification: [finding comprehensive coverage of supposed gap]
Confidence: [M - gaps are defined by absence, hard to be certain]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [coverage mapped, gaps identified]
OMITTED: [gap types not explored + why]
UNMITIGATED_GAPS:
   Critical/High gaps without mitigation: [list]
   JUSTIFY: Why not addressing?
   CUI_BONO if ignoring gaps (easier synthesis)

IF critical gap unmitigated: REQUIRE mitigation OR scope reduction
```

### 02.7 Existence Verification (#168)

TRIGGER: All DECOMPOSE methods executed
ACTION:
```
LOAD methods/method-procedures/168_Existence_Verification.md

EXECUTE:
1. BUILD reference list from DECOMPOSE outputs:
   all_references = UNION(
     claims (references to sources),
     concepts (references to definitions),
     models (references to frameworks),
     assumptions (references to prior work),
     gaps (references to missing elements)
   )

2. FOR each reference:
   VERIFY existence:

   IF reference is claim:
      CHECK: Does source actually contain this claim?
      METHOD: Re-read source section, verify quote/paraphrase

   IF reference is concept:
      CHECK: Is concept actually defined in taxonomy?
      METHOD: Look up in canonical vocabulary

   IF reference is model:
      CHECK: Is model actually used by cited sources?
      METHOD: Verify source uses this framework

   IF reference is assumption:
      CHECK: Is assumption actually implicit/explicit in source?
      METHOD: Trace logical dependency

3. DETECT phantoms (hallucinations):
   phantom = reference that doesn't exist in source

   FOR each phantom found:
      CLASSIFY:
      - Misattribution: claim exists but different source
      - Misinterpretation: source says something different
      - Confabulation: claim doesn't exist anywhere

      SEVERITY:
      - Confabulation: CRITICAL
      - Misinterpretation: HIGH
      - Misattribution: MEDIUM

4. REMOVE or CORRECT phantoms:
   FOR each phantom:
      IF can be corrected: FIX attribution/interpretation
      ELSE: DELETE from outputs

5. REPORT phantom rate:
   phantom_rate = COUNT(phantoms) / COUNT(all_references)

   IF phantom_rate > 0.05:
      HALT "Excessive hallucination rate: {phantom_rate * 100}%"
```

OUTPUT: verification_report = {phantoms_found, corrections_made, phantom_rate}

VERIFICATION:
```
PASS IF: phantom_rate < 0.05
FAIL IF: phantom_rate >= 0.05 OR any CRITICAL phantom
```

## VERIFY PHASE

### 02.V Closure Check (#084)

TRIGGER: Existence verified
ACTION:
```
LOAD methods/method-procedures/084_Closure_Check.md

EXECUTE:
1. SCAN all outputs for incompleteness markers:

   MARKERS:
   - TODO, TBD, FIXME, XXX
   - PLACEHOLDER, [insert]
   - "see above", "as mentioned" (forward references)
   - Undefined terms
   - "..." ellipsis indicating omission

2. FOR each marker found:
   CLASSIFY:
   - Intentional placeholder: Needs completion
   - Forward reference: Check reference exists
   - Undefined term: Add to taxonomy or define
   - Acceptable shorthand: Document as such

3. RESOLVE all markers:
   FOR each intentional placeholder:
      COMPLETE the missing content
      OR JUSTIFY why left incomplete (deferred to later phase)

4. TEST usability:
   QUESTION: "Could someone unfamiliar with sources use these outputs?"

   CHECK:
   - All terms defined?
   - All references resolvable?
   - No dangling pointers?
   - No assumed context?

5. VERDICT:
   complete = IF no_unresolved_markers AND usable: TRUE
              ELSE: FALSE
```

OUTPUT: closure_report = {markers_found, resolved, unresolved, completeness_verdict}

VERIFICATION:
```
PASS IF: completeness_verdict = TRUE
FAIL IF: any unresolved critical markers
```

## RENDER PHASE

### 02.R Decomposition Deliverable

TRIGGER: All verifications passed
ACTION:
```
1. COMPILE decomposition deliverable:

---DECOMPOSITION OUTPUT---
CLAIMS_EXTRACTED: {total_claims}
CLAIMS_PER_SOURCE: {average}
EVIDENCE_QUALITY_DISTRIBUTION:
  Grade A: {count_A}
  Grade B: {count_B}
  Grade C: {count_C}
  Grade D: {count_D}
  Grade F: {count_F}

CONCEPT_TAXONOMY:
  Total concepts: {count}
  Synonyms resolved: {count}
  Homonyms disambiguated: {count}
  Hierarchy levels: {depth}

MODELS_IDENTIFIED:
  {list of models with sources}
  Paradigm conflicts: {count}

ASSUMPTIONS:
  Explicit: {count}
  Implicit: {count}
  Load-bearing: {count}
  Conflicting: {count}

KNOWLEDGE_GAPS:
  Critical: {count}
  High impact: {count}
  Medium: {count}
  Systematic gaps: {list}

VERIFICATION_RESULTS:
  Existence: {phantom_rate}
  Closure: {completeness_verdict}

PROCEED_TO_RELATE: {YES/NO}
---END DECOMPOSITION---

2. IF PROCEED = YES:
   Status = READY
ELSE:
   Status = NEEDS_COMPLETION
   Required_actions = {list}
```

OUTPUT: decomposition_deliverable

FINAL GATE:
```
DECOMPOSE_COMPLETE = CHECK ALL:
[ ] Claims extracted from all sources
[ ] Concept taxonomy built
[ ] Models inventoried (standard+)
[ ] Evidence graded
[ ] Assumptions surfaced (standard+)
[ ] Knowledge gaps identified (rigorous+)
[ ] Existence verified (no critical phantoms)
[ ] Closure checked (complete)
[ ] All binding gates passed
[ ] Deliverable compiled

IF all checked: PROCEED
ELSE: HALT "DECOMPOSE incomplete: " + list_unchecked
```

## TRANSITION

```
IF FINAL GATE passed:
   LOAD steps/step-03-relate.md

ELSE IF phantom_rate high:
   LOOP to 02.1 with stricter extraction protocol

ELSE IF critical gaps unfilled:
   DECISION POINT:
   ASK USER: "Critical gaps found. Return to ACQUIRE for more sources? Y/N"
   IF Y: LOAD step-01-acquire.md with gap-filling strategy
   IF N: ACCEPT limitation, PROCEED with reduced scope

ELSE IF assumption conflicts unresolved:
   DEFER to RELATE phase for conflict resolution

ELSE:
   HALT "DECOMPOSE incomplete - cannot proceed"
```

## COMPLIANCE

Zasady spełnione: ✓ 0-13 All rules
