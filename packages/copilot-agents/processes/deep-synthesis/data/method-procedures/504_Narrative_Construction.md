# 504 - Narrative Construction

## Phase
CRYSTALLIZE

## Purpose
Build a coherent STORY from the synthesis. Humans think in narratives — a well-constructed narrative makes synthesis sticky and shareable. But narratives are also dangerous because they can make accidental patterns feel inevitable.

## Narrative Elements

| Element | Purpose | Synthesis Mapping |
|---------|---------|-------------------|
| **Setting** | Context and background | Source landscape, domain context |
| **Characters** | Who/what is involved | Stakeholders, systems, concepts |
| **Tension** | Conflict or question | Dialectical tensions, contradictions |
| **Discovery** | What was learned | Emergent insights, resolved tensions |
| **Resolution** | How it comes together | Unified framework, principles |
| **Implication** | What happens next | Actionable conclusions, predictions |

## Procedure

### Step 1: Setting Construction
Establish the context
- What was the synthesis question?
- What was the landscape of knowledge?
- Why did this synthesis matter?

### Step 2: Characters Introduction
Introduce the key "characters"
- Sources as perspectives/voices
- Concepts as protagonists
- Stakeholders as affected parties

### Step 3: Tension Building
Build the narrative tension
- What contradictions existed?
- What was at stake?
- Why was resolution difficult?

### Step 4: Discovery Journey
Narrate the discovery process
- What emerged from the synthesis?
- What was surprising?
- How did understanding develop?

### Step 5: Resolution Articulation
Show how tensions resolved
- What framework emerged?
- What principles were extracted?
- How do contradictions now make sense?

### Step 6: Implication Projection
Project forward
- What should change?
- What can be predicted?
- What questions remain?

### Step 7: Narrative Fallacy Guard
Apply anti-narrative bias checks
- For each narrative element: is this SUPPORTED by evidence?
- Would a different narrative structure change the conclusion?
- Am I including this because it's TRUE or because it makes a satisfying story?

## Output Schema
```yaml
narrative:
  setting:
    context: "[The synthesis context]"
    question: "[The synthesis question]"
    stakes: "[Why this mattered]"
  characters:
    - character: "[Source/concept/stakeholder]"
      role: "[Their role in the narrative]"
  tensions:
    - tension: "[The conflict/contradiction]"
      source: "[From which synthesis finding]"
  discoveries:
    - discovery: "[What was learned]"
      surprise_factor: "high/medium/low"
  resolution:
    framework: "[How it came together]"
    key_insight: "[The central resolution]"
  implications:
    actions: ["[What to do]"]
    predictions: ["[What will happen]"]
    open_questions: ["[What remains]"]
  fallacy_checks:
    evidence_traceability:
      - narrative_element: "[Element]"
        evidence_support: "[What supports this]"
        risk: "low/medium/high"
    alternative_narratives:
      - alternative: "[Different way to tell this]"
        would_change_conclusion: true/false
  audience_level: "executive/technical/general"
```

## Narrative Fallacy Guard

### Risk: Imposed Causality
- Narrative wants causes for everything
- Check: Is the claimed causality supported or imposed?

### Risk: Hindsight Bias
- Narrative makes outcome feel inevitable
- Check: Was this actually predictable before?

### Risk: Satisfying Arc
- Narrative prefers resolution
- Check: Are we forcing resolution on unresolved tensions?

### Risk: Character Motivation
- Narrative assigns intentions
- Check: Do we actually know the motivations?

### Risk: Selection Bias
- Narrative includes what fits the story
- Check: What's being excluded that doesn't fit?

## Validation Questions

For each narrative claim:
1. Is this **supported** by evidence, or just a good story?
2. Would a **different narrative** structure change the conclusion?
3. Am I including this because it's **TRUE** or because it makes a **satisfying story**?
4. What am I **leaving out** that doesn't fit the narrative?
5. Would someone with different prior beliefs tell a **different story** from the same evidence?

## Audience Calibration

### Executive Level
- Focus on: Stakes, resolution, implications
- Minimize: Technical detail, methodology
- Length: Short (1-2 pages)

### Technical Level
- Focus on: Discovery process, evidence, mechanisms
- Include: Methodological notes, limitations
- Length: Medium (5-10 pages)

### General Level
- Focus on: Setting, tension, resolution
- Use: Accessible language, analogies
- Length: Variable based on purpose

## Quality Checks
- [ ] All narrative elements present
- [ ] Characters clearly introduced
- [ ] Tension built effectively
- [ ] Discovery narrated with evidence
- [ ] Resolution grounded in synthesis
- [ ] Implications actionable
- [ ] Narrative fallacy guard applied
- [ ] Each element has evidence traceability
- [ ] Alternative narratives considered
- [ ] Audience level appropriate

## Warning
> Narratives are powerful but dangerous.
> They can make accidental patterns feel inevitable.
> Always check: TRUE or just SATISFYING?

## Connections
- Uses: #501 (Core Insights), #502 (Mental Models), #503 (Principles)
- Feeds into: Final synthesis output, communication
- Warning: Narrative Fallacy (Taleb)
- Balance: Story power vs. story danger
