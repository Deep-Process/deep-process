# Debugging Deep Process VS Code Extension

## Quick Debug Workflow

### Method 1: Extension Development Host (Live Debugging)

**Najlepsza metoda do debugowania błędów!**

```powershell
cd packages/vscode
code .
```

W VS Code:
1. **Press F5** - uruchomi Extension Development Host
2. **Nowe okno VS Code** otworzy się z załadowaną wtyczką
3. **Otwórz workspace** w nowym oknie
4. **Testuj extension**
5. **Ctrl+R** w dev host window - przeładuj po zmianach

### Sprawdzanie błędów:

#### 1. Output Panel
```
View → Output (Ctrl+Shift+U)
Dropdown → "Extension Host"
```

Wszystkie console.log() i błędy extension pojawią się tutaj.

#### 2. Developer Tools Console
```
Help → Toggle Developer Tools
```

Console tab pokazuje JavaScript errors i logs.

#### 3. Breakpoints w VS Code

W głównym oknie (nie dev host):
1. Otwórz plik TypeScript (np. `src/commands/install.ts`)
2. Kliknij na marginesie linii - postaw breakpoint (czerwona kropka)
3. W dev host wykonaj akcję (np. Install Processes)
4. VS Code zatrzyma się na breakpoint
5. Sprawdź zmienne, stack trace, etc.

## Common Issues & Solutions

### "paths[0] undefined" - NAPRAWIONE ✓

**Problem:** Extension nie miał dostępu do procesów

**Fix:**
- Dodano `scripts/copy-processes.js`
- Procesy kopiowane przed buildem
- Teraz są w package

### Save/Install buttons nie działają - NAPRAWIONE ✓

**Problem:** Webview nie obsługiwał 'install' message

**Fix:**
- Dodano handler dla 'install' w config-panel.ts
- Poprawiono webview HTML button handler

### Brak ikony w Activity Bar - NAPRAWIONE ✓

**Problem:** icon.svg nie istniał

**Fix:**
- Stworzono profesjonalną icon.svg
- Dodano do media/

### Gemini CLI/Copilot Chat nie wykrywane - NAPRAWIONE ✓

**Problem:** Złe extension IDs lub command names

**Fix:**
- Dodano GitHub Copilot Chat (GitHub.copilot-chat)
- Dodano detectCLIMultiple dla variations Gemini

## Debugging Specific Features

### Configuration Panel

**Sprawdź:**
1. Panel się otwiera?
   ```
   Deep Process icon w Activity Bar → Click
   ```

2. Tools są wykrywane?
   ```typescript
   // W src/detectors/tool-detector.ts
   console.log('Detected tools:', detectTools());
   ```

3. Save button działa?
   ```typescript
   // W src/ui/webview/config-panel.ts
   private async _saveConfig(enabledTools: string[]) {
     console.log('Saving config:', enabledTools);
     // ...
   }
   ```

### Install Command

**Sprawdź:**
1. Workspace folder otwarty?
2. Processes są załadowane?
   ```typescript
   // W src/commands/install.ts
   const manifests = loadAllManifests();
   console.log('Found manifests:', manifests.length);
   ```

3. Path resolution działa?
   ```typescript
   const targetDir = resolveProcessBaseDir(pathCtx);
   console.log('Target dir:', targetDir);
   ```

### Chat Participant

**Sprawdź:**
1. GitHub Copilot Chat zainstalowany?
2. Chat API dostępny?
   ```typescript
   // W src/extension.ts
   console.log('Chat API available:', !!(vscode as any).chat);
   ```

3. Processes załadowane?
   ```typescript
   // W src/chat/participant.ts
   console.log('Loading workflow from:', processDir);
   ```

## Diagnostic Commands

### Check Extension State

```typescript
// W Extension Development Host console
// (Help → Toggle Developer Tools → Console)

// Check if extension loaded
vscode.extensions.all.find(e => e.id === 'deep-process.deep-process-vscode')

// Check commands registered
vscode.commands.getCommands().then(cmds =>
  cmds.filter(c => c.startsWith('deep-process'))
)

// Check configuration
vscode.workspace.getConfiguration('deep-process').get('enabledTools')
```

### Check File System

```powershell
# Sprawdź czy processes są w extension
ls packages/vscode/processes/

# Sprawdź czy są w bundled extension
code --install-extension packages/vscode/*.vsix
# Potem w Extension Host:
ls ~/.vscode/extensions/deep-process.deep-process-vscode-1.0.0/processes/
```

### Check Logs

```powershell
# VS Code logs directory
cd $env:APPDATA\Code\logs
# lub
~/.config/Code/logs/  # Linux
~/Library/Application Support/Code/logs/  # Mac

# Najnowszy log
ls -lt | head -1
```

## Known Limitations

### esbuild Bundling

esbuild bundluje TypeScript do JavaScript, ale:
- `import.meta.dirname` może nie działać w bundle
- File system paths mogą być relative do bundle location
- Dynamic imports mogą nie działać

**Solution:** Używamy `context.extensionPath` z VS Code API

### Workspace Dependencies

Extension używa `@deep-process/core` jako workspace dependency:
- Musi być zbudowany przed extension
- Jeśli zmienisz core, rebuild extension

## Rebuild After Changes

### Quick Rebuild (bez przeładowania)

```powershell
cd packages/vscode
pnpm run build
# W Extension Development Host: Ctrl+R
```

### Full Rebuild (z przeładowaniem)

```powershell
cd packages/vscode
pnpm run build
pnpm run package
code --uninstall-extension deep-process.deep-process-vscode
code --install-extension deep-process-vscode-1.0.0.vsix
# Reload VS Code
```

### Core Package Changed

```powershell
cd packages/core
pnpm run build

cd ../vscode
pnpm run build
```

## Performance Profiling

### Startup Performance

```typescript
// W src/extension.ts activate()
const start = Date.now();
// ... your code ...
console.log('Activation took:', Date.now() - start, 'ms');
```

### Command Performance

```typescript
// W command function
export async function installCommand(context: vscode.ExtensionContext) {
  const start = Date.now();
  // ... your code ...
  console.log('Install took:', Date.now() - start, 'ms');
}
```

## UI Debugging

### Webview Debugging

Webview to oddzielna przeglądarka wewnątrz VS Code:

1. **W Extension Development Host:**
   - Otwórz Deep Process panel
   - Help → Toggle Developer Tools
   - Console → Wybierz webview frame z dropdown
   - Wszystkie webview logs/errors są tutaj

2. **Sprawdź message passing:**
   ```javascript
   // W webview HTML
   console.log('Sending message:', { type: 'install', enabledTools });
   vscode.postMessage({ type: 'install', enabledTools });
   ```

   ```typescript
   // W config-panel.ts
   webviewView.webview.onDidReceiveMessage(data => {
     console.log('Received message:', data);
   });
   ```

### Status Bar Debugging

```typescript
// W src/ui/status-bar.ts
export function updateStatusBar(statusBar: vscode.StatusBarItem, tools: DetectedTool[]): void {
  console.log('Updating status bar, detected tools:', tools.length);
  // ...
}
```

## Automated Testing (Future)

```typescript
import * as vscode from 'vscode';
import * as assert from 'assert';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension activates', async () => {
    const ext = vscode.extensions.getExtension('deep-process.deep-process-vscode');
    assert.ok(ext);
    await ext!.activate();
    assert.ok(ext!.isActive);
  });

  test('Commands registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('deep-process.configure'));
    assert.ok(commands.includes('deep-process.install'));
  });
});
```

## Getting Help

If you're stuck:
1. Check Output panel (Extension Host)
2. Check Developer Tools console
3. Set breakpoints and step through
4. Add console.log() statements
5. Check file exists: `fs.existsSync(path)`
6. Check VS Code version compatibility (requires 1.85.0+)

## Common VS Code API Gotchas

### Workspace Folders

```typescript
// ❌ Wrong - może być undefined
const root = vscode.workspace.workspaceFolders[0].uri.fsPath;

// ✓ Correct - sprawdź najpierw
const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
if (!workspaceFolder) {
  vscode.window.showErrorMessage('No workspace folder open');
  return;
}
const root = workspaceFolder.uri.fsPath;
```

### File System Operations

```typescript
// ❌ Wrong - sync operations mogą blokować
fs.writeFileSync(path, content);

// ✓ Correct - użyj VS Code API (async)
await vscode.workspace.fs.writeFile(
  vscode.Uri.file(path),
  Buffer.from(content, 'utf-8')
);
```

### Configuration Updates

```typescript
// ❌ Wrong - update bez scope
config.update('enabledTools', tools);

// ✓ Correct - określ scope
config.update('enabledTools', tools, vscode.ConfigurationTarget.Workspace);
```
