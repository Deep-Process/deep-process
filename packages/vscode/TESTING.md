# Testing Deep Process VS Code Extension

## Quick Test Guide

### Method 1: Install from .vsix file (Recommended for testing)

1. **Build the extension:**
   ```powershell
   cd packages/vscode
   pnpm run build
   pnpm run package
   ```

2. **Install in VS Code:**
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Extensions: Install from VSIX`
   - Select the `.vsix` file: `packages/vscode/deep-process-vscode-1.0.0.vsix`
   - Click "Install"
   - Reload VS Code when prompted

3. **Verify installation:**
   - Check Extensions panel (`Ctrl+Shift+X`)
   - Search for "Deep Process"
   - Should show as installed with version 1.0.0

### Method 2: Run in Extension Development Host

1. **Open extension in VS Code:**
   ```powershell
   cd packages/vscode
   code .
   ```

2. **Build the extension:**
   - Press `Ctrl+Shift+B` to run build task
   - Or run: `pnpm run build` in terminal

3. **Launch Extension Development Host:**
   - Press `F5`
   - A new VS Code window opens with extension loaded
   - This window has the extension activated for testing

4. **Test changes live:**
   - Make code changes in main window
   - Press `Ctrl+R` in dev host window to reload with changes
   - Or use "Developer: Reload Window" command

## Testing Checklist

### Core Functionality

#### 1. Extension Activation
- [ ] Extension activates without errors
- [ ] Status bar shows "🚀 Deep Process"
- [ ] Deep Process icon appears in Activity Bar

#### 2. Commands Available
Open Command Palette (`Ctrl+Shift+P`), verify these commands exist:
- [ ] `Deep Process: Configure`
- [ ] `Deep Process: Install Processes`
- [ ] `Deep Process: Update Processes`
- [ ] `Deep Process: Uninstall`
- [ ] `Deep Process: Deep Verify`
- [ ] `Deep Process: Deep Explore`
- [ ] `Deep Process: Deep Document`
- [ ] `Deep Process: Deep Feasibility`
- [ ] `Deep Process: Deep Synthesis`

#### 3. Configuration Panel
- [ ] Click Deep Process icon in Activity Bar
- [ ] Configuration panel opens in sidebar
- [ ] Shows "VS Code Extensions" section
- [ ] Shows "CLI Tools" section
- [ ] Detected tools have ✓ checkmark (green)
- [ ] Uninstalled tools have ✗ (red) and disabled checkboxes
- [ ] "Save Configuration" button works
- [ ] "Save & Install" button works

#### 4. Tool Detection
The extension should detect these if installed:
- [ ] GitHub Copilot (extension)
- [ ] Continue.dev (extension)
- [ ] Cline (extension)
- [ ] Windsurf (extension)
- [ ] Roo Code (extension)
- [ ] Claude CLI (command line tool)
- [ ] Gemini CLI (command line tool)

#### 5. Process Installation
Run `Deep Process: Install Processes`:
- [ ] Shows progress indicator
- [ ] Creates `_deep-process/` directory in workspace
- [ ] Copies all process files (verify with File Explorer)
- [ ] Creates `_deep-process/deep-process.config.yaml` in workspace root
- [ ] Adds `_deep-process/` to `.gitignore`
- [ ] Shows success message with count
- [ ] Status bar updates to show ✓ with green color

#### 6. Status Bar
Before installation:
- [ ] Shows "🚀 Deep Process"
- [ ] Tooltip: "Deep Process (not installed)"
- [ ] Shows detected tool count

After installation:
- [ ] Shows "✓ Deep Process" with green color
- [ ] Tooltip shows: processes installed, tools configured, detected count
- [ ] Click status bar opens configuration

#### 7. Update Processes
Run `Deep Process: Update Processes`:
- [ ] If processes up-to-date, shows "All processes are up to date"
- [ ] If outdated, shows list of processes to update
- [ ] Updates successfully with progress indicator
- [ ] Updates version in config file

#### 8. Uninstall
Run `Deep Process: Uninstall`:
- [ ] Shows confirmation dialog with details
- [ ] Removes `_deep-process/` directory
- [ ] Removes `_deep-process/deep-process.config.yaml`
- [ ] Removes entry from `.gitignore`
- [ ] Clears workspace configuration
- [ ] Status bar reverts to "not installed" state

#### 9. GitHub Copilot Chat Integration (if Copilot installed)
In GitHub Copilot Chat:
- [ ] Type `@deep-process` - should show participant
- [ ] Type `@deep-process /` - should show 5 commands:
  - [ ] `/verify`
  - [ ] `/explore`
  - [ ] `/document`
  - [ ] `/feasibility`
  - [ ] `/synthesis`
- [ ] Run `@deep-process /verify` - should load workflow
- [ ] Verify workflow.md content appears
- [ ] Verify first step content appears
- [ ] Verify process instructions are formatted correctly

### Error Handling

#### No Workspace Open
- [ ] Run any command without workspace open
- [ ] Should show error: "Please open a workspace folder first"

#### Not Installed
- [ ] Run Update/Uninstall before installation
- [ ] Should show: "Deep Process is not installed"

#### No AI Tools Detected
- [ ] Uninstall all AI tools
- [ ] Try to install processes
- [ ] Should show warning about no tools detected
- [ ] Should allow continuing anyway

### Configuration File

Verify `_deep-process/deep-process.config.yaml` structure:
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
  deep-explore:
    installed: true
    version: "1.0.0"
  # ... other processes
tools:
  copilot:
    enabled: true
    files: []
  # ... other tools if configured
```

### Performance Testing

- [ ] Extension activates quickly (< 1 second)
- [ ] Commands respond immediately
- [ ] Installation completes in reasonable time (< 10 seconds)
- [ ] Chat participant loads workflows quickly
- [ ] No memory leaks (check Task Manager after extended use)

### Cross-Platform Testing

Test on:
- [ ] Windows 10/11
- [ ] macOS
- [ ] Linux (Ubuntu/Fedora)

## Debugging Issues

### Check Output Panel
1. View → Output (`Ctrl+Shift+U`)
2. Select "Deep Process" from dropdown
3. Look for error messages

### Check Extension Host Log
1. Help → Toggle Developer Tools
2. Go to Console tab
3. Look for errors related to "Deep Process"

### Check File System
Verify these files exist after installation:
```
workspace/
├── _deep-process/
│   ├── deep-verify/
│   ├── deep-explore/
│   ├── deep-document/
│   ├── deep-feasibility/
│   └── deep-synthesis/
├── _deep-process/deep-process.config.yaml
└── .gitignore (should contain _deep-process/)
```

### Common Issues

**Extension doesn't activate:**
- Check VS Code version (requires 1.85.0+)
- Check extension logs in Output panel
- Try reloading window: `Developer: Reload Window`

**Commands not appearing:**
- Reload window
- Reinstall extension from .vsix

**Chat participant not working:**
- Ensure GitHub Copilot Chat is installed
- Chat API requires VS Code 1.85.0+
- Check if `(vscode as any).chat` is available

**Process files not found:**
- Verify `@deep-process/core` package is built
- Check if `processes/` directory exists in extension root
- Verify esbuild bundling included core package

## Manual Testing Scenarios

### Scenario 1: First-time User
1. Install extension from .vsix
2. Open a workspace
3. Run "Deep Process: Configure"
4. Select detected tools
5. Run "Deep Process: Install"
6. Verify files created
7. Use `@deep-process /verify` in chat

### Scenario 2: Existing Installation
1. Install processes (already done)
2. Modify a process file manually
3. Run "Deep Process: Update"
4. Verify files are restored

### Scenario 3: Uninstall and Reinstall
1. Install processes
2. Create test files in `_deep-process/`
3. Run "Deep Process: Uninstall"
4. Verify all files removed
5. Reinstall
6. Verify clean installation

### Scenario 4: Multiple Workspaces
1. Install in workspace A
2. Switch to workspace B
3. Status bar should show "not installed"
4. Install in workspace B
5. Switch back to A - should show "installed"

## Automated Testing (Future)

```typescript
// Example test structure
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Deep Process Extension Test Suite', () => {
  test('Extension activates', async () => {
    const ext = vscode.extensions.getExtension('deep-process.deep-process-vscode');
    assert.ok(ext);
    await ext.activate();
    assert.ok(ext.isActive);
  });

  test('Commands are registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('deep-process.configure'));
    assert.ok(commands.includes('deep-process.install'));
  });
});
```

## Reporting Issues

When reporting issues, include:
1. VS Code version
2. Extension version
3. Operating system
4. Steps to reproduce
5. Expected vs actual behavior
6. Output panel logs
7. Extension Host logs (Developer Tools)
