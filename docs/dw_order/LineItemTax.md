## Package: dw.order

# Class LineItemTax

## Inheritance Hierarchy

- Object
  - dw.order.LineItemTax

## Description

A tax on a line item: tax identifier, rate, and optional amount. Use with LineItem.setTaxes(Collection) and LineItem.getTaxes(). Create instances via new LineItemTax(taxId, taxRate) to have the server compute the tax value, or via new LineItemTax(taxId, taxRate, taxValue) to provide a pre-computed tax value. Access is currently restricted to select pilot customers and controlled via feature toggle.

## Properties

### taxId

**Type:** String (Read Only)

Gets the tax identifier (e.g. "DE_7").

### taxRate

**Type:** Number (Read Only)

Gets the tax rate as a decimal (e.g. 0.07 for 7%).

### taxValue

**Type:** Money (Read Only)

Gets the tax value (amount) in purchase currency, or null if computed from rate and tax basis.

## Constructor Summary

LineItemTax(taxId : String, taxRate : Number) Creates a tax item for use with LineItem.setTaxes(Collection).

LineItemTax(taxId : String, taxRate : Number, taxValue : Money) Creates a tax item for use with LineItem.setTaxes(Collection).

## Method Summary

### getTaxId

**Signature:** `getTaxId() : String`

Gets the tax identifier (e.g.

### getTaxRate

**Signature:** `getTaxRate() : Number`

Gets the tax rate as a decimal (e.g.

### getTaxValue

**Signature:** `getTaxValue() : Money`

Gets the tax value (amount) in purchase currency, or null if computed from rate and tax basis.

## Constructor Detail

## Method Detail

## Method Details

### getTaxId

**Signature:** `getTaxId() : String`

**Description:** Gets the tax identifier (e.g. "DE_7").

**Returns:**

the tax id

---

### getTaxRate

**Signature:** `getTaxRate() : Number`

**Description:** Gets the tax rate as a decimal (e.g. 0.07 for 7%).

**Returns:**

the tax rate

---

### getTaxValue

**Signature:** `getTaxValue() : Money`

**Description:** Gets the tax value (amount) in purchase currency, or null if computed from rate and tax basis.

**Returns:**

the tax value as Money, or null

---