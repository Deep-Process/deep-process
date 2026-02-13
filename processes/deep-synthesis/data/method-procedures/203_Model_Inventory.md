# 203 - Model Inventory

## Phase
DECOMPOSE

## Purpose
Identify all MODELS, FRAMEWORKS, and THEORIES used by different sources. Sources don't just present facts — they use models to organize and interpret facts. The model shapes what's visible and what's hidden.

## Key Insight
> Every source has an interpretive framework, even if implicit.
> The framework determines what the source can SEE and what remains INVISIBLE.

## Model Components

| Component | Question | Example |
|-----------|----------|---------|
| **Assumptions** | What does the model take for granted? | "Unified batch+streaming is always better" |
| **Scope** | What does it explain? | Data engineering, analytics |
| **Blind spots** | What does it NOT explain? | Organizational readiness, skill requirements |
| **Level of analysis** | What level does it operate at? | Technical architecture vs market-level |
| **Paradigm** | What worldview does it belong to? | Agile vs traditional; centralized vs federated |

## Procedure

### Step 1: Model Identification
For each source: identify the model/framework used
- Look for explicit frameworks cited
- Detect implicit frameworks from language and assumptions
- Note if source claims to be "model-free" (it isn't — find the hidden model)

### Step 2: Assumption Extraction
For each model: what does it take for granted?
- Domain assumptions
- Technical assumptions
- Methodological assumptions
- Paradigmatic assumptions

### Step 3: Scope and Blind Spot Mapping
Define what each model explains and what it doesn't
- Scope = what questions the model can answer
- Blind spots = what the model systematically ignores

### Step 4: Level Assignment
Assign level of analysis from #002
- Atomic, Pattern, Structural, Systemic, Paradigmatic

### Step 5: Cross-Model Comparison
Compare models across sources
- Do they agree? → Convergent frameworks
- Do they conflict? → Paradigm tension
- Do they complement? → Potential for integration

## Output Schema
```yaml
models:
  - source_id: "S1"
    model_name: "[Name or description]"
    explicit_or_implicit: "explicit/implicit"
    assumptions:
      - "[Assumption 1]"
      - "[Assumption 2]"
    scope: "[What it explains]"
    blind_spots:
      - "[What it doesn't explain]"
    level: "atomic/pattern/structural/systemic/paradigmatic"
    paradigm: "[Worldview]"
  model_comparison:
    agreements:
      - "[Where models agree]"
    conflicts:
      - "[Where models conflict]"
    complements:
      - "[Where models complement each other]"
```

## Example
```
Source A (Databricks blog): Model = "Lakehouse architecture solves all data problems"
├── Assumes: Unified batch+streaming is always better
├── Scope: Data engineering, analytics
├── Blind spot: Organizational readiness, skill requirements
├── Level: Technical architecture

Source B (Gartner report): Model = "Technology maturity lifecycle"
├── Assumes: Technologies follow predictable adoption curves
├── Scope: Market-level technology trends
├── Blind spot: Specific technical capabilities
├── Level: Market/industry

Source C (Team retrospective): Model = "Our experience doing this"
├── Assumes: Our context is representative
├── Scope: What worked and didn't for us
├── Blind spot: Why it might be different elsewhere
├── Level: Individual project
```

## Quality Checks
- [ ] All sources have identified model/framework
- [ ] Assumptions explicitly listed
- [ ] Scope and blind spots documented
- [ ] Level of analysis assigned
- [ ] Cross-model comparison completed

## Connections
- Uses: #002 (Level-of-Analysis), #201 (Claim Extraction)
- Feeds into: #302 (Dialectical Tension), #402 (Framework Unification)
- Grounded in: Kuhn (1962) — paradigms shape perception
