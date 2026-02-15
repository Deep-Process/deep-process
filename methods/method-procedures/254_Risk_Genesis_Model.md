# 001 - Risk Genesis Model

## Phase
GROUND

## Purpose
Systematically scan six fundamental sources from which ALL risks originate. Instead of searching for risks ad-hoc, use the genesis model as a generative framework - each source PRODUCES risks with predictable characteristics.

## The Six Sources

| Source | Mechanism | Risk Character | Detection Difficulty |
|--------|-----------|---------------|---------------------|
| **Complexity** | Emergent behavior, non-linearity, unpredictable interactions between components | Surprising, novel, hard to reproduce | HIGH - emerges only in combination |
| **Coupling** | Propagation, cascade, shared dependencies, tight feedback loops | Fast-moving, amplifying, chain reactions | MEDIUM - visible in architecture |
| **Uncertainty** | Incomplete information, volatility, unknowable futures | Probabilistic, potentially fat-tailed | VARIES - epistemic is reducible, aleatoric is not |
| **Agency** | Adversarial action, negligence, misaligned incentives, human error | Intentional or negligent, exploits weaknesses | HIGH - adversaries adapt |
| **Temporality** | Erosion, drift, accumulation, decay, technical debt, entropy | Gradual, invisible until threshold, boiling frog | VERY HIGH - each increment is small |
| **Boundaries** | Interface mismatches, handoff failures, translation errors, trust boundaries | Appears at edges between components/teams/phases | HIGH - each side thinks the other handles it |

## Procedure

### Step 1: Source Scan
For each of the six sources, ask: "How does THIS source manifest in THIS project/decision?"

### Step 2: Risk Generation
Generate at least 2 risks per source.
- Empty source = blind spot, investigate harder
- Tag each risk with its genesis source

### Step 3: Response Type Assignment
Genesis determines appropriate response type:

| Source | Recommended Response Type |
|--------|--------------------------|
| Complexity | Build resilience, can't predict specific failure |
| Coupling | Decouple, add circuit breakers, increase slack |
| Uncertainty | Classify (Knight #002) and respond per type |
| Agency | Threat model, align incentives, verify |
| Temporality | Monitor trends not events, set degradation thresholds |
| Boundaries | Explicit contracts, integration tests, shared mental models |

## Output Schema
```yaml
genesis_risks:
  - source: "[Complexity|Coupling|Uncertainty|Agency|Temporality|Boundary]"
    mechanism: "How this source creates risk in this context"
    risk_description: "The specific risk identified"
    detection_difficulty: "[HIGH|MEDIUM|LOW|VARIES]"
    recommended_response_type: "Approach for mitigation"
```

## Quality Checks
- [ ] All six sources examined
- [ ] At least 2 risks per source (or documented justification for empty)
- [ ] Each risk tagged with genesis source
- [ ] Response type assigned based on genesis

## Connections
- Feeds into: #101 (Risk Taxonomy), #201 (5D Scoring)
- Uses output from: Deep-Explore assumptions, Deep-Verify conflicts
- Related to: #002 (Uncertainty Classification), #003 (Perrow Matrix)

## Examples

### Data Pipeline Project
```
Source: Temporality
Mechanism: Schema drift in source systems
Risk: Data quality degrades gradually as upstream schemas evolve without notification
Detection Difficulty: VERY HIGH - each change is minor
Response Type: Monitor trends, set schema validation thresholds
```

### Vendor Integration
```
Source: Boundaries
Mechanism: API contract assumptions
Risk: Our code assumes API returns ISO dates, vendor returns Unix timestamps
Detection Difficulty: HIGH - works in tests, fails in production edge cases
Response Type: Explicit contracts, defensive parsing, integration tests
```
