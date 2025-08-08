## Package: dw.catalog

# Class ProductPriceModel

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductPriceModel

## Description

ProductPriceModel provides methods to access all the PriceBook information of a product. A ProductPriceModel instance is retrieved by calling Product.getPriceModel() or Product.getPriceModel(ProductOptionModel) for a specific product. The latter method will return a model which also includes the additional option prices of an option product. When the current price of a product is accessed in the storefront via its price model, a price lookup is performed. The high-level steps of this price lookup are: Get all price books applicable in the context of the current site, time, session, customer, source code. Identify all prices in the applicable price books and for a requested quantity. Calculate the best-price of all identified prices. The best-price is the lowest price. In more detail: Identify applicable price books If any price books are explicitly registered in the session (see pipelet SetApplicablePriceBooks), use these price books and their direct parents for price lookup. Ignore all inactive price books, price books not valid at the current time, and price books with a currency other than the session currency. Otherwise: If a valid source code is registered with the current session, get all price books assigned to the source code and their parent price books. Ignore all inactive price books, price books not valid at the current time, and price books with a currency other than the session currency. Get all price books assigned to site and their parent price books. Ignore all inactive price books, price books not valid at the current time, and price books with a currency other than the session currency. Identify all prices: Get all price definitions for the product from all applicable price books. Ignore price definitions not valid at the current time. Convert any percentage price definition into a monetary amount. As the base price for this calculation, the minimum product price for the minimum order quantity of the product, including product options, is used. Compare all prices and identify the lowest (= best) price. Calculate best price for each defined price cut in the price table and return price table. Variation Price Fallback: If no applicable pricebooks for a variant is found, the price lookup gets the price books from the variant's master product A price books is also not applicable of the price definition for the variant in the price book is not valid at the current time. Typically, in order to do a standard price lookup, it is only necessary to call Product.getPriceModel().getPrice(). However, Commerce Cloud Digital also supports tiered prices, meaning that higher quantities receive a lower price. In this case, the merchant typically wants to display a table of price points on product detail pages. Therefore, the ProductPriceModel provides the method getPriceTable() to retrieve a table of these prices. If a merchant wants to know not only what the price of a given product is, but what price book the price was derived from, this class provides the method getPriceInfo(). This class also provides methods to lookup product prices in specific price books by name and quantity. See getPriceBookPrice(String).

## Properties

### basePriceQuantity

**Type:** Quantity (Read Only)

The quantity for which the base price is defined. This
 is typically 1.0.

### maxPrice

**Type:** Money (Read Only)

Calculates and returns the maximum price-book price of all variants (for
 master products) or set-products (for product sets) for base quantity
 1.00. This value can be used to display a range of prices in storefront.
 If the product represented by this model is not a master product or
 product set, then this method behaves the same as getPrice().
 Only online products are considered. If the "orderable products only"
 search preference is enabled for the current site, then only orderable
 products are considered. For master products, only variants with all
 variation attributes configured are considered.

 Warning:  If the product represented by this model is a master
 product with numerous variants, this method can be very expensive and
 should be avoided.

### maxPricePerUnit

**Type:** Money (Read Only)

Calculates and returns the maximum price-book price per unit of all variants (for
 master products) or set-products (for product sets) for base quantity
 1.00. This value can be used to display a range of prices in storefront.
 If the product represented by this model is not a master product or
 product set, then this method behaves the same as getPricePerUnit().
 Only online products are considered. If the "orderable products only"
 search preference is enabled for the current site, then only orderable
 products are considered. For master products, only variants with all
 variation attributes configured are considered.

 e.g.
 suppose one master product mp (price = $6, unitQuantity = 2), it has 2 variants:
 v1(price = $5, unitQuantity = 5), v2(price = $10, unitQuantity = 20).
 The max price per unit of mp will be max($6/2, $5/5, $10/20) = $3

### minPrice

**Type:** Money (Read Only)

Calculates and returns the minimum price-book price of all variants (for
 master products) or set-products (for product sets) for base quantity
 1.00. This value can be used to display a range of prices in storefront.
 If the product represented by this model is not a master product or
 product set, then this method behaves the same as getPrice().
 Only online products are considered. If the "orderable products only"
 search preference is enabled for the current site, then only orderable
 products are considered. For master products, only variants with all
 variation attributes configured are considered.

 Warning:  If the product represented by this model is a master
 product with numerous variants, this method can be very expensive and
 should be avoided.

### minPricePerUnit

**Type:** Money (Read Only)

Calculates and returns the minimum price-book price per unit of all variants (for
 master products) or set-products (for product sets) for base quantity
 1.00. This value can be used to display a range of prices in storefront.
 If the product represented by this model is not a master product or
 product set, then this method behaves the same as getPricePerUnit().
 Only online products are considered. If the "orderable products only"
 search preference is enabled for the current site, then only orderable
 products are considered. For master products, only variants with all
 variation attributes configured are considered.

 e.g.
 suppose one master product mp (price = $6, unitQuantity = 2), it has 2 variants:
 v1(price = $5, unitQuantity = 5), v2(price = $10, unitQuantity = 20).
 The min price per unit of mp will be min($6/2, $5/5, $10/20) = $0.5

### price

**Type:** Money (Read Only)

The active price of a product, calculated based on base price quantity
 1.00. The price is returned for the currency of the current session.
 
 The price lookup is based on the configuration of price books. It depends
 on various settings, such as which price books are active, or explicitly
 set as applicable in the current session.
 
 If the product represented by this model is an option product, option
 prices will be added to the price book price if the price model was
 initialized with an option model.
 
 If no price could be found, MONEY.NOT_AVAILABLE is returned.

### priceInfo

**Type:** ProductPriceInfo (Read Only)

The active price info of a product, calculated based on base price
 quantity 1.00. The price is returned for the currency of the current
 session.
 
 This method is similar to getPrice() but instead of just
 returning the price value, it returns a ProductPriceInfo
 which contains additional information such as the PriceBook which defined
 the price and the percentage discount this price point represents.
 
 If the product represented by this model is an option product, option
 prices will be added to the price book price if the price model was
 initialized with an option model.
 
 If no price info could be found, null is returned.

### priceInfos

**Type:** Collection (Read Only)

All the eligible ProductPriceInfo(s), calculated based
 on base price quantity 1.00. This will return an empty list if getPriceInfo() would return null, and if there is
 only one price info in the collection it will be the same price info as getPriceInfo(). Two or more price infos
 indicate that there are that many price books that meet the criteria for returning the price shown in the
 storefront.

### pricePerUnit

**Type:** Money (Read Only)

The sales price per unit of a product, calculated based on base price
 quantity 1.00.
 
 The product sales price per unit is returned for the current session currency.
 Hence, the using this method is only useful in storefront processes.
 
 The price lookup is based on the configuration of price books. It depends
 on various settings, such as which price books are active, or explicitly
 set as applicable in the current session.
 
 If no price could be found, MONEY.N_A is returned.

### priceRange

**Type:** boolean (Read Only)

Returns true if this product is a master product (or product set) and the
 collection of online variants (or set products respectively) contains
 products of different prices.

 Warning:  If the product represented by this model is a master
 product with numerous variants, this method can be very expensive and
 should be avoided.

### priceTable

**Type:** ProductPriceTable (Read Only)

The product price table object. The price table represents a map
 between order quantities and prices, and also provides % off information
 to be shown to storefront customers. The price is returned for the
 currency of the current session.
 
 Usually, the product price table is printed on product detail pages in
 the storefront.
 
 If the product represented by this model is an option product, option
 prices will be added to the price book price if the price model was
 initialized with an option model.
 
 All other methods of this class are based on the information in the
 product price table.

## Constructor Summary

## Method Summary

### getBasePriceQuantity

**Signature:** `getBasePriceQuantity() : Quantity`

Returns the quantity for which the base price is defined.

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

Calculates and returns the maximum price-book price of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMaxPriceBookPrice

**Signature:** `getMaxPriceBookPrice(priceBookID : String) : Money`

Calculates and returns the maximum price in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMaxPriceBookPricePerUnit

**Signature:** `getMaxPriceBookPricePerUnit(priceBookID : String) : Money`

Calculates and returns the maximum price per unit in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMaxPricePerUnit

**Signature:** `getMaxPricePerUnit() : Money`

Calculates and returns the maximum price-book price per unit of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMinPrice

**Signature:** `getMinPrice() : Money`

Calculates and returns the minimum price-book price of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMinPriceBookPrice

**Signature:** `getMinPriceBookPrice(priceBookID : String) : Money`

Calculates and returns the minimum price in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMinPriceBookPricePerUnit

**Signature:** `getMinPriceBookPricePerUnit(priceBookID : String) : Money`

Calculates and returns the minimum price per unit in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getMinPricePerUnit

**Signature:** `getMinPricePerUnit() : Money`

Calculates and returns the minimum price-book price per unit of all variants (for master products) or set-products (for product sets) for base quantity 1.00.

### getPrice

**Signature:** `getPrice() : Money`

Returns the active price of a product, calculated based on base price quantity 1.00.

### getPrice

**Signature:** `getPrice(quantity : Quantity) : Money`

Returns the active price of a product, calculated based on the passed order quantity.

### getPriceBookPrice

**Signature:** `getPriceBookPrice(priceBookID : String) : Money`

Returns the active price of the product in the specified price book for quantity 1.00.

### getPriceBookPrice

**Signature:** `getPriceBookPrice(priceBookID : String, quantity : Quantity) : Money`

Returns the active price of the product in the specified price book for the specified quantity.

### getPriceBookPriceInfo

**Signature:** `getPriceBookPriceInfo(priceBookID : String) : ProductPriceInfo`

This method acts similarly to getPriceBookPrice(String) but returns a ProductPriceInfo object wrapping the actual price with additional information.

### getPriceBookPriceInfo

**Signature:** `getPriceBookPriceInfo(priceBookID : String, quantity : Quantity) : ProductPriceInfo`

This method acts similarly to getPriceBookPrice(String, Quantity) but returns a ProductPriceInfo object wrapping the actual price with additional information.

### getPriceBookPricePerUnit

**Signature:** `getPriceBookPricePerUnit(priceBookID : String) : Money`

Returns the active price per unit of the product in the specified price book for quantity 1.00.

### getPriceBookPricePerUnit

**Signature:** `getPriceBookPricePerUnit(priceBookID : String, quantity : Quantity) : Money`

Returns the active price per unit of the product in the specified price book for the specified quantity.

### getPriceInfo

**Signature:** `getPriceInfo() : ProductPriceInfo`

Returns the active price info of a product, calculated based on base price quantity 1.00.

### getPriceInfo

**Signature:** `getPriceInfo(quantity : Quantity) : ProductPriceInfo`

Returns the active price info of a product, calculated based on the passed order quantity.

### getPriceInfos

**Signature:** `getPriceInfos() : Collection`

Returns all the eligible ProductPriceInfo(s), calculated based on base price quantity 1.00.

### getPricePercentage

**Signature:** `getPricePercentage(basePrice : Money, comparePrice : Money) : Number`

Calculates and returns the percentage off amount of the passed comparePrice to the passed basePrice.

### getPricePerUnit

**Signature:** `getPricePerUnit() : Money`

Returns the sales price per unit of a product, calculated based on base price quantity 1.00.

### getPricePerUnit

**Signature:** `getPricePerUnit(quantity : Quantity) : Money`

Returns the sales price per unit of a product, calculated based on the passed order quantity.

### getPriceTable

**Signature:** `getPriceTable() : ProductPriceTable`

Returns the product price table object.

### isPriceRange

**Signature:** `isPriceRange() : boolean`

Returns true if this product is a master product (or product set) and the collection of online variants (or set products respectively) contains products of different prices.

### isPriceRange

**Signature:** `isPriceRange(priceBookID : String) : boolean`

Returns true if this product is a master product (or product set) and the collection of online variants (or set products respectively) contains products of different prices in the specified price book.

## Method Detail

## Method Details

### getBasePriceQuantity

**Signature:** `getBasePriceQuantity() : Quantity`

**Description:** Returns the quantity for which the base price is defined. This is typically 1.0.

**Returns:**

the quantity for which the base price is defined.

---

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

**Description:** Calculates and returns the maximum price-book price of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. If the product represented by this model is not a master product or product set, then this method behaves the same as getPrice(). Only online products are considered. If the "orderable products only" search preference is enabled for the current site, then only orderable products are considered. For master products, only variants with all variation attributes configured are considered. Warning: If the product represented by this model is a master product with numerous variants, this method can be very expensive and should be avoided.

**Returns:**

Maximum price of all online variants or set-products.

---

### getMaxPriceBookPrice

**Signature:** `getMaxPriceBookPrice(priceBookID : String) : Money`

**Description:** Calculates and returns the maximum price in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. This method follows the same rules as getPriceBookPrice(String) in determining the price book price for each variant or set-product. If the product represented by this model is not a master product or product set, then this method behaves the same as getPriceBookPrice(String).

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

The maximum price across all subproducts in the specified price book.

---

### getMaxPriceBookPricePerUnit

**Signature:** `getMaxPriceBookPricePerUnit(priceBookID : String) : Money`

**Description:** Calculates and returns the maximum price per unit in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of price per units in storefront. This method follows the same rules as getPriceBookPricePerUnit(String) in determining the price book price for each variant or set-product. If the product represented by this model is not a master product or product set, then this method behaves the same as getPriceBookPricePerUnit(String).

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

The maximum price per unit across all sub-products in the specified price book.

---

### getMaxPricePerUnit

**Signature:** `getMaxPricePerUnit() : Money`

**Description:** Calculates and returns the maximum price-book price per unit of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. If the product represented by this model is not a master product or product set, then this method behaves the same as getPricePerUnit(). Only online products are considered. If the "orderable products only" search preference is enabled for the current site, then only orderable products are considered. For master products, only variants with all variation attributes configured are considered. e.g. suppose one master product mp (price = $6, unitQuantity = 2), it has 2 variants: v1(price = $5, unitQuantity = 5), v2(price = $10, unitQuantity = 20). The max price per unit of mp will be max($6/2, $5/5, $10/20) = $3

**Returns:**

Maximum price per unit of all online variants or set-products.

---

### getMinPrice

**Signature:** `getMinPrice() : Money`

**Description:** Calculates and returns the minimum price-book price of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. If the product represented by this model is not a master product or product set, then this method behaves the same as getPrice(). Only online products are considered. If the "orderable products only" search preference is enabled for the current site, then only orderable products are considered. For master products, only variants with all variation attributes configured are considered. Warning: If the product represented by this model is a master product with numerous variants, this method can be very expensive and should be avoided.

**Returns:**

Minimum price of all online variants or set-products.

---

### getMinPriceBookPrice

**Signature:** `getMinPriceBookPrice(priceBookID : String) : Money`

**Description:** Calculates and returns the minimum price in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. This method follows the same rules as getPriceBookPrice(String) in determining the price book price for each variant or set-product. If the product represented by this model is not a master product or product set, then this method behaves the same as getPriceBookPrice(String).

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

The minimum price across all subproducts in the specified price book.

---

### getMinPriceBookPricePerUnit

**Signature:** `getMinPriceBookPricePerUnit(priceBookID : String) : Money`

**Description:** Calculates and returns the minimum price per unit in a given price book of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of price per units in storefront. This method follows the same rules as getPriceBookPricePerUnit(String) in determining the price book price for each variant or set-product. If the product represented by this model is not a master product or product set, then this method behaves the same as getPriceBookPricePerUnit(String).

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

The minimum price per unit across all sub-products in the specified price book.

---

### getMinPricePerUnit

**Signature:** `getMinPricePerUnit() : Money`

**Description:** Calculates and returns the minimum price-book price per unit of all variants (for master products) or set-products (for product sets) for base quantity 1.00. This value can be used to display a range of prices in storefront. If the product represented by this model is not a master product or product set, then this method behaves the same as getPricePerUnit(). Only online products are considered. If the "orderable products only" search preference is enabled for the current site, then only orderable products are considered. For master products, only variants with all variation attributes configured are considered. e.g. suppose one master product mp (price = $6, unitQuantity = 2), it has 2 variants: v1(price = $5, unitQuantity = 5), v2(price = $10, unitQuantity = 20). The min price per unit of mp will be min($6/2, $5/5, $10/20) = $0.5

**Returns:**

Minimum price of all online variants or set-products.

---

### getPrice

**Signature:** `getPrice() : Money`

**Description:** Returns the active price of a product, calculated based on base price quantity 1.00. The price is returned for the currency of the current session. The price lookup is based on the configuration of price books. It depends on various settings, such as which price books are active, or explicitly set as applicable in the current session. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. If no price could be found, MONEY.NOT_AVAILABLE is returned.

**Returns:**

the product price.

---

### getPrice

**Signature:** `getPrice(quantity : Quantity) : Money`

**Description:** Returns the active price of a product, calculated based on the passed order quantity. The price is returned for the currency of the current session. The price lookup is based on the configuration of price books. It depends on various settings, such as which price books are active, or explicitly set as applicable in the current session. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. If passed order quantity < 1 (and greater than zero), price for quantity 1 is returned. If no price could be found, MONEY.NOT_AVAILABLE is returned.

**Parameters:**

- `quantity`: Quantity price is requested for

**Returns:**

the product price.

---

### getPriceBookPrice

**Signature:** `getPriceBookPrice(priceBookID : String) : Money`

**Description:** Returns the active price of the product in the specified price book for quantity 1.00. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. Money.NOT_AVAILABLE will be returned in any of the following cases: priceBookID is null or does not identify a valid price book. The price book has no price for the product. None of the prices for the product in the price book is currently active. The currently active price entry is a percentage.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for.

**Returns:**

the price of the product in the specified price book.

---

### getPriceBookPrice

**Signature:** `getPriceBookPrice(priceBookID : String, quantity : Quantity) : Money`

**Description:** Returns the active price of the product in the specified price book for the specified quantity. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. Money.NOT_AVAILABLE will be returned in any of the following cases: priceBookID is null or does not identify a valid price book. quantity is null. The price book has no price for the product. None of the prices for the product in the price book is currently active. The currently active price entry is a percentage.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for.
- `quantity`: the specified quantity to find the price for.

**Returns:**

the price of the product in the specified price book.

---

### getPriceBookPriceInfo

**Signature:** `getPriceBookPriceInfo(priceBookID : String) : ProductPriceInfo`

**Description:** This method acts similarly to getPriceBookPrice(String) but returns a ProductPriceInfo object wrapping the actual price with additional information.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

the product price info, or null if not found.

---

### getPriceBookPriceInfo

**Signature:** `getPriceBookPriceInfo(priceBookID : String, quantity : Quantity) : ProductPriceInfo`

**Description:** This method acts similarly to getPriceBookPrice(String, Quantity) but returns a ProductPriceInfo object wrapping the actual price with additional information.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.
- `quantity`: Quantity price is requested for.

**Returns:**

the product price info, or null if not found.

---

### getPriceBookPricePerUnit

**Signature:** `getPriceBookPricePerUnit(priceBookID : String) : Money`

**Description:** Returns the active price per unit of the product in the specified price book for quantity 1.00. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. Money.NOT_AVAILABLE will be returned in any of the following cases: The priceBookID does not identify a valid price book. The price book has no price for the product. None of the prices for the product in the price book is currently active. The currently active price entry is a percentage.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.

**Returns:**

the price per unit of the product in the specified price book.

---

### getPriceBookPricePerUnit

**Signature:** `getPriceBookPricePerUnit(priceBookID : String, quantity : Quantity) : Money`

**Description:** Returns the active price per unit of the product in the specified price book for the specified quantity. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. Money.NOT_AVAILABLE will be returned in any of the following cases: The priceBookID does not identify a valid price book. The price book has no price for the product. None of the prices for the product in the price book is currently active. The currently active price entry is a percentage.

**Parameters:**

- `priceBookID`: ID of price book the price is requested for, must not be null.
- `quantity`: the specified quantity to find the price for, must not be null.

**Returns:**

the price per unit of the product in the specified price book for the specific quantity.

---

### getPriceInfo

**Signature:** `getPriceInfo() : ProductPriceInfo`

**Description:** Returns the active price info of a product, calculated based on base price quantity 1.00. The price is returned for the currency of the current session. This method is similar to getPrice() but instead of just returning the price value, it returns a ProductPriceInfo which contains additional information such as the PriceBook which defined the price and the percentage discount this price point represents. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. If no price info could be found, null is returned.

**Returns:**

the product price info, or null if not found.

**See Also:**

getPrice()
getPriceInfo(Quantity)

---

### getPriceInfo

**Signature:** `getPriceInfo(quantity : Quantity) : ProductPriceInfo`

**Description:** Returns the active price info of a product, calculated based on the passed order quantity. The price is returned for the currency of the current session. This method is similar to getPrice(Quantity) but instead of just returning the price value, it returns a ProductPriceInfo which contains additional information such as the PriceBook which defined the price and the percentage discount this price point represents. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. If no price info could be found, null is returned.

**Parameters:**

- `quantity`: the quantity to use.

**Returns:**

the product price info, or null if not found.

**See Also:**

getPrice(Quantity)

---

### getPriceInfos

**Signature:** `getPriceInfos() : Collection`

**Description:** Returns all the eligible ProductPriceInfo(s), calculated based on base price quantity 1.00. This will return an empty list if getPriceInfo() would return null, and if there is only one price info in the collection it will be the same price info as getPriceInfo(). Two or more price infos indicate that there are that many price books that meet the criteria for returning the price shown in the storefront.

**Returns:**

any product price info that could be responsible for the storefront price, or empty collection if there were no product price infos this price model.

**See Also:**

getPriceInfo()

---

### getPricePercentage

**Signature:** `getPricePercentage(basePrice : Money, comparePrice : Money) : Number`

**Description:** Calculates and returns the percentage off amount of the passed comparePrice to the passed basePrice.

**Deprecated:**

Use Money.percentLessThan(Money)

**Parameters:**

- `basePrice`: The assumed 100% price amount
- `comparePrice`: The price to compare to the basePrice

**Returns:**

The percentage between comparePrice and basePrice (e.g. 90%).

---

### getPricePerUnit

**Signature:** `getPricePerUnit() : Money`

**Description:** Returns the sales price per unit of a product, calculated based on base price quantity 1.00. The product sales price per unit is returned for the current session currency. Hence, the using this method is only useful in storefront processes. The price lookup is based on the configuration of price books. It depends on various settings, such as which price books are active, or explicitly set as applicable in the current session. If no price could be found, MONEY.N_A is returned.

**Returns:**

product sales price per unit

---

### getPricePerUnit

**Signature:** `getPricePerUnit(quantity : Quantity) : Money`

**Description:** Returns the sales price per unit of a product, calculated based on the passed order quantity. The product sales price per unit is returned for the current session currency. Hence, the using this method is only useful in storefront processes. The price lookup is based on the configuration of price books. It depends on various settings, such as which price books are active, or explicitely set as applicable in the current session. If no price could be found, MONEY.N_A is returned.

**Parameters:**

- `quantity`: Quantity price is requested for

**Returns:**

product sales price per unit

---

### getPriceTable

**Signature:** `getPriceTable() : ProductPriceTable`

**Description:** Returns the product price table object. The price table represents a map between order quantities and prices, and also provides % off information to be shown to storefront customers. The price is returned for the currency of the current session. Usually, the product price table is printed on product detail pages in the storefront. If the product represented by this model is an option product, option prices will be added to the price book price if the price model was initialized with an option model. All other methods of this class are based on the information in the product price table.

**Returns:**

the Product price table.

---

### isPriceRange

**Signature:** `isPriceRange() : boolean`

**Description:** Returns true if this product is a master product (or product set) and the collection of online variants (or set products respectively) contains products of different prices. Warning: If the product represented by this model is a master product with numerous variants, this method can be very expensive and should be avoided.

**Returns:**

True if this product has a range of prices, false otherwise.

---

### isPriceRange

**Signature:** `isPriceRange(priceBookID : String) : boolean`

**Description:** Returns true if this product is a master product (or product set) and the collection of online variants (or set products respectively) contains products of different prices in the specified price book.

**Parameters:**

- `priceBookID`: The ID of the price book.

**Returns:**

True if this product has a range of prices, false otherwise.

---