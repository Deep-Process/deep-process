# Faza 1: Claude Code Plugin + Copilot Agents + Marketplace

**Status:** 🔄 W trakcie (90%)
**Priorytet:** P0
**Czas:** 1 dzień
**Zależności:** Brak (można zacząć od razu)

---

## 🎯 Cel

Dokończyć i uruchomić:
1. **Claude Code Plugin** — dostępny przez `claude plugin install`
2. **GitHub Copilot Agents** — pliki do skopiowania przez użytkowników
3. **Claude Marketplace Auto-Deploy** — automatyczny release na Marketplace

---

## 📁 Struktura Plików

### Przed (obecny stan):
```
deep-process_org/
├── .claude-plugin/
│   └── plugin.json
├── commands/                    # Może istnieć lub nie
│   ├── deep-verify.md
│   └── ...
├── plugins/
│   └── github-copilot/
│       └── agents/
│           ├── deep-verify.agent.md
│           └── ...
└── processes/
```

### Po (docelowy stan):
```
deep-process_org/
├── packages/                    # NOWY — monorepo structure
│   ├── claude-plugin/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── deep-verify.md
│   │   │   ├── deep-explore.md
│   │   │   ├── deep-document.md
│   │   │   ├── deep-feasibility.md
│   │   │   └── deep-synthesis.md
│   │   ├── processes/           # Symlink → ../../processes/
│   │   └── README.md
│   │
│   └── copilot-agents/
│       ├── agents/
│       │   ├── deep-verify.agent.md
│       │   ├── deep-explore.agent.md
│       │   ├── deep-document.md
│       │   ├── deep-feasibility.agent.md
│       │   └── deep-synthesis.agent.md
│       ├── processes/           # Symlink → ../../processes/
│       └── README.md
│
├── processes/                   # Bez zmian
├── .github/workflows/
│   └── release-claude.yml       # NOWY
└── README.md                    # Zaktualizowany
```

---

## ✅ Zadania

### 1. Przygotowanie Struktury

#### 1.1. Utworzenie katalogów
```bash
mkdir -p packages/claude-plugin/.claude-plugin
mkdir -p packages/claude-plugin/commands
mkdir -p packages/copilot-agents/agents
```

#### 1.2. Symlinki do procesów
```bash
# Windows (wymaga admin lub Developer Mode)
# Alternatywa: kopiować processes/ do każdego package

# Unix/Linux/macOS
cd packages/claude-plugin
ln -s ../../processes processes

cd ../copilot-agents
ln -s ../../processes processes
```

**Uwaga Windows:** Jeśli symlinki nie działają, kopiuj pliki:
```powershell
Copy-Item -Path processes -Destination packages/claude-plugin/processes -Recurse
Copy-Item -Path processes -Destination packages/copilot-agents/processes -Recurse
```

---

### 2. Claude Code Plugin

#### 2.1. Utworzenie `plugin.json`

**Plik:** `packages/claude-plugin/.claude-plugin/plugin.json`

```json
{
  "name": "deep-process",
  "description": "Structured LLM workflows — verification, exploration, architecture, feasibility, risk, synthesis, documentation",
  "version": "1.0.0",
  "author": {
    "name": "Deep Process Contributors"
  },
  "repository": "https://github.com/deep-process-org/deep-process",
  "homepage": "https://github.com/deep-process-org/deep-process#readme",
  "license": "MIT",
  "commands": "./commands/"
}
```

#### 2.2. Wygenerowanie plików komend

Dla każdego procesu z `manifest.yaml` (5 procesów):

**Dane z manifestów:**

| Process | agentName | firstStepFile | firstStepLabel | agentInstruction |
|---|---|---|---|---|
| deep-verify | Deep Verify Agent | steps/step-00-setup.md | Phase 0 | Do not pre-judge the verification mode. Follow the logic in step-00-setup.md to interactively select the mode if it is not explicitly provided. |
| deep-explore | Deep Explore Agent | steps/step-00-knowledge-audit.md | Phase 0 | Do not pre-judge the execution mode. Follow the logic in step-00-knowledge-audit.md to interactively select the mode if it is not explicitly provided. |
| deep-document | Deep Document Agent | steps/step-01-init.md | Phase 1 | (przeczytać z manifest.yaml) |
| deep-feasibility | Deep Feasibility Agent | steps/step-00-frame.md | Phase 0 | (przeczytać z manifest.yaml) |
| deep-synthesis | Deep Synthesis Agent | steps/step-00-scope.md | Phase 0 | (przeczytać z manifest.yaml) |

**Szablon:** `packages/claude-plugin/commands/{id}.md`

```markdown
# {{agentName}} Instructions

You are the **{{agentName}}**.

## LOCATING PROCESS FILES

This command is part of the `deep-process` plugin. The process files are in the `processes/{{id}}/` directory at the plugin root.

When this plugin is installed, Claude Code places it in a directory on your system. All paths below are relative to that plugin directory.

## CORE DIRECTIVE

Your single source of truth is the Master Workflow: `processes/{{id}}/workflow.md` (relative to the plugin root).

## INSTRUCTIONS

1. **Read** `processes/{{id}}/workflow.md` from the plugin root to load the protocol.
2. **Start** at {{firstStepLabel}}: `processes/{{id}}/{{firstStepFile}}`.
3. **Execute** the steps defined in the files. All step file paths are relative to `processes/{{id}}/` in the plugin root.

**{{agentInstruction}}**
```

**Przykład:** `packages/claude-plugin/commands/deep-verify.md`

```markdown
# Deep Verify Agent Instructions

You are the **Deep Verify Agent**.

## LOCATING PROCESS FILES

This command is part of the `deep-process` plugin. The process files are in the `processes/deep-verify/` directory at the plugin root.

When this plugin is installed, Claude Code places it in a directory on your system. All paths below are relative to that plugin directory.

## CORE DIRECTIVE

Your single source of truth is the Master Workflow: `processes/deep-verify/workflow.md` (relative to the plugin root).

## INSTRUCTIONS

1. **Read** `processes/deep-verify/workflow.md` from the plugin root to load the protocol.
2. **Start** at Phase 0: `processes/deep-verify/steps/step-00-setup.md`.
3. **Execute** the steps defined in the files. All step file paths are relative to `processes/deep-verify/` in the plugin root.

**Do not pre-judge the verification mode. Follow the logic in step-00-setup.md to interactively select the mode if it is not explicitly provided.**
```

#### 2.3. Utworzenie README

**Plik:** `packages/claude-plugin/README.md`

```markdown
# Deep Process — Claude Code Plugin

Structured LLM workflows for verification, exploration, architecture, feasibility, synthesis, and documentation.

## Installation

\`\`\`bash
claude plugin install deep-process-org/deep-process --directory packages/claude-plugin
\`\`\`

Or browse on [Claude Marketplace](https://claudemarketplaces.com).

## Usage

After installation, you'll have these commands available:

- \`/deep-process:deep-verify\` — Structured verification and fact-checking
- \`/deep-process:deep-explore\` — Think through decisions systematically
- \`/deep-process:deep-document\` — Generate documentation from code
- \`/deep-process:deep-feasibility\` — Assess feasibility across 10 dimensions
- \`/deep-process:deep-synthesis\` — Synthesize multiple sources into understanding

### Example

\`\`\`
/deep-process:deep-verify Check the authentication module in src/auth/ against the security requirements in docs/security.md
\`\`\`

## Processes Included

1. **Deep Verify** (v2.0.0) — Verification and fact-checking
2. **Deep Explore** (v3.2.0) — Decision exploration
3. **Deep Document** (v7.1.1) — Documentation generation
4. **Deep Feasibility** (v1.1.0) — Feasibility assessment
5. **Deep Synthesis** (v1.1.0) — Knowledge synthesis

## License

MIT
```

---

### 3. GitHub Copilot Agents

#### 3.1. Wygenerowanie plików agentów

**Szablon:** `packages/copilot-agents/agents/{id}.agent.md`

```markdown
---
description: "{{description}}"
tools:
{{tools}}
---

You are the **{{agentName}}**.

## LOCATING PROCESS FILES

This agent expects process files to be in the `_deep-process/{{id}}/` directory of your project (installed via \`npx deep-process init\`).

If you manually copied these agent files, ensure you also copy the process files from this repository's \`processes/{{id}}/\` directory to your project's \`_deep-process/{{id}}/\` directory.

## CORE DIRECTIVE

Your single source of truth is the Master Workflow: \`_deep-process/{{id}}/workflow.md\`.

## INSTRUCTIONS

1. **Read** \`_deep-process/{{id}}/workflow.md\` to load the protocol.
2. **Start** at {{firstStepLabel}}: \`_deep-process/{{id}}/{{firstStepFile}}\`.
3. **Execute** the steps defined in the files. All step file paths are relative to \`_deep-process/{{id}}/\`.

**{{agentInstruction}}**
```

**Dane dla tools (z manifest.yaml):**

| Process | tools |
|---|---|
| deep-verify | `  - read`<br>`  - search` |
| deep-explore | `  - read`<br>`  - search` |
| deep-document | `  - read`<br>`  - search`<br>`  - edit`<br>`  - terminal` |
| deep-feasibility | `  - read`<br>`  - search` |
| deep-synthesis | `  - read`<br>`  - search` |

**Przykład:** `packages/copilot-agents/agents/deep-verify.agent.md`

```markdown
---
description: "Structured verification and fact-checking of code and documents"
tools:
  - read
  - search
---

You are the **Deep Verify Agent**.

## LOCATING PROCESS FILES

This agent expects process files to be in the `_deep-process/deep-verify/` directory of your project (installed via `npx deep-process init`).

If you manually copied these agent files, ensure you also copy the process files from this repository's `processes/deep-verify/` directory to your project's `_deep-process/deep-verify/` directory.

## CORE DIRECTIVE

Your single source of truth is the Master Workflow: `_deep-process/deep-verify/workflow.md`.

## INSTRUCTIONS

1. **Read** `_deep-process/deep-verify/workflow.md` to load the protocol.
2. **Start** at Phase 0: `_deep-process/deep-verify/steps/step-00-setup.md`.
3. **Execute** the steps defined in the files. All step file paths are relative to `_deep-process/deep-verify/`.

**Do not pre-judge the verification mode. Follow the logic in step-00-setup.md to interactively select the mode if it is not explicitly provided.**
```

#### 3.2. Utworzenie README

**Plik:** `packages/copilot-agents/README.md`

```markdown
# Deep Process — GitHub Copilot Agents

Pre-configured GitHub Copilot agents for structured LLM workflows.

## Installation

### Option 1: Universal Installer (Recommended)

\`\`\`bash
npx deep-process init --tools github-agents
\`\`\`

This will:
1. Copy process files to \`_deep-process/\`
2. Generate agent files in \`.github/agents/\`
3. Configure paths correctly for your project

### Option 2: Manual Copy

1. Copy agent files to your project:

\`\`\`bash
mkdir -p .github/agents
cp packages/copilot-agents/agents/*.agent.md .github/agents/
\`\`\`

2. Ensure process files are in \`_deep-process/\`:

\`\`\`bash
npx deep-process init --processes deep-verify,deep-explore,deep-document,deep-feasibility,deep-synthesis
\`\`\`

## Usage

In VS Code with GitHub Copilot Chat:

\`\`\`
@deep-verify Check the authentication module in src/auth/
@deep-explore Should we use Redis or Memcached for caching?
@deep-document Generate documentation for the API
\`\`\`

## Available Agents

- \`@deep-verify\` — Structured verification and fact-checking
- \`@deep-explore\` — Think through decisions systematically
- \`@deep-document\` — Generate documentation from code
- \`@deep-feasibility\` — Assess feasibility across 10 dimensions
- \`@deep-synthesis\` — Synthesize multiple sources

## Requirements

- GitHub Copilot subscription
- VS Code with GitHub Copilot extension
- Process files in \`_deep-process/\` directory

## License

MIT
```

---

### 4. Claude Marketplace Workflow

#### 4.1. Utworzenie workflow

**Plik:** `.github/workflows/release-claude.yml`

```yaml
name: Create Claude Plugin Release

on:
  push:
    branches: [main]
    paths:
      - 'packages/claude-plugin/.claude-plugin/plugin.json'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Extract version
        id: version
        run: |
          VERSION=$(node -p "require('./packages/claude-plugin/.claude-plugin/plugin.json').version")
          echo "version=$VERSION" >> "$GITHUB_OUTPUT"
          echo "tag=claude-plugin-v$VERSION" >> "$GITHUB_OUTPUT"

      - name: Check if tag exists
        id: check
        run: |
          if git rev-parse "${{ steps.version.outputs.tag }}" >/dev/null 2>&1; then
            echo "exists=true" >> "$GITHUB_OUTPUT"
          else
            echo "exists=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Create Release
        if: steps.check.outputs.exists == 'false'
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.version.outputs.tag }}
          name: "Deep Process — Claude Plugin v${{ steps.version.outputs.version }}"
          body: |
            ## Deep Process — Claude Code Plugin v${{ steps.version.outputs.version }}

            Structured LLM workflows for verification, exploration, architecture, feasibility, synthesis, and documentation.

            ### Installation

            \`\`\`bash
            claude plugin install deep-process-org/deep-process --directory packages/claude-plugin
            \`\`\`

            Or browse on [Claude Marketplace](https://claudemarketplaces.com).

            ### Commands

            - \`/deep-process:deep-verify\` — Structured verification and fact-checking
            - \`/deep-process:deep-explore\` — Think through decisions systematically
            - \`/deep-process:deep-document\` — Generate documentation from code
            - \`/deep-process:deep-feasibility\` — Assess feasibility across 10 dimensions
            - \`/deep-process:deep-synthesis\` — Synthesize multiple sources into understanding

            ### What's New

            See [CHANGELOG](https://github.com/deep-process-org/deep-process/blob/main/CHANGELOG.md) for details.
          generate_release_notes: true
```

---

### 5. Aktualizacja README

**Plik:** `README.md` (root)

**Zmienić sekcję "Installation":**

```markdown
## Installation

### Option A: Universal installer (any AI tool)

\`\`\`bash
npx deep-process init
\`\`\`

The interactive installer will:
1. Copy process files to \`_deep-process/\` in your project
2. Detect which AI tools you use (Claude, Gemini, Cursor, etc.)
3. Generate properly configured commands for each tool
4. Optionally add \`_deep-process/\` to \`.gitignore\`

Then open your AI tool and run:

\`\`\`
/deep-verify Check the API in src/api/ against the spec in docs/requirements.md
\`\`\`

#### Non-interactive mode

\`\`\`bash
npx deep-process init --yes --tools claude,gemini
\`\`\`

#### Other commands

\`\`\`bash
npx deep-process status       # Show what's installed
npx deep-process add-tool cursor   # Add a tool integration
npx deep-process remove-tool cursor # Remove a tool integration
npx deep-process update       # Update processes to latest versions
npx deep-process uninstall    # Remove everything
\`\`\`

### Option B: Claude Code Plugin

If you only use Claude Code, install directly as a plugin:

\`\`\`bash
claude plugin install deep-process-org/deep-process --directory packages/claude-plugin
\`\`\`

This gives you \`/deep-process:deep-verify\`, \`/deep-process:deep-explore\`, etc. — no file copying needed.

Browse on [Claude Marketplace](https://claudemarketplaces.com) or install via:

\`\`\`bash
/plugin install deep-process
\`\`\`

### Option C: GitHub Copilot Agents

For GitHub Copilot users, use the universal installer which auto-generates agent files:

\`\`\`bash
npx deep-process init --tools github-agents
\`\`\`

Or manually copy agent files from [\`packages/copilot-agents/agents/\`](packages/copilot-agents/agents/):

\`\`\`bash
mkdir -p .github/agents
cp packages/copilot-agents/agents/*.agent.md .github/agents/
\`\`\`

Then use in VS Code Copilot Chat:

\`\`\`
@deep-verify Check the authentication module
@deep-explore Should we use Redis or Memcached?
\`\`\`
```

---

### 6. Cleanup

#### 6.1. Usunąć stare katalogi (jeśli istnieją)

```bash
# Jeśli w root był commands/
rm -rf commands/

# Jeśli był plugins/github-copilot/
rm -rf plugins/
```

---

## ✅ Weryfikacja

### Claude Code Plugin:

1. **Instalacja:**
   ```bash
   claude plugin install <your-github-username>/deep-process --directory packages/claude-plugin
   ```

2. **Sprawdzenie:**
   ```bash
   /help
   # Powinieneś zobaczyć: /deep-process:deep-verify, /deep-process:deep-explore, etc.
   ```

3. **Test:**
   ```bash
   /deep-process:deep-verify Test this code
   # Claude powinien czytać processes/deep-verify/workflow.md
   ```

### GitHub Copilot Agents:

1. **Instalacja (npx):**
   ```bash
   npx deep-process init --tools github-agents
   ```

2. **Sprawdzenie:**
   ```bash
   ls .github/agents/
   # Powinny być: deep-verify.agent.md, deep-explore.agent.md, etc.
   ```

3. **Test w VS Code:**
   - Otwórz Copilot Chat
   - Wpisz `@` — powinieneś zobaczyć `@deep-verify`, `@deep-explore`, etc.
   - Spróbuj: `@deep-verify Check the API`

### Claude Marketplace Workflow:

1. **Bump version:**
   ```bash
   # Edytuj packages/claude-plugin/.claude-plugin/plugin.json
   # Zmień "version": "1.0.0" → "1.0.1"
   ```

2. **Commit + push:**
   ```bash
   git add packages/claude-plugin/.claude-plugin/plugin.json
   git commit -m "Bump Claude plugin to v1.0.1"
   git push
   ```

3. **Sprawdzenie:**
   - Idź do GitHub Actions
   - Workflow "Create Claude Plugin Release" powinien się uruchomić
   - Sprawdź Releases — powinien być nowy release `claude-plugin-v1.0.1`

---

## 📦 Deliverables

- ✅ `packages/claude-plugin/` — kompletny plugin
  - `.claude-plugin/plugin.json`
  - `commands/` — 5 plików .md
  - `processes/` — symlink lub kopia
  - `README.md`

- ✅ `packages/copilot-agents/` — kompletny package z agentami
  - `agents/` — 5 plików .agent.md
  - `processes/` — symlink lub kopia
  - `README.md`

- ✅ `.github/workflows/release-claude.yml` — auto-release workflow

- ✅ `README.md` — zaktualizowany z 3 opcjami instalacji

- ✅ `.gitignore` — dodany `plans/`

---

## 🚀 Next Steps

Po dokończeniu Fazy 1:
- **Faza 0:** Setup monorepo (pnpm workspaces, @deep-process/core)
- **Faza 2:** VS Code Extension
- **Faza 3:** Gemini, Continue, Cursor, Cline
- **Faza 4:** MCP Server (na końcu)
