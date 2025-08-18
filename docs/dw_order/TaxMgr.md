## Package: dw.order

# Class TaxMgr

## Inheritance Hierarchy

- Object
  - dw.order.TaxMgr

## Description

Provides methods to access the tax table.

## Constants

### TAX_POLICY_GROSS

**Type:** Number = 0

Constant representing the gross taxation policy.

### TAX_POLICY_NET

**Type:** Number = 1

Constant representing the net taxation policy.

## Properties

### customRateTaxClassID

**Type:** String (Read Only)

The ID of the tax class that represents items with a custom tax rate. The standard order calculation
 process assumes that such line items are initialized with a tax rate and a being ignored during the tax rate
 lookup sequence of the calculation process.
 
 Note that this tax class does not appear in the Business Manager tax module.

### defaultTaxClassID

**Type:** String (Read Only)

The ID of the default tax class defined for the site. This class might be used in case a product or
 service does not define a tax class. 
 If no default tax class is defined, the method returns null.

### defaultTaxJurisdictionID

**Type:** String (Read Only)

The ID of the default tax jurisdiction defined for the site. This jurisdiction might be used in case no
 jurisdiction is defined for a specific address. 
 If no default tax jurisdiction is defined, this method returns null.

### taxationPolicy

**Type:** Number (Read Only)

The taxation policy (net/gross) configured for the current site.

### taxExemptTaxClassID

**Type:** String (Read Only)

The ID of the tax class that represents tax exempt items. The tax manager will return a tax rate of 0.0
 for this tax class.
 
 Note that this tax class does not appear in the Business Manager tax module.

## Constructor Summary

## Method Summary

### applyExternalTax

**Signature:** `static applyExternalTax(basket : Basket) : void`

Applies externally set tax rates to the given Basket.

### getCustomRateTaxClassID

**Signature:** `static getCustomRateTaxClassID() : String`

Returns the ID of the tax class that represents items with a custom tax rate.

### getDefaultTaxClassID

**Signature:** `static getDefaultTaxClassID() : String`

Returns the ID of the default tax class defined for the site.

### getDefaultTaxJurisdictionID

**Signature:** `static getDefaultTaxJurisdictionID() : String`

Returns the ID of the default tax jurisdiction defined for the site.

### getTaxationPolicy

**Signature:** `static getTaxationPolicy() : Number`

Returns the taxation policy (net/gross) configured for the current site.

### getTaxExemptTaxClassID

**Signature:** `static getTaxExemptTaxClassID() : String`

Returns the ID of the tax class that represents tax exempt items.

### getTaxJurisdictionID

**Signature:** `static getTaxJurisdictionID(location : ShippingLocation) : String`

Returns the ID of the tax jurisdiction for the specified address.

### getTaxRate

**Signature:** `static getTaxRate(taxClassID : String, taxJurisdictionID : String) : Number`

Returns the tax rate defined for the specified combination of tax class and tax jurisdiction.

## Method Detail

## Method Details

### applyExternalTax

**Signature:** `static applyExternalTax(basket : Basket) : void`

**Description:** Applies externally set tax rates to the given Basket. Only use when LineItemCtnr.isExternallyTaxed() returns true. Note: a basket can only be created in EXTERNAL tax mode using SCAPI. Typical usage in tax calculation: var TaxMgr = require('dw/order/TaxMgr'); calculateTaxes: function () { Basket basket = BasketMgr.getCurrentBasket(); if ( basket.isExternallyTaxed() ) { TaxMgr.applyExternalTaxation( basket ); } else { // calculation with tax tables or customization } }

**Parameters:**

- `basket`: apply external taxation to this basket

---

### getCustomRateTaxClassID

**Signature:** `static getCustomRateTaxClassID() : String`

**Description:** Returns the ID of the tax class that represents items with a custom tax rate. The standard order calculation process assumes that such line items are initialized with a tax rate and a being ignored during the tax rate lookup sequence of the calculation process. Note that this tax class does not appear in the Business Manager tax module.

---

### getDefaultTaxClassID

**Signature:** `static getDefaultTaxClassID() : String`

**Description:** Returns the ID of the default tax class defined for the site. This class might be used in case a product or service does not define a tax class. If no default tax class is defined, the method returns null.

**Returns:**

the ID of the default tax class defined for the site or null.

---

### getDefaultTaxJurisdictionID

**Signature:** `static getDefaultTaxJurisdictionID() : String`

**Description:** Returns the ID of the default tax jurisdiction defined for the site. This jurisdiction might be used in case no jurisdiction is defined for a specific address. If no default tax jurisdiction is defined, this method returns null.

**Returns:**

the ID of the default tax jurisdiction defined for the site or null.

---

### getTaxationPolicy

**Signature:** `static getTaxationPolicy() : Number`

**Description:** Returns the taxation policy (net/gross) configured for the current site.

**Returns:**

Taxation policy configured for current site

**See Also:**

TAX_POLICY_GROSS
TAX_POLICY_NET

---

### getTaxExemptTaxClassID

**Signature:** `static getTaxExemptTaxClassID() : String`

**Description:** Returns the ID of the tax class that represents tax exempt items. The tax manager will return a tax rate of 0.0 for this tax class. Note that this tax class does not appear in the Business Manager tax module.

---

### getTaxJurisdictionID

**Signature:** `static getTaxJurisdictionID(location : ShippingLocation) : String`

**Description:** Returns the ID of the tax jurisdiction for the specified address. If no tax jurisdiction defined for the site matches the specified address, this method returns null.

**Parameters:**

- `location`: The shipping location

**Returns:**

the ID of the tax jurisdiction for the specified address or null.

---

### getTaxRate

**Signature:** `static getTaxRate(taxClassID : String, taxJurisdictionID : String) : Number`

**Description:** Returns the tax rate defined for the specified combination of tax class and tax jurisdiction. Method returns null if no tax rate is defined. Method returns 0.0 of 'nontaxable' tax rate is specified (see method 'getNontaxableTaxClassID'.

**Parameters:**

- `taxClassID`: ID of the tax class
- `taxJurisdictionID`: ID of tax jusrisdiction

**Returns:**

the tax rate defined for the specified combination of tax class and tax jurisdiction.

---