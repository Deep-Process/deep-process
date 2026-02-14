# Deep Process for VS Code

Structured LLM workflows for verification, exploration, architecture, feasibility, synthesis, and documentation — bringing rigorous process execution to your AI coding assistant.

## 🎯 What is Deep Process?

Deep Process provides **battle-tested workflow protocols** that transform your AI assistant from a helpful copilot into a rigorous execution engine. Each workflow is a step-by-step program that ensures completeness, accuracy, and consistency.

### Available Workflows

- **🔍 Deep Verify** — Structured verification and fact-checking with binding gates
- **🧭 Deep Explore** — Systematic decision exploration across alternatives
- **📚 Deep Document** — Iterative documentation with ontology extraction
- **⚖️ Deep Feasibility** — Multi-dimensional feasibility assessment (GO/CONDITIONAL/NO-GO)
- **🔬 Deep Synthesis** — Synthesize multiple sources into genuine understanding

## ✨ Features

### 🤖 AI Tool Integration
Automatically detects and integrates with your favorite AI tools:
- **GitHub Copilot** — Chat participant support
- **Continue.dev** — Custom prompts
- **Cline** — Structured workflows
- **Windsurf**, **Roo Code** — AI-powered development
- **Claude CLI**, **Gemini CLI** — Terminal workflows

### 📦 One-Click Installation
- Install all workflow processes to your workspace
- Automatic `.gitignore` configuration
- Version tracking and updates
- Clean uninstallation

### 💬 Chat Participant (GitHub Copilot)
Use workflows directly in GitHub Copilot Chat:

```
@deep-process /verify Check this API documentation for accuracy
@deep-process /explore What are the tradeoffs of using GraphQL?
@deep-process /document Generate docs for this codebase
@deep-process /feasibility Can we build this in 2 weeks?
@deep-process /synthesis Combine insights from these code reviews
```

### ⚙️ Visual Configuration Panel
Interactive sidebar panel to:
- See detected AI tools
- Select which tools to integrate
- View installation status
- Manage processes

## 📥 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Deep Process"
4. Click Install

### Quick Start
1. Open a workspace folder
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run **Deep Process: Configure**
4. Select your AI tools
5. Run **Deep Process: Install**
6. Start using `@deep-process` in chat!

## 🚀 Usage

### Chat Participant (Recommended)

The most powerful way to use Deep Process is through the GitHub Copilot Chat participant:

```
@deep-process /verify

Verify the claims in this API documentation:

[Paste your docs here]
```

The chat participant will:
1. Load the complete workflow protocol
2. Show you the execution steps
3. Guide you through the process
4. Execute with full rigor

### Commands

Alternative command-based access:

- `Deep Process: Deep Verify` — Launch verification workflow
- `Deep Process: Deep Explore` — Launch exploration workflow
- `Deep Process: Deep Document` — Launch documentation workflow
- `Deep Process: Deep Feasibility` — Launch feasibility assessment
- `Deep Process: Deep Synthesis` — Launch synthesis workflow

### Configuration Commands

- `Deep Process: Configure` — Interactive setup wizard
- `Deep Process: Install Processes` — Install workflow files
- `Deep Process: Update Processes` — Update to latest versions
- `Deep Process: Uninstall` — Remove all files

## 📖 Workflow Examples

### Deep Verify: Fact-Check Documentation

```
@deep-process /verify

Please verify this authentication flow documentation:

[Authentication Flow]
1. User submits credentials
2. Server validates against LDAP
3. JWT token is returned (expires in 24 hours)
4. Client stores token in localStorage
5. All API requests include token in Authorization header

Check for:
- Security issues
- Technical accuracy
- Contradictions
```

**What Deep Verify Does:**
- Extracts each claim systematically
- Verifies claims against code/evidence
- Identifies contradictions and gaps
- Assigns severity levels
- Generates detailed report

### Deep Explore: Architecture Decisions

```
@deep-process /explore

Should we use REST or GraphQL for our new API?

Context:
- Mobile + web clients
- Complex nested data
- Real-time updates needed
- Team has REST experience
```

**What Deep Explore Does:**
- Maps the decision landscape
- Explores both alternatives systematically
- Evaluates tradeoffs across dimensions
- Provides structured comparison
- Helps make informed choice

### Deep Feasibility: Feature Assessment

```
@deep-process /feasibility

Can we add real-time collaboration to our app?

Requirements:
- 100+ concurrent users
- Sub-second latency
- 2-week timeline
- Team of 3 developers (1 backend, 2 frontend)
```

**What Deep Feasibility Does:**
- Assesses 10 dimensions (technical, resource, time, risk, etc.)
- Identifies blockers and dependencies
- Rates each dimension
- Provides GO/CONDITIONAL/NO-GO verdict
- Suggests mitigation strategies

## ⚙️ Configuration

### Settings

Access via Settings (`Ctrl+,` / `Cmd+,`) → Extensions → Deep Process:

- **Enabled Tools** — List of enabled AI tool IDs
- **Process Directory** — Where process files are stored (default: `_deep-process`)
- **Auto Detect** — Automatically detect installed AI tools (default: `true`)

### Workspace Structure

After installation, your workspace contains:

```
your-workspace/
└── _deep-process/              # Process files (in .gitignore)
    ├── deep-process.config.yaml    # Configuration file
    ├── deep-verify/
    │   ├── workflow.md         # Master workflow
    │   ├── steps/              # Step files
    │   │   ├── step-00-setup.md
    │   │   ├── step-01-extract.md
    │   │   └── ...
    │   └── data/               # Reference data
    ├── deep-explore/
    ├── deep-document/
    ├── deep-feasibility/
    └── deep-synthesis/
```

### Configuration File

`_deep-process/deep-process.config.yaml` tracks installation state:

```yaml
version: "1.0.0"
packageVersion: "1.0.0"
installation:
  scope: project
  processDir: _deep-process
processes:
  deep-verify:
    installed: true
    version: "2.0.0"
  # ... other processes
tools:
  copilot:
    enabled: true
    files: []
  # ... other tools
```

## 🔧 Troubleshooting

### Chat Participant Not Available
- Ensure GitHub Copilot Chat extension is installed
- Requires VS Code 1.85.0 or higher
- Check Output panel → Deep Process for errors

### Processes Not Found
1. Run **Deep Process: Install Processes**
2. Verify `_deep-process/` directory exists
3. Check `_deep-process/deep-process.config.yaml` exists

### Tools Not Detected
1. Install the AI tool extensions you want
2. Run **Deep Process: Configure** to refresh
3. Check `deep-process.autoDetect` is enabled

## 📚 Learn More

- [GitHub Repository](https://github.com/deep-process-org/deep-process)
- [Full Documentation](https://github.com/deep-process-org/deep-process#readme)
- [npm Package](https://www.npmjs.com/package/deep-process) (CLI installer)
- [Report Issues](https://github.com/deep-process-org/deep-process/issues)

## 🤝 Contributing

We welcome contributions! See the [contributing guide](https://github.com/deep-process-org/deep-process#contributing).

## 📄 License

MIT — see [LICENSE](https://github.com/deep-process-org/deep-process/blob/main/LICENSE)
