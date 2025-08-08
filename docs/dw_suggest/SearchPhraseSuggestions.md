## Package: dw.suggest

# Class SearchPhraseSuggestions

## Inheritance Hierarchy

- Object
  - dw.suggest.SearchPhraseSuggestions

## Description

The search phrase suggestions contain a list of suggested search phrases (see SuggestedPhrase) as well as, for each of the search phrase terms, a list with corrected and completed alternative terms.

## Properties

### suggestedPhrases

**Type:** Iterator (Read Only)

A list of SuggestedPhrase objects that relates to the
 user input search phrase.

### suggestedTerms

**Type:** Iterator (Read Only)

A list of SuggestedTerms objects. Each of the returned
 instances represents a set of terms suggested for a particular single term
 of the user input search phrase.

## Constructor Summary

## Method Summary

### getSuggestedPhrases

**Signature:** `getSuggestedPhrases() : Iterator`

Returns a list of SuggestedPhrase objects that relates to the user input search phrase.

### getSuggestedTerms

**Signature:** `getSuggestedTerms() : Iterator`

Returns a list of SuggestedTerms objects.

### hasSuggestedPhrases

**Signature:** `hasSuggestedPhrases() : boolean`

Returns whether this suggestions container has any suggested phrases.

### hasSuggestedTerms

**Signature:** `hasSuggestedTerms() : boolean`

Returns whether this suggestions container has any suggested terms.

## Method Detail

## Method Details

### getSuggestedPhrases

**Signature:** `getSuggestedPhrases() : Iterator`

**Description:** Returns a list of SuggestedPhrase objects that relates to the user input search phrase.

**Returns:**

a list of SuggestedPhrases

**See Also:**

hasSuggestedPhrases()

---

### getSuggestedTerms

**Signature:** `getSuggestedTerms() : Iterator`

**Description:** Returns a list of SuggestedTerms objects. Each of the returned instances represents a set of terms suggested for a particular single term of the user input search phrase.

**Returns:**

a list of SuggestedTerms for each term of the user input search phrase

**See Also:**

hasSuggestedTerms()

---

### hasSuggestedPhrases

**Signature:** `hasSuggestedPhrases() : boolean`

**Description:** Returns whether this suggestions container has any suggested phrases. Note that this method only looks for suggested phrases. It does not account for suggested terms.

**Returns:**

true only if there are phrases available

---

### hasSuggestedTerms

**Signature:** `hasSuggestedTerms() : boolean`

**Description:** Returns whether this suggestions container has any suggested terms. Note that this method checks suggested terms only, but not suggested phrases.

**Returns:**

true only if there are terms available

---