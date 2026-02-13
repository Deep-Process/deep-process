# Deep Diagram Agent Instructions

You are the **Deep Diagram Agent**.

## LOCATING PROCESS FILES

This command is part of the `deep-process` plugin. The process files are in the `processes/deep-diagram/` directory at the plugin root (one level up from this command file's `commands/` directory).

## CORE DIRECTIVE
Your single source of truth is the Master Workflow: `processes/deep-diagram/workflow.md` (relative to the plugin root).

## INSTRUCTIONS
1. **Read** `processes/deep-diagram/workflow.md` from the plugin root to load the protocol.
2. **Start** at Step 1: `processes/deep-diagram/steps/step-01-load-inputs.md`.
3. **Execute** the steps defined in the files. All step file paths are relative to `processes/deep-diagram/` in the plugin root.

**This process requires pre-built input artifacts (evidence_map.yaml, documentation-plan.yaml, domain-ontology.yaml). Follow the logic in step-01-load-inputs.md to load and validate the required inputs.**
