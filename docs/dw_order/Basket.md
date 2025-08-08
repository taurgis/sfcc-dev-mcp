## Package: dw.order

# Class Basket

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItemCtnr
      - dw.order.Basket

## Description

The Basket class represents a shopping cart.

## Properties

### agentBasket

**Type:** BasketMgr.createAgentBasket() (Read Only)

Returns if the basket was created by an agent.
 
 An agent basket is created by an agent on behalf of the customer in comparison to a storefront basket which is
 created by the customer e.g. in the storefront. An agent basket can be created with
 BasketMgr.createAgentBasket().

### inventoryReservationExpiry

**Type:** Date (Read Only)

The timestamp when the inventory for this basket expires.
 
 It will return null for the following reasons:
 
 No reservation for the basket was done
 Reservation is outdated meaning the timestamp is in the past
 
 
 
 Please note that the expiry timestamp will not always be valid for the whole basket. It will not be valid for
 new items added or items whose quantity has changed after the reservation was done.

### orderBeingEdited

**Type:** Order (Read Only)

The order that this basket represents if the basket is being used to edit an order, otherwise this method
 returns null. Baskets created via BasketMgr.createBasketFromOrder(Order) will create a reference
 to the order that was used to create this basket (please check limitations around basket accessibility in
 BasketMgr.createBasketFromOrder(Order)).

### orderNoBeingEdited

**Type:** String (Read Only)

The number of the order that this basket represents if the basket is being used to edit an order,
 otherwise this method returns null. Baskets created via BasketMgr.createBasketFromOrder(Order)
 will create a reference to the order that was used to create this basket (please check limitations around basket
 accessibility in BasketMgr.createBasketFromOrder(Order)).

### taxRoundedAtGroup

**Type:** boolean (Read Only)

Use this method to check if the Basket was calculated with grouped taxation calculation.
 
 If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

### temporary

**Type:** BasketMgr.createTemporaryBasket() (Read Only)

Returns if the basket is temporary.
 
 Temporary baskets are separate from shopper storefront and agent baskets, and are intended for use to perform
 calculations or create an order without disturbing a shopper's open storefront basket. A temporary basket can be
 created with BasketMgr.createTemporaryBasket().

## Constructor Summary

## Method Summary

### getInventoryReservationExpiry

**Signature:** `getInventoryReservationExpiry() : Date`

Returns the timestamp when the inventory for this basket expires.

### getOrderBeingEdited

**Signature:** `getOrderBeingEdited() : Order`

Returns the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null.

### getOrderNoBeingEdited

**Signature:** `getOrderNoBeingEdited() : String`

Returns the number of the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null.

### isAgentBasket

**Signature:** `isAgentBasket() : boolean`

Returns if the basket was created by an agent.

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

Use this method to check if the Basket was calculated with grouped taxation calculation.

### isTemporary

**Signature:** `isTemporary() : boolean`

Returns if the basket is temporary.

### releaseInventory

**Signature:** `releaseInventory() : Status`

Releases all inventory previously reserved for this basket.

### reserveInventory

**Signature:** `reserveInventory() : Status`

Reserves inventory for all items in this basket for 10 minutes.

### reserveInventory

**Signature:** `reserveInventory(reservationDurationInMinutes : Number) : Status`

Reserves inventory for all items in this basket for a specified amount of minutes.

### reserveInventory

**Signature:** `reserveInventory(reservationDurationInMinutes : Number, removeIfNotAvailable : boolean) : Status`

Reserves inventory for all items in this basket for a specified amount of minutes.

### setBusinessType

**Signature:** `setBusinessType(aType : Number) : void`

Set the type of the business this order has been placed in. Possible values are LineItemCtnr.BUSINESS_TYPE_B2C or LineItemCtnr.BUSINESS_TYPE_B2B.

### setChannelType

**Signature:** `setChannelType(aType : Number) : void`

Set the channel type in which sales channel this order has been created.

### setCustomerNo

**Signature:** `setCustomerNo(customerNo : String) : void`

Sets the customer number of the customer associated with this container.

### startCheckout

**Signature:** `startCheckout() : void`

Register a "start checkout" event for the current basket.

### updateCurrency

**Signature:** `updateCurrency() : void`

Updates the basket currency if different to session currency, otherwise does nothing.

## Method Detail

## Method Details

### getInventoryReservationExpiry

**Signature:** `getInventoryReservationExpiry() : Date`

**Description:** Returns the timestamp when the inventory for this basket expires. It will return null for the following reasons: No reservation for the basket was done Reservation is outdated meaning the timestamp is in the past Please note that the expiry timestamp will not always be valid for the whole basket. It will not be valid for new items added or items whose quantity has changed after the reservation was done.

**Returns:**

the inventory reservation expiry timestamp or null

---

### getOrderBeingEdited

**Signature:** `getOrderBeingEdited() : Order`

**Description:** Returns the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null. Baskets created via BasketMgr.createBasketFromOrder(Order) will create a reference to the order that was used to create this basket (please check limitations around basket accessibility in BasketMgr.createBasketFromOrder(Order)).

**Returns:**

the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null.

---

### getOrderNoBeingEdited

**Signature:** `getOrderNoBeingEdited() : String`

**Description:** Returns the number of the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null. Baskets created via BasketMgr.createBasketFromOrder(Order) will create a reference to the order that was used to create this basket (please check limitations around basket accessibility in BasketMgr.createBasketFromOrder(Order)).

**Returns:**

the number of the order that this basket represents if the basket is being used to edit an order, otherwise this method returns null.

---

### isAgentBasket

**Signature:** `isAgentBasket() : boolean`

**Description:** Returns if the basket was created by an agent. An agent basket is created by an agent on behalf of the customer in comparison to a storefront basket which is created by the customer e.g. in the storefront. An agent basket can be created with BasketMgr.createAgentBasket().

**Returns:**

true if the basket was created by an agent otherwise false

---

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

**Description:** Use this method to check if the Basket was calculated with grouped taxation calculation. If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

**Returns:**

true if the Basket was calculated with grouped taxation

---

### isTemporary

**Signature:** `isTemporary() : boolean`

**Description:** Returns if the basket is temporary. Temporary baskets are separate from shopper storefront and agent baskets, and are intended for use to perform calculations or create an order without disturbing a shopper's open storefront basket. A temporary basket can be created with BasketMgr.createTemporaryBasket().

**Returns:**

true if the basket is temporary otherwise false

---

### releaseInventory

**Signature:** `releaseInventory() : Status`

**Description:** Releases all inventory previously reserved for this basket. The method implements its own transaction handling. Calling the method from inside a transaction is disallowed and results in an exception being thrown. This behavior differs when calling the method from an OCAPI hook. OCAPI hooks handle transactions themselves, so in this case there is also no need to do any transaction handling, but to ensure the shortest possible locking of the inventory this method should only be called as the last step in the OCAPI hook.

**Returns:**

a Status instance with - Status.OK if release inventory was successful, otherwise Status.ERROR.

---

### reserveInventory

**Signature:** `reserveInventory() : Status`

**Description:** Reserves inventory for all items in this basket for 10 minutes. Any reservations created by previous calls of this method will be reset to 10 minutes. The method can be used to reserve basket items before checkout to ensure that inventory is still available at the time an order is created from the basket using OrderMgr.createOrder(Basket). If all or some basket items are not reserved before creating an order, OrderMgr.createOrder(Basket) will validate item availability and will fail if any item is unavailable. Calling this method in the same request as OrderMgr.createOrder(Basket) is unnecessary and discouraged for performance reasons. The maximum quantity that can be reserved at one time is equal to the ATS (Available To Sell) quantity. (See ProductInventoryRecord.getATS().) When using B2C Commerce inventory, reserving basket inventory does not reduce ATS. In this case, converting the basket to an order reduces ATS by the reserved amount. For example, consider a product with an ATS quantity of 5 and no reservations. If a basket reserves a quantity of 3, then other baskets still see an ATS of 5 but can only reserve a quantity of 2. When using Omnichannel Inventory, reserving basket inventory reduces ATS. In this case, converting the basket to an order doesn't reduce ATS. In the previous example, after the first basket reserved a quantity of 3, other baskets would see an ATS of 2. Reservations can only be made for products with an inventory record. The reservation of product bundles is controlled by the Use Bundle Inventory Only setting on the inventory list. The setting allows inventory to be reserved for just the bundle or for the bundle and its bundled products. The following conditions must be met for the method to succeed: an inventory list must be assigned to the current site all products in the basket must exist, and must not be of type Master or ProductSet each product line item must have a valid quantity each product must have an inventory record, or the inventory list must define that products without inventory record are available by default the reservation must succeed for each item as described above. The method implements its own transaction handling. Calling the method from inside a transaction is disallowed and results in an exception being thrown. This behavior differs when calling the method from an OCAPI hook. OCAPI hooks handle transactions themselves, so in this case there is also no need to do any transaction handling, but to ensure the shortest possible locking of the inventory this method should only be called as the last step in the OCAPI hook. If the reservation fails with an ERROR status, existing valid reservations for the basket will remain unchanged but no new reservations will be made. This might lead to a partially reserved basket. Behaves same as reserveInventory( null, false );. This method must not be used with the CreateOrder2 pipelet, or OrderMgr.createOrder(Basket), or OrderMgr.createOrder(Basket, String) in the same request.

**Returns:**

a Status instance with - Status.OK if all items could be reserved, otherwise Status.ERROR meaning no items were reserved.

---

### reserveInventory

**Signature:** `reserveInventory(reservationDurationInMinutes : Number) : Status`

**Description:** Reserves inventory for all items in this basket for a specified amount of minutes. Any reservations created by previous calls of this method will be reset to that amount of minutes. The method can be used to reserve basket items before checkout to ensure that inventory is still available at the time an order is created from the basket using OrderMgr.createOrder(Basket). If all or some basket items are not reserved before creating an order, OrderMgr.createOrder(Basket) will validate item availability and will fail if any item is unavailable. Calling this method in the same request as OrderMgr.createOrder(Basket) is unnecessary and discouraged for performance reasons. The maximum quantity that can be reserved at one time is equal to the ATS (Available To Sell) quantity. (See ProductInventoryRecord.getATS().) When using B2C Commerce inventory, reserving basket inventory does not reduce ATS. In this case, converting the basket to an order reduces ATS by the reserved amount. For example, consider a product with an ATS quantity of 5 and no reservations. If a basket reserves a quantity of 3, then other baskets still see an ATS of 5 but can only reserve a quantity of 2. When using Omnichannel Inventory, reserving basket inventory reduces ATS. In this case, converting the basket to an order doesn't reduce ATS. In the previous example, after the first basket reserved a quantity of 3, other baskets would see an ATS of 2. Reservations can only be made for products with an inventory record. The reservation of product bundles is controlled by the Use Bundle Inventory Only setting on the inventory list. The setting allows inventory to be reserved for just the bundle or for the bundle and its bundled products. The following conditions must be met for the method to succeed: an inventory list must be assigned to the current site all products in the basket must exist, and must not be of type Master or ProductSet each product line item must have a valid quantity each product must have an inventory record, or the inventory list must define that products without inventory record are available by default the reservation must succeed for each item as described above. The method implements its own transaction handling. Calling the method from inside a transaction is disallowed and results in an exception being thrown. This behavior differs when calling the method from an OCAPI hook. OCAPI hooks handle transactions themselves, so in this case there is also no need to do any transaction handling, but to ensure the shortest possible locking of the inventory this method should only be called as the last step in the OCAPI hook. getInventoryReservationExpiry() can be used to determine when the expiration will expire. If the reservation fails with an ERROR status, existing valid reservations for the basket will remain unchanged but no new reservations will be made. This might lead to a partially reserved basket. Behaves same as reserveInventory( reservationDurationInMinutes, false );. This method must not be used with the CreateOrder2 pipelet, or OrderMgr.createOrder(Basket), or OrderMgr.createOrder(Basket, String) in the same request.

**Parameters:**

- `reservationDurationInMinutes`: reservation duration in minutes, specifying how long the reservation will last. The maximum value for the reservation duration is 240 minutes.

**Returns:**

a Status instance with - Status.OK if all items could be reserved, otherwise Status.ERROR meaning no items were reserved.

---

### reserveInventory

**Signature:** `reserveInventory(reservationDurationInMinutes : Number, removeIfNotAvailable : boolean) : Status`

**Description:** Reserves inventory for all items in this basket for a specified amount of minutes. Any reservations created by previous calls of this method will be reset to that amount of minutes. The method can be used to reserve basket items before checkout to ensure that inventory is still available at the time an order is created from the basket using OrderMgr.createOrder(Basket). If all or some basket items are not reserved before creating an order, OrderMgr.createOrder(Basket) will validate item availability and will fail if any item is unavailable. Calling this method in the same request as OrderMgr.createOrder(Basket) is unnecessary and discouraged for performance reasons. The maximum quantity that can be reserved at one time is equal to the ATS (Available To Sell) quantity. (See ProductInventoryRecord.getATS().) When using B2C Commerce inventory, reserving basket inventory does not reduce ATS. In this case, converting the basket to an order reduces ATS by the reserved amount. For example, consider a product with an ATS quantity of 5 and no reservations. If a basket reserves a quantity of 3, then other baskets still see an ATS of 5 but can only reserve a quantity of 2. When using Omnichannel Inventory, reserving basket inventory reduces ATS. In this case, converting the basket to an order doesn't reduce ATS. In the previous example, after the first basket reserved a quantity of 3, other baskets would see an ATS of 2. Reservations can only be made for products with an inventory record. The reservation of product bundles is controlled by the Use Bundle Inventory Only setting on the inventory list. The setting allows inventory to be reserved for just the bundle or for the bundle and its bundled products. The following conditions must be met for the method to succeed: an inventory list must be assigned to the current site all products in the basket must exist, and must not be of type Master or ProductSet each product line item must have a valid quantity each product must have an inventory record, or the inventory list must define that products without inventory record are available by default the reservation must succeed for each item as described above or removeIfNotAvailable is set to true The method implements its own transaction handling. Calling the method from inside a transaction is disallowed and results in an exception being thrown. This behavior differs when calling the method from an OCAPI hook. OCAPI hooks handle transactions themselves, so in this case there is also no need to do any transaction handling, but to ensure the shortest possible locking of the inventory this method should only be called as the last step in the OCAPI hook. getInventoryReservationExpiry() can be used to determine when the expiration will expire. If the reservation fails with an ERROR status, existing valid reservations for the basket will remain unchanged but no new reservations will be made. This might lead to a partially reserved basket. If the reservation succeeds with an OK status and removeIfNotAvailable is true, basket line items quantities might have been changed or line items might have been removed. The returned Status object will contain information about the changes. Possible values for StatusItem.getCode() are: BUNDLE_REMOVED - a bundle item was removed completely ITEM_REMOVED - a product line item was removed completely ITEM_QUANTITY_REDUCED - the quantity of a line item was reduced StatusItem.getDetails() will contain for each item the sku and uuid of the item which was changed/removed. This method must not be used with the CreateOrder2 pipelet, or OrderMgr.createOrder(Basket), or OrderMgr.createOrder(Basket, String) in the same request.

**Parameters:**

- `reservationDurationInMinutes`: reservation duration in minutes, specifying how long the reservation will last. The maximum value for the reservation duration is 240 minutes.
- `removeIfNotAvailable`: if true is specified it will not fail if not the full quantity of the items can be reserved. Item quantity will be reduced to the quantity that could be reserved. Item will be removed if not at least quantity 1 for the item could be reserved. Different to that if a bundle line item cannot be reserved completely it will be removed including dependent line item (bundled items).

**Returns:**

a Status instance with - Status.OK meaning reservation process was successful. In case of removeIfNotAvailable is true, status might contain status items (Status.getItems()) for each item that needed to be changed or removed. In the worst case this could result in an empty basket and no items reserved. A Status instance with - Status.ERROR will be returned if removeIfNotAvailable is false and not all items could be reserved fully or any unexpected error occurred.

---

### setBusinessType

**Signature:** `setBusinessType(aType : Number) : void`

**Description:** Set the type of the business this order has been placed in. Possible values are LineItemCtnr.BUSINESS_TYPE_B2C or LineItemCtnr.BUSINESS_TYPE_B2B.

**Parameters:**

- `aType`: the business type to set for this basket

---

### setChannelType

**Signature:** `setChannelType(aType : Number) : void`

**Description:** Set the channel type in which sales channel this order has been created. This can be used to distinguish order placed through e.g. Storefront, Call Center or Marketplace. Possible values are LineItemCtnr.CHANNEL_TYPE_STOREFRONT, LineItemCtnr.CHANNEL_TYPE_CALLCENTER, LineItemCtnr.CHANNEL_TYPE_MARKETPLACE, LineItemCtnr.CHANNEL_TYPE_DSS, LineItemCtnr.CHANNEL_TYPE_STORE, LineItemCtnr.CHANNEL_TYPE_PINTEREST, LineItemCtnr.CHANNEL_TYPE_TWITTER, LineItemCtnr.CHANNEL_TYPE_FACEBOOKADS, LineItemCtnr.CHANNEL_TYPE_SUBSCRIPTIONS, LineItemCtnr.CHANNEL_TYPE_ONLINERESERVATION, LineItemCtnr.CHANNEL_TYPE_INSTAGRAMCOMMERCE, LineItemCtnr.CHANNEL_TYPE_GOOGLE, LineItemCtnr.CHANNEL_TYPE_YOUTUBE, LineItemCtnr.CHANNEL_TYPE_TIKTOK, LineItemCtnr.CHANNEL_TYPE_SNAPCHAT, LineItemCtnr.CHANNEL_TYPE_WHATSAPP The value for LineItemCtnr.CHANNEL_TYPE_CUSTOMERSERVICECENTER is also available, but it can not be set by the scripting API, it is set only internally.

**Parameters:**

- `aType`: the channel type to set for this basket

---

### setCustomerNo

**Signature:** `setCustomerNo(customerNo : String) : void`

**Description:** Sets the customer number of the customer associated with this container. Note this method has little effect as it only sets the customer number and it does not re-link the basket with a customer profile object, nor is the number copied into the Order should one be created from the basket. Use Order.setCustomer(Customer) instead for a registered customer. For a guest customer the customerNo is usually generated during order creation and the attribute is set at order level.

**Deprecated:**

The method has been deprecated. Please use Order.setCustomer(Customer) instead for registered customer. For guest customer the customerNo is usually generated during order creation and the attribute is set at order level.

**Parameters:**

- `customerNo`: the customer number of the customer associated with this container.

---

### startCheckout

**Signature:** `startCheckout() : void`

**Description:** Register a "start checkout" event for the current basket. This event is tracked for AB test statistics but otherwise has no effect on the basket. The system will register at most one checkout per basket per session.

---

### updateCurrency

**Signature:** `updateCurrency() : void`

**Description:** Updates the basket currency if different to session currency, otherwise does nothing. Use Session.setCurrency(Currency) to set the currency for the session. To reflect the session currency change to the basket you need to update the basket with this method. This ensures that any upcoming basket recalculation, which is based on the session currency, matches the basket currency. ... if (basket.getBillingAddress().getCountryCode() == 'DE'){ var newCurrency : Currency = Currency.getCurrency('EUR'); session.setCurrency( newCurrency ); basket.updateCurrency(); } customBasketRecalculate(); ...

---