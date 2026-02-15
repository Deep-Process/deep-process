# #173 Reference Chain Validation

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Trace reference chains from documentation back to code, verifying every link in the chain. Catches both phantoms and false relationships that single-hop checks miss.

## What to do

1. Identify multi-hop reference chains in documentation (A references B which references C)
2. Trace each chain to its terminal code element
3. Verify every link in the chain exists and the relationship is real
4. Flag broken chains, dangling references, and circular references

## Step-by-step

```
1. Extract reference chains from docs:
   FOR each generated document:
     Find all references:
       - "[Component] uses [Service]"
       - "[Service] depends on [Module]"
       - "[Module] imports [Library]"
       - "See [other-doc.md] for details on [X]"

   Build chains:
     Chain 1: architecture.md → "UserService" → "UserRepository" → "users table"
     Chain 2: api-contracts.md → "POST /users" → "UserController.create" → "UserService.create"
     Chain 3: data-models.md → "Order model" → "Product reference" → "Product model"

2. Verify each link:
   FOR each chain:
     FOR each link (A → B):
       a. Does A exist in code? [Y/N]
       b. Does B exist in code? [Y/N]
       c. Does A actually reference/use/call B in code? [Y/N]

       Link status:
       - VALID: all three checks pass
       - BROKEN_TARGET: A exists but B doesn't (phantom target)
       - BROKEN_SOURCE: B exists but A doesn't (phantom source)
       - FALSE_LINK: Both exist but A doesn't reference B
       - PHANTOM_CHAIN: Neither exists

3. Chain integrity assessment:
   FOR each chain:
     - ALL links VALID → Chain GROUNDED
     - Last link broken → Chain DANGLING (close to code but disconnected)
     - First link broken → Chain FLOATING (disconnected from entry point)
     - Middle link broken → Chain FRAGMENTED
     - Circular reference detected → Chain CIRCULAR (A→B→C→A)

4. Coverage assessment:
   - How many reference chains are fully grounded?
   - Which documents have the most broken chains?
   - Are broken chains clustered in specific areas (suggesting stale section)?
```

## Output format

```
Reference chains analyzed: [total count]

Chain integrity:
| Chain | Hops | Status | Broken Link |
|-------|------|--------|-------------|
| [start] → ... → [end] | [N] | GROUNDED | — |
| [start] → ... → [end] | [N] | DANGLING | [A] → [B] |
| [start] → ... → [end] | [N] | FLOATING | [A] → [B] |

Summary:
- Grounded chains: [N] ([%])
- Dangling chains: [N] ([%])
- Floating chains: [N] ([%])
- Fragmented chains: [N] ([%])
- Circular chains: [N] ([%])

Broken links detail:
| Source | Target | Relationship | Issue |
|--------|--------|-------------|-------|
| [A]    | [B]    | "uses"      | B not found in code |
| [A]    | [B]    | "calls"     | A doesn't call B |

Cluster analysis:
- [doc section/file]: [N] broken chains → likely STALE SECTION
- [doc section/file]: [N] broken chains → likely PHANTOM SECTION

FINDING (if any): [N] reference chains broken — [description of pattern]
QUOTE: "[exact reference text from doc]"
SEVERITY: CRITICAL (floating/phantom chains), IMPORTANT (dangling chains), MINOR (single broken link)
```
