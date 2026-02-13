# Deep Process — VS Code Extension

Structured LLM workflows for verification, exploration, architecture, feasibility, synthesis, and documentation.

## Features

- 🔍 **Tool Detection** — Automatically detects installed AI tools (Copilot, Continue.dev, Cline, etc.)
- ⚙️ **Easy Configuration** — GUI panel to select which AI tools to integrate
- 📦 **Process Installation** — One-click installation of workflow processes
- 💬 **Chat Participant** — `@deep-process` for any LLM extension
- 🎯 **Commands** — Quick access to all processes via Command Palette

## Installation

Install from VS Code Marketplace:

```
ext install deep-process.deep-process-vscode
```

Or search for "Deep Process" in the Extensions view.

## Quick Start

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: `Deep Process: Configure`
3. Select which AI tools you use
4. Start using processes!

## Usage

### Via Chat Participant

```
@deep-process /verify Check the authentication module
@deep-process /explore Should we use Redis or Memcached?
@deep-process /document Generate API documentation
```

### Via Commands

- `Deep Process: Deep Verify` — Structured verification
- `Deep Process: Deep Explore` — Decision exploration
- `Deep Process: Deep Document` — Documentation generation
- `Deep Process: Deep Feasibility` — Feasibility assessment
- `Deep Process: Deep Synthesis` — Knowledge synthesis

## Requirements

- VS Code 1.85.0 or higher
- At least one AI tool installed:
  - GitHub Copilot
  - Continue.dev
  - Cline
  - Windsurf
  - Roo Code
  - Claude CLI
  - Gemini CLI

## Development Status

🚧 **Phase 2 - In Development**

Week 1: Core functionality (tool detection, configuration, installation)
Week 2: Chat Participant + advanced features

See [ROADMAP](../../plans/ROADMAP.md) for details.

## License

MIT
