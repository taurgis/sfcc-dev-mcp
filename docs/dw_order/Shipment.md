## Package: dw.order

# Class Shipment

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.Shipment

## Description

Represents an order shipment.

## Constants

## Properties

### adjustedMerchandizeTotalGrossPrice

**Type:** Money (Read Only)

The adjusted total gross price, including tax, in the purchase currency. The adjusted total gross price
 represents the sum of product prices and adjustments including tax, excluding services.

### adjustedMerchandizeTotalNetPrice

**Type:** Money (Read Only)

The adjusted net price, excluding tax, in the purchase currency. The adjusted net price represents the
 the sum of product prices and adjustments, excluding services and tax.

### adjustedMerchandizeTotalPrice

**Type:** Money (Read Only)

The product total price after all product discounts. If the line item container is based on net pricing
 the adjusted product total net price is returned. If the line item container is based on gross pricing the
 adjusted product total gross price is returned.

### adjustedMerchandizeTotalTax

**Type:** Money (Read Only)

The total adjusted product tax in the purchase currency. The total adjusted product tax represents the
 tax on products and adjustments, excluding services.

### adjustedShippingTotalGrossPrice

**Type:** Money (Read Only)

The adjusted sum of all shipping line items of the shipment, including shipping adjustuments and tax

### adjustedShippingTotalNetPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the shipment, including shipping adjustments, excluding tax.

### adjustedShippingTotalPrice

**Type:** Money (Read Only)

The adjusted shipping total price. If the line item container is based on net pricing the adjusted
 shipping total net price is returned. If the line item container is based on gross pricing the adjusted shipping
 total gross price is returned.

### adjustedShippingTotalTax

**Type:** Money (Read Only)

The tax of all shipping line items of the shipment , including shipping adjustments.

### allLineItems

**Type:** Collection (Read Only)

All line items related to the shipment.
 
 The returned collection may include line items of the following types:
 
 ProductLineItem
 ShippingLineItem
 GiftCertificateLineItem
 PriceAdjustment
 
 Their common type is LineItem.
 
 Each ProductLineItem in the collection may itself contain bundled or option product line items,
 as well as a product-level shipping line item.

### default

**Type:** boolean (Read Only)

Return true if this shipment is the default shipment (shipment ID "me").

### gift

**Type:** boolean

Returns true if this line item represents a gift, false otherwise.

### giftCertificateLineItems

**Type:** Collection (Read Only)

All gift certificate line items of the shipment.

### giftMessage

**Type:** String

The value set for gift message or null if no value set.

### ID

**Type:** String (Read Only)

The ID of this shipment ("me" for the default shipment).

### merchandizeTotalGrossPrice

**Type:** Money (Read Only)

The gross product subtotal in the purchase currency. The gross product subtotal represents the sum of
 product prices including tax, excluding services and adjustments.

### merchandizeTotalNetPrice

**Type:** Money (Read Only)

The net product subtotal, excluding tax, in the purchase currency. The net product subtotal represents
 the sum of product prices, excluding services, adjustments, and tax.

### merchandizeTotalPrice

**Type:** Money (Read Only)

The product total price. If the line item container is based on net pricing the product total net
 price is returned. If the line item container is based on gross pricing the product total gross price is
 returned.

### merchandizeTotalPriceAdjustments

**Type:** Collection (Read Only)

A collection of price adjustments that have been applied to the totals, such as a promotion on the
 purchase value (i.e. $10 Off or 10% Off).

### merchandizeTotalTax

**Type:** Money (Read Only)

The total product tax in the purchase currency. The total product tax represents the tax on products,
 excluding services and adjustments.

### productLineItems

**Type:** Collection (Read Only)

A collection of all product line items related to this shipment.

### proratedMerchandizeTotalPrice

**Type:** Money (Read Only)

The total product price of the shipment, including product-level adjustments and prorating all
 Buy-X-Get-Y and order-level adjustments, according to the scheme described in
 PriceAdjustment.getProratedPrices(). For net pricing the net price is returned. For gross
 pricing, the gross price is returned.

### shipmentNo

**Type:** String (Read Only)

The shipment number for this shipment.
 
 When an order is placed (OrderMgr.placeOrder(Order)) shipment number will be filled using a
 sequence. Before order was placed null will be returned.

### shippingAddress

**Type:** OrderAddress (Read Only)

The shipping address or null if none is set.

### shippingLineItems

**Type:** Collection (Read Only)

A collection of all shipping line items of the shipment, excluding any product-level shipping costs that
 are associated with ProductLineItems of the shipment.

### shippingMethod

**Type:** ShippingMethod

The shipping method or null if none is set.

### shippingMethodID

**Type:** String (Read Only)

The shipping method ID or null if none is set.

### shippingPriceAdjustments

**Type:** Collection (Read Only)

A collection of price adjustments that have been applied to the shipping costs of the shipment, for
 example by the promotions engine.
 Note that this method returns all shipping price adjustments in this shipment, regardless of which shipping line
 item they belong to. Use ShippingLineItem.getShippingPriceAdjustments() to retrieve the shipping
 price adjustments associated with a specific shipping line item.

### shippingStatus

**Type:** EnumValue

The shipping status. Possible values are SHIPMENT_NOTSHIPPED or SHIPMENT_SHIPPED.

### shippingTotalGrossPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the shipment, including tax, excluding shipping adjustments.

### shippingTotalNetPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the shipment, excluding tax and adjustments.

### shippingTotalPrice

**Type:** Money (Read Only)

The shipping total price. If the line item container is based on net pricing the shipping total net price
 is returned. If the line item container is based on gross pricing the shipping total gross price is returned.

### shippingTotalTax

**Type:** Money (Read Only)

The tax of all shipping line items of the shipment before shipping adjustments have been applied.

### standardShippingLineItem

**Type:** ShippingLineItem (Read Only)

Convenience method. Same as getShippingLineItem(ShippingLineItem.STANDARD_SHIPPING_ID)

### totalGrossPrice

**Type:** Money (Read Only)

The total gross price of the shipment in the purchase currency. The total gross price is the sum of
 product prices, service prices, adjustments, and tax.

### totalNetPrice

**Type:** Money (Read Only)

The total net price of the shipment in the purchase currency. The total net price is the sum of product
 prices, service prices, and adjustments, excluding tax.

### totalTax

**Type:** Money (Read Only)

The total tax for the shipment in the purchase currency.

### trackingNumber

**Type:** String

The tracking number of this shipment.

## Constructor Summary

## Method Summary

### createShippingAddress

**Signature:** `createShippingAddress() : OrderAddress`

A shipment has initially no shipping address.

### createShippingLineItem

**Signature:** `createShippingLineItem(id : String) : ShippingLineItem`

Creates a new shipping line item for this shipment.

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

Creates a shipping price adjustment to be applied to the shipment.

### getAdjustedMerchandizeTotalGrossPrice

**Signature:** `getAdjustedMerchandizeTotalGrossPrice() : Money`

Returns the adjusted total gross price, including tax, in the purchase currency.

### getAdjustedMerchandizeTotalNetPrice

**Signature:** `getAdjustedMerchandizeTotalNetPrice() : Money`

Returns the adjusted net price, excluding tax, in the purchase currency.

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice() : Money`

Returns the product total price after all product discounts.

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice(applyOrderLevelAdjustments : boolean) : Money`

Returns the total product price including product-level adjustments and, optionally, prorated order-level adjustments.

### getAdjustedMerchandizeTotalTax

**Signature:** `getAdjustedMerchandizeTotalTax() : Money`

Returns the total adjusted product tax in the purchase currency.

### getAdjustedShippingTotalGrossPrice

**Signature:** `getAdjustedShippingTotalGrossPrice() : Money`

Returns the adjusted sum of all shipping line items of the shipment, including shipping adjustuments and tax

### getAdjustedShippingTotalNetPrice

**Signature:** `getAdjustedShippingTotalNetPrice() : Money`

Returns the sum of all shipping line items of the shipment, including shipping adjustments, excluding tax.

### getAdjustedShippingTotalPrice

**Signature:** `getAdjustedShippingTotalPrice() : Money`

Returns the adjusted shipping total price.

### getAdjustedShippingTotalTax

**Signature:** `getAdjustedShippingTotalTax() : Money`

Returns the tax of all shipping line items of the shipment , including shipping adjustments.

### getAllLineItems

**Signature:** `getAllLineItems() : Collection`

Returns all line items related to the shipment.

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems() : Collection`

Returns all gift certificate line items of the shipment.

### getGiftMessage

**Signature:** `getGiftMessage() : String`

Returns the value set for gift message or null if no value set.

### getID

**Signature:** `getID() : String`

Returns the ID of this shipment ("me" for the default shipment).

### getMerchandizeTotalGrossPrice

**Signature:** `getMerchandizeTotalGrossPrice() : Money`

Returns the gross product subtotal in the purchase currency.

### getMerchandizeTotalNetPrice

**Signature:** `getMerchandizeTotalNetPrice() : Money`

Returns the net product subtotal, excluding tax, in the purchase currency.

### getMerchandizeTotalPrice

**Signature:** `getMerchandizeTotalPrice() : Money`

Returns the product total price.

### getMerchandizeTotalPriceAdjustments

**Signature:** `getMerchandizeTotalPriceAdjustments() : Collection`

Returns a collection of price adjustments that have been applied to the totals, such as a promotion on the purchase value (i.e.

### getMerchandizeTotalTax

**Signature:** `getMerchandizeTotalTax() : Money`

Returns the total product tax in the purchase currency.

### getProductLineItems

**Signature:** `getProductLineItems() : Collection`

Returns a collection of all product line items related to this shipment.

### getProratedMerchandizeTotalPrice

**Signature:** `getProratedMerchandizeTotalPrice() : Money`

Returns the total product price of the shipment, including product-level adjustments and prorating all Buy-X-Get-Y and order-level adjustments, according to the scheme described in PriceAdjustment.getProratedPrices().

### getShipmentNo

**Signature:** `getShipmentNo() : String`

Returns the shipment number for this shipment.

### getShippingAddress

**Signature:** `getShippingAddress() : OrderAddress`

Returns the shipping address or null if none is set.

### getShippingLineItem

**Signature:** `getShippingLineItem(id : String) : ShippingLineItem`

Returns the shipping line item identified by the specified ID, or null if not found.

### getShippingLineItems

**Signature:** `getShippingLineItems() : Collection`

Returns a collection of all shipping line items of the shipment, excluding any product-level shipping costs that are associated with ProductLineItems of the shipment.

### getShippingMethod

**Signature:** `getShippingMethod() : ShippingMethod`

Returns the shipping method or null if none is set.

### getShippingMethodID

**Signature:** `getShippingMethodID() : String`

Returns the shipping method ID or null if none is set.

### getShippingPriceAdjustmentByPromotionID

**Signature:** `getShippingPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

Returns the shipping price adjustment associated with the specified promotion ID.

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

Returns a collection of price adjustments that have been applied to the shipping costs of the shipment, for example by the promotions engine. Note that this method returns all shipping price adjustments in this shipment, regardless of which shipping line item they belong to.

### getShippingStatus

**Signature:** `getShippingStatus() : EnumValue`

Returns the shipping status.

### getShippingTotalGrossPrice

**Signature:** `getShippingTotalGrossPrice() : Money`

Returns the sum of all shipping line items of the shipment, including tax, excluding shipping adjustments.

### getShippingTotalNetPrice

**Signature:** `getShippingTotalNetPrice() : Money`

Returns the sum of all shipping line items of the shipment, excluding tax and adjustments.

### getShippingTotalPrice

**Signature:** `getShippingTotalPrice() : Money`

Returns the shipping total price.

### getShippingTotalTax

**Signature:** `getShippingTotalTax() : Money`

Returns the tax of all shipping line items of the shipment before shipping adjustments have been applied.

### getStandardShippingLineItem

**Signature:** `getStandardShippingLineItem() : ShippingLineItem`

Convenience method.

### getTotalGrossPrice

**Signature:** `getTotalGrossPrice() : Money`

Returns the total gross price of the shipment in the purchase currency.

### getTotalNetPrice

**Signature:** `getTotalNetPrice() : Money`

Returns the total net price of the shipment in the purchase currency.

### getTotalTax

**Signature:** `getTotalTax() : Money`

Returns the total tax for the shipment in the purchase currency.

### getTrackingNumber

**Signature:** `getTrackingNumber() : String`

Returns the tracking number of this shipment.

### isDefault

**Signature:** `isDefault() : boolean`

Return true if this shipment is the default shipment (shipment ID "me").

### isGift

**Signature:** `isGift() : boolean`

Returns true if this line item represents a gift, false otherwise.

### removeShippingLineItem

**Signature:** `removeShippingLineItem(shippingLineItem : ShippingLineItem) : void`

Removes the specified shipping line item and any of its dependent shipping price adjustments.

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

Removes the specified shipping price adjustment from the shipment.

### setGift

**Signature:** `setGift(isGift : boolean) : void`

Controls if this line item is a gift or not.

### setGiftMessage

**Signature:** `setGiftMessage(message : String) : void`

Sets the value to set for the gift message.

### setShippingMethod

**Signature:** `setShippingMethod(method : ShippingMethod) : void`

Set the specified shipping method for the specified shipment.

### setShippingStatus

**Signature:** `setShippingStatus(status : Number) : void`

Sets the shipping status of the shipment.

### setTrackingNumber

**Signature:** `setTrackingNumber(aValue : String) : void`

Sets the tracking number of this shipment.

## Method Detail

## Method Details

### createShippingAddress

**Signature:** `createShippingAddress() : OrderAddress`

**Description:** A shipment has initially no shipping address. This method creates a shipping address for the shipment and replaces an existing shipping address.

**Returns:**

The new shipping address of the shipment

---

### createShippingLineItem

**Signature:** `createShippingLineItem(id : String) : ShippingLineItem`

**Description:** Creates a new shipping line item for this shipment. If the specified ID is already assigned to any of the existing shipping line items of the shipment, the method throws an exception.

**Parameters:**

- `id`: The id to use to locate the new shipping line item.

**Returns:**

The new shipping line item.

---

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

**Description:** Creates a shipping price adjustment to be applied to the shipment. The price adjustment implicitly belongs to the standard shipping line item if this line item exists, otherwise it belongs to the shipment itself. The promotion ID is mandatory and must not be the ID of any actual promotion defined in Salesforce B2C Commerce. If there already exists a shipping price adjustment line item referring to the specified promotion ID, an exception is thrown.

**Deprecated:**

Deprecated in favor of ShippingLineItem.createShippingPriceAdjustment(String), which explicitly relates the price adjustment to a shipping line item.

**Parameters:**

- `promotionID`: Promotion ID

**Returns:**

The new price adjustment line item.

---

### getAdjustedMerchandizeTotalGrossPrice

**Signature:** `getAdjustedMerchandizeTotalGrossPrice() : Money`

**Description:** Returns the adjusted total gross price, including tax, in the purchase currency. The adjusted total gross price represents the sum of product prices and adjustments including tax, excluding services.

**Returns:**

the adjusted total gross price, including tax, in the purchase currency.

---

### getAdjustedMerchandizeTotalNetPrice

**Signature:** `getAdjustedMerchandizeTotalNetPrice() : Money`

**Description:** Returns the adjusted net price, excluding tax, in the purchase currency. The adjusted net price represents the the sum of product prices and adjustments, excluding services and tax.

**Returns:**

the adjusted net price, excluding tax, in the purchase currency.

---

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice() : Money`

**Description:** Returns the product total price after all product discounts. If the line item container is based on net pricing the adjusted product total net price is returned. If the line item container is based on gross pricing the adjusted product total gross price is returned.

**Returns:**

either the adjusted product total net or gross price.

---

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice(applyOrderLevelAdjustments : boolean) : Money`

**Description:** Returns the total product price including product-level adjustments and, optionally, prorated order-level adjustments. For net pricing the net price is returned. For gross pricing, the gross price is returned.

**Parameters:**

- `applyOrderLevelAdjustments`: If true, prorated order-level adjustments will be applied to total price

**Returns:**

Adjusted net or gross product total price

**See Also:**

getAdjustedMerchandizeTotalPrice()

---

### getAdjustedMerchandizeTotalTax

**Signature:** `getAdjustedMerchandizeTotalTax() : Money`

**Description:** Returns the total adjusted product tax in the purchase currency. The total adjusted product tax represents the tax on products and adjustments, excluding services.

**Returns:**

the total tax in purchase currency.

---

### getAdjustedShippingTotalGrossPrice

**Signature:** `getAdjustedShippingTotalGrossPrice() : Money`

**Description:** Returns the adjusted sum of all shipping line items of the shipment, including shipping adjustuments and tax

**Returns:**

the adjusted sum of all shipping line items of the shipment, including shipping adjustuments and tax

---

### getAdjustedShippingTotalNetPrice

**Signature:** `getAdjustedShippingTotalNetPrice() : Money`

**Description:** Returns the sum of all shipping line items of the shipment, including shipping adjustments, excluding tax.

**Returns:**

the sum of all shipping line items of the shipment, including shipping adjustments, excluding tax.

---

### getAdjustedShippingTotalPrice

**Signature:** `getAdjustedShippingTotalPrice() : Money`

**Description:** Returns the adjusted shipping total price. If the line item container is based on net pricing the adjusted shipping total net price is returned. If the line item container is based on gross pricing the adjusted shipping total gross price is returned.

**Returns:**

either the adjusted shipping total net or gross price

---

### getAdjustedShippingTotalTax

**Signature:** `getAdjustedShippingTotalTax() : Money`

**Description:** Returns the tax of all shipping line items of the shipment , including shipping adjustments.

**Returns:**

the tax of all shipping line items of the shipment , including shipping adjustments.

---

### getAllLineItems

**Signature:** `getAllLineItems() : Collection`

**Description:** Returns all line items related to the shipment. The returned collection may include line items of the following types: ProductLineItem ShippingLineItem GiftCertificateLineItem PriceAdjustment Their common type is LineItem. Each ProductLineItem in the collection may itself contain bundled or option product line items, as well as a product-level shipping line item.

**Returns:**

all line items related to ths shipment.

---

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems() : Collection`

**Description:** Returns all gift certificate line items of the shipment.

**Returns:**

A collection of all GiftCertificateLineItems of the shipment.

---

### getGiftMessage

**Signature:** `getGiftMessage() : String`

**Description:** Returns the value set for gift message or null if no value set.

**Returns:**

the value set for gift message or null if no value set.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this shipment ("me" for the default shipment).

**Returns:**

the ID of this shipment

---

### getMerchandizeTotalGrossPrice

**Signature:** `getMerchandizeTotalGrossPrice() : Money`

**Description:** Returns the gross product subtotal in the purchase currency. The gross product subtotal represents the sum of product prices including tax, excluding services and adjustments.

**Returns:**

the total gross price, including tax, in the purchase currency.

---

### getMerchandizeTotalNetPrice

**Signature:** `getMerchandizeTotalNetPrice() : Money`

**Description:** Returns the net product subtotal, excluding tax, in the purchase currency. The net product subtotal represents the sum of product prices, excluding services, adjustments, and tax.

**Returns:**

the net price, excluding tax, in the purchase currency.

---

### getMerchandizeTotalPrice

**Signature:** `getMerchandizeTotalPrice() : Money`

**Description:** Returns the product total price. If the line item container is based on net pricing the product total net price is returned. If the line item container is based on gross pricing the product total gross price is returned.

**Returns:**

either the product total net or gross price

---

### getMerchandizeTotalPriceAdjustments

**Signature:** `getMerchandizeTotalPriceAdjustments() : Collection`

**Description:** Returns a collection of price adjustments that have been applied to the totals, such as a promotion on the purchase value (i.e. $10 Off or 10% Off).

**Deprecated:**

Shipments cannot have product price adjustments, therefore this method will always return an empty collection

**Returns:**

a collection of price adjustments that have been applied to the totals, such as a promotion on the purchase value (i.e. $10 Off or 10% Off).

---

### getMerchandizeTotalTax

**Signature:** `getMerchandizeTotalTax() : Money`

**Description:** Returns the total product tax in the purchase currency. The total product tax represents the tax on products, excluding services and adjustments.

**Returns:**

the total tax in purchase currency.

---

### getProductLineItems

**Signature:** `getProductLineItems() : Collection`

**Description:** Returns a collection of all product line items related to this shipment.

**Returns:**

a collection of all product line items related to this shipment.

---

### getProratedMerchandizeTotalPrice

**Signature:** `getProratedMerchandizeTotalPrice() : Money`

**Description:** Returns the total product price of the shipment, including product-level adjustments and prorating all Buy-X-Get-Y and order-level adjustments, according to the scheme described in PriceAdjustment.getProratedPrices(). For net pricing the net price is returned. For gross pricing, the gross price is returned.

**Returns:**

Adjusted and prorated net or gross product total price

---

### getShipmentNo

**Signature:** `getShipmentNo() : String`

**Description:** Returns the shipment number for this shipment. When an order is placed (OrderMgr.placeOrder(Order)) shipment number will be filled using a sequence. Before order was placed null will be returned.

**Returns:**

the shipment number for this shipment.

---

### getShippingAddress

**Signature:** `getShippingAddress() : OrderAddress`

**Description:** Returns the shipping address or null if none is set.

**Returns:**

the shipping address or null if none is set.

---

### getShippingLineItem

**Signature:** `getShippingLineItem(id : String) : ShippingLineItem`

**Description:** Returns the shipping line item identified by the specified ID, or null if not found. To get the standard shipping line item for this shipment, use the identifier ShippingLineItem.STANDARD_SHIPPING_ID.

**Parameters:**

- `id`: the identifier to use to locate the shipping line item.

**Returns:**

the shipping line item identified by the specified ID, or null if not found.

---

### getShippingLineItems

**Signature:** `getShippingLineItems() : Collection`

**Description:** Returns a collection of all shipping line items of the shipment, excluding any product-level shipping costs that are associated with ProductLineItems of the shipment.

**Returns:**

a collection of all shipping line items of the shipment, excluding any product-level shipping costs.

---

### getShippingMethod

**Signature:** `getShippingMethod() : ShippingMethod`

**Description:** Returns the shipping method or null if none is set.

**Returns:**

the shipping method or null if none is set.

---

### getShippingMethodID

**Signature:** `getShippingMethodID() : String`

**Description:** Returns the shipping method ID or null if none is set.

**Returns:**

the shipping method ID or null if none is set.

---

### getShippingPriceAdjustmentByPromotionID

**Signature:** `getShippingPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

**Description:** Returns the shipping price adjustment associated with the specified promotion ID.

**Deprecated:**

This item is deprecated.

**Parameters:**

- `promotionID`: the promotion ID

**Returns:**

The price adjustment associated with the given promotion ID

---

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

**Description:** Returns a collection of price adjustments that have been applied to the shipping costs of the shipment, for example by the promotions engine. Note that this method returns all shipping price adjustments in this shipment, regardless of which shipping line item they belong to. Use ShippingLineItem.getShippingPriceAdjustments() to retrieve the shipping price adjustments associated with a specific shipping line item.

**Returns:**

a collection of price adjustments that have been applied to the shipping costs of the shipment.

---

### getShippingStatus

**Signature:** `getShippingStatus() : EnumValue`

**Description:** Returns the shipping status. Possible values are SHIPMENT_NOTSHIPPED or SHIPMENT_SHIPPED.

**Returns:**

the shipping status. Possible values are SHIPMENT_NOTSHIPPED or SHIPMENT_SHIPPED.

---

### getShippingTotalGrossPrice

**Signature:** `getShippingTotalGrossPrice() : Money`

**Description:** Returns the sum of all shipping line items of the shipment, including tax, excluding shipping adjustments.

**Returns:**

the sum of all shipping line items of the shipment, including tax, excluding shipping adjustments.

---

### getShippingTotalNetPrice

**Signature:** `getShippingTotalNetPrice() : Money`

**Description:** Returns the sum of all shipping line items of the shipment, excluding tax and adjustments.

**Returns:**

the sum of all shipping line items of the shipment, excluding tax and adjustments.

---

### getShippingTotalPrice

**Signature:** `getShippingTotalPrice() : Money`

**Description:** Returns the shipping total price. If the line item container is based on net pricing the shipping total net price is returned. If the line item container is based on gross pricing the shipping total gross price is returned.

**Returns:**

either the shipping total net or gross price

---

### getShippingTotalTax

**Signature:** `getShippingTotalTax() : Money`

**Description:** Returns the tax of all shipping line items of the shipment before shipping adjustments have been applied.

**Returns:**

the tax of all shipping line items of the shipment before shipping adjustments have been applied.

---

### getStandardShippingLineItem

**Signature:** `getStandardShippingLineItem() : ShippingLineItem`

**Description:** Convenience method. Same as getShippingLineItem(ShippingLineItem.STANDARD_SHIPPING_ID)

**Returns:**

The standard shipping line item, or null if it does not exist.

---

### getTotalGrossPrice

**Signature:** `getTotalGrossPrice() : Money`

**Description:** Returns the total gross price of the shipment in the purchase currency. The total gross price is the sum of product prices, service prices, adjustments, and tax.

**Returns:**

the grand total price gross of tax for the shipment, in purchase currency.

---

### getTotalNetPrice

**Signature:** `getTotalNetPrice() : Money`

**Description:** Returns the total net price of the shipment in the purchase currency. The total net price is the sum of product prices, service prices, and adjustments, excluding tax.

**Returns:**

the grand total price for the shipment net of tax, in purchase currency.

---

### getTotalTax

**Signature:** `getTotalTax() : Money`

**Description:** Returns the total tax for the shipment in the purchase currency.

**Returns:**

the total tax for the shipment, in purchase currency.

---

### getTrackingNumber

**Signature:** `getTrackingNumber() : String`

**Description:** Returns the tracking number of this shipment.

**Returns:**

the tracking number of this shipment.

---

### isDefault

**Signature:** `isDefault() : boolean`

**Description:** Return true if this shipment is the default shipment (shipment ID "me").

**Returns:**

true if this shipment is the default shipment

---

### isGift

**Signature:** `isGift() : boolean`

**Description:** Returns true if this line item represents a gift, false otherwise.

**Returns:**

true if this line item represents a gift, false otherwise.

---

### removeShippingLineItem

**Signature:** `removeShippingLineItem(shippingLineItem : ShippingLineItem) : void`

**Description:** Removes the specified shipping line item and any of its dependent shipping price adjustments.

**Parameters:**

- `shippingLineItem`: The shipping line item to be removed.

---

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

**Description:** Removes the specified shipping price adjustment from the shipment.

**Deprecated:**

Deprecated in favor of ShippingLineItem.removeShippingPriceAdjustment(PriceAdjustment) since shipping price adjustments belong to a specific shipping line item.

**Parameters:**

- `priceAdjustment`: The price adjustment line item to remove

---

### setGift

**Signature:** `setGift(isGift : boolean) : void`

**Description:** Controls if this line item is a gift or not.

**Parameters:**

- `isGift`: set to true if you want this line item to represent a gift.

---

### setGiftMessage

**Signature:** `setGiftMessage(message : String) : void`

**Description:** Sets the value to set for the gift message.

**Parameters:**

- `message`: the value to set for the gift message.

---

### setShippingMethod

**Signature:** `setShippingMethod(method : ShippingMethod) : void`

**Description:** Set the specified shipping method for the specified shipment.

**Parameters:**

- `method`: the shipping method to use.

---

### setShippingStatus

**Signature:** `setShippingStatus(status : Number) : void`

**Description:** Sets the shipping status of the shipment. Possible values are SHIPPING_STATUS_NOTSHIPPED or SHIPPING_STATUS_SHIPPED.

**Parameters:**

- `status`: Shipment shipping status

---

### setTrackingNumber

**Signature:** `setTrackingNumber(aValue : String) : void`

**Description:** Sets the tracking number of this shipment.

**Parameters:**

- `aValue`: the tracking number of this shipment.

---