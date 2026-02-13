# Deep Explore
![Deep Explore Logo](img/logo_small.png)

A structured decision exploration workflow for LLM-assisted thinking.

## The problem

When I face important decisions, I often get stuck. Not because I lack options, but because I can't see them clearly.

I'd think about a career change and spiral into "what ifs." I'd consider a business idea and get blocked by vague fears I couldn't name. I'd try to choose between technologies and realize I didn't even know what questions to ask.

The usual approaches didn't help. Pro/con lists felt shallow. Talking to friends gave me their biases, not clarity. And when I asked an LLM for help, it would either give me a generic framework or just agree with whatever I was already thinking.

I needed a way to actually explore the decision space - to find out what I don't know, test my assumptions, and see options I wasn't considering.

## What this is

Deep Explore is a prompt-based workflow that forces the LLM to systematically explore a decision by:

1. Separating what you know from what you assume (and testing those assumptions)
2. Discovering dimensions of choice you hadn't considered
3. Mapping consequences - marking which are verified vs. which are guesses
4. Challenging your thinking with premortem analysis and bias checks
5. Turning vague fears into structured, addressable concerns

The output is understanding, not a recommendation. You still decide - but now you can see clearly.

## How to use it

You need an LLM CLI like Claude Code, Gemini CLI, or similar.

```
Use the process in src/core/deep-explore/workflow.md to explore [your decision]
```

Or with more context:

```
I'm considering leaving my job to start a company. Use Deep Explore to help me think through this.
```

## What it helped me with

**Seeing options I was blind to.** I was stuck between "stay at job" and "quit to start a company." Deep Explore surfaced a third path: keep the job but reduce hours and test the idea on weekends. Obvious in hindsight, invisible when I was trapped in binary thinking.

**Naming my fears.** "I'm afraid it won't work" became a list of specific concerns: runway length, co-founder availability, market timing. Some were false walls (I had more savings than I thought). Some were real risks I could plan for. The vague dread became a checklist.

**Finding what I didn't know I didn't know.** I assumed I needed VC funding. Research revealed that similar companies had bootstrapped successfully. That changed the whole decision calculus.

**Knowing when I was ready to decide.** Instead of endless deliberation, I got a clear signal: these three things are verified, these two are still assumptions, here's how to test them. Decision readiness, not decision paralysis.

## What it's good at

- Turning "I don't know where to start" into a structured exploration
- Finding hidden assumptions and testing them
- Transforming vague fears into specific, addressable concerns
- Discovering options you weren't considering
- Showing you what's verified vs. what's still a guess

## Limitations

This isn't magic. Some things to know:

- **It explores, it doesn't decide.** You still have to make the call. Deep Explore gives you clarity, not answers.
- **Scope matters.** "What should I do with my life?" is too broad. "Should I take this job offer?" is about right.
- **Garbage in, garbage out.** If you're not honest about your fears and assumptions, the exploration won't help.
- **LLM limitations apply.** Domain-specific facts should be verified independently. The structure is reliable; the content depends on the model's knowledge.

## Example output

```
DECISION: Whether to transition from employee to founder

KEY DISCOVERIES:
• Runway requirement is 18 months, not 12 (verified via market research)
• Co-founder network stronger than assumed (3 viable candidates identified)
• Biggest risk is not failure but "zombie startup" - neither succeeding nor failing

STRATEGIC CLUSTERS:
Cluster A: "Full Leap" - quit, raise funding, build fast
  Trade-off: Maximum commitment, highest risk, fastest learning

Cluster B: "Staged Transition" - side project → traction → transition
  Trade-off: Lower risk, slower progress, split attention

FEAR RESOLUTION:
• "I'll lose everything" → FALSE WALL (savings cover 2 years worst case)
• "I'm not ready" → COGNITIVE (20+ people with less experience have succeeded)
• "Market timing" → TRUE UNCERTAINTY (accept and monitor)

READINESS: Ready to decide on timing. Need more research on co-founder fit.
```

## Project structure

```
src/core/deep-explore/
├── workflow.md              # Main workflow (point the LLM here)
├── methods.csv              # All methods with descriptions
├── data/
│   ├── method-procedures/   # Individual method procedures
│   ├── exploration-report-template.md
│   └── research-methods.md
└── steps/                   # Detailed step documentation
```

## Works well with

- Career decisions (job changes, pivots, entrepreneurship)
- Business choices (strategy, partnerships, product direction)
- Technology selection (when "it depends" is the initial answer)
- Any decision where you feel stuck or overwhelmed

## Related processes

| Process | Purpose | When to use |
|---------|---------|-------------|
| **Deep Explore** | Explore decision space | You don't know what to do |
| **Deep Verify** | Verify artifact correctness | You have something to check |
| **Deep Risk** | Assess risks of a plan | You have a plan, want to stress-test it |

## License

MIT
