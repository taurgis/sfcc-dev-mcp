## Package: dw.catalog

# Class StoreInventoryFilter

## Inheritance Hierarchy

- Object
  - dw.catalog.StoreInventoryFilter

## Description

This class represents a store inventory filter, which can be used at ProductSearchModel.setStoreInventoryFilter(StoreInventoryFilter) to filter the search result by one or more store inventories. Compared to the default parameter 'ilids' (Inventory List IDs) see (ProductSearchModel.INVENTORY_LIST_IDS_PARAMETER the store inventory filter allows a customization of the parameter name and the inventory list ID parameter values for the URL generations via all URLRefine and URLRelax methods e.g. for ProductSearchModel.urlRefineCategory(String, String), ProductSearchModel.urlRelaxPrice(URL), SearchModel.urlRefineAttribute(String, String, String). Example custom URL: city=Burlington|Boston new dw.catalog.StoreInventoryFilter( "city", new dw.util.ArrayList( new dw.catalog.StoreInventoryFilterValue( "Burlington", "inventory_store_store9" ), new dw.catalog.StoreInventoryFilterValue( "Boston", "inventory_store_store8" ) ) );

## Properties

### semanticURLParameter

**Type:** String (Read Only)

The semantic URL parameter of this StoreInventoryFilter.

### storeInventoryFilterValues

**Type:** List (Read Only)

A list of StoreInventoryFilterValue instances used by this StoreInventoryFilter.

## Constructor Summary

StoreInventoryFilter(semanticURLParameter : String, storeFilterValues : List) Creates a new StoreInventoryFilter instance for the given semantic URL parameter and a list of StoreInventoryFilterValue instances.

## Method Summary

### getSemanticURLParameter

**Signature:** `getSemanticURLParameter() : String`

Returns the semantic URL parameter of this StoreInventoryFilter.

### getStoreInventoryFilterValues

**Signature:** `getStoreInventoryFilterValues() : List`

Returns a list of StoreInventoryFilterValue instances used by this StoreInventoryFilter.

## Constructor Detail

## Method Detail

## Method Details

### getSemanticURLParameter

**Signature:** `getSemanticURLParameter() : String`

**Description:** Returns the semantic URL parameter of this StoreInventoryFilter.

**Returns:**

the semantic URL parameter of this StoreInventoryFilter.

---

### getStoreInventoryFilterValues

**Signature:** `getStoreInventoryFilterValues() : List`

**Description:** Returns a list of StoreInventoryFilterValue instances used by this StoreInventoryFilter.

**Returns:**

a list of StoreInventoryFilterValue instances used by this StoreInventoryFilter.

---