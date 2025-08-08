## Package: dw.system

# Class SearchStatus

## Inheritance Hierarchy

- Object
  - dw.system.SearchStatus

## Description

A SearchStatus is used for communicating a Search API status back to a client. A status consists of status code and description. More information about search API call can be fetched by using SearchStatus class method getStatusCode and getDescription, which can be used by clients to perform different operations.

## Constants

## Properties

### description

**Type:** String (Read Only)

Returns status code description of search result, it provides more details about search API call status.

### statusCode

**Type:** Number (Read Only)

Returns status code of search result, by default it will return 0 which means that search has not been executed
 on SearchModel.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns status code description of search result, it provides more details about search API call status.

### getStatusCode

**Signature:** `getStatusCode() : Number`

Returns status code of search result, by default it will return 0 which means that search has not been executed on SearchModel.

### toString

**Signature:** `toString() : String`

Returns string values of status code and description.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns status code description of search result, it provides more details about search API call status.

**Returns:**

search status description

---

### getStatusCode

**Signature:** `getStatusCode() : Number`

**Description:** Returns status code of search result, by default it will return 0 which means that search has not been executed on SearchModel.

**Returns:**

search status code

---

### toString

**Signature:** `toString() : String`

**Description:** Returns string values of status code and description.

**Returns:**

search status string

---