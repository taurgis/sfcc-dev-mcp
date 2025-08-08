## Package: dw.web

# Class FormElementValidationResult

## Inheritance Hierarchy

- Object
  - dw.web.FormElementValidationResult

## Description

Represents a form element validation result. The validation script specified for form groups and fields can create such FormElementValidationResult with the desired validity, message and data and can then return it. The server side form element validation will evaluate these settings, i.e. calculate the corresponding element validity and message. The optional data provided with this instance will be kept and can be accessed again from the form element after server side validation.

## Properties

### data

**Type:** Map (Read Only)

Provides optional data acquired during validation.

### message

**Type:** String

Provides an optional message in case of validation failure.

### valid

**Type:** boolean

States if the validation succeeded or failed.

## Constructor Summary

FormElementValidationResult(valid : boolean) Creates a FormElementValidationResult with given setting for the validity but without any message.

FormElementValidationResult(valid : boolean, message : String) Creates a FormElementValidationResult with given setting for the validity and corresponding message.

FormElementValidationResult(valid : boolean, message : String, data : Map) Creates a FormElementValidationResult with given setting for the validity and corresponding message.

## Method Summary

### addData

**Signature:** `addData(key : Object, value : Object) : void`

Adds optional data acquired during validation.

### getData

**Signature:** `getData() : Map`

Provides optional data acquired during validation.

### getMessage

**Signature:** `getMessage() : String`

Provides an optional message in case of validation failure.

### isValid

**Signature:** `isValid() : boolean`

States if the validation succeeded or failed.

### setMessage

**Signature:** `setMessage(message : String) : void`

Sets an optional message in case of validation failure.

### setValid

**Signature:** `setValid(valid : boolean) : void`

Sets if the validation succeeded or failed.

## Constructor Detail

## Method Detail

## Method Details

### addData

**Signature:** `addData(key : Object, value : Object) : void`

**Description:** Adds optional data acquired during validation.

**Parameters:**

- `key`: the key for which the data value will be stored
- `value`: the data value that is stored for the given key

---

### getData

**Signature:** `getData() : Map`

**Description:** Provides optional data acquired during validation.

**Returns:**

the data acquired during validation

---

### getMessage

**Signature:** `getMessage() : String`

**Description:** Provides an optional message in case of validation failure.

**Returns:**

the message for validation failure

---

### isValid

**Signature:** `isValid() : boolean`

**Description:** States if the validation succeeded or failed.

**Returns:**

true if the validation succeeded

---

### setMessage

**Signature:** `setMessage(message : String) : void`

**Description:** Sets an optional message in case of validation failure.

**Parameters:**

- `message`: the message for validation failure

---

### setValid

**Signature:** `setValid(valid : boolean) : void`

**Description:** Sets if the validation succeeded or failed.

**Parameters:**

- `valid`: if the validation succeeded

---