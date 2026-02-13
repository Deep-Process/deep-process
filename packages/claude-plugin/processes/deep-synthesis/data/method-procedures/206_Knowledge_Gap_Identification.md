# 206 - Knowledge Gap Identification

## Phase
DECOMPOSE

## Purpose
Identify what the source set DOESN'T cover — the negative space. Gaps in knowledge are as important as the knowledge itself for synthesis. A synthesis that doesn't acknowledge its gaps creates dangerous false completeness.

## Gap Types

| Type | Description | Implication |
|------|-------------|-------------|
| **Coverage gap** | A relevant topic with no sources | Synthesis is incomplete in that area |
| **Evidence gap** | Claims without supporting evidence | Synthesis is uncertain in that area |
| **Perspective gap** | A relevant viewpoint with no representation | Synthesis may be biased |
| **Temporal gap** | A time period with no data | Synthesis may miss time-dependent patterns |
| **Level gap** | A level of analysis with no sources | Can't draw conclusions at that level |
| **Method gap** | A relevant method not represented | Can't triangulate |
| **Expertise gap** | Relevant expertise not consulted | May miss domain-specific insights |
| **Counter-argument gap** | No dissenting sources | Confirmation bias risk |

## Procedure

### Step 1: Scope vs Coverage Comparison
Compare source coverage against synthesis question scope
- What does the synthesis question require?
- What do our sources cover?
- What's the delta?

### Step 2: Systematic Gap Detection
Check each gap type against source set
- Walk through gap types and check coverage
- Document all identified gaps

### Step 3: Addressability Assessment
For each gap: can it be addressed?
- **Addressable:** Can find/generate the missing knowledge
- **Partially addressable:** Can get some but not all
- **Non-addressable:** Knowledge unavailable or inaccessible

### Step 4: Impact Assessment
Evaluate impact of each gap on synthesis
- How much does this gap weaken the synthesis?
- Does this gap make certain conclusions impossible?
- Does this gap introduce systematic bias?

### Step 5: Gap Acknowledgment Documentation
Document gaps for explicit inclusion in synthesis output
- Gaps must be visible in final synthesis
- Non-addressed gaps = synthesis limitations

## Output Schema
```yaml
knowledge_gaps:
  - gap_type: "coverage/evidence/perspective/temporal/level/method/expertise/counter_argument"
    description: "[What's missing]"
    related_to_question: "[Which part of synthesis question this affects]"
    addressable: "yes/partially/no"
    if_addressable_how: "[How to address if possible]"
    impact_on_synthesis: "high/medium/low"
    impact_description: "[Specific impact on conclusions]"
  gap_summary:
    total_gaps: N
    high_impact_gaps: N
    addressed: N
    acknowledged_limitations:
      - "[Limitation statement for synthesis output]"
```

## Gap Detection Questions

### Coverage Gaps
- What topics does the synthesis question cover that no source addresses?
- What aspects of the domain are completely unrepresented?

### Evidence Gaps
- Which claims have no supporting evidence?
- Which conclusions rest on assumptions rather than data?

### Perspective Gaps
- Which stakeholder viewpoints are missing?
- Which disciplines should contribute but don't?

### Temporal Gaps
- What time periods are not covered?
- What historical context is missing?
- What future-oriented analysis is lacking?

### Level Gaps
- Which levels of analysis (#002) have no representation?
- Can we make claims at all levels, or only some?

### Method Gaps
- What methodological approaches are missing?
- What type of data is absent (quantitative? qualitative? experimental?)

### Expertise Gaps
- Which expert perspectives are not represented?
- What tacit knowledge might exist but is not captured?

### Counter-Argument Gaps
- Are there dissenting views that should be heard?
- Is consensus suspiciously easy? (→ #105)

## Quality Checks
- [ ] All gap types systematically checked
- [ ] Addressability assessed for each gap
- [ ] Impact evaluated
- [ ] Non-addressable gaps documented as limitations
- [ ] Gap summary prepared for synthesis output

## Critical Warning
> A synthesis that doesn't acknowledge its gaps is more dangerous than incomplete data — it creates FALSE COMPLETENESS.

## Connections
- Uses: #001 (Synthesis Question), #003 (Source Landscape), #103 (Diversity Verification)
- Feeds into: #308 (Gap Significance Analysis), final synthesis output
- Enables: Honest confidence calibration in conclusions
