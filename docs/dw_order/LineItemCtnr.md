## Package: dw.order

# Class LineItemCtnr

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItemCtnr

## Description

A container for line items, such as ProductLineItems, CouponLineItems, GiftCertificateLineItems. This container also provides access to shipments, shipping adjustments (promotions), and payment instruments (credit cards). LineItemCtnr also contains a set of methods for creating line items and adjustments, and for accessing various price values. There are three types of price-related methods: Net-based methods represent the amount of a category before tax has been calculated. For example, the getMerchandizeTotalNetPrice() returns the price of all merchandise in the container whereas getShippingTotalNetPrice() returns the price of all shipments in the container. Tax-based methods return the amount of tax on a category. For example, the getMerchandizeTotalTax() returns the total tax for all merchandise and the getShippingTotalTax() returns the tax applied to all shipments. Gross-based methods represent the amount of a category after tax has been calculated. For example, the getMerchandizeTotalGrossPrice() returns the price of all merchandise in the container, including tax on the merchandise, whereas getShippingTotalGrossPrice() returns the price of all shipments in the container, including tax on the shipments in the container. There are also a set of methods that provide access to 'adjusted' values. The adjusted-based methods return values where promotions have been applied. For example, the getAdjustedMerchandizeTotalNetPrice() method returns the net price of all merchandise after product-level and order-level promotions have been applied. Whereas the getAdjustedMerchandizeTotalGrossPrice() method returns the price of all merchandise after product-level and order-level promotions have been applied and includes the amount of merchandise-related tax. Finally, there are a set of methods that return the aggregate values representing the line items in the container. These are the total-based methods getTotalNetPrice(), getTotalTax() and getTotalGrossPrice(). These methods return the totals of all items in the container and include any order-level promotions. Note that all merchandise-related methods do not include 'gift certificates' values in the values they return. Gift certificates are not considered merchandise as they do not represent a product.

## Constants

### BUSINESS_TYPE_B2B

**Type:** Number = 2

constant for Business Type B2B

### BUSINESS_TYPE_B2C

**Type:** Number = 1

constant for Business Type B2C

### CHANNEL_TYPE_CALLCENTER

**Type:** Number = 2

constant for Channel Type CallCenter

### CHANNEL_TYPE_CUSTOMERSERVICECENTER

**Type:** Number = 11

constant for Channel Type Customer Service Center

### CHANNEL_TYPE_DSS

**Type:** Number = 4

constant for Channel Type DSS

### CHANNEL_TYPE_FACEBOOKADS

**Type:** Number = 8

constant for Channel Type Facebook Ads

### CHANNEL_TYPE_GOOGLE

**Type:** Number = 13

constant for Channel Type Google

### CHANNEL_TYPE_INSTAGRAMCOMMERCE

**Type:** Number = 12

constant for Channel Type Instagram Commerce

### CHANNEL_TYPE_MARKETPLACE

**Type:** Number = 3

constant for Channel Type Marketplace

### CHANNEL_TYPE_ONLINERESERVATION

**Type:** Number = 10

constant for Channel Type Online Reservation

### CHANNEL_TYPE_PINTEREST

**Type:** Number = 6

constant for Channel Type Pinterest

### CHANNEL_TYPE_SNAPCHAT

**Type:** Number = 15

constant for Channel Type Snapchat

### CHANNEL_TYPE_STORE

**Type:** Number = 5

constant for Channel Type Store

### CHANNEL_TYPE_STOREFRONT

**Type:** Number = 1

constant for Channel Type Storefront

### CHANNEL_TYPE_SUBSCRIPTIONS

**Type:** Number = 9

constant for Channel Type Subscriptions

### CHANNEL_TYPE_TIKTOK

**Type:** Number = 14

constant for Channel Type TikTok

### CHANNEL_TYPE_TWITTER

**Type:** Number = 7

constant for Channel Type Twitter

### CHANNEL_TYPE_WHATSAPP

**Type:** Number = 16

constant for Channel Type WhatsApp

### CHANNEL_TYPE_YOUTUBE

**Type:** Number = 17

constant for Channel Type YouTube

## Properties

### adjustedMerchandizeTotalGrossPrice

**Type:** Money (Read Only)

The adjusted total gross price (including tax) in purchase currency. Adjusted merchandize prices
 represent the sum of product prices before services such as shipping, but after product-level and order-level
 adjustments.

### adjustedMerchandizeTotalNetPrice

**Type:** Money (Read Only)

The total net price (excluding tax) in purchase currency. Adjusted merchandize prices represent the sum
 of product prices before services such as shipping, but after product-level and order-level adjustments.

### adjustedMerchandizeTotalPrice

**Type:** Money (Read Only)

The adjusted merchandize total price including product-level and order-level adjustments. If the line
 item container is based on net pricing the adjusted merchandize total net price is returned. If the line item
 container is based on gross pricing the adjusted merchandize total gross price is returned.

### adjustedMerchandizeTotalTax

**Type:** Money (Read Only)

The subtotal tax in purchase currency. Adjusted merchandize prices represent the sum of product prices
 before services such as shipping have been added, but after adjustment from promotions have been added.

### adjustedShippingTotalGrossPrice

**Type:** Money (Read Only)

The adjusted sum of all shipping line items of the line item container, including tax after shipping
 adjustments have been applied.

### adjustedShippingTotalNetPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the line item container, excluding tax after shipping adjustments
 have been applied.

### adjustedShippingTotalPrice

**Type:** Money (Read Only)

The adjusted shipping total price. If the line item container is based on net pricing the adjusted
 shipping total net price is returned. If the line item container is based on gross pricing the adjusted shipping
 total gross price is returned.

### adjustedShippingTotalTax

**Type:** Money (Read Only)

The tax of all shipping line items of the line item container after shipping adjustments have been
 applied.

### allGiftCertificateLineItems

**Type:** Collection (Read Only)

All gift certificate line items of the container.

### allLineItems

**Type:** Collection (Read Only)

All product, shipping, price adjustment, and gift certificate line items of the line item container.

### allProductLineItems

**Type:** Collection (Read Only)

All product line items of the container, no matter if they are dependent or independent. This includes
 option, bundled and bonus line items.

### allProductQuantities

**Type:** HashMap (Read Only)

A hash mapping all products in the line item container to their total quantities. The total product
 quantity is used chiefly to validate the availability of the items in the cart. This method is not appropriate to
 look up prices because it returns products such as bundled line items which are included in the price of their
 parent and therefore have no corresponding price.
 
 The method counts all direct product line items, plus dependent product line items that are not option line
 items. It also excludes product line items that are not associated to any catalog product.

### allShippingPriceAdjustments

**Type:** Collection (Read Only)

The collection of all shipping price adjustments applied somewhere in the container. This can be
 adjustments applied to individual shipments or to the container itself. Note that the promotions engine only
 applies shipping price adjustments to the the default shipping line item of shipments, and never to the
 container.

### billingAddress

**Type:** OrderAddress (Read Only)

The billing address defined for the container. Returns null if no billing address has been created yet.

### bonusDiscountLineItems

**Type:** Collection (Read Only)

An unsorted collection of the the bonus discount line items associated with this container.

### bonusLineItems

**Type:** Collection (Read Only)

The collection of product line items that are bonus items (where
 ProductLineItem.isBonusProductLineItem() is true).

### businessType

**Type:** EnumValue (Read Only)

The type of the business this order has been placed in.
 Possible values are BUSINESS_TYPE_B2C or BUSINESS_TYPE_B2B.

### channelType

**Type:** EnumValue (Read Only)

The channel type defines in which sales channel this order has been created. This can be used to distinguish
 order placed through Storefront, Call Center or Marketplace.
 Possible values are CHANNEL_TYPE_STOREFRONT, CHANNEL_TYPE_CALLCENTER,
 CHANNEL_TYPE_MARKETPLACE, CHANNEL_TYPE_DSS, CHANNEL_TYPE_STORE,
 CHANNEL_TYPE_PINTEREST, CHANNEL_TYPE_TWITTER, CHANNEL_TYPE_FACEBOOKADS,
 CHANNEL_TYPE_SUBSCRIPTIONS, CHANNEL_TYPE_ONLINERESERVATION,
 CHANNEL_TYPE_CUSTOMERSERVICECENTER, CHANNEL_TYPE_INSTAGRAMCOMMERCE,
 CHANNEL_TYPE_GOOGLE, CHANNEL_TYPE_YOUTUBE, CHANNEL_TYPE_TIKTOK,
 CHANNEL_TYPE_SNAPCHAT, CHANNEL_TYPE_WHATSAPP

### couponLineItems

**Type:** Collection (Read Only)

A sorted collection of the coupon line items in the container. The coupon line items are returned in the
 order they were added to container.

### currencyCode

**Type:** String (Read Only)

The currency code for this line item container. The currency code is a 3-character currency mnemonic such
 as 'USD' or 'EUR'. The currency code represents the currency in which the calculation is made, and in which the
 buyer sees all prices in the store front.

### customer

**Type:** Customer (Read Only)

The customer associated with this container.

### customerEmail

**Type:** String

The email of the customer associated with this container.

### customerName

**Type:** String

The name of the customer associated with this container.

### customerNo

**Type:** String (Read Only)

The customer number of the customer associated with this container.

### defaultShipment

**Type:** Shipment (Read Only)

The default shipment of the line item container. Every basket and order has a default shipment with the
 id "me". If you call a process that accesses a shipment, and you don't specify the shipment, then the process
 uses the default shipment. You can't remove a default shipment. Calling removeShipment(Shipment) on it
 throws an exception.

### etag

**Type:** String (Read Only)

The Etag of the line item container. The Etag is a hash that represents the overall container state
 including any associated objects like line items.

### externallyTaxed

**Type:** boolean (Read Only)

Use this method to check whether the LineItemCtnr is calculated based on external tax tables.

 Note: a basket can only be created in EXTERNAL tax mode using SCAPI.

### giftCertificateLineItems

**Type:** Collection (Read Only)

All gift certificate line items of the container.

### giftCertificatePaymentInstruments

**Type:** Collection (Read Only)

An unsorted collection of the PaymentInstrument instances that represent GiftCertificates in this
 container.

### giftCertificateTotalGrossPrice

**Type:** Money (Read Only)

The total gross price of all gift certificates in the cart. Should usually be equal to total net price.

### giftCertificateTotalNetPrice

**Type:** Money (Read Only)

The total net price (excluding tax) of all gift certificates in the cart. Should usually be equal to
 total gross price.

### giftCertificateTotalPrice

**Type:** Money (Read Only)

The gift certificate total price. If the line item container is based on net pricing the gift certificate
 total net price is returned. If the line item container is based on gross pricing the gift certificate total
 gross price is returned.

### giftCertificateTotalTax

**Type:** Money (Read Only)

The total tax of all gift certificates in the cart. Should usually be 0.0.

### merchandizeTotalGrossPrice

**Type:** Money (Read Only)

The total gross price (including tax) in purchase currency. Merchandize total prices represent the sum of
 product prices before services such as shipping or adjustment from promotions have been added.

### merchandizeTotalNetPrice

**Type:** Money (Read Only)

The total net price (excluding tax) in purchase currency. Merchandize total prices represent the sum of
 product prices before services such as shipping or adjustment from promotion have been added.

### merchandizeTotalPrice

**Type:** Money (Read Only)

The merchandize total price. If the line item container is based on net pricing the merchandize total net
 price is returned. If the line item container is based on gross pricing the merchandize total gross price is
 returned.

### merchandizeTotalTax

**Type:** Money (Read Only)

The total tax in purchase currency. Merchandize total prices represent the sum of product prices before
 services such as shipping or adjustment from promotions have been added.

### notes

**Type:** List (Read Only)

The list of notes for this object, ordered by creation time from oldest to newest.

### paymentInstrument

**Type:** OrderPaymentInstrument (Read Only)

The payment instrument of the line item container or null. This method is deprecated. You should use
 getPaymentInstruments() or getGiftCertificatePaymentInstruments() instead.

### paymentInstruments

**Type:** Collection (Read Only)

An unsorted collection of the payment instruments in this container.

### priceAdjustments

**Type:** Collection (Read Only)

The collection of price adjustments that have been applied to the totals such as promotion on the
 purchase value (i.e. $10 Off or 10% Off). The price adjustments are sorted by the order in which they were
 applied to the order by the promotions engine.

### productLineItems

**Type:** Collection (Read Only)

The product line items of the container that are not dependent on other product line items. This includes
 line items representing bonus products in the container but excludes option, bundled, and bonus line items. The
 returned collection is sorted by the position attribute of the product line items.

### productQuantities

**Type:** HashMap (Read Only)

A hash map of all products in the line item container and their total quantities. The total product
 quantity is for example used to lookup the product price.
 
 The method counts all direct product line items, plus dependent product line items that are not bundled line
 items and no option line items. It also excludes product line items that are not associated to any catalog
 product, and bonus product line items.

### productQuantityTotal

**Type:** Number (Read Only)

The total quantity of all product line items. Not included are bundled line items and option line items.

### shipments

**Type:** Collection (Read Only)

All shipments of the line item container.
 The first shipment in the returned collection is the default shipment (shipment ID always set to "me"). All other
 shipments are sorted ascending by shipment ID.

### shippingPriceAdjustments

**Type:** Collection (Read Only)

The of shipping price adjustments applied to the shipping total of the container. Note that the
 promotions engine only applies shipping price adjustments to the the default shipping line item of shipments, and
 never to the container.

### shippingTotalGrossPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the line item container, including tax before shipping adjustments
 have been applied.

### shippingTotalNetPrice

**Type:** Money (Read Only)

The sum of all shipping line items of the line item container, excluding tax before shipping adjustments
 have been applied.

### shippingTotalPrice

**Type:** Money (Read Only)

The shipping total price. If the line item container is based on net pricing the shipping total net price
 is returned. If the line item container is based on gross pricing the shipping total gross price is returned.

### shippingTotalTax

**Type:** Money (Read Only)

The tax of all shipping line items of the line item container before shipping adjustments have been
 applied.

### taxRoundedAtGroup

**Type:** boolean (Read Only)

Use this method to check if the LineItemCtnr was calculated with grouped taxation calculation.
 
 If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

### taxTotalsPerTaxRate

**Type:** SortedMap (Read Only)

This method returns a SortedMap in which the keys are Decimal tax rates and the values
 are Money total tax for the tax rate. The map is unmodifiable.

### totalGrossPrice

**Type:** Money (Read Only)

The grand total price gross of tax for LineItemCtnr, in purchase currency. Total prices represent the sum
 of product prices, services prices and adjustments.

### totalNetPrice

**Type:** Money (Read Only)

The grand total price for LineItemCtnr net of tax, in purchase currency. Total prices represent the sum
 of product prices, services prices and adjustments.

### totalTax

**Type:** Money (Read Only)

The grand total tax for LineItemCtnr, in purchase currency. Total prices represent the sum of product
 prices, services prices and adjustments.

## Constructor Summary

## Method Summary

### addNote

**Signature:** `addNote(subject : String, text : String) : Note`

Adds a note to the object.

### createBillingAddress

**Signature:** `createBillingAddress() : OrderAddress`

Create a billing address for the LineItemCtnr.

### createBonusProductLineItem

**Signature:** `createBonusProductLineItem(bonusDiscountLineItem : BonusDiscountLineItem, product : Product, optionModel : ProductOptionModel, shipment : Shipment) : ProductLineItem`

Creates a product line item in the container based on the passed Product and BonusDiscountLineItem.

### createCouponLineItem

**Signature:** `createCouponLineItem(couponCode : String, campaignBased : boolean) : CouponLineItem`

Creates a new CouponLineItem for this container based on the supplied coupon code.

### createCouponLineItem

**Signature:** `createCouponLineItem(couponCode : String) : CouponLineItem`

Creates a coupon line item that is not based on the B2C Commerce campaign system and associates it with the specified coupon code.

### createGiftCertificateLineItem

**Signature:** `createGiftCertificateLineItem(amount : Number, recipientEmail : String) : GiftCertificateLineItem`

Creates a gift certificate line item.

### createGiftCertificatePaymentInstrument

**Signature:** `createGiftCertificatePaymentInstrument(giftCertificateCode : String, amount : Money) : OrderPaymentInstrument`

Creates an OrderPaymentInstrument representing a Gift Certificate.

### createPaymentInstrument

**Signature:** `createPaymentInstrument(paymentMethodId : String, amount : Money) : OrderPaymentInstrument`

Creates a payment instrument using the specified payment method id and amount.

### createPaymentInstrumentFromWallet

**Signature:** `createPaymentInstrumentFromWallet(walletPaymentInstrument : CustomerPaymentInstrument, amount : Money) : OrderPaymentInstrument`

Creates a payment instrument using the specified wallet payment instrument and amount.

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String) : PriceAdjustment`

Creates an order price adjustment. The promotion id is mandatory and must not be the ID of any actual promotion defined in B2C Commerce; otherwise an exception is thrown.

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

Creates an order level price adjustment for a specific discount. The promotion id is mandatory and must not be the ID of any actual promotion defined in B2C Commerce; otherwise an exception is thrown.

### createProductLineItem

**Signature:** `createProductLineItem(productID : String, quantity : Quantity, shipment : Shipment) : ProductLineItem`

Creates a new product line item in the container and assigns it to the specified shipment.

### createProductLineItem

**Signature:** `createProductLineItem(productID : String, shipment : Shipment) : ProductLineItem`

Creates a new product line item in the container and assigns it to the specified shipment.

### createProductLineItem

**Signature:** `createProductLineItem(productListItem : ProductListItem, shipment : Shipment) : ProductLineItem`

Creates a new product line item in the basket and assigns it to the specified shipment.

### createProductLineItem

**Signature:** `createProductLineItem(product : Product, optionModel : ProductOptionModel, shipment : Shipment) : ProductLineItem`

Creates a new product line item in the container and assigns it to the specified shipment.

### createShipment

**Signature:** `createShipment(id : String) : Shipment`

Creates a standard shipment for the line item container.

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

Creates a shipping price adjustment to be applied to the container.

### getAdjustedMerchandizeTotalGrossPrice

**Signature:** `getAdjustedMerchandizeTotalGrossPrice() : Money`

Returns the adjusted total gross price (including tax) in purchase currency.

### getAdjustedMerchandizeTotalNetPrice

**Signature:** `getAdjustedMerchandizeTotalNetPrice() : Money`

Returns the total net price (excluding tax) in purchase currency.

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice() : Money`

Returns the adjusted merchandize total price including product-level and order-level adjustments.

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice(applyOrderLevelAdjustments : boolean) : Money`

Returns the adjusted merchandize total price including order-level adjustments if requested.

### getAdjustedMerchandizeTotalTax

**Signature:** `getAdjustedMerchandizeTotalTax() : Money`

Returns the subtotal tax in purchase currency.

### getAdjustedShippingTotalGrossPrice

**Signature:** `getAdjustedShippingTotalGrossPrice() : Money`

Returns the adjusted sum of all shipping line items of the line item container, including tax after shipping adjustments have been applied.

### getAdjustedShippingTotalNetPrice

**Signature:** `getAdjustedShippingTotalNetPrice() : Money`

Returns the sum of all shipping line items of the line item container, excluding tax after shipping adjustments have been applied.

### getAdjustedShippingTotalPrice

**Signature:** `getAdjustedShippingTotalPrice() : Money`

Returns the adjusted shipping total price.

### getAdjustedShippingTotalTax

**Signature:** `getAdjustedShippingTotalTax() : Money`

Returns the tax of all shipping line items of the line item container after shipping adjustments have been applied.

### getAllGiftCertificateLineItems

**Signature:** `getAllGiftCertificateLineItems() : Collection`

Returns all gift certificate line items of the container.

### getAllLineItems

**Signature:** `getAllLineItems() : Collection`

Returns all product, shipping, price adjustment, and gift certificate line items of the line item container.

### getAllProductLineItems

**Signature:** `getAllProductLineItems() : Collection`

Returns all product line items of the container, no matter if they are dependent or independent.

### getAllProductLineItems

**Signature:** `getAllProductLineItems(productID : String) : Collection`

Returns all product line items of the container that have a product ID equal to the specified product ID, no matter if they are dependent or independent.

### getAllProductQuantities

**Signature:** `getAllProductQuantities() : HashMap`

Returns a hash mapping all products in the line item container to their total quantities.

### getAllShippingPriceAdjustments

**Signature:** `getAllShippingPriceAdjustments() : Collection`

Returns the collection of all shipping price adjustments applied somewhere in the container.

### getBillingAddress

**Signature:** `getBillingAddress() : OrderAddress`

Returns the billing address defined for the container.

### getBonusDiscountLineItems

**Signature:** `getBonusDiscountLineItems() : Collection`

Returns an unsorted collection of the the bonus discount line items associated with this container.

### getBonusLineItems

**Signature:** `getBonusLineItems() : Collection`

Returns the collection of product line items that are bonus items (where ProductLineItem.isBonusProductLineItem() is true).

### getBusinessType

**Signature:** `getBusinessType() : EnumValue`

Returns the type of the business this order has been placed in. Possible values are BUSINESS_TYPE_B2C or BUSINESS_TYPE_B2B.

### getChannelType

**Signature:** `getChannelType() : EnumValue`

The channel type defines in which sales channel this order has been created.

### getCouponLineItem

**Signature:** `getCouponLineItem(couponCode : String) : CouponLineItem`

Returns the coupon line item representing the specified coupon code.

### getCouponLineItems

**Signature:** `getCouponLineItems() : Collection`

Returns a sorted collection of the coupon line items in the container.

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Returns the currency code for this line item container.

### getCustomer

**Signature:** `getCustomer() : Customer`

Returns the customer associated with this container.

### getCustomerEmail

**Signature:** `getCustomerEmail() : String`

Returns the email of the customer associated with this container.

### getCustomerName

**Signature:** `getCustomerName() : String`

Returns the name of the customer associated with this container.

### getCustomerNo

**Signature:** `getCustomerNo() : String`

Returns the customer number of the customer associated with this container.

### getDefaultShipment

**Signature:** `getDefaultShipment() : Shipment`

Returns the default shipment of the line item container.

### getEtag

**Signature:** `getEtag() : String`

Returns the Etag of the line item container.

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems() : Collection`

Returns all gift certificate line items of the container.

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems(giftCertificateId : String) : Collection`

Returns all gift certificate line items of the container, no matter if they are dependent or independent.

### getGiftCertificatePaymentInstruments

**Signature:** `getGiftCertificatePaymentInstruments() : Collection`

Returns an unsorted collection of the PaymentInstrument instances that represent GiftCertificates in this container.

### getGiftCertificatePaymentInstruments

**Signature:** `getGiftCertificatePaymentInstruments(giftCertificateCode : String) : Collection`

Returns an unsorted collection containing all PaymentInstruments of type PaymentInstrument.METHOD_GIFT_CERTIFICATE where the specified code is the same code on the payment instrument.

### getGiftCertificateTotalGrossPrice

**Signature:** `getGiftCertificateTotalGrossPrice() : Money`

Returns the total gross price of all gift certificates in the cart.

### getGiftCertificateTotalNetPrice

**Signature:** `getGiftCertificateTotalNetPrice() : Money`

Returns the total net price (excluding tax) of all gift certificates in the cart.

### getGiftCertificateTotalPrice

**Signature:** `getGiftCertificateTotalPrice() : Money`

Returns the gift certificate total price.

### getGiftCertificateTotalTax

**Signature:** `getGiftCertificateTotalTax() : Money`

Returns the total tax of all gift certificates in the cart.

### getMerchandizeTotalGrossPrice

**Signature:** `getMerchandizeTotalGrossPrice() : Money`

Returns the total gross price (including tax) in purchase currency.

### getMerchandizeTotalNetPrice

**Signature:** `getMerchandizeTotalNetPrice() : Money`

Returns the total net price (excluding tax) in purchase currency.

### getMerchandizeTotalPrice

**Signature:** `getMerchandizeTotalPrice() : Money`

Returns the merchandize total price.

### getMerchandizeTotalTax

**Signature:** `getMerchandizeTotalTax() : Money`

Returns the total tax in purchase currency.

### getNotes

**Signature:** `getNotes() : List`

Returns the list of notes for this object, ordered by creation time from oldest to newest.

### getPaymentInstrument

**Signature:** `getPaymentInstrument() : OrderPaymentInstrument`

Returns the payment instrument of the line item container or null.

### getPaymentInstruments

**Signature:** `getPaymentInstruments() : Collection`

Returns an unsorted collection of the payment instruments in this container.

### getPaymentInstruments

**Signature:** `getPaymentInstruments(paymentMethodID : String) : Collection`

Returns an unsorted collection of PaymentInstrument instances based on the specified payment method ID.

### getPriceAdjustmentByPromotionID

**Signature:** `getPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

Returns the price adjustment associated to the specified promotion ID.

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

Returns the collection of price adjustments that have been applied to the totals such as promotion on the purchase value (i.e.

### getProductLineItems

**Signature:** `getProductLineItems() : Collection`

Returns the product line items of the container that are not dependent on other product line items.

### getProductLineItems

**Signature:** `getProductLineItems(productID : String) : Collection`

Returns the product line items of the container that have a product ID equal to the specified product ID and that are not dependent on other product line items.

### getProductQuantities

**Signature:** `getProductQuantities() : HashMap`

Returns a hash map of all products in the line item container and their total quantities.

### getProductQuantities

**Signature:** `getProductQuantities(includeBonusProducts : boolean) : HashMap`

Returns a hash map of all products in the line item container and their total quantities.

### getProductQuantityTotal

**Signature:** `getProductQuantityTotal() : Number`

Returns the total quantity of all product line items.

### getShipment

**Signature:** `getShipment(id : String) : Shipment`

Returns the shipment for the specified ID or null if no shipment with this ID exists in the line item container.

### getShipments

**Signature:** `getShipments() : Collection`

Returns all shipments of the line item container. The first shipment in the returned collection is the default shipment (shipment ID always set to "me").

### getShippingPriceAdjustmentByPromotionID

**Signature:** `getShippingPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

Returns the shipping price adjustment associated with the specified promotion ID.

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

Returns the of shipping price adjustments applied to the shipping total of the container.

### getShippingTotalGrossPrice

**Signature:** `getShippingTotalGrossPrice() : Money`

Returns the sum of all shipping line items of the line item container, including tax before shipping adjustments have been applied.

### getShippingTotalNetPrice

**Signature:** `getShippingTotalNetPrice() : Money`

Returns the sum of all shipping line items of the line item container, excluding tax before shipping adjustments have been applied.

### getShippingTotalPrice

**Signature:** `getShippingTotalPrice() : Money`

Returns the shipping total price.

### getShippingTotalTax

**Signature:** `getShippingTotalTax() : Money`

Returns the tax of all shipping line items of the line item container before shipping adjustments have been applied.

### getTaxTotalsPerTaxRate

**Signature:** `getTaxTotalsPerTaxRate() : SortedMap`

This method returns a SortedMap in which the keys are Decimal tax rates and the values are Money total tax for the tax rate.

### getTotalGrossPrice

**Signature:** `getTotalGrossPrice() : Money`

Returns the grand total price gross of tax for LineItemCtnr, in purchase currency.

### getTotalNetPrice

**Signature:** `getTotalNetPrice() : Money`

Returns the grand total price for LineItemCtnr net of tax, in purchase currency.

### getTotalTax

**Signature:** `getTotalTax() : Money`

Returns the grand total tax for LineItemCtnr, in purchase currency.

### isExternallyTaxed

**Signature:** `isExternallyTaxed() : boolean`

Use this method to check whether the LineItemCtnr is calculated based on external tax tables.

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

Use this method to check if the LineItemCtnr was calculated with grouped taxation calculation.

### removeAllPaymentInstruments

**Signature:** `removeAllPaymentInstruments() : void`

Removes the all Payment Instruments from this container and deletes the Payment Instruments.

### removeBonusDiscountLineItem

**Signature:** `removeBonusDiscountLineItem(bonusDiscountLineItem : BonusDiscountLineItem) : void`

Removes the specified bonus discount line item from the line item container.

### removeCouponLineItem

**Signature:** `removeCouponLineItem(couponLineItem : CouponLineItem) : void`

Removes the specified coupon line item from the line item container.

### removeGiftCertificateLineItem

**Signature:** `removeGiftCertificateLineItem(giftCertificateLineItem : GiftCertificateLineItem) : void`

Removes the specified gift certificate line item from the line item container.

### removeNote

**Signature:** `removeNote(note : Note) : void`

Removes a note from this line item container and deletes it.

### removePaymentInstrument

**Signature:** `removePaymentInstrument(pi : PaymentInstrument) : void`

Removes the specified Payment Instrument from this container and deletes the Payment Instrument.

### removePriceAdjustment

**Signature:** `removePriceAdjustment(priceAdjustment : PriceAdjustment) : void`

Removes the specified price adjustment line item from the line item container.

### removeProductLineItem

**Signature:** `removeProductLineItem(productLineItem : ProductLineItem) : void`

Removes the specified product line item from the line item container.

### removeShipment

**Signature:** `removeShipment(shipment : Shipment) : void`

Removes the specified shipment and all associated product, gift certificate, shipping and price adjustment line items from the line item container.

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

Removes the specified shipping price adjustment line item from the line item container.

### setCustomerEmail

**Signature:** `setCustomerEmail(aValue : String) : void`

Sets the email address of the customer associated with this container.

### setCustomerName

**Signature:** `setCustomerName(aValue : String) : void`

Sets the name of the customer associated with this container.

### updateOrderLevelPriceAdjustmentTax

**Signature:** `updateOrderLevelPriceAdjustmentTax() : void`

Calculates the tax for all shipping and order-level merchandise price adjustments in this LineItemCtnr.

### updateTotals

**Signature:** `updateTotals() : void`

Recalculates the totals of the line item container.

### verifyPriceAdjustmentLimits

**Signature:** `verifyPriceAdjustmentLimits() : Status`

Verifies whether the manual price adjustments made for the line item container exceed the corresponding limits for the current user and the current site.

## Method Detail

## Method Details

### addNote

**Signature:** `addNote(subject : String, text : String) : Note`

**Description:** Adds a note to the object.

**Parameters:**

- `subject`: The subject of the note.
- `text`: The text of the note. Must be no more than 4000 characters or an exception is thrown.

**Returns:**

the added note.

---

### createBillingAddress

**Signature:** `createBillingAddress() : OrderAddress`

**Description:** Create a billing address for the LineItemCtnr. A LineItemCtnr (e.g. basket) initially has no billing address. This method creates a billing address for the LineItemCtnr and replaces an existing billing address.

**Returns:**

The new billing address of the LineItemCtnr.

---

### createBonusProductLineItem

**Signature:** `createBonusProductLineItem(bonusDiscountLineItem : BonusDiscountLineItem, product : Product, optionModel : ProductOptionModel, shipment : Shipment) : ProductLineItem`

**Description:** Creates a product line item in the container based on the passed Product and BonusDiscountLineItem. The product must be assigned to the current site catalog and must also be a bonus product of the specified BonusDiscountLineItem or an exception is thrown. The line item is always created in the default shipment. If successful, the operation always creates a new ProductLineItem and never simply increments the quantity of an existing ProductLineItem. An option model can optionally be specified.

**Parameters:**

- `bonusDiscountLineItem`: Line item representing an applied BonusChoiceDiscount in the LineItemCtnr, must not be null.
- `product`: Product The product to add to the LineItemCtnr. Must not be null and must be a bonus product of bonusDiscountLineItem.
- `optionModel`: ProductOptionModel or null.
- `shipment`: The shipment to add the bonus product to. If null, the product is added to the default shipment.

---

### createCouponLineItem

**Signature:** `createCouponLineItem(couponCode : String, campaignBased : boolean) : CouponLineItem`

**Description:** Creates a new CouponLineItem for this container based on the supplied coupon code. The created coupon line item is based on the B2C Commerce campaign system if campaignBased parameter is true. In that case, if the supplied coupon code is not valid, APIException with type 'CreateCouponLineItemException' is thrown. If you want to create a custom coupon line item, you must call this method with campaignBased = false or to use createCouponLineItem(String). Example: try { var cli : CouponLineItem = basket.createCouponLineItem(couponCode, true); } catch (e if e instanceof APIException && e.type === 'CreateCouponLineItemException') if (e.errorCode == CouponStatusCodes.COUPON_CODE_ALREADY_IN_BASKET) { ... } } An dw.order.CreateCouponLineItemException is thrown in case of campaignBased = true only. Indicates that the provided coupon code is not a valid coupon code to create a coupon line item based on the B2C Commerce campaign system. The error code property (CreateCouponLineItemException.errorCode) will be set to one of the following values: CouponStatusCodes.COUPON_CODE_ALREADY_IN_BASKET = Indicates that coupon code has already been added to basket. CouponStatusCodes.COUPON_ALREADY_IN_BASKET = Indicates that another code of the same MultiCode/System coupon has already been added to basket. CouponStatusCodes.COUPON_CODE_ALREADY_REDEEMED = Indicates that code of MultiCode/System coupon has already been redeemed. CouponStatusCodes.COUPON_CODE_UNKNOWN = Indicates that coupon not found for given coupon code or that the code itself was not found. CouponStatusCodes.COUPON_DISABLED = Indicates that coupon is not enabled. CouponStatusCodes.REDEMPTION_LIMIT_EXCEEDED = Indicates that number of redemptions per code exceeded. CouponStatusCodes.CUSTOMER_REDEMPTION_LIMIT_EXCEEDED = Indicates that number of redemptions per code and customer exceeded. CouponStatusCodes.TIMEFRAME_REDEMPTION_LIMIT_EXCEEDED = Indicates that number of redemptions per code, customer and time exceeded. CouponStatusCodes.NO_ACTIVE_PROMOTION = Indicates that coupon is not assigned to an active promotion.

**Parameters:**

- `couponCode`: the coupon code to be represented by the coupon line item
- `campaignBased`: the flag if the created coupon line item should be based on the B2C Commerce campaign system

**Returns:**

the created coupon line item

---

### createCouponLineItem

**Signature:** `createCouponLineItem(couponCode : String) : CouponLineItem`

**Description:** Creates a coupon line item that is not based on the B2C Commerce campaign system and associates it with the specified coupon code. There may not be any other coupon line item in the container with the specific coupon code, otherwise an exception is thrown. If you want to create a coupon line item based on the B2C Commerce campaign system, you must use createCouponLineItem(String, Boolean) with campaignBased = true.

**Parameters:**

- `couponCode`: couponCode represented by the coupon line item.

**Returns:**

New coupon line item.

---

### createGiftCertificateLineItem

**Signature:** `createGiftCertificateLineItem(amount : Number, recipientEmail : String) : GiftCertificateLineItem`

**Description:** Creates a gift certificate line item.

**Parameters:**

- `amount`: the amount of the gift certificate - mandatory
- `recipientEmail`: the recipient's email address - mandatory

**Returns:**

The new gift certificate line item

---

### createGiftCertificatePaymentInstrument

**Signature:** `createGiftCertificatePaymentInstrument(giftCertificateCode : String, amount : Money) : OrderPaymentInstrument`

**Description:** Creates an OrderPaymentInstrument representing a Gift Certificate. The amount is set on a PaymentTransaction that is accessible via the OrderPaymentInstrument. By default, the status of the PaymentTransaction is set to CREATE. The PaymentTransaction must be processed at a later time.

**Parameters:**

- `giftCertificateCode`: the redemption code of the Gift Certificate.
- `amount`: the amount to set on the PaymentTransaction. If the OrderPaymentInstrument is actually redeemed, this is the amount that will be deducted from the Gift Certificate.

**Returns:**

the OrderPaymentInstrument.

---

### createPaymentInstrument

**Signature:** `createPaymentInstrument(paymentMethodId : String, amount : Money) : OrderPaymentInstrument`

**Description:** Creates a payment instrument using the specified payment method id and amount. The amount is set on the PaymentTransaction that is attached to the payment instrument.

**Parameters:**

- `paymentMethodId`: The payment method id. See the PaymentInstrument class for payment method types
- `amount`: The payment amount or null

**Returns:**

The new payment instrument

---

### createPaymentInstrumentFromWallet

**Signature:** `createPaymentInstrumentFromWallet(walletPaymentInstrument : CustomerPaymentInstrument, amount : Money) : OrderPaymentInstrument`

**Description:** Creates a payment instrument using the specified wallet payment instrument and amount. The amount is set on the PaymentTransaction that is attached to the payment instrument. All data from the wallet payment instrument will be copied over to the created payment instrument.

**Parameters:**

- `walletPaymentInstrument`: The payment instrument from the customer's walled.
- `amount`: The payment amount or null

**Returns:**

The new payment instrument

---

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String) : PriceAdjustment`

**Description:** Creates an order price adjustment. The promotion id is mandatory and must not be the ID of any actual promotion defined in B2C Commerce; otherwise an exception is thrown.

**Parameters:**

- `promotionID`: Promotion ID

**Returns:**

The new price adjustment

---

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

**Description:** Creates an order level price adjustment for a specific discount. The promotion id is mandatory and must not be the ID of any actual promotion defined in B2C Commerce; otherwise an exception is thrown. The possible discount types are supported: PercentageDiscount and AmountDiscount. Examples: var myOrder : dw.order.Order; // assume known var paTenPercent : dw.order.PriceAdjustment = myOrder.createPriceAdjustment("myPromotionID1", new dw.campaign.PercentageDiscount(10)); var paReduceBy20 : dw.order.PriceAdjustment = myOrder.createPriceAdjustment("myPromotionID2", new dw.campaign.AmountDiscount(20);

**Parameters:**

- `promotionID`: Promotion ID
- `discount`: The discount

**Returns:**

The new price adjustment

---

### createProductLineItem

**Signature:** `createProductLineItem(productID : String, quantity : Quantity, shipment : Shipment) : ProductLineItem`

**Description:** Creates a new product line item in the container and assigns it to the specified shipment. If the specified productID represents a product in the site catalog, the method will associate the product line item with that catalog product and will copy all order-relevant information, like the quantity unit, from the catalog product. If the specified productID does not represent a product of the site catalog, the method creates a new product line item and initializes it with the specified product ID and quantity. If the passed in quantity value is not a positive integer, it will be rounded to the nearest positive integer. The minimum order quantity and step quantity will be set to 1.0. For catalog products, the method follows the configured 'Add2Basket' strategy to either increment the quantity of an existing product line item or create a new product line item for the same product. For non-catalog products, the method creates a new product line item no matter if the same product is already in the line item container. If a negative quantity is specified, it is automatically changed to 1.0.

**Deprecated:**

Use createProductLineItem(String, Shipment) or ProductLineItem.updateQuantity(Number) instead.

**Parameters:**

- `productID`: The product ID.
- `quantity`: The quantity of the product.
- `shipment`: Shipment

**Returns:**

the product line item

---

### createProductLineItem

**Signature:** `createProductLineItem(productID : String, shipment : Shipment) : ProductLineItem`

**Description:** Creates a new product line item in the container and assigns it to the specified shipment. If the specified productID represents a product in the site catalog, the method will associate the product line item with that catalog product and will copy all order-relevant information, like the quantity unit, from the catalog product. The quantity of the product line item is initialized with 1.0 or - if defined - the minimum order quantity of the product. If the product represents a product in the site catalog and is an option product, the product is added with it's default option values. If the specified productID does not represent a product of the site catalog, the method creates a new product line item and initializes it with the specified product ID and with a quantity, minimum order quantity, and step quantity value of 1.0. If the provided SKU references a product that is not available as described in method ProductLineItem.isCatalogProduct(), the new product line item is considered a non-catalog product line item without a connection to a product. Such product line items are not included in reservation requests in either OCI-based inventory or eCom-based inventory when calling Basket.reserveInventory() or OrderMgr.createOrder(Basket).

**Parameters:**

- `productID`: The product ID.
- `shipment`: Shipment

**Returns:**

The new product line item

---

### createProductLineItem

**Signature:** `createProductLineItem(productListItem : ProductListItem, shipment : Shipment) : ProductLineItem`

**Description:** Creates a new product line item in the basket and assigns it to the specified shipment. If the product list item references a product in the site catalog, the method will associate the product line item with that catalog product and will copy all order-relevant information, like the quantity unit, from the catalog product. The quantity of the product line item is initialized with 1.0 or - if defined - the minimum order quantity of the product. If the product list item references an option product, the option values are copied from the product list item. If the product list item is associated with an existing product line item, and the BasketAddProductBehaviour setting is MergeQuantities, then the product line item quantity is increased by 1.0 or, if defined, the minimum order quantity of the product. An exception is thrown if the line item container is no basket. the type of the product list item is not PRODUCT. the product list item references a product which is not assigned to the site catalog.

**Parameters:**

- `productListItem`: the product list item
- `shipment`: the shipment the created product line item will be assigned to

**Returns:**

The new product line item

---

### createProductLineItem

**Signature:** `createProductLineItem(product : Product, optionModel : ProductOptionModel, shipment : Shipment) : ProductLineItem`

**Description:** Creates a new product line item in the container and assigns it to the specified shipment. An option model can be specified. Please note that the product must be assigned to the current site catalog.

**Parameters:**

- `product`: Product
- `optionModel`: ProductOptionModel or null
- `shipment`: Shipment

---

### createShipment

**Signature:** `createShipment(id : String) : Shipment`

**Description:** Creates a standard shipment for the line item container. The specified ID must not yet be in use for another shipment of this line item container.

**Parameters:**

- `id`: ID of the shipment.

---

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

**Description:** Creates a shipping price adjustment to be applied to the container. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce; otherwise the method will throw an exception. If there already exists a shipping price adjustment referring to the specified promotion ID, an exception is thrown.

**Parameters:**

- `promotionID`: Promotion ID

**Returns:**

The new price adjustment

---

### getAdjustedMerchandizeTotalGrossPrice

**Signature:** `getAdjustedMerchandizeTotalGrossPrice() : Money`

**Description:** Returns the adjusted total gross price (including tax) in purchase currency. Adjusted merchandize prices represent the sum of product prices before services such as shipping, but after product-level and order-level adjustments.

**Returns:**

the adjusted total gross price (including tax) in purchase currency.

---

### getAdjustedMerchandizeTotalNetPrice

**Signature:** `getAdjustedMerchandizeTotalNetPrice() : Money`

**Description:** Returns the total net price (excluding tax) in purchase currency. Adjusted merchandize prices represent the sum of product prices before services such as shipping, but after product-level and order-level adjustments.

**Returns:**

the total net price (excluding tax) in purchase currency.

---

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice() : Money`

**Description:** Returns the adjusted merchandize total price including product-level and order-level adjustments. If the line item container is based on net pricing the adjusted merchandize total net price is returned. If the line item container is based on gross pricing the adjusted merchandize total gross price is returned.

**Returns:**

either the adjusted merchandize total net or gross price

---

### getAdjustedMerchandizeTotalPrice

**Signature:** `getAdjustedMerchandizeTotalPrice(applyOrderLevelAdjustments : boolean) : Money`

**Description:** Returns the adjusted merchandize total price including order-level adjustments if requested. If the line item container is based on net pricing the adjusted merchandize total net price is returned. If the line item container is based on gross pricing the adjusted merchandize total gross price is returned.

**Parameters:**

- `applyOrderLevelAdjustments`: controls if order-level price adjustements are applied. If true, the price that is returned includes order-level price adjustments. If false, only product-level price adjustments are applied.

**Returns:**

a price representing the adjusted merchandize total controlled by the applyOrderLevelAdjustments parameter.

---

### getAdjustedMerchandizeTotalTax

**Signature:** `getAdjustedMerchandizeTotalTax() : Money`

**Description:** Returns the subtotal tax in purchase currency. Adjusted merchandize prices represent the sum of product prices before services such as shipping have been added, but after adjustment from promotions have been added.

**Returns:**

the subtotal tax in purchase currency.

---

### getAdjustedShippingTotalGrossPrice

**Signature:** `getAdjustedShippingTotalGrossPrice() : Money`

**Description:** Returns the adjusted sum of all shipping line items of the line item container, including tax after shipping adjustments have been applied.

**Returns:**

the adjusted sum of all shipping line items of the line item container, including tax after shipping adjustments have been applied.

---

### getAdjustedShippingTotalNetPrice

**Signature:** `getAdjustedShippingTotalNetPrice() : Money`

**Description:** Returns the sum of all shipping line items of the line item container, excluding tax after shipping adjustments have been applied.

**Returns:**

the sum of all shipping line items of the line item container, excluding tax after shipping adjustments have been applied.

---

### getAdjustedShippingTotalPrice

**Signature:** `getAdjustedShippingTotalPrice() : Money`

**Description:** Returns the adjusted shipping total price. If the line item container is based on net pricing the adjusted shipping total net price is returned. If the line item container is based on gross pricing the adjusted shipping total gross price is returned.

**Returns:**

either the adjusted shipping total net or gross price

---

### getAdjustedShippingTotalTax

**Signature:** `getAdjustedShippingTotalTax() : Money`

**Description:** Returns the tax of all shipping line items of the line item container after shipping adjustments have been applied.

**Returns:**

the tax of all shipping line items of the line item container after shipping adjustments have been applied.

---

### getAllGiftCertificateLineItems

**Signature:** `getAllGiftCertificateLineItems() : Collection`

**Description:** Returns all gift certificate line items of the container.

**Deprecated:**

Use getGiftCertificateLineItems() to get the collection instead.

**Returns:**

A collection of all GiftCertificateLineItems of the container.

---

### getAllLineItems

**Signature:** `getAllLineItems() : Collection`

**Description:** Returns all product, shipping, price adjustment, and gift certificate line items of the line item container.

**Returns:**

A collection of all product, shipping, price adjustment, and gift certificate line items of the container, in that order.

---

### getAllProductLineItems

**Signature:** `getAllProductLineItems() : Collection`

**Description:** Returns all product line items of the container, no matter if they are dependent or independent. This includes option, bundled and bonus line items.

**Returns:**

An unsorted collection of all ProductLineItem instances of the container.

---

### getAllProductLineItems

**Signature:** `getAllProductLineItems(productID : String) : Collection`

**Description:** Returns all product line items of the container that have a product ID equal to the specified product ID, no matter if they are dependent or independent. This includes option, bundled and bonus line items.

**Parameters:**

- `productID`: The product ID used to filter the product line items.

**Returns:**

An unsorted collection of all ProductLineItem instances which have the specified product ID.

---

### getAllProductQuantities

**Signature:** `getAllProductQuantities() : HashMap`

**Description:** Returns a hash mapping all products in the line item container to their total quantities. The total product quantity is used chiefly to validate the availability of the items in the cart. This method is not appropriate to look up prices because it returns products such as bundled line items which are included in the price of their parent and therefore have no corresponding price. The method counts all direct product line items, plus dependent product line items that are not option line items. It also excludes product line items that are not associated to any catalog product.

**Returns:**

A map of products and their total quantities.

---

### getAllShippingPriceAdjustments

**Signature:** `getAllShippingPriceAdjustments() : Collection`

**Description:** Returns the collection of all shipping price adjustments applied somewhere in the container. This can be adjustments applied to individual shipments or to the container itself. Note that the promotions engine only applies shipping price adjustments to the the default shipping line item of shipments, and never to the container.

**Returns:**

an unsorted collection of the shipping PriceAdjustment instances associated with this container.

**See Also:**

getShippingPriceAdjustments()

---

### getBillingAddress

**Signature:** `getBillingAddress() : OrderAddress`

**Description:** Returns the billing address defined for the container. Returns null if no billing address has been created yet.

**Returns:**

the billing address or null.

---

### getBonusDiscountLineItems

**Signature:** `getBonusDiscountLineItems() : Collection`

**Description:** Returns an unsorted collection of the the bonus discount line items associated with this container.

**Returns:**

An unsorted collection of BonusDiscountLine instances in the container.

---

### getBonusLineItems

**Signature:** `getBonusLineItems() : Collection`

**Description:** Returns the collection of product line items that are bonus items (where ProductLineItem.isBonusProductLineItem() is true).

**Returns:**

the collection of product line items that are bonus items.

---

### getBusinessType

**Signature:** `getBusinessType() : EnumValue`

**Description:** Returns the type of the business this order has been placed in. Possible values are BUSINESS_TYPE_B2C or BUSINESS_TYPE_B2B.

**Returns:**

the type of the business this order has been placed in. or null, if the business type is not set

---

### getChannelType

**Signature:** `getChannelType() : EnumValue`

**Description:** The channel type defines in which sales channel this order has been created. This can be used to distinguish order placed through Storefront, Call Center or Marketplace. Possible values are CHANNEL_TYPE_STOREFRONT, CHANNEL_TYPE_CALLCENTER, CHANNEL_TYPE_MARKETPLACE, CHANNEL_TYPE_DSS, CHANNEL_TYPE_STORE, CHANNEL_TYPE_PINTEREST, CHANNEL_TYPE_TWITTER, CHANNEL_TYPE_FACEBOOKADS, CHANNEL_TYPE_SUBSCRIPTIONS, CHANNEL_TYPE_ONLINERESERVATION, CHANNEL_TYPE_CUSTOMERSERVICECENTER, CHANNEL_TYPE_INSTAGRAMCOMMERCE, CHANNEL_TYPE_GOOGLE, CHANNEL_TYPE_YOUTUBE, CHANNEL_TYPE_TIKTOK, CHANNEL_TYPE_SNAPCHAT, CHANNEL_TYPE_WHATSAPP

**Returns:**

the sales channel this order has been placed in or null, if the order channel is not set

---

### getCouponLineItem

**Signature:** `getCouponLineItem(couponCode : String) : CouponLineItem`

**Description:** Returns the coupon line item representing the specified coupon code.

**Parameters:**

- `couponCode`: the coupon code.

**Returns:**

coupon line item or null.

---

### getCouponLineItems

**Signature:** `getCouponLineItems() : Collection`

**Description:** Returns a sorted collection of the coupon line items in the container. The coupon line items are returned in the order they were added to container.

**Returns:**

A sorted list of the CouponLineItem instances in the container.

---

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Returns the currency code for this line item container. The currency code is a 3-character currency mnemonic such as 'USD' or 'EUR'. The currency code represents the currency in which the calculation is made, and in which the buyer sees all prices in the store front.

**Returns:**

the currency code for this line item container.

---

### getCustomer

**Signature:** `getCustomer() : Customer`

**Description:** Returns the customer associated with this container.

**Returns:**

the customer associated with this container.

---

### getCustomerEmail

**Signature:** `getCustomerEmail() : String`

**Description:** Returns the email of the customer associated with this container.

**Returns:**

the email of the customer associated with this container.

---

### getCustomerName

**Signature:** `getCustomerName() : String`

**Description:** Returns the name of the customer associated with this container.

**Returns:**

the name of the customer associated with this container.

---

### getCustomerNo

**Signature:** `getCustomerNo() : String`

**Description:** Returns the customer number of the customer associated with this container.

**Returns:**

the customer number of the customer associated with this container.

---

### getDefaultShipment

**Signature:** `getDefaultShipment() : Shipment`

**Description:** Returns the default shipment of the line item container. Every basket and order has a default shipment with the id "me". If you call a process that accesses a shipment, and you don't specify the shipment, then the process uses the default shipment. You can't remove a default shipment. Calling removeShipment(Shipment) on it throws an exception.

**Returns:**

the default shipment of the container

---

### getEtag

**Signature:** `getEtag() : String`

**Description:** Returns the Etag of the line item container. The Etag is a hash that represents the overall container state including any associated objects like line items.

**Returns:**

the Etag value

---

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems() : Collection`

**Description:** Returns all gift certificate line items of the container.

**Returns:**

A collection of all GiftCertificateLineItems of the container.

---

### getGiftCertificateLineItems

**Signature:** `getGiftCertificateLineItems(giftCertificateId : String) : Collection`

**Description:** Returns all gift certificate line items of the container, no matter if they are dependent or independent.

**Parameters:**

- `giftCertificateId`: the gift certificate identifier.

**Returns:**

A collection of all GiftCertificateLineItems of the container.

---

### getGiftCertificatePaymentInstruments

**Signature:** `getGiftCertificatePaymentInstruments() : Collection`

**Description:** Returns an unsorted collection of the PaymentInstrument instances that represent GiftCertificates in this container.

**Returns:**

an unsorted collection containing the set of PaymentInstrument instances that represent GiftCertificates.

---

### getGiftCertificatePaymentInstruments

**Signature:** `getGiftCertificatePaymentInstruments(giftCertificateCode : String) : Collection`

**Description:** Returns an unsorted collection containing all PaymentInstruments of type PaymentInstrument.METHOD_GIFT_CERTIFICATE where the specified code is the same code on the payment instrument.

**Parameters:**

- `giftCertificateCode`: the gift certificate code.

**Returns:**

an unsorted collection containing all PaymentInstruments of type PaymentInstrument.METHOD_GIFT_CERTIFICATE where the specified code is the same code on the payment instrument.

---

### getGiftCertificateTotalGrossPrice

**Signature:** `getGiftCertificateTotalGrossPrice() : Money`

**Description:** Returns the total gross price of all gift certificates in the cart. Should usually be equal to total net price.

**Returns:**

the total gross price of all gift certificate line items

---

### getGiftCertificateTotalNetPrice

**Signature:** `getGiftCertificateTotalNetPrice() : Money`

**Description:** Returns the total net price (excluding tax) of all gift certificates in the cart. Should usually be equal to total gross price.

**Returns:**

the total net price of all gift certificate line items

---

### getGiftCertificateTotalPrice

**Signature:** `getGiftCertificateTotalPrice() : Money`

**Description:** Returns the gift certificate total price. If the line item container is based on net pricing the gift certificate total net price is returned. If the line item container is based on gross pricing the gift certificate total gross price is returned.

**Returns:**

either the gift certificate total net or gross price

---

### getGiftCertificateTotalTax

**Signature:** `getGiftCertificateTotalTax() : Money`

**Description:** Returns the total tax of all gift certificates in the cart. Should usually be 0.0.

**Returns:**

the total tax of all gift certificate line items

---

### getMerchandizeTotalGrossPrice

**Signature:** `getMerchandizeTotalGrossPrice() : Money`

**Description:** Returns the total gross price (including tax) in purchase currency. Merchandize total prices represent the sum of product prices before services such as shipping or adjustment from promotions have been added.

**Returns:**

the total gross price (including tax) in purchase currency.

---

### getMerchandizeTotalNetPrice

**Signature:** `getMerchandizeTotalNetPrice() : Money`

**Description:** Returns the total net price (excluding tax) in purchase currency. Merchandize total prices represent the sum of product prices before services such as shipping or adjustment from promotion have been added.

**Returns:**

the total net price (excluding tax) in purchase currency.

---

### getMerchandizeTotalPrice

**Signature:** `getMerchandizeTotalPrice() : Money`

**Description:** Returns the merchandize total price. If the line item container is based on net pricing the merchandize total net price is returned. If the line item container is based on gross pricing the merchandize total gross price is returned.

**Returns:**

either the merchandize total net or gross price

---

### getMerchandizeTotalTax

**Signature:** `getMerchandizeTotalTax() : Money`

**Description:** Returns the total tax in purchase currency. Merchandize total prices represent the sum of product prices before services such as shipping or adjustment from promotions have been added.

**Returns:**

the total tax in purchase currency.

---

### getNotes

**Signature:** `getNotes() : List`

**Description:** Returns the list of notes for this object, ordered by creation time from oldest to newest.

**Returns:**

the list of notes for this object, ordered by creation time from oldest to newest.

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument() : OrderPaymentInstrument`

**Description:** Returns the payment instrument of the line item container or null. This method is deprecated. You should use getPaymentInstruments() or getGiftCertificatePaymentInstruments() instead.

**Deprecated:**

Use getPaymentInstruments() or getGiftCertificatePaymentInstruments() to get the set of payment instruments.

**Returns:**

the order payment instrument of the line item container or null.

---

### getPaymentInstruments

**Signature:** `getPaymentInstruments() : Collection`

**Description:** Returns an unsorted collection of the payment instruments in this container.

**Returns:**

an unsorted collection containing the set of PaymentInstrument instances associated with this container.

---

### getPaymentInstruments

**Signature:** `getPaymentInstruments(paymentMethodID : String) : Collection`

**Description:** Returns an unsorted collection of PaymentInstrument instances based on the specified payment method ID.

**Parameters:**

- `paymentMethodID`: the ID of the payment method used.

**Returns:**

an unsorted collection of OrderPaymentInstrument instances based on the payment method.

---

### getPriceAdjustmentByPromotionID

**Signature:** `getPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

**Description:** Returns the price adjustment associated to the specified promotion ID.

**Parameters:**

- `promotionID`: Promotion id

**Returns:**

The price adjustment associated with the specified promotion ID or null if none was found.

---

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

**Description:** Returns the collection of price adjustments that have been applied to the totals such as promotion on the purchase value (i.e. $10 Off or 10% Off). The price adjustments are sorted by the order in which they were applied to the order by the promotions engine.

**Returns:**

the sorted collection of PriceAdjustment instances.

---

### getProductLineItems

**Signature:** `getProductLineItems() : Collection`

**Description:** Returns the product line items of the container that are not dependent on other product line items. This includes line items representing bonus products in the container but excludes option, bundled, and bonus line items. The returned collection is sorted by the position attribute of the product line items.

**Returns:**

A sorted collection of ProductLineItem instances which are not dependent on other product line items.

---

### getProductLineItems

**Signature:** `getProductLineItems(productID : String) : Collection`

**Description:** Returns the product line items of the container that have a product ID equal to the specified product ID and that are not dependent on other product line items. This includes line items representing bonus products in the container, but excludes option, bundled and bonus line items. The returned collection is sorted by the position attribute of the product line items.

**Parameters:**

- `productID`: The Product ID used to filter the product line items.

**Returns:**

A sorted collection of ProductLineItem instances which have the specified product ID and are not dependent on other product line items.

---

### getProductQuantities

**Signature:** `getProductQuantities() : HashMap`

**Description:** Returns a hash map of all products in the line item container and their total quantities. The total product quantity is for example used to lookup the product price. The method counts all direct product line items, plus dependent product line items that are not bundled line items and no option line items. It also excludes product line items that are not associated to any catalog product, and bonus product line items.

**Returns:**

a map of products and their total quantities.

**See Also:**

getProductQuantities(Boolean)

---

### getProductQuantities

**Signature:** `getProductQuantities(includeBonusProducts : boolean) : HashMap`

**Description:** Returns a hash map of all products in the line item container and their total quantities. The total product quantity is for example used to lookup the product price in the cart. The method counts all direct product line items, plus dependent product line items that are not bundled line items and no option line items. It also excludes product line items that are not associated to any catalog product. If the parameter 'includeBonusProducts' is set to true, the method also counts bonus product line items.

**Parameters:**

- `includeBonusProducts`: if true also bonus product line item are counted

**Returns:**

A map of products and their total quantities.

---

### getProductQuantityTotal

**Signature:** `getProductQuantityTotal() : Number`

**Description:** Returns the total quantity of all product line items. Not included are bundled line items and option line items.

**Returns:**

The total quantity of all line items of the container.

---

### getShipment

**Signature:** `getShipment(id : String) : Shipment`

**Description:** Returns the shipment for the specified ID or null if no shipment with this ID exists in the line item container. Using "me" always returns the default shipment.

**Parameters:**

- `id`: the shipment identifier

**Returns:**

the shipment or null

---

### getShipments

**Signature:** `getShipments() : Collection`

**Description:** Returns all shipments of the line item container. The first shipment in the returned collection is the default shipment (shipment ID always set to "me"). All other shipments are sorted ascending by shipment ID.

**Returns:**

all shipments of the line item container

---

### getShippingPriceAdjustmentByPromotionID

**Signature:** `getShippingPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

**Description:** Returns the shipping price adjustment associated with the specified promotion ID.

**Parameters:**

- `promotionID`: Promotion id

**Returns:**

The price adjustment associated with the specified promotion ID or null if none was found.

---

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

**Description:** Returns the of shipping price adjustments applied to the shipping total of the container. Note that the promotions engine only applies shipping price adjustments to the the default shipping line item of shipments, and never to the container.

**Returns:**

a collection of shipping price adjustments.

**See Also:**

getAllShippingPriceAdjustments()

---

### getShippingTotalGrossPrice

**Signature:** `getShippingTotalGrossPrice() : Money`

**Description:** Returns the sum of all shipping line items of the line item container, including tax before shipping adjustments have been applied.

**Returns:**

the sum of all shipping line items of the line item container, including tax before shipping adjustments have been applied.

---

### getShippingTotalNetPrice

**Signature:** `getShippingTotalNetPrice() : Money`

**Description:** Returns the sum of all shipping line items of the line item container, excluding tax before shipping adjustments have been applied.

**Returns:**

the sum of all shipping line items of the line item container, excluding tax before shipping adjustments have been applied.

---

### getShippingTotalPrice

**Signature:** `getShippingTotalPrice() : Money`

**Description:** Returns the shipping total price. If the line item container is based on net pricing the shipping total net price is returned. If the line item container is based on gross pricing the shipping total gross price is returned.

**Returns:**

either the shipping total net or gross price

---

### getShippingTotalTax

**Signature:** `getShippingTotalTax() : Money`

**Description:** Returns the tax of all shipping line items of the line item container before shipping adjustments have been applied.

**Returns:**

the tax of all shipping line items of the line item container before shipping adjustments have been applied.

---

### getTaxTotalsPerTaxRate

**Signature:** `getTaxTotalsPerTaxRate() : SortedMap`

**Description:** This method returns a SortedMap in which the keys are Decimal tax rates and the values are Money total tax for the tax rate. The map is unmodifiable.

**Returns:**

sorted map of tax rate against total tax

---

### getTotalGrossPrice

**Signature:** `getTotalGrossPrice() : Money`

**Description:** Returns the grand total price gross of tax for LineItemCtnr, in purchase currency. Total prices represent the sum of product prices, services prices and adjustments.

**Returns:**

the grand total price.

---

### getTotalNetPrice

**Signature:** `getTotalNetPrice() : Money`

**Description:** Returns the grand total price for LineItemCtnr net of tax, in purchase currency. Total prices represent the sum of product prices, services prices and adjustments.

**Returns:**

the grand total price.

---

### getTotalTax

**Signature:** `getTotalTax() : Money`

**Description:** Returns the grand total tax for LineItemCtnr, in purchase currency. Total prices represent the sum of product prices, services prices and adjustments.

**Returns:**

the grand total tax.

---

### isExternallyTaxed

**Signature:** `isExternallyTaxed() : boolean`

**Description:** Use this method to check whether the LineItemCtnr is calculated based on external tax tables. Note: a basket can only be created in EXTERNAL tax mode using SCAPI.

**Returns:**

true if the LineItemCtnr was calculated based on external tax tables.

---

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

**Description:** Use this method to check if the LineItemCtnr was calculated with grouped taxation calculation. If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

**Returns:**

true if the LineItemCtnr was calculated with grouped taxation

---

### removeAllPaymentInstruments

**Signature:** `removeAllPaymentInstruments() : void`

**Description:** Removes the all Payment Instruments from this container and deletes the Payment Instruments.

---

### removeBonusDiscountLineItem

**Signature:** `removeBonusDiscountLineItem(bonusDiscountLineItem : BonusDiscountLineItem) : void`

**Description:** Removes the specified bonus discount line item from the line item container.

**Parameters:**

- `bonusDiscountLineItem`: The bonus discount line item to remove, must not be null.

---

### removeCouponLineItem

**Signature:** `removeCouponLineItem(couponLineItem : CouponLineItem) : void`

**Description:** Removes the specified coupon line item from the line item container.

**Parameters:**

- `couponLineItem`: The coupon line item to remove

---

### removeGiftCertificateLineItem

**Signature:** `removeGiftCertificateLineItem(giftCertificateLineItem : GiftCertificateLineItem) : void`

**Description:** Removes the specified gift certificate line item from the line item container.

**Parameters:**

- `giftCertificateLineItem`: The gift certificate line item to remove

---

### removeNote

**Signature:** `removeNote(note : Note) : void`

**Description:** Removes a note from this line item container and deletes it.

**Parameters:**

- `note`: The note to remove. Must not be null. Must belong to this line item container.

---

### removePaymentInstrument

**Signature:** `removePaymentInstrument(pi : PaymentInstrument) : void`

**Description:** Removes the specified Payment Instrument from this container and deletes the Payment Instrument.

**Parameters:**

- `pi`: the Payment Instrument to remove.

---

### removePriceAdjustment

**Signature:** `removePriceAdjustment(priceAdjustment : PriceAdjustment) : void`

**Description:** Removes the specified price adjustment line item from the line item container.

**Parameters:**

- `priceAdjustment`: The price adjustment line item to remove, must not be null.

---

### removeProductLineItem

**Signature:** `removeProductLineItem(productLineItem : ProductLineItem) : void`

**Description:** Removes the specified product line item from the line item container.

**Parameters:**

- `productLineItem`: The product line item to remove, must not be null.

---

### removeShipment

**Signature:** `removeShipment(shipment : Shipment) : void`

**Description:** Removes the specified shipment and all associated product, gift certificate, shipping and price adjustment line items from the line item container. It is not permissible to remove the default shipment.

**Parameters:**

- `shipment`: Shipment to be removed, must not be null.

---

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

**Description:** Removes the specified shipping price adjustment line item from the line item container.

**Parameters:**

- `priceAdjustment`: The price adjustment line item to remove, must not be null.

---

### setCustomerEmail

**Signature:** `setCustomerEmail(aValue : String) : void`

**Description:** Sets the email address of the customer associated with this container.

**Parameters:**

- `aValue`: the email address of the customer associated with this container.

---

### setCustomerName

**Signature:** `setCustomerName(aValue : String) : void`

**Description:** Sets the name of the customer associated with this container.

**Parameters:**

- `aValue`: the name of the customer associated with this container.

---

### updateOrderLevelPriceAdjustmentTax

**Signature:** `updateOrderLevelPriceAdjustmentTax() : void`

**Description:** Calculates the tax for all shipping and order-level merchandise price adjustments in this LineItemCtnr. The tax on each adjustment is calculated from the taxes of the line items the adjustment applies across. This method must be invoked at the end of tax calculation of a basket or an order.

---

### updateTotals

**Signature:** `updateTotals() : void`

**Description:** Recalculates the totals of the line item container. It is necessary to call this method after any type of modification to the basket.

---

### verifyPriceAdjustmentLimits

**Signature:** `verifyPriceAdjustmentLimits() : Status`

**Description:** Verifies whether the manual price adjustments made for the line item container exceed the corresponding limits for the current user and the current site. The results of this method are based on the current values held in the LineItemCtnr, such as the base price of manual price adjustments. It is important the method is only called after the calculation process has completed. Status.OK is returned if NONE of the manual price adjustments exceed the correspondent limits. Status.ERROR is returned if ANY of the manual price adjustments exceed the correspondent limits. If this case Status.getItems() returns all price adjustment limit violations. The code of each StatusItem represents the violated price adjustment type (see PriceAdjustmentLimitTypes). StatusItem.getDetails() returns a Map with the max amount and (where relevant) the item to which the violation applies. Usage: var order : Order; // known var status : Status = order.verifyPriceAdjustmentLimits(); if (status.status == Status.ERROR) { for each (var statusItem : StatusItem in status.items) { var statusDetail : MapEntry = statusItem.details.entrySet().iterator().next(); var maxAllowedLimit : Number = (Number) (statusDetail.key); if (statusItem.code == PriceAdjustmentLimitTypes.TYPE_ORDER) { // fix order price adjustment considering maxAllowedLimit } else if (statusItem.code == PriceAdjustmentLimitTypes.TYPE_ITEM) { var pli : ProductLineItem = (ProductLineItem) (statusDetail.value); // fix pli price adjustment considering maxAllowedLimit } else if (statusItem.code == PriceAdjustmentLimitTypes.TYPE_SHIPPING) { if (statusDetail.value == null) { // fix order level shipping price adjustment considering maxAllowedLimit } else { var sli : ShippingLineItem = (ShippingLineItem) (statusDetail.value); // fix sli price adjustment considering maxAllowedLimit } } } }

**Returns:**

a Status instance with - Status.OK if all manual price adjustments do not exceed the correspondent limits, otherwise Status.ERROR

---