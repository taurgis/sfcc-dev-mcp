## Package: dw.object

# Class CustomObjectMgr

## Inheritance Hierarchy

- Object
  - dw.object.CustomObjectMgr

## Description

Manager class which provides methods for creating, retrieving, deleting, and searching for custom objects. To search for system objects, use SystemObjectMgr.

## Constructor Summary

## Method Summary

### createCustomObject

**Signature:** `static createCustomObject(type : String, keyValue : String) : CustomObject`

Returns a new custom object instance of the specified type, using the given key value.

### createCustomObject

**Signature:** `static createCustomObject(type : String, keyValue : Number) : CustomObject`

Returns a new custom object instance of the specified type, using the given key value.

### describe

**Signature:** `static describe(type : String) : ObjectTypeDefinition`

Returns the meta data for the given type.

### getAllCustomObjects

**Signature:** `static getAllCustomObjects(type : String) : SeekableIterator`

Returns all custom objects of a specific type.

### getCustomObject

**Signature:** `static getCustomObject(type : String, keyValue : String) : CustomObject`

Returns a custom object based on it's type and unique key.

### getCustomObject

**Signature:** `static getCustomObject(type : String, keyValue : Number) : CustomObject`

Returns a custom object based on it's type and unique key.

### queryCustomObject

**Signature:** `static queryCustomObject(type : String, queryString : String, args : Object...) : CustomObject`

Searches for a single custom object instance.

### queryCustomObjects

**Signature:** `static queryCustomObjects(type : String, queryString : String, sortString : String, args : Object...) : SeekableIterator`

Searches for custom object instances.

### queryCustomObjects

**Signature:** `static queryCustomObjects(type : String, queryAttributes : Map, sortString : String) : SeekableIterator`

Searches for custom object instances.

### remove

**Signature:** `static remove(object : CustomObject) : void`

Removes a given custom object.

## Method Detail

## Method Details

### createCustomObject

**Signature:** `static createCustomObject(type : String, keyValue : String) : CustomObject`

**Description:** Returns a new custom object instance of the specified type, using the given key value. Custom object keys need to be unique for custom object type.

**Parameters:**

- `type`: The unique name of the custom object type.
- `keyValue`: The unique key value for the instance.

**Returns:**

The newly created custom object instance.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### createCustomObject

**Signature:** `static createCustomObject(type : String, keyValue : Number) : CustomObject`

**Description:** Returns a new custom object instance of the specified type, using the given key value. Custom object keys need to be unique for custom object type.

**Parameters:**

- `type`: The unique name of the custom object type.
- `keyValue`: The unique key value for the instance.

**Returns:**

The newly created custom object instance.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### describe

**Signature:** `static describe(type : String) : ObjectTypeDefinition`

**Description:** Returns the meta data for the given type.

**Parameters:**

- `type`: the type whose meta data is returned.

**Returns:**

the meta data for the given type.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### getAllCustomObjects

**Signature:** `static getAllCustomObjects(type : String) : SeekableIterator`

**Description:** Returns all custom objects of a specific type. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `type`: The name of the custom object type.

**See Also:**

SeekableIterator.close()

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### getCustomObject

**Signature:** `static getCustomObject(type : String, keyValue : String) : CustomObject`

**Description:** Returns a custom object based on it's type and unique key.

**Parameters:**

- `type`: The name of the custom object type.
- `keyValue`: The unique key value.

**Returns:**

The matching custom object instance or null in case no matching custom object instance could be found.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### getCustomObject

**Signature:** `static getCustomObject(type : String, keyValue : Number) : CustomObject`

**Description:** Returns a custom object based on it's type and unique key.

**Parameters:**

- `type`: The name of the custom object type.
- `keyValue`: The unique key value.

**Returns:**

The matching custom object instance or null in case no matching custom object instance could be found.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### queryCustomObject

**Signature:** `static queryCustomObject(type : String, queryString : String, args : Object...) : CustomObject`

**Description:** Searches for a single custom object instance. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Case-independent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) If there is more than one object matching the specified query criteria, the result is not deterministic. In order to retrieve a single object from a sorted result set it is recommended to use the following code: queryCustomObjects("", "custom.myAttr asc", null).first(). The method first() returns only the next element and closes the iterator. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: Get the custom objects using this method with non-localized attributes query. Access the obj.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the custom object type for the query.
- `queryString`: the actual query.
- `args`: optional parameters for the queryString.

**Returns:**

the custom object defined by type which was found when executing the queryString.

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### queryCustomObjects

**Signature:** `static queryCustomObjects(type : String, queryString : String, sortString : String, args : Object...) : SeekableIterator`

**Description:** Searches for custom object instances. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. Sometimes it is desired to get all instances of specified type with a special sorting condition. This can be easily done by providing the 'type' of the custom object and the 'sortString' in combination with an empty 'queryString', e.g. queryCustomObjects("sample", "", "custom.myAttr asc") It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: Get the custom objects using this method with non-localized attributes query. Access the obj.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the custom object type for the query.
- `queryString`: the actual query.
- `sortString`: an optional sorting or null if no sorting is necessary.
- `args`: optional parameters for the queryString.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### queryCustomObjects

**Signature:** `static queryCustomObjects(type : String, queryAttributes : Map, sortString : String) : SeekableIterator`

**Description:** Searches for custom object instances. The search can be configured with a map, which key-value pairs are converted into a query expression. The key-value pairs are turned into a sequence of '=' or 'like' conditions, which are combined with AND statements. Example: A map with the key/value pairs: 'name'/'tom*', 'age'/66 will be converted as follows: "name like 'tom*' and age = 66" The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: Get the custom objects using this method with non-localized attributes query. Access the obj.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the custom object type for the query.
- `queryAttributes`: key-value pairs, which define the query.
- `sortString`: an optional sorting or null if no sorting is necessary.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

**Throws:**

IllegalArgumentException - if the given type is invalid

---

### remove

**Signature:** `static remove(object : CustomObject) : void`

**Description:** Removes a given custom object.

**Parameters:**

- `object`: the custom object to remove, must not be null.

---