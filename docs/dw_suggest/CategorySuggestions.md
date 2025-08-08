## Package: dw.suggest

# Class CategorySuggestions

## Inheritance Hierarchy

- Object
  - dw.suggest.Suggestions
  - dw.suggest.CategorySuggestions

## Description

The category suggestion container provides access to categories found using the suggested terms as search criteria. The method getSuggestedCategories() can be used to get the list of found categories. Furthermore the list of suggested terms, after processing the original user input search query, is accessible through SearchPhraseSuggestions.getSuggestedTerms() method.

## Properties

### suggestedCategories

**Type:** Iterator (Read Only)

This method returns a list of categories which were found
 using the suggested terms as search criteria.
 The category lookup is being executed in the current catalog and locale.

## Constructor Summary

## Method Summary

### getSuggestedCategories

**Signature:** `getSuggestedCategories() : Iterator`

This method returns a list of categories which were found using the suggested terms as search criteria.

## Method Detail

## Method Details

### getSuggestedCategories

**Signature:** `getSuggestedCategories() : Iterator`

**Description:** This method returns a list of categories which were found using the suggested terms as search criteria. The category lookup is being executed in the current catalog and locale.

**Returns:**

a iterator containing a SuggestedCategory instance for each found category, the iterator might be empty

**See Also:**

Suggestions.hasSuggestions()

---