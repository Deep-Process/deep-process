# STEP 05: CRYSTALLIZE

## EXTRACT PHASE

### 05.1 Core Insight Distillation (#501)

TRIGGER: Entering CRYSTALLIZE phase
ACTION:
```
LOAD data/method-procedures/501_Core_Insight_Distillation.md

EXECUTE:
1. EXTRACT candidate insights from INTEGRATE:

   candidates = [
     dialectical_syntheses,
     emergent_properties,
     unified_framework core,
     abductive_explanations,
     patterns identified,
     boundary discoveries
   ]

2. EVALUATE each candidate:

   FOR each candidate_insight:

      a. NOVELTY score:
         - Not in any single source: +3
         - Surprising to field: +2
         - Confirms/extends known: +1
         - Already known: 0

      b. ACTIONABILITY score:
         - Changes how to act: +3
         - Changes how to think: +2
         - Clarifies understanding: +1
         - Purely academic: 0

      c. GENERALITY score:
         - Applies across domains: +3
         - Applies across contexts: +2
         - Applies to specific domain: +1
         - Applies to narrow case: 0

      d. EVIDENCE score:
         - Strong evidence (grade A): +3
         - Moderate evidence (grade B): +2
         - Weak evidence (grade C): +1
         - Speculative (grade D): 0

      total_score = novelty + actionability + generality + evidence

3. RANK insights by total score

4. SELECT top 3-7 insights:

   core_insights = TOP_K(ranked_insights, k=3 to 7)

   REQUIREMENT:
   - Minimum 3 insights (if fewer, synthesis insufficient)
   - Maximum 7 insights (if more, not distilled enough)

   IF count < 3:
      HALT "Insufficient core insights - synthesis incomplete"

   IF count > 7:
      COMPRESS further - only MOST important

5. FORMULATE each core insight:

   insight = {
     statement: [1-2 sentence clear statement],
     importance: [why this matters],
     evidence: [what supports this],
     implications: [what follows from this],
     confidence: [H/M/L with justification],
     falsification: [what would disprove this]
   }

6. TEST insight quality:

   FOR each insight:
      - Can it be stated in 1-2 sentences?
      - Does it answer/illuminate synthesis question?
      - Would someone's thinking change after learning it?
      - Is it falsifiable (not vague truism)?

   IF any test fails: REFORMULATE or REJECT
```

OUTPUT: core_insights = [{insight, scores, formulation}]

COUNTER-CHECK:
```
1. SELECT lowest-scoring core insight
2. CHALLENGE: Is this really core, or derivative?
3. REMOVE it, CHECK: Does synthesis lose critical content?
4. IF NO: Remove (wasn't core)
   IF YES: Keep (is core)
5. RECORD insight_necessity
```

REASONING LOG:
```
Assumption: Core insights are most valuable synthesis output
Evidence: [scoring, ranking, testing]
Inference: [these insights distill synthesis essence]
Falsification: [insight proven trivial or false]
Confidence: [based on evidence scores]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [insights extracted, scored, selected]
OMITTED: [candidate insights not selected + why]
CORE_COUNT: {count}
REQUIRE: 3 <= count <= 7

IF count < 3: HALT "Insufficient insights"
IF count > 7: HALT "Insufficient distillation"
CUI_BONO if count low (less work) or high (avoided hard choices)
```

### 05.2 Mental Model Design (#502)

TRIGGER: Core insights distilled (standard+)
ACTION:
```
LOAD data/method-procedures/502_Mental_Model_Design.md

EXECUTE:
1. DEFINE mental model purpose:

   mental_model = cognitive tool enabling:
      - Understanding of synthesis domain
      - Predictions in new situations
      - Decision-making
      - Problem-solving
      - Communication

2. DESIGN model structure:

   TYPES:

   a. CAUSAL MODEL:
      IF synthesis reveals causal structure:
         - Nodes = entities/variables
         - Edges = causal relationships
         - Mechanisms = how causes operate

   b. PROCESS MODEL:
      IF synthesis reveals process/workflow:
         - Stages = phases/steps
         - Transitions = triggers
         - Feedback loops = iterative elements

   c. FRAMEWORK MODEL:
      IF synthesis reveals organizing framework:
         - Dimensions = key variables
         - Quadrants/regions = distinct states
         - Navigation = how to use framework

   d. PRINCIPLE-BASED MODEL:
      IF synthesis reveals governing principles:
         - Core principles = fundamental rules
         - Derivations = what follows
         - Applications = how to apply

   SELECT model type matching synthesis

3. CONSTRUCT model elements:

   FOR each element:
      - Define clearly
      - Show relationships
      - Explain mechanisms
      - Provide examples
      - Note exceptions

4. VALIDATE model usability:

   TEST with scenarios:

   a. UNDERSTANDING test:
      Present unfamiliar situation in domain
      Can model help understand it?

   b. PREDICTION test:
      Present decision point
      Can model predict outcomes?

   c. COMMUNICATION test:
      Explain model to novice
      Can they use it?

   d. RETENTION test:
      Is model memorable?
      Key visuals/metaphors?

   PASS_COUNT = tests passed

   IF PASS_COUNT < 3:
      REDESIGN model

5. DOCUMENT model:

   mental_model_doc = {
     type: [causal|process|framework|principle],
     structure: [diagram/visualization],
     elements: [definitions],
     usage: [how to apply],
     examples: [scenarios],
     limitations: [where not applicable]
   }
```

OUTPUT: mental_model = {type, structure, documentation, validation}

COUNTER-CHECK:
```
1. TEST model with edge case
2. EVALUATE: Does model handle it or break?
3. IF breaks: REFINE model OR document boundary
4. RECORD model_robustness
```

REASONING LOG:
```
Assumption: Mental model aids understanding and application
Evidence: [validation tests, usability]
Inference: [this model captures synthesis structure]
Falsification: [model failing prediction test]
Confidence: [H if 4/4 tests, M if 3/4, L if 2/4]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [mental model designed and validated]
OMITTED: [model types not attempted + why]
VALIDATION_RESULTS: {tests passed}
REQUIRE: pass_count >= 3

IF pass_count < 3: REQUIRE redesign
CUI_BONO if poor model accepted (less work)
```

### 05.3 Principle Extraction (#503)

TRIGGER: Mental model designed (standard+)
ACTION:
```
LOAD data/method-procedures/503_Principle_Extraction.md

EXECUTE:
1. IDENTIFY general principles from synthesis:

   principle = general rule that:
      - Applies beyond specific cases
      - Explains multiple phenomena
      - Guides action/decision
      - Is falsifiable (Popper)
      - Has scope conditions

2. EXTRACT principles from:

   a. CORE INSIGHTS:
      FOR each insight:
         GENERALIZE: What broader principle underlies this?

   b. PATTERNS:
      FOR each pattern:
         ABSTRACT: What rule governs this pattern?

   c. SYNTHESES:
      FOR each dialectical synthesis:
         EXTRACT: What principle resolves the tension?

   d. FRAMEWORK:
      FROM unified framework:
         DERIVE: What principles organize the framework?

3. FORMULATE each principle:

   principle_statement = {
     principle: "When X, then Y" or "The more X, the more Y",
     scope: [conditions under which principle holds],
     mechanism: [why principle holds],
     evidence: [what supports principle],
     confidence: [H/M/L],
     falsification: [what would disprove principle],
     exceptions: [known cases where principle fails]
   }

4. TEST principle quality (Popper's criteria):

   FOR each principle:

      a. UNIVERSAL vs EXISTENTIAL:
         Universal: "All X are Y" (falsifiable by single counter-example)
         Existential: "Some X are Y" (not falsifiable)

         PREFER: Universal where possible

      b. TESTABILITY:
         Can principle be empirically tested?
         What observation would falsify it?

         IF no falsification test: REJECT (not scientific)

      c. GENERATIVE:
         Does principle generate new predictions?
         Does it explain multiple phenomena?

      d. PARSIMONIOUS:
         Is principle simple?
         Does it avoid unnecessary assumptions?

   PASS_COUNT = criteria passed

   IF PASS_COUNT < 3:
      REFORMULATE or REJECT

5. PRIORITIZE principles:

   SORT by:
   - Generality (wider scope = higher)
   - Evidence (stronger evidence = higher)
   - Usefulness (more actionable = higher)

   TOP principles = core synthesis contribution
```

OUTPUT: principles = [{principle, scope, mechanism, evidence, confidence}]

COUNTER-CHECK:
```
1. SELECT highest-generality principle
2. GENERATE deliberate counter-example
3. TEST: Does counter-example falsify principle?
4. IF YES: REFINE scope OR reject principle
5. RECORD principle_falsifiability
```

REASONING LOG:
```
Assumption: Principles are durable synthesis outputs
Evidence: [Popper tests, testability]
Inference: [these principles generalize synthesis]
Falsification: [principle failing test or counter-example]
Confidence: [based on evidence and scope]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [principles extracted and tested]
OMITTED: [principle types not extracted + why]
UNFALSIFIABLE:
   Principles without falsification test: [list]
   REQUIRE: Add falsification test OR remove
   CUI_BONO if keeping unfalsifiable (easier)

IF unfalsifiable principle included: HALT "Unfalsifiable principle (violates RULE 7)"
```

### 05.4 Narrative Construction (#504)

TRIGGER: Principles extracted (rigorous+)
ACTION:
```
LOAD data/method-procedures/504_Narrative_Construction.md

EXECUTE (Weick's Sensemaking):
1. DESIGN narrative arc:

   STORY STRUCTURE:
   - Beginning: Problem/question that motivated synthesis
   - Middle: Journey through evidence, tensions, syntheses
   - End: Resolution via insights/principles/model

2. CONSTRUCT narrative:

   a. OPENING (set stage):
      - Synthesis question
      - Why it matters
      - What was unclear/contested

   b. DEVELOPMENT (tell journey):
      - Sources consulted (diversity)
      - Key claims extracted
      - Tensions discovered
      - Syntheses achieved
      - Emergence detected

   c. CLIMAX (core insight):
      - The key synthesis moment
      - When it clicked
      - What made it novel

   d. RESOLUTION (deliverables):
      - Core insights (3-7)
      - Mental model
      - Principles
      - Actionable implications

3. AVOID narrative fallacy (Taleb):

   DANGER: Imposing coherent story on noisy data

   SAFEGUARDS:
   - Report contradictions that remain
   - Document uncertainty
   - Note alternative explanations
   - Show where narrative simplifies

4. BALANCE narrative vs rigor:

   narrative_quality = engaging, memorable, coherent
   rigor = accurate, qualified, evidenced

   REQUIREMENT: Both

   IF narrative smooth BUT hides contradictions:
      REJECT - False coherence

   IF rigorously accurate BUT incomprehensible:
      IMPROVE - Clearer narrative

5. VALIDATE narrative:

   TESTS:
   - Does narrative represent synthesis accurately?
   - Does it acknowledge limitations?
   - Is it memorable?
   - Does it enable action?

   IF fails accuracy: REVISE for truth
   IF fails memorability: REVISE for clarity
```

OUTPUT: narrative = {story, structure, safeguards}

COUNTER-CHECK:
```
1. CHECK narrative for false coherence
2. IDENTIFY: What contradictions are smoothed over?
3. EVALUATE: Is smoothing justified or deceptive?
4. REQUIRE: Acknowledge smoothing
5. RECORD narrative_honesty
```

REASONING LOG:
```
Assumption: Narrative aids communication without distorting truth
Evidence: [narrative validation, safeguards]
Inference: [this narrative represents synthesis faithfully]
Falsification: [reader finding narrative misleading]
Confidence: [H if accurate+engaging, M if trade-off, L if false coherence]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [narrative constructed with safeguards]
OMITTED: [narrative elements not included + why]
FALSE_COHERENCE_RISK:
   Contradictions smoothed: [list]
   Justification: [per smoothing]
   CUI_BONO if hiding contradictions (cleaner story)

IF unjustified smoothing: HALT "False coherence detected"
```

### 05.5 Actionability Assessment (#505)

TRIGGER: Narrative constructed (standard+)
ACTION:
```
LOAD data/method-procedures/505_Actionability_Assessment.md

EXECUTE:
1. FOR each synthesis output (insights, model, principles, narrative):

   ASK: What should someone DO differently based on this?

   actionability_types:
   - IMMEDIATE: Action steps clear and ready
   - STRATEGIC: Changes thinking/planning
   - DIAGNOSTIC: Helps identify problems
   - PREDICTIVE: Enables forecasting
   - ACADEMIC: Advances understanding only

2. ASSESS each output:

   FOR output:
      action_type = [type from above]
      specific_actions = [list concrete actions enabled]
      value = [expected benefit from taking action]
      feasibility = [how easy to implement]

      actionability_score = value × feasibility

3. REQUIREMENT:

   IF ALL outputs are ACADEMIC only:
      WARN: "Synthesis lacks practical application"
      QUESTION: Is this acceptable for synthesis purpose?

   IF synthesis_purpose = practical:
      REQUIRE: At least 50% of outputs have actionability_score >= MEDIUM

4. GENERATE action recommendations:

   FOR each actionable output:
      recommendation = {
        who: [who should act],
        what: [specific action],
        when: [timing],
        how: [method],
        why: [expected outcome],
        measure: [how to know if worked]
      }

5. PRIORITIZE recommendations:

   SORT by:
   - Impact (high impact first)
   - Feasibility (low-hanging fruit)
   - Time-sensitivity (urgent first)

   TOP recommendations = key takeaways
```

OUTPUT: actionability_report = {
  action_type_distribution,
  recommendations_by_priority,
  feasibility_assessment
}

VERIFICATION:
```
PASS IF: Actionability matches synthesis purpose
WARN IF: Practical synthesis with no practical actions
```

## VERIFY PHASE

### 05.V Approval Gradient Test (#060)

TRIGGER: All CRYSTALLIZE methods executed
ACTION:
```
LOAD methods/method-procedures/060_Approval_Gradient_Test.md

EXECUTE:
1. RATE crystallized outputs on scale:

   what_user_wants ← → what_is_true
   0%                    50%                    100%

2. FOR each core insight, principle, recommendation:

   ASK: Is this:
   - What user wants to hear (0%)
   - Balanced truth (50%)
   - Hard truth user may not want (100%)

   position_on_scale = [rating]

3. COMPUTE distribution:

   IF >60% of outputs at 0-30% (what user wants):
      FLAG: "Approval-seeking bias detected"
      REQUIRE: Find hard truths OR justify positive skew

   IF balanced across scale:
      PASS: No approval bias

4. JUSTIFY any skew:

   IF skewed positive:
      REASON: [why synthesis genuinely positive - not pleasing]

   IF skewed negative:
      REASON: [why synthesis genuinely critical - not contrarian]
```

OUTPUT: approval_gradient_report

VERIFICATION:
```
PASS IF: Distribution justified
FAIL IF: Approval-seeking without justification
```

## RENDER PHASE

### 05.R Crystallization Deliverable

TRIGGER: All verifications passed
ACTION:
```
COMPILE:

---CRYSTALLIZATION OUTPUT---
CORE_INSIGHTS: {count = 3-7}
{for each insight:
  - Statement (1-2 sentences)
  - Importance (why matters)
  - Evidence (what supports)
  - Confidence (H/M/L + why)
  - Falsification (what would disprove)
}

MENTAL_MODEL: {present if standard+}
  Type: {causal|process|framework|principle}
  Structure: [diagram/visualization]
  Validation: {tests passed}

PRINCIPLES: {count} {present if standard+}
{for each principle:
  - Principle statement
  - Scope conditions
  - Mechanism
  - Evidence
  - Falsification test
}

NARRATIVE: {present if rigorous+}
  [compelling story of synthesis journey]
  Safeguards: {contradictions acknowledged}

ACTIONABILITY:
  Immediate actions: {count}
  Strategic implications: {count}
  Recommendations: {top priorities}

VERIFICATION_RESULTS:
  Approval Gradient: PASSED

PROCEED_TO_OUTPUT: {YES/NO}
---END CRYSTALLIZATION---
```

FINAL GATE:
```
CRYSTALLIZE_COMPLETE = CHECK ALL:
[ ] Core insights distilled (3-7 count)
[ ] Mental model designed (standard+)
[ ] Principles extracted (standard+)
[ ] Narrative constructed (rigorous+)
[ ] Actionability assessed
[ ] Approval gradient passed
[ ] All binding gates passed
[ ] Deliverable compiled

IF all checked: PROCEED
ELSE: HALT "CRYSTALLIZE incomplete"
```

## TRANSITION

```
IF FINAL GATE passed:
   LOAD steps/step-06-output-v2.md
ELSE IF insight_count < 3:
   RETURN to INTEGRATE - synthesis insufficient
ELSE IF unfalsifiable_principles:
   LOOP to 05.3 - fix falsifiability
ELSE:
   HALT with specifics
```
