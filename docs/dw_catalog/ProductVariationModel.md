## Package: dw.catalog

# Class ProductVariationModel

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductVariationModel

## Description

Class representing the complete variation information for a master product in the system. An instance of this class provides methods to access the following information: The variation attributes of the master product (e.g. size and color). Use getProductVariationAttributes(). The variation attribute values (e.g. size=Small, Medium, Large and color=Red, Blue). Use getAllValues(ProductVariationAttribute). The variation groups which may represent a subset of variants by defining a subset of the variation attribute values (e.g. color=Red, size=empty). Use getVariationGroups(). The variants themselves (e.g. the products representing Small Red, Large Red, Small Blue, Large Blue, etc). Use getVariants(). The variation attribute values of those variants. Use getVariationValue(Product, ProductVariationAttribute). This model only considers variants which are complete (i.e. the variant has a value for each variation attribute), and currently online. Incomplete or offline variants will not be returned by any method that returns Variants, and their attribute values will not be considered in any method that returns values. In addition to providing access to this meta information, ProductVariationModel maintains a collection of selected variation attribute values, representing the selections that a customer makes in the storefront. If this model was constructed for a master product, then none of the attributes will have pre-selected values. If this model was constructed for a variant product, then all the attribute values of that variant will be pre-selected. It is possible to query the current selections by calling getSelectedValue(ProductVariationAttribute) or isSelectedAttributeValue(ProductVariationAttribute, ProductVariationAttributeValue). The method setSelectedAttributeValue(String, String) can be used to modify the selected values. Depending on the product type, it's possible to select or modify variation attribute values: If this model was constructed for a master product, it's possible to select and modify all variation attributes. If this model was constructed for a variation group, it's possible to select and modify all variation attributes that are not defined by the variation group. If this model was constructed for a variation product, it's not possible to select or modify any of the variation attributes. Furthermore, the model provides helper methods to generate URLs for selecting and unselecting variation attribute values. See those methods for details. If this model was constructed for a product that is neither a master nor a variant, then none of the methods will return useful values at all. The methods in this class which access the currently selected variation attribute values can be used on product detail pages to render information about which combinations are available or unavailable. The methods getFilteredValues(ProductVariationAttribute) and hasOrderableVariants(ProductVariationAttribute, ProductVariationAttributeValue) can be used to determine this type of situation and render the appropriate message in the storefront. NOTE: Several methods in this class have a version taking a ProductVariationAttribute parameter, and another deprecated version accepting a ObjectAttributeDefinition parameter instead. The former should be strictly favored. The latter are historical leftovers from when object attributes were used directly as the basis for variation, and the value lists were stored directly on the ObjectAttributeDefinition. Every ProductVariationAttribute corresponds with exactly one ObjectAttributeDefinition, but values are now stored on the ProductVariationAttribute and not the ObjectAttributeDefinition.

## Properties

### attributeDefinitions

**Type:** Collection (Read Only)

The object attribute definitions corresponding with the product
 variation attributes of the master product.

### defaultVariant

**Type:** Variant (Read Only)

Return the default variant of this model's master product. If no default
 variant has been defined, return an arbitrary variant.

### master

**Type:** Product (Read Only)

The master of the product variation.

### productVariationAttributes

**Type:** Collection (Read Only)

A collection of product variation attributes of the variation.

### selectedVariant

**Type:** Variant (Read Only)

The variant currently selected for this variation model.
 Returns null if no variant is selected.

### selectedVariants

**Type:** Collection (Read Only)

The variants currently selected for this variation model.
 Returns an empty collection if no variant is selected.

### variants

**Type:** Collection (Read Only)

The collection of product variants of this variation model.
 This collection only includes online variants. Offline variants are
 filtered out. If all variation products are required, consider using
 Product.getVariants().

 The product variants are returned in no particular order.

### variationGroups

**Type:** Collection (Read Only)

The collection of variation groups of this variation model.
 This collection only includes online variation groups. Offline variation
 groups are filtered out. If all variation group products are required,
 consider using Product.getVariationGroups().

 The variation groups are returned in no particular order.

## Constructor Summary

## Method Summary

### getAllValues

**Signature:** `getAllValues(attribute : ObjectAttributeDefinition) : Collection`

Returns the value definitions for the specified attribute.

### getAllValues

**Signature:** `getAllValues(attribute : ProductVariationAttribute) : Collection`

Returns the values for the specified attribute.

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

Returns the object attribute definitions corresponding with the product variation attributes of the master product.

### getDefaultVariant

**Signature:** `getDefaultVariant() : Variant`

Return the default variant of this model's master product.

### getFilteredValues

**Signature:** `getFilteredValues(attribute : ObjectAttributeDefinition) : Collection`

Returns a collection of the value definitions defined for the specified attribute, filtered based on currently selected values.

### getFilteredValues

**Signature:** `getFilteredValues(attribute : ProductVariationAttribute) : Collection`

Returns a collection of the value definitions defined for the specified attribute, filtered based on currently selected values.

### getHtmlName

**Signature:** `getHtmlName(attribute : ObjectAttributeDefinition) : String`

Returns an HTML representation of the variation attribute id.

### getHtmlName

**Signature:** `getHtmlName(prefix : String, attribute : ObjectAttributeDefinition) : String`

Returns an HTML representation of the variation attribute id with the custom prefix.

### getHtmlName

**Signature:** `getHtmlName(attribute : ProductVariationAttribute) : String`

Returns an HTML representation of the product variation attribute id.

### getHtmlName

**Signature:** `getHtmlName(prefix : String, attribute : ProductVariationAttribute) : String`

Returns an HTML representation of the product variation attribute id with the custom prefix.

### getImage

**Signature:** `getImage(viewtype : String, attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : MediaFile`

The method returns the first image appropriate for the currently selected attribute values.

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

The method returns an image appropriate for the current selected variation values with the specific index.

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

The method returns the first image appropriate for the current selected variation values with the specific index.

### getImages

**Signature:** `getImages(viewtype : String) : List`

The method returns the image appropriate for the currently selected attribute values.

### getMaster

**Signature:** `getMaster() : Product`

Returns the master of the product variation.

### getProductVariationAttribute

**Signature:** `getProductVariationAttribute(id : String) : ProductVariationAttribute`

Returns the product variation attribute for the specific id, or null if there is no product variation attribute for that id.

### getProductVariationAttributes

**Signature:** `getProductVariationAttributes() : Collection`

Returns a collection of product variation attributes of the variation.

### getSelectedValue

**Signature:** `getSelectedValue(attribute : ObjectAttributeDefinition) : ObjectAttributeValueDefinition`

Returns the selected value for the specified attribute.

### getSelectedValue

**Signature:** `getSelectedValue(attribute : ProductVariationAttribute) : ProductVariationAttributeValue`

Returns the selected value for the specified product variation attribute.

### getSelectedVariant

**Signature:** `getSelectedVariant() : Variant`

Returns the variant currently selected for this variation model.

### getSelectedVariants

**Signature:** `getSelectedVariants() : Collection`

Returns the variants currently selected for this variation model.

### getVariants

**Signature:** `getVariants() : Collection`

Returns the collection of product variants of this variation model.

### getVariants

**Signature:** `getVariants(filter : HashMap) : Collection`

Returns the variants that match the specified filter conditions.

### getVariationGroups

**Signature:** `getVariationGroups() : Collection`

Returns the collection of variation groups of this variation model.

### getVariationValue

**Signature:** `getVariationValue(variantOrVariationGroup : Product, attribute : ProductVariationAttribute) : ProductVariationAttributeValue`

Returns the value for the specified variant or variation group product and variation attribute.

### hasOrderableVariants

**Signature:** `hasOrderableVariants(attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : boolean`

Returns true if any variant is available with the specified value of the specified variation attribute.

### isSelectedAttributeValue

**Signature:** `isSelectedAttributeValue(attribute : ObjectAttributeDefinition, value : ObjectAttributeValueDefinition) : boolean`

Identifies if the specified variation value is the one currently selected.

### isSelectedAttributeValue

**Signature:** `isSelectedAttributeValue(attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : boolean`

Identifies if the specified product variation attribute value is the one currently selected.

### setSelectedAttributeValue

**Signature:** `setSelectedAttributeValue(variationAttributeID : String, variationAttributeValueID : String) : void`

Applies a selected attribute value to this model instance.

### url

**Signature:** `url(action : String, varAttrAndValues : Object...) : URL`

Constructs a URL to select a set of variation attribute values.

### urlSelectVariationValue

**Signature:** `urlSelectVariationValue(action : String, attribute : ObjectAttributeDefinition, value : ObjectAttributeValueDefinition) : String`

Constructs an URL to select the specified value of the specified variation attribute.

### urlSelectVariationValue

**Signature:** `urlSelectVariationValue(action : String, attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : String`

Generates a URL for selecting a value for a given variation attribute.

### urlUnselectVariationValue

**Signature:** `urlUnselectVariationValue(action : String, attribute : ObjectAttributeDefinition) : String`

Constructs an URL to unselect the value of the specified variation attribute.

### urlUnselectVariationValue

**Signature:** `urlUnselectVariationValue(action : String, attribute : ProductVariationAttribute) : String`

Generates a URL for unselecting a value for a given variation attribute.

## Method Detail

## Method Details

### getAllValues

**Signature:** `getAllValues(attribute : ObjectAttributeDefinition) : Collection`

**Description:** Returns the value definitions for the specified attribute. Only values that actually exist for at least one of the master product's currently online and complete variants are returned. Returns an empty collection if the passed attribute is not even a variation attribute of the master product.

**Deprecated:**

This method is deprecated since custom code should work with ProductVariationAttributes and not directly with their corresponding ObjectAttributeDefinitions. Use getAllValues(ProductVariationAttribute) to get the collection of ProductVariationAttributeValue instances instead.

**Parameters:**

- `attribute`: the attribute whose values will be returned.

**Returns:**

the sorted collection of ObjectAttributeValueDefinition instances representing the value definitions defined for the specified attribute. The collection is sorted by the explicit sort order defined for the values.

---

### getAllValues

**Signature:** `getAllValues(attribute : ProductVariationAttribute) : Collection`

**Description:** Returns the values for the specified attribute. Only values that actually exist for at least one of the master product's currently online and complete variants are returned. Returns an empty collection if the passed attribute is not even a variation attribute of the master product.

**Parameters:**

- `attribute`: the variation attribute whose values will be returned.

**Returns:**

the sorted collection of ProductVariationAttributeValue instances representing the values defined for the specified attribute. The collection is sorted by the explicit sort order defined for the values.

---

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

**Description:** Returns the object attribute definitions corresponding with the product variation attributes of the master product.

**Deprecated:**

This method is deprecated since custom code should work with ProductVariationAttributes and not directly with their corresponding ObjectAttributeDefinitions. Use getProductVariationAttributes() to get the product variation attributes.

**Returns:**

the collection of ObjectAttributeDefinition instances corresponding with the variation attributes of the master product, sorted by explicit position.

---

### getDefaultVariant

**Signature:** `getDefaultVariant() : Variant`

**Description:** Return the default variant of this model's master product. If no default variant has been defined, return an arbitrary variant.

**Returns:**

the default value of this model's master product, an arbitrary variant if no default is defined, or null if this model does not represent a master product with variants.

---

### getFilteredValues

**Signature:** `getFilteredValues(attribute : ObjectAttributeDefinition) : Collection`

**Description:** Returns a collection of the value definitions defined for the specified attribute, filtered based on currently selected values. A value is only returned if it at least one variant has the value and also possesses the selected values for all previous attributes. It is important to know that the filter is applied in a certain order. The method looks at all ObjectAttributeDefinition instances that appear before the passed one in the sorted collection returned by getAttributeDefinitions(). If the passed attribute is the first in this collection, then this method simply returns all its values. If an earlier attribute does not have a selected value, this method returns an empty list. Otherwise, the filter looks at all variants matching the selected value for all previous attributes, and considers the range of values possessed by these variants for the passed attribute. The idea behind this method is that customers in the storefront select variation attribute values one by one in the order the variation attributes are defined and displayed. After each selection, customer only wants to see values that he can possibly order for the remaining attributes. Returns an empty collection if the passed attribute is not even a variation attribute of the master product.

**Deprecated:**

Use getFilteredValues(ProductVariationAttribute) to get the sorted and calculated collection of product variation attribute values.

**Parameters:**

- `attribute`: the attribute whose values are returned by this method.

**Returns:**

a sorted collection of ObjectAttributeDefinitionValue instances calculated based on the currently selected variation values.

---

### getFilteredValues

**Signature:** `getFilteredValues(attribute : ProductVariationAttribute) : Collection`

**Description:** Returns a collection of the value definitions defined for the specified attribute, filtered based on currently selected values. A value is only returned if it at least one variant has the value and also possesses the selected values for all previous attributes. It is important to know that the filter is applied in a certain order. The method looks at all ProductVariationAttribute instances that appear before the passed one in the sorted collection returned by getProductVariationAttributes(). If the passed attribute is the first in this collection, then this method simply returns all its values. If an earlier attribute does not have a selected value, this method returns an empty list. Otherwise, the filter looks at all variants matching the selected value for all previous attributes, and considers the range of values possessed by these variants for the passed attribute. The idea behind this method is that customers in the storefront select variation attribute values one by one in the order the variation attributes are defined and displayed. After each selection, customer only wants to see values that he can possibly order for the remaining attributes. Returns an empty collection if the passed attribute is not even a variation attribute of the master product.

**Parameters:**

- `attribute`: the product variation attribute whose values are to be returned.

**Returns:**

a sorted and filtered collection of product variation attribute values. The collection is sorted by the explicit sort order defined for the values.

---

### getHtmlName

**Signature:** `getHtmlName(attribute : ObjectAttributeDefinition) : String`

**Description:** Returns an HTML representation of the variation attribute id. This method is deprecated. You should use getHtmlName(ProductVariationAttribute) instead.

**Deprecated:**

Use getHtmlName(ProductVariationAttribute) to get the HTML representation of the product variation attribute id.

**Parameters:**

- `attribute`: the attribute whose ID is returned.

**Returns:**

an HTML representation of the attribute id.

---

### getHtmlName

**Signature:** `getHtmlName(prefix : String, attribute : ObjectAttributeDefinition) : String`

**Description:** Returns an HTML representation of the variation attribute id with the custom prefix. This method is deprecated. You should use getHtmlName(String, ProductVariationAttribute) instead.

**Deprecated:**

Use getHtmlName(String, ProductVariationAttribute) to get the HTML representation of the product variation attribute id with the custom prefix.

**Parameters:**

- `prefix`: a custom prefix.
- `attribute`: the attribute whose ID is returned.

**Returns:**

an HTML representation of the attribute id.

---

### getHtmlName

**Signature:** `getHtmlName(attribute : ProductVariationAttribute) : String`

**Description:** Returns an HTML representation of the product variation attribute id.

**Parameters:**

- `attribute`: the product variation attribute whose ID is returned.

**Returns:**

an HTML representation of the product variation attribute id.

---

### getHtmlName

**Signature:** `getHtmlName(prefix : String, attribute : ProductVariationAttribute) : String`

**Description:** Returns an HTML representation of the product variation attribute id with the custom prefix.

**Parameters:**

- `prefix`: a custom prefix.
- `attribute`: the product variation attribute whose ID is returned.

**Returns:**

an HTML representation of the product variation attribute id.

---

### getImage

**Signature:** `getImage(viewtype : String, attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : MediaFile`

**Description:** The method returns the first image appropriate for the currently selected attribute values. The method first considers the most specific combination of attribute values (e.g "Red leather") and if that is not found, more general (e.g "Red"). If no image group is found for the attributes, returns null The view type parameter is required, otherwise a exception is thrown.

**Parameters:**

- `viewtype`: the view type annotated to image
- `attribute`: the variation attribute
- `value`: the the variation attribute value

**Returns:**

the first image, or null if not found

---

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

**Description:** The method returns an image appropriate for the current selected variation values with the specific index. If images are defined for this view type and variants, but not for specified index, the method returns null. If no images are defined for all variants and specified view type, the image at the specified index of the master product images is returned. If no master product image for specified index is defined, the method returns null. The view type parameter is required, otherwise a exception is thrown.

**Parameters:**

- `viewtype`: the view type annotated to image
- `index`: the index number of the image within image list

**Returns:**

the MediaFile or null

---

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

**Description:** The method returns the first image appropriate for the current selected variation values with the specific index. If images are defined for this view type and variants, but not for specified index, the method returns null. If no images are defined for all variants and specified view type, the image at the specified index of the master product images is returned. If no master product image for specified index is defined, the method returns null. The view type parameter is required, otherwise a exception is thrown.

**Parameters:**

- `viewtype`: the view type annotated to image

**Returns:**

the MediaFile or null

---

### getImages

**Signature:** `getImages(viewtype : String) : List`

**Description:** The method returns the image appropriate for the currently selected attribute values. The method first considers the most specific combination of attribute values (e.g "Red leather") and if that is not found, more general (e.g "Red"). If no image group is found for the attributes, returns null The view type parameter is required, otherwise a exception is thrown.

**Parameters:**

- `viewtype`: the view type annotated to image

**Returns:**

an array of images

---

### getMaster

**Signature:** `getMaster() : Product`

**Description:** Returns the master of the product variation.

**Returns:**

the master of the product variation.

---

### getProductVariationAttribute

**Signature:** `getProductVariationAttribute(id : String) : ProductVariationAttribute`

**Description:** Returns the product variation attribute for the specific id, or null if there is no product variation attribute for that id.

**Parameters:**

- `id`: the id of the product variation attribute

**Returns:**

the product variation attribute, or null.

---

### getProductVariationAttributes

**Signature:** `getProductVariationAttributes() : Collection`

**Description:** Returns a collection of product variation attributes of the variation.

**Returns:**

a collection of product variation attributes of the variation.

---

### getSelectedValue

**Signature:** `getSelectedValue(attribute : ObjectAttributeDefinition) : ObjectAttributeValueDefinition`

**Description:** Returns the selected value for the specified attribute. If no value is selected, null is returned.

**Deprecated:**

Use getSelectedValue(ProductVariationAttribute) to get the selected product variation attribute value for the specified attribute.

**Parameters:**

- `attribute`: the attribute whose value will be returned.

**Returns:**

the selected value for the specified attribute or null.

---

### getSelectedValue

**Signature:** `getSelectedValue(attribute : ProductVariationAttribute) : ProductVariationAttributeValue`

**Description:** Returns the selected value for the specified product variation attribute. If no value is selected, null is returned.

**Parameters:**

- `attribute`: the product variation attribute whose value will be returned.

**Returns:**

the selected product variation attribute value for the specified attribute or null.

---

### getSelectedVariant

**Signature:** `getSelectedVariant() : Variant`

**Description:** Returns the variant currently selected for this variation model. Returns null if no variant is selected.

**Returns:**

selected variant or null.

---

### getSelectedVariants

**Signature:** `getSelectedVariants() : Collection`

**Description:** Returns the variants currently selected for this variation model. Returns an empty collection if no variant is selected.

**Returns:**

selected variants, might be empty if no valid variant was selected by the given attribute values

---

### getVariants

**Signature:** `getVariants() : Collection`

**Description:** Returns the collection of product variants of this variation model. This collection only includes online variants. Offline variants are filtered out. If all variation products are required, consider using Product.getVariants(). The product variants are returned in no particular order.

**Returns:**

a collection of all the product variants of the variation model.

---

### getVariants

**Signature:** `getVariants(filter : HashMap) : Collection`

**Description:** Returns the variants that match the specified filter conditions. The filter conditions are specified as a hash map of <attribute_id> - <value_id>. This method does not consider the currently selected attribute values.

**Parameters:**

- `filter`: the filters to apply when collecting the variants.

**Returns:**

the collection of variants that match the specified filter conditions.

---

### getVariationGroups

**Signature:** `getVariationGroups() : Collection`

**Description:** Returns the collection of variation groups of this variation model. This collection only includes online variation groups. Offline variation groups are filtered out. If all variation group products are required, consider using Product.getVariationGroups(). The variation groups are returned in no particular order.

**Returns:**

a collection of all the variation groups of the variation model.

---

### getVariationValue

**Signature:** `getVariationValue(variantOrVariationGroup : Product, attribute : ProductVariationAttribute) : ProductVariationAttributeValue`

**Description:** Returns the value for the specified variant or variation group product and variation attribute. The specified product should be a Variant returned by getVariants() or a VariationGroup returned by getVariationGroups(). The variation attribute should be one returned by getProductVariationAttributes(). If an invalid product or attribute is passed, null is returned. If null is passed for either argument, an exception is thrown.

**Parameters:**

- `variantOrVariationGroup`: the variant or variation group product to retrieve a value for, must not be null.
- `attribute`: the product variation attribute to get the value for, must not be null.

**Returns:**

the attribute value for the specified variant or variation group and attribute, or null if an invalid variant, variation group or attribute is passed or the variation group define no value for the variation attribute.

---

### hasOrderableVariants

**Signature:** `hasOrderableVariants(attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : boolean`

**Description:** Returns true if any variant is available with the specified value of the specified variation attribute. Available means that the variant is orderable according to the variant's availability model. This method takes currently selected attribute values into consideration. The specific rules are as follows: If no variation value is currently selected, the method returns true if any variant with the specified value is available, else false. if one or more variation values are selected, the method returns true if any variant with a combination of the specified value and the selected value is available, else false. if all variation values are selected, the method returns true of the variant that is represented by the current selection is available, else false.

**Parameters:**

- `attribute`: The product variation attribute whose values are to be tested for orderable variants.
- `value`: The specific attribute value to test for orderable variants.

**Returns:**

true if any variant is available with the specified value of the specified variation attribute based on the currently selected attribute values, false otherwise.

---

### isSelectedAttributeValue

**Signature:** `isSelectedAttributeValue(attribute : ObjectAttributeDefinition, value : ObjectAttributeValueDefinition) : boolean`

**Description:** Identifies if the specified variation value is the one currently selected.

**Deprecated:**

Use isSelectedAttributeValue(ProductVariationAttribute, ProductVariationAttributeValue) to identify if the specified product variation attribute value is the one currently selected.

**Parameters:**

- `attribute`: the attribute to check.
- `value`: the value to check for selection.

**Returns:**

true if the specified variation value is currently selected, false otherwise.

---

### isSelectedAttributeValue

**Signature:** `isSelectedAttributeValue(attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : boolean`

**Description:** Identifies if the specified product variation attribute value is the one currently selected.

**Parameters:**

- `attribute`: the attribute to check.
- `value`: the value to check for selection.

**Returns:**

true if the specified variation attribute value is currently selected, false otherwise.

---

### setSelectedAttributeValue

**Signature:** `setSelectedAttributeValue(variationAttributeID : String, variationAttributeValueID : String) : void`

**Description:** Applies a selected attribute value to this model instance. Usually this method is used to set the model state corresponding to the variation attribute values specified by a URL. The URLs can be obtained by using one of the models URL methods, like urlSelectVariationValue(String, ProductVariationAttribute, ProductVariationAttributeValue) and urlUnselectVariationValue(String, ProductVariationAttribute). Anyway, there are some limitations to keep in mind when selecting variation attribute values. A Variation Model created for a Variation Group or Variant Product is bound to an initial state. Example: A Variation Model created for Variation Group A can't be switched to Variation Group B. A Variation Model created for Variant A can't be switched to Variant B. The state of a Variation Model for a Variation Group that defines color = red can't be changed to color = black. The state of a Variation Model for a Variant that defines color = red / size = L can't be changed to color = black / size = S. However, the state of a Variation Model created for a Variation Group that defines color = red can be changed to a more specific state by adding another selected value, e.g. size = L. The state of a Variation Model created for a Variation Master can be changed in any possible way because the initial state involves all variation values and Variants.

**Parameters:**

- `variationAttributeID`: the ID of an product variation attribute, must not be null, otherwise a exception is thrown
- `variationAttributeValueID`: the ID of the product variation attribute value to apply, this value must not be part of the initial model state (e.g. the variant or group that the model has been created for), otherwise a exception is thrown

---

### url

**Signature:** `url(action : String, varAttrAndValues : Object...) : URL`

**Description:** Constructs a URL to select a set of variation attribute values. The optional varAttrAndValues argument can be empty, or can contain one or more variation attribute / value pairs. This variable list should be even in length, with attributes and values alternating. Attributes can be specified as instances of ProductVariationAttribute, or String variation attribute ID. (Note: ObjectAttributeDefinition IDs are not supported.) Values can be specified as instances of ProductVariationAttributeValue or String or Integer depending on the data type of the variation attribute. If a parameter type is invalid, or does not reference a valid ProductVariationAttribute or ProductVariationAttributeValue, then the parameter pair is not included in the generated URL. The returned URL will contain variation attributes and values already selected in the product variation model, as well as attributes and values specified as method parameters. Sample usage: master.variationModel.url("Product-Show", "color", "red", "size", "XL"); master.variationModel.url("Product-Show", colorVarAttr, colorValue, sizeVarAttr, sizeValue); // --> on/demandware.store/Sites-SiteGenesis-Site/default/Product-Show?pid=master_id&dwvar_color=red&dwvar_size=XL

**Parameters:**

- `action`: The pipeline action.
- `varAttrAndValues`: Variable length list of attributes and corresponding values to select.

**Returns:**

The constructed URL.

---

### urlSelectVariationValue

**Signature:** `urlSelectVariationValue(action : String, attribute : ObjectAttributeDefinition, value : ObjectAttributeValueDefinition) : String`

**Description:** Constructs an URL to select the specified value of the specified variation attribute. The generated URL will be an absolute URL which uses the protocol of the current request.

**Deprecated:**

Use urlSelectVariationValue(String, ProductVariationAttribute, ProductVariationAttributeValue) to construct an URL to select the specified product variation attribute value of the specified product variation attribute.

**Parameters:**

- `action`: the pipeline action, e.g. "Product-Show".
- `attribute`: the attribute to select a value for.
- `value`: the attribute definition value portion of the variation.

**Returns:**

the generated URL, an absolute URL which uses the protocol of the current request.

---

### urlSelectVariationValue

**Signature:** `urlSelectVariationValue(action : String, attribute : ProductVariationAttribute, value : ProductVariationAttributeValue) : String`

**Description:** Generates a URL for selecting a value for a given variation attribute. This URL is intended to be used on dynamic product detail pages. When a customer selects which value he wants for one of the variation attributes, the product detail page can issue a request to the passed URL which in turn can invoke the UpdateProductVariationSelections pipelet. That pipelet reads the querystring parameters and returns an updated variation model with the desired attribute value selected. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. "Product-Show".
- `attribute`: the product variation attribute to select a value for.
- `value`: the product variation attribute value to select.

**Returns:**

the generated URL, an absolute URL which uses the protocol of the current request.

---

### urlUnselectVariationValue

**Signature:** `urlUnselectVariationValue(action : String, attribute : ObjectAttributeDefinition) : String`

**Description:** Constructs an URL to unselect the value of the specified variation attribute. The generated URL will be an absolute URL which uses the protocol of the current request.

**Deprecated:**

Use urlUnselectVariationValue(String, ProductVariationAttribute) to unselect the product variation attribute value of the specified product variation attribute.

**Parameters:**

- `action`: the pipeline action, e.g. "Product-Show".
- `attribute`: the attribute to unselect.

**Returns:**

the generated URL, an absolute URL which uses the protocol of the current request.

---

### urlUnselectVariationValue

**Signature:** `urlUnselectVariationValue(action : String, attribute : ProductVariationAttribute) : String`

**Description:** Generates a URL for unselecting a value for a given variation attribute. This URL is intended to be used on dynamic product detail pages. When a customer deselects a value for one of the variation attributes, the product detail page can issue a request to the passed URL which in turn can invoke the UpdateProductVariationSelections pipelet. That pipelet reads the querystring parameters and returns an updated variation model with the desired attribute value unselected. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. "Product-Show".
- `attribute`: the product variation attribute to unselect.

**Returns:**

the generated URL, an absolute URL which uses the protocol of the current request.

---