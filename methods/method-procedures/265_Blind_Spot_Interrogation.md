# 109 - Blind Spot Interrogation

## Phase
IDENTIFY (Horizontal)

## Purpose
Deliberately search for risks the team is psychologically or structurally unable to see. Extended with the Unknown Knowns concept - things the organization knows but denies.

## Blind Spot Categories

| Blind Spot Type | Detection Question | Why It's Hidden |
|-----------------|-------------------|-----------------|
| **Expertise Gap** | What domain knowledge is missing? What would a specialist flag? | Can't see what you don't know |
| **Normalcy Bias** | What are we assuming will continue because it always has? | Comfort with status quo |
| **Success Bias** | What risks are we ignoring because current approach "has always worked"? | Past success blinds to future risk |
| **Proximity Bias** | What risks are we downplaying because they seem distant? | Out of sight, out of mind |
| **Complexity Hiding** | Where is complexity swept under abstractions? | Frameworks hide danger |
| **Incentive Misalignment** | Who benefits from NOT seeing certain risks? | Self-interest distorts perception |
| **Asymmetric Information** | Who knows something we don't? Vendor, client, regulator? | Information silos |
| **Unknown Knowns** | What does the organization KNOW but refuses to acknowledge? | Taboo topics, political danger |
| **Survivorship Bias** | What similar projects failed silently? Learning only from survivors? | Evidence is biased |

## Unknown Knowns (Special Category)

**The most dangerous blind spots** because they are:
- Addressable (someone knows)
- But suppressed (organization denies)

Detection questions:
- "What risk would a departing employee mention in their exit interview but never in a sprint review?"
- "What would get you fired for raising?"
- "What does everyone know but no one says?"
- "What question makes the room uncomfortable?"

## Procedure

### Step 1: Category Walk
Walk through each blind spot type systematically.

### Step 2: Perspective Shift
For each: "Who on the team would be LEAST likely to raise this?"
That's where blind spots live.

### Step 3: Unknown Knowns Probe
Specifically investigate taboo topics and organizational denial.

### Step 4: Adversarial Perspective
"If trying to sabotage this project, what would you exploit?"
The answer reveals blind spots.

### Step 5: External Perspective
"What would an outsider (auditor, new hire, competitor) notice that we've normalized?"

## Output Schema
```yaml
blind_spots:
  - type: "[Expertise|Normalcy|Success|Proximity|Complexity|Incentive|Asymmetric|UnknownKnown|Survivorship]"
    hypothesis: "What might be hidden"
    evidence: "Why we suspect this blind spot exists"
    confidence: "[Low|Medium|High]"
    investigation_needed: "What to do to validate"
    taboo_flag: "[true|false]"
    taboo_reason: "Why this is organizationally sensitive"
    who_would_know: "Who might have information"
    consequences_if_real: "Impact if this blind spot is hiding a real risk"
```

## Quality Checks
- [ ] All blind spot types examined
- [ ] Unknown Knowns specifically probed
- [ ] External perspective considered
- [ ] Taboo topics not avoided
- [ ] Investigation actions defined

## Connections
- Feeds into: #201 (risks discovered here need scoring), #601 (cognitive bias overlap)
- Uses output from: Team composition, organizational context
- Related to: #001 (Agency genesis), #601 (Cognitive Bias Audit)

## Examples

### Expertise Gap
```yaml
type: Expertise
hypothesis: "No one on team deeply understands Spark memory management"
evidence: "Performance issues solved by 'add more memory' not root cause analysis"
confidence: High
investigation_needed: "Bring in Spark specialist for architecture review"
taboo_flag: false
who_would_know: "Databricks solution architect"
consequences_if_real: "OOM crashes under load, unpredictable performance"
```

### Normalcy Bias
```yaml
type: Normalcy
hypothesis: "Assuming vendor pricing will stay constant"
evidence: "Budget based on current pricing, no escalation clause analysis"
confidence: Medium
investigation_needed: "Review contract for price change terms"
taboo_flag: false
who_would_know: "Procurement, vendor account manager"
consequences_if_real: "30-50% cost increase breaking budget"
```

### Unknown Known (Taboo)
```yaml
type: UnknownKnown
hypothesis: "The legacy system has undocumented critical bugs everyone works around"
evidence: "Long-tenure staff know special procedures, never documented"
confidence: High
investigation_needed: "Anonymous survey, exit interview review"
taboo_flag: true
taboo_reason: "Admitting this means admitting years of technical debt was ignored"
who_would_know: "Senior developers who've been here 5+ years"
consequences_if_real: "New team members trigger bugs, knowledge loss on departure"
```

### Incentive Misalignment
```yaml
type: Incentive
hypothesis: "Project manager incentivized to report green status regardless of reality"
evidence: "All reports are green, but engineers express private concerns"
confidence: Medium
investigation_needed: "Skip-level conversation with engineering"
taboo_flag: true
taboo_reason: "Questions PM competence, politically sensitive"
who_would_know: "Engineers, PMO leadership"
consequences_if_real: "Sudden 'surprise' red status when issues can't be hidden"
```

### Complexity Hiding
```yaml
type: Complexity
hypothesis: "The ORM abstracts database complexity that will bite us at scale"
evidence: "N+1 queries visible in logs but no one investigates"
confidence: High
investigation_needed: "Database query analysis under production load"
taboo_flag: false
who_would_know: "DBA, backend engineers"
consequences_if_real: "10-100x latency increase at scale"
```

## Facilitation Techniques

### Anonymous Input
- Anonymous surveys
- Exit interview patterns
- Skip-level conversations
- External consultant interviews

### Psychological Safety
- "What keeps you up at night?"
- "If this fails, what will the post-mortem say was obvious?"
- "What question would you ask if there were no consequences?"

### Adversarial Framing
- "How would a competitor exploit our weaknesses?"
- "How would a malicious insider cause maximum damage?"
- "What would a regulator find in an audit?"
