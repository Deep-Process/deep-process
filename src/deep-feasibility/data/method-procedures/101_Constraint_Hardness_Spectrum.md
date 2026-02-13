# #101 Constraint Hardness Spectrum

**Phase:** 1 (CONSTRAIN)
**Tier:** 1 — Mandatory
**Purpose:** Classify every constraint from absolutely impossible to merely inconvenient

## Theoretical Foundation

Grounded in computability theory (Turing, Cook-Karp) and constraint theory (Goldratt).

**Key insight:** Prevents two critical errors:
1. Treating hard impossibilities as "challenges to overcome" (wastes effort)
2. Treating soft difficulties as hard impossibilities (causes paralysis)

## What to do

1. Gather all constraints from prior analysis and stakeholders
2. Classify each on the H0-H5 spectrum
3. Determine appropriate response for each level
4. Flag H5 constraints for early exit consideration

## The Hardness Spectrum

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONSTRAINT HARDNESS SPECTRUM                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H5 — LOGICALLY IMPOSSIBLE                                                  │
│  ═══════════════════════════                                                │
│  Violates mathematics, logic, physics, or proven theorems                   │
│  Examples: Halting problem, perpetual motion, FLP consensus, CAP theorem   │
│                                                                              │
│  Response: STOP. Redesign the problem. This cannot be overcome with effort. │
│  Action: Early exit on this path. Propose alternative framing.              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H4 — COMPUTATIONALLY INFEASIBLE                                            │
│  ═══════════════════════════════                                            │
│  NP-hard at scale with no good approximation known                          │
│  Examples: Optimal scheduling for 10K variables, exact TSP at scale         │
│                                                                              │
│  Response: Accept approximation, decompose problem, use heuristics          │
│  Action: Reframe to "good enough" instead of "optimal"                      │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H3 — STRUCTURALLY BLOCKED                                                  │
│  ═════════════════════════                                                   │
│  Organization or architecture prevents execution                            │
│  Examples: Conway misalignment, no decision authority, siloed teams         │
│                                                                              │
│  Response: Restructure organization OR change architecture to match         │
│  Action: Identify what structural change would unblock                      │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H2 — RESOURCE CONSTRAINED                                                  │
│  ═════════════════════════                                                   │
│  Lack of people, money, time, skills, or tools                              │
│  Examples: Need 5 specialists, have 2; budget cut; tight deadline           │
│                                                                              │
│  Response: Acquire, trade, defer, reduce scope                              │
│  Action: Quantify gap and cost to close                                     │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H1 — PRACTICALLY DIFFICULT                                                 │
│  ═════════════════════════                                                   │
│  Doable but hard, risky, or expensive                                       │
│  Examples: Migrate legacy system without docs, complex integration          │
│                                                                              │
│  Response: Plan carefully, accept cost, manage risk                         │
│  Action: Factor difficulty into estimates and risk assessment               │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  H0 — INCONVENIENT                                                          │
│  ════════════════                                                            │
│  Minor friction, easily overcome                                            │
│  Examples: Need to learn new API, different time zone, minor process change │
│                                                                              │
│  Response: Just do it                                                       │
│  Action: Acknowledge, plan for, move on                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Gather Constraints

Sources:
- Deep-Explore outputs (if available)
- Stakeholder requirements and stated limits
- Technical analysis findings
- Regulatory environment
- Resource inventory
- Prior project experience

### Step 2: Classify Each Constraint

For each constraint, ask:

| Question | If Yes → Level |
|----------|----------------|
| Does it violate a proven theorem or law? | H5 |
| Is it computationally intractable at required scale? | H4 |
| Does it require org/architecture change to address? | H3 |
| Is it a resource gap (people, money, time, skills)? | H2 |
| Is it difficult but clearly doable? | H1 |
| Is it just inconvenient? | H0 |

### Step 3: Document Evidence

For each classification:
- What evidence supports this level?
- Could we be wrong? (Misclassification risk)
- What would change the classification?

### Step 4: Determine Response

| Level | Response Strategy |
|-------|------------------|
| H5 | STOP this path. Redesign or reframe. |
| H4 | Accept approximation. Reframe to "good enough." |
| H3 | Plan structural change or adapt to structure. |
| H2 | Plan acquisition or scope reduction. |
| H1 | Factor into estimates and plans. |
| H0 | Acknowledge and proceed. |

## Output format

```yaml
constraints:
  - constraint: "Real-time updates AND strong consistency required"
    hardness: "H5"
    nature: "CAP theorem — cannot have both with partition tolerance"
    evidence: "Fundamental distributed systems theorem"
    response_strategy: "Choose consistency OR availability, not both"
    misclassification_risk: "Low — theorem is proven"

  - constraint: "Optimal scheduling for 5000 resources"
    hardness: "H4"
    nature: "NP-hard problem at this scale"
    evidence: "Combinatorial explosion, no polynomial solution"
    response_strategy: "Use heuristic/approximation algorithm"
    misclassification_risk: "Low — but approximation may be good enough"

  - constraint: "Tight integration between siloed teams"
    hardness: "H3"
    nature: "Conway misalignment"
    evidence: "Teams report to different VPs, monthly meetings only"
    response_strategy: "Create shared team OR redesign for loose coupling"
    misclassification_risk: "Medium — org change might be possible"

  - constraint: "Need 3 senior data engineers, have 1"
    hardness: "H2"
    nature: "Skill gap"
    evidence: "Current headcount and open reqs"
    response_strategy: "Hire (4-8 weeks), train (6 weeks), or reduce scope"
    misclassification_risk: "Low — gap is quantifiable"

  - constraint: "Complex legacy data migration"
    hardness: "H1"
    nature: "Difficult but doable"
    evidence: "Similar migrations done before, just complex"
    response_strategy: "Detailed planning, risk buffers, expertise"
    misclassification_risk: "Medium — could be harder than expected"

  - constraint: "Team needs to learn new API"
    hardness: "H0"
    nature: "Minor friction"
    evidence: "Standard API, good documentation"
    response_strategy: "Allocate learning time, proceed"
    misclassification_risk: "Low"
```

## Red Flags for Misclassification

| Red Flag | Risk |
|----------|------|
| Team treating H5 as H2 | "If we just work harder..." — wasted effort |
| Team treating H1 as H5 | "It's impossible" when just hard — paralysis |
| No H4/H5 found | Possible blind spot — constraints always exist |
| All constraints H0-H1 | Suspiciously easy — look deeper |

## Integration Points

- **Feeds from:** Deep-Verify impossibility findings (automatic H5), #003 Scope assumptions
- **Feeds to:** #401 Overall feasibility (H5 = infeasible path), all dimension assessments

## Common Pitfalls

- **Overconfidence on H5:** Not everything that seems impossible is provably impossible
- **Underestimating H2:** Resource constraints compound and interact
- **Ignoring H3:** Structural blocks are real constraints, not just "politics"
- **Premature optimization:** Don't spend time optimizing H1 constraints when H5 exists
