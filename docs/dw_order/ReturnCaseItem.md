## Package: dw.order

# Class ReturnCaseItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem
    - dw.order.ReturnCaseItem

## Description

An item of a ReturnCase, created using method ReturnCase.createItem(String). Initially the ReturnCaseItem is NEW. No Return can be created at this point. From NEW the item transitions in CONFIRMED state. Now Return can be created. Next transition is either to PARTIAL_RETURNED or to CANCELLED. At the end the item can be RETURNED (no other Returns can be created. The custom code implementing the ReturnHooks is responsible to provide the logic for the transitions. Please refer to the documentation of ReturnHooks for further information. When the related ReturnCase were confirmed, only the the custom attributes of the return case item can be changed. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

### STATUS_CANCELLED

**Type:** String = "CANCELLED"

constant for ReturnCase Status CANCELLED

### STATUS_CONFIRMED

**Type:** String = "CONFIRMED"

constant for ReturnCase Status CONFIRMED

### STATUS_NEW

**Type:** String = "NEW"

constant for ReturnCase Status NEW

### STATUS_PARTIAL_RETURNED

**Type:** String = "PARTIAL_RETURNED"

constant for ReturnCase Status PARTIAL RETURNED

### STATUS_RETURNED

**Type:** String = "RETURNED"

constant for ReturnCase Status RETURNED

## Properties

### authorizedQuantity

**Type:** Quantity

Return the Quantity authorized for this ReturnCaseItem, may be N/A.

### basePrice

**Type:** Money (Read Only)

Price of a single unit before discount application.

### note

**Type:** String

Return the note for this return case item.

### parentItem

**Type:** ReturnCaseItem

Returns null or the parent item.

### reasonCode

**Type:** EnumValue

The reason code for return case item.

### returnCaseNumber

**Type:** String (Read Only)

Mandatory number of ReturnCase to which this item belongs

### returnItems

**Type:** Collection (Read Only)

Unsorted collection of ReturnItems associated with this ReturnCaseItem.

### status

**Type:** EnumValue

Gets the return case item status.
 
 The possible values are STATUS_NEW,STATUS_CONFIRMED,
 STATUS_PARTIAL_RETURNED, STATUS_RETURNED,
 STATUS_CANCELLED.

## Constructor Summary

## Method Summary

### createReturnItem

**Signature:** `createReturnItem(returnNumber : String) : ReturnItem`

Create a new ReturnItem for this ReturnCaseItem and assign it to the given Return.

### getAuthorizedQuantity

**Signature:** `getAuthorizedQuantity() : Quantity`

Return the Quantity authorized for this ReturnCaseItem, may be N/A.

### getBasePrice

**Signature:** `getBasePrice() : Money`

Price of a single unit before discount application.

### getNote

**Signature:** `getNote() : String`

Return the note for this return case item.

### getParentItem

**Signature:** `getParentItem() : ReturnCaseItem`

Returns null or the parent item.

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

Returns the reason code for return case item.

### getReturnCaseNumber

**Signature:** `getReturnCaseNumber() : String`

Mandatory number of ReturnCase to which this item belongs

### getReturnItems

**Signature:** `getReturnItems() : Collection`

Unsorted collection of ReturnItems associated with this ReturnCaseItem.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the return case item status.

### setAuthorizedQuantity

**Signature:** `setAuthorizedQuantity(authorizedQuantity : Quantity) : void`

Set the optional authorized Quantity for this item.

### setNote

**Signature:** `setNote(note : String) : void`

Sets a note for this return case item.

### setParentItem

**Signature:** `setParentItem(parentItem : ReturnCaseItem) : void`

Set a parent item.

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

Changes the reason code.

### setStatus

**Signature:** `setStatus(statusString : String) : void`

Sets the status.

## Method Detail

## Method Details

### createReturnItem

**Signature:** `createReturnItem(returnNumber : String) : ReturnItem`

**Description:** Create a new ReturnItem for this ReturnCaseItem and assign it to the given Return.

**Parameters:**

- `returnNumber`: number of Return to which new item is assigned.

**Returns:**

new ReturnItem

---

### getAuthorizedQuantity

**Signature:** `getAuthorizedQuantity() : Quantity`

**Description:** Return the Quantity authorized for this ReturnCaseItem, may be N/A.

**Returns:**

the authorized quantity or N/A

---

### getBasePrice

**Signature:** `getBasePrice() : Money`

**Description:** Price of a single unit before discount application.

**Returns:**

Price of a single unit before discount application.

---

### getNote

**Signature:** `getNote() : String`

**Description:** Return the note for this return case item.

**Returns:**

the note or null

---

### getParentItem

**Signature:** `getParentItem() : ReturnCaseItem`

**Description:** Returns null or the parent item.

**Returns:**

null or the parent item.

---

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

**Description:** Returns the reason code for return case item.

**Returns:**

the return reason code

---

### getReturnCaseNumber

**Signature:** `getReturnCaseNumber() : String`

**Description:** Mandatory number of ReturnCase to which this item belongs

**Returns:**

number of ReturnCase to which this item belongs

---

### getReturnItems

**Signature:** `getReturnItems() : Collection`

**Description:** Unsorted collection of ReturnItems associated with this ReturnCaseItem.

**Returns:**

unsorted collection of ReturnItems associated with this ReturnCaseItem

**See Also:**

createReturnItem(String)

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the return case item status. The possible values are STATUS_NEW,STATUS_CONFIRMED, STATUS_PARTIAL_RETURNED, STATUS_RETURNED, STATUS_CANCELLED.

**Returns:**

the status

---

### setAuthorizedQuantity

**Signature:** `setAuthorizedQuantity(authorizedQuantity : Quantity) : void`

**Description:** Set the optional authorized Quantity for this item. Passing null will result in an N/A Quantity being set.

**Parameters:**

- `authorizedQuantity`: null or the quantity

---

### setNote

**Signature:** `setNote(note : String) : void`

**Description:** Sets a note for this return case item.

**Parameters:**

- `note`: the note for this return case item to set

---

### setParentItem

**Signature:** `setParentItem(parentItem : ReturnCaseItem) : void`

**Description:** Set a parent item. The parent item must belong to the same ReturnCase. An infinite parent-child loop is disallowed as is a parent-child depth greater than 10. Setting a parent item indicates a dependency of the child item on the parent item, and can be used to form a parallel structure to that accessed using ProductLineItem.getParent().

**Parameters:**

- `parentItem`: The parent item, null is allowed

---

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

**Description:** Changes the reason code. Initially the reason code is set on return case item creation.

**Parameters:**

- `reasonCode`: the reason code to set

---

### setStatus

**Signature:** `setStatus(statusString : String) : void`

**Description:** Sets the status. The possible values are STATUS_NEW,STATUS_CONFIRMED, STATUS_PARTIAL_RETURNED, STATUS_RETURNED, STATUS_CANCELLED.

**Parameters:**

- `statusString`: the status

**Throws:**

NullPointerException - if status is null
IllegalArgumentException - if the status transition to the status is not allowed

---