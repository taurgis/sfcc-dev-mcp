## Package: dw.suggest

# Class SuggestedTerm

## Inheritance Hierarchy

- Object
  - dw.suggest.SuggestedTerm

## Description

A single suggested term. Each user input term of the search phrase is being processed separately by the suggestion engine. For each original term, a list of terms will be suggested, either completed terms, corrected terms or even the exact term if it is known to the engine. Each suggested term is represented by a instance of this class. The list of suggested terms belonging to a single original term is represented by a instance of SuggestedTerms class. The suggested term value can either be the completed version of the original term, the corrected version of the original term or exactly the original term.

## Properties

### additional

**Type:** boolean (Read Only)

Returns whether this suggested term is a additional term that has no corresponding term in the original search phrase.

### completed

**Type:** boolean (Read Only)

Returns whether this suggested term is a auto completed version of the original term.
 In other words, this method returns true if the original term is a prefix of this suggested term.

### corrected

**Type:** boolean (Read Only)

Returns whether this suggested term is a corrected version of the original term.

### exactMatch

**Type:** boolean (Read Only)

Returns whether this suggested term is exactly matching the original term.

### value

**Type:** String (Read Only)

Returns this suggested term as String value.

## Constructor Summary

## Method Summary

### getValue

**Signature:** `getValue() : String`

Returns this suggested term as String value.

### isAdditional

**Signature:** `isAdditional() : boolean`

Returns whether this suggested term is a additional term that has no corresponding term in the original search phrase.

### isCompleted

**Signature:** `isCompleted() : boolean`

Returns whether this suggested term is a auto completed version of the original term.

### isCorrected

**Signature:** `isCorrected() : boolean`

Returns whether this suggested term is a corrected version of the original term.

### isExactMatch

**Signature:** `isExactMatch() : boolean`

Returns whether this suggested term is exactly matching the original term.

## Method Detail

## Method Details

### getValue

**Signature:** `getValue() : String`

**Description:** Returns this suggested term as String value.

**Returns:**

the string representation of this suggested term

---

### isAdditional

**Signature:** `isAdditional() : boolean`

**Description:** Returns whether this suggested term is a additional term that has no corresponding term in the original search phrase.

**Returns:**

true if this suggested term is a additional term, false otherwise

---

### isCompleted

**Signature:** `isCompleted() : boolean`

**Description:** Returns whether this suggested term is a auto completed version of the original term. In other words, this method returns true if the original term is a prefix of this suggested term.

**Returns:**

true if this suggested term is evaluated by auto completion, false otherwise

---

### isCorrected

**Signature:** `isCorrected() : boolean`

**Description:** Returns whether this suggested term is a corrected version of the original term.

**Returns:**

true if this suggested term is a corrected version of the original term, false otherwise

---

### isExactMatch

**Signature:** `isExactMatch() : boolean`

**Description:** Returns whether this suggested term is exactly matching the original term.

**Returns:**

true if this suggested term exactly matches the original term, false otherwise

---