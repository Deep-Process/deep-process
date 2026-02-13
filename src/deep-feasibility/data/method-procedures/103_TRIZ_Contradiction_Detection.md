# #103 TRIZ Contradiction Detection

**Phase:** 1 (CONSTRAIN)
**Tier:** 2 — Standard+ depths
**Purpose:** Find technical and physical contradictions that signal fundamental design conflicts

## Theoretical Foundation

Based on Altshuller's TRIZ (Theory of Inventive Problem Solving, 1946-1985). Contradictions in requirements signal either:
- Fundamental infeasibility (as stated), OR
- Innovation opportunity (if resolved creatively)

**Key insight:** Unresolved contradiction = infeasibility. But TRIZ provides systematic resolution principles.

## Types of Contradictions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONTRADICTION TYPES                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TECHNICAL CONTRADICTION                                                    │
│  ═══════════════════════                                                    │
│  Improving parameter X worsens parameter Y                                  │
│                                                                              │
│  Examples:                                                                  │
│  • "Real-time" vs "batch processing large volumes"                          │
│  • "Fully secure" vs "zero-friction user experience"                        │
│  • "High availability" vs "strong consistency" (CAP theorem)                │
│                                                                              │
│  Resolution: Find way to have both, or prioritize one                       │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHYSICAL CONTRADICTION                                                     │
│  ══════════════════════                                                     │
│  Element must have property A AND NOT-A simultaneously                      │
│                                                                              │
│  Examples:                                                                  │
│  • "Data must be encrypted AND queryable by SQL"                            │
│  • "System must be simple AND comprehensive"                                │
│  • "Pipeline must be idempotent AND exactly-once"                           │
│                                                                              │
│  Resolution: Separation principles or redesign                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## TRIZ Separation Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TRIZ SEPARATION PRINCIPLES                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. SEPARATION IN TIME                                                      │
│     Different properties at different times                                 │
│     Example: "Real-time for recent data, batch for historical"              │
│                                                                              │
│  2. SEPARATION IN SPACE                                                     │
│     Different properties in different locations                             │
│     Example: "Encrypted at rest, decrypted in secure compute enclave"       │
│                                                                              │
│  3. SEPARATION IN SCALE/LEVEL                                               │
│     Different properties at different scales                                │
│     Example: "Simple API surface, complex internal implementation"          │
│                                                                              │
│  4. SEPARATION BY CONDITION                                                 │
│     Different properties under different conditions                         │
│     Example: "Available during reads, consistent during writes"             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: List All Requirements

Extract requirements from scope and specifications:
- Performance requirements
- Security requirements
- Functional requirements
- Quality attributes
- Constraints

### Step 2: Check Requirement Pairs

For each pair of requirements (R1, R2):
- Does satisfying R1 conflict with R2?
- If improving R1, does R2 get worse?
- Does R1 require property A while R2 requires NOT-A?

### Step 3: Classify Contradictions

| R1 | R2 | Type | Notes |
|----|-----|------|-------|
| Real-time updates | Process 10M records | Technical | Speed vs volume |
| Strong consistency | High availability | Technical | CAP theorem |
| Encrypted data | Ad-hoc SQL queries | Physical | A and NOT-A |

### Step 4: Attempt Resolution

For each contradiction, try separation principles:

```
Contradiction: "Real-time" vs "large batch"

Separation in TIME:
  → Stream recent data (last 24h) in real-time
  → Batch historical data overnight
  → Result: RESOLVED

Contradiction: "Strong consistency" vs "High availability"

Separation by CONDITION:
  → Consistent during write transactions
  → Eventually consistent for reads
  → Result: PARTIALLY RESOLVED (check if acceptable)

Separation NOT POSSIBLE (CAP theorem):
  → Cannot have both with partition tolerance
  → Result: UNRESOLVED (H5 if all three required)
```

### Step 5: Classify Resolution Status

| Status | Meaning | Action |
|--------|---------|--------|
| RESOLVED | Separation principle works | Document solution |
| PARTIALLY RESOLVED | Works with caveats | Document caveats, verify acceptable |
| UNRESOLVED | No resolution found | Check if maps to theorem (H5) |

## Output format

```yaml
contradictions:
  - id: "C1"
    r1: "Provide real-time updates to dashboard"
    r2: "Process 10M records per hour"
    type: "Technical"
    conflict: "Latency vs throughput tradeoff"

    resolution_attempted: "Separation in time"
    resolution_method: |
      Stream recent data (last 4 hours) for real-time display.
      Batch historical data with 1-hour delay.
      Dashboard shows: real-time recent + periodic historical.
    resolved: true
    caveats: "Historical data has 1-hour lag"

  - id: "C2"
    r1: "Data encrypted at rest"
    r2: "Synapse serverless can query directly"
    type: "Physical"
    conflict: "Encrypted AND readable simultaneously"

    resolution_attempted: "Separation in space"
    resolution_method: |
      Encrypt in storage layer.
      Decrypt in Synapse compute layer using managed identity.
      Data encrypted at rest, decrypted only during query execution.
    resolved: true
    caveats: "Requires proper key management"

  - id: "C3"
    r1: "Strong consistency across all reads"
    r2: "High availability (99.99%)"
    r3: "Partition tolerance (distributed system)"
    type: "Physical (CAP theorem)"
    conflict: "Cannot have all three per CAP theorem"

    resolution_attempted: "None applicable — fundamental theorem"
    resolved: false
    escalation: "H5 — must choose 2 of 3"
    recommendation: "Choose CP (consistency + partition) or AP (availability + partition)"
```

## Integration Points

- **Feeds from:** Requirements, #003 Scope
- **Feeds to:** #101 Constraint classification (unresolved → H5), design decisions

## Common Pitfalls

- **Missing contradictions:** Not systematically checking all requirement pairs
- **Premature resolution claims:** "We'll figure it out" without specific solution
- **Ignoring theorems:** Trying to resolve what mathematics proves impossible (CAP, FLP)
- **Accepting poor resolutions:** Separation that doesn't really solve the problem
