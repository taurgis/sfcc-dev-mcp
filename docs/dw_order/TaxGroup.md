## Package: dw.order

# Class TaxGroup

## Inheritance Hierarchy

- Object
  - dw.order.TaxGroup

## Description

Contains the formal definition of a tax including a type (it's just the key), a percentage value if provided, a caption and a description.

## Properties

### caption

**Type:** String (Read Only)

Gets the caption.

### description

**Type:** String (Read Only)

Gets the description.

### rate

**Type:** Number (Read Only)

Gets the percentage amount of the rate.

### taxType

**Type:** String (Read Only)

Gets the tax type.

## Constructor Summary

## Method Summary

### create

**Signature:** `static create(taxType : String, caption : String, description : String, taxRate : Decimal) : TaxGroup`

Creates a TaxGroup.

### getCaption

**Signature:** `getCaption() : String`

Gets the caption.

### getDescription

**Signature:** `getDescription() : String`

Gets the description.

### getRate

**Signature:** `getRate() : Number`

Gets the percentage amount of the rate.

### getTaxType

**Signature:** `getTaxType() : String`

Gets the tax type.

## Method Detail

## Method Details

### create

**Signature:** `static create(taxType : String, caption : String, description : String, taxRate : Decimal) : TaxGroup`

**Description:** Creates a TaxGroup. This TaxGroup can be used for example in ReturnItem.addTaxItem(Decimal, TaxGroup).

**Parameters:**

- `taxType`: the tax type
- `caption`: the caption
- `description`: the description
- `taxRate`: the tax rate as floating point. 1.0 means 100 %.

**Returns:**

the tax group

---

### getCaption

**Signature:** `getCaption() : String`

**Description:** Gets the caption.

**Returns:**

the caption

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Gets the description.

**Returns:**

the description

---

### getRate

**Signature:** `getRate() : Number`

**Description:** Gets the percentage amount of the rate.

**Returns:**

the tax rate percentage value

---

### getTaxType

**Signature:** `getTaxType() : String`

**Description:** Gets the tax type.

**Returns:**

the tax type

---