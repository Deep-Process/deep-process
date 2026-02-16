# Deep Process Architecture

**Version:** 2.0.0 (Bootstrap Edition)
**Last Updated:** 2026-02-15
**Status:** Phase 1 - Foundation (Solo Founder, Open Source First)
**Business Model:** Open Source + Professional Services

---

## Table of Contents

- [System Overview](#system-overview)
- [Core Principles](#core-principles)
- [Open Source First Architecture](#open-source-first-architecture)
- [4-Layer Architecture](#4-layer-architecture)
- [MCP Server: Execution-Based Model](#mcp-server-execution-based-model)
- [Data Flow Examples](#data-flow-examples)
- [Key Design Decisions](#key-design-decisions)
- [Deployment Models](#deployment-models)
- [Performance & Cost](#performance--cost)
- [Future Evolution (Optional)](#future-evolution-optional)

---

## System Overview

Deep Process is a **structured workflow execution framework** that transforms LLMs from fast responders into rigorous thinkers. Built as **open-source-first** with revenue from professional services, not product paywalls.

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│  IDE (VS Code, Cursor) + LLM (Claude, Copilot, Gemini)     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP SERVER (stdio)                       │
│  Receives tool calls from LLM, executes workflows           │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXECUTION ENGINE                          │
│  Loads workflows, validates gates, manages LLM calls        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  LLM PROVIDER LAYER                         │
│  OpenAI • Anthropic • Ollama (user pays for their own)     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  PROCESS DEFINITIONS                        │
│  16 Workflows • 195 Methods • Patterns (all open source)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. **Open Source First**
All core functionality is MIT licensed - workflows, methods, patterns, execution engine, MCP server. Revenue comes from **services around the product**, not from the product itself.

### 2. **Execution-Based MCP** (Not Content Delivery)
MCP Server **executes** workflows internally and returns **structured results**. It does NOT expose workflow text to LLM, preventing simple copy-paste attacks while keeping execution transparent.

### 3. **User-Owned Infrastructure**
Users run MCP Server locally or self-host. They pay for their own LLM usage (OpenAI, Claude, or Ollama). No vendor lock-in, no hidden costs.

### 4. **Evidence-Based Execution**
Every finding must have a quote. Every claim must have a source. No hand-waving, no "looks good" - falsifiable conclusions only.

### 5. **Gate-Based Quality Control**
Workflows have binding gates (BLOCKER, CRITICAL, ERROR, REQUIRED). Gates validate that conditions are met before proceeding. If a gate fails, execution stops or scope reduces.

### 6. **Progressive Disclosure**
Load only what's needed when it's needed. Workflows start with minimal context, progressively load steps and methods as execution proceeds.

---

## Open Source First Architecture

### What's Open Source (MIT License)

**Everything Core:**
```
/processes/              # All 16 workflows (markdown)
/methods/                # All 195 method procedures
/packages/core/          # Execution engine (TypeScript)
/packages/mcp-server/    # MCP Server implementation
/docs/                   # All documentation
```

**Why Open Source Everything?**
- ✅ **Adoption** - Developers can try, modify, fork without asking permission
- ✅ **Trust** - No black boxes, all logic inspectable
- ✅ **Community** - Contributors improve patterns, fix bugs, add features
- ✅ **Brand** - "The guy who built Deep Process" > "proprietary secret sauce"

### Revenue Model

**NOT from product paywalls, FROM services:**
1. **Consulting** ($150-300/hour) - Custom process development, integrations
2. **Workshops** ($2K-20K) - Corporate training, certification programs
3. **Speaking** ($5K-20K) - Conferences, corporate events
4. **Sponsors** ($500-$5K/month) - GitHub Sponsors, corporate sponsorships

**Target:** $10K-$30K/month after 18-24 months (solo founder, bootstrap)

---

## 4-Layer Architecture

### Layer 1: Process Layer (Content - 100% Open Source)

**What:** Structured workflows, methods, patterns that define how LLMs think

**Components:**
- **16 Workflows** (`/processes/[process]/workflow.md`)
  - Deep Verify, Deep Explore, Deep Architect, Deep Feasibility, Deep Risk, etc.
  - Each workflow: 500-3,000 lines of structured instructions

- **195 Method Procedures** (`/methods/method-procedures/*.md`)
  - Reusable analytical techniques (First Principles, Contradiction Detection, etc.)
  - Each method: 200-500 lines of detailed procedure

- **Pattern Libraries** (`/processes/[process]/data/pattern-library.yaml`)
  - 50+ base patterns (SQL injection, XSS, React hooks, etc.)
  - Community-contributed patterns (grows over time)

- **Gates** (`/processes/[process]/data/gates.yaml`)
  - Quality control checkpoints (BLOCKER, CRITICAL, ERROR, REQUIRED)
  - Prevent execution without prerequisites

- **Step Files** (`/processes/[process]/steps/*.md`)
  - Granular execution units (step-00-setup.md, step-01-pattern-scan.md, etc.)

**Format:** Markdown + YAML (human-readable, LLM-ingestible, git-trackable)

**License:** MIT - fork it, modify it, sell consulting around it

---

### Layer 2: Execution Layer (Runtime - 100% Open Source)

**What:** Engine that loads workflows, validates gates, executes steps, manages LLM interactions

#### Workflow Executor (`packages/core/src/workflow-executor.ts`)

**Responsibilities:**
1. Load `manifest.yaml` → parse metadata (process name, version, steps, gates)
2. Load `workflow.md` → main process instructions
3. Progressively load `steps/*.md` → granular execution units
4. Execute steps via Provider Layer
5. Validate gates after each step
6. Handle scope reduction if gates fail

**Example Flow:**
```typescript
// Workflow Executor
async function executeWorkflow(processName: string, target: string, mode: string) {
  // 1. Load manifest
  const manifest = await loadManifest(`processes/${processName}/manifest.yaml`);

  // 2. Load workflow
  const workflow = await loadWorkflow(`processes/${processName}/workflow.md`);

  // 3. Initialize execution context
  const context = {
    target,
    mode,
    findings: [],
    gateStatus: {}
  };

  // 4. Execute steps
  for (const step of manifest.steps) {
    // Progressive loading - load step only when needed
    const stepContent = await loadStep(`processes/${processName}/steps/${step}.md`);

    // Execute step via LLM
    const result = await provider.complete({
      messages: [
        { role: 'system', content: workflow },
        { role: 'user', content: stepContent + '\n\nTarget: ' + target }
      ]
    });

    // Parse results
    context.findings.push(...parseFindings(result));

    // Validate gates
    const gatesPassed = await validateGates(manifest.gates, context);
    if (!gatesPassed.blocker) {
      throw new Error('BLOCKER gate failed, stopping execution');
    }
  }

  // 5. Return structured report
  return {
    verdict: calculateVerdict(context.findings),
    score: calculateScore(context.findings),
    findings: context.findings,
    duration: context.duration,
    cost: context.cost
  };
}
```

**Key Features:**
- **Progressive Loading** - Don't load all steps upfront (saves 30-50% tokens)
- **Gate Validation** - After each step, check if conditions met
- **Scope Reduction** - If gate fails, reduce scope or stop execution
- **Provider Abstraction** - Works with any LLM (OpenAI, Claude, Ollama)

---

#### Gate Validator (`packages/core/src/gate-validator.ts`)

**Responsibilities:**
1. Parse `gates.yaml` → load gate definitions
2. Evaluate conditions → check if criteria met
3. Track gate status → OPEN (not met) vs LOCKED (met)
4. Enforce severity:
   - **BLOCKER** - Stop execution immediately
   - **CRITICAL** - Stop but allow override with justification
   - **ERROR** - Log error, continue execution
   - **REQUIRED** - Must pass by end of workflow

**Example Gate:**
```yaml
# processes/deep-verify/data/gates.yaml
- id: gate-verify-03
  severity: BLOCKER
  condition: "Pattern library is loaded and contains at least 10 patterns"
  checkpoint: "After step 1 (PATTERN SCAN)"
  action_on_fail: "STOP - Cannot proceed without pattern library"
```

**Implementation:**
```typescript
interface Gate {
  id: string;
  severity: 'BLOCKER' | 'CRITICAL' | 'ERROR' | 'REQUIRED';
  condition: string;
  checkpoint: string;
  action_on_fail: string;
}

async function validateGates(gates: Gate[], context: ExecutionContext): Promise<GateResults> {
  const results = { blocker: true, critical: true, errors: [] };

  for (const gate of gates) {
    const passed = await evaluateCondition(gate.condition, context);

    if (!passed) {
      switch (gate.severity) {
        case 'BLOCKER':
          results.blocker = false;
          console.error(`BLOCKER gate failed: ${gate.id}`);
          break;
        case 'CRITICAL':
          results.critical = false;
          console.warn(`CRITICAL gate failed: ${gate.id}`);
          break;
        case 'ERROR':
          results.errors.push(gate.id);
          console.error(`ERROR gate: ${gate.id}`);
          break;
      }
    }
  }

  return results;
}
```

---

### Layer 3: Provider Layer (LLM Abstraction - 100% Open Source)

**What:** Unified interface to multiple LLM providers with cost tracking, retry logic, error handling

**Implemented:** ✅ M1.1 Complete (`packages/core/src/providers/`)

**Supported Providers:**
- **OpenAI** (`openai-provider.ts`) - GPT-4, GPT-4o, GPT-3.5
- **Azure OpenAI** (`openai-provider.ts`) - Enterprise deployments
- **Anthropic** (`anthropic-provider.ts`) - Claude 3.5, Claude 4
- **Ollama** (`ollama-provider.ts`) - Local models (Llama, Mistral, CodeLlama)

**Unified Interface:**
```typescript
interface LLMProvider {
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  stream(request: CompletionRequest): AsyncIterable<CompletionChunk>;
  estimateCost(request: CompletionRequest): number;
  healthCheck(): Promise<boolean>;
}

interface CompletionRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface CompletionResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number; // Estimated cost in USD
  model: string;
  provider: string;
}
```

**Why Multi-Provider?**
1. **No Vendor Lock-In** - Users choose their LLM, not forced into one
2. **Cost Optimization** - Route cheap queries to GPT-3.5, complex to GPT-4
3. **Local Models** - Ollama for cost-sensitive users (100% free)
4. **Reliability** - Fallback to alternate provider if primary fails

**User Pays for LLM** - Deep Process doesn't charge for LLM usage, user provides their own API keys

---

### Layer 4: Distribution Layer (MCP Server - 100% Open Source)

**What:** MCP Server exposes Deep Process workflows as MCP tools for LLM integration

**Status:** 📋 M1.4 In Progress (`packages/mcp-server/`)

#### MCP Server Architecture

```typescript
// packages/mcp-server/src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { executeWorkflow } from '@deep-process/core';

const server = new Server({
  name: 'deep-process',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});

// Register tools (auto-generated from manifests)
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'deep-verify',
      description: 'Verify code/documents for correctness',
      inputSchema: {
        type: 'object',
        properties: {
          target: { type: 'string', description: 'File or code to verify' },
          mode: { type: 'string', enum: ['quick', 'standard', 'deep'], default: 'standard' },
          reference: { type: 'string', description: 'Reference document (optional)' }
        },
        required: ['target']
      }
    },
    {
      name: 'deep-explore',
      description: 'Explore a decision systematically',
      inputSchema: {
        type: 'object',
        properties: {
          decision: { type: 'string', description: 'Decision to explore' },
          context: { type: 'string', description: 'Additional context (optional)' }
        },
        required: ['decision']
      }
    },
    // ... 14 more tools for all 16 processes
  ]
}));

// Handle tool execution (EXECUTION-BASED, not content delivery)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // CRITICAL: Execute workflow internally, DON'T expose workflow text
  switch (name) {
    case 'deep-verify':
      const result = await executeWorkflow('deep-verify', args.target, args.mode || 'standard');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2) // Return RESULTS, not workflow
          }
        ]
      };

    case 'deep-explore':
      const exploration = await executeWorkflow('deep-explore', args.decision, 'standard');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(exploration, null, 2)
          }
        ]
      };

    // ... handle other tools
  }
});

// Start server (stdio transport for Claude Desktop)
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## MCP Server: Execution-Based Model

### ❌ Naivny Model (NIE TAK - Ryzyko Kopiowania)

```
Developer: "Zweryfikuj auth.ts"
    ↓
LLM → MCP call: get_workflow("deep-verify")
    ↓
MCP Server returns: [entire workflow.md text - 3000 lines]
    ↓
LLM: Reads workflow, executes
    ↓
Developer: Can see entire workflow in logs/debugger
```

**Problem:** Developer widzi cały workflow, może skopiować. To NIE jest jak działamy.

---

### ✅ Właściwy Model (EXECUTION-BASED)

```
Developer: "Zweryfikuj auth.ts"
    ↓
LLM → MCP call: deep-verify({ target: "auth.ts", mode: "quick" })
    ↓
MCP Server INTERNALLY:
  1. Load workflow.md (developer NIE widzi)
  2. Load pattern-library.yaml (developer NIE widzi)
  3. Execute workflow via internal LLM call
  4. Parse results
  5. Validate gates
    ↓
MCP Server returns: {
  "verdict": "REJECT",
  "score": 7.5,
  "findings": [...],
  "duration_ms": 12500,
  "cost_usd": 0.08
}
    ↓
LLM: Receives ONLY structured results
    ↓
Developer: Sees ONLY the report, NOT the workflow
```

**Kluczowa różnica:**
- MCP Server **wykonuje** proces wewnętrznie
- Zwraca **wyniki**, nie **instrukcje**
- Developer widzi output, nie implementation

---

### Dlaczego To NIE Chroni IP w 100%?

Developer może:
1. Uruchomić deep-verify 100 razy na różnych plikach
2. Obserwować wyniki
3. Reverse engineer podstawową logikę
4. Napisać własną wersję

**ALE:**
- Nie może skopiować 2 lat optymalizacji promptów
- Nie może skopiować execution quality (95% accuracy vs 60% DIY)
- Nie może skopiować community patterns (grows with usage)
- Nie może skopiować brand & trust (case studies, conference talks)

**Ochrona IP:**
- ❌ NIE z "ukrywania kodu" (to open source!)
- ✅ Z execution excellence + brand + community + experience

---

## Data Flow Examples

### Example 1: Deep Verify via MCP (Local Execution)

```
Developer using Claude Desktop:
  "Use deep-verify to check auth.ts for security issues"

┌─────────────────────────────────────────────────────────────┐
│ 1. Claude Desktop                                          │
│    - Parses user request                                   │
│    - Detects MCP tool: deep-verify                         │
│    - Prepares tool call                                    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MCP Server (Local - stdio)                              │
│    - Receives: deep-verify({ target: "auth.ts" })          │
│    - Loads workflow (INTERNAL, not exposed)                │
│    - Loads pattern library (INTERNAL, not exposed)         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Workflow Executor                                       │
│    Step 0: SETUP                                           │
│      - Load pattern library                                │
│      - Validate gate: "Input defined" → PASS               │
│    Step 1: PATTERN SCAN                                    │
│      - Load methods: #071, #154                            │
│      - Scan for patterns: SQL injection, XSS, etc.         │
│      - Validate gates → PASS                               │
│    Steps 2-5: Continue execution...                        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Provider Layer (User's LLM)                             │
│    - Use configured provider (e.g., OpenAI GPT-4)          │
│    - User pays for LLM usage (not Deep Process)            │
│    - Execute each step with workflow + target              │
│    - Track tokens: 3,200 input + 1,500 output              │
│    - Cost: ~$0.18 (user's bill)                            │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. MCP Server Returns Results (NOT workflow)               │
│    {                                                       │
│      "verdict": "REJECT",                                  │
│      "score": 7.5,                                         │
│      "findings": [                                         │
│        {                                                   │
│          "severity": "critical",                           │
│          "pattern": "SQL-001",                             │
│          "message": "SQL injection vulnerability",         │
│          "file": "auth.ts",                                │
│          "line": 45,                                       │
│          "evidence": "Unsanitized user input..."           │
│        }                                                   │
│      ],                                                    │
│      "duration_ms": 12500,                                 │
│      "cost_usd": 0.18                                      │
│    }                                                       │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Claude Desktop → Developer                              │
│    - Shows structured report                               │
│    - Developer sees findings, NOT workflow internals       │
│    - Can act on findings (fix bugs)                        │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Workflow stays internal to MCP Server
- Developer sees only results
- User pays for their own LLM usage
- Execution transparent but implementation hidden

---

### Example 2: Consulting Project (Custom Process Development)

```
Enterprise client: "We need deep-compliance for GDPR"

Week 1: Discovery
  - Consultant (you) meets with client
  - Understands GDPR requirements (50+ specific checks)
  - Reviews existing compliance docs

Week 2: Development
  - Fork deep-verify workflow as base
  - Create custom pattern library (GDPR-specific):
    * Data retention checks
    * Consent management validation
    * Right-to-be-forgotten verification
    * Cross-border transfer compliance
  - Create custom methods:
    * GDPR Article 6 checker (lawful basis)
    * GDPR Article 17 checker (right to erasure)
    * etc.

Week 3: Testing & Iteration
  - Run on client's codebase
  - Tune false positive rate (from 40% → 5%)
  - Add client-specific patterns
  - Document findings format

Week 4: Delivery & Training
  - Deploy custom process (they own it, MIT license)
  - Train team on usage
  - Provide support documentation

Revenue: $15K (2 weeks @ $300/hour × 50 hours)

Client gets:
  - Custom deep-compliance process (theirs to keep)
  - GDPR pattern library (50+ patterns)
  - Documentation and training
  - 30 days support

You get:
  - $15K revenue
  - Case study (with permission)
  - Speaking topic ("How we automated GDPR compliance")
  - Future consulting leads
```

**This is the business model:**
- Open source = marketing & adoption
- Consulting = revenue
- Brand = pricing power

---

## Key Design Decisions

### Decision 1: Why Open Source EVERYTHING?

**Question:** Why not keep workflows proprietary?

**Decision:** MIT license for all processes, workflows, patterns, code

**Rationale:**
- **Adoption > Protection** - More developers using = more consulting opportunities
- **Community > Control** - Contributors improve product faster than solo founder
- **Brand > IP** - "I built Deep Process" > "I have secret sauce"
- **Trust > Obscurity** - Inspectable code = trustworthy (critical for verification tool)

**Revenue Protection:**
- ✅ Execution quality (2 years optimization) - can't copy experience
- ✅ Consulting (custom processes) - services not replicable
- ✅ Brand (conference talks, case studies) - reputation not forkable
- ✅ Community (network effects) - contributors stay with canonical

**Trade-offs:**
- ❌ Competitors can fork - ACCEPTED (brand wins over code)
- ❌ Can't charge for software - ACCEPTED (services > SaaS for solo)
- ❌ No proprietary moat - ACCEPTED (community IS the moat)

**Examples of Success:**
- WordPress (open source) → Automattic ($7.5B valuation)
- GitLab (open core) → $15B company
- Elasticsearch (open core) → Elastic ($10B company)

---

### Decision 2: Why Execution-Based MCP (Not Content Delivery)?

**Question:** Why not just expose workflow text via MCP?

**Decision:** MCP Server executes workflows internally, returns results only

**Rationale:**
- **Reduces copy-paste risk** - Developer sees results, not implementation
- **Better UX** - LLM gets structured data, not 3,000 line markdown
- **Faster execution** - MCP server optimized, no LLM parsing overhead
- **Quality control** - Gates enforced server-side, can't be bypassed

**Still transparent:**
- ✅ All source code on GitHub (can inspect how execution works)
- ✅ Open source license (can modify and self-host)
- ✅ No vendor lock-in (runs locally, no cloud dependency)

**Trade-offs:**
- ⚠️ Slightly more complex to implement (but worth it)
- ⚠️ Can still be reverse engineered (but takes effort)

---

### Decision 3: Why Multi-Provider (Let User Pay for LLM)?

**Question:** Why not bundle LLM costs into SaaS pricing?

**Decision:** User provides their own LLM API keys, pays for usage directly

**Rationale:**
- **No margin on LLM** - Don't mark up tokens (transparency)
- **No cost explosion risk** - User controls their spending
- **Local models supported** - Ollama users pay $0
- **Compliance easier** - Data goes to user's LLM, not our servers
- **Simpler business model** - No need to track/bill LLM usage

**User Benefits:**
- Choose their own provider (OpenAI, Claude, local Ollama)
- Control costs directly
- Data privacy (LLM calls from their machine)
- Works offline (with Ollama)

**Our Benefits:**
- No LLM infrastructure costs
- No compliance burden (no customer data)
- No rate limiting issues
- Simpler architecture (stateless)

---

### Decision 4: Why Bootstrap (Not Venture-Funded)?

**Question:** Why not raise seed round and scale fast?

**Decision:** Bootstrap via consulting, grow organically

**Rationale:**
- **Solo founder** - Easier to stay small & profitable
- **No pressure** - Grow at sustainable pace, no burn rate
- **Full control** - No investors, no board, no dilution
- **Profitable sooner** - Consulting revenue Month 9-12 vs Series A Year 2-3
- **Exit options flexible** - Sell for $1-3M or stay independent

**Trade-offs:**
- ❌ Slower growth (vs VC-funded competitor)
- ❌ No enterprise compliance (SOC 2 too expensive)
- ❌ Can't hire team early (until revenue supports it)

**But:**
- ✅ Sustainable (profitable, not burning cash)
- ✅ Independent (no external pressure)
- ✅ Flexible (can pivot, sell, or stay)

---

## Deployment Models

### Model 1: Local MCP Server (Primary - 100% Free)

```bash
# Install globally
npm install -g @deep-process/mcp-server

# Or use npx (no install)
npx @deep-process/mcp-server

# Configure in Claude Desktop
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": ["@deep-process/mcp-server"]
    }
  }
}

# Configure LLM provider (user's API key)
export OPENAI_API_KEY="sk-..."
# OR
export ANTHROPIC_API_KEY="sk-ant-..."
# OR use Ollama (no API key needed)
```

**Characteristics:**
- ✅ Runs on user's machine
- ✅ User pays for own LLM usage
- ✅ Zero cost to user (open source)
- ✅ Full privacy (no data sent to Deep Process servers)
- ✅ Works offline (with Ollama)

**Target Users:**
- Individual developers
- Small teams (2-10 people)
- Cost-conscious users
- Privacy-sensitive users

---

### Model 2: Self-Hosted (For Teams)

```bash
# Clone repo
git clone https://github.com/deep-process-org/deep-process
cd deep-process

# Install dependencies
pnpm install

# Build packages
pnpm run build

# Run MCP server on team server
node packages/mcp-server/dist/index.js

# Team members connect via network
# (requires custom transport, not stdio)
```

**Characteristics:**
- ✅ Team control & customization
- ✅ Shared patterns & processes
- ✅ Internal deployment (no internet required)
- ✅ Can add custom logging, metrics

**Target Users:**
- Development teams (10-50 people)
- Companies with internal policies
- Custom integration needs

---

### Model 3: Optional SaaS (Future - If Demand Exists)

**Only build if:**
- Community repeatedly asks for it
- You have $20K+ MRR from consulting (proof of demand)
- You're willing to deal with complexity

**What it would offer:**
- CI/CD webhooks (GitHub, Azure DevOps, GitLab)
- Automated PR verification
- Team dashboard
- Audit trail
- Shared pattern library

**Pricing:**
- Simple: $29-$99/month (keep it simple)
- No enterprise features (too complex for solo)

**Why not now:**
- Solo founder - consulting more profitable
- Complexity - hosting, scaling, support, compliance
- Focus - build community first, SaaS later if needed

---

## Performance & Cost

### Latency (Local MCP)

| Component | Latency | Notes |
|-----------|---------|-------|
| Gate Validation | 10-50ms | Local evaluation, no LLM |
| Step Loading | 10-30ms | File I/O from disk |
| LLM Completion (GPT-4) | 2-6s | Depends on output length |
| LLM Completion (Claude) | 1-4s | Generally faster |
| LLM Completion (Ollama) | 500ms-2s | Local, GPU-dependent |
| **Full Workflow (DEEP)** | **30-60 min** | 6 steps, high thoroughness |
| **Full Workflow (QUICK)** | **2-5 min** | Reduced scope |

### Cost (User Pays Directly)

| Workflow | Mode | Tokens (avg) | Cost (GPT-4) | Cost (Claude) | Cost (Ollama) |
|----------|------|--------------|--------------|---------------|---------------|
| Deep Verify | DEEP | 30,000 | $0.90-$1.50 | $0.75-$1.20 | **$0.00** |
| Deep Verify | QUICK | 8,000 | $0.25-$0.40 | $0.20-$0.35 | **$0.00** |
| Deep Explore | STANDARD | 20,000 | $0.60-$1.00 | $0.50-$0.80 | **$0.00** |
| Deep Architect | STANDARD | 25,000 | $0.75-$1.25 | $0.60-$1.00 | **$0.00** |

**Cost Optimization:**
- Use Ollama (local) for free execution
- Progressive loading saves 30-50% tokens
- Cache common patterns (future improvement)
- Route by complexity (simple → cheap model, complex → GPT-4)

---

## Future Evolution (Optional)

### IF Consulting Revenue > $30K/month

**Optional Enhancements:**
1. **Cloud API** (simple SaaS for CI/CD)
   - GitHub/Azure DevOps webhooks
   - Automated PR verification
   - Team dashboard
   - Pricing: $29-99/month

2. **Pattern Marketplace** (community monetization)
   - Users sell custom patterns
   - 70/30 revenue split (creator/platform)
   - Premium industry packs (healthcare, finance, legal)

3. **Certification Program** (additional revenue stream)
   - "Deep Process Certified Consultant"
   - Online courses + exam
   - $500-1,000 per certification

### IF Team Grows (2-3 People)

**Possible Architecture Changes:**
- Add support tier (handle Discord, GitHub issues)
- Add sales/BD (find consulting clients)
- Keep core product 100% open source
- Revenue still from services, not software

### What We WON'T Build (Solo/Small Team)

**Too Complex for Bootstrap:**
- ❌ SOC 2 certification ($100K+ cost)
- ❌ HIPAA compliance (legal complexity)
- ❌ Enterprise SSO/RBAC (engineering time)
- ❌ On-premise deployments (support burden)
- ❌ Multi-tenancy infrastructure (overkill)

**Focus:** Simple, open, profitable services business

---

## References

- [ROADMAP.md](ROADMAP.md) - Strategic vision and timeline (bootstrap path)
- [Provider Abstraction](packages/core/docs/PROVIDERS.md) - LLM provider documentation
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol specification
- [Business Model: BMAD Example](https://bmad.ai) - Similar open-source-first approach

---

**Architecture Owner:** Solo Founder (Bootstrap Path)
**Next Review:** After M1.5 (Community Launch)
**Feedback:** [GitHub Discussions](https://github.com/deep-process-org/deep-process/discussions)
