---
name: deep-synthesis
description: >
  Use when user has multiple sources, perspectives, or information fragments
  and needs to understand what they mean TOGETHER. Triggers: "synthesize",
  "combine these", "what do these mean together", "integrate these perspectives",
  "compare and contrast these sources".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Synthesis

Turn multiple sources into understanding that requires combining them.

## What This Adds (Beyond Native Capability)

- Shannon Test: does each insight REQUIRE combining 2+ sources? If not, it's summary, not synthesis.
- Contradiction resolution: find conditions under which each conflicting view is correct
- Compression ratio awareness: insight density vs source volume
- Falsifiability: can each synthesis claim be tested or disproven?

## Procedure

### Step 1: Acquire

Read all sources. For each source, extract:
- Key claims (factual assertions)
- Key positions (opinions, recommendations, perspectives)
- Key evidence (data, examples, references cited)

Do not interpret yet. Just extract.

### Step 2: Decompose

For each significant claim or position, map across sources:

| Claim | Source A | Source B | Source C | Agreement? |
|-------|---------|---------|---------|------------|
| ...   | says X  | says Y  | silent  | diverge    |

Categories:
- **Agree**: Multiple sources make the same claim
- **Diverge**: Sources contradict each other
- **Silent**: Source doesn't address this claim at all

Pay special attention to silences — what a source doesn't say can be as
important as what it does say.

### Step 3: Relate

Find cross-source patterns:

**Convergence**: Multiple independent sources reach the same conclusion.
Strength depends on source independence — 3 sources citing the same study
is weaker than 3 independent studies.

**Divergence**: Sources contradict. For each contradiction:
> "Source A says X. Source B says Y. Both could be correct if {condition}."

Find the conditions, scope, or context under which each view holds.
Most contradictions dissolve when you find the boundary conditions.

**Gaps**: Topics that no source addresses but that matter for the question.

### Step 4: Integrate

Produce synthesis claims. Each claim MUST pass the **Shannon Test**:

> "Does this insight require information from 2+ sources to produce?
> Could I have gotten this from reading just one source?"

If the answer is "one source would suffice," it's a summary point, not a
synthesis insight. Demote it or cut it.

For each synthesis insight:
- State the insight
- List which sources were combined to produce it
- Rate confidence: HIGH (strong convergence), MEDIUM (partial evidence),
  LOW (inference from gaps/silences)
- State how it could be **falsified** (what evidence would disprove it)

### Step 5: Output

Compile the synthesis report using the format below.

## Output Format

```
# Synthesis: {topic}

## Sources
  | # | Source | Type | Key Claims |
  |---|--------|------|------------|

## Insights (Shannon-tested)
  | # | Insight | Sources Combined | Confidence | Falsifiable By |
  |---|---------|-----------------|------------|----------------|

  ### Insight 1: {title}
  {explanation of how combining sources produces this insight}
  Shannon check: Source A alone gives {X}, Source B alone gives {Y},
  together they reveal {Z}.

## Resolved Contradictions
  | Source A says | Source B says | Resolution: both correct when... |
  |--------------|--------------|----------------------------------|

## Unresolved Contradictions
  {contradictions that could not be reconciled — need more information}

## Gaps
  {what no source addresses but matters for the question}

## Compression Note
  Sources: {total volume} | Insights: {count} | Key ratio: {sources per insight}
```

## Counter-Checks

- [ ] Does every insight in the main table pass the Shannon Test?
- [ ] For each contradiction, did you find conditions where both views hold?
- [ ] Did you check for source independence (not all citing the same origin)?
- [ ] Is each insight tagged with a falsifiability condition?
- [ ] Did you note what NO source addressed (gaps)?
- [ ] Is the compression ratio reasonable (not just restating everything)?
