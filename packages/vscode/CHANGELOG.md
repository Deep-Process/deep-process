# Changelog

All notable changes to the Deep Process VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-02-13

### Added

#### Core Features
- **Process Installation System**
  - One-click installation of workflow processes to workspace
  - Automatic `.gitignore` configuration
  - Version tracking and update detection
  - Clean uninstallation with confirmation

- **GitHub Copilot Chat Participant**
  - `@deep-process` chat participant with 5 workflow commands
  - `/verify` - Structured verification and fact-checking
  - `/explore` - Systematic decision exploration
  - `/document` - Documentation generation with ontology extraction
  - `/feasibility` - Multi-dimensional feasibility assessment
  - `/synthesis` - Synthesize multiple sources
  - Automatic workflow file loading and formatting
  - Process-specific example prompts

- **AI Tool Detection**
  - Auto-detects 7 AI tools: GitHub Copilot, Continue.dev, Cline, Windsurf, Roo Code, Claude CLI, Gemini CLI
  - Visual indicators for detected vs not installed tools
  - Smart configuration based on detected tools

- **Interactive Configuration Panel**
  - Visual sidebar panel in Activity Bar
  - Checkbox-based tool selection
  - Real-time detection status
  - Save & Install workflow

- **Command Palette Integration**
  - `Deep Process: Configure` - Interactive setup wizard
  - `Deep Process: Install Processes` - Install workflow files
  - `Deep Process: Update Processes` - Update to latest versions
  - `Deep Process: Uninstall` - Remove all files
  - `Deep Process: Deep Verify` - Launch verification workflow
  - `Deep Process: Deep Explore` - Launch exploration workflow
  - `Deep Process: Deep Document` - Launch documentation workflow
  - `Deep Process: Deep Feasibility` - Launch feasibility assessment
  - `Deep Process: Deep Synthesis` - Launch synthesis workflow

- **Status Bar Indicator**
  - Shows installation status (✓ installed vs not installed)
  - Displays process and tool counts
  - Color-coded with green checkmark when installed
  - Auto-updates via config file watcher
  - Click to open configuration

#### Developer Experience
- Progress indicators for all long-running operations
- Comprehensive error handling and validation
- File system watcher for automatic UI updates
- Workspace configuration persistence
- Detailed informational messages

#### Documentation
- Comprehensive README with usage examples
- Workflow-specific documentation
- Troubleshooting guide
- Configuration reference

### Technical Details
- TypeScript compilation with no errors
- Integration with `@deep-process/core` shared package
- Supports VS Code 1.85.0+
- Workspace-based installation (no global configuration)

### Dependencies
- `@deep-process/core` - Shared utilities and process registry
- `vscode` - VS Code extension API

## Release Notes

### 1.0.0 - Initial Release

This is the first official release of Deep Process for VS Code! 🎉

**What is Deep Process?**
Deep Process brings battle-tested workflow protocols to your AI coding assistant. Instead of ad-hoc prompting, you get rigorous, step-by-step execution programs that ensure completeness, accuracy, and consistency.

**Key Highlights:**
- 🤖 Works with your existing AI tools (GitHub Copilot, Continue.dev, Cline, etc.)
- 💬 Chat participant for seamless workflow execution
- 📦 One-click installation to your workspace
- 🔍 5 production-ready workflows (Verify, Explore, Document, Feasibility, Synthesis)

**Getting Started:**
1. Install the extension
2. Run "Deep Process: Configure"
3. Select your AI tools
4. Run "Deep Process: Install"
5. Start using `@deep-process` in chat!

**Learn More:**
- [GitHub Repository](https://github.com/deep-process-org/deep-process)
- [Full Documentation](https://github.com/deep-process-org/deep-process#readme)
- [Report Issues](https://github.com/deep-process-org/deep-process/issues)

---

[Unreleased]: https://github.com/deep-process-org/deep-process/compare/vscode-v1.0.0...HEAD
[1.0.0]: https://github.com/deep-process-org/deep-process/releases/tag/vscode-v1.0.0
