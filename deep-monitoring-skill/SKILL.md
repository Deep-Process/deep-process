---
name: deep-monitoring
description: >
  Use when user wants to verify quality of a previously executed analysis or
  process output. Triggers: "was this analysis thorough", "check the quality
  of this report", "monitor process quality", "was anything missed".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Monitoring

Post-execution quality monitoring of process outputs.

## Procedure

### Step 1 — Collect

Read the process output or report being monitored:

- Identify the skill/process that produced it
- Note the stated scope and objectives
- Capture all sections and their content

### Step 2 — Analyze

Check against quality dimensions:

| Dimension | Question | Score |
|-----------|----------|-------|
| **Completeness** | Are all expected sections present and filled? | 0-100% |
| **Evidence ratio** | What % of claims have supporting evidence? | 0-100% |
| **Scope transparency** | Does the report state what was NOT checked? | Yes / Partial / No |
| **Counter-checks** | Were findings challenged or alternative views considered? | Yes / Partial / No |
| **Actionability** | Are recommendations specific and actionable? | Yes / Partial / No |
| **Consistency** | Do conclusions follow from the evidence presented? | Yes / Partial / No |

For each dimension, list specific observations:

- What was done well
- What is missing or weak
- Specific examples

### Step 3 — Score

Assign overall quality score:

| Score | Criteria |
|-------|----------|
| **PASSED** | All dimensions adequate, no critical gaps |
| **PASSED WITH CONCERNS** | Minor gaps, results still usable with noted caveats |
| **INSUFFICIENT** | Significant gaps that undermine reliability |
| **FAILED** | Critical dimensions missing, results not trustworthy |

### Step 4 — Output

Produce monitoring report:

```
## Quality Monitoring Report — [Date]

### Subject
- Report/output monitored: ...
- Produced by skill: ...
- Original scope: ...

### Dimension Scores
| Dimension | Score | Key Observations |
|-----------|-------|-----------------|
| Completeness | ...% | ... |
| Evidence ratio | ...% | ... |
| Scope transparency | ... | ... |
| Counter-checks | ... | ... |
| Actionability | ... | ... |
| Consistency | ... | ... |

### Overall Score: [PASSED / PASSED WITH CONCERNS / INSUFFICIENT / FAILED]

### Quality Gaps
1. ...
2. ...

### Remediation Suggestions
1. ...
2. ...
```

## Checklist

- [ ] Source output fully read
- [ ] All six quality dimensions assessed
- [ ] Specific examples cited for each dimension
- [ ] Overall score justified
- [ ] Remediation suggestions provided for gaps
