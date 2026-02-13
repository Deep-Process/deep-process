# Deep Synthesis V1.1 — Execution Program

> This file is a PROGRAM. Execute it step by step. For reference documentation, see [reference.md](./reference.md).

---

## START HERE

```
1. Load step-00-scope.md -> EXECUTE it fully (depth selection, diversity detection, scope definition)
2. Continue to each subsequent step file based on depth level
3. Each step file contains all instructions needed (inline method guidance included)
4. HALT when a step says HALT — wait for user input
5. Apply META methods after each major phase (standard+ depth)
6. Output = structured SYNTHESIS DELIVERABLES, not conversation
```

---

## CRITICAL RULES

```
+-----------------------------------------------------------------------------+
|  SYNTHESIS COMMANDMENTS                                                      |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. ALWAYS START WITH DEPTH SELECTION                                        |
|     Load step-00-scope.md, display dialog, wait for user choice             |
|                                                                              |
|  2. SYNTHESIS != SUMMARIZATION                                               |
|     If output contains nothing new, you summarized, not synthesized         |
|     Apply Shannon Test (#606): does insight require COMBINING sources?      |
|                                                                              |
|  3. CONTRADICTION IS VALUABLE                                                |
|     Disagreeing sources are MORE valuable than agreeing ones                |
|     Don't resolve tensions prematurely — understand WHY they exist          |
|                                                                              |
|  4. COMPRESSION IS MANDATORY                                                 |
|     If synthesis is as long as sources, you haven't synthesized             |
|                                                                              |
|  5. LEVEL MUST BE EXPLICIT                                                   |
|     Same data at different levels = different conclusions                    |
|     State the level; note where conclusions DON'T transfer                  |
|                                                                              |
|  6. FALSIFIABILITY IS REQUIRED                                               |
|     "What would disprove this synthesis?" must have an answer               |
|                                                                              |
|  7. LOAD FILES WHEN NEEDED                                                   |
|     Announce file loads briefly, follow the procedure                       |
|                                                                              |
|  8. META IS CONTINUOUS                                                       |
|     Apply META methods after each phase, not just at end                    |
|     False coherence is the enemy — check for it continuously                |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## STEP SEQUENCE

Execute based on depth. Load one step file at a time.

```
Phase 0: SCOPE                                    [All Depths]
  Step 0   steps/step-00-scope.md
           Select depth, detect diversity, define question, set level,
           map source landscape.

Phase 1: ACQUIRE                                  [All Depths]
  Step 1   steps/step-01-acquire.md
           Collect sources (#101-105 per depth). Quality assess.
           Verify diversity. Check saturation.

Phase 2: DECOMPOSE                                [All Depths]
  Step 2   steps/step-02-decompose.md
           Extract claims, build taxonomy, inventory models,
           grade evidence, surface assumptions, identify gaps.

Phase 3: RELATE                                   [All Depths]
  Step 3   steps/step-03-relate.md
           Map convergence/divergence, dialectical tensions,
           analogies, patterns, causal chains, level alignment.

Phase 4: INTEGRATE                                [All Depths]
  Step 4   steps/step-04-integrate.md
           Dialectical integration, framework unification,
           emergence detection, knowledge compression.

Phase 5: CRYSTALLIZE                              [All Depths]
  Step 5   steps/step-05-crystallize.md
           Distill core insights, design mental models,
           extract principles, construct narrative, assess actionability.

Phase 6: OUTPUT                                   [All Depths]
  Step 6   steps/step-06-output.md
           Apply META audit (#601-607). Generate synthesis record
           and report from templates.
```

---

## DECISION POINTS

| After Step | Condition | Action |
|------------|-----------|--------|
| Step 0 | Scope clear | Continue -> Step 1 |
| Step 0 | Question too broad | Decompose into sub-questions, repeat Step 0 |
| Step 1 | Sources sufficient | Continue -> Step 2 |
| Step 1 | Scope needs refinement | Return -> Step 0 |
| Step 2 | Decomposition complete | Continue -> Step 3 |
| Step 2 | More sources needed | Return -> Step 1 |
| Step 3 | Relationships mapped | Continue -> Step 4 |
| Step 3 | New sources/decomposition needed | Return -> Step 1 or 2 |
| Step 4 | Integration reveals gaps | Return -> earlier step |
| Step 4 | Integration complete | Continue -> Step 5 |
| Step 5 | Always | Continue -> Step 6 |
| Step 6 | Deliverables generated | Workflow complete |

**Feedback loops** (standard+ depths only): Steps 1-4 may iterate. Max iterations per depth:
quick=1, standard=3, rigorous=5, comprehensive=unlimited.

---

## DEPTH — METHOD QUICK REFERENCE

```
QUICK:         001-002 | 101-102 | 201,204 | 301-302 | 401,405 | 501
STANDARD:      all SCOPE | 101-103 | 201-205 | 301-306 | 401-405 | 501-504 | META 601,602,606
RIGOROUS:      all methods (except multi-iteration external validation)  | full META
COMPREHENSIVE: all 40 methods | full META | iterations + stakeholder review
```

---

## SCORING QUICK REFERENCE

```
Phase completed: +3       Source processed: +0.5
Method executed: +1       Claim extracted: +0.3
Tension resolved: +1      Relationship mapped: +0.5
Emergent insight: +1.5    META method: +0.5

Coverage: quick C>=15 | standard C>=35 | rigorous C>=50 | comprehensive C>=65
```

---

## For detailed documentation see: [reference.md](./reference.md)

Topics covered in reference.md:
- Core philosophy and principles
- Theoretical foundations (19 theories)
- Depth levels (detailed specifications)
- Execution flow diagram
- META methods (continuous quality)
- Scoring systems (coverage + quality rubrics)
- Integration with other Deep Processes
- File loading protocol
- Directory structure
- Usage guide

---

## VERSION HISTORY

- **V1.1** — Self-contained execution: lean workflow.md + reference.md, invocation moved to step-00
- **V1.0** — Initial release based on DEEP-SYNTHESIS.md methodology
