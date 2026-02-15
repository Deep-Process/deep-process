# 202 - Exposure Window Analysis

## Phase
QUANTIFY

## Purpose
Determine WHEN the system is vulnerable to each risk and for how long. Risks are not constant - they have windows of exposure that open and close.

## Core Concept

A risk doesn't exist uniformly across time:
- **Before window opens:** Not yet vulnerable
- **Window open:** Vulnerable, risk active
- **Window closed:** No longer vulnerable (or risk materialized)

Understanding exposure windows enables:
- Focusing attention during high-risk periods
- Identifying when multiple windows overlap (concentration)
- Planning mitigation timing

## Procedure

### Step 1: Window Mapping
For each risk, determine:

| Element | Question |
|---------|----------|
| **Opens** | When do we become vulnerable? |
| **Closes** | When does vulnerability end? (or: never?) |
| **Peak** | When is vulnerability highest? |
| **Duration** | How long is the window? |

### Step 2: Timeline Plotting
Plot all exposure windows on the project timeline.

```
Timeline: ─────────────────────────────────────────────────►
Risk A:     [████████]
Risk B:          [██████████████████████████
Risk C:   [████████████████]
Risk D:                          [████████████
                        ▲
                 CONCENTRATION: Multiple windows overlap
```

### Step 3: Concentration Identification
Find periods where multiple windows overlap.
These are high-risk periods requiring extra attention.

### Step 4: Window Type Classification

| Type | Characteristic | Example |
|------|----------------|---------|
| **Bounded** | Clear open and close | Migration window, release period |
| **Open-ended** | Opens but never closes | Dependency risk after adoption |
| **Recurring** | Opens periodically | Month-end processing, audit periods |
| **Conditional** | Opens only if event occurs | Risk activated by trigger |

### Step 5: Prioritization
Risks with imminent or currently-open windows get priority.
Risks with distant or closed windows can be deferred.

## Output Schema
```yaml
exposure_windows:
  - risk_id: "RISK-XXX"
    title: "Risk short description"
    window_type: "[Bounded|Open-ended|Recurring|Conditional]"
    opens: "Date or event when vulnerability begins"
    closes: "Date or event when vulnerability ends (or 'Never')"
    peak: "Period of highest vulnerability"
    duration: "How long the window is open"
    current_status: "[Not Yet Open|Open|Closed]"
    days_until_open: "If not yet open"
    days_until_close: "If bounded and open"

exposure_concentrations:
  - period: "Description of time period"
    start: "Start date"
    end: "End date"
    overlapping_risks:
      - "RISK-XXX"
      - "RISK-YYY"
    concentration_level: "[Low|Medium|High|Critical]"
    recommended_action: "What to do about this concentration"
```

## Quality Checks
- [ ] All risks have window analysis
- [ ] Window type classified
- [ ] Timeline plotted
- [ ] Concentrations identified
- [ ] Current status assessed

## Connections
- Feeds into: #502 (review cadence), #406 (trigger timing)
- Uses output from: #201 (scored risks), project timeline
- Related to: #111 (temporal risks have continuous windows)

## Examples

### Bounded Window: Data Migration
```yaml
risk_id: "RISK-015"
title: "Data corruption during migration"
window_type: Bounded
opens: "Migration start date (March 15)"
closes: "Migration complete + validation (March 22)"
peak: "Cutover weekend (March 18-19)"
duration: "7 days"
current_status: "Not Yet Open"
days_until_open: 45
days_until_close: 52
```

### Open-Ended Window: Vendor Dependency
```yaml
risk_id: "RISK-022"
title: "Vendor service deprecation"
window_type: Open-ended
opens: "Contract signed (January 1, 2024)"
closes: "Never (until we migrate away)"
peak: "After 2+ years when switching cost highest"
duration: "Indefinite"
current_status: "Open"
days_until_open: N/A
days_until_close: N/A
```

### Recurring Window: Month-End Processing
```yaml
risk_id: "RISK-031"
title: "Pipeline failure during regulatory reporting"
window_type: Recurring
opens: "Last 3 business days of each month"
closes: "Submission deadline"
peak: "Submission day"
duration: "3 days per month"
current_status: "Closed (next window in 18 days)"
days_until_open: 18
days_until_close: 21
```

### Conditional Window: Security Vulnerability
```yaml
risk_id: "RISK-044"
title: "Zero-day vulnerability in framework"
window_type: Conditional
opens: "When vulnerability disclosed"
closes: "When patch applied"
peak: "Between disclosure and patch"
duration: "Variable (historically 2-14 days for this framework)"
current_status: "Not Active (no current disclosure)"
days_until_open: "Unknown - depends on disclosure"
days_until_close: "Unknown"
```

## Exposure Concentration Example

```yaml
period: "Go-live week"
start: "2024-04-15"
end: "2024-04-22"
overlapping_risks:
  - "RISK-015: Data migration"
  - "RISK-018: Production deployment"
  - "RISK-023: Team capacity (all hands on deck)"
  - "RISK-027: Client availability for UAT"
  - "RISK-031: Coincides with month-end reporting"
concentration_level: Critical
recommended_action: |
  - Avoid month-end overlap if possible (move go-live)
  - Pre-stage all resources
  - War room established
  - Executive escalation path cleared
  - Rollback decision criteria pre-defined
```

## Visualization Template

```
2024-Q1 Risk Exposure Timeline
═══════════════════════════════════════════════════════════════
Jan         Feb         Mar         Apr         May
|           |           |           |           |

RISK-015 (Migration)
                        [▓▓▓▓▓▓▓▓▓▓]
                            ↑ Peak

RISK-022 (Vendor)
[══════════════════════════════════════════════════════════════►

RISK-031 (Month-end)
    [▓▓]        [▓▓]        [▓▓]        [▓▓]        [▓▓]

RISK-044 (Zero-day)
    ?????????????????????????????????????????????

CONCENTRATION ZONES:
                            ████ HIGH RISK PERIOD
                        (Migration + Month-end overlap)
═══════════════════════════════════════════════════════════════
```
