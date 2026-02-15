# STEP 04: INTEGRATE

## EXTRACT PHASE

### 04.1 Dialectical Integration (#401)

TRIGGER: Entering INTEGRATE phase
ACTION:
```
LOAD data/method-procedures/401_Dialectical_Integration.md

EXECUTE (Hegelian Synthesis):

1. LOAD dialectical_tensions from RELATE phase

2. FOR each high-priority tension:

   THESIS = strongest version of position A
   ANTITHESIS = strongest version of position B

   a. IDENTIFY partial truths:

      truth_in_thesis = [what THESIS gets right]
      limit_of_thesis = [where THESIS fails/is incomplete]

      truth_in_antithesis = [what ANTITHESIS gets right]
      limit_of_antithesis = [where ANTITHESIS fails/is incomplete]

   b. CONSTRUCT synthesis (Aufhebung):

      Synthesis must:
      - PRESERVE truth from both thesis and antithesis
      - TRANSCEND their limitations
      - OPERATE at higher level of abstraction
      - RESOLVE contradiction, not just compromise

      AUFHEBUNG = {
        preserves: [truth_in_thesis + truth_in_antithesis],
        transcends: [how it goes beyond both],
        resolves: [how contradiction dissolves at this level]
      }

   c. PIAGET'S TEST (Assimilation/Accommodation):

      TRY assimilating antithesis into thesis schema:
      IF fits: Thesis accommodates antithesis → synthesis

      TRY assimilating thesis into antithesis schema:
      IF fits: Antithesis accommodates thesis → synthesis

      IF neither fits:
      REQUIRE: New schema (accommodation) that handles both

   d. VALIDATE synthesis:

      TESTS:
      1. Does synthesis explain why thesis seemed true?
      2. Does synthesis explain why antithesis seemed true?
      3. Does synthesis explain why they seemed contradictory?
      4. Does synthesis generate new predictions?
      5. Is synthesis simpler than "thesis sometimes, antithesis other times"?

      PASS_COUNT = COUNT(tests passed)

      IF PASS_COUNT < 4:
         synthesis = FAILED
         MARK tension as unresolved
      ELSE:
         synthesis = SUCCESSFUL
         RECORD synthesis

   e. DOCUMENT synthesis:

      dialectical_synthesis = {
        tension_id: id,
        thesis: thesis,
        antithesis: antithesis,
        synthesis: aufhebung,
        validation: test_results,
        confidence: [HIGH | MEDIUM | LOW] based on pass_count
      }

3. HANDLE unresolved tensions:

   FOR each tension where synthesis FAILED:

      CLASSIFY failure_type:
      - Paradigmatic: Incommensurable frameworks (Kuhn)
      - Normative: Value disagreement
      - Empirical: Insufficient evidence to decide
      - Definitional: Terms not aligned (resolvable via taxonomy)

      STRATEGY per type:
      - Paradigmatic: Present both paradigms, let user choose OR build meta-framework
      - Normative: Acknowledge value trade-off, document implications of each choice
      - Empirical: Identify what evidence would resolve, mark as open question
      - Definitional: Return to taxonomy, resolve, retry synthesis

4. ITERATE on syntheses:

   NEW_TENSIONS may emerge from syntheses
   IF new tensions appear:
      ADD to dialectical_tensions
      REPEAT process
      TRACK iteration depth (max = max_iterations from scope)
```

OUTPUT: syntheses = [{synthesis, confidence, validation}]

COUNTER-CHECK:
```
1. SELECT highest-confidence synthesis
2. GENERATE strongest possible counter-synthesis:
   Alternative way to integrate thesis + antithesis
3. COMPARE:
   Which better satisfies validation tests?
4. IF counter-synthesis better: REPLACE
5. RECORD synthesis_robustness
```

REASONING LOG:
```
Assumption: Dialectical contradictions can be transcended
Evidence: [synthesis validation tests, pass rates]
Inference: [these syntheses resolve tensions productively]
Falsification: [synthesis failing validation test]
Confidence: [H if 5/5 tests, M if 4/5, L if 3/5]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [tensions addressed, syntheses attempted]
OMITTED: [tensions not synthesized + why]
FAILED_SYNTHESES:
   Tensions not resolved: [list]
   Failure type: [classification]
   User choice needed: [Y/N]
   CUI_BONO if giving up (easier than hard synthesis)

IF critical tension unresolved without strategy: HALT "Synthesis incomplete"
```

### 04.2 Framework Unification (#402)

TRIGGER: Dialectical integration complete (standard+)
ACTION:
```
LOAD data/method-procedures/402_Framework_Unification.md

EXECUTE (Nonaka SECI - Combination phase):

1. LOAD model_inventory from DECOMPOSE phase

2. IDENTIFY valid elements from each model/framework:

   FOR each model:
      valid_elements = [
        concepts that proved useful,
        mechanisms with evidence,
        predictions that held,
        scope where applicable
      ]

      discard_elements = [
        concepts contradicted by evidence,
        mechanisms not supported,
        predictions that failed
      ]

      RECORD: {model, valid, discard, justification}

3. BUILD unified framework:

   a. DOMAIN PARTITIONING:

      IF models apply to different domains:
         STRATEGY: Modular framework
         unified_framework = {
           domain_A: model_A,
           domain_B: model_B,
           transitions: [how domains interface]
         }

   b. HIERARCHICAL INTEGRATION:

      IF models operate at different levels:
         STRATEGY: Nested framework
         unified_framework = {
           macro_level: model_system,
           meso_level: model_organization,
           micro_level: model_individual,
           cross_level_mechanisms: [how levels interact]
         }

   c. COMPLEMENTARY INTEGRATION:

      IF models address different aspects:
         STRATEGY: Multi-faceted framework
         unified_framework = {
           structural_aspect: model_structure,
           processual_aspect: model_process,
           temporal_aspect: model_dynamics,
           integration: [how aspects combine]
         }

   d. SUBSUMPTION:

      IF one model subsumes others:
         STRATEGY: Use broader model, others as special cases
         unified_framework = model_general +
           {special_case_A: when(...), special_case_B: when(...)}

4. VALIDATE unified framework:

   TESTS:
   1. Does it explain all phenomena explained by component models?
   2. Does it make novel predictions beyond component models?
   3. Is it simpler than "use model A here, model B there"?
   4. Are transitions between parts coherent?
   5. Does it resolve conflicts between component models?

   COHERENCE CHECK (#407):
   - No internal contradictions
   - Terms used consistently
   - Assumptions compatible

5. COMPARE with existing frameworks in literature:

   SEARCH: Related unified frameworks
   IF found:
      COMPARE: Ours vs existing
      ADOPT | ADAPT | JUSTIFY_NEW

   IF none found:
      DOCUMENT: Novel framework contribution
```

OUTPUT: unified_framework = {
  structure: framework_design,
  components: {model: valid_elements},
  integration_strategy: strategy,
  validation: test_results,
  novelty: comparison_with_literature
}

COUNTER-CHECK:
```
1. ATTEMPT alternative unification
2. COMPARE:
   - Simplicity
   - Explanatory power
   - Empirical adequacy
3. IF alternative better: ADOPT
4. RECORD framework_alternatives_considered
```

REASONING LOG:
```
Assumption: Unified framework more valuable than collection of models
Evidence: [validation tests, coherence]
Inference: [this framework integrates source knowledge]
Falsification: [framework failing to explain known phenomena]
Confidence: [H if all tests pass, M if most, L if marginal]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [models unified into framework]
OMITTED: [models not included + why]
FRAMEWORK_LIMITATIONS:
   Phenomena not explained: [list]
   Scope boundaries: [where framework doesn't apply]
   Assumptions required: [list]
   CUI_BONO if limitations hidden (makes framework seem better)

IF major limitation undocumented: REQUIRE documentation
```

### 04.3 Emergence Detection (#403)

TRIGGER: Framework unified (rigorous+)
ACTION:
```
LOAD data/method-procedures/403_Emergence_Detection.md

EXECUTE (Shannon Information Theory - Novel Information):

1. DEFINE emergence criterion:

   emergent_property = property that:
      - Exists in synthesis
      - NOT present in any single source
      - NOT simple sum of source parts
      - Requires COMBINATION to exist

2. SCAN for emergent properties:

   a. CONCEPTUAL EMERGENCE:

      FOR each concept in synthesis:
         IF concept not in ANY source:
            CHECK: Is it combination of source concepts?

            IF YES:
               emergent_concept = new concept
               components = [source concepts combined]
               emergence_mechanism = how combination creates new concept

               EXAMPLE: Sources discuss "bias" and "feedback"
                       → Emergent: "bias amplification loop"

   b. RELATIONAL EMERGENCE:

      FOR each relationship in synthesis:
         IF relationship not in any source:
            CHECK: Does relationship emerge from combining source relationships?

            EXAMPLE: Source A: X→Y, Source B: Y→Z, neither mentions X→Z
                    → Emergent: Transitive relationship X→Z

   c. PATTERN EMERGENCE:

      IF synthesis reveals pattern not visible in individual sources:
         EXAMPLE: Each source describes different phase
                 → Emergent: Full cycle pattern

   d. PRINCIPLE EMERGENCE:

      IF synthesis derives principle that generalizes across sources:
         EXAMPLE: Sources describe specific cases
                 → Emergent: General law/principle

3. VALIDATE emergence (Shannon Information Test):

   FOR each emergent_property:

      a. MUTUAL INFORMATION test:
         I(synthesis; sources) = information in synthesis about sources
         I(sources; synthesis) = information sources provide about synthesis

         IF I(synthesis; sources) > I(sources; synthesis):
            TRUE EMERGENCE (synthesis adds information)
         ELSE:
            FALSE EMERGENCE (just reorganization)

      b. COMPRESSION test:
         IF emergent_property enables shorter description of phenomena:
            TRUE EMERGENCE (Kolmogorov complexity reduction)

      c. PREDICTION test:
         IF emergent_property enables predictions not possible from sources alone:
            TRUE EMERGENCE (novel implications)

      d. SURPRISE test:
         IF emergent_property would surprise source authors:
            TRUE EMERGENCE (genuinely new)

   PASS_COUNT = COUNT(tests passed)

   IF PASS_COUNT >= 3:
      VALIDATE as emergent
   ELSE:
      RECLASSIFY as derivative

4. DOCUMENT emergent insights:

   emergence = {
     property: description,
     type: [conceptual | relational | pattern | principle],
     components: [source elements that combined],
     mechanism: [how emergence occurs],
     validation: [tests passed],
     implications: [what this enables],
     confidence: [H/M/L based on test passes]
   }

5. PRIORITIZE emergent insights:

   SORT by:
   - Novelty (how surprising)
   - Generality (how widely applicable)
   - Importance (how consequential)
   - Evidence (how well-supported)

   TOP insights = core synthesis contribution
```

OUTPUT: emergent_insights = [{insight, type, validation, priority}]

COUNTER-CHECK:
```
1. SELECT highest-priority emergent insight
2. CHALLENGE: Is this really new, or was it implicit in sources?
3. SHOW to hypothetical source author:
   "Would you be surprised by this?"
4. IF "no surprise": Downgrade or reclassify
5. RECORD emergence_validity
```

REASONING LOG:
```
Assumption: Emergence distinguishes synthesis from summary
Evidence: [Shannon tests, validation results]
Inference: [these insights are genuinely emergent]
Falsification: [finding insight was actually in a source we missed]
Confidence: [H if 4/4 tests, M if 3/4, L if 2/4]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [synthesis scanned for emergence]
OMITTED: [emergence types not checked + why]
NO_EMERGENCE_FOUND:
   IF no emergent insights:
      CRITICAL: This is summarization, not synthesis
      REQUIRE: Find emergence OR acknowledge summary only
      CUI_BONO: Does absence benefit agent (less work)?

IF no emergence AND depth >= standard: HALT "No synthesis achieved"
```

### 04.4 Abductive Integration (#404)

TRIGGER: Emergence detected (standard+)
ACTION:
```
LOAD data/method-procedures/404_Abductive_Integration.md

EXECUTE (Peirce's Abduction - Inference to Best Explanation):

1. IDENTIFY surprising facts requiring explanation:

   surprising_facts = [
     observations from sources that need explaining,
     patterns detected in RELATE,
     tensions that were resolved,
     emergent properties from 04.3
   ]

2. FOR each surprising_fact:

   a. GENERATE candidate explanations (hypotheses):

      ABDUCTIVE REASONING:
      Fact F observed
      IF Hypothesis H were true, F would be expected
      THEREFORE: H is plausible explanation for F

      GENERATE multiple H1, H2, ..., Hn

      CRITERIA for good hypothesis:
      - Explains F (adequacy)
      - Simple (parsimony)
      - Consistent with other knowledge (coherence)
      - Testable (falsifiability)
      - Fruitful (generates predictions)

   b. EVALUATE candidate explanations:

      FOR each hypothesis H:

         adequacy = Does H explain F?
         parsimony = Is H simple?
         coherence = Is H consistent with synthesis?
         falsifiability = Can H be tested?
         fruitfulness = Does H predict other facts?

         score = weighted_sum(criteria)

      RANK hypotheses by score

   c. SELECT best explanation:

      best_hypothesis = argmax(score)

      IF multiple hypotheses score similarly:
         REPORT multiple explanations
         IDENTIFY: What evidence would discriminate?

   d. DEDUCE predictions from best hypothesis:

      IF best_hypothesis true:
         THEN it should imply: P1, P2, ..., Pk

      CHECK predictions against available evidence:
      - Confirmed predictions: +confidence
      - Disconfirmed predictions: -confidence
      - Untested predictions: document for future

3. INTEGRATE explanations into synthesis:

   abductive_synthesis = {
     explananda: [surprising facts],
     best_explanations: [hypotheses selected],
     predictions: [deduced implications],
     confidence: [based on prediction testing],
     open_questions: [untested predictions]
   }

4. COHERENCE with framework:

   CHECK: Are abductive explanations compatible with unified_framework?

   IF conflict:
      CHOICE:
      - Modify framework to accommodate explanation
      - Reject explanation in favor of framework
      - Hold both tentatively pending evidence

   DOCUMENT resolution

5. BUILD explanatory network:

   CONNECT explanations:
   - Which explanations support others?
   - Which compete?
   - What meta-explanation explains multiple phenomena?

   IDENTIFY most powerful explanations:
   (those that explain the most with the least assumptions)
```

OUTPUT: abductive_synthesis = {
  explanations: [{fact, hypothesis, confidence, predictions}],
  network: explanatory_structure,
  open_questions: untested_predictions
}

COUNTER-CHECK:
```
1. SELECT best explanation
2. GENERATE competing explanation deliberately overlooked
3. EVALUATE: Is competing explanation actually better?
4. IF YES: REPLACE or REPORT multiple
5. RECORD explanation_alternatives
```

REASONING LOG:
```
Assumption: Best explanation is likely true (abduction)
Evidence: [hypothesis evaluation, prediction tests]
Inference: [these explanations integrate source knowledge]
Falsification: [prediction failing, better explanation found]
Confidence: [H if strong predictions, M if weak, L if untested]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [facts explained, hypotheses evaluated]
OMITTED: [surprising facts not explained + why]
UNEXPLAINED:
   Facts without adequate explanation: [list]
   Status: [accepted gap | requires more evidence]
   CUI_BONO if leaving unexplained (easier)

IF critical fact unexplained: JUSTIFY OR find explanation
```

### 04.5 Knowledge Compression (#405)

TRIGGER: Abductive integration complete
ACTION:
```
LOAD data/method-procedures/405_Knowledge_Compression.md

EXECUTE (Kolmogorov Complexity / MDL):

1. MEASURE source material size:

   total_source_length = SUM([LENGTH(source) for source in source_inventory])

   RECORD: baseline_size = total_source_length

2. COMPRESS synthesis iteratively:

   synthesis_draft = {
     all claims,
     all relationships,
     all syntheses,
     all frameworks,
     all emergent insights,
     all explanations
   }

   ITERATION:
   a. IDENTIFY redundancy:
      - Repeated concepts (use reference to definition)
      - Repeated patterns (abstract to general rule)
      - Repeated mechanisms (unify)
      - Verbose expressions (simplify)

   b. REMOVE redundancy:
      REPLACE redundant content with:
      - Pointers to canonical definition
      - General pattern with instantiation rules
      - Unified mechanism
      - Concise formulation

   c. PRESERVE essence:
      TEST: Does compressed version still enable:
      - Answering synthesis question?
      - Understanding key insights?
      - Deriving implications?

      IF NO: Compression too aggressive, BACKTRACK

   d. MEASURE compression:
      current_length = LENGTH(synthesis_draft)
      compression_ratio = current_length / baseline_size

   e. ITERATE until:
      compression_ratio < 0.5  (RULE 5 requirement)
      OR no more compression possible without losing essence

3. VALIDATE compression (Minimum Description Length):

   MDL = LENGTH(compressed_synthesis) + LENGTH(rules_to_reconstruct_sources)

   IF MDL minimized:
      Compression captures true regularities
   ELSE:
      Over-compressed (lost information) OR under-compressed (kept noise)

4. ENSURE compression ≠ information loss:

   KOLMOGOROV TEST:
   True compression = identifying patterns (compressible)
   Information loss = discarding substance (incompressible)

   VERIFY:
   - Can synthesis answer all sub-questions?
   - Are all emergent insights present?
   - Are critical distinctions preserved?

   IF information lost: DECOMPRESS selectively

5. FINAL COMPRESSION CHECK:

   REQUIREMENT: compression_ratio < 0.5

   IF ratio >= 0.5:
      HALT "Compression mandatory (RULE 5) - synthesis too close to summary"

   DOCUMENT:
   - Original size: {baseline_size}
   - Compressed size: {current_length}
   - Compression ratio: {ratio}
   - Information preserved: {validation_results}
```

OUTPUT: compressed_synthesis + compression_report

COUNTER-CHECK:
```
1. DECOMPRESS synthesis back to source-level detail
2. COMPARE with original sources
3. CHECK: What was lost?
4. EVALUATE: Is loss acceptable?
5. RECORD compression_fidelity
```

REASONING LOG:
```
Assumption: Compression reveals true patterns in knowledge
Evidence: [compression ratio, preservation tests]
Inference: [synthesis captures essence efficiently]
Falsification: [reconstructed knowledge differs from sources]
Confidence: [H if high fidelity, M if some loss, L if significant loss]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [synthesis compressed]
OMITTED: [compression techniques not applied + why]
COMPRESSION_QUALITY:
   Ratio: {compression_ratio}
   Fidelity: {information_preserved}
   REQUIRE: ratio < 0.5 (RULE 5)
   CUI_BONO: Does failing compression benefit agent?

IF compression_ratio >= 0.5: HALT "Insufficient compression - not synthesis"
```

### 04.6 Boundary Condition Mapping (#406)

TRIGGER: Knowledge compressed (rigorous+)
ACTION:
```
LOAD data/method-procedures/406_Boundary_Condition_Mapping.md

EXECUTE:
1. DEFINE synthesis scope:

   WHERE synthesis applies:
   - Domains covered
   - Time periods
   - Contexts
   - Populations
   - Conditions

2. IDENTIFY boundaries through falsification:

   FOR each synthesis claim:

      a. VARY conditions systematically:
         - Change domain
         - Change time period
         - Change context
         - Change population

      b. TEST: Does claim still hold?

         IF NO: Found boundary
         RECORD: {
           claim: claim,
           boundary: condition_where_breaks,
           behavior_beyond: what_happens_outside
         }

   3. MAP boundary types:

      HARD boundaries (claim definitionally false outside):
      EXAMPLE: "Agile works for software"
               Boundary: Non-software domains (definitional)

      SOFT boundaries (claim empirically weaker outside):
      EXAMPLE: "Agile increases velocity"
               Boundary: Large orgs (empirical - coordination overhead)

      GRADIENT boundaries (claim gradually weakens):
      EXAMPLE: "Pair programming reduces bugs"
               Boundary: Senior developers (gradient - less benefit)

   4. DOCUMENT scope limitations:

      synthesis_scope = {
        applies_fully: [conditions where synthesis is strongest],
        applies_partially: [conditions where synthesis is weaker],
        does_not_apply: [conditions where synthesis breaks],
        unknown_scope: [conditions not tested]
      }

   5. COMMUNICATE boundaries clearly:

      AVOID: "This always works" (unbounded claim)
      PREFER: "This works when A, B, C hold" (bounded claim)

      IF boundaries complex:
         CREATE scope diagram
```

OUTPUT: boundary_map = {scope, limitations, diagrams}

VERIFICATION:
```
PASS IF: Scope clearly defined and testable
WARN IF: Scope too narrow (limited applicability)
FAIL IF: Scope unbounded (unfalsifiable)
```

## VERIFY PHASE

### 04.V Liar's Trap (#056)

TRIGGER: All INTEGRATE methods executed
ACTION:
```
DEMAND: List 3 ways agent could DECEIVE in synthesis:
1. [Hide weak syntheses by over-claiming resolution?]
2. [Inflate emergence by calling derivatives "emergent"?]
3. [Fudge compression by selective omission?]

FOR each: PROVIDE evidence NOT used
```

### 04.V2 Mirror Trap (#057)

TRIGGER: Liar's Trap passed
ACTION:
```
CONSTRUCT dishonest_version:
"Dishonest agent would claim: successful synthesis, novel insights, well-compressed"

COMPARE actual output
IF too similar: REQUIRE specificity and evidence
```

### 04.V3 Semantic Entropy Validation (#152)

TRIGGER: Mirror Trap passed
ACTION:
```
LOAD methods/method-procedures/152_Semantic_Entropy_Validation.md

EXECUTE:
1. SELECT key synthesis claims

2. GENERATE paraphrases:
   FOR each claim:
      REPHRASE in 5 different ways
      CLUSTER by meaning

3. MEASURE semantic entropy:
   entropy = diversity of meanings in paraphrases

   IF high entropy:
      FLAG: Claim is vague/ambiguous (potential confabulation)
      REQUIRE: Clarification or uncertainty acknowledgment

   IF low entropy:
      CONFIRM: Claim has stable meaning
```

OUTPUT: semantic_entropy_report

VERIFICATION:
```
PASS IF: Low entropy on key claims
FAIL IF: High entropy indicates confabulation
```

## RENDER PHASE

### 04.R Integration Deliverable

TRIGGER: All verifications passed
ACTION:
```
COMPILE:

---INTEGRATION OUTPUT---
DIALECTICAL_SYNTHESES: {count}
  Resolved: {count}
  Unresolved: {count with strategy}

UNIFIED_FRAMEWORK:
  Strategy: {modular|hierarchical|complementary|subsumption}
  Components: {model count}
  Validation: {tests passed}

EMERGENT_INSIGHTS: {count}
  Novel concepts: {count}
  Novel relations: {count}
  Novel patterns: {count}
  Novel principles: {count}
  Shannon validation: {pass rate}

ABDUCTIVE_EXPLANATIONS: {count}
  Best explanations: {list}
  Predictions: {confirmed/disconfirmed/untested}

COMPRESSION:
  Original size: {baseline}
  Compressed size: {final}
  Ratio: {compression_ratio} (MUST BE <0.5)
  Fidelity: {information_preserved}

SCOPE_BOUNDARIES:
  Fully applicable: {conditions}
  Partially applicable: {conditions}
  Not applicable: {conditions}

VERIFICATION_RESULTS:
  Liar's Trap: PASSED
  Mirror Trap: PASSED
  Semantic Entropy: PASSED

PROCEED_TO_CRYSTALLIZE: {YES/NO}
---END INTEGRATION---
```

FINAL GATE:
```
INTEGRATE_COMPLETE = CHECK ALL:
[ ] Dialectical syntheses attempted
[ ] Framework unified (standard+)
[ ] Emergence detected and validated (rigorous+)
[ ] Abductive explanations provided (standard+)
[ ] Knowledge compressed (ratio <0.5)
[ ] Boundaries mapped (rigorous+)
[ ] All verifications passed
[ ] All binding gates passed
[ ] Deliverable compiled

IF all checked: PROCEED
ELSE: HALT "INTEGRATE incomplete"
```

## TRANSITION

```
IF FINAL GATE passed:
   LOAD steps/step-05-crystallize.md
ELSE IF compression failed:
   LOOP to 04.5 with stricter compression
ELSE IF no emergence found AND depth >= standard:
   HALT "Synthesis failed - no emergent insights (this is summary, not synthesis)"
ELSE:
   HALT with specifics
```
