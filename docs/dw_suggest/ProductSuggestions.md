## Package: dw.suggest

# Class ProductSuggestions

## Inheritance Hierarchy

- Object
  - dw.suggest.Suggestions
  - dw.suggest.ProductSuggestions

## Description

The product suggestion container provides access to products found using the suggested terms. The method getSuggestedProducts() can be used to get the list of found products. Furthermore the list of suggested terms, after processing the original user input search query, is accessible through SearchPhraseSuggestions.getSuggestedTerms() method.

## Properties

### suggestedProducts

**Type:** Iterator (Read Only)

This method returns a list of products which were found
 using the suggested terms as search criteria.
 The product lookup is being executed in the current catalog and locale.

## Constructor Summary

## Method Summary

### getSuggestedProducts

**Signature:** `getSuggestedProducts() : Iterator`

This method returns a list of products which were found using the suggested terms as search criteria.

## Method Detail

## Method Details

### getSuggestedProducts

**Signature:** `getSuggestedProducts() : Iterator`

**Description:** This method returns a list of products which were found using the suggested terms as search criteria. The product lookup is being executed in the current catalog and locale.

**Returns:**

a iterator containing a SuggestedProduct instance for each found product, the iterator might be empty

**See Also:**

Suggestions.hasSuggestions()

---