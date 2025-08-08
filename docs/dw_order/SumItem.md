## Package: dw.order

# Class SumItem

## Inheritance Hierarchy

- Object
  - dw.order.SumItem

## Description

Container used to represent an subtotal or grandtotal item which contains various prices and a tax breakdown held in a collection of tax-items. Usage example: var invoice : Invoice = ...; var productNet = invoice.productSubTotal.netPrice; var serviceNet = invoice.serviceSubTotal.netPrice; var grandNet = invoice.grandTotal.netPrice; var grandTax = invoice.grandTotal.tax; var grandGross = invoice.grandTotal.grossPrice; # tax breakdown for each(taxItem : TaxItem in invoice.grandTotal.taxItems) { var tax : Money = taxItem.amount; var taxGroup : TaxGroup = taxItem.taxGroup; var rate : Double = taxGroup.rate; var caption :String = taxGroup.caption; var taxType :String = taxGroup.taxType; }

## Properties

### grossPrice

**Type:** Money (Read Only)

Gross price of SumItem.

### netPrice

**Type:** Money (Read Only)

Net price of SumItem.

### tax

**Type:** Money (Read Only)

Total tax for SumItem.

### taxBasis

**Type:** Money (Read Only)

Price of entire SumItem on which tax calculation is based. Same as getNetPrice()
 or getGrossPrice() depending on whether the order is based on net or gross prices.

### taxItems

**Type:** Collection (Read Only)

Tax items representing a tax breakdown for the SumItem.

## Constructor Summary

## Method Summary

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

Gross price of SumItem.

### getNetPrice

**Signature:** `getNetPrice() : Money`

Net price of SumItem.

### getTax

**Signature:** `getTax() : Money`

Total tax for SumItem.

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

Price of entire SumItem on which tax calculation is based.

### getTaxItems

**Signature:** `getTaxItems() : Collection`

Tax items representing a tax breakdown for the SumItem.

## Method Detail

## Method Details

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

**Description:** Gross price of SumItem.

**Returns:**

Gross price of SumItem.

---

### getNetPrice

**Signature:** `getNetPrice() : Money`

**Description:** Net price of SumItem.

**Returns:**

Net price of SumItem.

---

### getTax

**Signature:** `getTax() : Money`

**Description:** Total tax for SumItem.

**Returns:**

Total tax for SumItem.

---

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

**Description:** Price of entire SumItem on which tax calculation is based. Same as getNetPrice() or getGrossPrice() depending on whether the order is based on net or gross prices.

**Returns:**

Price of entire item on which tax calculation is based

---

### getTaxItems

**Signature:** `getTaxItems() : Collection`

**Description:** Tax items representing a tax breakdown for the SumItem.

**Returns:**

tax items representing a tax breakdown for the SumItem

**See Also:**

TaxItem

---