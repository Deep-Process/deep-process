# 306 - Pattern Detection Across Sources

## Phase
RELATE

## Purpose
Look for recurring patterns that appear across multiple sources, even if the sources don't recognize the pattern. The pattern may only be visible from the synthesis viewpoint — this is where genuine synthesis creates novel insight.

## Pattern Types

| Pattern | Description | Synthesis Value |
|---------|------------|----------------|
| **Recurrence** | Same finding across different contexts | High confidence — context-independent |
| **Scaling** | Pattern changes character at different scales | Reveals scale-dependent dynamics |
| **Oscillation** | Phenomenon alternates between states | Suggests dynamic equilibrium, not static |
| **Emergence** | New property appears at higher level | System-level insight, not reducible to components |
| **Decay/Growth** | Consistent directional trend across sources | Temporal insight — trajectory matters |
| **Phase transition** | Abrupt change at a threshold | Reveals tipping points |
| **Cycle** | Pattern repeats in predictable sequence | Enables prediction of future states |
| **Hierarchy** | Pattern nested at multiple levels | Fractal-like structure |

## Procedure

### Step 1: Cross-Source Finding Layout
Lay out key findings from all sources
- Use standardized format from #201
- Arrange to facilitate comparison

### Step 2: Pattern Scanning
Scan for each pattern type across sources
- Look for recurrences
- Look for scaling effects
- Look for oscillations
- Look for emergence
- Look for trends
- Look for phase transitions
- Look for cycles
- Look for hierarchies

### Step 3: Pattern Documentation
For each pattern found: document thoroughly
- What is the pattern?
- Which sources show it?
- Is it explicit in any source, or only visible in synthesis?

### Step 4: Validation Check
For each pattern: is it REAL or apophenia?
- Apply #601 (Apophenia Check) logic
- What's the base rate of this pattern appearing by chance?
- What would we expect if it weren't real?

### Step 5: Explanation Assessment
Does any source EXPLAIN the pattern?
- If yes: extract the explanation
- If no: this is a novel synthesis finding that needs explanation

### Step 6: Novel Finding Documentation
For unexplained patterns: document as synthesis contribution
- This is where synthesis creates new knowledge
- May generate hypotheses for further investigation

## Output Schema
```yaml
patterns:
  - pattern_id: "P1"
    pattern_type: "recurrence/scaling/oscillation/emergence/decay_growth/phase_transition/cycle/hierarchy"
    description: "[What the pattern is]"
    sources_showing_pattern:
      - source_id: "S1"
        manifestation: "[How it appears in this source]"
      - source_id: "S2"
        manifestation: "[How it appears in this source]"
    visibility:
      explicit_in_source: true/false
      which_sources_explicit: ["S1"]
      synthesis_only: true/false
    validation:
      apophenia_risk: "high/medium/low"
      validation_method: "[How validated]"
      confidence: "high/medium/low"
    explanation:
      explained_by_source: true/false
      explanation: "[If explained, what]"
      novel_finding: true/false
```

## Pattern Detection Questions

### For Recurrence
- Does this finding appear in multiple sources independently?
- Are the contexts different enough to rule out shared cause?

### For Scaling
- Does behavior change as we go from small to large?
- Are there breakpoints where qualitative changes occur?

### For Oscillation
- Does this phenomenon swing between states?
- Is there a predictable period or rhythm?

### For Emergence
- Does a new property appear at aggregate level?
- Is it not present in individual components?

### For Decay/Growth
- Is there a consistent trend across time in multiple sources?
- What's the trajectory?

### For Phase Transition
- Is there evidence of abrupt change at some threshold?
- What triggers the transition?

### For Cycle
- Does this repeat in a predictable sequence?
- What drives the cycle?

### For Hierarchy
- Does the pattern appear at multiple levels?
- Is it self-similar across scales?

## Quality Checks
- [ ] All pattern types systematically checked
- [ ] Patterns documented with sources
- [ ] Validation performed for each pattern
- [ ] Explanations noted or marked as novel
- [ ] Apophenia risk assessed

## Connections
- Uses: #201 (Claims), #301 (Convergence-Divergence)
- Feeds into: #403 (Emergence Detection), #601 (Apophenia Check)
- Enables: Novel synthesis findings
- Warning: Subject to apophenia — must validate
