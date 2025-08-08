## Package: dw.order

# Class TrackingInfo

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.TrackingInfo

## Description

Provides basic information about a tracking info. An instance is identified by an ID and can be referenced from n ShippingOrderItems using TrackingRefs. This also allows one ShippingOrderItem to be associated with n TrackingInfo.

## Properties

### carrier

**Type:** String

Get the Carrier.

### carrierService

**Type:** String

Get the service(ship method) of the used carrier.

### ID

**Type:** String (Read Only)

Get the mandatory identifier for this tracking information. The id allows the tracking information to be referenced from
 TrackingRefs. To support short shipping a shipping-order-item can manage a list of
 TrackingRefs, each with an optional quantity value allowing individual items to ship in multiple
 parcels with known item quantity in each.

### shipDate

**Type:** Date

Get the ship date.

### shippingOrder

**Type:** ShippingOrder (Read Only)

Gets the shipping order.

### trackingNumber

**Type:** String

Get the tracking number.

### trackingRefs

**Type:** Collection (Read Only)

Gets the tracking refs (shipping order items) which are assigned to this tracking info.

### warehouseID

**Type:** String

Get the id of the shipping warehouse.

## Constructor Summary

## Method Summary

### getCarrier

**Signature:** `getCarrier() : String`

Get the Carrier.

### getCarrierService

**Signature:** `getCarrierService() : String`

Get the service(ship method) of the used carrier.

### getID

**Signature:** `getID() : String`

Get the mandatory identifier for this tracking information.

### getShipDate

**Signature:** `getShipDate() : Date`

Get the ship date.

### getShippingOrder

**Signature:** `getShippingOrder() : ShippingOrder`

Gets the shipping order.

### getTrackingNumber

**Signature:** `getTrackingNumber() : String`

Get the tracking number.

### getTrackingRefs

**Signature:** `getTrackingRefs() : Collection`

Gets the tracking refs (shipping order items) which are assigned to this tracking info.

### getWarehouseID

**Signature:** `getWarehouseID() : String`

Get the id of the shipping warehouse.

### setCarrier

**Signature:** `setCarrier(carrier : String) : void`

Set the Carrier.

### setCarrierService

**Signature:** `setCarrierService(carrierService : String) : void`

Set the service(ship method) of the used carrier.

### setShipDate

**Signature:** `setShipDate(shipDate : Date) : void`

Set the ship date.

### setTrackingNumber

**Signature:** `setTrackingNumber(trackingNumber : String) : void`

Set the TrackingNumber.

### setWarehouseID

**Signature:** `setWarehouseID(warehouseID : String) : void`

Set the id of the shipping warehouse.

## Method Detail

## Method Details

### getCarrier

**Signature:** `getCarrier() : String`

**Description:** Get the Carrier.

**Returns:**

the Carrier

---

### getCarrierService

**Signature:** `getCarrierService() : String`

**Description:** Get the service(ship method) of the used carrier.

**Returns:**

the carrier service (ship method)

---

### getID

**Signature:** `getID() : String`

**Description:** Get the mandatory identifier for this tracking information. The id allows the tracking information to be referenced from TrackingRefs. To support short shipping a shipping-order-item can manage a list of TrackingRefs, each with an optional quantity value allowing individual items to ship in multiple parcels with known item quantity in each.

**Returns:**

the id

**See Also:**

ShippingOrder.addTrackingInfo(String)

---

### getShipDate

**Signature:** `getShipDate() : Date`

**Description:** Get the ship date.

**Returns:**

the ship date

---

### getShippingOrder

**Signature:** `getShippingOrder() : ShippingOrder`

**Description:** Gets the shipping order.

**Returns:**

the shipping order

---

### getTrackingNumber

**Signature:** `getTrackingNumber() : String`

**Description:** Get the tracking number.

**Returns:**

the TrackingNumber

---

### getTrackingRefs

**Signature:** `getTrackingRefs() : Collection`

**Description:** Gets the tracking refs (shipping order items) which are assigned to this tracking info.

**Returns:**

the tracking refs (shipping order items) which are assigned to this tracking info.

---

### getWarehouseID

**Signature:** `getWarehouseID() : String`

**Description:** Get the id of the shipping warehouse.

**Returns:**

the id of the shipping warehouse

---

### setCarrier

**Signature:** `setCarrier(carrier : String) : void`

**Description:** Set the Carrier.

**Parameters:**

- `carrier`: the Carrier

---

### setCarrierService

**Signature:** `setCarrierService(carrierService : String) : void`

**Description:** Set the service(ship method) of the used carrier.

**Parameters:**

- `carrierService`: the carrier service, eg. the ship method

---

### setShipDate

**Signature:** `setShipDate(shipDate : Date) : void`

**Description:** Set the ship date.

**Parameters:**

- `shipDate`: the ship date

---

### setTrackingNumber

**Signature:** `setTrackingNumber(trackingNumber : String) : void`

**Description:** Set the TrackingNumber.

**Parameters:**

- `trackingNumber`: the TrackingNumber

---

### setWarehouseID

**Signature:** `setWarehouseID(warehouseID : String) : void`

**Description:** Set the id of the shipping warehouse.

**Parameters:**

- `warehouseID`: the id of the shipping warehouse

---