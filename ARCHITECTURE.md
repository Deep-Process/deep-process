# Deep Process Architecture

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Status:** Phase 1 - MCP Integration Layer (20% Complete)

---

## Table of Contents

- [System Overview](#system-overview)
- [Core Principles](#core-principles)
- [4-Layer Architecture](#4-layer-architecture)
- [Process Layer](#process-layer)
- [Execution Layer](#execution-layer)
- [Provider Layer](#provider-layer)
- [Distribution Layer](#distribution-layer)
- [Data Flow Examples](#data-flow-examples)
- [Key Design Decisions](#key-design-decisions)
- [Future Architecture Evolution](#future-architecture-evolution)

---

## System Overview

Deep Process is a **structured workflow execution framework** that transforms LLMs from fast responders into rigorous thinkers. The architecture is designed around four core layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    DISTRIBUTION LAYER                       │
│  CLI • VS Code Extension • Claude Plugin • MCP Server       │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROVIDER LAYER                          │
│  OpenAI • Anthropic (Claude) • Ollama • Azure OpenAI        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                          │
│  Workflow Executor • Gate Validator • Step Processor        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROCESS LAYER                           │
│  16 Workflows • 195 Methods • Pattern Libraries • Gates     │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Single Source of Truth
All process definitions live in `/processes/`. Distribution packages (CLI, VS Code, MCP) reference these at build time, never duplicate content.

### 2. Multi-Provider by Design
No vendor lock-in. Abstract LLM providers behind a unified interface. Users can switch between OpenAI, Claude, or local models (Ollama) without changing workflows.

### 3. Evidence-Based Execution
Every finding must have a quote. Every claim must have a source. No hand-waving, no "looks good" - falsifiable conclusions only.

### 4. Gate-Based Quality Control
Workflows have binding gates (BLOCKER, CRITICAL, ERROR, REQUIRED). Gates validate that conditions are met before proceeding. If a gate fails, execution stops or scope reduces.

### 5. Bounded Execution
Processes are designed to finish in known time. No infinite loops, no "let me think about this forever" - structured steps with clear exit criteria.

### 6. Progressive Disclosure
Load only what's needed when it's needed. Workflows start with minimal context, progressively load steps and methods as execution proceeds.

---

## 4-Layer Architecture

### Layer 1: Process Layer (Content)

**What:** The structured workflows, methods, patterns, and gates that define how LLMs think

**Components:**
- **16 Workflows** (`/processes/[process]/workflow.md`) - Deep Verify, Deep Explore, Deep Architect, etc.
- **195 Method Procedures** (`/methods/method-procedures/*.md`) - Reusable analytical techniques
- **Pattern Libraries** (`/processes/[process]/data/pattern-library.yaml`) - Known failure modes, impossibility patterns
- **Gates** (`/processes/[process]/data/gates.yaml`) - Quality control checkpoints
- **Step Files** (`/processes/[process]/steps/*.md`) - Granular execution steps

**Format:** Markdown + YAML (human-readable, version-controllable, LLM-ingestible)

**Single Source of Truth:** All processes live here. Distribution packages reference, never duplicate.

---

### Layer 2: Execution Layer (Runtime)

**What:** The engine that loads workflows, validates gates, executes steps, and manages LLM interactions

#### Workflow Executor (M1.3 - In Progress)

**Responsibilities:**
1. Load `manifest.yaml` → parse workflow metadata (process name, version, steps, gates)
2. Load `workflow.md` → main process instructions
3. Progressively load `steps/*.md` → granular execution units
4. Execute steps sequentially via Provider Layer
5. Validate gates after each step
6. Handle scope reduction if gates fail

**Key Features:**
- **Progressive Loading:** Don't load all steps upfront (reduces token usage)
- **Gate Validation:** After each step, check if gates are satisfied
- **Scope Reduction Protocol:** If gate fails, reduce scope or stop execution
- **State Management:** Track execution progress, step outputs, gate status

**Example Flow:**
```
1. Load manifest.yaml → Deep Verify, 6 steps, 12 gates
2. Load workflow.md → Overview and commandments
3. Execute Step 0 (SETUP) → Load pattern library, set intensity
4. Validate Gate 0 → "Input must be defined" (BLOCKER)
5. Execute Step 1 (PATTERN SCAN) → Load method procedures, scan for patterns
6. Validate Gates 1-3 → Pattern library loaded, findings format valid
7. Continue through steps 2-5...
8. Generate final report
```

#### Gate Validator (M1.2 - Next)

**Responsibilities:**
1. Parse `gates.yaml` → load gate definitions (BLOCKER, CRITICAL, ERROR, REQUIRED)
2. Evaluate conditions → check if gate criteria are met
3. Track gate status → OPEN (not met) vs LOCKED (met)
4. Enforce gate severity:
   - **BLOCKER:** Stop execution immediately if failed
   - **CRITICAL:** Stop execution but allow override with justification
   - **ERROR:** Log error, continue execution
   - **REQUIRED:** Must pass by end of workflow

**Example Gate:**
```yaml
- id: gate-verify-03
  severity: BLOCKER
  condition: "Pattern library is loaded and contains at least 10 patterns"
  checkpoint: "After step 1 (PATTERN SCAN)"
  action_on_fail: "STOP - Cannot proceed without pattern library"
```

#### Step Processor

**Responsibilities:**
1. Load step markdown (`step-01-pattern-scan.md`)
2. Inject method procedures if referenced (e.g., "Use method #071 First Principles Analysis")
3. Format prompt for LLM (combine step instructions + context + methods)
4. Execute via Provider Layer
5. Parse LLM response
6. Extract findings, scores, verdicts

---

### Layer 3: Provider Layer (LLM Abstraction)

**What:** Unified interface to multiple LLM providers with cost tracking, retry logic, and error handling

#### Provider Abstraction (`@deep-process/core/providers`)

**Implemented:** ✅ M1.1 Complete

**Supported Providers:**
- **OpenAI** (`openai-provider.ts`) - GPT-4, GPT-4o, GPT-3.5
- **Azure OpenAI** (`openai-provider.ts`) - Enterprise deployments
- **Anthropic** (`anthropic-provider.ts`) - Claude 3.5, Claude 4
- **Ollama** (`ollama-provider.ts`) - Local models (Llama, Mistral, CodeLlama)

**Unified Interface:**
```typescript
interface LLMProvider {
  complete(request: CompletionRequest): Promise<CompletionResponse>
  stream(request: CompletionRequest): AsyncIterable<CompletionChunk>
  estimateCost(request: CompletionRequest): number
  healthCheck(): Promise<boolean>
}
```

**Key Features:**
- **Cost Estimation:** Track token usage and estimate cost based on official pricing
- **Automatic Retry:** Exponential backoff for transient failures
- **Rate Limit Handling:** Respect `retry-after` headers, queue requests
- **Streaming Support:** All providers support streaming responses
- **Error Hierarchy:** Typed errors (InitError, CompletionError, RateLimitError, AuthError)

**Why Multi-Provider?**
1. **No Vendor Lock-In:** Users can switch providers without changing workflows
2. **Cost Optimization:** Route cheap queries to GPT-3.5, complex ones to GPT-4 or Claude
3. **Reliability:** Fallback to alternate provider if primary fails
4. **Compliance:** Some enterprises require on-premise (Ollama) or specific cloud (Azure)

**Provider Registry:**
```typescript
// Centralized provider management
const registry = new ProviderRegistry({
  default: { provider: 'openai', model: 'gpt-4' },
  tenants: {
    'enterprise-a': { provider: 'azure-openai', model: 'gpt-4', deployment: 'prod' },
    'cost-sensitive': { provider: 'ollama', model: 'llama3' }
  }
})

// Automatic provider selection
const provider = registry.getProvider('enterprise-a') // Returns Azure OpenAI
```

---

### Layer 4: Distribution Layer (User Interface)

**What:** Multiple ways to invoke Deep Process workflows (CLI, VS Code, Claude Plugin, MCP Server)

#### CLI Package (`deep-process`)

**Status:** ✅ Production Ready

**Installation:**
```bash
npx deep-process init
```

**Usage:**
```bash
deep-process verify src/api/ --against docs/spec.md
deep-process explore "Should we migrate to microservices?"
deep-process architect "Design a notification service"
```

**Features:**
- Universal installer (detects AI tools, generates config for 11+ tools)
- File copying to `_deep-process/` in project
- Config generation for Claude Code, Gemini CLI, Cursor, Continue, GitHub Copilot, etc.
- Non-interactive mode for CI/CD

**Why CLI?**
- Works everywhere (Windows, macOS, Linux)
- Integrates with existing CI/CD pipelines
- No IDE dependency
- Offline capable (with Ollama)

#### VS Code Extension

**Status:** ✅ Production Ready

**Features:**
- Configuration UI (detect installed tools, select processes)
- Chat participant: `@deep-process /verify`, `@deep-process /explore`
- Status bar integration (shows installation status)
- Marketplace distribution

**Why VS Code Extension?**
- Native integration for 50M+ VS Code users
- Leverages GitHub Copilot chat UI
- Familiar UX for developers
- Auto-updates via Marketplace

#### Claude Code Plugin

**Status:** ✅ Live on Marketplace

**Installation:**
```bash
claude plugin install deep-process
```

**Usage:**
```
/deep-process:deep-verify Check src/api/
/deep-process:deep-explore Should we use Redis?
```

**Why Claude Plugin?**
- Native Claude integration
- No file copying (processes loaded dynamically)
- Slash command UX
- Low friction installation

#### MCP Server (M1.4 - In Progress)

**Status:** 🚧 Weeks 5-8

**Installation (planned):**
```bash
npx deep-process mcp-server start
```

**Supported Clients:**
- Claude Desktop
- Azure AI Foundry
- GitHub Copilot (via MCP support)
- LiteLLM
- Any MCP-compatible client

**Why MCP?**
- Emerging standard (backed by Anthropic, Azure, GitHub)
- One integration → many tools
- Composable with other MCP servers (file system, web search, etc.)
- Future-proof as AI platforms standardize

**MCP Tools (Auto-Generated from Manifests):**
```json
{
  "tools": [
    {
      "name": "deep-verify",
      "description": "Verify code/documents for correctness",
      "inputSchema": { "type": "object", "properties": { "target": "string", ... } }
    },
    {
      "name": "deep-explore",
      "description": "Explore a decision systematically",
      "inputSchema": { ... }
    },
    // ... 14 more tools for all 16 processes
  ]
}
```

---

## Data Flow Examples

### Example 1: Deep Verify Execution (CLI)

```
User Command:
  $ deep-process verify src/api/auth.ts --against docs/security-spec.md

┌─────────────────────────────────────────────────────────────┐
│ 1. CLI Layer (packages/cli)                                │
│    - Parse arguments: target=auth.ts, reference=spec.md    │
│    - Load config: deep-process.config.yaml                 │
│    - Select provider: OpenAI GPT-4                         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Execution Layer (packages/core)                         │
│    - Load manifest: processes/deep-verify/manifest.yaml    │
│    - Load workflow: processes/deep-verify/workflow.md      │
│    - Initialize Workflow Executor                          │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Step 0: SETUP                                           │
│    - Load pattern library: data/pattern-library.yaml       │
│    - Validate Gate 0: "Input defined" (BLOCKER) → PASS     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Step 1: PATTERN SCAN                                    │
│    - Load step: steps/step-01-pattern-scan.md              │
│    - Load methods: #071 First Principles, #154 Contradiction│
│    - Execute via Provider Layer                            │
│    - Validate Gates 1-3 → PASS                             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Provider Layer (packages/core/providers)                │
│    - Format prompt: workflow + step + methods + context    │
│    - Call OpenAI API: gpt-4 completion                     │
│    - Track tokens: input=3,200, output=1,500               │
│    - Estimate cost: $0.096 (input) + $0.090 (output) = $0.186│
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Steps 2-5: TARGETED, ADVERSARIAL, VERDICT, REPORT       │
│    - Continue execution through remaining steps             │
│    - Validate gates after each step                        │
│    - Accumulate findings with exact quotes                 │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Final Output                                            │
│    - Generate structured report                            │
│    - Verdict: REJECT / UNCERTAIN / ACCEPT                  │
│    - Score: 7.5 (numeric severity)                         │
│    - Findings: CRITICAL (2), IMPORTANT (3), MINOR (1)      │
│    - Cost: $1.23 total                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 2: Deep Explore via MCP Server

```
User (in Claude Desktop):
  "Use deep-explore to help me decide: should we migrate to microservices?"

┌─────────────────────────────────────────────────────────────┐
│ 1. Claude Desktop                                          │
│    - Detects MCP tool: deep-explore                        │
│    - Sends request to MCP Server (stdio)                   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MCP Server (packages/mcp-server)                        │
│    - Receives: { tool: "deep-explore", input: "migrate..." }│
│    - Load manifest: processes/deep-explore/manifest.yaml   │
│    - Initialize Workflow Executor                          │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Execution Layer                                         │
│    - Execute Deep Explore workflow (7 steps)               │
│    - Step 1: Separate facts from assumptions               │
│    - Step 2: Discover decision dimensions                  │
│    - Step 3: Map consequences                              │
│    - Step 4: Premortem analysis                            │
│    - Step 5: Bias checks                                   │
│    - Step 6: Fear resolution                               │
│    - Step 7: Decision readiness                            │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Provider Layer                                          │
│    - Use configured provider (e.g., Claude 4)              │
│    - Stream responses back to MCP Server                   │
│    - Track cost: $2.45 total                               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. MCP Server → Claude Desktop                             │
│    - Stream structured output back                         │
│    - KEY DISCOVERIES: 3 strategic clusters identified      │
│    - FEAR RESOLUTION: 2 false walls, 1 true uncertainty    │
│    - READINESS: Ready to decide on approach, need research │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### Decision 1: Why Multi-Provider?

**Question:** Why not just use one LLM provider (e.g., OpenAI)?

**Decision:** Abstract all providers behind unified interface

**Rationale:**
- **No Vendor Lock-In:** Users can switch providers without rewriting workflows
- **Cost Optimization:** Route simple queries to cheap models (GPT-3.5), complex to GPT-4/Claude
- **Compliance:** Some enterprises require Azure (data residency), others need on-premise (Ollama)
- **Reliability:** Fallback to alternate provider if primary has outage
- **Future-Proof:** New providers (Gemini, Llama 4) can be added without changing core

**Trade-offs:**
- **Complexity:** Need provider abstraction layer (268 lines of interface code)
- **Testing Overhead:** Must test against 3+ providers
- **Lowest Common Denominator:** Can't use provider-specific features (e.g., Claude's system messages require special handling)

**Alternatives Considered:**
- ❌ OpenAI-only: Rejected due to vendor lock-in
- ❌ Plugin system: Rejected due to complexity (providers are core, not plugins)
- ✅ Unified interface with provider-specific implementations

---

### Decision 2: Why Gate-Based Execution?

**Question:** Why not just run all steps sequentially without gates?

**Decision:** Enforce quality gates (BLOCKER, CRITICAL, ERROR, REQUIRED) between steps

**Rationale:**
- **Quality Control:** Prevent garbage-in-garbage-out (e.g., can't scan for patterns without loading pattern library)
- **Early Exit:** Stop execution if critical failure detected (save tokens/cost)
- **Scope Reduction:** If gate fails, reduce scope instead of failing entirely
- **Auditability:** Gates create audit trail of what was validated when

**Example:**
```yaml
# Gate: Pattern library must be loaded before scanning
- id: gate-verify-01
  severity: BLOCKER
  condition: "Pattern library loaded and contains at least 10 patterns"
  checkpoint: "After step 0 (SETUP)"
  action_on_fail: "STOP - Cannot proceed without pattern library"
```

**Trade-offs:**
- **Complexity:** Need gate validation engine (M1.2)
- **Rigidity:** Can't skip steps even if user wants to
- **Overhead:** Checking gates adds latency (~100-200ms per gate)

**Alternatives Considered:**
- ❌ No gates: Rejected - too risky, no quality control
- ❌ Manual gates (user approval): Rejected - interrupts flow, friction
- ✅ Automated binding gates with scope reduction

---

### Decision 3: Why Progressive Step Loading?

**Question:** Why not load the entire workflow upfront?

**Decision:** Load steps progressively as execution proceeds

**Rationale:**
- **Token Efficiency:** Don't load all 6 steps (15K+ tokens) if execution fails at step 2
- **Faster Start:** Begin execution immediately with just workflow.md (~2K tokens)
- **Reduced Cost:** Save ~30-50% on tokens for workflows that exit early
- **Better UX:** User sees output faster (streaming from step 1)

**Example:**
```
Traditional (load all upfront):
  Load: workflow.md + step-00.md + step-01.md + ... + step-05.md
  Tokens: 18,000
  Time to first output: 8 seconds

Progressive loading:
  Load: workflow.md only (2K tokens)
  Execute step 0, load step-00.md (3K tokens) → output at 2 seconds
  Execute step 1, load step-01.md (3K tokens) → output at 4 seconds
  ...
  Total tokens if early exit at step 2: 8K (56% savings)
```

**Trade-offs:**
- **Complexity:** Need step loader with lazy loading
- **Context Loss:** LLM doesn't see future steps (can't optimize across entire workflow)

**Alternatives Considered:**
- ❌ Load all upfront: Rejected - inefficient for early exits
- ❌ Load nothing (LLM figures it out): Rejected - too unreliable
- ✅ Progressive loading with explicit step boundaries

---

### Decision 4: Why MCP Integration?

**Question:** Why invest in MCP protocol vs custom integrations?

**Decision:** Build MCP server as primary integration layer (M1.4)

**Rationale:**
- **Emerging Standard:** Backed by Anthropic (Claude), Microsoft (Azure AI Foundry), GitHub (Copilot)
- **One Integration → Many Tools:** MCP server works with all MCP-compatible clients
- **Composability:** MCP servers can call other MCP servers (file system + web search + deep-process)
- **Future-Proof:** As AI platforms standardize, MCP becomes lingua franca

**Timeline:**
- 2024: MCP protocol announced (Anthropic)
- 2025: Azure AI Foundry, GitHub Copilot add MCP support
- 2026: **Adoption inflection point** (predicted)
- 2027+: MCP becomes standard (predicted)

**Trade-offs:**
- **Risk:** MCP protocol could fail to gain adoption (mitigated by custom integrations as fallback)
- **Breaking Changes:** Protocol still evolving (need version pinning)
- **Documentation:** Limited examples, need to pioneer best practices

**Alternatives Considered:**
- ❌ Custom integrations only: Rejected - doesn't scale to 11+ tools
- ❌ Wait for MCP maturity: Rejected - first-mover advantage
- ✅ MCP primary + custom integrations as fallback

---

### Decision 5: Why File-Based Process Definitions?

**Question:** Why markdown + YAML instead of code (TypeScript/Python)?

**Decision:** All processes defined in markdown + YAML, no code

**Rationale:**
- **Human-Readable:** Non-developers can read, understand, and contribute to processes
- **LLM-Ingestible:** Markdown is ideal for LLM consumption (no parsing complexity)
- **Version Control:** Git tracks changes, diffs are human-readable
- **Composability:** Processes can reference other processes, methods can be injected
- **No Build Step:** Change markdown → immediately usable (no compilation)

**Example:**
```markdown
# Step 1: Pattern Scan

Use the pattern library in `data/pattern-library.yaml` to scan the target for:
- Definitional contradictions (Pattern DC-*)
- Impossibility claims (Pattern IM-*)
- Vocabulary drift (Pattern VC-*)

Use method #071 (First Principles Analysis) and #154 (Contradiction Detector).

Output format: JSON array of findings with exact quotes.
```

**Trade-offs:**
- **Type Safety:** No compile-time validation (mitigated by schema validation)
- **Execution Control:** Can't use programming constructs (loops, conditionals) directly
- **Debugging:** Harder to debug than code (mitigated by structured outputs)

**Alternatives Considered:**
- ❌ TypeScript/Python DSL: Rejected - developer-only, not LLM-friendly
- ❌ JSON schemas: Rejected - not human-readable
- ✅ Markdown + YAML with schema validation

---

## Future Architecture Evolution

### Phase 2: Cloud API Platform (Q2-Q3 2026)

**New Components:**

```
┌─────────────────────────────────────────────────────────────┐
│                      WEB LAYER (NEW)                        │
│  REST API • GraphQL (optional) • WebSocket (streaming)      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  AUTH & TENANCY (NEW)                       │
│  Multi-tenant isolation • RBAC • SSO (SAML, OAuth)          │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   STORAGE LAYER (NEW)                       │
│  Workflow history • Artifact storage • Search (Elasticsearch)│
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               EXISTING EXECUTION LAYER                      │
│  Workflow Executor • Gate Validator • Provider Abstraction  │
└─────────────────────────────────────────────────────────────┘
```

**Key Architectural Changes:**
1. **Multi-Tenancy:** Org-level isolation, per-tenant provider configs
2. **Audit Logging:** Every workflow execution logged with user, timestamp, cost
3. **Cost Tracking:** Per-org usage tracking, billing integration
4. **Horizontal Scaling:** Queue-based execution (RabbitMQ/SQS), stateless workers
5. **Caching:** Deduplicate identical requests (30-50% cost savings)

---

### Phase 3: Enterprise Platform (Q4 2026+)

**New Components:**

```
┌─────────────────────────────────────────────────────────────┐
│                   COMPLIANCE LAYER (NEW)                    │
│  SOC 2 • HIPAA • GDPR • FedRAMP compliance enforcement      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                ORCHESTRATION LAYER (NEW)                    │
│  Multi-process workflows • Conditional execution • Retry    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  MARKETPLACE LAYER (NEW)                    │
│  Custom processes • Community contributions • Revenue share │
└─────────────────────────────────────────────────────────────┘
```

**Key Architectural Changes:**
1. **RBAC v2:** Team hierarchies, fine-grained permissions, approval workflows
2. **On-Premise Deployment:** Docker/Kubernetes for regulated industries
3. **Process Orchestration:** Chain multiple processes (Explore → Feasibility → Architect → Verify)
4. **Custom Processes:** Marketplace for industry-specific workflows
5. **AI Trainer:** Use Deep Process outputs to fine-tune custom models

---

## Performance Characteristics

### Latency (Phase 1)

| Component | Latency | Notes |
|-----------|---------|-------|
| Gate Validation | 100-200ms | Per gate, local evaluation |
| Step Loading | 50-100ms | File I/O from disk |
| LLM Completion (GPT-4) | 3-8s | Depends on output length |
| LLM Completion (Claude) | 2-6s | Generally faster than GPT-4 |
| LLM Completion (Ollama) | 1-3s | Local, GPU-dependent |
| Full Workflow (Deep Verify DEEP) | 30-60 min | 6 steps, high thoroughness |
| Full Workflow (Deep Verify QUICK) | 3-5 min | Reduced scope |

### Cost (Phase 1)

| Workflow | Mode | Tokens (avg) | Cost (GPT-4) | Cost (Claude) | Cost (Ollama) |
|----------|------|--------------|--------------|---------------|---------------|
| Deep Verify | DEEP | 30,000 | $0.90-$1.50 | $0.75-$1.20 | $0.00 |
| Deep Verify | QUICK | 8,000 | $0.25-$0.40 | $0.20-$0.35 | $0.00 |
| Deep Explore | STANDARD | 20,000 | $0.60-$1.00 | $0.50-$0.80 | $0.00 |
| Deep Architect | STANDARD | 25,000 | $0.75-$1.25 | $0.60-$1.00 | $0.00 |

**Optimization Strategies:**
- Use Ollama (local) for cost-sensitive workloads
- Cache common patterns (30-50% token savings)
- Progressive loading (skip unused steps)
- Route by complexity (simple → GPT-3.5, complex → GPT-4)

---

## References

- [Provider Abstraction Documentation](packages/core/docs/PROVIDERS.md)
- [Process Design Guide](docs/process-design.md)
- [Methods Implementation Plan](docs/methods-implementation-plan.md)
- [ROADMAP.md](ROADMAP.md) - Strategic vision and timeline

---

**Architecture Owner:** Deep Process Core Team
**Next Review:** 2026-03-15
**Feedback:** [GitHub Issues](https://github.com/deep-process-org/deep-process/issues)
