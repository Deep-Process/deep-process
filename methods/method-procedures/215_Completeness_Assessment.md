# 603 - Completeness Assessment

## Phase
META (continuous)

## Purpose
Evaluate whether the synthesis adequately covers the synthesis question. Incomplete synthesis is fine — as long as the gaps are acknowledged. Unacknowledged incompleteness is dangerous.

## Completeness Dimensions

| Dimension | Question | Check Method |
|-----------|----------|--------------|
| **Question coverage** | Does the synthesis address ALL aspects of the question? | Compare synthesis to #001 |
| **Source utilization** | Were all collected sources actually used? | Audit source usage |
| **Contradiction resolution** | Were all divergences addressed? | Check #301, #302 |
| **Gap acknowledgment** | Are known gaps documented? | Check #206, #308 |
| **Level coverage** | Are all relevant levels of analysis included? | Check #002, #307 |
| **Perspective coverage** | Are all relevant viewpoints addressed? | Check #103 |

## Procedure

### Step 1: Question Coverage Assessment
Compare synthesis outputs to synthesis question (#001)
- What aspects of the question does synthesis address?
- What aspects are NOT addressed?
- Is anything missing that the question requires?

### Step 2: Source Utilization Audit
Check whether all collected sources contributed
- List all sources from #101
- For each: did it contribute to synthesis?
- If not used: why? Valid exclusion or oversight?

### Step 3: Contradiction Resolution Check
Were all identified divergences addressed?
- From #301: all divergences accounted for?
- From #302: all tensions resolved or acknowledged?
- Any contradictions swept under the rug?

### Step 4: Gap Acknowledgment Check
Are known gaps documented in synthesis output?
- From #206: knowledge gaps acknowledged?
- From #308: systematic gaps documented?
- Are gaps visible to synthesis consumers?

### Step 5: Level Coverage Check
Are all relevant levels of analysis included?
- From #002: target levels
- Does synthesis cover all target levels?
- Any level gaps?

### Step 6: Perspective Coverage Check
Are all relevant viewpoints addressed?
- From #103: diversity dimensions
- Are all perspectives represented in synthesis?
- Any perspectives systematically missing?

### Step 7: Adequacy Judgment
Overall: is the synthesis ADEQUATE for its intended purpose?
- Complete enough for the decisions it will inform
- Not necessarily perfect — practical completeness

## Output Schema
```yaml
completeness_assessment:
  question_coverage:
    aspects_addressed: ["[Aspect 1]", "[Aspect 2]"]
    aspects_not_addressed: ["[Missing aspect]"]
    coverage_ratio: "X/Y aspects"
    score: "complete/mostly/partial/incomplete"
  source_utilization:
    total_sources: N
    sources_used: N
    sources_not_used:
      - source_id: "S5"
        reason_not_used: "[Why not used]"
        valid_exclusion: true/false
    utilization_ratio: "X/Y"
  contradiction_resolution:
    divergences_total: N
    divergences_resolved: N
    divergences_acknowledged: N
    divergences_ignored: N
    unresolved_list: ["[Unresolved contradiction]"]
  gap_acknowledgment:
    gaps_from_206: N
    gaps_documented_in_output: N
    gaps_missing_from_output: ["[Gap not documented]"]
    acknowledgment_ratio: "X/Y"
  level_coverage:
    target_levels: ["[From #002]"]
    levels_covered: ["[Covered levels]"]
    levels_missing: ["[Missing levels]"]
  perspective_coverage:
    required_perspectives: ["[From #103]"]
    perspectives_covered: ["[Covered]"]
    perspectives_missing: ["[Missing]"]
  overall:
    status: "complete/mostly_complete/partial/incomplete"
    adequate_for_purpose: true/false
    adequacy_reasoning: "[Why adequate or not]"
    recommendations: ["[What to improve]"]
```

## Bonini's Paradox Check

> **Bonini's Paradox:** A model that is as complex as reality is useless.
> Complete understanding would require a synthesis as complex as the sources.

Therefore:
- Perfect completeness is NOT the goal
- MEANINGFUL completeness is the goal
- Acknowledge incompleteness explicitly
- Document what's not included and why

## Adequate vs Complete

### Adequate (Good)
- Covers essential aspects of the question
- Key sources utilized
- Major contradictions resolved
- Critical gaps acknowledged
- Serves intended purpose

### Complete (Often Impossible)
- Covers ALL aspects
- ALL sources used
- ALL contradictions resolved
- ALL gaps filled
- Perfect coverage

### Target: Adequate
- Acknowledge incompleteness
- Focus on what matters for the purpose
- Explicit about limitations

## Quality Checks
- [ ] Question coverage assessed
- [ ] Source utilization audited
- [ ] Contradiction resolution checked
- [ ] Gap acknowledgment verified
- [ ] Level coverage assessed
- [ ] Perspective coverage assessed
- [ ] Overall adequacy judged
- [ ] Incompleteness explicitly documented

## When to Apply
- **Required for:** All synthesis depths
- **Especially at:** End of synthesis process
- **Review trigger:** Before finalizing output

## Connections
- Uses: #001 (Question), #101 (Sources), #206 (Gaps), #301 (Divergences), #002 (Levels), #103 (Diversity)
- Feeds into: Final synthesis validation, output documentation
- Principle: Acknowledge what you don't know
- Bonini: Perfect completeness is impossible and undesirable
