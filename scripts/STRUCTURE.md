# Scripts Directory Structure

Complete overview of the organized build/publish/dev tooling.

## Directory Tree

```
scripts/
├── build/
│   ├── build-all.ps1          # Build all packages
│   ├── build-npm.ps1           # Build NPM package (core + CLI)
│   └── build-vscode.ps1        # Build VS Code extension (.vsix)
│
├── publish/
│   ├── publish-npm.ps1         # Publish to npm registry
│   └── publish-vscode.ps1      # Publish to VS Code Marketplace
│
├── dev/
│   ├── vscode-dev.ps1          # Build + install VS Code locally (essential!)
│   ├── vscode-uninstall.ps1    # Uninstall VS Code extension
│   └── test-detection.ps1      # Test tool detection (Gemini CLI, Copilot, etc)
│
├── config/
│   ├── secrets.example.json    # Example secrets file (copy to .secrets)
│   └── README.md               # How to get tokens, setup secrets
│
├── README.md                   # Complete documentation
└── STRUCTURE.md                # This file
```

## What Each Script Does

### Build Scripts (`scripts/build/`)

**`build-all.ps1`** - Master build script
- Builds all packages in correct dependency order
- Runs `pnpm install` (unless `-SkipInstall`)
- Builds: @deep-process/core → CLI → VS Code extension
- Outputs:
  - `packages/core/dist/` - Core utilities
  - `packages/cli/dist/` - CLI package
  - `packages/vscode/dist/` - Extension bundle
  - `packages/vscode/*.vsix` - Installable extension

**`build-npm.ps1`** - NPM package only
- Builds @deep-process/core
- Builds deep-process CLI
- Faster when you only need npm package

**`build-vscode.ps1`** - VS Code extension only
- Builds @deep-process/core (dependency)
- Builds VS Code extension
- Packages into .vsix file
- Shows install command

### Publish Scripts (`scripts/publish/`)

**`publish-npm.ps1`** - Publish to npm
- Bumps version (patch/minor/major)
- Runs build
- Shows dry-run preview
- Confirms with user
- Publishes to npm with `--access public`
- Requires: `NPM_TOKEN` environment variable or in `.secrets`

**`publish-vscode.ps1`** - Publish to VS Code Marketplace
- Bumps version in package.json
- Builds and packages extension
- Confirms with user
- Publishes to Visual Studio Marketplace
- Requires: `VSCE_PAT` environment variable or in `.secrets`
- Creates GitHub release automatically

### Dev Scripts (`scripts/dev/`)

**`vscode-dev.ps1`** - THE essential dev tool! ⭐
- Builds VS Code extension
- Uninstalls old version
- Installs fresh .vsix locally
- Perfect for rapid iteration during development
- Use this constantly while developing extension

**`vscode-uninstall.ps1`** - Uninstall extension
- Removes deep-process-vscode from local VS Code
- Use when you want clean state

**`test-detection.ps1`** - Test tool detection
- Tests Gemini CLI detection (tries all variants)
- Checks GitHub Copilot extensions
- Useful for debugging tool detection issues

### Config (`scripts/config/`)

**`secrets.example.json`** - Template for secrets
- Copy to `.secrets` (gitignored!)
- Fill in your tokens
- Scripts auto-load from this file

**`README.md`** - Complete token setup guide
- How to get NPM_TOKEN
- How to get VSCE_PAT (VS Code Marketplace)
- How to get Claude API key
- GitHub Actions setup
- Security best practices

## Common Workflows

### Developing VS Code Extension

```powershell
# 1. Make code changes in packages/vscode/src/

# 2. Build and install locally
.\scripts\dev\vscode-dev.ps1

# 3. Reload VS Code
# Ctrl+Shift+P → "Developer: Reload Window"

# 4. Test changes

# 5. Repeat 1-4 until satisfied

# 6. When ready to publish:
.\scripts\publish\publish-vscode.ps1
```

### Publishing New Version

**Patch release (bug fixes):**
```powershell
.\scripts\publish\publish-npm.ps1           # 1.0.0 → 1.0.1
.\scripts\publish\publish-vscode.ps1        # 1.0.0 → 1.0.1
```

**Minor release (new features):**
```powershell
.\scripts\publish\publish-npm.ps1 -BumpType minor      # 1.0.0 → 1.1.0
.\scripts\publish\publish-vscode.ps1 -BumpType minor   # 1.0.0 → 1.1.0
```

**Major release (breaking changes):**
```powershell
.\scripts\publish\publish-npm.ps1 -BumpType major      # 1.0.0 → 2.0.0
.\scripts\publish\publish-vscode.ps1 -BumpType major   # 1.0.0 → 2.0.0
```

### First Time Setup

```powershell
# 1. Clone repo
git clone https://github.com/deep-process-org/deep-process
cd deep-process

# 2. Install dependencies
pnpm install

# 3. Build everything
.\scripts\build\build-all.ps1

# 4. Test VS Code extension locally
.\scripts\dev\vscode-dev.ps1

# 5. Setup secrets for publishing
cp scripts/config/secrets.example.json scripts/config/.secrets
# Edit .secrets with your tokens

# 6. Ready to publish!
```

## Parameters Reference

Most scripts support these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `-SkipInstall` | Switch | Skip `pnpm install` (faster if deps unchanged) |
| `-Verbose` | Switch | Show detailed output |
| `-Clean` | Switch | Remove build artifacts first |
| `-BumpType` | String | Version bump: `patch`, `minor`, `major` |
| `-DryRun` | Switch | Test publish without actually publishing |
| `-NoReload` | Switch | Skip reload prompt (vscode-dev only) |
| `-SkipBuild` | Switch | Skip build step (vscode-dev only) |

Examples:
```powershell
# Fast build (skip install)
.\scripts\build\build-all.ps1 -SkipInstall

# Clean build
.\scripts\build\build-all.ps1 -Clean

# Test publish without publishing
.\scripts\publish\publish-vscode.ps1 -DryRun

# Install existing .vsix without rebuilding
.\scripts\dev\vscode-dev.ps1 -SkipBuild
```

## Environment Variables

Scripts check these environment variables (or load from `.secrets`):

- `NPM_TOKEN` - npm authentication token
- `VSCE_PAT` - VS Code Marketplace personal access token
- `CLAUDE_API_KEY` - (optional) Claude API key
- `GITHUB_TOKEN` - (optional) GitHub token for releases

Set via:
```powershell
# Option 1: Environment variable
$env:NPM_TOKEN = "npm_xxxxxxxxxxxxx"

# Option 2: .secrets file (recommended)
# Edit scripts/config/.secrets
```

## GitHub Actions Integration

The `.github/workflows/` directory uses these workflows:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `publish-npm.yml` | Push to main (package.json changed) | Auto-publish to npm |
| `publish-vscode.yml` | Push to main (vscode package.json changed) | Auto-publish to VS Code Marketplace + Create GitHub release |
| `release-claude.yml` | Push to main (plugin.json changed) | Create GitHub release for Claude Marketplace |

**Setup:**
1. Go to repo Settings → Secrets and variables → Actions
2. Add secrets:
   - `NPM_TOKEN` - for npm publishing
   - `VSCE_PAT` - for VS Code Marketplace

## Migration from Old Structure

**Old (before reorganization):**
```
deep-process/
├── build-all.ps1          ← Root level (messy)
├── publish.ps1            ← Root level (messy)
└── test-detection.ps1     ← Root level (messy)
```

**New (organized):**
```
deep-process/
├── scripts/
│   ├── build/build-all.ps1
│   ├── publish/publish-npm.ps1
│   └── dev/test-detection.ps1
└── (clean root directory)
```

**What changed:**
- ✅ All scripts moved to `scripts/`
- ✅ Organized by purpose (build/publish/dev)
- ✅ Added secrets management
- ✅ Added VS Code dev tools
- ✅ Added comprehensive documentation
- ✅ Updated GitHub workflows
- ✅ Clean root directory

**Update your commands:**
```powershell
# Old
.\build-all.ps1

# New
.\scripts\build\build-all.ps1
```

## Tips

1. **Use `vscode-dev.ps1` constantly** during VS Code extension development
2. **Always test locally** before publishing with `.\scripts\dev\vscode-dev.ps1`
3. **Check `.secrets` file** if publish scripts say "token not found"
4. **Use `-SkipInstall`** for faster builds when dependencies haven't changed
5. **Use `-DryRun`** to test publish scripts without actually publishing
6. **Check Output panel** in VS Code (Ctrl+Shift+U → "Extension Host") for errors

## Troubleshooting

**"Token not found"**
- Check `scripts/config/.secrets` exists and is valid JSON
- See `scripts/config/README.md` for token setup

**"Build failed"**
- Try clean build: `.\scripts\build\build-all.ps1 -Clean`
- Run `pnpm install` manually first
- Check Node.js version (need v18+)

**"Extension not detected after install"**
- Reload VS Code: Ctrl+Shift+P → "Developer: Reload Window"
- Check installed: `code --list-extensions | findstr deep-process`
- Use `.\scripts\dev\vscode-dev.ps1` to reinstall

**"VSIX not found"**
- Build first: `.\scripts\build\build-vscode.ps1`
- Check `packages/vscode/*.vsix` exists

## Getting Help

All scripts have built-in help:
```powershell
Get-Help .\scripts\build\build-all.ps1 -Full
Get-Help .\scripts\dev\vscode-dev.ps1 -Detailed
```

Or check:
- `scripts/README.md` - Complete documentation
- `scripts/config/README.md` - Token setup guide
- Main `README.md` - Project overview
