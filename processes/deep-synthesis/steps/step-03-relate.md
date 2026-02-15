# STEP 03: RELATE

## EXTRACT PHASE

### 03.1 Convergence-Divergence Mapping (#301)

TRIGGER: Entering RELATE phase
ACTION:
```
LOAD data/method-procedures/301_Convergence_Divergence_Mapping.md

EXECUTE:
1. BUILD claim relationship matrix:

   FOR each claim pair (claim_i, claim_j) where i < j:

      ANALYZE relationship:

      AGREE (convergence):
      - Same assertion
      - Support each other
      - Complementary (address different aspects of same thing)

      DISAGREE (divergence):
      - Contradict directly
      - Incompatible implications
      - Different conclusions from same evidence

      ORTHOGONAL:
      - Address different topics
      - No logical relationship
      - Independent domains

      ASSIGN: relationship(i,j) = [AGREE|DISAGREE|ORTHOGONAL|UNKNOWN]

      IF AGREE:
         strength = [STRONG|MODERATE|WEAK]
         evidence = [what makes them converge]

      IF DISAGREE:
         conflict_type = [direct|implicit|scope|definition]
         severity = [CRITICAL|HIGH|MEDIUM|LOW]

2. COMPUTE convergence metrics:

   total_pairs = n_claims * (n_claims - 1) / 2
   convergent = COUNT(AGREE)
   divergent = COUNT(DISAGREE)
   orthogonal = COUNT(ORTHOGONAL)

   convergence_rate = convergent / total_pairs
   divergence_rate = divergent / total_pairs

3. IDENTIFY convergence clusters:

   CLUSTER claims that mutually support:
   cluster = SET of claims with pairwise AGREE

   FOR each cluster:
      cluster_strength = AVERAGE(pairwise agreement strengths)
      cluster_sources = UNION(claim sources in cluster)

      IF cluster_sources all from same source:
         WARN: "Convergence may be echo chamber"

      IF cluster_sources diverse:
         CONFIDENCE: HIGH (triangulation achieved)

4. IDENTIFY divergence hot-spots:

   FOR each claim with many DISAGREE relationships:
      contested_claim = claim with >30% disagreement rate
      opposing_camps = PARTITION sources by stance on claim

      RECORD: {
        claim: contested_claim,
        support: [sources supporting],
        oppose: [sources opposing],
        controversy_level: disagreement_rate
      }

5. MAP convergence/divergence to synthesis question:

   FOR synthesis question Q:
      sub_questions = decomposition of Q

      FOR each sub_q:
         convergence_on_subq = claims converging on this sub-question
         divergence_on_subq = claims diverging on this sub-question

         IF convergence > 70%: sub_q has consensus
         IF divergence > 30%: sub_q is contested
         IF both low: sub_q is under-explored
```

OUTPUT: relationship_matrix = {
  claim_pairs: [(i,j,relationship,strength/severity)],
  convergence_clusters: [clusters],
  contested_claims: [hot-spots],
  consensus_map: {sub_question: convergence_level}
}

COUNTER-CHECK:
```
1. SELECT cluster with highest convergence
2. CHALLENGE: Are these claims really independent?
3. CHECK for:
   - Same source (not independent)
   - Circular reasoning
   - Shared unfounded assumption
4. IF dependent: DOWNGRADE cluster strength
5. RECORD false_convergence_instances
```

REASONING LOG:
```
Assumption: Convergence from diverse sources indicates truth
Evidence: [cluster analysis, source diversity]
Inference: [convergent claims have high confidence]
Falsification: [all sources wrong due to shared bias]
Confidence: [H if diverse convergence, M if limited diversity, L if echo chamber]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [all claim pairs analyzed]
OMITTED: [relationship types not assessed + why]
CONTESTED_UNRESOLVED:
   Critical contested claims: [list]
   Next step: [resolve in INTEGRATE | accept as limitation]
   CUI_BONO if leaving contested (easier than resolving)

IF critical contest unacknowledged: HALT "Unrecognized controversy"
```

### 03.2 Dialectical Tension Mapping (#302)

TRIGGER: Convergence-divergence mapped
ACTION:
```
LOAD data/method-procedures/302_Dialectical_Tension_Mapping.md

EXECUTE:
1. IDENTIFY thesis-antithesis pairs:

   FOR each contested_claim from 03.1:

      IF controversy_level >= 0.3:

         FORMULATE thesis:
         thesis = strongest version of majority position
         thesis_sources = sources supporting
         thesis_evidence = best evidence for thesis

         FORMULATE antithesis:
         antithesis = strongest version of minority position
         antithesis_sources = sources opposing
         antithesis_evidence = best evidence for antithesis

         STEEL-MAN both positions:
         - Present each in strongest possible form
         - Include best evidence
         - Acknowledge valid points

         ADD: {
           tension_id: id,
           thesis: {claim, sources, evidence},
           antithesis: {claim, sources, evidence},
           domain: relevant_domain,
           synthesis_potential: [HIGH|MEDIUM|LOW|IMPOSSIBLE]
         }

2. ANALYZE tension types:

   FOR each tension:

      CLASSIFY:

      HEGELIAN (productive contradiction):
      - Thesis and antithesis address different aspects
      - Synthesis possible at higher level
      - Both contain partial truth

      PARADIGMATIC (Kuhn):
      - Incommensurable frameworks
      - Different basic assumptions
      - Translation difficult

      DEFINITIONAL:
      - Different term meanings
      - Resolvable by clarification
      - Not genuine disagreement

      EMPIRICAL:
      - Different evidence
      - Resolvable by more data
      - Factual matter

      NORMATIVE:
      - Different values
      - No empirical resolution
      - Depends on goals

3. ASSESS synthesis potential:

   FOR each tension:

      IF type = DEFINITIONAL:
         synthesis_potential = HIGH (resolve via taxonomy)

      IF type = EMPIRICAL:
         synthesis_potential = MEDIUM (need more evidence)

      IF type = HEGELIAN:
         synthesis_potential = HIGH (dialectical integration)

      IF type = PARADIGMATIC:
         synthesis_potential = LOW (may need meta-framework)

      IF type = NORMATIVE:
         synthesis_potential = IMPOSSIBLE (value judgment)
         resolution = acknowledge both, let user decide

4. PRIORITIZE tensions for INTEGRATE phase:

   PRIORITY = FUNCTION(controversy_level, synthesis_potential, criticality):
      IF criticality=HIGH AND synthesis_potential>=MEDIUM: PRIORITY=1
      ELSE IF synthesis_potential=HIGH: PRIORITY=2
      ELSE: PRIORITY=3

   SORT tensions by priority
```

OUTPUT: dialectical_tensions = [{tension, type, synthesis_potential, priority}]

COUNTER-CHECK:
```
1. SELECT highest-priority tension
2. ATTEMPT preliminary synthesis:
   Generate candidate synthesis that preserves truth of both
3. EVALUATE:
   IF synthesis easy: Confirm HIGH potential
   IF synthesis hard: DOWNGRADE potential
4. RECORD synthesis_difficulty_estimate
```

REASONING LOG:
```
Assumption: Dialectical tensions can be productively synthesized
Evidence: [tension analysis, type classification]
Inference: [synthesis strategy per tension]
Falsification: [attempting synthesis and failing]
Confidence: [H if HEGELIAN, M if EMPIRICAL, L if PARADIGMATIC]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [tensions identified, classified, prioritized]
OMITTED: [tension types not explored + why]
IMPOSSIBLE_TENSIONS:
   Tensions marked IMPOSSIBLE synthesis: [list]
   JUSTIFY: Why impossible?
   Plan: [how to handle in final synthesis]
   CUI_BONO if giving up on synthesis (easier)

IF impossible without justification: REQUIRE attempt OR strong argument
```

### 03.3 Analogical Structure Mapping (#303)

TRIGGER: Tensions mapped (standard+)
ACTION:
```
LOAD data/method-procedures/303_Analogical_Structure_Mapping.md

EXECUTE (Gentner's Structure Mapping Theory):

1. IDENTIFY source domains in sources:

   FOR each source:
      domain = [field/discipline it originates from]

   unique_domains = UNIQUE(domains)

   IF LENGTH(unique_domains) < 2:
      SKIP analogical mapping (need multiple domains)
      RETURN

2. FOR each domain pair (domain_A, domain_B):

   a. EXTRACT structures from domain_A:

      entities_A = [objects/concepts]
      relations_A = [relationships between entities]
      higher_order_A = [relationships between relations]

      structure_A = {entities, relations, higher_order}

   b. EXTRACT structures from domain_B:

      structure_B = {entities, relations, higher_order}

   c. FIND structural parallels (isomorphisms):

      SYSTEMACITY PRINCIPLE:
      - Match higher-order relations first
      - Then match lower-order relations
      - Finally match entities

      FOR each relation_A in structure_A.higher_order:
         SEARCH for relation_B with same structure:

         IF FOUND:
            mapping.add(relation_A ↔ relation_B)

            FOR entities in relation_A:
               MAP to corresponding entities in relation_B

   d. EVALUATE mapping quality:

      systematicity = depth of structural match
      clarity = unambiguous mappings / total mappings
      fertility = new insights generated

      quality_score = (systematicity + clarity + fertility) / 3

      IF quality_score > 0.6:
         ACCEPT analogy as valid

3. TRANSFER insights across domains:

   FOR each accepted analogy:

      a. IDENTIFY solution in source domain:
         IF domain_A has solved problem P_A:
            structure_solution_A = how P_A was solved

      b. TRANSFER to target domain:
         problem_B = MAPPED(problem_A)
         candidate_solution_B = APPLY(structure_solution_A, domain_B)

      c. VALIDATE transfer:
         CHECK: Does candidate_solution_B respect domain_B constraints?
         TEST: Novel predictions?

         IF valid: RECORD as cross-domain insight
         ELSE: RECORD as failed transfer (interesting failure)

4. DOCUMENT analogies:

   analogy = {
     source_domain: domain_A,
     target_domain: domain_B,
     structural_mapping: mappings,
     transferred_insights: insights,
     quality_score: score
   }
```

OUTPUT: analogies = [{source, target, mapping, insights, quality}]

COUNTER-CHECK:
```
1. SELECT highest-quality analogy
2. CHALLENGE: Is this genuine structural parallel or surface similarity?
3. TEST:
   - Do disanalogous features exist?
   - Does structure break down under scrutiny?
4. IF surface similarity: REJECT or DOWNGRADE
5. RECORD analogy_robustness
```

REASONING LOG:
```
Assumption: Structural isomorphisms enable cross-domain transfer
Evidence: [mappings found, quality scores]
Inference: [these analogies valid for synthesis]
Falsification: [transferred insight fails in target domain]
Confidence: [H if high systematicity, M if partial, L if shallow]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [domains analyzed for analogies]
OMITTED: [domain pairs not compared + why]
FAILED_ANALOGIES:
   Attempted mappings that failed: [list]
   Why failed: [explanation]
   CUI_BONO if not attempting (easier)

IF promising domain pair not explored: JUSTIFY
```

### 03.4 Pattern Detection Across Sources (#306)

TRIGGER: Analogies mapped (standard+)
ACTION:
```
LOAD data/method-procedures/306_Pattern_Detection_Across_Sources.md

EXECUTE:
1. IDENTIFY recurring patterns:

   PATTERN TYPES:

   a. STRUCTURAL patterns:
      IF multiple sources describe similar structure:
         EXAMPLE: "X influences Y, Y affects Z, Z feeds back to X"
         PATTERN: feedback loop

   b. CAUSAL patterns:
      IF multiple sources cite similar causal chains:
         EXAMPLE: "A causes B causes C"
         PATTERN: causal cascade

   c. TEMPORAL patterns:
      IF events follow similar sequence across cases:
         EXAMPLE: "phase 1 → crisis → phase 2"
         PATTERN: punctuated equilibrium

   d. CONDITIONAL patterns:
      IF same condition-outcome appears:
         EXAMPLE: "when X and Y, then Z"
         PATTERN: conjunction rule

2. VERIFY pattern validity:

   FOR each candidate pattern:

      a. COUNT occurrences:
         instances = sources/cases exhibiting pattern
         IF instances < 3: NOT A PATTERN (insufficient evidence)

      b. CHECK independence:
         IF all instances from same source/author:
            WARN: May be author's bias, not real pattern

         IF instances from diverse sources:
            CONFIDENCE: Pattern likely real

      c. TEST exceptions:
         counter_instances = cases where pattern doesn't hold

         pattern_strength = instances / (instances + counter_instances)

         IF strength < 0.6: WEAK PATTERN
         IF strength >= 0.6 AND < 0.8: MODERATE
         IF strength >= 0.8: STRONG

      d. ALTERNATIVE explanations:
         Could pattern be:
         - Confirmation bias (we see it because we look for it)?
         - Coincidence?
         - Artifact of sampling?

         REQUIRE: Rule out alternatives

3. DISTINGUISH real patterns from apophenia:

   APOPHENIA CHECK (method #601):

   FOR each pattern:

      a. GENERATE null model:
         What would random data look like?
         Statistical significance: p-value

      b. COMPARE observed vs null:
         IF pattern not significantly different from random:
            REJECT as apophenia

      c. DEMAND mechanism:
         WHY does this pattern exist?
         IF no plausible mechanism: SUSPICIOUS

      d. PREDICTIVE TEST:
         Does pattern predict new cases?
         IF fails prediction: REJECT

4. SYNTHESIZE patterns into higher-order insights:

   COMBINE patterns:
   - Pattern A + Pattern B → Meta-pattern C

   EXAMPLE:
   - Feedback loops (structural) + Time delays (temporal)
   → Oscillatory behavior (emergent pattern)
```

OUTPUT: patterns = [{pattern, type, strength, instances, mechanism, confidence}]

COUNTER-CHECK:
```
1. SELECT strongest pattern
2. DELIBERATELY seek counter-examples
3. IF found: UPDATE pattern strength
4. EVALUATE: Would synthesis change without this pattern?
5. RECORD pattern_necessity
```

REASONING LOG:
```
Assumption: Patterns recurring across diverse sources are real
Evidence: [pattern instances, independence, strength]
Inference: [these patterns are synthesis-worthy]
Falsification: [pattern fails in new case]
Confidence: [H if strong+diverse, M if moderate, L if weak]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [sources scanned for patterns]
OMITTED: [pattern types not sought + why]
POTENTIAL_APOPHENIA:
   Patterns flagged as possibly spurious: [list]
   Resolution: [kept with caveat | rejected]
   CUI_BONO if keeping weak patterns (inflates findings)

IF weak pattern without caveat: REQUIRE justification OR removal
```

### 03.5 Causal Chain Reconciliation (#305)

TRIGGER: Patterns detected (rigorous+)
ACTION:
```
LOAD data/method-procedures/305_Causal_Chain_Reconciliation.md

EXECUTE:
1. EXTRACT causal claims:

   FOR each claim in claims_list:
      IF claim asserts causation:
         PARSE: cause → effect

         causal_claim = {
           cause: X,
           effect: Y,
           mechanism: [how X causes Y],
           source: source_id,
           evidence: evidence_grade,
           conditions: [when does X cause Y]
         }

2. BUILD causal graph:

   NODES = all entities mentioned in causal claims
   EDGES = causal relationships (directed)

   FOR each causal_claim:
      ADD_EDGE(cause → effect)
      LABEL_EDGE(mechanism, strength=evidence_grade)

3. IDENTIFY competing causal explanations:

   FOR same (cause, effect) pair:
      IF multiple mechanisms proposed:
         COMPETING_MECHANISMS = list of alternatives

         EVALUATE each:
         - Evidence strength
         - Mechanistic plausibility
         - Scope (when applicable)

         RECONCILIATION strategies:
         a. NESTED: One mechanism is special case of another
         b. PARALLEL: Multiple mechanisms operate simultaneously
         c. CONDITIONAL: Different mechanisms in different conditions
         d. COMPETING: Only one is correct (requires choice)

4. DETECT causal loops:

   RUN cycle detection on graph:

   IF cycle found:
      CLASSIFY:
      - Feedback loop (legitimate): A → B → A
      - Circular reasoning (error): claiming A causes B causes A without mechanism

      IF legitimate:
         MARK as system dynamics insight
      IF circular:
         FLAG as logical error

5. TEST causal consistency:

   FOR each path in graph:
      TRACE: A → B → C → ... → Z

      CHECK transitive consistency:
      IF A causes B AND B causes C:
         Does A cause C indirectly?

      IF sources claim A does NOT cause C:
         CONFLICT detected

      RESOLVE or FLAG

6. IDENTIFY causal gaps:

   SCAN for:
   - Missing mediators: A → ? → C (what's in between?)
   - Unspecified mechanisms: A → B (HOW?)
   - Boundary conditions missing: When does A cause B?
```

OUTPUT: causal_model = {
  graph: {nodes, edges},
  competing_explanations: [{cause, effect, mechanisms}],
  loops: [feedback_loops],
  gaps: [missing_elements],
  conflicts: [inconsistencies]
}

COUNTER-CHECK:
```
1. SELECT central causal claim
2. ASSUME causation is reverse: Y → X instead of X → Y
3. CHECK: Can evidence support reverse?
4. IF YES: Causation uncertain, FLAG as correlation
5. RECORD causal_direction_confidence
```

REASONING LOG:
```
Assumption: Causal claims can be reconciled into coherent model
Evidence: [causal graph, reconciliations]
Inference: [unified causal understanding]
Falsification: [finding irreconcilable causal conflict]
Confidence: [H if convergent, M if competing, L if conflicting]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [causal claims extracted, reconciled]
OMITTED: [causal relationships not modeled + why]
UNRECONCILED_CONFLICTS:
   Causal conflicts not resolved: [list]
   Plan: [address in INTEGRATE | accept multiple models]
   CUI_BONO if leaving conflicted (easier)

IF critical conflict unresolved: REQUIRE resolution strategy
```

### 03.6 Level Alignment Check (#307)

TRIGGER: Causal chains reconciled (standard+)
ACTION:
```
LOAD data/method-procedures/307_Level_Alignment_Check.md

EXECUTE:
1. RECALL target_level from SCOPE phase

2. VERIFY claims operate at consistent level:

   FOR each claim:
      IDENTIFY claim's level:
      - ATOMIC: specific facts/events
      - PATTERN: regularities across cases
      - STRUCTURAL: mechanisms/models
      - SYSTEMIC: whole-system dynamics
      - PARADIGMATIC: fundamental assumptions

      claim.level = detected_level

3. DETECT level mixing errors:

   FOR relationship (claim_i → claim_j):
      IF claim_i.level ≠ claim_j.level:

         CHECK if relationship crosses levels legitimately:

         LEGITIMATE:
         - Micro-macro link: atomic → systemic
         - Emergence: pattern → structural
         - Foundation: paradigmatic → structural

         ILLEGITIMATE (ecological fallacy / atomistic fallacy):
         - Applying group-level claim to individual
         - Applying individual-level claim to group
         - No mechanistic connection

         IF illegitimate:
            FLAG: Level confusion error
            SEVERITY: HIGH

4. ALIGN synthesis to target level:

   FOR synthesis_question:
      target_level = scope.target_level

      PARTITION claims by level:
      at_target = claims at target_level
      above_target = claims at higher level
      below_target = claims at lower level

      STRATEGY:
      - Primary synthesis: use at_target claims
      - Supporting detail: use below_target (contextualize)
      - Broader context: use above_target (frame)

      REQUIREMENT:
      Core synthesis conclusions MUST be at target_level

5. DOCUMENT cross-level transfers:

   FOR each insight that crosses levels:
      JUSTIFY:
      - What mediates the level jump?
      - Is transfer valid in both directions?
      - Scope limitations?

      EXAMPLE:
      "Individual developer productivity (atomic)
       does NOT linearly scale to team productivity (systemic)
       because: emergent coordination overhead"
```

OUTPUT: level_alignment_report = {
  claim_levels: {claim_id: level},
  level_mixing_errors: [flagged_errors],
  alignment_strategy: how synthesis will handle levels
}

COUNTER-CHECK:
```
1. SELECT claim about groups/systems
2. CHECK: Does it improperly derive from individual-level data?
3. SIMPSON'S PARADOX test:
   Could aggregate finding reverse at subgroup level?
4. IF possible: FLAG ecological fallacy risk
5. RECORD level_crossing_validity
```

REASONING LOG:
```
Assumption: Level alignment prevents fallacies
Evidence: [level classification, error detection]
Inference: [synthesis at correct level]
Falsification: [finding conclusions don't hold at target level]
Confidence: [H if clear levels, M if some mixing, L if confused]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [claims classified by level, alignment checked]
OMITTED: [level types not considered + why]
LEVEL_ERRORS:
   Illegitimate level crossings: [list]
   Corrected: [list of corrections]
   Accepted: [list with justification]
   CUI_BONO if ignoring level errors (easier)

IF uncorrected level error: REQUIRE fix OR strong justification
```

### 03.7 Topological Hole Detection (#086)

TRIGGER: Level alignment checked
ACTION:
```
LOAD methods/method-procedures/086_Topological_Hole_Detection.md

EXECUTE:
1. BUILD relationship graph:

   NODES = all claims, concepts, models
   EDGES = all relationships (logical, causal, evidential)

   graph = {nodes, edges}

2. DETECT structural holes:

   a. DEAD ENDS:
      nodes with no outgoing edges AND high importance

      QUESTION: Why does reasoning stop here?
      FLAG: Potential missing connections

   b. CYCLES WITHOUT CLOSURE:
      A → B → C → A

      IF cycle doesn't resolve to external grounding:
         FLAG: Circular reasoning without foundation

   c. HIGH-INBOUND, NO-OUTBOUND:
      node with many inputs but no outputs

      PATTERN: "Black hole" - information goes in, nothing comes out
      FLAG: Synthesis implications unclear

   d. ISOLATED CLUSTERS:
      connected components not connected to main graph

      QUESTION: Why is this separate?
      FLAG: Integration opportunity

3. APPLY abstraction filtering:

   REMOVE low-level detail nodes
   RE-ANALYZE at higher abstraction

   CHECK: Do holes persist?

   PERSISTENT holes = structural issues
   TRANSIENT holes = detail-level artifacts

4. COMPUTE graph metrics:

   - Connectivity: strongly connected components
   - Centrality: which nodes are most central?
   - Clustering coefficient: local coherence
   - Path lengths: degrees of separation

   ANOMALIES:
   - Very high centrality (over-reliance on one claim)
   - Very low clustering (incoherent)
   - Very long paths (distant connections)

5. PRIORITIZE holes for filling:

   FOR each hole:
      impact = IF blocks synthesis conclusion: CRITICAL
               ELSE IF reduces coherence: HIGH
               ELSE: MEDIUM

      effort = [LOW | MEDIUM | HIGH] to fill

      priority = impact / effort

   SORT by priority
```

OUTPUT: topology_report = {
  graph_metrics: metrics,
  holes: [dead_ends, cycles, black_holes, isolated_clusters],
  priorities: sorted_holes
}

VERIFICATION:
```
PASS IF: No CRITICAL holes unfilled
WARN IF: Multiple HIGH holes
```

## VERIFY PHASE

(Apply Liar's Trap, Mirror Trap, CUI BONO similar to previous phases)

## RENDER PHASE

### 03.R Relationship Deliverable

TRIGGER: All verifications passed
ACTION:
```
COMPILE:

---RELATIONSHIP MAPPING---
CONVERGENCE_RATE: {percentage}
DIVERGENCE_RATE: {percentage}
CONSENSUS_AREAS: {list}
CONTESTED_AREAS: {list}

DIALECTICAL_TENSIONS: {count}
  High-priority: {count}
  Synthesis potential: {distribution}

ANALOGIES_FOUND: {count}
  Cross-domain insights: {list}

PATTERNS_IDENTIFIED: {count}
  Strong patterns: {count}
  Mechanisms: {list}

CAUSAL_MODEL:
  Nodes: {count}
  Edges: {count}
  Feedback loops: {count}
  Conflicts: {count}

LEVEL_ALIGNMENT: {target_level}
  Errors detected: {count}
  Corrected: {count}

TOPOLOGICAL_HOLES: {count}
  Critical: {count}
  Addressed: {count}

PROCEED_TO_INTEGRATE: {YES/NO}
---END RELATIONSHIPS---
```

FINAL GATE:
```
RELATE_COMPLETE = CHECK ALL:
[ ] Convergence-divergence mapped
[ ] Dialectical tensions identified
[ ] Analogies explored (standard+)
[ ] Patterns detected (standard+)
[ ] Causal chains reconciled (rigorous+)
[ ] Level alignment verified (standard+)
[ ] Topological holes detected
[ ] All binding gates passed
[ ] Deliverable compiled

IF all checked: PROCEED
ELSE: HALT "RELATE incomplete"
```

## TRANSITION

```
IF FINAL GATE passed:
   LOAD steps/step-04-integrate.md
ELSE:
   HALT with specifics
```
