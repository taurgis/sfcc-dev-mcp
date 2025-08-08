## Package: dw.suggest

# Class SuggestModel

## Inheritance Hierarchy

- Object
  - dw.suggest.SuggestModel

## Description

The Suggest model provides methods and functions to access search suggestions. The search suggestion feature basically covers two functional areas. First is just to suggest words, based on the users input, utilizing spell correction or prediction (also known as auto completion). The second functional area is also often referred to as search-as-you-type, where, based on the users input, specific items are already looked up, before the user actually has completed typing a word or even fired up the search. This model combines both functional areas and provides access to both - the suggested words and the items found while using the predicted words. This model supports various types of items that are being suggested, like products, categories, brands, content pages as well merchant provided search phrases. For each type, there is a Suggestions implementation available and accessible through this model: ProductSuggestions, CategorySuggestions, BrandSuggestions, ContentSuggestions, and CustomSuggestions. For each type of suggestions, the actual suggested items (like products) can by obtained, and, on the other hand, a list of terms is provided which were used to lookup the found items. The terms can be used to present a advanced user experience in the storefront, e.g. show auto completed words, spell corrections and so on. The SuggestModel script API will always create suggestions with Autocorrections regardless of the value of "Search Autocorrections" search preference.

## Constants

## Properties

### brandSuggestions

**Type:** BrandSuggestions (Read Only)

A BrandSuggestions container for the current search phrase.
 The BrandSuggestions container provides access to the found brands (if any) and
 the terms suggested by the system with respect to the known product brands in the catalog.

### categorySuggestions

**Type:** CategorySuggestions (Read Only)

A CategorySuggestions container for the current search phrase.
 The CategorySuggestions container provides access to the found categories (if any) and
 the terms suggested by the system with respect to the known categories in the catalog.

### contentSuggestions

**Type:** ContentSuggestions (Read Only)

A ContentSuggestions container for the current search phrase.
 The ContentSuggestions container provides access to the found content pages (if any) and
 the terms suggested by the system with respect to the known content in the library.

### customSuggestions

**Type:** CustomSuggestions (Read Only)

A CustomSuggestions container for the current search phrase.
 The CustomSuggestions container provides access to matching
 custom phrases (if any) and the terms suggested
 by the system with respect to the merchant provided custom phrases.

### filteredByFolder

**Type:** boolean

The method returns true, if the search suggestions are filtered by the folder. If this returns true it is not
 possible for search suggestions to contain Page Designer content as it belongs to no folder.

### popularSearchPhrases

**Type:** Iterator (Read Only)

Use this method to obtain a list of search phrases
 that currently are very popular among all users across the Site.

 The search phrases are specific to the region (based on user's IP address),
 language (locale) and the user's browser type (agent).

### productSuggestions

**Type:** ProductSuggestions (Read Only)

A ProductSuggestions container for the current search phrase.
 The ProductSuggestions container provides access to the found products (if any) and
 the terms suggested by the system with respect to the known products in the catalog.

### recentSearchPhrases

**Type:** Iterator (Read Only)

Use this method to obtain a list of personalized search phrases
 that the current user entered recently.

 The user is being identified by the CQuotient tracking cookie.

## Constructor Summary

SuggestModel() Constructs a new SuggestModel.

## Method Summary

### addRefinementValues

**Signature:** `addRefinementValues(attributeID : String, values : String) : void`

Adds a refinement for product suggestions.

### getBrandSuggestions

**Signature:** `getBrandSuggestions() : BrandSuggestions`

Returns a BrandSuggestions container for the current search phrase.

### getCategorySuggestions

**Signature:** `getCategorySuggestions() : CategorySuggestions`

Returns a CategorySuggestions container for the current search phrase.

### getContentSuggestions

**Signature:** `getContentSuggestions() : ContentSuggestions`

Returns a ContentSuggestions container for the current search phrase.

### getCustomSuggestions

**Signature:** `getCustomSuggestions() : CustomSuggestions`

Returns a CustomSuggestions container for the current search phrase.

### getPopularSearchPhrases

**Signature:** `getPopularSearchPhrases() : Iterator`

Use this method to obtain a list of search phrases that currently are very popular among all users across the Site.

### getProductSuggestions

**Signature:** `getProductSuggestions() : ProductSuggestions`

Returns a ProductSuggestions container for the current search phrase.

### getRecentSearchPhrases

**Signature:** `getRecentSearchPhrases() : Iterator`

Use this method to obtain a list of personalized search phrases that the current user entered recently.

### isFilteredByFolder

**Signature:** `isFilteredByFolder() : boolean`

The method returns true, if the search suggestions are filtered by the folder.

### removeRefinementValues

**Signature:** `removeRefinementValues(attributeID : String, values : String) : void`

Removes a refinement.

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

Apply a category ID to filter product, brand and category suggestions.

### setFilteredByFolder

**Signature:** `setFilteredByFolder(filteredByFolder : boolean) : void`

Set a flag to indicate if the search suggestions filter for elements that do not belong to a folder.

### setMaxSuggestions

**Signature:** `setMaxSuggestions(maxSuggestions : Number) : void`

Use this method to setup the maximum number of returned suggested items.

### setRefinementValues

**Signature:** `setRefinementValues(attributeID : String, values : String) : void`

Sets product suggestion refinement values for an attribute.

### setSearchPhrase

**Signature:** `setSearchPhrase(searchPhrase : String) : void`

Sets the user input search phrase.

## Constructor Detail

## Method Detail

## Method Details

### addRefinementValues

**Signature:** `addRefinementValues(attributeID : String, values : String) : void`

**Description:** Adds a refinement for product suggestions. The method can be called to add an additional query parameter specified as name-value pair. The values string may encode multiple values delimited by the pipe symbol ('|').

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement value to set

---

### getBrandSuggestions

**Signature:** `getBrandSuggestions() : BrandSuggestions`

**Description:** Returns a BrandSuggestions container for the current search phrase. The BrandSuggestions container provides access to the found brands (if any) and the terms suggested by the system with respect to the known product brands in the catalog.

**Returns:**

a brand suggestions container for the current search phrase, returns null for insufficient search input

**See Also:**

setMaxSuggestions(Number)
setSearchPhrase(String)

---

### getCategorySuggestions

**Signature:** `getCategorySuggestions() : CategorySuggestions`

**Description:** Returns a CategorySuggestions container for the current search phrase. The CategorySuggestions container provides access to the found categories (if any) and the terms suggested by the system with respect to the known categories in the catalog.

**Returns:**

a category suggestions container for the current search phrase, returns null for insufficient search input

**See Also:**

setMaxSuggestions(Number)
setSearchPhrase(String)

---

### getContentSuggestions

**Signature:** `getContentSuggestions() : ContentSuggestions`

**Description:** Returns a ContentSuggestions container for the current search phrase. The ContentSuggestions container provides access to the found content pages (if any) and the terms suggested by the system with respect to the known content in the library.

**Returns:**

a content suggestions container for the current search phrase, returns null for insufficient search input

**See Also:**

setMaxSuggestions(Number)
setSearchPhrase(String)

---

### getCustomSuggestions

**Signature:** `getCustomSuggestions() : CustomSuggestions`

**Description:** Returns a CustomSuggestions container for the current search phrase. The CustomSuggestions container provides access to matching custom phrases (if any) and the terms suggested by the system with respect to the merchant provided custom phrases.

**Returns:**

a custom suggestions container for the current search phrase, returns null for insufficient search input

**See Also:**

setMaxSuggestions(Number)
setSearchPhrase(String)

---

### getPopularSearchPhrases

**Signature:** `getPopularSearchPhrases() : Iterator`

**Description:** Use this method to obtain a list of search phrases that currently are very popular among all users across the Site. The search phrases are specific to the region (based on user's IP address), language (locale) and the user's browser type (agent).

**Returns:**

a list of personalized popular search phrases

---

### getProductSuggestions

**Signature:** `getProductSuggestions() : ProductSuggestions`

**Description:** Returns a ProductSuggestions container for the current search phrase. The ProductSuggestions container provides access to the found products (if any) and the terms suggested by the system with respect to the known products in the catalog.

**Returns:**

a product suggestions container for the current search phrase, returns null for insufficient search input

**See Also:**

setMaxSuggestions(Number)
setSearchPhrase(String)

---

### getRecentSearchPhrases

**Signature:** `getRecentSearchPhrases() : Iterator`

**Description:** Use this method to obtain a list of personalized search phrases that the current user entered recently. The user is being identified by the CQuotient tracking cookie.

**Returns:**

a list of recent search phrases of the current user

---

### isFilteredByFolder

**Signature:** `isFilteredByFolder() : boolean`

**Description:** The method returns true, if the search suggestions are filtered by the folder. If this returns true it is not possible for search suggestions to contain Page Designer content as it belongs to no folder.

**Returns:**

True if search suggestions are filtered by the folder of the content asset.

---

### removeRefinementValues

**Signature:** `removeRefinementValues(attributeID : String, values : String) : void`

**Description:** Removes a refinement. The method can be called to remove previously added refinement values. The values string may encode multiple values delimited by the pipe symbol ('|').

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement value to remove or null to remove all values

---

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

**Description:** Apply a category ID to filter product, brand and category suggestions. Suggested products, brands and categories, as well as corrected and completed terms are specific to the given category or one of it's sub categories. For example, in the specified category "television", the search term "pla" will be auto completed to "plasma" (instead of e.g. "player") and only televisions will be included in the list of suggested products.

**Parameters:**

- `categoryID`: the category to filter suggestions for

---

### setFilteredByFolder

**Signature:** `setFilteredByFolder(filteredByFolder : boolean) : void`

**Description:** Set a flag to indicate if the search suggestions filter for elements that do not belong to a folder. Must be set to false to return content assets that do not belong to any folder.

**Parameters:**

- `filteredByFolder`: filter the search suggestions by folder

---

### setMaxSuggestions

**Signature:** `setMaxSuggestions(maxSuggestions : Number) : void`

**Description:** Use this method to setup the maximum number of returned suggested items. For example, set this to 3 in order to only retrieve the 3 most relevant suggested products. The maximum number of suggestions that can be queried are defined as MAX_SUGGESTIONS.

**Parameters:**

- `maxSuggestions`: the number of suggested items to be returned by this model instance

---

### setRefinementValues

**Signature:** `setRefinementValues(attributeID : String, values : String) : void`

**Description:** Sets product suggestion refinement values for an attribute. The method can be called to set an additional query parameter specified as name-value pair. The value string may encode multiple values delimited by the pipe symbol ('|'). Existing refinement values for the attribute will be removed.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement values to set (delimited by '|') or null to remove all values

---

### setSearchPhrase

**Signature:** `setSearchPhrase(searchPhrase : String) : void`

**Description:** Sets the user input search phrase. This search phrase is being processed by applying auto completion, spell correction and enhancement with alternative similar search terms. The resulting search phrase is used to lookup the actual items, like products or categories (search-as-you-type). In order to access the processed terms, one can use the SearchPhraseSuggestions.getSuggestedTerms() method of each of the respective results returned by the methods in this model.

**Parameters:**

- `searchPhrase`: the user input search phrase

**See Also:**

SearchPhraseSuggestions.getSuggestedTerms()

---