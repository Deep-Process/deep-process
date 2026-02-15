# @deep-process/mcp-server

**Model Context Protocol (MCP) Server for Deep Process**

Exposes all 13 Deep Process workflows as MCP tools, resources, and prompts compatible with Claude Desktop, Azure AI Foundry, LiteLLM, and other MCP-compatible platforms.

## Features

- ✅ **13 Process Tools**: All Deep Process workflows exposed as MCP tools
- ✅ **Multi-Provider Support**: OpenAI, Anthropic, Azure OpenAI, AWS Bedrock, Ollama, Gemini
- ✅ **Resources**: Access to process metadata, workflows, gates, and pattern libraries
- ✅ **Prompts**: Pre-configured templates for common use cases
- ✅ **Stdio Transport**: Direct integration with Claude Desktop
- ✅ **Structured Output**: YAML-formatted data blocks with markdown sections
- ✅ **Gate Validation**: Quality checkpoints with automatic verification
- ✅ **Scope Reduction**: User approval for critical gate failures

## Installation

### Global Installation

```bash
npm install -g @deep-process/mcp-server
```

### Local Installation

```bash
npm install @deep-process/mcp-server
```

### Usage with npx (no installation needed)

```bash
npx @deep-process/mcp-server
```

## Quick Start

### 1. Start the MCP Server

#### With Ollama (local, free)

```bash
npx deep-process-mcp
```

> **Note**: Requires [Ollama](https://ollama.ai/) running locally (`ollama serve`)

#### With OpenAI

```bash
npx deep-process-mcp --provider openai --api-key sk-...
```

#### With Anthropic Claude

```bash
npx deep-process-mcp --provider anthropic --api-key sk-ant-...
```

#### With Azure OpenAI

```bash
npx deep-process-mcp --provider azure --endpoint https://your-resource.openai.azure.com --api-key your-key
```

### 2. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": ["deep-process-mcp"]
    }
  }
}
```

For OpenAI provider:

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": [
        "deep-process-mcp",
        "--provider",
        "openai",
        "--api-key",
        "sk-..."
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop. You should now have access to all 13 Deep Process workflows!

## Available Tools

All 13 Deep Process workflows are available as MCP tools:

| Tool | Description | Use Case |
|------|-------------|----------|
| `deep-process:deep-verify` | Vertical + horizontal verification | Verify architecture, designs, requirements |
| `deep-process:deep-risk` | 6-phase risk assessment | Comprehensive risk analysis |
| `deep-process:deep-architect` | Solution design workflow | Design scalable architectures |
| `deep-process:deep-feasibility` | Technical feasibility analysis | Evaluate project viability |
| `deep-process:deep-explore` | Discovery and investigation | Explore domains, technologies |
| `deep-process:deep-synthesis` | Integration and composition | Synthesize complex solutions |
| `deep-process:deep-document` | Documentation generation | Generate structured docs |
| `deep-process:deep-diagram` | Visual architecture | Create system diagrams |
| `deep-process:deep-challenge` | Adversarial review | Challenge assumptions, find gaps |
| `deep-process:deep-governance` | Governance framework | Establish decision structures |
| `deep-process:deep-orchestration` | Multi-process orchestration | Coordinate complex workflows |
| `deep-process:deep-compliance` | Regulatory compliance | Verify GDPR, HIPAA, SOC2, etc. |

## Tool Arguments

Each tool accepts the following arguments:

```typescript
{
  input: string;       // Required: User request or context to analyze
  depth?: string;      // Optional: Execution depth (quick/standard/comprehensive/critical)
  contextFiles?: string[]; // Optional: Context files to include
}
```

### Execution Depths

- **quick**: 1-2 hours, top-level analysis, top 10 items
- **standard** (default): Half day, comprehensive analysis
- **comprehensive**: 1-2 days, deep analysis with all optional steps
- **critical**: Multi-day, includes stability analysis and META audit

## Usage Examples

### Example 1: Quick Risk Assessment

In Claude Desktop, after configuration:

```
Use the deep-process:deep-risk tool to assess risks for our cloud migration project.
We're migrating a monolithic e-commerce platform to microservices on Azure.
Timeline is 6 months, $10M annual revenue at stake.
Use depth=quick.
```

### Example 2: Architecture Review

```
Use the deep-process:deep-architect tool to design a scalable architecture
for a real-time analytics platform processing 1M events/second.
Use depth=comprehensive.
```

### Example 3: Compliance Verification

```
Use the deep-process:deep-compliance tool to verify GDPR compliance
for our customer data processing workflows. We handle EU customer data
for marketing and sales purposes.
Use depth=standard.
```

### Example 4: Verification

```
Use the deep-process:deep-verify tool to verify our microservices architecture
is ready for AWS deployment. We have 12 services, PostgreSQL database, and Redis cache.
Use depth=standard.
```

## Resources

The MCP server exposes the following resources:

### Process List

```
deep-process://processes
```

Returns JSON with all available processes and descriptions.

### Process Details

```
deep-process://process/{processId}
```

Returns detailed process metadata including version, workflow file, agent name, etc.

### Workflow

```
deep-process://process/{processId}/workflow
```

Returns the complete workflow description in Markdown.

### Quality Gates

```
deep-process://process/{processId}/gates
```

Returns the gates.yaml file defining quality checkpoints.

### Pattern Libraries

```
deep-process://patterns/{processId}
```

Returns industry-specific patterns (for deep-risk, deep-architect, deep-feasibility).

### Theoretical Foundations

```
deep-process://foundations/deep-risk
```

Returns the theoretical framework (six risk genesis sources for deep-risk).

## Prompts

Pre-configured prompts for common scenarios:

### Quick Risk Check

```
Prompt: deep-process:quick-risk-check
Arguments:
  - feature: Description of feature or change
  - timeline: Expected timeline
```

### Architecture Review

```
Prompt: deep-process:architecture-review
Arguments:
  - system: System description
  - scale: Expected scale (users, TPS, data)
```

### Compliance Check

```
Prompt: deep-process:compliance-check
Arguments:
  - regulation: Target regulation (GDPR, HIPAA, etc.)
  - scope: Scope of compliance check
```

## CLI Reference

```bash
npx deep-process-mcp [options]

Options:
  -p, --provider <type>      LLM provider (openai, anthropic, azure, bedrock, ollama, gemini)
                             Default: ollama

  -m, --model <name>         Default model name
                             Examples: gpt-4o, claude-3-5-sonnet, llama3

  -e, --endpoint <url>       API endpoint (for Ollama or Azure OpenAI)
                             Example: http://localhost:11434

  -k, --api-key <key>        API key (for OpenAI, Anthropic, Azure)
                             Can also use OPENAI_API_KEY, ANTHROPIC_API_KEY env vars

  -h, --help                 Show this help message
```

### Environment Variables

- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `AZURE_OPENAI_KEY`: Azure OpenAI API key

## Integration Guides

### Claude Desktop

1. Install the MCP server globally or configure to run via npx
2. Edit `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "deep-process": {
         "command": "npx",
         "args": ["deep-process-mcp"]
       }
     }
   }
   ```
3. Restart Claude Desktop
4. Use tools in conversations

### Azure AI Foundry

1. Package the MCP server as a Docker container
2. Deploy to Azure Container Instances
3. Register in Azure AI Foundry MCP catalog
4. Configure MCP endpoint in AI Foundry

### LiteLLM

1. Start the MCP server with stdio transport
2. Configure LiteLLM to load MCP tools:
   ```python
   from litellm import completion

   response = completion(
     model="gpt-4",
     messages=[{"role": "user", "content": "Use deep-verify..."}],
     tools=[...] # MCP tools loaded from server
   )
   ```

### VS Code with GitHub Copilot

1. Configure GitHub Copilot to use MCP server
2. Access Deep Process workflows via Copilot chat

## Output Format

All tools return structured output with:

### YAML Data Blocks

```yaml
# Extracted structured data
subject: Cloud Migration Project
boundaries: Azure cloud environment
timeframe: 6 months
stakes: $10M annual revenue
```

### Markdown Sections

```markdown
## RISK_GENESIS_SCAN

- **Source**: Complexity
  - **Risks**: Technical debt, integration challenges
- **Source**: Coupling
  - **Risks**: Service dependencies, data coupling
```

### Assumptions

```yaml
- Assumption: Azure provides 99.9% SLA
- Assumption: Migration can be done incrementally
```

### Gate Results

```yaml
Gate: GATE_0 (GROUND_COMPLETE)
Status: OPEN
Passed: true
```

## Troubleshooting

### MCP Server Not Starting

1. Check if Ollama is running (if using Ollama provider):
   ```bash
   ollama serve
   ```

2. Verify API keys are set (for cloud providers):
   ```bash
   echo $OPENAI_API_KEY
   echo $ANTHROPIC_API_KEY
   ```

3. Check logs in stderr output

### Claude Desktop Not Detecting MCP Server

1. Verify `claude_desktop_config.json` syntax
2. Check file path is correct
3. Restart Claude Desktop completely (quit and reopen)
4. Check Activity Monitor (macOS) or Task Manager (Windows) to ensure Claude is fully closed

### Tool Execution Fails

1. Check provider configuration
2. Verify model name is correct
3. Check API key has sufficient quota
4. Review process directories exist (`processes/{processId}/`)

### Performance Issues

1. Use `depth=quick` for faster execution
2. Switch to faster model (e.g., gpt-3.5-turbo instead of gpt-4o)
3. Use local Ollama for cost-free execution

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Server (stdio)                       │
├─────────────────────────────────────────────────────────────┤
│  Tools        │  Resources         │  Prompts               │
│  13 processes │  Process metadata  │  Pre-configured        │
│               │  Workflow files    │  templates             │
│               │  Gate definitions  │                        │
│               │  Pattern libraries │                        │
├─────────────────────────────────────────────────────────────┤
│              Workflow Executor (core)                       │
│  - Manifest loading                                         │
│  - Progressive step execution                               │
│  - Gate validation                                          │
│  - Output collection                                        │
├─────────────────────────────────────────────────────────────┤
│            Provider Abstraction (core)                      │
│  OpenAI │ Anthropic │ Azure │ Bedrock │ Ollama │ Gemini    │
└─────────────────────────────────────────────────────────────┘
```

## Development

### Build from Source

```bash
git clone https://github.com/your-org/deep-process.git
cd deep-process/packages/mcp-server
pnpm install
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Run in Development Mode

```bash
pnpm dev  # Watch mode
pnpm start  # Run server
```

## License

MIT

## Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Support

- **Issues**: https://github.com/your-org/deep-process/issues
- **Discussions**: https://github.com/your-org/deep-process/discussions
- **Email**: support@deep-process.com

## Roadmap

- [ ] HTTP transport (in addition to stdio)
- [ ] SSE transport for real-time progress
- [ ] Tool execution metrics and monitoring
- [ ] Custom process registration
- [ ] Multi-tenant support
- [ ] Web UI for configuration

## Changelog

### v1.0.0 (2026-02-15)

- ✅ Initial release
- ✅ 13 process tools
- ✅ Multi-provider support (OpenAI, Anthropic, Azure, Bedrock, Ollama, Gemini)
- ✅ Resources (processes, workflows, gates, patterns)
- ✅ Prompts (quick-risk-check, architecture-review, compliance-check)
- ✅ CLI with stdio transport
- ✅ Claude Desktop integration
- ✅ Comprehensive documentation

---

**Built by the Deep Process team** • [GitHub](https://github.com/your-org/deep-process) • [Documentation](https://deep-process.com/docs)
