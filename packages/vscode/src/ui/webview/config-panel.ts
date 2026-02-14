import * as vscode from 'vscode';
import { detectTools, DetectedTool } from '../../detectors/tool-detector';

export class ConfigPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'deep-process.configView';
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
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
    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.type) {
        case 'getTools':
          this._sendToolsToWebview();
          break;
        case 'saveConfig':
          this._saveConfig(data.enabledTools);
          break;
        case 'install':
          this._saveAndInstall(data.enabledTools);
          break;
      }
    });

    // Send initial data
    this._sendToolsToWebview();
  }

  private _sendToolsToWebview() {
    const tools = detectTools();
    const config = vscode.workspace.getConfiguration('deep-process');
    const enabledTools = config.get<string[]>('enabledTools', []);

    this._view?.webview.postMessage({
      type: 'toolsData',
      tools,
      enabledTools
    });
  }

  private async _saveConfig(enabledTools: string[]) {
    const config = vscode.workspace.getConfiguration('deep-process');
    await config.update('enabledTools', enabledTools, vscode.ConfigurationTarget.Workspace);

    vscode.window.showInformationMessage(
      `Saved! ${enabledTools.length} tool(s) enabled. Run "Deep Process: Install" to set up.`
    );
  }

  private async _saveAndInstall(enabledTools: string[]) {
    const config = vscode.workspace.getConfiguration('deep-process');
    await config.update('enabledTools', enabledTools, vscode.ConfigurationTarget.Workspace);

    // Trigger install command
    vscode.commands.executeCommand('deep-process.install');
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Process Configuration</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      padding: 0;
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
    }
    .container {
      padding: 16px;
    }
    .header {
      padding: 16px;
      background: var(--vscode-editor-background);
      border-bottom: 1px solid var(--vscode-panel-border);
      margin-bottom: 20px;
    }
    .header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header-icon {
      width: 24px;
      height: 24px;
    }
    .header-subtitle {
      margin: 4px 0 0 32px;
      font-size: 13px;
      opacity: 0.7;
      font-weight: normal;
    }
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
      display: flex;
      align-items: center;
      padding: 10px 12px;
      margin-bottom: 6px;
      border-radius: 6px;
      background: var(--vscode-editor-background);
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .tool-item:hover {
      background: var(--vscode-list-hoverBackground);
      border-color: var(--vscode-focusBorder);
    }
    .tool-item.disabled {
      opacity: 0.5;
    }
    .tool-checkbox {
      margin: 0 12px 0 0;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .tool-checkbox:disabled {
      cursor: not-allowed;
    }
    .tool-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .tool-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tool-name {
      font-weight: 500;
      font-size: 13px;
    }
    .tool-status {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .detected .status-indicator {
      background: var(--vscode-terminal-ansiGreen);
      box-shadow: 0 0 4px var(--vscode-terminal-ansiGreen);
    }
    .not-detected .status-indicator {
      background: var(--vscode-errorForeground);
    }
    .detected {
      color: var(--vscode-terminal-ansiGreen);
    }
    .not-detected {
      color: var(--vscode-errorForeground);
      opacity: 0.7;
    }
    .actions {
      position: sticky;
      bottom: 0;
      padding: 16px;
      background: var(--vscode-editor-background);
      border-top: 1px solid var(--vscode-panel-border);
      display: flex;
      gap: 10px;
      margin: 0 -16px;
    }
    .button {
      flex: 1;
      padding: 10px 16px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .button:hover:not(:disabled) {
      background: var(--vscode-button-hoverBackground);
    }
    .button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .button-primary {
      background: var(--vscode-button-background);
    }
    .button-secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .button-secondary:hover:not(:disabled) {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .empty-state {
      padding: 40px 20px;
      text-align: center;
      opacity: 0.6;
    }
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.4;
    }
    .loading {
      display: none;
      text-align: center;
      padding: 20px;
      opacity: 0.7;
    }
    .loading.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.1"/>
        <path d="M6 12 L10 16 L18 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Deep Process
    </h2>
    <div class="header-subtitle">Configure AI tool integrations</div>
  </div>

  <div class="container">
    <div class="loading" id="loading">Loading tools...</div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">VS Code Extensions</div>
        <div class="section-badge" id="ext-badge">0</div>
      </div>
      <div id="extensions"></div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">CLI Tools</div>
        <div class="section-badge" id="cli-badge">0</div>
      </div>
      <div id="cli-tools"></div>
    </div>
  </div>

  <div class="actions">
    <button class="button button-secondary" id="save-btn">
      <span>💾</span>
      <span>Save</span>
    </button>
    <button class="button button-primary" id="install-btn">
      <span>🚀</span>
      <span>Save & Install</span>
    </button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let tools = [];
    let enabledTools = [];

    // Request tools data on load
    vscode.postMessage({ type: 'getTools' });

    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;

      if (message.type === 'toolsData') {
        tools = message.tools;
        enabledTools = message.enabledTools || [];
        renderTools();
      }
    });

    function renderTools() {
      const loading = document.getElementById('loading');
      loading.classList.remove('active');

      const extensions = tools.filter(t => t.type === 'extension');
      const cliTools = tools.filter(t => t.type === 'cli');

      // Update badges
      const extDetected = extensions.filter(t => t.detected).length;
      const cliDetected = cliTools.filter(t => t.detected).length;
      document.getElementById('ext-badge').textContent = \`\${extDetected}/\${extensions.length}\`;
      document.getElementById('cli-badge').textContent = \`\${cliDetected}/\${cliTools.length}\`;

      renderToolSection('extensions', extensions);
      renderToolSection('cli-tools', cliTools);
    }

    function renderToolSection(containerId, toolList) {
      const container = document.getElementById(containerId);

      if (toolList.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <div>No tools in this category</div>
          </div>
        \`;
        return;
      }

      container.innerHTML = toolList.map(tool => {
        const isEnabled = enabledTools.includes(tool.id);
        const isDetected = tool.detected;
        const statusClass = isDetected ? 'detected' : 'not-detected';
        const statusText = isDetected
          ? \`Detected\${tool.version ? ' · v' + tool.version : ''}\`
          : 'Not installed';
        const toolIcon = getToolIcon(tool.name);

        return \`
          <div class="tool-item \${!isDetected ? 'disabled' : ''}">
            <input
              type="checkbox"
              class="tool-checkbox"
              data-tool-id="\${tool.id}"
              \${isEnabled ? 'checked' : ''}
              \${!isDetected ? 'disabled' : ''}
            >
            <div class="tool-icon">\${toolIcon}</div>
            <div class="tool-info">
              <div class="tool-name">\${tool.name}</div>
              <div class="tool-status \${statusClass}">
                <span class="status-indicator"></span>
                <span>\${statusText}</span>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      // Add event listeners
      container.querySelectorAll('.tool-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
      });
    }

    function getToolIcon(toolName) {
      const icons = {
        'GitHub Copilot': '🤖',
        'GitHub Copilot Chat': '💬',
        'Continue.dev': '⚡',
        'Cline': '🔧',
        'Windsurf': '🌊',
        'Roo Code': '🦘',
        'Claude CLI': '🔮',
        'Gemini CLI': '💎'
      };
      return icons[toolName] || '🔹';
    }

    function handleCheckboxChange(event) {
      const toolId = event.target.dataset.toolId;
      const isChecked = event.target.checked;

      if (isChecked) {
        if (!enabledTools.includes(toolId)) {
          enabledTools.push(toolId);
        }
      } else {
        enabledTools = enabledTools.filter(id => id !== toolId);
      }
    }

    document.getElementById('save-btn').addEventListener('click', () => {
      vscode.postMessage({
        type: 'saveConfig',
        enabledTools
      });
    });

    document.getElementById('install-btn').addEventListener('click', () => {
      vscode.postMessage({
        type: 'install',
        enabledTools
      });
    });
  </script>
</body>
</html>`;
  }
}
