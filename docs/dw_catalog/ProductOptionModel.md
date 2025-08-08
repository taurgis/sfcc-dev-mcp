## Package: dw.catalog

# Class ProductOptionModel

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductOptionModel

## Description

This class represents the option model of a specific product and for a specific currency. It provides accessor methods to the configured options and the values of those options. It has also methods to set a specific selection of option values.

## Properties

### options

**Type:** Collection (Read Only)

The collection of product options.

## Constructor Summary

## Method Summary

### getOption

**Signature:** `getOption(optionID : String) : ProductOption`

Returns the product option for the specified ID.

### getOptions

**Signature:** `getOptions() : Collection`

Returns the collection of product options.

### getOptionValue

**Signature:** `getOptionValue(option : ProductOption, valueID : String) : ProductOptionValue`

Returns the product option value object for the passed value id and in the context of the passed option.

### getOptionValues

**Signature:** `getOptionValues(option : ProductOption) : Collection`

Returns a collection of product option values for the specified product option.

### getPrice

**Signature:** `getPrice(optionValue : ProductOptionValue) : Money`

Returns the effective price of the specified option value.

### getSelectedOptionValue

**Signature:** `getSelectedOptionValue(option : ProductOption) : ProductOptionValue`

Returns the selected value for the specified product option.

### isSelectedOptionValue

**Signature:** `isSelectedOptionValue(option : ProductOption, value : ProductOptionValue) : boolean`

Returns true if the specified option value is the one currently selected, false otherwise.

### setSelectedOptionValue

**Signature:** `setSelectedOptionValue(option : ProductOption, value : ProductOptionValue) : void`

Updates the selection of the specified option based on the specified value.

### url

**Signature:** `url(action : String, varOptionAndValues : Object...) : URL`

Returns a URL that can be used to select one or more option values.

### urlSelectOptionValue

**Signature:** `urlSelectOptionValue(action : String, option : ProductOption, value : ProductOptionValue) : String`

Returns an URL that can be used to select a specific value of a specific option.

## Method Detail

## Method Details

### getOption

**Signature:** `getOption(optionID : String) : ProductOption`

**Description:** Returns the product option for the specified ID.

**Parameters:**

- `optionID`: the product option identifier.

**Returns:**

the product option for the specified ID.

---

### getOptions

**Signature:** `getOptions() : Collection`

**Description:** Returns the collection of product options.

**Returns:**

Collection of Product Options.

---

### getOptionValue

**Signature:** `getOptionValue(option : ProductOption, valueID : String) : ProductOptionValue`

**Description:** Returns the product option value object for the passed value id and in the context of the passed option.

**Parameters:**

- `option`: The option to get the specified value for.
- `valueID`: The id of the value to retrieve

**Returns:**

a value for the specified product option and value id

---

### getOptionValues

**Signature:** `getOptionValues(option : ProductOption) : Collection`

**Description:** Returns a collection of product option values for the specified product option.

**Parameters:**

- `option`: the option for which we want to extract the collection of product option values.

**Returns:**

a collection of product option values for the specified product option.

---

### getPrice

**Signature:** `getPrice(optionValue : ProductOptionValue) : Money`

**Description:** Returns the effective price of the specified option value.

**Parameters:**

- `optionValue`: the product option value to use.

**Returns:**

the effective price of the specified option value.

---

### getSelectedOptionValue

**Signature:** `getSelectedOptionValue(option : ProductOption) : ProductOptionValue`

**Description:** Returns the selected value for the specified product option. If no option values was set as selected option explicitly, the method returns the default option value for this option.

**Parameters:**

- `option`: The option to get the selected value for.

**Returns:**

a selected value for the specified product option.

---

### isSelectedOptionValue

**Signature:** `isSelectedOptionValue(option : ProductOption, value : ProductOptionValue) : boolean`

**Description:** Returns true if the specified option value is the one currently selected, false otherwise.

**Parameters:**

- `option`: the product option.
- `value`: the product option value.

**Returns:**

true if the specified option value is the one currently selected, false otherwise.

---

### setSelectedOptionValue

**Signature:** `setSelectedOptionValue(option : ProductOption, value : ProductOptionValue) : void`

**Description:** Updates the selection of the specified option based on the specified value.

**Parameters:**

- `option`: the option to update.
- `value`: the value to use when updating the product option.

---

### url

**Signature:** `url(action : String, varOptionAndValues : Object...) : URL`

**Description:** Returns a URL that can be used to select one or more option values. The optional varOptionAndValues argument can be empty, or can contain one or more option / value pairs. This variable list must be even in length, with options and values alternating. If the list is odd in length, the last argument will be ignored. Options can be specified as instances of ProductOption, or String option ID. Values can be specified as instances of ProductOptionValue or as strings representing the value ID. If a parameter is invalid, then the parameter pair is not included in the generated URL. The returned URL will contain options and values already selected in the product option model, as well as options and values specified as method parameters. This includes option values explicitly selected and implicitly selected by default.

**Parameters:**

- `action`: The pipeline action, must not be null.
- `varOptionAndValues`: Variable length list of options and values.

**Returns:**

The constructed URL.

---

### urlSelectOptionValue

**Signature:** `urlSelectOptionValue(action : String, option : ProductOption, value : ProductOptionValue) : String`

**Description:** Returns an URL that can be used to select a specific value of a specific option.

**Parameters:**

- `action`: the action to use.
- `option`: the option to use when constructing the URL.
- `value`: the value to use when constructing the URL.

**Returns:**

The constructed URL as string.

---