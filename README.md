# Deep Process Skills

![Deep Process Logo](img/logo_small.png)

A collection of Claude Code skills that make LLMs think instead of just respond.

## Why this exists

LLMs are capable — until they take shortcuts. Ask one to verify your code and it says "looks good." Ask it to assess risks and you get the same five generic risks every time. Ask it to design architecture and you get a clean diagram with hidden contradictions.

The problem isn't intelligence. It's that LLMs default to being agreeable and fast. They skip steps, summarize instead of synthesize, and produce outputs that *look* thorough but aren't.

Deep Process Skills fix this by giving the LLM structured procedures — specific steps, scoring systems, adversarial checks, and counter-checks. Each skill extracts only the **essential 10-20%** that Claude doesn't do natively: numeric scoring, mandatory counter-checks, scope transparency, pattern matching, standardized output formats.

## Installation

### Claude Code Plugin

```bash
claude plugin add /path/to/deep-process-skill
```

This gives you all 21 skills as slash commands.

### Manual

Copy the repository into your project. Skills are self-contained — each `deep-*-skill/` directory works independently.

## Skills

### Analysis & Verification

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-verify** | `/verify` | Structured verification with numeric scoring, pattern matching against known impossibilities, adversarial self-review. Produces scored findings with evidence and a verdict (ACCEPT/REJECT/UNCERTAIN). |
| **deep-challenge** | `/challenge` | Stress-tests a plan or proposal through 5 lenses: pre-mortem, assumption stress, incentive analysis, 2nd-order effects, reference class forecasting. |
| **deep-compliance** | `/compliance` | Checks compliance against regulations, standards, or policies (GDPR, SOC2, etc.). |
| **deep-monitoring** | `/monitor` | Verifies quality of a previously executed analysis or process output. |

### Decision & Exploration

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-explore** | `/explore` | Systematic decision exploration: knowledge audit, research, option mapping, consequence tracing, synthesis. |
| **deep-risk** | `/risk` | 5-dimensional risk scoring (probability, impact, velocity, detectability, reversibility) with cascade analysis and Cobra Effect checking on mitigations. |
| **deep-feasibility** | `/feasibility` | 10-dimension feasibility assessment with planning fallacy detection. GO/CONDITIONAL/NO-GO verdict. |
| **deep-synthesis** | `/synthesize` | Turns multiple sources into understanding. Shannon Test: does the insight require combining sources? |

### Design & Architecture

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-architect** | `/architect` | Architecture design with adversarial phase (STRIDE, FMEA, anti-patterns, pre-mortem, dependency analysis, scale stress, cost, ops complexity). |
| **deep-requirements** | `/requirements` | Extracts, clarifies, and structures requirements from conversations, documents, or vague descriptions. |
| **deep-diagram** | `/diagram` | Generates diagrams (Mermaid) from code or documentation. |
| **deep-change** | `/change-impact` | Evaluates impact of a proposed change to an existing system. |

### Implementation & Delivery

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-plan** | `/plan` | Implementation planning — breaks architecture into sprints and tasks. |
| **deep-implement** | `/implement` | Implements a designed system from architecture docs. |
| **deep-test** | `/test-strategy` | Test strategy, test plan, and test generation. |
| **deep-deploy** | `/deploy` | Deployment planning with rollout strategy and go-live checklist. |
| **deep-document** | `/document` | Evidence-based documentation with file:line tracing. Every claim traces to code. |

### Governance & Operations

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-govern** | `/govern` | Project governance — health checks, decision tracking, escalation handling. |
| **deep-governance** | `/governance` | Policy definition, access control review, audit trail, governance framework. |

### Orchestration

| Skill | Command | What it does |
|-------|---------|--------------|
| **deep-aggregate** | `/aggregate` | Combines multiple analysis outputs into a single GO/NO-GO decision brief. |
| **deep-orchestration** | `/orchestrate` | Runs multiple deep-* analyses in a coordinated workflow. |

## Which skill do I need?

| You're thinking... | Use this |
|---|---|
| "Is this code/document actually correct?" | `/verify` |
| "I don't know what to do" | `/explore` |
| "I need to design this system" | `/architect` |
| "Can we actually pull this off?" | `/feasibility` |
| "What could go wrong?" | `/risk` |
| "I have lots of info but no understanding" | `/synthesize` |
| "Stress test my plan" | `/challenge` |
| "What are the requirements?" | `/requirements` |
| "Plan the implementation" | `/plan` |
| "We need proper documentation" | `/document` |
| "What's the overall verdict?" | `/aggregate` |

## How they work together

These skills work standalone, but combine naturally:

1. `/explore` the decision space to understand options
2. `/feasibility` of the top option
3. `/risk` assessment and mitigation planning
4. `/architect` the system with constraints in mind
5. `/verify` the architecture against requirements
6. `/plan` the implementation
7. `/document` the result
8. `/aggregate` everything into a GO/NO-GO decision

## Project structure

```
deep-process-skill/
├── .claude-plugin/
│   └── plugin.json           # Claude Code plugin config
├── commands/                  # Slash command definitions (20 commands)
│   ├── verify.md
│   ├── explore.md
│   ├── architect.md
│   └── ...
├── deep-verify-skill/         # Each skill is self-contained
│   ├── SKILL.md               # Procedure (<200 lines)
│   └── references/            # Overflow content (patterns, scoring rubrics)
│       ├── patterns.md
│       ├── methods.md
│       └── report-format.md
├── deep-risk-skill/
│   ├── SKILL.md
│   └── references/
│       └── scoring.md
├── deep-architect-skill/
│   ├── SKILL.md
│   └── references/
│       └── adversarial-ops.md
├── deep-feasibility-skill/
│   ├── SKILL.md
│   └── references/
│       └── dimensions.md
├── deep-*-skill/              # 17 more skills (SKILL.md only)
│   └── SKILL.md
├── methods/                   # Legacy method library (from original deep-process)
├── processes/                 # Legacy process files (from original deep-process)
├── img/
└── LICENSE
```

### Skill anatomy

Each skill follows the same pattern:

- **SKILL.md** — YAML frontmatter (name, description with triggers, allowed-tools) + Markdown procedure. Under 200 lines.
- **references/** — Optional. Scoring rubrics, pattern libraries, report templates. Loaded by the LLM on demand during execution.

The `description` field uses "pushy" trigger phrases so Claude activates the right skill automatically when users ask natural questions.

## Design philosophy

These skills were distilled from the original [Deep Process](https://github.com/deep-process-org/deep-process) project — 3500+ line execution programs with binding gates, OODA loops, and compliance sections. The conversion kept only what Claude doesn't do natively:

- **Numeric scoring** — findings get severity points, verdicts have thresholds
- **Mandatory counter-checks** — every serious finding gets challenged before inclusion
- **Scope transparency** — explicit "Not Checked" section in every output
- **Pattern matching** — known impossibility patterns (CAP theorem, halting problem, etc.)
- **Standardized output** — same report format every time
- **Steel-man enforcement** — argue against your own verdict before finalizing

Everything else (gates, OODA, hypothesis YAML, compliance ceremonies) was removed. Claude handles those aspects natively.

## License

MIT
