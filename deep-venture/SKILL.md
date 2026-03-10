---
name: deep-venture
description: >
  Use when user wants to find or create a business opportunity — whether discovering
  market gaps, inventing novel concepts, or both. Combines signal harvesting, gap
  detection, novel synthesis, and revenue architecture into one pipeline.
  Triggers: "find a niche", "what should I build", "business opportunity",
  "invent something", "market gap", "I want to make money with AI".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, WebSearch, WebFetch, Agent]
---

# Deep Venture — Business Opportunity Discovery & Concept Synthesis

Finds what's missing, invents what's next, and validates both — in one pipeline.

## What This Adds (Beyond Native Capability)

- **Builder-first framing**: Every opportunity scored against YOUR skills, resources, and constraints
- **Signal triangulation**: Cross-references forums, job postings, funding, research, regulatory shifts to detect emerging needs
- **Gap matrix + synthesis engine**: Finds gaps AND creates novel combinations from signal intersections
- **AI absorption & adjacent pivot risk**: Filters out opportunities that next model update or a competitor's sprint would kill
- **Revenue-first architecture**: Money flow designed before product, not bolted on after
- **Originality filter**: Rejects "X but for Y" unless the transposition creates genuinely new value

## Anti-Patterns (What This Skill Must NOT Do)

| Forbidden | Why | Instead |
|-----------|-----|---------|
| "AI for X" without specific pain | Every vertical "could use AI" — that's not a business | Find the specific workflow step that's broken |
| Wrapper plays (thin layer over API) | Zero moat, provider kills you with a feature update | Require data moat, domain expertise, or workflow lock-in |
| "X but for Y" without transformation | Lazy pattern matching | Require structural novelty — the combination must create emergent value |
| Vague "AI-powered [noun]" | Not a product, it's a buzzword | Specify exact data flow, exact user action, exact value delivered |
| Ignore builder profile | Best idea for wrong person = failure | Every concept must pass builder-fit check |
| Assume "build it and they will come" | Distribution is 80% of success | Every concept needs a concrete acquisition channel |
| "No competition" from lazy search | Competition always exists — even if it's a spreadsheet | Map ALL alternatives including non-AI workarounds |
| Overestimate market size | "Every company needs this" = 0 customers | Bottom-up sizing only |
| Confuse "no product" with "no solution" | Maybe a prompt + API call already works | Test if the gap requires a PRODUCT or just better prompting |

---

## Procedure

### Step 1: Builder Profile

Capture before anything else. The builder constrains everything downstream.

```
Builder:
  Skills: {primary technical skills}
  Domain knowledge: {industries/verticals they know deeply}
  Solo/Team: {alone or with others}
  Time: {full-time or side-project, hours/week}
  Model preference: {SaaS, marketplace, data product, API, service, hybrid}
  Revenue floor: {minimum monthly to be worth it}
  Revenue ceiling: {target if it works}
  Unfair advantage: {what this person can do that most can't — domain knowledge, access, skills combo}
```

The **unfair advantage** is critical. If there is none, the concept must create one
(e.g., through data accumulation, first-mover in a niche, or process automation
that compounds).

If the user doesn't provide all fields — ask. Do not proceed with assumptions about the builder.

---

### Step 2: Define Search Space

Narrow the exploration domain. Without boundaries, "opportunities" is infinite.

Ask or infer from builder profile + user input:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Vertical** | Which industry or domain? | Healthcare, legal, education, SMB, creator economy, DevOps |
| **Modality** | What type of AI capability? | LLM, vision, voice, agents, multimodal, edge AI |
| **Geography/language** | Global or specific market? | Poland/CEE, LATAM, global English |
| **Timeframe** | Emerging now, 6 months, 1-2 years? | Determines signal maturity |

If the user says "just find me something good" — default to:
- Vertical: cross-industry (horizontal plays)
- Modality: LLM-based (lowest barrier)
- Market: global English + builder's local market as edge
- Timeframe: 3-12 months

Output: **Search Space Definition** — a 1-paragraph scope statement.

---

### Step 3: Signal Harvesting

Collect weak and strong signals from multiple independent sources. Volume first — filtering comes later.

#### 3a. Pain Signal Mining

Search for unmet needs people are already expressing:

| Source | What to look for | Search patterns |
|--------|------------------|-----------------|
| Reddit/HN/forums | "I wish there was...", "Why doesn't X exist?", "I'd pay for..." | `site:reddit.com "I wish" AI {vertical}`, `site:news.ycombinator.com "doesn't exist" AI` |
| Twitter/X | Complaints about manual workflows, broken tooling | `"someone should build" AI`, `"why is there no" AI {vertical}` |
| Job postings | New roles that imply missing tools | `"AI {role}" site:linkedin.com`, roles with "manual" or "spreadsheet" in description |
| GitHub Issues | Feature requests on popular AI tools never addressed | Top repos in vertical → Issues labeled "enhancement" with most thumbs-up |
| ProductHunt/alternatives | Products with high interest but low ratings | "AI {vertical}" sorted by interest, read complaints |
| App store reviews | 1-2 star reviews on existing AI tools | "{vertical} AI" app reviews mentioning "missing", "can't", "wish" |

For each source, extract:
```
Signal: {what people are asking for}
Source: {URL or reference}
Volume: {how many independent mentions}
Intensity: {mild wish vs. desperate need}
Existing alternatives: {what they're using now, if anything}
```

#### 3b. Supply-Side Gap Detection

Analyze what exists and what's missing:

| Method | How |
|--------|-----|
| **Competitor mapping** | Search `{vertical} AI tool/platform/service` → list top 10-20 → map features → find white spaces |
| **Adjacent category scan** | What exists for neighboring verticals that doesn't exist for this one? |
| **Workflow decomposition** | Map the end-to-end workflow in the vertical → which steps have no AI tooling? |
| **Integration gaps** | Popular tools in the vertical → which have no AI-powered integrations? |
| **Pricing gaps** | Enterprise solutions exist but nothing for SMB/solo? Or vice versa? |

#### 3c. Capability Frontier

What is NEWLY possible (last 6-12 months) that wasn't before?
- New APIs, protocols, platforms (MCP, function calling, multimodal, long-context)
- Cost drops (what was $1/query is now $0.01)
- Open-source releases that democratize previously gated capabilities
- Hardware shifts (local inference, edge AI, browser ML)

#### 3d. Macro Trend Signals

| Signal type | Where to find |
|-------------|---------------|
| **Regulatory changes** | New laws requiring compliance (AI Act, DORA, sector-specific) → creates tooling demand |
| **Technology inflection** | New model capabilities → enables previously impossible products |
| **Funding patterns** | What VCs are funding → what's the next layer of the stack that's missing |
| **Research → product gaps** | Papers with high citations but no product implementation |
| **Platform shifts** | New APIs/platforms → ecosystem gaps |
| **Proven revenue patterns** | Not "could make money" — IS making money. Indie hackers with public revenue, transparent SaaS metrics. |

Output: **Raw Signal List** — minimum 15-20 signals, unsorted.

---

### Step 4: Clustering & Synthesis

Two parallel tracks: find gaps AND invent new combinations.

#### 4a. Gap Clustering

Group raw signals into opportunity clusters:

```
Cluster: {descriptive name}
Signals: [{list of contributing signals}]
Core unmet need: {1 sentence}
Who feels the pain: {specific persona, not "businesses"}
Current workaround: {what they do today without this}
Why now: {what changed that makes this solvable/urgent now}
```

**Pattern detection rules:**
- 3+ independent signals from different sources → real pattern
- Pain + timing + no existing solution → hot opportunity
- Pain + existing bad solutions → disruption opportunity
- New capability + old workflow → automation opportunity

#### 4b. Novel Synthesis

Apply these methods to signal intersections — create what doesn't exist yet:

**Method 1: Capability Collision**
Take 2 capabilities from Step 3c that haven't been combined yet.
Ask: "What product becomes possible ONLY when both exist?"

**Method 2: Revenue Model Transplant**
Take a proven revenue model from Domain A.
Ask: "Where does this model create 10x value if applied to Domain B?"

**Method 3: Demand Inversion**
Take a demand pressure point from Step 3d.
Ask: "Instead of solving this problem, what if we LEVERAGED it as an asset?"

**Method 4: Friction Arbitrage**
Find a process where friction creates measurable cost.
Ask: "If this friction dropped to zero, what new behavior would emerge? Can we capture value from THAT behavior?"

**Method 5: Data Compound**
Ask: "What data, if accumulated over time, becomes exponentially more valuable?
Can we build a product that generates this data as a byproduct of its core use?"

For each method, generate 2-3 raw concepts. Merge with gap clusters where they overlap.

#### 4c. Merge & Deduplicate

Combine gap clusters and synthesized concepts. Some synthesized concepts will fill identified gaps — link them. Discard isolated signals that don't cluster.

Output: **8-15 raw opportunities** (mix of gaps found and concepts invented).

---

### Step 5: Scoring & Kill Filter

Score each opportunity on 8 dimensions. Be brutally honest — most ideas fail on at least one.

| Dimension | Weight | Score 1-5 | Criteria |
|-----------|--------|-----------|----------|
| **Demand evidence** | 20% | | 1=theoretical, 3=forum posts, 5=people actively paying for workarounds |
| **Competition vacuum** | 15% | | 1=crowded, 3=weak players, 5=genuinely nothing exists |
| **Defensibility (moat)** | 15% | | 1=trivially copyable, 3=data/network effect possible, 5=deep technical moat |
| **AI absorption resistance** | 15% | | 1=next model update kills this, 3=product layer needed, 5=cannot be solved by a general model alone |
| **Adjacent pivot risk** | 15% | | 1=established player ships this in weeks, 3=requires significant effort, 5=no adjacent player can absorb this |
| **Timing** | 10% | | 1=too early, 3=good window, 5=perfect moment |
| **Builder fit** | 5% | | 1=skills mismatch + years to learn, 3=some gaps fillable, 5=perfect match to builder profile |
| **Revenue clarity** | 5% | | 1=unclear who pays, 3=obvious buyer, 5=buyer + clear pricing + willingness to pay |

**Weighted score = Σ(weight × score)**

**AI Absorption Risk — how to evaluate:**

The core question: "Could the next foundation model update make this product irrelevant overnight?"

| Score | Meaning | Examples |
|-------|---------|---------|
| 1 | Will be absorbed | Generic summarization, basic code gen, simple translation, general Q&A chatbots |
| 2 | Likely absorbed | Content rewriting, generic email drafters, simple document parsers |
| 3 | Partially resistant | Models are a component but significant product engineering needed (integrations, workflows, UX) |
| 4 | Mostly resistant | Requires domain-specific data, regulatory knowledge, or multi-system integration |
| 5 | Fully resistant | Requires proprietary data pipelines, physical-world coupling, regulatory certification |

**Adjacent Pivot Risk — how to evaluate:**

The core question: "Is there an established company that could ship this as a feature update in 1-3 months?"

| Score | Meaning | Examples |
|-------|---------|---------|
| 1 | Trivial pivot | Adding AI summarization to Slack, adding AI search to Notion |
| 2 | Easy pivot | CRM adding AI lead scoring, PM tool adding AI planning |
| 3 | Moderate effort | Would need new competency, data, or regulatory domain. 3-6 month effort |
| 4 | Hard pivot | Fundamentally change business model or build entirely new infrastructure |
| 5 | No adjacent player | No company has the combination of domain, data, distribution, and capability |

**How to identify adjacent threats:**
1. List top 5-10 companies in the same ecosystem (same buyer, same workflow, same vertical)
2. For each: score on Domain expertise, Technical capability, Data access, Distribution, Incentive to enter
3. If ANY company scores 4/5 → Adjacent Pivot Risk ≤ 2
4. Search for: "{competitor} AI roadmap", "{competitor} AI announcement", "{vertical} AI features"

**Moat types to evaluate:**
- Data moat: Does usage generate proprietary data that improves the product?
- Network effect: Does each user make it better for others?
- Switching cost: Once adopted, is it painful to leave?
- Domain expertise: Does building this require deep vertical knowledge?
- Speed/execution: First mover with good execution can build brand loyalty
- Regulatory moat: Compliance requirements create barriers to entry

**Kill criteria** (auto-reject if ANY is true):
- Score 1 on Demand evidence
- Score 1 on Competition vacuum
- Score 1 on AI absorption resistance
- Score 1 on Adjacent pivot risk AND the adjacent player has announced AI features
- Score 1 on Builder fit
- Combined weighted score < 2.5

Output: **Scored Opportunity Table**, sorted by weighted score. Top 3-5 survive.

---

### Step 6: Deep Dive — Top Opportunities

For each surviving opportunity (top 3-5):

#### 6a. Originality Verification

For synthesized concepts:
- [ ] Does this exist? (Search thoroughly — non-English markets too)
- [ ] Is this "X but for Y" or structurally novel?
- [ ] Does the combination create emergent value (> sum of parts)?
- [ ] Would this be obvious to anyone looking at the same signals?

For gap-based opportunities:
- Check AngelList/Crunchbase for stealth startups
- Check recent YC/accelerator batches
- Search patent filings
- Check if big players have announced anything adjacent
- Search non-English markets

Result: **Competition dossier** — "confirmed vacuum" or "actually, these exist: ..."

#### 6b. Market Sizing (Bottom-Up)

Do NOT use TAM/SAM/SOM hand-waving. Bottom-up only:

```
1. Who exactly is the buyer? → {persona}
2. How many of them exist? → {number with source}
3. What would they pay monthly/annually? → {price point with reasoning}
4. What % would realistically adopt in year 1? → {conversion rate}
5. Year 1 revenue estimate = count × price × adoption rate
```

#### 6c. Revenue Architecture

Design the money flow FIRST:

```
Revenue architecture:
  Who pays: {specific persona, not "companies"}
  Why they pay: {pain avoided or gain achieved, in dollars}
  How they pay: {subscription, usage, transaction, data access}
  Price point: {with reasoning}
  Unit economics: {cost to serve 1 customer vs revenue from 1 customer}
  Path to floor: {how to reach revenue floor with how many customers}
  Path to ceiling: {what needs to be true to reach revenue ceiling}
  Acquisition channel: {how the FIRST 10 customers find this}
```

If revenue architecture doesn't work on paper → kill the concept.

#### 6d. AI Absorption Analysis

```
## AI Absorption Analysis: {opportunity name}

### Current model capability
What can today's best models already do in this space?
→ {description}

### 12-month model trajectory
Based on announced research directions, what will models likely do in 12 months?
→ {description}

### What the PRODUCT does that the MODEL cannot
- Integration: {specific systems, APIs, data sources}
- Data: {proprietary/domain data the model doesn't have}
- Workflow: {multi-step processes, approvals, handoffs}
- Regulatory: {certifications, audit trails, compliance}
- Trust: {verification, guarantees, liability}

### Absorption timeline estimate
- {X months} until models can do 50% of this natively
- {X months} until models can do 80%
- NEVER for: {aspects that cannot be absorbed}

### Verdict
[ ] SAFE — core value is in the system, not the model
[ ] AT RISK — need to build non-model value fast
[ ] DEAD ON ARRIVAL — this is a capability gap, not a product opportunity
```

#### 6e. Adjacent Player Threat Assessment

```
## Adjacent Player Threat: {opportunity name}

### Adjacent player map
| Company | Domain | Tech | Data | Distribution | Incentive | Pivot effort | Threat |
|---------|--------|------|------|-------------|-----------|-------------|--------|
| {name}  | {1-5}  | {1-5}| {1-5}| {1-5}       | {1-5}     | {weeks/mo}  | {L/M/H}|

### Signals of intent
For each HIGH threat player, search for:
- Recent AI feature announcements
- Job postings suggesting AI capability building
- Patent filings, research papers
- Partnerships with AI providers
- Acquisitions of startups in adjacent spaces

### Speed-to-feature estimate
- Could top adjacent player ship basic version in < 4 weeks? → {yes/no}
- Would it satisfy 80% of the market? → {yes/no}
- What would they NOT build that a dedicated product would? → {list}

### Defensive positioning
If adjacent players CAN pivot quickly:
- What must you build FIRST that they cannot easily replicate?
- What distribution channel can you own that they don't control?
- Can you partner WITH them instead of competing?

### Verdict
[ ] LOW RISK — no adjacent player can pivot quickly
[ ] MEDIUM RISK — players could pivot but need 3-6 months
[ ] HIGH RISK — established player could ship this in weeks
[ ] PARTNER PLAY — better to build FOR adjacent players
```

#### 6f. Build & Moat Timeline

```
MVP scope: {minimum feature set to test demand}
MVP timeline: {weeks/months}
Time to defensibility: {when does the moat start forming}
Risk window: {period where you're vulnerable to fast followers}
```

#### 6g. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Big tech builds this | HIGH | ? | Speed, niche focus, switching costs |
| Foundation model absorbs the need | HIGH | ? | Build value in data/integrations/workflow |
| Adjacent player ships as feature | HIGH | ? | Speed, deeper domain, partnership |
| Demand was illusory | HIGH | ? | Pre-sell, waitlist, LOIs before building |
| Tech doesn't work well enough | MEDIUM | ? | Prototype fast, test core assumption |
| Regulatory blockers | MEDIUM | ? | Research before building |
| Can't monetize | MEDIUM | ? | Validate willingness to pay early |

---

### Step 7: Stress Test

For each surviving concept (target: top 3):

- **The "So What" test**: If I described this to a stranger, would they say "oh, interesting" (bad) or "wait, where do I sign up?" (good)?
- **The "Why Now" test**: What specific event/shift makes this possible/necessary TODAY but not 2 years ago?
- **The "Why You" test**: Why is THIS builder the right person, vs. a well-funded team?
- **The "Day 2" test**: After launch excitement fades, why do users come back?
- **The "10x Better" test**: Is this 10x better than the current workaround, or just 2x? (2x = not enough to change behavior)

---

### Step 8: Validation Playbook

For the #1 opportunity, produce a concrete validation plan:

```
## Validation Plan: {opportunity name}

### Hypothesis
{1 sentence: "We believe {persona} will pay {$X/mo} for {solution} because {reason}"}

### Pre-Build Validation (Week 1-2)
1. Landing page test: {describe the page, CTA, what to measure}
2. Community outreach: {which forums/communities to post in}
3. Expert interviews: {who to talk to, 3-5 people}
4. Competitor deep-check: {final search patterns}

### MVP Scope (Week 3-6)
- Core feature 1: {description}
- Core feature 2: {description}
- NOT in MVP: {explicitly list what to cut}
- Tech stack recommendation: {based on speed + builder fit}

### Success Metrics
- Validation passed if: {specific numbers — signups, LOIs, usage}
- Pivot signal: {what would tell you to change direction}
- Kill signal: {what would tell you to abandon this}

### Go-to-Market Seed
- First 10 customers: {where to find them}
- Distribution channel: {organic, paid, community, partnerships}
- Pricing: {freemium, trial, direct pricing — with reasoning}
```

---

### Step 9: Final Report

```
## Deep Venture Report: {search space}

### Executive Summary
{2-3 sentences: what was found/invented, top recommendation}

### Builder Profile Summary
{Key constraints and advantages}

### Opportunity Ranking

| # | Opportunity | Type | Score | Demand | Vacuum | Moat | AI Risk | Adj. Risk | Builder Fit | Key Insight |
|---|------------|------|-------|--------|--------|------|---------|-----------|-------------|-------------|
| 1 | ...        | gap/invented | X.X | X | X | X | X | X | X | ... |
| 2 | ...        | gap/invented | X.X | X | X | X | X | X | X | ... |
| 3 | ...        | gap/invented | X.X | X | X | X | X | X | X | ... |

### #1 Recommendation: {name}
{Why this one. What makes it special. Honest assessment of biggest risk.}

### Concept Card

#### One-liner
{What it is in 12 words or less}

#### The Insight
{What non-obvious truth makes this work? One paragraph.}

#### How It Works
{User flow in 3-5 steps}

#### Revenue Architecture
{From Step 6c}

#### Why Now
{Specific trigger — not "AI is growing"}

#### Why This Builder
{Specific skill/advantage match from builder profile}

#### Build Plan
  MVP: {what to build first — 2-4 weeks scope}
  Validate: {how to test demand before building more}
  Scale trigger: {what signal means "go bigger"}

#### Biggest Risk
{The single thing most likely to kill this}

#### Honest Assessment
{Probability of reaching revenue floor in 6 months: X%}
{Probability of reaching revenue ceiling in 24 months: X%}

### Rejected Opportunities
{Brief note on each rejected cluster/concept and why}

### What Was NOT Explored
{Verticals, modalities, geographies, or signals out of scope}

### Recommended Next Steps
1. {Concrete action 1}
2. {Concrete action 2}
3. {Concrete action 3}
```

---

## Output Format

The full deliverable is the Step 9 report, supported by data from all prior steps.
Intermediate outputs (signal list, clusters, scores) should be preserved for reference
but the user gets the final synthesis first.

## Counter-Checks

Before finalizing, verify:

- [ ] Does every opportunity pass builder-fit? (Not just "good idea" — good idea FOR THIS BUILDER)
- [ ] Is demand evidence based on real signals, not reasoning about what "should" exist?
- [ ] Did you search for competition in non-obvious places (non-English markets, adjacent verticals)?
- [ ] Did you honestly score moat potential — or inflate it because the idea is exciting?
- [ ] Is timing grounded in specific events/trends, not vague "AI is growing"?
- [ ] Did you assess AI absorption risk for every opportunity?
- [ ] Did you map adjacent players for every opportunity?
- [ ] Is the revenue architecture designed FIRST, not bolted on?
- [ ] Is the "Why Now" grounded in a specific event, not a vague trend?
- [ ] Does the validation plan test the RISKIEST assumption first?
- [ ] Is every synthesized concept NOVEL (not a known gap or existing product)?
- [ ] Is the acquisition channel concrete (not "post on Reddit and hope")?
- [ ] Did you kill enough concepts? (If all survived, your filter is broken)
- [ ] Would the builder actually ENJOY working on this? (Sustainability matters)
- [ ] Would YOU pay for this? Would someone you know? If neither, demand score ≤ 2
- [ ] Are you recommending the BEST opportunity, or just the most interesting one?

---

## Forge Integration

When running inside Forge pipeline:

**Record findings as ideas:**
```bash
python -m core.ideas add {project} --data '[{
  "title": "{opportunity name}",
  "category": "business-opportunity",
  "description": "{1-para summary}",
  "source": "deep-venture analysis",
  "priority": "HIGH|MEDIUM|LOW",
  "metadata": {
    "venture_score": X.X,
    "opportunity_type": "gap|invented|hybrid",
    "demand_evidence": "{key signal}",
    "competition_status": "vacuum|weak|emerging",
    "moat_type": "{primary moat}",
    "ai_absorption_risk": "SAFE|AT_RISK|DOA",
    "adjacent_pivot_risk": "LOW|MEDIUM|HIGH",
    "adjacent_threats": "{top 1-2 companies}",
    "builder_fit": X,
    "validation_status": "unvalidated"
  }
}]'
```

**Record risks:**
```bash
python -m core.risks add {project} --data '[{
  "title": "{risk name}",
  "description": "{what could go wrong}",
  "linked_entity_type": "idea",
  "linked_entity_id": "{I-NNN}",
  "severity": "HIGH|MEDIUM|LOW",
  "likelihood": "HIGH|MEDIUM|LOW",
  "mitigation_plan": "{proposed mitigation}"
}]'
```

**Record key decisions:**
```bash
python -m core.decisions add {project} --data '[{
  "task_id": "DISCOVERY",
  "type": "strategy",
  "issue": "Which opportunity to pursue",
  "recommendation": "{#1 pick}",
  "reasoning": "{from scoring + deep dive}",
  "alternatives": ["{#2}", "{#3}"],
  "confidence": "MEDIUM",
  "decided_by": "claude",
  "status": "OPEN"
}]'
```

**Record exploration artifacts:**
```bash
python -m core.explorations add {project} --data '[{
  "idea_id": "{I-NNN}",
  "exploration_type": "business",
  "summary": "{key conclusion}",
  "findings": ["{signal 1}", "{signal 2}"],
  "options": [{"name": "...", "pros": ["..."], "cons": ["..."], "recommendation": "GO|NO-GO"}],
  "open_questions": ["{unresolved}"],
  "recommendation": "{overall}"
}]'
```

**Record lessons:**
```bash
python -m core.lessons add {project} --data '[{
  "category": "market-insight",
  "title": "{key insight}",
  "detail": "{why this matters}",
  "task_id": "DISCOVERY",
  "severity": "important",
  "applies_to": "deep-venture, business-discovery",
  "tags": ["deep-venture", "{vertical}"]
}]'
```
