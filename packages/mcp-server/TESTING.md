# MCP Server Testing Guide

This document provides comprehensive testing procedures for the Deep Process MCP Server to ensure quality before and after NPM publication.

## Testing Strategy

**Total Tests Required:** 50+ manual test cases
**Coverage Areas:**
1. Installation & Setup (5 tests)
2. Tool Execution (26 tests - 13 processes × 2 depths minimum)
3. Resource Access (10 tests)
4. Prompt Usage (5 tests)
5. Error Handling (5+ tests)
6. Integration Testing (3+ platforms)

**Success Criteria:**
- ✅ All 13 processes execute successfully
- ✅ Gate validation works correctly
- ✅ Scope reduction requires user approval
- ✅ Resources are accessible
- ✅ Prompts generate valid requests
- ✅ 3+ AI tool integrations work (Claude Desktop, Azure AI Foundry, LiteLLM)
- ✅ 3+ user testimonials collected

## Pre-Publishing Tests (Local)

### 1. Installation Tests

#### Test 1.1: Build from Source
```bash
cd packages/mcp-server
pnpm install
pnpm build
```

**Expected Result:**
- ✅ No TypeScript errors
- ✅ dist/ directory created
- ✅ All .js and .d.ts files present

**Status:** [ ]

---

#### Test 1.2: CLI Executable
```bash
node dist/cli.js --help
```

**Expected Result:**
- ✅ Help message displayed
- ✅ Shows all options (-p, -m, -e, -k, -h)
- ✅ Shows examples

**Status:** [ ]

---

#### Test 1.3: Local Execution with Ollama
```bash
# Prerequisite: ollama serve running
ollama serve &
ollama pull llama3

# Start MCP server
node dist/cli.js --provider ollama
```

**Expected Result:**
- ✅ Server starts without errors
- ✅ Shows "Deep Process MCP Server" banner
- ✅ Shows "Provider: ollama"
- ✅ Shows "Loaded X process manifests"
- ✅ Shows "Initialization complete"

**Status:** [ ]

---

### 2. Tool Execution Tests

For each process, test at minimum two depths (quick + standard). Priority processes are marked with ⭐.

#### Test 2.1: deep-verify (⭐)

**Quick Depth:**
```
Input: Verify microservices architecture with 8 services, PostgreSQL, Redis
Depth: quick
Expected: Verification report with vertical and horizontal checks
```

**Status:** [ ]

**Standard Depth:**
```
Input: Same as above
Depth: standard
Expected: Comprehensive verification with detailed analysis
```

**Status:** [ ]

---

#### Test 2.2: deep-risk (⭐)

**Quick Depth:**
```
Input: Assess risks for cloud migration project, 6-month timeline, $10M at stake
Depth: quick
Expected: Top 10 risks with basic scoring
```

**Status:** [ ]

**Standard Depth:**
```
Input: Same as above
Depth: standard
Expected: 6-phase risk assessment with comprehensive analysis
```

**Status:** [ ]

---

#### Test 2.3: deep-architect (⭐)

**Standard Depth:**
```
Input: Design scalable architecture for real-time analytics, 1M events/second
Depth: standard
Expected: Architecture design with component breakdown
```

**Status:** [ ]

**Comprehensive Depth:**
```
Input: Same as above
Depth: comprehensive
Expected: Detailed architecture with diagrams, scaling strategy, tech stack
```

**Status:** [ ]

---

#### Test 2.4: deep-compliance (⭐)

**Standard Depth:**
```
Input: Verify GDPR compliance for customer data processing in SaaS product
Depth: standard
Expected: Compliance report with gaps and recommendations
```

**Status:** [ ]

---

#### Test 2.5-2.13: Other Processes

Test each of the remaining 9 processes with at least quick depth:

- [ ] deep-feasibility (quick)
- [ ] deep-explore (quick)
- [ ] deep-synthesis (quick)
- [ ] deep-document (quick)
- [ ] deep-diagram (quick)
- [ ] deep-challenge (quick)
- [ ] deep-governance (quick)
- [ ] deep-orchestration (quick)

---

### 3. Gate Validation Tests

#### Test 3.1: Gate Pass
```
Process: deep-risk
Input: Well-defined project with clear scope
Expected: All gates pass (status: OPEN)
```

**Status:** [ ]

---

#### Test 3.2: Gate Failure (BLOCKER)
```
Process: deep-risk
Input: Intentionally incomplete input (e.g., no timeframe)
Expected: GATE_0 fails, execution halts
```

**Status:** [ ]

---

#### Test 3.3: Scope Reduction (CRITICAL)
```
Process: deep-risk
Depth: quick
Expected: Some CRITICAL conditions fail, user approval requested
Action: Approve reduction
Expected: Execution continues
```

**Status:** [ ]

---

### 4. Resource Access Tests

#### Test 4.1: Process List
```
Resource URI: deep-process://processes
Expected: JSON with all 13 processes
```

**Status:** [ ]

---

#### Test 4.2: Process Details
```
Resource URI: deep-process://process/deep-risk
Expected: JSON with manifest details
```

**Status:** [ ]

---

#### Test 4.3: Workflow File
```
Resource URI: deep-process://process/deep-risk/workflow
Expected: Markdown workflow description
```

**Status:** [ ]

---

#### Test 4.4: Gates File
```
Resource URI: deep-process://process/deep-risk/gates
Expected: YAML gates definition
```

**Status:** [ ]

---

#### Test 4.5: Pattern Library
```
Resource URI: deep-process://patterns/deep-risk
Expected: JSON with pattern files
```

**Status:** [ ]

---

### 5. Prompt Tests

#### Test 5.1: Quick Risk Check Prompt
```
Prompt: deep-process:quick-risk-check
Args: { feature: "Payment gateway integration", timeline: "2 weeks" }
Expected: Formatted prompt for deep-risk with quick depth
```

**Status:** [ ]

---

#### Test 5.2: Architecture Review Prompt
```
Prompt: deep-process:architecture-review
Args: { system: "E-commerce platform", scale: "1M users" }
Expected: Formatted prompt for deep-architect with comprehensive depth
```

**Status:** [ ]

---

#### Test 5.3: Compliance Check Prompt
```
Prompt: deep-process:compliance-check
Args: { regulation: "GDPR", scope: "Customer data processing" }
Expected: Formatted prompt for deep-compliance
```

**Status:** [ ]

---

### 6. Error Handling Tests

#### Test 6.1: Invalid Process ID
```
Tool: deep-process:invalid-process
Expected: Error message "Process 'invalid-process' not found"
```

**Status:** [ ]

---

#### Test 6.2: Missing Required Argument
```
Tool: deep-process:deep-risk
Args: {} (no input)
Expected: Error about missing required argument
```

**Status:** [ ]

---

#### Test 6.3: Invalid Depth
```
Tool: deep-process:deep-risk
Args: { input: "Test", depth: "invalid" }
Expected: Default to "standard" or error
```

**Status:** [ ]

---

#### Test 6.4: Provider Error (Invalid API Key)
```
Provider: openai
API Key: invalid-key
Expected: Clear error message about authentication
```

**Status:** [ ]

---

## Post-Publishing Tests (NPM)

### 7. NPM Installation Tests

#### Test 7.1: Global Install
```bash
npm install -g @deep-process/mcp-server
deep-process-mcp --version
```

**Expected Result:**
- ✅ Installs without errors
- ✅ Shows version number

**Status:** [ ]

---

#### Test 7.2: npx Direct Execution
```bash
npx @deep-process/mcp-server --help
```

**Expected Result:**
- ✅ Downloads and executes without errors
- ✅ Shows help message

**Status:** [ ]

---

#### Test 7.3: Local Project Install
```bash
mkdir test-project
cd test-project
npm init -y
npm install @deep-process/mcp-server
npx deep-process-mcp --provider ollama
```

**Expected Result:**
- ✅ Installs as project dependency
- ✅ Runs successfully

**Status:** [ ]

---

## Integration Testing

### 8. Claude Desktop Integration

#### Test 8.1: Configuration
```json
{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": ["@deep-process/mcp-server"]
    }
  }
}
```

**Steps:**
1. Edit claude_desktop_config.json
2. Restart Claude Desktop
3. Verify tools appear in Claude

**Expected Result:**
- ✅ Claude Desktop detects MCP server
- ✅ Shows deep-process tools in tool list

**Status:** [ ]

---

#### Test 8.2: Tool Execution in Claude
```
Use the deep-process:deep-risk tool to assess risks for our cloud migration.
Context: Migrating monolith to microservices, 6 months, $10M revenue.
Use depth=quick.
```

**Expected Result:**
- ✅ Tool executes successfully
- ✅ Returns structured risk assessment
- ✅ YAML blocks properly formatted
- ✅ Gates validated

**Status:** [ ]

---

#### Test 8.3: Resource Access in Claude
```
Read the deep-process://process/deep-risk/workflow resource
```

**Expected Result:**
- ✅ Resource content displayed
- ✅ Markdown properly rendered

**Status:** [ ]

---

### 9. Azure AI Foundry Integration

#### Test 9.1: Docker Build
```bash
docker build -t deep-process-mcp .
docker run -it deep-process-mcp --provider ollama
```

**Expected Result:**
- ✅ Docker image builds successfully
- ✅ Container runs MCP server

**Status:** [ ]

---

#### Test 9.2: Azure Container Instance Deployment
```bash
az container create \
  --resource-group deep-process-rg \
  --name deep-process-mcp \
  --image deep-process-mcp:latest
```

**Expected Result:**
- ✅ Deploys to Azure
- ✅ MCP server accessible

**Status:** [ ]

---

### 10. LiteLLM Integration

#### Test 10.1: Tool Loading
```python
from litellm import completion

# Load MCP tools
response = completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Use deep-verify..."}],
    tools=[...]  # MCP tools
)
```

**Expected Result:**
- ✅ MCP tools loaded
- ✅ Tool execution works

**Status:** [ ]

---

## Performance Testing

### 11. Execution Time Benchmarks

| Process | Depth | Expected Time | Actual Time | Status |
|---------|-------|---------------|-------------|--------|
| deep-verify | quick | 1-2 min | | [ ] |
| deep-verify | standard | 5-10 min | | [ ] |
| deep-risk | quick | 2-3 min | | [ ] |
| deep-risk | standard | 10-20 min | | [ ] |
| deep-risk | comprehensive | 30-60 min | | [ ] |
| deep-architect | standard | 10-15 min | | [ ] |
| deep-compliance | standard | 8-12 min | | [ ] |

---

### 12. Token Usage Tracking

| Process | Depth | Provider | Expected Tokens | Actual Tokens | Cost | Status |
|---------|-------|----------|-----------------|---------------|------|--------|
| deep-risk | quick | gpt-4o | 5K-10K | | | [ ] |
| deep-risk | standard | gpt-4o | 20K-40K | | | [ ] |
| deep-architect | comprehensive | claude-3-5-sonnet | 50K-100K | | | [ ] |

---

## User Testimonial Collection

### Required: 3+ User Testimonials

#### Testimonial 1: [Name]
**Use Case:**
**Feedback:**
**Status:** [ ]

---

#### Testimonial 2: [Name]
**Use Case:**
**Feedback:**
**Status:** [ ]

---

#### Testimonial 3: [Name]
**Use Case:**
**Feedback:**
**Status:** [ ]

---

## Test Summary

**Total Tests Planned:** 50+
**Tests Passed:** ___ / 50+
**Tests Failed:** ___
**Tests Skipped:** ___

**Critical Issues:**
- (List any critical issues found)

**Non-Critical Issues:**
- (List any non-critical issues)

**Recommendations:**
- (List any recommendations for improvements)

---

## Sign-Off

**Tested By:** ___________________
**Date:** ___________________
**Version Tested:** ___________________

**Ready for Production:** [ ] Yes [ ] No

**Notes:**
