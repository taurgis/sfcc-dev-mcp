## Package: dw.web

# Class FormElement

## Inheritance Hierarchy

- Object
  - dw.web.FormElement

## Description

Represents a form element.

## Properties

### dynamicHtmlName

**Type:** String (Read Only)

A dynamic html name for the field. It can be used to suppress any autocompletion
 support from a browser, e.g. for credit card related fields. It can be also
 used for a unique form name, if one form is used multiple times in a page.

### formId

**Type:** String (Read Only)

The ID of the form element. The is is unique within the parent
 element of the form.

### htmlName

**Type:** String (Read Only)

The global unique name of the field, which can be used as name
 in the html form. For radio buttons this name is not unique.

### parent

**Type:** FormElement (Read Only)

The parent within the form.

### valid

**Type:** boolean (Read Only)

Identifies if this element and all its children elements are
 valid. A form element, which was not submitted in the last
 request is always valid.

### validationResult

**Type:** FormElementValidationResult (Read Only)

Provides a combined view on the validation status as per isValid() and getError(). In
 addition it also provides the data as returned by the validation in case a validation
 script was used.

## Constructor Summary

## Method Summary

### clearFormElement

**Signature:** `clearFormElement() : void`

This method clears the whole form.

### getDynamicHtmlName

**Signature:** `getDynamicHtmlName() : String`

Returns a dynamic html name for the field.

### getFormId

**Signature:** `getFormId() : String`

The ID of the form element.

### getHtmlName

**Signature:** `getHtmlName() : String`

Returns the global unique name of the field, which can be used as name in the html form.

### getParent

**Signature:** `getParent() : FormElement`

The parent within the form.

### getValidationResult

**Signature:** `getValidationResult() : FormElementValidationResult`

Provides a combined view on the validation status as per isValid() and getError().

### invalidateFormElement

**Signature:** `invalidateFormElement() : void`

The method can be called to explicitly invalidate a form element.

### invalidateFormElement

**Signature:** `invalidateFormElement(error : String) : void`

The method can be called to explicitly invalidate a field.

### isValid

**Signature:** `isValid() : boolean`

Identifies if this element and all its children elements are valid.

## Method Detail

## Method Details

### clearFormElement

**Signature:** `clearFormElement() : void`

**Description:** This method clears the whole form. After clearing a form it contains no value or the default value, is not bound to any business object and has the status of being valid.

---

### getDynamicHtmlName

**Signature:** `getDynamicHtmlName() : String`

**Description:** Returns a dynamic html name for the field. It can be used to suppress any autocompletion support from a browser, e.g. for credit card related fields. It can be also used for a unique form name, if one form is used multiple times in a page.

**Returns:**

a dynamic html name.

---

### getFormId

**Signature:** `getFormId() : String`

**Description:** The ID of the form element. The is is unique within the parent element of the form.

**Returns:**

the ID of the form.

---

### getHtmlName

**Signature:** `getHtmlName() : String`

**Description:** Returns the global unique name of the field, which can be used as name in the html form. For radio buttons this name is not unique.

**Returns:**

the global unique name of the field.

---

### getParent

**Signature:** `getParent() : FormElement`

**Description:** The parent within the form.

**Returns:**

the parent within the form.

---

### getValidationResult

**Signature:** `getValidationResult() : FormElementValidationResult`

**Description:** Provides a combined view on the validation status as per isValid() and getError(). In addition it also provides the data as returned by the validation in case a validation script was used.

**Returns:**

the validation status (valid, error, data)

---

### invalidateFormElement

**Signature:** `invalidateFormElement() : void`

**Description:** The method can be called to explicitly invalidate a form element. The error text will be set to the one of two possible preconfigured custom error messages associated with the form definition. The "value-error" message will be used for FormField instances and "form-error" will be used for FormGroup instances.

---

### invalidateFormElement

**Signature:** `invalidateFormElement(error : String) : void`

**Description:** The method can be called to explicitly invalidate a field. The error text is set to the given error message.

**Parameters:**

- `error`: the error text to use.

---

### isValid

**Signature:** `isValid() : boolean`

**Description:** Identifies if this element and all its children elements are valid. A form element, which was not submitted in the last request is always valid.

**Returns:**

true if this element and all its children elements are valid, false otherwise.

---