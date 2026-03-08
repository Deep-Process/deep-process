---
name: deep-challenge
description: >
  Use when user has a plan, proposal, or decision and wants it stress-tested.
  Triggers: "challenge this", "play devil's advocate", "stress test this plan",
  "what am I missing", "poke holes in this".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Challenge

Structured adversarial validation of proposals, plans, and decisions.

## What This Adds

Claude already critiques when asked. This skill adds:
- **5 structured lenses** applied systematically (not ad hoc pushback)
- **Pre-mortem technique**: narrative failure story that surfaces non-obvious risks
- **Assumption stress test**: every assumption classified and attacked
- **Steel-man alternative**: the best case for NOT doing this, made genuinely compelling
- **Clear verdict**: Robust / Fragile / Fatal Flaw

## Procedure

### Step 1: Understand

Read the proposal or plan. Then produce:

1. **One-paragraph restatement**: prove you understand it before attacking it
2. **Core bet**: the single thing that must be true for this to succeed

Example core bet: "This plan bets that enterprise customers will pay 3x more for a self-hosted version, and that our team can build a deployment system in 4 months."

Get user confirmation on the core bet before proceeding. If working from files, state the core bet and proceed.

### Step 2: Challenge

Apply all 5 lenses:

#### Lens 1: Pre-Mortem

Write a realistic failure narrative:

> "It is {appropriate timeframe} after launch. The project has failed. Here is the post-mortem..."

Cover:
- What went wrong (the most likely failure mode, not the most dramatic)
- The chain of events (how small things compounded)
- Warning signs that were visible in hindsight
- What would have prevented it

#### Lens 2: Assumption Stress Test

List every assumption the plan makes, then classify:

| Assumption | Status | If Wrong |
|------------|--------|----------|
| "Users will migrate within 30 days" | Untested | Stalled revenue, two systems to maintain |
| "API can handle 10k req/s" | Tested (load test Dec 2024) | OK |
| "Competitor won't react" | Untestable | Price war, margin collapse |

Attack every **Untested** assumption:
- What evidence would test it?
- What's the cheapest test?
- What's the cost of being wrong?

#### Lens 3: Incentive Analysis

| Stakeholder | Incentive | Will they behave as assumed? |
|-------------|-----------|----------------------------|
| {who} | {what they want} | {yes/no and why} |

Flag misaligned incentives: where the plan assumes cooperation but incentives push otherwise.

#### Lens 4: Second-Order Effects

What happens AFTER the plan succeeds?

- Success creates new problems: "If we win enterprise, we need 24/7 support — do we have that?"
- Market reactions: "If we launch at this price, competitor will..."
- Internal effects: "If this team grows 3x, management overhead..."
- Lock-in effects: "Once we choose this vendor, switching cost is..."

#### Lens 5: Reference Class

What similar things have been attempted?

| Reference | What happened | Relevance |
|-----------|---------------|-----------|
| {similar project/company/decision} | {outcome} | {why it's comparable} |

If no references available, state that explicitly — absence of precedent is itself a risk signal.

### Step 3: Steel-Man Alternative

Construct the strongest possible case for either:
- Not doing this at all, OR
- Doing something meaningfully different

Rules:
- Make it genuinely compelling (not a strawman)
- Use the same evidence base as the original proposal
- Show what resources would be freed and what alternative upside exists

### Step 4: Verdict

Classify the proposal:

| Verdict | Criteria |
|---------|----------|
| **Robust** | Core bet is sound. Assumptions are tested or testable. Risks are manageable. Failure modes have mitigations. |
| **Fragile** | Core bet is plausible but depends on untested assumptions. Limited margin for error. Hard to reverse if wrong. |
| **Fatal Flaw** | Core bet is wrong, contains a logical impossibility, or depends on something demonstrably false. |

Provide 2-3 sentence justification referencing specific findings from the lenses.

## Output Format

```markdown
# Challenge: {proposal name}

## Core Bet
{What must be true for this to work — one clear statement}

## Pre-Mortem
{Narrative failure story, 1-2 paragraphs}

## Assumption Stress Test
| Assumption | Status | What Breaks If Wrong |
|------------|--------|---------------------|
| ... | Tested/Untested/Untestable | ... |

**Highest risk assumptions**: {top 2-3 that matter most}

## Incentive Analysis
| Stakeholder | Incentive | Aligned? |
|-------------|-----------|----------|
| ... | ... | ... |

## Second-Order Effects
1. {effect + consequence}
2. {effect + consequence}

## Reference Class
| Reference | Outcome | Relevance |
|-----------|---------|-----------|
| ... | ... | ... |

## Steel-Man Alternative
{The best case for not doing this — 1-2 paragraphs}

## Verdict: {Robust | Fragile | Fatal Flaw}
{2-3 sentence justification with references to specific findings above}
```

## Rules

- Be genuinely adversarial, not performatively — find real problems
- The steel-man alternative must be compelling enough that a reasonable person might prefer it
- Do not soften findings to be polite; the user asked for stress testing
- If the plan is actually good, say "Robust" — do not manufacture problems
- Every claim in the challenge must reference something in the original proposal
- Pre-mortem should describe the MOST LIKELY failure, not the worst-case fantasy
