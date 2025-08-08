## Package: dw.content

# Class ContentSearchModel

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchModel
  - dw.content.ContentSearchModel

## Description

The class is the central interface to a content search result and a content search refinement. It also provides utility methods to generate a search URL.

## Constants

## Properties

### content

**Type:** Iterator (Read Only)

An Iterator containing all Content Assets that are the result of the
 search.

### contentID

**Type:** String

The content ID against which the search results apply.

### deepestCommonFolder

**Type:** Folder (Read Only)

The deepest common folder of all content assets in the search result.

### filteredByFolder

**Type:** boolean

The method returns true, if the content search result is filtered by the folder and it is not subsequently
 possible to search for content assets that belong to no folder (e.g. those for Page Designer).

### folder

**Type:** Folder (Read Only)

The folder against which the search results apply.

### folderID

**Type:** String

The folder ID against which the search results apply.

### folderSearch

**Type:** boolean (Read Only)

The method returns true, if this is a pure search for a folder. The
 method checks, that a folder ID is specified and no search phrase is
 specified.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags, defined for this instance for which content can be generated.

 The meta tag content is generated based on the content listing page meta tag context and rules.
 The rules are obtained from the current folder context or inherited from the parent folder,
 up to the root folder.

### recursiveFolderSearch

**Type:** boolean

Get the flag that determines if the folder search will
 be recursive.

### refinedByFolder

**Type:** boolean (Read Only)

The method returns true, if the search is refined by a folder.
 The method checks, that a folder ID is specified.

### refinedFolderSearch

**Type:** boolean (Read Only)

Identifies if this is a folder search and is refined with further
 criteria, like a name refinement or an attribute refinement.

### refinements

**Type:** ContentSearchRefinements (Read Only)

The set of search refinements used in this search.

## Constructor Summary

ContentSearchModel() Constructs a new ContentSearchModel.

## Method Summary

### getContent

**Signature:** `getContent() : Iterator`

Returns an Iterator containing all Content Assets that are the result of the search.

### getContentID

**Signature:** `getContentID() : String`

Returns the content ID against which the search results apply.

### getDeepestCommonFolder

**Signature:** `getDeepestCommonFolder() : Folder`

Returns the deepest common folder of all content assets in the search result.

### getFolder

**Signature:** `getFolder() : Folder`

Returns the folder against which the search results apply.

### getFolderID

**Signature:** `getFolderID() : String`

Returns the folder ID against which the search results apply.

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

Returns the page meta tag for the specified id.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags, defined for this instance for which content can be generated.

### getRefinements

**Signature:** `getRefinements() : ContentSearchRefinements`

Returns the set of search refinements used in this search.

### isFilteredByFolder

**Signature:** `isFilteredByFolder() : boolean`

The method returns true, if the content search result is filtered by the folder and it is not subsequently possible to search for content assets that belong to no folder (e.g.

### isFolderSearch

**Signature:** `isFolderSearch() : boolean`

The method returns true, if this is a pure search for a folder.

### isRecursiveFolderSearch

**Signature:** `isRecursiveFolderSearch() : boolean`

Get the flag that determines if the folder search will be recursive.

### isRefinedByFolder

**Signature:** `isRefinedByFolder() : boolean`

The method returns true, if the search is refined by a folder.

### isRefinedFolderSearch

**Signature:** `isRefinedFolderSearch() : boolean`

Identifies if this is a folder search and is refined with further criteria, like a name refinement or an attribute refinement.

### search

**Signature:** `search() : SearchStatus`

Execute the search.

### setContentID

**Signature:** `setContentID(contentID : String) : void`

Sets the contentID used in this search.

### setFilteredByFolder

**Signature:** `setFilteredByFolder(filteredByFolder : boolean) : void`

Set a flag to indicate if the search is filtered by the folder.

### setFolderID

**Signature:** `setFolderID(folderID : String) : void`

Sets the folderID used in this search.

### setRecursiveFolderSearch

**Signature:** `setRecursiveFolderSearch(recurse : boolean) : void`

Set a flag to indicate if the search in folder should be recursive.

### urlForContent

**Signature:** `static urlForContent(action : String, cid : String) : URL`

Returns an URL that you can use to execute a query for a specific Content.

### urlForContent

**Signature:** `static urlForContent(url : URL, cid : String) : URL`

Returns an URL that you can use to execute a query for a specific Content.

### urlForFolder

**Signature:** `static urlForFolder(action : String, fid : String) : URL`

Returns an URL that you can use to execute a query for a specific Folder.

### urlForFolder

**Signature:** `static urlForFolder(url : URL, fid : String) : URL`

Returns an URL that you can use to execute a query for a specific Folder.

### urlForRefine

**Signature:** `static urlForRefine(action : String, name : String, value : String) : URL`

Returns an URL that you can use to execute a query for a specific attribute name-value pair.

### urlForRefine

**Signature:** `static urlForRefine(url : URL, name : String, value : String) : URL`

Returns an URL that you can use to execute a query for a specific attribute name-value pair.

### urlRefineFolder

**Signature:** `urlRefineFolder(action : String, refineFolderID : String) : URL`

Returns an URL that you can use to re-execute the query using the specified pipeline action and folder refinement.

### urlRefineFolder

**Signature:** `urlRefineFolder(url : URL, refineFolderID : String) : URL`

Returns an URL that you can use to re-execute the query using the specified URL and folder refinement.

### urlRelaxFolder

**Signature:** `urlRelaxFolder(action : String) : URL`

Returns an URL that you can use to re-execute the query with no folder refinement.

### urlRelaxFolder

**Signature:** `urlRelaxFolder(url : URL) : URL`

Returns an URL that you can use to re-execute the query with no folder refinement.

## Constructor Detail

## Method Detail

## Method Details

### getContent

**Signature:** `getContent() : Iterator`

**Description:** Returns an Iterator containing all Content Assets that are the result of the search.

**Returns:**

an Iterator containing all Content Assets that are the result of the search.

---

### getContentID

**Signature:** `getContentID() : String`

**Description:** Returns the content ID against which the search results apply.

**Returns:**

the content ID against which the search results apply.

---

### getDeepestCommonFolder

**Signature:** `getDeepestCommonFolder() : Folder`

**Description:** Returns the deepest common folder of all content assets in the search result.

**Returns:**

the deepest common folder of all content assets in the search result of this search model.

---

### getFolder

**Signature:** `getFolder() : Folder`

**Description:** Returns the folder against which the search results apply.

**Returns:**

the folder against which the search results apply.

---

### getFolderID

**Signature:** `getFolderID() : String`

**Description:** Returns the folder ID against which the search results apply.

**Returns:**

the folder ID against which the search results apply.

---

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

**Description:** Returns the page meta tag for the specified id. The meta tag content is generated based on the content listing page meta tag context and rule. The rule is obtained from the current folder context or inherited from the parent folder, up to the root folder. Null will be returned if the meta tag is undefined on the current instance, or if no rule can be found for the current context, or if the rule resolves to an empty string.

**Parameters:**

- `id`: the ID to get the page meta tag for

**Returns:**

page meta tag containing content generated based on rules

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags, defined for this instance for which content can be generated. The meta tag content is generated based on the content listing page meta tag context and rules. The rules are obtained from the current folder context or inherited from the parent folder, up to the root folder.

**Returns:**

page meta tags defined for this instance, containing content generated based on rules

---

### getRefinements

**Signature:** `getRefinements() : ContentSearchRefinements`

**Description:** Returns the set of search refinements used in this search.

**Returns:**

the set of search refinements used in this search.

---

### isFilteredByFolder

**Signature:** `isFilteredByFolder() : boolean`

**Description:** The method returns true, if the content search result is filtered by the folder and it is not subsequently possible to search for content assets that belong to no folder (e.g. those for Page Designer).

**Returns:**

True if this is filtered by the folder of the content asset.

---

### isFolderSearch

**Signature:** `isFolderSearch() : boolean`

**Description:** The method returns true, if this is a pure search for a folder. The method checks, that a folder ID is specified and no search phrase is specified.

**Returns:**

True if this is a folder search.

---

### isRecursiveFolderSearch

**Signature:** `isRecursiveFolderSearch() : boolean`

**Description:** Get the flag that determines if the folder search will be recursive.

**Returns:**

true if the folder search will be recursive, false otherwise

---

### isRefinedByFolder

**Signature:** `isRefinedByFolder() : boolean`

**Description:** The method returns true, if the search is refined by a folder. The method checks, that a folder ID is specified.

**Returns:**

true, if the search is refined by a folder, false otherwise.

---

### isRefinedFolderSearch

**Signature:** `isRefinedFolderSearch() : boolean`

**Description:** Identifies if this is a folder search and is refined with further criteria, like a name refinement or an attribute refinement.

**Returns:**

true if this is a folder search and is refined with further criteria, false otherwise.

---

### search

**Signature:** `search() : SearchStatus`

**Description:** Execute the search.

**Returns:**

the searchStatus object with search status code and description of search result.

---

### setContentID

**Signature:** `setContentID(contentID : String) : void`

**Description:** Sets the contentID used in this search.

**Parameters:**

- `contentID`: the contentID used in this search.

---

### setFilteredByFolder

**Signature:** `setFilteredByFolder(filteredByFolder : boolean) : void`

**Description:** Set a flag to indicate if the search is filtered by the folder. Must be set to false to return content assets that do not belong to any folder.

**Parameters:**

- `filteredByFolder`: filter the search result by folder

---

### setFolderID

**Signature:** `setFolderID(folderID : String) : void`

**Description:** Sets the folderID used in this search.

**Parameters:**

- `folderID`: the folderID used in this search.

---

### setRecursiveFolderSearch

**Signature:** `setRecursiveFolderSearch(recurse : boolean) : void`

**Description:** Set a flag to indicate if the search in folder should be recursive.

**Parameters:**

- `recurse`: recurse the folder in the search

---

### urlForContent

**Signature:** `static urlForContent(action : String, cid : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific Content. The passed action is used to build an initial url. All search specific attributes are appended.

**Parameters:**

- `action`: the pipeline action to use.
- `cid`: the content id.

**Returns:**

an URL that you can use to execute a query for a specific Content. The passed action is used to build an initial url. All search specific attributes are appended.

---

### urlForContent

**Signature:** `static urlForContent(url : URL, cid : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific Content. The passed url can be either a full url or just the name for a pipeline. In the later case a relative URL is created.

**Parameters:**

- `url`: the URL to use when constructing the new URL.
- `cid`: the content id.

**Returns:**

an URL that you can use to execute a query for a specific Content. The passed url can be either a full url or just the name for a pipeline. In the later case a relative URL is created.

---

### urlForFolder

**Signature:** `static urlForFolder(action : String, fid : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific Folder.

**Parameters:**

- `action`: the pipeline action to use.
- `fid`: the id of the Folder to use.

**Returns:**

an URL that you can use to execute a query for a specific Folder.

---

### urlForFolder

**Signature:** `static urlForFolder(url : URL, fid : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific Folder.

**Parameters:**

- `url`: the URL to use in constructing the new URL.
- `fid`: the id of the Folder to use.

**Returns:**

an URL that you can use to execute a query for a specific Folder.

---

### urlForRefine

**Signature:** `static urlForRefine(action : String, name : String, value : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific attribute name-value pair.

**Parameters:**

- `action`: the pipeline action to use.
- `name`: the name of the attribute.
- `value`: the value for the attribute.

**Returns:**

an URL that you can use to execute a query for a specific attribute name-value pair.

---

### urlForRefine

**Signature:** `static urlForRefine(url : URL, name : String, value : String) : URL`

**Description:** Returns an URL that you can use to execute a query for a specific attribute name-value pair.

**Parameters:**

- `url`: the URL to use when constructing the new URL.
- `name`: the name of the attribute.
- `value`: the value for the attribute.

**Returns:**

an URL that you can use to execute a query for a specific attribute name-value pair.

---

### urlRefineFolder

**Signature:** `urlRefineFolder(action : String, refineFolderID : String) : URL`

**Description:** Returns an URL that you can use to re-execute the query using the specified pipeline action and folder refinement.

**Parameters:**

- `action`: the action to use.
- `refineFolderID`: the folder ID to use as a refinement.

**Returns:**

an URL that you can use to re-execute the exact same query using the specified pipeline action and folder refinement.

---

### urlRefineFolder

**Signature:** `urlRefineFolder(url : URL, refineFolderID : String) : URL`

**Description:** Returns an URL that you can use to re-execute the query using the specified URL and folder refinement.

**Parameters:**

- `url`: the existing URL to use when constructing the new URL.
- `refineFolderID`: the ID of the folder refinement to use.

**Returns:**

an URL that you can use to re-execute the query using the specified URL and folder refinement.

---

### urlRelaxFolder

**Signature:** `urlRelaxFolder(action : String) : URL`

**Description:** Returns an URL that you can use to re-execute the query with no folder refinement.

**Parameters:**

- `action`: the pipeline action to use in the URL.

**Returns:**

an URL that you can use to re-execute the query with no folder refinement.

---

### urlRelaxFolder

**Signature:** `urlRelaxFolder(url : URL) : URL`

**Description:** Returns an URL that you can use to re-execute the query with no folder refinement.

**Parameters:**

- `url`: the existing URL to use when constructing the new URL.

**Returns:**

an URL that you can use to re-execute the query with no folder refinement.

---