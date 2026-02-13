# Research Methods

## When to Research

| Situation | Action |
|-----------|--------|
| Consequence you can't verify | RESEARCH |
| Technology you don't know | RESEARCH |
| Integration uncertain | RESEARCH |
| Claim without evidence | RESEARCH or mark UNKNOWN |

---

## Methods

### WEB SEARCH

**Best for:** Current state, recent changes, comparisons

```
□ Add year to query (e.g., "TypeScript Azure 2026")
□ Check official sources first
□ Multiple sources for consensus
□ Note conflicts
□ Record URLs

OUTPUT:
Finding: ___
Source: [url]
Confidence: [HIGH/MED/LOW]
Status: [VERIFIED/ASSUMED]
```

### DOCUMENTATION

**Best for:** Technical capabilities, APIs, constraints

```
□ Find official docs
□ Check version matches current
□ Look for "limitations" section
□ Check changelog
□ Note gaps

OUTPUT:
Finding: ___
Source: [url]
Version: ___
Status: [VERIFIED/ASSUMED]
```

### EXPERIMENT

**Best for:** "Does X work?", performance, integration

```
□ Define specific question
□ Define success/failure criteria
□ Minimal experiment
□ Record results
□ Note surprises

OUTPUT:
Question: ___
Result: [SUCCESS/FAILURE/PARTIAL]
Evidence: ___
Status: VERIFIED (experiments produce direct evidence)
```

### EXPERT (flag for user)

**Best for:** Domain knowledge, judgment calls

```
□ Formulate specific questions
□ Identify who could answer
□ Flag for user
□ Note what depends on answer

OUTPUT:
Questions: ___
Expert type: ___
Blocked: [what decisions wait on this]
Status: ASSUMED (until expert responds)
```

---

## Quality Checklist

```
□ Source is authoritative
□ Information is current
□ Multiple sources agree (or conflict noted)
□ Specific enough to use
□ Source recorded
□ Status tagged: VERIFIED or ASSUMED
```

---

## When Research Fails

| Situation | Action |
|-----------|--------|
| No info found | Mark TRUE UNKNOWN |
| Conflicting info | Note both, reduce confidence, tag ASSUMED |
| Old info | Flag may have changed, tag ASSUMED |
| Too complex | Park or flag for expert, tag ASSUMED |
