## Package: dw.system

# Class SearchStatus

## Inheritance Hierarchy

- Object
  - dw.system.SearchStatus

## Description

A SearchStatus is used for communicating a Search API status back to a client. A status consists of status code and description. More information about search API call can be fetched by using SearchStatus class method getStatusCode and getDescription, which can be used by clients to perform different operations.

## Constants

### EMPTY_QUERY

**Type:** Number = 6

EMPTY_QUERY search result status code 6, this indicates that search has been made with empty query.

### ERROR

**Type:** Number = 9

ERROR search result status code 9, this indicates that internal server error has been occurred.

### LIMITED

**Type:** Number = 2

LIMITED search result status code 2, this indicates that limitations on search result have been applied and full search result is not returned.

### NO_CATALOG

**Type:** Number = 4

NO_CATALOG search result status code 4, this indicates that there is no catalog associated for search query.

### NO_CATEGORY

**Type:** Number = 5

NO_CATEGORY search result status code 5, this indicates that there is no category associated for search query.

### NO_INDEX

**Type:** Number = 8

NO_INDEX search result status code 8, this indicates that there is no active search index available.

### NOT_EXECUTED

**Type:** Number = 0

NOT_EXECUTED search result status code 0, this indicates that search API call has not been made on SearchModel.

### OFFLINE_CATEGORY

**Type:** Number = 7

OFFLINE_CATEGORY search result status code 7, this indicates that the category associated with search query is offline.

### ROOT_SEARCH

**Type:** Number = 3

ROOT_SEARCH search result status code 3, this indicates that search result is returned for ROOT search.

### SUCCESSFUL

**Type:** Number = 1

SUCCESSFUL search result status code 1, this indicates that search API call is executed without any issue.

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