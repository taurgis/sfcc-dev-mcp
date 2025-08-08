## Package: dw.catalog

# Class ProductInventoryMgr

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductInventoryMgr

## Description

This manager provides access to inventory-related objects.

## Constants

## Properties

### inventoryIntegrationMode

**Type:** String (Read Only)

The current inventory integration mode as one of
 
 INTEGRATIONMODE_B2C
 INTEGRATIONMODE_OCI_CACHE
 INTEGRATIONMODE_OCI

### inventoryList

**Type:** ProductInventoryList (Read Only)

The inventory list assigned to the current site or null if no inventory list is assigned to the current
 site.

## Constructor Summary

## Method Summary

### getInventoryIntegrationMode

**Signature:** `static getInventoryIntegrationMode() : String`

Returns the current inventory integration mode as one of INTEGRATIONMODE_B2C INTEGRATIONMODE_OCI_CACHE INTEGRATIONMODE_OCI

### getInventoryList

**Signature:** `static getInventoryList() : ProductInventoryList`

Returns the inventory list assigned to the current site or null if no inventory list is assigned to the current site.

### getInventoryList

**Signature:** `static getInventoryList(listID : String) : ProductInventoryList`

Returns the inventory list with the passed ID or null if no inventory list exists with that ID.

## Method Detail

## Method Details

### getInventoryIntegrationMode

**Signature:** `static getInventoryIntegrationMode() : String`

**Description:** Returns the current inventory integration mode as one of INTEGRATIONMODE_B2C INTEGRATIONMODE_OCI_CACHE INTEGRATIONMODE_OCI

**Returns:**

The current inventory integration mode as a constant String.

---

### getInventoryList

**Signature:** `static getInventoryList() : ProductInventoryList`

**Description:** Returns the inventory list assigned to the current site or null if no inventory list is assigned to the current site.

**Returns:**

The ProductInventoryList assigned to the current site, or null.

---

### getInventoryList

**Signature:** `static getInventoryList(listID : String) : ProductInventoryList`

**Description:** Returns the inventory list with the passed ID or null if no inventory list exists with that ID.

**Parameters:**

- `listID`: The ID of the inventory list to retrieve.

**Returns:**

The ProductInventoryList identified by listID, or null.

---