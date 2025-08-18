## Package: dw.campaign

# Class SourceCodeInfo

## Inheritance Hierarchy

- Object
  - dw.campaign.SourceCodeInfo

## Description

Class representing a code (i.e. a "source code") that has been applied to a customer's session. Source codes can qualify customers for different campaigns, promotions, and other site experiences from those that the typical customer sees. Codes are organized into source code groups. Typically, a code is applied to a customer's session automatically by Commerce Cloud Digital when a customer accesses a Digital URL with a well known request parameter in the querystring. A code may also be explicitly applied to a customer session using the SetSourceCode pipelet.

## Constants

### STATUS_ACTIVE

**Type:** Number = 2

The literal source-code is found and currently active.

### STATUS_INACTIVE

**Type:** Number = 1

The literal source-code is found but not active.

### STATUS_INVALID

**Type:** Number = 0

The literal source-code is not found in the system.

## Properties

### code

**Type:** String (Read Only)

The literal source-code.

### group

**Type:** SourceCodeGroup (Read Only)

The associated source-code group.

### redirect

**Type:** URLRedirect (Read Only)

Retrieves the redirect information from the last processed SourceCodeGroup (active or inactive). If none exists,
 then the redirect information is retrieved from the source-code preferences, based on the active/inactive status
 of the SourceCodeGroup. The redirect information is then resolved to the output URL. If the redirect information
 cannot be resolved to a URL, or there is an error retrieving the preferences, then null is returned.

### status

**Type:** Number (Read Only)

The status of the source-code.  One of the following:
 STATUS_INVALID - The source code is not found in the system.
 STATUS_INACTIVE - The source code is found but not active.
 STATUS_INACTIVE - The source code is found and active.

## Constructor Summary

## Method Summary

### getCode

**Signature:** `getCode() : String`

The literal source-code.

### getGroup

**Signature:** `getGroup() : SourceCodeGroup`

The associated source-code group.

### getRedirect

**Signature:** `getRedirect() : URLRedirect`

Retrieves the redirect information from the last processed SourceCodeGroup (active or inactive).

### getStatus

**Signature:** `getStatus() : Number`

The status of the source-code.

## Method Detail

## Method Details

### getCode

**Signature:** `getCode() : String`

**Description:** The literal source-code.

**Returns:**

the source-code.

---

### getGroup

**Signature:** `getGroup() : SourceCodeGroup`

**Description:** The associated source-code group.

**Returns:**

the source-code group.

---

### getRedirect

**Signature:** `getRedirect() : URLRedirect`

**Description:** Retrieves the redirect information from the last processed SourceCodeGroup (active or inactive). If none exists, then the redirect information is retrieved from the source-code preferences, based on the active/inactive status of the SourceCodeGroup. The redirect information is then resolved to the output URL. If the redirect information cannot be resolved to a URL, or there is an error retrieving the preferences, then null is returned.

**Returns:**

URLRedirect containing the location and status code, null in case of no redirect was found

---

### getStatus

**Signature:** `getStatus() : Number`

**Description:** The status of the source-code. One of the following: STATUS_INVALID - The source code is not found in the system. STATUS_INACTIVE - The source code is found but not active. STATUS_INACTIVE - The source code is found and active.

**Returns:**

the status.

---