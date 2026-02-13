# #208 Scale Feasibility

**Phase:** 2 (ASSESS)
**Tier:** 1 — Mandatory
**Purpose:** Assess if it works at PRODUCTION scale

## Theoretical Foundation

The most common false feasibility: "it works in demo" ≠ "it works in production." The gap between proof-of-concept and production is often 10× the PoC effort.

**Key insight:** Some scale jumps are qualitative, not just quantitative. 99.9% uptime requires fundamentally different architecture than "best effort."

## Scale Dimensions

| Dimension | Demo | Production | Typical Gap |
|-----------|------|-----------|-------------|
| **Data volume** | 1K records | 1B records | 1,000,000× |
| **Concurrent users** | 1-5 | 100-10,000 | 1,000× |
| **Uptime requirement** | Best effort | 99.9%+ | Qualitative shift |
| **Error handling** | Happy path | All paths | 10× code complexity |
| **Security** | None/basic | Production-grade | 5-10× effort |
| **Monitoring** | Console logs | Full observability | Separate workstream |
| **Data quality** | Clean test data | Messy real data | Unpredictable |

## Step-by-step

### Step 1: Identify Scale Dimensions

For each dimension relevant to the project:
- What's the demo/PoC level?
- What's the production requirement?
- How big is the gap?

### Step 2: Assess Qualitative Shifts

Some gaps are not just "more" but "fundamentally different":

| Change | Qualitative? | Why |
|--------|-------------|-----|
| 1K → 1M records | Maybe | May hit memory limits |
| 1M → 1B records | Yes | Different architecture needed |
| 99% → 99.9% uptime | Yes | Requires redundancy, failover |
| Single-user → 100 concurrent | Maybe | May need connection pooling |
| Best-effort → SLA | Yes | Requires monitoring, alerting, on-call |

### Step 3: Check What's Been Tested

| Dimension | Demo Level | Production Level | Tested at Prod? |
|-----------|-----------|-----------------|-----------------|
| Data volume | 100K | 100M | No |
| Concurrent queries | 2 | 20 | No |
| Uptime | Dev environment | 99.9% | No |
| Error rate tolerance | 0% (clean data) | <0.1% | No |

### Step 4: Estimate PoC-to-Production Multiplier

| Situation | Multiplier |
|-----------|------------|
| Similar scale done before, same tech | 3× |
| New scale, known patterns | 5× |
| New scale, new patterns | 10× |
| Qualitative shifts present | 10-20× |

```
Example:
PoC effort: 4 weeks
Multiplier: 5× (new scale, known patterns)
Production effort: 20 weeks
```

### Step 5: Score Scale Feasibility

| Score | Criteria |
|-------|----------|
| 5 | Proven at production scale with same tech |
| 4 | Tested at representative scale, minor gaps |
| 3 | Significant scale gap, patterns exist |
| 2 | Large scale gap, qualitative shifts |
| 1 | Untested at scale, fundamental unknowns |

## Output format

```yaml
scale_feasibility:
  score: 3
  confidence: "L"

  dimensions:
    - dimension: "Data volume"
      demo: "1M records"
      production: "100M records"
      gap: "100×"
      qualitative_shift: false
      tested_at_scale: false
      risk: "Medium"
      mitigation: "Validate with production-scale test"

    - dimension: "Concurrent queries"
      demo: "2-3 analysts"
      production: "20 concurrent"
      gap: "10×"
      qualitative_shift: false
      tested_at_scale: false
      risk: "Medium"

    - dimension: "Uptime"
      demo: "Dev environment (best effort)"
      production: "99.9% SLA"
      gap: "Qualitative"
      qualitative_shift: true
      tested_at_scale: false
      risk: "High"
      mitigation: "Design for redundancy, monitoring"

    - dimension: "Data quality"
      demo: "Clean test data"
      production: "Real data with anomalies"
      gap: "Unknown"
      qualitative_shift: true
      tested_at_scale: false
      risk: "High"
      mitigation: "Get sample of real data early"

    - dimension: "Security"
      demo: "Basic authentication"
      production: "Managed identity, audit logging"
      gap: "Significant"
      qualitative_shift: false
      tested_at_scale: false
      risk: "Medium"

  poc_to_production:
    poc_effort: "6 weeks"
    multiplier: 5
    production_effort: "30 weeks"
    basis: "New scale, some known patterns, 2 qualitative shifts"

  validation_needed:
    - "Load test with 100M records"
    - "Concurrent query stress test"
    - "Failure injection testing for 99.9%"
    - "Test with sample of real (messy) data"

  summary:
    gaps_identified: 5
    qualitative_shifts: 2
    tested_at_scale: 0
    validation_plan_needed: true
```

## Integration Points

- **Feeds from:** Requirements (scale targets), #201 Technical (what's been tested)
- **Feeds to:** #401 Overall profile, #302 Assumption testing, #306 Spike

## Common Pitfalls

- **Demo blindness:** "It works!" (at 1/1000 scale)
- **Linear extrapolation:** Assuming 10× data = 10× time
- **Ignoring qualitative shifts:** 99.9% is not "better 99%"
- **Clean data assumption:** Production data is always messier
- **Late scale testing:** Finding scale issues at deployment
