## Package: dw.suggest

# Class ContentSuggestions

## Inheritance Hierarchy

- Object
  - dw.suggest.Suggestions
  - dw.suggest.ContentSuggestions

## Description

The content suggestion container provides access to content pages found using the suggested terms as search criteria. The method getSuggestedContent() can be used to get the list of found content pages. Furthermore the list of suggested terms, after processing the original user input search query, is accessible through SearchPhraseSuggestions.getSuggestedTerms() method.

## Properties

### suggestedContent

**Type:** Iterator (Read Only)

This method returns a list of content pages which were found
 using the suggested terms as search criteria.
 The content lookup is being executed in the current library and locale.

## Constructor Summary

## Method Summary

### getSuggestedContent

**Signature:** `getSuggestedContent() : Iterator`

This method returns a list of content pages which were found using the suggested terms as search criteria.

## Method Detail

## Method Details

### getSuggestedContent

**Signature:** `getSuggestedContent() : Iterator`

**Description:** This method returns a list of content pages which were found using the suggested terms as search criteria. The content lookup is being executed in the current library and locale.

**Returns:**

a iterator containing a SuggestedContent instance for each found content, the iterator might be empty

**See Also:**

Suggestions.hasSuggestions()

---