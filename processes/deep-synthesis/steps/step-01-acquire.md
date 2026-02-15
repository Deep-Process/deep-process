# STEP 01: ACQUIRE

## EXTRACT PHASE

### 01.0 Baseline Census (#167)

TRIGGER: Entering ACQUIRE phase
ACTION:
```
LOAD methods/method-procedures/167_Baseline_Census_Before_Work.md

EXECUTE:
1. COUNT expected elements from scope:
   expected_source_types = LENGTH(scope.types_needed)
   expected_minimum_sources = scope.depth_minimum:
      quick: 2
      standard: 5
      rigorous: 10
      comprehensive: 30

2. INITIALIZE counters:
   sources_collected = 0
   sources_quality_A = 0
   sources_quality_B = 0
   sources_quality_C = 0
   sources_quality_D = 0
   diversity_dimensions_covered = 0

3. RECORD baseline:
   baseline = {
     expected_source_types: expected_source_types,
     expected_minimum: expected_minimum_sources,
     expected_maximum: expected_minimum_sources * 3,
     start_time: NOW(),
     counters: all_zeros
   }
```

OUTPUT: baseline
GATE: Baseline established

### 01.1 Systematic Source Collection (#101)

TRIGGER: Baseline established
ACTION:
```
LOAD data/method-procedures/101_Systematic_Source_Collection.md

EXECUTE:
1. LOAD source landscape from scope

2. FOR each source_type in scope.types_needed:

   a. IDENTIFY potential sources of this type:
      SEARCH available repositories/databases/experts
      LIST candidates

   b. FOR each candidate:
      ASSESS expected_contribution:
         - What unique perspective?
         - What unique method?
         - What unique domain?
         - Likely to agree or disagree with others?

      PRIORITY = IF disagrees_with_others: HIGH ELSE: MEDIUM

   c. SELECT sources:
      HEGELIAN_PRINCIPLE: Prioritize disagreeing sources
      ADD to source_inventory

   d. TEST saturation:
      IF new_source_redundancy > 0.8 AND type != disagreeing:
         STOP collecting this type
      ELSE:
         CONTINUE

3. ENFORCE boundaries:
   minimum = scope.expected_minimum_sources
   maximum = scope.expected_minimum_sources * 3

   current_count = LENGTH(source_inventory)

   IF current_count < minimum:
      HALT "Insufficient sources: {current_count}/{minimum}"

   IF current_count > maximum:
      HALT "Source overload: {current_count}/{maximum} - refine scope"

4. UPDATE baseline:
   baseline.sources_collected = current_count
```

OUTPUT: source_inventory = [{source, type, expected_contribution, priority}]

COUNTER-CHECK:
```
1. ASSUME we collected different sources
2. FOR each source_type:
   IDENTIFY highest-priority alternative not collected
   EVALUATE: Would it improve synthesis?
   IF YES: JUSTIFY why not collected (resource/time constraint)
   ELSE: CONFIRM current selection appropriate
3. RECORD alternatives_considered
```

REASONING LOG:
```
Assumption: Source selection criteria prioritize synthesis value
Evidence: [sources selected, priorities assigned]
Inference: [this set will enable synthesis]
Falsification: [what would show selection was poor - e.g., inability to find contradictions, excessive redundancy]
Confidence: [H/M/L based on source availability and diversity]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [sources collected per type]
OMITTED: [source types from landscape not pursued + CUI BONO]
DEFERRED: [sources identified but not yet accessed]

SOURCE_TYPE_COVERAGE:
FOR each type in scope.types_needed:
   count = sources of this type
   IF count = 0: REQUIRE justification + CUI BONO
   RECORD coverage

IF any type OMITTED without CUI BONO: HALT "Undeclared source type omission"
```

### 01.2 Source Quality Assessment (#102)

TRIGGER: Sources collected and gated
ACTION:
```
LOAD data/method-procedures/102_Source_Quality_Assessment.md

EXECUTE:
1. DEFINE quality dimensions:
   Reliability:    consistently accurate? [H/M/L]
   Validity:       measures what claims? [H/M/L]
   Recency:        current? [H/M/L]
   Methodology:    rigorous? [H/M/L]
   Bias:           conflicts of interest? [N/L/H]
   Completeness:   covers scope? [H/M/L]
   Provenance:     traceable origin? [C/P/U]

2. FOR each source in source_inventory:

   a. SCORE on each dimension:
      EVALUATE source against dimension criteria
      ASSIGN score

   b. COMPUTE grade:
      grade = FUNCTION(scores):
         IF ALL(Rel, Val, Meth) >= M AND Bias <= L AND Prov = C: A
         ELSE IF MOST >= M AND Bias <= M: B
         ELSE IF SOME >= M: C
         ELSE: D

   c. FLAG if grade = D:
      WARN: Use only for triangulation, not primary evidence

   d. UPDATE source_inventory:
      source.quality_dimensions = scores
      source.grade = grade

3. ANALYZE distribution:
   COUNT sources by grade: A, B, C, D
   baseline.sources_quality_A = count_A
   baseline.sources_quality_B = count_B
   baseline.sources_quality_C = count_C
   baseline.sources_quality_D = count_D

4. ENFORCE threshold:
   IF count_A + count_B < 0.5 * total_sources:
      HALT "Quality threshold not met: need 50%+ grade A/B, have {percent}%"

5. RED FLAG check:
   IF ALL high-quality sources agree AND low-quality source disagrees:
      INVESTIGATE disagreement before proceeding
      REQUIRE: Explanation of disagreement source
```

OUTPUT: source_inventory (updated with quality assessments)

COUNTER-CHECK:
```
1. SELECT 3 random sources
2. FOR each:
   ASSUME quality is one grade different (better or worse)
   EVALUATE: How would synthesis change?
3. IF significant change:
   REVIEW quality assessment for those sources
   ADJUST if justified
4. RECORD sensitivity_to_quality_assessment
```

REASONING LOG:
```
Assumption: Quality dimensions capture source trustworthiness
Evidence: [assessment methodology, scores assigned]
Inference: [grade distribution adequate for synthesis]
Falsification: [what would show quality assessment failed - e.g., later discovering major source errors]
Confidence: [H if clear quality signals, M/L if ambiguous]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [all sources quality-assessed]
OMITTED: [quality dimensions not assessed + why]
QUALITY_JUSTIFICATION:
   FOR each source with grade < B:
      WHY included despite low quality?
      CUI_BONO if inclusion benefits agent (easier than finding better source)

IF low-quality source without justification: HALT "Unjustified low-quality inclusion"
```

### 01.3 Diversity Verification (#103)

TRIGGER: Quality assessed and gated (standard+ depth)
ACTION:
```
LOAD data/method-procedures/103_Diversity_Verification.md

EXECUTE:
1. ASSESS diversity across 5 dimensions:

   a. METHODOLOGICAL:
      methods_present = UNIQUE([source.method for source in inventory])
      CATEGORIES: [Quantitative, Qualitative, Empirical, Theoretical]
      coverage = LENGTH(methods_present) / 4
      methodological_diversity = IF coverage >= 0.5: GOOD
                                  ELSE IF >= 0.25: PARTIAL
                                  ELSE: POOR

   b. PERSPECTIVAL:
      perspectives = UNIQUE([source.perspective for source in inventory])
      CATEGORIES: [Technical, Business, User, Academic, Practitioner]
      coverage = LENGTH(perspectives) / 5
      perspectival_diversity = [GOOD/PARTIAL/POOR]

   c. DOMAIN:
      domains = UNIQUE([source.domain for source in inventory])
      IF LENGTH(domains) >= 3: GOOD
      ELSE IF >= 2: PARTIAL
      ELSE: POOR
      domain_diversity = [rating]

   d. TEMPORAL:
      years = [source.year for source in inventory]
      time_range = MAX(years) - MIN(years)
      IF time_range >= 10: GOOD
      ELSE IF >= 5: PARTIAL
      ELSE: POOR
      temporal_diversity = [rating]

   e. EPISTEMIC:
      certainties = UNIQUE([source.certainty_level for source in inventory])
      CATEGORIES: [Established fact, Emerging theory, Speculation]
      IF LENGTH(certainties) >= 2: GOOD
      ELSE: POOR
      epistemic_diversity = [rating]

2. CLUSTER ANALYSIS:
   GROUP sources by similarity (method + perspective + domain)
   IDENTIFY clusters

   IF largest_cluster > 0.6 * total_sources:
      WARN: "Biased toward cluster: {largest_cluster description}"
      underrepresented = OTHER_CLUSTERS
      FLAG: Consider seeking sources from underrepresented

3. COMPUTE overall diversity:
   dimensions_GOOD = COUNT([d for d in diversities if d = GOOD])

   baseline.diversity_dimensions_covered = dimensions_GOOD

   IF dimensions_GOOD >= 3:
      diversity_status = ADEQUATE
   ELSE IF dimensions_GOOD >= 2:
      diversity_status = PARTIAL
   ELSE:
      diversity_status = POOR

4. ENFORCE minimum:
   IF diversity_status = POOR AND scope.low_diversity_flag = OFF:
      HALT "Diversity insufficient: need 2+/5 dimensions GOOD"
```

OUTPUT: diversity_assessment = {dimension_scores, cluster_analysis, diversity_status}

COUNTER-CHECK:
```
1. ASSUME we added sources from underrepresented dimensions/clusters
2. ESTIMATE impact on synthesis
3. EVALUATE:
   IF high impact AND feasible: SEEK additional sources
   ELSE: DOCUMENT limitation
4. RECORD diversity_limitation_impact
```

REASONING LOG:
```
Assumption: Diversity across dimensions reduces bias
Evidence: [diversity scores, cluster distribution]
Inference: [diversity adequate/inadequate for reliable synthesis]
Falsification: [what would show diversity assessment wrong - e.g., discovering major perspective completely missing]
Confidence: [H if comprehensive coverage, M/L if gaps]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [diversity assessed across all 5 dimensions]
OMITTED: [dimensions not assessed + why - e.g., "TEMPORAL omitted - all sources recent by necessity"]
UNDERREPRESENTED:
   clusters/perspectives with <20% coverage
   JUSTIFY: Why not increasing coverage?
   CUI_BONO on each

IF underrepresentation without justification: HALT "Undeclared diversity gap"
```

### 01.4 Counter-Source Search (#105)

TRIGGER: Diversity verified (rigorous+ OR low_diversity_flag=ON)
ACTION:
```
LOAD data/method-procedures/105_Counter_Source_Search.md

EXECUTE:
1. IDENTIFY emerging consensus:
   ANALYZE source_inventory for common claims
   convergent_claims = CLAIMS where >50% sources agree

2. FOR each convergent_claim:

   a. FORMULATE contradiction:
      counter_claim = NOT(convergent_claim)

   b. SEARCH for sources supporting counter_claim:
      ACTIVE SEARCH in:
         - Alternative research traditions
         - Dissenting experts
         - Contrarian literature
         - Falsification attempts
         - Critical reviews

   c. IF counter_source found:
      ADD to source_inventory
      MARK as counter_source
      priority = HIGH

   d. STEEL-MAN counter_source:
      Present STRONGEST version of counter-argument
      DOCUMENT: Why this view exists, what evidence supports it

3. IF NO counter_source found for critical claim:
   CLASSIFY:
   [ ] Consensus very strong (rare - requires extraordinary evidence)
   [ ] Not searching hard enough (common - expand search)

   REQUIRE: Justification for no counter-source

4. SUSPICIOUS ABSENCE check:
   IF real_knowledge_domain AND no_disagreement:
      FLAG: "Absence of disagreement suspicious - all domains have contested areas"
      REQUIRE: Extended counter-source search OR accept limitation
```

OUTPUT: counter_sources = [{source, counter_claim, steel_man_argument}]

COUNTER-CHECK:
```
1. SELECT strongest convergent_claim
2. GENERATE strongest possible counter-argument (even if no source found)
3. EVALUATE:
   IF counter-argument has merit: EXPLAIN why not found in sources
   ELSE: CONFIRM convergence justified
4. RECORD counter_argument_quality
```

REASONING LOG:
```
Assumption: Valuable knowledge domains have disagreement
Evidence: [counter-sources found/not found, search methods]
Inference: [consensus strength, search adequacy]
Falsification: [finding major counter-source after claiming none exist]
Confidence: [L if no counter-sources, M if some, H if diverse counter-sources]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [convergent claims analyzed, counter-sources sought]
OMITTED: [claims not counter-searched + why]
NO_COUNTER_FOUND:
   FOR each claim with no counter-source:
      JUSTIFY: Extraordinary consensus OR search limitation?
      CUI_BONO: Does "no counter" benefit agent (easier synthesis)?

IF omitted counter-search without justification: HALT "Incomplete counter-search"
```

### 01.5 Grounding Check (#085)

TRIGGER: Counter-sources added (if applicable)
ACTION:
```
LOAD methods/method-procedures/085_Grounding_Check.md

EXECUTE:
1. LIST all assumptions in source collection:
   EXPLICIT assumptions (stated):
      - Sources exist at expected locations
      - Quality indicators are reliable
      - Diversity dimensions are adequate

   HIDDEN assumptions (unstated):
      - Our search methods find relevant sources
      - Quality assessment criteria are valid
      - Source selection not biased by accessibility

   RECORD: assumptions_list

2. FOR each assumption:

   a. FIND evidence supporting assumption:
      evidence = [facts/observations that support]

   b. ANALYZE impact if false:
      IF assumption false:
         impact = [what breaks in synthesis]
         severity = [LOW/MEDIUM/HIGH/CRITICAL]

   c. CUI_BONO check:
      WHO benefits if assumption goes unchallenged?
      IF agent benefits: FLAG for extra scrutiny

3. TEST critical assumptions:
   FOR assumption with severity >= HIGH:
      ATTEMPT falsification:
         - Seek counter-evidence
         - Test edge cases
         - Check alternatives

      RESULT: [assumption holds / weakened / falsified]

      IF falsified: HALT "Critical assumption failed: {assumption}"

4. DOCUMENT grounding:
   grounding_report = {
     assumptions: assumptions_list,
     evidence_per_assumption: {assumption: evidence},
     impact_analysis: {assumption: (impact, severity)},
     cui_bono_flags: [flagged assumptions],
     test_results: {critical_assumption: result}
   }
```

OUTPUT: grounding_report

COUNTER-CHECK:
```
1. ASSUME one hidden assumption is false
2. TRACE impact through source collection
3. EVALUATE: Would it change source set significantly?
4. IF YES: Test that assumption more rigorously
5. RECORD assumption_sensitivity
```

REASONING LOG:
```
Assumption: [meta] Our assumption identification is complete
Evidence: [systematic scan of ACQUIRE process]
Inference: [assumptions documented and tested]
Falsification: [discovering undocumented assumption later]
Confidence: [M - assumptions are often invisible]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [assumptions identified and tested]
OMITTED: [assumption types not examined + why]
UNTESTED_ASSUMPTIONS:
   Assumptions with severity >= MEDIUM not tested
   JUSTIFY each
   CUI_BONO if benefits agent

IF untested critical assumption: HALT "Critical assumption untested"
```

### 01.6 Staleness Detection (#169)

TRIGGER: Grounding checked
ACTION:
```
LOAD methods/method-procedures/169_Staleness_Detection.md

EXECUTE:
1. FOR each source in source_inventory:

   a. EXTRACT temporal markers:
      publication_date = source.date
      last_updated = source.last_modification (if applicable)
      domain_change_rate = domain.typical_change_frequency

   b. COMPUTE staleness:
      age = NOW() - publication_date

      staleness_category = FUNCTION(age, domain_change_rate):
         IF age < domain_change_rate * 0.5: FRESH
         ELSE IF age < domain_change_rate * 1.5: AGING
         ELSE IF age < domain_change_rate * 3: STALE
         ELSE: CRITICAL

   c. IF staleness >= STALE:
      SEARCH for updated version OR newer sources on same topic

      IF found:
         REPLACE old source with new
      ELSE:
         FLAG: Stale source, no replacement available
         DOCUMENT limitation

2. ANALYZE staleness distribution:
   counts = COUNT_BY_CATEGORY(source_inventory.staleness)

   IF counts.STALE + counts.CRITICAL > 0.3 * total:
      WARN: "High staleness - synthesis may miss recent developments"

3. DOMAIN-SPECIFIC staleness thresholds:
   EXAMPLES:
   - Technology: change_rate = 2 years
   - Medicine: change_rate = 5 years
   - Philosophy: change_rate = 20 years
   - History: change_rate = 50 years

   ADJUST thresholds per domain
```

OUTPUT: staleness_report = {source_staleness_per_source, distribution, warnings}

COUNTER-CHECK:
```
1. SELECT stalest source
2. SEARCH for newer literature on same topic
3. IF found:
   COMPARE: Do newer sources contradict older?
   EVALUATE: Should we include newer?
4. RECORD temporal_sensitivity
```

REASONING LOG:
```
Assumption: Staleness thresholds match domain change rates
Evidence: [domain analysis, source ages]
Inference: [staleness assessment]
Falsification: [finding that old source is outdated by new evidence]
Confidence: [H if fresh sources, L if stale]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [all sources checked for staleness]
OMITTED: [sources not checked + why]
STALE_ACCEPTED:
   Sources with staleness >= STALE that we keep
   JUSTIFY each: Why no replacement?
   CUI_BONO if keeping stale is easier than finding fresh

IF stale source without justification: HALT "Unjustified stale source"
```

## VERIFY PHASE

### 01.V Liar's Trap (#056)

TRIGGER: All ACQUIRE methods executed
ACTION:
```
LOAD methods/method-procedures/056_Liars_Trap.md

EXECUTE:
DEMAND: List 3 ways agent could DECEIVE user in source collection

DECEPTION METHODS:
1. [How could hide inadequate source diversity?]
2. [How could inflate source quality grades?]
3. [How could avoid finding counter-sources?]

FOR each method:
   PROVIDE concrete evidence method NOT used:
   Method 1 NOT used because: [evidence]
   Method 2 NOT used because: [evidence]
   Method 3 NOT used because: [evidence]

VERIFICATION:
IF any method lacks evidence: HALT "Potential deception unaddressed"
```

OUTPUT: deception_check_report

### 01.V2 Mirror Trap (#057)

TRIGGER: Liar's Trap passed
ACTION:
```
LOAD methods/method-procedures/057_Mirror_Trap.md

EXECUTE:
1. CONSTRUCT dishonest_version:
   "What would DISHONEST agent wanting to finish quickly say about source collection?"

   dishonest_claims = [
     "Found sufficient diverse sources",
     "Quality assessed rigorously",
     "No counter-sources exist",
     "Thoroughly searched all types"
   ]

2. COMPARE actual output vs dishonest_version:
   FOR each claim:
      similarity = MEASURE(actual_output, dishonest_claim)
      IF similarity > 0.5:
         FLAG: "Too similar to dishonest version"
         REQUIRE: Revision with more specificity

3. HONEST_MARKERS that should differentiate:
   - Specific source counts and gaps
   - Explicit limitations admitted
   - Counter-sources found and steel-manned
   - Staleness issues documented
   - Quality distribution shown (not just "high quality")

VERIFICATION:
IF similarity > 50% on any claim: REQUIRE revision
```

OUTPUT: mirror_trap_report = {similarities, honest_markers_present}

### 01.V3 CUI BONO Omnibus (#059)

TRIGGER: Mirror Trap passed
ACTION:
```
LOAD methods/method-procedures/059_CUI_BONO_Test.md

EXECUTE:
REVIEW all decisions in ACQUIRE:

DECISIONS:
- Which sources to collect
- Which types to omit
- Quality threshold set
- Diversity standard accepted
- Counter-search depth
- Staleness tolerance

FOR each decision:
   1. IDENTIFY beneficiary:
      WHO benefits from this decision?
      Options: [USER, SYNTHESIS_QUALITY, AGENT_EASE]

   2. IF beneficiary = AGENT_EASE:
      REQUIRE justification:
         - Resource constraint (time/access)
         - Diminishing returns
         - User-specified limitation

      IF no justification: HALT "Decision benefits agent without justification"

   3. DOCUMENT:
      Decision: [what]
      Beneficiary: [who]
      Justification: [why - if agent benefits]
```

OUTPUT: cui_bono_analysis = {decision_beneficiary_map, unjustified_flags}

VERIFICATION:
```
PASS IF: All agent-benefiting decisions have valid justification
FAIL IF: Any unjustified agent-benefit detected
```

## RENDER PHASE

### 01.R Source Inventory Deliverable

TRIGGER: All verifications passed
ACTION:
```
1. COMPILE source inventory deliverable:

---SOURCE INVENTORY---
SOURCES_COLLECTED: {count}
DEPTH: {depth}
BASELINE: {baseline metrics}

QUALITY_DISTRIBUTION:
Grade A (high confidence): {count_A} sources
Grade B (moderate): {count_B} sources
Grade C (use with caution): {count_C} sources
Grade D (triangulation only): {count_D} sources

DIVERSITY_STATUS:
Methodological: {methodological_diversity}
Perspectival: {perspectival_diversity}
Domain: {domain_diversity}
Temporal: {temporal_diversity}
Epistemic: {epistemic_diversity}
OVERALL: {diversity_status}

COUNTER-SOURCES: {count} found
{list of counter-sources with counter-claims}

STALENESS: {fresh}/{aging}/{stale}/{critical} distribution
WARNINGS: {staleness warnings if any}

LIMITATIONS:
{documented gaps, omissions, constraints}

GROUNDING:
Critical assumptions: {list}
Tested assumptions: {results}

VERIFICATION_RESULTS:
Liar's Trap: PASSED
Mirror Trap: PASSED
CUI BONO: PASSED

PROCEED_TO_DECOMPOSE: {YES/NO}
---END INVENTORY---

2. IF PROCEED = YES:
   Status = READY
ELSE:
   Status = NEEDS_MORE_SOURCES
   Required_actions = {list what's needed}
```

OUTPUT: source_inventory_deliverable

FINAL GATE:
```
ACQUIRE_COMPLETE = CHECK ALL:
[ ] Baseline census established
[ ] Sources collected (minimum met)
[ ] Quality assessed (threshold met)
[ ] Diversity verified (adequate/documented)
[ ] Counter-sources sought (found/justified)
[ ] Grounding checked (assumptions tested)
[ ] Staleness detected (addressed)
[ ] All binding gates passed
[ ] All verifications passed (Liar's/Mirror/CUI BONO)
[ ] Deliverable compiled

IF all checked: PROCEED
ELSE: HALT "ACQUIRE incomplete: " + list_unchecked
```

## TRANSITION

```
IF FINAL GATE passed AND proceed_to_decompose = YES:
   LOAD steps/step-02-decompose.md

ELSE IF diversity_status = POOR AND gaps_addressable:
   LOOP to 01.1 with gap-filling strategy

ELSE IF quality threshold not met:
   DECISION POINT:
   ASK USER: "Quality below threshold. Proceed with lower confidence? Y/N"
   IF Y: LOWER confidence_ceiling, PROCEED
   IF N: LOOP to 01.1 to find better sources

ELSE IF no_counter_sources found AND claim is critical:
   DECISION POINT:
   ASK USER: "No counter-sources found for critical claims. Accept as limitation? Y/N"
   IF Y: FLAG limitation, PROCEED
   IF N: LOOP to 01.4 with extended search

ELSE IF iteration_count < max_iterations:
   EVALUATE: What needs improvement?
   LOOP to appropriate sub-step

ELSE:
   HALT "ACQUIRE phase cannot meet requirements within iteration limit"
```

## COMPLIANCE

Zasady spełnione:
✓ 0-13 All rules implemented
