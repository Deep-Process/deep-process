# 607 - Synthesis Decay Monitoring

## Phase
META (continuous)

## Purpose
Synthesis conclusions are not permanent. Define what changes would invalidate the synthesis and require reassessment. A synthesis without decay monitoring becomes dangerously stale.

## Key Insight
> Synthesis has a SHELF LIFE.
> Conditions change, new evidence emerges, contexts evolve.
> A synthesis that was valid becomes invalid — silently and dangerously.

## Decay Triggers

| Trigger | Description | Impact Level |
|---------|-------------|--------------|
| **New contradicting source** | New evidence contradicts conclusions | May invalidate core conclusions |
| **Source quality revision** | Original sources found to be flawed | Changes evidence weights |
| **Context change** | Operating environment changes | May violate boundary conditions |
| **Time passage** | Temporal assumptions expire | Conclusions may no longer apply |
| **Failed prediction** | Synthesis predictions proven wrong | Synthesis model is flawed |
| **Paradigm shift** | Field fundamentals change | Framework assumptions invalidated |
| **Technology change** | Technical foundation changes | Technical conclusions obsolete |
| **Regulatory change** | Rules/requirements change | Compliance conclusions invalid |

## Procedure

### Step 1: Conclusion Sensitivity Mapping
For each core conclusion: what would change it?
- What new evidence would invalidate?
- What context changes would matter?
- What time-dependent factors exist?

### Step 2: Monitoring Cadence Setting
For each conclusion: when to re-evaluate?
- Based on rate of change in domain
- Based on importance of conclusion
- Set specific dates/triggers

### Step 3: Kill Criteria Definition
What evidence would COMPLETELY invalidate the synthesis?
- Not just weaken — completely kill
- Be specific about what would be sufficient
- These are existential threats to the synthesis

### Step 4: Monitoring Mechanism Design
How will decay be detected?
- Active monitoring: who checks what when?
- Passive triggers: what events trigger review?
- Owner assignment: who is responsible?

### Step 5: Update Protocol Definition
When decay is detected, what happens?
- Minor decay: update conclusions
- Major decay: re-synthesize
- Complete invalidation: retire synthesis

## Output Schema
```yaml
decay_monitoring:
  conclusion_sensitivity:
    - conclusion_id: "CON1"
      conclusion: "[The conclusion]"
      decay_triggers:
        - trigger_type: "new_source/quality_revision/context_change/time_passage/failed_prediction/paradigm_shift/technology_change/regulatory_change"
          specific_trigger: "[What specifically would trigger decay]"
          impact: "major/minor"
      monitoring_cadence: "[How often to check]"
      next_review_date: "[Date]"
      owner: "[Who monitors]"
  kill_criteria:
    - criterion: "[What would completely invalidate]"
      affected_conclusions: ["CON1", "CON2"]
      likelihood: "high/medium/low"
      detection_method: "[How we'd know]"
  monitoring_mechanisms:
    active:
      - check: "[What to check]"
        frequency: "[How often]"
        owner: "[Who]"
    passive_triggers:
      - event: "[What event triggers review]"
        action: "[What happens when triggered]"
  update_protocol:
    minor_decay: "[What to do for minor issues]"
    major_decay: "[What to do for significant changes]"
    complete_invalidation: "[What to do when synthesis is killed]"
  synthesis_metadata:
    creation_date: "[When synthesized]"
    last_review_date: "[Last checked]"
    expiration_date: "[Hard deadline if any]"
    version: "[Version number if living document]"
```

## Decay Timeline Estimation

| Domain Type | Typical Decay Rate | Monitoring Cadence |
|-------------|-------------------|-------------------|
| Technology trends | Fast (6-12 months) | Quarterly |
| Best practices | Medium (1-2 years) | Semi-annually |
| Domain principles | Slow (3-5 years) | Annually |
| Fundamental theory | Very slow (10+ years) | Every 3-5 years |
| Regulatory landscape | Variable (depends on jurisdiction) | On regulatory announcements |

## Kill Criteria Examples

### Technology Synthesis
- "Kill if: Platform X is deprecated or major breaking changes"
- "Kill if: Competitor emerges with fundamentally different approach"

### Process Synthesis
- "Kill if: New research contradicts causal model"
- "Kill if: Context changes (e.g., remote work becomes standard)"

### Strategy Synthesis
- "Kill if: Market conditions fundamentally shift"
- "Kill if: Key assumption (e.g., growth rate) is wrong by >50%"

## Living Synthesis Concept

For important syntheses, consider making them "living documents":
1. **Version control:** Track changes over time
2. **Update log:** Document what changed and why
3. **Owner assignment:** Someone responsible for currency
4. **Review schedule:** Regular cadence of review
5. **Retirement criteria:** When to stop maintaining

## Quality Checks
- [ ] Sensitivity mapped for all core conclusions
- [ ] Monitoring cadence set for each conclusion
- [ ] Kill criteria defined
- [ ] Monitoring mechanisms designed
- [ ] Owners assigned
- [ ] Update protocol documented
- [ ] Review dates scheduled
- [ ] Synthesis metadata recorded

## When to Apply
- **Required for:** All synthesis depths
- **Critical for:** Syntheses that inform ongoing decisions
- **Especially for:** Fast-changing domains

## Warning
> A synthesis that was valid BECOMES invalid.
> The most dangerous synthesis is one that's treated as eternally true.
> Set expiration dates and honor them.

## Connections
- Uses: All synthesis outputs
- Feeds into: Synthesis lifecycle management
- Prevents: Acting on stale synthesis
- Key: Synthesis is not permanent
