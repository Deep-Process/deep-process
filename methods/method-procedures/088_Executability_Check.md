# #88 Executability Check

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Verify that documented instructions are actionable and can be followed step-by-step.

## What to do

1. Identify all instruction-containing documents (development-guide, deployment-guide, contribution-guide)
2. For each set of instructions, verify:
   - Prerequisites are listed and available
   - Commands are complete and correct
   - Steps are in correct order (no forward references)
   - Environment assumptions are stated
3. Check that a developer could follow the instructions without additional context

## Step-by-step

```
1. Identify instruction documents:
   - development-guide.md: setup, run, test commands
   - deployment-guide.md: deploy process
   - contribution-guide.md: PR workflow

2. For each instruction set, check prerequisites:
   "Prerequisites: Node.js 18+, npm"
   -> Is Node version specified? ✓
   -> Is package manager specified? ✓
   -> Missing: OS requirements? Database requirements?

3. Verify command sequences:
   Step 1: "git clone <repo>"
   Step 2: "npm install"
   Step 3: "npm run dev"

   Check:
   - Are commands syntactically correct? ✓
   - Do they match package.json scripts? ✓
   - Is environment setup (.env) mentioned before run? MISSING

4. Check for forward references:
   - Step 3 says "configure as described in Step 7"
   -> Reader hasn't reached Step 7 yet
   -> BAD ORDERING

5. Verify environment assumptions:
   - Does "npm run db:migrate" assume database is running?
   - Is Docker required but not in prerequisites?
   - Are env variables listed with descriptions?

6. Dry-run test:
   Could a new developer follow these steps and get a running system?
   - Missing steps? [list]
   - Ambiguous steps? [list]
   - Wrong order? [list]
```

## Output format

```
Documents checked:
- [doc name]: [count] instruction sets

Prerequisites check:
| Document | Listed | Missing |
|----------|--------|---------|
| dev-guide | Node 18+, npm | OS, Docker |
| deploy-guide | Docker, kubectl | AWS access |

Command verification:
| Document | Step | Command | Valid | Issue |
|----------|------|---------|-------|-------|
| dev-guide | 2 | npm install | ✓ | |
| dev-guide | 4 | npm run migrate | ✗ | Script not in package.json |

Ordering issues:
- [doc:step] references [later step]

Environment assumptions:
- [assumption] not documented

Dry-run assessment:
- Completeness: [X]% of steps are self-contained
- Missing steps: [list]
- Ambiguous steps: [list]

FINDING (if any): [description]
QUOTE: "[instruction text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
