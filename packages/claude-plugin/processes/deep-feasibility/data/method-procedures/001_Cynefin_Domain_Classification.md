# #001 Cynefin Domain Classification

**Phase:** 0 (FRAME)
**Tier:** 1 — Mandatory
**Purpose:** Determine problem type to select appropriate feasibility assessment method

## Theoretical Foundation

Based on Snowden's Cynefin Framework (2007). The type of problem determines whether traditional feasibility assessment is even POSSIBLE.

**Key insight:** For Complex-domain problems, feasibility assessment in advance is a CATEGORY ERROR. You can only learn feasibility by doing small experiments (probes).

## What to do

1. Decompose subject into components/sub-problems
2. Classify each component by cause-effect relationship
3. Select appropriate assessment approach for each
4. Flag Complex components for probing instead of analysis

## The Cynefin Domains

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CYNEFIN FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  COMPLEX                        │  COMPLICATED                              │
│  ───────                        │  ───────────                              │
│  Cause→effect: retrospective    │  Cause→effect: requires expertise        │
│  Emergent, unpredictable        │  Analyzable, expert knowledge helps      │
│  "Unknown unknowns"             │  "Known unknowns"                         │
│                                 │                                           │
│  CANNOT ASSESS TRADITIONALLY    │  Expert analysis works                   │
│  Must: Probe → Sense → Respond  │  Sense → Analyze → Respond               │
│                                 │                                           │
│  Examples:                      │  Examples:                               │
│  • User adoption                │  • Database scaling                      │
│  • Market response              │  • Performance optimization              │
│  • Team dynamics                │  • Integration design                    │
│                                 │                                           │
├─────────────────────────────────┼─────────────────────────────────────────┤
│  CHAOTIC                        │  CLEAR (formerly Simple)                 │
│  ───────                        │  ─────                                    │
│  Cause→effect: none visible     │  Cause→effect: obvious to everyone       │
│  Crisis, no patterns            │  Best practice exists                    │
│  Immediate action needed        │  "Known knowns"                          │
│                                 │                                           │
│  Act first to stabilize         │  Direct assessment possible              │
│  Act → Sense → Respond          │  Sense → Categorize → Respond            │
│                                 │                                           │
│  Examples:                      │  Examples:                               │
│  • Production outage            │  • Adding a form field                   │
│  • Security breach              │  • Standard CRUD operation               │
│  • Crisis response              │  • Well-documented process               │
│                                 │                                           │
└─────────────────────────────────┴─────────────────────────────────────────┘
```

## Step-by-step

### Step 1: List Components

Break down the subject into distinct components:
- Technical components
- Process components
- People/organization components
- External dependencies

### Step 2: Classify Each Component

For each component, ask:

**"Can we predict the outcome of this with reasonable confidence?"**

| Answer | Domain | Assessment Approach |
|--------|--------|---------------------|
| "Yes, obviously" | CLEAR | Direct constraint check — straightforward |
| "Yes, with the right expertise" | COMPLICATED | Expert analysis — feasible with knowledge |
| "Only after we try it" | COMPLEX | **PROBE** — traditional analysis invalid |
| "No pattern at all" | CHAOTIC | Stabilize first — not assessable now |

### Step 3: Check for Misclassification

**RED FLAG: Treating Complex as Complicated**

This is the most dangerous error. Signs:
- "We just need the right expert to analyze it"
- "If we think harder, we can predict it"
- Detailed plans for things that have never been done before

Reality check: If no one has done this before AND outcomes depend on emergent behavior, it's Complex.

### Step 4: Determine Assessment Strategy

| Domain | Strategy |
|--------|----------|
| CLEAR | Proceed with standard assessment |
| COMPLICATED | Proceed with expert-informed assessment |
| COMPLEX | **Flag for probing (#303)** — skip traditional analysis |
| CHAOTIC | Assessment not applicable — stabilize situation first |

## Output format

```yaml
domain_map:
  - component: "[Component name]"
    domain: "[Clear / Complicated / Complex / Chaotic]"
    reasoning: "[Why this classification]"
    assessment_approach: "[Direct / Expert / Probe / Stabilize]"
    probe_needed: [true/false]

  - component: "[Component 2]"
    domain: "Complicated"
    reasoning: "Requires expertise but analyzable"
    assessment_approach: "Expert analysis"
    probe_needed: false

  - component: "[Component 3]"
    domain: "Complex"
    reasoning: "Novel combination, outcome emergent"
    assessment_approach: "Probe-Sense-Respond"
    probe_needed: true

complex_mode: [on/off]  # on if ANY component is Complex
```

## Integration Points

- **Feeds from:** Initial subject description
- **Feeds to:** #303 Probe Design (if Complex), all assessment methods (domain affects confidence ceiling)

## Common Pitfalls

- **Treating Complex as Complicated:** Applying expert analysis to emergent problems produces confident but WRONG assessments
- **Missing hidden complexity:** Technical components may be Clear/Complicated while organizational/adoption is Complex
- **Domain drift:** Something that was Complicated can become Complex as scale or context changes

## When Complex Mode is ON

If `complex_mode = on`:
1. Set confidence ceiling to MEDIUM for Complex components
2. Require #303 Probe Design for Complex sub-problems
3. In report: include "Cannot Assess Traditionally" section
4. Skip traditional assessment for Complex parts → design probes instead
