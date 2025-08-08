## Package: dw.catalog

# Class VariationGroup

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Product
      - dw.catalog.VariationGroup

## Description

Class representing a group of variants within a master product who share a common value for one or more variation attribute values. Variation groups are used to simplify merchandising of products. From a more technical perspective, variation groups are defined by two things: A relation to a master product. A set of variation attributes which have fixed values. A variant of the related master product is considered in the group if and only if it matches on the fixed variation attribute values. Similar to a Variant, a VariationGroup does a fallback to the master product for all attributes (name, description, etc) and relations (recommendations, etc).

## Properties

### allProductLinks

**Type:** Collection (Read Only)

All product links of the product variation group. 

 If the variation group does not define any product links, but the master product
 does, the product links of the master are returned.

### brand

**Type:** String (Read Only)

The brand of the product variation group. 

 If the variation group does not define an own value for 'brand', the value of
 the master product is returned.

### classificationCategory

**Type:** Category (Read Only)

The classification category of the product variation group. 

 Please note that the classification category is always inherited
 from the master and cannot be overridden by the variation group.

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes of the variation group. 

 Custom attributes are inherited from the master product and can
 be overridden by the variation group.

### EAN

**Type:** String (Read Only)

The EAN of the product variation group. 

 If the variation group does not define an own value for 'EAN', the value of
 the master product is returned.

### image

**Type:** MediaFile (Read Only)

The image of the product variation group. 

 If the variation group does not define an own value for 'image', the value of
 the master product is returned.

### longDescription

**Type:** MarkupText (Read Only)

The long description of the product variation group. 

 If the variation group does not define an own value for 'longDescription', the value of
 the master product is returned.

### manufacturerName

**Type:** String (Read Only)

The manufacturer name of the product variation group. 

 If the variation group does not define an own value for 'manufacturerName', the value of
 the master product is returned.

### manufacturerSKU

**Type:** String (Read Only)

The manufacturer sku of the product variation group. 

 If the variation group does not define an own value for 'manufacturerSKU', the value of
 the master product is returned.

### masterProduct

**Type:** Product (Read Only)

The ProductMaster for this mastered product.

### name

**Type:** String (Read Only)

The name of the product variation group. 

 If the variation group does not define an own value for 'name', the value of
 the master product is returned.

### onlineFrom

**Type:** Date (Read Only)

The onlineFrom date of the product variation group. 

 If the variation group does not define an own value for 'onlineFrom', the value of
 the master product is returned.

### onlineTo

**Type:** Date (Read Only)

The onlineTo date of the product variation group. 

 If the variation group does not define an own value for 'onlineTo', the value of
 the master product is returned.

### optionProduct

**Type:** boolean (Read Only)

Returns 'true' if the variation group has any options, otherwise 'false'.
 Method also returns 'true' if the variation group has not any options,
 but the related master product has options.

### pageDescription

**Type:** String (Read Only)

The pageDescription of the product variation group. 

 If the variation group does not define an own value for 'pageDescription', the value of
 the master product is returned.

### pageKeywords

**Type:** String (Read Only)

The pageKeywords of the product variation group. 

 If the variation group does not define an own value for 'pageKeywords', the value of
 the master product is returned.

### pageTitle

**Type:** String (Read Only)

The pageTitle of the product variation group. 

 If the variation group does not define an own value for 'pageTitle', the value of
 the master product is returned.

### pageURL

**Type:** String (Read Only)

The pageURL of the product variation group. 

 If the variation group does not define an own value for 'pageURL', the value of
 the master product is returned.

### productLinks

**Type:** Collection (Read Only)

All product links of the product variation group for which the target
 product is assigned to the current site catalog. 

 If the variation group does not define any product links, but the master product
 does, the product links of the master are returned.

### shortDescription

**Type:** MarkupText (Read Only)

The short description of the product variation group. 

 If the variation group does not define an own value for 'shortDescription', the value of
 the master product is returned.

### taxClassID

**Type:** String (Read Only)

The tax class id of the product variation group. 

 If the variation group does not define an own value for 'taxClassID', the value of
 the master product is returned.

### template

**Type:** String (Read Only)

The rendering template name of the product variation group. 

 If the variation group does not define an own value for 'template', the value of
 the master product is returned.

### thumbnail

**Type:** MediaFile (Read Only)

The thumbnail image of the product variation group. 

 If the variation group does not define an own value for 'thumbnailImage', the value of
 the master product is returned.

### unit

**Type:** String (Read Only)

The sales unit of the product variation group as defined by the
 master product. 

 If the variation group does not define an own value for 'unit', the value of
 the master product is returned.

### unitQuantity

**Type:** Quantity (Read Only)

The unitQuantity of the product variation group as defined by the
 master product. 

 If the variation group does not define an own value for 'unitQuantity', the value of
 the master product is returned.

### UPC

**Type:** String (Read Only)

The UPC of the product variation group. 

 If the variation group does not define an own value for 'UPC', the value of
 the master product is returned.

## Constructor Summary

## Method Summary

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

Returns all product links of the product variation group.

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

Returns all product links of the specified type of the product variation group.

### getBrand

**Signature:** `getBrand() : String`

Returns the brand of the product variation group.

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

Returns the classification category of the product variation group.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes of the variation group.

### getEAN

**Signature:** `getEAN() : String`

Returns the EAN of the product variation group.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the image of the product variation group.

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

Returns the long description of the product variation group.

### getManufacturerName

**Signature:** `getManufacturerName() : String`

Returns the manufacturer name of the product variation group.

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

Returns the manufacturer sku of the product variation group.

### getMasterProduct

**Signature:** `getMasterProduct() : Product`

Returns the ProductMaster for this mastered product.

### getName

**Signature:** `getName() : String`

Returns the name of the product variation group.

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the onlineFrom date of the product variation group.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the onlineTo date of the product variation group.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns the pageDescription of the product variation group.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the pageKeywords of the product variation group.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the pageTitle of the product variation group.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the pageURL of the product variation group.

### getProductLinks

**Signature:** `getProductLinks() : Collection`

Returns all product links of the product variation group for which the target product is assigned to the current site catalog.

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

Returns all product links of the specified type of the product variation group for which the target product is assigned to the current site catalog.

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

Retrieve the sorted collection of recommendations of the specified type for this product variation group.

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

Returns the short description of the product variation group.

### getTaxClassID

**Signature:** `getTaxClassID() : String`

Returns the tax class id of the product variation group.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the rendering template name of the product variation group.

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

Returns the thumbnail image of the product variation group.

### getUnit

**Signature:** `getUnit() : String`

Returns the sales unit of the product variation group as defined by the master product.

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

Returns the unitQuantity of the product variation group as defined by the master product.

### getUPC

**Signature:** `getUPC() : String`

Returns the UPC of the product variation group.

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

Returns 'true' if the variation group has any options, otherwise 'false'.

## Method Detail

## Method Details

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

**Description:** Returns all product links of the product variation group. If the variation group does not define any product links, but the master product does, the product links of the master are returned.

**Returns:**

All product links of the variation group or master

---

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

**Description:** Returns all product links of the specified type of the product variation group. If the variation group does not define any product links, but the master product does, the product links of the master are returned.

**Parameters:**

- `type`: Type of the product link

**Returns:**

Product links of specified type of the variation group or master

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the brand of the product variation group. If the variation group does not define an own value for 'brand', the value of the master product is returned.

**Returns:**

The brand of the variation group or master

---

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

**Description:** Returns the classification category of the product variation group. Please note that the classification category is always inherited from the master and cannot be overridden by the variation group.

**Returns:**

The classification category as defined for the master product of the variation group

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes of the variation group. Custom attributes are inherited from the master product and can be overridden by the variation group.

**Returns:**

the custom attributes of the variation group.

---

### getEAN

**Signature:** `getEAN() : String`

**Description:** Returns the EAN of the product variation group. If the variation group does not define an own value for 'EAN', the value of the master product is returned.

**Returns:**

The EAN of the variation group or master

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the image of the product variation group. If the variation group does not define an own value for 'image', the value of the master product is returned.

**Returns:**

The image of the variation group or master

---

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

**Description:** Returns the long description of the product variation group. If the variation group does not define an own value for 'longDescription', the value of the master product is returned.

**Returns:**

The long description name of the variation group or master

---

### getManufacturerName

**Signature:** `getManufacturerName() : String`

**Description:** Returns the manufacturer name of the product variation group. If the variation group does not define an own value for 'manufacturerName', the value of the master product is returned.

**Returns:**

The manufacturer name of the variation group or master

---

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

**Description:** Returns the manufacturer sku of the product variation group. If the variation group does not define an own value for 'manufacturerSKU', the value of the master product is returned.

**Returns:**

The manufacturer sku of the variation group or master

---

### getMasterProduct

**Signature:** `getMasterProduct() : Product`

**Description:** Returns the ProductMaster for this mastered product.

**Returns:**

the ProductMaster of this mastered product

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the product variation group. If the variation group does not define an own value for 'name', the value of the master product is returned.

**Returns:**

The name of the variation group or master

---

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the onlineFrom date of the product variation group. If the variation group does not define an own value for 'onlineFrom', the value of the master product is returned.

**Returns:**

The onlineFrom date of the variation group or master

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the onlineTo date of the product variation group. If the variation group does not define an own value for 'onlineTo', the value of the master product is returned.

**Returns:**

The onlineTo date of the variation group or master

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns the pageDescription of the product variation group. If the variation group does not define an own value for 'pageDescription', the value of the master product is returned.

**Returns:**

The pageDescription of the variation group or master

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the pageKeywords of the product variation group. If the variation group does not define an own value for 'pageKeywords', the value of the master product is returned.

**Returns:**

The pageKeywords of the variation group or master

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the pageTitle of the product variation group. If the variation group does not define an own value for 'pageTitle', the value of the master product is returned.

**Returns:**

The pageTitle of the variation group or master

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the pageURL of the product variation group. If the variation group does not define an own value for 'pageURL', the value of the master product is returned.

**Returns:**

The pageURL of the variation group or master

---

### getProductLinks

**Signature:** `getProductLinks() : Collection`

**Description:** Returns all product links of the product variation group for which the target product is assigned to the current site catalog. If the variation group does not define any product links, but the master product does, the product links of the master are returned.

**Returns:**

Product links of the variation group or master

---

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

**Description:** Returns all product links of the specified type of the product variation group for which the target product is assigned to the current site catalog. If the variation group does not define any product links of the specified type, but the master product does, the product links of the master are returned.

**Parameters:**

- `type`: Type of the product link

**Returns:**

Product links of specified type of the variation group or master

---

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

**Description:** Retrieve the sorted collection of recommendations of the specified type for this product variation group. The types (cross-sell, up-sell, etc) are enumerated in the dw.catalog.Recommendation class. Only recommendations which are stored in the current site catalog are returned. Furthermore, a recommendation is only returned if the target of the recommendation is assigned to the current site catalog. If the variation group does not define any recommendations, but the master product does, the recommendations of the master are returned.

**Parameters:**

- `type`: the recommendation type

**Returns:**

the sorted collection, never null but possibly empty.

---

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

**Description:** Returns the short description of the product variation group. If the variation group does not define an own value for 'shortDescription', the value of the master product is returned.

**Returns:**

The short description name of the variation group or master

---

### getTaxClassID

**Signature:** `getTaxClassID() : String`

**Description:** Returns the tax class id of the product variation group. If the variation group does not define an own value for 'taxClassID', the value of the master product is returned.

**Returns:**

The tax class id of the variation group or master

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the rendering template name of the product variation group. If the variation group does not define an own value for 'template', the value of the master product is returned.

**Returns:**

The rendering template name of the variation group or master

---

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

**Description:** Returns the thumbnail image of the product variation group. If the variation group does not define an own value for 'thumbnailImage', the value of the master product is returned.

**Returns:**

The thumbnail image of the variation group or master

---

### getUnit

**Signature:** `getUnit() : String`

**Description:** Returns the sales unit of the product variation group as defined by the master product. If the variation group does not define an own value for 'unit', the value of the master product is returned.

**Returns:**

The sales unit of the variation group or master

---

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

**Description:** Returns the unitQuantity of the product variation group as defined by the master product. If the variation group does not define an own value for 'unitQuantity', the value of the master product is returned.

**Returns:**

The unitQuantity of the variation group or master

---

### getUPC

**Signature:** `getUPC() : String`

**Description:** Returns the UPC of the product variation group. If the variation group does not define an own value for 'UPC', the value of the master product is returned.

**Returns:**

The UPC of the variation group or master

---

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

**Description:** Returns 'true' if the variation group has any options, otherwise 'false'. Method also returns 'true' if the variation group has not any options, but the related master product has options.

**Returns:**

true if the variation group has any options, false otherwise.

---