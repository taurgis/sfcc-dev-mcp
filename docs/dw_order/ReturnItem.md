## Package: dw.order

# Class ReturnItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem
    - dw.order.ReturnItem

## Description

An item of a Return, created using Return.createItem(String). Represents a physically returned order line item. Please refer to the documentation of ReturnHooks for further information. When the related Return were set to status COMPLETED, only the the custom attributes of the return item can be changed. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Properties

### basePrice

**Type:** Money (Read Only)

Price of a single unit before discount application.

### note

**Type:** String

Return the note for this return item.

### parentItem

**Type:** ReturnItem

Returns null or the parent item.

### reasonCode

**Type:** EnumValue

The reason code for return item. The list of reason codes can be updated
 by updating meta-data for ReturnItem.

### returnCaseItem

**Type:** ReturnCaseItem (Read Only)

The return case item related to this item. Should never return null.

### returnedQuantity

**Type:** Quantity

The Quantity returned. This may return an N/A quantity.

### returnNumber

**Type:** String (Read Only)

The mandatory returnNumber of the Return to which this item belongs.

## Constructor Summary

## Method Summary

### addTaxItem

**Signature:** `addTaxItem(amount : Decimal, taxGroup : TaxGroup) : TaxItem`

Create a new tax-item and add to this item.

### applyPriceRate

**Signature:** `applyPriceRate(factor : Decimal, divisor : Decimal, roundUp : boolean) : void`

Apply a rate of (factor / divisor) to the prices in this item, with the option to half round up or half round down to the nearest cent if necessary.

### getBasePrice

**Signature:** `getBasePrice() : Money`

Price of a single unit before discount application.

### getNote

**Signature:** `getNote() : String`

Return the note for this return item.

### getParentItem

**Signature:** `getParentItem() : ReturnItem`

Returns null or the parent item.

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

Returns the reason code for return item.

### getReturnCaseItem

**Signature:** `getReturnCaseItem() : ReturnCaseItem`

Returns the return case item related to this item.

### getReturnedQuantity

**Signature:** `getReturnedQuantity() : Quantity`

The Quantity returned.

### getReturnNumber

**Signature:** `getReturnNumber() : String`

The mandatory returnNumber of the Return to which this item belongs.

### setNote

**Signature:** `setNote(note : String) : void`

Sets a note for this return item.

### setParentItem

**Signature:** `setParentItem(parentItem : ReturnItem) : void`

Set a parent item.

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

Set the reason code.

### setReturnedQuantity

**Signature:** `setReturnedQuantity(quantity : Quantity) : void`

Set the Quantity returned.

### setTaxBasis

**Signature:** `setTaxBasis(taxBasis : Money) : void`

Set the tax-basis price for this item.

### setTaxItems

**Signature:** `setTaxItems(taxItems : Collection) : void`

Set the tax-items for this item.

## Method Detail

## Method Details

### addTaxItem

**Signature:** `addTaxItem(amount : Decimal, taxGroup : TaxGroup) : TaxItem`

**Description:** Create a new tax-item and add to this item.

**Parameters:**

- `amount`: amount to assign to the tax-item
- `taxGroup`: the TaxGroup to which the item belongs

**Returns:**

the new tax-item

---

### applyPriceRate

**Signature:** `applyPriceRate(factor : Decimal, divisor : Decimal, roundUp : boolean) : void`

**Description:** Apply a rate of (factor / divisor) to the prices in this item, with the option to half round up or half round down to the nearest cent if necessary. Examples: TaxBasis beforefactordivisorroundupCalculationTaxBasis after $10.0012true10*1/2=$5.00 $10.00910true10*9/10=$9.00 $10.0013true10*1/3=3.3333=$3.33 $2.4712true2.47*1/2=1.235=$1.24 $2.4712false2.47*1/2=1.235=$1.23 Which prices are updated?: The rate described above is applied to tax-basis and tax then the net-price and gross-price are recalculated by adding / subtracting depending on whether the order is based on net price. Example (order based on net price) New TaxBasis:$10.00, Tax:$1.00, NetPrice=TaxBasis=$10.00, GrossPrice=TaxBasis+Tax=$11.00 Example (order based on gross price) New TaxBasis:$10.00, Tax:$1.00, NetPrice=TaxBasis-tax=$9.00, GrossPrice=TaxBasis=$10.00

**Parameters:**

- `factor`: factor used to calculate rate
- `divisor`: divisor used to calculate rate
- `roundUp`: whether to round up or down on 0.5

**See Also:**

AbstractItem.getTaxBasis()
AbstractItem.getTax()
AbstractItem.getNetPrice()
AbstractItem.getGrossPrice()
TaxMgr.getTaxationPolicy()

---

### getBasePrice

**Signature:** `getBasePrice() : Money`

**Description:** Price of a single unit before discount application.

**Returns:**

Price of a single unit before discount application.

---

### getNote

**Signature:** `getNote() : String`

**Description:** Return the note for this return item.

**Returns:**

the note or null

---

### getParentItem

**Signature:** `getParentItem() : ReturnItem`

**Description:** Returns null or the parent item.

**Returns:**

null or the parent item.

---

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

**Description:** Returns the reason code for return item. The list of reason codes can be updated by updating meta-data for ReturnItem.

**Returns:**

the return reason code

---

### getReturnCaseItem

**Signature:** `getReturnCaseItem() : ReturnCaseItem`

**Description:** Returns the return case item related to this item. Should never return null.

**Returns:**

the return case item related to this item

---

### getReturnedQuantity

**Signature:** `getReturnedQuantity() : Quantity`

**Description:** The Quantity returned. This may return an N/A quantity.

**Returns:**

the quantity returned, may be N/A

---

### getReturnNumber

**Signature:** `getReturnNumber() : String`

**Description:** The mandatory returnNumber of the Return to which this item belongs.

**Returns:**

the returnNumber of the Return to which this item belongs

---

### setNote

**Signature:** `setNote(note : String) : void`

**Description:** Sets a note for this return item.

**Parameters:**

- `note`: the note for this return item to set

---

### setParentItem

**Signature:** `setParentItem(parentItem : ReturnItem) : void`

**Description:** Set a parent item. The parent item must belong to the same Return. An infinite parent-child loop is disallowed as is a parent-child depth greater than 10. Setting a parent item indicates a dependency of the child item on the parent item, and can be used to form a parallel structure to that accessed using ProductLineItem.getParent().

**Parameters:**

- `parentItem`: The parent item, null is allowed

---

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

**Description:** Set the reason code. The list of reason codes can be updated by updating meta-data for ReturnItem.

**Parameters:**

- `reasonCode`: the reason code to set

---

### setReturnedQuantity

**Signature:** `setReturnedQuantity(quantity : Quantity) : void`

**Description:** Set the Quantity returned. Passing null results in an exception being thrown. The quantity must be higher than zero and not be higher than the remaining quantity to return. The item prices are recalculated in this method as described in applyPriceRate(Decimal, Decimal, Boolean) with the quantity argument as the factor, and ordered quantity as divisor and true as the roundup parameter.

**Parameters:**

- `quantity`: the quantity returned, null not allowed

**See Also:**

OrderItem.getReturnedQuantity()
ProductLineItem.getQuantity()

---

### setTaxBasis

**Signature:** `setTaxBasis(taxBasis : Money) : void`

**Description:** Set the tax-basis price for this item.

**Parameters:**

- `taxBasis`: the tax basis value.

---

### setTaxItems

**Signature:** `setTaxItems(taxItems : Collection) : void`

**Description:** Set the tax-items for this item.

**Parameters:**

- `taxItems`: items

**See Also:**

addTaxItem(Decimal, TaxGroup)
TaxGroup.create(String, String, String, Decimal)

---