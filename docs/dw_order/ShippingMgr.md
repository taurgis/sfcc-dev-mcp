## Package: dw.order

# Class ShippingMgr

## Inheritance Hierarchy

- Object
  - dw.order.ShippingMgr

## Description

Provides methods to access the shipping information.

## Properties

### allShippingMethods

**Type:** Collection (Read Only)

The active shipping methods of the current site applicable to the session currency and current customer group.

### defaultShippingMethod

**Type:** ShippingMethod (Read Only)

The default shipping method of the current site applicable to the session currency.

 Does an additional check if there is a base method and if their currencies are
 the same. Returns NULL if the two currencies are different.

## Constructor Summary

## Method Summary

### applyShippingCost

**Signature:** `static applyShippingCost(lineItemCtnr : LineItemCtnr) : void`

Applies product and shipment-level shipping cost to the specified line item container.

### getAllShippingMethods

**Signature:** `static getAllShippingMethods() : Collection`

Returns the active shipping methods of the current site applicable to the session currency and current customer group.

### getDefaultShippingMethod

**Signature:** `static getDefaultShippingMethod() : ShippingMethod`

Returns the default shipping method of the current site applicable to the session currency.

### getProductShippingModel

**Signature:** `static getProductShippingModel(product : Product) : ProductShippingModel`

Returns the shipping model for the specified product.

### getShipmentShippingModel

**Signature:** `static getShipmentShippingModel(shipment : Shipment) : ShipmentShippingModel`

Returns the shipping model for the specified shipment.

### getShippingCost

**Signature:** `static getShippingCost(shippingMethod : ShippingMethod, orderValue : Money) : Money`

Returns the shipping cost amount for the specified shipping method and the specified order value.

## Method Detail

## Method Details

### applyShippingCost

**Signature:** `static applyShippingCost(lineItemCtnr : LineItemCtnr) : void`

**Description:** Applies product and shipment-level shipping cost to the specified line item container. For each product line item in the specified line item container, a product shipping line item is created if product-level shipping cost is defined for the product. If no product-level shipping cost is defined for the product, an existing product shipping line item is removed. For each shipment in the specified line item container, shipment-level shipping cost is calculated. This cost is determined based on the merchandise total of the shipment after all product and order discounts. Only products without or with surcharge product-specific shipping cost count towards this merchandise total. Products with fixed product-specific shipping cost don't count towards the merchandise total used to calculate shipment-level shipping cost. The calculated shipping cost is set at the standard shipping line item of the shipment. If 'net' taxation is configured for the site, the merchandise total before tax is used. If 'gross' taxation is configured for the site, the merchandise total after tax is used. If no shipping method is set for a shipment, neither product nor shipment-level shipping cost can be calculated. In this case, the amount of the standard shipment shipping line item will be set to N/A, and shipping line items of product line items in this shipment will be removed from the line item container. Special cases for product-level shipping cost: if a product is member of multiple shipping cost groups, the lowest shipping cost takes precedence if fixed and surcharge shipping cost is defined for a product, the fixed cost takes precedence shipping cost defined for a master product is also defined for all variants of this master shipping cost is not applied to bundled product line items or options line items

**Parameters:**

- `lineItemCtnr`: the line item container to use.

---

### getAllShippingMethods

**Signature:** `static getAllShippingMethods() : Collection`

**Description:** Returns the active shipping methods of the current site applicable to the session currency and current customer group.

**Returns:**

the active shipping methods of the current site applicable to the session currency and current customer group.

---

### getDefaultShippingMethod

**Signature:** `static getDefaultShippingMethod() : ShippingMethod`

**Description:** Returns the default shipping method of the current site applicable to the session currency. Does an additional check if there is a base method and if their currencies are the same. Returns NULL if the two currencies are different.

**Returns:**

the default shipping method of the current site applicable to the session currency or null.

---

### getProductShippingModel

**Signature:** `static getProductShippingModel(product : Product) : ProductShippingModel`

**Description:** Returns the shipping model for the specified product.

**Parameters:**

- `product`: Product

**Returns:**

Shipping model for specified product

---

### getShipmentShippingModel

**Signature:** `static getShipmentShippingModel(shipment : Shipment) : ShipmentShippingModel`

**Description:** Returns the shipping model for the specified shipment.

**Parameters:**

- `shipment`: the shipment to use.

**Returns:**

Shipping model for specified product

---

### getShippingCost

**Signature:** `static getShippingCost(shippingMethod : ShippingMethod, orderValue : Money) : Money`

**Description:** Returns the shipping cost amount for the specified shipping method and the specified order value. If shipping cost cannot be calculated for any reason, Money.NA is returned.

**Parameters:**

- `shippingMethod`: Selected shipping method
- `orderValue`: Order value

**Returns:**

Shipping cost

---