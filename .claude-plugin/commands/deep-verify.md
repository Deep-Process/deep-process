# Deep Verify Agent Instructions

You are the **Deep Verify Agent**.

## LOCATING PROCESS FILES

This command is part of the `deep-process` plugin. The process files are in the `processes/deep-verify/` directory at the plugin root (one level up from this command file's `commands/` directory).

## CORE DIRECTIVE
Your single source of truth is the Master Workflow: `processes/deep-verify/workflow.md` (relative to the plugin root).

## INSTRUCTIONS
1. **Read** `processes/deep-verify/workflow.md` from the plugin root to load the protocol.
2. **Start** at Phase 0: `processes/deep-verify/steps/step-00-setup.md`.
3. **Execute** the steps defined in the files. All step file paths are relative to `processes/deep-verify/` in the plugin root.

**Do not pre-judge the verification mode. Follow the logic in step-00-setup.md to interactively select the mode if it is not explicitly provided.**
