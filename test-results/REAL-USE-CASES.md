# Real-World Use Case Tests

**Date:** 2026-02-14
**Purpose:** Test processes on actual production scenarios
**Status:** Ready for execution

---

## USE CASE 1: Fintech Credit Scoring AI

### Business Context
**Company:** FinanceAI GmbH (Germany)
**System:** Credit risk assessment AI
**Users:** 50,000+ loan applications/month
**Deadline:** EU AI Act compliance by Aug 1, 2026

### System Description
```yaml
system_name: "CreditScore-AI"
deployment: "Production (EU-wide)"
business_function: "Automated credit decision support"

capabilities:
  - Historical data analysis (5M+ loan records)
  - ML model (XGBoost) for credit scoring
  - Real-time risk assessment
  - Automated approval/rejection recommendations
  - Integration with credit bureaus
  - Fraud detection
  - Customer segmentation

technology_stack:
  ml_framework: "scikit-learn, XGBoost"
  deployment: "AWS (Frankfurt region)"
  api: "REST API"
  database: "PostgreSQL"

compliance_requirements:
  - EU AI Act (Annex III.5 - Essential services)
  - GDPR
  - German banking regulations
```

### Test Execution Plan

**STEP 1: deep-compliance Assessment**
```
Inputs:
  - System description above
  - Code repository access
  - Existing documentation (technical specs, privacy policy)

Expected Outputs:
  - Risk classification: HIGH_RISK (Annex III.5)
  - Requirements mapped: 100+ (all EU AI Act articles)
  - Compliance gaps: 15-25 (estimated)
  - Critical gaps: 3-5
    - Likely gap: No documented risk management system
    - Likely gap: Training data bias not assessed
    - Likely gap: Explainability missing
  - Timeline: 12-16 weeks to compliance
  - Cost estimate: €80,000-120,000
```

**STEP 2: deep-challenge Security Testing**
```
Attack Vectors:
  - Data poisoning (corrupt training data)
  - Model inversion (extract training data)
  - Adversarial examples (manipulate credit scores)
  - API abuse (unauthorized access)
  - SQL injection in credit bureau queries

Expected Vulnerabilities:
  - CRITICAL: Model explainability bypass
  - HIGH: API rate limiting insufficient
  - HIGH: Training data not validated
  - MEDIUM: Weak authentication on admin panel
```

**STEP 3: deep-governance Policy Creation**
```
Policies Needed:
  - Data access control (who can access credit data)
  - Model update approval (human-in-the-loop)
  - Audit trail requirements
  - Customer notification policy
  - Model performance monitoring

Expected Controls:
  - Role-based access control (RBAC)
  - ML model versioning
  - Logging all credit decisions
  - Monthly bias testing
```

**STEP 4: deep-orchestration Remediation Workflow**
```
Workflow:
  Phase 1 (Immediate - 4 weeks):
    - Implement risk management framework
    - Add explainability to credit decisions
    - Fix critical security vulnerabilities

  Phase 2 (Urgent - 8 weeks):
    - Complete training data documentation
    - Implement bias testing
    - Add human oversight mechanisms

  Phase 3 (Scheduled - 16 weeks):
    - Full EU AI Act compliance
    - GDPR alignment
    - External audit preparation
```

### Success Metrics
- [ ] Compliance percentage: Target >= 95%
- [ ] All CRITICAL gaps resolved
- [ ] Security vulnerabilities: 0 CRITICAL remaining
- [ ] Policies implemented and enforced
- [ ] Ready for external audit by June 1, 2026

---

## USE CASE 2: Healthcare Diagnostic AI

### Business Context
**Company:** MedTech Solutions (Netherlands)
**System:** Medical image analysis for cancer detection
**Users:** 200+ hospitals across EU
**Regulatory:** MDR (Medical Device Regulation) + EU AI Act

### System Description
```yaml
system_name: "DiagnosticAI-Oncology"
deployment: "SaaS (cloud + on-premise)"
business_function: "AI-assisted cancer diagnosis from CT scans"

capabilities:
  - CT scan image analysis
  - CNN-based tumor detection (ResNet-50)
  - Tumor classification (benign/malignant)
  - Size and growth prediction
  - Report generation for radiologists
  - Integration with PACS systems
  - Anomaly detection

technology_stack:
  ml_framework: "TensorFlow, PyTorch"
  deployment: "Azure Health Cloud"
  compliance: "HIPAA, GDPR, MDR certified"

risk_level: "CRITICAL"
impact: "Direct patient health outcomes"
```

### Test Execution Plan

**STEP 1: deep-compliance (High Priority)**
```
Focus Areas:
  - EU AI Act Annex III.2 (Critical infrastructure - healthcare)
  - Article 9: Risk management (CRITICAL for medical devices)
  - Article 10: Training data (must be representative of patient diversity)
  - Article 14: Human oversight (radiologist must review)
  - Article 15: Accuracy (must meet clinical standards)

Expected Critical Gaps:
  - Training data diversity documentation
  - False negative rate monitoring
  - Radiologist override mechanisms
  - Adverse event reporting

Deadline: URGENT (medical device, patient safety)
```

**STEP 2: deep-challenge (Security + Safety)**
```
Safety Testing:
  - False negative rate (missed cancers)
  - False positive rate (unnecessary procedures)
  - Edge cases (rare cancer types)
  - Adversarial examples (manipulated images)

Security Testing:
  - Patient data protection
  - Model tampering prevention
  - Access control to diagnostic results
  - HIPAA compliance verification

Expected Findings:
  - CRITICAL: False negative on rare cancer type
  - CRITICAL: Patient data exposed in logs
  - HIGH: Model vulnerable to adversarial attacks
```

**STEP 3: deep-governance**
```
Policies:
  - Patient consent for AI-assisted diagnosis
  - Radiologist review mandatory
  - Adverse event reporting
  - Model retraining approval
  - Data retention and deletion

Controls:
  - Radiologist must approve all diagnoses
  - Audit log of all AI predictions
  - Patient notification of AI usage
  - Regular bias and accuracy testing
```

### Success Metrics
- [ ] False negative rate: < 1%
- [ ] All CRITICAL safety issues resolved
- [ ] MDR + EU AI Act compliant
- [ ] External clinical validation completed

---

## USE CASE 3: E-commerce Recommendation Engine

### Business Context
**Company:** ShopSmart (France)
**System:** Product recommendation AI
**Scale:** 10M+ users, €500M annual revenue
**Challenge:** General-purpose AI but significant business impact

### System Description
```yaml
system_name: "RecommendAI"
deployment: "Production (EU + global)"
business_function: "Personalized product recommendations"

capabilities:
  - User behavior tracking
  - Collaborative filtering
  - Deep learning recommendations (PyTorch)
  - Real-time personalization
  - A/B testing framework
  - Revenue optimization
  - Customer segmentation

risk_classification: "GENERAL_PURPOSE"
  # Not high-risk (Annex III) but significant business impact
```

### Test Execution Plan

**STEP 1: deep-compliance (Lower Priority)**
```
Requirements:
  - Article 52: Transparency (users must know AI is used)
  - GDPR: User data protection
  - No high-risk requirements (not Annex III)

Expected Gaps:
  - Transparency disclosure missing
  - User consent for AI recommendations
  - Data processing documentation

Timeline: 4-6 weeks (lighter requirements)
Cost: €15,000-25,000
```

**STEP 2: deep-challenge**
```
Focus: Business Impact, not Safety

Test Vectors:
  - Filter bubble (recommendations too narrow)
  - Price manipulation detection
  - Discriminatory recommendations
  - Data privacy leaks
  - Bot manipulation of recommendations

Expected:
  - MEDIUM: Recommendations can be manipulated
  - MEDIUM: User data in recommendation API response
  - LOW: Filter bubble effect
```

**STEP 3: deep-governance**
```
Policies:
  - User transparency notification
  - Recommendation bias monitoring
  - User opt-out mechanism
  - Data minimization

Controls:
  - Transparency banner on website
  - Monthly bias audit
  - User preference controls
  - GDPR-compliant data deletion
```

### Success Metrics
- [ ] Transparency compliance: 100%
- [ ] User opt-out functional
- [ ] No discriminatory patterns in recommendations
- [ ] GDPR compliant

---

## USE CASE 4: Smart City Traffic Management

### Business Context
**Company:** CityAI (Spain - Barcelona)
**System:** AI-optimized traffic light control
**Impact:** 3M+ residents, emergency services routing
**Classification:** HIGH_RISK (Critical infrastructure)

### System Description
```yaml
system_name: "TrafficOptimizer-AI"
deployment: "City-wide (2000+ intersections)"
business_function: "Real-time traffic light optimization"

capabilities:
  - Traffic flow prediction
  - Real-time traffic light control
  - Emergency vehicle prioritization
  - Congestion detection and mitigation
  - Historical pattern analysis
  - Weather integration
  - Incident detection

technology_stack:
  ml_framework: "TensorFlow"
  sensors: "Traffic cameras, loop detectors"
  edge_computing: "NVIDIA Jetson"
  cloud: "Google Cloud"

risk_level: "HIGH_RISK"
annex_iii_category: "Annex III.2 - Critical infrastructure"
```

### Test Execution Plan

**STEP 1: deep-compliance**
```
Critical Requirements:
  - Article 9: Risk management (system failure = traffic chaos)
  - Article 14: Human oversight (traffic control center)
  - Article 15: Robustness (must handle sensor failures)

Expected Critical Gaps:
  - Fallback to manual control not documented
  - Emergency vehicle prioritization not tested
  - System resilience under sensor failures
  - Human override procedures unclear

Compliance: ~60% (significant gaps)
Timeline: 20-24 weeks
```

**STEP 2: deep-challenge**
```
Safety Testing:
  - Emergency vehicle delay scenarios
  - Sensor failure handling
  - Adversarial manipulation (hacked cameras)
  - Cascade failures (one intersection failure spreads)

Security Testing:
  - Traffic camera hijacking
  - Control system access
  - DOS attacks on traffic AI

Expected CRITICAL Findings:
  - Emergency vehicles can be delayed by AI
  - Sensor failure causes gridlock
  - Traffic cameras vulnerable to hijacking
```

**STEP 3: deep-governance**
```
Policies:
  - Emergency vehicle absolute priority
  - Human override within 30 seconds
  - Sensor redundancy requirements
  - Incident response procedures

Controls:
  - 24/7 traffic control center monitoring
  - Automatic failover to manual control
  - Emergency vehicle detection from multiple sources
  - Real-time anomaly detection
```

### Success Metrics
- [ ] Emergency vehicle delay: 0 incidents
- [ ] System uptime: > 99.9%
- [ ] Sensor failure: Graceful degradation
- [ ] Human override: < 30 second response time

---

## USE CASE 5: Educational Content Moderation

### Business Context
**Company:** EduPlatform (Poland)
**System:** AI content moderation for student forums
**Users:** 500,000+ students (ages 13-18)
**Risk:** HIGH (Education + minors)

### System Description
```yaml
system_name: "SafeLearn-Moderator"
deployment: "Cloud (EU)"
business_function: "Automated content moderation for student discussions"

capabilities:
  - Text analysis for harmful content
  - Image moderation (NSFW detection)
  - Cyberbullying detection
  - Hate speech identification
  - Automatic content removal
  - Reporting to educators
  - Age-appropriate content filtering

risk_classification: "HIGH_RISK"
annex_iii_category: "Annex III.3 - Education"
impact: "Mental health of minors"
```

### Test Execution Plan

**STEP 1: deep-compliance**
```
Critical Requirements:
  - Article 9: Risk management (protect minors)
  - Article 13: Transparency (students/parents informed)
  - Article 14: Human oversight (educator review)
  - Article 10: Training data (representative, bias-free)

Expected Critical Gaps:
  - Bias in content moderation (cultural sensitivity)
  - False positives (legitimate content removed)
  - Educator oversight not enforced
  - Parent notification missing

Compliance: ~55%
Timeline: 18-20 weeks
```

**STEP 2: deep-challenge**
```
Testing Focus: Bias + Safety

Test Cases:
  - False negatives (harmful content not detected)
  - False positives (legitimate content blocked)
  - Bias against certain groups
  - Evasion techniques (obfuscated harmful content)
  - Adversarial prompts

Expected Findings:
  - CRITICAL: Bias against non-native language speakers
  - CRITICAL: False negatives on subtle bullying
  - HIGH: False positives on educational content
```

**STEP 3: deep-governance**
```
Policies:
  - Educator review of all removals
  - Parent notification for repeated violations
  - Student appeal process
  - Regular bias auditing

Controls:
  - Human review queue for educators
  - Transparency report to parents
  - Appeal process within 24 hours
  - Monthly bias testing across demographics
```

### Success Metrics
- [ ] False negative rate: < 2%
- [ ] False positive rate: < 5%
- [ ] Bias across demographics: < 10% variance
- [ ] Educator review: 100% of removals

---

## Cross-Cutting Test Scenarios

### Scenario A: Regulatory Change
**Trigger:** EU AI Act amendment (new requirements added)

**Test:**
1. Run deep-compliance to detect new gaps
2. Use deep-orchestration to schedule remediation
3. Verify all processes adapt to new requirements

**Expected:** Processes handle regulatory updates within 2 weeks

---

### Scenario B: Security Incident
**Trigger:** Critical vulnerability discovered in production AI

**Test:**
1. deep-challenge detects vulnerability
2. deep-governance triggers incident response
3. deep-orchestration coordinates emergency patch
4. deep-compliance verifies no regulatory breach

**Expected:** Incident resolved within 24 hours

---

### Scenario C: Audit Preparation
**Trigger:** External EU AI Act audit scheduled

**Test:**
1. deep-compliance generates audit package
2. deep-governance provides evidence trail
3. deep-orchestration coordinates audit tasks
4. All processes complete audit prep in 1 week

**Expected:** Audit-ready package with 100% evidence coverage

---

## Execution Timeline

### Week 1-2: Setup
- [ ] Access to real systems (with permission)
- [ ] Setup test environments
- [ ] Prepare test data

### Week 3-4: Use Case 1 (Fintech)
- [ ] Run all 4 processes
- [ ] Document findings
- [ ] Measure metrics

### Week 5-6: Use Case 2 (Healthcare)
- [ ] Execute tests
- [ ] Compare with Use Case 1
- [ ] Identify patterns

### Week 7-8: Use Cases 3, 4, 5
- [ ] Execute remaining use cases
- [ ] Comprehensive analysis
- [ ] Final report

### Week 9: Analysis & Reporting
- [ ] Aggregate results
- [ ] Identify process improvements
- [ ] Create recommendations

---

## Success Criteria

### Process Performance
- [ ] All 4 processes complete successfully on all use cases
- [ ] No gate violations
- [ ] Counter-checks effective (10-20% false positive reduction)
- [ ] Execution time within estimates

### Business Value
- [ ] Critical gaps identified in all high-risk systems
- [ ] Compliance roadmaps achievable before Aug 2026 deadline
- [ ] Security vulnerabilities found and categorized
- [ ] Governance policies created and implementable

### Quality Metrics
- [ ] Accuracy: Findings validated by domain experts
- [ ] Completeness: No major gaps missed
- [ ] Actionability: All recommendations implementable
- [ ] Cost-effectiveness: ROI positive within 12 months

---

**Status:** Test plan ready for execution
**Next Step:** Secure access to real systems and begin Use Case 1
**Owner:** Deep-Process Team
**Target Completion:** 9 weeks from start
