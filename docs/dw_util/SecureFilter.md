## Package: dw.util

# Class SecureFilter

## Inheritance Hierarchy

- Object
  - dw.util.SecureFilter

## Description

SecureFilter contains many methods for manipulating untrusted data Strings into RFC-Compliant Strings for a given context by removing "bad" data from the untrusted data.

## Constructor Summary

## Method Summary

### forHtmlContent

**Signature:** `static forHtmlContent(input : String) : String`

Filters illegal characters from a given input for use in a general HTML context.

### forHtmlInDoubleQuoteAttribute

**Signature:** `static forHtmlInDoubleQuoteAttribute(input : String) : String`

Filters illegal characters from a given input for use in an HTML Attribute guarded by a double quote.

### forHtmlInSingleQuoteAttribute

**Signature:** `static forHtmlInSingleQuoteAttribute(input : String) : String`

Filters illegal characters from a given input for use in an HTML Attribute guarded by a single quote.

### forHtmlUnquotedAttribute

**Signature:** `static forHtmlUnquotedAttribute(input : String) : String`

Filters illegal characters from a given input for use in an HTML Attribute left unguarded.

### forJavaScriptInAttribute

**Signature:** `static forJavaScriptInAttribute(input : String) : String`

Filters illegal characters from a given input for use in JavaScript inside an HTML attribute.

### forJavaScriptInBlock

**Signature:** `static forJavaScriptInBlock(input : String) : String`

Filters illegal characters from a given input for use in JavaScript inside an HTML block.

### forJavaScriptInHTML

**Signature:** `static forJavaScriptInHTML(input : String) : String`

Filters illegal characters from a given input for use in JavaScript inside an HTML context.

### forJavaScriptInSource

**Signature:** `static forJavaScriptInSource(input : String) : String`

Filters illegal characters from a given input for use in JavaScript inside a JavaScript source file.

### forJSONValue

**Signature:** `static forJSONValue(input : String) : String`

Filters illegal characters from a given input for use in a JSON Object Value to prevent escaping into a trusted context.

### forUriComponent

**Signature:** `static forUriComponent(input : String) : String`

Filters illegal characters from a given input for use as a component of a URI.

### forUriComponentStrict

**Signature:** `static forUriComponentStrict(input : String) : String`

Filters illegal characters from a given input for use as a component of a URI.

### forXmlCommentContent

**Signature:** `static forXmlCommentContent(input : String) : String`

Filters illegal characters from a given input for use in an XML comments.

### forXmlContent

**Signature:** `static forXmlContent(input : String) : String`

Filters illegal characters from a given input for use in a general XML context.

### forXmlInDoubleQuoteAttribute

**Signature:** `static forXmlInDoubleQuoteAttribute(input : String) : String`

Filters illegal characters from a given input for use in an XML attribute guarded by a double quote.

### forXmlInSingleQuoteAttribute

**Signature:** `static forXmlInSingleQuoteAttribute(input : String) : String`

Filters illegal characters from a given input for use in an XML attribute guarded by a single quote.

## Method Detail

## Method Details

### forHtmlContent

**Signature:** `static forHtmlContent(input : String) : String`

**Description:** Filters illegal characters from a given input for use in a general HTML context. E.g. text content and text attributes. This method takes the UNION of allowed characters among all contexts, so may be more imprecise that the more specific contexts. Generally, this method is preferred unless you specifically understand the context in which untrusted data will be output. Example Usage: <div>${SecureFilter.forHtmlContent(unsafeData)}</div> <input value="${SecureFilter.forHtmlContent(unsafeData)}" /> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forHtmlInDoubleQuoteAttribute

**Signature:** `static forHtmlInDoubleQuoteAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an HTML Attribute guarded by a double quote. This method is preferred if you understand exactly how the output of this will be used in the HTML document. Example Usage: <div id="${SecureFilter.forHtmlInDoubleQuoteAttribute(unsafeData)}"></div> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forHtmlInSingleQuoteAttribute

**Signature:** `static forHtmlInSingleQuoteAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an HTML Attribute guarded by a single quote. This method is preferred if you understand exactly how the output of this will be used in the HTML document. Example Usage: <div id='${SecureFilter.forHtmlInSingleQuoteAttribute(unsafeData)}'></div> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filterd, if necessary

**Returns:**

a properly filtered string for the given input

---

### forHtmlUnquotedAttribute

**Signature:** `static forHtmlUnquotedAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an HTML Attribute left unguarded. This method is preferred if you understand exactly how the output of this will be used in the HTML document. Example Usage: <div id=${SecureFilter.forHtmlUnquotedAttribute(unsafeData)}></div> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forJavaScriptInAttribute

**Signature:** `static forJavaScriptInAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in JavaScript inside an HTML attribute. This method is preferred if you understand exactly how the output of the will be used in the page Example Usage: <button onclick="alert('${SecureFilter.forJavaScriptInAttribute(unsafeData)}');"> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forJavaScriptInBlock

**Signature:** `static forJavaScriptInBlock(input : String) : String`

**Description:** Filters illegal characters from a given input for use in JavaScript inside an HTML block. This method is preferred if you understand exactly how the output of the will be used in the page Example Usage: <script type="text/javascript"> var data = "${SecureFilter.forJavaScriptInBlock(unsafeData)}"; </script> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forJavaScriptInHTML

**Signature:** `static forJavaScriptInHTML(input : String) : String`

**Description:** Filters illegal characters from a given input for use in JavaScript inside an HTML context. This method takes the UNION of allowed characters among the other contexts, so may be more imprecise that the more specific contexts. Generally, this method is preferred unless you specifically understand the context in which untrusted data will be output. Example Usage: <script type="text/javascript"> var data = "${SecureFilter.forJavaScriptInHTML(unsafeData)}"; </script> <button onclick="alert('${SecureFilter.forJavaScriptInHTML(unsafeData)}');"> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forJavaScriptInSource

**Signature:** `static forJavaScriptInSource(input : String) : String`

**Description:** Filters illegal characters from a given input for use in JavaScript inside a JavaScript source file. This method is preferred if you understand exactly how the output of the will be used in the page Example Usage: <...inside foobar.js...> var data = "${SecureFilter.forJavaScriptInSource(unsafeData)}"; Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forJSONValue

**Signature:** `static forJSONValue(input : String) : String`

**Description:** Filters illegal characters from a given input for use in a JSON Object Value to prevent escaping into a trusted context. Example Usage: var json = {"trusted_data" : SecureFilter.forJSONValue(unsafeData)}; return JSON.stringify(json); Flow: Allow AlphaNumerics Remove all other characters

**Parameters:**

- `input`: ed input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forUriComponent

**Signature:** `static forUriComponent(input : String) : String`

**Description:** Filters illegal characters from a given input for use as a component of a URI. This is equivalent to javascript's filterURIComponent and does a realistic job of encoding. Example Usage: <a href="http://host.com?value=${SecureFilter.forUriComponent(unsafeData)}"/> Allows: A-Z, a-z, 0-9, -, _, ., ~, !, *, ', (, ) Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forUriComponentStrict

**Signature:** `static forUriComponentStrict(input : String) : String`

**Description:** Filters illegal characters from a given input for use as a component of a URI. This is a strict filter and fully complies with RFC3986. Example Usage: <a href="http://host.com?value=${SecureFilter.forUriComponentStrict(unsafeData)}"/> Allows: A-Z, a-z, 0-9, -, _, ., ~ Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forXmlCommentContent

**Signature:** `static forXmlCommentContent(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an XML comments. This method is preferred if you understand the context in which untrusted data will be output. Note: It is recommended that you use a real parser, as this method can be misused, but is left here if a parser is unavailable to you Example Usage: <!-- ${SecureFilter.forXmlCommentContent(unsafeData)} --> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forXmlContent

**Signature:** `static forXmlContent(input : String) : String`

**Description:** Filters illegal characters from a given input for use in a general XML context. E.g. text content and text attributes. This method takes the UNION of allowed characters between the other contexts, so may be more imprecise that the more specific contexts. Generally, this method is preferred unless you specifically understand the context in which untrusted data will be output. Note: It is recommended that you use a real parser, as this method can be misused, but is left here if a parser is unavailable to you Example Usage: <foo>${SecureFilter.forXmlContent(unsafeData)}</foo> <bar attr="${SecureFilter.forXmlContent(unsafeData)}"></bar> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forXmlInDoubleQuoteAttribute

**Signature:** `static forXmlInDoubleQuoteAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an XML attribute guarded by a double quote. This method is preferred if you understand the context in which untrusted data will be output. Note: It is recommended that you use a real parser, as this method can be misused, but is left here if a parser is unavailable to you Example Usage: <bar attr="${SecureFilter.forXmlInDoubleQuoteAttribute(unsafeData)}"></bar> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---

### forXmlInSingleQuoteAttribute

**Signature:** `static forXmlInSingleQuoteAttribute(input : String) : String`

**Description:** Filters illegal characters from a given input for use in an XML attribute guarded by a single quote. This method is preferred if you understand the context in which untrusted data will be output. Note: It is recommended that you use a real parser, as this method can be misused, but is left here if a parser is unavailable to you Example Usage: <bar attr='${SecureFilter.forXmlInSingleQuoteAttribute(unsafeData)}'></bar> Flow: Allow AlphaNumerics and some Special characters Remove all other characters

**Parameters:**

- `input`: untrusted input to be filtered, if necessary

**Returns:**

a properly filtered string for the given input

---