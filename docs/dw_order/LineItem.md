## Package: dw.order

# Class LineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItem

## Description

Common line item base class.

## Properties

### basePrice

**Type:** Money

The base price for the line item, which is the price of the unit before applying adjustments, in the
 purchase currency. The base price may be net or gross of tax depending on the configured taxation policy.

### grossPrice

**Type:** Money

The gross price for the line item, which is the price of the unit before applying adjustments, in the
 purchase currency, including tax.

### lineItemCtnr

**Type:** LineItemCtnr (Read Only)

The line item ctnr of the line item.

### lineItemText

**Type:** String

The display text for the line item.

### netPrice

**Type:** Money

The net price for the line item, which is the price of the unit before applying adjustments, in the
 purchase currency, excluding tax.

### price

**Type:** Money (Read Only)

Get the price of the line item. If the line item is based on net pricing then the net price is returned. If the
 line item is based on gross pricing then the gross price is returned.

### priceValue

**Type:** Number

Return the price amount for the line item. Same as getPrice().getValue().

### tax

**Type:** Money

The tax for the line item, which is the tax of the unit before applying adjustments, in the purchase
 currency.

### taxBasis

**Type:** Money (Read Only)

Get the price used to calculate the tax for this line item.

### taxClassID

**Type:** String

The tax class ID for the line item or null if no tax class ID is associated with the line item. In the
 case where the tax class ID is null, you should use the default tax class ID.

### taxRate

**Type:** Number

The tax rate, which is the decimal tax rate to be applied to the product represented by this line item. A
 value of 0.175 represents a percentage of 17.5%.

## Constructor Summary

## Method Summary

### getBasePrice

**Signature:** `getBasePrice() : Money`

Returns the base price for the line item, which is the price of the unit before applying adjustments, in the purchase currency.

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

Returns the gross price for the line item, which is the price of the unit before applying adjustments, in the purchase currency, including tax.

### getLineItemCtnr

**Signature:** `getLineItemCtnr() : LineItemCtnr`

Returns the line item ctnr of the line item.

### getLineItemText

**Signature:** `getLineItemText() : String`

Returns the display text for the line item.

### getNetPrice

**Signature:** `getNetPrice() : Money`

Returns the net price for the line item, which is the price of the unit before applying adjustments, in the purchase currency, excluding tax.

### getPrice

**Signature:** `getPrice() : Money`

Get the price of the line item.

### getPriceValue

**Signature:** `getPriceValue() : Number`

Return the price amount for the line item.

### getTax

**Signature:** `getTax() : Money`

Returns the tax for the line item, which is the tax of the unit before applying adjustments, in the purchase currency.

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

Get the price used to calculate the tax for this line item.

### getTaxClassID

**Signature:** `getTaxClassID() : String`

Returns the tax class ID for the line item or null if no tax class ID is associated with the line item.

### getTaxRate

**Signature:** `getTaxRate() : Number`

Returns the tax rate, which is the decimal tax rate to be applied to the product represented by this line item.

### setBasePrice

**Signature:** `setBasePrice(aValue : Money) : void`

Sets the base price for the line item, which is the price of the unit before applying adjustments, in the purchase currency.

### setGrossPrice

**Signature:** `setGrossPrice(aValue : Money) : void`

Sets the gross price for the line item, which is the Price of the unit before applying adjustments, in the purchase currency, including tax.

### setLineItemText

**Signature:** `setLineItemText(aText : String) : void`

Sets the display text for the line item.

### setNetPrice

**Signature:** `setNetPrice(aValue : Money) : void`

Sets the value for the net price, which is the price of the unit before applying adjustments, in the purchase currency, excluding tax.

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

Sets price attributes of the line item based on the current purchase currency and taxation policy.

### setTax

**Signature:** `setTax(aValue : Money) : void`

Sets the value for the tax of the line item, which is the the tax of the unit before applying adjustments, in the purchase currency.

### setTaxClassID

**Signature:** `setTaxClassID(aValue : String) : void`

Sets the tax class ID for the line item.

### setTaxRate

**Signature:** `setTaxRate(taxRate : Number) : void`

Sets the tax rate, which is the decimal tax rate to be applied to the product represented by this line item.

### updatePrice

**Signature:** `updatePrice(price : Money) : void`

Updates the price attributes of the line item based on the specified price.

### updateTax

**Signature:** `updateTax(taxRate : Number) : void`

Updates the tax-related attributes of the line item based on the specified tax rate, a tax basis determined by the system and the "Tax Rounding Mode" order preference.

### updateTax

**Signature:** `updateTax(taxRate : Number, taxBasis : Money) : void`

Updates the tax-related attributes of the line item based on the specified tax rate, the passed tax basis and the "Tax Rounding Mode" order preference.

### updateTaxAmount

**Signature:** `updateTaxAmount(tax : Money) : void`

Updates tax amount of the line item setting the provided value.

## Method Detail

## Method Details

### getBasePrice

**Signature:** `getBasePrice() : Money`

**Description:** Returns the base price for the line item, which is the price of the unit before applying adjustments, in the purchase currency. The base price may be net or gross of tax depending on the configured taxation policy.

**Returns:**

the base price for the line item.

---

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

**Description:** Returns the gross price for the line item, which is the price of the unit before applying adjustments, in the purchase currency, including tax.

**Returns:**

the value of the gross price.

---

### getLineItemCtnr

**Signature:** `getLineItemCtnr() : LineItemCtnr`

**Description:** Returns the line item ctnr of the line item.

**Returns:**

Line item ctnr of the line item

---

### getLineItemText

**Signature:** `getLineItemText() : String`

**Description:** Returns the display text for the line item.

**Returns:**

the display text.

---

### getNetPrice

**Signature:** `getNetPrice() : Money`

**Description:** Returns the net price for the line item, which is the price of the unit before applying adjustments, in the purchase currency, excluding tax.

**Returns:**

the value for the net price.

---

### getPrice

**Signature:** `getPrice() : Money`

**Description:** Get the price of the line item. If the line item is based on net pricing then the net price is returned. If the line item is based on gross pricing then the gross price is returned.

**Returns:**

either the net or the gross price

---

### getPriceValue

**Signature:** `getPriceValue() : Number`

**Description:** Return the price amount for the line item. Same as getPrice().getValue().

**Returns:**

the price for the line item

---

### getTax

**Signature:** `getTax() : Money`

**Description:** Returns the tax for the line item, which is the tax of the unit before applying adjustments, in the purchase currency.

**Returns:**

the tax for the line item.

---

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

**Description:** Get the price used to calculate the tax for this line item.

**Returns:**

The tax basis used to calculate tax for this line item, or Money.NOT_AVAILABLE if tax has not been set for this line item yet.

---

### getTaxClassID

**Signature:** `getTaxClassID() : String`

**Description:** Returns the tax class ID for the line item or null if no tax class ID is associated with the line item. In the case where the tax class ID is null, you should use the default tax class ID.

**Returns:**

the tax class ID for the line item or null if no tax class ID is associated with the line item.

**See Also:**

TaxMgr.getDefaultTaxClassID()

---

### getTaxRate

**Signature:** `getTaxRate() : Number`

**Description:** Returns the tax rate, which is the decimal tax rate to be applied to the product represented by this line item. A value of 0.175 represents a percentage of 17.5%.

**Returns:**

the value of the tax rate.

---

### setBasePrice

**Signature:** `setBasePrice(aValue : Money) : void`

**Description:** Sets the base price for the line item, which is the price of the unit before applying adjustments, in the purchase currency. The base price may be net or gross of tax depending on the configured taxation policy.

**Deprecated:**

Use updatePrice(Money) instead.

**Parameters:**

- `aValue`: the new value of the base price.

---

### setGrossPrice

**Signature:** `setGrossPrice(aValue : Money) : void`

**Description:** Sets the gross price for the line item, which is the Price of the unit before applying adjustments, in the purchase currency, including tax.

**Deprecated:**

Use updatePrice(Money) which sets the base price and also the gross price if the line item is based on gross pricing.

**Parameters:**

- `aValue`: the new value of the attribute

---

### setLineItemText

**Signature:** `setLineItemText(aText : String) : void`

**Description:** Sets the display text for the line item.

**Parameters:**

- `aText`: line item text.

---

### setNetPrice

**Signature:** `setNetPrice(aValue : Money) : void`

**Description:** Sets the value for the net price, which is the price of the unit before applying adjustments, in the purchase currency, excluding tax.

**Deprecated:**

Use updatePrice(Money) which sets the base price and also the net price if the line item is based on net pricing.

**Parameters:**

- `aValue`: the new value for the net price

---

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

**Description:** Sets price attributes of the line item based on the current purchase currency and taxation policy. The methods sets the 'basePrice' attribute of the line item. Additionally, it sets the 'netPrice' attribute of the line item if the current taxation policy is 'net', and the 'grossPrice' attribute, if the current taxation policy is 'gross'. If null is specified as value, the price attributes are reset to Money.NOT_AVAILABLE.

**Parameters:**

- `value`: Price value or null

---

### setTax

**Signature:** `setTax(aValue : Money) : void`

**Description:** Sets the value for the tax of the line item, which is the the tax of the unit before applying adjustments, in the purchase currency.

**Parameters:**

- `aValue`: the new value for the tax.

---

### setTaxClassID

**Signature:** `setTaxClassID(aValue : String) : void`

**Description:** Sets the tax class ID for the line item.

**Parameters:**

- `aValue`: the tax class ID for the line item.

---

### setTaxRate

**Signature:** `setTaxRate(taxRate : Number) : void`

**Description:** Sets the tax rate, which is the decimal tax rate to be applied to the product represented by this line item. A value of 0.175 represents a percentage of 17.5%.

**Parameters:**

- `taxRate`: the new value for the tax rate.

---

### updatePrice

**Signature:** `updatePrice(price : Money) : void`

**Description:** Updates the price attributes of the line item based on the specified price. The base price is set to the specified value. If the line item is based on net pricing then the net price attribute is set. If the line item is based on gross pricing then the gross price attribute is set. Whether or not a line item is based on net or gross pricing is a site-wide configuration parameter.

**Deprecated:**

Use setPriceValue(Number) instead.

**Parameters:**

- `price`: The price to use when performing the update. This price must not be null and must either be equal to NOT_AVAIALBLE or must have a currency code equal to that of the parent container.

---

### updateTax

**Signature:** `updateTax(taxRate : Number) : void`

**Description:** Updates the tax-related attributes of the line item based on the specified tax rate, a tax basis determined by the system and the "Tax Rounding Mode" order preference. This method sets the tax basis as an attribute, and is not affected by the previous value of this attribute. The value used as a basis depends on the type of line item this is and on the promotion preferences for the current site. If you tax products, shipping, and discounts based on price (default), then the tax basis will simply be equal to getPrice(). If you tax products and shipping only based on adjusted price, then the tax basis depends upon line item type as follows: ProductLineItem: basis equals ProductLineItem.getProratedPrice(). ShippingLineItem: basis equals ShippingLineItem.getAdjustedPrice(). ProductShippingLineItem: basis equals ProductShippingLineItem.getAdjustedPrice(). PriceAdjustment: basis equals 0.00. All other line item types: basis equals getPrice(). If null is passed as tax rate, tax-related attribute fields are set to N/A.

**Parameters:**

- `taxRate`: taxRate the tax rate to use or null.

---

### updateTax

**Signature:** `updateTax(taxRate : Number, taxBasis : Money) : void`

**Description:** Updates the tax-related attributes of the line item based on the specified tax rate, the passed tax basis and the "Tax Rounding Mode" order preference. If null is passed as tax rate or tax basis, tax-related attribute fields are set to N/A.

**Parameters:**

- `taxRate`: the tax rate to use or null.
- `taxBasis`: the tax basis to use or null.

---

### updateTaxAmount

**Signature:** `updateTaxAmount(tax : Money) : void`

**Description:** Updates tax amount of the line item setting the provided value. Depending on the way how the tax is calculated (based on net or gross price), the corresponding gross or net price is updated accordingly. For tax calculation based on net price, the gross price is calculated by adding the tax to the net price. For tax calculation based on gross price, the net price is calculated by subtracting the tax from the gross price. If null is passed as tax amount, the item tax and resulting net or gross price are set to N/A. Note that tax rate is not calculated and it is not updated.

**Parameters:**

- `tax`: the tax amount of the line item to set

---