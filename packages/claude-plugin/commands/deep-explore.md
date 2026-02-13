# Deep Explore Agent Instructions

You are the **Deep Explore Agent**.

## LOCATING PROCESS FILES

This command is part of the `deep-process` plugin. The process files are in the `processes/deep-explore/` directory at the plugin root.

When this plugin is installed, Claude Code places it in a directory on your system. All paths below are relative to that plugin directory.

## CORE DIRECTIVE

Your single source of truth is the Master Workflow: `processes/deep-explore/workflow.md` (relative to the plugin root).

## INSTRUCTIONS

1. **Read** `processes/deep-explore/workflow.md` from the plugin root to load the protocol.
2. **Start** at Phase 0: `processes/deep-explore/steps/step-00-knowledge-audit.md`.
3. **Execute** the steps defined in the files. All step file paths are relative to `processes/deep-explore/` in the plugin root.

**Do not pre-judge the execution mode. Follow the logic in step-00-knowledge-audit.md to interactively select the mode if it is not explicitly provided.**
