# STEP 00: SCOPE

## EXECUTE

### 00.0 Depth Selection

TRIGGER: Process start
ACTION:
```
1. DISPLAY depth dialog:
   [1] QUICK (1-2h, 2-5 sources, C>=15)
   [2] STANDARD (half day, 5-15 sources, C>=35)
   [3] RIGOROUS (2-3 days, 10-30 sources, C>=50)
   [4] COMPREHENSIVE (1-2 weeks, 30+ sources, C>=65)

2. READ user selection

3. SET depth = selection

4. IF depth NOT IN {quick, standard, rigorous, comprehensive}:
   HALT "Invalid depth selection"

5. LOAD depth-specific method list from workflow-v2.md

6. SET max_iterations:
   quick: 1
   standard: 3
   rigorous: 5
   comprehensive: unlimited
```

OUTPUT: depth, max_iterations, method_list
GATE: depth assigned

### 00.0b Diversity Detection

TRIGGER: After depth selection
ACTION:
```
1. SCAN synthesis request for signals:

   low_diversity_signals = [
     "one expert", "single source", "main reference",
     "the book says", "according to [single author]",
     "all sources agree", "no contradiction", "consensus"
   ]

   convergence_warning_signals = [
     "obviously", "everyone knows", "clearly",
     "no need to check", "straightforward"
   ]

2. IF any low_diversity_signals detected:
   SET low_diversity_flag = ON
   MANDATE: #105 Counter-Source Search
   PRIORITY: #601 Apophenia, #602 Confirmation Bias
   ADD: "Diversity Warning" section to final report

3. IF any convergence_warning_signals detected:
   SET convergence_warning = ON
   REQUIRE: Explicit divergence search
   LIMIT: Max confidence = MEDIUM
   FLAG: Potential confirmation bias

4. ELSE:
   SET low_diversity_flag = OFF
   SET convergence_warning = OFF
```

OUTPUT: low_diversity_flag, convergence_warning
VERIFY: Flags set correctly
GATE: None (automatic detection)

### 00.1 Synthesis Question Formulation (#001)

TRIGGER: Flags set
ACTION:
```
LOAD data/method-procedures/001_Synthesis_Question_Formulation.md

EXECUTE:
1. READ synthesis request

2. EXTRACT:
   sources = [list of mentioned/available sources]
   topic = [core subject]
   purpose = [intended use of synthesis]

3. FORMULATE question:
   Q = "What do the combined [sources] tell us about [topic] for [purpose]?"

4. TEST question quality:
   a. IS answerable? (not too broad, not too vague)
      IF NO: DECOMPOSE into sub-questions, REPEAT step 3

   b. DOES require multiple sources?
      IF NO: HALT "Single source sufficient - no synthesis needed"

   c. DOES seek integration? (pattern/principle/framework, not list)
      IF NO: REFORMULATE, REPEAT step 3

5. SPECIFY answer characteristics:
   form = [Framework | Principle set | Mental model | Narrative]
   length = [Abstract 100w | Summary 500w | Full document]
   confidence_target = [High | Best current | Hypothesis]

6. VERIFY question against bad patterns:
   BAD_PATTERNS = [
     "What do we know?" → unbounded,
     "Summarize these documents" → summarization not synthesis,
     "Is this good?" → vague, not about integration
   ]
   IF matches BAD_PATTERN: REFORMULATE, GOTO step 3
```

OUTPUT: synthesis_question, form, length, confidence_target

COUNTER-CHECK:
```
1. GENERATE alternative question Q' covering same domain
2. COMPARE Q vs Q':
   IF Q' significantly better: REPLACE Q with Q', RECORD decision
   IF equal: DOCUMENT both as valid framings
   ELSE: PROCEED with Q
```

REASONING LOG:
```
Assumption: [what we assume about sources/topic]
Evidence: [what request contains]
Inference: [why this question formulation]
Falsification: [what would make question inappropriate]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [synthesis request elements used]
OMITTED: [request elements not included + CUI BONO justification]
DEFERRED: [elements for later phases]

IF any OMITTED without CUI BONO: HALT "Undeclared omission in question formulation"
```

### 00.2 Level-of-Analysis Selection (#002)

TRIGGER: Question formulated and gated
ACTION:
```
LOAD data/method-procedures/002_Level_of_Analysis_Selection.md

EXECUTE:
1. IDENTIFY available abstraction levels:
   ATOMIC:      individual facts, events, data points
   PATTERN:     recurring relationships across atoms
   STRUCTURAL:  underlying mechanisms and models
   SYSTEMIC:    system-wide dynamics and behaviors
   PARADIGMATIC: fundamental assumptions/worldviews

2. ANALYZE synthesis question Q for implicit level:
   SCAN Q for level indicators:
   "how does" → STRUCTURAL
   "what patterns" → PATTERN
   "why systemically" → SYSTEMIC
   "what facts" → ATOMIC
   "what assumptions" → PARADIGMATIC

3. SELECT target level:
   target_level = detected_level OR user_specified

4. IF sources operate at different levels:
   REQUIRE: Level alignment in RELATE phase
   WARN: Conclusions may not transfer between levels
   FLAG: Potential Simpson's Paradox or Ecological Fallacy

5. IDENTIFY cross-level interactions:
   a. Any atomic details that change systemic understanding?
   b. Any systemic insights that reframe atomic facts?
   RECORD: cross_level_interactions
```

OUTPUT: target_level, source_levels, cross_level_interactions

COUNTER-CHECK:
```
1. ASSUME synthesis at different level L' ≠ target_level
2. EVALUATE: Would L' be more appropriate?
3. IF YES: JUSTIFY why target_level chosen despite L' being better
   OR SWITCH to L'
4. RECORD decision + rationale
```

REASONING LOG:
```
Assumption: Target level matches question intent
Evidence: [level indicators in question]
Inference: [selected level]
Falsification: [what would indicate wrong level - e.g., cannot answer question at this level]
Confidence: [H/M/L based on clarity of level indicators]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [question analyzed for level]
OMITTED: [levels not considered + why - e.g., "ATOMIC omitted - question requires patterns"]
DEFERRED: [level alignment tasks]

IF OMITTED without justification: HALT "Undeclared level omission"
```

### 00.3 Source Landscape Mapping (#003)

TRIGGER: Level selected and gated
ACTION:
```
LOAD data/method-procedures/003_Source_Landscape_Mapping.md

EXECUTE:
1. ENUMERATE source types for domain:

   FOR each type in [Empirical, Expert, Documented, Academic,
                     Experiential, Theoretical, Tacit, Cross-domain]:

      ASSESS:
      available = [Y | N | ?]
      relevant = [Y | N]
      gap = IF available=N AND relevant=Y: DESCRIBE gap

      RECORD: (type, available, relevant, gap)

2. AUDIT diversity across types:
   a. COUNT types with available=Y AND relevant=Y
   b. IF count < 2: SET diversity_status = POOR
      ELSE IF count < 4: SET diversity_status = PARTIAL
      ELSE: SET diversity_status = ADEQUATE

3. STREETLIGHT CHECK:
   QUESTION: "Are we looking where knowledge IS, or only where convenient?"

   FOR each type with available=N AND relevant=Y:
      JUSTIFY: Why not pursuing this type?
      TEST: Is justification about convenience vs true unavailability?
      IF convenience: FLAG as streetlight risk

4. IDENTIFY known exclusions:
   LIST sources NOT including + reason
   EXAMPLE: "Expert X excluded - known bias on topic Y"

5. COMPUTE streetlight_risk:
   IF >30% relevant types excluded for convenience: HIGH
   ELSE IF >10%: MEDIUM
   ELSE: LOW

6. SUMMARIZE landscape:
   types_needed = [list of relevant types]
   types_available = [list of available types]
   critical_gaps = [gaps with high impact]
   streetlight_risk = [LOW | MEDIUM | HIGH]
```

OUTPUT: source_landscape = {types_needed, types_available, critical_gaps,
                            streetlight_risk, diversity_status}

COUNTER-CHECK:
```
1. ASSUME we pursued all relevant unavailable types
2. ESTIMATE: How would synthesis change?
3. EVALUATE impact:
   IF major change: RECONSIDER whether to pursue
   ELSE: ACCEPT gap with documented limitation
4. RECORD decision
```

REASONING LOG:
```
Assumption: Identified types cover domain adequately
Evidence: [domain analysis, question requirements]
Inference: [landscape map]
Falsification: [finding major source type we didn't consider]
Confidence: [H if comprehensive domain knowledge, M/L otherwise]
```

BINDING GATE:
```
DECLARE:
PROCESSED: [source types evaluated]
OMITTED: [source types not pursued + CUI BONO - e.g., "Tacit knowledge omitted - depth=quick, benefit < cost"]
DEFERRED: [source types for later if needed]

IF OMITTED without CUI BONO: HALT "Undeclared source type omission"
IF critical_gaps AND no mitigation plan: HALT "Critical gaps unaddressed"
```

### 00.4 Scope Integrity Audit (#082)

TRIGGER: Landscape mapped and gated
ACTION:
```
LOAD methods/method-procedures/082_Scope_Integrity_Audit.md

EXECUTE:
1. QUOTE original synthesis request verbatim:
   original_request = "[exact user request]"

2. EXTRACT all elements from request:
   FOR each sentence/requirement in original_request:
      PARSE element
      CLASSIFY as:
         - Sources to include
         - Topics to cover
         - Questions to answer
         - Outputs expected
         - Constraints

      ADD to elements_list

3. MAP each element to scope decisions:
   FOR each element:
      status = [ADDRESSED | REDUCED | OMITTED]

      IF ADDRESSED:
         location = where in scope (question/level/landscape)

      IF REDUCED:
         original_scope = [what was requested]
         reduced_scope = [what we're doing]
         justification = [why reduced]
         CUI_BONO = [who benefits from reduction]

      IF OMITTED:
         justification = [why omitted]
         CUI_BONO = [who benefits - if agent, FLAG]

4. DETECT scope drift:
   drift_score = COUNT(REDUCED) + 2*COUNT(OMITTED)

   IF drift_score > 0.3 * COUNT(elements):
      HALT "Excessive scope drift detected"

5. CUI BONO analysis on all reductions/omissions:
   FOR each reduction/omission:
      IF beneficiary = agent (easier work):
         REQUIRE: Strong justification + user approval
      ELSE:
         DOCUMENT decision
```

OUTPUT: scope_integrity_report = {elements_list, status_map, drift_score}

VERIFICATION:
```
PASS IF:
- All elements classified
- All OMITTED have non-agent CUI BONO
- drift_score <=30%
- All REDUCED have justification

FAIL IF any condition violated
```

GATE: scope_integrity_report.all_conditions_pass = TRUE

### 00.5 Scope Definition Output

TRIGGER: All methods executed and gated
ACTION:
```
1. COMPILE scope definition:

SYNTHESIS_QUESTION: [from 00.1]
LEVEL: [from 00.2]
SOURCE_LANDSCAPE: [from 00.3]
DEPTH: [from 00.0]
FLAGS: [from 00.0b]
INTEGRITY: [from 00.4]

2. GENERATE scope summary:

---SCOPE DEFINITION---
QUESTION: [synthesis_question]
TARGET_LEVEL: [target_level]
SOURCE_TYPES_NEEDED: [types_needed]
SOURCE_TYPES_AVAILABLE: [types_available]
CRITICAL_GAPS: [critical_gaps]
DIVERSITY_STATUS: [diversity_status]
ANSWER_FORM: [form]
ANSWER_LENGTH: [length]
CONFIDENCE_TARGET: [confidence_target]
DEPTH: [depth]
MAX_ITERATIONS: [max_iterations]
LOW_DIVERSITY_FLAG: [ON/OFF]
CONVERGENCE_WARNING: [ON/OFF]
STREETLIGHT_RISK: [LOW/MEDIUM/HIGH]
SCOPE_DRIFT: [drift_score]
---END SCOPE---

3. VERIFY completeness:
   CHECK all fields populated
   CHECK no placeholders remain
   CHECK all gates passed
```

OUTPUT: scope_definition (structured object + formatted summary)

FINAL GATE:
```
PROCEED_TO_ACQUIRE = CHECK ALL:
[ ] synthesis_question formulated and quality-tested
[ ] target_level selected
[ ] source_landscape mapped
[ ] diversity assessed
[ ] scope integrity verified
[ ] all binding gates passed
[ ] no undeclared omissions

IF all checked: PROCEED
ELSE: HALT "Scope incomplete: " + list_unchecked
```

## TRANSITION

```
IF FINAL GATE passed:
   LOAD steps/step-01-acquire-v2.md

ELSE IF synthesis_question too broad:
   DECOMPOSE question into sub-questions
   LOOP to 00.1

ELSE IF target_level unclear:
   HALT "Level ambiguity - requires user clarification: [details]"

ELSE IF landscape unmapped:
   HALT "Source landscape incomplete - complete 00.3"

ELSE:
   HALT "Unknown blocker in SCOPE phase"
```

## COMPLIANCE CHECK

Zasady spełnione:
✓ 0. Zero ozdobników - tylko instrukcje
✓ 1. Self-contained - ładuje metody JIT
✓ 2. Completeness - wszystkie elementy processed/omitted/deferred
✓ 3. Mechanizm - trigger + action dla każdej metody
✓ 4. Binding gate - wymuszenie deklaracji
✓ 5. Założenia przed działaniem - reasoning log przed output
✓ 6. Wymuszona sekwencja - gates blokują postęp
✓ 7. Checklist - final gate
✓ 8. Counter-check - każda metoda
✓ 9. Egzekucyjny język - rozkazy, nie opisy
✓ 10. Widoczne rozumowanie - reasoning log mandatory
✓ 11. Instrukcja + dane - minimum potrzebne
✓ 12. JIT loading - metody ładowane when needed
✓ 13. Zero ozdobników - usunięto grafiki
