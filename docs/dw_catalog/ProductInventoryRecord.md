## Package: dw.catalog

# Class ProductInventoryRecord

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.ProductInventoryRecord

## Description

The ProductInventoryRecord holds information about a Product's inventory, and availability. When using Omnichannel Inventory (OCI): All ProductInventoryRecord properties are read-only. Calling any setter method throws an IllegalStateException. The ProductInventoryRecord class does not support custom properties. isPerpetual() and isPreorderable() always return false.

## Properties

### allocation

**Type:** Quantity

The allocation quantity that is currently set. The quantity unit is the same unit as the product itself.
 
 When using OCI, returns the physically available quantity. Corresponds to the On Hand quantity in OCI.

### allocationResetDate

**Type:** Date (Read Only)

The date the allocation quantity was initialized or reset.
 
 When using OCI, corresponds to the Effective Date in OCI. The value can be null.

### ATS

**Type:** Quantity (Read Only)

The quantity of items available to sell (ATS). This is calculated as the allocation
 (getAllocation()) plus the preorderBackorderAllocation (getPreorderBackorderAllocation()) minus
 the turnover (getTurnover()) minus the on order quantity (getOnOrder()).
 
 When using OCI, corresponds to the ATO (Available To Order) quantity in OCI.

### backorderable

**Type:** boolean

Determines if the product is backorderable.
 
 When using OCI, returns true if the product has at least one Future quantity in OCI.

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this object. The returned object is used for retrieving and storing attribute
 values. See CustomAttributes for a detailed example of the syntax for working with custom
 attributes.
 
 When using Omnichannel Inventory (OCI), this class doesn't support custom attributes. If OCI is enabled, then
 attempting to set or modify a custom attribute value throws an UnsupportedOperationException.

### inStockDate

**Type:** Date

The date that the item is expected to be in stock.
 
 When using OCI, returns the date of the earliest Future quantity. If the product has no Future quantities, it
 returns null.

### onHand

**Type:** Quantity (Read Only)

The on-hand quantity, the actual quantity of available (on-hand) items.

### onOrder

**Type:** Quantity (Read Only)

The quantity that is currently on order.
 
 This is only relevant when On Order Inventory is turned on for the related inventory list. On Order is a bucket
 of inventory used for the time between order creation and order export to external (warehouse) systems. On Order
 value is increased when an order is created. It will be decreased and with that turnover will be increased when
 the order is exported, see getTurnover(). Notice that Order.setExportStatus(Number) and
 OrderItem.allocateInventory(Boolean) will decrease the On Order value. On order will be included
 in the ATS calculation, see getATS().
 
 
 When using OCI, always returns zero. OCI doesn't support On Order inventory.

### perpetual

**Type:** boolean

Determines if the product is perpetually in stock.
 
 When using OCI, always returns false.

### preorderable

**Type:** boolean

Determines if the product is preorderable.
 
 When using OCI, always returns false.

### preorderBackorderAllocation

**Type:** Quantity

The quantity of items that are allocated for sale, beyond the initial stock allocation.
 
 When using OCI, returns the sum of all Future quantities. If the product has no Future quantities, it returns
 zero.

### reserved

**Type:** Quantity (Read Only)

The quantity of items that are reserved.
 
 Note that for products with high velocity and concurrency, the return value is extremely volatile and the
 retrieval will be expensive.
 
 When using OCI, always returns zero.

### stockLevel

**Type:** Quantity (Read Only)

The current stock level. This is calculated as the allocation minus the turnover.
 
 When using OCI, corresponds to the ATF (Available To Fulfill) quantity in OCI.

### turnover

**Type:** Quantity (Read Only)

The sum of all inventory transactions (decrements and increments) recorded after the allocation reset
 date. If the total decremented quantity is greater than the total incremented quantity, then this value is
 negative.
 
 When using OCI, returns the total reserved quantity, including order, basket, and temporary reservations.

## Constructor Summary

## Method Summary

### describe

**Signature:** `describe() : ObjectTypeDefinition`

Returns the meta data of this object.

### getAllocation

**Signature:** `getAllocation() : Quantity`

Returns the allocation quantity that is currently set.

### getAllocationResetDate

**Signature:** `getAllocationResetDate() : Date`

Returns the date the allocation quantity was initialized or reset.

### getATS

**Signature:** `getATS() : Quantity`

Returns the quantity of items available to sell (ATS).

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes for this object.

### getInStockDate

**Signature:** `getInStockDate() : Date`

Returns the date that the item is expected to be in stock.

### getOnHand

**Signature:** `getOnHand() : Quantity`

Returns the on-hand quantity, the actual quantity of available (on-hand) items.

### getOnOrder

**Signature:** `getOnOrder() : Quantity`

Returns the quantity that is currently on order.

### getPreorderBackorderAllocation

**Signature:** `getPreorderBackorderAllocation() : Quantity`

Returns the quantity of items that are allocated for sale, beyond the initial stock allocation.

### getReserved

**Signature:** `getReserved() : Quantity`

Returns the quantity of items that are reserved.

### getStockLevel

**Signature:** `getStockLevel() : Quantity`

Returns the current stock level.

### getTurnover

**Signature:** `getTurnover() : Quantity`

Returns the sum of all inventory transactions (decrements and increments) recorded after the allocation reset date.

### isBackorderable

**Signature:** `isBackorderable() : boolean`

Determines if the product is backorderable.

### isPerpetual

**Signature:** `isPerpetual() : boolean`

Determines if the product is perpetually in stock.

### isPreorderable

**Signature:** `isPreorderable() : boolean`

Determines if the product is preorderable.

### setAllocation

**Signature:** `setAllocation(quantity : Number) : void`

Sets the allocation quantity.

### setAllocation

**Signature:** `setAllocation(quantity : Number, allocationResetDate : Date) : void`

Sets the allocation quantity.

### setBackorderable

**Signature:** `setBackorderable(backorderableFlag : boolean) : void`

The method is used to set whether the product is backorderable.

### setInStockDate

**Signature:** `setInStockDate(inStockDate : Date) : void`

Sets the date that the item is expected to be in stock.

### setPerpetual

**Signature:** `setPerpetual(perpetualFlag : boolean) : void`

Sets if the product is perpetually in stock.

### setPreorderable

**Signature:** `setPreorderable(preorderableFlag : boolean) : void`

The method is used to set whether the product is preorderable.

### setPreorderBackorderAllocation

**Signature:** `setPreorderBackorderAllocation(quantity : Number) : void`

Sets the quantity of items that are allocated for sale, beyond the initial stock allocation.

## Method Detail

## Method Details

### describe

**Signature:** `describe() : ObjectTypeDefinition`

**Description:** Returns the meta data of this object. If no meta data is available the method returns null. The returned ObjectTypeDefinition can be used to retrieve the metadata for any of the custom attributes. When using Omnichannel Inventory (OCI), this class doesn't support custom attributes. If OCI is enabled, then attempting to set or modify a custom attribute value throws an UnsupportedOperationException.

**Returns:**

the meta data of this object. If no meta data is available the method returns null.

---

### getAllocation

**Signature:** `getAllocation() : Quantity`

**Description:** Returns the allocation quantity that is currently set. The quantity unit is the same unit as the product itself. When using OCI, returns the physically available quantity. Corresponds to the On Hand quantity in OCI.

**Returns:**

the allocation quantity or quantity N/A if not available.

---

### getAllocationResetDate

**Signature:** `getAllocationResetDate() : Date`

**Description:** Returns the date the allocation quantity was initialized or reset. When using OCI, corresponds to the Effective Date in OCI. The value can be null.

**Returns:**

the allocation reset date.

---

### getATS

**Signature:** `getATS() : Quantity`

**Description:** Returns the quantity of items available to sell (ATS). This is calculated as the allocation (getAllocation()) plus the preorderBackorderAllocation (getPreorderBackorderAllocation()) minus the turnover (getTurnover()) minus the on order quantity (getOnOrder()). When using OCI, corresponds to the ATO (Available To Order) quantity in OCI.

**Returns:**

the quantity or quantity N/A if not available.

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes for this object. The returned object is used for retrieving and storing attribute values. See CustomAttributes for a detailed example of the syntax for working with custom attributes. When using Omnichannel Inventory (OCI), this class doesn't support custom attributes. If OCI is enabled, then attempting to set or modify a custom attribute value throws an UnsupportedOperationException.

**Returns:**

the custom attributes for this object.

---

### getInStockDate

**Signature:** `getInStockDate() : Date`

**Description:** Returns the date that the item is expected to be in stock. When using OCI, returns the date of the earliest Future quantity. If the product has no Future quantities, it returns null.

**Returns:**

the date that the item is expected to be in stock.

---

### getOnHand

**Signature:** `getOnHand() : Quantity`

**Description:** Returns the on-hand quantity, the actual quantity of available (on-hand) items.

**API Versioned:**

No longer available as of version 21.7.

**Deprecated:**

Use getStockLevel() instead.

**Returns:**

the on-hand quantity or quantity N/A if not available.

---

### getOnOrder

**Signature:** `getOnOrder() : Quantity`

**Description:** Returns the quantity that is currently on order. This is only relevant when On Order Inventory is turned on for the related inventory list. On Order is a bucket of inventory used for the time between order creation and order export to external (warehouse) systems. On Order value is increased when an order is created. It will be decreased and with that turnover will be increased when the order is exported, see getTurnover(). Notice that Order.setExportStatus(Number) and OrderItem.allocateInventory(Boolean) will decrease the On Order value. On order will be included in the ATS calculation, see getATS(). When using OCI, always returns zero. OCI doesn't support On Order inventory.

**Returns:**

the quantity or quantity N/A if not available.

---

### getPreorderBackorderAllocation

**Signature:** `getPreorderBackorderAllocation() : Quantity`

**Description:** Returns the quantity of items that are allocated for sale, beyond the initial stock allocation. When using OCI, returns the sum of all Future quantities. If the product has no Future quantities, it returns zero.

**Returns:**

the quantity or quantity N/A if not available.

---

### getReserved

**Signature:** `getReserved() : Quantity`

**Description:** Returns the quantity of items that are reserved. Note that for products with high velocity and concurrency, the return value is extremely volatile and the retrieval will be expensive. When using OCI, always returns zero.

**Returns:**

the quantity of items reserved for this product.

---

### getStockLevel

**Signature:** `getStockLevel() : Quantity`

**Description:** Returns the current stock level. This is calculated as the allocation minus the turnover. When using OCI, corresponds to the ATF (Available To Fulfill) quantity in OCI.

**Returns:**

the stock level or quantity N/A if not available.

---

### getTurnover

**Signature:** `getTurnover() : Quantity`

**Description:** Returns the sum of all inventory transactions (decrements and increments) recorded after the allocation reset date. If the total decremented quantity is greater than the total incremented quantity, then this value is negative. When using OCI, returns the total reserved quantity, including order, basket, and temporary reservations.

**Returns:**

the turnover or quantity N/A if not available.

---

### isBackorderable

**Signature:** `isBackorderable() : boolean`

**Description:** Determines if the product is backorderable. When using OCI, returns true if the product has at least one Future quantity in OCI.

**Returns:**

true if the product is backorderable.

---

### isPerpetual

**Signature:** `isPerpetual() : boolean`

**Description:** Determines if the product is perpetually in stock. When using OCI, always returns false.

**Returns:**

true if the product is perpetually in stock.

---

### isPreorderable

**Signature:** `isPreorderable() : boolean`

**Description:** Determines if the product is preorderable. When using OCI, always returns false.

**Returns:**

true if the product is preorderable.

---

### setAllocation

**Signature:** `setAllocation(quantity : Number) : void`

**Description:** Sets the allocation quantity. This also updates the allocation reset date. All final reservations will be considered as expired and will therefore no longer be considered for ATS. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request.

**API Versioned:**

No longer available as of version 21.7.

**Parameters:**

- `quantity`: the allocation quantity to set (must be greater than or equal to zero).

---

### setAllocation

**Signature:** `setAllocation(quantity : Number, allocationResetDate : Date) : void`

**Description:** Sets the allocation quantity. This also updates the allocation reset date. Any final reservations made prior to the allocation reset date will be considered as expired and will therefore no longer be considered for ATS. When using OCI, throws an IllegalStateException. This method must not be called within a storefront request.

**Parameters:**

- `quantity`: the allocation quantity to set (must be greater than or equal to zero).
- `allocationResetDate`: the date allocation quantity was effectively calculated the reset date must not be older than 48 hours the reset date must not be older than the prior reset date. see getAllocationResetDate()

---

### setBackorderable

**Signature:** `setBackorderable(backorderableFlag : boolean) : void`

**Description:** The method is used to set whether the product is backorderable. Setting the backorderable flag to true will clear the preorderable flag. If the record's preorderable flag is set to true, calling this method with backorderableFlag==false will have no effect. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request. This method must not be called within a storefront request when the API version is 21.7 or later.

**Parameters:**

- `backorderableFlag`: the flag to set backorderable status.

---

### setInStockDate

**Signature:** `setInStockDate(inStockDate : Date) : void`

**Description:** Sets the date that the item is expected to be in stock. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request. This method must not be called within a storefront request when the API version is 21.7 or later.

**Parameters:**

- `inStockDate`: the date that the item is expected to be in stock.

---

### setPerpetual

**Signature:** `setPerpetual(perpetualFlag : boolean) : void`

**Description:** Sets if the product is perpetually in stock. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request. This method must not be called within a storefront request when the API version is 21.7 or later.

**Parameters:**

- `perpetualFlag`: true to set the product perpetually in stock.

---

### setPreorderable

**Signature:** `setPreorderable(preorderableFlag : boolean) : void`

**Description:** The method is used to set whether the product is preorderable. Setting the preorderable flag to true will clear the backorderable flag. If the record's backorderable flag is set to true, calling this method with preorderableFlag==false will have no effect. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request. This method must not be called within a storefront request when the API version is 21.7 or later.

**Parameters:**

- `preorderableFlag`: the flag to set preorderable status.

---

### setPreorderBackorderAllocation

**Signature:** `setPreorderBackorderAllocation(quantity : Number) : void`

**Description:** Sets the quantity of items that are allocated for sale, beyond the initial stock allocation. When using OCI, throws an IllegalStateException. This method should not be called within a storefront request. This method must not be called within a storefront request when the API version is 21.7 or later.

**Parameters:**

- `quantity`: the quantity to set.

---