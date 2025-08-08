## Package: dw.web

# Class HttpParameterMap

## Inheritance Hierarchy

- Object
  - dw.web.HttpParameterMap

## Description

A map of HTTP parameters.

## Properties

### parameterCount

**Type:** Number (Read Only)

The number of paramters in this http parameter map.

### parameterNames

**Type:** Set (Read Only)

A collection of all parameter names.

### requestBodyAsString

**Type:** String (Read Only)

The HTTP request body as string (e.g. useful for XML posts). A body
 is only returned if the request is a POST or PUT request and was not send
 with "application/x-www-form-urlencoded" encoding. If the request was send
 with that encoding it is interpreted as form data and the body will be empty.

## Constructor Summary

## Method Summary

### get

**Signature:** `get(name : Object) : HttpParameter`

Returns the http parameter for the given key or an empty http parameter, if no parameter is defined for that key.

### getParameterCount

**Signature:** `getParameterCount() : Number`

Returns the number of paramters in this http parameter map.

### getParameterMap

**Signature:** `getParameterMap(prefix : String) : HttpParameterMap`

Returns a sub-map containing all parameters that start with the given prefix.

### getParameterNames

**Signature:** `getParameterNames() : Set`

Returns a collection of all parameter names.

### getRequestBodyAsString

**Signature:** `getRequestBodyAsString() : String`

Returns the HTTP request body as string (e.g.

### isParameterSubmitted

**Signature:** `isParameterSubmitted(key : String) : boolean`

Identifies if the parameter has been submitted.

### processMultipart

**Signature:** `processMultipart(callback : Function) : LinkedHashMap`

This method can be called to process a form submission for an HTML form with encoding type "multipart/form-data".

## Method Detail

## Method Details

### get

**Signature:** `get(name : Object) : HttpParameter`

**Description:** Returns the http parameter for the given key or an empty http parameter, if no parameter is defined for that key. An empty parameter returns false for the method isDefined().

**Parameters:**

- `name`: the key whose associated http parameter is to be returned.

**Returns:**

the http parameter or an empty http parameter.

---

### getParameterCount

**Signature:** `getParameterCount() : Number`

**Description:** Returns the number of paramters in this http parameter map.

**Returns:**

the number parameters.

---

### getParameterMap

**Signature:** `getParameterMap(prefix : String) : HttpParameterMap`

**Description:** Returns a sub-map containing all parameters that start with the given prefix. The prefix will be removed from the parameter names in the returned sub-map. For example with the parameters "pre_P1" and "pre_p2" a call with "pre_" as parameter will return a HttpParameterMap containing "P1" and "P2".

**Parameters:**

- `prefix`: the prefix to use when creating the sub-map.

**Returns:**

the sub-map containing the target parameters.

---

### getParameterNames

**Signature:** `getParameterNames() : Set`

**Description:** Returns a collection of all parameter names.

**Returns:**

a set of all parameter names

---

### getRequestBodyAsString

**Signature:** `getRequestBodyAsString() : String`

**Description:** Returns the HTTP request body as string (e.g. useful for XML posts). A body is only returned if the request is a POST or PUT request and was not send with "application/x-www-form-urlencoded" encoding. If the request was send with that encoding it is interpreted as form data and the body will be empty.

**Returns:**

the http request body

---

### isParameterSubmitted

**Signature:** `isParameterSubmitted(key : String) : boolean`

**Description:** Identifies if the parameter has been submitted.

**Parameters:**

- `key`: the parameter to check.

**Returns:**

true if the parameter has been submitted, false otherwise.

---

### processMultipart

**Signature:** `processMultipart(callback : Function) : LinkedHashMap`

**Description:** This method can be called to process a form submission for an HTML form with encoding type "multipart/form-data". Such a form can have a mixture of "regular" HTML form fields and also file uploads. Form fields are available via get(Object) without calling this method. Uploaded files still need to be processed via the passed callback function. This callback function is called for each file upload part in the request. The parameters are the field name, the content type and the original file name. The function can return either a null, which means that the upload of this part should be skipped, or return a dw.io.File instance. If the file is an existing directory the system will automatically generate a unique file name. If the file is not an existing directory the uploaded content will be directly stored into that file. An existing file with the same name will be deleted. If the file can't be deleted for whatever reason, the upload is stored with a generated unique file name in the indicated directory. An automatically generated file name consists of the the prefix "upload", a time stamp, a unique id and the extension tmp. For example: "upload_20070114221535_bc7H1aOadI9qYaaacovPd3lqna.tmp". var params : HttpParameterMap = pdict.CurrentHttpParameterMap; // Get the file name from the first field. This is works because the // parameter map is updated before the file part is parsed. var files : LinkedHashMap = params.processMultipart( (function( field, ct, oname ){ return new File( File.IMPEX + "/" + params.firstField ); }) );

**Parameters:**

- `callback`: a callback function, which takes the field name, content type and original file name as input

**Returns:**

a LinkedHashMap where the keys are the actual file names and the values are references to the File, or null if this is not a multipart request

---