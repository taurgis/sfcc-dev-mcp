## Package: dw.content

# Class ContentSearchRefinements

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchRefinements
  - dw.content.ContentSearchRefinements

## Description

This class provides an interface to refinement options for the content asset search. In a typical usage, the client application UI displays the search refinements along with the search results and allows customers to "refine" the results (i.e. limit the results that are shown) by specifying additional criteria, or "relax" (i.e. broaden) the results after previously refining. The two types of content search refinements are: Refine By Folder: Limit the content assets to those assigned to specific child/ancestor folder of the search folder. Refine By Attribute: Limit the content assets to those with specific values for a given attribute. Values may be grouped into "buckets" so that a given set of values are represented as a single refinement option. Rendering a content search refinement UI typically begins with iterating the refinement definitions for the search result. Call SearchRefinements.getRefinementDefinitions() or SearchRefinements.getAllRefinementDefinitions() to retrieve the appropriate collection of refinement definitions. For each definition, display the available refinement values by calling getAllRefinementValues(ContentSearchRefinementDefinition). Depending on the type of the refinement definition, the application must use slightly different logic to display the refinement widgets. For all 2 types, methods in ContentSearchModel are used to generate URLs to render hyperlinks in the UI. When clicked, these links trigger a call to the Search pipelet which in turn applies the appropriate filters to the native search result.

## Properties

### folderRefinementDefinition

**Type:** ContentSearchRefinementDefinition (Read Only)

The appropriate folder refinement definition based on the search
 result. The folder refinement definition returned will be the first that
 can be found traversing the folder tree upward starting at the deepest
 common folder of the search result.

### matchingFolders

**Type:** Collection (Read Only)

A collection of matching folders.

## Constructor Summary

## Method Summary

### getAllRefinementValues

**Signature:** `getAllRefinementValues(definition : ContentSearchRefinementDefinition) : Collection`

Returns a sorted collection of refinement values for the given refinement definition.

### getFolderHits

**Signature:** `getFolderHits(folder : Folder) : Number`

Returns the number of search hits for the passed folder object.

### getFolderRefinementDefinition

**Signature:** `getFolderRefinementDefinition() : ContentSearchRefinementDefinition`

Returns the appropriate folder refinement definition based on the search result.

### getMatchingFolders

**Signature:** `getMatchingFolders() : Collection`

Returns a collection of matching folders.

### getNextLevelFolderRefinementValues

**Signature:** `getNextLevelFolderRefinementValues(folder : Folder) : Collection`

Returns folder refinement values based on the current search result filtered such that only folder refinements representing children of the given folder are present.

### getRefinementValue

**Signature:** `getRefinementValue(definition : ContentSearchRefinementDefinition, value : String) : ContentSearchRefinementValue`

Returns the refinement value (incl.

### getRefinementValue

**Signature:** `getRefinementValue(name : String, value : String) : ContentSearchRefinementValue`

Returns the refinement value (incl.

### getRefinementValues

**Signature:** `getRefinementValues(definition : ContentSearchRefinementDefinition) : Collection`

Returns a collection of refinement values for the given refinement definition.

## Method Detail

## Method Details

### getAllRefinementValues

**Signature:** `getAllRefinementValues(definition : ContentSearchRefinementDefinition) : Collection`

**Description:** Returns a sorted collection of refinement values for the given refinement definition. The returned collection includes all refinement values for which the hit count is greater than 0 within the search result when the passed refinement definitions is excluded from filtering the search hits but all other refinement filters are still applied. This is useful for rendering broadening options for the refinement definitions that the search is already refined by. It is important to note that this method does NOT return refinement values independent of the search result.

**Parameters:**

- `definition`: The refinement definition to return refinement values for.

**Returns:**

The collection of ContentSearchRefinementValue instances sorted according to the settings of the definition.

---

### getFolderHits

**Signature:** `getFolderHits(folder : Folder) : Number`

**Description:** Returns the number of search hits for the passed folder object.

**Parameters:**

- `folder`: Folder object.

**Returns:**

Number of search hits.

---

### getFolderRefinementDefinition

**Signature:** `getFolderRefinementDefinition() : ContentSearchRefinementDefinition`

**Description:** Returns the appropriate folder refinement definition based on the search result. The folder refinement definition returned will be the first that can be found traversing the folder tree upward starting at the deepest common folder of the search result.

**Returns:**

The folder refinement definition or null if none can be found.

---

### getMatchingFolders

**Signature:** `getMatchingFolders() : Collection`

**Description:** Returns a collection of matching folders.

**Returns:**

Collection of matching folders.

---

### getNextLevelFolderRefinementValues

**Signature:** `getNextLevelFolderRefinementValues(folder : Folder) : Collection`

**Description:** Returns folder refinement values based on the current search result filtered such that only folder refinements representing children of the given folder are present. If no folder is given, the method uses the library's root folder. The refinement value content counts represent all hits contained in the library tree starting at the corresponding child folder.

**Parameters:**

- `folder`: The folder to return child folder refinement values for.

**Returns:**

The refinement values for all child folders of the given folder.

---

### getRefinementValue

**Signature:** `getRefinementValue(definition : ContentSearchRefinementDefinition, value : String) : ContentSearchRefinementValue`

**Description:** Returns the refinement value (incl. content hit count) for the given refinement definition and the given (selected) value.

**Parameters:**

- `definition`: The definition to return the refinement for.
- `value`: The value to return the refinement value for.

**Returns:**

The refinement value.

---

### getRefinementValue

**Signature:** `getRefinementValue(name : String, value : String) : ContentSearchRefinementValue`

**Description:** Returns the refinement value (incl. content hit count) for the given attribute refinement and the given (selected) value.

**Parameters:**

- `name`: The name of the refinement attribute.
- `value`: The value to return the refinement value for.

**Returns:**

The refinement value.

---

### getRefinementValues

**Signature:** `getRefinementValues(definition : ContentSearchRefinementDefinition) : Collection`

**Description:** Returns a collection of refinement values for the given refinement definition. The returned refinement values only include those that are part of the actual search result (i.e. hit count will always be > 0).

**Parameters:**

- `definition`: The refinement definition to return refinement values for.

**Returns:**

The collection of refinement values sorted according to the settings of the definition.

---