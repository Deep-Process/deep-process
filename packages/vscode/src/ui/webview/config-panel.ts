import * as vscode from 'vscode';
import { detectToolsAsync, refreshToolCache, getCachedTools, DetectedTool, getToolsStats } from '../../detectors/tool-detector';
import { loadAllManifests, ProcessManifest } from '../../core/process-registry.js';
import { readConfig } from '@deep-process/core';

export interface ProcessInfo extends ProcessManifest {
  installed: boolean;
  fileCount?: number;
  installedVersion?: string;
}

export interface PanelState {
  tools: DetectedTool[];
  enabledTools: string[];
  toolConfigs: Record<string, { cliFlags?: string }>; // CLI flags per tool
  processes: ProcessInfo[];
  isLoading: boolean;
  lastSync: number;
  currentTab: 'dashboard' | 'tools' | 'processes' | 'help';
  setupCompleted: boolean;
}

export class ConfigPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'deep-process.configView';
  private _view?: vscode.WebviewView;
  private _state: PanelState;

  constructor(private readonly _extensionUri: vscode.Uri, private readonly _context: vscode.ExtensionContext) {
    this._state = {
      tools: getCachedTools(),
      enabledTools: [],
      toolConfigs: {},
      processes: [],
      isLoading: false,
      lastSync: 0,
      currentTab: 'dashboard',
      setupCompleted: _context.globalState.get('deep-process.setupCompleted', false)
    };
  }

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async data => {
      console.log('[Deep Process] Received message:', data.type, data);
      switch (data.type) {
        case 'init':
          await this._initialize();
          break;
        case 'refreshTools':
          await this._refreshTools();
          break;
        case 'saveConfig':
          await this._saveConfig(data.enabledTools);
          break;
        case 'install':
          console.log('[Deep Process] Executing install command...');
          await this._saveAndInstall(data.enabledTools);
          break;
        case 'installProcess':
          await this._installProcess(data.processId);
          break;
        case 'uninstallProcess':
          await this._uninstallProcess(data.processId);
          break;
        case 'runProcess':
          await vscode.commands.executeCommand('deep-process.runProcess', data.processId);
          break;
        case 'switchTab':
          this._state.currentTab = data.tab;
          this._sendStateToWebview();
          break;
        case 'completeSetup':
          await this._completeSetup();
          break;
        case 'openExtension':
          vscode.env.openExternal(vscode.Uri.parse(data.url));
          break;
        case 'uninstallTool':
          await this._uninstallTool(data.toolId);
          break;
        case 'viewDocs':
          await vscode.commands.executeCommand('deep-process.viewDocs', data.processId);
          break;
        case 'updateCliFlags':
          await this._updateCliFlags(data.toolId, data.flags);
          break;
      }
    });

    // Initial data load
    await this._initialize();
  }

  private async _initialize() {
    this._updateState({ isLoading: true });

    try {
      // Load config
      const config = vscode.workspace.getConfiguration('deep-process');
      const enabledTools = config.get<string[]>('enabledTools', []);

      // Load tool configs (CLI flags) from deep-process config file
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      const toolConfigs: Record<string, { cliFlags?: string }> = {};
      if (workspaceFolder) {
        const deepConfig = readConfig(workspaceFolder.uri.fsPath);
        if (deepConfig) {
          // Extract CLI flags from tool configs
          for (const [toolId, toolConfig] of Object.entries(deepConfig.tools)) {
            if (toolConfig.cliFlags) {
              toolConfigs[toolId] = { cliFlags: toolConfig.cliFlags };
            }
          }
        }
      }

      // Get cached tools or detect async
      let tools = getCachedTools();
      if (tools.length === 0) {
        tools = await detectToolsAsync((msg, inc) => {
          this._view?.webview.postMessage({
            type: 'progress',
            message: msg,
            increment: inc
          });
        });
      }

      // Load processes
      const processes = await this._loadProcesses();

      this._updateState({
        tools,
        enabledTools,
        toolConfigs,
        processes,
        isLoading: false,
        lastSync: Date.now()
      });
    } catch (error) {
      this._showError('Failed to initialize: ' + (error as Error).message);
      this._updateState({ isLoading: false });
    }
  }

  private async _loadProcesses(): Promise<ProcessInfo[]> {
    const manifests = loadAllManifests();
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      return manifests.map(m => ({ ...m, installed: false }));
    }

    const config = vscode.workspace.getConfiguration('deep-process');
    const processDir = config.get<string>('processDir', '_deep-process');

    // Check which processes are installed
    const processes: ProcessInfo[] = [];
    for (const manifest of manifests) {
      const processPath = vscode.Uri.joinPath(
        workspaceFolder.uri,
        processDir,
        manifest.id
      );

      let installed = false;
      let fileCount = 0;
      try {
        const stat = await vscode.workspace.fs.stat(processPath);
        installed = stat.type === vscode.FileType.Directory;

        if (installed) {
          const files = await vscode.workspace.fs.readDirectory(processPath);
          fileCount = files.length;
        }
      } catch {
        installed = false;
      }

      processes.push({
        ...manifest,
        installed,
        fileCount: installed ? fileCount : undefined,
        installedVersion: installed ? manifest.version : undefined
      });
    }

    return processes;
  }

  private async _refreshTools() {
    this._updateState({ isLoading: true });

    try {
      const tools = await refreshToolCache((msg, inc) => {
        this._view?.webview.postMessage({
          type: 'progress',
          message: msg,
          increment: inc
        });
      });

      this._updateState({
        tools,
        isLoading: false,
        lastSync: Date.now()
      });

      this._showSuccess('Tools refreshed successfully');
    } catch (error) {
      this._showError('Failed to refresh tools: ' + (error as Error).message);
      this._updateState({ isLoading: false });
    }
  }

  private async _saveConfig(enabledTools: string[]) {
    try {
      const config = vscode.workspace.getConfiguration('deep-process');
      await config.update('enabledTools', enabledTools, vscode.ConfigurationTarget.Workspace);

      this._updateState({ enabledTools });
      this._showSuccess(`Saved! ${enabledTools.length} tool(s) enabled.`);
    } catch (error) {
      this._showError('Failed to save config: ' + (error as Error).message);
    }
  }

  private async _saveAndInstall(enabledTools: string[]) {
    try {
      const config = vscode.workspace.getConfiguration('deep-process');
      await config.update('enabledTools', enabledTools, vscode.ConfigurationTarget.Workspace);

      this._updateState({ enabledTools });

      // Trigger install command
      await vscode.commands.executeCommand('deep-process.install');

      // Reload processes
      const processes = await this._loadProcesses();
      this._updateState({ processes });
    } catch (error) {
      this._showError('Failed to install: ' + (error as Error).message);
    }
  }

  private async _installProcess(processId: string) {
    try {
      await vscode.commands.executeCommand('deep-process.installProcess', processId);

      // Reload processes
      const processes = await this._loadProcesses();
      this._updateState({ processes });
    } catch (error) {
      this._showError(`Failed to install ${processId}: ` + (error as Error).message);
    }
  }

  private async _uninstallProcess(processId: string) {
    try {
      await vscode.commands.executeCommand('deep-process.uninstallProcess', processId);

      // Reload processes
      const processes = await this._loadProcesses();
      this._updateState({ processes });
    } catch (error) {
      this._showError(`Failed to uninstall ${processId}: ` + (error as Error).message);
    }
  }

  private async _runProcess(processId: string) {
    try {
      const process = this._state.processes.find(p => p.id === processId);
      if (!process) {
        throw new Error(`Process ${processId} not found`);
      }

      // Execute the corresponding command
      const commandMap: Record<string, string> = {
        'deep-verify': 'deep-process.verify',
        'deep-explore': 'deep-process.explore',
        'deep-document': 'deep-process.document',
        'deep-feasibility': 'deep-process.feasibility',
        'deep-synthesis': 'deep-process.synthesis'
      };

      const command = commandMap[processId];
      if (command) {
        await vscode.commands.executeCommand(command);
      }
    } catch (error) {
      this._showError(`Failed to run ${processId}: ` + (error as Error).message);
    }
  }

  private async _completeSetup() {
    await this._context.globalState.update('deep-process.setupCompleted', true);
    this._updateState({ setupCompleted: true });
    this._showSuccess('Setup completed! You can now use Deep Process workflows.');
  }

  private async _uninstallTool(toolId: string) {
    try {
      await vscode.commands.executeCommand('deep-process.uninstallTool', toolId);

      // Update state - remove tool from enabled list
      const enabledTools = this._state.enabledTools.filter(id => id !== toolId);
      this._updateState({ enabledTools });

      this._showSuccess(`${toolId} integration removed`);
    } catch (error) {
      this._showError(`Failed to uninstall ${toolId}: ${(error as Error).message}`);
    }
  }

  private async _updateCliFlags(toolId: string, flags: string) {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      const projectRoot = workspaceFolder.uri.fsPath;
      const { readConfig, writeConfig } = await import('@deep-process/core');
      const config = readConfig(projectRoot);

      if (!config) {
        throw new Error('Deep Process is not installed in this workspace');
      }

      // Update CLI flags for the tool
      if (!config.tools[toolId]) {
        config.tools[toolId] = { enabled: true, files: [] };
      }
      config.tools[toolId].cliFlags = flags.trim() || undefined;

      writeConfig(projectRoot, config);

      // Update local state
      const toolConfigs = { ...this._state.toolConfigs };
      if (flags.trim()) {
        toolConfigs[toolId] = { cliFlags: flags.trim() };
      } else {
        delete toolConfigs[toolId];
      }
      this._updateState({ toolConfigs });

      this._showSuccess(`CLI flags updated for ${toolId}`);
    } catch (error) {
      this._showError(`Failed to update CLI flags: ${(error as Error).message}`);
    }
  }

  private _updateState(updates: Partial<PanelState>) {
    this._state = { ...this._state, ...updates };
    this._sendStateToWebview();
  }

  private _sendStateToWebview() {
    this._view?.webview.postMessage({
      type: 'stateUpdate',
      state: this._state
    });
  }

  private _showSuccess(message: string) {
    this._view?.webview.postMessage({
      type: 'notification',
      level: 'success',
      message
    });
  }

  private _showError(message: string) {
    this._view?.webview.postMessage({
      type: 'notification',
      level: 'error',
      message
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Process</title>
  <style>
    ${this._getStyles()}
  </style>
</head>
<body>
  <div class="loading-screen" id="loading-screen">
    <div class="spinner"></div>
    <div id="loading-message">Initializing...</div>
  </div>
  <div id="app"></div>

  <script>
    ${this._getScript()}
  </script>
</body>
</html>`;
  }

  private _getStyles(): string {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: var(--vscode-font-family);
        font-size: var(--vscode-font-size);
        color: var(--vscode-foreground);
        background: var(--vscode-sideBar-background);
        overflow-x: hidden;
      }

      /* Loading Screen */
      .loading-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        gap: 16px;
      }

      .loading-screen.hidden {
        display: none;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--vscode-progressBar-background);
        border-top-color: var(--vscode-button-background);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Header */
      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--vscode-editor-background);
        border-bottom: 1px solid var(--vscode-panel-border);
      }

      .header-top {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
      }

      .header-icon {
        width: 24px;
        height: 24px;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }

      .icon-button {
        background: transparent;
        border: 1px solid var(--vscode-button-border);
        color: var(--vscode-button-foreground);
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }

      .icon-button:hover {
        background: var(--vscode-button-hoverBackground);
      }

      .icon-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Tabs */
      .tabs {
        display: flex;
        gap: 4px;
        padding: 0 16px;
        background: var(--vscode-editor-background);
      }

      .tab {
        padding: 10px 16px;
        background: transparent;
        border: none;
        color: var(--vscode-foreground);
        opacity: 0.6;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .tab:hover {
        opacity: 0.8;
      }

      .tab.active {
        opacity: 1;
        border-bottom-color: var(--vscode-button-background);
      }

      /* Content */
      .content {
        padding: 20px;
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      /* Dashboard */
      .quick-start {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .quick-start h3 {
        font-size: 16px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-step {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin-bottom: 8px;
        background: var(--vscode-sideBar-background);
        border-radius: 6px;
      }

      .step-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .step-indicator.complete {
        background: var(--vscode-terminal-ansiGreen);
        color: white;
      }

      .step-indicator.pending {
        background: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
      }

      .step-info {
        flex: 1;
      }

      .step-title {
        font-weight: 500;
        font-size: 13px;
      }

      .step-status {
        font-size: 12px;
        opacity: 0.7;
        margin-top: 2px;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }

      .stat-card {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.7;
      }

      /* Tool List */
      .section {
        margin-bottom: 24px;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--vscode-panel-border);
      }

      .section-title {
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.9;
      }

      .section-badge {
        background: var(--vscode-badge-background);
        color: var(--vscode-badge-foreground);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
      }

      .tool-item {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        transition: all 0.15s ease;
      }

      .tool-item:hover {
        border-color: var(--vscode-focusBorder);
      }

      .tool-item.disabled {
        opacity: 0.6;
      }

      .tool-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 8px;
      }

      .tool-checkbox {
        margin-top: 4px;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .tool-checkbox:disabled {
        cursor: not-allowed;
      }

      .tool-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .tool-info {
        flex: 1;
      }

      .tool-name {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .tool-description {
        font-size: 12px;
        opacity: 0.7;
        margin-bottom: 8px;
      }

      .tool-status {
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .status-indicator.detected {
        background: var(--vscode-terminal-ansiGreen);
        box-shadow: 0 0 4px var(--vscode-terminal-ansiGreen);
      }

      .status-indicator.not-detected {
        background: var(--vscode-errorForeground);
      }

      .tool-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .tool-config {
        margin-top: 12px;
        padding: 12px;
        background: var(--vscode-textBlockQuote-background);
        border-radius: 4px;
      }

      .tool-config-label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: var(--vscode-foreground);
        margin-bottom: 6px;
      }

      .tool-cli-flags {
        width: 100%;
        padding: 6px 8px;
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
        font-family: var(--vscode-font-family);
        font-size: 12px;
        margin-top: 4px;
      }

      .tool-cli-flags:focus {
        outline: 1px solid var(--vscode-focusBorder);
        border-color: var(--vscode-focusBorder);
      }

      .tool-config-hint {
        margin-top: 6px;
        font-size: 11px;
        color: var(--vscode-descriptionForeground);
        font-style: italic;
      }

      /* Process Card */
      .process-card {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
      }

      .process-card.installed {
        border-color: var(--vscode-terminal-ansiGreen);
      }

      .process-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .process-header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }

      .process-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .process-version {
        font-size: 12px;
        opacity: 0.6;
      }

      .process-description {
        font-size: 13px;
        opacity: 0.8;
        margin-bottom: 12px;
      }

      .process-meta {
        font-size: 12px;
        opacity: 0.7;
        margin-bottom: 12px;
      }

      .process-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      /* Buttons */
      .button {
        padding: 8px 16px;
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .button:hover:not(:disabled) {
        background: var(--vscode-button-hoverBackground);
      }

      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .button-small {
        padding: 6px 12px;
        font-size: 12px;
      }

      .button-secondary {
        background: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
      }

      .button-secondary:hover:not(:disabled) {
        background: var(--vscode-button-secondaryHoverBackground);
      }

      .button-link {
        background: transparent;
        color: var(--vscode-textLink-foreground);
        padding: 4px 8px;
      }

      .button-link:hover:not(:disabled) {
        background: transparent;
        text-decoration: underline;
      }

      /* Action Bar */
      .action-bar {
        position: sticky;
        bottom: 0;
        padding: 16px;
        background: var(--vscode-editor-background);
        border-top: 1px solid var(--vscode-panel-border);
        display: flex;
        gap: 10px;
      }

      .action-bar .button {
        flex: 1;
      }

      /* Help Section */
      .help-section {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .help-section h3 {
        font-size: 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .help-section ul {
        list-style: none;
        padding: 0;
      }

      .help-section li {
        padding: 8px 0;
        border-bottom: 1px solid var(--vscode-panel-border);
      }

      .help-section li:last-child {
        border-bottom: none;
      }

      .help-link {
        color: var(--vscode-textLink-foreground);
        text-decoration: none;
        font-size: 13px;
      }

      .help-link:hover {
        text-decoration: underline;
      }

      /* Notifications */
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .notification.success {
        background: var(--vscode-terminal-ansiGreen);
        color: white;
      }

      .notification.error {
        background: var(--vscode-errorForeground);
        color: white;
      }

      /* Empty State */
      .empty-state {
        padding: 60px 20px;
        text-align: center;
        opacity: 0.6;
      }

      .empty-state-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .empty-state-text {
        font-size: 14px;
      }

      /* Activity List */
      .activity-list {
        list-style: none;
        padding: 0;
      }

      .activity-item {
        padding: 8px 0;
        font-size: 12px;
        opacity: 0.7;
        border-bottom: 1px solid var(--vscode-panel-border);
      }

      .activity-item:last-child {
        border-bottom: none;
      }
    `;
  }

  private _getScript(): string {
    return `
      const vscode = acquireVsCodeApi();

      let state = {
        tools: [],
        enabledTools: [],
        processes: [],
        isLoading: false,
        lastSync: 0,
        currentTab: 'dashboard',
        setupCompleted: false
      };

      // Request initial state
      vscode.postMessage({ type: 'init' });

      // Handle messages from extension
      window.addEventListener('message', event => {
        const message = event.data;
        console.log('[Deep Process Webview] Received message:', message.type, message);

        switch (message.type) {
          case 'stateUpdate':
            console.log('[Deep Process Webview] Updating state, currentTab:', message.state?.currentTab);
            state = message.state;
            render();
            break;
          case 'progress':
            updateLoadingMessage(message.message);
            break;
          case 'notification':
            showNotification(message.level, message.message);
            break;
        }
      });

      function render() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');

        if (!app) return;

        if (state.isLoading && state.tools.length === 0) {
          if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
          }
          app.innerHTML = '';
          return;
        } else {
          if (loadingScreen) {
            loadingScreen.classList.add('hidden');
          }
        }
        app.innerHTML = \`
          <div class="header">
            <div class="header-top">
              <div class="header-title">
                <svg class="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.1"/>
                  <path d="M6 12 L10 16 L18 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Deep Process
              </div>
              <div class="header-actions">
                <button class="icon-button" onclick="refreshTools()" title="Refresh tools" \${state.isLoading ? 'disabled' : ''}>
                  🔄
                </button>
              </div>
            </div>
            <div class="tabs">
              <button class="tab \${state.currentTab === 'dashboard' ? 'active' : ''}" onclick="switchTab('dashboard')">
                📊 Dashboard
              </button>
              <button class="tab \${state.currentTab === 'tools' ? 'active' : ''}" onclick="switchTab('tools')">
                🤖 AI Tools
              </button>
              <button class="tab \${state.currentTab === 'processes' ? 'active' : ''}" onclick="switchTab('processes')">
                📦 Processes
              </button>
              <button class="tab \${state.currentTab === 'help' ? 'active' : ''}" onclick="switchTab('help')">
                ❓ Help
              </button>
            </div>
          </div>

          <div class="content">
            <div class="tab-content \${state.currentTab === 'dashboard' ? 'active' : ''}">
              \${renderDashboard()}
            </div>
            <div class="tab-content \${state.currentTab === 'tools' ? 'active' : ''}">
              \${renderTools()}
            </div>
            <div class="tab-content \${state.currentTab === 'processes' ? 'active' : ''}">
              \${renderProcesses()}
            </div>
            <div class="tab-content \${state.currentTab === 'help' ? 'active' : ''}">
              \${renderHelp()}
            </div>
          </div>

          \${state.currentTab === 'tools' ? renderToolsActionBar() : ''}
        \`;

        attachEventListeners();
      }

      function renderDashboard() {
        const detectedTools = state.tools.filter(t => t.detected);
        const installedProcesses = state.processes.filter(p => p.installed);
        const toolsSelected = state.enabledTools.length > 0;
        const processesReady = installedProcesses.length > 0;

        return \`
          <div class="quick-start">
            <h3>🎯 Quick Start</h3>
            <div class="setup-step">
              <div class="step-indicator \${toolsSelected ? 'complete' : 'pending'}">
                \${toolsSelected ? '✓' : '1'}
              </div>
              <div class="step-info">
                <div class="step-title">Select AI Tools</div>
                <div class="step-status">
                  \${toolsSelected ? \`\${state.enabledTools.length} tools selected\` : 'Choose which AI assistants to use'}
                </div>
              </div>
              \${!toolsSelected ? \`<button class="button button-small" onclick="switchTab('tools')">Select</button>\` : ''}
            </div>
            <div class="setup-step">
              <div class="step-indicator \${processesReady ? 'complete' : 'pending'}">
                \${processesReady ? '✓' : '2'}
              </div>
              <div class="step-info">
                <div class="step-title">Install Processes</div>
                <div class="step-status">
                  \${processesReady ? \`\${installedProcesses.length} processes installed\` : 'Choose workflows to install'}
                </div>
              </div>
              \${!processesReady ? \`<button class="button button-small" onclick="switchTab('processes')">Install</button>\` : ''}
            </div>
            <div class="setup-step">
              <div class="step-indicator \${state.setupCompleted ? 'complete' : 'pending'}">
                \${state.setupCompleted ? '✓' : '3'}
              </div>
              <div class="step-info">
                <div class="step-title">Start Using</div>
                <div class="step-status">
                  \${state.setupCompleted ? 'Ready to use!' : 'Complete setup and start using Deep Process'}
                </div>
              </div>
              \${!state.setupCompleted && toolsSelected && processesReady ? \`<button class="button button-small" onclick="completeSetup()">Complete</button>\` : ''}
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">\${detectedTools.length}</div>
              <div class="stat-label">AI Tools Detected</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">\${state.enabledTools.length}</div>
              <div class="stat-label">Tools Enabled</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">\${installedProcesses.length}</div>
              <div class="stat-label">Processes Installed</div>
            </div>
          </div>

          \${detectedTools.length === 0 && state.lastSync > 0 ? \`
            <div class="help-section" style="background: var(--vscode-inputValidation-warningBackground); border-left: 3px solid var(--vscode-inputValidation-warningBorder);">
              <h3>⚠️ No AI Tools Detected</h3>
              <p style="margin-bottom: 12px;">
                Deep Process works with AI assistants like GitHub Copilot, Continue.dev, Cline, and others.
                No compatible tools were found on your system.
              </p>
              <p style="margin-bottom: 12px;">
                <strong>What to do:</strong>
              </p>
              <ul style="margin-left: 20px; margin-bottom: 12px;">
                <li>Install an AI assistant extension from the Extensions panel</li>
                <li>Restart VSCode after installing</li>
                <li>Click the refresh button (🔄) to detect newly installed tools</li>
              </ul>
              <p style="font-size: 11px; opacity: 0.8;">
                You can still install and use Deep Process workflows manually via Command Palette even without AI tools.
              </p>
            </div>
          \` : ''}

          <div class="help-section">
            <h3>📊 Status</h3>
            <div class="activity-list">
              <div class="activity-item">
                Last scanned: \${state.lastSync > 0 ? formatTime(state.lastSync) : 'Never'}
              </div>
              <div class="activity-item">
                Workspace: \${state.processes.length > 0 ? 'Configured ✓' : 'Not configured'}
              </div>
            </div>
          </div>
        \`;
      }

      function renderTools() {
        const extensions = state.tools.filter(t => t.type === 'extension');
        const cliTools = state.tools.filter(t => t.type === 'cli');

        return \`
          <div class="section">
            <div class="section-header">
              <div class="section-title">VS Code Extensions</div>
              <div class="section-badge">
                \${extensions.filter(t => t.detected).length}/\${extensions.length}
              </div>
            </div>
            \${extensions.length > 0 ? extensions.map(tool => renderToolItem(tool)).join('') : '<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">No extensions available</div></div>'}
            \${extensions.filter(t => t.detected).length === 0 && extensions.length > 0 ? \`
              <div style="padding: 12px; background: var(--vscode-textBlockQuote-background); border-radius: 4px; margin-top: 8px; font-size: 12px;">
                <strong>💡 Tip:</strong> Install a supported AI extension like GitHub Copilot or Continue.dev from the Extensions marketplace, then click the refresh button (🔄) above.
              </div>
            \` : ''}
          </div>

          <div class="section">
            <div class="section-header">
              <div class="section-title">CLI Tools</div>
              <div class="section-badge">
                \${cliTools.filter(t => t.detected).length}/\${cliTools.length}
              </div>
            </div>
            \${cliTools.length > 0 ? cliTools.map(tool => renderToolItem(tool)).join('') : '<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">No CLI tools available</div></div>'}
            \${cliTools.filter(t => t.detected).length === 0 && cliTools.length > 0 ? \`
              <div style="padding: 12px; background: var(--vscode-textBlockQuote-background); border-radius: 4px; margin-top: 8px; font-size: 12px;">
                <strong>💡 Tip:</strong> CLI tools are optional. You can use Deep Process workflows with VSCode AI extensions only.
              </div>
            \` : ''}
          </div>
        \`;
      }

      function renderToolItem(tool) {
        const isEnabled = state.enabledTools.includes(tool.id);
        const isDetected = tool.detected;

        return \`
          <div class="tool-item \${!isDetected ? 'disabled' : ''}">
            <div class="tool-header">
              <input
                type="checkbox"
                class="tool-checkbox"
                data-tool-id="\${tool.id}"
                \${isEnabled ? 'checked' : ''}
                \${!isDetected ? 'disabled' : ''}
              >
              <div class="tool-icon">\${getToolIcon(tool.name)}</div>
              <div class="tool-info">
                <div class="tool-name">\${tool.name}</div>
                \${tool.description ? \`<div class="tool-description">\${tool.description}</div>\` : ''}
                <div class="tool-status">
                  <span class="status-indicator \${isDetected ? 'detected' : 'not-detected'}"></span>
                  <span>\${isDetected ? \`Detected\${tool.version ? ' · v' + tool.version : ''}\` : 'Not installed'}</span>
                </div>
              </div>
            </div>
            \${!isDetected && tool.installUrl ? \`
              <div class="tool-actions">
                <button class="button button-small button-secondary" onclick="openExtension('\${tool.installUrl}')">
                  Install Extension
                </button>
                \${tool.docsUrl ? \`<button class="button button-small button-link" onclick="openExtension('\${tool.docsUrl}')">Docs</button>\` : ''}
              </div>
            \` : ''}
            \${isDetected && isEnabled && tool.type === 'cli' ? \`
              <div class="tool-config">
                <label class="tool-config-label">
                  CLI Flags (optional):
                  <input
                    type="text"
                    class="tool-cli-flags"
                    data-tool-id="\${tool.id}"
                    value="\${state.toolConfigs?.[tool.id]?.cliFlags || ''}"
                    placeholder="e.g., --yolo or --dangerously-skip-permissions"
                    onchange="updateCliFlags('\${tool.id}', this.value)"
                  />
                </label>
                <div class="tool-config-hint">
                  These flags will be added when running this tool from the Run menu
                </div>
              </div>
            \` : ''}
            \${isDetected && isEnabled ? \`
              <div class="tool-actions">
                <button class="button button-small button-danger" onclick="uninstallTool('\${tool.id}')">
                  🗑️ Uninstall
                </button>
              </div>
            \` : ''}
          </div>
        \`;
      }

      function renderProcesses() {
        const installed = state.processes.filter(p => p.installed);
        const available = state.processes.filter(p => !p.installed);

        return \`
          \${installed.length > 0 ? \`
            <div class="section">
              <div class="section-header">
                <div class="section-title">Installed Processes</div>
                <div class="section-badge">\${installed.length}</div>
              </div>
              \${installed.map(proc => renderProcessCard(proc, true)).join('')}
            </div>
          \` : ''}

          \${available.length > 0 ? \`
            <div class="section">
              <div class="section-header">
                <div class="section-title">Available Processes</div>
                <div class="section-badge">\${available.length}</div>
              </div>
              \${available.map(proc => renderProcessCard(proc, false)).join('')}
            </div>
          \` : ''}

          \${state.processes.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">No processes available</div></div>' : ''}
        \`;
      }

      function renderProcessCard(proc, installed) {
        return \`
          <div class="process-card \${installed ? 'installed' : ''}">
            <div class="process-header">
              <div>
                <div class="process-title">\${proc.name}</div>
                <div class="process-version">v\${proc.version}</div>
              </div>
              \${installed ? \`
                <div class="process-header-actions">
                  <button class="button button-small button-secondary" onclick="viewDocs('\${proc.id}')" title="View documentation">
                    📖 Docs
                  </button>
                  <button class="button button-small" onclick="runProcess('\${proc.id}')" title="Run this process">
                    ▶️ Run
                  </button>
                </div>
              \` : \`
                <button class="button button-small" onclick="installProcess('\${proc.id}')">
                  ⬇️ Install
                </button>
              \`}
            </div>
            <div class="process-description">\${proc.description}</div>
            \${installed ? \`
              <div class="process-meta">
                Status: Installed · \${proc.fileCount || 0} files
              </div>
            \` : ''}
          </div>
        \`;
      }

      function renderHelp() {
        return \`
          <div class="help-section">
            <h3>🚀 Getting Started</h3>
            <ul>
              <li>
                <strong>1. Select AI Tools</strong><br>
                Choose which AI assistants you want to use in the AI Tools tab
              </li>
              <li>
                <strong>2. Install Processes</strong><br>
                Pick workflows like deep-verify, deep-explore in the Processes tab
              </li>
              <li>
                <strong>3. Run a Workflow</strong><br>
                Use chat: <code>@deep-process /verify &lt;question&gt;</code> or command palette
              </li>
            </ul>
          </div>

          <div class="help-section">
            <h3>📚 Process Guides</h3>
            <ul>
              <li>
                <strong>deep-verify:</strong> Structured verification and fact-checking
              </li>
              <li>
                <strong>deep-explore:</strong> Systematic decision exploration
              </li>
              <li>
                <strong>deep-document:</strong> Auto-generate documentation from code
              </li>
              <li>
                <strong>deep-feasibility:</strong> Assess feasibility across 10 dimensions
              </li>
              <li>
                <strong>deep-synthesis:</strong> Synthesize multiple sources
              </li>
            </ul>
          </div>

          <div class="help-section">
            <h3>🔧 Troubleshooting</h3>
            <ul>
              <li>
                <strong>AI tool not detected?</strong><br>
                Try clicking the refresh button (🔄) or manually install the extension from the marketplace. Restart VSCode after installing new extensions.
              </li>
              <li>
                <strong>Chat workflows not available?</strong><br>
                VSCode 1.85+ required for Chat Participant API. Update VSCode or use Command Palette workflows instead.
              </li>
              <li>
                <strong>Process not working?</strong><br>
                Ensure the process is installed in the Processes tab and your AI tool is configured properly.
              </li>
              <li>
                <strong>Installation failed?</strong><br>
                Check workspace permissions and ensure the folder is writable. View developer console (Help → Toggle Developer Tools) for detailed errors.
              </li>
              <li>
                <strong>Commands redirect to chat?</strong><br>
                This is expected behavior. For direct execution, workflows load in a markdown document. For interactive execution, use the Chat Participant with <code>@deep-process /command</code>.
              </li>
            </ul>
          </div>

          <div class="help-section" style="background: var(--vscode-textBlockQuote-background); padding: 12px; border-radius: 4px;">
            <h3>⚙️ Requirements</h3>
            <ul>
              <li><strong>VSCode Version:</strong> 1.85.0 or later (for Chat Participant features)</li>
              <li><strong>AI Tools:</strong> At least one compatible AI assistant (Copilot, Continue, Cline, etc.)</li>
              <li><strong>Workspace:</strong> Open workspace folder (required for installation)</li>
            </ul>
          </div>
        \`;
      }

      function renderToolsActionBar() {
        return \`
          <div class="action-bar">
            <button class="button button-secondary" onclick="saveConfig()">
              💾 Save
            </button>
            <button class="button" onclick="saveAndInstall()">
              🚀 Save & Install
            </button>
          </div>
        \`;
      }

      function attachEventListeners() {
        document.querySelectorAll('.tool-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', handleCheckboxChange);
        });
      }

      function handleCheckboxChange(event) {
        const toolId = event.target.dataset.toolId;
        const isChecked = event.target.checked;

        if (isChecked) {
          if (!state.enabledTools.includes(toolId)) {
            state.enabledTools.push(toolId);
          }
        } else {
          state.enabledTools = state.enabledTools.filter(id => id !== toolId);
        }
      }

      function getToolIcon(toolName) {
        const icons = {
          'GitHub Copilot Chat': '🤖',
          'GitHub Copilot (Legacy)': '🤖',
          'Continue.dev': '⚡',
          'Cline': '🔧',
          'Windsurf': '🌊',
          'Roo Code': '🦘',
          'Claude CLI': '🔮',
          'Gemini CLI': '💎'
        };
        return icons[toolName] || '🔹';
      }

      function formatTime(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return \`\${minutes} min ago\`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return \`\${hours} hour\${hours > 1 ? 's' : ''} ago\`;
        return 'Recently';
      }

      function switchTab(tab) {
        console.log('[Deep Process] Switching to tab:', tab);
        vscode.postMessage({ type: 'switchTab', tab });
      }

      function refreshTools() {
        vscode.postMessage({ type: 'refreshTools' });
      }

      function saveConfig() {
        vscode.postMessage({ type: 'saveConfig', enabledTools: state.enabledTools });
      }

      function saveAndInstall() {
        console.log('[Deep Process] Starting install with tools:', state.enabledTools);
        vscode.postMessage({ type: 'install', enabledTools: state.enabledTools });
      }

      function installProcess(processId) {
        vscode.postMessage({ type: 'installProcess', processId });
      }

      function uninstallProcess(processId) {
        vscode.postMessage({ type: 'uninstallProcess', processId });
      }

      function runProcess(processId) {
        vscode.postMessage({ type: 'runProcess', processId });
      }

      function viewDocs(processId) {
        vscode.postMessage({ type: 'viewDocs', processId });
      }

      function completeSetup() {
        vscode.postMessage({ type: 'completeSetup' });
      }

      function openExtension(url) {
        vscode.postMessage({ type: 'openExtension', url });
      }

      function uninstallTool(toolId) {
        if (confirm('Remove all integration files for ' + toolId + '?\\n\\nThis will delete all adapter files created for this tool.')) {
          vscode.postMessage({ type: 'uninstallTool', toolId });
        }
      }

      function updateCliFlags(toolId, flags) {
        vscode.postMessage({ type: 'updateCliFlags', toolId, flags });
      }

      function updateLoadingMessage(message) {
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
          loadingMessage.textContent = message;
        }
      }

      function showNotification(level, message) {
        const notification = document.createElement('div');
        notification.className = \`notification \${level}\`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 4000);
      }
    `;
  }
}
