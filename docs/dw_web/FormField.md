## Package: dw.web

# Class FormField

## Inheritance Hierarchy

- Object
  - dw.web.FormElement
  - dw.web.FormField

## Description

Represents a field in a form.

## Properties

### checked

**Type:** boolean (Read Only)

Identifies if the current selected state of this field is checked. In case of
 a boolean field the method directly represent the boolean value. In case
 of a string or int field, the method returns true if the current value
 matched with the value specified as "selected-value". In this way a
 selected status can be as determined for non-boolean fields.

### description

**Type:** String (Read Only)

An optinal description for the field.

### error

**Type:** String (Read Only)

The error text that will be shown to the user when the field is
 invalid. The error messages that may be returned by this method are
 defined in the form field definition under the following attribute names:

 
 missing-error
 parse-error
 range-error
 value-error
 

 The framework performs error checks in a specific order, and so if there
 are multiple errors for a single FormField, the following sequence
 defines which error is returned:

 
 When submitting a form entry, whitespace is first trimmed from user
 entry and the entry is parsed into native data type (boolean, date,
 integer, number, or string). A regex, if defined, is also matched against
 the input. If there is an error while parsing or matching with regex,
 "parse-error" is set as error.
 If field was marked as "mandatory" but there is no entry,
 "missing-error" is returned
 The min/max and minlength/maxlength checks are performed. If test
 failed, "range-error" is returned.
 value-error or form-error are returned when "invalidate()" was called
 programatically (or pipelet InvalidateFormElement is used)
 

 If the field is valid, this method returns null. If no error message was
 specified in the form field definition, this method also returns null.

### htmlValue

**Type:** String

The current external string representation of the
 value in this field.

### label

**Type:** String (Read Only)

An optional label text for the field.

### mandatory

**Type:** boolean (Read Only)

Indicates if the field is mandatory.

### maxLength

**Type:** Number (Read Only)

The maximum length for the form field. A maximum length can
 be specified for all form data types, but is only used to validate fields
 of type "string". For other data types the value is just provided as an
 easy way to dynamically format the user interface. If not specified in
 the form definition the default minimum length is Integer.MAX_VALUE.

### maxValue

**Type:** Object (Read Only)

The maximum value for a form field. A maximum value is only
 applicable for fields with the data type "int", "number" and "date".
 If a maximum value was not specified in the form definition the method
 returns null.

### minLength

**Type:** Number (Read Only)

The minimum length for the form field. A minimum length can
 be specified for all form data types, but is only used to validate fields
 of type "string". For other data types the value is just provided as an
 easy way to dynamically format the user interface. If not specified in
 the form definition the default minimum length is 0.

### minValue

**Type:** Object (Read Only)

The minimum value for a form field. A minimum value is only
 applicable for fields with the data type "int", "number" and "date".
 If a minimum value was not specified in the form definition the method
 returns null.

### options

**Type:** FormFieldOptions

A list of possible values for this field. The method
 is typically used to render a selection list or to render radio buttons.

### regEx

**Type:** String (Read Only)

An optional regular expression pattern, which was set in the form
 definition. A pattern is only used for validation only for string fields.
 If no pattern was set, the method returns null.

### selected

**Type:** boolean (Read Only)

Identifies if the current selected state of this field is selected. In case of
 a boolean field the method directly represent the boolean value. In case
 of a string or int field, the method returns true if the current value
 matched with the value specified as "selected-value". In this way a
 selected status can be as determined for non-boolean fields.

### selectedOption

**Type:** FormFieldOption (Read Only)

The selected options or null if the field has no option
 or non is selected.

### selectedOptionObject

**Type:** Object (Read Only)

The object that was optionally associated with the
 currently selected option.

### type

**Type:** Number (Read Only)

The method returns the type of the field. The type is one of the
 FIELD_TYPE constants defined in this class.

### value

**Type:** Object

The internal value representation, which can be a string, a
 number, a boolean or a date.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns an optinal description for the field.

### getError

**Signature:** `getError() : String`

Returns the error text that will be shown to the user when the field is invalid.

### getHtmlValue

**Signature:** `getHtmlValue() : String`

Returns the current external string representation of the value in this field.

### getLabel

**Signature:** `getLabel() : String`

Returns an optional label text for the field.

### getMaxLength

**Signature:** `getMaxLength() : Number`

Returns the maximum length for the form field.

### getMaxValue

**Signature:** `getMaxValue() : Object`

Returns the maximum value for a form field.

### getMinLength

**Signature:** `getMinLength() : Number`

Returns the minimum length for the form field.

### getMinValue

**Signature:** `getMinValue() : Object`

Returns the minimum value for a form field.

### getOptions

**Signature:** `getOptions() : FormFieldOptions`

Returns a list of possible values for this field.

### getRegEx

**Signature:** `getRegEx() : String`

Returns an optional regular expression pattern, which was set in the form definition.

### getSelectedOption

**Signature:** `getSelectedOption() : FormFieldOption`

Returns the selected options or null if the field has no option or non is selected.

### getSelectedOptionObject

**Signature:** `getSelectedOptionObject() : Object`

Returns the object that was optionally associated with the currently selected option.

### getType

**Signature:** `getType() : Number`

The method returns the type of the field.

### getValue

**Signature:** `getValue() : Object`

Returns the internal value representation, which can be a string, a number, a boolean or a date.

### isChecked

**Signature:** `isChecked() : boolean`

Identifies if the current selected state of this field is checked.

### isMandatory

**Signature:** `isMandatory() : boolean`

Indicates if the field is mandatory.

### isSelected

**Signature:** `isSelected() : boolean`

Identifies if the current selected state of this field is selected.

### setHtmlValue

**Signature:** `setHtmlValue(htmlValue : String) : void`

A form field has two value representations, the HTML value and the plain value.

### setOptions

**Signature:** `setOptions(optionValues : Map) : void`

The method can be called to update an option list based on the given key and values in the given map.

### setOptions

**Signature:** `setOptions(optionValues : Map, begin : Number, end : Number) : void`

The method can be called to update an option list based on the given key and values in the given map.

### setOptions

**Signature:** `setOptions(optionValues : Iterator, begin : Number, end : Number) : void`

The method can be called to update an option list based on the given iterator with objects.

### setOptions

**Signature:** `setOptions(optionValues : Iterator) : void`

The method can be called to update an option list based on the given iterator with objects.

### setValue

**Signature:** `setValue(value : Object) : void`

Sets the typed value of the field.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns an optinal description for the field.

**Returns:**

an optional description for the field.

---

### getError

**Signature:** `getError() : String`

**Description:** Returns the error text that will be shown to the user when the field is invalid. The error messages that may be returned by this method are defined in the form field definition under the following attribute names: missing-error parse-error range-error value-error The framework performs error checks in a specific order, and so if there are multiple errors for a single FormField, the following sequence defines which error is returned: When submitting a form entry, whitespace is first trimmed from user entry and the entry is parsed into native data type (boolean, date, integer, number, or string). A regex, if defined, is also matched against the input. If there is an error while parsing or matching with regex, "parse-error" is set as error. If field was marked as "mandatory" but there is no entry, "missing-error" is returned The min/max and minlength/maxlength checks are performed. If test failed, "range-error" is returned. value-error or form-error are returned when "invalidate()" was called programatically (or pipelet InvalidateFormElement is used) If the field is valid, this method returns null. If no error message was specified in the form field definition, this method also returns null.

**Returns:**

the error text that will be shown to the user when the field is invalid.

---

### getHtmlValue

**Signature:** `getHtmlValue() : String`

**Description:** Returns the current external string representation of the value in this field.

**Returns:**

the current external string representation of the value in this field.

---

### getLabel

**Signature:** `getLabel() : String`

**Description:** Returns an optional label text for the field.

**Returns:**

an optional label text for the field.

---

### getMaxLength

**Signature:** `getMaxLength() : Number`

**Description:** Returns the maximum length for the form field. A maximum length can be specified for all form data types, but is only used to validate fields of type "string". For other data types the value is just provided as an easy way to dynamically format the user interface. If not specified in the form definition the default minimum length is Integer.MAX_VALUE.

**Returns:**

maximum length or MAX_VALUE

---

### getMaxValue

**Signature:** `getMaxValue() : Object`

**Description:** Returns the maximum value for a form field. A maximum value is only applicable for fields with the data type "int", "number" and "date". If a maximum value was not specified in the form definition the method returns null.

**Returns:**

maximum value or null

---

### getMinLength

**Signature:** `getMinLength() : Number`

**Description:** Returns the minimum length for the form field. A minimum length can be specified for all form data types, but is only used to validate fields of type "string". For other data types the value is just provided as an easy way to dynamically format the user interface. If not specified in the form definition the default minimum length is 0.

**Returns:**

minimum length or 0

---

### getMinValue

**Signature:** `getMinValue() : Object`

**Description:** Returns the minimum value for a form field. A minimum value is only applicable for fields with the data type "int", "number" and "date". If a minimum value was not specified in the form definition the method returns null.

**Returns:**

minimum value or null

---

### getOptions

**Signature:** `getOptions() : FormFieldOptions`

**Description:** Returns a list of possible values for this field. The method is typically used to render a selection list or to render radio buttons.

**Returns:**

a list of possible values for this field.

---

### getRegEx

**Signature:** `getRegEx() : String`

**Description:** Returns an optional regular expression pattern, which was set in the form definition. A pattern is only used for validation only for string fields. If no pattern was set, the method returns null.

**Returns:**

the regular expression used for validation or null

---

### getSelectedOption

**Signature:** `getSelectedOption() : FormFieldOption`

**Description:** Returns the selected options or null if the field has no option or non is selected.

**Returns:**

the selected options or null if the field has no option or non is selected.

---

### getSelectedOptionObject

**Signature:** `getSelectedOptionObject() : Object`

**Description:** Returns the object that was optionally associated with the currently selected option.

**Returns:**

the object that was optionally associated with the currently selected option.

---

### getType

**Signature:** `getType() : Number`

**Description:** The method returns the type of the field. The type is one of the FIELD_TYPE constants defined in this class.

**Returns:**

the type of the form field

---

### getValue

**Signature:** `getValue() : Object`

**Description:** Returns the internal value representation, which can be a string, a number, a boolean or a date.

**Returns:**

the internal value representation, which can be a string, a number, a boolean or a date.

---

### isChecked

**Signature:** `isChecked() : boolean`

**Description:** Identifies if the current selected state of this field is checked. In case of a boolean field the method directly represent the boolean value. In case of a string or int field, the method returns true if the current value matched with the value specified as "selected-value". In this way a selected status can be as determined for non-boolean fields.

**Returns:**

true if current selected state of this field is checked.

---

### isMandatory

**Signature:** `isMandatory() : boolean`

**Description:** Indicates if the field is mandatory.

**Returns:**

true if the field is mandatory, false otherwise.

---

### isSelected

**Signature:** `isSelected() : boolean`

**Description:** Identifies if the current selected state of this field is selected. In case of a boolean field the method directly represent the boolean value. In case of a string or int field, the method returns true if the current value matched with the value specified as "selected-value". In this way a selected status can be as determined for non-boolean fields.

**Returns:**

true if current selected state of this field is checked.

---

### setHtmlValue

**Signature:** `setHtmlValue(htmlValue : String) : void`

**Description:** A form field has two value representations, the HTML value and the plain value. The HTML value is always a string representation of the field value. The plain value is the fully typed and validated field value. The sets the HTML value for a field. The method is typically called from the HTTP POST processing framework. The method than parses, validates and assigns the value to the typed field value (see getValue()). If the value is invalid the typed field value is set to null and the valid flag is set to false. The error property contains an error message for the form.

**Parameters:**

- `htmlValue`: the HTML value to use.

---

### setOptions

**Signature:** `setOptions(optionValues : Map) : void`

**Description:** The method can be called to update an option list based on the given key and values in the given map.

**Parameters:**

- `optionValues`: a Map with the values for the option list

---

### setOptions

**Signature:** `setOptions(optionValues : Map, begin : Number, end : Number) : void`

**Description:** The method can be called to update an option list based on the given key and values in the given map. The method also expects and index range. This index range only makes sense when the Map is a SortedMap.

**Parameters:**

- `optionValues`: a Map with the values for the option list.
- `begin`: the index of the first element to use as option value.
- `end`: the last of the last element to use as option value.

---

### setOptions

**Signature:** `setOptions(optionValues : Iterator, begin : Number, end : Number) : void`

**Description:** The method can be called to update an option list based on the given iterator with objects. The option list is updated using the bindings specified in the form definition. If no bindings are specified in the form definition the elements are interpreted as pure strings.

**Parameters:**

- `optionValues`: an iterator hows elements are used as option values
- `begin`: the index of the first element to use as option value
- `end`: the last of the last element to use as option value

---

### setOptions

**Signature:** `setOptions(optionValues : Iterator) : void`

**Description:** The method can be called to update an option list based on the given iterator with objects.

**Parameters:**

- `optionValues`: an iterator whose elements are used as option values

---

### setValue

**Signature:** `setValue(value : Object) : void`

**Description:** Sets the typed value of the field. The value is than immediately formatted into the external string representation, which is availble through the getHtmlValue() method. Also the valid flag is set to true. The actual value is not validated against the rules defined in the form definition. The method is typically used to directly set a typed value and to circumvent the validation rules. The type of the argument must match with the type of the field.

**Parameters:**

- `value`: the value to set.

---