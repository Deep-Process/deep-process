# Deep Process

![Deep Process Logo](img/logo_small.png)


A collection of structured workflows that make LLMs actually think instead of just respond.

## Why this exists

LLMs are incredibly capable - until they're not. Ask one to verify your code and it says "looks good." Ask it to assess risks and you get the same five generic risks every time. Ask it to design architecture and you get a clean diagram with hidden contradictions.

The problem isn't intelligence. It's that LLMs default to being agreeable and fast. They skip steps, take shortcuts, and produce outputs that *look* thorough but aren't. They summarize instead of synthesize. They list risks instead of tracing cascades. They say "yes, that's feasible" without checking if your timeline is realistic or your team has the right skills.

Deep Process fixes this by giving the LLM a structured protocol to follow - specific steps, quality gates, adversarial checks, and bias corrections. The LLM still does the thinking, but the process ensures it actually *does* the thinking instead of pattern-matching to "what a good answer looks like."

## What you get

Each process produces a structured, evidence-based deliverable - not conversation, not hand-waving. Scored assessments, traceable findings, falsifiable conclusions. The kind of output you can actually act on.

## The processes

### [Deep Verify](src/deep-verify/docs/README.md) - Check if something is correct

You wrote code, received a document, or generated something with an LLM. Is it actually correct? Deep Verify traces assumptions, finds contradictions, matches against impossibility patterns, and runs adversarial review on its own findings. Output: a structured report with exact quotes, a numeric score, and a verdict.

```
/deep-verify Check this API implementation against the requirements in docs/spec.md
```

### [Deep Explore](src/deep-explore/docs/README.md) - Think through a decision

You're stuck. You don't know what to do, or you have too many options and can't see clearly. Deep Explore separates facts from assumptions, discovers options you weren't considering, turns vague fears into specific concerns, and tells you when you're ready to decide.

```
/deep-explore Should we build this in-house or buy an existing solution?
```

### [Deep Architect](src/deep-architect/docs/README.md) - Design software architecture

You need to build something and you need a solid plan. Deep Architect runs 16 operations - 8 that build the design (decomposition, boundaries, dependencies...) and 8 that try to break it (STRIDE, FMEA, anti-patterns, pre-mortem...). The adversarial phase is where the real value is.

```
/deep-architect Design the architecture for a real-time notification service
```

### [Deep Feasibility](src/deep-feasibility/docs/README.md) - Find out if it can be done

Before committing resources, find out if the plan is realistic. Deep Feasibility checks 10 dimensions (technical, resource, knowledge, organizational, temporal, compositional, economic, scale, cognitive, dependency) and gives you a GO / CONDITIONAL GO / NO-GO verdict with confidence levels. Includes planning fallacy detection.

```
/deep-feasibility Can we migrate to microservices in 6 months with a team of 4?
```

### [Deep Risk](src/deep-risk/docs/README.md) - Find the risks you're not seeing

Standard risk lists are useless. Deep Risk discovers risks through theory-grounded analysis, scores them on 5 dimensions (probability, impact, velocity, detectability, reversibility), and - critically - maps how risks interact, cascade, and amplify each other. Includes Cobra Effect checks on proposed mitigations.

```
/deep-risk Assess the risks of our cloud migration project
```

### [Deep Synthesis](src/deep-synthesis/docs/README.md) - Turn sources into understanding

You have multiple sources, perspectives, or knowledge fragments. You need to understand what they mean *together*, not just what each one says. Deep Synthesis finds patterns across sources, resolves contradictions by finding the conditions under which each view is correct, and produces compressed understanding that passes the Shannon Test: does this insight require combining sources?

```
/deep-synthesis Synthesize these research papers on distributed consensus approaches
```

### [Deep Document](src/deep-document/docs/README.md) - Generate documentation from code

You need documentation, but you need it to be *accurate*. Deep Document inventories the codebase, extracts domain ontology, plans the docs, gathers evidence (file + line number for every claim), and then generates. Every statement in the output traces back to actual code. It won't make things up.

```
/deep-document
```

## Getting started

**1. Clone this repo into your project directory:**

```bash
git clone <repo-url>
```

**2. Open your LLM tool in the cloned directory and run a slash command:**

```
/deep-verify Check the API in src/api/ against the spec in docs/requirements.md
```

That's it. No installation, no configuration, no extra dependencies. The commands are pre-configured and work immediately after cloning.

## Supported tools

All commands work out of the box - just clone and run:

| Tool | How to use |
|------|-----------|
| **Claude Code** | Type `/deep-verify`, `/deep-explore`, `/deep-architect`, `/deep-feasibility`, `/deep-risk`, `/deep-synthesis`, `/deep-document` followed by what you want to analyze |
| **Gemini CLI** | Same slash commands as above |
| **Cursor** | Same slash commands as above |
| **Continue.dev** | Same slash commands as above |
| **GitHub Copilot** | Use as agent: `@deep-verify`, `@deep-explore`, `@deep-architect`, `@deep-feasibility`, `@deep-risk`, `@deep-synthesis`, `@deep-document` |
| **OpenAI Codex, Google Jules, and other AGENTS.md-compatible tools** | Workflows are auto-discovered from `AGENTS.md` at the repo root |
| **Any other LLM tool** | Point it at the workflow file: `Read and follow the process in src/deep-verify/workflow.md to verify [what you want to check]` |

## Which process do I need?

| You're thinking... | Use this |
|---|---|
| "Is this code/document actually correct?" | [Deep Verify](src/deep-verify/docs/README.md) |
| "I don't know what to do" | [Deep Explore](src/deep-explore/docs/README.md) |
| "I need to design this system" | [Deep Architect](src/deep-architect/docs/README.md) |
| "Can we actually pull this off?" | [Deep Feasibility](src/deep-feasibility/docs/README.md) |
| "What could go wrong?" | [Deep Risk](src/deep-risk/docs/README.md) |
| "I have lots of info but no understanding" | [Deep Synthesis](src/deep-synthesis/docs/README.md) |
| "We need proper documentation" | [Deep Document](src/deep-document/docs/README.md) |

## How they work together

These processes aren't isolated. A typical flow might look like:

1. **Explore** the decision space to understand your options
2. **Assess feasibility** of your top option
3. **Identify risks** and plan mitigations
4. **Design the architecture** with those constraints in mind
5. **Verify** the architecture against your requirements
6. **Document** the result

You don't have to use them all. Each process works standalone. But when combined, the output of one naturally feeds into the next.

## License

MIT
