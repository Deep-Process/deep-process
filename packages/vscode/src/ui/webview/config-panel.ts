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

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'packages', 'vscode', 'media', 'style.css')
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Process Configuration</title>
  <style>
    body {
      padding: 10px;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
    }
    h2 {
      margin-top: 0;
      font-size: 1.2em;
      font-weight: 600;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--vscode-foreground);
    }
    .tool-item {
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 4px;
      border-radius: 4px;
      background: var(--vscode-editor-background);
    }
    .tool-item:hover {
      background: var(--vscode-list-hoverBackground);
    }
    .tool-checkbox {
      margin-right: 10px;
    }
    .tool-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tool-name {
      font-weight: 500;
    }
    .tool-status {
      font-size: 0.9em;
      opacity: 0.8;
    }
    .detected {
      color: var(--vscode-terminal-ansiGreen);
    }
    .not-detected {
      color: var(--vscode-errorForeground);
    }
    .button {
      padding: 8px 16px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    .empty-state {
      padding: 20px;
      text-align: center;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <h2>🚀 Deep Process Configuration</h2>

  <div class="section">
    <div class="section-title">VS Code Extensions</div>
    <div id="extensions"></div>
  </div>

  <div class="section">
    <div class="section-title">CLI Tools</div>
    <div id="cli-tools"></div>
  </div>

  <div class="actions">
    <button class="button" id="save-btn">Save Configuration</button>
    <button class="button" id="install-btn">Save & Install</button>
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
      const extensions = tools.filter(t => t.type === 'extension');
      const cliTools = tools.filter(t => t.type === 'cli');

      renderToolSection('extensions', extensions);
      renderToolSection('cli-tools', cliTools);
    }

    function renderToolSection(containerId, toolList) {
      const container = document.getElementById(containerId);

      if (toolList.length === 0) {
        container.innerHTML = '<div class="empty-state">No tools in this category</div>';
        return;
      }

      container.innerHTML = toolList.map(tool => {
        const isEnabled = enabledTools.includes(tool.id);
        const isDetected = tool.detected;
        const statusClass = isDetected ? 'detected' : 'not-detected';
        const statusText = isDetected
          ? \`✓ Detected\${tool.version ? ' (v' + tool.version + ')' : ''}\`
          : '✗ Not installed';

        return \`
          <div class="tool-item">
            <input
              type="checkbox"
              class="tool-checkbox"
              data-tool-id="\${tool.id}"
              \${isEnabled ? 'checked' : ''}
              \${!isDetected ? 'disabled' : ''}
            >
            <div class="tool-info">
              <div class="tool-name">\${tool.name}</div>
              <div class="tool-status \${statusClass}">\${statusText}</div>
            </div>
          </div>
        \`;
      }).join('');

      // Add event listeners
      container.querySelectorAll('.tool-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
      });
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
        type: 'saveConfig',
        enabledTools
      });
      // Trigger install command
      setTimeout(() => {
        vscode.postMessage({ type: 'install' });
      }, 500);
    });
  </script>
</body>
</html>`;
  }
}
