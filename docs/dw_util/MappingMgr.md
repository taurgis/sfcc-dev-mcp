## Package: dw.util

# Class MappingMgr

## Inheritance Hierarchy

- Object
  - dw.util.MappingMgr

## Description

Used to manage and interface with mappings loaded into the system via the ImportKeyValueMapping job step. Class can be used to retrieve values for known keys, iterate over all keys known in a mapping or list all known mappings. Mappings are read into the system using the ImportKeyValueMapping job step. Generic mapping capability enables you to map keys to values, with the mapping stored in a high-performance data store that is independent of the database. This supports large datasets, with high performance for lookup. An example of using this feature is to map SKUs from a backend system to Commerce Cloud Digital SKUs on-the-fly in Digital script, so that interaction with the backend system is transparent and does not require adding Digital SKUs to the third party system.

## Properties

### mappingNames

**Type:** Collection (Read Only)

List all known mappings.

## Constructor Summary

## Method Summary

### get

**Signature:** `static get(mappingName : String, key : MappingKey) : Map`

Returns a map containing value(s) associated to the specified key for the specified mapping.

### getFirst

**Signature:** `static getFirst(mappingName : String, key : MappingKey) : String`

Gets the first string value of a mapping by name and key.

### getMappingNames

**Signature:** `static getMappingNames() : Collection`

List all known mappings.

### keyIterator

**Signature:** `static keyIterator(mappingName : String) : SeekableIterator`

Key iterator over known mapping keys by mapping name.

## Method Detail

## Method Details

### get

**Signature:** `static get(mappingName : String, key : MappingKey) : Map`

**Description:** Returns a map containing value(s) associated to the specified key for the specified mapping.

**Parameters:**

- `mappingName`: the mapping name
- `key`: the key

**Throws:**

IllegalArgumentException - if mappingName is unknown

---

### getFirst

**Signature:** `static getFirst(mappingName : String, key : MappingKey) : String`

**Description:** Gets the first string value of a mapping by name and key. Ordering is determined by the input CSV file. Throws an exception if mappingName does not exist.

**Parameters:**

- `mappingName`: the mapping name
- `key`: the key

**Returns:**

the value if a single value. The first value sequentially if a compound value.

**Throws:**

IllegalArgumentException - if mappingName is unknown

---

### getMappingNames

**Signature:** `static getMappingNames() : Collection`

**Description:** List all known mappings.

**Returns:**

the collection of mapping names

---

### keyIterator

**Signature:** `static keyIterator(mappingName : String) : SeekableIterator`

**Description:** Key iterator over known mapping keys by mapping name. Throws an exception if mappingName does not exist.

**Parameters:**

- `mappingName`: the mapping name

**Returns:**

the seekable iterator

**Throws:**

IllegalArgumentException - if mappingName is unknown

---