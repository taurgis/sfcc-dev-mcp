## Package: dw.customer

# Class ProductListItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.ProductListItem

## Description

An item in a product list. Types of items are: An item that references a product via the product's SKU. An item that represents a gift certificate.

## Constants

## Properties

### ID

**Type:** String (Read Only)

The unique system generated ID of the object.

### list

**Type:** ProductList (Read Only)

The product list that this item belongs to.

### priority

**Type:** Number

Specify the priority level for the item.  Typically the lower the
 number, the higher the priority. This can be used by the owner of the product list
 to express which items he/she likes to get purchased first.

### product

**Type:** Product

The referenced product for this item.  The reference is made
 via the product ID attribute.  This method returns null if there is
 no such product in the system or if the product exists but is not
 assigned to the site catalog.

### productID

**Type:** String (Read Only)

The ID of the product referenced by this item.
 This attribute is set when a product is assigned via setProduct().
 It is possible for the ID to reference a product that doesn't exist
 anymore.  In this case getProduct() would return null.

### productOptionModel

**Type:** ProductOptionModel

The ProductOptionModel for the product associated with this item,
 or null if there is no valid product associated with this item.

### public

**Type:** boolean

A flag, typically used to determine whether the item should display
 in a customer's view of the list (as opposed to the list owner's view).

### purchasedQuantity

**Type:** Quantity (Read Only)

The sum of the quantities of all the individual purchase records
 for this item.

### purchasedQuantityValue

**Type:** Number (Read Only)

The value part of the underlying purchased quantity object, as distinct
 from the unit.

### purchases

**Type:** Collection (Read Only)

All purchases made for this item.

### quantity

**Type:** Quantity

The quantity of the item.
 The quantity is the number of products or gift certificates
 that get shipped when purchasing this product list item.

### quantityValue

**Type:** Number

The value part of the underlying quantity object, as distinct
 from the unit.

### type

**Type:** Number (Read Only)

The type of this product list item.

## Constructor Summary

## Method Summary

### createPurchase

**Signature:** `createPurchase(quantity : Number, purchaserName : String) : ProductListItemPurchase`

Create a purchase record for this item.

### getID

**Signature:** `getID() : String`

Returns the unique system generated ID of the object.

### getList

**Signature:** `getList() : ProductList`

Returns the product list that this item belongs to.

### getPriority

**Signature:** `getPriority() : Number`

Specify the priority level for the item.

### getProduct

**Signature:** `getProduct() : Product`

Returns the referenced product for this item.

### getProductID

**Signature:** `getProductID() : String`

Returns the ID of the product referenced by this item.

### getProductOptionModel

**Signature:** `getProductOptionModel() : ProductOptionModel`

Returns the ProductOptionModel for the product associated with this item, or null if there is no valid product associated with this item.

### getPurchasedQuantity

**Signature:** `getPurchasedQuantity() : Quantity`

Returns the sum of the quantities of all the individual purchase records for this item.

### getPurchasedQuantityValue

**Signature:** `getPurchasedQuantityValue() : Number`

Returns the value part of the underlying purchased quantity object, as distinct from the unit.

### getPurchases

**Signature:** `getPurchases() : Collection`

Returns all purchases made for this item.

### getQuantity

**Signature:** `getQuantity() : Quantity`

Returns the quantity of the item.

### getQuantityValue

**Signature:** `getQuantityValue() : Number`

Returns the value part of the underlying quantity object, as distinct from the unit.

### getType

**Signature:** `getType() : Number`

Returns the type of this product list item.

### isPublic

**Signature:** `isPublic() : boolean`

A flag, typically used to determine whether the item should display in a customer's view of the list (as opposed to the list owner's view).

### setPriority

**Signature:** `setPriority(priority : Number) : void`

Specify the priority level for the item.

### setProduct

**Signature:** `setProduct(product : Product) : void`

Sets the referenced product for this item by storing the product's id.

### setProductOptionModel

**Signature:** `setProductOptionModel(productOptionModel : ProductOptionModel) : void`

Store a product option model with this object.

### setPublic

**Signature:** `setPublic(flag : boolean) : void`

Typically used to determine if the item is visible to other customers.

### setQuantity

**Signature:** `setQuantity(value : Quantity) : void`

Sets the quantity of the item.

### setQuantityValue

**Signature:** `setQuantityValue(value : Number) : void`

Set the value part of the underlying quantity object, as distinct from the unit.

## Method Detail

## Method Details

### createPurchase

**Signature:** `createPurchase(quantity : Number, purchaserName : String) : ProductListItemPurchase`

**Description:** Create a purchase record for this item.

**Parameters:**

- `quantity`: The number of items purchased.
- `purchaserName`: The name of the purchaser.

**Returns:**

the purchase record.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique system generated ID of the object.

**Returns:**

the ID of object.

---

### getList

**Signature:** `getList() : ProductList`

**Description:** Returns the product list that this item belongs to.

**Returns:**

the list.

---

### getPriority

**Signature:** `getPriority() : Number`

**Description:** Specify the priority level for the item. Typically the lower the number, the higher the priority. This can be used by the owner of the product list to express which items he/she likes to get purchased first.

**Returns:**

the specified priority level.

---

### getProduct

**Signature:** `getProduct() : Product`

**Description:** Returns the referenced product for this item. The reference is made via the product ID attribute. This method returns null if there is no such product in the system or if the product exists but is not assigned to the site catalog.

**Returns:**

the product referenced by this item, or null.

---

### getProductID

**Signature:** `getProductID() : String`

**Description:** Returns the ID of the product referenced by this item. This attribute is set when a product is assigned via setProduct(). It is possible for the ID to reference a product that doesn't exist anymore. In this case getProduct() would return null.

**Returns:**

the product ID, or null if none exists.

---

### getProductOptionModel

**Signature:** `getProductOptionModel() : ProductOptionModel`

**Description:** Returns the ProductOptionModel for the product associated with this item, or null if there is no valid product associated with this item.

**Returns:**

the associated ProductOptionModel or null.

---

### getPurchasedQuantity

**Signature:** `getPurchasedQuantity() : Quantity`

**Description:** Returns the sum of the quantities of all the individual purchase records for this item.

**Returns:**

the sum of the quantities of all the individual purchase records for this item.

---

### getPurchasedQuantityValue

**Signature:** `getPurchasedQuantityValue() : Number`

**Description:** Returns the value part of the underlying purchased quantity object, as distinct from the unit.

**Returns:**

the value part of the underlying purchased quantity object, as distinct from the unit.

---

### getPurchases

**Signature:** `getPurchases() : Collection`

**Description:** Returns all purchases made for this item.

**Returns:**

the collection of purchase records for this item. Returns an empty list if this item has not been purchased yet.

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** Returns the quantity of the item. The quantity is the number of products or gift certificates that get shipped when purchasing this product list item.

**Returns:**

the quantity of the item.

---

### getQuantityValue

**Signature:** `getQuantityValue() : Number`

**Description:** Returns the value part of the underlying quantity object, as distinct from the unit.

**Returns:**

the value part of the underlying quantity object, as distinct from the unit.

---

### getType

**Signature:** `getType() : Number`

**Description:** Returns the type of this product list item.

**Returns:**

a code that specifies the type of item (i.e. product or gift certificate).

---

### isPublic

**Signature:** `isPublic() : boolean`

**Description:** A flag, typically used to determine whether the item should display in a customer's view of the list (as opposed to the list owner's view).

**Returns:**

true if the item is public.

---

### setPriority

**Signature:** `setPriority(priority : Number) : void`

**Description:** Specify the priority level for the item. Typically the lower the number, the higher the priority. This can be used by the owner of the product list to express which items he/she likes to get purchased first.

**Parameters:**

- `priority`: The new priority level.

---

### setProduct

**Signature:** `setProduct(product : Product) : void`

**Description:** Sets the referenced product for this item by storing the product's id. If null is specified, then the id is set to null.

**Deprecated:**

Use ProductList.createProductItem(Product) instead.

**Parameters:**

- `product`: The referenced product for this item.

---

### setProductOptionModel

**Signature:** `setProductOptionModel(productOptionModel : ProductOptionModel) : void`

**Description:** Store a product option model with this object. This stores a copy of the specified model, rather than an assocation to the same instance.

**Parameters:**

- `productOptionModel`: The object to store.

---

### setPublic

**Signature:** `setPublic(flag : boolean) : void`

**Description:** Typically used to determine if the item is visible to other customers.

**Parameters:**

- `flag`: If true, this product list becomes visible to other customers. If false, this product list can only be seen by the owner of the product list.

---

### setQuantity

**Signature:** `setQuantity(value : Quantity) : void`

**Description:** Sets the quantity of the item.

**Deprecated:**

Use setQuantityValue(Number) instead.

**Parameters:**

- `value`: the new quantity of the item.

---

### setQuantityValue

**Signature:** `setQuantityValue(value : Number) : void`

**Description:** Set the value part of the underlying quantity object, as distinct from the unit.

**Parameters:**

- `value`: the value to use.

---