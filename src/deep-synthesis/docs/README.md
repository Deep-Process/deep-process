# Deep Synthesis

A structured knowledge synthesis workflow that turns multiple sources and perspectives into genuine understanding - not just a summary.

## The problem

When I asked LLMs to "synthesize these sources," I'd get a summary. A perfectly organized, well-written summary that told me nothing I didn't already know. It would list what Source A said, then what Source B said, then what Source C said, and call it "synthesis."

Real synthesis is different. It's finding the pattern that none of the sources explicitly state. It's discovering that two seemingly unrelated frameworks are actually describing the same phenomenon from different angles. It's identifying the contradiction that reveals a deeper truth - not papering over disagreements.

The difference between summary and synthesis is like the difference between a pile of bricks and a building. Same materials, completely different outcome.

## What this is

Deep Synthesis is a prompt-based workflow that forces the LLM to actually synthesize knowledge through a 7-phase pipeline:

1. **Scope** - Define the synthesis question, select the level of analysis, map the source landscape
2. **Acquire** - Collect and quality-assess sources, verify diversity, check for missing perspectives
3. **Decompose** - Extract atomic claims, build concept taxonomies, grade evidence, surface assumptions
4. **Relate** - Map convergence/divergence, find analogical structures, detect cross-source patterns, reconcile causal chains
5. **Integrate** - Dialectical integration of tensions, framework unification, emergence detection
6. **Crystallize** - Distill core insights, design mental models, extract principles, assess actionability
7. **Output** - Produce structured synthesis deliverables

Each phase applies methods grounded in theory (Hegel's dialectics, Shannon's information theory, Gentner's structure mapping, Peirce's abduction, Popper's falsification - 19 theoretical foundations in total).

The output is compressed understanding that contains something new - insights that require combining sources, not just quoting them.

## How to use it

You need an LLM CLI like Claude Code, Gemini CLI, or similar.

**Quickest way** - use the built-in slash command:

```
/deep-synthesis Synthesize these three perspectives on microservices vs. monolith architecture
```

Or point the LLM to the workflow directly:

```
Use the process in src/deep-synthesis/workflow.md to synthesize [your sources/topic]
```

The process will ask you to select a depth level (quick, standard, rigorous, or comprehensive) and then guide you through source collection and analysis.

## What it's good at

- Finding insights that emerge only when sources are combined
- Resolving apparent contradictions by finding the conditions under which each view is correct
- Building mental models that compress complex topics into actionable understanding
- Detecting when "common knowledge" is actually unsupported by evidence
- Separating genuine patterns from coincidental similarities (apophenia checks)
- Producing outputs that pass the Shannon Test: does this insight require combining sources?

## Limitations

This isn't magic. Some things to know:

- **Synthesis != Summary.** If you just want a summary, don't use this. It's slower and more demanding because it's doing something fundamentally different.
- **Source quality matters.** Synthesizing low-quality sources produces confident-sounding nonsense. The process checks source quality, but can't fix bad inputs.
- **Depth takes time.** Quick mode gives you a directional synthesis. Comprehensive mode with all 40 methods takes serious effort but finds deep structural patterns.
- **Falsifiability required.** The process demands that synthesis conclusions be falsifiable ("what would disprove this?"). If your topic doesn't lend itself to this, expect the process to flag it.

## Example output

```
SYNTHESIS: Microservices vs. Monolith — Beyond the Binary

SOURCES ANALYZED: 7 (3 pro-microservices, 2 pro-monolith, 2 contextual)
DIVERSITY SCORE: 0.82 (good perspective coverage)

CORE INSIGHT (requires combining sources):
  The debate is not about architecture style but about team cognitive load.
  Sources A and D seem to disagree (micro vs. mono) but both succeed when
  service boundaries match team boundaries. Source F's failures all violate
  this principle. Conway's Law is the hidden variable.

DIALECTICAL RESOLUTION:
  Thesis: "Microservices enable independent deployment" (Sources A, B, C)
  Antithesis: "Microservices add coordination overhead" (Sources D, E)
  Synthesis: Independence is only achieved when organizational structure
  mirrors service structure. Without Conway alignment, microservices ADD
  coordination overhead instead of removing it.

MENTAL MODEL:
  Architecture Style Selection = f(team_count, coupling_type, change_rate)
  NOT f(scale, technology_trend, industry_practice)

FALSIFICATION: This synthesis would be disproven by successful microservices
adoption in a team with mismatched org/service boundaries AND low coordination cost.

COMPRESSION: 47 claims from 7 sources → 3 principles + 1 mental model
```

## Works well with

- Research reviews (synthesize multiple papers or reports)
- Technology evaluations (combine benchmarks, case studies, expert opinions)
- Strategy formation (synthesize market analysis, competitive intelligence, internal data)
- Learning complex topics (build mental models from diverse sources)
- Decision preparation (use with Deep Explore for exploration, then synthesize findings)

## Related processes

| Process | Purpose | When to use |
|---------|---------|-------------|
| **Deep Synthesis** | Synthesize knowledge | You have many sources, need understanding |
| **Deep Explore** | Explore decision space | You don't know what to do yet |
| **Deep Feasibility** | Assess feasibility | Synthesize feasibility data into a verdict |
| **Deep Verify** | Verify artifact correctness | Check if your synthesis is accurate |
| **Deep Risk** | Assess risks of a plan | You have a plan, want to stress-test it |

## License

MIT
