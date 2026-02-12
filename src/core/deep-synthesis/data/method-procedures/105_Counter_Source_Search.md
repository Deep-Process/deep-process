# 105 - Counter-Source Search

## Phase
ACQUIRE

## Purpose
Actively seek sources that DISAGREE with the emerging direction. Confirmation bias makes us stop searching once we find agreement. This method forces continuing until disagreement is found.

## Core Principle
> The ABSENCE of disagreement is SUSPICIOUS.
> Real knowledge domains ALWAYS have contested areas.

## Procedure

### Step 1: Emerging Consensus Identification
After initial collection: what's the EMERGING consensus?
- What do most sources seem to agree on?
- What direction is the synthesis heading?

### Step 2: Deliberate Contradiction Search
Search specifically for sources that would CONTRADICT that consensus
- "Who would disagree with this?"
- "What perspective would challenge this?"
- "Where has this conclusion been proven wrong?"

### Step 3: Steel-Manning
Present the STRONGEST version of the counter-argument
- Don't strawman the dissent
- Understand WHY someone would disagree
- Make the counter-argument as compelling as possible

### Step 4: Interpretation
If NO counter-source found:
- Option A: Consensus is very strong (rare — be suspicious)
- Option B: We're not searching hard enough (more common)
- Option C: Counter-sources exist but are hard to access

### Step 5: Integration Decision
How to handle the counter-source in synthesis:
- Does it invalidate the consensus?
- Does it bound the consensus (true in some contexts)?
- Does it represent a productive tension to maintain?

## Output Schema
```yaml
counter_sources:
  emerging_consensus: "[What most sources agree on]"
  search_conducted:
    - search_approach: "[Where/how we looked]"
      result: "[What we found]"
  counter_sources_found:
    - source: "[Source identifier]"
      counter_argument: "[Their position]"
      strength: "strong/moderate/weak"
      steel_man: "[Strongest version of their argument]"
      implication: "[What this means for synthesis]"
  if_none_found:
    assessment: "consensus_strong/search_insufficient/access_limited"
    action: "[What we're doing about it]"
```

## Quality Checks
- [ ] Emerging consensus explicitly stated
- [ ] Active search for contradicting sources conducted
- [ ] Counter-arguments steel-manned, not strawmanned
- [ ] Absence of disagreement treated with suspicion
- [ ] Implications for synthesis documented

## Connections
- Uses: #103 (Diversity Verification)
- Feeds into: #302 (Dialectical Tension Mapping)
- Prevents: Confirmation Bias
- Grounded in: Hegel's Dialectic (contradiction as engine of synthesis)

## When to Use
- **Required for:** Rigorous+ depths
- **Triggered by:** low_diversity_flag = on
- **Always use when:** Consensus seems "too easy"
