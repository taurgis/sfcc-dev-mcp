## Package: dw.extensions.facebook

# Class FacebookProduct

## Inheritance Hierarchy

- Object
  - dw.extensions.facebook.FacebookProduct

## Description

Represents a row in the Facebook catalog feed export.

## Constants

### AGE_GROUP_ADULT

**Type:** String = "adult"

Indicates that the product is for adults.

### AGE_GROUP_INFANT

**Type:** String = "infant"

Indicates that the product is for infant children.

### AGE_GROUP_KIDS

**Type:** String = "kids"

Indicates that the product is for children.

### AGE_GROUP_NEWBORN

**Type:** String = "newborn"

Indicates that the product is for newborn children.

### AGE_GROUP_TODDLER

**Type:** String = "toddler"

Indicates that the product is for toddler children.

### AVAILABILITY_AVAILABLE_FOR_ORDER

**Type:** String = "available

Indicates that the product can be ordered for later shipment.

### AVAILABILITY_IN_STOCK

**Type:** String = "in

Indicates that the product is available to ship immediately.

### AVAILABILITY_OUT_OF_STOCK

**Type:** String = "out

Indicates that the product is out of stock.

### AVAILABILITY_PREORDER

**Type:** String = "preorder"

Indicates that the product will be available in the future.

### CONDITION_NEW

**Type:** String = "new"

Indicates that the product is new.

### CONDITION_REFURBISHED

**Type:** String = "refurbished"

Indicates that the product is used but has been refurbished.

### CONDITION_USED

**Type:** String = "used"

Indicates that the product has been used.

### GENDER_FEMALE

**Type:** String = "female"

Indicates that the product is for females.

### GENDER_MALE

**Type:** String = "male"

Indicates that the product is for males.

### GENDER_UNISEX

**Type:** String = "unisex"

Indicates that the product is for both males and females.

### SHIPPING_SIZE_UNIT_CM

**Type:** String = "cm"

Indicates that the product is measured in centimeters.

### SHIPPING_SIZE_UNIT_FT

**Type:** String = "ft"

Indicates that the product is measured in feet.

### SHIPPING_SIZE_UNIT_IN

**Type:** String = "in"

Indicates that the product is measured in inches.

### SHIPPING_SIZE_UNIT_M

**Type:** String = "m"

Indicates that the product is measured in meters.

### SHIPPING_WEIGHT_UNIT_G

**Type:** String = "g"

Indicates that the product is weighed in grams.

### SHIPPING_WEIGHT_UNIT_KG

**Type:** String = "kg"

Indicates that the product is weighed in kilograms.

### SHIPPING_WEIGHT_UNIT_LB

**Type:** String = "lb"

Indicates that the product is weighed in pounds.

### SHIPPING_WEIGHT_UNIT_OZ

**Type:** String = "oz"

Indicates that the product is weighed in ounces.

## Properties

### ageGroup

**Type:** String

The age group for the Facebook product.

### availability

**Type:** String

The availability of the Facebook product.

### brand

**Type:** String

The Facebook brand of the product.

### color

**Type:** String

The Facebook color value label of the product.

### condition

**Type:** String

The condition of the Facebook product.

### customLabel0

**Type:** String

The Facebook custom label 0 value of the product.

### customLabel1

**Type:** String

The Facebook custom label 1 value of the product.

### customLabel2

**Type:** String

The Facebook custom label 2 value of the product.

### customLabel3

**Type:** String

The Facebook custom label 3 value of the product.

### customLabel4

**Type:** String

The Facebook custom label 4 value of the product.

### description

**Type:** String

The description of the Facebook product.

### expirationDate

**Type:** Date

The Facebook expiration date of the product. If the product is expired it will not be shown.

### gender

**Type:** String

The gender for the Facebook product.

### googleProductCategory

**Type:** String

The category of this product in the Google category taxonomy. If the value is longer than 250 characters
 it is truncated.

### gtin

**Type:** String

The Facebook GTIN of the product.

### ID

**Type:** String (Read Only)

The ID of the Facebook product. This is the same as the ID of the Demandware product.

### imageLinks

**Type:** List

A list containing the URLs of the images to show in Facebook for the product.

### itemGroupID

**Type:** String

The ID of the Facebook item group for the product, that is, its master product.

### link

**Type:** URL

The URL of the Demandware storefront link to the product.

### material

**Type:** String

The Facebook material value label of the product.

### mpn

**Type:** String

The Facebook MPN of the product.

### pattern

**Type:** String

The Facebook pattern value label of the product.

### price

**Type:** Money

The price to show in Facebook for the product.

### productType

**Type:** String

The Facebook product type. This is the retailer-defined category of the item.

### salePrice

**Type:** Money

The sale price to show in Facebook for the product.

### salePriceEffectiveDateEnd

**Type:** Date

The end date of the Facebook sale price of the product.

### salePriceEffectiveDateStart

**Type:** Date

The start date of the Facebook sale price of the product.

### shippingHeight

**Type:** Number

The shipping height of the product.

### shippingLength

**Type:** Number

The shipping length of the product.

### shippingSizeUnit

**Type:** String

The shipping size unit of the product.

### shippingWeight

**Type:** Quantity

The shipping weight for the product.

### shippingWidth

**Type:** Number

The shipping width of the product.

### size

**Type:** String

The Facebook size value label of the product.

### title

**Type:** String

The title of the Facebook product.

## Constructor Summary

## Method Summary

### getAgeGroup

**Signature:** `getAgeGroup() : String`

Returns the age group for the Facebook product.

### getAvailability

**Signature:** `getAvailability() : String`

Returns the availability of the Facebook product.

### getBrand

**Signature:** `getBrand() : String`

Returns the Facebook brand of the product.

### getColor

**Signature:** `getColor() : String`

Returns the Facebook color value label of the product.

### getCondition

**Signature:** `getCondition() : String`

Returns the condition of the Facebook product.

### getCustomLabel0

**Signature:** `getCustomLabel0() : String`

Returns the Facebook custom label 0 value of the product.

### getCustomLabel1

**Signature:** `getCustomLabel1() : String`

Returns the Facebook custom label 1 value of the product.

### getCustomLabel2

**Signature:** `getCustomLabel2() : String`

Returns the Facebook custom label 2 value of the product.

### getCustomLabel3

**Signature:** `getCustomLabel3() : String`

Returns the Facebook custom label 3 value of the product.

### getCustomLabel4

**Signature:** `getCustomLabel4() : String`

Returns the Facebook custom label 4 value of the product.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the Facebook product.

### getExpirationDate

**Signature:** `getExpirationDate() : Date`

Returns the Facebook expiration date of the product.

### getGender

**Signature:** `getGender() : String`

Returns the gender for the Facebook product.

### getGoogleProductCategory

**Signature:** `getGoogleProductCategory() : String`

Returns the category of this product in the Google category taxonomy.

### getGtin

**Signature:** `getGtin() : String`

Returns the Facebook GTIN of the product.

### getID

**Signature:** `getID() : String`

Returns the ID of the Facebook product.

### getImageLinks

**Signature:** `getImageLinks() : List`

Returns a list containing the URLs of the images to show in Facebook for the product.

### getItemGroupID

**Signature:** `getItemGroupID() : String`

Returns the ID of the Facebook item group for the product, that is, its master product.

### getLink

**Signature:** `getLink() : URL`

Returns the URL of the Demandware storefront link to the product.

### getMaterial

**Signature:** `getMaterial() : String`

Returns the Facebook material value label of the product.

### getMpn

**Signature:** `getMpn() : String`

Returns the Facebook MPN of the product.

### getPattern

**Signature:** `getPattern() : String`

Returns the Facebook pattern value label of the product.

### getPrice

**Signature:** `getPrice() : Money`

Returns the price to show in Facebook for the product.

### getProductType

**Signature:** `getProductType() : String`

Returns the Facebook product type.

### getSalePrice

**Signature:** `getSalePrice() : Money`

Returns the sale price to show in Facebook for the product.

### getSalePriceEffectiveDateEnd

**Signature:** `getSalePriceEffectiveDateEnd() : Date`

Returns the end date of the Facebook sale price of the product.

### getSalePriceEffectiveDateStart

**Signature:** `getSalePriceEffectiveDateStart() : Date`

Returns the start date of the Facebook sale price of the product.

### getShippingHeight

**Signature:** `getShippingHeight() : Number`

Returns the shipping height of the product.

### getShippingLength

**Signature:** `getShippingLength() : Number`

Returns the shipping length of the product.

### getShippingSizeUnit

**Signature:** `getShippingSizeUnit() : String`

Returns the shipping size unit of the product.

### getShippingWeight

**Signature:** `getShippingWeight() : Quantity`

Returns the shipping weight for the product.

### getShippingWidth

**Signature:** `getShippingWidth() : Number`

Returns the shipping width of the product.

### getSize

**Signature:** `getSize() : String`

Returns the Facebook size value label of the product.

### getTitle

**Signature:** `getTitle() : String`

Returns the title of the Facebook product.

### setAgeGroup

**Signature:** `setAgeGroup(ageGroup : String) : void`

Sets the age group for the Facebook product.

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

Sets the availability of the Facebook product.

### setBrand

**Signature:** `setBrand(brand : String) : void`

Sets the Facebook brand of the product.

### setColor

**Signature:** `setColor(color : String) : void`

Sets the Facebook color value label of the product.

### setCondition

**Signature:** `setCondition(condition : String) : void`

Sets the condition of the Facebook product.

### setCustomLabel0

**Signature:** `setCustomLabel0(customLabel0 : String) : void`

Sets the Facebook custom label 0 value of the product.

### setCustomLabel1

**Signature:** `setCustomLabel1(customLabel1 : String) : void`

Sets the Facebook custom label 1 value of the product.

### setCustomLabel2

**Signature:** `setCustomLabel2(customLabel2 : String) : void`

Sets the Facebook custom label 2 value of the product.

### setCustomLabel3

**Signature:** `setCustomLabel3(customLabel3 : String) : void`

Sets the Facebook custom label 3 value of the product.

### setCustomLabel4

**Signature:** `setCustomLabel4(customLabel4 : String) : void`

Sets the Facebook custom label 4 value of the product.

### setDescription

**Signature:** `setDescription(description : String) : void`

Sets the description of the Facebook product.

### setExpirationDate

**Signature:** `setExpirationDate(expirationDate : Date) : void`

Sets the Facebook expiration date of the product.

### setGender

**Signature:** `setGender(gender : String) : void`

Sets the gender for the Facebook product.

### setGoogleProductCategory

**Signature:** `setGoogleProductCategory(googleProductCategory : String) : void`

Sets the category of this product in the Google category taxonomy.

### setGtin

**Signature:** `setGtin(gtin : String) : void`

Sets the Facebook GTIN of the product.

### setImageLinks

**Signature:** `setImageLinks(imageLinks : List) : void`

Sets the list of URLs of images to show in Facebook for the product.

### setItemGroupID

**Signature:** `setItemGroupID(itemGroupID : String) : void`

Sets the ID of the Facebook item group for the product, that is, its master product.

### setLink

**Signature:** `setLink(link : URL) : void`

Sets the URL of the Demandware storefront link to the product.

### setMaterial

**Signature:** `setMaterial(material : String) : void`

Sets the Facebook material value label of the product.

### setMpn

**Signature:** `setMpn(mpn : String) : void`

Sets the Facebook MPN of the product.

### setPattern

**Signature:** `setPattern(pattern : String) : void`

Sets the Facebook pattern value label of the product.

### setPrice

**Signature:** `setPrice(price : Money) : void`

Sets the price to show in Facebook for the product.

### setProductType

**Signature:** `setProductType(productType : String) : void`

Sets the Facebook product type.

### setSalePrice

**Signature:** `setSalePrice(salePrice : Money) : void`

Sets the sale price to show in Facebook for the product.

### setSalePriceEffectiveDateEnd

**Signature:** `setSalePriceEffectiveDateEnd(salePriceEffectiveDateEnd : Date) : void`

Sets the end date of the Facebook sale price of the product.

### setSalePriceEffectiveDateStart

**Signature:** `setSalePriceEffectiveDateStart(salePriceEffectiveDateStart : Date) : void`

Sets the start date of the Facebook sale price of the product.

### setShippingHeight

**Signature:** `setShippingHeight(shippingHeight : Number) : void`

Sets the shipping height of the product.

### setShippingLength

**Signature:** `setShippingLength(shippingLength : Number) : void`

Sets the shipping length of the product.

### setShippingSizeUnit

**Signature:** `setShippingSizeUnit(shippingSizeUnit : String) : void`

Sets the shipping size unit of the product.

### setShippingWeight

**Signature:** `setShippingWeight(shippingWeight : Quantity) : void`

Sets the shipping weight for the product.

### setShippingWidth

**Signature:** `setShippingWidth(shippingWidth : Number) : void`

Sets the shipping width of the product.

### setSize

**Signature:** `setSize(size : String) : void`

Sets the Facebook size value label of the product.

### setTitle

**Signature:** `setTitle(title : String) : void`

Sets the title of the Facebook product.

## Method Detail

## Method Details

### getAgeGroup

**Signature:** `getAgeGroup() : String`

**Description:** Returns the age group for the Facebook product.

**Returns:**

product age group

---

### getAvailability

**Signature:** `getAvailability() : String`

**Description:** Returns the availability of the Facebook product.

**Returns:**

product availability

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the Facebook brand of the product.

**Returns:**

the brand

---

### getColor

**Signature:** `getColor() : String`

**Description:** Returns the Facebook color value label of the product.

**Returns:**

the color value label

---

### getCondition

**Signature:** `getCondition() : String`

**Description:** Returns the condition of the Facebook product.

**Returns:**

product condition

---

### getCustomLabel0

**Signature:** `getCustomLabel0() : String`

**Description:** Returns the Facebook custom label 0 value of the product.

**Returns:**

the custom label 0 value

---

### getCustomLabel1

**Signature:** `getCustomLabel1() : String`

**Description:** Returns the Facebook custom label 1 value of the product.

**Returns:**

the custom label 1 value

---

### getCustomLabel2

**Signature:** `getCustomLabel2() : String`

**Description:** Returns the Facebook custom label 2 value of the product.

**Returns:**

the custom label 2 value

---

### getCustomLabel3

**Signature:** `getCustomLabel3() : String`

**Description:** Returns the Facebook custom label 3 value of the product.

**Returns:**

the custom label 3 value

---

### getCustomLabel4

**Signature:** `getCustomLabel4() : String`

**Description:** Returns the Facebook custom label 4 value of the product.

**Returns:**

the custom label 4 value

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the Facebook product.

**Returns:**

product description

---

### getExpirationDate

**Signature:** `getExpirationDate() : Date`

**Description:** Returns the Facebook expiration date of the product. If the product is expired it will not be shown.

**Returns:**

the expiration date

---

### getGender

**Signature:** `getGender() : String`

**Description:** Returns the gender for the Facebook product.

**Returns:**

product gender

---

### getGoogleProductCategory

**Signature:** `getGoogleProductCategory() : String`

**Description:** Returns the category of this product in the Google category taxonomy. If the value is longer than 250 characters it is truncated.

**Returns:**

the category of this product in the Google category taxonomy

---

### getGtin

**Signature:** `getGtin() : String`

**Description:** Returns the Facebook GTIN of the product.

**Returns:**

the GTIN

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the Facebook product. This is the same as the ID of the Demandware product.

**Returns:**

product ID

---

### getImageLinks

**Signature:** `getImageLinks() : List`

**Description:** Returns a list containing the URLs of the images to show in Facebook for the product.

**Returns:**

the URLs of the images

---

### getItemGroupID

**Signature:** `getItemGroupID() : String`

**Description:** Returns the ID of the Facebook item group for the product, that is, its master product.

**Returns:**

the ID of the Facebook item group

---

### getLink

**Signature:** `getLink() : URL`

**Description:** Returns the URL of the Demandware storefront link to the product.

**Returns:**

the URL of the storefront link

---

### getMaterial

**Signature:** `getMaterial() : String`

**Description:** Returns the Facebook material value label of the product.

**Returns:**

the material value label

---

### getMpn

**Signature:** `getMpn() : String`

**Description:** Returns the Facebook MPN of the product.

**Returns:**

the MPN

---

### getPattern

**Signature:** `getPattern() : String`

**Description:** Returns the Facebook pattern value label of the product.

**Returns:**

the pattern value label

---

### getPrice

**Signature:** `getPrice() : Money`

**Description:** Returns the price to show in Facebook for the product.

**Returns:**

the price to show in Facebook

---

### getProductType

**Signature:** `getProductType() : String`

**Description:** Returns the Facebook product type. This is the retailer-defined category of the item.

**Returns:**

the Facebook product type

---

### getSalePrice

**Signature:** `getSalePrice() : Money`

**Description:** Returns the sale price to show in Facebook for the product.

**Returns:**

the sale price to show in Facebook

---

### getSalePriceEffectiveDateEnd

**Signature:** `getSalePriceEffectiveDateEnd() : Date`

**Description:** Returns the end date of the Facebook sale price of the product.

**Returns:**

the end date of the Facebook sale price

---

### getSalePriceEffectiveDateStart

**Signature:** `getSalePriceEffectiveDateStart() : Date`

**Description:** Returns the start date of the Facebook sale price of the product.

**Returns:**

the start date of the Facebook sale price

---

### getShippingHeight

**Signature:** `getShippingHeight() : Number`

**Description:** Returns the shipping height of the product.

**Returns:**

the shipping height

**See Also:**

getShippingLength()
getShippingWidth()
getShippingSizeUnit()

---

### getShippingLength

**Signature:** `getShippingLength() : Number`

**Description:** Returns the shipping length of the product.

**Returns:**

the shipping length

**See Also:**

getShippingWidth()
getShippingHeight()
getShippingSizeUnit()

---

### getShippingSizeUnit

**Signature:** `getShippingSizeUnit() : String`

**Description:** Returns the shipping size unit of the product.

**Returns:**

the shipping size unit

**See Also:**

getShippingLength()
getShippingWidth()
getShippingHeight()

---

### getShippingWeight

**Signature:** `getShippingWeight() : Quantity`

**Description:** Returns the shipping weight for the product.

**Returns:**

the shipping weight

---

### getShippingWidth

**Signature:** `getShippingWidth() : Number`

**Description:** Returns the shipping width of the product.

**Returns:**

the shipping width

**See Also:**

getShippingLength()
getShippingHeight()
getShippingSizeUnit()

---

### getSize

**Signature:** `getSize() : String`

**Description:** Returns the Facebook size value label of the product.

**Returns:**

the size value label

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the title of the Facebook product.

**Returns:**

product title

---

### setAgeGroup

**Signature:** `setAgeGroup(ageGroup : String) : void`

**Description:** Sets the age group for the Facebook product. Possible values are AGE_GROUP_ADULT, AGE_GROUP_INFANT, AGE_GROUP_KIDS, AGE_GROUP_NEWBORN, AGE_GROUP_TODDLER, or null.

**Parameters:**

- `ageGroup`: the ageGroup to set for this product

---

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

**Description:** Sets the availability of the Facebook product. Possible values are AVAILABILITY_AVAILABLE_FOR_ORDER, AVAILABILITY_IN_STOCK, AVAILABILITY_OUT_OF_STOCK, or AVAILABILITY_PREORDER

**Parameters:**

- `availability`: the availability status to set for this product

---

### setBrand

**Signature:** `setBrand(brand : String) : void`

**Description:** Sets the Facebook brand of the product. If the value is longer than 70 characters it is truncated.

**Parameters:**

- `brand`: Facebook brand, up to 70 characters

---

### setColor

**Signature:** `setColor(color : String) : void`

**Description:** Sets the Facebook color value label of the product. If the value is longer than 100 characters it is truncated.

**Parameters:**

- `color`: Facebook color value label, up to 100 characters

---

### setCondition

**Signature:** `setCondition(condition : String) : void`

**Description:** Sets the condition of the Facebook product. Possible values are CONDITION_NEW, CONDITION_REFURBISHED, or CONDITION_USED.

**Parameters:**

- `condition`: the condition status to set for this product

---

### setCustomLabel0

**Signature:** `setCustomLabel0(customLabel0 : String) : void`

**Description:** Sets the Facebook custom label 0 value of the product.

**Parameters:**

- `customLabel0`: custom label 0 value

---

### setCustomLabel1

**Signature:** `setCustomLabel1(customLabel1 : String) : void`

**Description:** Sets the Facebook custom label 1 value of the product.

**Parameters:**

- `customLabel1`: custom label 1 value

---

### setCustomLabel2

**Signature:** `setCustomLabel2(customLabel2 : String) : void`

**Description:** Sets the Facebook custom label 2 value of the product.

**Parameters:**

- `customLabel2`: custom label 2 value

---

### setCustomLabel3

**Signature:** `setCustomLabel3(customLabel3 : String) : void`

**Description:** Sets the Facebook custom label 3 value of the product.

**Parameters:**

- `customLabel3`: custom label 3 value

---

### setCustomLabel4

**Signature:** `setCustomLabel4(customLabel4 : String) : void`

**Description:** Sets the Facebook custom label 4 value of the product.

**Parameters:**

- `customLabel4`: custom label 4 value

---

### setDescription

**Signature:** `setDescription(description : String) : void`

**Description:** Sets the description of the Facebook product. If the value is longer than 5000 characters it is truncated.

**Parameters:**

- `description`: product description, up to 5000 characters

---

### setExpirationDate

**Signature:** `setExpirationDate(expirationDate : Date) : void`

**Description:** Sets the Facebook expiration date of the product.

**Parameters:**

- `expirationDate`: Facebook expiration date

---

### setGender

**Signature:** `setGender(gender : String) : void`

**Description:** Sets the gender for the Facebook product. Possible values are GENDER_MALE, GENDER_FEMALE, GENDER_UNISEX, or null.

**Parameters:**

- `gender`: the gender to set for this product

---

### setGoogleProductCategory

**Signature:** `setGoogleProductCategory(googleProductCategory : String) : void`

**Description:** Sets the category of this product in the Google category taxonomy.

**Parameters:**

- `googleProductCategory`: Google product category

---

### setGtin

**Signature:** `setGtin(gtin : String) : void`

**Description:** Sets the Facebook GTIN of the product. If the value is longer than 70 characters it is truncated.

**Parameters:**

- `gtin`: Facebook GTIN, up to 70 characters

---

### setImageLinks

**Signature:** `setImageLinks(imageLinks : List) : void`

**Description:** Sets the list of URLs of images to show in Facebook for the product.

**Parameters:**

- `imageLinks`: links to the product images

---

### setItemGroupID

**Signature:** `setItemGroupID(itemGroupID : String) : void`

**Description:** Sets the ID of the Facebook item group for the product, that is, its master product.

**Parameters:**

- `itemGroupID`: ID of Facebook item group

---

### setLink

**Signature:** `setLink(link : URL) : void`

**Description:** Sets the URL of the Demandware storefront link to the product.

**Parameters:**

- `link`: Demandware storefront link to the product

---

### setMaterial

**Signature:** `setMaterial(material : String) : void`

**Description:** Sets the Facebook material value label of the product. If the value is longer than 200 characters it is truncated.

**Parameters:**

- `material`: Facebook material value label, up to 200 characters

---

### setMpn

**Signature:** `setMpn(mpn : String) : void`

**Description:** Sets the Facebook MPN of the product. If the value is longer than 70 characters it is truncated.

**Parameters:**

- `mpn`: Facebook MPN, up to 70 characters

---

### setPattern

**Signature:** `setPattern(pattern : String) : void`

**Description:** Sets the Facebook pattern value label of the product. If the value is longer than 100 characters it is truncated.

**Parameters:**

- `pattern`: Facebook pattern value label, up to 100 characters

---

### setPrice

**Signature:** `setPrice(price : Money) : void`

**Description:** Sets the price to show in Facebook for the product.

**Parameters:**

- `price`: Facebook price

---

### setProductType

**Signature:** `setProductType(productType : String) : void`

**Description:** Sets the Facebook product type. If the value is longer than 750 characters it is truncated.

**Parameters:**

- `productType`: Facebook product type, up to 750 characters

---

### setSalePrice

**Signature:** `setSalePrice(salePrice : Money) : void`

**Description:** Sets the sale price to show in Facebook for the product.

**Parameters:**

- `salePrice`: Facebook sale price

---

### setSalePriceEffectiveDateEnd

**Signature:** `setSalePriceEffectiveDateEnd(salePriceEffectiveDateEnd : Date) : void`

**Description:** Sets the end date of the Facebook sale price of the product.

**Parameters:**

- `salePriceEffectiveDateEnd`: end date of Facebook sale price

---

### setSalePriceEffectiveDateStart

**Signature:** `setSalePriceEffectiveDateStart(salePriceEffectiveDateStart : Date) : void`

**Description:** Sets the start date of the Facebook sale price of the product.

**Parameters:**

- `salePriceEffectiveDateStart`: start date of Facebook sale price

---

### setShippingHeight

**Signature:** `setShippingHeight(shippingHeight : Number) : void`

**Description:** Sets the shipping height of the product. If the value is negative it is truncated to 0.

**Parameters:**

- `shippingHeight`: shipping height, may not be negative

**See Also:**

setShippingLength(Number)
setShippingWidth(Number)
setShippingSizeUnit(String)

---

### setShippingLength

**Signature:** `setShippingLength(shippingLength : Number) : void`

**Description:** Sets the shipping length of the product. If the value is negative it is truncated to 0.

**Parameters:**

- `shippingLength`: shipping length, may not be negative

**See Also:**

setShippingWidth(Number)
setShippingHeight(Number)
setShippingSizeUnit(String)

---

### setShippingSizeUnit

**Signature:** `setShippingSizeUnit(shippingSizeUnit : String) : void`

**Description:** Sets the shipping size unit of the product.

**Parameters:**

- `shippingSizeUnit`: shipping size unit

**See Also:**

setShippingLength(Number)
setShippingWidth(Number)
setShippingHeight(Number)

---

### setShippingWeight

**Signature:** `setShippingWeight(shippingWeight : Quantity) : void`

**Description:** Sets the shipping weight for the product. Possible unit values are SHIPPING_WEIGHT_UNIT_LB, SHIPPING_WEIGHT_UNIT_OZ, SHIPPING_WEIGHT_UNIT_G, or SHIPPING_WEIGHT_UNIT_KG.

**Parameters:**

- `shippingWeight`: product shipping weight

---

### setShippingWidth

**Signature:** `setShippingWidth(shippingWidth : Number) : void`

**Description:** Sets the shipping width of the product. If the value is negative it is truncated to 0.

**Parameters:**

- `shippingWidth`: shipping width, may not be negative

**See Also:**

setShippingLength(Number)
setShippingHeight(Number)
setShippingSizeUnit(String)

---

### setSize

**Signature:** `setSize(size : String) : void`

**Description:** Sets the Facebook size value label of the product. If the value is longer than 100 characters it is truncated.

**Parameters:**

- `size`: Facebook size value label, up to 100 characters

---

### setTitle

**Signature:** `setTitle(title : String) : void`

**Description:** Sets the title of the Facebook product. If the value is longer than 100 characters it is truncated.

**Parameters:**

- `title`: product title, up to 100 characters

---