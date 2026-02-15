# Claude Desktop Integration Guide

This guide shows you how to integrate Deep Process MCP Server with Claude Desktop.

## Prerequisites

- Claude Desktop installed ([Download](https://claude.ai/download))
- Node.js 20+ installed
- One of the following LLM providers:
  - Ollama (free, local) - **Recommended for testing**
  - OpenAI API key
  - Anthropic API key
  - Azure OpenAI endpoint + key

## Step 1: Install Ollama (Recommended)

For the easiest setup, use Ollama for local, free LLM execution:

### macOS

```bash
brew install ollama
```

### Windows/Linux

Download from [ollama.ai](https://ollama.ai/)

### Start Ollama

```bash
ollama serve
```

### Pull a model

```bash
ollama pull llama3
```

## Step 2: Configure Claude Desktop

### Find the Configuration File

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%/Claude/claude_desktop_config.json
```

### Edit the Configuration

Open `claude_desktop_config.json` in a text editor and add:

#### Option A: With Ollama (Local, Free)

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

#### Option B: With OpenAI

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
        "sk-your-openai-api-key-here"
      ]
    }
  }
}
```

> **Security Note**: For production, use environment variables instead of hardcoding API keys.

#### Option C: With Anthropic

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": [
        "deep-process-mcp",
        "--provider",
        "anthropic",
        "--api-key",
        "sk-ant-your-anthropic-api-key-here"
      ]
    }
  }
}
```

#### Option D: With Azure OpenAI

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": [
        "deep-process-mcp",
        "--provider",
        "azure",
        "--endpoint",
        "https://your-resource.openai.azure.com",
        "--api-key",
        "your-azure-openai-key"
      ]
    }
  }
}
```

### Full Configuration Example (Multiple MCP Servers)

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": ["deep-process-mcp"]
    },
    "other-mcp-server": {
      "command": "other-mcp-command",
      "args": ["--some-arg"]
    }
  }
}
```

## Step 3: Restart Claude Desktop

1. **Quit Claude Desktop** completely (not just close the window)
   - macOS: Cmd+Q or Claude Desktop → Quit
   - Windows: Right-click system tray icon → Exit

2. **Verify it's closed**:
   - macOS: Check Activity Monitor (no "Claude" process)
   - Windows: Check Task Manager (no "Claude.exe" process)

3. **Restart Claude Desktop**

## Step 4: Verify Integration

1. Open a new conversation in Claude Desktop

2. Type a message asking Claude to list available tools:
   ```
   What tools do you have access to?
   ```

3. Claude should mention "deep-process" tools including:
   - deep-process:deep-verify
   - deep-process:deep-risk
   - deep-process:deep-architect
   - (and 10 more)

## Step 5: Use Deep Process Workflows

### Example 1: Quick Risk Assessment

```
Use the deep-process:deep-risk tool to assess risks for our cloud migration project.

Context:
- Migrating monolithic e-commerce platform to microservices
- Target platform: Azure
- Timeline: 6 months
- Revenue at stake: $10M annually
- Team: 8 developers

Please use depth=quick for a fast assessment.
```

### Example 2: Architecture Review

```
Use the deep-process:deep-architect tool to design a scalable architecture
for a real-time analytics platform.

Requirements:
- Process 1M events/second
- Sub-100ms query latency
- 99.99% uptime
- Global deployment

Please use depth=comprehensive.
```

### Example 3: Verify Design

```
Use the deep-process:deep-verify tool to verify our microservices architecture.

System:
- 12 microservices
- PostgreSQL for persistent data
- Redis for caching
- Kafka for event streaming
- Deployed on AWS EKS

Please verify both vertical (internal consistency) and horizontal (cross-service) aspects.
```

### Example 4: Compliance Check

```
Use the deep-process:deep-compliance tool to verify GDPR compliance
for our customer data processing.

Context:
- SaaS product serving EU customers
- Process: Email marketing automation
- Data: Names, emails, preferences, behavioral data
- Storage: AWS eu-west-1

Please use depth=standard and identify any gaps.
```

## Troubleshooting

### MCP Server Not Detected

**Symptom**: Claude Desktop doesn't show Deep Process tools

**Solutions**:

1. **Check configuration file syntax**:
   - Ensure JSON is valid (use [jsonlint.com](https://jsonlint.com/))
   - Check for missing commas, quotes, brackets

2. **Verify file path**:
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Windows (PowerShell)
   Get-Content $env:APPDATA\Claude\claude_desktop_config.json
   ```

3. **Check Ollama is running** (if using Ollama):
   ```bash
   ollama list  # Should show installed models
   ```

4. **Verify npx works**:
   ```bash
   npx deep-process-mcp --help
   ```

5. **Check Claude Desktop logs** (Advanced):
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

### Tools Execute But Fail

**Symptom**: Tools are detected but execution fails

**Solutions**:

1. **Check Ollama model is installed**:
   ```bash
   ollama pull llama3
   ```

2. **Verify API key** (for cloud providers):
   ```bash
   # Test OpenAI key
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer sk-your-key"

   # Test Anthropic key
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: sk-ant-your-key" \
     -H "anthropic-version: 2023-06-01"
   ```

3. **Check process directories exist**:
   ```bash
   ls processes/deep-risk/
   ls processes/deep-verify/
   ```

4. **Review error messages** in Claude's response

### Slow Execution

**Symptom**: Tools take a long time to execute

**Solutions**:

1. **Use depth=quick** for faster execution:
   ```
   Use depth=quick instead of standard or comprehensive
   ```

2. **Switch to faster model**:
   ```bash
   # For OpenAI
   npx deep-process-mcp --provider openai --model gpt-3.5-turbo

   # For Ollama (use smaller model)
   ollama pull llama2:7b
   npx deep-process-mcp --model llama2:7b
   ```

3. **Check network connectivity** (for cloud providers)

4. **Increase timeout** if needed

## Advanced Configuration

### Using Environment Variables

Instead of hardcoding API keys:

1. **Set environment variable**:
   ```bash
   # macOS/Linux
   export OPENAI_API_KEY=sk-your-key

   # Windows (PowerShell)
   $env:OPENAI_API_KEY="sk-your-key"
   ```

2. **Update configuration**:
   ```json
   {
     "mcpServers": {
       "deep-process": {
         "command": "npx",
         "args": ["deep-process-mcp", "--provider", "openai"],
         "env": {
           "OPENAI_API_KEY": "${OPENAI_API_KEY}"
         }
       }
     }
   }
   ```

### Custom Model Selection

```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": [
        "deep-process-mcp",
        "--provider",
        "openai",
        "--model",
        "gpt-4-turbo"
      ]
    }
  }
}
```

### Multiple Deep Process Instances

You can configure multiple instances with different providers:

```json
{
  "mcpServers": {
    "deep-process-local": {
      "command": "npx",
      "args": ["deep-process-mcp", "--provider", "ollama"]
    },
    "deep-process-cloud": {
      "command": "npx",
      "args": [
        "deep-process-mcp",
        "--provider",
        "openai",
        "--model",
        "gpt-4o"
      ]
    }
  }
}
```

Then specify which to use:
```
Use the deep-process-local server for a quick risk check
Use the deep-process-cloud server for a comprehensive architecture review
```

## Best Practices

1. **Start with Ollama**: Test locally before using paid APIs
2. **Use depth=quick**: For initial explorations, use quick depth
3. **Provide context**: Include relevant system details in your prompts
4. **Iterate**: Start quick, then go comprehensive if needed
5. **Save outputs**: Copy important analysis results to your documentation

## Examples from Real Usage

### Risk Assessment for Cloud Migration

```
I need to assess risks for our cloud migration project.

Project details:
- Current: Monolithic .NET application on Windows Server
- Target: Microservices on Azure Kubernetes Service (AKS)
- Timeline: 9 months
- Team: 10 developers (5 senior, 5 mid-level)
- Budget: $2M
- Annual revenue at risk: $15M
- Regulatory constraints: GDPR, SOC 2

Please use the deep-process:deep-risk tool with depth=comprehensive to:
1. Identify all major risk categories
2. Score and prioritize risks
3. Suggest mitigation strategies
4. Create a risk register

Focus especially on:
- Technical migration risks
- Team capability gaps
- Timeline viability
- Regulatory compliance risks
```

### Architecture Design for New System

```
Design a scalable architecture for a new real-time bidding platform.

Requirements:
- Handle 100K bids/second peak load
- Sub-10ms bid response time (p95)
- Support 1000+ concurrent auctions
- Process and analyze bid data for ML models
- 99.99% uptime SLA
- Must scale globally (US, EU, APAC)

Constraints:
- Budget: $500K/year infrastructure
- Team: 6 backend engineers, 2 data engineers
- Timeline: 6 months to MVP
- Compliance: CCPA, GDPR (user data)

Please use deep-process:deep-architect with depth=comprehensive to:
1. Design overall system architecture
2. Select technology stack
3. Define data flows
4. Plan scaling strategy
5. Address reliability and disaster recovery
```

## Getting Help

- **Documentation**: [README.md](../README.md)
- **Issues**: https://github.com/your-org/deep-process/issues
- **Discussions**: https://github.com/your-org/deep-process/discussions
- **Email**: support@deep-process.com

## Next Steps

- Review [Available Processes](../README.md#available-tools) documentation
- Try different [execution depths](../README.md#execution-depths)
- Explore [resources and prompts](../README.md#resources)
- Integrate with [other platforms](AZURE-AI-FOUNDRY.md)
