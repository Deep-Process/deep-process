# Changelog

All notable changes to this project will be documented in this file.

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
