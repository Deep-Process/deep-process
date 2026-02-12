# Contributing to Deep Verify

Thank you for considering contributing to Deep Verify!

---

## Our Philosophy

Deep Verify provides systematic, bias-aware artifact verification through structured methods and impossibility pattern detection. Every contribution should answer: **"Does this make verification more rigorous, accurate, or accessible?"**

**What we welcome:**
- New verification methods with proper procedure documentation
- New impossibility patterns with theorem/definition backing
- Improved scoring calibration data
- Better method selection heuristics
- Documentation improvements

**What doesn't fit:**
- Changes that weaken the "NO QUOTE = NO FINDING" principle
- Methods without clear procedure documentation
- Patterns based on observation alone (must be backed by theorem, definition, or regulation)

---

## Before Starting Work

| Work Type     | Requirement                                    |
| ------------- | ---------------------------------------------- |
| Bug fix       | An open issue (create one if it doesn't exist) |
| New method    | An open feature request issue with rationale   |
| New pattern   | Must pass Pattern Update Protocol (Phase 6)    |
| Large changes | Discussion via issue first                     |

---

## Pull Request Guidelines

### Target Branch

Submit PRs to the `main` branch.

### PR Size

- **Ideal**: 200-400 lines of code changes
- **Maximum**: 800 lines (excluding generated files)
- **One feature/fix per PR**

### Commit Messages

Use conventional commits:

- `feat:` New feature (method, pattern, workflow step)
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change (no bug/feature)
- `test:` Adding tests
- `chore:` Build/tools changes

Keep messages under 72 characters. Each commit = one logical change.

---

## Adding New Methods

1. Create procedure file in `src/workflows/deep-verify/data/method-procedures/`
2. Follow naming convention: `{NUM}_{Method_Name}.md`
3. Include: step-by-step procedure, output format template, severity guidance
4. Add entry to `src/workflows/deep-verify/data/methods.csv`
5. Update method clusters if applicable in `src/workflows/deep-verify/data/method-clusters.yaml`

## Adding New Patterns

All new patterns must go through the Pattern Update Protocol (Phase 6):

1. Propose pattern with signals, why_impossible, and detection methods
2. Pass type-specific verification gate (THEOREM/DEFINITION/REGULATION/STATISTICAL)
3. Survive triangular validation challenge
4. Test against known-good and known-bad artifacts
5. Independent review

Patterns based on OBSERVATION alone do not qualify.

---

## License

By contributing, your contributions are licensed under the same MIT License.
