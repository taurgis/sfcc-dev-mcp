## Package: dw.system

# Class Status

## Inheritance Hierarchy

- Object
  - dw.system.Status

## Description

A Status is used for communicating an API status code back to a client. A status consists of multiple StatusItem. Most often a Status contains only one StatusItem. For convenience, a message with parameters is formatted using standard formatting patterns. If you want to display locale-specific messages in your application, you should use the Status.getCode() as key for a resource bundle.

## Properties

### code

**Type:** String (Read Only)

The status code either of the first ERROR StatusItem or when there
 is no ERROR StatusITEM, the first StatusItem in the overall list.

 The status code is the unique identifier for the message and can be used by
 client programs to check for a specific status and to generate a localized
 message.

### details

**Type:** Map (Read Only)

The details either of the first ERROR StatusItem or when there
 is no ERROR StatusItem, the first StatusItem in the overall list.

### error

**Type:** boolean (Read Only)

Checks if the status is an ERROR. The Status is an ERROR if one of the
 contained StatusItems is an ERROR.

### items

**Type:** List (Read Only)

All status items.

### message

**Type:** String (Read Only)

The message either of the first ERROR StatusItem or when there
 is no ERROR StatusItem, the first StatusItem in the overall list.

 Note: Custom code and client programs must not use this message to identify
 a specific status. The getCode() must be used for that purpose. The actual
 message can change from release to release.

### parameters

**Type:** List (Read Only)

The parameters either of the first ERROR StatusItem or when there
 is no ERROR StatusItem, the first StatusItem in the overall list.

### status

**Type:** Number (Read Only)

The overall status. If all StatusItems are OK, the method returns
 OK. If one StatusItem is an ERROR it returns ERROR.

## Constructor Summary

Status() Creates a Status object with no StatusItems.

Status(status : Number) Creates a Status with a single StatusItem.

Status(status : Number, code : String) Creates a Status with a single StatusItem.

Status(status : Number, code : String, message : String, parameters : Object...) Creates a Status with a single StatusItem.

## Method Summary

### addDetail

**Signature:** `addDetail(key : String, value : Object) : void`

Add detail information for the given key of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

### addItem

**Signature:** `addItem(item : StatusItem) : void`

Adds an additional status item to this status instance.

### getCode

**Signature:** `getCode() : String`

Returns the status code either of the first ERROR StatusItem or when there is no ERROR StatusITEM, the first StatusItem in the overall list.

### getDetail

**Signature:** `getDetail(key : String) : Object`

Returns the detail value for the given key of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

### getDetails

**Signature:** `getDetails() : Map`

Returns the details either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

### getItems

**Signature:** `getItems() : List`

Returns all status items.

### getMessage

**Signature:** `getMessage() : String`

Returns the message either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

### getParameters

**Signature:** `getParameters() : List`

Returns the parameters either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

### getStatus

**Signature:** `getStatus() : Number`

Returns the overall status.

### isError

**Signature:** `isError() : boolean`

Checks if the status is an ERROR.

## Constructor Detail

## Method Detail

## Method Details

### addDetail

**Signature:** `addDetail(key : String, value : Object) : void`

**Description:** Add detail information for the given key of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

**Parameters:**

- `key`: the key of the first ERROR StatusItem or the first StatusItem in the list.
- `value`: the detail value.

---

### addItem

**Signature:** `addItem(item : StatusItem) : void`

**Description:** Adds an additional status item to this status instance.

**Parameters:**

- `item`: the status item to add.

---

### getCode

**Signature:** `getCode() : String`

**Description:** Returns the status code either of the first ERROR StatusItem or when there is no ERROR StatusITEM, the first StatusItem in the overall list. The status code is the unique identifier for the message and can be used by client programs to check for a specific status and to generate a localized message.

**Returns:**

the status code

---

### getDetail

**Signature:** `getDetail(key : String) : Object`

**Description:** Returns the detail value for the given key of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

**Parameters:**

- `key`: the key for the detail to return.

**Returns:**

the detail value for the given key of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

---

### getDetails

**Signature:** `getDetails() : Map`

**Description:** Returns the details either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

**Returns:**

the details either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

---

### getItems

**Signature:** `getItems() : List`

**Description:** Returns all status items.

**Returns:**

all status items.

---

### getMessage

**Signature:** `getMessage() : String`

**Description:** Returns the message either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list. Note: Custom code and client programs must not use this message to identify a specific status. The getCode() must be used for that purpose. The actual message can change from release to release.

**Returns:**

the message either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

---

### getParameters

**Signature:** `getParameters() : List`

**Description:** Returns the parameters either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

**Returns:**

the parameters either of the first ERROR StatusItem or when there is no ERROR StatusItem, the first StatusItem in the overall list.

---

### getStatus

**Signature:** `getStatus() : Number`

**Description:** Returns the overall status. If all StatusItems are OK, the method returns OK. If one StatusItem is an ERROR it returns ERROR.

**Returns:**

either OK or ERROR

---

### isError

**Signature:** `isError() : boolean`

**Description:** Checks if the status is an ERROR. The Status is an ERROR if one of the contained StatusItems is an ERROR.

**Returns:**

true if status is an ERROR, false otherwise.

---