# DEEP SYNTHESIS V2.0 - EXECUTION PROGRAM

## INITIALIZE

```
1. LOAD steps/step-00-scope.md
2. EXECUTE each command in sequence
3. HALT when step commands HALT
4. NEVER skip without declaring OMITTED + CUI BONO justification
```

## CRITICAL RULES

```
RULE 1: EXTRACT → VERIFY → RENDER
TRIGGER: Before generating any synthesis output
ACTION: Complete extraction, pass all verifications, then render
VIOLATION: HALT "Verification incomplete"

RULE 2: BINDING GATE
TRIGGER: End of each method
ACTION: DECLARE PROCESSED + OMITTED + DEFERRED
IF: OMITTED without CUI BONO → HALT "Undeclared omission"

RULE 3: COUNTER-CHECK
TRIGGER: Any synthesis claim C
ACTION: Generate strongest NOT-C, evaluate, record result
SKIP: Never permitted

RULE 4: REASONING VISIBLE
TRIGGER: Any inference
ACTION: LOG assumption + evidence + inference + falsification test
OUTPUT: Reasoning log mandatory in deliverable

RULE 5: COMPRESSION MANDATORY
TRIGGER: Final output generated
TEST: IF output_length >= sum(source_lengths): HALT "Not compressed"
THRESHOLD: Synthesis must be <50% of source material length

RULE 6: NOVELTY MANDATORY
TRIGGER: Final output generated
TEST: Apply #606 Novel Information Test
IF: No information gain → HALT "Summarization not synthesis"

RULE 7: FALSIFIABLE
TRIGGER: Any core claim
TEST: "What evidence would disprove this?"
IF: No answer → HALT "Unfalsifiable claim"
```

## STEP SEQUENCE

Execute in order. Each step contains trigger conditions and halt gates.

```
PHASE 0: SCOPE
step-00-scope.md
GATE: Scope clear + landscape mapped + level selected
VERIFY: #082 Scope Integrity Audit

PHASE 1: ACQUIRE
step-01-acquire.md
GATE: #167 Baseline Census + diversity verified + quality assessed
VERIFY: #085 Grounding Check + #169 Staleness Detection

PHASE 2: DECOMPOSE
step-02-decompose.md
GATE: All sources processed + claims extracted + taxonomy built
VERIFY: #168 Existence Verification + #084 Closure Check

PHASE 3: RELATE
step-03-relate.md
GATE: All relationships mapped + contradictions identified
VERIFY: #086 Topological Hole Detection

PHASE 4: INTEGRATE
step-04-integrate.md
GATE: Synthesis generated + counter-checked + compressed
VERIFY: #056 Liar's Trap + #057 Mirror Trap + #152 Semantic Entropy

PHASE 5: CRYSTALLIZE
step-05-crystallize.md
GATE: Insights distilled + principles extracted + models designed
VERIFY: #060 Approval Gradient Test

PHASE 6: OUTPUT
step-06-output.md
GATE: All verifications pass + deliverables complete
VERIFY: #121 Competence Boundary Mapping + full META suite
```

## DEPTH-METHOD MAP

```
DEPTH      PHASES  METHODS                           ITERATIONS  COVERAGE
quick      all     core subset (15 methods)          1           C>=15
standard   all     standard subset (25 methods)      3           C>=35
rigorous   all     all methods (40 methods)          5           C>=50
comprehensive all  all + stakeholder review          unlimited   C>=65
```

## DEPTH-SPECIFIC METHOD LOADING

```
ALL DEPTHS:
#001 Question Formulation
#002 Level Selection
#003 Landscape Mapping
#101 Source Collection
#102 Quality Assessment
#201 Claim Extraction
#204 Evidence Grading
#301 Convergence-Divergence
#302 Dialectical Tension
#401 Dialectical Integration
#405 Knowledge Compression
#501 Core Insights
#601 Apophenia Check
#606 Novel Information Test
#604 Falsifiability Check

STANDARD+:
#103 Diversity Verification
#105 Counter-Source Search
#202 Concept Taxonomy
#203 Model Inventory
#205 Assumption Surfacing
#303 Analogical Mapping
#304 Conceptual Blending
#306 Pattern Detection
#402 Framework Unification
#404 Abductive Integration
#502 Mental Model Design
#503 Principle Extraction
#602 Confirmation Bias Audit

RIGOROUS+:
#104 Tacit Knowledge
#206 Knowledge Gaps
#305 Causal Reconciliation
#307 Level Alignment
#308 Gap Significance
#403 Emergence Detection
#406 Boundary Conditions
#407 Coherence Check
#504 Narrative Construction
#505 Actionability
#603 Completeness
#605 Bias Propagation
#607 Decay Monitoring

COMPREHENSIVE:
All above +
#056 Liar's Trap
#057 Mirror Trap
#059 CUI BONO Test
#060 Approval Gradient
#082 Scope Integrity
#083 Alignment Check
#084 Closure Check
#085 Grounding Check
#086 Topological Holes
#121 Competence Boundary
#152 Semantic Entropy
#167 Baseline Census
#168 Existence Verification
#169 Staleness Detection
```

## TRANSITION LOGIC

```
After each step:

IF gate conditions MET:
   LOAD next step
ELSE IF blocking condition:
   HALT with specific blocker message
ELSE IF iteration available:
   LOOP to specified earlier step
ELSE:
   HALT "Unresolved blocker - manual intervention required"
```

## SCORING

```
Phase completed:        +3
Method executed:        +1
Source processed:       +0.5
Claim extracted:        +0.3
Relationship mapped:    +0.5
Tension resolved:       +1
Emergent insight:       +1.5
META method:            +0.5
Counter-check passed:   +0.5
Verification passed:    +1

TRACK continuously
REPORT in final deliverable
```

## HALT CONDITIONS

```
IMMEDIATE HALT (cannot proceed):
- Binding gate violation (undeclared omission)
- Verification failure (counter-check fails)
- Compression failure (output >= sources)
- Novelty failure (no information gain)
- Falsifiability failure (unfalsifiable claim)

CONDITIONAL HALT (user decision):
- Quality threshold not met (ask: proceed with lower confidence?)
- Diversity insufficient (ask: accept limitation?)
- Contradictions unresolved (ask: report as contested?)

ITERATIVE HALT (loop back):
- New sources needed → return to ACQUIRE
- Decomposition incomplete → return to DECOMPOSE
- Integration reveals gaps → return to earlier phase
```

## VERSION

V2.0 - Fully executable, binding gates, mandatory verifications, zero documentation
