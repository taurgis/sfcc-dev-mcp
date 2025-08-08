## Package: dw.catalog

# Class SearchRefinements

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchRefinements

## Description

Common search refinements base class.

## Constants

## Properties

### allRefinementDefinitions

**Type:** Collection (Read Only)

A sorted list of refinement definitions that are appropriate for
 the deepest common category (or deepest common folder) of the search
 result. The method concatenates the sorted refinement definitions per
 category starting at the root category until reaching the deepest common
 category.

 The method does not filter out refinement definitions that do
 not provide values for the current search result and can therefore also
 be used on empty search results.

### refinementDefinitions

**Type:** Collection (Read Only)

A sorted list of refinement definitions that are appropriate for
 the deepest common category (or deepest common folder) of the search
 result. The method concatenates the sorted refinement definitions per category
 starting at the root category until reaching the deepest common category.

 The method also filters out refinement definitions that do not provide
 any values for the current search result.

## Constructor Summary

## Method Summary

### getAllRefinementDefinitions

**Signature:** `getAllRefinementDefinitions() : Collection`

Returns a sorted list of refinement definitions that are appropriate for the deepest common category (or deepest common folder) of the search result.

### getAllRefinementValues

**Signature:** `getAllRefinementValues(attributeName : String) : Collection`

Returns a sorted collection of refinement values for the given refinement attribute.

### getAllRefinementValues

**Signature:** `getAllRefinementValues(attributeName : String, sortMode : Number, sortDirection : Number) : Collection`

Returns a sorted collection of refinement values for the given refinement attribute.

### getRefinementDefinitions

**Signature:** `getRefinementDefinitions() : Collection`

Returns a sorted list of refinement definitions that are appropriate for the deepest common category (or deepest common folder) of the search result.

### getRefinementValues

**Signature:** `getRefinementValues(attributeName : String, sortMode : Number, sortDirection : Number) : Collection`

Returns a collection of refinement values for the given refinement attribute, sorting mode and sorting direction.

## Method Detail

## Method Details

### getAllRefinementDefinitions

**Signature:** `getAllRefinementDefinitions() : Collection`

**Description:** Returns a sorted list of refinement definitions that are appropriate for the deepest common category (or deepest common folder) of the search result. The method concatenates the sorted refinement definitions per category starting at the root category until reaching the deepest common category. The method does not filter out refinement definitions that do not provide values for the current search result and can therefore also be used on empty search results.

**Returns:**

A sorted list of refinement definitions appropriate for the search result (based on its deepest common category)

---

### getAllRefinementValues

**Signature:** `getAllRefinementValues(attributeName : String) : Collection`

**Description:** Returns a sorted collection of refinement values for the given refinement attribute. The returned collection includes all refinement values for which the hit count is greater than 0 within the search result when the passed attribute is excluded from filtering the search hits but all other refinement filters are still applied. This method is useful for rendering broadening options for attributes that the search is currently refined by. This method does NOT return refinement values independent of the search result. For product search refinements, this method may return slightly different results based on the "value set" property of the refinement definition. See ProductSearchRefinements.getAllRefinementValues(ProductSearchRefinementDefinition) for details.

**Parameters:**

- `attributeName`: The name of the attribute to return refinement values for.

**Returns:**

The collection of SearchRefinementValue instances, sorted according to the settings of the refinement definition, or null if there is no refinement definition for the passed attribute name.

---

### getAllRefinementValues

**Signature:** `getAllRefinementValues(attributeName : String, sortMode : Number, sortDirection : Number) : Collection`

**Description:** Returns a sorted collection of refinement values for the given refinement attribute. In general, the returned collection includes all refinement values for which hit count is greater than 0 within the search result assuming that: The passed refinement attribute is NOT used to filter the search hits. All other refinements are still applied. This is useful for rendering broadening options for the refinement definitions that the search is already refined by. It is important to note that this method does NOT return refinement values independent of the search result. For product search refinements, this method may return slightly different results based on the "value set" of the refinement definition. See ProductSearchRefinements.getAllRefinementValues(ProductSearchRefinementDefinition) for details.

**Parameters:**

- `attributeName`: The name of the attribute to return refinement values for.
- `sortMode`: The sort mode to use to control how the collection is sorted.
- `sortDirection`: The sort direction to use.

**Returns:**

The collection of SearchRefinementValue instances, sorted according to the passed parameters.

---

### getRefinementDefinitions

**Signature:** `getRefinementDefinitions() : Collection`

**Description:** Returns a sorted list of refinement definitions that are appropriate for the deepest common category (or deepest common folder) of the search result. The method concatenates the sorted refinement definitions per category starting at the root category until reaching the deepest common category. The method also filters out refinement definitions that do not provide any values for the current search result.

**Returns:**

A sorted list of refinement definitions appropriate for the search result (based on its deepest common category)

---

### getRefinementValues

**Signature:** `getRefinementValues(attributeName : String, sortMode : Number, sortDirection : Number) : Collection`

**Description:** Returns a collection of refinement values for the given refinement attribute, sorting mode and sorting direction.

**Parameters:**

- `attributeName`: The attribute name to use when collection refinement values.
- `sortMode`: The sort mode to use to control how the collection is sorted.
- `sortDirection`: The sort direction to use.

**Returns:**

The collection of refinement values.

---