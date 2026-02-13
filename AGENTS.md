# Deep Process — Agent Instructions

This repository contains structured workflows for LLM-assisted analysis. Each workflow is a self-contained process with step files, quality gates, and adversarial checks.

## Available workflows

| Command | Workflow file | Purpose |
|---------|--------------|---------|
| `deep-verify` | `src/deep-verify/workflow.md` | Verify code or documents for contradictions, assumption errors, and impossibility patterns |
| `deep-explore` | `src/deep-explore/workflow.md` | Systematically explore a decision space — separate facts from assumptions, discover options |
| `deep-architect` | `src/deep-architect/workflow.md` | Design software architecture through 16 operations (8 build + 8 adversarial) |
| `deep-feasibility` | `src/deep-feasibility/workflow.md` | Assess feasibility across 10 dimensions with GO/CONDITIONAL/NO-GO verdict |
| `deep-risk` | `src/deep-risk/workflow.md` | Discover, quantify, and map risk interactions with 5D scoring |
| `deep-synthesis` | `src/deep-synthesis/workflow.md` | Synthesize multiple sources into genuine understanding (not summary) |
| `deep-document` | `src/deep-document/workflow.md` | Generate evidence-based documentation from codebases |

## How to execute a workflow

1. Read the `workflow.md` file for the chosen process
2. Follow the execution sequence defined in that file
3. Load step files one at a time (`steps/step-NN-*.md`)
4. Evaluate quality gates after each step before proceeding
5. Do not skip steps or pre-judge execution modes — follow the interactive setup in the first step

## Key conventions

- Each step file is self-contained — it includes all instructions, schemas, and counter-checks needed
- Quality gates are binding — if a gate fails, halt and fix before proceeding
- Adversarial phases are mandatory — do not skip them
- Output must be structured and evidence-based, not conversational
