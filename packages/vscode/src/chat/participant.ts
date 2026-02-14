import * as vscode from 'vscode';
import { readConfig, loadManifest } from '@deep-process/core';
import {
  loadWorkflowFiles,
  formatWorkflowForChat,
  formatFirstStepForChat,
  getProcessDir,
  isProcessInstalled
} from './workflow-helpers';

interface ChatCommand {
  name: string;
  processId: string;
  description: string;
}

const CHAT_COMMANDS: ChatCommand[] = [
  {
    name: 'verify',
    processId: 'deep-verify',
    description: 'Structured verification and fact-checking'
  },
  {
    name: 'explore',
    processId: 'deep-explore',
    description: 'Think through decisions systematically'
  },
  {
    name: 'document',
    processId: 'deep-document',
    description: 'Generate documentation from code'
  },
  {
    name: 'feasibility',
    processId: 'deep-feasibility',
    description: 'Assess feasibility across 10 dimensions'
  },
  {
    name: 'synthesis',
    processId: 'deep-synthesis',
    description: 'Synthesize multiple sources'
  }
];

export function registerChatParticipant(context: vscode.ExtensionContext) {
  const vscodeAny = vscode as any;

  if (!vscodeAny.chat || !vscodeAny.chat.createChatParticipant) {
    console.log('Chat API not available in this VS Code version');
    return;
  }

  const participant = vscodeAny.chat.createChatParticipant(
    'deep-process.chat',
    async (
      request: any,
      chatContext: any,
      stream: any,
      token: any
    ) => {
      try {
        await handleChatRequest(request, chatContext, stream, token);
      } catch (error) {
        console.error('Chat participant error:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        stream.markdown(`\n\n❌ **Error executing workflow:** ${errorMsg}\n\n`);
        stream.markdown(
          'This may be due to:\n' +
          '- Process files not installed (run `Deep Process: Install`)\n' +
          '- Corrupted process files (try reinstalling)\n' +
          '- File permission issues\n\n' +
          'Check the Output panel for more details.'
        );
      }
    }
  );

  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.svg');

  context.subscriptions.push(participant);
  console.log('Deep Process chat participant registered');
}

async function handleChatRequest(
  request: any,
  chatContext: any,
  stream: any,
  token: any
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    stream.markdown('❌ **No workspace folder open.** Please open a workspace to use Deep Process.\n');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    stream.markdown(
      '❌ **Deep Process not installed.**\n\n' +
      'Run the `Deep Process: Install` command to install process files first.\n'
    );
    return;
  }

  // Determine which command was used
  const commandName = request.command || 'verify'; // Default to verify
  const chatCommand = CHAT_COMMANDS.find(cmd => cmd.name === commandName);

  if (!chatCommand) {
    stream.markdown(`❌ **Unknown command:** ${commandName}\n\nAvailable commands: ${CHAT_COMMANDS.map(c => c.name).join(', ')}\n`);
    return;
  }

  // Check if process is installed
  if (!isProcessInstalled(config, chatCommand.processId)) {
    stream.markdown(
      `❌ **Process not installed:** ${chatCommand.processId}\n\n` +
      'Run `Deep Process: Install` to install all processes.\n'
    );
    return;
  }

  // Load the process manifest
  const manifest = loadManifest(chatCommand.processId);

  if (!manifest) {
    stream.markdown(`❌ **Process manifest not found:** ${chatCommand.processId}\n`);
    return;
  }

  // Load workflow files
  const processDir = getProcessDir(projectRoot, config.installation.processDir, chatCommand.processId);

  let workflowContext;
  try {
    workflowContext = await loadWorkflowFiles(processDir, manifest);
  } catch (error) {
    stream.markdown(`❌ **Failed to load workflow files:** ${error instanceof Error ? error.message : String(error)}\n`);
    return;
  }

  // Stream the workflow instructions
  stream.markdown(formatWorkflowForChat(workflowContext));
  stream.markdown('---\n\n');
  stream.markdown(formatFirstStepForChat(workflowContext));
  stream.markdown('---\n\n');

  // Add user's input context
  const userPrompt = request.prompt?.trim();
  if (userPrompt) {
    stream.markdown(`## 💬 User Input\n\n`);
    stream.markdown(`> ${userPrompt}\n\n`);
    stream.markdown(`Now execute the workflow to address this input. Follow the protocol step by step.\n\n`);
  } else {
    stream.markdown(`## ⚡ Ready to Start\n\n`);
    stream.markdown(`The workflow is loaded. Provide your input to begin the ${manifest.name} process.\n\n`);
    stream.markdown(getExamplePrompts(chatCommand.processId));
  }

  // Add reference to process files
  stream.markdown(`---\n\n`);
  stream.markdown(`📁 **Process files location:** \`${config.installation.processDir}/${chatCommand.processId}/\`\n\n`);
  stream.markdown(
    `You can read additional step files and data files from this directory as needed during workflow execution.\n`
  );
}

function getExamplePrompts(processId: string): string {
  const examples: Record<string, string[]> = {
    'deep-verify': [
      'Verify the claims in this document: [paste content]',
      'Analyze this code for accuracy: [paste code]',
      'Check these API docs for contradictions'
    ],
    'deep-explore': [
      'Explore the tradeoffs of using REST vs GraphQL',
      'Help me think through database design options',
      'What are the implications of choosing microservices?'
    ],
    'deep-document': [
      'Generate documentation for this codebase',
      'Document the API endpoints in this file',
      'Create user guide for this feature'
    ],
    'deep-feasibility': [
      'Assess feasibility of real-time collaboration feature',
      'Evaluate building a mobile app with current team',
      'Can we migrate to Kubernetes in 3 months?'
    ],
    'deep-synthesis': [
      'Synthesize these research papers: [links]',
      'Combine insights from these code reviews',
      'Merge learnings from multiple incident reports'
    ]
  };

  const prompts = examples[processId] || examples['deep-verify'];

  return `**Example prompts:**\n${prompts.map(p => `- "${p}"`).join('\n')}\n\n`;
}
