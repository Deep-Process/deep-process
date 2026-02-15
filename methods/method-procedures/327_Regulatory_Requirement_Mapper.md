# Method 327: Regulatory Requirement Mapper

**Category:** regulatory
**Priority:** 🔥 CRITICAL
**Complexity:** HIGH
**Effort:** 3-4 days
**Process:** deep-compliance

---

## Description

Automated mapping from EU AI Act articles to system capabilities with gap detection. Takes regulatory text (articles, annexes) and system description → generates requirement-to-capability mapping → identifies compliance gaps.

This method is CRITICAL for deep-compliance as it automates the tedious and error-prone process of manually mapping regulatory requirements to system capabilities.

---

## Input

```yaml
regulatory_source:
  type: string
  description: "Path to EU AI Act regulatory text (YAML/JSON format)"
  example: "regulations/eu-ai-act-2024.yaml"

system_description:
  type: dict
  description: "AI system capabilities, features, and documentation"
  structure:
    capabilities: list[string]
    features: list[string]
    documentation: list[string]
    code_references: list[string]

mapping_rules:
  type: dict
  description: "Domain-specific mapping rules (optional)"
  default: "built-in rules for common terms"
```

---

## Output

```yaml
regulatory_mapping:
  - article: "Art. 10 - Data and Data Governance"
    requirements:
      - requirement_id: "Art10-1"
        text: "Training data shall be subject to appropriate data governance"
        mapped_to: ["data_quality_checks", "data_versioning"]
        status: COVERED
        evidence: ["docs/data-governance.md", "code/data_pipeline.py:123"]

      - requirement_id: "Art10-2"
        text: "Training data shall be relevant, representative, free of errors"
        mapped_to: []
        status: GAP
        severity: HIGH
        recommendation: "Implement data quality validation pipeline"

coverage_summary:
  total_requirements: 47
  covered: 28 (60%)
  partial: 12 (25%)
  gaps: 7 (15%)
  critical_gaps: 3
```

---

## Procedure

### Step 1: Parse Regulatory Source

```python
def _parse_requirements(self, regulatory_source: str) -> List[Dict]:
    """
    Parse regulatory source into atomic requirements.

    1. Load regulatory text (YAML/JSON)
    2. Extract articles and annexes
    3. Split into atomic requirements (one testable claim per requirement)
    4. Assign unique IDs (e.g., "Art10-1", "Art10-2")
    5. Extract key terms (e.g., "data governance", "bias mitigation")

    Returns:
        List of requirement dicts with id, text, article, key_terms
    """
```

### Step 2: Extract System Capabilities

```python
def _extract_capabilities(self, system_description: Dict) -> List[str]:
    """
    Extract all capabilities from system description.

    1. Parse capabilities list
    2. Scan documentation for capability mentions
    3. Analyze code references for implemented features
    4. Build comprehensive capability inventory

    Returns:
        List of capability names
    """
```

### Step 3: Apply Mapping Rules

```python
def _apply_mapping_rules(
    self,
    requirement: Dict,
    capabilities: List[str]
) -> List[str]:
    """
    Map requirement to capabilities using semantic similarity + domain rules.

    Techniques:
    1. Keyword matching (e.g., "bias mitigation" → "fairness_testing")
    2. Semantic similarity (cosine similarity of embeddings)
    3. Domain-specific rules (e.g., "human oversight" → "override_mechanism")

    Returns:
        List of capability names that match requirement
    """
```

### Step 4: Find Evidence

```python
def _find_evidence(
    self,
    capability: str,
    system_description: Dict
) -> List[str]:
    """
    Find evidence that capability exists in system.

    Evidence types:
    - Documentation files
    - Code references (file:line_number)
    - Test results
    - Configuration settings

    Returns:
        List of evidence references
    """
```

### Step 5: Classify Coverage

```python
def _classify_coverage(
    self,
    requirement: Dict,
    mapped_capabilities: List[str],
    evidence: List[str]
) -> str:
    """
    Classify requirement coverage status.

    Classification:
    - COVERED: Capability exists + strong evidence (>80% confidence)
    - PARTIAL: Capability exists but evidence weak OR incomplete
    - GAP: No capability found or no evidence

    Returns:
        Status: "COVERED" | "PARTIAL" | "GAP"
    """
```

### Step 6: Generate Recommendations

```python
def _generate_recommendation(
    self,
    requirement: Dict,
    status: str
) -> str:
    """
    Generate recommendation for gaps and partial coverage.

    For GAPS:
    - Identify what capability is missing
    - Suggest implementation approach
    - Estimate effort

    For PARTIAL:
    - Identify what evidence is missing
    - Suggest how to complete coverage

    Returns:
        Recommendation text
    """
```

---

## Implementation

**File:** `methods/implementations/regulatory_requirement_mapper.py`

```python
from typing import List, Dict, Optional
import yaml
import json
from pathlib import Path

class RegulatoryRequirementMapper:
    """
    Map regulatory requirements to system capabilities with gap detection.

    Example:
        >>> mapper = RegulatoryRequirementMapper("regulations/eu-ai-act.yaml")
        >>> system = {
        ...     "capabilities": ["bias_mitigation", "data_versioning"],
        ...     "documentation": ["docs/governance.md"]
        ... }
        >>> result = mapper.map_to_capabilities(system)
        >>> print(result["coverage_summary"]["coverage"])
        85%
    """

    def __init__(
        self,
        regulatory_source: str,
        mapping_rules: Optional[Dict] = None
    ):
        self.regulatory_source = regulatory_source
        self.mapping_rules = mapping_rules or self._default_mapping_rules()
        self.requirements = self._parse_requirements()

    def map_to_capabilities(
        self,
        system_description: Dict
    ) -> Dict:
        """
        Main entry point: map requirements to system capabilities.

        Args:
            system_description: System capabilities and documentation

        Returns:
            Mapping result with coverage status and gaps
        """
        # Implementation in next steps...
        pass
```

---

## Examples

### Example 1: Full Coverage

```python
mapper = RegulatoryRequirementMapper("regulations/eu-ai-act.yaml")

system = {
    "capabilities": [
        "bias_mitigation",
        "human_oversight",
        "data_governance",
        "audit_logging"
    ],
    "documentation": [
        "docs/data-governance.md",
        "docs/human-oversight.md"
    ],
    "code_references": [
        "src/fairness/bias_detector.py",
        "src/oversight/human_review.py"
    ]
}

result = mapper.map_to_capabilities(system)

assert result["coverage_summary"]["coverage"] == 100
assert result["coverage_summary"]["gaps"] == 0
```

### Example 2: With Gaps

```python
system = {
    "capabilities": ["basic_logging"],  # Minimal capabilities
    "documentation": [],
    "code_references": []
}

result = mapper.map_to_capabilities(system)

assert result["coverage_summary"]["coverage"] < 50
assert result["coverage_summary"]["critical_gaps"] > 0

# Check gap recommendations
gaps = [r for r in result["regulatory_mapping"]
        if any(req["status"] == "GAP" for req in r["requirements"])]

assert len(gaps) > 0
assert all("recommendation" in req for gap in gaps for req in gap["requirements"] if req["status"] == "GAP")
```

### Example 3: Partial Coverage

```python
system = {
    "capabilities": ["bias_mitigation"],  # Has capability
    "documentation": [],  # But no documentation
    "code_references": []  # And no code reference
}

result = mapper.map_to_capabilities(system)

# Should show PARTIAL coverage (capability exists but weak evidence)
partial_reqs = [
    req for article in result["regulatory_mapping"]
    for req in article["requirements"]
    if req["status"] == "PARTIAL"
]

assert len(partial_reqs) > 0
assert all(req["coverage"] < 100 for req in partial_reqs)
```

---

## Integration

### Used By
- Method #329: Compliance Gap Analyzer (consumes mapping output)
- Method #331: Compliance Evidence Packager (includes mapping in bundle)
- deep-compliance process (PHASE 2: Requirements Mapping)

### Uses
- No dependencies (foundation method)

### Synergizes With
- Method #168: Existence Verification (verifies mapped capabilities actually exist)
- Method #169: Staleness Detection (checks if mapping is current)

---

## Testing

### Unit Tests

**File:** `methods/tests/test_regulatory_requirement_mapper.py`

```python
class TestRegulatoryRequirementMapper:

    def test_parse_requirements_eu_ai_act(self):
        """Test parsing EU AI Act into atomic requirements."""

    def test_extract_capabilities_from_system(self):
        """Test capability extraction from system description."""

    def test_apply_mapping_rules_keyword_match(self):
        """Test keyword-based mapping."""

    def test_apply_mapping_rules_semantic_similarity(self):
        """Test semantic similarity mapping."""

    def test_find_evidence_documentation(self):
        """Test finding evidence in documentation."""

    def test_find_evidence_code(self):
        """Test finding evidence in code references."""

    def test_classify_coverage_full(self):
        """Test COVERED classification."""

    def test_classify_coverage_partial(self):
        """Test PARTIAL classification."""

    def test_classify_coverage_gap(self):
        """Test GAP classification."""

    def test_generate_recommendation_for_gap(self):
        """Test recommendation generation for gaps."""

    def test_map_to_capabilities_end_to_end(self):
        """Test full mapping workflow."""
```

### Integration Tests

```python
def test_integration_with_method_329_gap_analyzer():
    """Test that output can be consumed by Gap Analyzer."""

def test_integration_with_method_331_evidence_packager():
    """Test that mapping can be packaged for audit."""
```

### Performance Tests

```python
def test_performance_large_regulation():
    """Test performance with full EU AI Act (100+ requirements)."""
    # Should complete in <5 seconds

def test_performance_large_system():
    """Test performance with large system (1000+ capabilities)."""
    # Should complete in <10 seconds
```

---

## Troubleshooting

### Issue: Low coverage despite having capabilities

**Symptom:** Coverage shows 30% but system has most capabilities

**Diagnosis:**
- Check if capability names match expected terms
- Verify evidence is being found correctly
- Review mapping rules

**Solution:**
```python
# Add custom mapping rules
custom_rules = {
    "bias mitigation": ["fairness_check", "bias_detector"],  # Synonyms
    "human oversight": ["human_review", "override_button"]
}

mapper = RegulatoryRequirementMapper(
    "regulations/eu-ai-act.yaml",
    mapping_rules=custom_rules
)
```

### Issue: Too many false positives (COVERED when actually GAP)

**Symptom:** Coverage shows 100% but manual review finds gaps

**Diagnosis:**
- Evidence threshold too low
- Semantic similarity too permissive

**Solution:**
```python
# Increase evidence threshold
mapper.evidence_threshold = 0.8  # Default: 0.6

# Increase semantic similarity threshold
mapper.similarity_threshold = 0.85  # Default: 0.7
```

---

## Status

- [x] Specification complete
- [ ] Implementation started
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Code reviewed
- [ ] Merged to main

**Assignee:** @team-a-lead
**Week:** Week 1
**Deadline:** Thursday, Feb 20, 2026
