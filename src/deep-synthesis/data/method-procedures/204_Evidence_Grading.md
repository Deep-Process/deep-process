# 204 - Evidence Grading

## Phase
DECOMPOSE

## Purpose
Assess the STRENGTH of evidence behind each claim. Not all evidence is equal — a controlled experiment provides stronger evidence than an anecdote. Evidence grading determines how much weight each claim should carry in synthesis.

## Evidence Hierarchy

| Grade | Evidence Type | Strength | Example |
|-------|--------------|----------|---------|
| **A** | Systematic review / meta-analysis of multiple studies | Strongest | Cochrane review, systematic literature review |
| **B** | Controlled experiment / rigorous A/B test | Strong | Randomized controlled trial, proper A/B test with controls |
| **C** | Observational study / careful measurement | Moderate | Cohort study, time-series analysis, metrics analysis |
| **D** | Case study / single observation | Weak-moderate | Post-mortem of one incident, single project retrospective |
| **E** | Expert opinion / professional experience | Weak | Practitioner recommendation, conference talk claim |
| **F** | Anecdote / assumption / marketing material | Weakest | Vendor claims, "everyone knows", casual observation |

## Procedure

### Step 1: Evidence Identification
For each claim from #201: identify what evidence supports it
- What data, study, or observation backs this claim?
- Is the evidence cited explicitly or implied?

### Step 2: Evidence Classification
Classify evidence using the hierarchy
- Apply the grade that best matches the evidence type
- If multiple evidence types, use the strongest available

### Step 3: Weight Assignment
Determine synthesis weight based on grade
- Grade A-B: High weight — can drive synthesis conclusions
- Grade C-D: Moderate weight — supporting evidence
- Grade E-F: Low weight — hypothesis generation only

### Step 4: Red Flag Detection
Identify concerning patterns
- High-impact claims supported only by F-grade evidence
- Claims "everyone knows" with no evidence at all
- Evidence from source with strong bias (check #102)

### Step 5: Evidence Gap Documentation
Note where evidence is missing or weak
- Claims that need stronger evidence
- Areas where evidence should exist but doesn't

## Output Schema
```yaml
evidence_grades:
  - claim_id: "C1"
    claim_text: "[The claim]"
    evidence_description: "[What evidence supports it]"
    evidence_type: "systematic_review/experiment/observational/case_study/expert_opinion/anecdote"
    grade: "A/B/C/D/E/F"
    weight_in_synthesis: "high/moderate/low"
    red_flags:
      - "[If any concerns]"
  evidence_gaps:
    - claim_id: "C5"
      gap_description: "[What evidence is missing]"
      impact: "[How this affects synthesis]"
```

## Grading Rubric Details

### Grade A — Systematic Review/Meta-Analysis
- Multiple studies synthesized
- Explicit methodology for inclusion/exclusion
- Statistical aggregation of results
- Quality assessment of included studies

### Grade B — Controlled Experiment
- Random assignment or proper controls
- Measured outcome variables
- Adequate sample size
- Replicable methodology

### Grade C — Observational Study
- Systematic data collection
- No manipulation of variables
- Controls for confounders (or acknowledgment of them)
- Documented methodology

### Grade D — Case Study
- Single instance examined in depth
- Detailed documentation
- Limited generalizability
- Valuable for hypothesis generation

### Grade E — Expert Opinion
- Based on professional experience
- May be biased by personal experience
- Valuable for tacit knowledge
- Should be validated against other evidence

### Grade F — Anecdote/Marketing
- No systematic methodology
- Potential strong bias
- Use only for hypothesis generation
- Never drive conclusions alone

## Quality Checks
- [ ] All claims have evidence identified
- [ ] Grades assigned consistently using hierarchy
- [ ] Weights reflect evidence strength
- [ ] Red flags documented
- [ ] Evidence gaps noted

## Connections
- Uses: #201 (Claim Extraction), #102 (Source Quality)
- Feeds into: #301 (Convergence-Divergence), #401 (Dialectical Integration)
- Grounded in: Medical evidence hierarchy (GRADE system), Glass (1976) meta-analysis methodology
