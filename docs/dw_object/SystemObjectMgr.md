## Package: dw.object

# Class SystemObjectMgr

## Inheritance Hierarchy

- Object
  - dw.object.SystemObjectMgr

## Description

Manager class which provides methods for querying of system objects with meta data using the Commerce Cloud Digital query language. See individual API methods for details on the query language. Note: Other manager classes such as CustomerMgr, ProductMgr, etc provide more specific and fine-grained querying methods that can not be achieved using the general query language. The following system object types are supported: GiftCertificate SourceCodeGroup Store ProductList Support for the following system object types is deprecated: Order Profile Use the search methods from CustomerMgr and OrderMgr, respectively for querying these types. To search for custom objects, use CustomObjectMgr. Note: this class allows access to sensitive information through operations that retrieve the Profile and Order objects. Pay attention to appropriate legal and regulatory requirements related to this data.

## Constructor Summary

## Method Summary

### describe

**Signature:** `static describe(type : String) : ObjectTypeDefinition`

Returns the object type definition for the given system object type.

### getAllSystemObjects

**Signature:** `static getAllSystemObjects(type : String) : SeekableIterator`

Returns all system objects of a specific type.

### querySystemObject

**Signature:** `static querySystemObject(type : String, queryString : String, args : Object...) : PersistentObject`

Searches for a single system object instance.

### querySystemObjects

**Signature:** `static querySystemObjects(type : String, queryString : String, sortString : String, args : Object...) : SeekableIterator`

Searches for system object instances.

### querySystemObjects

**Signature:** `static querySystemObjects(type : String, queryAttributes : Map, sortString : String) : SeekableIterator`

Searches for system object instances.

## Method Detail

## Method Details

### describe

**Signature:** `static describe(type : String) : ObjectTypeDefinition`

**Description:** Returns the object type definition for the given system object type. This method can be used for all system object types that are derived from ExtensibleObject.

**Parameters:**

- `type`: system object type whose type definition should be returned

**Returns:**

the matching object type definition or null in case no such type definition exists.

---

### getAllSystemObjects

**Signature:** `static getAllSystemObjects(type : String) : SeekableIterator`

**Description:** Returns all system objects of a specific type. The following system object types are supported: GiftCertificate Order Profile SourceCodeGroup Store ProductList The method throws an exception in case of another system type. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `type`: The name of the system object type. If a matching type definition cannot be found for the given type a MetaDataException will be thrown.

**Returns:**

SeekableIterator containing all system objects of a specific type.

**See Also:**

SeekableIterator.close()

---

### querySystemObject

**Signature:** `static querySystemObject(type : String, queryString : String, args : Object...) : PersistentObject`

**Description:** Searches for a single system object instance. The following system object types are supported: GiftCertificate Order Profile SourceCodeGroup Store ProductList The method throws an exception in case of another system type. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) If there is more than one object matching the specified query criteria, the result is not deterministic. In order to retrieve a single object from a sorted result set it is recommended to use the following code: querySystemObjects("", "custom.myAttr asc", null).first(). The method first() returns only the next element and closes the iterator. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being processed. This will enable the cleanup of system resources. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: For store objects, such a locale specific filtering can be: Get the store objects using this method with non-localized attributes query. Access the store.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the system object type for the query.
- `queryString`: the actual query.
- `args`: optional parameters for the queryString.

**Returns:**

the system object defined by type which was found when executing the queryString.

**See Also:**

SeekableIterator.close()

---

### querySystemObjects

**Signature:** `static querySystemObjects(type : String, queryString : String, sortString : String, args : Object...) : SeekableIterator`

**Description:** Searches for system object instances. The following system object types are supported: GiftCertificate Order Profile SourceCodeGroup Store ProductList The method throws an exception in case of another system type. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. Sometimes it is desired to get all instances of specified type with a special sorting condition. This can be easily done by providing the 'type' of the system object and the 'sortString' in combination with an empty 'queryString', e.g. querySystemObjects("sample", "", "ID asc") It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: For store objects, such a locale specific filtering can be: Get the store objects using this method with non-localized attributes query. Access the store.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the system object type for the query.
- `queryString`: the actual query.
- `sortString`: an optional sorting or null if no sorting is necessary.
- `args`: optional parameters for the queryString.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

---

### querySystemObjects

**Signature:** `static querySystemObjects(type : String, queryAttributes : Map, sortString : String) : SeekableIterator`

**Description:** Searches for system object instances. The following system object types are supported: GiftCertificate Order Profile SourceCodeGroup Store ProductList The method throws an exception in case of another system type. The search can be configured with a map, which key-value pairs are converted into a query expression. The key-value pairs are turned into a sequence of '=' or 'like' conditions, which are combined with AND statements. Example: A map with the key/value pairs: 'name'/'tom*', 'age'/66 will be converted as follows: "name like 'tom*' and age = 66" The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources. This method does not consider locale specific attributes. It returns all objects by checking the default non-localizable attributes. Any locale specific filtering after fetching the objects must be done by other custom code. Example: For store objects, such a locale specific filtering can be: Get the store objects using this method with non-localized attributes query. Access the store.getCustom("myattr"). It returns the localized value of the attribute.

**Parameters:**

- `type`: the system object type for the query.
- `queryAttributes`: key-value pairs, which define the query.
- `sortString`: an optional sorting or null if no sorting is necessary.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

---