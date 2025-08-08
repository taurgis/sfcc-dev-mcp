## Package: dw.catalog

# Class SearchModel

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchModel

## Description

Common search model base class.

## Constants

## Properties

### count

**Type:** Number (Read Only)

The number of search results found by this search.

### emptyQuery

**Type:** boolean (Read Only)

Identifies if the query is emtpy when no search term, search parameter or
 refinement was specified for the search. In case also no result is
 returned. This "empty" is different to a query with a specified query and
 with an empty result.

### refinedByAttribute

**Type:** boolean (Read Only)

The method returns true, if this search is refined by at least one
 attribute.

### refinedSearch

**Type:** boolean (Read Only)

Identifies if this was a refined search. A search is a refined search if
 at least one refinement is part of the query.

### searchPhrase

**Type:** String

The search phrase used in this search.

## Constructor Summary

## Method Summary

### addRefinementValues

**Signature:** `addRefinementValues(attributeID : String, values : String) : void`

Adds a refinement.

### canRelax

**Signature:** `canRelax() : boolean`

Identifies if the search can be relaxed without creating a search for all searchable items.

### getCount

**Signature:** `getCount() : Number`

Returns the number of search results found by this search.

### getRefinementMaxValue

**Signature:** `getRefinementMaxValue(attributeID : String) : String`

Returns the maximum refinement value selected in the query for the specific attribute, or null if there is no maximum refinement value or no refinement for that attribute.

### getRefinementMinValue

**Signature:** `getRefinementMinValue(attributeID : String) : String`

Returns the minimum refinement value selected in the query for the specific attribute, or null if there is no minimum refinement value or no refinement for that attribute.

### getRefinementValue

**Signature:** `getRefinementValue(attributeID : String) : String`

Returns the refinement value selected in the query for the specific attribute, or null if there is no refinement for that attribute.

### getRefinementValues

**Signature:** `getRefinementValues(attributeID : String) : Collection`

Returns the list of selected refinement values for the given attribute as used in the search.

### getSearchPhrase

**Signature:** `getSearchPhrase() : String`

Returns the search phrase used in this search.

### getSearchRedirect

**Signature:** `static getSearchRedirect(searchPhrase : String) : URLRedirect`

Returns an URLRedirect object for a search phrase.

### getSortingCondition

**Signature:** `getSortingCondition(attributeID : String) : Number`

Returns the sorting condition for a given attribute name.

### isEmptyQuery

**Signature:** `isEmptyQuery() : boolean`

Identifies if the query is emtpy when no search term, search parameter or refinement was specified for the search.

### isRefinedByAttribute

**Signature:** `isRefinedByAttribute(attributeID : String) : boolean`

Identifies if this search has been refined on the given attribute.

### isRefinedByAttribute

**Signature:** `isRefinedByAttribute() : boolean`

The method returns true, if this search is refined by at least one attribute.

### isRefinedByAttributeValue

**Signature:** `isRefinedByAttributeValue(attributeID : String, value : String) : boolean`

Identifies if this search has been refined on the given attribute and value.

### isRefinedSearch

**Signature:** `isRefinedSearch() : boolean`

Identifies if this was a refined search.

### isRefinementByValueRange

**Signature:** `isRefinementByValueRange(attributeID : String) : boolean`

Identifies if this search has been refined on the given attribute.

### isRefinementByValueRange

**Signature:** `isRefinementByValueRange(attributeID : String, minValue : String, maxValue : String) : boolean`

Identifies if this search has been refined on the given attribute and range values.

### removeRefinementValues

**Signature:** `removeRefinementValues(attributeID : String, values : String) : void`

Removes a refinement.

### search

**Signature:** `search() : SearchStatus`

Execute the search.

### setRefinementValueRange

**Signature:** `setRefinementValueRange(attributeID : String, minValue : String, maxValue : String) : void`

Sets a refinement value range for an attribute.

### setRefinementValues

**Signature:** `setRefinementValues(attributeID : String, values : String) : void`

Sets refinement values for an attribute.

### setSearchPhrase

**Signature:** `setSearchPhrase(phrase : String) : void`

Sets the search phrase used in this search.

### setSortingCondition

**Signature:** `setSortingCondition(attributeID : String, direction : Number) : void`

Sets or removes a sorting condition for the specified attribute.

### url

**Signature:** `url(action : String) : URL`

Constructs an URL that you can use to re-execute the exact same query.

### url

**Signature:** `url(url : URL) : URL`

Constructs an URL that you can use to re-execute the exact same query.

### urlDefaultSort

**Signature:** `urlDefaultSort(url : String) : URL`

Constructs an URL that you can use to re-execute the query with a default sorting.

### urlDefaultSort

**Signature:** `urlDefaultSort(url : URL) : URL`

Constructs an URL that you can use to re-execute the query with a default sorting.

### urlRefineAttribute

**Signature:** `urlRefineAttribute(action : String, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query with an additional refinement.

### urlRefineAttribute

**Signature:** `urlRefineAttribute(url : URL, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query with an additional refinement.

### urlRefineAttributeValue

**Signature:** `urlRefineAttributeValue(action : String, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query with an additional refinement value for a given refinement attribute.

### urlRefineAttributeValue

**Signature:** `urlRefineAttributeValue(url : URL, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query with an additional refinement value for a given refinement attribute.

### urlRefineAttributeValueRange

**Signature:** `urlRefineAttributeValueRange(action : String, attributeID : String, minValue : String, maxValue : String) : URL`

Constructs an URL that you can use to re-execute the query with an additional refinement value range for a given refinement attribute.

### urlRelaxAttribute

**Signature:** `urlRelaxAttribute(action : String, attributeID : String) : URL`

Constructs an URL that you can use to re-execute the query without the specified refinement.

### urlRelaxAttribute

**Signature:** `urlRelaxAttribute(url : URL, attributeID : String) : URL`

Constructs an URL that you can use to re-execute the query without the specified refinement.

### urlRelaxAttributeValue

**Signature:** `urlRelaxAttributeValue(action : String, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query without the specified refinement.

### urlRelaxAttributeValue

**Signature:** `urlRelaxAttributeValue(url : URL, attributeID : String, value : String) : URL`

Constructs an URL that you can use to re-execute the query without the specified refinement value.

### urlSort

**Signature:** `urlSort(action : String, sortBy : String, sortDir : Number) : URL`

Constructs an URL that you can use to re-execute the query with a specific sorting criteria.

### urlSort

**Signature:** `urlSort(url : URL, sortBy : String, sortDir : Number) : URL`

Constructs an URL that you can use to re-execute the query with a specific sorting criteria.

## Method Detail

## Method Details

### addRefinementValues

**Signature:** `addRefinementValues(attributeID : String, values : String) : void`

**Description:** Adds a refinement. The method can be called to add an additional query parameter specified as name-value pair. The values string may encode multiple values delimited by the pipe symbol ('|').

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement value to set

---

### canRelax

**Signature:** `canRelax() : boolean`

**Description:** Identifies if the search can be relaxed without creating a search for all searchable items.

**Returns:**

true if the search can be relaxed without creating a search for all searchable items, false otherwise.

---

### getCount

**Signature:** `getCount() : Number`

**Description:** Returns the number of search results found by this search.

**Returns:**

the number of search results found by this search.

---

### getRefinementMaxValue

**Signature:** `getRefinementMaxValue(attributeID : String) : String`

**Description:** Returns the maximum refinement value selected in the query for the specific attribute, or null if there is no maximum refinement value or no refinement for that attribute.

**Parameters:**

- `attributeID`: the attribute whose refinement value is returned.

**Returns:**

the maximum refinement value selected in the query for the specific attribute.

---

### getRefinementMinValue

**Signature:** `getRefinementMinValue(attributeID : String) : String`

**Description:** Returns the minimum refinement value selected in the query for the specific attribute, or null if there is no minimum refinement value or no refinement for that attribute.

**Parameters:**

- `attributeID`: the attribute whose refinement value is returned.

**Returns:**

the minimum refinement value selected in the query for the specific attribute.

---

### getRefinementValue

**Signature:** `getRefinementValue(attributeID : String) : String`

**Description:** Returns the refinement value selected in the query for the specific attribute, or null if there is no refinement for that attribute.

**Deprecated:**

Use getRefinementValues(String) to get the collection of refinement values.

**Parameters:**

- `attributeID`: the attribute whose refinement value is returned.

**Returns:**

the refinement value selected in the query for the specific attribute.

---

### getRefinementValues

**Signature:** `getRefinementValues(attributeID : String) : Collection`

**Description:** Returns the list of selected refinement values for the given attribute as used in the search.

**Parameters:**

- `attributeID`: The name of the refinement attribute.

**Returns:**

A list of values currently selected for the refinement attribute.

---

### getSearchPhrase

**Signature:** `getSearchPhrase() : String`

**Description:** Returns the search phrase used in this search.

**Returns:**

the search phrase used in this search.

---

### getSearchRedirect

**Signature:** `static getSearchRedirect(searchPhrase : String) : URLRedirect`

**Description:** Returns an URLRedirect object for a search phrase.

**Parameters:**

- `searchPhrase`: a search phrase to lookup a URLRedirect for

**Returns:**

URLRedirect containing the location and status code, null in case no redirect was found for the search phrase.

---

### getSortingCondition

**Signature:** `getSortingCondition(attributeID : String) : Number`

**Description:** Returns the sorting condition for a given attribute name. A value of 0 indicates that no sorting condition is set.

**Parameters:**

- `attributeID`: the attribute name

**Returns:**

zero if no sorting order set, or the sorting order

---

### isEmptyQuery

**Signature:** `isEmptyQuery() : boolean`

**Description:** Identifies if the query is emtpy when no search term, search parameter or refinement was specified for the search. In case also no result is returned. This "empty" is different to a query with a specified query and with an empty result.

**Returns:**

true if the query is emtpy when no search term, search parameter or refinement was specified for the search.

---

### isRefinedByAttribute

**Signature:** `isRefinedByAttribute(attributeID : String) : boolean`

**Description:** Identifies if this search has been refined on the given attribute.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.

**Returns:**

True if the search is refined on the attribute, false otherwise.

---

### isRefinedByAttribute

**Signature:** `isRefinedByAttribute() : boolean`

**Description:** The method returns true, if this search is refined by at least one attribute.

**Returns:**

true, if the search is refined by at least one attribute, false otherwise.

---

### isRefinedByAttributeValue

**Signature:** `isRefinedByAttributeValue(attributeID : String, value : String) : boolean`

**Description:** Identifies if this search has been refined on the given attribute and value.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `value`: The value to be checked for inclusion in the refinement.

**Returns:**

True if the search is refined on the attribute and value, false otherwise.

---

### isRefinedSearch

**Signature:** `isRefinedSearch() : boolean`

**Description:** Identifies if this was a refined search. A search is a refined search if at least one refinement is part of the query.

**Returns:**

true if this is a refined search, false otherwise.

---

### isRefinementByValueRange

**Signature:** `isRefinementByValueRange(attributeID : String) : boolean`

**Description:** Identifies if this search has been refined on the given attribute.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.

**Returns:**

True if the search is refined on the attribute, false otherwise.

---

### isRefinementByValueRange

**Signature:** `isRefinementByValueRange(attributeID : String, minValue : String, maxValue : String) : boolean`

**Description:** Identifies if this search has been refined on the given attribute and range values.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `minValue`: The minimum value to be checked for inclusion in the refinement.
- `maxValue`: The maximum value to be checked for inclusion in the refinement.

**Returns:**

True if the search is refined on the attribute and range values, false otherwise.

---

### removeRefinementValues

**Signature:** `removeRefinementValues(attributeID : String, values : String) : void`

**Description:** Removes a refinement. The method can be called to remove previously added refinement values. The values string may encode multiple values delimited by the pipe symbol ('|').

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement value to remove or null to remove all values

---

### search

**Signature:** `search() : SearchStatus`

**Description:** Execute the search.

**Returns:**

the searchStatus object with search status code and description of search result.

---

### setRefinementValueRange

**Signature:** `setRefinementValueRange(attributeID : String, minValue : String, maxValue : String) : void`

**Description:** Sets a refinement value range for an attribute. The method can be called to set an additional range query parameter specified as name-range-value pair. The values string can contain only a range boundary. Existing refinement values for the attribute will be removed.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `minValue`: the minimum refinement boundary value to set or null to remove the minimum boundary
- `maxValue`: the maximum refinement boundary value to set or null to remove the maximum boundary

---

### setRefinementValues

**Signature:** `setRefinementValues(attributeID : String, values : String) : void`

**Description:** Sets refinement values for an attribute. The method can be called to set an additional query parameter specified as name-value pair. The value string may encode multiple values delimited by the pipe symbol ('|'). Existing refinement values for the attribute will be removed.

**Parameters:**

- `attributeID`: The ID of the refinement attribute.
- `values`: the refinement values to set (delimited by '|') or null to remove all values

---

### setSearchPhrase

**Signature:** `setSearchPhrase(phrase : String) : void`

**Description:** Sets the search phrase used in this search. The search query parser uses the following operators: PHRASE operator (""), e.g. "cream cheese", "John Lennon" NOT operator (-), e.g. -cargo (will not return results containing "cargo") WILDCARD operator (*), e.g. sho* (will return results containing "shoulder", "shoes" and "shoot")

**Parameters:**

- `phrase`: the search phrase used in this search.

---

### setSortingCondition

**Signature:** `setSortingCondition(attributeID : String, direction : Number) : void`

**Description:** Sets or removes a sorting condition for the specified attribute. Specify either SORT_DIRECTION_ASCENDING or SORT_DIRECTION_DESCENDING to set a sorting condition. Specify SORT_DIRECTION_NONE to remove a sorting condition from the attribute.

**Parameters:**

- `attributeID`: the attribute ID
- `direction`: SORT_DIRECTION_ASCENDING, SORT_DIRECTION_DESCENDING or SORT_DIRECTION_NONE

---

### url

**Signature:** `url(action : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the exact same query. The provided parameter must be an action, e.g. 'Search-Show'.

**Parameters:**

- `action`: the pipeline action.

**Returns:**

an URL that can be used to re-execute the exact same query.

---

### url

**Signature:** `url(url : URL) : URL`

**Description:** Constructs an URL that you can use to re-execute the exact same query. The search specific parameter are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the url to use.

**Returns:**

a new url URL that can be used to re-execute the exact same query.

---

### urlDefaultSort

**Signature:** `urlDefaultSort(url : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with a default sorting. The provided parameter must be an action, e.g. 'Search-Show'.

**Parameters:**

- `url`: url or pipeline name

**Returns:**

the new URL.

---

### urlDefaultSort

**Signature:** `urlDefaultSort(url : URL) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with a default sorting. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: url or pipeline name

**Returns:**

the new URL.

---

### urlRefineAttribute

**Signature:** `urlRefineAttribute(action : String, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with an additional refinement.

**Parameters:**

- `action`: the pipeline action.
- `attributeID`: the ID of the refinement attribute.
- `value`: the value for the refinement attribute.

**Returns:**

the new URL.

---

### urlRefineAttribute

**Signature:** `urlRefineAttribute(url : URL, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with an additional refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: url
- `attributeID`: the ID of the refinement attribute
- `value`: value for the refinement attribute

**Returns:**

the new URL.

---

### urlRefineAttributeValue

**Signature:** `urlRefineAttributeValue(action : String, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with an additional refinement value for a given refinement attribute. The provided value will be added to the set of allowed values for the refinement attribute. This basically broadens the search result.

**Parameters:**

- `action`: the pipeline action.
- `attributeID`: the ID of the refinement attribute.
- `value`: the additional value for the refinement attribute.

**Returns:**

the new URL.

---

### urlRefineAttributeValue

**Signature:** `urlRefineAttributeValue(url : URL, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with an additional refinement value for a given refinement attribute. The provided value will be added to the set of allowed values for the refinement attribute. This basically broadens the search result. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: url
- `attributeID`: ID of the refinement attribute
- `value`: the additional value for the refinement attribute

**Returns:**

the new URL.

---

### urlRefineAttributeValueRange

**Signature:** `urlRefineAttributeValueRange(action : String, attributeID : String, minValue : String, maxValue : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with an additional refinement value range for a given refinement attribute. The provided value range will be replace to the existing value range for the refinement attribute. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `action`: the pipeline action.
- `attributeID`: ID of the refinement attribute
- `minValue`: the min value for the refinement attribute
- `maxValue`: the max value for the refinement attribute

**Returns:**

the new URL.

---

### urlRelaxAttribute

**Signature:** `urlRelaxAttribute(action : String, attributeID : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query without the specified refinement. The value for the action parameter must be a pipeline action, e.g. 'Search-Show'.

**Parameters:**

- `action`: the pipeline action.
- `attributeID`: ID of the refinement attribute to be removed

**Returns:**

the new URL.

---

### urlRelaxAttribute

**Signature:** `urlRelaxAttribute(url : URL, attributeID : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query without the specified refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the url to use.
- `attributeID`: the ID of the refinement attribute to be removed.

**Returns:**

the new URL.

---

### urlRelaxAttributeValue

**Signature:** `urlRelaxAttributeValue(action : String, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query without the specified refinement. The value for the action parameter must be a pipeline action, e.g. 'Search-Show'.

**Parameters:**

- `action`: the pipeline action.
- `attributeID`: ID of the refinement attribute to be removed
- `value`: the value that should be removed from the list of refinement values.

**Returns:**

the new URL.

---

### urlRelaxAttributeValue

**Signature:** `urlRelaxAttributeValue(url : URL, attributeID : String, value : String) : URL`

**Description:** Constructs an URL that you can use to re-execute the query without the specified refinement value. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the url to use.
- `attributeID`: the ID of the refinement attribute to relax the value for.
- `value`: the value that should be removed from the list of refinement values.

**Returns:**

the new URL.

---

### urlSort

**Signature:** `urlSort(action : String, sortBy : String, sortDir : Number) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with a specific sorting criteria. This criteria will overwrite all previous sort critiria. The provided parameter must be an action, e.g. 'Search-Show'.

**Parameters:**

- `action`: Pipeline action
- `sortBy`: ID of the sort attribute
- `sortDir`: Sort direction. 1 - ASCENDING (default), 2 - DESCENDING

**Returns:**

The new URL.

---

### urlSort

**Signature:** `urlSort(url : URL, sortBy : String, sortDir : Number) : URL`

**Description:** Constructs an URL that you can use to re-execute the query with a specific sorting criteria. This criteria will overwrite all previous sort critiria. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: URL
- `sortBy`: ID of the sort attribute
- `sortDir`: Sort direction. 1 - ASCENDING (default), 2 - DESCENDING

**Returns:**

The new URL.

---