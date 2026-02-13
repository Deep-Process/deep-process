# 602 - Confirmation Bias Audit

## Phase
META (continuous)

## Purpose
Check whether the synthesis selectively weighted evidence that confirms a pre-existing view while downweighting evidence that contradicts it. Confirmation bias is the most insidious threat to synthesis quality.

## Theoretical Foundation
> **Confirmation Bias:** The tendency to search for, interpret, favor, and recall information that confirms one's preexisting beliefs.
>
> In synthesis:
> - Sources selected because they confirm expected answer
> - Contradicting sources given less weight
> - Ambiguous evidence interpreted in favor of prior belief
> - Synthesis conclusion remarkably similar to what was believed before

## Procedure

### Step 1: Prior View Documentation
What was the synthesizer's PRIOR VIEW before starting?
- Document explicitly
- Include: beliefs, expectations, hypotheses, preferences
- Be honest — prior views always exist

### Step 2: Conclusion Alignment Check
Does the synthesis conclusion ALIGN with the prior view?
- Exact match? → Red flag
- Partial alignment? → Check evidence
- Contradicts prior? → Good sign (or check for reverse bias)

### Step 3: Counter-Evidence Weight Check
Were counter-sources (#105) given adequate weight?
- How much weight did contradicting sources receive?
- Were contradicting sources dismissed for valid reasons?
- Were valid contradicting arguments fully addressed?

### Step 4: Divergence Exploration Check
Were divergences fully explored?
- From #301 divergences: all addressed?
- Were any dismissed without full investigation?
- Were any interpreted in favor of prior view?

### Step 5: Inversion Test
If someone with the OPPOSITE prior view looked at the same sources, would they reach the same synthesis?
- Imagine contrary synthesizer
- Would they weight evidence differently?
- Would they see different patterns?
- If different synthesis, bias is likely present

### Step 6: Source Selection Check
Were sources chosen to CONFIRM or to INVESTIGATE?
- Check #101 source collection
- Were sources sought that might contradict?
- Or were sources selected to support expected answer?

### Step 7: Bias Verdict
Rate overall confirmation bias risk
- Low: Prior different from conclusion, counter-evidence weighted, passes inversion
- Medium: Some alignment, reasonable weighing
- High: Conclusion matches prior, counter-evidence dismissed, fails inversion

## Output Schema
```yaml
confirmation_bias_audit:
  prior_view:
    documented: true/false
    prior_belief: "[What was believed before synthesis]"
    prior_expectation: "[What outcome was expected]"
  alignment_check:
    conclusion_aligns_with_prior: true/false
    degree_of_alignment: "exact/partial/contradicts"
    red_flag: true/false
  counter_evidence_check:
    counter_sources_present: true/false
    counter_sources_weight: "adequate/insufficient"
    dismissals_justified: true/false
    valid_arguments_addressed: true/false
  divergence_exploration:
    all_divergences_addressed: true/false
    any_dismissed_prematurely: true/false
    interpretation_favored_prior: true/false
  inversion_test:
    performed: true/false
    contrary_synthesizer_conclusion: "[What they might conclude]"
    would_differ: true/false
    reason_for_difference: "[Why they'd differ]"
  source_selection_check:
    sources_sought_to_contradict: true/false
    sources_selected_to_confirm: true/false
  bias_verdict: "low/medium/high"
  bias_reasoning: "[Why this verdict]"
  corrective_action: "[If bias found, what to do]"
```

## Inversion Test Deep Dive

### How to Perform
1. Identify the opposite prior view
2. Imagine a synthesizer with that view
3. Review all evidence from their perspective
4. Ask: where would they weight differently?
5. Ask: what patterns would they see?
6. Ask: what would their synthesis be?

### Interpretation
- Same synthesis → Low bias (evidence is compelling)
- Different synthesis → Potential bias (weighting influenced by prior)
- Unknown → Cannot determine (need external review)

## Bias Indicators

### Source Selection Bias
- All sources from same perspective as prior
- Counter-sources not sought
- Sources selected after conclusion formed

### Interpretation Bias
- Ambiguous evidence interpreted in favor of prior
- Contradicting evidence explained away
- Confirming evidence accepted uncritically

### Weighting Bias
- Higher quality assigned to confirming sources
- Lower quality assigned to contradicting sources
- More attention to confirming details

### Recall Bias
- Confirming evidence remembered more clearly
- Contradicting evidence forgotten or minimized
- Summary emphasizes confirming findings

## Corrective Actions

If bias detected:
1. **Re-weight evidence:** Adjust for detected bias
2. **Seek counter-sources:** Actively find contradicting views
3. **External review:** Have someone with different prior review
4. **Acknowledge:** Document bias risk in synthesis output

## Quality Checks
- [ ] Prior view explicitly documented
- [ ] Alignment with prior checked
- [ ] Counter-evidence weighting assessed
- [ ] All divergences addressed
- [ ] Inversion test performed
- [ ] Source selection bias checked
- [ ] Bias verdict assigned
- [ ] Corrective actions taken if needed

## When to Apply
- **Required for:** All synthesis depths
- **Critical for:** High-stakes decisions
- **Especially when:** Synthesizer has strong prior beliefs

## Connections
- Uses: #105 (Counter-Source Search), #301 (Convergence-Divergence), #102 (Source Quality)
- Feeds into: Final synthesis validation
- Prevents: Synthesis that merely confirms what was already believed
- Key: Is this synthesis or validation of prior belief?
