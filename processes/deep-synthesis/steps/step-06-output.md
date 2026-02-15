# STEP 06: OUTPUT

## META AUDIT PHASE

### 06.M1 Apophenia Check (#601)

TRIGGER: Entering OUTPUT phase
ACTION:
```
LOAD data/method-procedures/601_Apophenia_Check.md

EXECUTE:
1. REVIEW all patterns identified in synthesis

2. FOR each pattern:

   APOPHENIA TESTS:

   a. NULL MODEL test:
      GENERATE random data matching source characteristics
      CHECK: Does "pattern" appear in random data?
      IF YES at similar rate: Pattern is spurious

   b. MECHANISM test:
      ASK: WHY would this pattern exist?
      IF no plausible mechanism: Pattern suspicious

   c. PREDICTION test:
      Does pattern predict new observations?
      TEST with held-out data (if available)
      IF fails prediction: Pattern is noise

   d. ROBUSTNESS test:
      Remove 20% of data randomly
      Does pattern persist?
      IF disappears: Pattern is fragile

   PASS_COUNT = tests passed

   IF PASS_COUNT < 3:
      REJECT pattern as apophenia

3. SPECIFIC apophenia types:

   a. CLUSTERING ILLUSION:
      Seeing clusters in random distributions
      TEST: Compare to Poisson distribution

   b. CONFIRMATION BIAS PATTERN:
      Seeing expected pattern, missing counter-evidence
      TEST: Actively seek disconfirming cases

   c. TEXAS SHARPSHOOTER:
      Finding pattern post-hoc, claiming prediction
      TEST: Was pattern predicted a priori?

   d. PAREIDOLIA:
      Seeing meaningful structure in noise
      TEST: Inter-rater agreement on pattern

4. DOCUMENT apophenia check results:

   FOR each pattern:
      status = [VALIDATED | SUSPICIOUS | REJECTED]
      tests = {test: result}
      decision = [keep with caveat | remove]
```

OUTPUT: apophenia_report = {patterns_tested, rejected, caveats}

VERIFICATION:
```
PASS IF: All patterns validated or flagged
FAIL IF: Suspicious patterns presented as certain
```

### 06.M2 Confirmation Bias Audit (#602)

TRIGGER: Apophenia checked (standard+)
ACTION:
```
LOAD data/method-procedures/602_Confirmation_Bias_Audit.md

EXECUTE:
1. IDENTIFY synthesis "thesis" (dominant narrative)

2. SEARCH for confirmation bias:

   a. EVIDENCE WEIGHTING:
      Did we weight evidence supporting thesis more heavily?

      TEST:
      - List evidence FOR thesis
      - List evidence AGAINST thesis
      - Compare quality grades

      IF FOR evidence has lower average quality:
         FLAG: May have accepted weaker supporting evidence

   b. SEARCH BIAS:
      Did we search harder for confirming evidence?

      TEST:
      - Counter-Source Search (#105) executed?
      - Were counter-sources steel-manned?
      - Were disconfirming findings given fair hearing?

      IF counter-search weak:
         FLAG: Search bias

   c. INTERPRETATION BIAS:
      Did we interpret ambiguous evidence favorably?

      TEST:
      - Identify ambiguous findings
      - Check: Could they support alternative thesis?
      - Was alternative interpretation considered?

      IF always interpreted to support thesis:
         FLAG: Interpretation bias

   d. MEMORY/ATTENTION BIAS:
      Did we forget/ignore disconfirming evidence?

      TEST:
      - Review source inventory
      - Check: Are some sources under-utilized?
      - Are counter-sources cited in synthesis?

      IF disconfirming sources absent from synthesis:
         FLAG: Attention bias

3. QUANTIFY bias:

   bias_score = SUM(flags) / total_tests

   IF bias_score > 0.3:
      REQUIRE: Revision to address bias

4. MITIGATION actions:

   FOR each flagged bias:
      - Upgrade counter-evidence where appropriate
      - Add alternative interpretations
      - Balance narrative
      - Acknowledge limitations

5. RE-AUDIT after mitigation:

   REPEAT tests
   VERIFY bias_score reduced
```

OUTPUT: confirmation_bias_report = {flags, score, mitigations}

VERIFICATION:
```
PASS IF: bias_score < 0.3 after mitigation
WARN IF: bias_score 0.3-0.5
FAIL IF: bias_score > 0.5
```

### 06.M3 Completeness Assessment (#603)

TRIGGER: Confirmation bias audited (rigorous+)
ACTION:
```
LOAD data/method-procedures/603_Completeness_Assessment.md

EXECUTE:
1. LOAD synthesis_question from SCOPE

2. DECOMPOSE question into sub-questions:

   IF Q = "What do X tell us about Y for Z?"

   sub_questions = [
     "What do X claim about Y?",
     "How confident are X?",
     "Where do X agree/disagree?",
     "What does synthesis add beyond X?",
     "How does this help Z?"
   ]

3. FOR each sub_question:

   ASSESS coverage:
   - Fully answered: synthesis directly addresses
   - Partially answered: synthesis touches on but incomplete
   - Unanswered: synthesis doesn't address
   - Out of scope: sub-question not relevant

4. COMPUTE completeness:

   completeness = (fully + 0.5*partially) / relevant_questions

   TARGET:
   - quick: >70%
   - standard: >80%
   - rigorous: >90%
   - comprehensive: >95%

   IF below target:
      IDENTIFY gaps
      DECISION:
      - Fill gaps (return to earlier phase)
      - Accept limitation (document gap)

5. CHECK unacknowledged gaps:

   FOR each unanswered sub-question:
      IS gap acknowledged in synthesis?

      IF NO:
         SILENT GAP - Critical error
         REQUIRE: Acknowledge OR fill

6. DOCUMENT completeness:

   completeness_report = {
     target: depth_target,
     actual: completeness_score,
     gaps: [list],
     acknowledged: [bool per gap]
   }
```

OUTPUT: completeness_report

VERIFICATION:
```
PASS IF: completeness >= target AND all gaps acknowledged
WARN IF: completeness marginally below target
FAIL IF: silent gaps OR completeness << target
```

### 06.M4 Falsifiability Check (#604)

TRIGGER: Completeness assessed (standard+)
ACTION:
```
LOAD data/method-procedures/604_Falsifiability_Check.md

EXECUTE (Popper's Criterion):
1. LIST all major synthesis claims:

   claims = [
     core_insights,
     principles,
     framework_assertions,
     causal_claims,
     predictions
   ]

2. FOR each claim:

   a. FORMULATE falsification test:
      "What observation/evidence would prove this claim FALSE?"

      falsification_test = [specific testable condition]

   b. EVALUATE test quality:

      GOOD test:
      - Specific (not vague)
      - Observable (not metaphysical)
      - Feasible (can actually perform)
      - Conclusive (clear pass/fail)

      BAD test:
      - "Nothing could prove it false" → UNFALSIFIABLE
      - "It depends" → TOO VAGUE
      - "In principle but not in practice" → NOT FEASIBLE

   c. CLASSIFY claim:

      IF has good falsification test:
         SCIENTIFIC (Popper criterion met)

      IF has bad/no test:
         UNFALSIFIABLE
         OPTIONS:
         - Restate to make falsifiable
         - Acknowledge as assumption/definition
         - Remove from synthesis

3. ENFORCE falsifiability (RULE 7):

   unfalsifiable_count = COUNT(unfalsifiable claims)

   IF any CORE claim unfalsifiable:
      HALT "Unfalsifiable core claim (violates RULE 7)"

   IF >30% peripheral claims unfalsifiable:
      WARN: "High unfalsifiability rate"

4. DOCUMENT falsification tests:

   FOR each claim:
      claim_doc = {
        claim: statement,
        falsification_test: test,
        test_quality: [GOOD | MARGINAL | POOR],
        status: [FALSIFIABLE | UNFALSIFIABLE]
      }
```

OUTPUT: falsifiability_report = {claims_tested, falsifiable_rate, documented_tests}

VERIFICATION:
```
PASS IF: All core claims falsifiable
WARN IF: Some peripheral claims unfalsifiable
FAIL IF: Core claims unfalsifiable (RULE 7 violation)
```

### 06.M5 Source Bias Propagation Check (#605)

TRIGGER: Falsifiability checked (rigorous+)
ACTION:
```
LOAD data/method-procedures/605_Source_Bias_Propagation_Check.md

EXECUTE:
1. IDENTIFY biases in individual sources:

   source_biases = FROM quality_assessment (step 01)

   FOR each source with bias_score > LOW:
      biased_sources.add(source)

2. TRACE bias propagation:

   FOR each biased_source:

      a. FIND claims from this source in synthesis

      b. CHECK: Are biased claims over-represented?

         representation = claims_from_source / total_claims
         expected = 1 / source_count

         IF representation > 2 * expected:
            FLAG: Over-reliance on biased source

      c. CHECK: Are biases amplified?

         IF synthesis conclusion mirrors source bias:
            AND other sources don't share bias:
            FLAG: Bias amplification

   3. DETECT emergent biases:

      IF most sources share same bias:
         EXAMPLE: Publication bias (only positive results published)

         RESULT: Synthesis inherits shared bias

         MITIGATION:
         - Acknowledge shared bias
         - Adjust confidence
         - Note what's missing from literature

4. QUANTIFY bias propagation:

   FOR each identified bias:
      severity = [LOW | MEDIUM | HIGH]
      mitigation = [action taken]

   propagation_score = weighted_sum(severity)

   IF propagation_score > threshold:
      REQUIRE: Stronger mitigation OR confidence reduction

5. DOCUMENT bias propagation:

   propagation_report = {
     source_biases_identified: count,
     propagated_to_synthesis: list,
     mitigations: actions,
     residual_bias: assessment
   }
```

OUTPUT: propagation_report

VERIFICATION:
```
PASS IF: Biases acknowledged and mitigated
WARN IF: Some bias propagation detected
FAIL IF: Unacknowledged bias amplification
```

### 06.M6 Novel Information Test (#606)

TRIGGER: Bias propagation checked (standard+)
ACTION:
```
LOAD data/method-procedures/606_Novel_Information_Test.md

EXECUTE (Shannon Information Theory):
1. DEFINE novelty criterion:

   novel_information = information in synthesis NOT in any single source

   SHANNON: I(synthesis; sources) vs I(sources; synthesis)

2. TEST each synthesis element:

   FOR element in [insights, principles, framework, narrative]:

      a. SEARCH sources:
         Is this element explicitly in any source?

         IF YES in source_i:
            element_novelty = NONE (just citation)

         IF NO in any single source:
            CONTINUE to combination test

      b. COMBINATION test:
         Can element be derived by SIMPLE COMBINATION of sources?

         SIMPLE = union, intersection, aggregation
         COMPLEX = synthesis, transformation, emergence

         IF simple combination:
            element_novelty = LOW (compilation)

         IF requires complex synthesis:
            element_novelty = HIGH (genuine synthesis)

      c. SURPRISE test:
         Would element surprise source authors?

         IF NO (they knew this):
            element_novelty = LOW

         IF YES (genuinely new insight):
            element_novelty = HIGH

3. COMPUTE synthesis novelty score:

   novelty_score = WEIGHTED_AVERAGE([
     element_novelty_scores,
     weights = element_importance
   ])

   TARGET:
   - quick: >30%
   - standard: >50%
   - rigorous: >70%
   - comprehensive: >80%

   IF below target:
      HALT "Insufficient novelty - this is summary, not synthesis (RULE 6)"

4. DISTINGUISH synthesis from summary:

   SUMMARY:
   - Restates source content
   - Novelty = arrangement only
   - No emergent insights

   SYNTHESIS:
   - Creates new knowledge
   - Novelty = content
   - Emergent insights present

   VERDICT:
   IF novelty_score >= target: SYNTHESIS
   ELSE: SUMMARY (insufficient)
```

OUTPUT: novelty_report = {novelty_score, target, verdict, evidence}

VERIFICATION:
```
PASS IF: novelty_score >= target (RULE 6 satisfied)
FAIL IF: novelty_score < target (RULE 6 violation - not synthesis)
```

### 06.M7 Synthesis Decay Monitoring (#607)

TRIGGER: Novelty tested (comprehensive)
ACTION:
```
LOAD data/method-procedures/607_Synthesis_Decay_Monitoring.md

EXECUTE:
1. IDENTIFY decay triggers:

   synthesis_decays_when:
   - New research contradicts findings
   - Source field evolves
   - Context changes (e.g., technology shift)
   - Assumptions invalidated
   - Scope boundaries crossed

2. FOR each synthesis claim:

   SPECIFY decay indicators:
   - What new evidence would weaken this?
   - What field developments would challenge this?
   - What context changes would limit this?

3. DESIGN monitoring plan:

   monitoring_plan = {
     what_to_monitor: [
       new_publications_in_domain,
       contradicting_evidence,
       assumption_validity,
       scope_condition_changes
     ],
     how_to_monitor: [
       automated_alerts,
       periodic_review,
       expert_consultation
     ],
     review_frequency: [
       critical_claims: quarterly,
       core_claims: annually,
       peripheral_claims: bi-annually
     ],
     update_trigger: [
       conditions_that_require_synthesis_update
     ]
   }

4. SET expiration date:

   FOR claim:
      IF rapidly_evolving_field:
         valid_until = NOW + 1 year
      ELSE IF stable_field:
         valid_until = NOW + 5 years
      ELSE:
         valid_until = NOW + 3 years

      claim.expiration = valid_until

5. DOCUMENT decay plan:

   decay_monitoring_doc = {
     decay_triggers: list,
     indicators: per_claim,
     monitoring_plan: plan,
     expiration_dates: dates,
     update_protocol: procedure
   }
```

OUTPUT: decay_monitoring_plan

VERIFICATION:
```
PASS IF: Monitoring plan complete and feasible
```

### 06.M8 Competence Boundary Mapping (#121)

TRIGGER: All META methods complete
ACTION:
```
LOAD methods/method-procedures/121_Competence_Boundary_Mapping.md

EXECUTE:
1. DECLARE knowledge gaps:

   gaps = {
     topics: [topics not deeply understood],
     methods: [methods not mastered],
     domains: [domains outside expertise]
   }

2. DECLARE skill gaps:

   skill_gaps = {
     analysis: [analytical limitations],
     technical: [technical limitations],
     domain_knowledge: [domain expertise lacking]
   }

3. MAP guess vs know:

   FOR each synthesis claim:
      CLASSIFY:
      - KNOW: Based on evidence and analysis
      - INFER: Logical derivation with confidence
      - GUESS: Speculation or weak evidence
      - UNKNOWN: Acknowledged gap

      claim.epistemic_status = classification

4. ASSESS confidence calibration:

   FOR claims marked HIGH confidence:
      CHECK: Is evidence sufficient for HIGH?
      TEST: Inter-rater agreement (if possible)

   FOR claims marked LOW confidence:
      CHECK: Should these be in synthesis at all?

5. DOCUMENT competence boundaries:

   competence_map = {
     knowledge_gaps: gaps,
     skill_gaps: skill_gaps,
     guess_inventory: [claims classified as GUESS],
     confidence_calibration: assessment,
     verification_needs: [what user should independently verify]
   }

6. COMMUNICATE limitations clearly:

   limitations_statement = {
     what_synthesis_covers: [strength areas],
     what_synthesis_doesn't_cover: [gap areas],
     what_needs_expert_review: [uncertain areas],
     what_user_should_verify: [verification needs]
   }
```

OUTPUT: competence_boundary_map + limitations_statement

VERIFICATION:
```
PASS IF: Boundaries honestly documented
FAIL IF: Competence overstated or gaps hidden
```

## COMPILE PHASE

### 06.C1 Synthesis Record Generation

TRIGGER: All META audits complete
ACTION:
```
LOAD data/synthesis-record-template.md

EXECUTE:
1. COMPILE synthesis record:

SYNTHESIS_RECORD = {
  metadata: {
    synthesis_id: unique_id,
    date: NOW(),
    depth: depth,
    question: synthesis_question,
    level: target_level,
    sources_count: source_count,
    agent: "Deep Synthesis Agent v2.0"
  },

  scope: {
    question: synthesis_question,
    level: target_level,
    landscape: source_landscape,
    diversity_flags: flags
  },

  sources: {
    inventory: source_inventory,
    quality_distribution: distribution,
    diversity_status: diversity_assessment
  },

  decomposition: {
    claims_count: total_claims,
    taxonomy: concept_taxonomy,
    models: model_inventory,
    assumptions: assumptions_inventory,
    gaps: knowledge_gaps
  },

  relationships: {
    convergence_rate: rate,
    tensions: dialectical_tensions,
    patterns: patterns_identified,
    causal_model: causal_graph,
    analogies: analogies
  },

  integration: {
    syntheses: dialectical_syntheses,
    framework: unified_framework,
    emergence: emergent_insights,
    explanations: abductive_synthesis,
    compression_ratio: ratio,
    boundaries: boundary_map
  },

  crystallization: {
    core_insights: insights (3-7),
    mental_model: model,
    principles: principles,
    narrative: narrative,
    actionability: recommendations
  },

  meta_audit: {
    apophenia: apophenia_report,
    confirmation_bias: bias_report,
    completeness: completeness_report,
    falsifiability: falsifiability_report,
    bias_propagation: propagation_report,
    novelty: novelty_report,
    decay_monitoring: decay_plan,
    competence_boundaries: competence_map
  },

  scoring: {
    coverage_score: C,
    method_count: methods_executed,
    phase_completion: phases_complete,
    quality_indicators: indicators
  },

  verification_trail: {
    liars_trap: results_per_phase,
    mirror_trap: results_per_phase,
    cui_bono: decisions_analyzed,
    semantic_entropy: entropy_scores,
    approval_gradient: gradient_assessment
  },

  limitations: {
    scope_limitations: limitations,
    evidence_limitations: limitations,
    competence_boundaries: boundaries,
    acknowledged_gaps: gaps
  }
}

2. VALIDATE record completeness:

   CHECK all required sections present
   CHECK no placeholder values
   CHECK all references resolve
```

OUTPUT: synthesis_record (structured data)

### 06.C2 Synthesis Report Generation

TRIGGER: Record compiled
ACTION:
```
LOAD data/synthesis-report-template.md

EXECUTE:
1. GENERATE synthesis report (human-readable):

SYNTHESIS_REPORT = """
# SYNTHESIS REPORT: [synthesis_question]

## EXECUTIVE SUMMARY
[1-paragraph synthesis of core insights]

## SYNTHESIS QUESTION
[question + context + purpose]

## METHODOLOGY
Depth: [depth]
Sources: [count, quality, diversity]
Methods: [methods_executed]
Coverage: [C score]

## CORE INSIGHTS (3-7)
[for each insight:
  ### [Insight title]
  [Statement]
  **Why it matters:** [importance]
  **Evidence:** [supporting evidence]
  **Confidence:** [H/M/L with justification]
  **Falsification:** [what would disprove]
]

## MENTAL MODEL [if standard+]
[diagram/description]
[usage guide]

## PRINCIPLES [if standard+]
[for each principle:
  - **Principle:** [statement]
  - **Scope:** [conditions]
  - **Mechanism:** [why it holds]
  - **Falsification:** [test]
]

## NARRATIVE [if rigorous+]
[compelling story of synthesis journey]

## ACTIONABLE RECOMMENDATIONS
[prioritized list]

## SYNTHESIS PROCESS
### Sources Analyzed
[source inventory table]

### Key Tensions Resolved
[dialectical syntheses]

### Emergent Insights
[novel findings]

### Framework
[unified framework if generated]

## QUALITY ASSURANCE
### Verification Results
- Compression ratio: [ratio] (<0.5 required)
- Novelty score: [score] (>target required)
- Falsifiability: [all core claims falsifiable]
- Completeness: [percentage]

### Limitations
- Scope: [what's not covered]
- Evidence: [what's uncertain]
- Competence: [what needs expert review]

### Bias Assessment
- Confirmation bias: [score + mitigations]
- Source bias propagation: [assessment]
- Approval gradient: [passed]

## META-SYNTHESIS
### What This Synthesis Adds
[Shannon novelty test results]

### Confidence Calibration
[high/medium/low claims with justification]

### Decay Monitoring
[when to update, what triggers update]

## APPENDICES
A. Source Inventory
B. Claim Database
C. Relationship Matrix
D. Verification Trail

---
Generated by Deep Synthesis v2.0
Coverage Score: [C]
Depth: [depth]
Date: [date]
"""

2. FORMAT for readability:

   - Headers hierarchy clear
   - Tables formatted
   - Lists bulleted
   - Key points bold
   - Diagrams included

3. VERIFY report quality:

   TESTS:
   - Can someone understand synthesis without reading sources?
   - Are all claims traceable to evidence?
   - Are limitations clearly stated?
   - Is it actionable?

   IF fails any: REVISE
```

OUTPUT: synthesis_report (markdown document)

### 06.C3 Deliverable Packaging

TRIGGER: Report generated
ACTION:
```
1. PACKAGE deliverables:

deliverables = {
  primary: {
    synthesis_report: [markdown file],
    synthesis_record: [YAML/JSON file]
  },

  supporting: {
    source_inventory: [CSV/table],
    claim_database: [structured data],
    relationship_matrix: [graph data],
    verification_trail: [audit log]
  },

  artifacts: {
    mental_model_diagram: [image if created],
    framework_visualization: [image if created],
    causal_graph: [graph if created]
  }
}

2. COMPUTE final scores:

final_scores = {
  coverage_score: C,
  quality_score: Q,
  novelty_score: N,
  completeness_score: completeness,
  confidence_score: weighted_average(claim_confidences)
}

3. GENERATE summary card:

SUMMARY_CARD = """
+------------------------------------------------+
| DEEP SYNTHESIS SUMMARY                         |
+------------------------------------------------+
| Question: [truncated to 60 chars]              |
| Depth: [depth] | Sources: [N] | Insights: [N]  |
| Coverage: [C] | Quality: [Q] | Novelty: [N]%  |
| Confidence: [H/M/L] | Completeness: [%]         |
+------------------------------------------------+
| Core Finding: [one-sentence key insight]       |
| Key Action: [one-sentence recommendation]      |
+------------------------------------------------+
"""
```

OUTPUT: deliverables_package + final_scores + summary_card

## FINAL GATE

```
OUTPUT_COMPLETE = CHECK ALL:
[ ] All META audits passed (or failures addressed)
[ ] Synthesis record compiled
[ ] Synthesis report generated
[ ] Report quality verified
[ ] Deliverables packaged
[ ] Final scores computed
[ ] Summary card created

AND CRITICAL RULES VERIFIED:
[ ] RULE 5: Compression ratio < 0.5
[ ] RULE 6: Novelty score >= target
[ ] RULE 7: All core claims falsifiable

IF all checked: SYNTHESIS COMPLETE
ELSE: HALT "OUTPUT incomplete"
```

## COMPLETION

```
IF FINAL GATE passed:

   DISPLAY summary_card

   PROVIDE deliverables:
   - synthesis_report.md
   - synthesis_record.yaml
   - supporting files

   STATUS: SUCCESS

   MESSAGE: """
   Synthesis complete.
   Coverage: [C]
   Core insights: [N]
   Novelty: [N%]
   Confidence: [H/M/L]

   See synthesis_report.md for full results.
   """

ELSE:
   HALT with specific blockers
```

## COMPLIANCE

Zasady spełnione: ✓ 0-13 All rules
Process complete: SYNTHESIS delivered
