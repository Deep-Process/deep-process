# 505 - Actionability Assessment

## Phase
CRYSTALLIZE

## Purpose
For each synthesis output, assess: what should someone DO differently based on this? Synthesis that doesn't lead to different action or understanding is academic. Actionability is the ultimate test of synthesis value.

## Actionability Dimensions

| Dimension | Question | Example |
|-----------|----------|---------|
| **Decisions** | Which decisions does this synthesis inform? | "This helps decide between vendor A and B" |
| **Predictions** | What can we now predict that we couldn't before? | "We can predict failure modes under scale" |
| **Questions** | What NEW questions does this synthesis raise? | "We now need to investigate X" |
| **Warnings** | What risks/pitfalls does this synthesis reveal? | "Avoid doing Y in context Z" |
| **Opportunities** | What possibilities does this synthesis open? | "Cross-domain solution X becomes viable" |
| **Changes** | What should we CHANGE based on this synthesis? | "Modify process X, adopt tool Y" |

## Procedure

### Step 1: Dimension Mapping
For each core insight and principle: map to actionability dimensions
- What decisions does this inform?
- What predictions does this enable?
- What questions does this raise?
- What warnings does this provide?
- What opportunities does this reveal?
- What changes does this suggest?

### Step 2: Action Specificity Assessment
Rate how specific/actionable each mapping is
- **Concrete:** "Do X tomorrow" — implementable immediately
- **Directional:** "Move toward X" — guides but needs specification
- **Informational:** "Know that X" — changes understanding but not immediate action

### Step 3: Priority Assignment
Prioritize actions
- What's the SINGLE most important action?
- What's the highest-impact set of actions?
- What can be done immediately vs later?

### Step 4: Process Integration Identification
Which synthesis outputs feed into other Deep processes?
- New options discovered → Deep-Explore
- Correctness concerns → Deep-Verify
- Feasibility questions → Deep-Feasibility
- New risks identified → Deep-Risk
- Further synthesis needed → Deep-Synthesis

### Step 5: Stakeholder Mapping
Who should act on what?
- Which insights are relevant to which stakeholders?
- Who owns which actions?

### Step 6: Action Documentation
Document recommended actions clearly
- Specific enough to implement
- Linked to supporting insight
- Prioritized for decision-makers

## Output Schema
```yaml
actionability:
  insight_mappings:
    - insight_id: "I1"
      insight: "[The insight]"
      dimensions:
        decisions: ["[Decision this informs]"]
        predictions: ["[Prediction this enables]"]
        questions: ["[Question this raises]"]
        warnings: ["[Risk this reveals]"]
        opportunities: ["[Opportunity this opens]"]
        changes: ["[Change this suggests]"]
      specificity: "concrete/directional/informational"
  priority_actions:
    single_most_important: "[The #1 action]"
    high_impact_set:
      - action: "[Action]"
        insight_source: "I1"
        specificity: "concrete/directional/informational"
        stakeholder: "[Who should act]"
    immediate_actions: ["[Can do now]"]
    later_actions: ["[Can do later]"]
  process_integration:
    - synthesis_output: "[What from synthesis]"
      feeds_into_process: "Deep-Explore/Deep-Verify/Deep-Feasibility/Deep-Risk/Deep-Synthesis"
      reason: "[Why this process]"
  stakeholder_actions:
    - stakeholder: "[Role/team]"
      actions: ["[Their actions]"]
      insights_relevant: ["I1", "I2"]
```

## Actionability Test

### The "So What" Test
For each synthesis finding:
- "So what?" — what action follows?
- If no action follows, it may be interesting but not actionable
- Not all findings need to be actionable, but the synthesis overall should be

### The "Different Tomorrow" Test
If someone reads this synthesis:
- Will they do something DIFFERENT tomorrow?
- Will they think DIFFERENTLY about decisions?
- Will they avoid MISTAKES they would otherwise make?

## Action Categories

### Immediate Actions
- Can be done in the next 24-48 hours
- Low barrier to implementation
- Quick wins

### Short-term Actions
- 1-4 weeks to implement
- May require coordination
- Visible impact

### Strategic Actions
- Months to implement
- Significant resources
- Transforms approach

### Ongoing Actions
- Continuous practices
- Habits to adopt
- Principles to apply

## Integration with Deep Framework

| Synthesis Output | Triggers | Process |
|------------------|----------|---------|
| New option discovered | → Further exploration | Deep-Explore |
| Claim needs verification | → Validation | Deep-Verify |
| Approach needs feasibility check | → Assessment | Deep-Feasibility |
| New risk identified | → Risk analysis | Deep-Risk |
| More synthesis needed | → Another cycle | Deep-Synthesis |

## Quality Checks
- [ ] All core insights mapped to actionability dimensions
- [ ] Specificity assessed for each action
- [ ] Priority assigned
- [ ] Process integrations identified
- [ ] Stakeholder mapping completed
- [ ] Actions documented clearly and specifically
- [ ] "So what" test passed
- [ ] "Different tomorrow" test passed

## Warning
> Synthesis without action is academia.
> If nobody will do anything differently,
> was the synthesis worth doing?

## Connections
- Uses: #501 (Core Insights), #503 (Principles)
- Feeds into: Final synthesis output, other Deep processes
- Test: Is this synthesis USEFUL?
- Output: Actionable recommendations
