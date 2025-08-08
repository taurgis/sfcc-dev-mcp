## Package: TopLevel

# Class global

## Inheritance Hierarchy

- Object
  - global

## Description

The global object is a pre-defined object that serves as a placeholder for the global properties and functions of JavaScript. All other predefined objects, functions, and properties are accessible through the global object.

## Constants

## Properties

## Constructor Summary

## Method Summary

### decodeURI

**Signature:** `static decodeURI(uri : String) : String`

Unescapes characters in a URI component.

### decodeURIComponent

**Signature:** `static decodeURIComponent(uriComponent : String) : String`

Unescapes characters in a URI component.

### empty

**Signature:** `static empty(obj : Object) : boolean`

The method tests, whether the given object is empty.

### encodeURI

**Signature:** `static encodeURI(uri : String) : String`

Escapes characters in a URI.

### encodeURIComponent

**Signature:** `static encodeURIComponent(uriComponent : String) : String`

Escapes characters in a URI component.

### escape

**Signature:** `static escape(s : String) : String`

Encodes a String.

### eval

**Signature:** `static eval(code : String) : Object`

Execute JavaScript code from a String.

### importClass

**Signature:** `static importClass(classPath : Object) : void`

Import the specified class and make it available at the top level.

### importPackage

**Signature:** `static importPackage(packagePath : Object) : void`

Import all the classes in the specified package available at the top level.

### importScript

**Signature:** `static importScript(scriptPath : String) : void`

Imports all functions from the specified script.

### isFinite

**Signature:** `static isFinite(number : Number) : boolean`

Returns true if the specified Number is finite.

### isNaN

**Signature:** `static isNaN(object : Object) : boolean`

Test the specified value to determine if it is not a Number.

### isXMLName

**Signature:** `static isXMLName(name : String) : boolean`

Determines whether the specified string is a valid name for an XML element or attribute.

### parseFloat

**Signature:** `static parseFloat(s : String) : Number`

Parses a String into an float Number.

### parseInt

**Signature:** `static parseInt(s : String, radix : Number) : Number`

Parses a String into an integer Number using the specified radix.

### parseInt

**Signature:** `static parseInt(s : String) : Number`

Parses a String into an integer Number. This function is a short form for the call to parseInt(String, Number) with automatic determination of the radix.

### parseInt

**Signature:** `static parseInt(s : String) : Number`

Parses a String into an integer Number.

### require

**Signature:** `static require(path : String) : Module`

The require() function supports loading of modules in JavaScript.

### trace

**Signature:** `static trace(msg : String, params : Object...) : void`

Formats and prints the message using the specified params and returns the formatted message.

### unescape

**Signature:** `static unescape(string : String) : String`

Decode an escaped String.

## Method Detail

## Method Details

### decodeURI

**Signature:** `static decodeURI(uri : String) : String`

**Description:** Unescapes characters in a URI component.

**Parameters:**

- `uri`: a string that contains an encoded URI or other text to be decoded.

**Returns:**

A copy of uri with any hexadecimal escape sequences replaced with the characters they represent

---

### decodeURIComponent

**Signature:** `static decodeURIComponent(uriComponent : String) : String`

**Description:** Unescapes characters in a URI component.

**Parameters:**

- `uriComponent`: a string that contains an encoded URI component or other text to be decoded.

**Returns:**

A copy of uriComponent with any hexadecimal escape sequences replaced with the characters they represent

---

### empty

**Signature:** `static empty(obj : Object) : boolean`

**Description:** The method tests, whether the given object is empty. The interpretation of empty is the following. - null is always empty - undefined is always empty - a string with zero length is empty - an array with no elements is empty - a collection with no elements is empty

**Parameters:**

- `obj`: the object to be thested

**Returns:**

true if the object is interpreted as being empty

---

### encodeURI

**Signature:** `static encodeURI(uri : String) : String`

**Description:** Escapes characters in a URI.

**Parameters:**

- `uri`: a String that contains the URI or other text to be encoded.

**Returns:**

a copy of uri with certain characters replaced by hexadecimal escape sequences.

---

### encodeURIComponent

**Signature:** `static encodeURIComponent(uriComponent : String) : String`

**Description:** Escapes characters in a URI component.

**Parameters:**

- `uriComponent`: a String that contains a portion of a URI or other text to be encoded.

**Returns:**

a copy of uriComponent with certain characters replaced by hexadecimal escape sequences.

---

### escape

**Signature:** `static escape(s : String) : String`

**Description:** Encodes a String.

**Parameters:**

- `s`: the String to be encoded.

**Returns:**

a copy of s where characters have been replace by hexadecimal escape sequences.

---

### eval

**Signature:** `static eval(code : String) : Object`

**Description:** Execute JavaScript code from a String.

**Deprecated:**

The eval() function is deprecated, because it's potential security risk for server side code injection.

**Parameters:**

- `code`: a String that contains the JavaScript expression to be evaluated or the statements to be executed.

**Returns:**

the value of the executed call or null.

---

### importClass

**Signature:** `static importClass(classPath : Object) : void`

**Description:** Import the specified class and make it available at the top level. It's equivalent in effect to the Java import declaration.

**Parameters:**

- `classPath`: the fully qualified class path.

---

### importPackage

**Signature:** `static importPackage(packagePath : Object) : void`

**Description:** Import all the classes in the specified package available at the top level. It's equivalent in effect to the Java import declaration.

**Parameters:**

- `packagePath`: the fully qualified package path.

---

### importScript

**Signature:** `static importScript(scriptPath : String) : void`

**Description:** Imports all functions from the specified script. Variables are not imported from the script and must be accessed through helper functions. The script path has the following syntax: [cartridgename:]scriptname, where cartridgename identifies a cartridge where the script file is located. If cartridgename is omitted the script file is loaded from the same cartridge in which the importing component is located. Examples: importScript( 'example.ds' ) imports the script file example.ds from the same cartridge importScript( 'abc:example.ds' ) imports the script file example.ds from the cartridge 'abc'

**Parameters:**

- `scriptPath`: the path to the script.

---

### isFinite

**Signature:** `static isFinite(number : Number) : boolean`

**Description:** Returns true if the specified Number is finite.

**Parameters:**

- `number`: the Number to test.

**Returns:**

true if the specified Number is finite, false otherwise.

---

### isNaN

**Signature:** `static isNaN(object : Object) : boolean`

**Description:** Test the specified value to determine if it is not a Number.

**Parameters:**

- `object`: the Object to be tested as a number

**Returns:**

True if the object is not a number

---

### isXMLName

**Signature:** `static isXMLName(name : String) : boolean`

**Description:** Determines whether the specified string is a valid name for an XML element or attribute.

**Parameters:**

- `name`: the String specified

**Returns:**

True if the string is a valid name

---

### parseFloat

**Signature:** `static parseFloat(s : String) : Number`

**Description:** Parses a String into an float Number.

**Parameters:**

- `s`: the String to parse.

**Returns:**

Returns the float as a Number.

---

### parseInt

**Signature:** `static parseInt(s : String, radix : Number) : Number`

**Description:** Parses a String into an integer Number using the specified radix.

**Parameters:**

- `s`: the String to parse.
- `radix`: the radix to use.

**Returns:**

Returns the integer as a Number.

---

### parseInt

**Signature:** `static parseInt(s : String) : Number`

**Description:** Parses a String into an integer Number. This function is a short form for the call to parseInt(String, Number) with automatic determination of the radix. If the string starts with "0x" or "0X" then the radix is 16. If the string starts with "0" the the radix is 8. In all other cases the radix is 10.

**API Versioned:**

No longer available as of version 16.1.

**Parameters:**

- `s`: the String to parse.

**Returns:**

Returns the integer as a Number.

---

### parseInt

**Signature:** `static parseInt(s : String) : Number`

**Description:** Parses a String into an integer Number. This function is a short form for the call to parseInt(String, Number) with automatic determination of the radix. If the string starts with "0x" or "0X" then the radix is 16. In all other cases the radix is 10.

**API Versioned:**

From version 16.1. ECMAScript 5 compliance: removed support for octal numbers.

**Parameters:**

- `s`: the String to parse.

**Returns:**

Returns the integer as a Number.

---

### require

**Signature:** `static require(path : String) : Module`

**Description:** The require() function supports loading of modules in JavaScript. The function works similar to the require() function in CommonJS. The general module loading works the same way, but the exact path lookup is slightly different and better fits into Demandware concepts. Here are the details for the lookup: If the module name starts with "./" or "../" then load it relative to the current module. The module can be a file or a directory. A file extension is acknowledged, but not required. If it's a directory a 'package.json' or a 'main' file is expected. If the 'package.json' does not contain a main entry, then default to main file in the directory. Access to parent files can't go beyond the cartridges directory. Access to other cartridges is explicitly allowed. If the module name starts with "~/" it's a path relative to the current cartridge. If the module name starts with "*/" try to find the module in all cartridges that are assigned to the current site. A module with the name "dw" or which starts with "dw/" references Demandware built-in functions and classes. For example var u = require( 'dw/util' ); loads the classes in the util package, which can be then used like var h = new u.HashMap(); A module, which doesn't start with "./" or "../" is resolved as top level module. The module name is used to find a folder in the top cartridge directory, typically a cartridge itself, but it can also be a simple folder. If nothing is found, the module name is used to look into a special folder called "modules" in the top cartridge directory. That folder can be used by a developer to manage different modules. For example a developer could drop a module like "less.js" just into that folder. If the require function is used to reference a file then an optional file extension is used to determine the content of the file. Currently supported are the extensions ordered by priority: js - JavaScript file ds - Demandware Script file json - JSON file

**Parameters:**

- `path`: the path to the JavaScript module.

**Returns:**

an object with the exported functions and properties.

---

### trace

**Signature:** `static trace(msg : String, params : Object...) : void`

**Description:** Formats and prints the message using the specified params and returns the formatted message. The format message is a Java MessageFormat expression. Printing happens in the script log output.

**Parameters:**

- `msg`: the message to format.
- `params`: one, or multiple parameters that are used to format the message.

---

### unescape

**Signature:** `static unescape(string : String) : String`

**Description:** Decode an escaped String.

**Parameters:**

- `string`: the String to decode.

**Returns:**

a copy of the String where hexadecimal character sequences are replace by Unicode characters.

---