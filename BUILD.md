# Build Guide

## Quick Start

### Build wszystkiego (bez publish)

```powershell
.\build-all.ps1
```

To zrobi:
1. ✓ Zainstaluje dependencies (pnpm install)
2. ✓ Zbuduje `@deep-process/core`
3. ✓ Zbuduje `deep-process` CLI
4. ✓ Zbundluje i spakuje VS Code extension (.vsix)

### Opcje

```powershell
# Pomiń instalację dependencies (jeśli już zainstalowane)
.\build-all.ps1 -SkipInstall

# Wyczyść przed buildem (usuń node_modules, dist, itp.)
.\build-all.ps1 -Clean

# Verbose output (szczegóły)
.\build-all.ps1 -Verbose

# Kombinacje
.\build-all.ps1 -Clean -Verbose
```

## Testowanie VS Code Extension

### Metoda 1: Instalacja z .vsix (Zalecana)

```powershell
# 1. Zbuduj extension
.\build-all.ps1

# 2. Zainstaluj w VS Code
code --install-extension packages/vscode/deep-process-vscode-1.0.0.vsix

# 3. Przeładuj VS Code
# Ctrl+Shift+P → "Developer: Reload Window"
```

**Lub przez GUI:**
1. Otwórz VS Code
2. `Ctrl+Shift+P` → "Extensions: Install from VSIX"
3. Wybierz: `packages/vscode/deep-process-vscode-1.0.0.vsix`
4. Kliknij "Install"
5. Reload VS Code

### Metoda 2: Extension Development Host (Live Debugging)

```powershell
# 1. Otwórz VS Code w katalogu extension
cd packages/vscode
code .

# 2. W VS Code:
# - Naciśnij F5
# - Otworzy się nowe okno VS Code z załadowaną wtyczką

# 3. Testuj zmiany:
# - Modyfikuj kod w głównym oknie
# - Ctrl+R w oknie dev host → przeładuje wtyczkę
```

## Testowanie CLI

```powershell
# Po zbudowaniu
cd packages/cli
node dist/cli.js --help

# Lub globalnie (po npm link)
npm link
deep-process --help
```

## Build pojedynczych pakietów

### Core

```powershell
cd packages/core
pnpm run build
```

### CLI

```powershell
cd packages/cli
pnpm run build
```

### VS Code Extension

```powershell
cd packages/vscode

# Bundle z esbuild
pnpm run build

# Lub kompiluj TypeScript (dev)
pnpm run compile

# Pakuj do .vsix
pnpm run package

# Watch mode (auto-rebuild)
pnpm run watch
```

## Struktura Output

Po buildzie:

```
deep-process_org/
├── packages/
│   ├── core/
│   │   └── dist/              ← Compiled TypeScript
│   │       ├── index.js
│   │       ├── process-registry.js
│   │       └── ...
│   ├── cli/
│   │   └── dist/              ← Compiled TypeScript
│   │       ├── cli.js
│   │       ├── commands/
│   │       └── ...
│   └── vscode/
│       ├── dist/
│       │   └── extension.js   ← Bundled (esbuild)
│       └── deep-process-vscode-1.0.0.vsix  ← Package
```

## Checklist testowania VS Code

Po zainstalowaniu extension, sprawdź:

### ✓ Podstawowe

- [ ] Extension aktywuje się bez błędów
- [ ] Status bar pokazuje "🚀 Deep Process"
- [ ] Ikona Deep Process w Activity Bar
- [ ] Wszystkie komendy dostępne (`Ctrl+Shift+P`)

### ✓ Konfiguracja

- [ ] Panel konfiguracji otwiera się
- [ ] Wykrywa zainstalowane narzędzia AI
- [ ] Checkboxy działają
- [ ] "Save Configuration" zapisuje
- [ ] "Save & Install" instaluje procesy

### ✓ Instalacja procesów

- [ ] `Deep Process: Install` kopiuje pliki
- [ ] Tworzy `_deep-process/` w workspace
- [ ] Tworzy `deep-process.config.yaml`
- [ ] Dodaje do `.gitignore`
- [ ] Status bar zmienia się na ✓ (zielony)

### ✓ Chat Participant (jeśli GitHub Copilot)

- [ ] `@deep-process` widoczny w chat
- [ ] `/verify`, `/explore`, `/document`, `/feasibility`, `/synthesis`
- [ ] Ładuje workflow przy użyciu komendy

Pełna lista: `packages/vscode/TESTING.md`

## Troubleshooting

### "pnpm is not installed"

```powershell
npm install -g pnpm
```

### "Build failed" dla core/cli

```powershell
# Upewnij się że dependencies są zainstalowane
pnpm install --frozen-lockfile

# Sprawdź błędy TypeScript
cd packages/core
pnpm run compile
```

### "VSIX packaging failed"

```powershell
# Sprawdź czy bundle się zbudował
ls packages/vscode/dist/extension.js

# Sprawdź czy vsce jest zainstalowane
cd packages/vscode
pnpm install
```

### Extension nie działa po instalacji

```powershell
# 1. Odinstaluj
code --uninstall-extension deep-process.deep-process-vscode

# 2. Zbuduj ponownie
.\build-all.ps1 -Clean

# 3. Zainstaluj ponownie
code --install-extension packages/vscode/*.vsix
```

## Continuous Integration

GitHub Actions builduje automatycznie przy push do main:

- `.github/workflows/publish-npm.yml` - CLI package
- `.github/workflows/publish-vscode.yml` - VS Code extension
- `.github/workflows/release-claude.yml` - Claude Code plugin

**Lokalny build = bez publish!**

## Performance

Typowe czasy buildu (laptop Windows 11, 16GB RAM):

- Core: ~5s
- CLI: ~8s
- VS Code (bundle): ~2s
- VS Code (package): ~5s
- **Total: ~20s**

Optymalizacje:
- `-SkipInstall` oszczędza ~10s jeśli dependencies już są
- Watch mode (`pnpm run watch`) dla live development
