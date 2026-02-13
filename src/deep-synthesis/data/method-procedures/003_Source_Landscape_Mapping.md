# 003 - Source Landscape Mapping

## Phase
SCOPE

## Purpose
Before gathering sources, map the LANDSCAPE of available knowledge. What types of sources exist? Where are the gaps? This prevents the Streetlight Effect (searching only where convenient).

## Source Types

| Type | Nature | Strength | Weakness |
|------|--------|----------|----------|
| **Empirical data** | Measurements, metrics, logs | Objective, quantifiable | May lack context |
| **Expert knowledge** | Specialist opinions, experience | Nuanced, contextual | Subject to bias |
| **Documented procedures** | Processes, runbooks, standards | Official, auditable | May not reflect reality |
| **Academic/research** | Papers, studies, reviews | Rigorous, peer-reviewed | May not be practical |
| **Experiential** | Lessons learned, post-mortems | Practical, real-world | Survivorship bias |
| **Theoretical** | Frameworks, models, theorems | General, principled | May not apply to specifics |
| **Tacit** | Undocumented "tribal" knowledge | Often the most critical | Hard to access, verify |
| **Cross-domain** | Knowledge from adjacent fields | Novel perspectives | Transfer may not hold |

## Procedure

### Step 1: Relevance Mapping
For the synthesis question: which source types are RELEVANT?
- Mark each type as relevant or not
- Consider both obvious and non-obvious types

### Step 2: Availability Assessment
Which relevant types are AVAILABLE?
- Identify what can be accessed
- Note barriers to access

### Step 3: Gap Identification
Which relevant types are MISSING?
- Gaps are as informative as sources
- Document why they're missing (not available? not sought? not relevant?)

### Step 4: Diversity Audit
Are multiple perspectives represented?
- Different methods?
- Different viewpoints?
- Different domains?

### Step 5: Streetlight Check
Are we looking where the knowledge IS, or only where it's convenient to look?
- What uncomfortable sources should we seek?
- What's being systematically avoided?

## Output Schema
```yaml
source_landscape:
  types:
    - type: "Empirical data"
      relevant: true/false
      available: true/false
      gap: "[Description if gap]"
    - type: "Expert knowledge"
      relevant: true/false
      available: true/false
      gap: "[Description if gap]"
    # ... for each type
  diversity_score: "[Assessment]"
  streetlight_risk: "LOW/MEDIUM/HIGH"
  gaps_to_address:
    - "[Gap 1]"
    - "[Gap 2]"
```

## Quality Checks
- [ ] All 8 source types considered
- [ ] Relevant types identified
- [ ] Gaps documented, not just ignored
- [ ] Diversity assessed
- [ ] Streetlight effect checked

## Connections
- Feeds into: #101 (Source Collection)
- Prevents: Streetlight Effect, source homogeneity
- Revisit if: Scope changes, new source types discovered
