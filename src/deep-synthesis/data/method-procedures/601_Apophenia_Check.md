# 601 - Apophenia Check

## Phase
META (continuous)

## Purpose
Test whether detected patterns (#306) are REAL or imposed by the synthesizer's pattern-seeking brain. Humans are pattern-completion machines — we see faces in clouds and causation in coincidence. This check guards against FALSE COHERENCE.

## Theoretical Foundation
> **Apophenia:** The tendency to perceive meaningful connections between unrelated things.
> Humans are evolutionarily wired to detect patterns — it's better to see a tiger that isn't there than miss one that is.
> This same wiring creates false patterns in synthesis.

## Detection Methods

| Method | Description | How to Apply |
|--------|-------------|--------------|
| **Base rate test** | What's the probability by chance? | Calculate expected random occurrence |
| **Prediction test** | If real, what else should be true? | Generate and test predictions |
| **Alternative explanation test** | Is there a simpler explanation? | Generate alternative hypotheses |
| **Independent observer test** | Would others see the same pattern? | Get external perspective |
| **Removal test** | Does pattern survive source removal? | Remove sources one by one |

## Procedure

### Step 1: Pattern Inventory
List all patterns detected in synthesis
- From #306 (Pattern Detection)
- From #403 (Emergence Detection)
- From #304 (Conceptual Blends)

### Step 2: Base Rate Test
For each pattern: what's the base rate?
- What's the probability this pattern appears by CHANCE?
- If probability is high, pattern needs stronger evidence

### Step 3: Prediction Test
If the pattern is real, what ELSE should be true?
- Generate testable predictions
- Check those predictions against available evidence
- Failed predictions → pattern may be false

### Step 4: Alternative Explanation Test
Is there a simpler explanation?
- Generate explanations that DON'T require the pattern
- If simpler explanations work, pattern may be imposed
- Apply Occam's razor

### Step 5: Independent Observer Test
Would someone with different expertise see the same pattern?
- Describe the data without the pattern interpretation
- Ask: would they see the same pattern?
- Divergent interpretations → caution warranted

### Step 6: Removal Test
Remove one source from the synthesis
- Does the pattern survive?
- If pattern depends on a single source, it's weak
- Pattern should be robust to source removal

### Step 7: Verdict Assignment
For each pattern: real, likely, uncertain, or probably false
- Based on all tests
- Document reasoning

## Output Schema
```yaml
apophenia_check:
  patterns_checked:
    - pattern_id: "P1"
      pattern: "[The pattern]"
      source: "method_306/method_403/method_304"
      tests:
        base_rate:
          probability_by_chance: "high/medium/low"
          calculation: "[How determined]"
        prediction:
          predictions_made: ["[Prediction 1]", "[Prediction 2]"]
          predictions_confirmed: N
          predictions_failed: N
        alternative_explanation:
          alternatives_generated: ["[Alt 1]", "[Alt 2]"]
          simpler_than_pattern: true/false
        independent_observer:
          performed: true/false
          result: "[What they saw]"
        removal:
          sources_removed_one_by_one: true/false
          pattern_survived_all_removals: true/false
          pattern_depends_on_single_source: true/false
      verdict: "real/likely/uncertain/probably_false"
      verdict_reasoning: "[Why this verdict]"
  summary:
    total_patterns: N
    real: N
    likely: N
    uncertain: N
    probably_false: N
    action_on_false: "[What to do with false patterns]"
```

## Red Flags for Apophenia

### Warning Signs
- Pattern only visible after extensive "massaging" of data
- Pattern depends on specific framing or ordering of sources
- No one outside the synthesis team sees it
- Pattern conveniently confirms synthesizer's prior beliefs
- Pattern requires ignoring contradicting evidence
- Pattern only makes sense with special interpretation

### High Risk Situations
- Small number of sources (coincidence more likely)
- Sources from same paradigm/method (shared bias)
- Synthesizer has strong prior beliefs about answer
- Pattern is what was expected before synthesis
- Pattern produces satisfying narrative

## Apophenia vs Real Pattern

### Real Pattern Characteristics
- Survives base rate challenge
- Generates confirmed predictions
- No simpler alternative
- Multiple independent observers see it
- Survives source removal
- Mechanism can explain it

### Apophenia Characteristics
- Fails base rate test
- Predictions fail
- Simpler alternatives exist
- Others don't see it
- Depends on specific sources
- No mechanism, just observation

## Quality Checks
- [ ] All significant patterns identified
- [ ] Base rate test applied
- [ ] Prediction test applied
- [ ] Alternative explanations generated
- [ ] Independent observer consulted (if feasible)
- [ ] Removal test performed
- [ ] Verdict assigned with reasoning
- [ ] False patterns flagged for removal

## When to Apply
- **Required for:** Rigorous+ depths
- **Always apply when:** Novel patterns emerge from synthesis
- **Critical for:** High-stakes synthesis decisions

## Connections
- Uses: #306 (Pattern Detection), #403 (Emergence Detection), #304 (Conceptual Blends)
- Feeds into: Final synthesis validation
- Grounded in: Cognitive science (pattern perception), Taleb (Narrative Fallacy)
- Prevents: False coherence from imposed patterns
