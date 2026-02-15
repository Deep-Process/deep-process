# LiteLLM Integration Guide

This guide shows how to integrate Deep Process MCP Server with [LiteLLM](https://github.com/BerriAI/litellm), enabling access to Deep Process workflows through LiteLLM's unified API.

## Overview

LiteLLM provides a unified interface to 100+ LLM providers and supports loading MCP (Model Context Protocol) tools. By integrating Deep Process MCP Server with LiteLLM, you can:

- Use Deep Process workflows across any LLM provider
- Access tools through LiteLLM's Python SDK
- Integrate with LiteLLM proxy for centralized management
- Track costs and usage across all providers

## Prerequisites

- Python 3.8+
- LiteLLM installed (`pip install litellm`)
- Node.js 20+ (for MCP server)
- `@deep-process/mcp-server` installed globally or via npx

## Setup

### Step 1: Install Dependencies

```bash
# Install LiteLLM
pip install litellm

# Install Deep Process MCP Server
npm install -g @deep-process/mcp-server

# Or use npx (no install needed)
npx @deep-process/mcp-server --help
```

### Step 2: Start MCP Server

```bash
# Option 1: With Ollama (free, local)
deep-process-mcp --provider ollama

# Option 2: With OpenAI
deep-process-mcp --provider openai --api-key sk-...

# Option 3: With Anthropic
deep-process-mcp --provider anthropic --api-key sk-ant-...
```

## Integration Methods

### Method 1: Direct Tool Calling (Python SDK)

```python
from litellm import completion
import subprocess
import json

# Load MCP tools from Deep Process server
def load_deep_process_tools():
    """Load MCP tool definitions from Deep Process server"""
    # Start MCP server in subprocess
    process = subprocess.Popen(
        ['npx', '@deep-process/mcp-server', '--provider', 'ollama'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # Send list tools request (MCP protocol)
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/list"
    }

    process.stdin.write(json.dumps(request).encode() + b'\n')
    process.stdin.flush()

    # Read response
    response = json.loads(process.stdout.readline())

    # Convert MCP tools to LiteLLM format
    tools = []
    for tool in response['result']['tools']:
        tools.append({
            "type": "function",
            "function": {
                "name": tool['name'],
                "description": tool['description'],
                "parameters": tool['inputSchema']
            }
        })

    return tools, process

# Load tools
deep_process_tools, mcp_process = load_deep_process_tools()

# Use with LiteLLM
response = completion(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": "Assess risks for our cloud migration project. We're migrating to Azure, 6-month timeline, $10M at stake."
        }
    ],
    tools=deep_process_tools,
    tool_choice="auto"
)

# Process tool calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        tool_name = tool_call.function.name
        tool_args = json.loads(tool_call.function.arguments)

        print(f"Tool called: {tool_name}")
        print(f"Arguments: {tool_args}")

        # Execute tool via MCP server
        tool_request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": tool_args
            }
        }

        mcp_process.stdin.write(json.dumps(tool_request).encode() + b'\n')
        mcp_process.stdin.flush()

        tool_response = json.loads(mcp_process.stdout.readline())
        print(f"Tool result: {tool_response['result']['content'][0]['text']}")

# Cleanup
mcp_process.terminate()
```

### Method 2: LiteLLM Proxy with MCP Tools

#### Step 1: Create Proxy Configuration

Create `litellm_config.yaml`:

```yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: gpt-4
      api_key: os.environ/OPENAI_API_KEY

  - model_name: claude-3-5-sonnet
    litellm_params:
      model: claude-3-5-sonnet-20241022
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: llama3
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434

# MCP tool configuration
tools:
  - name: deep-process
    command: npx
    args:
      - "@deep-process/mcp-server"
      - "--provider"
      - "ollama"
    transport: stdio
    enabled: true

# Logging
litellm_settings:
  success_callback: ["langfuse"]  # Optional: track usage
  drop_params: true
```

#### Step 2: Start LiteLLM Proxy

```bash
# Start proxy server
litellm --config litellm_config.yaml --port 4000

# Server runs at http://localhost:4000
```

#### Step 3: Use via Proxy

```python
import litellm
from litellm import completion

# Configure proxy
litellm.api_base = "http://localhost:4000"

# Use Deep Process tools
response = completion(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": "Use deep-process:deep-risk to assess risks for our cloud migration."
        }
    ],
    tools="deep-process"  # Auto-load MCP tools
)

print(response.choices[0].message.content)
```

### Method 3: Programmatic Integration

```python
from litellm import Router
import json
import subprocess

class DeepProcessMCP:
    """Deep Process MCP integration for LiteLLM"""

    def __init__(self, provider='ollama', api_key=None):
        self.provider = provider
        self.api_key = api_key
        self.process = None
        self.tools = []

    def start(self):
        """Start MCP server"""
        cmd = ['npx', '@deep-process/mcp-server', '--provider', self.provider]
        if self.api_key:
            cmd.extend(['--api-key', self.api_key])

        self.process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Load tools
        self.tools = self._load_tools()
        return self

    def _load_tools(self):
        """Load MCP tool definitions"""
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list"
        }

        self.process.stdin.write(json.dumps(request).encode() + b'\n')
        self.process.stdin.flush()

        response = json.loads(self.process.stdout.readline())
        return response['result']['tools']

    def call_tool(self, tool_name, arguments):
        """Execute a Deep Process tool"""
        request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }

        self.process.stdin.write(json.dumps(request).encode() + b'\n')
        self.process.stdin.flush()

        response = json.loads(self.process.stdout.readline())
        return response['result']['content'][0]['text']

    def stop(self):
        """Stop MCP server"""
        if self.process:
            self.process.terminate()

# Usage
mcp = DeepProcessMCP(provider='ollama').start()

# Execute risk assessment
result = mcp.call_tool(
    'deep-process:deep-risk',
    {
        'input': 'Assess risks for cloud migration to Azure, 6-month timeline, $10M revenue',
        'depth': 'quick'
    }
)

print(result)

mcp.stop()
```

## Usage Examples

### Example 1: Risk Assessment via LiteLLM

```python
from litellm import completion

response = completion(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": """
            Use the deep-process:deep-risk tool to assess risks for our project:

            Project: Cloud migration to Azure
            Timeline: 6 months
            Budget: $2M
            Team: 8 developers
            Revenue at stake: $10M annually

            Use depth=comprehensive
            """
        }
    ],
    tools="deep-process"
)

print(response.choices[0].message.content)
```

### Example 2: Architecture Design

```python
response = completion(
    model="claude-3-5-sonnet",
    messages=[
        {
            "role": "user",
            "content": """
            Use deep-process:deep-architect to design a scalable architecture:

            Requirements:
            - Real-time analytics platform
            - 1M events/second processing
            - Sub-100ms query latency
            - 99.99% uptime SLA
            - Global deployment (US, EU, APAC)

            Use depth=comprehensive
            """
        }
    ],
    tools="deep-process"
)

print(response.choices[0].message.content)
```

### Example 3: Compliance Verification

```python
response = completion(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": """
            Use deep-process:deep-compliance to verify GDPR compliance:

            Scope: Customer data processing for SaaS product
            Data types: Names, emails, preferences, behavioral data
            Storage: AWS eu-west-1
            Purpose: Email marketing automation

            Use depth=standard
            """
        }
    ],
    tools="deep-process"
)

print(response.choices[0].message.content)
```

## Advanced Features

### Cost Tracking

```python
from litellm import completion, completion_cost

response = completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Use deep-risk..."}],
    tools="deep-process"
)

# Calculate cost
cost = completion_cost(
    completion_response=response,
    model="gpt-4"
)

print(f"Execution cost: ${cost:.4f}")
```

### Caching

```python
from litellm import completion

# Enable caching for repeated queries
response = completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Use deep-verify..."}],
    tools="deep-process",
    cache={
        "ttl": 3600,  # Cache for 1 hour
        "namespace": "deep-process"
    }
)
```

### Fallback Providers

```python
from litellm import Router

# Define router with fallbacks
router = Router(
    model_list=[
        {
            "model_name": "gpt-4",
            "litellm_params": {"model": "gpt-4"},
            "model_info": {"priority": 1}
        },
        {
            "model_name": "claude-3-5-sonnet",
            "litellm_params": {"model": "claude-3-5-sonnet"},
            "model_info": {"priority": 2}  # Fallback
        }
    ]
)

# If GPT-4 fails, falls back to Claude
response = router.completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Use deep-risk..."}],
    tools="deep-process"
)
```

## Monitoring & Logging

### Enable Logging

```python
import litellm
litellm.set_verbose = True  # Enable debug logs

response = completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Use deep-verify..."}],
    tools="deep-process"
)
```

### Langfuse Integration (Usage Tracking)

```python
# In litellm_config.yaml
litellm_settings:
  success_callback: ["langfuse"]

# Or in code
import litellm
litellm.success_callback = ["langfuse"]
```

## Troubleshooting

### MCP Server Not Starting

```bash
# Test MCP server independently
npx @deep-process/mcp-server --provider ollama

# Check if Ollama is running (if using Ollama)
ollama serve
ollama pull llama3
```

### Tool Calls Not Working

```python
# Debug: Print available tools
print(deep_process_tools)

# Verify tool names match
# Format: "deep-process:deep-risk" not "deep-risk"
```

### Performance Issues

```python
# Use faster models for quick depth
response = completion(
    model="gpt-3.5-turbo",  # Faster than gpt-4
    messages=[{"role": "user", "content": "Use deep-risk with depth=quick..."}],
    tools="deep-process"
)
```

## Best Practices

1. **Use Appropriate Depths**
   - `quick` for rapid assessments (1-2 min)
   - `standard` for comprehensive analysis (5-10 min)
   - `comprehensive` for deep analysis (30-60 min)

2. **Cache Results**
   - Enable caching for repeated queries
   - Use semantic caching for similar requests

3. **Monitor Costs**
   - Track token usage with `completion_cost()`
   - Set budget limits in LiteLLM proxy

4. **Handle Errors Gracefully**
   - Implement retry logic
   - Use fallback providers
   - Log errors for debugging

5. **Optimize Provider Selection**
   - Use local Ollama for development
   - Use cloud providers for production
   - Implement smart routing based on task

## Resources

- **LiteLLM Documentation**: https://docs.litellm.ai/
- **MCP Specification**: https://modelcontextprotocol.io/
- **Deep Process MCP Server**: [README.md](../README.md)
- **Examples**: [programmatic-usage.ts](../examples/programmatic-usage.ts)

## Support

- **LiteLLM Issues**: https://github.com/BerriAI/litellm/issues
- **Deep Process Issues**: https://github.com/your-org/deep-process/issues
- **Discord**: Join the LiteLLM community

## Next Steps

1. Set up LiteLLM with Deep Process MCP server
2. Test tool execution with different providers
3. Implement cost tracking
4. Deploy LiteLLM proxy for team use
5. Monitor usage and optimize performance
