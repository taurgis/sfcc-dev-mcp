## Package: dw.catalog

# Class ProductAvailabilityModel

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductAvailabilityModel

## Description

The ProductAvailabilityModel provides methods for retrieving all information on availability of a single product. When using Omnichannel Inventory (OCI): OCI supports backorders, but does not support preorders or perpetual availability. OCI refers to expected restocks as Future inventory. OCI uses an eventual consistency model with asynchronous inventory data updates. Your code must not assume that inventory-affecting actions, such as placing orders, will immediately change inventory levels.

## Constants

### AVAILABILITY_STATUS_BACKORDER

**Type:** String = "BACKORDER"

Indicates that the product stock has run out, but will be replenished, and is therefore available for ordering.

### AVAILABILITY_STATUS_IN_STOCK

**Type:** String = "IN_STOCK"

Indicates that the product is in stock and available for ordering.

### AVAILABILITY_STATUS_NOT_AVAILABLE

**Type:** String = "NOT_AVAILABLE"

Indicates that the product is not currently available for ordering.

### AVAILABILITY_STATUS_PREORDER

**Type:** String = "PREORDER"

Indicates that the product is not yet in stock but is available for ordering.

## Properties

### availability

**Type:** Number (Read Only)

The availability of the product, which roughly defined is the
 ratio of the original stock that is still available to sell.  The basic
 formula, if the current site uses an
 inventory list, is the ATS quantity divided by allocation
 amount. If the product is not orderable at all this method returns 0.
 The following specific rules apply for standard products:
 
 If inventory lists are in use:
     
     If no inventory record exists and the inventory list default-in-stock flag is true this method returns 1.
     If no inventory record exists the inventory list default-in-stock flag is false this method returns 0.
     If the product is not available this method returns 0.
     If the product is perpetually available this method returns 1.
     Otherwise, this method returns ATS / (allocation + preorderBackorderAllocation). (Values from ProductInventoryRecord.)
     
 
 
 If inventory lists are not in use the method returns 0.

 The following rules apply for special product types:
 
 For a master product this method returns the average availability
 of its online variations.
 For a master product with no online variations this method returns 0.
 For a master product with own inventory record the rules of the standard
 products apply. Note: In this case the availability of the variations is not considered.
 For a product set this method returns the greatest availability of
 the online products in the set.
 For a product set with no online products this method returns 0.
 For a product set with an inventory record the rules of the standard
 products apply. Note: In this case the availability of the set products is not considered.
 For a bundle, this method returns the least availability of the bundled
 products according to their bundled quantity and if it exist also from
 the bundle inventory record.

### availabilityStatus

**Type:** String (Read Only)

The availability-status for the minimum-orderable-quantity (MOQ) of
 the product.  The MOQ essentially represents a single orderable unit, and
 therefore can be represented by a single availability-status.  This
 method is essentially a convenience method.  The same information
 can be retrieved by calling getAvailabilityLevels(Number)
 with the MOQ of the product as the parameter and then retrieving the
 single status from the returned map.

 This method is typically used to display a product's availability in
 the catalog when the order quantity is not known.

### inStock

**Type:** isInStock(Number) (Read Only)

Convenience method for isInStock(Number). Returns true, if the
 Product is available in the minimum-order-quantity. If the product does
 not have a minimum-order-quantity defined, in-stock is checked for a
 quantity value 1.

### inventoryRecord

**Type:** ProductInventoryRecord (Read Only)

The ProductInventoryRecord for the Product associated
 with this model.

### orderable

**Type:** isOrderable(Number) (Read Only)

Convenience method for isOrderable(Number). Returns true if the
 Product is currently online (based on its online flag and online dates)
 and is orderable in its minimum-order-quantity. If the product does not
 have a minimum-order-quantity specified, then 1 is used. The method
 returns false otherwise.
 
 Note: Orderable status is more general than in-stock status. A product
 may be out-of-stock but orderable because it is back-orderable or
 pre-orderable.

### SKUCoverage

**Type:** Number (Read Only)

The SKU coverage of the product.  The basic formula for a
 master product is the ratio of online variations that are in stock
 to the total number of online variations.  The following specific rules
 apply for standard products:
 
 If the product is in stock this method returns the availability of the product.
 If the product is out of stock this method returns 0.
 
 The following rules apply for special product types:
 
 For a master product this method returns the average SKU coverage
 of its online variations.
 For a master product with no online variations this method returns 0.
 For a product set this method returns the ratio of orderable SKUs in the product set
 over the total number of online SKUs in the product set. 
 For a product set with no online products this method returns 0.
 For a product bundle this method returns 1 if all of the bundled
 products are online, and 0 otherwise.
 For a product bundle with no online bundled products this method
 returns 0.

### timeToOutOfStock

**Type:** Number (Read Only)

The number of hours before the product is expected to go out
 of stock.  The basic formula is the ATS quantity divided by the
 sales velocity for the most recent day.  The following specific rules
 apply for standard products:
 
 If the product is out of stock this method returns 0.
 If the product is perpetually available this method returns 1.
 If the sales velocity or ATS is not available this method returns 0.
 Otherwise this method returns ATS / sales velocity.
 
 The following rules apply for special product types:
 
 For a master product this method returns the greatest time to out
 of stock of its online variations.
 For a master product with no online variations this method returns 0.
 For a product set this method returns the greatest time to out
 of stock of the online products in the set.
 For a product set with no online products this method returns 0.
 For a bundle with no product inventory record, this method returns
 the least time to out of stock of the online bundled products.
 For a bundle with no product inventory record, and no online
 bundled products, this method returns 0.

## Constructor Summary

## Method Summary

### getAvailability

**Signature:** `getAvailability() : Number`

Returns the availability of the product, which roughly defined is the ratio of the original stock that is still available to sell.

### getAvailabilityLevels

**Signature:** `getAvailabilityLevels(quantity : Number) : ProductAvailabilityLevels`

Returns an instance of ProductAvailabilityLevels, where each available quantity represents a part of the input quantity.

### getAvailabilityStatus

**Signature:** `getAvailabilityStatus() : String`

Returns the availability-status for the minimum-orderable-quantity (MOQ) of the product.

### getInventoryRecord

**Signature:** `getInventoryRecord() : ProductInventoryRecord`

Returns the ProductInventoryRecord for the Product associated with this model.

### getSKUCoverage

**Signature:** `getSKUCoverage() : Number`

Returns the SKU coverage of the product.

### getTimeToOutOfStock

**Signature:** `getTimeToOutOfStock() : Number`

Returns the number of hours before the product is expected to go out of stock.

### isInStock

**Signature:** `isInStock(quantity : Number) : boolean`

Returns true if the Product is in-stock in the given quantity.

### isInStock

**Signature:** `isInStock() : boolean`

Convenience method for isInStock(Number).

### isOrderable

**Signature:** `isOrderable(quantity : Number) : boolean`

Returns true if the Product is currently online (based on its online flag and online dates) and the specified quantity does not exceed the quantity available for sale, and returns false otherwise.

### isOrderable

**Signature:** `isOrderable() : boolean`

Convenience method for isOrderable(Number).

## Method Detail

## Method Details

### getAvailability

**Signature:** `getAvailability() : Number`

**Description:** Returns the availability of the product, which roughly defined is the ratio of the original stock that is still available to sell. The basic formula, if the current site uses an inventory list, is the ATS quantity divided by allocation amount. If the product is not orderable at all this method returns 0. The following specific rules apply for standard products: If inventory lists are in use: If no inventory record exists and the inventory list default-in-stock flag is true this method returns 1. If no inventory record exists the inventory list default-in-stock flag is false this method returns 0. If the product is not available this method returns 0. If the product is perpetually available this method returns 1. Otherwise, this method returns ATS / (allocation + preorderBackorderAllocation). (Values from ProductInventoryRecord.) If inventory lists are not in use the method returns 0. The following rules apply for special product types: For a master product this method returns the average availability of its online variations. For a master product with no online variations this method returns 0. For a master product with own inventory record the rules of the standard products apply. Note: In this case the availability of the variations is not considered. For a product set this method returns the greatest availability of the online products in the set. For a product set with no online products this method returns 0. For a product set with an inventory record the rules of the standard products apply. Note: In this case the availability of the set products is not considered. For a bundle, this method returns the least availability of the bundled products according to their bundled quantity and if it exist also from the bundle inventory record.

---

### getAvailabilityLevels

**Signature:** `getAvailabilityLevels(quantity : Number) : ProductAvailabilityLevels`

**Description:** Returns an instance of ProductAvailabilityLevels, where each available quantity represents a part of the input quantity. This method is typically used to display availability information in the context of a known order quantity, e.g. a shopping cart. For example, if for a given product there are 3 pieces in stock with no pre/backorder handling specified, and the order quantity is 10, then the return instance would have the following state: ProductAvailabilityLevels.getInStock() - 3 ProductAvailabilityLevels.getPreorder() - 0 ProductAvailabilityLevels.getBackorder() - 0 ProductAvailabilityLevels.getNotAvailable() - 7 The following assertions can be made about the state of the returned instance. Between 1 and 3 levels are non-zero. The sum of the levels equals the input quantity. ProductAvailabilityLevels.getPreorder() or ProductAvailabilityLevels.getBackorder() may be available, but not both. Product bundles are handled specially: The availability of product bundles is calculated based on the availability of the bundled products. Therefore, if a bundle contains products that are not in stock, then the bundle itself is not in stock. If all the products in the bundle are on backorder, then the bundle itself is backordered. If a product bundle has its own inventory record, then this record may further limit the availability. If a bundle has no record, then only the records of the bundled products are considered. Product masters and product sets without an own inventory record are handled specially too: The availability is calculated based on the availability of the variants or set products. A product master or product set is in stock as soon as one of its variants or set products is in stock. Each product master or product set availability level reflects the sum of the variant or set product availability levels up to the specified quantity. Product masters or product sets with own inventory record are handled like standard products. The availability of the variants or set products is not considered. (Such an inventory scenario should be avoided.) Offline products are always unavailable and will result in returned levels that are all unavailable. When using Omnichannel Inventory (OCI), future restocks provided by OCI are mapped to AVAILABILITY_STATUS_BACKORDER. For more information, see the comments for ProductInventoryRecord.

**Parameters:**

- `quantity`: The quantity to evaluate.

**Returns:**

an instance of ProductAvailabilityLevels, which encapsulates the number of items for each relevant availability-status.

**See Also:**

ProductAvailabilityLevels

**Throws:**

IllegalArgumentException - if the specified quantity is less or equal than zero

---

### getAvailabilityStatus

**Signature:** `getAvailabilityStatus() : String`

**Description:** Returns the availability-status for the minimum-orderable-quantity (MOQ) of the product. The MOQ essentially represents a single orderable unit, and therefore can be represented by a single availability-status. This method is essentially a convenience method. The same information can be retrieved by calling getAvailabilityLevels(Number) with the MOQ of the product as the parameter and then retrieving the single status from the returned map. This method is typically used to display a product's availability in the catalog when the order quantity is not known.

**Returns:**

the availability-status.

---

### getInventoryRecord

**Signature:** `getInventoryRecord() : ProductInventoryRecord`

**Description:** Returns the ProductInventoryRecord for the Product associated with this model.

**Returns:**

the ProductInventoryRecord or null if there is none.

---

### getSKUCoverage

**Signature:** `getSKUCoverage() : Number`

**Description:** Returns the SKU coverage of the product. The basic formula for a master product is the ratio of online variations that are in stock to the total number of online variations. The following specific rules apply for standard products: If the product is in stock this method returns the availability of the product. If the product is out of stock this method returns 0. The following rules apply for special product types: For a master product this method returns the average SKU coverage of its online variations. For a master product with no online variations this method returns 0. For a product set this method returns the ratio of orderable SKUs in the product set over the total number of online SKUs in the product set. For a product set with no online products this method returns 0. For a product bundle this method returns 1 if all of the bundled products are online, and 0 otherwise. For a product bundle with no online bundled products this method returns 0.

---

### getTimeToOutOfStock

**Signature:** `getTimeToOutOfStock() : Number`

**Description:** Returns the number of hours before the product is expected to go out of stock. The basic formula is the ATS quantity divided by the sales velocity for the most recent day. The following specific rules apply for standard products: If the product is out of stock this method returns 0. If the product is perpetually available this method returns 1. If the sales velocity or ATS is not available this method returns 0. Otherwise this method returns ATS / sales velocity. The following rules apply for special product types: For a master product this method returns the greatest time to out of stock of its online variations. For a master product with no online variations this method returns 0. For a product set this method returns the greatest time to out of stock of the online products in the set. For a product set with no online products this method returns 0. For a bundle with no product inventory record, this method returns the least time to out of stock of the online bundled products. For a bundle with no product inventory record, and no online bundled products, this method returns 0.

---

### isInStock

**Signature:** `isInStock(quantity : Number) : boolean`

**Description:** Returns true if the Product is in-stock in the given quantity. This is determined as follows: If the product is not currently online (based on its online flag and online dates), then return false. If there is no inventory-list for the current site, then return false. If there is no inventory-record for the product, then return the default setting on the inventory-list. If there is no allocation-amount on the inventory-record, then return the value of the perpetual-flag. If there is an allocation-amount, but the perpetual-flag is true, then return true. If the quantity is less than or equal to the stock-level, then return true. Otherwise return false.

**Parameters:**

- `quantity`: the quantity that is requested

**Returns:**

true if the Product is in-stock.

**Throws:**

Exception - if the specified quantity is less or equal than zero

---

### isInStock

**Signature:** `isInStock() : boolean`

**Description:** Convenience method for isInStock(Number). Returns true, if the Product is available in the minimum-order-quantity. If the product does not have a minimum-order-quantity defined, in-stock is checked for a quantity value 1.

**Returns:**

true if the Product is in stock, otherwise false.

---

### isOrderable

**Signature:** `isOrderable(quantity : Number) : boolean`

**Description:** Returns true if the Product is currently online (based on its online flag and online dates) and the specified quantity does not exceed the quantity available for sale, and returns false otherwise. Note: Orderable status is more general than in-stock status. A product may be out-of-stock but orderable because it is back-orderable or pre-orderable.

**Parameters:**

- `quantity`: the quantity to test against.

**Returns:**

true if the item can be ordered in the specified quantity.

**Throws:**

Exception - if the specified quantity is less or equal than zero

---

### isOrderable

**Signature:** `isOrderable() : boolean`

**Description:** Convenience method for isOrderable(Number). Returns true if the Product is currently online (based on its online flag and online dates) and is orderable in its minimum-order-quantity. If the product does not have a minimum-order-quantity specified, then 1 is used. The method returns false otherwise. Note: Orderable status is more general than in-stock status. A product may be out-of-stock but orderable because it is back-orderable or pre-orderable.

**Returns:**

true if the Product is orderable for the minimum-order-quantity of the product.

---