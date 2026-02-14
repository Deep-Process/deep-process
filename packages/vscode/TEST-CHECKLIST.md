# VS Code Extension - Test Checklist

## Quick Test (5 minutes)

### ✅ Installation
```powershell
cd packages/vscode
pnpm run build
pnpm run package
code --install-extension deep-process-vscode-1.0.0.vsix
```

### ✅ Basic Functionality
- [ ] Extension activates without errors
- [ ] Status bar shows "🚀 Deep Process"
- [ ] Click Activity Bar icon → Configuration panel opens
- [ ] Configuration panel looks professional (new UI!)
- [ ] Tools are detected with icons and badges
- [ ] Save button works
- [ ] Save & Install button triggers installation
- [ ] Process files appear in `_deep-process/`

## Complete Test (15 minutes)

### 1. Extension Activation
```
1. Install extension
2. Reload VS Code (Ctrl+Shift+P → Developer: Reload Window)
3. Check Output panel (Ctrl+Shift+U) → "Extension Host"
   - Should see: "Deep Process extension activated"
   - Should see: "Detected tools: [...]"
4. Check status bar (bottom right)
   - Should show: "🚀 Deep Process"
   - Tooltip: "Deep Process (not installed)\nDetected tools: X"
```

**Expected:** ✅ No errors, extension loads smoothly

---

### 2. Configuration Panel

```
1. Click Deep Process icon in Activity Bar (left sidebar)
2. Panel opens in sidebar
```

**Check UI:**
- [ ] **Header:** "Deep Process" with icon, subtitle "Configure AI tool integrations"
- [ ] **Sections:** "VS Code Extensions" and "CLI Tools"
- [ ] **Badges:** Show "X/Y" detected count
- [ ] **Tools:** Each tool has:
  - [ ] Icon (emoji)
  - [ ] Checkbox (enabled if detected, disabled if not)
  - [ ] Tool name
  - [ ] Status indicator (green dot = detected, red dot = not detected)
  - [ ] Status text ("Detected · v1.2.3" or "Not installed")
- [ ] **Buttons:**
  - [ ] "💾 Save" (secondary style)
  - [ ] "🚀 Save & Install" (primary style)

**Expected:** ✅ Professional, clean UI with good spacing and colors

---

### 3. Tool Detection

**VS Code Extensions:**
- [ ] GitHub Copilot (`GitHub.copilot`)
- [ ] GitHub Copilot Chat (`GitHub.copilot-chat`) **NEW!**
- [ ] Continue.dev (`continue.continue`)
- [ ] Cline (`saoudrizwan.claude-dev`)
- [ ] Windsurf (`Windsurf.windsurf`)
- [ ] Roo Code (`RooVetGit.roo-cline`)

**CLI Tools:**
- [ ] Claude CLI (`claude`)
- [ ] Gemini CLI (`gemini`, `gemini-cli`, `gcloud`, `google-gemini`) **IMPROVED!**

**Test:**
1. Check which tools are detected
2. Verify detected tools have checkboxes enabled
3. Verify not-detected tools have grayed checkboxes (disabled)
4. Verify badges show correct counts (e.g., "2/6")

**Expected:** ✅ All installed tools detected, uninstalled shown as disabled

---

### 4. Save Configuration

```
1. In config panel, check some detected tools
2. Click "💾 Save" button
```

**Expected:**
- ✅ Toast message: "Saved! X tool(s) enabled. Run 'Deep Process: Install' to set up."
- ✅ Settings updated: Check File → Preferences → Settings → search "deep-process.enabledTools"

---

### 5. Install Processes

```
1. In config panel, check some tools
2. Click "🚀 Save & Install" button
```

**Expected:**
- ✅ Progress notification: "Installing Deep Process"
- ✅ Steps:
  - "Copying process files..." (20%)
  - "Creating configuration..." (40%)
  - "Updating .gitignore..." (30%)
  - "Done!" (10%)
- ✅ Toast: "✓ Installed X processes (copied to _deep-process/)"
- ✅ Files created:
  - `_deep-process/deep-verify/`
  - `_deep-process/deep-explore/`
  - `_deep-process/deep-document/`
  - `_deep-process/deep-feasibility/`
  - `_deep-process/deep-synthesis/`
  - `deep-process.config.yaml`
- ✅ `.gitignore` updated with `_deep-process/`
- ✅ Status bar changes to "✓ Deep Process" (green)
- ✅ Status bar tooltip shows: "Deep Process ✓\nX processes installed\nY tools configured"

---

### 6. Commands (Ctrl+Shift+P)

**Configuration Commands:**
- [ ] `Deep Process: Configure`
  - Opens Activity Bar panel
- [ ] `Deep Process: Install Processes`
  - Runs installation workflow
  - Shows progress
  - Creates files
- [ ] `Deep Process: Update Processes`
  - If up-to-date: "✓ All processes are up to date!"
  - If outdated: Shows modal with list, "Update All" button
- [ ] `Deep Process: Uninstall`
  - Shows confirmation modal with details
  - Removes `_deep-process/`
  - Removes `deep-process.config.yaml`
  - Updates `.gitignore`
  - Clears settings
  - Status bar reverts to "not installed"

**Process Commands:**
- [ ] `Deep Process: Deep Verify`
  - Shows: "Use @deep-process /verify in chat"
- [ ] `Deep Process: Deep Explore`
  - Shows: "Use @deep-process /explore in chat"
- [ ] `Deep Process: Deep Document`
  - Shows: "Use @deep-process /document in chat"
- [ ] `Deep Process: Deep Feasibility`
  - Shows: "Use @deep-process /feasibility in chat"
- [ ] `Deep Process: Deep Synthesis`
  - Shows: "Use @deep-process /synthesis in chat"

**Expected:** ✅ All commands work, appropriate messages shown

---

### 7. Chat Participant (if GitHub Copilot Chat installed)

```
1. Open GitHub Copilot Chat panel
2. Type: @deep-process
```

**Expected:**
- ✅ `@deep-process` appears in autocomplete
- ✅ Type `/` → shows 5 commands:
  - `/verify`
  - `/explore`
  - `/document`
  - `/feasibility`
  - `/synthesis`

**Test Command:**
```
@deep-process /verify

Check this code for accuracy:
function add(a, b) {
  return a - b;  // Bug: should be +
}
```

**Expected:**
- ✅ Shows workflow header with "Deep Verify"
- ✅ Shows description
- ✅ Shows "Your Mission" section
- ✅ Shows "Execution Protocol"
- ✅ Shows truncated workflow.md content
- ✅ Shows first step (Phase 0)
- ✅ Shows user input
- ✅ Shows process files location
- ✅ LLM executes workflow protocol

---

### 8. Update Processes

**Setup:**
```powershell
# Manually change version in config to test update
# Edit deep-process.config.yaml
processes:
  deep-verify:
    installed: true
    version: "1.0.0"  # Change from 2.0.0
```

**Test:**
```
1. Run "Deep Process: Update Processes"
```

**Expected:**
- ✅ Modal dialog: "1 process(es) need updating:"
  - "• Deep Verify (1.0.0 → 2.0.0)"
- ✅ Buttons: "Update All", "Cancel"
- ✅ Click "Update All"
- ✅ Progress notification
- ✅ Files updated
- ✅ Config version updated to 2.0.0
- ✅ Toast: "✓ Updated 1 process(es) (X files)"

---

### 9. Uninstall

```
1. Run "Deep Process: Uninstall"
```

**Expected:**
- ✅ Confirmation modal:
  - "Remove Deep Process from this workspace?"
  - Details: "X process(es), Y tool integration(s), Configuration file"
  - "This action cannot be undone."
  - Buttons: "Yes, Remove", "Cancel"
- ✅ Click "Yes, Remove"
- ✅ Progress notification: "Uninstalling Deep Process"
- ✅ Files removed:
  - `_deep-process/` directory deleted
  - `deep-process.config.yaml` deleted
- ✅ `.gitignore` cleaned up (no more `_deep-process/`)
- ✅ Settings cleared (`enabledTools` = [])
- ✅ Status bar: "🚀 Deep Process" (no checkmark)
- ✅ Status bar tooltip: "Deep Process (not installed)"
- ✅ Toast: "✓ Deep Process uninstalled successfully"

---

### 10. Reinstall

```
1. After uninstall, run "Deep Process: Install Processes"
```

**Expected:**
- ✅ Clean installation (no leftover files)
- ✅ All processes copied
- ✅ Config created fresh
- ✅ Works as expected

---

## Error Handling Tests

### No Workspace Open
```
1. Close all folders (File → Close Folder)
2. Try: "Deep Process: Install Processes"
```

**Expected:** ✅ Error message: "Please open a workspace folder first."

---

### Already Installed
```
1. Install processes
2. Run "Deep Process: Install Processes" again
```

**Expected:**
- ✅ Warning: "Deep Process is already installed in this workspace. Reinstall?"
- ✅ Buttons: "Yes, Reinstall", "Cancel"
- ✅ "Yes, Reinstall" → proceeds with installation
- ✅ "Cancel" → aborts

---

### No Tools Detected
```
1. Uninstall all AI tool extensions
2. Try to install processes
```

**Expected:**
- ✅ Warning: "No AI tools detected. Process files will be copied, but no tool integrations will be configured."
- ✅ Buttons: "Continue Anyway", "Cancel"
- ✅ Can still install (processes work without tool integrations)

---

## Performance Tests

### Startup Time
- [ ] Extension activates in < 1 second
- [ ] No blocking operations during activation

### Command Response
- [ ] Commands respond immediately (< 100ms)
- [ ] Installation completes in < 10 seconds
- [ ] Chat participant loads workflows quickly (< 500ms)

### Memory
- [ ] No memory leaks (check Task Manager after extended use)
- [ ] Reasonable memory usage (< 50MB)

---

## Cross-Platform Tests

Test on:
- [ ] **Windows 10/11**
- [ ] **macOS**
- [ ] **Linux (Ubuntu/Fedora)**

---

## Test Results Template

### Test Date: _____________
### Tester: _____________
### VS Code Version: _____________
### Extension Version: 1.0.0

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Installation | ☐ | ☐ | |
| Configuration Panel | ☐ | ☐ | |
| Tool Detection | ☐ | ☐ | |
| Save Config | ☐ | ☐ | |
| Install Processes | ☐ | ☐ | |
| Commands | ☐ | ☐ | |
| Chat Participant | ☐ | ☐ | |
| Update Processes | ☐ | ☐ | |
| Uninstall | ☐ | ☐ | |
| Error Handling | ☐ | ☐ | |

**Overall Result:** PASS / FAIL

**Issues Found:**
1.
2.
3.

**Notes:**
