# 104 - Tacit Knowledge Elicitation

## Phase
ACQUIRE

## Purpose
Surface knowledge that exists in people's heads but isn't documented. Often the most valuable synthesis input — and the hardest to access.

## Theoretical Foundation
> "We know more than we can tell." — Polanyi (1966)

Grounded in SECI Model (Nonaka & Takeuchi) — this is the Externalization quadrant: Tacit → Explicit.

## Elicitation Methods

| Method | Best For | Limitation |
|--------|----------|------------|
| **Structured interview** | Deep domain knowledge | Time-intensive |
| **Critical incident technique** | Experience-based knowledge | Memory bias |
| **Think-aloud protocol** | Procedural knowledge | Disrupts natural flow |
| **Concept mapping** (collaborative) | Relational knowledge | Requires facilitation skill |
| **Retrospective** | Project/event knowledge | Hindsight bias |
| **Apprenticeship/shadowing** | Embodied knowledge | Very time-intensive |

## Procedure

### Step 1: Holder Identification
Who holds tacit knowledge relevant to the synthesis question?
- Domain experts
- Long-tenured practitioners
- People who've seen failures
- People from adjacent domains

### Step 2: Method Selection
Select appropriate elicitation method
- Match method to knowledge type
- Consider time and access constraints

### Step 3: Elicitation Execution
Externalize the knowledge
- Conduct interviews, mapping sessions, etc.
- Capture in structured form: claims, models, stories

### Step 4: Validation
Cross-check elicited knowledge against other sources
- Tacit knowledge may be accurate or may be personal bias
- Look for convergence with other evidence

### Step 5: Confidence Assignment
Weight appropriately
- Tacit knowledge is HYPOTHESIS-grade evidence, not established fact
- Valuable for generating hypotheses to test

## Output Schema
```yaml
tacit_knowledge:
  - holder: "[Person/Role]"
    knowledge_area: "[Domain of expertise]"
    method_used: "[Elicitation method]"
    extracted_claims:
      - claim: "[What they know]"
        validation_status: "validated/pending/contradicted"
        validation_source: "[If validated, by what]"
    confidence: "H/M/L"
    notes: "[Any caveats or context]"
```

## Quality Checks
- [ ] Relevant knowledge holders identified
- [ ] Appropriate methods selected
- [ ] Knowledge captured in structured form
- [ ] Validation attempted
- [ ] Confidence appropriately calibrated

## Connections
- Uses: #001 (Synthesis Question) to identify relevant knowledge
- Feeds into: #201 (Claim Extraction)
- Grounded in: Polanyi (1966), SECI Model (Nonaka & Takeuchi)

## When to Use
- **Required for:** Rigorous+ depths
- **Especially valuable when:**
  - Key knowledge is undocumented
  - Experts available but haven't written things down
  - "Tribal knowledge" suspected
