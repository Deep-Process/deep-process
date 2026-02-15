# #177 Münchhausen Audit

**Category:** epistemology
**Purpose:** Identify what serves as "axiom" (unquestioned ground truth) in any verification chain. Make it explicit. Ask: is this the RIGHT axiom? Inspired by Münchhausen's Trilemma — every justification must stop somewhere.

**Theoretical basis:** Hans Albert's Münchhausen Trilemma (1968) — every attempt to justify knowledge leads to: dogmatism (stopping at unproven axiom), infinite regress, or circular reasoning. The goal is to make the chosen stopping point EXPLICIT and JUSTIFIED.

## What to do

1. Trace the verification chain: what verifies what?
2. Find the terminus — what is taken as ground truth without further proof?
3. Evaluate if the chosen axiom is appropriate
4. Check for circular justifications

## Step-by-step

```
1. Map the verification chain:
   Start from the artifact being verified
   FOR each claim or element:
     Ask: "What verifies this?"
     Record the verifier
     Ask: "What verifies the verifier?"
     Continue until you hit:
       a) An axiom (accepted without proof)
       b) A cycle (A verifies B verifies A)
       c) External reference (spec, standard, user confirmation)

2. Identify axioms:
   Common axioms in software:
   - CODE AS TRUTH: "The code is what actually runs"
     Strength: Definitive for behavior
     Weakness: Code may have bugs; doesn't capture intent

   - TESTS AS TRUTH: "Tests define expected behavior"
     Strength: Executable specification
     Weakness: Tests can be wrong; may not cover edge cases

   - SPEC AS TRUTH: "Specification defines intent"
     Strength: Captures requirements
     Weakness: May not match reality

   - USER INTENT AS TRUTH: "What the user wants"
     Strength: Ultimate purpose
     Weakness: Often implicit, changing, contradictory

3. Evaluate axiom fitness:
   FOR each identified axiom:
     - Is it OBSERVABLE? (can be checked)
     - Is it STABLE? (doesn't change frequently)
     - Is it AUTHORITATIVE? (accepted by stakeholders)
     - Is it APPROPRIATE for this context?

4. Check for circular justification:
   IF chain contains cycle:
     Flag: "Circular justification detected: A → B → ... → A"
     Recommend: inject external anchor to break cycle
```

## Output

```
MÜNCHHAUSEN AUDIT:
  Verification chain: [A] → verified by [B] → verified by [C] → AXIOM: [X]

  Axiom identified: [name]
  Type: [code/tests/spec/user intent/other]
  Observable: [yes/no]
  Stable: [yes/no]
  Appropriate: [yes/no] — [justification]

  Circular justifications: [none / list]

  VERDICT: [axiom is appropriate / axiom should be reconsidered]
```
