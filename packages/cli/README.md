# Deep Process

Structured LLM workflows that make AI assistants actually think instead of just respond.

## Quick Start

```bash
npx deep-process init
```

This interactive installer will:
1. Copy process files to `_deep-process/` in your project
2. Auto-detect your AI tools (Claude, Gemini, Cursor, Copilot, etc.)
3. Generate properly configured commands for each tool
4. Optionally update `.gitignore`

Then use in your AI tool:

```
/deep-verify Check the API in src/api/ against docs/requirements.md
/deep-explore Should we use Redis or Memcached for caching?
/deep-feasibility Can we ship the new auth system in 2 weeks?
```

## Available Processes

### Deep Verify
Structured verification and fact-checking of code and documents. Traces assumptions, finds contradictions, runs adversarial review.

### Deep Explore
Think through decisions systematically. Explores multiple paths, considers alternatives, makes trade-offs explicit.

### Deep Document
Generate documentation from code. Extracts ontology, creates structured docs, maintains consistency.

### Deep Feasibility
Multi-dimensional feasibility assessment across 10 dimensions: technical, timeline, resources, dependencies, risks, team, infrastructure, compliance, maintenance, and unknowns.

### Deep Synthesis
Synthesize multiple sources into genuine understanding. Goes beyond summarization to build integrated mental models.

### Deep Risk
Comprehensive risk analysis with cascade tracing, impact assessment, and mitigation strategies.

### Deep Architect
Architecture design with pattern exploration, component analysis, and decision documentation.

### Deep Diagram
Generate architecture diagrams from code or descriptions.

## CLI Commands

### Installation

```bash
# Interactive install
npx deep-process init

# Non-interactive
npx deep-process init --yes --tools claude,gemini

# Install for specific tools
npx deep-process init --tools cursor,copilot
```

### Management

```bash
# Show what's installed
npx deep-process status

# Add a tool integration
npx deep-process add-tool github-agents

# Remove a tool integration
npx deep-process remove-tool cursor

# Update to latest versions
npx deep-process update

# Uninstall everything
npx deep-process uninstall
```

## Supported AI Tools

The installer auto-detects and configures for:

- **Claude Code** - Native plugin support
- **Claude Desktop / API** - CLAUDE.md files
- **Gemini** - .gemini/ config files
- **Cursor** - .cursorrules files
- **GitHub Copilot** - Agent files (.github/agents/)
- **Continue.dev** - .continue/ config
- **Cline** - CLAUDE.md files
- **Windsurf** - .windsurfrules files
- **Roo Code** - CLAUDE.md files
- **Aider** - .aider/ config
- **V0** - v0.md files

## Manual Installation

If you prefer manual setup:

1. **Clone the processes:**
   ```bash
   git clone https://github.com/deep-process-org/deep-process
   cp -r deep-process/processes _deep-process
   ```

2. **Configure your tool:**
   - For Claude Code: Install as plugin
   - For Cursor: Create `.cursorrules` files
   - For GitHub Copilot: Copy agent files to `.github/agents/`
   - See [full documentation](https://github.com/deep-process-org/deep-process) for other tools

## Why Deep Process?

LLMs default to being fast and agreeable. They skip steps, take shortcuts, and produce outputs that *look* thorough but aren't.

Deep Process gives the LLM a structured protocol to follow:
- Specific steps and quality gates
- Adversarial checks and bias corrections
- Evidence requirements and traceability
- Falsifiable conclusions

The result: Outputs you can actually act on, not just conversation.

## Examples

**Verify code against spec:**
```
/deep-verify Check if src/auth/ implements all requirements from docs/auth-spec.md
```

**Explore architectural decisions:**
```
/deep-explore Compare microservices vs monolith for our use case
```

**Assess feasibility:**
```
/deep-feasibility Can we migrate to Kubernetes in Q1 with our current team?
```

**Generate documentation:**
```
/deep-document Create API docs from src/api/
```

**Analyze risks:**
```
/deep-risk Identify risks in our multi-region deployment plan
```

## Configuration

After installation, you'll have:

```
your-project/
├── _deep-process/           # Process files (don't edit)
│   ├── deep-verify/
│   ├── deep-explore/
│   ├── deep-document/
│   ├── deep-feasibility/
│   └── deep-synthesis/
│
└── deep-process.config.yaml # Config file (edit as needed)
```

Edit `deep-process.config.yaml` to:
- Enable/disable specific processes
- Configure process behavior
- Set default parameters

## Troubleshooting

**"Command not found"**
- Make sure your AI tool can access the `_deep-process/` directory
- Check that files were copied correctly with `npx deep-process status`

**"Process files missing"**
- Run `npx deep-process update` to re-copy files
- Verify `_deep-process/` exists and isn't gitignored

**"Wrong tool detected"**
- Manually specify tools: `npx deep-process init --tools claude,cursor`
- Or use `npx deep-process add-tool <name>` after installation

## Development

This package is part of the Deep Process monorepo:

```bash
git clone https://github.com/deep-process-org/deep-process
cd deep-process
pnpm install
pnpm run build
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/deep-process-org/deep-process)
- [Documentation](https://github.com/deep-process-org/deep-process#readme)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=deep-process.deep-process-vscode)
- [Claude Code Plugin](https://marketplace.anthropic.com) (search "deep-process")

## Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/deep-process-org/deep-process/blob/main/CONTRIBUTING.md)

## Support

- Issues: https://github.com/deep-process-org/deep-process/issues
- Discussions: https://github.com/deep-process-org/deep-process/discussions
