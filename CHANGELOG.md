# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-02-15

### Added - Deep Verify Compact Mode

- **Compact Report Template** (`data/compact-report-template.md`)
  - Condensed output format: verdict, critical findings, recommendations only
  - Reduces report length from 500-1500 lines to 30-100 lines
  - Quality validated using 5 methods (#082, #083, #084, #088, #089)

- **Quality Validation System for Compact Mode**
  - Method #082 (Scope Integrity Audit) — prevents omission of critical elements
  - Method #083 (Closure Check) — ensures completeness and precision
  - Method #084 (Coherence Check) — validates internal consistency
  - Method #088 (Executability Check) — ensures actionable recommendations
  - Method #089 (Output Quality Score) — overall quality assessment (4+ on all dimensions)

- **Report Mode Selection**
  - New CLI flag: `--compact` / `-c`
  - Interactive menu option for report mode (Full / Compact)
  - `report_mode` field in frontmatter (full / compact)

- **Updated Documentation**
  - `docs/README.md` — compact mode usage examples
  - `COMPACT_MODE_IMPLEMENTATION.md` — complete implementation guide
  - Example compact report output

### Changed

- **step-00-setup.md** — added report mode selection and `--compact` flag support
- **step-05-report.md** — template selection logic, quality validation phase, dual output format
- **workflow.md** — documented report modes, added compact template to data files

### Important Notes

- Compact mode executes ALL 6 verification phases (same analysis depth as full mode)
- Only PRESENTATION changes — internal analysis is identical
- Backward compatible — full mode remains default
- Quality validation ensures compact reports meet all completeness/correctness standards

## [0.1.0] - 2025-01-26

### Added

- Initial BMad module structure with `src/`, `docs/`, `samples/`
- Module installer (`_module-installer/installer.js`)
- Agent definition (`deep-verifier.agent.yaml`)
- Module configuration (`module.yaml`)
- Module help system (`module-help.csv`)
- Package configuration with ESLint, Prettier
- 18 tiered verification methods across 3 tiers
- 24 impossibility patterns in 5 categories
- 7 step files (Phase 0-6)
- Cumulative evidence scoring system
- Pattern Update Protocol (PUP)
- Calibration framework

### Migration from V2.0

- Restructured from flat layout to BMad module standard
- Moved `workflow.md`, `steps/`, `data/` into `src/workflows/deep-verify/`
- Added agent YAML definition for integration with BMad Core
- Added module installer for `npx bmad-method` installation
