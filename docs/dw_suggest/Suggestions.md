## Package: dw.suggest

# Class Suggestions

## Inheritance Hierarchy

- Object
  - dw.suggest.Suggestions

## Description

This is the base class for suggestions containers. For each type of items, a sub class provides methods to access the actual items. See the sub classes for more specific information.

## Properties

### searchPhraseSuggestions

**Type:** SearchPhraseSuggestions (Read Only)

The suggested search phrases that are associated to this suggestions.
 
 In contrast to the suggested items, the suggested phrases contains the corrected and
 completed versions of the original search phrase.

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

### getSearchPhraseSuggestions

**Signature:** `getSearchPhraseSuggestions() : SearchPhraseSuggestions`

Returns the suggested search phrases that are associated to this suggestions.

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

### hasSuggestions

**Signature:** `hasSuggestions() : boolean`

Returns whether this suggestions container has any suggested items, i.e.

## Method Detail

## Method Details

### getSearchPhraseSuggestions

**Signature:** `getSearchPhraseSuggestions() : SearchPhraseSuggestions`

**Description:** Returns the suggested search phrases that are associated to this suggestions. In contrast to the suggested items, the suggested phrases contains the corrected and completed versions of the original search phrase.

**Returns:**

the suggested search phrases for this suggestions

---

### getSuggestedPhrases

**Signature:** `getSuggestedPhrases() : Iterator`

**Description:** Returns a list of SuggestedPhrase objects that relates to the user input search phrase.

**Deprecated:**

Please use method getSearchPhraseSuggestions() to obtain the suggested search phrases.

**Returns:**

a list of SuggestedPhrases

**See Also:**

hasSuggestedPhrases()

---

### getSuggestedTerms

**Signature:** `getSuggestedTerms() : Iterator`

**Description:** Returns a list of SuggestedTerms objects. Each of the returned instances represents a set of terms suggested for a particular single term of the user input search phrase.

**Deprecated:**

Please use method getSearchPhraseSuggestions() to obtain the suggested search phrases.

**Returns:**

a list of SuggestedTerms for each term of the user input search phrase

---

### hasSuggestedPhrases

**Signature:** `hasSuggestedPhrases() : boolean`

**Description:** Returns whether this suggestions container has any suggested phrases. Note that this method only looks for suggested phrases. It does not account for suggested terms or suggested objects. In other words, even if there are suggested terms or objects, this method will return false if this suggestions container has no phrases.

**Deprecated:**

Please use method getSearchPhraseSuggestions() to obtain the suggested search phrases.

**Returns:**

true only if there are phrases available

---

### hasSuggestedTerms

**Signature:** `hasSuggestedTerms() : boolean`

**Description:** Returns whether this suggestions container has any suggested terms. Note that this method checks suggested terms only, but not suggested phrases or suggested objects.

**Deprecated:**

Please use method getSearchPhraseSuggestions() to obtain the suggested search phrases.

**Returns:**

true only if there are terms available

---

### hasSuggestions

**Signature:** `hasSuggestions() : boolean`

**Description:** Returns whether this suggestions container has any suggested items, i.e. products. Note that this method only looks for concrete suggested items. It does not account for suggested terms. In other words, even if there are suggested terms, this method will return false if no matching items, like products or categories, were found for the suggested terms. To find out whether there are suggested terms and how they match with respect to the original search phrase, one can use getSuggestedTerms() to obtain a list of SuggestedTerms.

**Returns:**

true only if there are items found using the suggested terms

**See Also:**

getSuggestedTerms()
SuggestedTerms.isEmpty()

---