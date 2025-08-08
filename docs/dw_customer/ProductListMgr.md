## Package: dw.customer

# Class ProductListMgr

## Inheritance Hierarchy

- Object
  - dw.customer.ProductListMgr

## Description

ProductListMgr provides methods for retrieving, creating, searching for, and removing product lists.

## Constructor Summary

## Method Summary

### createProductList

**Signature:** `static createProductList(customer : Customer, type : Number) : ProductList`

Creates a new instance of a product list, of the specified type.

### getProductList

**Signature:** `static getProductList(ID : String) : ProductList`

Gets the product list by its ID.

### getProductList

**Signature:** `static getProductList(profile : Profile, type : Number) : ProductList`

Returns the first product list belonging to the customer with the specified profile.

### getProductLists

**Signature:** `static getProductLists(customer : Customer, type : Number) : Collection`

Retrieve all product lists of the specified type owned by the specified customer.

### getProductLists

**Signature:** `static getProductLists(customer : Customer, type : Number, eventType : String) : Collection`

Retrieve all the product lists of the specified type and event type belonging to the specified customer.

### getProductLists

**Signature:** `static getProductLists(customerAddress : CustomerAddress) : Collection`

Returns the collection of product lists that have the specified address as the shipping address.

### queryProductLists

**Signature:** `static queryProductLists(queryAttributes : Map, sortString : String) : SeekableIterator`

Searches for product list instances.

### queryProductLists

**Signature:** `static queryProductLists(queryString : String, sortString : String, args : Object...) : SeekableIterator`

Searches for product list instances.

### removeProductList

**Signature:** `static removeProductList(productList : ProductList) : void`

Removes the specified product list from the system.

## Method Detail

## Method Details

### createProductList

**Signature:** `static createProductList(customer : Customer, type : Number) : ProductList`

**Description:** Creates a new instance of a product list, of the specified type.

**Parameters:**

- `customer`: The customer owning the product list, must not be null.
- `type`: The type of list (e.g. wish list, gift registry). The types are defined as constants within ProductList.

**Returns:**

the new list instance.

---

### getProductList

**Signature:** `static getProductList(ID : String) : ProductList`

**Description:** Gets the product list by its ID.

**Parameters:**

- `ID`: The product list ID.

**Returns:**

the ProductList instance, or null if a list with the specified UUID doesn't exist.

---

### getProductList

**Signature:** `static getProductList(profile : Profile, type : Number) : ProductList`

**Description:** Returns the first product list belonging to the customer with the specified profile.

**Deprecated:**

Use getProductLists(Customer, Number) or getProductLists(Customer, Number, String) instead.

**Parameters:**

- `profile`: The profile of the customer whose product list is to be retrieved.
- `type`: The type of list (e.g. wish list, gift registry). The types are defined as constants within ProductList.

**Returns:**

the product list, or null if none exists.

---

### getProductLists

**Signature:** `static getProductLists(customer : Customer, type : Number) : Collection`

**Description:** Retrieve all product lists of the specified type owned by the specified customer.

**Parameters:**

- `customer`: The customer used for the query, must not be null.
- `type`: The type of list used for the query. The types are defined as constants within ProductList.

**Returns:**

the unsorted collection of ProductList instances of the specified type belonging to the specified customer.

---

### getProductLists

**Signature:** `static getProductLists(customer : Customer, type : Number, eventType : String) : Collection`

**Description:** Retrieve all the product lists of the specified type and event type belonging to the specified customer.

**Parameters:**

- `customer`: The customer used for the query, must not be null.
- `type`: The type of list used for the query. The types are defined as constants within ProductList.
- `eventType`: The event type used for the query, must not be null.

**Returns:**

the unsorted collection of ProductList instances of the specified type and event type belonging to the specified customer.

---

### getProductLists

**Signature:** `static getProductLists(customerAddress : CustomerAddress) : Collection`

**Description:** Returns the collection of product lists that have the specified address as the shipping address.

**Parameters:**

- `customerAddress`: the address to test, must not be null.

**Returns:**

the unsorted collection of ProductList instances using this address.

---

### queryProductLists

**Signature:** `static queryProductLists(queryAttributes : Map, sortString : String) : SeekableIterator`

**Description:** Searches for product list instances. The search can be configured with a map, which key-value pairs are converted into a query expression. The key-value pairs are turned into a sequence of '=' or 'like' conditions, which are combined with AND statements. Example: A map with the key/value pairs: 'name'/'tom*', 'age'/66 will be converted as follows: "name like 'tom*' and age = 66" The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `queryAttributes`: key-value pairs, which define the query.
- `sortString`: an optional sorting or null if no sorting is necessary.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

---

### queryProductLists

**Signature:** `static queryProductLists(queryString : String, sortString : String, args : Object...) : SeekableIterator`

**Description:** Searches for product list instances. The search can be configured using a simple query language, which provides most common filter and operator functionality. The identifier for an attribute to use in a query condition is always the ID of the attribute as defined in the type definition. For custom defined attributes the prefix custom is required in the search term (e.g. custom.color = {1}), while for system attributes no prefix is used (e.g. name = {4}). Supported attribute value types with sample expression values: String 'String', 'Str*', 'Strin?' Integer 1, 3E4 Number 1.0, 3.99E5 Date yyyy-MM-dd e.g. 2007-05-31 (Default TimeZone = UTC) DateTime yyyy-MM-dd'T'hh:mm:ss+Z e.g. 2007-05-31T00:00+Z (Z TimeZone = UTC) or 2007-05-31T00:00:00 Boolean true, false Email 'search@demandware.com', '*@demandware.com' Set of String 'String', 'Str*', 'Strin?' Set of Integer 1, 3E4 Set of Number 1.0, 3.99E5 Enum of String 'String', 'Str*', 'Strin?' Enum of Integer 1, 3E4 The following types of attributes are not queryable: Image HTML Text Quantity Password Note, that some system attributes are not queryable by default regardless of the actual value type code. The following operators are supported in a condition: = Equals - All types; supports NULL value (thumbnail = NULL) != Not equals - All types; supports NULL value (thumbnail != NULL) < Less than - Integer, Number and Date types only > Greater than - Integer, Number and Date types only <= Less or equals than - Integer, Number and Date types only >= Greater or equals than - Integer, Number and Date types only LIKE Like - String types and Email only; use if leading or trailing wildcards will be used to support substring search(custom.country LIKE 'US*') ILIKE Caseindependent Like - String types and Email only, use to support case insensitive query (custom.country ILIKE 'usa'), does also support wildcards for substring matching Conditions can be combined using logical expressions 'AND', 'OR' and 'NOT' and nested using parenthesis e.g. gender = {1} AND (age >= {2} OR (NOT profession LIKE {3})). The query language provides a placeholder syntax to pass objects as additional search parameters. Each passed object is related to a placeholder in the query string. The placeholder must be an Integer that is surrounded by braces. The first Integer value must be '0', the second '1' and so on, e.g. querySystemObjects("sample", "age = {0} or creationDate >= {1}", 18, date) The sorting parameter is optional and may contain a comma separated list of attribute names to sort by. Each sort attribute name may be followed by an optional sort direction specifier ('asc' | 'desc'). Default sorting directions is ascending, if no direction was specified. Example: age desc, name Please note that specifying a localized custom attribute as the sorting attribute is currently not supported. Sometimes it is desired to get all instances with a special sorting condition. This can be easily done by providing the 'sortString' in combination with an empty 'queryString', e.g. querySystemObjects("sample", "", "ID asc") It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `queryString`: the actual query.
- `sortString`: an optional sorting or null if no sorting is necessary.
- `args`: optional parameters for the queryString.

**Returns:**

SeekableIterator containing the result set of the query.

**See Also:**

SeekableIterator.close()

---

### removeProductList

**Signature:** `static removeProductList(productList : ProductList) : void`

**Description:** Removes the specified product list from the system.

**Parameters:**

- `productList`: The list to remove, must not be null.

---