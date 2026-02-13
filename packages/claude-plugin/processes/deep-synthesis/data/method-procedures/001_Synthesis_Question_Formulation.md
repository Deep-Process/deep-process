# 001 - Synthesis Question Formulation

## Phase
SCOPE

## Purpose
Articulate the specific question the synthesis must answer. "What do we know about X?" is too vague. A good synthesis question constrains the scope while enabling genuine integration.

## Good vs Bad Questions

**Good Synthesis Questions:**
- "What do the combined findings from our PoC, vendor docs, and architecture review tell us about whether Delta Lake meets our needs?"
- "How do the principles of sustainable packaging design interact with EPR compliance requirements across EU markets?"
- "What patterns emerge from our last 5 project post-mortems that point to systemic issues?"

**Bad Synthesis Questions:**
- "What do we know?" (unbounded)
- "Summarize these documents" (not synthesis, just summarization)
- "Is this good?" (too vague, not about knowledge integration)

## Procedure

### Step 1: Draft the Question
Write the initial synthesis question.

### Step 2: Answerability Check
Is this question ANSWERABLE?
- Not too broad
- Not too vague
- Has clear boundaries

### Step 3: Multi-Source Check
Does this question require MULTIPLE sources to answer?
- If one source can answer it completely, you don't need synthesis
- The value comes from combining perspectives

### Step 4: Integration Check
Does this question seek INTEGRATION, not just collection?
- Looking for: patterns, principles, frameworks
- NOT looking for: lists, catalogs, inventories

### Step 5: Answer Form Definition
What would a GOOD answer look like?
- Format: Framework / Principle set / Mental model / Narrative
- Length: Abstract (100w) / Summary (500w) / Full document
- Confidence: High certainty / Best current understanding / Hypothesis

## Output Schema
```yaml
synthesis_question:
  question: "[The synthesis question]"
  answerable: true/false
  requires_multiple_sources: true/false
  integration_type: "pattern/principle/framework/narrative"
  answer_form:
    format: "[expected format]"
    length: "[expected length]"
    confidence: "[expected confidence level]"
```

## Quality Checks
- [ ] Question is specific and bounded
- [ ] Question requires combining sources
- [ ] Question seeks integration, not collection
- [ ] Answer form is defined
- [ ] Stakeholders would find the answer valuable

## Connections
- Feeds into: #002 (Level Selection), #003 (Source Landscape)
- Revisit if: Scope changes, stakeholder needs change
