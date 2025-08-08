## Package: dw.suggest

# Class SuggestedTerms

## Inheritance Hierarchy

- Object
  - dw.suggest.SuggestedTerms

## Description

This container represents a list of suggested terms, all belonging to a particular single original term of the users input search phrase. Each user input term of the search phrase is being processed separately by the suggestion engine. For each original term, a list of terms will be suggested, either completed terms, corrected terms or even the exact term if they are known to the engine as they are. A instance of this class refers to the original unmodified term, as well as to a list of SuggestedTerms objects representing a single suggested term.

## Properties

### empty

**Type:** boolean (Read Only)

Returns true if this set of suggested terms is empty.

### firstTerm

**Type:** SuggestedTerm (Read Only)

This method returns the suggested term which is considered best matching
 with the original term. See getTerms() for a note on ordering of
 suggested terms.

### originalTerm

**Type:** String (Read Only)

The original term of the user input, for which this instance
 provides a list of suggested terms. Suggested terms can either be corrected,
 or completed or exact matching.

### terms

**Type:** Iterator (Read Only)

The list of SuggestedTerms suggested for the original term.

## Constructor Summary

## Method Summary

### getFirstTerm

**Signature:** `getFirstTerm() : SuggestedTerm`

This method returns the suggested term which is considered best matching with the original term.

### getOriginalTerm

**Signature:** `getOriginalTerm() : String`

Returns the original term of the user input, for which this instance provides a list of suggested terms.

### getTerms

**Signature:** `getTerms() : Iterator`

Returns the list of SuggestedTerms suggested for the original term.

### isEmpty

**Signature:** `isEmpty() : boolean`

Returns true if this set of suggested terms is empty.

## Method Detail

## Method Details

### getFirstTerm

**Signature:** `getFirstTerm() : SuggestedTerm`

**Description:** This method returns the suggested term which is considered best matching with the original term. See getTerms() for a note on ordering of suggested terms.

**Returns:**

the best matching term

**See Also:**

getOriginalTerm()
getTerms()

---

### getOriginalTerm

**Signature:** `getOriginalTerm() : String`

**Description:** Returns the original term of the user input, for which this instance provides a list of suggested terms. Suggested terms can either be corrected, or completed or exact matching.

**Returns:**

the original unmodified term of the user input search phrase

---

### getTerms

**Signature:** `getTerms() : Iterator`

**Description:** Returns the list of SuggestedTerms suggested for the original term.

**Returns:**

a iterator of suggested terms, might be empty

**See Also:**

getOriginalTerm()
isEmpty()

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Returns true if this set of suggested terms is empty.

**Returns:**

true if no suggested term is contained in this set, false otherwise

---