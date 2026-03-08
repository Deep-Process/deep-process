---
name: deep-compliance
description: >
  Use when user needs to check compliance against regulations, standards, or
  policies. Triggers: "is this compliant", "compliance check", "GDPR compliance",
  "SOC2 requirements", "regulatory review", "audit preparation".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, WebSearch]
---

# Deep Compliance — Regulatory & Policy Compliance Checking

## Purpose

Systematically check a system, process, or document against a specific regulation, standard, or policy. Map evidence, identify gaps, prioritize remediation.

## When to Use

- User needs to verify compliance against a named regulation or standard
- Audit preparation — need to know what evidence exists and what's missing
- Gap analysis before a compliance deadline

## Process

### Step 1: Identify Scope

Clarify before proceeding:

| Item | Value |
|------|-------|
| Regulation/Standard | e.g., GDPR, SOC2, ISO 27001, HIPAA, PCI-DSS |
| Version/Date | Which version of the standard |
| Scope | What's being assessed (full system, specific module, process) |
| Exclusions | What's explicitly out of scope |

If the user names a regulation but the scope is vague, ask.

### Step 2: Map Requirements to Evidence

For each requirement in the regulation/standard:

| Req ID | Requirement Summary | Evidence Present | Evidence Location | Status |
|--------|-------------------|-----------------|-------------------|--------|
| GDPR Art.5(1)(a) | Lawful basis for processing | Privacy policy, consent mechanism | /docs/privacy.md, /src/consent/ | Partial |
| GDPR Art.17 | Right to erasure | — | — | Missing |

Status values:
- **Met** — evidence clearly demonstrates compliance
- **Partial** — some evidence exists but incomplete
- **Missing** — no evidence found
- **N/A** — not applicable to this scope (with justification)
- **Not Assessed** — could not evaluate (e.g., requires runtime testing)

### Step 3: Assess Gaps

For each gap (Missing or Partial):

| Gap | Severity | Remediation Effort | Risk of Non-Compliance | Suggested Fix |
|-----|----------|-------------------|----------------------|---------------|
| No data deletion endpoint | Critical | M (3-5 days) | Regulatory fine | Add DELETE /user/data endpoint + background job |
| Incomplete audit logging | Major | S (1-2 days) | Audit finding | Add logging to auth and data access events |

Severity levels:
- **Critical** — legal/financial risk, blocks certification
- **Major** — significant finding, likely audit issue
- **Minor** — improvement needed, low risk

### Step 4: Produce Output

## Output Format

### Compliance Matrix

The full mapping table from Step 2.

### Summary

| Status | Count |
|--------|-------|
| Met | X |
| Partial | X |
| Missing | X |
| N/A | X |
| Not Assessed | X |

### Gap Register

The gap assessment table from Step 3, ordered by severity.

### Remediation Plan

Priority-ordered list of fixes:
1. [CRITICAL] Implement right to erasure — Art. 17
2. [MAJOR] Complete audit logging — SOC2 CC7.2
3. ...

### Not Assessed Items

Items that require human judgment, runtime testing, or organizational policy review. These are explicitly called out so nothing is silently skipped.

## Scope Transparency

This skill does NOT:
- Provide legal advice (it maps evidence to requirements)
- Guarantee compliance (it identifies gaps based on available information)
- Assess organizational/process controls (it focuses on technical evidence)
- Replace a qualified auditor's assessment
