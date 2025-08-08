## Package: dw.system

# Class StatusItem

## Inheritance Hierarchy

- Object
  - dw.system.StatusItem

## Description

A StatusItem holds all the status information. Multi StatusItems are bundled together into a Status.

## Properties

### code

**Type:** String

The status code is the unique identifier for the message and can be used by
 client programs to check for a specific status and to generate a localized
 message.

### details

**Type:** Map (Read Only)

The optional details for this StatusItem.

### error

**Type:** boolean (Read Only)

Returns whether this Status Item represents and error.

### message

**Type:** String

The default human readable message for this Status.

 Note: Custom code and client programs must not use this message to identify
 a specific status. The getCode() must be used for that purpose. The actual
 message can change from release to release.

### parameters

**Type:** List

The parameters to construct a custom message.

### status

**Type:** Number

The status.

## Constructor Summary

StatusItem() Constructs a new OK StatusItem.

StatusItem(status : Number) Constructs a new StatusItem with the given status.

StatusItem(status : Number, code : String) Constructs a new StatusItem with the given status and code.

StatusItem(status : Number, code : String, message : String, parameters : Object...) Constructs a new StatusItem with the given values.

## Method Summary

### addDetail

**Signature:** `addDetail(key : String, value : Object) : void`

Add an additional detail to this StatusItem.

### getCode

**Signature:** `getCode() : String`

The status code is the unique identifier for the message and can be used by client programs to check for a specific status and to generate a localized message.

### getDetails

**Signature:** `getDetails() : Map`

Returns the optional details for this StatusItem.

### getMessage

**Signature:** `getMessage() : String`

Returns the default human readable message for this Status.

### getParameters

**Signature:** `getParameters() : List`

Returns the parameters to construct a custom message.

### getStatus

**Signature:** `getStatus() : Number`

Returns the status.

### isError

**Signature:** `isError() : boolean`

Returns whether this Status Item represents and error.

### setCode

**Signature:** `setCode(code : String) : void`

Method to set the status code.

### setMessage

**Signature:** `setMessage(message : String) : void`

Sets the default human readable message for this Status.

### setParameters

**Signature:** `setParameters(parameters : Object...) : void`

Sets the parameters for a custom message.

### setStatus

**Signature:** `setStatus(status : Number) : void`

Set the status.

## Constructor Detail

## Method Detail

## Method Details

### addDetail

**Signature:** `addDetail(key : String, value : Object) : void`

**Description:** Add an additional detail to this StatusItem.

**Parameters:**

- `key`: the key for the detail.
- `value`: the detail value.

---

### getCode

**Signature:** `getCode() : String`

**Description:** The status code is the unique identifier for the message and can be used by client programs to check for a specific status and to generate a localized message.

**Returns:**

the status code.

---

### getDetails

**Signature:** `getDetails() : Map`

**Description:** Returns the optional details for this StatusItem.

**Returns:**

the optional details for this StatusItem.

---

### getMessage

**Signature:** `getMessage() : String`

**Description:** Returns the default human readable message for this Status. Note: Custom code and client programs must not use this message to identify a specific status. The getCode() must be used for that purpose. The actual message can change from release to release.

**Returns:**

the default human readable message for this Status.

---

### getParameters

**Signature:** `getParameters() : List`

**Description:** Returns the parameters to construct a custom message.

**Returns:**

the parameters to construct a custom message.

---

### getStatus

**Signature:** `getStatus() : Number`

**Description:** Returns the status.

**Returns:**

either Status.OK or Status.ERROR.

---

### isError

**Signature:** `isError() : boolean`

**Description:** Returns whether this Status Item represents and error.

**Returns:**

true is this item represents an error, false otherwise.

---

### setCode

**Signature:** `setCode(code : String) : void`

**Description:** Method to set the status code. The status code is the unique identifier for the message and can be used by client programs to check for a specific status and to generate a localized message.

**Parameters:**

- `code`: the status code.

---

### setMessage

**Signature:** `setMessage(message : String) : void`

**Description:** Sets the default human readable message for this Status.

**Parameters:**

- `message`: the default human readable message for this Status.

---

### setParameters

**Signature:** `setParameters(parameters : Object...) : void`

**Description:** Sets the parameters for a custom message.

**Parameters:**

- `parameters`: the parameters for a custom message.

---

### setStatus

**Signature:** `setStatus(status : Number) : void`

**Description:** Set the status.

**Parameters:**

- `status`: either Status.OK or Status.ERROR.

---