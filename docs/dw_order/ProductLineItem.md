## Package: dw.order

# Class ProductLineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItem
      - dw.order.ProductLineItem

## Description

Represents a specific product line item.

## Properties

### adjustedGrossPrice

**Type:** Money (Read Only)

The gross price of the product line item after applying all product-level
 adjustments.

### adjustedNetPrice

**Type:** Money (Read Only)

The net price of the product line item after applying all product-level
 adjustments.

### adjustedPrice

**Type:** Money (Read Only)

The price of the product line item after applying all product-level
 adjustments. For net pricing the adjusted net price is returned
 (see getAdjustedNetPrice()). For gross pricing, the adjusted
 gross price is returned (see getAdjustedGrossPrice()).

### adjustedTax

**Type:** Money (Read Only)

The tax of the unit after applying adjustments, in the purchase currency.

### bonusDiscountLineItem

**Type:** BonusDiscountLineItem (Read Only)

The parent bonus discount line item of this line item.  Only
 bonus product line items that have been selected by the customer as
 part of a BONUS_CHOICE discount have one of these.

### bonusProductLineItem

**Type:** boolean (Read Only)

Identifies if the product line item represents a bonus line item.

### bundledProductLineItem

**Type:** boolean (Read Only)

Identifies if the product line item represents a bundled line item.

### bundledProductLineItems

**Type:** Collection (Read Only)

A collection containing the bundled product line items.

### catalogProduct

**Type:** LineItemCtnr.createProductLineItem(String, Shipment) (Read Only)

Returns true if the product line item represents a catalog product.
 
 That flag is determined during product line item creation with
 LineItemCtnr.createProductLineItem(String, Shipment), stored at the line item container and can
 be accessed as productLineItem.catalogProduct. It represents what can be evaluated with

  dw.catalog.ProductMgr.getProduct( productID ) != null
     && dw.catalog.ProductMgr.getProduct( productID ).isAssignedToSiteCatalog()
 

 If the product is not available during product line item creation it is considered a non catalog product line item without
 connection to a product.

### category

**Type:** Category

The category the product line item is associated with. If the
 line item is not associated with a category, or the category does not
 exist in the site catalog, the method returns null.

### categoryID

**Type:** String

The ID of the category the product line item is associated with.

### externalLineItemStatus

**Type:** String

The value set for the external line item status
 or null if no value set.

### externalLineItemText

**Type:** String

The value set for the external line item text
 or null if no value set.

### gift

**Type:** boolean

Returns true if this line item represents a gift, false otherwise.

### giftMessage

**Type:** String

The value set for gift message or null if no value set.

### manufacturerName

**Type:** String

The name of the manfacturer of the product.

### manufacturerSKU

**Type:** String

The name of the manfacturer's SKU of this product line item.

### minOrderQuantity

**Type:** Quantity (Read Only)

The minimal order quantity allowed for the product represented by the
 ProductLineItem (copied from product on initialization).
 Note: the quantity of a ProductLineItem must obey the limits set by the
 ProductLineItem's attributes 'MinOrderQuantity' and 'StepQuantity', i.e.
 for a 'MinOrderQuantity' of 2.0 and a 'StepQuantity' of 2.5 then values
 2.0, 4.5, 7.0... are allowed values.

### minOrderQuantityValue

**Type:** Number

Return the value portion of getMinOrderQuantity().

### optionID

**Type:** String (Read Only)

The ID of the product option this product line item
 represents. If the product line item does not represent an option,
 null is returned.

### optionModel

**Type:** ProductOptionModel (Read Only)

The product option model for a product line item representing an option product.
 
 The returned option model has preselected values based on the dependent option line items of this product line
 item. Null is returned if this line item does not represent an option product.

### optionProductLineItem

**Type:** boolean (Read Only)

Identifies if the product line item represents an option line item.
 Option line items do not represent true products but rather options of
 products.  An option line item always has a parent product line item
 representing a true product.

### optionProductLineItems

**Type:** Collection (Read Only)

A collection containing option product line items.

### optionValueID

**Type:** String (Read Only)

The ID of the product option value this product line item
 represents. If the product line item does not represent an option,
 null is returned.

### orderItem

**Type:** OrderItem (Read Only)

The order-item extension for this item, or null. An order-item
 extension will only exist for a ProductLineItem which belongs to an Order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### parent

**Type:** ProductLineItem (Read Only)

The parent line item of this line item or null if the line item
 is independent.

### position

**Type:** Number

The position within the line item container assigned to the ProductLineItem upon its creation, may be
 used as a sort-order.
 
 The position is updated in the following way:
 
 When a ProductLineItem is added to the LineItemCtnr, it is assigned the next available position, based on the
 current count
 When a ProductLineItem is removed from the LineItemCtnr then LineItemCtnr method reassignPositions is called,
 so that the 'gap' left by the removed line-item is refilled. This method is dependent on no 2 ProductLineItem
 having the same position.
 When a LineItemCtnr is copied (e.g. when a PlacedOrder is created from a Basket), no special position
 handling is necessary as the ProductLineItems are added according to their current position ordering in the
 source LineItemCtnr.

### priceAdjustments

**Type:** Collection (Read Only)

An iterator of price adjustments that have been applied to this
 product line item such as promotions on the purchase price
 (i.e. $10 Off or 10% Off).

### product

**Type:** Product (Read Only)

The product associated with the product line item.
 
 The product line item might not be related to an actual catalog product, for example if it represents an option,
 or was not created from a catalog product, or if the product does not exist in the catalog anymore. In these
 cases, the method returns null.

### productID

**Type:** String (Read Only)

The ID of the related product.
 
 Returns empty if no product is related.

### productInventoryList

**Type:** ProductInventoryList

The inventory list the product line item is associated with. If the
 line item is not associated with a inventory list, or the inventory list does not
 exist, the method returns null.

### productInventoryListID

**Type:** String

The ID of the inventory list the product line item is associated with.

### productListItem

**Type:** ProductListItem (Read Only)

The associated ProductListItem.

### productName

**Type:** String

The name of the product that was copied when
 product was added to line item container.

### proratedPrice

**Type:** Money (Read Only)

The price of this product line item after considering all
 dependent price adjustments and prorating all Buy-X-Get-Y
 and order-level discounts, according to the scheme described in
 PriceAdjustment.getProratedPrices(). For net pricing the
 net price is returned. For gross pricing, the gross price is returned.

### proratedPriceAdjustmentPrices

**Type:** Map (Read Only)

A Map of PriceAdjustment to Money instances. They keys to this
 map are the price adjustments that apply to this ProductLineItem either
 directly or indirectly when discounts are prorated according to the
 scheme described in PriceAdjustment.getProratedPrices().
 The values in the map are the portion of the adjustment which applies to
 this particular product line item.

### qualifyingProductLineItemForBonusProduct

**Type:** ProductLineItem (Read Only)

The ProductLineItem that qualified the basket for this bonus product.
 
 This method is only applicable if the product line item is a bonus product line item, and if the promotion is a
 product promotion with number of qualifying products granting a bonus-product discount. If these conditions
 aren't met, the method returns null. If there are multiple product line items that triggered this bonus product,
 this method returns the last one by position within the order.

### quantity

**Type:** Quantity (Read Only)

The quantity of the product represented by this ProductLineItem.

### quantityValue

**Type:** Number

The value of the quantity of this ProductLineItem.

### relatedBonusProductLineItems

**Type:** Collection (Read Only)

All bonus product line items for which this line item is a
 qualifying product line item. This method is usually called when
 rendering the cart so that bonus products can be shown next to the
 products that triggered their creation.

### reserved

**Type:** Basket.reserveInventory(Number) (Read Only)

Returns if the product line item is reserved.
 
 Reservations for the basket can be created with e.g. Basket.reserveInventory(Number).
 
 Method must only be called for basket product line items. Exception is thrown if called for order product line
 item.

### shipment

**Type:** Shipment

The associated Shipment.

### shippingLineItem

**Type:** ProductShippingLineItem (Read Only)

The dependent shipping line item of this line item.
 The shipping line item can define product-specific shipping
 costs for this product line item.

### stepQuantity

**Type:** Quantity (Read Only)

Returns step quantity allowed for the product represented by the ProductLineItem
 (copied from product on initialization).
 Note: the quantity of a ProductLineItem must obey the limits set by the
 ProductLineItem's attributes 'MinOrderQuantity' and 'StepQuantity', i.e.
 for a 'MinOrderQuantity' of 2.0 and a 'StepQuantity' of 2.5 then values
 2.0, 4.5, 7.0... are allowed values.

### stepQuantityValue

**Type:** Number

Return the value portion of getStepQuantity().

## Constructor Summary

## Method Summary

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String) : PriceAdjustment`

Creates a product price adjustment.

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

Creates a product price adjustment representing a specific discount.

### createShippingLineItem

**Signature:** `createShippingLineItem() : ProductShippingLineItem`

Creates the dependent shipping line item for this line item.

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

Returns the gross price of the product line item after applying all product-level adjustments.

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

Returns the net price of the product line item after applying all product-level adjustments.

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

Returns the price of the product line item after applying all product-level adjustments.

### getAdjustedPrice

**Signature:** `getAdjustedPrice(applyOrderLevelAdjustments : boolean) : Money`

Returns the price of this product line item after considering all dependent price adjustments and optionally prorating all order-level price adjustments.

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

Returns the tax of the unit after applying adjustments, in the purchase currency.

### getBonusDiscountLineItem

**Signature:** `getBonusDiscountLineItem() : BonusDiscountLineItem`

Returns the parent bonus discount line item of this line item.

### getBundledProductLineItems

**Signature:** `getBundledProductLineItems() : Collection`

Returns a collection containing the bundled product line items.

### getCategory

**Signature:** `getCategory() : Category`

Returns the category the product line item is associated with.

### getCategoryID

**Signature:** `getCategoryID() : String`

Returns the ID of the category the product line item is associated with.

### getExternalLineItemStatus

**Signature:** `getExternalLineItemStatus() : String`

Returns the value set for the external line item status or null if no value set.

### getExternalLineItemText

**Signature:** `getExternalLineItemText() : String`

Returns the value set for the external line item text or null if no value set.

### getGiftMessage

**Signature:** `getGiftMessage() : String`

Returns the value set for gift message or null if no value set.

### getManufacturerName

**Signature:** `getManufacturerName() : String`

Returns the name of the manfacturer of the product.

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

Returns the name of the manfacturer's SKU of this product line item.

### getMinOrderQuantity

**Signature:** `getMinOrderQuantity() : Quantity`

Returns the minimal order quantity allowed for the product represented by the ProductLineItem (copied from product on initialization).

### getMinOrderQuantityValue

**Signature:** `getMinOrderQuantityValue() : Number`

Return the value portion of getMinOrderQuantity().

### getOptionID

**Signature:** `getOptionID() : String`

Returns the ID of the product option this product line item represents.

### getOptionModel

**Signature:** `getOptionModel() : ProductOptionModel`

Returns the product option model for a product line item representing an option product.

### getOptionProductLineItems

**Signature:** `getOptionProductLineItems() : Collection`

Returns a collection containing option product line items.

### getOptionValueID

**Signature:** `getOptionValueID() : String`

Returns the ID of the product option value this product line item represents.

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

Returns the order-item extension for this item, or null.

### getParent

**Signature:** `getParent() : ProductLineItem`

Returns the parent line item of this line item or null if the line item is independent.

### getPosition

**Signature:** `getPosition() : Number`

Returns the position within the line item container assigned to the ProductLineItem upon its creation, may be used as a sort-order.

### getPriceAdjustmentByPromotionID

**Signature:** `getPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

Returns the first price adjustment associated to the specified promotion ID.

### getPriceAdjustmentByPromotionIDAndCouponCode

**Signature:** `getPriceAdjustmentByPromotionIDAndCouponCode(promotionID : String, couponCode : String) : PriceAdjustment`

Returns the price adjustment associated to the specified promotion ID and coupon code combination.

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

Returns an iterator of price adjustments that have been applied to this product line item such as promotions on the purchase price (i.e.

### getPriceAdjustmentsByPromotionID

**Signature:** `getPriceAdjustmentsByPromotionID(promotionID : String) : Collection`

Returns the collection of price adjustments associated to the specified promotion ID.

### getProduct

**Signature:** `getProduct() : Product`

Returns the product associated with the product line item.

### getProductID

**Signature:** `getProductID() : String`

Returns the ID of the related product.

### getProductInventoryList

**Signature:** `getProductInventoryList() : ProductInventoryList`

Returns the inventory list the product line item is associated with.

### getProductInventoryListID

**Signature:** `getProductInventoryListID() : String`

Returns the ID of the inventory list the product line item is associated with.

### getProductListItem

**Signature:** `getProductListItem() : ProductListItem`

Returns the associated ProductListItem.

### getProductName

**Signature:** `getProductName() : String`

Returns the name of the product that was copied when product was added to line item container.

### getProratedPrice

**Signature:** `getProratedPrice() : Money`

Returns the price of this product line item after considering all dependent price adjustments and prorating all Buy-X-Get-Y and order-level discounts, according to the scheme described in PriceAdjustment.getProratedPrices().

### getProratedPriceAdjustmentPrices

**Signature:** `getProratedPriceAdjustmentPrices() : Map`

Returns a Map of PriceAdjustment to Money instances.

### getQualifyingProductLineItemForBonusProduct

**Signature:** `getQualifyingProductLineItemForBonusProduct() : ProductLineItem`

Returns the ProductLineItem that qualified the basket for this bonus product.

### getQuantity

**Signature:** `getQuantity() : Quantity`

Returns the quantity of the product represented by this ProductLineItem.

### getQuantityValue

**Signature:** `getQuantityValue() : Number`

Returns the value of the quantity of this ProductLineItem.

### getRelatedBonusProductLineItems

**Signature:** `getRelatedBonusProductLineItems() : Collection`

Returns all bonus product line items for which this line item is a qualifying product line item.

### getShipment

**Signature:** `getShipment() : Shipment`

Returns the associated Shipment.

### getShippingLineItem

**Signature:** `getShippingLineItem() : ProductShippingLineItem`

Returns the dependent shipping line item of this line item.

### getStepQuantity

**Signature:** `getStepQuantity() : Quantity`

Returns step quantity allowed for the product represented by the ProductLineItem (copied from product on initialization).

### getStepQuantityValue

**Signature:** `getStepQuantityValue() : Number`

Return the value portion of getStepQuantity().

### isBonusProductLineItem

**Signature:** `isBonusProductLineItem() : boolean`

Identifies if the product line item represents a bonus line item.

### isBundledProductLineItem

**Signature:** `isBundledProductLineItem() : boolean`

Identifies if the product line item represents a bundled line item.

### isCatalogProduct

**Signature:** `isCatalogProduct() : boolean`

Returns true if the product line item represents a catalog product.

### isGift

**Signature:** `isGift() : boolean`

Returns true if this line item represents a gift, false otherwise.

### isOptionProductLineItem

**Signature:** `isOptionProductLineItem() : boolean`

Identifies if the product line item represents an option line item.

### isReserved

**Signature:** `isReserved() : boolean`

Returns if the product line item is reserved.

### removePriceAdjustment

**Signature:** `removePriceAdjustment(priceAdjustmentLineItem : PriceAdjustment) : void`

Removes the specified price adjustment from the product line item.

### removeShippingLineItem

**Signature:** `removeShippingLineItem() : void`

Removes the dependent shipping line item for this line item.

### replaceProduct

**Signature:** `replaceProduct(newProduct : Product) : void`

Replaces the current product of the product line item with the product specified in parameter newProduct.

### setCategory

**Signature:** `setCategory(category : Category) : void`

Sets the specified category as the product line item category context.

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

Sets the ID of the category the product line item is associated with.

### setExternalLineItemStatus

**Signature:** `setExternalLineItemStatus(status : String) : void`

Sets the value to set for the external line item status.

### setExternalLineItemText

**Signature:** `setExternalLineItemText(text : String) : void`

Sets the value to set for the external line item text.

### setGift

**Signature:** `setGift(isGift : boolean) : void`

Controls if this line item is a gift or not.

### setGiftMessage

**Signature:** `setGiftMessage(message : String) : void`

Sets the value to set for the gift message.

### setManufacturerName

**Signature:** `setManufacturerName(name : String) : void`

Sets the name of the manufacturer of this product.

### setManufacturerSKU

**Signature:** `setManufacturerSKU(sku : String) : void`

Sets the SKU of the manufacturer of this product.

### setMinOrderQuantityValue

**Signature:** `setMinOrderQuantityValue(quantityValue : Number) : void`

Set the minimum order quantity value for this object.

### setPosition

**Signature:** `setPosition(aValue : Number) : void`

Sets the position within the line item container.

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

Sets price attributes of the line item based on the current purchase currency, taxation policy and line item quantity.

### setProductInventoryList

**Signature:** `setProductInventoryList(productInventoryList : ProductInventoryList) : void`

Sets the specified inventory list as the product line item inventory context.

### setProductInventoryListID

**Signature:** `setProductInventoryListID(productInventoryListID : String) : void`

Sets the ID of the inventory list the product line item is associated with.

### setProductName

**Signature:** `setProductName(aValue : String) : void`

Sets the name of the product.

### setQuantityValue

**Signature:** `setQuantityValue(quantityValue : Number) : void`

Updates the quantity value of the product line item.

### setShipment

**Signature:** `setShipment(shipment : Shipment) : void`

Associates the specified product line item with the specified shipment.

### setStepQuantityValue

**Signature:** `setStepQuantityValue(quantityValue : Number) : void`

Set the step quantity value for this object.

### updateOptionPrice

**Signature:** `updateOptionPrice() : void`

Determines and sets the price of a option line item based on the selected option value the line item represents.

### updateOptionValue

**Signature:** `updateOptionValue(optionValue : ProductOptionValue) : void`

Updates an option line item with a new option value.

### updatePrice

**Signature:** `updatePrice(price : Money) : void`

Updates the price attributes of the line item based on the specified price.

### updateQuantity

**Signature:** `updateQuantity(quantityValue : Number) : Number`

Updates the quantity value of the product line item and all its dependent product line items.

## Method Detail

## Method Details

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String) : PriceAdjustment`

**Description:** Creates a product price adjustment. The price adjustment line item is being initialized with the tax class code and tax rate of the product line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce. If there already exists a price adjustment for the same promotionID, an exception is thrown.

**Parameters:**

- `promotionID`: Promotion ID

**Returns:**

The new price adjustment

---

### createPriceAdjustment

**Signature:** `createPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

**Description:** Creates a product price adjustment representing a specific discount. The price adjustment line item is initialized with the tax class code and tax rate of the product line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce. If a price adjustment already exists for the same promotionID, an exception is thrown. The possible discounts are FixedPriceDiscount, AmountDiscount, PercentageDiscount. Example: var myProductItem : dw.order.ProductLineItem; // assume known var paFixedUnitPrice100 : dw.order.PriceAdjustment = myProductItem.createPriceAdjustment("myPromotionID1", new FixedPriceDiscount(100.00)); var paTenPercent : dw.order.PriceAdjustment = myProductItem.createPriceAdjustment("myPromotionID2", new PercentageDiscount(10)); var paReduceBy20 : dw.order.PriceAdjustment = myProductItem.createPriceAdjustment("myPromotionID3", new AmountDiscount(20.00);

**Parameters:**

- `promotionID`: Unique custom promotion ID, not null
- `discount`: The desired discount, not null

**Returns:**

The new custom price adjustment

---

### createShippingLineItem

**Signature:** `createShippingLineItem() : ProductShippingLineItem`

**Description:** Creates the dependent shipping line item for this line item. The shipping line item can define product-specific shipping costs for this product line item. This method has replace semantics: If there is an existing shipping line item it will be replaced with a new shipping line item.

**Returns:**

the created shipping line item

---

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

**Description:** Returns the gross price of the product line item after applying all product-level adjustments.

**Returns:**

gross price after applying product-level adjustments

**See Also:**

getAdjustedNetPrice()
getAdjustedPrice()

---

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

**Description:** Returns the net price of the product line item after applying all product-level adjustments.

**Returns:**

net price after applying product-level adjustments

**See Also:**

getAdjustedGrossPrice()
getAdjustedPrice()

---

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

**Description:** Returns the price of the product line item after applying all product-level adjustments. For net pricing the adjusted net price is returned (see getAdjustedNetPrice()). For gross pricing, the adjusted gross price is returned (see getAdjustedGrossPrice()).

**Returns:**

Adjusted net or gross price

**See Also:**

getAdjustedGrossPrice()
getAdjustedNetPrice()

---

### getAdjustedPrice

**Signature:** `getAdjustedPrice(applyOrderLevelAdjustments : boolean) : Money`

**Description:** Returns the price of this product line item after considering all dependent price adjustments and optionally prorating all order-level price adjustments. For net pricing the net price is returned. For gross pricing, the gross price is returned.

**Parameters:**

- `applyOrderLevelAdjustments`: If true, order-level adjustments will be applied to line item price.

**Returns:**

Adjusted net or gross price

**See Also:**

getAdjustedPrice()

---

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

**Description:** Returns the tax of the unit after applying adjustments, in the purchase currency.

**Returns:**

the tax of the unit after applying adjustments, in the purchase currency.

---

### getBonusDiscountLineItem

**Signature:** `getBonusDiscountLineItem() : BonusDiscountLineItem`

**Description:** Returns the parent bonus discount line item of this line item. Only bonus product line items that have been selected by the customer as part of a BONUS_CHOICE discount have one of these.

**Returns:**

the bonus discount line item of this line item or null

---

### getBundledProductLineItems

**Signature:** `getBundledProductLineItems() : Collection`

**Description:** Returns a collection containing the bundled product line items.

**Returns:**

a collection containing the bundled product line items.

---

### getCategory

**Signature:** `getCategory() : Category`

**Description:** Returns the category the product line item is associated with. If the line item is not associated with a category, or the category does not exist in the site catalog, the method returns null.

**Returns:**

Category or null

---

### getCategoryID

**Signature:** `getCategoryID() : String`

**Description:** Returns the ID of the category the product line item is associated with.

**Returns:**

Category ID or null.

---

### getExternalLineItemStatus

**Signature:** `getExternalLineItemStatus() : String`

**Description:** Returns the value set for the external line item status or null if no value set.

**Returns:**

the value set for the external line item status or null if no value set.

---

### getExternalLineItemText

**Signature:** `getExternalLineItemText() : String`

**Description:** Returns the value set for the external line item text or null if no value set.

**Returns:**

the value set for the external line item text or null if no value set.

---

### getGiftMessage

**Signature:** `getGiftMessage() : String`

**Description:** Returns the value set for gift message or null if no value set.

**Returns:**

the value set for gift message or null if no value set.

---

### getManufacturerName

**Signature:** `getManufacturerName() : String`

**Description:** Returns the name of the manfacturer of the product.

**Returns:**

The name of the manfacturer of the product.

---

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

**Description:** Returns the name of the manfacturer's SKU of this product line item.

**Returns:**

the name of the manfacturer's SKU of this product line item.

---

### getMinOrderQuantity

**Signature:** `getMinOrderQuantity() : Quantity`

**Description:** Returns the minimal order quantity allowed for the product represented by the ProductLineItem (copied from product on initialization). Note: the quantity of a ProductLineItem must obey the limits set by the ProductLineItem's attributes 'MinOrderQuantity' and 'StepQuantity', i.e. for a 'MinOrderQuantity' of 2.0 and a 'StepQuantity' of 2.5 then values 2.0, 4.5, 7.0... are allowed values.

**Returns:**

the minimal order quantity allowed for the product.

---

### getMinOrderQuantityValue

**Signature:** `getMinOrderQuantityValue() : Number`

**Description:** Return the value portion of getMinOrderQuantity().

**Returns:**

the minimal order quantity value allowed for the product.

---

### getOptionID

**Signature:** `getOptionID() : String`

**Description:** Returns the ID of the product option this product line item represents. If the product line item does not represent an option, null is returned.

**Returns:**

the ID of the product option this product line item represents.

---

### getOptionModel

**Signature:** `getOptionModel() : ProductOptionModel`

**Description:** Returns the product option model for a product line item representing an option product. The returned option model has preselected values based on the dependent option line items of this product line item. Null is returned if this line item does not represent an option product.

**Returns:**

the product option model for a product line item representing an option product.

---

### getOptionProductLineItems

**Signature:** `getOptionProductLineItems() : Collection`

**Description:** Returns a collection containing option product line items.

**Returns:**

a collection containing option product line items.

---

### getOptionValueID

**Signature:** `getOptionValueID() : String`

**Description:** Returns the ID of the product option value this product line item represents. If the product line item does not represent an option, null is returned.

**Returns:**

the ID of the product option value this product line item represents.

---

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

**Description:** Returns the order-item extension for this item, or null. An order-item extension will only exist for a ProductLineItem which belongs to an Order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

null or the order-item extension

---

### getParent

**Signature:** `getParent() : ProductLineItem`

**Description:** Returns the parent line item of this line item or null if the line item is independent.

**Returns:**

the parent line item of this line item or null if the line item is independent.

---

### getPosition

**Signature:** `getPosition() : Number`

**Description:** Returns the position within the line item container assigned to the ProductLineItem upon its creation, may be used as a sort-order. The position is updated in the following way: When a ProductLineItem is added to the LineItemCtnr, it is assigned the next available position, based on the current count When a ProductLineItem is removed from the LineItemCtnr then LineItemCtnr method reassignPositions is called, so that the 'gap' left by the removed line-item is refilled. This method is dependent on no 2 ProductLineItem having the same position. When a LineItemCtnr is copied (e.g. when a PlacedOrder is created from a Basket), no special position handling is necessary as the ProductLineItems are added according to their current position ordering in the source LineItemCtnr.

**Returns:**

the position within the line item container assigned to the ProductLineItem upon its creation.

---

### getPriceAdjustmentByPromotionID

**Signature:** `getPriceAdjustmentByPromotionID(promotionID : String) : PriceAdjustment`

**Description:** Returns the first price adjustment associated to the specified promotion ID. It is highly recommended to use getPriceAdjustmentsByPromotionID(String) instead. If there are multiple price adjustments for the same promotion, this method will return the first found. Alternatively, to uniquely identify a price adjustment using its promotion id and coupon code, use getPriceAdjustmentByPromotionIDAndCouponCode(String, String)

**Parameters:**

- `promotionID`: Promotion id

**Returns:**

The price adjustment associated with the promotion ID or null

---

### getPriceAdjustmentByPromotionIDAndCouponCode

**Signature:** `getPriceAdjustmentByPromotionIDAndCouponCode(promotionID : String, couponCode : String) : PriceAdjustment`

**Description:** Returns the price adjustment associated to the specified promotion ID and coupon code combination.

**Parameters:**

- `promotionID`: Promotion id
- `couponCode`: the code of the coupon used to apply the promotion, or null if the promotion is not coupon based.

**Returns:**

The price adjustment associated with the promotion ID and coupon code combination, or null

---

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

**Description:** Returns an iterator of price adjustments that have been applied to this product line item such as promotions on the purchase price (i.e. $10 Off or 10% Off).

**Returns:**

a collection of price adjustments that have been applied to this product line item.

---

### getPriceAdjustmentsByPromotionID

**Signature:** `getPriceAdjustmentsByPromotionID(promotionID : String) : Collection`

**Description:** Returns the collection of price adjustments associated to the specified promotion ID. If only one coupon code is allowed per order, then the collection should only ever have a single entry in it. The multiple coupon code feature can cause multiple price adjustments to be returned.

**Parameters:**

- `promotionID`: Promotion id

**Returns:**

The collection of price adjustments associated with the promotion ID or null if the promotionID was null. If there are no price adjustments for the passed promotion, the collection will be empty.

---

### getProduct

**Signature:** `getProduct() : Product`

**Description:** Returns the product associated with the product line item. The product line item might not be related to an actual catalog product, for example if it represents an option, or was not created from a catalog product, or if the product does not exist in the catalog anymore. In these cases, the method returns null.

**Returns:**

the product of the line item, or null

**See Also:**

isCatalogProduct()

---

### getProductID

**Signature:** `getProductID() : String`

**Description:** Returns the ID of the related product. Returns empty if no product is related.

**Returns:**

the ID of the related product.

**See Also:**

isCatalogProduct()
getProduct()

---

### getProductInventoryList

**Signature:** `getProductInventoryList() : ProductInventoryList`

**Description:** Returns the inventory list the product line item is associated with. If the line item is not associated with a inventory list, or the inventory list does not exist, the method returns null.

**Returns:**

ProductInventoryList or null

---

### getProductInventoryListID

**Signature:** `getProductInventoryListID() : String`

**Description:** Returns the ID of the inventory list the product line item is associated with.

**Returns:**

ProductInventoryList ID or null.

---

### getProductListItem

**Signature:** `getProductListItem() : ProductListItem`

**Description:** Returns the associated ProductListItem.

**Returns:**

item or null.

---

### getProductName

**Signature:** `getProductName() : String`

**Description:** Returns the name of the product that was copied when product was added to line item container.

**Returns:**

the name of the product.

---

### getProratedPrice

**Signature:** `getProratedPrice() : Money`

**Description:** Returns the price of this product line item after considering all dependent price adjustments and prorating all Buy-X-Get-Y and order-level discounts, according to the scheme described in PriceAdjustment.getProratedPrices(). For net pricing the net price is returned. For gross pricing, the gross price is returned.

**Returns:**

Adjusted and prorated net or gross price

---

### getProratedPriceAdjustmentPrices

**Signature:** `getProratedPriceAdjustmentPrices() : Map`

**Description:** Returns a Map of PriceAdjustment to Money instances. They keys to this map are the price adjustments that apply to this ProductLineItem either directly or indirectly when discounts are prorated according to the scheme described in PriceAdjustment.getProratedPrices(). The values in the map are the portion of the adjustment which applies to this particular product line item.

**Returns:**

Map of PriceAdjustment to Money instances, representing the prorated adjustments applied to this ProductLineItem.

---

### getQualifyingProductLineItemForBonusProduct

**Signature:** `getQualifyingProductLineItemForBonusProduct() : ProductLineItem`

**Description:** Returns the ProductLineItem that qualified the basket for this bonus product. This method is only applicable if the product line item is a bonus product line item, and if the promotion is a product promotion with number of qualifying products granting a bonus-product discount. If these conditions aren't met, the method returns null. If there are multiple product line items that triggered this bonus product, this method returns the last one by position within the order.

**Returns:**

the ProductLineItem that qualified the basket for this bonus product. Returns null if this is not a bonus product, or if there was no distinct qualifying product.

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** Returns the quantity of the product represented by this ProductLineItem.

**Returns:**

the quantity of the product.

---

### getQuantityValue

**Signature:** `getQuantityValue() : Number`

**Description:** Returns the value of the quantity of this ProductLineItem.

**Returns:**

quantity value of product line item

---

### getRelatedBonusProductLineItems

**Signature:** `getRelatedBonusProductLineItems() : Collection`

**Description:** Returns all bonus product line items for which this line item is a qualifying product line item. This method is usually called when rendering the cart so that bonus products can be shown next to the products that triggered their creation.

**Returns:**

the bonus product line items triggered by the addition of this product to the cart.

---

### getShipment

**Signature:** `getShipment() : Shipment`

**Description:** Returns the associated Shipment.

**Returns:**

The shipment of the product line item

---

### getShippingLineItem

**Signature:** `getShippingLineItem() : ProductShippingLineItem`

**Description:** Returns the dependent shipping line item of this line item. The shipping line item can define product-specific shipping costs for this product line item.

**Returns:**

the shipping line item of this line item or null

---

### getStepQuantity

**Signature:** `getStepQuantity() : Quantity`

**Description:** Returns step quantity allowed for the product represented by the ProductLineItem (copied from product on initialization). Note: the quantity of a ProductLineItem must obey the limits set by the ProductLineItem's attributes 'MinOrderQuantity' and 'StepQuantity', i.e. for a 'MinOrderQuantity' of 2.0 and a 'StepQuantity' of 2.5 then values 2.0, 4.5, 7.0... are allowed values.

**Returns:**

step quantity allowed for the product.

---

### getStepQuantityValue

**Signature:** `getStepQuantityValue() : Number`

**Description:** Return the value portion of getStepQuantity().

**Returns:**

step quantity value allowed for the product.

---

### isBonusProductLineItem

**Signature:** `isBonusProductLineItem() : boolean`

**Description:** Identifies if the product line item represents a bonus line item.

**Returns:**

true if the product line item represents a bonus line item, false otherwise.

---

### isBundledProductLineItem

**Signature:** `isBundledProductLineItem() : boolean`

**Description:** Identifies if the product line item represents a bundled line item.

**Returns:**

true if the product line item represents a bundled line item.

---

### isCatalogProduct

**Signature:** `isCatalogProduct() : boolean`

**Description:** Returns true if the product line item represents a catalog product. That flag is determined during product line item creation with LineItemCtnr.createProductLineItem(String, Shipment), stored at the line item container and can be accessed as productLineItem.catalogProduct. It represents what can be evaluated with dw.catalog.ProductMgr.getProduct( productID ) != null && dw.catalog.ProductMgr.getProduct( productID ).isAssignedToSiteCatalog() If the product is not available during product line item creation it is considered a non catalog product line item without connection to a product.

**Returns:**

true if product line item represents catalog product, otherwise false

**See Also:**

getProduct()

---

### isGift

**Signature:** `isGift() : boolean`

**Description:** Returns true if this line item represents a gift, false otherwise.

**Returns:**

true if this line item represents a gift, false otherwise.

---

### isOptionProductLineItem

**Signature:** `isOptionProductLineItem() : boolean`

**Description:** Identifies if the product line item represents an option line item. Option line items do not represent true products but rather options of products. An option line item always has a parent product line item representing a true product.

**Returns:**

true if the product line item represents an option line item, false otherwise.

---

### isReserved

**Signature:** `isReserved() : boolean`

**Description:** Returns if the product line item is reserved. Reservations for the basket can be created with e.g. Basket.reserveInventory(Number). Method must only be called for basket product line items. Exception is thrown if called for order product line item.

**Returns:**

true if line item is reserved, false otherwise.

---

### removePriceAdjustment

**Signature:** `removePriceAdjustment(priceAdjustmentLineItem : PriceAdjustment) : void`

**Description:** Removes the specified price adjustment from the product line item.

**Parameters:**

- `priceAdjustmentLineItem`: The price adjustment to remove

---

### removeShippingLineItem

**Signature:** `removeShippingLineItem() : void`

**Description:** Removes the dependent shipping line item for this line item.

---

### replaceProduct

**Signature:** `replaceProduct(newProduct : Product) : void`

**Description:** Replaces the current product of the product line item with the product specified in parameter newProduct. The following rules apply: Preserve line item attributes UUID, Quantity, CategoryID, ExternalLineItemStatus, ExternalLineItemText, isGift, GiftMessage, Position, Parent, Shipment Replace product-specific attributes ProductID, ProductName, MinOrderQuantity, StepQuantity, ManufacturerName, ManufacturerSKU Remove all price adjustments related to the product line item Remove the shipping line item related to the product line item Remove all bundled line items of current product, and add bundled line items if new product is a bundle Remove all option line items of current product, and add option line items if new product is an option product; use default option selections Set all price attributes to N/A Preserve all custom attributes of line item, but override order-required attributes with values from new product The primary use is to replace one variation product with another, without having to both create a new line item for the replacement and remove the line item for the replaced product.

**Parameters:**

- `newProduct`: The new product of the product line item

---

### setCategory

**Signature:** `setCategory(category : Category) : void`

**Description:** Sets the specified category as the product line item category context.

**Parameters:**

- `category`: Category instance or null

---

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

**Description:** Sets the ID of the category the product line item is associated with.

**Parameters:**

- `categoryID`: the Category ID or null.

---

### setExternalLineItemStatus

**Signature:** `setExternalLineItemStatus(status : String) : void`

**Description:** Sets the value to set for the external line item status.

**Parameters:**

- `status`: the value to set for the external line item status.

---

### setExternalLineItemText

**Signature:** `setExternalLineItemText(text : String) : void`

**Description:** Sets the value to set for the external line item text.

**Parameters:**

- `text`: the value to set for the external line item text.

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

### setManufacturerName

**Signature:** `setManufacturerName(name : String) : void`

**Description:** Sets the name of the manufacturer of this product.

**Parameters:**

- `name`: The name of the manfacturer of this product

---

### setManufacturerSKU

**Signature:** `setManufacturerSKU(sku : String) : void`

**Description:** Sets the SKU of the manufacturer of this product.

**Parameters:**

- `sku`: The SKU of the manfacturer of this product

---

### setMinOrderQuantityValue

**Signature:** `setMinOrderQuantityValue(quantityValue : Number) : void`

**Description:** Set the minimum order quantity value for this object. This will be used to validate and adjust quantities when setQuantityValue() is called. For typical catalog product line items, it is usually desirable to have this value inherited from the product attributes, but for non-catalog products, it is sometimes desirable to set this value programmatically. Null is accepted and represents Quantity.NA. Otherwise, the quantity value must be > 0.

**Parameters:**

- `quantityValue`: The minimal order quantity allowed for the product or null.

---

### setPosition

**Signature:** `setPosition(aValue : Number) : void`

**Description:** Sets the position within the line item container. This value may be used as a sort-order. The position is updated in the following way: When a ProductLineItem is added to the LineItemCtnr, it is assigned the next available position, based on the current count When a ProductLineItem is removed from the LineItemCtnr then LineItemCtnr method reassignPositions is called, so that the 'gap' left by the removed line-item is refilled. This method is dependent on no 2 ProductLineItem having the same position. When a LineItemCtnr is copied (e.g. when an Order is created from a Basket), no special position handling is necessary as the ProductLineItems are added according to their current position ordering in the source LineItemCtnr.

**Parameters:**

- `aValue`: the position within the line item container.

---

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

**Description:** Sets price attributes of the line item based on the current purchase currency, taxation policy and line item quantity. The method sets the 'basePrice' attribute of the line item. Additionally, it sets the 'netPrice' attribute of the line item if the current taxation policy is 'net', and the 'grossPrice' attribute, if the current taxation policy is 'gross'. The 'netPrice'/'grossPrice' attributes are set by multiplying the specified price value with the line item quantity. If null is specified as value, the price attributes are reset to Money.NA.

**Parameters:**

- `value`: Price value or null

---

### setProductInventoryList

**Signature:** `setProductInventoryList(productInventoryList : ProductInventoryList) : void`

**Description:** Sets the specified inventory list as the product line item inventory context.

**Parameters:**

- `productInventoryList`: ProductInventoryList instance or null

---

### setProductInventoryListID

**Signature:** `setProductInventoryListID(productInventoryListID : String) : void`

**Description:** Sets the ID of the inventory list the product line item is associated with.

**Parameters:**

- `productInventoryListID`: the ProductInventoryList ID or null.

---

### setProductName

**Signature:** `setProductName(aValue : String) : void`

**Description:** Sets the name of the product.

**Parameters:**

- `aValue`: the name of the product.

---

### setQuantityValue

**Signature:** `setQuantityValue(quantityValue : Number) : void`

**Description:** Updates the quantity value of the product line item. Validates the specified quantity value against the line item's min order and step quantity and adjusts it if necessary. In particular, if 0 is passed, then the value will be adjusted to the min order quantity, not removed from the line item container. Null values or values < 0.0 are not accepted.

**Parameters:**

- `quantityValue`: Quantity value.

---

### setShipment

**Signature:** `setShipment(shipment : Shipment) : void`

**Description:** Associates the specified product line item with the specified shipment. The method is only applicable for independent product line items. If called for any dependent line item (option or bundled line item), the method will throw an exception. The shipment for all dependent line items will be updated automatically by the method. Product line item and shipment must belong to the same line item ctnr.

**Parameters:**

- `shipment`: The new shipment of the product line item

---

### setStepQuantityValue

**Signature:** `setStepQuantityValue(quantityValue : Number) : void`

**Description:** Set the step quantity value for this object. This will be used to validate and adjust quantities when updateQuantity() is called. For typical catalog product line items, it is usually desirable to have this value inherited from the product attributes, but for non-catalog products, it is sometimes desirable to set this value programmatically. Null is accepted and represents Quantity.NA. Otherwise, the quantity value must be > 0.

**Parameters:**

- `quantityValue`: The minimal order quantity allowed for the product or null.

---

### updateOptionPrice

**Signature:** `updateOptionPrice() : void`

**Description:** Determines and sets the price of a option line item based on the selected option value the line item represents.

---

### updateOptionValue

**Signature:** `updateOptionValue(optionValue : ProductOptionValue) : void`

**Description:** Updates an option line item with a new option value. This method will not do anything if the current line item is no option line item, if the specified value does not exist for the current option or if this value is already selected. Note, that this method will update the attributes optionValueID, productID, productName and lineItemText. It will not update the price attributes of the line item. To update the price of the line item you need to call updateOptionPrice() in addition. This is usually done during calculation in the calculate hook.

**Parameters:**

- `optionValue`: The value to update the option line item with

---

### updatePrice

**Signature:** `updatePrice(price : Money) : void`

**Description:** Updates the price attributes of the line item based on the specified price. The base price is set to the specified value. If the line item is based on net pricing then the net price attribute is set. If the line item is based on gross pricing then the gross price attribute is set. Whether or not a line item is based on net or gross pricing is a site-wide configuration parameter. In either case, this price is equal to the product of the base price and the quantity of this line item in its container.

**Deprecated:**

Use setPriceValue(Number)

**Parameters:**

- `price`: The price to use when performing the update. This price must not be null and must either be equal to NOT_AVAIALBLE or must have a currency code equal to that of the parent container.

---

### updateQuantity

**Signature:** `updateQuantity(quantityValue : Number) : Number`

**Description:** Updates the quantity value of the product line item and all its dependent product line items. Validates the specified quantity value against the line item's min order and step quantity and adjusts it if necessary. The adjusted quantity value is returned. In general, quantity values < 0.0 are not accepted.

**Deprecated:**

Use setQuantityValue(Number) followed by getQuantity() instead.

**Parameters:**

- `quantityValue`: Numeric quantity value.

**Returns:**

Adjusted quantity value

---