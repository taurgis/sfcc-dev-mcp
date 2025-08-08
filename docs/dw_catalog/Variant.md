## Package: dw.catalog

# Class Variant

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Product
      - dw.catalog.Variant

## Description

Represents a variant of a product variation. If the variant does not define an own value, the value is retrieved by fallback from variation groups (sorted by their position) or the variation master.

## Properties

### allProductLinks

**Type:** Collection (Read Only)

All product links of the product variant. 

 If the variant does not define any product links, the product links are retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define any product links, the product links are
 retrieved from the master product.

### brand

**Type:** String (Read Only)

The brand of the product variant. 

 If the variant does not define an own value for 'brand', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'brand', the value of
 the master product is returned.

### classificationCategory

**Type:** Category (Read Only)

The classification category of the product variant. 

 Please note that the classification category is always inherited
 from the master and cannot be overridden by the variant.

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes of the variant. 

 Custom attributes are inherited from the master product and can
 be overridden by the variant.

### EAN

**Type:** String (Read Only)

The EAN of the product variant. 

 If the variant does not define an own value for 'EAN', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'EAN', the value of
 the master product is returned.

### image

**Type:** MediaFile (Read Only)

The image of the product variant. 

 If the variant does not define an own value for 'image', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'image', the value of
 the master product is returned.

### longDescription

**Type:** MarkupText (Read Only)

The long description of the product variant. 

 If the variant does not define an own value for 'longDescription', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'longDescription', the value of
 the master product is returned.

### manufacturerName

**Type:** String (Read Only)

The manufacturer name of the product variant. 

 If the variant does not define an own value for 'manufacturerName', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'manufacturerName', the value of
 the master product is returned.

### manufacturerSKU

**Type:** String (Read Only)

The manufacturer sku of the product variant. 

 If the variant does not define an own value for 'manufacturerSKU', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'manufacturerSKU', the value of
 the master product is returned.

### masterProduct

**Type:** Product (Read Only)

The ProductMaster for this mastered product.

### name

**Type:** String (Read Only)

The name of the product variant. 

 If the variant does not define an own value for 'name', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'name', the value of
 the master product is returned.

### onlineFrom

**Type:** Date (Read Only)

The onlineFrom date of the product variant. 

 If the variant does not define an own value for 'onlineFrom', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'onlineFrom', the value of
 the master product is returned.

### onlineTo

**Type:** Date (Read Only)

The onlineTo date of the product variant. 

 If the variant does not define an own value for 'onlineTo', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'onlineTo', the value of
 the master product is returned.

### optionProduct

**Type:** boolean (Read Only)

Returns 'true' if the variant has any options, otherwise 'false'.
 Method also returns 'true' if the variant has not any options,
 but the related variation groups (sorted by position) or
 master product has options.

### pageDescription

**Type:** String (Read Only)

The pageDescription of the product variant. 

 If the variant does not define an own value for 'pageDescription', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'pageDescription', the value of
 the master product is returned.

### pageKeywords

**Type:** String (Read Only)

The pageKeywords of the product variant. 

 If the variant does not define an own value for 'pageKeywords', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'pageKeywords', the value of
 the master product is returned.

### pageTitle

**Type:** String (Read Only)

The pageTitle of the product variant. 

 If the variant does not define an own value for 'pageTitle', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'pageTitle', the value of
 the master product is returned.

### pageURL

**Type:** String (Read Only)

The pageURL of the product variant. 

 If the variant does not define an own value for 'pageURL', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'pageURL', the value of
 the master product is returned.

### productLinks

**Type:** Collection (Read Only)

All product links of the product variant for which the target
 product is assigned to the current site catalog. 

 If the variant does not define any product links, the product links are retrieved
 from the assigned variation groups, sorted by their position

 If none of the variation groups define any product links, the product links are retrieved
 from the master product.

### shortDescription

**Type:** MarkupText (Read Only)

The short description of the product variant. 

 If the variant does not define an own value for 'shortDescription', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'shortDescription', the value of
 the master product is returned.

### taxClassID

**Type:** String (Read Only)

The tax class id of the product variant. 

 If the variant does not define an own value for 'taxClassID', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'taxClassID', the value of
 the master product is returned.

### template

**Type:** String (Read Only)

The rendering template name of the product variant. 

 If the variant does not define an own value for 'template', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'template', the value of
 the master product is returned.

### thumbnail

**Type:** MediaFile (Read Only)

The thumbnail image of the product variant. 

 If the variant does not define an own value for 'thumbnail', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'thumbnail', the value of
 the master product is returned.

### unit

**Type:** String (Read Only)

The sales unit of the product variant as defined by the
 master product. 

 If the variant does not define an own value for 'unit', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'unit', the value of
 the master product is returned.

### unitQuantity

**Type:** Quantity (Read Only)

The unitQuantity of the product variant as defined by the
 master product. 

 If the variant does not define an own value for 'unitQuantity', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'unitQuantity', the value of
 the master product is returned.

### UPC

**Type:** String (Read Only)

The UPC of the product variant. 

 If the variant does not define an own value for 'UPC', the value is retrieved
 from the assigned variation groups, sorted by their position.

 If none of the variation groups define a value for 'UPC', the value of
 the master product is returned.

## Constructor Summary

## Method Summary

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

Returns all product links of the product variant.

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

Returns all product links of the specified type of the product variant.

### getBrand

**Signature:** `getBrand() : String`

Returns the brand of the product variant.

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

Returns the classification category of the product variant.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes of the variant.

### getEAN

**Signature:** `getEAN() : String`

Returns the EAN of the product variant.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the image of the product variant.

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

Returns the long description of the product variant.

### getManufacturerName

**Signature:** `getManufacturerName() : String`

Returns the manufacturer name of the product variant.

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

Returns the manufacturer sku of the product variant.

### getMasterProduct

**Signature:** `getMasterProduct() : Product`

Returns the ProductMaster for this mastered product.

### getName

**Signature:** `getName() : String`

Returns the name of the product variant.

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the onlineFrom date of the product variant.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the onlineTo date of the product variant.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns the pageDescription of the product variant.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the pageKeywords of the product variant.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the pageTitle of the product variant.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the pageURL of the product variant.

### getProductLinks

**Signature:** `getProductLinks() : Collection`

Returns all product links of the product variant for which the target product is assigned to the current site catalog.

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

Returns all product links of the specified type of the product variant for which the target product is assigned to the current site catalog.

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

Retrieve the sorted collection of recommendations of the specified type for this product variant.

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

Returns the short description of the product variant.

### getTaxClassID

**Signature:** `getTaxClassID() : String`

Returns the tax class id of the product variant.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the rendering template name of the product variant.

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

Returns the thumbnail image of the product variant.

### getUnit

**Signature:** `getUnit() : String`

Returns the sales unit of the product variant as defined by the master product.

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

Returns the unitQuantity of the product variant as defined by the master product.

### getUPC

**Signature:** `getUPC() : String`

Returns the UPC of the product variant.

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

Returns 'true' if the variant has any options, otherwise 'false'.

## Method Detail

## Method Details

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

**Description:** Returns all product links of the product variant. If the variant does not define any product links, the product links are retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define any product links, the product links are retrieved from the master product.

**Returns:**

All product links of the variant, variation group or master

---

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

**Description:** Returns all product links of the specified type of the product variant. If the variant does not define any product links of the specified type, the product links are retrieved for the specified type from the assigned variation groups, sorted by their position. If none of the variation groups define any product links of the specified type, the product links are retrieved for the specified type from the master product.

**Parameters:**

- `type`: Type of the product link

**Returns:**

Product links of specified type of the variant, variation group or master

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the brand of the product variant. If the variant does not define an own value for 'brand', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'brand', the value of the master product is returned.

**Returns:**

The brand of the variant, variation group or master

---

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

**Description:** Returns the classification category of the product variant. Please note that the classification category is always inherited from the master and cannot be overridden by the variant.

**Returns:**

The classification category as defined for the master product of the variant

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes of the variant. Custom attributes are inherited from the master product and can be overridden by the variant.

**Returns:**

the custom attributes of the variant.

---

### getEAN

**Signature:** `getEAN() : String`

**Description:** Returns the EAN of the product variant. If the variant does not define an own value for 'EAN', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'EAN', the value of the master product is returned.

**Returns:**

The EAN of the variant, variation group or master

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the image of the product variant. If the variant does not define an own value for 'image', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'image', the value of the master product is returned.

**Returns:**

The image of the variant, variation group or master

---

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

**Description:** Returns the long description of the product variant. If the variant does not define an own value for 'longDescription', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'longDescription', the value of the master product is returned.

**Returns:**

The long description of the variant, variation group or master

---

### getManufacturerName

**Signature:** `getManufacturerName() : String`

**Description:** Returns the manufacturer name of the product variant. If the variant does not define an own value for 'manufacturerName', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'manufacturerName', the value of the master product is returned.

**Returns:**

The manufacturer name of the variant, variation group or master

---

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

**Description:** Returns the manufacturer sku of the product variant. If the variant does not define an own value for 'manufacturerSKU', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'manufacturerSKU', the value of the master product is returned.

**Returns:**

The manufacturer sku of the variant, variation group or master

---

### getMasterProduct

**Signature:** `getMasterProduct() : Product`

**Description:** Returns the ProductMaster for this mastered product.

**Returns:**

the ProductMaster of this mastered product

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the product variant. If the variant does not define an own value for 'name', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'name', the value of the master product is returned.

**Returns:**

The name of the variant, variation group or master

---

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the onlineFrom date of the product variant. If the variant does not define an own value for 'onlineFrom', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'onlineFrom', the value of the master product is returned.

**Returns:**

The onlineFrom date of the variant, variation group or master

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the onlineTo date of the product variant. If the variant does not define an own value for 'onlineTo', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'onlineTo', the value of the master product is returned.

**Returns:**

The onlineTo date of the variant, variation group or master

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns the pageDescription of the product variant. If the variant does not define an own value for 'pageDescription', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'pageDescription', the value of the master product is returned.

**Returns:**

The pageDescription of the variant, variation group or master

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the pageKeywords of the product variant. If the variant does not define an own value for 'pageKeywords', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'pageKeywords', the value of the master product is returned.

**Returns:**

The pageKeywords of the variant, variation group or master

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the pageTitle of the product variant. If the variant does not define an own value for 'pageTitle', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'pageTitle', the value of the master product is returned.

**Returns:**

The pageTitle of the variant, variation group or master

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the pageURL of the product variant. If the variant does not define an own value for 'pageURL', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'pageURL', the value of the master product is returned.

**Returns:**

The pageURL of the variant, variation group or master

---

### getProductLinks

**Signature:** `getProductLinks() : Collection`

**Description:** Returns all product links of the product variant for which the target product is assigned to the current site catalog. If the variant does not define any product links, the product links are retrieved from the assigned variation groups, sorted by their position If none of the variation groups define any product links, the product links are retrieved from the master product.

**Returns:**

Product links of the variant, variation group or master

---

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

**Description:** Returns all product links of the specified type of the product variant for which the target product is assigned to the current site catalog. If the variant does not define any product links of the specified type, the product links are retrieved for the specified type from the assigned variation groups, sorted by their position If none of the variation groups define any product links of the specified type, the product links are retrieved for the specified type from the master product.

**Parameters:**

- `type`: Type of the product link

**Returns:**

Product links of specified type of the variant, variation group or master

---

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

**Description:** Retrieve the sorted collection of recommendations of the specified type for this product variant. The types (cross-sell, up-sell, etc) are enumerated in the dw.catalog.Recommendation class. Only recommendations which are stored in the current site catalog are returned. Furthermore, a recommendation is only returned if the target of the recommendation is assigned to the current site catalog. If the variant does not define any recommendations, recommendations are retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define any recommendations, the recommendations of the master are returned.

**Parameters:**

- `type`: the recommendation type

**Returns:**

the sorted collection, never null but possibly empty.

---

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

**Description:** Returns the short description of the product variant. If the variant does not define an own value for 'shortDescription', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'shortDescription', the value of the master product is returned.

**Returns:**

The short description of the variant, variation group or master

---

### getTaxClassID

**Signature:** `getTaxClassID() : String`

**Description:** Returns the tax class id of the product variant. If the variant does not define an own value for 'taxClassID', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'taxClassID', the value of the master product is returned.

**Returns:**

The tax class id of the variant, variation group or master

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the rendering template name of the product variant. If the variant does not define an own value for 'template', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'template', the value of the master product is returned.

**Returns:**

The rendering template name of the variant, variation group or master

---

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

**Description:** Returns the thumbnail image of the product variant. If the variant does not define an own value for 'thumbnail', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'thumbnail', the value of the master product is returned.

**Returns:**

The thumbnail image of the variant, variation group or master

---

### getUnit

**Signature:** `getUnit() : String`

**Description:** Returns the sales unit of the product variant as defined by the master product. If the variant does not define an own value for 'unit', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'unit', the value of the master product is returned.

**Returns:**

The sales unit of the variant, variation group or master

---

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

**Description:** Returns the unitQuantity of the product variant as defined by the master product. If the variant does not define an own value for 'unitQuantity', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'unitQuantity', the value of the master product is returned.

**Returns:**

The unitQuantity of the variant, variation group or master

---

### getUPC

**Signature:** `getUPC() : String`

**Description:** Returns the UPC of the product variant. If the variant does not define an own value for 'UPC', the value is retrieved from the assigned variation groups, sorted by their position. If none of the variation groups define a value for 'UPC', the value of the master product is returned.

**Returns:**

The UPC of the variant, variation group or master

---

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

**Description:** Returns 'true' if the variant has any options, otherwise 'false'. Method also returns 'true' if the variant has not any options, but the related variation groups (sorted by position) or master product has options.

**Returns:**

true if the variant has any options, false otherwise.

---