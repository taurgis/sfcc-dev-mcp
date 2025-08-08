## Package: dw.order

# Class AppeasementItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem
    - dw.order.AppeasementItem

## Description

Represents an item of an Appeasement which is associated with one OrderItem usually representing an Order ProductLineItem. Items are created using method Appeasement.addItems(Money, List) When the related Appeasement were set to status COMPLETED, only the the custom attributes of the appeasement item can be changed. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Properties

### appeasementNumber

**Type:** String (Read Only)

The number of the Appeasement to which this item belongs.

### parentItem

**Type:** AppeasementItem

Returns null or the parent item.

## Constructor Summary

## Method Summary

### getAppeasementNumber

**Signature:** `getAppeasementNumber() : String`

Returns the number of the Appeasement to which this item belongs.

### getParentItem

**Signature:** `getParentItem() : AppeasementItem`

Returns null or the parent item.

### setParentItem

**Signature:** `setParentItem(parentItem : AppeasementItem) : void`

Set a parent item.

## Method Detail

## Method Details

### getAppeasementNumber

**Signature:** `getAppeasementNumber() : String`

**Description:** Returns the number of the Appeasement to which this item belongs.

**Returns:**

the number of the Appeasement to which this item belongs

---

### getParentItem

**Signature:** `getParentItem() : AppeasementItem`

**Description:** Returns null or the parent item.

**Returns:**

null or the parent item.

---

### setParentItem

**Signature:** `setParentItem(parentItem : AppeasementItem) : void`

**Description:** Set a parent item. The parent item must belong to the same Appeasement. An infinite parent-child loop is disallowed as is a parent-child depth greater than 10. Setting a parent item indicates a dependency of the child item on the parent item, and can be used to form a parallel structure to that accessed using ProductLineItem.getParent().

**Parameters:**

- `parentItem`: The parent item, null is allowed

---