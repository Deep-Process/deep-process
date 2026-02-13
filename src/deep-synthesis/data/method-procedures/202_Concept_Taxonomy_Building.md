# 202 - Concept Taxonomy Building

## Phase
DECOMPOSE

## Purpose
Identify all distinct CONCEPTS used across sources and build a shared vocabulary. Different sources often use different terms for the same concept, or same terms for different concepts.

## Key Issues to Detect

**Synonyms:** Different words, same meaning
- Example: "pipeline" vs "workflow" vs "ETL job"
- Must be recognized to avoid treating as different concepts

**Homonyms:** Same word, different meanings
- Example: "schema" in database vs "schema" in psychology
- Must be recognized to avoid false agreement

**Paradigm Conflicts:** Same word, paradigmatically different meanings
- Example: "Agile" means something different to a developer vs a PMO
- These are NOT superficial — they reflect deep framework conflicts

## Procedure

### Step 1: Concept Listing
List all domain concepts mentioned across sources
- Extract terminology from claims
- Include both explicit and implicit concepts

### Step 2: Synonym Identification
Identify different words with same meaning
- Map synonymous terms to canonical concept
- Document the mapping

### Step 3: Homonym Identification
Identify same words with different meanings
- Flag these explicitly
- Note which meaning each source uses

### Step 4: Paradigm Conflict Detection
Check for paradigmatic differences (Kuhn Alert)
- When concepts have different meanings across sources from different paradigms
- These require TRANSLATION before integration

### Step 5: Taxonomy Construction
Build concept map
- Concept → definition → sources → relationships
- Create shared vocabulary for synthesis

## Output Schema
```yaml
taxonomy:
  concepts:
    - concept: "[Canonical name]"
      definition: "[Synthesized definition]"
      synonyms: ["term1", "term2"]
      sources_using: ["S1", "S2"]
      relationships:
        - related_to: "[Other concept]"
          relationship_type: "[is-a, part-of, causes, etc.]"
  homonyms:
    - term: "[The homonymous term]"
      meanings:
        - meaning: "[Meaning 1]"
          used_by: ["S1"]
        - meaning: "[Meaning 2]"
          used_by: ["S2"]
  paradigm_conflicts:
    - concept: "[Concept with paradigm conflict]"
      paradigm_a: "[How paradigm A defines it]"
      paradigm_b: "[How paradigm B defines it]"
      sources_in_a: ["S1"]
      sources_in_b: ["S2"]
      translation_needed: true
```

## Quality Checks
- [ ] All key concepts identified
- [ ] Synonyms mapped to canonical terms
- [ ] Homonyms flagged and clarified
- [ ] Paradigm conflicts detected
- [ ] Shared vocabulary established

## Connections
- Uses: #201 (Claim Extraction)
- Feeds into: #203 (Model Inventory), #301 (Convergence-Divergence)
- Grounded in: Kuhn (1962) — paradigm incommensurability
