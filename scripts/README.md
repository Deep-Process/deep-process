# Scripts

Comprehensive build, publish, and development tools for all Deep Process plugins.

## Directory Structure

```
scripts/
├── build/          # Build scripts for each plugin/package
├── publish/        # Publication scripts for npm, VS Code Marketplace, etc.
├── dev/            # Local development and testing tools
└── config/         # Configuration and secrets management
```

## Quick Start

### Local Development

**VS Code Extension:**
```powershell
# Build and install locally for testing
.\scripts\dev\vscode-dev.ps1

# Uninstall
.\scripts\dev\vscode-uninstall.ps1

# Test tool detection
.\scripts\dev\test-detection.ps1
```

**NPM Package:**
```powershell
# Build npm package
.\scripts\build\build-npm.ps1

# Test locally
cd packages/cli
node dist/cli.js --help
```

### Build Everything

```powershell
# Build all packages
.\scripts\build\build-all.ps1

# Build specific package
.\scripts\build\build-npm.ps1
.\scripts\build\build-vscode.ps1
```

### Publishing

**Setup tokens first:**
```powershell
# Copy example and fill in your tokens
cp scripts/config/secrets.example.json scripts/config/.secrets
# Edit .secrets with your tokens
```

**Publish to npm:**
```powershell
.\scripts\publish\publish-npm.ps1           # patch version
.\scripts\publish\publish-npm.ps1 -BumpType minor
.\scripts\publish\publish-npm.ps1 -BumpType major
```

**Publish to VS Code Marketplace:**
```powershell
.\scripts\publish\publish-vscode.ps1        # patch version
.\scripts\publish\publish-vscode.ps1 -BumpType minor
```

## Build Scripts

### `build/build-all.ps1`
Builds all packages in dependency order:
1. `@deep-process/core` (shared utilities)
2. `deep-process` CLI (npm package)
3. VS Code extension (.vsix)

**Usage:**
```powershell
.\scripts\build\build-all.ps1                 # Full build
.\scripts\build\build-all.ps1 -SkipInstall    # Skip pnpm install
.\scripts\build\build-all.ps1 -Clean          # Clean before build
.\scripts\build\build-all.ps1 -Verbose        # Verbose output
```

### `build/build-npm.ps1`
Builds the npm package (CLI + core).

**Usage:**
```powershell
.\scripts\build\build-npm.ps1
.\scripts\build\build-npm.ps1 -SkipInstall
```

### `build/build-vscode.ps1`
Builds and packages the VS Code extension (.vsix file).

**Usage:**
```powershell
.\scripts\build\build-vscode.ps1
.\scripts\build\build-vscode.ps1 -SkipInstall
```

## Publish Scripts

### `publish/publish-all-npm.ps1` ⭐ (Recommended)
Publishes both `@deep-process/core` and `deep-process` CLI in correct order.

**Usage:**
```powershell
.\scripts\publish\publish-all-npm.ps1                # patch both
.\scripts\publish\publish-all-npm.ps1 -BumpType minor # minor both
.\scripts\publish\publish-all-npm.ps1 -CoreOnly      # only core
.\scripts\publish\publish-all-npm.ps1 -CliOnly       # only CLI
```

**What it does:**
1. Publishes `@deep-process/core` first
2. Waits for npm registry to update
3. Updates CLI to use new core version
4. Publishes `deep-process` CLI

### `publish/publish-core.ps1`
Publishes `@deep-process/core` package only.

**Usage:**
```powershell
.\scripts\publish\publish-core.ps1                    # patch
.\scripts\publish\publish-core.ps1 -BumpType minor    # minor
```

### `publish/publish-npm.ps1`
Publishes the `deep-process` CLI package only (not core).

**Requirements:**
- `NPM_TOKEN` environment variable or in `.secrets`
- npm account with publishing rights

**Usage:**
```powershell
.\scripts\publish\publish-npm.ps1                    # patch
.\scripts\publish\publish-npm.ps1 -BumpType minor    # minor
.\scripts\publish\publish-npm.ps1 -BumpType major    # major
```

**What it does:**
1. Builds `@deep-process/core` (dependency)
2. Bumps version in CLI package.json
3. Builds CLI
4. Shows dry-run preview
5. Confirms with user
6. Publishes to npm with `--access public`

### `publish/publish-vscode.ps1`
Publishes the VS Code extension to Visual Studio Marketplace.

**Requirements:**
- `VSCE_PAT` environment variable or in `.secrets`
- Azure DevOps personal access token with Marketplace > Manage scope

**Usage:**
```powershell
.\scripts\publish\publish-vscode.ps1                 # patch
.\scripts\publish\publish-vscode.ps1 -BumpType minor # minor
.\scripts\publish\publish-vscode.ps1 -DryRun         # test without publishing
```

**What it does:**
1. Bumps version in package.json
2. Builds and packages extension
3. Confirms with user
4. Publishes to VS Code Marketplace

## Development Scripts

### `dev/vscode-dev.ps1`
**The essential dev tool!** Builds, uninstalls old version, and installs fresh .vsix locally.

**Usage:**
```powershell
.\scripts\dev\vscode-dev.ps1              # Build and install
.\scripts\dev\vscode-dev.ps1 -SkipBuild   # Install existing .vsix
.\scripts\dev\vscode-dev.ps1 -NoReload    # Skip reload prompt
```

**Perfect for:**
- Rapid iteration during development
- Testing changes locally before publishing
- Debugging extension issues

**After running:**
1. Reload VS Code (Ctrl+Shift+P → "Developer: Reload Window")
2. Check Output panel (Ctrl+Shift+U → "Extension Host")
3. Test your changes!

### `dev/vscode-uninstall.ps1`
Uninstalls the deep-process VS Code extension.

**Usage:**
```powershell
.\scripts\dev\vscode-uninstall.ps1
```

### `dev/test-detection.ps1`
Tests tool detection (Gemini CLI, GitHub Copilot, etc).

**Usage:**
```powershell
.\scripts\dev\test-detection.ps1
```

**Checks:**
- Gemini CLI detection (tries: gemini, gemini-cli, gcloud, google-gemini)
- GitHub Copilot extensions installed

## Configuration

### Setting Up Secrets

**Option 1: File (Recommended)**
```powershell
# Copy example
cp scripts/config/secrets.example.json scripts/config/.secrets

# Edit with your tokens
notepad scripts/config/.secrets
```

**Option 2: Environment Variables**
```powershell
$env:NPM_TOKEN = "npm_xxxxx"
$env:VSCE_PAT = "xxxxx"
```

See [`config/README.md`](config/README.md) for detailed instructions on getting tokens.

## GitHub Actions

The `.github/workflows/` directory contains automated CI/CD:

- **`publish-npm.yml`** - Auto-publish to npm when version changes
- **`publish-vscode.yml`** - Auto-publish to VS Code Marketplace
- **`release-claude.yml`** - Create GitHub releases for Claude Marketplace

These workflows use GitHub Secrets (not local `.secrets` file):
1. Go to repo Settings → Secrets and variables → Actions
2. Add `NPM_TOKEN`, `VSCE_PAT`, etc.

## Common Workflows

### Making Changes to VS Code Extension

```powershell
# 1. Make your code changes in packages/vscode/src/

# 2. Test locally
.\scripts\dev\vscode-dev.ps1

# 3. Reload VS Code and test
# Ctrl+Shift+P → "Developer: Reload Window"

# 4. Repeat 1-3 until satisfied

# 5. Publish when ready
.\scripts\publish\publish-vscode.ps1
```

### Publishing a New Version

**NPM Package:**
```powershell
# Build and test
.\scripts\build\build-npm.ps1
cd packages/cli
node dist/cli.js --help  # Test it works

# Publish
.\scripts\publish\publish-npm.ps1 -BumpType patch
```

**VS Code Extension:**
```powershell
# Build and test locally first
.\scripts\dev\vscode-dev.ps1
# Test thoroughly in VS Code

# Publish
.\scripts\publish\publish-vscode.ps1 -BumpType patch
```

### Full Release (All Platforms)

```powershell
# 1. Build everything
.\scripts\build\build-all.ps1

# 2. Test locally
.\scripts\dev\vscode-dev.ps1
cd packages/cli && node dist/cli.js --help

# 3. Publish npm
.\scripts\publish\publish-npm.ps1 -BumpType minor

# 4. Publish VS Code
.\scripts\publish\publish-vscode.ps1 -BumpType minor

# 5. GitHub Actions will create releases automatically
```

## Troubleshooting

### "Token not found"
- Check `.secrets` file exists: `scripts/config/.secrets`
- Verify JSON is valid
- See [`config/README.md`](config/README.md) for token setup

### "Build failed"
- Run `pnpm install` first
- Check Node.js version (need v18+)
- Try clean build: `.\scripts\build\build-all.ps1 -Clean`

### "VSIX not found"
- Build first: `.\scripts\build\build-vscode.ps1`
- Check `packages/vscode/` for .vsix file
- Try full rebuild: `.\scripts\build\build-all.ps1 -Clean`

### "Extension not detected after install"
- Reload VS Code: Ctrl+Shift+P → "Developer: Reload Window"
- Check installed: `code --list-extensions | findstr deep-process`
- Check Output panel: Ctrl+Shift+U → "Extension Host"

## Script Parameters

Most scripts support common parameters:

- `-SkipInstall` - Skip `pnpm install` (faster if deps unchanged)
- `-Verbose` - Show detailed output
- `-Clean` - Remove build artifacts first
- `-DryRun` - Test publish without actually publishing
- `-BumpType` - Version bump type: `patch`, `minor`, `major`

## Getting Help

Each script has built-in help:
```powershell
Get-Help .\scripts\build\build-all.ps1 -Full
Get-Help .\scripts\dev\vscode-dev.ps1 -Detailed
```

Or check the script header comments for usage examples.
