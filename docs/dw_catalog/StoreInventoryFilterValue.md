## Package: dw.catalog

# Class StoreInventoryFilterValue

## Inheritance Hierarchy

- Object
  - dw.catalog.StoreInventoryFilterValue

## Description

This class represents a store inventory filter value, which can be used for a StoreInventoryFilter to filter the search result by one or more store inventory list IDs via ProductSearchModel.setStoreInventoryFilter(StoreInventoryFilter). Compared to ProductSearchModel.setInventoryListIDs(List) the store inventory filter allows a customization of the inventory parameter name and the inventory list ID values for URL generations. A StoreInventoryFilterValue provides the mapping between a semantic value e.g. store1,store2 or Burlington,Boston to the related real inventory list ID. Example custom URL: city=Burlington|Boston new dw.catalog.StoreInventoryFilter("city", new dw.util.ArrayList( new dw.catalog.StoreInventoryFilterValue("Burlington","inventory_store_store9"), new dw.catalog.StoreInventoryFilterValue("Boston","inventory_store_store8") ));

## Properties

### inventoryListID

**Type:** String (Read Only)

The real inventory list ID of this store inventory filter value.

### semanticInventoryID

**Type:** String (Read Only)

The semantic inventory ID of this store inventory filter value.

## Constructor Summary

StoreInventoryFilterValue(semanticInventoryListID : String, inventoryListID : String) Creates a new StoreInventoryFilterValue instance for the semantic inventory ID and real inventory list ID.

## Method Summary

### getInventoryListID

**Signature:** `getInventoryListID() : String`

Returns the real inventory list ID of this store inventory filter value.

### getSemanticInventoryID

**Signature:** `getSemanticInventoryID() : String`

Returns the semantic inventory ID of this store inventory filter value.

## Constructor Detail

## Method Detail

## Method Details

### getInventoryListID

**Signature:** `getInventoryListID() : String`

**Description:** Returns the real inventory list ID of this store inventory filter value.

**Returns:**

the real inventory list ID of this store inventory filter value.

---

### getSemanticInventoryID

**Signature:** `getSemanticInventoryID() : String`

**Description:** Returns the semantic inventory ID of this store inventory filter value.

**Returns:**

the semantic inventory ID of this store inventory filter value.

---