## Package: dw.catalog

# Class ProductInventoryList

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.ProductInventoryList

## Description

The ProductInventoryList provides access to ID, description and defaultInStockFlag of the list. Furthermore inventory records can be accessed by product or product ID. When using Omnichannel Inventory (OCI): B2C Commerce uses ProductInventoryLists to reference and expose OCI Locations and Location Groups. They're required for synchronizing availability data and creating reservations. Create a ProductInventoryList in B2C Commerce for each OCI Location and Location Group that B2C Commerce will access. The ProductInventoryList ID must match the External Reference field on the corresponding Location or Location Group. A ProductInventoryList ID/External Reference must have between 2 and 128 characters (inclusive). It can include only lowercase letters, uppercase letters, digits, hyphens, and underscores.

## Properties

### defaultInStockFlag

**Type:** boolean (Read Only)

The default in-stock flag of the inventory list.

### description

**Type:** String (Read Only)

The description of the inventory list.

### ID

**Type:** String (Read Only)

The ID of the inventory list.

## Constructor Summary

## Method Summary

### getDefaultInStockFlag

**Signature:** `getDefaultInStockFlag() : boolean`

Returns the default in-stock flag of the inventory list.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the inventory list.

### getID

**Signature:** `getID() : String`

Returns the ID of the inventory list.

### getRecord

**Signature:** `getRecord(product : Product) : ProductInventoryRecord`

Returns the inventory record for the specified product or null if there is no record for the product in this list.

### getRecord

**Signature:** `getRecord(productID : String) : ProductInventoryRecord`

Returns the inventory record for the specified product ID or null if there is no record for the product id in this list.

## Method Detail

## Method Details

### getDefaultInStockFlag

**Signature:** `getDefaultInStockFlag() : boolean`

**Description:** Returns the default in-stock flag of the inventory list.

**Returns:**

Default in-stock flag of inventory list.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the inventory list.

**Returns:**

Description of inventory list.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the inventory list.

**Returns:**

ID of inventory list.

---

### getRecord

**Signature:** `getRecord(product : Product) : ProductInventoryRecord`

**Description:** Returns the inventory record for the specified product or null if there is no record for the product in this list.

**Parameters:**

- `product`: The product to lookup inventory record.

**Returns:**

Inventory record or null if not found.

---

### getRecord

**Signature:** `getRecord(productID : String) : ProductInventoryRecord`

**Description:** Returns the inventory record for the specified product ID or null if there is no record for the product id in this list.

**Parameters:**

- `productID`: The product ID to lookup inventory record.

**Returns:**

Inventory record or null if not found.

---