# 501 - Core Insight Distillation

## Phase
CRYSTALLIZE

## Purpose
Extract the 3-7 most important insights from the synthesis. These are the findings that CHANGE how someone should think or act. Not everything in the synthesis is equally important — distillation identifies what matters most.

## Insight Quality Criteria

| Criterion | Question | Weight |
|-----------|----------|--------|
| **Novelty** | Is this genuinely new? Or restating what sources already said? | High |
| **Actionability** | Can someone DO something different based on this? | High |
| **Importance** | Does this insight MATTER for the synthesis question? | High |
| **Robustness** | Does this hold across multiple sources and methods? | Medium |
| **Surprise** | Does this challenge existing assumptions? (Surprise = high information value) | Medium |

## Procedure

### Step 1: Finding Inventory
List all synthesis findings
- From #401 dialectical syntheses
- From #402 unified framework
- From #403 emergent insights
- From #404 abductive conclusions
- From #306 patterns

### Step 2: Criteria Scoring
Score each finding on all 5 criteria
- Use H/M/L or 3/2/1 scale
- Be rigorous — not everything is "high"

### Step 3: Core Selection
Select top 3-7 as CORE insights
- Based on criteria scores
- Also consider: coverage of synthesis question
- Also consider: audience needs

### Step 4: One-Sentence Articulation
For each core insight: write in ONE sentence
- Must be understandable without context
- Must be specific enough to be useful
- Must be true to the synthesis

### Step 5: Ordering
Order insights by: importance × actionability
- Most important and actionable first
- Supporting insights follow

### Step 6: Traceability Documentation
Document where each core insight comes from
- Which sources contribute
- Which methods generated it
- What evidence supports it

## Output Schema
```yaml
core_insights:
  - insight_id: "I1"
    insight: "[The insight]"
    one_sentence: "[One-sentence articulation]"
    scores:
      novelty: "H/M/L"
      actionability: "H/M/L"
      importance: "H/M/L"
      robustness: "H/M/L"
      surprise: "H/M/L"
    composite_score: N
    priority_rank: 1
    traceability:
      source_methods: ["#401", "#403"]
      contributing_sources: ["S1", "S2"]
      evidence_grade: "A/B/C/D/E/F"
insight_summary:
  total_findings: N
  core_insights_selected: N
  highest_priority_insight: "[Insight I1]"
  actionable_recommendations: ["[Action from insight]"]
```

## Criteria Definitions

### Novelty (H/M/L)
- **H:** Genuine synthesis — couldn't be known from any single source
- **M:** Combination insight — requires multiple sources but somewhat expected
- **L:** Extraction — present in sources, just restated

### Actionability (H/M/L)
- **H:** Clear, specific action follows immediately
- **M:** General direction but needs specification for action
- **L:** Informative but no clear action path

### Importance (H/M/L)
- **H:** Central to answering the synthesis question
- **M:** Relevant and useful but not central
- **L:** Peripheral or nice-to-know

### Robustness (H/M/L)
- **H:** Multiple sources, different methods, convergent
- **M:** Some sources, or same method across sources
- **L:** Single source or speculative

### Surprise (H/M/L)
- **H:** Challenges common assumptions, unexpected
- **M:** Somewhat unexpected, adds nuance
- **L:** Confirms what was expected

## One-Sentence Test

A good one-sentence insight should:
- Stand alone (no context needed)
- Be specific (not vague platitudes)
- Be testable (could be wrong)
- Imply action (what to do differently)

### Examples

**Good:** "Data mesh adoption succeeds when teams have >18 months DevOps maturity, fails below this threshold regardless of technical implementation."

**Bad:** "Data mesh is good when organizations are ready." (Too vague)

**Bad:** "Success requires alignment." (Platitude)

## Why 3-7 Insights?

- **<3:** Likely over-compressed or synthesis too narrow
- **3-7:** Human cognitive capacity; memorable; usable
- **>7:** Likely under-distilled; reader will forget

## Quality Checks
- [ ] All synthesis findings inventoried
- [ ] Each finding scored on all 5 criteria
- [ ] 3-7 core insights selected
- [ ] One-sentence articulations written
- [ ] Insights ordered by importance × actionability
- [ ] Traceability documented for each insight

## Connections
- Uses: All integration methods (#401-407)
- Feeds into: #502 (Mental Model), #503 (Principles), #504 (Narrative), #505 (Actionability)
- Output: Goes into final synthesis report
- Key: These are what the synthesis delivers
