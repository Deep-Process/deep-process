# Deep Process — GitHub Copilot Agents

Pre-configured GitHub Copilot agents for structured LLM workflows.

## Installation

### Option 1: Universal Installer (Recommended)

```bash
npx deep-process init --tools github-agents
```

This will:
1. Copy process files to `_deep-process/`
2. Generate agent files in `.github/agents/`
3. Configure paths correctly for your project

### Option 2: Manual Copy

1. Copy agent files to your project:

```bash
mkdir -p .github/agents
cp packages/copilot-agents/agents/*.agent.md .github/agents/
```

2. Ensure process files are in `_deep-process/`:

```bash
npx deep-process init --processes deep-verify,deep-explore,deep-document,deep-feasibility,deep-synthesis
```

## Usage

In VS Code with GitHub Copilot Chat:

```
@deep-verify Check the authentication module in src/auth/
@deep-explore Should we use Redis or Memcached for caching?
@deep-document Generate documentation for the API
```

## Available Agents

- `@deep-verify` — Structured verification and fact-checking
- `@deep-explore` — Think through decisions systematically
- `@deep-document` — Generate documentation from code
- `@deep-feasibility` — Assess feasibility across 10 dimensions
- `@deep-synthesis` — Synthesize multiple sources

## Requirements

- GitHub Copilot subscription
- VS Code with GitHub Copilot extension
- Process files in `_deep-process/` directory

## License

MIT
