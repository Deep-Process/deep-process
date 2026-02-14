# Debugging Installation Issues

## Quick Diagnostics

### 1. Check Extension Installed Properly

**Open VS Code Output Panel:**
```
View → Output (Ctrl+Shift+U)
Select: "Extension Host" from dropdown
```

**Look for:**
- "Deep Process extension activated" ✓
- "Detected tools: [...]" ✓
- Any ERROR messages ✗

### 2. Check Tool Detection

**Method A: Via Console**
```
Help → Toggle Developer Tools
Console tab:

// Check detected tools
vscode.extensions.getExtension('deep-process.deep-process-vscode').activate()
  .then(() => console.log('Extension active'))
```

**Method B: Via Configuration Panel**
1. Click Deep Process icon in Activity Bar
2. Check if Gemini CLI and GitHub Copilot Chat show as "Detected"
3. Are checkboxes enabled (not grayed out)?

### 3. Verify Gemini CLI

**In Terminal:**
```powershell
# Test if Gemini CLI is accessible
gemini --version

# If that fails, try variations:
gemini-cli --version
gcloud --version
google-gemini --version
```

**Expected:** Version number displayed

### 4. Verify GitHub Copilot Chat

**In VS Code:**
```
1. Extensions panel (Ctrl+Shift+X)
2. Search: "GitHub Copilot Chat"
3. Should show: "Installed"
4. Extension ID: GitHub.copilot-chat
```

## Common Issues & Fixes

### Issue 1: "Save & Install" Does Nothing

**Symptoms:**
- Click button
- No progress notification
- No files created

**Fix:**
1. Open Output panel: "Extension Host"
2. Look for errors
3. Common causes:
   - No workspace folder open
   - Permission issues
   - Core package not bundled

**Solution:**
```powershell
# Rebuild extension
cd packages/vscode
pnpm run build
pnpm run package

# Reinstall
code --uninstall-extension deep-process.deep-process-vscode
code --install-extension deep-process-vscode-1.0.0.vsix

# Reload VS Code
# Ctrl+Shift+P → "Developer: Reload Window"
```

### Issue 2: "Tools Not Detected"

**Symptoms:**
- Gemini CLI installed but shows "Not installed"
- GitHub Copilot Chat not in list

**Fix for Gemini CLI:**

The detector tries these commands in order:
1. `gemini --version`
2. `gemini-cli --version`
3. `gcloud --version`
4. `google-gemini --version`

**Check which works:**
```powershell
# Try each manually
gemini --version
gemini-cli --version
gcloud version
google-gemini --version
```

**If none work:**
- Gemini CLI might not be in PATH
- Add to PATH or create alias

**Fix for GitHub Copilot Chat:**

Extension ID must be exactly: `GitHub.copilot-chat`

**Verify:**
```powershell
code --list-extensions | findstr copilot
```

Should show:
- `GitHub.copilot`
- `GitHub.copilot-chat`

If only shows `GitHub.copilot`:
- Install GitHub Copilot Chat separately
- It's a separate extension!

### Issue 3: "No Workspace Folder Open"

**Symptoms:**
- Error: "Please open a workspace folder first"

**Fix:**
```
File → Open Folder
Select any folder
Try install again
```

### Issue 4: "Processes Not Found"

**Symptoms:**
- Error: "No processes found. Extension may be corrupted."

**Cause:** Extension didn't bundle processes properly

**Fix:**
```powershell
cd packages/vscode

# Rebuild with processes
pnpm run build

# Verify processes copied
ls processes/
# Should show: deep-verify, deep-explore, etc.

# Package
pnpm run package

# Reinstall
code --install-extension deep-process-vscode-1.0.0.vsix
```

### Issue 5: Checkboxes Disabled (Grayed Out)

**Symptoms:**
- Tool shows in list
- Status: "Not installed"
- Checkbox grayed out/disabled

**This is CORRECT behavior!**
- Only detected tools can be enabled
- Not detected = checkbox disabled

**To enable:**
1. Install the missing tool
2. Reload VS Code
3. Tool will be detected
4. Checkbox will enable

## Manual Detection Test

Create a test file to verify detection:

**File: `test-detection.js`**
```javascript
const { execSync } = require('child_process');

// Test Gemini CLI
console.log('Testing Gemini CLI...');
const commands = ['gemini', 'gemini-cli', 'gcloud', 'google-gemini'];
for (const cmd of commands) {
  try {
    const version = execSync(`${cmd} --version`, {
      encoding: 'utf-8',
      timeout: 3000,
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    console.log(`✓ ${cmd}: ${version}`);
  } catch {
    console.log(`✗ ${cmd}: not found`);
  }
}
```

Run:
```powershell
node test-detection.js
```

## Force Detection Refresh

**Method 1: Reload Window**
```
Ctrl+Shift+P → "Developer: Reload Window"
```

**Method 2: Reinstall Extension**
```powershell
code --uninstall-extension deep-process.deep-process-vscode
code --install-extension deep-process-vscode-1.0.0.vsix
```

**Method 3: Restart VS Code**
```
Close all VS Code windows
Reopen
```

## Enable Debug Logging

**Add to extension code (temporary):**

Edit `packages/vscode/src/detectors/tool-detector.ts`:

```typescript
export function detectTools(): DetectedTool[] {
  const tools: DetectedTool[] = [];

  // Add logging
  console.log('[Deep Process] Starting tool detection...');

  // Detect VS Code extensions
  tools.push(detectExtension('GitHub.copilot', 'GitHub Copilot'));
  tools.push(detectExtension('GitHub.copilot-chat', 'GitHub Copilot Chat'));
  console.log('[Deep Process] Extensions detected:', tools.filter(t => t.type === 'extension'));

  // Detect CLI tools
  tools.push(detectCLI('claude', 'Claude CLI'));
  tools.push(detectCLIMultiple(['gemini', 'gemini-cli', 'gcloud', 'google-gemini'], 'Gemini CLI'));
  console.log('[Deep Process] CLI tools detected:', tools.filter(t => t.type === 'cli'));

  console.log('[Deep Process] Total detected:', tools.filter(t => t.detected).length);

  return tools;
}
```

Then rebuild and check Output panel.

## Still Stuck?

### Get Full Diagnostic Info

**Run this in VS Code Developer Tools Console:**

```javascript
// Get all extensions
const allExts = vscode.extensions.all.map(e => ({
  id: e.id,
  active: e.isActive
}));
console.log('All extensions:', allExts);

// Check for Copilot Chat
const copilotChat = vscode.extensions.getExtension('GitHub.copilot-chat');
console.log('Copilot Chat:', copilotChat ? 'FOUND' : 'NOT FOUND');

// Check Deep Process
const deepProcess = vscode.extensions.getExtension('deep-process.deep-process-vscode');
console.log('Deep Process active:', deepProcess?.isActive);

// Check workspace
console.log('Workspace folders:', vscode.workspace.workspaceFolders);
```

### Check Package Contents

```powershell
# Extract .vsix to inspect
Rename-Item deep-process-vscode-1.0.0.vsix deep-process-vscode-1.0.0.zip
Expand-Archive deep-process-vscode-1.0.0.zip -DestinationPath vsix-contents

# Check if processes exist
ls vsix-contents/extension/processes/
# Should show all 8 processes

# Check if bundled correctly
ls vsix-contents/extension/dist/
# Should have extension.js
```

## Report Issue

If still not working, provide:
1. VS Code version: `code --version`
2. Extension version: 1.0.0
3. Output panel logs (Extension Host)
4. Developer Tools console errors
5. Result of `gemini --version`
6. Result of `code --list-extensions | findstr copilot`
7. Screenshot of configuration panel
