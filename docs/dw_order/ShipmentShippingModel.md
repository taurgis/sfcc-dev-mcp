## Package: dw.order

# Class ShipmentShippingModel

## Inheritance Hierarchy

- Object
  - dw.order.ShipmentShippingModel

## Description

Instances of ShipmentShippingModel provide access to shipment-level shipping information, such as applicable and inapplicable shipping methods and shipping cost. Use ShippingMgr.getShipmentShippingModel(Shipment) to get the shipping model for a specific shipment.

## Properties

### applicableShippingMethods

**Type:** Collection (Read Only)

The active applicable shipping methods for the shipment related
 to this shipping model. A shipping method is applicable for a shipment
 if it does not exclude any of the products in the shipment, and does
 not exclude the shipment's shipping address, if this is set. Also checks
 that the the shipment customer belongs to an assigned customer group of the shipment
 (if any are assigned).

### inapplicableShippingMethods

**Type:** Collection (Read Only)

The active inapplicable shipping methods for the shipment related
 to this shipping model. A shipping method is inapplicable for a shipment
 if it is inapplicable for at least one product contained in the
 shipment, or the shipping address is excluded by the shipping method, or the
 shipping method is restricted to customer groups that the shipment customer
 is not a part of.

## Constructor Summary

## Method Summary

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods() : Collection`

Returns the active applicable shipping methods for the shipment related to this shipping model.

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods(shippingAddressObj : Object) : Collection`

Returns the active applicable shipping methods for the shipment related to this shipping model and the specified shipping address.

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods() : Collection`

Returns the active inapplicable shipping methods for the shipment related to this shipping model.

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods(shippingAddressObj : Object) : Collection`

Returns the active inapplicable shipping methods for the shipment related to this shipping model and the specified shipping address.

### getShippingCost

**Signature:** `getShippingCost(shippingMethod : ShippingMethod) : ShipmentShippingCost`

Returns the shipping cost object for the related shipment and the specified shipping method.

## Method Detail

## Method Details

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods() : Collection`

**Description:** Returns the active applicable shipping methods for the shipment related to this shipping model. A shipping method is applicable for a shipment if it does not exclude any of the products in the shipment, and does not exclude the shipment's shipping address, if this is set. Also checks that the the shipment customer belongs to an assigned customer group of the shipment (if any are assigned).

**Returns:**

Applicable shipping methods for the shipment

---

### getApplicableShippingMethods

**Signature:** `getApplicableShippingMethods(shippingAddressObj : Object) : Collection`

**Description:** Returns the active applicable shipping methods for the shipment related to this shipping model and the specified shipping address. A shipping method is applicable if it does not exclude any of the products in the shipment, it does not exclude the specified shipping address, and the shipment customer belongs to an assigned customer group for the shipment (if any are assigned). The parameter shippingAddressObj must be a JavaScript literal with the same properties as an OrderAddress object, or alternatively a Map. For example: model.getApplicableShippingMethods ( { countryCode: "US", stateCode: "MA, custom { POBox : true } } ) This method is useful when it is needed to retrieve the list of applicable shipping methods for an address before the address is saved to the shipment.

**Parameters:**

- `shippingAddressObj`: A JavaScript object representing an order address, must not be null.

**Returns:**

Applicable shipping methods for the shipment

---

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods() : Collection`

**Description:** Returns the active inapplicable shipping methods for the shipment related to this shipping model. A shipping method is inapplicable for a shipment if it is inapplicable for at least one product contained in the shipment, or the shipping address is excluded by the shipping method, or the shipping method is restricted to customer groups that the shipment customer is not a part of.

**Returns:**

Inapplicable shipping methods for the shipment

---

### getInapplicableShippingMethods

**Signature:** `getInapplicableShippingMethods(shippingAddressObj : Object) : Collection`

**Description:** Returns the active inapplicable shipping methods for the shipment related to this shipping model and the specified shipping address. A shipping method is inapplicable if it is inapplicable for at least one product contained in the shipment, or the specified shipping address is excluded by the shipping method, or the shipping method is restricted to customer groups that the shipment customer is not a part of. The parameter shippingAddressObj must be a JavaScript literal with the same properties as an OrderAddress object, or alternatively a Map. For example: model.getApplicableShippingMethods ( { countryCode: "US", stateCode: "MA, custom { POBox : true } } ) This method is useful when it is needed to retrieve the list of applicable shipping methods for an address before the address is saved to the shipment.

**Parameters:**

- `shippingAddressObj`: A JavaScript object representing an order address.

**Returns:**

Inapplicable shipping methods for the shipment

---

### getShippingCost

**Signature:** `getShippingCost(shippingMethod : ShippingMethod) : ShipmentShippingCost`

**Description:** Returns the shipping cost object for the related shipment and the specified shipping method. Shipping cost for shipments depended on the merchandise total of the shipment. The method uses the adjusted merchandise total after product and order discounts, and excluding products with product-level fixed-price shipping cost.

**Parameters:**

- `shippingMethod`: the shipping method to use.

**Returns:**

Product shipping cost

---