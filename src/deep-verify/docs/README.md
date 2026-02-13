# Deep Verify
![Deep Verify Logo](img/logo_small.png)

A structured second-pass verification workflow for LLM-generated code and documents.

## The problem

When I work with LLMs on complex projects, the biggest issues aren't syntax errors.
They're subtle logic problems that look correct until you slow down and trace the assumptions.

I tried splitting tasks into smaller chunks, but that doesn't help when a small change
affects distant parts of the codebase. Sometimes the LLM ignores instructions or does
things its own way. I needed a way to catch these issues before they propagate.

## What this is

Deep Verify is a prompt-based workflow that forces the LLM to systematically verify
a piece of code or document by:

1. Checking for vocabulary inconsistencies and undefined terms
2. Tracing assumptions and looking for contradictions
3. Matching against known impossibility patterns (e.g., "claims CAP theorem compliance while also claiming strong consistency + availability + partition tolerance")
4. Running adversarial review on its own findings (to avoid false positives)

The output is a structured report with exact quotes and a numeric score, not just "looks good."

## How to use it

You need an LLM CLI like Claude Code, Gemini CLI, or similar.

```
Use the process in src/core/deep-verify/workflow.md to verify path/to/file.py
```

Or with specific focus:

```
Verify src/api/ and pay attention to consistency with the PRD in docs/requirements.md
```

## What it's good at

- Finding contradictions between what the code does and what it claims to do
- Catching vocabulary drift (same term used differently in different places)
- Verifying that assumptions match reality
- Checking code against design documents

## Limitations

This isn't magic. Some things to know:

- **Scope matters.** It's designed to finish in bounded time. If you point it at a huge codebase, it will find some issues and stop. Better to verify smaller areas.
- **It's opinionated.** The scoring and thresholds work for me. You might want different sensitivity.
- **Still requires judgment.** UNCERTAIN verdicts are common. The tool surfaces issues, you decide what matters.
- **Pattern library is limited.** The impossibility patterns cover common cases (CAP theorem, cryptographic impossibilities, etc.) but won't catch domain-specific issues unless you add them.

## Example output

![Example verification report](img/result.png)

```
VERDICT: REJECT (Score: 7.5)

CRITICAL: Claims PFS (Perfect Forward Secrecy) but has key escrow mechanism
  Quote: "Perfect forward secrecy ensures past sessions cannot be decrypted" (Sec 2.1)
  Quote: "Enterprise key recovery allows retrieval of session keys" (Sec 4.3)
  Pattern match: DC-001 (PFS_ESCROW) - definitionally mutually exclusive

IMPORTANT: "Forward secrecy" used inconsistently
  Quote: "forward secrecy" (Sec 2.1) vs "recoverable forward secrecy" (Sec 4.3)
  No such standard term exists

Adversarial review: 0/4 challenges weakened these findings
```

## Project structure

```
src/core/deep-verify/
├── workflow.md              # Main workflow (point the LLM here)
├── data/
│   ├── pattern-library.yaml # Known impossibility patterns
│   ├── method-procedures/   # Individual verification methods
│   └── report-template.md   # Output format
└── steps/                   # Detailed phase documentation
```

## Works well with

- Pre-commit hooks (quick mode for fast sanity checks)
- PR reviews (verify changed files before merge)
- Checking AI-generated code before integration
- Validating that implementation matches requirements

## License

MIT
