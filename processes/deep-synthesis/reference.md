# Deep Synthesis V1.1 — Reference Documentation

> **This is reference documentation.** For execution, see [workflow.md](./workflow.md).

---

## CORE PHILOSOPHY

```
+-----------------------------------------------------------------------------+
|  DEEP SYNTHESIS = INTEGRATION + EMERGENCE + COMPRESSION + VALIDATION         |
+-----------------------------------------------------------------------------+
|                                                                              |
|  INPUT:   Multiple sources, diverse perspectives, knowledge fragments       |
|  OUTPUT:  GENUINE UNDERSTANDING                                              |
|           - Emergent insights not present in any single source              |
|           - Resolved contradictions or productive tensions                  |
|           - Compressed knowledge (shorter than sources, same essence)       |
|           - Falsifiable conclusions with boundary conditions                |
|           - Mental models and principles for future application             |
|                                                                              |
|  CORE PRINCIPLES:                                                           |
|  1. SYNTHESIS CREATES KNOWLEDGE — if no new insight, it's summarization    |
|  2. CONTRADICTION IS FUEL — disagreement drives deeper understanding        |
|  3. COMPRESSION IS THE MEASURE — good synthesis is shorter than sources     |
|  4. EMERGENCE IS THE GOAL — insights visible only in combination            |
|  5. FALSIFIABILITY IS THE CHECK — unfalsifiable synthesis is narrative      |
|  6. LEVEL MATTERS — same data at different levels = different conclusions   |
|  7. DIVERSE SOURCES > MANY SIMILAR — triangulation beats volume             |
|                                                                              |
|  UNIQUE ERROR TYPE: FALSE COHERENCE                                          |
|  Believing you've created genuine understanding when you've actually:       |
|  - Imposed a pattern that doesn't exist (apophenia)                         |
|  - Ignored contradicting evidence (confirmation bias)                        |
|  - Confused correlation with causation (causal illusion)                    |
|  - Created internally consistent but externally wrong model                 |
|  - Synthesized at the wrong level of abstraction                            |
|                                                                              |
|  INTEGRATION:                                                               |
|  - Consumes: Deep-Explore options, Deep-Verify findings, Deep-Risk register|
|  - Produces: Unified understanding for decisions, organizational learning  |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## THEORETICAL FOUNDATIONS

Deep Synthesis is grounded in foundational theories across epistemology, information theory, cognitive science, and philosophy of science. Full details: `data/theoretical-foundations.yaml`

### Quick Reference

| Principle | One-Line Summary | Applied In |
|-----------|------------------|------------|
| **Hegel's Dialectic (1807)** | Thesis + Antithesis -> Synthesis | #302, #401 |
| **Piaget (1952)** | Assimilation + Accommodation | #401, #402 |
| **Bloom's Taxonomy** | Synthesis = highest cognitive level | All phases |
| **Polanyi (1966)** | Tacit knowledge exists between lines | #104 |
| **Shannon (1948)** | Information = surprise; synthesis must add info | #403, #606 |
| **Kolmogorov Complexity** | Synthesis = compression of sources | #405 |
| **Gentner (1983)** | Structure mapping enables cross-domain transfer | #303 |
| **Fauconnier-Turner (2002)** | Conceptual blending produces emergence | #304 |
| **Weick (1995)** | Sensemaking is constructive, not discovered | #504 |
| **Peirce (1903)** | Abduction = inference to best explanation | #404 |
| **Kuhn (1962)** | Paradigm conflicts require translation | #202, #203 |
| **Lakatos (1978)** | Hard core vs protective belt disagreements | #302 |
| **Feyerabend (1975)** | Methodological diversity strengthens synthesis | #103 |
| **Popper (1934)** | Good synthesis is falsifiable | #503, #604 |
| **Glass (1976)** | Meta-analysis: weight by quality, not count | #102, #204 |
| **Glaser & Strauss (1967)** | Grounded theory: patterns emerge from data | #306 |
| **Denzin (1978)** | Triangulation validates through convergence | #103, #301 |
| **Nonaka & Takeuchi (1995)** | SECI: Combination quadrant = synthesis | #402 |
| **Taleb** | Narrative fallacy: stories imposed on random data | #504, #601 |

---

## DEPTH LEVELS — Detailed Specifications

### QUICK (depth = quick)

```
PHASES:          SCOPE(lite) -> ACQUIRE(basic) -> DECOMPOSE(core) -> RELATE(core) -> INTEGRATE(core) -> CRYSTALLIZE(minimal)
METHODS:         001-002 + 101-102 + 201,204 + 301-302 + 401,405 + 501
MAX ITERATIONS:  1 (no feedback loops)
SOURCES:         2-5 sources
META:            None (built into process)
COVERAGE TARGET: C >= 15
```

### STANDARD (depth = standard)

```
PHASES:          SCOPE -> ACQUIRE -> DECOMPOSE -> RELATE -> INTEGRATE -> CRYSTALLIZE -> META(core)
METHODS:         All SCOPE + 101-103 + 201-205 + 301-306 + 401-405 + 501-504 + 601,602,606
MAX ITERATIONS:  3
SOURCES:         5-15 sources
META:            Core methods after INTEGRATE
COVERAGE TARGET: C >= 35
```

### RIGOROUS (depth = rigorous)

```
PHASES:          SCOPE -> ACQUIRE(full) -> DECOMPOSE -> RELATE(full) -> INTEGRATE(full) -> CRYSTALLIZE -> META(full)
METHODS:         All methods except multi-iteration external validation
MAX ITERATIONS:  5
SOURCES:         10-30 sources
META:            Full methods after each major phase
COVERAGE TARGET: C >= 50
```

### COMPREHENSIVE (depth = comprehensive)

```
PHASES:          All phases, full execution
METHODS:         All 40 methods
MAX ITERATIONS:  Unlimited
SOURCES:         Comprehensive coverage of landscape
META:            Continuous with stakeholder review
COVERAGE TARGET: C >= 65
```

---

## EXECUTION FLOW

```
                    +----------------------------------------------+
                    |          FEEDBACK LOOPS                       |
                    |     (standard+ depths only)                   |
                    v                                               |
+---------+    +---------+    +---------+    +---------+           |
| STEP 0  |--->| STEP 1  |--->| STEP 2  |--->| STEP 3  |----------+
|  SCOPE  |    | ACQUIRE |    |DECOMPOSE|    | RELATE  |           |
+---------+    +----+----+    +----+----+    +----+----+           |
                    |              |              |                 |
                    +--------------+--------------+                |
                                       |                           |
                             +---------+    +---------+            |
                             | STEP 4  |--->| STEP 5  |<-----------+
                             |INTEGRATE|    |CRYSTALLIZE
                             +---------+    +---------+
                                                 |
                             +-------------------+
                             v
                        +---------+
                        | STEP 6  |
                        | OUTPUT  |
                        +---------+
                             |
             +---------------+
             v
        META (continuous)
   Applied after each phase
```

---

## META METHODS (Continuous)

META methods (#601-607) govern the synthesis process itself. Apply after each major phase:

| # | Method | Purpose | When to Apply |
|---|--------|---------|---------------|
| 601 | Apophenia Check | Are detected patterns real or imposed? | After RELATE, OUTPUT |
| 602 | Confirmation Bias Audit | Did prior views distort synthesis? | After INTEGRATE |
| 603 | Completeness Assessment | Does synthesis cover the question? | After CRYSTALLIZE |
| 604 | Falsifiability Check (Popper) | Can synthesis be proven wrong? | After INTEGRATE |
| 605 | Source Bias Propagation Check | Did source biases infect synthesis? | After INTEGRATE |
| 606 | Novel Information Test (Shannon) | Is this genuine synthesis or summary? | After CRYSTALLIZE |
| 607 | Synthesis Decay Monitoring | When will synthesis expire? | During OUTPUT |

Load: `meta/meta-checklist.yaml`

**Depth requirements:**
- QUICK: META optional (built into process)
- STANDARD: Required 601, 602, 606
- RIGOROUS/COMPREHENSIVE: All 7 methods

---

## SCORING SYSTEMS

### Process Coverage Score (C)

Measures synthesis thoroughness (not quality):

| Activity | Points |
|----------|--------|
| Phase completed | +3 |
| Method executed | +1 |
| Source processed | +0.5 |
| Claim extracted | +0.3 |
| Relationship mapped | +0.5 |
| Tension resolved | +1 |
| Emergent insight identified | +1.5 |
| META method applied | +0.5 |

Load: `data/coverage-scoring.yaml`

### Synthesis Quality Score

8-dimension rubric:

| Criterion | Weight | Excellent | Good | Adequate | Poor |
|-----------|--------|-----------|------|----------|------|
| **Novelty** | 1.5 | >50% genuine synthesis | 30-50% | 10-30% | <10% (summary) |
| **Compression** | 1.0 | 5x shorter than sources | 3x | 2x | Same length |
| **Coherence** | 1.5 | Internally consistent | Minor tensions | Some contradictions | Contradicts itself |
| **Coverage** | 1.0 | All aspects addressed | Most, gaps noted | Major gaps acknowledged | Gaps unacknowledged |
| **Falsifiability** | 1.5 | All claims falsifiable | Most | Some | Unfalsifiable narrative |
| **Actionability** | 1.0 | Clear multi-stakeholder actions | Clear primary action | Suggestive | No implications |
| **Bias control** | 1.0 | Counter-sources sought | Some checks | Minimal | No checking |
| **Level clarity** | 0.5 | Level explicit | Mostly clear | Implicit | Levels mixed |

Load: `data/synthesis-scoring.yaml`

### Coverage Thresholds

| Depth | Comprehensive | Adequate | Partial | Insufficient |
|-------|---------------|----------|---------|--------------|
| quick | C >= 15 | C >= 10 | C >= 5 | C < 5 |
| standard | C >= 35 | C >= 25 | C >= 15 | C < 15 |
| rigorous | C >= 50 | C >= 40 | C >= 30 | C < 30 |
| comprehensive | C >= 65 | C >= 55 | C >= 45 | C < 45 |

---

## METHOD INDEX

### All Methods by Phase

| Phase | # | Method | Depth Required | File |
|-------|---|--------|----------------|------|
| **SCOPE** | 001 | Synthesis Question Formulation | all | `001_Synthesis_Question_Formulation.md` |
| | 002 | Level-of-Analysis Selection | all | `002_Level_of_Analysis_Selection.md` |
| | 003 | Source Landscape Mapping | standard+ | `003_Source_Landscape_Mapping.md` |
| **ACQUIRE** | 101 | Systematic Source Collection | all | `101_Systematic_Source_Collection.md` |
| | 102 | Source Quality Assessment | all | `102_Source_Quality_Assessment.md` |
| | 103 | Diversity Verification | standard+ | `103_Diversity_Verification.md` |
| | 104 | Tacit Knowledge Elicitation | rigorous+ | `104_Tacit_Knowledge_Elicitation.md` |
| | 105 | Counter-Source Search | rigorous+ or low_diversity_flag | `105_Counter_Source_Search.md` |
| **DECOMPOSE** | 201 | Atomic Claim Extraction | all | `201_Atomic_Claim_Extraction.md` |
| | 202 | Concept Taxonomy Building | standard+ | `202_Concept_Taxonomy_Building.md` |
| | 203 | Model Inventory | standard+ | `203_Model_Inventory.md` |
| | 204 | Evidence Grading | all | `204_Evidence_Grading.md` |
| | 205 | Assumption Surfacing | standard+ | `205_Assumption_Surfacing.md` |
| | 206 | Knowledge Gap Identification | rigorous+ | `206_Knowledge_Gap_Identification.md` |
| **RELATE** | 301 | Convergence-Divergence Mapping | all | `301_Convergence_Divergence_Mapping.md` |
| | 302 | Dialectical Tension Mapping | all | `302_Dialectical_Tension_Mapping.md` |
| | 303 | Analogical Structure Mapping | standard+ | `303_Analogical_Structure_Mapping.md` |
| | 304 | Conceptual Blend Construction | standard+ | `304_Conceptual_Blend_Construction.md` |
| | 305 | Causal Chain Reconciliation | standard+ | `305_Causal_Chain_Reconciliation.md` |
| | 306 | Pattern Detection Across Sources | standard+ | `306_Pattern_Detection_Across_Sources.md` |
| | 307 | Level Alignment Check | rigorous+ | `307_Level_Alignment_Check.md` |
| | 308 | Gap Significance Analysis | rigorous+ | `308_Gap_Significance_Analysis.md` |
| **INTEGRATE** | 401 | Dialectical Integration | all | `401_Dialectical_Integration.md` |
| | 402 | Framework Unification | standard+ | `402_Framework_Unification.md` |
| | 403 | Emergence Detection | standard+ | `403_Emergence_Detection.md` |
| | 404 | Abductive Integration | standard+ | `404_Abductive_Integration.md` |
| | 405 | Knowledge Compression | all | `405_Knowledge_Compression.md` |
| | 406 | Boundary Condition Mapping | rigorous+ | `406_Boundary_Condition_Mapping.md` |
| | 407 | Synthesis Coherence Check | rigorous+ | `407_Synthesis_Coherence_Check.md` |
| **CRYSTALLIZE** | 501 | Core Insight Distillation | all | `501_Core_Insight_Distillation.md` |
| | 502 | Mental Model Design | standard+ | `502_Mental_Model_Design.md` |
| | 503 | Principle Extraction | standard+ | `503_Principle_Extraction.md` |
| | 504 | Narrative Construction | standard+ | `504_Narrative_Construction.md` |
| | 505 | Actionability Assessment | rigorous+ | `505_Actionability_Assessment.md` |
| **META** | 601 | Apophenia Check | standard+ | `601_Apophenia_Check.md` |
| | 602 | Confirmation Bias Audit | standard+ | `602_Confirmation_Bias_Audit.md` |
| | 603 | Completeness Assessment | rigorous+ | `603_Completeness_Assessment.md` |
| | 604 | Falsifiability Check | rigorous+ | `604_Falsifiability_Check.md` |
| | 605 | Source Bias Propagation Check | rigorous+ | `605_Source_Bias_Propagation_Check.md` |
| | 606 | Novel Information Test | standard+ | `606_Novel_Information_Test.md` |
| | 607 | Synthesis Decay Monitoring | rigorous+ | `607_Synthesis_Decay_Monitoring.md` |

All method files in: `data/method-procedures/`

---

## INTEGRATION WITH OTHER DEEP PROCESSES

### From Deep-Explore

| Deep-Explore Output | Feeds Into |
|--------------------|------------|
| Option Map | Sources for synthesis (#101) |
| Assumptions surfaced | Claims to decompose (#201) |
| Consequence Map | Evidence for synthesis (#204) |
| Knowledge gaps | Gap analysis (#206, #308) |

### From Deep-Verify

| Deep-Verify Output | Feeds Into |
|-------------------|------------|
| Validated claims | High-confidence claims (#201, #204) |
| Contradictions found | Dialectical tensions (#302) |
| Ungrounded claims | Assumptions to surface (#205) |

### From Deep-Risk

| Deep-Risk Output | Feeds Into |
|-----------------|------------|
| Risk register | Sources for synthesis (#101) |
| Interaction map | Relationship patterns (#301, #306) |
| Mitigation portfolio | Knowledge to synthesize |

### From Deep-Feasibility

| Deep-Feasibility Output | Feeds Into |
|------------------------|------------|
| Constraint map | Boundary conditions (#406) |
| Feasibility conditions | Claims with context (#201) |
| Decision rationale | Sources for synthesis |

### Synthesis AS OUTPUT to Other Processes

| Deep-Synthesis Output | Feeds Into |
|----------------------|------------|
| Unified framework | Deep-Explore: broader option space |
| Core insights | Deep-Verify: claims to validate |
| Principles | Deep-Risk: risk patterns to check |
| Mental models | All: shared understanding |

### Integration Protocol

```
IF Deep-Explore was run on same subject:
  - Load exploration report
  - Extract options -> potential sources
  - Extract assumptions -> claims to decompose
  - Extract knowledge gaps -> feed to #206, #308

IF Deep-Verify was run on same subject:
  - Load verification report
  - Extract validated claims -> high-confidence inputs
  - Extract contradictions -> dialectical tensions (#302)

IF Deep-Risk was run on same subject:
  - Load risk report
  - Extract risk interactions -> relationship patterns
  - Extract mitigations -> knowledge to integrate

IF Deep-Feasibility was run on same subject:
  - Load feasibility report
  - Extract constraints -> boundary conditions (#406)
  - Extract conditions -> contextual claims

AFTER Deep-Synthesis:
  - Hand off insights -> inform other processes
  - Hand off principles -> reusable knowledge
  - Hand off mental models -> shared frameworks
```

---

## FILE LOADING PROTOCOL

When you need specific data, announce and load:

| Situation | Load | Announcement |
|-----------|------|--------------|
| Start Step 0 | `steps/step-00-scope.md` | "Loading Step 0: Scope" |
| Start Step 1 | `steps/step-01-acquire.md` | "Loading Step 1: Acquire" |
| Start Step 2 | `steps/step-02-decompose.md` | "Loading Step 2: Decompose" |
| Start Step 3 | `steps/step-03-relate.md` | "Loading Step 3: Relate" |
| Start Step 4 | `steps/step-04-integrate.md` | "Loading Step 4: Integrate" |
| Start Step 5 | `steps/step-05-crystallize.md` | "Loading Step 5: Crystallize" |
| Start Step 6 | `steps/step-06-output.md` | "Loading Step 6: Output" |
| Execute method | `data/method-procedures/{NNN}_{Name}.md` | "Loading method #{NNN}" |
| Apply scoring | `data/synthesis-scoring.yaml` | "Loading synthesis scoring" |
| Apply coverage | `data/coverage-scoring.yaml` | "Loading coverage scoring" |
| Generate record | `data/synthesis-record-template.md` | "Loading record template" |
| Generate report | `data/synthesis-report-template.md` | "Loading report template" |
| Apply META | `meta/meta-checklist.yaml` | "Loading META checklist" |
| Load foundations | `data/theoretical-foundations.yaml` | "Loading theoretical foundations" |

---

## DIRECTORY STRUCTURE

```
deep-synthesis/
+-- workflow.md                           <-- Execution program (lean)
+-- reference.md                          <-- YOU ARE HERE (reference docs)
+-- methods.csv                           # Method index
+-- steps/
|   +-- step-00-scope.md                  # SCOPE phase (incl. depth selection)
|   +-- step-01-acquire.md                # ACQUIRE phase procedure
|   +-- step-02-decompose.md              # DECOMPOSE phase procedure
|   +-- step-03-relate.md                 # RELATE phase procedure
|   +-- step-04-integrate.md              # INTEGRATE phase procedure
|   +-- step-05-crystallize.md            # CRYSTALLIZE phase procedure
|   +-- step-06-output.md                 # OUTPUT generation
+-- data/
|   +-- method-procedures/                # 40 method procedure files
|   |   +-- 001_Synthesis_Question_Formulation.md
|   |   +-- 002_Level_of_Analysis_Selection.md
|   |   +-- ... (all 40 methods)
|   |   +-- 607_Synthesis_Decay_Monitoring.md
|   +-- theoretical-foundations.yaml      # 19 foundational theories
|   +-- synthesis-scoring.yaml            # Quality rubric (8 dimensions)
|   +-- coverage-scoring.yaml             # Process coverage metrics
|   +-- synthesis-record-template.md      # Individual synthesis template
|   +-- synthesis-report-template.md      # Full report template
+-- meta/
    +-- meta-checklist.yaml               # META methods checklist
```

---

## USAGE GUIDE

### When to Use Deep-Synthesis

| Trigger | Starting Phase | Depth |
|---------|---------------|-------|
| **Integrating research for decision** | SCOPE -> full cycle | rigorous |
| **Post-mortem across incidents** | SCOPE -> INTEGRATE | standard |
| **Literature review** | SCOPE -> RELATE | standard |
| **Cross-team knowledge sharing** | ACQUIRE -> CRYSTALLIZE | standard |
| **Making sense of conflicting advice** | DECOMPOSE -> INTEGRATE | standard |
| **Synthesizing Deep Framework outputs** | All outputs as sources | comprehensive |
| **Domain knowledge building** | Full cycle | comprehensive |
| **Quick knowledge consolidation** | SCOPE -> CRYSTALLIZE | quick |

### Quick Reference

```
Quick synthesis:     SCOPE(lite) -> ACQUIRE(basic) -> DECOMPOSE(core) -> RELATE(core) -> INTEGRATE(core) -> CRYSTALLIZE(minimal)
Standard synthesis:  SCOPE -> ACQUIRE -> DECOMPOSE -> RELATE -> INTEGRATE -> CRYSTALLIZE -> META(core)
Rigorous synthesis:  All phases + full methods + full META
Comprehensive:       Full + iterations + stakeholder review + decay monitoring
```

---

## VERSION HISTORY

- **V1.1** — Self-contained execution: lean workflow.md + reference.md, invocation moved to step-00
- **V1.0** — Initial release based on DEEP-SYNTHESIS.md methodology
