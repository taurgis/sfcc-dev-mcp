## Package: dw.extensions.pinterest

# Class PinterestProduct

## Inheritance Hierarchy

- Object
  - dw.extensions.pinterest.PinterestProduct

## Description

Represents a row in the Pinterest catalog feed export.

## Constants

## Properties

### availability

**Type:** String

The availability of the Pinterest product. Possible values are
 AVAILABILITY_IN_STOCK or
 AVAILABILITY_OUT_OF_STOCK.

### brand

**Type:** String

The Pinterest brand of the product.

### color

**Type:** String

The Pinterest color value label of the product.

### colorHex

**Type:** String

The Pinterest color hex value of the product.

### colorImage

**Type:** URL

The URL of the image to show in Pinterest for the product color (swatch).

### condition

**Type:** String

The condition of the Pinterest product. Possible values are
 CONDITION_NEW,
 CONDITION_REFURBISHED, or
 CONDITION_USED.

### description

**Type:** String

The Pinterest description of the product.

### googleProductCategory

**Type:** String

The category of this product in the Google category taxonomy.

### gtin

**Type:** String

The Pinterest GTIN of the product.

### ID

**Type:** String (Read Only)

The ID of the Pinterest product. This is the same as the ID of the Demandware product.

### imageLinks

**Type:** List

A list containing the URLs of the image to show in Pinterest for the product.

### itemGroupID

**Type:** String

The ID of the Pinterest item group for the product, that is, its master product.

### itemGroupLink

**Type:** URL

The URL of the Pinterest item group for the product, that is, the link to its master product in the
 Demandware storefront.

### link

**Type:** URL

The URL of the Demandware storefront link to the product.

### maxPrice

**Type:** Money

The maximum price to show in Pinterest for the product.

### minPrice

**Type:** Money

The minimum price to show in Pinterest for the product.

### price

**Type:** Money

The price to show in Pinterest for the product.

### productCategory

**Type:** String

The Pinterest category path of the product.

### returnPolicy

**Type:** String

The Pinterest return policy of the product.

### size

**Type:** String

The Pinterest size value label of the product.

### title

**Type:** String

The Pinterest title of the product.

## Constructor Summary

## Method Summary

### getAvailability

**Signature:** `getAvailability() : String`

Returns the availability of the Pinterest product.

### getBrand

**Signature:** `getBrand() : String`

Returns the Pinterest brand of the product.

### getColor

**Signature:** `getColor() : String`

Returns the Pinterest color value label of the product.

### getColorHex

**Signature:** `getColorHex() : String`

Returns the Pinterest color hex value of the product.

### getColorImage

**Signature:** `getColorImage() : URL`

Returns the URL of the image to show in Pinterest for the product color (swatch).

### getCondition

**Signature:** `getCondition() : String`

Returns the condition of the Pinterest product.

### getDescription

**Signature:** `getDescription() : String`

Returns the Pinterest description of the product.

### getGoogleProductCategory

**Signature:** `getGoogleProductCategory() : String`

Returns the category of this product in the Google category taxonomy.

### getGtin

**Signature:** `getGtin() : String`

Returns the Pinterest GTIN of the product.

### getID

**Signature:** `getID() : String`

Returns the ID of the Pinterest product.

### getImageLinks

**Signature:** `getImageLinks() : List`

Returns a list containing the URLs of the image to show in Pinterest for the product.

### getItemGroupID

**Signature:** `getItemGroupID() : String`

Returns the ID of the Pinterest item group for the product, that is, its master product.

### getItemGroupLink

**Signature:** `getItemGroupLink() : URL`

Returns the URL of the Pinterest item group for the product, that is, the link to its master product in the Demandware storefront.

### getLink

**Signature:** `getLink() : URL`

Returns the URL of the Demandware storefront link to the product.

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

Returns the maximum price to show in Pinterest for the product.

### getMinPrice

**Signature:** `getMinPrice() : Money`

Returns the minimum price to show in Pinterest for the product.

### getPrice

**Signature:** `getPrice() : Money`

Returns the price to show in Pinterest for the product.

### getProductCategory

**Signature:** `getProductCategory() : String`

Returns the Pinterest category path of the product.

### getReturnPolicy

**Signature:** `getReturnPolicy() : String`

Returns the Pinterest return policy of the product.

### getSize

**Signature:** `getSize() : String`

Returns the Pinterest size value label of the product.

### getTitle

**Signature:** `getTitle() : String`

Returns the Pinterest title of the product.

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

Sets the availability of the Pinterest product.

### setBrand

**Signature:** `setBrand(brand : String) : void`

Sets the Pinterest brand of the product.

### setColor

**Signature:** `setColor(color : String) : void`

Sets the Pinterest color value label of the product.

### setColorHex

**Signature:** `setColorHex(colorHex : String) : void`

Sets the Pinterest color hex value of the product.

### setColorImage

**Signature:** `setColorImage(colorImage : URL) : void`

Sets the URL of the image to show in Pinterest for the product color (swatch).

### setCondition

**Signature:** `setCondition(condition : String) : void`

Sets the condition of the Pinterest product.

### setDescription

**Signature:** `setDescription(description : String) : void`

Sets the Pinterest description of the product.

### setGoogleProductCategory

**Signature:** `setGoogleProductCategory(googleProductCategory : String) : void`

Sets the category of this product in the Google category taxonomy.

### setGtin

**Signature:** `setGtin(gtin : String) : void`

Sets the Pinterest GTIN of the product.

### setImageLinks

**Signature:** `setImageLinks(imageLinks : List) : void`

Sets the list of URLs of images to show in Pinterest for the product.

### setItemGroupID

**Signature:** `setItemGroupID(itemGroupID : String) : void`

Sets the ID of the Pinterest item group for the product, that is, its master product.

### setItemGroupLink

**Signature:** `setItemGroupLink(itemGroupLink : URL) : void`

Sets the URL of the Pinterest item group for the product, that is, the link to its master product in the Demandware storefront.

### setLink

**Signature:** `setLink(link : URL) : void`

Sets the URL of the Demandware storefront link to the product.

### setMaxPrice

**Signature:** `setMaxPrice(maxPrice : Money) : void`

Sets the maximum price to show in Pinterest for the product.

### setMinPrice

**Signature:** `setMinPrice(minPrice : Money) : void`

Sets the minimum price to show in Pinterest for the product.

### setPrice

**Signature:** `setPrice(price : Money) : void`

Sets the price to show in Pinterest for the product.

### setProductCategory

**Signature:** `setProductCategory(productCategory : String) : void`

Sets the Pinterest category path of the product.

### setReturnPolicy

**Signature:** `setReturnPolicy(returnPolicy : String) : void`

Sets the Pinterest return policy of the product.

### setSize

**Signature:** `setSize(size : String) : void`

Sets the Pinterest size value label of the product.

### setTitle

**Signature:** `setTitle(title : String) : void`

Sets the Pinterest title of the product.

## Method Detail

## Method Details

### getAvailability

**Signature:** `getAvailability() : String`

**Description:** Returns the availability of the Pinterest product. Possible values are AVAILABILITY_IN_STOCK or AVAILABILITY_OUT_OF_STOCK.

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the Pinterest brand of the product.

---

### getColor

**Signature:** `getColor() : String`

**Description:** Returns the Pinterest color value label of the product.

---

### getColorHex

**Signature:** `getColorHex() : String`

**Description:** Returns the Pinterest color hex value of the product.

---

### getColorImage

**Signature:** `getColorImage() : URL`

**Description:** Returns the URL of the image to show in Pinterest for the product color (swatch).

---

### getCondition

**Signature:** `getCondition() : String`

**Description:** Returns the condition of the Pinterest product. Possible values are CONDITION_NEW, CONDITION_REFURBISHED, or CONDITION_USED.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the Pinterest description of the product.

---

### getGoogleProductCategory

**Signature:** `getGoogleProductCategory() : String`

**Description:** Returns the category of this product in the Google category taxonomy.

---

### getGtin

**Signature:** `getGtin() : String`

**Description:** Returns the Pinterest GTIN of the product.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the Pinterest product. This is the same as the ID of the Demandware product.

**Returns:**

product ID

---

### getImageLinks

**Signature:** `getImageLinks() : List`

**Description:** Returns a list containing the URLs of the image to show in Pinterest for the product.

---

### getItemGroupID

**Signature:** `getItemGroupID() : String`

**Description:** Returns the ID of the Pinterest item group for the product, that is, its master product.

---

### getItemGroupLink

**Signature:** `getItemGroupLink() : URL`

**Description:** Returns the URL of the Pinterest item group for the product, that is, the link to its master product in the Demandware storefront.

---

### getLink

**Signature:** `getLink() : URL`

**Description:** Returns the URL of the Demandware storefront link to the product.

---

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

**Description:** Returns the maximum price to show in Pinterest for the product.

---

### getMinPrice

**Signature:** `getMinPrice() : Money`

**Description:** Returns the minimum price to show in Pinterest for the product.

---

### getPrice

**Signature:** `getPrice() : Money`

**Description:** Returns the price to show in Pinterest for the product.

---

### getProductCategory

**Signature:** `getProductCategory() : String`

**Description:** Returns the Pinterest category path of the product.

---

### getReturnPolicy

**Signature:** `getReturnPolicy() : String`

**Description:** Returns the Pinterest return policy of the product.

---

### getSize

**Signature:** `getSize() : String`

**Description:** Returns the Pinterest size value label of the product.

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the Pinterest title of the product.

---

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

**Description:** Sets the availability of the Pinterest product. Possible values are AVAILABILITY_IN_STOCK or AVAILABILITY_OUT_OF_STOCK.

**Parameters:**

- `availability`: the availability status to set for this product

---

### setBrand

**Signature:** `setBrand(brand : String) : void`

**Description:** Sets the Pinterest brand of the product.

**Parameters:**

- `brand`: Pinterest brand

---

### setColor

**Signature:** `setColor(color : String) : void`

**Description:** Sets the Pinterest color value label of the product.

**Parameters:**

- `color`: Pinterest color value label

---

### setColorHex

**Signature:** `setColorHex(colorHex : String) : void`

**Description:** Sets the Pinterest color hex value of the product.

**Parameters:**

- `colorHex`: Pinterest color hex value

---

### setColorImage

**Signature:** `setColorImage(colorImage : URL) : void`

**Description:** Sets the URL of the image to show in Pinterest for the product color (swatch).

**Parameters:**

- `colorImage`: link to Pinterest color image

---

### setCondition

**Signature:** `setCondition(condition : String) : void`

**Description:** Sets the condition of the Pinterest product. Possible values are CONDITION_NEW, CONDITION_REFURBISHED, or CONDITION_USED.

**Parameters:**

- `condition`: the condition status to set for this product

---

### setDescription

**Signature:** `setDescription(description : String) : void`

**Description:** Sets the Pinterest description of the product.

**Parameters:**

- `description`: Pinterest description

---

### setGoogleProductCategory

**Signature:** `setGoogleProductCategory(googleProductCategory : String) : void`

**Description:** Sets the category of this product in the Google category taxonomy.

**Parameters:**

- `googleProductCategory`: Google product category

---

### setGtin

**Signature:** `setGtin(gtin : String) : void`

**Description:** Sets the Pinterest GTIN of the product.

**Parameters:**

- `gtin`: Pinterest GTIN

---

### setImageLinks

**Signature:** `setImageLinks(imageLinks : List) : void`

**Description:** Sets the list of URLs of images to show in Pinterest for the product.

**Parameters:**

- `imageLinks`: links to the product images

---

### setItemGroupID

**Signature:** `setItemGroupID(itemGroupID : String) : void`

**Description:** Sets the ID of the Pinterest item group for the product, that is, its master product.

**Parameters:**

- `itemGroupID`: ID of Pinterest item group

---

### setItemGroupLink

**Signature:** `setItemGroupLink(itemGroupLink : URL) : void`

**Description:** Sets the URL of the Pinterest item group for the product, that is, the link to its master product in the Demandware storefront.

**Parameters:**

- `itemGroupLink`: link to the Pinterest item group

---

### setLink

**Signature:** `setLink(link : URL) : void`

**Description:** Sets the URL of the Demandware storefront link to the product.

**Parameters:**

- `link`: Demandware storefront link to the product

---

### setMaxPrice

**Signature:** `setMaxPrice(maxPrice : Money) : void`

**Description:** Sets the maximum price to show in Pinterest for the product.

**Parameters:**

- `maxPrice`: Pinterest maximum price

---

### setMinPrice

**Signature:** `setMinPrice(minPrice : Money) : void`

**Description:** Sets the minimum price to show in Pinterest for the product.

**Parameters:**

- `minPrice`: Pinterest minimum price

---

### setPrice

**Signature:** `setPrice(price : Money) : void`

**Description:** Sets the price to show in Pinterest for the product.

**Parameters:**

- `price`: Pinterest price

---

### setProductCategory

**Signature:** `setProductCategory(productCategory : String) : void`

**Description:** Sets the Pinterest category path of the product.

**Parameters:**

- `productCategory`: Pinterest category path

---

### setReturnPolicy

**Signature:** `setReturnPolicy(returnPolicy : String) : void`

**Description:** Sets the Pinterest return policy of the product.

**Parameters:**

- `returnPolicy`: Pinterest return policy

---

### setSize

**Signature:** `setSize(size : String) : void`

**Description:** Sets the Pinterest size value label of the product.

**Parameters:**

- `size`: Pinterest size value label

---

### setTitle

**Signature:** `setTitle(title : String) : void`

**Description:** Sets the Pinterest title of the product.

**Parameters:**

- `title`: Pinterest title

---