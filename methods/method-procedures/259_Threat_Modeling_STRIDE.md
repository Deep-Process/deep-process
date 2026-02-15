# 103 - Threat Modeling (STRIDE+)

## Phase
IDENTIFY (Vertical)

## Purpose
Structured adversarial analysis - what could a malicious or negligent actor do? Extended beyond traditional security STRIDE to include business and organizational threats.

## STRIDE+ Categories

| Threat | Technical Examples | Business Examples |
|--------|-----------|----------|
| **S**poofing | Identity impersonation, credential theft | Brand impersonation, fake partnerships |
| **T**ampering | Data modification, code injection | Contract manipulation, process subversion |
| **R**epudiation | Log deletion, untraceable actions | Deniable commitments, verbal-only agreements |
| **I**nformation Disclosure | Data leak, side-channel attack | Competitive intelligence leak, insider trading |
| **D**enial of Service | DDoS, resource exhaustion, rate limits | Key person unavailability, budget freeze, decision paralysis |
| **E**levation of Privilege | Auth bypass, role escalation | Scope creep, unauthorized decision-making |

## Procedure

### Step 1: Define Trust Boundaries
Map all trust boundaries:
- Who/what is inside vs outside?
- Where does data cross boundaries?
- Where do permissions change?

### Step 2: Apply STRIDE+ at Each Boundary
For each boundary crossing, evaluate all six STRIDE+ categories.

### Step 3: Attacker Profile
For each threat, define:
- **Motivation**: Why would someone do this?
- **Capability**: What skills/resources needed?
- **Access**: How could they get into position?

### Step 4: Threat Level Calculation
```
Threat Level = Motivation x Capability x Access
```

### Step 5: Agency Risk Integration
Note: Agency risks from #001 live here. Misaligned incentives create "adversaries" even among partners.

## Output Schema
```yaml
threats:
  - boundary: "Boundary description"
    stride_category: "[Spoofing|Tampering|Repudiation|Information Disclosure|DoS|Elevation]"
    domain: "[Technical|Business]"
    scenario: "What the attacker does"
    attacker_profile:
      motivation: "Why they would do this"
      capability: "[Low|Medium|High]"
      access: "[None|Limited|Full]"
    threat_level: "[Low|Medium|High|Critical]"
    existing_controls: "Current protections"
    control_gaps: "What's missing"
```

## Quality Checks
- [ ] All trust boundaries identified
- [ ] All six STRIDE+ categories evaluated per boundary
- [ ] Both technical and business threats considered
- [ ] Attacker profiles realistic (not just "sophisticated hacker")
- [ ] Internal threats (employees, partners) considered

## Connections
- Feeds into: #201 (agency score component), #401 (mitigation strategy)
- Uses output from: #001 (agency genesis), architecture documentation
- Related to: #109 (blind spots - internal threats often overlooked)

## Examples

### Technical: API Gateway Boundary
```yaml
Boundary: External client -> API Gateway

Spoofing:
  scenario: "Stolen API key used to impersonate legitimate client"
  motivation: "Access data, avoid rate limits"
  capability: Medium (API keys can be scraped from repos)
  access: Limited (needs to find leaked key)
  threat_level: High
  existing_controls: API key rotation, IP allowlisting
  control_gaps: No anomaly detection on usage patterns

Tampering:
  scenario: "Man-in-middle modifies request payload"
  motivation: "Alter transaction amounts"
  capability: Medium (requires network position)
  access: Limited (TLS prevents most)
  threat_level: Low
  existing_controls: TLS, request signing
  control_gaps: None significant

DoS:
  scenario: "Volumetric attack exhausts rate limits for all clients"
  motivation: "Competitive sabotage, ransom"
  capability: Low (DDoS-for-hire services)
  access: Full (public endpoint)
  threat_level: High
  existing_controls: Rate limiting, WAF
  control_gaps: No geographic filtering, no surge capacity
```

### Business: Vendor Partnership Boundary
```yaml
Boundary: Company <-> Critical SaaS Vendor

Information Disclosure:
  scenario: "Vendor employee accesses our data for competitor"
  motivation: "Financial gain, corporate espionage"
  capability: High (has legitimate access)
  access: Full (part of service delivery)
  threat_level: High
  existing_controls: NDA, SOC2 requirement
  control_gaps: No audit of vendor employee access to our data

DoS (Business):
  scenario: "Vendor acquired by competitor, service deprecated"
  motivation: "Business strategy, not malice"
  capability: Full (they control the service)
  access: Full (contractual relationship)
  threat_level: Medium
  existing_controls: None
  control_gaps: No exit clause, no data portability guarantee

Elevation of Privilege:
  scenario: "Vendor scope creeps into areas beyond original contract"
  motivation: "Expand revenue, become indispensable"
  capability: High (trust relationship)
  access: Full (existing integration)
  threat_level: Medium
  existing_controls: Contract scope definition
  control_gaps: No regular boundary review
```
