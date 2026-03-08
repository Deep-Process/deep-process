---
name: deep-orchestration
description: >
  Use when user needs to run multiple deep-* analyses in a coordinated
  workflow. Triggers: "full analysis", "run everything", "complete assessment",
  "end-to-end analysis", "orchestrate the deep processes".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Orchestration

Workflow coordination — running multiple deep-* skills in sequence.

## Procedure

### Step 1 — Define

Determine workflow scope:

- What is the subject of analysis?
- What decisions need to be made?
- What skills are relevant?
- What inputs are available?

### Step 2 — Sequence

Build dependency graph. Select from recommended flows or compose custom:

**Decision flow:**
1. deep-explore — understand the landscape
2. deep-feasibility — assess viability of options
3. deep-risk — identify risks for viable options
4. deep-aggregate — combine into decision brief

**Build flow:**
1. deep-requirements — capture what to build
2. deep-architect — design the solution
3. deep-implement — build it
4. deep-test — verify it works
5. deep-deploy — ship it

**Validation flow:**
1. deep-verify — check artifact correctness
2. deep-challenge — stress-test conclusions
3. deep-aggregate — combine findings

**Custom flow:**
- List skills in execution order
- Mark dependencies: which skill needs output from which
- Identify parallel opportunities (skills with no mutual dependencies)

### Step 3 — Execute

Run skills in order:

- Before each skill: confirm inputs are available
- After each skill: capture output for downstream use
- If a skill produces a blocking finding (e.g., feasibility = NO), pause and confirm whether to continue
- Track execution status:

| Step | Skill | Status | Key Output |
|------|-------|--------|------------|
| 1 | ... | done/running/pending/skipped | ... |

### Step 4 — Aggregate

After all skills complete, invoke deep-aggregate to combine outputs:

- Decision brief with all findings
- Cross-references between skill outputs
- Conflicts between skill findings flagged
- Final recommendations

Output:

```
## Orchestration Summary — [Subject] — [Date]

### Flow Executed: [Decision / Build / Validation / Custom]

### Execution Log
| Step | Skill | Status | Duration | Key Finding |
|------|-------|--------|----------|-------------|

### Combined Findings
...

### Cross-Skill Conflicts
...

### Final Recommendations
1. ...
2. ...
```

## Checklist

- [ ] Flow type selected and justified
- [ ] Dependency graph defined before execution
- [ ] Each skill received correct inputs
- [ ] Blocking findings handled (pause/continue decisions logged)
- [ ] Outputs aggregated with cross-references
- [ ] Conflicts between skill outputs flagged
